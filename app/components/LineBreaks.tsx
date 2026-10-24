// 標記為瀏覽器端元件（需要量測文字實際排版）
"use client";

// 匯入 React 的副作用 hook
import { useEffect } from "react";

// 中文斷行的補強：全站 CSS 已設定 word-break: keep-all（只在標點與空白處換行），
// 但一個分句比整行還長時，瀏覽器只能在任意字中間切開（例如「有什｜麼不同」）。
// 這裡找出這些被切開的分句，只在「這些分句」的詞與詞之間加上看不見的換行點（零寬空白），
// 讓長句改在詞的交界換行；能放進一行的分句不動，維持「一句話寫完才換行」。

// 零寬空白（看不見的換行點）
const ZWSP = "​";
// 連字符（看不見，禁止在這裡換行）：用來把助詞黏在前面的引號後面
const JOIN = "⁠";
// 中文字
const HAN = /\p{Script=Han}/u;
// 分句的邊界：標點與空白（keep-all 下這些位置本來就可以換行）
const BOUNDARY = /[\s，。、；：！？）」』〉》,.;:!?)]/;
// 不放在行首的助詞：跟著前一個詞（例如「空間的」不拆成「空間｜的」）
const NO_START = /^[的了著們地得之]/;
// 不處理的元素
const SKIP = "script,style,textarea,input,[contenteditable],.sr-only";

// 找出文字節點中「被切在兩個中文字之間」的位置
function brokenAt(node: Text, range: Range) {
  const hits: number[] = [];
  let prevTop: number | null = null;
  for (let i = 0; i < node.length; i++) {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const rect = range.getBoundingClientRect();
    if (!rect.width) continue;
    const top = Math.round(rect.top);
    if (prevTop !== null && top > prevTop + 4 && HAN.test(node.data[i - 1] ?? "") && HAN.test(node.data[i])) hits.push(i);
    prevTop = top;
  }
  return hits;
}

// 在 text 的 [start, end) 分句內，於詞與詞之間（兩側都是中文字）插入零寬空白；keep 裡的專有名詞內部不插入
function addWordBreaks(text: string, start: number, end: number, segmenter: Intl.Segmenter, keep: string[]) {
  const clause = text.slice(start, end);
  // 專有名詞內部的位置（不可換行）
  const locked = new Set<number>();
  for (const term of keep) {
    for (let at = clause.indexOf(term); at >= 0; at = clause.indexOf(term, at + 1)) {
      for (let p = at + 1; p < at + term.length; p++) locked.add(p);
    }
  }
  let out = "";
  let pos = 0;
  for (const { segment } of segmenter.segment(clause)) {
    if (pos > 0 && !locked.has(pos) && !NO_START.test(segment) && HAN.test(clause[pos - 1]) && HAN.test(segment[0])) out += ZWSP;
    out += segment;
    pos += segment.length;
  }
  return text.slice(0, start) + out + text.slice(end);
}

// 處理整頁：先移除先前加的換行點，再依目前寬度重新判斷
function fix(root: HTMLElement, segmenter: Intl.Segmenter, keep: string[]) {
  const range = document.createRange();
  // 收集要檢查的文字節點（含中文、可見、不在略過的元素內）
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    if (t.data.includes(ZWSP) || t.data.includes(JOIN)) t.data = t.data.replaceAll(ZWSP, "").replaceAll(JOIN, "");
    if (!HAN.test(t.data) || !t.parentElement || t.parentElement.closest(SKIP)) continue;
    // 助詞不放在行首：引號後面的「的、了」用連字符黏住，空白後面的改成不換行空白（例如「Logo 的」）
    const glued = t.data.replace(/([」』）〉》])(?=[的了])/g, `$1${JOIN}`).replace(/ (?=[的了])/g, " ");
    if (glued !== t.data) t.data = glued;
    nodes.push(t);
  }
  // 逐一處理被切開的分句
  for (const node of nodes) {
    const hits = brokenAt(node, range);
    if (hits.length === 0) continue;
    let text = node.data;
    // 由後往前處理，插入字元時前面的位置不會位移
    const done = new Set<number>();
    for (const i of hits.reverse()) {
      // 找出這個位置所在分句的頭尾
      let start = i;
      while (start > 0 && !BOUNDARY.test(text[start - 1])) start--;
      let end = i;
      while (end < text.length && !BOUNDARY.test(text[end])) end++;
      if (done.has(start)) continue;
      done.add(start);
      text = addWordBreaks(text, start, end, segmenter, keep);
    }
    if (text !== node.data) node.data = text;
  }
}

// 全站斷行補強：載入後、視窗寬度改變、頁面內容變動（換頁、切換分類、搜尋結果）時重新處理
// keep：不可從中間拆開的專有名詞（客戶名稱、產品系列等，分詞字典不認得的詞）
export default function LineBreaks({ keep }: { keep: string[] }) {
  useEffect(() => {
    // 長的詞先比對，避免被較短的詞蓋過
    const terms = [...keep].sort((a, b) => b.length - a.length);
    // 瀏覽器不支援中文分詞時不處理（維持 CSS 的斷行）
    if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return;
    const segmenter = new Intl.Segmenter("zh-Hant", { granularity: "word" });
    const root = document.body;
    let timer = 0;
    let lastWidth = window.innerWidth;

    // 處理時先停止監聽，避免自己的修改又觸發重新處理
    const run = () => {
      observer.disconnect();
      fix(root, segmenter, terms);
      observer.observe(root, { childList: true, subtree: true, characterData: true });
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, 150);
    };
    // 只在寬度改變時重算（手機捲動時網址列伸縮會改變高度，不需要重算）
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      schedule();
    };

    const observer = new MutationObserver(schedule);
    // 等字型載入完成再量測，避免用備用字型的寬度判斷
    document.fonts.ready.then(run);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [keep]);

  return null;
}
