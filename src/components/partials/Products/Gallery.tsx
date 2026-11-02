"use client";

import Image from "next/image";
import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

const OpenContext = createContext<(src: string) => void>(() => {});

// One image viewer for all the gallery images on a page; arrows, the arrow keys
// and swipes move through them. <dialog> handles focus, Esc and the backdrop.
export function Gallery({ photos, children }: { photos: GalleryPhoto[]; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  // Natural size of the shown image, once loaded.
  const [size, setSize] = useState<{ w: number; h: number }>();
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);

  // Next keeps a page mounted but hidden after navigating away; come back to it closed.
  useLayoutEffect(() => () => dialog.current?.close(), []);

  const show = (i: number) => {
    setIndex(i);
    setSize(undefined);
  };
  const open = (src: string) => {
    show(Math.max(0, photos.findIndex((p) => p.src === src)));
    dialog.current?.showModal();
  };
  const step = (by: number) => show((index + by + photos.length) % photos.length);

  const photo = photos[index];
  const many = photos.length > 1;

  return (
    <OpenContext value={open}>
      {children}
      <dialog
        ref={dialog}
        aria-label="Image viewer"
        className="lightbox m-0 size-full max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-brand-deep/90 backdrop:backdrop-blur-sm"
        onKeyDown={(e) => {
          if (many && e.key === "ArrowLeft") step(-1);
          if (many && e.key === "ArrowRight") step(1);
        }}
      >
        <div
          className="flex size-full flex-col items-center justify-center gap-4 px-4 py-16 sm:px-20"
          // A click on the empty area around the image closes the viewer.
          onClick={(e) => {
            if (e.target === e.currentTarget && !swiped.current) dialog.current?.close();
          }}
          // Reset per gesture: after a swipe the image is replaced, so its click may never fire.
          onPointerDown={(e) => {
            swipeStart.current = e.clientX;
            swiped.current = false;
          }}
          onPointerUp={(e) => {
            if (swipeStart.current === null) return;
            const dx = e.clientX - swipeStart.current;
            swipeStart.current = null;
            if (many && Math.abs(dx) > 50) {
              swiped.current = true;
              step(dx < 0 ? 1 : -1);
            }
          }}
        >
          {photo && (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={1200}
              // The originals are small (200-350 px), so serve them as they are.
              unoptimized
              draggable={false}
              onLoad={(e) => setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              // Up to twice the natural size (more only blurs), within the screen.
              style={size && { width: `min(${size.w * 2}px, 100%, calc(70vh * ${size.w / size.h}))` }}
              className={`h-auto select-none rounded-2xl bg-white shadow-2xl transition-opacity duration-200 ${
                size ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
          <p className="text-center text-sm text-white/85">
            {photo?.alt}
            {many && (
              <span className="ml-3 text-white/55">
                {index + 1} / {photos.length}
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
          className={`${roundButton} absolute right-4 top-4`}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        {many && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => step(-1)}
              className={`${roundButton} absolute left-3 top-1/2 -translate-y-1/2 sm:left-6`}
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => step(1)}
              className={`${roundButton} absolute right-3 top-1/2 -translate-y-1/2 sm:right-6`}
            >
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </dialog>
    </OpenContext>
  );
}

const roundButton =
  "grid size-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// A gallery thumbnail. Opens the viewer; still a link to the file, so a modified
// click opens it in a new tab and it works without JavaScript.
export function GalleryImage({ src, alt }: GalleryPhoto) {
  const open = useContext(OpenContext);
  return (
    <a
      href={src}
      aria-haspopup="dialog"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open(src);
      }}
      className="group relative block aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10"
    >
      <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-contain p-3 transition duration-500 group-hover:scale-105" />
      <span
        aria-hidden
        className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-brand/80 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
        </svg>
      </span>
    </a>
  );
}
