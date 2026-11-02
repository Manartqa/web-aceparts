import { ClientContent } from "@/components/partials/Client";
import { clientPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: clientPage.metaTitle,
  description: clientPage.metaDescription,
  path: "/our-client/",
  image: clientPage.image,
});

export default function ClientPage() {
  return <ClientContent />;
}
