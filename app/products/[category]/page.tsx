// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 404 處理
import { notFound } from "next/navigation";
// 匯入麵包屑
import Breadcrumbs from "../../components/Breadcrumbs";
// 匯入常見問題清單
import FaqList from "../../components/FaqList";
// 匯入結構化資料元件
import JsonLd from "../../components/JsonLd";
// 匯入內頁外框
import PageShell from "../../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../../components/SectionTitle";
// 匯入分類頁文字內容
import { categoryContent } from "../../lib/category-content";
// 匯入產品目錄
import { getCatalog, getCategory, type CatalogItem } from "../../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, ORG_ID, pageMetadata } from "../../lib/site";
// 匯入適用場域資料
import { getSolution } from "../../lib/solutions";
// 匯入共用樣式
import { bodyText, card, cardHover, cardTitle, container, outlineBtn, pageTop, section } from "../../lib/ui";

// 只產生已知的分類頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有分類頁
export function generateStaticParams() {
  return getCatalog().categories.map((c) => ({ category: c.slug }));
}

// 每個分類頁各自的標題、描述與 canonical
export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  const content = categoryContent[category];
  if (!cat || !content) return {};
  return pageMetadata({ title: content.title, description: content.description, path: `/products/${cat.slug}`, image: cat.images[0] });
}

// 三欄說明的單一欄：小標題＋編號清單
function InfoColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className={cardTitle}>{title}</h2>
      <ol className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-4">
            <span className={bodyText}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// 商品卡片格：手機一排 2 張、平板 3 張、電腦 4 張；每張連到該品項的介紹頁
function ProductGrid({ items, categoryName }: { items: CatalogItem[]; categoryName: string }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.slug}>
          <Link href={item.href} className="group block">
            {/* 正方形圓角圖片框（與首頁商品目錄相同） */}
            <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
              <Image
                src={item.image}
                alt={`世紘${categoryName} ${item.model} ${item.spec ?? ""}`}
                fill
                sizes="(min-width: 1024px) 330px, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            {/* 型號（產品照右下角黃色字）與規格 */}
            <span className="mt-3 block text-sm tracking-[0.08em] transition group-hover:text-brand-deep">{item.model}</span>
            {item.spec && <span className="block text-xs leading-6 text-muted">{item.spec}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 產品分類頁
export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  const content = categoryContent[category];
  if (!cat || !content) notFound();

  // 網址
  const path = `/products/${cat.slug}`;
  // 相關場域
  const related = content.solutions.map(getSolution).filter((s) => s !== undefined);

  return (
    <PageShell>
      {/* 結構化資料：分類頁＋常見問題 */}
      <JsonLd
        data={[
          {
            "@type": "CollectionPage",
            name: content.h1,
            description: content.description,
            url: absoluteUrl(path),
            publisher: { "@id": ORG_ID },
            image: cat.images.slice(0, 4).map(absoluteUrl),
          },
          faqJsonLd(content.faqs),
        ]}
      />

      {/* 頁首：麵包屑、標題與介紹 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs
            items={[
              { name: "首頁", path: "/" },
              { name: "產品系列", path: "/products" },
              { name: cat.name, path },
            ]}
          />
          {/* 左：標題與介紹；右：該系列代表產品去背圖（平板以上才顯示） */}
          <div className="mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
            <div className="max-w-3xl">
              <SectionTitle as="h1" align="left" eyebrow={cat.en} title={content.h1} />
              <p className="mt-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{content.intro}</p>
              <a href="#contact" className={`${outlineBtn} mt-10`}>
                免費規劃與報價
              </a>
            </div>
            <div className="relative hidden h-80 md:block lg:h-[420px]">
              <Image
                src={`/cutouts/${cat.slug}.png`}
                alt={`世紘${cat.name}`}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1440px) 520px, 36vw"
                quality={90}
                className="object-contain drop-shadow-[0_24px_28px_rgba(15,15,14,.18)]"
              />
            </div>
          </div>
        </div>
      </section>

      {cat.groups ? (
        <>
          {/* 有小系列：先列小系列導覽卡片，再依小系列分區顯示產品 */}
          <section id="products" className={section}>
            <div className={container}>
              <SectionTitle eyebrow="PRODUCTS" title={`${cat.groups.length} 大系列，${cat.items.length} 款產品`} desc={`${cat.desc}選擇系列快速查看。`} />
              {/* 小系列導覽卡片：手機與平板為可橫向滑動的一排，電腦 5 欄一排；點擊跳到該系列 */}
              <ul className="-mx-5 mt-14 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pt-1 pb-3 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:gap-5 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden">
                {cat.groups.map((g) => (
                  <li key={g.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto">
                    <a href={`#${g.id}`} className={`group flex h-full flex-col p-1.5 sm:p-2 ${card} ${cardHover}`}>
                      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-paper lg:rounded-[12px]">
                        <Image src={g.cover} alt={`世紘${g.name}`} fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 30vw, 44vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
                      </div>
                      <div className="flex flex-1 items-end gap-3 px-2 pt-3 pb-1.5 sm:px-3 sm:pt-4 sm:pb-2">
                        <div className="min-w-0 flex-1">
                          {/* 英文小標 */}
                          <p className="text-[11px] tracking-[0.2em] whitespace-nowrap text-brand-deep sm:text-xs lg:tracking-[0.12em] xl:tracking-[0.2em]">{g.en}</p>
                          <p className="mt-1 text-sm tracking-[0.06em] whitespace-nowrap text-ink sm:text-lg lg:text-base xl:text-lg">{g.name}</p>
                          <p className="mt-0.5 text-xs text-muted sm:text-sm">{g.items.length} 款</p>
                        </div>
                        {/* 向下箭頭：滑鼠移上往下移（1024～1279px 卡片較窄，隱藏以免擠到英文小標） */}
                        <span aria-hidden="true" className="hidden pb-0.5 text-lg text-brand-deep transition group-hover:translate-y-0.5 sm:inline lg:hidden xl:inline">
                          ↓
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 小系列快速切換列：捲動時固定在 header 下方，可橫向滑動 */}
          <nav aria-label={`${cat.name}系列`} className="sticky top-20 z-20 border-y border-line bg-paper/90 backdrop-blur-md sm:top-22">
            <ul className={`${container} flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
              {cat.groups.map((g) => (
                <li key={g.id} className="shrink-0">
                  <a href={`#${g.id}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm tracking-[0.08em] text-ink shadow-[0_0_0_1px_rgba(15,15,14,.08)] transition hover:text-brand-deep hover:shadow-[0_0_0_1px_rgba(214,31,42,.4)]">
                    {g.name}
                    <span className="text-xs text-muted">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 各小系列：左側標題與說明（電腦版捲動時固定），右側產品格 */}
          {cat.groups.map((g, i) => (
            <section key={g.id} id={g.id} className={`scroll-mt-40 py-16 sm:scroll-mt-44 sm:py-20 ${i > 0 ? "border-t border-line" : ""}`}>
              <div className={`${container} grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 2xl:grid-cols-[300px_minmax(0,1fr)]`}>
                <div className="lg:sticky lg:top-48 lg:self-start">
                  <p className="text-xs tracking-[0.35em] text-brand-deep">{g.en}</p>
                  <h2 className="mt-4 text-2xl tracking-[0.12em] text-brand sm:text-3xl">{g.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-pretty text-muted">{g.desc}</p>
                  <p className="mt-6 border-t border-line pt-4 text-xs tracking-[0.25em] text-muted">共 {g.items.length} 款</p>
                </div>
                <ProductGrid items={g.items} categoryName={cat.name} />
              </div>
            </section>
          ))}
        </>
      ) : (
        // 沒有小系列：直接列出全部產品
        <section id="products" className={section}>
          <div className={container}>
            <SectionTitle eyebrow="PRODUCTS" title={cat.name} desc={`${cat.desc}點擊圖片查看產品介紹。`} />
            <div className="mt-14">
              <ProductGrid items={cat.items} categoryName={cat.name} />
            </div>
          </div>
        </section>
      )}

      {/* 適合場所、規格選擇、如何選擇：手機上下排列，電腦三欄 */}
      <section className={section}>
        <div className={`${container} grid gap-14 md:grid-cols-3 md:gap-10`}>
          <InfoColumn title="這類產品適合哪些場所？" items={content.places} />
          <InfoColumn title="這類產品有哪些規格或選擇？" items={content.options} />
          <InfoColumn title="如何選擇適合的產品？" items={content.choose} />
        </div>
      </section>

      {/* 適用場域：連到場域頁 */}
      {related.length > 0 && (
        <section className={section}>
          <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
            <SectionTitle align="left" eyebrow="APPLICATIONS" title="常見的應用場域" desc="依場域查看動線規劃重點與建議設備配置。" />
            <ol className="border-t border-line">
              {related.map((s) => (
                <li key={s.slug} className="border-b border-line">
                  <Link href={`/solutions/${s.slug}`} className="flex items-baseline gap-6 py-4 transition hover:text-brand-deep">
                    <span className="text-lg tracking-[0.1em]">{s.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 常見問題 */}
      <section id="faq" className={section}>
        <div className={`${container} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
          <SectionTitle align="left" eyebrow="FAQ" title="常見問題" />
          <FaqList faqs={content.faqs} />
        </div>
      </section>
    </PageShell>
  );
}
