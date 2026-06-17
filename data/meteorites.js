/*
 * Meteorite Wiki — shared data module.
 *
 * This file is written as a UMD-style module so the exact same data powers
 * both the browser pages (via a global `MeteoriteData`) and the Node test
 * suite (via `module.exports`). Keep it free of DOM and Node-only APIs.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.MeteoriteData = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // The three broad classes every meteorite falls into.
  var classes = [
    {
      id: "stony",
      name: "Stony Meteorites",
      tagline: "Rocky meteorites made mostly of silicate minerals.",
      share: "~94% of all known falls",
      description:
        "Stony meteorites are dominated by silicate minerals and are the most " +
        "common type to fall to Earth. They are split into chondrites, which " +
        "preserve material from the early Solar System, and achondrites, which " +
        "come from bodies that melted and differentiated."
    },
    {
      id: "iron",
      name: "Iron Meteorites",
      tagline: "Dense meteorites made of iron–nickel metal.",
      share: "~5% of all known falls",
      description:
        "Iron meteorites are composed largely of an iron–nickel alloy and are " +
        "thought to be fragments of the metallic cores of shattered planetesimals. " +
        "When cut and etched they reveal the striking Widmanstätten pattern."
    },
    {
      id: "stony-iron",
      name: "Stony-Iron Meteorites",
      tagline: "A roughly even mix of metal and silicate.",
      share: "~1% of all known falls",
      description:
        "Stony-iron meteorites contain nearly equal parts iron–nickel metal and " +
        "silicate minerals. They are the rarest of the three main groups and " +
        "include the gem-bearing pallasites and the breccia-textured mesosiderites."
    }
  ];

  // Specific meteorite types, each belonging to one of the broad classes.
  var types = [
    {
      id: "chondrite",
      name: "Chondrites",
      class: "stony",
      icon: "🪨",
      summary:
        "Unmelted stony meteorites containing chondrules — tiny spherical grains " +
        "that formed in the solar nebula 4.56 billion years ago.",
      keyFacts: [
        "Most primitive material available to study",
        "Named for their chondrules (millimetre-sized beads)",
        "Subgroups include ordinary, carbonaceous and enstatite chondrites"
      ],
      composition: ["Olivine", "Pyroxene", "Iron-nickel metal", "Chondrules"],
      example: "Allende (carbonaceous chondrite, fell 1969)"
    },
    {
      id: "carbonaceous-chondrite",
      name: "Carbonaceous Chondrites",
      class: "stony",
      icon: "⚫",
      summary:
        "A carbon- and water-rich subgroup of chondrites that preserves organic " +
        "molecules and is key to studying the origin of life's building blocks.",
      keyFacts: [
        "Contain amino acids and other organic compounds",
        "Hold water locked in hydrated minerals",
        "Among the oldest dated material in the Solar System"
      ],
      composition: ["Hydrated silicates", "Organic compounds", "Carbon", "Olivine"],
      example: "Murchison (fell 1969, rich in amino acids)"
    },
    {
      id: "achondrite",
      name: "Achondrites",
      class: "stony",
      icon: "🌋",
      summary:
        "Stony meteorites from bodies that melted and differentiated, so they " +
        "lack chondrules and resemble volcanic rocks from Earth.",
      keyFacts: [
        "Formed by melting on a parent body",
        "Include lunar and Martian meteorites",
        "Texturally similar to terrestrial basalts"
      ],
      composition: ["Plagioclase", "Pyroxene", "Olivine"],
      example: "NWA 7034 'Black Beauty' (Martian achondrite)"
    },
    {
      id: "octahedrite",
      name: "Octahedrites",
      class: "iron",
      icon: "🔩",
      summary:
        "The most common iron meteorites, named for the octahedral arrangement " +
        "of metal crystals that produces the Widmanstätten pattern.",
      keyFacts: [
        "Show the classic Widmanstätten pattern when etched",
        "Contain 6–14% nickel",
        "Made of intergrown kamacite and taenite"
      ],
      composition: ["Kamacite", "Taenite", "Iron", "Nickel"],
      example: "Gibeon (Namibia, prized by collectors)"
    },
    {
      id: "hexahedrite",
      name: "Hexahedrites",
      class: "iron",
      icon: "⬛",
      summary:
        "Low-nickel iron meteorites made almost entirely of large kamacite " +
        "crystals, often showing fine Neumann lines from shock.",
      keyFacts: [
        "Lowest nickel content of the iron meteorites (~5–6%)",
        "Display Neumann lines instead of Widmanstätten patterns",
        "Composed of single large kamacite crystals"
      ],
      composition: ["Kamacite", "Iron", "Nickel"],
      example: "Coahuila (Mexico)"
    },
    {
      id: "pallasite",
      name: "Pallasites",
      class: "stony-iron",
      icon: "💎",
      summary:
        "Stunning stony-irons in which gem-quality olivine crystals are " +
        "suspended in a continuous iron-nickel metal matrix.",
      keyFacts: [
        "Considered the most beautiful meteorites",
        "Likely form at the core–mantle boundary of a parent body",
        "Sliced and polished for display and jewellery"
      ],
      composition: ["Olivine", "Iron-nickel metal"],
      example: "Esquel (Argentina)"
    },
    {
      id: "mesosiderite",
      name: "Mesosiderites",
      class: "stony-iron",
      icon: "🧩",
      summary:
        "Breccia-textured stony-irons that mix broken silicate fragments with " +
        "iron-nickel metal, recording violent collisions between asteroids.",
      keyFacts: [
        "Form through catastrophic impacts",
        "Roughly equal metal and silicate by mass",
        "Have a chaotic, brecciated texture"
      ],
      composition: ["Pyroxene", "Plagioclase", "Iron-nickel metal"],
      example: "Vaca Muerta (Chile)"
    }
  ];

  // Common minerals and elements that make up meteorites.
  var compositionEntries = [
    {
      id: "olivine",
      name: "Olivine",
      kind: "Silicate mineral",
      detail:
        "A magnesium-iron silicate that gives pallasites their green gem crystals " +
        "and is abundant in chondrites."
    },
    {
      id: "pyroxene",
      name: "Pyroxene",
      kind: "Silicate mineral",
      detail:
        "A group of rock-forming silicate minerals common in both stony " +
        "meteorites and the silicate portion of stony-irons."
    },
    {
      id: "kamacite",
      name: "Kamacite",
      kind: "Iron-nickel alloy",
      detail:
        "A low-nickel iron alloy that forms the broad bands of the " +
        "Widmanstätten pattern in iron meteorites."
    },
    {
      id: "taenite",
      name: "Taenite",
      kind: "Iron-nickel alloy",
      detail:
        "A high-nickel iron alloy that intergrows with kamacite to create the " +
        "crystalline structure of octahedrites."
    },
    {
      id: "plagioclase",
      name: "Plagioclase",
      kind: "Feldspar mineral",
      detail:
        "A feldspar mineral found in achondrites and mesosiderites, also common " +
        "in Earth's crust and on the Moon."
    },
    {
      id: "troilite",
      name: "Troilite",
      kind: "Iron sulfide",
      detail:
        "An iron sulfide mineral (FeS) found as inclusions in many iron and " +
        "stony meteorites."
    }
  ];

  // A few well-known meteorites for the 'Famous Meteorites' page.
  var famous = [
    {
      id: "hoba",
      name: "Hoba",
      location: "Namibia",
      year: "discovered 1920",
      note:
        "The largest known intact meteorite, an iron meteorite weighing about " +
        "60 tonnes that has never been moved from where it landed."
    },
    {
      id: "allende",
      name: "Allende",
      location: "Chihuahua, Mexico",
      year: "fell 1969",
      note:
        "The most studied carbonaceous chondrite, containing some of the oldest " +
        "solids ever dated in the Solar System."
    },
    {
      id: "willamette",
      name: "Willamette",
      location: "Oregon, USA",
      year: "discovered 1902",
      note:
        "A 15-tonne iron meteorite, the largest ever found in the United States " +
        "and sacred to the Clackamas people."
    },
    {
      id: "chelyabinsk",
      name: "Chelyabinsk",
      location: "Russia",
      year: "fell 2013",
      note:
        "An ordinary chondrite whose airburst over Russia was captured by " +
        "thousands of cameras and injured over 1,000 people."
    }
  ];

  return {
    classes: classes,
    types: types,
    compositionEntries: compositionEntries,
    famous: famous,

    // Helper used by both the UI and tests.
    getTypesByClass: function (classId) {
      return types.filter(function (t) {
        return t.class === classId;
      });
    },
    getClassById: function (classId) {
      return classes.filter(function (c) {
        return c.id === classId;
      })[0];
    }
  };
});
