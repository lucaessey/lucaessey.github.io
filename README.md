# Deep Fried Pixels

An arcade-inspired collection of browser games and creative projects.

**Live site: [lucaessey.github.io](https://lucaessey.github.io/).** The intended custom domain is `www.deepfriedpixels.com`; the domain cutover is configured separately in GitHub Pages and Squarespace.

## Edit and preview

Use this repository's `main` branch for the public landing page. Node.js 22 or later is required; there are no npm dependencies to install.

```powershell
npm run build
npm start
```

Open `http://127.0.0.1:4321`. The catalog lives in `projects.json`, the layout and styles in `src/`, and cover images in `assets/`. Game links use their exact repository paths, including capitalization. Local preview redirects separately hosted games to their existing GitHub Pages addresses.

The build defaults to the planned custom domain for metadata. To preview the current GitHub address in canonical links and the sitemap:

```powershell
$env:SITE_URL = 'https://lucaessey.github.io'
npm run build
```

## Publish

GitHub Pages uses **GitHub Actions**. Push reviewed changes to `main` to run **Publish Deep Fried Pixels**. It reads the active Pages URL, builds `dist/`, and deploys only that generated directory. After changing a custom domain in Pages settings, rerun the workflow so canonical metadata and the sitemap follow the new address.

The existing `books/`, `cowbell/`, `friday/`, `logic-puzzle/`, `neon-pong/`, and `spudville/` directories are required build inputs and remain accessible at their existing paths. Keep their current published files when updating the landing page. See [preserved content](docs/preserved-content.md) and [artwork credits](docs/artwork.md).

The original homepage and repository README are retained in `deprecated/2026-10-04-original-homepage/`. That folder is not part of the deployed artifact. Keep retired files until cleanup is explicitly approved; see [AGENTS.md](AGENTS.md).

## Add another project

Add a cover image to `assets/` and an entry to `projects.json`. The `slug` must match the published repository name or preserved directory exactly. Choose `type: "game"` or `type: "project"`, build, review, then commit and push. Existing game repositories continue their own independent deployments.
