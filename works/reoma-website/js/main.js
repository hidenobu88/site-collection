// =========================================================
// FLORIA GARDENS - メインスクリプト(全ページ共通)
// =========================================================

// ---------- モバイルナビ開閉 ----------
const navToggle = document.getElementById('navToggle');
const globalNav = document.getElementById('globalNav');

if (navToggle && globalNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = globalNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  globalNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      globalNav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- アトラクションカード生成 ----------
function attrCardHTML(a) {
  const tags = a.catLabels
    .map((label) => `<span class="attr-tag${a.cats.includes('thrill') ? ' t-thrill' : ''}${a.cats.includes('night') ? ' t-night' : ''}">${label}</span>`)
    .join('');
  return `
    <a class="attr-card" href="attraction.html?id=${a.id}" data-cat="${a.cats.join(' ')}">
      <div class="attr-media">
        <img src="${a.img}" alt="${a.name}" loading="lazy">
        <div class="attr-tags">${tags}</div>
      </div>
      <div class="attr-body">
        <h3>${a.name}</h3>
        <p>${a.copy}</p>
        <span class="attr-more">くわしく見る →</span>
      </div>
    </a>`;
}

const attrGrid = document.getElementById('attrGrid');
if (attrGrid && window.FG_DATA) {
  const list = attrGrid.dataset.limit
    ? window.FG_DATA.attractions.slice(0, Number(attrGrid.dataset.limit))
    : window.FG_DATA.attractions;
  attrGrid.innerHTML = list.map(attrCardHTML).join('');
}

// ---------- キャラクターカード生成 ----------
const CHAR_BG = { fuwan: 'cf-pink', pyonta: 'cf-sky', kurumi: 'cf-sun', potteri: 'cf-lav', 'sora-sensei': 'cf-lav', gorota: 'cf-brown' };

function charCardHTML(c) {
  return `
    <a class="char-card" href="character.html?id=${c.id}">
      <div class="char-avatar ${CHAR_BG[c.id] || 'cf-pink'}">${c.svg}</div>
      <p class="char-role">${c.role}</p>
      <h3>${c.name}</h3>
      <p class="char-blurb">${c.catch}</p>
      <span class="char-more">プロフィールを見る →</span>
    </a>`;
}

const charGrid = document.getElementById('charGrid');
if (charGrid && window.FG_DATA) {
  const list = charGrid.dataset.limit
    ? window.FG_DATA.characters.slice(0, Number(charGrid.dataset.limit))
    : window.FG_DATA.characters;
  charGrid.innerHTML = list.map(charCardHTML).join('');
}

// ---------- アトラクション カテゴリ絞り込み ----------
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.attr-card').forEach((card) => {
        const cats = (card.dataset.cat || '').split(' ');
        card.classList.toggle('is-hidden', !(filter === 'all' || cats.includes(filter)));
      });
    });
  });
}

// ---------- ショップ: 商品カード生成 ----------
function shopCardHTML(item, kind) {
  const linkKind = kind === 'food' ? 'food' : 'goods';
  return `
    <div class="shop-card" data-cat="${item.cat}" data-kind="${linkKind}">
      <div class="shop-media">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <button class="heart-btn" aria-label="お気に入り登録" data-id="${item.id}">♡</button>
      </div>
      <div class="shop-body">
        <span class="shop-shop-tag">${item.shop}${item.tag ? ' ・ ' + item.tag : ''}</span>
        <h3>${item.name}</h3>
        <span class="shop-price">¥${item.price.toLocaleString()}</span>
      </div>
    </div>`;
}

const goodsGrid = document.getElementById('goodsGrid');
if (goodsGrid && window.FG_DATA) {
  goodsGrid.innerHTML = window.FG_DATA.goods.map((g) => shopCardHTML(g, 'goods')).join('');
}
const foodGrid = document.getElementById('foodGrid');
if (foodGrid && window.FG_DATA) {
  foodGrid.innerHTML = window.FG_DATA.foods.map((f) => shopCardHTML(f, 'food')).join('');
}

// ---------- ショップ タブ絞り込み(グッズ/フード共通) ----------
const shopTabBtns = document.querySelectorAll('.shop-tab-btn');
if (shopTabBtns.length) {
  shopTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      shopTabBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.shop-card').forEach((card) => {
        card.classList.toggle('is-hidden', !(filter === 'all' || card.dataset.cat === filter));
      });
    });
  });
}

// ---------- お気に入りハート(見た目のみのトグル) ----------
document.addEventListener('click', (e) => {
  const heart = e.target.closest('.heart-btn');
  if (!heart) return;
  e.preventDefault();
  const isFav = heart.classList.toggle('is-fav');
  heart.textContent = isFav ? '♥' : '♡';
});

// ---------- ページトップへ戻るボタン ----------
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener('scroll', () => toTop.classList.toggle('is-shown', window.scrollY > 600), { passive: true });
}

// ---------- ヒーローのきらめきエフェクト ----------
const sparkleLayer = document.getElementById('heroSparkles');
if (sparkleLayer) {
  const marks = ['✦', '✧', '⋆', '✿'];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.className = 'hero-sparkle';
    s.textContent = marks[i % marks.length];
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 70 + '%';
    s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
    s.style.fontSize = 12 + Math.random() * 14 + 'px';
    sparkleLayer.appendChild(s);
  }
}

// ---------- ふんわり花びらが舞う演出(控えめ・低頻度) ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const PETALS = ['🌸', '🌷', '🌼'];
  setInterval(() => {
    if (document.hidden) return;
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    const duration = 7 + Math.random() * 5;
    petal.style.animationDuration = duration + 's';
    document.body.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }, 2600);
}
