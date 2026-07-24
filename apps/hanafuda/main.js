/* =========================================================
 * main.js — 画面制御・描画・入力処理
 * ========================================================= */

/* ---------- グローバル状態 ---------- */
let MATCH = null;
let ROUND = null;
let currentMode = null;      // 'weak' | 'medium' | 'strong' | 'tutorial'
let tutorialGuide = null;
let phase = "idle";          // awaitHandPlay / awaitFieldChoiceHand / awaitFieldChoiceDraw / awaitKoikoiDecision / cpuThinking / busy / roundOver
let pendingHandCard = null;
let pendingDrawCard = null;
let fieldChoiceTargets = [];
let activeHighlight = null;  // { cardId, fieldIds } チュートリアルのおすすめハイライト
let previousScreen = "titleScreen";
let soundOn = localStorage.getItem("hanafuda_sound") !== "off";

function difficultyForCpu() { return currentMode === "tutorial" ? "weak" : currentMode; }

/* ---------- サウンド(簡易ビープ) ---------- */
let audioCtx = null;
function playTone(freq, dur, type = "sine", vol = 0.06) {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  } catch (e) { /* ignore */ }
}
function playSound(kind) {
  if (kind === "capture") { playTone(660, 0.16); playTone(880, 0.18); }
  else if (kind === "place") playTone(320, 0.1);
  else if (kind === "click") playTone(500, 0.05);
  else if (kind === "koikoi") { playTone(440, 0.12); playTone(550, 0.12); playTone(660, 0.18); }
  else if (kind === "win") { playTone(523, 0.15); playTone(659, 0.15); playTone(784, 0.25); }
}

/* ---------- 画面切り替え ---------- */
const screens = { title: document.getElementById("titleScreen"), rules: document.getElementById("rulesScreen"), game: document.getElementById("gameScreen") };
function showScreen(name) {
  Object.values(screens).forEach(el => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");
  document.getElementById("restartBtn").classList.toggle("hidden", name !== "game");
}

/* ---------- マスコット(花子先生)SVG ---------- */
function mascotSVG(mood = "explain") {
  const mouth = {
    explain: `<path d="M40 62 Q50 68 60 62" stroke="#5a3a2a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M38 58 Q50 74 62 58" stroke="#5a3a2a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    yaku: `<circle cx="50" cy="64" r="6" fill="#5a3a2a"/>`,
  }[mood] || "";
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#ffe3c2"/>
    <circle cx="50" cy="56" r="40" fill="#fff2df"/>
    <circle cx="32" cy="48" r="4.2" fill="#3a2a1a"/><circle cx="68" cy="48" r="4.2" fill="#3a2a1a"/>
    <circle cx="26" cy="60" r="7" fill="#ffb6a0" opacity=".6"/><circle cx="74" cy="60" r="7" fill="#ffb6a0" opacity=".6"/>
    ${mouth}
    <path d="M20 30 Q50 4 80 30 Q66 20 50 22 Q34 20 20 30 Z" fill="#c9403f"/>
  </svg>`;
}

/* ================================================================
 * タイトル画面
 * ================================================================ */
function renderHeroCards() {
  const ids = [1, 9, 29, 41, 45];
  document.getElementById("heroCards").innerHTML = ids.map(id => `<div class="mini-card">${cardFaceSVG(id)}</div>`).join("");
}

document.querySelectorAll(".mode-card").forEach(btn => {
  btn.addEventListener("click", () => startGame(btn.dataset.mode));
});
document.getElementById("openRulesBtn").addEventListener("click", () => { previousScreen = "title"; showScreen("rules"); });
document.getElementById("backFromRulesBtn").addEventListener("click", () => showScreen(previousScreen));
document.getElementById("helpBtn").addEventListener("click", () => {
  previousScreen = screens.game.classList.contains("hidden") ? "title" : "game";
  showScreen("rules");
});
document.getElementById("restartBtn").addEventListener("click", () => {
  if (confirm("タイトルへ戻りますか？(今の対局は終了します)")) { showScreen("title"); hideOverlay(); }
});
document.getElementById("soundBtn").addEventListener("click", () => {
  soundOn = !soundOn;
  localStorage.setItem("hanafuda_sound", soundOn ? "on" : "off");
  document.getElementById("soundBtn").classList.toggle("off", !soundOn);
  if (soundOn) playTone(660, 0.1);
});
document.getElementById("soundBtn").classList.toggle("off", !soundOn);

/* ================================================================
 * ルール説明画面の静的コンテンツ生成
 * ================================================================ */
(function buildRulesContent() {
  document.getElementById("rulesStripMonths").innerHTML = MONTHS.slice(1).map(m => {
    const rep = CARDS.find(c => c.month === m.no && (c.type === "hikari" || c.type === "tane")) || CARDS.find(c => c.month === m.no);
    return `<div class="mini-card2">${cardFaceSVG(rep.id)}</div>`;
  }).join("");

  const types = [
    { label: "光(ひかり)", num: "5枚", desc: "いちばん豪華な絵柄。役の得点も高い特別な札。" },
    { label: "タネ", num: "9枚", desc: "動物や生き物、道具が描かれた札。" },
    { label: "タンザク", num: "10枚", desc: "細長い短冊(リボン)が描かれた札。赤・青・無地がある。" },
    { label: "カス", num: "24枚", desc: "上記以外の、植物だけのシンプルな札。いちばん多い。" },
  ];
  document.getElementById("typeGrid").innerHTML = types.map(t => `
    <div class="type-chip"><div class="tc-badge">${t.label}</div><div class="tc-num">${t.num}</div><div class="tc-desc">${t.desc}</div></div>
  `).join("");

  const yakuRef = [
    ["五光(ごこう)", "光札5枚すべて", "10点"],
    ["四光(しこう)", "雨(柳)を除く光4枚", "8点"],
    ["雨四光(あめしこう)", "雨(柳)をふくむ光4枚", "7点"],
    ["三光(さんこう)", "雨(柳)を除く光3枚", "5点"],
    ["花見で一杯", "桜に幕 + 菊に盃", "5点"],
    ["月見で一杯", "芒に月 + 菊に盃", "5点"],
    ["猪鹿蝶(いのしかちょう)", "萩に猪 + 紅葉に鹿 + 牡丹に蝶", "5点"],
    ["赤短(あかたん)", "赤い短冊3枚(松・梅・桜)", "5点"],
    ["青短(あおたん)", "青い短冊3枚(牡丹・菊・紅葉)", "5点"],
    ["赤短+青短ボーナス", "赤短と青短の両方がそろう", "+10点"],
    ["タネ", "タネ札5枚以上(1枚増えるごとに+1点)", "1点〜"],
    ["タン(短冊)", "短冊札5枚以上(1枚増えるごとに+1点)", "1点〜"],
    ["カス", "カス札10枚以上(1枚増えるごとに+1点)", "1点〜"],
  ];
  document.getElementById("yakuTableBody").innerHTML = yakuRef.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="pts">${r[2]}</td></tr>`).join("");
})();
renderHeroCards();

/* ================================================================
 * 対局開始
 * ================================================================ */
function startGame(mode) {
  currentMode = mode;
  MATCH = createMatch(mode, mode === "tutorial" ? 1 : 6);
  // チュートリアルはプレイヤーが必ず先手になるようにする(配札の教材設計に合わせるため)
  if (mode === "tutorial") MATCH.dealer = "cpu";
  document.getElementById("roundTotal").textContent = MATCH.totalRounds;
  showScreen("game");
  hideOverlay();
  document.getElementById("mascotBar").classList.add("hidden");

  if (mode === "tutorial") {
    tutorialGuide = createTutorialGuide();
    showIntroSlides(0);
  } else {
    tutorialGuide = null;
    beginRound();
  }
}

function showIntroSlides(i) {
  const slides = tutorialGuide.introSlides;
  const s = slides[i];
  const dots = slides.map((_, idx) => `<span class="${idx === i ? "active" : ""}"></span>`).join("");
  renderOverlay(`
    <h2>${s.title}</h2>
    <p>${s.text}</p>
    <div class="slide-dots">${dots}</div>
    <div class="modal-btns">
      <button class="btn primary wide" id="introNextBtn">${i === slides.length - 1 ? "はじめる！" : "つぎへ"}</button>
    </div>
  `);
  document.getElementById("introNextBtn").addEventListener("click", () => {
    playSound("click");
    if (i === slides.length - 1) { hideOverlay(); beginRound(); }
    else showIntroSlides(i + 1);
  });
}

function beginRound() {
  const curated = currentMode === "tutorial" ? TUTORIAL_DEAL : null;
  ROUND = startNextRound(MATCH, curated);
  activeHighlight = null;
  pendingHandCard = null; pendingDrawCard = null; fieldChoiceTargets = [];
  logMsg(`第${MATCH.round}局スタート！ ${ROUND.turn === "player" ? "きみ" : "CPU"}の先手です。`);
  renderAll();
  if (ROUND.turn === "cpu") { phase = "cpuThinking"; setTimeout(cpuTurn, 700); }
  else { phase = "awaitHandPlay"; onPlayerTurnBegins(); }
}

function onPlayerTurnBegins() {
  if (currentMode === "tutorial") {
    const msg = tutorialGuide.onFirstPlayerTurn();
    if (msg) showMascot(msg);
    activeHighlight = tutorialGuide.suggestHint(ROUND);
  }
  renderAll();
}

/* ================================================================
 * 手番の進行
 * ================================================================ */
function onPlayerHandCardClick(cardId) {
  if (!(ROUND.turn === "player" && phase === "awaitHandPlay")) return;
  playSound("click");
  const matches = fieldMatches(ROUND, cardId);
  if (matches.length === 2) {
    phase = "awaitFieldChoiceHand";
    pendingHandCard = cardId;
    fieldChoiceTargets = matches;
    activeHighlight = null;
    renderAll();
    return;
  }
  phase = "busy";
  activeHighlight = null;
  doHandPlay("player", cardId, undefined);
}

function onFieldCardClick(fieldId) {
  if (phase === "awaitFieldChoiceHand" && fieldChoiceTargets.includes(fieldId)) {
    playSound("click");
    const cid = pendingHandCard; pendingHandCard = null; fieldChoiceTargets = [];
    phase = "busy";
    doHandPlay("player", cid, fieldId);
  } else if (phase === "awaitFieldChoiceDraw" && fieldChoiceTargets.includes(fieldId)) {
    playSound("click");
    const cid = pendingDrawCard; pendingDrawCard = null; fieldChoiceTargets = [];
    phase = "busy";
    doDrawPlay("player", cid, fieldId);
  }
}

function doHandPlay(who, cardId, chosenFieldId) {
  removeFrom(ROUND.hands[who], cardId);
  const result = resolvePlay(ROUND, cardId, chosenFieldId);
  if (result.captured) { ROUND.captured[who].push(...result.capturedIds); playSound("capture"); }
  else playSound("place");
  renderAll();
  logHandResult(who, cardId, result);
  if (currentMode === "tutorial") tutorialReactToPlay(who, result);
  setTimeout(() => doDrawStep(who), 800);
}

function doDrawStep(who) {
  if (currentMode === "tutorial" && who === "player") {
    const msg = tutorialGuide.onFirstDraw();
    if (msg) showMascot(msg);
  }
  const drawnId = ROUND.deck.shift();
  renderAll();
  if (drawnId == null) { afterDrawResolved(who); return; }
  const matches = fieldMatches(ROUND, drawnId);
  if (who === "player" && matches.length === 2) {
    phase = "awaitFieldChoiceDraw";
    pendingDrawCard = drawnId;
    fieldChoiceTargets = matches;
    renderAll();
    return;
  }
  let chosenFieldId;
  if (who === "cpu" && matches.length === 2) chosenFieldId = aiChooseDrawTarget(ROUND, matches, difficultyForCpu());
  doDrawPlay(who, drawnId, chosenFieldId);
}

function doDrawPlay(who, cardId, chosenFieldId) {
  const result = resolvePlay(ROUND, cardId, chosenFieldId);
  if (result.captured) { ROUND.captured[who].push(...result.capturedIds); playSound("capture"); }
  else playSound("place");
  renderAll();
  logHandResult(who, cardId, result, true);
  if (currentMode === "tutorial") tutorialReactToPlay(who, result);
  setTimeout(() => afterDrawResolved(who), 650);
}

function afterDrawResolved(who) {
  const progress = checkYakuProgress(ROUND, who);
  if (currentMode === "tutorial" && who === "player") {
    const tally = capturedTally(ROUND.captured.player);
    const msg = tutorialGuide.onTaneBuilding(tally.tane);
    if (msg && !progress.improved) showMascot(msg);
  }
  if (progress.improved) {
    playSound("koikoi");
    if (who === "player") {
      phase = "awaitKoikoiDecision";
      renderAll();
      showKoikoiModal(progress.yaku);
    } else {
      const decision = aiDecideKoikoi(ROUND, difficultyForCpu(), progress.yaku);
      if (decision) {
        declareKoikoi(ROUND, "cpu");
        logMsg(`CPUが役(${progress.yaku.list.map(y => y.name).join("・")})をこいこいした！`);
        setTimeout(proceedNextTurnOrEnd, 700);
      } else {
        settleWin(ROUND, "cpu");
        renderAll();
        setTimeout(showRoundEndModal, 500);
      }
    }
    return;
  }
  proceedNextTurnOrEnd();
}

function proceedNextTurnOrEnd() {
  if (isHandsEmpty(ROUND) && !ROUND.finished) {
    settleAtHandExhaustion(ROUND);
    renderAll();
    showRoundEndModal();
    return;
  }
  if (ROUND.finished) return;
  ROUND.turn = ROUND.turn === "player" ? "cpu" : "player";
  renderAll();
  if (ROUND.turn === "cpu") {
    phase = "cpuThinking";
    if (currentMode === "tutorial") {
      const msg = tutorialGuide.onFirstCpuTurn();
      if (msg) showMascot(msg);
    }
    setTimeout(cpuTurn, 750);
  } else {
    phase = "awaitHandPlay";
    onPlayerTurnBegins();
  }
}

function cpuTurn() {
  const plan = aiPlanHandPlay(ROUND, difficultyForCpu());
  doHandPlay("cpu", plan.cardId, plan.fieldChoice);
}

/* ---------- こいこい判断 ---------- */
function showKoikoiModal(yakuInfo) {
  const tutorialMsg = currentMode === "tutorial" ? tutorialGuide.onYakuReached(yakuInfo) : null;
  const list = yakuInfo.list.map(y => `<li><span>${y.name}</span><b>+${y.pts}点</b></li>`).join("");
  renderOverlay(`
    <h2>役が完成！</h2>
    <ul class="yaku-list">${list}</ul>
    <div class="total-line"><span>合計</span><span>${yakuInfo.total}点</span></div>
    ${tutorialMsg ? `<p style="margin-top:12px;">${tutorialMsg.text2 || ""}</p>` : `<p style="margin-top:12px;">このまま「勝負」で得点を確定するか、「こいこい」でもっと役を狙うか選べます。こいこい後に相手が先に役を作ると、点数は相手のものになります。</p>`}
    <div class="modal-btns">
      <button class="btn ghost" id="koikoiStopBtn">勝負する(得点確定)</button>
      <button class="btn primary" id="koikoiGoBtn">こいこい！</button>
    </div>
  `);
  document.getElementById("koikoiStopBtn").addEventListener("click", () => {
    playSound("win");
    hideOverlay();
    settleWin(ROUND, "player");
    renderAll();
    setTimeout(showRoundEndModal, 200);
  });
  document.getElementById("koikoiGoBtn").addEventListener("click", () => {
    playSound("koikoi");
    hideOverlay();
    declareKoikoi(ROUND, "player");
    logMsg(`「こいこい！」と宣言した(${yakuInfo.list.map(y => y.name).join("・")})`);
    setTimeout(proceedNextTurnOrEnd, 200);
  });
}

/* ---------- 局の終了 ---------- */
function showRoundEndModal() {
  finishRoundAndAdvance(MATCH, ROUND);
  phase = "roundOver";
  renderAll();

  let title, body;
  if (ROUND.winner === "draw") {
    title = "この局は引き分け";
    body = `<p>役が完成しないまま、手札と山札を使い切りました。得点は入りません。</p>`;
  } else {
    const who = ROUND.winner === "player" ? "きみ" : "CPU";
    const yakuList = ROUND.finalYaku.list.map(y => `<li><span>${y.name}</span><b>+${y.pts}点</b></li>`).join("");
    title = `この局は ${who} の勝ち！`;
    body = `<ul class="yaku-list">${yakuList}</ul><div class="total-line"><span>獲得点</span><span>${ROUND.finalScore}点</span></div>`;
  }

  const isFinalRound = MATCH.over;
  renderOverlay(`
    <h2>${title}</h2>
    ${body}
    <p class="small-note" style="margin-top:10px;">通算スコア　きみ: ${MATCH.scores.player}点 / CPU: ${MATCH.scores.cpu}点</p>
    <div class="modal-btns">
      <button class="btn primary wide" id="roundContinueBtn">${currentMode === "tutorial" ? "つづける" : (isFinalRound ? "結果を見る" : "次の局へ")}</button>
    </div>
  `);
  document.getElementById("roundContinueBtn").addEventListener("click", () => {
    playSound("click");
    if (currentMode === "tutorial") { hideOverlay(); showTutorialCompleteModal(); return; }
    if (isFinalRound) { hideOverlay(); showMatchEndModal(); return; }
    hideOverlay();
    beginRound();
  });
}

function showTutorialCompleteModal() {
  const msg = tutorialGuide.onTutorialComplete();
  renderOverlay(`
    <h2>${msg.title}</h2>
    <p>${msg.text}</p>
    <div class="modal-btns">
      <button class="btn ghost" id="tutBackTitleBtn">タイトルへ戻る</button>
      <button class="btn primary" id="tutPlayWeakBtn">「弱」で対戦する</button>
    </div>
  `);
  document.getElementById("tutBackTitleBtn").addEventListener("click", () => { hideOverlay(); showScreen("title"); });
  document.getElementById("tutPlayWeakBtn").addEventListener("click", () => { hideOverlay(); startGame("weak"); });
}

function showMatchEndModal() {
  const p = MATCH.scores.player, c = MATCH.scores.cpu;
  const result = p === c ? "引き分け！" : (p > c ? "あなたの勝ち！🎉" : "CPUの勝ち…");
  renderOverlay(`
    <h2>対局終了 — ${result}</h2>
    <div class="total-line"><span>きみ</span><span>${p}点</span></div>
    <div class="total-line"><span>CPU</span><span>${c}点</span></div>
    <div class="modal-btns">
      <button class="btn ghost" id="matchBackTitleBtn">タイトルへ戻る</button>
      <button class="btn primary" id="matchReplayBtn">もう一度(同じ強さ)</button>
    </div>
  `);
  document.getElementById("matchBackTitleBtn").addEventListener("click", () => { hideOverlay(); showScreen("title"); });
  document.getElementById("matchReplayBtn").addEventListener("click", () => { hideOverlay(); startGame(currentMode); });
}

/* ================================================================
 * チュートリアルのアドバイス連携
 * ================================================================ */
function tutorialReactToPlay(who, result) {
  let msg = null;
  if (result.captured) msg = tutorialGuide.onFirstCapture(who);
  else msg = tutorialGuide.onFirstPlace();
  if (msg) showMascot(msg);
}

function showMascot(msg) {
  const bar = document.getElementById("mascotBar");
  bar.classList.remove("hidden");
  document.getElementById("mascotAvatar").innerHTML = mascotSVG(msg.mood);
  document.getElementById("mascotText").innerHTML = (msg.title ? `<span class="mt-title">${msg.title}</span>` : "") + msg.text;
}
document.getElementById("mascotClose").addEventListener("click", () => document.getElementById("mascotBar").classList.add("hidden"));

/* ---------- ログ ---------- */
function logMsg(text) { document.getElementById("logStrip").textContent = text; }
function logHandResult(who, cardId, result, isDraw) {
  const whoLabel = who === "player" ? "きみ" : "CPU";
  const src = isDraw ? "山札のめくり札" : "手札";
  if (result.captured) {
    const names = result.capturedIds.map(id => cardOf(id).name);
    logMsg(`${whoLabel}が${src}「${cardOf(cardId).name}」で「${names.filter(n => n !== cardOf(cardId).name)[0] || names[1]}」をそろえて獲得！`);
  } else {
    logMsg(`${whoLabel}が${src}「${cardOf(cardId).name}」を場に置いた。`);
  }
}

/* ================================================================
 * 描画
 * ================================================================ */
function renderAll() {
  renderStatusBar();
  renderHands();
  renderField();
  renderDeck();
  renderCapturedMini("player");
  renderCapturedMini("cpu");
}

function renderStatusBar() {
  document.getElementById("roundNo").textContent = MATCH.round;
  document.getElementById("scorePlayer").textContent = MATCH.scores.player;
  document.getElementById("scoreCpu").textContent = MATCH.scores.cpu;
  const flag = document.getElementById("turnFlag");
  if (phase === "awaitKoikoiDecision") { flag.textContent = "こいこい判断中…"; flag.className = "turn-flag"; }
  else if (ROUND.turn === "player") { flag.textContent = "きみの番"; flag.className = "turn-flag"; }
  else { flag.textContent = "CPUの番"; flag.className = "turn-flag cpu"; }
}

function renderHands() {
  const canPlay = ROUND.turn === "player" && phase === "awaitHandPlay";
  const playerStrip = document.getElementById("playerHandStrip");
  playerStrip.innerHTML = ROUND.hands.player.map(id => {
    const glow = canPlay && activeHighlight && activeHighlight.cardId === id;
    return `<div class="card ${canPlay ? "selectable" : ""} ${glow ? "glow" : ""}" data-id="${id}">${cardFaceSVG(id)}</div>`;
  }).join("");
  if (canPlay) playerStrip.querySelectorAll(".card").forEach(el => el.addEventListener("click", () => onPlayerHandCardClick(Number(el.dataset.id))));

  document.getElementById("cpuHandStrip").innerHTML = ROUND.hands.cpu.map(() => `<div class="card">${cardBackSVG()}</div>`).join("");
}

function renderField() {
  const grid = document.getElementById("fieldGrid");
  const choosable = (phase === "awaitFieldChoiceHand" || phase === "awaitFieldChoiceDraw");
  grid.innerHTML = ROUND.field.map(id => {
    const isTarget = choosable && fieldChoiceTargets.includes(id);
    const isHintTarget = !choosable && activeHighlight && activeHighlight.fieldIds && activeHighlight.fieldIds.includes(id);
    return `<div class="card ${choosable ? "selectable" : ""} ${(isTarget || isHintTarget) ? "glow" : ""}" data-id="${id}">${cardFaceSVG(id)}</div>`;
  }).join("");
  grid.querySelectorAll(".card").forEach(el => el.addEventListener("click", () => onFieldCardClick(Number(el.dataset.id))));
}

function renderDeck() {
  document.getElementById("deckPile").innerHTML = `<div class="card">${cardBackSVG()}</div><div class="deck-count">${ROUND.deck.length}</div>`;
}

function renderCapturedMini(who) {
  const tally = capturedTally(ROUND.captured[who]);
  const el = document.getElementById(who === "player" ? "playerCapturedMini" : "cpuCapturedMini");
  el.innerHTML = `
    <div class="cm-badge">光<b>${tally.hikari}</b></div>
    <div class="cm-badge">タネ<b>${tally.tane}</b></div>
    <div class="cm-badge">タン<b>${tally.tanzaku}</b></div>
    <div class="cm-badge">カス<b>${tally.kasu}</b></div>
  `;
  el.onclick = () => openCapturedModal(who);
}

function openCapturedModal(who) {
  const ids = ROUND.captured[who];
  const label = who === "player" ? "きみの取り札" : "CPUの取り札";
  if (ids.length === 0) {
    renderOverlay(`<h2>${label}</h2><p class="center-text small-note">まだ何も取っていません。</p><div class="modal-btns"><button class="btn primary wide" id="closeCapBtn">とじる</button></div>`);
  } else {
    const grid = ids.map(id => `<div class="card">${cardFaceSVG(id)}</div>`).join("");
    renderOverlay(`<h2>${label}(${ids.length}枚)</h2><div class="captured-grid">${grid}</div><div class="modal-btns"><button class="btn primary wide" id="closeCapBtn">とじる</button></div>`);
  }
  document.getElementById("closeCapBtn").addEventListener("click", hideOverlay);
}

/* ---------- オーバーレイ共通 ---------- */
function renderOverlay(innerHTML) {
  document.getElementById("overlayRoot").innerHTML = `<div class="overlay-root">${`<div class="modal">${innerHTML}</div>`}</div>`;
}
function hideOverlay() { document.getElementById("overlayRoot").innerHTML = ""; }

/* ---------- 初期表示 ---------- */
showScreen("title");
