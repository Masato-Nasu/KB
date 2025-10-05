// sw.js v14 — 確実更新・自動切替
const SW_VERSION = "v14";
const CACHE = "radiant-" + SW_VERSION;

const ASSETS = [
  "./",
  "./index.html?v=14",
  "./manifest.json?v=14",
  "./icon-192.png",
  "./icon-512.png",
  "./Chime.mp3"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html?v=14", copy));
        return r;
      }).catch(() => caches.match("./index.html?v=14"))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return r;
    }))
  );
});
