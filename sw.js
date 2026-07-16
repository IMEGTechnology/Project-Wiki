/* WikiBase service worker — app shell only (S11, locked 2026-07-11).
   Caches the app itself so it opens offline / installs as a PWA.
   NEVER caches vault files, sidecars, or SharePoint API calls —
   content is always fetched live (SharePoint auth requires it anyway).
   To ship an update: bump CACHE version below. */

const CACHE = 'wikibase-shell-v2';

// Core shell. Individual failures tolerated (e.g. /themes/ optional).
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Is this request part of the app shell?
function isShell(url) {
  const u = new URL(url);
  if (u.origin !== self.location.origin) return false;
  const base = self.location.pathname.replace(/sw\.js$/, '');
  if (!u.pathname.startsWith(base)) return false;
  const rel = u.pathname.slice(base.length);
  return rel === '' || rel === 'index.html' || rel === 'manifest.json' ||
         rel.startsWith('icon-') || rel.startsWith('themes/');
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || !isShell(e.request.url)) return; // vault + API: network only

  // Network-first so app updates land immediately; cache is the offline fallback.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
