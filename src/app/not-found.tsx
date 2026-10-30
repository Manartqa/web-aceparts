import Link from "next/link";
import { PageHero } from "@/components/common";

export default function NotFound() {
  return (
    <>
      <PageHero title="Page not found" eyebrow="404" breadcrumbs={[{ label: "Page not found" }]} />
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <p className="max-w-xl text-lg leading-relaxed">
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-brand px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-brand-deep"
        >
          Back to home
        </Link>
      </section>
    </>
  );
}
