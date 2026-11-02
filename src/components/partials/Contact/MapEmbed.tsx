"use client";

import { useEffect, useRef, useState } from "react";

interface MapEmbedProps {
  title: string;
  src: string;
  className: string;
}

// Google Maps pulls about 650 KB of script. `loading="lazy"` starts it far too
// early, so the iframe is only added once the box is close to the viewport.
export default function MapEmbed({ title, src, className }: MapEmbedProps) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShow(true);
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={className}>
      {show && (
        <iframe
          title={title}
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
          className="block size-full border-0"
        />
      )}
    </div>
  );
}
