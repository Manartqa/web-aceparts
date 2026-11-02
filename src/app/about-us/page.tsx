import { AboutContent } from "@/components/partials/About";
import { aboutPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: aboutPage.metaTitle,
  description: aboutPage.metaDescription,
  path: "/about-us/",
  image: aboutPage.storyImage,
});

export default function AboutPage() {
  return <AboutContent />;
}
