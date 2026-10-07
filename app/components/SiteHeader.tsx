const links = [
  { href: "#products", label: "產品分類" },
  { href: "#onsale", label: "特價商品" },
  { href: "#contact", label: "聯絡我們" },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 text-lg font-bold tracking-wide">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-400 text-white shadow-md shadow-red-500/30">
        晶
      </span>
      <span>
        <span className="text-red-600">晶序</span>空間設備
      </span>
    </a>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-4 z-30 mx-auto mt-4 w-[calc(100%-2rem)] max-w-6xl rounded-2xl border border-white/60 bg-white/40 shadow-lg shadow-slate-900/5 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-3">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-red-600">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-5 py-2 text-white shadow-md shadow-red-500/30 transition hover:-translate-y-0.5"
          >
            免費報價
          </a>
        </nav>

        {/* 手機選單 */}
        <details className="group md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-white/70 bg-white/50 [&::-webkit-details-marker]:hidden">
            <span className="text-xl group-open:hidden">☰</span>
            <span className="hidden text-xl group-open:inline">✕</span>
          </summary>
          <nav className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-xl backdrop-blur-xl">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-xl px-4 py-3 hover:bg-white/80">
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3 text-center text-white"
            >
              免費報價
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
