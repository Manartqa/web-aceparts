import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common";
import { products } from "@/content/site";

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
              <Link
                href={product.href}
                className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-brand/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-6 transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 font-display text-sm font-bold text-brand/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-brand/5 px-6 py-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Products</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-ink">{product.name}</h3>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
