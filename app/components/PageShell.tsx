// 匯入產品分類讀取函式
import { getCatalog } from "../lib/products";
// 匯入聯絡區塊
import ContactSection from "./ContactSection";
// 匯入頁尾
import SiteFooter from "./SiteFooter";
// 匯入頁首
import SiteHeader from "./SiteHeader";

// 內頁外框：頁首＋主要內容＋聯絡區＋頁尾（與首頁相同的底色與文字顏色）
export default function PageShell({ children }: { children: React.ReactNode }) {
  // 頁首抽屜與頁尾需要的分類連結
  const links = getCatalog().categories.map(({ id, slug, name }) => ({ id, slug, name }));
  return (
    <div className="bg-paper text-ink">
      <SiteHeader categories={links} />
      <main>
        {children}
        {/* 每一頁底部都提供詢價方式 */}
        <ContactSection />
      </main>
      <SiteFooter categories={links} />
    </div>
  );
}
