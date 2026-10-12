// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入產品系列線條圖示
import CategoryIcon from "./components/CategoryIcon";
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

// 聯絡按鈕：白框圓角卡片，圖示＋兩行文字；滑鼠移上變白底紅字
const contactBtn =
  "group flex h-[76px] items-center gap-3 rounded-[20px] border border-white/80 px-4 transition sm:gap-4 sm:px-5 hover:bg-white hover:text-brand-deep active:translate-y-px";
// 聯絡按鈕的圓形圖示底
const contactIcon =
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 transition group-hover:bg-brand-deep/10";

// 電話圖示
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
    </svg>
  );
}

// 信封圖示
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

// LINE 圖示：LINE 官方 icon 圖檔，44px（裝飾用，alt 留空）
function LineIcon() {
  return <Image src="/brand/line-icon.png" alt="" width={1024} height={1024} className="size-11 shrink-0 rounded-[10px]" />;
}

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
        {/* 產品系列區塊；scroll-mt 讓錨點跳轉時不被固定的 header 擋住（跳轉時 header 已縮成精簡版） */}
        <section id="collections" className="scroll-mt-20 sm:scroll-mt-24 py-20 sm:py-28">
          {/* 版心 */}
          <div className={container}>
            {/* 區塊標題 */}
            <SectionTitle eyebrow="COLLECTIONS" title="產品系列" />
            {/* 13 個系列圖示方塊：手機一排 2 個、平板以上 5 個、大螢幕 7 個；最後一排置中 */}
            <ul className="mt-14 flex flex-wrap justify-center gap-4 md:gap-5">
              {/* 每個分類產生一個方塊；i 為順序 */}
              {categories.map((c, i) => (
                // 方塊寬度依每排數量平分（扣除間距）
                <li
                  key={c.id}
                  className="w-[calc((100%-16px)/2)] md:w-[calc((100%-80px)/5)] xl:w-[calc((100%-120px)/7)]"
                >
                  {/* 點擊後切換到商品目錄的該分類 */}
                  <a
                    href={`#c-${c.id}`}
                    // 直式白卡（4:5）、細框；滑鼠移上微微浮起並加陰影
                    className="group relative flex aspect-[4/5] flex-col items-center justify-center rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(214,31,42,.18),0_18px_36px_-22px_rgba(15,15,14,.35)] lg:rounded-[18px]"
                  >
                    {/* 左上角編號：01、02… */}
                    <span className="absolute top-3 left-3.5 text-[11px] tracking-[0.15em] text-muted lg:top-4 lg:left-4">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* 系列圖示：固定大小，滑鼠移上變品牌紅 */}
                    <CategoryIcon id={c.id} className="size-12 text-ink transition duration-300 group-hover:text-brand-deep sm:size-14 xl:size-16" />
                    {/* 圖示下方細線：滑鼠移上拉長 */}
                    <span aria-hidden="true" className="mt-4 h-px w-5 bg-brand/50 transition-[width] duration-300 group-hover:w-9" />
                    {/* 系列名稱：空間不夠時只在「・」後換行，不把詞拆開；固定保留兩行高度，讓每張卡的圖示位置一致 */}
                    <span className="mt-3 flex min-h-[2lh] flex-wrap content-center justify-center px-2 text-center text-sm leading-snug tracking-[0.08em] transition group-hover:text-brand-deep lg:text-[15px]">
                      {c.name.split("・").map((part, j, all) => (
                        <span key={part}>
                          <span className="whitespace-nowrap">{j < all.length - 1 ? `${part}・` : part}</span>
                          {j < all.length - 1 && <wbr />}
                        </span>
                      ))}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
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
            <p className="text-xs tracking-[0.35em] text-white/85">CONTACT US</p>
            {/* 主標題：手機 28px → 平板以上 42px；手機在「立即」後換行 */}
            <h2 className="mt-5 text-2xl tracking-[0.12em] sm:text-4xl">
              <span className="whitespace-nowrap">線上專員立即</span>
              <wbr />
              <span className="whitespace-nowrap">為您提供報價服務</span>
            </h2>
            {/* 說明文字：90% 白；空間不夠時在「，」後換行 */}
            <p className="mx-auto mt-6 text-sm leading-7 text-white/90">
              <span className="whitespace-nowrap">告訴我們您的場地與需求，</span>
              <wbr />
              <span className="whitespace-nowrap">專員將為您提供免費規劃 &amp; 報價</span>
            </p>
            {/* 三顆按鈕：1280px 以下上下排列；以上左右並排，寬度相同 */}
            <div className="mx-auto mt-12 grid max-w-sm grid-cols-[minmax(0,1fr)] gap-4 xl:max-w-none xl:grid-cols-[repeat(3,21rem)] xl:justify-center xl:gap-6">
              {/* 電話：手機上點擊直接撥號 */}
              <a href="tel:0226082585" className={contactBtn}>
                <span className={contactIcon}>
                  <PhoneIcon />
                </span>
                <span className="text-left">
                  <span className="block text-xs tracking-[0.2em] opacity-80">電話</span>
                  <span className="block text-base tracking-[0.12em]">02-2608-2585</span>
                </span>
              </a>
              {/* E-MAIL：點擊開啟寄信程式 */}
              <a href="mailto:shung3758@gmail.com" className={contactBtn}>
                <span className={contactIcon}>
                  <MailIcon />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs tracking-[0.2em] opacity-80">E-MAIL 諮詢</span>
                  <span className="block truncate text-[15px] tracking-[0.04em] sm:text-base">shung3758@gmail.com</span>
                </span>
              </a>
              {/* LINE 官方帳號：另開新分頁加入好友 */}
              <a href="https://lin.ee/vcMIuCv" target="_blank" rel="noopener noreferrer" className={contactBtn}>
                <LineIcon />
                <span className="text-left">
                  <span className="block text-xs tracking-[0.2em] opacity-80">LINE 官方帳號</span>
                  <span className="block text-base tracking-[0.12em]">專員立即報價</span>
                </span>
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
