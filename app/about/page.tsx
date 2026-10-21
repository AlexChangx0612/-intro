// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入產品系列方塊
import CollectionGrid from "../components/CollectionGrid";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, company, ORG_ID, organizationJsonLd, pageMetadata } from "../lib/site";
// 匯入適用場域資料
import { solutions } from "../lib/solutions";
// 匯入共用樣式
import { bodyText, card, cardTitle, container, outlineBtn, pageTop, section } from "../lib/ui";

// 頁面描述
const description =
  "世紘興業有限公司成立於2015年，專注公共與商業空間周邊設備的研製與供應，產品涵蓋紅龍柱、伸縮帶欄柱、告示牌、展示設備、垃圾桶、清潔設備、推車與鑰匙箱，以「創新、品質、誠信」服務企業、政府機關、學校與各類公共空間。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "關於世紘｜公共與商業空間設備專業供應商｜世紘興業",
  description,
  path: "/about",
});

// 企業理念
const values = [
  { title: "創新", desc: "持續開發與整合新產品，回應公共空間不斷改變的動線、展示與管理需求。" },
  { title: "品質", desc: "多款欄柱與設備於台灣在地生產，品質穩定，溝通即時。" },
  { title: "誠信", desc: "依場地與需求提供規劃與報價建議，說明清楚、承諾實在。" },
];

// 服務項目
const services = [
  {
    id: "public",
    title: "公共空間設備",
    desc: "為政府機關、學校、醫院、車站等公共場域，提供排隊欄柱、告示牌、佈告欄、垃圾桶與資源回收、清潔衛生、傘架等設備，協助維持秩序與整潔。",
  },
  {
    id: "commercial",
    title: "商業空間設備",
    desc: "為銀行、百貨商場、飯店、餐廳與展覽活動，提供伸縮帶欄柱、掛繩欄柱、拒馬、海報架、數位看板與燈箱，兼顧動線與品牌形象；拒馬看板、告示牌與海報架皆可置入企業識別。",
  },
  {
    id: "property",
    title: "物業與後場設備",
    desc: "房務整備車、手推車、工具車、不鏽鋼工作桌與鑰匙箱，支援飯店房務、大樓物業管理與日常維修作業。",
  },
  {
    id: "gifts",
    title: "禮贈品服務",
    desc: "世紘亦提供企業禮贈品相關服務，品項、數量與客製方式，歡迎與專員洽詢。",
  },
];

// 關於世紘頁
export default function AboutPage() {
  // 產品分類
  const { categories } = getCatalog();
  return (
    <PageShell>
      {/* 結構化資料：組織＋關於頁 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "AboutPage", name: "關於世紘", description, url: absoluteUrl("/about"), about: { "@id": ORG_ID } },
        ]}
      />

      {/* 頁首：公司簡介 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "關於世紘", path: "/about" }]} />
            <div className="mt-10">
              <SectionTitle as="h1" align="left" eyebrow="ABOUT SHIHHUNG" title="世紘興業｜公共與商業空間設備專業供應商" />
            </div>
          </div>
          <div className="space-y-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8 lg:pt-16">
            <p>
              世紘興業有限公司成立於 {company.foundingYear} 年，是台灣專業的公共與商業空間周邊設備研製與供應商。產品涵蓋紅龍柱、伸縮帶欄柱、掛繩欄柱、室內外欄柱、塑膠欄柱、拒馬、告示牌、海報架、展示設備、數位看板、垃圾桶、資源回收設備、清潔衛生設備、傘架、推車、工具車與鑰匙箱。
            </p>
            <p>
              我們服務企業、政府機關、學校、銀行、郵局、醫院、診所、百貨商場、飯店、餐廳、機場、車站、展覽活動及其他公共空間，並整合相關產業資源，提供從排隊動線規劃到設備供應的服務。
            </p>
          </div>
        </div>
      </section>

      {/* 企業理念：三欄（與首頁「世紘優勢」相同樣式） */}
      <section className={section}>
        <div className={container}>
          <SectionTitle eyebrow="OUR VALUES" title="創新、品質、誠信" desc="世紘以「創新、品質、誠信」為核心理念，經營每一項產品與服務。" />
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {values.map((v, i) => (
              <div key={v.title} className="text-center md:text-left">
                <p className="text-xs text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-xl tracking-[0.1em] text-brand-deep">{v.title}</h3>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pretty text-muted md:mx-0">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 服務項目：白色卡片 */}
      <section id="services" className={section}>
        <div className={container}>
          <SectionTitle eyebrow="SERVICES" title="世紘的服務" desc="提供場地與需求，專人為您規劃排隊動線並提供報價，規劃服務免費。" />
          <div className="mt-14 grid gap-4 md:grid-cols-2 md:gap-5">
            {services.map((s, i) => (
              <article key={s.id} id={s.id} className={`scroll-mt-28 p-6 lg:p-8 ${card}`}>
                <p className="text-xs text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className={`${cardTitle} mt-4`}>{s.title}</h3>
                <p className={`${bodyText} mt-3`}>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 產品系列 */}
      <section className={section}>
        <div className={container}>
          <SectionTitle eyebrow="COLLECTIONS" title="產品系列" />
          <CollectionGrid categories={categories} />
        </div>
      </section>

      {/* 服務場域 */}
      <section className={section}>
        <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <SectionTitle align="left" eyebrow="APPLICATIONS" title="服務場域" desc="依場域查看動線規劃重點與建議設備配置。" />
            <Link href="/solutions" className={`${outlineBtn} mt-10`}>
              查看全部場域
            </Link>
          </div>
          <ol className="border-t border-line">
            {solutions.map((s, i) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/solutions/${s.slug}`} className="flex items-baseline gap-6 py-4 transition hover:text-brand-deep">
                  <span className="w-6 text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg tracking-[0.1em]">{s.name}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PageShell>
  );
}
