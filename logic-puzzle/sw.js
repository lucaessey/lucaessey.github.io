/* The production build replaces this manifest with every hashed application asset. */
const BUILD = '746c35e129bd';
const ASSETS = ["/logic-puzzle/assets/index-BOIpGR6M.js","/logic-puzzle/assets/index-Ca2m5t-h.css","/logic-puzzle/favicon.svg","/logic-puzzle/file.svg","/logic-puzzle/globe.svg","/logic-puzzle/icons/icon-192.png","/logic-puzzle/icons/icon-512.png","/logic-puzzle/intros/story/028691333f53a94135d2.mp3","/logic-puzzle/intros/story/0378c01256e70f1d88db.mp3","/logic-puzzle/intros/story/0802b893e6b720114e37.mp3","/logic-puzzle/intros/story/0893974327fac1c5fa39.mp3","/logic-puzzle/intros/story/0d7b1c2c91fdcbc7c302.mp3","/logic-puzzle/intros/story/163b1b5c7cbe52f17c93.mp3","/logic-puzzle/intros/story/2011ff841373a87ab6d8.mp3","/logic-puzzle/intros/story/2834c032c78266c744a9.mp3","/logic-puzzle/intros/story/2987ff20f881c8bf6f0b.mp3","/logic-puzzle/intros/story/3531e4cbae437a739abc.mp3","/logic-puzzle/intros/story/3c4de778b0d19c50cbe3.mp3","/logic-puzzle/intros/story/432c85c6de2a23c37fe1.mp3","/logic-puzzle/intros/story/434d4f2a17cd9af18f1a.mp3","/logic-puzzle/intros/story/463fd8717f4d043b19da.mp3","/logic-puzzle/intros/story/46ae7ea838c32b3aecd0.mp3","/logic-puzzle/intros/story/4c3ee2c7654707df97f2.mp3","/logic-puzzle/intros/story/535faf779aa3cbb2304a.mp3","/logic-puzzle/intros/story/71a67b55452f64f09a05.mp3","/logic-puzzle/intros/story/7722b478c24cec4d11fb.mp3","/logic-puzzle/intros/story/7aa66d5c7c89d9fec5b6.mp3","/logic-puzzle/intros/story/8365cdacf679c1838c85.mp3","/logic-puzzle/intros/story/837c6d1b886214d1de09.mp3","/logic-puzzle/intros/story/840f563919709c6a16f8.mp3","/logic-puzzle/intros/story/89ace11f5a2d24d01834.mp3","/logic-puzzle/intros/story/8b168b757421f9f28ce3.mp3","/logic-puzzle/intros/story/8f89ddd583b549c3b928.mp3","/logic-puzzle/intros/story/914335439a810a5cecdf.mp3","/logic-puzzle/intros/story/961f2feb1951d022c1a0.mp3","/logic-puzzle/intros/story/b5f9d7bad73065d7585a.mp3","/logic-puzzle/intros/story/c0eb25b7fb62e92b7ee9.mp3","/logic-puzzle/intros/story/c29fff86bab6b97db375.mp3","/logic-puzzle/intros/story/c4ff3cfd2c0267c60fd0.mp3","/logic-puzzle/intros/story/c9d09b800f0246873e36.mp3","/logic-puzzle/intros/story/d2f2aad6a321e8773a80.mp3","/logic-puzzle/intros/story/dc651130b89866303197.mp3","/logic-puzzle/intros/story/e04c269dd88669dad5e3.mp3","/logic-puzzle/intros/story/e259c0cb82a8212d414a.mp3","/logic-puzzle/intros/story/e532ff5557d5ff45b38a.mp3","/logic-puzzle/intros/story/e5ab8e9b9b5dc8a651d3.mp3","/logic-puzzle/intros/story/e5b6b7734b7e6a4825b5.mp3","/logic-puzzle/intros/story/e986970dd48c59eb72cd.mp3","/logic-puzzle/intros/story/ec1b6ca3928d60d85c57.mp3","/logic-puzzle/intros/story/ed20138d0c5b890bd363.mp3","/logic-puzzle/intros/story/ee579ad069bba6a44ea0.mp3","/logic-puzzle/intros/story/f778cfc5a3de45e7206c.mp3","/logic-puzzle/intros/story/fbc67260cebfbee92ac2.mp3","/logic-puzzle/manifest.webmanifest","/logic-puzzle/window.svg"];
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
  // Only a player-requested update activates over an open game. Never clear saves.
  if (event.data?.type === "ACTIVATE_UPDATE")
    event.waitUntil(self.skipWaiting());
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
