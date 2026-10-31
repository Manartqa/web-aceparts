"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { company, heroImages } from "@/content";

// Long enough for the intro (title, tagline, frame lines: ~4 s) to settle.
const SLIDE_MS = 8000;

const line = "absolute bg-white/30";

export default function HomeHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % heroImages.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-brand-deep text-center">
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
            className={`object-cover ${i === current ? "hero-zoom animate-[hero-zoom_9s_ease-out_forwards]" : ""}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-deep/60 via-black/35 to-brand-deep/70" />

      {/* Keyed by slide so the intro animation replays on every slide, as on the WordPress slider. */}
      <div key={current} className="mx-auto w-full max-w-7xl px-4 pt-20 sm:px-10">
        <div className="@container relative px-2 py-12 sm:px-10 md:py-16">
          {/* Broken frame: top-left and bottom-right corners, drawn in after the text. */}
          <span aria-hidden className={`${line} hero-draw-x -left-[30px] top-0 hidden h-px w-[55%] origin-left md:block`} />
          <span aria-hidden className={`${line} hero-draw-y -top-[30px] left-0 hidden h-[calc(100%+90px)] w-px origin-top md:block`} />
          <span aria-hidden className={`${line} hero-draw-y -bottom-[30px] right-0 hidden h-[calc(100%+90px)] w-px origin-bottom md:block`} />
          <span aria-hidden className={`${line} hero-draw-x -right-[30px] bottom-0 hidden h-px w-[55%] origin-right md:block`} />

          {/* One line at every width: the text is ~9.7× its font size wide, so a font
              size of 10% of this box's width (cqw) always fits. Capped at the original 110px. */}
          <h1 className="overflow-hidden whitespace-nowrap font-hero text-[min(10cqw,110px)] font-medium leading-[1.3] text-white">
            <span className="hero-rise block" style={{ animationDelay: "0.5s" }}>
              {company.name}
            </span>
          </h1>
          <p className="mt-4 overflow-hidden font-display text-[15px] uppercase text-white/90 sm:text-base sm:tracking-[4px] md:mt-6 md:text-lg md:tracking-[7px] xl:text-[22px] xl:tracking-[8px]">
            <span className="hero-rise block" style={{ animationDelay: "1s" }}>
              {company.tagline}
            </span>
          </p>

          <div className="hero-fade mt-10 flex flex-wrap justify-center gap-4">
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
      </div>

      <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2">
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
