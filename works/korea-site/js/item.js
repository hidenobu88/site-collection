/* =========================================================
   서울골목 ソウル横丁 — item.js（メニュー詳細ページ）
   URLの ?id=xxx から該当メニューを探して描画
   ※データは menu-data.js（CATEGORIES / MENU）を使用
========================================================= */

const root = document.getElementById("detailRoot");
const itemId = new URLSearchParams(location.search).get("id");
const item = MENU.find(m => m.id === itemId);

function spicyRow(n) {
  if (n === 0) {
    return `<span class="detail__tag detail__tag--mild"><span class="t-ja">辛くない</span><span class="t-ko">안 매워요</span></span>`;
  }
  return `<span class="detail__tag detail__tag--spicy">${"🌶️".repeat(n)} <span class="t-ja">辛さレベル${n}</span><span class="t-ko">맵기 레벨${n}</span></span>`;
}

if (!item) {
  /* 存在しないIDの場合 */
  root.innerHTML = `
    <div class="detail__notfound">
      <p class="detail__notfound-emoji">🍽️</p>
      <h1><span class="t-ja">メニューが見つかりません</span><span class="t-ko">메뉴를 찾을 수 없습니다</span></h1>
      <a class="btn btn--red" href="index.html#menu"><span class="t-ja">メニュー一覧へ戻る</span><span class="t-ko">메뉴로 돌아가기</span></a>
    </div>`;
} else {
  const cat = CATEGORIES.find(c => c.id === item.cat);
  document.title = `${item.ja}（${item.ko}）｜ソウル横丁 서울골목`;

  /* 同カテゴリのおすすめ（自分以外・最大4品） */
  const related = MENU.filter(m => m.cat === item.cat && m.id !== item.id).slice(0, 4);
  const relatedHtml = related.map(m => `
    <a class="rel" href="menu.html?id=${m.id}">
      <span class="rel__emoji">${m.emoji}</span>
      <span class="rel__names">
        <b>${m.ko}</b>
        <small>${m.ja}</small>
      </span>
      <span class="rel__price">¥${m.price.toLocaleString()}</span>
    </a>`).join("");

  root.innerHTML = `
    <nav class="detail__crumb">
      <a href="index.html#menu">← <span class="t-ja">メニュー一覧</span><span class="t-ko">메뉴 목록</span></a>
      <span class="detail__crumb-cat">${cat.emoji} <span class="t-ja">${cat.ja}</span><span class="t-ko">${cat.ko}</span></span>
    </nav>

    <div class="detail__top">
      <!-- ポラロイド風フォト -->
      <div class="detail__photo" data-cat="${item.cat}">
        ${item.pop ? `<span class="card__badge"><span class="t-ja">人気</span><span class="t-ko">인기</span></span>` : ""}
        <div class="detail__photo-frame">
          <span class="detail__photo-emoji">${item.emoji}</span>
        </div>
        <p class="detail__photo-caption">
          ${item.ko}
          <small><span class="t-ja">※写真は絵文字のイメージです（架空店舗のため）</span><span class="t-ko">※사진은 이모지 이미지입니다 (가상 가게라서요)</span></small>
        </p>
      </div>

      <!-- 基本情報 -->
      <div class="detail__info">
        <h1 class="detail__name">
          <span class="detail__name-ko">${item.ko}</span>
          <span class="detail__name-ja">${item.ja}</span>
        </h1>
        <p class="detail__lead">
          <span class="t-ja">${item.dJa}</span>
          <span class="t-ko">${item.dKo}</span>
        </p>
        <div class="detail__tags">
          ${spicyRow(item.spicy)}
          <span class="detail__tag detail__tag--to">🥡 <span class="t-ja">テイクアウトOK</span><span class="t-ko">포장 OK</span></span>
          ${item.to ? `<span class="detail__tag detail__tag--pop"><span class="t-ja">持ち帰り人気</span><span class="t-ko">포장 인기</span></span>` : ""}
        </div>
        <div class="detail__pricebox">
          <span class="detail__price">¥${item.price.toLocaleString()}</span>
          <span class="detail__price-note">
            ${item.unitJa ? `<span class="t-ja">${item.unitJa}・</span><span class="t-ko">${item.unitKo}・</span>` : ""}
            <span class="t-ja">税込</span><span class="t-ko">세금 포함</span>
          </span>
        </div>
        <p class="detail__order-note">
          <span class="t-ja">ご注文は店頭または お電話（03-1234-5678）にて承ります。</span>
          <span class="t-ko">주문은 매장 또는 전화(03-1234-5678)로 받습니다.</span>
        </p>
      </div>
    </div>

    <!-- 読みものセクション -->
    <div class="detail__boxes">
      <section class="dbox reveal">
        <h2 class="dbox__title">🍚 <span class="t-ja">どんな料理？</span><span class="t-ko">어떤 음식?</span></h2>
        <p><span class="t-ja">${item.storyJa}</span><span class="t-ko">${item.storyKo}</span></p>
      </section>

      <section class="dbox dbox--region reveal">
        <h2 class="dbox__title">📍 <span class="t-ja">本場を旅する</span><span class="t-ko">본고장 여행</span></h2>
        <p class="dbox__region-name">
          <span class="t-ja">${item.rgJa}</span><span class="t-ko">${item.rgKo}</span>
        </p>
        <p><span class="t-ja">${item.rgdJa}</span><span class="t-ko">${item.rgdKo}</span></p>
      </section>

      <section class="dbox reveal">
        <h2 class="dbox__title">🥢 <span class="t-ja">おすすめの楽しみ方</span><span class="t-ko">이렇게 드세요</span></h2>
        <p><span class="t-ja">${item.pairJa}</span><span class="t-ko">${item.pairKo}</span></p>
      </section>
    </div>

    <!-- 同カテゴリのおすすめ -->
    ${related.length ? `
    <section class="detail__related reveal">
      <h2 class="detail__related-title">
        ${cat.emoji} <span class="t-ja">「${cat.ja}」の仲間たち</span><span class="t-ko">'${cat.ko}' 친구들</span>
      </h2>
      <div class="detail__related-grid">${relatedHtml}</div>
    </section>` : ""}

    <div class="detail__back">
      <a class="btn btn--red" href="index.html#menu"><span class="t-ja">メニュー一覧へ戻る</span><span class="t-ko">메뉴로 돌아가기</span></a>
    </div>`;
}
