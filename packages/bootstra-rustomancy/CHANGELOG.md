# Changelog

## Unreleased

- Joined the Bootstra Themes collection as the npm package `bootstra-rustomancy`. The theme sources moved from `dist/` to `src/`; the build now writes `dist/rustomancy.css`, `dist/rustomancy.js` and a new minified `dist/rustomancy.min.css`.
- Removed a dead `display:block` from `.rm-sticky` (it was always overridden by `display:grid` in the same rule; no visual change).

## 0.2.0
- Pixel-art rewrite: every texture, sprite and photo is generated on canvas, palette-quantized, Bayer-dithered and scaled 2x without smoothing.
- Handwritten headings rendered at 1x with hard edges and dithered contours (readable, still pixel).
- New page grounds: sand and cracked desert (`data-ground`).
- Scanline toggle for CRT screens (`data-scan`).
- Pixel fonts: Jersey 15, VT323, Silkscreen.
- All UI copy in English.

## 0.1.0
- First vector prototype (Ukrainian copy).
