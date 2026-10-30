import type { NextConfig } from "next";

// WordPress URLs with no page here. The posts and archives were theme demo
// content (architecture/interior design), so they go to the home page.
const wordpressDemoPaths = [
  "/hello-world/",
  "/architecture-is-not-based-on-concrete-and-steel/",
  "/architecture-is-not-based-on-concrete-and-steel-2/",
  "/architecture-is-not-based-on-concrete-and-steel-3/",
  "/architecture-is-not-based-on-concrete-and-steel-4/",
  "/control-your-own-level-of-motivation/",
  "/get-best-advertiser-in-your-side-pocket/",
  "/use-pastel-colors-natural-materials/",
  "/the-golden-ratio-rule-for-best-2d-sketch/",
  "/top-10-tips-for-your-kitchen-interior-design/",
  "/author/:path*",
  "/category/:path*",
  "/tag/:path*",
  "/type/:path*",
  "/ot_header_builders/:path*",
  "/ot_footer_builders/:path*",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/portfolio-category/products/", destination: "/products/", permanent: true },
      ...wordpressDemoPaths.map((source) => ({ source, destination: "/", permanent: true })),
    ];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Match the WordPress URL style (/about-us/) so existing links keep working.
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
