// 結構化資料（JSON-LD）：輸出 <script type="application/ld+json">，給搜尋引擎與 AI 理解頁面內容
// data 可傳單一物件或陣列（陣列會包成 @graph）
export default function JsonLd({ data }: { data: object | object[] }) {
  // 統一加上 @context；多筆資料用 @graph 合併成一段
  const json = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return (
    <script
      type="application/ld+json"
      // 把 < 轉成 unicode，避免內容被當成 HTML 標籤（防 XSS）
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
