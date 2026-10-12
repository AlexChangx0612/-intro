// 區塊標題元件：小標（英文）＋大標，可選擇加上說明文字
export default function SectionTitle({
  // 上方英文小標，例如 COLLECTIONS
  eyebrow,
  // 主標題文字
  title,
  // 說明文字（可省略）
  desc,
  // 對齊方式，預設置中
  align = "center",
}: {
  // eyebrow 為文字
  eyebrow: string;
  // title 為文字
  title: string;
  // desc 為文字，可不傳
  desc?: string;
  // align 只能是置中或靠左，可不傳
  align?: "center" | "left";
}) {
  // 回傳標題區塊
  return (
    // 置中時加上 text-center，靠左則不加
    <div className={align === "center" ? "text-center" : ""}>
      {/* 英文小標：14px、字距加寬、深品牌紅 */}
      <p className="text-xs tracking-[0.35em] text-brand-deep">{eyebrow}</p>
      {/* 主標題：與小標間距 16px，品牌紅，平板以上字級加大；空間不夠時只在「，」後換行，不把詞拆開 */}
      <h2 className="mt-4 text-2xl tracking-[0.12em] text-brand sm:text-3xl">
        {title.split("，").map((part, i, all) => (
          <span key={part}>
            <span className="whitespace-nowrap">{i < all.length - 1 ? `${part}，` : part}</span>
            {i < all.length - 1 && <wbr />}
          </span>
        ))}
      </h2>
      {/* 有傳入說明文字時才顯示 */}
      {desc && (
        // 說明文字：灰色、最寬約 512px，置中時左右自動置中
        <p className={`mt-4 max-w-lg text-sm leading-7 text-muted ${align === "center" ? "mx-auto" : ""}`}>{desc}</p>
      )}
    </div>
  );
}
