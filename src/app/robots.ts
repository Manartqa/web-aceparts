import type { MetadataRoute } from "next";
import { absoluteUrl, noindex } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (noindex) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
