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
      // P4-45LBK、P4-45LGD 從伸縮帶欄柱移到海報架・告示牌
      { source: "/products/retractable-belt-stanchions/:code(new-046-001|new-047-001)", destination: "/products/poster-sign-stands/:code", permanent: true },
      // RF-19BU、RF-19BU-FD 從數位看板・燈箱移到展覽佈展欄柱
      { source: "/products/digital-signage-lightbox/:code(20240729-007-001|20240729-008-001)", destination: "/products/exhibition-stanchions/:code", permanent: true },
      // 「室內外欄柱」更名為「展覽佈展欄柱」：舊分類與產品網址導到新網址
      { source: "/products/indoor-outdoor-stanchions/:path*", destination: "/products/exhibition-stanchions/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
