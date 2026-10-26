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
// 匯入數字滾動
import CountUp from "../components/CountUp";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, company, ORG_ID, organizationJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, textLink } from "../lib/ui";

// 頁面描述
const description =
  "世紘興業有限公司成立於2015年，專注公共與商業空間周邊設備的研製與供應，全系列台灣精密製造、嚴謹品質管理，產品取得多國專利並通過第三方檢驗，以「創新、品質、誠信」服務企業、政府機關、學校與各類公共空間。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "關於世紘｜公共與商業空間設備專業供應商｜世紘興業",
  description,
  path: "/about",
});

// 客戶案例圖：第一張放大（佔 2×2 格）
const cases = [
  { href: "/cases/xiaomi-store", image: "/cases/xiaomi-store/02.jpg", alt: "小米門市入口的黑色伸縮帶欄柱與印有品牌標誌的紅色織帶", label: "小米門市・品牌印字織帶" },
  { href: "/cases/chihai-cultural-park", image: "/cases/chihai-cultural-park/01-sign.jpg", alt: "經國七海文化園區入口石碑", label: "經國七海文化園區" },
  { href: "/cases/barrier-printing-portfolio", image: "/cases/barrier-printing-portfolio/01.jpg", alt: "新光華山金融中心人行道上的黑色客製印刷拒馬", label: "新光華山金融中心・客製拒馬" },
  { href: "/cases/kham-art-ntsec", image: "/cases/kham-art-ntsec/04.jpg", alt: "士林科教館樂高特展展台旁的黑色欄柱", label: "寬宏藝術・士林科教館佈展" },
  { href: "/cases/tsg-hawks", image: "/cases/tsg-hawks/01.jpg", alt: "印有 TSG HAWKS 字樣的綠色織帶", label: "台鋼雄鷹・球隊印字織帶" },
];

// 做事的三個原則
const values = [
  { title: "創新", body: "公共空間的動線、展示與管理需求不斷改變。我們持續開發新產品，從結構設計到使用細節反覆改良，讓設備更好用、更耐用。", href: "/custom", cta: "了解客製服務" },
  { title: "品質", body: "從選材、加工到表面處理，每個環節都以長期使用為標準。織帶拉伸一萬次無損壞，鋁材鹽霧 24 小時無腐蝕，都有報告。", href: "/advantages#reports", cta: "看專利與檢驗" },
  { title: "誠信", body: "依場地與需求給規劃建議，說明清楚、承諾實在。不誇大、不隱藏，做得到的才答應，答應的就做到。", href: "#contact", cta: "聯絡專員" },
];

// 關於世紘頁
export default function AboutPage() {
  // 產品分類（系列數）與品項數（型號數）
  const { categories } = getCatalog();
  const models = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <PageShell>
      {/* 結構化資料：組織＋關於頁 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "AboutPage", name: "關於世紘", description, url: absoluteUrl("/about"), about: { "@id": ORG_ID } },
        ]}
      />

      {/* 頁首：左文右圖 */}
      <SplitHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "關於世紘", path: "/about" }]}
        title="關於世紘"
        subtitle={`世紘興業 ${company.foundingYear} 年在新北林口成立，設計與製造伸縮帶欄柱、紅龍柱、告示牌等公共空間設備，${categories.length} 個產品系列全部在台灣生產。`}
        link={{ href: "/products", label: "瀏覽產品系列" }}
      >
        <figure>
          <div className="relative aspect-[16/10]">
            <Image src="/cases/zhulinshan-guanyin-temple/01.jpg" alt="竹林山觀音寺殿前以金色伸縮帶欄柱圍出參拜動線" fill preload sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-[15px] text-muted">新北林口 竹林山觀音寺：殿前的金色伸縮帶欄柱</figcaption>
        </figure>
      </SplitHero>

      {/* 紅底數字帶 */}
      <StatBand
        stats={[
          { value: company.foundingYear, label: "在新北林口成立" },
          { value: String(categories.length), label: "個產品系列" },
          { value: String(models), label: "項產品型號" },
          { value: "台灣", label: "全系列在地製造" },
        ]}
      />

      {/* 理念：左文右圖（產品去背圖） */}
      <section className={`${container} flex flex-wrap items-center gap-16 pt-40`}>
        <div className="min-w-0 flex-[1_1_420px]">
          <h2 className="text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
            不只是一根欄柱，
            <br />
            而是一個空間的秩序。
          </h2>
          <p className="mt-8 max-w-[34em] text-base leading-[1.8]">
            從銀行櫃台、醫院掛號到機場報到大廳，從百貨展示到學校與車站——好的設備不搶眼，它只是讓人流順暢、讓空間有序、讓使用的人安心。
          </p>
          <p className="mt-5 max-w-[34em] text-base leading-[1.8]">所以我們堅持在地製造、嚴格把關，產品取得多國專利並通過第三方檢驗，也為企業提供識別客製與禮贈品服務。</p>
        </div>
        <figure className="min-w-0 flex-[1_1_420px] bg-white p-10">
          <div className="relative aspect-[4/3]">
            <Image src="/cutouts/retractable-belt-stanchions.png" alt="世紘伸縮帶欄柱產品去背圖" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" />
          </div>
          <figcaption className="mt-4 text-[15px] text-muted">伸縮帶欄柱系列，台灣製造</figcaption>
        </figure>
      </section>

      {/* 客戶案例：第一張大圖，其餘四張小圖 */}
      <section className={`${container} pt-40`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">我們的設備，站在這些地方</h2>
            <p className="mt-4 text-base leading-[1.7]">寺廟、門市、文化園區、商辦與展覽，每一張都是客戶現場。</p>
          </div>
          <Link href="/cases" className={textLink}>
            看全部客戶案例 →
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c, i) => (
            <li key={c.href} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
              <Link href={c.href} className="group flex h-full flex-col">
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:min-h-[360px] lg:flex-1" : "aspect-[4/3]"}`}>
                  <Image src={c.image} alt={c.alt} fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"} className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <span className="mt-3 text-[15px] group-hover:text-brand-deep">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 客製織帶牆（兩列預告，完整的在世紘優勢頁） */}
      <section className="pt-24">
        <BeltWall rows={[0, 3]} label="世紘承接過的客製伸縮帶印刷圖樣" />
        <div className={`${container} flex flex-wrap items-center justify-between gap-4 pt-6`}>
          <h2 className="text-xl font-bold">
            還有 <CountUp value="61" /> 款客製織帶，從品牌門市到宮廟與學校
          </h2>
          <Link href="/advantages#belts" className={textLink}>
            看全部客製織帶 →
          </Link>
        </div>
      </section>

      {/* 做事的三個原則：白底 */}
      <section className="mt-40 bg-white">
        <div className={`${container} py-28`}>
          <h2 className="text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">我們做事的三個原則</h2>
          <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-14">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="text-[clamp(40px,4vw,56px)] leading-none font-bold">{v.title}</h3>
                <p className="mt-6 text-base leading-[1.8]">{v.body}</p>
                <Link href={v.href} className={`${textLink} mt-5`}>
                  {v.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
