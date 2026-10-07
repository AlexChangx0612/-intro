"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Category } from "../lib/products";

const PAGE_SIZE = 12;

export default function ProductCatalog({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  const select = (id: string) => {
    setActiveId(id);
    setVisible(PAGE_SIZE);
  };

  // 其他區塊以 #c-<分類 id> 連結到這裡，切換分類並捲動至商品區
  useEffect(() => {
    const sync = () => {
      if (!location.hash.startsWith("#c-")) return;
      const id = location.hash.slice(3);
      history.replaceState(null, "", location.pathname + location.search);
      if (!categories.some((c) => c.id === id)) return;
      setActiveId(id);
      setVisible(PAGE_SIZE);
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [categories]);

  const shown = active.images.slice(0, visible);
  const remaining = active.images.length - shown.length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <p className="hidden text-[11px] tracking-[0.35em] text-muted lg:block">分類</p>
        <nav className="-mx-5 flex gap-7 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-5 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-l lg:px-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => select(c.id)}
              className={`-mb-px shrink-0 border-b py-3.5 text-sm tracking-[0.08em] whitespace-nowrap transition lg:mb-0 lg:-ml-px lg:border-b-0 lg:border-l lg:py-2.5 lg:pl-5 lg:text-left ${
                c.id === active.id ? "border-ink font-normal text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <div className="border-b border-line pb-6">
          <h3 className="font-serif text-2xl font-normal tracking-[0.1em]">{active.name}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{active.desc}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5 sm:gap-y-5 md:grid-cols-3">
          {shown.map((src) => (
            <a key={src} href={src} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-square overflow-hidden bg-ivory">
                <Image
                  src={src}
                  alt={`${active.name}產品照`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </a>
          ))}
        </div>

        {remaining > 0 && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="border border-ink px-12 py-3.5 text-sm tracking-[0.2em] transition hover:bg-ink hover:text-white"
            >
              顯示更多
            </button>
            <p className="mt-3 text-xs text-muted">
              已顯示 {shown.length} / {active.images.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
