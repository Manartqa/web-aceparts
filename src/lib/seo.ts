import type { Metadata } from "next";
import { company } from "@/content";

// Public origin used for canonical URLs, Open Graph, the sitemap and JSON-LD.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aceparts.co.th").replace(/\/$/, "");

export const absoluteUrl = (path: string) => `${siteUrl}${path}`;

const defaultImage = "/images/hero/1.jpg";

// A page's openGraph replaces the layout's rather than merging, so every page repeats these.
export const openGraphDefaults = {
  type: "website",
  siteName: company.name,
  locale: "en_US",
} as const;

// Search engines show about 155 characters of a description.
export function truncate(text: string, max = 155): string {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max - 1))}…`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  // Path with trailing slash, e.g. "/about-us/".
  path: string;
  image?: string;
}

export function pageMetadata({ title, description, path, image = defaultImage }: PageMetadataInput): Metadata {
  const desc = truncate(description);
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      ...openGraphDefaults,
      title,
      description: desc,
      url: path,
      images: [{ url: image }],
    },
  };
}

export const defaultOpenGraph = { ...openGraphDefaults, images: [{ url: defaultImage }] };
