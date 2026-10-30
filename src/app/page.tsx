import { CtaBanner, PartnersSection } from "@/components/common";
import {
  HomeAbout,
  HomeHero,
  HomeProducts,
  HomeServices,
} from "@/components/partials/Home";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeProducts />
      <HomeServices />
      <PartnersSection />
      <CtaBanner />
    </>
  );
}
