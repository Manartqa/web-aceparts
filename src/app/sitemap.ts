import type { MetadataRoute } from "next";
import { products, services } from "@/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about-us/",
    "/products/",
    ...products.map((p) => p.href),
    "/our-services/",
    ...services.map((s) => s.href),
    "/our-client/",
    "/contact-us/",
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
