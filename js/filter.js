/*
 * Pure, DOM-free helpers for searching and filtering meteorite types.
 * Kept separate from main.js so the logic can be unit tested under Node.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MeteoriteFilter = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Returns true when `type` matches the free-text query (name, summary,
  // composition or example). An empty query matches everything.
  function matchesQuery(type, query) {
    if (!query) return true;
    var q = String(query).trim().toLowerCase();
    if (!q) return true;

    var haystack = [
      type.name,
      type.summary,
      type.example,
      (type.composition || []).join(" "),
      (type.keyFacts || []).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return haystack.indexOf(q) !== -1;
  }

  // Returns true when the type belongs to the selected class. "all" matches all.
  function matchesClass(type, classId) {
    if (!classId || classId === "all") return true;
    return type.class === classId;
  }

  // Filters a list of types by both query and class.
  function filterTypes(types, query, classId) {
    return (types || []).filter(function (type) {
      return matchesQuery(type, query) && matchesClass(type, classId);
    });
  }

  return {
    matchesQuery: matchesQuery,
    matchesClass: matchesClass,
    filterTypes: filterTypes
  };
});
