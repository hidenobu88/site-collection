/* =========================================================
 * daifugo.js — 大富豪(プレイヤー vs CPU3人・階段なしの簡易ルール)
 * ルール: 8切り / 4枚出しで革命 / 出せなければパス / 全員パスで場流れ
 * ========================================================= */
(function (global) {
  "use strict";
  const PC = global.PC;
  const ORDER = ["player", "cpu1", "cpu2", "cpu3"];
  const NAMES = { player: "あなた", cpu1: "CPU 1", cpu2: "CPU 2", cpu3: "CPU 3" };
  const RANK_LABEL = { 大富豪: "🥇 大富豪", 富豪: "🥈 富豪", 貧民: "🥉 貧民", 大貧民: "💦 大貧民" };
  const PLACE_NAMES = ["大富豪", "富豪", "貧民", "大貧民"];

  let level = 2, hands = {}, finished = [], field = null, revolution = false, turnOrder = [], turnPtr = 0, busy = false;
  let selected = new Set();

  function el(id) { return document.getElementById(id); }
  function daifugoValue(rank) { const v = PC.DAIFUGO_RANK[rank]; return revolution ? 12 - v : v; }

  function init(lv) {
    level = lv;
    el("dfgLvBadge").textContent = ["", "初級", "中級", "上級"][lv];
    const deck = PC.shuffle(PC.makeDeck());
    hands = { player: [], cpu1: [], cpu2: [], cpu3: [] };
    let i = 0;
    while (deck.length) { hands[ORDER[i % 4]].push(deck.pop()); i++; }
    ORDER.forEach((id) => (hands[id] = PC.sortHand(hands[id], true)));
    finished = [];
    field = null;
    revolution = false;
    turnOrder = ORDER.slice();
    turnPtr = 0;
    selected = new Set();
    setStatus("ゲーム開始！あなたから自由に出せます(何を出してもOK)");
    render();
    if (currentPlayer() !== "player") setTimeout(runCpu, 700);
  }

  function activeIds() { return turnOrder.filter((id) => !finished.includes(id)); }
  function currentPlayer() {
    const act = activeIds();
    if (act.length === 0) return null;
    while (finished.includes(turnOrder[turnPtr % turnOrder.length])) turnPtr++;
    return turnOrder[turnPtr % turnOrder.length];
  }
  function advanceTurn() {
    turnPtr++;
    const act = activeIds();
    while (act.length > 1 && finished.includes(turnOrder[turnPtr % turnOrder.length])) turnPtr++;
  }

  function groupByRank(hand) {
    const g = {};
    hand.forEach((c) => { (g[c.rank] = g[c.rank] || []).push(c); });
    return g;
  }

  // 場に対して出せる候補: [{rank, cards(必要枚数分)}]
  function validCandidates(hand, fld) {
    const g = groupByRank(hand);
    const out = [];
    for (const rank in g) {
      const cards = g[rank];
      if (fld) {
        if (cards.length >= fld.count && daifugoValue(rank) > daifugoValue(fld.rank)) {
          out.push({ rank, cards: cards.slice(0, fld.count) });
        }
      } else {
        // 場が空(リード): 好きな枚数(1〜手持ち数)で出せる。ここでは全パターンを列挙
        for (let n = 1; n <= cards.length; n++) out.push({ rank, cards: cards.slice(0, n) });
      }
    }
    return out;
  }

  /* ---------- カード選択(プレイヤー) ---------- */
  function toggleSelect(cardId) {
    if (currentPlayer() !== "player" || busy) return;
    if (selected.has(cardId)) selected.delete(cardId);
    else {
      // 場がある場合、選択できる枚数は場と同じ枚数まで
      if (field && selected.size >= field.count) return;
      selected.add(cardId);
    }
    render();
  }

  function playerPlay() {
    if (currentPlayer() !== "player" || busy) return;
    const cards = hands.player.filter((c) => selected.has(c.id));
    if (cards.length === 0) return setStatus("カードを選んでね");
    const rank = cards[0].rank;
    if (!cards.every((c) => c.rank === rank)) return setStatus("同じ数字のカードだけを選んでね");
    if (field && cards.length !== field.count) return setStatus("場と同じ枚数(" + field.count + "枚)を出してね");
    if (field && daifugoValue(rank) <= daifugoValue(field.rank)) return setStatus("場より強い数字を出してね");
    executePlay("player", cards);
  }

  function playerPass() {
    if (currentPlayer() !== "player" || busy) return;
    if (!field) return setStatus("リード時はパスできません。カードを出してね");
    selected = new Set();
    setStatus("あなたはパスしました");
    continueAfterAction();
  }

  /* ---------- プレイ実行 ---------- */
  function executePlay(id, cards) {
    const rank = cards[0].rank;
    hands[id] = hands[id].filter((c) => !cards.includes(c));
    let msg = NAMES[id] + " が「" + rank + "」を" + cards.length + "枚出した";
    if (cards.length === 4) { revolution = !revolution; msg += "\n🔄 革命発生！強さが逆転！"; }
    const emptied = hands[id].length === 0;
    const isEight = rank === "8";
    if (isEight) msg += "\n💥 8切り！場が流れます";
    if (emptied) {
      finished.push(id);
      const place = PLACE_NAMES[finished.length - 1];
      msg += "\n🎉 " + NAMES[id] + " が上がり！" + RANK_LABEL[place];
    }
    if (isEight || emptied) field = null;
    else field = { rank, count: cards.length, cards, lastPlayerId: id };
    setStatus(msg);
    selected = new Set();
    render();
    continueAfterAction();
  }

  // 出す/パスのあと、次の手番へ進める共通処理
  function continueAfterAction() {
    const act = activeIds();
    if (act.length <= 1) {
      if (act.length === 1) finished.push(act[0]);
      return endGame();
    }
    advanceTurn();
    // 場が一周して出した本人に戻ってきたら場流れ(全員パス)
    const cur = currentPlayer();
    if (field && field.lastPlayerId === cur) {
      field = null;
      setStatus("全員パス！場が流れました。" + NAMES[cur] + "は自由に出せます");
    }
    render();
    if (cur === "player") { busy = false; }
    else setTimeout(runCpu, 750);
  }

  function setStatus(txt) { el("dfgStatus").textContent = txt; }

  /* ---------- CPU ---------- */
  function runCpu() {
    const id = currentPlayer();
    if (!id || id === "player") return;
    busy = true;
    const cands = validCandidates(hands[id], field);
    let choice = null;
    if (cands.length > 0) {
      if (!field) {
        choice = cpuLeadChoice(cands, id);
      } else {
        const passProb = level === 1 ? 0.2 : 0;
        if (Math.random() >= passProb) choice = cpuBeatChoice(cands);
      }
    }
    if (choice) {
      executePlay(id, choice.cards);
    } else {
      setStatus(NAMES[id] + " はパス");
      continueAfterAction();
    }
  }

  function cpuBeatChoice(cands) {
    const sorted = cands.slice().sort((a, b) => daifugoValue(a.rank) - daifugoValue(b.rank));
    if (level === 1) return sorted[Math.floor(Math.random() * sorted.length)];
    return sorted[0]; // 中級/上級は最小限の強さで勝つカードを選ぶ
  }

  function cpuLeadChoice(cands, id) {
    // 一番弱いランクを選ぶ
    const byRank = {};
    cands.forEach((c) => { if (!byRank[c.rank] || c.cards.length > byRank[c.rank].cards.length) byRank[c.rank] = c; });
    const ranks = Object.keys(byRank).sort((a, b) => daifugoValue(a) - daifugoValue(b));
    const weakest = byRank[ranks[0]];
    if (level === 3) return weakest; // 上級: まとめて出し切る
    if (level === 2) return { rank: weakest.rank, cards: weakest.cards.slice(0, 1) }; // 中級: 1枚だけ温存
    // 初級: ランダム
    const n = Math.random() < 0.5 ? 1 : weakest.cards.length;
    return { rank: weakest.rank, cards: weakest.cards.slice(0, n) };
  }

  /* ---------- 終了処理 ---------- */
  function endGame() {
    let msg = "【最終順位】\n";
    finished.forEach((id, i) => { msg += RANK_LABEL[PLACE_NAMES[i]] + " : " + NAMES[id] + "\n"; });
    render();
    setStatus("ゲーム終了！");
    const playerRank = finished.indexOf("player");
    const good = playerRank <= 1;
    setTimeout(() => {
      global.AppModal.show(
        good ? "👑" : "😢",
        RANK_LABEL[PLACE_NAMES[playerRank]] + "でした！",
        msg.trim(),
        "もう一度",
        () => { global.AppModal.hide(); init(level); }
      );
    }, 600);
  }

  const OPP_EL = { cpu1: "dfgOpp1", cpu2: "dfgOpp2", cpu3: "dfgOpp3" };

  /* ---------- 描画 ---------- */
  function render() {
    ["cpu1", "cpu2", "cpu3"].forEach((id) => {
      const n = hands[id].length;
      const backs = Math.min(n, 7);
      let html = "";
      for (let i = 0; i < backs; i++) html += PC.cardHTML(null, { faceDown: true, small: true });
      el(OPP_EL[id] + "Cards").innerHTML = html;
      const seat = el(OPP_EL[id]);
      const extra = (finished.includes(id) ? " " + RANK_LABEL[PLACE_NAMES[finished.indexOf(id)]] : "") + (currentPlayer() === id ? " 👈" : "");
      seat.querySelector(".opp-label").innerHTML = NAMES[id] + "<br>残り" + n + "枚" + extra;
      seat.classList.toggle("finished", finished.includes(id));
    });

    el("dfgField").innerHTML = field
      ? field.cards.map((c) => PC.cardHTML(c, { small: true })).join("")
      : '<span style="opacity:.6;font-size:.78rem">(場は空です・自由に出せます)</span>';
    el("dfgRevo").style.display = revolution ? "inline-block" : "none";

    const sorted = PC.sortHand(hands.player, true);
    el("dfgPlayerHand").innerHTML = sorted.map((c) => PC.cardHTML(c, { selected: selected.has(c.id) })).join("");
    el("dfgPlayerHand").querySelectorAll(".pc-card").forEach((elCard) => {
      elCard.classList.add("clickable");
      elCard.addEventListener("click", () => toggleSelect(elCard.dataset.id));
    });

    renderControls();
  }

  function renderControls() {
    const c = el("dfgControls");
    c.innerHTML = "";
    if (currentPlayer() !== "player" || busy) return;
    const playBtn = makeBtn("🎴 出す(" + selected.size + "枚)", "btn-main", playerPlay);
    c.appendChild(playBtn);
    if (field) c.appendChild(makeBtn("🙅 パス", "btn-sub", playerPass));
  }
  function makeBtn(label, cls, fn) {
    const b = document.createElement("button");
    b.className = "btn " + cls;
    b.textContent = label;
    b.onclick = fn;
    return b;
  }

  global.DaifugoGame = { init };
})(window);
