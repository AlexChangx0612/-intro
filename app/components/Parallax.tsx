// 標記為瀏覽器端元件（需要監聽捲動事件）
"use client";

// 匯入 React 的副作用 hook、DOM 參照 hook 與子元素型別
import { useEffect, useRef, type ReactNode } from "react";

// 視差滾動：元素依其與畫面中心的距離位移，speed 越大位移越明顯
// origin="top" 以父層頂端為基準（頁首區塊用，載入時不位移）
// 系統設定「減少動態效果」時不位移
export default function Parallax({
  // 位移速度，預設 0.15（捲動 100px 移動 15px）
  speed = 0.15,
  // 位移基準點，預設以畫面中心計算
  origin = "center",
  // 外部可加的 class
  className = "",
  // 被包住、要產生視差的內容
  children,
}: {
  // speed 為數字，可不傳
  speed?: number;
  // origin 只能是 center 或 top，可不傳
  origin?: "center" | "top";
  // className 為文字，可不傳
  className?: string;
  // children 為任何可顯示的內容
  children: ReactNode;
}) {
  // 取得外層 div 的 DOM 參照，用來直接修改它的位移
  const ref = useRef<HTMLDivElement>(null);

  // 元件出現在畫面後才開始監聽捲動
  useEffect(() => {
    // 取得實際的 DOM 元素
    const el = ref.current;
    // 找不到元素，或使用者開啟「減少動態效果」時，不做任何事
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 記錄已排定的畫面更新編號（0 代表目前沒有排定）
    let frame = 0;
    // 計算並套用位移
    const update = () => {
      // 這次更新已執行，清除排定記錄
      frame = 0;
      // 以父層位置計算，避免自身位移影響量測
      const parent = el.parentElement ?? el;
      // 取得父層在畫面上的位置與大小
      const rect = parent.getBoundingClientRect();
      // 父層離畫面太遠（上下超過 200px）時不計算，節省效能
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      // 計算距離：top 模式用父層頂端；center 模式用父層中心與畫面中心的差距
      const offset = origin === "top" ? rect.top : rect.top + rect.height / 2 - window.innerHeight / 2;
      // 位移量 = 距離 × 速度（取負號讓內容往反方向慢慢移動）
      let y = -offset * speed;
      // 元素比父層大（圖片預留位移空間）時，限制位移不超出預留範圍，避免露出空白
      const room = (el.offsetHeight - parent.clientHeight) / 2;
      // 有預留空間時，把位移量限制在 ±room 之間
      if (room > 0) y = Math.max(-room, Math.min(room, y));
      // 套用垂直位移（translate3d 會啟用 GPU 加速，捲動較順）
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    // 捲動時呼叫：每個畫面更新週期最多計算一次，避免重複運算
    const onScroll = () => {
      // 尚未排定時才排定下一次畫面更新
      if (!frame) frame = requestAnimationFrame(update);
    };

    // 一開始先計算一次位置
    update();
    // 監聽捲動（passive 表示不會阻擋捲動，效能較好）
    window.addEventListener("scroll", onScroll, { passive: true });
    // 視窗大小改變時也重新計算
    window.addEventListener("resize", onScroll);
    // 元件移除時的清理工作
    return () => {
      // 取消尚未執行的畫面更新
      cancelAnimationFrame(frame);
      // 移除捲動監聽
      window.removeEventListener("scroll", onScroll);
      // 移除視窗大小監聽
      window.removeEventListener("resize", onScroll);
    };
    // speed 或 origin 改變時重新設定
  }, [speed, origin]);

  // 回傳外層 div（will-change-transform 提示瀏覽器此元素會移動，預先最佳化）
  return (
    // 綁定 ref 並加上外部傳入的 class
    <div ref={ref} className={`will-change-transform ${className}`}>
      {/* 被視差移動的內容 */}
      {children}
    </div>
  );
}
