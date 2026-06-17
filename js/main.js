/*
 * Meteorite Wiki — browser rendering & interactivity.
 * Relies on globals `MeteoriteData` (data/meteorites.js) and
 * `MeteoriteFilter` (js/filter.js), which must be loaded first.
 */
(function () {
  "use strict";

  var data = window.MeteoriteData;
  var filter = window.MeteoriteFilter;

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

  // Build the HTML for a single meteorite-type card.
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
      '<article class="card" data-class="' +
      esc(type.class) +
      '">' +
      '<span class="icon" aria-hidden="true">' +
      esc(type.icon || "☄️") +
      "</span>" +
      '<span class="badge">' +
      esc(classNameFor(type.class)) +
      "</span>" +
      "<h3>" +
      esc(type.name) +
      "</h3>" +
      "<p>" +
      esc(type.summary) +
      "</p>" +
      (facts ? "<ul>" + facts + "</ul>" : "") +
      '<div class="tags">' +
      tags +
      "</div>" +
      (type.example
        ? '<p class="example">Example: ' + esc(type.example) + "</p>"
        : "") +
      "</article>"
    );
  }

  // Render the class overview cards (used on the Types page header).
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

    function update() {
      var matches = filter.filterTypes(
        data.types,
        state.query,
        state.classId
      );
      grid.innerHTML = matches.map(typeCardHTML).join("");
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
    grid.innerHTML = data.types
      .slice(0, 3)
      .map(typeCardHTML)
      .join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderClassOverview();
    renderTypesPage();
    renderComposition();
    renderFamous();
    renderFeatured();
  });
})();
