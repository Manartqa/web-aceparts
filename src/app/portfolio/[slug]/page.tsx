import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/partials/Products";
import { getProduct, products } from "@/content";

// Every slug is prerendered below, so navigating here only waits for a static
// payload; skip the instant-navigation check that wants a <Suspense> shell.
export const instant = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
