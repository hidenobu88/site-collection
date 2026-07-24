/* =========================================================
 * ai.js — CPU の思考ルーチン(弱・中・強の3段階)
 * ========================================================= */

function cardRank(card) {
  return { hikari: 4, tane: 3, tanzaku: 2, kasu: 1 }[card.type] || 0;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* 手札の各カードについて、場に一致札があるか調べて候補一覧を作る */
function enumerateOptions(round, hand) {
  return hand.map(cardId => ({
    cardId,
    matches: fieldMatches(round, cardId),
  }));
}

/* 一致札が2枚(選択が必要)なとき、どちらを取るか選ぶ */
function chooseFieldTarget(matches, difficulty) {
  if (matches.length <= 1) return matches[0];
  if (difficulty === "weak") return pick(matches);
  // 中・強は価値が高い方を優先して取る
  const sorted = matches.slice().sort((a, b) => cardRank(cardOf(b)) - cardRank(cardOf(a)));
  return sorted[0];
}

/* CPUが「役を狙って伸ばしている種類」を軽く判定するための集計 */
function capturedTally(capturedIds) {
  const cards = capturedIds.map(cardOf);
  return {
    hikari: cards.filter(c => c.type === "hikari").length,
    tane: cards.filter(c => c.type === "tane").length,
    tanzaku: cards.filter(c => c.type === "tanzaku").length,
    kasu: cards.filter(c => c.type === "kasu").length,
  };
}

/* ---------- 手札から出す1枚(と場の取り先)を決める ---------- */
function aiPlanHandPlay(round, difficulty) {
  const hand = round.hands.cpu;
  const options = enumerateOptions(round, hand);
  const capturing = options.filter(o => o.matches.length > 0);

  if (difficulty === "weak") {
    // 弱: ほぼランダム。取れるなら気まぐれに取るが、取れる手があっても見逃すことがある
    if (capturing.length > 0 && Math.random() < 0.75) {
      const o = pick(capturing);
      return { cardId: o.cardId, fieldChoice: chooseFieldTarget(o.matches, difficulty) };
    }
    const o = pick(options);
    return { cardId: o.cardId, fieldChoice: chooseFieldTarget(o.matches, difficulty) };
  }

  if (capturing.length > 0) {
    if (difficulty === "medium") {
      // 中: 取れるときは必ず取る。複数取れるなら価値が高い組み合わせを優先
      const best = capturing.slice().sort((a, b) => {
        const va = Math.max(...a.matches.map(m => cardRank(cardOf(m)))) + cardRank(cardOf(a.cardId));
        const vb = Math.max(...b.matches.map(m => cardRank(cardOf(m)))) + cardRank(cardOf(b.cardId));
        return vb - va;
      })[0];
      return { cardId: best.cardId, fieldChoice: chooseFieldTarget(best.matches, difficulty) };
    }
    // 強: 役の進み具合も考慮して最も得な取り方を選ぶ
    const tally = capturedTally(round.captured.cpu);
    const scored = capturing.map(o => {
      const targetRank = Math.max(...o.matches.map(m => cardRank(cardOf(m))));
      let score = targetRank * 10 + cardRank(cardOf(o.cardId));
      const t = cardOf(o.cardId).type;
      const targetType = cardOf(o.matches.sort((a, b) => cardRank(cardOf(b)) - cardRank(cardOf(a)))[0]).type;
      // 役の完成に近いものはボーナス
      if (targetType === "hikari") score += 15;
      if (targetType === "tanzaku" && tally.tanzaku >= 2) score += 12;
      if (targetType === "tane" && tally.tane >= 3) score += 8;
      if (targetType === "kasu" && tally.kasu >= 8) score += 6;
      return { o, score };
    }).sort((a, b) => b.score - a.score);
    const best = scored[0].o;
    return { cardId: best.cardId, fieldChoice: chooseFieldTarget(best.matches, difficulty) };
  }

  // 取れる手がない場合の「捨て方」
  if (difficulty === "medium") {
    const kasuOnly = options.filter(o => cardOf(o.cardId).type === "kasu");
    const o = kasuOnly.length ? pick(kasuOnly) : pick(options);
    return { cardId: o.cardId, fieldChoice: undefined };
  }
  if (difficulty === "strong") {
    // 強: 場や自分の手の中で「もう相手に取られる危険が低い」札から出す
    const monthCount = {};
    round.field.forEach(id => { const m = cardOf(id).month; monthCount[m] = (monthCount[m] || 0) + 1; });
    const scored = options.map(o => {
      const c = cardOf(o.cardId);
      let danger = cardRank(c); // 価値が高い札を場に残すのはリスク
      if (monthCount[c.month]) danger += 5; // 既に場に同月があると次に狙われやすい
      return { o, danger };
    }).sort((a, b) => a.danger - b.danger);
    return { cardId: scored[0].o.cardId, fieldChoice: undefined };
  }
  const o = pick(options);
  return { cardId: o.cardId, fieldChoice: undefined };
}

/* ---------- めくり札を場に置く/取るときの選択(一致が2枚のとき) ---------- */
function aiChooseDrawTarget(round, matches, difficulty) {
  return chooseFieldTarget(matches, difficulty);
}

/* ---------- こいこい する/しない を決める ---------- */
function aiDecideKoikoi(round, difficulty, yakuInfo) {
  const cardsLeft = round.hands.cpu.length; // 自分の残り手数(=残り取れるチャンス数の目安)
  const total = yakuInfo.total;

  if (difficulty === "weak") {
    // 弱: だいたい安全策で「やめる」を選びがち
    return Math.random() < 0.2 && cardsLeft > 1;
  }
  if (difficulty === "medium") {
    if (cardsLeft <= 1) return false;
    if (total >= 5) return Math.random() < 0.3;
    return Math.random() < 0.6;
  }
  // 強: 残り手数と役の伸びしろを見て判断
  const tally = capturedTally(round.captured.cpu);
  const growthPotential = (tally.tane >= 3 ? 1 : 0) + (tally.tanzaku >= 2 ? 1 : 0) + (tally.hikari >= 2 ? 1 : 0);
  if (cardsLeft <= 1) return false;
  if (total >= 7 && cardsLeft <= 3) return false; // 十分な点があり終盤なら手堅く確定
  if (growthPotential >= 1 && cardsLeft >= 2) return Math.random() < 0.75;
  return Math.random() < 0.45;
}
