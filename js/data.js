// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── PALETTE ─────────────────────────────────────────────────────────────
const PAL={
  teal:  {bg:'var(--teal-bg)',  b:'var(--teal-b)',  t:'var(--teal-t)',  hex:'#0F6E56'},
  blue:  {bg:'var(--blue-bg)',  b:'var(--blue-b)',  t:'var(--blue-t)',  hex:'#185FA5'},
  purple:{bg:'var(--purple-bg)',b:'var(--purple-b)',t:'var(--purple-t)',hex:'#534AB7'},
  amber: {bg:'var(--amber-bg)', b:'var(--amber-b)', t:'var(--amber-t)', hex:'#BA7517'},
  coral: {bg:'var(--coral-bg)', b:'var(--coral-b)', t:'var(--coral-t)', hex:'#993C1D'},
  green: {bg:'var(--green-bg)', b:'var(--green-b)', t:'var(--green-t)', hex:'#3B6D11'},
  pink:  {bg:'var(--pink-bg)',  b:'var(--pink-b)',  t:'var(--pink-t)',  hex:'#993556'},
  green2:{bg:'var(--green-bg)', b:'var(--green-b)', t:'var(--green-t)', hex:'#3B6D11'},
  // Pas une couleur de thème projet (absente de COLORS / color-picker) : utilisée uniquement
  // pour l'état "En pause", qui doit visuellement neutraliser la couleur du pôle/projet.
  grey:  {bg:'var(--surface2)', b:'var(--border-md)',t:'var(--text3)',  hex:'#8A9696'},
};
const COLORS=Object.keys(PAL).filter(c=>c!=='grey');
const MONTHS=['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
const SHEETS_URL='https://script.google.com/macros/s/AKfycbzOp90XJc67OfKQ8Sz3UjV7Fxz_TtEXCbT2CWzgyPe15zn-WNiz6XxbMdnY3o21Im8/exec';
const TODAY=new Date();TODAY.setHours(0,0,0,0);
// Convertit une date en YYYY-MM-DD en utilisant le fuseau horaire LOCAL (toISOString() utilise UTC et peut décaler d'un jour)
function localDateStr(d){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
const TODAY_STR=localDateStr(TODAY);
const LANE_ORDER=['Pôle Industriel','Pôle Céréalier','R&D','Pop','Transversal','Gestion'];
const LANE_COLORS={'Pôle Industriel':'blue','Pôle Céréalier':'amber','R&D':'purple','Pop':'coral','Transversal':'teal','Gestion':'green'};
// Couleurs par pôle (Industriel/Céréalier/Transversal) — partagé entre le Dashboard et la page Projets
// pour que le même projet ait toujours la même pastille de couleur partout.
const POLE_COLORS={Industriel:'blue',Céréalier:'green',Transversal:'purple'};
// Déduit le pôle (Industriel/Céréalier/Transversal) à partir de la catégorie/lane — évite la duplication d'information
function derivePole(lane){
  if(!lane) return '';
  if(lane.includes('Céréalier')) return 'Céréalier';
  if(lane.includes('Industriel')) return 'Industriel';
  return 'Transversal';
}
const PHASES={
  PROPOSITION:  {label:'Proposition commerciale', color:'coral'},
  OBSERVATION:  {label:'Observation',             color:'blue'},
  ANALYSE:      {label:'Analyses',                color:'purple'},
  RESTITUTION:  {label:'Restitution',             color:'teal'},
  PROTOTYPE:    {label:'Prototype',               color:'pink'},
  TEST:         {label:'Test utilisateur',        color:'green'},
  SUIVI_DEV:    {label:'Suivi développement',     color:'blue'},
  MEETING:      {label:'Réunion',                 color:'amber'},
  GESTION:      {label:'Gestion',                 color:'green'},
};
const ROLES=['UX Lead','UX','Dev','Design','Produit'];
const PRIORITIES={high:{label:'Haute',color:'#D83A2A'},normal:{label:'Normale',color:'#BA7517'},low:{label:'Basse',color:'#9A9A94'}};

// ─── DB ──────────────────────────────────────────────────────────────────
function loadDB(){try{return JSON.parse(localStorage.getItem('uxui_v4')||'null');}catch(e){return null;}}
function saveDB(){localStorage.setItem('uxui_v4',JSON.stringify(DB));}

let DB=loadDB()||{
  actors:[
    {id:'ad',name:'Ad',role:'UX Lead',color:'purple'},
  ],
  projects:[
  ],
  milestones:[{month:6,label:'Deadline jury',color:'coral'},{month:9,label:'Go/No-go',color:'blue'},{month:12,label:'Bilan',color:'purple'}]
};

// ─── UTILS ───────────────────────────────────────────────────────────────
const uid=()=>Math.random().toString(36).slice(2,7);
const dBetween=(a,b)=>Math.round((new Date(b)-new Date(a))/86400000);
const isLate=s=>!s.done&&new Date(s.endDate)<TODAY;
const fmtD=d=>{if(!d)return'';const dt=new Date(d);return dt.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});};
const fmtDFull=d=>{if(!d)return'';const dt=new Date(d);return dt.toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'});};
const actor=id=>DB.actors.find(a=>a.id===id)||{name:id,color:'teal',role:''};
const projProg=p=>p.steps.length?Math.round(p.steps.filter(s=>s.done).length/p.steps.length*100):0;
const TJM_DEFAULT=400; // taux journalier moyen, configurable plus tard par équipier
const CAPACITY_HOURS_WEEK=35; // base de référence pour calculer la charge en % (Vue Équipe du dashboard) — à ajuster si besoin
const projLate=p=>p.steps.some(s=>isLate(s));
// ─── STATUT PROJET (actif / pause / termine) ──────────────────────────────
// Champ explicite (et non déduit des dates/tâches) : "pause" est une décision
// manuelle réversible (toggle dans la fiche projet), "termine" est une action
// volontaire (bouton "Terminer le projet") — jamais un calcul automatique sur
// l'avancement, car des tâches s'ajoutent en cours de route.
const projStatusKey=p=>p.status||'actif';
// Projets affichés sur la Roadmap / Dashboard / sidebar : on masque seulement les terminés
// (les projets en pause restent visibles, grisés/hachurés).
const nonTerminatedProjects=()=>DB.projects.filter(p=>projStatusKey(p)!=='termine');
// Projets pris en compte pour les alertes/retards/météo : on ignore aussi les pauses,
// puisqu'un retard sur un projet volontairement arrêté n'est pas une urgence.
const activeProjects=()=>DB.projects.filter(p=>projStatusKey(p)==='actif');
// Statut d'un projet pour l'affichage couleur du dashboard (gris/rouge/amber/teal) :
// en pause (prioritaire, neutralise le calcul de retard) > retard avéré >
// échéance à ≤7 jours (même horizon que les "Alertes & échéances proches") > à jour
function projStatus(p){
  if(projStatusKey(p)==='pause') return {key:'pause', order:1.5, color:'grey', label:'En pause'};
  if(projLate(p)) return {key:'late', order:0, color:'red', label:'En retard'};
  if(projProg(p)<100){
    const dLeft=dBetween(TODAY_STR,p.endDate);
    if(dLeft>=0&&dLeft<=7) return {key:'soon', order:1, color:'amber', label:'À surveiller'};
  }
  return {key:'ok', order:2, color:'teal', label:'À jour'};
}
// Tâches en retard / à échéance proche (J+7) — utilisé par le panneau Alertes (colonne de droite)
// Restreint aux projets actifs : un projet en pause ou terminé ne doit pas générer d'alerte.
function computeDeadlines(){
  const allSteps=activeProjects().flatMap(p=>p.steps.map(s=>({...s,proj:p})));
  const in7=new Date(TODAY);in7.setDate(in7.getDate()+7);
  const late=allSteps.filter(s=>isLate(s));
  const upcoming=allSteps.filter(s=>!s.done&&!isLate(s)&&new Date(s.endDate)<=in7&&new Date(s.endDate)>=TODAY);
  return {late, upcoming};
}
// Alertes du dashboard (surcharge hebdo, projets en retard, bus factor) — affichées dans la colonne de droite en vue Dashboard
// Restreint aux projets actifs, pour la même raison que computeDeadlines().
function computeAlerts(){
  const alerts=[];
  DB.actors.forEach(a=>{
    const h=actorWeekHours(a.id);
    const pct=Math.round(h/CAPACITY_HOURS_WEEK*100);
    if(pct>100) alerts.push({icon:'🔥',color:'red',title:`${a.name} : charge à ${pct}%`,detail:`${h}h cette semaine sur une base de ${CAPACITY_HOURS_WEEK}h`});
  });
  const lateProjsList=activeProjects().filter(p=>projLate(p));
  if(lateProjsList.length) alerts.push({icon:'⏱️',color:'amber',title:`${lateProjsList.length} projet${lateProjsList.length>1?'s':''} en retard`,detail:lateProjsList.map(p=>p.name).join(', ')});
  const soloByActor={};
  activeProjects().forEach(p=>{
    if(p.actors&&p.actors.length===1&&!(p.steps.length&&p.steps.every(s=>s.done))){
      const aid=p.actors[0];
      (soloByActor[aid]=soloByActor[aid]||[]).push(p.name);
    }
  });
  Object.entries(soloByActor).forEach(([aid,names])=>{
    alerts.push({icon:'👤',color:'amber',title:`${actor(aid).name} est la seule personne sur ${names.length} projet${names.length>1?'s':''}`,detail:names.join(', ')});
  });
  return alerts;
}
// Heures réelles saisies pour un projet (toutes saisies confondues)
const projHoursReal=p=>(DB.hours||[]).filter(h=>h.projId===p.id).reduce((s,h)=>s+(h.dur||0),0);
const projHoursPrevu=p=>p.steps.reduce((s,t)=>s+(t.hoursPrevues||0),0);
// Coût réel = coût manuel sur tâches + (heures saisies / 7h par jour) * TJM
const stepCost=p=>{
  const manualCost=p.steps.reduce((s,t)=>s+(t.cost||0),0);
  const hoursReal=projHoursReal(p);
  const hoursCost=hoursReal>0?Math.round(hoursReal/7*TJM_DEFAULT):0;
  return manualCost+hoursCost;
};
const timePct=p=>{const tot=Math.max(1,dBetween(p.startDate,p.endDate));const el=Math.max(0,dBetween(p.startDate,TODAY_STR));return Math.min(100,Math.round(el/tot*100));};
const dailyRate=p=>{const el=Math.max(1,dBetween(p.startDate,TODAY_STR));const c=stepCost(p);return c>0?Math.round(c/el):0;};
function meteoStatus(){
  const visibleProjs=nonTerminatedProjects();
  const lateP=activeProjects().filter(p=>projLate(p)).length;
  const prog=visibleProjs.length?Math.round(visibleProjs.reduce((s,p)=>s+projProg(p),0)/visibleProjs.length):0;
  const svgSun=`<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M40.5 27.5C40.5 34.6797 34.6797 40.5 27.5 40.5C20.3203 40.5 14.5 34.6797 14.5 27.5C14.5 20.3203 20.3203 14.5 27.5 14.5C34.6797 14.5 40.5 20.3203 40.5 27.5Z" fill="#FEC84B"/> </svg>`;
  const svgCloud=`<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M49 21.5C49 27.5751 44.0751 32.5 38 32.5C31.9249 32.5 27 27.5751 27 21.5C27 15.4249 31.9249 10.5 38 10.5C44.0751 10.5 49 15.4249 49 21.5Z" fill="#FEC84B"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 7.5C29.8397 7.5 38.0196 14.6058 39.6885 23.9658C40.7406 23.6643 41.851 23.5 43 23.5C49.6274 23.5 55 28.8726 55 35.5C55 42.1274 49.6274 47.5 43 47.5H20C8.9543 47.5 0 38.5457 0 27.5C0 16.4543 8.9543 7.5 20 7.5ZM20 10.5C10.6112 10.5 3 18.1112 3 27.5C3 36.8888 10.6112 44.5 20 44.5H43C47.9706 44.5 52 40.4706 52 35.5C52 30.5294 47.9706 26.5 43 26.5C42.1386 26.5 41.3058 26.6229 40.5146 26.8496L37.3184 27.7656L36.7354 24.4922C35.317 16.5382 28.3605 10.5 20 10.5Z" fill="#1D2B39"/> </svg>`;
  const svgRain=`<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.3759 43.2029C26.2758 44.933 25.6028 47.0651 23.8727 47.9651C22.1425 48.865 20.0104 48.192 19.1105 46.4618C18.2106 44.7317 16.6265 35.3156 16.1327 33.0848C17.6757 34.7698 24.4759 41.4728 25.3759 43.2029Z" fill="#4BAACA"/> <path d="M33.6526 49.7703C34.1364 50.7003 33.7746 51.8464 32.8446 52.3301C31.9145 52.8139 30.7684 52.4521 30.2847 51.5221C29.8009 50.5921 28.9494 45.5304 28.684 44.3313C29.5134 45.2371 33.1689 48.8402 33.6526 49.7703Z" fill="#4BAACA"/> <path d="M42.3236 41.8451C42.9377 43.0256 42.4785 44.4803 41.298 45.0943C40.1176 45.7083 38.6629 45.2491 38.0488 44.0687C37.4348 42.8882 36.354 36.4637 36.0171 34.9416C37.0699 36.0913 41.7096 40.6647 42.3236 41.8451Z" fill="#4BAACA"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 2.45532C29.8397 2.45532 38.0196 9.56113 39.6885 18.9211C40.7406 18.6196 41.851 18.4553 43 18.4553C49.6274 18.4553 55 23.8279 55 30.4553C55 37.0827 49.6274 42.4553 43 42.4553H20C8.9543 42.4553 0 33.501 0 22.4553C0 11.4096 8.9543 2.45532 20 2.45532ZM20 5.45532C10.6112 5.45532 3 13.0665 3 22.4553C3 31.8442 10.6112 39.4553 20 39.4553H43C47.9706 39.4553 52 35.4259 52 30.4553C52 25.4848 47.9706 21.4553 43 21.4553C42.1386 21.4553 41.3058 21.5782 40.5146 21.8049L37.3184 22.7209L36.7354 19.4475C35.317 11.4935 28.3605 5.45532 20 5.45532Z" fill="#1D2B39"/> </svg>`;
  const svgThunder=`<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.3759 41.4976C26.2758 43.2277 25.6028 45.3598 23.8727 46.2597C22.1425 47.1597 20.0104 46.4867 19.1105 44.7565C18.2106 43.0264 16.6265 33.6103 16.1327 31.3795C17.6757 33.0645 24.4759 39.7675 25.3759 41.4976Z" fill="#4BAACA"/> <path d="M33.6526 48.0649C34.1364 48.995 33.7746 50.1411 32.8446 50.6248C31.9145 51.1086 30.7684 50.7468 30.2847 49.8168C29.8009 48.8867 28.9494 43.8251 28.684 42.6259C29.5134 43.5317 33.1689 47.1349 33.6526 48.0649Z" fill="#4BAACA"/> <path d="M42.3236 40.1398C42.9377 41.3202 42.4785 42.775 41.298 43.389C40.1176 44.003 38.6629 43.5438 38.0488 42.3633C37.4348 41.1829 36.354 34.7584 36.0171 33.2363C37.0699 34.386 41.7096 38.9593 42.3236 40.1398Z" fill="#4BAACA"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M20 0.75C29.8397 0.75 38.0196 7.8558 39.6885 17.2158C40.7406 16.9143 41.851 16.75 43 16.75C49.6274 16.75 55 22.1226 55 28.75C55 35.3774 49.6274 40.75 43 40.75H20C8.9543 40.75 0 31.7957 0 20.75C0 9.7043 8.9543 0.75 20 0.75ZM20 3.75C10.6112 3.75 3 11.3612 3 20.75C3 30.1388 10.6112 37.75 20 37.75H43C47.9706 37.75 52 33.7206 52 28.75C52 23.7794 47.9706 19.75 43 19.75C42.1386 19.75 41.3058 19.8729 40.5146 20.0996L37.3184 21.0156L36.7354 17.7422C35.317 9.78821 28.3605 3.75 20 3.75Z" fill="#1D2B39"/> <path d="M31.5 40.75L42.5 42.75L20 22.75L31 37.25L21 34.75L42 54.25L31.5 40.75Z" fill="#FDB022"/> </svg>`;
  if(lateP===0&&prog>=50)return{svg:svgSun,   label:'Serein',  desc:'Tout roule'};
  if(lateP===0)          return{svg:svgCloud,  label:'Nuageux', desc:'En progression'};
  if(lateP<=1)           return{svg:svgRain,   label:'Couvert', desc:lateP+' retard'};
  return                        {svg:svgThunder,label:'Alerte',  desc:lateP+' retards'};
}

// ─── STATE ───────────────────────────────────────────────────────────────
let state={view:'global',projId:null,tab:'steps',taskId:null,accordionOpen:{},dashProjFilter:'all',dashPoleFilter:'all',editingHourId:null,projTab:'general'};

// ─── AVATAR HTML ─────────────────────────────────────────────────────────
function avHTML(aid,size='av-sm'){const a=actor(aid);const p=PAL[a.color]||PAL.teal;return`<div class="avatar ${size}" style="background:${p.bg};color:${p.t}" title="${a.name}">${a.name.slice(0,2).toUpperCase()}</div>`;}

// ─── RIGHT SIDEBAR ───────────────────────────────────────────────────────
let teamExpanded = false;

function mkEl(tag,cssText=''){
  const el=document.createElement(tag);if(cssText)el.style.cssText=cssText;return el;
}
