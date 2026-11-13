# Bootstra Themes

**Bootstrap 5 Theme Collection.** A small collection of Bootstrap 5 themes. Each theme is its own npm package with its own docs, demo, changelog, and version. Underneath, every page is still Bootstrap: only the look changes.

| Theme | npm | Docs | Demo |
| --- | --- | --- | --- |
| **HTML32**: mid-90s web pages and desktop UI chrome | [`bootstra-html32`](https://www.npmjs.com/package/bootstra-html32) | [README](packages/bootstra-html32/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-html32/) |
| **Code437**: ANSI art, BBS boards and DOS-era terminals | [`bootstra-code437`](https://www.npmjs.com/package/bootstra-code437) | [README](packages/bootstra-code437/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-code437/) |
| **Win31**: Windows 3.1 and Program Manager | [`bootstra-win31`](https://www.npmjs.com/package/bootstra-win31) | [README](packages/bootstra-win31/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-win31/) |
| **P31**: a research terminal on a P31 phosphor CRT | [`bootstra-p31`](https://www.npmjs.com/package/bootstra-p31) | [README](packages/bootstra-p31/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-p31/) |
| **IRIX**: the Indigo Magic desktop of early-90s SGI workstations | [`bootstra-irix`](https://www.npmjs.com/package/bootstra-irix) | [README](packages/bootstra-irix/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-irix/) |
| **Gunmetal**: Flash-era desktops with steel windows and a switchable glow | [`bootstra-gunmetal`](https://www.npmjs.com/package/bootstra-gunmetal) | [README](packages/bootstra-gunmetal/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-gunmetal/) |
| **Rustomancy**: post-atomic pixel art for game sites and in-game UI | [`bootstra-rustomancy`](https://www.npmjs.com/package/bootstra-rustomancy) | [README](packages/bootstra-rustomancy/README.md) | [▶ Live demo](https://bloschinsky.github.io/bootstra-themes/themes/bootstra-rustomancy/) |

Browse them all on the **[collection site](https://bloschinsky.github.io/bootstra-themes/)**. Install and usage instructions live in each theme's README.

## Using a theme

Every theme is installed on its own and loads **after** Bootstrap's CSS. Use one theme per page.

```sh
npm install bootstrap bootstra-html32   # or bootstra-code437, …
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/<theme>@<X.Y>/dist/<file>.min.css">
```

The collection site shows the exact snippet for each theme; some themes need extra setup (for example Code437 expects `data-bs-theme="dark"` and its font), described in their README.

## Repository layout

```
packages/<theme>/   one theme package each: source, build, demo, README, CHANGELOG
apps/showcase/      the collection site published to GitHub Pages
docs/               repository guides (adding a theme, releasing)
scripts/            release checks shared by all packages
.github/workflows/  CI, GitHub Pages, release
```

This is an npm-workspaces monorepo. The root is private and never published.

## Development

Requires Node.js 20 or later.

```sh
npm ci          # install every package from the root lockfile
npm run build   # build every theme, then the collection site
npm run lint    # lint every package
npm test        # lint + build + tests for every package
npm run dev     # build, watch and serve the HTML32 demo on http://localhost:8080
npm run preview # build and serve the collection site on http://localhost:8090/bootstra-themes/
```

Run a single package's script with `--workspace`, for example `npm run build --workspace bootstra-html32`.

GitHub Pages serves the [collection site](https://bloschinsky.github.io/bootstra-themes/) from `master`: a gallery of all themes, with each theme's own demo under `themes/<id>/`. Preview it locally with `npm run preview` (http://localhost:8090/bootstra-themes/).

## Releases

Each theme is versioned and published to npm on its own. A tag such as `bootstra-html32@0.1.1` releases exactly that package; see [`docs/RELEASING.md`](docs/RELEASING.md).

## Adding a theme

Copy a finished theme into `incoming/<slug>/` and ask an agent to add it to the collection. The agent follows [`docs/ADDING_A_THEME.md`](docs/ADDING_A_THEME.md). Repository rules for agents are in [`AGENTS.md`](AGENTS.md).

## License

[MIT](LICENSE). Individual themes state their own licence in their package.
