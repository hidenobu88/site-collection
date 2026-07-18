/* ============================================
   TORALUCE PRODUCTION - 共通スクリプト
   （データは js/data.js で管理しています）
   ============================================ */

/* ---------- ユーティリティ ---------- */
const talentById = id => TALENTS.find(t => t.id === id);
const urlParam = name => new URLSearchParams(location.search).get(name);

/* ---------- ハンバーガーメニュー ---------- */
const hamburger = document.querySelector('.hamburger');
const gnav = document.querySelector('.gnav');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    gnav.classList.toggle('open');
  });
  gnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    gnav.classList.remove('open');
  }));
}

/* ---------- スクロールフェードイン ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================
   トップ：ピックアップタレントスライダー（4秒ごと）
   メンバーの入れ替えは js/data.js の PICKUP_TALENTS を編集
   ============================================ */
const tSlider = document.getElementById('talent-slider');
if (tSlider) {
  const tDots = document.getElementById('talent-dots');
  tSlider.innerHTML = PICKUP_TALENTS.map(id => {
    const t = talentById(id);
    return `
      <a class="t-slide" href="profile.html?id=${t.id}">
        <div class="noimg"></div>
        <div class="t-caption">
          <h3>${t.name}<small>${t.kana}</small></h3>
          <span>VIEW PROFILE →</span>
        </div>
      </a>`;
  }).join('');

  const tSlides = tSlider.querySelectorAll('.t-slide');
  tSlides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `タレント${i + 1}`);
    b.addEventListener('click', () => tGo(i));
    tDots.appendChild(b);
  });
  const tDotBtns = tDots.querySelectorAll('button');
  let tCurrent = 0, tTimer;

  function tGo(i) {
    tCurrent = (i + tSlides.length) % tSlides.length;
    tSlides.forEach((s, j) => s.classList.toggle('active', j === tCurrent));
    tDotBtns.forEach((d, j) => d.classList.toggle('active', j === tCurrent));
    clearInterval(tTimer);
    tTimer = setInterval(() => tGo(tCurrent + 1), 4000); // 1人4秒
  }
  tGo(0);
}

/* ---------- 出演情報スライダー（横スライド式） ---------- */
const slides = document.querySelector('.slides');
if (slides) {
  const total = slides.children.length;
  const dotsWrap = document.querySelector('.slider-dots:not(#talent-dots)');
  let current = 0, timer;

  for (let i = 0; i < total; i++) {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `スライド${i + 1}`);
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  }
  const dots = dotsWrap.querySelectorAll('button');

  function go(i) {
    current = (i + total) % total;
    slides.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('active', j === current));
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 4000);
  }
  document.querySelector('.slider-arrow.prev')?.addEventListener('click', () => go(current - 1));
  document.querySelector('.slider-arrow.next')?.addEventListener('click', () => go(current + 1));
  go(0);
}

/* ============================================
   所属タレント一覧（クリックでプロフィールページへ）
   ============================================ */
function renderTalents(list, targetId, limit) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  const data = limit ? list.slice(0, limit) : list;
  wrap.innerHTML = data.map(t => `
    <a href="profile.html?id=${t.id}" class="talent-card">
      <div class="noimg"></div>
      <p class="t-name">${t.name}<small>${t.kana}</small></p>
      <p class="t-info">${t.info}</p>
    </a>
  `).join('');
}

const males = TALENTS.filter(t => t.gender === 'male');
const females = TALENTS.filter(t => t.gender === 'female');

/* タレントページ：男女タブ ＋ 職種絞り込み */
const talentTabs = document.querySelectorAll('.talent-tabs button');
if (talentTabs.length) {
  const roleBtns = document.querySelectorAll('.role-filter button');
  let curGender = 'male';
  let curRole = 'all';

  function applyTalentFilter() {
    let list = TALENTS.filter(t => t.gender === curGender);
    if (curRole !== 'all') {
      list = list.filter(t => {
        const role = t.info.split(' / ')[0];
        return curRole === 'actor' ? (role === '俳優' || role === '女優') : role === curRole;
      });
    }
    renderTalents(list, 'talent-list');
  }

  talentTabs.forEach(btn => btn.addEventListener('click', () => {
    talentTabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    curGender = btn.dataset.gender;
    applyTalentFilter();
  }));
  roleBtns.forEach(btn => btn.addEventListener('click', () => {
    roleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    curRole = btn.dataset.role;
    applyTalentFilter();
  }));
  applyTalentFilter();
}

/* トップページ：抜粋表示（男5名・女5名） */
renderTalents(males, 'talent-preview-male', 5);
renderTalents(females, 'talent-preview-female', 5);

/* ============================================
   最新情報（NEWS）
   ============================================ */
function newsItemHTML(n) {
  return `
    <a href="news-detail.html?id=${n.id}" class="news-item" data-month="${n.month}">
      <div class="noimg"></div>
      <div>
        <time>${n.date}</time><span class="news-cat">${n.cat}</span>
        <h3>${n.title}</h3>
        <p>${n.summary}</p>
      </div>
    </a>`;
}

/* トップページ：最新3件 */
const newsPreview = document.getElementById('news-preview');
if (newsPreview) {
  const latest = [...NEWS_ITEMS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  newsPreview.innerHTML = latest.map(newsItemHTML).join('');
}

/* 一覧ページ：月別タブ */
const newsList = document.getElementById('news-list');
if (newsList) {
  newsList.innerHTML = NEWS_ITEMS.map(newsItemHTML).join('');
  const monthTabs = document.querySelectorAll('.month-tabs button');
  const items = newsList.querySelectorAll('.news-item');
  const empty = document.querySelector('.news-empty');

  function showMonth(m) {
    let count = 0;
    items.forEach(item => {
      const show = item.dataset.month === m;
      item.style.display = show ? '' : 'none';
      if (show) count++;
    });
    if (empty) empty.style.display = count ? 'none' : '';
    monthTabs.forEach(b => b.classList.toggle('active', b.dataset.month === m));
  }
  monthTabs.forEach(btn => btn.addEventListener('click', () => showMonth(btn.dataset.month)));

  // 初期表示：今月（データがなければ最新記事の月）
  const thisMonth = String(new Date().getMonth() + 1);
  const hasThisMonth = [...items].some(i => i.dataset.month === thisMonth);
  showMonth(hasThisMonth ? thisMonth : String(NEWS_ITEMS[0]?.month || 1));
}

/* ============================================
   SNS
   ============================================ */
function snsCardHTML(p) {
  const t = talentById(p.talentId);
  return `
    <a href="sns-detail.html?id=${p.id}" class="sns-card">
      <div class="sns-head">
        <div class="noimg"></div>
        <p class="sns-name">${t.name}<small>${p.account}</small></p>
        <span class="sns-badge">${p.service}</span>
      </div>
      <div class="sns-body">
        ${p.text}
        ${p.hasImage ? '<div class="noimg"></div>' : ''}
      </div>
      <time>${p.date}</time>
    </a>`;
}

const snsGrid = document.getElementById('sns-grid');
if (snsGrid) {
  snsGrid.innerHTML = SNS_POSTS.map(snsCardHTML).join('');
}

/* ============================================
   プロフィールページ（profile.html?id=◯◯）
   ============================================ */
const profileRoot = document.getElementById('profile-root');
if (profileRoot) {
  const t = talentById(urlParam('id')) || TALENTS[0];
  const [role, birth] = t.info.split(' / ');
  document.title = `${t.name} | TORALUCE PRODUCTION`;
  document.getElementById('page-title').textContent = t.kana;
  document.getElementById('page-sub').textContent = t.name;

  profileRoot.innerHTML = `
    <div class="profile-wrap fade-in visible">
      <div class="noimg profile-photo"></div>
      <div class="profile-main">
        <h2 class="profile-name">${t.name}<small>${t.kana}</small></h2>
        <table class="company-table">
          <tr><th>職種</th><td>${role}</td></tr>
          <tr><th>生年月日</th><td>${birth}</td></tr>
          <tr><th>出身地</th><td>${t.hometown || '東京都（サンプル）'}</td></tr>
          <tr><th>趣味</th><td>${t.hobby || '映画鑑賞・カフェ巡り（サンプル）'}</td></tr>
          <tr><th>特技</th><td>${t.skill || 'ダンス・英会話（サンプル）'}</td></tr>
        </table>
      </div>
    </div>`;

  // このタレントに関連する出演情報（名前が含まれる or talentId が一致する記事）
  const fullName = t.name.replace(/\s/g, '');
  const related = NEWS_ITEMS.filter(n => n.talentId === t.id || n.title.includes(fullName));
  document.getElementById('profile-news').innerHTML = related.length
    ? related.map(newsItemHTML).join('')
    : '<p class="news-empty" style="display:block">出演情報は準備中です。</p>';

  // このタレントのSNS投稿
  const posts = SNS_POSTS.filter(p => p.talentId === t.id);
  const snsSec = document.getElementById('profile-sns');
  if (posts.length) {
    snsSec.innerHTML = posts.map(snsCardHTML).join('');
  } else {
    snsSec.outerHTML = '';
    document.getElementById('profile-sns-title').outerHTML = '';
  }
}

/* ============================================
   ニュース詳細ページ（news-detail.html?id=◯◯）
   ============================================ */
const newsDetailRoot = document.getElementById('news-detail-root');
if (newsDetailRoot) {
  const n = NEWS_ITEMS.find(x => x.id === urlParam('id')) || NEWS_ITEMS[0];
  document.title = `${n.title} | TORALUCE PRODUCTION`;
  const t = n.talentId ? talentById(n.talentId) : null;

  newsDetailRoot.innerHTML = `
    <article class="news-detail fade-in visible">
      <p><time>${n.date}</time><span class="news-cat">${n.cat}</span></p>
      <h2>${n.title}</h2>
      <div class="noimg news-detail-img"></div>
      ${n.body.map(p => `<p class="news-body">${p}</p>`).join('')}
      ${t ? `<a class="btn" href="profile.html?id=${t.id}">${t.name} のプロフィール</a>` : ''}
    </article>`;
}

/* ============================================
   SNS詳細ページ（sns-detail.html?id=◯◯）
   ============================================ */
const snsDetailRoot = document.getElementById('sns-detail-root');
if (snsDetailRoot) {
  const p = SNS_POSTS.find(x => x.id === urlParam('id')) || SNS_POSTS[0];
  const t = talentById(p.talentId);
  document.title = `${t.name}のSNS投稿 | TORALUCE PRODUCTION`;

  snsDetailRoot.innerHTML = `
    <div class="sns-card sns-detail fade-in visible">
      <div class="sns-head">
        <div class="noimg"></div>
        <p class="sns-name">${t.name}<small>${p.account}</small></p>
        <span class="sns-badge">${p.service}</span>
      </div>
      <div class="sns-body">
        ${p.text}
        ${p.hasImage ? '<div class="noimg"></div>' : ''}
      </div>
      <time>${p.date}</time>
    </div>
    <div style="text-align:center">
      <a class="btn" href="profile.html?id=${t.id}">${t.name} のプロフィール</a>
    </div>`;
}

/* ---------- フォーム（デモ送信：お問い合わせ／オーディション共通） ---------- */
document.querySelectorAll('form.demo-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    // 実運用時はここでフォーム送信サービス（formrun / Googleフォーム / 自社API等）へPOSTしてください
    form.style.display = 'none';
    const result = form.closest('.inner')?.querySelector('.form-result');
    if (result) {
      result.style.display = 'block';
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

/* ---------- ページトップへ戻るボタン（全ページ自動生成） ---------- */
const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.setAttribute('aria-label', 'ページトップへ戻る');
toTop.textContent = '↑';
document.body.appendChild(toTop);
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
