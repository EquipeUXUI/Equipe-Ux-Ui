// ════════════════════════════════════════════════════════════════
// IMPORT HISTORIQUE — LOT 2/2 — LAB4I BETTON (400021)
// = 'OET IA presses granulation' (confirmé via ton fichier de suivi)
// Couvre ANALYSE/OBSE, SOAL, SUIVI UX, MAQUETTAGE + miettes = 181,25h
// À coller dans la console (F12), APRÈS avoir déjà fait le lot 1.
// ════════════════════════════════════════════════════════════════
(function(){
  const MARKER = '(import historique)';
  const PROJECT_ID = 'iapg3';
  if((DB.hours||[]).some(h => h.projId===PROJECT_ID && (h.note||'').includes(MARKER))) {
    console.warn('⚠ Ce lot a déjà été importé pour ce projet. Annulé pour éviter un doublon.');
    return;
  }

  if(!DB.projects.find(p=>p.id===PROJECT_ID)) {
    DB.projects.push({id:PROJECT_ID, name:'OET IA presses granulation', lane:'Pôle Céréalier', color:'purple', pole:'Céréalier', budget:0, startDate:'2026-01-30', endDate:'2026-12-20', note:'Créé via import historique — affaire 400021, codes 50>D1>107 / 50>D1>102(SOAL) / 50>D2>211 / 50>D6>604. Vérifie qu\'il n\'existe pas déjà sous un autre ID dans ton Sheet.', actors:['pwh8u'], steps:[], docs:[], crs:[]});
  }

  const ENTRIES = [
    {p:'iapg3', t:'Indéterminé (import historique)', h:2.5, d:'2026-01-30'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:2.5, d:'2026-02-02'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:6.0, d:'2026-02-03'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:4.5, d:'2026-02-05'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:3.0, d:'2026-02-06'},
    {p:'iapg3', t:'ANALYSE (import historique)', h:1.5, d:'2026-02-04'},
    {p:'iapg3', t:'MAQUETTAGE (import historique)', h:2.0, d:'2026-02-09'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:1.5, d:'2026-02-13'},
    {p:'iapg3', t:'MAQUETTAGE (import historique)', h:0.75, d:'2026-02-17'},
    {p:'iapg3', t:'MAQUETTAGE (import historique)', h:0.5, d:'2026-02-20'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.5, d:'2026-02-17'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:3.25, d:'2026-02-27'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:4.5, d:'2026-03-02'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:7.5, d:'2026-03-03'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:3.0, d:'2026-03-06'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:4.0, d:'2026-03-05'},
    {p:'iapg3', t:'SOAL (import historique)', h:9.0, d:'2026-03-09'},
    {p:'iapg3', t:'SOAL (import historique)', h:9.0, d:'2026-03-10'},
    {p:'iapg3', t:'SOAL (import historique)', h:9.5, d:'2026-03-11'},
    {p:'iapg3', t:'SOAL (import historique)', h:8.5, d:'2026-03-12'},
    {p:'iapg3', t:'SOAL (import historique)', h:7.5, d:'2026-03-13'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:5.0, d:'2026-03-16'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:6.0, d:'2026-03-17'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:7.5, d:'2026-03-18'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:7.0, d:'2026-03-19'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.5, d:'2026-03-17'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.5, d:'2026-03-19'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:4.25, d:'2026-03-20'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:7.5, d:'2026-03-23'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:7.0, d:'2026-03-24'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:6.5, d:'2026-03-25'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:7.5, d:'2026-03-26'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:2.0, d:'2026-04-03'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.75, d:'2026-04-03'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:3.0, d:'2026-04-07'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:4.5, d:'2026-04-08'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:1.25, d:'2026-04-09'},
    {p:'iapg3', t:'ANALYSE/OBSE (import historique)', h:0.25, d:'2026-04-10'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:1.0, d:'2026-04-07'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.5, d:'2026-04-09'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:1.5, d:'2026-04-14'},
    {p:'iapg3', t:'SOAL (import historique)', h:3.5, d:'2026-04-22'},
    {p:'iapg3', t:'SOAL (import historique)', h:5.0, d:'2026-04-24'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.5, d:'2026-04-23'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.5, d:'2026-04-24'},
    {p:'iapg3', t:'SOAL (import historique)', h:2.0, d:'2026-04-27'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:3.0, d:'2026-04-27'},
    {p:'iapg3', t:'MAQUETTAGE (import historique)', h:1.0, d:'2026-05-19'},
    {p:'iapg3', t:'SUIVI UX (import historique)', h:0.75, d:'2026-05-22'},
  ];
  if(!DB.hours) DB.hours=[];
  ENTRIES.forEach(e => {
    DB.hours.push({id:'h'+uid(), actor:'pwh8u', projId:e.p, taskId:'', taskName:e.t, dur:e.h, date:e.d, note:MARKER});
  });
  saveDB();
  const total = ENTRIES.reduce((s,e)=>s+e.h,0);
  console.log('✅ Lot 2 importé : '+ENTRIES.length+' saisies, '+total.toFixed(2)+'h sur OET IA presses granulation.');
  if(typeof render==='function') render();
  if(typeof showToast==='function') showToast('✅ Lot 2 importé : '+total.toFixed(2)+'h (IA presses granulation)');
})();