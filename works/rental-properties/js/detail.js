// ============================================================
// 物件詳細ページ ロジック
// ============================================================

const params = new URLSearchParams(location.search);

// ---------- お気に入り ----------
const FAV_KEY = "sumika-favorites";

function loadFavs() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function persistFavs(favs) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  } catch {
    // localStorage が使えない環境ではセッション中のみ保持
  }
}

const favorites = loadFavs();

// ---------- NoImage ----------
function noImageHTML() {
  return `
    <div class="noimage">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2"/>
        <circle cx="8.5" cy="10" r="1.5"/>
        <path d="M21 15l-5-5-7 7"/>
      </svg>
      <span>NO IMAGE</span>
    </div>`;
}

function row(th, td) {
  return `<tr><th>${th}</th><td>${td}</td></tr>`;
}

const STRONG_TAGS = ["ペット可", "ペット相談可", "敷金なし", "礼金なし", "駅直結", "ペントハウス"];

// ---------- 描画 ----------
function renderDetail(room) {
  const building = getBuilding(room.buildingId);
  const roomTitle = `${building.name} ${room.roomNo}号室`;

  document.title = `${roomTitle} | スミカ不動産`;

  // パンくず・タイトル
  document.getElementById("breadcrumb").innerHTML =
    `<a href="index.html">物件をさがす</a> &gt; <a href="index.html?type=${building.type}">${TYPE_LABELS[building.type]}</a> &gt; ${roomTitle}`;

  document.getElementById("titleBlock").innerHTML = `
    <h1>${roomTitle} <span class="type-badge ${building.type}" style="position:static;vertical-align:middle">${TYPE_LABELS[building.type]}</span></h1>
    <div class="sub">${building.address} / ${accessText(building)}</div>`;

  // ギャラリー
  const gallery = document.getElementById("gallery");
  const images = room.images || [];
  if (images.length === 0) {
    gallery.innerHTML = `<div class="gallery-main">${noImageHTML()}</div>`;
  } else {
    const thumbs = images.map((src, i) =>
      `<button type="button" class="thumb ${i === 0 ? "active" : ""}" data-index="${i}"><img src="${src}" alt="写真${i + 1}" /></button>`
    ).join("");
    gallery.innerHTML = `
      <div class="gallery-main"><img id="mainPhoto" src="${images[0]}" alt="${roomTitle}の写真" /></div>
      <div class="gallery-thumbs">${thumbs}</div>`;
    gallery.querySelectorAll(".thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("mainPhoto").src = images[Number(btn.dataset.index)];
        gallery.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  // 説明
  document.getElementById("description").textContent = room.description;

  // 部屋情報テーブル
  document.getElementById("roomTable").innerHTML = [
    row("賃料", `<strong style="color:var(--accent)">${formatRent(room.rent)}</strong>`),
    row("管理費・共益費", formatYen(room.managementFee)),
    row("敷金", formatMonths(room.deposit, room.rent)),
    row("礼金", formatMonths(room.keyMoney, room.rent)),
    row("間取り", room.layout),
    row("専有面積", `${room.area}㎡`),
    row("所在階", `${room.floor}階 / ${building.totalFloors}階建て`),
    row("向き", room.direction + "向き"),
    row("駐車場", room.parking || "なし"),
    row("ペット", room.pet ? "可・相談可(詳細はお問い合わせください)" : "不可"),
    row("入居可能日", "即入居可(要相談)"),
    row("契約期間", "2年(更新料 新賃料の1ヶ月分)"),
    row("保険等", "借家人賠償責任保険への加入要"),
    row("取引態様", "仲介")
  ].join("");

  // 設備タグ
  document.getElementById("featureTags").innerHTML = room.tags
    .map((t) => `<span class="tag ${STRONG_TAGS.includes(t) ? "tag-strong" : ""}">${t}</span>`)
    .join("");

  // 建物情報テーブル
  document.getElementById("buildingTable").innerHTML = [
    row("建物名", building.name),
    row("種別", TYPE_LABELS[building.type]),
    row("所在地", building.address),
    row("交通", accessText(building)),
    row("築年", `${building.builtYear}年(築${buildingAge(building)}年)`),
    row("構造", building.structure),
    row("階建・総戸数", `${building.totalFloors}階建て / 全${building.totalUnits}戸`),
    row("備考", building.note)
  ].join("");

  // 賃料カード
  renderPriceCard(room, building);

  // 同じ建物のほかの部屋
  const others = ROOMS.filter((r) => r.buildingId === building.id && r.id !== room.id);
  document.getElementById("otherRooms").innerHTML = others.length === 0
    ? '<p style="font-size:13px;color:var(--text-sub)">現在、ほかに募集中のお部屋はありません。</p>'
    : others.map((r) => `
        <a class="other-room-link" href="detail.html?id=${r.id}">
          <span>${r.roomNo}号室 (${r.layout} / ${r.area}㎡ / ${r.floor}階)</span>
          <span class="r-rent">${formatRent(r.rent)}</span>
        </a>`).join("");
}

function renderPriceCard(room, building) {
  const isFav = favorites.has(room.id);
  document.getElementById("priceCard").innerHTML = `
    <div class="rent-big">${(room.rent / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}<span class="unit">万円</span></div>
    <div class="fee-line">管理費・共益費 ${formatYen(room.managementFee)}</div>
    <div class="price-rows">
      <div class="row"><span class="k">敷金</span><span>${formatMonths(room.deposit, room.rent)}</span></div>
      <div class="row"><span class="k">礼金</span><span>${formatMonths(room.keyMoney, room.rent)}</span></div>
      <div class="row"><span class="k">間取り / 面積</span><span>${room.layout} / ${room.area}㎡</span></div>
      <div class="row"><span class="k">築年数</span><span>築${buildingAge(building)}年</span></div>
    </div>
    <a class="btn-contact" href="index.html">← 検索一覧へ戻る</a>
    <a class="btn-fav-detail" href="index.html?type=${building.type}">${TYPE_LABELS[building.type]}をもっと見る</a>
    <button type="button" class="btn-fav-detail ${isFav ? "active" : ""}" id="favBtn">${isFav ? "♥ お気に入り登録済み" : "♡ お気に入りに追加"}</button>`;

  document.getElementById("favBtn").addEventListener("click", () => {
    if (favorites.has(room.id)) favorites.delete(room.id);
    else favorites.add(room.id);
    persistFavs(favorites);
    renderPriceCard(room, building);
  });
}

// ---------- ナビゲーション(戻る・前後の物件) ----------
function initNavigation(room) {
  // ブラウザ履歴があれば「戻る」で検索条件を保ったまま一覧に復帰
  const backBtn = document.getElementById("backBtn");
  backBtn.addEventListener("click", (e) => {
    if (document.referrer && new URL(document.referrer, location.href).origin === location.origin) {
      e.preventDefault();
      history.back();
    }
  });

  // 前の物件 / 次の物件(掲載順)
  const idx = ROOMS.findIndex((r) => r.id === room.id);
  const prev = ROOMS[idx - 1];
  const next = ROOMS[idx + 1];
  const pagerHTML = [];
  if (prev) {
    const pb = getBuilding(prev.buildingId);
    pagerHTML.push(`<a class="room-nav-link" href="detail.html?id=${prev.id}" title="${pb.name} ${prev.roomNo}号室">‹ 前の物件</a>`);
  }
  if (next) {
    const nb = getBuilding(next.buildingId);
    pagerHTML.push(`<a class="room-nav-link" href="detail.html?id=${next.id}" title="${nb.name} ${next.roomNo}号室">次の物件 ›</a>`);
  }
  document.getElementById("roomPager").innerHTML = pagerHTML.join("");
}

// ---------- 初期化 ----------
// APIサーバー稼働時はDBのデータに差し替えてから描画(なければ静的データ)
loadRemoteData().finally(() => {
  const room = getRoom(params.get("id"));
  if (room) {
    renderDetail(room);
    initNavigation(room);
  } else {
    document.querySelector(".detail-layout").innerHTML =
      '<div class="empty-result"><strong>お部屋が見つかりませんでした</strong><a href="index.html" style="color:var(--primary)">物件一覧へ戻る</a></div>';
  }
});
