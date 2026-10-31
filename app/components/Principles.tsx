// 標記為瀏覽器端元件（需要偵測捲動）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的副作用、參照與狀態 hook
import { useEffect, useRef, useState } from "react";
// 匯入數字滾動
import CountUp from "./CountUp";
// 匯入共用樣式
import { card, container, solidBtn, textLink } from "../lib/ui";

// 取得專利的國家
const patentCountries = ["台灣", "美國", "日本", "中國", "德國", "西班牙"];

// 誠信：服務的四個步驟
const steps = [
  { title: "先聽場地", body: "人流、空間尺寸、使用情境，先了解再建議。" },
  { title: "給規劃建議", body: "動線怎麼排、需要幾組，畫給你看。" },
  { title: "報價寫清楚", body: "品項、數量、客製內容、交期，一次說明。" },
  { title: "照承諾交貨", body: "答應的日期與規格，就是我們的標準。" },
];

// 織帶上的印字：重複印上 Shung 白色標誌，跟實際印刷織帶一樣
function BeltPrint({ count = 14, gap = "gap-16 pl-7" }: { count?: number; gap?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-full items-center ${gap}`}>
      {Array.from({ length: count }, (_, i) => (
        <Image key={i} src="/brand/logo-shung-white.png" alt="" width={240} height={139} className="h-[62%] w-auto max-w-none flex-none" />
      ))}
    </div>
  );
}

// 章節標籤：一小段織帶（進入畫面時拉出）＋原則名稱＋編號
function ChapterTag({ name, no, dark = false }: { name: string; no: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div data-reveal className="belt-strip belt-tag h-[30px]">
        <BeltPrint count={4} gap="gap-10 pl-4" />
      </div>
      <p className={`text-xl tracking-[0.1em] ${dark ? "text-brand" : "text-brand-deep"}`}>{name}</p>
      <p className={`font-display text-[13px] tracking-[0.25em] ${dark ? "text-white/50" : "text-muted"}`}>{no}</p>
    </div>
  );
}

// 欄柱柱身（織帶兩端的黑色柱子）
function Post({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`stanchion-post ${className}`} />;
}

// 關於頁「我們做事的三個原則」：開場織帶隨捲動拉開，三個原則各附上證據
export default function Principles() {
  // 整個區塊（設定動畫狀態用）
  const rootRef = useRef<HTMLElement>(null);
  // 開場織帶的外框與織帶本身
  const pullRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  // 拉伸試驗台的次數（從 9,980 開始，每 3 秒一次）
  const [cycles, setCycles] = useState(9980);

  useEffect(() => {
    const root = rootRef.current;
    const pull = pullRef.current;
    const belt = beltRef.current;
    if (!root || !pull || !belt || typeof IntersectionObserver === "undefined") return;
    // 系統設定「減少動態效果」時，全部直接顯示最終狀態
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 啟用動畫：尚未進入畫面的元素先隱藏（伺服器輸出與不支援 JavaScript 時直接顯示）
    root.setAttribute("data-armed", "");

    // 進入畫面 25% 時顯示
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }),
      { threshold: 0.25 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // 開場織帶：從進入畫面底部到捲過七成畫面高度之間，由左往右拉開
    const onScroll = () => {
      const r = pull.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.7)));
      belt.style.width = `calc((100% - 22px) * ${p})`;
      pull.toggleAttribute("data-done", p >= 1);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // 試驗台計數：每 3 秒（織帶拉出收回一次）加一，到 10,000 後重來
    const timer = setInterval(() => setCycles((n) => (n >= 10000 ? 9980 : n + 1)), 3000);

    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <section ref={rootRef} className="mt-40 bg-white">
      {/* 開場：標題與拉開的織帶 */}
      <div className={`${container} pt-28 pb-10`}>
        <p data-reveal className="reveal font-display text-[13px] tracking-[0.35em] text-brand-deep">OUR PRINCIPLES</p>
        <h2 data-reveal className="reveal mt-4 text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold delay-100">
          我們做事的三個原則
        </h2>
        <p data-reveal className="reveal mt-4 text-lg leading-[1.7] delay-200">
          創新、品質、誠信，每家公司都會寫。我們把證據也一起攤開。
        </p>
        <div ref={pullRef} data-pull className="relative mt-16 h-[150px]">
          <Post className="left-0" />
          <div ref={beltRef} className="belt-strip absolute top-1/2 left-[11px] h-11 w-[calc(100%-22px)] -translate-y-1/2">
            <BeltPrint />
          </div>
          <Post className="pull-end right-0" />
        </div>
      </div>

      {/* 01 創新：專利 */}
      <article className="border-t border-line py-24 sm:pt-28 sm:pb-32">
        <div className={container}>
          <ChapterTag name="創新" no="01 / 03" />
          <div className="mt-10 flex flex-wrap items-center gap-16">
            <div className="min-w-0 flex-[1_1_420px]">
              <h3 data-reveal className="reveal text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
                每一個細節，
                <br />
                都改過好幾版。
              </h3>
              <p data-reveal className="reveal mt-6 max-w-[30em] text-lg leading-[1.8] delay-100">
                公共空間的動線、展示與管理需求不斷改變。我們持續開發新產品，從結構設計到使用細節反覆改良，讓設備更好用、更耐用。
              </p>
              <p data-reveal className="reveal mt-10 flex items-baseline text-[clamp(56px,6vw,88px)] leading-none whitespace-nowrap delay-200">
                <CountUp value={String(patentCountries.length)} />
                <span className="ml-2 text-[0.32em]">國專利</span>
              </p>
              <ul data-reveal className="reveal mt-5 flex flex-wrap gap-2 delay-200">
                {patentCountries.map((c) => (
                  <li key={c} className="rounded-full bg-blush px-4 py-1.5 text-sm text-brand-deep">
                    {c}
                  </li>
                ))}
              </ul>
              <div data-reveal className="reveal mt-7 delay-300">
                <Link href="/custom" className={textLink}>
                  了解客製服務 →
                </Link>
              </div>
            </div>
            <figure data-reveal className="reveal min-w-0 flex-[1_1_420px] delay-100">
              <div className={`${card} relative mr-[6%] px-8 pt-10 pb-6`}>
                <Image src="/certificates/patent-1.jpg" alt="世紘取得的美國專利證書" width={1370} height={335} sizes="(min-width: 1024px) 45vw, 90vw" className="w-full" />
                <Image
                  src="/cutouts/retractable-belt-stanchions.png"
                  alt=""
                  width={891}
                  height={2155}
                  sizes="12vw"
                  className="absolute right-[-8%] bottom-[-10%] w-[22%] drop-shadow-[0_18px_24px_rgba(0,0,0,.2)]"
                />
              </div>
              <figcaption className="mt-3 text-[15px] text-muted">美國專利證書，專利圖上就是我們的欄柱結構</figcaption>
            </figure>
          </div>
        </div>
      </article>

      {/* 02 品質：拉伸試驗（深色底，與世紘優勢頁的織帶牆同色） */}
      <article className="bg-[#181818] py-24 text-white sm:pt-28 sm:pb-32">
        <div className={container}>
          <ChapterTag name="品質" no="02 / 03" dark />
          <div className="mt-10 flex flex-wrap items-center gap-16">
            <div className="min-w-0 flex-[1_1_420px] lg:order-2">
              <h3 data-reveal className="reveal text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
                拉一萬次，
                <br />
                還是好好的。
              </h3>
              <p data-reveal className="reveal mt-6 max-w-[30em] text-lg leading-[1.8] delay-100">
                從選材、加工到表面處理，每個環節都以長期使用為標準。這不是形容詞，是 SGS 實驗室一次一次拉出來的結果。
              </p>
              <p data-reveal className="reveal mt-10 flex items-baseline text-[clamp(56px,6vw,88px)] leading-none whitespace-nowrap delay-200">
                <CountUp value="10,000" />
                <span className="ml-2 text-[0.32em]">次</span>
              </p>
              <dl data-reveal className="reveal mt-8 grid grid-cols-3 border-t border-white/15 delay-200">
                {[
                  { k: "每次拉出", v: "900", u: "mm" },
                  { k: "測試速度", v: "20", u: "次／分" },
                  { k: "結果", v: "無損壞", u: "" },
                ].map((s) => (
                  <div key={s.k} className="pt-4 pr-3">
                    <dt className="text-sm font-medium text-white/60">{s.k}</dt>
                    <dd className="mt-1.5 text-lg sm:text-[22px]">
                      {s.v}
                      {s.u && <span className="ml-1 text-sm font-medium text-white/70">{s.u}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              <p data-reveal className="reveal mt-7 border-l-[3px] border-brand bg-white/[.06] px-5 py-4 text-base font-medium delay-300">
                <b className="mr-2 text-xl font-bold">24 小時</b>鋁材鹽霧試驗，無可見腐蝕（金屬中心）
              </p>
              <div data-reveal className="reveal mt-6 delay-300">
                <Link href="/advantages#reports" className={textLink}>
                  看專利與檢驗 →
                </Link>
              </div>
            </div>

            {/* 拉伸試驗台：織帶反覆拉出 900mm 再收回 */}
            <div data-reveal className="reveal min-w-0 flex-[1_1_420px] delay-100">
              <div className="rounded-[18px] bg-[#222] p-7 shadow-[0_0_0_1px_rgba(255,255,255,.08)]">
                <div aria-hidden="true" className="relative h-[140px]">
                  <Post className="left-0" />
                  <div className="belt-strip rig-belt absolute top-1/2 left-[11px] h-[30px] -translate-y-1/2">
                    <BeltPrint count={6} gap="gap-10 pl-4" />
                  </div>
                  <div className="rig-handle absolute top-1/2 h-[42px] w-3.5 -translate-y-1/2 rounded-[3px] bg-[linear-gradient(90deg,#555,#bbb,#555)]" />
                </div>
                <div aria-hidden="true" className="mt-1.5 ml-[11px] flex justify-between border-t border-white/15 pt-1.5 font-display text-xs text-white/45">
                  <span>0</span>
                  <span>300</span>
                  <span>600</span>
                  <span>900 mm</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <p className="text-[32px] tabular-nums">
                    {cycles.toLocaleString("en-US")}
                    <span className="ml-1.5 text-sm font-medium text-white/55">/ 10,000 次</span>
                  </p>
                  <p className="text-sm font-medium whitespace-nowrap text-[#7ad19a]">● 開合順暢</p>
                </div>
              </div>
              <Link href="/advantages#reports" className="mt-4 flex items-center gap-5 rounded-[18px] bg-white px-5 py-4 text-ink transition duration-300 hover:-translate-y-1">
                <Image src="/certificates/sgs1.jpg" alt="SGS 伸縮帶欄柱耐久測試報告" width={1000} height={1420} sizes="72px" className="w-[72px] shadow-[0_6px_16px_rgba(0,0,0,.18)]" />
                <span className="text-base leading-[1.6]">
                  SGS 伸縮帶欄柱耐久測試
                  <span className="block text-sm font-medium text-muted">拉伸 10,000 次・無可見損壞　看報告 →</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* 03 誠信：服務步驟 */}
      <article className="py-24 sm:pt-28 sm:pb-32">
        <div className={container}>
          <ChapterTag name="誠信" no="03 / 03" />
          <div className="mt-10 flex flex-wrap items-center gap-16">
            <div className="min-w-0 flex-[1_1_420px]">
              <h3 data-reveal className="reveal text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
                做得到的才答應，
                <br />
                答應的就做到。
              </h3>
              <p data-reveal className="reveal mt-6 max-w-[30em] text-lg leading-[1.8] delay-100">
                依場地與需求給規劃建議，說明清楚、承諾實在。不誇大、不隱藏。
              </p>
              <ol data-reveal className="reveal mt-9 delay-200">
                {steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[56px_1fr] border-t border-line py-[18px] last:border-b">
                    <span className="pt-0.5 font-display text-[15px] text-brand-deep">0{i + 1}</span>
                    <span>
                      <b className="text-lg">{s.title}</b>
                      <span className="mt-1 block text-base leading-[1.7] font-medium text-muted">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div data-reveal className="reveal mt-9 delay-300">
                <a href="#contact" className={solidBtn}>
                  預約專員諮詢
                </a>
              </div>
            </div>
            <figure data-reveal className="reveal min-w-0 flex-[1_1_420px] delay-100">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                <Image src="/about/specialist.jpg" alt="專員與客戶討論欄柱動線規劃圖" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-[15px] text-muted">專員依現場平面圖規劃欄柱動線</figcaption>
            </figure>
          </div>
        </div>
      </article>
    </section>
  );
}
