// =========================================================
// FLORIA GARDENS - 詳細ページ描画スクリプト
// URLの ?id= を読んで data.js から該当データを attraction.html /
// character.html に流し込みます。
// =========================================================

(function () {
  const params = new URLSearchParams(location.search);
  const requestedId = params.get('id');

  const isAttraction = !!document.getElementById('dSpecs');
  const list = isAttraction ? window.FG_DATA.attractions : window.FG_DATA.characters;

  let index = list.findIndex((item) => item.id === requestedId);
  if (index < 0) index = 0;
  const item = list[index];

  const $ = (id) => document.getElementById(id);
  const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };

  setText('bcName', item.name);
  setText('dName', item.name);
  setText('dEn', item.en);
  setText('dDesc', item.desc);
  document.title = item.name + ' | FLORIA GARDENS フローリア・ガーデンズ';

  if (isAttraction) {
    // ---------- アトラクション詳細 ----------
    const hero = $('detailHeroMedia');
    if (hero) hero.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    setText('dCopy', item.copy);
    $('dTags').innerHTML = item.catLabels.map((label) => `<span class="attr-tag">${label}</span>`).join(' ');
    $('dSpecs').innerHTML = Object.entries(item.specs).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
    $('dTips').innerHTML = item.tips.map((tip) => `<li>${tip}</li>`).join('');
  } else {
    // ---------- キャラクター詳細 ----------
    $('dFigure').innerHTML = item.svg;
    setText('dCatch', item.catch);
    $('dRole').innerHTML = `<span class="attr-tag">${item.role}</span>`;
    setText('dMeet', item.meet);
    setText('dFriendTip', item.friendTip);
    $('dProfile').innerHTML = Object.entries(item.profile).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  }

  // ---------- 前へ・次へ ----------
  const page = isAttraction ? 'attraction.html' : 'character.html';
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  const pagerPrev = $('pagerPrev');
  const pagerNext = $('pagerNext');
  if (pagerPrev) pagerPrev.href = `${page}?id=${prev.id}`;
  if (pagerNext) pagerNext.href = `${page}?id=${next.id}`;
  setText('prevName', prev.name);
  setText('nextName', next.name);
})();
