/* ═══════════════════════════════════════════
   Belle Éclat — 共通動作(カート・検索・トースト)
   ═══════════════════════════════════════════ */

/* ══════════ トースト ══════════ */

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ══════════ カート(localStorageで全ページ共有) ══════════ */

const CART_KEY = "belleEclatCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartBadge();
  renderCartDrawer();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  setCart(cart);
  showToast("カートに追加しました 🛍️");
}

function changeQty(id, delta) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  setCart(cart);
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  setCart(cart);
}

function renderCartBadge() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  const cart = getCart();
  badge.textContent = Object.values(cart).reduce((a, b) => a + b, 0);
}

function renderCartDrawer() {
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!wrap || !totalEl) return;

  const cart = getCart();
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    wrap.innerHTML = `<p class="cart-empty">カートは空です 🌸<br />お気に入りのアイテムを見つけてください。</p>`;
    totalEl.textContent = yen(0);
    return;
  }

  let total = 0;
  wrap.innerHTML = ids
    .map((id) => {
      const p = PRODUCTS[Number(id)];
      if (!p) return "";
      const qty = cart[id];
      total += p.price * qty;
      return `
        <div class="cart-item">
          <div class="cart-thumb" style="background:${p.bg}">${p.emoji}</div>
          <div class="cart-item-info">
            <p class="cart-item-name">${p.name}</p>
            <p class="cart-item-price">${yen(p.price)} <small>× ${qty} = ${yen(p.price * qty)}</small></p>
            <div class="qty-ctrl">
              <button class="qty-btn" data-id="${p.id}" data-delta="-1" aria-label="1つ減らす">−</button>
              <span class="qty-num">${qty}</span>
              <button class="qty-btn" data-id="${p.id}" data-delta="1" aria-label="1つ増やす">＋</button>
              <button class="remove-btn" data-id="${p.id}">削除</button>
            </div>
          </div>
        </div>`;
    })
    .join("");
  totalEl.textContent = yen(total);
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("drawerBackdrop")?.classList.add("show");
}
function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("drawerBackdrop")?.classList.remove("show");
}

/* ══════════ 検索 ══════════ */

function openSearch() {
  const overlay = document.getElementById("searchOverlay");
  if (!overlay) return;
  overlay.classList.add("show");
  setTimeout(() => document.getElementById("searchInput")?.focus(), 80);
}
function closeSearch() {
  document.getElementById("searchOverlay")?.classList.remove("show");
}

function runSearch(keyword) {
  const results = document.getElementById("searchResults");
  const hint = document.getElementById("searchHint");
  if (!results || !hint) return;

  const q = keyword.trim().toLowerCase();
  if (q === "") {
    results.innerHTML = "";
    hint.textContent = "キーワードを入力すると、商品がここに表示されます。(例:リップ、マスカラ、化粧水)";
    return;
  }

  const catTitle = (catId) => CATEGORIES.find((c) => c.id === catId)?.title || "";
  const hits = PRODUCTS.filter((p) =>
    `${p.name} ${p.brand} ${p.desc} ${catTitle(p.cat)}`.toLowerCase().includes(q)
  );

  if (hits.length === 0) {
    results.innerHTML = "";
    hint.textContent = `「${keyword}」に一致する商品は見つかりませんでした。別のキーワードでお試しください。`;
    return;
  }

  hint.textContent = `「${keyword}」の検索結果:${hits.length}件`;
  results.innerHTML = hits.map((p) => cardHTML(p)).join("");
}

/* ══════════ イベント(クリック委譲) ══════════ */

document.addEventListener("click", (e) => {
  // カートに追加ボタン(カードクリックより先に判定)
  const addBtn = e.target.closest(".add-btn");
  if (addBtn) {
    e.stopPropagation();
    addToCart(Number(addBtn.dataset.id), Number(addBtn.dataset.qty || 1));
    return;
  }

  // カート内の数量変更・削除
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn && qtyBtn.closest("#cartItems")) {
    changeQty(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta));
    return;
  }
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    removeFromCart(Number(removeBtn.dataset.id));
    return;
  }

  // 商品カード → 詳細ページへ
  const card = e.target.closest(".product-card");
  if (card && card.dataset.id !== undefined) {
    location.href = `product.html?id=${card.dataset.id}`;
    return;
  }

  // カート開閉
  if (e.target.closest("#cartBtn")) { openCart(); return; }
  if (e.target.closest("#closeCart") || e.target.id === "drawerBackdrop") { closeCart(); return; }

  // レジに進む(デモ)
  if (e.target.closest("#checkoutBtn")) {
    showToast("デモサイトのため、ご購入はここまでのご案内です 💐");
    return;
  }

  // 検索開閉
  if (e.target.closest("#searchBtn")) { openSearch(); return; }
  if (e.target.closest("#closeSearch")) { closeSearch(); return; }
});

// Enterキーでもカードから詳細へ移動できるように
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
    closeCart();
  }
  if (e.key === "Enter" && e.target.classList?.contains("product-card")) {
    location.href = `product.html?id=${e.target.dataset.id}`;
  }
});

// 検索:入力のたびに絞り込み
document.getElementById("searchInput")?.addEventListener("input", (e) => runSearch(e.target.value));

// 検索オーバーレイの背景クリックで閉じる
document.getElementById("searchOverlay")?.addEventListener("click", (e) => {
  if (e.target.id === "searchOverlay") closeSearch();
});

// 初期表示
renderCartBadge();
renderCartDrawer();
