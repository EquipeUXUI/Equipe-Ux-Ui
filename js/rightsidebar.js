// Généré par découpe automatique depuis index.html — Équipe UX UI

function renderRight(){
  const rc=document.getElementById('right-col');rc.innerHTML='';

  // En vue détail, le lien "← Tous les projets" + son margin décale le bloc
  // roadmap vers le bas : on compense ici pour que ÉQUIPE/PROJETS démarrent
  // à la même hauteur que le Gantt, plutôt qu'au-dessus.
  if(state.view==='detail'){
    const spacer=document.createElement('div');spacer.style.height='34px';spacer.style.flexShrink='0';
    rc.appendChild(spacer);
  }

  // ── TEAM BLOCK ──────────────────────────────────────────────────────
  const teamBlock=document.createElement('div');teamBlock.className='right-team-block';

  const teamHdr=document.createElement('div');teamHdr.className='right-header';
  teamHdr.style.cssText='padding:0 0 10px 0;display:flex;align-items:center;justify-content:space-between;';
  teamHdr.innerHTML=`
    <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3)">Équipe</div>
    <button onclick="openNewActor()" class="btn-secondary sm">
      <svg style="width:12px;height:12px" viewBox="0 0 40 40" fill="none"><path d="M24.9998 20.0001C28.6832 20.0001 31.6665 17.0167 31.6665 13.3334C31.6665 9.65008 28.6832 6.66675 24.9998 6.66675C21.3165 6.66675 18.3332 9.65008 18.3332 13.3334C18.3332 17.0167 21.3165 20.0001 24.9998 20.0001ZM9.99984 16.6667V13.3334C9.99984 12.4167 9.24984 11.6667 8.33317 11.6667C7.4165 11.6667 6.6665 12.4167 6.6665 13.3334V16.6667H3.33317C2.4165 16.6667 1.6665 17.4167 1.6665 18.3334C1.6665 19.2501 2.4165 20.0001 3.33317 20.0001H6.6665V23.3334C6.6665 24.2501 7.4165 25.0001 8.33317 25.0001C9.24984 25.0001 9.99984 24.2501 9.99984 23.3334V20.0001H13.3332C14.2498 20.0001 14.9998 19.2501 14.9998 18.3334C14.9998 17.4167 14.2498 16.6667 13.3332 16.6667H9.99984ZM24.9998 23.3334C20.5498 23.3334 11.6665 25.5667 11.6665 30.0001V31.6667C11.6665 32.5834 12.4165 33.3334 13.3332 33.3334H36.6665C37.5832 33.3334 38.3332 32.5834 38.3332 31.6667V30.0001C38.3332 25.5667 29.4498 23.3334 24.9998 23.3334Z" fill="currentColor"/></svg>
      Équipier
    </button>`;
  teamBlock.appendChild(teamHdr);

  const TEAM_MAX=6;
  const teamGrid=document.createElement('div');teamGrid.className='team-grid'+(teamExpanded?' expanded':'');
  DB.actors.forEach(a=>{
    const p=PAL[a.color]||PAL.teal;
    const tasks=DB.projects.flatMap(pr=>pr.steps.filter(s=>s.assignee===a.id));
    const late=tasks.filter(s=>isLate(s)).length;
    const chip=document.createElement('div');chip.className='team-chip';
    chip.innerHTML=`<div class="avatar av-md" style="background:${p.bg};color:${p.t}">${a.name.slice(0,2).toUpperCase()}</div>
      <div class="chip-info">
        <div class="chip-name">${a.name}</div>
        <div class="chip-role">${a.role}</div>
        <div class="chip-tasks">${tasks.length} tâche${tasks.length!==1?'s':''}${late?` · <span style="color:var(--red-t)">⚠${late}</span>`:''}</div>
      </div>`;
    chip.onclick=()=>{state.view='actor';state.actorId=a.id;render();};
    teamGrid.appendChild(chip);
  });
  teamBlock.appendChild(teamGrid);

  // Arrow if more than 6 members
  if(DB.actors.length>TEAM_MAX){
    const more=document.createElement('div');more.className='team-more';
    more.innerHTML=teamExpanded?'▲ Réduire':'▼ '+( DB.actors.length-TEAM_MAX)+' de plus';
    more.onclick=()=>{teamExpanded=!teamExpanded;renderRight();};
    teamBlock.appendChild(more);
  }
  rc.appendChild(teamBlock);

  // ── PROJECTS BLOCK ───────────────────────────────────────────────────
  const projBlock=document.createElement('div');projBlock.className='right-proj-block';

  const projHdr=document.createElement('div');
  projHdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;';
  projHdr.innerHTML=`
    <div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text3)">Projets en cours</div>`;
  projBlock.appendChild(projHdr);

  // ── Regroupe les projets par catégorie (lane) pour l'accordéon ─────────
  const grouped={};
  DB.projects.forEach(proj=>{
    const key=proj.lane||'Autre';
    if(!grouped[key]) grouped[key]=[];
    grouped[key].push(proj);
  });
  // Ordre d'affichage selon LANE_ORDER, puis catégories non listées
  const orderedKeys=[...LANE_ORDER.filter(l=>grouped[l]), ...Object.keys(grouped).filter(k=>!LANE_ORDER.includes(k))];
  if(!state.accordionOpen) state.accordionOpen={};

  orderedKeys.forEach(lane=>{
    const projs=grouped[lane];
    const {hdr:accHdr,isOpen}=buildLaneAccHeader(lane,projs,false);
    projBlock.appendChild(accHdr);

    if(isOpen){
      const accBody=document.createElement('div');accBody.style.cssText='margin-left:4px;margin-bottom:8px;display:flex;flex-direction:column;gap:8px;';
      projs.forEach(proj=>{
        const p=PAL[proj.color]||PAL.teal;
        const prog=projProg(proj);const late=projLate(proj);
        const dLeft=dBetween(TODAY_STR,proj.endDate);
        const card=document.createElement('div');card.className='rproj-card'+(state.projId===proj.id?' active':'');
        card.innerHTML=`
          <div class="rproj-row"><div class="rproj-name">${proj.name}</div><span class="badge" style="background:${p.bg};border-color:${p.b};color:${p.t}">${proj.lane.toUpperCase()}</span></div>
          <div class="rproj-meta" style="margin-top:2px">
            <span style="font-size:10px;color:var(--text3)">${fmtD(proj.startDate)} → ${fmtD(proj.endDate)}</span>
          </div>
          <div class="rproj-meta" style="margin-top:2px">${projProg(proj)}% complété · ${proj.steps.length} étapes</div>
          <div class="rproj-prog"><div class="prog-bar"><div class="prog-fill" style="width:${prog}%;background:${p.hex}"></div></div><div class="prog-pct">${prog}%</div></div>
          ${proj.actors.length?`<div class="rproj-avatars">${proj.actors.map(aid=>avHTML(aid,'av-sm')).join('')}</div>`:''}
          ${late?`<div class="warn-tag">⚠ Retard détecté</div>`:dLeft>=0&&dLeft<14?`<div class="warn-tag" style="color:var(--amber-t)">⏱ ${dLeft}j restants</div>`:''}
        `;
        card.onclick=()=>{state.view='detail';state.projId=proj.id;state.tab='steps';render();};
        accBody.appendChild(card);
      });
      projBlock.appendChild(accBody);
    }
  });

  const addBtn=document.createElement('div');addBtn.className='add-proj-btn';addBtn.innerHTML='+ Nouveau projet';addBtn.onclick=openNewProject;
  projBlock.appendChild(addBtn);
  rc.appendChild(projBlock);
}
