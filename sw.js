const CACHE = 'kaleidobaby-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './babyface-192.png',
  './babyface-512.png',
  './Sparkling Chime Sound.m4a'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => cached || fetch(req))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
