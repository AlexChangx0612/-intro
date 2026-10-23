// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入產品系列方塊
import CollectionGrid from "../components/CollectionGrid";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入企業理念卡片格
import ValuesGrid, { type Value } from "../components/ValuesGrid";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, company, ORG_ID, organizationJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, pageTop, section } from "../lib/ui";

// 頁面描述
const description =
  "世紘興業有限公司成立於2015年，專注公共與商業空間周邊設備的研製與供應，產品涵蓋紅龍柱、伸縮帶欄柱、告示牌、展示設備、垃圾桶、清潔設備、推車與鑰匙箱，以「創新、品質、誠信」服務企業、政府機關、學校與各類公共空間。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "關於世紘｜公共與商業空間設備專業供應商｜世紘興業",
  description,
  path: "/about",
});

// 企業理念
const values: Value[] = [
  { title: "創新", desc: "持續開發與整合新產品，回應公共空間不斷改變的動線、展示與管理需求。", icon: "idea" },
  { title: "品質", desc: "所有欄柱與設備皆於台灣在地生產，品質穩定，溝通即時。", icon: "quality" },
  { title: "誠信", desc: "依場地與需求提供規劃與報價建議，說明清楚、承諾實在。", icon: "trust" },
];

// 三大產品領域：13 個產品系列依用途分成三組（ids 為產品分類 id）
// glow 為卡片背景的柔焦色塊（品牌紅、暖橘、淡藍），位置各不相同
const areas = [
  {
    title: "排隊動線",
    badge: "QUEUE",
    places: "銀行・醫院・機場",
    detail: "櫃台排隊、入場管制與 VIP 區隔",
    cutout: "/cutouts/retractable-belt-stanchions.png",
    ids: ["retractable", "rope", "outdoor", "plastic", "barrier"],
    glow: "radial-gradient(38% 26% at 34% 66%, rgba(255,55,64,.75), transparent 70%), radial-gradient(34% 22% at 66% 72%, rgba(255,168,64,.7), transparent 70%), radial-gradient(42% 30% at 50% 32%, rgba(126,178,236,.45), transparent 70%)",
  },
  {
    title: "告示展示",
    badge: "DISPLAY",
    places: "百貨・飯店・展覽",
    detail: "活動宣傳、樓層指示與品牌視覺",
    cutout: "/cutouts/poster-sign-stands.png",
    ids: ["sign", "board", "display"],
    glow: "radial-gradient(40% 26% at 62% 58%, rgba(255,55,64,.7), transparent 70%), radial-gradient(30% 24% at 30% 74%, rgba(255,186,72,.75), transparent 70%), radial-gradient(44% 30% at 40% 30%, rgba(140,190,240,.5), transparent 70%)",
  },
  {
    title: "環境與物業",
    badge: "FACILITY",
    places: "學校・車站・大樓",
    detail: "清潔回收、雨天入口與後場管理",
    cutout: "/cutouts/waste-recycling.png",
    ids: ["trash", "hygiene", "umbrella", "cart", "key"],
    glow: "radial-gradient(36% 26% at 44% 70%, rgba(255,150,56,.75), transparent 70%), radial-gradient(34% 24% at 70% 52%, rgba(255,55,64,.65), transparent 70%), radial-gradient(40% 30% at 30% 34%, rgba(126,178,236,.45), transparent 70%)",
  },
];

// 關於世紘頁
export default function AboutPage() {
  // 產品分類
  const { categories } = getCatalog();
  return (
    <PageShell>
      {/* 結構化資料：組織＋關於頁 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "AboutPage", name: "關於世紘", description, url: absoluteUrl("/about"), about: { "@id": ORG_ID } },
        ]}
      />

      {/* 頁首：小標籤＋細線、左大標右簡介、三大領域卡片（滑鼠移上由下方滑出詳細資訊） */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "關於世紘", path: "/about" }]} />

          {/* 小標籤（白色膠囊）＋下方細分隔線 */}
          <div className="mt-8 border-b border-line pb-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs tracking-[0.2em] text-brand-deep shadow-[0_0_0_1px_rgba(15,15,14,.06)]">
              <span aria-hidden="true">→</span>
              ABOUT SHIHHUNG
            </p>
          </div>

          {/* 左大標、右簡介（電腦並排） */}
          <div className="mt-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:gap-20">
            <h1 className="text-[30px] leading-[1.3] tracking-[0.06em] text-ink sm:text-[40px] lg:text-[44px]">
              三大產品領域，
              <br />
              <span className="text-brand">同一份台灣製造的標準。</span>
            </h1>
            <p className="max-w-xl text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8 lg:pt-2">
              世紘興業成立於 {company.foundingYear} 年，專注公共與商業空間周邊設備的研製與供應，{categories.length}{" "}
              個產品系列全部在台灣生產，並提供企業禮贈品服務。服務企業、政府機關、學校、醫院、商場與交通場站——將滑鼠移到領域上查看細節。
            </p>
          </div>

          {/* 三張直式卡片：手機 1 欄、平板以上 3 欄 */}
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {areas.map((a) => {
              // 這個領域包含的產品系列
              const cats = a.ids.map((id) => categories.find((c) => c.id === id)).filter((c) => c !== undefined);
              return (
                <li key={a.title}>
                  {/* 卡片：細框圓角；tabIndex 讓鍵盤也能展開詳細資訊 */}
                  <div
                    tabIndex={0}
                    className="group relative flex h-[440px] flex-col overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#fdfcfa,#f1eee9)] shadow-[0_0_0_1px_rgba(15,15,14,.07)] outline-none focus-visible:shadow-[0_0_0_2px_var(--color-brand-deep)] lg:h-[480px]"
                  >
                    {/* 柔焦色塊：品牌紅、暖橘、淡藍，模糊成光暈 */}
                    <div aria-hidden="true" className="absolute inset-0 blur-2xl transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: a.glow }} />
                    {/* 去背產品圖（手機、平板在上半部，避開固定顯示的詳細資訊）：微微柔焦、與光暈相乘；滑鼠移上變清楚並微微放大 */}
                    <div className="absolute inset-x-8 top-[16%] bottom-[40%] lg:top-[18%] lg:bottom-[22%] transition duration-700 [filter:blur(1.5px)_saturate(1.1)] group-hover:scale-[1.04] group-hover:[filter:blur(0)_saturate(1.1)]">
                      <Image src={a.cutout} alt={`${a.title}代表產品`} fill sizes="(min-width: 768px) 30vw, 80vw" className="object-contain mix-blend-multiply" />
                    </div>
                    {/* 上方淡白霧面，讓標題清楚 */}
                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/80 to-white/0" />

                    {/* 頂列：領域名稱＋英文膠囊 */}
                    <div className="relative flex items-center justify-between px-5 pt-5">
                      <h2 className="text-lg tracking-[0.1em] text-ink">{a.title}</h2>
                      <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] tracking-[0.15em] text-muted shadow-[0_0_0_1px_rgba(15,15,14,.08)]">{a.badge}</span>
                    </div>

                    {/* 底列：適用場所＋箭頭；詳細資訊滑出時淡出（電腦版） */}
                    <div className="relative mt-auto flex items-end justify-between px-5 pb-5 transition-opacity duration-300 lg:group-hover:opacity-0 lg:group-focus-within:opacity-0 max-lg:hidden">
                      <span className="text-xs tracking-[0.25em] text-muted">{a.places}</span>
                      <span aria-hidden="true" className="text-lg text-brand">↗</span>
                    </div>

                    {/* 詳細資訊：手機、平板固定顯示在底部；電腦版滑鼠移上或聚焦時由下方滑出 */}
                    <div className="absolute inset-x-0 bottom-0 bg-white/75 px-5 pt-4 pb-5 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:translate-y-full lg:group-hover:translate-y-0 lg:group-focus-within:translate-y-0">
                      <p className="text-xs tracking-[0.25em] text-brand-deep">
                        <span aria-hidden="true">→ </span>
                        {a.detail}
                      </p>
                      {/* 產品系列連結 */}
                      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-ink/10 pt-3">
                        {cats.map((c) => (
                          <li key={c.id}>
                            <Link href={`/products/${c.slug}`} className="text-sm tracking-[0.06em] text-ink transition hover:text-brand-deep">
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {/* 頁尾：系列數＋適用場所 */}
                      <p className="mt-3 border-t border-ink/10 pt-3 text-[11px] tracking-[0.25em] text-muted">
                        {cats.length} 大系列・{a.places}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 企業理念：三張圖示卡片，進入畫面時依序淡入 */}
      <section className={section}>
        <div className={container}>
          <SectionTitle eyebrow="OUR VALUES" title="創新、品質、誠信" desc="世紘以「創新、品質、誠信」為核心理念，經營每一項產品與服務。" />
          <ValuesGrid values={values} />
        </div>
      </section>

      {/* 產品系列 */}
      <section className={section}>
        <div className={container}>
          <SectionTitle eyebrow="COLLECTIONS" title="產品系列" />
          <CollectionGrid categories={categories} />
        </div>
      </section>
    </PageShell>
  );
}
