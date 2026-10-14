(function () {
  "use strict";

  var html = document.documentElement;

  /* ---------- language ---------- */
  function applyLang(lang, persist) {
    html.setAttribute("data-lang", lang);
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    var titleZh = document.querySelector('meta[name="title-zh"]');
    var titleEn = document.querySelector('meta[name="title-en"]');
    if (titleZh && titleEn) {
      document.title = lang === "en" ? titleEn.content : titleZh.content;
    }
    if (persist) {
      try { localStorage.setItem("resolve-lang", lang); } catch (e) {}
    }
    var mailtoEls = document.querySelectorAll("[data-mailto-subject]");
    mailtoEls.forEach(function (a) {
      var subject = lang === "en" ? a.getAttribute("data-subject-en") : a.getAttribute("data-subject-zh");
      var base = a.getAttribute("data-mailto-base");
      if (subject && base) a.href = base + "?subject=" + encodeURIComponent(subject);
    });
  }

  function initLang() {
    var params = new URLSearchParams(window.location.search);
    var urlLang = params.get("lang");
    var saved = null;
    try { saved = localStorage.getItem("resolve-lang"); } catch (e) {}
    var lang = urlLang === "en" || urlLang === "zh" ? urlLang : (saved === "en" ? "en" : "zh");
    applyLang(lang, false);
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.addEventListener("click", function () {
        applyLang(b.getAttribute("data-lang"), true);
      });
    });
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        html.classList.toggle("nav-open");
      });
    }
    document.querySelectorAll(".main-nav .has-sub > a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (window.innerWidth <= 1240) {
          e.preventDefault();
          a.parentElement.classList.toggle("open");
        }
      });
    });
    document.querySelectorAll(".main-nav a:not(.has-sub > a)").forEach(function (a) {
      a.addEventListener("click", function () { html.classList.remove("nav-open"); });
    });
  }

  /* ---------- highlight current nav item ---------- */
  function markActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a[href]").forEach(function (a) {
      var href = a.getAttribute("href").split("/").pop();
      if (href === path) a.classList.add("active");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    markActiveNav();
  });
})();
