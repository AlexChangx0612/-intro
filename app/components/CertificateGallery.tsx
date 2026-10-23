// 標記為瀏覽器端元件（需要記錄目前放大的圖片）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的副作用與狀態 hook
import { useEffect, useState } from "react";
// 匯入證書資料型別
import type { Certificate } from "../lib/advantages";
// 匯入共用卡片樣式
import { card, cardHover } from "../lib/ui";

// 證書圖：依 crop 裁掉底部倒影；unoptimized 直接輸出原檔，不再壓縮，保留最清晰的畫質
// 顯示寬度不超過原圖像素（放大只會變糊）；maxH 有值時同時限制高度
function CertImage({ c, sizes, eager, maxH }: { c: Certificate; sizes: string; eager?: boolean; maxH?: number }) {
  // 裁切後的高度
  const h = c.height * (c.crop ?? 1);
  // 寬度上限：容器寬、原圖寬、（指定時）依高度上限換算的寬
  const limits = ["100%", `${c.width}px`, ...(maxH ? [`${Math.round((maxH * c.width) / h)}px`] : [])];
  return (
    <div className="mx-auto overflow-hidden" style={{ aspectRatio: `${c.width} / ${h}`, width: `min(${limits.join(", ")})` }}>
      <Image
        src={c.src}
        alt={`${c.title}${c.note ? `｜${c.note}` : ""}`}
        width={c.width}
        height={c.height}
        sizes={sizes}
        unoptimized
        loading={eager ? "eager" : "lazy"}
        className="h-auto w-full"
      />
    </div>
  );
}

// 證書格：點擊任一張放大檢視；cols 為電腦版欄數；frame 有值時圖片區固定高度（px），各卡片對齊
export default function CertificateGallery({ items, cols = 3, frame }: { items: Certificate[]; cols?: 1 | 2 | 3 | 5; frame?: number }) {
  // 目前放大的證書；null 表示沒有
  const [active, setActive] = useState<Certificate | null>(null);

  // 放大時：鎖住背景捲動，並可按 Esc 關閉
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  // 電腦版欄數
  const grid = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 5: "sm:grid-cols-3 lg:grid-cols-5" }[cols];

  return (
    <>
      <ul className={`grid gap-4 md:gap-5 ${grid}`}>
        {items.map((c) => (
          <li key={c.src}>
            {/* 白色卡片：上圖下文；點擊放大 */}
            <button
              type="button"
              onClick={() => setActive(c)}
              aria-label={`放大檢視：${c.title}`}
              className={`group block h-full w-full overflow-hidden text-left ${card} ${cardHover}`}
            >
              {/* 圖片四周留白，像裱框；frame 有值時固定高度、圖片置中 */}
              <div className="flex items-center bg-white p-4 lg:p-5" style={frame ? { height: frame + 40 } : undefined}>
                <CertImage c={c} maxH={frame} sizes={cols === 1 ? "100vw" : "(min-width: 1024px) 33vw, 100vw"} />
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-line px-5 py-4">
                <div>
                  <p className="text-base tracking-[0.1em] text-ink">{c.title}</p>
                  {c.note && <p className="mt-1 text-xs leading-6 text-muted">{c.note}</p>}
                </div>
                {/* 放大提示 */}
                <span className="shrink-0 text-xs tracking-[0.2em] text-brand-deep transition group-hover:translate-x-0.5">放大 ＋</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* 放大檢視：深色背景，圖片以原始像素大小顯示（不放大，避免變糊），超出畫面時等比例縮小 */}
      {active && (
        <div role="dialog" aria-modal="true" aria-label={active.title} className="fixed inset-0 z-50 flex flex-col animate-[fade-in_.25s_ease-out] bg-ink/90">
          {/* 標題列與關閉按鈕 */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-white sm:px-8">
            <p className="min-w-0 truncate text-sm tracking-[0.1em]">
              {active.title}
              {active.note && <span className="ml-3 text-white/70">{active.note}</span>}
            </p>
            <button type="button" onClick={() => setActive(null)} className="flex min-h-11 shrink-0 items-center gap-2 text-sm tracking-[0.15em]">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              關閉
            </button>
          </div>
          {/* 點擊背景也可關閉；圖片可捲動檢視 */}
          <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto px-4 pb-8 sm:px-8" onClick={() => setActive(null)}>
            <div
              className="w-full rounded-[10px] bg-white p-3"
              style={{ maxWidth: active.width + 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CertImage c={active} sizes={`${active.width}px`} eager />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
