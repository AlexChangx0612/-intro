// 檢查首頁「產品系列」新品聚光燈與 RS-258WE 產品頁：執行 npx tsx scripts/check-spotlight.mts，全部通過會印出「OK」
// 專案沒有測試框架，用這支斷言腳本確認資料、圖片與連結一致
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getProduct } from "../app/lib/product-details";
import { getCatalog } from "../app/lib/products";
import { company } from "../app/lib/site";
import { featuredCategoryIds, spotlight, type SpotlightSlide } from "../app/lib/spotlight";

// RS-258WE 產品頁：已登錄、圖片存在
const p = getProduct("retractable-belt-stanchions", "rs-258we");
assert.ok(p, "RS-258WE 產品頁要存在");
assert.equal(p.model, "RS-258WE");
assert.deepEqual(p.images, ["/images/new/new-048-001.jpg", "/products/rs-258we-colors.png"]);
for (const src of p.images) assert.ok(fs.existsSync(path.join("public", src)), `${src} 檔案要存在`);

// 目錄：產品照連到產品頁，並歸在萬向系列
const cat = getCatalog().categories.find((c) => c.slug === "retractable-belt-stanchions")!;
const item = cat.items.find((i) => i.code === "new-048-001");
assert.equal(item?.href, "/products/retractable-belt-stanchions/rs-258we");
assert.ok(cat.groups!.find((g) => g.id === "universal")!.items.includes(item!), "要歸在萬向系列");
// 色票說明圖不能變成目錄品項
assert.ok(!getCatalog().categories.some((c) => c.items.some((i) => i.image === "/products/rs-258we-colors.png")), "色票圖不能變成目錄品項");

// 輪播資料：三頁順序、連結與色票
assert.deepEqual(spotlight.map((s) => s.kind), ["product", "service", "line"]);
assert.equal(new Set(spotlight.map((s) => s.id)).size, spotlight.length, "每頁 id 不可重複");
const prod = spotlight[0] as Extract<SpotlightSlide, { kind: "product" }>;
assert.equal(prod.href, "/products/retractable-belt-stanchions/rs-258we");
assert.deepEqual(prod.swatches.map((s) => s.code), ["MP", "MY", "MW", "MB", "MR"]);
assert.ok(fs.existsSync(path.join("public", prod.image)), "新品照片要存在");
assert.equal(spotlight[1].href, "/custom");
assert.equal(spotlight[2].href, company.line);
// 首頁系列標籤：分類都要存在
const ids = getCatalog().categories.map((c) => c.id);
assert.deepEqual(featuredCategoryIds, ["retractable", "rope", "outdoor", "barrier", "sign"]);
for (const id of featuredCategoryIds) assert.ok(ids.includes(id), `分類 ${id} 要存在`);

console.log("OK");
