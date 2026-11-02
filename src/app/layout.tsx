import type { Metadata } from "next";
import { Josefin_Sans, Poppins, Raleway, Titillium_Web } from "next/font/google";
import { Preloader, SiteFooter, SiteHeader } from "@/components/layout";
import { company } from "@/content";
import { defaultOpenGraph, noindex, siteUrl } from "@/lib/seo";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const titillium = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

// Home hero title only, as on the WordPress slider.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "500",
});

// Preloader percentage and About counters, as on the WordPress theme.
const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} – ${company.tagline}`,
    template: `%s – ${company.name}`,
  },
  description: company.statement,
  openGraph: defaultOpenGraph,
  ...(noindex && { robots: { index: false, follow: false } }),
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${titillium.variable} ${poppins.variable} ${josefin.variable} h-full antialiased`}
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
