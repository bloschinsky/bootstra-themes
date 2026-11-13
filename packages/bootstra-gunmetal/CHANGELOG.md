# Changelog

## Unreleased

## 0.6.0 — 2026-11-14

First release in the Bootstra Themes collection, published to npm as `bootstra-gunmetal`.

### Added
- `gunmetal.css` theme for Bootstrap 5.3 in the style of a Flash-era desktop: `--gm-*` tokens and `gm-*` classes for the desktop shell, windows, dock modules, icon bar, status bar, drop slot, surfaces, tags, micro controls, VU meter and wallpapers.
- Eight glow presets (`data-gm-accent`) plus custom colours, a large text scale (`data-gm-text="large"`) and an effects-off mode (`gm-fx-off`).
- Restyled Bootstrap components inside `.gm-os`.
- Optional `gunmetal.js` (`window.GM`): glow, wallpapers, draggable windows, sections, chip-tune music, clock.
- Prototype site (`index.html`) and component reference (`docs.html`).
- Minified `dist/gunmetal.min.css`.

### Fixed
- The drop-slot corner ticks (`.gm-slot-hole`) used an invalid `background-position` value, so browsers ignored the whole declaration; the bottom-left ticks now use `left 3px bottom 3px`.
