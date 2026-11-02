import "server-only";
import { createSign } from "node:crypto";

// Sends mail through the Gmail API as a Google Workspace user. A service account
// with domain-wide delegation for the gmail.send scope only signs in as
// MAIL_SENDER, so no mailbox password is stored and the app can only send.
// Gmail keeps a copy in the sender's Sent folder; the API has no way to skip it.

export interface Mail {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}

const SCOPE = "https://www.googleapis.com/auth/gmail.send";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const env = (name: string) => process.env[name]?.trim() ?? "";

export function readMailConfig() {
  const config = {
    clientEmail: env("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    // An env file for `docker run --env-file` can't hold a multi-line value, so the
    // key may arrive with literal "\n" in place of line breaks.
    privateKey: env("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    sender: env("MAIL_SENDER"),
    to: env("CONTACT_MAIL_TO").split(",").map((s) => s.trim()).filter(Boolean),
  };
  const missing = [
    ["GOOGLE_SERVICE_ACCOUNT_EMAIL", config.clientEmail],
    ["GOOGLE_PRIVATE_KEY", config.privateKey],
    ["MAIL_SENDER", config.sender],
    ["CONTACT_MAIL_TO", config.to.length ? "ok" : ""],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  return { config, missing };
}

type MailConfig = ReturnType<typeof readMailConfig>["config"];

let token: { value: string; expiresAt: number } | undefined;

const base64url = (value: string) => Buffer.from(value).toString("base64url");

async function getAccessToken(config: MailConfig): Promise<string> {
  // Reuse until a minute before expiry.
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;

  // Service account JWT, signed with its private key; `sub` is the user to act as.
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(
    JSON.stringify({ iss: config.clientEmail, sub: config.sender, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  )}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(config.privateKey, "base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token) {
    throw new Error(
      `Google token request failed (${response.status}): ${payload.error_description ?? payload.error ?? "unknown error"}`,
    );
  }

  token = { value: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 };
  return token.value;
}

// A header line. Visitor input reaches the subject and Reply-To, so a line break
// would let it add headers of its own.
function header(name: string, value: string): string {
  if (/[\r\n]/.test(value)) throw new Error(`Line break in the ${name} header`);
  return `${name}: ${value}`;
}

// RFC 2047 encoded-word, so a subject in Thai or with any non-ASCII text survives.
const encodeWord = (value: string) =>
  /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${Buffer.from(value).toString("base64")}?=`;

export async function sendMail(config: MailConfig, mail: Mail): Promise<void> {
  const accessToken = await getAccessToken(config);

  const message = [
    header("From", config.sender),
    header("To", mail.to.join(", ")),
    ...(mail.replyTo ? [header("Reply-To", mail.replyTo)] : []),
    header("Subject", encodeWord(mail.subject)),
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(mail.html).toString("base64").replace(/.{76}/g, "$&\r\n"),
  ].join("\r\n");

  // `me` is MAIL_SENDER, the user the token was issued for.
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: base64url(message) }),
    cache: "no-store",
  });

  if (response.ok) return;
  const detail = await response.text().catch(() => "");
  throw new Error(`Gmail send failed (${response.status}): ${detail.slice(0, 300)}`);
}
