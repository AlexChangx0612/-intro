import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "世紘興業｜公共空間設備專家",
  description: "專營紅龍柱、排隊欄柱與各式公共空間設備。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans font-light">{children}</body>
    </html>
  );
}
