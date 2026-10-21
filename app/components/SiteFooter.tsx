// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入共用版心樣式與分類連結型別
import { container, type CategoryLink } from "../lib/ui";

// 「服務」欄的連結清單
const services = [
  // 連到產品系列頁
  { href: "/products", label: "全系列商品" },
  // 連到首頁特價商品區塊
  { href: "/#onsale", label: "特價商品" },
  // 連到適用場域頁
  { href: "/solutions", label: "適用場域" },
  // 連到關於世紘頁
  { href: "/about", label: "關於世紘" },
  // 連到本頁聯絡區塊
  { href: "#contact", label: "免費空間規劃" },
];

// 頁尾連結樣式：點擊高度至少 44px、文字垂直置中，滑鼠移上變紅字
const footLink = "inline-flex min-h-11 items-center transition hover:text-brand-deep";

// 頁尾每一欄的標題元件
function ColumnTitle({ children }: { children: React.ReactNode }) {
  // 14px、字距加寬、深品牌紅
  return <h2 className="text-xs tracking-[0.35em] text-brand-deep">{children}</h2>;
}

// 頁尾元件；categories 為產品分類清單
export default function SiteFooter({ categories }: { categories: CategoryLink[] }) {
  // 回傳頁尾
  return (
    // 頁尾：上方淡紅分隔線、白底
    <footer className="border-t border-line bg-white">
      {/* 四欄內容：手機 1 欄、平板 2 欄、電腦 4 欄 */}
      <div className={`${container} grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20`}>
        {/* 第 1 欄：公司標誌與簡介 */}
        <div>
          {/* 公司標誌 72×72 */}
          <Image src="/brand/logo.png" alt="世紘興業 Shung 標誌" width={72} height={72} />
          {/* 公司簡介：灰字、最寬約 320px */}
          <p className="mt-6 max-w-xs text-sm leading-7 text-muted">
            世紘興業有限公司成立於 2015 年，專營紅龍柱、排隊欄柱與公共空間設備，為銀行、醫院、商場與各式場館打造有秩序、有質感的空間。
          </p>
        </div>

        {/* 第 2 欄：產品系列 */}
        <div>
          {/* 欄位標題 */}
          <ColumnTitle>產品系列</ColumnTitle>
          {/* 分類連結清單（每個連結點擊高度至少 44px） */}
          <ul className="mt-4 text-sm">
            {/* 只取前 6 個分類 */}
            {categories.slice(0, 6).map((c) => (
              // 清單項目
              <li key={c.id}>
                {/* 連到該分類頁；滑鼠移上變紅字 */}
                <Link href={`/products/${c.slug}`} className={footLink}>
                  {/* 分類名稱 */}
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 第 3 欄：服務 */}
        <div>
          {/* 欄位標題 */}
          <ColumnTitle>服務</ColumnTitle>
          {/* 服務連結清單 */}
          <ul className="mt-4 text-sm">
            {/* 逐一產生服務連結 */}
            {services.map((s) => (
              // 清單項目
              <li key={s.label}>
                {/* 服務連結；滑鼠移上變紅字 */}
                <Link href={s.href} className={footLink}>
                  {/* 服務名稱 */}
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 第 4 欄：聯絡資訊 */}
        <div>
          {/* 欄位標題 */}
          <ColumnTitle>聯絡資訊</ColumnTitle>
          {/* 聯絡資訊清單 */}
          <ul className="mt-4 text-sm">
            {/* 電話 */}
            <li>
              {/* 手機上點擊可直接撥號 */}
              <a href="tel:0226082585" className={footLink}>T:(02)2608-2585</a>
            </li>
            {/* 傳真（無法點擊撥打，只顯示號碼） */}
            <li className="flex min-h-11 items-center">F:(02)2600-6748</li>
            {/* Email */}
            <li>
              {/* 點擊開啟寄信程式；break-all 讓長網址在窄螢幕自動換行 */}
              <a href="mailto:shung3758@gmail.com" className={`break-all ${footLink}`}>shung3758@gmail.com</a>
            </li>
            {/* 公司地址（灰字） */}
            <li className="flex min-h-11 items-center text-muted">新北市林口區文化二路一段68巷39號6F</li>
            {/* 營業時間（灰字） */}
            <li className="flex min-h-11 items-center text-muted">週一至週五 09:00–18:00</li>
          </ul>
        </div>
      </div>

      {/* 底部品牌紅色色帶 */}
      <div className="bg-brand-deep text-white">
        {/* 手機直向置中排列；平板以上橫向左右分散 */}
        <div className={`${container} flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between`}>
          {/* 左：白色 LOGO ＋ 分隔線 ＋ 公司名稱 */}
          <span className="flex items-center gap-3">
            {/* 白色反白 LOGO，高 32px（裝飾用，alt 留空） */}
            <Image src="/brand/logo-shung-white.png" alt="" width={240} height={139} className="h-8 w-auto" />
            {/* 半透明白色直線分隔 */}
            <span aria-hidden="true" className="h-6 w-px bg-white/50" />
            {/* 公司名稱，字距加寬 */}
            <span className="tracking-[0.4em]">世紘興業</span>
          </span>
          {/* 中：版權聲明，年份自動抓今年 */}
          <span className="text-xs text-white/90">© {new Date().getFullYear()} 世紘興業 All rights reserved.</span>
          {/* 右：回到頁面頂端；滑鼠移上變半透明；點擊高度至少 44px */}
          <a href="#" className="inline-flex min-h-11 items-center text-xs tracking-[0.2em] transition hover:opacity-70">
            回到頂部
          </a>
        </div>
      </div>
    </footer>
  );
}
