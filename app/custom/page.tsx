// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入常見問題清單
import FaqList, { type Faq } from "../components/FaqList";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框（底部已有紅色聯絡區塊：電話、E-MAIL、LINE）
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { bodyText, card, cardHover, cardTitle, container, pageTop, section } from "../lib/ui";

// 頁面描述
const description =
  "世紘興業客製化服務：伸縮帶欄柱柱頭告示框、拒馬看板、告示牌與海報架皆可置入企業識別，並提供企業禮贈品，專員為您提供規劃。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "客製化服務｜欄柱・拒馬・告示牌置入企業識別｜世紘興業",
  description,
  path: "/custom",
});

// 可客製的項目；category 為產品分類 id（用該分類第一張照片並連到分類頁），沒有則顯示品牌紅底
const items: { title: string; en: string; desc: string; category?: string }[] = [
  {
    title: "伸縮帶欄柱",
    en: "Belt stanchions",
    desc: "可搭配柱頭告示框，放入企業標誌或指示內容。織帶印製 Logo 的可行性、數量與交期，請洽專員確認。",
    category: "retractable",
  },
  {
    title: "拒馬看板",
    en: "Barriers",
    desc: "烤漆與不鏽鋼拒馬可放置廣告看板，看板可置入企業識別，適用大樓入口、停車場與活動場地。",
    category: "barrier",
  },
  {
    title: "海報架・告示牌",
    en: "Signs & posters",
    desc: "壁掛海報框、立式告示牌與警示立牌，皆可置入貴公司的品牌視覺，統一空間形象。",
    category: "sign",
  },
  {
    title: "企業禮贈品",
    en: "Corporate gifts",
    desc: "世紘亦提供企業禮贈品相關服務，品項、數量與客製方式，歡迎與專員洽詢。",
  },
];

// 洽詢流程
const steps = [
  { title: "提供需求", desc: "告訴我們場地、用途、數量，以及要置入的企業識別或內容。" },
  { title: "專人規劃", desc: "專員依場地與需求規劃動線與客製內容，並確認可行性與交期。" },
  { title: "專員服務", desc: "確認內容後，由專員為您提供後續服務。" },
];

// 客製化常見問題
const faqs: Faq[] = [
  {
    q: "伸縮帶欄柱可以客製企業 Logo 嗎？",
    a: "伸縮帶欄柱可搭配柱頭告示框，放入企業標誌或指示內容；織帶印製 Logo 的可行性、數量與交期，請洽專員確認。",
    link: { href: "/products/retractable-belt-stanchions", label: "了解伸縮帶欄柱" },
  },
  {
    q: "告示牌可以客製企業識別嗎？",
    a: "可以。告示牌與海報架皆可置入貴公司的品牌視覺，請提供內容、尺寸與數量洽詢。",
    link: { href: "/products/poster-sign-stands", label: "了解海報架・告示牌" },
  },
  {
    q: "詢問客製化需要準備什麼？",
    a: "請提供場地與用途、需要的品項與數量，以及要置入的標誌或文字內容。詢問特定產品時，提供產品頁或電子目錄上的型號，專員可更快為您提供服務。",
    link: { href: "/catalog", label: "查看產品電子目錄" },
  },
];

// 客製化服務頁
export default function CustomPage() {
  // 產品分類（取照片與網址代號）
  const { categories } = getCatalog();

  return (
    <PageShell>
      {/* 結構化資料：服務頁＋常見問題 */}
      <JsonLd data={[{ "@type": "WebPage", name: "客製化服務", description, url: absoluteUrl("/custom") }, faqJsonLd(faqs)]} />

      {/* 頁首：標題與說明；手機上下排列，電腦左標題右文字 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "客製化服務", path: "/custom" }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
            <SectionTitle as="h1" align="left" eyebrow="CUSTOM SERVICE" title="客製化服務，讓設備帶著您的品牌" />
            <p className="text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">
              欄柱、拒馬、告示牌與海報架，都可以置入貴公司的企業識別。從動線規劃到客製內容，專員一對一協助。
            </p>
          </div>

          {/* 可客製項目：手機 1 欄、平板 2 欄、電腦 4 欄 */}
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {items.map((it) => {
              // 對應的產品分類（禮贈品沒有）
              const cat = categories.find((c) => c.id === it.category);
              // 卡片內容
              const body = (
                <>
                  {/* 正方形圖片框：有分類照片就顯示，否則品牌紅底＋英文字 */}
                  <div className="relative aspect-square bg-white">
                    {cat?.images[0] ? (
                      // 第一屏就看得到，立即載入
                      <Image src={cat.images[0]} alt={`世紘${it.title}產品照`} fill loading="eager" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-end bg-brand-deep p-6 text-white">
                        <span className="font-display text-2xl tracking-[0.08em] uppercase">{it.en}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 lg:p-7">
                    <h2 className={cardTitle}>{it.title}</h2>
                    <p className={`${bodyText} mt-3`}>{it.desc}</p>
                    {/* 有分類頁時顯示「查看產品」 */}
                    {cat && <p className="mt-5 text-xs tracking-[0.2em] text-brand-deep">查看產品 →</p>}
                  </div>
                </>
              );
              return (
                <li key={it.title} className={`overflow-hidden ${card} ${cat ? cardHover : ""}`}>
                  {cat ? (
                    <Link href={`/products/${cat.slug}`} className="block h-full">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 洽詢流程：三步驟（與首頁「世紘優勢」相同樣式） */}
      <section className={section}>
        <div className={container}>
          <SectionTitle eyebrow="PROCESS" title="客製流程" desc="三個步驟，從需求到專員服務。" />
          <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((s) => (
              <li key={s.title} className="border-t border-line pt-8 text-center md:text-left">
                <h3 className="text-xl tracking-[0.1em] text-brand-deep">{s.title}</h3>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pretty text-muted md:mx-0">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 常見問題：手機上下排列，電腦左標題右問答 */}
      <section className={section}>
        <div className={`${container} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
          <SectionTitle align="left" eyebrow="FAQ" title="客製化常見問題" />
          <FaqList faqs={faqs} />
        </div>
      </section>
    </PageShell>
  );
}
