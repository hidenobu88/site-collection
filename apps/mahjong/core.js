/* =========================================================
 * core.js — 麻雀ルールエンジン
 *   牌の定義 / 牌画像(SVG) / シャンテン数 / 和了判定
 *   役判定 / 符計算 / 点数計算
 *   ※ DOM には依存しない（Node でもテスト可能）
 * ========================================================= */
"use strict";

const MJ = (() => {

  /* ---------- 牌の種類 ----------
   * 0-8   : 萬子 1-9
   * 9-17  : 筒子 1-9
   * 18-26 : 索子 1-9
   * 27-30 : 東 南 西 北
   * 31-33 : 白 發 中
   */
  const EAST = 27, SOUTH = 28, WEST = 29, NORTH = 30;
  const HAKU = 31, HATSU = 32, CHUN = 33;

  const NUM_KANJI = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const HONOR_KANJI = ["東", "南", "西", "北", "白", "發", "中"];
  const WIND_KANJI = ["東", "南", "西", "北"];

  function suitOf(k) { return k < 9 ? 0 : k < 18 ? 1 : k < 27 ? 2 : 3; } // 0萬 1筒 2索 3字
  function numOf(k) { return k < 27 ? (k % 9) + 1 : 0; }
  function isHonor(k) { return k >= 27; }
  function isTerminal(k) { return k < 27 && (k % 9 === 0 || k % 9 === 8); }
  function isYaochu(k) { return isHonor(k) || isTerminal(k); }
  function isDragon(k) { return k >= 31; }
  function isWind(k) { return k >= 27 && k <= 30; }

  function kindName(k) {
    if (k >= 27) return HONOR_KANJI[k - 27];
    const suit = ["萬", "筒", "索"][suitOf(k)];
    return NUM_KANJI[k % 27 % 9] + suit;
  }

  /* ドラ表示牌 → ドラ */
  function nextDora(k) {
    if (k < 27) { const s = suitOf(k) * 9; return s + ((k - s + 1) % 9); }
    if (k <= NORTH) return k === NORTH ? EAST : k + 1;
    return k === CHUN ? HAKU : k + 1;
  }

  /* ---------- 牌の SVG 描画 ----------
   * viewBox 60x84。数牌は実物風に描画、字牌は書体で表現。
   */
  const RED = "#c22f2f", BLUE = "#1c5d99", GREEN = "#1e7a3c", INK = "#232323";

  function svgText(x, y, size, fill, text, weight, family) {
    return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="middle" font-weight="${weight || 700}" font-family="${family || "'Shippori Mincho B1','Hiragino Mincho ProN',serif"}">${text}</text>`;
  }

  /* 筒子の丸配置（60x84 内） */
  const PIN_POS = {
    1: [[30, 42, 15]],
    2: [[30, 23, 10], [30, 61, 10]],
    3: [[16, 18, 8.5], [30, 42, 8.5], [44, 66, 8.5]],
    4: [[18, 22, 9], [42, 22, 9], [18, 62, 9], [42, 62, 9]],
    5: [[17, 20, 8], [43, 20, 8], [30, 42, 8], [17, 64, 8], [43, 64, 8]],
    6: [[18, 18, 7.5], [42, 18, 7.5], [18, 42, 7.5], [42, 42, 7.5], [18, 66, 7.5], [42, 66, 7.5]],
    7: [[13, 14, 6.5], [30, 19, 6.5], [47, 24, 6.5], [18, 46, 6.5], [42, 46, 6.5], [18, 68, 6.5], [42, 68, 6.5]],
    8: [[18, 14, 6.5], [42, 14, 6.5], [18, 33, 6.5], [42, 33, 6.5], [18, 52, 6.5], [42, 52, 6.5], [18, 71, 6.5], [42, 71, 6.5]],
    9: [[16, 16, 6.3], [30, 16, 6.3], [44, 16, 6.3], [16, 42, 6.3], [30, 42, 6.3], [44, 42, 6.3], [16, 68, 6.3], [30, 68, 6.3], [44, 68, 6.3]],
  };

  function pinCircle(x, y, r, color) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="none" stroke="#f6f1e3" stroke-width="${r * 0.22}"/>`;
  }

  /* 索子の棒配置：n 本の竹をレイアウト */
  const SOU_POS = {
    2: [[30, 22], [30, 62]],
    3: [[30, 20], [18, 62], [42, 62]],
    4: [[18, 22], [42, 22], [18, 62], [42, 62]],
    5: [[16, 20], [44, 20], [30, 42], [16, 64], [44, 64]],
    6: [[16, 22], [30, 22], [44, 22], [16, 62], [30, 62], [44, 62]],
    7: [[30, 16], [16, 42], [30, 42], [44, 42], [16, 68], [30, 68], [44, 68]],
    8: [[16, 16], [30, 16], [44, 16], [16, 42], [44, 42], [16, 68], [30, 68], [44, 68]],
    9: [[16, 18], [30, 18], [44, 18], [16, 42], [30, 42], [44, 42], [16, 66], [30, 66], [44, 66]],
  };

  function bamboo(x, y, color) {
    /* 竹1本（縦 18px） */
    return `<g transform="translate(${x},${y})">` +
      `<rect x="-2.6" y="-9" width="5.2" height="18" rx="2.4" fill="${color}"/>` +
      `<rect x="-3.6" y="-2" width="7.2" height="3.4" rx="1.6" fill="#f6f1e3"/>` +
      `<rect x="-3.4" y="-9.4" width="6.8" height="2.6" rx="1.3" fill="${color}"/>` +
      `</g>`;
  }

  function tileFace(kind, red) {
    const s = suitOf(kind);
    let inner = "";
    if (s === 0) { /* 萬子 */
      const numColor = red ? RED : INK;
      inner = svgText(30, 34, 30, numColor, NUM_KANJI[kind % 9]) + svgText(30, 72, 28, RED, "萬");
    } else if (s === 1) { /* 筒子 */
      const n = numOf(kind);
      if (red && n === 5) {
        inner = PIN_POS[5].map(p => pinCircle(p[0], p[1], p[2], RED)).join("");
      } else if (n === 1) {
        inner = `<circle cx="30" cy="42" r="17" fill="${RED}"/><circle cx="30" cy="42" r="11" fill="none" stroke="#f6f1e3" stroke-width="2.4"/><circle cx="30" cy="42" r="5" fill="#f6f1e3"/>`;
      } else {
        const colors = { 2: [BLUE, GREEN], 3: [BLUE, RED, GREEN] };
        inner = PIN_POS[n].map((p, i) => {
          let c = BLUE;
          if (n === 2) c = i === 0 ? GREEN : BLUE;
          else if (n === 3) c = [BLUE, RED, GREEN][i];
          else if (n === 5) c = i === 2 ? RED : BLUE;
          else if (n === 7) c = i < 3 ? GREEN : BLUE;
          else if (n === 9) c = i === 4 ? RED : (i % 3 === 1 ? GREEN : BLUE);
          return pinCircle(p[0], p[1], p[2], c);
        }).join("");
      }
    } else if (s === 2) { /* 索子 */
      const n = numOf(kind);
      if (n === 1) {
        /* 1索は孔雀風の意匠 */
        inner = `<g>` +
          `<path d="M30 22 C 20 26, 16 38, 20 50 C 23 58, 28 62, 30 66 C 32 62, 37 58, 40 50 C 44 38, 40 26, 30 22 Z" fill="${GREEN}"/>` +
          `<circle cx="30" cy="20" r="6" fill="${RED}"/>` +
          `<path d="M30 14 L 27 8 M30 14 L 33 8 M30 14 L 30 6" stroke="${RED}" stroke-width="2" stroke-linecap="round"/>` +
          `<circle cx="28" cy="19" r="1.2" fill="#f6f1e3"/>` +
          `<path d="M24 44 C 27 47, 33 47, 36 44" stroke="#f6f1e3" stroke-width="2" fill="none" stroke-linecap="round"/>` +
          `<path d="M30 66 L 24 76 M30 66 L 36 76" stroke="${GREEN}" stroke-width="2.6" stroke-linecap="round"/>` +
          `</g>`;
      } else if (red && n === 5) {
        inner = SOU_POS[5].map(p => bamboo(p[0], p[1], RED)).join("");
      } else {
        inner = SOU_POS[n].map((p, i) => {
          let c = GREEN;
          if (n === 5 && i === 2) c = RED;
          if (n === 7 && i === 0) c = RED;
          if (n === 9 && i === 4) c = RED;
          return bamboo(p[0], p[1], c);
        }).join("");
      }
    } else { /* 字牌 */
      const h = kind - 27;
      if (kind === HAKU) {
        inner = `<rect x="10" y="14" width="40" height="56" rx="4" fill="none" stroke="${BLUE}" stroke-width="3"/>`;
      } else {
        const color = kind === CHUN ? RED : kind === HATSU ? GREEN : INK;
        inner = svgText(30, 58, 44, color, HONOR_KANJI[h]);
      }
    }
    return `<svg viewBox="0 0 60 84" aria-hidden="true">${inner}</svg>`;
  }

  const faceCache = {};
  function tileSVG(kind, red) {
    const key = kind + (red ? "r" : "");
    if (!faceCache[key]) faceCache[key] = tileFace(kind, red);
    return faceCache[key];
  }

  /* ---------- カウント配列ユーティリティ ---------- */
  function countsOf(tiles) {
    const c = new Array(34).fill(0);
    for (const t of tiles) c[t.kind]++;
    return c;
  }

  /* ---------- シャンテン数 ---------- */
  function shantenStandard(counts, meldCount) {
    const c = counts.slice();
    let best = 8;
    function walk(i, sets, parts, hasPair) {
      while (i < 34 && c[i] === 0) i++;
      if (i === 34) {
        let total = sets + meldCount;
        let p = parts;
        if (total > 4) total = 4;
        if (total + p > 4) p = 4 - total;
        const sh = 8 - 2 * total - p - (hasPair ? 1 : 0);
        if (sh < best) best = sh;
        return;
      }
      if (best <= -1) return;
      /* 刻子 */
      if (c[i] >= 3) { c[i] -= 3; walk(i, sets + 1, parts, hasPair); c[i] += 3; }
      /* 順子 */
      if (i < 27 && i % 9 < 7 && c[i + 1] > 0 && c[i + 2] > 0) {
        c[i]--; c[i + 1]--; c[i + 2]--; walk(i, sets + 1, parts, hasPair); c[i]++; c[i + 1]++; c[i + 2]++;
      }
      /* ターツ（対子） */
      if (c[i] >= 2) { c[i] -= 2; walk(i, sets, parts + 1, hasPair); c[i] += 2; }
      /* ターツ（両面・辺張） */
      if (i < 27 && i % 9 < 8 && c[i + 1] > 0) { c[i]--; c[i + 1]--; walk(i, sets, parts + 1, hasPair); c[i]++; c[i + 1]++; }
      /* ターツ（嵌張） */
      if (i < 27 && i % 9 < 7 && c[i + 2] > 0) { c[i]--; c[i + 2]--; walk(i, sets, parts + 1, hasPair); c[i]++; c[i + 2]++; }
      /* この牌を使わない */
      const saved = c[i]; c[i] = 0; walk(i + 1, sets, parts, hasPair); c[i] = saved;
    }
    /* 雀頭を全候補で試す */
    for (let p = 0; p < 34; p++) {
      if (c[p] >= 2) { c[p] -= 2; walk(0, 0, 0, true); c[p] += 2; }
    }
    walk(0, 0, 0, false);
    return best;
  }

  function shantenChiitoi(counts) {
    let pairs = 0, kinds = 0;
    for (let i = 0; i < 34; i++) {
      if (counts[i] >= 1) kinds++;
      if (counts[i] >= 2) pairs++;
    }
    return 6 - pairs + Math.max(0, 7 - kinds);
  }

  function shantenKokushi(counts) {
    let kinds = 0, hasPair = false;
    for (let i = 0; i < 34; i++) {
      if (!isYaochu(i)) continue;
      if (counts[i] >= 1) kinds++;
      if (counts[i] >= 2) hasPair = true;
    }
    return 13 - kinds - (hasPair ? 1 : 0);
  }

  /* 総合シャンテン数（門前なら七対子・国士も考慮） */
  function shanten(counts, meldCount) {
    let s = shantenStandard(counts, meldCount);
    if (meldCount === 0) {
      s = Math.min(s, shantenChiitoi(counts), shantenKokushi(counts));
    }
    return s;
  }

  /* ---------- 和了形の判定・分解 ---------- */
  /* counts(計14枚相当) を 雀頭+面子 に分解。全パターンを返す */
  function decompose(counts) {
    const results = [];
    const c = counts.slice();
    for (let p = 0; p < 34; p++) {
      if (c[p] < 2) continue;
      c[p] -= 2;
      const sets = [];
      (function find(i) {
        while (i < 34 && c[i] === 0) i++;
        if (i === 34) { results.push({ pair: p, sets: sets.slice() }); return; }
        if (c[i] >= 3) { c[i] -= 3; sets.push({ t: "pon", k: i }); find(i); sets.pop(); c[i] += 3; }
        if (i < 27 && i % 9 < 7 && c[i + 1] > 0 && c[i + 2] > 0) {
          c[i]--; c[i + 1]--; c[i + 2]--; sets.push({ t: "chi", k: i }); find(i); sets.pop(); c[i]++; c[i + 1]++; c[i + 2]++;
        }
      })(0);
      c[p] += 2;
    }
    return results;
  }

  function isChiitoi(counts) {
    let pairs = 0;
    for (let i = 0; i < 34; i++) {
      if (counts[i] !== 0 && counts[i] !== 2) return false;
      if (counts[i] === 2) pairs++;
    }
    return pairs === 7;
  }

  function isKokushi(counts) {
    let hasPair = false;
    for (let i = 0; i < 34; i++) {
      if (counts[i] > 0 && !isYaochu(i)) return false;
      if (isYaochu(i)) {
        if (counts[i] === 0) return false;
        if (counts[i] === 2) hasPair = true;
        if (counts[i] > 2) return false;
      }
    }
    return hasPair;
  }

  /* 和了形か（counts は 14枚相当の手牌のみ、副露は meldCount で考慮不要：形だけ） */
  function isWinShape(counts, meldCount) {
    if (meldCount === 0 && (isChiitoi(counts) || isKokushi(counts))) return true;
    return decompose(counts).length > 0;
  }

  /* 待ち牌一覧（13枚相当の counts + 副露数） */
  function waitsOf(counts, meldCount) {
    const waits = [];
    for (let k = 0; k < 34; k++) {
      if (counts[k] >= 4) continue;
      counts[k]++;
      if (isWinShape(counts, meldCount)) waits.push(k);
      counts[k]--;
    }
    return waits;
  }

  /* ---------- 役・点数計算 ----------
   * opt: {
   *   handTiles  : 手牌（和了牌を含まない・門前部分のみ）の牌オブジェクト配列
   *   melds      : [{type:'chi'|'pon'|'ankan'|'minkan', k, tiles:[...]}]
   *   winTile    : 和了牌オブジェクト
   *   tsumo, riichi, doubleRiichi, ippatsu, rinshan, haitei, houtei,
   *   tenhou, chiihou,
   *   seatWind(0-3), roundWind(0-1),
   *   doraInd:[牌], uraInd:[牌]|null
   * }
   * 戻り値: null（役なし＝和了不可） or 結果オブジェクト
   */
  function evaluate(opt) {
    const melds = opt.melds || [];
    const menzen = melds.every(m => m.type === "ankan");
    const concealed = countsOf(opt.handTiles);
    concealed[opt.winTile.kind]++;

    /* 全使用牌（ドラ・清一色などの判定用）のカウント */
    const allCounts = concealed.slice();
    for (const m of melds) for (const t of m.tiles) allCounts[t.kind]++;

    /* 赤ドラ枚数 */
    let redCount = 0;
    for (const t of opt.handTiles) if (t.red) redCount++;
    if (opt.winTile.red) redCount++;
    for (const m of melds) for (const t of m.tiles) if (t.red) redCount++;

    const doraKinds = (opt.doraInd || []).map(t => nextDora(t.kind));
    const uraKinds = opt.riichi && opt.uraInd ? opt.uraInd.map(t => nextDora(t.kind)) : [];

    function doraHan() {
      let d = 0, u = 0;
      for (let k = 0; k < 34; k++) {
        for (const dk of doraKinds) if (k === dk) d += allCounts[k];
        for (const uk of uraKinds) if (k === uk) u += allCounts[k];
      }
      return { dora: d, ura: u, aka: redCount };
    }

    const candidates = [];

    /* --- 国士無双 --- */
    if (menzen && melds.length === 0 && isKokushi(concealed)) {
      candidates.push({ yakuman: [{ n: "国士無双", h: 13 }], yaku: [], fu: 30 });
    }

    /* --- 七対子系 --- */
    if (menzen && melds.length === 0 && isChiitoi(concealed)) {
      const yaku = [];
      if (opt.riichi) {
        if (opt.doubleRiichi) yaku.push({ n: "ダブルリーチ", h: 2 });
        else yaku.push({ n: "リーチ", h: 1 });
        if (opt.ippatsu) yaku.push({ n: "一発", h: 1 });
      }
      if (opt.tsumo) yaku.push({ n: "門前清自摸和", h: 1 });
      if (opt.haitei) yaku.push({ n: "海底摸月", h: 1 });
      if (opt.houtei) yaku.push({ n: "河底撈魚", h: 1 });
      yaku.push({ n: "七対子", h: 2 });
      const yakuman = [];
      if (opt.tenhou) yakuman.push({ n: "天和", h: 13 });
      if (opt.chiihou) yakuman.push({ n: "地和", h: 13 });
      let allHonor = true, allYao = true, allSimple = true;
      let suits = new Set();
      for (let k = 0; k < 34; k++) {
        if (concealed[k] === 0) continue;
        if (!isHonor(k)) { allHonor = false; suits.add(suitOf(k)); }
        if (!isYaochu(k)) allYao = false;
        if (isYaochu(k)) allSimple = false;
      }
      if (allHonor) yakuman.push({ n: "字一色", h: 13 });
      else {
        if (allYao) yaku.push({ n: "混老頭", h: 2 });
        if (allSimple) yaku.push({ n: "断么九", h: 1 });
        if (suits.size === 1) {
          let hasHonor = false;
          for (let k = 27; k < 34; k++) if (concealed[k]) hasHonor = true;
          yaku.push(hasHonor ? { n: "混一色", h: 3 } : { n: "清一色", h: 6 });
        }
      }
      candidates.push({ yakuman, yaku, fu: 25 });
    }

    /* --- 通常形（4面子1雀頭） --- */
    const decomps = decompose(concealed);
    for (const d of decomps) {
      /* 和了牌の所在パターンを列挙（符・暗刻数に影響） */
      const w = opt.winTile.kind;
      const placements = [];
      d.sets.forEach((s, idx) => {
        if (s.t === "pon" && s.k === w) placements.push({ set: idx, wait: "shanpon" });
        if (s.t === "chi" && w >= s.k && w <= s.k + 2) {
          let wait = "ryanmen";
          if (w === s.k + 1) wait = "kanchan";
          else if (w === s.k + 2 && s.k % 9 === 0) wait = "penchan";      /* 123 の 3 待ち */
          else if (w === s.k && s.k % 9 === 6) wait = "penchan";          /* 789 の 7 待ち */
          placements.push({ set: idx, wait });
        }
      });
      if (d.pair === w) placements.push({ set: -1, wait: "tanki" });
      if (placements.length === 0) placements.push({ set: -2, wait: "shanpon" }); /* 保険 */

      for (const pl of placements) {
        candidates.push(evalArrangement(d, pl, opt, melds, menzen, allCounts, concealed));
      }
    }

    if (candidates.length === 0) return null;

    /* 各候補にドラを加算して最良を選ぶ */
    const dh = doraHan();
    let best = null;
    for (const c of candidates) {
      if (!c) continue;
      let result;
      if (c.yakuman.length > 0) {
        result = {
          yakuman: true,
          yakuList: c.yakuman.map(y => ({ n: y.n, h: "役満" })),
          han: 13, fu: c.fu, doraDetail: null,
        };
      } else {
        if (c.yaku.length === 0) continue; /* 役なし */
        let han = c.yaku.reduce((a, y) => a + y.h, 0);
        const yakuList = c.yaku.map(y => ({ n: y.n, h: y.h }));
        if (dh.dora > 0) { yakuList.push({ n: "ドラ", h: dh.dora }); han += dh.dora; }
        if (dh.aka > 0) { yakuList.push({ n: "赤ドラ", h: dh.aka }); han += dh.aka; }
        if (dh.ura > 0) { yakuList.push({ n: "裏ドラ", h: dh.ura }); han += dh.ura; }
        result = { yakuman: false, yakuList, han, fu: c.fu };
      }
      if (!best || betterResult(result, best)) best = result;
    }
    if (!best) return null;

    best.base = basePoints(best);
    best.title = scoreTitle(best);
    return best;
  }

  function betterResult(a, b) {
    if (a.yakuman !== b.yakuman) return a.yakuman;
    const pa = basePoints(a), pb = basePoints(b);
    if (pa !== pb) return pa > pb;
    return a.han > b.han || (a.han === b.han && a.fu > b.fu);
  }

  /* 1つの分解＋和了牌配置について役と符を計算 */
  function evalArrangement(d, pl, opt, melds, menzen, allCounts, concealed) {
    /* 面子リストを統合（手牌側 + 副露） */
    const sets = [];
    d.sets.forEach((s, idx) => {
      let concealedSet = true;
      /* ロンで完成した刻子は明刻扱い */
      if (!opt.tsumo && pl.set === idx && s.t === "pon") concealedSet = false;
      sets.push({ t: s.t, k: s.k, open: false, kan: false, concealed: concealedSet });
    });
    for (const m of melds) {
      sets.push({
        t: m.type === "chi" ? "chi" : "pon",
        k: m.k,
        open: m.type !== "ankan",
        kan: m.type === "ankan" || m.type === "minkan",
        concealed: m.type === "ankan",
      });
    }
    const pair = d.pair;
    const waitType = pl.wait;
    const yaku = [];
    const yakuman = [];

    const runs = sets.filter(s => s.t === "chi");
    const trips = sets.filter(s => s.t === "pon");
    const ankoCount = trips.filter(s => s.concealed).length;
    const kanCount = sets.filter(s => s.kan).length;
    const seatWindKind = EAST + opt.seatWind;
    const roundWindKind = EAST + opt.roundWind;

    /* ===== 役満 ===== */
    if (opt.tenhou) yakuman.push({ n: "天和", h: 13 });
    if (opt.chiihou) yakuman.push({ n: "地和", h: 13 });
    if (ankoCount === 4) yakuman.push({ n: "四暗刻", h: 13 });
    if (trips.filter(s => isDragon(s.k)).length === 3) yakuman.push({ n: "大三元", h: 13 });
    {
      const windTrips = trips.filter(s => isWind(s.k)).length;
      if (windTrips === 4) yakuman.push({ n: "大四喜", h: 13 });
      else if (windTrips === 3 && isWind(pair)) yakuman.push({ n: "小四喜", h: 13 });
    }
    {
      let allHonor = true, allTermi = true;
      for (const s of sets) {
        if (s.t === "chi") { allHonor = false; allTermi = false; }
        else { if (!isHonor(s.k)) allHonor = false; if (!isTerminal(s.k)) allTermi = false; }
      }
      if (!isHonor(pair)) allHonor = false;
      if (!isTerminal(pair)) allTermi = false;
      if (allHonor) yakuman.push({ n: "字一色", h: 13 });
      if (allTermi) yakuman.push({ n: "清老頭", h: 13 });
    }
    {
      /* 緑一色：索子23468 + 發 */
      let green = true;
      const okKind = k => (k >= 19 && k <= 21) || k === 23 || k === 25 || k === HATSU;
      for (let k = 0; k < 34; k++) if (allCounts[k] > 0 && !okKind(k)) green = false;
      if (green) yakuman.push({ n: "緑一色", h: 13 });
    }
    if (kanCount === 4) yakuman.push({ n: "四槓子", h: 13 });
    if (menzen && melds.length === 0) {
      /* 九蓮宝燈 */
      for (let s = 0; s < 3; s++) {
        const base = s * 9;
        let ok = true, sum = 0;
        for (let k = 0; k < 34; k++) {
          if (concealed[k] > 0 && (k < base || k >= base + 9)) { ok = false; break; }
        }
        if (!ok) continue;
        const need = [3, 1, 1, 1, 1, 1, 1, 1, 3];
        let extra = 0;
        for (let i = 0; i < 9; i++) {
          const diff = concealed[base + i] - need[i];
          if (diff < 0) { ok = false; break; }
          extra += diff;
        }
        if (ok && extra === 1) yakuman.push({ n: "九蓮宝燈", h: 13 });
      }
    }

    if (yakuman.length > 0) {
      return { yakuman, yaku: [], fu: 40 };
    }

    /* ===== 通常役 ===== */
    if (opt.riichi) {
      if (opt.doubleRiichi) yaku.push({ n: "ダブルリーチ", h: 2 });
      else yaku.push({ n: "リーチ", h: 1 });
      if (opt.ippatsu) yaku.push({ n: "一発", h: 1 });
    }
    if (menzen && opt.tsumo) yaku.push({ n: "門前清自摸和", h: 1 });

    /* 平和 */
    const pairIsYakuhai = isDragon(pair) || pair === seatWindKind || pair === roundWindKind;
    const pinfu = menzen && runs.length === 4 && !pairIsYakuhai && waitType === "ryanmen";
    if (pinfu) yaku.push({ n: "平和", h: 1 });

    /* 断么九 */
    {
      let allSimple = !isYaochu(pair);
      for (const s of sets) {
        if (s.t === "chi") { if (s.k % 9 === 0 || s.k % 9 === 6) allSimple = false; }
        else if (isYaochu(s.k)) allSimple = false;
      }
      if (allSimple) yaku.push({ n: "断么九", h: 1 });
    }

    /* 一盃口・二盃口（門前のみ） */
    if (menzen) {
      const runKinds = {};
      for (const s of runs) runKinds[s.k] = (runKinds[s.k] || 0) + 1;
      let peikoPairs = 0;
      for (const k in runKinds) peikoPairs += Math.floor(runKinds[k] / 2);
      if (peikoPairs === 2) yaku.push({ n: "二盃口", h: 3 });
      else if (peikoPairs === 1) yaku.push({ n: "一盃口", h: 1 });
    }

    /* 役牌 */
    for (const s of trips) {
      if (isDragon(s.k)) yaku.push({ n: "役牌 " + kindName(s.k), h: 1 });
      if (s.k === seatWindKind) yaku.push({ n: "自風 " + kindName(s.k), h: 1 });
      if (s.k === roundWindKind) yaku.push({ n: "場風 " + kindName(s.k), h: 1 });
    }

    /* 状況役 */
    if (opt.rinshan) yaku.push({ n: "嶺上開花", h: 1 });
    if (opt.haitei) yaku.push({ n: "海底摸月", h: 1 });
    if (opt.houtei) yaku.push({ n: "河底撈魚", h: 1 });

    /* 対々和 */
    if (trips.length === 4) yaku.push({ n: "対々和", h: 2 });

    /* 三暗刻 */
    if (ankoCount === 3) yaku.push({ n: "三暗刻", h: 2 });

    /* 三槓子 */
    if (kanCount === 3) yaku.push({ n: "三槓子", h: 2 });

    /* 三色同順 */
    {
      let found = false;
      for (let n = 0; n <= 6 && !found; n++) {
        const has = [false, false, false];
        for (const s of runs) if (s.k % 9 === n) has[suitOf(s.k)] = true;
        if (has[0] && has[1] && has[2]) found = true;
      }
      if (found) yaku.push({ n: "三色同順", h: menzen ? 2 : 1 });
    }

    /* 三色同刻 */
    {
      let found = false;
      for (let n = 0; n <= 8 && !found; n++) {
        const has = [false, false, false];
        for (const s of trips) if (!isHonor(s.k) && s.k % 9 === n) has[suitOf(s.k)] = true;
        if (has[0] && has[1] && has[2]) found = true;
      }
      if (found) yaku.push({ n: "三色同刻", h: 2 });
    }

    /* 一気通貫 */
    {
      let found = false;
      for (let su = 0; su < 3 && !found; su++) {
        const base = su * 9;
        const has = [false, false, false];
        for (const s of runs) {
          if (s.k === base) has[0] = true;
          if (s.k === base + 3) has[1] = true;
          if (s.k === base + 6) has[2] = true;
        }
        if (has[0] && has[1] && has[2]) found = true;
      }
      if (found) yaku.push({ n: "一気通貫", h: menzen ? 2 : 1 });
    }

    /* 混全帯么九・純全帯么九・混老頭 */
    {
      let allYaoSets = true, hasHonorTile = isHonor(pair), hasRun = runs.length > 0;
      let allYaoTiles = isYaochu(pair);
      for (const s of sets) {
        if (s.t === "chi") {
          if (!(s.k % 9 === 0 || s.k % 9 === 6)) allYaoSets = false;
        } else {
          if (!isYaochu(s.k)) allYaoSets = false;
          if (isHonor(s.k)) hasHonorTile = true;
        }
      }
      if (!isYaochu(pair)) allYaoSets = false;
      if (allYaoSets) {
        if (!hasRun) {
          /* 順子なし＝混老頭（対々和と複合） */
          yaku.push({ n: "混老頭", h: 2 });
        } else if (hasHonorTile) {
          yaku.push({ n: "混全帯么九", h: menzen ? 2 : 1 });
        } else {
          yaku.push({ n: "純全帯么九", h: menzen ? 3 : 2 });
        }
      }
    }

    /* 小三元 */
    if (trips.filter(s => isDragon(s.k)).length === 2 && isDragon(pair)) {
      yaku.push({ n: "小三元", h: 2 });
    }

    /* 混一色・清一色 */
    {
      const suits = new Set();
      let hasHonor = false;
      for (let k = 0; k < 34; k++) {
        if (allCounts[k] === 0) continue;
        if (isHonor(k)) hasHonor = true; else suits.add(suitOf(k));
      }
      if (suits.size === 1) {
        if (hasHonor) yaku.push({ n: "混一色", h: menzen ? 3 : 2 });
        else yaku.push({ n: "清一色", h: menzen ? 6 : 5 });
      }
    }

    /* ===== 符計算 ===== */
    let fu = 20;
    if (pinfu) {
      fu = opt.tsumo ? 20 : 30;
    } else {
      if (menzen && !opt.tsumo) fu += 10;
      if (opt.tsumo) fu += 2;
      for (const s of trips) {
        let f = isYaochu(s.k) ? 4 : 2;
        if (s.concealed) f *= 2;
        if (s.kan) f *= 4;
        fu += f;
      }
      if (isDragon(pair)) fu += 2;
      if (pair === seatWindKind) fu += 2;
      if (pair === roundWindKind) fu += 2;
      if (waitType === "kanchan" || waitType === "penchan" || waitType === "tanki") fu += 2;
      if (!menzen && fu === 20) fu = 30; /* 喰い平和形は30符 */
      fu = Math.ceil(fu / 10) * 10;
    }

    return { yakuman: [], yaku, fu };
  }

  /* 基本点 */
  function basePoints(r) {
    if (r.yakuman) return 8000;
    const h = r.han;
    if (h >= 13) return 8000;
    if (h >= 11) return 6000;
    if (h >= 8) return 4000;
    if (h >= 6) return 3000;
    return Math.min(2000, r.fu * Math.pow(2, 2 + h));
  }

  function scoreTitle(r) {
    if (r.yakuman) return "役満";
    const h = r.han;
    if (h >= 13) return "数え役満";
    if (h >= 11) return "三倍満";
    if (h >= 8) return "倍満";
    if (h >= 6) return "跳満";
    if (basePoints(r) === 2000) return "満貫";
    return "";
  }

  const ceil100 = x => Math.ceil(x / 100) * 100;

  /* 支払い計算
   * 戻り値: { total, from: [seatごとの支払い額(正)], detail:文字列 }
   */
  function payments(result, winnerIsDealer, tsumo, honba) {
    const base = result.base;
    if (tsumo) {
      if (winnerIsDealer) {
        const each = ceil100(base * 2) + honba * 100;
        return { tsumoEach: each, total: each * 3, detail: `${each - honba * 100}点オール` };
      }
      const dealerPay = ceil100(base * 2) + honba * 100;
      const otherPay = ceil100(base) + honba * 100;
      return { tsumoDealer: dealerPay, tsumoOther: otherPay, total: dealerPay + otherPay * 2, detail: `${otherPay - honba * 100}-${dealerPay - honba * 100}` };
    }
    const total = ceil100(base * (winnerIsDealer ? 6 : 4)) + honba * 300;
    return { ron: total, total, detail: "" };
  }

  return {
    EAST, SOUTH, WEST, NORTH, HAKU, HATSU, CHUN,
    WIND_KANJI, NUM_KANJI,
    suitOf, numOf, isHonor, isTerminal, isYaochu, isDragon, isWind,
    kindName, nextDora, tileSVG,
    countsOf, shanten, shantenStandard, shantenChiitoi, shantenKokushi,
    decompose, isChiitoi, isKokushi, isWinShape, waitsOf,
    evaluate, payments, basePoints,
  };
})();

/* Node テスト用 */
if (typeof module !== "undefined" && module.exports) module.exports = MJ;
