// =========================================================
// ニューワールド - メインスクリプト
// =========================================================

// ---------- モバイルナビ開閉（全ページ共通） ----------
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

// ---------- アトラクションカードを生成（トップページ） ----------
const attrGrid = document.getElementById('attrGrid');

if (attrGrid && window.NW_DATA) {
  attrGrid.innerHTML = window.NW_DATA.attractions
    .map((a) => {
      const tags = a.catLabels
        .map((label) => `<span class="attr-tag${label === 'NEW' ? ' t-new' : ''}">${label}</span>`)
        .join('');
      return `
        <a class="attr-card" href="attraction.html?id=${a.id}" data-cat="${a.cats.join(' ')}">
          <div class="attr-visual bg-${a.color}"><span class="attr-emoji">${a.emoji}</span></div>
          <div class="attr-body">
            <div class="attr-tags">${tags}</div>
            <h3>${a.name}</h3>
            <p>${a.copy}</p>
            <span class="attr-more">くわしく見る →</span>
          </div>
        </a>`;
    })
    .join('');
}

// ---------- キャラクターカードを生成（トップページ） ----------
const charGrid = document.getElementById('charGrid');
const CHAR_FIGURE_BG = { pikari: 'cf-yellow', lulune: 'cf-purple', mokumo: 'cf-cyan', soran: 'cf-blue' };

if (charGrid && window.NW_DATA) {
  charGrid.innerHTML = window.NW_DATA.characters
    .map(
      (c) => `
      <a class="char-card" href="character.html?id=${c.id}">
        <div class="char-figure ${CHAR_FIGURE_BG[c.id] || 'cf-yellow'}">${c.svg}</div>
        <div class="char-body">
          <p class="char-role">${c.role}</p>
          <h3>${c.name}</h3>
          <p>${c.catch}</p>
          <span class="char-more">プロフィールを見る →</span>
        </div>
      </a>`
    )
    .join('');
}

// ---------- アトラクションのカテゴリ絞り込み ----------
const filterBtns = document.querySelectorAll('.filter-btn');

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

// ---------- ページトップへ戻るボタン ----------
const toTop = document.getElementById('toTop');
if (toTop) {
  window.addEventListener(
    'scroll',
    () => toTop.classList.toggle('is-shown', window.scrollY > 600),
    { passive: true }
  );
}

// ---------- クリックで紙吹雪が飛び散る ----------
const CONFETTI_COLORS = ['#FF2E88', '#FFE500', '#00E5FF', '#B6FF2E', '#7B2FFF', '#FF7A00'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 12; i++) {
      const bit = document.createElement('span');
      bit.className = 'confetti-bit';
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      const dist = 50 + Math.random() * 70;
      bit.style.left = e.clientX + 'px';
      bit.style.top = e.clientY + 'px';
      bit.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      bit.style.setProperty('--cx', Math.cos(angle) * dist + 'px');
      bit.style.setProperty('--cy', Math.sin(angle) * dist - 30 + 'px');
      if (i % 3 === 0) bit.style.borderRadius = '50%';
      document.body.appendChild(bit);
      setTimeout(() => bit.remove(), 850);
    }
  });
}
