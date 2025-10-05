// sw.js v11 — 確実更新・自動切替
const SW_VERSION = "v11";
const CACHE = "kaleido-" + SW_VERSION;

const ASSETS = [
  "./",
  "./index.html?v=11",
  "./manifest.json?v=11",
  "./icon-192.png",
  "./icon-512.png",
  "./Chime.m4a?v=11"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
  // 新SW適用を全クライアントへ通知 → ページ側が受け取って自動リロード
  self.clients.matchAll({type:"window"}).then(clients => {
    clients.forEach(client => client.postMessage({type:"SW_ACTIVATED", version: SW_VERSION}));
  });
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html?v=11", copy));
        return r;
      }).catch(() => caches.match("./index.html?v=11"))
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
