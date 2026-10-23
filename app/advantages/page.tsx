// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入證書格（點擊放大）
import CertificateGallery from "../components/CertificateGallery";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入優勢、專利與檢驗報告資料
import { advantages, patents, reach, reports } from "../lib/advantages";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, pageTop, section } from "../lib/ui";

// 頁面描述
const description =
  "世紘優勢：免費空間規劃、企業識別客製、全系列台灣製造，產品取得台灣、美國、日本、中國、德國、西班牙專利，並通過 SGS 耐久測試、REACH 檢測與金屬中心鹽霧試驗。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "世紘優勢｜專利認證・SGS 檢驗・台灣製造｜世紘興業",
  description,
  path: "/advantages",
});

// 世紘優勢頁
export default function AdvantagesPage() {
  return (
    <PageShell>
      {/* 結構化資料 */}
      <JsonLd data={[{ "@type": "WebPage", name: "世紘優勢", description, url: absoluteUrl("/advantages") }]} />

      {/* 頁首＋三項優勢 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "世紘優勢", path: "/advantages" }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
            <SectionTitle as="h1" align="left" eyebrow="WHY SHIHHUNG" title="世紘優勢，經得起檢驗的品質" />
            <p className="text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">
              從設計、專利到第三方檢驗，世紘的欄柱與公共空間設備在多國取得專利，並通過 SGS 與金屬工業研究發展中心等單位的測試。
            </p>
          </div>

          {/* 三項優勢（與首頁「世紘優勢」相同樣式） */}
          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
            {advantages.map((s) => (
              <div key={s.title} className="border-t border-line pt-8 text-center md:text-left">
                <h2 className="text-xl tracking-[0.1em] text-brand-deep">{s.title}</h2>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pretty text-muted md:mx-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 專利證書：各國一張，橫式合併圖，電腦 2 欄 */}
      <section id="patents" className={section}>
        <div className={container}>
          <SectionTitle eyebrow="PATENTS" title="多國專利認證" desc="產品設計取得台灣、美國、日本、中國、德國與西班牙專利。點擊圖片可放大檢視。" />
          <div className="mt-14">
            <CertificateGallery items={patents} cols={2} frame={240} />
          </div>
        </div>
      </section>

      {/* 檢驗報告：直式文件，電腦 5 欄 */}
      <section id="reports" className={section}>
        <div className={container}>
          <SectionTitle eyebrow="TEST REPORTS" title="第三方檢驗報告" desc="耐久度、耐腐蝕與有害物質，皆經公正第三方實驗室檢驗。點擊圖片可放大檢視。" />
          <div className="mt-14">
            <CertificateGallery items={reports} cols={5} />
          </div>
          {/* TÜV REACH 報告：橫式多頁合併圖，獨立一列 */}
          <div className="mx-auto mt-5 max-w-4xl">
            <CertificateGallery items={[reach]} cols={1} />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
