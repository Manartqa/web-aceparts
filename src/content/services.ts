// Services, ported from /our-services/<slug>/ on the WordPress site.

export interface Service {
  slug: string;
  name: string;
  href: string;
  icon: string;
  photo: string;
  description: string;
  // Search snippet: page title (the layout appends the brand) and meta description.
  metaTitle: string;
  metaDescription: string;
}

const serviceData: Omit<Service, "href" | "photo">[] = [
  {
    slug: "ultrasonic-phase-array-scans",
    name: "Ultrasonic Phased Array Scans",
    icon: "/images/services/ultrasonic.png",
    description: "We use ultrasonic waves to scan for material defects",
    metaTitle: "Ultrasonic Phased Array (PAUT) Inspection",
    metaDescription:
      "Ultrasonic phased array (PAUT) inspection that scans railway parts for material defects, carried out by A.C.E. Parts for the State Railway of Thailand.",
  },
  {
    slug: "wheel-machining",
    name: "Wheel Machining",
    icon: "/images/services/wheel-machining.png",
    description: "We lathe wheels to specific profiles requested by our client",
    metaTitle: "Railway Wheel Machining and Reprofiling",
    metaDescription:
      "Railway wheel machining by A.C.E. Parts: wheels are turned on a lathe to the exact profiles that the State Railway of Thailand specifies for its fleet.",
  },
  {
    slug: "tarol-bearing-assembly-disassembly",
    name: "TAROL Bearing Assembly & Disassembly",
    icon: "/images/services/tarol-bearing.png",
    description: "We assemble and disassemble TAROL bearings",
    metaTitle: "TAROL Bearing Assembly and Disassembly",
    metaDescription:
      "Assembly and disassembly of TAROL tapered roller bearing units for railway wheelsets, carried out by A.C.E. Parts for the State Railway of Thailand.",
  },
  {
    slug: "wheel-tire-assembly-disassembly",
    name: "Wheel Tire Assembly & Disassembly",
    icon: "/images/services/wheel-tire.png",
    description: "We assemble and disassemble wheel tires",
    metaTitle: "Railway Wheel Tire Assembly and Disassembly",
    metaDescription:
      "Assembly and disassembly of railway wheel tires for the rolling stock of the State Railway of Thailand, one of four maintenance services from A.C.E. Parts.",
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
  metaTitle: "Railway Maintenance Services",
  metaDescription:
    "Railway maintenance by A.C.E. Parts: ultrasonic phased array inspection, wheel machining, and TAROL bearing and wheel tire assembly and disassembly.",
  eyebrow: "Our services",
  title: "Quality maintenance services",
  headerImage: "/images/bg/services-header.jpg",
  intro:
    "We provide a vast array of maintenance services, such as defect scanning using ultrasonic phased array, TAROL bearing and wheel tire assembling and disassembling, and wheel machining.",
};
