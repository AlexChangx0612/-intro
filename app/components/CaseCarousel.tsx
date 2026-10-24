// 標記為瀏覽器端元件（需要逐格計算卡片位置、處理拖曳與進場動畫）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 Next.js 換頁（點擊卡片進入案例頁）
import { useRouter } from "next/navigation";
// 匯入 React 的 hook：副作用、DOM 參照
import { useEffect, useRef } from "react";
// 匯入案例資料型別與案例頁網址
import { caseHref, type CaseStudy } from "../lib/cases";

// 按下到放開移動不超過這個距離（像素）就當作點擊，而不是拖曳
const TAP = 6;

// 弧形輪播的幾何設定（單位為「畫框單位」，實際像素 = 單位 × u）
type Geo = {
  // 畫框寬度（桌機 1440、手機 640）
  F: number;
  // 中央卡片寬度（高度依 1920×1080 比例 = 寬 ÷ RATIO）
  W0: number;
  // 卡片間距（中心到中心）
  pitch: number;
  // 越靠邊緣，卡片加寬多少
  dw: number;
  // 越靠邊緣，卡片外側邊加高多少
  dh: number;
  // 邊緣卡片往外推的程度（保持卡片之間的間隙）
  k: number;
  // 卡片垂直中心位置
  cy: number;
  // 自動捲動速度（單位／秒）
  speed: number;
};

// 卡片的寬高比：16:9（封面照不足 16:9 時等比例裁切填滿）
const RATIO = 1920 / 1080;
// 桌機（> 820px）設定：中央卡片 560×315
const DESKTOP: Geo = { F: 1440, W0: 560, pitch: 610, dw: 90, dh: 80, k: 0.1, cy: 210, speed: 45 };
// 手機（≤ 820px）設定：以 640 單位縮放，中央卡片 440×248
const MOBILE: Geo = { F: 640, W0: 440, pitch: 474, dw: 50, dh: 50, k: 0.1, cy: 160, speed: 40 };

// 距離中心的比例上限（避免畫面外的卡片被放得過大）
const MAX_D = 1.25;
// 卡片圓角（單位）
const RADIUS = 18;
// 放手後的慣性：每秒只保留 5% 的速度（衰減 95%）
const DECAY = 0.05;

// 產生圓角四邊形的 clip-path 路徑；pts 為四個角的座標（像素），r 為圓角半徑
function roundedQuad(pts: [number, number][], r: number) {
  // 逐一處理四個角
  const parts = pts.map((p, i) => {
    // 前一個角與下一個角
    const a = pts[(i + 3) % 4];
    const b = pts[(i + 1) % 4];
    // 從角往前一個角方向退 r 的位置（圓角起點）
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
    const s = [p[0] + ((a[0] - p[0]) / la) * r, p[1] + ((a[1] - p[1]) / la) * r];
    // 從角往下一個角方向退 r 的位置（圓角終點）
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const e = [p[0] + ((b[0] - p[0]) / lb) * r, p[1] + ((b[1] - p[1]) / lb) * r];
    // 直線連到圓角起點，再用二次曲線繞過角
    return `${i === 0 ? "M" : "L"}${s[0].toFixed(1)} ${s[1].toFixed(1)}Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
  });
  // 組合成封閉路徑
  return `path("${parts.join("")}Z")`;
}

// 客戶實際案例弧形輪播區塊
export default function CaseCarousel({ cases }: { cases: CaseStudy[] }) {
  // 整個區塊（進場動畫用）
  const rootRef = useRef<HTMLElement>(null);
  // 輪播帶（量寬度、拖曳用）
  const bandRef = useRef<HTMLDivElement>(null);
  // 每張卡片、卡片下的說明
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 換頁
  const router = useRouter();

  // 案例太少時重複排列，讓輪播帶永遠填滿畫面、不會出現空隙
  const reps = Math.max(
    1,
    ...[DESKTOP, MOBILE].map((g) => Math.ceil((2 * g.F + g.W0) / (cases.length * g.pitch))),
  );
  // 實際要畫的卡片清單（重複的部分對輔助工具隱藏）
  const items = Array.from({ length: cases.length * reps }, (_, i) => ({ c: cases[i % cases.length], dup: i >= cases.length }));
  // 卡片總數
  const count = items.length;

  // 輪播動畫：自動捲動、拖曳、慣性，並逐格重算每張卡片的弧形外觀
  useEffect(() => {
    // 取得輪播帶
    const band = bandRef.current;
    if (!band) return;
    // 手機或桌機設定
    const mq = window.matchMedia("(max-width: 820px)");
    // 減少動態效果設定
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    // 目前的幾何設定與單位像素
    let geo = mq.matches ? MOBILE : DESKTOP;
    let u = band.clientWidth / geo.F;
    // 捲動位置（單位）與慣性速度（單位／秒）
    let offset = 0;
    let vel = 0;
    // 拖曳狀態：是否拖曳中、上次指標位置與時間
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    // 這次按下後累計移動的距離（像素），用來分辨點擊與拖曳
    let moved = 0;
    // 這次按下是否只是讓滑行中的輪播停住
    let stopping = false;
    // 動畫迴圈的編號與上一格時間
    let raf = 0;
    let prev = 0;

    // 依目前 offset 重新排列所有卡片
    const layout = () => {
      // 畫框半寬、輪播帶總長、中央卡片高度
      const half = geo.F / 2;
      const L = count * geo.pitch;
      const H0 = geo.W0 / RATIO;
      // 逐張計算
      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i];
        const cap = capRefs.current[i];
        if (!card || !cap) continue;
        // 未推開前與中心的距離，循環在 ±L/2 之間
        let t = (((i * geo.pitch - offset) % L) + L) % L;
        if (t >= L / 2) t -= L;
        // 越外側推得越開（像圓柱內側），保持卡片之間的間隙
        const X = half + t * (1 + geo.k * (t / half) ** 2);
        // 與中心的距離比例
        const d = Math.min(Math.abs(X - half) / half, MAX_D);
        // 卡片寬度：越外側越寬
        const w = geo.W0 + geo.dw * d * d;
        // 左右邊的 x 位置
        const xl = X - w / 2;
        const xr = X + w / 2;
        // 完全在畫面外時隱藏，省去繪製
        const visible = xr > -40 && xl < geo.F + 40;
        card.style.visibility = cap.style.visibility = visible ? "visible" : "hidden";
        if (!visible) continue;
        // 左右兩邊各自的距離比例，決定該邊的高度（外側邊較高）
        const qL = Math.min(Math.abs(xl - half) / half, MAX_D);
        const qR = Math.min(Math.abs(xr - half) / half, MAX_D);
        const hL = H0 + geo.dh * qL ** 2.6;
        const hR = H0 + geo.dh * qR ** 2.6;
        // 外框高度取較高的一邊；越外側垂直中心略為上移
        const H = Math.max(hL, hR);
        const cy = geo.cy - 12 * d * d;
        // 換算成像素
        const pw = w * u;
        const pH = H * u;
        const top = (cy - H / 2) * u;
        // 四個角：左上、右上、右下、左下
        const yl = ((H - hL) / 2) * u;
        const yr = ((H - hR) / 2) * u;
        // 套用卡片位置、尺寸與圓角四邊形裁切
        card.style.width = `${pw}px`;
        card.style.height = `${pH}px`;
        card.style.transform = `translate3d(${xl * u}px, ${top}px, 0)`;
        card.style.clipPath = roundedQuad(
          [
            [0, yl],
            [pw, yr],
            [pw, pH - yr],
            [0, pH - yl],
          ],
          RADIUS * u,
        );
        // 說明文字：放在卡片正下方、與卡片同寬；越外側越淡
        cap.style.width = `${pw}px`;
        cap.style.transform = `translate3d(${xl * u}px, ${top + pH + 16}px, 0)`;
        cap.style.opacity = String(Math.max(0.25, 1 - 0.75 * d));
      }
    };

    // 每一格：依經過時間推進位置
    const frame = (now: number) => {
      // 經過秒數（分頁切回時最多算 0.1 秒，避免一次跳太遠）
      const dt = prev ? Math.min((now - prev) / 1000, 0.1) : 0;
      prev = now;
      // 沒在拖曳時：慣性滑行＋自動往左捲動
      if (!dragging) {
        offset += vel * dt;
        vel *= DECAY ** dt;
        if (Math.abs(vel) < 1) vel = 0;
        if (!rm.matches) offset += geo.speed * dt;
      }
      // 重新排列
      layout();
      // 下一格
      raf = requestAnimationFrame(frame);
    };

    // 開始與停止動畫迴圈（離開畫面時停止，節省效能）
    const start = () => {
      if (raf) return;
      prev = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // 尺寸改變時重新取得設定與單位像素
    const measure = () => {
      geo = mq.matches ? MOBILE : DESKTOP;
      u = band.clientWidth / geo.F;
      layout();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(band);

    // 只在輪播帶出現在畫面上時播放
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(band);

    // 拖曳：按下時開始跟隨指標
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      // 按下時輪播還在慣性滑行：這一下只是讓它停住，不算點擊
      stopping = Math.abs(vel) > 60;
      vel = 0;
      moved = 0;
      lastX = e.clientX;
      lastT = e.timeStamp;
      band.setPointerCapture(e.pointerId);
      band.dataset.dragging = "";
    };
    // 拖曳中：卡片 1:1 跟著指標移動，並估算速度
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      moved += Math.abs(e.clientX - lastX);
      const dx = (e.clientX - lastX) / u;
      const dt = (e.timeStamp - lastT) / 1000;
      offset -= dx;
      if (dt > 0) vel = 0.8 * (-dx / dt) + 0.2 * vel;
      lastX = e.clientX;
      lastT = e.timeStamp;
    };
    // 放開：停太久才放開就不滑行，否則帶著速度慣性滑行
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (e.timeStamp - lastT > 100) vel = 0;
      delete band.dataset.dragging;
      // 幾乎沒移動就是點擊：找出指標下的卡片或說明，進入該案例頁
      // （輪播帶捕捉了指標，點擊事件到不了卡片本身，所以由這裡判斷）
      if (e.type !== "pointerup" || moved > TAP || stopping) return;
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el instanceof HTMLElement && el.dataset.case);
      if (!(hit instanceof HTMLElement) || !hit.dataset.case) return;
      // 按住 Ctrl／Cmd 點擊：在新分頁開啟
      if (e.ctrlKey || e.metaKey) window.open(hit.dataset.case, "_blank", "noopener");
      else router.push(hit.dataset.case);
    };
    // 鍵盤：左右鍵推動輪播；Enter 進入最靠近中央的案例
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") vel -= 900;
      else if (e.key === "ArrowRight") vel += 900;
      else if (e.key === "Enter") {
        const mid = band.getBoundingClientRect().left + band.clientWidth / 2;
        const center = (el: HTMLElement) => {
          const r = el.getBoundingClientRect();
          return Math.abs(r.left + r.width / 2 - mid);
        };
        const near = cardRefs.current.filter((el): el is HTMLDivElement => !!el && el.style.visibility === "visible").sort((a, b) => center(a) - center(b))[0];
        if (near?.dataset.case) router.push(near.dataset.case);
      } else return;
      e.preventDefault();
    };
    band.addEventListener("pointerdown", down);
    band.addEventListener("pointermove", move);
    band.addEventListener("pointerup", up);
    band.addEventListener("pointercancel", up);
    band.addEventListener("keydown", key);

    // 元件移除時清除所有監聽
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      band.removeEventListener("pointerdown", down);
      band.removeEventListener("pointermove", move);
      band.removeEventListener("pointerup", up);
      band.removeEventListener("pointercancel", up);
      band.removeEventListener("keydown", key);
    };
  }, [count, router]);

  // 進場動畫：先停在起始狀態，區塊進入畫面時才播放一次
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 取得帶有 data-enter 的元素
    const q = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(`[data-enter="${s}"]`));
    // 建立動畫；fill: backwards 讓延遲期間維持起始狀態
    const anims: Animation[] = [];
    const add = (els: HTMLElement[], frames: Keyframe[], duration: number, delay: number, stagger = 0, easing = "cubic-bezier(.2,.7,.2,1)") =>
      els.forEach((el, i) => {
        const a = el.animate(frames, { duration, delay: delay + i * stagger, easing, fill: "backwards" });
        a.pause();
        anims.push(a);
      });
    // 標籤彈出
    add(q("badge"), [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "none" }], 600, 0, 0, "cubic-bezier(.34,1.56,.64,1)");
    // 標題逐行從模糊中升起
    add(q("line"), [{ opacity: 0, transform: "translateY(40px)", filter: "blur(12px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }], 900, 120, 140);
    // 說明文字
    add(q("sub"), [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], 700, 450);
    // 輪播帶升起
    add(q("band"), [{ opacity: 0, transform: "translateY(80px)" }, { opacity: 1, transform: "none" }], 1100, 550);
    // 按鈕放大出現
    add(q("cta"), [{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], 600, 900, 0, "cubic-bezier(.34,1.56,.64,1)");
    // 手繪線條自己畫出來
    add(q("stroke"), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 900, 1100, 150, "ease-in-out");
    // 手寫註記淡入
    add(q("note"), [{ opacity: 0 }, { opacity: 1 }], 600, 1200, 150);
    // 進入畫面 20% 時播放全部
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        anims.forEach((a) => a.play());
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(root);
    // 元件移除時停止觀察並清除動畫
    return () => {
      io.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, []);

  // 回傳區塊
  return (
    // 客戶實際案例區塊；scroll-mt 讓錨點跳轉時不被固定的 header 擋住
    <section
      ref={rootRef}
      id="cases"
      aria-roledescription="carousel"
      aria-label="客戶實際案例"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:scroll-mt-24 sm:py-28"
    >
      {/* 文字區：置中 */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 text-center sm:px-8 lg:px-12">
        {/* 淡紅標籤 */}
        <p
          data-enter="badge"
          className="inline-flex h-9 items-center rounded-full bg-blush px-4 text-xs tracking-[0.2em] text-brand-deep"
        >
          CASE STUDIES・客戶實際案例
        </p>
        {/* 大標題：黑色特粗，兩行 */}
        <h2 className="mt-6 text-[clamp(34px,5.4vw,78px)] leading-[1.12] font-black tracking-[0.04em] text-ink">
          <span data-enter="line" className="block">
            走進各種場域，
          </span>
          <span data-enter="line" className="block text-brand">
            看見秩序的樣子
          </span>
        </h2>
        {/* 說明文字：灰字 */}
        <p data-enter="sub" className="mx-auto mt-6 max-w-xl text-sm leading-8 text-balance text-muted sm:text-base sm:leading-8">
          從機場、醫院到影城與展演空間，看看欄柱與公共空間設備，如何在不同場域中安排從容的動線。
        </p>

        {/* 左側「//」塗鴉（大螢幕才顯示） */}
        <svg aria-hidden="true" viewBox="0 0 60 50" className="absolute top-[58%] left-[14%] hidden w-14 text-brand-deep lg:block" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path data-enter="stroke" pathLength={1} strokeDasharray="1" d="M22 6 10 44" />
          <path data-enter="stroke" pathLength={1} strokeDasharray="1" d="M42 6 30 44" />
        </svg>

        {/* 右側手寫註記＋往下指向卡片的彎曲箭頭（大螢幕才顯示） */}
        <div aria-hidden="true" className="absolute top-[46%] right-[9%] hidden lg:block">
          {/* 手寫字：旋轉 14 度 */}
          <p data-enter="note" className="rotate-[14deg] font-hand text-[34px] leading-[0.95] font-semibold text-brand-deep">
            Every space,
            <br />
            its own order
          </p>
          {/* 箭頭從字的下方開始，彎曲往下到卡片 */}
          <svg viewBox="0 0 120 190" className="absolute top-[110%] right-[30%] w-[110px] text-brand-deep" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path data-enter="stroke" pathLength={1} strokeDasharray="1" d="M88 6C112 46 96 86 62 96 34 104 30 76 52 74c26-2 30 46 6 104" />
            <path data-enter="stroke" pathLength={1} strokeDasharray="1" d="M44 166l14 14 12-18" />
          </svg>
        </div>
      </div>

      {/* 輪播帶外層：作為容器，讓高度可依寬度計算 */}
      <div data-enter="band" className="@container mt-10 sm:mt-14">
        {/* 輪播帶：高度＝卡片區（手機 320、桌機 420 單位）＋說明文字；可拖曳，垂直滑動仍可捲動頁面 */}
        <div
          ref={bandRef}
          tabIndex={0}
          aria-label="客戶實際案例輪播，可拖曳或用左右鍵瀏覽，按 Enter 查看中央的案例"
          className="relative h-[calc(50cqw_+_110px)] cursor-grab touch-pan-y overflow-hidden select-none focus-visible:outline-offset-[-4px] data-dragging:cursor-grabbing min-[821px]:h-[calc(29.167cqw_+_110px)]"
        >
          {/* 每張卡片＋說明 */}
          {items.map(({ c, dup }, i) => (
            <div key={i} aria-hidden={dup || undefined}>
              {/* 卡片：位置、尺寸、裁切由程式逐格設定；載入前先隱藏 */}
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                // 點擊時進入的案例頁
                data-case={caseHref(c.slug)}
                // 預設與輪播帶同尺寸（畫面外的卡片不會被程式設定尺寸，避免圖片以 0 高度載入）
                className="invisible absolute top-0 left-0 size-full cursor-pointer overflow-hidden bg-white will-change-transform"
              >
                {/* 案例封面照：等比例填滿 */}
                <Image
                  src={c.cover.src}
                  alt={dup ? "" : c.cover.alt}
                  fill
                  draggable={false}
                  sizes="(max-width: 820px) 85vw, 45vw"
                  className="pointer-events-none object-cover"
                />
              </div>
              {/* 卡片下方說明：案例名稱＋場域；點擊同樣進入案例頁 */}
              <div
                ref={(el) => {
                  capRefs.current[i] = el;
                }}
                data-case={caseHref(c.slug)}
                className="invisible absolute top-0 left-0 cursor-pointer px-2 text-center will-change-transform"
              >
                <p className="truncate text-sm text-ink sm:text-base">{c.title}</p>
                <p className="truncate text-xs text-muted sm:text-sm">{c.scene}</p>
              </div>
            </div>
          ))}
        </div>
        {/* 給螢幕閱讀器與鍵盤的案例連結清單：輪播卡片只能用滑鼠或觸控點，這裡提供真正的連結；平常隱藏，用 Tab 聚焦時才在畫面下方顯示 */}
        <ul>
          {cases.map((c) => (
            <li key={c.slug}>
              <Link
                href={caseHref(c.slug)}
                className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:bottom-6 focus-visible:left-1/2 focus-visible:z-50 focus-visible:-translate-x-1/2 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:whitespace-nowrap focus-visible:text-brand-deep focus-visible:shadow-[0_8px_24px_-8px_rgba(15,15,14,.4)]"
              >
                客戶案例：{c.title}（{c.scene}）
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 行動按鈕＋手寫註記 */}
      <div className="relative mt-10 flex justify-center px-5">
        {/* 虛線圓環包住的深紅按鈕 */}
        <span data-enter="cta" className="inline-flex rounded-full border-2 border-dashed border-brand-deep/50 p-2">
          {/* 連到客戶實際案例總覽頁 */}
          <Link
            href="/cases"
            className="inline-flex h-14 items-center rounded-full bg-brand-deep px-8 text-sm tracking-[0.2em] text-white transition hover:bg-brand active:translate-y-px"
          >
            看更多實際案例
          </Link>
        </span>
        {/* 手寫註記＋小箭頭（平板以上顯示，放在按鈕左側） */}
        <div aria-hidden="true" className="absolute top-1/2 right-[calc(50%+170px)] hidden -translate-y-1/2 sm:block">
          <p data-enter="note" className="-rotate-[14deg] font-hand text-[30px] font-semibold whitespace-nowrap text-brand-deep">
            Watch More!
          </p>
          <svg viewBox="0 0 70 40" className="absolute top-[60%] left-[90%] w-16 text-brand-deep" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path data-enter="stroke" pathLength={1} strokeDasharray="1" d="M4 8c14 20 34 26 56 20" />
            <path data-enter="stroke" pathLength={1} strokeDasharray="1" d="M50 18l10 10-12 6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
