// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── TOOLTIP ─────────────────────────────────────────────────────────────
const tt=()=>document.getElementById('tooltip');
function showTT(e,html){const t=tt();t.innerHTML=html;t.style.display='block';moveTT(e);}
function moveTT(e){const t=tt();t.style.left=(e.clientX+16)+'px';t.style.top=(e.clientY-10)+'px';}
function hideTT(){tt().style.display='none';}

// ─── RENDER ──────────────────────────────────────────────────────────────
function render(){
  const app=document.getElementById('app');
  // Top nav bar
  app.innerHTML=`
    <div id="app-inner" style="flex:1;">
      <nav id="top-nav" style="background:var(--bg);border-bottom:none;display:flex;align-items:center;gap:4px;padding:0 20px;height:50px;position:sticky;top:0;z-index:30;flex-shrink:0;">
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--ovalt) 0%,var(--blue-b) 55%,var(--coral-b) 100%);"></div>
        <!-- Logo -->
        <div style="display:flex;align-items:center;gap:7px;margin-right:6px;flex-shrink:0">
          <svg width="18" height="25" viewBox="0 0 87 119" fill="none"><path d="M66.72 109.78C66.3 109.7 65.89 109.59 65.49 109.46C64.69 109.16 64.28 108.96 63.89 108.74C63.05 108.21 62.73 107.95 62.42 107.69C61.73 107.07 61.35 106.67 61.04 106.24C60.07 104.89 59.61 103.59 59.41 102.56C59.21 101.52 59.23 100.77 59.23 100.77C58.54 96 56.71 91.33 53.65 87.18C43.77 73.75 24.91 70.84 11.43 80.62C7.61 83.31 3.12 83.04 0 80.53C2.74 101.81 20.89 118.27 42.92 118.27C52.46 118.27 61.24 115.15 68.4 109.93C66.87 109.8 66.74 109.78 66.74 109.78H66.72Z" fill="#0A5F6B"/><path d="M66.67 39.97C52.92 50.23 50.1 69.1 59.98 82.53C63.02 86.66 66.92 89.79 71.24 91.86C75.36 93.76 76.15 95.52 77.47 98.65C77.67 99.7 77.71 100.66 77.71 100.66C83.03 93.47 86.21 84.6 86.21 74.97C86.21 61.73 78.83 46.66 70.17 33.51C69.94 35.98 68.76 38.34 66.66 39.97H66.67Z" fill="#0A5F6B"/><path d="M9.36 64.86C18.28 68.81 28.87 68.33 37.61 62.92L41.58 60C49.34 53.27 52.95 43.3 51.83 33.61C51.51 30.47 52.84 27.28 55.57 25.27C57.9 23.56 60.75 23.14 63.35 23.81C52.93 9.93 42.91 0 42.91 0C42.91 0 7.3 35.25 0.65 65.74C3.32 63.96 6.57 63.67 9.35 64.85L9.36 64.86Z" fill="#0A5F6B"/></svg>
          <span style="font-size:14px;font-weight:600;color:var(--text);letter-spacing:-.01em">Équipe UX UI</span>
        </div>
        <div style="width:1px;height:16px;background:var(--border-md);margin:0 4px;flex-shrink:0"></div>
        <!-- Tabs -->
        <div id="nav-tabs" style="display:flex;gap:2px;flex:1;"></div>
        <!-- Actions -->
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text3);padding-right:4px;border-right:0.5px solid var(--border-md);margin-right:4px">
            ${TODAY.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}
          </div>
          <div id="sync-btn" style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text3)">
            <svg style="width:14px;height:14px" viewBox="0 0 40 40" fill="none"><path d="M32.25 16.7334C31.1167 10.9834 26.0667 6.66675 20 6.66675C15.1833 6.66675 11 9.40008 8.91667 13.4001C3.9 13.9334 0 18.1834 0 23.3334C0 28.8501 4.48333 33.3334 10 33.3334H31.6667C36.2667 33.3334 40 29.6001 40 25.0001C40 20.6001 36.5833 17.0334 32.25 16.7334ZM17.85 27.1501C17.2 27.8001 16.15 27.8001 15.5 27.1501L12 23.6667C11.35 23.0167 11.35 21.9667 12 21.3167C12.65 20.6667 13.7 20.6667 14.35 21.3167L16.6667 23.6334L24.1333 16.1667C24.7833 15.5167 25.8333 15.5167 26.4833 16.1667C27.1333 16.8167 27.1333 17.8667 26.4833 18.5167L17.85 27.1501Z" fill="currentColor"/></svg>
            Synchronisé
          </div>
          <button onclick="saveToSheets()" class="btn-primary">
            <svg style="width:14px;height:14px" viewBox="0 0 40 40" fill="none"><path d="M32.25 16.7334C31.1167 10.9834 26.0667 6.66675 20 6.66675C15.1833 6.66675 11 9.40008 8.91667 13.4001C3.9 13.9334 0 18.1834 0 23.3334C0 28.8501 4.48333 33.3334 10 33.3334H31.6667C36.2667 33.3334 40 29.6001 40 25.0001C40 20.6001 36.5833 17.0334 32.25 16.7334ZM23.3333 21.6667V28.3334H16.6667V21.6667H11.6667L19.4167 13.9167C19.75 13.5834 20.2667 13.5834 20.6 13.9167L28.3333 21.6667H23.3333Z" fill="#fff"/></svg>
            Sauvegarder
          </button>
          <div style="position:relative">
            <button onclick="toggleMainMenu()" class="btn-icon" aria-label="Options">
              <svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>
            </button>
            <div id="main-menu" style="display:none;position:absolute;top:32px;right:0;background:var(--surface);border-radius:4px;padding:4px;min-width:172px;z-index:50;box-shadow:0 2px 8px rgba(0,0,0,.1),0 0 0 0.5px rgba(0,0,0,.07)">
              <div onclick="syncFromSheets();toggleMainMenu()" style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:4px;font-size:12px;cursor:pointer;color:var(--text)" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='none'">
                <svg style="width:14px;height:14px;color:var(--text3)" viewBox="0 0 40 40" fill="none"><path d="M32.2833 16.7334C31.1333 10.9834 26.0833 6.66675 20.0166 6.66675C15.1999 6.66675 11.0166 9.40008 8.93327 13.4001C3.9166 13.9334 0.0166016 18.1834 0.0166016 23.3334C0.0166016 28.8501 4.49993 33.3334 10.0166 33.3334H31.6833C36.2833 33.3334 40.0166 29.6001 40.0166 25.0001C40.0166 20.6001 36.5999 17.0334 32.2833 16.7334Z" fill="currentColor"/></svg>
                Sync Google Sheets
              </div>
              <div onclick="openNewProject();toggleMainMenu()" style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:4px;font-size:12px;cursor:pointer;color:var(--text)" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='none'">
                <svg style="width:14px;height:14px;color:var(--text3)" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                Nouveau projet
              </div>
              <div style="height:0.5px;background:var(--border);margin:3px 6px"></div>
              <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:4px;font-size:12px;cursor:pointer;color:var(--text)" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='none'">
                <svg style="width:14px;height:14px;color:var(--text3)" viewBox="0 0 40 40" fill="none"><path d="M32.25 16.7334C31.1167 10.9834 26.0667 6.66675 20 6.66675C15.1833 6.66675 11 9.40008 8.91667 13.4001C3.9 13.9334 0 18.1834 0 23.3334C0 28.8501 4.48333 33.3334 10 33.3334H31.6667C36.2667 33.3334 40 29.6001 40 25.0001C40 20.6001 36.5833 17.0334 32.25 16.7334ZM28.3333 21.6667L20.5833 29.4167C20.25 29.7501 19.7333 29.7501 19.4 29.4167L11.6667 21.6667H16.6667V15.0001H23.3333V21.6667H28.3333Z" fill="currentColor"/></svg>
                Importer Excel
                <input type="file" id="excel-import-input" accept=".xlsx" style="display:none" onchange="importExcel(this);toggleMainMenu()">
              </label>
              <div onclick="exportExcel();toggleMainMenu()" style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:4px;font-size:12px;cursor:pointer;color:var(--text)" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='none'">
                <svg style="width:14px;height:14px;color:var(--text3)" viewBox="0 0 40 40" fill="none"><path d="M32.25 16.7334C31.1167 10.9834 26.0667 6.66675 20 6.66675C15.1833 6.66675 11 9.40008 8.91667 13.4001C3.9 13.9334 0 18.1834 0 23.3334C0 28.8501 4.48333 33.3334 10 33.3334H31.6667C36.2667 33.3334 40 29.6001 40 25.0001C40 20.6001 36.5833 17.0334 32.25 16.7334ZM23.3333 21.6667V28.3334H16.6667V21.6667H11.6667L19.4167 13.9167C19.75 13.5834 20.2667 13.5834 20.6 13.9167L28.3333 21.6667H23.3333Z" fill="currentColor"/></svg>
                Exporter Excel
              </div>
              <div style="height:0.5px;background:var(--border);margin:3px 6px"></div>
              <label style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:4px;font-size:12px;cursor:pointer;color:var(--ovalt,#0A5F6B);font-weight:500" onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background='none'">
                <svg style="width:14px;height:14px" viewBox="0 0 40 40" fill="none"><path d="M23.3335 1.66675H16.6668C15.7502 1.66675 15.0002 2.41675 15.0002 3.33341C15.0002 4.25008 15.7502 5.00008 16.6668 5.00008H23.3335C24.2502 5.00008 25.0002 4.25008 25.0002 3.33341C25.0002 2.41675 24.2502 1.66675 23.3335 1.66675ZM20.0002 23.3334C20.9168 23.3334 21.6668 22.5834 21.6668 21.6667V15.0001C21.6668 14.0834 20.9168 13.3334 20.0002 13.3334C19.0835 13.3334 18.3335 14.0834 18.3335 15.0001V21.6667C18.3335 22.5834 19.0835 23.3334 20.0002 23.3334ZM31.7168 12.3167L32.9668 11.0667C33.6002 10.4334 33.6168 9.38341 32.9668 8.73341C32.3002 8.06675 31.2668 8.08341 30.6168 8.71675L29.3668 9.96675C26.7835 7.90008 23.5335 6.66675 20.0002 6.66675C12.0002 6.66675 5.20017 13.2667 5.00017 21.2667C4.7835 29.7334 11.5668 36.6667 20.0002 36.6667C28.3002 36.6667 35.0002 29.9501 35.0002 21.6667C35.0002 18.1334 33.7668 14.8834 31.7168 12.3167ZM20.0002 33.3334C13.5502 33.3334 8.3335 28.1167 8.3335 21.6667C8.3335 15.2167 13.5502 10.0001 20.0002 10.0001C26.4502 10.0001 31.6668 15.2167 31.6668 21.6667C31.6668 28.1167 26.4502 33.3334 20.0002 33.3334Z" fill="currentColor"/></svg>
                Importer Excel de temps Ovalt
                <input type="file" accept=".xlsx" style="display:none" onchange="importFromTimeExcel(this);toggleMainMenu()">
              </label>
            </div>
          </div>
        </div>
      </nav>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) var(--right-w,260px);min-height:calc(100vh - 52px);align-items:stretch;">
        <div class="left-col" id="left-col"></div>
        <div class="right-col" id="right-col"></div>
      </div>
    </div>`;
  renderNavTabs();
  renderRight();
  if(state.view==='global') renderGlobal();
  else if(state.view==='dashboard') renderDashboard();
  else if(state.view==='projects') renderProjectsPage();
  else if(state.view==='detail') renderDetail();
  else if(state.view==='actor') renderActorView(state.actorId);
  else if(state.view==='hours') renderHoursView();
}

function renderNavTabs(){
  const nt=document.getElementById('nav-tabs');if(!nt)return;
  const navIcons={
    global:'<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 40 40" fill="none"><path d="M16.5684 7.34301H7.80586L3.36523 11.6174L7.80586 15.8918H18.2069V38H22.0064V14.2296H16.5684V7.34301Z" fill="currentColor"/><path d="M32.1938 4.04222H22.0064V2H18.2069V12.591H32.1938L36.6344 8.31662L32.1938 4.04222Z" fill="currentColor"/></svg>',
    dashboard:'<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 40 40" fill="none"><path d="M33.3335 9.99992H26.6668V6.66659C26.6668 4.81659 25.1835 3.33325 23.3335 3.33325H16.6668C14.8168 3.33325 13.3335 4.81659 13.3335 6.66659V9.99992H6.66683C4.81683 9.99992 3.35016 11.4833 3.35016 13.3333L3.3335 31.6666C3.3335 33.5166 4.81683 34.9999 6.66683 34.9999H33.3335C35.1835 34.9999 36.6668 33.5166 36.6668 31.6666V13.3333C36.6668 11.4833 35.1835 9.99992 33.3335 9.99992ZM23.3335 9.99992H16.6668V6.66659H23.3335V9.99992Z" fill="currentColor"/></svg>',
    projects:'<svg style="width:13px;height:13px;flex-shrink:0" viewBox="0 0 40 40" fill="none"><path d="M33.3333 8.33333H21.0833L17.5 4.16667H6.66667C4.81667 4.16667 3.35 5.65 3.35 7.5L3.33333 32.5C3.33333 34.35 4.81667 35.8333 6.66667 35.8333H33.3333C35.1833 35.8333 36.6667 34.35 36.6667 32.5V11.6667C36.6667 9.81667 35.1833 8.33333 33.3333 8.33333Z" fill="currentColor"/></svg>',
  };
  const tabs=[
    {id:'global',    label:'Roadmap'},
    {id:'dashboard', label:'Dashboard'},
    {id:'projects',  label:'Projets'},
  ];
  nt.innerHTML='';
  tabs.forEach(t=>{
    const isActive=(t.id==='global')?(state.view!=='dashboard'&&state.view!=='projects'):state.view===t.id;
    const el=document.createElement('div');
    el.style.cssText=`display:flex;align-items:center;gap:5px;padding:0 12px;height:36px;box-sizing:border-box;border-radius:var(--r,10px);font-size:12px;font-weight:500;cursor:pointer;transition:background .12s,color .12s;color:${isActive?'var(--text)':'var(--text3)'};background:${isActive?'var(--surface)':'none'};${isActive?'box-shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04)':''}`;
    el.innerHTML=`${navIcons[t.id]||''}${t.label}`;
    el.onmouseover=()=>{if(!isActive)el.style.background='var(--surface2)';el.style.color='var(--text)';};
    el.onmouseout=()=>{if(!isActive){el.style.background='none';el.style.color='var(--text3)';}};
    el.onclick=()=>{
      if(t.id==='global'){state.view='global';state.projId=null;state.actorId=null;}
      else{state.view=t.id;}
      render();
    };
    nt.appendChild(el);
  });
}

// ─── TOAST NOTIFICATION ──────────────────────────────────────────────────
function showToast(msg, isError=false) {
  let t = document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${isError?'var(--red-bg)':'var(--surface)'};color:${isError?'var(--red-t)':'var(--text)'};border:0.5px solid ${isError?'var(--red-b)':'var(--border-md)'};border-radius:var(--r,4px);padding:10px 20px;font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:500;transition:opacity .3s;`;
  t.style.opacity='1';
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.style.opacity='0'; }, 3000);
}

function toggleMainMenu(){
  const m=document.getElementById('main-menu');
  if(m) m.style.display=m.style.display==='none'?'block':'none';
}

// ─── MENU RAPIDE PROJET (⋯) ──────────────────────────────────────────────
// Un seul menu flottant générique, réutilisé par : le bouton ⋯ des cartes de la
// sidebar, le bouton ⋯ des cartes-anneaux (Dashboard + page Projets), et le clic
// droit sur les barres de la Roadmap. Permet pause/reprise, terminer/réactiver et
// modifier sans avoir à ouvrir la fiche projet.
function closeProjQuickMenu(){
  const m=document.getElementById('proj-quick-menu');if(m)m.remove();
}
function showProjQuickMenu(projId,x,y){
  closeProjQuickMenu();
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const status=projStatusKey(proj);
  const items=[];
  if(status==='termine'){
    items.push({icon:'↩️',label:'Réactiver',action:()=>reactivateProject(projId)});
  }else{
    items.push(status==='pause'
      ?{icon:'▶️',label:'Reprendre',action:()=>togglePauseProject(projId)}
      :{icon:'⏸',label:'Mettre en pause',action:()=>togglePauseProject(projId)});
    items.push({icon:'✅',label:'Terminer le projet',action:()=>terminateProject(projId)});
  }
  items.push({icon:'✏️',label:'Modifier',action:()=>openEditProject(projId)});

  const menu=document.createElement('div');menu.id='proj-quick-menu';
  menu.style.cssText=`position:fixed;left:${x}px;top:${y}px;background:var(--surface);border-radius:var(--r,10px);padding:4px;min-width:178px;z-index:200;box-shadow:0 2px 8px rgba(0,0,0,.1),0 0 0 0.5px rgba(0,0,0,.07);`;
  items.forEach(it=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;font-size:12px;cursor:pointer;color:var(--text);white-space:nowrap;';
    row.innerHTML=`<span style="width:14px;text-align:center;flex-shrink:0">${it.icon}</span>${it.label}`;
    row.onmouseover=()=>row.style.background='var(--surface2)';
    row.onmouseout=()=>row.style.background='none';
    row.onclick=(ev)=>{ev.stopPropagation();closeProjQuickMenu();it.action();};
    menu.appendChild(row);
  });
  document.body.appendChild(menu);
  // Repositionne si le menu dépasse de l'écran (coin bas/droit de l'écran)
  const r=menu.getBoundingClientRect();
  if(r.right>window.innerWidth-8) menu.style.left=Math.max(8,window.innerWidth-r.width-8)+'px';
  if(r.bottom>window.innerHeight-8) menu.style.top=Math.max(8,window.innerHeight-r.height-8)+'px';
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#proj-quick-menu')&&!e.target.closest('[data-proj-menu-btn]')) closeProjQuickMenu();
});
document.addEventListener('contextmenu',e=>{
  if(!e.target.closest('.g-bar')) closeProjQuickMenu();
});
render();
document.addEventListener('click',function(e){
  if(!e.target.closest('#main-menu')&&!e.target.closest('[onclick*="toggleMainMenu"]')){
    const m=document.getElementById('main-menu');
    if(m) m.style.display='none';
  }
});
