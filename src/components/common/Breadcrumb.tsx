import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import JsonLd from "./JsonLd";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  // Trail after "Home"; the last item is the current page.
  items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link href={crumb.href} className="transition-colors hover:text-accent">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-white" : undefined}>
                  {crumb.label}
                </span>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            // The current page (last item) may omit its URL.
            ...(crumb.href && { item: absoluteUrl(crumb.href) }),
          })),
        }}
      />
    </nav>
  );
}
