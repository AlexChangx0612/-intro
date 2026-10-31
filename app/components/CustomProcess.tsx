// 標記為瀏覽器端元件（需要偵測捲動到哪一步）
"use client";

// 匯入 React 的副作用、參照、狀態、唯一 id hook 與子元素型別
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

// 單一步驟：標題與說明
export type ProcessStep = { title: string; desc: string };

// 共用的進場緩動曲線（與 CountUp 相同）
const ease = "ease-[cubic-bezier(.16,.8,.2,1)]";

// 客製流程：電腦版左側步驟文字、右側固定的介面示意圖，捲到哪一步就切換並播放該步的動畫
// 手機版每一步文字下方直接放示意圖，捲到時播放（播過不重播）
// 伺服器輸出與系統設定「減少動態效果」時，示意圖直接顯示完成狀態
export default function CustomProcess({ steps }: { steps: ProcessStep[] }) {
  // 目前位於第幾步（以畫面中線判斷）
  const [active, setActive] = useState(0);
  // 手機版：已捲進畫面（下緣往上 25%）的最後一步，進來就播放
  const [seen, setSeen] = useState(0);
  // 是否播放動畫（掛載後且未開啟「減少動態效果」才播放）
  const [anim, setAnim] = useState(false);
  // 每一步文字區塊的 DOM
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 只看畫面正中間 10% 的範圍，碰到哪一步就切到哪一步；第一次回報時開始播放動畫
    const io = new IntersectionObserver(
      (entries) => {
        if (motion) setAnim(true);
        for (const e of entries) if (e.isIntersecting) setActive(refs.current.indexOf(e.target as HTMLLIElement));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    const enter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSeen((n) => Math.max(n, refs.current.indexOf(e.target as HTMLLIElement)));
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    refs.current.forEach((el) => {
      if (!el) return;
      io.observe(el);
      enter.observe(el);
    });
    return () => {
      io.disconnect();
      enter.disconnect();
    };
  }, []);

  return (
    <div className="mt-14 grid lg:mt-6 lg:grid-cols-[5fr_7fr] lg:gap-16 xl:gap-24">
      {/* 步驟文字：走到的步驟數字變品牌紅，還沒到的是灰色 */}
      <ol>
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex flex-col justify-center py-10 lg:min-h-[85vh] lg:py-0"
          >
            <p className={`font-display text-5xl leading-none tracking-[-0.02em] transition-colors duration-500 sm:text-6xl ${active >= i ? "text-brand" : "text-muted"}`}>
              Step {i + 1}
            </p>
            <h3 className="mt-6 text-2xl tracking-[0.1em] text-brand-deep sm:text-3xl">{s.title}</h3>
            <p className="mt-4 max-w-sm text-base leading-8 text-pretty text-ink">{s.desc}</p>
            {/* 手機、平板：示意圖接在文字下方 */}
            <div className="mt-8 lg:hidden">
              <Panel step={i} on={!anim || seen >= i} />
            </div>
          </li>
        ))}
      </ol>

      {/* 電腦：示意圖固定在畫面中間，三張疊在一起淡入淡出切換 */}
      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-svh items-center pt-20">
          <div className="relative w-full">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`transition duration-500 ${i === 0 ? "relative" : "absolute inset-0"} ${active === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <Panel step={i} on={!anim || active === i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 示意圖外框：白色標題列＋淡紅底內容區，內容依步驟切換（純裝飾，對輔助科技隱藏）
// data-ui 標示這是介面示意（設計檢查工具會把它當介面處理）
function Panel({ step, on }: { step: number; on: boolean }) {
  const label = ["客製需求單", "動線規劃", "專員服務"][step];
  return (
    <div data-ui aria-hidden="true" className="overflow-hidden rounded-[18px] bg-white">
      <p className="flex items-center gap-2.5 px-5 py-4 text-sm text-ink sm:px-7">
        <span className="size-2 rounded-full bg-brand" />
        {label}
      </p>
      <div className="bg-blush/50 p-5 sm:p-8 lg:aspect-[4/3] lg:p-10">
        {step === 0 && <RequestForm on={on} />}
        {step === 1 && <FloorPlan on={on} />}
        {step === 2 && <Chat on={on} />}
      </div>
    </div>
  );
}

// 進場：由下往上淡入，d 為延遲秒數
function Rise({ on, d = 0, className = "", children }: { on: boolean; d?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`transition duration-700 ${ease} ${on ? "" : "translate-y-3 opacity-0"} ${className}`} style={{ transitionDelay: on ? `${d}s` : "0s" }}>
      {children}
    </div>
  );
}

// 打字效果：文字由左往右逐漸露出
function Type({ on, d, children }: { on: boolean; d: number; children: ReactNode }) {
  return (
    <span
      className="inline-block transition-[clip-path] duration-[900ms] ease-linear"
      style={{ clipPath: on ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transitionDelay: on ? `${d}s` : "0s" }}
    >
      {children}
    </span>
  );
}

// 打勾圖示
function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

// 步驟一：需求單逐欄填寫、上傳企業標誌、送出
function RequestForm({ on }: { on: boolean }) {
  const fields = [
    { k: "場地", v: "大樓入口大廳" },
    { k: "用途", v: "排隊動線・品牌識別" },
    { k: "品項與數量", v: "伸縮帶欄柱 × 12" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-3 sm:gap-4">
      {fields.map((f, i) => (
        <Rise key={f.k} on={on} d={0.1 + i * 0.5} className="rounded-xl bg-white px-4 py-3 sm:px-5 sm:py-4">
          <p className="text-xs tracking-[0.15em] text-muted">{f.k}</p>
          <p className="mt-1 text-sm text-ink sm:text-base">
            <Type on={on} d={0.35 + i * 0.5}>
              {f.v}
            </Type>
          </p>
        </Rise>
      ))}
      {/* 上傳企業標誌：進度條跑完後打勾 */}
      <Rise on={on} d={1.7} className="flex items-center gap-4 rounded-xl border border-dashed border-brand/50 bg-white/70 px-4 py-3 sm:px-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-deep font-display text-[11px] tracking-wider text-white">LOGO</span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-between text-sm text-ink">
            company-logo.ai
            <span className={`flex items-center gap-1 text-xs text-brand-deep transition duration-500 ${on ? "" : "opacity-0"}`} style={{ transitionDelay: on ? "2.9s" : "0s" }}>
              <Check className="size-3.5" />
              已上傳
            </span>
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
            <div className={`h-full origin-left bg-brand-deep transition-transform duration-[1000ms] ease-out ${on ? "" : "scale-x-0"}`} style={{ transitionDelay: on ? "1.9s" : "0s" }} />
          </div>
        </div>
      </Rise>
      <Rise on={on} d={3.1} className="flex justify-end">
        <span className="inline-flex items-center bg-brand-deep px-6 py-2.5 text-sm tracking-[0.2em] text-white">送出需求 →</span>
      </Rise>
    </div>
  );
}

// 步驟二：平面圖上欄柱依序出現、織帶連起來，再畫出排隊動線；下方逐項確認
function FloorPlan({ on }: { on: boolean }) {
  // 遮罩 id（同一頁有多張示意圖，需各自不同）
  const mask = useId();
  // 兩條織帶上的欄柱位置
  const posts = [
    [80, 100], [173, 100], [267, 100], [360, 100],
    [40, 170], [120, 170], [200, 170], [280, 170],
  ];
  // 排隊動線：入口 → 繞過兩條織帶 → 櫃台
  const route = "M24 215 H300 Q330 215 330 190 V150 Q330 135 310 135 H45 Q22 135 22 115 V72 Q22 55 40 55 H290";
  const t = (d: number) => ({ transitionDelay: on ? `${d}s` : "0s" });
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <svg viewBox="0 0 400 260" className="w-full rounded-xl bg-white">
        <defs>
          <mask id={mask}>
            <path d={route} pathLength={1} fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="1" className="transition-[stroke-dashoffset] duration-[1600ms] ease-in-out" style={{ strokeDashoffset: on ? 0 : 1, ...t(1.8) }} />
          </mask>
        </defs>
        {/* 牆面、入口缺口、櫃台 */}
        <path d="M10 196 V10 H390 V250 H10 V234" fill="none" stroke="#1f1f1f" strokeOpacity=".25" strokeWidth="2" />
        <text x="34" y="207" fontSize="11" fill="#666">入口</text>
        <rect x="300" y="28" width="76" height="26" rx="4" fill="#f6f4f0" stroke="#1f1f1f" strokeOpacity=".2" />
        <text x="338" y="45" fontSize="11" fill="#666" textAnchor="middle">櫃台</text>
        {/* 織帶 */}
        {["M80 100 H360", "M40 170 H280"].map((d, i) => (
          <path key={d} d={d} pathLength={1} fill="none" stroke="#d61f2a" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="1" className="transition-[stroke-dashoffset] duration-700 ease-out" style={{ strokeDashoffset: on ? 0 : 1, ...t(0.9 + i * 0.3) }} />
        ))}
        {/* 欄柱 */}
        {posts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" fill="#fff" stroke="#1f1f1f" strokeWidth="2.5" className={`transition duration-500 ${ease}`} style={{ transformOrigin: `${x}px ${y}px`, opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.5)", ...t(0.1 + i * 0.08) }} />
        ))}
        {/* 柱頭告示框：置入企業標誌 */}
        <g className={`transition duration-500 ${ease}`} style={{ transformOrigin: "80px 92px", opacity: on ? 1 : 0, transform: on ? "scale(1)" : "scale(.5)", ...t(1.5) }}>
          <rect x="58" y="68" width="44" height="22" rx="3" fill="#d61f2a" />
          <text x="80" y="83" fontSize="10" fill="#fff" textAnchor="middle" letterSpacing="1">LOGO</text>
        </g>
        {/* 排隊動線（虛線，以遮罩逐段畫出） */}
        <g mask={`url(#${mask})`}>
          <path d={route} fill="none" stroke="#ff3740" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M282 49 L292 55 L282 61" fill="none" stroke="#ff3740" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      {/* 確認項目 */}
      <div className="flex flex-wrap gap-2">
        {["動線規劃", "客製內容", "可行性", "交期"].map((c, i) => (
          <Rise key={c} on={on} d={3.2 + i * 0.25} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs tracking-[0.1em] text-ink">
            <Check className="size-3.5 text-brand-deep" />
            {c}
          </Rise>
        ))}
      </div>
    </div>
  );
}

// 步驟三：與專員的對話，訊息依序跳出
function Chat({ on }: { on: boolean }) {
  // 專員訊息靠左白底、客戶訊息靠右紅底
  const bubble = "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6";
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Rise on={on} d={0.1} className="mb-2 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-brand-deep text-sm text-white">世</span>
        <span>
          <span className="block text-sm text-ink">世紘專員</span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="size-1.5 rounded-full bg-[#2fb36b]" />
            線上服務中
          </span>
        </span>
      </Rise>
      <Rise on={on} d={0.5} className={`${bubble} self-start rounded-tl-sm bg-white text-ink`}>
        您好，規劃已整理好，請您確認。
      </Rise>
      <Rise on={on} d={1.1} className="flex w-[80%] items-center gap-3 self-start rounded-xl bg-white p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blush font-display text-[10px] tracking-wider text-brand-deep">PDF</span>
        <span className="min-w-0">
          <span className="block truncate text-sm text-ink">客製規劃確認單.pdf</span>
          <span className="text-xs text-muted">動線圖・客製內容・交期</span>
        </span>
      </Rise>
      <Rise on={on} d={1.9} className={`${bubble} self-end rounded-tr-sm bg-brand-deep text-white`}>
        確認沒問題，就照這個方案！
      </Rise>
      <Rise on={on} d={2.6} className={`${bubble} self-start rounded-tl-sm bg-white text-ink`}>
        收到，後續由我一對一為您服務。
      </Rise>
      <Rise on={on} d={3.2} className="mt-1 flex items-center justify-center gap-2 text-xs tracking-[0.2em] text-brand-deep">
        <Check />
        需求已確認，專員服務中
      </Rise>
    </div>
  );
}
