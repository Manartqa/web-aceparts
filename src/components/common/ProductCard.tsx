import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content";

interface ProductCardProps {
  product: Product;
  // Shown as "01", "02"… when the card is part of a numbered grid.
  index?: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
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
        {index !== undefined && (
          <span className="absolute left-5 top-5 font-display text-sm font-bold text-brand/30">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
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
  );
}
