// 匯入客戶實拍案例照片：從原始資料夾壓縮後放進 public/cases/<案例 slug>/01.jpg…
// 執行：npx tsx scripts/import-cases.mts（可重複執行，每次會先清空該案例資料夾）
// 處理：依 EXIF 轉正、長邊最大 1920px、JPEG 品質 80、不保留拍攝資訊（含 GPS）
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// 原始照片資料夾（不會修改裡面的檔案）
const SOURCE = "C:/Users/user/Desktop/世紘興業實拍案例_原始圖片";
// 輸出資料夾
const OUT = path.join(process.cwd(), "public", "cases");
// 不放上網站的照片：手寫出貨單（含收件資訊）
const EXCLUDE = new Set(["01_image55.png"]);
// 原始檔方向錯誤、EXIF 也沒有記錄的照片：額外旋轉的角度（順時針）
const ROTATE: Record<string, number> = { "01_image5.jpeg": 90 };
// 需要模糊的區塊（箱子、棧板上的出貨單，含收件人與電話）：[左, 上, 寬, 高]，以縮圖後的像素計
const BLUR: Record<string, [number, number, number, number][]> = {
  "03_image52.jpg": [[900, 830, 380, 360]],
  "01_image53.jpg": [[590, 280, 330, 150], [970, 450, 150, 300]],
  "02_image54.jpg": [[270, 340, 230, 400], [920, 360, 140, 350]],
};

// 案例 → 來源：資料夾編號（整個資料夾）或「資料夾編號/檔名」（單張）；依這個順序編號
const sources: Record<string, string[]> = {
  "chihai-cultural-park": ["01", "02", "07", "08"],
  "zhulinshan-guanyin-temple": ["11", "12", "13", "05/02_image16.jpg", "05/03_image17.jpg"],
  "tainan-tiantan-temple": ["14"],
  "kham-art-ntsec": ["09", "10"],
  "lienchiang-meishi-arts-center": ["15", "16", "17"],
  "xiaomi-store": ["18", "19", "20"],
  "tsg-hawks": ["21", "22"],
  "barrier-printing-portfolio": ["03", "04", "06", "05/01_image15.jpg"],
};

// 依資料夾編號找到原始資料夾（例如 "05" → "05_出貨竹林山觀音寺&…"）
const folders = fs.readdirSync(SOURCE);
function folderOf(num: string) {
  const dir = folders.find((d) => d.startsWith(`${num}_`));
  if (!dir) throw new Error(`找不到資料夾 ${num}`);
  return path.join(SOURCE, dir);
}

// 把來源清單展開成原始檔案路徑（整個資料夾依檔名排序）
function expand(list: string[]) {
  return list.flatMap((s) => {
    const [num, file] = s.split("/");
    const dir = folderOf(num);
    const files = file ? [file] : fs.readdirSync(dir).sort();
    return files.filter((f) => !EXCLUDE.has(f)).map((f) => path.join(dir, f));
  });
}

for (const [slug, list] of Object.entries(sources)) {
  // 先清空該案例資料夾，避免重複執行留下舊檔
  const dir = path.join(OUT, slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  // 依序壓縮並輸出為 01.jpg、02.jpg…
  for (const [i, src] of expand(list).entries()) {
    const name = `${String(i + 1).padStart(2, "0")}.jpg`;
    // 先依 EXIF 轉正，再套用手動旋轉（兩次旋轉要分開處理，sharp 一條管線只能 rotate 一次）
    const upright = await sharp(src).rotate().toBuffer();
    const sized = await sharp(upright)
      .rotate(ROTATE[path.basename(src)] ?? 0)
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .toBuffer();
    // 模糊出貨單：把每個區塊裁下來模糊後貼回原位
    const patches = await Promise.all(
      (BLUR[path.basename(src)] ?? []).map(async ([left, top, width, height]) => ({
        input: await sharp(sized).extract({ left, top, width, height }).blur(18).toBuffer(),
        left,
        top,
      })),
    );
    const info = await sharp(sized).composite(patches).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(dir, name));
    console.log(`${slug}/${name} ${info.width}x${info.height} ← ${path.relative(SOURCE, src)}`);
  }
}
