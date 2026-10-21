// 適用場域頁的文字內容（/solutions/<slug>）
// 每一頁回答「這個場域遇到什麼問題、可以用哪些設備解決」，設備連到對應的產品分類頁
import type { Faq } from "../components/FaqList";

// 場域頁內建議的一項設備配置
export type SolutionNeed = {
  // 區域或需求，例如「掛號區動線規劃」
  title: string;
  // 說明：遇到的問題與建議做法
  desc: string;
  // 相關產品分類（網址代號）
  categories: string[];
};

// 單一場域頁內容
export type Solution = {
  // 網址代號
  slug: string;
  // 短名稱（首頁清單、麵包屑）
  name: string;
  // 英文小標
  en: string;
  // 頁面 H1
  h1: string;
  // 搜尋結果標題
  title: string;
  // 搜尋結果描述
  description: string;
  // 開頭介紹
  intro: string;
  // 這個場域常見的挑戰
  challenges: string[];
  // 建議設備配置
  needs: SolutionNeed[];
  // 常見問題
  faqs: Faq[];
};

// 六個場域
export const solutions: Solution[] = [
  {
    slug: "bank-post-office",
    name: "銀行・郵局",
    en: "BANKS & POST OFFICES",
    h1: "銀行・郵局排隊動線與櫃台區設備規劃",
    title: "銀行・郵局排隊欄柱與櫃台動線規劃｜世紘興業",
    description: "銀行與郵局櫃台的排隊動線、告示與入口設備規劃：伸縮帶欄柱、柱頭告示框、立式告示牌、拒馬與傘架，世紘提供免費空間規劃與報價。",
    intro: "銀行與郵局每天有大量臨櫃客戶，排隊動線是否清楚，直接影響等候秩序與服務形象。以下整理常見的櫃台區需求，以及世紘可以提供的設備。",
    challenges: ["尖峰時段排隊人潮延伸到門口，動線混亂", "不同業務的排隊區需要清楚區隔與標示", "雨天入口地面濕滑", "營業前後需要管制出入口"],
    needs: [
      { title: "櫃台排隊動線", desc: "以伸縮帶欄柱排出蛇形或直線排隊動線，尖峰時段可快速拉長、離峰時收短。金融空間常選擇不鏽鋼色或黑色柱身，與裝潢協調。", categories: ["retractable-belt-stanchions"] },
      { title: "業務分流與指示", desc: "在欄柱上加裝柱頭告示框，或在動線起點放置立式告示牌，標示「存提款」「郵務」等不同業務。", categories: ["poster-sign-stands"] },
      { title: "入口管制與雨天設備", desc: "營業時間外以拒馬管制出入口，拒馬看板可置入品牌視覺；雨天在入口放置傘架或傘桶，保持大廳乾爽。", categories: ["barriers", "umbrella-stands"] },
    ],
    faqs: [
      { q: "銀行適合哪種排隊欄柱？", a: "銀行櫃台多使用伸縮帶欄柱，動線調整方便；重視形象的貴賓區或入口也可搭配掛繩欄柱。", link: { href: "/products/retractable-belt-stanchions", label: "了解伸縮帶欄柱" } },
    ],
  },
  {
    slug: "hospital-clinic",
    name: "醫院・診所",
    en: "HOSPITALS & CLINICS",
    h1: "醫院排隊動線與公共空間設備規劃",
    title: "醫院・診所排隊動線與公共空間設備｜世紘興業",
    description: "醫院與診所的掛號區動線、候診區、告示、垃圾桶、清潔設備與傘架規劃。世紘提供伸縮帶欄柱、告示牌、分類回收桶、感應給皂機等設備與免費空間規劃。",
    intro: "醫院人流量大、動線複雜，病患與家屬需要在掛號、批價、領藥等不同櫃台之間移動。清楚的排隊動線與指示，能減少詢問與擁擠，也讓公共空間更衛生。",
    challenges: ["掛號、批價、領藥櫃台前排隊人潮交錯", "初次就醫者不清楚該往哪裡排隊", "候診區需要維持整潔與衛生", "雨天入口地面濕滑，有滑倒風險"],
    needs: [
      { title: "掛號區動線規劃", desc: "以伸縮帶欄柱在掛號、批價、領藥櫃台前排出獨立的排隊動線，避免人潮交錯；動線需保留輪椅與推床通行的寬度。", categories: ["retractable-belt-stanchions"] },
      { title: "告示與指示", desc: "在動線起點與轉角放置立式告示牌，標示櫃台名稱與排隊方向；清潔或維修時使用警示立牌提醒。", categories: ["poster-sign-stands", "bulletin-boards"] },
      { title: "候診區與公共衛生", desc: "候診區與走道設置分類回收桶與垃圾桶；洗手區設置感應給皂機，減少接觸。", categories: ["waste-recycling", "cleaning-hygiene"] },
      { title: "入口雨天設備", desc: "在大門入口放置傘架或傘桶，搭配擦鞋機，減少雨水與泥沙帶入院內。", categories: ["umbrella-stands", "cleaning-hygiene"] },
    ],
    faqs: [
      { q: "醫院排隊動線要注意什麼？", a: "除了動線清楚之外，醫院需特別保留輪椅、推床與助行器通行的寬度，並在動線起點清楚標示櫃台名稱。提供平面圖與人流狀況，世紘可協助免費規劃。" },
    ],
  },
  {
    slug: "shopping-mall",
    name: "百貨・商場",
    en: "SHOPPING MALLS",
    h1: "百貨・商場排隊動線與宣傳展示設備規劃",
    title: "百貨・商場排隊欄柱與展示設備｜世紘興業",
    description: "百貨商場的結帳與活動排隊動線、樓層告示、數位看板、垃圾桶與入口設備規劃。世紘提供伸縮帶欄柱、掛繩欄柱、海報架、數位看板與免費空間規劃。",
    intro: "百貨商場同時有日常購物、週年慶、快閃活動等不同人流需求，動線設備要能快速調整，宣傳展示也要兼顧質感。",
    challenges: ["週年慶、限量活動時排隊人潮暴增", "專櫃與活動需要吸睛又有質感的宣傳", "美食街與公共區域需要維持整潔", "雨天入口地面濕滑"],
    needs: [
      { title: "結帳與活動排隊", desc: "伸縮帶欄柱可依人潮快速調整排隊長度；精品專櫃或 VIP 入口可搭配掛繩欄柱，營造迎賓感。", categories: ["retractable-belt-stanchions", "rope-stanchions"] },
      { title: "宣傳與指示", desc: "以海報架、立式告示牌標示活動與樓層資訊；需要經常更換內容時，可使用數位看板或 LED 發光展示架。", categories: ["poster-sign-stands", "digital-signage-lightbox"] },
      { title: "公共區域整潔", desc: "美食街、電梯間與出入口設置不鏽鋼垃圾桶、分類回收桶與煙灰桶。", categories: ["waste-recycling"] },
      { title: "入口設備", desc: "雨天在入口放置傘架或傘桶。", categories: ["umbrella-stands"] },
    ],
    faqs: [
      { q: "百貨適合哪種排隊欄柱？", a: "一般結帳與活動排隊建議使用伸縮帶欄柱，調整快速；精品專櫃、VIP 區域可使用掛繩欄柱。兩者也可搭配使用。", link: { href: "/products/rope-stanchions", label: "了解掛繩欄柱" } },
    ],
  },
  {
    slug: "airport-station",
    name: "機場・車站",
    en: "AIRPORTS & STATIONS",
    h1: "機場・車站排隊動線與大型場域設備規劃",
    title: "機場・車站排隊動線與欄柱規劃｜世紘興業",
    description: "機場報到櫃台、安檢與車站售票的排隊動線規劃，以及告示、垃圾桶與資源回收設備。世紘提供伸縮帶欄柱、室內外欄柱、告示牌與免費空間規劃。",
    intro: "機場與車站的排隊動線長、轉折多，人流量隨班次大幅變動。設備需要能快速擴充或收短，並清楚引導旅客。",
    challenges: ["報到、安檢與售票排隊動線長、轉折多", "班次尖峰時人流量大幅變動", "旅客需要清楚的排隊與方向指示", "公共區域垃圾量大，需要資源回收"],
    needs: [
      { title: "長距離排隊動線", desc: "以伸縮帶欄柱排出蛇形動線，可依人潮增減欄柱數量；萬向系列織帶可往不同方向拉出，轉折較方便。", categories: ["retractable-belt-stanchions"] },
      { title: "戶外排隊與候車區", desc: "戶外計程車招呼站或接駁車候車區，可使用室內外皆適用的欄柱。", categories: ["indoor-outdoor-stanchions"] },
      { title: "指示與公告", desc: "在排隊起點與轉角設置告示牌，標示櫃台、航空公司或班次資訊。", categories: ["poster-sign-stands"] },
      { title: "垃圾與資源回收", desc: "候車與等候區設置分類回收桶與垃圾桶。", categories: ["waste-recycling"] },
    ],
    faqs: [
      { q: "大型場地需要多少支欄柱？", a: "可先量測動線總長度與轉折次數：每段直線約需「直線長度 ÷ 織帶長度 ＋ 1」支，每多一個轉折多 1 支。大型場地建議提供平面圖，由世紘協助免費規劃與估算。", link: { href: "/products/retractable-belt-stanchions", label: "了解伸縮帶欄柱" } },
    ],
  },
  {
    slug: "exhibition-event",
    name: "展覽・活動",
    en: "EXHIBITIONS & EVENTS",
    h1: "展覽・活動入場動線與臨時區隔設備規劃",
    title: "展覽・活動排隊動線與入場管制設備｜世紘興業",
    description: "展覽、演唱會、記者會與戶外活動的入場排隊、區隔與宣傳設備規劃。世紘提供伸縮帶欄柱、掛繩欄柱、室內外欄柱、拒馬、海報架與數位看板。",
    intro: "展覽與活動的場地每次都不同，需要在短時間內布置入場動線、區隔 VIP 與工作區，並放置宣傳與指示。設備要好搬運、好組裝。",
    challenges: ["入場時段人潮集中，需要快速排出動線", "需要區隔 VIP、媒體與工作人員區域", "戶外活動需要室內外皆可用的設備", "活動宣傳與報到指示"],
    needs: [
      { title: "入場排隊動線", desc: "伸縮帶欄柱收放快速，適合活動當天布置與撤場。", categories: ["retractable-belt-stanchions"] },
      { title: "VIP 與典禮區隔", desc: "紅毯、頒獎典禮與 VIP 區域常使用掛繩欄柱，營造儀式感；展品保護也可使用掛繩欄柱。", categories: ["rope-stanchions"] },
      { title: "戶外與入口管制", desc: "戶外場地可使用室內外欄柱、塑膠欄柱；入口以拒馬管制，並在拒馬看板上放置活動視覺。", categories: ["indoor-outdoor-stanchions", "plastic-stanchions", "barriers"] },
      { title: "宣傳與報到指示", desc: "以海報架、立式告示牌、佈告欄或數位看板，放置活動主視覺、報到與場地資訊。", categories: ["poster-sign-stands", "bulletin-boards", "digital-signage-lightbox"] },
    ],
    faqs: [
      { q: "活動只用幾天，也可以詢價嗎？", a: "可以。請告訴我們活動日期、場地與需求，專員會提供規劃與報價建議。" },
    ],
  },
  {
    slug: "hotel-restaurant",
    name: "飯店・餐廳",
    en: "HOTELS & RESTAURANTS",
    h1: "飯店・餐廳迎賓動線與房務設備規劃",
    title: "飯店・餐廳迎賓欄柱與房務設備｜世紘興業",
    description: "飯店與餐廳的迎賓入口、候位動線、活動告示、房務整備車、鑰匙箱與清潔衛生設備規劃。世紘提供掛繩欄柱、伸縮帶欄柱、告示牌、推車與免費空間規劃。",
    intro: "飯店與餐廳重視第一印象。從迎賓入口、候位區到宴會廳的活動告示，設備要兼顧秩序與質感；後場的房務、清潔與鑰匙管理，也需要耐用好用的設備。",
    challenges: ["迎賓入口與候位區需要有質感的區隔", "宴會與活動需要清楚的告示", "房務整備需要收納備品與清潔用品", "客房與設備鑰匙需要集中管理"],
    needs: [
      { title: "迎賓入口與候位區", desc: "迎賓入口、宴會廳與 VIP 區常使用掛繩欄柱；餐廳候位與自助餐排隊可使用伸縮帶欄柱。", categories: ["rope-stanchions", "retractable-belt-stanchions"] },
      { title: "活動告示與宣傳", desc: "宴會廳門口以立式告示牌或海報架標示活動資訊；大廳可使用數位看板播放資訊。", categories: ["poster-sign-stands", "digital-signage-lightbox"] },
      { title: "房務與後場設備", desc: "房務整備車收納備品與清潔用品，工具車與不鏽鋼工作桌用於維修與後場作業；鑰匙箱集中管理鑰匙。", categories: ["carts-tool-carts", "key-boxes"] },
      { title: "入口與衛生", desc: "雨天入口放置傘架或傘桶；洗手間設置感應給皂機。", categories: ["umbrella-stands", "cleaning-hygiene"] },
    ],
    faqs: [
      { q: "飯店迎賓適合用哪種欄柱？", a: "迎賓入口與宴會廳多使用掛繩欄柱，搭配絨布繩較有質感；需要頻繁調整的排隊區則使用伸縮帶欄柱。", link: { href: "/products/rope-stanchions", label: "了解掛繩欄柱" } },
    ],
  },
];

// 取得單一場域
export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
