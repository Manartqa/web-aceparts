import { products } from "../src/content/products";
import { services } from "../src/content/services";

// Every page of the site, as listed in sitemap.xml.
export const pages = [
  "/",
  "/about-us/",
  "/products/",
  ...products.map((p) => p.href),
  "/our-services/",
  ...services.map((s) => s.href),
  "/our-client/",
  "/contact-us/",
];
