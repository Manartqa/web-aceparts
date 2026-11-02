import { aboutPage, company, homeMeta, type Service } from "@/content";
import { absoluteUrl, siteUrl } from "@/lib/seo";

// JSON-LD builders. Pages link back to the one Organization through its @id.

const organizationId = `${siteUrl}/#organization`;

// Schema.org expects an international number: "+662-001-1155" -> "+66-2-001-1155".
const telephone = company.phone.replace(/^\+66(\d)-/, "+66-$1-");

// The header logo is white on transparent and would vanish on the white
// background search results use, so structured data uses the navy crest
// (the WordPress site icon).
const logo = {
  "@type": "ImageObject",
  url: absoluteUrl("/images/logo-crest.jpg"),
  width: 270,
  height: 270,
};

const organization = {
  "@type": "Organization",
  "@id": organizationId,
  name: company.name,
  alternateName: company.shortName,
  url: `${siteUrl}/`,
  logo,
  description: homeMeta.description,
  foundingDate: String(company.founded),
  founder: {
    "@type": "Person",
    name: aboutPage.vision.author.replace(/^Mr\. /, ""),
    jobTitle: aboutPage.vision.role.split(",")[0],
  },
  email: company.email,
  telephone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "599/59 Ratchadaphisek Road",
    addressLocality: "Jatujak",
    addressRegion: "Bangkok",
    postalCode: "10900",
    addressCountry: "TH",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone,
    email: company.email,
    areaServed: "TH",
  },
  areaServed: "TH",
  // The Google Maps place, also embedded on /contact-us/.
  sameAs: ["https://maps.google.com/?cid=13852179023345521135"],
};

// Home page: the organization and the site it publishes.
export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organization,
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: company.name,
      alternateName: company.shortName,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
  ],
};

export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: absoluteUrl(service.href),
    image: absoluteUrl(service.photo),
    areaServed: "TH",
    provider: { "@type": "Organization", "@id": organizationId, name: company.name, url: `${siteUrl}/` },
  };
}
