"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// After the WordPress theme's Royal Preloader ("progress" mode): counts 0–100% as the
// page's images load, one percent per step, then fades out. Shown on every page.
const STEP_MS = 5;
// Stop waiting for images after this, as the original does.
const TIMEOUT_MS = 10_000;
// Fade-out delay plus duration; matches the classes below.
const FADE_MS = 700;

export default function Preloader() {
  // Keyed by path so it starts again from 0% on every navigation.
  const pathname = usePathname();
  return (
    <>
      <Overlay key={pathname} />
      <noscript>
        <style>{"#preloader{display:none}"}</style>
      </noscript>
    </>
  );
}

function Overlay() {
  const [percent, setPercent] = useState(0);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const images = Array.from(document.images);
    // Lazy images below the fold would never load here, so they don't hold it up.
    let loaded = images.filter((img) => img.complete || img.loading === "lazy").length;
    const onLoad = () => loaded++;
    const pending = images.filter((img) => !img.complete && img.loading !== "lazy");
    for (const img of pending) {
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    }

    const start = Date.now();
    let shown = 0;
    let fade: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      const target =
        images.length && Date.now() - start < TIMEOUT_MS
          ? Math.floor((loaded / images.length) * 100)
          : 100;
      if (shown < target) setPercent(++shown);
      if (shown === 100) {
        clearInterval(timer);
        fade = setTimeout(() => setRemoved(true), FADE_MS);
      }
    }, STEP_MS);

    return () => {
      clearInterval(timer);
      clearTimeout(fade);
      for (const img of pending) {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onLoad);
      }
    };
  }, []);

  if (removed) return null;

  const complete = percent === 100;

  return (
    <div
      id="preloader"
      aria-hidden
      className={`fixed inset-0 z-[9999] bg-brand bg-[radial-gradient(circle,rgba(255,255,255,0.1),rgba(255,255,255,0.01))] ${
        complete ? "opacity-0 transition-opacity delay-500 duration-200 ease-linear" : ""
      }`}
    >
      <div className="absolute inset-x-0 top-1/2 mx-auto -mt-2.5 h-px w-[60%] bg-black/20">
        <div className="h-full bg-white" style={{ width: `${percent}%` }} />
      </div>
      <div className="absolute inset-x-0 top-1/2 text-center font-preloader text-xl leading-10 text-[#9f9e9e]">
        {percent}%
      </div>
    </div>
  );
}
