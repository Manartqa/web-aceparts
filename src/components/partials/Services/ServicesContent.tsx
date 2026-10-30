import Image from "next/image";
import { CtaBanner, PageHero, SectionHeading, ServiceCard } from "@/components/common";
import { services, servicesPage } from "@/content";

export default function ServicesContent() {
  return (
    <>
      <PageHero
        title="Our Services"
        eyebrow={servicesPage.eyebrow}
        image={servicesPage.headerImage}
        breadcrumbs={[{ label: "Services" }]}
      />

      <section className="relative isolate overflow-hidden py-24 lg:py-32">
        <Image src="/images/bg/services.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-brand-deep/90" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="To keep your journey on track" title={servicesPage.title} light />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">{servicesPage.intro}</p>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-24">
        <CtaBanner />
      </div>
    </>
  );
}
