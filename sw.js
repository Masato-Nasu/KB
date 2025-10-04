self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open('kaleidobaby-ref-v1').then(c=>c.addAll([
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './Sparkling Chime Sound.m4a'
  ])));
});
self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!=='kaleidobaby-ref-v1').map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e=>{
  e.respondWith((async()=>{
    const cached = await caches.match(e.request, {ignoreSearch:true});
    if (cached) return cached;
    try{ const res = await fetch(e.request); return res; }catch(e){ return cached || Response.error(); }
  })());
});