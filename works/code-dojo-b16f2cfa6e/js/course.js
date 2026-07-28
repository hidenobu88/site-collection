/* =========================================================
 * CODE DOJO — 講座ページ共通スクリプト
 * サイドバー開閉 / スクロールスパイ / 進捗保存 / コードコピー
 * ========================================================= */
(function () {
  "use strict";

  const body = document.body;
  const courseId = body.dataset.course || "course";
  const STORAGE_KEY = "codedojo:" + courseId + ":progress";

  /* ---------- 進捗の読み込み ---------- */
  function loadDone() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (e) {
      return new Set();
    }
  }
  function saveDone(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) { /* ignore */ }
  }

  const doneSet = loadDone();

  const allLessons = Array.from(document.querySelectorAll(".lesson[data-lesson-id]"));
  const totalCount = allLessons.length;

  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");

  function updateProgressUI() {
    const done = doneSet.size;
    const pct = totalCount ? Math.round((done / totalCount) * 100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressLabel) progressLabel.textContent = done + " / " + totalCount + " 完了";
  }

  function setLessonDone(id, isDone) {
    if (isDone) doneSet.add(id); else doneSet.delete(id);
    saveDone(doneSet);

    const btn = document.querySelector('.lesson-check-btn[data-lesson-id="' + cssEscape(id) + '"]');
    if (btn) {
      btn.classList.toggle("is-done", isDone);
      btn.querySelector(".box").textContent = isDone ? "✓" : "";
      btn.querySelector(".label").textContent = isDone ? "完了" : "完了にする";
    }
    const tocLink = document.querySelector('.toc-lessons a[data-lesson-id="' + cssEscape(id) + '"]');
    if (tocLink) {
      tocLink.classList.toggle("is-done", isDone);
      tocLink.querySelector(".toc-check").textContent = isDone ? "✓" : "";
    }
    updateProgressUI();
  }

  function cssEscape(s) {
    return String(s).replace(/["\\]/g, "\\$&");
  }

  /* 初期反映 */
  allLessons.forEach(function (lesson) {
    const id = lesson.dataset.lessonId;
    if (doneSet.has(id)) {
      const btn = lesson.querySelector(".lesson-check-btn");
      if (btn) {
        btn.classList.add("is-done");
        btn.querySelector(".box").textContent = "✓";
        btn.querySelector(".label").textContent = "完了";
      }
      const tocLink = document.querySelector('.toc-lessons a[data-lesson-id="' + cssEscape(id) + '"]');
      if (tocLink) {
        tocLink.classList.add("is-done");
        const chk = tocLink.querySelector(".toc-check");
        if (chk) chk.textContent = "✓";
      }
    }
  });
  updateProgressUI();

  /* チェックボタンのクリック */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".lesson-check-btn");
    if (!btn) return;
    const id = btn.dataset.lessonId;
    const isDone = !btn.classList.contains("is-done");
    setLessonDone(id, isDone);
  });

  /* ---------- サイドバー: モジュール開閉 ---------- */
  document.querySelectorAll(".toc-module-head").forEach(function (headBtn) {
    headBtn.addEventListener("click", function () {
      headBtn.closest(".toc-module").classList.toggle("is-open");
    });
  });

  /* ---------- サイドバー: モバイル時の開閉 ---------- */
  const menuBtn = document.getElementById("sidebarMenuBtn");
  const backdrop = document.getElementById("sidebarBackdrop");
  function openSidebar() { body.classList.add("sidebar-open"); }
  function closeSidebar() { body.classList.remove("sidebar-open"); }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      body.classList.contains("sidebar-open") ? closeSidebar() : openSidebar();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeSidebar);
  document.querySelectorAll(".toc-lessons a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 860px)").matches) closeSidebar();
    });
  });

  /* ---------- スクロールスパイ ---------- */
  const tocLinks = Array.from(document.querySelectorAll(".toc-lessons a[data-lesson-id]"));
  if ("IntersectionObserver" in window && allLessons.length) {
    let currentActive = null;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.dataset.lessonId;
          if (id === currentActive) return;
          currentActive = id;
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
          const link = document.querySelector('.toc-lessons a[data-lesson-id="' + cssEscape(id) + '"]');
          if (link) {
            link.classList.add("is-active");
            const mod = link.closest(".toc-module");
            if (mod) mod.classList.add("is-open");
            if (link.scrollIntoViewIfNeeded) link.scrollIntoViewIfNeeded();
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    allLessons.forEach(function (lesson) { observer.observe(lesson); });
  }

  /* ---------- コードコピー ---------- */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const block = btn.closest(".code-block");
    const codeEl = block && block.querySelector("pre code");
    if (!codeEl) return;
    const text = codeEl.textContent;
    const done = function () {
      btn.textContent = "コピー済み";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = "コピー";
        btn.classList.remove("copied");
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  });
  function fallbackCopy(text, cb) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
    cb();
  }
})();
