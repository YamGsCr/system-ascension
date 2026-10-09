/* ===== EXAMINADOR IA (sample) + modais base ===== */
App.X = {s:{}};
App.examExtra = function(n){
  var out = '';
  (n.chx || []).forEach(function(x){ var c = SYS.CHOICES[x.key], o = App.trackOpt ? App.trackOpt(x.key) : null; if (!c) return;
    out += o ? '\nTRILHA ESCOLHIDA ('+c.n+'): '+o.n+' — tópicos da trilha: '+((x.per[o.id] || {}).st || []).join('; ') : '\nTRILHA ('+c.n+'): ainda não escolhida; pergunte de forma neutra entre as opções '+c.opts.map(function(y){ return y.n; }).join(', ')+'.'; });
  if ((n.tk || []).length) out += '\nTÉCNICAS E FERRAMENTAS QUE O JOGADOR DEVE TER INVESTIGADO SOZINHO: '+n.tk.map(function(t){ return t[0]; }).join('; ');
  return out;
};
App.examCtx = function(o){
  if (o.kind === 'gate') {
    var g = E.GATE[o.id], w = App.way(g.way), a = E.ARC[g.way+':'+g.arc];
    return {key:'G:'+g.id, title:g.n, way:w, text:'CAMINHO: '+w.name+'\nSELO: '+g.n+'\nARCO: '+a.n+' — '+a.sub+'\nNÓS DO ARCO: '+a.nodes.map(function(n){ return n.id+' '+n.t; }).join('; ')+'\nEVIDÊNCIAS EXIGIDAS: '+g.ev.join('; ')+'\nCHECAGEM ORAL: '+g.oral+'\nCHECAGEM DE FALHA: '+g.fail+'\nCRITÉRIOS DO CAMINHO: '+w.checks.join('; '), prompts:[g.oral, g.fail]};
  }
  var n = E.NODE[o.id], w2 = App.way(n.way), arc = E.arcOf(n);
  return {key:n.id, title:n.t, way:w2, text:'CAMINHO: '+w2.name+'\nARCO: '+arc.n+'\nNÓ: '+n.id+' — '+n.t+' (disciplina: '+n.d+')\nRESUMO: '+n.s+'\nTÓPICOS: '+n.st.join('; ')+'\nMISSÃO PRÁTICA: '+n.q+'\nENTREGÁVEL: '+n.dv+'\nCONDIÇÃO DE APROVAÇÃO: '+n.g+'\nCOMO FALHA: '+n.f+'\nTEACH-BACK: '+(n.tb || 'Explicar para alguém inteligente fora da área, incluindo quando dá errado.')+'\nCRITÉRIOS DO CAMINHO: '+w2.checks.join('; ')+App.examExtra(n), prompts:null};
};
App.examState = function(key){ return App.X.s[key] || (App.X.s[key] = {mode:'teach', text:'', qs:null, ans:[], res:null, err:null, busy:false}); };
App.EXAM_RULES = 'Você é o EXAMINADOR do "System Ascension", um sistema pessoal de evolução no estilo Solo Leveling. Avalie com rigor de banca e justiça, em português do Brasil. Critérios: KNOW (explica com vocabulário próprio, exemplos e limites), DECIDE (compara alternativas e justifica para um contexto), FAIL (descreve modos de falha, detecção e recuperação), TEACH (claro para um leigo inteligente, sem buzzword). Não invente fatos sobre o jogador. Se a resposta for curta, vaga, copiada de definição ou fugir do tema, a nota é baixa. Aprovação exige nota >= 70 E tratar de falha/limites.';
App.examGradePrompt = function(ctx, st){
  var body = st.mode === 'grill' && st.qs ? st.qs.map(function(q, i){ return 'PERGUNTA '+(i+1)+': '+q+'\nRESPOSTA: '+((st.ans[i] || '').trim() || '(sem resposta)'); }).join('\n\n') : 'EXPLICAÇÃO DO JOGADOR (teach-back):\n' + st.text.trim();
  return App.EXAM_RULES + '\n\n=== CONTEXTO DA QUEST ===\n' + ctx.text + '\n\n=== ' + (st.mode === 'grill' ? 'INTERROGATÓRIO' : 'TEACH-BACK') + ' ===\n' + body.slice(0, 12000)
    + '\n\nResponda SOMENTE com um objeto JSON neste formato: {"nota": 0-100, "veredito": "APROVADO" | "QUASE" | "REPROVADO", "resumo": "2 frases diretas, pode ter uma pitada de ironia", "acertos": ["..."], "lacunas": ["..."], "erros": ["afirmações incorretas, se houver"], "falha": "avaliação de como tratou falhas e limites", "perguntas": ["3 perguntas de follow-up difíceis"], "proximo_passo": "1 ação concreta", "alem": false}. Use "alem": true SOMENTE se a resposta for claramente muito além do esperado para ESTA quest (profundidade de nível avançado, conexões corretas não pedidas, casos-limite reais e falhas bem tratadas) e a nota for 90 ou mais — isso deve ser raro. Máximo de 5 itens por lista, cada item com até 200 caracteres.';
};
App.examQPrompt = function(ctx){
  return App.EXAM_RULES + '\n\n=== CONTEXTO ===\n' + ctx.text + '\n\nCrie 3 perguntas de interrogatório oral para verificar domínio real: 1) conceito com limites (KNOW), 2) decisão com trade-off num cenário concreto (DECIDE), 3) falha, detecção e recuperação (FAIL). Perguntas curtas, específicas, sem resposta de sim/não. Responda SOMENTE com um array JSON de 3 strings.';
};
App.examClean = function(r){
  if (!r || typeof r !== 'object') return null;
  var arr = function(x){ return (Array.isArray(x) ? x : []).map(function(s){ return String(s).slice(0, 260); }).filter(Boolean).slice(0, 5); };
  var nota = Math.round(U.clamp(Number(r.nota) || 0, 0, 100));
  var v = String(r.veredito || '').toUpperCase(); if (['APROVADO','QUASE','REPROVADO'].indexOf(v) < 0) v = nota >= 70 ? 'APROVADO' : nota >= 50 ? 'QUASE' : 'REPROVADO';
  if (v === 'APROVADO' && nota < 70) v = nota >= 50 ? 'QUASE' : 'REPROVADO';
  if (v !== 'APROVADO' && nota >= 70) nota = 69;
  return {alem:r.alem === true && nota >= 90, nota:nota, v:v, resumo:String(r.resumo || '').slice(0, 400), acertos:arr(r.acertos), lacunas:arr(r.lacunas), erros:arr(r.erros), falha:String(r.falha || '').slice(0, 300), perguntas:arr(r.perguntas), prox:String(r.proximo_passo || '').slice(0, 260)};
};
App.EXAM_ERR = {rate_limited:'Muitas chamadas ao Examinador agora. Respire e tente de novo em alguns minutos.', invalid_json:'A resposta veio torta. Tente de novo.', refused:'O Examinador recusou esse conteúdo. Reformule a resposta.', prompt_too_large:'Texto grande demais. Resuma.', session_expired:'Sua sessão expirou. Entre de novo no Claude.', empty_completion:'O Examinador ficou sem palavras. Tente de novo.'};
App.examFail = function(st, e){
  var c = e && e.code;
  if (['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].indexOf(c) >= 0) { App.sampleOff = true; st.err = 'O Examinador IA não está liberado nesta visualização. Use o modo manual.'; }
  else if (c !== 'cancelled') st.err = App.EXAM_ERR[c] || 'Falha temporária do Examinador. Tente de novo.';
};
App.examPanel = function(o){
  var ctx = App.examCtx(o), st = App.examState(ctx.key), note = App.N.n[ctx.key] || {}, ai = App.sample && !App.sampleOff;
  var last = note.ex && note.ex.nota != null ? '<div class="row" style="gap:6px"><span class="eyebrow">Último exame</span><span class="chip '+(note.ex.nota >= 70 ? 'ok' : note.ex.nota >= 50 ? 'warn' : 'bad')+'">'+note.ex.nota+' · '+U.esc(note.ex.v)+'</span><span class="faint mono" style="font-size:11px">'+U.fmtDate(note.ex.at)+'</span></div>' : '';
  var intro = '<div class="stack" style="gap:6px"><span class="eyebrow">Examinador do Sistema</span><p class="dim" style="font-size:14px">'+(o.kind === 'gate' ? 'Ensaie a defesa do selo: responda à checagem oral e à checagem de falha como se estivesse diante de uma banca.' : 'Prove que entendeu: explique como se ensinasse alguém (teach-back) ou encare 3 perguntas de interrogatório.')+' <b>O Examinador aconselha; quem marca a quest é você.</b></p>'+last+'</div>';
  if (!ai) {
    var mc = note.mc || [];
    var crit = [['KNOW','Expliquei sem consultar notas, com exemplos e limites.'],['DECIDE','Comparei alternativas e justifiquei a escolha.'],['FAIL','Descrevi como falha, como detecto e como recupero.'],['TEACH','Ensinei para uma pessoa real e ela entendeu.']];
    return intro + '<div class="callout" style="font-size:14px">'+(App.sampleOff ? 'O Examinador IA não foi liberado nesta visualização.' : 'O Examinador IA funciona quando o Sistema é aberto dentro do Claude.')+' Enquanto isso, faça a <b>autoavaliação honesta</b>:</div>'
      + (ctx.prompts ? '<div class="callout gate"><b>Oral:</b> '+U.esc(ctx.prompts[0])+'<br><b>Falha:</b> '+U.esc(ctx.prompts[1])+'</div>' : '')
      + '<div class="stack" style="gap:0">'+crit.map(function(c, i){ return '<label class="check"><input type="checkbox" data-c="exManual" data-k="'+U.esc(ctx.key)+'" data-i2="'+i+'"'+(mc[i] ? ' checked' : '')+'><span><b class="mono">'+c[0]+'</b> — '+c[1]+'</span></label>'; }).join('')+'</div>'
      + (st.err ? '<p class="bad" style="font-size:13px">'+U.esc(st.err)+'</p>' : '');
  }
  var mode = o.kind === 'gate' ? 'teach' : st.mode;
  var seg = o.kind === 'gate' ? '' : '<div class="seg" role="group" aria-label="Modo">'+[['teach','Teach-back'],['grill','Interrogatório']].map(function(m){ return '<button class="'+(mode === m[0] ? 'on' : '')+'" data-a="exMode" data-k="'+U.esc(ctx.key)+'" data-s="'+m[0]+'"'+(st.busy ? ' disabled' : '')+'>'+m[1]+'</button>'; }).join('')+'</div>';
  var form = '';
  if (mode === 'grill') {
    if (!st.qs) form = '<div class="empty">Gere 3 perguntas: conceito, decisão e falha.</div><div class="row" style="justify-content:flex-end"><button class="btn primary" data-a="exQs" data-kind="'+o.kind+'" data-id="'+o.id+'"'+(st.busy ? ' disabled' : '')+'>'+U.icon('oracle')+'Gerar perguntas</button></div>';
    else form = st.qs.map(function(q, i){ return '<label class="fld" style="text-transform:none;letter-spacing:0;font:600 14px/1.4 var(--f-body);color:var(--text)">'+(i+1)+'. '+U.esc(q)+'<textarea data-i="exAns" data-k="'+U.esc(ctx.key)+'" data-i2="'+i+'" rows="4" maxlength="3000"'+(st.busy ? ' readonly' : '')+'>'+U.esc(st.ans[i] || '')+'</textarea></label>'; }).join('')
      + '<div class="row between"><button class="btn sm ghost" data-a="exQs" data-kind="'+o.kind+'" data-id="'+o.id+'" data-new="1"'+(st.busy ? ' disabled' : '')+'>Outras perguntas</button><button class="btn primary" data-a="exGrade" data-kind="'+o.kind+'" data-id="'+o.id+'"'+(st.busy ? ' disabled' : '')+'>'+U.icon('oracle')+'Entregar respostas</button></div>';
  } else {
    form = (ctx.prompts ? '<div class="callout gate"><b>Oral:</b> '+U.esc(ctx.prompts[0])+'<br><b>Falha:</b> '+U.esc(ctx.prompts[1])+'</div>' : '')
      + '<label class="fld">'+(o.kind === 'gate' ? 'Sua defesa (responda às duas checagens)' : 'Explique com suas palavras — inclua quando isso dá errado')+'<textarea data-i="exText" data-k="'+U.esc(ctx.key)+'" rows="9" maxlength="8000" placeholder="Nada de colar definição. O Examinador percebe."'+(st.busy ? ' readonly' : '')+'>'+U.esc(st.text)+'</textarea></label>'
      + '<div class="row between"><span class="faint mono" style="font-size:11px" id="exCount">'+st.text.trim().length+' caracteres · mínimo 200</span><button class="btn primary" data-a="exGrade" data-kind="'+o.kind+'" data-id="'+o.id+'"'+(st.busy ? ' disabled' : '')+'>'+U.icon('oracle')+'Enviar ao Examinador</button></div>';
  }
  var busy = st.busy ? '<div class="exam-out"><div class="row between"><div class="thinking"><i></i><i></i><i></i>'+(st.busy === 'qs' ? 'Formulando perguntas…' : 'O Examinador está lendo. Pode levar até um minuto.')+'</div><button class="btn sm ghost" data-a="exStop" data-k="'+U.esc(ctx.key)+'">Parar</button></div></div>' : '';
  var err = st.err ? '<p class="bad" style="font-size:13.5px">'+U.esc(st.err)+'</p>' : '';
  var r = st.res, res = '';
  if (r) {
    var li = function(t, a, cls){ return a.length ? '<div class="stack" style="gap:4px"><h4>'+t+'</h4><ul class="list'+(cls ? ' '+cls : '')+'">'+a.map(function(x){ return '<li><span>'+U.esc(x)+'</span></li>'; }).join('')+'</ul></div>' : ''; };
    res = '<div class="exam-out">'+(r.alem ? '<div class="alem">'+U.icon('sparkle')+'PRODÍGIO OU CHEATER? O Examinador marcou esta resposta como muito acima do esperado.</div>' : '')+'<div class="row between"><span class="verdict '+r.v+'">'+r.v+'</span><span class="mono" style="font:700 26px/1 var(--f-mono)">'+r.nota+'<small class="dim" style="font-size:12px">/100</small></span></div>'+H.bar(r.nota)
      + (r.resumo ? '<p>'+U.esc(r.resumo)+'</p>' : '') + li('Acertos', r.acertos) + li('Lacunas', r.lacunas) + li('Erros', r.erros)
      + (r.falha ? '<div class="callout fail" style="font-size:14px"><b>Falha & limites:</b> '+U.esc(r.falha)+'</div>' : '')
      + li('Perguntas de follow-up', r.perguntas) + (r.prox ? '<div class="callout gate" style="font-size:14px"><b>Próximo passo:</b> '+U.esc(r.prox)+'</div>' : '')
      + '<p class="faint" style="font-size:12px">Avaliação gerada por IA: use como treino, não como verdade absoluta.</p></div>';
  }
  return intro + seg + form + busy + err + res;
};
App.examDrawer = function(u){
  var g = E.GATE[u.id], w = App.way(g.way);
  return '<div class="dr-head" style="--wc:'+w.color+'"><div class="dr-top"><div class="stack" style="gap:6px;min-width:0"><span class="eyebrow" style="color:'+w.color+'">'+U.esc(w.name)+' · defesa do selo</span><h2>'+U.esc(g.n)+'</h2><div class="row" style="gap:6px"><span class="chip glow">+'+g.xp+' XP</span><button class="chip" data-a="openGate" data-id="'+g.id+'" style="cursor:pointer">'+U.icon('gate')+'ver evidências</button></div></div><button class="iconbtn" data-a="closeAll" aria-label="Fechar">'+U.icon('close')+'</button></div></div>'
    + '<div class="dr-body">'+App.examPanel({kind:'gate', id:g.id})+'</div>';
};
App.A.examGate = function(el){ App.ui.modal = null; App.ui.drawer = {type:'exam', id:el.getAttribute('data-id'), tab:'exam'}; App.renderModal(); App.renderDrawer(); };
App.I.exText = function(el){ var st = App.examState(el.getAttribute('data-k')); st.text = el.value; var c = App.$('exCount'); if (c) c.textContent = st.text.trim().length + ' caracteres · mínimo 200'; };
App.I.exAns = function(el){ App.examState(el.getAttribute('data-k')).ans[+el.getAttribute('data-i2')] = el.value; };
App.A.exMode = function(el){ var st = App.examState(el.getAttribute('data-k')); if (st.busy) return; st.mode = el.getAttribute('data-s'); st.err = null; App.renderDrawer(); };
App.A.exStop = function(el){ var st = App.examState(el.getAttribute('data-k')); if (st.ctl) st.ctl.abort(); };
App.C.exManual = function(el){ var k = el.getAttribute('data-k'), N = App.N, note = N.n[k] = N.n[k] || {}; note.mc = note.mc || []; note.mc[+el.getAttribute('data-i2')] = el.checked; Store.save(['notes']); };
App.A.exQs = function(el){
  var o = {kind:el.getAttribute('data-kind'), id:el.getAttribute('data-id')}, ctx = App.examCtx(o), st = App.examState(ctx.key);
  if (!App.sample || st.busy) return;
  st.busy = 'qs'; st.err = null; st.ctl = new AbortController(); App.renderDrawer();
  var opts = {signal:st.ctl.signal}; if (el.getAttribute('data-new')) opts.cache = false;
  App.sample.json(App.examQPrompt(ctx), opts).then(function(a){
    var qs = (Array.isArray(a) ? a : (a && a.perguntas) || []).map(function(x){ return String(typeof x === 'object' && x ? (x.q || x.pergunta || '') : x).slice(0, 400); }).filter(Boolean).slice(0, 3);
    if (!qs.length) { st.err = 'O Examinador não formulou perguntas. Tente de novo.'; } else { st.qs = qs; st.ans = []; st.res = null; }
  }).catch(function(e){ App.examFail(st, e); }).then(function(){ st.busy = false; st.ctl = null; App.renderDrawer(); });
};
App.A.exGrade = function(el){
  var o = {kind:el.getAttribute('data-kind'), id:el.getAttribute('data-id')}, ctx = App.examCtx(o), st = App.examState(ctx.key);
  if (!App.sample || st.busy) return;
  if (o.kind === 'gate') st.mode = 'teach';
  if (st.mode === 'grill') { if (!st.qs || st.qs.some(function(_, i){ return (st.ans[i] || '').trim().length < 40; })) { st.err = 'Responda às 3 perguntas (pelo menos algumas frases cada).'; App.renderDrawer(); return; } }
  else if (st.text.trim().length < 200) { st.err = 'Escreva pelo menos 200 caracteres. Explicação de uma linha não passa nem em prova de recuperação.'; App.renderDrawer(); return; }
  st.busy = 'grade'; st.err = null; st.ctl = new AbortController(); App.renderDrawer();
  App.sample.json(App.examGradePrompt(ctx, st), {signal:st.ctl.signal}).then(function(raw){
    var r = App.examClean(raw); if (!r) { st.err = 'A resposta veio torta. Tente de novo.'; return; }
    st.res = r;
    var S = App.S, N = App.N, note = N.n[ctx.key] = N.n[ctx.key] || {}, first = !(note.ex && note.ex.passed);
    S.exams.total = (S.exams.total || 0) + 1; S.exams.best = Math.max(S.exams.best || 0, r.nota);
    if (r.nota >= 70 && first) S.exams.passes = (S.exams.passes || 0) + 1;
    if (r.nota < 70) note.exFail = true;
    else if (note.exFail && !note.phx) { note.phx = true; S.exams.phoenix = (S.exams.phoenix || 0) + 1; }
    if (r.alem && !note.alem) { note.alem = true; S.exams.alem = (S.exams.alem || 0) + 1; }
    note.ex = {nota:r.nota, v:r.v, at:new Date().toISOString(), mode:st.mode, passed:!!((note.ex && note.ex.passed) || r.nota >= 70), alem:!!(r.alem || (note.ex && note.ex.alem))};
    App.commit(['core','notes'], {norender:true});
    App.toast({t:'Examinador · '+r.v+' ('+r.nota+')', s:r.nota >= 70 ? 'Aprovado. Agora prove no mundo real e marque a quest.' : r.nota >= 50 ? 'Quase. Veja as lacunas e volte.' : 'Reprovado. O Examinador não se comoveu.', ic:'oracle'});
  }).catch(function(e){ App.examFail(st, e); }).then(function(){ st.busy = false; st.ctl = null; App.render(); });
};
App.A.owGen = function(){
  var f = App.ui.f.ow; if (!App.sample || App.ui.owBusy || !f) return;
  if ((f.gap || '').trim().length < 30) { App.ui.owErr = 'Descreva a lacuna com pelo menos uma ou duas frases.'; App.renderView(); return; }
  var w = App.way(f.way); App.ui.owBusy = true; App.ui.owErr = null; App.renderView();
  var prompt = 'Você é o Sistema do "System Ascension". Transforme uma lacuna real de projeto numa quest de Mundo Aberto para o Caminho "'+w.name+'" ('+w.tagline+'). Critérios do Caminho: '+w.checks.join('; ')+'.\nTÍTULO: '+(f.t || '(sem título)')+'\nLACUNA REAL: '+f.gap.slice(0, 1500)+'\n\nResponda SOMENTE com JSON: {"titulo": "até 70 caracteres", "missao": "ação prática verificável em até 400 caracteres", "criterio": "condição de aprovação objetiva em até 300 caracteres", "falha": "armadilhas e modos de falha em até 300 caracteres"}. Português do Brasil, direto, sem enrolação.';
  App.sample.json(prompt, {cache:false}).then(function(r){
    if (!r || typeof r !== 'object') { App.ui.owErr = 'A resposta veio torta. Tente de novo.'; return; }
    if (!f.t && r.titulo) f.t = String(r.titulo).slice(0, 120);
    f.q = String(r.missao || '').slice(0, 500); f.g = String(r.criterio || '').slice(0, 350); f.fl = String(r.falha || '').slice(0, 350);
  }).catch(function(e){ var st = {}; App.examFail(st, e); App.ui.owErr = st.err || null; }).then(function(){ App.ui.owBusy = false; App.renderView(); });
};

/* ---------- modais ---------- */
App.renderModal = function(){
  var el = App.$('modal'), m = App.ui.modal; App.renderScrim();
  if (!m) { el.innerHTML = ''; el.removeAttribute('data-k'); el.classList.remove('same'); return; }
  var key = m.type + ':' + (m.id || m.k || ''), same = el.getAttribute('data-k') === key, old = el.firstElementChild, sc = old ? old.scrollTop : 0;
  var fn = App.M[m.type], html = '';
  try { html = fn ? fn(m) : ''; } catch(e){ if (window.console) console.error(e); html = '<section class="win"><div class="win-h">Erro</div><p class="dim">'+U.esc(e.message)+'</p><div class="row" style="justify-content:flex-end"><button class="btn" data-a="closeModal">Fechar</button></div></section>'; }
  if (!html) { App.ui.modal = null; el.innerHTML = ''; el.removeAttribute('data-k'); App.renderScrim(); return; }
  el.classList.toggle('same', same); el.innerHTML = html; el.setAttribute('data-k', key);
  var win = el.firstElementChild;
  if (win) { win.setAttribute('role', 'dialog'); win.setAttribute('aria-modal', 'true'); win.setAttribute('tabindex', '-1'); if (same) win.scrollTop = sc; else try { win.focus({preventScroll:true}); } catch(e){} }
};
App.M.confirm = function(m){
  return '<section class="win"><div class="win-h"'+(m.danger ? ' style="color:var(--bad)"' : '')+'>'+U.icon(m.danger ? 'alert' : 'check')+'Confirmação</div><div class="stack"><h3>'+U.esc(m.title)+'</h3>'+(m.body ? '<p class="dim">'+U.esc(m.body)+'</p>' : '')+'<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn '+(m.danger ? 'danger' : 'primary')+'" data-a="'+U.esc(m.act)+'">'+U.esc(m.ok || 'Confirmar')+'</button></div></div></section>';
};
App.M.levelup = function(m){
  var D = App.D, lf = E.letterOf(m.from), lt = E.letterOf(m.to);
  return '<section class="win levelup"><div class="win-h">'+U.icon('sparkle')+'[Sistema] Notificação</div><div class="stack" style="align-items:center;text-align:center;gap:8px"><span class="eyebrow">Level up</span><div class="big">'+m.from+' <span class="dim" style="font-size:.5em">→</span> '+m.to+'</div>'
    + (lf !== lt ? '<span class="chip glow" style="font-size:13px">Rank '+lf+' → Rank '+lt+'</span>' : '<span class="chip">Rank '+lt+'</span>')
    + '<p class="dim">'+U.esc(U.pick(SYS.VOICE.level))+'</p><p class="mono faint" style="font-size:12px">'+U.esc(D.grank.n)+' · '+U.num(D.xp)+' XP'+(D.level < SYS.MAXLVL ? ' · próximo nível em '+U.num(D.lvNext - D.xp)+' XP' : '')+'</p>'
    + '<button class="btn primary" data-a="closeModal">Continuar</button></div></section>';
};
