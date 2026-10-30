import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/content";

interface ServiceCardProps {
  service: Service;
}

// Glass-style card, designed for dark (brand) backgrounds.
export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={service.href}
      className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-white/10"
    >
      <span className="grid size-16 place-items-center rounded-2xl bg-accent/15 ring-1 ring-accent/30 transition group-hover:bg-accent">
        <Image src={service.icon} alt="" width={86} height={86} className="size-10" />
      </span>
      <h3 className="mt-8 font-display text-xl font-bold leading-snug text-white">{service.name}</h3>
      <span className="mt-auto pt-6 text-sm font-semibold uppercase tracking-wider text-white/60 transition group-hover:text-accent">
        Learn more →
      </span>
    </Link>
  );
}
