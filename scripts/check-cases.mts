// 檢查客戶案例資料（app/lib/cases.ts）：執行 npx tsx scripts/check-cases.mts，全部通過會印出「OK」
// 專案沒有測試框架，用這支斷言腳本確認資料與照片一致
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { cases, caseHref, getCase } from "../app/lib/cases";
import { getCatalog } from "../app/lib/products";

// 設計文件「案例與資料夾對照」表的順序
const ORDER = [
  "chihai-cultural-park",
  "zhulinshan-guanyin-temple",
  "tainan-tiantan-temple",
  "kham-art-ntsec",
  "lienchiang-meishi-arts-center",
  "xiaomi-store",
  "tsg-hawks",
  "barrier-printing-portfolio",
];
// 產品分類 slug
const categorySlugs = new Set(getCatalog().categories.map((c) => c.slug));
// 序號開頭（01、1.、1、）與日期、數量、金額字樣
const NUMBERED = /^\s*0?\d[.、・]/;
const FIGURES = /\d+\s*(年|月|件|萬|元)/;

assert.deepEqual(cases.map((c) => c.slug), ORDER, "案例數量與順序要與設計文件一致");
assert.equal(getCase("abc"), undefined, "不存在的 slug 要回傳 undefined");
assert.equal(caseHref("tsg-hawks"), "/cases/tsg-hawks");

for (const c of cases) {
  assert.equal(getCase(c.slug), c);
  // 故事三段固定的小標與標題
  assert.deepEqual(c.story.map((s) => [s.en, s.title]), [["NEEDS", "需求"], ["SOLUTION", "世紘的做法"], ["MADE IN TAIWAN", "製作與出貨"]], c.slug);

  // 照片：檔案存在、alt 不空白
  const photos = [c.cover, ...c.story.map((s) => s.photo), ...c.gallery];
  for (const p of photos) {
    assert.ok(fs.existsSync(path.join("public", p.src)), `${c.slug}：找不到 ${p.src}`);
    assert.ok(p.alt.trim().length > 0, `${c.slug}：${p.src} 缺 alt`);
  }
  // 故事與照片牆之間不重複；封面可以再出現一次（照片少的案例，例如台南天壇只有 3 張，封面會再出現在故事裡）
  const body = [...c.story.map((s) => s.photo.src), ...c.gallery.map((p) => p.src)];
  assert.equal(new Set(body).size, body.length, `${c.slug}：故事與照片牆有重複照片`);
  // 該案例資料夾的每張照片都要用到
  const files = fs.readdirSync(path.join("public", "cases", c.slug)).map((f) => `/cases/${c.slug}/${f}`);
  const used = new Set([c.cover.src, ...body]);
  assert.deepEqual(files.filter((f) => !used.has(f)), [], `${c.slug}：有照片沒用到`);
  // 封面要是橫式或正方形（16:9 大圖不會裁掉太多）
  const meta = await sharp(path.join("public", c.cover.src)).metadata();
  assert.ok((meta.width ?? 0) >= (meta.height ?? 0), `${c.slug}：封面不是橫式`);

  // 相關產品系列都存在
  assert.ok(c.related.length > 0, `${c.slug}：沒有相關產品系列`);
  for (const r of c.related) assert.ok(categorySlugs.has(r), `${c.slug}：沒有產品系列 ${r}`);

  // 文字：不空白、沒有序號、沒有日期／數量／金額
  const texts = [c.title, c.scene, c.client, c.location, c.products, c.custom, c.summary, ...c.story.map((s) => s.body)];
  for (const t of texts) {
    assert.ok(t.trim().length > 0, `${c.slug}：有空白文字欄位`);
    assert.ok(!NUMBERED.test(t), `${c.slug}：出現序號「${t}」`);
    assert.ok(!FIGURES.test(t), `${c.slug}：出現日期或數量「${t}」`);
  }
}

console.log("OK");
