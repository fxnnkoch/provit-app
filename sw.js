// Provit – Offline-Speicher. Immer zuerst die neueste Version aus dem Netz holen, ohne Netz die gespeicherte.
const CACHE = 'provit-v69';
const FILES = ['./', './index.html', './info.html', './impressum.html', './datenschutz.html', './manifest.webmanifest', './icon-192-v2.png', './icon-512-v2.png', './apple-touch-icon-v2.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
});
