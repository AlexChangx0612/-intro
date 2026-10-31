// 全站共用的公司資料與 SEO 工具（網址、中繼資料、結構化資料）
import type { Metadata } from "next";

// 正式網域：canonical、sitemap、結構化資料都以此為準（測試站也指向正式網域，避免權重分散）
// 需要改網域時，設定環境變數 NEXT_PUBLIC_SITE_URL 即可
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.shihhung.com").replace(/\/$/, "");

// 公司資料：只放已確認的真實資訊（與頁尾、聯絡區一致）
export const company = {
  // 公司全名
  name: "世紘興業有限公司",
  // 簡稱
  shortName: "世紘興業",
  // 英文標誌名稱
  brand: "Shung",
  // 成立年份
  foundingYear: "2015",
  // 一句話簡介（結構化資料用）
  description: "世紘興業有限公司成立於2015年，專注公共及商業空間周邊設備研製與供應。",
  // 電話（顯示用、撥號用、國際格式）
  phone: "02-2608-2585",
  phoneHref: "tel:0226082585",
  phoneIntl: "+886-2-2608-2585",
  // 傳真
  fax: "02-2600-6748",
  faxIntl: "+886-2-2600-6748",
  // Email
  email: "shung3758@gmail.com",
  // LINE 官方帳號加好友連結
  line: "https://lin.ee/vcMIuCv",
  // LINE 官方帳號 QR Code 圖檔（public 底下，540×540）
  lineQr: "/brand/line-qrcode.png",
  // 地址
  address: { region: "新北市", locality: "林口區", street: "文化二路一段68巷39號6F" },
  // 營業時間
  hours: "週一至週五 09:00–18:00",
  // 標誌圖檔（public 底下）
  logo: "/brand/logo.png",
  // 社群分享預設圖（public 底下）
  ogImage: "/brand/og.jpg",
};

// 首頁標題與描述
export const HOME_TITLE = "世紘興業｜紅龍柱・伸縮帶欄柱・公共空間設備專業供應商";
export const HOME_DESCRIPTION =
  "世紘興業成立於2015年，專業提供紅龍柱、伸縮帶欄柱、告示牌、展示設備、垃圾桶、清潔設備及公共空間周邊設備，服務企業、政府機關、學校、銀行、醫院、商場及各類公共場域。";

// 把站內路徑轉成完整網址
export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// 產生單一頁面的中繼資料：標題、描述、canonical、Open Graph、Twitter
export function pageMetadata({
  title,
  description,
  path,
  image = company.ogImage,
  type = "website",
}: {
  // 完整標題（不再套用範本）
  title: string;
  // 搜尋結果描述
  description: string;
  // 站內路徑，例如 /about
  path: string;
  // 分享圖（public 底下的路徑）
  image?: string;
  // Open Graph 類型
  type?: "website" | "article";
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: company.shortName,
      locale: "zh_TW",
      type,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// 結構化資料：組織（各頁以 @id 參照）
export const ORG_ID = `${SITE_URL}/#organization`;
export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.name,
    alternateName: [company.shortName, company.brand],
    url: `${SITE_URL}/`,
    logo: absoluteUrl(company.logo),
    foundingDate: company.foundingYear,
    description: company.description,
    email: company.email,
    telephone: company.phoneIntl,
    faxNumber: company.faxIntl,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      addressCountry: "TW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: company.phoneIntl,
      email: company.email,
      areaServed: "TW",
      availableLanguage: "zh-Hant",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
  };
}

// 麵包屑的一層：名稱＋站內路徑
export type Crumb = { name: string; path: string };

// 結構化資料：麵包屑
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

// 結構化資料：常見問題（問答必須同時出現在頁面上）
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
