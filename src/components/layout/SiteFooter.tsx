import Image from "next/image";
import Link from "next/link";
import { ContactList } from "@/components/common";
import { company, products, services } from "@/content";

export default function SiteFooter() {
  return (
    <footer className="bg-brand-deep text-white/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Image src="/images/logo.png" alt={company.name} width={128} height={102} className="h-20 w-auto" />
          <p className="mt-6 max-w-sm leading-relaxed">{company.statement}</p>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">Contacts</h2>
          <div className="mt-5">
            <ContactList />
          </div>
        </div>

        <FooterLinks title="Products" links={products} />
        <FooterLinks title="Services" links={services} />
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-white/50 sm:px-6">
          Copyright © <CopyrightYear /> {company.name} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">{title}</h2>
      <ul className="mt-4 space-y-1 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            {/* py-1.5 makes each link a 32 px tap target. */}
            <Link href={link.href} className="block py-1.5 transition-colors hover:text-accent">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Fixed at build time; the static site is rebuilt on each deploy.
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
