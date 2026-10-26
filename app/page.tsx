// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入客戶實際案例弧形輪播
import CaseCarousel from "./components/CaseCarousel";
// 匯入「產品系列」標題區（新品聚光燈）
import CollectionsSpotlight from "./components/CollectionsSpotlight";
// 匯入聯絡區塊
import ContactSection from "./components/ContactSection";
// 匯入常見問題清單
import FaqList from "./components/FaqList";
// 匯入結構化資料元件
import JsonLd from "./components/JsonLd";
// 匯入首屏主視覺（超大標題＋無限捲動磚牆）
import HeroMosaic from "./components/HeroMosaic";
// 匯入全系列商品目錄
import ProductCatalog from "./components/ProductCatalog";
// 匯入區塊標題元件
import SectionTitle from "./components/SectionTitle";
// 匯入底部品牌紅色色帶
import { FooterBar } from "./components/SiteFooter";
// 匯入頁首
import SiteHeader from "./components/SiteHeader";
// 匯入讀取產品圖片的函式
import { getCatalog } from "./lib/products";
// 匯入客戶實際案例資料（置換照片與說明請改這個檔案）
import { cases } from "./lib/cases";
// 匯入首頁常見問題
import { homeFaqs } from "./lib/faq";
// 匯入 SEO 工具
import { faqJsonLd, HOME_DESCRIPTION, HOME_TITLE, ORG_ID, organizationJsonLd, pageMetadata, SITE_URL } from "./lib/site";
// 匯入共用樣式
import { container, outlineBtn, wide } from "./lib/ui";

// 首頁標題、描述與 canonical
export const metadata: Metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

// 「關於世紘」區塊的延伸閱讀連結
const more = [
  { href: "/advantages", label: "世紘優勢", desc: "多國專利與第三方檢驗" },
  { href: "/custom", label: "客製化服務", desc: "置入企業識別" },
  { href: "/catalog", label: "產品電子目錄", desc: "線上瀏覽與 PDF 下載" },
];

// 首頁
export default function Home() {
  // 讀取產品分類
  const { categories } = getCatalog();
  // 只取分類的 id、網址代號與名稱，傳給頁首使用
  const links = categories.map(({ id, slug, name }) => ({ id, slug, name }));
  // 首屏磚牆用的產品照：各分類第一張
  const mosaic = categories.map((c) => c.images[0]);

  // 回傳整個首頁
  return (
    // 暖白底、主要文字顏色
    <div className="bg-paper text-ink">
      {/* 結構化資料：公司、網站、常見問題 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "世紘興業", url: `${SITE_URL}/`, inLanguage: "zh-Hant-TW", publisher: { "@id": ORG_ID } },
          faqJsonLd(homeFaqs),
        ]}
      />
      {/* 頁首 */}
      <SiteHeader categories={links} />

      {/* 主要內容 */}
      <main>
        {/* 首屏：超大標題＋無限捲動磚牆 */}
        <HeroMosaic images={mosaic} />

        {/* 產品系列＋全系列商品（整合為同一區塊）：上方系列圖示方塊切換分類，下方顯示該系列商品 */}
        {/* 緊接首屏，首屏「尋找產品」直接到這裡；上方有分隔線；scroll-mt 讓錨點跳轉時不被固定的 header 擋住 */}
        <section id="collections" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          {/* 滿版：不限最大寬度，佔滿整個畫面 */}
          <div className={wide}>
            {/* 標題區：左邊標題與系列入口，右邊新品／服務／LINE 諮詢分頁式輪播（內容在 app/lib/spotlight.ts） */}
            <CollectionsSpotlight categories={links} />
            {/* 商品目錄（系列方塊＋商品圖片） */}
            <ProductCatalog categories={categories} />
          </div>
        </section>

        {/* 客戶實際案例：弧形輪播（上方有分隔線，與其他區塊一致） */}
        <div className="border-t border-line">
          <CaseCarousel cases={cases} />
        </div>

        {/* 常見問題（上方有分隔線）：手機上下排列，電腦左標題右問答 */}
        <section id="faq" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          <div className={`${container} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
            <SectionTitle align="left" eyebrow="FAQ" title="常見問題" desc="關於欄柱選擇、數量估算與採購的常見問題。" />
            <FaqList faqs={homeFaqs} />
          </div>
        </section>

        {/* 聯絡 */}
        <ContactSection />

        {/* 關於世紘：公司簡介（上方有分隔線）；手機上下排列，電腦左標題右文字 */}
        <section id="about" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          <div className={`${container} grid gap-10 lg:grid-cols-2 lg:gap-20`}>
            {/* 靠左的區塊標題 */}
            <SectionTitle align="left" eyebrow="ABOUT SHIHHUNG" title="專注公共與商業空間設備的台灣專業廠商" />
            {/* 簡介與連結 */}
            <div>
              <p className="text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">
                世紘興業有限公司成立於 2015 年，專注於公共與商業空間周邊設備的研製與供應，產品涵蓋紅龍柱、伸縮帶欄柱、展示設備、告示牌、公共清潔設備、垃圾桶、工作推車及物業管理相關設備。世紘整合相關產業資源，以「創新、品質、誠信」為核心理念，服務企業、政府機關、學校、商場、飯店、交通場站及各類公共空間。
              </p>
              {/* 延伸閱讀：清單，上下淡紅分隔線；每列連到對應頁面 */}
              <ul className="mt-10 border-t border-line">
                {more.map((m) => (
                  <li key={m.href} className="border-b border-line">
                    <Link href={m.href} className="group flex items-baseline gap-6 py-4 transition hover:text-brand-deep">
                      {/* 頁面名稱 */}
                      <span className="text-lg tracking-[0.1em]">{m.label}</span>
                      {/* 說明：灰字，手機隱藏 */}
                      <span className="hidden text-sm text-muted sm:inline">{m.desc}</span>
                      {/* 箭頭：靠右，滑鼠移上右移 */}
                      <span aria-hidden="true" className="ml-auto text-brand-deep transition group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* 紅框按鈕：連到關於世紘頁 */}
              <Link href="/about" className={`${outlineBtn} mt-10`}>
                了解世紘興業
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 底部品牌紅色色帶 */}
      <footer>
        <FooterBar />
      </footer>
    </div>
  );
}
