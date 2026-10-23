// 共用版心樣式：置中、滿寬、最寬 1440px，左右留白隨螢幕變大（手機 20px → 平板 32px → 電腦 48px）
export const container = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

// 一般區塊：上方淡紅分隔線、上下留白（與首頁各區塊相同）
export const section = "scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28";

// 內頁頂端留白：避開固定的浮動 header（手機 80px、平板 96px、電腦含資訊列 184px）
export const pageTop = "pt-32 sm:pt-36 lg:pt-56";

// 白色卡片：細框、圓角（與首頁產品系列方塊相同）
export const card = "rounded-[14px] bg-white shadow-[0_0_0_1px_rgba(15,15,14,.06)] lg:rounded-[18px]";

// 白卡片的滑鼠移上效果：微微浮起並加陰影（與首頁產品系列方塊相同）
export const cardHover =
  "transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(214,31,42,.18),0_18px_36px_-22px_rgba(15,15,14,.35)]";

// 紅框紅字按鈕；滑鼠移上變紅底白字（與「顯示更多」相同）
export const outlineBtn =
  "inline-flex items-center justify-center border border-brand-deep px-12 py-3.5 text-sm tracking-[0.2em] text-brand-deep transition hover:bg-brand-deep hover:text-white";

// 卡片內小標題：深品牌紅（與「世紘優勢」相同）
export const cardTitle = "text-xl tracking-[0.1em] text-brand-deep";

// 內文：灰字、行高 28px
export const bodyText = "text-sm leading-7 text-pretty text-muted";

// 分類連結的資料型別：id 用於首頁商品目錄錨點（#c-id），slug 用於分類頁網址，name 為顯示名稱
export type CategoryLink = { id: string; slug: string; name: string };

// 滿版版心：不限最大寬度，佔滿整個畫面（左右留白同 container，1536px 以上 64px）
export const wide = "w-full px-5 sm:px-8 lg:px-12 2xl:px-16";
