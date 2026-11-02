import { ContactContent } from "@/components/partials/Contact";
import { contactPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: contactPage.metaTitle,
  description: contactPage.metaDescription,
  path: "/contact-us/",
});

export default function ContactPage() {
  return <ContactContent />;
}
