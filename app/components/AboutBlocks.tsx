// 「關於世紘」與「世紘優勢」共用的區塊：左文右圖的頁首、紅底數字帶
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "./Breadcrumbs";
// 匯入數字滾動
import CountUp from "./CountUp";
// 匯入麵包屑型別
import type { Crumb } from "../lib/site";
// 匯入共用樣式
import { container, pageTop, solidBtn, textLink } from "../lib/ui";

// 頁首：左邊麵包屑、大標題、一句說明與兩個行動按鈕，右邊放圖（children）；手機上下排列
export function SplitHero({
  crumbs,
  title,
  subtitle,
  link,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle: string;
  // 次要連結（主按鈕固定為「預約專員諮詢」）
  link: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className={`${pageTop} ${container} flex flex-wrap items-end gap-12`}>
      <div className="min-w-0 flex-[1_1_380px] pb-2">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-10 text-[clamp(44px,6vw,88px)] leading-none font-bold">{title}</h1>
        <p className="mt-8 max-w-[30em] text-[clamp(18px,1.5vw,21px)] leading-[1.7]">{subtitle}</p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a href="#contact" className={solidBtn}>
            預約專員諮詢
          </a>
          <Link href={link.href} className={textLink}>
            {link.label} →
          </Link>
        </div>
      </div>
      <div className="min-w-0 flex-[1.6_1_560px]">{children}</div>
    </section>
  );
}

// 數字帶：紅底白字；value 為數字（會滾動），unit 接在數字後，label 為下方說明；title 有值時顯示在上方
export function StatBand({
  title,
  stats,
}: {
  title?: string;
  stats: { value: string; unit?: string; extra?: string; label: string }[];
}) {
  return (
    <section className="mt-28 bg-brand-deep text-white">
      <div className={`${container} py-20`}>
        {title ? <h2 className="text-[clamp(24px,2.2vw,32px)] font-bold">{title}</h2> : <h2 className="sr-only">世紘興業的基本資料</h2>}
        <div className={`grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 ${title ? "mt-12" : ""}`}>
          {stats.map((s) => (
            <div key={s.label}>
              <p className="flex items-baseline text-[clamp(44px,4.4vw,64px)] leading-none font-bold whitespace-nowrap">
                {/[0-9]/.test(s.value) ? <CountUp value={s.value} /> : s.value}
                {s.unit && <span className="ml-[0.2em]">{s.unit}</span>}
                {s.extra && <span className="ml-[0.5em] text-[clamp(22px,2vw,28px)]">{s.extra}</span>}
              </p>
              <p className="mt-4 text-base leading-[1.6]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
