#!/usr/bin/env node
/*
 * Tiny zero-dependency test runner for the Meteorite Wiki.
 * Run with: npm test   (or: node tests/run.js)
 */
"use strict";

var fs = require("fs");
var path = require("path");

var data = require("../data/meteorites.js");
var filter = require("../js/filter.js");

var passed = 0;
var failed = 0;
var failures = [];

function ok(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(message);
  }
}

function eq(actual, expected, message) {
  ok(
    actual === expected,
    message + " (expected " + JSON.stringify(expected) + ", got " +
      JSON.stringify(actual) + ")"
  );
}

/* ---------------- Data integrity ---------------- */

var validClassIds = data.classes.map(function (c) {
  return c.id;
});

ok(data.classes.length === 3, "there are exactly three meteorite classes");
ok(data.types.length >= 5, "there are at least five meteorite types");
ok(
  data.compositionEntries.length >= 4,
  "there are at least four composition entries"
);
ok(data.famous.length >= 3, "there are at least three famous meteorites");

// Every type references a real class and has required fields.
var seenTypeIds = {};
data.types.forEach(function (t) {
  ok(!!t.id, "type has an id");
  ok(!seenTypeIds[t.id], "type id '" + t.id + "' is unique");
  seenTypeIds[t.id] = true;
  ok(!!t.name, "type '" + t.id + "' has a name");
  ok(!!t.summary, "type '" + t.id + "' has a summary");
  ok(
    validClassIds.indexOf(t.class) !== -1,
    "type '" + t.id + "' has a valid class (" + t.class + ")"
  );
  ok(
    Array.isArray(t.composition) && t.composition.length > 0,
    "type '" + t.id + "' lists composition"
  );
  ok(
    typeof t.image === "string" && t.image.length > 0,
    "type '" + t.id + "' has a photo file name"
  );
  ok(
    Array.isArray(t.details) && t.details.length > 0,
    "type '" + t.id + "' has detail paragraphs"
  );
});

ok(data.types.length >= 10, "the catalogue lists at least ten meteorite types");

// Every class has at least one type.
data.classes.forEach(function (c) {
  ok(!!c.name, "class '" + c.id + "' has a name");
  ok(!!c.description, "class '" + c.id + "' has a description");
  ok(
    data.getTypesByClass(c.id).length > 0,
    "class '" + c.id + "' has at least one type"
  );
});

// Composition entries are well formed.
data.compositionEntries.forEach(function (e) {
  ok(!!e.name && !!e.kind && !!e.detail, "composition entry '" + e.id + "' complete");
});

/* ---------------- Helpers ---------------- */

eq(data.getClassById("iron").id, "iron", "getClassById returns the iron class");
eq(data.getClassById("nope"), undefined, "getClassById returns undefined for unknown id");

eq(
  data.getTypeById("pallasite").id,
  "pallasite",
  "getTypeById returns the pallasite type"
);
eq(
  data.getTypeById("nope"),
  undefined,
  "getTypeById returns undefined for unknown id"
);

/* ---------------- Filter logic ---------------- */

eq(
  filter.filterTypes(data.types, "", "all").length,
  data.types.length,
  "empty query + 'all' returns every type"
);

var ironTypes = filter.filterTypes(data.types, "", "iron");
ok(
  ironTypes.length > 0 &&
    ironTypes.every(function (t) {
      return t.class === "iron";
    }),
  "class filter returns only iron types"
);

var pallasiteSearch = filter.filterTypes(data.types, "pallasite", "all");
ok(
  pallasiteSearch.length === 1 && pallasiteSearch[0].id === "pallasite",
  "search for 'pallasite' finds the pallasite type"
);

// Search should look inside composition too.
var olivineSearch = filter.filterTypes(data.types, "olivine", "all");
ok(olivineSearch.length > 0, "search by composition mineral ('olivine') finds types");

// Search is case-insensitive.
eq(
  filter.filterTypes(data.types, "PALLASITE", "all").length,
  filter.filterTypes(data.types, "pallasite", "all").length,
  "search is case-insensitive"
);

// Combined query + class filter narrows correctly.
var combined = filter.filterTypes(data.types, "olivine", "stony-iron");
ok(
  combined.every(function (t) {
    return t.class === "stony-iron";
  }),
  "combined search + class filter respects the class"
);

// No matches yields an empty array (drives the empty state in the UI).
eq(
  filter.filterTypes(data.types, "zzzznotathing", "all").length,
  0,
  "unmatched query returns no types"
);

/* ---------------- HTML sanity checks ---------------- */

var root = path.join(__dirname, "..");
var pages = [
  "index.html",
  "pages/types.html",
  "pages/composition.html",
  "pages/classification.html",
  "pages/famous.html",
  "pages/about.html",
  "pages/type.html"
];

pages.forEach(function (rel) {
  var full = path.join(root, rel);
  ok(fs.existsSync(full), "page exists: " + rel);
  var html = fs.readFileSync(full, "utf8");
  ok(/<!DOCTYPE html>/i.test(html), rel + " has a doctype");
  ok(/<title>[^<]+<\/title>/i.test(html), rel + " has a non-empty title");
  ok(/class="main-nav"/.test(html), rel + " includes the main navigation");
  ok(/meteorites\.js/.test(html), rel + " loads the data module");
});

// The interactive pages must include the elements main.js looks for.
var typesHtml = fs.readFileSync(path.join(root, "pages/types.html"), "utf8");
ok(/id="types-grid"/.test(typesHtml), "types page has #types-grid");
ok(/id="type-search"/.test(typesHtml), "types page has #type-search");
ok(/data-class="iron"/.test(typesHtml), "types page has an iron filter button");

var compHtml = fs.readFileSync(path.join(root, "pages/composition.html"), "utf8");
ok(/id="composition-body"/.test(compHtml), "composition page has #composition-body");

var detailHtml = fs.readFileSync(path.join(root, "pages/type.html"), "utf8");
ok(/id="type-detail"/.test(detailHtml), "type detail page has #type-detail");

/* ---------------- Report ---------------- */

console.log("\nMeteorite Wiki test suite");
console.log("=========================");
if (failed === 0) {
  console.log("✓ All " + passed + " assertions passed.\n");
  process.exit(0);
} else {
  console.log("✓ " + passed + " passed, ✗ " + failed + " failed:\n");
  failures.forEach(function (f) {
    console.log("  ✗ " + f);
  });
  console.log("");
  process.exit(1);
}
