// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── MODAL ───────────────────────────────────────────────────────────────
function openModal(html){document.getElementById('modal-root').innerHTML=`<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal">${html}</div></div>`;}
function closeModal(){document.getElementById('modal-root').innerHTML='';}
function colorPicker(sel,name){return `<div class="color-picker">${COLORS.map(c=>`<div class="color-opt${c===sel?' sel':''}" style="background:${PAL[c].hex}" onclick="document.querySelectorAll('.color-opt').forEach(e=>e.classList.remove('sel'));this.classList.add('sel');document.getElementById('f-${name}').value='${c}'" title="${c}"></div>`).join('')}</div><input type="hidden" id="f-${name}" value="${sel}">`;}
function actorOpts(sel=''){return DB.actors.map(a=>`<option value="${a.id}"${a.id===sel?' selected':''}>${a.name} (${a.role})</option>`).join('');}

// ─── FORMS ───────────────────────────────────────────────────────────────
function openNewProject(){
  openModal(`<div class="modal-title">Nouveau projet</div>
    <div class="field"><label>Nom</label><input type="text" id="f-pname" placeholder="Nom du projet"></div>
    <div class="field-row">
      <div class="field"><label>Catégorie</label><select id="f-plane"><option>Pôle Industriel</option><option>Pôle Céréalier</option><option>R&D</option><option>Pop</option><option>Transversal</option><option>Gestion</option></select></div>
      <div class="field"><label>Budget (€)</label><input type="number" id="f-pbudget" value="0" min="0"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Date début</label><input type="date" id="f-pstart" value="2026-01-01"></div>
      <div class="field"><label>Date fin</label><input type="date" id="f-pend" value="2026-12-31"></div>
    </div>
    <div class="field"><label>Couleur</label>${colorPicker('purple','pcolor')}</div>
    <div class="field-row">
      <div class="field"><label>N° d'affaire</label><input id="f-pnumaffaire" placeholder="ex: 802653"></div>
      <div class="field"><label>Code GTA</label><input id="f-pgta" placeholder="ex: 50 / M1 / 102"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Responsable projet</label><input id="f-presponsable" placeholder="Nom du responsable"></div>
      <div class="field"><label>Automaticien / Développeur</label><input id="f-pautomaticien" placeholder="Nom"></div>
    </div>
    <div class="field"><label>Note</label><textarea id="f-pnote" placeholder="Description..."></textarea></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveNewProject()">Créer</button></div>`);
}
function saveNewProject(){
  const name=document.getElementById('f-pname').value.trim();if(!name)return;
  const newLane=document.getElementById('f-plane').value;
  DB.projects.push({id:uid(),name,lane:newLane,color:document.getElementById('f-pcolor').value,
    pole:derivePole(newLane),
    budget:parseFloat(document.getElementById('f-pbudget').value)||0,
    startDate:document.getElementById('f-pstart').value,endDate:document.getElementById('f-pend').value,
    numAffaire:document.getElementById('f-pnumaffaire').value,
    gta:document.getElementById('f-pgta').value,
    responsable:document.getElementById('f-presponsable').value,
    automaticien:document.getElementById('f-pautomaticien').value,
    note:document.getElementById('f-pnote').value,actors:[],steps:[],docs:[],crs:[]});
  saveDB();closeModal();render();
}
function openEditProject(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  openModal(`<div class="modal-title">Modifier ${proj.name}</div>
    <div class="field"><label>Nom</label><input type="text" id="f-pname" value="${proj.name}"></div>
    <div class="field-row">
      <div class="field"><label>Catégorie</label><select id="f-plane"><option value="Pôle Industriel"${proj.lane==='Pôle Industriel'?' selected':''}>Pôle Industriel</option><option value="Pôle Céréalier"${proj.lane==='Pôle Céréalier'?' selected':''}>Pôle Céréalier</option><option value="R&D"${proj.lane==='R&D'?' selected':''}>R&D</option><option value="Pop"${proj.lane==='Pop'?' selected':''}>Pop</option><option value="Transversal"${proj.lane==='Transversal'?' selected':''}>Transversal</option><option value="Gestion"${proj.lane==='Gestion'?' selected':''}>Gestion</option></select></div>
      <div class="field"><label>Budget (€)</label><input type="number" id="f-pbudget" value="${proj.budget||0}" min="0"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Date début</label><input type="date" id="f-pstart" value="${proj.startDate}"></div>
      <div class="field"><label>Date fin</label><input type="date" id="f-pend" value="${proj.endDate}"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="field"><label>N° d'affaire</label><input id="f-pnumaffaire" value="${proj.numAffaire||''}" placeholder="ex: 802653"></div>
      <div class="field"><label>Code GTA</label><input id="f-pgta" value="${proj.gta||''}" placeholder="ex: 50 / M1 / 102"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="field"><label>Responsable projet</label><input id="f-presponsable" value="${proj.responsable||''}" placeholder="Nom du responsable"></div>
      <div class="field"><label>Automaticien / Développeur</label><input id="f-pautomaticien" value="${proj.automaticien||''}" placeholder="Nom"></div>
    </div>
    <div class="field"><label>Couleur</label>${colorPicker(proj.color,'pcolor')}</div>
    <div class="field"><label>Note</label><textarea id="f-pnote">${proj.note||''}</textarea></div>
    <div class="modal-actions"><button class="btn danger" onclick="deleteProject('${projId}')">Supprimer</button><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveEditProject('${projId}')">Enregistrer</button></div>`);
}
function saveEditProject(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  proj.name=document.getElementById('f-pname').value.trim()||proj.name;proj.lane=document.getElementById('f-plane').value;
  proj.color=document.getElementById('f-pcolor').value;proj.budget=parseFloat(document.getElementById('f-pbudget').value)||0;
  proj.startDate=document.getElementById('f-pstart').value;proj.endDate=document.getElementById('f-pend').value;
  proj.note=document.getElementById('f-pnote').value;
  proj.pole=derivePole(proj.lane);
  proj.numAffaire=document.getElementById('f-pnumaffaire')?document.getElementById('f-pnumaffaire').value:proj.numAffaire;
  proj.gta=document.getElementById('f-pgta')?document.getElementById('f-pgta').value:proj.gta;
  proj.responsable=document.getElementById('f-presponsable')?document.getElementById('f-presponsable').value:proj.responsable;
  proj.automaticien=document.getElementById('f-pautomaticien')?document.getElementById('f-pautomaticien').value:proj.automaticien;
  saveDB();closeModal();render();
}
function deleteProject(projId){
  if(!confirm('Supprimer ce projet ?'))return;DB.projects=DB.projects.filter(p=>p.id!==projId);
  state.view='global';state.projId=null;saveDB();closeModal();render();
}

function openNewStep(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const phOpts=['PROPOSITION','OBSERVATION','ANALYSE','RESTITUTION','PROTOTYPE','TEST','SUIVI_DEV','MEETING','GESTION'].map(ph=>`<option value="${ph}">${PHASES[ph].label}</option>`).join('');
  openModal(`<div class="modal-title">Nouvelle tâche — ${proj.name}</div>
    <div class="field"><label>Nom</label><input type="text" id="f-sname" placeholder="ex: Wireframe"></div>
    <div class="field-row">
      <div class="field"><label>Phase</label><select id="f-sphase">${phOpts}</select></div>
      <div class="field"><label>Assigné à</label><select id="f-sassign"><option value="">—</option>${actorOpts()}</select></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Date début</label><input type="date" id="f-sstart" value="${proj.startDate}"></div>
      <div class="field"><label>Date fin</label><input type="date" id="f-send" value="${proj.endDate}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Coût (€)</label><input type="number" id="f-scost" value="0" min="0"></div>
      <div class="field"><label>Priorité</label><select id="f-sprio"><option value="high">Haute</option><option value="normal" selected>Normale</option><option value="low">Basse</option></select></div>
    </div>
    <div class="field"><label>Couleur</label>${colorPicker('teal','scolor')}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveNewStep('${projId}')">Ajouter</button></div>`);
}
function saveNewStep(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const name=document.getElementById('f-sname').value.trim();if(!name)return;
  const assignee=document.getElementById('f-sassign').value;
  proj.steps.push({id:'s'+uid(),phase:document.getElementById('f-sphase').value,name,
    color:document.getElementById('f-scolor').value,
    startDate:document.getElementById('f-sstart').value,endDate:document.getElementById('f-send').value,
    assignee,cost:parseFloat(document.getElementById('f-scost').value)||0,
    priority:document.getElementById('f-sprio').value,done:false,comments:[]});
  if(assignee&&!proj.actors.includes(assignee))proj.actors.push(assignee);
  saveDB();closeModal();render();
}
function openNewMeeting(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  openModal(`<div class="modal-title">Nouvelle réunion — ${proj.name}</div>
    <div class="field"><label>Titre</label><input type="text" id="f-sname" placeholder="ex: Point hebdo"></div>
    <div class="field-row">
      <div class="field"><label>Date</label><input type="date" id="f-sstart" value="${TODAY_STR}"></div>
      <div class="field"><label>Assigné à</label><select id="f-sassign"><option value="">—</option>${actorOpts()}</select></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Heure début</label><input type="time" id="f-stime-start" value="09:00"></div>
      <div class="field"><label>Heure fin</label><input type="time" id="f-stime-end" value="10:00"></div>
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveMeeting('${projId}')">Ajouter</button></div>`);
}
function saveMeeting(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const name=document.getElementById('f-sname').value.trim();if(!name)return;
  const d=document.getElementById('f-sstart').value;const assignee=document.getElementById('f-sassign').value;
  const timeStart=document.getElementById('f-stime-start').value;
  const timeEnd=document.getElementById('f-stime-end').value;
  proj.steps.push({id:'s'+uid(),phase:'MEETING',name,color:'amber',startDate:d,endDate:d,timeStart,timeEnd,assignee,cost:0,priority:'normal',done:false,comments:[]});
  if(assignee&&!proj.actors.includes(assignee))proj.actors.push(assignee);
  saveDB();closeModal();render();
}
function openEditStep(projId,stepId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const step=proj.steps.find(s=>s.id===stepId);if(!step)return;
  const phOpts=['PROPOSITION','OBSERVATION','ANALYSE','RESTITUTION','PROTOTYPE','TEST','SUIVI_DEV','MEETING','GESTION'].map(ph=>`<option value="${ph}"${step.phase===ph?' selected':''}>${(PHASES[ph]||{label:ph}).label}</option>`).join('');
  openModal(`<div class="modal-title">Modifier : ${step.name}</div>
    <div class="field"><label>Nom</label><input type="text" id="f-sname" value="${step.name}"></div>
    <div class="field-row">
      <div class="field"><label>Phase</label><select id="f-sphase">${phOpts}</select></div>
      <div class="field"><label>Assigné à</label><select id="f-sassign"><option value="">—</option>${actorOpts(step.assignee)}</select></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Date début</label><input type="date" id="f-sstart" value="${step.startDate}"></div>
      <div class="field"><label>Date fin</label><input type="date" id="f-send" value="${step.endDate}"></div>
    </div>
    ${step.phase==='MEETING'?`<div class="field-row">
      <div class="field"><label>Heure début</label><input type="time" id="f-stime-start" value="${step.timeStart||'09:00'}"></div>
      <div class="field"><label>Heure fin</label><input type="time" id="f-stime-end" value="${step.timeEnd||'10:00'}"></div>
    </div>`:''}
    <div class="field-row">
      <div class="field"><label>Coût (€)</label><input type="number" id="f-scost" value="${step.cost||0}" min="0"></div>
      <div class="field"><label>Priorité</label><select id="f-sprio"><option value="high"${step.priority==='high'?' selected':''}>Haute</option><option value="normal"${(step.priority||'normal')==='normal'?' selected':''}>Normale</option><option value="low"${step.priority==='low'?' selected':''}>Basse</option></select></div>
    </div>
    <div class="field"><label>Statut</label><select id="f-sdone"><option value="0"${!step.done?' selected':''}>En cours</option><option value="1"${step.done?' selected':''}>Terminé</option></select></div>
    <div class="field"><label>Couleur</label>${colorPicker(step.color,'scolor')}</div>
    <div class="modal-actions">
      <button class="btn danger" onclick="deleteStep('${projId}','${stepId}')">Supprimer</button>
      <button class="btn" onclick="closeModal()">Annuler</button>
      <button class="btn primary" onclick="saveEditStep('${projId}','${stepId}')">Enregistrer</button>
    </div>`);
}
function saveEditStep(projId,stepId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const step=proj.steps.find(s=>s.id===stepId);if(!step)return;
  const wasDone=step.done;
  step.name=document.getElementById('f-sname').value.trim()||step.name;step.phase=document.getElementById('f-sphase').value;
  step.color=document.getElementById('f-scolor').value;step.startDate=document.getElementById('f-sstart').value;
  step.endDate=document.getElementById('f-send').value;step.assignee=document.getElementById('f-sassign').value;
  step.cost=parseFloat(document.getElementById('f-scost').value)||0;step.priority=document.getElementById('f-sprio').value;
  step.done=document.getElementById('f-sdone').value==='1';
  const timeStartEl=document.getElementById('f-stime-start');
  const timeEndEl=document.getElementById('f-stime-end');
  if(timeStartEl&&timeEndEl){
    step.timeStart=timeStartEl.value;step.timeEnd=timeEndEl.value;
  }
  // Marquer terminé → enregistre la date réelle de fin
  if(step.done&&!wasDone){
    step.realEndDate=TODAY_STR;
  } else if(!step.done){
    delete step.realEndDate;
  }
  // Réunion qui passe à "Terminé" → crée automatiquement une saisie d'heures à partir de l'horaire
  if(step.phase==='MEETING'&&step.done&&!wasDone&&step.timeStart&&step.timeEnd&&step.assignee){
    const alreadyLogged=(DB.hours||[]).some(h=>h.taskId===step.id&&h.autoFromMeeting);
    if(!alreadyLogged){
      const [h1,m1]=step.timeStart.split(':').map(Number);
      const [h2,m2]=step.timeEnd.split(':').map(Number);
      const dur=Math.max(0.25,Math.round(((h2*60+m2)-(h1*60+m1))/60*4)/4);
      if(!DB.hours)DB.hours=[];
      DB.hours.push({id:'h'+uid(),actor:step.assignee,projId:proj.id,taskId:step.id,taskName:step.name,dur,date:step.endDate,note:'Réunion '+step.timeStart+'-'+step.timeEnd,autoFromMeeting:true});
      showToast("✅ Réunion terminée — "+dur+"h ajoutées automatiquement à la feuille d'heures");
    }
  }
  if(step.assignee&&!proj.actors.includes(step.assignee))proj.actors.push(step.assignee);
  saveDB();closeModal();render();
}
function deleteStep(projId,stepId){
  if(!confirm('Supprimer cette tâche ?'))return;const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  proj.steps=proj.steps.filter(s=>s.id!==stepId);saveDB();closeModal();render();
}

function openNewCR(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const attOpts=DB.actors.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
  openModal(`<div class="modal-title">Nouveau CR — ${proj.name}</div>
    <div class="field"><label>Titre</label><input type="text" id="f-crtitle" placeholder="ex: Réunion phase UI"></div>
    <div class="field"><label>Date</label><input type="date" id="f-crdate" value="${TODAY_STR}"></div>
    <div class="field"><label>Participants</label><select id="f-cratt" multiple style="height:64px">${attOpts}</select></div>
    <div class="field"><label>Contenu / actions</label><textarea id="f-crcontent" placeholder="Notes, décisions, actions..."></textarea></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveCR('${projId}')">Enregistrer</button></div>`);
}
function saveCR(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const title=document.getElementById('f-crtitle').value.trim();if(!title)return;
  const sel=document.getElementById('f-cratt');const attendees=[...sel.selectedOptions].map(o=>o.value);
  if(!proj.crs)proj.crs=[];
  proj.crs.push({id:'cr'+uid(),title,date:document.getElementById('f-crdate').value,attendees,content:document.getElementById('f-crcontent').value});
  saveDB();closeModal();render();
}
function openEditCR(projId,crId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const cr=(proj.crs||[]).find(c=>c.id===crId);if(!cr)return;
  const attOpts=DB.actors.map(a=>`<option value="${a.id}"${(cr.attendees||[]).includes(a.id)?' selected':''}>${a.name}</option>`).join('');
  openModal(`<div class="modal-title">Modifier CR</div>
    <div class="field"><label>Titre</label><input type="text" id="f-crtitle" value="${cr.title}"></div>
    <div class="field"><label>Date</label><input type="date" id="f-crdate" value="${cr.date}"></div>
    <div class="field"><label>Participants</label><select id="f-cratt" multiple style="height:64px">${attOpts}</select></div>
    <div class="field"><label>Contenu</label><textarea id="f-crcontent">${cr.content||''}</textarea></div>
    <div class="modal-actions">
      <button class="btn danger" onclick="deleteCR('${projId}','${crId}')">Supprimer</button>
      <button class="btn" onclick="closeModal()">Annuler</button>
      <button class="btn primary" onclick="saveEditCR('${projId}','${crId}')">Enregistrer</button>
    </div>`);
}
function saveEditCR(projId,crId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const cr=(proj.crs||[]).find(c=>c.id===crId);if(!cr)return;
  cr.title=document.getElementById('f-crtitle').value.trim()||cr.title;cr.date=document.getElementById('f-crdate').value;
  const sel=document.getElementById('f-cratt');cr.attendees=[...sel.selectedOptions].map(o=>o.value);
  cr.content=document.getElementById('f-crcontent').value;saveDB();closeModal();render();
}
function deleteCR(projId,crId){
  if(!confirm('Supprimer ce CR ?'))return;const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  proj.crs=(proj.crs||[]).filter(c=>c.id!==crId);saveDB();closeModal();render();
}

function openNewDoc(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  openModal(`<div class="modal-title">Nouveau document — ${proj.name}</div>
    <div class="field"><label>Nom</label><input type="text" id="f-dname" placeholder="ex: Cahier des charges"></div>
    <div class="field"><label>Lien URL</label><input type="text" id="f-durl" placeholder="https://..."></div>
    <div class="field"><label>Type</label><select id="f-dtype"><option value="link">Lien</option><option value="pdf">PDF</option><option value="figma">Figma</option><option value="sheet">Tableur</option><option value="word">Word</option></select></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveDoc('${projId}')">Ajouter</button></div>`);
}
function saveDoc(projId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  const name=document.getElementById('f-dname').value.trim();if(!name)return;
  if(!proj.docs)proj.docs=[];
  proj.docs.push({id:'d'+uid(),name,url:document.getElementById('f-durl').value,type:document.getElementById('f-dtype').value});
  saveDB();closeModal();render();
}
function deleteDoc(projId,docId){
  const proj=DB.projects.find(p=>p.id===projId);if(!proj)return;
  proj.docs=(proj.docs||[]).filter(d=>d.id!==docId);saveDB();render();
}

function openNewActor(){
  openModal(`<div class="modal-title">Nouvel acteur</div>
    <div class="field"><label>Nom</label><input type="text" id="f-aname" placeholder="Prénom"></div>
    <div class="field"><label>Rôle</label><select id="f-arole">${ROLES.map(r=>`<option>${r}</option>`).join('')}</select></div>
    <div class="field"><label>Couleur</label>${colorPicker('teal','acolor')}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Annuler</button><button class="btn primary" onclick="saveNewActor()">Ajouter</button></div>`);
}
function saveNewActor(){
  const name=document.getElementById('f-aname').value.trim();if(!name)return;
  DB.actors.push({id:uid(),name,role:document.getElementById('f-arole').value,color:document.getElementById('f-acolor').value});
  saveDB();closeModal();render();
}
