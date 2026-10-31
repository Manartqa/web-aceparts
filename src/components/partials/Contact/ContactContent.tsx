import { ContactList, PageHero, SectionHeading } from "@/components/common";
import { company, contactPage } from "@/content";
import ContactForm from "./ContactForm";

export default function ContactContent() {
  const { map } = contactPage;

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

      <section className="bg-brand-soft/60 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow={map.eyebrow} title={map.title} />

          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand/10">
              {/* Keyless Google Maps embed; lazy so it doesn't slow the page above it. */}
              <iframe
                title={`${company.name} on Google Maps`}
                src={map.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[360px] w-full border-0 lg:h-full lg:min-h-[360px]"
              />
            </div>

            <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand/10">
              <h3 className="font-display text-lg font-bold text-brand">{company.name}</h3>
              <div className="mt-6">
                <ContactList tone="dark" items={["address", "phone"]} />
              </div>
              <a
                href={map.link}
                target="_blank"
                rel="noopener"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-brand px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-brand transition hover:bg-brand hover:text-white lg:mt-auto"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                  <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14" />
                </svg>
                Get directions on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
