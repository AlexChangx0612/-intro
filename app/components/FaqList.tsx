// 匯入 Next.js 站內連結元件
import Link from "next/link";

// 單一問答；link 為延伸閱讀（選填）
export type Faq = { q: string; a: string; link?: { href: string; label: string } };

// 常見問題清單：使用原生 <details>，未展開時答案仍在 HTML 中，搜尋引擎可直接讀取
export default function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    // 上方分隔線（與「適用場域」清單相同）
    <div className="border-t border-line">
      {faqs.map((f) => (
        // 一題：下方分隔線
        <details key={f.q} className="group border-b border-line">
          {/* 問題列：點擊展開；右側「＋」展開時轉成「×」 */}
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg tracking-[0.08em] transition hover:text-brand-deep [&::-webkit-details-marker]:hidden">
            <h3 className="text-pretty">{f.q}</h3>
            <span aria-hidden="true" className="text-2xl leading-none text-brand transition duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          {/* 答案：灰字 */}
          <div className="max-w-3xl pb-6 text-sm leading-7 text-pretty text-muted">
            <p>{f.a}</p>
            {/* 延伸閱讀連結 */}
            {f.link && (
              <Link href={f.link.href} className="mt-2 inline-flex min-h-11 items-center text-brand-deep transition hover:opacity-70">
                {f.link.label} →
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
