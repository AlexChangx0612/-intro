// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入客戶實際案例資料（置換照片與說明請改這個檔案）
import { caseHref, cases } from "../lib/cases";
// 匯入 SEO 工具
import { pageMetadata } from "../lib/site";
// 匯入共用樣式
import { bodyText, card, cardHover, container, outlineBtn, pageTop } from "../lib/ui";

// 中繼資料
// CMS 完成、網站正式上線前先不讓搜尋引擎收錄、也不列入 sitemap；上線時移除 robots 這一行，並把 /cases 與各案例頁加進 app/sitemap.ts
export const metadata: Metadata = {
  ...pageMetadata({
    title: "客戶實際案例｜紅龍柱與公共空間設備應用｜世紘興業",
    description: "世紘興業的客戶實際案例：經國七海文化園區、竹林山觀音寺、台南天壇、連江縣政府、小米門市與台鋼雄鷹的欄柱與拒馬應用。",
    path: "/cases",
  }),
  robots: { index: false, follow: true },
};

// 客戶實際案例總覽頁
export default function CasesPage() {
  return (
    <PageShell>
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "客戶實際案例", path: "/cases" }]} />
          <div className="mt-10">
            <SectionTitle
              as="h1"
              eyebrow="CASE STUDIES"
              title="走進各種場域，看見秩序的樣子"
              desc="從文化園區、寺廟、政府機關到門市與職業球團，看看世紘的欄柱與拒馬，如何在真實場域中安排從容的動線。"
            />
          </div>

          {/* 案例卡片：手機 1 欄、平板 2 欄、電腦 4 欄（8 個案例剛好兩排）；照片 16:9（與首頁輪播相同比例）；點擊進入案例詳細頁 */}
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {cases.map((c, i) => (
              <li key={c.slug}>
                <Link href={caseHref(c.slug)} className={`group flex h-full flex-col overflow-hidden ${card} ${cardHover}`}>
                  <div className="relative aspect-video overflow-hidden bg-white">
                    {/* 第一排（電腦版前四張）一進頁面就看得到，直接載入 */}
                    <Image src={c.cover.src} alt={c.cover.alt} fill loading={i < 4 ? "eager" : "lazy"} sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs tracking-[0.25em] text-brand-deep">{c.scene}</p>
                    <h2 className="mt-2 text-lg tracking-[0.1em] text-ink transition group-hover:text-brand-deep">{c.title}</h2>
                    <p className={`${bodyText} mt-2 flex-1`}>{c.summary}</p>
                    <span className="mt-5 text-sm tracking-[0.15em] text-brand-deep">
                      看案例 <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* 行動按鈕：連到聯絡我們頁 */}
          <div className="mt-16 text-center">
            <Link href="/contact" className={outlineBtn}>
              免費規劃我的場地
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
