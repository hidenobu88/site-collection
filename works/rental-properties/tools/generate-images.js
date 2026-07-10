// ============================================================
// ダミー画像(SVG)ジェネレーター
//   node tools/generate-images.js
// で images/buildings/*.svg(外観)と images/rooms/*.svg(内装)を生成します。
// 実写真に差し替える場合は js/data.js の images を書き換えてください。
// ============================================================
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const dataSrc = fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8");
const { BUILDINGS, ROOMS } = new Function(dataSrc + "; return { BUILDINGS, ROOMS };")();

// 決定的な擬似乱数(idごとに毎回同じ絵になる)
function hash(str) {
  let h = 2166136261;
  for (const c of str) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

const W = 800, H = 500;

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${body}</svg>`;
}

// 建物のグレード判定
function gradeOf(building) {
  const age = 2026 - building.builtYear;
  if (building.type === "apartment") return age >= 30 ? "old" : "normal";
  if (building.type === "mansion") return age >= 15 ? "mid" : "good";
  return building.builtYear >= 2023 ? "luxury" : "tower";
}

// ---------------- 外観 ----------------
function skyFor(grade) {
  const skies = {
    old: ["#cdd6d3", "#e4e8e2"],
    normal: ["#aed4e6", "#e3f0f2"],
    mid: ["#9fc9e8", "#ddeef7"],
    good: ["#8bc0ea", "#d8ecfa"],
    tower: ["#6ea7d8", "#cfe6f7"],
    luxury: ["#4a6fa5", "#e8c9a8"]
  };
  const [a, b] = skies[grade];
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>`;
}

function clouds(seed) {
  let out = "";
  for (let i = 0; i < 3; i++) {
    const x = (seed * (i + 3)) % (W - 160) + 40;
    const y = 40 + ((seed >> (i + 2)) % 70);
    out += `<g fill="#ffffff" opacity="0.75">
      <ellipse cx="${x}" cy="${y}" rx="46" ry="16"/>
      <ellipse cx="${x + 30}" cy="${y - 10}" rx="30" ry="13"/>
      <ellipse cx="${x - 32}" cy="${y - 6}" rx="26" ry="11"/></g>`;
  }
  return out;
}

function ground(color) {
  return `<rect y="430" width="${W}" height="70" fill="${color}"/>`;
}

function tree(x, y, s = 1) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-5" y="-18" width="10" height="26" fill="#8a6a4d"/>
    <circle cx="0" cy="-42" r="30" fill="#6da06b"/>
    <circle cx="-20" cy="-28" r="20" fill="#7cb079"/>
    <circle cx="20" cy="-28" r="20" fill="#639763"/></g>`;
}

function apartmentExterior(b, seed) {
  const old = gradeOf(b) === "old";
  const wall = old ? "#b9aa93" : "#e9e2d2";
  const wallShade = old ? "#a3937c" : "#d8cfba";
  const roof = old ? "#6d6258" : "#8d7f6d";
  const door = old ? pick(["#7c6a52", "#5f6e75"], seed) : pick(["#3f7f78", "#7c5b45"], seed);
  const bx = 150, bw = 470, by = 175, bh = 255;

  // 各階の扉と窓
  let units = "";
  for (let f = 0; f < 2; f++) {
    const y = by + 34 + f * 128;
    for (let i = 0; i < 4; i++) {
      const x = bx + 30 + i * 112;
      units += `<rect x="${x}" y="${y}" width="34" height="76" fill="${door}" stroke="#4a4238" stroke-width="2"/>
        <circle cx="${x + 28}" cy="${y + 40}" r="2.5" fill="#d8c66a"/>
        <rect x="${x + 46}" y="${y + 8}" width="44" height="44" fill="#bcd6de" stroke="#6a6a5f" stroke-width="3"/>
        <line x1="${x + 68}" y1="${y + 8}" x2="${x + 68}" y2="${y + 52}" stroke="#6a6a5f" stroke-width="2"/>`;
      if (old) units += `<rect x="${x + 46}" y="${y + 56}" width="20" height="14" fill="#9aa3a5" stroke="#7b8385"/>`; // 室外機
    }
    // 廊下・手すり
    units += `<rect x="${bx - 8}" y="${y + 78}" width="${bw + 16}" height="10" fill="${wallShade}"/>
      <line x1="${bx - 8}" y1="${y - 14}" x2="${bx + bw + 8}" y2="${y - 14}" stroke="${old ? "#8d9598" : "#9fb4ae"}" stroke-width="4"/>`;
  }

  // 外壁の汚れ(古い場合)
  let stains = "";
  if (old) {
    for (let i = 0; i < 6; i++) {
      const x = bx + ((seed * (i + 7)) % (bw - 60)) + 20;
      const y = by + 50 + ((seed >> i) % (bh - 120));
      stains += `<ellipse cx="${x}" cy="${y}" rx="${18 + (i % 3) * 8}" ry="8" fill="#8f8069" opacity="0.35"/>`;
    }
    stains += `<path d="M${bx + 40} ${by} v40 M${bx + bw - 60} ${by} v56" stroke="#8f8069" stroke-width="6" opacity="0.4"/>`;
  }

  // 外階段
  const stair = `<g stroke="${old ? "#7d8487" : "#8fa39c"}" stroke-width="5" fill="none">
    <path d="M${bx + bw + 4} 430 L${bx + bw + 44} 430 L${bx + bw + 44} ${by + 20}"/>
    ${Array.from({ length: 8 }, (_, i) => `<line x1="${bx + bw + 4}" y1="${300 + i * 16}" x2="${bx + bw + 44}" y2="${292 + i * 16}"/>`).join("")}
  </g>`;

  return svg(
    skyFor(gradeOf(b)) + clouds(seed) + ground(old ? "#b0a58e" : "#c6cdb4") +
    `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${wall}"/>` +
    `<rect x="${bx - 14}" y="${by - 22}" width="${bw + 28}" height="26" fill="${roof}"/>` +
    stains + units + stair +
    tree(90, 432, 1.1) + tree(730, 434, 0.9) +
    `<rect x="60" y="446" width="680" height="4" fill="#9a927e" opacity="0.5"/>`
  );
}

function mansionExterior(b, seed) {
  const grade = gradeOf(b);
  const isNew = grade === "good";
  const wall = isNew ? "#f2f1ec" : "#ddd9cf";
  const accent = isNew ? pick(["#3f7f78", "#4a6b8a", "#8a6b4a"], seed) : "#9a9484";
  const floors = Math.min(b.totalFloors, 9);
  const fh = 34;
  const bw2 = 320, bx = 240;
  const by = 430 - floors * fh - 16;

  let body = `<rect x="${bx}" y="${by}" width="${bw2}" height="${430 - by}" fill="${wall}"/>
    <rect x="${bx}" y="${by - 12}" width="${bw2}" height="12" fill="${accent}"/>`;

  for (let f = 0; f < floors; f++) {
    const y = by + 8 + f * fh;
    // バルコニーと窓
    body += `<rect x="${bx + 12}" y="${y + 4}" width="${bw2 - 24}" height="${fh - 14}" fill="#b9d3dc" stroke="#8b8f88" stroke-width="2"/>`;
    for (let i = 1; i < 4; i++) {
      body += `<line x1="${bx + 12 + i * (bw2 - 24) / 4}" y1="${y + 4}" x2="${bx + 12 + i * (bw2 - 24) / 4}" y2="${y + fh - 10}" stroke="#8b8f88" stroke-width="2"/>`;
    }
    body += `<line x1="${bx + 8}" y1="${y + fh - 8}" x2="${bx + bw2 - 8}" y2="${y + fh - 8}" stroke="${accent}" stroke-width="4" opacity="0.85"/>`;
  }

  // エントランス
  body += `<rect x="${bx + bw2 / 2 - 34}" y="382" width="68" height="48" fill="#5d6b70"/>
    <rect x="${bx + bw2 / 2 - 40}" y="372" width="80" height="10" fill="${accent}"/>
    <rect x="${bx + bw2 / 2 - 12}" y="392" width="24" height="38" fill="#cfe4ea"/>`;

  return svg(
    skyFor(grade) + clouds(seed) + ground("#c2c9b3") + body +
    tree(150, 434, 1.2) + tree(660, 434, 1.0) + tree(710, 436, 0.7) +
    `<rect x="120" y="428" width="560" height="6" fill="#a7ad97"/>`
  );
}

function towerExterior(b, seed) {
  const grade = gradeOf(b);
  const lux = grade === "luxury";
  const glassTop = lux ? "#2e4a6b" : "#6f9cc4";
  const glassBottom = lux ? "#7d9cc0" : "#d6e8f4";
  const bw2 = lux ? 190 : 150;
  const bx = (W - bw2) / 2;
  const by = lux ? 42 : 76;

  // 背景ビル群
  let bg = "";
  const bgc = lux ? "#5a6f8d" : "#a9bfd2";
  [[90, 250], [190, 320], [560, 300], [660, 230]].forEach(([x, y], i) => {
    bg += `<rect x="${x}" y="${y}" width="${70 + (seed >> i) % 30}" height="${430 - y}" fill="${bgc}" opacity="0.8"/>`;
  });

  // 窓グリッド
  let windows = "";
  for (let y = by + 26; y < 414; y += 22) {
    windows += `<line x1="${bx + 8}" y1="${y}" x2="${bx + bw2 - 8}" y2="${y}" stroke="#ffffff" stroke-width="1.6" opacity="0.5"/>`;
  }
  for (let i = 1; i < 5; i++) {
    windows += `<line x1="${bx + i * bw2 / 5}" y1="${by + 14}" x2="${bx + i * bw2 / 5}" y2="428" stroke="#ffffff" stroke-width="1.6" opacity="0.35"/>`;
  }

  const sun = lux
    ? `<circle cx="620" cy="150" r="36" fill="#f6c266" opacity="0.9"/>`
    : `<circle cx="160" cy="90" r="28" fill="#fff3c9" opacity="0.9"/>`;

  return svg(
    skyFor(grade) + sun + clouds(seed) + bg + ground(lux ? "#6d7a6b" : "#b9c3ae") +
    `<defs><linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${glassTop}"/><stop offset="1" stop-color="${glassBottom}"/>
    </linearGradient></defs>
    <rect x="${bx}" y="${by}" width="${bw2}" height="${430 - by}" rx="10" fill="url(#glass)"/>
    <rect x="${bx - 12}" y="418" width="${bw2 + 24}" height="12" fill="${lux ? "#3c4a5c" : "#7b8ba0"}"/>
    <rect x="${bx + bw2 / 2 - 2}" y="${by - 26}" width="4" height="26" fill="${lux ? "#c9a86a" : "#7b8ba0"}"/>
    ${lux ? `<rect x="${bx}" y="${by + 10}" width="${bw2}" height="6" fill="#c9a86a" opacity="0.9"/>` : ""}
    ${windows}` +
    tree(110, 434, 1.0) + tree(690, 434, 1.1)
  );
}

function exteriorSVG(b, seed) {
  if (b.type === "apartment") return apartmentExterior(b, seed);
  if (b.type === "mansion") return mansionExterior(b, seed);
  return towerExterior(b, seed);
}

// ---------------- 内装 ----------------
function windowView(kind) {
  if (kind === "city") {
    return `<rect width="150" height="150" fill="#bcd8ee"/>
      <rect x="8" y="52" width="26" height="60" fill="#8fa8bd"/>
      <rect x="42" y="34" width="30" height="78" fill="#7b96ad"/>
      <rect x="80" y="60" width="24" height="52" fill="#9db3c6"/>
      <rect x="112" y="42" width="30" height="70" fill="#87a1b6"/>
      <circle cx="120" cy="20" r="12" fill="#fff3c9"/>`;
  }
  if (kind === "night") {
    return `<rect width="150" height="150" fill="#2c3b57"/>
      <rect x="8" y="48" width="26" height="64" fill="#1d2a40"/>
      <rect x="44" y="30" width="30" height="82" fill="#16223655"/>
      <rect x="44" y="30" width="30" height="82" fill="#1a2739"/>
      <rect x="82" y="56" width="24" height="56" fill="#212f47"/>
      <g fill="#f2d98c"><rect x="12" y="56" width="5" height="5"/><rect x="22" y="70" width="5" height="5"/>
      <rect x="50" y="40" width="5" height="5"/><rect x="60" y="58" width="5" height="5"/>
      <rect x="88" y="64" width="5" height="5"/><rect x="50" y="84" width="5" height="5"/></g>
      <circle cx="118" cy="22" r="10" fill="#e8e3d2"/>`;
  }
  // green(低層・郊外)
  return `<rect width="150" height="150" fill="#cfe6f0"/>
    <circle cx="30" cy="96" r="26" fill="#7cb079"/>
    <circle cx="70" cy="104" r="30" fill="#6da06b"/>
    <circle cx="112" cy="98" r="24" fill="#8abd85"/>
    <rect y="112" width="150" height="38" fill="#a4c48f"/>
    <circle cx="116" cy="24" r="12" fill="#fff3c9"/>`;
}

function tatamiFloor() {
  let mats = "";
  for (let i = 0; i < 4; i++) {
    mats += `<line x1="${i * 200}" y1="360" x2="${100 + i * 200}" y2="500" stroke="#96a476" stroke-width="3"/>`;
  }
  return `<rect y="360" width="${W}" height="140" fill="#b4bf8e"/>
    <rect y="360" width="${W}" height="140" fill="url(#tatamiTex)"/>
    <line x1="0" y1="428" x2="${W}" y2="428" stroke="#96a476" stroke-width="3"/>${mats}
    <defs><pattern id="tatamiTex" width="8" height="8" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#a8b482" stroke-width="1.4"/></pattern></defs>`;
}

function woodFloor(light) {
  const base = light ? "#d9bd94" : "#8a6a4e";
  const line = light ? "#c4a87e" : "#75593f";
  let planks = "";
  for (let i = 1; i < 5; i++) {
    planks += `<line x1="0" y1="${360 + i * 28}" x2="${W}" y2="${360 + i * 28}" stroke="${line}" stroke-width="2"/>`;
  }
  for (let i = 0; i < 8; i++) {
    planks += `<line x1="${60 + i * 100}" y1="${360 + (i % 5) * 28}" x2="${60 + i * 100}" y2="${360 + ((i % 5) + 1) * 28}" stroke="${line}" stroke-width="2"/>`;
  }
  return `<rect y="360" width="${W}" height="140" fill="${base}"/>${planks}`;
}

function interiorSVG(room, building, seed) {
  const grade = gradeOf(building);
  const isTatami = room.tags.includes("和室");
  const lux = grade === "luxury" || (grade === "tower" && room.rent >= 250000);
  const highFloor = room.floor >= 10;

  // 壁の色
  const wallColors = {
    old: "#d9d2bd", normal: "#ece7d8", mid: "#efece2",
    good: "#f4f2ec", tower: "#f2f0ea", luxury: "#e8e2d4"
  };
  const wall = isTatami ? "#e3dcc2" : wallColors[grade];
  const view = lux || highFloor ? (lux ? "night" : "city") : "green";

  // 窓
  const winX = 120 + (seed % 80);
  const winW = lux ? 340 : 230;
  const winY = lux ? 96 : 116;
  const winH = lux ? 200 : 150;
  const frame = grade === "old" ? "#8f9698" : lux ? "#4c4436" : "#8b8f88";

  const windowEl = `
    <g>
      <clipPath id="winClip"><rect x="${winX}" y="${winY}" width="${winW}" height="${winH}"/></clipPath>
      <g clip-path="url(#winClip)">
        <g transform="translate(${winX},${winY}) scale(${winW / 150},${winH / 150})">
          ${windowView(view)}
        </g>
      </g>
      <rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="none" stroke="${frame}" stroke-width="7"/>
      <line x1="${winX + winW / 2}" y1="${winY}" x2="${winX + winW / 2}" y2="${winY + winH}" stroke="${frame}" stroke-width="5"/>
    </g>`;

  // 家具
  let furniture = "";
  if (isTatami) {
    furniture = `
      <rect x="520" y="392" width="150" height="18" rx="4" fill="#7a5a3e"/>
      <rect x="535" y="410" width="14" height="26" fill="#6b4e35"/><rect x="641" y="410" width="14" height="26" fill="#6b4e35"/>
      <ellipse cx="595" cy="386" rx="26" ry="8" fill="#b05555" opacity="0.9"/>
      <rect x="90" y="300" width="60" height="60" fill="#d8cfae" stroke="#a89e7c" stroke-width="3"/>`; // 座卓+座布団+障子風
  } else if (lux) {
    furniture = `
      <rect x="490" y="368" width="220" height="52" rx="12" fill="#4c5560"/>
      <rect x="500" y="344" width="200" height="30" rx="10" fill="#5d6772"/>
      <rect x="470" y="410" width="24" height="24" fill="#3a424c"/><rect x="706" y="410" width="24" height="24" fill="#3a424c"/>
      <ellipse cx="380" cy="440" rx="180" ry="34" fill="#b8ad98" opacity="0.7"/>
      <rect x="120" y="380" width="90" height="44" rx="6" fill="#6e5a41"/>
      <circle cx="${winX + winW + 60}" cy="200" r="14" fill="#f2d98c"/>
      <line x1="${winX + winW + 60}" y1="80" x2="${winX + winW + 60}" y2="186" stroke="#4c4436" stroke-width="3"/>`;
  } else {
    const sofa = pick(["#5f7d74", "#7d6a5a", "#5a6b7d"], seed);
    furniture = `
      <rect x="500" y="376" width="180" height="46" rx="10" fill="${sofa}"/>
      <rect x="508" y="352" width="164" height="28" rx="8" fill="${sofa}" opacity="0.85"/>
      <rect x="140" y="388" width="110" height="14" rx="4" fill="#9a7c5c"/>
      <rect x="150" y="402" width="12" height="30" fill="#86683f"/><rect x="228" y="402" width="12" height="30" fill="#86683f"/>`;
  }

  // 観葉植物(半分の部屋に)
  const plant = (seed % 2 === 0 || lux) ? `
    <g transform="translate(${seed % 3 === 0 ? 70 : 730}, 402)">
      <rect x="-16" y="0" width="32" height="30" fill="#a5674f"/>
      <path d="M0 0 C -30 -34 -8 -60 0 -66 C 8 -60 30 -34 0 0" fill="#5f8f5f"/>
      <path d="M-4 -6 C -40 -20 -36 -48 -28 -56" fill="none" stroke="#5f8f5f" stroke-width="7"/>
      <path d="M4 -6 C 40 -20 36 -48 28 -56" fill="none" stroke="#54815a" stroke-width="7"/>
    </g>` : "";

  // 照明
  const light = lux
    ? `<g stroke="#4c4436" stroke-width="3"><line x1="560" y1="60" x2="560" y2="120"/><line x1="620" y1="60" x2="620" y2="110"/></g>
       <circle cx="560" cy="132" r="13" fill="#f2d98c"/><circle cx="620" cy="122" r="13" fill="#f2d98c"/>`
    : `<line x1="400" y1="0" x2="400" y2="66" stroke="#c9c4ae" stroke-width="4"/>
       <ellipse cx="400" cy="76" rx="52" ry="14" fill="#f5f2e4" stroke="#c9c4ae" stroke-width="3"/>`;

  // 床
  const floor = isTatami ? tatamiFloor() : woodFloor(!(grade === "old"));

  // 古い部屋は畳/壁のシミ
  let wear = "";
  if (grade === "old") {
    wear = `<ellipse cx="220" cy="180" rx="34" ry="14" fill="#b3a785" opacity="0.5"/>
      <ellipse cx="640" cy="140" rx="26" ry="10" fill="#b3a785" opacity="0.45"/>`;
  }

  return svg(`
    <rect width="${W}" height="360" fill="${wall}"/>
    <rect y="348" width="${W}" height="12" fill="${grade === "old" ? "#a89c82" : "#cfc9b8"}"/>
    ${wear}${windowEl}${light}${floor}${furniture}${plant}`);
}

// ---------------- 生成 ----------------
fs.mkdirSync(path.join(ROOT, "images/buildings"), { recursive: true });
fs.mkdirSync(path.join(ROOT, "images/rooms"), { recursive: true });

for (const b of BUILDINGS) {
  fs.writeFileSync(path.join(ROOT, `images/buildings/${b.id}.svg`), exteriorSVG(b, hash(b.id)));
}

for (const r of ROOMS) {
  const b = BUILDINGS.find((x) => x.id === r.buildingId);
  fs.writeFileSync(path.join(ROOT, `images/rooms/${r.id}.svg`), interiorSVG(r, b, hash(r.id)));
}

console.log(`生成完了: 外観 ${BUILDINGS.length}枚 / 内装 ${ROOMS.length}枚`);
