# AGENTS.md — bootstra-gunmetal

Rules for the `packages/bootstra-gunmetal/` package. They apply **only to this package**; repository-wide rules (structure, workspace commands, Git and publishing safety) live in the root [`AGENTS.md`](../../AGENTS.md). Read both before changing anything here. Paths below are relative to this folder.

## Package overview

bootstra-gunmetal (product name **GUNMETAL OS**, collection display name "Gunmetal") is a Bootstrap 5.3 theme for Flash-era desktop interfaces: bevelled steel windows, floppy-disk icons, pixel type, CSS wallpapers, and one switchable glow colour.

It is a plain CSS file loaded after Bootstrap's stylesheet, on a page with `class="gm-os"` on `<body>`, plus an **optional** dependency-free script for the interactive pieces (glow colour, wallpapers, window drag and collapse, icon-bar sections, chip-tune music, clock). Bootstrap's own bundle drives its components; the theme script never replaces it.

## Package structure

```text
packages/bootstra-gunmetal/
├── AGENTS.md                   this file
├── CLAUDE.md                   pointer to this file
├── README.md                   user documentation; shipped to npm
├── CHANGELOG.md                release history of this package
├── LICENSE                     shipped to npm
├── package.json                metadata, version, scripts, themeCollection entry
├── .stylelintrc.json
├── gunmetal.css                the whole theme in one file
├── gunmetal.js                 optional behaviours
├── index.html                  prototype site
├── docs.html                   component reference with copyable markup
├── screenshots/screenshot.png  collection preview (1280×860, taken from index.html)
└── scripts/build.mjs           build
```

The theme came into the collection as four flat files; that layout is kept. Generated, never committed, never edited by hand: `dist/`, `_site/`.

## Build

- The theme is hand-written; there is no compiler. `npm run build` runs `scripts/build.mjs`, which copies `gunmetal.css` and `gunmetal.js` to `dist/`, minifies the CSS with lightningcss into `dist/gunmetal.min.css` (no `targets`, so nothing is prefixed or lowered), then assembles the demo in `_site/` from `index.html`, `docs.html`, `gunmetal.css`, and `gunmetal.js`. The JavaScript is not minified.
- `_site/` is the `themeCollection.demo` folder. The collection site copies it to `themes/bootstra-gunmetal/`, so both pages must keep loading `gunmetal.css` and `gunmetal.js` from their own folder, and every other link must stay relative.
- The banners in `gunmetal.css` and `gunmetal.js`, and the version labels in the demo pages, carry the theme's own `v0.6` build name; keep them in step with the package version's major and minor numbers when releasing.
- Run scripts from the repository root with `--workspace bootstra-gunmetal`, or from this folder. To check the demo, use the root `npm run preview` and open `themes/bootstra-gunmetal/`.

## Theme rules

### Contract with Bootstrap

- Bootstrap 5.3 is a peer dependency (`^5.3.0`) loaded before the theme. Never bundle, copy, or patch Bootstrap.
- Bootstrap components are restyled inside `.gm-os` through their own selectors and `--bs-*` variables, so plain Bootstrap markup works. Do not change Bootstrap's grid, utilities, or JavaScript behaviour.

### Naming and public API

- Theme classes start with `gm-`, custom properties with `--gm-`, data attributes with `data-gm-`; state classes are `is-*` (`is-active`, `is-on`, `is-collapsed`, `is-hot`, `is-dragging`). Settings on `<html>`: `data-gm-accent`, `data-gm-text`, and the `gm-fx-off` class.
- The public API is what the README and `docs.html` document: the classes, tokens, glow presets, wallpaper names, `data-gm-*` attributes, the `gm:accent` event, the `localStorage` keys `gm:accent`, `gm:wall`, `gm:text`, `gm:fx`, and `window.GM` (`setAccent`, `setWall`, `setText`, `setFx`, `play`, `stop`). Renaming or removing one is a breaking change.
- A new glow preset is added in three places: the `[data-gm-accent="…"]` rules in the CSS, `PRESETS` in the script, and the README.

### Source organization

- Plain CSS in a single file, `gunmetal.css`, in numbered sections: tokens, base, desktop shell, windows, surfaces, dock modules, Bootstrap components, special screens, wallpapers, docs page, responsive / motion. Keep that layout and the file's compact style; do not split it or add a preprocessor without the owner's decision.
- Icons, grain, and wallpapers are drawn in CSS or as inline SVG `data:` URIs; the theme loads no image or font files.
- `gunmetal.js` is one IIFE with no dependencies, using delegated event listeners. Keep it optional: the CSS must work without it.

### Fonts

- The theme uses Silkscreen (pixel type) and Saira Condensed 800 (display type), loaded by the page from Google Fonts. The package ships no font files. Do not bundle fonts.

### Accessibility, mobile, and browser support

- Keep the visible `:focus-visible` dotted outline in the glow colour and the `aria-label`s on icon-only controls.
- Animations stop under `prefers-reduced-motion` and with `gm-fx-off`. Window dragging is enabled only at 992px and wider; the desktop layout stacks below 992px.
- Bootstrap 5.3.x and current Chrome, Edge, Firefox, and Safari.

## Dependencies

- No runtime dependencies. Development dependencies are `lightningcss`, `stylelint`, and `stylelint-config-recommended`; `lint` also runs `node --check` on the script.
- Stylelint uses the recommended config with `no-descending-specificity` disabled, so the source keeps its original order: the single-file cascade adds later, more specific overrides (for example link colours in `.gm-plate`, `.gm-statusbar`, and the docs nav after the global `.gm-os a:hover`) after their base rules. Stylelint prints a harmless `[csstree-match] BREAK` notice on the long multi-layer background values.

## Verification

- `npm test` (lint + build) for every change to the CSS, the script, the demo pages, `scripts/`, or `package.json`.
- For visual changes, check both demo pages over HTTP (root `npm run preview`, then `themes/bootstra-gunmetal/`) at a desktop and a narrow (375px) viewport: glow presets, wallpapers, large text and effects-off, window drag and collapse, icon-bar sections, music, dropdown, modal, tooltip, and toast.
- For build or packaging changes, check `dist/` and `npm pack --workspace bootstra-gunmetal --dry-run` (only `dist/`, `LICENSE`, `README.md`, and `package.json` may ship).

## Versioning and releases

- Semantic Versioning, with this package's `package.json` as the source of truth. The theme came into the collection at `0.6.0`, keeping its own v0.6 build number.
- **Patch** for fixes and small visual corrections that keep the public API; **minor** for new classes, presets, tokens, or behaviours; **major** for any breaking change to the public API (while the version is `0.x`, a breaking change is a minor bump).
- Every user-visible change adds a line under `## Unreleased` in `CHANGELOG.md`; a release moves them under `## X.Y.Z — YYYY-MM-DD`. A minor or major release also updates the `@X.Y` version in the README CDN links.
- Release tags are `bootstra-gunmetal@X.Y.Z`. Follow [`docs/RELEASING.md`](../../docs/RELEASING.md); only the owner pushes tags.

## Demo security

The demo pages make only these third-party requests: Bootstrap CSS and JavaScript from jsDelivr, and the Silkscreen and Saira Condensed fonts from Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`). Do not add analytics, tracking, or other third-party requests. Custom wallpapers chosen by the user are read locally with `FileReader` and never uploaded.
