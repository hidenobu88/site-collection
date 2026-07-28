/* =========================================================
 * common.js — トランプ共通ロジック(デッキ生成・カード描画・役判定)
 * ポーカー/ブラックジャック/大富豪/神経衰弱から共通で利用
 * ========================================================= */
(function (global) {
  "use strict";

  const SUITS = ["s", "h", "d", "c"]; // spade, heart, diamond, clover
  const SUIT_MARK = { s: "♠", h: "♥", d: "♦", c: "♣" };
  const SUIT_RED = { s: false, h: true, d: true, c: false };
  const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  // ポーカー用の強さ(A=14が最強、内部値2〜14)
  const RANK_VALUE = { A: 14, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, J: 11, Q: 12, K: 13 };
  // 大富豪用の強さ順(弱い→強い): 3が最弱、2が最強
  const DAIFUGO_ORDER = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];
  const DAIFUGO_RANK = {};
  DAIFUGO_ORDER.forEach((r, i) => (DAIFUGO_RANK[r] = i));

  let uid = 0;
  function makeDeck() {
    const deck = [];
    for (const s of SUITS) {
      for (const r of RANKS) {
        deck.push({ id: "c" + uid++, suit: s, rank: r, value: RANK_VALUE[r] });
      }
    }
    return deck;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ---------- カード描画(HTML文字列を返す) ---------- */
  // opts: { faceDown, small, selected, dim }
  function cardHTML(card, opts) {
    opts = opts || {};
    if (opts.faceDown) {
      return (
        '<div class="pc-card back' + (opts.small ? " pc-sm" : "") + (opts.extraClass ? " " + opts.extraClass : "") +
        '" aria-hidden="true" data-id="' + (card ? card.id : "") + '">' +
        '<div class="pc-back-pattern"></div></div>'
      );
    }
    const red = SUIT_RED[card.suit];
    const mark = SUIT_MARK[card.suit];
    const cls =
      "pc-card" +
      (red ? " pc-red" : " pc-black") +
      (opts.small ? " pc-sm" : "") +
      (opts.selected ? " pc-selected" : "") +
      (opts.dim ? " pc-dim" : "") +
      (opts.extraClass ? " " + opts.extraClass : "");
    return (
      '<div class="' + cls + '" data-id="' + card.id + '">' +
      '<span class="pc-rank pc-tl">' + card.rank + '<br>' + mark + '</span>' +
      '<span class="pc-suit-big">' + mark + '</span>' +
      '<span class="pc-rank pc-br">' + card.rank + '<br>' + mark + '</span>' +
      '</div>'
    );
  }

  function sortHand(cards, byDaifugo) {
    return cards.slice().sort((a, b) => {
      if (byDaifugo) return DAIFUGO_RANK[a.rank] - DAIFUGO_RANK[b.rank];
      return RANK_VALUE[a.rank] - RANK_VALUE[b.rank];
    });
  }

  /* ---------- ポーカー役判定(5枚) ----------
   * 戻り値: { rank: 0-9, name: string, tiebreak: [数値の配列(降順比較用)] }
   * rank: 0 ハイカード 1 ワンペア 2 ツーペア 3 スリーカード 4 ストレート
   *       5 フラッシュ 6 フルハウス 7 フォーカード 8 ストレートフラッシュ 9 ロイヤルフラッシュ
   */
  function evaluatePokerHand(cards5) {
    const values = cards5.map((c) => c.value).sort((a, b) => b - a);
    const suits = cards5.map((c) => c.suit);
    const isFlush = suits.every((s) => s === suits[0]);

    // ストレート判定(A-2-3-4-5のホイールも考慮)
    const uniqVals = Array.from(new Set(values)).sort((a, b) => b - a);
    let straightHigh = null;
    if (uniqVals.length === 5) {
      if (uniqVals[0] - uniqVals[4] === 4) straightHigh = uniqVals[0];
      else if (uniqVals.join(",") === "14,5,4,3,2") straightHigh = 5; // ホイール(5高)
    }

    // ランクごとの枚数集計
    const counts = {};
    for (const v of values) counts[v] = (counts[v] || 0) + 1;
    const groups = Object.entries(counts)
      .map(([v, c]) => ({ v: Number(v), c }))
      .sort((a, b) => b.c - a.c || b.v - a.v);

    const isStraight = straightHigh !== null;

    if (isStraight && isFlush) {
      const rank = straightHigh === 14 ? 9 : 8; // ロイヤル or ストレートフラッシュ
      return { rank, name: rank === 9 ? "ロイヤルストレートフラッシュ" : "ストレートフラッシュ", tiebreak: [straightHigh] };
    }
    if (groups[0].c === 4) {
      return { rank: 7, name: "フォーカード", tiebreak: [groups[0].v, groups[1].v] };
    }
    if (groups[0].c === 3 && groups[1] && groups[1].c === 2) {
      return { rank: 6, name: "フルハウス", tiebreak: [groups[0].v, groups[1].v] };
    }
    if (isFlush) {
      return { rank: 5, name: "フラッシュ", tiebreak: values };
    }
    if (isStraight) {
      return { rank: 4, name: "ストレート", tiebreak: [straightHigh] };
    }
    if (groups[0].c === 3) {
      const kickers = groups.slice(1).map((g) => g.v);
      return { rank: 3, name: "スリーカード", tiebreak: [groups[0].v, ...kickers] };
    }
    if (groups[0].c === 2 && groups[1] && groups[1].c === 2) {
      const pairVals = [groups[0].v, groups[1].v].sort((a, b) => b - a);
      const kicker = groups[2].v;
      return { rank: 2, name: "ツーペア", tiebreak: [...pairVals, kicker] };
    }
    if (groups[0].c === 2) {
      const kickers = groups.slice(1).map((g) => g.v);
      return { rank: 1, name: "ワンペア", tiebreak: [groups[0].v, ...kickers] };
    }
    return { rank: 0, name: "ハイカード", tiebreak: values };
  }

  // 手札(5枚)同士を比較。a>b なら正、a<b なら負、引き分けは0
  function comparePokerHands(a, b) {
    const ea = evaluatePokerHand(a);
    const eb = evaluatePokerHand(b);
    if (ea.rank !== eb.rank) return ea.rank - eb.rank;
    for (let i = 0; i < ea.tiebreak.length; i++) {
      const d = (ea.tiebreak[i] || 0) - (eb.tiebreak[i] || 0);
      if (d !== 0) return d;
    }
    return 0;
  }

  global.PC = {
    SUITS, SUIT_MARK, SUIT_RED, RANKS, RANK_VALUE, DAIFUGO_ORDER, DAIFUGO_RANK,
    makeDeck, shuffle, cardHTML, sortHand,
    evaluatePokerHand, comparePokerHands,
  };
})(window);
