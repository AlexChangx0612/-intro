// 標記為瀏覽器端元件（分頁自動輪播、滑鼠移入暫停、色票換色）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的 hook：狀態、DOM 參照、訂閱瀏覽器設定
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
// 匯入區塊標題元件
import SectionTitle from "./SectionTitle";
// 匯入輪播內容與首頁系列標籤設定（換新品請改這個檔案）
import { featuredCategoryIds, spotlight, type SpotlightSlide } from "../lib/spotlight";
// 匯入分類連結型別
import type { CategoryLink } from "../lib/ui";
// 匯入公司資料（LINE QR Code 圖檔路徑）
import { company } from "../lib/site";

// 每頁停留時間（毫秒），與紅色進度線動畫同長
const DURATION = 6000;

// 「減少動態效果」的媒體查詢
const reducedMotionQuery = () => window.matchMedia("(prefers-reduced-motion: reduce)");
// 監聽設定變更（給 useSyncExternalStore 使用）
function subscribeReducedMotion(onChange: () => void) {
  const mq = reducedMotionQuery();
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// 首頁「產品系列」標題區：左邊標題＋系列入口，右邊分頁式輪播（新品上市／專員規劃／LINE 諮詢）
export default function CollectionsSpotlight({ categories }: { categories: CategoryLink[] }) {
  // 目前顯示第幾頁
  const [index, setIndex] = useState(0);
  // 滑鼠移入、鍵盤聚焦分開記錄，任一成立就暫停（避免滑鼠移出時把鍵盤使用者的暫停解除）
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  // 使用者系統設定「減少動態效果」時不自動輪播；伺服器端一律視為「減少」，
  // 讓輸出的 HTML 不帶動畫，避免 hydration 完成前動畫就跑完而停住
  const reduced = useSyncExternalStore(subscribeReducedMotion, () => reducedMotionQuery().matches, () => true);
  // 分頁按鈕（方向鍵切換時移動焦點）
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 首頁系列標籤：依設定的順序挑出分類
  const featured = featuredCategoryIds.flatMap((id) => categories.filter((c) => c.id === id));
  // 換到第 n 頁（超出範圍時繞回）
  const go = (n: number) => setIndex((n + spotlight.length) % spotlight.length);

  // 分頁列鍵盤操作：左右方向鍵切換分頁、Home／End 跳到第一頁／最後一頁，並移動焦點
  const onTabKey = (e: KeyboardEvent) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    // 以目前聚焦的分頁為起點（找不到時用目前顯示的頁）
    const from = tabRefs.current.findIndex((el) => el === document.activeElement);
    const base = from === -1 ? index : from;
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? spotlight.length - 1 : (base + (e.key === "ArrowRight" ? 1 : -1) + spotlight.length) % spotlight.length;
    go(next);
    tabRefs.current[next]?.focus();
  };

  return (
    // 手機上下排列，電腦左右兩欄（右欄較寬）
    <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-16">
      {/* 左側：標題、說明、系列入口 */}
      <div className="min-w-0">
        <SectionTitle
          align="left"
          title="產品系列"
          desc={`${categories.length} 大系列，全系列台灣製造。選擇系列瀏覽，或往下看完整目錄。`}
        />
        {/* 系列標籤：點了切換下方目錄到該系列；手機一排左右滑，電腦自動換行 */}
        <ul className="-mx-5 mt-7 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {featured.map((c) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#c-${c.id}`}
                className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pr-4 pl-1 text-sm transition hover:border-brand-deep hover:text-brand-deep"
              >
                {/* 分類去背圖（裝飾用） */}
                <span className="relative size-8 overflow-hidden rounded-full bg-paper">
                  <Image src={`/cutouts/${c.slug}.png`} alt="" fill sizes="32px" className="object-contain p-0.5" />
                </span>
                {c.name}
              </a>
            </li>
          ))}
          {/* 其餘系列：捲到下方完整目錄 */}
          <li className="shrink-0">
            <a
              href="#products"
              className="flex h-full items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm text-brand-deep transition hover:border-brand-deep"
            >
              全部 {categories.length} 系列
              <span aria-hidden="true">↓</span>
            </a>
          </li>
        </ul>
        {/* 電子目錄連結（與「點擊查看○○所有產品」相同的紅字箭頭樣式） */}
        <p className="mt-6">
          <Link href="/catalog" className="group inline-flex items-center gap-3 text-sm tracking-[0.15em] text-brand-deep">
            瀏覽產品電子目錄
            <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
          </Link>
        </p>
      </div>

      {/* 右側：分頁式輪播卡片；滑鼠移入或聚焦時暫停 */}
      <div
        className="min-w-0 overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06),0_18px_40px_-24px_rgba(214,31,42,.35)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          // 焦點移到卡片外才解除
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
        }}
      >
        {/* 各頁疊在同一格，高度以最高的一頁為準；非目前頁淡出且無法操作 */}
        <div className="grid">
          {spotlight.map((s, i) => (
            <div
              key={s.id}
              id={`spotlight-panel-${s.id}`}
              role="tabpanel"
              aria-labelledby={`spotlight-tab-${s.id}`}
              aria-hidden={i !== index}
              inert={i !== index}
              className={`[grid-area:1/1] transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              <Slide slide={s} />
            </div>
          ))}
        </div>

        {/* 分頁列：三個分頁，目前分頁上方的紅線跑完就換下一頁 */}
        <div role="tablist" aria-label="新品與服務" className="grid grid-cols-3 border-t border-black/[.06]" onKeyDown={onTabKey}>
          {spotlight.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`spotlight-tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-controls={`spotlight-panel-${s.id}`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => go(i)}
              className="relative border-r border-black/[.06] px-3 py-3 text-left last:border-r-0 sm:px-4"
            >
              {/* 進度線：目前分頁才顯示；伺服器端或減少動態效果時直接填滿不跑動畫 */}
              {i === index && (
                <span
                  key={index}
                  aria-hidden="true"
                  className="absolute inset-x-0 -top-px h-0.5 origin-left bg-brand"
                  style={
                    reduced
                      ? undefined
                      : { animation: `spotlight-progress ${DURATION}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }
                  }
                  onAnimationEnd={() => go(index + 1)}
                />
              )}
              {/* 分頁名稱與副標 */}
              <span className={`block text-sm font-bold ${i === index ? "text-brand-deep" : "text-ink"}`}>{s.tab}</span>
              <span className="block text-xs text-muted">{s.tabSub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 單一頁面內容：依種類呈現新品、服務或 LINE 諮詢
function Slide({ slide }: { slide: SpotlightSlide }) {
  if (slide.kind === "product") return <ProductSlide slide={slide} />;

  // LINE 諮詢：LINE 綠底黑字（白字在綠底上對比不足），白底按鈕另開新分頁；平板以上右側加 QR Code 給手機掃描
  if (slide.kind === "line")
    return (
      <div className="flex h-full items-center gap-6 bg-[#06c755] px-7 py-9 text-ink sm:px-9">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-xs tracking-[0.2em]">{slide.eyebrow}</p>
          <p className="mt-3 text-xl font-bold leading-snug sm:text-2xl">{slide.title}</p>
          <p className="mt-3 text-sm leading-7">{slide.desc}</p>
          <a
            href={slide.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 self-start rounded-full bg-white px-6 py-2.5 text-sm font-bold transition hover:bg-ink hover:text-white"
          >
            {slide.cta}
          </a>
        </div>
        <div className="hidden shrink-0 rounded-2xl bg-white p-2.5 text-center sm:block">
          <Image src={company.lineQr} alt="世紘興業 LINE 官方帳號 QR Code" width={540} height={540} className="size-32" />
          <p className="mt-1 text-xs">手機掃描加好友</p>
        </div>
      </div>
    );

  // 服務：白底漸層、標籤、標題、說明與連結
  return (
    <div className="flex h-full flex-col justify-center bg-gradient-to-br from-white from-55% to-[#fff1f1] px-7 py-9 sm:px-9">
      <span className="self-start rounded-full bg-ink px-3 py-1 text-xs font-bold tracking-[0.2em] text-white">{slide.badge}</span>
      <p className="mt-4 text-xl font-bold leading-snug sm:text-2xl">{slide.title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{slide.desc}</p>
      <Link href={slide.href} className="group mt-5 inline-flex items-center gap-2 self-start text-sm font-bold tracking-[0.1em] text-brand-deep">
        {slide.cta}
        <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

// 新品頁：產品照（織帶色塊隨色票換色）＋名稱、色票與連結
function ProductSlide({ slide }: { slide: Extract<SpotlightSlide, { kind: "product" }> }) {
  // 目前選的色票
  const [pick, setPick] = useState(0);
  const swatch = slide.swatches[pick];

  return (
    // 手機上下排列，平板以上左圖右文
    <div className="flex h-full flex-col sm:flex-row sm:items-center">
      {/* 產品照：灰白漸層底，最大 240px 正方形（不超過原圖尺寸，保持清晰）；不被文字欄擠壓 */}
      <div className="flex shrink-0 justify-center bg-gradient-to-br from-white to-[#efefef] p-4 sm:self-stretch sm:items-center">
        <div className="relative aspect-square w-full max-w-60 sm:w-60">
          <Image src={slide.image} alt={slide.imageAlt} width={240} height={240} quality={90} sizes="240px" className="block size-full mix-blend-multiply" />
          {/* 織帶色塊：疊在照片上的織帶位置，顏色為目前色票 */}
          <span
            aria-hidden="true"
            className="absolute transition-colors duration-300"
            style={{
              left: `${slide.belt.left}%`,
              top: `${slide.belt.top}%`,
              width: `${slide.belt.width}%`,
              height: `${slide.belt.height}%`,
              background: swatch.color,
            }}
          />
        </div>
      </div>
      {/* 文字：標籤、型號與名稱、色票、連結 */}
      <div className="px-7 pt-2 pb-8 sm:px-6 sm:py-6">
        <span className="inline-block rounded-full bg-brand-deep px-3 py-1 text-xs font-bold tracking-[0.2em] text-white">{slide.badge}</span>
        <p className="mt-3 text-xl font-bold leading-snug sm:text-2xl">
          {slide.model}
          <br />
          {slide.title}
        </p>
        <p className="mt-2 text-sm text-muted">{slide.desc}</p>
        {/* 色票：點了換織帶顏色 */}
        <div className="mt-3 flex gap-2.5" role="group" aria-label="織帶顏色">
          {slide.swatches.map((s, i) => (
            <button
              key={s.code}
              type="button"
              aria-label={`${s.name} ${s.code}`}
              aria-pressed={i === pick}
              onClick={() => setPick(i)}
              className={`size-7 rounded-full border-2 border-white transition ${i === pick ? "ring-2 ring-ink" : "ring-1 ring-black/15 hover:ring-black/40"}`}
              style={{ background: s.color }}
            />
          ))}
        </div>
        {/* 目前色名 */}
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {swatch.name} {swatch.code}
        </p>
        <Link href={slide.href} className="group mt-4 inline-flex items-center gap-2 text-sm font-bold tracking-[0.1em] text-brand-deep">
          {slide.cta}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}
