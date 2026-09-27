/* The production build replaces this manifest with every hashed application asset. */
const BUILD = 'be58ef8e887f';
const ASSETS = ["/logic-puzzle/assets/index-BtuIRzZb.js","/logic-puzzle/assets/index-CLB9Dj8f.css","/logic-puzzle/favicon.svg","/logic-puzzle/file.svg","/logic-puzzle/globe.svg","/logic-puzzle/icons/icon-192.png","/logic-puzzle/icons/icon-512.png","/logic-puzzle/manifest.webmanifest","/logic-puzzle/window.svg"];
const SCOPE = new URL(self.registration.scope).pathname;
const PREFIX = `mystery-grids-shell:${SCOPE}:`;
const CACHE = `${PREFIX}${BUILD}`;
async function cacheShell() {
  if (!ASSETS.length)
    throw new Error("Offline downloads are available in the production build.");
  const cache = await caches.open(CACHE);
  await cache.addAll(ASSETS);
  const response = await fetch(SCOPE, { cache: "reload" });
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/html")
  )
    throw new Error("The app could not be saved. Reconnect and retry.");
  await cache.put(SCOPE, response);
}
self.addEventListener("install", (event) => {
  if (ASSETS.length) event.waitUntil(cacheShell());
  // Waiting until the next launch avoids replacing a running app's code underneath it.
});
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      // Only this app's shell caches are managed; player data remains in IndexedDB.
      for (const name of await caches.keys())
        if (name.startsWith(PREFIX) && name !== CACHE)
          await caches.delete(name);
      await self.clients.claim();
    })(),
  ),
);
self.addEventListener("message", (event) => {
  if (event.data?.type === "CACHE_SHELL")
    event.waitUntil(
      cacheShell()
        .then(() => event.ports[0]?.postMessage({ ok: true }))
        .catch((error) =>
          event.ports[0]?.postMessage({ ok: false, error: error.message }),
        ),
    );
});
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(SCOPE) ||
    url.pathname.startsWith(`${SCOPE}api/`)
  )
    return;
  if (request.mode === "navigate" && (url.pathname === SCOPE || url.pathname === `${SCOPE}index.html`)) {
    event.respondWith(
      (async () => {
        // A coherent cached shell stays paired with the assets from this build.
        const cache = await caches.open(CACHE);
        return (await cache.match(SCOPE)) || fetch(request);
      })(),
    );
    return;
  }
  if (ASSETS.includes(url.pathname))
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const hit = await cache.match(url.pathname);
        if (hit) return hit;
        const response = await fetch(request);
        if (response.ok) await cache.put(url.pathname, response.clone());
        return response;
      })(),
    );
});
