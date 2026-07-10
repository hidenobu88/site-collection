/* ============================================
   もふもふパーク - スクリプト
   ・猫12種 / 犬12種のデータ
   ・種類ごとの特徴を描き分けるSVGイラスト生成
   ・エサやり / なでる / 遊ぶ のインタラクション
   ============================================ */

// ---------- 動物データ ----------
// ear: cat(立ち耳) / fold(折れ耳) / dogUp(犬の立ち耳) / floppy(垂れ耳) /
//      bat(バットイヤー) / fluffRound(まるいふわ耳)
// extras: tabby(縞) / mask(マスク模様) / points(ポイントカラー) / spots(斑点) /
//         fluff(ほお毛ふわ) / muzzle(白いマズル) / blaze(額の白ライン) /
//         patch(片目の模様) / topknot(頭のもこもこ) / tongue(ぺろっと舌)
// eye: dark / blue / green / copper

const CATS = [
  {
    breed: "マンチカン", name: "むぎ", origin: "アメリカ", size: "小型",
    personality: "短い足でちょこちょこ歩く人なつっこい甘えん坊。",
    like: "ボールを追いかけっこ",
    bg: "#ffe3ec", base: "#e8c48a", dark: "#c99a5b", eye: "dark",
    ear: "cat", extras: ["tabby"]
  },
  {
    breed: "スコティッシュフォールド", name: "まる", origin: "スコットランド", size: "小型",
    personality: "折れ耳とまんまる顔がチャームポイント。おっとりマイペース。",
    like: "ひざの上でお昼寝",
    bg: "#e3f0ff", base: "#cfcfcf", dark: "#a8a8a8", eye: "copper",
    ear: "fold", extras: []
  },
  {
    breed: "ペルシャ", name: "シルク", origin: "イラン(ペルシャ)", size: "中型",
    personality: "長毛ふわふわの気品あふれるお姫様。静かな場所が好き。",
    like: "ブラッシングされること",
    bg: "#f0e6ff", base: "#f5efe6", dark: "#d8cbb8", eye: "copper",
    ear: "cat", extras: ["fluff"]
  },
  {
    breed: "アメリカンショートヘア", name: "ソーダ", origin: "アメリカ", size: "中型",
    personality: "渦巻き模様のシルバータビー。好奇心旺盛な遊びの達人。",
    like: "ねずみのおもちゃ",
    bg: "#e0f5f1", base: "#d9dde3", dark: "#8f98a5", eye: "green",
    ear: "cat", extras: ["tabby"]
  },
  {
    breed: "ロシアンブルー", name: "ミスト", origin: "ロシア", size: "中型",
    personality: "ビロードのような銀灰色の毛並み。物静かで一途な性格。",
    like: "決まった人にだけ甘えること",
    bg: "#e8ecf5", base: "#adbcc9", dark: "#8b9dad", eye: "green",
    ear: "cat", extras: []
  },
  {
    breed: "ノルウェージャンフォレストキャット", name: "ゆき", origin: "ノルウェー", size: "大型",
    personality: "北欧育ちのもふもふ長毛。大きな体でおおらかな性格。",
    like: "高いキャットタワーのてっぺん",
    bg: "#e3f0ff", base: "#e9e2d5", dark: "#b78d5e", eye: "green",
    ear: "cat", extras: ["fluff", "tabby"]
  },
  {
    breed: "ベンガル", name: "レオ", origin: "アメリカ", size: "中型",
    personality: "ヒョウ柄がかっこいい運動神経バツグンのわんぱく担当。",
    like: "ジャンプで猫じゃらしキャッチ",
    bg: "#fff0d9", base: "#e0a95e", dark: "#8a5a24", eye: "green",
    ear: "cat", extras: ["spots"]
  },
  {
    breed: "ラグドール", name: "もち", origin: "アメリカ", size: "大型",
    personality: "抱っこされると脱力する「ぬいぐるみ」みたいな癒やし系。",
    like: "抱っこでうとうと",
    bg: "#ffe3ec", base: "#f3ede4", dark: "#b7a28e", eye: "blue",
    ear: "cat", extras: ["points", "fluff"]
  },
  {
    breed: "シャム(サイアミーズ)", name: "ラテ", origin: "タイ", size: "中型",
    personality: "サファイア色の瞳のおしゃべりさん。よく鳴いてお話しします。",
    like: "スタッフとおしゃべり",
    bg: "#e0f5f1", base: "#efe3cf", dark: "#6b5340", eye: "blue",
    ear: "cat", extras: ["points"]
  },
  {
    breed: "メインクーン", name: "ボス", origin: "アメリカ", size: "大型",
    personality: "猫界最大級の「穏やかな巨人」。どっしり構えた頼れる存在。",
    like: "みんなの遊びを見守ること",
    bg: "#fff0d9", base: "#b98a5f", dark: "#8a5f3a", eye: "copper",
    ear: "cat", extras: ["fluff", "tabby"]
  },
  {
    breed: "ブリティッシュショートヘア", name: "アール", origin: "イギリス", size: "中型",
    personality: "まんまるフェイスの英国紳士。落ち着いていて撫でられ上手。",
    like: "ゆったりなでなでタイム",
    bg: "#e8ecf5", base: "#8c97a6", dark: "#6f7a89", eye: "copper",
    ear: "cat", extras: []
  },
  {
    breed: "アビシニアン", name: "サニー", origin: "エチオピア", size: "小型",
    personality: "しなやかボディの元気いっぱいアイドル。よく動きよく遊ぶ！",
    like: "追いかけっこと日なたぼっこ",
    bg: "#ffe9d6", base: "#d98f57", dark: "#b06a35", eye: "green",
    ear: "cat", extras: []
  },
];

const DOGS = [
  {
    breed: "ゴールデンレトリバー", name: "マロン", origin: "イギリス", size: "大型",
    personality: "みんな大好き！やさしくて賢い、お店の看板犬です。",
    like: "ボールの持ってこい遊び",
    bg: "#fff0d9", base: "#e6b86a", dark: "#d19a45", eye: "dark",
    ear: "floppy", extras: ["muzzle", "tongue"]
  },
  {
    breed: "ポメラニアン", name: "ポポ", origin: "ドイツ", size: "小型",
    personality: "ふわっふわの毛玉ボディ。ちょこちょこ歩く姿にファン多数。",
    like: "くるくる回ってアピール",
    bg: "#ffe3ec", base: "#f0c27d", dark: "#d9a55c", eye: "dark",
    ear: "fluffRound", extras: []
  },
  {
    breed: "柴犬", name: "こたろう", origin: "日本", size: "中型",
    personality: "きりっとした顔立ちの日本代表。実は甘えん坊な一面も。",
    like: "お散歩ごっことおやつ",
    bg: "#ffe9d6", base: "#de9a55", dark: "#c47f3c", eye: "dark",
    ear: "dogUp", extras: ["muzzle"]
  },
  {
    breed: "トイプードル", name: "ショコラ", origin: "フランス", size: "小型",
    personality: "くるくる巻き毛のおりこうさん。芸達者でお手も得意！",
    like: "新しい芸を覚えること",
    bg: "#f0e6ff", base: "#8a5a3b", dark: "#6e452c", eye: "dark",
    ear: "fluffRound", extras: ["topknot"]
  },
  {
    breed: "チワワ", name: "ピコ", origin: "メキシコ", size: "小型",
    personality: "世界最小級のいぬスタッフ。うるうるの瞳で見つめてきます。",
    like: "ひざの上とぬくぬくの毛布",
    bg: "#ffe3ec", base: "#efd9b8", dark: "#d4b891", eye: "dark",
    ear: "dogUp", extras: ["blaze"]
  },
  {
    breed: "ミニチュアダックスフンド", name: "チョコ", origin: "ドイツ", size: "小型",
    personality: "胴長短足の愛されボディ。鼻がよくて探検が大好き。",
    like: "おやつ探しゲーム",
    bg: "#fff0d9", base: "#b5713f", dark: "#8a5027", eye: "dark",
    ear: "floppy", extras: []
  },
  {
    breed: "ウェルシュコーギー", name: "プリン", origin: "イギリス(ウェールズ)", size: "中型",
    personality: "大きなお耳とぷりぷりのおしり。牧場出身の働き者です。",
    like: "みんなを整列させる(つもり)",
    bg: "#ffe9d6", base: "#e8a355", dark: "#cf883b", eye: "dark",
    ear: "dogUp", extras: ["blaze", "muzzle", "tongue"]
  },
  {
    breed: "シベリアンハスキー", name: "シリウス", origin: "ロシア(シベリア)", size: "大型",
    personality: "オオカミみたいな見た目だけど、実はおっちょこちょいな人気者。",
    like: "ロープの引っぱりっこ",
    bg: "#e3f0ff", base: "#eef1f5", dark: "#7c8a99", eye: "blue",
    ear: "dogUp", extras: ["mask"]
  },
  {
    breed: "フレンチブルドッグ", name: "ブブ", origin: "フランス", size: "中型",
    personality: "コウモリ耳とぶちゃかわフェイス。いびきもチャームポイント。",
    like: "おなかを撫でてもらうこと",
    bg: "#e8ecf5", base: "#e5ded4", dark: "#6b6259", eye: "dark",
    ear: "bat", extras: ["patch"]
  },
  {
    breed: "ボーダーコリー", name: "リク", origin: "イギリス", size: "中型",
    personality: "犬界No.1の頭脳派。フリスビーの名手でスタッフの言葉もよく理解。",
    like: "フリスビーキャッチ",
    bg: "#e0f5f1", base: "#4d4842", dark: "#332f2b", eye: "dark",
    ear: "dogUp", extras: ["blaze", "muzzle", "tongue"]
  },
  {
    breed: "マルチーズ", name: "シロップ", origin: "マルタ共和国", size: "小型",
    personality: "真っ白シルクの毛並みの小さな貴族。抱っこが大好き。",
    like: "リボンを付けておめかし",
    bg: "#ffe3ec", base: "#faf6ef", dark: "#e3d9c8", eye: "dark",
    ear: "floppy", extras: ["fluff"]
  },
  {
    breed: "ビーグル", name: "モカ", origin: "イギリス", size: "中型",
    personality: "スヌーピーのモデルになった犬種。鼻を使った宝探しが得意！",
    like: "においクンクン探検",
    bg: "#fff0d9", base: "#ecdfc9", dark: "#9a6537", eye: "dark",
    ear: "floppy", extras: ["patchTop", "tongue"]
  },
];

// ---------- SVGイラスト生成 ----------
const EYE_COLORS = {
  dark: null, // 黒目のみ
  blue: "#5a8fd0",
  green: "#5fae6d",
  copper: "#d08a2e",
};

function buildSVG(a, uid) {
  const has = (x) => a.extras.includes(x);
  const inner = "#f5b8c4"; // 耳の内側
  const ink = "#40342b";
  const pointy = has("points"); // 耳・マズルが濃色になる
  const earFill = pointy ? a.dark : a.base;
  const p = [];

  // 背景の円
  p.push(`<circle cx="100" cy="100" r="95" fill="${a.bg}"/>`);

  // --- 頭より後ろに描くパーツ ---
  if (has("fluff")) { // 長毛のほおふわ
    p.push(`<circle cx="42" cy="112" r="17" fill="${a.base}"/>
      <circle cx="47" cy="132" r="14" fill="${a.base}"/>
      <circle cx="158" cy="112" r="17" fill="${a.base}"/>
      <circle cx="153" cy="132" r="14" fill="${a.base}"/>`);
  }
  if (has("topknot")) { // プードルの頭のもこもこ
    p.push(`<circle cx="84" cy="56" r="17" fill="${a.base}"/>
      <circle cx="100" cy="50" r="19" fill="${a.base}"/>
      <circle cx="116" cy="56" r="17" fill="${a.base}"/>`);
  }

  // --- 耳(頭より後ろ側に描くタイプ) ---
  if (a.ear === "cat") {
    p.push(`<path d="M52 86 L62 30 L96 56 Z" fill="${earFill}"/>
      <path d="M61 72 L66 42 L85 57 Z" fill="${inner}"/>
      <path d="M148 86 L138 30 L104 56 Z" fill="${earFill}"/>
      <path d="M139 72 L134 42 L115 57 Z" fill="${inner}"/>`);
  } else if (a.ear === "dogUp") {
    p.push(`<path d="M48 90 L56 30 Q58 26 62 29 L100 56 Z" fill="${earFill}"/>
      <path d="M59 74 L64 42 L86 58 Z" fill="${inner}"/>
      <path d="M152 90 L144 30 Q142 26 138 29 L100 56 Z" fill="${earFill}"/>
      <path d="M141 74 L136 42 L114 58 Z" fill="${inner}"/>`);
  } else if (a.ear === "bat") {
    p.push(`<ellipse cx="60" cy="52" rx="20" ry="31" transform="rotate(-14 60 52)" fill="${earFill}"/>
      <ellipse cx="61" cy="56" rx="11" ry="20" transform="rotate(-14 61 56)" fill="${inner}"/>
      <ellipse cx="140" cy="52" rx="20" ry="31" transform="rotate(14 140 52)" fill="${earFill}"/>
      <ellipse cx="139" cy="56" rx="11" ry="20" transform="rotate(14 139 56)" fill="${inner}"/>`);
  } else if (a.ear === "fluffRound") {
    p.push(`<circle cx="52" cy="76" r="20" fill="${a.dark}"/>
      <circle cx="148" cy="76" r="20" fill="${a.dark}"/>`);
  }

  // --- 頭 ---
  p.push(`<ellipse cx="100" cy="112" rx="60" ry="54" fill="${a.base}"/>`);

  // --- 頭にクリップして描く模様 ---
  p.push(`<clipPath id="head-${uid}"><ellipse cx="100" cy="112" rx="60" ry="54"/></clipPath>`);
  const clipped = [];
  if (has("mask")) { // ハスキーなどの頭部マスク
    clipped.push(`<path d="M40 58 L160 58 L160 98 Q132 72 102 98 L100 100 L98 98 Q68 72 40 98 Z" fill="${a.dark}"/>`);
  }
  if (has("patchTop")) { // ビーグルの頭の茶ぶち
    clipped.push(`<path d="M48 58 L152 58 L152 88 Q126 74 100 90 Q74 74 48 88 Z" fill="#c98d4e"/>`);
  }
  if (has("tabby")) { // 額の縞模様
    clipped.push(`<ellipse cx="85" cy="70" rx="5" ry="14" transform="rotate(-12 85 70)" fill="${a.dark}"/>
      <ellipse cx="100" cy="66" rx="5" ry="16" fill="${a.dark}"/>
      <ellipse cx="115" cy="70" rx="5" ry="14" transform="rotate(12 115 70)" fill="${a.dark}"/>`);
  }
  if (has("spots")) { // ベンガルのヒョウ柄
    clipped.push(`<ellipse cx="66" cy="92" rx="5" ry="4" fill="${a.dark}" opacity="0.85"/>
      <ellipse cx="134" cy="92" rx="5" ry="4" fill="${a.dark}" opacity="0.85"/>
      <ellipse cx="100" cy="76" rx="5" ry="4" fill="${a.dark}" opacity="0.85"/>
      <ellipse cx="70" cy="134" rx="4" ry="3.5" fill="${a.dark}" opacity="0.85"/>
      <ellipse cx="130" cy="134" rx="4" ry="3.5" fill="${a.dark}" opacity="0.85"/>`);
  }
  if (has("patch")) { // 片目のまわりの模様
    clipped.push(`<circle cx="122" cy="103" r="16" fill="${a.dark}" opacity="0.9"/>`);
  }
  if (has("blaze")) { // 額の白いライン
    clipped.push(`<path d="M92 58 L108 58 L104 102 Q100 106 96 102 Z" fill="#fdf9f2"/>`);
  }
  if (has("muzzle")) { // 白っぽいマズル
    clipped.push(`<ellipse cx="100" cy="132" rx="27" ry="20" fill="#fdf9f2"/>`);
  }
  if (pointy) { // シャム系の濃色マズル
    clipped.push(`<ellipse cx="100" cy="128" rx="23" ry="16" fill="${a.dark}" opacity="0.85"/>`);
  }
  if (clipped.length) {
    p.push(`<g clip-path="url(#head-${uid})">${clipped.join("")}</g>`);
  }

  // --- 耳(頭より手前に描くタイプ) ---
  if (a.ear === "floppy") {
    p.push(`<ellipse cx="45" cy="112" rx="17" ry="34" transform="rotate(10 45 112)" fill="${a.dark}"/>
      <ellipse cx="155" cy="112" rx="17" ry="34" transform="rotate(-10 155 112)" fill="${a.dark}"/>`);
  } else if (a.ear === "fold") {
    p.push(`<path d="M56 76 Q52 50 74 51 Q86 58 84 74 Q70 66 56 76 Z" fill="${a.base}"/>
      <path d="M144 76 Q148 50 126 51 Q114 58 116 74 Q130 66 144 76 Z" fill="${a.base}"/>
      <path d="M63 68 Q63 56 74 56 Q80 60 79 69 Q71 64 63 68 Z" fill="${inner}"/>
      <path d="M137 68 Q137 56 126 56 Q120 60 121 69 Q129 64 137 68 Z" fill="${inner}"/>`);
  }

  // --- 目 ---
  const iris = EYE_COLORS[a.eye];
  for (const cx of [78, 122]) {
    if (iris) {
      p.push(`<circle cx="${cx}" cy="104" r="7.5" fill="${iris}"/>
        <circle cx="${cx}" cy="104" r="4" fill="${ink}"/>
        <circle cx="${cx + 2.5}" cy="101.5" r="2" fill="#fff"/>`);
    } else {
      p.push(`<circle cx="${cx}" cy="104" r="6" fill="${ink}"/>
        <circle cx="${cx + 2}" cy="101.8" r="2" fill="#fff"/>`);
    }
  }

  // --- 鼻・口 ---
  if (a.species === "cat") {
    p.push(`<path d="M94 120 Q100 116 106 120 L101.5 127 Q100 128.5 98.5 127 Z" fill="#e8879d"/>
      <path d="M100 128 Q96 136 89 132" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M100 128 Q104 136 111 132" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
    // ひげ
    p.push(`<g stroke="${ink}" stroke-width="1.6" stroke-linecap="round" opacity="0.5">
      <line x1="56" y1="116" x2="28" y2="110"/><line x1="56" y1="124" x2="30" y2="126"/>
      <line x1="144" y1="116" x2="172" y2="110"/><line x1="144" y1="124" x2="170" y2="126"/>
    </g>`);
  } else {
    p.push(`<ellipse cx="100" cy="122" rx="7.5" ry="6" fill="${ink}"/>
      <path d="M100 128 Q95 137 87 133" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M100 128 Q105 137 113 133" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);
    if (has("tongue")) {
      p.push(`<path d="M93 135 Q100 149 107 135 Q100 139 93 135 Z" fill="#e8879d"/>`);
    }
  }

  // --- ほっぺの赤み ---
  p.push(`<ellipse cx="64" cy="124" rx="8" ry="5" fill="#f5a3b0" opacity="0.55"/>
    <ellipse cx="136" cy="124" rx="8" ry="5" fill="#f5a3b0" opacity="0.55"/>`);

  return `<svg viewBox="0 0 200 200" role="img" aria-label="${a.breed}の${a.name}のイラスト">${p.join("")}</svg>`;
}

// ---------- リアクションのセリフ ----------
const REACTIONS = {
  cat: {
    feed: ["もぐもぐ…おいしいにゃ〜♪", "カリカリだいすきにゃ！", "おかわりほしいにゃ…"],
    pet:  ["ゴロゴロ…気持ちいいにゃ〜", "そこそこ！もっとにゃで〜", "うっとり…💤"],
    play: ["じゃらし待ってましたにゃ！", "ぴょーん！つかまえたにゃ", "もういっかい遊ぶにゃ！"],
  },
  dog: {
    feed: ["わん！ごちそうさま！", "しっぽふりふり♪ おいしい！", "おやつ最高だワン！"],
    pet:  ["えへへ…もっとなでて〜", "おなかも撫でていいよ！", "しあわせだワン…"],
    play: ["ボール取ってくるワン！", "引っぱりっこ勝負だ！", "もう1回！もう1回！"],
  },
};

const ACTIONS = [
  { key: "feed", label: "🍖 ごはん", emoji: ["🍖", "😋", "✨"] },
  { key: "pet",  label: "🤚 なでる", emoji: ["💗", "😊", "✨"] },
  { key: "play", label: "🧶 あそぶ", emoji: ["🧶", "⚽", "💛"] },
];

// ---------- なかよし度の保存 ----------
const STORAGE_KEY = "mofupark-love";

function loadLove() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveLove(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* プライベートモードなどでは保存しない */ }
}

const loveData = loadLove();

// ---------- カード生成 ----------
function createCard(a, uid) {
  const card = document.createElement("article");
  card.className = "animal-card";

  const love = Math.min(loveData[uid] || 0, 100);

  card.innerHTML = `
    <div class="speech" aria-live="polite"></div>
    <div class="animal-figure">${buildSVG(a, uid)}</div>
    <h3 class="animal-breed">${a.breed}</h3>
    <p class="animal-name">${a.name} ${a.species === "cat" ? "🐱" : "🐶"}</p>
    <div class="animal-tags">
      <span class="tag tag-origin">出身: ${a.origin}</span>
      <span class="tag">${a.size}</span>
    </div>
    <dl class="animal-profile">
      <dt>せいかく</dt><dd>${a.personality}</dd>
      <dt>すきなこと</dt><dd>${a.like}</dd>
    </dl>
    <div class="love-meter">
      <div class="love-label"><span>なかよし度</span><span class="love-num">${love}</span></div>
      <div class="love-bar"><div class="love-fill" style="width:${love}%"></div></div>
      <p class="love-max">だいすき♥ になりました！</p>
    </div>
    <div class="action-row">
      ${ACTIONS.map(ac => `<button type="button" class="action-btn" data-action="${ac.key}">${ac.label}</button>`).join("")}
    </div>
  `;

  if (love >= 100) card.classList.add("maxed");

  card.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", () => interact(card, a, uid, btn.dataset.action));
  });

  return card;
}

// ---------- ふれあいインタラクション ----------
function interact(card, a, uid, actionKey) {
  // なかよし度アップ
  const current = Math.min((loveData[uid] || 0) + 6, 100);
  loveData[uid] = current;
  saveLove(loveData);

  card.querySelector(".love-fill").style.width = `${current}%`;
  card.querySelector(".love-num").textContent = current;
  if (current >= 100) card.classList.add("maxed");

  // セリフ
  const lines = REACTIONS[a.species][actionKey];
  const speech = card.querySelector(".speech");
  speech.textContent = lines[Math.floor(Math.random() * lines.length)];
  speech.classList.add("show");
  clearTimeout(speech._timer);
  speech._timer = setTimeout(() => speech.classList.remove("show"), 1400);

  // イラストをぷるぷるさせる
  card.classList.remove("happy");
  void card.offsetWidth; // アニメーションをリスタートさせる
  card.classList.add("happy");

  // 絵文字エフェクト
  const emojis = ACTIONS.find(ac => ac.key === actionKey).emoji;
  for (let i = 0; i < 3; i++) {
    const el = document.createElement("span");
    el.className = "float-heart";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${30 + Math.random() * 40}%`;
    el.style.top = `${90 + Math.random() * 60}px`;
    el.style.animationDelay = `${i * 0.12}s`;
    card.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }
}

// ---------- 描画 ----------
function renderAll() {
  const catGrid = document.getElementById("catGrid");
  const dogGrid = document.getElementById("dogGrid");

  CATS.forEach((a, i) => {
    a.species = "cat";
    catGrid.appendChild(createCard(a, `cat-${i}`));
  });
  DOGS.forEach((a, i) => {
    a.species = "dog";
    dogGrid.appendChild(createCard(a, `dog-${i}`));
  });
}

// ---------- モバイルナビ ----------
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("globalNav");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // リンクを押したら閉じる
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

renderAll();
setupNav();
