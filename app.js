/*
EduTime - app.js
SPA simple: home, timer, tasks, stats, admin.
Reads /content.json for editable content (title, slogan, challenges).
Uses localStorage for user data (sessions, tasks, points).
*/

const DEFAULT_CONTENT = {
  title: "EduTime",
  slogan: "Convierte tu tiempo en conocimiento.",
  challenges: [
    {id:1, title:"Estudia 25 minutos", reward:10},
    {id:2, title:"Lee 5 páginas", reward:8},
    {id:3, title:"Repaso 10 minutos", reward:6}
  ]
};

let CONTENT = DEFAULT_CONTENT;

async function loadContent(){
  try{
    const res = await fetch('/content.json', {cache: "no-store"});
    if(res.ok){ CONTENT = await res.json(); }
  }catch(e){}
  document.getElementById('brand-title').innerText = CONTENT.title || DEFAULT_CONTENT.title;
  document.getElementById('brand-slogan').innerText = CONTENT.slogan || DEFAULT_CONTENT.slogan;
}

// Simple SPA view rendering
const views = {
  home: renderHome,
  timer: renderTimer,
  tasks: renderTasks,
  stats: renderStats,
  admin: renderAdmin
};

function navTo(view){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
  const container = document.getElementById('view-container');
  container.innerHTML = '';
  const el = views[view]();
  container.appendChild(el);
}

function renderHome(){
  const el = document.createElement('div');
  el.className = 'container';
  el.innerHTML = `
    <div class="card">
      <h2>Bienvenida</h2>
      <p class="small">Usa EduTime para organizar tu estudio, cumplir retos y ganar puntos.</p>
      <div class="grid">
        <div>
          <h3>Modo Enfoque</h3>
          <div id="timer-card" class="card">
            <div id="time-display" class="time-display">25:00</div>
            <div class="controls">
              <button class="btn" id="start-25">Iniciar 25m</button>
              <button class="btn secondary" id="pause-btn">Pausar</button>
              <button class="btn secondary" id="reset-btn">Reiniciar</button>
            </div>
            <p class="small">Completa sesiones para ganar puntos y lograr metas.</p>
          </div>
        </div>
        <aside class="sidebar card">
          <div>
            <h4>Puntos</h4>
            <div id="points" style="font-weight:700">0 pts</div>
          </div>
          <div>
            <h4>Retos</h4>
            <div id="challenges-list" class="list"></div>
          </div>
        </aside>
      </div>
    </div>
  `;
  // attach timer events
  setTimeout(()=>{ setupTimerControls('time-display'); renderChallenges(); updatePoints(); },50);
  return el;
}

let timerInterval=null;
let remaining=25*60;
let running=false;
function setupTimerControls(displayId){
  const display = document.getElementById(displayId);
  document.getElementById('start-25')?.addEventListener('click', ()=>{
    startFocus(25*60);
  });
  document.getElementById('pause-btn')?.addEventListener('click', pauseFocus);
  document.getElementById('reset-btn')?.addEventListener('click', resetFocus);
  updateDisplay();
}
function updateDisplay(){
  const d = document.getElementById('time-display');
  if(!d) return;
  d.innerText = formatTime(remaining);
}
function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }
function startFocus(sec){
  if(running) return;
  remaining = sec;
  running = true;
  timerInterval = setInterval(()=> {
    remaining--;
    updateDisplay();
    if(remaining<=0){ clearInterval(timerInterval); running=false; onFocusComplete(); }
  },1000);
}
function pauseFocus(){ if(timerInterval) clearInterval(timerInterval); running=false; }
function resetFocus(){ if(timerInterval) clearInterval(timerInterval); running=false; remaining=25*60; updateDisplay(); }
function onFocusComplete(){
  // award points and save session
  const pts = 5;
  let points = Number(localStorage.getItem('edutime_points') || '0');
  points += pts;
  localStorage.setItem('edutime_points', String(points));
  const sessions = JSON.parse(localStorage.getItem('edutime_sessions') || '[]');
  sessions.unshift({id:Date.now(), type:'Focus', duration:25*60, date:new Date().toISOString()});
  localStorage.setItem('edutime_sessions', JSON.stringify(sessions));
  updatePoints();
  renderStats(); renderChallenges();
  alert('¡Sesión completada! Has ganado ' + pts + ' pts');
}

function renderChallenges(){
  const el = document.getElementById('challenges-list');
  if(!el) return;
  el.innerHTML = '';
  const ch = CONTENT.challenges || [];
  ch.forEach(c=>{
    const div = document.createElement('div'); div.className='task-item';
    div.innerHTML = `<div><strong>${c.title}</strong><div class="small">+${c.reward} pts</div></div>
      <div><button class="btn" data-id="${c.id}">Completar</button></div>`;
    el.appendChild(div);
  });
  el.querySelectorAll('button').forEach(b=>{
    b.onclick = ()=> {
      const id = Number(b.dataset.id);
      const chs = (CONTENT.challenges || []).filter(x=>x.id===id);
      if(!chs.length) return;
      let points = Number(localStorage.getItem('edutime_points') || '0');
      points += chs[0].reward;
      localStorage.setItem('edutime_points', String(points));
      const sessions = JSON.parse(localStorage.getItem('edutime_sessions') || '[]');
      sessions.unshift({id:Date.now(), type:'Reto: '+chs[0].title, duration:0, date:new Date().toISOString()});
      localStorage.setItem('edutime_sessions', JSON.stringify(sessions));
      // remove challenge locally to avoid double
      CONTENT.challenges = (CONTENT.challenges || []).filter(x=>x.id!==id);
      updatePoints(); renderChallenges();
    }
  });
}

function updatePoints(){
  const p = Number(localStorage.getItem('edutime_points') || '0');
  const el = document.getElementById('points');
  if(el) el.innerText = p + ' pts';
}

function renderTasks(){
  const el = document.createElement('div'); el.className='container';
  el.innerHTML = `<div class="card"><h2>Tus tareas</h2>
    <div><input id="taskTitle" class="input" placeholder="Nueva tarea"><button class="btn" id="addTaskBtn">Agregar</button></div>
    <ul id="taskList" class="list"></ul></div>`;
  setTimeout(()=>{ bindTaskEvents(); loadTasks(); },50);
  return el;
}
function bindTaskEvents(){
  document.getElementById('addTaskBtn').onclick = ()=>{
    const t = document.getElementById('taskTitle').value.trim();
    if(!t) return;
    const tasks = JSON.parse(localStorage.getItem('edutime_tasks') || '[]');
    tasks.unshift({id:Date.now(), title:t, done:false});
    localStorage.setItem('edutime_tasks', JSON.stringify(tasks));
    document.getElementById('taskTitle').value='';
    loadTasks();
  }
}
function loadTasks(){
  const list = document.getElementById('taskList');
  list.innerHTML='';
  const tasks = JSON.parse(localStorage.getItem('edutime_tasks') || '[]');
  tasks.forEach(ts=>{
    const li = document.createElement('li'); li.className='task-item';
    li.innerHTML = `<div>${ts.title}</div><div><button class="btn secondary" data-id="${ts.id}">Eliminar</button></div>`;
    list.appendChild(li);
  });
  list.querySelectorAll('button').forEach(b=> b.onclick = ()=>{
    const id = Number(b.dataset.id);
    let tasks = JSON.parse(localStorage.getItem('edutime_tasks') || '[]');
    tasks = tasks.filter(t=> t.id !== id);
    localStorage.setItem('edutime_tasks', JSON.stringify(tasks));
    loadTasks();
  });
}

function renderStats(){
  const el = document.createElement('div'); el.className='container';
  const sessions = JSON.parse(localStorage.getItem('edutime_sessions') || '[]');
  const totalMinutes = sessions.reduce((acc,s)=> acc + Math.round((s.duration||0)/60), 0);
  el.innerHTML = `<div class="card"><h2>Estadísticas</h2>
    <p class="small">Sesiones completadas: ${sessions.length}</p>
    <p class="small">Minutos enfocados: ${totalMinutes}</p>
    <div><h4>Historial</h4><div class="list" id="sessionList"></div></div></div>`;
  setTimeout(()=>{ const sl = document.getElementById('sessionList'); sl.innerHTML = '';
    sessions.slice(0,20).forEach(s=> {
      const d = document.createElement('div'); d.className='session-item';
      d.innerHTML = `<div>${s.type}</div><div class="small">${new Date(s.date).toLocaleString()}</div>`;
      sl.appendChild(d);
    });
  },50);
  return el;
}

function renderAdmin(){
  const el = document.createElement('div'); el.className='container';
  el.innerHTML = `<div class="card"><h2>Panel de administración</h2>
    <div class="admin-area">
      <label>Título de la app</label><input id="adminTitle" class="input">
      <label>Eslogan</label><input id="adminSlogan" class="input">
      <label>Editar retos (JSON)</label><textarea id="adminChallenges" rows="6"></textarea>
      <div style="display:flex;gap:8px"><button class="btn" id="saveContent">Guardar local (no GitHub)</button>
      <button class="btn secondary" id="openGithub">Editar content.json en GitHub</button></div>
      <p class="small">Nota: para cambios permanentes que editen la web, edita el archivo <code>content.json</code> en tu repositorio con la app de GitHub.</p>
    </div></div>`;
  setTimeout(()=>{ document.getElementById('adminTitle').value = CONTENT.title || '';
    document.getElementById('adminSlogan').value = CONTENT.slogan || '';
    document.getElementById('adminChallenges').value = JSON.stringify(CONTENT.challenges || [], null, 2);
    document.getElementById('saveContent').onclick = ()=> {
      CONTENT.title = document.getElementById('adminTitle').value;
      CONTENT.slogan = document.getElementById('adminSlogan').value;
      try{ CONTENT.challenges = JSON.parse(document.getElementById('adminChallenges').value); }
      catch(e){ alert('JSON inválido en retos'); return; }
      // save to localStorage for preview
      localStorage.setItem('edutime_content_preview', JSON.stringify(CONTENT));
      alert('Cambios guardados localmente. Para publicarlos permanentemente, edita content.json en GitHub.');
      document.getElementById('brand-title').innerText = CONTENT.title;
      document.getElementById('brand-slogan').innerText = CONTENT.slogan;
      renderChallenges();
    };
    document.getElementById('openGithub').onclick = ()=> {
      // Open repository content.json in GitHub - user can edit it there
      const url = `https://github.com/edutime25/edutime-proyecto/blob/main/content.json`;
      window.open(url,'_blank');
    };
  },50);
  return el;
}

// initial setup
document.addEventListener('DOMContentLoaded', async ()=>{
  await loadContent();
  // if user has local preview content, use it
  const preview = localStorage.getItem('edutime_content_preview');
  if(preview) {
    try{ CONTENT = JSON.parse(preview); }catch(e){}
  }
  document.querySelectorAll('.nav-btn').forEach(b=>{
    b.addEventListener('click', ()=> navTo(b.dataset.view));
  });
  navTo('home');
  updatePoints();
});
