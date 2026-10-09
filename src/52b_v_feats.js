/* ===== VIEW v2: Caminho com vertentes, Feitos, contadores e Painel do Autor ===== */
App.V.caminhos = function(){
  var p = App.ui.param; if (p && App.way(p)) return App.V.way(p);
  var D = App.D, S = App.S;
  var h = H.head('Caminhos', 'Sete dungeons. Uma vida.', 'Cada Caminho tem vertentes, arcos, selos, bosses, arcos laterais e Feitos da vida real. Cada nó separa <b>o que estudar</b>, <b>onde achar</b>, <b>livros & estudos</b>, a <b>missão</b>, a <b>aprovação</b> e <b>como falha</b>.');
  return h + '<div class="ways">' + SYS.WAYS.map(function(w){
    var ti = D.tier[w.id], pct = U.pct(D.wayDone[w.id], D.wayNodes[w.id]), np = ti.next ? U.pct(D.wayXP[w.id]-ti.floor, ti.next[0]-ti.floor) : 100;
    var fd = SYS.FEATS.filter(function(f){ return f.way === w.id; }), fdone = fd.filter(function(f){ return D.featDone[f.id]; }).length, mastered = {};
    (w.branches || []).forEach(function(b){ mastered[b.id] = (D.brDone[w.id][b.id] || 0) > 0; });
    return '<a class="way" href="#/caminhos/'+w.id+'" style="--wc:'+w.color+'"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap">'+U.emblem(w, 52, mastered)+'<span class="chip" style="color:'+w.color+'">'+w.attr+' '+D.attr[w.id]+'</span></div>'
      + '<div><div class="pt">'+U.esc(w.pt)+'</div><h3>'+U.esc(w.name)+'</h3></div><p class="dim" style="font-size:13.5px">'+U.esc(w.tagline)+'</p>'
      + ((w.branches || []).length ? '<div class="row" style="gap:5px">'+w.branches.map(function(b){ return '<span class="chip">'+U.icon(b.ic || 'star')+U.esc(b.n)+'</span>'; }).join('')+'</div>' : '')
      + '<div class="meta"><span style="color:'+w.color+'">'+U.esc(ti.n)+'</span><span>'+U.num(D.wayXP[w.id])+' XP</span></div>'+H.bar(np,'way thin')
      + '<div class="meta"><span>'+D.wayDone[w.id]+'/'+D.wayNodes[w.id]+' nós · '+pct+'%</span><span>'+D.wayGatesDone[w.id]+'/'+w.gates.length+' selos · '+fdone+'/'+fd.length+' feitos</span></div></a>';
  }).join('') + '</div>';
};
App.wayTabs = function(w){
  var D = App.D, t = [['trilha','Trilha','map']];
  (w.branches || []).forEach(function(b){ t.push([b.id, b.n, b.ic || 'star', (D.brDone[w.id][b.id] || 0) + '/' + b.nodes.length]); });
  var fd = SYS.FEATS.filter(function(f){ return f.way === w.id; });
  t.push(['feitos', 'Feitos', 'flag', fd.filter(function(f){ return D.featDone[f.id]; }).length + '/' + fd.length]);
  if (w.id === 'flaneur') t.push(['autor', 'Painel do Autor', 'quill']);
  return t;
};
App.V.way = function(wid){
  var w = App.way(wid), S = App.S, D = App.D, ti = D.tier[wid], np = ti.next ? U.pct(D.wayXP[wid]-ti.floor, ti.next[0]-ti.floor) : 100;
  var tabs = App.wayTabs(w), tab = App.ui.sub && tabs.some(function(t){ return t[0] === App.ui.sub; }) ? App.ui.sub : 'trilha', br = w.brmap[tab] ? tab : null;
  var nxt = E.nextNode(S, wid, br);
  var mastered = {}; (w.branches || []).forEach(function(b){ mastered[b.id] = (D.brDone[wid][b.id] || 0) >= b.nodes.length && b.nodes.length > 0; });
  var head = '<section class="win wayhead" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'"><a href="#/caminhos" class="act" style="order:0;color:var(--dim)">← caminhos</a>'+U.esc(w.pt)+'</div>'
    + '<div class="whead">'+U.emblem(w, 84, mastered)+'<div class="stack" style="gap:8px;min-width:0"><h1>'+U.esc(w.name)+'</h1><p class="lead">'+U.esc(w.tagline)+'</p><p class="faint" style="font-size:13.5px;max-width:80ch">'+U.esc(w.lore)+'</p>'
    + '<div class="row" style="gap:6px"><span class="chip" style="color:'+w.color+'">'+w.attr+' · '+U.esc(w.attrName)+' '+D.attr[wid]+'</span><span class="chip">'+U.num(D.wayXP[wid])+' XP</span><span class="chip">'+U.num(D.wayCr[wid])+' '+w.cur.code+'</span><span class="chip">'+D.seals[wid]+' selos</span><span class="chip">'+D.wayDone[wid]+'/'+D.wayNodes[wid]+' nós</span></div>'
    + '<div class="stack" style="gap:4px;max-width:560px"><div class="row between mono" style="font-size:12px"><span style="color:'+w.color+'">'+U.esc(ti.n)+'</span><span class="dim">'+(ti.next ? 'próximo título: '+U.esc(ti.next[1])+' em '+U.num(ti.next[0])+' XP' : 'título máximo do Caminho')+'</span></div>'+H.bar(np,'way',w.color)+'</div>'
    + '<div class="row"><a class="btn sm" href="#/lojas/'+wid+(br ? '/'+br : '')+'">'+U.icon('bag')+'Loja '+w.cur.code+'</a><a class="btn sm ghost" href="#/biblioteca/'+wid+'">'+U.icon('book')+'Livros</a>'+(nxt ? '<button class="btn sm primary" data-a="openNode" data-id="'+nxt.id+'">'+U.icon('sword')+'Continuar · '+U.esc(nxt.id)+'</button>' : '')+'</div></div></div></section>';
  var brCards = (w.branches || []).length ? '<div class="brgrid">' + w.branches.map(function(b){
      var bt = D.brTier[wid][b.id], bxp = D.brXP[wid][b.id], bp = bt.next ? U.pct(bxp - bt.floor, bt.next[0] - bt.floor) : 100, on = tab === b.id;
      return '<a class="brcard'+(on ? ' on' : '')+'" href="#/caminhos/'+wid+'/'+b.id+'" style="--wc:'+w.color+'"><div class="row between" style="flex-wrap:nowrap"><span class="bri">'+U.icon(b.ic || 'star')+'</span><span class="mono dim" style="font-size:11px">'+(D.brDone[wid][b.id] || 0)+'/'+b.nodes.length+' nós</span></div><b>'+U.esc(b.n)+'</b><span class="dim" style="font-size:13px">'+U.esc(b.d)+'</span><div class="row between mono" style="font-size:11.5px"><span style="color:'+w.color+'">'+U.esc(bt.n)+'</span><span class="dim">'+U.num(bxp)+' XP</span></div>'+H.bar(bp, 'way thin', w.color)+'</a>';
    }).join('') + '</div>' : '';
  var body;
  if (tab === 'feitos') body = App.featsPanel(wid);
  else if (tab === 'autor') body = App.authorPanel();
  else body = App.wayTrail(w, br);
  return head + brCards + H.tabs('caminhos/'+wid, tabs, tab) + body;
};
App.wayTrail = function(w, br){
  var S = App.S, D = App.D, wid = w.id;
  function arcHTML(a){
    var locked = E.arcLocked(S, a), dn = a.nodes.filter(function(n){ return H.st(n.id) === 'done'; }).length;
    return '<section class="arc'+(a.side ? ' side' : '')+'"><div class="arc-h"><div class="stack" style="gap:2px;min-width:0"><span class="eyebrow" style="color:'+w.color+'">'+U.esc(a.wk)+(a.side ? ' · arco lateral' : '')+'</span><h3>'+U.esc(a.n)+'</h3><span class="sub">'+U.esc(a.sub)+'</span></div><div class="row" style="gap:6px">'+(locked ? '<span class="chip bad">'+U.icon('lock')+'Travado</span>' : '')+'<span class="chip">'+dn+'/'+a.nodes.length+'</span></div></div>'
      + (locked ? '<div class="callout fail" style="font-size:13.5px">Conquiste <b>'+U.esc(E.GATE[a.needGate].n)+'</b> para abrir este arco. “Vi a matéria” não conta.</div>' : '')
      + a.nodes.map(H.nodeRow).join('') + (a.gate ? App.gateCard(a.gate) : '') + '</section>';
  }
  var arcs;
  if (br) arcs = w.arcs.filter(function(a){ return a.br === br; }).map(arcHTML).join('');
  else if ((w.branches || []).length) {
    var base = w.arcs.filter(function(a){ return !a.br && a.base; });
    arcs = (base.length ? '<div class="brsep" style="--wc:'+w.color+'"><span>'+U.icon('book')+'Fundamentos · base comum das vertentes</span></div>' + base.map(arcHTML).join('') : '') + w.branches.map(function(b){ var list = w.arcs.filter(function(a){ return a.br === b.id; }); if (!list.length) return ''; return '<div class="brsep" style="--wc:'+w.color+'"><span>'+U.icon(b.ic || 'star')+'Vertente · '+U.esc(b.n)+'</span></div>' + list.map(arcHTML).join(''); }).join('');
    var fin = w.arcs.filter(function(a){ return !a.br && !a.base; }); if (fin.length) arcs += '<div class="brsep" style="--wc:'+w.color+'"><span>'+U.icon('crown')+'Integração</span></div>' + fin.map(arcHTML).join('');
  } else arcs = w.arcs.map(arcHTML).join('');
  var lv = '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('star')+'Níveis de skill</div>'
    + E.discLevels(S, D, wid, br).map(function(l){ return '<div class="disc" title="'+l.done+'/'+l.tot+' nós · '+SYS.DISC_LV[l.lv]+'"><span>'+U.esc(l.d)+'</span><div class="lvdots">'+[1,2,3,4,5].map(function(i){ return '<i class="'+(l.lv >= i ? 'on' : '')+'"></i>'; }).join('')+'</div><b>Lv '+l.lv+'</b></div>'; }).join('')
    + '<p class="faint mono" style="font-size:11px;margin-top:8px">Lv1 começou · Lv2 40% · Lv3 70% · Lv4 100% · Lv5 100% + selo do arco</p></section>';
  var tlist = br ? w.brmap[br].tiers : w.tiers, txp = br ? D.brXP[wid][br] : D.wayXP[wid];
  var tiers = '<section class="win"><div class="win-h">'+U.icon('banner')+'Títulos '+(br ? 'da vertente' : 'do Caminho')+'</div>'
    + tlist.map(function(t){ var got = txp >= t[0]; return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto"><span style="color:'+(got ? 'var(--ok)' : 'var(--faint)')+'">'+U.icon(got ? 'check' : 'lock')+'</span><span style="'+(got ? '' : 'color:var(--faint)')+'">'+U.esc(t[1])+'</span><b>'+U.num(t[0])+' XP</b></div>'; }).join('') + '</section>';
  return '<div class="grid waygrid" style="grid-template-columns:minmax(0,1fr) 320px;align-items:start"><div class="stack" style="gap:22px">'+arcs+'</div><div class="stack waysticky" style="gap:16px">'+(App.crossWin ? App.crossWin(w, br) : '')+lv+tiers+'</div></div>';
};

/* ---------- contadores ---------- */
App.ctrMonth = function(){ return U.calToday().slice(0, 7); };
App.ctrAddVal = function(id, v, month){
  var S = App.S, c = S.ctr[id] = S.ctr[id] || {t:0, m:{}}; month = month || App.ctrMonth();
  var nv = Math.max(0, (c.t || 0) + v), real = nv - (c.t || 0); c.t = nv; c.m[month] = Math.max(0, (c.m[month] || 0) + real);
  var keys = Object.keys(c.m).sort(); if (keys.length > 36) keys.slice(0, keys.length - 36).forEach(function(k){ delete c.m[k]; });
  return real;
};
App.A.ctrStep = function(el){ var id = el.getAttribute('data-id'), v = +el.getAttribute('data-v'); App.ctrAddVal(id, v); App.commit(['core']); };
App.A.ctrAdd = function(el){
  var id = el.getAttribute('data-id'), inp = App.$('ctr-in-' + id), v = inp ? parseInt(inp.value, 10) : NaN;
  if (!v || isNaN(v)) { App.toast({t:'Número inválido', s:'Digite quanto somar (use negativo para corrigir).', ic:'alert'}); return; }
  if (Math.abs(v) > 1000000) return;
  App.ctrAddVal(id, v); App.commit(['core']);
  App.toast({t:(v > 0 ? '+' : '') + U.num(v) + ' · ' + E.CTR[id].n, s:'Total: ' + U.num(E.ctrTotal(App.S, id)) + ' ' + E.CTR[id].unit, ic:E.CTR[id].ic});
};
App.colChart = function(id, months, color){
  var S = App.S, c = S.ctr[id] || {m:{}}, cur = App.ctrMonth(), keys = [];
  var p = cur.split('-').map(Number);
  for (var i = months - 1; i >= 0; i--) { var dt = new Date(p[0], p[1] - 1 - i, 1); keys.push(dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0')); }
  var vals = keys.map(function(k){ return c.m[k] || 0; }), max = Math.max.apply(null, vals.concat([1]));
  var W = 360, Hh = 120, top = 16, bot = 20, bw = Math.min(18, (W / months) * .55), gap = W / months, unit = E.CTR[id].unit, maxI = vals.indexOf(Math.max.apply(null, vals));
  var bars = vals.map(function(v, i){
    var x = gap * i + (gap - bw) / 2, h = v ? Math.max(3, (Hh - top - bot) * v / max) : 0, y = Hh - bot - h, r = Math.min(4, h, bw / 2);
    var mk = h ? '<path d="M'+x.toFixed(1)+' '+(Hh-bot)+' V'+(y+r).toFixed(1)+' Q'+x.toFixed(1)+' '+y.toFixed(1)+' '+(x+r).toFixed(1)+' '+y.toFixed(1)+' H'+(x+bw-r).toFixed(1)+' Q'+(x+bw).toFixed(1)+' '+y.toFixed(1)+' '+(x+bw).toFixed(1)+' '+(y+r).toFixed(1)+' V'+(Hh-bot)+' Z" style="fill:'+color+'"/>' : '';
    var lbl = (i === maxI && v) || (i === months - 1 && v) ? '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(y-4).toFixed(1)+'" text-anchor="middle" class="cc-v">'+U.num(v)+'</text>' : '';
    var mo = U.parse(keys[i] + '-01').toLocaleDateString('pt-BR', {month:'short'}).replace('.', '');
    return mk + lbl + '<text x="'+(gap*i+gap/2).toFixed(1)+'" y="'+(Hh-5)+'" text-anchor="middle" class="cc-m">'+U.esc(mo)+'</text>'
      + '<rect x="'+(gap*i).toFixed(1)+'" y="0" width="'+gap.toFixed(1)+'" height="'+(Hh-bot)+'" fill="transparent" class="cc-hit" data-tip="'+U.esc(U.fmtMonth(keys[i])+' · '+U.num(v)+' '+unit)+'"/>';
  }).join('');
  return '<svg class="colchart" viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="'+U.esc(E.CTR[id].n)+' por mês, últimos '+months+' meses"><line x1="0" x2="'+W+'" y1="'+(Hh-bot)+'" y2="'+(Hh-bot)+'" class="cc-base"/>'+bars+'</svg>';
};
App.ctrCard = function(id, chart){
  var c = E.CTR[id], w = App.way(c.way), tot = E.ctrTotal(App.S, id), mon = (App.S.ctr[id] && App.S.ctr[id].m[App.ctrMonth()]) || 0;
  var nextFeat = SYS.FEATS.filter(function(f){ return f.ctr === id && !App.D.featDone[f.id]; }).sort(function(a, b){ return a.goal - b.goal; })[0];
  return '<div class="ctr" style="--wc:'+w.color+'"><div class="row between" style="flex-wrap:nowrap;align-items:flex-start"><div class="stack" style="gap:2px;min-width:0"><span class="eyebrow" style="letter-spacing:.08em;color:var(--dim)">'+U.icon(c.ic)+' '+U.esc(c.n)+'</span><b class="ctr-v">'+U.num(tot)+'</b><span class="faint mono" style="font-size:11px">'+U.num(mon)+' este mês</span></div>'
    + '<div class="ctr-steps">'+c.q.map(function(q){ return '<button class="btn sm" data-a="ctrStep" data-id="'+id+'" data-v="'+q+'">+'+U.num(q)+'</button>'; }).join('')+'</div></div>'
    + (nextFeat ? '<div class="stack" style="gap:3px"><div class="row between mono" style="font-size:11px"><span class="dim">Próximo Feito: '+U.esc(nextFeat.n)+'</span><span>'+U.num(Math.min(tot, nextFeat.goal))+'/'+U.num(nextFeat.goal)+'</span></div>'+H.bar(U.pct(Math.min(tot, nextFeat.goal), nextFeat.goal), 'way thin', w.color)+'</div>' : '')
    + (chart ? App.colChart(id, 12, w.color) : '')
    + '<div class="ctr-add"><label class="sr" for="ctr-in-'+id+'">Somar a '+U.esc(c.n)+'</label><input type="number" id="ctr-in-'+id+'" inputmode="numeric" placeholder="somar (ou −corrigir)"><button class="btn sm" data-a="ctrAdd" data-id="'+id+'">'+U.icon('plus')+'Registrar</button></div></div>';
};

/* ---------- feitos ---------- */
App.featRow = function(f){
  var S = App.S, D = App.D, done = !!D.featDone[f.id], a = E.ACHMAP['ft_' + f.id], R = SYS.RARITY[f.r], rec = S.feats[f.id] || {};
  var ctl;
  if (f.ctr) { var v = E.ctrTotal(S, f.ctr); ctl = '<div class="stack" style="gap:3px;min-width:140px"><span class="mono" style="font-size:11.5px;text-align:right">'+U.num(Math.min(v, f.goal))+'/'+U.num(f.goal)+' '+U.esc(E.CTR[f.ctr].unit)+'</span>'+H.bar(U.pct(Math.min(v, f.goal), f.goal), 'thin')+'</div>'; }
  else ctl = done ? '<button class="btn sm ghost" data-a="featUndo" data-id="'+f.id+'">Desfazer</button>' : '<button class="btn sm" data-a="featOpen" data-id="'+f.id+'">'+U.icon('check')+'Conquistei</button>';
  return '<div class="feat'+(done ? ' done' : '')+'" style="--rc:'+R.c+'">'+U.medal(a, {size:46, locked:!done})
    + '<div class="stack" style="gap:3px;min-width:0"><div class="row" style="gap:6px"><b>'+U.esc(f.n)+'</b><span class="chip" style="color:'+R.c+';border-color:'+U.hexA(R.c,.45)+'">'+R.n+'</span>'+(f.title ? '<span class="chip">título: '+U.esc(f.title)+'</span>' : '')+'</div>'
    + '<span class="dim" style="font-size:13.5px">'+U.esc(f.d)+'</span><span class="faint mono" style="font-size:11px">+'+f.xp+' XP · +'+f.cr+' '+App.way(f.way).cur.code+(done && rec.d ? ' · conquistado em '+U.fmtDate(rec.d) : '')+(rec.ev ? ' · evidência: '+U.esc(rec.ev) : '')+'</span></div>'+ctl+'</div>';
};
App.featsPanel = function(wid){
  var w = App.way(wid), list = SYS.FEATS.filter(function(f){ return f.way === wid; }), D = App.D;
  var ctrs = SYS.COUNTERS.filter(function(c){ return c.way === wid; });
  var groups = [[null, 'Geral']].concat((w.branches || []).map(function(b){ return [b.id, b.n]; }));
  var intro = '<section class="win"><div class="win-h">'+U.icon('flag')+'Feitos da vida real</div><p class="dim" style="font-size:14px">Coisas que acontecem fora da tela e provam o Caminho: vendas, elogios, clientes, skills bonitas. Cada Feito vira medalha, dá XP e créditos, e alguns dão títulos. <b>Honra do jogador:</b> marque só o que aconteceu.</p><div class="row" style="gap:6px;margin-top:10px"><span class="chip ok">'+list.filter(function(f){ return D.featDone[f.id]; }).length+'/'+list.length+' feitos</span></div></section>';
  var ctrH = ctrs.length ? '<section class="win"><div class="win-h">'+U.icon('plus')+'Contadores</div><div class="ctrs">'+ctrs.map(function(c){ return App.ctrCard(c.id, false); }).join('')+'</div></section>' : '';
  var body = groups.map(function(g){ var fs = list.filter(function(f){ return (f.br || null) === g[0]; }); if (!fs.length) return ''; return '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon(g[0] ? (w.brmap[g[0]].ic || 'star') : w.icon)+U.esc(g[1])+'</div><div class="stack" style="gap:8px">'+fs.map(App.featRow).join('')+'</div></section>'; }).join('');
  return intro + ctrH + (App.offPanel ? App.offPanel(wid) : '') + body;
};
App.authorPanel = function(){
  var S = App.S, ids = ['kdp_sales','kenp','pages','words'], rest = ['books_pub','stories','reviews','submissions'];
  var intro = '<section class="win"><div class="win-h">'+U.icon('quill')+'Painel do Autor</div><p class="dim" style="font-size:14px">Leitura, escrita e Amazon no mesmo lugar. Registre por mês: vendas e páginas KENP você copia do relatório do KDP; páginas lidas e palavras escritas você anota no fim do dia. Os números alimentam os Feitos (Primeira Venda, Best-seller da Serra, Mil Páginas no Kindle Unlimited…).</p>'
    + '<div class="kpis" style="margin-top:12px">'+ids.concat(rest).map(function(id){ return '<div class="kpi"><b>'+U.num(E.ctrTotal(S, id))+'</b><span>'+U.esc(E.CTR[id].n.replace(/ \(.*\)/, ''))+'</span></div>'; }).join('')+'</div></section>';
  return intro + '<div class="ctrs big">'+ids.map(function(id){ return App.ctrCard(id, true); }).join('')+'</div>'
    + '<section class="win"><div class="win-h">'+U.icon('book')+'Mais contadores</div><div class="ctrs">'+rest.map(function(id){ return App.ctrCard(id, false); }).join('')+'</div></section>'
    + '<section class="win"><div class="win-h">'+U.icon('scroll')+'Tabela mensal</div>'+App.ctrTable(ids.concat(rest))+'</section>';
};
App.ctrTable = function(ids){
  var S = App.S, months = {};
  ids.forEach(function(id){ Object.keys((S.ctr[id] || {}).m || {}).forEach(function(k){ months[k] = 1; }); });
  var ks = Object.keys(months).sort().reverse().slice(0, 18);
  if (!ks.length) return '<div class="empty">Nada registrado ainda. O primeiro número é o mais difícil.</div>';
  return '<div class="tablewrap"><table class="tbl"><thead><tr><th>Mês</th>'+ids.map(function(id){ return '<th>'+U.esc(E.CTR[id].unit)+'</th>'; }).join('')+'</tr></thead><tbody>'
    + ks.map(function(k){ return '<tr><td style="text-transform:capitalize">'+U.esc(U.fmtMonth(k))+'</td>'+ids.map(function(id){ return '<td class="mono">'+U.num(((S.ctr[id] || {}).m || {})[k] || 0)+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody></table></div>';
};
App.A.featOpen = function(el){ App.ui.modal = {type:'feat', id:el.getAttribute('data-id'), ev:'', ok:false}; App.renderModal(); };
App.M.feat = function(m){
  var f = E.FEAT[m.id], a = E.ACHMAP['ft_' + f.id], R = SYS.RARITY[f.r];
  return '<section class="win"><div class="win-h" style="color:'+R.c+'">'+U.icon('flag')+'Registrar Feito<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack" style="align-items:center;text-align:center">'+U.medal(a, {size:96})+'<h2>'+U.esc(f.n)+'</h2><p class="dim">'+U.esc(f.d)+'</p>'
    + '<label class="fld" style="width:100%;text-align:left">Evidência ou nota (opcional)<input type="text" data-i="featEv" maxlength="200" value="'+U.esc(m.ev)+'" placeholder="link, print, quem elogiou, onde foi…"></label>'
    + '<label class="check" style="text-align:left"><input type="checkbox" data-c="featOk"'+(m.ok ? ' checked' : '')+'><span>Aconteceu de verdade. Honra do jogador.</span></label>'
    + '<div class="row" style="justify-content:center"><button class="btn ghost" data-a="closeModal">Ainda não</button><button class="btn primary" data-a="featDo"'+(m.ok ? '' : ' disabled')+'>'+U.icon('check')+'+'+f.xp+' XP · +'+f.cr+' '+App.way(f.way).cur.code+'</button></div></div></section>';
};
App.I.featEv = function(el){ if (App.ui.modal) App.ui.modal.ev = el.value; };
App.C.featOk = function(el){ if (!App.ui.modal) return; App.ui.modal.ok = el.checked; var b = App.$('modal').querySelector('[data-a="featDo"]'); if (b) b.disabled = !el.checked; };
App.A.featDo = function(){ var m = App.ui.modal; if (!m || !m.ok) return; var f = E.FEAT[m.id]; App.S.feats[f.id] = {d:U.today(), ev:(m.ev || '').slice(0, 200)}; App.ui.modal = null; App.commit(['core']); App.toast({t:'Feito · ' + f.n, s:'Vida real também dá XP. Principalmente ela.', ic:'flag'}); };
App.A.featUndo = function(el){ var id = el.getAttribute('data-id'); delete App.S.feats[id]; App.commit(['core']); };
