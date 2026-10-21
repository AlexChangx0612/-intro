// 網站地圖（/sitemap.xml）：列出所有可被搜尋引擎收錄的頁面，一律使用正式網域
import type { MetadataRoute } from "next";
// 匯入已登錄的產品
import { products } from "./lib/product-details";
// 匯入產品分類
import { getCatalog } from "./lib/products";
// 匯入網址工具
import { absoluteUrl } from "./lib/site";
// 匯入適用場域
import { solutions } from "./lib/solutions";

export default function sitemap(): MetadataRoute.Sitemap {
  // 依序：首頁、關於、產品系列、各分類、各產品、場域總覽、各場域
  const paths = [
    "/",
    "/about",
    "/products",
    ...getCatalog().categories.map((c) => `/products/${c.slug}`),
    ...products.map((p) => `/products/${p.category}/${p.slug}`),
    "/solutions",
    ...solutions.map((s) => `/solutions/${s.slug}`),
  ];
  return paths.map((p) => ({ url: absoluteUrl(p) }));
}
