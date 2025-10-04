self.addEventListener('install', e=>{
  e.waitUntil(caches.open('graychime-v1').then(c=>c.addAll(['./','./index.html','./manifest.json','./babyface-192.png','./babyface-512.png','./Sparkling Chime Sound.m4a'])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});