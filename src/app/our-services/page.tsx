import { ServicesContent } from "@/components/partials/Services";
import { servicesPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Services",
  description: servicesPage.intro,
  path: "/our-services/",
  image: servicesPage.headerImage,
});

export default function ServicesPage() {
  return <ServicesContent />;
}
