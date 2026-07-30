/* =========================================================
 * Verse Lab — 共通スクリプト
 * ========================================================= */
(function(){
  "use strict";

  /* ---------- モバイルTOCドロワー ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var tocCol = document.querySelector(".toc-col");
  var overlay = document.querySelector(".toc-overlay");

  function openDrawer(){
    if(!tocCol) return;
    tocCol.classList.add("is-open");
    if(overlay) overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer(){
    if(!tocCol) return;
    tocCol.classList.remove("is-open");
    if(overlay) overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  if(menuBtn){
    menuBtn.addEventListener("click", function(){
      if(tocCol && tocCol.classList.contains("is-open")) closeDrawer();
      else openDrawer();
    });
  }
  if(overlay){ overlay.addEventListener("click", closeDrawer); }
  document.querySelectorAll(".toc-list a").forEach(function(a){
    a.addEventListener("click", function(){
      if(window.innerWidth <= 980) closeDrawer();
    });
  });

  /* ---------- 読了プログレスバー(ページ全体スクロール) ---------- */
  var progressBar = document.querySelector(".progress-bar");
  var tocProgressFill = document.querySelector(".toc-progress-fill");
  var tocProgressPct = document.querySelector(".toc-progress-pct");

  function updateProgress(){
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? Math.min(100, Math.max(0,(scrollTop/height)*100)) : 0;
    if(progressBar) progressBar.style.width = pct + "%";
    if(tocProgressFill) tocProgressFill.style.width = pct + "%";
    if(tocProgressPct) tocProgressPct.textContent = Math.round(pct) + "%";
  }
  window.addEventListener("scroll", updateProgress, {passive:true});
  updateProgress();

  /* ---------- 目次スクロールスパイ ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll(".chapter[id]"));
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc-list a"));

  if(sections.length && tocLinks.length && "IntersectionObserver" in window){
    var byId = {};
    tocLinks.forEach(function(l){
      var id = l.getAttribute("href").replace("#","");
      byId[id] = l;
    });
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.id;
        var link = byId[id];
        if(!link) return;
        if(entry.isIntersecting){
          tocLinks.forEach(function(l){ l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, {rootMargin:"-15% 0px -70% 0px", threshold:0});
    sections.forEach(function(s){ observer.observe(s); });
  }

  /* ---------- コードコピー ---------- */
  document.querySelectorAll(".copy-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      var block = btn.closest(".code-block");
      var codeEl = block ? block.querySelector("code") : null;
      if(!codeEl) return;
      var text = codeEl.innerText;
      var done = function(){
        var original = btn.innerHTML;
        btn.innerHTML = "✓ コピーしました";
        btn.classList.add("is-copied");
        setTimeout(function(){
          btn.innerHTML = original;
          btn.classList.remove("is-copied");
        }, 1600);
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(function(){
          fallbackCopy(text); done();
        });
      } else {
        fallbackCopy(text); done();
      }
    });
  });
  function fallbackCopy(text){
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); }catch(e){}
    document.body.removeChild(ta);
  }

  /* ---------- 折りたたみ(disclosure) ---------- */
  document.querySelectorAll(".disclosure-btn").forEach(function(btn){
    btn.addEventListener("click", function(){
      var wrap = btn.closest(".disclosure");
      var body = wrap.querySelector(".disclosure-body");
      var isOpen = wrap.classList.toggle("is-open");
      if(isOpen){
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = 0;
      }
    });
  });

  /* ---------- クイズ ---------- */
  document.querySelectorAll(".quiz").forEach(function(quiz){
    var choices = quiz.querySelectorAll(".quiz-choice");
    var explain = quiz.querySelector(".quiz-explain");
    choices.forEach(function(choice){
      choice.addEventListener("click", function(){
        var isCorrect = choice.getAttribute("data-correct") === "true";
        choices.forEach(function(c){ c.disabled = true; });
        if(isCorrect){
          choice.classList.add("correct");
          var mark = choice.querySelector(".qc-mark");
          if(mark) mark.textContent = "○";
        } else {
          choice.classList.add("wrong");
          var mark2 = choice.querySelector(".qc-mark");
          if(mark2) mark2.textContent = "×";
          var correctEl = quiz.querySelector('.quiz-choice[data-correct="true"]');
          if(correctEl){
            correctEl.classList.add("correct");
            var cm = correctEl.querySelector(".qc-mark");
            if(cm) cm.textContent = "○";
          }
        }
        if(explain) explain.classList.add("is-visible");
      });
    });
  });

  /* ---------- 簡易 Verse シンタックスハイライト ---------- */
  var KEYWORDS = ["var","set","if","else","for","loop","while","break","return","block",
    "class","struct","enum","interface","module","using","where","type","and","or","not",
    "true","false","case","first","defer","spawn","branch","race","rush","sync","await",
    "upon","when","batch","option","array","map","weak_map","super","live","then"];
  var TYPES = ["int","float","rational","string","logic","char","char32","void","any",
    "comparable","orderable","subtype","concrete_subtype","castable_subtype","tuple","task",
    "player","vector2","vector3","vector4","color"];

  function escapeHtml(str){
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function highlight(raw){
    // 文字列・コメント・その他をトークン化してエスケープ+装飾
    var tokens = [];
    var i = 0, n = raw.length;
    while(i < n){
      var ch = raw[i];
      // コメント
      if(ch === "#"){
        var j = raw.indexOf("\n", i);
        if(j === -1) j = n;
        tokens.push({t:"com", v:raw.slice(i,j)});
        i = j;
        continue;
      }
      // 文字列(補間 "{...}" はそのまま文字列色で扱う簡易版)
      if(ch === '"'){
        var j2 = i+1;
        while(j2 < n && raw[j2] !== '"'){
          if(raw[j2] === "\\") j2++;
          j2++;
        }
        j2 = Math.min(j2+1, n);
        tokens.push({t:"str", v:raw.slice(i,j2)});
        i = j2;
        continue;
      }
      // 数値
      if(/[0-9]/.test(ch)){
        var j3 = i;
        while(j3 < n && /[0-9.]/.test(raw[j3])) j3++;
        tokens.push({t:"num", v:raw.slice(i,j3)});
        i = j3;
        continue;
      }
      // 識別子
      if(/[A-Za-z_]/.test(ch)){
        var j4 = i;
        while(j4 < n && /[A-Za-z0-9_]/.test(raw[j4])) j4++;
        var word = raw.slice(i,j4);
        var lower = word;
        var followedByParen = raw[j4] === "(";
        if(KEYWORDS.indexOf(lower) !== -1){
          tokens.push({t:"kw", v:word});
        } else if(TYPES.indexOf(lower) !== -1){
          tokens.push({t:"type", v:word});
        } else if(followedByParen){
          tokens.push({t:"fn", v:word});
        } else {
          tokens.push({t:"plain", v:word});
        }
        i = j4;
        continue;
      }
      // 演算子・記号
      if("<>=+-*/?:.,{}[]()".indexOf(ch) !== -1){
        tokens.push({t:"op", v:ch});
        i++;
        continue;
      }
      // その他(空白等)
      var j5 = i;
      while(j5 < n && !/[A-Za-z0-9_"#<>=+\-*/?:.,{}\[\]()]/.test(raw[j5])) j5++;
      if(j5 === i) j5++;
      tokens.push({t:"plain", v:raw.slice(i,j5)});
      i = j5;
    }
    return tokens.map(function(tok){
      var esc = escapeHtml(tok.v);
      switch(tok.t){
        case "kw": return '<span class="tok-kw">'+esc+'</span>';
        case "type": return '<span class="tok-type">'+esc+'</span>';
        case "str": return '<span class="tok-str">'+esc+'</span>';
        case "num": return '<span class="tok-num">'+esc+'</span>';
        case "com": return '<span class="tok-com">'+esc+'</span>';
        case "fn": return '<span class="tok-fn">'+esc+'</span>';
        case "op": return '<span class="tok-op">'+esc+'</span>';
        default: return esc;
      }
    }).join("");
  }

  document.querySelectorAll("pre code.language-verse").forEach(function(codeEl){
    var raw = codeEl.textContent;
    codeEl.innerHTML = highlight(raw);
  });

})();
