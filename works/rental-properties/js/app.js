// ============================================================
// 一覧・検索ページ ロジック
// ============================================================

const grid = document.getElementById("roomGrid");
const emptyResult = document.getElementById("emptyResult");
const resultCount = document.getElementById("resultCount");
const form = document.getElementById("searchForm");
const sortSelect = document.getElementById("sortSelect");
const favFilterBtn = document.getElementById("favFilterBtn");
const favCountEl = document.getElementById("favCount");

let favOnly = false;

// ---------- お気に入り(localStorage) ----------
const FAV_KEY = "sumika-favorites";

function loadFavs() {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveFavs(favs) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  } catch {
    // localStorage が使えない環境ではセッション中のみ保持
  }
  favCountEl.textContent = favs.size;
}

let favorites = loadFavs();
favCountEl.textContent = favorites.size;

// ---------- NoImage プレースホルダ ----------
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

function photoHTML(room) {
  if (room.images && room.images.length > 0) {
    const b = getBuilding(room.buildingId);
    return `<img src="${room.images[0]}" alt="${b.name} ${room.roomNo}号室の写真" loading="lazy" />`;
  }
  return noImageHTML();
}

// ---------- 賃料セレクトの選択肢 ----------
const RENT_STEPS = [30000, 50000, 70000, 100000, 150000, 200000, 300000, 500000, 1000000];

function initRentSelects() {
  const min = document.getElementById("rentMin");
  const max = document.getElementById("rentMax");
  min.innerHTML = '<option value="">下限なし</option>';
  max.innerHTML = '<option value="">上限なし</option>';
  for (const yen of RENT_STEPS) {
    const label = yen / 10000 + "万円";
    min.insertAdjacentHTML("beforeend", `<option value="${yen}">${label}</option>`);
    max.insertAdjacentHTML("beforeend", `<option value="${yen}">${label}</option>`);
  }
}

// ---------- 条件判定 ----------
function matchLayout(room, groups) {
  if (groups.length === 0) return true;
  return groups.some((g) => {
    if (g === "1R/1K") return room.layout === "1R" || room.layout === "1K";
    if (g === "1DK") return room.layout === "1DK";
    if (g === "1LDK") return room.layout === "1LDK";
    if (g === "2K/2DK") return room.layout === "2K" || room.layout === "2DK";
    if (g === "2LDK") return room.layout === "2LDK";
    if (g === "3+") return /^[34]/.test(room.layout);
    return false;
  });
}

function matchCond(room, building, cond) {
  switch (cond) {
    case "pet": return room.pet;
    case "parking": return room.parking !== "";
    case "noDeposit": return room.deposit === 0;
    case "noKeyMoney": return room.keyMoney === 0;
    case "autolock": return room.tags.includes("オートロック");
    case "separateBath": return room.tags.includes("バス・トイレ別") || room.tags.includes("追い焚き");
    case "deliveryBox": return room.tags.includes("宅配ボックス");
    case "reheating": return room.tags.includes("追い焚き");
    case "floorHeating": return room.tags.includes("床暖房");
    case "freeInternet": return room.tags.includes("インターネット無料");
    case "upperFloor": return room.floor >= 2;
    case "concierge": return room.tags.includes("コンシェルジュ");
    default: return true;
  }
}

function getFilters() {
  const fd = new FormData(form);
  return {
    types: fd.getAll("type"),
    rentMin: fd.get("rentMin") ? Number(fd.get("rentMin")) : null,
    rentMax: fd.get("rentMax") ? Number(fd.get("rentMax")) : null,
    layouts: fd.getAll("layout"),
    maxAge: fd.get("maxAge") ? Number(fd.get("maxAge")) : null,
    maxWalk: fd.get("maxWalk") ? Number(fd.get("maxWalk")) : null,
    minArea: fd.get("minArea") ? Number(fd.get("minArea")) : null,
    conds: fd.getAll("cond"),
    keyword: (fd.get("keyword") || "").trim()
  };
}

function filterRooms() {
  const f = getFilters();
  return ROOMS.filter((room) => {
    const b = getBuilding(room.buildingId);
    if (favOnly && !favorites.has(room.id)) return false;
    if (f.types.length > 0 && !f.types.includes(b.type)) return false;
    if (f.rentMin !== null && room.rent < f.rentMin) return false;
    if (f.rentMax !== null && room.rent > f.rentMax) return false;
    if (!matchLayout(room, f.layouts)) return false;
    if (f.maxAge !== null && buildingAge(b) > f.maxAge) return false;
    if (f.maxWalk !== null && minWalk(b) > f.maxWalk) return false;
    if (f.minArea !== null && room.area < f.minArea) return false;
    if (!f.conds.every((c) => matchCond(room, b, c))) return false;
    if (f.keyword) {
      const haystack = [
        b.name, b.address, b.note, room.layout, room.description,
        ...room.tags, ...b.access.map((a) => a.line + a.station)
      ].join(" ");
      if (!haystack.includes(f.keyword)) return false;
    }
    return true;
  });
}

function sortRooms(rooms) {
  const sorted = [...rooms];
  switch (sortSelect.value) {
    case "rentAsc": sorted.sort((a, b) => a.rent - b.rent); break;
    case "rentDesc": sorted.sort((a, b) => b.rent - a.rent); break;
    case "ageAsc":
      sorted.sort((a, b) => getBuilding(b.buildingId).builtYear - getBuilding(a.buildingId).builtYear);
      break;
    case "areaDesc": sorted.sort((a, b) => b.area - a.area); break;
    default: break; // おすすめ順 = データ順
  }
  return sorted;
}

// ---------- 描画 ----------
const STRONG_TAGS = ["ペット可", "ペット相談可", "敷金なし", "礼金なし", "駅直結", "ペントハウス"];

function cardHTML(room) {
  const b = getBuilding(room.buildingId);
  const isFav = favorites.has(room.id);
  const tags = room.tags.slice(0, 5).map((t) => {
    const cls = STRONG_TAGS.includes(t) ? "tag tag-strong" : "tag";
    return `<span class="${cls}">${t}</span>`;
  }).join("");

  return `
    <a class="room-card" href="detail.html?id=${room.id}">
      <div class="card-photo">
        ${photoHTML(room)}
        <span class="type-badge ${b.type}">${TYPE_LABELS[b.type]}</span>
        <button type="button" class="fav-heart ${isFav ? "active" : ""}" data-room="${room.id}" aria-label="お気に入りに追加">♥</button>
      </div>
      <div class="card-body">
        <div class="card-rent">${formatRent(room.rent)}<span class="fee">管理費 ${formatYen(room.managementFee)}</span></div>
        <div class="card-name">${b.name} ${room.roomNo}号室</div>
        <div class="card-specs">
          ${room.layout} / ${room.area}㎡ / ${room.floor}階 / 築${buildingAge(b)}年<br />
          ${b.access[0].line}「${b.access[0].station}」${b.access[0].note ? b.access[0].note : "徒歩" + b.access[0].walk + "分"}
        </div>
        <div class="card-tags">${tags}</div>
      </div>
    </a>`;
}

// ---------- ページネーション ----------
const PAGE_SIZE = 12;
let currentPage = 1;

function renderPager(total) {
  const pager = document.getElementById("pager");
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) {
    pager.innerHTML = "";
    return;
  }
  let html = `<button type="button" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>‹ 前へ</button>`;
  for (let p = 1; p <= pages; p++) {
    html += `<button type="button" data-page="${p}" class="${p === currentPage ? "current" : ""}">${p}</button>`;
  }
  html += `<button type="button" data-page="${currentPage + 1}" ${currentPage === pages ? "disabled" : ""}>次へ ›</button>`;
  pager.innerHTML = html;
  pager.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = Number(btn.dataset.page);
      render();
      document.querySelector(".result-header").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function render() {
  const rooms = sortRooms(filterRooms());
  resultCount.textContent = rooms.length;
  const pages = Math.max(1, Math.ceil(rooms.length / PAGE_SIZE));
  if (currentPage > pages) currentPage = pages;
  const pageRooms = rooms.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  grid.innerHTML = pageRooms.map(cardHTML).join("");
  renderPager(rooms.length);
  emptyResult.hidden = rooms.length > 0;

  grid.querySelectorAll(".fav-heart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.dataset.room;
      if (favorites.has(id)) favorites.delete(id);
      else favorites.add(id);
      saveFavs(favorites);
      btn.classList.toggle("active", favorites.has(id));
      if (favOnly) render();
    });
  });
}

// ---------- イベント ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentPage = 1;
  render();
});

form.addEventListener("change", () => {
  currentPage = 1;
  render();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  form.reset();
  favOnly = false;
  favFilterBtn.classList.remove("active");
  currentPage = 1;
  render();
});

sortSelect.addEventListener("change", () => {
  currentPage = 1;
  render();
});

favFilterBtn.addEventListener("click", () => {
  favOnly = !favOnly;
  favFilterBtn.classList.toggle("active", favOnly);
  currentPage = 1;
  render();
});

document.querySelectorAll(".type-shortcut").forEach((btn) => {
  btn.addEventListener("click", () => {
    form.reset();
    favOnly = false;
    favFilterBtn.classList.remove("active");
    const cb = form.querySelector(`input[name="type"][value="${btn.dataset.type}"]`);
    if (cb) cb.checked = true;
    currentPage = 1;
    render();
    document.querySelector(".main-layout").scrollIntoView({ behavior: "smooth" });
  });
});

// ---------- 初期化 ----------
initRentSelects();

// URLパラメータ ?type=apartment などにも対応
const params = new URLSearchParams(location.search);
if (params.get("type")) {
  const cb = form.querySelector(`input[name="type"][value="${params.get("type")}"]`);
  if (cb) cb.checked = true;
}

// APIサーバー稼働時はDBのデータに差し替えてから描画(なければ静的データ)
loadRemoteData().finally(render);
