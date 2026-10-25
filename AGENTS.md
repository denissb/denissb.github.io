# AGENTS.md

Guidance for AI coding agents working on this repository.

## Project overview

Personal website/blog/CV for Deniss Borisovs, built with **Lume v3.3.3**
(Deno static site generator) and deployed to **GitHub Pages** via GitHub
Actions.

- Runtime/package manager: **Deno 2.x**
- Site generator: Lume, pinned in `deno.json`
- Templating: Nunjucks (`.njk`, `.page.js`)
- Styling: plain CSS + PostCSS nesting
- Deployment branch: **`master`** (not `main`)
- Output directory: `_site/` (gitignored, generated)

## Commands

Run from the repository root.

```sh
# Build the site into _site/
deno task build

# Build with the production URL used by CI
deno task build --location=https://denissb.github.io/

# Start the live-reloading dev server on http://localhost:3000
deno task serve

# Include draft pages
LUME_DRAFTS=true deno task build
```

The lockfile is disabled (`"lock": false` in `deno.json`) because Lume is pinned
to a jsDelivr URL, so there is no `deno.lock` to maintain.

There is **no test suite or lint task**. Validate changes by building and
inspecting `_site/`.

## Repository map

```text
_config.ts                 Lume configuration, plugins, event handlers
deno.json                  Deno tasks, imports, and Lume version
eventHandlers/             Build-time helpers (CV PDF generation)
_data/site.yml             Global site title, description, author data
_data/decap_cms.js         Decap CMS config (generates _site/admin/)
posts/                     Blog posts + _data.yml defaults for all posts
cv.md                      CV content; frontmatter drives the CV page
index.njk                  Home page; contains duplicated CV skill data
404.md                     Custom 404 page
archive.page.js            Paginated /posts/ archive pages
tags.njk / tag.page.js     Tag index and per-tag pages
feed.xml.njk / feed.page.js  Atom and JSON feeds
search.page.js             Generated /search.json search index
sitemap.xml.njk            Generated sitemap
robots.txt.njk             Generated robots.txt
styles.css                 CSS entrypoint; imports _includes/css/*
_includes/layouts/         Page layouts (base, home, post, archive, tag, cv)
_includes/templates/       Nunjucks partials
_includes/css/             Source CSS, split by feature and CV sections
js/main.js                 Client JS: search component registration, animations
js/vendor/searcher/        Vendored search web component
img/                       Static images/favicons, copied as-is
assets/                    Static files, including generated CV PDF
snaptext/                  Standalone static page, copied as-is
_site/                     Build output; never edit or commit
.github/workflows/         CI: build and deploy to GitHub Pages
```

Other deployment configs (`netlify.toml`, `.fleek.json`) exist but the primary
path is `.github/workflows/build.yml` on `master`.

## Content conventions

### Blog posts

Add Markdown files under `posts/`. `posts/_data.yml` already applies
`type: posts` and `layout: layouts/post.njk`, so new posts only need:

```yaml
---
title: Post title
description: Short description
date: 2025-01-31
tags:
  - Deno
  - Lume
draft: false # optional; drafts are hidden unless LUME_DRAFTS=true
---
```

Posts are sorted by `date` descending. Tags, tag pages, feeds, archive pages,
and search entries are generated automatically from post frontmatter.

### Regular pages

Use a Markdown or `.njk` file with `layout` frontmatter. To add a page to the
site navigation:

```yaml
menu:
  visible: true
  title: Page name
  order: 3
```

Current menu slots: Home `0`, Blog `1`, CV `2`.

### CV

`cv.md` frontmatter is the source for the CV layout and the home-page skills
section. The home page (`index.njk`) duplicates the skills list, so update both
when skill levels change.

`_config.ts` listens for `/cv.md` updates and tries to generate
`assets/Deniss_Borisovs_CV.pdf` (in the source tree, so it can be committed and
deployed) with Puppeteer against `http://localhost:3000/cv/`. PDF generation
therefore needs the dev server running and a local Chrome/Chromium
installation. It is best-effort: missing Chrome or Puppeteer errors are logged
and never fail the build. Set `PUPPETEER_EXECUTABLE_PATH` (or `CHROME_PATH`) to
use a specific browser. After CV changes, verify the PDF was actually updated or
regenerate it manually.

### Dynamic pages

Files ending in `.page.js` export page data/functions consumed by Lume:

- `archive.page.js` generates paginated `/posts/` pages.
- `tag.page.js` generates `/tags/<tag>/` pages.
- `feed.page.js`, `search.page.js` generate JSON outputs.
- `feed.xml.njk`, `sitemap.xml.njk`, etc. generate feed/SEO files. These
  templates set an explicit `url` in frontmatter because Lume 3 no longer
  preserves the extension from the filename (`robots.txt.njk` would otherwise
  become `/robots-txt/`).

Preserve their exported `url`, `layout`, and generator/function shape when
editing. Lume 3's `search.pages()`, `search.page()`, `nextPage()`, and
`previousPage()` return page **data** objects, not page instances (so use
`post.title`, not `post.data.title`).

## Templates and styling

- Layouts live in `_includes/layouts/`; shared partials in
  `_includes/templates/`. Use existing `{% include "..." %}` paths relative to
  `_includes`.
- Templates use Lume's `search.pages()`, `url`, and `date` filters. Keep menu
  and tag URLs consistent with generated routes.
- CSS is imported from `styles.css` in order. Add new CSS files there and
  prefer the existing component/section naming. PostCSS nesting (`& p { ... }`)
  is supported via the `npm:postcss-nesting` plugin configured in `_config.ts`.
- `js/vendor/searcher/searcher.js` is vendored and copied as-is; the client
  entry point is `js/main.js`, which is minified by Terser.
- `_data/decap_cms.js` controls the generated Decap CMS admin under
  `_site/admin/`. Update it if new editable content fields/types are introduced.

## Build/deploy behavior

- `_config.ts` sets the canonical site URL, copies `img`, `assets`, and
  `snaptext`, adds CSS/JS assets for processing, applies
  PostCSS/Terser/date/highlight/base-path/slugify/resolve URL plugins, and
  generates Decap CMS config. Plugin order matters in Lume 3.
- CI runs `deno task build --location=https://denissb.github.io/` and publishes
  `_site` to the `gh-pages` branch on every push to `master`.
- Do not change the deploy branch to `main` unless the workflow is updated too.
- Builds fetch remote dependencies and assets (jsDelivr, JSR, npm, Google
  Fonts); network access is required.

## Agent checklist

1. Run `git status --short` before and after changes.
2. Run `deno task build` and check it completes without errors.
3. Inspect generated output for affected routes (e.g. `_site/index.html`,
   `_site/posts/.../index.html`, `_site/tags/...`, `_site/feed.xml`).
4. Confirm `git status` does not include `_site/` or unexpected changes to
   `js/vendor/` or `assets/Deniss_Borisovs_CV.pdf`.
5. Format changed TypeScript/JavaScript/JSON with `deno fmt <paths>`; avoid
   mass-formatting Markdown or Nunjucks unless requested.
6. Keep changes focused. Do not upgrade Lume/Deno dependencies as a side effect
   of unrelated work; use `deno task lume upgrade` for Lume upgrades.
