# Existing account-site content

The public `lucaessey/lucaessey.github.io` repository already hosts multiple projects inside its root. Replacing it with a landing-page-only artifact would remove those routes.

These directories were retrieved from public commit **`2683383ef1d47b2534cf681e2da56806fd6fda8b`** on October 2, 2026 and copied into this workspace without content changes: `books/`, `cowbell/`, `friday/`, `logic-puzzle/`, `neon-pong/`, and `spudville/`.

`projects.json` lists them under `preserveDirectories`. The build requires each directory's `index.html` and copies each whole directory into `dist/`. Neon Pong appears in the selector; the other five are retained at their current addresses for existing readers and bookmarks. They are not added to the requested initial collection.

Keep existing game updates in these root directories and rebuild the landing site to republish them. If merging into a newer checkout of the account repository, preserve newer app files instead of overwriting them with this snapshot. Remove a preservation entry only if you intend to unpublish that content; also use a fresh build directory when doing so.

The temporary `.cache/existing-site` clone is ignored and is not published. Other private game source, databases, and working copies have not been copied, apart from the selected public-facing cover images documented in `artwork.md`.
