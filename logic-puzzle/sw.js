/* The production build replaces this manifest with every hashed application asset. */
const BUILD = '8217637a45d5';
const ASSETS = ["/logic-puzzle/assets/index-TApzZ7v0.css","/logic-puzzle/assets/index-VZb6za9E.js","/logic-puzzle/favicon.svg","/logic-puzzle/file.svg","/logic-puzzle/globe.svg","/logic-puzzle/icons/icon-192.png","/logic-puzzle/icons/icon-512.png","/logic-puzzle/intros/story/042b1490872bc890a8e7.mp3","/logic-puzzle/intros/story/0c5040f3d4d743877b3e.mp3","/logic-puzzle/intros/story/163b1b5c7cbe52f17c93.mp3","/logic-puzzle/intros/story/1c9f5813de2688f6508d.mp3","/logic-puzzle/intros/story/1ec7823510b65536818d.mp3","/logic-puzzle/intros/story/27be48dbbc06a04aa165.mp3","/logic-puzzle/intros/story/28442f8c7831e9a6f6ad.mp3","/logic-puzzle/intros/story/2e4df95361236e96da6a.mp3","/logic-puzzle/intros/story/2fed7dc77068ece0a11f.mp3","/logic-puzzle/intros/story/3029690c12a2245cd36f.mp3","/logic-puzzle/intros/story/34ae4c109226c3673a10.mp3","/logic-puzzle/intros/story/3531e4cbae437a739abc.mp3","/logic-puzzle/intros/story/38176e55d7e0339a8e80.mp3","/logic-puzzle/intros/story/3c4de778b0d19c50cbe3.mp3","/logic-puzzle/intros/story/463fd8717f4d043b19da.mp3","/logic-puzzle/intros/story/46ae7ea838c32b3aecd0.mp3","/logic-puzzle/intros/story/4e8aa60da3dbdb634131.mp3","/logic-puzzle/intros/story/5117f131a2cef16ea325.mp3","/logic-puzzle/intros/story/535faf779aa3cbb2304a.mp3","/logic-puzzle/intros/story/5bed3d4c8a4a03f7129c.mp3","/logic-puzzle/intros/story/5c137e2d4dfc602bc697.mp3","/logic-puzzle/intros/story/609820679bb0c68fdc9c.mp3","/logic-puzzle/intros/story/69db08c8d7d1ce6651e9.mp3","/logic-puzzle/intros/story/6fd201b822a9fdb18b0d.mp3","/logic-puzzle/intros/story/71a67b55452f64f09a05.mp3","/logic-puzzle/intros/story/7b2a8f92baa938c8b42a.mp3","/logic-puzzle/intros/story/8a90533e30e2999a3b0c.mp3","/logic-puzzle/intros/story/8b168b757421f9f28ce3.mp3","/logic-puzzle/intros/story/8f89ddd583b549c3b928.mp3","/logic-puzzle/intros/story/914335439a810a5cecdf.mp3","/logic-puzzle/intros/story/930dc8d15d865a9d933d.mp3","/logic-puzzle/intros/story/961f2feb1951d022c1a0.mp3","/logic-puzzle/intros/story/9e46d998a71af0c2f1f2.mp3","/logic-puzzle/intros/story/be4e9f28bb7beaf71aa9.mp3","/logic-puzzle/intros/story/c02e41364523fa5d985f.mp3","/logic-puzzle/intros/story/c29fff86bab6b97db375.mp3","/logic-puzzle/intros/story/c46a42d0349ab7411ef4.mp3","/logic-puzzle/intros/story/c4ff3cfd2c0267c60fd0.mp3","/logic-puzzle/intros/story/c9d09b800f0246873e36.mp3","/logic-puzzle/intros/story/d17cf700c56c56df2733.mp3","/logic-puzzle/intros/story/d2f2aad6a321e8773a80.mp3","/logic-puzzle/intros/story/d3ec2d32db1da72d05f3.mp3","/logic-puzzle/intros/story/dbe790546c3d40a00970.mp3","/logic-puzzle/intros/story/e60322952454e8884f70.mp3","/logic-puzzle/intros/story/ec1b6ca3928d60d85c57.mp3","/logic-puzzle/intros/story/ee579ad069bba6a44ea0.mp3","/logic-puzzle/intros/story/f778cfc5a3de45e7206c.mp3","/logic-puzzle/manifest.webmanifest","/logic-puzzle/window.svg"];
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
