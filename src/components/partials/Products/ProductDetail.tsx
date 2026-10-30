import Image from "next/image";
import Link from "next/link";
import { CtaBanner, PageHero, ProductCard, SectionHeading } from "@/components/common";
import { getProduct, products, productsPage, type Product } from "@/content";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const index = products.findIndex((p) => p.slug === product.slug);
  const prev = products[index - 1];
  const next = products[index + 1];
  const related = product.related.map(getProduct).filter((p): p is Product => Boolean(p));

  return (
    <>
      <PageHero
        title={product.name}
        eyebrow="Products"
        image={productsPage.headerImage}
        breadcrumbs={[{ label: "Products", href: "/products/" }, { label: product.name }]}
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="max-w-3xl font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            {product.summary}
          </p>

          {product.gallery.length > 0 && (
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.gallery.map((src, i) => (
                <li key={src}>
                  <GalleryImage src={src} alt={`${product.name} ${i + 1}`} />
                </li>
              ))}
            </ul>
          )}

          {product.items && (
            <ol className="mt-12 space-y-6">
              {product.items.map((item, i) => (
                <li key={item.name} className="grid gap-6 rounded-3xl bg-brand-soft/60 p-6 lg:grid-cols-[1fr_2fr] lg:p-8">
                  <div>
                    <span className="font-display text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="mt-2 font-display text-2xl font-bold text-ink">{item.name}</h2>
                    <p className="mt-3 leading-relaxed">{item.description}</p>
                  </div>
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {item.images.map((src, j) => (
                      <li key={src}>
                        <GalleryImage src={src} alt={`${item.name} ${j + 1}`} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}

          <nav aria-label="Product navigation" className="mt-16 grid gap-4 border-t border-brand/10 pt-8 sm:grid-cols-2">
            {prev ? <PagerLink product={prev} direction="prev" /> : <span />}
            {next && <PagerLink product={next} direction="next" />}
          </nav>
        </div>
      </section>

      <section className="bg-brand-soft/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Products" title="Related products" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-24">
        <CtaBanner />
      </div>
    </>
  );
}

// Opens the full-size image in a new tab, like the WordPress gallery did.
function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <a href={src} target="_blank" rel="noopener" className="group relative block aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10">
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-contain p-3 transition duration-500 group-hover:scale-105" />
    </a>
  );
}

function PagerLink({ product, direction }: { product: Product; direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={product.href}
      className={`group rounded-2xl p-4 transition hover:bg-brand-soft ${isNext ? "text-right sm:col-start-2" : ""}`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {isNext ? "Next product →" : "← Previous product"}
      </span>
      <span className="mt-1 block font-display text-lg font-bold text-ink group-hover:text-brand">{product.name}</span>
    </Link>
  );
}
