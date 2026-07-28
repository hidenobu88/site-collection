/* =========================================================
 * 一筆書きコインズ — ゲームロジック
 * ========================================================= */
(() => {
  "use strict";

  const TOTAL_STAGES = 40;
  const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const LS_PROGRESS = "hitofude_progress_v1";
  const LS_RANKING = "hitofude_ranking_v1";
  const LS_INITIALS = "hitofude_initials_v1";
  const LS_MUTE = "hitofude_mute_v1";

  const $ = (id) => document.getElementById(id);

  /* ---------- 汎用ユーティリティ ---------- */
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const randInt = (n) => Math.floor(Math.random() * n);
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  function fmtTime(ms) {
    ms = Math.max(0, Math.round(ms));
    const cs = Math.floor(ms / 10) % 100;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  }
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  /* ---------- ステージ難易度パラメータ ---------- */
  const CHAPTER_NAMES = ["初級コース", "中級コース", "上級コース", "超級コース", "伝説コース"];

  function stageParams(n) {
    const t = (n - 1) / (TOTAL_STAGES - 1);
    const cols = clamp(Math.round(lerp(3, 8, t)), 3, 8);
    const rows = clamp(Math.round(lerp(3, 7, t)), 3, 7);
    const cells = cols * rows;
    const covT = clamp((t - 0.25) / 0.75, 0, 1);
    const coverage = lerp(1.0, 0.5, covT);
    let pathLen = Math.max(4, Math.round(cells * coverage));
    if (pathLen > cells) pathLen = cells;
    const stepMs = Math.round(lerp(680, 170, t));
    const leadMs = Math.round(lerp(500, 150, t));
    const showNumbers = n <= 8;
    const chapter = clamp(Math.floor((n - 1) / 8), 0, 4);
    return { n, cols, rows, cells, pathLen, stepMs, leadMs, showNumbers, chapter, chapterName: CHAPTER_NAMES[chapter] };
  }

  /* ---------- 一筆書きパス生成(ランダムバックトラッキング) ---------- */
  function generatePath(cols, rows, length) {
    const total = cols * rows;
    const idx = (r, c) => r * cols + c;
    function neighborsOf(r, c) {
      const list = [];
      if (r > 0) list.push([r - 1, c]);
      if (r < rows - 1) list.push([r + 1, c]);
      if (c > 0) list.push([r, c - 1]);
      if (c < cols - 1) list.push([r, c + 1]);
      return list;
    }
    const maxAttempts = 40;
    const maxSteps = 30000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const visited = new Uint8Array(total);
      const path = [];
      let steps = 0;

      function degreeOf(r, c) {
        let d = 0;
        for (const [nr, nc] of neighborsOf(r, c)) if (!visited[idx(nr, nc)]) d++;
        return d;
      }
      function dfs(r, c) {
        steps++;
        if (steps > maxSteps) return false;
        visited[idx(r, c)] = 1;
        path.push([r, c]);
        if (path.length === length) return true;
        let nbrs = neighborsOf(r, c).filter(([nr, nc]) => !visited[idx(nr, nc)]);
        shuffle(nbrs);
        nbrs.sort((a, b) => degreeOf(a[0], a[1]) - degreeOf(b[0], b[1]));
        for (const [nr, nc] of nbrs) {
          if (dfs(nr, nc)) return true;
        }
        visited[idx(r, c)] = 0;
        path.pop();
        return false;
      }

      const startR = randInt(rows), startC = randInt(cols);
      if (dfs(startR, startC)) return path;
    }

    // フォールバック: 決定的なスネークパス(必ず成功する)
    const snake = [];
    for (let r = 0; r < rows; r++) {
      if (r % 2 === 0) for (let c = 0; c < cols; c++) snake.push([r, c]);
      else for (let c = cols - 1; c >= 0; c--) snake.push([r, c]);
    }
    return snake.slice(0, length);
  }

  function buildStage(n) {
    const p = stageParams(n);
    const path = generatePath(p.cols, p.rows, p.pathLen);
    const cellMap = new Map();
    path.forEach(([r, c], i) => cellMap.set(r + "," + c, i));
    return { ...p, path, cellMap };
  }

  /* ---------- localStorage: 進行状況・ランキング ---------- */
  function loadProgress() {
    try {
      const raw = localStorage.getItem(LS_PROGRESS);
      if (!raw) return { cleared: [], times: {} };
      const obj = JSON.parse(raw);
      if (!Array.isArray(obj.cleared)) obj.cleared = [];
      if (!obj.times) obj.times = {};
      return obj;
    } catch (e) { return { cleared: [], times: {} }; }
  }
  function saveProgress(p) { localStorage.setItem(LS_PROGRESS, JSON.stringify(p)); }
  function markStageCleared(n, elapsed) {
    const p = loadProgress();
    if (!p.cleared.includes(n)) p.cleared.push(n);
    if (!p.times[n] || elapsed < p.times[n]) p.times[n] = elapsed;
    saveProgress(p);
  }
  function resetProgress() { localStorage.removeItem(LS_PROGRESS); }

  function loadRanking() {
    try {
      const raw = localStorage.getItem(LS_RANKING);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveRanking(all) { localStorage.setItem(LS_RANKING, JSON.stringify(all)); }
  function getRanking(stageNum) {
    const all = loadRanking();
    return all[stageNum] || [];
  }
  function qualifiesRanking(stageNum, ms) {
    const list = getRanking(stageNum);
    return list.length < 5 || ms < list[list.length - 1].ms;
  }
  function addRanking(stageNum, name, ms) {
    const all = loadRanking();
    const list = all[stageNum] || [];
    list.push({ name, ms, date: todayStr() });
    list.sort((a, b) => a.ms - b.ms);
    all[stageNum] = list.slice(0, 5);
    saveRanking(all);
  }
  function loadLastInitials() { return localStorage.getItem(LS_INITIALS) || "AAA"; }
  function saveLastInitials(name) { localStorage.setItem(LS_INITIALS, name); }

  /* ---------- サウンド(WebAudio合成) ---------- */
  let muted = localStorage.getItem(LS_MUTE) === "1";
  let audioCtx = null;
  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }
  function beep(freq, dur, type, vol) {
    if (muted) return;
    ensureAudio();
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || "square";
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol || 0.15, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }
  function sfx(name) {
    switch (name) {
      case "tick": beep(880, 0.05, "square", 0.07); break;
      case "ok": beep(1046, 0.08, "square", 0.12); break;
      case "bad": beep(140, 0.35, "sawtooth", 0.18); break;
      case "clear": [880, 1046, 1318].forEach((f, i) => setTimeout(() => beep(f, 0.15, "square", 0.14), i * 120)); break;
      case "start": beep(660, 0.12, "square", 0.13); break;
      default: break;
    }
  }
  function updateMuteBtn() { $("muteBtn").textContent = muted ? "🔇" : "🔊"; }

  /* ---------- 画面遷移 ---------- */
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
  }

  /* ---------- ゲーム状態 ---------- */
  let currentMode = "normal"; // 'normal' | 'timeattack'
  let currentStage = null;
  let stageNum = 1;
  let state = "idle"; // idle | preview | countdown | playing | cleared | gameover
  let expectedIndex = 0;
  let startTime = 0;
  let rafId = null;
  let pending = [];
  let boardEls = new Map();
  let selectedRankStage = 1;

  function clearPending() {
    pending.forEach((id) => clearTimeout(id));
    pending = [];
  }
  function abortRound() {
    clearPending();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    state = "idle";
  }

  /* ---------- ステージ選択画面 ---------- */
  function renderStageSelect() {
    $("stageSelectTitle").textContent = currentMode === "normal"
      ? "通常モード - ステージをえらぶ"
      : "タイムアタック - ステージをえらぶ";
    const progress = loadProgress();
    const ranking = currentMode === "timeattack" ? loadRanking() : null;
    const grid = $("stageGrid");
    grid.innerHTML = "";
    for (let n = 1; n <= TOTAL_STAGES; n++) {
      const unlocked = n === 1 || progress.cleared.includes(n - 1);
      const cleared = progress.cleared.includes(n);
      const chapter = stageParams(n).chapter;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "stage-btn chapter-" + chapter + (unlocked ? "" : " locked") + (cleared ? " cleared" : "");
      if (unlocked) {
        let html = `<span class="stage-num">${n}</span>`;
        if (cleared) html += `<span class="stage-check">✓</span>`;
        if (ranking && ranking[n] && ranking[n][0]) {
          html += `<span class="stage-best">${fmtTime(ranking[n][0].ms)}</span>`;
        }
        btn.innerHTML = html;
        btn.addEventListener("click", () => startStage(n));
      } else {
        btn.innerHTML = "🔒";
        btn.disabled = true;
      }
      grid.appendChild(btn);
    }
  }

  /* ---------- 盤面構築 ---------- */
  function buildBoardDom(stage) {
    const board = $("board");
    board.style.aspectRatio = `${stage.cols} / ${stage.rows}`;
    const coinGrid = $("coinGrid");
    coinGrid.innerHTML = "";
    coinGrid.style.gridTemplateColumns = `repeat(${stage.cols}, 1fr)`;
    coinGrid.style.gridTemplateRows = `repeat(${stage.rows}, 1fr)`;
    boardEls = new Map();
    for (let r = 0; r < stage.rows; r++) {
      for (let c = 0; c < stage.cols; c++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "coin";
        btn.dataset.r = r;
        btn.dataset.c = c;
        btn.setAttribute("aria-label", "コイン");
        const face = document.createElement("span");
        face.className = "coin-face";
        face.textContent = "🪙";
        btn.appendChild(face);
        coinGrid.appendChild(btn);
        boardEls.set(r + "," + c, btn);
      }
    }
  }

  /* ---------- プレビュー(記憶フェーズ) ---------- */
  function runPreview(stage, onDone) {
    const banner = $("previewBanner");
    banner.textContent = "おぼえて!";
    banner.classList.add("show");

    const svg = $("pathSvg");
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${stage.cols} ${stage.rows}`);
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    poly.setAttribute("points", stage.path.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(" "));
    poly.setAttribute("class", "path-line");
    svg.appendChild(poly);

    const revealMs = stage.leadMs + stage.stepMs * (stage.path.length - 1);
    try {
      const totalLen = poly.getTotalLength();
      poly.style.strokeDasharray = String(totalLen);
      poly.style.strokeDashoffset = String(totalLen);
      // 強制リフローしてからアニメーション開始
      void poly.getBoundingClientRect();
      poly.style.transition = `stroke-dashoffset ${revealMs}ms linear`;
      requestAnimationFrame(() => { poly.style.strokeDashoffset = "0"; });
    } catch (e) { /* getTotalLength未対応環境は静的表示のみ */ }

    stage.path.forEach(([r, c], i) => {
      const el = boardEls.get(r + "," + c);
      const t = setTimeout(() => {
        if (!el) return;
        el.classList.add("lit");
        if (stage.showNumbers) {
          const num = document.createElement("span");
          num.className = "num";
          num.textContent = String(i + 1);
          el.appendChild(num);
        }
        sfx("tick");
      }, i * stage.stepMs);
      pending.push(t);
    });

    const endT = setTimeout(() => {
      banner.classList.remove("show");
      boardEls.forEach((el) => {
        el.classList.remove("lit");
        const num = el.querySelector(".num");
        if (num) num.remove();
      });
      svg.innerHTML = "";
      runCountdown(onDone);
    }, revealMs + 500);
    pending.push(endT);
  }

  function runCountdown(onDone) {
    const cd = $("countdown");
    const seq = ["3", "2", "1", "START!"];
    seq.forEach((label, i) => {
      const t = setTimeout(() => {
        cd.textContent = label;
        sfx(label === "START!" ? "start" : "tick");
      }, i * 550);
      pending.push(t);
    });
    const t2 = setTimeout(() => {
      cd.textContent = "";
      onDone();
    }, seq.length * 550);
    pending.push(t2);
  }

  /* ---------- プレイフェーズ ---------- */
  function beginPlaying() {
    state = "playing";
    expectedIndex = 0;
    $("hudProgress").textContent = `0/${currentStage.path.length}`;
    startTime = performance.now();
    const tick = () => {
      if (state !== "playing") return;
      $("hudTimer").textContent = fmtTime(performance.now() - startTime);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function handleTap(btn) {
    if (state !== "playing") return;
    if (btn.classList.contains("collected") || btn.classList.contains("wrong")) return;
    const r = +btn.dataset.r, c = +btn.dataset.c;
    const key = r + "," + c;
    const idx = currentStage.cellMap.has(key) ? currentStage.cellMap.get(key) : -1;
    if (idx === expectedIndex) {
      btn.classList.add("collected");
      sfx("ok");
      expectedIndex++;
      $("hudProgress").textContent = `${expectedIndex}/${currentStage.path.length}`;
      if (expectedIndex === currentStage.path.length) finishRound(true, null);
    } else {
      btn.classList.add("wrong");
      sfx("bad");
      finishRound(false, { r, c });
    }
  }

  function revealSolution(wrongCell) {
    // 正解ルート全体を表示して復習できるようにする
    const svg = $("pathSvg");
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${currentStage.cols} ${currentStage.rows}`);
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    poly.setAttribute("points", currentStage.path.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(" "));
    poly.setAttribute("class", "path-line");
    svg.appendChild(poly);
    currentStage.path.forEach(([r, c], i) => {
      const el = boardEls.get(r + "," + c);
      if (!el) return;
      if (i === expectedIndex) el.classList.add("shouldve");
      if (currentStage.showNumbers || true) {
        const num = document.createElement("span");
        num.className = "num";
        num.textContent = String(i + 1);
        el.appendChild(num);
      }
    });
  }

  function finishRound(success, wrongCell) {
    state = success ? "cleared" : "gameover";
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    const elapsed = performance.now() - startTime;
    if (success) {
      markStageCleared(stageNum, elapsed);
      sfx("clear");
    } else {
      revealSolution(wrongCell);
    }
    const missedAt = expectedIndex; // ゲームオーバー時に見せる用に確保
    const delay = success ? 500 : 1000;
    const t = setTimeout(() => showResult(success, elapsed, missedAt), delay);
    pending.push(t);
  }

  /* ---------- ステージ開始 ---------- */
  function startStage(n) {
    abortRound();
    stageNum = n;
    currentStage = buildStage(n);
    showScreen("scr-game");
    $("hudStage").textContent = n;
    $("hudMode").textContent = currentMode === "normal" ? "NORMAL" : "TIME ATTACK";
    $("hudTimer").textContent = "00:00.00";
    $("hudProgress").textContent = `0/${currentStage.path.length}`;
    buildBoardDom(currentStage);
    expectedIndex = 0;
    state = "preview";
    runPreview(currentStage, beginPlaying);
  }

  /* ---------- 結果画面 ---------- */
  function medalFor(len, elapsed) {
    const par = len * 550 + 800;
    if (elapsed <= par * 0.65) return "🥇 GOLD MEDAL";
    if (elapsed <= par * 1.0) return "🥈 SILVER MEDAL";
    if (elapsed <= par * 1.6) return "🥉 BRONZE MEDAL";
    return "";
  }

  function buildInitialsWidget(container, initial) {
    container.innerHTML = "";
    const idxs = [0, 1, 2].map((i) => {
      const p = CHARSET.indexOf((initial[i] || "A").toUpperCase());
      return p >= 0 ? p : 0;
    });
    idxs.forEach((_, i) => {
      const col = document.createElement("div");
      col.className = "initial-col";
      const up = document.createElement("button");
      up.type = "button"; up.className = "initial-btn"; up.textContent = "▲";
      const val = document.createElement("span");
      val.className = "initial-val"; val.textContent = CHARSET[idxs[i]];
      const down = document.createElement("button");
      down.type = "button"; down.className = "initial-btn"; down.textContent = "▼";
      up.addEventListener("click", () => { idxs[i] = (idxs[i] + 1) % CHARSET.length; val.textContent = CHARSET[idxs[i]]; sfx("tick"); });
      down.addEventListener("click", () => { idxs[i] = (idxs[i] - 1 + CHARSET.length) % CHARSET.length; val.textContent = CHARSET[idxs[i]]; sfx("tick"); });
      col.append(up, val, down);
      container.appendChild(col);
    });
    return () => idxs.map((i) => CHARSET[i]).join("");
  }

  function renderRankingInline(container, stg, standalone) {
    const list = getRanking(stg);
    const div = document.createElement("div");
    div.className = "rank-table";
    if (standalone) {
      const h = document.createElement("h3");
      h.textContent = `STAGE ${stg} ベスト記録`;
      div.appendChild(h);
    }
    if (list.length === 0) {
      const p = document.createElement("p");
      p.className = "rank-empty";
      p.textContent = "まだ記録がありません。挑戦してみよう!";
      div.appendChild(p);
    } else {
      const table = document.createElement("table");
      table.innerHTML = "<thead><tr><th>順位</th><th>名前</th><th>タイム</th><th>日付</th></tr></thead>";
      const tbody = document.createElement("tbody");
      list.forEach((row, i) => {
        const tr = document.createElement("tr");
        const medal = ["🥇", "🥈", "🥉"][i] || `${i + 1}`;
        tr.innerHTML = `<td>${medal}</td><td>${escapeHtml(row.name)}</td><td>${fmtTime(row.ms)}</td><td>${escapeHtml(row.date)}</td>`;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      div.appendChild(table);
    }
    container.appendChild(div);
  }

  function renderRankingSummary(container) {
    const all = loadRanking();
    let count = 0, total = 0;
    for (let n = 1; n <= TOTAL_STAGES; n++) {
      const list = all[n];
      if (list && list.length) { count++; total += list[0].ms; }
    }
    const div = document.createElement("div");
    div.className = "rank-summary";
    div.innerHTML = `<p>記録のあるステージ: <b>${count}/${TOTAL_STAGES}</b></p><p>ベストタイム合計: <b>${fmtTime(total)}</b></p>`;
    container.appendChild(div);
  }

  function renderRankingScreen() {
    const picker = $("rankingPicker");
    picker.innerHTML = "";
    for (let n = 1; n <= TOTAL_STAGES; n++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rank-pick-btn" + (n === selectedRankStage ? " active" : "");
      b.textContent = String(n);
      b.addEventListener("click", () => { selectedRankStage = n; renderRankingScreen(); });
      picker.appendChild(b);
    }
    const wrap = $("rankingTableWrap");
    wrap.innerHTML = "";
    renderRankingInline(wrap, selectedRankStage, true);
    renderRankingSummary(wrap);
  }

  function showResult(success, elapsed, missedAt) {
    showScreen("scr-result");
    const title = $("resultTitle");
    const body = $("resultBody");
    const actions = $("resultActions");
    body.innerHTML = "";
    actions.innerHTML = "";

    if (success) {
      title.textContent = "STAGE CLEAR!";
      title.className = "result-title win";
      const medal = medalFor(currentStage.path.length, elapsed);
      body.innerHTML = `<p class="result-time">タイム: ${fmtTime(elapsed)}</p>` + (medal ? `<p class="medal">${medal}</p>` : "");

      if (currentMode === "timeattack") {
        if (qualifiesRanking(stageNum, elapsed)) {
          const rankInP = document.createElement("p");
          rankInP.className = "rank-in";
          rankInP.textContent = "🎉 ランキング入り! 名前を登録しよう";
          body.appendChild(rankInP);

          const formWrap = document.createElement("div");
          formWrap.className = "initials-form";
          const widget = document.createElement("div");
          widget.className = "initials-widget";
          formWrap.appendChild(widget);
          const getInitials = buildInitialsWidget(widget, loadLastInitials());
          const submitBtn = document.createElement("button");
          submitBtn.type = "button";
          submitBtn.className = "btn btn-primary";
          submitBtn.textContent = "登録する";
          const rankWrap = document.createElement("div");
          submitBtn.addEventListener("click", () => {
            const name = getInitials();
            addRanking(stageNum, name, elapsed);
            saveLastInitials(name);
            formWrap.remove();
            rankWrap.innerHTML = "";
            renderRankingInline(rankWrap, stageNum, true);
          });
          formWrap.appendChild(submitBtn);
          body.appendChild(formWrap);
          body.appendChild(rankWrap);
        } else {
          renderRankingInline(body, stageNum, true);
        }
      }

      const hasNext = stageNum < TOTAL_STAGES;
      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "btn btn-primary";
      nextBtn.textContent = hasNext ? "次のステージへ →" : "ステージ選択へ";
      nextBtn.addEventListener("click", () => {
        if (hasNext) startStage(stageNum + 1);
        else { showScreen("scr-stageselect"); renderStageSelect(); }
      });
      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "btn btn-sub";
      retryBtn.textContent = "もう一度あそぶ";
      retryBtn.addEventListener("click", () => startStage(stageNum));
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn-back";
      backBtn.textContent = "ステージ選択へ";
      backBtn.addEventListener("click", () => { showScreen("scr-stageselect"); renderStageSelect(); });
      actions.append(nextBtn, retryBtn, backBtn);

      if (currentMode === "timeattack") {
        const rankBtn = document.createElement("button");
        rankBtn.type = "button";
        rankBtn.className = "btn btn-sub";
        rankBtn.textContent = "🏆 ランキングを見る";
        rankBtn.addEventListener("click", () => {
          selectedRankStage = stageNum;
          showScreen("scr-ranking");
          renderRankingScreen();
        });
        actions.appendChild(rankBtn);
      }
    } else {
      title.textContent = "GAME OVER";
      title.className = "result-title lose";
      body.innerHTML = `<p class="result-time">せいぞんタイム: ${fmtTime(elapsed)}</p>` +
        `<p class="miss-info">${missedAt + 1}番目のコインでミス!<br>正しいルートを盤面で確認しよう(青い輪が正解)。</p>`;
      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "btn btn-primary";
      retryBtn.textContent = "もう一度挑戦";
      retryBtn.addEventListener("click", () => startStage(stageNum));
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "btn btn-back";
      backBtn.textContent = "ステージ選択へ";
      backBtn.addEventListener("click", () => { showScreen("scr-stageselect"); renderStageSelect(); });
      actions.append(retryBtn, backBtn);
    }
  }

  /* ---------- イベント配線 ---------- */
  function init() {
    updateMuteBtn();
    $("muteBtn").addEventListener("click", () => {
      muted = !muted;
      localStorage.setItem(LS_MUTE, muted ? "1" : "0");
      updateMuteBtn();
    });

    $("btnStart").addEventListener("click", () => { ensureAudio(); showScreen("scr-modeselect"); });
    $("btnHowTo").addEventListener("click", () => $("howtoModal").classList.add("show"));
    $("closeHowto").addEventListener("click", () => $("howtoModal").classList.remove("show"));
    $("btnRankingTop").addEventListener("click", () => { showScreen("scr-ranking"); renderRankingScreen(); });

    document.querySelectorAll(".mode-card").forEach((card) => {
      card.addEventListener("click", () => {
        currentMode = card.dataset.mode;
        showScreen("scr-stageselect");
        renderStageSelect();
      });
    });
    document.querySelectorAll("[data-back]").forEach((b) => {
      b.addEventListener("click", () => showScreen(b.dataset.back));
    });

    $("btnResetProgress").addEventListener("click", () => {
      if (confirm("進行状況(クリア済みステージ)をリセットしますか？\nランキング記録は消えません。")) {
        resetProgress();
        renderStageSelect();
      }
    });

    $("coinGrid").addEventListener("click", (e) => {
      const btn = e.target.closest(".coin");
      if (btn) handleTap(btn);
    });

    $("btnQuit").addEventListener("click", () => {
      if (state === "playing" || state === "preview" || state === "countdown") {
        if (confirm("このステージをやめて選択画面にもどりますか？")) {
          abortRound();
          showScreen("scr-stageselect");
          renderStageSelect();
        }
      } else {
        showScreen("scr-stageselect");
        renderStageSelect();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $("scr-game").classList.contains("active")) {
        $("btnQuit").click();
      }
    });

    showScreen("scr-title");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
