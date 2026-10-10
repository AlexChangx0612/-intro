// 標記為瀏覽器端元件（需要切換分類、記錄狀態）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的副作用與狀態 hook
import { useEffect, useState } from "react";
// 匯入分類的資料型別
import type { Category } from "../lib/products";

// 每次顯示的商品數量（按「顯示更多」再加 12 張）
const PAGE_SIZE = 12;

// 全系列商品目錄：左側分類選單、右側商品圖片
export default function ProductCatalog({ categories }: { categories: Category[] }) {
  // 目前選中的分類 id，預設第一個分類
  const [activeId, setActiveId] = useState(categories[0]?.id);
  // 目前顯示的圖片數量
  const [visible, setVisible] = useState(PAGE_SIZE);
  // 找出目前選中的分類資料（找不到就用第一個）
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  // 切換分類
  const select = (id: string) => {
    // 設定選中的分類
    setActiveId(id);
    // 顯示數量重設為 12 張
    setVisible(PAGE_SIZE);
  };

  // 其他區塊以 #c-<分類 id> 連結到這裡，切換分類並捲動至商品區
  useEffect(() => {
    // 讀取網址錨點並切換分類
    const sync = () => {
      // 錨點不是 #c- 開頭就不處理
      if (!location.hash.startsWith("#c-")) return;
      // 取出分類 id（去掉前面的 #c-）
      const id = location.hash.slice(3);
      // 清除網址上的錨點，讓下次點同一個連結還能觸發
      history.replaceState(null, "", location.pathname + location.search);
      // 找不到這個分類就不處理
      if (!categories.some((c) => c.id === id)) return;
      // 切換到該分類
      setActiveId(id);
      // 顯示數量重設為 12 張
      setVisible(PAGE_SIZE);
      // 平滑捲動到「全系列商品」區塊
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    };
    // 頁面載入時先檢查一次網址
    sync();
    // 之後網址錨點變化時再檢查
    window.addEventListener("hashchange", sync);
    // 元件移除時取消監聽
    return () => window.removeEventListener("hashchange", sync);
    // 分類資料改變時重新設定
  }, [categories]);

  // 目前要顯示的圖片（取前 visible 張）
  const shown = active.images.slice(0, visible);
  // 尚未顯示的圖片數量
  const remaining = active.images.length - shown.length;

  // 回傳目錄畫面
  return (
    // 手機上下排列；電腦左側 200px 分類欄＋右側商品區
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
      {/* 分類欄：電腦版捲動時固定在 header 下方（top-28 = 112px，避開捲動後 80px 高的精簡 header） */}
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        {/* 「分類」小標，只在電腦版顯示 */}
        <p className="hidden text-xs tracking-[0.35em] text-muted lg:block">分類</p>
        {/* 分類按鈕列：手機為可橫向滑動的一排（右側漸淡，提示可往右滑）；電腦為直向清單、左側有直線 */}
        <nav className="[mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)] lg:[mask-image:none] -mx-5 flex gap-7 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-5 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0 lg:border-l lg:px-0 [&::-webkit-scrollbar]:hidden">
          {/* 每個分類一顆按鈕 */}
          {categories.map((c) => (
            // 分類按鈕
            <button
              // 唯一值
              key={c.id}
              // 一般按鈕
              type="button"
              // 點擊時切換到此分類
              onClick={() => select(c.id)}
              // 共用樣式（焦點框畫在內側，避免被橫向捲動區裁掉）；選中時紅色底線（電腦為左側紅線）＋紅字，未選中為灰字
              className={`-mb-px min-h-11 min-w-11 shrink-0 border-b focus-visible:outline-offset-[-3px] py-3.5 text-sm tracking-[0.08em] whitespace-nowrap transition lg:mb-0 lg:-ml-px lg:border-b-0 lg:border-l lg:py-3 lg:pl-5 lg:text-left ${
                c.id === active.id ? "border-brand text-brand-deep" : "border-transparent text-muted hover:text-brand-deep"
              }`}
            >
              {/* 分類名稱 */}
              {c.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* 右側商品區 */}
      <div className="min-w-0">
        {/* 分類標題與說明，下方有分隔線 */}
        <div className="border-b border-line pb-6">
          {/* 分類名稱：品牌紅大字 */}
          <h3 className="text-2xl tracking-[0.1em] text-brand">{active.name}</h3>
          {/* 分類說明：灰字 */}
          <p className="mt-3 text-sm leading-7 text-muted">{active.desc}</p>
        </div>

        {/* 商品圖片格：手機一排 2 張、平板以上一排 3 張 */}
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5 sm:gap-y-5 md:grid-cols-3">
          {/* 每張圖片產生一個連結 */}
          {shown.map((src) => (
            // 點擊在新分頁開啟大圖
            <a key={src} href={src} target="_blank" rel="noreferrer" className="group block">
              {/* 正方形圓角圖片框 */}
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
                {/* 商品圖片 */}
                <Image
                  // 圖片網址
                  src={src}
                  // 替代文字，例如「拒馬產品照」
                  alt={`${active.name}產品照`}
                  // 填滿外框
                  fill
                  // 各螢幕下的顯示寬度
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 33vw, 50vw"
                  // 等比例裁切；滑鼠移上時緩慢放大
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </a>
          ))}
        </div>

        {/* 還有未顯示的圖片時，才顯示「顯示更多」 */}
        {remaining > 0 && (
          // 置中的按鈕區
          <div className="mt-12 text-center">
            {/* 顯示更多按鈕 */}
            <button
              // 一般按鈕
              type="button"
              // 點擊時多顯示 12 張
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              // 紅框紅字；滑鼠移上時變成紅底白字
              className="border border-brand-deep px-12 py-3.5 text-sm tracking-[0.2em] text-brand-deep transition hover:bg-brand-deep hover:text-white"
            >
              顯示更多
            </button>
            {/* 顯示進度，例如「已顯示 12 / 30」 */}
            <p className="mt-3 text-xs text-muted">
              已顯示 {shown.length} / {active.images.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
