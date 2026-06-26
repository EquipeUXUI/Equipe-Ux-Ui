// Équipe UX UI — page "Projets" (3e onglet de navigation)
// Sert de complément à la Roadmap (qui ne montre plus que actif/pause) et de seule
// destination pour les projets terminés (archive consultable, jamais perdue).

function renderProjectsPage(){
  const lc=document.getElementById('left-col');lc.innerHTML='';lc.style.cssText='';

  // ── En-tête + sous-onglets Général / En cours / Terminé ─────────────────
  const headerRow=document.createElement('div');
  headerRow.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:4px;';
  headerRow.innerHTML=`<div class="section-title">Projets</div>`;
  lc.appendChild(headerRow);

  const counts={
    actif:DB.projects.filter(p=>projStatusKey(p)==='actif').length,
    pause:DB.projects.filter(p=>projStatusKey(p)==='pause').length,
    termine:DB.projects.filter(p=>projStatusKey(p)==='termine').length,
  };
  const tabsWrap=document.createElement('div');tabsWrap.className='tabs';
  const subTabs=[
    ['general','Général',null],
    ['encours','En cours',counts.actif+counts.pause],
    ['termine','Terminé',counts.termine],
  ];
  subTabs.forEach(([id,label,count])=>{
    const t=document.createElement('div');t.className='tab'+(state.projTab===id?' active':'');
    t.textContent=count===null?label:`${label} (${count})`;
    t.onclick=()=>{state.projTab=id;render();};
    tabsWrap.appendChild(t);
  });
  lc.appendChild(tabsWrap);

  if(state.projTab==='encours') renderProjectsEnCours(lc);
  else if(state.projTab==='termine') renderProjectsTermine(lc);
  else renderProjectsGeneral(lc,counts);
}

// ─── ONGLET GÉNÉRAL ──────────────────────────────────────────────────────
// Vue d'ensemble agrégée, tous statuts confondus — la seule vue de l'outil qui
// donne une photo complète de l'activité de l'équipe depuis le début.
function renderProjectsGeneral(lc,counts){
  const all=DB.projects;
  const totalBudgetAll=all.reduce((s,p)=>s+(p.budget||0),0);
  const totalSpentAll=all.reduce((s,p)=>s+stepCost(p),0);
  const termines=all.filter(p=>projStatusKey(p)==='termine');
  const avgDureeTermines=termines.length?Math.round(termines.reduce((s,p)=>s+Math.max(0,dBetween(p.startDate,p.endDate)),0)/termines.length):0;

  const kpiWrap=document.createElement('div');kpiWrap.className='kpi-row';kpiWrap.style.marginTop='16px';
  kpiWrap.innerHTML=`
    <div class="kpi"><div class="kpi-label">Projets actifs</div><div class="kpi-value info">${counts.actif}</div><div class="kpi-sub">en ce moment</div></div>
    <div class="kpi"><div class="kpi-label">En pause</div><div class="kpi-value" style="color:var(--text3)">${counts.pause}</div><div class="kpi-sub">en attente de reprise</div></div>
    <div class="kpi"><div class="kpi-label">Terminés</div><div class="kpi-value ok">${counts.termine}</div><div class="kpi-sub">${avgDureeTermines?avgDureeTermines+' j en moyenne':'&nbsp;'}</div></div>
    <div class="kpi"><div class="kpi-label">Budget total (tous statuts)</div><div class="kpi-value">${totalBudgetAll?totalBudgetAll.toLocaleString('fr-FR')+'€':'—'}</div><div class="kpi-sub">${totalSpentAll?totalSpentAll.toLocaleString('fr-FR')+'€ engagé':'&nbsp;'}</div></div>
  `;
  lc.appendChild(kpiWrap);

  // Répartition par pôle, tous statuts confondus
  const byPoleAll={};
  all.forEach(p=>{const pole=p.pole||'Transversal';(byPoleAll[pole]=byPoleAll[pole]||[]).push(p);});
  const poleTitle=document.createElement('div');poleTitle.className='section-title';poleTitle.style.cssText='font-size:14px;margin:22px 0 10px;';
  poleTitle.textContent='Répartition par pôle';
  lc.appendChild(poleTitle);
  const poleGrid=document.createElement('div');poleGrid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;';
  Object.entries(byPoleAll).forEach(([pole,projs])=>{
    const cl=PAL[POLE_COLORS[pole]]||PAL.blue;
    const a=projs.filter(p=>projStatusKey(p)==='actif').length;
    const pa=projs.filter(p=>projStatusKey(p)==='pause').length;
    const t=projs.filter(p=>projStatusKey(p)==='termine').length;
    const card=document.createElement('div');
    card.style.cssText='background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);box-shadow:var(--sh);padding:14px 16px;';
    card.innerHTML=`
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:8px">
        <span style="width:9px;height:9px;border-radius:3px;background:${cl.hex};flex-shrink:0"></span>
        <span style="font-size:13px;font-weight:700;color:var(--text)">${pole}</span>
        <span style="font-size:11px;color:var(--text3);margin-left:auto">${projs.length} projet${projs.length!==1?'s':''}</span>
      </div>
      <div style="font-size:11.5px;color:var(--text2)">${a} actif${a!==1?'s':''} · ${pa} en pause · ${t} terminé${t!==1?'s':''}</div>`;
    poleGrid.appendChild(card);
  });
  lc.appendChild(poleGrid);

  if(!all.length){
    const empty=document.createElement('div');
    empty.style.cssText='margin-top:24px;padding:24px;text-align:center;color:var(--text3);font-size:12.5px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);';
    empty.textContent='Aucun projet pour l\'instant.';
    lc.appendChild(empty);
  }
}

// ─── ONGLET EN COURS ─────────────────────────────────────────────────────
// Mêmes cartes-anneaux que le Dashboard (actifs + en pause), pour une vision
// complète indépendante des filtres du Dashboard.
function renderProjectsEnCours(lc){
  const projs=nonTerminatedProjects();
  const wrap=document.createElement('div');
  wrap.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:16px 6px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);box-shadow:var(--sh);padding:18px;margin-top:16px;';
  if(!projs.length){
    const empty=document.createElement('div');
    empty.style.cssText='padding:18px;text-align:center;color:var(--text3);font-size:12px;grid-column:1/-1;';
    empty.textContent='Aucun projet actif ou en pause.';
    wrap.appendChild(empty);
  }
  [...projs].sort((a,b)=>{
    const sa=projStatus(a),sb=projStatus(b);
    return sa.order!==sb.order?sa.order-sb.order:projProg(a)-projProg(b);
  }).forEach(proj=>wrap.appendChild(buildProjRingCell(proj)));
  lc.appendChild(wrap);
}

// ─── ONGLET TERMINÉ ──────────────────────────────────────────────────────
// Archive consultable : un projet marqué terminé n'apparaît plus nulle part
// ailleurs dans l'outil, donc cette vue doit rester la porte d'entrée fiable
// vers l'historique (avec un retour en arrière possible via "Réactiver").
function renderProjectsTermine(lc){
  const projs=DB.projects.filter(p=>projStatusKey(p)==='termine')
    .sort((a,b)=>new Date(b.endDate)-new Date(a.endDate));
  const wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:16px;';
  if(!projs.length){
    const empty=document.createElement('div');
    empty.style.cssText='padding:24px;text-align:center;color:var(--text3);font-size:12.5px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);';
    empty.textContent='Aucun projet terminé pour l\'instant.';
    wrap.appendChild(empty);
  }
  projs.forEach(proj=>{
    const p=PAL[proj.color]||PAL.teal;
    const duree=Math.max(0,dBetween(proj.startDate,proj.endDate));
    const spent=stepCost(proj);
    const card=document.createElement('div');
    card.style.cssText='display:flex;align-items:center;gap:14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r,10px);box-shadow:var(--sh);padding:14px 16px;cursor:pointer;';
    card.innerHTML=`
      <div style="width:8px;height:8px;border-radius:3px;background:${p.hex};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:700;color:var(--text)">${proj.name}</div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">${proj.lane} · ${fmtDFull(proj.startDate)} → ${fmtDFull(proj.endDate)} · ${duree} j</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:13px;font-weight:700;color:var(--text)">${spent?spent.toLocaleString('fr-FR')+'€':'—'}</div>
        <div style="font-size:10.5px;color:var(--text3)">${proj.budget?'sur '+proj.budget.toLocaleString('fr-FR')+'€':'coût final'}</div>
      </div>
      <button class="btn-secondary sm" style="flex-shrink:0">↩️ Réactiver</button>
    `;
    card.querySelector('button').onclick=(ev)=>{ev.stopPropagation();reactivateProject(proj.id);};
    card.addEventListener('click',()=>{state.view='detail';state.projId=proj.id;state.tab='steps';render();});
    wrap.appendChild(card);
  });
  lc.appendChild(wrap);
}
