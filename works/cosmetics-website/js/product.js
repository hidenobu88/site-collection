/* ═══════════════════════════════════════════
   Belle Éclat — 商品詳細ページ
   ═══════════════════════════════════════════ */

const root = document.getElementById("detailRoot");
const params = new URLSearchParams(location.search);
const product = PRODUCTS[Number(params.get("id"))];

if (!product) {
  root.innerHTML = `
    <div class="detail-notfound">
      <p>お探しの商品が見つかりませんでした。</p>
      <a href="index.html" class="btn btn-primary">トップページへ戻る</a>
    </div>`;
} else {
  const category = CATEGORIES.find((c) => c.id === product.cat);
  const features = CATEGORY_FEATURES[product.cat] || [];
  document.title = `${product.name} | Belle Éclat`;

  root.innerHTML = `
    <nav class="breadcrumb">
      <a href="index.html">ホーム</a> ›
      <a href="index.html#${category.id}">${category.title}</a> ›
      <span>${product.name}</span>
    </nav>

    <div class="detail">
      <div class="detail-visual" style="background:${product.bg}">
        ${product.badge ? `<span class="badge ${product.badge === "NEW" ? "green" : product.badge === "人気No.1" ? "gold" : ""}">${product.badge}</span>` : ""}
        <span class="detail-emoji">${product.emoji}</span>
      </div>

      <div class="detail-info">
        <p class="product-brand">${product.brand}</p>
        <h1 class="detail-name">${product.name}</h1>
        <p class="product-rating detail-rating">
          ${stars(product.rating)}<span>${product.rating}(${product.reviews.toLocaleString()}件のレビュー)</span>
        </p>
        <p class="detail-price">${yen(product.price)}<small> (税込)</small></p>
        <p class="detail-desc">${product.desc}</p>

        <ul class="detail-features">
          ${features.map((f) => `<li>✔ ${f}</li>`).join("")}
        </ul>

        <div class="detail-buy">
          <div class="qty-ctrl detail-qty">
            <button class="qty-btn" id="qtyMinus" aria-label="1つ減らす">−</button>
            <span class="qty-num" id="qtyNum">1</span>
            <button class="qty-btn" id="qtyPlus" aria-label="1つ増やす">＋</button>
          </div>
          <button class="btn btn-primary detail-add" id="detailAddBtn">カートに追加する</button>
        </div>

        <div class="detail-notes">
          <p>🚚 15時までのご注文で当日発送(最短翌日お届け)</p>
          <p>💝 無料ギフトラッピング承ります</p>
          <p>↩️ 未開封に限り30日間返品保証</p>
        </div>
      </div>
    </div>`;

  // 数量ステッパー
  let qty = 1;
  const qtyNum = document.getElementById("qtyNum");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyNum.textContent = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(10, qty + 1);
    qtyNum.textContent = qty;
  });

  // カートに追加(数量つき)
  document.getElementById("detailAddBtn").addEventListener("click", () => {
    addToCart(product.id, qty);
    openCart();
  });

  // 関連商品(同カテゴリーから最大4件)
  const related = PRODUCTS.filter((p) => p.cat === product.cat && p.id !== product.id).slice(0, 4);
  if (related.length > 0) {
    document.getElementById("relatedSection").hidden = false;
    document.getElementById("relatedGrid").innerHTML = related.map((p) => cardHTML(p)).join("");
  }
}
