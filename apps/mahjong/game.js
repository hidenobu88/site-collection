/* =========================================================
 * game.js — 麻雀 虎の間
 *   対局進行 / CPU思考 / UI描画
 *   （Node 環境ではヘッドレス自動対局が可能：テスト用）
 * ========================================================= */
"use strict";

const M = (typeof MJ !== "undefined") ? MJ : require("./core.js");
const HEADLESS = (typeof document === "undefined");
/* ?demo 付きで開くと4人ともCPUの観戦モード（スクリーンショット・動作確認用） */
const DEMO = !HEADLESS && /[?&]demo/.test(location.search);

/* ---------- 設定 ---------- */
const settings = {
  level: "mid",     /* weak | mid | strong */
  length: "east",   /* east(東風) | half(半荘) */
  sound: true,
};

const LEVEL_INFO = {
  weak: { kanji: "弱", name: "のんびり", desc: "初心者向け。ゆるい打ち筋" },
  mid: { kanji: "中", name: "しっかり", desc: "手作り重視の標準AI" },
  strong: { kanji: "強", name: "ガチ", desc: "受け入れ計算と守備も行う" },
};

const CPU_NAMES = ["竹田", "梅園", "松風"];

function loadSettings() {
  if (HEADLESS) return;
  try {
    const s = JSON.parse(localStorage.getItem("tora-mahjong-settings"));
    if (s) {
      if (s.level) settings.level = s.level;
      if (s.length) settings.length = s.length;
      if (typeof s.sound === "boolean") settings.sound = s.sound;
    }
  } catch (e) { }
}
function saveSettings() {
  if (HEADLESS) return;
  try { localStorage.setItem("tora-mahjong-settings", JSON.stringify(settings)); } catch (e) { }
}

/* ---------- サウンド ---------- */
let audioCtx = null;
function beep(freq, dur, delay, type, gain) {
  const t0 = audioCtx.currentTime + (delay || 0);
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type || "triangle";
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain || 0.08, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}
function playSnd(kind) {
  if (HEADLESS || !settings.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    switch (kind) {
      case "discard": beep(1400, 0.05, 0, "square", 0.045); break;
      case "draw": beep(900, 0.03, 0, "square", 0.02); break;
      case "call": beep(620, 0.09, 0, "triangle", 0.1); beep(830, 0.12, 0.08, "triangle", 0.1); break;
      case "riichi": beep(523, 0.12, 0, "triangle", 0.11); beep(784, 0.2, 0.1, "triangle", 0.11); break;
      case "win": [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.22, i * 0.09, "triangle", 0.1)); break;
      case "draw-end": beep(440, 0.18, 0, "triangle", 0.08); beep(392, 0.26, 0.16, "triangle", 0.08); break;
    }
  } catch (e) { }
}

/* ---------- 状態 ---------- */
const game = {
  players: [],
  wall: [],
  deadWallDora: [],
  deadWallUra: [],
  rinshanTiles: [],
  kanCount: 0,
  dealer: 0,
  turnSeat: 0,
  roundWind: 0,   /* 0=東 1=南 */
  kyoku: 1,
  honba: 0,
  sticks: 0,      /* 供託リーチ棒 */
  anyCall: false,
  lastDisc: null, /* {seat, idx} */
  running: false,
};
const players = game.players;

const ui = { pending: null, selId: null };

function sleep(ms) {
  if (HEADLESS) return Promise.resolve();
  return new Promise(r => setTimeout(r, ms));
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function seatWindOf(p) { return (p.seat - game.dealer + 4) % 4; }
function sortHand(hand) {
  hand.sort((a, b) => (a.kind - b.kind) || (a.red ? 1 : 0) - (b.red ? 1 : 0));
}

/* ---------- プレイヤー初期化 ---------- */
function initPlayers() {
  players.length = 0;
  for (let s = 0; s < 4; s++) {
    players.push({
      seat: s,
      isHuman: s === 0 && !HEADLESS && !DEMO,
      name: s === 0 ? "あなた" : CPU_NAMES[s - 1],
      level: settings.level,
      score: 25000,
      hand: [], melds: [], river: [],
      discKinds: new Set(), passedKinds: new Set(),
      drawn: null,
      riichi: false, doubleRiichi: false, ippatsu: false,
      riichiPending: false, tempFuriten: false, riichiFuriten: false,
    });
  }
}

/* ---------- 配牌 ---------- */
function setupHand() {
  const tiles = [];
  let id = 0;
  for (let k = 0; k < 34; k++) {
    for (let i = 0; i < 4; i++) {
      const red = (k === 4 || k === 13 || k === 22) && i === 0; /* 赤5 各1枚 */
      tiles.push({ id: id++, kind: k, red });
    }
  }
  shuffle(tiles);
  game.deadWallDora = tiles.splice(0, 5);
  game.deadWallUra = tiles.splice(0, 5);
  game.rinshanTiles = tiles.splice(0, 4);
  game.wall = tiles;
  game.kanCount = 0;
  game.anyCall = false;
  game.lastDisc = null;
  for (const p of players) {
    p.hand = [];
    for (let i = 0; i < 13; i++) p.hand.push(game.wall.pop());
    sortHand(p.hand);
    p.melds = []; p.river = [];
    p.discKinds = new Set(); p.passedKinds = new Set();
    p.drawn = null;
    p.riichi = false; p.doubleRiichi = false; p.ippatsu = false;
    p.riichiPending = false; p.tempFuriten = false; p.riichiFuriten = false;
  }
  game.turnSeat = game.dealer;
}

function revealedDora() { return game.deadWallDora.slice(0, game.kanCount + 1); }
function revealedUra() { return game.deadWallUra.slice(0, game.kanCount + 1); }

function visibleCounts(p) {
  const c = new Array(34).fill(0);
  for (const t of p.hand) c[t.kind]++;
  for (const q of players) {
    for (const r of q.river) if (!r.taken) c[r.tile.kind]++;
    for (const m of q.melds) for (const t of m.tiles) c[t.kind]++;
  }
  for (const d of revealedDora()) c[d.kind]++;
  return c;
}

/* ---------- 和了評価ヘルパー ---------- */
function meldsForEval(p) { return p.melds.map(m => ({ type: m.type, k: m.k, tiles: m.tiles })); }

function evalTsumo(p, opts) {
  const drawn = p.drawn;
  if (!drawn) return null;
  const handTiles = p.hand.filter(t => t.id !== drawn.id);
  const first = p.river.length === 0 && !game.anyCall && p.melds.length === 0;
  return M.evaluate({
    handTiles, melds: meldsForEval(p), winTile: drawn,
    tsumo: true, riichi: p.riichi, doubleRiichi: p.doubleRiichi, ippatsu: p.ippatsu,
    rinshan: !!opts.rinshan, haitei: !!opts.haitei, houtei: false,
    tenhou: first && p.seat === game.dealer && !opts.rinshan,
    chiihou: first && p.seat !== game.dealer && !opts.rinshan,
    seatWind: seatWindOf(p), roundWind: game.roundWind,
    doraInd: revealedDora(), uraInd: revealedUra(),
  });
}

function evalRon(p, tile, houtei) {
  return M.evaluate({
    handTiles: p.hand, melds: meldsForEval(p), winTile: tile,
    tsumo: false, riichi: p.riichi, doubleRiichi: p.doubleRiichi, ippatsu: p.ippatsu,
    rinshan: false, haitei: false, houtei: !!houtei,
    tenhou: false, chiihou: false,
    seatWind: seatWindOf(p), roundWind: game.roundWind,
    doraInd: revealedDora(), uraInd: revealedUra(),
  });
}

function waitsOfPlayer(p) {
  return M.waitsOf(M.countsOf(p.hand), p.melds.length);
}

function isNaturalFuriten(p, waits) {
  for (const w of waits) if (p.discKinds.has(w)) return true;
  return false;
}

function canRon(p, tile, houtei) {
  const waits = waitsOfPlayer(p);
  if (!waits.includes(tile.kind)) return false;
  if (isNaturalFuriten(p, waits)) return false;
  if (p.tempFuriten || p.riichiFuriten) return false;
  return evalRon(p, tile, houtei) != null;
}

function isMenzen(p) { return p.melds.every(m => m.type === "ankan"); }

function riichiCandidates(p) {
  /* 手牌14枚からリーチ可能な打牌（種類）一覧 */
  const res = [];
  const counts = M.countsOf(p.hand);
  const seen = new Set();
  for (const t of p.hand) {
    if (seen.has(t.kind)) continue;
    seen.add(t.kind);
    counts[t.kind]--;
    if (M.waitsOf(counts, p.melds.length).length > 0) res.push(t.kind);
    counts[t.kind]++;
  }
  return res;
}

function kanOptions(p) {
  if (!p.drawn || game.wall.length === 0 || game.kanCount >= 4) return [];
  const counts = M.countsOf(p.hand);
  const res = [];
  if (p.riichi) {
    /* リーチ中はツモった牌の暗槓のみ、かつ待ちが変わらない場合 */
    const dk = p.drawn.kind;
    if (counts[dk] === 4) {
      const c13 = counts.slice(); c13[dk]--;
      const before = M.waitsOf(c13, p.melds.length).join(",");
      const c10 = counts.slice(); c10[dk] = 0;
      const after = M.waitsOf(c10, p.melds.length + 1).join(",");
      if (before === after && before.length > 0) res.push({ type: "ankan", k: dk });
    }
    return res;
  }
  for (let k = 0; k < 34; k++) if (counts[k] === 4) res.push({ type: "ankan", k });
  for (const m of p.melds) {
    if (m.type === "pon" && counts[m.k] >= 1) res.push({ type: "shomin", k: m.k });
  }
  return res;
}

function cancelIppatsu() { for (const p of players) p.ippatsu = false; }

/* ---------- 牌の移動 ---------- */
function performKan(p, v) {
  cancelIppatsu();
  game.anyCall = true;
  game.kanCount++;
  if (v.type === "ankan") {
    const tiles = [];
    for (let i = p.hand.length - 1; i >= 0; i--) {
      if (p.hand[i].kind === v.k) tiles.push(p.hand.splice(i, 1)[0]);
    }
    p.melds.push({ type: "ankan", k: v.k, tiles, from: p.seat });
  } else {
    const meld = p.melds.find(m => m.type === "pon" && m.k === v.k);
    const idx = p.hand.findIndex(t => t.kind === v.k);
    meld.tiles.push(p.hand.splice(idx, 1)[0]);
    meld.type = "minkan";
  }
  p.drawn = null;
  showBanner(p.seat, "カン");
  playSnd("call");
  renderAll();
}

function doDiscard(p, tile, riichiFlag) {
  const idx = p.hand.findIndex(t => t.id === tile.id);
  p.hand.splice(idx, 1);
  sortHand(p.hand);
  if (p.riichi) p.ippatsu = false; /* リーチ後の打牌で一発消滅 */
  p.drawn = null;
  p.river.push({ tile, rot: !!riichiFlag });
  p.discKinds.add(tile.kind);
  game.lastDisc = { seat: p.seat, idx: p.river.length - 1 };
  if (riichiFlag) p.riichiPending = true;
}

function applyMeldClaim(claim, discSeat, tile) {
  const p = players[claim.seat];
  const dp = players[discSeat];
  dp.river[dp.river.length - 1].taken = true;
  game.lastDisc = null;
  cancelIppatsu();
  game.anyCall = true;

  const takeOfKind = (kind, n) => {
    const taken = [];
    /* 赤はなるべく手に残す（和了時に活きるように非赤から使う） */
    const idxs = [];
    p.hand.forEach((t, i) => { if (t.kind === kind) idxs.push(i); });
    idxs.sort((a, b) => (p.hand[a].red ? 1 : 0) - (p.hand[b].red ? 1 : 0));
    const use = idxs.slice(0, n).sort((a, b) => b - a);
    for (const i of use) taken.push(p.hand.splice(i, 1)[0]);
    return taken;
  };

  let label = "";
  if (claim.type === "pon") {
    const t2 = takeOfKind(tile.kind, 2);
    p.melds.push({ type: "pon", k: tile.kind, tiles: [...t2, tile], from: discSeat });
    label = "ポン";
  } else if (claim.type === "kan") {
    const t3 = takeOfKind(tile.kind, 3);
    p.melds.push({ type: "minkan", k: tile.kind, tiles: [...t3, tile], from: discSeat });
    game.kanCount++;
    label = "カン";
  } else {
    const a = takeOfKind(claim.tiles[0], 1);
    const b = takeOfKind(claim.tiles[1], 1);
    const k = Math.min(tile.kind, claim.tiles[0], claim.tiles[1]);
    p.melds.push({ type: "chi", k, tiles: [tile, ...a, ...b], from: discSeat });
    label = "チー";
  }
  showBanner(claim.seat, label);
  playSnd("call");
}

/* ---------- CPU 思考 ---------- */
function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function aiDefensiveDiscard(p, genbutsuOnly) {
  const threats = players.filter(q => q !== p && q.riichi);
  if (threats.length === 0) return null;
  const sh = M.shanten(M.countsOf(p.hand), p.melds.length);
  if (sh <= 0) return null;                       /* テンパイなら押す */
  if (sh === 1 && Math.random() < 0.55) return null;
  const vis = visibleCounts(p);
  let best = null, bestD = Infinity;
  for (const t of p.hand) {
    let d = 0;
    for (const q of threats) d = Math.max(d, dangerOf(t.kind, q, vis));
    if (d < bestD) { bestD = d; best = t; }
  }
  if (genbutsuOnly && bestD > 0.01) return null;
  return best;
}

function dangerOf(k, q, vis) {
  if (q.discKinds.has(k) || q.passedKinds.has(k)) return 0;
  if (M.isHonor(k)) {
    const v = vis[k];
    return v >= 3 ? 0.3 : v === 2 ? 1.3 : 2.6;
  }
  const n = (k % 9) + 1;
  const safe = kk => q.discKinds.has(kk) || q.passedKinds.has(kk);
  let suji = false;
  if (n <= 3) suji = safe(k + 3);
  else if (n >= 7) suji = safe(k - 3);
  else suji = safe(k - 3) && safe(k + 3);
  let d = n === 1 || n === 9 ? 3 : n === 2 || n === 8 ? 4.2 : 5.5;
  if (suji) d -= 2;
  return d;
}

function aiChooseDiscard(p) {
  const level = p.level;
  const meldN = p.melds.length;

  if (level === "weak") {
    if (Math.random() < 0.25) return randomOf(p.hand);
    /* 孤立している牌から捨てるだけの簡易評価 */
    const c = M.countsOf(p.hand);
    let best = null, bestS = Infinity;
    for (const t of p.hand) {
      const k = t.kind;
      let s = (c[k] - 1) * 4;
      if (k < 27) {
        if (k % 9 > 0) s += c[k - 1] * 2;
        if (k % 9 < 8) s += c[k + 1] * 2;
        if (k % 9 > 1) s += c[k - 2];
        if (k % 9 < 7) s += c[k + 2];
        s += 1.5 - Math.abs(5 - (k % 9 + 1)) * 0.25;
      }
      s += Math.random() * 2.5;
      if (s < bestS) { bestS = s; best = t; }
    }
    return best;
  }

  /* 中・強：シャンテン数最小化 + 受け入れ枚数 */
  if (level === "strong") {
    const def = aiDefensiveDiscard(p, false);
    if (def) return def;
  } else {
    const def = aiDefensiveDiscard(p, true);
    if (def && Math.random() < 0.6) return def;
  }

  const counts = M.countsOf(p.hand);
  const vis = level === "strong" ? visibleCounts(p) : null;
  const doraSet = new Set(revealedDora().map(t => M.nextDora(t.kind)));
  let best = null, bestSh = 99, bestScore = -Infinity;
  const seen = new Set();
  for (const t of p.hand) {
    const key = t.kind * 2 + (t.red ? 1 : 0);
    if (seen.has(key)) continue;
    seen.add(key);
    counts[t.kind]--;
    const sh = M.shanten(counts, meldN);
    let score = 0;
    if (sh <= bestSh) {
      let uke = 0;
      for (let k = 0; k < 34; k++) {
        const inHand = counts[k];
        /* vis には捨てる牌 t 自身も含まれている（捨てても見えている枚数は同じ） */
        const rem = 4 - (vis ? vis[k] : inHand + (k === t.kind ? 1 : 0));
        if (rem <= 0 || inHand >= 4) continue;
        counts[k]++;
        if (M.shanten(counts, meldN) < sh) uke += rem;
        counts[k]--;
      }
      score = uke;
      if (level === "strong") {
        if (doraSet.has(t.kind)) score -= 4;
        if (t.red) score -= 5;
        if (M.isHonor(t.kind)) score += 0.5; /* 字牌は早めに処理 */
      }
    }
    if (sh < bestSh || (sh === bestSh && score > bestScore)) {
      bestSh = sh; bestScore = score; best = t;
    }
    counts[t.kind]++;
  }
  return best || randomOf(p.hand);
}

function chooseRiichiKind(p, candidates) {
  if (p.level === "weak") return randomOf(candidates);
  const counts = M.countsOf(p.hand);
  const vis = visibleCounts(p);
  let best = candidates[0], bestN = -1;
  for (const k of candidates) {
    counts[k]--;
    const waits = M.waitsOf(counts, p.melds.length);
    let n = 0;
    for (const w of waits) n += Math.max(0, 4 - vis[w]);
    if (waits.includes(k)) n -= 100; /* 自分で切った牌を待つフリテンリーチは避ける */
    counts[k]++;
    if (n > bestN) { bestN = n; best = k; }
  }
  return best;
}

function isYakuhaiKind(p, k) {
  return M.isDragon(k) || k === M.EAST + seatWindOf(p) || k === M.EAST + game.roundWind;
}

function aiWantsPon(p, tile) {
  const level = p.level;
  const yakuhai = isYakuhaiKind(p, tile.kind);
  if (level === "weak") return yakuhai && Math.random() < 0.45;
  if (yakuhai) return true;
  if (level !== "strong") return false;
  /* 強：断么九方向の有効なポンだけ拾う */
  if (M.isYaochu(tile.kind)) return false;
  const yaoInHand = p.hand.filter(t => M.isYaochu(t.kind)).length;
  const hasYakuhaiPon = p.melds.some(m => m.type !== "chi" && isYakuhaiKind(p, m.k));
  if (yaoInHand > 2 && !hasYakuhaiPon && p.melds.length === 0) return false;
  const before = M.shanten(M.countsOf(p.hand), p.melds.length);
  const c = M.countsOf(p.hand); c[tile.kind] -= 2;
  const after = M.shanten(c, p.melds.length + 1);
  return after < before && after <= 2;
}

function aiWantsChi(p, tile, options) {
  if (p.level !== "strong") return null;
  if (M.isYaochu(tile.kind) && Math.random() < 0.7) return null;
  const yaoInHand = p.hand.filter(t => M.isYaochu(t.kind)).length;
  const hasYakuhaiPon = p.melds.some(m => m.type !== "chi" && isYakuhaiKind(p, m.k));
  /* 鳴いて役が残る見込み（断么九 or 役牌ポン済み）のみ */
  if (!hasYakuhaiPon && (yaoInHand > 1 || M.isYaochu(tile.kind))) return null;
  const before = M.shanten(M.countsOf(p.hand), p.melds.length);
  let best = null, bestAfter = 99;
  for (const o of options) {
    if (!hasYakuhaiPon && (M.isYaochu(o[0]) || M.isYaochu(o[1]))) continue;
    const c = M.countsOf(p.hand); c[o[0]]--; c[o[1]]--;
    const after = M.shanten(c, p.melds.length + 1);
    if (after < before && after < bestAfter) { bestAfter = after; best = o; }
  }
  return bestAfter <= 1 ? best : null;
}

function aiWantsKanDraw(p, v) {
  /* ツモ番での暗槓・加槓判断 */
  if (p.riichi) return true; /* kanOptions 側で待ち不変を保証済み */
  if (p.level === "weak" && Math.random() < 0.5) return false;
  if (v.type === "shomin") return true;
  const counts = M.countsOf(p.hand);
  const before = M.shanten(counts, p.melds.length);
  const c = counts.slice(); c[v.k] = 0;
  const after = M.shanten(c, p.melds.length + 1);
  return after <= before;
}

/* ---------- 手番処理 ---------- */
async function takeTurn(p, drawn, rinshan) {
  const haitei = game.wall.length === 0 && !rinshan;
  const winRes = drawn ? evalTsumo(p, { rinshan, haitei }) : null;

  if (p.isHuman) {
    if (p.riichi) {
      if (winRes) { await sleep(350); return { act: "tsumo", rinshan, haitei }; }
      const kans = kanOptions(p);
      if (kans.length > 0) {
        const c = await waitHuman({ type: "riichi-kan", kan: kans[0] });
        if (c.a === "kan") { performKan(p, kans[0]); return { act: "kan" }; }
      }
      await sleep(420);
      return { act: "discard", tile: drawn, riichi: false };
    }
    while (true) {
      const kans = kanOptions(p);
      const canRiichi = drawn && isMenzen(p) && !p.riichi && p.score >= 1000 &&
        game.wall.length >= 4 && riichiCandidates(p).length > 0;
      const c = await waitHuman({ type: "turn", canTsumo: !!winRes, kans, canRiichi });
      if (c.a === "tsumo" && winRes) return { act: "tsumo", rinshan, haitei };
      if (c.a === "kan") { performKan(p, c.variant); return { act: "kan" }; }
      if (c.a === "riichi") {
        const cands = riichiCandidates(p);
        const c2 = await waitHuman({ type: "turn", riichiMode: true, candidateKinds: cands });
        if (c2.a === "cancel") continue;
        const tile = p.hand.find(t => t.id === c2.id);
        return { act: "discard", tile, riichi: true };
      }
      if (c.a === "discard") {
        const tile = p.hand.find(t => t.id === c.id);
        if (tile) return { act: "discard", tile, riichi: false };
      }
    }
  }

  /* ---- CPU ---- */
  await sleep(rinshan ? 350 : 300 + Math.random() * 380);
  if (winRes) return { act: "tsumo", rinshan, haitei };

  const kans = kanOptions(p);
  if (kans.length > 0 && aiWantsKanDraw(p, kans[0])) {
    performKan(p, kans[0]);
    return { act: "kan" };
  }

  if (p.riichi) return { act: "discard", tile: drawn, riichi: false };

  /* リーチ判断 */
  if (drawn && isMenzen(p) && p.score >= 1000 && game.wall.length >= 4) {
    const cands = riichiCandidates(p);
    if (cands.length > 0) {
      const kind = chooseRiichiKind(p, cands);
      const tile = p.hand.find(t => t.kind === kind && !t.red) || p.hand.find(t => t.kind === kind);
      return { act: "discard", tile, riichi: true };
    }
  }

  return { act: "discard", tile: aiChooseDiscard(p), riichi: false };
}

/* ---------- 鳴き・ロンの解決 ---------- */
function chiOptionsFor(p, kind) {
  if (kind >= 27) return [];
  const counts = M.countsOf(p.hand);
  const n = kind % 9;
  const opts = [];
  const has = k => k >= 0 && k < 27 && M.suitOf(k) === M.suitOf(kind) && counts[k] > 0;
  if (n >= 2 && has(kind - 2) && has(kind - 1)) opts.push([kind - 2, kind - 1]);
  if (n >= 1 && n <= 7 && has(kind - 1) && has(kind + 1)) opts.push([kind - 1, kind + 1]);
  if (n <= 6 && has(kind + 1) && has(kind + 2)) opts.push([kind + 1, kind + 2]);
  return opts;
}

async function resolveClaims(discSeat, tile) {
  const houtei = game.wall.length === 0;
  const ronable = [];
  const claims = { pon: null, kan: null, chi: null };
  const humanOpts = { ron: false, pon: false, kan: false, chi: [] };

  for (let off = 1; off <= 3; off++) {
    const s = (discSeat + off) % 4;
    const p = players[s];
    if (canRon(p, tile, houtei)) ronable.push(s);
    if (!houtei && !p.riichi) {
      const cnt = p.hand.filter(t => t.kind === tile.kind).length;
      if (cnt >= 2) { if (p.isHuman) humanOpts.pon = true; else if (!claims.pon && aiWantsPon(p, tile)) claims.pon = { type: "pon", seat: s }; }
      if (cnt >= 3 && game.kanCount < 4 && game.wall.length > 0 && p.isHuman) humanOpts.kan = true;
      if (off === 1) {
        const opts = chiOptionsFor(p, tile.kind);
        if (opts.length) {
          if (p.isHuman) humanOpts.chi = opts;
          else {
            const sel = aiWantsChi(p, tile, opts);
            if (sel) claims.chi = { type: "chi", seat: s, tiles: sel };
          }
        }
      }
    }
  }
  humanOpts.ron = ronable.includes(0) && players[0].isHuman;

  /* 人間の選択 */
  let humanChoice = null;
  if (humanOpts.ron || humanOpts.pon || humanOpts.kan || humanOpts.chi.length) {
    humanChoice = await waitHuman({ type: "claim", opts: humanOpts, tileKind: tile.kind });
    if (humanChoice.a === "pass" && humanOpts.ron) {
      const hp = players[0];
      hp.tempFuriten = true;
      if (hp.riichi) hp.riichiFuriten = true;
    }
  }

  /* ロン（頭ハネ：放銃者から近い順で1人） */
  for (let off = 1; off <= 3; off++) {
    const s = (discSeat + off) % 4;
    if (!ronable.includes(s)) continue;
    if (players[s].isHuman) {
      if (humanChoice && humanChoice.a === "ron") return { type: "ron", seat: s };
      continue;
    }
    return { type: "ron", seat: s };
  }

  /* ポン・カン */
  if (humanChoice && humanChoice.a === "kan" && humanOpts.kan) return { type: "kan", seat: 0 };
  if (humanChoice && humanChoice.a === "pon" && humanOpts.pon) return { type: "pon", seat: 0 };
  if (claims.pon) return claims.pon;

  /* チー */
  if (humanChoice && humanChoice.a === "chi") return { type: "chi", seat: 0, tiles: humanChoice.tiles };
  if (claims.chi) return claims.chi;

  return null;
}

/* ---------- 局の進行 ---------- */
async function playHand() {
  setupHand();
  renderAll();
  playSnd("draw");
  await sleep(500);

  let cur = game.dealer;
  let needDraw = true;
  let rinshan = false;

  while (true) {
    const p = players[cur];
    game.turnSeat = cur;
    let drawn = null;

    if (needDraw) {
      if (rinshan) {
        drawn = game.rinshanTiles.pop();
        game.wall.shift(); /* 王牌の補充分 */
      } else {
        if (game.wall.length === 0) return await handleRyuukyoku();
        drawn = game.wall.pop();
      }
      p.hand.push(drawn);
      p.drawn = drawn;
      p.tempFuriten = false;
      renderAll();
      if (p.isHuman) playSnd("draw");
      await sleep(p.isHuman ? 120 : 40);
    }

    const res = await takeTurn(p, needDraw ? drawn : null, rinshan);
    rinshan = false;

    if (res.act === "tsumo") return await handleTsumo(p, res);
    if (res.act === "kan") { needDraw = true; rinshan = true; continue; }

    /* 打牌 */
    doDiscard(p, res.tile, res.riichi);
    if (res.riichi) { showBanner(p.seat, "リーチ！", true); playSnd("riichi"); }
    else playSnd("discard");
    renderAll();
    if (res.riichi) await sleep(650);

    const claim = await resolveClaims(cur, res.tile);

    if (claim && claim.type === "ron") {
      if (p.riichiPending) p.riichiPending = false; /* 宣言牌ロンはリーチ不成立 */
      return await handleRon(claim.seat, cur, res.tile);
    }

    /* リーチ成立 */
    if (p.riichiPending) {
      p.riichiPending = false;
      p.riichi = true;
      p.doubleRiichi = p.river.length === 1 && !game.anyCall;
      p.ippatsu = true;
      p.score -= 1000;
      game.sticks++;
      renderAll();
    }

    /* 通過した牌はリーチ者への安全牌 */
    for (const q of players) {
      if (q.riichi && q.seat !== cur) q.passedKinds.add(res.tile.kind);
    }

    if (claim) {
      applyMeldClaim(claim, cur, res.tile);
      renderAll();
      await sleep(450);
      cur = claim.seat;
      if (claim.type === "kan") { needDraw = true; rinshan = true; }
      else needDraw = false;
      continue;
    }

    cur = (cur + 1) % 4;
    needDraw = true;
  }
}

/* ---------- 和了・流局の処理 ---------- */
function scoreSnapshot() { return players.map(p => p.score); }

async function handleTsumo(p, opts) {
  const result = evalTsumo(p, opts);
  showBanner(p.seat, "ツモ");
  playSnd("win");
  await sleep(950);
  const before = scoreSnapshot();
  const isDealer = p.seat === game.dealer;
  const pay = M.payments(result, isDealer, true, game.honba);
  for (const q of players) {
    if (q === p) continue;
    q.score -= isDealer ? pay.tsumoEach : (q.seat === game.dealer ? pay.tsumoDealer : pay.tsumoOther);
  }
  p.score += pay.total + game.sticks * 1000;
  game.sticks = 0;
  renderAll();
  await showWinOverlay(p, p.drawn, result, pay, before, true);
  return { dealerKeeps: isDealer, draw: false };
}

async function handleRon(winSeat, discSeat, tile) {
  const p = players[winSeat];
  const result = evalRon(p, tile, game.wall.length === 0);
  showBanner(p.seat, "ロン");
  playSnd("win");
  await sleep(950);
  const before = scoreSnapshot();
  const isDealer = p.seat === game.dealer;
  const pay = M.payments(result, isDealer, false, game.honba);
  players[discSeat].score -= pay.ron;
  p.score += pay.ron + game.sticks * 1000;
  game.sticks = 0;
  renderAll();
  await showWinOverlay(p, tile, result, pay, before, false);
  return { dealerKeeps: isDealer, draw: false };
}

async function handleRyuukyoku() {
  playSnd("draw-end");
  showBanner(-1, "流局");
  await sleep(950);
  const before = scoreSnapshot();
  const tenpai = players.map(p => waitsOfPlayer(p).length > 0);
  const n = tenpai.filter(Boolean).length;
  if (n >= 1 && n <= 3) {
    const give = 3000 / (4 - n), get = 3000 / n;
    players.forEach((p, i) => { p.score += tenpai[i] ? get : -give; });
  }
  renderAll();
  await showRyuukyokuOverlay(tenpai, before);
  return { dealerKeeps: tenpai[game.dealer], draw: true };
}

/* ---------- 対局全体 ---------- */
function isFinalKyoku() {
  const lastWind = settings.length === "east" ? 0 : 1;
  return game.roundWind > lastWind ||
    (game.roundWind === lastWind && game.kyoku === 4);
}

async function runMatch() {
  game.running = true;
  initPlayers();
  game.roundWind = 0; game.kyoku = 1; game.honba = 0;
  game.sticks = 0; game.dealer = 0;

  while (true) {
    const outcome = await playHand();
    if (players.some(p => p.score < 0)) break; /* トビ終了 */
    if (outcome.dealerKeeps) {
      game.honba++;
    } else {
      if (isFinalKyoku()) break;
      game.honba = outcome.draw ? game.honba + 1 : 0;
      game.dealer = (game.dealer + 1) % 4;
      game.kyoku++;
      if (game.kyoku > 4) { game.kyoku = 1; game.roundWind++; }
    }
  }
  game.running = false;
  await showFinalOverlay();
}

/* =========================================================
 * UI
 * ========================================================= */
const $id = HEADLESS ? () => null : id => document.getElementById(id);

function waitHuman(data) {
  if (HEADLESS) {
    /* ヘッドレス時は人間が存在しないため到達しない想定だが保険 */
    return Promise.resolve({ a: "pass" });
  }
  return new Promise(resolve => {
    ui.pending = { data, resolve };
    ui.selId = null;
    renderHand();
    renderActions();
  });
}
function humanAct(action) {
  if (!ui.pending) return;
  const r = ui.pending.resolve;
  ui.pending = null;
  ui.selId = null;
  r(action);
  renderActions();
}

function tileHTML(t, cls, extra) {
  return `<div class="tile ${cls || ""}" ${extra || ""} title="${M.kindName(t.kind)}">${M.tileSVG(t.kind, t.red)}</div>`;
}
function backHTML(cls) { return `<div class="tile t-back ${cls || ""}"></div>`; }

function meldHTML(m, small) {
  let tiles;
  if (m.type === "ankan") {
    tiles = backHTML() + tileHTML(m.tiles[1]) + tileHTML(m.tiles[2]) + backHTML();
  } else {
    tiles = m.tiles.map(t => tileHTML(t)).join("");
  }
  return `<div class="meld">${tiles}</div>`;
}

function renderAll() {
  if (HEADLESS) return;
  renderBoard();
  renderHand();
  renderHint();
}

function renderBoard() {
  const board = $id("board");
  if (!board) return;
  let html = "";
  const POS = ["bottom", "right", "top", "left"];

  for (let s = 0; s < 4; s++) {
    const p = players[s];
    if (!p) continue;
    /* 河 */
    let river = "";
    p.river.forEach((r, i) => {
      if (r.taken) return;
      const isLast = game.lastDisc && game.lastDisc.seat === s && game.lastDisc.idx === i;
      river += `<div class="rv-slot${r.rot ? " rot" : ""}"><div class="tile${isLast ? " last pop" : ""}">${M.tileSVG(r.tile.kind, r.tile.red)}</div></div>`;
    });
    /* CPU 手牌（裏） */
    let oppo = "";
    if (s !== 0) {
      oppo = `<div class="oppo-hand">${backHTML().repeat(p.hand.length)}</div>`;
    }
    /* 副露（自分の分は手牌バーに出す） */
    let melds = "";
    if (s !== 0 && p.melds.length) {
      melds = `<div class="melds">${p.melds.map(m => meldHTML(m)).join("")}</div>`;
    }
    html += `<div class="seat s${s}"><div class="river">${river}</div>${oppo}${melds}</div>`;
  }

  /* 中央パネル */
  const windLabel = ["東", "南"][game.roundWind] || "東";
  let doraRow = "";
  const rev = revealedDora();
  for (let i = 0; i < 5; i++) {
    doraRow += i < rev.length ? tileHTML(rev[i]) : backHTML();
  }
  let seatInfos = "";
  for (let s = 0; s < 4; s++) {
    const p = players[s];
    if (!p) continue;
    const cls = [
      "seatinfo", "pos-" + POS[s],
      s === game.dealer ? "dealer" : "",
      s === game.turnSeat && game.running ? "active" : "",
      (p.riichi || p.riichiPending) ? "riichi" : "",
    ].join(" ");
    seatInfos += `<div class="${cls}">
      <span class="si-wind">${M.WIND_KANJI[seatWindOf(p)]}</span>
      <span class="si-body">
        <span class="si-name">${p.name}</span>
        <span class="si-score${p.score < 0 ? " minus" : ""}">${p.score}</span>
        <span class="si-riichi"></span>
      </span>
    </div>`;
  }
  html += `<div class="center">
    ${seatInfos}
    <div class="c-mid">
      <span class="round-label">${windLabel}${game.kyoku}局</span>
      <span class="round-sub"><span>${game.honba}本場</span><span>供託${game.sticks}</span><span>残${game.wall.length}</span></span>
      <div class="dora-row">${doraRow}</div>
      <span class="dora-label">ドラ</span>
    </div>
  </div>`;

  board.innerHTML = html;
}

function renderHand() {
  const bar = $id("handBar");
  if (!bar) return;
  const p = players[0];
  if (!p) { bar.innerHTML = ""; return; }

  const pend = ui.pending && ui.pending.data;
  const canDiscard = pend && pend.type === "turn";
  const riichiMode = canDiscard && pend.riichiMode;

  let melds = "";
  if (p.melds.length) {
    melds = `<div class="hand-melds">${p.melds.map(m => meldHTML(m)).join("")}</div>`;
  }

  let tiles = "";
  p.hand.forEach(t => {
    const isDrawn = p.drawn && t.id === p.drawn.id;
    let cls = "";
    if (isDrawn) cls += " tsumogiri-gap";
    const blocked = riichiMode && !pend.candidateKinds.includes(t.kind);
    if (blocked) cls += " dim";
    if (ui.selId === t.id) cls += " sel";
    tiles += `<div class="tile${cls}" data-id="${t.id}" title="${M.kindName(t.kind)}">${M.tileSVG(t.kind, t.red)}</div>`;
  });

  bar.innerHTML = `<div class="hand-tiles">${tiles}</div>${melds}`;

  bar.querySelectorAll(".hand-tiles .tile").forEach(el => {
    el.addEventListener("click", () => {
      const pend2 = ui.pending && ui.pending.data;
      if (!pend2 || pend2.type !== "turn") return;
      const id = Number(el.dataset.id);
      const t = p.hand.find(x => x.id === id);
      if (!t) return;
      if (pend2.riichiMode && !pend2.candidateKinds.includes(t.kind)) return;
      if (ui.selId === id) {
        humanAct({ a: "discard", id });
      } else {
        ui.selId = id;
        renderHand();
      }
    });
  });
}

function renderHint() {
  const row = $id("hintRow");
  if (!row) return;
  const p = players[0];
  if (!p || !p.isHuman || p.hand.length % 3 !== 1) { row.innerHTML = ""; return; }
  const waits = waitsOfPlayer(p);
  if (waits.length === 0) { row.innerHTML = ""; return; }
  const furiten = isNaturalFuriten(p, waits) || p.tempFuriten || p.riichiFuriten;
  let html = `<span class="chip tenpai">テンパイ</span><span class="wait-label">待ち</span><span class="wait-tiles">`;
  html += waits.map(k => `<div class="tile" title="${M.kindName(k)}">${M.tileSVG(k, false)}</div>`).join("");
  html += `</span>`;
  if (furiten) html += `<span class="chip furiten">フリテン</span>`;
  row.innerHTML = html;
}

function renderActions() {
  const bar = $id("actionBar");
  if (!bar) return;
  bar.innerHTML = "";
  const pend = ui.pending && ui.pending.data;
  if (!pend) return;

  const btn = (label, cls, action, innerHTML) => {
    const b = document.createElement("button");
    b.className = "abtn " + (cls || "");
    if (innerHTML) b.innerHTML = innerHTML; else b.textContent = label;
    b.addEventListener("click", () => humanAct(action));
    bar.appendChild(b);
  };

  if (pend.type === "turn") {
    if (pend.riichiMode) {
      btn("キャンセル", "ghost", { a: "cancel" });
      return;
    }
    if (pend.canTsumo) btn("ツモ", "primary", { a: "tsumo" });
    if (pend.canRiichi) btn("リーチ", "primary", { a: "riichi" });
    (pend.kans || []).forEach(v => {
      btn(`カン ${M.kindName(v.k)}`, "", { a: "kan", variant: v });
    });
    return;
  }

  if (pend.type === "riichi-kan") {
    btn(`カン ${M.kindName(pend.kan.k)}`, "primary", { a: "kan" });
    btn("スルー", "ghost", { a: "pass" });
    return;
  }

  if (pend.type === "claim") {
    const o = pend.opts;
    if (o.ron) btn("ロン", "danger", { a: "ron" });
    if (o.pon) btn("ポン", "", { a: "pon" });
    if (o.kan) btn("カン", "", { a: "kan" });
    o.chi.forEach(pair => {
      const inner = `チー <div class="tile">${M.tileSVG(pair[0], false)}</div><div class="tile">${M.tileSVG(pair[1], false)}</div>`;
      btn("", "variant", { a: "chi", tiles: pair }, inner);
    });
    btn("パス", "ghost", { a: "pass" });
    return;
  }
}

/* ---------- バナー ---------- */
function showBanner(seat, text, blue) {
  if (HEADLESS) return;
  const div = document.createElement("div");
  div.className = "banner" + (blue ? " blue" : "");
  const who = seat >= 0 && players[seat] ? players[seat].name : "";
  div.innerHTML = `${who ? `<span class="b-who">${who}</span>` : ""}${text}`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 950);
}

/* ---------- オーバーレイ ---------- */
function makeOverlay(html) {
  const root = $id("overlayRoot");
  const el = document.createElement("div");
  el.className = "ovl";
  el.innerHTML = `<div class="panel">${html}</div>`;
  root.appendChild(el);
  return el;
}

function windKyokuLabel() {
  return `${["東", "南"][game.roundWind] || "東"}${game.kyoku}局 ${game.honba}本場`;
}

function scoreDiffHTML(before) {
  let html = `<div class="score-diff">`;
  players.forEach((p, i) => {
    const d = p.score - before[i];
    const sign = d > 0 ? "+" : "";
    html += `<div class="sd-row${i === 0 ? " me" : ""}">
      <span>${p.name}</span>
      <span class="sd-delta ${d > 0 ? "plus" : d < 0 ? "minus" : ""}">${p.score}<small>（${sign}${d}）</small></span>
    </div>`;
  });
  return html + `</div>`;
}

function showWinOverlay(p, winTile, result, pay, before, tsumo) {
  if (HEADLESS) return Promise.resolve();
  return new Promise(resolve => {
    /* 手牌表示 */
    const concealed = p.hand.filter(t => !winTile || t.id !== winTile.id);
    sortHand(concealed);
    let handHtml = concealed.map(t => tileHTML(t)).join("");
    handHtml += `<div class="meld-sep"></div>` + tileHTML(winTile, "win-tile");
    for (const m of p.melds) handHtml += `<div class="meld-sep"></div>` + meldHTML(m);

    /* ドラ表示 */
    let doras = `<div class="grp"><span class="lbl">ドラ</span>${revealedDora().map(t => tileHTML(t)).join("")}</div>`;
    if (p.riichi) {
      doras += `<div class="grp"><span class="lbl">裏</span>${revealedUra().map(t => tileHTML(t)).join("")}</div>`;
    }

    let yakuRows = result.yakuList.map((y, i) =>
      `<div class="yaku-row" style="animation-delay:${i * 0.06}s"><span>${y.n}</span><span class="y-han">${typeof y.h === "number" ? y.h + "翻" : y.h}</span></div>`
    ).join("");

    const fuHan = result.yakuman ? "" : `${result.fu}符 ${result.han}翻`;
    const title = result.title ? `<span class="r-title">${result.title}</span>　` : "";
    const payText = tsumo ? `${pay.total}点（${pay.detail}）` : `${pay.total}点`;

    const el = makeOverlay(`
      <div class="res-head">
        <div class="res-type">${tsumo ? "ツモ" : "ロン"}</div>
        <div class="res-winner">${windKyokuLabel()}　${p.name} の和了</div>
      </div>
      <div class="res-hand">${handHtml}</div>
      <div class="res-doras">${doras}</div>
      <div class="yaku-list">${yakuRows}</div>
      <div class="res-total">${fuHan}　${title}<strong>${payText}</strong></div>
      ${scoreDiffHTML(before)}
      <div class="start-btn-row"><button class="big-btn" id="resNext">次へ</button></div>
    `);
    el.querySelector("#resNext").addEventListener("click", () => { el.remove(); resolve(); });
  });
}

function showRyuukyokuOverlay(tenpai, before) {
  if (HEADLESS) return Promise.resolve();
  return new Promise(resolve => {
    let rows = "";
    players.forEach((p, i) => {
      let tiles = "";
      if (tenpai[i] && i !== 0) {
        const h = p.hand.slice(); sortHand(h);
        tiles = h.map(t => tileHTML(t)).join("");
      } else if (tenpai[i]) {
        tiles = `<span style="font-size:11px;color:var(--text-dim)">待ち：${waitsOfPlayer(p).map(k => M.kindName(k)).join("・")}</span>`;
      }
      rows += `<div class="ryu-row">
        <span style="width:56px;font-weight:700">${p.name}</span>
        <span class="r-state ${tenpai[i] ? "ten" : "noten"}">${tenpai[i] ? "テンパイ" : "ノーテン"}</span>
        <span class="r-tiles">${tiles}</span>
      </div>`;
    });
    const el = makeOverlay(`
      <div class="res-head">
        <div class="res-type">流局</div>
        <div class="res-winner">${windKyokuLabel()}</div>
      </div>
      <div class="ryu-grid">${rows}</div>
      ${scoreDiffHTML(before)}
      <div class="start-btn-row"><button class="big-btn" id="resNext">次へ</button></div>
    `);
    el.querySelector("#resNext").addEventListener("click", () => { el.remove(); resolve(); });
  });
}

function showFinalOverlay() {
  if (HEADLESS) return Promise.resolve();
  return new Promise(resolve => {
    const order = players.slice().sort((a, b) => b.score - a.score || a.seat - b.seat);
    const myRank = order.findIndex(p => p.seat === 0) + 1;
    let rows = order.map((p, i) => `
      <div class="fr${i === 0 ? " first" : ""}${p.seat === 0 ? " me" : ""}" style="animation-delay:${i * 0.08}s">
        <span class="f-rank">${i + 1}位</span>
        <span class="f-name">${p.name}</span>
        <span class="f-score">${p.score}点</span>
      </div>`).join("");
    const msg = myRank === 1 ? "🏆 優勝おめでとうございます！" :
      myRank === 2 ? "2位！あと一歩でした" :
        myRank === 3 ? "3位。次は上を狙いましょう" : "4位…次こそリベンジ！";
    const el = makeOverlay(`
      <h2>対局終了</h2><span class="p-en">RESULT</span>
      <div class="final-rows">${rows}</div>
      <p style="text-align:center;font-size:14px;color:var(--text-dim)">${msg}</p>
      <div class="start-btn-row">
        <button class="big-btn" id="againBtn">もう一度対局する</button>
        <button class="big-btn sub" id="backBtn">設定を変える</button>
      </div>
    `);
    el.querySelector("#againBtn").addEventListener("click", () => { el.remove(); resolve(); runMatch(); });
    el.querySelector("#backBtn").addEventListener("click", () => { el.remove(); resolve(); showStartOverlay(); });
  });
}

/* ---------- スタート画面 ---------- */
function showStartOverlay() {
  const sampleTiles = [
    { kind: M.EAST, red: false }, { kind: 4, red: true },
    { kind: 31, red: false }, { kind: 32, red: false }, { kind: 33, red: false },
  ];
  const diffCards = Object.keys(LEVEL_INFO).map(key => {
    const d = LEVEL_INFO[key];
    return `<button class="diffcard${settings.level === key ? " sel" : ""}" data-level="${key}">
      <span class="d-kanji">${d.kanji}</span>
      <span class="d-name">${d.name}</span>
      <span class="d-desc">${d.desc}</span>
    </button>`;
  }).join("");
  const lenCards = [
    ["east", "東風戦", "東1〜4局・短時間でサクッと"],
    ["half", "半荘戦", "東+南の全8局・じっくり本格派"],
  ].map(([key, name, desc]) => `
    <button class="diffcard lencard${settings.length === key ? " sel" : ""}" data-length="${key}">
      <span class="d-kanji" style="font-size:18px">${name}</span>
      <span class="d-desc">${desc}</span>
    </button>`).join("");

  const el = makeOverlay(`
    <div class="start-logo">
      <span class="sl-main">麻雀</span>
      <span class="sl-sub">— 虎 の 間 —</span>
    </div>
    <div class="start-tiles">${sampleTiles.map(t => tileHTML(t)).join("")}</div>
    <p style="text-align:center;font-size:12px;color:var(--text-dim);line-height:1.8">
      CPU3人との四人打ち麻雀。リーチ・鳴き・ドラ・<br>符計算まで揃った本格ルールで遊べます。
    </p>
    <div class="opt-label">CPU の強さ</div>
    <div class="diff-grid">${diffCards}</div>
    <div class="opt-label">対局の長さ</div>
    <div class="len-grid">${lenCards}</div>
    <div class="start-btn-row">
      <button class="big-btn" id="startBtn">対局開始</button>
      <button class="big-btn sub" id="rulesBtn">ルール・遊び方</button>
    </div>
  `);
  el.querySelectorAll("[data-level]").forEach(b => {
    b.addEventListener("click", () => {
      settings.level = b.dataset.level; saveSettings();
      el.querySelectorAll("[data-level]").forEach(x => x.classList.toggle("sel", x === b));
    });
  });
  el.querySelectorAll("[data-length]").forEach(b => {
    b.addEventListener("click", () => {
      settings.length = b.dataset.length; saveSettings();
      el.querySelectorAll("[data-length]").forEach(x => x.classList.toggle("sel", x === b));
    });
  });
  el.querySelector("#startBtn").addEventListener("click", () => {
    el.remove();
    playSnd("call");
    runMatch();
  });
  el.querySelector("#rulesBtn").addEventListener("click", showHelpOverlay);
}

function showHelpOverlay() {
  const el = makeOverlay(`
    <h2>ルール・遊び方</h2><span class="p-en">HOW TO PLAY</span>
    <div class="help-body">
      <h3>操作方法</h3>
      <p>・自分の番になったら、捨てたい牌を<strong>1回タップで選択、もう1回タップで捨てる</strong>ことができます。</p>
      <p>・ツモ／リーチ／ポン／チー／カン／ロンができるときは、画面下にボタンが表示されます。</p>
      <p>・リーチ後は自動でツモ切りされ、和了牌が来ると自動で和了します。</p>
      <h3>採用ルール</h3>
      <p>・東風戦（東1〜4局）／半荘戦（東+南）を選択可能</p>
      <p>・持ち点25000点・トビ（0点未満）終了あり</p>
      <p>・赤ドラ3枚（赤5萬・赤5筒・赤5索）／裏ドラ・カンドラあり（即めくり）</p>
      <p>・喰いタン・後付けあり／一発・ダブルリーチ・嶺上開花・海底/河底あり</p>
      <p>・流局時ノーテン罰符3000点・親テンパイで連荘・本場（+300点）あり</p>
      <p>・ロンは放銃者に近い1人のみ（頭ハネ）</p>
      <p>・簡略化のため 槍槓・流し満貫・途中流局・喰い替え制限 はありません</p>
      <h3>CPU の強さ</h3>
      <p><strong>弱</strong>：気ままな打ち筋。初めての方でも勝ちやすい相手です。</p>
      <p><strong>中</strong>：シャンテン数を意識してまっすぐ手を進めます。</p>
      <p><strong>強</strong>：受け入れ枚数・ドラ・安全牌まで考えて攻守を切り替えます。</p>
    </div>
    <div class="start-btn-row"><button class="big-btn sub" id="helpClose">閉じる</button></div>
  `);
  el.querySelector("#helpClose").addEventListener("click", () => el.remove());
}

function showConfirm(text) {
  return new Promise(resolve => {
    const el = makeOverlay(`
      <p style="text-align:center;font-size:14px;line-height:1.9;margin:8px 0 4px">${text}</p>
      <div class="start-btn-row">
        <button class="big-btn" id="okBtn">はい</button>
        <button class="big-btn sub" id="ngBtn">いいえ</button>
      </div>
    `);
    el.querySelector("#okBtn").addEventListener("click", () => { el.remove(); resolve(true); });
    el.querySelector("#ngBtn").addEventListener("click", () => { el.remove(); resolve(false); });
  });
}

/* ---------- 起動 ---------- */
if (!HEADLESS) {
  loadSettings();

  $id("soundBtn").classList.toggle("off", !settings.sound);
  $id("soundBtn").addEventListener("click", () => {
    settings.sound = !settings.sound;
    saveSettings();
    $id("soundBtn").classList.toggle("off", !settings.sound);
    playSnd("discard");
  });
  $id("helpBtn").addEventListener("click", showHelpOverlay);
  $id("restartBtn").addEventListener("click", async () => {
    if (!game.running) return;
    if (await showConfirm("対局を中断して、最初からやり直しますか？")) location.reload();
  });

  initPlayers();
  renderAll();
  if (DEMO) runMatch();
  else showStartOverlay();
}

/* ---------- Node テスト用エクスポート ---------- */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    game, players, settings,
    initPlayers, setupHand, playHand, runMatch,
    evalTsumo, evalRon, canRon, waitsOfPlayer, riichiCandidates,
    aiChooseDiscard, kanOptions, chiOptionsFor,
  };
}
