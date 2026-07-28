/* =========================================================
 * アローパズルエスケープ — app.js
 * 盤面の矢印を、進行方向がクリアなものからタップして
 * 全部にがすロジックパズル。
 * ========================================================= */

(() => {
  "use strict";

  const STORAGE_BEST = "arrowEscape_bestLevel";
  const STORAGE_MUTED = "arrowEscape_muted";
  const MAX_MISTAKES = 3;
  const MAX_SIZE = 8;

  const DIRS = {
    up:    { dr: -1, dc: 0, exitRow: -1, exitCol: 0 },
    down:  { dr: 1,  dc: 0, exitRow: 1,  exitCol: 0 },
    left:  { dr: 0,  dc: -1, exitRow: 0, exitCol: -1 },
    right: { dr: 0,  dc: 1,  exitRow: 0, exitCol: 1 },
  };
  const DIR_LIST = Object.keys(DIRS);

  /* ---------- ユーティリティ ---------- */
  const rand = (n) => Math.floor(Math.random() * n);
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* ---------- サウンド（WebAudio、簡易） ---------- */
  let audioCtx = null;
  let muted = localStorage.getItem(STORAGE_MUTED) === "1";
  const getCtx = () => {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  };
  const beep = (freq, dur, type = "sine", vol = 0.08, delay = 0) => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  };
  const sfx = {
    move: () => beep(660, 0.16, "triangle", 0.09),
    miss: () => { beep(160, 0.22, "sawtooth", 0.09); beep(110, 0.28, "sawtooth", 0.07, 0.05); },
    clear: () => { [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.18, "sine", 0.08, i * 0.09)); },
    fail: () => { [300, 220, 160].forEach((f, i) => beep(f, 0.25, "sawtooth", 0.08, i * 0.13)); },
    hint: () => beep(880, 0.12, "sine", 0.06),
  };

  /* ---------- レベル構成 ---------- */
  const levelConfig = (level) => {
    let size;
    if (level <= 2) size = 4;
    else if (level <= 5) size = 5;
    else if (level <= 9) size = 6;
    else if (level <= 14) size = 7;
    else size = 8;
    size = Math.min(size, MAX_SIZE);

    const density = clamp(0.3 + level * 0.008, 0.3, 0.55);
    const targetCount = clamp(Math.round(size * size * density), 4, size * size - 1);
    return { size, targetCount };
  };

  /* ---------- 盤面生成（逆再生アルゴリズムで解けることを保証） ----------
   * 除去する順番の「逆順」に矢印を1つずつ置いていく。
   * 置くときに「今すでに置かれている矢印（＝自分より後に除去される矢印）」
   * が自分の進行方向の直線上にないことだけを確認すればよく、
   * これにより最終盤面は必ず最後まで解ける状態になる。
   */
  const generateBoard = (size, targetCount) => {
    const occupied = new Map(); // "r,c" -> dir
    const key = (r, c) => `${r},${c}`;

    const pathClear = (r, c, dir) => {
      const { dr, dc } = DIRS[dir];
      let rr = r + dr, cc = c + dc;
      while (rr >= 0 && rr < size && cc >= 0 && cc < size) {
        if (occupied.has(key(rr, cc))) return false;
        rr += dr; cc += dc;
      }
      return true;
    };

    let placed = 0;
    const maxAttempts = targetCount * 400 + 400;
    let attempts = 0;
    while (placed < targetCount && attempts < maxAttempts) {
      attempts++;
      const r = rand(size), c = rand(size);
      if (occupied.has(key(r, c))) continue;
      const dirs = shuffle(DIR_LIST.slice());
      let chosen = null;
      for (const d of dirs) {
        if (pathClear(r, c, d)) { chosen = d; break; }
      }
      if (chosen) {
        occupied.set(key(r, c), chosen);
        placed++;
      }
    }

    const arrows = [];
    let id = 0;
    occupied.forEach((dir, k) => {
      const [r, c] = k.split(",").map(Number);
      arrows.push({ id: id++, r, c, dir });
    });
    return arrows;
  };

  /* ---------- ゲーム状態 ---------- */
  const state = {
    level: 1,
    size: 4,
    arrows: [],   // { id, r, c, dir, el }
    mistakes: 0,
    total: 0,
    busy: false,
  };

  const els = {};

  const cacheEls = () => {
    [
      "scr-title", "scr-game", "btnContinue", "btnRestartAll", "btnHowTo",
      "howtoModal", "closeHowto", "board", "hudLevel", "hudRemain", "hudHearts",
      "btnHint", "btnRetryLevel", "btnQuit", "overlayResult", "resultCard",
      "resultEyebrow", "resultTitle", "resultBody", "resultActions",
      "bestLevelLine", "bestLevelNum", "muteBtn",
    ].forEach((id) => { els[id] = document.getElementById(id); });
  };

  const showScreen = (id) => {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  };

  const getBestLevel = () => parseInt(localStorage.getItem(STORAGE_BEST) || "1", 10) || 1;
  const setBestLevel = (lv) => {
    if (lv > getBestLevel()) localStorage.setItem(STORAGE_BEST, String(lv));
  };

  /* ---------- ARROW SVG ---------- */
  const ARROW_SVG = `<svg viewBox="0 0 24 24" class="arrow-svg" aria-hidden="true">
    <path d="M12 3 L20 13 L14.5 13 L14.5 21 L9.5 21 L9.5 13 L4 13 Z"/>
  </svg>`;
  const DIR_ROTATE = { up: 0, right: 90, down: 180, left: 270 };
  const DIR_LABEL = { up: "上", right: "右", down: "下", left: "左" };

  /* ---------- 盤面の描画 ---------- */
  const renderBoard = () => {
    const board = els.board;
    board.innerHTML = "";
    board.style.setProperty("--size", state.size);

    // 背景タイル
    const tiles = document.createDocumentFragment();
    for (let i = 0; i < state.size * state.size; i++) {
      const t = document.createElement("div");
      t.className = "bg-tile";
      tiles.appendChild(t);
    }
    const tileLayer = document.createElement("div");
    tileLayer.className = "tile-layer";
    tileLayer.appendChild(tiles);
    board.appendChild(tileLayer);

    state.arrows.forEach((a) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `arrow-cell dir-${a.dir}`;
      el.style.setProperty("--row", a.r);
      el.style.setProperty("--col", a.c);
      el.innerHTML = ARROW_SVG;
      el.querySelector(".arrow-svg").style.transform = `rotate(${DIR_ROTATE[a.dir]}deg)`;
      el.setAttribute("aria-label", `${DIR_LABEL[a.dir]}向きの矢印`);
      el.addEventListener("click", () => onArrowTap(a));
      a.el = el;
      board.appendChild(el);
    });

    updateHud();
  };

  const updateHud = () => {
    els.hudLevel.textContent = state.level;
    els.hudRemain.textContent = state.arrows.length;
    els.hudHearts.textContent = "●".repeat(MAX_MISTAKES - state.mistakes) + "○".repeat(state.mistakes);
  };

  /* ---------- 移動可否判定 ---------- */
  const isMovable = (a) => {
    const { dr, dc } = DIRS[a.dir];
    let rr = a.r + dr, cc = a.c + dc;
    while (rr >= 0 && rr < state.size && cc >= 0 && cc < state.size) {
      if (state.arrows.some((o) => o !== a && o.r === rr && o.c === cc)) return false;
      rr += dr; cc += dc;
    }
    return true;
  };

  const findMovable = () => state.arrows.find((a) => isMovable(a));

  /* ---------- 矢印タップ ---------- */
  const onArrowTap = (a) => {
    if (state.busy) return;
    if (!isMovable(a)) {
      handleMistake(a);
      return;
    }
    moveArrowOut(a);
  };

  const handleMistake = (a) => {
    state.mistakes++;
    sfx.miss();
    a.el.classList.add("shake");
    setTimeout(() => a.el && a.el.classList.remove("shake"), 420);
    updateHud();
    if (state.mistakes >= MAX_MISTAKES) {
      state.busy = true;
      setTimeout(showFail, 380);
    }
  };

  const moveArrowOut = (a) => {
    state.busy = true;
    sfx.move();
    const { exitRow, exitCol } = DIRS[a.dir];
    // 盤外まで少し余分に移動させて完全にフレーム外へ
    const targetRow = exitRow !== 0 ? (exitRow < 0 ? -2 : state.size + 1) : a.r;
    const targetCol = exitCol !== 0 ? (exitCol < 0 ? -2 : state.size + 1) : a.c;
    requestAnimationFrame(() => {
      a.el.style.setProperty("--row", targetRow);
      a.el.style.setProperty("--col", targetCol);
      a.el.classList.add("escaping");
    });

    setTimeout(() => {
      state.arrows = state.arrows.filter((o) => o !== a);
      if (a.el && a.el.parentNode) a.el.parentNode.removeChild(a.el);
      updateHud();
      state.busy = false;
      if (state.arrows.length === 0) {
        setTimeout(showClear, 200);
      }
    }, 420);
  };

  /* ---------- ヒント ---------- */
  const onHint = () => {
    if (state.busy) return;
    const target = findMovable();
    if (!target) return;
    sfx.hint();
    target.el.classList.add("hint-pulse");
    setTimeout(() => target.el && target.el.classList.remove("hint-pulse"), 1500);
  };

  /* ---------- レベル開始／リトライ ---------- */
  const startLevel = (level) => {
    state.level = level;
    const { size, targetCount } = levelConfig(level);
    state.size = size;
    state.arrows = generateBoard(size, targetCount);
    state.total = state.arrows.length;
    state.mistakes = 0;
    state.busy = false;
    showScreen("scr-game");
    renderBoard();
  };

  const retryLevel = () => startLevel(state.level);

  /* ---------- 結果表示 ---------- */
  const showClear = () => {
    setBestLevel(state.level + 1);
    sfx.clear();
    els.resultCard.className = "overlay-card result-clear";
    els.resultEyebrow.textContent = "STAGE CLEAR!";
    els.resultTitle.textContent = `レベル ${state.level} クリア！`;
    els.resultBody.innerHTML = `
      <p class="result-stat">矢印 <b>${state.total}</b> 個をすべて脱出させました。</p>
      <p class="result-stat">ミス：<b>${state.mistakes}</b> / ${MAX_MISTAKES}</p>`;
    els.resultActions.innerHTML = "";
    addResultBtn("次のレベルへ →", "btn-primary", () => { hideResult(); startLevel(state.level + 1); });
    addResultBtn("メニューへ戻る", "btn-sub", () => { hideResult(); backToTitle(); });
    els.overlayResult.classList.add("active");
  };

  const showFail = () => {
    sfx.fail();
    els.resultCard.className = "overlay-card result-fail";
    els.resultEyebrow.textContent = "MISS OUT";
    els.resultTitle.textContent = `ミス${MAX_MISTAKES}回…`;
    els.resultBody.innerHTML = `<p class="result-stat">レベル <b>${state.level}</b> は失敗。新しい盤面で再挑戦しましょう。</p>`;
    els.resultActions.innerHTML = "";
    addResultBtn("もう一度挑戦", "btn-primary", () => { hideResult(); retryLevel(); });
    addResultBtn("メニューへ戻る", "btn-sub", () => { hideResult(); backToTitle(); });
    els.overlayResult.classList.add("active");
  };

  const addResultBtn = (label, cls, fn) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `btn ${cls}`;
    b.textContent = label;
    b.addEventListener("click", fn);
    els.resultActions.appendChild(b);
  };

  const hideResult = () => els.overlayResult.classList.remove("active");

  const backToTitle = () => {
    showScreen("scr-title");
    refreshTitle();
  };

  /* ---------- タイトル画面 ---------- */
  const refreshTitle = () => {
    const best = getBestLevel();
    if (best > 1) {
      els.bestLevelLine.hidden = false;
      els.bestLevelNum.textContent = best;
      els.btnContinue.textContent = `▶ レベル${best}から つづきから遊ぶ`;
    } else {
      els.bestLevelLine.hidden = true;
      els.btnContinue.textContent = "▶ スタート";
    }
  };

  /* ---------- ミュート ---------- */
  const updateMuteBtn = () => { els.muteBtn.textContent = muted ? "🔇" : "🔊"; };
  const toggleMute = () => {
    muted = !muted;
    localStorage.setItem(STORAGE_MUTED, muted ? "1" : "0");
    updateMuteBtn();
  };

  /* ---------- イベント登録 ---------- */
  const bindEvents = () => {
    els.btnContinue.addEventListener("click", () => startLevel(getBestLevel()));
    els.btnRestartAll.addEventListener("click", () => {
      localStorage.setItem(STORAGE_BEST, "1");
      startLevel(1);
    });
    els.btnHowTo.addEventListener("click", () => els.howtoModal.classList.add("active"));
    els.closeHowto.addEventListener("click", () => els.howtoModal.classList.remove("active"));
    els.howtoModal.addEventListener("click", (e) => { if (e.target === els.howtoModal) els.howtoModal.classList.remove("active"); });

    els.btnHint.addEventListener("click", onHint);
    els.btnRetryLevel.addEventListener("click", retryLevel);
    els.btnQuit.addEventListener("click", backToTitle);
    els.muteBtn.addEventListener("click", toggleMute);
  };

  /* ---------- 起動 ---------- */
  cacheEls();
  bindEvents();
  updateMuteBtn();
  refreshTitle();
})();
