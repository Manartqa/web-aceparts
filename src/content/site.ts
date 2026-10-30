// Site-wide content, ported from the WordPress site. Paths keep the original
// WordPress URLs so existing links and search rankings keep working.
import { products } from "./products";
import { services } from "./services";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const company = {
  name: "A.C.E. Parts Co., Ltd.",
  tagline: "Bogie frames, drive gears, wheelsets and more.",
  statement:
    "The official provider of railway parts and services to the State Railway of Thailand",
  address: "599/59 Ratchadaphisek Road, Jatujak, Bangkok 10900 Thailand",
  phone: "+662-001-1155",
  email: "operations@acethailand.co.th",
  founded: 2012,
};

export const partners = [1, 2, 3, 4, 5, 6].map((n) => ({
  name: `Partner ${n}`,
  logo: `/images/partners/${n}.png`,
}));

export const heroImages = ["/images/hero/1.jpg", "/images/hero/2.jpg", "/images/hero/3.jpg"];

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  {
    label: "Products",
    href: "/products/",
    children: products.map(({ name, href }) => ({ label: name, href })),
  },
  {
    label: "Services",
    href: "/our-services/",
    children: services.map(({ name, href }) => ({ label: name, href })),
  },
  { label: "Our Client", href: "/our-client/" },
  { label: "Contact Us", href: "/contact-us/" },
];
