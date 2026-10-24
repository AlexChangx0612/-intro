// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入品牌故事版型（頁首大圖、引言、圖文交錯段落、收尾宣言、延伸閱讀）
import { StoryBand, StoryHero, StoryIntro, StoryLinks, StoryRows, type Story } from "../components/Story";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, company, ORG_ID, organizationJsonLd, pageMetadata } from "../lib/site";

// 頁面描述
const description =
  "世紘興業有限公司成立於2015年，專注公共與商業空間周邊設備的研製與供應，全系列台灣精密製造、嚴謹品質管理，產品取得多國專利並通過第三方檢驗，以「創新、品質、誠信」服務企業、政府機關、學校與各類公共空間。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "關於世紘｜公共與商業空間設備專業供應商｜世紘興業",
  description,
  path: "/about",
});

// 關於世紘頁
export default function AboutPage() {
  // 產品分類（用於系列數）
  const { categories } = getCatalog();

  // 七個段落：台灣精密製造、嚴謹品質管理、專利認證背書、創新、品質、誠信、實用多功能
  // 圖片為 Unsplash 免費圖庫（可商用），放在 public/about/
  const stories: Story[] = [
    {
      en: "MADE IN TAIWAN",
      title: "台灣精密製造",
      body: "全系列欄柱與公共空間設備皆於台灣在地生產。尺寸精準、品質穩定，遇到客製需求或急件，也能即時溝通、快速調整，不必跨海等待。",
      image: "/about/manufacturing.jpg",
      alt: "CNC 銑床精密加工金屬零件",
      href: "/products",
      cta: "探索產品系列",
    },
    {
      en: "QUALITY CONTROL",
      title: "嚴謹品質管理",
      body: "關鍵材料與結構皆送交公正第三方實驗室檢驗，以數據證明耐用度，而不只是口頭保證。",
      image: "/about/quality-control.jpg",
      alt: "以游標卡尺量測金屬零件尺寸",
      points: ["SGS 伸縮帶欄柱耐久測試：織帶拉伸 10,000 次無損壞", "金屬中心鋁材鹽霧試驗：24 小時無可見腐蝕"],
      href: "/advantages#reports",
      cta: "查看檢驗報告",
    },
    {
      en: "CERTIFIED",
      title: "專利認證背書",
      body: "產品設計取得多國專利，材料通過高關注物質檢測。每一項認證，都是可以被查證的承諾。",
      image: "/about/patents.jpg",
      alt: "蓋有紅色印章與簽名的證書",
      points: ["台灣、美國、日本、中國、德國、西班牙專利", "SGS 與 TÜV 萊因 REACH 高關注物質（SVHC）檢測"],
      href: "/advantages#patents",
      cta: "查看專利證書",
    },
    {
      en: "INNOVATION",
      title: "創新",
      body: "公共空間的動線、展示與管理需求不斷改變。我們持續開發與整合新產品，從結構設計到使用細節反覆改良，讓設備更好用、更耐用，也更好看。",
      image: "/about/innovation.jpg",
      alt: "放在工程圖上的精密金屬零件",
      href: "/custom",
      cta: "了解客製服務",
    },
    {
      en: "QUALITY",
      title: "品質",
      body: "從選材、加工到表面處理，每個環節都以長期使用為標準。經得起每天的人潮與碰撞，也經得起時間——這是我們對「品質」最實在的定義。",
      image: "/about/quality.jpg",
      alt: "精密加工的金屬零件細節",
      href: "/advantages",
      cta: "世紘優勢",
    },
    {
      en: "INTEGRITY",
      title: "誠信",
      body: "依場地與需求提供規劃與報價建議，說明清楚、承諾實在。不誇大、不隱藏，做得到的才答應，答應的就做到。",
      image: "/about/integrity.jpg",
      alt: "雙方在合約前握手",
      href: "/contact",
      cta: "聯絡我們",
    },
    {
      en: "VERSATILE",
      title: "實用多功能",
      body: `排隊動線、告示展示、環境與物業三大領域，${categories.length} 個產品系列可依場地自由搭配：多種柱身與織帶顏色、柱頭告示框等配件，一套設備就能應付不同場合。`,
      image: "/about/versatile.jpg",
      alt: "機場報到大廳以伸縮帶欄柱規劃的排隊動線",
      points: ["銀行・醫院・機場：櫃台排隊與入場管制", "百貨・飯店・展覽：活動宣傳與樓層指示", "學校・車站・大樓：清潔回收與後場管理"],
      href: "/solutions",
      cta: "場域解決方案",
    },
  ];

  return (
    <PageShell>
      {/* 結構化資料：組織＋關於頁 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "AboutPage", name: "關於世紘", description, url: absoluteUrl("/about"), about: { "@id": ORG_ID } },
        ]}
      />

      {/* 頁首大圖 */}
      <StoryHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "關於世紘", path: "/about" }]}
        eyebrow="ABOUT SHIHHUNG"
        title="關於世紘"
        subtitle="台灣製造的公共空間設備，讓每一個空間都井然有序。"
        image="/about/closing.jpg"
        alt="陽光灑落的機場航廈長廊"
      />

      {/* 引言 */}
      <StoryIntro
        strike="不只是一根欄柱。"
        statement="而是一個空間的秩序與品質。"
        paragraphs={[
          `世紘興業成立於 ${company.foundingYear} 年，專注公共與商業空間周邊設備的研製與供應，${categories.length} 個產品系列全部在台灣生產，並提供企業禮贈品服務。`,
          "從銀行櫃台、醫院掛號到機場報到大廳，從百貨展示到學校與車站——好的設備不搶眼，它只是讓人流順暢、讓空間有序、讓使用的人安心。",
          "因此我們堅持在地製造、嚴格把關、取得專利與第三方檢驗，並以「創新、品質、誠信」經營每一項產品與服務：",
        ]}
      />

      {/* 七個圖文段落 */}
      <StoryRows stories={stories} />

      {/* 收尾宣言 */}
      <StoryBand
        image="/about/workshop.jpg"
        alt="CNC 加工中心切削鋁件"
        lines={["從一根欄柱，到一整個空間的秩序。", "世紘以台灣製造的標準，", "陪每一個場域把人流安排好。"]}
      />

      {/* 延伸閱讀 */}
      <StoryLinks
        links={[
          { href: "/products", label: "了解更多產品系列", image: "/cases/zhulinshan-guanyin-temple/01.jpg", alt: "竹林山觀音寺殿前的金色伸縮帶欄柱" },
          { href: "/custom", label: "了解更多客製服務", image: "/about/branding.jpg", alt: "色票扇形展開" },
          { href: "/cases", label: "了解更多客戶案例", image: "/cases/kham-art-ntsec/04.jpg", alt: "士林科教館樂高特展的黑色欄柱" },
        ]}
      />
    </PageShell>
  );
}
