/* =========================================================
 * cards.js — 花札 48枚のデータと見た目(SVG)を作るファイル
 *
 * 花札は「1月〜12月」の12種類、各月4枚の合計48枚。
 * 1枚ずつに種類がある：
 *   光(ひかり) … 一番強い5枚
 *   タネ       … 動物や植物が描かれた9枚
 *   タン(短冊) … 短冊(細い紙)が描かれた10枚
 *   カス       … それ以外の絵札24枚
 * ========================================================= */

/* ---------- 月ごとの基本情報 ---------- */
const MONTHS = [
  null,
  { no: 1,  name: "松",   yomi: "まつ",     bg: "#173a24", bg2: "#0d2115", accent: "#8fd4a8" },
  { no: 2,  name: "梅",   yomi: "うめ",     bg: "#3a1f36", bg2: "#210f1f", accent: "#f2a6d8" },
  { no: 3,  name: "桜",   yomi: "さくら",   bg: "#5c2333", bg2: "#31111c", accent: "#ffb6c9" },
  { no: 4,  name: "藤",   yomi: "ふじ",     bg: "#2c2a5c", bg2: "#171633", accent: "#c9b8ff" },
  { no: 5,  name: "菖蒲", yomi: "あやめ",   bg: "#173a3c", bg2: "#0b2122", accent: "#8fe0e6" },
  { no: 6,  name: "牡丹", yomi: "ぼたん",   bg: "#4a1f45", bg2: "#280f26", accent: "#f2a0e0" },
  { no: 7,  name: "萩",   yomi: "はぎ",     bg: "#3a2a4a", bg2: "#1f1628", accent: "#d6b3ff" },
  { no: 8,  name: "芒",   yomi: "すすき",   bg: "#17263c", bg2: "#0b1420", accent: "#ffe9a8" },
  { no: 9,  name: "菊",   yomi: "きく",     bg: "#4a3a12", bg2: "#281f0a", accent: "#ffe08a" },
  { no: 10, name: "紅葉", yomi: "もみじ",   bg: "#4a2412", bg2: "#28130a", accent: "#ffb26b" },
  { no: 11, name: "柳",   yomi: "やなぎ",   bg: "#173a2c", bg2: "#0b2119", accent: "#9fe0c0" },
  { no: 12, name: "桐",   yomi: "きり",     bg: "#331f4a", bg2: "#1a1028", accent: "#d6a8ff" },
];

/* ---------- 48枚の定義 ----------
 * id    : 1〜48の通し番号
 * month : 1〜12
 * type  : "hikari" | "tane" | "tanzaku" | "kasu"
 * name  : 正式名称
 * ribbon: tanzakuのリボンの色 "red" | "blue" | "plain"
 * rain  : 柳の光(小野道風)は特別ルールで使うため目印
 * ------------------------------------------------------- */
const CARDS = [
  // 1月 松
  { id: 1,  month: 1,  type: "hikari",  name: "松に鶴" },
  { id: 2,  month: 1,  type: "tanzaku", name: "松に赤短", ribbon: "red" },
  { id: 3,  month: 1,  type: "kasu",    name: "松のカス" },
  { id: 4,  month: 1,  type: "kasu",    name: "松のカス" },
  // 2月 梅
  { id: 5,  month: 2,  type: "tane",    name: "梅に鶯" },
  { id: 6,  month: 2,  type: "tanzaku", name: "梅に赤短", ribbon: "red" },
  { id: 7,  month: 2,  type: "kasu",    name: "梅のカス" },
  { id: 8,  month: 2,  type: "kasu",    name: "梅のカス" },
  // 3月 桜
  { id: 9,  month: 3,  type: "hikari",  name: "桜に幕" },
  { id: 10, month: 3,  type: "tanzaku", name: "桜に赤短", ribbon: "red" },
  { id: 11, month: 3,  type: "kasu",    name: "桜のカス" },
  { id: 12, month: 3,  type: "kasu",    name: "桜のカス" },
  // 4月 藤
  { id: 13, month: 4,  type: "tane",    name: "藤にほととぎす" },
  { id: 14, month: 4,  type: "tanzaku", name: "藤の短冊", ribbon: "plain" },
  { id: 15, month: 4,  type: "kasu",    name: "藤のカス" },
  { id: 16, month: 4,  type: "kasu",    name: "藤のカス" },
  // 5月 菖蒲
  { id: 17, month: 5,  type: "tane",    name: "菖蒲に八橋" },
  { id: 18, month: 5,  type: "tanzaku", name: "菖蒲の短冊", ribbon: "plain" },
  { id: 19, month: 5,  type: "kasu",    name: "菖蒲のカス" },
  { id: 20, month: 5,  type: "kasu",    name: "菖蒲のカス" },
  // 6月 牡丹
  { id: 21, month: 6,  type: "tane",    name: "牡丹に蝶" },
  { id: 22, month: 6,  type: "tanzaku", name: "牡丹に青短", ribbon: "blue" },
  { id: 23, month: 6,  type: "kasu",    name: "牡丹のカス" },
  { id: 24, month: 6,  type: "kasu",    name: "牡丹のカス" },
  // 7月 萩
  { id: 25, month: 7,  type: "tane",    name: "萩に猪" },
  { id: 26, month: 7,  type: "tanzaku", name: "萩の短冊", ribbon: "plain" },
  { id: 27, month: 7,  type: "kasu",    name: "萩のカス" },
  { id: 28, month: 7,  type: "kasu",    name: "萩のカス" },
  // 8月 芒
  { id: 29, month: 8,  type: "hikari",  name: "芒に月" },
  { id: 30, month: 8,  type: "tane",    name: "芒に雁" },
  { id: 31, month: 8,  type: "kasu",    name: "芒のカス" },
  { id: 32, month: 8,  type: "kasu",    name: "芒のカス" },
  // 9月 菊
  { id: 33, month: 9,  type: "tane",    name: "菊に盃" },
  { id: 34, month: 9,  type: "tanzaku", name: "菊に青短", ribbon: "blue" },
  { id: 35, month: 9,  type: "kasu",    name: "菊のカス" },
  { id: 36, month: 9,  type: "kasu",    name: "菊のカス" },
  // 10月 紅葉
  { id: 37, month: 10, type: "tane",    name: "紅葉に鹿" },
  { id: 38, month: 10, type: "tanzaku", name: "紅葉に青短", ribbon: "blue" },
  { id: 39, month: 10, type: "kasu",    name: "紅葉のカス" },
  { id: 40, month: 10, type: "kasu",    name: "紅葉のカス" },
  // 11月 柳
  { id: 41, month: 11, type: "hikari",  name: "柳に小野道風", rain: true },
  { id: 42, month: 11, type: "tane",    name: "柳に燕" },
  { id: 43, month: 11, type: "tanzaku", name: "柳の短冊", ribbon: "plain" },
  { id: 44, month: 11, type: "kasu",    name: "柳のカス" },
  // 12月 桐
  { id: 45, month: 12, type: "hikari",  name: "桐に鳳凰" },
  { id: 46, month: 12, type: "kasu",    name: "桐のカス" },
  { id: 47, month: 12, type: "kasu",    name: "桐のカス" },
  { id: 48, month: 12, type: "kasu",    name: "桐のカス" },
];

const CARD_BY_ID = {};
CARDS.forEach(c => { CARD_BY_ID[c.id] = c; });

function cardOf(id) { return CARD_BY_ID[id]; }
function monthOf(id) { return MONTHS[cardOf(id).month]; }

const TYPE_LABEL = { hikari: "光", tane: "タネ", tanzaku: "タン", kasu: "カス" };

/* =========================================================
 * SVG イラスト部品
 * ========================================================= */
const SVG_NS = "http://www.w3.org/2000/svg";

function svgTag(inner, extra = "") {
  return `<g ${extra}>${inner}</g>`;
}

/* 花・葉っぱの簡単なパーツ */
function petal(cx, cy, r, color, rot = 0) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.6}" fill="${color}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}
function flower(cx, cy, r, petals, color, center = "#fff6d8") {
  let s = "";
  for (let i = 0; i < petals; i++) {
    const a = (360 / petals) * i;
    s += petal(cx, cy - r * 0.55, r * 0.55, color, a);
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${r * 0.32}" fill="${center}"/>`;
  return s;
}
function leaf(cx, cy, w, h, color, rot = 0) {
  return `<path d="M ${cx} ${cy - h} Q ${cx + w} ${cy - h / 2} ${cx} ${cy} Q ${cx - w} ${cy - h / 2} ${cx} ${cy - h} Z" fill="${color}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}
function bird(cx, cy, s, color) {
  /* 簡単な飛ぶ鳥のシルエット(V字+胴体) */
  return `
    <path d="M ${cx - s} ${cy} Q ${cx - s * 0.3} ${cy - s * 0.9} ${cx} ${cy - s * 0.15}
             Q ${cx + s * 0.3} ${cy - s * 0.9} ${cx + s} ${cy}
             Q ${cx + s * 0.3} ${cy - s * 0.25} ${cx} ${cy + s * 0.2}
             Q ${cx - s * 0.3} ${cy - s * 0.25} ${cx - s} ${cy} Z" fill="${color}"/>`;
}
function grassBlade(x, y, h, color, lean = 0) {
  return `<path d="M ${x} ${y} Q ${x + lean} ${y - h * 0.6} ${x + lean * 1.6} ${y - h}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

/* ---------- 月ごとの背景イラスト(枝・草花) ---------- */
function monthArt(month, accent) {
  switch (month) {
    case 1: // 松(まつ) — 松の枝
      return `
        <path d="M10 95 Q30 70 20 40 Q45 55 40 20" stroke="#3c6b45" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${[...Array(6)].map((_, i) => grassBlade(14 + i * 6, 60 - i * 7, 16, "#5ea86e", 6)).join("")}
        ${[...Array(5)].map((_, i) => grassBlade(24 + i * 5, 34 - i * 6, 14, "#5ea86e", -5)).join("")}
      `;
    case 2: // 梅(うめ) — 梅の枝と花
      return `
        <path d="M14 100 Q22 70 16 45 Q34 40 30 15" stroke="#5c4033" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${flower(20, 46, 9, 5, "#ffb6d5")}
        ${flower(32, 20, 8, 5, "#ffd7e8")}
        ${flower(12, 70, 6, 5, "#ffb6d5")}
      `;
    case 3: // 桜(さくら) — 満開の桜
      return `
        <path d="M12 100 Q20 78 14 55" stroke="#6b4a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${flower(18, 60, 8, 5, "#ffc2d1")}
        ${flower(34, 42, 9, 5, "#ffcbdb")}
        ${flower(22, 26, 7, 5, "#ffb6c9")}
        ${flower(40, 20, 6, 5, "#ffd6e2")}
      `;
    case 4: // 藤(ふじ) — 藤の花房
      return `
        <path d="M40 10 Q30 12 28 20" stroke="#6b5a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${[0, 1, 2, 3, 4].map(i => `<ellipse cx="${30 - i * 2}" cy="${24 + i * 13}" rx="13" ry="8" fill="#b8a6ff" opacity="${0.95 - i * 0.08}"/>`).join("")}
      `;
    case 5: // 菖蒲(あやめ) — 剣状の葉と花
      return `
        ${[...Array(5)].map((_, i) => grassBlade(14 + i * 7, 100, 60 - i * 4, "#3f7a6e", i % 2 ? 8 : -8)).join("")}
        <path d="M40 32 Q34 20 42 12 Q50 20 44 32 Z" fill="#7fd6d6"/>
        <path d="M40 32 Q46 28 50 34 Q44 40 40 32 Z" fill="#5cc2c2"/>
      `;
    case 6: // 牡丹(ぼたん) — 大きな牡丹
      return `
        ${flower(28, 46, 15, 8, "#f2a0e0", "#fff1fb")}
        ${leaf(14, 70, 10, 22, "#3f8a4a")}
        ${leaf(42, 66, 10, 20, "#3f8a4a", 20)}
      `;
    case 7: // 萩(はぎ) — 小さな萩の花房
      return `
        <path d="M14 100 Q30 70 22 40" stroke="#6b5a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
        ${[...Array(7)].map((_, i) => `<circle cx="${16 + (i % 4) * 7}" cy="${42 + Math.floor(i / 4) * 10}" r="4.5" fill="#d6a0e0"/>`).join("")}
      `;
    case 8: // 芒(すすき) — 穂の草
      return `
        ${[...Array(5)].map((_, i) => grassBlade(12 + i * 8, 100, 70 - i * 6, "#c9a86b", i % 2 ? 10 : -10)).join("")}
        ${[...Array(5)].map((_, i) => `<ellipse cx="${12 + i * 8 + (i % 2 ? 16 : -16)}" cy="${30 - i * 6}" rx="4" ry="10" fill="#e8d9ad" transform="rotate(${i % 2 ? 20 : -20} ${12 + i * 8} ${30 - i * 6})"/>`).join("")}
      `;
    case 9: // 菊(きく) — 菊の花
      return `
        ${flower(28, 44, 14, 10, "#ffd75e", "#fff6d0")}
        ${leaf(14, 68, 9, 18, "#4a7a3a")}
      `;
    case 10: // 紅葉(もみじ) — もみじ葉(5つに分かれた葉のシルエット)
      return `
        <path d="M30 62
          C 27 54 20 52 15 44
          C 21 44 25 40 25 33
          C 19 30 15 22 13 14
          C 20 16 26 20 28 27
          C 29 18 29 10 30 4
          C 31 10 31 18 32 27
          C 34 20 40 16 47 14
          C 45 22 41 30 35 33
          C 35 40 39 44 45 44
          C 40 52 33 54 30 62 Z"
          fill="#e8863a" stroke="#c96a28" stroke-width="1"/>
        <path d="M30 62 L30 33" stroke="#c96a28" stroke-width="1.6" opacity=".7"/>
      `;
    case 11: // 柳(やなぎ) — しだれ柳
      return `
        <path d="M30 8 Q30 30 30 40" stroke="#4a6b4a" stroke-width="4" fill="none"/>
        ${[...Array(6)].map((_, i) => `<path d="M${16 + i * 5} 40 Q${14 + i * 5} 70 ${12 + i * 5} 100" stroke="#5c8a5c" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join("")}
      `;
    case 12: // 桐(きり) — 桐の葉と花穂
      return `
        <path d="M30 70 Q16 60 20 42 Q30 50 30 34 Q40 50 42 42 Q46 60 30 70 Z" fill="#5c8a5c"/>
        ${[0, 1, 2].map(i => `<ellipse cx="${30 + (i - 1) * 6}" cy="${24 - i * 3}" rx="4" ry="7" fill="#c9a0e0"/>`).join("")}
      `;
    default: return "";
  }
}

/* ---------- 種類ごとのメインモチーフ ---------- */
function typeArt(card) {
  switch (card.id) {
    case 1: return bird(48, 34, 20, "#fbfbf6") + bird(60, 50, 13, "#fbfbf6"); // 松に鶴
    case 5: return `<circle cx="50" cy="40" r="9" fill="#e8e0b0"/><circle cx="50" cy="40" r="9" fill="#e8e0b0"/><path d="M50 40 q10 -4 14 4" stroke="#e8e0b0" stroke-width="4" fill="none" stroke-linecap="round"/>`; // 梅に鶯
    case 9: return `<path d="M20 20 Q50 8 80 20 L80 46 Q50 34 20 46 Z" fill="#d8433f"/><circle cx="30" cy="22" r="3" fill="#f6d34a"/><circle cx="70" cy="22" r="3" fill="#f6d34a"/>`; // 桜に幕
    case 13: return bird(56, 40, 15, "#f6f2e0"); // 藤にほととぎす
    case 17: return `<path d="M18 66 L36 50 L50 62 L64 46 L82 60" stroke="#8a6a4a" stroke-width="6" fill="none" stroke-linecap="round"/>`; // 菖蒲に八橋
    case 21: return `<ellipse cx="46" cy="36" rx="12" ry="9" fill="#ffd75e" transform="rotate(-18 46 36)"/><ellipse cx="66" cy="40" rx="12" ry="9" fill="#ffb84a" transform="rotate(18 66 40)"/><circle cx="56" cy="38" r="3" fill="#5a3a1a"/>`; // 牡丹に蝶
    case 25: return `<ellipse cx="56" cy="46" rx="20" ry="13" fill="#6b4a35"/><path d="M74 40 l8 -4" stroke="#6b4a35" stroke-width="5" stroke-linecap="round"/><circle cx="40" cy="42" r="2.4" fill="#241a10"/>`; // 萩に猪
    case 29: return `<circle cx="60" cy="30" r="16" fill="#ffe9a0"/>`; // 芒に月
    case 30: return bird(50, 30, 12, "#f2e9cf") + bird(66, 22, 10, "#f2e9cf"); // 芒に雁
    case 33: return `<path d="M46 40 Q46 54 60 54 Q74 54 74 40 Z" fill="#e8dcc0"/><rect x="58" y="54" width="4" height="10" fill="#e8dcc0"/>`; // 菊に盃
    case 37: return `<path d="M60 54 q-4 -20 8 -26 q10 4 4 16 q10 -6 12 4 q-6 8 -14 6 q6 8 -4 10 q-8 -2 -6 -10 Z" fill="#a06a3c"/><circle cx="46" cy="46" r="2.3" fill="#2a1a0a"/>`; // 紅葉に鹿(簡易シルエット)
    case 41: return `<circle cx="58" cy="26" r="10" fill="#f2f2e0"/>` + `<path d="M40 60 q10 -6 18 2" stroke="#c9e0ff" stroke-width="4" fill="none" stroke-linecap="round"/>`; // 柳に小野道風(月+傘の簡略)
    case 42: return bird(58, 42, 14, "#f2f2e0"); // 柳に燕
    case 45: return `<path d="M30 50 Q45 20 60 50 Q45 34 30 50 Z" fill="#f2e9ff"/><path d="M60 50 Q75 20 90 50 Q75 34 60 50 Z" fill="#f2e9ff" transform="translate(-14 0)"/>`; // 桐に鳳凰(簡易)
    default: return "";
  }
}

/* 短冊(タンザク) */
function ribbonArt(color) {
  const map = { red: "#c94040", blue: "#3a5fbf", plain: "#f2ecd8" };
  const fill = map[color] || map.plain;
  const textColor = color === "plain" ? "#8a6a3a" : "#fef6da";
  return `
    <rect x="58" y="10" width="20" height="52" rx="3" fill="${fill}" stroke="rgba(0,0,0,.25)"/>
    <line x1="63" y1="18" x2="63" y2="54" stroke="${textColor}" stroke-width="1.4" opacity=".8"/>
    <line x1="68" y1="18" x2="68" y2="54" stroke="${textColor}" stroke-width="1.4" opacity=".8"/>
    <line x1="73" y1="18" x2="73" y2="54" stroke="${textColor}" stroke-width="1.4" opacity=".8"/>
  `;
}

const TYPE_BADGE = { hikari: "#ffe9a0", tane: "#a8e0b0", tanzaku: "#f2c2c2", kasu: "#cfd6de" };

/* ---------- カード表面のSVGを組み立てる ---------- */
function cardFaceSVG(id) {
  const c = cardOf(id);
  const m = MONTHS[c.month];
  const badge = TYPE_BADGE[c.type];
  let art = monthArt(c.month, m.accent);
  art += typeArt(c);
  if (c.type === "tanzaku") art += ribbonArt(c.ribbon);
  return `
  <svg viewBox="0 0 100 148" xmlns="${SVG_NS}" class="card-face-svg">
    <defs>
      <linearGradient id="bgGrad${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${m.bg}"/>
        <stop offset="1" stop-color="${m.bg2}"/>
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="97" height="145" rx="9" fill="url(#bgGrad${id})" stroke="#f2ecd8" stroke-width="2.4"/>
    <rect x="5" y="5" width="90" height="138" rx="6" fill="none" stroke="${m.accent}" stroke-width="1" opacity=".45"/>
    <g transform="translate(0,52)">${art}</g>
    <circle cx="15" cy="16" r="11" fill="rgba(0,0,0,.28)" stroke="${badge}" stroke-width="1.4"/>
    <text x="15" y="21" text-anchor="middle" font-size="13" font-family="'Shippori Mincho B1',serif" fill="${badge}" font-weight="700">${m.no}</text>
  </svg>`;
}

/* ---------- カード裏面のSVG(共通デザイン) ---------- */
function cardBackSVG() {
  return `
  <svg viewBox="0 0 100 148" xmlns="${SVG_NS}" class="card-back-svg">
    <defs>
      <linearGradient id="backGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3a1420"/>
        <stop offset="1" stop-color="#170810"/>
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="97" height="145" rx="9" fill="url(#backGrad)" stroke="#d9b45c" stroke-width="2.4"/>
    <rect x="8" y="8" width="84" height="132" rx="6" fill="none" stroke="#d9b45c" stroke-width="1.2" opacity=".6"/>
    <circle cx="50" cy="74" r="30" fill="none" stroke="#d9b45c" stroke-width="1" opacity=".5"/>
    <text x="50" y="83" text-anchor="middle" font-size="30" font-family="'Shippori Mincho B1',serif" fill="#d9b45c" opacity=".85">花</text>
  </svg>`;
}
