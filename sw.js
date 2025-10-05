// sw.js v1 for BabyShapes
const CACHE='baby-shapes-v1';
const ASSETS=[
  './',
  './index.html?v=1',
  './manifest.json?v=1',
  './icon-192.png',
  './icon-512.png',
  './Chime.mp3'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
  );
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).catch(()=>caches.match('./index.html?v=1')));
    return;
  }
  e.respondWith(caches.match(req).then(cached=>cached || fetch(req).then(r=>{
    const copy=r.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return r;
  })));
});