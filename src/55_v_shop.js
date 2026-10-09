/* ===== VIEW: Lojas dos Caminhos + Loja do Sistema (cosméticos) ===== */
App.TIERN = {common:'Comum', uncommon:'Incomum', rare:'Raro', epic:'Épico', legendary:'Lendário', mythic:'Mítico'};
App.fmtLeft = function(iso){ var ms = Date.parse(iso) - Date.now(); if (ms <= 0) return 'pronto'; var h = Math.floor(ms / 3600000), m = Math.ceil((ms % 3600000) / 60000); if (m === 60) { h++; m = 0; } return h >= 24 ? Math.floor(h/24)+'d '+(h%24)+'h' : h+'h '+m+'min'; };
App.V.lojas = function(){
  var S = App.S, p = App.ui.param, wid = p === 'sistema' ? 'sistema' : (App.way(p) ? p : S.settings.season.main);
  var tabs = SYS.WAYS.map(function(w){ return [w.id, w.cur.code, w.icon]; }).concat([['sistema','Sistema ◆','gem']]);
  var h = H.head('Mercado do Sistema', 'Lojas', 'Créditos não são dinheiro: são <b>permissão</b> para gastar dentro da regra de cada item. Itens caros entram em cooldown — desistir no cooldown também é vitória. Cosméticos e tickets saem por ◆ na Loja do Sistema.') + H.tabs('lojas', tabs, wid);
  return h + (wid === 'sistema' ? App.sysShop() : App.wayShop(wid));
};
App.wayShop = function(wid){
  var S = App.S, D = App.D, w = App.way(wid);
  var pend = S.pending.filter(function(x){ return x.way === wid; });
  var head = '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon(w.icon)+'Loja · '+U.esc(w.name)+'</div><div class="kpis">'
    + '<div class="kpi"><b style="color:'+w.color+'">'+U.num(D.wayCr[wid])+'</b><span>'+U.esc(w.cur.name)+'</span></div><div class="kpi"><b>'+D.seals[wid]+'</b><span>selos disponíveis</span></div><div class="kpi"><b>'+U.num(D.wayXP[wid])+'</b><span>XP do Caminho</span></div><div class="kpi"><b>'+U.num(D.crSpent[wid])+'</b><span>créditos gastos</span></div></div>'
    + '<p class="faint" style="font-size:12.5px;margin-top:10px">Ganhe '+w.cur.code+' concluindo nós, livros aplicados, diárias do Caminho, conquistas e certificações. Tiers de loja abrem com XP do Caminho; lendários pedem Selos.</p></section>';
  var pendH = pend.length ? '<section class="win"><div class="win-h" style="color:var(--warn)">'+U.icon('clock')+'Em cooldown</div><div class="stack" style="gap:8px">'+pend.map(function(x){ var ready = Date.now() >= Date.parse(x.until); return '<div class="res" style="cursor:default"><span class="warn">'+U.icon('clock')+'</span><span style="min-width:0"><b>'+U.esc(x.n)+'</b><br><span class="ty">'+(ready ? 'cooldown encerrado — ainda quer?' : 'libera em '+App.fmtLeft(x.until))+' · '+x.c+' '+w.cur.code+'</span></span><span class="row" style="gap:6px;flex-wrap:nowrap">'+(ready ? '<button class="btn sm primary" data-a="buyOpen" data-way="'+wid+'" data-id="'+x.id+'">Concluir</button>' : '')+'<button class="btn sm ghost" data-a="cdCancel" data-id="'+x.id+'">Desistir</button></span></div>'; }).join('')+'</div></section>' : '';
  var tiers = SYS.RARITY_ORDER.filter(function(r){ return w.shop.some(function(it){ return it.tier === r; }); });
  var body = tiers.map(function(r){
    var R = SYS.RARITY[r];
    return '<section class="stack" style="gap:10px"><div class="row between"><span class="eyebrow" style="color:'+R.c+'">'+App.TIERN[r]+'</span></div><div class="shop">'
      + w.shop.filter(function(it){ return it.tier === r; }).map(function(it){ return App.itemCard(wid, it); }).join('') + '</div></section>';
  }).join('');
  var hist = S.buys.filter(function(b){ return b.way === wid; }).slice(-20).reverse();
  var histH = '<section class="win"><div class="win-h">'+U.icon('bag')+'Histórico de compras</div>'+(hist.length ? hist.map(function(b){ return '<div class="notif"><span style="color:'+w.color+'">'+U.icon('bag')+'</span><span>'+U.esc(b.n)+' <span class="faint mono" style="font-size:11px">· '+b.c+' '+w.cur.code+(b.seals ? ' · '+b.seals+' selos' : '')+'</span></span><span class="row" style="gap:6px"><span class="faint mono" style="font-size:11px">'+U.fmtDate(b.d)+'</span>'+(b.d === U.today() && b.t ? '<button class="btn sm ghost" data-a="refund" data-t="'+U.esc(b.t)+'">Estornar</button>' : '')+'</span></div>'; }).join('') : '<div class="empty">Nada comprado ainda. A loja sente sua falta (sua reserva, não).</div>')+'</section>';
  return head + pendH + body + histH;
};
App.itemCard = function(wid, it){
  var S = App.S, D = App.D, w = App.way(wid), st = E.itemState(S, D, wid, it), R = SYS.RARITY[it.tier] || SYS.RARITY.common;
  var reqs = [];
  if (it.mx) reqs.push([D.wayXP[wid] >= it.mx, 'XP do Caminho ≥ '+U.num(it.mx)]);
  if (it.req) reqs.push([E.reqMet(S, D, it.req), E.reqLabel(it.req)]);
  if (it.seals) reqs.push([D.seals[wid] >= it.seals, it.seals+' Selos do Caminho (consumidos)']);
  var tags = '<div class="row" style="gap:6px"><span class="chip">regra: '+U.esc(it.rule)+'</span>'+(it.rep ? '<span class="chip glow">1x por '+U.esc(it.lim || 'vez')+'</span>' : '')+(it.cd ? '<span class="chip warn">'+U.icon('clock')+'cooldown '+(it.cd >= 168 ? '7 dias' : it.cd+'h')+'</span>' : '')+'</div>';
  var act = '';
  if (st.st === 'owned') { var b = S.buys.filter(function(x){ return x.id === it.id; }).pop(); act = '<span class="chip ok">'+U.icon('check')+'adquirido '+U.fmtDate(b.d)+'</span>'; }
  else if (st.st === 'limit') act = '<span class="chip">'+U.esc(st.reasons[0])+'</span>';
  else if (st.st === 'cooldown') act = '<span class="chip warn">'+U.icon('clock')+App.fmtLeft(st.pend.until)+'</span><button class="btn sm ghost" data-a="cdCancel" data-id="'+it.id+'">Desistir</button>';
  else if (st.st === 'ready') act = '<button class="btn sm primary" data-a="buyOpen" data-way="'+wid+'" data-id="'+it.id+'"'+(st.reasons.length || st.poor ? ' disabled' : '')+'>Concluir compra</button><button class="btn sm ghost" data-a="cdCancel" data-id="'+it.id+'">Desistir</button>';
  else if (st.st === 'available') act = it.cd ? '<button class="btn sm" data-a="cdStart" data-way="'+wid+'" data-id="'+it.id+'">'+U.icon('clock')+'Iniciar cooldown</button>' : '<button class="btn sm primary" data-a="buyOpen" data-way="'+wid+'" data-id="'+it.id+'">'+U.icon('bag')+'Comprar</button>';
  else act = '<button class="btn sm" disabled>'+U.icon('lock')+'Bloqueado</button>';
  return '<article class="item'+(st.st === 'locked' ? ' lk' : '')+'" style="--rc:'+R.c+'"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap;gap:8px"><span class="in">'+U.esc(it.n)+'</span><span class="price" style="color:'+w.color+'">'+U.num(it.c)+'<small class="mono" style="font-size:10px;margin-left:3px">'+w.cur.code+'</small></span></div>'
    + tags + (reqs.length ? '<div class="req">'+reqs.map(function(r){ return '<span class="row" style="gap:6px;flex-wrap:nowrap"><span class="'+(r[0] ? 'ok' : 'faint')+'">'+U.icon(r[0] ? 'check' : 'lock')+'</span>'+U.esc(r[1])+'</span>'; }).join('')+'</div>' : '')
    + (st.st === 'locked' && D.wayCr[wid] < it.c && reqs.every(function(r){ return r[0]; }) ? '<span class="faint mono" style="font-size:11.5px">faltam '+U.num(it.c - D.wayCr[wid])+' '+w.cur.code+'</span>' : '')
    + '<div class="row" style="gap:6px;margin-top:auto">'+act+'</div></article>';
};
App.findItem = function(wid, id){ return App.way(wid).shop.filter(function(x){ return x.id === id; })[0]; };
App.A.cdStart = function(el){
  var wid = el.getAttribute('data-way'), it = App.findItem(wid, el.getAttribute('data-id')), S = App.S; if (!it) return;
  if (E.itemState(S, App.D, wid, it).st !== 'available') return;
  S.pending.push({id:it.id, way:wid, n:it.n, c:it.c, d:U.today(), until:new Date(Date.now() + it.cd * 3600000).toISOString()});
  App.commit(['core']); App.toast({t:'Cooldown iniciado · '+(it.cd >= 168 ? '7 dias' : it.cd+'h'), s:U.pick(SYS.VOICE.cooldown), ic:'clock'});
};
App.A.cdCancel = function(el){
  var id = el.getAttribute('data-id'), S = App.S, n = S.pending.length;
  S.pending = S.pending.filter(function(x){ return x.id !== id; });
  if (S.pending.length < n) { S.stats.cdCancel = (S.stats.cdCancel || 0) + 1; App.commit(['core']); App.toast({t:'Compra cancelada', s:U.pick(SYS.VOICE.cancel), ic:'shield'}); }
};
App.A.buyOpen = function(el){ App.ui.modal = {type:'buy', way:el.getAttribute('data-way'), id:el.getAttribute('data-id'), ok:false}; App.renderModal(); };
App.M.buy = function(m){
  var w = App.way(m.way), it = App.findItem(m.way, m.id), D = App.D; if (!it) return '';
  var st = E.itemState(App.S, D, m.way, it), can = (st.st === 'available' && !it.cd) || (st.st === 'ready' && !st.reasons.length && !st.poor);
  return '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('bag')+'Confirmar compra<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack">'
    + '<h3>'+U.esc(it.n)+'</h3><dl class="kv"><dt>Preço</dt><dd>'+U.num(it.c)+' '+w.cur.code+(it.seals ? ' + '+it.seals+' selos' : '')+'</dd><dt>Saldo depois</dt><dd>'+U.num(D.wayCr[m.way] - it.c)+' '+w.cur.code+'</dd><dt>Regra de dinheiro</dt><dd><b>'+U.esc(it.rule)+'</b></dd></dl>'
    + '<label class="check"><input type="checkbox" data-c="buyOk"'+(m.ok ? ' checked' : '')+'><span>Confirmo que vou respeitar a regra do item e que isso não mexe na reserva de emergência.</span></label>'
    + '<p class="faint" style="font-size:12.5px">O Sistema não é consultor financeiro: créditos só liberam a permissão. Se o dinheiro real não cabe, a compra espera.</p>'
    + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Agora não</button><button class="btn primary" data-a="buyDo"'+(can && m.ok ? '' : ' disabled')+'>'+U.icon('check')+'Comprar</button></div></div></section>';
};
App.C.buyOk = function(el){ if (!App.ui.modal) return; App.ui.modal.ok = el.checked; App.renderModal(); };
App.A.buyDo = function(){
  var m = App.ui.modal, S = App.S, it = m && App.findItem(m.way, m.id); if (!it || !m.ok) return;
  var st = E.itemState(S, App.D, m.way, it), fromCd = st.st === 'ready';
  if (!((st.st === 'available' && !it.cd) || (fromCd && !st.reasons.length && !st.poor))) return;
  if (fromCd) { S.pending = S.pending.filter(function(x){ return x.id !== it.id; }); S.stats.cdDone = (S.stats.cdDone || 0) + 1; }
  S.buys.push({id:it.id, way:m.way, n:it.n, c:it.c, seals:it.seals || 0, d:U.today(), t:new Date().toISOString()});
  App.ui.modal = null; App.commit(['core']);
  App.toast({t:'Compra liberada · '+it.n, s:U.pick(SYS.VOICE.buy), ic:'bag'});
};
App.A.refund = function(el){
  var t = el.getAttribute('data-t'), S = App.S, b = S.buys.filter(function(x){ return x.t === t; })[0];
  if (!b || b.d !== U.today()) return;
  S.buys = S.buys.filter(function(x){ return x.t !== t; }); App.commit(['core']);
  App.toast({t:'Compra estornada', s:'Créditos devolvidos. Arrependimento no mesmo dia é permitido.', ic:'back'});
};

/* ---------- Loja do Sistema ---------- */
App.SKINPAL = {sk_system:['#03060d','#4fb3ff','#8f6bff'], sk_violet:['#070313','#a98bff','#ff5fd2'], sk_liminal:['#041315','#6fe3d3','#f3e6c4'], sk_vhs:['#020703','#4dff88','#ff3b3b'], sk_dream:['#eef2ff','#e8589f','#4fb7f0'], sk_cerne:['#08110c','#c89b5b','#7fc79a'], sk_rave:['#0b0012','#ff3df2','#c6ff00'], sk_glitch:['#050505','#00fff0','#ff00aa']};
App.cosState = function(list, kind, it){
  var S = App.S, owns = E.ownsCosmetic(S, list, it.id, kind);
  if (owns) return {st:'owned'};
  if (it.ach) return {st:'achlock', why:E.ACHMAP[it.ach] ? (E.ACHMAP[it.ach].secret ? 'Conquista secreta' : 'Conquista: '+E.ACHMAP[it.ach].n) : it.ach};
  return {st: App.D.gem >= it.c ? 'buy' : 'poor'};
};
App.cosBtn = function(kind, it, cs, equipped){
  if (cs.st === 'owned') return equipped ? '<span class="chip ok">'+U.icon('check')+'equipado</span>' : '<button class="btn sm" data-a="cosEquip" data-k="'+kind+'" data-id="'+it.id+'">Equipar</button>';
  if (cs.st === 'achlock') return '<span class="chip">'+U.icon('lock')+U.esc(cs.why)+'</span>';
  return '<button class="btn sm'+(cs.st === 'buy' ? ' primary' : '')+'" data-a="sysBuyOpen" data-k="'+kind+'" data-id="'+it.id+'"'+(cs.st === 'buy' ? '' : ' disabled')+'>'+U.icon('gem')+U.num(it.c)+' ◆</button>';
};
App.sysShop = function(){
  var S = App.S, D = App.D, P = S.profile;
  var head = '<section class="win"><div class="win-h">'+U.icon('gem')+'Loja do Sistema</div><div class="kpis"><div class="kpi"><b class="glow">'+U.num(D.gem)+'</b><span>cristais ◆</span></div><div class="kpi"><b>'+U.num(D.gemEarned)+'</b><span>◆ ganhos no total</span></div><div class="kpi"><b>'+(S.owned.tickets||0)+'</b><span>tickets de descanso</span></div></div>'
    + '<p class="faint" style="font-size:12.5px;margin-top:10px">◆ vêm de: dia com todas as diárias (+10), tocar grama (+3), semana fechada (+50), revisão mensal (+100), meta concluída (+30) e conquistas de sistema (10 a 500 conforme a raridade).</p></section>';
  var items = '<section class="win"><div class="win-h">'+U.icon('bag')+'Itens</div><div class="shop">'+SYS.SYSSHOP.map(function(it){
    var owned = it.kind === 'fx' ? (S.owned.fx || []).indexOf(it.id) >= 0 : it.kind === 'custom' ? S.owned.custom : false, btn;
    if (owned) btn = it.kind === 'fx' ? (P.fx === it.id ? '<button class="btn sm ghost" data-a="cosEquip" data-k="fx" data-id="">Desequipar</button>' : '<button class="btn sm" data-a="cosEquip" data-k="fx" data-id="'+it.id+'">Equipar</button>') : '<a class="btn sm" href="#/titulos">Escrever título</a>';
    else btn = '<button class="btn sm'+(D.gem >= it.c ? ' primary' : '')+'" data-a="sysBuyOpen" data-k="'+it.kind+'" data-id="'+it.id+'"'+(D.gem >= it.c ? '' : ' disabled')+'>'+U.icon('gem')+U.num(it.c)+' ◆</button>';
    var prev = it.kind === 'fx' ? '<span class="pname '+it.id.replace('fx_','fx-')+'" style="font-size:20px">'+U.esc(H.pname())+'</span>' : '';
    return '<article class="item" style="--rc:var(--glow)"><span class="in">'+U.esc(it.n)+'</span>'+prev+'<span class="dim" style="font-size:13.5px">'+U.esc(it.d)+'</span><div class="row" style="gap:6px;margin-top:auto">'+btn+(owned && it.kind !== 'fx' && it.kind !== 'custom' ? '' : '')+'</div></article>'; }).join('')+'</div></section>';
  var skins = '<section class="win"><div class="win-h">'+U.icon('eye')+'Skins de interface</div><div class="picker">'+SYS.SKINS.filter(function(sk){ return !sk.secret || E.ownsCosmetic(S, SYS.SKINS, sk.id, 'skins'); }).map(function(sk){
    var cs = App.cosState(SYS.SKINS, 'skins', sk), pal = App.SKINPAL[sk.id] || App.SKINPAL.sk_system, eq = S.settings.skin === sk.id;
    return '<div class="pick'+(eq ? ' on' : '')+(cs.st === 'achlock' ? ' lk' : '')+'"><div class="sw" style="background:'+pal[0]+'"><i style="background:'+pal[1]+'"></i><i style="background:'+pal[2]+'"></i><span style="color:'+pal[1]+'">'+U.icon('sparkle')+'</span></div><b>'+U.esc(sk.n)+'</b><span class="dim" style="font-size:12.5px">'+U.esc(sk.d)+'</span>'+App.cosBtn('skins', sk, cs, eq)+'</div>'; }).join('')+'</div></section>';
  var ncs = '<section class="win"><div class="win-h">'+U.icon('status')+'Namecards do perfil</div><div class="picker">'+SYS.NAMECARDS.map(function(nc){
    var cs = App.cosState(SYS.NAMECARDS, 'namecards', nc), eq = P.namecard === nc.id;
    return '<div class="pick'+(eq ? ' on' : '')+(cs.st === 'achlock' ? ' lk' : '')+'"><div class="sw '+nc.id.replace('nc_','nc-')+'"></div><b>'+U.esc(nc.n)+'</b>'+App.cosBtn('namecards', nc, cs, eq)+'</div>'; }).join('')+'</div></section>';
  var frs = '<section class="win"><div class="win-h">'+U.icon('user')+'Molduras de avatar</div><div class="picker">'+SYS.FRAMES.filter(function(fr){ return fr.id !== 'fr_glitch' || E.ownsCosmetic(S, SYS.FRAMES, fr.id, 'frames'); }).map(function(fr){
    var cs = App.cosState(SYS.FRAMES, 'frames', fr), eq = P.frame === fr.id;
    return '<div class="pick'+(eq ? ' on' : '')+(cs.st === 'achlock' ? ' lk' : '')+'"><div class="row" style="justify-content:center;padding:8px 0"><div class="avatar" style="--fs:56px"><div class="fr '+fr.id.replace('fr_','fr-')+'"></div><div class="in" style="font-size:20px">'+U.esc((H.pname()[0] || 'P').toUpperCase())+'</div></div></div><b>'+U.esc(fr.n)+'</b><span class="mono" style="font-size:10.5px;color:'+SYS.RARITY[fr.r].c+'">'+SYS.RARITY[fr.r].n+'</span>'+App.cosBtn('frames', fr, cs, eq)+'</div>'; }).join('')+'</div></section>';
  return head + items + skins + ncs + frs;
};
App.sysItem = function(kind, id){
  var list = kind === 'skins' ? SYS.SKINS : kind === 'namecards' ? SYS.NAMECARDS : kind === 'frames' ? SYS.FRAMES : SYS.SYSSHOP;
  return list.filter(function(x){ return x.id === id; })[0];
};
App.A.sysBuyOpen = function(el){ App.ui.modal = {type:'sysbuy', k:el.getAttribute('data-k'), id:el.getAttribute('data-id')}; App.renderModal(); };
App.M.sysbuy = function(m){
  var it = App.sysItem(m.k, m.id), D = App.D; if (!it) return '';
  return '<section class="win"><div class="win-h">'+U.icon('gem')+'Loja do Sistema<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><h3>'+U.esc(it.n)+'</h3>'+(it.d ? '<p class="dim">'+U.esc(it.d)+'</p>' : '')
    + '<dl class="kv"><dt>Preço</dt><dd>'+U.num(it.c)+' ◆</dd><dt>Saldo depois</dt><dd>'+U.num(D.gem - it.c)+' ◆</dd></dl><p class="faint" style="font-size:12.5px">Cristais são do Sistema: não correspondem a dinheiro real.</p>'
    + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn primary" data-a="sysBuyDo"'+(D.gem >= it.c ? '' : ' disabled')+'>'+U.icon('gem')+'Comprar</button></div></div></section>';
};
App.A.sysBuyDo = function(){
  var m = App.ui.modal, S = App.S, it = m && App.sysItem(m.k, m.id); if (!it || App.D.gem < it.c) return;
  if (m.k === 'skins' || m.k === 'namecards' || m.k === 'frames') { if (it.ach || it.free || (S.owned[m.k] || []).indexOf(it.id) >= 0) return; S.owned[m.k].push(it.id); }
  else if (it.kind === 'ticket') S.owned.tickets = (S.owned.tickets || 0) + 1;
  else if (it.kind === 'fx') { if ((S.owned.fx || []).indexOf(it.id) >= 0) return; S.owned.fx.push(it.id); }
  else if (it.kind === 'custom') { if (S.owned.custom) return; S.owned.custom = true; }
  else return;
  S.sysbuys.push({id:it.id, c:it.c, d:U.today()});
  App.ui.modal = null; App.commit(['core']);
  App.toast({t:'Adquirido · '+it.n, s:m.k === 'skins' ? 'Equipe na própria loja ou no Perfil.' : U.pick(SYS.VOICE.buy), ic:'gem'});
};
App.A.cosEquip = function(el){
  var k = el.getAttribute('data-k'), id = el.getAttribute('data-id'), S = App.S;
  if (k === 'skins') { if (!E.ownsCosmetic(S, SYS.SKINS, id, 'skins')) return; S.settings.skin = id; }
  else if (k === 'namecards') { if (!E.ownsCosmetic(S, SYS.NAMECARDS, id, 'namecards')) return; S.profile.namecard = id; }
  else if (k === 'frames') { if (!E.ownsCosmetic(S, SYS.FRAMES, id, 'frames')) return; S.profile.frame = id; }
  else if (k === 'fx') { if (id && (S.owned.fx || []).indexOf(id) < 0) return; S.profile.fx = id || null; }
  App.commit(['core']);
};
