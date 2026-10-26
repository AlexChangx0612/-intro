// 標記為瀏覽器端元件（需要記錄目前選擇的國家）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的狀態 hook
import { useState } from "react";
// 匯入證書資料型別
import type { Certificate } from "../lib/advantages";

// 專利證書分頁：一排國家按鈕，下方白底大框顯示該國的證書（同一國有多張時上下排列）
// 證書依 crop 裁掉原圖底部的倒影；顯示高度上限 360px，寬度不超過原圖像素
export default function PatentTabs({ items }: { items: Certificate[] }) {
  // 依國家分組，保留資料中的順序
  const countries = [...new Set(items.map((c) => c.title))];
  // 目前選擇的國家
  const [picked, setPicked] = useState(countries[0]);
  const current = items.filter((c) => c.title === picked);

  return (
    <>
      {/* 國家按鈕：選中為黑底白字 */}
      <div role="group" aria-label="選擇國家" className="mt-10 flex flex-wrap gap-2">
        {countries.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === picked}
            onClick={() => setPicked(name)}
            className={`min-h-12 px-6 text-base font-medium transition ${name === picked ? "bg-ink text-white" : "bg-[#e6e2da] text-ink hover:bg-[#d9d4ca]"}`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* 證書大框 */}
      <figure className="mt-4 flex min-h-[360px] flex-col items-center justify-center gap-6 bg-white p-6 sm:p-14">
        {current.map((c) => {
          // 裁切後的高度與寬高比
          const h = c.height * (c.crop ?? 1);
          return (
            <div
              key={c.src}
              className="overflow-hidden"
              style={{ aspectRatio: `${c.width} / ${h}`, width: `min(100%, ${c.width}px, ${Math.round((360 * c.width) / h)}px)` }}
            >
              <Image src={c.src} alt={`${c.title}${c.note ? `｜${c.note}` : ""}`} width={c.width} height={c.height} sizes="(min-width: 1024px) 1000px, 100vw" unoptimized className="h-auto w-full" />
            </div>
          );
        })}
        <figcaption className="self-start text-base font-medium">
          {picked}・{current[0].note}
        </figcaption>
      </figure>
    </>
  );
}
