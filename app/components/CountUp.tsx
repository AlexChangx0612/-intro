// 標記為瀏覽器端元件（需要偵測捲動到畫面內）
"use client";

// 匯入 React 的副作用、參照與狀態 hook
import { useEffect, useRef, useState } from "react";

// 每一位數字的轉輪：0–9 重複兩次，停在第二輪，看起來像轉了一圈多
const REEL = Array.from({ length: 20 }, (_, i) => i % 10);

// 數字滾動：像里程表一樣，每一位數從 0 往上轉到正確數字；捲到畫面內才開始轉，只轉一次
// 伺服器輸出（與不支援 JavaScript 時）直接顯示最終數字；系統設定「減少動態效果」時不轉
// 螢幕閱讀器讀到的是完整數字（隱藏文字），轉輪本身對輔助科技隱藏
export default function CountUp({ value }: { value: string }) {
  // 外框（偵測是否進入畫面）
  const ref = useRef<HTMLSpanElement>(null);
  // 狀態：static 顯示最終數字、zero 歸零待轉、roll 轉到最終數字
  const [phase, setPhase] = useState<"static" | "zero" | "roll">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 第一次回報時先歸零；進入畫面 40% 時，等歸零畫面畫出來（兩個影格）再開始轉
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        setPhase((p) => (p === "static" ? "zero" : p));
        if (!e.isIntersecting) return;
        io.disconnect();
        frame = requestAnimationFrame(() => (frame = requestAnimationFrame(() => setPhase("roll"))));
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // 第幾位數字（逐位延遲 0.12 秒）
  let col = 0;
  return (
    <span ref={ref} className="inline-flex">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {value.split("").map((ch, i) => {
          // 逗號等非數字字元原樣顯示
          if (!/[0-9]/.test(ch)) return <span key={i}>{ch}</span>;
          const delay = col++ * 0.12;
          const y = phase === "zero" ? 0 : -(10 + Number(ch));
          return (
            <span key={i} className="inline-block h-[1em] overflow-hidden leading-none">
              <span
                className={`block ${phase === "roll" ? "transition-transform duration-[2200ms] ease-[cubic-bezier(.16,.8,.2,1)]" : ""}`}
                style={{ transform: `translateY(${y}em)`, transitionDelay: `${delay}s` }}
              >
                {REEL.map((n, j) => (
                  <span key={j} className="block h-[1em]">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
