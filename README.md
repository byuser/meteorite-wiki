# ☄️ Meteorite Wiki

A simple, dependency-free educational website about the different types of
meteorites — what they are, what they're made of, and how scientists classify
them.

## Pages

| Page | File | What it covers |
| --- | --- | --- |
| Introduction / Home | `index.html` | What a meteorite is, featured types, the three main groups, "dig deeper" links |
| Types | `pages/types.html` | Browsable, searchable & filterable photo cards for every meteorite type |
| Type detail | `pages/type.html?id=…` | Full profile of a single type: photograph, description, key facts, "at a glance" table and related types |
| Composition | `pages/composition.html` | Key minerals and metals, silicates vs. metal, the Widmanstätten pattern |
| Classification | `pages/classification.html` | How meteorites are sorted into groups, chondrites vs. achondrites, falls vs. finds |
| Identify | `pages/identify.html` | A practical "meteorite or meteorwrong?" field-test guide (fusion crust, magnet, heft, regmaglypts, streak…) |
| Famous | `pages/famous.html` | Notable meteorites such as Hoba, Allende, Chelyabinsk, Murchison and Sikhote-Alin |
| Glossary | `pages/glossary.html` | Plain-language definitions of meteorite terms |
| Quiz | `pages/quiz.html` | An interactive, scored self-test with per-question explanations |
| About | `pages/about.html` | What the project is and how it's built |

## Project structure

```
meteorite-wiki/
├── index.html              # Home / introduction page
├── 404.html                # Friendly not-found page
├── pages/                  # Remaining pages
├── css/style.css           # All styling
├── js/
│   ├── filter.js           # Pure search/filter logic (browser + Node)
│   ├── quiz.js             # Pure quiz-scoring logic (browser + Node)
│   ├── i18n.js             # UI strings (English + Russian) & helpers
│   └── main.js             # DOM rendering, i18n & interactivity
├── data/
│   ├── meteorites.js       # Single shared data source (UMD module)
│   └── ru.js               # Russian translations of that data
├── tests/run.js            # Zero-dependency test suite
├── robots.txt              # Crawler directives
└── sitemap.xml             # Search-engine sitemap
```

## Languages

The site is bilingual — **English** and **Russian (Русский)**. A switcher in
the header (`EN | RU`) toggles the language; the choice is saved in
`localStorage` and can also be forced with a `?lang=ru` query parameter.

- Static page text is marked up with `data-i18n` attributes and translated from
  `js/i18n.js` (English is read straight from the DOM, Russian from the module).
- Data-driven content (types, composition, glossary, quiz, …) is translated in
  `data/ru.js`, keyed by the same ids and merged over the English source at
  render time, so any untranslated field simply falls back to English.

## Photographs

Every meteorite type has a lead photo and many also carry a small gallery of
extra photographs on their detail page. Composition minerals and famous
meteorites now show photos too. All images are referenced by their
[Wikimedia Commons](https://commons.wikimedia.org/) file name and loaded via the
`Special:FilePath` endpoint, with an inline SVG placeholder if one fails to
load.

All meteorite content — types, composition, famous examples, glossary,
identification tests and quiz questions — lives in `data/meteorites.js`. That
same module is loaded by the browser **and** imported by the tests, so the site
and its tests can never drift apart.

The pure logic modules (`js/filter.js`, `js/quiz.js`) are deliberately free of
DOM/Node APIs so they run identically in the browser and under the Node test
suite.

### SEO & accessibility

Every page ships a favicon, `theme-color`, Open Graph tags and a
skip-to-content link; the home page adds JSON-LD structured data. A
`sitemap.xml` and `robots.txt` round out the search-engine basics.

### Type cards & photos

Each meteorite type is shown as a clickable card with a real photograph and
opens a dedicated detail page (`pages/type.html?id=…`). Photos are referenced by
their [Wikimedia Commons](https://commons.wikimedia.org/) file name and loaded
on demand via the `Special:FilePath` endpoint; if an image can't be fetched the
UI falls back to an inline placeholder so a card is never left blank.

## Running locally

No build step and no dependencies are required.

```bash
# Option 1: built-in tiny static server
npm start
# then open http://localhost:8080

# Option 2: just open index.html in a browser
```

## Testing

```bash
npm test        # or: node tests/run.js
```

The suite checks data integrity (every type references a real class, has a
summary and composition, ids are unique), the search/filter logic, and that
each HTML page has the expected structure and hooks for the JavaScript.

## Disclaimer

Content is summarised for learning and is not a substitute for peer-reviewed
sources. For authoritative data see the Meteoritical Society and its
Meteoritical Bulletin Database.
