import { CtaBanner } from "@/components/common";
import {
  HomeAbout,
  HomeHero,
  HomePartners,
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
      <HomePartners />
      <CtaBanner />
    </>
  );
}
