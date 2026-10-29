import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common";
import { services } from "@/content/site";

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
              <Link
                href={service.href}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-white/10"
              >
                <span className="grid size-16 place-items-center rounded-2xl bg-accent/15 ring-1 ring-accent/30 transition group-hover:bg-accent">
                  <Image src={service.icon} alt="" width={86} height={86} className="size-10" />
                </span>
                <h3 className="mt-8 font-display text-xl font-bold leading-snug text-white">{service.name}</h3>
                <span className="mt-auto pt-6 text-sm font-semibold uppercase tracking-wider text-white/60 transition group-hover:text-accent">
                  Learn more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
