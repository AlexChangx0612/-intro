// 匯入 Next.js 圖片元件
import Image from "next/image";
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
// 匯入共用版心樣式
import { container } from "./lib/ui";

// 「適用場域」清單
const scenes = ["銀行・郵局", "醫院・診所", "百貨商場", "機場・車站", "展覽活動", "飯店・餐廳"];

// 「世紘優勢」三項服務
const services = [
  // 服務 1
  { title: "免費空間規劃", desc: "告訴我們場地與需求，專人為您規劃排隊動線並提供報價。" },
  // 服務 2
  { title: "企業識別客製", desc: "拒馬看板、告示牌與海報架，皆可置入貴公司的品牌視覺。" },
  // 服務 3
  { title: "台灣製造", desc: "多款欄柱與設備於台灣在地生產，品質穩定，溝通即時。" },
];

// 首頁
export default function Home() {
  // 讀取產品分類與特價商品圖片
  const { categories, onsale } = getCatalog();
  // 只取分類的 id 與名稱，傳給頁首與頁尾使用
  const links = categories.map(({ id, name }) => ({ id, name }));
  // 「適用場域」的大圖：掛繩欄柱的第一張（找不到就用第一個分類）
  const featureImage = (categories.find((c) => c.id === "rope") ?? categories[0])?.images[0];
  // 首屏磚牆用的產品照：各分類第一張
  const mosaic = categories.map((c) => c.images[0]);

  // 回傳整個首頁
  return (
    // 暖白底、主要文字顏色
    <div className="bg-paper text-ink">
      {/* 頁首 */}
      <SiteHeader categories={links} />

      {/* 主要內容 */}
      <main>
        {/* 首屏：超大標題＋無限捲動磚牆 */}
        <HeroMosaic images={mosaic} />

        {/* 系列 */}
        {/* 探索系列區塊；scroll-mt 讓錨點跳轉時不被固定的 header 擋住（跳轉時 header 已縮成精簡版） */}
        <section id="collections" className="scroll-mt-20 sm:scroll-mt-24 py-20 sm:py-28">
          {/* 版心 */}
          <div className={container}>
            {/* 區塊標題 */}
            <SectionTitle eyebrow="COLLECTIONS" title="探索系列" />
            {/* 第一個分類放大為主打（2×2），其餘 12 個剛好排滿 */}
            {/* 手機一排 2 個、電腦一排 4 個 */}
            <div className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-14 lg:grid-cols-4">
              {/* 每個分類產生一個方塊；i 為順序 */}
              {categories.map((c, i) => (
                // 點擊後切換到該分類
                <a
                  // 唯一值
                  key={c.id}
                  // 連到商品目錄的該分類
                  href={`#c-${c.id}`}
                  // 第一個方塊橫跨 2 欄，電腦版再縱跨 2 列
                  className={`group block ${i === 0 ? "col-span-2 lg:row-span-2" : ""}`}
                >
                  {/* 正方形圓角圖片框（手機圓角 14px、電腦 22px） */}
                  <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[22px]">
                    {/* 分類代表圖（產品照上有型號與標籤，不做放大裁切，確保資訊完整） */}
                    <Image
                      // 該分類第一張圖
                      src={c.images[0]}
                      // 替代文字為分類名稱
                      alt={c.name}
                      // 填滿外框
                      fill
                      // 主打圖：電腦版約半個螢幕寬、手機滿版；其他：電腦版約 1/4、手機約一半
                      sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                      // 等比例填滿；滑鼠移上時緩慢放大
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  {/* 分類名稱：置中，滑鼠移上變紅字 */}
                  <p className="mt-5 text-center text-[17px] tracking-[0.1em] transition group-hover:text-brand-deep">{c.name}</p>
                </a>
              ))}
            </div>
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
                    alt="掛繩欄柱"
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
              {/* 場域編號清單，上方有分隔線 */}
              <ol className="mt-10 border-t border-line">
                {/* 每個場域一列；i 為順序 */}
                {scenes.map((s, i) => (
                  // 一列：編號＋名稱，下方有分隔線
                  <li key={s} className="flex items-baseline gap-6 border-b border-line py-4">
                    {/* 編號：01、02…（補零成兩位數），品牌紅 */}
                    <span className="w-6 text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {/* 場域名稱 */}
                    <span className="text-lg tracking-[0.1em]">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 特價商品 */}
        {/* 有特價圖片時才顯示這個區塊 */}
        {onsale.length > 0 && (
          // 特價商品區塊
          <section id="onsale" className="scroll-mt-20 sm:scroll-mt-24 py-20 sm:py-28">
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
              <ProductRail images={onsale} alt="特價商品" />
            </div>
          </section>
        )}

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
                <h3 className="mt-4 text-xl tracking-[0.1em] text-brand-deep">{s.title}</h3>
                {/* 服務說明：灰字，最寬約 320px */}
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pretty text-muted md:mx-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 聯絡 */}
        {/* 紅底白字、置中 */}
        <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 bg-brand-deep py-24 text-center text-white sm:py-32">
          {/* 版心 */}
          <div className={container}>
            {/* 英文小標：85% 白 */}
            <p className="text-xs tracking-[0.35em] text-white/85">CONTACT</p>
            {/* 主標題：手機 28px → 平板以上 42px */}
            <h2 className="mt-5 text-2xl tracking-[0.12em] sm:text-4xl">需要規劃空間動線嗎？</h2>
            {/* 說明文字：90% 白，最寬約 448px */}
            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/90">
              告訴我們您的場地與需求，專人將為您提供免費規劃與報價。
            </p>
            {/* 兩顆按鈕：手機上下排列；平板以上左右並排 */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              {/* 電話按鈕 */}
              <a
                // 手機上點擊直接撥號
                href="tel:0226082585"
                // 白框膠囊按鈕；滑鼠移上變白底紅字
                className="inline-flex h-14 w-full max-w-60 items-center justify-center rounded-[20px] border border-white px-8 text-sm tracking-[0.2em] transition hover:bg-white hover:text-brand-deep active:translate-y-px sm:w-auto"
              >
                02-2608-2585
              </a>
              {/* Email 按鈕 */}
              <a
                // 點擊開啟寄信程式
                href="mailto:shung3758@gmail.com"
                // 白底紅字膠囊按鈕；滑鼠移上稍微變透明
                className="inline-flex h-14 w-full max-w-60 items-center justify-center rounded-[20px] bg-white px-8 text-sm tracking-[0.2em] text-brand-deep transition hover:bg-white/90 active:translate-y-px sm:w-auto"
              >
                Email 諮詢
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 頁尾 */}
      <SiteFooter categories={links} />
    </div>
  );
}
