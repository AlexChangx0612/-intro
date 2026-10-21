// 匯入 Next.js 的網頁中繼資料型別（標題、描述等）
import type { Metadata } from "next";
// 匯入 Google 字型：Noto Sans TC（思源黑體繁中）與 Archivo（英文標題用寬體字）
import { Archivo, Caveat, Noto_Sans_TC } from "next/font/google";
// 匯入全站共用樣式
import "./globals.css";

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

// 網頁中繼資料：瀏覽器分頁標題與搜尋引擎描述
export const metadata: Metadata = {
  // 瀏覽器分頁上顯示的標題
  title: "世紘興業｜公共空間設備專家",
  // 搜尋結果下方顯示的網站描述
  description: "專營紅龍柱、排隊欄柱與各式公共空間設備。",
};

// 根版面：每一頁都會包在這個 <html><body> 結構裡
export default function RootLayout({ children }: LayoutProps<"/">) {
  // 回傳整頁的 HTML 骨架
  return (
    // 語系設為繁體中文；套用兩組字型變數、滿版高度與文字抗鋸齒
    <html lang="zh-Hant" className={`${notoSans.variable} ${archivo.variable} ${caveat.variable} h-full antialiased`}>
      {/* body 為直向排列、至少滿版高度，並全站使用無襯線粗體字；children 為各頁內容 */}
      <body className="flex min-h-full flex-col font-sans font-bold">{children}</body>
    </html>
  );
}
