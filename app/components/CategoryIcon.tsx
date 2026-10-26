// 產品系列線條圖示：統一 48×48 畫布、1.5 線寬、圓角端點，13 個分類風格一致
import type { ReactNode } from "react";

// 欄柱底座（中心 x）：弧形底盤＋地線
const base = (x: number) => `M${x - 6} 40h12M${x - 4} 40c0-1.7 1.8-2.6 4-2.6s4 .9 4 2.6`;

// 依分類 id 對應的圖示內容
const icons: Record<string, ReactNode> = {
  // 伸縮帶欄柱：兩支欄柱＋中間拉出的織帶
  retractable: (
    <>
      <path d="M9 10h6v4H9zM33 10h6v4h-6z" />
      <path d="M12 14v23.4M36 14v23.4" />
      <path d={`${base(12)}${base(36)}`} />
      <path d="M15 15.5h18v3H15z" />
    </>
  ),
  // 迎賓欄柱：圓球頭欄柱＋下垂的絨布繩
  rope: (
    <>
      <circle cx="12" cy="10" r="2.5" />
      <circle cx="36" cy="10" r="2.5" />
      <path d="M12 12.5v24.9M36 12.5v24.9" />
      <path d={`${base(12)}${base(36)}`} />
      <path d="M12 17c4 8 20 8 24 0" />
    </>
  ),
  // 展覽佈展欄柱：平頭欄柱＋太陽
  outdoor: (
    <>
      <path d="M17 12h8v3h-8z" />
      <path d="M21 15v22.4" />
      <path d={base(21)} />
      <circle cx="35" cy="13" r="3" />
      <path d="M35 6.5v1.5M35 18v1.5M28.5 13H30M40 13h1.5M30.4 8.4l1 1M38.6 16.6l1 1M30.4 17.6l1-1M38.6 9.4l1-1" />
    </>
  ),
  // 塑膠欄柱：斜紋警示柱身＋方形配重底座
  plastic: (
    <>
      <rect x="21" y="7" width="6" height="29" rx="3" />
      <path d="M21 17l6-3M21 24l6-3M21 31l6-3" />
      <rect x="15" y="36" width="18" height="5" rx="1" />
    </>
  ),
  // 拒馬：外框＋廣告看板＋橫桿與腳座
  barrier: (
    <>
      <path d="M10 39V14a3 3 0 0 1 3-3h22a3 3 0 0 1 3 3v25" />
      <rect x="14" y="15" width="20" height="11" rx="1" />
      <path d="M10 31h28M6 39h8M34 39h8" />
    </>
  ),
  // 海報架・告示牌：直立海報框＋立桿底座
  sign: (
    <>
      <rect x="13" y="6" width="22" height="27" rx="1.5" />
      <path d="M18 13h12M18 18h12M18 23h7" />
      <path d="M24 33v7M16 40h16" />
    </>
  ),
  // 佈告欄：板面與便條＋附輪支架
  board: (
    <>
      <rect x="10" y="7" width="28" height="22" rx="1.5" />
      <path d="M15 12h8v9h-8zM27 14h6v7h-6z" />
      <path d="M15 29v8.5M33 29v8.5M15 34h18" />
      <circle cx="15" cy="40" r="1.8" />
      <circle cx="33" cy="40" r="1.8" />
    </>
  ),
  // 數位看板・燈箱：螢幕＋播放符號＋支架
  display: (
    <>
      <rect x="6" y="9" width="36" height="22" rx="2" />
      <path d="M21.5 15.5v9l7.5-4.5z" />
      <path d="M24 31v7M16 38h16" />
    </>
  ),
  // 垃圾桶・資源回收：掀蓋桶身＋輪子
  trash: (
    <>
      <path d="M10 13h28" />
      <path d="M20 13v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M13 13l2 24h18l2-24" />
      <path d="M21 19l.4 12M27 19l-.4 12" />
      <circle cx="17.5" cy="40" r="1.8" />
    </>
  ),
  // 清潔衛生：感應給皂機＋水滴
  hygiene: (
    <>
      <rect x="14" y="7" width="20" height="21" rx="3" />
      <path d="M19 13h10" />
      <path d="M22 28h4v3h-4z" />
      <path d="M24 34c-1.6 2.1-2.3 3.3-2.3 4.3a2.3 2.3 0 0 0 4.6 0c0-1-.7-2.2-2.3-4.3z" />
    </>
  ),
  // 傘架・傘桶：桶身＋兩支傘柄
  umbrella: (
    <>
      <path d="M21 26V13a3 3 0 0 0-6 0" />
      <path d="M27 26V11a3 3 0 0 1 6 0" />
      <path d="M13 26h22" />
      <path d="M15 26l2 14h14l2-14" />
    </>
  ),
  // 推車・工具車：三層抽屜＋推把＋輪子
  cart: (
    <>
      <rect x="9" y="10" width="26" height="26" rx="1.5" />
      <path d="M9 18.7h26M9 27.3h26" />
      <path d="M19 14.3h6M19 23h6M19 31.6h6" />
      <path d="M35 13h3a1 1 0 0 1 1 1v5" />
      <circle cx="14" cy="39.5" r="2" />
      <circle cx="30" cy="39.5" r="2" />
    </>
  ),
  // 鑰匙箱：箱體＋鑰匙
  key: (
    <>
      <rect x="10" y="6" width="28" height="36" rx="1.5" />
      <circle cx="19" cy="20" r="4" />
      <path d="M23 20h9M29 20v3M32 20v3" />
      <path d="M15 33h18M24 36.5v.01" />
    </>
  ),
};

// 產品系列圖示元件；id 為分類代號
export default function CategoryIcon({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {icons[id]}
    </svg>
  );
}
