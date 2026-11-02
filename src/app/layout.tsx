import type { Metadata } from "next";
import { Josefin_Sans, Raleway, Titillium_Web } from "next/font/google";
import { Preloader, SiteFooter, SiteHeader } from "@/components/layout";
import { company, homeMeta } from "@/content";
import { defaultOpenGraph, noindex, siteUrl } from "@/lib/seo";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const titillium = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Preloader percentage, as on the WordPress theme. Fonts used on one page only
// (Poppins in the home hero, the About counters) load there instead.
const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeMeta.title,
    template: `%s – ${company.shortName}`,
  },
  description: homeMeta.description,
  openGraph: defaultOpenGraph,
  ...(noindex && { robots: { index: false, follow: false } }),
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${titillium.variable} ${josefin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Preloader />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
