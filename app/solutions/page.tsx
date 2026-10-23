// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入 SEO 工具
import { absoluteUrl, ORG_ID, pageMetadata } from "../lib/site";
// 匯入適用場域資料
import { solutions } from "../lib/solutions";
// 匯入共用樣式
import { bodyText, card, cardHover, cardTitle, container, pageTop } from "../lib/ui";

// 頁面描述
const description =
  "依場域查看排隊動線與公共空間設備規劃：銀行・郵局、醫院・診所、百貨・商場、機場・車站、展覽・活動、飯店・餐廳，世紘興業提供免費空間規劃與報價。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "適用場域｜銀行・醫院・商場・機場排隊動線規劃｜世紘興業",
  description,
  path: "/solutions",
});

// 適用場域總覽頁
export default function SolutionsPage() {
  return (
    <PageShell>
      {/* 結構化資料：場域頁清單 */}
      <JsonLd
        data={{
          "@type": "CollectionPage",
          name: "適用場域",
          description,
          url: absoluteUrl("/solutions"),
          publisher: { "@id": ORG_ID },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: solutions.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.h1,
              url: absoluteUrl(`/solutions/${s.slug}`),
            })),
          },
        }}
      />
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "適用場域", path: "/solutions" }]} />
          <div className="mt-10">
            <SectionTitle as="h1" eyebrow="APPLICATIONS" title="為每一個公共空間，安排秩序" desc="從銀行大廳到大型展覽，依場域的人流與氛圍，挑選合適的欄柱與設備。選擇場域查看規劃重點。" />
          </div>
          {/* 場域卡片：手機 1 欄、平板 2 欄、電腦 3 欄 */}
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {solutions.map((s) => (
              <li key={s.slug}>
                <Link href={`/solutions/${s.slug}`} className={`group flex h-full flex-col p-6 lg:p-8 ${card} ${cardHover}`}>
                  <h2 className={`${cardTitle} transition group-hover:text-brand`}>{s.name}</h2>
                  <p className={`${bodyText} mt-3`}>{s.intro}</p>
                  <span className="mt-6 text-sm tracking-[0.12em] text-brand-deep">查看規劃重點 →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
