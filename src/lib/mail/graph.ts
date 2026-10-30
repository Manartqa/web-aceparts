import "server-only";

// Sends mail through Microsoft Graph sendMail with an Entra ID app-only token
// (client credentials). The App Registration needs the Mail.Send application
// permission. SMTP with a password is not used: tenants with Security Defaults
// block Basic Auth.

export interface Mail {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}

const env = (name: string) => process.env[name]?.trim() ?? "";

export function readMailConfig() {
  const config = {
    tenantId: env("MS_TENANT_ID"),
    clientId: env("MS_CLIENT_ID"),
    clientSecret: env("MS_CLIENT_SECRET"),
    sender: env("MAIL_SENDER"),
    to: env("CONTACT_MAIL_TO").split(",").map((s) => s.trim()).filter(Boolean),
  };
  const missing = [
    ["MS_TENANT_ID", config.tenantId],
    ["MS_CLIENT_ID", config.clientId],
    ["MS_CLIENT_SECRET", config.clientSecret],
    ["MAIL_SENDER", config.sender],
    ["CONTACT_MAIL_TO", config.to.length ? "ok" : ""],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  return { config, missing };
}

type MailConfig = ReturnType<typeof readMailConfig>["config"];

let token: { value: string; expiresAt: number } | undefined;

async function getAccessToken(config: MailConfig): Promise<string> {
  // Reuse until a minute before expiry.
  if (token && token.expiresAt > Date.now() + 60_000) return token.value;

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    },
  );
  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token) {
    throw new Error(`Entra token request failed (${response.status}): ${payload.error_description ?? "unknown error"}`);
  }

  token = { value: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000 };
  return token.value;
}

export async function sendMail(config: MailConfig, mail: Mail): Promise<void> {
  const accessToken = await getAccessToken(config);
  const recipients = (addresses: string[]) => addresses.map((address) => ({ emailAddress: { address } }));

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.sender)}/sendMail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: {
          subject: mail.subject,
          body: { contentType: "HTML", content: mail.html },
          toRecipients: recipients(mail.to),
          // Reply goes to the visitor; the sender stays the mailbox so SPF/DMARC pass.
          replyTo: mail.replyTo ? recipients([mail.replyTo]) : undefined,
        },
        saveToSentItems: false,
      }),
      cache: "no-store",
    },
  );

  // 202 Accepted is success; sendMail returns no body.
  if (response.status === 202) return;
  const detail = await response.text().catch(() => "");
  throw new Error(`Graph sendMail failed (${response.status}): ${detail.slice(0, 300)}`);
}
