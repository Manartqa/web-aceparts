// Site content, ported from the WordPress site. Paths keep the original
// WordPress URLs so existing links and search rankings keep working.

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Product {
  name: string;
  href: string;
  image: string;
}

export interface Service {
  name: string;
  href: string;
  icon: string;
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

export const products: Product[] = [
  { name: "Bogie Frames", href: "/portfolio/bogie-frames/", image: "/images/products/bogie-frames.jpg" },
  { name: "Wheelset", href: "/portfolio/wheelset/", image: "/images/products/wheelset.jpg" },
  { name: "Motor Suspension Units (U-Tube)", href: "/portfolio/motor-suspension-units-u-tube/", image: "/images/products/motor-suspension-units.jpg" },
  { name: "Axle Drive Gears", href: "/portfolio/axle-drive-gears/", image: "/images/products/axle-drive-gears.jpg" },
  { name: "Automatic Tight Lock Couplers", href: "/portfolio/automatic-tight-lock-couplers/", image: "/images/products/automatic-tight-lock-couplers.jpg" },
  { name: "Electrical/Electronics", href: "/portfolio/electrical-electronics/", image: "/images/products/electrical-electronics.jpg" },
];

export const services: Service[] = [
  { name: "Ultrasonic Phase Array Scans", href: "/our-services/ultrasonic-phase-array-scans/", icon: "/images/services/ultrasonic.png" },
  { name: "Wheel Machining", href: "/our-services/wheel-machining/", icon: "/images/services/wheel-machining.png" },
  { name: "Tarol Bearing Assembly & Disassembly", href: "/our-services/tarol-bearing-assembly-disassembly/", icon: "/images/services/tarol-bearing.png" },
  { name: "Wheel Tire Assembly & Disassembly", href: "/our-services/wheel-tire-assembly-disassembly/", icon: "/images/services/wheel-tire.png" },
];

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
    href: services[0].href,
    children: services.map(({ name, href }) => ({ label: name, href })),
  },
  { label: "Our Client", href: "/our-client/" },
  { label: "Contact Us", href: "/contact-us/" },
];
