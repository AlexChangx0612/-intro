// robots.txt：正式網站允許所有搜尋引擎與 AI 搜尋爬蟲
// 測試站（*.vercel.app、localhost 等非正式網域）的「禁止收錄」由 next.config.ts 的 X-Robots-Tag 標頭處理，
// 這裡刻意不擋爬蟲：爬蟲必須能讀取頁面，才看得到 noindex 標頭
import type { MetadataRoute } from "next";
// 匯入網址工具
import { absoluteUrl } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 所有爬蟲
      { userAgent: "*", allow: "/" },
      // ChatGPT 搜尋爬蟲
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
