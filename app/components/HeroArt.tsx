// 主視覺：不鏽鋼欄柱與品牌紅絨繩
// 四根欄柱的水平位置（x 座標）
const posts = [170, 450, 750, 1030];
// 欄柱頂端的 y 座標
const TOP = 150;
// 地面（欄柱底座）的 y 座標
const FLOOR = 458;

// 主視覺插圖元件；className 可從外部指定尺寸
export default function HeroArt({ className = "" }: { className?: string }) {
  // 回傳 SVG 向量圖
  return (
    // 畫布大小 1200×500，視為一張圖片並提供替代文字
    <svg viewBox="0 0 1200 500" className={className} role="img" aria-label="不鏽鋼欄柱與紅絨繩">
      {/* 定義可重複使用的漸層與濾鏡 */}
      <defs>
        {/* 不鏽鋼柱身的水平漸層（暗→亮→中→暗，營造金屬光澤） */}
        <linearGradient id="brass" x1="0" x2="1" y1="0" y2="0">
          {/* 左側：深灰 */}
          <stop offset="0" stopColor="#6b6f75" />
          {/* 35% 處：高光白 */}
          <stop offset="0.35" stopColor="#f7f8fa" />
          {/* 55% 處：銀灰 */}
          <stop offset="0.55" stopColor="#b9bec5" />
          {/* 右側：深灰 */}
          <stop offset="1" stopColor="#565a60" />
        </linearGradient>
        {/* 圓球頭的放射漸層（左上亮、右下暗，呈現立體感） */}
        <radialGradient id="brass-ball" cx="0.35" cy="0.3" r="0.75">
          {/* 中心：白色高光 */}
          <stop offset="0" stopColor="#ffffff" />
          {/* 中段：銀灰 */}
          <stop offset="0.45" stopColor="#c9ced4" />
          {/* 外圈：深灰 */}
          <stop offset="1" stopColor="#5d6268" />
        </radialGradient>
        {/* 柔化濾鏡，用於地面陰影 */}
        <filter id="soft" x="-50%" y="-200%" width="200%" height="500%">
          {/* 高斯模糊，強度 6 */}
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* 地面線：淡紅色細線 */}
      <line x1="0" x2="1200" y1={FLOOR + 10} y2={FLOOR + 10} stroke="#f6d5d7" strokeWidth="1" />

      {/* 每根欄柱底下的模糊陰影 */}
      {posts.map((x) => (
        // 橢圓形陰影，深色、12% 透明度、套用柔化濾鏡
        <ellipse key={`s${x}`} cx={x} cy={FLOOR + 8} rx="95" ry="9" fill="#19110b" opacity="0.12" filter="url(#soft)" />
      ))}

      {/* 絨繩 */}
      {/* 兩兩相鄰的欄柱之間各畫一條繩子（最後一根不用） */}
      {posts.slice(0, -1).map((x, i) => {
        // 繩子起點：目前欄柱右側
        const x1 = x + 16;
        // 繩子終點：下一根欄柱左側
        const x2 = posts[i + 1] - 16;
        // 繩子掛點高度
        const y = TOP + 42;
        // 繩子曲線：從起點向下垂 150 再回到終點（二次貝茲曲線）
        const d = `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 150} ${x2} ${y}`;
        // 回傳一條繩子
        return (
          // 一組繩子圖形
          <g key={`r${x}`}>
            {/* 最底層：深紅粗線（繩子陰影） */}
            <path d={d} fill="none" stroke="#b8141e" strokeWidth="15" strokeLinecap="round" />
            {/* 中層：品牌紅（繩子本體），往上偏 2px */}
            <path d={d} fill="none" stroke="#ff3740" strokeWidth="9" strokeLinecap="round" transform="translate(0 -2)" />
            {/* 最上層：淡紅細線（繩子反光），往上偏 5px */}
            <path d={d} fill="none" stroke="#ff9096" strokeWidth="2" strokeLinecap="round" opacity="0.5" transform="translate(0 -5)" />
            {/* 繩子左端的金屬扣頭 */}
            <circle cx={x1} cy={y} r="7" fill="url(#brass-ball)" />
            {/* 繩子右端的金屬扣頭 */}
            <circle cx={x2} cy={y} r="7" fill="url(#brass-ball)" />
          </g>
        );
      })}

      {/* 欄柱 */}
      {/* 每個位置畫一根欄柱 */}
      {posts.map((x) => (
        // 一根欄柱的所有零件
        <g key={`p${x}`}>
          {/* 底座：向上隆起的弧形 */}
          <path d={`M ${x - 64} ${FLOOR} Q ${x} ${FLOOR - 40} ${x + 64} ${FLOOR} Z`} fill="url(#brass)" />
          {/* 底座底部的橢圓 */}
          <ellipse cx={x} cy={FLOOR} rx="64" ry="7" fill="url(#brass)" />
          {/* 柱身 */}
          <rect x={x - 9} y={TOP + 10} width="18" height={FLOOR - TOP - 30} fill="url(#brass)" />
          {/* 掛繩用的環扣 */}
          <rect x={x - 14} y={TOP + 32} width="28" height="20" rx="3" fill="url(#brass)" />
          {/* 柱頂的頸圈 */}
          <rect x={x - 13} y={TOP + 6} width="26" height="10" rx="2" fill="url(#brass)" />
          {/* 圓球頭 */}
          <circle cx={x} cy={TOP - 10} r="20" fill="url(#brass-ball)" />
        </g>
      ))}
    </svg>
  );
}
