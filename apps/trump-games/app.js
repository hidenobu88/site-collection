/* =========================================================
 * app.js — 画面遷移・モード/難易度選択・共通モーダル
 * ========================================================= */
(function (global) {
  "use strict";

  const MODE_INFO = {
    poker: { icon: "🂡", title: "ポーカー", desc: "5枚のカードを交換して役を作り、CPU2人と勝負する5カードドローポーカー。", start: (lv) => global.PokerGame.init(lv) },
    blackjack: { icon: "🂱", title: "ブラックジャック", desc: "カードの合計を21に近づけてディーラーに勝とう。ヒット・スタンド・ダブルダウンで勝負。", start: (lv) => global.BlackjackGame.init(lv) },
    daifugo: { icon: "👑", title: "大富豪", desc: "CPU3人と手札を出し合い、誰よりも早くカードを出し切ろう。8切り・革命あり。", start: (lv) => global.DaifugoGame.init(lv) },
    concentration: { icon: "🧠", title: "神経衰弱", desc: "裏向きのカードを2枚めくって同じ数字のペアを見つけよう。CPUの記憶力に注意！", start: (lv) => global.ConcentrationGame.init(lv) },
  };

  const LEVEL_DESC = {
    poker: {
      1: "初級: CPUはブラフが少なく素直にプレイ。勝ちやすい難易度です。",
      2: "中級: CPUは時々ブラフを仕掛けてきます。駆け引きを楽しもう。",
      3: "上級: CPUは積極的にブラフし、勝負どころの見極めも鋭くなります。",
    },
    blackjack: {
      1: "初級: ヒント表示ON。ディーラーはソフト17でスタンド(プレイヤー有利)。",
      2: "中級: ヒント非表示。ディーラーはソフト17でもヒットします。",
      3: "上級: ヒント非表示。ディーラーはソフト17でもヒット、気が抜けません。",
    },
    daifugo: {
      1: "初級: CPUはたまに変な手を選んだり、出せるのにパスすることも。",
      2: "中級: CPUは最小限の強さで着実に返してきます。",
      3: "上級: CPUはリード時にまとめて出し切るなど、効率よく手札を減らします。",
    },
    concentration: {
      1: "初級: カード16枚(8ペア)。CPUの記憶力は低め、ミスも多め。",
      2: "中級: カード26枚(13ペア)。CPUはそこそこ覚えています。",
      3: "上級: カード52枚(26ペア)。CPUはほぼ完璧に記憶、手強い！",
    },
  };

  const state = { mode: null, level: 2 };

  function el(id) { return document.getElementById(id); }
  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    window.scrollTo(0, 0);
  }

  function openSetup(mode) {
    state.mode = mode;
    const info = MODE_INFO[mode];
    el("setupIcon").textContent = info.icon;
    el("setupTitle").textContent = info.title;
    el("setupDesc").textContent = info.desc;
    document.querySelectorAll("#screen-setup .level-chip").forEach((chip) => {
      chip.classList.toggle("active", Number(chip.dataset.lv) === state.level);
    });
    el("levelDesc").textContent = LEVEL_DESC[mode][state.level];
    showScreen("screen-setup");
  }

  function startGame() {
    showScreen("screen-" + state.mode);
    MODE_INFO[state.mode].start(state.level);
  }

  /* ---------- 共通結果モーダル ---------- */
  const AppModal = {
    show(emoji, title, msg, primaryLabel, onPrimary) {
      el("modalEmoji").textContent = emoji;
      el("modalTitle").textContent = title;
      el("modalMsg").textContent = msg;
      const primaryBtn = el("modalPrimary");
      primaryBtn.textContent = primaryLabel;
      primaryBtn.onclick = onPrimary;
      el("resultModal").classList.add("show");
    },
    hide() { el("resultModal").classList.remove("show"); },
  };
  global.AppModal = AppModal;

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".mode-card").forEach((btn) => {
      btn.addEventListener("click", () => openSetup(btn.dataset.mode));
    });

    document.querySelectorAll("#screen-setup .level-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        state.level = Number(chip.dataset.lv);
        document.querySelectorAll("#screen-setup .level-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        el("levelDesc").textContent = LEVEL_DESC[state.mode][state.level];
      });
    });

    el("startBtn").addEventListener("click", startGame);

    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const nav = btn.dataset.nav;
        if (nav === "home") showScreen("screen-home");
        else if (nav === "setup") openSetup(btn.dataset.mode || state.mode);
      });
    });

    el("modalSecondary").addEventListener("click", () => {
      AppModal.hide();
      showScreen("screen-home");
    });

    showScreen("screen-home");
  });
})(window);
