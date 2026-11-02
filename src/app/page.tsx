import type { Metadata } from "next";
import { CtaBanner, JsonLd, PartnersSection } from "@/components/common";
import {
  HomeAbout,
  HomeHero,
  HomeProducts,
  HomeServices,
} from "@/components/partials/Home";
import { homeSchema } from "@/lib/schema";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...defaultOpenGraph, url: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <HomeHero />
      <HomeAbout />
      <HomeProducts />
      <HomeServices />
      <PartnersSection />
      <CtaBanner />
    </>
  );
}
