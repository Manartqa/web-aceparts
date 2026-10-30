import Image from "next/image";
import Link from "next/link";
import { company } from "@/content/site";

export default function CtaBanner() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-20 text-center sm:px-12 lg:py-28">
        <Image src="/images/bg/cta.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand/95 to-brand-deep/80" />

        <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Through quality rail products and our first-class services
        </p>
        <h2 className="mx-auto mt-5 max-w-4xl font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
          We provide safe, fast, reliable rail systems to the Thai public
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact-us/"
            className="rounded-full bg-accent px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-brand-deep transition hover:-translate-y-0.5 hover:bg-white"
          >
            Contact us
          </Link>
          <a
            href={`tel:${company.phone}`}
            className="rounded-full border border-white/40 px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-brand"
          >
            {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
