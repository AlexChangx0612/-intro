// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 404 處理
import { notFound } from "next/navigation";
// 匯入麵包屑
import Breadcrumbs from "../../../components/Breadcrumbs";
// 匯入結構化資料元件
import JsonLd from "../../../components/JsonLd";
// 匯入內頁外框
import PageShell from "../../../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../../../components/SectionTitle";
// 匯入分類頁文字內容（適用場所）
import { categoryContent } from "../../../lib/category-content";
// 匯入產品資料
import { getProduct, products } from "../../../lib/product-details";
// 匯入分類資料
import { getCategory } from "../../../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, company, ORG_ID, pageMetadata } from "../../../lib/site";
// 匯入共用樣式
import { bodyText, cardTitle, container, outlineBtn, pageTop, section } from "../../../lib/ui";

// 只產生已登錄的產品頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有已登錄的產品頁
export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
}

// 每個產品頁各自的標題、描述、canonical 與分享圖
export async function generateMetadata({ params }: PageProps<"/products/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.model} ${product.name}｜世紘興業`,
    description: product.description,
    path: `/products/${category}/${slug}`,
    image: product.images[0],
  });
}

// 單一產品頁
export default async function ProductPage({ params }: PageProps<"/products/[category]/[slug]">) {
  const { category, slug } = await params;
  const product = getProduct(category, slug);
  const cat = getCategory(category);
  if (!product || !cat) notFound();

  // 網址
  const catPath = `/products/${cat.slug}`;
  const path = `${catPath}/${product.slug}`;
  // 適用場所：沿用分類頁內容
  const places = categoryContent[cat.slug]?.places ?? [];
  // 同分類的其他已登錄產品
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug);

  return (
    <PageShell>
      {/* 結構化資料：產品（沒有價格、評價、庫存資料，因此不輸出 offers 與 rating） */}
      <JsonLd
        data={{
          "@type": "Product",
          name: `${product.model} ${product.name}`,
          model: product.model,
          description: product.description,
          image: product.images.map(absoluteUrl),
          url: absoluteUrl(path),
          category: cat.name,
          brand: { "@type": "Brand", name: company.shortName },
          manufacturer: { "@id": ORG_ID },
          additionalProperty: product.specs
            .filter((s) => s.label !== "型號")
            .map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
        }}
      />

      {/* 產品主資訊：手機上下排列，電腦左圖右文 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs
            items={[
              { name: "首頁", path: "/" },
              { name: "產品系列", path: "/products" },
              { name: cat.name, path: catPath },
              { name: product.model, path },
            ]}
          />
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            {/* 產品照：正方形圓角白底 */}
            <div className="grid gap-4">
              {product.images.map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[22px]">
                  <Image
                    src={src}
                    alt={`世紘 ${product.model} ${product.name}${i > 0 ? ` 圖 ${i + 1}` : ""}`}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* 產品文字 */}
            <div>
              <SectionTitle as="h1" align="left" eyebrow={product.model} title={product.name} />
              <p className="mt-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{product.description}</p>

              {/* 規格表 */}
              <h2 className={`${cardTitle} mt-12`}>產品規格</h2>
              <dl className="mt-4 border-t border-line">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex gap-6 border-b border-line py-3.5 text-sm">
                    <dt className="w-24 shrink-0 text-muted">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-6 text-muted">尺寸、重量與其他規格，請洽世紘專員確認。</p>

              {/* 產品特色 */}
              {product.features && (
                <>
                  <h2 className={`${cardTitle} mt-12`}>產品特色</h2>
                  <ul className="mt-4 space-y-3">
                    {product.features.map((f) => (
                      <li key={f} className={`${bodyText} flex gap-3`}>
                        <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* 詢價 */}
              <div className="mt-12 flex flex-wrap gap-4">
                <a href="#contact" className={outlineBtn}>
                  詢價與免費規劃
                </a>
                <Link href={catPath} className="inline-flex min-h-11 items-center px-2 text-sm tracking-[0.12em] transition hover:text-brand-deep">
                  查看全部{cat.name} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 適用場所 */}
      {places.length > 0 && (
        <section className={section}>
          <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
            <SectionTitle align="left" eyebrow="APPLICATIONS" title="適用場所" />
            <ol className="border-t border-line">
              {places.map((p, i) => (
                <li key={p} className="flex items-baseline gap-6 border-b border-line py-4">
                  <span className="w-6 text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base tracking-[0.06em]">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 相關產品 */}
      {related.length > 0 && (
        <section className={section}>
          <div className={container}>
            <SectionTitle eyebrow="RELATED" title="相關產品" />
            <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`${catPath}/${p.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
                      <Image
                        src={p.images[0]}
                        alt={`世紘 ${p.model} ${p.name}`}
                        fill
                        sizes="(min-width: 1024px) 330px, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="mt-3 block text-sm tracking-[0.08em] transition group-hover:text-brand-deep">{p.model}</span>
                    <span className="block text-xs leading-6 text-muted">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageShell>
  );
}
