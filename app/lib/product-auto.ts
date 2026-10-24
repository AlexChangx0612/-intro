// 產品頁的名稱、說明、規格表與特色：未在 product-details.ts 手動登錄的品項，依產品照標示（product-models.ts 的規格說明）自動產生
// 原則：只用產品照上看得到的資訊，不自行補上尺寸、材質或價格；看不到的一律請客戶洽詢
import type { Category, CategoryGroup, CatalogItem } from "./products";

// 產品頁顯示用的資料（與 product-details.ts 的 ProductDetail 相同欄位）
export type ItemInfo = {
  name: string;
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
};

// 伸縮帶欄柱的織帶長度：依產品照左上角「織帶長」標籤（規格說明裡沒有寫）
const BELT_LENGTH: Record<string, string> = Object.fromEntries([
  ...["001", "002", "003", "004", "005", "006", "009", "010", "056", "057", "063"].map((n) => [`001-${n}-001`, "400cm"]),
  ...["007", "008", "011", "012"].map((n) => [`001-${n}-001`, "500cm"]),
  ...Array.from({ length: 55 }, (_, i) => String(i + 13).padStart(3, "0"))
    .filter((n) => !["056", "057", "063"].includes(n) && Number(n) <= 62)
    .map((n) => [`001-${n}-001`, "200cm"]),
  ...["001", "002", "003", "004"].map((n) => [`20230821-${n}-001`, "200cm"]),
  ...["001", "002", "003", "004"].map((n) => [`new-${n}-001`, "500cm"]),
]);

// 產品說明的第二句：系列的用途，一句話（依小系列或分類）
// 不寫規格範圍與品項清單，避免和這個產品自己的規格重複；也不和下方「產品特色」重複
const INTRO: Record<string, string> = {
  "four-way": "柱頭設有四個織帶扣接方向，可排出直線與直角轉折的排隊動線。",
  "eight-way": "柱頭設有八個織帶扣接方向，除了直角轉折，還能排出斜向動線。",
  universal: "柱頭可往任意方向扣接織帶，動線排法最自由。",
  "wall-mounted": "固定在牆面或柱面，拉出織帶扣到對面即可封住通道。",
  accessories: "搭配伸縮帶欄柱使用，讓欄柱同時傳遞指示與宣傳資訊。",
  "accessories-cover": "蓋在暫不使用的欄柱柱頭上，保持整齊外觀。",
  "rope-stanchions": "以掛勾連接絨布繩，造型典雅，適合迎賓與展示場合。",
  "indoor-outdoor-stanchions": "室內與戶外皆適用的區隔欄柱。",
  "plastic-stanchions": "輕巧醒目的警示欄柱，施工區與停車場常用。",
  barriers: "放置在出入口與車道，管制人車進出。",
  "poster-sign-stands": "在公共空間傳達指示、公告與宣傳資訊。",
  "bulletin-boards": "張貼公告、海報與通知的移動式佈告欄。",
  "digital-signage-lightbox": "吸引目光，展示或播放宣傳內容。",
  "waste-recycling": "兼顧整潔、分類與空間質感的公共空間垃圾桶與回收設備。",
  "cleaning-hygiene": "幫助公共空間維持清潔衛生。",
  "umbrella-stands": "放在入口處，保持室內地面乾爽、減少滑倒風險。",
  "carts-tool-carts": "搬運物品、收納清潔與維修工具。",
  "key-boxes": "集中存放與管理大量鑰匙。",
};

// 產品特色：依小系列（伸縮帶欄柱）或分類，只寫已確認的系列特性；不重複上方說明的用途句
const FEATURES: Record<string, string[]> = {
  "four-way": ["柱頂內建伸縮織帶，不使用時自動收回。", "可搭配柱頭告示框、防塵蓋等配件。"],
  "eight-way": ["部分型號為雙層織帶，上下兩條織帶區隔更明確。", "柱頂內建伸縮織帶，不使用時自動收回。"],
  universal: ["柱頂內建伸縮織帶，不使用時自動收回。", "可搭配柱頭告示框、防塵蓋等配件。"],
  "wall-mounted": ["不使用時織帶自動收回，不佔用走道空間。", "提供紅色、黑色與紅白、黃黑警示織帶。"],
  // 欄柱配件分兩種：告示框（RP、P4）與防塵蓋（RV），特色在 autoInfo 依型號挑選
  accessories: ["可放入指示、公告或企業識別等內容。"],
  "accessories-cover": ["可依欄柱款式選擇適用的尺寸與材質。"],
  "rope-stanchions": ["提供圓球頭、皇冠頭、平蓋頭等柱頭造型。", "可搭配絨布繩、壁鉤與圍幕桿等配件。"],
  "indoor-outdoor-stanchions": ["消光烤漆柱身，可搭配彈力繩或鋁合金橫桿。", "柱身顏色與繩材可依場地風格搭配。"],
  "plastic-stanchions": ["紅白、黃黑警示配色，醒目好辨認。", "塑膠材質輕巧，搬移方便。", "底座提供實心配重與空心可灌水款式。"],
  barriers: ["可放置廣告看板，看板可置入企業識別。", "提供烤漆、不鏽鋼與組裝式等款式。"],
  "poster-sign-stands": ["提供壁掛、立地、桌上等多種形式。", "可置入企業識別與客製印刷內容。"],
  "bulletin-boards": ["雙面設計，兩面皆可張貼。", "附輪，移動方便。"],
  "digital-signage-lightbox": ["提供 IPS 數位看板與 LED 發光展示架。", "適合櫃台、展場與大廳等場所。"],
  "waste-recycling": ["提供不鏽鋼、烤漆與塑膠等材質。", "可搭配分類貼紙標示回收類別。"],
  "cleaning-hygiene": ["給皂機提供壁掛式、立放式與架座式。", "適合大廳、洗手間與出入口等公共空間。"],
  "umbrella-stands": ["提供摺疊式傘架、雨傘架、傘桶與雨傘套袋機。", "可依出入口人流與空間選擇容量。"],
  "carts-tool-carts": ["提供房務整備車、手推車、工作推車與不鏽鋼製品。", "可依搬運與收納需求選擇尺寸與款式。"],
  "key-boxes": ["防鏽鋼板材質。", "容量從 20 支到 240 支。", "可依需要管理的鑰匙數量選擇容量。"],
};

// 規格說明中代表「系列」的片段（已由小系列名稱表示，不再列入規格）
const SERIES_WORDS = /^(四向系列|八向系列|掛壁式圍欄)$/;
// 材質
const MATERIAL = /^(不鏽鋼( #?304)?( 拋光)?|鋁合金|鋼鐵烤漆|防銹鋼板|原木紋|核桃木紋|鋼網黑色烤漆|鋼板黑色烤漆|黑色烤漆鐵框|烤漆鐵框|電鍍鐵框|鐵框電鍍|鋁合金框|鋁合金烤漆框|鋼管高溫粉體烤漆)$/;

// 把一段規格說明拆成「項目：內容」；回傳 null 表示這段併入「款式」
function parseSegment(seg: string): { label: string; value: string }[] | null {
  let m: RegExpMatchArray | null;
  if ((m = seg.match(/^(.+?)柱身$/))) return [{ label: "柱身顏色", value: m[1] }];
  if ((m = seg.match(/^(.+?)織帶(?:\s*(\d+cm))?$/))) return [{ label: "織帶顏色", value: m[1] }, ...(m[2] ? [{ label: "織帶長度", value: m[2] }] : [])];
  if ((m = seg.match(/^(.*?)總高\s*(.+)$/))) return [...(m[1].trim() ? [{ label: "款式", value: m[1].trim() }] : []), { label: "總高", value: m[2] }];
  // 尺寸（含 ×）先判斷，避免「長 43×寬 40cm」被當成長度
  if (/[×xX]\s*[\dH寬]|Ø|Φ/.test(seg)) return [{ label: "尺寸", value: seg }];
  // 「高」「長」後面要接數字才是尺寸（排除「高柱型」「高度可調整」「長傘袋」）
  if ((m = seg.match(/^高\s*(\d.*)$/))) return [{ label: "高度", value: m[1] }];
  if ((m = seg.match(/^(?:繩長|長)\s*(\d.*)$/))) return [{ label: "長度", value: m[1] }];
  if ((m = seg.match(/^(?:總容量|容量)\s*(.+)$/))) return [{ label: "容量", value: m[1] }];
  if ((m = seg.match(/^最大載量\s*(.+)$/))) return [{ label: "最大載量", value: m[1] }];
  if ((m = seg.match(/^(?:整組淨重|重量)\s*(.+)$/))) return [{ label: "重量", value: m[1] }];
  if ((m = seg.match(/^底座(.+)$/))) return [{ label: "底座", value: m[1].trim() }];
  if ((m = seg.match(/^通道寬度\s*(.+)$/))) return [{ label: "通道寬度", value: m[1] }];
  if ((m = seg.match(/^傘袋數量\s*(.+)$/))) return [{ label: "包裝數量", value: m[1] }];
  if ((m = seg.match(/^(.+?)（(\d+) 孔）$/))) return [{ label: "款式", value: m[1] }, { label: "孔數", value: `${m[2]} 孔` }];
  if (/吋/.test(seg)) return [{ label: "尺寸", value: seg }];
  if (seg === "EN840 認證") return [{ label: "認證", value: "EN840" }];
  if (MATERIAL.test(seg)) return [{ label: "材質", value: seg }];
  // 顏色：「黑色」「酒紅色」，以及「質感黑」「亮光銀」「消光米白」這類表面處理色
  if (/^(質感|亮光|消光|磨砂)?[一-鿿]{1,2}色$/.test(seg) || /^(質感|亮光|消光|磨砂)[一-鿿]{1,2}$/.test(seg)) return [{ label: "顏色", value: seg }];
  if ((m = seg.match(/^(A[3-5])\s*(.*)$/))) return [{ label: "尺寸", value: m[1] }, ...(m[2] ? [{ label: "款式", value: m[2] }] : [])];
  if ((m = seg.match(/^(二層|三層)$/))) return [{ label: "層數", value: m[1] }];
  return null;
}

// 把規格說明拆成規格表列（同一項目出現多次時合併）
function specRows(spec: string) {
  const rows: { label: string; value: string }[] = [];
  const add = (label: string, value: string) => {
    const row = rows.find((r) => r.label === label);
    if (row) row.value += `、${value}`;
    else rows.push({ label, value });
  };
  for (const seg of spec.split("・").map((s) => s.trim()).filter(Boolean)) {
    if (SERIES_WORDS.test(seg)) continue;
    const parsed = parseSegment(seg);
    if (parsed) for (const r of parsed) add(r.label, r.value);
    else add("款式", seg);
  }
  return rows;
}

// 比對用：統一異體字（銹／鏽）、去掉空白
const norm = (s: string) => s.replace(/銹/g, "鏽").replace(/\s/g, "");
// 這句話是否重複了產品規格已寫的內容：包含規格裡的詞（例如「伸縮帶欄柱」「防鏽鋼板」）或同一個數值（例如「240 支」）
function repeats(text: string, said: string[]) {
  const t = norm(text);
  const numbers = said.join(" ").match(/\d[\d.,]*\s*(cm|mm|kg|ml|吋|支|孔|公升|公斤)/g) ?? [];
  return said.some((w) => t.includes(norm(w))) || said.some((w) => norm(w).length >= 4 && t.includes(norm(w).slice(0, 4))) || numbers.some((n) => t.includes(norm(n)));
}

// 產生單一品項的產品頁資料
// list：所屬分類；group：所屬小系列（伸縮帶欄柱才有）
export function autoInfo(item: CatalogItem, list: Pick<Category, "slug" | "name" | "desc">, group?: CategoryGroup): ItemInfo {
  // 系列名稱與用途句；欄柱配件中的防塵蓋（RV）另用一組用途句與特色（不用系列頁的說明：那裡列有整個系列的規格範圍，會和這個產品自己的規格重複）
  const seriesName = group?.name ?? list.name;
  const kind = group?.id === "accessories" && item.model.startsWith("RV-") ? "accessories-cover" : (group?.id ?? "");
  const seriesDesc = INTRO[kind] ?? INTRO[list.slug] ?? "";
  // 規格說明
  const spec = item.spec ?? "";
  // 名稱：系列名稱（規格說明，去掉重複的系列字樣）
  const shown = spec
    .split("・")
    .filter((s) => s && !SERIES_WORDS.test(s))
    .join("・");
  const name = shown ? `${seriesName}（${shown}）` : seriesName;

  // 規格表：型號、系列，再接規格說明拆出的項目
  const specs = [
    { label: "型號", value: item.model },
    { label: "系列", value: seriesName },
    ...specRows(spec),
  ];
  // 伸縮帶欄柱補上產品照標示的織帶長度（規格說明已寫長度的不重複）
  const belt = BELT_LENGTH[item.code];
  if (belt && !specs.some((s) => s.label === "織帶長度")) {
    const at = specs.findIndex((s) => s.label === "織帶顏色");
    specs.splice(at >= 0 ? at + 1 : specs.length, 0, { label: "織帶長度", value: belt });
  }

  // 說明：世紘＋系列＋型號，接產品照上的規格說明（保留原本的寫法，讀起來較自然）與系列用途句
  const highlights = [...(shown ? shown.split("・") : []), ...(belt && !/\d+cm/.test(spec) ? [`織帶長 ${belt}`] : [])];
  // 用途句裡提到這個產品規格已經寫過的詞（例如規格已寫「伸縮帶欄柱」），就拿掉那一小句，避免重複
  const said = highlights.flatMap((h) => h.split(/\s+/)).filter((t) => t.length >= 2);
  const intro = seriesDesc
    .replace(/。$/, "")
    .split("，")
    .filter((clause) => !repeats(clause, said))
    .join("，");
  const description = `世紘${seriesName} ${item.model}${highlights.length ? `，${highlights.join("、")}` : ""}。${intro ? `${intro}。` : ""}`;

  // 特色：小系列優先，其次分類（防塵蓋另有一組，見上方 kind）
  // 和這個產品規格重複的特色不列（例如規格已寫「總容量 240 支」，就不再列「容量從 20 支到 240 支」）
  const features = (FEATURES[kind] ?? FEATURES[list.slug] ?? []).filter((f) => !repeats(f, said));

  return { name, description, specs, features };
}
