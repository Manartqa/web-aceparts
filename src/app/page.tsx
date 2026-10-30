import type { Metadata } from "next";
import { CtaBanner, JsonLd, PartnersSection } from "@/components/common";
import {
  HomeAbout,
  HomeHero,
  HomeProducts,
  HomeServices,
} from "@/components/partials/Home";
import { company } from "@/content";
import { absoluteUrl, defaultOpenGraph, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...defaultOpenGraph, url: "/" },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: siteUrl,
  logo: absoluteUrl("/images/logo.png"),
  description: company.statement,
  foundingDate: String(company.founded),
  email: company.email,
  telephone: company.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "599/59 Ratchadaphisek Road",
    addressLocality: "Jatujak",
    addressRegion: "Bangkok",
    postalCode: "10900",
    addressCountry: "TH",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organization} />
      <HomeHero />
      <HomeAbout />
      <HomeProducts />
      <HomeServices />
      <PartnersSection />
      <CtaBanner />
    </>
  );
}
