// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── ONGLET HEURES (vue projet) ─────────────────────────────────────────
function renderProjectHoursTab(proj, container){
  if(!DB.hours) DB.hours=[];
  const todayStr=TODAY_STR;

  // ── Formulaire de saisie rapide ────────────────────────────────────
  const formCard=mkEl('div','background:var(--surface);border-radius:4px;box-shadow:var(--sh,0 1px 3px rgba(0,0,0,.07));padding:16px 18px;margin-bottom:16px;');
  const actorOpts=DB.actors.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
  const taskOpts=proj.steps.map(s=>`<option value="${s.id}">${s.name} (${PHASES[s.phase]?PHASES[s.phase].label:s.phase})</option>`).join('');
  formCard.innerHTML=`
    <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px">+ Ajouter une saisie pour ce projet</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 70px 130px auto;gap:8px;align-items:end;">
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Équipier</div>
        <select id="ph-actor" style="width:100%;font-size:12px;padding:6px 8px;border-radius:4px;border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">${actorOpts}</select>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Tâche</div>
        <select id="ph-task" style="width:100%;font-size:12px;padding:6px 8px;border-radius:4px;border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
          <option value="">— Général —</option>${taskOpts}
        </select>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Durée (h)</div>
        <input type="number" id="ph-dur" min="0.25" max="24" step="0.25" value="1" style="width:100%;font-size:12px;padding:6px 8px;border-radius:4px;border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Date</div>
        <input type="date" id="ph-date" value="${todayStr}" max="${todayStr}" style="width:100%;font-size:12px;padding:6px 8px;border-radius:4px;border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
      </div>
      <div style="padding-top:18px"><button class="btn primary" onclick="addProjectHourEntry('${proj.id}')">Ajouter</button></div>
    </div>
    <div style="margin-top:8px">
      <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Note (optionnel)</div>
      <input type="text" id="ph-note" placeholder="ex: Revue maquettes avec client..." style="width:100%;font-size:12px;padding:6px 8px;border-radius:4px;border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
    </div>`;
  container.appendChild(formCard);

  // ── Saisies du projet ────────────────────────────────────────────────
  const myHours=(DB.hours||[]).filter(h=>h.projId===proj.id);

  // ── Liste des saisies groupées par date ─────────────────────────────
  if(!myHours.length){
    const empty=mkEl('div','text-align:center;padding:32px;color:var(--text3);font-size:13px;');
    empty.textContent="Aucune heure saisie pour ce projet pour l'instant.";
    container.appendChild(empty);return;
  }

  // ── Sous-onglets + liste ─────────────────────────────────────────────
  container.appendChild(buildHoursSubTabs(()=>renderTabContent(DB.projects.find(p=>p.id===proj.id))));
  const renderRow=(h)=>{
    const a=actor(h.actor);const ap=PAL[a.color]||PAL.teal;
    const row=mkEl('div','display:flex;align-items:center;gap:10px;padding:9px 16px;border-bottom:0.5px solid var(--border);');
    row.innerHTML=`
      <div class="avatar av-sm" style="background:${ap.bg};color:${ap.t};width:20px;height:20px;font-size:8px">${a.name.slice(0,2).toUpperCase()}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:var(--text)">${a.name} — ${h.taskName||'Général'}</div>
        ${h.note?`<div style="font-size:10px;color:var(--text3)">${h.note}</div>`:''}
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--text)">${h.dur}h</div>
      <button class="btn-icon sm" title="Supprimer" onclick="deleteHourEntry('${h.id}');renderTabContent(DB.projects.find(p=>p.id==='${proj.id}'))">×</button>`;
    return row;
  };
  if((state.hoursSubTab||'current')==='current'){
    container.appendChild(buildCurrentWeekCard(myHours,renderRow));
  } else {
    container.appendChild(buildWeekAccordion(myHours,renderRow,'week-proj-'+proj.id+'-',()=>renderTabContent(DB.projects.find(p=>p.id===proj.id))));
  }
}

function addProjectHourEntry(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const actorId=document.getElementById('ph-actor').value;
  const taskId=document.getElementById('ph-task').value;
  const dur=parseFloat(document.getElementById('ph-dur').value)||0;
  const date=document.getElementById('ph-date').value;
  const note=document.getElementById('ph-note').value.trim();
  const todayStr=TODAY_STR;

  if(dur<=0){showToast('Indique une durée valide',true);return;}
  if(date>todayStr){showToast('La date ne peut pas être dans le futur',true);return;}

  const step=taskId?proj.steps.find(s=>s.id===taskId):null;
  if(!DB.hours)DB.hours=[];
  DB.hours.push({id:'h'+uid(),actor:actorId,projId:proj.id,taskId,taskName:step?step.name:'Général',dur,date,note});
  document.getElementById('ph-note').value='';
  document.getElementById('ph-dur').value='1';
  saveDB();
  showToast('✅ '+dur+'h ajoutées sur '+proj.name);
  renderTabContent(proj);
}

// ─── FILTRE PAR PÔLE (sélecteurs de projet dans la saisie d'heures) ──────
function buildPoleOptions(){
  const present=new Set(DB.projects.map(p=>p.lane));
  return LANE_ORDER.filter(l=>present.has(l)).map(l=>`<option value="${l}">${l}</option>`).join('');
}
function filterProjSelectByPole(poleSelId,projSelId,onAfter){
  const pole=document.getElementById(poleSelId).value;
  const projSel=document.getElementById(projSelId);
  const projs=pole?DB.projects.filter(p=>p.lane===pole):DB.projects;
  projSel.innerHTML='<option value="">— Projet —</option>'+projs.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  if(onAfter)onAfter();
}

// ─── UTILITAIRES FILTRE SEMAINE ──────────────────────────────────────────
function getMondayStr(dateStr){
  const d=new Date(dateStr+'T12:00:00');
  const dow=d.getDay()||7; // dimanche=0 -> 7
  d.setDate(d.getDate()-(dow-1));
  return localDateStr(d);
}
// Heures saisies par un acteur sur la semaine en cours (lundi → dimanche) — utilisé pour la charge % du dashboard
function actorWeekHours(actorId){
  const monday=getMondayStr(TODAY_STR);
  const sundayD=new Date(monday+'T12:00:00');sundayD.setDate(sundayD.getDate()+6);
  const sunday=localDateStr(sundayD);
  return (DB.hours||[]).filter(h=>h.actor===actorId&&h.date>=monday&&h.date<=sunday).reduce((s,h)=>s+(h.dur||0),0);
}
// Numéro de semaine ISO (1-53) à partir d'une date 'YYYY-MM-DD'
function isoWeekNumber(dateStr){
  const d=new Date(dateStr+'T12:00:00');
  const dow=(d.getDay()+6)%7; // lundi=0
  d.setDate(d.getDate()-dow+3); // jeudi de cette semaine
  const week1=new Date(d.getFullYear(),0,4);
  const week1Mon=new Date(week1);week1Mon.setDate(week1.getDate()-((week1.getDay()+6)%7)+3);
  return 1+Math.round((d-week1Mon)/(7*86400000));
}

// ─── ACCORDÉON PAR SEMAINE (onglets Heures — projet et acteur) ──────────
// `entries` : tableau de saisies d'heures à regrouper.
// `renderEntryRow(h)` : retourne le HTML d'une ligne de saisie (le contexte
//   projet et le contexte acteur n'affichent pas exactement les mêmes infos).
// `accKeyPrefix` : préfixe pour isoler l'état ouvert/fermé (ne pas mélanger
//   avec l'accordéon par pôle, qui utilise déjà state.accordionOpen).
// `rerender` : fonction appelée pour ré-afficher la vue après un clic.
// Regroupe des saisies par date et les affiche (en-tête de date + lignes).
// Utilisé à la fois par "Semaine en cours" (pas d'accordéon) et par chaque
// semaine dépliée de "Toutes les saisies".
function appendDayGroups(targetEl,entries,renderEntryRow,dayActionsHTML){
  const byDate={};
  entries.forEach(h=>{if(!byDate[h.date])byDate[h.date]=[];byDate[h.date].push(h);});
  Object.keys(byDate).sort((a,b)=>b.localeCompare(a)).forEach(date=>{
    const dEntries=byDate[date];const dTotal=dEntries.reduce((s,h)=>s+h.dur,0);
    const dayHdr=document.createElement('div');
    dayHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--surface2);border-bottom:0.5px solid var(--border);';
    dayHdr.innerHTML=`<div style="font-size:12px;font-weight:600;color:var(--text);text-transform:capitalize">${new Date(date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;font-weight:600;color:var(--text)">${dTotal} h</span>
        ${dayActionsHTML?dayActionsHTML(date,dEntries):''}
      </div>`;
    targetEl.appendChild(dayHdr);
    dEntries.forEach(h=>targetEl.appendChild(renderEntryRow(h)));
  });
}

function buildWeekAccordion(entries,renderEntryRow,accKeyPrefix,rerender,dayActionsHTML){
  const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:8px;';
  const byWeek={};
  entries.forEach(h=>{
    const monday=getMondayStr(h.date);
    if(!byWeek[monday])byWeek[monday]={weekNum:isoWeekNumber(h.date),monday,entries:[]};
    byWeek[monday].entries.push(h);
  });
  Object.values(byWeek).sort((a,b)=>b.monday.localeCompare(a.monday)).forEach(week=>{
    const accKey=accKeyPrefix+week.monday;
    const isOpen=!!state.accordionOpen[accKey];
    const total=week.entries.reduce((s,h)=>s+h.dur,0);
    const hdr=document.createElement('div');hdr.className='lane-acc-hdr';
    hdr.innerHTML=`
      <svg class="lane-acc-chevron" style="transform:rotate(${isOpen?90:0}deg)" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="lane-acc-badge" style="background:var(--teal-bg);color:var(--teal-t)">${week.entries.length}</div>
      <div style="flex:1;min-width:0;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <span class="lane-acc-title">Semaine ${week.weekNum}</span>
        <span class="lane-acc-sub" style="margin-top:0">${total} h au total</span>
      </div>`;
    hdr.onclick=()=>{state.accordionOpen[accKey]=!isOpen;rerender();};
    wrap.appendChild(hdr);
    if(isOpen){
      const body=document.createElement('div');body.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);overflow:hidden;margin:-2px 0 4px;';
      appendDayGroups(body,week.entries,renderEntryRow,dayActionsHTML);
      wrap.appendChild(body);
    }
  });
  return wrap;
}

// "Semaine en cours" : pas d'accordéon, juste les jours de la semaine ISO actuelle
function buildCurrentWeekCard(entries,renderEntryRow,dayActionsHTML){
  const monday=getMondayStr(TODAY_STR);
  const sundayD=new Date(monday+'T12:00:00');sundayD.setDate(sundayD.getDate()+6);
  const sunday=localDateStr(sundayD);
  const weekEntries=entries.filter(h=>h.date>=monday&&h.date<=sunday);
  const card=document.createElement('div');
  card.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);overflow:hidden;';
  if(!weekEntries.length){
    const empty=mkEl('div','text-align:center;padding:24px;color:var(--text3);font-size:13px;');
    empty.textContent='Aucune heure saisie cette semaine.';
    card.appendChild(empty);
    return card;
  }
  appendDayGroups(card,weekEntries,renderEntryRow,dayActionsHTML);
  return card;
}

// Sous-onglets "Semaine en cours" / "Toutes les saisies", réutilisés par les
// deux vues Heures (projet et acteur).
function buildHoursSubTabs(onSwitch){
  const current=state.hoursSubTab||'current';
  const subTabs=mkEl('div','display:flex;gap:2px;background:var(--surface2);border-radius:var(--r,10px);padding:3px;margin-bottom:14px;width:fit-content;');
  [['current','Semaine en cours'],['all','Toutes les saisies']].forEach(([id,label])=>{
    const t=mkEl('div','padding:6px 14px;border-radius:var(--r,8px);font-size:12px;font-weight:500;cursor:pointer;transition:background .15s;');
    t.textContent=label;
    if(current===id){t.style.background='var(--surface)';t.style.color='var(--text)';t.style.boxShadow='0 1px 4px rgba(0,0,0,.08)';}
    else{t.style.color='var(--text2)';}
    t.onclick=()=>{state.hoursSubTab=id;onSwitch();};
    subTabs.appendChild(t);
  });
  return subTabs;
}

// ─── ACTOR HOURS VIEW ────────────────────────────────────────────────────
function renderActorHours(container, aid){
  if(!DB.hours) DB.hours=[];
  const todayStr=TODAY_STR;
  const a=actor(aid);

  // Entry form
  const formCard=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:16px 18px;margin-top:16px;margin-bottom:16px;');
  const projOpts=DB.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  formCard.innerHTML=`
    <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px">+ Ajouter une saisie</div>
    <div style="display:grid;grid-template-columns:120px 1fr 1fr 70px 130px auto;gap:8px;align-items:end;">
      <div><div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Pôle</div>
        <select id="ah-pole-${aid}" onchange="filterProjSelectByPole('ah-pole-${aid}','ah-proj-${aid}',()=>updateActorTaskOpts('${aid}'))" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
          <option value="">Tous les pôles</option>${buildPoleOptions()}</select></div>
      <div><div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Projet</div>
        <select id="ah-proj-${aid}" onchange="updateActorTaskOpts('${aid}')" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
          <option value="">— Projet —</option>${projOpts}</select></div>
      <div><div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Tâche</div>
        <select id="ah-task-${aid}" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
          <option value="">— Tâche —</option></select></div>
      <div><div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Durée (h)</div>
        <input type="number" id="ah-dur-${aid}" min="0.25" max="24" step="0.25" value="1"
          style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;"></div>
      <div><div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Date</div>
        <input type="date" id="ah-date-${aid}" value="${todayStr}" max="${todayStr}"
          style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;"></div>
      <div style="padding-top:18px"><button class="btn primary" onclick="addActorHourEntry('${aid}')">Ajouter</button></div>
    </div>
    <div style="margin-top:8px">
      <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500">Note (optionnel)</div>
      <input type="text" id="ah-note-${aid}" placeholder="ex: Revue maquettes avec client..."
        style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;"></div>`;
  container.appendChild(formCard);

  // Stats
  const myHours=DB.hours.filter(h=>h.actor===aid);
  const todayH=myHours.filter(h=>h.date===todayStr);
  // Lundi de la semaine en cours
  const dow=TODAY.getDay()||7; // dimanche=0 -> 7
  const monday=new Date(TODAY);monday.setDate(TODAY.getDate()-(dow-1));
  const mondayStr=monday.toISOString().slice(0,10);
  const weekH=myHours.filter(h=>h.date>=mondayStr&&h.date<=todayStr);
  const statsRow=mkEl('div','display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;');
  statsRow.innerHTML=`
    <div class="kpi"><div class="kpi-label">Aujourd'hui</div><div class="kpi-value info">${todayH.reduce((s,h)=>s+h.dur,0)}h</div><div class="kpi-sub">${todayH.length} saisie${todayH.length!==1?'s':''}</div></div>
    <div class="kpi"><div class="kpi-label">2 dernières semaines</div><div class="kpi-value">${weekH.reduce((s,h)=>s+h.dur,0)}h</div><div class="kpi-sub">${weekH.length} saisie${weekH.length!==1?'s':''}</div></div>
    <div class="kpi"><div class="kpi-label">Total</div><div class="kpi-value">${myHours.reduce((s,h)=>s+h.dur,0)}h</div><div class="kpi-sub">${myHours.length} saisie${myHours.length!==1?'s':''}</div></div>`;
  container.appendChild(statsRow);

  if(!myHours.length){
    const empty=mkEl('div','text-align:center;padding:40px;color:var(--text3);font-size:13px;');
    empty.textContent='Aucune heure saisie pour le moment.';
    container.appendChild(empty);return;
  }

  // ── Sous-onglets + liste ─────────────────────────────────────────────
  container.appendChild(buildHoursSubTabs(()=>renderActorView(aid)));
  const renderRow=(h)=>{
    const proj=DB.projects.find(p=>p.id===h.projId);
    const pp=proj?PAL[proj.color]||PAL.teal:PAL.teal;
    const row=mkEl('div','display:flex;align-items:center;gap:10px;padding:9px 16px;border-bottom:0.5px solid var(--border);');
    row.innerHTML=`
      ${proj?`<span style="background:${pp.bg};border:0.5px solid ${pp.b};color:${pp.t};border-radius:4px;padding:1px 7px;font-size:10px;white-space:nowrap">${proj.name}</span>`:'<span style="font-size:10px;color:var(--text3)">—</span>'}
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:var(--text)">${h.taskName||'Général'}</div>
        ${h.note?`<div style="font-size:10px;color:var(--text3)">${h.note}</div>`:''}
      </div>
      <div style="font-size:13px;font-weight:600">${h.dur}h</div>
      <button class="btn-icon sm" title="Supprimer" onclick="deleteHourEntry('${h.id}');renderActorView('${aid}')">×</button>`;
    return row;
  };
  const dayActions=(date)=>`<button class="btn-icon sm" title="Copier le récap" onclick="event.stopPropagation();copyDaySummaryForActor('${aid}','${date}')">📋</button>`;
  if((state.hoursSubTab||'current')==='current'){
    container.appendChild(buildCurrentWeekCard(myHours,renderRow,dayActions));
  } else {
    container.appendChild(buildWeekAccordion(myHours,renderRow,'week-actor-'+aid+'-',()=>renderActorView(aid),dayActions));
  }
}

function updateActorTaskOpts(aid){
  const projId=document.getElementById('ah-proj-'+aid).value;
  const sel=document.getElementById('ah-task-'+aid);
  sel.innerHTML='<option value="">— Tâche —</option>';
  if(!projId)return;
  const proj=DB.projects.find(p=>p.id===projId);
  if(!proj)return;
  proj.steps.forEach(s=>{const opt=document.createElement('option');opt.value=s.id;opt.textContent=s.name;sel.appendChild(opt);});
}

function addActorHourEntry(aid){
  const projId=document.getElementById('ah-proj-'+aid).value;
  const taskId=document.getElementById('ah-task-'+aid).value;
  const dur=parseFloat(document.getElementById('ah-dur-'+aid).value)||0;
  const date=document.getElementById('ah-date-'+aid).value;
  const note=document.getElementById('ah-note-'+aid).value.trim();
  const todayStr=TODAY_STR;
  if(!projId||dur<=0){showToast('Sélectionne un projet et une durée',true);return;}
  if(date>todayStr){showToast('La date ne peut pas être dans le futur',true);return;}
  const proj=DB.projects.find(p=>p.id===projId);
  const step=proj&&taskId?proj.steps.find(s=>s.id===taskId):null;
  if(!DB.hours)DB.hours=[];
  DB.hours.push({id:'h'+uid(),actor:aid,projId,taskId,taskName:step?step.name:'Général',dur,date,note});
  document.getElementById('ah-note-'+aid).value='';
  document.getElementById('ah-dur-'+aid).value='1';
  saveDB();
  showToast('✅ '+dur+'h ajoutées sur '+(proj?proj.name:''));
  renderActorView(aid);
}

// ─── HOURS VIEW ──────────────────────────────────────────────────────────
function renderHoursView(){
  const lc=document.getElementById('left-col');lc.innerHTML='';

  // ── Init hours DB ────────────────────────────────────────────────────
  if(!DB.hours) DB.hours=[];

  const todayStr=TODAY_STR;

  // ── Header ───────────────────────────────────────────────────────────
  const hdr=mkEl('div','margin-bottom:20px;');
  hdr.innerHTML=`<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px;">⏱ Mes heures</div>
    <div style="font-size:12px;color:var(--text3)">Saisie quotidienne — à recopier dans le logiciel de la boîte</div>`;
  lc.appendChild(hdr);

  // ── Quick entry form ──────────────────────────────────────────────────
  const formCard=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:18px 20px;margin-bottom:20px;');
  const projOpts=DB.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  const actorOpts2=DB.actors.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
  formCard.innerHTML=`
    <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:14px;">+ Ajouter une saisie</div>
    <div style="display:grid;grid-template-columns:110px 1fr 1fr 1fr 80px 80px auto;gap:8px;align-items:end;flex-wrap:wrap;">
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Pôle</div>
        <select id="h-pole" onchange="filterProjSelectByPole('h-pole','h-proj',updateTaskOpts)" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
          <option value="">Tous les pôles</option>${buildPoleOptions()}</select>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Équipier</div>
        <select id="h-actor" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">${actorOpts2}</select>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Projet</div>
        <select id="h-proj" onchange="updateTaskOpts()" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;"><option value="">— Projet —</option>${projOpts}</select>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Tâche</div>
        <select id="h-task" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;"><option value="">— Tâche —</option></select>
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Durée (h)</div>
        <input type="number" id="h-dur" min="0.25" max="24" step="0.25" value="1" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
      </div>
      <div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Date</div>
        <input type="date" id="h-date" value="${todayStr}" style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
      </div>
      <div style="padding-top:18px;">
        <button class="btn primary" onclick="addHourEntry()">Ajouter</button>
      </div>
    </div>
    <div style="margin-top:10px;">
      <div style="font-size:11px;color:var(--text3);margin-bottom:3px;font-weight:500;">Note (optionnel)</div>
      <input type="text" id="h-note" placeholder="ex: Finalisation maquette écran principal..." style="width:100%;font-size:12px;padding:6px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;">
    </div>`;
  lc.appendChild(formCard);

  // ── Today recap ───────────────────────────────────────────────────────
  const todayEntries=DB.hours.filter(h=>h.date===todayStr);
  const todayTotal=todayEntries.reduce((s,h)=>s+h.dur,0);

  const todayCard=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:18px 20px;margin-bottom:16px;');
  const todayHdr=mkEl('div','display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;');
  todayHdr.innerHTML=`
    <div>
      <div style="font-size:14px;font-weight:600;color:var(--text)">Aujourd'hui — ${new Date(todayStr+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</div>
      <div style="font-size:12px;color:var(--text3);margin-top:2px">${todayTotal}h saisies sur ${todayEntries.length} entrée${todayEntries.length!==1?'s':''}</div>
    </div>
    <button class="btn" style="font-size:11px;padding:4px 10px" onclick="copyDaySummary('${todayStr}')">📋 Copier récap</button>`;
  todayCard.appendChild(todayHdr);

  if(todayEntries.length){
    renderHourEntries(todayCard, todayEntries);
  } else {
    const empty=mkEl('div','text-align:center;padding:24px;color:var(--text3);font-size:13px;');
    empty.textContent="Aucune saisie aujourd'hui";
    todayCard.appendChild(empty);
  }
  lc.appendChild(todayCard);

  // ── Weekly recap ──────────────────────────────────────────────────────
  const weekStart=new Date(TODAY);
  weekStart.setDate(weekStart.getDate()-weekStart.getDay()+1);
  const weekEntries=DB.hours.filter(h=>{
    const d=new Date(h.date);return d>=weekStart&&d<=TODAY;
  });
  const weekTotal=weekEntries.reduce((s,h)=>s+h.dur,0);

  if(weekEntries.length){
    const weekCard=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:18px 20px;margin-bottom:16px;');
    const weekHdr=mkEl('div','display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;');
    weekHdr.innerHTML=`
      <div>
        <div style="font-size:14px;font-weight:600;color:var(--text)">Cette semaine</div>
        <div style="font-size:12px;color:var(--text3);margin-top:2px">${weekTotal}h sur ${weekEntries.length} entrée${weekEntries.length!==1?'s':''}</div>
      </div>
      <button class="btn" style="font-size:11px;padding:4px 10px" onclick="copyWeekSummary()">📋 Copier récap semaine</button>`;
    weekCard.appendChild(weekHdr);

    // Group by actor then by project
    const byActor={};
    weekEntries.forEach(h=>{if(!byActor[h.actor])byActor[h.actor]=[];byActor[h.actor].push(h);});
    Object.entries(byActor).forEach(([aid,entries])=>{
      const a=actor(aid);const ap=PAL[a.color]||PAL.teal;
      const aTotal=entries.reduce((s,h)=>s+h.dur,0);
      const aHdr=mkEl('div','display:flex;align-items:center;gap:8px;margin-bottom:8px;margin-top:8px;');
      aHdr.innerHTML=`<div class="avatar av-sm" style="background:${ap.bg};color:${ap.t}">${a.name.slice(0,2).toUpperCase()}</div>
        <span style="font-size:12px;font-weight:600;color:var(--text)">${a.name}</span>
        <span style="font-size:11px;color:var(--text3)">${aTotal}h</span>`;
      weekCard.appendChild(aHdr);

      // By project summary
      const byProj2={};
      entries.forEach(h=>{if(!byProj2[h.projId])byProj2[h.projId]=0;byProj2[h.projId]+=h.dur;});
      const projSummary=mkEl('div','display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;');
      Object.entries(byProj2).forEach(([pid,total])=>{
        const proj=DB.projects.find(p=>p.id===pid);if(!proj)return;
        const pp=PAL[proj.color]||PAL.teal;
        const chip=mkEl('div','');
        chip.innerHTML=`<span style="background:${pp.bg};border:0.5px solid ${pp.b};color:${pp.t};border-radius:5px;padding:2px 8px;font-size:11px">${proj.name} — ${total}h</span>`;
        projSummary.appendChild(chip);
      });
      weekCard.appendChild(projSummary);
    });
    lc.appendChild(weekCard);
  }

  // ── All entries history ───────────────────────────────────────────────
  if(DB.hours.length > todayEntries.length){
    const histCard=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:18px 20px;');
    histCard.innerHTML=`<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:12px;">Historique <span style="font-size:12px;font-weight:400;color:var(--text3)">${DB.hours.length} entrées au total</span></div>`;

    // Group by date descending
    const byDate={};
    DB.hours.forEach(h=>{if(!byDate[h.date])byDate[h.date]=[];byDate[h.date].push(h);});
    Object.keys(byDate).sort((a,b)=>b.localeCompare(a)).slice(0,7).forEach(date=>{
      if(date===todayStr)return;
      const entries=byDate[date];
      const total=entries.reduce((s,h)=>s+h.dur,0);
      const dateHdr=mkEl('div','display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:0.5px solid var(--border);cursor:pointer;');
      dateHdr.innerHTML=`<div style="font-size:12px;font-weight:500;color:var(--text)">${new Date(date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</div>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:11px;color:var(--text3)">${total}h · ${entries.length} entrée${entries.length!==1?'s':''}</span>
          <button class="btn sm" onclick="copyDaySummary('${date}');event.stopPropagation()">📋</button>
        </div>`;
      histCard.appendChild(dateHdr);
      renderHourEntries(histCard, entries, true);
    });
    lc.appendChild(histCard);
  }
}

function renderHourEntries(container, entries, compact=false){
  const table=mkEl('div','border-radius:var(--r,4px);overflow:hidden;');
  entries.sort((a,b)=>b.date.localeCompare(a.date)).forEach(h=>{
    const proj=DB.projects.find(p=>p.id===h.projId);
    const a=actor(h.actor);const ap=PAL[a.color]||PAL.teal;
    const pp=proj?PAL[proj.color]||PAL.teal:PAL.teal;
    const row=mkEl('div','display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:0.5px solid var(--border);');
    row.innerHTML=`
      <div class="avatar av-sm" style="background:${ap.bg};color:${ap.t}" title="${a.name}">${a.name.slice(0,2).toUpperCase()}</div>
      ${proj?`<span style="background:${pp.bg};border:0.5px solid ${pp.b};color:${pp.t};border-radius:4px;padding:1px 6px;font-size:10px;white-space:nowrap">${proj.name}</span>`:'<span style="font-size:10px;color:var(--text3)">Projet supprimé</span>'}
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h.taskName||'—'}</div>
        ${h.note?`<div style="font-size:10px;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${h.note}</div>`:''}
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--text);white-space:nowrap">${h.dur}h</div>
      <button class="btn-icon sm" title="Supprimer" onclick="deleteHourEntry('${h.id}')">×</button>`;
    table.appendChild(row);
  });
  container.appendChild(table);
}

function updateTaskOpts(){
  const projId=document.getElementById('h-proj').value;
  const sel=document.getElementById('h-task');
  sel.innerHTML='<option value="">— Tâche —</option>';
  if(!projId)return;
  const proj=DB.projects.find(p=>p.id===projId);
  if(!proj)return;
  proj.steps.forEach(s=>{
    const opt=document.createElement('option');
    opt.value=s.id;opt.textContent=s.name;sel.appendChild(opt);
  });
}

function addHourEntry(){
  const actor_id=document.getElementById('h-actor').value;
  const projId=document.getElementById('h-proj').value;
  const taskId=document.getElementById('h-task').value;
  const dur=parseFloat(document.getElementById('h-dur').value)||0;
  const date=document.getElementById('h-date').value;
  const note=document.getElementById('h-note').value.trim();
  if(!projId||dur<=0){showToast('⚠ Sélectionne un projet et une durée valide',true);return;}
  const proj=DB.projects.find(p=>p.id===projId);
  const step=proj&&taskId?proj.steps.find(s=>s.id===taskId):null;
  if(!DB.hours)DB.hours=[];
  DB.hours.push({
    id:'h'+uid(),actor:actor_id,projId,taskId,
    taskName:step?step.name:'Général',
    dur,date,note
  });
  document.getElementById('h-note').value='';
  document.getElementById('h-dur').value='1';
  saveDB();
  renderHoursView();
  showToast('✅ Saisie ajoutée — '+dur+'h sur '+(proj?proj.name:''));
}

function deleteHourEntry(id){
  DB.hours=(DB.hours||[]).filter(h=>h.id!==id);
  saveDB();renderHoursView();
}

function copyDaySummary(date){
  const entries=(DB.hours||[]).filter(h=>h.date===date);
  if(!entries.length){showToast('Aucune saisie ce jour',true);return;}
  const byActor={};
  entries.forEach(h=>{if(!byActor[h.actor])byActor[h.actor]=[];byActor[h.actor].push(h);});
  let text=`Saisie du ${new Date(date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}\n${'─'.repeat(40)}\n`;
  Object.entries(byActor).forEach(([aid,ents])=>{
    const a=actor(aid);
    const total=ents.reduce((s,h)=>s+h.dur,0);
    text+=`\n${a.name} (${a.role}) — ${total}h\n`;
    ents.forEach(h=>{
      const proj=DB.projects.find(p=>p.id===h.projId);
      text+=`  • ${proj?proj.name:'?'} / ${h.taskName} — ${h.dur}h${h.note?' ('+h.note+')':''}\n`;
    });
  });
  const total=entries.reduce((s,h)=>s+h.dur,0);
  text+=`\n${'─'.repeat(40)}\nTotal : ${total}h`;
  navigator.clipboard.writeText(text).then(()=>showToast('📋 Récap copié dans le presse-papier !'));
}

function copyDaySummaryForActor(aid,date){
  const entries=(DB.hours||[]).filter(h=>h.actor===aid&&h.date===date);
  if(!entries.length){showToast('Aucune saisie',true);return;}
  const a=actor(aid);
  const total=entries.reduce((s,h)=>s+h.dur,0);
  const dateLabel=new Date(date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const sep='─'.repeat(40);
  let lines=[dateLabel, sep, a.name+' ('+a.role+') — '+total+'h'];
  entries.forEach(h=>{
    const proj=DB.projects.find(p=>p.id===h.projId);
    lines.push('  • '+(proj?proj.name:'?')+' / '+h.taskName+' — '+h.dur+'h'+(h.note?' ('+h.note+')':''));
  });
  lines.push(sep);
  lines.push('Total : '+total+'h');
  navigator.clipboard.writeText(lines.join('\n')).then(()=>showToast('📋 Récap copié !'));
}

function copyWeekSummary(){
  const weekStart=new Date(TODAY);
  weekStart.setDate(weekStart.getDate()-weekStart.getDay()+1);
  const entries=(DB.hours||[]).filter(h=>{const d=new Date(h.date);return d>=weekStart&&d<=TODAY;});
  if(!entries.length){showToast('Aucune saisie cette semaine',true);return;}
  const byDay={};
  entries.forEach(h=>{if(!byDay[h.date])byDay[h.date]=[];byDay[h.date].push(h);});
  let text=`Récap semaine du ${weekStart.toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}\n${'═'.repeat(40)}\n`;
  Object.keys(byDay).sort().forEach(date=>{
    const dayEntries=byDay[date];
    const dayTotal=dayEntries.reduce((s,h)=>s+h.dur,0);
    text+=`\n${new Date(date+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'short'})} — ${dayTotal}h\n`;
    dayEntries.forEach(h=>{
      const proj=DB.projects.find(p=>p.id===h.projId);const a=actor(h.actor);
      text+=`  ${a.name} · ${proj?proj.name:'?'} / ${h.taskName} — ${h.dur}h${h.note?' ('+h.note+')':''}\n`;
    });
  });
  const total=entries.reduce((s,h)=>s+h.dur,0);
  text+=`\n${'═'.repeat(40)}\nTotal semaine : ${total}h`;
  navigator.clipboard.writeText(text).then(()=>showToast('📋 Récap semaine copié !'));
}
