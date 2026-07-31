/* =========================================================
 * VERSE道場破り — レンダリング・検索・進捗保存
 * ========================================================= */
(function () {
  "use strict";

  var ALL_QUESTIONS = []
    .concat(typeof BEGINNER_QUESTIONS !== "undefined" ? BEGINNER_QUESTIONS : [])
    .concat(typeof INTERMEDIATE_QUESTIONS !== "undefined" ? INTERMEDIATE_QUESTIONS : [])
    .concat(typeof ADVANCED_QUESTIONS !== "undefined" ? ADVANCED_QUESTIONS : []);

  var STORAGE_KEY = "versedojo:done:v1";

  /* ---------- 進捗の読み書き ---------- */
  function loadDone() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      return new Set();
    }
  }
  function saveDone(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) { /* ignore */ }
  }
  var doneSet = loadDone();

  /* ---------- ユーティリティ ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function stripTags(s) {
    return String(s).replace(/<[^>]*>/g, "");
  }

  var KEYWORDS = [
    "if","then","else","for","loop","break","return","var","set",
    "class","interface","enum","struct","module","using","where",
    "and","or","not","true","false","spawn","sync","race",
    "rush","branch","defer","block","case","external"
  ];
  var SPECIFIERS = [
    "public","private","protected","internal","override","computes",
    "converges","decides","transacts","varies","suspends","persistable",
    "closed","open","native","final","unique","concrete","abstract",
    "editable","final_super"
  ];
  var TYPES = [
    "int","float","rational","logic","string","char","void","agent",
    "player","vector3","vector2","rotation","transform","task","type",
    "location","path","comparable","orderable","subtype"
  ];

  // 1回の正規表現パス(コメント/文字列/specifier/キーワード/型名/数値を
  // 優先順位つきの選択群としてまとめる)で置換することで、多段replaceに
  // ありがちな「置換結果を別ルールが再度誤って書き換える」事故を避ける。
  var TOKEN_RE = new RegExp(
    "(#.*)" +                                             // 1: コメント
    "|(\"(?:[^\"\\\\]|\\\\.)*\")" +             // 2: 文字列
    "|(&lt;(?:" + SPECIFIERS.join("|") + ")&gt;)" +        // 3: specifier
    "|(\\b(?:" + KEYWORDS.join("|") + ")\\b)" +        // 4: キーワード
    "|(\\b(?:" + TYPES.join("|") + ")\\b)" +           // 5: 型名
    "|(\\b\\d+(?:\\.\\d+)?\\b)",                 // 6: 数値
    "g"
  );

  // 生のVerseコードを安全にエスケープしつつ、軽くハイライトする
  function highlight(code) {
    var escaped = escapeHtml(code);
    return escaped.replace(TOKEN_RE, function (m, com, str, spec, kw, type, num) {
      if (com) return '<span class="tok-com">' + com + "</span>";
      if (str) return '<span class="tok-str">' + str + "</span>";
      if (spec) return '<span class="tok-spec">' + spec + "</span>";
      if (kw) return '<span class="tok-kw">' + kw + "</span>";
      if (type) return '<span class="tok-type">' + type + "</span>";
      if (num) return '<span class="tok-num">' + num + "</span>";
      return m;
    });
  }

  var LV_LABEL = { b: "初級", i: "中級", a: "上級" };
  var LV_ICON = { b: "🌱", i: "⚔️", a: "🐉" };

  /* ---------- カード生成 ---------- */
  function codeBlockHtml(code) {
    return (
      '<div class="code-block">' +
        '<div class="code-block-head">' +
          '<div class="code-block-title"><span class="code-dots"><span></span><span></span><span></span></span>verse</div>' +
          '<button type="button" class="copy-btn">📋 コピー</button>' +
        "</div>" +
        "<pre><code>" + highlight(code) + "</code></pre>" +
      "</div>"
    );
  }

  function cardHtml(q) {
    var idStr = "q" + q.n;
    var numStr = "Q" + String(q.n).padStart(3, "0");
    var hintHtml = q.hint
      ? '<p class="hint">💡 ヒント: ' + q.hint + "</p>"
      : "";
    return (
      '<article class="q-card" id="' + idStr + '" data-n="' + q.n + '" data-lv="' + q.lv + '" data-cat="' + escapeHtml(q.cat) + '">' +
        '<div class="q-head">' +
          '<span class="q-num">' + numStr + "</span>" +
          '<span class="belt-badge ' + q.lv + '">' + LV_ICON[q.lv] + " " + LV_LABEL[q.lv] + "</span>" +
          '<span class="q-cat">#' + escapeHtml(q.cat) + "</span>" +
          '<span class="q-head-spacer"></span>' +
          '<label class="done-check" data-n="' + q.n + '">' +
            '<input type="checkbox" ' + (doneSet.has(q.n) ? "checked" : "") + " />" +
            "<span>クリア</span>" +
          "</label>" +
        "</div>" +
        '<div class="lesson">' +
          '<div class="lesson-label">📖 師範の教え ── ' + q.concept + "</div>" +
          "<p>" + q.explain + "</p>" +
          codeBlockHtml(q.example) +
        "</div>" +
        '<div class="problem">' +
          '<div class="problem-label">⚔️ 問題 ' + numStr + "</div>" +
          "<p>" + q.problem + "</p>" +
          hintHtml +
        "</div>" +
        '<details class="answer">' +
          '<summary>模範解答を見る<span class="arrow">▾</span></summary>' +
          '<div class="answer-body">' +
            codeBlockHtml(q.answer) +
            '<p class="answer-note">' + q.note + "</p>" +
          "</div>" +
        "</details>" +
      "</article>"
    );
  }

  /* ---------- 初期描画 ---------- */
  var listEl = document.getElementById("questionList");
  var htmlParts = ALL_QUESTIONS.map(cardHtml);
  listEl.innerHTML = htmlParts.join("");

  // 検索用テキストをあらかじめ計算
  ALL_QUESTIONS.forEach(function (q) {
    q._search = (
      q.concept + " " + q.cat + " " + stripTags(q.problem) + " " + stripTags(q.explain)
    ).toLowerCase();
  });

  /* ---------- カテゴリ選択肢の生成 ---------- */
  var catSelect = document.getElementById("catSelect");
  var seenCats = [];
  ALL_QUESTIONS.forEach(function (q) {
    if (seenCats.indexOf(q.cat) === -1) seenCats.push(q.cat);
  });
  seenCats.forEach(function (c) {
    var opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    catSelect.appendChild(opt);
  });

  /* ---------- レベル別カウント表示 ---------- */
  function countByLevel(lv) {
    return ALL_QUESTIONS.filter(function (q) { return lv === "all" || q.lv === lv; }).length;
  }
  document.getElementById("cntAll").textContent = countByLevel("all");
  document.getElementById("cntB").textContent = countByLevel("b");
  document.getElementById("cntI").textContent = countByLevel("i");
  document.getElementById("cntA").textContent = countByLevel("a");

  var statB = document.querySelector(".stat-pill.lv-b b");
  var statI = document.querySelector(".stat-pill.lv-i b");
  var statA = document.querySelector(".stat-pill.lv-a b");
  if (statB) statB.textContent = countByLevel("b");
  if (statI) statI.textContent = countByLevel("i");
  if (statA) statA.textContent = countByLevel("a");

  /* ---------- 状態 ---------- */
  var state = { lv: "all", q: "", onlyUndone: false, cat: "" };
  var cardEls = null; // 遅延取得(再描画しないので一度だけ)

  function getCardEls() {
    if (!cardEls) cardEls = Array.from(listEl.querySelectorAll(".q-card"));
    return cardEls;
  }

  function applyFilters() {
    var qtext = state.q.trim().toLowerCase();
    var visibleCount = 0;
    getCardEls().forEach(function (el) {
      var n = Number(el.dataset.n);
      var q = ALL_QUESTIONS[n - 1];
      var ok = true;
      if (state.lv !== "all" && q.lv !== state.lv) ok = false;
      if (ok && state.cat && q.cat !== state.cat) ok = false;
      if (ok && state.onlyUndone && doneSet.has(n)) ok = false;
      if (ok && qtext && q._search.indexOf(qtext) === -1) ok = false;
      el.hidden = !ok;
      if (ok) visibleCount++;
    });
    document.getElementById("emptyState").hidden = visibleCount !== 0;
  }

  /* ---------- 進捗UI更新 ---------- */
  function updateProgressUI() {
    var done = doneSet.size;
    var total = ALL_QUESTIONS.length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("statCleared").textContent = done;
    document.getElementById("listProgressFill").style.width = pct + "%";
  }

  /* ---------- クリアチェック ---------- */
  listEl.addEventListener("change", function (e) {
    var check = e.target.closest(".done-check input");
    if (!check) return;
    var label = check.closest(".done-check");
    var n = Number(label.dataset.n);
    if (check.checked) doneSet.add(n); else doneSet.delete(n);
    saveDone(doneSet);
    label.classList.toggle("is-done", check.checked);
    var card = check.closest(".q-card");
    if (card) card.classList.toggle("is-done", check.checked);
    updateProgressUI();
    if (state.onlyUndone) applyFilters();
  });
  // 初期表示のis-doneクラス反映
  getCardEls().forEach(function (el) {
    var n = Number(el.dataset.n);
    if (doneSet.has(n)) {
      el.classList.add("is-done");
      var lbl = el.querySelector(".done-check");
      if (lbl) lbl.classList.add("is-done");
    }
  });
  updateProgressUI();

  /* ---------- コードコピー ---------- */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".copy-btn");
    if (!btn) return;
    var block = btn.closest(".code-block");
    var codeEl = block && block.querySelector("pre code");
    if (!codeEl) return;
    var text = codeEl.textContent;
    var done = function () {
      var original = btn.textContent;
      btn.textContent = "✔ コピー済み";
      btn.classList.add("is-copied");
      setTimeout(function () {
        btn.textContent = "📋 コピー";
        btn.classList.remove("is-copied");
      }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  });
  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
    cb();
  }

  /* ---------- タブ切り替え ---------- */
  document.getElementById("levelTabs").addEventListener("click", function (e) {
    var btn = e.target.closest(".tab");
    if (!btn) return;
    document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("is-active"); });
    btn.classList.add("is-active");
    state.lv = btn.dataset.lv;
    applyFilters();
  });

  /* ---------- 検索・フィルタ ---------- */
  var searchInput = document.getElementById("searchInput");
  var searchTimer = null;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.q = searchInput.value;
      applyFilters();
    }, 120);
  });
  document.getElementById("onlyUndone").addEventListener("change", function (e) {
    state.onlyUndone = e.target.checked;
    applyFilters();
  });
  catSelect.addEventListener("change", function (e) {
    state.cat = e.target.value;
    applyFilters();
  });

  /* ---------- スクロール系(進捗バー・戻るボタン) ---------- */
  var topFill = document.getElementById("topProgressFill");
  var fab = document.getElementById("fabTop");
  function onScroll() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - doc.clientHeight;
    var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    topFill.style.width = pct + "%";
    if (window.scrollY > 600) fab.classList.add("is-visible");
    else fab.classList.remove("is-visible");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  fab.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  applyFilters();
})();
