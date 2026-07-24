/* =========================================================
 * engine.js — こいこい(花札)のルールエンジン
 * 画面表示(main.js)とは分離した「純粋なルール処理」だけを持つ
 * ========================================================= */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function removeFrom(list, id) {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1);
  return i >= 0;
}

/* ---------- 役の判定 ----------
 * capturedIds: 取り札(そのプレイヤーが取った札のid配列)
 * 戻り値: { list: [{key,name,pts}], total }
 * ------------------------------------------------------- */
function computeYaku(capturedIds) {
  const cards = capturedIds.map(cardOf);
  const hikari = cards.filter(c => c.type === "hikari");
  const tane = cards.filter(c => c.type === "tane");
  const tan = cards.filter(c => c.type === "tanzaku");
  const kasu = cards.filter(c => c.type === "kasu");
  const hasRain = hikari.some(c => c.rain);
  const has = id => capturedIds.includes(id);
  const list = [];

  if (hikari.length >= 5) {
    list.push({ key: "goko", name: "五光", pts: 10, desc: "光の札5枚すべて" });
  } else if (hikari.length === 4) {
    if (hasRain) list.push({ key: "ameshiko", name: "雨四光", pts: 7, desc: "雨(柳)を含む光4枚" });
    else list.push({ key: "shiko", name: "四光", pts: 8, desc: "雨(柳)を除く光4枚" });
  } else if (hikari.length === 3 && !hasRain) {
    list.push({ key: "sanko", name: "三光", pts: 5, desc: "雨(柳)を除く光3枚" });
  }

  if (has(9) && has(33)) list.push({ key: "hanami", name: "花見で一杯", pts: 5, desc: "桜に幕+菊に盃" });
  if (has(29) && has(33)) list.push({ key: "tsukimi", name: "月見で一杯", pts: 5, desc: "芒に月+菊に盃" });
  if (has(25) && has(37) && has(21)) list.push({ key: "inoshikacho", name: "猪鹿蝶", pts: 5, desc: "萩に猪+紅葉に鹿+牡丹に蝶" });

  const akatanIds = [2, 6, 10];
  const aotanIds = [22, 34, 38];
  const hasAkatan = akatanIds.every(has);
  const hasAotan = aotanIds.every(has);
  if (hasAkatan) list.push({ key: "akatan", name: "赤短", pts: 5, desc: "赤い短冊3枚" });
  if (hasAotan) list.push({ key: "aotan", name: "青短", pts: 5, desc: "青い短冊3枚" });
  if (hasAkatan && hasAotan) list.push({ key: "tanbonus", name: "赤短+青短ボーナス", pts: 10, desc: "両方そろうと大ボーナス" });

  if (tane.length >= 5) list.push({ key: "tane", name: `タネ(${tane.length}枚)`, pts: tane.length - 4, desc: "動物・生き物の札5枚以上" });
  if (tan.length >= 5) list.push({ key: "tanzaku", name: `タン(${tan.length}枚)`, pts: tan.length - 4, desc: "短冊の札5枚以上" });
  if (kasu.length >= 10) list.push({ key: "kasu", name: `カス(${kasu.length}枚)`, pts: kasu.length - 9, desc: "カス札10枚以上" });

  const total = list.reduce((s, y) => s + y.pts, 0);
  return { list, total };
}

/* ---------- 場との一致判定・獲得処理 ---------- */
function fieldMatches(round, cardId) {
  const m = cardOf(cardId).month;
  return round.field.filter(fid => cardOf(fid).month === m);
}

/* cardId(手札 or めくり札)を場に出す/取る処理
 * chosenFieldId: 場に同じ月が2枚あるときにどちらを取るか(未指定なら選択待ち)
 * 戻り値:
 *   { needChoice:true, matches }                 … 選択待ち
 *   { captured:false, cardId }                    … 場に置いた(一致なし)
 *   { captured:true, cardId, capturedIds:[...] }  … 獲得した
 */
function resolvePlay(round, cardId, chosenFieldId) {
  const matches = fieldMatches(round, cardId);
  if (matches.length === 0) {
    round.field.push(cardId);
    return { captured: false, cardId };
  }
  if (matches.length >= 3) {
    // 場に同じ月が3枚そろっていた場合は場の分を総取り
    matches.forEach(id => removeFrom(round.field, id));
    return { captured: true, cardId, capturedIds: [cardId, ...matches] };
  }
  if (matches.length === 2 && chosenFieldId == null) {
    return { needChoice: true, matches };
  }
  const target = matches.length === 1 ? matches[0] : chosenFieldId;
  removeFrom(round.field, target);
  return { captured: true, cardId, capturedIds: [cardId, target] };
}

/* ---------- 1局分の配札 ---------- */
function dealRound(curated) {
  let playerHand, cpuHand, field, deck;
  if (curated) {
    playerHand = curated.playerHand.slice();
    cpuHand = curated.cpuHand.slice();
    field = curated.field.slice();
    deck = curated.deck.slice();
  } else {
    const all = shuffle(CARDS.map(c => c.id));
    playerHand = all.slice(0, 8);
    cpuHand = all.slice(8, 16);
    field = all.slice(16, 24);
    deck = all.slice(24, 48);
  }
  return {
    deck, field,
    hands: { player: playerHand, cpu: cpuHand },
    captured: { player: [], cpu: [] },
    koikoi: { player: false, cpu: false },
    koikoiCount: { player: 0, cpu: 0 },
    yakuTotal: { player: 0, cpu: 0 },
    turn: null,
    finished: false,
    winner: null,      // 'player' | 'cpu' | 'draw'
    finalScore: 0,
    finalYaku: null,
    log: [],
  };
}

function isHandsEmpty(round) {
  return round.hands.player.length === 0 && round.hands.cpu.length === 0;
}

/* 直前と比べて役の合計点が上がったか(新しい役 or 役の枚数が増えた) */
function checkYakuProgress(round, who) {
  const y = computeYaku(round.captured[who]);
  if (y.total > round.yakuTotal[who]) {
    const prevTotal = round.yakuTotal[who];
    round.yakuTotal[who] = y.total;
    return { improved: true, yaku: y, prevTotal };
  }
  return { improved: false, yaku: y };
}

/* こいこい宣言 or 勝負確定 */
function declareKoikoi(round, who) {
  round.koikoi[who] = true;
  round.koikoiCount[who] += 1;
}

function settleWin(round, who) {
  const yaku = computeYaku(round.captured[who]);
  const multiplier = Math.pow(2, round.koikoiCount[who]);
  round.finished = true;
  round.winner = who;
  round.finalYaku = yaku;
  round.finalScore = yaku.total * multiplier;
  return round.finalScore;
}

function settleDraw(round) {
  round.finished = true;
  round.winner = "draw";
  round.finalScore = 0;
  round.finalYaku = null;
}

/* 手札と山札を使い切っても誰も「勝負」を選ばなかった場合の決着処理。
 * こいこいを宣言したまま終わった側がいれば、その時点の役でその人の勝ちにする。
 * 誰も役を作らなかった場合は引き分け(流れ)。 */
function settleAtHandExhaustion(round) {
  const pScore = round.koikoi.player ? round.yakuTotal.player * Math.pow(2, round.koikoiCount.player) : 0;
  const cScore = round.koikoi.cpu ? round.yakuTotal.cpu * Math.pow(2, round.koikoiCount.cpu) : 0;
  if (pScore === 0 && cScore === 0) { settleDraw(round); return; }
  if (pScore === cScore) { settleDraw(round); return; }
  const who = pScore > cScore ? "player" : "cpu";
  round.finished = true;
  round.winner = who;
  round.finalScore = who === "player" ? pScore : cScore;
  round.finalYaku = computeYaku(round.captured[who]);
}

/* ---------- 対局(複数局)の管理 ---------- */
function createMatch(mode, totalRounds) {
  return {
    mode,
    totalRounds: totalRounds || 6,
    round: 0,
    dealer: "player", // 親(次の局を先に配る側)。非親が先手
    scores: { player: 0, cpu: 0 },
    history: [],
    over: false,
    round_: null,
  };
}

function startNextRound(match, curated) {
  match.round += 1;
  const round = dealRound(curated);
  // 非親(子)が先手
  round.turn = match.dealer === "player" ? "cpu" : "player";
  match.round_ = round;
  return round;
}

function finishRoundAndAdvance(match, round) {
  if (round.winner === "player" || round.winner === "cpu") {
    match.scores[round.winner] += round.finalScore;
  }
  match.history.push({
    round: match.round,
    winner: round.winner,
    score: round.finalScore,
    yaku: round.finalYaku,
  });
  // 親を交代するルール: 親が勝ったら親継続、子が勝ったら子が次の親、引き分けなら親継続
  if (round.winner === "player" || round.winner === "cpu") {
    if (round.winner !== match.dealer) match.dealer = round.winner;
  }
  if (match.round >= match.totalRounds) match.over = true;
}
