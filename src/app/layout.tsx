import type { Metadata } from "next";
import { Raleway, Titillium_Web } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/layout";
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
      className={`${raleway.variable} ${titillium.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
