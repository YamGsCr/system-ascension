/* ===== VIEW: Biblioteca, Diário ===== */
App.V.biblioteca = function(){
  var S = App.S, p = App.ui.param, wid = App.way(p) ? p : 'todos', st = App.ui.f.libSt || 'all';
  var keys = Object.keys(SYS.LIB), cnt = {read:0, reading:0, want:0, ap:0};
  keys.forEach(function(k){ var b = S.books[k]; if (!b) return; if (b.s && cnt[b.s] != null) cnt[b.s]++; if (b.s === 'read' && b.ap) cnt.ap++; });
  var tabs = [['todos','Todos','book',keys.length]].concat(SYS.WAYS.map(function(w){ return [w.id, w.cur.code, w.icon, keys.filter(function(k){ return SYS.LIB[k].w === w.id; }).length]; }));
  var h = H.head('Arquivo', 'Biblioteca', keys.length+' livros e estudos curados, cada um ligado às quests onde entra. Regra: livro entra quando o contexto existe. <b>Lido + Aplicado</b> (ADR, nota de ofício, decisão real) vale +25 XP e +8 créditos.');
  h += '<div class="kpis"><div class="kpi"><b>'+cnt.ap+'</b><span>lidos + aplicados</span></div><div class="kpi"><b>'+cnt.read+'</b><span>lidos</span></div><div class="kpi"><b>'+cnt.reading+'</b><span>lendo agora</span></div><div class="kpi"><b>'+cnt.want+'</b><span>na fila</span></div></div>';
  h += H.tabs('biblioteca', tabs, wid);
  h += '<div class="grid" style="grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:end"><label class="fld">Buscar título, autor ou tema<input type="text" data-i="libQ" value="'+U.esc(App.ui.f.libQ || '')+'" placeholder="Ex.: Kleppmann, Jung, jungle, estoicismo…"></label>'
    + '<div class="seg" role="group" aria-label="Status">'+[['all','Todos'],['want','Quero'],['reading','Lendo'],['read','Lidos'],['ap','Aplicados'],['none','Sem status']].map(function(o){ return '<button class="'+(st === o[0] ? 'on' : '')+'" data-a="libSt" data-s="'+o[0]+'">'+o[1]+'</button>'; }).join('')+'</div></div>';
  return h + '<div class="stack" style="gap:8px" id="libList">'+App.libList(wid)+'</div>';
};
App.libList = function(wid){
  var S = App.S, q = U.slug(App.ui.f.libQ || ''), st = App.ui.f.libSt || 'all';
  var keys = Object.keys(SYS.LIB).filter(function(k){
    var L = SYS.LIB[k], b = S.books[k] || {};
    if (wid !== 'todos' && L.w !== wid) return false;
    if (st === 'ap' ? !(b.s === 'read' && b.ap) : st === 'none' ? !!b.s : st !== 'all' && b.s !== st) return false;
    if (q && U.slug([L.t, L.a, L.pt || '', L.note].join(' ')).indexOf(q) < 0) return false;
    return true;
  });
  var rank = {reading:0, want:1, read:2, drop:3};
  keys.sort(function(a, b){ var ba = S.books[a] || {}, bb = S.books[b] || {}; var ra = ba.s != null ? rank[ba.s] : 4, rb = bb.s != null ? rank[bb.s] : 4; return ra - rb || SYS.LIB[a].t.localeCompare(SYS.LIB[b].t); });
  if (!keys.length) return '<div class="empty">Nenhum livro com esses filtros.</div>';
  return keys.map(function(k){
    var uses = (E.BOOKUSE[k] || []).map(function(id){ return E.NODE[id]; }).filter(Boolean);
    var extra = uses.length ? '<div class="row" style="gap:6px"><span class="eyebrow" style="letter-spacing:.1em">Usado em</span>'+uses.slice(0, 8).map(function(n){ return '<button class="chip" data-a="openNode" data-id="'+n.id+'" style="cursor:pointer;color:'+App.way(n.way).color+'" title="'+U.esc(n.t)+'">'+U.esc(n.id)+'</button>'; }).join('')+(uses.length > 8 ? '<span class="chip">+'+(uses.length-8)+'</span>' : '')+'</div>' : '<div class="faint" style="font-size:12.5px">Leitura de apoio do Caminho (sem quest específica).</div>';
    return App.bookCard(k, null, false, extra);
  }).join('');
};
App.I.libQ = function(el){ App.ui.f.libQ = el.value; clearTimeout(App._libT); App._libT = setTimeout(function(){ var box = App.$('libList'); if (box) box.innerHTML = App.libList(App.way(App.ui.param) ? App.ui.param : 'todos'); }, 180); };
App.A.libSt = function(el){ App.ui.f.libSt = el.getAttribute('data-s'); App.renderView(); };

/* ---------- Diário ---------- */
App.weekStats = function(wk){
  var S = App.S, end = U.addDays(wk, 6), inR = function(d){ return d && d >= wk && d <= end; };
  var nodes = Object.keys(S.nodes).filter(function(id){ return S.nodes[id].s === 'done' && inR(S.nodes[id].d1) && E.NODE[id]; });
  var days = 0, rest = 0; for (var i = 0; i < 7; i++) { var r = S.daily[U.addDays(wk, i)]; if (r && r.rest) rest++; else if (E.dayComplete(r)) days++; }
  return {nodes:nodes, xp:nodes.reduce(function(s, id){ return s + E.NODE[id].xp; }, 0), days:days, rest:rest, side:S.sideq.filter(function(q){ return inR(q.done); }).length, buys:S.buys.filter(function(b){ return inR(b.d); }).length};
};
App.V.diario = function(){
  var tab = App.ui.param || 'semana', J = App.J;
  var wk = Object.keys(J.weeks).filter(function(k){ return J.weeks[k].cleared; }).length, mo = Object.keys(J.months).filter(function(k){ return J.months[k].done; }).length;
  var h = H.head('Registro do jogador', 'Diário', 'Domingo: fechar a semana em 15 minutos. Fim do mês: a reunião consigo mesmo. É aqui que o grind vira aprendizado. Semana fechada = +50 ◆ e +30 XP; revisão mensal = +100 ◆ e +60 XP.');
  h += H.tabs('diario', [['semana','Semana','pen',wk],['mes','Mês','journal',mo],['historico','Histórico','scroll']], tab);
  return h + (tab === 'mes' ? App.diaMonth() : tab === 'historico' ? App.diaHist() : App.diaWeek());
};
App.diaWeek = function(){
  var J = App.J, cur = U.weekKey(U.today()), wk = App.ui.f.wk && App.ui.f.wk <= cur ? App.ui.f.wk : cur, rec = J.weeks[wk] || {}, st = App.weekStats(wk), filled = SYS.WEEKLY.filter(function(f){ return (rec[f.k] || '').trim().length >= 8; }).length;
  var nav = '<div class="row between"><button class="btn sm ghost" data-a="wkNav" data-d="-7">'+U.icon('back')+'Anterior</button><div class="stack" style="gap:0;text-align:center"><b>Semana de '+U.fmtDate(wk)+'</b><span class="faint mono" style="font-size:11px">até '+U.fmtDate(U.addDays(wk, 6))+(wk === cur ? ' · atual' : '')+'</span></div><button class="btn sm ghost" data-a="wkNav" data-d="7"'+(wk >= cur ? ' disabled' : '')+'>Próxima'+U.icon('chev')+'</button></div>';
  var stats = '<div class="kpis" style="margin-top:12px"><div class="kpi"><b>'+st.nodes.length+'</b><span>nós concluídos</span></div><div class="kpi"><b>'+st.xp+'</b><span>XP de nós</span></div><div class="kpi"><b>'+st.days+'/7</b><span>dias com diárias</span></div><div class="kpi"><b>'+st.rest+'</b><span>descansos</span></div><div class="kpi"><b>'+st.side+'</b><span>laterais</span></div></div>'
    + (st.nodes.length ? '<div class="row" style="gap:6px;margin-top:8px">'+st.nodes.map(function(id){ return '<button class="chip" data-a="openNode" data-id="'+id+'" style="cursor:pointer;color:'+App.way(E.NODE[id].way).color+'">'+id+'</button>'; }).join('')+'</div>' : '');
  var ro = !!rec.cleared;
  var fields = SYS.WEEKLY.map(function(f){ return '<label class="fld">'+U.esc(f.n)+'<textarea data-i="wkF" data-k="'+f.k+'" rows="2" maxlength="500" placeholder="'+U.esc(f.ph)+'"'+(ro ? ' readonly' : '')+'>'+U.esc(rec[f.k] || '')+'</textarea></label>'; }).join('')
    + '<label class="fld">Missão da próxima semana<textarea data-i="wkF" data-k="next" rows="2" maxlength="300" placeholder="Um nó, uma evidência, um boss."'+(ro ? ' readonly' : '')+'>'+U.esc(rec.next || '')+'</textarea></label>'
    + '<label class="check"><input type="checkbox" data-c="wkGrass"'+(rec.grass ? ' checked' : '')+(ro ? ' disabled' : '')+'><span>Toquei grama esta semana (algo humano, inútil e bom).</span></label>';
  var foot = ro ? '<div class="row between"><span class="chip ok">'+U.icon('check')+'semana fechada em '+U.fmtDate(rec.cleared)+' · +50 ◆ +30 XP</span><button class="btn sm ghost" data-a="wkReopen">Reabrir</button></div>'
    : '<div class="row between"><span class="faint mono" style="font-size:11.5px">'+filled+'/'+SYS.WEEKLY.length+' campos preenchidos (mínimo 3)</span><button class="btn primary" data-a="wkClose"'+(filled >= 3 ? '' : ' disabled')+'>'+U.icon('check')+'Fechar semana</button></div>';
  return '<section class="win"><div class="win-h">'+U.icon('pen')+'Revisão semanal</div>'+nav+stats+'</section><section class="win"><div class="stack" style="gap:10px">'+fields+foot+'</div></section>';
};
App.I.wkF = function(el){ var J = App.J, cur = U.weekKey(U.today()), wk = App.ui.f.wk && App.ui.f.wk <= cur ? App.ui.f.wk : cur, rec = J.weeks[wk] = J.weeks[wk] || {}; if (rec.cleared) return; rec[el.getAttribute('data-k')] = el.value.slice(0, 500); App.debSave('journal');
  var filled = SYS.WEEKLY.filter(function(f){ return (rec[f.k] || '').trim().length >= 8; }).length, btn = document.querySelector('[data-a="wkClose"]'); if (btn) btn.disabled = filled < 3; };
App.C.wkGrass = function(el){ var J = App.J, cur = U.weekKey(U.today()), wk = App.ui.f.wk && App.ui.f.wk <= cur ? App.ui.f.wk : cur, rec = J.weeks[wk] = J.weeks[wk] || {}; rec.grass = el.checked; App.commit(['journal'], {norender:true}); };
App.A.wkNav = function(el){ var cur = U.weekKey(U.today()), wk = App.ui.f.wk && App.ui.f.wk <= cur ? App.ui.f.wk : cur; var n = U.addDays(wk, +el.getAttribute('data-d')); App.ui.f.wk = n > cur ? cur : n; App.renderView(); };
App.A.wkClose = function(){ var J = App.J, cur = U.weekKey(U.today()), wk = App.ui.f.wk && App.ui.f.wk <= cur ? App.ui.f.wk : cur, rec = J.weeks[wk] = J.weeks[wk] || {}; var filled = SYS.WEEKLY.filter(function(f){ return (rec[f.k] || '').trim().length >= 8; }).length; if (filled < 3) return; rec.cleared = U.today(); App.commit(['journal']); App.toast({t:'Semana fechada · +50 ◆ +30 XP', s:'Mais uma página do seu lore.', ic:'pen'}); };
App.A.wkReopen = function(){ var J = App.J, cur = U.weekKey(U.today()), wk = App.ui.f.wk && App.ui.f.wk <= cur ? App.ui.f.wk : cur; if (J.weeks[wk]) delete J.weeks[wk].cleared; App.commit(['journal']); };

App.diaMonth = function(){
  var J = App.J, cur = U.monthKey(U.today()), mk = App.ui.f.mo && App.ui.f.mo <= cur ? App.ui.f.mo : cur, rec = J.months[mk] || {}, ro = !!rec.done, S = App.S;
  var filled = SYS.MONTHLY.filter(function(f){ return (rec[f.k] || '').trim().length >= 8; }).length;
  var nodes = Object.keys(S.nodes).filter(function(id){ var d = S.nodes[id].d1; return S.nodes[id].s === 'done' && d && d.slice(0,7) === mk && E.NODE[id]; });
  var achs = Object.keys(S.ach).filter(function(id){ return S.ach[id].slice(0,7) === mk && E.ACHMAP[id]; });
  var prevM = function(k, d){ var p = k.split('-').map(Number), dt = new Date(p[0], p[1]-1+d, 1); return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0'); };
  var nav = '<div class="row between"><button class="btn sm ghost" data-a="moNav" data-k="'+prevM(mk,-1)+'">'+U.icon('back')+'Anterior</button><b style="text-transform:capitalize">'+U.esc(U.fmtMonth(mk))+'</b><button class="btn sm ghost" data-a="moNav" data-k="'+prevM(mk,1)+'"'+(mk >= cur ? ' disabled' : '')+'>Próximo'+U.icon('chev')+'</button></div>';
  var stats = '<div class="kpis" style="margin-top:12px"><div class="kpi"><b>'+nodes.length+'</b><span>nós no mês</span></div><div class="kpi"><b>'+achs.length+'</b><span>conquistas no mês</span></div><div class="kpi"><b>'+S.buys.filter(function(b){ return b.d.slice(0,7) === mk; }).length+'</b><span>compras</span></div></div>';
  var fields = SYS.MONTHLY.map(function(f){ return '<label class="fld">'+U.esc(f.n)+'<textarea data-i="moF" data-k="'+f.k+'" rows="2" maxlength="800"'+(ro ? ' readonly' : '')+'>'+U.esc(rec[f.k] || '')+'</textarea></label>'; }).join('');
  var foot = ro ? '<div class="row between"><span class="chip ok">'+U.icon('check')+'revisão concluída em '+U.fmtDate(rec.done)+' · +100 ◆ +60 XP</span><button class="btn sm ghost" data-a="moReopen">Reabrir</button></div>'
    : '<div class="row between"><span class="faint mono" style="font-size:11.5px">'+filled+'/'+SYS.MONTHLY.length+' campos (mínimo 5)</span><button class="btn primary" data-a="moClose"'+(filled >= 5 ? '' : ' disabled')+'>'+U.icon('check')+'Concluir revisão</button></div>';
  return '<section class="win"><div class="win-h">'+U.icon('journal')+'Revisão mensal</div>'+nav+stats+'</section><section class="win"><div class="grid g2" style="gap:10px">'+fields+'</div><div style="margin-top:12px">'+foot+'</div></section>';
};
App.moKey = function(){ var cur = U.monthKey(U.today()); return App.ui.f.mo && App.ui.f.mo <= cur ? App.ui.f.mo : cur; };
App.I.moF = function(el){ var J = App.J, mk = App.moKey(), rec = J.months[mk] = J.months[mk] || {}; if (rec.done) return; rec[el.getAttribute('data-k')] = el.value.slice(0, 800); App.debSave('journal');
  var filled = SYS.MONTHLY.filter(function(f){ return (rec[f.k] || '').trim().length >= 8; }).length, btn = document.querySelector('[data-a="moClose"]'); if (btn) btn.disabled = filled < 5; };
App.A.moNav = function(el){ var k = el.getAttribute('data-k'), cur = U.monthKey(U.today()); App.ui.f.mo = k > cur ? cur : k; App.renderView(); };
App.A.moClose = function(){ var J = App.J, mk = App.moKey(), rec = J.months[mk] = J.months[mk] || {}; if (SYS.MONTHLY.filter(function(f){ return (rec[f.k] || '').trim().length >= 8; }).length < 5) return; rec.done = U.today(); App.commit(['journal']); App.toast({t:'Revisão mensal · +100 ◆ +60 XP', s:'Reunião consigo mesmo concluída. Ninguém dormiu nessa.', ic:'journal'}); };
App.A.moReopen = function(){ var J = App.J, mk = App.moKey(); if (J.months[mk]) delete J.months[mk].done; App.commit(['journal']); };
App.diaHist = function(){
  var J = App.J, wks = Object.keys(J.weeks).sort().reverse(), mos = Object.keys(J.months).sort().reverse();
  var wl = wks.length ? wks.map(function(k){ var r = J.weeks[k], n = SYS.WEEKLY.filter(function(f){ return (r[f.k] || '').trim(); }).length; return '<button class="res" data-a="histWk" data-k="'+k+'" style="cursor:pointer;text-align:left;width:100%"><span class="'+(r.cleared ? 'ok' : 'faint')+'">'+U.icon(r.cleared ? 'check' : 'pen')+'</span><span style="min-width:0"><b>Semana de '+U.fmtDate(k)+'</b><br><span class="ty">'+(r.cleared ? 'fechada' : 'aberta')+' · '+n+' campos'+(r.grass ? ' · grama tocada' : '')+'</span></span><span class="dim">'+U.icon('chev')+'</span></button>'; }).join('') : '<div class="empty">Nenhuma semana registrada ainda.</div>';
  var ml = mos.length ? mos.map(function(k){ var r = J.months[k]; return '<button class="res" data-a="histMo" data-k="'+k+'" style="cursor:pointer;text-align:left;width:100%"><span class="'+(r.done ? 'ok' : 'faint')+'">'+U.icon(r.done ? 'check' : 'journal')+'</span><span style="min-width:0;text-transform:capitalize"><b>'+U.esc(U.fmtMonth(k))+'</b><br><span class="ty">'+(r.done ? 'concluída' : 'em aberto')+'</span></span><span class="dim">'+U.icon('chev')+'</span></button>'; }).join('') : '<div class="empty">Nenhuma revisão mensal ainda.</div>';
  return '<div class="grid g2" style="align-items:start"><section class="win"><div class="win-h">'+U.icon('pen')+'Semanas</div><div class="stack" style="gap:6px">'+wl+'</div></section><section class="win"><div class="win-h">'+U.icon('journal')+'Meses</div><div class="stack" style="gap:6px">'+ml+'</div></section></div>';
};
App.A.histWk = function(el){ App.ui.f.wk = el.getAttribute('data-k'); App.go('diario/semana'); };
App.A.histMo = function(el){ App.ui.f.mo = el.getAttribute('data-k'); App.go('diario/mes'); };
