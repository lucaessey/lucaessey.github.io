// Build fills these tokens from the final website, including every illustration.
const CACHE_NAME = 'lucas-books-v1-3f5c9b882762be07';
const CACHE_PREFIX = 'lucas-books-v1-';
const FILES = [
  {
    "url": "./assets/art/barnaby/cover.webp",
    "integrity": "sha256-KUBTtheZVmq113nDLy7p75x0qMMCoeH6U0vUrHIW3q4="
  },
  {
    "url": "./assets/art/barnaby/sheet-1.webp",
    "integrity": "sha256-7NAMKX0V3KH3E/7W1xQLSyaQhvL6uIu9kyfLL/Pu1hw="
  },
  {
    "url": "./assets/art/barnaby/sheet-2.webp",
    "integrity": "sha256-zrZ82+Gi/uJ7iiz5J+3fRiD0i3lnQw4lWzpGTgfV4pE="
  },
  {
    "url": "./assets/art/barnaby/sheet-3.webp",
    "integrity": "sha256-lgs5U4mbP+lu5nT5MWIDU1Mc2E5AEyYAxbni18r3Acw="
  },
  {
    "url": "./assets/art/barnaby/sheet-4.webp",
    "integrity": "sha256-zFtOU+3iCMNTyRJgumAUV1YJ9qv15wNXWxG+PdV6c2g="
  },
  {
    "url": "./assets/art/barnaby/sheet-5.webp",
    "integrity": "sha256-Lm5ak0DoJVsrl1TukaMcjTtD3zFITsAkUsExut/p4ts="
  },
  {
    "url": "./assets/art/barnaby/sheet-6.webp",
    "integrity": "sha256-ERSbGVpXkRWkniEY5kd4FxCtHBAKhjfqqsy7B/QXVpE="
  },
  {
    "url": "./assets/art/barnaby/sheet-7.webp",
    "integrity": "sha256-6BUhV1NChjag42rBxolwVcsUdjhliVZ2B+8otUfSB5M="
  },
  {
    "url": "./assets/art/barnaby/sheet-8.webp",
    "integrity": "sha256-b7Hsos9ZW1Dp9V7CqhrRoal0zbEWPGxpxYa7TFhu1BE="
  },
  {
    "url": "./assets/art/bazooka-icon.webp",
    "integrity": "sha256-pAeFmAu3vzBmKc0unqAUOUxi34v3pIieFqlYLPcM1oM="
  },
  {
    "url": "./assets/art/bazooka-original.png",
    "integrity": "sha256-61vO/ErrLuWcwYg34ccsBSwHudU+AIAGk+HKicbSH3g="
  },
  {
    "url": "./assets/art/bazooka-sheet-1.webp",
    "integrity": "sha256-Ad9Gt3PdM3X0wyhW2bCibPT/h5/dZUCm97OPdCJ054Q="
  },
  {
    "url": "./assets/art/bazooka-sheet-2.webp",
    "integrity": "sha256-B6+erHBbx3qIeJmqvIyZvpQgnuF/kveYbcBLD2mBNM4="
  },
  {
    "url": "./assets/art/bazooka-sheet-3.webp",
    "integrity": "sha256-+CobaWj2DvqapyJQgyOHTWLZRF4L4G+730di6kePtSc="
  },
  {
    "url": "./assets/art/cover.webp",
    "integrity": "sha256-OKtEVMY95+hgZeimOqZOC3XXLG3as6mQgjaK7zAqh4g="
  },
  {
    "url": "./assets/art/cowbell-symbols.webp",
    "integrity": "sha256-gfRYl5sg7uSV9qTOewTzVJt+EpwK2aQhCCDBbrfMMAQ="
  },
  {
    "url": "./assets/art/friday-cover.webp",
    "integrity": "sha256-Y92PWF7XnK5JjS0eQw4gcB236Zp0K0Allwkc8GZEP80="
  },
  {
    "url": "./assets/art/game-rock.webp",
    "integrity": "sha256-p+dxTQZGbKPjxmea/J4IVcUeeR5bAdFhJrLPyraA3v4="
  },
  {
    "url": "./assets/art/game-yip.webp",
    "integrity": "sha256-gdCWioy2lo5TK1OfV4pR9yXcBsKbwZ0Htke1E5UsaAo="
  },
  {
    "url": "./assets/art/sheet-01.webp",
    "integrity": "sha256-LbrgZCRLdSBMGoAOjOF/sFRqHmgOP8T7eM5U99rz6ZI="
  },
  {
    "url": "./assets/art/sheet-02.webp",
    "integrity": "sha256-x2S03p0IHYprz8w7AOJOzlnjnWT+XqqNGgssO4Qrliw="
  },
  {
    "url": "./assets/art/sheet-03.webp",
    "integrity": "sha256-h9cBvbFyjpJO5SS2lhY9eMm198WaulPMLQewp73jCpw="
  },
  {
    "url": "./assets/art/sheet-04.webp",
    "integrity": "sha256-xrUksw4w76J2MbDRk4S54Znc2o06L8VwdTZdtJDYx3I="
  },
  {
    "url": "./assets/art/sheet-05.webp",
    "integrity": "sha256-65BwV6gv45/4WfA45NUY1/Q/wnL+O4FBXwm8tS+dZSM="
  },
  {
    "url": "./assets/art/sheet-06.webp",
    "integrity": "sha256-si9SsJIenl2u6ltLenrlWF62wtEsTks9nendTONLdLI="
  },
  {
    "url": "./assets/art/sheet-07.webp",
    "integrity": "sha256-eppAtuhbF9IP3hxtfOlOfunFNHo0VCQfp9VfYPSvFbQ="
  },
  {
    "url": "./assets/art/sheet-08.webp",
    "integrity": "sha256-NtJ+30xF2PkNqjz18ety2aprRA1V7PRuVZy0w1+Ww10="
  },
  {
    "url": "./assets/art/sheet-09.webp",
    "integrity": "sha256-2tGaNKnBt8E0qiWQ/o4c2CO6JH56u72c4mGlzXtC2ao="
  },
  {
    "url": "./assets/art/sheet-10.webp",
    "integrity": "sha256-KKHYSZbrYy6oWJQYMXZ8kroQPTH0C+jhLiVIj4u5Zso="
  },
  {
    "url": "./assets/art/sheet-11.webp",
    "integrity": "sha256-3yMfCsCartsTBaWPkMf3vffdSnMzZmbmN7CNjaY6fak="
  },
  {
    "url": "./assets/art/sheet-12.webp",
    "integrity": "sha256-YJKvDuBUKMsbqTLlN2Gzm0hC43+mv/NvRqwNKK27RnU="
  },
  {
    "url": "./assets/art/sheet-13.webp",
    "integrity": "sha256-C6S9Jlr6uGXtoddfrUW+tPJTtn3qy1yBYLarFVu2g34="
  },
  {
    "url": "./assets/art/sheet-14.webp",
    "integrity": "sha256-piCb3iSD4n2kJku6wn8QSOv2cdxtxtMNk51Ktt1stoo="
  },
  {
    "url": "./assets/art/sheet-15.webp",
    "integrity": "sha256-bfbGyida5wNwxOnxieg/y6g0CPZ1n1lbTe8kYeNLXhw="
  },
  {
    "url": "./assets/art/sheet-16.webp",
    "integrity": "sha256-XBATQs1lYUQYYvW/oX3KXfNK6Y+W20G77X+CI4U0gY8="
  },
  {
    "url": "./assets/art/spudville-cover.webp",
    "integrity": "sha256-52IFj84LOSPhFnn8Sgdim/8RLrnWHXl5sjXiXsVnUtM="
  },
  {
    "url": "./assets/bangers.ttf",
    "integrity": "sha256-pa0/BmWOzZJwXDSZzwAP9bDAxvSWQfezplMdzuS9tMA="
  },
  {
    "url": "./assets/comic-neue.ttf",
    "integrity": "sha256-xZSd0lSytxiU8ieDaMYzeLf7vcWJ3xjmQWQwUTUBTzg="
  },
  {
    "url": "./assets/favicon.svg",
    "integrity": "sha256-vCwOW5pKRwhA44QDSsEAblFHWh39zDUjASkHgqLew+s="
  },
  {
    "url": "./assets/icons/apple-touch-icon.png",
    "integrity": "sha256-zVBDB0rvHmfW+bh5t/3rEUHkOvz/vJ75iZg6epLKedc="
  },
  {
    "url": "./assets/icons/books-192.png",
    "integrity": "sha256-F34qfJQPje95VDIl9brjwqInq1xD9et8PzGfDd+nQ24="
  },
  {
    "url": "./assets/icons/books-512.png",
    "integrity": "sha256-e8yz772iYf7k/HzIFTty+q5Oog3jOfkp0YSllzbAe04="
  },
  {
    "url": "./assets/icons/books-maskable-512.png",
    "integrity": "sha256-e8yz772iYf7k/HzIFTty+q5Oog3jOfkp0YSllzbAe04="
  },
  {
    "url": "./assets/icons/books.svg",
    "integrity": "sha256-4r3NS8jZ4XRWOhRaqdRrQ4Hg3tw9cY097QQI7eVqGbY="
  },
  {
    "url": "./barnaby-transcript.html",
    "integrity": "sha256-M8KwV7zyEgtrOyVqb+0q68fCJDq8ygGnx0X1dtlRlvk="
  },
  {
    "url": "./barnaby.css",
    "integrity": "sha256-9eUCD1j/N77oxic7qq+7BUABkigZgDspLnOkVqBedpg="
  },
  {
    "url": "./barnaby.html",
    "integrity": "sha256-DuPFipWuObrsqpk4/TSto7usIxK5hjeMTRJaqzl4kQU="
  },
  {
    "url": "./barnaby.js",
    "integrity": "sha256-ne20Yo/SOfu4QDODQOG8kDWqZ9MSjhCGo9az/NHXglo="
  },
  {
    "url": "./bazooka.html",
    "integrity": "sha256-Xc/oAvy5lji4ojf6ehWYDiYtayFgiNLjsqrWPsxdlJ4="
  },
  {
    "url": "./book-reader.js",
    "integrity": "sha256-9Qz8uW8qt5oriTMV5TaD3SZqmIs7jl1B15RBQJ/6sQg="
  },
  {
    "url": "./descriptions.js",
    "integrity": "sha256-lv32mQYjgBXFssrS8/y9yxwRWMfuu+biSGxxmcM5tOc="
  },
  {
    "url": "./game-core.js",
    "integrity": "sha256-P9JauaAOnXVmQPfOZf6p7SYCV07zzCAtoC4GzucBX2A="
  },
  {
    "url": "./game-play.js",
    "integrity": "sha256-2pBDgo4DOdLsTmgXaxcGL9egbS6jB3A9O6QKM+itxxs="
  },
  {
    "url": "./game.css",
    "integrity": "sha256-C4Dqyp4YsSAsNE8gXJJLCCtgpAw/bYY8P0/tpZg1FF4="
  },
  {
    "url": "./game.html",
    "integrity": "sha256-NLBGkdP1VbdIbhUB4r18mHg2wkHukKxIexdj/ev5oJs="
  },
  {
    "url": "./index.html",
    "integrity": "sha256-khdQ4wCd0TeCgyF8Kr1E+K9lGl52ggaZ43cZfVSqsiQ="
  },
  {
    "url": "./library.css",
    "integrity": "sha256-LuxJBPrCD9tPGXSZBbpVugdSSuZgiHeTIwm8MXuuH/M="
  },
  {
    "url": "./library.js",
    "integrity": "sha256-1zoM2ZBwD+ffXFq2PE6JiPWtUGyfUV+CWiKlRtyfWvU="
  },
  {
    "url": "./manifest.webmanifest",
    "integrity": "sha256-+pTyqLpc0TOHaTGAwTkibBt+Fa0aGbqiUFiAGcAV0Ck="
  },
  {
    "url": "./offline.html",
    "integrity": "sha256-HjCU5bD1uqJWkIX4qwVSFp+9RN53Y/ZZJg8wi32rTfo="
  },
  {
    "url": "./pwa.css",
    "integrity": "sha256-zX7D4SXJ4h6iQRrAz1VVQp2aWb/6ydjN0bN4tsjnSIc="
  },
  {
    "url": "./pwa.js",
    "integrity": "sha256-sCck7N7t1hTQ/PuVj8OgJorX6BSQhLwhY/6FKCgijnw="
  },
  {
    "url": "./reader.js",
    "integrity": "sha256-2ukdrZ7n4Tgi8qj7ogI05S7u1cRkjtFTwnrUEfDGcyU="
  },
  {
    "url": "./story.js",
    "integrity": "sha256-8E1GBgb750hNSVGfs1fmEI6DjuljNrfsfHvvrT9yNRc="
  },
  {
    "url": "./style.css",
    "integrity": "sha256-WxZQC7EFqN/dJZUOCeHMFA5dp6P8q9NtF1c/EKlvJXo="
  },
  {
    "url": "./transcript.html",
    "integrity": "sha256-TWHZUA2OrwpNPu9HP54V5+3YHgPy0uH/q4+LOGa/j2A="
  },
  {
    "url": "./yips.html",
    "integrity": "sha256-BTAXNivnPrHccLaEJeRG9UBewbswvL2u9gC4rAxZYUU="
  }
];
const base = new URL('./', self.location.href);
const entries = new Map(FILES.map(file => [new URL(file.url,base).href,file.integrity]));
function requestFor(url) { return new Request(url,{cache:'reload',integrity:entries.get(url)}); }
async function saveOffline() {
  const cache = await caches.open(CACHE_NAME);
  // addAll commits as one transaction. Integrity prevents a mixed release from
  // becoming active if a deployment or download is only partly available.
  await cache.addAll([...entries.keys()].map(requestFor));
}
async function offlineStatus() {
  const cache = await caches.open(CACHE_NAME);
  const available = new Set((await cache.keys()).map(request => request.url));
  return {ready:[...entries.keys()].every(url=>available.has(url)),version:CACHE_NAME};
}
self.addEventListener('install', event => { event.waitUntil(saveOffline()); });
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') { event.waitUntil(self.skipWaiting()); return; }
  if (!['OFFLINE_STATUS','SAVE_OFFLINE'].includes(event.data?.type)) return;
  event.waitUntil((async () => {
    try {
      if (event.data.type === 'SAVE_OFFLINE') await saveOffline();
      event.ports[0]?.postMessage(await offlineStatus());
    } catch { event.ports[0]?.postMessage({ready:false,version:CACHE_NAME}); }
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
  url.search = ''; url.hash = '';
  if (url.pathname === base.pathname) url.pathname += 'index.html';
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (entries.has(url.href)) {
      const saved = await cache.match(url.href);
      if (saved) return saved;
      try {
        const response = await fetch(requestFor(url.href));
        if (response.ok) {
          await cache.put(url.href,response.clone());
          return response;
        }
        throw new Error('Resource unavailable');
      } catch {
        if (request.mode !== 'navigate') return Response.error();
      }
    } else {
      try { return await fetch(request); }
      catch { if (request.mode !== 'navigate') return Response.error(); }
    }
    const fallback = await cache.match(new URL('offline.html',base).href);
    return fallback ? new Response(await fallback.text(),{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}}) : new Response('This page is unavailable offline. Open the bookshelf when you are connected.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  })());
});
