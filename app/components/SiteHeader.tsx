"use client";

import { useEffect, useState } from "react";
import { container, type CategoryLink } from "../lib/ui";

const pages = [
  { href: "#products", label: "全系列商品" },
  { href: "#onsale", label: "特價商品" },
  { href: "#applications", label: "適用場域" },
  { href: "#contact", label: "聯絡我們" },
];

export default function SiteHeader({ categories }: { categories: CategoryLink[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
          scrolled ? "border-line bg-white" : "border-transparent bg-transparent"
        }`}
      >
        <div className={`${container} grid h-16 grid-cols-[1fr_auto_1fr] items-center`}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="開啟選單"
            aria-expanded={open}
            className="flex items-center gap-3 justify-self-start py-2 text-sm tracking-[0.15em]"
          >
            <svg width="20" height="10" viewBox="0 0 20 10" aria-hidden="true">
              <path d="M0 1h20M0 9h20" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="hidden sm:inline">選單</span>
          </button>

          <a href="#" className="text-center leading-none">
            <span className="block pl-[0.45em] font-serif text-lg tracking-[0.45em] sm:text-xl">世紘興業</span>
            <span className="mt-1.5 block pl-[0.4em] text-[9px] tracking-[0.4em] text-muted sm:text-[10px]">
              公共空間設備專家
            </span>
          </a>

          <a href="#contact" className="justify-self-end py-2 text-sm tracking-[0.15em] transition hover:opacity-60">
            聯絡<span className="hidden sm:inline">我們</span>
          </a>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="關閉選單"
            onClick={close}
            className="absolute inset-0 animate-[fade-in_.3s_ease-out] bg-ink/30"
          />
          <nav className="absolute inset-y-0 left-0 flex w-full max-w-md animate-[drawer-in_.4s_cubic-bezier(.2,.7,.2,1)] flex-col overflow-y-auto bg-white px-8 pt-5 pb-12 sm:px-12">
            <button
              type="button"
              onClick={close}
              className="flex h-11 items-center gap-3 self-start text-sm tracking-[0.15em]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              關閉
            </button>

            <p className="mt-10 text-[11px] tracking-[0.35em] text-muted">產品系列</p>
            <ul className="mt-4 space-y-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#c-${c.id}`}
                    onClick={close}
                    className="block py-2 font-serif text-lg tracking-[0.08em] transition hover:opacity-60"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="mt-10 space-y-1 border-t border-line pt-8">
              {pages.map((p) => (
                <li key={p.href}>
                  <a href={p.href} onClick={close} className="block py-2 text-sm tracking-[0.12em] transition hover:opacity-60">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
