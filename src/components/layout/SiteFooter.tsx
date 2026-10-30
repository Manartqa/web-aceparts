import Image from "next/image";
import Link from "next/link";
import { company, services } from "@/content";

export default function SiteFooter() {
  return (
    <footer className="bg-brand-deep text-white/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image src="/images/logo.png" alt={company.name} width={128} height={102} className="h-20 w-auto" />
          <p className="mt-6 max-w-sm leading-relaxed">{company.statement}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Contacts</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <Icon path="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <span>{company.address}</span>
            </li>
            <li className="flex gap-3">
              <Icon path="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
              <a href={`tel:${company.phone}`} className="hover:text-accent">{company.phone}</a>
            </li>
            <li className="flex gap-3">
              <Icon path="M4 6h16v12H4zM4 7l8 6 8-6" />
              <a href={`mailto:${company.email}`} className="break-all hover:text-accent">{company.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Services</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((service) => (
              <li key={service.href}>
                <Link href={service.href} className="transition-colors hover:text-accent">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-white/50 sm:px-6">
          Copyright © <CopyrightYear /> {company.name} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

// Fixed at build time; the static site is rebuilt on each deploy.
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

function Icon({ path }: { path: string }) {
  return (
    <svg className="mt-0.5 size-5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}
