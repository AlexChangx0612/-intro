// 標記為瀏覽器端元件（需要監聽捲動、開關選單）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的副作用與狀態 hook
import { useEffect, useState } from "react";
// 匯入分類連結型別
import type { CategoryLink } from "../lib/ui";

// 主選單：大螢幕拆成 logo 左右各四個，較小螢幕收進抽屜
// 「/」開頭為站內頁面，「/#」為首頁區塊
// LOGO 左側四個按鈕
const navLeft = [
  // 產品系列 → 打開產品分類 sidebar（大螢幕）；抽屜中連到產品系列頁
  { href: "/products", label: "產品系列" },
  // 適用場域 → 場域總覽頁
  { href: "/solutions", label: "適用場域" },
  // 客戶實際案例 → 首頁輪播區塊
  { href: "/#cases", label: "客戶實際案例" },
  // 客製化服務 → 關於頁的服務說明
  { href: "/about#services", label: "客製化服務" },
];
// LOGO 右側四個按鈕
const navRight = [
  // 關於世紘 → 關於頁
  { href: "/about", label: "關於世紘" },
  // 世紘優勢 → 首頁優勢區塊
  { href: "/#advantages", label: "世紘優勢" },
  // 常見問題 → 首頁常見問題區塊
  { href: "/#faq", label: "常見問題" },
  // 聯絡我們 → 聯絡我們頁面
  { href: "/contact", label: "聯絡我們" },
];

// 抽屜：較小螢幕使用（大螢幕選單已全部顯示在 header）
// 合併左右兩組，作為抽屜選單的連結
const pages = [...navLeft, ...navRight];

// 按鈕字級：一般 24px（選單、聯絡）；1536 起左右八個按鈕並排 22.5px
// 按鈕共用樣式：不換行、滑鼠移上變紅字
const navLink =
  "py-2 text-xl tracking-[0.15em] whitespace-nowrap transition hover:text-brand-deep 2xl:text-[22.5px] 2xl:tracking-[0.1em]";
// 按鈕群組樣式：1536px 以下隱藏；以上橫向排列，間距 20px，1900px 以上間距 30px
const navGroup = "hidden items-center gap-5 2xl:flex 3xl:gap-[30px]";

// 電話圖示（14px）
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* 話筒外形 */}
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

// 信封圖示（14px）
function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {/* 信封外框與封口 */}
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

// 網站頁首元件；categories 為產品分類（抽屜選單使用）
export default function SiteHeader({ categories }: { categories: CategoryLink[] }) {
  // 抽屜內容：menu＝完整選單、products＝只顯示產品分類、null＝關閉
  const [drawer, setDrawer] = useState<"menu" | "products" | null>(null);
  // 抽屜選單是否打開
  const open = drawer !== null;
  // 打開完整選單
  const setOpen = (v: boolean) => setDrawer(v ? "menu" : null);
  // 頁面是否已往下捲動（決定 header 是否切換成精簡版）
  const [scrolled, setScrolled] = useState(false);
  // 關閉抽屜選單
  const close = () => setOpen(false);

  // 監聽捲動：捲動超過 8px 時 header 切換成精簡版
  useEffect(() => {
    // 判斷目前捲動位置
    const onScroll = () => setScrolled(window.scrollY > 8);
    // 載入時先判斷一次
    onScroll();
    // 監聽捲動事件
    window.addEventListener("scroll", onScroll, { passive: true });
    // 元件移除時取消監聽
    return () => window.removeEventListener("scroll", onScroll);
    // 只在第一次顯示時設定
  }, []);

  // 抽屜打開時：鎖住背景捲動，並可按 Esc 關閉
  useEffect(() => {
    // 抽屜沒打開就不處理
    if (!open) return;
    // 按下 Esc 鍵時關閉抽屜
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(null);
    // 禁止背景頁面捲動
    document.body.style.overflow = "hidden";
    // 監聽鍵盤
    window.addEventListener("keydown", onKey);
    // 抽屜關閉時的清理工作
    return () => {
      // 恢復背景捲動
      document.body.style.overflow = "";
      // 取消鍵盤監聽
      window.removeEventListener("keydown", onKey);
    };
    // open 改變時重新執行
  }, [open]);

  // 回傳 header 與抽屜選單
  return (
    // 空標籤：同時回傳多個元素
    <>
      {/* 頁首：浮動白色卡片（下緣圓角、細框＋陰影），固定在畫面頂端；載入時從上方滑入 */}
      <header className="fixed inset-x-2 top-0 z-40 rounded-b-[18px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.08),0_16px_36px_-24px_rgba(15,15,14,.3)] motion-safe:animate-[hdr-in_.95s_cubic-bezier(.16,1,.3,1)_both] sm:inset-x-6 lg:inset-x-10 lg:rounded-b-[22px] 2xl:inset-x-4 3xl:inset-x-10">
        {/* 資訊列（電腦版）：電話、Email、營業時間；往下捲動後收起，讓出閱讀空間 */}
        <div
          className={`hidden items-center gap-6 overflow-hidden border-b px-6 text-xs text-muted transition-[height,opacity,visibility] duration-300 lg:flex ${
            scrolled ? "invisible h-0 border-transparent opacity-0" : "visible h-10 border-ink/8 opacity-100"
          }`}
        >
          {/* 電話：點擊撥號 */}
          <a href="tel:0226082585" className="flex h-10 items-center gap-2 transition hover:text-ink">
            <PhoneIcon />
            02-2608-2585
          </a>
          {/* 細直線分隔 */}
          <span aria-hidden="true" className="h-4 w-px bg-ink/15" />
          {/* Email：點擊寄信 */}
          <a href="mailto:shung3758@gmail.com" className="flex h-10 items-center gap-2 transition hover:text-ink">
            <MailIcon />
            shung3758@gmail.com
          </a>
          {/* 細直線分隔 */}
          <span aria-hidden="true" className="h-4 w-px bg-ink/15" />
          {/* 營業時間 */}
          <span>週一至週五 09:00–18:00</span>
        </div>

        {/* 主列：三欄格線（左欄、LOGO、右欄）；高度手機 80px → 平板 96px → 電腦 144px（捲動後縮為 80px） */}
        {/* 左右欄可縮到 0（minmax），手機欄間距 8px，避免兩側按鈕被擠出畫面 */}
        <div className={`grid h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 px-2.5 transition-[height] duration-300 sm:h-24 sm:px-6 ${scrolled ? "lg:h-20" : "lg:h-36"} lg:px-8 2xl:gap-x-8 2xl:px-4 3xl:px-8`}>
          {/* 左欄：較小螢幕靠左；大螢幕靠右（貼近 LOGO） */}
          <div className="flex items-center gap-8 justify-self-start 2xl:justify-self-end">
            {/* ☰ 選單按鈕：大螢幕隱藏 */}
            <button
              // 一般按鈕
              type="button"
              // 點擊打開抽屜
              onClick={() => setOpen(true)}
              // 螢幕閱讀器讀出的名稱
              aria-label="開啟選單"
              // 告訴輔助工具抽屜目前是否展開
              aria-expanded={open}
              // 圖示與文字橫向排列，24px 字；點擊範圍至少 44×44px
              className="flex min-h-11 min-w-11 shrink-0 items-center gap-1.5 text-[15px] tracking-[0.1em] whitespace-nowrap sm:gap-3 sm:text-xl sm:tracking-[0.15em] 2xl:hidden"
            >
              {/* 兩條橫線的選單圖示：手機 20px 寬，平板以上 30px */}
              <svg viewBox="0 0 20 10" aria-hidden="true" className="h-2.5 w-5 sm:h-[15px] sm:w-[30px]">
                {/* 上下兩條線 */}
                <path d="M0 1h20M0 9h20" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {/* 「選單」文字 */}
              <span>選單</span>
            </button>
            {/* 左側四個按鈕（大螢幕才顯示） */}
            <nav aria-label="主選單" className={navGroup}>
              {/* 逐一產生按鈕 */}
              {navLeft.map((p) =>
                // 「產品系列」：點擊從左側打開產品分類 sidebar
                p.href === "/products" ? (
                  <button
                    key={p.href}
                    type="button"
                    onClick={() => setDrawer("products")}
                    aria-expanded={drawer === "products"}
                    className={navLink}
                  >
                    {p.label}
                  </button>
                ) : (
                  // 按鈕連結
                  <Link key={p.href} href={p.href} className={navLink}>
                    {/* 按鈕文字 */}
                    {p.label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          {/* 品牌：Shung 標誌 ｜ 公司名稱與標語 */}
          {/* 點擊回到首頁 */}
          <Link href="/" aria-label="世紘興業 回到首頁" className="flex min-h-11 items-center gap-2 sm:gap-4">
            {/* 紅色 Shung 標誌 */}
            <Image
              // 圖片路徑
              src="/brand/logo-shung-red.png"
              // 裝飾用，替代文字留空（連結本身已有名稱）
              alt=""
              // 原圖寬度
              width={240}
              // 原圖高度
              height={139}
              // 立即載入（第一眼就看得到）
              loading="eager"
              // 高度：手機 28px → 平板 48px → 電腦 56px，寬度等比例
              className="h-7 w-auto sm:h-12 lg:h-14"
            />
            {/* LOGO 與文字之間的紅色直線 */}
            <span aria-hidden="true" className="h-7 w-px bg-brand/40 sm:h-11 lg:h-12" />
            {/* 公司名稱與標語（不換行） */}
            <span className="leading-none whitespace-nowrap">
              {/* 公司名稱：深品牌紅，手機 15px → 平板 28px → 電腦 34px */}
              <span className="block text-[15px] tracking-[0.15em] text-brand-deep sm:text-2xl sm:tracking-[0.3em] lg:text-3xl">世紘興業</span>
              {/* 標語：灰字，手機 9px → 平板 14px → 電腦 16px */}
              <span className="mt-1.5 block text-[9px] tracking-[0.08em] text-muted sm:mt-2 sm:text-xs sm:tracking-[0.28em] lg:text-sm">公共空間設備專家</span>
            </span>
          </Link>

          {/* 右欄（較小螢幕）：「聯絡我們」→ 聯絡我們頁面（手機 15px 字，平板以上 24px） */}
          <Link
            href="/contact"
            className="flex min-h-11 items-center justify-self-end text-[15px] tracking-[0.1em] whitespace-nowrap transition hover:text-brand-deep sm:text-xl sm:tracking-[0.15em] 2xl:hidden"
          >
            聯絡我們
          </Link>
          {/* 右側四個按鈕（大螢幕才顯示，靠左貼近 LOGO） */}
          <nav aria-label="主選單" className={navGroup}>
            {/* 逐一產生按鈕 */}
            {navRight.map((p) => (
              // 按鈕連結
              <Link key={p.href} href={p.href} className={navLink}>
                {/* 按鈕文字 */}
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* 抽屜選單：open 為 true 時才顯示 */}
      {open && (
        // 覆蓋整個畫面的容器，層級高於 header
        <div className="fixed inset-0 z-50">
          {/* 半透明黑色背景，點擊可關閉 */}
          <button
            // 一般按鈕
            type="button"
            // 螢幕閱讀器讀出的名稱
            aria-label="關閉選單"
            // 點擊關閉
            onClick={close}
            // 滿版、淡入動畫、30% 透明黑
            className="absolute inset-0 animate-[fade-in_.3s_ease-out] bg-ink/30"
          />
          {/* 抽屜面板：從左側滑入、白底、內容過長可捲動 */}
          <nav className="absolute inset-y-0 left-0 flex w-full max-w-md animate-[drawer-in_.4s_cubic-bezier(.2,.7,.2,1)] flex-col overflow-y-auto bg-white px-8 pt-5 pb-12 sm:px-12">
            {/* 關閉按鈕 */}
            <button
              // 一般按鈕
              type="button"
              // 點擊關閉
              onClick={close}
              // 圖示與文字橫向排列，靠左
              className="flex h-11 items-center gap-3 self-start text-sm tracking-[0.15em]"
            >
              {/* X 圖示 */}
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                {/* 兩條交叉斜線 */}
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              關閉
            </button>

            {/* 八個頁面連結（只在完整選單顯示） */}
            {drawer === "menu" && (
              <ul className="mt-10 space-y-1">
                {/* 逐一產生連結 */}
                {pages.map((p) => (
                  // 清單項目
                  <li key={p.href}>
                    {/* 點擊後跳到該區塊並關閉抽屜 */}
                    <Link href={p.href} onClick={close} className="block py-2 text-sm tracking-[0.12em] transition hover:text-brand-deep">
                      {/* 連結文字 */}
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* 「產品系列」小標；完整選單時上方有分隔線 */}
            <p
              className={`text-xs tracking-[0.35em] text-brand-deep ${
                drawer === "menu" ? "mt-10 border-t border-line pt-8" : "mt-10"
              }`}
            >
              產品系列
            </p>
            {/* 產品分類連結 */}
            <ul className="mt-4 space-y-1">
              {/* 逐一產生分類連結 */}
              {categories.map((c) => (
                // 清單項目
                <li key={c.id}>
                  {/* 分類連結 */}
                  <Link
                    // 連到該分類頁
                    href={`/products/${c.slug}`}
                    // 點擊後關閉抽屜
                    onClick={close}
                    // 20px 字，滑鼠移上變紅字
                    className="block py-2 text-lg tracking-[0.08em] transition hover:text-brand-deep"
                  >
                    {/* 分類名稱 */}
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
