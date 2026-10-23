// 「世紘優勢」內容：首頁優勢區塊與 /advantages 頁共用
// 專利與檢驗報告圖檔放在 public/certificates；取自關係企業中衛聯合開發官網最大解析度的版本
// 拿到原始高解析檔案（PDF 或掃描檔）後，用同檔名覆蓋並更新下方的 width／height 即可

// 三項優勢
export const advantages = [
  // 優勢 1
  { title: "免費空間規劃", desc: "告訴我們場地與需求，專人為您規劃排隊動線並提供報價。" },
  // 優勢 2
  { title: "企業識別客製", desc: "拒馬看板、告示牌與海報架，皆可置入貴公司的品牌視覺。" },
  // 優勢 3
  { title: "全系列台灣製造", desc: "所有欄柱與設備皆於台灣在地生產，品質穩定，溝通即時。" },
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
