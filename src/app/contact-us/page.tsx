import { ContactContent } from "@/components/partials/Contact";
import { company, contactPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `${contactPage.detailsText} ${company.address}. Tel ${company.phone}.`,
  path: "/contact-us/",
});

export default function ContactPage() {
  return <ContactContent />;
}
