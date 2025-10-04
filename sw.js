const CACHE = 'kaleidobaby-v7';
const ASSETS = ['./','./index.html','./manifest.json','./babyface-192.png','./babyface-512.png','./Sparkling Chime Sound.m4a'];
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  e.respondWith((async () => {
    const cached = await caches.match(e.request, {ignoreSearch:true});
    if (cached) return cached;
    try { return await fetch(e.request); } catch (err) { return cached || Response.error(); }
  })());
});
