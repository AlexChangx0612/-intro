// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
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
// 匯入產品目錄
import { getCatalog } from "../../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, ORG_ID, pageMetadata } from "../../lib/site";
// 匯入適用場域資料
import { getSolution, solutions } from "../../lib/solutions";
// 匯入共用樣式
import { bodyText, card, cardTitle, container, outlineBtn, pageTop, section } from "../../lib/ui";
// 匯入產品系列方塊
import CollectionGrid from "../../components/CollectionGrid";

// 只產生已知的場域頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有場域頁
export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

// 每個場域頁各自的標題、描述與 canonical
export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.description, path: `/solutions/${s.slug}` });
}

// 單一場域頁
export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  // 網址
  const path = `/solutions/${s.slug}`;
  // 分類名稱對照
  const { categories } = getCatalog();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  // 這個場域用到的所有分類（不重複，依出現順序）
  const used = [...new Set(s.needs.flatMap((n) => n.categories))].map((c) => bySlug.get(c)).filter((c) => c !== undefined);

  return (
    <PageShell>
      {/* 結構化資料：網頁＋常見問題 */}
      <JsonLd
        data={[
          {
            "@type": "WebPage",
            name: s.h1,
            description: s.description,
            url: absoluteUrl(path),
            publisher: { "@id": ORG_ID },
            about: used.map((c) => ({ "@type": "Thing", name: c.name, url: absoluteUrl(`/products/${c.slug}`) })),
          },
          faqJsonLd(s.faqs),
        ]}
      />

      {/* 頁首：麵包屑、標題、介紹與常見挑戰 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={`${container} grid gap-12 lg:grid-cols-2 lg:gap-20`}>
          <div>
            <Breadcrumbs
              items={[
                { name: "首頁", path: "/" },
                { name: "適用場域", path: "/solutions" },
                { name: s.name, path },
              ]}
            />
            <div className="mt-10">
              <SectionTitle as="h1" align="left" title={s.h1} />
              <p className="mt-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{s.intro}</p>
              <a href="#contact" className={`${outlineBtn} mt-10`}>
                請專員規劃我的場地
              </a>
            </div>
          </div>
          {/* 常見挑戰：編號清單（與首頁「適用場域」清單相同樣式） */}
          <div className="lg:pt-16">
            <h2 className={cardTitle}>{s.name}常見的挑戰</h2>
            <ol className="mt-6 border-t border-line">
              {s.challenges.map((c) => (
                <li key={c} className="flex items-baseline gap-6 border-b border-line py-4">
                  <span className="text-base tracking-[0.06em]">{c}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 建議設備配置：白色卡片 */}
      <section className={section}>
        <div className={container}>
          <SectionTitle title="世紘建議的設備配置" />
          <div className="mt-14 grid gap-4 md:grid-cols-2 md:gap-5">
            {s.needs.map((n) => (
              <article key={n.title} className={`p-6 lg:p-8 ${card}`}>
                <h3 className={cardTitle}>{n.title}</h3>
                <p className={`${bodyText} mt-3`}>{n.desc}</p>
                {/* 相關產品分類連結 */}
                <ul className="mt-4 flex flex-wrap gap-x-6">
                  {n.categories.map((slug) => {
                    const c = bySlug.get(slug);
                    return c ? (
                      <li key={slug}>
                        <Link href={`/products/${c.slug}`} className="inline-flex min-h-11 items-center text-sm tracking-[0.08em] text-brand-deep transition hover:opacity-70">
                          {c.name} →
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 推薦相關產品系列 */}
      <section className={section}>
        <div className={container}>
          <SectionTitle title="推薦產品系列" />
          <CollectionGrid categories={used} />
        </div>
      </section>

      {/* 常見問題 */}
      <section id="faq" className={section}>
        <div className={`${container} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
          <SectionTitle align="left" title="常見問題" />
          <FaqList faqs={s.faqs} />
        </div>
      </section>
    </PageShell>
  );
}
