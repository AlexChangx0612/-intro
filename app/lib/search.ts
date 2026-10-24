// 站內搜尋索引：彙整產品系列、已登錄產品、全部商品照、服務頁與適用場域（伺服器端，會讀取產品圖片資料夾）
import { categoryContent } from "./category-content";
// 匯入已登錄產品
import { products } from "./product-details";
// 匯入客戶案例
import { caseHref, cases } from "./cases";
// 匯入產品分類
import { getCatalog } from "./products";
// 匯入搜尋項目型別
import type { SearchEntry } from "./search-match";
// 匯入適用場域
import { solutions } from "./solutions";

// 服務與資訊頁：標題、連結、說明與額外關鍵字
const pages: { title: string; href: string; desc: string; keywords: string }[] = [
  { title: "客製化服務", href: "/custom", desc: "欄柱、拒馬、告示牌與海報架置入企業識別，企業禮贈品。", keywords: "客製 訂製 logo 企業識別 印製 禮贈品 贈品 柱頭告示框 拒馬看板" },
  { title: "產品電子目錄", href: "/catalog", desc: "線上瀏覽與 PDF 下載。", keywords: "目錄 型錄 catalog pdf 下載 dm" },
  { title: "世紘優勢", href: "/advantages", desc: "多國專利、SGS 檢驗與台灣製造。", keywords: "優勢 專利 證書 認證 sgs reach 檢驗 報告 鹽霧 台灣製造 mit 品質" },
  { title: "免費空間規劃與報價", href: "/contact", desc: "提供場地尺寸，專員協助規劃動線與報價。", keywords: "聯絡 報價 詢價 估價 規劃 動線 電話 email line 地址 營業時間 免費" },
  { title: "客戶實際案例", href: "/cases", desc: "文化園區、寺廟、政府機關、門市與職業球團的實拍案例。", keywords: "案例 實績 實例 作品 應用 實拍" },
  { title: "關於世紘", href: "/about", desc: "專注公共與商業空間設備的台灣專業廠商。", keywords: "關於 公司 簡介 世紘興業 理念 物業管理" },
  { title: "常見問題", href: "/#faq", desc: "欄柱選擇、數量估算與採購的常見問題。", keywords: "faq 問題 問答 估算 幾支" },
];

// 建立搜尋索引
export function getSearchIndex(): SearchEntry[] {
  const { categories } = getCatalog();
  // 分類網址代號 → 分類（商品項目取分類名稱與關鍵字用）
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  // 分類的關鍵字：英文名、說明、頁面標題（含「紅龍柱」等俗稱）
  const catWords = (slug: string) => {
    const c = bySlug.get(slug);
    const content = categoryContent[slug];
    return [c?.name, c?.en, c?.desc, content?.h1, content?.title].filter(Boolean).join(" ");
  };

  return [
    // 產品系列：分類頁，含完整介紹、場所與規格選擇
    ...categories.map((c): SearchEntry => {
      const content = categoryContent[c.slug];
      return {
        kind: "產品系列",
        title: c.name,
        href: `/products/${c.slug}`,
        desc: c.desc,
        image: c.images[0],
        text: [catWords(c.slug), content?.intro, ...(content?.places ?? []), ...(content?.options ?? [])].join(" ").toLowerCase(),
      };
    }),
    // 已登錄產品：型號、規格、特色
    ...products.map((p): SearchEntry => ({
      kind: "產品",
      title: p.name,
      href: `/products/${p.category}/${p.slug}`,
      desc: p.model,
      image: p.images[0],
      text: [p.model, p.description, ...p.specs.map((s) => s.value), ...(p.features ?? []), catWords(p.category)].join(" ").toLowerCase(),
    })),
    // 服務與資訊頁
    ...pages.map((p): SearchEntry => ({ kind: "服務", title: p.title, href: p.href, desc: p.desc, text: `${p.desc} ${p.keywords}`.toLowerCase() })),
    // 適用場域
    ...solutions.map((s): SearchEntry => ({
      kind: "適用場域",
      title: s.name,
      href: `/solutions/${s.slug}`,
      desc: s.h1,
      text: [s.en, s.h1, s.intro, ...s.needs.map((n) => `${n.title} ${n.desc}`)].join(" ").toLowerCase(),
    })),
    // 客戶案例：客戶、地點、產品、客製內容與故事內文
    ...cases.map((c): SearchEntry => ({
      kind: "客戶案例",
      title: c.title,
      href: caseHref(c.slug),
      desc: c.summary,
      image: c.cover.src,
      text: [c.scene, c.client, c.location, c.products, c.custom, ...c.story.map((s) => s.body), "案例 實績"].join(" ").toLowerCase(),
    })),
    // 全部商品照：標題為產品照上的型號；已登錄產品上面已列出，不重複
    ...categories.flatMap((c) =>
      c.items
        .filter((i) => !i.detail)
        // 關鍵字：分類名稱、規格、品項編號、英文名與頁面 H1（含俗稱）
        .map((i): SearchEntry => ({ kind: "商品", title: i.model, href: i.href, desc: i.spec ?? i.name, image: i.image, text: `${i.name} ${i.spec ?? ""} ${i.code} ${c.en} ${categoryContent[c.slug]?.h1 ?? ""}`.toLowerCase() })),
    ),
  ];
}
