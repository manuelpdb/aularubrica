/* AulaRúbrica · Generador IA: la clave solo se mantiene durante esta pestaña.
   La API se llama directamente desde el navegador. NO publique claves en GitHub. */
'use strict';
(() => {
  let draft = null;
  let suggestion = [];
  const bands=[{name:'1–2',points:2},{name:'3–4',points:4},{name:'5–6',points:6},{name:'7–8',points:8},{name:'9–10',points:10}];
  const state = { key:'', stage:'ESO', subject:'Tecnología y Digitalización', course:'3º ESO', task:'', criteria:'', notes:'', levels:5, busy:false, error:'' };
  const grab = () => {
    const get = id => document.getElementById(id);
    if (!get('aiTask')) return;
    state.key=get('aiKey').value.trim();
    state.stage=get('aiStage').value;state.subject=get('aiSubject').value.trim();
    state.course=get('aiCourse').value.trim();
    state.task=get('aiTask').value.trim();
    state.criteria=get('aiCriteria').value.trim();
    state.notes=get('aiNotes').value.trim();
    state.levels=Number(get('aiLevels').value);
  };
  const page = () => `<div class="grid two"><div class="card ai-panel">
    <h2>✦ Diseña tu rúbrica con IA</h2>
    <p>Introduce los criterios oficiales completos y describe qué realizará el alumnado. La IA propondrá descriptores observables para cada nivel.</p>
    <div class="field"><label for="aiStage">Etapa</label><select id="aiStage">${['Primaria','ESO','Bachillerato'].map(x=>`<option ${state.stage===x?'selected':''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label for="aiCourse">Curso</label><select id="aiCourse">${window.AulaOpciones.cursos(state.stage).map(x=>`<option ${state.course===x?'selected':''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label for="aiSubject">Materia</label><select id="aiSubject">${window.AulaOpciones.materias(state.stage,state.course).concat(window.AulaOpciones.materias(state.stage,state.course).includes(state.subject)?[]:[state.subject]).map(x=>`<option ${state.subject===x?'selected':''}>${esc(x)}</option>`).join('')}</select><span class="hint">Lista orientativa: depende de las optativas y la oferta del centro.</span></div>
    <div class="field"><label for="aiTask">Actividad o producto a evaluar</label><textarea id="aiTask" rows="4" placeholder="Ej.: Diseñar y construir una lámpara de madera con LED y presentar su memoria técnica">${esc(state.task)}</textarea></div>
    <div class="card" style="background:var(--bg, #f7f9ff)"><h3>🎯 Recomendar criterios para esta actividad</h3><p>Selecciona etapa, curso y materia. La IA elegirá entre criterios cargados. Los extraídos automáticamente requieren cotejo visual con el BOJA antes de utilizarlos para calificar.</p><div class="actions"><button class="soft" data-ai="recommend">✦ Proponer mejores criterios</button><button class="ghost" data-ai="loadCatalog">Cargar todos los criterios de la materia</button><button class="ghost" data-ai="goCatalog">📚 Importar criterios oficiales</button></div>${suggestion.length?`<div class="notice"><b>Criterios propuestos:</b><br>${suggestion.map(x=>`${esc(x.codigo)} — ${esc(x.texto)}`).join('<br>')}<div class="actions"><button class="primary" data-ai="accept">Usar estos criterios</button></div></div>`:''}</div><div class="field"><label for="aiCriteria">Criterios de evaluación (código y texto oficial; uno por línea)</label><textarea id="aiCriteria" rows="6" placeholder="2.1 — Idear y diseñar soluciones...&#10;2.2 — Seleccionar, planificar y organizar...">${esc(state.criteria)}</textarea><span class="hint">Copia aquí los criterios literalmente. La IA no debe inventar códigos ni normativa.</span></div>
    <div class="field"><label for="aiNotes">Instrucciones adicionales (opcional)</label><textarea id="aiNotes" rows="3" placeholder="Ej.: Descriptores breves, peso igual para cada criterio, nivel adaptado a diversificación...">${esc(state.notes)}</textarea></div>
    <div class="field"><label for="aiLevels">Niveles de logro</label><select id="aiLevels"><option value="4" ${state.levels===4?'selected':''}>4 niveles · 1, 4, 7, 10</option><option value="5" ${state.levels===5?'selected':''}>5 tramos · 1–2, 3–4, 5–6, 7–8, 9–10</option></select></div>
    <div class="field"><label for="aiKey">Clave API de Google Gemini (personal)</label><input id="aiKey" type="password" autocomplete="off" spellcheck="false" placeholder="Introduce tu API key" value="${esc(state.key)}"><span class="hint">Obtén una clave en <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio ↗</a>. No se guarda en la copia de seguridad ni en el repositorio; se pierde al cerrar o recargar esta pestaña. Google puede aplicar cuotas o cargos según tu configuración.</span></div>
    <div class="notice">Privacidad: envía únicamente datos de la actividad y los criterios. No incluyas nombres, calificaciones ni datos personales del alumnado. La petición se envía a Google Gemini; revisa sus condiciones y política de privacidad.</div>
    <div class="actions"><button class="primary" data-ai="generate" ${state.busy?'disabled':''}>${state.busy?'Generando…':'✦ Generar rúbrica con IA'}</button></div>
    ${state.error?`<div class="notice" role="alert">${esc(state.error)}</div>`:''}
  </div><div class="card ai-panel"><h2>Vista previa</h2>${draft?preview():`<div class="empty"><strong>Aquí aparecerá tu rúbrica</strong>La podrás revisar antes de guardarla en «Mis rúbricas». Después podrás editar niveles, pesos y descriptores.</div>`}</div></div>`;
  const preview = () => `<span class="pill">${esc(draft.subject)}</span><h3 style="margin-top:12px">${esc(draft.title)}</h3><p>${draft.criteria.length} criterios · ${draft.levels.length} niveles</p><div class="tablewrap"><table><thead><tr><th>Criterio</th>${draft.levels.map(l=>`<th>${esc(l.name)} · ${l.points}</th>`).join('')}</tr></thead><tbody>${draft.criteria.map(c=>`<tr><td><strong>${esc(c.code)}</strong><div>${esc(c.title)}</div></td>${c.descriptions.map(d=>`<td>${esc(d)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="actions"><button class="primary" data-ai="save">Guardar en Mis rúbricas</button><button class="ghost" data-ai="regenerate">Volver a generar</button></div><p class="hint">La IA puede equivocarse. Revisa los criterios y todos los descriptores antes de usar la rúbrica para evaluar.</p>`;
  function validate(response){
    if (!response || typeof response!=='object' || !Array.isArray(response.criteria) || !Array.isArray(response.levels)) throw Error('Respuesta incompleta de la IA. Vuelve a intentarlo.');
    const points=state.levels===5?[2,4,6,8,10]:[1,4,7,10];
    if(response.criteria.length<1||response.criteria.length>20)throw Error('La IA devolvió un número inválido de criterios.');
    const levels=points.map((p,i)=>({name:state.levels===5?bands[i].name:String(response.levels[i]?.name||['Inicial','En proceso','Adecuado','Excelente'][i]||'Nivel '+(i+1)).slice(0,60),points:p}));
    const criteria=response.criteria.map(c=>{
      if(typeof c.code!=='string'||typeof c.title!=='string'||!Array.isArray(c.descriptions)||c.descriptions.length!==points.length)throw Error('La IA devolvió un criterio incompleto. Vuelve a intentarlo.');
      return {id:uid(),code:c.code.trim().slice(0,60),title:c.title.trim().slice(0,500),weight:1,descriptions:c.descriptions.map(d=>String(d).trim().slice(0,1200))};
    });
    if(criteria.some(c=>!c.code||!c.title||c.descriptions.some(d=>!d)))throw Error('Hay criterios sin título o descriptores.');
    return {id:uid(),title:String(response.title||'Rúbrica creada con IA').slice(0,120),subject:`${state.subject} · ${state.course}`.slice(0,150),levels,criteria,created:Date.now()};
  }
  async function generate(){
    grab();draft=null;state.error='';
    if(!state.key||!state.task||!state.criteria||!state.subject||!state.course){state.error='Completa materia, curso, actividad, criterios y clave API.';render();return;}
    state.busy=true;render();
    try{
      const instruction=`Eres especialista en evaluación educativa. Devuelve SOLO un objeto JSON con la estructura {"title":"...","levels":[{"name":"..."}],"criteria":[{"code":"...","title":"...","descriptions":["...", "..."]}]}. Produce exactamente ${state.levels} niveles y un criterio por cada código suministrado, respetando los códigos y enunciados del usuario. No inventes criterios normativos ni combines criterios. Usa descriptores específicos, observables, progresivos, breves y distintos para la actividad. Cada array descriptions debe tener exactamente ${state.levels} textos, ordenados de nivel bajo a alto. No califiques al alumnado real. Idioma español.`;
      const request=`Materia: ${state.subject}\nCurso: ${state.course}\nActividad: ${state.task}\nCriterios oficiales: ${state.criteria}\nIndicaciones: ${state.notes||'Ninguna'}`;
      const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),45000);
      let res;
      try {res=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',{
        method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':state.key},signal:controller.signal,
        body:JSON.stringify({systemInstruction:{parts:[{text:instruction}]},contents:[{role:'user',parts:[{text:request}]}],generationConfig:{responseMimeType:'application/json',temperature:0.35,maxOutputTokens:8192}})
      });} finally {clearTimeout(timer)}
      const payload=await res.json().catch(()=>({}));
      if(!res.ok){const code=payload.error?.message||`HTTP ${res.status}`;throw Error(`Google Gemini: ${code}`)}
      const raw=payload.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';
      if(!raw)throw Error('Gemini no devolvió contenido. Revisa los criterios o vuelve a intentarlo.');
      draft=validate(JSON.parse(raw));
    }catch(e){state.error=e.name==='AbortError'?'La solicitud tardó demasiado. Inténtalo de nuevo.':String(e.message||e).slice(0,500)}
    finally{state.busy=false;render()}
  }
  document.getElementById('content').addEventListener('change',e=>{if(e.target.id==='aiStage'){grab();state.stage=e.target.value;state.course=window.AulaOpciones.cursos(state.stage)[0];state.subject=window.AulaOpciones.materias(state.stage,state.course)[0]||'';render()}else if(e.target.id==='aiCourse'){grab();state.course=e.target.value;state.subject=window.AulaOpciones.materias(state.stage,state.course)[0]||'';render()}});
  document.getElementById('content').addEventListener('click',e=>{
    const b=e.target.closest('[data-ai]');if(!b)return;
    if(b.dataset.ai==='generate'||b.dataset.ai==='regenerate')generate();
    if(b.dataset.ai==='goCatalog'){grab();switchView('catalogo')}
    if(b.dataset.ai==='loadCatalog'){grab();const arr=matching();if(!arr.length)return alert('No hay criterios importados para esta materia y curso. Ve a «Catálogo curricular».');receiveCriteria(arr);toast(`${arr.length} criterios cargados`)}
    if(b.dataset.ai==='recommend')recommend();
    if(b.dataset.ai==='accept'&&suggestion.length){receiveCriteria(suggestion);suggestion=[];render()}
    if(b.dataset.ai==='save'&&draft){db.rubrics.push(draft);const id=draft.id;draft=null;state.key='';save();switchView('rubricas');toast('Rúbrica generada guardada. Revísala y edítala antes de evaluar.');}
  });
  function courseKey(){return state.course.toLowerCase().replace(/º|°|\./g,'').replace(/\s+/g,' ').trim()}
  function matching(){return (window.AulaCatalogo?.all()||[]).filter(x=>x.materia.toLowerCase().trim()===state.subject.toLowerCase().trim()&&courseKey()===x.curso.toLowerCase().replace(/º|°|\./g,'').replace(/\s+/g,' ').trim())}
  function receiveCriteria(a){if(!a.length)return;state.criteria=a.map(x=>`${x.codigo} — ${x.texto}`).join('\n');if(a[0].materia)state.subject=a[0].materia;if(a[0].curso)state.course=a[0].curso;if(a[0].etapa)state.stage=a[0].etapa;render()}
  async function recommend(){grab();state.error='';suggestion=[];
    const arr=matching();if(!state.task.trim())state.error='Describe primero qué hará el alumnado.';
    else if(!arr.length)state.error='No se encontraron criterios importados para esta materia y curso. Impórtalos primero en «Catálogo curricular».';
    else if(!state.key)state.error='Para recomendar criterios necesitas tu clave API de Gemini.';
    if(state.error){render();return}
    state.busy=true;render();try{
      const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':state.key},body:JSON.stringify({contents:[{parts:[{text:`Tarea docente: ${state.task}\nSelecciona entre 2 y 6 criterios que verdaderamente se puedan observar al realizar esta tarea. Usa EXCLUSIVAMENTE códigos del siguiente catálogo: ${JSON.stringify(arr.map(x=>({codigo:x.codigo,texto:x.texto})))}. Devuelve solo JSON con estructura {"codigos":["2.1","3.1"]}. No inventes códigos.`}]}],generationConfig:{responseMimeType:'application/json',temperature:0.1,maxOutputTokens:1024}})});
      const data=await response.json();if(!response.ok)throw Error(data.error?.message||'Error de conexión');const obj=JSON.parse(data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'{}');const codes=Array.isArray(obj.codigos)?obj.codigos:[];suggestion=arr.filter(x=>codes.includes(x.codigo));if(!suggestion.length)throw Error('La IA no seleccionó ningún criterio válido.');
    }catch(e){state.error='No se pudieron recomendar criterios: '+e.message}finally{state.busy=false;render()}
  }
  window.AulaAI={page,receiveCriteria};
})();
