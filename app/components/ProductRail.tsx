// 標記為瀏覽器端元件（需要處理按鈕點擊）
"use client";

// 匯入 Next.js 圖片元件（自動壓縮與延遲載入）
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的副作用、DOM 參照與狀態 hook
import { useEffect, useRef, useState } from "react";
// 匯入品項型別
import type { CatalogItem } from "../lib/products";

// 橫向捲動的商品列；items 為品項清單（每張連到介紹頁），alt 為圖片替代文字
export default function ProductRail({ items, alt }: { items: CatalogItem[]; alt: string }) {
  // 取得捲動容器的 DOM 參照
  const ref = useRef<HTMLDivElement>(null);
  // 是否已捲到最左邊／最右邊（用來停用對應的箭頭）
  const [edge, setEdge] = useState({ start: true, end: false });

  // 依目前捲動位置更新箭頭狀態
  const updateEdge = () => {
    // 取得捲動容器
    const el = ref.current;
    // 找不到就不處理
    if (!el) return;
    // 左邊界：幾乎沒有捲動；右邊界：已捲到底（保留 2px 誤差）
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  };

  // 載入時與視窗大小改變時，重新判斷箭頭狀態
  useEffect(() => {
    // 取得捲動容器
    const el = ref.current;
    // 找不到就不處理
    if (!el) return;
    // 依目前位置設定箭頭狀態
    const sync = () => setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
    // 載入時先判斷一次
    sync();
    // 視窗大小改變時重新判斷
    window.addEventListener("resize", sync);
    // 元件移除時取消監聽
    return () => window.removeEventListener("resize", sync);
  }, []);
  // 左右捲動；dir 為 1（往右）或 -1（往左）
  const scroll = (dir: 1 | -1) => {
    // 取得捲動容器
    const el = ref.current;
    // 平滑捲動容器寬度的 80%
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // 回傳商品列
  return (
    // 外層容器
    <div>
      {/* 可橫向捲動的圖片列 */}
      <div
        // 綁定 DOM 參照，供箭頭按鈕捲動
        ref={ref}
        // 捲動時更新箭頭狀態
        onScroll={updateEdge}
        // 橫向排列、捲動時對齊每張圖片、隱藏捲軸
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {/* 每個品項產生一個連結 */}
        {items.map((item) => (
          // 點擊圖片在目前分頁進入該品項的介紹頁
          <Link
            // React 用來辨識每個項目的唯一值
            key={item.slug}
            // 連結到品項介紹頁
            href={item.href}
            // 寬度：手機 72%、平板 42%、電腦一排 4 張；不縮小、捲動時對齊左緣；焦點框畫在內側，避免被捲動區裁掉
            className="group block focus-visible:outline-offset-[-3px] w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[calc((100%-3.75rem)/4)]"
          >
            {/* 正方形圓角圖片框，超出部分裁切 */}
            <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
              {/* 商品圖片 */}
              <Image
                // 圖片網址
                src={item.image}
                // 替代文字（加上品項編號，避免每張都相同）
                alt={`${alt} ${item.code}`}
                // 填滿外框
                fill
                // 告訴瀏覽器各螢幕下圖片的顯示寬度，以載入合適尺寸
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 42vw, 72vw"
                // 等比例裁切填滿；滑鼠移上時緩慢放大 4%
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* 左右箭頭按鈕列：手機隱藏，平板以上靠右顯示 */}
      <div className="mt-8 hidden justify-end gap-2 sm:flex">
        {/* 產生「往左」與「往右」兩顆按鈕 */}
        {([-1, 1] as const).map((dir) => (
          // 箭頭按鈕
          <button
            // 唯一值
            key={dir}
            // 一般按鈕（非表單送出）
            type="button"
            // 點擊時往對應方向捲動
            onClick={() => scroll(dir)}
            // 螢幕閱讀器讀出的按鈕名稱
            aria-label={dir < 0 ? "上一組" : "下一組"}
            // 已到最左／最右時停用
            disabled={dir < 0 ? edge.start : edge.end}
            // 44px 正方形、淡紅框；滑鼠移上時變成紅底白字；停用時變淡且不可點
            className="flex h-11 w-11 items-center justify-center border border-line text-brand-deep transition hover:border-brand-deep hover:bg-brand-deep hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-brand-deep"
          >
            {/* 箭頭圖示；往左時旋轉 180 度 */}
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true" className={dir < 0 ? "rotate-180" : ""}>
              {/* 箭頭線條：橫線＋箭頭尖端 */}
              <path d="M0 5h15M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
