// 品牌故事版型：「關於世紘」與「世紘優勢」共用
// 版面：頁首大圖 → 置中引言 → 圖文左右交錯的段落（底色深淺交替） → 滿版圖片收尾宣言 → 三張延伸閱讀圖卡
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "./Breadcrumbs";
// 匯入麵包屑型別
import type { Crumb } from "../lib/site";
// 匯入共用樣式
import { container, pageTop } from "../lib/ui";

// 單一段落：英文小標、標題、內文、圖片，以及可省略的重點清單與連結
export type Story = {
  en: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  points?: string[];
  href?: string;
  cta?: string;
};

// 延伸閱讀圖卡
export type StoryLink = { href: string; label: string; image: string; alt: string };

// 紅框紅字的小按鈕（與 outlineBtn 同樣式，留白較小，放在段落與圖卡內）
const smallBtn =
  "inline-flex items-center justify-center gap-2 border border-brand-deep px-6 py-2.5 text-xs tracking-[0.2em] text-brand-deep transition hover:bg-brand-deep hover:text-white";

// 頁首：麵包屑＋圓角大圖，標題壓在圖片左下角
export function StoryHero({ crumbs, eyebrow, title, subtitle, image, alt }: { crumbs: Crumb[]; eyebrow: string; title: string; subtitle: string; image: string; alt: string }) {
  return (
    <section className={`${pageTop} pb-16 sm:pb-20`}>
      <div className={container}>
        <Breadcrumbs items={crumbs} />
        {/* 大圖：手機 4:5、平板 16:9、電腦 21:9 */}
        <div className="relative mt-8 aspect-[4/5] overflow-hidden rounded-[18px] shadow-[0_0_0_1px_rgba(15,15,14,.06)] sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image src={image} alt={alt} fill preload sizes="(min-width: 1440px) 1344px, 100vw" className="object-cover" />
          {/* 下方漸層，讓白字清楚 */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
            {/* 小標籤（白色膠囊，與原頁首相同） */}
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs tracking-[0.2em] text-brand-deep">
              <span aria-hidden="true">→</span>
              {eyebrow}
            </p>
            <h1 className="mt-5 text-[34px] leading-[1.25] tracking-[0.08em] text-white sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 tracking-[0.06em] text-white/85 sm:text-base">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 引言：窄欄置中；上方一行刪除線小字、下方一句大標，再接數段內文
export function StoryIntro({ strike, statement, paragraphs }: { strike: string; statement: string; paragraphs: string[] }) {
  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className={`${container} max-w-3xl`}>
        <p className="text-sm tracking-[0.12em] text-muted line-through decoration-brand/60">{strike}</p>
        <h2 className="mt-3 text-2xl leading-snug tracking-[0.12em] text-balance text-brand sm:text-3xl">{statement}</h2>
        <div className="mt-8 space-y-5 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-9">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

// 圖文交錯段落：奇數列圖左文右、偶數列圖右文左；底色暖白與白色交替
export function StoryRows({ stories }: { stories: Story[] }) {
  return (
    <>
      {stories.map((s, i) => {
        // 偶數列（第 2、4、6…段）圖片放右邊
        const flip = i % 2 === 1;
        return (
          <section key={s.title} className={`border-t border-line py-16 sm:py-24 ${flip ? "bg-white" : "bg-paper"}`}>
            <div className={`${container} grid items-center gap-10 lg:grid-cols-12 lg:gap-16`}>
              {/* 圖片：圓角、細框；滑鼠移上微微放大 */}
              <div className={`group relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_0_0_1px_rgba(15,15,14,.06)] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              {/* 文字 */}
              <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                {/* 英文小標 */}
                <p className="text-xs tracking-[0.35em] text-brand-deep">{s.en}</p>
                <h2 className="mt-4 text-2xl tracking-[0.12em] text-brand sm:text-3xl">{s.title}</h2>
                <p className="mt-5 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{s.body}</p>
                {/* 重點清單：細線分隔 */}
                {s.points && (
                  <ul className="mt-6 border-t border-line">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3 border-b border-line py-3 text-sm leading-7 text-ink">
                        <span aria-hidden="true" className="text-brand">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {s.href && s.cta && (
                  <Link href={s.href} className={`${smallBtn} mt-8`}>
                    {s.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

// 收尾宣言：滿版圖片＋深色遮罩，白字置中
export function StoryBand({ image, alt, lines }: { image: string; alt: string; lines: string[] }) {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src={image} alt={alt} fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />
      <div className={`${container} flex min-h-[360px] items-center justify-center py-20 text-center sm:min-h-[440px]`}>
        <div className="max-w-3xl space-y-2 text-lg leading-9 tracking-[0.12em] text-balance text-white sm:text-2xl sm:leading-[1.8]">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

// 延伸閱讀：三張圖卡，圖片下方置中一顆紅框按鈕
export function StoryLinks({ links }: { links: StoryLink[] }) {
  return (
    <section className="py-20 sm:py-28">
      <ul className={`${container} grid gap-10 md:grid-cols-3 md:gap-6`}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group block text-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_0_0_1px_rgba(15,15,14,.06)]">
                <Image src={l.image} alt={l.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <span className={`${smallBtn} mt-6 group-hover:bg-brand-deep group-hover:text-white`}>
                {l.label}
                <span aria-hidden="true">〉</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
