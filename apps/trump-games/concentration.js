/* =========================================================
 * concentration.js — 神経衰弱(プレイヤー vs CPU・記憶力AI)
 * ========================================================= */
(function (global) {
  "use strict";
  const PC = global.PC;
  const RETENTION = { 1: 0.3, 2: 0.6, 3: 0.95 }; // CPUが見たカードを覚えている確率

  let level = 2, cards = [], playerScore = 0, cpuScore = 0, turn = "player";
  let firstPick = null, busy = false, ended = false;
  let cpuMemory = new Map(); // cardId -> rank

  function el(id) { return document.getElementById(id); }
  function findCard(id) { return cards.find((c) => c.id === id); }

  function buildDeck(lv) {
    let ranks, suits;
    if (lv === 1) { ranks = PC.shuffle(PC.RANKS.slice()).slice(0, 8); suits = ["s", "h"]; }
    else if (lv === 2) { ranks = PC.RANKS.slice(); suits = ["s", "h"]; }
    else { ranks = PC.RANKS.slice(); suits = PC.SUITS.slice(); }
    const out = [];
    let uid = 0;
    ranks.forEach((r) => suits.forEach((s) => out.push({ id: "mc" + uid++, suit: s, rank: r, value: PC.RANK_VALUE[r], state: "hidden" })));
    return PC.shuffle(out);
  }

  function init(lv) {
    level = lv;
    el("mcLvBadge").textContent = ["", "初級", "中級", "上級"][lv];
    cards = buildDeck(lv);
    playerScore = 0; cpuScore = 0; turn = "player";
    firstPick = null; busy = false; ended = false;
    cpuMemory = new Map();
    setStatus("あなたの番です！2枚めくって同じ数字のペアを探そう");
    render();
  }

  function onCellClick(id) {
    if (turn !== "player" || busy || ended) return;
    const card = findCard(id);
    if (!card || card.state !== "hidden") return;
    card.state = "revealed";
    if (!firstPick) { firstPick = card; render(); return; }
    const second = card;
    render();
    busy = true;
    setTimeout(() => resolvePair(firstPick, second, "player"), 600);
  }

  function resolvePair(a, b, who) {
    firstPick = null;
    if (a.rank === b.rank) {
      a.state = "matched-" + who; b.state = "matched-" + who;
      cpuMemory.delete(a.id); cpuMemory.delete(b.id);
      if (who === "player") playerScore++; else cpuScore++;
      render();
      if (checkGameEnd()) return;
      setStatus((who === "player" ? "あなた" : "CPU") + "の正解！ペア成立、もう一度どうぞ🎴");
      busy = false;
      if (who === "player") { turn = "player"; render(); }
      else { turn = "cpu"; render(); setTimeout(cpuTurn, 700); }
    } else {
      registerMemory(a); registerMemory(b);
      a.state = "hidden"; b.state = "hidden";
      turn = who === "player" ? "cpu" : "player";
      busy = false;
      render();
      setStatus(turn === "player" ? "残念、はずれ！あなたの番です" : "残念、はずれ！CPUの番です");
      if (turn === "cpu") setTimeout(cpuTurn, 700);
    }
  }

  function registerMemory(card) {
    if (Math.random() < RETENTION[level]) cpuMemory.set(card.id, card.rank);
  }

  function findMemoryPair() {
    const hiddenIds = new Set(cards.filter((c) => c.state === "hidden").map((c) => c.id));
    const byRank = {};
    for (const [id, rank] of cpuMemory.entries()) {
      if (!hiddenIds.has(id)) continue;
      (byRank[rank] = byRank[rank] || []).push(id);
    }
    for (const rank in byRank) if (byRank[rank].length >= 2) return byRank[rank].slice(0, 2);
    return null;
  }

  function cpuTurn() {
    if (ended) return;
    busy = true;
    const memPair = findMemoryPair();
    if (memPair) {
      const c1 = findCard(memPair[0]);
      c1.state = "revealed"; render();
      setTimeout(() => {
        const c2 = findCard(memPair[1]);
        c2.state = "revealed"; render();
        setTimeout(() => resolvePair(c1, c2, "cpu"), 600);
      }, 600);
      return;
    }
    const hidden = cards.filter((c) => c.state === "hidden");
    const rememberedHidden = hidden.filter((c) => cpuMemory.has(c.id));
    const first = rememberedHidden.length && Math.random() < 0.7
      ? rememberedHidden[Math.floor(Math.random() * rememberedHidden.length)]
      : hidden[Math.floor(Math.random() * hidden.length)];
    first.state = "revealed"; render();
    setTimeout(() => {
      const remaining = cards.filter((c) => c.state === "hidden" && c.id !== first.id);
      const guess = remaining.find((c) => cpuMemory.get(c.id) === first.rank);
      const second = guess || remaining[Math.floor(Math.random() * remaining.length)];
      second.state = "revealed"; render();
      setTimeout(() => resolvePair(first, second, "cpu"), 600);
    }, 600);
  }

  function checkGameEnd() {
    const remaining = cards.some((c) => c.state === "hidden" || c.state === "revealed");
    if (remaining) return false;
    ended = true;
    let title, emoji;
    if (playerScore > cpuScore) { title = "あなたの勝ち！"; emoji = "🎉"; }
    else if (playerScore < cpuScore) { title = "CPUの勝ち…"; emoji = "😢"; }
    else { title = "引き分け！"; emoji = "🤝"; }
    setStatus("ゲーム終了！ あなた " + playerScore + " - " + cpuScore + " CPU");
    setTimeout(() => {
      global.AppModal.show(emoji, title, "あなた " + playerScore + "ペア - " + cpuScore + "ペア CPU", "もう一度", () => { global.AppModal.hide(); init(level); });
    }, 500);
    return true;
  }

  function setStatus(txt) { el("mcStatus").textContent = txt; }

  function render() {
    el("mcPlayerScore").textContent = playerScore;
    el("mcCpuScore").textContent = cpuScore;
    el("mcTurn").textContent = turn === "player" ? "🫵 あなたの番" : "🤖 CPUの番";
    const grid = el("mcGrid");
    grid.innerHTML = cards
      .map((c) => {
        if (c.state === "hidden") return PC.cardHTML(c, { faceDown: true });
        if (c.state === "revealed") return PC.cardHTML(c, {});
        return PC.cardHTML(c, { extraClass: "matched " + (c.state === "matched-player" ? "mine" : "cpu") });
      })
      .join("");
    grid.querySelectorAll(".pc-card").forEach((elCard) => {
      elCard.addEventListener("click", () => onCellClick(elCard.dataset.id));
    });
  }

  global.ConcentrationGame = { init };
})(window);
