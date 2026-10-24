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
// 匯入案例照片牆（點擊放大）
import CaseGallery from "../../components/CaseGallery";
// 匯入結構化資料元件
import JsonLd from "../../components/JsonLd";
// 匯入內頁外框
import PageShell from "../../components/PageShell";
// 匯入圖文交錯段落（與「關於世紘」同一套版型）
import { StoryRows } from "../../components/Story";
// 匯入客戶案例資料
import { caseHref, cases, getCase } from "../../lib/cases";
// 匯入產品分類（相關產品系列的名稱）
import { getCategory } from "../../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, ORG_ID, pageMetadata } from "../../lib/site";
// 匯入共用樣式
import { container, outlineBtn, pageTop } from "../../lib/ui";

// 只產生已知的案例頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有案例頁
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

// 每個案例頁各自的標題、描述與分享圖；CMS 完成、正式上線前先不讓搜尋引擎收錄
export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    ...pageMetadata({ title: `${c.title}｜客戶實際案例｜世紘興業`, description: c.summary, path: caseHref(c.slug), image: c.cover.src, type: "article" }),
    robots: { index: false, follow: true },
  };
}

// 客戶案例詳細頁：大圖開場＋重點資訊列 → 故事三段 → 照片牆 → 相關產品與上一個／下一個案例
export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  // 網址
  const path = caseHref(c.slug);
  // 上一個／下一個案例（循環：第一個的上一個是最後一個）
  const i = cases.indexOf(c);
  const prev = cases[(i - 1 + cases.length) % cases.length];
  const next = cases[(i + 1) % cases.length];
  // 相關產品系列（找不到的略過）
  const related = c.related.map(getCategory).filter((cat) => cat !== undefined);
  // 重點資訊列四格
  const facts = [
    { label: "客戶", value: c.client },
    { label: "地點", value: c.location },
    { label: "使用產品", value: c.products },
    { label: "客製內容", value: c.custom },
  ];

  return (
    <PageShell>
      {/* 結構化資料：案例文章 */}
      <JsonLd
        data={[
          {
            "@type": "Article",
            headline: c.title,
            description: c.summary,
            url: absoluteUrl(path),
            image: [c.cover, ...c.gallery].slice(0, 4).map((p) => absoluteUrl(p.src)),
            about: { "@id": ORG_ID },
            publisher: { "@id": ORG_ID },
          },
        ]}
      />

      {/* 開場：麵包屑、圓角大圖、標題與重點資訊列 */}
      <section className={`${pageTop} pb-16 sm:pb-20`}>
        <div className={container}>
          <Breadcrumbs
            items={[
              { name: "首頁", path: "/" },
              { name: "客戶實際案例", path: "/cases" },
              { name: c.title, path },
            ]}
          />
          {/* 封面大圖：手機 4:3、平板以上 16:9 */}
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)] sm:aspect-video">
            <Image src={c.cover.src} alt={c.cover.alt} fill preload sizes="(min-width: 1440px) 1344px, 100vw" className="object-cover" />
          </div>
          {/* 英文小標＋場域、標題、摘要 */}
          <p className="mt-10 text-xs tracking-[0.35em] text-brand-deep">CASE STUDY・{c.scene}</p>
          <h1 className="mt-4 text-[28px] leading-snug tracking-[0.1em] text-balance text-brand sm:text-4xl">{c.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-pretty text-muted sm:text-base">{c.summary}</p>
          {/* 重點資訊列：手機一欄、平板兩欄、電腦四欄 */}
          <dl className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="border-b border-line py-5 pr-4 lg:border-b-0">
                <dt className="text-xs tracking-[0.25em] text-muted">{f.label}</dt>
                <dd className="mt-2 text-sm leading-7 text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 故事三段：需求、世紘的做法、製作與出貨（圖文交錯） */}
      <StoryRows stories={c.story.map((s) => ({ en: s.en, title: s.title, body: s.body, image: s.photo.src, alt: s.photo.alt }))} />

      {/* 照片牆：有其他照片時才顯示 */}
      {c.gallery.length > 0 && (
        <section className="border-t border-line py-16 sm:py-24">
          <div className={container}>
            <p className="text-xs tracking-[0.35em] text-brand-deep">GALLERY</p>
            <h2 className="mt-4 text-2xl tracking-[0.12em] text-brand sm:text-3xl">更多實拍照片</h2>
            <p className="mt-3 text-sm text-muted">點擊照片可放大檢視。</p>
            <div className="mt-10">
              <CaseGallery photos={c.gallery} />
            </div>
          </div>
        </section>
      )}

      {/* 收尾：相關產品系列、詢價按鈕、上一個／下一個案例 */}
      <section className="border-t border-line py-16 sm:py-20">
        <div className={container}>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-[0.35em] text-brand-deep">PRODUCTS</p>
              <h2 className="mt-4 text-xl tracking-[0.12em] text-ink">這個案例使用的產品</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {related.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products/${cat.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm tracking-[0.08em] text-ink shadow-[0_0_0_1px_rgba(15,15,14,.08)] transition hover:text-brand-deep hover:shadow-[0_0_0_1px_rgba(214,31,42,.4)]"
                    >
                      {cat.name}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/contact" className={`${outlineBtn} self-start lg:self-auto`}>
              我也想規劃類似的場地
            </Link>
          </div>

          {/* 上一個／下一個案例 */}
          <nav aria-label="其他案例" className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            <Link href={caseHref(prev.slug)} className="group flex flex-col gap-1">
              <span className="text-xs tracking-[0.25em] text-muted">
                <span aria-hidden="true" className="inline-block transition group-hover:-translate-x-1">←</span> 上一個案例
              </span>
              <span className="text-base tracking-[0.08em] text-ink transition group-hover:text-brand-deep">{prev.title}</span>
            </Link>
            <Link href={caseHref(next.slug)} className="group flex flex-col gap-1 sm:items-end sm:text-right">
              <span className="text-xs tracking-[0.25em] text-muted">
                下一個案例 <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span>
              </span>
              <span className="text-base tracking-[0.08em] text-ink transition group-hover:text-brand-deep">{next.title}</span>
            </Link>
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
