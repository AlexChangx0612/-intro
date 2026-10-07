"use client";

import Image from "next/image";
import { useState } from "react";
import type { Category } from "../lib/products";

export default function ProductCatalog({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveId(c.id)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              c.id === active.id
                ? "border-transparent bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-500/30"
                : "border-white/70 bg-white/50 backdrop-blur hover:bg-white/80"
            }`}
          >
            {c.name}
            <span className={`ml-1.5 text-xs ${c.id === active.id ? "text-white/80" : "text-slate-400"}`}>
              {c.images.length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/60 bg-white/30 p-6 backdrop-blur-xl">
        <h3 className="text-2xl font-semibold">{active.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{active.desc}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {active.images.map((src) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg shadow-slate-900/5 transition hover:-translate-y-1"
            >
              <Image
                src={src}
                alt={`${active.name}產品照`}
                width={750}
                height={750}
                sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                className="aspect-square h-auto w-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
