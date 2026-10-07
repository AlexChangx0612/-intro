const columns = [
  {
    title: "欄柱系列",
    items: ["伸縮帶欄柱", "掛繩欄柱", "室內外欄柱", "塑膠欄柱", "拒馬"],
    href: "#products",
  },
  {
    title: "公共空間設備",
    items: ["海報架・告示牌", "數位看板・燈箱", "垃圾桶・資源回收", "傘架・傘桶", "推車・工具車"],
    href: "#products",
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto mb-6 w-[calc(100%-2rem)] max-w-6xl rounded-3xl border border-white/60 bg-white/35 px-8 pt-10 pb-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-lg font-bold">
            <span className="text-red-600">晶序</span>空間設備
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            專營紅龍柱、排隊欄柱與公共空間設備，為銀行、醫院、商場與各式活動打造有秩序、有質感的空間。
          </p>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>📞 02-1234-5678</p>
            <p>✉️ service@example.com</p>
            <p>📍 台北市信義區範例路 100 號</p>
            <p>🕘 週一至週五 09:00–18:00</p>
          </div>
        </div>

        {columns.map((c) => (
          <div key={c.title}>
            <h4 className="font-semibold">{c.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {c.items.map((i) => (
                <li key={i}>
                  <a href={c.href} className="transition hover:text-red-600">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/60 pt-5 text-xs text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} 晶序空間設備 All rights reserved.</span>
        <a href="#" className="transition hover:text-red-600">
          回到頂部 ↑
        </a>
      </div>
    </footer>
  );
}
