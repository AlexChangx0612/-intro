// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入公司聯絡資料
import { company } from "../lib/site";
// 匯入共用版心樣式
import { container } from "../lib/ui";

// 聯絡按鈕：白框圓角卡片，圖示＋兩行文字；滑鼠移上變白底紅字
const contactBtn =
  "group flex h-[76px] items-center gap-3 rounded-[20px] border border-white/80 px-4 transition sm:gap-4 sm:px-5 hover:bg-white hover:text-brand-deep active:translate-y-px";
// 聯絡按鈕的圓形圖示底
const contactIcon =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 transition group-hover:bg-brand-deep/10";

// 電話圖示
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

// 信封圖示
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

// LINE 圖示：LINE 官方 icon 圖檔，44px（裝飾用，alt 留空）
function LineIcon() {
  return <Image src="/brand/line-icon.png" alt="" width={1024} height={1024} className="size-11 shrink-0 rounded-[10px]" />;
}

// 聯絡區塊（紅底白字）：電話、E-MAIL、LINE 三種詢價方式；每一頁底部共用
export default function ContactSection() {
  return (
    // 紅底白字、置中
    <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 bg-brand-deep py-24 text-center text-white sm:py-32">
      {/* 版心 */}
      <div className={container}>
        {/* 主標題：手機 28px → 平板以上 42px；手機在「立即」後換行 */}
        <h2 className="text-2xl tracking-[0.12em] sm:text-4xl">
          <span className="whitespace-nowrap">線上專員立即</span>
          <wbr />
          <span className="whitespace-nowrap">為您提供服務</span>
        </h2>
        {/* 說明文字：90% 白；空間不夠時在「，」後換行 */}
        <p className="mx-auto mt-6 text-sm leading-7 text-white/90">
          <span className="whitespace-nowrap">告訴我們您的場地與需求，</span>
          <wbr />
          <span className="whitespace-nowrap">專員為您提供規劃與服務</span>
        </p>
        {/* 三顆按鈕：1280px 以下上下排列；以上左右並排，寬度相同 */}
        <div className="mx-auto mt-12 grid max-w-sm grid-cols-[minmax(0,1fr)] gap-4 xl:max-w-none xl:grid-cols-[repeat(3,21rem)] xl:justify-center xl:gap-6">
          {/* 電話：手機上點擊直接撥號 */}
          <a href={company.phoneHref} className={contactBtn}>
            <span className={contactIcon}>
              <PhoneIcon />
            </span>
            <span className="text-left">
              <span className="block text-xs tracking-[0.2em] opacity-80">電話</span>
              <span className="block text-base tracking-[0.12em]">{company.phone}</span>
            </span>
          </a>
          {/* E-MAIL：點擊開啟寄信程式 */}
          <a href={`mailto:${company.email}`} className={contactBtn}>
            <span className={contactIcon}>
              <MailIcon />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-xs tracking-[0.2em] opacity-80">E-MAIL 諮詢</span>
              <span className="block truncate text-[15px] tracking-[0.04em] sm:text-base">{company.email}</span>
            </span>
          </a>
          {/* LINE 官方帳號：另開新分頁加入好友 */}
          <a href={company.line} target="_blank" rel="noopener noreferrer" className={contactBtn}>
            <LineIcon />
            <span className="text-left">
              <span className="block text-xs tracking-[0.2em] opacity-80">LINE 官方帳號</span>
              <span className="block text-base tracking-[0.12em]">專員為您服務</span>
            </span>
          </a>
        </div>
        {/* LINE QR Code：電腦版給手機掃描加好友（手機直接點上方按鈕即可，不顯示） */}
        <div className="mx-auto mt-10 hidden w-fit items-center gap-5 rounded-[20px] bg-white p-4 pr-7 text-left text-ink sm:flex">
          <Image src={company.lineQr} alt="世紘興業 LINE 官方帳號 QR Code" width={540} height={540} className="size-32 shrink-0" />
          <span>
            <span className="block text-xs tracking-[0.2em] text-muted">LINE 官方帳號</span>
            <span className="mt-1 block text-base tracking-[0.12em]">手機掃描加入好友</span>
          </span>
        </div>
      </div>
    </section>
  );
}
