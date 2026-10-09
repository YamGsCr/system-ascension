/* ===== VIEW: Caminhos, drawer de nó, selos ===== */
App.M = {};
App.V.caminhos = function(){
  var p = App.ui.param; if (p && App.way(p)) return App.V.way(p);
  var D = App.D;
  var h = '<section class="stack" style="gap:6px"><span class="eyebrow">Caminhos</span><h1>Sete dungeons. Uma vida.</h1><p class="lead">Cada nó separa <b>o que estudar</b>, <b>onde achar</b>, <b>livros & estudos</b>, a <b>missão prática</b>, a <b>condição de aprovação</b> e <b>como falha</b>. Os Selos fecham arcos; os bosses integram tudo.</p></section>';
  return h + '<div class="ways">' + SYS.WAYS.map(function(w){
    var ti = D.tier[w.id], pct = U.pct(D.wayDone[w.id], D.wayNodes[w.id]), np = ti.next ? U.pct(D.wayXP[w.id]-ti.floor, ti.next[0]-ti.floor) : 100;
    return '<a class="way" href="#/caminhos/'+w.id+'" style="--wc:'+w.color+'"><div class="row between"><span class="wi">'+U.icon(w.icon)+'</span><span class="chip" style="color:'+w.color+'">'+w.attr+' '+D.attr[w.id]+'</span></div>'
      + '<div><div class="pt">'+U.esc(w.pt)+'</div><h3>'+U.esc(w.name)+'</h3></div><p class="dim" style="font-size:13.5px">'+U.esc(w.tagline)+'</p>'
      + '<div class="meta"><span style="color:'+w.color+'">'+U.esc(ti.n)+'</span><span>'+U.num(D.wayXP[w.id])+' XP</span></div>'+H.bar(np,'way thin')
      + '<div class="meta"><span>'+D.wayDone[w.id]+'/'+D.wayNodes[w.id]+' nós · '+pct+'%</span><span>'+D.wayGatesDone[w.id]+'/'+w.gates.length+' selos</span></div></a>';
  }).join('') + '</div>';
};
App.gateCard = function(g){
  var S = App.S, rec = S.gates[g.id], done = !!(rec && rec.done), pr = E.gateProgress(S, g), ready = !done && pr.done === pr.total;
  return '<button class="gatecard'+(done ? ' done' : '')+'" data-a="openGate" data-id="'+g.id+'" style="text-align:left;color:inherit;cursor:pointer;width:100%">'
    + '<span style="color:'+(done ? 'var(--ok)' : 'var(--glow)')+'">'+U.icon(done ? 'seal' : 'gate')+'</span>'
    + '<span style="min-width:0"><b>'+U.esc(g.n)+'</b><br><span class="dim" style="font-size:13px">'+(done ? 'Conquistado em '+U.fmtDate(rec.done) : ready ? 'Arco completo — hora da defesa' : 'Arco: '+pr.done+'/'+pr.total+' nós')+'</span></span>'
    + '<span class="mono dim" style="font-size:11.5px;text-align:right">+'+g.xp+' XP<br>+1 selo</span></button>';
};
App.V.way = function(wid){
  var w = App.way(wid), S = App.S, D = App.D, ti = D.tier[wid], np = ti.next ? U.pct(D.wayXP[wid]-ti.floor, ti.next[0]-ti.floor) : 100;
  var head = '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'"><a href="#/caminhos" class="act" style="order:0;color:var(--dim)">← caminhos</a>'+U.esc(w.pt)+'</div>'
    + '<div class="whead"><span class="wi">'+U.icon(w.icon)+'</span><div class="stack" style="gap:8px;min-width:0"><h1>'+U.esc(w.name)+'</h1><p class="lead">'+U.esc(w.tagline)+'</p><p class="faint" style="font-size:13.5px;max-width:80ch">'+U.esc(w.lore)+'</p>'
    + '<div class="row" style="gap:6px"><span class="chip" style="color:'+w.color+'">'+w.attr+' · '+U.esc(w.attrName)+' '+D.attr[wid]+'</span><span class="chip">'+U.num(D.wayXP[wid])+' XP</span><span class="chip">'+U.num(D.wayCr[wid])+' '+w.cur.code+'</span><span class="chip">'+D.seals[wid]+' selos</span><span class="chip">'+D.wayDone[wid]+'/'+D.wayNodes[wid]+' nós</span></div>'
    + '<div class="stack" style="gap:4px;max-width:540px"><div class="row between mono" style="font-size:12px"><span style="color:'+w.color+'">'+U.esc(ti.n)+'</span><span class="dim">'+(ti.next ? 'próximo título: '+U.esc(ti.next[1])+' em '+U.num(ti.next[0])+' XP' : 'título máximo do Caminho')+'</span></div>'+H.bar(np,'way',w.color)+'</div>'
    + '<div class="row"><a class="btn sm" href="#/lojas/'+wid+'">'+U.icon('bag')+'Loja '+w.cur.code+'</a><a class="btn sm ghost" href="#/biblioteca/'+wid+'">'+U.icon('book')+'Livros do Caminho</a>'+(E.nextNode(S, wid) ? '<button class="btn sm primary" data-a="openNode" data-id="'+E.nextNode(S, wid).id+'">'+U.icon('sword')+'Continuar</button>' : '')+'</div></div></div></section>';
  var arcs = w.arcs.map(function(a){
    var locked = E.arcLocked(S, a), dn = a.nodes.filter(function(n){ return H.st(n.id) === 'done'; }).length;
    return '<section class="arc"><div class="arc-h"><div class="stack" style="gap:2px;min-width:0"><span class="eyebrow" style="color:'+w.color+'">'+U.esc(a.wk)+(a.side ? ' · arco lateral' : '')+'</span><h3>'+U.esc(a.n)+'</h3><span class="sub">'+U.esc(a.sub)+'</span></div><div class="row" style="gap:6px">'+(locked ? '<span class="chip bad">'+U.icon('lock')+'Travado</span>' : '')+'<span class="chip">'+dn+'/'+a.nodes.length+'</span></div></div>'
      + (locked ? '<div class="callout fail" style="font-size:13.5px">Conquiste <b>'+U.esc(E.GATE[a.needGate].n)+'</b> para abrir este arco. “Vi a matéria” não conta.</div>' : '')
      + a.nodes.map(H.nodeRow).join('') + (a.gate ? App.gateCard(a.gate) : '') + '</section>';
  }).join('');
  var lv = '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('star')+'Níveis de skill</div>'
    + E.discLevels(S, D, wid).map(function(l){ return '<div class="disc" title="'+l.done+'/'+l.tot+' nós · '+SYS.DISC_LV[l.lv]+'"><span>'+U.esc(l.d)+'</span><div class="lvdots">'+[1,2,3,4,5].map(function(i){ return '<i class="'+(l.lv >= i ? 'on' : '')+'"></i>'; }).join('')+'</div><b>Lv '+l.lv+'</b></div>'; }).join('')
    + '<p class="faint mono" style="font-size:11px;margin-top:8px">Lv1 começou · Lv2 40% · Lv3 70% · Lv4 100% · Lv5 100% + selo do arco</p></section>';
  var tiers = '<section class="win"><div class="win-h">'+U.icon('banner')+'Títulos do Caminho</div>'
    + w.tiers.map(function(t){ var got = D.wayXP[wid] >= t[0]; return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto"><span style="color:'+(got ? 'var(--ok)' : 'var(--faint)')+'">'+U.icon(got ? 'check' : 'lock')+'</span><span style="'+(got ? '' : 'color:var(--faint)')+'">'+U.esc(t[1])+'</span><b>'+U.num(t[0])+' XP</b></div>'; }).join('') + '</section>';
  return head + '<div class="grid waygrid" style="grid-template-columns:minmax(0,1fr) 320px;align-items:start"><div class="stack" style="gap:20px">'+arcs+'</div><div class="stack waysticky" style="gap:16px">'+lv+tiers+'</div></div>';
};

/* ---------- drawer ---------- */
App.renderDrawer = function(){
  var dr = App.$('drawer'), u = App.ui.drawer; App.renderScrim();
  if (!u) { dr.classList.remove('on'); dr.setAttribute('aria-hidden', 'true'); dr.removeAttribute('data-k'); return; }
  var key = u.type + ':' + u.id + ':' + (u.tab || ''), same = dr.getAttribute('data-k') === key;
  var ob = dr.querySelector('.dr-body'), sc = ob ? ob.scrollTop : 0;
  dr.innerHTML = u.type === 'node' ? App.nodeDrawer(u) : u.type === 'exam' ? App.examDrawer(u) : '';
  dr.classList.add('on'); dr.setAttribute('aria-hidden', 'false'); dr.setAttribute('data-k', key);
  var nb = dr.querySelector('.dr-body'); if (nb && same) nb.scrollTop = sc;
};
App.nodeDrawer = function(u){
  var n = E.NODE[u.id], w = App.way(n.way), arc = E.arcOf(n), S = App.S, st = H.st(n.id);
  var tabs = [['missao','Missão'],['estudar','O que estudar'],['onde','Onde achar'],['livros','Livros & estudos'],['exam','Examinador'],['notas','Notas']];
  var head = '<div class="dr-head" style="--wc:'+w.color+'"><div class="dr-top"><div class="stack" style="gap:6px;min-width:0"><span class="eyebrow" style="color:'+w.color+'">'+U.esc(w.name)+' · '+U.esc(arc.n)+'</span><h2>'+U.esc(n.t)+'</h2>'
    + '<div class="row" style="gap:6px"><span class="chip">'+U.esc(n.id)+'</span>'+(n.w ? '<span class="chip">Semana '+n.w+'</span>' : '')+'<span class="chip">'+U.esc(n.d)+'</span>'+(n.boss ? '<span class="chip boss">'+U.icon('sword')+(n.final ? 'Final Boss' : 'Boss')+'</span>' : '')+H.stChip(st)+'<span class="chip glow">'+H.rew(n.xp, n.cr, n.way)+'</span></div></div>'
    + '<button class="iconbtn" data-a="closeAll" aria-label="Fechar">'+U.icon('close')+'</button></div>'
    + '<div class="tabs" role="tablist">'+tabs.map(function(t){ return '<button role="tab" aria-selected="'+(u.tab === t[0])+'" class="'+(u.tab === t[0] ? 'on' : '')+'" data-a="drTab" data-tab="'+t[0]+'">'+t[1]+'</button>'; }).join('')+'</div></div>';
  var b = '';
  if (u.tab === 'missao') b = App.nodeMission(n);
  else if (u.tab === 'estudar') b = App.nodeStudy(n);
  else if (u.tab === 'onde') b = App.nodeWhere(n);
  else if (u.tab === 'livros') b = App.nodeBooks(n);
  else if (u.tab === 'exam') b = App.examPanel({kind:'node', id:n.id});
  else b = App.nodeNotes(n);
  return head + '<div class="dr-body">'+b+'</div>';
};
App.nodeLockMsg = function(n){
  var S = App.S, arc = E.arcOf(n), msgs = [];
  if (E.arcLocked(S, arc)) msgs.push('Conquiste <b>'+U.esc(E.GATE[arc.needGate].n)+'</b> para abrir este arco.');
  (n.req || []).forEach(function(g){ if (!(S.gates[g] && S.gates[g].done) && !S.settings.openWorld) msgs.push('Requer o selo <b>'+U.esc(E.GATE[g].n)+'</b>.'); });
  return msgs;
};
App.nodeMission = function(n){
  var S = App.S, w = App.way(n.way), st = H.st(n.id), locks = App.nodeLockMsg(n), rec = S.nodes[n.id], note = App.N.n[n.id] || {};
  var tb = n.tb || ('Explique “'+n.t+'” para alguém inteligente que não é da área, em 5 minutos, incluindo quando isso dá errado.');
  var seg = '<div class="seg" role="group" aria-label="Status">'+['todo','doing','review','done'].map(function(s){ return '<button class="'+(st === s ? 'on' : '')+'" data-a="setStatus" data-id="'+n.id+'" data-s="'+s+'"'+(locks.length ? ' disabled' : '')+'>'+H.stLabel[s]+'</button>'; }).join('')+'</div>';
  var achRow = n.ach ? '<div class="row" style="gap:10px">'+U.medal(E.ACHMAP['n_'+n.id], {size:52, locked:st !== 'done'})+'<div class="stack" style="gap:2px"><span class="eyebrow">Conquista e título ao completar</span><b>'+U.esc(n.ach)+'</b></div></div>' : '';
  return '<p class="lead" style="color:var(--text)">'+U.esc(n.s)+'</p>'
    + (locks.length ? '<div class="callout fail">'+U.icon('lock')+' '+locks.join(' ')+' <span class="dim">Você pode ler tudo, mas a quest só avança depois do selo. (Mundo Aberto no Perfil remove travas.)</span></div>' : '')
    + '<div class="stack" style="gap:8px"><span class="eyebrow">Status da quest</span>'+seg+(rec && rec.d0 ? '<span class="faint mono" style="font-size:11.5px">Iniciada em '+U.fmtDate(rec.d0)+(rec.d1 ? ' · concluída em '+U.fmtDate(rec.d1) : '')+'</span>' : '')+'</div>'
    + '<div class="callout"><h4 style="margin-bottom:6px">Missão prática</h4>'+U.esc(n.q)+'</div>'
    + '<dl class="kv"><dt>Entregável</dt><dd>'+U.esc(n.dv)+'</dd><dt>Recompensa</dt><dd>'+H.rew(n.xp, n.cr, n.way)+(n.ach ? ' · conquista “'+U.esc(n.ach)+'”' : '')+'</dd>'+(note.ev ? '<dt>Evidência</dt><dd>'+(/^https?:\/\//.test(note.ev) ? '<a href="'+U.esc(note.ev)+'" target="_blank" rel="noopener noreferrer">'+U.esc(note.ev)+'</a>' : U.esc(note.ev))+'</dd>' : '')+'</dl>'
    + '<div class="callout gate"><h4 style="margin-bottom:6px">Condição de aprovação</h4>'+U.esc(n.g)+'</div>'
    + '<div class="callout fail"><h4 style="margin-bottom:6px">Como falha · armadilhas</h4>'+U.esc(n.f)+'</div>'
    + '<div class="callout"><h4 style="margin-bottom:6px">Teach-back</h4>'+U.esc(tb)+'<div style="margin-top:8px"><button class="btn sm" data-a="drTab" data-tab="exam">'+U.icon('oracle')+'Levar ao Examinador</button></div></div>'
    + achRow
    + App.nodeNav(n);
};
App.nodeNav = function(n){
  var arc = E.arcOf(n), i = arc.nodes.indexOf(n), prev = arc.nodes[i-1], next = arc.nodes[i+1];
  return '<div class="row between" style="margin-top:6px">'+(prev ? '<button class="btn sm ghost" data-a="openNode" data-id="'+prev.id+'">'+U.icon('back')+U.esc(prev.id)+'</button>' : '<span></span>')+(next ? '<button class="btn sm ghost" data-a="openNode" data-id="'+next.id+'">'+U.esc(next.id)+U.icon('chev')+'</button>' : '<span></span>')+'</div>';
};
App.nodeStudy = function(n){
  var note = App.N.n[n.id] || {}, ch = note.st || [], w = App.way(n.way), done = n.st.filter(function(_, i){ return ch.indexOf(i) >= 0; }).length;
  return '<div class="stack" style="gap:6px"><div class="row between"><span class="eyebrow">O que devo estudar</span><span class="mono dim" style="font-size:12px">'+done+'/'+n.st.length+' tópicos</span></div>'+H.bar(U.pct(done, n.st.length))+'</div>'
    + '<div class="stack" style="gap:0">'+n.st.map(function(s, i){ return '<label class="check"><input type="checkbox" data-c="studyTick" data-id="'+n.id+'" data-i="'+i+'"'+(ch.indexOf(i) >= 0 ? ' checked' : '')+'><span>'+U.esc(s)+'</span></label>'; }).join('')+'</div>'
    + '<div class="callout"><h4 style="margin-bottom:6px">Critérios do '+U.esc(w.name)+'</h4><ul class="list">'+w.checks.map(function(c){ return '<li><span>'+U.esc(c)+'</span></li>'; }).join('')+'</ul></div>'
    + '<p class="faint" style="font-size:13px">Dica do Sistema: marque um tópico só quando conseguir explicá-lo sem olhar. Reler não é aprender — teste-se (Mind Way · P11).</p>';
};
App.RESICON = {doc:'book', curso:'scroll', 'vídeo':'wave', artigo:'journal', ferramenta:'sparkle', site:'map', 'livro grátis':'book', podcast:'wave', comunidade:'user'};
App.nodeWhere = function(n){
  var list = n.wh || [];
  if (!list.length) return '<div class="empty">Este nó é integrador: os recursos estão nos nós anteriores do arco. Use o Examinador para ensaiar a defesa.</div>';
  return '<div class="stack" style="gap:6px"><span class="eyebrow">Onde acho isso</span><p class="faint" style="font-size:13px">Fontes oficiais e gratuitas primeiro. Vídeos apontam para uma busca no YouTube (links sempre válidos).</p></div>'
    + '<div class="stack" style="gap:6px">'+list.map(function(r){
      return '<a class="res" href="'+U.esc(r[1])+'" target="_blank" rel="noopener noreferrer"><span class="dim">'+U.icon(App.RESICON[r[2]] || 'ext')+'</span><span style="min-width:0"><span style="font-weight:600">'+U.esc(r[0])+'</span><br><span class="ty">'+U.esc(r[2])+' · '+U.esc(r[3])+'</span></span><span class="dim">'+U.icon('ext')+'</span></a>'; }).join('')+'</div>';
};
App.BOOKST = [['want','Quero ler'],['reading','Lendo'],['read','Lido'],['drop','Largado']];
App.bookCard = function(k, detail, compact, extra){
  var L = SYS.LIB[k]; if (!L) return '';
  var b = App.S.books[k] || {}, w = App.way(L.w);
  return '<div class="bookc" style="border-left:3px solid '+(w ? w.color : 'var(--line2)')+'"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap"><div style="min-width:0"><div class="bt">'+U.esc(L.t)+'</div><div class="ba">'+U.esc(L.a)+' · '+U.esc(L.y)+'</div>'+(L.pt ? '<div class="ba">🇧🇷 '+U.esc(L.pt)+'</div>' : '')+'</div>'+(L.u ? '<a class="chip ok" href="'+U.esc(L.u)+'" target="_blank" rel="noopener noreferrer" style="text-decoration:none">grátis '+U.icon('ext')+'</a>' : '')+'</div>'
    + (detail ? '<div><span class="eyebrow" style="letter-spacing:.1em">Leia aqui</span> '+U.esc(detail)+'</div>' : '')
    + (compact ? '' : '<div class="dim" style="font-size:13.5px">'+U.esc(L.note)+'</div>')
    + (extra || '')
    + '<div class="row" style="gap:8px"><select data-c="bookSt" data-k="'+k+'" aria-label="Status do livro" style="width:auto;min-height:32px;padding:4px 8px">'+'<option value="">— status —</option>'+App.BOOKST.map(function(s){ return '<option value="'+s[0]+'"'+(b.s === s[0] ? ' selected' : '')+'>'+s[1]+'</option>'; }).join('')+'</select>'
    + '<label class="check" style="padding:0"><input type="checkbox" data-c="bookAp" data-k="'+k+'"'+(b.ap ? ' checked' : '')+'><span style="font-size:13.5px">Apliquei (ADR, nota de ofício, decisão)</span></label>'
    + (b.s === 'read' && b.ap ? '<span class="chip ok">+25 XP · +8</span>' : '')+'</div></div>';
};
App.nodeBooks = function(n){
  var bk = n.bk || [];
  return '<div class="stack" style="gap:6px"><span class="eyebrow">Livros & estudos</span><p class="faint" style="font-size:13px">Livro entra quando o contexto existe. Marcar como <b>Lido + Aplicado</b> vale +25 XP e +8 créditos no Caminho do livro.</p></div>'
    + (bk.length ? '<div class="stack" style="gap:8px">'+bk.map(function(x){ return App.bookCard(x[0], x[1]); }).join('')+'</div>' : '<div class="empty">Sem livro obrigatório neste nó: a fonte é a documentação oficial (aba Onde achar) e a prática.</div>');
};
App.nodeNotes = function(n){
  var note = App.N.n[n.id] || {};
  return '<label class="fld">Notas da quest<textarea data-i="nodeNote" data-id="'+n.id+'" rows="10" maxlength="3000" placeholder="Rascunho, decisões, dúvidas, links…">'+U.esc(note.t || '')+'</textarea></label>'
    + '<label class="fld">Evidência (link do repo, doc, vídeo ou arquivo)<input type="text" data-i="nodeEv" data-id="'+n.id+'" value="'+U.esc(note.ev || '')+'" placeholder="https://…"></label>'
    + '<p class="faint mono" style="font-size:11.5px">Salvo automaticamente no seu save privado.</p>';
};

App.A.openNode = function(el){ var id = el.getAttribute('data-id'); App.ui.modal = null; App.ui.drawer = {type:'node', id:id, tab:'missao'}; App.renderModal(); App.renderDrawer(); var b = App.$('drawer').querySelector('.dr-body'); if (b) b.scrollTop = 0; };
App.A.drTab = function(el){ if (!App.ui.drawer) return; App.ui.drawer.tab = el.getAttribute('data-tab'); App.renderDrawer(); var b = App.$('drawer').querySelector('.dr-body'); if (b) b.scrollTop = 0; };
App.A.setStatus = function(el){
  var id = el.getAttribute('data-id'), s = el.getAttribute('data-s'), S = App.S, cur = H.st(id), n = E.NODE[id];
  if (App.nodeLockMsg(n).length) return;
  if (s === cur) return;
  if (s === 'done') { App.ui.modal = {type:'done', id:id, checks:[], ev:(App.N.n[id] || {}).ev || ''}; App.renderModal(); return; }
  if (cur === 'done') { App.ui.modal = {type:'undo', id:id, to:s}; App.renderModal(); return; }
  if (s === 'todo') delete S.nodes[id]; else S.nodes[id] = {s:s, d0:(S.nodes[id] && S.nodes[id].d0) || U.today()};
  App.commit(['core']);
};
App.M.done = function(m){
  var n = E.NODE[m.id], w = App.way(n.way), all = w.checks.every(function(_, i){ return m.checks[i]; });
  return '<section class="win"><div class="win-h">'+U.icon('check')+'[Sistema] Verificação de conclusão</div><div class="stack"><h3>'+U.esc(n.t)+'</h3><p class="dim">Conquistas são evidência, não participação. Confirme:</p>'
    + w.checks.map(function(c, i){ return '<label class="check"><input type="checkbox" data-c="doneCheck" data-i="'+i+'"'+(m.checks[i] ? ' checked' : '')+'><span>'+U.esc(c)+'</span></label>'; }).join('')
    + '<div class="callout gate" style="font-size:14px"><b>Condição:</b> '+U.esc(n.g)+'</div>'
    + '<label class="fld">Evidência (opcional)<input type="text" data-i="doneEv" value="'+U.esc(m.ev || '')+'" placeholder="link ou descrição curta"></label>'
    + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn primary" data-a="confirmDone"'+(all ? '' : ' disabled')+'>'+U.icon('check')+'Concluir quest</button></div></div></section>';
};
App.M.undo = function(m){
  var n = E.NODE[m.id];
  return '<section class="win"><div class="win-h" style="color:var(--warn)">'+U.icon('alert')+'Reverter conclusão</div><div class="stack"><h3>'+U.esc(n.t)+'</h3><p class="dim">O XP e os créditos deste nó saem do saldo. Conquistas já desbloqueadas continuam registradas. Honestidade também é stat.</p><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn danger" data-a="confirmUndo">Reverter para “'+H.stLabel[m.to]+'”</button></div></div></section>';
};
App.C.doneCheck = function(el){ var m = App.ui.modal; if (!m) return; m.checks[+el.getAttribute('data-i')] = el.checked; var btn = App.$('modal').querySelector('[data-a="confirmDone"]'); var w = App.way(E.NODE[m.id].way); if (btn) btn.disabled = !w.checks.every(function(_, i){ return m.checks[i]; }); };
App.I.doneEv = function(el){ if (App.ui.modal) App.ui.modal.ev = el.value; };
App.A.closeModal = function(){ App.ui.modal = null; App.renderModal(); };
App.A.confirmDone = function(){
  var m = App.ui.modal, S = App.S, n = E.NODE[m.id], w = App.way(n.way), t = U.today();
  S.nodes[n.id] = {s:'done', d0:(S.nodes[n.id] && S.nodes[n.id].d0) || t, d1:t};
  if (m.ev) { App.N.n[n.id] = App.N.n[n.id] || {}; App.N.n[n.id].ev = m.ev; }
  App.ui.modal = null;
  App.commit(m.ev ? ['core','notes'] : ['core']);
  App.toast({t:(n.boss ? 'Boss derrotado · ' : 'Quest concluída · ') + n.id, s:U.pick(SYS.VOICE.node) + ' +' + n.xp + ' XP · +' + n.cr + ' ' + w.cur.code, ic:n.boss ? 'sword' : 'check'});
};
App.A.confirmUndo = function(){
  var m = App.ui.modal, S = App.S;
  if (m.to === 'todo') delete S.nodes[m.id]; else S.nodes[m.id] = {s:m.to, d0:(S.nodes[m.id] && S.nodes[m.id].d0) || U.today()};
  App.ui.modal = null; App.commit(['core']); App.toast({t:'Status revertido', s:U.pick(SYS.VOICE.undo), ic:'back'});
};
App.C.studyTick = function(el){
  var id = el.getAttribute('data-id'), i = +el.getAttribute('data-i'), N = App.N; var note = N.n[id] = N.n[id] || {}; var a = note.st = note.st || [];
  var k = a.indexOf(i); if (el.checked && k < 0) a.push(i); if (!el.checked && k >= 0) a.splice(k, 1);
  Store.save(['notes']); App.renderDrawer();
};
App.I.nodeNote = function(el){ var id = el.getAttribute('data-id'); var note = App.N.n[id] = App.N.n[id] || {}; note.t = el.value.slice(0, 3000); App.debSave('notes'); };
App.I.nodeEv = function(el){ var id = el.getAttribute('data-id'); var note = App.N.n[id] = App.N.n[id] || {}; note.ev = el.value.slice(0, 500); App.debSave('notes'); };
App._deb = {};
App.debSave = function(doc){ clearTimeout(App._deb[doc]); App._deb[doc] = setTimeout(function(){ Store.save([doc]); }, 700); };
App.C.bookSt = function(el){ var k = el.getAttribute('data-k'), S = App.S; var b = S.books[k] = S.books[k] || {}; b.s = el.value || null; if (b.s === 'read' && !b.d) b.d = U.today(); if (!b.s && !b.ap) delete S.books[k]; App.commit(['core']); };
App.C.bookAp = function(el){ var k = el.getAttribute('data-k'), S = App.S; var b = S.books[k] = S.books[k] || {}; b.ap = el.checked; App.commit(['core']); };

/* ---------- selos ---------- */
App.A.openGate = function(el){ App.ui.drawer = null; App.ui.modal = {type:'gate', id:el.getAttribute('data-id')}; App.renderDrawer(); App.renderModal(); };
App.M.gate = function(m){
  var g = E.GATE[m.id], w = App.way(g.way), S = App.S, rec = S.gates[g.id] || {}, done = !!rec.done, pr = E.gateProgress(S, g), ev = rec.ev || [], ach = E.ACHMAP[g.ach], meta = SYS.GATEACH[g.ach] || {};
  var allEv = g.ev.every(function(_, i){ return ev[i]; }), can = !done && pr.done === pr.total && allEv;
  return '<section class="win wide" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('gate')+U.esc(w.name)+'<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack">'
    + '<div class="row between" style="align-items:flex-start;flex-wrap:nowrap;gap:14px"><div class="stack" style="gap:4px;min-width:0"><h2>'+U.esc(g.n)+'</h2><span class="dim">Arco '+U.esc(E.ARC[g.way+':'+g.arc].n)+' — '+pr.done+'/'+pr.total+' nós completos</span></div>'+U.medal(ach, {size:84, locked:!done})+'</div>'
    + H.bar(U.pct(pr.done, pr.total))
    + '<h4>Evidências exigidas</h4><div class="stack" style="gap:0">'+g.ev.map(function(e, i){ return '<label class="check"><input type="checkbox" data-c="gateEv" data-id="'+g.id+'" data-i="'+i+'"'+(ev[i] ? ' checked' : '')+(done ? ' disabled' : '')+'><span>'+U.esc(e)+'</span></label>'; }).join('')+'</div>'
    + '<div class="callout"><b>Checagem oral:</b> '+U.esc(g.oral)+'</div><div class="callout fail"><b>Checagem de falha:</b> '+U.esc(g.fail)+'</div>'
    + '<div class="row" style="gap:6px"><span class="chip glow">+'+g.xp+' XP</span><span class="chip">+'+ach.cr+' '+w.cur.code+'</span><span class="chip">+1 selo</span>'+(meta.title ? '<span class="chip">título: '+U.esc(meta.title)+'</span>' : '')+'<span class="chip">conquista: '+U.esc(ach.n)+'</span></div>'
    + '<div class="row between"><button class="btn" data-a="examGate" data-id="'+g.id+'">'+U.icon('oracle')+'Treinar a defesa com o Examinador</button>'
    + (done ? '<div class="row"><span class="chip ok">'+U.icon('seal')+'conquistado em '+U.fmtDate(rec.done)+'</span><button class="btn sm danger" data-a="gateUndo" data-id="'+g.id+'">Revogar</button></div>' : '<button class="btn primary" data-a="claimGate" data-id="'+g.id+'"'+(can ? '' : ' disabled')+'>'+U.icon('seal')+'Conquistar selo</button>')+'</div>'
    + (!done && !can ? '<p class="faint mono" style="font-size:11.5px;text-align:right">'+(pr.done < pr.total ? 'Complete todos os nós do arco' : 'Marque todas as evidências')+' para liberar.</p>' : '')
    + '</div></section>';
};
App.C.gateEv = function(el){ var id = el.getAttribute('data-id'), i = +el.getAttribute('data-i'), S = App.S; var rec = S.gates[id] = S.gates[id] || {ev:[]}; rec.ev = rec.ev || []; rec.ev[i] = el.checked; App.commit(['core']); };
App.A.claimGate = function(el){
  var id = el.getAttribute('data-id'), g = E.GATE[id], S = App.S, rec = S.gates[id] = S.gates[id] || {ev:[]};
  if (!E.gateReady(S, g) || !g.ev.every(function(_, i){ return rec.ev && rec.ev[i]; })) return;
  rec.done = U.today(); App.ui.modal = null; App.commit(['core']);
  App.toast({t:'Portão conquistado · ' + g.n, s:U.pick(SYS.VOICE.gate) + ' +' + g.xp + ' XP · +1 selo', ic:'seal', ms:5600});
};
App.A.gateUndo = function(el){ var id = el.getAttribute('data-id'), rec = App.S.gates[id]; if (rec) { delete rec.done; } App.commit(['core']); };
