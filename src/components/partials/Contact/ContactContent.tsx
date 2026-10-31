import { ContactList, PageHero, SectionHeading } from "@/components/common";
import { contactPage } from "@/content";
import ContactForm from "./ContactForm";

const mapQuery = encodeURIComponent(contactPage.mapQuery);

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

          <ContactForm title={contactPage.formTitle} />
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl shadow-xl shadow-brand/10 ring-1 ring-brand/10">
          {/* Keyless Google Maps embed; lazy so it doesn't slow the page above it. */}
          <iframe
            title="A.C.E. Parts Co., Ltd. office on Google Maps"
            src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[420px] w-full border-0"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4">
            <p className="text-sm">{contactPage.mapQuery}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-brand px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-brand-deep"
            >
              Get directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
