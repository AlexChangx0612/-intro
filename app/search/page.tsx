// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入放大鏡圖示
import { SearchIcon } from "../components/SiteSearch";
// 匯入搜尋索引
import { getSearchIndex } from "../lib/search";
// 匯入搜尋比對邏輯
import { SEARCH_KINDS, searchEntries } from "../lib/search-match";
// 匯入共用樣式
import { card, cardHover, container, pageTop } from "../lib/ui";

// 中繼資料：搜尋結果頁不讓搜尋引擎收錄
export const metadata: Metadata = {
  title: { absolute: "站內搜尋｜世紘興業" },
  description: "搜尋世紘興業的產品、型號與服務。",
  robots: { index: false, follow: true },
};

// 站內搜尋結果頁（/search?q=關鍵字）
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  // 關鍵字（多個時取第一個）
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim();
  // 搜尋結果
  const results = q ? searchEntries(getSearchIndex(), q) : [];
  // 文字結果依類型分組；商品另以圖片格顯示
  const groups = SEARCH_KINDS.filter((k) => k !== "商品")
    .map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) }))
    .filter((g) => g.items.length > 0);
  const goods = results.filter((r) => r.kind === "商品");

  return (
    <PageShell>
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "站內搜尋", path: "/search" }]} />
          <div className="mt-10">
            <SectionTitle as="h1" align="left" title={q ? `「${q}」的搜尋結果` : "站內搜尋"} desc={q ? `共 ${results.length} 項結果` : "輸入產品名稱、型號或服務。"} />
          </div>

          {/* 搜尋框：一般表單送出，不需 JavaScript 也能使用 */}
          <form role="search" action="/search" className="mt-10 flex max-w-2xl items-center gap-3 border-b border-ink/20 pb-2 focus-within:border-brand-deep">
            <SearchIcon className="h-6 w-6 shrink-0 text-brand-deep" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="輸入產品名稱、型號或服務"
              aria-label="搜尋關鍵字"
              className="min-w-0 flex-1 bg-transparent py-2 text-lg tracking-[0.08em] outline-none placeholder:text-muted/60 [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="submit" className="min-h-11 shrink-0 px-2 text-sm tracking-[0.2em] text-brand-deep">
              搜尋
            </button>
          </form>

          {/* 找不到：引導聯絡專員 */}
          {q && results.length === 0 && (
            <p className="mt-12 text-sm leading-7 text-muted sm:text-base sm:leading-8">
              找不到「{q}」相關的產品或服務。可換個關鍵字，或
              <Link href="/contact" className="text-brand-deep underline underline-offset-4">
                聯絡專員
              </Link>
              協助查詢；也可以
              <Link href="/catalog" className="text-brand-deep underline underline-offset-4">
                瀏覽產品電子目錄
              </Link>
              。
            </p>
          )}

          {/* 文字結果：電腦兩欄 */}
          {groups.length > 0 && (
            <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-x-20">
              {groups.map((g) => (
                <section key={g.kind}>
                  <h2 className="text-xs tracking-[0.35em] text-brand-deep">
                    {g.kind}
                    <span className="ml-2 text-muted">{g.items.length}</span>
                  </h2>
                  <ul className="mt-3 border-t border-line">
                    {g.items.map((e) => (
                      <li key={e.href} className="border-b border-line">
                        <Link href={e.href} className="group flex items-center gap-4 py-4 transition hover:text-brand-deep">
                          {e.image && (
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)]">
                              <Image src={e.image} alt="" fill sizes="56px" className="object-contain p-1" />
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block text-lg tracking-[0.08em]">{e.title}</span>
                            {e.desc && <span className="mt-1 block text-sm text-pretty text-muted">{e.desc}</span>}
                          </span>
                          <span aria-hidden="true" className="text-brand-deep transition group-hover:translate-x-1">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {/* 商品：圖片格，與產品分類頁相同的白卡片 */}
          {goods.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xs tracking-[0.35em] text-brand-deep">
                相關商品
                <span className="ml-2 text-muted">{goods.length}</span>
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
                {goods.map((e) => (
                  <li key={e.href}>
                    <Link href={e.href} className={`group block overflow-hidden ${card} ${cardHover}`}>
                      <span className="relative block aspect-square">
                        <Image src={e.image!} alt={`${e.title} ${e.desc ?? ""}`} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" className="object-contain p-4" />
                      </span>
                      <span className="block border-t border-line px-4 py-3">
                        <span className="block truncate text-sm tracking-[0.08em]">{e.title}</span>
                        <span className="block text-xs text-muted">{e.desc}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </PageShell>
  );
}
