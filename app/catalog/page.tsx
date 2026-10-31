// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { card, container, outlineBtn, pageTop } from "../lib/ui";

// 目錄 PDF（public/catalog 底下；換新版目錄時置換這個檔案即可）
const CATALOG_PDF = "/catalog/shihhung-catalog-2023.pdf";
// 下載時的預設檔名
const DOWNLOAD_NAME = "世紘興業產品目錄.pdf";
// 檔案大小（顯示用）
const FILE_SIZE = "46 MB";

// 頁面描述
const description = "線上瀏覽世紘興業產品電子目錄，涵蓋紅龍柱、伸縮帶欄柱、告示牌、展示設備與公共空間設備，可免費下載 PDF 版本。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "產品電子目錄｜線上瀏覽與 PDF 下載｜世紘興業",
  description,
  path: "/catalog",
});

// 紅底白字按鈕（與客戶案例區按鈕相同的品牌紅）
const solidBtn =
  "inline-flex items-center justify-center gap-3 border border-brand-deep bg-brand-deep px-10 py-3.5 text-sm tracking-[0.2em] text-white transition hover:border-brand hover:bg-brand active:translate-y-px";

// 下載圖示
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16" />
    </svg>
  );
}

// 產品電子目錄頁
export default function CatalogPage() {
  return (
    <PageShell>
      {/* 結構化資料：目錄頁 */}
      <JsonLd data={[{ "@type": "WebPage", name: "產品電子目錄", description, url: absoluteUrl("/catalog") }]} />

      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          {/* 標題列：手機上下排列；電腦左標題、右按鈕 */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "產品電子目錄", path: "/catalog" }]} />
              <div className="mt-10">
                <SectionTitle
                  as="h1"
                  align="left"
                  title="產品電子目錄"
                  desc="線上瀏覽世紘全系列產品，或下載 PDF 版本隨時查閱。詢價時提供目錄上的型號，專員可更快為您提供服務。"
                />
              </div>
            </div>
            {/* 下載＋另開新視窗 */}
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a href={CATALOG_PDF} download={DOWNLOAD_NAME} className={solidBtn}>
                <DownloadIcon />
                下載目錄
                <span className="text-xs tracking-[0.1em] text-white/80">PDF・{FILE_SIZE}</span>
              </a>
              <a href={CATALOG_PDF} target="_blank" rel="noopener noreferrer" className={outlineBtn}>
                另開視窗瀏覽 ↗
              </a>
            </div>
          </div>

          {/* 電腦與平板：內嵌預覽（瀏覽器內建 PDF 檢視器，可翻頁、縮放） */}
          <div className={`mt-14 hidden overflow-hidden p-2 md:block ${card}`}>
            <iframe
              src={`${CATALOG_PDF}#view=FitH`}
              title="世紘興業產品電子目錄"
              className="h-[80vh] min-h-[640px] w-full rounded-[10px] bg-ivory"
            />
          </div>

          {/* 手機：多數手機瀏覽器無法內嵌 PDF，改為開啟／下載卡片 */}
          <div className={`mt-12 p-8 text-center md:hidden ${card}`}>
            <p className="font-display text-xs tracking-[0.35em] text-brand-deep">PDF</p>
            <p className="mt-3 text-xl tracking-[0.1em] text-ink">世紘興業產品目錄</p>
            <p className="mt-2 text-sm text-muted">檔案大小約 {FILE_SIZE}，建議使用 Wi-Fi 開啟</p>
            <a href={CATALOG_PDF} target="_blank" rel="noopener noreferrer" className={`${outlineBtn} mt-8 w-full`}>
              開啟目錄
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
