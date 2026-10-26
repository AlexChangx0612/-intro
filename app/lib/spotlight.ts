// 首頁「產品系列」標題區右側的分頁式輪播（新品上市／專員規劃／LINE 諮詢）
// 新品上市或要換內容時，改這個檔即可；分頁順序即陣列順序
import { company } from "./site";

// 一個色票：色名、色號代碼、顯示顏色
export type Swatch = { name: string; code: string; color: string };

// 產品照上織帶的位置（相對產品照寬高的百分比），換色時色塊疊在這裡
export type BeltArea = { left: number; top: number; width: number; height: number };

// 每頁共用欄位：tab／tabSub 為下方分頁標籤的兩行文字，cta 為連結文字，href 為連結網址
type SlideBase = { id: string; tab: string; tabSub: string; title: string; desc: string; cta: string; href: string };

// 三種頁面：新品（有產品照與色票）、服務、LINE 諮詢
export type SpotlightSlide =
  | (SlideBase & { kind: "product"; badge: string; model: string; image: string; imageAlt: string; belt: BeltArea; swatches: Swatch[] })
  | (SlideBase & { kind: "service"; badge: string })
  | (SlideBase & { kind: "line"; eyebrow: string });

// 輪播內容
export const spotlight: SpotlightSlide[] = [
  // 新品：RS-258WE 全白烤漆伸縮帶欄柱
  {
    kind: "product",
    id: "rs-258we",
    tab: "新品上市",
    tabSub: "RS-258WE",
    badge: "NEW 新品上市",
    model: "RS-258WE",
    title: "全白烤漆伸縮帶欄柱",
    desc: "馬卡龍色系織帶，點色票換換看：",
    cta: "查看新品介紹",
    href: "/products/retractable-belt-stanchions/rs-258we",
    image: "/images/new/new-048-001.jpg",
    imageAlt: "RS-258WE 全白烤漆伸縮帶欄柱",
    // 對應產品照右上方的織帶
    belt: { left: 54.6, top: 11.4, width: 15.2, height: 3.1 },
    // 顏色依產品色票圖取色
    swatches: [
      { name: "櫻花紫", code: "MP", color: "#c9b3e6" },
      { name: "檸檬黃", code: "MY", color: "#f3ea9b" },
      { name: "米白", code: "MW", color: "#eeeeea" },
      { name: "湖水藍", code: "MB", color: "#8fd8cf" },
      { name: "莓果粉", code: "MR", color: "#f6b7cf" },
    ],
  },
  // 服務：專員規劃動線
  {
    kind: "service",
    id: "planning",
    tab: "專員規劃",
    tabSub: "空間動線",
    badge: "SERVICE",
    title: "專員為您規劃動線",
    desc: "提供場地尺寸或平面圖，專員協助估算欄柱數量與擺放方式。",
    cta: "了解規劃服務",
    href: "/custom",
  },
  // LINE 官方帳號諮詢
  {
    kind: "line",
    id: "line",
    tab: "LINE 諮詢",
    tabSub: "一對一回覆",
    eyebrow: "LINE 官方帳號",
    title: "看到喜歡的款式？加 LINE 由專員為您服務",
    desc: "傳照片、尺寸給我們，專員直接回覆。",
    cta: "加入好友",
    href: company.line,
  },
];

// 首頁系列標籤要顯示的分類 id（照此順序；其餘系列以「全部 ○ 系列」連到下方目錄）
export const featuredCategoryIds = ["retractable", "rope", "outdoor", "barrier", "sign"];
