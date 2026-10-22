// 標記為瀏覽器端元件（需要計時輪播、處理點擊與滑動）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的 hook：記憶函式、副作用、DOM 參照、狀態
import { useCallback, useEffect, useRef, useState } from "react";
// 匯入第 1 張的主視覺插圖
import HeroArt from "./HeroArt";
// 匯入視差捲動元件
import Parallax from "./Parallax";

// 自動輪播間隔：6000 毫秒（6 秒）
const INTERVAL = 6000;

// 產品輪播頁的資料型別
type ProductSlide = {
  // 英文小標
  eyebrow: string;
  // 主標題
  title: string;
  // 說明文字
  desc: string;
  // 產品圖片路徑
  image: string;
  // 圖片替代文字
  alt: string;
  // 行動按鈕：連結與文字
  cta: { href: string; label: string };
};

// 第 1 張為原本的主視覺，其後為產品輪播
const productSlides: ProductSlide[] = [
  // 第 2 張：伸縮帶欄柱
  {
    eyebrow: "RETRACTABLE BARRIERS",
    title: "伸縮帶欄柱",
    desc: "萬向系列伸縮織帶紅龍柱，以及柱頭告示框、防塵蓋等配件。",
    image: "/images/001/001-001-001.png",
    alt: "萬向系列伸縮帶欄柱 RS-A4SR",
    // 按鈕連到伸縮帶欄柱分類
    cta: { href: "#c-retractable", label: "查看系列" },
  },
  // 第 3 張：企業識別客製
  {
    eyebrow: "CUSTOM BRANDING",
    title: "企業識別客製",
    desc: "拒馬看板、告示牌與海報架，皆可置入貴公司的品牌視覺。",
    image: "/images/012/012-001-001.png",
    alt: "可置入品牌看板的烤漆拒馬 TS-209BK",
    // 按鈕連到聯絡區塊
    cta: { href: "#contact", label: "免費諮詢" },
  },
  // 第 4 張：台灣製造
  {
    eyebrow: "MADE IN TAIWAN",
    title: "台灣製造",
    desc: "多款欄柱與設備於台灣在地生產，品質穩定，溝通即時。",
    image: "/images/003/003-001-001.png",
    alt: "圓球頭不鏽鋼迎賓欄柱 SW-R1S(A)",
    // 按鈕連到迎賓欄柱分類
    cta: { href: "#c-rope", label: "查看迎賓欄柱" },
  },
];

// 輪播總張數：產品頁 3 張 + 主視覺 1 張
const TOTAL = productSlides.length + 1;

// 行動按鈕樣式：紅色底線文字，滑鼠移上變半透明；高度至少 44px 方便點按
const ctaLink = "inline-flex min-h-11 items-end border-b-2 border-brand pb-1.5 text-sm tracking-[0.25em] text-brand-deep transition hover:opacity-70";

// 箭頭圖示元件；dir 為 prev（左）或 next（右）
function Arrow({ dir }: { dir: "prev" | "next" }) {
  // 回傳箭頭 SVG
  return (
    // 18×18 的圖示，裝飾用
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {/* 箭頭折線 */}
      <path
        // 往左「<」或往右「>」的線條路徑
        d={dir === "prev" ? "M11 3L5 9l6 6" : "M7 3l6 6-6 6"}
        // 不填色
        fill="none"
        // 線條顏色跟隨文字顏色
        stroke="currentColor"
        // 線條粗細
        strokeWidth="1.6"
      />
    </svg>
  );
}

// 首頁輪播 Banner 元件
export default function HeroCarousel() {
  // 目前顯示第幾張（從 0 開始）
  const [index, setIndex] = useState(0);
  // 是否暫停自動輪播
  const [paused, setPaused] = useState(false);
  // 使用者是否開啟「減少動態效果」
  const [reduceMotion, setReduceMotion] = useState(false);
  // 記錄手指開始觸碰時的水平位置（判斷滑動用）
  const touchX = useRef<number | null>(null);

  // 跳到指定張數（超出範圍時自動循環）
  const go = useCallback((i: number) => setIndex((i + TOTAL) % TOTAL), []);
  // 往前或往後移動 d 張（以最新的張數計算，連點也不會出錯）
  const step = useCallback((d: number) => setIndex((i) => (i + d + TOTAL) % TOTAL), []);

  // 讀取並監聽系統的「減少動態效果」設定
  useEffect(() => {
    // 取得系統設定的查詢物件
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // 把系統設定同步到狀態
    const sync = () => setReduceMotion(mq.matches);
    // 載入時先同步一次
    sync();
    // 使用者更改設定時再同步
    mq.addEventListener("change", sync);
    // 元件移除時取消監聽
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 自動輪播；滑鼠停留、鍵盤聚焦或系統要求減少動態時暫停
  useEffect(() => {
    // 暫停中或減少動態時不自動播放
    if (paused || reduceMotion) return;
    // 6 秒後切到下一張
    const t = window.setTimeout(() => step(1), INTERVAL);
    // 換張或暫停時清除計時器
    return () => window.clearTimeout(t);
    // 這些值改變時重新計時
  }, [index, paused, reduceMotion, step]);

  // 每一張的樣式：全部疊在同一格，目前這張顯示，其他淡出隱藏
  const slideClass = (i: number) =>
    `col-start-1 row-start-1 transition-[opacity,visibility] duration-700 ease-out ${
      i === index ? "visible opacity-100" : "invisible opacity-0"
    }`;

  // 回傳輪播區塊
  return (
    // 輪播區塊
    <section
      // 告訴輔助工具這是輪播
      aria-roledescription="carousel"
      // 輪播名稱
      aria-label="主打 Banner"
      // 高度最多滿版（上限 960px），內容垂直置中，淡粉底；上方留白避開 header（手機 80px → 平板 96px → 電腦 144px）
      className="relative flex min-h-[min(100svh,960px)] flex-col justify-center overflow-hidden bg-ivory pt-20 sm:pt-24 lg:pt-36"
      // 滑鼠移入時暫停
      onMouseEnter={() => setPaused(true)}
      // 滑鼠移出時繼續
      onMouseLeave={() => setPaused(false)}
      // 鍵盤聚焦到裡面的按鈕時暫停
      onFocus={() => setPaused(true)}
      // 焦點完全離開輪播時才繼續
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      // 手指按下時記錄水平位置
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      // 手指放開時判斷滑動方向
      onTouchEnd={(e) => {
        // 沒有起點記錄就不處理
        if (touchX.current === null) return;
        // 計算水平滑動距離
        const dx = e.changedTouches[0].clientX - touchX.current;
        // 清除起點記錄
        touchX.current = null;
        // 滑動超過 50px 才換張：往左滑看下一張、往右滑看上一張
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
    >
      {/* 視差：往下捲時 Banner 內容移動較慢 */}
      <Parallax speed={0.3} origin="top">
        {/* 所有張數疊在同一個格子裡，底部留 80px 給控制列 */}
        <div className="grid pb-20">
          {/* 第 1 張：原主視覺 */}
          <div
            // 套用顯示／隱藏樣式
            className={slideClass(0)}
            // 告訴輔助工具這是一組內容
            role="group"
            // 告訴輔助工具這是一張投影片
            aria-roledescription="slide"
            // 例如「1 / 4」
            aria-label={`1 / ${TOTAL}`}
            // 不是目前這張時，對輔助工具隱藏
            aria-hidden={index !== 0}
            // 不是目前這張時，裡面的按鈕無法點擊或聚焦
            inert={index !== 0}
          >
            {/* 欄柱插圖區，水平置中 */}
            <div className="flex justify-center px-4 pt-10 sm:px-8">
              {/* 欄柱插圖：最寬 1152px；電腦版縮為 768px，讓標題與主要按鈕在第一屏就看得到 */}
              <HeroArt className="w-full max-w-6xl lg:max-w-3xl" />
            </div>
            {/* 文字區，置中 */}
            <div className="px-5 pt-10 text-center">
              {/* 英文小標 */}
              <p className="text-xs tracking-[0.35em] text-brand-deep">PUBLIC SPACE ESSENTIALS</p>
              {/* 主標題：品牌紅，手機 30px → 平板 54px → 電腦 64px */}
              <h1 className="mt-5 pl-[0.12em] text-[30px] tracking-[0.12em] text-brand sm:text-5xl lg:text-6xl">秩序，是空間的禮儀</h1>
              {/* 說明文字：灰字、最寬約 576px */}
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-balance text-muted">
                紅龍柱、排隊欄柱與公共空間設備，
                {/* 平板以上在這裡換行 */}
                <br className="hidden sm:block" />
                為銀行、醫院、商場與各式場館，打造從容而有分寸的動線。
              </p>
              {/* 行動按鈕：捲動到探索系列 */}
              <a href="#collections" className={`mt-10 ${ctaLink}`}>
                探索系列
              </a>
            </div>
          </div>

          {/* 第 2～4 張：產品輪播 */}
          {productSlides.map((s, n) => {
            // 實際張數編號（主視覺佔第 0 張，所以 +1）
            const i = n + 1;
            // 回傳一張產品投影片
            return (
              // 產品投影片
              <div
                // 唯一值
                key={s.title}
                // 顯示／隱藏樣式，並垂直置中
                className={`${slideClass(i)} self-center`}
                // 一組內容
                role="group"
                // 投影片
                aria-roledescription="slide"
                // 例如「2 / 4」
                aria-label={`${i + 1} / ${TOTAL}`}
                // 非目前張數時對輔助工具隱藏
                aria-hidden={index !== i}
                // 非目前張數時無法操作
                inert={index !== i}
              >
                {/* 內容：手機上下排列；電腦左右兩欄 */}
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-10 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
                  {/* 產品圖：正方形、最寬 480px；電腦版放右側 */}
                  <div className="relative mx-auto aspect-square w-full max-w-[min(480px,70vw)] overflow-hidden bg-white lg:order-2">
                    {/* 產品圖片：立即載入、填滿外框、等比例裁切 */}
                    <Image src={s.image} alt={s.alt} fill loading="eager" sizes="(min-width: 1024px) 480px, 70vw" className="object-cover" />
                  </div>
                  {/* 文字區：手機置中；電腦靠左 */}
                  <div className="text-center lg:text-left">
                    {/* 英文小標 */}
                    <p className="text-xs tracking-[0.35em] text-brand-deep">{s.eyebrow}</p>
                    {/* 產品標題：品牌紅 */}
                    <h2 className="mt-5 text-[30px] tracking-[0.12em] text-brand sm:text-5xl">{s.title}</h2>
                    {/* 說明文字：灰字 */}
                    <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-balance text-muted lg:mx-0">{s.desc}</p>
                    {/* 行動按鈕 */}
                    <a href={s.cta.href} className={`mt-10 ${ctaLink}`}>
                      {/* 按鈕文字 */}
                      {s.cta.label}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Parallax>

      {/* 桌機：左右箭頭置於畫面兩側，第一屏即可看到 */}
      {/* 左箭頭：上一張 */}
      <button
        // 一般按鈕
        type="button"
        // 點擊往前一張
        onClick={() => step(-1)}
        // 螢幕閱讀器讀出的名稱
        aria-label="上一張"
        // 畫面左側垂直置中、48px 圓形、半透明白底紅框；滑鼠移上變紅底白字；電腦版才顯示
        className="absolute top-1/2 left-6 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand/40 bg-white/80 text-brand-deep transition hover:bg-brand-deep hover:text-white lg:flex"
      >
        {/* 往左箭頭 */}
        <Arrow dir="prev" />
      </button>
      {/* 右箭頭：下一張 */}
      <button
        // 一般按鈕
        type="button"
        // 點擊往後一張
        onClick={() => step(1)}
        // 螢幕閱讀器讀出的名稱
        aria-label="下一張"
        // 畫面右側垂直置中，其餘同左箭頭
        className="absolute top-1/2 right-6 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand/40 bg-white/80 text-brand-deep transition hover:bg-brand-deep hover:text-white lg:flex"
      >
        {/* 往右箭頭 */}
        <Arrow dir="next" />
      </button>

      {/* 控制列（手機顯示箭頭，桌機只顯示圓點） */}
      {/* 固定在 Banner 底部、水平置中 */}
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6">
        {/* 手機版左箭頭 */}
        <button
          // 一般按鈕
          type="button"
          // 點擊往前一張
          onClick={() => step(-1)}
          // 螢幕閱讀器讀出的名稱
          aria-label="上一張"
          // 44px 方形，電腦版隱藏
          className="flex h-11 w-11 items-center justify-center text-brand-deep transition hover:opacity-60 lg:hidden"
        >
          {/* 往左箭頭 */}
          <Arrow dir="prev" />
        </button>
        {/* 張數指示條 */}
        <div className="flex items-center">
          {/* 每一張產生一個指示按鈕 */}
          {Array.from({ length: TOTAL }, (_, i) => (
            // 指示按鈕（點擊範圍比線條大，方便點按）
            <button
              // 唯一值
              key={i}
              // 一般按鈕
              type="button"
              // 點擊跳到該張
              onClick={() => go(i)}
              // 例如「第 2 張」
              aria-label={`第 ${i + 1} 張`}
              // 標示目前這張
              aria-current={i === index}
              // 44×44 的點擊範圍
              className="flex h-11 w-11 items-center justify-center"
            >
              {/* 指示線：目前這張較長且為品牌紅，其他較短且淡 */}
              <span
                // 線條長度與顏色隨張數變化，並有過場動畫
                className={`block h-0.5 transition-all duration-500 ${i === index ? "w-6 bg-brand" : "w-3 bg-brand/30"}`}
              />
            </button>
          ))}
        </div>
        {/* 手機版右箭頭 */}
        <button
          // 一般按鈕
          type="button"
          // 點擊往後一張
          onClick={() => step(1)}
          // 螢幕閱讀器讀出的名稱
          aria-label="下一張"
          // 44px 方形，電腦版隱藏
          className="flex h-11 w-11 items-center justify-center text-brand-deep transition hover:opacity-60 lg:hidden"
        >
          {/* 往右箭頭 */}
          <Arrow dir="next" />
        </button>
      </div>
    </section>
  );
}
