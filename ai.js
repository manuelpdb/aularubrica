/* AulaRúbrica · Generador IA: la clave solo se mantiene durante esta pestaña.
   La API se llama directamente desde el navegador. NO publique claves en GitHub. */
'use strict';
(() => {
  let draft = null;
  const state = { key:'', subject:'Tecnología y Digitalización', course:'3º ESO', task:'', criteria:'', notes:'', levels:4, busy:false, error:'' };
  const grab = () => {
    const get = id => document.getElementById(id);
    if (!get('aiTask')) return;
    state.key=get('aiKey').value.trim();
    state.subject=get('aiSubject').value.trim();
    state.course=get('aiCourse').value.trim();
    state.task=get('aiTask').value.trim();
    state.criteria=get('aiCriteria').value.trim();
    state.notes=get('aiNotes').value.trim();
    state.levels=Number(get('aiLevels').value);
  };
  const page = () => `<div class="grid two"><div class="card ai-panel">
    <h2>✦ Diseña tu rúbrica con IA</h2>
    <p>Introduce los criterios oficiales completos y describe qué realizará el alumnado. La IA propondrá descriptores observables para cada nivel.</p>
    <div class="field"><label for="aiSubject">Materia</label><input id="aiSubject" value="${esc(state.subject)}"></div>
    <div class="field"><label for="aiCourse">Curso</label><input id="aiCourse" value="${esc(state.course)}"></div>
    <div class="field"><label for="aiTask">Actividad o producto a evaluar</label><textarea id="aiTask" rows="4" placeholder="Ej.: Diseñar y construir una lámpara de madera con LED y presentar su memoria técnica">${esc(state.task)}</textarea></div>
    <div class="field"><label for="aiCriteria">Criterios de evaluación (código y texto oficial; uno por línea)</label><textarea id="aiCriteria" rows="6" placeholder="2.1 — Idear y diseñar soluciones...&#10;2.2 — Seleccionar, planificar y organizar...">${esc(state.criteria)}</textarea><span class="hint">Copia aquí los criterios literalmente. La IA no debe inventar códigos ni normativa.</span></div>
    <div class="field"><label for="aiNotes">Instrucciones adicionales (opcional)</label><textarea id="aiNotes" rows="3" placeholder="Ej.: Descriptores breves, peso igual para cada criterio, nivel adaptado a diversificación...">${esc(state.notes)}</textarea></div>
    <div class="field"><label for="aiLevels">Niveles de logro</label><select id="aiLevels"><option value="4" ${state.levels===4?'selected':''}>4 niveles · 1, 4, 7, 10</option><option value="5" ${state.levels===5?'selected':''}>5 niveles · 2, 4, 6, 8, 10</option></select></div>
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
    const levels=points.map((p,i)=>({name:String(response.levels[i]?.name||['Inicial','En proceso','Adecuado','Excelente'][i]||'Nivel '+(i+1)).slice(0,60),points:p}));
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
  document.getElementById('content').addEventListener('click',e=>{
    const b=e.target.closest('[data-ai]');if(!b)return;
    if(b.dataset.ai==='generate'||b.dataset.ai==='regenerate')generate();
    if(b.dataset.ai==='save'&&draft){db.rubrics.push(draft);const id=draft.id;draft=null;state.key='';save();switchView('rubricas');toast('Rúbrica generada guardada. Revísala y edítala antes de evaluar.');}
  });
  window.AulaAI={page};
})();
