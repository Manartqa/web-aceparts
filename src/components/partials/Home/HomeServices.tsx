import Image from "next/image";
import Link from "next/link";
import { SectionHeading, ServiceCard } from "@/components/common";
import { services } from "@/content";

export default function HomeServices() {
  return (
    <section className="relative isolate overflow-hidden py-24 lg:py-32">
      <Image src="/images/bg/services.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-brand-deep/90" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="To keep your journey on track" title="Quality maintenance services" light />
          <Link
            href={services[0].href}
            className="rounded-full border border-white/40 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-brand"
          >
            All services
          </Link>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.href}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
