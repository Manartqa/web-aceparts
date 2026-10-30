import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/partials/Products";
import { company, getProduct, products } from "@/content";
import { pageMetadata } from "@/lib/seo";

// Every slug is prerendered below, so navigating here only waits for a static
// payload; skip the instant-navigation check that wants a <Suspense> shell.
export const instant = false;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return pageMetadata({
    title: product.name,
    description: `${product.summary}. Supplied by ${company.name}, the official provider of railway parts to the State Railway of Thailand.`,
    path: product.href,
    image: product.gallery[0] ?? product.image,
  });
}

export default async function ProductPage({ params }: PageProps<"/portfolio/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
