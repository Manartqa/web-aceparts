"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, nav } from "@/content/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent over the home hero; solid everywhere else.
  const solid = scrolled || menuOpen || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-brand/95 shadow-lg shadow-brand-deep/20 backdrop-blur-md"
          : "bg-gradient-to-b from-brand-deep/70 to-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          solid ? "h-16" : "h-24"
        }`}
      >
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt={company.name}
            width={128}
            height={102}
            priority
            className={`w-auto transition-all duration-300 ${solid ? "h-11" : "h-16"}`}
          />
          <span className="hidden font-display text-lg font-semibold tracking-wide text-white sm:block">
            {company.name}
          </span>
        </Link>

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = item.href === pathname;
              return (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 font-display text-[15px] font-semibold uppercase tracking-wider transition-colors ${
                      active ? "text-accent" : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <svg className="size-3.5 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
                      </svg>
                    )}
                  </Link>
                  {item.children && (
                    <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="overflow-hidden rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-soft hover:text-brand"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-brand px-4 pb-6 lg:hidden" aria-label="Mobile">
          <ul className="space-y-1 pt-3">
            {nav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 font-display text-base font-semibold uppercase tracking-wider text-white hover:bg-white/10"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-2 ml-4 border-l border-white/15 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-white/75 hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
