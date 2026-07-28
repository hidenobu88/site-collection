/* =========================================================
 * poker.js — 5カードドローポーカー(プレイヤー vs CPU2人)
 * ========================================================= */
(function (global) {
  "use strict";
  const PC = global.PC;
  const ANTE = 50, BET = 100;
  const ORDER = ["player", "cpu1", "cpu2"];
  const NAMES = { player: "あなた", cpu1: "CPU 1", cpu2: "CPU 2" };

  let level = 2, deck = [], pot = 0, currentBet = 0, committed = {};
  let players = {};
  let phase = "idle"; // discard | betting | showdown
  let actQueue = [];
  let selected = new Set();
  let busy = false;

  const LEVEL_PARAM = {
    1: { betStrong: 0.32, betBluff: 0.05, callTh: 0.13, bluffCall: 0.28 },
    2: { betStrong: 0.55, betBluff: 0.12, callTh: 0.27, bluffCall: 0.15 },
    3: { betStrong: 0.7, betBluff: 0.22, callTh: 0.36, bluffCall: 0.07 },
  };

  function el(id) { return document.getElementById(id); }
  function activePlayers() { return ORDER.filter((id) => !players[id].busted); }
  function nonFolded() { return activePlayers().filter((id) => !players[id].folded); }
  function otherActive(id) { return activePlayers().filter((x) => x !== id && !players[x].folded); }

  function init(lv) {
    level = lv;
    players = {
      player: { chips: 1000, hand: [], folded: false, busted: false, msg: "" },
      cpu1: { chips: 1000, hand: [], folded: false, busted: false, msg: "" },
      cpu2: { chips: 1000, hand: [], folded: false, busted: false, msg: "" },
    };
    el("pokerLvBadge").textContent = ["", "初級", "中級", "上級"][lv];
    startRound();
  }

  function startRound() {
    if (players.player.chips < ANTE) return gameOver(false);
    if (players.cpu1.chips < ANTE && players.cpu2.chips < ANTE) return gameOver(true);
    ORDER.forEach((id) => {
      const p = players[id];
      p.busted = p.chips < ANTE;
      p.folded = p.busted;
      p.msg = "";
      p.hand = [];
    });
    deck = PC.shuffle(PC.makeDeck());
    pot = 0;
    activePlayers().forEach((id) => {
      const p = players[id];
      p.hand = deck.splice(0, 5);
      p.chips -= ANTE;
      pot += ANTE;
    });
    selected = new Set();
    phase = "discard";
    busy = false;
    setStatus("カードが配られました。交換したいカードをタップしてね");
    render();
  }

  function toggleSelect(cardId) {
    if (phase !== "discard" || busy) return;
    if (selected.has(cardId)) selected.delete(cardId);
    else selected.add(cardId);
    render();
  }

  function doDiscard() {
    if (phase !== "discard" || busy) return;
    busy = true;
    const p = players.player;
    p.hand = p.hand.filter((c) => !selected.has(c.id)).concat(deck.splice(0, selected.size));
    activePlayers()
      .filter((id) => id !== "player")
      .forEach((id) => {
        const cp = players[id];
        const idxs = cpuDiscardChoice(cp.hand);
        const discarded = idxs.map((i) => cp.hand[i]);
        cp.hand = cp.hand.filter((c) => !discarded.includes(c)).concat(deck.splice(0, idxs.length));
      });
    selected = new Set();
    busy = false;
    setStatus("カード交換完了！ベットの番です");
    startBetting();
  }

  function cpuDiscardChoice(hand) {
    const counts = {};
    hand.forEach((c) => (counts[c.rank] = (counts[c.rank] || 0) + 1));
    let keepIdx = [];
    hand.forEach((c, i) => { if (counts[c.rank] >= 2) keepIdx.push(i); });
    if (keepIdx.length === 0) {
      const sorted = hand.map((c, i) => ({ i, v: c.value })).sort((a, b) => b.v - a.v);
      const keepCount = level >= 2 ? 2 : 1;
      keepIdx = sorted.slice(0, keepCount).map((x) => x.i);
    }
    return hand.map((_, i) => i).filter((i) => !keepIdx.includes(i));
  }

  function handStrength(hand) {
    const e = PC.evaluatePokerHand(hand);
    return e.rank / 9 + (e.tiebreak[0] || 0) / 200;
  }

  /* ---------- ベッティング ---------- */
  function startBetting() {
    phase = "betting";
    currentBet = 0;
    committed = {};
    activePlayers().forEach((id) => (committed[id] = 0));
    actQueue = activePlayers().filter((id) => !players[id].folded);
    render();
    processBetTurn();
  }

  let playerTurnWaiting = false;

  function processBetTurn() {
    playerTurnWaiting = false;
    if (actQueue.length === 0) return endBetting();
    const id = actQueue.shift();
    const p = players[id];
    if (p.folded) return processBetTurn();
    if (id === "player") { playerTurnWaiting = true; render(); return; } // プレイヤーの入力待ち
    busy = true;
    setStatus(NAMES[id] + " が考え中…");
    setTimeout(() => { cpuBetAction(id); busy = false; render(); processBetTurn(); }, 600);
  }

  function cpuBetAction(id) {
    const p = players[id];
    const s = handStrength(p.hand);
    const prm = LEVEL_PARAM[level];
    if (currentBet === 0) {
      const prob = s > 0.33 ? prm.betStrong : prm.betBluff;
      if (Math.random() < prob) {
        const amt = Math.min(BET, p.chips);
        p.chips -= amt; committed[id] = amt; pot += amt; currentBet = amt;
        p.msg = "ベット！ 💰" + amt;
        actQueue = otherActive(id);
      } else {
        p.msg = "チェック";
      }
    } else {
      const need = Math.min(currentBet - (committed[id] || 0), p.chips);
      if (s >= prm.callTh || Math.random() < prm.bluffCall) {
        p.chips -= need; committed[id] = (committed[id] || 0) + need; pot += need;
        p.msg = need > 0 ? "コール" : "チェック";
      } else {
        p.folded = true;
        p.msg = "フォールド";
      }
    }
  }

  function playerAction(action) {
    if (phase !== "betting" || busy) return;
    const p = players.player;
    if (action === "check") {
      p.msg = "チェック";
    } else if (action === "bet") {
      const amt = Math.min(BET, p.chips);
      p.chips -= amt; committed.player = amt; pot += amt; currentBet = amt;
      p.msg = "ベット！ 💰" + amt;
      actQueue = otherActive("player");
    } else if (action === "call") {
      const need = Math.min(currentBet - (committed.player || 0), p.chips);
      p.chips -= need; committed.player = (committed.player || 0) + need; pot += need;
      p.msg = need > 0 ? "コール" : "チェック";
    } else if (action === "fold") {
      p.folded = true;
      p.msg = "フォールド";
    }
    render();
    processBetTurn();
  }

  function endBetting() {
    const remain = nonFolded();
    if (remain.length === 1) return finishRound(remain, false);
    return finishRound(remain, true);
  }

  function finishRound(remain, showdown) {
    phase = "showdown";
    let winners = [];
    if (!showdown) {
      winners = remain;
    } else {
      let best = remain[0];
      for (const id of remain.slice(1)) {
        if (PC.comparePokerHands(players[id].hand, players[best].hand) > 0) best = id;
      }
      winners = remain.filter((id) => PC.comparePokerHands(players[id].hand, players[best].hand) === 0);
    }
    const share = Math.floor(pot / winners.length);
    winners.forEach((id) => (players[id].chips += share));
    const potAtEnd = pot;
    pot = 0;

    let msg;
    if (showdown) {
      const handNames = remain.map((id) => NAMES[id] + "「" + PC.evaluatePokerHand(players[id].hand).name + "」").join(" / ");
      msg = handNames + "\n";
    } else {
      msg = "";
    }
    if (winners.includes("player")) {
      msg += (showdown ? "あなたの勝ち！🎉" : "相手が降りました。あなたの勝ち！") + " (+" + potAtEnd + ")";
    } else {
      msg += winners.map((id) => NAMES[id]).join("と") + " の勝ち… (-" + (potAtEnd - share) + ")";
    }
    setStatus(msg.replace(/\n/g, " "));
    render(true);

    setTimeout(() => {
      global.AppModal.show(
        winners.includes("player") ? "🎉" : "😢",
        winners.includes("player") ? "あなたの勝ち！" : NAMES[winners[0]] + "の勝ち",
        (showdown ? remain.map((id) => NAMES[id] + ": " + PC.evaluatePokerHand(players[id].hand).name).join("\n") + "\n\n" : "") +
          "POT " + potAtEnd + " チップ",
        "次のゲームへ",
        () => { global.AppModal.hide(); startRound(); }
      );
    }, 900);
  }

  function gameOver(playerWins) {
    global.AppModal.show(
      playerWins ? "🏆" : "💸",
      playerWins ? "あなたの総取り勝利！" : "資金が尽きました…",
      playerWins ? "CPU全員のチップを奪いました！お見事！" : "チップがなくなってしまいました。もう一度挑戦してみよう。",
      "もう一度",
      () => { global.AppModal.hide(); init(level); }
    );
  }

  /* ---------- 描画 ---------- */
  function render(revealAll) {
    el("pokerPot").textContent = pot;
    el("pokerPlayerChips").textContent = players.player.chips;
    el("pokerCpu1Chips").textContent = players.cpu1.chips;
    el("pokerCpu2Chips").textContent = players.cpu2.chips;
    el("pokerCpu1Msg").textContent = players.cpu1.folded ? "フォールド" : players.cpu1.msg;
    el("pokerCpu2Msg").textContent = players.cpu2.folded ? "フォールド" : players.cpu2.msg;
    el("pokerCpu1").classList.toggle("folded", players.cpu1.folded);
    el("pokerCpu2").classList.toggle("folded", players.cpu2.folded);

    const revealCpu = revealAll && phase === "showdown";
    el("pokerCpu1Hand").innerHTML = players.cpu1.hand
      .map((c) => (revealCpu && !players.cpu1.folded ? PC.cardHTML(c, { small: true }) : PC.cardHTML(c, { small: true, faceDown: true })))
      .join("");
    el("pokerCpu2Hand").innerHTML = players.cpu2.hand
      .map((c) => (revealCpu && !players.cpu2.folded ? PC.cardHTML(c, { small: true }) : PC.cardHTML(c, { small: true, faceDown: true })))
      .join("");

    el("pokerPlayerHand").innerHTML = players.player.hand
      .map((c) => PC.cardHTML(c, { selected: selected.has(c.id) }))
      .join("");
    el("pokerPlayerHand").querySelectorAll(".pc-card").forEach((elCard) => {
      elCard.classList.toggle("clickable", phase === "discard");
      elCard.addEventListener("click", () => toggleSelect(elCard.dataset.id));
    });

    if (players.player.hand.length === 5) {
      const hn = PC.evaluatePokerHand(players.player.hand);
      el("pokerHandName").textContent = hn.name;
    }

    renderControls();
  }

  function renderControls() {
    const c = el("pokerControls");
    c.innerHTML = "";
    if (phase === "discard") {
      const btn = document.createElement("button");
      btn.className = "btn btn-main";
      btn.textContent = selected.size > 0 ? "🔄 " + selected.size + "枚交換する" : "✋ 交換しない(このまま)";
      btn.onclick = doDiscard;
      c.appendChild(btn);
    }
    if (phase === "betting" && !players.player.folded && !busy && playerTurnWaiting) {
      if (currentBet === 0) {
        c.appendChild(makeBtn("チェック", "btn-sub", () => playerAction("check")));
        c.appendChild(makeBtn("ベット 💰" + BET, "btn-main", () => playerAction("bet")));
      } else {
        const need = currentBet - (committed.player || 0);
        c.appendChild(makeBtn("コール 💰" + need, "btn-main", () => playerAction("call")));
        c.appendChild(makeBtn("フォールド", "btn-sub", () => playerAction("fold")));
      }
    }
  }

  function makeBtn(label, cls, fn) {
    const b = document.createElement("button");
    b.className = "btn " + cls;
    b.textContent = label;
    b.onclick = fn;
    return b;
  }

  function setStatus(txt) { el("pokerStatus").textContent = txt; }

  global.PokerGame = { init };
})(window);
