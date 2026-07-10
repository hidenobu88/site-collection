/* =========================================================
   서울골목 ソウル横丁 — main.js（トップページ）
   メニュー一覧の描画とカテゴリタブ
   ※データは menu-data.js（CATEGORIES / MENU）を使用
========================================================= */

const board = document.getElementById("menuBoard");
const tabs = document.getElementById("menuTabs");

function spicyMark(n) {
  return n > 0 ? `<span class="card__spicy" title="辛さ">${"🌶️".repeat(n)}</span>` : "";
}

function renderTabs() {
  const all = `<button class="tab is-active" data-cat="all" role="tab" aria-selected="true">
      <span class="t-ja">ぜんぶ</span><span class="t-ko">전체</span></button>`;
  tabs.innerHTML = all + CATEGORIES.map(c => `
    <button class="tab" data-cat="${c.id}" role="tab" aria-selected="false">
      ${c.emoji} <span class="t-ja">${c.ja}</span><span class="t-ko">${c.ko}</span>
    </button>`).join("");
}

function renderBoard() {
  board.innerHTML = CATEGORIES.map(cat => {
    const items = MENU.filter(m => m.cat === cat.id);
    const cards = items.map((m, i) => `
      <a class="card ${m.pop ? "card--pop" : ""}" href="menu.html?id=${m.id}" style="--r:${(i % 5 - 2) * 0.6}deg">
        ${m.pop ? `<span class="card__badge"><span class="t-ja">人気</span><span class="t-ko">인기</span></span>` : ""}
        <h4 class="card__name">
          <span class="card__ko">${m.emoji} ${m.ko}</span>
          <span class="card__ja">${m.ja}</span>
        </h4>
        <p class="card__desc">
          <span class="t-ja">${m.dJa}</span>
          <span class="t-ko">${m.dKo}</span>
        </p>
        <div class="card__foot">
          <span class="card__meta">
            ${m.to ? `<span class="card__to" title="テイクアウト人気">🥡</span>` : ""}
            ${spicyMark(m.spicy)}
            ${m.unitJa ? `<span class="card__unit"><span class="t-ja">${m.unitJa}</span><span class="t-ko">${m.unitKo}</span></span>` : ""}
          </span>
          <span class="card__price">¥${m.price.toLocaleString()}</span>
        </div>
        <span class="card__more"><span class="t-ja">くわしく見る →</span><span class="t-ko">자세히 보기 →</span></span>
      </a>`).join("");
    return `
      <section class="menu__cat" data-cat="${cat.id}">
        <h3 class="menu__cat-title">
          <span class="menu__cat-emoji">${cat.emoji}</span>
          <span class="menu__cat-ko">${cat.ko}</span>
          <span class="menu__cat-ja">${cat.ja}</span>
        </h3>
        <div class="menu__grid">${cards}</div>
      </section>`;
  }).join("");
}

renderTabs();
renderBoard();

/* カテゴリ絞り込み */
tabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  tabs.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("is-active", t === btn);
    t.setAttribute("aria-selected", t === btn ? "true" : "false");
  });
  const cat = btn.dataset.cat;
  document.querySelectorAll(".menu__cat").forEach(sec => {
    sec.style.display = (cat === "all" || sec.dataset.cat === cat) ? "" : "none";
  });
});
