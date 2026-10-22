// 匯入 Node.js 檔案系統模組，用來讀取資料夾內的圖片
import fs from "node:fs";
// 匯入路徑處理模組，用來組合資料夾路徑
import path from "node:path";
// 匯入已登錄產品（有型號與規格的產品）
import { productByImage, type ProductDetail } from "./product-details";

// 單一品項：每張產品照一個品項，各自有獨立介紹頁 /products/<分類>/<slug>
export type CatalogItem = {
  // 網址代號：已登錄產品用型號（例如 rs-a4bk），其餘用小寫檔名（例如 001-006-001）
  slug: string;
  // 品項編號：產品照檔名（不含副檔名），詢價時可提供給專員
  code: string;
  // 產品照網址
  image: string;
  // 介紹頁網址
  href: string;
  // 顯示名稱：已登錄產品用產品名稱，其餘用分類名稱
  name: string;
  // 已登錄產品的完整資料（型號、規格、特色）；未登錄為 undefined
  detail?: ProductDetail;
};

// 特價商品：沒有獨立分類頁，列表在首頁 #onsale；品項頁網址為 /products/special-offers/<slug>
export const ONSALE = {
  slug: "special-offers",
  en: "SPECIAL OFFERS",
  name: "特價商品",
  desc: "限量優惠，售完為止。",
  // 返回列表的位置
  listHref: "/#onsale",
};

// 產品分類的資料型別
export type Category = {
  // 分類代號（英文，用於首頁商品目錄的錨點 #c-id）
  id: string;
  // 分類頁網址代號：/products/<slug>
  slug: string;
  // 英文名稱（小標用）
  en: string;
  // 分類名稱（顯示用）
  name: string;
  // 分類說明文字
  desc: string;
  // 此分類的所有產品圖片網址
  images: string[];
  // 此分類的所有品項（與 images 同順序）
  items: CatalogItem[];
};

// 依照片實際內容分類；prefixes 比對 public/images 底下的檔名開頭
const categoryDefs: { id: string; slug: string; en: string; name: string; desc: string; prefixes: string[] }[] = [
  // 分類 1：伸縮帶欄柱
  {
    id: "retractable",
    slug: "retractable-belt-stanchions",
    en: "RETRACTABLE BELT STANCHIONS",
    name: "伸縮帶欄柱",
    desc: "萬向系列伸縮織帶紅龍柱，以及柱頭告示框、防塵蓋等配件。",
    // 檔名以這些文字開頭的圖片歸入此分類
    prefixes: ["001-", "20230821-", "new-"],
  },
  // 分類 2：迎賓欄柱
  {
    id: "rope",
    slug: "rope-stanchions",
    en: "ROPE STANCHIONS",
    name: "迎賓欄柱",
    desc: "圓球頭不鏽鋼欄柱，搭配絨布繩，典雅大方。",
    prefixes: ["003-", "004-"],
  },
  // 分類 3：室內外欄柱
  {
    id: "outdoor",
    slug: "indoor-outdoor-stanchions",
    en: "INDOOR & OUTDOOR STANCHIONS",
    name: "室內外欄柱",
    desc: "消光黑烤漆柱身，可搭配彈力繩，室內外皆適用。",
    prefixes: ["005-", "006-"],
  },
  // 分類 4：塑膠欄柱
  {
    id: "plastic",
    slug: "plastic-stanchions",
    en: "PLASTIC STANCHIONS",
    name: "塑膠欄柱",
    desc: "紅白警示塑膠欄柱，底座實心配重，施工與停車場常用。",
    prefixes: ["002-"],
  },
  // 分類 5：拒馬
  {
    id: "barrier",
    slug: "barriers",
    en: "BARRIERS",
    name: "拒馬",
    desc: "烤漆與不鏽鋼拒馬，可放置廣告看板，入口管制好幫手。",
    prefixes: ["012-001-", "012-002-", "012-003-", "012-004-", "012-005-", "012-006-", "012-007-", "012-20221205-"],
  },
  // 分類 6：海報架・告示牌
  {
    id: "sign",
    slug: "poster-sign-stands",
    en: "POSTER & SIGN STANDS",
    name: "海報架・告示牌",
    desc: "壁掛海報框、立式告示牌、壓克力公佈欄與警示立牌。",
    prefixes: ["007-", "014-", "018-", "012-20221125-"],
  },
  // 分類 7：佈告欄
  {
    id: "board",
    slug: "bulletin-boards",
    en: "BULLETIN BOARDS",
    name: "佈告欄",
    desc: "雙面布面佈告欄，附輪移動方便。",
    prefixes: ["008-"],
  },
  // 分類 8：數位看板・燈箱
  {
    id: "display",
    slug: "digital-signage-lightbox",
    en: "DIGITAL SIGNAGE & LIGHTBOX",
    name: "數位看板・燈箱",
    desc: "IPS 數位看板與 LED 發光展示架，吸睛宣傳。",
    prefixes: ["009-", "20240729-"],
  },
  // 分類 9：垃圾桶・資源回收
  {
    id: "trash",
    slug: "waste-recycling",
    en: "WASTE & RECYCLING",
    name: "垃圾桶・資源回收",
    desc: "不鏽鋼垃圾桶、煙灰桶、分類回收桶與分類貼紙。",
    prefixes: ["011-002-", "011-004-", "011-005-", "011-006-", "011-009-", "011-20221125-"],
  },
  // 分類 10：清潔衛生
  {
    id: "hygiene",
    slug: "cleaning-hygiene",
    en: "CLEANING & HYGIENE",
    name: "清潔衛生",
    desc: "感應給皂機、擦鞋機，維護公共空間衛生。",
    prefixes: ["011-001-", "011-003-"],
  },
  // 分類 11：傘架・傘桶
  {
    id: "umbrella",
    slug: "umbrella-stands",
    en: "UMBRELLA STANDS",
    name: "傘架・傘桶",
    desc: "鋁合金摺疊傘架與不鏽鋼傘桶，保持入口乾爽。",
    prefixes: ["016-"],
  },
  // 分類 12：推車・工具車
  {
    id: "cart",
    slug: "carts-tool-carts",
    en: "CARTS & TOOL CARTS",
    name: "推車・工具車",
    desc: "房務整備車、手推車、工具車與不鏽鋼工作桌。",
    prefixes: ["013-", "011-007-", "011-008-"],
  },
  // 分類 13：鑰匙箱
  {
    id: "key",
    slug: "key-boxes",
    en: "KEY BOXES",
    name: "鑰匙箱",
    desc: "防鏽鋼板鑰匙箱，20～120 支容量。",
    prefixes: ["012-008-", "012-009-", "012-01"],
  },
];

// 產品圖片所在資料夾：專案根目錄/public/images
const IMAGE_DIR = path.join(process.cwd(), "public", "images");
// 判斷是否為圖片檔的規則：副檔名為 png、jpg、jpeg 或 webp（不分大小寫）
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

// 列出資料夾（含所有子資料夾）內的圖片，回傳網址清單
function listImages(dir: string, urlBase: string): string[] {
  // 讀取資料夾內容，逐一處理每個項目並攤平成一個陣列
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    // 如果是子資料夾，就往下一層繼續找（遞迴）
    if (entry.isDirectory()) return listImages(path.join(dir, entry.name), `${urlBase}/${entry.name}`);
    // 如果是圖片檔就回傳它的網址，否則略過
    return IMAGE_EXT.test(entry.name) ? [`${urlBase}/${entry.name}`] : [];
  });
}

// 從網址取出檔名（最後一個「/」之後的文字）
function fileName(url: string) {
  // 回傳最後一個斜線後面的部分
  return url.slice(url.lastIndexOf("/") + 1);
}

// 把產品照轉成品項；categorySlug 為所屬分類網址代號，fallbackName 為未登錄產品的顯示名稱
function toItem(url: string, categorySlug: string, fallbackName: string): CatalogItem {
  // 檔名去掉副檔名，作為品項編號
  const code = fileName(url).replace(IMAGE_EXT, "");
  // 已登錄產品（以照片比對）
  const detail = productByImage(url);
  // 網址代號：已登錄用型號代號，否則用小寫檔名
  const slug = detail?.slug ?? code.toLowerCase();
  return { slug, code, image: url, href: `/products/${categorySlug}/${slug}`, name: detail?.name ?? fallbackName, detail };
}

// 取得產品目錄：回傳各分類與特價商品
export function getCatalog() {
  // 取得 public/images 底下所有圖片網址
  const all = listImages(IMAGE_DIR, "/images")
    .filter((url) => url.split("/").length > 3) // 只取子資料夾內的產品照，排除 LOGO
    // 依檔名排序，讓順序固定
    .sort();

  // 依分類定義，把檔名符合開頭規則的圖片放進各分類
  const categories: Category[] = categoryDefs.map(({ prefixes, ...rest }) => {
    // 篩選出檔名開頭符合任一規則的圖片
    const images = all.filter((url) => prefixes.some((p) => fileName(url).startsWith(p)));
    // 保留分類的 id、名稱、說明，並把每張圖片轉成品項
    return { ...rest, images, items: images.map((url) => toItem(url, rest.slug, rest.name)) };
  });

  // 特價商品：檔名以 onsale- 開頭的圖片
  const onsale = all
    .filter((url) => fileName(url).startsWith("onsale-"))
    .map((url) => toItem(url, ONSALE.slug, ONSALE.name));

  // 回傳有圖片的分類（空分類不顯示）與特價商品
  return { categories: categories.filter((c) => c.images.length > 0), onsale };
}

// 依網址代號取得單一分類（找不到回傳 undefined）
export function getCategory(slug: string) {
  return getCatalog().categories.find((c) => c.slug === slug);
}

// 依網址取得單一品項，連同所屬列表（同分類的品項）；找不到回傳 undefined
export function getItem(categorySlug: string, slug: string) {
  const { categories, onsale } = getCatalog();
  // 一般分類的列表在分類頁；特價商品沒有分類頁，列表在首頁
  const cat = categories.find((c) => c.slug === categorySlug);
  const list = cat
    ? { slug: cat.slug, en: cat.en, name: cat.name, desc: cat.desc, listHref: `/products/${cat.slug}`, items: cat.items }
    : categorySlug === ONSALE.slug
      ? { ...ONSALE, items: onsale }
      : undefined;
  if (!list) return undefined;
  // 品項在列表中的位置（上一項／下一項用）
  const index = list.items.findIndex((i) => i.slug === slug);
  if (index < 0) return undefined;
  return { item: list.items[index], index, list };
}

// 全部品項的網址參數（建置時產生每個品項頁）
export function allItemParams() {
  const { categories, onsale } = getCatalog();
  return [...categories.flatMap((c) => c.items), ...onsale].map((i) => {
    // href 格式為 /products/<分類>/<slug>
    const [, , category, slug] = i.href.split("/");
    return { category, slug };
  });
}
