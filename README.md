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
// app.js - EduTime (simplified)
const $ = sel => document.querySelector(sel);

const DEFAULT_CHALLENGES = [
  {id:1, title:'Estudia 25 minutos', reward:10},
  {id:2, title:'Lee 5 páginas', reward:8},
  {id:3, title:'Haz 10 mins de repaso', reward:6}
];

let seconds = 25*60;
let timer = null;
let points = Number(localStorage.getItem('edutime_points') || 0);
let sessions = JSON.parse(localStorage.getItem('edutime_sessions') || '[]');
let challenges = JSON.parse(localStorage.getItem('edutime_challenges') || 'null') || DEFAULT_CHALLENGES;

function format(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function saveAll(){
  localStorage.setItem('edutime_points', points);
  localStorage.setItem('edutime_sessions', JSON.stringify(sessions));
  localStorage.setItem('edutime_challenges', JSON.stringify(challenges));
}

function render(){
  $('#time').textContent = format(seconds);
  $('#points').textContent = points;
  // sessions
  const ss = $('#sessions'); ss.innerHTML = '';
  sessions.slice(0,8).forEach(s=>{
    const d = document.createElement('div'); d.className='session-item';
    d.innerHTML = `<div>${s.type}</div><div class="small">${new Date(s.date).toLocaleString()}</div>`;
    ss.appendChild(d);
  });
  // challenges
  const chEl = $('#challenges'); chEl.innerHTML = '';
  challenges.forEach(c=>{
    const el = document.createElement('div'); el.className='challenge';
    el.innerHTML = `<div>${c.title}<div class="small">+${c.reward} pts</div></div>
      <div><button class="btn" data-id="${c.id}">Completar</button></div>`;
    chEl.appendChild(el);
  });
  // attach complete buttons
  chEl.querySelectorAll('button').forEach(b=>{
    b.onclick = () => {
      const id = Number(b.dataset.id);
      const ch = challenges.find(x=>x.id===id);
      if(!ch) return;
      points += ch.reward;
      sessions.unshift({id:Date.now(), type:'Reto: '+ch.title, date:new Date().toISOString(), duration:0});
      challenges = challenges.filter(x=>x.id!==id);
      saveAll(); render();
    }
  });
}

$('#startBtn').onclick = () => {
  if(timer) return;
  timer = setInterval(()=> {
    if(seconds<=0){ clearInterval(timer); timer=null; /* finish */ 
      points += 5; sessions.unshift({id:Date.now(), type:'Focus', date:new Date().toISOString(), duration:25*60});
      saveAll(); render(); return;
    }
    seconds--; render();
  },1000);
};
$('#pauseBtn').onclick = () => { clearInterval(timer); timer=null; };
$('#resetBtn').onclick = () => { clearInterval(timer); timer=null; seconds = 25*60; render(); };

document.addEventListener('DOMContentLoaded', () => {
  render();
  // Load editable content from content.json (if present on GitHub Pages)
  fetch('/content.json').then(r=> r.ok ? r.json() : null).then(data => {
    if(data){
      // Example: change title or default challenges if content.json has them
      if(data.title) document.querySelector('.brand h1').textContent = data.title;
      if(data.challenges) { challenges = data.challenges; saveAll(); render(); }
    }
  }).catch(()=>{});
});
{
  "title": "EduTime",
  "slogan": "Convierte tu tiempo en conocimiento.",
  "challenges": [
    {"id":1,"title":"Estudia 25 minutos","reward":10},
    {"id":2,"title":"Lee 5 páginas","reward":8},
    {"id":3,"title":"Haz 10 mins de repaso","reward":6}
  ]
}
