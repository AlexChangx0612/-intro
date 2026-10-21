// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入場域應用弧形輪播
import CaseCarousel from "./components/CaseCarousel";
// 匯入產品系列方塊
import CollectionGrid from "./components/CollectionGrid";
// 匯入聯絡區塊
import ContactSection from "./components/ContactSection";
// 匯入常見問題清單
import FaqList from "./components/FaqList";
// 匯入結構化資料元件
import JsonLd from "./components/JsonLd";
// 匯入首屏主視覺（超大標題＋無限捲動磚牆）
import HeroMosaic from "./components/HeroMosaic";
// 匯入視差捲動元件
import Parallax from "./components/Parallax";
// 匯入全系列商品目錄
import ProductCatalog from "./components/ProductCatalog";
// 匯入橫向捲動商品列（特價商品用）
import ProductRail from "./components/ProductRail";
// 匯入區塊標題元件
import SectionTitle from "./components/SectionTitle";
// 匯入頁尾
import SiteFooter from "./components/SiteFooter";
// 匯入頁首
import SiteHeader from "./components/SiteHeader";
// 匯入讀取產品圖片的函式
import { getCatalog } from "./lib/products";
// 匯入場域應用資料（置換照片與說明請改這個檔案）
import { cases } from "./lib/cases";
// 匯入首頁常見問題
import { homeFaqs } from "./lib/faq";
// 匯入 SEO 工具
import { faqJsonLd, HOME_DESCRIPTION, HOME_TITLE, ORG_ID, organizationJsonLd, pageMetadata, SITE_URL } from "./lib/site";
// 匯入適用場域資料
import { solutions } from "./lib/solutions";
// 匯入共用樣式
import { container, outlineBtn } from "./lib/ui";

// 首頁標題、描述與 canonical
export const metadata: Metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

// 「世紘優勢」三項服務
const services = [
  // 服務 1
  { title: "免費空間規劃", desc: "告訴我們場地與需求，專人為您規劃排隊動線並提供報價。" },
  // 服務 2
  { title: "企業識別客製", desc: "拒馬看板、告示牌與海報架，皆可置入貴公司的品牌視覺。" },
  // 服務 3
  { title: "多款台灣製造", desc: "多款欄柱與設備於台灣在地生產，品質穩定，溝通即時。" },
];

// 首頁
export default function Home() {
  // 讀取產品分類與特價商品圖片
  const { categories, onsale } = getCatalog();
  // 只取分類的 id、網址代號與名稱，傳給頁首、頁尾與產品系列方塊使用
  const links = categories.map(({ id, slug, name }) => ({ id, slug, name }));
  // 「適用場域」的大圖：掛繩欄柱的第一張（找不到就用第一個分類）
  const featureImage = (categories.find((c) => c.id === "rope") ?? categories[0])?.images[0];
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
              {/* 紅框按鈕：連到關於世紘頁 */}
              <Link href="/about" className={`${outlineBtn} mt-10`}>
                了解世紘興業
              </Link>
            </div>
          </div>
        </section>

        {/* 場域應用：弧形輪播 */}
        <CaseCarousel cases={cases} />

        {/* 特價商品 */}
        {/* 有特價圖片時才顯示這個區塊 */}
        {onsale.length > 0 && (
          // 特價商品區塊（上方有分隔線）
          <section id="onsale" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
            {/* 版心 */}
            <div className={container}>
              {/* 標題列：手機上下排列置中；平板以上左標題、右備註 */}
              <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
                {/* 靠左的區塊標題 */}
                <SectionTitle align="left" eyebrow="SPECIAL OFFERS" title="特價商品" />
                {/* 右側備註：灰字 */}
                <p className="text-sm text-muted">限量優惠，售完為止。</p>
              </div>
              {/* 橫向捲動的特價商品列 */}
              <ProductRail images={onsale} alt="世紘特價商品" />
            </div>
          </section>
        )}

        {/* 系列 */}
        {/* 產品系列區塊（上方有分隔線）；scroll-mt 讓錨點跳轉時不被固定的 header 擋住（跳轉時 header 已縮成精簡版） */}
        <section id="collections" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          {/* 版心 */}
          <div className={container}>
            {/* 區塊標題 */}
            <SectionTitle eyebrow="COLLECTIONS" title="產品系列" />
            {/* 13 個系列圖示方塊：點擊進入分類頁 */}
            <CollectionGrid categories={links} />
          </div>
        </section>

        {/* 全系列商品 */}
        {/* 上方有分隔線 */}
        <section id="products" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          {/* 版心 */}
          <div className={container}>
            {/* 區塊標題與說明 */}
            <SectionTitle eyebrow="ALL PRODUCTS" title="全系列商品" desc="點擊圖片可檢視大圖。" />
            {/* 與標題間距 56px */}
            <div className="mt-14">
              {/* 商品目錄（分類選單＋圖片） */}
              <ProductCatalog categories={categories} />
            </div>
          </div>
        </section>

        {/* 適用場域 */}
        {/* 淡粉底色 */}
        <section id="applications" className="scroll-mt-20 sm:scroll-mt-24 bg-ivory py-20 sm:py-28">
          {/* 手機上下排列；電腦左圖右文兩欄 */}
          <div className={`${container} grid items-center gap-12 lg:grid-cols-2 lg:gap-20`}>
            {/* 有大圖時才顯示 */}
            {featureImage && (
              // 視差：整個圖框隨捲動輕微移動（圖片本身不裁切）
              <Parallax speed={0.06}>
                {/* 正方形圓角圖片框，白底 */}
                <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[22px]">
                  {/* 掛繩欄柱大圖 */}
                  <Image
                    // 圖片網址
                    src={featureImage}
                    // 替代文字
                    alt="世紘掛繩欄柱產品照"
                    // 填滿外框
                    fill
                    // 電腦版約半個螢幕寬，手機滿版
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    // 等比例填滿
                    className="object-cover"
                  />
                </div>
              </Parallax>
            )}
            {/* 右側文字 */}
            <div>
              {/* 靠左的區塊標題 */}
              <SectionTitle
                // 靠左對齊
                align="left"
                // 英文小標
                eyebrow="APPLICATIONS"
                // 主標題
                title="為每一個公共空間，安排秩序"
                // 說明文字
                desc="從銀行大廳到大型展覽，依場域的人流與氛圍，挑選合適的欄柱與設備。"
              />
              {/* 場域編號清單，上方有分隔線；每列連到該場域頁 */}
              <ol className="mt-10 border-t border-line">
                {/* 每個場域一列；i 為順序 */}
                {solutions.map((s, i) => (
                  // 一列：編號＋名稱，下方有分隔線
                  <li key={s.slug} className="border-b border-line">
                    <Link href={`/solutions/${s.slug}`} className="flex items-baseline gap-6 py-4 transition hover:text-brand-deep">
                      {/* 編號：01、02…（補零成兩位數），品牌紅 */}
                      <span className="w-6 text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                      {/* 場域名稱 */}
                      <span className="text-lg tracking-[0.1em]">{s.name}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 服務 */}
        {/* 世紘優勢區塊（header「世紘優勢」連到這裡），上方有分隔線 */}
        <section id="advantages" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          {/* 手機上下排列；平板以上三欄 */}
          <div className={`${container} grid gap-12 md:grid-cols-3 md:gap-10`}>
            {/* 每項服務一欄；i 為順序 */}
            {services.map((s, i) => (
              // 手機置中；平板以上靠左
              <div key={s.title} className="text-center md:text-left">
                {/* 編號：01、02、03，品牌紅 */}
                <p className="text-xs text-brand">{String(i + 1).padStart(2, "0")}</p>
                {/* 服務名稱：深品牌紅 */}
                <h2 className="mt-4 text-xl tracking-[0.1em] text-brand-deep">{s.title}</h2>
                {/* 服務說明：灰字，最寬約 320px */}
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pretty text-muted md:mx-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 常見問題（上方有分隔線）：手機上下排列，電腦左標題右問答 */}
        <section id="faq" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          <div className={`${container} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
            <SectionTitle align="left" eyebrow="FAQ" title="常見問題" desc="關於欄柱選擇、數量估算與採購的常見問題。" />
            <FaqList faqs={homeFaqs} />
          </div>
        </section>

        {/* 聯絡 */}
        <ContactSection />
      </main>

      {/* 頁尾 */}
      <SiteFooter categories={links} />
    </div>
  );
}
