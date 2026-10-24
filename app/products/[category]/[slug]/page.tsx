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
// 匯入分類頁文字內容（適用場所、規格選擇）
import { categoryContent } from "../../../lib/category-content";
// 匯入未登錄品項的產品頁資料產生器
import { autoInfo, type ItemInfo } from "../../../lib/product-auto";
// 匯入品項資料
import { allItemParams, getCategory, getItem, type CatalogItem } from "../../../lib/products";
// 匯入 SEO 工具與公司資料
import { absoluteUrl, company, ORG_ID, pageMetadata } from "../../../lib/site";
// 匯入共用樣式
import { bodyText, cardTitle, container, outlineBtn, pageTop, section } from "../../../lib/ui";

// 只產生已知的品項頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有品項頁（每張產品照一頁）
export function generateStaticParams() {
  return allItemParams();
}

// 品項標題：已登錄產品用「型號 名稱」，其餘用「型號 分類名稱（規格）」
function itemTitle(item: CatalogItem) {
  return item.detail ? `${item.detail.model} ${item.detail.name}` : `${item.model} ${item.name}${item.spec ? `（${item.spec}）` : ""}`;
}

// 產品頁顯示的名稱、說明、規格與特色：已登錄（product-details.ts）的用手寫資料，其餘依產品照標示自動產生
function itemInfo(item: CatalogItem, list: { slug: string; name: string; desc: string }): ItemInfo {
  if (item.detail) return { ...item.detail, features: item.detail.features ?? [] };
  // 伸縮帶欄柱另外找出所屬小系列
  const group = getCategory(list.slug)?.groups?.find((g) => g.items.some((i) => i.slug === item.slug));
  return autoInfo(item, list, group);
}

// 每個品項頁各自的標題、描述、canonical 與分享圖
export async function generateMetadata({ params }: PageProps<"/products/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const found = getItem(category, slug);
  if (!found) return {};
  const { item, list } = found;
  const info = itemInfo(item, list);
  const meta = pageMetadata({
    title: `${item.model} ${info.name}｜世紘興業`,
    description: info.description,
    path: item.href,
    image: item.image,
  });
  // 未登錄規格的品項內容較少，先不讓搜尋引擎收錄（補齊資料、登錄到 product-details.ts 後自動開放）
  return item.detail ? meta : { ...meta, robots: { index: false, follow: true } };
}

// 詢價按鈕樣式：細框圓角，滑鼠移上變紅框紅字
const inquiryBtn =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm tracking-[0.08em] transition hover:border-brand-deep hover:text-brand-deep";

// 單一品項頁
export default async function ProductPage({ params }: PageProps<"/products/[category]/[slug]">) {
  const { category, slug } = await params;
  const found = getItem(category, slug);
  if (!found) notFound();
  const { item, index, list } = found;
  const detail = item.detail;

  // 分類頁內容
  const content = categoryContent[list.slug];
  // 適用場所：沿用分類頁內容
  const places = content?.places ?? [];
  // 上一項／下一項（同一列表內）
  const prev = list.items[index - 1];
  const next = list.items[index + 1];
  // 同列表的其他品項：已登錄的優先，其次取前後相鄰的品項，最多 8 個
  const others = list.items.filter((i) => i.slug !== item.slug);
  const related = [
    ...others.filter((i) => i.detail),
    ...others.filter((i) => !i.detail).sort((a, b) => Math.abs(list.items.indexOf(a) - index) - Math.abs(list.items.indexOf(b) - index)),
  ].slice(0, 8);
  // 名稱、說明、規格與特色
  const info = itemInfo(item, list);
  // 標題與替代文字
  const title = `${item.model} ${info.name}`;
  const images = detail?.images ?? [item.image];
  // 詢價信件主旨：帶入型號或品項編號，方便專員辨識
  const mailSubject = encodeURIComponent(`產品詢價：${item.model}`);

  return (
    <PageShell>
      {/* 結構化資料：產品（只有已登錄型號與規格的產品才輸出；沒有價格、評價、庫存資料，因此不輸出 offers 與 rating） */}
      {detail && (
        <JsonLd
          data={{
            "@type": "Product",
            name: title,
            model: detail.model,
            description: detail.description,
            image: images.map(absoluteUrl),
            url: absoluteUrl(item.href),
            category: list.name,
            brand: { "@type": "Brand", name: company.shortName },
            manufacturer: { "@id": ORG_ID },
            additionalProperty: detail.specs
              .filter((s) => s.label !== "型號")
              .map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
          }}
        />
      )}

      {/* 產品主資訊：手機上下排列，電腦左圖右文 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs
            items={[
              { name: "首頁", path: "/" },
              { name: "產品系列", path: "/products" },
              { name: list.name, path: list.listHref },
              { name: item.model, path: item.href },
            ]}
          />
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            {/* 產品照：正方形圓角白底；第一張為主圖，其餘為細節圖 */}
            <div className="grid gap-4">
              {images.map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[22px]">
                  <Image
                    src={src}
                    alt={`世紘 ${title}${i > 0 ? ` 細節圖 ${i}` : ""}`}
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
              {/* 型號（小標）＋產品名稱 */}
              <SectionTitle as="h1" align="left" eyebrow={item.model} title={info.name} />
              <p className="mt-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{info.description}</p>

              {/* 規格表 */}
              <h2 className={`${cardTitle} mt-12`}>產品規格</h2>
              <dl className="mt-4 border-t border-line">
                {info.specs.map((s) => (
                  <div key={s.label} className="flex gap-6 border-b border-line py-3.5 text-sm">
                    <dt className="w-24 shrink-0 text-muted">{s.label}</dt>
                    <dd className="min-w-0">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs leading-6 text-muted">尺寸、重量與其他規格，請洽世紘專員確認。</p>

              {/* 產品特色 */}
              {info.features.length > 0 && (
                <>
                  <h2 className={`${cardTitle} mt-12`}>產品特色</h2>
                  <ul className="mt-4 space-y-3">
                    {info.features.map((f) => (
                      <li key={f} className={`${bodyText} flex gap-3`}>
                        <span aria-hidden="true" className="mt-3 h-px w-3 shrink-0 bg-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* 詢價：電話、Email（主旨帶入型號）、LINE、聯絡頁 */}
              <h2 className={`${cardTitle} mt-12`}>詢價與免費規劃</h2>
              <p className={`${bodyText} mt-3`}>詢價時提供型號「{item.model}」，專員可更快為您確認。</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={company.phoneHref} className={inquiryBtn}>
                  電話 {company.phone}
                </a>
                <a href={`mailto:${company.email}?subject=${mailSubject}`} className={inquiryBtn}>
                  Email 詢價
                </a>
                {/* LINE 為站外連結，另開新分頁 */}
                <a href={company.line} target="_blank" rel="noopener noreferrer" className={inquiryBtn}>
                  LINE 官方帳號
                </a>
              </div>
              {/* 返回列表（詢價方式已在上方，不再放「聯絡我們」按鈕） */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={list.listHref} className="inline-flex min-h-11 items-center px-2 text-sm tracking-[0.12em] transition hover:text-brand-deep">
                  ← 返回{list.name}列表
                </Link>
              </div>
            </div>
          </div>

          {/* 上一項／下一項 */}
          <nav aria-label="同系列品項" className="mt-16 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
            {prev ? (
              <Link href={prev.href} className="inline-flex min-h-11 items-center tracking-[0.08em] transition hover:text-brand-deep">
                ← 上一項
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={next.href} className="inline-flex min-h-11 items-center justify-self-end tracking-[0.08em] transition hover:text-brand-deep">
                下一項 →
              </Link>
            )}
          </nav>
        </div>
      </section>

      {/* 適用場所 */}
      {places.length > 0 && (
        <section className={section}>
          <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
            <SectionTitle align="left" eyebrow="APPLICATIONS" title="適用場所" />
            <ol className="border-t border-line">
              {places.map((p) => (
                <li key={p} className="flex items-baseline gap-6 border-b border-line py-4">
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
            <SectionTitle eyebrow="RELATED" title={`更多${list.name}`} />
            <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={p.href} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
                      <Image
                        src={p.image}
                        alt={`世紘 ${itemTitle(p)}`}
                        fill
                        sizes="(min-width: 1024px) 330px, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="mt-3 block text-sm tracking-[0.08em] transition group-hover:text-brand-deep">{p.model}</span>
                    {p.spec && <span className="block text-xs leading-6 text-muted">{p.spec}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <Link href={list.listHref} className={outlineBtn}>
                查看全部{list.name}
              </Link>
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
