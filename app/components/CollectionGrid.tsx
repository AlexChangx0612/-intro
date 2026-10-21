// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入分類連結型別
import type { CategoryLink } from "../lib/ui";
// 匯入產品系列線條圖示
import CategoryIcon from "./CategoryIcon";

// 產品系列圖示方塊：手機一排 2 個、平板以上 5 個、大螢幕 7 個；最後一排置中；點擊進入分類頁
export default function CollectionGrid({ categories }: { categories: CategoryLink[] }) {
  return (
    <ul className="mt-14 flex flex-wrap justify-center gap-4 md:gap-5">
      {/* 每個分類產生一個方塊；i 為順序 */}
      {categories.map((c, i) => (
        // 方塊寬度依每排數量平分（扣除間距）
        <li
          key={c.id}
          className="w-[calc((100%-16px)/2)] md:w-[calc((100%-80px)/5)] xl:w-[calc((100%-120px)/7)]"
        >
          {/* 連到該分類頁 */}
          <Link
            href={`/products/${c.slug}`}
            // 直式白卡（4:5）、細框；滑鼠移上微微浮起並加陰影
            className="group relative flex aspect-[4/5] flex-col items-center justify-center rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(214,31,42,.18),0_18px_36px_-22px_rgba(15,15,14,.35)] lg:rounded-[18px]"
          >
            {/* 左上角編號：01、02… */}
            <span className="absolute top-3 left-3.5 text-[11px] tracking-[0.15em] text-muted lg:top-4 lg:left-4">
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* 系列圖示：固定大小，滑鼠移上變品牌紅 */}
            <CategoryIcon id={c.id} className="size-12 text-ink transition duration-300 group-hover:text-brand-deep sm:size-14 xl:size-16" />
            {/* 圖示下方細線：滑鼠移上拉長 */}
            <span aria-hidden="true" className="mt-4 h-px w-5 bg-brand/50 transition-[width] duration-300 group-hover:w-9" />
            {/* 系列名稱：空間不夠時只在「・」後換行，不把詞拆開；固定保留兩行高度，讓每張卡的圖示位置一致 */}
            <span className="mt-3 flex min-h-[2lh] flex-wrap content-center justify-center px-2 text-center text-sm leading-snug tracking-[0.08em] transition group-hover:text-brand-deep lg:text-[15px]">
              {c.name.split("・").map((part, j, all) => (
                <span key={part}>
                  <span className="whitespace-nowrap">{j < all.length - 1 ? `${part}・` : part}</span>
                  {j < all.length - 1 && <wbr />}
                </span>
              ))}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
