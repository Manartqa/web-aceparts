"use client";

import { useLayoutEffect, useRef } from "react";
import { aboutPage } from "@/content";

// After the WordPress theme's counter widget: each number counts up from 0 once it
// is fully in view, over 2 s with jQuery's "swing" easing.
const COUNT_MS = 2000;
const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2;

export default function AboutStats() {
  return (
    <section className="py-[66px]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 sm:px-6 lg:grid-cols-4">
        {aboutPage.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            {/* WordPress used #c2c2c2 (1.8:1); #949494 is the lightest gray that passes WCAG AA for large text. */}
            <div className="font-preloader text-[42px] font-light leading-none text-[#949494]">
              [ <Counter value={stat.value} /> +]
            </div>
            <h3 className="mt-2 font-display text-base font-semibold uppercase tracking-[1px] text-[#232323] md:text-lg">
              {stat.label}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

// Renders the final value, so it reads right without JS, then counts in the DOM.
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = "0";

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / COUNT_MS, 1);
          el.textContent = String(Math.floor(swing(progress) * value));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 1 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = String(value);
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}
