# GUNMETAL OS

A Bootstrap 5.3 theme for Flash-era desktop interfaces: bevelled steel windows, floppy-disk icons, pixel type and one switchable glow colour.

Published on npm as `bootstra-gunmetal`. Part of the [Bootstra Themes](https://bloschinsky.github.io/bootstra-themes/) collection.

**[▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-gunmetal/)**: the assembled prototype site (`index.html`) and the component reference (`docs.html`), with every element as a live example and copyable markup.

## Files

| File | What it is |
|---|---|
| `index.html` | Assembled prototype site (desktop, windows, dock, music, wallpapers) |
| `docs.html` | Component reference: every element with a live example, description and copyable markup |
| `gunmetal.css` | The theme. Load after `bootstrap.min.css` |
| `gunmetal.js` | Optional runtime: glow, wallpapers, draggable windows, sections, music |

The prototype links to the reference and back. The npm package ships `dist/gunmetal.css`, `dist/gunmetal.min.css` and `dist/gunmetal.js`.

## Quick start

Load the fonts and Bootstrap 5.3 first, then the theme, and put `gm-os` on `<body>`. The script is optional.

```html
<html lang="en" data-gm-accent="orange">
<link href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Saira+Condensed:wght@800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstra-gunmetal@0.6/dist/gunmetal.min.css" rel="stylesheet">
<body class="gm-os">
  ...
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstra-gunmetal@0.6/dist/gunmetal.js"></script>
</body>
```

Glow presets: `orange` `amber` `lime` `cyan` `ice` `magenta` `red` `chalk`, or `GM.setAccent('#ff2266')`.

### npm

```sh
npm install bootstrap bootstra-gunmetal
```

Then link `node_modules/bootstra-gunmetal/dist/gunmetal.min.css` (or the readable `gunmetal.css`) after Bootstrap's stylesheet, and optionally `dist/gunmetal.js` after Bootstrap's bundle. Bootstrap is a peer dependency (`^5.3.0`).

### Build from source

```sh
git clone https://github.com/bloschinsky/bootstra-themes.git
cd bootstra-themes
npm ci
npm run build --workspace bootstra-gunmetal   # dist/gunmetal.css, .min.css, .js and the demo in _site/
```

## Theme API

The component reference (`docs.html`) documents every class with its markup. In short:

- **Classes** start with `gm-`: desktop shell (`gm-desktop`, `gm-screen`, `gm-viewport`, `gm-workspace`, `gm-stage`, `gm-dock`), windows (`gm-window`, `gm-window-bar`, `gm-window-head`, `gm-window-body`), dock modules (`gm-module`), icon bar (`gm-icon`), status bar, drop slot, surfaces (`gm-pane`, `gm-plate`), tags, media frame, micro controls (`gm-chip`, `gm-x`), VU meter and wallpapers (`gm-wall-sunrise`, `-overcast`, `-night`, `-arctic`, `-desert`, `-studio`). States are `is-*` (`is-active`, `is-on`, `is-collapsed`).
- **Tokens** are custom properties starting with `--gm-` (`--gm-accent`, `--gm-accent-rgb`, the steel greys, `--gm-scale` and others; see the Tokens section of the reference).
- **Settings on `<html>`**: `data-gm-accent="<preset>"` for the glow colour, `data-gm-text="large"` for larger type, and the `gm-fx-off` class to turn off scanlines, grain and animation.
- Bootstrap components (buttons, forms, cards, alerts, tables, list groups, progress, spinners, navbar, navs, breadcrumb, pagination, dropdowns, accordion, modal, offcanvas, toasts, tooltips) are restyled inside `.gm-os`.

## JavaScript

`gunmetal.js` has no dependencies (Bootstrap's JavaScript is optional) and exposes `window.GM` (`setAccent`, `setWall`, `setText`, `setFx`, `play`, `stop`). Its data API:

| Markup | Behaviour |
|---|---|
| `[data-gm-accent-set="cyan"]` | switch glow colour (fires `gm:accent`) |
| `[data-gm-wall-set="night"]` | switch wallpaper on `.gm-viewport` |
| `[data-gm-target="#id"]` | icon shows a section (grouped by `data-gm-group`) |
| `.gm-draggable .gm-window` | drag by `.gm-window-bar` (≥992px) |
| `[data-gm-reset]`, `[data-gm-close]` | reset or collapse the parent window or module |
| `[data-gm-track]`, `[data-gm-action]` | chip-tune music player and dock actions |

The glow colour, wallpaper, text size and effects setting are remembered in `localStorage` (`gm:accent`, `gm:wall`, `gm:text`, `gm:fx`).

## Browser support

Bootstrap 5.3.x and current Chrome, Edge, Firefox and Safari. Layouts stack below 992px, window dragging is desktop-only, and animations stop under `prefers-reduced-motion`.

## License

[MIT](LICENSE). The demo loads the Silkscreen and Saira Condensed fonts from Google Fonts (SIL Open Font License); the package ships no font files.
