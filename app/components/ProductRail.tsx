"use client";

import Image from "next/image";
import { useRef } from "react";

export default function ProductRail({ images, alt }: { images: string[]; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src) => (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noreferrer"
            className="group block w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-3.75rem)/4)]"
          >
            <div className="relative aspect-square overflow-hidden bg-ivory">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 hidden justify-end gap-2 sm:flex">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scroll(dir)}
            aria-label={dir < 0 ? "上一組" : "下一組"}
            className="flex h-11 w-11 items-center justify-center border border-line transition hover:border-ink"
          >
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" className={dir < 0 ? "rotate-180" : ""}>
              <path d="M0 5h15M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
