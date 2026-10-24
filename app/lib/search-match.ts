// 站內搜尋的比對邏輯（不讀檔案，瀏覽器端與伺服器端共用）

// 搜尋結果的類型；依此順序排列
export const SEARCH_KINDS = ["產品系列", "產品", "服務", "適用場域", "客戶案例", "商品"] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];

// 單一可搜尋項目
export type SearchEntry = {
  // 類型
  kind: SearchKind;
  // 標題
  title: string;
  // 連結
  href: string;
  // 簡短說明（選填）
  desc?: string;
  // 縮圖（選填）
  image?: string;
  // 比對用文字（標題以外的關鍵字，已轉小寫）
  text: string;
};

// 正規化：轉小寫、去除空白與常見分隔符號，讓「RS A4」「rs-a4」「紅龍 柱」都比對得到
export function normalize(s: string) {
  return s.toLowerCase().replace(/[\s\-_・·、，,／/｜|()（）]+/g, "");
}

// 搜尋：關鍵字以空白分隔，每個詞都要出現；標題命中的排前面，再依類型排序
export function searchEntries(entries: SearchEntry[], query: string) {
  // 拆成多個關鍵字
  const terms = query.trim().split(/\s+/).map(normalize).filter(Boolean);
  if (!terms.length) return [];
  return entries
    .map((e) => {
      const title = normalize(e.title);
      const all = title + normalize(e.text);
      // 有任一關鍵字找不到就排除
      if (!terms.every((t) => all.includes(t))) return null;
      // 分數：標題完全相同 > 標題包含 > 只在內文
      const score = terms.reduce((s, t) => s + (title === t ? 3 : title.includes(t) ? 2 : 0), 0);
      return { e, score };
    })
    .filter((r): r is { e: SearchEntry; score: number } => r !== null)
    .sort((a, b) => SEARCH_KINDS.indexOf(a.e.kind) - SEARCH_KINDS.indexOf(b.e.kind) || b.score - a.score)
    .map((r) => r.e);
}
