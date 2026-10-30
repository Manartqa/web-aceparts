"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact } from "@/app/contact-us/actions";
import type { ContactField, ContactState } from "@/lib/contact";

interface ContactFormProps {
  title: string;
}

const fields = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name", wide: false },
  { name: "email", label: "Your email", type: "email", autoComplete: "email", wide: false },
  { name: "subject", label: "Subject", type: "text", autoComplete: "off", wide: true },
] as const;

const inputClass =
  "mt-2 block w-full rounded-xl border bg-white px-4 py-3 font-normal text-ink outline-none transition focus:ring-4";

const initialState: ContactState = { status: "idle" };

export default function ContactForm({ title }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const startedAt = useRef<HTMLInputElement>(null);

  // Records when the visitor started, for the server's minimum-fill-time check.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  const notice =
    state.status === "success"
      ? "Thank you. Your message has been sent and we will reply within 24 hours on business days."
      : state.message;
  const error = (field: ContactField) => state.errors?.[field];
  const inputProps = (field: ContactField) => ({
    name: field,
    defaultValue: state.values?.[field],
    "aria-invalid": error(field) ? true : undefined,
    "aria-describedby": error(field) ? `${field}-error` : undefined,
    className: `${inputClass} ${
      error(field) ? "border-red-400 focus:ring-red-100" : "border-brand/15 focus:border-brand focus:ring-brand/10"
    }`,
  });

  return (
    <form action={formAction} noValidate className="rounded-3xl bg-white p-6 shadow-xl shadow-brand/10 ring-1 ring-brand/10 sm:p-10">
      <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>

      {notice && (
        <p
          role="status"
          className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold ${
            state.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {notice}
        </p>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={`text-sm font-semibold text-ink ${field.wide ? "sm:col-span-2" : ""}`}>
            {field.label}
            <input type={field.type} autoComplete={field.autoComplete} required {...inputProps(field.name)} />
            <FieldError field={field.name} message={error(field.name)} />
          </label>
        ))}
        <label className="text-sm font-semibold text-ink sm:col-span-2">
          Your message <span className="font-normal text-muted">(optional)</span>
          <textarea rows={5} {...inputProps("message")} />
          <FieldError field="message" message={error("message")} />
        </label>
      </div>

      {/* Anti-spam: hidden from people, filled in by bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedAt} name="startedAt" type="hidden" />

      <button
        type="submit"
        disabled={pending}
        className="mt-8 rounded-full bg-brand px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-brand-deep disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function FieldError({ field, message }: { field: ContactField; message?: string }) {
  if (!message) return null;
  return (
    <span id={`${field}-error`} className="mt-1.5 block text-xs font-medium text-red-600">
      {message}
    </span>
  );
}
