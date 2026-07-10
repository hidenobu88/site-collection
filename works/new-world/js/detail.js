// =========================================================
// ニューワールド - 詳細ページ描画スクリプト
// URLの ?id= を読んで data.js から該当データを流し込む。
// attraction.html と character.html の両方で使う。
// =========================================================

(function () {
  const params = new URLSearchParams(location.search);
  const requestedId = params.get('id');

  const isAttraction = !!document.getElementById('dSpecs');
  const list = isAttraction ? window.NW_DATA.attractions : window.NW_DATA.characters;

  // idが無い・存在しない場合は先頭のアイテムを表示する
  let index = list.findIndex((item) => item.id === requestedId);
  if (index < 0) index = 0;
  const item = list[index];

  const $ = (id) => document.getElementById(id);
  const setText = (id, text) => { const el = $(id); if (el) el.textContent = text; };

  // ---------- 共通 ----------
  setText('bcName', item.name);
  setText('dName', item.name);
  setText('dEn', item.en);
  setText('dDesc', item.desc);
  $('detailHero').classList.add('dh-' + item.color);
  document.title = item.name + ' | ニューワールド';

  if (isAttraction) {
    // ---------- アトラクション詳細 ----------
    setText('dEmoji', item.emoji);
    setText('dCopy', item.copy);
    $('dTags').innerHTML = item.catLabels
      .map((label) => `<span class="attr-tag${label === 'NEW' ? ' t-new' : ''}">${label}</span>`)
      .join(' ');

    $('dThrill').innerHTML =
      '<span aria-label="5段階中' + item.thrill + '">' +
      '🔥'.repeat(item.thrill) +
      '<span class="off">' + '🔥'.repeat(5 - item.thrill) + '</span>' +
      '</span>';

    $('dSpecs').innerHTML = Object.entries(item.specs)
      .map(([key, val]) => `<tr><th>${key}</th><td>${val}</td></tr>`)
      .join('');

    $('dTips').innerHTML = item.tips.map((tip) => `<li>${tip}</li>`).join('');
  } else {
    // ---------- キャラクター詳細 ----------
    $('dFigure').innerHTML = item.svg;
    setText('dCatch', item.catch);
    $('dRole').innerHTML = `<span class="attr-tag">${item.role}</span>`;
    setText('dMeet', item.meet);
    setText('dFriendTip', item.friendTip);

    $('dProfile').innerHTML = Object.entries(item.profile)
      .map(([key, val]) => `<tr><th>${key}</th><td>${val}</td></tr>`)
      .join('');
  }

  // ---------- 前へ・次へ ----------
  const page = isAttraction ? 'attraction.html' : 'character.html';
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  $('pagerPrev').href = `${page}?id=${prev.id}`;
  $('pagerNext').href = `${page}?id=${next.id}`;
  setText('prevName', prev.name);
  setText('nextName', next.name);
})();
