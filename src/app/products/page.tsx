import { ProductsContent } from "@/components/partials/Products";
import { products } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products",
  description: `Premium-grade railway parts for the State Railway of Thailand: ${products.map((p) => p.name).join(", ")}.`,
  path: "/products/",
  image: products[0].gallery[0],
});

export default function ProductsPage() {
  return <ProductsContent />;
}
