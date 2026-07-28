/* =========================================================
 * blackjack.js — ブラックジャック(プレイヤー vs ディーラー)
 * ========================================================= */
(function (global) {
  "use strict";
  const PC = global.PC;
  const BET_STEP = 50, MIN_BET = 50, START_CHIPS = 1000;

  let level = 2, chips = START_CHIPS, bet = 100, deck = [];
  let playerHand = [], dealerHand = [];
  let phase = "bet"; // bet | player | dealer | end
  let hitSoft17 = true, showHint = false;

  function el(id) { return document.getElementById(id); }

  function init(lv) {
    level = lv;
    chips = START_CHIPS;
    bet = 100;
    hitSoft17 = level >= 2;
    showHint = level === 1;
    el("bjLvBadge").textContent = ["", "初級", "中級", "上級"][lv];
    el("bjHint").textContent = showHint
      ? "ヒント表示ON:合計17以上ならスタンド推奨、12〜16はディーラーの見せ札次第。21に近いほうが勝ち！"
      : "21に近いほうが勝ち。22以上でバースト(負け)。A=1か11、絵札=10、他は数字通り。" + (hitSoft17 ? "(ディーラーはソフト17でもヒットします)" : "");
    phase = "bet";
    playerHand = []; dealerHand = [];
    render();
  }

  function handValue(hand) {
    let total = 0, aces = 0;
    for (const c of hand) {
      if (c.rank === "A") { total += 11; aces++; }
      else if (["J", "Q", "K"].includes(c.rank)) total += 10;
      else total += Number(c.rank);
    }
    let soft = aces > 0;
    while (total > 21 && aces > 0) { total -= 10; aces--; soft = aces > 0; }
    return { total, soft: soft && total <= 21 };
  }
  function isBlackjack(hand) { return hand.length === 2 && handValue(hand).total === 21; }

  function adjustBet(delta) {
    if (phase !== "bet") return;
    bet = Math.max(MIN_BET, Math.min(chips, bet + delta));
    render();
  }

  function deal() {
    if (phase !== "bet" || bet > chips) return;
    chips -= bet;
    deck = PC.shuffle(PC.makeDeck());
    playerHand = [deck.shift(), deck.shift()];
    dealerHand = [deck.shift(), deck.shift()];
    phase = "player";
    render();
    if (isBlackjack(playerHand) || isBlackjack(dealerHand)) {
      setTimeout(() => resolve(), 500);
    }
  }

  function hit() {
    if (phase !== "player") return;
    playerHand.push(deck.shift());
    if (handValue(playerHand).total > 21) { phase = "dealer"; render(); setTimeout(resolve, 500); }
    else render();
  }

  function stand() {
    if (phase !== "player") return;
    phase = "dealer";
    render();
    setTimeout(dealerPlay, 600);
  }

  function doubleDown() {
    if (phase !== "player" || playerHand.length !== 2 || chips < bet) return;
    chips -= bet; bet *= 2;
    playerHand.push(deck.shift());
    phase = "dealer";
    render();
    if (handValue(playerHand).total > 21) setTimeout(resolve, 500);
    else setTimeout(dealerPlay, 600);
  }

  function dealerPlay() {
    const v = handValue(dealerHand);
    if (v.total < 17 || (v.total === 17 && v.soft && hitSoft17)) {
      dealerHand.push(deck.shift());
      render();
      setTimeout(dealerPlay, 650);
    } else {
      resolve();
    }
  }

  function resolve() {
    phase = "end";
    const pv = handValue(playerHand), dv = handValue(dealerHand);
    const pBJ = isBlackjack(playerHand), dBJ = isBlackjack(dealerHand);
    let outcome, payout, msg;

    if (pv.total > 21) { outcome = "lose"; payout = 0; msg = "バースト…あなたの負け"; }
    else if (pBJ && dBJ) { outcome = "push"; payout = bet; msg = "両者ブラックジャック！引き分け"; }
    else if (pBJ) { outcome = "win"; payout = Math.floor(bet * 2.5); msg = "ブラックジャック！🎉 あなたの勝ち"; }
    else if (dBJ) { outcome = "lose"; payout = 0; msg = "ディーラーがブラックジャック…負け"; }
    else if (dv.total > 21) { outcome = "win"; payout = bet * 2; msg = "ディーラーバースト！あなたの勝ち"; }
    else if (pv.total > dv.total) { outcome = "win"; payout = bet * 2; msg = "あなたの勝ち！ " + pv.total + " 対 " + dv.total; }
    else if (pv.total < dv.total) { outcome = "lose"; payout = 0; msg = "あなたの負け… " + pv.total + " 対 " + dv.total; }
    else { outcome = "push"; payout = bet; msg = "引き分け(プッシュ) " + pv.total + " 対 " + dv.total; }

    chips += payout;
    render(true);
    el("bjStatus").textContent = msg;

    setTimeout(() => {
      if (chips < MIN_BET) {
        global.AppModal.show("💸", "資金が尽きました…", "所持チップがなくなりました。もう一度挑戦してみよう。", "もう一度", () => { global.AppModal.hide(); init(level); });
        return;
      }
      global.AppModal.show(
        outcome === "win" ? "🎉" : outcome === "push" ? "🤝" : "😢",
        outcome === "win" ? "あなたの勝ち！" : outcome === "push" ? "引き分け" : "ディーラーの勝ち",
        msg + "\n\n所持チップ: " + chips,
        "次のゲームへ",
        () => { global.AppModal.hide(); nextRound(); }
      );
    }, 800);
  }

  function nextRound() {
    phase = "bet";
    playerHand = []; dealerHand = [];
    bet = Math.min(bet, chips);
    render();
  }

  function render(revealDealer) {
    el("bjChips").textContent = chips;
    el("bjBet").textContent = bet;
    el("bjBetRow").style.display = phase === "bet" ? "flex" : "none";
    el("bjDealBtn").disabled = bet > chips;

    const dv = handValue(dealerHand);
    const reveal = revealDealer || phase === "dealer" || phase === "end";
    el("bjDealerHand").innerHTML = dealerHand
      .map((c, i) => (i === 1 && !reveal ? PC.cardHTML(c, { faceDown: true }) : PC.cardHTML(c)))
      .join("");
    el("bjDealerScore").textContent = dealerHand.length ? (reveal ? dv.total : "?") : "";

    const pv = handValue(playerHand);
    el("bjPlayerHand").innerHTML = playerHand.map((c) => PC.cardHTML(c)).join("");
    el("bjPlayerScore").textContent = playerHand.length ? pv.total + (pv.soft ? "(ソフト)" : "") : "";

    if (phase === "bet") {
      el("bjStatus").textContent = "ベットを決めて「配る」を押してね(所持チップ " + chips + ")";
    } else if (phase === "player") {
      el("bjStatus").textContent = "ヒットで1枚引く、スタンドでやめる" + (showHint ? "。" + hintText(pv, dealerHand[0]) : "");
    }

    renderControls();
  }

  function hintText(pv, dealerUp) {
    const upVal = ["J", "Q", "K"].includes(dealerUp.rank) ? 10 : dealerUp.rank === "A" ? 11 : Number(dealerUp.rank);
    if (pv.total >= 17) return "ヒント: もう十分強い、スタンドが安全";
    if (pv.total <= 11) return "ヒント: バーストしないのでヒント推奨(ヒットしよう)";
    if (upVal >= 7) return "ヒント: 相手が強そう、ヒットを検討";
    return "ヒント: 相手が弱そう、スタンドも検討";
  }

  function renderControls() {
    const c = el("bjControls");
    c.innerHTML = "";
    if (phase !== "player") return;
    c.appendChild(makeBtn("✋ ヒット", "btn-main", hit));
    c.appendChild(makeBtn("🛑 スタンド", "btn-sub", stand));
    if (playerHand.length === 2 && chips >= bet) {
      c.appendChild(makeBtn("💰 ダブルダウン", "btn-gold", doubleDown));
    }
  }

  function makeBtn(label, cls, fn) {
    const b = document.createElement("button");
    b.className = "btn " + cls;
    b.textContent = label;
    b.onclick = fn;
    return b;
  }

  document.addEventListener("DOMContentLoaded", () => {
    el("bjBetMinus").addEventListener("click", () => adjustBet(-BET_STEP));
    el("bjBetPlus").addEventListener("click", () => adjustBet(BET_STEP));
    el("bjDealBtn").addEventListener("click", deal);
  });

  global.BlackjackGame = { init };
})(window);
