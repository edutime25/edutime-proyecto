# edutime-proyecto
Página web del proyecto EduTime
/ (raíz del repo)
  ├ index.html
  ├ styles.css
  ├ app.js
  ├ manifest.json
  ├ service-worker.js
  ├ content.json        <-- archivo editable desde GitHub (panel de administración)
  ├ favicon.ico
  └ /assets/
       └ logo.png
       const CACHE_NAME = 'edutime-cache-v1';
const OFFLINE_URL = '/';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/favicon.ico'
  // agrega más rutas si subes fotos o assets
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
const CACHE_NAME = 'edutime-cache-v1';
const OFFLINE_URL = '/';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/favicon.ico'
  // agrega más rutas si subes fotos o assets
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>EduTime</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" href="/favicon.ico">
  <meta name="theme-color" content="#1E88E5" />
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="app">
    <!-- Cabecera -->
    <header class="header">
      <div class="brand">
        <img src="assets/logo-192.png" alt="Logo" class="logo" />
        <div>
          <h1>EduTime</h1>
          <small>Convierte tu tiempo en conocimiento.</small>
        </div>
      </div>
      <div class="profile">
        <input id="name" placeholder="Tu nombre" />
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="container">
      <section class="card timer">
        <h2>Modo Enfoque</h2>
        <div id="time" class="time-display">25:00</div>
        <div class="controls">
          <button id="startBtn" class="btn btn-primary">Iniciar 25m</button>
          <button id="pauseBtn" class="btn">Pausar</button>
          <button id="resetBtn" class="btn">Reiniciar</button>
        </div>
        <p class="small">Usa EduTime para concentrarte. Completa retos y gana puntos.</p>
      </section>

      <aside class="card sidebar">
        <h3>Puntos</h3>
        <div id="points">0</div>

        <h3>Retos</h3>
        <div id="challenges"></div>

        <h3>Sesiones</h3>
        <div id="sessions"></div>
      </aside>
    </main>

    <footer class="footer">
      <small>Edutime — Proyecto escolar</small>
    </footer>
  </div>

  <script src="/app.js"></script>

  <script>
    // Registra el service worker (si el navegador lo soporta)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('SW registrado'))
        .catch(err => console.log('SW error', err));
    }
  </script>
</body>
</html>
