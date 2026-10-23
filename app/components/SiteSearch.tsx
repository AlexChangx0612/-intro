// 標記為瀏覽器端元件（需要開關搜尋面板、即時顯示結果）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 Next.js 換頁 hook
import { useRouter } from "next/navigation";
// 匯入 React hook
import { useEffect, useMemo, useRef, useState } from "react";
// 匯入搜尋比對邏輯與型別
import { SEARCH_KINDS, searchEntries, type SearchEntry } from "../lib/search-match";

// 面板中每種類型最多顯示幾筆；商品縮圖最多幾張
const LIMIT = 4;
const THUMBS = 6;

// 熱門關鍵字：輸入框空白時顯示，點擊直接搜尋
const popular = ["紅龍柱", "伸縮帶欄柱", "拒馬", "告示牌", "垃圾桶", "客製化"];

// 放大鏡圖示
export function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      {/* 鏡片與握把 */}
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" strokeLinecap="round" />
    </svg>
  );
}

// 搜尋索引只下載一次，之後重複使用
let indexPromise: Promise<SearchEntry[]> | null = null;
function loadIndex() {
  indexPromise ??= fetch("/search-index.json").then((r) => r.json());
  return indexPromise;
}

// 一列文字結果：類型小標＋標題＋說明＋箭頭
function ResultRow({ e, onClick }: { e: SearchEntry; onClick: () => void }) {
  return (
    <Link href={e.href} onClick={onClick} className="group flex items-center gap-4 border-b border-line py-3 transition hover:text-brand-deep">
      {/* 縮圖（有圖才顯示） */}
      {e.image ? (
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[8px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)]">
          <Image src={e.image} alt="" fill sizes="48px" className="object-contain p-1" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base tracking-[0.08em]">{e.title}</span>
        {e.desc && <span className="mt-0.5 block truncate text-xs text-muted">{e.desc}</span>}
      </span>
      <span aria-hidden="true" className="text-brand-deep transition group-hover:translate-x-1">→</span>
    </Link>
  );
}

// 頁首放大鏡：點擊打開搜尋面板，輸入關鍵字即時找出產品、系列與服務；按 Enter 前往完整搜尋結果頁
export default function SiteSearch({ className = "" }: { className?: string }) {
  // 面板是否打開
  const [open, setOpen] = useState(false);
  // 輸入的關鍵字
  const [q, setQ] = useState("");
  // 搜尋索引（第一次打開時載入）
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  // 輸入框（打開時自動聚焦）
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 關閉面板
  const close = () => setOpen(false);

  // 打開時：載入索引、聚焦輸入框、鎖住背景捲動、Esc 關閉
  useEffect(() => {
    if (!open) return;
    loadIndex().then(setIndex).catch(() => setIndex([]));
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 即時搜尋結果
  const results = useMemo(() => (index ? searchEntries(index, q) : []), [index, q]);
  // 文字結果（依類型分組）與商品縮圖
  const groups = SEARCH_KINDS.filter((k) => k !== "商品")
    .map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) }))
    .filter((g) => g.items.length > 0);
  const goods = results.filter((r) => r.kind === "商品");
  // 完整結果頁網址
  const allHref = `/search?q=${encodeURIComponent(q.trim())}`;

  // 按 Enter：前往完整結果頁
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    close();
    router.push(allHref);
  };

  return (
    <>
      {/* 放大鏡按鈕：點擊範圍至少 44×44px */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="搜尋產品與服務"
        aria-expanded={open}
        className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center transition hover:text-brand-deep ${className}`}
      >
        <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* 搜尋面板：從上方滑入的白色面板，下方半透明背景 */}
      {open && (
        <div role="dialog" aria-modal="true" aria-label="站內搜尋" className="fixed inset-0 z-50">
          {/* 背景：點擊關閉 */}
          <button type="button" aria-label="關閉搜尋" onClick={close} className="absolute inset-0 animate-[fade-in_.3s_ease-out] bg-ink/30" />
          {/* 面板：浮動白色卡片（與頁首相同的下緣圓角），內容過長可捲動 */}
          <div className="absolute inset-x-2 top-0 flex max-h-[88vh] motion-safe:animate-[hdr-in_.5s_cubic-bezier(.16,1,.3,1)_both] flex-col rounded-b-[18px] bg-white shadow-[0_16px_36px_-24px_rgba(15,15,14,.3)] sm:inset-x-6 lg:inset-x-10 lg:rounded-b-[22px]">
            {/* 輸入列 */}
            <form role="search" onSubmit={submit} className="mx-auto flex w-full max-w-4xl items-center gap-3 border-b border-line px-5 pt-6 pb-4 sm:gap-4 sm:px-8 sm:pt-10">
              <SearchIcon className="h-6 w-6 shrink-0 text-brand-deep" />
              <input
                ref={input}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="輸入產品名稱、型號或服務"
                aria-label="搜尋關鍵字"
                className="min-w-0 flex-1 bg-transparent py-2 text-lg tracking-[0.08em] outline-none placeholder:text-muted/60 sm:text-2xl [&::-webkit-search-cancel-button]:hidden"
              />
              <button type="button" onClick={close} className="flex min-h-11 shrink-0 items-center gap-2 text-sm tracking-[0.15em]">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                <span className="hidden sm:inline">關閉</span>
              </button>
            </form>

            {/* 結果區：捲軸在面板邊緣，內容維持與輸入列同寬 */}
            <div className="overflow-y-auto">
              <div className="mx-auto w-full max-w-4xl px-5 pt-5 pb-8 sm:px-8">
                {!q.trim() ? (
                  // 尚未輸入：熱門關鍵字
                  <div>
                    <p className="text-xs tracking-[0.35em] text-brand-deep">熱門搜尋</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {popular.map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setQ(w)}
                          className="rounded-full border border-line px-4 py-1.5 text-sm tracking-[0.08em] transition hover:border-brand-deep hover:text-brand-deep"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : !index ? (
                  <p className="text-sm text-muted">載入中…</p>
                ) : results.length === 0 ? (
                  // 找不到：引導聯絡專員
                  <p className="text-sm leading-7 text-muted">
                    找不到「{q.trim()}」相關的產品或服務。可換個關鍵字，或
                    <Link href="/contact" onClick={close} className="text-brand-deep underline underline-offset-4">
                      聯絡專員
                    </Link>
                    協助查詢。
                  </p>
                ) : (
                  <div className="space-y-7">
                    {/* 文字結果：依類型分組 */}
                    {groups.map((g) => (
                      <section key={g.kind}>
                        <p className="text-xs tracking-[0.35em] text-brand-deep">
                          {g.kind}
                          <span className="ml-2 text-muted">{g.items.length}</span>
                        </p>
                        <div className="mt-2 border-t border-line">
                          {g.items.slice(0, LIMIT).map((e) => (
                            <ResultRow key={e.href} e={e} onClick={close} />
                          ))}
                        </div>
                      </section>
                    ))}
                    {/* 商品縮圖 */}
                    {goods.length > 0 && (
                      <section>
                        <p className="text-xs tracking-[0.35em] text-brand-deep">
                          相關商品
                          <span className="ml-2 text-muted">{goods.length}</span>
                        </p>
                        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
                          {goods.slice(0, THUMBS).map((e) => (
                            <li key={e.href}>
                              <Link href={e.href} onClick={close} aria-label={`${e.title} ${e.desc ?? ""}`} className="relative block aspect-square overflow-hidden rounded-[10px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)] transition hover:shadow-[0_0_0_1px_rgba(214,31,42,.35)]">
                                <Image src={e.image!} alt="" fill sizes="(min-width: 640px) 128px, 30vw" className="object-contain p-2" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {/* 完整結果頁 */}
                    <Link href={allHref} onClick={close} className="group inline-flex items-center gap-3 text-sm tracking-[0.15em] text-brand-deep">
                      查看全部 {results.length} 項結果
                      <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
