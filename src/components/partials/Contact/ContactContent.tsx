import { ContactList, PageHero, SectionHeading } from "@/components/common";
import { contactPage } from "@/content";

const fields = [
  { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Your email", type: "email", required: true, autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text", required: true, autoComplete: "off" },
] as const;

const inputClass =
  "mt-2 block w-full rounded-xl border border-brand/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

export default function ContactContent() {
  return (
    <>
      <PageHero title={contactPage.title} eyebrow={contactPage.eyebrow} breadcrumbs={[{ label: "Contact Us" }]} />

      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading eyebrow={contactPage.detailsEyebrow} title={contactPage.detailsTitle} />
            <p className="mt-6 text-lg leading-relaxed">{contactPage.detailsText}</p>
            <div className="mt-8 rounded-3xl bg-brand-soft/60 p-6 text-base">
              <ContactList tone="dark" />
            </div>
          </div>

          {/* Visual only: submission (Server Action, email, spam protection) comes in Phase 4. */}
          <form className="rounded-3xl bg-white p-6 shadow-xl shadow-brand/10 ring-1 ring-brand/10 sm:p-10">
            <h2 className="font-display text-3xl font-bold text-ink">{contactPage.formTitle}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={`text-sm font-semibold text-ink ${field.name === "subject" ? "sm:col-span-2" : ""}`}>
                  {field.label}
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    autoComplete={field.autoComplete}
                    className={inputClass}
                  />
                </label>
              ))}
              <label className="text-sm font-semibold text-ink sm:col-span-2">
                Your message <span className="font-normal text-muted">(optional)</span>
                <textarea name="message" rows={5} className={inputClass} />
              </label>
            </div>
            <button
              type="submit"
              disabled
              className="mt-8 rounded-full bg-brand px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition enabled:hover:-translate-y-0.5 enabled:hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
