import Image from "next/image";
import Breadcrumb, { type Crumb } from "./Breadcrumb";

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  breadcrumbs: Crumb[];
  image?: string;
}

// Banner at the top of every inner page. Top padding clears the fixed header.
export default function PageHero({ title, eyebrow, breadcrumbs, image = "/images/bg/segment.jpg" }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep pb-16 pt-36 lg:pb-20 lg:pt-44">
      {/* The page's LCP element. */}
      <Image src={image} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-deep/95 via-brand/85 to-brand/60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Breadcrumb items={breadcrumbs} />
        {eyebrow && (
          <p className="mt-8 inline-flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1 className={`${eyebrow ? "mt-4" : "mt-8"} max-w-4xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl`}>
          {title}
        </h1>
      </div>
    </section>
  );
}
