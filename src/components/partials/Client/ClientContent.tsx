import Image from "next/image";
import { CtaBanner, PageHero, PartnersSection, SectionHeading } from "@/components/common";
import { clientPage } from "@/content";

export default function ClientContent() {
  return (
    <>
      <PageHero title="Our Client" eyebrow={clientPage.tagline} breadcrumbs={[{ label: "Our Client" }]} />

      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-brand/20">
            <Image src={clientPage.image} alt="State Railway of Thailand train" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div>
            <SectionHeading eyebrow={clientPage.eyebrow} title={clientPage.title} />
            <p className="mt-8 text-lg leading-relaxed">{clientPage.body}</p>
          </div>
        </div>
      </section>

      <div className="bg-brand-soft/60">
        <PartnersSection />
      </div>

      <div className="pt-24">
        <CtaBanner />
      </div>
    </>
  );
}
