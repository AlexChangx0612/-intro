// 客製織帶牆：世紘歷年承接的 61 款客製伸縮帶印刷圖樣，一列一條慢慢橫向捲動
// 圖檔 public/belts/belt-wall.webp：8 列拼成一張（每列高 40px、寬 13698px），取自「歷年織帶印刷檔案.pptx」
// 滑鼠移上暫停；系統設定「減少動態效果」時不捲動（動畫與暫停寫在 globals.css 的 .belt-wall）

// 每一列：起始位置（px）、方向、速度（秒）；列的順序即圖檔中的第幾列
const ROWS = [
  { x: 0, reverse: false, duration: 260 },
  { x: -4200, reverse: true, duration: 260 },
  { x: -1800, reverse: false, duration: 300 },
  { x: -6500, reverse: true, duration: 230 },
  { x: -900, reverse: false, duration: 280 },
  { x: -3300, reverse: true, duration: 260 },
  { x: -7700, reverse: false, duration: 240 },
  { x: -2500, reverse: true, duration: 290 },
];

// rows：要顯示圖檔中的哪幾列（預設全部 8 列）
export default function BeltWall({ rows = [0, 1, 2, 3, 4, 5, 6, 7], label }: { rows?: number[]; label: string }) {
  return (
    <div role="img" aria-label={label} className="belt-wall flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r} className="h-10 overflow-hidden">
          <div
            className="belt-track"
            style={{
              backgroundPosition: `${ROWS[r].x}px ${-40 * r}px`,
              animationDirection: ROWS[r].reverse ? "reverse" : "normal",
              animationDuration: `${ROWS[r].duration}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
