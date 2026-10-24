// 標記為瀏覽器端元件（需要切換分類、記錄狀態）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的副作用與狀態 hook
import { useEffect, useRef, useState } from "react";
// 匯入分類的資料型別
import type { Category } from "../lib/products";
// 匯入共用卡片樣式
import { card, cardHover } from "../lib/ui";

// 每次顯示的商品數量（按「顯示更多」再加 12 張）
const PAGE_SIZE = 12;
// 記住目前分類與顯示數量（從商品頁按「上一頁」回來時恢復），只存在這個分頁
const STORAGE_KEY = "catalog-state";
// 商品格的欄數斷點（需與下方商品卡片格的 class 一致）：1900px 以上 5 欄、1536px 以上 4 欄、768px 以上 3 欄，其餘 2 欄
const COLUMN_QUERIES: [string, number][] = [
  ["(min-width: 118.75rem)", 5],
  ["(min-width: 96rem)", 4],
  ["(min-width: 48rem)", 3],
];

// 目前螢幕寬度下商品格的欄數；視窗縮放跨過斷點時自動更新
function useColumns() {
  // 伺服器端與第一次繪製先用 1（不調整數量），載入後再讀實際欄數
  const [cols, setCols] = useState(1);
  useEffect(() => {
    // 依序找出第一個符合的斷點
    const lists = COLUMN_QUERIES.map(([q, n]) => [matchMedia(q), n] as const);
    const update = () => setCols(lists.find(([m]) => m.matches)?.[1] ?? 2);
    update();
    lists.forEach(([m]) => m.addEventListener("change", update));
    return () => lists.forEach(([m]) => m.removeEventListener("change", update));
  }, []);
  return cols;
}

// 商品卡片下方文字：型號（產品照右下角黃色字）＋規格（例如「不鏽鋼色柱身・紅色織帶」）；沒有規格時顯示分類名稱
function cardText(item: Category["items"][number], categoryName: string) {
  return { title: item.model, sub: item.spec ?? categoryName };
}

// 產品系列目錄：左側系列清單（電腦版滑鼠移上展開顯示產品圖）、右側商品圖片
export default function ProductCatalog({ categories }: { categories: Category[] }) {
  // 目前選中的分類 id，預設第一個分類
  const [activeId, setActiveId] = useState(categories[0]?.id);
  // 目前顯示的圖片數量
  const [visible, setVisible] = useState(PAGE_SIZE);
  // 找出目前選中的分類資料（找不到就用第一個）
  const active = categories.find((c) => c.id === activeId) ?? categories[0];
  // 滑鼠移上（展開中）的系列 id
  const [hovered, setHovered] = useState<string | null>(null);
  // 系列清單（手機為橫向滑動）
  const stripRef = useRef<HTMLUListElement>(null);

  // 手機版：選中的系列不在畫面內時，把清單橫向捲到讓它置中（只捲清單，不動整頁）
  useEffect(() => {
    const strip = stripRef.current;
    const tile = strip?.querySelector<HTMLElement>('[aria-pressed="true"]')?.parentElement;
    if (!strip || !tile || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({ left: tile.offsetLeft - (strip.clientWidth - tile.offsetWidth) / 2, behavior: "smooth" });
  }, [active.id]);

  // 設定分類與顯示數量，並記在這個分頁（在操作當下儲存，避免載入時的預設值蓋掉紀錄）
  const show = (id: string, count: number) => {
    setActiveId(id);
    setVisible(count);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, visible: count }));
    } catch {
      // 無法儲存時略過
    }
  };

  // 切換分類：顯示數量重設為 12 張
  const select = (id: string) => show(id, PAGE_SIZE);

  // 載入時恢復上次選的分類與顯示數量
  useEffect(() => {
    // 讀取儲存的狀態並套用
    const restore = () => {
      try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as { id?: string; visible?: number } | null;
        // 沒有紀錄或分類已不存在就維持預設
        const cat = categories.find((c) => c.id === saved?.id);
        if (!cat) return;
        setActiveId(cat.id);
        setVisible(Math.max(PAGE_SIZE, saved?.visible ?? PAGE_SIZE));
      } catch {
        // 無法讀取（例如私密瀏覽封鎖儲存空間）時維持預設
      }
    };
    restore();
  }, [categories]);

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
      // 記住這次切換
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, visible: PAGE_SIZE }));
      } catch {
        // 無法儲存時略過
      }
      // 平滑捲動到商品區
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

  // 商品格目前的欄數
  const cols = useColumns();
  // 目前要顯示的圖片：visible 張無條件進位到整排（例如 5 欄時 12 張補成 15 張），每一排數量相同
  const shown = active.items.slice(0, Math.ceil(visible / cols) * cols);
  // 尚未顯示的圖片數量
  const remaining = active.items.length - shown.length;

  // 回傳目錄畫面
  return (
    // 手機上下排列；電腦左側系列清單（280px，1536px 以上 320px）＋右側商品區
    <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14 2xl:grid-cols-[320px_minmax(0,1fr)] 2xl:gap-16">
      {/* 系列清單：電腦版捲動時固定在 header 下方（top-28 = 112px，避開捲動後 80px 高的精簡 header） */}
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        {/* 「分類」小標，只在電腦版顯示 */}
        <p className="hidden pl-5 text-lg tracking-[0.2em] text-ink lg:block">分類</p>
        {/* 手機：可橫向滑動的一排（右側漸淡，提示可往右滑）；電腦：直向清單，滑鼠移上的那一列展開顯示產品圖（Hover Expand），其他列淡出 */}
        <ul
          ref={stripRef}
          onMouseLeave={() => setHovered(null)}
          className="relative [mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)] lg:[mask-image:none] -mx-5 flex gap-7 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-5 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            // 是否為目前選中的系列
            const on = c.id === active.id;
            // 是否為滑鼠移上（展開）的那一列
            const open = c.id === hovered;
            return (
              // 有其他列展開時，這一列淡出（只在電腦版）
              <li key={c.id} className={`shrink-0 transition-opacity duration-300 ${hovered && !open ? "lg:opacity-[.38]" : ""}`}>
                <button
                  type="button"
                  // 點擊時切換到此系列
                  onClick={() => select(c.id)}
                  // 滑鼠或鍵盤焦點移上時展開
                  onMouseEnter={() => setHovered(c.id)}
                  onFocus={() => setHovered(c.id)}
                  onBlur={() => setHovered(null)}
                  // 告訴輔助科技哪一個系列已選中
                  aria-pressed={on}
                  // 手機：底線分頁樣式；電腦：收合 48px、展開 172px 的圓角列（18px 字）；選中時淡紅底，展開時變白卡；高度用略帶回彈的曲線（模擬彈簧）
                  className={`relative -mb-px block min-h-11 min-w-11 border-b py-3.5 text-sm tracking-[0.08em] whitespace-nowrap transition focus-visible:outline-offset-[-3px] lg:mb-0 lg:flex lg:w-full lg:flex-col lg:justify-start lg:overflow-hidden lg:rounded-[10px] lg:border-b-0 lg:py-0 lg:text-left lg:text-base lg:transition-[height,background-color,box-shadow,color] lg:duration-500 lg:ease-[cubic-bezier(.34,1.25,.64,1)] ${
                    open ? "lg:h-[172px] lg:bg-white lg:shadow-[0_0_0_1px_rgba(214,31,42,.18),0_18px_36px_-22px_rgba(15,15,14,.35)]" : `lg:h-12 ${on ? "lg:bg-blush/70" : ""}`
                  } ${on ? "border-brand text-brand-deep" : "border-transparent text-ink/80 hover:text-brand-deep"}`}
                >
                  {/* 選中標記：左側紅色直線（電腦版） */}
                  <span aria-hidden="true" className={`absolute top-3 left-0 hidden h-6 w-[3px] rounded-full bg-brand transition-opacity lg:block ${on ? "opacity-100" : "opacity-0"}`} />
                  {/* 系列名稱 */}
                  <span className="lg:flex lg:h-12 lg:items-center lg:gap-4 lg:px-5">
                    <span className={open ? "lg:text-brand-deep" : ""}>{c.name}</span>
                  </span>
                  {/* 系列說明：展開後延遲 0.12 秒由左滑入（電腦版）；右緣留到產品圖左側再空 20px，避免文字和圖太近 */}
                  <span
                    className={`absolute top-12 right-[calc(36%+2.25rem)] left-5 hidden text-xs leading-5 tracking-[0.04em] whitespace-normal text-muted transition duration-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] lg:block ${
                      open ? "translate-x-0 opacity-100 delay-[120ms]" : "-translate-x-2 opacity-0"
                    }`}
                  >
                    {c.desc}
                  </span>
                  {/* 該系列去背產品圖：固定在右側 36% 寬、100px 高的框內完整呈現，框的上緣在名稱列下方，避免高的產品圖碰到名稱（固定高度，收合時圖片也不會以 0 高度載入）；展開時由 1.06 倍縮回原尺寸並淡入（電腦版） */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-[56px] right-4 hidden h-[100px] w-[36%] transition duration-500 ease-out lg:block ${open ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
                  >
                    <Image src={`/cutouts/${c.slug}.png`} alt="" fill sizes="110px" className="object-contain" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* 商品區：#c-<分類 id> 錨點跳轉時捲動到這裡 */}
      <div id="products" className="min-w-0 scroll-mt-24 sm:scroll-mt-28">
        {/* 系列標題列（下方分隔線）：左為系列名稱與說明；右為系列介紹頁連結 */}
        <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* 系列名稱：品牌紅大字 */}
            <h3 className="text-2xl tracking-[0.1em] text-brand lg:text-3xl">{active.name}</h3>
            {/* 系列說明：灰字 */}
            <p className="mt-3 text-sm leading-7 text-muted">{active.desc}</p>
          </div>
          {/* 連到系列頁（該系列所有產品、選購建議、常見問題）；按鈕文字帶入系列名稱 */}
          <Link
            href={`/products/${active.slug}`}
            className="group inline-flex shrink-0 items-center gap-3 self-start text-sm tracking-[0.15em] text-brand-deep sm:self-auto"
          >
            點擊查看{active.name}所有產品
            {/* 右箭頭：滑鼠移上往右移 */}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* 商品卡片格：手機一排 2 張、平板與電腦 3 張、1536px 以上 4 張、1900px 以上 5 張 */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
          {/* 每個品項產生一張卡片 */}
          {shown.map((item) => {
            // 卡片下方的標題與說明
            const { title, sub } = cardText(item, active.name);
            return (
              // 點擊在目前分頁進入該品項的介紹頁；白色卡片，滑鼠移上微微浮起
              <Link key={item.slug} href={item.href} className={`group block p-1.5 sm:p-2 ${card} ${cardHover}`}>
                {/* 正方形圓角圖片框 */}
                <div className="relative aspect-square overflow-hidden rounded-[10px] bg-paper lg:rounded-[12px]">
                  {/* 商品圖片 */}
                  <Image
                    // 圖片網址
                    src={item.image}
                    // 替代文字：已登錄產品用型號與名稱，其餘用分類名稱與品項編號
                    alt={`${item.model} ${item.spec ?? active.name}`}
                    // 填滿外框
                    fill
                    // 各螢幕下的顯示寬度
                    sizes="(min-width: 1900px) 20vw, (min-width: 1536px) 25vw, (min-width: 768px) 33vw, 50vw"
                    // 等比例裁切；滑鼠移上時緩慢放大
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                {/* 型號（或分類名稱）、規格（或品項編號）與紅色箭頭 */}
                <div className="flex items-end gap-3 px-2 pt-3 pb-1.5 sm:px-3 sm:pt-4 sm:pb-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm tracking-[0.06em] text-ink sm:text-lg">{title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">{sub}</p>
                  </div>
                  <span aria-hidden="true" className="hidden pb-0.5 text-lg text-brand-deep transition group-hover:translate-x-1 sm:inline">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
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
              onClick={() => show(active.id, visible + PAGE_SIZE)}
              // 紅框紅字圓角按鈕；滑鼠移上時變成紅底白字，箭頭往下移
              className="group inline-flex items-center gap-3 rounded-full border border-brand-deep px-12 py-3.5 text-sm tracking-[0.2em] text-brand-deep transition hover:bg-brand-deep hover:text-white"
            >
              顯示更多
              <span aria-hidden="true" className="transition group-hover:translate-y-0.5">↓</span>
            </button>
            {/* 顯示進度，例如「已顯示 12 / 30」 */}
            <p className="mt-3 text-xs text-muted">
              已顯示 {shown.length} / {active.items.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
