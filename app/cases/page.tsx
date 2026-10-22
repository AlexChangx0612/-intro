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
import { cases } from "../lib/cases";
// 匯入 SEO 工具
import { pageMetadata } from "../lib/site";
// 匯入共用樣式
import { bodyText, card, container, outlineBtn, pageTop } from "../lib/ui";

// 中繼資料
// 目前案例照片為網路示意圖，先不讓搜尋引擎收錄、也不列入 sitemap；換成真實案例後移除 robots 這一行，並把 /cases 加進 app/sitemap.ts
export const metadata: Metadata = {
  ...pageMetadata({
    title: "客戶實際案例｜紅龍柱與公共空間設備應用｜世紘興業",
    description: "世紘興業的客戶實際案例：機場、醫院、美術館、飯店、影城與戶外活動的排隊動線與公共空間設備規劃。",
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
              desc="從機場、醫院到影城與展演空間，看看欄柱與公共空間設備，如何在不同場域中安排從容的動線。"
            />
          </div>

          {/* 案例卡片：手機 1 欄、平板 2 欄、電腦 3 欄；照片 16:9（與首頁輪播相同比例） */}
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {cases.map((c, i) => (
              <li key={c.image} className={`overflow-hidden ${card}`}>
                <div className="relative aspect-video bg-white">
                  <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1024px) 460px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 lg:p-8">
                  <span className="text-xs tracking-[0.3em] text-brand-deep">SCENE {String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-3 text-lg tracking-[0.1em]">{c.scene}</h2>
                  <p className={`${bodyText} mt-1`}>{c.title}</p>
                </div>
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
