// 站內搜尋索引（/search-index.json）：頁首放大鏡第一次打開時才載入，建置時產生靜態檔
import { getSearchIndex } from "../lib/search";

// 建置時產生一次，不需每次請求重新讀取資料夾
export const dynamic = "force-static";

export function GET() {
  return Response.json(getSearchIndex());
}
