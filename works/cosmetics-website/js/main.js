/* ═══════════════════════════════════════════
   Belle Éclat — トップページ描画
   ═══════════════════════════════════════════ */

// カテゴリー見出しの下に単独で置くイメージ写真(見切れないよう原寸比率で表示)
const CATEGORY_PHOTOS = {
  eye: { src: "image/abc_10.jpg", alt: "カラフルなアイシャドウパレット", label: "COLOR PALETTE" },
  cheek: { src: "image/Cheek-Highlighter.png", alt: "チークとハイライトのパレット", label: "CHEEK & HIGHLIGHT", wide: true },
  skincare: { src: "image/abc_15.jpg", alt: "バラの花と保湿クリーム", label: "DAILY SKIN CARE" },
};

const categoryPhotoHTML = (ph) => `
  <figure class="category-photo${ph.wide ? " wide" : ""}">
    <img src="${ph.src}" alt="${ph.alt}" loading="lazy" />
    <figcaption>${ph.label}</figcaption>
  </figure>`;

// ファッション・ダイエットのサブセクション定義
const LIFESTYLE_SUBS = [
  {
    sub: "fashion",
    eyebrow: "FASHION",
    title: "ファッション",
    lead: "着るだけでキレイ見え。デイリーに使える褒められ服。",
    photo: { src: "image/abc_05.jpg", alt: "ニットを着てソファに座る女性", label: "STYLING" },
  },
  {
    sub: "diet",
    eyebrow: "BODY MAKE & INNER CARE",
    title: "ダイエット・インナーケア",
    lead: "無理なく続く、美習慣。体の内側からキレイをつくる。",
    photo: { src: "image/abc_08.jpg", alt: "森の中で踊るバレリーナ", label: "BODY MAKE" },
  },
];

// ベースメイクの後に差し込む全幅バナー(Beauty_A.jpg)
const BEAUTIFUL_A_BANNER = `
  <section class="photo-banner photo-banner--light">
    <div class="photo-banner-img">
      <img src="image/Beauty_A.jpg" alt="鏡の前でチークをのせて微笑む女性" loading="lazy" />
    </div>
    <div class="photo-banner-text">
      <p class="section-eyebrow">MAKEUP TIME IS HAPPY TIME</p>
      <h2>鏡の前の時間が、もっと好きになる。</h2>
      <p>お気に入りのコスメがあるだけで、毎朝のメイクが小さなご褒美に。</p>
      <a href="#cheek" class="btn btn-primary">チーク・ハイライトを見る</a>
    </div>
  </section>`;

// メイクツールの後に差し込むビューティーレッスンバナー(Beauty_B.jpg)
const BEAUTIFUL_B_BANNER = `
  <section class="lesson-banner">
    <div class="lesson-text">
      <p class="section-eyebrow">BEAUTY LESSON</p>
      <h2>プロに学ぶ、「似合う」の見つけ方。</h2>
      <p>
        パーソナルカラーをもとに、あなたに似合うチークの色と<br />
        ハイライトの入れ方をプロのアーティストがレクチャー。<br />
        オンラインレッスンを毎月開催しています。
      </p>
      <a href="#newsletterForm" class="btn btn-ghost" onclick="document.querySelector('.newsletter input').focus()">開催情報を受け取る</a>
    </div>
    <figure class="lesson-photo">
      <img src="image/Beauty_B.jpg" alt="ドレッサーでチークを塗る女性" loading="lazy" />
    </figure>
  </section>`;

// スキンケアの後に差し込む香水ティザーバナー(abc_13.jpg)
const PERFUME_BANNER = `
  <section class="perfume-banner">
    <figure class="perfume-photo">
      <img src="image/abc_13.jpg" alt="クラシックな香水瓶" loading="lazy" />
    </figure>
    <div class="perfume-text">
      <p class="section-eyebrow">COMING SOON</p>
      <h2>フレグランス、まもなく登場。</h2>
      <p>
        Belle Éclat 初の香りのコレクションを準備中。<br />
        まとう人の記憶に残る、上質なオードパルファン。<br />
        ニュースレターにご登録いただくと、先行予約のご案内をお届けします。
      </p>
      <a href="#newsletterForm" class="btn btn-ghost" onclick="document.querySelector('.newsletter input').focus()">発売通知を受け取る</a>
    </div>
  </section>`;

// ファッション・ダイエットは「画像 → その下にアイテム」のサブセクション構成
function lifestyleSectionHTML(c) {
  const blocks = LIFESTYLE_SUBS.map((s) => {
    const items = PRODUCTS.filter((p) => p.cat === "lifestyle" && p.sub === s.sub);
    return `
      <div class="lifestyle-sub">
        <div class="sub-head">
          <p class="section-eyebrow">${s.eyebrow}</p>
          <h3>${s.title}</h3>
          <p class="section-lead">${s.lead}</p>
        </div>
        ${categoryPhotoHTML(s.photo)}
        <div class="product-grid">
          ${items.map((p) => cardHTML(p)).join("")}
        </div>
      </div>`;
  }).join("");

  return `
    <section class="section category-section" id="${c.id}">
      <div class="section-head">
        <p class="section-eyebrow">${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <p class="section-lead">${c.lead}</p>
      </div>
      ${blocks}
    </section>`;
}

// カテゴリーごとのセクションを描画
const catalog = document.getElementById("catalog");
catalog.innerHTML = CATEGORIES.map((c) => {
  if (c.id === "lifestyle") return lifestyleSectionHTML(c);

  const items = PRODUCTS.filter((p) => p.cat === c.id);
  const photo = CATEGORY_PHOTOS[c.id] ? categoryPhotoHTML(CATEGORY_PHOTOS[c.id]) : "";
  return `
    <section class="section category-section" id="${c.id}">
      <div class="section-head">
        <p class="section-eyebrow">${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <p class="section-lead">${c.lead}</p>
      </div>
      ${photo}
      <div class="product-grid">
        ${items.map((p) => cardHTML(p)).join("")}
      </div>
    </section>
    ${c.id === "base" ? BEAUTIFUL_A_BANNER : ""}
    ${c.id === "skincare" ? PERFUME_BANNER : ""}
    ${c.id === "tools" ? BEAUTIFUL_B_BANNER : ""}`;
}).join("");

// 人気ランキング(rank付き商品を順に表示)
const ranked = PRODUCTS.filter((p) => p.rank).sort((a, b) => a.rank - b.rank);
document.getElementById("rankingGrid").innerHTML = ranked
  .map((p) => cardHTML(p, p.rank))
  .join("");

// ニュースレター
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("ご登録ありがとうございます 💌");
  e.target.reset();
});
