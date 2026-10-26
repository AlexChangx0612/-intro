# 首頁「產品系列」新品聚光燈 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把首頁「產品系列」標題區改成「左標題＋系列入口、右分頁式輪播（新品上市／免費規劃／LINE 報價）」，並替新品 RS-258WE 建立產品頁。

**Architecture:** 新品資料照既有方式登錄（產品照放 `public/images/new/`、`product-models.ts`、`product-details.ts`）。輪播內容放新資料檔 `app/lib/spotlight.ts`，由新的 client 元件 `CollectionsSpotlight.tsx` 呈現，首頁 `app/page.tsx` 用它取代原本的 `SectionTitle`＋電子目錄連結。

**Tech Stack:** Next.js 16.3.5（App Router、Turbopack）、React 19、Tailwind CSS 4、TypeScript；檢查腳本用 `npx tsx` 執行的 node:assert 腳本（專案沒有測試框架）。

**Spec:** `docs/superpowers/specs/2026-10-26-collections-spotlight-design.md`（示意稿：`.superpowers/brainstorm/2265-1793017195/content/collections-header-b.html` 的 B1）

## Global Constraints

- 程式註解用繁體中文，密度與周邊程式相同（每段都有一行說明）。
- 產品文字只寫圖片上看得到的事實：萬向系列、織帶長 200cm、全白烤漆柱身、可選購 5 色馬卡龍織帶、可升級彩色印刷織帶、Made in Taiwan。
- 色票（名稱與色值固定）：櫻花紫 MP `#c9b3e6`、檸檬黃 MY `#f3ea9b`、米白 MW `#eeeeea`、湖水藍 MB `#8fd8cf`、莓果粉 MR `#f6b7cf`。
- 系列數由程式計算（`categories.length`），不寫死。
- 「了解規劃服務 →」連到 `/custom`；LINE 連到 `site.line`（`app/lib/site.ts`），另開新分頁。
- 自動輪播每頁 6 秒；滑鼠移入、鍵盤聚焦時暫停；`prefers-reduced-motion: reduce` 時不自動輪播。
- 產品照顯示高度不超過原圖（608×607）；顯示高度約 240px。
- 內文字級至少 14px；文字與背景對比達 WCAG AA。LINE 綠底 `#06c755` 上的文字用 `text-ink`（白字對比不足）。
- 使用者未要求提交 git，各 Task 不做 commit。
- Next.js 16 與訓練資料不同：寫元件前先讀 `node_modules/next/dist/docs/` 中 Image 與 Link 相關文件。

## Review Focus

- 鍵盤使用者：Tab 進入分頁列，左右方向鍵切換分頁；隱藏中的頁面內的連結不能被 Tab 到（用 `inert`）。→ Task 3 Step 5 驗證。
- 減少動態效果：系統開啟時，畫面停在第 1 頁且進度線不跑。→ Task 3 Step 5 驗證。
- 手機寬度 375px：不能出現水平捲軸；系列標籤可左右滑。→ Task 3 Step 5 驗證。
- 系列標籤點擊後，下方 `ProductCatalog` 要切到該系列並捲到商品區（即使 sessionStorage 記著別的系列）。→ Task 3 Step 5 驗證。
- 新品卡片連結不能 404：`spotlight.ts` 的產品網址必須對得上已登錄產品。→ Task 2 的斷言。

---

### Task 1: RS-258WE 產品頁

**Files:**
- Create: `public/images/new/new-048-001.jpg`（來源 `c:\Users\user\Desktop\圖片2.jpg`）
- Create: `public/products/rs-258we-colors.png`（來源 `c:\Users\user\Desktop\圖片3.png`；放在 `public/images` 以外，避免被當成目錄品項）
- Modify: `app/lib/product-models.ts`（`new-047-001` 那行之後）
- Modify: `app/lib/product-details.ts`（`products` 陣列最後）
- Create: `scripts/check-spotlight.mts`

**Interfaces:**
- Produces: 產品頁 `/products/retractable-belt-stanchions/rs-258we`；`getProduct("retractable-belt-stanchions", "rs-258we")` 回傳該筆資料。

- [ ] **Step 1: 寫檢查腳本（先會失敗）** `scripts/check-spotlight.mts`，開頭註解照 `check-cases.mts` 的格式，結尾印出 `OK`：

```ts
const p = getProduct("retractable-belt-stanchions", "rs-258we");
assert.ok(p, "RS-258WE 產品頁要存在");
assert.equal(p.model, "RS-258WE");
assert.deepEqual(p.images, ["/images/new/new-048-001.jpg", "/products/rs-258we-colors.png"]);
for (const src of p.images) assert.ok(fs.existsSync(path.join("public", src)), `${src} 檔案要存在`);
const cat = getCatalog().categories.find((c) => c.slug === "retractable-belt-stanchions")!;
const item = cat.items.find((i) => i.code === "new-048-001");
assert.equal(item?.href, "/products/retractable-belt-stanchions/rs-258we");
assert.ok(cat.groups!.find((g) => g.id === "universal")!.items.includes(item!), "要歸在萬向系列");
assert.ok(!getCatalog().categories.some((c) => c.items.some((i) => i.image === "/products/rs-258we-colors.png")), "色票圖不能變成目錄品項");
```

- [ ] **Step 2:** 執行 `npx tsx scripts/check-spotlight.mts`，預期失敗於「RS-258WE 產品頁要存在」。

- [ ] **Step 3: 放圖檔並登錄資料**
  - 用 sharp 轉存：`圖片2.jpg` → `new-048-001.jpg`（jpeg quality 85、mozjpeg，不縮放）；`圖片3.png` → `rs-258we-colors.png`（原樣）。
  - `product-models.ts`：`"new-048-001": ["RS-258WE", "全白烤漆柱身・馬卡龍色系織帶"]`。
  - `product-details.ts` 新增一筆：slug `rs-258we`、category `retractable-belt-stanchions`、model `RS-258WE`、name `萬向系列伸縮帶欄柱（全白烤漆柱身・馬卡龍色系織帶）`、images 同 Step 1；description 兩句（第一句規格：全白烤漆柱身、織帶長 200cm、可選購 5 色馬卡龍色系織帶；第二句用途，不可重複第一句的規格詞）；specs：型號、系列「萬向系列」、織帶長度「200cm」、柱身顏色「白色（烤漆）」、織帶顏色「櫻花紫、檸檬黃、米白、湖水藍、莓果粉（可選購）」、產地標示「Made in Taiwan」；features 用 `universal.features` 再加一點「可升級彩色印刷織帶，印上品牌圖案與文字。」。

- [ ] **Step 4:** 執行 `npx tsx scripts/check-spotlight.mts`、`npx tsx scripts/check-product-text.mts`，兩者都印出 `OK`；`curl http://localhost:3000/products/retractable-belt-stanchions/rs-258we` 回 200。

---

### Task 2: 輪播資料檔 `app/lib/spotlight.ts`

**Files:**
- Create: `app/lib/spotlight.ts`
- Modify: `scripts/check-spotlight.mts`

**Interfaces:**
- Consumes: Task 1 的產品頁網址；`site.line`。
- Produces:

```ts
export type Swatch = { name: string; code: string; color: string };
// 產品照上織帶的位置（相對產品照的百分比）
export type BeltArea = { left: number; top: number; width: number; height: number };
type SlideBase = { id: string; tab: string; tabSub: string; title: string; desc: string; cta: string; href: string };
export type SpotlightSlide =
  | (SlideBase & { kind: "product"; badge: string; model: string; image: string; imageAlt: string; belt: BeltArea; swatches: Swatch[] })
  | (SlideBase & { kind: "service"; badge: string })
  | (SlideBase & { kind: "line"; eyebrow: string });
export const spotlight: SpotlightSlide[];
// 首頁系列標籤要顯示的分類 id（照此順序）
export const featuredCategoryIds: string[];
```

- [ ] **Step 1: 在檢查腳本加斷言（先會失敗）**

```ts
assert.deepEqual(spotlight.map((s) => s.kind), ["product", "service", "line"]);
const prod = spotlight[0] as Extract<SpotlightSlide, { kind: "product" }>;
assert.equal(prod.href, "/products/retractable-belt-stanchions/rs-258we");
assert.deepEqual(prod.swatches.map((s) => s.code), ["MP", "MY", "MW", "MB", "MR"]);
assert.ok(fs.existsSync(path.join("public", prod.image)));
assert.equal(spotlight[1].href, "/custom");
assert.equal(spotlight[2].href, site.line);
const ids = getCatalog().categories.map((c) => c.id);
assert.deepEqual(featuredCategoryIds, ["retractable", "rope", "outdoor", "barrier", "sign"]);
for (const id of featuredCategoryIds) assert.ok(ids.includes(id), `分類 ${id} 要存在`);
assert.equal(new Set(spotlight.map((s) => s.id)).size, spotlight.length, "每頁 id 不可重複");
```

- [ ] **Step 2:** 執行腳本，預期因 `spotlight` 不存在而失敗。

- [ ] **Step 3: 寫 `spotlight.ts`**，文字照示意稿：
  - product：id `rs-258we`、tab `新品上市`、tabSub `RS-258WE`、badge `NEW 新品上市`、model `RS-258WE`、title `全白烤漆伸縮帶欄柱`、desc `馬卡龍色系織帶，點色票換換看：`、cta `查看新品介紹`、image `/images/new/new-048-001.jpg`、belt `{ left: 54.6, top: 11.4, width: 15.2, height: 3.1 }`、swatches 照 Global Constraints。
  - service：id `planning`、tab `免費規劃`、tabSub `空間動線`、badge `SERVICE`、title `免費空間動線規劃`、desc `提供場地尺寸或平面圖，專員協助估算欄柱數量與擺放方式。`、cta `了解規劃服務`、href `/custom`。
  - line：id `line`、tab `LINE 報價`、tabSub `一對一回覆`、eyebrow `LINE 官方帳號`、title `看到喜歡的款式？加 LINE 一對一報價`、desc `傳照片、尺寸給我們，專員直接回覆。`、cta `加入好友`、href `site.line`。
  - 檔頭註解說明：新品上市時改這個檔即可。

- [ ] **Step 4:** 執行腳本印出 `OK`；`npx tsc --noEmit -p .` 無錯誤。

---

### Task 3: `CollectionsSpotlight` 元件與首頁整合

**Files:**
- Create: `app/components/CollectionsSpotlight.tsx`（`"use client"`）
- Modify: `app/page.tsx`（`#collections` 區塊內的 `SectionTitle` 與電子目錄連結 `<p>`，約 77–86 行）

**Interfaces:**
- Consumes: `spotlight`、`featuredCategoryIds`（Task 2）；`site`；`Category`（`app/lib/products.ts`）。
- Produces: `export default function CollectionsSpotlight({ categories }: { categories: Pick<Category, "id" | "slug" | "name">[] })`。

- [ ] **Step 1: 讀文件** `node_modules/next/dist/docs/` 中 `next/image`、`next/link` 的章節，確認 props（例如 `sizes`、`preload`）。

- [ ] **Step 2: 首頁改用新元件**：`app/page.tsx` 的 `#collections` 內，把 `SectionTitle` 與「瀏覽產品電子目錄」`<p>` 換成 `<CollectionsSpotlight categories={links} />`，`ProductCatalog` 不動。`SectionTitle` 若首頁其他區塊仍使用則保留 import。

- [ ] **Step 3: 寫元件**，版面與示意稿 B1 相同：
  - 外層：`lg:grid lg:grid-cols-[1fr_1.25fr] lg:items-center gap-10 lg:gap-16`；手機上下排列。
  - 左側：`h2` 小標 COLLECTIONS／標題「產品系列」沿用 `SectionTitle align="left"` 的樣式；說明 `{categories.length} 大系列，全系列台灣製造。選擇系列瀏覽，或往下看完整目錄。`；系列標籤為 `<a href="#c-{id}">`，含 `/cutouts/{slug}.png` 小圖（`next/image`，28px）與名稱；最後一顆 `全部 {n} 系列 ↓` 連到 `#products`；保留「瀏覽產品電子目錄 →」連 `/catalog`。手機上標籤列 `flex overflow-x-auto`，桌機 `flex-wrap`。
  - 右側卡片：白底圓角、陰影；內容區固定高度（桌機約 260px、手機自動高度）；三頁疊放、淡入淡出，非目前頁加 `inert` 與 `aria-hidden`。
  - 分頁列：`role="tablist"`，三個 `role="tab"` 按鈕（`aria-selected`、`aria-controls`），每頁 `role="tabpanel"`；目前分頁上方紅色進度線用 CSS 動畫跑 6 秒，`onAnimationEnd` 換下一頁（暫停時 `animation-play-state: paused`）。左右方向鍵切換分頁並移動焦點。
  - 暫停：整張卡片 `onMouseEnter`/`onMouseLeave`、`onFocus`/`onBlur` 控制；`matchMedia("(prefers-reduced-motion: reduce)")` 為真時不自動換頁、不顯示進度動畫。
  - 新品頁：左側產品照（`next/image`，高 240px、`sizes="240px"`），照片外包一層 `relative` 容器，織帶色塊依 `belt` 百分比絕對定位，背景色為目前色票；右側 badge、`{model}` 換行 `{title}`、desc、5 個色票按鈕（`aria-label` 為色名、`aria-pressed`）、目前色名、`查看新品介紹 →` 連結。
  - 服務頁：SERVICE 標籤、標題、說明、`了解規劃服務 →`。
  - LINE 頁：背景 `#06c755`、文字 `text-ink`、白底黑字「加入好友」按鈕，`target="_blank" rel="noopener noreferrer"`。
  - 顏色只用既有 Tailwind 變數（`brand`、`brand-deep`、`ink`、`muted`、`paper`、`line`），LINE 綠用 arbitrary value。

- [ ] **Step 4:** `npx tsc --noEmit -p .`、`npm run lint`、`npx tsx scripts/check-spotlight.mts`、`npx tsx scripts/check-cases.mts`、`npx tsx scripts/check-product-text.mts` 全部通過。

- [ ] **Step 5: 瀏覽器驗證**（開發伺服器 `http://localhost:3000`，用 Playwright 截圖給使用者看）：
  - 寬 1440：版面與示意稿 B1 一致；6 秒後自動換頁；滑鼠移入時停住。
  - 點色票：織帶色塊與色名改變，色塊對齊照片上的織帶。
  - 點「海報架・告示牌」標籤：下方商品切到該系列並捲到商品區（先在目錄點過別的系列再測一次）。
  - 鍵盤：Tab 到分頁列，方向鍵可切換；隱藏頁的連結 Tab 不到。
  - 模擬 `prefers-reduced-motion: reduce`：停在第 1 頁、進度線不動。
  - 寬 375：無水平捲軸（`document.documentElement.scrollWidth === 375`），版面上下排列，標籤列可滑動。
  - 連結：新品 → 產品頁 200；免費規劃 → `/custom`；LINE → `https://lin.ee/vcMIuCv`。
