/* Replaced with a content revision and exact local asset list by Vite. */
const CACHE = 'neon-pong-97f45780af3d51e4';
const ASSETS = ["index.html","assets/index-BKwA7zSb.js","assets/index-DwglJ65B.css","favicon.svg","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","manifest.webmanifest"];
const absolute = path => new URL(path, self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      await cache.addAll(ASSETS.map(path => new Request(absolute(path), { cache: 'reload' })));
    } catch (error) { await caches.delete(CACHE); throw error; }
    // Deliberately no skipWaiting: a downloaded version must not interrupt play.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('neon-pong-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') return (await cache.match(absolute('index.html'))) || fetch(event.request);
    // Static build assets are identical for every request. Preview/hosting servers
    // may send Vary: Origin, while module loads add Origin and precache does not.
    return (await cache.match(event.request, { ignoreVary: true })) || fetch(event.request);
  })());
});

let negotiating = false;
function ask(client) {
  return new Promise(resolve => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); resolve(false); }, 2000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data === true); };
    client.postMessage({ type: 'PREPARE_UPDATE' }, [channel.port2]);
  });
}
async function scopedClients() {
  return (await self.clients.matchAll({ type: 'window', includeUncontrolled: true })).filter(client => client.url.startsWith(self.registration.scope));
}
self.addEventListener('message', event => {
  if (event.data?.type === 'OFFLINE_READY') {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const complete = (await Promise.all(ASSETS.map(path => cache.match(absolute(path))))).every(Boolean);
      event.ports[0]?.postMessage(complete);
    })());
  }
  if (event.data?.type !== 'APPLY_UPDATE' || negotiating) return;
  negotiating = true;
  event.waitUntil((async () => {
    let clients = [];
    try {
      clients = await scopedClients();
      const votes = await Promise.all(clients.map(ask));
      const latest = await scopedClients();
      if (votes.every(Boolean) && latest.length === clients.length && latest.every(c => clients.some(old => old.id === c.id))) {
        await self.skipWaiting();
      } else {
        for (const client of latest) client.postMessage({ type: 'UPDATE_DEFERRED' });
      }
    } catch {
      for (const client of clients) client.postMessage({ type: 'UPDATE_DEFERRED' });
    } finally { negotiating = false; }
  })());
});
