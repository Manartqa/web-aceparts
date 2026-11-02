// Products, ported from /products/ and /portfolio/<slug>/ on the WordPress site.

export interface ProductItem {
  name: string;
  description: string;
  images: string[];
}

export interface Product {
  slug: string;
  name: string;
  href: string;
  // Card thumbnail.
  image: string;
  summary: string;
  // Search snippet: page title (the layout appends the brand) and meta description.
  metaTitle: string;
  metaDescription: string;
  gallery: string[];
  // Sub-products listed on the detail page (Electrical/Electronics only).
  items?: ProductItem[];
  related: string[];
}

const dir = (slug: string) => `/images/products/${slug}`;

const productData: Omit<Product, "href">[] = [
  {
    slug: "bogie-frames",
    name: "Bogie Frames",
    image: "/images/products/bogie-frames.jpg",
    summary: "Bogie frames with bolster and piping for locomotives and multiple unit trains",
    metaTitle: "Railway Bogie Frames",
    metaDescription:
      "Bogie frames with bolster and piping for locomotives and multiple-unit trains, supplied by A.C.E. Parts for the State Railway of Thailand's fleet.",
    gallery: [1, 2, 3].map((n) => `${dir("bogie-frames")}/${n}.jpg`),
    related: ["axle-drive-gears", "electrical-electronics", "automatic-tight-lock-couplers"],
  },
  {
    slug: "wheelset",
    name: "Wheelset",
    image: "/images/products/wheelset.jpg",
    summary: "Wheelset for locomotives, passenger coaches, and multiple-unit trains",
    metaTitle: "Railway Wheelsets",
    metaDescription:
      "Wheelsets for the locomotives, passenger coaches and multiple-unit trains of the State Railway of Thailand, from Bangkok supplier A.C.E. Parts.",
    gallery: [1, 2, 3, 4].map((n) => `${dir("wheelset")}/${n}.jpg`),
    related: ["automatic-tight-lock-couplers", "electrical-electronics", "axle-drive-gears"],
  },
  {
    slug: "motor-suspension-units-u-tube",
    name: "Motor Suspension Units (U-Tube)",
    image: "/images/products/motor-suspension-units.jpg",
    summary: "Part of locomotive wheelset to be installed with traction motor",
    metaTitle: "Locomotive Motor Suspension Units (U-Tube)",
    metaDescription:
      "Motor suspension units (U-tube), the part of a locomotive wheelset that holds the traction motor, supplied by A.C.E. Parts to the State Railway of Thailand.",
    gallery: [1, 2, 3].map((n) => `${dir("motor-suspension-units-u-tube")}/${n}.jpg`),
    related: ["bogie-frames", "wheelset", "axle-drive-gears"],
  },
  {
    slug: "axle-drive-gears",
    name: "Axle Drive Gears",
    image: "/images/products/axle-drive-gears.jpg",
    summary: "Driving gear for diesel multiple units (DMU)",
    metaTitle: "Axle Drive Gears for DMU Trains",
    metaDescription:
      "Axle drive gears for the diesel multiple units (DMU) of the State Railway of Thailand, supplied by A.C.E. Parts, a Bangkok railway parts company.",
    gallery: [1, 2].map((n) => `${dir("axle-drive-gears")}/${n}.jpg`),
    related: ["automatic-tight-lock-couplers", "wheelset", "electrical-electronics"],
  },
  {
    slug: "automatic-tight-lock-couplers",
    name: "Automatic Tight Lock Couplers",
    image: "/images/products/automatic-tight-lock-couplers.jpg",
    summary: "Automatic tight lock couplers for railway",
    metaTitle: "Railway Automatic Tight Lock Couplers",
    metaDescription:
      "Automatic tight lock couplers for connecting railway vehicles, supplied by A.C.E. Parts to the State Railway of Thailand for its rolling stock.",
    gallery: [1, 2].map((n) => `${dir("automatic-tight-lock-couplers")}/${n}.jpg`),
    related: ["motor-suspension-units-u-tube", "axle-drive-gears", "electrical-electronics"],
  },
  {
    slug: "electrical-electronics",
    name: "Electrical/Electronics",
    image: "/images/products/electrical-electronics.jpg",
    // New copy: the WordPress page had no summary line for this product.
    summary: "Electrical and electronic systems for locomotives and multiple-unit trains",
    metaTitle: "Locomotive Electrical & Electronic Systems",
    metaDescription:
      "Electrical systems for SRT locomotives and multiple units: power diodes, excitation and motor speed panels, auxiliary inverters, door control and HVAC.",
    gallery: [],
    items: [
      {
        name: "Power Diode",
        description: "Rectifiers for main alternator excitation of locomotive",
        images: [1, 2, 3].map((n) => `${dir("electrical-electronics")}/power-diode-${n}.jpg`),
      },
      {
        name: "Excitation Panel (EXP)",
        description: "Excitation control panel for locomotive",
        images: [`${dir("electrical-electronics")}/excitation-panel-1.jpg`],
      },
      {
        name: "Motor Speed Panel (MSP)",
        description: "Motor speed panel for locomotive",
        images: [`${dir("electrical-electronics")}/motor-speed-panel-1.jpg`],
      },
      {
        name: "Auxiliary Inverter Control (AAE)",
        description: "Inverter control for auxiliary power in locomotive",
        images: [1, 2].map((n) => `${dir("electrical-electronics")}/auxiliary-inverter-${n}.jpg`),
      },
      {
        name: "Door Control System",
        description: "Plug and partition door control system for multiple-unit trains",
        images: [`${dir("electrical-electronics")}/door-control-1.jpg`],
      },
      {
        name: "Heating, Ventilating and Air Conditioning (HVAC)",
        description:
          "Circulates air ventilation, heating and air conditioning in each car for multiple-unit trains",
        images: [1, 2].map((n) => `${dir("electrical-electronics")}/hvac-${n}.jpg`),
      },
    ],
    related: ["motor-suspension-units-u-tube", "bogie-frames", "automatic-tight-lock-couplers"],
  },
];

export const products: Product[] = productData.map((p) => ({ ...p, href: `/portfolio/${p.slug}/` }));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

// /products/ page
export const productsPage = {
  metaTitle: "Railway Parts: Bogies, Wheelsets and More",
  metaDescription:
    "Railway parts for the State Railway of Thailand: bogie frames, wheelsets, motor suspension units, axle drive gears, couplers and electrical systems.",
  eyebrow: "Premium-grade railway parts",
  title: "Our Products",
  headerImage: "/images/bg/products-header.jpg",
  listEyebrow: "Serving Thailand's extensive railway network",
  listTitle: "Premium-grade railway parts",
  monitoring: {
    eyebrow: "A.C.E. Parts Co., Ltd.",
    title: "Wheel Machining and Monitoring",
    images: [1, 2, 3, 4, 5, 6].map((n) => `/images/products/monitoring/${n}.jpg`),
  },
};
