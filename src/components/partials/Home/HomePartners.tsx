import Image from "next/image";
import { SectionHeading } from "@/components/common";
import { partners } from "@/content";

export default function HomePartners() {
  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Help us connect Thailand's northernmost region to the Kingdom's deep south"
          title="Partnerships with industry leaders"
          align="center"
        />
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <li
              key={partner.logo}
              className="grid aspect-square place-items-center rounded-2xl border border-brand/10 bg-white p-4 transition hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={350}
                height={350}
                className="h-auto w-full opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
