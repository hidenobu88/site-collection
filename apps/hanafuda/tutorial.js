/* =========================================================
 * tutorial.js — チュートリアル(れんしゅう)モード専用の配札とアドバイス
 *
 * 考え方:
 *  ・最初の手札と場は「必ず良い体験ができる」ように少しだけ仕込んである
 *    (プレイヤーの手札に、場と同じ月のカードをいくつか用意しておく)
 *  ・そのぶん CPU の手札と山札の前半は、じゃまが入らない安全な札にしてある
 *  ・とはいえ実際の進行はプレイヤーの選択とめくり運で変わるので、
 *    アドバイスは「今の盤面がどうなっているか」を見て、その場で判断して出す
 * ========================================================= */

/* 手札[3,5,13,17,21,25,31,35] × 場[4,7,15,19,23,27,32,36] は
 * すべて同じ月どうしのペアになっている(松・梅・藤・菖蒲・牡丹・萩・芒・菊)。
 * 5,13,17,21,25 はタネ札なので、全部そろえると「タネ」の役(5枚)が必ず完成する。 */
const TUTORIAL_DEAL = {
  playerHand: [3, 5, 13, 17, 21, 25, 31, 35],
  cpuHand: [9, 10, 11, 12, 37, 38, 41, 42],
  field: [4, 7, 15, 19, 23, 27, 32, 36],
  deck: [
    39, 40, 43, 44, 45, 46, 47, 48,          // 安全な札(前半にめくれる)
    1, 2, 6, 8, 14, 16, 18, 20,              // 残りの月の札(後半)
    22, 24, 26, 28, 29, 30, 33, 34,
  ],
};

function createTutorialGuide() {
  const seen = {};
  const once = (key, fn) => {
    if (seen[key]) return null;
    seen[key] = true;
    return fn();
  };

  return {
    seen,

    /* 対局が始まる前の導入スライド */
    introSlides: [
      {
        title: "花札(はなふだ)へようこそ！",
        text: "このゲームは「こいこい」という遊び方だよ。花札には1月から12月まで、季節の絵が描かれたカードが4枚ずつ、ぜんぶで48枚あるんだ。",
      },
      {
        title: "ルールはシンプル",
        text: "自分の手札(てふだ)と、真ん中の「場(ば)」にあるカードで、同じ「月」の絵をそろえて2枚1組で集めていくよ。集めたカードがたくさんになると「役(やく)」が完成して、得点になるんだ。",
      },
      {
        title: "1回の番でやること",
        text: "①手札から1枚出す(場に同じ月があれば取れる) → ②山札(やまふだ)から1枚めくる(これも同じ月があれば取れる) → ③相手の番へ。これをくり返すよ。",
      },
      {
        title: "さあ、やってみよう！",
        text: "光っているカードが「今そろえられるカード」だよ。まずはきみの番からスタート！ 困ったら画面下の花子先生のアドバイスを見てね。",
      },
    ],

    /* 今のプレイヤーの手札から、いちばんおすすめの手を探す(なければ null) */
    suggestHint(round) {
      if (round.turn !== "player") return null;
      for (const cardId of round.hands.player) {
        const matches = fieldMatches(round, cardId);
        if (matches.length > 0) return { cardId, fieldIds: matches };
      }
      return null;
    },

    /* イベントごとのアドバイス(初回だけ表示) */
    onFirstPlayerTurn() {
      return once("firstTurn", () => ({
        mood: "explain",
        text: "きみの番だよ。光っている手札があれば、場にも同じ月のカードがある証拠。クリックしてそろえてみよう！",
      }));
    },
    onFirstCapture(who) {
      return once("firstCapture", () => ({
        mood: "happy",
        text: who === "player"
          ? "やったね！2枚そろえて自分の「取り札」にできたよ。これがこのゲームの基本だよ。"
          : "相手が2枚そろえて取ったよ。同じ月のカードがそろうと、だれでも取れるルールなんだ。",
      }));
    },
    onFirstPlace() {
      return once("firstPlace", () => ({
        mood: "explain",
        text: "場に同じ月のカードが無かったから、出したカードはそのまま場に置かれたよ。これで場のカードが増えていくんだ。",
      }));
    },
    onFirstDraw() {
      return once("firstDraw", () => ({
        mood: "explain",
        text: "つぎは山札から1枚めくるよ。めくったカードも、場と同じ月ならその場で取れるよ！",
      }));
    },
    onFirstCpuTurn() {
      return once("firstCpuTurn", () => ({
        mood: "explain",
        text: "こんどはコンピューターの番。やることは同じで、手札を1枚出して→山札をめくる、をくり返すよ。",
      }));
    },
    onTaneBuilding(count) {
      if (count < 3) return null;
      return once("taneBuild", () => ({
        mood: "explain",
        text: "動物や植物が描かれた「タネ」の札が集まってきたね。同じ種類の札が5枚そろうと「役」になるよ！",
      }));
    },
    onYakuReached(yakuInfo) {
      const names = yakuInfo.list.map(y => y.name).join("・");
      return {
        mood: "yaku",
        title: "やくができたよ！",
        text: `「${names}」の役が完成！ 今やめると +${yakuInfo.total}点が確実に手に入るよ。`,
        text2: "「こいこい」と言ってつづけると、もっと役を増やして高得点をねらえる。でも、その間に相手が先に役を作ってしまうと、点数は相手のものになるから注意してね！",
      };
    },
    onRoundEnd(round) {
      if (round.winner === "draw") {
        return { mood: "explain", title: "この局はここまで", text: "だれも役を完成させられなかったので、この局は引き分け(流れ)。次の局も同じように遊べるよ。" };
      }
      const who = round.winner === "player" ? "きみ" : "コンピューター";
      return {
        mood: "happy",
        title: "この局は終了！",
        text: `${who}が ${round.finalScore}点 でこの局の勝ち！ 本番のゲームでは、これを何局かくり返して合計点を競うんだ。`,
      };
    },
    onTutorialComplete() {
      return {
        mood: "happy",
        title: "れんしゅう終了！おつかれさま",
        text: "これで花札(こいこい)の基本はバッチリだよ。役の一覧は「ルール説明」ページでいつでも見られるから、忘れても大丈夫。つぎは「弱」モードで実際に対戦してみよう！",
      };
    },
  };
}
