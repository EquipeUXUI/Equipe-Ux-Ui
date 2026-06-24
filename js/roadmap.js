// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── ACCORDÉON PAR PÔLE ──────────────────────────────────────────────────
// Helper partagé entre la Roadmap annuelle (gauche) et le bloc "Projets" (droite)
// pour que les deux gardent le même style ET le même état ouvert/fermé.
// state.accordionOpen[lane] non défini => on retombe sur defaultOpen
// (true pour la Roadmap : on veut voir les barres par défaut ;
//  false pour la sidebar : on veut un résumé compact par défaut).
function buildLaneAccHeader(lane,projs,defaultOpen){
  const lp=PAL[LANE_COLORS[lane]||'teal'];
  const avgProg=projs.length?Math.round(projs.reduce((s,p)=>s+projProg(p),0)/projs.length):0;
  const stored=state.accordionOpen[lane];
  const isOpen=stored!==undefined?!!stored:defaultOpen;
  const hdr=document.createElement('div');hdr.className='lane-acc-hdr';
  hdr.innerHTML=`
    <svg class="lane-acc-chevron" style="transform:rotate(${isOpen?90:0}deg)" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="lane-acc-badge" style="background:${lp.bg};color:${lp.t}">${projs.length}</div>
    <div style="flex:1;min-width:0">
      <div class="lane-acc-title">${lane}</div>
      <div class="lane-acc-sub">${avgProg}% en moyenne</div>
    </div>`;
  hdr.onclick=()=>{state.accordionOpen[lane]=!isOpen;render();};
  return {hdr,isOpen};
}

// ─── GLOBAL VIEW ─────────────────────────────────────────────────────────
function renderGlobal(){
  const lc=document.getElementById('left-col');lc.innerHTML='';
  lc.innerHTML='';

  // Rangée KPI : météo + 4 indicateurs, dans une seule grille (comme la maquette)
  const m=meteoStatus();
  const kpiWrap=document.createElement('div');kpiWrap.className='kpi-row';
  const totalProjs=DB.projects.length;
  const lateProjs=DB.projects.filter(p=>projLate(p)).length;
  const totalSteps=DB.projects.reduce((s,p)=>s+p.steps.length,0);
  const doneSteps=DB.projects.reduce((s,p)=>s+p.steps.filter(st=>st.done).length,0);
  const globalProg=totalSteps?Math.round(doneSteps/totalSteps*100):0;
  const totalBudget=DB.projects.reduce((s,p)=>s+(p.budget||0),0);
  const totalSpent=DB.projects.reduce((s,p)=>s+stepCost(p),0);
  kpiWrap.innerHTML=`
    <div class="kpi" style="cursor:pointer">
      <div class="kpi-label">Météo</div>
      <div style="display:flex;align-items:center;gap:10px">
        <div class="kpi-meteo-icon" style="width:34px;height:34px;flex-shrink:0">${m.svg}</div>
        <span style="font-size:18px;font-weight:800;color:var(--text)">${m.label}</span>
      </div>
      <div class="kpi-sub">${m.desc}</div>
    </div>
    <div class="kpi"><div class="kpi-label">Projets actifs</div><div class="kpi-value info">${totalProjs}</div><div class="kpi-sub">${lateProjs} retard${lateProjs!==1?'s':''}</div></div>
    <div class="kpi" style="box-shadow:var(--sh2);border-color:var(--border-md)"><div class="kpi-label">Avancement global</div><div class="kpi-value ok">${globalProg}%</div><div class="kpi-bar"><div class="kpi-bar-fill" style="width:${globalProg}%;background:var(--teal-b)"></div></div></div>
    <div class="kpi"><div class="kpi-label">Projets en retard</div><div class="kpi-value ${lateProjs?'warn':'ok'}">${lateProjs}</div><div class="kpi-sub">sur ${totalProjs} projet${totalProjs!==1?'s':''}</div></div>
    <div class="kpi"><div class="kpi-label">Budget total</div><div class="kpi-value">${totalBudget?totalBudget.toLocaleString('fr-FR')+'€':'—'}</div><div class="kpi-sub">${totalSpent?totalSpent.toLocaleString('fr-FR')+'€ engagé':'&nbsp;'}</div></div>
  `;
  lc.appendChild(kpiWrap);

  // Roadmap
  const sh=document.createElement('div');sh.className='section-header';
  sh.innerHTML=`<div class="section-title">Roadmap annuelle</div>
    <button onclick="openNewProject()" class="btn-primary">
      <svg style="width:12px;height:12px" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
      Projet
    </button>`;
  lc.appendChild(sh);
  const gc=document.createElement('div');gc.className='gantt-card';
  gc.appendChild(buildGlobalGantt());lc.appendChild(gc);
}

// En-tête de pôle pour la Roadmap centrale : ligne plate (pas de carte),
// séparée par un trait, avec mini-barre de progression à droite.
function buildPoleRow(lane,projs,isFirst){
  const lp=PAL[LANE_COLORS[lane]||'teal'];
  const avgProg=projs.length?Math.round(projs.reduce((s,p)=>s+projProg(p),0)/projs.length):0;
  const stored=state.accordionOpen[lane];
  const isOpen=stored!==undefined?!!stored:true;
  const row=document.createElement('div');
  row.className='pole-row'+(isFirst?' first':'');
  row.innerHTML=`
    <div class="pole-row-left">
      <svg class="pole-chevron" style="transform:rotate(${isOpen?90:0}deg)" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="pole-title">${lane}</span>
      <span class="pole-badge" style="background:${lp.bg};color:${lp.t}">${projs.length}</span>
    </div>
    <div class="pole-bar-wrap">
      <div class="pole-minibar"><div class="pole-minibar-fill" style="width:${avgProg}%;background:${lp.hex}"></div></div>
      <span class="pole-avg-label">${avgProg} % en moyenne</span>
    </div>`;
  row.onclick=()=>{state.accordionOpen[lane]=!isOpen;render();};
  return {hdr:row,isOpen};
}

function buildGlobalGantt(){
  const wrap=document.createElement('div');wrap.style.position='relative';
  const mrow=document.createElement('div');mrow.className='months-row';
  MONTHS.forEach(m=>{const mc=document.createElement('div');mc.className='month-cell';mc.textContent=m;mrow.appendChild(mc);});
  wrap.appendChild(mrow);
  const todayPct=((TODAY.getMonth()+TODAY.getDate()/31)/12)*100;

  const grouped={};DB.projects.forEach(p=>{if(!grouped[p.lane])grouped[p.lane]=[];grouped[p.lane].push(p);});

  LANE_ORDER.forEach((ln,idx)=>{
    if(!grouped[ln])return;
    const projs=grouped[ln];
    const {hdr,isOpen}=buildPoleRow(ln,projs,idx===0);
    wrap.appendChild(hdr);
    if(!isOpen)return;

    projs.forEach(proj=>{
      const lane=document.createElement('div');lane.className='g-lane';
      const lbl=document.createElement('div');lbl.className='g-lbl';lbl.textContent=proj.name;
      lbl.onclick=()=>{state.view='detail';state.projId=proj.id;state.tab='steps';state.accordionOpen[proj.lane]=true;render();};
      lane.appendChild(lbl);
      const track=document.createElement('div');track.className='g-track';
      const s=new Date(proj.startDate),e=new Date(proj.endDate);
      const sM=s.getMonth()+(s.getDate()-1)/31,eM=e.getMonth()+(e.getDate())/31;
      const left=(sM/12)*100,width=((eM-sM)/12)*100;
      const p=PAL[proj.color]||PAL.teal;
      const bar=document.createElement('div');bar.className='g-bar';
      bar.style.cssText=`left:${Math.max(0,left)}%;width:${Math.min(width,100-Math.max(0,left))}%;background:${p.bg};border-color:${p.b};color:${p.t};`;
      if(projLate(proj))bar.style.borderStyle='dashed';
      bar.textContent=proj.name;
      bar.addEventListener('mouseenter',ev=>showTT(ev,`<strong>${proj.name}</strong>${proj.note||''}<em>${fmtDFull(proj.startDate)} → ${fmtDFull(proj.endDate)} · ${projProg(proj)}% fait</em>`));
      bar.addEventListener('mousemove',moveTT);bar.addEventListener('mouseleave',hideTT);
      bar.onclick=()=>{state.view='detail';state.projId=proj.id;state.tab='steps';state.accordionOpen[proj.lane]=true;render();};
      track.appendChild(bar);
      lane.appendChild(track);wrap.appendChild(lane);
    });
  });

  // Repère "aujourd'hui" : un seul trait continu qui traverse toute la roadmap
  // (en-têtes de pôle + lignes de projets), au lieu d'une ligne par ligne.
  const todayOverlay=document.createElement('div');
  todayOverlay.style.cssText='position:absolute;left:120px;right:0;top:0;bottom:0;pointer-events:none;z-index:6;';
  const tLine=document.createElement('div');tLine.className='today-line';tLine.style.cssText+=`left:${todayPct}%;top:16px;bottom:0;`;
  todayOverlay.appendChild(tLine);
  const tPill=document.createElement('div');tPill.className='today-pill';tPill.style.cssText+=`left:${todayPct}%;top:-4px;`;
  tPill.textContent='Auj. · '+TODAY.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
  todayOverlay.appendChild(tPill);
  wrap.appendChild(todayOverlay);

  return wrap;
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────
function renderDashboard(){
  const lc=document.getElementById('left-col');lc.innerHTML='';
  lc.style.cssText='';

  // ── HELPERS ──────────────────────────────────────────────────────────
  const allSteps=DB.projects.flatMap(p=>p.steps.map(s=>({...s,proj:p})));
  const todayStr=TODAY_STR;
  const in7=new Date(TODAY);in7.setDate(in7.getDate()+7);
  const in30=new Date(TODAY);in30.setDate(in30.getDate()+30);

  // Projets par pôle
  const byPole={Industriel:[],Céréalier:[],Transversal:[]};
  DB.projects.forEach(p=>{const pole=p.pole||'Transversal';if(byPole[pole])byPole[pole].push(p);else byPole['Transversal'].push(p);});

  // KPIs globaux
  const totalProjs=DB.projects.length;
  const lateProjs=DB.projects.filter(p=>projLate(p)).length;
  const deliveredProjs=DB.projects.filter(p=>p.steps.length&&p.steps.every(s=>s.done)).length;
  const allDone=allSteps.filter(s=>s.done).length;
  const allTotal=allSteps.length;
  const globalProg=allTotal?Math.round(allDone/allTotal*100):0;
  const onTimeProjs=DB.projects.filter(p=>!projLate(p)&&p.steps.length>0).length;
  const deliveryRate=totalProjs?Math.round(onTimeProjs/totalProjs*100):0;
  const totalBudget=DB.projects.reduce((s,p)=>s+(p.budget||0),0);
  const totalSpent=DB.projects.reduce((s,p)=>s+stepCost(p),0);
  const upcomingSteps=allSteps.filter(s=>!s.done&&new Date(s.endDate)<=in7&&new Date(s.endDate)>=TODAY);
  const lateSteps=allSteps.filter(s=>isLate(s));

  // ── SECTION : VUE ÉQUIPE ─────────────────────────────────────────────
  addDashSection(lc,'👥 Vue Équipe','Ce qui se passe maintenant');

  // Charge par personne — anneau coloré par statut (même logique que les anneaux projet : teal/amber/rouge)
  const chargeRow=mkEl('div','display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-bottom:16px;');
  const CIRC_CHARGE=2*Math.PI*26;
  DB.actors.forEach(a=>{
    const mySteps=allSteps.filter(s=>s.assignee===a.id);
    const myLate=mySteps.filter(s=>isLate(s)).length;
    const myDone=mySteps.filter(s=>s.done).length;
    const myInProgress=mySteps.filter(s=>!s.done&&!isLate(s)).length;
    const myNext=mySteps.filter(s=>!s.done&&new Date(s.endDate)<=in7).length;

    const weekHours=actorWeekHours(a.id);
    const chargePct=Math.round(weekHours/CAPACITY_HOURS_WEEK*100);
    const chargeKey=chargePct>100?'red':chargePct>=80?'amber':'teal';
    const chargeColorVar={red:'var(--red-b)',amber:'var(--amber-b)',teal:'var(--teal-b)'}[chargeKey];
    const chargeTextVar={red:'var(--red-t)',amber:'var(--amber-t)',teal:'var(--teal-t)'}[chargeKey];
    const dash=(Math.min(100,chargePct)/100*CIRC_CHARGE).toFixed(1);

    const card=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:16px;display:flex;align-items:center;gap:14px;');
    card.innerHTML=`
      <div style="position:relative;width:64px;height:64px;flex-shrink:0">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="var(--border-md)" stroke-width="7"/>
          <circle cx="32" cy="32" r="26" fill="none" stroke="${chargeColorVar}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${dash} ${CIRC_CHARGE.toFixed(1)}" transform="rotate(-90 32 32)"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${chargeTextVar}">${chargePct}%</div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:baseline;gap:7px;margin-bottom:4px">
          <div style="font-size:14px;font-weight:600;color:var(--text)">${a.name}</div>
          <div style="font-size:11px;color:var(--text3)">${a.role}</div>
        </div>
        <div style="font-size:11.5px;color:var(--text2)">${myInProgress} tâche${myInProgress!==1?'s':''} en cours${myLate?` · <span style="color:var(--red-t);font-weight:600">${myLate} en retard</span>`:''}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${myDone} terminée${myDone!==1?'s':''} · ${myNext} cette semaine</div>
      </div>`;
    chargeRow.appendChild(card);
  });
  lc.appendChild(chargeRow);


  // Tâches urgentes J+7
  if(upcomingSteps.length||lateSteps.length){
    const urgTitle=mkEl('div','font-size:13px;font-weight:600;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px;');
    urgTitle.innerHTML=`⏰ Alertes & échéances proches <span style="background:var(--red-bg);color:var(--red-t);border:0.5px solid var(--red-b);border-radius:5px;padding:1px 7px;font-size:11px">${lateSteps.length} retard${lateSteps.length!==1?'s':''}</span>`;
    lc.appendChild(urgTitle);
    const urgTable=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);overflow:hidden;margin-bottom:20px;');
    const toShow=[...lateSteps,...upcomingSteps.filter(s=>!isLate(s))].slice(0,8);
    toShow.forEach(s=>{
      const late2=isLate(s);const a=actor(s.assignee);const ap=PAL[a.color]||PAL.teal;
      const row=mkEl('div','display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:0.5px solid var(--border);');
      row.innerHTML=`
        <div style="width:8px;height:8px;border-radius:50%;background:${late2?'var(--red-b)':'var(--amber-b)'};flex-shrink:0"></div>
        <div style="flex:1;font-size:12px;color:var(--text)">${s.proj.name} — ${s.name}</div>
        <div class="avatar av-sm" style="background:${ap.bg};color:${ap.t}">${a.name.slice(0,2).toUpperCase()}</div>
        <div style="font-size:11px;color:${late2?'var(--red-t)':'var(--amber-t)'};white-space:nowrap">${late2?'⚠ Retard':'→ '+fmtD(s.endDate)}</div>`;
      row.style.cursor='pointer';row.onclick=()=>{state.view='detail';state.projId=s.proj.id;state.tab='steps';render();};
      urgTable.appendChild(row);
    });
    lc.appendChild(urgTable);
  }

  // ── SECTION : VUE PROJET ─────────────────────────────────────────────
  addDashSection(lc,'📋 Vue Projet','Pilotage par pôle');

  // Répartition par pôle
  const poleRow=mkEl('div','display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;');
  const poleColors={Industriel:'blue',Céréalier:'green',Transversal:'purple'};
  Object.entries(byPole).forEach(([pole,projs])=>{
    const cl=PAL[poleColors[pole]]||PAL.blue;
    const poleProgs=projs.map(p=>projProg(p));
    const avgProg=poleProgs.length?Math.round(poleProgs.reduce((a,b)=>a+b,0)/poleProgs.length):0;
    const poleLate=projs.filter(p=>projLate(p)).length;
    const poleBudget=projs.reduce((s,p)=>s+(p.budget||0),0);
    const poleSpent=projs.reduce((s,p)=>s+stepCost(p),0);
    const card=mkEl('div',`background:${cl.bg};border:0.5px solid ${cl.b};border-radius:var(--r,4px);padding:16px;cursor:pointer;transition:transform .1s,box-shadow .15s;`);
    card.addEventListener('mouseenter',()=>{card.style.transform='translateY(-2px)';card.style.boxShadow='0 4px 14px rgba(0,0,0,.08)';});
    card.addEventListener('mouseleave',()=>{card.style.transform='';card.style.boxShadow='';});
    card.onclick=()=>{
      // filter to first project of this pole
      const firstProj=projs[0];
      if(firstProj){state.view='detail';state.projId=firstProj.id;state.tab='steps';render();}
    };
    card.innerHTML=`
      <div style="font-size:13px;font-weight:700;color:${cl.t};margin-bottom:10px">${pole}</div>
      <div style="font-size:28px;font-weight:800;color:${cl.t};letter-spacing:-.02em">${projs.length}</div>
      <div style="font-size:11px;color:${cl.t};opacity:.7;margin-bottom:10px">projet${projs.length!==1?'s':''}</div>
      <div style="height:3px;border-radius:2px;background:rgba(0,0,0,.1);margin-bottom:6px;overflow:hidden">
        <div style="width:${avgProg}%;height:100%;background:${cl.b};border-radius:2px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:${cl.t};opacity:.8">
        <span>${avgProg}% moy.</span>
        ${poleLate?`<span>⚠ ${poleLate} retard${poleLate>1?'s':''}</span>`:'<span>✓ Dans les délais</span>'}
      </div>
      ${poleBudget?`<div style="font-size:10px;color:${cl.t};opacity:.7;margin-top:6px">${poleSpent.toLocaleString('fr-FR')}€ / ${poleBudget.toLocaleString('fr-FR')}€</div>`:''}`;
    poleRow.appendChild(card);
  });
  lc.appendChild(poleRow);

  // Avancement projets — grille d'anneaux triée par statut (retard d'abord, puis à surveiller, puis à jour ; au sein d'un statut, du moins au plus avancé)
  const projListTitle=mkEl('div','font-size:13px;font-weight:600;color:var(--text2);margin-bottom:8px;');
  projListTitle.textContent='Avancement par projet';lc.appendChild(projListTitle);
  const projGrid=mkEl('div','display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:16px 6px;background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:18px;margin-bottom:20px;');
  const CIRC_PROJ=2*Math.PI*28;
  [...DB.projects].sort((a,b)=>{
    const sa=projStatus(a),sb=projStatus(b);
    return sa.order!==sb.order?sa.order-sb.order:projProg(a)-projProg(b);
  }).forEach(proj=>{
    const st=projStatus(proj);
    const prog=projProg(proj);
    const statusColorVar={red:'var(--red-b)',amber:'var(--amber-b)',teal:'var(--teal-b)'}[st.color];
    const statusTextVar={red:'var(--red-t)',amber:'var(--amber-t)',teal:'var(--text3)'}[st.color];
    const poleHex=(PAL[poleColors[proj.pole]]||PAL.blue).hex;
    const dash=(prog/100*CIRC_PROJ).toFixed(1);

    const cell=mkEl('div','display:flex;flex-direction:column;align-items:center;text-align:center;cursor:pointer;');
    cell.innerHTML=`
      <div style="position:relative;width:72px;height:72px">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="28" fill="none" stroke="var(--border-md)" stroke-width="7"/>
          <circle cx="36" cy="36" r="28" fill="none" stroke="${statusColorVar}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${dash} ${CIRC_PROJ.toFixed(1)}" transform="rotate(-90 36 36)"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--text)">${prog}%</div>
      </div>
      <div style="display:flex;align-items:center;gap:5px;margin-top:8px;max-width:88px">
        <span style="width:7px;height:7px;border-radius:2px;background:${poleHex};flex-shrink:0"></span>
        <span style="font-size:10.5px;font-weight:600;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${proj.name}</span>
      </div>
      <div style="font-size:9.5px;font-weight:700;color:${statusTextVar};margin-top:1px">${st.key==='ok'?'\u00A0':st.label}</div>`;
    cell.addEventListener('mouseenter',ev=>showTT(ev,`<strong>${proj.name}</strong>${proj.note||''}<em>${fmtDFull(proj.startDate)} → ${fmtDFull(proj.endDate)} · ${st.label}</em>`));
    cell.addEventListener('mousemove',moveTT);cell.addEventListener('mouseleave',hideTT);
    cell.onclick=()=>{state.view='detail';state.projId=proj.id;state.tab='steps';if(!state.accordionOpen)state.accordionOpen={};state.accordionOpen[proj.lane]=true;render();};
    projGrid.appendChild(cell);
  });
  lc.appendChild(projGrid);

  // ── SECTION : VUE MANAGEMENT ─────────────────────────────────────────
  addDashSection(lc,'🎯 Vue Management','Valeur produite & stratégie pôle UX');

  const mgmtGrid=mkEl('div','display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:16px;');
  const mgmtKpis=[
    {label:'Projets livrés',   value:deliveredProjs, sub:'terminés à 100%',          color:'ok'},
    {label:'Taux délais',      value:deliveryRate+'%', sub:'projets dans les temps',   color:deliveryRate>=70?'ok':'warn'},
    {label:'Projets actifs',   value:totalProjs,     sub:'en cours',                  color:'info'},
    {label:'Budget engagé',    value:totalBudget?(Math.round(totalSpent/totalBudget*100)+'%'):'—', sub:`${totalSpent.toLocaleString('fr-FR')}€ / ${totalBudget.toLocaleString('fr-FR')}€`, color:''},
    {label:'Avancement global',value:globalProg+'%', sub:`${allDone}/${allTotal} tâches`, color:globalProg>=50?'ok':''},
    {label:'Taille équipe',    value:DB.actors.length, sub:'membres UX UI',           color:'info'},
  ];
  mgmtKpis.forEach(k=>{
    const card=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:14px 16px;');
    card.innerHTML=`<div class="kpi-label">${k.label}</div>
      <div class="kpi-value ${k.color||''}">${k.value}</div>
      <div class="kpi-sub">${k.sub}</div>`;
    mgmtGrid.appendChild(card);
  });
  lc.appendChild(mgmtGrid);

  // Répartition des phases (type de travail UX)
  const phaseTitle=mkEl('div','font-size:13px;font-weight:600;color:var(--text2);margin-bottom:8px;');
  phaseTitle.textContent='Répartition du travail par phase';lc.appendChild(phaseTitle);
  const phaseCount={};
  allSteps.forEach(s=>{phaseCount[s.phase]=(phaseCount[s.phase]||0)+1;});
  const phaseBar=mkEl('div','background:var(--surface);border:0.5px solid var(--border);border-radius:var(--r,4px);padding:16px;margin-bottom:16px;');
  const phaseBarInner=mkEl('div','display:flex;height:28px;border-radius:var(--r,4px);overflow:hidden;margin-bottom:10px;gap:2px;');
  const phaseTotal=Object.values(phaseCount).reduce((a,b)=>a+b,0)||1;
  Object.entries(phaseCount).sort((a,b)=>b[1]-a[1]).forEach(([ph,count])=>{
    const phInfo=PHASES[ph]||{label:ph,color:'teal'};const pp=PAL[phInfo.color]||PAL.teal;
    const pct=Math.round(count/phaseTotal*100);
    const seg=mkEl('div',`flex:${count};background:${pp.b};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;min-width:${pct>5?'0':'0'};`);
    if(pct>8)seg.textContent=pct+'%';
    seg.title=`${phInfo.label}: ${count} tâches (${pct}%)`;
    phaseBarInner.appendChild(seg);
  });
  phaseBar.appendChild(phaseBarInner);
  const phaseLegend=mkEl('div','display:flex;flex-wrap:wrap;gap:10px;');
  Object.entries(phaseCount).sort((a,b)=>b[1]-a[1]).forEach(([ph,count])=>{
    const phInfo=PHASES[ph]||{label:ph,color:'teal'};const pp=PAL[phInfo.color]||PAL.teal;
    const li=mkEl('div','display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text2);');
    li.innerHTML=`<div style="width:10px;height:10px;border-radius:3px;background:${pp.b}"></div>${phInfo.label} <span style="color:var(--text3)">${count}</span>`;
    phaseLegend.appendChild(li);
  });
  phaseBar.appendChild(phaseLegend);
  lc.appendChild(phaseBar);

  // Tâches de gestion manquantes (recommandations)
  const mgmtTasks=allSteps.filter(s=>s.phase==='GESTION');
  const projsWithoutGestion=DB.projects.filter(p=>!p.steps.some(s=>s.phase==='GESTION'));
  if(projsWithoutGestion.length){
    const recTitle=mkEl('div','font-size:13px;font-weight:600;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px;');
    recTitle.innerHTML=`💡 Recommandations <span style="font-size:11px;font-weight:400;color:var(--text3)">${projsWithoutGestion.length} projet${projsWithoutGestion.length>1?'s':''} sans tâche de gestion</span>`;
    lc.appendChild(recTitle);
    const recBox=mkEl('div','background:var(--amber-bg);border:0.5px solid var(--amber-b);border-radius:var(--r,4px);padding:14px 16px;margin-bottom:16px;');
    recBox.innerHTML=`<div style="font-size:12px;color:var(--amber-t);margin-bottom:8px">Ces projets n'ont pas de tâches de gestion (Brief, Cadrage, Reporting...) — le temps de gestion est donc invisible dans les KPIs :</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${projsWithoutGestion.slice(0,6).map(p=>`<span style="background:var(--surface);border:0.5px solid var(--amber-b);border-radius:5px;padding:2px 8px;font-size:11px;color:var(--amber-t);cursor:pointer" onclick="state.view='detail';state.projId='${p.id}';state.tab='steps';render()">${p.name}</span>`).join('')}</div>`;
    lc.appendChild(recBox);
  }
}

function addDashSection(container, title, sub){
  const wrap=mkEl('div','margin-bottom:14px;margin-top:8px;padding-bottom:10px;border-bottom:0.5px solid var(--border);');
  wrap.innerHTML=`<div style="font-size:18px;font-weight:700;letter-spacing:-.01em;color:var(--text)">${title}</div>
    <div style="font-size:12px;color:var(--text3);margin-top:2px">${sub}</div>`;
  container.appendChild(wrap);
}
