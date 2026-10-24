// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入證書格（點擊放大）
import CertificateGallery from "../components/CertificateGallery";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入品牌故事版型（頁首大圖、引言、圖文交錯段落、收尾宣言、延伸閱讀）
import { StoryBand, StoryHero, StoryIntro, StoryLinks, StoryRows } from "../components/Story";
// 匯入優勢、專利與檢驗報告資料
import { advantages, patents, reach, reports } from "../lib/advantages";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, section } from "../lib/ui";

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

      {/* 頁首大圖 */}
      <StoryHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "世紘優勢", path: "/advantages" }]}
        eyebrow="WHY SHIHHUNG"
        title="世紘優勢"
        subtitle="經得起檢驗的品質：從規劃、客製到台灣製造，一次到位。"
        image="/about/workshop.jpg"
        alt="CNC 加工中心切削鋁件"
      />

      {/* 引言 */}
      <StoryIntro
        strike="說得好聽。"
        statement="不如經得起檢驗。"
        paragraphs={[
          "從設計、專利到第三方檢驗，世紘的欄柱與公共空間設備在多國取得專利，並通過 SGS 與金屬工業研究發展中心等單位的測試。",
          "選擇世紘，您得到的不只是設備，而是三項實在的保障：",
        ]}
      />

      {/* 三項優勢：圖文交錯段落 */}
      <StoryRows stories={advantages} />

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

      {/* 收尾宣言 */}
      <StoryBand
        image="/about/versatile.jpg"
        alt="機場報到大廳以伸縮帶欄柱規劃的排隊動線"
        lines={["免費規劃、品牌客製、台灣製造。", "把空間交給世紘，", "把心力留給您的客人。"]}
      />

      {/* 延伸閱讀 */}
      <StoryLinks
        links={[
          { href: "/about", label: "了解更多關於世紘", image: "/about/closing.jpg", alt: "陽光灑落的機場航廈長廊" },
          { href: "/products", label: "了解更多產品系列", image: "/about/manufacturing.jpg", alt: "CNC 銑床精密加工金屬零件" },
          { href: "/solutions", label: "了解更多場域方案", image: "/cases/xiaomi-store/05.jpg", alt: "小米門市門口的欄柱與雨傘架" },
        ]}
      />
    </PageShell>
  );
}
