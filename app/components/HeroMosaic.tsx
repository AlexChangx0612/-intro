// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的型別（用來設定 CSS 自訂變數）
import type { CSSProperties } from "react";
// 匯入本元件的樣式
import s from "./HeroMosaic.module.css";

// 磚塊種類：產品照（img 為產品照索引）或色塊（可加英文＋中文標籤，或放品牌標誌）
type Tile =
  | { img: number }
  | { tone: "red" | "deep" | "dark" | "cream"; en?: string; zh?: string; logo?: boolean };

// 三欄的磚塊順序（每欄 5 塊）；中間欄 up 為往下捲
const columns: { cls: string; up?: boolean; tiles: Tile[] }[] = [
  // 左欄：往上捲
  {
    cls: s.c1,
    tiles: [{ tone: "red", en: "Made in Taiwan", zh: "台灣製造" }, { img: 0 }, { img: 1 }, { tone: "cream", logo: true }, { img: 2 }],
  },
  // 中欄：往下捲
  {
    cls: s.c2,
    up: true,
    tiles: [{ img: 3 }, { tone: "dark", en: "Free planning", zh: "免費空間規劃" }, { img: 4 }, { tone: "red" }, { img: 5 }],
  },
  // 右欄：往上捲
  {
    cls: s.c3,
    tiles: [{ img: 6 }, { tone: "deep", en: "Custom branding", zh: "企業識別客製" }, { img: 7 }, { tone: "cream" }, { img: 8 }],
  },
];

// 標題的三行（第一行使用品牌紅強調）
const lines = [
  { text: "秩序，", accent: true },
  { text: "是空間的", accent: false },
  { text: "禮儀", accent: false },
];

// 電話圖示
function PhoneIcon() {
  // 20px 話筒圖示
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* 話筒外形 */}
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

// 首屏主視覺；images 為各分類代表照（至少 9 張，不足時循環使用）
export default function HeroMosaic({ images }: { images: string[] }) {
  // 依索引取產品照（不足時從頭循環）
  const pic = (i: number) => images[i % images.length];

  // 產生一塊磚
  const renderTile = (t: Tile, key: string) =>
    "img" in t ? (
      // 產品照磚
      <div key={key} className={s.cell}>
        {/* 產品照：正方形完整呈現，電腦版約 220px 寬 */}
        <Image src={pic(t.img)} alt="" fill sizes="(min-width: 1024px) 230px, 33vw" className={s.img} />
      </div>
    ) : (
      // 色塊磚
      <div key={key} className={`${s.cell} ${s[t.tone]}`}>
        {/* 米白磚放品牌標誌 */}
        {t.logo && <Image src="/brand/logo-shung-red.png" alt="" width={240} height={139} className={s.logo} />}
        {/* 有標籤時顯示英文＋中文 */}
        {t.zh && (
          // 左下角標籤
          <p className={s.label}>
            {/* 英文 */}
            <b>{t.en}</b>
            {/* 中文 */}
            <span>{t.zh}</span>
          </p>
        )}
      </div>
    );

  // 回傳首屏
  return (
    // 首屏區塊
    <section className={s.hero} aria-labelledby="hero-title">
      {/* 左側（手機為上方）文字 */}
      <div className={s.copy}>
        {/* 英文小標 */}
        <p className={s.eyebrow}>Public Space Essentials</p>
        {/* 主標題：逐行升起 */}
        <h1 id="hero-title" className={s.title}>
          {/* 逐行輸出 */}
          {lines.map((l, i) => (
            // 一行（裁切容器）
            <span key={l.text} className={`${s.ln} ${l.accent ? s.accent : ""}`}>
              {/* 行內文字；--i 控制動畫延遲 */}
              <span style={{ "--i": i } as CSSProperties}>{l.text}</span>
            </span>
          ))}
        </h1>
        {/* 說明文字 */}
        <p className={s.lead}>
          紅龍柱、排隊欄柱與公共空間設備，為銀行、醫院、商場與各式場館，打造從容而有分寸的動線。
          <strong>台灣製造</strong>，提供<strong>免費空間規劃</strong>。
        </p>
        {/* 行動按鈕 */}
        <div className={s.acts}>
          {/* 主要按鈕：免費諮詢 */}
          <a href="#contact" className={s.pill} style={{ "--i": 0 } as CSSProperties}>
            免費諮詢
          </a>
          {/* 圓形按鈕：直接撥打電話 */}
          <a href="tel:0226082585" className={s.circ} aria-label="撥打電話 02-2608-2585" style={{ "--i": 1 } as CSSProperties}>
            <PhoneIcon />
          </a>
          {/* 次要連結：探索系列 */}
          <a href="#collections" className={s.more} style={{ "--i": 2 } as CSSProperties}>
            探索系列
            {/* 黑色圓形箭頭 */}
            <span className={s.dot} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {/* 向右箭頭 */}
                <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* 磚牆：純裝飾，輔助工具略過 */}
      <div className={s.band} aria-hidden="true">
        {/* 三欄 */}
        {columns.map((c, ci) => (
          // 一欄；--i 控制進場延遲
          <div key={ci} className={`${s.col} ${c.cls} ${c.up ? s.up : ""}`} style={{ "--i": ci } as CSSProperties}>
            {/* 捲動軌道：同一組 5 塊重複 3 次，位移三分之一即可無縫循環 */}
            <div className={s.track}>
              {[0, 1, 2].flatMap((rep) => c.tiles.map((t, ti) => renderTile(t, `${rep}-${ti}`)))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
