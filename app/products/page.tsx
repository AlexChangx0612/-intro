// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入產品系列方塊
import CollectionGrid from "../components/CollectionGrid";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../components/SectionTitle";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, ORG_ID, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, pageTop } from "../lib/ui";

// 頁面描述
const description =
  "世紘興業全系列公共空間設備：伸縮帶欄柱、迎賓欄柱、展覽佈展欄柱、塑膠欄柱、拒馬、海報架・告示牌、佈告欄、數位看板・燈箱、垃圾桶・資源回收、清潔衛生、傘架、推車與鑰匙箱。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "產品系列｜紅龍柱・欄柱・告示牌・公共空間設備｜世紘興業",
  description,
  path: "/products",
});

// 產品系列總覽頁
export default function ProductsPage() {
  // 各分類
  const { categories } = getCatalog();
  return (
    <PageShell>
      {/* 結構化資料：產品分類清單 */}
      <JsonLd
        data={{
          "@type": "CollectionPage",
          name: "產品系列",
          description,
          url: absoluteUrl("/products"),
          publisher: { "@id": ORG_ID },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: categories.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              url: absoluteUrl(`/products/${c.slug}`),
            })),
          },
        }}
      />
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "產品系列", path: "/products" }]} />
          <div className="mt-10">
            <SectionTitle as="h1" eyebrow="COLLECTIONS" title="產品系列" desc="從排隊動線、告示展示到清潔與物業管理，世紘提供公共與商業空間所需的各類周邊設備。選擇系列查看產品與選購建議。" />
          </div>
          <CollectionGrid categories={categories} />
          {/* 每個分類的簡短說明（純文字清單，方便快速瀏覽） */}
          <ul className="mt-16 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li key={c.id} className="border-b border-line py-5">
                <h2 className="text-lg tracking-[0.08em]">{c.name}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{c.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
