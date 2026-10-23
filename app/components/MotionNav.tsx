// 標記為瀏覽器端元件（需要追蹤滑鼠位置、開關下拉選單）
"use client";

// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React hook
import { useEffect, useRef, useState } from "react";
// 匯入分類連結型別
import type { CategoryLink } from "../lib/ui";

// 彈簧曲線：快速到位、微微回彈（約等於 stiffness 350、damping 32 的彈簧）
const spring = "ease-[cubic-bezier(.22,1.12,.36,1)] duration-[420ms]";

// 滑動底色的位置與大小
type Box = { x: number; y: number; w: number; h: number };

// 滑動底色：滑鼠移到哪一項，淡紅圓角底色就以彈簧動態滑過去；離開清單時淡出
// 第一次出現時直接定位（不從左上角滑入）
function useHighlight() {
  // 底色位置；null 表示隱藏
  const [box, setBox] = useState<Box | null>(null);
  // 是否從隱藏狀態出現（出現當下不做滑動動畫）
  const [instant, setInstant] = useState(true);
  // 滑鼠移入某一項：以該項在清單中的位置為準
  const enter = (el: HTMLElement) => {
    setInstant(box === null);
    setBox({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  };
  // 離開清單：淡出
  const leave = () => setBox(null);
  return { box, instant, enter, leave };
}

// 底色元素：pad 為底色比項目四周多出的距離（px），不影響原本的排版
function Highlight({ box, instant, pad, className }: { box: Box | null; instant: boolean; pad: [number, number]; className: string }) {
  const [px, py] = pad;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 left-0 transition-[transform,width,height,opacity] ${instant ? "duration-0" : spring} ${box ? "opacity-100" : "opacity-0 duration-200"} ${className}`}
      style={box ? { transform: `translate(${box.x - px}px, ${box.y - py}px)`, width: box.w + px * 2, height: box.h + py * 2 } : undefined}
    />
  );
}

// 主選單一組按鈕（logo 左側或右側）：滑鼠移過時，淡紅底色在按鈕間滑動
// items 的 href 為 "/products" 時，改成「產品系列」下拉選單
export function MotionNavList({
  items,
  categories,
  linkClassName,
  className,
}: {
  items: { href: string; label: string }[];
  categories?: CategoryLink[];
  linkClassName: string;
  className: string;
}) {
  const hl = useHighlight();
  return (
    <nav aria-label="主選單" className={`relative ${className}`} onMouseLeave={hl.leave}>
      {/* 滑動底色：淡紅圓角，比文字左右多 10px、上下多 2px */}
      <Highlight {...hl} pad={[10, 2]} className="rounded-lg bg-brand/10" />
      {items.map((p) =>
        p.href === "/products" && categories ? (
          <ProductsMenu key={p.href} label={p.label} categories={categories} className={linkClassName} onHover={hl.enter} />
        ) : (
          <Link key={p.href} href={p.href} className={`relative ${linkClassName}`} onMouseEnter={(e) => hl.enter(e.currentTarget)} onFocus={(e) => hl.enter(e.currentTarget)}>
            {p.label}
          </Link>
        ),
      )}
    </nav>
  );
}

// 「產品系列」下拉選單：滑鼠移上或點擊打開，面板在 header 下方展開，內含 13 個系列（同樣有滑動底色）
function ProductsMenu({
  label,
  categories,
  className,
  onHover,
}: {
  label: string;
  categories: CategoryLink[];
  className: string;
  onHover: (el: HTMLElement) => void;
}) {
  // 是否打開
  const [open, setOpen] = useState(false);
  // 面板位置：上緣（header 下緣）、左緣、指示箭頭的水平位置
  const [pos, setPos] = useState({ top: 0, left: 0, arrow: 0 });
  // 觸發按鈕
  const trigger = useRef<HTMLButtonElement>(null);
  // 延遲關閉的計時器（滑鼠從按鈕移到面板途中不關閉）
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // 面板內的滑動底色
  const hl = useHighlight();

  // 面板寬度（px）
  const WIDTH = 600;

  // 打開：依按鈕與 header 的位置計算面板座標（不超出畫面左右）
  const show = () => {
    clearTimeout(timer.current);
    const btn = trigger.current;
    const header = btn?.closest("header");
    if (!btn || !header) return;
    const b = btn.getBoundingClientRect();
    const h = header.getBoundingClientRect();
    const left = Math.max(16, Math.min(b.left + b.width / 2 - 120, window.innerWidth - WIDTH - 16));
    setPos({ top: h.bottom + 10, left, arrow: b.left + b.width / 2 - left });
    setOpen(true);
  };
  // 延遲 120ms 關閉
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  // 打開時：捲動頁面或按 Esc 就關閉；元件移除時清除計時器
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      {/* 觸發按鈕：右側小箭頭，打開時翻轉 */}
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? setOpen(false) : show())}
        onMouseEnter={(e) => {
          onHover(e.currentTarget);
          show();
        }}
        onMouseLeave={hide}
        onFocus={(e) => onHover(e.currentTarget)}
        className={`relative inline-flex items-center gap-1.5 ${className} ${open ? "text-brand-deep" : ""}`}
      >
        {label}
        <svg viewBox="0 0 10 6" aria-hidden="true" className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {/* 下拉面板：固定在 header 下方；由上方淡入並微微放大（彈簧曲線） */}
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        className={`fixed z-50 origin-top-left transition-[opacity,transform,visibility] ${spring} ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[.97] opacity-0 duration-200"
        }`}
        style={{ top: pos.top, left: pos.left, width: WIDTH }}
      >
        {/* 指示箭頭：指向「產品系列」按鈕 */}
        <span
          aria-hidden="true"
          className="absolute -top-1.5 h-3 w-3 rotate-45 rounded-[2px] bg-white shadow-[-1px_-1px_0_0_rgba(15,15,14,.06)] transition-[left] duration-300"
          style={{ left: pos.arrow - 6 }}
        />
        {/* 面板本體：白色圓角卡片 */}
        <div className="rounded-[18px] bg-white p-3 shadow-[0_0_0_1px_rgba(15,15,14,.06),0_24px_48px_-24px_rgba(15,15,14,.35)]">
          {/* 系列清單：兩欄，滑鼠移過時淡紅底色＋細框滑動 */}
          <ul className="relative grid grid-cols-2 gap-1" onMouseLeave={hl.leave}>
            <Highlight {...hl} pad={[0, 0]} className="rounded-lg bg-brand/10 ring-1 ring-brand/15" />
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products/${c.slug}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={(e) => hl.enter(e.currentTarget)}
                  onFocus={(e) => hl.enter(e.currentTarget)}
                  className="relative flex items-center gap-3 rounded-lg px-4 py-3 text-base tracking-[0.08em] transition-colors hover:text-brand-deep"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* 底部：全部產品系列與電子目錄 */}
          <div className="mt-2 flex items-center justify-between border-t border-line px-4 pt-3 pb-1 text-sm tracking-[0.12em]">
            <Link href="/products" onClick={() => setOpen(false)} className="group inline-flex items-center gap-2 text-brand-deep">
              查看全部產品系列
              <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/catalog" onClick={() => setOpen(false)} className="text-muted transition hover:text-brand-deep">
              產品電子目錄
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
