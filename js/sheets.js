// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── GOOGLE SHEETS SYNC ──────────────────────────────────────────────────

function jsonp(url, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonp_cb_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    params.callback = callbackName;
    const query = new URLSearchParams(params).toString();
    const script = document.createElement("script");

    const timeout = setTimeout(() => {
      reject(new Error("Timeout — pas de réponse du serveur"));
      delete window[callbackName];
      script.remove();
    }, 15000);

    window[callbackName] = function(response) {
      clearTimeout(timeout);
      resolve(response);
      delete window[callbackName];
      script.remove();
    };

    script.onerror = function() {
      clearTimeout(timeout);
      reject(new Error("Impossible de lire Google Sheets — vérifie l'URL et le déploiement"));
      delete window[callbackName];
      script.remove();
    };

    script.src = url + "?" + query;
    document.body.appendChild(script);
  });
}

function setSyncStatus(msg, color='var(--text3)'){
  const btn=document.getElementById('sync-btn');
  if(btn){ btn.textContent='☁️ '+msg; btn.style.color=color; }
}

async function syncFromSheets(){
  setSyncStatus('Chargement...','var(--blue-t)');
  try {
    const json = await jsonp(SHEETS_URL, { action: "read", t: Date.now() });
    console.log("Réponse Sheets (read):", json);
    if(!json.ok) throw new Error(json.error||'Erreur serveur');
    const data = json.data;

    // ── Acteurs ────────────────────────────────────────────────────────
    if(data.Acteurs && data.Acteurs.length>0){
      // Mapping positionnel : 0=ID, 1=Nom, 2=Rôle, 3=Couleur
      const newActors=data.Acteurs.slice(1).filter(row=>row && row[1] && String(row[1]).trim()).map(row=>({
        id:String(row[0]||uid()),
        name:String(row[1]||''),
        role:String(row[2]||'UX'),
        color:String(row[3]||'teal')
      }));
      if(newActors.length) DB.actors=newActors;
    }

    // ── Projets ────────────────────────────────────────────────────────
    if(data.Projets && data.Projets.length>0){
      const existingSteps={};
      DB.projects.forEach(p=>existingSteps[p.id]=p);
      // Mapping positionnel réel : 0=ID, 1=Nom, 2=Lane(texte pôle), 3=Couleur, 4=Pôle(souvent vide), 5=DateDébut, 6=DateFin, 7=Budget, 8=Acteurs, 9=Dossier, 10=Statut, 11=Note, 12=Tags
      // On ignore uniquement la 1ère ligne (titre fusionné), on garde toutes les autres
      DB.projects=data.Projets.slice(1).filter(row=>row && row[1] && String(row[1]).trim()).map(row=>{
        const id=String(row[0]||uid());
        const ex=existingSteps[id]||{};
        const laneVal=String(row[2]||'Pôle Industriel');
        let poleVal=String(row[4]||'').trim();
        if(!poleVal){
          if(laneVal.includes('Céréalier')) poleVal='Céréalier';
          else if(laneVal.includes('Industriel')) poleVal='Industriel';
          else if(laneVal.includes('Transversal')) poleVal='Transversal';
        }
        // Statut explicite (colonne 10) : réutilise la même cellule qu'avant (auparavant
        // une simple info "Livré/En cours" écrite mais jamais relue) — on la relit désormais
        // pour restaurer pause/terminé après un cycle sync ↓ / save ↑.
        const statutRaw=String(row[10]||'').trim().toLowerCase();
        const status=statutRaw.includes('pause')?'pause':statutRaw.includes('termin')?'termine':'actif';
        return {
          id,
          name:String(row[1]||''),
          lane:laneVal,
          color:String(row[3]||'purple'),
          pole:poleVal,
          status,
          budget:parseFloat(row[7])||0,
          startDate:String(row[5]||'').slice(0,10),
          endDate:String(row[6]||'').slice(0,10),
          note:String(row[11]||''),
          actors:String(row[8]||'').split(',').map(s=>s.trim()).filter(Boolean),
          steps:ex.steps||[], docs:ex.docs||[], crs:ex.crs||[]
        };
      });
    }

    // ── Taches ─────────────────────────────────────────────────────────
    if(data.Taches && data.Taches.length>0){
      DB.projects.forEach(p=>p.steps=[]);
      // Mapping positionnel : 0=IDTâche, 1=IDProjet, 2=NomProjet, 3=Phase, 4=NomTâche, 5=Assigné, 6=DateDébut, 7=DateFin, 8=Coût, 9=Priorité, 10=Statut
      data.Taches.slice(1).filter(row=>row && row[1] && row[4] && String(row[4]).trim()).forEach(row=>{
        const proj=DB.projects.find(p=>p.id===String(row[1]||''));
        if(!proj)return;
        const phase=String(row[3]||'OBSERVATION');
        proj.steps.push({
          id:String(row[0]||'s'+uid()),
          phase,
          name:String(row[4]||''),
          color:({PROPOSITION:'coral',OBSERVATION:'blue',ANALYSE:'purple',RESTITUTION:'teal',PROTOTYPE:'pink',TEST:'green',SUIVI_DEV:'blue',MEETING:'amber',GESTION:'green'})[phase]||'teal',
          startDate:String(row[6]||'').slice(0,10),
          endDate:String(row[7]||'').slice(0,10),
          assignee:String(row[5]||''),
          cost:parseFloat(row[8])||0,
          priority:String(row[9]||'normal'),
          done:String(row[10]||'').toLowerCase().includes('termin'),
          comments:[]
        });
      });
    }

    // ── CR ─────────────────────────────────────────────────────────────
    if(data.CR && data.CR.length>0){
      DB.projects.forEach(p=>p.crs=[]);
      // Mapping positionnel : 0=IDCR, 1=IDProjet, 2=NomProjet, 3=Date, 4=Titre, 5=Participants, 6=Contenu, 7=Statut
      data.CR.slice(1).filter(row=>row && row[1] && row[4] && String(row[4]).trim()).forEach(row=>{
        const proj=DB.projects.find(p=>p.id===String(row[1]||''));
        if(!proj)return;
        if(!proj.crs)proj.crs=[];
        proj.crs.push({
          id:String(row[0]||'cr'+uid()),
          title:String(row[4]||''),
          date:String(row[3]||'').slice(0,10),
          attendees:String(row[5]||'').split(',').map(s=>s.trim()).filter(Boolean),
          content:String(row[6]||'')
        });
      });
    }

    // ── Heures ─────────────────────────────────────────────────────────
    if(data.Heures && data.Heures.length>0){
      // Mapping positionnel : 0=ID, 1=ActeurID, 2=ProjetID, 3=TâcheID, 4=NomTâche, 5=Durée, 6=Date, 7=Note
      DB.hours=data.Heures.slice(1).filter(row=>row && row[2] && row[5] && row[6]).map(row=>({
        id:String(row[0]||'h'+uid()),
        actor:String(row[1]||''),
        projId:String(row[2]||''),
        taskId:String(row[3]||''),
        taskName:String(row[4]||''),
        dur:parseFloat(row[5])||0,
        date:String(row[6]||'').slice(0,10),
        note:String(row[7]||'')
      }));
    }

    saveDB();
    setSyncStatus('Sync ✓','var(--teal-t)');
    showToast('☁️ Synchronisé depuis Google Sheets — '+DB.projects.length+' projets');
    render();
  } catch(err){
    setSyncStatus('Erreur','var(--red-t)');
    showToast('❌ Erreur sync : '+err.message, true);
    console.error(err);
  }
}

async function saveToSheets(){
  showToast('💾 Sauvegarde vers Google Sheets...');
  try {
    // Build sheets data
    const acteurs=[
      ['ID','Nom','Rôle','Couleur','Email','Note'],
      ...DB.actors.map(a=>[a.id||'',a.name||'',a.role||'',a.color||'','',''])
    ];
    const projets=[
      ['ID','Nom projet','Lane','Couleur','Pôle','Date début','Date fin','Budget (€)','Acteurs','N° dossier','Statut','Note','Tags'],
      ...DB.projects.map(p=>[
        p.id||'', p.name||'', p.lane||'', p.color||'', p.pole||'',
        p.startDate||'', p.endDate||'', p.budget||0,
        (p.actors||[]).join(', '), '',
        ({actif:'Actif',pause:'En pause',termine:'Terminé'})[p.status||'actif'],
        p.note||'', ''
      ])
    ];
    const taches=[
      ['ID Tâche','ID Projet','Nom projet','Phase','Nom tâche','Assigné à','Date début','Date fin','Coût (€)','Priorité','Statut','Livrable','Validation','Commentaire'],
      ...DB.projects.flatMap(p=>(p.steps||[]).map(s=>[
        s.id||'', p.id||'', p.name||'', s.phase||'', s.name||'',
        s.assignee||'', s.startDate||'', s.endDate||'',
        s.cost||0, s.priority||'normal',
        s.done?'Terminé':isLate(s)?'En retard':'En cours',
        '', '', (s.comments||[]).map(c=>c.author+': '+c.text).join(' | ')
      ]))
    ];
    const crs=[
      ['ID CR','ID Projet','Nom projet','Date','Titre','Participants','Contenu / Actions','Statut'],
      ...DB.projects.flatMap(p=>(p.crs||[]).map(cr=>[
        cr.id||'', p.id||'', p.name||'', cr.date||'', cr.title||'',
        (cr.attendees||[]).join(', '), cr.content||'', 'Clôturé'
      ]))
    ];
    const heures=[
      ['ID','Acteur','ID Projet','ID Tâche','Nom tâche','Durée','Date','Note'],
      ...(DB.hours||[]).map(h=>[
        h.id||'', h.actor||'', h.projId||'', h.taskId||'',
        h.taskName||'', h.dur||0, h.date||'', h.note||''
      ])
    ];

    // POST classique avec lecture de la réponse réelle (permet de voir les vraies erreurs serveur)
    const payload = JSON.stringify({
      action: 'write',
      Acteurs: acteurs,
      Projets: projets,
      Taches: taches,
      CR: crs,
      Heures: heures
    });

    const formData = new FormData();
    formData.append('action', 'write');
    formData.append('payload', payload);

    const res = await fetch(SHEETS_URL, {
      method: 'POST',
      body: formData
    });
    const text = await res.text();
    console.log("Réponse brute Sheets (write):", text);
    let json;
    try { json = JSON.parse(text); } catch(parseErr) {
      throw new Error('Réponse non-JSON reçue : '+text.slice(0,200));
    }
    if(!json.ok) throw new Error(json.error || 'Erreur serveur');
    showToast('✅ Sauvegardé dans Google Sheets !');
    setSyncStatus('Sync ✓','var(--teal-t)');
  } catch(err){
    showToast('❌ Erreur sauvegarde : '+err.message, true);
    console.error(err);
  }
}

// Auto-sync on load
window.addEventListener('load', ()=>{
  setTimeout(()=>syncFromSheets(), 800);
});
