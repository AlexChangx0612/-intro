// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑型別與結構化資料產生器
import { breadcrumbJsonLd, type Crumb } from "../lib/site";
// 匯入結構化資料元件
import JsonLd from "./JsonLd";

// 麵包屑：低調的灰色小字路徑（最後一層為目前頁面，不可點）＋ BreadcrumbList 結構化資料
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="麵包屑">
      {/* 結構化資料 */}
      <JsonLd data={breadcrumbJsonLd(items)} />
      {/* 橫向排列、可換行，層與層之間以「/」分隔 */}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.12em] text-muted">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-2">
            {/* 分隔符號（第一層前不加） */}
            {i > 0 && (
              <span aria-hidden="true" className="text-line">
                /
              </span>
            )}
            {i < items.length - 1 ? (
              // 上層：可點擊，滑鼠移上變紅字
              <Link href={c.path} className="transition hover:text-brand-deep">
                {c.name}
              </Link>
            ) : (
              // 目前頁面
              <span aria-current="page" className="text-ink">
                {c.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
