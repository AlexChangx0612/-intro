// 共用版心樣式：置中、滿寬、最寬 1440px，左右留白隨螢幕變大（手機 20px → 平板 32px → 電腦 48px）
export const container = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

// 分類連結的資料型別：id 用於網址錨點（#c-id），name 為顯示名稱
export type CategoryLink = { id: string; name: string };
