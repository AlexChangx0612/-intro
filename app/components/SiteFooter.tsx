import Image from "next/image";
import { container, type CategoryLink } from "../lib/ui";

const services = [
  { href: "#products", label: "全系列商品" },
  { href: "#onsale", label: "特價商品" },
  { href: "#applications", label: "適用場域" },
  { href: "#contact", label: "免費空間規劃" },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-[11px] font-normal tracking-[0.35em] text-muted">{children}</h4>;
}

export default function SiteFooter({ categories }: { categories: CategoryLink[] }) {
  return (
    <footer className="border-t border-line bg-white">
      <div className={`${container} grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20`}>
        <div>
          <Image src="/brand/logo.png" alt="世紘興業 Shung 標誌" width={72} height={72} />
          <p className="mt-6 max-w-xs text-sm leading-7 text-muted">
            專營紅龍柱、排隊欄柱與公共空間設備，為銀行、醫院、商場與各式場館打造有秩序、有質感的空間。
          </p>
        </div>

        <div>
          <ColumnTitle>產品系列</ColumnTitle>
          <ul className="mt-6 space-y-3 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <a href={`#c-${c.id}`} className="transition hover:opacity-60">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnTitle>服務</ColumnTitle>
          <ul className="mt-6 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="transition hover:opacity-60">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnTitle>聯絡資訊</ColumnTitle>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <a href="tel:0212345678" className="transition hover:opacity-60">02-1234-5678</a>
            </li>
            <li>
              <a href="mailto:service@example.com" className="break-all transition hover:opacity-60">service@example.com</a>
            </li>
            <li className="text-muted">台北市信義區範例路 100 號</li>
            <li className="text-muted">週一至週五 09:00–18:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className={`${container} flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between`}>
          <span className="pl-[0.4em] font-serif tracking-[0.4em]">世紘興業</span>
          <span className="text-xs text-muted">© {new Date().getFullYear()} 世紘興業 All rights reserved.</span>
          <a href="#" className="text-xs tracking-[0.2em] transition hover:opacity-60">
            回到頂部
          </a>
        </div>
      </div>
    </footer>
  );
}
