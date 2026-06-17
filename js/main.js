/*
 * Meteorite Wiki — browser rendering & interactivity.
 * Relies on globals `MeteoriteData` (data/meteorites.js), `MeteoriteFilter`
 * (js/filter.js) and, where present, `MeteoriteI18n` (js/i18n.js),
 * `MeteoriteRU` (data/ru.js) and `MeteoriteQuiz` (js/quiz.js).
 */
(function () {
  "use strict";

  var data = window.MeteoriteData;
  var filter = window.MeteoriteFilter;
  var quiz = window.MeteoriteQuiz;
  var i18n = window.MeteoriteI18n;
  var RU = window.MeteoriteRU;

  // Are we inside the /pages/ directory or at the site root? This lets the
  // same script build correct relative links from any page.
  var inPages = /\/pages\//.test(window.location.pathname);
  var pageBase = inPages ? "" : "pages/";

  /* ------------------------------ Language ------------------------------ */

  function readLang() {
    if (!i18n) return "en";
    try {
      var p = new URLSearchParams(window.location.search).get("lang");
      if (p) return i18n.normalize(p);
    } catch (e) {}
    try {
      var stored = window.localStorage.getItem("meteoriteLang");
      if (stored) return i18n.normalize(stored);
    } catch (e) {}
    var nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return i18n.normalize(nav);
  }

  var lang = readLang();

  // A runtime label in the current language.
  function L(key) {
    return i18n ? i18n.t(lang, key) : key;
  }

  function setLang(next) {
    lang = i18n ? i18n.normalize(next) : "en";
    try {
      window.localStorage.setItem("meteoriteLang", lang);
    } catch (e) {}
    document.documentElement.lang = lang;
    applyStaticI18n();
    updateLangSwitch();
    renderAll();
  }

  /* ---------------------- Data localisation helpers --------------------- */

  // Return a copy of `item` with Russian fields overlaid (when lang === ru).
  function localize(collection, item) {
    if (!item || lang === "en" || !RU || !RU[collection]) return item;
    var key = collection === "glossary" ? item.term : item.id;
    var over = RU[collection][key];
    if (!over) return item;
    var copy = {};
    var k;
    for (k in item) copy[k] = item[k];
    for (k in over) copy[k] = over[k];
    return copy;
  }

  function localizeList(collection, list) {
    return (list || []).map(function (it) {
      return localize(collection, it);
    });
  }

  function locClass(classId) {
    var c = data.getClassById(classId);
    return c ? localize("classes", c) : c;
  }

  /* ----------------------------- Utilities ------------------------------ */

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function classNameFor(classId) {
    var c = locClass(classId);
    return c ? c.name : classId;
  }

  function classColor(classId) {
    return classId === "iron"
      ? "#6b7280"
      : classId === "stony-iron"
      ? "#8a6d3b"
      : "#3a3f63";
  }

  function imageUrl(file, width) {
    if (!file) return "";
    return (
      "https://commons.wikimedia.org/wiki/Special:FilePath/" +
      encodeURIComponent(file) +
      "?width=" +
      (width || 640)
    );
  }

  // Inline SVG placeholder shown if a photo fails to load.
  function fallbackSvg(symbol, color) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="384">' +
      '<rect width="100%" height="100%" fill="' +
      color +
      '"/>' +
      '<text x="50%" y="50%" font-size="160" text-anchor="middle" ' +
      'dominant-baseline="central">' +
      (symbol || "☄️") +
      "</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  // Build a single <img> with a graceful inline-SVG fallback.
  function mediaImg(file, width, symbol, color, alt) {
    return (
      '<img loading="lazy" alt="' +
      esc(alt || "") +
      '" src="' +
      esc(imageUrl(file, width)) +
      '" data-fallback="' +
      esc(fallbackSvg(symbol, color)) +
      '" />'
    );
  }

  function typeMediaHTML(type, width) {
    if (!type.image) return "";
    return (
      '<span class="card-media">' +
      mediaImg(type.image, width, type.icon || "☄️", classColor(type.class), type.name) +
      "</span>"
    );
  }

  // After cards are rendered, swap any failed photo for its SVG placeholder.
  function attachImageFallbacks(container) {
    var imgs = container.querySelectorAll("img[data-fallback]");
    Array.prototype.forEach.call(imgs, function (img) {
      img.addEventListener("error", function handle() {
        img.removeEventListener("error", handle);
        img.src = img.getAttribute("data-fallback");
        img.classList.add("is-fallback");
      });
    });
  }

  /* --------------------------- Card builders ---------------------------- */

  // Build the HTML for a single (already localised) meteorite-type card.
  function typeCardHTML(type) {
    var facts = (type.keyFacts || [])
      .map(function (f) {
        return "<li>" + esc(f) + "</li>";
      })
      .join("");

    var tags = (type.composition || [])
      .map(function (c) {
        return '<span class="tag">' + esc(c) + "</span>";
      })
      .join("");

    return (
      '<a class="card type-card" href="' +
      pageBase +
      "type.html?id=" +
      encodeURIComponent(type.id) +
      (lang !== "en" ? "&lang=" + encodeURIComponent(lang) : "") +
      '" data-class="' +
      esc(type.class) +
      '">' +
      typeMediaHTML(type, 480) +
      '<span class="card-body">' +
      '<span class="badge">' +
      esc(classNameFor(type.class)) +
      "</span>" +
      '<h3><span class="icon" aria-hidden="true">' +
      esc(type.icon || "☄️") +
      "</span>" +
      esc(type.name) +
      "</h3>" +
      "<p>" +
      esc(type.summary) +
      "</p>" +
      (facts ? "<ul>" + facts + "</ul>" : "") +
      '<span class="tags">' +
      tags +
      "</span>" +
      (type.example
        ? '<span class="example">' + esc(L("example")) + esc(type.example) + "</span>"
        : "") +
      '<span class="card-cta">' +
      esc(L("viewDetails")) +
      "</span>" +
      "</span>" +
      "</a>"
    );
  }

  function renderClassCards(container) {
    container.innerHTML = localizeList("classes", data.classes)
      .map(function (c) {
        return (
          '<article class="card">' +
          '<span class="badge">' +
          esc(c.share) +
          "</span>" +
          "<h3>" +
          esc(c.name) +
          "</h3>" +
          "<p>" +
          esc(c.description) +
          "</p>" +
          '<p class="example">' +
          esc(c.tagline) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ------------------------------- Pages -------------------------------- */

  function renderTypesPage() {
    var grid = document.getElementById("types-grid");
    if (!grid) return;

    var countEl = document.getElementById("type-count");
    var emptyState = document.querySelector(".empty-state");

    if (!grid._state) grid._state = { query: "", classId: "all" };
    var state = grid._state;

    function update() {
      var types = localizeList("types", data.types);
      var matches = filter.filterTypes(types, state.query, state.classId);
      grid.innerHTML = matches.map(typeCardHTML).join("");
      attachImageFallbacks(grid);
      if (countEl) {
        countEl.textContent =
          matches.length +
          " " +
          L("countOf") +
          " " +
          data.types.length +
          " " +
          (data.types.length === 1 ? L("typeSingular") : L("typePlural"));
      }
      if (emptyState) {
        if (matches.length === 0) emptyState.removeAttribute("hidden");
        else emptyState.setAttribute("hidden", "");
      }
    }

    if (!grid._wired) {
      grid._wired = true;
      var searchInput = document.getElementById("type-search");
      if (searchInput) {
        searchInput.addEventListener("input", function (e) {
          state.query = e.target.value;
          update();
        });
      }
      var buttons = Array.prototype.slice.call(
        document.querySelectorAll(".filter-btn")
      );
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) {
            b.classList.remove("active");
          });
          btn.classList.add("active");
          state.classId = btn.getAttribute("data-class") || "all";
          update();
        });
      });
    }

    update();
  }

  function renderClassOverview() {
    var el = document.getElementById("class-overview");
    if (el) renderClassCards(el);
  }

  // Composition page: table of minerals/metals with a small photo each.
  function renderComposition() {
    var tbody = document.getElementById("composition-body");
    if (!tbody) return;
    tbody.innerHTML = localizeList("compositionEntries", data.compositionEntries)
      .map(function (entry) {
        return (
          "<tr>" +
          '<td class="comp-photo">' +
          (entry.image
            ? mediaImg(entry.image, 160, "🔬", "#3a3f63", entry.name)
            : "") +
          "</td>" +
          "<td>" +
          esc(entry.name) +
          "</td>" +
          "<td>" +
          esc(entry.kind) +
          "</td>" +
          "<td>" +
          esc(entry.detail) +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
    attachImageFallbacks(tbody);
  }

  // Famous meteorites page (cards with photographs).
  function renderFamous() {
    var grid = document.getElementById("famous-grid");
    if (!grid) return;
    grid.innerHTML = localizeList("famous", data.famous)
      .map(function (m) {
        return (
          '<article class="card famous-card">' +
          (m.image
            ? '<span class="card-media">' +
              mediaImg(m.image, 480, "☄️", "#3a3f63", m.name) +
              "</span>"
            : "") +
          '<span class="card-body">' +
          "<h3>" +
          esc(m.name) +
          "</h3>" +
          '<span class="badge">' +
          esc(m.year) +
          "</span>" +
          "<p>" +
          esc(m.note) +
          "</p>" +
          '<p class="example">' +
          esc(L("location")) +
          esc(m.location) +
          "</p>" +
          "</span>" +
          "</article>"
        );
      })
      .join("");
    attachImageFallbacks(grid);
  }

  function renderFeatured() {
    var grid = document.getElementById("featured-grid");
    if (!grid) return;
    grid.innerHTML = localizeList("types", data.types.slice(0, 6))
      .map(typeCardHTML)
      .join("");
    attachImageFallbacks(grid);
  }

  // Detail page for a single meteorite type (pages/type.html?id=...).
  function renderTypeDetail() {
    var root = document.getElementById("type-detail");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var base = data.getTypeById(params.get("id"));

    if (!base) {
      root.innerHTML =
        '<p class="empty-state">' +
        esc(L("notFound")) +
        '<a href="types.html">' +
        esc(L("browseAll")) +
        "</a>.</p>";
      return;
    }

    var type = localize("types", base);
    var cls = locClass(type.class);
    var titleSuffix = lang === "ru" ? " — Вики о метеоритах" : " — Meteorite Wiki";
    document.title = type.name + titleSuffix;

    var facts = (type.keyFacts || [])
      .map(function (f) {
        return "<li>" + esc(f) + "</li>";
      })
      .join("");

    var tags = (type.composition || [])
      .map(function (c) {
        return '<span class="tag">' + esc(c) + "</span>";
      })
      .join("");

    var paragraphs = (type.details || [type.summary])
      .map(function (p) {
        return "<p>" + esc(p) + "</p>";
      })
      .join("");

    var quickRows = [
      [L("classRow"), cls ? cls.name : type.class],
      [L("parentBody"), type.parentBody],
      [L("age"), type.age],
      [L("exampleRow"), type.example]
    ]
      .filter(function (row) {
        return row[1];
      })
      .map(function (row) {
        return (
          '<tr><th scope="row">' +
          esc(row[0]) +
          "</th><td>" +
          esc(row[1]) +
          "</td></tr>"
        );
      })
      .join("");

    // Extra photographs for this type, when available.
    var galleryHTML =
      type.gallery && type.gallery.length
        ? '<h2 class="section-title">' +
          esc(L("gallery")) +
          '</h2><div class="gallery-grid">' +
          type.gallery
            .map(function (file) {
              return (
                '<figure class="gallery-item">' +
                mediaImg(file, 480, type.icon || "☄️", classColor(type.class), type.name) +
                "</figure>"
              );
            })
            .join("") +
          "</div>"
        : "";

    // Related types in the same class (excluding the current one).
    var related = localizeList(
      "types",
      data.getTypesByClass(type.class).filter(function (t) {
        return t.id !== type.id;
      })
    );
    var relatedHTML = related.length
      ? '<h2 class="section-title">' +
        esc(L("relatedPrefix")) +
        esc(cls ? cls.name.toLowerCase() : L("relatedFallback")) +
        '</h2><div class="card-grid">' +
        related.map(typeCardHTML).join("") +
        "</div>"
      : "";

    root.innerHTML =
      '<p class="breadcrumb"><a href="../index.html">' +
      esc(L("crumbHome")) +
      '</a> › <a href="types.html">' +
      esc(L("crumbTypes")) +
      "</a> › <span>" +
      esc(type.name) +
      "</span></p>" +
      '<article class="type-detail">' +
      '<div class="detail-media">' +
      mediaImg(type.image, 900, type.icon || "☄️", classColor(type.class), type.name) +
      '<span class="img-credit">' +
      esc(L("photoCredit")) +
      "</span>" +
      "</div>" +
      '<div class="detail-body">' +
      '<span class="badge">' +
      esc(cls ? cls.name : type.class) +
      "</span>" +
      '<h1><span class="icon" aria-hidden="true">' +
      esc(type.icon || "☄️") +
      "</span>" +
      esc(type.name) +
      "</h1>" +
      '<p class="lead">' +
      esc(type.summary) +
      "</p>" +
      '<div class="tags">' +
      tags +
      "</div>" +
      "</div>" +
      "</article>" +
      '<div class="detail-columns">' +
      '<div class="detail-prose prose">' +
      paragraphs +
      (facts
        ? '<h2 class="section-title">' + esc(L("keyFacts")) + "</h2><ul>" + facts + "</ul>"
        : "") +
      "</div>" +
      (quickRows
        ? '<aside class="detail-aside"><h2 class="section-title">' +
          esc(L("atGlance")) +
          "</h2>" +
          '<table class="data-table fact-table"><tbody>' +
          quickRows +
          "</tbody></table>" +
          (cls ? '<p class="example">' + esc(cls.description) + "</p>" : "") +
          "</aside>"
        : "") +
      "</div>" +
      galleryHTML +
      relatedHTML;

    attachImageFallbacks(root);
  }

  function renderGlossary() {
    var dl = document.getElementById("glossary-list");
    if (!dl) return;
    dl.innerHTML = localizeList("glossary", data.glossary)
      .map(function (g) {
        return (
          '<div class="glossary-item">' +
          "<dt>" +
          esc(g.term) +
          "</dt><dd>" +
          esc(g.definition) +
          "</dd></div>"
        );
      })
      .join("");
  }

  function renderIdentify() {
    var grid = document.getElementById("identify-grid");
    if (!grid) return;
    var label = {
      yes: L("verdictYes"),
      no: L("verdictNo"),
      maybe: L("verdictMaybe")
    };
    grid.innerHTML = localizeList("identifyTests", data.identifyTests)
      .map(function (t) {
        return (
          '<article class="card identify-card verdict-' +
          esc(t.verdict) +
          '">' +
          '<span class="badge verdict-badge">' +
          esc(label[t.verdict] || t.verdict) +
          "</span>" +
          "<h3>" +
          esc(t.name) +
          "</h3><p>" +
          esc(t.detail) +
          "</p></article>"
        );
      })
      .join("");
  }

  function gradeMsg(score, total) {
    if (!total) return "";
    var pct = score / total;
    if (pct === 1) return L("gradePerfect");
    if (pct >= 0.7) return L("gradeGreat");
    if (pct >= 0.4) return L("gradeOk");
    return L("gradeLow");
  }

  function renderQuiz() {
    var form = document.getElementById("quiz-form");
    if (!form || !quiz) return;

    var resultEl = document.getElementById("quiz-result");
    var questions = localizeList("quiz", data.quiz);

    form.innerHTML =
      questions
        .map(function (q, i) {
          var options = q.options
            .map(function (opt, j) {
              var id = q.id + "-" + j;
              return (
                '<label class="quiz-option" for="' +
                esc(id) +
                '">' +
                '<input type="radio" id="' +
                esc(id) +
                '" name="' +
                esc(q.id) +
                '" value="' +
                j +
                '" />' +
                "<span>" +
                esc(opt) +
                "</span></label>"
              );
            })
            .join("");
          return (
            '<fieldset class="quiz-question" data-qid="' +
            esc(q.id) +
            '">' +
            "<legend>" +
            (i + 1) +
            ". " +
            esc(q.question) +
            "</legend>" +
            '<div class="quiz-options">' +
            options +
            "</div>" +
            '<p class="quiz-feedback" hidden></p>' +
            "</fieldset>"
          );
        })
        .join("") +
      '<button type="submit" class="btn">' +
      esc(L("checkAnswers")) +
      "</button>";

    if (resultEl) {
      resultEl.setAttribute("hidden", "");
      resultEl.innerHTML = "";
    }

    if (!form._wired) {
      form._wired = true;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var qs = localizeList("quiz", data.quiz);
        var answers = {};
        qs.forEach(function (q) {
          var checked = form.querySelector(
            'input[name="' + q.id + '"]:checked'
          );
          if (checked) answers[q.id] = Number(checked.value);

          var fieldset = form.querySelector('[data-qid="' + q.id + '"]');
          if (!fieldset) return;
          var feedback = fieldset.querySelector(".quiz-feedback");
          var correct = quiz.isCorrect(q, answers[q.id]);
          fieldset.classList.remove("is-correct", "is-wrong");
          fieldset.classList.add(correct ? "is-correct" : "is-wrong");
          feedback.textContent =
            (correct ? L("quizCorrect") : L("quizWrong")) + q.explanation;
          feedback.removeAttribute("hidden");
        });

        var score = quiz.scoreQuiz(qs, answers);
        var rEl = document.getElementById("quiz-result");
        if (rEl) {
          rEl.innerHTML =
            "<strong>" +
            esc(L("quizScored")) +
            " " +
            score +
            " / " +
            qs.length +
            ".</strong> " +
            esc(gradeMsg(score, qs.length));
          rEl.removeAttribute("hidden");
          rEl.focus();
        }
      });
    }
  }

  /* --------------------------- Static i18n ------------------------------ */

  function applyStaticI18n() {
    if (!i18n) return;
    applyText("data-i18n", false);
    applyText("data-i18n-html", true);
    applyAttr("data-i18n-placeholder", "placeholder");
    applyAttr("data-i18n-aria", "aria-label");
  }

  function applyText(attr, asHtml) {
    var nodes = document.querySelectorAll("[" + attr + "]");
    Array.prototype.forEach.call(nodes, function (el) {
      if (el._i18nOrig === undefined) {
        el._i18nOrig = asHtml ? el.innerHTML : el.textContent;
      }
      var key = el.getAttribute(attr);
      var value = lang === "en" ? el._i18nOrig : i18n.staticRu[key];
      if (value === undefined) value = el._i18nOrig;
      if (asHtml) el.innerHTML = value;
      else el.textContent = value;
    });
  }

  function applyAttr(dataAttr, attr) {
    var nodes = document.querySelectorAll("[" + dataAttr + "]");
    Array.prototype.forEach.call(nodes, function (el) {
      var store = "_i18nAttr_" + attr;
      if (el[store] === undefined) el[store] = el.getAttribute(attr) || "";
      var key = el.getAttribute(dataAttr);
      var value = lang === "en" ? el[store] : i18n.staticRu[key];
      if (value === undefined) value = el[store];
      el.setAttribute(attr, value);
    });
  }

  /* ------------------------ Language switcher --------------------------- */

  function initLangSwitch() {
    var btns = document.querySelectorAll(".lang-switch [data-lang]");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang"));
      });
    });
    updateLangSwitch();
  }

  function updateLangSwitch() {
    var btns = document.querySelectorAll(".lang-switch [data-lang]");
    Array.prototype.forEach.call(btns, function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ------------------------------ Boot ---------------------------------- */

  function renderAll() {
    renderClassOverview();
    renderTypesPage();
    renderComposition();
    renderFamous();
    renderFeatured();
    renderTypeDetail();
    renderGlossary();
    renderIdentify();
    renderQuiz();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.lang = lang;
    initLangSwitch();
    applyStaticI18n();
    renderAll();
  });
})();
