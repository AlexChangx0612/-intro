// 標記為瀏覽器端元件（需要記錄目前放大的照片）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的副作用、參照與狀態 hook
import { useEffect, useRef, useState } from "react";
// 匯入案例照片型別
import type { CasePhoto } from "../lib/cases";

// 縮圖的格寬與高度：每一排都排滿、高度一致
// 手機 2 欄：張數為奇數時，最後一張橫跨整排
// 平板以上 3 欄（以 6 格計算）：最後一排剩 1 張就橫跨整排，剩 2 張就各佔一半
// 拉寬的格子高度＝一般正方形格的邊長，用照片牆寬度（100cqw）扣掉間距後換算（手機間距 0.75rem、平板以上 1.25rem）
// 回傳格子的 class 與圖片的 sizes（依實際顯示寬度，避免下載過大的圖）
function tile(i: number, n: number) {
  // 手機
  const wideMobile = n % 2 === 1 && i === n - 1;
  // 平板以上：最後一排剩 1 張（滿版）或剩 2 張（各半）
  const rest = n % 3;
  const full = rest === 1 && i === n - 1;
  const half = rest === 2 && i >= n - 2;
  const cls = [
    wideMobile ? "col-span-2 h-[calc((100cqw-0.75rem)/2)]" : "aspect-square",
    full ? "sm:col-span-6 sm:aspect-auto sm:h-[calc((100cqw-2.5rem)/3)]" : half ? "sm:col-span-3 sm:aspect-auto sm:h-[calc((100cqw-2.5rem)/3)]" : "sm:col-span-2 sm:aspect-square sm:h-auto",
  ].join(" ");
  const desktop = full ? "(min-width: 1440px) 1344px, (min-width: 640px) 100vw" : half ? "(min-width: 1440px) 660px, (min-width: 640px) 50vw" : "(min-width: 1440px) 440px, (min-width: 640px) 33vw";
  return { cls, sizes: `${desktop}, ${wideMobile ? "100vw" : "50vw"}` };
}

// 案例照片牆：縮圖格，點擊放大；放大後可用左右鍵或按鈕切換、Esc 或點背景關閉
export default function CaseGallery({ photos }: { photos: CasePhoto[] }) {
  // 目前放大的照片索引；null 表示沒有
  const [index, setIndex] = useState<number | null>(null);
  // 每張縮圖的按鈕（關閉放大後把焦點還給原本那張）
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  // 放大檢視的關閉按鈕（開啟時把焦點移過去）
  const closeRef = useRef<HTMLButtonElement>(null);
  // 放大檢視本身（Tab 只在裡面的按鈕之間循環）
  const dialogRef = useRef<HTMLDivElement>(null);

  // 最後點開的縮圖（關閉時把焦點還給它）
  const opener = useRef(0);
  // 打開第 i 張
  const show = (i: number) => {
    opener.current = i;
    setIndex(i);
  };
  // 切換到上一張／下一張（循環）
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length));
  // 關閉放大
  const close = () => setIndex(null);

  // 放大時：鎖住背景捲動、焦點移到關閉按鈕，並監聽鍵盤；關閉時（任何方式）焦點回到原本的縮圖
  const open = index !== null;
  useEffect(() => {
    if (!open) return;
    const thumb = thumbs.current[opener.current];
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
      // Tab：焦點只在放大檢視的按鈕之間循環，不跑到後方被遮住的頁面
      if (e.key === "Tab") {
        const buttons = [...(dialogRef.current?.querySelectorAll("button") ?? [])];
        if (buttons.length === 0) return;
        const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = e.shiftKey ? (at <= 0 ? buttons.length - 1 : at - 1) : (at + 1) % buttons.length;
        buttons[next].focus();
        e.preventDefault();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      thumb?.focus();
    };
    // step 只依賴 photos.length，不需要放進依賴
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 目前放大的照片
  const active = index === null ? null : photos[index];

  return (
    <>
      {/* 縮圖格：手機 2 欄、平板以上 3 欄（以 6 格計算，讓最後一排可以拉寬排滿） */}
      <ul className="@container grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-5">
        {photos.map((p, i) => (
          <li key={p.src} className={tile(i, photos.length).cls}>
            <button
              type="button"
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              onClick={() => show(i)}
              aria-label={`放大檢視：${p.alt}`}
              className="group relative block size-full overflow-hidden rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)] lg:rounded-[18px]"
            >
              <Image src={p.src} alt={p.alt} fill sizes={tile(i, photos.length).sizes} className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
            </button>
          </li>
        ))}
      </ul>

      {/* 放大檢視：深色背景，照片等比例完整呈現 */}
      {active && index !== null && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={active.alt} className="fixed inset-0 z-50 flex flex-col animate-[fade-in_.25s_ease-out] bg-ink/90">
          {/* 說明、張數與關閉按鈕 */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-white sm:px-8">
            <p className="min-w-0 truncate text-sm tracking-[0.1em]">
              {active.alt}
              <span className="ml-3 text-white/60">
                {index + 1} / {photos.length}
              </span>
            </p>
            <button ref={closeRef} type="button" onClick={close} className="flex min-h-11 shrink-0 items-center gap-2 text-sm tracking-[0.15em]">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              關閉
            </button>
          </div>
          {/* 照片區：點背景關閉；左右兩側為切換按鈕 */}
          <div className="relative min-h-0 flex-1 px-14 pb-8 sm:px-20" onClick={close}>
            <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
              <Image key={active.src} src={active.src} alt={active.alt} fill sizes="100vw" className="object-contain" />
            </div>
            {photos.length > 1 && (
              <>
                <button type="button" aria-label="上一張" onClick={(e) => (e.stopPropagation(), step(-1))} className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 items-center justify-center text-2xl text-white transition hover:text-brand sm:left-5">
                  ←
                </button>
                <button type="button" aria-label="下一張" onClick={(e) => (e.stopPropagation(), step(1))} className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center text-2xl text-white transition hover:text-brand sm:right-5">
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
