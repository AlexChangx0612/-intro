import Image from "next/image";
import HeroArt from "./components/HeroArt";
import ProductCatalog from "./components/ProductCatalog";
import ProductRail from "./components/ProductRail";
import SectionTitle from "./components/SectionTitle";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { getCatalog } from "./lib/products";
import { container } from "./lib/ui";

const scenes = ["銀行・郵局", "醫院・診所", "百貨商場", "機場・車站", "展覽活動", "飯店・餐廳"];

const services = [
  { title: "免費空間規劃", desc: "告訴我們場地與需求，專人為您規劃排隊動線並提供報價。" },
  { title: "企業識別客製", desc: "拒馬看板、告示牌與海報架，皆可置入貴公司的品牌視覺。" },
  { title: "台灣製造", desc: "多款欄柱與設備於台灣在地生產，品質穩定，溝通即時。" },
];

export default function Home() {
  const { categories, onsale } = getCatalog();
  const links = categories.map(({ id, name }) => ({ id, name }));
  const featureImage = (categories.find((c) => c.id === "rope") ?? categories[0])?.images[0];

  return (
    <div className="bg-white text-ink">
      <SiteHeader categories={links} />

      <main>
        {/* Hero */}
        <section className="flex min-h-[min(100svh,960px)] flex-col justify-center bg-ivory pt-16">
          <div className="flex justify-center px-4 pt-10 sm:px-8">
            <HeroArt className="w-full max-w-6xl" />
          </div>
          <div className="px-5 pt-10 pb-16 text-center sm:pb-20">
            <p className="text-[11px] tracking-[0.35em] text-muted">PUBLIC SPACE ESSENTIALS</p>
            <h1 className="mt-5 pl-[0.12em] font-serif text-3xl font-normal tracking-[0.12em] sm:text-5xl lg:text-6xl">
              秩序，是空間的禮儀
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-balance text-muted">
              紅龍柱、排隊欄柱與公共空間設備
              <br className="hidden sm:block" />
              為銀行、醫院、商場與各式場館，打造從容而有分寸的動線。
            </p>
            <a
              href="#collections"
              className="mt-10 inline-block border-b border-ink pb-1.5 text-sm tracking-[0.25em] transition hover:opacity-60"
            >
              探索系列
            </a>
          </div>
        </section>

        {/* 系列 */}
        <section id="collections" className="scroll-mt-16 py-20 sm:py-28">
          <div className={container}>
            <SectionTitle eyebrow="COLLECTIONS" title="探索系列" />
            {/* 第一個分類放大為主打（2×2），其餘 12 個剛好排滿 */}
            <div className="mt-14 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-14 lg:grid-cols-4">
              {categories.map((c, i) => (
                <a
                  key={c.id}
                  href={`#c-${c.id}`}
                  className={`group block ${i === 0 ? "col-span-2 lg:row-span-2" : ""}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-ivory">
                    <Image
                      src={c.images[0]}
                      alt={c.name}
                      fill
                      sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                      className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-5 text-center font-serif text-[15px] tracking-[0.1em]">{c.name}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 全系列商品 */}
        <section id="products" className="scroll-mt-16 border-t border-line py-20 sm:py-28">
          <div className={container}>
            <SectionTitle eyebrow="ALL PRODUCTS" title="全系列商品" desc="點擊圖片可檢視大圖。" />
            <div className="mt-14">
              <ProductCatalog categories={categories} />
            </div>
          </div>
        </section>

        {/* 適用場域 */}
        <section id="applications" className="scroll-mt-16 bg-ivory py-20 sm:py-28">
          <div className={`${container} grid items-center gap-12 lg:grid-cols-2 lg:gap-20`}>
            {featureImage && (
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src={featureImage}
                  alt="掛繩欄柱"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <SectionTitle
                align="left"
                eyebrow="APPLICATIONS"
                title="為每一個公共空間，安排秩序"
                desc="從銀行大廳到大型展覽，依場域的人流與氛圍，挑選合適的欄柱與設備。"
              />
              <ol className="mt-10 border-t border-line">
                {scenes.map((s, i) => (
                  <li key={s} className="flex items-baseline gap-6 border-b border-line py-4">
                    <span className="w-6 text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-lg tracking-[0.1em]">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 特價商品 */}
        {onsale.length > 0 && (
          <section id="onsale" className="scroll-mt-16 py-20 sm:py-28">
            <div className={container}>
              <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
                <SectionTitle align="left" eyebrow="SPECIAL OFFERS" title="特價商品" />
                <p className="text-sm text-muted">限量優惠，售完為止。</p>
              </div>
              <ProductRail images={onsale} alt="特價商品" />
            </div>
          </section>
        )}

        {/* 服務 */}
        <section className="border-t border-line py-20 sm:py-28">
          <div className={`${container} grid gap-12 md:grid-cols-3 md:gap-10`}>
            {services.map((s, i) => (
              <div key={s.title} className="text-center md:text-left">
                <p className="text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-serif text-xl font-normal tracking-[0.1em]">{s.title}</h3>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-pretty text-muted md:mx-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 聯絡 */}
        <section id="contact" className="scroll-mt-16 bg-ink py-24 text-center text-white sm:py-32">
          <div className={container}>
            <p className="text-[11px] tracking-[0.35em] text-white/60">CONTACT</p>
            <h2 className="mt-5 font-serif text-2xl font-normal tracking-[0.12em] sm:text-4xl">需要規劃空間動線嗎？</h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/70">
              告訴我們您的場地與需求，專人將為您提供免費規劃與報價。
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <a
                href="tel:0212345678"
                className="w-full max-w-60 border border-white px-8 py-4 text-sm tracking-[0.2em] transition hover:bg-white hover:text-ink sm:w-auto"
              >
                02-1234-5678
              </a>
              <a
                href="mailto:service@example.com"
                className="w-full max-w-60 bg-white px-8 py-4 text-sm tracking-[0.2em] text-ink transition hover:bg-white/85 sm:w-auto"
              >
                Email 諮詢
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter categories={links} />
    </div>
  );
}
