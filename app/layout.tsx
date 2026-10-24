// 匯入 Next.js 的網頁中繼資料型別（標題、描述等）
import type { Metadata } from "next";
// 匯入 Google 字型：Noto Sans TC（思源黑體繁中）與 Archivo（英文標題用寬體字）
import { Archivo, Caveat, Noto_Sans_TC } from "next/font/google";
// 匯入全站共用樣式
import "./globals.css";
// 匯入中文斷行補強（長句改在詞與詞之間換行）與不可拆開的專有名詞
import LineBreaks from "./components/LineBreaks";
import { lineBreakTerms } from "./lib/line-break-terms";
// 匯入網站網址與公司資料
import { company, HOME_DESCRIPTION, HOME_TITLE, SITE_URL } from "./lib/site";

// 全站統一使用 Noto Sans TC 粗體
const notoSans = Noto_Sans_TC({
  // 將字型註冊成 CSS 變數 --font-noto-sans，供 globals.css 使用
  variable: "--font-noto-sans",
  // 載入 700（粗體，內文）與 900（特粗，首屏大標題）
  weight: ["700", "900"],
  // 字型下載完成前先用系統字顯示，避免畫面空白
  display: "swap",
  // 不預先載入（中文字型檔很大，避免拖慢首頁）
  preload: false,
});

// 英文標題字：Archivo 可變字型（含字寬軸，可做窄體／寬體）
const archivo = Archivo({
  // 註冊成 CSS 變數 --font-archivo
  variable: "--font-archivo",
  // 只需要英文字母
  subsets: ["latin"],
  // 額外載入字寬軸
  axes: ["wdth"],
  // 字型下載完成前先用系統字顯示
  display: "swap",
});

// 手寫字：Caveat，用於客戶案例區的手寫註記
const caveat = Caveat({
  // 註冊成 CSS 變數 --font-caveat
  variable: "--font-caveat",
  // 只需要英文字母
  subsets: ["latin"],
  // 只載入 600
  weight: ["600"],
  // 字型下載完成前先用系統字顯示
  display: "swap",
});

// 網頁中繼資料：全站預設值（各頁會再設定自己的標題、描述與 canonical）
export const metadata: Metadata = {
  // canonical、Open Graph 等網址一律以正式網域為準
  metadataBase: new URL(SITE_URL),
  // 預設標題（各頁以 pageMetadata 覆寫）
  title: HOME_TITLE,
  // 預設描述
  description: HOME_DESCRIPTION,
  // 網站名稱
  applicationName: company.shortName,
};

// 根版面：每一頁都會包在這個 <html><body> 結構裡
export default function RootLayout({ children }: LayoutProps<"/">) {
  // 回傳整頁的 HTML 骨架
  return (
    // 語系設為繁體中文；套用兩組字型變數、滿版高度與文字抗鋸齒
    // data-scroll-behavior：換頁時直接跳到頂端，不用平滑捲動（同頁錨點仍平滑捲動）
    <html lang="zh-Hant" data-scroll-behavior="smooth" className={`${notoSans.variable} ${archivo.variable} ${caveat.variable} h-full antialiased`}>
      {/* body 為直向排列、至少滿版高度，並全站使用無襯線粗體字；children 為各頁內容 */}
      <body className="flex min-h-full flex-col font-sans font-bold">
        {children}
        <LineBreaks keep={lineBreakTerms()} />
      </body>
    </html>
  );
}
