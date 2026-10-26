// 單一產品頁資料（/products/<分類>/<slug>）
// 每張產品照都有自己的介紹頁；登錄在這裡的產品會改用型號網址，並顯示規格表、特色與結構化資料（也才會被搜尋引擎收錄）
// 新增方式：照下方格式加一筆，image 填產品照檔名（public/images 底下），只填已確認的資訊，沒有的欄位省略即可
// 目前資料取自產品照上的標示（型號、系列、織帶長度、Made in Taiwan）

// 產品資料型別
export type ProductDetail = {
  // 網址代號（小寫型號），例如 rs-a4bk
  slug: string;
  // 所屬分類的網址代號
  category: string;
  // 型號
  model: string;
  // 產品名稱
  name: string;
  // 產品照網址（第一張為主圖）
  images: string[];
  // 產品說明
  description: string;
  // 規格表（只列已確認的項目）
  specs: { label: string; value: string }[];
  // 產品特色（選填）
  features?: string[];
};

// 萬向系列伸縮帶欄柱共用的說明與特色
const universal = {
  features: [
    "萬向系列：織帶可往不同方向拉出，便於排出轉折的排隊動線。",
    "柱頂內建伸縮織帶，不使用時自動收回。",
    "可搭配柱頭告示框、防塵蓋等配件。",
  ],
};

// 產品清單
export const products: ProductDetail[] = [
  {
    slug: "rs-a4sr",
    category: "retractable-belt-stanchions",
    model: "RS-A4SR",
    name: "萬向系列伸縮帶欄柱（不鏽鋼色柱身・紅色織帶）",
    images: ["/images/001/001-001-001.png"],
    description: "世紘萬向系列伸縮帶欄柱 RS-A4SR，不鏽鋼色柱身搭配紅色織帶，織帶長 400cm，適合銀行、飯店、商場等重視質感的排隊動線。",
    specs: [
      { label: "型號", value: "RS-A4SR" },
      { label: "系列", value: "萬向系列" },
      { label: "織帶長度", value: "400cm" },
      { label: "柱身顏色", value: "不鏽鋼色" },
      { label: "織帶顏色", value: "紅色" },
      { label: "產地標示", value: "Made in Taiwan" },
    ],
    ...universal,
  },
  {
    slug: "rs-a4be",
    category: "retractable-belt-stanchions",
    model: "RS-A4BE",
    name: "萬向系列伸縮帶欄柱（藍色柱身・藍色織帶）",
    images: ["/images/001/001-002-001.png"],
    description: "世紘萬向系列伸縮帶欄柱 RS-A4BE，藍色柱身搭配藍色織帶，織帶長 400cm，適合企業、機關與活動場地的排隊動線。",
    specs: [
      { label: "型號", value: "RS-A4BE" },
      { label: "系列", value: "萬向系列" },
      { label: "織帶長度", value: "400cm" },
      { label: "柱身顏色", value: "藍色" },
      { label: "織帶顏色", value: "藍色" },
      { label: "產地標示", value: "Made in Taiwan" },
    ],
    ...universal,
  },
  {
    slug: "rs-a4bk",
    category: "retractable-belt-stanchions",
    model: "RS-A4BK",
    name: "萬向系列伸縮帶欄柱（黑色柱身・黑色織帶）",
    images: ["/images/001/001-003-001.png"],
    description: "世紘萬向系列伸縮帶欄柱 RS-A4BK，黑色柱身搭配黑色織帶，織帶長 400cm，低調百搭，適合銀行、醫院、商場與各類公共空間。",
    specs: [
      { label: "型號", value: "RS-A4BK" },
      { label: "系列", value: "萬向系列" },
      { label: "織帶長度", value: "400cm" },
      { label: "柱身顏色", value: "黑色" },
      { label: "織帶顏色", value: "黑色" },
      { label: "產地標示", value: "Made in Taiwan" },
    ],
    ...universal,
  },
  {
    slug: "rs-a4yw",
    category: "retractable-belt-stanchions",
    model: "RS-A4YW",
    name: "萬向系列伸縮帶欄柱（黃色柱身・黃黑警示織帶）",
    images: ["/images/001/001-004-001.png"],
    description: "世紘萬向系列伸縮帶欄柱 RS-A4YW，黃色柱身搭配黃黑條紋警示織帶，織帶長 400cm，適合工廠、倉儲、停車場等需要醒目警示的區域。",
    specs: [
      { label: "型號", value: "RS-A4YW" },
      { label: "系列", value: "萬向系列" },
      { label: "織帶長度", value: "400cm" },
      { label: "柱身顏色", value: "黃色" },
      { label: "織帶顏色", value: "黃黑條紋" },
      { label: "產地標示", value: "Made in Taiwan" },
    ],
    ...universal,
  },
  {
    slug: "rs-a4rd",
    category: "retractable-belt-stanchions",
    model: "RS-A4RD",
    name: "萬向系列伸縮帶欄柱（紅色柱身・紅白警示織帶）",
    images: ["/images/001/001-005-001.png"],
    description: "世紘萬向系列伸縮帶欄柱 RS-A4RD，紅色柱身搭配紅白條紋警示織帶，織帶長 400cm，適合施工、維修與需要警示的臨時區隔。",
    specs: [
      { label: "型號", value: "RS-A4RD" },
      { label: "系列", value: "萬向系列" },
      { label: "織帶長度", value: "400cm" },
      { label: "柱身顏色", value: "紅色" },
      { label: "織帶顏色", value: "紅白條紋" },
      { label: "產地標示", value: "Made in Taiwan" },
    ],
    ...universal,
  },
  // 新品：全白烤漆柱身，可選購馬卡龍色系織帶（第二張圖為色票與彩印說明）
  {
    slug: "rs-258we",
    category: "retractable-belt-stanchions",
    model: "RS-258WE",
    name: "萬向系列伸縮帶欄柱（全白烤漆柱身・馬卡龍色系織帶）",
    images: ["/images/new/new-048-001.jpg", "/products/rs-258we-colors.png"],
    description: "世紘萬向系列伸縮帶欄柱 RS-258WE，全白烤漆柱身，可選購櫻花紫、檸檬黃、米白、湖水藍、莓果粉 5 色馬卡龍色系織帶，織帶長 200cm，適合重視色彩搭配的門市、展場與活動空間。",
    specs: [
      { label: "型號", value: "RS-258WE" },
      { label: "系列", value: "萬向系列" },
      { label: "織帶長度", value: "200cm" },
      { label: "柱身顏色", value: "白色（烤漆）" },
      { label: "織帶顏色", value: "櫻花紫、檸檬黃、米白、湖水藍、莓果粉（可選購）" },
      { label: "產地標示", value: "Made in Taiwan" },
    ],
    features: [...universal.features, "可升級彩色印刷織帶，印上品牌圖案與文字。"],
  },
];

// 取得單一產品
export function getProduct(category: string, slug: string) {
  return products.find((p) => p.category === category && p.slug === slug);
}

// 依產品照網址找出已登錄的產品（分類頁用來把照片連到產品頁）
export function productByImage(src: string) {
  return products.find((p) => p.images.includes(src));
}
