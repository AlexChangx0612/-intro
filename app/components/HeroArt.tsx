// 主視覺：黃銅欄柱與紅絨繩
const posts = [170, 450, 750, 1030];
const TOP = 150;
const FLOOR = 458;

export default function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 500" className={className} role="img" aria-label="黃銅欄柱與紅絨繩">
      <defs>
        <linearGradient id="brass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6e5226" />
          <stop offset="0.35" stopColor="#f3dfa8" />
          <stop offset="0.55" stopColor="#c9a35a" />
          <stop offset="1" stopColor="#5a4220" />
        </linearGradient>
        <radialGradient id="brass-ball" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="0.45" stopColor="#d9b871" />
          <stop offset="1" stopColor="#6f5023" />
        </radialGradient>
        <filter id="soft" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <line x1="0" x2="1200" y1={FLOOR + 10} y2={FLOOR + 10} stroke="#e3dfd8" strokeWidth="1" />

      {posts.map((x) => (
        <ellipse key={`s${x}`} cx={x} cy={FLOOR + 8} rx="95" ry="9" fill="#19110b" opacity="0.12" filter="url(#soft)" />
      ))}

      {/* 絨繩 */}
      {posts.slice(0, -1).map((x, i) => {
        const x1 = x + 16;
        const x2 = posts[i + 1] - 16;
        const y = TOP + 42;
        const d = `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 150} ${x2} ${y}`;
        return (
          <g key={`r${x}`}>
            <path d={d} fill="none" stroke="#7d0d1f" strokeWidth="15" strokeLinecap="round" />
            <path d={d} fill="none" stroke="#b3203a" strokeWidth="9" strokeLinecap="round" transform="translate(0 -2)" />
            <path d={d} fill="none" stroke="#e0566c" strokeWidth="2" strokeLinecap="round" opacity="0.5" transform="translate(0 -5)" />
            <circle cx={x1} cy={y} r="7" fill="url(#brass-ball)" />
            <circle cx={x2} cy={y} r="7" fill="url(#brass-ball)" />
          </g>
        );
      })}

      {/* 欄柱 */}
      {posts.map((x) => (
        <g key={`p${x}`}>
          <path d={`M ${x - 64} ${FLOOR} Q ${x} ${FLOOR - 40} ${x + 64} ${FLOOR} Z`} fill="url(#brass)" />
          <ellipse cx={x} cy={FLOOR} rx="64" ry="7" fill="url(#brass)" />
          <rect x={x - 9} y={TOP + 10} width="18" height={FLOOR - TOP - 30} fill="url(#brass)" />
          <rect x={x - 14} y={TOP + 32} width="28" height="20" rx="3" fill="url(#brass)" />
          <rect x={x - 13} y={TOP + 6} width="26" height="10" rx="2" fill="url(#brass)" />
          <circle cx={x} cy={TOP - 10} r="20" fill="url(#brass-ball)" />
        </g>
      ))}
    </svg>
  );
}
