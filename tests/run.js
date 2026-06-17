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
var quiz = require("../js/quiz.js");
var i18n = require("../js/i18n.js");
var ru = require("../data/ru.js");

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

// Composition entries are well formed and now carry a photo.
data.compositionEntries.forEach(function (e) {
  ok(!!e.name && !!e.kind && !!e.detail, "composition entry '" + e.id + "' complete");
  ok(
    typeof e.image === "string" && e.image.length > 0,
    "composition entry '" + e.id + "' has a photo file name"
  );
});

// Every famous meteorite now carries a photo.
data.famous.forEach(function (m) {
  ok(
    typeof m.image === "string" && m.image.length > 0,
    "famous meteorite '" + m.id + "' has a photo file name"
  );
});

// Galleries, when present, are arrays of non-empty file names.
var galleryCount = 0;
data.types.forEach(function (t) {
  if (t.gallery === undefined) return;
  ok(Array.isArray(t.gallery), "type '" + t.id + "' gallery is an array");
  t.gallery.forEach(function (g) {
    ok(typeof g === "string" && g.length > 0, "type '" + t.id + "' gallery entry is a file name");
  });
  if (t.gallery.length) galleryCount++;
});
ok(galleryCount >= 5, "several types provide an extra photo gallery");

/* ---------------- Internationalisation (i18n) ---------------- */

ok(i18n.LANGS.indexOf("en") !== -1 && i18n.LANGS.indexOf("ru") !== -1,
  "i18n supports English and Russian");
eq(i18n.normalize("ru"), "ru", "normalize keeps a supported language");
eq(i18n.normalize("zz"), "en", "normalize falls back to English");
eq(i18n.normalize(undefined), "en", "normalize handles missing language");

// Every English runtime label has a Russian counterpart.
Object.keys(i18n.labels.en).forEach(function (key) {
  ok(
    typeof i18n.labels.ru[key] === "string" && i18n.labels.ru[key].length > 0,
    "runtime label '" + key + "' has a Russian translation"
  );
});

// Core navigation/chrome keys are present in the Russian static dictionary.
[
  "brand", "skip", "footer", "nav.home", "nav.types", "nav.identify",
  "nav.glossary", "nav.quiz", "comp.th.photo", "types.empty"
].forEach(function (key) {
  ok(!!i18n.staticRu[key], "static Russian string present: " + key);
});

/* ---------------- Russian data translations ---------------- */

// Every class and type is translated with the key fields.
data.classes.forEach(function (c) {
  var r = ru.classes[c.id];
  ok(r && r.name && r.description, "class '" + c.id + "' is translated to Russian");
});
data.types.forEach(function (t) {
  var r = ru.types[t.id];
  ok(r && r.name && r.summary, "type '" + t.id + "' is translated to Russian");
  ok(
    r && Array.isArray(r.details) && r.details.length === t.details.length,
    "type '" + t.id + "' has matching Russian detail paragraphs"
  );
  ok(
    r && Array.isArray(r.composition) && r.composition.length === t.composition.length,
    "type '" + t.id + "' Russian composition matches the English count"
  );
});
data.compositionEntries.forEach(function (e) {
  var r = ru.compositionEntries[e.id];
  ok(r && r.name && r.detail, "composition '" + e.id + "' is translated to Russian");
});
data.famous.forEach(function (m) {
  var r = ru.famous[m.id];
  ok(r && r.name && r.note, "famous '" + m.id + "' is translated to Russian");
});
data.glossary.forEach(function (g) {
  var r = ru.glossary[g.term];
  ok(r && r.term && r.definition, "glossary term '" + g.term + "' is translated to Russian");
});
data.identifyTests.forEach(function (t) {
  var r = ru.identifyTests[t.id];
  ok(r && r.name && r.detail, "identify test '" + t.id + "' is translated to Russian");
});
// Russian quiz keeps the same option count (so the answer index stays valid).
data.quiz.forEach(function (q) {
  var r = ru.quiz[q.id];
  ok(r && r.question && r.explanation, "quiz '" + q.id + "' is translated to Russian");
  ok(
    r && Array.isArray(r.options) && r.options.length === q.options.length,
    "quiz '" + q.id + "' Russian options match the English option count"
  );
});

/* ---------------- Glossary ---------------- */

ok(
  Array.isArray(data.glossary) && data.glossary.length >= 10,
  "there are at least ten glossary terms"
);
data.glossary.forEach(function (g) {
  ok(!!g.term && !!g.definition, "glossary term '" + g.term + "' is complete");
});

/* ---------------- Identification tests ---------------- */

var validVerdicts = ["yes", "no", "maybe"];
ok(
  Array.isArray(data.identifyTests) && data.identifyTests.length >= 5,
  "there are at least five identification tests"
);
data.identifyTests.forEach(function (t) {
  ok(!!t.id && !!t.name && !!t.detail, "identify test '" + t.id + "' is complete");
  ok(
    validVerdicts.indexOf(t.verdict) !== -1,
    "identify test '" + t.id + "' has a valid verdict (" + t.verdict + ")"
  );
});

/* ---------------- Quiz data ---------------- */

ok(
  Array.isArray(data.quiz) && data.quiz.length >= 5,
  "there are at least five quiz questions"
);
var seenQuizIds = {};
data.quiz.forEach(function (q) {
  ok(!!q.id && !seenQuizIds[q.id], "quiz id '" + q.id + "' is present and unique");
  seenQuizIds[q.id] = true;
  ok(!!q.question, "quiz '" + q.id + "' has a question");
  ok(
    Array.isArray(q.options) && q.options.length >= 2,
    "quiz '" + q.id + "' offers at least two options"
  );
  ok(
    typeof q.answer === "number" && q.answer >= 0 && q.answer < q.options.length,
    "quiz '" + q.id + "' answer index is within range"
  );
  ok(!!q.explanation, "quiz '" + q.id + "' has an explanation");
});

/* ---------------- Quiz logic ---------------- */

var sampleQ = data.quiz[0];
ok(quiz.isCorrect(sampleQ, sampleQ.answer), "isCorrect is true for the right answer");
ok(
  !quiz.isCorrect(sampleQ, (sampleQ.answer + 1) % sampleQ.options.length),
  "isCorrect is false for a wrong answer"
);

// A perfect set of answers scores full marks.
var perfect = {};
data.quiz.forEach(function (q) {
  perfect[q.id] = q.answer;
});
eq(
  quiz.scoreQuiz(data.quiz, perfect),
  data.quiz.length,
  "scoreQuiz awards full marks for all-correct answers"
);

// No answers scores zero.
eq(quiz.scoreQuiz(data.quiz, {}), 0, "scoreQuiz returns 0 when nothing is answered");

ok(
  typeof quiz.gradeMessage(data.quiz.length, data.quiz.length) === "string" &&
    quiz.gradeMessage(data.quiz.length, data.quiz.length).length > 0,
  "gradeMessage returns a non-empty string for a perfect score"
);

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
  "pages/identify.html",
  "pages/famous.html",
  "pages/glossary.html",
  "pages/quiz.html",
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

var identifyHtml = fs.readFileSync(path.join(root, "pages/identify.html"), "utf8");
ok(/id="identify-grid"/.test(identifyHtml), "identify page has #identify-grid");

var glossaryHtml = fs.readFileSync(path.join(root, "pages/glossary.html"), "utf8");
ok(/id="glossary-list"/.test(glossaryHtml), "glossary page has #glossary-list");

var quizHtml = fs.readFileSync(path.join(root, "pages/quiz.html"), "utf8");
ok(/id="quiz-form"/.test(quizHtml), "quiz page has #quiz-form");
ok(/quiz\.js/.test(quizHtml), "quiz page loads the quiz logic module");

// Every page should expose the new navigation links, a skip link, the
// language switcher and the i18n/translation scripts.
pages.forEach(function (rel) {
  var html = fs.readFileSync(path.join(root, rel), "utf8");
  ok(/href="[^"]*identify\.html"/.test(html), rel + " links to the identify page");
  ok(/href="[^"]*glossary\.html"/.test(html), rel + " links to the glossary page");
  ok(/href="[^"]*quiz\.html"/.test(html), rel + " links to the quiz page");
  ok(/class="skip-link"/.test(html), rel + " has a skip-to-content link");
  ok(/i18n\.js/.test(html), rel + " loads the i18n module");
  ok(/data\/ru\.js/.test(html), rel + " loads the Russian translations");
  ok(/class="lang-switch"/.test(html), rel + " has a language switcher");
  ok(/data-lang="ru"/.test(html), rel + " offers a Russian language button");
  ok(/data-i18n="nav\.home"/.test(html), rel + " tags the navigation for translation");
});

// The composition page gained a photo column.
ok(/data-i18n="comp\.th\.photo"/.test(compHtml), "composition page has a Photo column header");

// SEO/support files should be present.
ok(fs.existsSync(path.join(root, "sitemap.xml")), "sitemap.xml exists");
ok(fs.existsSync(path.join(root, "robots.txt")), "robots.txt exists");
ok(fs.existsSync(path.join(root, "404.html")), "404.html exists");

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
