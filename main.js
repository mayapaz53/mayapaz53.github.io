/* Maya Paz — portfolio. Content comes from content.js (window.SITE). */
(function () {
  "use strict";

  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pad = function (n, l) { n = String(n); while (n.length < l) n = "0" + n; return n; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var bigScreen = function () {
    var saveData = navigator.connection && navigator.connection.saveData;
    return !saveData && window.innerWidth * (window.devicePixelRatio || 1) > 1600;
  };

  /* ------------------------------------------------------------------
     1. Fill the page from content.js
     ------------------------------------------------------------------ */
  var works = (S.works || []).filter(function (w) { return w && w.video; });

  $$("[data-role]").forEach(function (el) { if (S.role) el.textContent = S.role; });
  if (S.role) $(".intro__role .tag").textContent = S.role;
  if (S.name) {
    var parts = S.name.split(" ");
    var introLines = $$(".intro__title .line > span");
    var heroLines = $$(".hero__name [data-split]");
    if (parts.length >= 2) {
      introLines[0].textContent = heroLines[0].textContent = parts[0];
      introLines[1].textContent = heroLines[1].textContent = parts.slice(1).join(" ");
    }
  }
  $("[data-tagline]").textContent = S.tagline || "";

  // about
  var aboutTitle = $("[data-about-title]");
  var first = (S.name || "").split(" ")[0];
  var t = esc(S.aboutTitle || "");
  if (first && t.indexOf(first) > -1) t = t.replace(first, '<span class="hl">' + esc(first) + "</span>");
  aboutTitle.innerHTML = t;
  $("[data-about-text]").innerHTML = (S.aboutText || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  $("[data-tools]").innerHTML = (S.tools || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
  $("[data-focus]").innerHTML = (S.focus || []).map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");

  // contact
  if (S.email) {
    $("[data-mail]").href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Hi Maya!");
    $("[data-email-text]").textContent = S.email;
  }
  if (S.instagram) $("[data-insta]").href = "https://www.instagram.com/" + encodeURIComponent(S.instagram) + "/";
  $("[data-year]").textContent = new Date().getFullYear();

  // marquee
  var words = [S.role].concat(S.focus || [], S.tools || []).filter(Boolean);
  var chunk = words.map(function (w) { return "<span>" + esc(w) + " <i>✦</i></span>"; }).join("");
  $(".marquee__track").innerHTML = chunk + chunk + chunk + chunk;

  // split hero letters
  var ci = 0;
  $$(".hero__name [data-split]").forEach(function (el) {
    el.innerHTML = el.textContent.split("").map(function (c) {
      return '<span class="char" style="--i:' + (ci++) + '">' + (c === " " ? "&nbsp;" : esc(c)) + "</span>";
    }).join("");
  });

  // works grid
  var grid = $("[data-works]");
  var layout = works.map(function (_, i) { return i % 3 === 0; }); // wide, half, half, wide, ...
  // a lone half card on the last row becomes wide
  var halves = 0;
  layout.forEach(function (wide) { if (!wide) halves++; });
  if (halves % 2 === 1 && !layout[works.length - 1]) layout[works.length - 1] = true;

  grid.innerHTML = works.map(function (w, i) {
    var num = pad(i + 1, 2) + " / " + pad(works.length, 2);
    return '<article class="work reveal' + (layout[i] ? " work--wide" : "") + '" tabindex="0" role="button" data-i="' + i + '" aria-label="Play work ' + (i + 1) + (w.title ? ": " + esc(w.title) : "") + '">' +
      '<div class="work__media">' +
      (w.poster ? '<img src="' + esc(w.poster) + '" alt="" loading="lazy" decoding="async">' : "") +
      '<video muted loop playsinline preload="none" data-src="' + esc(w.video) + '"></video>' +
      '<div class="work__bar"><span class="work__idx">' + num + '</span><span class="work__cta">▶ Watch</span></div>' +
      "</div>" +
      (w.title ? '<h3 class="work__title">' + esc(w.title) + "</h3>" : "") +
      "</article>";
  }).join("");
  $("[data-count]").textContent = works.length + (works.length === 1 ? " work" : " works");

  /* ------------------------------------------------------------------
     2. Opening animation → fly into the eye
     ------------------------------------------------------------------ */
  var intro = $("#intro");
  var iv = $(".intro__video");
  var veil = $(".intro__veil");
  var frameEl = $(".intro__frame");
  var I = S.intro || {};
  var target = I.target || { x: 50, y: 50 };
  var entering = false, done = false;
  var bornAt = Date.now();

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  function objX() { return window.innerWidth / window.innerHeight < 1 ? 0.4 : 0.5; }
  function setObj() { intro.style.setProperty("--obj-x", objX() * 100 + "%"); }
  setObj();
  window.addEventListener("resize", setObj);

  if (I.poster) iv.poster = I.poster;
  iv.src = bigScreen() && I.videoHD ? I.videoHD : (I.video || "");
  iv.muted = true;
  var p = iv.play();
  if (p && p.catch) p.catch(function () { /* autoplay blocked – the tap will start it */ });

  iv.addEventListener("ended", function () { intro.classList.add("is-ready"); });
  iv.addEventListener("error", function () { useStill(); intro.classList.add("is-ready"); });

  (function tick() {
    if (done) return;
    if (!entering || iv.currentTime) frameEl.textContent = pad(Math.floor((iv.currentTime || 0) * 24) + 1, 3);
    requestAnimationFrame(tick);
  })();

  function useStill() {
    // show the final frame as an image (used if the video can't play)
    if (!I.lastFrame) return;
    iv.removeAttribute("src");
    iv.load();
    iv.poster = I.lastFrame;
  }

  function enter(fast) {
    if (entering || done) return;
    if (!fast && Date.now() - bornAt < 500) return; // ignore leftover scroll momentum
    entering = true;
    intro.classList.add("is-leaving");

    if (reduced) { finish(); return; }

    var dur = iv.duration;
    var playable = iv.readyState >= 2 && isFinite(dur) && dur > 0;
    if (!playable) { useStill(); setTimeout(zoom, 120); return; }

    var remain = dur - iv.currentTime;
    if (fast) {
      iv.pause();
      iv.currentTime = Math.max(0, dur - 0.04);
      onceOrTimeout(iv, "seeked", zoom, 600);
    } else if (remain > 0.12 && !iv.ended) {
      iv.playbackRate = Math.min(4, Math.max(1, remain / 1.1));
      var pp = iv.play();
      if (pp && pp.catch) pp.catch(function () { useStill(); zoom(); });
      onceOrTimeout(iv, "ended", zoom, (remain / iv.playbackRate) * 1000 + 900);
    } else {
      zoom();
    }
  }

  function onceOrTimeout(el, ev, fn, ms) {
    var fired = false;
    var go = function () { if (fired) return; fired = true; el.removeEventListener(ev, go); fn(); };
    el.addEventListener(ev, go);
    setTimeout(go, ms);
  }

  function eyePoint() {
    var W = window.innerWidth, H = window.innerHeight;
    var vw = iv.videoWidth || 1920, vh = iv.videoHeight || 1080;
    var s = Math.max(W / vw, H / vh);
    var rw = vw * s, rh = vh * s;
    var ox = (W - rw) * objX(), oy = (H - rh) * 0.5;
    return { x: ox + (target.x / 100) * rw, y: oy + (target.y / 100) * rh, W: W, H: H };
  }

  var ease = {
    inCubic: function (t) { return t * t * t; },
    inExpo: function (t) { return t === 0 ? 0 : Math.pow(2, 10 * t - 10); },
    outExpo: function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  };

  function animate(ms, fn, cb) {
    var t0 = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - t0) / ms);
      fn(t);
      if (t < 1) requestAnimationFrame(step); else if (cb) cb();
    })(t0);
  }

  function zoom() {
    var e = eyePoint();
    var diag = Math.hypot(e.W, e.H) * 1.1;
    iv.style.transformOrigin = e.x + "px " + e.y + "px";
    var maxScale = 26;

    // 1) camera pushes into the eye, the pupil (ink) swallows the screen
    animate(1500, function (t) {
      var s = 1 + (maxScale - 1) * ease.inExpo(t);
      iv.style.transform = "scale(" + s + ")";
      var k = Math.max(0, (t - 0.45) / 0.55);
      var r = diag * ease.inCubic(k);
      veil.style.opacity = 1;
      veil.style.background = "radial-gradient(circle at " + e.x + "px " + e.y + "px, #0B0B0C " + r + "px, rgba(11,11,12,0) " + (r + 2 + 40 * k) + "px)";
    }, function () {
      veil.style.background = "#0B0B0C";
      iv.pause();
      reveal(e, diag);
    });
  }

  // 2) the pupil opens: the site appears through a growing hole
  function reveal(e, diag) {
    intro.style.background = "transparent";
    $(".intro__stage").style.visibility = "hidden";
    html.classList.remove("is-intro");
    window.scrollTo(0, 0);
    startSite();
    animate(1100, function (t) {
      var r = diag * ease.outExpo(t) * 1.05;
      var m = "radial-gradient(circle at " + e.x + "px " + e.y + "px, transparent " + r + "px, #000 " + (r + 1) + "px)";
      intro.style.webkitMaskImage = m;
      intro.style.maskImage = m;
    }, finish);
  }

  function finish() {
    if (done) return;
    done = true;
    intro.classList.add("is-done");
    html.classList.remove("is-intro");
    if (reduced) startSite();
    try { iv.removeAttribute("src"); iv.load(); } catch (err) { /* noop */ }
  }

  var siteStarted = false;
  function startSite() {
    if (siteStarted) return;
    siteStarted = true;
    requestAnimationFrame(function () { html.classList.add("is-revealed"); });
    // hero peek video
    var peek = $(".hero__peek video");
    var pw = works[1] || works[0];
    if (peek && pw) { peek.src = pw.video; peek.play().catch(function () {}); }
  }

  // triggers
  intro.addEventListener("wheel", function (ev) { ev.preventDefault(); enter(false); }, { passive: false });
  intro.addEventListener("touchmove", function (ev) { ev.preventDefault(); enter(false); }, { passive: false });
  intro.addEventListener("click", function (ev) {
    if (ev.target.closest(".intro__skip")) return;
    if (iv.paused && !entering && iv.currentTime === 0) { var pr = iv.play(); if (pr && pr.catch) pr.catch(function () {}); }
    enter(false);
  });
  $(".intro__skip").addEventListener("click", function () { enter(true); });
  window.addEventListener("keydown", function (ev) {
    if (done || entering) return;
    if (["ArrowDown", "PageDown", " ", "Enter", "Spacebar"].indexOf(ev.key) > -1) { ev.preventDefault(); enter(false); }
    if (ev.key === "Escape") enter(true);
  });

  /* ------------------------------------------------------------------
     3. Scroll reveals + work videos that play when on screen
     ------------------------------------------------------------------ */
  $$(".section__head, .about__title, .about__text, .about__side, .contact__big, .contact__actions").forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); ro.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    $$(".reveal").forEach(function (el) { ro.observe(el); });

    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var card = en.target, v = $("video", card);
        if (en.isIntersecting && html.classList.contains("is-revealed")) {
          if (!v.src) v.src = v.getAttribute("data-src");
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else if (!en.isIntersecting) { v.pause(); }
      });
    }, { threshold: 0.35 });
    $$(".work").forEach(function (c) {
      vo.observe(c);
      $("video", c).addEventListener("playing", function () { c.classList.add("is-playing"); });
    });
    // re-check once the site is revealed (cards might already be visible)
    var mo = new MutationObserver(function () {
      if (html.classList.contains("is-revealed")) { mo.disconnect(); $$(".work").forEach(function (c) { vo.unobserve(c); vo.observe(c); }); }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ------------------------------------------------------------------
     4. Lightbox player
     ------------------------------------------------------------------ */
  var lb = $(".lightbox"), lbv = $(".lightbox__video"), cur = 0, lastFocus = null;
  function openLB(i) {
    cur = (i + works.length) % works.length;
    var w = works[cur];
    lbv.poster = w.poster || "";
    lbv.src = bigScreen() || window.innerWidth > 900 ? (w.videoHD || w.video) : w.video;
    $(".lightbox__count").textContent = pad(cur + 1, 2) + " / " + pad(works.length, 2);
    $(".lightbox__title").textContent = w.title || "";
    if (!lb.classList.contains("is-open")) lastFocus = document.activeElement;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    html.classList.add("is-locked");
    var pr = lbv.play(); if (pr && pr.catch) pr.catch(function () {});
    $(".lightbox__close").focus({ preventScroll: true });
  }
  function closeLB() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    html.classList.remove("is-locked");
    lbv.pause();
    setTimeout(function () { if (!lb.classList.contains("is-open")) { lbv.removeAttribute("src"); lbv.load(); } }, 400);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  grid.addEventListener("click", function (ev) { var c = ev.target.closest(".work"); if (c) openLB(+c.getAttribute("data-i")); });
  grid.addEventListener("keydown", function (ev) {
    var c = ev.target.closest(".work");
    if (c && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); openLB(+c.getAttribute("data-i")); }
  });
  $(".lightbox__close").addEventListener("click", closeLB);
  $(".lightbox__nav--prev").addEventListener("click", function () { openLB(cur - 1); });
  $(".lightbox__nav--next").addEventListener("click", function () { openLB(cur + 1); });
  lb.addEventListener("click", function (ev) { if (ev.target === lb) closeLB(); });
  window.addEventListener("keydown", function (ev) {
    if (!lb.classList.contains("is-open")) return;
    if (ev.key === "Escape") closeLB();
    if (ev.key === "ArrowRight") openLB(cur + 1);
    if (ev.key === "ArrowLeft") openLB(cur - 1);
  });
  // swipe on phones
  var sx = null;
  lb.addEventListener("touchstart", function (ev) { sx = ev.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (ev) {
    if (sx == null) return;
    var dx = ev.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 60) openLB(cur + (dx < 0 ? 1 : -1));
  });

  /* ------------------------------------------------------------------
     5. Nav: background, hide on scroll down, active link, frame counter
     ------------------------------------------------------------------ */
  var nav = $(".nav"), navFrame = $(".nav__frame span"), contact = $("#contact");
  var lastY = 0, ticking = false;
  var links = $$(".nav__links a");
  var sections = links.map(function (a) { return $(a.getAttribute("href")); });

  function onScroll() {
    var y = window.scrollY;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    nav.classList.toggle("is-scrolled", y > 30);
    nav.classList.toggle("is-hidden", y > lastY && y > 500 && !lb.classList.contains("is-open"));
    nav.classList.toggle("on-dark", contact.getBoundingClientRect().top < 40);
    navFrame.textContent = pad(Math.round((y / max) * 239) + 1, 4);
    var active = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) active = i; });
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === active); });
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     6. Custom cursor (mouse only)
     ------------------------------------------------------------------ */
  var cursor = $(".cursor");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    var mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener("mousemove", function (ev) {
      mx = ev.clientX; my = ev.clientY;
      var t = ev.target;
      var onWork = !!t.closest(".work");
      cursor.classList.toggle("is-play", onWork);
      cursor.classList.toggle("is-link", !onWork && !!t.closest("a, button"));
      cursor.classList.toggle("is-dark", !!t.closest(".contact, .lightbox"));
      cursor.classList.toggle("is-hidden", !!t.closest(".lightbox__frame"));
    });
    document.addEventListener("mouseleave", function () { cursor.classList.add("is-hidden"); });
    document.addEventListener("mouseenter", function () { cursor.classList.remove("is-hidden"); });
    (function loop() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------------
     7. Copy e-mail
     ------------------------------------------------------------------ */
  var copyBtn = $("[data-copy]");
  copyBtn.addEventListener("click", function () {
    var ok = function () {
      copyBtn.classList.add("is-copied");
      $(".contact__copy-hint").textContent = "copied!";
      setTimeout(function () { copyBtn.classList.remove("is-copied"); $(".contact__copy-hint").textContent = "copy"; }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(S.email).then(ok, function () {});
    else {
      var ta = document.createElement("textarea"); ta.value = S.email; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); ok(); } catch (err) { /* noop */ }
      document.body.removeChild(ta);
    }
  });
})();
