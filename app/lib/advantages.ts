// 「世紘優勢」內容：首頁優勢區塊與 /advantages 頁共用
// 專利與檢驗報告圖檔放在 public/certificates；取自關係企業中衛聯合開發官網最大解析度的版本
// 拿到原始高解析檔案（PDF 或掃描檔）後，用同檔名覆蓋並更新下方的 width／height 即可

// 三項優勢（/advantages 頁「選擇世紘，您多得到的三件事」）：圖文左右交錯
// 專員與客製的圖片為生成圖（public/about/specialist.jpg、branding-*.jpg），不是實際案例；台灣製造為產品去背圖
export type Advantage = {
  title: string;
  body: string;
  // 圖片：多張時並排；ratio 為顯示寬高比；contain 為去背圖（完整顯示、不裁切）
  images: { src: string; alt: string; ratio: string; contain?: boolean }[];
  href: string;
  cta: string;
};

export const advantages: Advantage[] = [
  // 優勢 1
  {
    title: "一位資深專員，從頭陪您到底",
    body: "熟悉全系列產品的資深專員，會先了解您的場地與人流，講解各款欄柱的材質、用途與差異，再為您規劃動線、估算欄柱與織帶數量，最後提出清楚的報價。從第一次諮詢到交貨，都由同一位專員負責。",
    images: [{ src: "/about/specialist.jpg", alt: "專員在場地平面圖上以鉛筆為客戶講解欄柱排隊動線", ratio: "16 / 9" }],
    href: "#contact",
    cta: "預約專員諮詢",
  },
  // 優勢 2
  {
    title: "企業識別客製",
    body: "織帶、拒馬看板、告示牌與海報架，都能印上貴公司的標誌與顏色，讓公共設備也成為品牌形象的一部分。",
    images: [
      { src: "/about/branding-proof.jpg", alt: "印有世紘標誌的紅色織帶捲、品牌色打樣稿與色票", ratio: "3 / 4" },
      { src: "/about/branding-stanchions.jpg", alt: "兩支黑色伸縮帶欄柱，拉開印有世紘標誌的紅色織帶", ratio: "3 / 4" },
    ],
    href: "/custom",
    cta: "了解客製服務",
  },
  // 優勢 3（{series} 由頁面換成實際的產品系列數）
  {
    title: "全系列台灣製造",
    body: "{series} 個產品系列都在台灣生產。品質穩定、溝通即時，遇到客製或急件也能快速調整，不必跨海等待。",
    images: [{ src: "/cutouts/retractable-belt-stanchions.png", alt: "世紘伸縮帶欄柱產品去背圖", ratio: "4 / 3", contain: true }],
    href: "/products",
    cta: "瀏覽產品系列",
  },
];

// 證書圖片：width／height 為原圖像素；crop 為保留的上方比例（裁掉原圖底部的倒影裝飾，1 表示不裁）
export type Certificate = { src: string; width: number; height: number; title: string; note?: string; crop?: number };

// 各國專利證書（每張圖為該國多份證書的合併圖）
export const patents: Certificate[] = [
  { src: "/certificates/patent-4.jpg", width: 1370, height: 270, title: "台灣", note: "中華民國專利證書", crop: 0.77 },
  { src: "/certificates/patent-3-2.jpg", width: 725, height: 304, title: "台灣", note: "中華民國專利證書", crop: 0.81 },
  { src: "/certificates/patent-1.jpg", width: 1370, height: 335, title: "美國", note: "United States Patent", crop: 0.79 },
  { src: "/certificates/patent-3-1.jpg", width: 500, height: 304, title: "日本", note: "実用新案登録証", crop: 0.8 },
  { src: "/certificates/patent-2-3.jpg", width: 718, height: 310, title: "中國", note: "实用新型专利证书", crop: 0.74 },
  { src: "/certificates/patent-2-2.jpg", width: 175, height: 310, title: "德國", note: "Gebrauchsmuster Urkunde", crop: 0.96 },
  { src: "/certificates/patent-2-1.jpg", width: 339, height: 310, title: "西班牙", note: "Patente / Modelo de utilidad", crop: 0.78 },
];

// 檢驗報告
export const reports: Certificate[] = [
  { src: "/certificates/sgs1.jpg", width: 1000, height: 1420, title: "SGS 伸縮帶欄柱耐久測試", note: "織帶拉伸 10,000 次，無損壞" },
  { src: "/certificates/sgs3.jpg", width: 947, height: 1420, title: "SGS 織帶 REACH 檢測（英文）", note: "138 項高關注物質 SVHC，通過" },
  { src: "/certificates/sgs2.jpg", width: 947, height: 1420, title: "SGS 織帶 REACH 檢測（中文）", note: "138 項高關注物質 SVHC，通過" },
  { src: "/certificates/certificate1.jpg", width: 1000, height: 1418, title: "金屬中心 鋁材鹽霧試驗", note: "24 小時鹽水噴霧，無可見腐蝕（1/2）" },
  { src: "/certificates/certificate2.jpg", width: 1000, height: 1420, title: "金屬中心 鋁材鹽霧試驗", note: "試驗照片（2/2）" },
];

// TÜV 萊因 REACH & SVHC 報告（多頁合併圖，橫式）
export const reach: Certificate = {
  src: "/certificates/reach-svhc.png",
  width: 1284,
  height: 704,
  title: "TÜV Rheinland REACH & SVHC 試驗報告",
  note: "欄柱、底座與看板等材料高關注物質篩檢",
  crop: 0.86,
};
