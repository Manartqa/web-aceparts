import { ContactList, PageHero, SectionHeading } from "@/components/common";
import { contactPage } from "@/content";
import ContactForm from "./ContactForm";

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
    </>
  );
}
