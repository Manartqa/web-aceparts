"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { company, heroImages } from "@/content";

const SLIDE_MS = 6000;

export default function HomeHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % heroImages.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brand-deep">
      {heroImages.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 -z-20 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== current}
        >
          <Image
            src={src}
            alt=""
            fill
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            sizes="100vw"
            className={`object-cover ${i === current ? "animate-[hero-zoom_8s_ease-out_forwards]" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-deep/90 via-brand/60 to-brand/10" />

      <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6">
        <p className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
          <span className="size-2 rounded-full bg-accent" aria-hidden />
          Since {company.founded} · Official SRT supplier
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          {company.name}
        </h1>
        <p className="mt-6 max-w-xl font-display text-lg uppercase tracking-[0.2em] text-white/85 sm:text-xl">
          {company.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/products/"
            className="rounded-full bg-accent px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-brand-deep transition hover:-translate-y-0.5 hover:bg-white"
          >
            Explore products
          </Link>
          <Link
            href="/contact-us/"
            className="rounded-full border border-white/40 px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-brand"
          >
            Contact us
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6">
        {heroImages.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className="group h-6 py-2.5"
          >
            <span
              className={`block h-1 rounded-full transition-all duration-500 ${
                i === current ? "w-12 bg-accent" : "w-6 bg-white/40 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
