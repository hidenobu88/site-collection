/* =========================================================
   서울골목 ソウル横丁 — common.js
   全ページ共通：言語切替 / モバイルナビ / スクロール出現
   ※ページ描画スクリプト（main.js / item.js）の後に読み込むこと
========================================================= */

/* ---------- 言語切替 ---------- */
const langToggle = document.getElementById("langToggle");
langToggle.addEventListener("click", () => {
  const next = document.body.dataset.lang === "ja" ? "ko" : "ja";
  document.body.dataset.lang = next;
  document.documentElement.lang = next;
  try { localStorage.setItem("sg-lang", next); } catch (_) {}
});
try {
  const urlLang = new URLSearchParams(location.search).get("lang");
  const saved = urlLang || localStorage.getItem("sg-lang");
  if (saved === "ko" || saved === "ja") {
    document.body.dataset.lang = saved;
    document.documentElement.lang = saved;
  }
} catch (_) {}

/* ---------- モバイルナビ ---------- */
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  burger.classList.toggle("is-open", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
  }
});

/* ---------- スクロール出現 ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add("is-visible");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
