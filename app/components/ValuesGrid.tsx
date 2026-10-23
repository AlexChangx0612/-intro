// 標記為瀏覽器端元件（需要偵測區塊進入畫面）
"use client";

// 匯入 React 的副作用、參照與狀態 hook
import { useEffect, useRef, useState, type ReactNode } from "react";
// 匯入共用樣式
import { bodyText, card, cardHover, cardTitle } from "../lib/ui";

// 單一理念：標題、說明與圖示代號
export type Value = { title: string; desc: string; icon: keyof typeof icons };

// 理念圖示：Lucide 線條圖示（ISC 授權），與產品系列圖示同為細線風格
const icons = {
  // 燈泡：創新
  idea: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
  // 盾牌打勾：品質
  quality: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // 握手：誠信
  trust: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
} satisfies Record<string, ReactNode>;

// 企業理念卡片格：進入畫面時卡片依序由下往上淡入；滑鼠移上微微浮起
export default function ValuesGrid({ values }: { values: Value[] }) {
  // 卡片清單（用來偵測是否進入畫面）
  const listRef = useRef<HTMLUListElement>(null);
  // 是否已進入畫面（只觸發一次）
  const [shown, setShown] = useState(false);

  // 清單進入畫面（往內 100px）時顯示卡片
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // 手機一欄、平板以上三欄
    <ul ref={listRef} className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
      {values.map((v, i) => (
        // 進場動畫：依序延遲 90ms；系統設定「減少動態效果」時直接顯示
        <li
          key={v.title}
          style={{ transitionDelay: `${i * 90}ms` }}
          className={`transition-[opacity,translate] duration-700 ease-[cubic-bezier(.34,1.2,.64,1)] ${
            shown ? "translate-y-0 opacity-100" : "motion-safe:translate-y-5 motion-safe:opacity-0"
          }`}
        >
          {/* 白色卡片：細框圓角；滑鼠移上浮起並加陰影 */}
          <article className={`relative h-full p-6 lg:p-8 ${card} ${cardHover}`}>
            {/* 圖示：淡紅底圓角方塊＋品牌紅線條 */}
            <div className="inline-flex rounded-[12px] bg-blush p-3 text-brand-deep">
              <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                {icons[v.icon]}
              </svg>
            </div>
            {/* 理念名稱 */}
            <h3 className={`${cardTitle} mt-6`}>{v.title}</h3>
            {/* 說明 */}
            <p className={`${bodyText} mt-3`}>{v.desc}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
