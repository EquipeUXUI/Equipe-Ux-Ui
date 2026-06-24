// Généré par découpe automatique depuis index.html — Équipe UX UI

// ─── IMPORT EXCEL ────────────────────────────────────────────────────────
function importExcel(input) {
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const wb = XLSX.read(e.target.result, {type:'binary', cellDates:true});

      // ── Acteurs ──────────────────────────────────────────────────────
      if(wb.SheetNames.includes('Acteurs')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['Acteurs']);
        if(rows.length) {
          DB.actors = rows.map(r => ({
            id:     String(r['ID']||r['id']||uid()),
            name:   String(r['Nom']||r['name']||''),
            role:   String(r['Rôle']||r['role']||''),
            color:  String(r['Couleur']||r['color']||'teal'),
          })).filter(a => a.name);
        }
      }

      // ── Projets ──────────────────────────────────────────────────────
      if(wb.SheetNames.includes('Projets')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['Projets']);
        const existingById = {};
        DB.projects.forEach(p => existingById[p.id] = p);
        DB.projects = rows.map(r => {
          const id = String(r['ID']||r['id']||uid());
          const existing = existingById[id] || {};
          return {
            id,
            name:      String(r['Nom projet']||r['name']||''),
            lane:      String(r['Lane']||r['lane']||'Innovation'),
            color:     String(r['Couleur']||r['color']||'purple'),
            pole:      String(r['Pôle']||r['pole']||''),
            budget:    parseFloat(r['Budget (€)']||r['budget']||0)||0,
            startDate: fmtExcelDate(r['Date début']||r['startDate']),
            endDate:   fmtExcelDate(r['Date fin']||r['endDate']),
            note:      String(r['Note']||r['note']||''),
            actors:    String(r['Acteurs']||'').split(',').map(s=>s.trim()).filter(Boolean),
            steps:     existing.steps  || [],
            docs:      existing.docs   || [],
            crs:       existing.crs    || [],
          };
        }).filter(p => p.name);
      }

      // ── Taches ───────────────────────────────────────────────────────
      if(wb.SheetNames.includes('Taches')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['Taches']);
        // Reset steps on all projects then re-fill
        DB.projects.forEach(p => p.steps = []);
        rows.forEach(r => {
          const projId = String(r['ID Projet']||r['projId']||'');
          const proj = DB.projects.find(p => p.id === projId);
          if(!proj) return;
          if(!proj.steps) proj.steps = [];
          proj.steps.push({
            id:        String(r['ID Tâche']||r['id']||'s'+uid()),
            phase:     String(r['Phase']||r['phase']||'OBSERVATION'),
            name:      String(r['Nom tâche']||r['name']||''),
            color:     String(r['Couleur']||({PROPOSITION:'coral',OBSERVATION:'blue',ANALYSE:'purple',RESTITUTION:'teal',PROTOTYPE:'pink',TEST:'green',SUIVI_DEV:'blue',MEETING:'amber',GESTION:'green'})[r['Phase']]||'teal'),
            startDate: fmtExcelDate(r['Date début']||r['startDate']),
            endDate:   fmtExcelDate(r['Date fin']||r['endDate']),
            assignee:  String(r['Assigné à']||r['assignee']||''),
            cost:      parseFloat(r['Coût (€)']||r['cost']||0)||0,
            priority:  String(r['Priorité']||r['priority']||'normal'),
            done:      String(r['Statut']||r['status']||'').toLowerCase().includes('termin'),
            comments:  [],
          });
        });
      }

      // ── CR ───────────────────────────────────────────────────────────
      if(wb.SheetNames.includes('CR')) {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets['CR']);
        DB.projects.forEach(p => p.crs = []);
        rows.forEach(r => {
          const projId = String(r['ID Projet']||'');
          const proj = DB.projects.find(p => p.id === projId);
          if(!proj) return;
          if(!proj.crs) proj.crs = [];
          proj.crs.push({
            id:         String(r['ID CR']||'cr'+uid()),
            title:      String(r['Titre']||''),
            date:       fmtExcelDate(r['Date']||r['date']),
            attendees:  String(r['Participants']||'').split(',').map(s=>s.trim()).filter(Boolean),
            content:    String(r['Contenu / Actions']||r['content']||''),
          });
        });
      }

      saveDB();
      // Show year from filename
      const year = file.name.match(/\d{4}/)?.[0] || '';
      if(year) document.title = `Équipe UX UI — ${year}`;
      showToast(`✅ Importé : ${file.name} — ${DB.projects.length} projets, ${DB.actors.length} acteurs`);
      render();
    } catch(err) {
      showToast('❌ Erreur import : ' + err.message, true);
      console.error(err);
    }
    input.value = '';
  };
  reader.readAsBinaryString(file);
}

function fmtExcelDate(val) {
  if(!val) return '';
  if(val instanceof Date) return val.toISOString().slice(0,10);
  if(typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) return val.slice(0,10);
  if(typeof val === 'number') {
    // Excel serial date
    const d = new Date((val - 25569) * 86400 * 1000);
    return d.toISOString().slice(0,10);
  }
  return String(val).slice(0,10);
}

// ─── EXPORT EXCEL ────────────────────────────────────────────────────────
function exportExcel() {
  const wb = XLSX.utils.book_new();

  // ── Acteurs ──────────────────────────────────────────────────────────
  const acteurs = DB.actors.map(a => ({
    'ID': a.id, 'Nom': a.name, 'Rôle': a.role, 'Couleur': a.color, 'Email': '', 'Note': ''
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(acteurs), 'Acteurs');

  // ── Projets ──────────────────────────────────────────────────────────
  const projets = DB.projects.map(p => ({
    'ID': p.id, 'Nom projet': p.name, 'Lane': p.lane, 'Couleur': p.color,
    'Pôle': p.pole||'', 'Date début': p.startDate, 'Date fin': p.endDate,
    'Budget (€)': p.budget||'', 'Acteurs': (p.actors||[]).join(', '),
    'N° dossier': '', 'Statut': projProg(p)===100?'Livré':'En cours', 'Note': p.note||'', 'Tags': ''
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projets), 'Projets');

  // ── Taches ───────────────────────────────────────────────────────────
  const taches = DB.projects.flatMap(p =>
    (p.steps||[]).map(s => ({
      'ID Tâche': s.id, 'ID Projet': p.id, 'Nom projet': p.name,
      'Phase': s.phase, 'Nom tâche': s.name, 'Assigné à': s.assignee||'',
      'Date début': s.startDate, 'Date fin': s.endDate,
      'Coût (€)': s.cost||'', 'Priorité': s.priority||'normal',
      'Statut': s.done ? 'Terminé' : isLate(s) ? 'En retard' : 'En cours',
      'Livrable': '', 'Validation': s.done?'Validé':'', 'Commentaire': (s.comments||[]).map(c=>c.author+': '+c.text).join(' | ')
    }))
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(taches.length ? taches : [{}]), 'Taches');

  // ── CR ───────────────────────────────────────────────────────────────
  const crs = DB.projects.flatMap(p =>
    (p.crs||[]).map(cr => ({
      'ID CR': cr.id, 'ID Projet': p.id, 'Nom projet': p.name,
      'Date': cr.date, 'Titre': cr.title,
      'Participants': (cr.attendees||[]).join(', '),
      'Contenu / Actions': cr.content||'', 'Statut': 'Clôturé'
    }))
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(crs.length ? crs : [{}]), 'CR');

  // ── Download ─────────────────────────────────────────────────────────
  const year = new Date().getFullYear();
  XLSX.writeFile(wb, `${year}_Projet.xlsx`);
  showToast(`💾 Exporté : ${year}_Projet.xlsx`);
}


// ─── IMPORT DEPUIS EXCEL DE TEMPS OVALT ──────────────────────────────────
function importFromTimeExcel(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const wb=XLSX.read(e.target.result,{type:'binary',cellDates:true});
      let imported=0;

      // Pôle par nom de feuille
      function guessPole(name){
        const n=name.toLowerCase();
        if(n.includes('yoplait')||n.includes('bridor')||n.includes('céréalier')||n.includes('cerealier')) return 'Céréalier';
        if(n.includes('industriel')||n.includes('indus')||n.includes('hutchinson')||n.includes('rakari')||n.includes('indusia')||n.includes('royal canin')||n.includes('cfia')||n.includes('bess')||n.includes('unither')||n.includes('puig')) return 'Industriel';
        return 'Transversal';
      }

      // Phase → catégorie outil
      function guessPhase(col){
        const c=(col||'').toLowerCase();
        if(c.includes('proposition')||c.includes('commercial')) return 'PROPOSITION';
        if(c.includes('observ')) return 'OBSERVATION';
        if(c.includes('analys')) return 'ANALYSE';
        if(c.includes('restit')) return 'RESTITUTION';
        if(c.includes('prototyp')||c.includes('maquette')||c.includes('wireframe')||c.includes('ui')) return 'PROTOTYPE';
        if(c.includes('test')||c.includes('valid')||c.includes('atelier')) return 'TEST';
        if(c.includes('suivi')||c.includes('dev')) return 'SUIVI_DEV';
        if(c.includes('réunion')||c.includes('reunion')) return 'MEETING';
        if(c.includes('gestion')||c.includes('veille')) return 'GESTION';
        return 'OBSERVATION';
      }

      function fmtDt(val){
        if(!val) return '';
        if(val instanceof Date){
          // Skip placeholder dates (2100)
          if(val.getFullYear()>=2100) return '';
          return val.toISOString().slice(0,10);
        }
        return '';
      }

      // Convertit une date Excel quel que soit son format texte (YYYY-MM-DD ou M/D/YY) vers YYYY-MM-DD
      // Ignore les placeholders "non renseigné" (1/1/00, 2100, etc.) et les dates invalides (ex: 31/06)
      function parseExcelDateStr(s){
        if(!s) return '';
        s=String(s).trim();
        if(/^\d{4}-\d{2}-\d{2}/.test(s)){
          const y=parseInt(s.slice(0,4),10);
          if(y<2015||y>=2099) return '';
          return s.slice(0,10);
        }
        const m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        if(m){
          let [,p1,p2,year]=m;
          if(year.length===2) year='20'+year;
          let month=p1,day=p2;
          // Si le premier nombre dépasse 12, c'est probablement un format J/M/AAAA -> on inverse
          if(parseInt(month,10)>12&&parseInt(day,10)<=12){[month,day]=[day,month];}
          month=month.padStart(2,'0');day=day.padStart(2,'0');
          const daysInMonth={'01':31,'02':29,'03':31,'04':30,'05':31,'06':30,'07':31,'08':31,'09':30,'10':31,'11':30,'12':31};
          if(parseInt(day,10)>(daysInMonth[month]||31)) return ''; // date invalide (ex: 31/06)
          const y=parseInt(year,10);
          if(y<2015||y>=2099) return ''; // placeholder "non renseigné"
          return year+'-'+month+'-'+day;
        }
        return '';
      }

      function tdToHours(val){
        if(!val) return 0;
        if(typeof val==='object'&&val.constructor&&val.constructor.name==='Decimal'){
          return Math.round(val*24*100)/100;
        }
        // timedelta stored as fraction of day in openpyxl, but here XLSX gives seconds
        if(typeof val==='number') return Math.round(val*24*10)/10;
        return 0;
      }

      wb.SheetNames.forEach(sheetName=>{
        const ws=wb.Sheets[sheetName];
        if(!ws) return;
        const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:null,raw:false,dateNF:'yyyy-mm-dd'});
        if(!rows||rows.length<4) return;

        // Find n° affaire AND Code GTA (peuvent être sur les mêmes lignes, colonnes différentes)
        let numAffaire='';
        let gta='';
        for(let r=0;r<6;r++){
          const row=rows[r]||[];
          for(let c=0;c<row.length;c++){
            const v=String(row[c]||'').trim();
            if(!numAffaire&&(v.match(/^n[°o]\s*\d+/i))) numAffaire=v;
            // Code GTA format "50 > M1 > 102" ou similaire
            if(!gta&&v.match(/^\d+\s*>\s*\S+\s*>\s*\S+/)) gta=v;
          }
        }

        // Find "Cat." row to get phase column headers
        let catRowIdx=-1;
        let phaseStartCol=3; // usually col D (index 3)
        for(let r=0;r<10;r++){
          const row=rows[r]||[];
          if(row.some(v=>String(v||'').includes('Cat.'))){
            catRowIdx=r; break;
          }
        }
        if(catRowIdx===-1) return;

        const catRow=rows[catRowIdx]||[];
        // Phase headers start at col 3
        const phases=[];
        for(let c=3;c<catRow.length;c++){
          const v=String(catRow[c]||'').trim();
          if(v&&v!=='RESTANT'&&v!=='TOTAL') phases.push({col:c,name:v,phase:guessPhase(v)});
        }
        if(!phases.length) return;

        // Find DEBUT and FIN rows
        let debutRow=null,finRow=null;
        for(let r=catRowIdx;r<Math.min(catRowIdx+8,rows.length);r++){
          const row=rows[r]||[];
          if(String(row[2]||'').trim()==='DEBUT') debutRow=row;
          if(String(row[2]||'').trim()==='FIN') finRow=row;
        }

        // Find livré status
        let isLivree=false;
        for(let r=0;r<5;r++){
          const row=rows[r]||[];
          if(row.some(v=>String(v||'').toLowerCase().includes('livr'))) { isLivree=true; break; }
        }

        // Determine project start/end
        let projStart='',projEnd='';
        phases.forEach(ph=>{
          const ds=debutRow?String(debutRow[ph.col]||''):'';
          const df=finRow?String(finRow[ph.col]||''):'';
          const startD=parseExcelDateStr(ds);
          const endD=parseExcelDateStr(df);
          if(startD&&startD.slice(0,4)<'2099'){
            if(!projStart||startD<projStart) projStart=startD;
          }
          if(endD&&endD.slice(0,4)<'2099'){
            if(!projEnd||endD>projEnd) projEnd=endD;
          }
        });
        if(!projStart) projStart=new Date().getFullYear()+'-01-01';
        if(!projEnd||projEnd.slice(0,4)>='2099') projEnd=new Date().getFullYear()+'-12-31';

        // Assign pole + lane
        const pole=guessPole(sheetName);
        const lane=pole==='Céréalier'?'Pôle Céréalier':pole==='Industriel'?'Pôle Industriel':'Transversal';
        const color=pole==='Céréalier'?'amber':pole==='Industriel'?'purple':'teal';

        // Build steps
        const steps=[];
        phases.forEach((ph,i)=>{
          const ds=debutRow?String(debutRow[ph.col]||''):'';
          const df=finRow?String(finRow[ph.col]||''):'';
          const parsedStart=parseExcelDateStr(ds);
          const startD=parsedStart||projStart;
          const parsedEnd=parseExcelDateStr(df);
          const endD=(parsedEnd&&parsedEnd.slice(0,4)<'2099')?parsedEnd:projEnd;
          const phColor=(PHASES[ph.phase]&&PHASES[ph.phase].color)||'teal';
          steps.push({
            id:'s'+uid(),phase:ph.phase,name:ph.name,color:phColor,
            startDate:startD,endDate:endD,
            assignee:'',cost:0,priority:'normal',done:isLivree,comments:[]
          });
        });

        // Check if project already exists
        const existing=DB.projects.find(p=>p.name.toLowerCase()===sheetName.toLowerCase().trim());
        if(existing){
          // Update dates and steps if empty
          if(!existing.steps.length) existing.steps=steps;
          if(numAffaire&&!existing.numAffaire) existing.numAffaire=numAffaire;
          if(gta&&!existing.gta) existing.gta=gta;
          existing.pole=existing.pole||pole;
        } else {
          DB.projects.push({
            id:uid(),name:sheetName.trim(),lane,color,pole,
            budget:0,startDate:projStart,endDate:projEnd,
            numAffaire,gta,responsable:'',automaticien:'',
            note:'',actors:[],
            steps,docs:[],crs:[]
          });
          imported++;
        }
      });

      saveDB();
      showToast('✅ Importé depuis Excel de temps — '+imported+' nouveaux projets, '+(wb.SheetNames.length-imported)+' mis à jour');
      input.value='';
      render();
    }catch(err){
      showToast('❌ Erreur import : '+err.message,true);
      console.error(err);
      input.value='';
    }
  };
  reader.readAsBinaryString(file);
}
