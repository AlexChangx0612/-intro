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
// 匯入已登錄的產品資料
import { productByImage } from "../../lib/product-details";
// 匯入產品目錄
import { getCatalog, getCategory } from "../../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, ORG_ID, pageMetadata } from "../../lib/site";
// 匯入適用場域資料
import { getSolution } from "../../lib/solutions";
// 匯入共用樣式
import { bodyText, cardTitle, container, outlineBtn, pageTop, section } from "../../lib/ui";

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
        {items.map((item, i) => (
          <li key={item} className="flex gap-4">
            {/* 編號：品牌紅 */}
            <span className="w-6 shrink-0 pt-1 text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
            <span className={bodyText}>{item}</span>
          </li>
        ))}
      </ol>
    </div>
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
          <div className="mt-10 max-w-3xl">
            <SectionTitle as="h1" align="left" eyebrow={cat.en} title={content.h1} />
            <p className="mt-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{content.intro}</p>
            <a href="#contact" className={`${outlineBtn} mt-10`}>
              免費規劃與報價
            </a>
          </div>
        </div>
      </section>

      {/* 適合場所、規格選擇、如何選擇：手機上下排列，電腦三欄 */}
      <section className={section}>
        <div className={`${container} grid gap-14 md:grid-cols-3 md:gap-10`}>
          <InfoColumn title="這類產品適合哪些場所？" items={content.places} />
          <InfoColumn title="這類產品有哪些規格或選擇？" items={content.options} />
          <InfoColumn title="如何選擇適合的產品？" items={content.choose} />
        </div>
      </section>

      {/* 產品照 */}
      <section id="products" className={section}>
        <div className={container}>
          <SectionTitle eyebrow="PRODUCTS" title="世紘相關產品" desc={`${cat.desc}點擊圖片可檢視大圖或產品介紹。`} />
          {/* 商品圖片格：手機一排 2 張、平板 3 張、電腦 4 張 */}
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {cat.images.map((src, i) => {
              // 有產品頁的照片連到產品頁，其餘在新分頁開啟大圖
              const product = productByImage(src);
              // 正方形圓角圖片框（與首頁商品目錄相同）
              const img = (
                <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
                  <Image
                    src={src}
                    alt={product ? `世紘 ${product.model} ${product.name}` : `世紘${cat.name}產品照 ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 330px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              );
              return (
                <li key={src}>
                  {product ? (
                    <Link href={`${path}/${product.slug}`} className="group block">
                      {img}
                      {/* 型號與名稱 */}
                      <span className="mt-3 block text-sm tracking-[0.08em] transition group-hover:text-brand-deep">{product.model}</span>
                      <span className="block text-xs leading-6 text-muted">{product.name}</span>
                    </Link>
                  ) : (
                    <a href={src} target="_blank" rel="noreferrer" className="group block">
                      {img}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 適用場域：連到場域頁 */}
      {related.length > 0 && (
        <section className={section}>
          <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
            <SectionTitle align="left" eyebrow="APPLICATIONS" title="常見的應用場域" desc="依場域查看動線規劃重點與建議設備配置。" />
            <ol className="border-t border-line">
              {related.map((s, i) => (
                <li key={s.slug} className="border-b border-line">
                  <Link href={`/solutions/${s.slug}`} className="flex items-baseline gap-6 py-4 transition hover:text-brand-deep">
                    <span className="w-6 text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
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
