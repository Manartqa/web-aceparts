import {
  HomeAbout,
  HomeCta,
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
      <HomeCta />
    </>
  );
}
