const CACHE = 'mapa-maroto-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './favicon.svg',
  './manifest.json',
  './js/core.js',
  './js/state.js',
  './js/audio.js',
  './js/transitions.js',
  './js/map/map-texture.js',
  './js/map/map-engine.js',
  './js/map/map-render.js',
  './js/map/map-gestures.js',
  './js/map/map-missions.js',
  './js/map/map-secrets.js',
  './js/fx/particles.js',
  './js/fx/ink.js',
  './js/fx/stamp.js',
  './js/fx/footprint.js',
  './js/fx/lighting.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (!e.request.url.startsWith(self.location.origin) || e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html') || caches.match('/index.html');
        return null;
      });
    })
  );
});
