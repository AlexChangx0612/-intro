import type { NextConfig } from "next";
// 舊網站轉址表
import { legacyRedirects } from "./app/lib/redirects";

const nextConfig: NextConfig = {
  // 圖片品質：一般圖用預設 75，分類頁頭的去背產品圖用 90
  images: { qualities: [75, 90] },
  // 測試站禁止收錄：網域不是 shihhung.com / www.shihhung.com 時（例如 shihhung1.vercel.app、預覽網址、localhost），
  // 所有回應加上 X-Robots-Tag: noindex。正式網域不受影響，因此不會把 noindex 帶到正式站
  async headers() {
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: "(www\\.)?shihhung\\.com" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // 舊網址 301 永久轉址（內容在 app/lib/redirects.ts）
  async redirects() {
    return [
      ...legacyRedirects.map((r) => ({ ...r, permanent: true })),
      // 特價商品已下架：舊的特價商品網址一律導到產品系列總覽
      { source: "/products/special-offers/:path*", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
