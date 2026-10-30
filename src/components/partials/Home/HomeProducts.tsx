import Link from "next/link";
import { ProductCard, SectionHeading } from "@/components/common";
import { products } from "@/content";

export default function HomeProducts() {
  return (
    <section className="bg-brand-soft/60 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Serving Thailand's extensive railway network" title="Premium-grade railway parts" />
          <Link
            href="/products/"
            className="rounded-full border border-brand px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-brand transition hover:bg-brand hover:text-white"
          >
            All products
          </Link>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <li key={product.href}>
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
