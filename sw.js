/* FORMA service worker: aplikacija radi i bez interneta */
const V = "forma-v9";
const SHELL = ["./", "index.html", "css/app.css", "js/app.js", "js/hrana.js", "js/trening.js", "js/trening-data.js", "manifest.webmanifest",
  "assets/fonts/anton-latin.woff2", "assets/fonts/anton-latin-ext.woff2", "assets/fonts/mont-latin.woff2", "assets/fonts/mont-latin-ext.woff2",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/icon-180.png", "js/lib/zxing.min.js"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // network first for app files (so updates arrive), cache fallback offline
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(V).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match("index.html"))));
});
