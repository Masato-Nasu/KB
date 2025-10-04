self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('kaleidobaby-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './babyface-192.png',
        './babyface-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
