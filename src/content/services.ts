// Services, ported from /our-services/<slug>/ on the WordPress site.

export interface Service {
  slug: string;
  name: string;
  href: string;
  icon: string;
  photo: string;
  description: string;
}

const serviceData: Omit<Service, "href" | "photo">[] = [
  {
    slug: "ultrasonic-phase-array-scans",
    name: "Ultrasonic Phase Array Scans",
    icon: "/images/services/ultrasonic.png",
    description: "We use ultrasonic waves to scan for material defections",
  },
  {
    slug: "wheel-machining",
    name: "Wheel Machining",
    icon: "/images/services/wheel-machining.png",
    description: "We lathe wheels to specific profiles requested by our client",
  },
  {
    slug: "tarol-bearing-assembly-disassembly",
    name: "Tarol Bearing Assembly & Disassembly",
    icon: "/images/services/tarol-bearing.png",
    description: "We assemble and disassemble TAROL bearings",
  },
  {
    slug: "wheel-tire-assembly-disassembly",
    name: "Wheel Tire Assembly & Disassembly",
    icon: "/images/services/wheel-tire.png",
    description: "We assemble and disassemble wheel tires",
  },
];

export const services: Service[] = serviceData.map((s) => ({
  ...s,
  href: `/our-services/${s.slug}/`,
  photo: `/images/services/photos/${s.slug}.jpg`,
}));

export const getService = (slug: string) => services.find((s) => s.slug === slug);

// Shared by /our-services/ and each service page. The WordPress /our-services/
// page itself only held theme demo content, so it is rebuilt from this intro.
export const servicesPage = {
  eyebrow: "Our services",
  title: "Quality maintenance services",
  headerImage: "/images/bg/services-header.jpg",
  intro:
    "We provide a vast array of maintenance services, such as defection scan using ultrasonic phased array, tarol bearing and wheel tire assembling and disassembling, and wheel machining.",
};
