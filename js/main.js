/* =========================================================
 * main.js — サイトの動作ロジック
 * （通常このファイルを編集する必要はありません。
 *   作品の追加・編集は js/projects.js で行ってください）
 * ========================================================= */

(() => {
  "use strict";

  /* ---------- サムネイル用のグラデーション ----------
   * image 未指定の作品には、順番にこの配色が割り当てられます */
  const GRADIENTS = [
    "linear-gradient(135deg, #e96443, #904e95)",
    "linear-gradient(135deg, #1f6f5c, #7bc4a2)",
    "linear-gradient(135deg, #2b5876, #4e4376)",
    "linear-gradient(135deg, #c94b4b, #4b134f)",
    "linear-gradient(135deg, #d4a017, #b0532a)",
    "linear-gradient(135deg, #396afc, #2948ff)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #ee0979, #ff6a00)",
  ];

  const categoryLabel = (id) => {
    const c = CATEGORIES.find((c) => c.id === id);
    return c ? c.label : id;
  };

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );

  /* ---------- テーマ（ライト / ダーク） ---------- */
  const initTheme = () => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    document.getElementById("themeToggle").addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
      localStorage.setItem("theme", isDark ? "light" : "dark");
    });
  };

  /* ---------- サイト名・フッターの流し込み ---------- */
  const renderProfile = () => {
    document.title = `${PROFILE.siteName} | 作品集`;
    document.getElementById("brandName").textContent = PROFILE.siteName;
    document.getElementById("footerBrand").textContent = PROFILE.siteName;
    document.getElementById("footerCopy").textContent =
      `© ${new Date().getFullYear()} ${PROFILE.name}. All rights reserved.`;
  };

  /* ---------- 統計（作品数・カテゴリ数のカウントアップ） ---------- */
  const animateCount = (el, target) => {
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const renderStats = () => {
    const usedCategories = new Set(PROJECTS.map((p) => p.category));
    animateCount(document.getElementById("statWorks"), PROJECTS.length);
    animateCount(document.getElementById("statCategories"), usedCategories.size);
  };

  /* ---------- フィルタチップ ---------- */
  let activeCategory = "all";
  let searchQuery = "";
  let currentPage = 1;

  const renderChips = () => {
    const chipsEl = document.getElementById("filterChips");
    const counts = {};
    PROJECTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });

    const chips = [
      { id: "all", label: "すべて", count: PROJECTS.length },
      ...CATEGORIES.filter((c) => counts[c.id]).map((c) => ({
        id: c.id, label: c.label, count: counts[c.id],
      })),
    ];

    chipsEl.innerHTML = chips
      .map(
        (c) => `<button class="chip${c.id === activeCategory ? " active" : ""}" data-category="${c.id}" role="tab" aria-selected="${c.id === activeCategory}">
          ${escapeHtml(c.label)}<span class="chip-count">${c.count}</span>
        </button>`
      )
      .join("");

    chipsEl.querySelectorAll(".chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        currentPage = 1;
        renderChips();
        renderWorks();
      });
    });
  };

  /* ---------- 作品カード ---------- */
  const cardHtml = (p, index) => {
    const gradient = GRADIENTS[index % GRADIENTS.length];
    const thumb = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)} のスクリーンショット" loading="lazy" />`
      : `<span class="thumb-emoji" aria-hidden="true">${p.emoji || "🌐"}</span>
         <span class="thumb-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>`;

    return `
      <article class="work-card${p.featured ? " featured" : ""}">
        <div class="card-thumb" style="${p.image ? "" : `background:${gradient}`}">
          ${thumb}
          ${p.sample ? '<span class="sample-ribbon">SAMPLE</span>' : ""}
        </div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-category">${escapeHtml(categoryLabel(p.category))}</span>
            ${p.date ? `<span class="card-date">${escapeHtml(p.date)}</span>` : ""}
          </div>
          <h3 class="card-title">${escapeHtml(p.title)}</h3>
          <p class="card-desc">${escapeHtml(p.description)}</p>
          <div class="card-foot">
            <div class="card-tags">
              ${(p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
            </div>
            <span class="card-open" aria-hidden="true">
              見る
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
            </span>
          </div>
        </div>
        <a class="card-link-cover" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(p.title)} を新しいタブで開く"></a>
      </article>`;
  };

  const matchesSearch = (p, q) => {
    if (!q) return true;
    const haystack = [p.title, p.description, ...(p.tags || []), categoryLabel(p.category)]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  };

  const renderWorks = () => {
    const grid = document.getElementById("worksGrid");
    const empty = document.getElementById("emptyState");

    const filtered = PROJECTS
      .map((p, i) => ({ ...p, _index: i }))
      .filter((p) => activeCategory === "all" || p.category === activeCategory)
      .filter((p) => matchesSearch(p, searchQuery));
    // 表示順は projects.js の配列順のまま。featured はその位置で大きく表示される

    // ページ数は作品数から自動計算（4件区切り）
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    const pageItems = filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    grid.innerHTML = pageItems.map((p) => cardHtml(p, p._index)).join("");
    empty.hidden = filtered.length > 0;
    renderPagination(totalPages);

    // ふわっと表示（スクロール連動）
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    grid.querySelectorAll(".work-card").forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      observer.observe(card);
    });
  };

  /* ---------- ページネーション ----------
   * ページ数が多いときは「1 … 4 5 6 … 20」のように省略表示する */
  const pageNumbers = (total, current) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const list = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    list.forEach((n) => {
      if (prev && n - prev > 1) out.push("…");
      out.push(n);
      prev = n;
    });
    return out;
  };

  const renderPagination = (totalPages) => {
    const el = document.getElementById("pagination");
    if (totalPages <= 1) { el.innerHTML = ""; return; }

    const btn = (label, page, opts = {}) =>
      `<button class="page-btn${opts.active ? " active" : ""}${opts.nav ? " nav" : ""}"
        ${opts.disabled ? "disabled" : ""} data-page="${page}"
        aria-label="${opts.aria || `${page}ページ目`}" ${opts.active ? 'aria-current="page"' : ""}>${label}</button>`;

    const parts = [];
    parts.push(btn("←", currentPage - 1, { nav: true, disabled: currentPage === 1, aria: "前のページ" }));
    pageNumbers(totalPages, currentPage).forEach((n) => {
      if (n === "…") parts.push('<span class="page-ellipsis" aria-hidden="true">…</span>');
      else parts.push(btn(n, n, { active: n === currentPage }));
    });
    parts.push(btn("→", currentPage + 1, { nav: true, disabled: currentPage === totalPages, aria: "次のページ" }));
    el.innerHTML = parts.join("");

    el.querySelectorAll(".page-btn:not([disabled])").forEach((b) => {
      b.addEventListener("click", () => {
        currentPage = parseInt(b.dataset.page, 10);
        renderWorks();
        document.getElementById("works").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  /* ---------- 検索 ---------- */
  const initSearch = () => {
    const input = document.getElementById("searchInput");
    input.addEventListener("input", () => {
      searchQuery = input.value.trim().toLowerCase();
      currentPage = 1;
      renderWorks();
    });
    // 「/」キーで検索欄にフォーカス
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== input) {
        e.preventDefault();
        input.focus();
      }
    });
  };

  /* ---------- ヘッダーのスクロール演出 ---------- */
  const initHeader = () => {
    const header = document.getElementById("siteHeader");
    window.addEventListener(
      "scroll",
      () => header.classList.toggle("scrolled", window.scrollY > 10),
      { passive: true }
    );
  };

  /* ---------- 起動 ---------- */
  initTheme();
  renderProfile();
  renderStats();
  renderChips();
  renderWorks();
  initSearch();
  initHeader();
})();
