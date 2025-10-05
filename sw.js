// sw.js v6  — 確実に更新される版
const SW_VERSION = "v6";
const CACHE = "kaleido-" + SW_VERSION;

// すべて相対パス（GitHub Pages のサブパス /repo/ に対応）
const ASSETS = [
  "./",
  "./index.html?v=6",
  "./manifest.json?v=6",
  "./icon-192.png",
  "./icon-512.png",
  "./Chime.m4a?v=6" // 大文字Cに統一
];

self.addEventListener("install", (e) => {
  // 新SWを即座に waiting へ
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // 旧キャッシュを全削除 & 即制御
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ページからの “SKIP_WAITING” 指示で即時切替
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ネット優先＋失敗時にキャッシュ（navigate は SPA 互換）
self.addEventListener("fetch", (e) => {
  const req = e.request;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html?v=6", copy));
        return r;
      }).catch(() => caches.match("./index.html?v=6"))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return r;
      });
    })
  );
});
