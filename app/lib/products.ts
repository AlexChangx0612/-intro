import fs from "node:fs";
import path from "node:path";

export type Category = {
  id: string;
  name: string;
  desc: string;
  images: string[];
};

// 依照片實際內容分類；prefixes 比對 public/images 底下的檔名開頭
const categoryDefs: { id: string; name: string; desc: string; prefixes: string[] }[] = [
  {
    id: "retractable",
    name: "伸縮帶欄柱",
    desc: "萬向系列伸縮織帶紅龍柱，以及柱頭告示框、防塵蓋等配件。",
    prefixes: ["001-", "20230821-", "new-"],
  },
  {
    id: "rope",
    name: "掛繩欄柱",
    desc: "圓球頭不鏽鋼欄柱，搭配絨布繩，典雅大方。",
    prefixes: ["003-", "004-"],
  },
  {
    id: "outdoor",
    name: "室內外欄柱",
    desc: "消光黑烤漆柱身，可搭配彈力繩，室內外皆適用。",
    prefixes: ["005-", "006-"],
  },
  {
    id: "plastic",
    name: "塑膠欄柱",
    desc: "紅白警示塑膠欄柱，底座實心配重，施工與停車場常用。",
    prefixes: ["002-"],
  },
  {
    id: "barrier",
    name: "拒馬",
    desc: "烤漆與不鏽鋼拒馬，可放置廣告看板，入口管制好幫手。",
    prefixes: ["012-001-", "012-002-", "012-003-", "012-004-", "012-005-", "012-006-", "012-007-", "012-20221205-"],
  },
  {
    id: "sign",
    name: "海報架・告示牌",
    desc: "壁掛海報框、立式告示牌、壓克力公佈欄與警示立牌。",
    prefixes: ["007-", "014-", "018-", "012-20221125-"],
  },
  {
    id: "board",
    name: "佈告欄",
    desc: "雙面布面佈告欄，附輪移動方便。",
    prefixes: ["008-"],
  },
  {
    id: "display",
    name: "數位看板・燈箱",
    desc: "IPS 數位看板與 LED 發光展示架，吸睛宣傳。",
    prefixes: ["009-", "20240729-"],
  },
  {
    id: "trash",
    name: "垃圾桶・資源回收",
    desc: "不鏽鋼垃圾桶、煙灰桶、分類回收桶與分類貼紙。",
    prefixes: ["011-002-", "011-004-", "011-005-", "011-006-", "011-009-", "011-20221125-"],
  },
  {
    id: "hygiene",
    name: "清潔衛生",
    desc: "感應給皂機、擦鞋機，維護公共空間衛生。",
    prefixes: ["011-001-", "011-003-"],
  },
  {
    id: "umbrella",
    name: "傘架・傘桶",
    desc: "鋁合金摺疊傘架與不鏽鋼傘桶，保持入口乾爽。",
    prefixes: ["016-"],
  },
  {
    id: "cart",
    name: "推車・工具車",
    desc: "房務整備車、手推車、工具車與不鏽鋼工作桌。",
    prefixes: ["013-", "011-007-", "011-008-"],
  },
  {
    id: "key",
    name: "鑰匙箱",
    desc: "防鏽鋼板鑰匙箱，20～120 支容量。",
    prefixes: ["012-008-", "012-009-", "012-01"],
  },
];

const IMAGE_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

function listImages(dir: string, urlBase: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return listImages(path.join(dir, entry.name), `${urlBase}/${entry.name}`);
    return IMAGE_EXT.test(entry.name) ? [`${urlBase}/${entry.name}`] : [];
  });
}

function fileName(url: string) {
  return url.slice(url.lastIndexOf("/") + 1);
}

export function getCatalog() {
  const all = listImages(IMAGE_DIR, "/images")
    .filter((url) => url.split("/").length > 3) // 只取子資料夾內的產品照，排除 LOGO
    .sort();

  const categories: Category[] = categoryDefs.map(({ prefixes, ...rest }) => ({
    ...rest,
    images: all.filter((url) => prefixes.some((p) => fileName(url).startsWith(p))),
  }));

  const onsale = all.filter((url) => fileName(url).startsWith("onsale-"));

  return { categories: categories.filter((c) => c.images.length > 0), onsale };
}
