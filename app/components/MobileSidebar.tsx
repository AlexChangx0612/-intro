// 標記為瀏覽器端元件（需要目前網址、滑鼠位置）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入目前網址 hook
import { usePathname } from "next/navigation";
// 匯入 React hook
import { useState } from "react";
// 匯入分類連結型別
import type { CategoryLink } from "../lib/ui";

// 彈簧曲線：滑入快速到位、微微回彈
const spring = "ease-[cubic-bezier(.22,1.12,.36,1)]";

// 單一項目：左側尺規刻度（細線）＋較長的短線，選中時短線變長變紅、文字右移
function Item({
  href,
  label,
  active,
  index,
  open,
  preview,
  onClose,
  onPreview,
}: {
  href: string;
  label: string;
  active: boolean;
  index: number;
  open: boolean;
  preview?: string;
  onClose: () => void;
  onPreview: (p: { src: string; x: number; y: number } | null) => void;
}) {
  // 滑鼠移上時顯示預覽圖（只在有滑鼠的裝置）
  const move = (e: React.PointerEvent) => {
    if (preview && e.pointerType === "mouse") onPreview({ src: preview, x: e.clientX, y: e.clientY });
  };
  return (
    <li
      // 打開時逐項由左淡入（每項延遲 25ms）
      className={`transition-[opacity,transform] duration-500 ${spring} ${open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}
      style={{ transitionDelay: open ? `${120 + index * 25}ms` : "0ms" }}
    >
      <Link
        href={href}
        onClick={onClose}
        onPointerMove={move}
        onPointerLeave={() => onPreview(null)}
        aria-current={active ? "page" : undefined}
        className="group relative flex min-h-11 items-center"
      >
        {/* 尺規刻度：每 7px 一條細線，貫穿整列（與上下項目相連） */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3.5 bg-[repeating-linear-gradient(to_bottom,rgba(15,15,14,.14)_0_1px,transparent_1px_7px)]" />
        {/* 項目短線：一般 18px 灰；滑鼠移上 24px；選中 30px 品牌紅 */}
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-0 h-px transition-[width,background-color] duration-500 ${spring} ${
            active ? "w-[30px] bg-brand" : "w-[18px] bg-ink/35 group-hover:w-6 group-hover:bg-ink/60"
          }`}
        />
        {/* 文字：選中時右移並變深 */}
        <span
          className={`pl-8 text-base tracking-[0.1em] transition-[transform,color] duration-500 ${spring} ${
            active ? "translate-x-2 text-ink" : "text-muted group-hover:translate-x-1 group-hover:text-ink"
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}

// 分區：標題＋淡色數量；沒有 label 時不顯示標題列
function Section({ label, count, children }: { label?: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-8">
      {label && (
        <p className="mb-3 text-sm tracking-[0.2em] text-muted">
          {label}
          <span className="ml-2 text-xs text-muted/60">{count}</span>
        </p>
      )}
      <ul>{children}</ul>
    </section>
  );
}

// 手機、平板的側欄選單：從左側以彈簧動態滑入；尺規刻度的項目，目前頁面以紅色長線標示
// 有滑鼠的平板移到產品系列上，會在游標旁顯示該系列的產品圖
export default function MobileSidebar({
  open,
  onClose,
  pages,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  pages: { href: string; label: string }[];
  categories: CategoryLink[];
}) {
  // 目前網址（判斷選中項目）
  const pathname = usePathname();
  // 游標旁的預覽圖
  const [preview, setPreview] = useState<{ src: string; x: number; y: number } | null>(null);
  // 關閉時同時收起預覽
  const close = () => {
    setPreview(null);
    onClose();
  };

  return (
    // 覆蓋整個畫面，層級高於 header；關閉時保留在畫面上做收合動畫，但不可點擊、不可聚焦
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      {/* 半透明背景，點擊關閉 */}
      <button
        type="button"
        aria-label="關閉選單"
        onClick={close}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* 側欄面板：淺暖白底，從左側滑入（彈簧曲線）、內容過長可捲動 */}
      <nav
        aria-label="選單"
        className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-paper px-7 pt-5 pb-12 shadow-[24px_0_48px_-32px_rgba(15,15,14,.45)] transition-transform duration-[600ms] sm:px-10 ${spring} ${
          open ? "translate-x-0" : "-translate-x-full duration-300 ease-in"
        }`}
      >
        {/* 關閉按鈕 */}
        <button type="button" onClick={close} className="flex h-11 items-center gap-3 self-start text-sm tracking-[0.15em]">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          關閉
        </button>

        {/* 網站頁面 */}
        <Section>
          {pages.map((p, i) => (
            <Item key={p.href} {...p} index={i} open={open} active={pathname === p.href} onClose={close} onPreview={setPreview} />
          ))}
        </Section>

        {/* 產品系列（有滑鼠時顯示去背產品圖預覽） */}
        <Section label="產品系列" count={categories.length}>
          {categories.map((c, i) => (
            <Item
              key={c.id}
              href={`/products/${c.slug}`}
              label={c.name}
              index={pages.length + i}
              open={open}
              active={pathname.startsWith(`/products/${c.slug}`)}
              preview={`/cutouts/${c.slug}.png`}
              onClose={close}
              onPreview={setPreview}
            />
          ))}
        </Section>
      </nav>

      {/* 游標旁的預覽卡：白色圓角，跟著游標移動 */}
      {preview && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-10 h-32 w-40 animate-[fade-in_.2s_ease-out] rounded-[14px] bg-white p-3 shadow-[0_0_0_1px_rgba(15,15,14,.06),0_18px_36px_-18px_rgba(15,15,14,.4)]"
          style={{ transform: `translate(${preview.x + 20}px, ${preview.y - 64}px)` }}
        >
          <span className="relative block h-full w-full">
            <Image src={preview.src} alt="" fill sizes="160px" className="object-contain" />
          </span>
        </div>
      )}
    </div>
  );
}
