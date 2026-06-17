/*
 * Meteorite Wiki — shared data module.
 *
 * This file is written as a UMD-style module so the exact same data powers
 * both the browser pages (via a global `MeteoriteData`) and the Node test
 * suite (via `module.exports`). Keep it free of DOM and Node-only APIs.
 *
 * Photographs are referenced by their Wikimedia Commons file name only; the
 * UI builds a `Special:FilePath` URL from it (see js/main.js). All images are
 * from Wikimedia Commons and used here for educational purposes.
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
  // `image` is a Wikimedia Commons file name (resolved to a URL in the UI).
  // `details` holds the longer write-up shown on each type's own page.
  var types = [
    {
      id: "chondrite",
      name: "Chondrites",
      class: "stony",
      icon: "🪨",
      image: "Allende meteorite.jpg",
      summary:
        "Unmelted stony meteorites containing chondrules — tiny spherical grains " +
        "that formed in the solar nebula 4.56 billion years ago.",
      keyFacts: [
        "Most primitive material available to study",
        "Named for their chondrules (millimetre-sized beads)",
        "Subgroups include ordinary, carbonaceous and enstatite chondrites"
      ],
      composition: ["Olivine", "Pyroxene", "Iron-nickel metal", "Chondrules"],
      example: "Allende (carbonaceous chondrite, fell 1969)",
      parentBody: "Undifferentiated asteroids",
      age: "≈4.56 billion years",
      details: [
        "Chondrites are the oldest and most abundant meteorites, making up the " +
          "great majority of all falls. They come from asteroids that never grew " +
          "hot enough to melt, so they have preserved a near-pristine snapshot of " +
          "the dust and droplets that built the Solar System.",
        "Their defining feature is the chondrule: a once-molten bead of silicate " +
          "rock, usually less than a millimetre across, that froze in open space " +
          "before being swept up into a larger body. Set in a fine dark matrix, " +
          "these chondrules give a cut chondrite its distinctive speckled look.",
        "Because they are so unchanged, chondrites are used to estimate the bulk " +
          "composition of the Solar System and to date its very beginning."
      ]
    },
    {
      id: "ordinary-chondrite",
      name: "Ordinary Chondrites",
      class: "stony",
      icon: "🌑",
      image: "Cheljabinsk meteorite fragment.jpg",
      summary:
        "By far the most common meteorites to fall, these stony chondrites are " +
        "split into the H, L and LL groups by how much metallic iron they hold.",
      keyFacts: [
        "Account for roughly 80% of all observed falls",
        "Divided into H (high iron), L (low iron) and LL groups",
        "Often show a dark fusion crust from atmospheric entry"
      ],
      composition: ["Olivine", "Pyroxene", "Iron-nickel metal", "Troilite"],
      example: "Chelyabinsk (LL5, fell over Russia in 2013)",
      parentBody: "S-type asteroids",
      age: "≈4.56 billion years",
      details: [
        "Ordinary chondrites are the workhorses of meteoritics — so common that " +
          "they are 'ordinary'. They are thought to come from stony, S-type " +
          "asteroids in the inner asteroid belt.",
        "Scientists sort them into three groups by their total iron content and " +
          "how much of that iron is metallic: H (high), L (low) and LL (low metal, " +
          "low iron). A number after the letter (3 to 7) records how much heat " +
          "the parent body experienced.",
        "The 2013 Chelyabinsk fireball, an LL5 ordinary chondrite, was the most " +
          "widely recorded meteorite fall in history and a vivid reminder that " +
          "these common stones still arrive with spectacular force."
      ]
    },
    {
      id: "carbonaceous-chondrite",
      name: "Carbonaceous Chondrites",
      class: "stony",
      icon: "⚫",
      image: "Carbonaceous chondrite (Murchison Meteorite) (14601493358).jpg",
      summary:
        "A carbon- and water-rich subgroup of chondrites that preserves organic " +
        "molecules and is key to studying the origin of life's building blocks.",
      keyFacts: [
        "Contain amino acids and other organic compounds",
        "Hold water locked in hydrated minerals",
        "Among the oldest dated material in the Solar System"
      ],
      composition: ["Hydrated silicates", "Organic compounds", "Carbon", "Olivine"],
      example: "Murchison (fell 1969, rich in amino acids)",
      parentBody: "C-type asteroids",
      age: "≈4.57 billion years",
      details: [
        "Carbonaceous chondrites are dark, primitive stones that never dried out " +
          "or baked, so they still carry water bound into their minerals and a " +
          "remarkable inventory of carbon-based molecules.",
        "The Murchison meteorite alone has yielded dozens of amino acids — the " +
          "building blocks of proteins — supporting the idea that some of the raw " +
          "ingredients for life were delivered to the early Earth from space.",
        "They also contain calcium–aluminium-rich inclusions (CAIs), the very " +
          "first solids to condense in the Solar System, which anchor the 4.567- " +
          "billion-year age of the planets."
      ]
    },
    {
      id: "achondrite",
      name: "Achondrites",
      class: "stony",
      icon: "🌋",
      image: "Erg Chech 002 meteorite.jpg",
      summary:
        "Stony meteorites from bodies that melted and differentiated, so they " +
        "lack chondrules and resemble volcanic rocks from Earth.",
      keyFacts: [
        "Formed by melting on a parent body",
        "Include lunar and Martian meteorites",
        "Texturally similar to terrestrial basalts"
      ],
      composition: ["Plagioclase", "Pyroxene", "Olivine"],
      example: "Erg Chech 002 (one of the oldest volcanic rocks known)",
      parentBody: "Differentiated asteroids, the Moon and Mars",
      age: "up to ≈4.566 billion years",
      details: [
        "Achondrites come from worlds that got hot enough to melt completely. As " +
          "the rock melted, dense metal sank to form a core and lighter silicate " +
          "floated up, erasing the original chondrules.",
        "What is left looks much like the volcanic and igneous rocks of Earth, " +
          "the Moon and Mars. Indeed, lunar and Martian meteorites are themselves " +
          "achondrites flung off their parent worlds by giant impacts.",
        "Erg Chech 002, found in the Sahara in 2020, is an ancient andesite-like " +
          "achondrite and one of the oldest volcanic rocks ever dated, hinting at " +
          "a now-vanished molten protoplanet."
      ]
    },
    {
      id: "martian",
      name: "Martian Meteorites",
      class: "stony",
      icon: "🔴",
      image: "Shergotty meteorite.jpg",
      summary:
        "Rare achondrites blasted off the surface of Mars by impacts, carrying " +
        "trapped gases that match the Martian atmosphere measured by landers.",
      keyFacts: [
        "Identified by gas bubbles matching Mars' atmosphere",
        "Most belong to the shergottite, nakhlite and chassignite groups",
        "Fewer than 400 are known out of ~70,000 classified meteorites"
      ],
      composition: ["Pyroxene", "Maskelynite", "Olivine", "Iron oxides"],
      example: "Shergotty (fell in India, 1865 — the type shergottite)",
      parentBody: "Mars",
      age: "0.2–4.4 billion years",
      details: [
        "A handful of meteorites are pieces of Mars itself, knocked into space by " +
          "asteroid impacts and later swept up by Earth. They are prized because " +
          "they are the only Martian rock we can study in a laboratory.",
        "The clinching evidence came from tiny pockets of gas trapped inside some " +
          "of them: its mix of nitrogen and noble gases is an exact match for the " +
          "Martian atmosphere sampled by NASA's Viking landers.",
        "Most fall into three families named after their first finds — " +
          "shergottites, nakhlites and chassignites (the 'SNC' meteorites) — " +
          "recording volcanic activity on Mars over billions of years."
      ]
    },
    {
      id: "lunar",
      name: "Lunar Meteorites",
      class: "stony",
      icon: "🌕",
      image: "Allan Hills 81005, lunar meteorite.jpg",
      summary:
        "Fragments of the Moon's crust launched by impacts, whose composition " +
        "matches the rocks returned by the Apollo missions.",
      keyFacts: [
        "First recognised in Antarctica in 1982 (ALH 81005)",
        "Composition matches Apollo and Luna sample returns",
        "Sample parts of the Moon the landed missions never visited"
      ],
      composition: ["Plagioclase", "Pyroxene", "Olivine", "Impact glass"],
      example: "Allan Hills 81005 (first confirmed lunar meteorite)",
      parentBody: "The Moon",
      age: "≈3–4.5 billion years",
      details: [
        "Lunar meteorites are bits of the Moon delivered to Earth for free. A " +
          "large impact on the lunar surface can throw debris fast enough to " +
          "escape the Moon's gravity, and a fraction eventually lands here.",
        "The first to be recognised, Allan Hills 81005, was picked up in " +
          "Antarctica in 1982; its pale, breccia texture immediately recalled the " +
          "highland rocks brought back by Apollo astronauts.",
        "Because they can come from anywhere on the Moon — including the far side " +
          "— lunar meteorites sample terrain the crewed missions never reached, " +
          "making them a valuable complement to the returned samples."
      ]
    },
    {
      id: "eucrite",
      name: "Eucrites (HED)",
      class: "stony",
      icon: "🟤",
      image: "MillbillillieMeteorite.jpg",
      summary:
        "Basaltic achondrites from the crust of the giant asteroid Vesta, the " +
        "best-sampled of the HED (howardite–eucrite–diogenite) clan.",
      keyFacts: [
        "Volcanic rocks from asteroid 4 Vesta",
        "Part of the HED group seen by NASA's Dawn mission",
        "Often glossy with a black, glassy fusion crust"
      ],
      composition: ["Pyroxene", "Plagioclase", "Anorthite"],
      example: "Millbillillie (fell in Australia, 1960)",
      parentBody: "Asteroid 4 Vesta",
      age: "≈4.4–4.5 billion years",
      details: [
        "Eucrites are ancient lava flows from the surface of Vesta, one of the " +
          "largest bodies in the asteroid belt. Together with howardites and " +
          "diogenites they form the HED group, all traced to the same parent.",
        "NASA's Dawn spacecraft orbited Vesta in 2011–2012 and confirmed the " +
          "link, matching the asteroid's spectrum and its huge south-polar impact " +
          "basin to the HED meteorites in our collections.",
        "Their fine basaltic texture and glassy fusion crust make eucrites a " +
          "favourite of collectors and a window onto volcanism on a small world."
      ]
    },
    {
      id: "octahedrite",
      name: "Octahedrites",
      class: "iron",
      icon: "🔩",
      image: "Widmanstätten pattern kevinzim.jpg",
      summary:
        "The most common iron meteorites, named for the octahedral arrangement " +
        "of metal crystals that produces the Widmanstätten pattern.",
      keyFacts: [
        "Show the classic Widmanstätten pattern when etched",
        "Contain 6–14% nickel",
        "Made of intergrown kamacite and taenite"
      ],
      composition: ["Kamacite", "Taenite", "Iron", "Nickel"],
      example: "Gibeon (Namibia, prized by collectors)",
      parentBody: "Cores of differentiated asteroids",
      age: "≈4.5 billion years",
      details: [
        "Octahedrites are the most common iron meteorites and the source of the " +
          "famous Widmanstätten pattern. When a slice is polished and etched with " +
          "acid, a lattice of fine metallic bands appears across the surface.",
        "Those bands are interlocking crystals of two iron–nickel alloys, " +
          "kamacite and taenite, arranged along the faces of an octahedron. The " +
          "pattern can only grow if the metal cools by a few degrees every " +
          "million years, deep inside a now-shattered asteroid core.",
        "The width of the bands reveals the nickel content and cooling rate, so a " +
          "single etched face tells a detailed story about the meteorite's origin."
      ]
    },
    {
      id: "hexahedrite",
      name: "Hexahedrites",
      class: "iron",
      icon: "⬛",
      image: "Iron-Meteorite - surface grinding with Widmanstätten pattern.jpg",
      summary:
        "Low-nickel iron meteorites made almost entirely of large kamacite " +
        "crystals, often showing fine Neumann lines from shock.",
      keyFacts: [
        "Lowest nickel content of the iron meteorites (~5–6%)",
        "Display Neumann lines instead of Widmanstätten patterns",
        "Composed of single large kamacite crystals"
      ],
      composition: ["Kamacite", "Iron", "Nickel"],
      example: "Coahuila (Mexico)",
      parentBody: "Cores of low-nickel asteroids",
      age: "≈4.5 billion years",
      details: [
        "Hexahedrites have so little nickel that they are made of one alloy, " +
          "kamacite, in huge single crystals — too uniform to produce a " +
          "Widmanstätten pattern when etched.",
        "Instead, a polished face often reveals delicate straight lines called " +
          "Neumann lines, a fingerprint of shock from impacts on the parent body.",
        "They take their name from the cubic (hexahedral) cleavage of their " +
          "kamacite crystals, and sit at the low-nickel end of the iron-meteorite " +
          "family."
      ]
    },
    {
      id: "ataxite",
      name: "Ataxites",
      class: "iron",
      icon: "⚙️",
      image: "Namibie Hoba Meteorite 05.JPG",
      summary:
        "Nickel-rich iron meteorites with no visible crystal structure — the " +
        "group that includes Hoba, the largest known meteorite on Earth.",
      keyFacts: [
        "Highest nickel content of the irons (>16%)",
        "Structureless to the eye — 'ataxite' means 'without order'",
        "Includes Hoba, the heaviest single meteorite known"
      ],
      composition: ["Taenite", "Kamacite", "Nickel", "Iron"],
      example: "Hoba (Namibia, ~60 tonnes)",
      parentBody: "Cores of nickel-rich asteroids",
      age: "≈4.5 billion years",
      details: [
        "Ataxites are the nickel-rich extreme of the iron meteorites. Their name " +
          "means 'without structure', because a polished surface shows no obvious " +
          "Widmanstätten or Neumann pattern to the naked eye.",
        "Under a microscope they are actually a very fine intergrowth of kamacite " +
          "and taenite, but the texture is too small to see unaided.",
        "The most celebrated ataxite is Hoba in Namibia: a flat slab of metal " +
          "weighing about 60 tonnes, the largest single meteorite ever found and, " +
          "remarkably, never moved from where it landed."
      ]
    },
    {
      id: "pallasite",
      name: "Pallasites",
      class: "stony-iron",
      icon: "💎",
      image: "Pallasite-Esquel-RoyalOntarioMuseum-Jan18-09.jpg",
      summary:
        "Stunning stony-irons in which gem-quality olivine crystals are " +
        "suspended in a continuous iron-nickel metal matrix.",
      keyFacts: [
        "Considered the most beautiful meteorites",
        "Likely form at the core–mantle boundary of a parent body",
        "Sliced and polished for display and jewellery"
      ],
      composition: ["Olivine", "Iron-nickel metal"],
      example: "Esquel (Argentina)",
      parentBody: "Core–mantle boundary of asteroids",
      age: "≈4.5 billion years",
      details: [
        "Pallasites are widely held to be the most beautiful of all meteorites. " +
          "They consist of golden-green olivine crystals — the gem peridot — " +
          "embedded in a shining network of iron–nickel metal.",
        "This mix is thought to form at the boundary between an asteroid's molten " +
          "metal core and its rocky mantle, where dense metal and floating " +
          "silicate meet and freeze together.",
        "Cut into thin slices and backlit, a pallasite glows like stained glass, " +
          "which is why specimens such as Esquel are centrepieces of museums and " +
          "collections alike."
      ]
    },
    {
      id: "mesosiderite",
      name: "Mesosiderites",
      class: "stony-iron",
      icon: "🧩",
      image: "Vaca Muerta, 9.51g endcut.jpg",
      summary:
        "Breccia-textured stony-irons that mix broken silicate fragments with " +
        "iron-nickel metal, recording violent collisions between asteroids.",
      keyFacts: [
        "Form through catastrophic impacts",
        "Roughly equal metal and silicate by mass",
        "Have a chaotic, brecciated texture"
      ],
      composition: ["Pyroxene", "Plagioclase", "Iron-nickel metal"],
      example: "Vaca Muerta (Chile)",
      parentBody: "Smashed and reassembled asteroids",
      age: "≈4.5 billion years",
      details: [
        "Mesosiderites are jumbled stony-irons that look like cosmic concrete: " +
          "angular chunks of silicate rock cemented together with iron–nickel " +
          "metal in a chaotic, brecciated texture.",
        "They are thought to record a catastrophe — the collision of a metallic " +
          "core with the crust of another body — which shattered and welded the " +
          "two together before everything cooled.",
        "Vaca Muerta in Chile is a classic strewn field of these rare meteorites, " +
          "with thousands of fragments scattered across the Atacama Desert."
      ]
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
    },
    getTypeById: function (typeId) {
      return types.filter(function (t) {
        return t.id === typeId;
      })[0];
    }
  };
});
