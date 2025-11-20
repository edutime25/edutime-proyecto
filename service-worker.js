const CACHE_NAME = 'edutime-cache-v1';
const FILES = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.json', '/assets/logo-192.png', '/assets/logo-512.png'];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k!==CACHE_NAME) return caches.delete(k); }))));
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if(evt.request.mode === 'navigate'){
    evt.respondWith(fetch(evt.request).catch(() => caches.match('/index.html')));
    return;
  }
  evt.respondWith(caches.match(evt.request).then(r => r || fetch(evt.request)));
});
