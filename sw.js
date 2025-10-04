const CACHE = 'kaleidobaby-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './babyface-192.png',
  './babyface-512.png',
  './Sparkling Chime Sound.m4a'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith((async () => {
    const cached = await caches.match(req, {ignoreSearch: true});
    if (cached) return cached;
    try {
      const res = await fetch(req);
      return res;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});
