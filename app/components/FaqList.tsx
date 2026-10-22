// 標記為瀏覽器端元件（需要記錄目前展開的題目）
"use client";

// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的 id 與狀態 hook
import { useId, useState } from "react";

// 單一問答；link 為延伸閱讀（選填）
export type Faq = { q: string; a: string; link?: { href: string; label: string } };

// 彈簧感的緩動曲線（略為超出再回彈），用於卡片縮放與高度展開
const spring = "ease-[cubic-bezier(.34,1.25,.64,1)]";

// 常見問題清單：每題一張白色圓角卡片，一次只展開一題
// 收合時答案仍輸出在 HTML 中（高度為 0），搜尋引擎可直接讀取
export default function FaqList({ faqs }: { faqs: Faq[] }) {
  // 目前展開的題目索引；null 表示全部收合
  const [open, setOpen] = useState<number | null>(null);
  // 產生不重複的 id，讓按鈕與答案區互相對應（輔助科技用）
  const baseId = `faq-${useId().replace(/:/g, "")}`;

  return (
    // 卡片間距 10px
    <div className="flex flex-col gap-2.5">
      {faqs.map((f, i) => {
        // 這一題是否展開
        const isOpen = open === i;
        // 問題按鈕與答案區的 id
        const triggerId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          // 白色圓角卡片：收合時縮小到 98.5%，展開時回到原尺寸（以上緣為基準縮放）；展開時加深陰影與淡紅細框
          <div
            key={f.q}
            className={`origin-top overflow-hidden rounded-[22px] bg-white transition duration-500 sm:rounded-[28px] ${spring} ${
              isOpen
                ? "scale-100 shadow-[0_0_0_1px_rgba(214,31,42,.18),0_18px_36px_-22px_rgba(15,15,14,.35)]"
                : "scale-[.985] shadow-[0_0_0_1px_rgba(15,15,14,.06)] hover:shadow-[0_0_0_1px_rgba(214,31,42,.18)]"
            }`}
          >
            {/* 問題列：整列可點擊，再點一次收合 */}
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 py-4 pr-3 pl-5 text-left text-base tracking-[0.08em] transition sm:py-5 sm:pr-4 sm:pl-7 sm:text-lg ${
                  isOpen ? "text-brand-deep" : "hover:text-brand-deep"
                }`}
              >
                <span className="text-pretty">{f.q}</span>
                {/* 右側圖示：展開時旋轉 180 度並由「＋」變成「－」 */}
                <span
                  aria-hidden="true"
                  className={`inline-flex size-10 shrink-0 items-center justify-center text-brand transition duration-500 sm:size-12 ${spring} ${
                    isOpen ? "scale-105 rotate-180" : ""
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {/* 橫線：一直顯示 */}
                    <path d="M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    {/* 直線：展開時隱藏，變成「－」 */}
                    <path
                      d="M7 1v12"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      className={`transition-opacity duration-200 ${isOpen ? "opacity-0" : "opacity-100"}`}
                    />
                  </svg>
                </span>
              </button>
            </h3>

            {/* 答案區：用 grid 列高 0fr ↔ 1fr 做高度展開，同時淡入 */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ${spring} ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {/* 答案內容：展開時由上方 8px 滑入；收合時移出 Tab 順序 */}
                <div
                  inert={!isOpen}
                  className={`max-w-3xl px-5 pb-6 text-sm leading-7 text-pretty text-muted transition-transform duration-500 sm:px-7 sm:pb-7 sm:text-[15px] sm:leading-8 ${spring} ${
                    isOpen ? "translate-y-0" : "-translate-y-2"
                  }`}
                >
                  <p>{f.a}</p>
                  {/* 延伸閱讀連結 */}
                  {f.link && (
                    <Link href={f.link.href} className="mt-2 inline-flex min-h-11 items-center text-brand-deep transition hover:opacity-70">
                      {f.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
