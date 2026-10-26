// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入左文右圖頁首與紅底數字帶
import { SplitHero, StatBand } from "../components/AboutBlocks";
// 匯入客製織帶牆
import BeltWall from "../components/BeltWall";
// 匯入證書格（點擊放大）
import CertificateGallery from "../components/CertificateGallery";
// 匯入數字滾動
import CountUp from "../components/CountUp";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入專利證書分頁
import PatentTabs from "../components/PatentTabs";
// 匯入優勢、專利與檢驗報告資料
import { advantages, patents, reach, reports } from "../lib/advantages";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, solidBtn, textLink } from "../lib/ui";

// 頁面描述
const description =
  "世紘優勢：資深專員一對一服務、企業識別客製、全系列台灣製造，產品取得台灣、美國、日本、中國、德國、西班牙專利，並通過 SGS 耐久測試、REACH 檢測與金屬中心鹽霧試驗。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "世紘優勢｜專利認證・SGS 檢驗・台灣製造｜世紘興業",
  description,
  path: "/advantages",
});

// 頁首的三份檢驗報告（中間一張往下錯開）
const heroReports = [reports[0], reports[3], reports[1]];

// 區塊大標題
const h2 = "text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold";

// 世紘優勢頁
export default function AdvantagesPage() {
  // 產品系列數（帶入「全系列台灣製造」內文）
  const series = getCatalog().categories.length;

  return (
    <PageShell>
      {/* 結構化資料 */}
      <JsonLd data={[{ "@type": "WebPage", name: "世紘優勢", description, url: absoluteUrl("/advantages") }]} />

      {/* 頁首：左文右圖（三份檢驗報告） */}
      <SplitHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "世紘優勢", path: "/advantages" }]}
        title="世紘優勢"
        subtitle="資深專員一對一服務、企業識別客製、全系列台灣製造。每一項品質宣稱，都附上可以查證的專利與檢驗報告。"
        link={{ href: "#patents", label: "看專利與檢驗" }}
      >
        <figure>
          <div className="grid grid-cols-3 items-start gap-3 bg-[#e6e2da] p-6 sm:gap-6 sm:p-14">
            {heroReports.map((r, i) => (
              <div key={r.src} className={`relative bg-white ${i === 1 ? "mt-8" : ""}`} style={{ aspectRatio: `${r.width} / ${r.height}` }}>
                <Image src={r.src} alt={r.title} fill preload={i === 0} sizes="(min-width: 1024px) 18vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
          <figcaption className="mt-3 text-[15px] text-muted">SGS 與金屬中心出具的檢驗報告</figcaption>
        </figure>
      </SplitHero>

      {/* 紅底數字帶 */}
      <StatBand
        title="這些數字，都有報告可查"
        stats={[
          { value: "6", unit: "國", extra: "取得專利", label: "台灣、美國、日本、中國、德國、西班牙" },
          { value: "10,000", unit: "次", label: "織帶拉伸無損壞（SGS 耐久測試）" },
          { value: "24", unit: "小時", label: "鋁材鹽霧試驗無可見腐蝕（金屬中心）" },
          { value: "138", unit: "項", label: "高關注物質 SVHC 檢測通過（SGS）" },
        ]}
      />

      {/* 三項優勢：圖文左右交錯（第 2 項圖在左） */}
      <section className={`${container} pt-40`}>
        <h2 className={h2}>選擇世紘，您多得到的三件事</h2>
        {advantages.map((a, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={a.title} className={`flex flex-wrap items-center gap-14 ${i === 0 ? "mt-16" : "mt-28"} ${flip ? "flex-wrap-reverse" : ""}`}>
              <div className={`min-w-0 flex-[1_1_360px] ${flip ? "order-2" : ""}`}>
                <h3 className="text-[clamp(28px,2.6vw,38px)] font-bold">{a.title}</h3>
                <p className="mt-5 max-w-[30em] text-base leading-[1.8]">{a.body.replace("{series}", String(series))}</p>
                <Link href={a.href} className={`${textLink} mt-6`}>
                  {a.cta} →
                </Link>
              </div>
              <div className={`grid min-w-0 flex-[1.5_1_520px] gap-4 ${a.images.length > 1 ? "grid-cols-2" : ""} ${flip ? "order-1" : ""}`}>
                {a.images.map((img) => (
                  <div key={img.src} className="relative" style={{ aspectRatio: img.ratio }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes={a.images.length > 1 ? "(min-width: 1024px) 30vw, 50vw" : "(min-width: 1024px) 60vw, 100vw"}
                      className={img.contain ? "object-contain" : "object-cover"}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 客製織帶牆：深色底，讓五顏六色的織帶當主角 */}
      <section id="belts" className="mt-28 scroll-mt-24 bg-[#181818] py-28 text-white">
        <div className={`${container} flex flex-wrap items-end justify-between gap-8`}>
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 className={h2}>
              <CountUp value="61" /> 款客製織帶，都出自世紘
            </h2>
            <p className="mt-5 max-w-[36em] text-base leading-[1.8]">
              從 gogoro、Dyson、McLaren、太魯閣購物中心，到竹林山觀音寺、高雄捷運與苗栗警察分局。每一條都是我們為客戶印製、實際上線的伸縮帶。
            </p>
          </div>
          <a href="#contact" className={solidBtn}>
            印上您的品牌
          </a>
        </div>
        <div className="mt-16">
          <BeltWall label="世紘歷年承接的 61 款客製伸縮帶印刷圖樣，包含 gogoro、Nike、小米、Dyson、McLaren、Longchamp、竹林山觀音寺、高雄捷運等" />
        </div>
      </section>

      {/* 專利證書：國家分頁 */}
      <section id="patents" className={`${container} scroll-mt-24 pt-40`}>
        <h2 className={h2}>六國專利證書</h2>
        <p className="mt-4 text-base leading-[1.7]">產品設計在台灣、美國、日本、中國、德國與西班牙取得專利。</p>
        <PatentTabs items={patents} />
      </section>

      {/* 檢驗報告：點擊放大 */}
      <section id="reports" className={`${container} scroll-mt-24 pt-40 pb-40`}>
        <h2 className={h2}>第三方檢驗報告</h2>
        <p className="mt-4 text-base leading-[1.7]">耐久度、耐腐蝕與有害物質，皆送公正第三方實驗室檢驗。點擊圖片可放大檢視。</p>
        <div className="mt-12">
          <CertificateGallery items={reports} cols={5} />
        </div>
        {/* TÜV REACH 報告：橫式多頁合併圖，獨立一列 */}
        <div className="mx-auto mt-5 max-w-4xl">
          <CertificateGallery items={[reach]} cols={1} />
        </div>
      </section>
    </PageShell>
  );
}
