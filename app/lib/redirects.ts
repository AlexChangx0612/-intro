// 舊網站網址轉址表（301 永久轉址），由 next.config.ts 讀取
// 正式網域切換到新網站前，請把舊 shihhung.com 的網址逐一對應到新網址，避免舊連結與搜尋結果變成 404
// 尚未取得完整的舊網址清單，因此目前為空；請勿猜測對應
//
// 範例：
//   { source: "/product.php", has: [{ type: "query", key: "id", value: "12" }], destination: "/products/retractable-belt-stanchions/rs-a4bk" },
//   { source: "/category/retractable", destination: "/products/retractable-belt-stanchions" },
import type { NextConfig } from "next";

// Next.js 的轉址設定型別
type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

// 單筆轉址：source 為舊網址路徑，destination 為新網址路徑（一律 301 永久轉址）
export type LegacyRedirect = Pick<Redirect, "source" | "destination" | "has" | "missing">;

export const legacyRedirects: LegacyRedirect[] = [];
