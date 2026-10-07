import Image from "next/image";
import ProductCatalog from "./components/ProductCatalog";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { getCatalog } from "./lib/products";

const scenes = ["銀行・郵局", "醫院・診所", "百貨商場", "機場・車站", "展覽活動", "飯店・餐廳"];

export default function Home() {
  const { categories, onsale } = getCatalog();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-gradient-to-br from-rose-100 via-sky-100 to-indigo-200 font-sans text-slate-800">
      {/* 背景光暈 */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-rose-400/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[32rem] w-[32rem] rounded-full bg-sky-400/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-400/30 blur-3xl" />

      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20">
        {/* Hero */}
        <section className="grid items-center gap-10 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border border-white/70 bg-white/50 px-4 py-1 text-sm backdrop-blur">
              排隊動線・公共空間 一站購足
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              讓每一個空間
              <br />
              <span className="bg-gradient-to-r from-red-600 to-rose-400 bg-clip-text text-transparent">
                秩序又好看
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
              專營紅龍柱、排隊欄柱與各式公共空間設備，從銀行大廳到大型展覽，為您規劃流暢、安全又有質感的動線。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="rounded-full bg-gradient-to-r from-red-600 to-rose-500 px-6 py-3 font-medium text-white shadow-lg shadow-red-500/30 transition hover:-translate-y-0.5"
              >
                瀏覽產品
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/70 bg-white/50 px-6 py-3 font-medium backdrop-blur transition hover:bg-white/80"
              >
                索取報價
              </a>
            </div>
          </div>
          <div className="relative rounded-3xl border border-white/60 bg-white/30 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/70 via-transparent to-transparent" />
            <div className="relative">
              <Image
                src="/images/001/001-001-001.png"
                alt="萬向系列伸縮帶紅龍柱 RS-A4SR"
                width={750}
                height={750}
                preload
                className="mx-auto h-72 w-auto rounded-2xl object-contain"
              />
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["15+", "年經驗"],
                  ["3000+", "服務據點"],
                  ["48h", "快速出貨"],
                ].map(([n, l]) => (
                  <div key={l} className="rounded-2xl border border-white/60 bg-white/40 py-3">
                    <div className="text-2xl font-bold text-red-600">{n}</div>
                    <div className="text-xs text-slate-500">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 產品分類 */}
        <section id="products" className="scroll-mt-28 py-12">
          <h2 className="text-3xl font-bold">產品分類</h2>
          <p className="mt-2 text-slate-600">選擇分類瀏覽產品，點擊圖片可查看大圖。</p>
          <ProductCatalog categories={categories} />

          <div className="mt-10 rounded-3xl border border-white/60 bg-white/30 p-6 backdrop-blur-xl">
            <h3 className="font-semibold">適用場域</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {scenes.map((s) => (
                <span key={s} className="rounded-full bg-gradient-to-r from-white/80 to-white/40 px-4 py-2 text-sm shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 特價商品 */}
        {onsale.length > 0 && (
          <section id="onsale" className="scroll-mt-28 py-12">
            <h2 className="text-3xl font-bold">特價商品</h2>
            <p className="mt-2 text-slate-600">限量優惠，售完為止。</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {onsale.map((src) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg shadow-slate-900/5 transition hover:-translate-y-1"
                >
                  <Image
                    src={src}
                    alt="特價商品"
                    width={750}
                    height={750}
                    sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                    className="aspect-square h-auto w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 聯絡 */}
        <section
          id="contact"
          className="mt-12 scroll-mt-28 rounded-3xl border border-white/60 bg-gradient-to-br from-white/60 to-white/20 p-10 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-2xl"
        >
          <h2 className="text-3xl font-bold">需要規劃空間動線嗎？</h2>
          <p className="mt-3 text-slate-600">告訴我們您的場地與需求，專人為您提供免費規劃與報價。</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-lg sm:flex-row sm:gap-8">
            <span>📞 02-1234-5678</span>
            <span>✉️ service@example.com</span>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
