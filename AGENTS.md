# AGENTS.md

This file is the single source of truth for working on this repository as a whole. Read it before making any change and follow it. If a repository-wide rule changes, change it here; other files only point to this one.

Every package also has its own `packages/<slug>/AGENTS.md`. **Before touching a package, read its `AGENTS.md` as well.** Package rules govern that package only; this file governs everything shared.

## Repository overview

This repository is a small collection of Bootstrap 5 themes managed as an npm-workspaces monorepo. Each theme is an autonomous package with its own source, build, demo, documentation, changelog, version, and npm name.

| Package | Folder | npm name | Rules |
| --- | --- | --- | --- |
| bootstra-html32 | `packages/bootstra-html32/` | `bootstra-html32` | [`packages/bootstra-html32/AGENTS.md`](packages/bootstra-html32/AGENTS.md) |
| bootstra-code437 | `packages/bootstra-code437/` | `bootstra-code437` | [`packages/bootstra-code437/AGENTS.md`](packages/bootstra-code437/AGENTS.md) |
| bootstra-win31 | `packages/bootstra-win31/` | `bootstra-win31` | [`packages/bootstra-win31/AGENTS.md`](packages/bootstra-win31/AGENTS.md) |
| bootstra-p31 | `packages/bootstra-p31/` | `bootstra-p31` | [`packages/bootstra-p31/AGENTS.md`](packages/bootstra-p31/AGENTS.md) |
| bootstra-irix | `packages/bootstra-irix/` | `bootstra-irix` | [`packages/bootstra-irix/AGENTS.md`](packages/bootstra-irix/AGENTS.md) |
| bootstra-gunmetal | `packages/bootstra-gunmetal/` | `bootstra-gunmetal` | [`packages/bootstra-gunmetal/AGENTS.md`](packages/bootstra-gunmetal/AGENTS.md) |
| bootstra-rustomancy | `packages/bootstra-rustomancy/` | `bootstra-rustomancy` | [`packages/bootstra-rustomancy/AGENTS.md`](packages/bootstra-rustomancy/AGENTS.md) |
| bootstra-showcase (private) | `apps/showcase/` | not published | [`apps/showcase/AGENTS.md`](apps/showcase/AGENTS.md) |

The collection is called **Bootstra Themes** (subtitle: *Bootstrap 5 Theme Collection*). The repository is [`bloschinsky/bootstra-themes`](https://github.com/bloschinsky/bootstra-themes) (it was `bloschinsky/bootstra-html32` before the rename; that name now belongs only to the HTML32 theme package).

The collection site (`apps/showcase/`) is published to GitHub Pages at `https://bloschinsky.github.io/bootstra-themes/`. It lists every theme and hosts each theme's own demo as a separate page, at `themes/<id>/`.

The root is private and is never published. It only wires the workspaces together and holds shared CI and documentation.

## Package boundaries

Shared infrastructure does not mean shared visual foundations.

- Each package owns its source, build script, tooling configuration, demo, README, CHANGELOG, LICENSE, and version. A change to one package must not silently change another.
- Do not import files from another package, and do not create a shared visual core (tokens, base CSS, mixins) across themes.
- A package's own rules (for example HTML32's CSS-only build, `nv-` prefix, Sass prohibition, and demo layout) apply to that package only. **Never impose them on another theme.** Each theme keeps its own build system, naming, preprocessors, and public CSS API.
- Move code to the root only when at least two packages genuinely need it and the owner agrees.
- The showcase reads theme metadata and copies built demos; it contains no theme-specific code or styles, and themes never depend on it.

## Language

- Use English throughout the repository: code, comments, identifiers, documentation, commit messages, changelogs, demo copy, and workflow names.
- Keep terminology consistent with the surrounding text when editing.

## Development principles

Follow **KISS, DRY, and YAGNI**. Build the smallest solution that fully solves the current task.

- Prefer the simplest readable implementation.
- Do not add abstractions, dependencies, configuration, tooling, or features for hypothetical future needs.
- Root-level scripts (`scripts/`) are plain ES modules using Node.js built-in APIs; plain functions are the default. Tests use `node:test`.

Decision rule: when several approaches satisfy the task, choose the one with fewer moving parts, fewer dependencies, and the code a developer opening the repository later will understand fastest.

## Repository structure

```text
/
├── AGENTS.md                 this file (repository-wide rules)
├── CLAUDE.md                 pointer to AGENTS.md
├── README.md                 collection overview (not per-theme docs)
├── LICENSE
├── package.json              private workspace root, root scripts
├── package-lock.json         the single lockfile for all workspaces
├── docs/
│   ├── ADDING_A_THEME.md     agent checklist for adding a theme
│   └── RELEASING.md          per-package release procedure and npm setup
├── scripts/
│   ├── workspaces.mjs        workspace discovery shared by the scripts and the showcase
│   ├── release.mjs           release tag validation, notes, and assets
│   └── release.test.mjs      its tests (run by the root `npm test`)
├── packages/
│   └── <slug>/               one theme package each, with its own AGENTS.md
├── apps/
│   └── showcase/             the collection site (GitHub Pages), private
├── incoming/                 staging area for themes to add (git-ignored)
└── .github/workflows/        ci.yml, pages.yml, release.yml
```

Generated, never committed, never edited by hand: `node_modules/` and each package's own build output (for the themes: `dist/`, `_site/`; for the showcase: `_site/`).

Keep the structure compact. Do not create new top-level directories without a concrete reason.

## Workspace commands

Run from the repository root:

| Command | What it does |
| --- | --- |
| `npm ci` | Install every workspace from the root lockfile |
| `npm run build` | `build` in every package that has one: themes (`packages/*`) first, then the showcase (`apps/*`) |
| `npm run lint` | `lint` in every package that has one |
| `npm test` | `test` in every package that has one, then the release-check tests |
| `npm run dev` | Dev server of the `bootstra-html32` demo |
| `npm run preview` | Build everything and serve the collection site under its GitHub Pages base path |
| `npm run <script> --workspace <name>` | Run one package's script |
| `npm pack --workspace <name> --dry-run` | Show what a package would publish |

Every package must provide `build`, `lint`, and `test` scripts (`test` may simply run lint and build) so the root scripts and CI cover it.

## Dependencies

- Dependencies are declared in the package that uses them. The root `package.json` has no dependencies.
- Keep exactly one `package-lock.json`, at the root, committed and in sync; CI uses `npm ci`. Do not commit package-level lockfiles.
- When editing the lockfile, update it incrementally with `npm install`; do not delete and regenerate it, which can drop platform-specific optional dependencies.
- Do not upgrade or modernize dependencies or tooling unrelated to the current task.

## Package metadata for the collection

Every theme package declares a small `themeCollection` field in its own `package.json`. It is the only registry: the showcase discovers themes by reading the workspace `package.json` files, so never keep a separate hand-maintained list of themes and never edit the showcase to add one.

```json
"themeCollection": {
  "id": "bootstra-html32",
  "name": "HTML32",
  "description": "Mid-90s web pages and desktop UI chrome: outset buttons, navy title bars, tiled wallpapers.",
  "demo": "_site",
  "preview": "screenshots/screenshot.png"
}
```

- `id` (required): stable, lowercase, URL-safe slug, equal to the package folder name. The demo is published at `themes/<id>/`; never change it once released.
- `name` (required): short display name.
- `description` (required): one sentence, plain text.
- `demo` (optional): folder, relative to the package, that the package's `build` script fills with a self-contained demo. It must contain `index.html` and use only relative links. The showcase copies it unchanged to `themes/<id>/`, so it keeps its own CSS, scripts, and assets (with their licence notices). Without `demo`, the theme still gets a card with install instructions and docs, marked "Demo coming soon".
- `preview` (optional): an image (`.png`, `.jpg`, `.webp`, `.svg`) inside the package, shown on the card. Without it the card shows a placeholder.

Every theme package also sets its standard npm metadata to this repository: `repository` `{ "type": "git", "url": "git+https://github.com/bloschinsky/bootstra-themes.git", "directory": "packages/<slug>" }`, `homepage` `https://bloschinsky.github.io/bootstra-themes/themes/<id>/`, and `bugs.url` `https://github.com/bloschinsky/bootstra-themes/issues`. The root `package.json` `repository.url` is the single source for the repository: the showcase derives its GitHub links and local preview base path from it, and `scripts/release.mjs` rejects a package whose `repository.url` differs.

The card also uses the package's own `name`, `version`, `private`, `style`, `peerDependencies.bootstrap`, and `repository` for install snippets and links. The showcase build fails with the file name and the fix when the metadata is invalid: an unknown field, a bad or duplicate `id`, a missing name or description, or a `demo`/`preview` path that is absolute, outside the package, or missing. Do not add more fields until a feature needs them.

## Adding a theme

The owner adds a theme by placing it in `incoming/<slug>/` (or giving a local path or repository URL) and asking an agent to "add this theme to the collection". Follow [`docs/ADDING_A_THEME.md`](docs/ADDING_A_THEME.md) step by step.

## Working on changes

Before editing:

1. read this file and the `AGENTS.md` of every package you will touch;
2. read the affected files;
3. for visual changes, check how the result looks in the affected package's demo.

During implementation:

- stay within the task scope and the affected package; preserve working behaviour outside it;
- do not make unrelated refactors, reformat untouched code, or reorganize folders;
- reuse existing conventions before inventing new ones.

## Verification

- `npm test` at the root for every change to a package, a root script, `package.json`, or the lockfile.
- Package-specific checks (visual review, pack contents) as listed in that package's `AGENTS.md`.
- For workflow or workspace changes: `npm ci`, the root scripts, and `npm pack --workspace <name> --dry-run` for each publishable package.
- For release changes: the root `npm test` (which includes `scripts/release.test.mjs`) and `node scripts/release.mjs check|notes|assets <tag>` for an existing package. Never test by pushing a tag.

The final report states what was actually checked. Never claim a check passed that was not run.

## Versioning and releases

[`docs/RELEASING.md`](docs/RELEASING.md) is the release procedure. In short:

- Each package is versioned independently with Semantic Versioning; its own `package.json` is the source of truth and its own `CHANGELOG.md` records its changes. Follow the package's `AGENTS.md` for bump rules.
- A change to one package bumps only that package. Repository-only changes (root docs, CI, workspace tooling) do not bump any package version.
- A release tag is `<npm name>@<X.Y.Z>` (for example `bootstra-html32@0.1.1`) and releases exactly that package. Do not create `v*` tags.
- `release.yml` validates the tag with `scripts/release.mjs`, tests the package, publishes it with npm trusted publishing, and creates its GitHub Release. Keep the workflow file name `release.yml`: npm trusted publishers are bound to it.
- The root package is `private` and must never be published.
- When asked to prepare a release, an agent may update the changelog, run `npm version <patch|minor> --workspace <name>`, run the local checks from `docs/RELEASING.md`, commit `Release <name>@X.Y.Z`, and create the local tag. The owner pushes.

## Git and publishing

These rules are mandatory.

- Agents may create local commits when a task is complete and verified. Commit messages are short, meaningful, and in English.
- Commit only files that belong to the current task; never include unrelated or pre-existing user changes, and never commit the contents of `incoming/`.
- Agents may create a local tag (or run `npm version`) only when the user asks for a release.
- **Never run `git push`, push tags, or force-push.** The owner performs every remote push. A request to finish, release, or deploy something is not permission to push.
- **Never run `npm publish`, `gh release create`, or trigger, approve, or re-run workflows.** Publishing happens only through `release.yml` after the owner pushes a tag.
- Do not rewrite shared history, amend pushed commits, or delete branches or tags unless explicitly instructed.
- If a task cannot be fully completed or verified, do not create a misleading "done" commit or tag; leave the working tree in a safe state and report what remains.

## Security

- Never commit secrets, tokens, or credentials. npm publishing uses OIDC trusted publishing and needs no token.
- Demos must not add analytics or tracking. Each package's `AGENTS.md` lists the third-party requests its demo is allowed to make.

## Non-goals

Unless the owner explicitly changes scope, this repository is not:

- a shared theme runtime, theme switcher, or common visual CSS core;
- a theme generator or configurator;
- a fork of Bootstrap. Themes get Bootstrap from npm (as a peer dependency, or as a dependency when a Sass theme compiles Bootstrap's source); never copy Bootstrap's files into the repository.
