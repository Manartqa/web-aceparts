import Image from "next/image";
import { CtaBanner, PageHero, ProductCard, SectionHeading } from "@/components/common";
import { products, productsPage } from "@/content";

export default function ProductsContent() {
  const { monitoring } = productsPage;

  return (
    <>
      <PageHero
        title={productsPage.title}
        eyebrow={productsPage.eyebrow}
        image={productsPage.headerImage}
        breadcrumbs={[{ label: "Products" }]}
      />

      <section className="bg-brand-soft/60 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow={productsPage.listEyebrow} title={productsPage.listTitle} />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <li key={product.slug}>
                <ProductCard product={product} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow={monitoring.eyebrow} title={monitoring.title} />
          <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {monitoring.images.map((src, i) => (
              <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={src}
                  alt={`${monitoring.title} ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
