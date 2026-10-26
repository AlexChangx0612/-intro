// 客戶實際案例資料：案例總覽頁 /cases、案例詳細頁 /cases/<slug>、首頁「客戶實際案例」輪播共用
// 照片由 scripts/import-cases.mts 從原始資料夾壓縮匯入 public/cases/<slug>/；改照片後執行 npx tsx scripts/check-cases.mts 檢查
// 文字原則：只寫照片與資料夾名稱看得出來的事實，不寫日期、數量、金額與客戶評語
// 每個欄位都是純文字或圖片路徑，日後可直接對應到 CMS 的欄位

// 一張照片
export type CasePhoto = {
  // 圖片路徑（public 底下）
  src: string;
  // 圖片替代文字（給螢幕閱讀器與搜尋引擎）
  alt: string;
};

// 故事的一段：固定為「需求」「世紘的做法」「製作與出貨」三段
export type CaseStory = {
  // 英文小標
  en: string;
  // 段落標題
  title: string;
  // 內文
  body: string;
  // 這段搭配的照片
  photo: CasePhoto;
};

// 單一案例
export type CaseStudy = {
  // 網址代號：/cases/<slug>
  slug: string;
  // 案例標題（頁面 H1）
  title: string;
  // 場域類型（英文小標旁、首頁輪播使用）
  scene: string;
  // 客戶名稱
  client: string;
  // 地點
  location: string;
  // 使用產品
  products: string;
  // 客製內容
  custom: string;
  // 一句話摘要（總覽卡片、首頁輪播、頁面描述）
  summary: string;
  // 封面照（橫式）
  cover: CasePhoto;
  // 故事三段
  story: [CaseStory, CaseStory, CaseStory];
  // 照片牆（其餘照片，可以是空陣列）
  gallery: CasePhoto[];
  // 相關產品系列（產品分類網址代號，例如 "barriers"）
  related: string[];
};

// 故事三段的固定小標與標題
const NEEDS = { en: "NEEDS", title: "需求" };
const SOLUTION = { en: "SOLUTION", title: "世紘的做法" };
const MADE = { en: "MADE IN TAIWAN", title: "製作與出貨" };

// 照片路徑：/cases/<slug>/<編號>.jpg
const photo = (slug: string, n: string, alt: string): CasePhoto => ({ src: `/cases/${slug}/${n}.jpg`, alt });

// 八個案例（順序即網站上的顯示順序）
export const cases: CaseStudy[] = [
  // 經國七海文化園區
  {
    slug: "chihai-cultural-park",
    title: "經國七海文化園區",
    scene: "文化園區",
    client: "經國七海文化園區",
    location: "台北市中山區",
    products: "客製拒馬、RS-A4BK 黑色伸縮帶欄柱、RF-R26G 繩龍柱搭配 BA-27 橫桿",
    custom: "拒馬看板印製園區標誌、加重拒馬每座約 20kg",
    summary: "入口加重拒馬、廊道伸縮帶欄柱與展區繩龍柱，一次規劃整個園區的動線。",
    cover: photo("chihai-cultural-park", "04", "印有經國七海文化園區標誌的灰色拒馬"),
    story: [
      {
        ...NEEDS,
        body: "經國七海文化園區開放民眾參觀，入口車道、室內廊道與展區各有不同的動線需求：入口要擋住車輛、放在戶外也不能被風吹動，廊道要引導參觀人流，展區則要保護展品，又不能搶走展示的焦點。",
        photo: photo("chihai-cultural-park", "01-sign", "經國七海文化園區入口的園區名稱石碑"),
      },
      {
        ...SOLUTION,
        body: "入口使用印有園區標誌與中英文名稱的客製拒馬；廊道搭配 RS-A4BK 4 米黑色伸縮帶欄柱；展區選用 RF-R26G 繩龍柱搭配 BA-27 灰色鋁合金橫桿，低調的灰色與展場融為一體。",
        photo: photo("chihai-cultural-park", "07", "展區以繩龍柱與灰色橫桿圍出展品範圍"),
      },
      {
        ...MADE,
        body: "為了讓拒馬在戶外也站得穩，世紘特別實作加重拒馬，每座約 20kg，出貨前過磅確認重量，再送到園區擺放。",
        photo: photo("chihai-cultural-park", "03", "加重拒馬放在磅秤上確認重量"),
      },
    ],
    gallery: [
      photo("chihai-cultural-park", "02", "經國七海文化園區入口車道排列的拒馬"),
      photo("chihai-cultural-park", "05", "園區廊道的黑色伸縮帶欄柱"),
      photo("chihai-cultural-park", "06", "廊道入口兩側的黑色伸縮帶欄柱"),
      photo("chihai-cultural-park", "08", "展區地面上的灰色繩龍柱"),
      photo("chihai-cultural-park", "09", "展櫃旁的繩龍柱與灰色鋁合金橫桿"),
    ],
    related: ["barriers", "retractable-belt-stanchions", "rope-stanchions"],
  },

  // 竹林山觀音寺
  {
    slug: "zhulinshan-guanyin-temple",
    title: "新北林口 竹林山觀音寺",
    scene: "宗教場所",
    client: "財團法人新北市竹林山觀音寺",
    location: "新北市林口區",
    products: "金色伸縮帶欄柱、客製拒馬",
    custom: "紅色織帶印製寺名與活動名稱、拒馬看板印製寺徽",
    summary: "金色柱身搭配印上寺名的紅色織帶，與廟宇的金紅色調相互呼應。",
    cover: photo("zhulinshan-guanyin-temple", "01", "竹林山觀音寺殿前的金色伸縮帶欄柱與紅色織帶"),
    story: [
      {
        ...NEEDS,
        body: "竹林山觀音寺香客眾多，殿前的參拜動線、平安餐等活動的排隊，以及需要暫時封閉的區域，都需要清楚又莊重的動線設備，風格也要和廟宇建築協調。",
        photo: photo("zhulinshan-guanyin-temple", "11", "印有竹林山觀音寺寺徽與「禁止通行」的拒馬"),
      },
      {
        ...SOLUTION,
        body: "選用金色柱身的伸縮帶欄柱，紅色織帶印上「財團法人新北市竹林山觀音寺」與「竹林山觀音寺－平安餐」等字樣；需要封閉的區域，則搭配印有寺徽的客製拒馬。",
        photo: photo("zhulinshan-guanyin-temple", "03", "印有「竹林山觀音寺－平安餐」的紅色織帶"),
      },
      {
        ...MADE,
        body: "金色欄柱在世紘工廠逐支組裝，並在廠內拉開織帶測試，確認後才裝箱、上棧板出貨。",
        photo: photo("zhulinshan-guanyin-temple", "06", "師傅在工廠組裝金色欄柱"),
      },
    ],
    gallery: [
      photo("zhulinshan-guanyin-temple", "02", "工廠內拉開測試的金色欄柱與印字織帶"),
      photo("zhulinshan-guanyin-temple", "04", "印有「財團法人新北市竹林山觀音寺」的紅色織帶"),
      photo("zhulinshan-guanyin-temple", "05", "組裝完成、整齊排列的金色欄柱"),
      photo("zhulinshan-guanyin-temple", "07", "工廠內待出貨的金色欄柱"),
      photo("zhulinshan-guanyin-temple", "08", "直向拉開的竹林山觀音寺印字織帶"),
      photo("zhulinshan-guanyin-temple", "09", "裝箱後堆疊在棧板上的欄柱"),
      photo("zhulinshan-guanyin-temple", "10", "包裝完成、印有竹林山觀音寺字樣的拒馬"),
    ],
    related: ["retractable-belt-stanchions", "barriers"],
  },

  // 台南天壇
  {
    slug: "tainan-tiantan-temple",
    title: "台南 台灣首廟天壇天公廟",
    scene: "宗教場所",
    client: "台灣首廟天壇天公廟",
    location: "台南市",
    products: "金色伸縮帶欄柱",
    custom: "紅色織帶印製廟名",
    summary: "金色欄柱搭配印上「台灣首廟天壇天公廟」的紅色織帶，莊重又醒目。",
    cover: photo("tainan-tiantan-temple", "01", "印有「台灣首廟天壇天公廟」的紅色織帶與金色欄柱"),
    story: [
      {
        ...NEEDS,
        body: "天壇天公廟是府城香火鼎盛的古廟，參拜與節慶期間人潮集中，動線設備需要醒目好辨認，同時要融入廟宇的莊嚴氛圍。",
        photo: photo("tainan-tiantan-temple", "02", "金色伸縮帶欄柱的柱身"),
      },
      {
        ...SOLUTION,
        body: "選用金色柱身的伸縮帶欄柱，紅色織帶印上「台灣首廟天壇天公廟」字樣，金紅配色與廟宇色調一致，信眾一眼就能辨認廟方規劃的動線。",
        photo: photo("tainan-tiantan-temple", "01", "印有廟名的紅色織帶從金色欄柱拉出"),
      },
      {
        ...MADE,
        body: "織帶印刷與欄柱組裝都在台灣完成，出貨前拉開織帶確認印刷效果。",
        photo: photo("tainan-tiantan-temple", "03", "拉開檢查的天公廟印字織帶"),
      },
    ],
    gallery: [],
    related: ["retractable-belt-stanchions"],
  },

  // 寬宏藝術 士林科教館
  {
    slug: "kham-art-ntsec",
    title: "寬宏藝術 士林科教館佈展",
    scene: "展覽",
    client: "寬宏藝術",
    location: "國立臺灣科學教育館（台北市士林區）",
    products: "黑色欄柱搭配圍繩",
    custom: "依展品大小配置圍欄範圍",
    summary: "「大動物奇積 樂高藝術」特展，以黑色欄柱圍出展品保護範圍，又不擋住觀展視線。",
    cover: photo("kham-art-ntsec", "04", "樂高城市展台四周的黑色欄柱與圍繩"),
    story: [
      {
        ...NEEDS,
        body: "寬宏藝術在國立臺灣科學教育館舉辦「大動物奇積 樂高藝術」特展，展品是大型樂高雕塑，需要拉出保護範圍避免觀眾觸碰，但不能擋住拍照與觀賞的視線。",
        photo: photo("kham-art-ntsec", "02", "「大動物奇積 樂高藝術」特展主視覺"),
      },
      {
        ...SOLUTION,
        body: "以黑色欄柱搭配細圍繩，沿著每件展品的展台圍出保護範圍；黑色低調、線條纖細，在白色展場中不會搶走展品的焦點。",
        photo: photo("kham-art-ntsec", "01", "樂高人偶展品前的黑色欄柱"),
      },
      {
        ...MADE,
        body: "世紘依佈展需求備貨並出貨到展場；欄柱可依展品大小彈性調整擺放位置，撤展後也能收納再利用。",
        photo: photo("kham-art-ntsec", "05", "展間內以黑色欄柱圍出的展品區"),
      },
    ],
    gallery: [
      photo("kham-art-ntsec", "03", "球形展品四周的黑色欄柱"),
      photo("kham-art-ntsec", "06", "展間中央的展品與黑色欄柱"),
      photo("kham-art-ntsec", "07", "樂高野牛展品與黑色欄柱"),
      photo("kham-art-ntsec", "08", "樂高樹木展品前的黑色欄柱"),
      photo("kham-art-ntsec", "09", "樂高獅子展品與黑色欄柱"),
    ],
    related: ["rope-stanchions"],
  },

  // 連江縣政府 馬祖梅石藝文中心
  {
    slug: "lienchiang-meishi-arts-center",
    title: "連江縣政府 馬祖梅石藝文中心",
    scene: "政府機關",
    client: "連江縣政府",
    location: "連江縣（馬祖）",
    products: "黑色伸縮帶欄柱",
    custom: "黑色織帶彩色印刷場館名稱與標誌",
    summary: "黑色欄柱搭配彩色印刷織帶，從台灣本島裝箱出貨到馬祖。",
    cover: photo("lienchiang-meishi-arts-center", "06", "以堆高機將棧板貨物裝上貨車"),
    story: [
      {
        ...NEEDS,
        body: "馬祖梅石藝文中心是連江縣政府的藝文空間，需要一套能管理參觀與活動動線、同時呈現場館識別的欄柱設備。",
        photo: photo("lienchiang-meishi-arts-center", "01", "印有「馬祖梅石藝文中心」的黑色織帶"),
      },
      {
        ...SOLUTION,
        body: "選用黑色伸縮帶欄柱，黑色織帶以彩色印刷印上「馬祖梅石藝文中心 Matsu Arts Center」與場館標誌，沉穩的黑色搭配彩色字樣，兼顧質感與辨識度。",
        photo: photo("lienchiang-meishi-arts-center", "02", "拉開檢查的馬祖梅石藝文中心印字織帶"),
      },
      {
        ...MADE,
        body: "馬祖位於離島，運送距離長、轉運次數多。世紘將欄柱分箱包裝，以棧板與收縮膜加固，再用堆高機裝車出貨，降低運送途中碰撞損傷的風險。",
        photo: photo("lienchiang-meishi-arts-center", "03", "裝箱中的黑色伸縮帶欄柱與配件"),
      },
    ],
    gallery: [
      photo("lienchiang-meishi-arts-center", "04", "以收縮膜加固的棧板貨物"),
      photo("lienchiang-meishi-arts-center", "05", "準備裝車的棧板貨物"),
    ],
    related: ["retractable-belt-stanchions"],
  },

  // 小米門市
  {
    slug: "xiaomi-store",
    title: "小米門市",
    scene: "3C 門市",
    client: "小米台灣",
    location: "小米門市",
    products: "黑色伸縮帶欄柱、P7-45BK 黑色烤漆告示牌、FR-025BK 黑色烤漆雨傘架（25 孔）",
    custom: "紅色織帶印製小米標誌",
    summary: "門口排隊動線、服務告示與雨天傘架，一次搭配門市的黑色調。",
    cover: photo("xiaomi-store", "05", "小米門市外觀與門口的欄柱"),
    story: [
      {
        ...NEEDS,
        body: "小米門市來客量大，新品開賣與維修服務時常出現排隊人潮，門口需要整齊的排隊動線與清楚的服務告示，雨天也要有地方放置雨傘。",
        photo: photo("xiaomi-store", "02", "小米門市入口的伸縮帶欄柱與告示"),
      },
      {
        ...SOLUTION,
        body: "門口使用黑色伸縮帶欄柱，紅色織帶印上小米標誌；搭配 P7-45BK 黑色烤漆告示牌張貼維修服務資訊，以及 FR-025BK 黑色烤漆 25 孔雨傘架，整體與門市的黑色調一致。",
        photo: photo("xiaomi-store", "04", "張貼維修服務資訊的黑色烤漆告示牌"),
      },
      {
        ...MADE,
        body: "印刷織帶完成後在世紘廠內拉開，確認標誌的位置與顏色；告示牌與雨傘架同樣在台灣製作，一併出貨。",
        photo: photo("xiaomi-store", "01", "廠內拉開確認的小米印字織帶"),
      },
    ],
    gallery: [
      photo("xiaomi-store", "03", "印有小米標誌的紅色織帶"),
      photo("xiaomi-store", "06", "門市騎樓的黑色烤漆雨傘架"),
    ],
    related: ["retractable-belt-stanchions", "poster-sign-stands", "umbrella-stands"],
  },

  // 台鋼雄鷹
  {
    slug: "tsg-hawks",
    title: "台鋼雄鷹棒球隊",
    scene: "職業球團",
    client: "台鋼雄鷹",
    location: "高雄市",
    products: "伸縮帶欄柱",
    custom: "綠色織帶印製「TSG HAWKS」",
    summary: "球隊代表色的綠色織帶印上 TSG HAWKS，讓排隊動線也成為球迷看得見的品牌。",
    cover: photo("tsg-hawks", "03", "印有「TSG HAWKS」的綠色織帶與欄柱"),
    story: [
      {
        ...NEEDS,
        body: "職業棒球賽事吸引大批球迷，入場、購票與周邊商品區都需要排隊動線，球團也希望現場設備能呈現球隊形象。",
        photo: photo("tsg-hawks", "02", "拉開的 TSG HAWKS 綠色織帶"),
      },
      {
        ...SOLUTION,
        body: "以球隊代表色的綠色織帶，印上白色「TSG HAWKS」字樣，搭配不鏽鋼色伸縮帶欄柱，讓排隊動線也成為球隊視覺的一部分。",
        photo: photo("tsg-hawks", "01", "綠色織帶上的 TSG HAWKS 字樣"),
      },
      {
        ...MADE,
        body: "織帶印刷與欄柱組裝都在台灣完成，逐箱包裝、標示後，集中上棧板出貨。",
        photo: photo("tsg-hawks", "04", "裝箱完成、堆疊在棧板上的欄柱"),
      },
    ],
    gallery: [],
    related: ["retractable-belt-stanchions"],
  },

  // 拒馬客製印刷作品集
  {
    slug: "barrier-printing-portfolio",
    title: "拒馬客製印刷作品集",
    scene: "多元場域",
    client: "新光華山金融中心、國家檔案館、勤讚物業、臺南慈濟高中等",
    location: "全台各地",
    products: "客製拒馬",
    custom: "拒馬看板印製企業標誌、中英文標語與警示文字",
    summary: "大樓、學校、物業與公家機關，拒馬看板都能印上自己的標誌與警示文字。",
    cover: photo("barrier-printing-portfolio", "06", "印有臺南慈濟高中校名的藍色拒馬"),
    story: [
      {
        ...NEEDS,
        body: "大樓車道、學校門口、社區與公家機關，常需要擋住車輛進出或禁止停車的拒馬；拒馬每天都擺在門口，看板也就成了最直接的門面。",
        photo: photo("barrier-printing-portfolio", "01", "新光華山金融中心人行道上的黑色拒馬"),
      },
      {
        ...SOLUTION,
        body: "拒馬看板可印上企業或機關標誌、中英文標語與警示文字，例如「車輛進出 請勿停車」「禁止通行」「NO PARKING」。合作客戶包括新光華山金融中心、國家檔案館、勤讚物業、臺南慈濟高中、新美河購物廣場、柏昶新世界、科源機電、丞石建築與中正大樓等。",
        photo: photo("barrier-printing-portfolio", "03", "印有「車輛進出 請勿停車」的紅色拒馬看板"),
      },
      {
        ...MADE,
        body: "拒馬在台灣製作，看板印刷完成後逐座以塑膠袋包覆保護，再集中出貨，送到現場拆封即可使用。",
        photo: photo("barrier-printing-portfolio", "08", "以塑膠袋包覆、待出貨的勤讚物業拒馬"),
      },
    ],
    gallery: [
      photo("barrier-printing-portfolio", "02", "印有丞石建築標誌的拒馬"),
      photo("barrier-printing-portfolio", "04", "包裝完成的「NO PARKING」拒馬"),
      photo("barrier-printing-portfolio", "05", "印有勤讚物業標誌的黃色看板拒馬"),
      photo("barrier-printing-portfolio", "07", "包裝中的「請勿停車」拒馬"),
      photo("barrier-printing-portfolio", "09", "整排待出貨的臺南慈濟高中拒馬"),
      photo("barrier-printing-portfolio", "10", "紅色「車輛進出 請勿停車 NO PARKING」拒馬"),
      photo("barrier-printing-portfolio", "11", "白色框架、綠色看板的「請勿停車」拒馬"),
      photo("barrier-printing-portfolio", "12", "印有新美河購物廣場的拒馬"),
      photo("barrier-printing-portfolio", "13", "印有中正大樓的「車輛進出 請勿停車」拒馬"),
      photo("barrier-printing-portfolio", "14", "黑白設計的「請勿停車 NO PARKING」拒馬"),
      photo("barrier-printing-portfolio", "15", "印有柏昶新世界標誌的黑色拒馬"),
      photo("barrier-printing-portfolio", "16", "白底紅字的「車輛進出 請勿停車」拒馬"),
      photo("barrier-printing-portfolio", "17", "國家檔案館門前的咖啡色拒馬"),
    ],
    related: ["barriers"],
  },
];

// 依網址代號取得單一案例（找不到回傳 undefined）
export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}

// 案例詳細頁網址
export function caseHref(slug: string) {
  return `/cases/${slug}`;
}
