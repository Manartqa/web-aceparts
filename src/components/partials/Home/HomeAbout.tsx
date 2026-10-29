import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common";
import { company, products, services } from "@/content/site";

const stats = [
  { value: String(company.founded), label: "Established" },
  { value: String(products.length), label: "Product lines" },
  { value: String(services.length), label: "Services" },
];

export default function HomeAbout() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-brand/20">
            <Image src="/images/about.jpg" alt="SRT train crossing the River Kwai bridge" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-8 right-4 max-w-xs rounded-2xl bg-brand p-6 text-white shadow-xl sm:-right-6">
            <svg className="size-8 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M7 7h4v4c0 3-1.5 5-4 6l-1-1.5c1.5-.8 2.3-2 2.4-3.5H7V7Zm8 0h4v4c0 3-1.5 5-4 6l-1-1.5c1.5-.8 2.3-2 2.4-3.5H15V7Z" />
            </svg>
            <p className="mt-3 font-display text-lg font-semibold leading-snug">{company.statement}</p>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="About us" title={company.name} />
          <p className="mt-8 text-lg leading-relaxed">
            Established in {company.founded}, {company.name} has provided quality railway parts and maintenance
            services to our exclusive customer, the State Railway of Thailand (SRT). We use the latest innovations
            and technology from leading manufacturers in South Korea to supply precision-engineered products.
          </p>
          <p className="mt-4 leading-relaxed">
            Every railway part is carefully designed and tested to ensure high-grade fixtures, as trusted by
            Thailand&apos;s sole railway service provider.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-brand/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{stat.label}</dt>
                <dd className="mt-1 font-display text-3xl font-bold text-brand sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <Link href="/about-us/" className="mt-10 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-brand hover:text-accent">
            More about us <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
