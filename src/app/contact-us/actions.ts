"use server";

import { headers } from "next/headers";
import { company } from "@/content";
import { validateContact, type ContactState, type ContactValues } from "@/lib/contact";
import { readMailConfig, sendMail } from "@/lib/mail/gmail";

// Anti-spam: a hidden honeypot field and a per-IP rate limit. The rate limit is
// in memory, so it resets on restart and is per instance; good enough for a
// low-traffic contact form.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60_000;
const recent = new Map<string, number[]>();

const unavailable = `Sorry, your message could not be sent. Please email ${company.email} or call ${company.phone}.`;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const values: ContactValues = {
    name: field("name"),
    email: field("email"),
    subject: field("subject"),
    message: field("message"),
  };

  // Bots fill the hidden field; pretend it worked. Logged, since browser autofill
  // can fill it too and the visitor then sees "Thank you" for a dropped message.
  if (field("hp")) {
    console.warn("Contact form: dropped as spam, hidden field was filled");
    return { status: "success" };
  }

  const errors = validateContact(values);
  if (errors) return { status: "error", message: "Please check the highlighted fields.", errors, values };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many messages. Please try again in a few minutes.", values };
  }

  const { config, missing } = readMailConfig();
  if (missing.length) {
    console.error(`Contact form is not configured; missing: ${missing.join(", ")}`);
    return { status: "error", message: unavailable, values };
  }

  const rows = [
    ["Name", values.name],
    ["Email", values.email],
    ["Subject", values.subject],
    ["Message", values.message || "(no message)"],
  ]
    .map(([label, value]) => `<tr><th align="left" valign="top" style="padding:4px 12px 4px 0">${label}</th><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join("");

  try {
    await sendMail(config, {
      to: config.to,
      subject: `[Website] ${values.subject} (${values.name})`,
      html: `<p>New enquiry from the ${escapeHtml(company.name)} website contact form.</p><table>${rows}</table>`,
      replyTo: values.email,
    });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return { status: "error", message: unavailable, values };
  }

  return { status: "success" };
}
