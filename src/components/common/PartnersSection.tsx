"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { partners } from "@/content";

// After the WordPress image carousel: 3/4/6 logos in view, looping forever and
// sliding one logo every 6 s.
const DELAY_MS = 6000;
const SLIDE_MS = 800;

// A copy follows the logos, so the strip can slide onto the copy of the first
// logo and then jump back to the real one without a visible change.
const slides = [...partners, ...partners];

export default function PartnersSection() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setAnimate(true);
      // Capped, so a missed transitionend (e.g. a background tab) can't run past the copy.
      setIndex((i) => Math.min(i + 1, partners.length));
    }, DELAY_MS);
    return () => clearInterval(timer);
  }, []);

  const onTransitionEnd = () => {
    if (index === partners.length) {
      setAnimate(false);
      setIndex(0);
    }
  };

  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Help us connect Thailand's northernmost region to the Kingdom's deep south"
          title="Partnerships with industry leaders"
          align="center"
        />
        <div className="mt-14 overflow-hidden">
          <ul
            onTransitionEnd={onTransitionEnd}
            className="flex gap-[var(--gap)] [--gap:1rem] [--per:3] md:[--per:4] lg:[--per:6]"
            style={{
              // One step is one logo plus the gap: (100% + gap) / logos in view.
              transform: `translateX(calc(${-index} * (100% + var(--gap)) / var(--per)))`,
              transition: animate ? `transform ${SLIDE_MS}ms ease` : "none",
            }}
          >
            {slides.map((partner, i) => {
              const copy = i >= partners.length;
              return (
                <li
                  key={i}
                  aria-hidden={copy || undefined}
                  className="grid aspect-square place-items-center rounded-2xl border border-brand/10 bg-white p-4 transition hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5"
                  style={{ flex: "0 0 calc((100% - (var(--per) - 1) * var(--gap)) / var(--per))" }}
                >
                  <Image src={partner.logo} alt={copy ? "" : partner.name} width={350} height={350} className="h-auto w-full" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
