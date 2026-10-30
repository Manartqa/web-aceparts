import { AboutContent } from "@/components/partials/About";
import { aboutPage } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description: aboutPage.story[0],
  path: "/about-us/",
  image: aboutPage.storyImage,
});

export default function AboutPage() {
  return <AboutContent />;
}
