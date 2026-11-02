import Link from "next/link";

// Enquiry button for product and service pages, so the first screen has a next step.
export default function QuoteLink() {
  return (
    <Link
      href="/contact-us/"
      className="mt-6 inline-flex rounded-full bg-brand px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-brand-deep"
    >
      Request a quote
    </Link>
  );
}
