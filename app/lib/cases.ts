// 場域應用資料：首頁「場域應用」輪播使用
// 目前照片為網路示意圖、非世紘實際案例，因此只標示「場域」，不標示客戶名稱
// 取得真實案例後：把照片（建議 1920×1080）放進 public/cases/，修改下方的 image、scene、title、alt，
// 並將 CaseCarousel.tsx 的標籤改回「CASE STUDIES・客戶實際案例」；
// 想增加或減少案例，直接新增或刪除一筆資料（建議至少 3 筆）

// 單一案例的資料型別
export type CaseStudy = {
  // 圖片路徑（public 底下），尺寸 1920×1080
  image: string;
  // 場域名稱（取得真實案例後可改為客戶名稱）
  scene: string;
  // 案例說明：在哪裡、用了什麼產品
  title: string;
  // 圖片替代文字（給螢幕閱讀器與搜尋引擎）
  alt: string;
};

// 目前為網路示意圖（Unsplash 免費圖庫）
export const cases: CaseStudy[] = [
  // 案例 1
  {
    image: "/cases/case-01.jpg",
    scene: "機場",
    title: "報到大廳伸縮帶排隊動線規劃",
    alt: "機場報到大廳的排隊人潮",
  },
  // 案例 2
  {
    image: "/cases/case-02.jpg",
    scene: "醫院",
    title: "掛號櫃台候位動線與告示牌",
    alt: "醫院大廳的服務櫃台與指示牌",
  },
  // 案例 3
  {
    image: "/cases/case-03.jpg",
    scene: "美術館",
    title: "展間掛繩欄柱展品保護",
    alt: "美術館彩色拱窗下的絨布掛繩欄柱",
  },
  // 案例 4
  {
    image: "/cases/case-04.jpg",
    scene: "戶外活動",
    title: "戶外鍊條欄柱人流區隔",
    alt: "夜間燈光下的不鏽鋼鍊條欄柱",
  },
  // 案例 5
  {
    image: "/cases/case-05.jpg",
    scene: "飯店",
    title: "迎賓入口金色掛繩欄柱",
    alt: "飯店旋轉門入口兩側的金色欄柱與紅色絨布掛繩",
  },
  // 案例 6
  {
    image: "/cases/case-06.jpg",
    scene: "影城",
    title: "賣店櫃台伸縮帶排隊動線",
    alt: "影城賣店櫃台前的伸縮帶欄柱排隊動線",
  },
];
