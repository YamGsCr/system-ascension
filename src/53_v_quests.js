/* ===== VIEW: Missões (ativas, diárias, bosses, laterais, mundo aberto, certificações) e Portões ===== */
H.tabs = function(base, list, cur){
  return '<nav class="tabs" aria-label="Seções">'+list.map(function(t){ return '<a href="#/'+base+'/'+t[0]+'" class="'+(cur === t[0] ? 'on' : '')+'"'+(cur === t[0] ? ' aria-current="page"' : '')+'>'+(t[2] ? U.icon(t[2]) : '')+U.esc(t[1])+(t[3] != null ? '<span class="n">'+t[3]+'</span>' : '')+'</a>'; }).join('')+'</nav>';
};
H.head = function(eyebrow, title, lead){ return '<section class="pagehead"><span class="eyebrow">'+eyebrow+'</span><h1>'+title+'</h1>'+(lead ? '<p class="lead">'+lead+'</p>' : '')+'</section>'; };
H.waySelect = function(attr, val, extra){ return '<select '+attr+'>'+(extra || '')+SYS.WAYS.map(function(w){ return '<option value="'+w.id+'"'+(val === w.id ? ' selected' : '')+'>'+U.esc(w.name)+'</option>'; }).join('')+'</select>'; };
App.dailyDef = function(id){ return SYS.DAILIES.filter(function(d){ return d.id === id; })[0]; };

App.V.missoes = function(){
  var S = App.S, D = App.D, J = App.J, tab = App.ui.param || 'ativas';
  var active = Object.keys(S.nodes).filter(function(id){ var s = S.nodes[id].s; return E.NODE[id] && (s === 'doing' || s === 'review'); });
  var openQ = (J.open || []).filter(function(o){ return o.status !== 'done'; }).length;
  var sideOpen = S.sideq.filter(function(q){ return !q.done; }).length;
  var tabs = [['ativas','Ativas','sword',active.length],['diarias','Diárias & Extras','target'],['bosses','Bosses','sword',D.bossesDone+'/'+D.bossesTotal],['laterais','Laterais','scroll',sideOpen],['mundo','Mundo Aberto','map',openQ],['certs','Certificações','cert',D.certsPassed+'/'+SYS.CERTS.length]];
  var h = H.head('Quadro de missões', 'Missões', 'Quests ativas de todos os Caminhos, rotina diária, bosses, missões laterais, quests de Mundo Aberto (lacunas de projetos reais) e certificações.') + H.tabs('missoes', tabs, tab);
  var fn = App.Q[tab] || App.Q.ativas;
  return h + fn();
};
App.Q = {};
App.Q.ativas = function(){
  var S = App.S, D = App.D;
  var active = Object.keys(S.nodes).filter(function(id){ var s = S.nodes[id].s; return E.NODE[id] && (s === 'doing' || s === 'review'); }).map(function(id){ return E.NODE[id]; });
  var ready = Object.keys(E.GATE).map(function(k){ return E.GATE[k]; }).filter(function(g){ return !(S.gates[g.id] && S.gates[g.id].done) && E.gateReady(S, g); });
  var out = '<section class="win"><div class="win-h">'+U.icon('sword')+'Em andamento</div>'
    + (active.length ? '<div class="stack" style="gap:8px">'+active.map(H.nodeRow).join('')+'</div>' : '<div class="empty">Nenhuma quest em progresso. Abra um nó e marque “Em progresso” — o Sistema detesta ficar esperando.</div>') + '</section>';
  if (ready.length) out += '<section class="win"><div class="win-h" style="color:var(--ok)">'+U.icon('gate')+'Selos prontos para defesa</div><div class="stack" style="gap:8px">'+ready.map(App.gateCard).join('')+'</div></section>';
  out += '<section class="win"><div class="win-h">'+U.icon('map')+'Próxima quest de cada Caminho</div><div class="stack" style="gap:10px">'
    + SYS.WAYS.map(function(w){ var n = E.nextNode(S, w.id); return '<div class="stack" style="gap:6px"><div class="row between"><span class="eyebrow" style="color:'+w.color+'">'+U.esc(w.name)+'</span><span class="faint mono" style="font-size:11px">'+D.wayDone[w.id]+'/'+D.wayNodes[w.id]+' nós · '+U.esc(D.tier[w.id].n)+'</span></div>'+(n ? H.nodeRow(n) : '<div class="empty">Tudo completo ou aguardando selo.</div>')+'</div>'; }).join('')
    + '</div></section>';
  return out;
};

App.Q.diarias = function(){
  var S = App.S, D = App.D, t = U.today(), rec = S.daily[t] || {q:{}}, act = S.settings.dailies;
  var today = '<section class="win"><div class="win-h">'+U.icon('target')+'Hoje · '+U.fmtDate(t)+'</div><div class="stack" style="gap:6px">'
    + (act.length ? act.map(function(id){ var d = App.dailyDef(id); if (!d) return ''; var on = !!(rec.q && (id in rec.q)); var wid = App.dailyWay(d), w = wid && App.way(wid);
        return '<button class="daily'+(on?' on':'')+'" data-a="dailyToggle" data-id="'+id+'" aria-pressed="'+on+'"><span class="box">'+U.icon('check')+'</span><span style="min-width:0;text-align:left"><span class="t">'+U.esc(d.n)+'</span><br><span class="d">'+U.esc(d.d)+'</span></span><span class="rw">+'+d.xp+' XP<br>'+(w ? '<span style="color:'+w.color+'">+'+d.cr+' '+w.cur.code+'</span>' : '+'+(d.gem||0)+' ◆')+'</span></button>'; }).join('') : '<div class="empty">Nenhuma diária ativa. Ative abaixo.</div>')
    + '</div><div class="row between" style="margin-top:12px"><span class="faint mono" style="font-size:11.5px">Descansos nesta semana: '+E.restThisWeek(S, t)+'/2 · tickets: '+(S.owned.tickets||0)+'</span><button class="btn sm ghost" data-a="restDay">'+U.icon('moon')+(rec.rest ? 'Desfazer descanso' : 'Dia de descanso')+'</button></div></section>';
  var cfg = '<section class="win"><div class="win-h">'+U.icon('status')+'Configurar diárias</div><p class="dim" style="font-size:14px;margin-bottom:8px">Menos é mais: 4–5 diárias cabem nas ~2h/dia. A meta do dia é fazer <b>todas as ativas</b>. Mudanças valem a partir de hoje.</p><div class="stack" style="gap:0">'
    + SYS.DAILIES.map(function(d){ var wid = App.dailyWay(d), w = wid && App.way(wid); return '<label class="check"><input type="checkbox" data-c="dailyCfg" data-id="'+d.id+'"'+(act.indexOf(d.id) >= 0 ? ' checked' : '')+'><span><b>'+U.esc(d.n)+'</b> <span class="faint">· '+(w ? U.esc(w.name) : 'Sistema')+' · +'+d.xp+' XP</span><br><span class="dim" style="font-size:13.5px">'+U.esc(d.d)+'</span></span></label>'; }).join('')
    + '</div><label class="fld" style="margin-top:10px">Caminho que recebe o XP da Leitura'+H.waySelect('data-c="readWay"', S.settings.readWay)+'</label><p class="faint" style="font-size:12.5px;margin-top:6px">“Foco Profundo” credita no Caminho principal da temporada (tela Status).</p></section>';
  var heat = '<section class="win"><div class="win-h">'+U.icon('flame')+'Últimas 16 semanas<a class="act" href="#/sequencia">ver a chama →</a></div>'+App.heatmap(16)
    + '<div class="kpis" style="margin-top:14px"><div class="kpi"><b>'+D.streak+'</b><span>sequência atual</span></div><div class="kpi"><b>'+D.bestStreak+'</b><span>melhor sequência</span></div><div class="kpi"><b>'+D.dailyDays+'</b><span>dias completos</span></div><div class="kpi"><b>'+D.extraDays+'</b><span>dias extras</span></div></div></section>';
  return '<div class="grid g2" style="align-items:start"><div class="stack" style="gap:18px">'+today+App.extrasBlock()+'</div>'+cfg+'</div>'+heat;
};
App.C.dailyCfg = function(el){
  var S = App.S, id = el.getAttribute('data-id'), a = S.settings.dailies, k = a.indexOf(id);
  if (el.checked && k < 0) a.push(id); if (!el.checked && k >= 0) a.splice(k, 1);
  a.sort(function(x, y){ return SYS.DAILIES.findIndex(function(d){ return d.id === x; }) - SYS.DAILIES.findIndex(function(d){ return d.id === y; }); });
  var rec = S.daily[U.today()]; if (rec) { rec.need = a.length; if (id === 'grass') delete rec.gx; }
  App.commit(['core']);
};
App.C.readWay = function(el){ App.S.settings.readWay = el.value; App.commit(['core']); };

App.Q.bosses = function(){
  var D = App.D;
  return '<section class="win"><div class="win-h">'+U.icon('sword')+'Bestiário · '+D.bossesDone+'/'+D.bossesTotal+' derrotados</div><p class="dim" style="font-size:14px;margin-bottom:10px">Boss = projeto integrador: entrega + defesa oral + revisão de falhas. Final Boss exige os selos anteriores do Caminho.</p><div class="stack" style="gap:14px">'
    + SYS.WAYS.map(function(w){ var bs = E.BOSSES.filter(function(n){ return n.way === w.id; }); if (!bs.length) return ''; return '<div class="stack" style="gap:6px"><span class="eyebrow" style="color:'+w.color+'">'+U.esc(w.name)+' · '+bs.filter(function(n){ return D.nodeDone[n.id]; }).length+'/'+bs.length+'</span>'+bs.map(H.nodeRow).join('')+'</div>'; }).join('')
    + '</div></section>';
};

App.SIDESIZES = [[10,'Rápida · até 1h'],[25,'Média · meio dia'],[50,'Grande · fim de semana']];
App.Q.laterais = function(){
  var S = App.S, f = App.ui.f.side || (App.ui.f.side = {t:'', way:S.settings.season.main, xp:10});
  var open = S.sideq.filter(function(q){ return !q.done; }), done = S.sideq.filter(function(q){ return q.done; }).slice(-30).reverse();
  var form = '<section class="win"><div class="win-h">'+U.icon('plus')+'Nova missão lateral</div><p class="dim" style="font-size:14px;margin-bottom:10px">Tarefas reais fora da árvore: consertar o roteador da loja, gravar um cover, arrumar o contrato de um cliente. XP pequeno de propósito — o grosso vem dos nós.</p>'
    + '<div class="grid" style="grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:end" id="sideForm"><label class="fld">Missão<input type="text" data-i="sideT" maxlength="120" value="'+U.esc(f.t)+'" placeholder="Ex.: mapear a rede da Infomax"></label><label class="fld">Caminho'+H.waySelect('data-c="sideWay"', f.way)+'</label><label class="fld">Tamanho<select data-c="sideXp">'+App.SIDESIZES.map(function(s){ return '<option value="'+s[0]+'"'+(+f.xp === s[0] ? ' selected' : '')+'>'+s[1]+' (+'+s[0]+' XP)</option>'; }).join('')+'</select></label></div>'
    + '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="sideAdd">'+U.icon('plus')+'Adicionar</button></div></section>';
  function row(q){ var w = App.way(q.way) || SYS.WAYS[0];
    return '<div class="q'+(q.done ? ' done' : '')+'" style="--wc:'+w.color+';cursor:default"><button class="st" data-a="sideToggle" data-id="'+q.id+'" aria-label="'+(q.done ? 'Reabrir' : 'Concluir')+'" style="cursor:pointer;background:'+(q.done ? 'var(--ok)' : 'none')+'">'+U.icon('check')+'</button><span style="min-width:0"><span class="tt">'+U.esc(q.t)+'</span><span class="mt">'+H.wayChip(q.way)+'<span class="chip">criada '+U.fmtDate(q.d)+'</span>'+(q.done ? '<span class="chip ok">feita '+U.fmtDate(q.done)+'</span>' : '')+'</span></span><span class="row" style="gap:6px;flex-wrap:nowrap"><span class="rw">+'+q.xp+' XP<br>+'+Math.round(q.xp/5)+' '+w.cur.code+'</span><button class="iconbtn" data-a="sideDel" data-id="'+q.id+'" aria-label="Apagar">'+U.icon('trash')+'</button></span></div>'; }
  return form + '<section class="win"><div class="win-h">'+U.icon('scroll')+'Abertas · '+open.length+'</div><div class="stack" style="gap:8px">'+(open.length ? open.map(row).join('') : '<div class="empty">Nenhuma missão lateral aberta.</div>')+'</div></section>'
    + (done.length ? '<section class="win"><div class="win-h">'+U.icon('check')+'Concluídas recentes</div><div class="stack" style="gap:8px">'+done.map(row).join('')+'</div></section>' : '');
};
App.I.sideT = function(el){ App.ui.f.side.t = el.value; };
App.C.sideWay = function(el){ App.ui.f.side.way = el.value; };
App.C.sideXp = function(el){ App.ui.f.side.xp = +el.value; };
App.A.sideAdd = function(){
  var f = App.ui.f.side, S = App.S; if (!f || (f.t || '').trim().length < 3) { App.toast({t:'Missão sem nome', s:'Escreva pelo menos 3 letras. O Sistema não aceita “coisa”.', ic:'alert'}); return; }
  if (S.sideq.filter(function(q){ return !q.done; }).length >= 30) { App.toast({t:'Quadro lotado', s:'30 laterais abertas é fuga, não produtividade. Feche algumas.', ic:'alert'}); return; }
  S.sideq.push({id:U.uid(), t:f.t.trim().slice(0,120), way:f.way, xp:[10,25,50].indexOf(+f.xp) >= 0 ? +f.xp : 10, d:U.today(), done:null});
  if (S.sideq.length > 300) S.sideq = S.sideq.filter(function(q){ return !q.done; }).concat(S.sideq.filter(function(q){ return q.done; }).slice(-250));
  f.t = ''; App.commit(['core']);
};
App.A.sideToggle = function(el){ var q = App.S.sideq.filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; if (!q) return; q.done = q.done ? null : U.today(); App.commit(['core']); if (q.done) App.toast({t:'Missão lateral concluída', s:'+'+q.xp+' XP. Vida real também dá XP.', ic:'check'}); };
App.A.sideDel = function(el){ var id = el.getAttribute('data-id'); App.S.sideq = App.S.sideq.filter(function(x){ return x.id !== id; }); App.commit(['core']); };

App.OWST = [['open','Aberta'],['doing','Em progresso'],['done','Resolvida']];
App.Q.mundo = function(){
  var J = App.J, S = App.S, f = App.ui.f.ow || (App.ui.f.ow = {t:'', way:S.settings.season.main, gap:'', q:'', g:'', fl:''});
  var list = (J.open || []).slice().sort(function(a, b){ return (a.status === 'done') - (b.status === 'done') || (a.d < b.d ? 1 : -1); });
  var ai = App.sample ? '<button class="btn" data-a="owGen"'+(App.ui.owBusy ? ' disabled' : '')+'>'+U.icon('oracle')+(App.ui.owBusy ? 'Gerando…' : 'Gerar quest com o Examinador')+'</button>' : '<span class="faint" style="font-size:12.5px">Examinador IA indisponível nesta visualização — preencha manualmente.</span>';
  var form = '<section class="win"><div class="win-h">'+U.icon('map')+'Nova quest de Mundo Aberto</div><p class="dim" style="font-size:14px;margin-bottom:10px">Mundo Aberto é onde a árvore encontra a vida: uma <b>lacuna real</b> de um projeto real (a rede do resort, o SaaS, a loja, uma faixa travada). Descreva a lacuna; a quest vira missão com critério de aprovação e modo de falha. Resolver vale +40 XP no Caminho.</p>'
    + '<div class="grid g2" style="gap:8px"><label class="fld">Título<input type="text" data-i="owF" data-k="t" maxlength="120" value="'+U.esc(f.t)+'" placeholder="Ex.: VLANs do resort sem derrubar o Wi-Fi"></label><label class="fld">Caminho'+H.waySelect('data-c="owWay"', f.way)+'</label></div>'
    + '<label class="fld" style="margin-top:8px">Lacuna real (o que você ainda não sabe fazer neste projeto)<textarea data-i="owF" data-k="gap" rows="3" maxlength="700" placeholder="Contexto, restrições, o que travou…">'+U.esc(f.gap)+'</textarea></label>'
    + '<div class="grid g3" style="gap:8px;margin-top:8px"><label class="fld">Missão<textarea data-i="owF" data-k="q" rows="3" maxlength="500">'+U.esc(f.q)+'</textarea></label><label class="fld">Critério de aprovação<textarea data-i="owF" data-k="g" rows="3" maxlength="350">'+U.esc(f.g)+'</textarea></label><label class="fld">Como falha<textarea data-i="owF" data-k="fl" rows="3" maxlength="350">'+U.esc(f.fl)+'</textarea></label></div>'
    + (App.ui.owErr ? '<p class="bad" style="font-size:13px;margin-top:6px">'+U.esc(App.ui.owErr)+'</p>' : '')
    + '<div class="row between" style="margin-top:10px">'+ai+'<button class="btn primary" data-a="owAdd">'+U.icon('plus')+'Adicionar quest</button></div></section>';
  var cards = list.map(function(o){
    var w = App.way(o.way) || SYS.WAYS[0];
    return '<article class="win flat" style="--wc:'+w.color+';border-left:3px solid '+w.color+'"><div class="row between" style="align-items:flex-start"><div class="stack" style="gap:4px;min-width:0"><h3>'+U.esc(o.t)+'</h3><div class="row" style="gap:6px">'+H.wayChip(o.way)+'<span class="chip">'+U.fmtDate(o.d)+'</span>'+(o.status === 'done' ? '<span class="chip ok">resolvida '+U.fmtDate(o.dd)+' · +40 XP</span>' : '')+'</div></div><button class="iconbtn" data-a="owDel" data-id="'+o.id+'" aria-label="Apagar quest">'+U.icon('trash')+'</button></div>'
      + (o.gap ? '<p class="dim" style="margin-top:10px;font-size:14px"><b>Lacuna:</b> '+U.esc(o.gap)+'</p>' : '')
      + (o.q ? '<div class="callout" style="margin-top:10px"><b>Missão:</b> '+U.esc(o.q)+'</div>' : '')
      + (o.g ? '<div class="callout gate" style="margin-top:8px"><b>Aprovação:</b> '+U.esc(o.g)+'</div>' : '')
      + (o.f ? '<div class="callout fail" style="margin-top:8px"><b>Falha:</b> '+U.esc(o.f)+'</div>' : '')
      + '<div class="seg" role="group" aria-label="Status" style="margin-top:10px">'+App.OWST.map(function(s){ return '<button class="'+(o.status === s[0] ? 'on' : '')+'" data-a="owSt" data-id="'+o.id+'" data-s="'+s[0]+'">'+s[1]+'</button>'; }).join('')+'</div></article>';
  }).join('');
  return form + (list.length ? '<div class="stack" style="gap:12px">'+cards+'</div>' : '<div class="empty">Nenhuma quest de Mundo Aberto. Todo projeto real tem pelo menos uma lacuna esperando virar XP.</div>');
};
App.I.owF = function(el){ App.ui.f.ow[el.getAttribute('data-k')] = el.value; };
App.C.owWay = function(el){ App.ui.f.ow.way = el.value; };
App.A.owAdd = function(){
  var f = App.ui.f.ow, J = App.J; App.ui.owErr = null;
  if (!f || (f.t || '').trim().length < 3) { App.toast({t:'Quest sem título', s:'Dê um nome para a lacuna.', ic:'alert'}); return; }
  J.open = J.open || [];
  if (J.open.length >= 60) { App.toast({t:'Limite de quests', s:'Apague quests resolvidas antigas para abrir espaço.', ic:'alert'}); return; }
  J.open.push({id:U.uid(), t:f.t.trim().slice(0,120), way:f.way, gap:(f.gap||'').slice(0,700), q:(f.q||'').slice(0,500), g:(f.g||'').slice(0,350), f:(f.fl||'').slice(0,350), status:'open', d:U.today(), dd:null});
  App.ui.f.ow = {t:'', way:f.way, gap:'', q:'', g:'', fl:''};
  App.commit(['journal']);
};
App.A.owSt = function(el){ var o = (App.J.open || []).filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; if (!o) return; var s = el.getAttribute('data-s'); if (o.status === s) return; o.status = s; o.dd = s === 'done' ? U.today() : null; App.commit(['journal']); if (s === 'done') App.toast({t:'Lacuna fechada', s:'+40 XP. Isso aqui é o jogo de verdade.', ic:'map'}); };
App.A.owDel = function(el){ App.ui.modal = {type:'confirm', title:'Apagar quest de Mundo Aberto?', body:'Se ela estava resolvida, os +40 XP saem do saldo.', danger:1, ok:'Apagar', act:'owDelDo', id:el.getAttribute('data-id')}; App.renderModal(); };
App.A.owDelDo = function(){ var id = App.ui.modal && App.ui.modal.id; App.J.open = (App.J.open || []).filter(function(x){ return x.id !== id; }); App.ui.modal = null; App.commit(['journal']); };

App.CERTST = [['','— sem plano —'],['study','Estudando'],['sched','Prova agendada'],['passed','Aprovado'],['fail','Não passou (ainda)']];
App.Q.certs = function(){
  var S = App.S, D = App.D;
  var intro = '<section class="win"><div class="win-h">'+U.icon('cert')+'Certificações</div><p class="dim" style="font-size:14px">Certificação valida vocabulário e fluência — não substitui os selos. Cada uma tem um <b>“não antes de”</b>: fazer a prova antes disso é comprar badge, não skill. Aprovação vale XP, +40 créditos, uma conquista épica e um título.</p></section>';
  return intro + '<div class="shop">' + SYS.CERTS.map(function(c){
    var st = S.certs[c.id] || {}, w = App.way(c.way), pri = {Alta:'warn', 'Média':'glow', Opcional:'', Alternativa:''}[c.pri] || '', a = E.ACHMAP['cert_'+c.id];
    return '<article class="item" style="--rc:'+w.color+'"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap;gap:10px"><div class="stack" style="gap:4px;min-width:0"><span class="in">'+U.esc(c.n)+'</span><div class="row" style="gap:6px"><span class="chip '+pri+'">prioridade '+U.esc(c.pri)+'</span>'+H.wayChip(c.way)+'</div></div>'+U.medal(a, {size:52, locked:!D.certPassed[c.id]})+'</div>'
      + '<dl class="kv" style="grid-template-columns:1fr;gap:2px;font-size:13.5px"><dt>Quando</dt><dd>'+U.esc(c.when)+'</dd><dt>Não antes de</dt><dd>'+U.esc(c.notBefore)+'</dd><dt>Preparação</dt><dd>'+U.esc(c.prep)+'</dd><dt>O que prova</dt><dd>'+U.esc(c.pass)+'</dd></dl>'
      + '<div class="row" style="gap:6px"><span class="chip glow">+'+c.xp+' XP</span><span class="chip">título: '+U.esc(c.title)+'</span></div>'
      + '<div class="grid g2" style="gap:8px"><label class="fld">Status<select data-c="certSt" data-id="'+c.id+'">'+App.CERTST.map(function(o){ return '<option value="'+o[0]+'"'+((st.s || '') === o[0] ? ' selected' : '')+'>'+o[1]+'</option>'; }).join('')+'</select></label><label class="fld">Data da prova<input type="date" data-c="certDate" data-id="'+c.id+'" value="'+U.esc(st.d || '')+'"></label></div>'
      + '<a class="btn sm ghost" href="'+U.esc(c.url)+'" target="_blank" rel="noopener noreferrer">'+U.icon('ext')+'Página oficial</a></article>';
  }).join('') + '</div>';
};
App.C.certSt = function(el){ var S = App.S, id = el.getAttribute('data-id'), rec = S.certs[id] = S.certs[id] || {}; rec.s = el.value || null; if (!rec.s && !rec.d) delete S.certs[id]; App.commit(['core']); if (el.value === 'passed') App.toast({t:'Certificação aprovada', s:'Badge merecido. Agora prove no mundo real.', ic:'cert'}); };
App.C.certDate = function(el){ var S = App.S, id = el.getAttribute('data-id'), rec = S.certs[id] = S.certs[id] || {}; rec.d = el.value || null; if (!rec.s && !rec.d) delete S.certs[id]; App.commit(['core'], {norender:true}); };

/* ---------- Portões ---------- */
App.gatesSeals = function(){
  var S = App.S, D = App.D;
  var ready = Object.keys(E.GATE).map(function(k){ return E.GATE[k]; }).filter(function(g){ return !(S.gates[g.id] && S.gates[g.id].done) && E.gateReady(S, g); });
  var h = '';
  h += '<section class="win"><div class="win-h">'+U.icon('seal')+'Selos por Caminho · '+D.gatesDone+'/'+D.gatesTotal+'</div><div class="stats">'
    + SYS.WAYS.map(function(w){ return '<div class="stat" style="--wc:'+w.color+'"><b>'+w.attr+'</b><span>'+U.esc(w.name)+'</span><em>'+D.wayGatesDone[w.id]+'/'+w.gates.length+(D.seals[w.id] ? ' <span class="faint" style="font-size:11px">('+D.seals[w.id]+' disp.)</span>' : '')+'</em></div>'; }).join('')
    + '</div><div class="callout" style="margin-top:12px;font-size:14px"><b>Regra do Portão:</b> “vi a matéria” não conta. Marque uma evidência só quando ela existe (link, arquivo, vídeo, repo). O Examinador treina sua defesa, mas quem assina o selo é você.</div></section>';
  if (ready.length) h += '<section class="win"><div class="win-h" style="color:var(--ok)">'+U.icon('gate')+'Prontos para defesa</div><div class="stack" style="gap:8px">'+ready.map(App.gateCard).join('')+'</div></section>';
  h += SYS.WAYS.map(function(w){
    return '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon(w.icon)+U.esc(w.name)+'<a class="act" href="#/caminhos/'+w.id+'">abrir caminho →</a></div><div class="stack" style="gap:8px">'
      + w.gates.map(function(g){ var a = E.ARC[g.way+':'+g.arc], lk = E.arcLocked(S, a) && !(S.gates[g.id] && S.gates[g.id].done); return (lk ? '<div style="opacity:.6">' : '<div>') + App.gateCard(g) + '</div>'; }).join('')
      + '</div></section>';
  }).join('');
  return h;
};
