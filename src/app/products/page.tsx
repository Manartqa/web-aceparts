import { ProductsContent } from "@/components/partials/Products";
import { products, productsPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: productsPage.metaTitle,
  description: productsPage.metaDescription,
  path: "/products/",
  image: products[0].gallery[0],
});

export default function ProductsPage() {
  return <ProductsContent />;
}
