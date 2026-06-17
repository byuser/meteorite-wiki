/*
 * Meteorite Wiki — browser rendering & interactivity.
 * Relies on globals `MeteoriteData` (data/meteorites.js) and
 * `MeteoriteFilter` (js/filter.js), which must be loaded first.
 */
(function () {
  "use strict";

  var data = window.MeteoriteData;
  var filter = window.MeteoriteFilter;

  // Are we inside the /pages/ directory or at the site root? This lets the
  // same script build correct relative links from any page.
  var inPages = /\/pages\//.test(window.location.pathname);
  var pageBase = inPages ? "" : "pages/";

  // Escape user/data text before injecting into innerHTML.
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function classNameFor(classId) {
    var c = data.getClassById(classId);
    return c ? c.name : classId;
  }

  // A muted accent colour per class, used for image fallbacks.
  function classColor(classId) {
    return classId === "iron"
      ? "#6b7280"
      : classId === "stony-iron"
      ? "#8a6d3b"
      : "#3a3f63";
  }

  // Build a Wikimedia Commons image URL from a stored file name. The
  // Special:FilePath endpoint redirects to the current file and accepts a
  // width parameter so we get an appropriately sized thumbnail.
  function imageUrl(file, width) {
    if (!file) return "";
    return (
      "https://commons.wikimedia.org/wiki/Special:FilePath/" +
      encodeURIComponent(file) +
      "?width=" +
      (width || 640)
    );
  }

  // An inline SVG placeholder shown if a photo fails to load, so a card is
  // never left blank. Carries the type's icon on a class-coloured panel.
  function fallbackImage(type) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="384">' +
      '<rect width="100%" height="100%" fill="' +
      classColor(type.class) +
      '"/>' +
      '<text x="50%" y="50%" font-size="160" text-anchor="middle" ' +
      'dominant-baseline="central">' +
      (type.icon || "☄️") +
      "</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  // Build the media (photo) block for a type, with a graceful fallback.
  function typeMediaHTML(type, width) {
    if (!type.image) return "";
    return (
      '<span class="card-media">' +
      '<img loading="lazy" alt="Photograph of a ' +
      esc(type.name.replace(/s$/, "")) +
      ' meteorite" src="' +
      esc(imageUrl(type.image, width)) +
      '" data-fallback="' +
      esc(fallbackImage(type)) +
      '" />' +
      "</span>"
    );
  }

  // Build the HTML for a single meteorite-type card (a link to its page).
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
      '" data-class="' +
      esc(type.class) +
      '">' +
      typeMediaHTML(type, 480) +
      '<span class="card-body">' +
      '<span class="badge">' +
      esc(classNameFor(type.class)) +
      "</span>" +
      "<h3><span class=\"icon\" aria-hidden=\"true\">" +
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
        ? '<span class="example">Example: ' + esc(type.example) + "</span>"
        : "") +
      '<span class="card-cta">View details →</span>' +
      "</span>" +
      "</a>"
    );
  }

  // After cards are rendered, wire up image error handlers so a missing photo
  // is swapped for its inline SVG placeholder exactly once.
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

  // Render the class overview cards (used on several pages).
  function renderClassCards(container) {
    container.innerHTML = data.classes
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

  // Wire up the searchable / filterable types grid.
  function renderTypesPage() {
    var grid = document.getElementById("types-grid");
    if (!grid) return;

    var searchInput = document.getElementById("type-search");
    var filterButtons = Array.prototype.slice.call(
      document.querySelectorAll(".filter-btn")
    );

    var state = { query: "", classId: "all" };

    var emptyState = document.querySelector(".empty-state");
    var countEl = document.getElementById("type-count");

    function update() {
      var matches = filter.filterTypes(data.types, state.query, state.classId);
      grid.innerHTML = matches.map(typeCardHTML).join("");
      attachImageFallbacks(grid);
      if (countEl) {
        countEl.textContent =
          matches.length +
          " of " +
          data.types.length +
          (data.types.length === 1 ? " type" : " types");
      }
      if (emptyState) {
        if (matches.length === 0) {
          emptyState.removeAttribute("hidden");
        } else {
          emptyState.setAttribute("hidden", "");
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        state.query = e.target.value;
        update();
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        state.classId = btn.getAttribute("data-class") || "all";
        update();
      });
    });

    update();
  }

  function renderClassOverview() {
    var el = document.getElementById("class-overview");
    if (el) renderClassCards(el);
  }

  // Composition page: render a table of minerals/elements.
  function renderComposition() {
    var tbody = document.getElementById("composition-body");
    if (!tbody) return;
    tbody.innerHTML = data.compositionEntries
      .map(function (entry) {
        return (
          "<tr>" +
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
  }

  // Famous meteorites page.
  function renderFamous() {
    var grid = document.getElementById("famous-grid");
    if (!grid) return;
    grid.innerHTML = data.famous
      .map(function (m) {
        return (
          '<article class="card">' +
          "<h3>" +
          esc(m.name) +
          "</h3>" +
          '<span class="badge">' +
          esc(m.year) +
          "</span>" +
          "<p>" +
          esc(m.note) +
          "</p>" +
          '<p class="example">Location: ' +
          esc(m.location) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  // Featured cards on the home page (first few types).
  function renderFeatured() {
    var grid = document.getElementById("featured-grid");
    if (!grid) return;
    grid.innerHTML = data.types.slice(0, 6).map(typeCardHTML).join("");
    attachImageFallbacks(grid);
  }

  // Detail page for a single meteorite type (pages/type.html?id=...).
  function renderTypeDetail() {
    var root = document.getElementById("type-detail");
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var type = data.getTypeById(params.get("id"));

    if (!type) {
      root.innerHTML =
        '<p class="empty-state">Sorry, that meteorite type could not be found. ' +
        '<a href="types.html">Browse all types</a>.</p>';
      return;
    }

    document.title = type.name + " — Meteorite Wiki";

    var cls = data.getClassById(type.class);

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

    // A small facts table of single-value attributes when present.
    var quickRows = [
      ["Class", cls ? cls.name : type.class],
      ["Parent body", type.parentBody],
      ["Typical age", type.age],
      ["Example", type.example]
    ]
      .filter(function (row) {
        return row[1];
      })
      .map(function (row) {
        return (
          "<tr><th scope=\"row\">" +
          esc(row[0]) +
          "</th><td>" +
          esc(row[1]) +
          "</td></tr>"
        );
      })
      .join("");

    // Related types in the same class (excluding the current one).
    var related = data
      .getTypesByClass(type.class)
      .filter(function (t) {
        return t.id !== type.id;
      });
    var relatedHTML = related.length
      ? '<h2 class="section-title">Related ' +
        esc(cls ? cls.name.toLowerCase() : "types") +
        '</h2><div class="card-grid">' +
        related.map(typeCardHTML).join("") +
        "</div>"
      : "";

    root.innerHTML =
      '<p class="breadcrumb"><a href="../index.html">Home</a> › ' +
      '<a href="types.html">Types</a> › <span>' +
      esc(type.name) +
      "</span></p>" +
      '<article class="type-detail">' +
      '<div class="detail-media">' +
      '<img alt="Photograph of a ' +
      esc(type.name.replace(/s$/, "")) +
      ' meteorite" src="' +
      esc(imageUrl(type.image, 900)) +
      '" data-fallback="' +
      esc(fallbackImage(type)) +
      '" />' +
      '<span class="img-credit">Photo: Wikimedia Commons</span>' +
      "</div>" +
      '<div class="detail-body">' +
      '<span class="badge">' +
      esc(cls ? cls.name : type.class) +
      "</span>" +
      "<h1><span class=\"icon\" aria-hidden=\"true\">" +
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
        ? '<h2 class="section-title">Key facts</h2><ul>' + facts + "</ul>"
        : "") +
      "</div>" +
      (quickRows
        ? '<aside class="detail-aside"><h2 class="section-title">At a glance</h2>' +
          '<table class="data-table fact-table"><tbody>' +
          quickRows +
          "</tbody></table>" +
          (cls
            ? '<p class="example">' + esc(cls.description) + "</p>"
            : "") +
          "</aside>"
        : "") +
      "</div>" +
      relatedHTML;

    attachImageFallbacks(root);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderClassOverview();
    renderTypesPage();
    renderComposition();
    renderFamous();
    renderFeatured();
    renderTypeDetail();
  });
})();
