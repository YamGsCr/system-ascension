/* ===== VIEW v2: lojas com vertentes + Loja do Sistema (aprimoramentos, chaves, baús) ===== */
App.V.lojas = function(){
  var S = App.S, p = App.ui.param, wid = p === 'sistema' ? 'sistema' : (App.way(p) ? p : S.settings.season.main);
  var tabs = SYS.WAYS.map(function(w){ return [w.id, w.cur.code, w.icon]; }).concat([['sistema','Sistema ◆','gem']]);
  var h = H.head('Mercado do Sistema', 'Lojas', 'Créditos não são dinheiro: são <b>permissão</b> para gastar dentro da regra de cada item. Itens caros entram em cooldown — desistir no cooldown também é vitória. Na Loja do Sistema, ◆ compram aprimoramentos, chaves de dungeon, baús e cosméticos.') + H.tabs('lojas', tabs, wid);
  return h + (wid === 'sistema' ? App.sysShop() : App.wayShop(wid));
};
App.wayShop = function(wid){
  var S = App.S, D = App.D, w = App.way(wid), sub = App.ui.sub, brs = w.branches || [], filt = sub && (sub === 'geral' || w.brmap[sub]) ? sub : 'todos';
  var pend = S.pending.filter(function(x){ return x.way === wid; });
  var head = '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon(w.icon)+'Loja · '+U.esc(w.name)+'</div><div class="kpis">'
    + '<div class="kpi"><b style="color:'+w.color+'">'+U.num(D.wayCr[wid])+'</b><span>'+U.esc(w.cur.name)+'</span></div><div class="kpi"><b>'+D.seals[wid]+'</b><span>selos disponíveis</span></div><div class="kpi"><b>'+U.num(D.wayXP[wid])+'</b><span>XP do Caminho</span></div><div class="kpi"><b>'+w.shop.length+'</b><span>itens na loja</span></div></div>'
    + '<p class="faint" style="font-size:12.5px;margin-top:10px">Ganhe '+w.cur.code+' concluindo nós, Feitos, livros aplicados, diárias do Caminho, conquistas e certificações. Itens de vertente abrem com o XP daquela vertente; lendários pedem Selos.</p></section>';
  var chips = brs.length ? '<div class="filterrow"><a class="fchip'+(filt === 'todos' ? ' on' : '')+'" href="#/lojas/'+wid+'">Todos</a><a class="fchip'+(filt === 'geral' ? ' on' : '')+'" href="#/lojas/'+wid+'/geral">Geral</a>'+brs.map(function(b){ return '<a class="fchip'+(filt === b.id ? ' on' : '')+'" href="#/lojas/'+wid+'/'+b.id+'">'+U.icon(b.ic || 'star')+U.esc(b.n)+'</a>'; }).join('')+'</div>' : '';
  var pendH = pend.length ? '<section class="win"><div class="win-h" style="color:var(--warn)">'+U.icon('clock')+'Em cooldown</div><div class="stack" style="gap:8px">'+pend.map(function(x){ var ready = Date.now() >= Date.parse(x.until); return '<div class="res" style="cursor:default"><span class="warn">'+U.icon('clock')+'</span><span style="min-width:0"><b>'+U.esc(x.n)+'</b><br><span class="ty">'+(ready ? 'cooldown encerrado — ainda quer?' : 'libera em '+App.fmtLeft(x.until))+' · '+x.c+' '+w.cur.code+'</span></span><span class="row" style="gap:6px;flex-wrap:nowrap">'+(ready ? '<button class="btn sm primary" data-a="buyOpen" data-way="'+wid+'" data-id="'+x.id+'">Concluir</button>' : '')+'<button class="btn sm ghost" data-a="cdCancel" data-id="'+x.id+'">Desistir</button></span></div>'; }).join('')+'</div></section>' : '';
  var items = w.shop.filter(function(it){ return filt === 'todos' || (filt === 'geral' ? !it.br : it.br === filt); });
  var body = SYS.RARITY_ORDER.map(function(r){
    var list = items.filter(function(it){ return it.tier === r; }); if (!list.length) return '';
    return '<section class="stack" style="gap:10px"><span class="eyebrow" style="color:'+SYS.RARITY[r].c+'">'+App.TIERN[r]+' · '+list.length+'</span><div class="shop">'+list.map(function(it){ return App.itemCard(wid, it); }).join('')+'</div></section>';
  }).join('') || '<div class="empty">Nada nesta vertente ainda.</div>';
  var hist = S.buys.filter(function(b){ return b.way === wid; }).slice(-20).reverse();
  var histH = '<section class="win"><div class="win-h">'+U.icon('bag')+'Histórico de compras</div>'+(hist.length ? hist.map(function(b){ return '<div class="notif"><span style="color:'+w.color+'">'+U.icon('bag')+'</span><span>'+U.esc(b.n)+' <span class="faint mono" style="font-size:11px">· '+b.c+' '+w.cur.code+(b.seals ? ' · '+b.seals+' selos' : '')+'</span></span><span class="row" style="gap:6px"><span class="faint mono" style="font-size:11px">'+U.fmtDate(b.d)+'</span>'+(b.d === U.today() && b.t ? '<button class="btn sm ghost" data-a="refund" data-t="'+U.esc(b.t)+'">Estornar</button>' : '')+'</span></div>'; }).join('') : '<div class="empty">Nada comprado ainda. A loja sente sua falta (sua reserva, não).</div>')+'</section>';
  return head + chips + pendH + body + histH;
};
App.itemCard = function(wid, it){
  var S = App.S, D = App.D, w = App.way(wid), st = E.itemState(S, D, wid, it), R = SYS.RARITY[it.tier] || SYS.RARITY.common, b = it.br && w.brmap[it.br];
  var reqs = [];
  if (b && it.bmx) reqs.push([((D.brXP[wid] || {})[it.br] || 0) >= it.bmx, 'XP em '+b.n+' ≥ '+U.num(it.bmx)]);
  else if (it.mx) reqs.push([D.wayXP[wid] >= it.mx, 'XP do Caminho ≥ '+U.num(it.mx)]);
  if (it.req) reqs.push([E.reqMet(S, D, it.req), E.reqLabel(it.req)]);
  if (it.seals) reqs.push([D.seals[wid] >= it.seals, it.seals+' Selos do Caminho (consumidos)']);
  var tags = '<div class="row" style="gap:6px">'+(b ? '<span class="chip" style="color:'+w.color+'">'+U.icon(b.ic || 'star')+U.esc(b.n)+'</span>' : '')+'<span class="chip">regra: '+U.esc(it.rule)+'</span>'+(it.rep ? '<span class="chip glow">1x por '+U.esc(it.lim || 'vez')+'</span>' : '')+(it.cd ? '<span class="chip warn">'+U.icon('clock')+'cooldown '+(it.cd >= 168 ? '7 dias' : it.cd+'h')+'</span>' : '')+'</div>';
  var act = '';
  if (st.st === 'owned') { var bb = S.buys.filter(function(x){ return x.id === it.id; }).pop(); act = '<span class="chip ok">'+U.icon('check')+'adquirido '+U.fmtDate(bb.d)+'</span>'; }
  else if (st.st === 'limit') act = '<span class="chip">'+U.esc(st.reasons[0])+'</span>';
  else if (st.st === 'cooldown') act = '<span class="chip warn">'+U.icon('clock')+App.fmtLeft(st.pend.until)+'</span><button class="btn sm ghost" data-a="cdCancel" data-id="'+it.id+'">Desistir</button>';
  else if (st.st === 'ready') act = '<button class="btn sm primary" data-a="buyOpen" data-way="'+wid+'" data-id="'+it.id+'"'+(st.reasons.length || st.poor ? ' disabled' : '')+'>Concluir compra</button><button class="btn sm ghost" data-a="cdCancel" data-id="'+it.id+'">Desistir</button>';
  else if (st.st === 'available') act = it.cd ? '<button class="btn sm" data-a="cdStart" data-way="'+wid+'" data-id="'+it.id+'">'+U.icon('clock')+'Iniciar cooldown</button>' : '<button class="btn sm primary" data-a="buyOpen" data-way="'+wid+'" data-id="'+it.id+'">'+U.icon('bag')+'Comprar</button>';
  else act = '<button class="btn sm" disabled>'+U.icon('lock')+'Bloqueado</button>';
  return '<article class="item'+(st.st === 'locked' ? ' lk' : '')+'" style="--rc:'+R.c+'"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap;gap:8px"><span class="in">'+U.esc(it.n)+'</span><span class="price" style="color:'+w.color+'">'+U.num(it.c)+'<small class="mono" style="font-size:10px;margin-left:3px">'+w.cur.code+'</small></span></div>'
    + (it.d ? '<span class="dim" style="font-size:13px">'+U.esc(it.d)+'</span>' : '') + tags
    + (reqs.length ? '<div class="req">'+reqs.map(function(r){ return '<span class="row" style="gap:6px;flex-wrap:nowrap"><span class="'+(r[0] ? 'ok' : 'faint')+'">'+U.icon(r[0] ? 'check' : 'lock')+'</span>'+U.esc(r[1])+'</span>'; }).join('')+'</div>' : '')
    + (st.st === 'locked' && D.wayCr[wid] < it.c && reqs.every(function(r){ return r[0]; }) ? '<span class="faint mono" style="font-size:11.5px">faltam '+U.num(it.c - D.wayCr[wid])+' '+w.cur.code+'</span>' : '')
    + '<div class="row" style="gap:6px;margin-top:auto">'+act+'</div></article>';
};

/* ---------- Loja do Sistema ---------- */
App.sysItem = function(kind, id){
  if (kind === 'skins') return SYS.SKINS.filter(function(x){ return x.id === id; })[0];
  if (kind === 'namecards') return SYS.NAMECARDS.filter(function(x){ return x.id === id; })[0];
  if (kind === 'frames') return SYS.FRAMES.filter(function(x){ return x.id === id; })[0];
  if (kind === 'key') return {id:'key_'+id, rank:id, n:'Chave de Dungeon · Rank '+id, d:'Abre uma dungeon especial Rank '+id+'.', c:SYS.KEYPRICE[id], kind:'key'};
  if (kind === 'chest') { var ch = E.CHEST[id]; return ch ? {id:ch.id, n:ch.n, d:ch.d, c:ch.c, kind:'chest'} : null; }
  return SYS.SYSSHOP.filter(function(x){ return x.id === id; })[0];
};
App.sysCan = function(it){
  var S = App.S, D = App.D; if (!it || D.gem < it.c) return false;
  if (it.kind === 'freeze') return (S.owned.freezes || 0) < SYS.FREEZE_MAX;
  if (it.kind === 'repair') return E.repairable(S);
  if (it.kind === 'showcase') return !S.owned.showcase12;
  if (it.kind === 'custom') return !S.owned.custom;
  if (it.kind === 'fx') return (S.owned.fx || []).indexOf(it.id) < 0;
  return true;
};
App.sysShop = function(){
  var S = App.S, D = App.D, P = S.profile, sec = App.ui.sub || 'tudo';
  var head = '<section class="win"><div class="win-h">'+U.icon('gem')+'Loja do Sistema</div><div class="kpis"><div class="kpi"><b class="glow">'+U.num(D.gem)+'</b><span>cristais ◆</span></div><div class="kpi"><b>'+U.num(D.gemEarned)+'</b><span>◆ ganhos no total</span></div><div class="kpi"><b>'+(S.owned.freezes || 0)+'/'+SYS.FREEZE_MAX+'</b><span>gelos</span></div><div class="kpi"><b>'+(S.owned.tickets||0)+'</b><span>tickets de descanso</span></div></div>'
    + '<p class="faint" style="font-size:12.5px;margin-top:10px">◆ vêm de: dia com todas as diárias (+10), dia extra (+3), cada missão extra (+1), tocar grama (+3), semana fechada (+50), revisão mensal (+100), meta concluída (+30), dungeons e conquistas de sistema. ◆ nunca custam dinheiro real.</p></section>';
  var secs = [['tudo','Tudo'],['aprimoramentos','Aprimoramentos'],['chaves','Chaves'],['baus','Baús'],['cosmeticos','Cosméticos']];
  var chips = '<div class="filterrow">'+secs.map(function(s){ return '<a class="fchip'+(sec === s[0] ? ' on' : '')+'" href="#/lojas/sistema/'+s[0]+'">'+s[1]+'</a>'; }).join('')+'</div>';
  function show(k){ return sec === 'tudo' || sec === k; }
  var out = head + chips;
  if (show('aprimoramentos')) {
    var ups = ['up_freeze','up_repair','tk_rest','up_showcase','ct_title'].map(function(id){ return SYS.SYSSHOP.filter(function(x){ return x.id === id; })[0]; }).filter(Boolean);
    out += '<section class="win"><div class="win-h">'+U.icon('sparkle')+'Aprimoramentos do Sistema</div><div class="shop">'+ups.map(function(it){
      var can = App.sysCan(it), note = it.kind === 'freeze' ? 'estoque '+(S.owned.freezes || 0)+'/'+SYS.FREEZE_MAX : it.kind === 'repair' ? (E.repairable(S) ? 'sequência de '+S.streakLost.len+' dias pode ser reacendida' : 'só aparece útil logo depois de perder a sequência') : it.kind === 'showcase' ? (S.owned.showcase12 ? 'já adquirida' : 'vitrine 8 → 12') : it.kind === 'custom' ? (S.owned.custom ? 'já adquirido' : '') : it.kind === 'ticket' ? 'em estoque: '+(S.owned.tickets || 0) : '';
      var ic = {freeze:'shield', repair:'flame', ticket:'moon', showcase:'medal', custom:'banner'}[it.kind] || 'sparkle';
      return '<article class="item" style="--rc:var(--glow)"><div class="row between" style="flex-wrap:nowrap;align-items:flex-start"><span class="in">'+U.esc(it.n)+'</span><span class="upic">'+U.icon(ic)+'</span></div><span class="dim" style="font-size:13.5px">'+U.esc(it.d)+'</span>'+(note ? '<span class="faint mono" style="font-size:11px">'+U.esc(note)+'</span>' : '')+'<div class="row" style="margin-top:auto"><button class="btn sm'+(can ? ' primary' : '')+'" data-a="sysBuyOpen" data-k="up" data-id="'+it.id+'"'+(can ? '' : ' disabled')+'>'+U.icon('gem')+U.num(it.c)+' ◆</button></div></article>';
    }).join('')+'</div></section>';
  }
  if (show('chaves')) {
    out += '<section class="win"><div class="win-h">'+U.icon('lock')+'Chaves de Dungeon<a class="act" href="#/portoes/dungeons">ver dungeons →</a></div>'+App.keysRow()+'<div class="shop" style="margin-top:12px">'+SYS.RANKS.map(function(r){
      var n = SYS.DUNGEONS.filter(function(d){ return d.rank === r; }), c = SYS.RANKC[r], can = D.gem >= SYS.KEYPRICE[r];
      return '<article class="item keyitem" style="--rc:'+c+'"><div class="row" style="gap:12px;flex-wrap:nowrap">'+U.portal(r, 48)+'<div class="stack" style="gap:2px;min-width:0"><span class="in">Chave Rank '+r+'</span><span class="dim" style="font-size:12.5px">'+n.map(function(d){ return U.esc(d.n); }).join(' · ')+'</span></div></div><div class="row between" style="margin-top:auto"><span class="faint mono" style="font-size:11px">em estoque: '+(S.owned.keys[r] || 0)+'</span><button class="btn sm'+(can ? ' primary' : '')+'" data-a="sysBuyOpen" data-k="key" data-id="'+r+'"'+(can ? '' : ' disabled')+'>'+U.icon('gem')+U.num(SYS.KEYPRICE[r])+' ◆</button></div></article>';
    }).join('')+'</div></section>';
  }
  if (show('baus')) {
    out += '<section class="win"><div class="win-h">'+U.icon('bag')+'Baús<button class="act" data-a="oddsToggle">'+(App.ui.f.odds ? 'esconder probabilidades' : 'ver probabilidades')+'</button></div><p class="dim" style="font-size:13.5px;margin-bottom:12px">Sem dinheiro real, odds públicas, pity garantido e duplicata vira ◆. Se é pra ter gacha, que seja honesto.</p><div class="chests">'
      + SYS.CHESTS.map(function(ch){
          var R = SYS.RARITY[ch.r], can = D.gem >= ch.c, pc = ch.pity ? (S.chests.pity[ch.id] || 0) : 0, tot = ch.drops.reduce(function(s, x){ return s + x[0]; }, 0);
          var odds = App.ui.f.odds ? '<table class="tbl odds"><tbody>'+ch.drops.map(function(x){ return '<tr><td>'+U.esc(App.dropName(x[1]))+'</td><td class="mono">'+(x[0] * 100 / tot).toFixed(0)+'%</td></tr>'; }).join('')+'</tbody></table>' : '';
          return '<article class="chestcard" style="--rc:'+R.c+'"><div class="chest-art">'+U.chest(ch, 104)+'</div><div class="stack" style="gap:6px;min-width:0"><div class="row" style="gap:6px"><b>'+U.esc(ch.n)+'</b><span class="chip" style="color:'+R.c+';border-color:'+U.hexA(R.c,.5)+'">'+R.n+'</span></div><span class="dim" style="font-size:13px">'+U.esc(ch.d)+'</span>'
            + (ch.pity ? '<div class="stack" style="gap:3px"><div class="row between mono" style="font-size:11px"><span class="dim">pity: '+App.TIERN[ch.pity.pool].toLowerCase()+' garantido</span><span>'+pc+'/'+ch.pity.n+'</span></div>'+H.bar(U.pct(pc, ch.pity.n), 'thin')+'</div>' : '')
            + odds + '<div class="row" style="justify-content:flex-end;margin-top:auto"><button class="btn sm'+(can ? ' primary' : '')+'" data-a="sysBuyOpen" data-k="chest" data-id="'+ch.id+'"'+(can ? '' : ' disabled')+'>'+U.icon('gem')+'Abrir · '+U.num(ch.c)+' ◆</button></div></div></article>';
        }).join('') + '</div>'
      + ((S.chests.log || []).length ? '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Últimas aberturas</span><div class="stack" style="gap:0;margin-top:6px">'+S.chests.log.slice(-6).reverse().map(function(r){ return '<div class="notif"><span>'+U.icon('bag')+'</span><span>'+U.esc(E.CHEST[r.chest] ? E.CHEST[r.chest].n : r.chest)+' → <b>'+U.esc(App.resName(r))+'</b></span><span class="faint mono" style="font-size:11px">'+U.fmtDate(r.d)+'</span></div>'; }).join('')+'</div>' : '')
      + '</section>';
  }
  if (show('cosmeticos')) {
    var fxs = SYS.FX.map(function(f){ var own = (S.owned.fx || []).indexOf(f.id) >= 0, shopIt = SYS.SYSSHOP.filter(function(x){ return x.id === f.id; })[0], eq = P.fx === f.id;
      var btn = own ? (eq ? '<button class="btn sm ghost" data-a="cosEquip" data-k="fx" data-id="">Desequipar</button>' : '<button class="btn sm" data-a="cosEquip" data-k="fx" data-id="'+f.id+'">Equipar</button>') : shopIt ? '<button class="btn sm'+(D.gem >= shopIt.c ? ' primary' : '')+'" data-a="sysBuyOpen" data-k="up" data-id="'+f.id+'"'+(D.gem >= shopIt.c ? '' : ' disabled')+'>'+U.icon('gem')+U.num(shopIt.c)+' ◆</button>' : '<span class="chip">'+U.icon('bag')+'só em baús ('+App.TIERN[f.chest].toLowerCase()+')</span>';
      return '<div class="pick'+(eq ? ' on' : '')+'">'+(f.anim ? '<span class="chip glow anim">animado</span>' : '')+'<div class="sw fxsw"><span class="pname '+f.id.replace('fx_','fx-')+'" style="font-size:19px">'+U.esc(H.pname())+'</span></div><b>'+U.esc(f.n)+'</b>'+btn+'</div>'; }).join('');
    out += '<section class="win"><div class="win-h">'+U.icon('sparkle')+'Efeitos de nome</div><div class="picker">'+fxs+'</div></section>';
    out += App.cosSections();
  }
  return out;
};
App.dropName = function(s){ return s.k === 'gem' ? s.v + ' ◆' : s.k === 'ticket' ? s.v + ' ticket' + (s.v > 1 ? 's' : '') + ' de descanso' : s.k === 'freeze' ? s.v + ' Gelo' + (s.v > 1 ? 's' : '') : s.k === 'key' ? 'Chave Rank ' + s.rank : 'Cosmético ' + App.TIERN[s.pool].toLowerCase() + ' exclusivo'; };
App.resName = function(r){ if (r.k === 'gem') return '+' + r.v + ' ◆'; if (r.k === 'ticket') return r.v + ' ticket'; if (r.k === 'freeze') return r.v ? r.v + ' Gelo' : 'Gelo (estoque cheio → +' + r.conv + ' ◆)'; if (r.k === 'key') return 'Chave Rank ' + r.rank; if (r.dup) return 'Duplicata → +' + r.v + ' ◆'; return E.cosName(r.kind, r.item) + (r.pity ? ' (pity)' : ''); };
App.A.oddsToggle = function(){ App.ui.f.odds = !App.ui.f.odds; if (App.ui.f.odds && !App.S.flags.odds) { App.S.flags.odds = true; App.commit(['core']); return; } App.renderView(); };
App.cosSections = function(){
  var S = App.S, P = S.profile;
  function lockLabel(it){ if (it.chest) return 'só em baús (' + App.TIERN[it.chest].toLowerCase() + ')'; if (it.dun) return 'dungeon: ' + E.DUN[it.dun].n; return null; }
  var skins = '<section class="win"><div class="win-h">'+U.icon('eye')+'Skins de interface</div><div class="picker">'+SYS.SKINS.filter(function(sk){ return !sk.secret || E.ownsCosmetic(S, SYS.SKINS, sk.id, 'skins'); }).map(function(sk){
    var cs = App.cosState(SYS.SKINS, 'skins', sk), pal = App.SKINPAL[sk.id] || App.SKINPAL.sk_system, eq = S.settings.skin === sk.id;
    return '<div class="pick'+(eq ? ' on' : '')+(cs.st === 'achlock' ? ' lk' : '')+'"><div class="sw" style="background:'+pal[0]+'"><i style="background:'+pal[1]+'"></i><i style="background:'+pal[2]+'"></i><span style="color:'+pal[1]+'">'+U.icon('sparkle')+'</span></div><b>'+U.esc(sk.n)+'</b><span class="dim" style="font-size:12.5px">'+U.esc(sk.d)+'</span>'+App.cosBtn('skins', sk, cs, eq)+'</div>'; }).join('')+'</div></section>';
  var ncs = '<section class="win"><div class="win-h">'+U.icon('status')+'Namecards do perfil</div><div class="picker">'+SYS.NAMECARDS.map(function(nc){
    var own = E.ownsCosmetic(S, SYS.NAMECARDS, nc.id, 'namecards'), eq = P.namecard === nc.id, ll = lockLabel(nc), cs = App.cosState(SYS.NAMECARDS, 'namecards', nc);
    var btn = own ? (eq ? '<span class="chip ok">'+U.icon('check')+'equipado</span>' : '<button class="btn sm" data-a="cosEquip" data-k="namecards" data-id="'+nc.id+'">Equipar</button>') : ll ? '<span class="chip">'+U.icon('lock')+U.esc(ll)+'</span>' : App.cosBtn('namecards', nc, cs, eq);
    return '<div class="pick'+(eq ? ' on' : '')+(!own && (ll || cs.st === 'achlock') ? ' lk' : '')+'">'+(nc.anim ? '<span class="chip glow anim">animado</span>' : '')+'<div class="sw '+nc.id.replace('nc_','nc-')+'"></div><b>'+U.esc(nc.n)+'</b>'+btn+'</div>'; }).join('')+'</div></section>';
  var frs = '<section class="win"><div class="win-h">'+U.icon('user')+'Molduras de avatar</div><div class="picker">'+SYS.FRAMES.filter(function(fr){ return fr.id !== 'fr_glitch' || E.ownsCosmetic(S, SYS.FRAMES, fr.id, 'frames'); }).map(function(fr){
    var own = E.ownsCosmetic(S, SYS.FRAMES, fr.id, 'frames'), eq = P.frame === fr.id, ll = lockLabel(fr), cs = App.cosState(SYS.FRAMES, 'frames', fr);
    var btn = own ? (eq ? '<span class="chip ok">'+U.icon('check')+'equipado</span>' : '<button class="btn sm" data-a="cosEquip" data-k="frames" data-id="'+fr.id+'">Equipar</button>') : ll ? '<span class="chip">'+U.icon('lock')+U.esc(ll)+'</span>' : App.cosBtn('frames', fr, cs, eq);
    return '<div class="pick'+(eq ? ' on' : '')+(!own && (ll || cs.st === 'achlock') ? ' lk' : '')+'">'+(fr.anim ? '<span class="chip glow anim">animado</span>' : '')+'<div class="row" style="justify-content:center;padding:8px 0"><div class="avatar" style="--fs:56px"><div class="fr '+fr.id.replace('fr_','fr-')+'"></div><div class="in" style="font-size:20px">'+U.esc((H.pname()[0] || 'P').toUpperCase())+'</div></div></div><b>'+U.esc(fr.n)+'</b><span class="mono" style="font-size:10.5px;color:'+SYS.RARITY[fr.r].c+'">'+SYS.RARITY[fr.r].n+'</span>'+btn+'</div>'; }).join('')+'</div></section>';
  return skins + ncs + frs;
};
App.M.sysbuy = function(m){
  var it = App.sysItem(m.k, m.id), D = App.D; if (!it) return '';
  var can = m.k === 'skins' || m.k === 'namecards' || m.k === 'frames' ? D.gem >= it.c : App.sysCan(it);
  var art = m.k === 'chest' ? U.chest(E.CHEST[it.id], 110) : m.k === 'key' ? U.portal(it.rank, 70) : '';
  return '<section class="win"><div class="win-h">'+U.icon('gem')+'Loja do Sistema<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"'+(art ? ' style="align-items:center;text-align:center"' : '')+'>'+art+'<h3>'+U.esc(it.n)+'</h3>'+(it.d ? '<p class="dim">'+U.esc(it.d)+'</p>' : '')
    + '<dl class="kv" style="text-align:left;width:100%"><dt>Preço</dt><dd>'+U.num(it.c)+' ◆</dd><dt>Saldo depois</dt><dd>'+U.num(D.gem - it.c)+' ◆</dd></dl><p class="faint" style="font-size:12.5px">Cristais são do Sistema: não correspondem a dinheiro real.</p>'
    + '<div class="row" style="justify-content:flex-end;width:100%"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn primary" data-a="sysBuyDo"'+(can ? '' : ' disabled')+'>'+U.icon('gem')+(m.k === 'chest' ? 'Abrir' : 'Comprar')+'</button></div></div></section>';
};
App.A.sysBuyDo = function(){
  var m = App.ui.modal, S = App.S, it = m && App.sysItem(m.k, m.id); if (!it || App.D.gem < it.c) return;
  var toast = U.pick(SYS.VOICE.buy), result = null;
  if (m.k === 'skins' || m.k === 'namecards' || m.k === 'frames') { if (it.ach || it.free || it.chest || it.dun || (S.owned[m.k] || []).indexOf(it.id) >= 0) return; S.owned[m.k].push(it.id); toast = 'Equipe na loja ou no Perfil.'; }
  else if (m.k === 'key') { S.owned.keys[it.rank] = (S.owned.keys[it.rank] || 0) + 1; toast = 'Chave guardada. O portal espera.'; }
  else if (m.k === 'chest') { /* abre depois de registrar o gasto */ }
  else if (!App.sysCan(it)) return;
  else if (it.kind === 'ticket') S.owned.tickets = (S.owned.tickets || 0) + 1;
  else if (it.kind === 'fx') S.owned.fx.push(it.id);
  else if (it.kind === 'custom') S.owned.custom = true;
  else if (it.kind === 'freeze') { S.owned.freezes = (S.owned.freezes || 0) + 1; toast = 'Gelo equipado. A chama agradece.'; }
  else if (it.kind === 'showcase') { S.owned.showcase12 = true; toast = 'Vitrine com 12 espaços.'; }
  else if (it.kind === 'repair') { if (!E.repair(S)) return; toast = 'A chama voltou. Não conta pra ninguém.'; }
  else return;
  S.sysbuys.push({id:it.id, c:it.c, d:U.today()});
  if (m.k === 'chest') { result = E.openChest(S, it.id); App.ui.modal = {type:'chestOpen', id:it.id + '#' + S.chests.n, cid:it.id, res:result}; App.commit(['core']); return; }
  App.ui.modal = null; App.commit(['core']);
  App.toast({t:'Adquirido · ' + it.n, s:toast, ic:'gem'});
};
App.M.chestOpen = function(m){
  var ch = E.CHEST[m.cid], r = m.res, R = SYS.RARITY[r.k === 'cos' && !r.dup ? r.pool : ch.r] || SYS.RARITY.rare;
  var big = r.k === 'cos' && !r.dup ? (r.kind === 'namecards' ? '<div class="namecard mini"><div class="ncbg '+r.item.replace('nc_','nc-')+'"></div></div>' : r.kind === 'frames' ? '<div class="avatar" style="--fs:80px"><div class="fr '+r.item.replace('fr_','fr-')+'"></div><div class="in">'+U.esc((H.pname()[0] || 'P').toUpperCase())+'</div></div>' : '<span class="pname '+r.item.replace('fx_','fx-')+'" style="font-size:30px">'+U.esc(H.pname())+'</span>')
    : r.k === 'key' ? U.portal(r.rank, 70) : '<div class="dropic">'+U.icon(r.k === 'gem' || r.dup ? 'gem' : r.k === 'freeze' ? 'shield' : 'moon')+'</div>';
  return '<section class="win chestmodal" style="--rc:'+R.c+'"><div class="win-h" style="color:'+R.c+'">'+U.icon('bag')+U.esc(ch.n)+'</div><div class="stack" style="align-items:center;text-align:center;gap:10px">'
    + '<div class="chest-stage">'+U.chest(ch, 130, true)+'<div class="drop">'+big+'</div></div>'
    + '<span class="eyebrow" style="color:'+R.c+'">'+(r.pity ? 'Pity ativado · ' : '')+(r.k === 'cos' && !r.dup ? App.TIERN[r.pool] + ' exclusivo' : 'Drop')+'</span><h2>'+U.esc(App.resName(r))+'</h2>'
    + (r.k === 'cos' && !r.dup ? '<p class="dim">Já está no seu inventário. Equipe no Perfil ou na loja.</p>' : '')
    + '<div class="row" style="justify-content:center"><button class="btn ghost" data-a="closeModal">Fechar</button>'+(App.D.gem >= ch.c ? '<button class="btn primary" data-a="chestAgain" data-id="'+ch.id+'">'+U.icon('gem')+'Abrir outro · '+U.num(ch.c)+' ◆</button>' : '')+'</div></div></section>';
};
App.A.chestAgain = function(el){ App.ui.modal = {type:'sysbuy', k:'chest', id:el.getAttribute('data-id')}; App.A.sysBuyDo(); };
