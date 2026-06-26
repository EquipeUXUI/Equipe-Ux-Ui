// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── DETAIL VIEW ─────────────────────────────────────────────────────────
function renderDetail(){
  const proj=DB.projects.find(p=>p.id===state.projId);if(!proj)return;
  const lc=document.getElementById('left-col');lc.innerHTML='';
  const p=PAL[proj.color]||PAL.teal;
  const prog=projProg(proj);const lateSteps=proj.steps.filter(s=>isLate(s));
  const dLeft=dBetween(TODAY_STR,proj.endDate);
  const tPct=timePct(proj);const spent=stepCost(proj);const dr=dailyRate(proj);
  const elapsed=Math.max(0,dBetween(proj.startDate,TODAY_STR));

  // Back — un projet terminé n'apparaît plus sur la Roadmap : on revient vers
  // l'archive (Projets → Terminé) plutôt que vers une vue où il est invisible.
  const back=document.createElement('div');back.className='detail-back';
  const goneFromRoadmap=projStatusKey(proj)==='termine';
  back.innerHTML=goneFromRoadmap?'← Projets terminés':'← Tous les projets';
  back.onclick=()=>{
    if(goneFromRoadmap){state.view='projects';state.projTab='termine';}
    else{state.view='global';}
    state.projId=null;state.actorId=null;render();
  };
  lc.appendChild(back);

  // Grid : panneau projet étroit (gauche) + Gantt/onglets (centre)
  const detailGrid=document.createElement('div');
  detailGrid.style.cssText='display:grid;grid-template-columns:260px minmax(0,1fr);gap:22px;align-items:start;';
  lc.appendChild(detailGrid);

  // ── PANNEAU PROJET (étroit) ──────────────────────────────────────────
  const panel=document.createElement('div');panel.style.cssText='display:flex;flex-direction:column;gap:10px;min-width:0;';
  const isPaused=projStatusKey(proj)==='pause';
  const isTerminated=projStatusKey(proj)==='termine';
  const panelTop=document.createElement('div');
  panelTop.style.cssText='display:flex;align-items:flex-start;justify-content:space-between;gap:8px;';
  panelTop.innerHTML=`<div class="detail-title" style="margin-bottom:0">${isPaused?'⏸ ':''}${proj.name}</div>`;
  if(!isTerminated){
    const endBtn=document.createElement('button');endBtn.className='btn-icon';endBtn.title='Terminer le projet';
    endBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    endBtn.onclick=()=>terminateProject(proj.id);
    panelTop.appendChild(endBtn);
  }
  const editBtn=document.createElement('button');editBtn.className='btn-icon';editBtn.title='Modifier le projet';
  editBtn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
  editBtn.onclick=()=>openEditProject(proj.id);
  panelTop.appendChild(editBtn);
  panel.appendChild(panelTop);
  if(isPaused||isTerminated){
    const statusChip=document.createElement('div');
    statusChip.style.cssText=`display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;color:var(--text3);background:var(--surface2);border-radius:var(--r,4px);padding:5px 9px;width:fit-content;`;
    if(isPaused){
      statusChip.innerHTML='⏸ EN PAUSE';
    }else{
      statusChip.innerHTML='<span>✅ TERMINÉ</span>';
      const reactBtn=document.createElement('button');reactBtn.className='btn-secondary sm';reactBtn.style.cssText='height:22px;padding:0 8px;font-size:10.5px;';
      reactBtn.textContent='↩️ Réactiver';
      reactBtn.onclick=()=>reactivateProject(proj.id);
      statusChip.appendChild(reactBtn);
    }
    panel.appendChild(statusChip);
  }
  const metaEl=document.createElement('div');metaEl.className='detail-meta';metaEl.style.margin='0';
  metaEl.innerHTML=proj.lane+'<br>'+fmtDFull(proj.startDate)+' → '+fmtDFull(proj.endDate)+(proj.note?'<br>'+proj.note:'');
  panel.appendChild(metaEl);

  // Info card: N° affaire, GTA, Responsable, Automaticien
  if(proj.numAffaire||proj.gta||proj.responsable||proj.automaticien){
    const infoCard=document.createElement('div');
    infoCard.style.cssText='display:flex;flex-direction:column;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);box-shadow:var(--sh);padding:12px 14px;margin-top:2px;font-size:12px;';
    const items=[];
    if(proj.numAffaire) items.push(`<div><span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.05em;display:block">N° affaire</span><span style="font-weight:600">${proj.numAffaire}</span></div>`);
    if(proj.gta) items.push(`<div><span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.05em;display:block">Code GTA</span><span style="font-weight:600;font-family:monospace">${proj.gta}</span></div>`);
    if(proj.responsable) items.push(`<div><span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.05em;display:block">Responsable projet</span><span style="font-weight:600">${proj.responsable}</span></div>`);
    if(proj.automaticien) items.push(`<div><span style="color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:.05em;display:block">Automaticien / Dev</span><span style="font-weight:600">${proj.automaticien}</span></div>`);
    infoCard.innerHTML=items.join('');
    panel.appendChild(infoCard);
  }

  // KPIs empilés (une carte pleine largeur par ligne)
  const myProjHours=(DB.hours||[]).filter(h=>h.projId===proj.id);
  const byActorTotal={};
  myProjHours.forEach(h=>{byActorTotal[h.actor]=(byActorTotal[h.actor]||0)+h.dur;});

  const kpiStack=document.createElement('div');kpiStack.style.cssText='display:flex;flex-direction:column;gap:10px;';
  kpiStack.innerHTML=`
    <div class="kpi"><div class="kpi-label">Avancement</div><div class="kpi-value ok">${prog}%</div><div class="kpi-sub">${proj.steps.filter(s=>s.done).length}/${proj.steps.length} étapes</div><div class="kpi-bar"><div class="kpi-bar-fill" style="width:${prog}%;background:var(--teal-b)"></div></div></div>
    <div class="kpi"><div class="kpi-label">Temps passé</div><div class="kpi-value ${tPct>prog+15?'warn':'info'}">${tPct}%</div><div class="kpi-sub">${elapsed} j écoulés</div><div class="kpi-bar"><div class="kpi-bar-fill" style="width:${tPct}%;background:${tPct>prog+15?'var(--red-b)':'var(--blue-b)'}"></div></div></div>
    <div class="kpi"><div class="kpi-label">Retards</div><div class="kpi-value ${lateSteps.length?'warn':'ok'}">${lateSteps.length}</div><div class="kpi-sub">${fmtDFull(proj.endDate)}</div></div>
    <div class="kpi"><div class="kpi-label">Jours restants</div><div class="kpi-value ${dLeft<0?'warn':dLeft<14?'warn':''}">${dLeft<0?'Dépassé':dLeft}</div><div class="kpi-sub">${dLeft<0?'&nbsp;':'jours'}</div></div>
    ${dr?`<div class="kpi"><div class="kpi-label">Coût / jour</div><div class="kpi-value info">${dr.toLocaleString('fr-FR')} €</div><div class="kpi-sub">moyenne</div></div>`:''}
    ${(()=>{const hReal=projHoursReal(proj);return hReal>0?`<div class="kpi"><div class="kpi-label">Heures saisies</div><div class="kpi-value info">${hReal} h</div><div class="kpi-sub">≈ ${stepCost(proj).toLocaleString('fr-FR')}€</div></div>`:'';})()}
    ${Object.entries(byActorTotal).map(([aid,total])=>{
      const a=actor(aid);const ap=PAL[a.color]||PAL.teal;
      return `<div class="kpi"><div class="kpi-label">Heures — ${a.name}</div><div style="display:flex;align-items:center;gap:10px;margin-top:2px">
        <div class="avatar av-sm" style="background:${ap.bg};color:${ap.t}">${a.name.slice(0,2).toUpperCase()}</div>
        <span style="font-size:22px;font-weight:800;color:var(--text)">${total} h</span>
      </div></div>`;
    }).join('')}
    ${proj.budget?`<div class="kpi"><div class="kpi-label">Coût engagé</div><div class="kpi-value">${spent.toLocaleString('fr-FR')}€</div><div class="kpi-sub">sur ${proj.budget.toLocaleString('fr-FR')}€</div><div class="kpi-bar"><div class="kpi-bar-fill" style="width:${Math.min(100,Math.round(spent/proj.budget*100))}%;background:var(--amber-b)"></div></div></div>`:''}
  `;
  panel.appendChild(kpiStack);
  detailGrid.appendChild(panel);

  // ── CONTENU PRINCIPAL (Gantt + onglets) ──────────────────────────────
  const main=document.createElement('div');main.style.cssText='min-width:0;display:flex;flex-direction:column;gap:0;';

  // Gantt
  if(proj.steps.length){
    const gc=document.createElement('div');gc.className='gantt-card';
    gc.appendChild(buildDetailGantt(proj));main.appendChild(gc);
  }

  // Onglets + boutons d'action (Tâche, Réunion, Lien document) dans le prolongement
  const tabsRow=document.createElement('div');
  tabsRow.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:14px;margin-bottom:12px;';
  const tabs=document.createElement('div');tabs.className='tabs';
  [['steps','Tâches'],['docs','Lien documents'],['hours','Heures']].forEach(([id,label])=>{
    const t=document.createElement('div');t.className='tab'+(state.tab===id?' active':'');
    t.textContent=label;t.onclick=()=>{state.tab=id;renderDetailTabs(proj,lc,tabs);};
    tabs.appendChild(t);
  });
  tabsRow.appendChild(tabs);
  const tabActions=document.createElement('div');
  tabActions.style.cssText='display:flex;gap:8px;flex-shrink:0;';
  tabActions.innerHTML=`
    <button onclick="openNewStep('${proj.id}')" class="btn-primary sm">+ Tâche</button>
    <button onclick="openNewMeeting('${proj.id}')" class="btn-secondary sm">+ Réunion</button>
    <button onclick="openNewDoc('${proj.id}')" class="btn-secondary sm">+ Lien document</button>
  `;
  tabsRow.appendChild(tabActions);
  main.appendChild(tabsRow);

  const tabContent=document.createElement('div');tabContent.id='tab-content';main.appendChild(tabContent);
  detailGrid.appendChild(main);
  renderTabContent(proj);
}

function renderDetailTabs(proj,lc,tabs){
  const ids=['steps','docs','hours'];
  if(!ids.includes(state.tab))state.tab='steps';
  tabs.querySelectorAll('.tab').forEach((t,i)=>{
    t.classList.toggle('active',state.tab===ids[i]);
  });
  renderTabContent(proj);
}

function renderTabContent(proj){
  const tc=document.getElementById('tab-content');if(!tc)return;tc.innerHTML='';
  if(state.tab==='cr')state.tab='docs'; // ancien onglet CR fusionné dans "Lien documents"
  if(state.tab==='steps') renderStepsTab(proj,tc);
  else if(state.tab==='docs') renderLienDocumentsTab(proj,tc);
  else if(state.tab==='hours') renderProjectHoursTab(proj,tc);
}

// Fusionne Comptes-rendus + Documents sous un même onglet "Lien documents"
function renderLienDocumentsTab(proj,container){
  const crHdr=document.createElement('div');
  crHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin:0 0 10px;';
  crHdr.innerHTML=`<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3)">Comptes-rendus</div>
    <button onclick="openNewCR('${proj.id}')" class="btn-secondary sm">+ CR</button>`;
  container.appendChild(crHdr);
  renderCRTab(proj,container);

  const docHdr=document.createElement('div');
  docHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin:22px 0 10px;';
  docHdr.innerHTML=`<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3)">Documents</div>
    <button onclick="openNewDoc('${proj.id}')" class="btn-secondary sm">+ Document</button>`;
  container.appendChild(docHdr);
  renderDocsTab(proj,container);
}

function renderStepsTab(proj,container){
  // ── Sous-onglets : À faire / Terminées ───────────────────────────────
  const filter = state.taskFilter || 'active';
  const subTabs = mkEl('div','display:flex;gap:2px;background:var(--surface2);border-radius:var(--r,4px);padding:3px;margin-bottom:14px;width:fit-content;');
  [['active','📋 À faire'],['done','✓ Terminées']].forEach(([id,label])=>{
    const t=mkEl('div','padding:6px 14px;border-radius:var(--r,8px);font-size:12px;font-weight:500;cursor:pointer;transition:background .15s;');
    t.textContent=label;
    if(filter===id){ t.style.background='var(--surface)'; t.style.color='var(--text)'; t.style.boxShadow='0 1px 4px rgba(0,0,0,.08)'; }
    else { t.style.color='var(--text2)'; }
    t.onclick=()=>{state.taskFilter=id;renderTabContent(proj);};
    subTabs.appendChild(t);
  });
  container.appendChild(subTabs);

  const visibleSteps = filter==='done' ? proj.steps.filter(s=>s.done) : proj.steps.filter(s=>!s.done);

  const phases=['PROPOSITION','OBSERVATION','ANALYSE','RESTITUTION','PROTOTYPE','TEST','SUIVI_DEV','MEETING','GESTION'];
  const grouped={};visibleSteps.forEach(s=>{if(!grouped[s.phase])grouped[s.phase]=[];grouped[s.phase].push(s);});
  let any=false;
  phases.forEach(ph=>{
    if(!grouped[ph])return;
    any=true;
    const ph_info=PHASES[ph]||{label:ph,color:'teal'};
    const pp=PAL[ph_info.color]||PAL.teal;
    const sec=document.createElement('div');sec.style.cssText='font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3);margin:12px 0 6px;';
    sec.textContent=ph_info.label;container.appendChild(sec);
    const table=document.createElement('div');table.className='task-table';
    grouped[ph].forEach(step=>{
      const late=isLate(step);const a=actor(step.assignee);const ap=PAL[a.color]||PAL.teal;
      const sp=PAL[step.color]||PAL.teal;const pr=PRIORITIES[step.priority||'normal'];
      const row=document.createElement('div');row.className='task-row';
      row.innerHTML=`
        <div class="task-check${step.done?' done':late?' late':''}">${step.done?'✓':''}</div>
        <div class="task-priority" style="background:${pr.color}" title="${pr.label}"></div>
        <div class="task-name${step.done?' done-text':''}">${step.name}</div>
        <div class="task-meta">
          <span class="task-phase" style="background:${sp.bg};border-color:${sp.b};color:${sp.t}">${ph_info.label}</span>
          <div class="avatar av-sm" style="background:${ap.bg};color:${ap.t}" title="${a.name}">${a.name.slice(0,2).toUpperCase()}</div>
          <div class="task-dates">${fmtD(step.startDate)} → ${fmtD(step.endDate)}</div>
          ${step.cost?`<div class="task-cost">${step.cost.toLocaleString('fr-FR')}€</div>`:''}
          ${late?`<div class="task-late">⚠ Retard</div>`:''}
          <div class="task-comment-count">💬 ${(step.comments||[]).length}</div>
        </div>
      `;
      row.onclick=()=>openTaskDetail(proj.id,step.id);
      table.appendChild(row);
    });
    container.appendChild(table);
  });
  if(!proj.steps.length){
    const empty=document.createElement('div');empty.style.cssText='text-align:center;padding:40px;color:var(--text3);font-size:13px;';
    empty.textContent='Aucune tâche — cliquez + Tâche pour commencer';container.appendChild(empty);
  } else if(!any){
    const empty=document.createElement('div');empty.style.cssText='text-align:center;padding:32px;color:var(--text3);font-size:13px;';
    empty.textContent=filter==='done'?'Aucune tâche terminée pour le moment.':'Tout est fait ! Aucune tâche en attente.';
    container.appendChild(empty);
  }
}

function renderCRTab(proj,container){
  if(!(proj.crs||[]).length){
    const empty=document.createElement('div');empty.style.cssText='text-align:center;padding:40px;color:var(--text3);font-size:13px;';
    empty.textContent='Aucun CR — cliquez + CR pour en ajouter';container.appendChild(empty);return;
  }
  const list=document.createElement('div');list.className='cr-list';
  (proj.crs||[]).forEach(cr=>{
    const item=document.createElement('div');item.className='cr-item';
    const attendeeAv=(cr.attendees||[]).map(aid=>avHTML(aid,'av-sm')).join('');
    item.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div class="cr-title">${cr.title}</div><div style="display:flex;gap:3px">${attendeeAv}</div></div>
      <div class="cr-meta">${fmtDFull(cr.date)}</div>
      ${cr.content?`<div class="cr-excerpt">${cr.content}</div>`:''}`;
    item.onclick=()=>openEditCR(proj.id,cr.id);
    list.appendChild(item);
  });
  container.appendChild(list);
}

function renderDocsTab(proj,container){
  if(!(proj.docs||[]).length){
    const empty=document.createElement('div');empty.style.cssText='text-align:center;padding:40px;color:var(--text3);font-size:13px;';
    empty.textContent='Aucun document — cliquez + Document pour en ajouter';container.appendChild(empty);return;
  }
  const card=document.createElement('div');card.className='task-table';
  const list=document.createElement('div');list.className='doc-list';
  const typeIcon={pdf:'📄',figma:'🎨',link:'🔗',sheet:'📊',word:'📝'};
  (proj.docs||[]).forEach(doc=>{
    const item=document.createElement('div');item.className='doc-item';
    item.innerHTML=`<span class="doc-icon">${typeIcon[doc.type]||'📎'}</span>
      <span class="doc-name">${doc.name}</span>
      ${doc.url&&doc.url!=='#'?`<a class="doc-link" href="${doc.url}" target="_blank">Ouvrir →</a>`:'<span style="font-size:10px;color:var(--text3)">Pas de lien</span>'}
      <button class="btn-icon sm" title="Supprimer" onclick="deleteDoc('${proj.id}','${doc.id}')">×</button>`;
    list.appendChild(item);
  });
  card.appendChild(list);container.appendChild(card);
}

function buildDetailGantt(proj){
  const wrap=document.createElement('div');
  const start=new Date(proj.startDate),end=new Date(proj.endDate);
  const totalDays=Math.max(1,dBetween(proj.startDate,proj.endDate));
  const numWeeks=Math.ceil(totalDays/7);const stepW=Math.max(1,Math.ceil(numWeeks/14));
  const wrow=document.createElement('div');wrow.className='weeks-row';
  for(let w=0;w<numWeeks;w+=stepW){const wd=new Date(start);wd.setDate(wd.getDate()+w*7);const mc=document.createElement('div');mc.className='week-cell';mc.textContent=wd.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});mc.style.flex=stepW;wrow.appendChild(mc);}
  wrap.appendChild(wrow);
  const todayPct=Math.max(0,Math.min(100,(dBetween(proj.startDate,TODAY_STR)/totalDays)*100));
  const grouped={};proj.steps.forEach(s=>{if(!grouped[s.phase])grouped[s.phase]=[];grouped[s.phase].push(s);});
  ['PROPOSITION','OBSERVATION','ANALYSE','RESTITUTION','PROTOTYPE','TEST','SUIVI_DEV','MEETING','GESTION'].forEach(ph=>{
    if(!grouped[ph])return;
    const pl=document.createElement('div');pl.className='phase-lbl';pl.textContent=(PHASES[ph]&&PHASES[ph].label)||ph;wrap.appendChild(pl);
    grouped[ph].forEach(step=>{
      const lane=document.createElement('div');lane.className='d-lane';
      const lbl=document.createElement('div');lbl.className='d-lbl';lbl.textContent=step.name;lane.appendChild(lbl);
      const track=document.createElement('div');track.className='d-track';
      const tl=document.createElement('div');tl.className='today-line';tl.style.left=todayPct+'%';track.appendChild(tl);
      const sD=dBetween(proj.startDate,step.startDate);
      // Si la tâche est terminée, la barre s'arrête à la date réelle de fin (pas la date prévue)
      const effectiveEndDate=(step.done&&step.realEndDate)?step.realEndDate:step.endDate;
      const eD=dBetween(proj.startDate,effectiveEndDate);
      const left=(sD/totalDays)*100,width=(Math.max(1,eD-sD)/totalDays)*100;
      const sp=PAL[step.color]||PAL.teal;const late=isLate(step);
      const a=actor(step.assignee);

      if(step.phase==='MEETING'){
        // Les réunions sont courtes (~1h) : on les représente par un point, pas une barre étirée
        const dot=document.createElement('div');
        dot.style.cssText=`position:absolute;top:50%;left:${Math.max(0,left)}%;width:14px;height:14px;border-radius:50%;background:${step.done?'var(--surface2)':sp.bg};border:2px solid ${late?'var(--red-b)':sp.b};transform:translate(-50%,-50%);cursor:pointer;z-index:6;`;
        if(step.done) dot.innerHTML='<div style="font-size:8px;color:var(--text3);text-align:center;line-height:10px">✓</div>';
        const timeLabel=step.timeStart&&step.timeEnd?`${step.timeStart}–${step.timeEnd}`:'';
        dot.addEventListener('mouseenter',ev=>{
          showTT(ev,`<strong>${step.name}</strong>${a.name?`Assigné : ${a.name}`:''} ${step.done?'✓ Terminé':''}<em>${fmtDFull(step.startDate)}${timeLabel?' · '+timeLabel:''}</em>`);
        });
        dot.addEventListener('mousemove',moveTT);dot.addEventListener('mouseleave',hideTT);
        dot.onclick=()=>openTaskDetail(proj.id,step.id);
        track.appendChild(dot);
        lane.appendChild(track);wrap.appendChild(lane);
        return; // skip bar rendering below for meetings
      }

      const bar=document.createElement('div');bar.className='d-bar'+(late?' late':'');
      bar.style.cssText=`left:${Math.max(0,left)}%;width:${Math.min(Math.max(width,1),100-Math.max(0,left))}%;background:${step.done?'var(--surface2)':sp.bg};border-color:${late?'var(--red-b)':sp.b};color:${late?'var(--red-t)':step.done?'var(--text3)':sp.t};`;
      bar.innerHTML=step.done?`✓ ${step.name}`:`${step.name}${late?' ⚠':''}`;
      // Si la tâche est terminée avant ou après la date prévue, on ajoute un repère vertical à la date prévue initiale
      if(step.done&&step.realEndDate&&step.realEndDate!==step.endDate){
        const plannedEndPct=(dBetween(proj.startDate,step.endDate)/totalDays)*100;
        const marker=document.createElement('div');
        const isEarly=step.realEndDate<step.endDate;
        marker.style.cssText=`position:absolute;top:2px;bottom:2px;width:2px;left:${plannedEndPct}%;background:${isEarly?'var(--teal-b)':'var(--red-b)'};opacity:.6;z-index:5;`;
        marker.title=`Fin prévue : ${fmtDFull(step.endDate)}`;
        track.appendChild(marker);
      }
      bar.addEventListener('mouseenter',ev=>{
        const realInfo=step.done&&step.realEndDate?`<br>Terminé le : ${fmtDFull(step.realEndDate)}${step.realEndDate!==step.endDate?(step.realEndDate<step.endDate?' (en avance)':' (en retard)'):''}`:'';
        showTT(ev,`<strong>${step.name}</strong>${a.name?`Assigné : ${a.name}`:''} ${late?'<span style="color:var(--red-t)">⚠ En retard</span>':step.done?'✓ Terminé':''}<em>Prévu : ${fmtDFull(step.startDate)} → ${fmtDFull(step.endDate)}${step.cost?` · ${step.cost.toLocaleString('fr-FR')}€`:''}</em>${realInfo}`);
      });
      bar.addEventListener('mousemove',moveTT);bar.addEventListener('mouseleave',hideTT);
      bar.onclick=()=>openTaskDetail(proj.id,step.id);
      track.appendChild(bar);lane.appendChild(track);wrap.appendChild(lane);
    });
  });
  return wrap;
}

// ─── TASK DETAIL MODAL ───────────────────────────────────────────────────
function openTaskDetail(projId,stepId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const step=proj.steps.find(s=>s.id===stepId);if(!step)return;
  const late=isLate(step);const sp=PAL[step.color]||PAL.teal;const a=actor(step.assignee);const ap=PAL[a.color]||PAL.teal;
  const comments=(step.comments||[]).map(c=>{const ca=actor(c.author);const cap=PAL[ca.color]||PAL.teal;
    return`<div class="comment-item"><div class="avatar av-sm" style="background:${cap.bg};color:${cap.t}">${ca.name.slice(0,2).toUpperCase()}</div>
      <div class="comment-body"><div class="comment-author">${ca.name}</div><div class="comment-text">${c.text}</div><div class="comment-date">${fmtDFull(c.date)}</div></div></div>`;}).join('');
  openModal(`<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
    <div style="font-size:15px;font-weight:600">${step.name}</div>
    <span class="badge" style="background:${sp.bg};border-color:${sp.b};color:${sp.t}">${(PHASES[step.phase]||{label:step.phase}).label}</span>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
    <div style="font-size:12px;color:var(--text2)">Assigné à<br><strong style="color:var(--text)">${a.name} · ${a.role}</strong></div>
    <div style="font-size:12px;color:var(--text2)">Dates prévues<br><strong style="color:var(--text)">${fmtDFull(step.startDate)} → ${fmtDFull(step.endDate)}</strong></div>
    <div style="font-size:12px;color:var(--text2)">Coût<br><strong style="color:var(--text)">${step.cost?step.cost.toLocaleString('fr-FR')+'€':'—'}</strong></div>
    <div style="font-size:12px;color:var(--text2)">Statut<br><strong style="color:${late?'var(--red-t)':step.done?'var(--teal-t)':'var(--text)'}">${late?'⚠ En retard':step.done?'✓ Terminé':'En cours'}</strong></div>
    ${step.done&&step.realEndDate?`<div style="font-size:12px;color:var(--text2)">Terminé le<br><strong style="color:${step.realEndDate>step.endDate?'var(--red-t)':step.realEndDate<step.endDate?'var(--teal-t)':'var(--text)'}">${fmtDFull(step.realEndDate)}${step.realEndDate!==step.endDate?(step.realEndDate>step.endDate?' (en retard)':' (en avance)'):''}</strong></div>`:''}
  </div>
  <div style="font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text3);margin-bottom:8px">Commentaires</div>
  <div id="modal-comments" style="max-height:180px;overflow-y:auto">${comments||'<div style="font-size:12px;color:var(--text3);padding:8px 0">Aucun commentaire</div>'}</div>
  <div class="comment-input-row">
    <select id="c-author" style="font-size:12px;padding:5px 8px;border-radius:var(--r,4px);border:0.5px solid var(--border-md);background:var(--bg);color:var(--text);height:32px;min-width:90px">${actorOpts()}</select>
    <input class="comment-input" id="c-text" type="text" placeholder="Ajouter un commentaire...">
    <button class="btn primary" onclick="addComment('${projId}','${stepId}')">Envoyer</button>
  </div>
  <div class="modal-actions" style="border-top:0.5px solid var(--border);padding-top:12px;margin-top:12px">
    <button class="btn danger" onclick="deleteStep('${projId}','${stepId}')">Supprimer</button>
    <button class="btn" onclick="toggleDone('${projId}','${stepId}')">${step.done?'Marquer en cours':'Marquer terminé'}</button>
    <button class="btn" onclick="closeModal()">Fermer</button>
    <button class="btn primary" onclick="openEditStep('${projId}','${stepId}')">Modifier</button>
  </div>`);
}

function addComment(projId,stepId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const step=proj.steps.find(s=>s.id===stepId);if(!step)return;
  const text=document.getElementById('c-text').value.trim();if(!text)return;
  const author=document.getElementById('c-author').value;
  if(!step.comments)step.comments=[];
  step.comments.push({id:uid(),author,text,date:TODAY_STR});
  saveDB();openTaskDetail(projId,stepId);
}
function toggleDone(projId,stepId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const step=proj.steps.find(s=>s.id===stepId);if(!step)return;
  step.done=!step.done;
  // Enregistre la date réelle de fin au moment où on coche "terminé"
  if(step.done){
    step.realEndDate=TODAY_STR;
  } else {
    delete step.realEndDate;
  }
  saveDB();closeModal();render();
}
