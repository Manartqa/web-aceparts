import Image from "next/image";
import Link from "next/link";
import { ContactList, CtaBanner, PageHero } from "@/components/common";
import { services, servicesPage, type Service } from "@/content";

interface ServiceDetailProps {
  service: Service;
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <>
      <PageHero
        title={service.name}
        eyebrow="Our services"
        image={servicesPage.headerImage}
        breadcrumbs={[{ label: "Services", href: "/our-services/" }, { label: service.name }]}
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <nav aria-label="Services" className="rounded-3xl bg-brand-soft/60 p-3">
              <ol>
                {services.map((s, i) => {
                  const active = s.slug === service.slug;
                  return (
                    <li key={s.slug}>
                      <Link
                        href={s.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition ${
                          active ? "bg-brand text-white" : "text-ink hover:bg-white"
                        }`}
                      >
                        <span className={active ? "text-accent" : "text-brand/40"}>{String(i + 1).padStart(2, "0")}.</span>
                        {s.name}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="rounded-3xl bg-brand-deep p-6 text-white/70">
              <h2 className="font-display text-lg font-bold text-white">Need this service?</h2>
              <div className="mt-4">
                <ContactList />
              </div>
            </div>
          </aside>

          <article>
            <p className="text-lg leading-relaxed">{servicesPage.intro}</p>
            <div className="mt-10 flex flex-col gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-brand/10 sm:flex-row sm:items-center lg:p-8">
              <div className="relative size-48 shrink-0 overflow-hidden rounded-2xl">
                <Image src={service.photo} alt={service.name} fill sizes="192px" className="object-cover" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">{service.name}</h2>
                <p className="mt-3 text-lg leading-relaxed">{service.description}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
