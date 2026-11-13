# AGENTS.md — bootstra-rustomancy

Rules for the `packages/bootstra-rustomancy/` package. They apply **only to this package**; repository-wide rules (structure, workspace commands, Git and publishing safety) live in the root [`AGENTS.md`](../../AGENTS.md). Read both before changing anything here. Paths below are relative to this folder.

## Package overview

bootstra-rustomancy (product name **RUSTOMANCY**, collection display name "Rustomancy") is a post-atomic, retro-futurist pixel-art theme for Bootstrap 5.3. It has two materials: **paper** for websites and journals (notebook rail, sticky notes, marker headings, stamps, photos) and **iron** for game UI (riveted rust panels, lamp buttons, CRT screens, drum counters, knobs, HUD).

It is a plain CSS file loaded after Bootstrap's stylesheet, plus a dependency-free **pixel engine** script. The script is not optional for the full look: it generates every texture, sprite, pixel heading (`.px`) and photo frame (`canvas.px-photo`) on a `<canvas>` at run time and sets them as `--tx-*`, `--sp-*` and `--k*` custom properties on `<html>`. Without it the CSS still lays out and colours the components, but without textures. Bootstrap's own bundle drives its components; the theme script never replaces it.

## Package structure

```text
packages/bootstra-rustomancy/
├── AGENTS.md              this file
├── CLAUDE.md              pointer to this file
├── README.md              user documentation; shipped to npm
├── CHANGELOG.md           release history of this package
├── LICENSE                shipped to npm
├── package.json           metadata, version, scripts, themeCollection entry
├── .stylelintrc.json
├── src/rustomancy.css     the whole theme in one file
├── src/rustomancy.js      pixel engine, theme switches, window.Rustomancy
├── index.html             full demo / living style guide
├── demo/demo.js           logic for the demo page only (logo, character sheet, HUD, palmist)
├── examples/starter.html  minimal starting page
├── docs/*.png             README screenshots; docs/hero.png is the collection preview (1280×860)
└── scripts/build.mjs      build
```

The theme came into the collection with its hand-written files in `dist/`; they moved to `src/` so that `dist/` is build output like in every other package. Generated, never committed, never edited by hand: `dist/`, `_site/`.

## Build

- The theme is hand-written; there is no compiler. `npm run build` runs `scripts/build.mjs`, which copies `src/rustomancy.css` and `src/rustomancy.js` to `dist/` unchanged, minifies the CSS with lightningcss into `dist/rustomancy.min.css` (no `targets`, so nothing is prefixed or lowered), then assembles the demo in `_site/` from `index.html`, `demo/`, `examples/`, and `dist/`. The JavaScript is not minified.
- `_site/` is the `themeCollection.demo` folder. The collection site copies it to `themes/bootstra-rustomancy/`, so `index.html` must keep loading `dist/rustomancy.*` and `demo/demo.js`, `examples/starter.html` must keep loading `../dist/rustomancy.*`, and every other link must stay relative.
- The banners in `src/rustomancy.css` and `src/rustomancy.js` carry the theme's own `0.2` build name, and the script exposes `Rustomancy.version`; keep them in step with the package version when releasing.
- Run scripts from the repository root with `--workspace bootstra-rustomancy`, or from this folder. To check the demo, use the root `npm run preview` and open `themes/bootstra-rustomancy/`.

## Theme rules

### Contract with Bootstrap

- Bootstrap 5.3 is a peer dependency (`^5.3.0`) loaded before the theme. Never bundle, copy, or patch Bootstrap.
- Stock Bootstrap components are skinned through modifier classes (`.alert-rm`, `.alert-paper`, `.rm-badge`, `.rm-progress`, `.rm-menu`, `.rm-list`, `.rm-input-*`, `.rm-card-paper`, `.rm-table-*`) and `--bs-*` variables; body-level `--bs-*` variables set the base font and colours. Do not change Bootstrap's grid, utilities, or JavaScript behaviour.

### Naming and public API

- Theme classes and custom properties use the `rm-` / `--rm-` prefix; buttons follow Bootstrap's pattern (`.btn-rm`, `.btn-rm-led`, `.btn-rm-xl`, `.btn-rm-xs`, `.btn-scrawl`, `.btn-sticky`). Generated textures and sprites are `--tx-*`, `--sp-*`, and `--k0`–`--k2`. The unprefixed `.px` and `canvas.px-photo[data-scene][data-w][data-h]` are part of the API.
- Settings on `<html>`: `data-phosphor` (`green`, `amber`, `cyan`), `data-theme` (auto, `light`, `dark`), `data-ground` (paper, `sand`, `cracked`), `data-scan` (`on`, `off`); buttons with `data-set-phos`, `data-set-theme`, `data-set-ground`, `data-set-scan` are wired by the script.
- The public API is what the README documents: the classes, the `--rm-*` tokens, the settings attributes, the photo scene names, the `localStorage` keys `rm-phos`, `rm-theme`, `rm-ground`, `rm-scan`, the `rustomancy:ready` event, and `window.Rustomancy` (`drum`, `pxText`, `photo`, `tearNote`, `setPhos`, `setTheme`, `setGround`, `setScan`, `SCENES`, and the low-level drawing helpers). Renaming or removing one is a breaking change.

### Source organization

- Plain CSS in a single file, `src/rustomancy.css`, in the theme's own compact one-rule-per-line style. Keep that layout; do not split it or add a preprocessor without the owner's decision.
- The theme loads no image files: everything is drawn by `src/rustomancy.js` (procedural noise, Bayer dithering, palette quantization, nearest-neighbour 2× scaling) or as inline SVG. Do not add bitmap assets to the theme.
- `src/rustomancy.js` is one IIFE with no dependencies that boots itself on `DOMContentLoaded`. `demo/demo.js` is for the demo page only and is not shipped.
- Demo copy is in English. The demo game "LIFE LINE", its studio and characters are fictional; keep the theme an original work with no assets, names, or logos from existing games.

### Fonts

- The theme uses Permanent Marker, Reenie Beanie, Jersey 15, VT323, and Silkscreen, loaded by the page from Google Fonts (SIL Open Font License). The package ships no font files. Do not bundle fonts.

### Accessibility, mobile, and browser support

- `.px` headings keep their text in a `.visually-hidden` span for screen readers; generated canvases are `aria-hidden`. Keep the visible `:focus-visible` outline (red on paper, brass on metal) and the `aria-label`s on icon-only controls.
- The blinking CRT cursor stops under `prefers-reduced-motion`. The layout has breakpoints at 992px and 768px.
- Bootstrap 5.3.x and current Chrome, Edge, Firefox, and Safari, desktop and mobile.

## Dependencies

- No runtime dependencies. Development dependencies are `lightningcss`, `stylelint`, and `stylelint-config-recommended`; `lint` also runs `node --check` on both scripts.
- Stylelint uses the recommended config with two rules disabled so the source keeps its original order: `no-descending-specificity` (later, more specific overrides such as the `data-scan="off"` and button-label rules come before the base rules they override) and `no-duplicate-selectors` (`:root` and `:root[data-theme="dark"]` are repeated on purpose to keep the ground tokens next to the ground rules).

## Verification

- `npm test` (lint + build) for every change to the CSS, the scripts, the demo pages, `scripts/`, or `package.json`.
- For visual changes, check `index.html` and `examples/starter.html` over HTTP (root `npm run preview`, then `themes/bootstra-rustomancy/`) at a desktop and a narrow (375px) viewport: light/dark/auto, the three phosphor colours, the three grounds, scanlines on/off, pixel headings and photos after `rustomancy:ready`, the character sheet, dropdown, modal, and toast.
- For build or packaging changes, check `dist/` and `npm pack --workspace bootstra-rustomancy --dry-run` (only `dist/`, `LICENSE`, `README.md`, and `package.json` may ship).

## Versioning and releases

- Semantic Versioning, with this package's `package.json` as the source of truth. The theme came into the collection at `0.2.0`, keeping its own version.
- **Patch** for fixes and small visual corrections that keep the public API; **minor** for new classes, scenes, tokens, or behaviours; **major** for any breaking change to the public API (while the version is `0.x`, a breaking change is a minor bump).
- Every user-visible change adds a line under `## Unreleased` in `CHANGELOG.md`; a release moves them under `## X.Y.Z — YYYY-MM-DD`. A minor or major release also updates the `@X.Y` version in the README CDN links.
- Release tags are `bootstra-rustomancy@X.Y.Z`. Follow [`docs/RELEASING.md`](../../docs/RELEASING.md); only the owner pushes tags.

## Demo security

The demo pages make only these third-party requests: Bootstrap CSS and JavaScript from jsDelivr (`cdn.jsdelivr.net`), and the five fonts from Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`). The favicon is an inline `data:` SVG. Do not add analytics, tracking, or other third-party requests. Theme settings are stored only in the visitor's `localStorage`.
