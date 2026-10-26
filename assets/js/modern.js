/* =========================================================
   Muhammad Shehzeb Assad — Portfolio
   Modern interactions (vanilla JS, no dependencies)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Theme (dark / light) ---------- */
  var root = document.documentElement;
  var STORAGE_KEY = "msa-theme";

  function getPreferredTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
    }
  }

  applyTheme(getPreferredTheme());

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".theme-toggle");
    if (!toggle) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  /* ---------- Mobile navigation ---------- */
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");

  function closeMenu() {
    if (!links) return;
    links.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Typed role effect ---------- */
  var typedEl = document.querySelector(".typed");
  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var words = (typedEl.getAttribute("data-words") || "").split("|").map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length) {
      var wi = 0, ci = 0, deleting = false;
      var type = function () {
        var word = words[wi];
        typedEl.textContent = word.substring(0, ci);
        if (!deleting && ci < word.length) {
          ci++; setTimeout(type, 70);
        } else if (deleting && ci > 0) {
          ci--; setTimeout(type, 35);
        } else if (!deleting && ci === word.length) {
          deleting = true; setTimeout(type, 1600);
        } else {
          deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300);
        }
      };
      type();
    }
  } else if (typedEl) {
    var firstWord = (typedEl.getAttribute("data-words") || "").split("|")[0];
    typedEl.textContent = (firstWord || "").trim();
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
