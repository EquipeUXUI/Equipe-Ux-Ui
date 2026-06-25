// ════════════════════════════════════════════════════════════════
// IMPORT HISTORIQUE — 22 feuilles d'heures OET (semaines 4-25, 2026)
// À coller UNE SEULE FOIS dans la console du navigateur (F12), sur
// la page de l'outil, pendant qu'il est ouvert. Puis Entrée.
// Vérifie le résultat à l'écran, puis clique sur le bouton
// 'Sauvegarder vers Google Sheets' pour pousser tout ça dans le nouvel
// onglet Heures (et les 4 nouveaux projets dans l'onglet Projets).
// ════════════════════════════════════════════════════════════════
(function(){
  const MARKER = '(import historique)';
  if((DB.hours||[]).some(h => (h.note||'').includes(MARKER))) {
    console.warn('⚠ Import déjà fait — des saisies marquées "'+MARKER+'" existent déjà. Annulé pour éviter un doublon.');
    return;
  }

  // ── 4 nouveaux projets clients (Pôle/Lane à valider — mis par défaut
  // sur Pôle Industriel comme Yoplait, car mêmes codes MES Analyse/Etude) ──
  const NEW_PROJECTS = [
    {id:'hut3v', name:'Hutchinson SNC', lane:'Pôle Industriel', color:'blue', pole:'Industriel', budget:0, startDate:'2026-01-26', endDate:'2026-04-29', note:'Créé via import historique — Pôle/Lane à valider, affaire 802012', actors:['pwh8u'], steps:[], docs:[], crs:[]},
    {id:'brd7m', name:'Bridor', lane:'Pôle Industriel', color:'blue', pole:'Industriel', budget:0, startDate:'2026-01-21', endDate:'2026-04-01', note:'Créé via import historique — Pôle/Lane à valider, affaire 802653', actors:['pwh8u'], steps:[], docs:[], crs:[]},
    {id:'unt2k', name:'Unither Industries', lane:'Pôle Industriel', color:'blue', pole:'Industriel', budget:0, startDate:'2026-05-20', endDate:'2026-06-16', note:'Créé via import historique — Pôle/Lane à valider, affaire 804143', actors:['pwh8u'], steps:[], docs:[], crs:[]},
    {id:'and9p', name:'Andros', lane:'Pôle Industriel', color:'blue', pole:'Industriel', budget:0, startDate:'2026-06-11', endDate:'2026-06-11', note:'Créé via import historique — Pôle/Lane à valider, affaire 804249', actors:['pwh8u'], steps:[], docs:[], crs:[]},
  ];
  NEW_PROJECTS.forEach(np => {
    if(!DB.projects.find(p=>p.id===np.id)) DB.projects.push(np);
  });

  // ── Saisies d'heures (acteur = pwh8u = Ad) ──────────────────────
  const ENTRIES = [
    {p:'brd7m', t:'MES Etude (import historique)', h:7.5, d:'2026-01-21'},
    {p:'brd7m', t:'MES Etude (import historique)', h:5.0, d:'2026-01-22'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:2.0, d:'2026-01-19'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:3.0, d:'2026-01-23'},
    {p:'qrh5q', t:'Commerce (import historique)', h:0.5, d:'2026-01-19'},
    {p:'qrh5q', t:'Commerce (import historique)', h:5.5, d:'2026-01-20'},
    {p:'hut3v', t:'[C] UX (import historique)', h:4.0, d:'2026-01-26'},
    {p:'hut3v', t:'[C] UX (import historique)', h:7.0, d:'2026-01-27'},
    {p:'hut3v', t:'[C] UX (import historique)', h:2.0, d:'2026-01-28'},
    {p:'hut3v', t:'REUNIONS UX (import historique)', h:0.5, d:'2026-01-27'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:3.5, d:'2026-01-26'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:5.5, d:'2026-01-28'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:3.5, d:'2026-01-29'},
    {p:'0hpje', t:'ANALYSE UX UI (import historique)', h:1.0, d:'2026-02-06'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:5.0, d:'2026-02-02'},
    {p:'okh2c', t:'INDETERMINEE (import historique)', h:4.0, d:'2026-02-04'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:6.0, d:'2026-02-10'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:5.5, d:'2026-02-11'},
    {p:'hut3v', t:'[C] UX (import historique)', h:4.5, d:'2026-02-12'},
    {p:'hut3v', t:'[C] UX (import historique)', h:1.0, d:'2026-02-13'},
    {p:'0hpje', t:'ANALYSE UX UI (import historique)', h:5.5, d:'2026-02-09'},
    {p:'0hpje', t:'ANALYSE UX UI (import historique)', h:1.0, d:'2026-02-13'},
    {p:'hut3v', t:'[C] UX (import historique)', h:0.5, d:'2026-02-16'},
    {p:'mgo8n', t:'Indéterminé (import historique)', h:0.5, d:'2026-02-18'},
    {p:'mgo8n', t:'Indéterminé (import historique)', h:3.0, d:'2026-02-19'},
    {p:'mgo8n', t:'Indéterminé (import historique)', h:2.5, d:'2026-02-20'},
    {p:'brd7m', t:'MAQUETTAGE (import historique)', h:4.0, d:'2026-02-16'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:2.0, d:'2026-02-16'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:4.0, d:'2026-02-17'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:6.5, d:'2026-02-18'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:4.5, d:'2026-02-19'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:2.0, d:'2026-02-20'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.5, d:'2026-02-25'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.5, d:'2026-02-26'},
    {p:'mgo8n', t:'000 (import historique)', h:1.0, d:'2026-02-23'},
    {p:'mgo8n', t:'000 (import historique)', h:1.0, d:'2026-02-24'},
    {p:'brd7m', t:'MAQUETTAGE (import historique)', h:0.5, d:'2026-02-23'},
    {p:'hut3v', t:'[C] UX (import historique)', h:2.0, d:'2026-03-02'},
    {p:'hut3v', t:'[C] UX (import historique)', h:2.0, d:'2026-03-04'},
    {p:'mgo8n', t:'000 (import historique)', h:4.5, d:'2026-03-04'},
    {p:'brd7m', t:'REUNIONS UX (import historique)', h:0.5, d:'2026-03-24'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:2.25, d:'2026-04-03'},
    {p:'brd7m', t:'MAQUETTAGE (import historique)', h:5.0, d:'2026-04-01'},
    {p:'0086v', t:'INDETERMINEE (import historique)', h:7.0, d:'2026-03-30'},
    {p:'0086v', t:'INDETERMINEE (import historique)', h:7.5, d:'2026-03-31'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:2.0, d:'2026-04-07'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:2.0, d:'2026-04-10'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:1.5, d:'2026-04-08'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:1.75, d:'2026-04-09'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:6.5, d:'2026-04-17'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:3.0, d:'2026-04-13'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:6.0, d:'2026-04-14'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:5.5, d:'2026-04-15'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:6.0, d:'2026-04-16'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.25, d:'2026-04-20'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.5, d:'2026-04-21'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:4.0, d:'2026-04-22'},
    {p:'35asj', t:'Veille Techno (import historique)', h:5.0, d:'2026-04-23'},
    {p:'35asj', t:'Veille Techno (import historique)', h:1.5, d:'2026-04-24'},
    {p:'hut3v', t:'Indéterminé (import historique)', h:0.25, d:'2026-04-29'},
    {p:'35asj', t:'Veille Techno (import historique)', h:2.0, d:'2026-04-27'},
    {p:'35asj', t:'Veille Techno (import historique)', h:7.5, d:'2026-04-28'},
    {p:'35asj', t:'Veille Techno (import historique)', h:7.25, d:'2026-04-29'},
    {p:'35asj', t:'Veille Techno (import historique)', h:1.5, d:'2026-04-30'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:6.5, d:'2026-05-07'},
    {p:'gfu57', t:'SP -DEV - PROG (import historique)', h:1.0, d:'2026-05-04'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:7.5, d:'2026-05-06'},
    {p:'0hpje', t:'DEV UX UI (import historique)', h:1.0, d:'2026-05-07'},
    {p:'0086v', t:'INDETERMINEE (import historique)', h:5.5, d:'2026-05-05'},
    {p:'35asj', t:'Veille Techno (import historique)', h:5.75, d:'2026-05-04'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.5, d:'2026-05-11'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:3.5, d:'2026-05-13'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:3.0, d:'2026-05-15'},
    {p:'35asj', t:'Veille Techno (import historique)', h:3.5, d:'2026-05-12'},
    {p:'qrh5q', t:'DEV DRIVEALIA (import historique)', h:2.5, d:'2026-05-19'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:4.75, d:'2026-05-20'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:4.0, d:'2026-05-18'},
    {p:'0hpje', t:'ANALYSE UX UI (import historique)', h:1.25, d:'2026-05-20'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:0.5, d:'2026-05-20'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:7.5, d:'2026-05-21'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:0.75, d:'2026-05-22'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:0.5, d:'2026-05-26'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:6.5, d:'2026-05-27'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.5, d:'2026-05-28'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:3.5, d:'2026-05-29'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:0.5, d:'2026-05-26'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:1.0, d:'2026-05-27'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:6.0, d:'2026-05-26'},
    {p:'qrh5q', t:'DEV DRIVEALIA (import historique)', h:0.5, d:'2026-06-04'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:7.0, d:'2026-06-01'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:6.5, d:'2026-06-02'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:7.0, d:'2026-06-04'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:4.0, d:'2026-06-05'},
    {p:'qrh5q', t:'DEV DRIVEALIA (import historique)', h:0.5, d:'2026-06-09'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:1.0, d:'2026-06-08'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:1.5, d:'2026-06-12'},
    {p:'gfu57', t:'SP -DEV - (import historique)', h:3.0, d:'2026-06-08'},
    {p:'gfu57', t:'SP -DEV - (import historique)', h:2.5, d:'2026-06-09'},
    {p:'0086v', t:'INDETERMINEE (import historique)', h:3.5, d:'2026-06-09'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:1.0, d:'2026-06-08'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:4.5, d:'2026-06-12'},
    {p:'and9p', t:'Indéterminé (import historique)', h:1.0, d:'2026-06-11'},
    {p:'35asj', t:'Veille Techno (import historique)', h:1.0, d:'2026-06-08'},
    {p:'35asj', t:'Veille Techno (import historique)', h:1.0, d:'2026-06-09'},
    {p:'0086v', t:'GTB GTC CEME (import historique)', h:1.5, d:'2026-06-15'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:1.5, d:'2026-06-16'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:0.5, d:'2026-06-17'},
    {p:'i0ogu', t:'DESIGNSYSTEM (import historique)', h:1.0, d:'2026-06-18'},
    {p:'gfu57', t:'SP - UX - DOSING (import historique)', h:3.0, d:'2026-06-17'},
    {p:'0086v', t:'INDETERMINEE (import historique)', h:1.5, d:'2026-06-18'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:1.5, d:'2026-06-15'},
    {p:'unt2k', t:'INDETERMINEE (import historique)', h:6.0, d:'2026-06-16'},
    {p:'35asj', t:'Veille Techno (import historique)', h:1.5, d:'2026-06-17'},
    {p:'qrh5q', t:'Commerce (import historique)', h:0.5, d:'2026-06-15'},
    {p:'qrh5q', t:'Commerce (import historique)', h:2.5, d:'2026-06-17'},
  ];
  if(!DB.hours) DB.hours=[];
  ENTRIES.forEach(e => {
    DB.hours.push({id:'h'+uid(), actor:'pwh8u', projId:e.p, taskId:'', taskName:e.t, dur:e.h, date:e.d, note:MARKER});
  });
  saveDB();
  const total = ENTRIES.reduce((s,e)=>s+e.h,0);
  console.log('✅ Import terminé : '+ENTRIES.length+' saisies, '+total.toFixed(2)+'h, '+NEW_PROJECTS.length+' nouveaux projets créés.');
  if(typeof render==='function') render();
  if(typeof showToast==='function') showToast('✅ Historique importé : '+total.toFixed(2)+'h sur '+ENTRIES.length+' saisies');
})();