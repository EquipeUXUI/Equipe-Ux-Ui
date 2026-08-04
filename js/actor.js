// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── ACTOR VIEW ──────────────────────────────────────────────────────────
function renderActorView(aid){
  const a=actor(aid);const ap=PAL[a.color]||PAL.teal;
  const lc=document.getElementById('left-col');lc.innerHTML='';

  // Back
  const back=document.createElement('div');back.className='detail-back';
  back.innerHTML='← Tous les projets';
  back.onclick=()=>{state.view='global';state.projId=null;state.actorId=null;render();};
  lc.appendChild(back);

  // Title
  const titleRow=document.createElement('div');
  titleRow.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:6px;';
  titleRow.innerHTML=`<div class="avatar" style="width:40px;height:40px;font-size:14px;background:${ap.bg};color:${ap.t}">${a.name.slice(0,2).toUpperCase()}</div>
    <div><div class="detail-title" style="margin-bottom:0">${a.name}</div><div class="detail-meta" style="margin-bottom:0">${a.role}</div></div>`;
  lc.appendChild(titleRow);

  // Gather tasks — une tâche peut avoir plusieurs assignés, on inclut celles où aid en fait partie
  const myTasks=DB.projects.flatMap(p=>p.steps.filter(s=>stepAssignees(s).includes(aid)).map(s=>({...s,projName:p.name,projId:p.id})));
  const late=myTasks.filter(s=>isLate(s)).length;
  const done=myTasks.filter(s=>s.done).length;
  const cost=myTasks.reduce((s,t)=>s+(t.cost||0),0);
  const inProgress=myTasks.filter(s=>!s.done&&!isLate(s)).length;

  // KPIs
  const kpi=document.createElement('div');kpi.className='d-kpi-row';kpi.style.marginTop='16px';
  kpi.innerHTML=`
    <div class="kpi"><div class="kpi-label">Tâches totales</div><div class="kpi-value info">${myTasks.length}</div><div class="kpi-sub">sur ${DB.projects.length} projets</div></div>
    <div class="kpi"><div class="kpi-label">En cours</div><div class="kpi-value">${inProgress}</div><div class="kpi-sub">tâche${inProgress!==1?'s':''}</div></div>
    <div class="kpi"><div class="kpi-label">Terminées</div><div class="kpi-value ok">${done}</div><div class="kpi-sub">sur ${myTasks.length}</div><div class="kpi-bar"><div class="kpi-bar-fill" style="width:${myTasks.length?Math.round(done/myTasks.length*100):0}%;background:var(--teal-b)"></div></div></div>
    <div class="kpi"><div class="kpi-label">Retards</div><div class="kpi-value ${late?'warn':''}">${late}</div><div class="kpi-sub">tâche${late!==1?'s':''}</div></div>
    ${cost?`<div class="kpi"><div class="kpi-label">Coût total</div><div class="kpi-value">${cost.toLocaleString('fr-FR')}€</div></div>`:''}
  `;
  lc.appendChild(kpi);

  // ── Sub-tabs: À faire / Terminées / Heures ─────────────────────────────
  const actorTab = state.actorTab || 'active';
  const subTabs = mkEl('div','display:flex;gap:2px;background:var(--surface2);border-radius:var(--r,4px);padding:3px;margin-top:16px;width:fit-content;');
  [['active','📋 À faire'],['done','✓ Terminées'],['hours','⏱ Heures']].forEach(([id,label])=>{
    const t=mkEl('div','padding:6px 16px;border-radius:var(--r,4px);font-size:12px;font-weight:500;cursor:pointer;transition:background .15s;');
    t.textContent=label;
    if(actorTab===id){ t.style.background='var(--surface)'; t.style.color='var(--text)'; t.style.boxShadow='0 1px 4px rgba(0,0,0,.08)'; }
    else { t.style.color='var(--text2)'; }
    t.onclick=()=>{state.actorTab=id;renderActorView(aid);};
    subTabs.appendChild(t);
  });
  lc.appendChild(subTabs);

  if(actorTab==='hours'){
    renderActorHours(lc, aid);
    return;
  }

  const visibleTasks = actorTab==='done' ? myTasks.filter(t=>t.done) : myTasks.filter(t=>!t.done);

  if(!myTasks.length){
    const empty=document.createElement('div');
    empty.style.cssText='text-align:center;padding:48px;color:var(--text3);font-size:13px;background:var(--surface);border-radius:var(--r,4px);border:0.5px dashed var(--border-md);margin-top:16px;';
    empty.textContent='Aucune tâche assignée pour le moment.';
    lc.appendChild(empty);return;
  }
  if(!visibleTasks.length){
    const empty=document.createElement('div');
    empty.style.cssText='text-align:center;padding:48px;color:var(--text3);font-size:13px;background:var(--surface);border-radius:var(--r,4px);border:0.5px dashed var(--border-md);margin-top:16px;';
    empty.textContent=actorTab==='done'?'Aucune tâche terminée pour le moment.':'Tout est fait ! Aucune tâche en attente.';
    lc.appendChild(empty);return;
  }

  // Tasks grouped by project
  const sh=document.createElement('div');sh.className='section-header';sh.style.marginTop='20px';
  sh.innerHTML=`<div class="section-title">${actorTab==='done'?'Tâches terminées':'Tâches à faire'} — ${a.name}</div>`;lc.appendChild(sh);

  const byProj={};
  visibleTasks.forEach(t=>{if(!byProj[t.projId])byProj[t.projId]=[];byProj[t.projId].push(t);});

  Object.entries(byProj).forEach(([pid,tasks])=>{
    const proj=DB.projects.find(p=>p.id===pid);if(!proj)return;
    const pp=PAL[proj.color]||PAL.teal;

    // Project label
    const projLbl=document.createElement('div');
    projLbl.style.cssText='display:flex;align-items:center;gap:8px;margin:12px 0 6px;cursor:pointer;';
    projLbl.innerHTML=`<span class="badge" style="background:${pp.bg};border-color:${pp.b};color:${pp.t}">${proj.name}</span>
      <span style="font-size:11px;color:var(--text3)">${tasks.length} tâche${tasks.length!==1?'s':''}</span>`;
    projLbl.onclick=()=>{state.view='detail';state.projId=pid;state.tab='steps';render();};
    lc.appendChild(projLbl);

    const table=document.createElement('div');table.className='task-table';
    tasks.forEach(step=>{
      const late2=isLate(step);const sp=PAL[step.color]||PAL.teal;
      const pr=({high:{color:'#D83A2A'},normal:{color:'#BA7517'},low:{color:'#9A9A94'}})[step.priority||'normal'];
      // Coéquipiers sur la même tâche (hors soi-même) — petit indice visuel que ce n'est pas assigné qu'à cette personne
      const coAssignees=stepAssignees(step).filter(id=>id!==aid);
      const row=document.createElement('div');row.className='task-row';
      row.innerHTML=`
        <div class="task-check${step.done?' done':late2?' late':''}">${step.done?'✓':''}</div>
        <div class="task-priority" style="background:${pr.color}"></div>
        <div class="task-name${step.done?' done-text':''}">${step.name}</div>
        <div class="task-meta">
          <span class="task-phase" style="background:${sp.bg};border-color:${sp.b};color:${sp.t}">${(PHASES[step.phase]||{label:step.phase}).label}</span>
          ${coAssignees.length?avGroupHTML(coAssignees,'av-sm'):''}
          <div class="task-dates">${fmtD(step.startDate)} → ${fmtD(step.endDate)}</div>
          ${step.cost?`<div class="task-cost">${step.cost.toLocaleString('fr-FR')}€</div>`:''}
          ${late2?`<div class="task-late">⚠ Retard</div>`:''}
          <div class="task-comment-count">💬 ${(step.comments||[]).length}</div>
        </div>
      `;
      row.onclick=()=>{state.view='detail';state.projId=pid;state.tab='steps';render();setTimeout(()=>openTaskDetail(pid,step.id),50);};
      table.appendChild(row);
    });
    lc.appendChild(table);
  });
}
