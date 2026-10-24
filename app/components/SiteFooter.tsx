// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入公司聯絡資料
import { company } from "../lib/site";
// 匯入共用版心樣式
import { container } from "../lib/ui";

// 完整地址（顯示與地圖搜尋共用）
const address = `${company.address.region}${company.address.locality}${company.address.street}`;

// 聯絡資訊清單：label 為英文小標，href 有值時可點擊
const contacts: { label: string; value: string; href?: string; external?: boolean }[] = [
  // 電話：手機上點擊直接撥號
  { label: "TEL", value: company.phone, href: company.phoneHref },
  // 傳真：只顯示號碼
  { label: "FAX", value: company.fax },
  // Email：點擊開啟寄信程式
  { label: "E-MAIL", value: company.email, href: `mailto:${company.email}` },
  // 地址：點擊另開 Google 地圖
  { label: "ADDRESS", value: address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, external: true },
  // 營業時間
  { label: "HOURS", value: company.hours },
];

// 頁尾元件；barOnly 為 true 時只顯示底部紅色色帶（不顯示公司簡介與聯絡資訊）
export default function SiteFooter({ barOnly = false }: { barOnly?: boolean }) {
  // 只留色帶
  if (barOnly) return <FooterBar />;
  // 回傳頁尾
  return (
    // 頁尾：上方淡紅分隔線、白底
    <footer className="border-t border-line bg-white">
      {/* 手機上下排列；電腦左品牌、右聯絡資訊（5：7） */}
      <div className={`${container} grid gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:py-24`}>
        {/* 左欄：公司標誌、名稱與簡介 */}
        <div>
          {/* 標誌＋公司名稱 */}
          <div className="flex items-center gap-5">
            {/* 公司標誌 72×72 */}
            <Image src={company.logo} alt="世紘興業 Shung 標誌" width={72} height={72} />
            {/* 淡紅直線分隔（與底部色帶的白色直線同概念） */}
            <span aria-hidden="true" className="h-10 w-px bg-line" />
            {/* 公司名稱與成立年份 */}
            <div>
              <p className="text-lg tracking-[0.3em] text-ink">{company.shortName}</p>
              <p className="mt-1 font-display text-xs tracking-[0.35em] text-brand-deep">SINCE {company.foundingYear}</p>
            </div>
          </div>
          {/* 公司簡介：灰字、最寬約 384px */}
          <p className="mt-8 max-w-sm text-sm leading-8 text-pretty text-muted">
            專營紅龍柱、排隊欄柱與公共空間設備，為銀行、醫院、商場與各式場館打造有秩序、有質感的空間。
          </p>
        </div>

        {/* 右欄：聯絡資訊 */}
        <div>
          {/* 欄位標題 */}
          <h2 className="text-xs tracking-[0.35em] text-brand-deep">CONTACT</h2>
          {/* 每項一列：左英文小標、右內容；上下淡紅分隔線（與首頁「適用場域」清單相同） */}
          <dl className="mt-6 border-t border-line">
            {contacts.map((c) => (
              // 一列：手機小標在上；平板以上左右並排
              <div key={c.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
                {/* 英文小標：品牌紅、字距加寬 */}
                <dt className="font-display text-xs tracking-[0.3em] text-brand">{c.label}</dt>
                {/* 內容：可點擊的項目滑鼠移上變紅字 */}
                <dd className="text-sm tracking-[0.06em] text-ink sm:text-base">
                  {c.href ? (
                    <a
                      href={c.href}
                      // 外部連結另開新分頁
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-all transition hover:text-brand-deep"
                    >
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 底部品牌紅色色帶 */}
      <FooterBar />
    </footer>
  );
}

// 底部品牌紅色色帶：內頁接在頁尾下方；首頁沒有頁尾，單獨放在最底部
export function FooterBar() {
  return (
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
  );
}
