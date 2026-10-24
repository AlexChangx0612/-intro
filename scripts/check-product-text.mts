// 檢查所有產品頁的文字有沒有重複：執行 npx tsx scripts/check-product-text.mts，沒有問題會印出「OK」
// 1. 說明分兩句：第一句是這個產品的規格，第二句是系列用途；第一句的規格不可在第二句再出現（例如「織帶長 200cm」出現兩次）
// 2. 說明的用途句不可和「產品特色」的任何一點相同或互相包含
// 3. 「產品特色」本身不可重複
import { autoInfo } from "../app/lib/product-auto";
import { getCatalog } from "../app/lib/products";

// 去掉空白與標點、統一異體字（銹／鏽），方便比對
const plain = (s: string) => s.replace(/銹/g, "鏽").replace(/[\s，。、；：「」（）]/g, "");
// 沒有特色、沒有用途句的產品數
let noFeatures = 0;
let noIntro = 0;

const { categories } = getCatalog();
const problems: string[] = [];
let checked = 0;
for (const c of categories) {
  for (const item of c.items) {
    if (item.detail) continue;
    const group = c.groups?.find((g) => g.items.includes(item));
    const info = autoInfo(item, c, group);
    checked++;
    const [own, ...rest] = info.description.split("。");
    const series = plain(rest.join(""));
    const where = `${c.slug}/${item.code} ${item.model}`;

    // 1. 第一句的規格詞（「、」「，」分隔，去掉「世紘＋系列＋型號」開頭）在第二句再出現
    const terms = own
      .split(/[，、]/)
      .slice(1)
      .map(plain)
      .filter((t) => t.length >= 2);
    for (const t of terms) if (series.includes(t)) problems.push(`${where}：規格「${t}」在說明裡出現兩次｜${info.description}`);

    // 2. 用途句和產品特色重複
    for (const f of info.features) {
      const pf = plain(f);
      if (series && (series.includes(pf) || pf.includes(series))) problems.push(`${where}：說明和產品特色重複「${f}」`);
    }

    // 3. 產品特色重複
    if (new Set(info.features.map(plain)).size !== info.features.length) problems.push(`${where}：產品特色有重複`);

    // 4. 產品特色重複了第一句的規格（規格詞或同一個數值）
    const numbers = own.match(/\d[\d.,]*\s*(cm|mm|kg|ml|吋|支|孔|公升|公斤)/g) ?? [];
    for (const f of info.features) {
      const pf = plain(f);
      const hit = [...terms, ...numbers.map(plain)].find((t) => pf.includes(t));
      if (hit) problems.push(`${where}：產品特色「${f}」重複了規格「${hit}」`);
    }

    if (info.features.length === 0) noFeatures++;
    if (!series) noIntro++;
  }
}
console.log(problems.length ? problems.join("\n") : `OK（檢查 ${checked} 個產品；沒有產品特色 ${noFeatures} 個、沒有用途句 ${noIntro} 個）`);
