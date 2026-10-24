// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框（底部已有紅色聯絡區塊：電話、E-MAIL、LINE）
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入公司資料與 SEO 工具
import { absoluteUrl, company, organizationJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, pageTop } from "../lib/ui";

// 頁面描述
const description = `聯絡世紘興業：電話 ${company.phone}、Email ${company.email}、LINE 官方帳號，提供紅龍柱、欄柱與公共空間設備的免費空間規劃與報價。`;

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "聯絡我們｜免費空間規劃與報價｜世紘興業",
  description,
  path: "/contact",
});

// 完整地址
const address = `${company.address.region}${company.address.locality}${company.address.street}`;

// 聯絡資訊列：label 為項目名稱，value 為顯示文字，href 為連結（沒有則只顯示文字），external 為站外連結（另開新分頁）
const rows: { label: string; value: string; href?: string; external?: boolean }[] = [
  { label: "電話", value: company.phone, href: company.phoneHref },
  { label: "傳真", value: company.fax },
  { label: "E-MAIL", value: company.email, href: `mailto:${company.email}` },
  { label: "LINE", value: "LINE 官方帳號", href: company.line, external: true },
  { label: "地址", value: address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, external: true },
  { label: "營業時間", value: company.hours },
];

// 聯絡我們頁
export default function ContactPage() {
  return (
    <PageShell footerBarOnly>
      {/* 結構化資料：聯絡頁＋公司（含地址、電話與營業時間） */}
      <JsonLd data={[{ "@type": "ContactPage", name: "聯絡我們", description, url: absoluteUrl("/contact") }, organizationJsonLd()]} />

      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "聯絡我們", path: "/contact" }]} />
            <div className="mt-10">
              <SectionTitle
                as="h1"
                align="left"
                eyebrow="CONTACT"
                title="聯絡我們"
                desc="告訴我們您的場地與需求，專員將為您提供免費空間規劃與報價。詢問特定產品時，請提供產品頁上的型號或品項編號。"
              />
            </div>
          </div>

          {/* 聯絡資訊表 */}
          <dl className="border-t border-line lg:mt-16">
            {rows.map((r) => (
              <div key={r.label} className="flex gap-6 border-b border-line py-4 text-sm sm:text-base">
                <dt className="w-24 shrink-0 text-xs tracking-[0.2em] text-muted sm:pt-1">{r.label}</dt>
                {/* 不加 break-words：沿用全站的 overflow-wrap: anywhere，地址這類沒有標點的長字串才不會把欄位撐寬 */}
                <dd className="min-w-0">
                  {r.href ? (
                    <a
                      href={r.href}
                      // 站外連結（LINE、Google 地圖）另開新分頁
                      {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="transition hover:text-brand-deep"
                    >
                      {r.value}
                      {r.external && <span className="ml-2 text-xs text-muted">↗</span>}
                    </a>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </PageShell>
  );
}
