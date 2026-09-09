/* Folio service worker — app shell only (S11, locked 2026-07-11).
   Caches the app itself so it opens offline / installs as a PWA.
   NEVER caches vault files, sidecars, or SharePoint API calls —
   content is always fetched live (SharePoint auth requires it anyway).
   To ship an update: bump CACHE version below. */

const CACHE = 'folio-shell-v5';   // B3: bumped so no stale icon survives the update

/* B3 -- THE ICON RULE, written here because manifest.json cannot hold a
   comment. The taskbar icon is captured by the browser when the app is
   INSTALLED. Chrome only revisits it when the manifest's own text changes, so
   replacing icon-192.png in place changes nothing a browser can see: the URL is
   identical, and the stale icon is served from cache until somebody reinstalls.
   That is exactly what happened to Jayson at the 0.35.0 rename.

   So the icon URLs carry a version query (?v=2). WHENEVER THE ICON ART CHANGES,
   BUMP THAT NUMBER IN manifest.json. That is what makes the change visible, and
   the manifest edit is itself the trigger for Chrome to re-read it.

   Recorded honestly, because a half-fix is worse than a known limit: on macOS
   the icon is baked into the .app bundle at install time and Chrome does not
   revisit it, so a Mac may still need a reinstall. The staff run Windows work
   PCs, which is who this is for.

   isShell() below tests the PATHNAME, so a versioned URL still matches and is
   still cached. SHELL stays un-versioned on purpose: pre-caching a URL with a
   number in it would be a second place to remember to bump. */

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
