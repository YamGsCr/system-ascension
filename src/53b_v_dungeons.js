/* ===== VIEW v2: Portões (selos + dungeons especiais) ===== */
App.V.portoes = function(){
  var S = App.S, D = App.D, tab = App.ui.param === 'dungeons' ? 'dungeons' : 'selos', keys = SYS.RANKS.reduce(function(s, r){ return s + (S.owned.keys[r] || 0); }, 0);
  var h = H.head('Portões, Selos & Dungeons', 'Portões', 'Selos fecham os arcos dos Caminhos com evidência, defesa oral e checagem de falha. Dungeons especiais são desafios de dias seguidos que você abre com chaves — recompensas raras, títulos e cosméticos exclusivos.');
  h += H.tabs('portoes', [['selos','Selos dos Caminhos','seal', D.gatesDone+'/'+D.gatesTotal],['dungeons','Dungeons especiais','gate', S.dun ? 'ativa' : keys + ' chaves']], tab);
  return h + (tab === 'dungeons' ? App.dungeonsView() : App.gatesSeals());
};
App.keysRow = function(){
  var S = App.S;
  return '<div class="keys">' + SYS.RANKS.map(function(r){ var n = S.owned.keys[r] || 0; return '<span class="key'+(n ? '' : ' none')+'" style="--kc:'+SYS.RANKC[r]+'" data-tip="Chave Rank '+r+' · '+n+' em estoque">'+U.icon('lock')+'<b>'+r+'</b><em>'+n+'</em></span>'; }).join('') + '<a class="btn sm ghost" href="#/lojas/sistema/chaves">'+U.icon('bag')+'Comprar chaves</a></div>';
};
App.dunRew = function(dg){
  var r = dg.rew, out = ['+' + U.num(r.gem) + ' ◆'];
  if (r.chest) out.push((r.chests || 1) + '× ' + E.CHEST[r.chest].n);
  if (r.freeze) out.push(r.freeze + ' Gelo');
  if (r.cos) out.push('exclusivo: ' + E.cosName(r.cos.slice(0,3) === 'nc_' ? 'namecards' : 'frames', r.cos));
  out.push('título: ' + dg.ach.title);
  return out;
};
App.dungeonsView = function(){
  var S = App.S, D = App.D, out = '<section class="win"><div class="win-h">'+U.icon('lock')+'Chaves</div>'+App.keysRow()+'<p class="faint" style="font-size:12.5px;margin-top:10px">Chaves vêm da Loja do Sistema, de baús e de marcos da sequência (7, 30, 100, 180 e 365 dias). Uma dungeon por vez. Dia de descanso oficial conta como andar vencido — a dungeon respeita a Regra da Vida. Você pode marcar o dia de ontem até o reset seguinte.</p></section>';
  if (S.dun) out += App.dunActive();
  var runs = {}; (S.dunLog || []).forEach(function(l){ (runs[l.id] = runs[l.id] || {c:0, f:0}); if (l.st === 'cleared') runs[l.id].c++; else runs[l.id].f++; });
  out += SYS.RANKS.map(function(rk){
    var list = SYS.DUNGEONS.filter(function(d){ return d.rank === rk; }); if (!list.length) return '';
    return '<section class="stack" style="gap:10px"><div class="rankhead" style="--kc:'+SYS.RANKC[rk]+'"><b>Rank '+rk+'</b><span>'+list.length+' dungeon'+(list.length > 1 ? 's' : '')+' · chave '+SYS.KEYPRICE[rk]+' ◆</span></div><div class="dungrid">'
      + list.map(function(dg){
          var rr = runs[dg.id] || {c:0, f:0}, can = !S.dun && (S.owned.keys[rk] || 0) > 0;
          return '<article class="dun" style="--kc:'+SYS.RANKC[rk]+'"><div class="dun-art">'+U.portal(rk, 76, {dim:!can && !rr.c})+'</div><div class="stack" style="gap:6px;min-width:0"><div class="row" style="gap:6px"><span class="chip" style="color:'+SYS.RANKC[rk]+';border-color:'+U.hexA(SYS.RANKC[rk],.5)+'">Rank '+rk+'</span><span class="chip">'+dg.days+' dias</span><span class="chip">'+(dg.rest || 0)+' respiro'+((dg.rest || 0) === 1 ? '' : 's')+'</span>'+(rr.c ? '<span class="chip ok">'+U.icon('check')+'limpa ×'+rr.c+'</span>' : '')+'</div>'
            + '<h3>'+U.esc(dg.n)+'</h3><p class="dim" style="font-size:13.5px;font-style:italic">'+U.esc(dg.lore)+'</p>'
            + '<ul class="list" style="font-size:13.5px">'+dg.daily.map(function(x){ return '<li><span>'+U.esc(x)+' <span class="faint">(todo dia)</span></span></li>'; }).join('')+(dg.fin || []).map(function(x){ return '<li><span>'+U.esc(x)+' <span class="faint">(último dia)</span></span></li>'; }).join('')+'</ul>'
            + '<div class="row" style="gap:6px">'+App.dunRew(dg).map(function(t){ return '<span class="chip glow">'+U.esc(t)+'</span>'; }).join('')+'</div>'
            + '<div class="row" style="justify-content:flex-end"><button class="btn sm'+(can ? ' primary' : '')+'" data-a="dunEnterOpen" data-id="'+dg.id+'"'+(can ? '' : ' disabled')+'>'+U.icon('gate')+(S.dun ? 'Já existe uma ativa' : (S.owned.keys[rk] || 0) ? 'Entrar · usa 1 chave '+rk : 'Sem chave '+rk)+'</button></div></div></article>';
        }).join('') + '</div></section>';
  }).join('');
  var log = (S.dunLog || []).slice(-10).reverse();
  if (log.length) out += '<section class="win"><div class="win-h">'+U.icon('scroll')+'Registro de incursões</div>'+log.map(function(l){ var dg = E.DUN[l.id]; if (!dg) return ''; return '<div class="notif"><span style="color:'+SYS.RANKC[dg.rank]+'">'+U.icon(l.st === 'cleared' ? 'crown' : 'gate')+'</span><span>'+U.esc(dg.n)+' · <b class="'+(l.st === 'cleared' ? 'ok' : 'bad')+'">'+(l.st === 'cleared' ? 'limpa' : l.st === 'failed' ? 'falhou' : 'abandonada')+'</b></span><span class="faint mono" style="font-size:11px">'+U.fmtDate(l.start)+' → '+U.fmtDate(l.end)+'</span></div>'; }).join('')+'</section>';
  return out;
};
App.dunActive = function(){
  var S = App.S, dun = S.dun, dg = E.DUN[dun.id], t = U.today(), idx = U.daysBetween(dun.start, t), c = SYS.RANKC[dg.rank];
  var tiles = '';
  for (var i = 0; i < dg.days; i++) {
    var st = dun.skip[i] ? 'skip' : E.dunDayOk(S, dun, i) ? 'ok' : i === idx ? 'today' : i < idx ? 'late' : 'fut';
    tiles += '<i class="dt '+st+'" data-tip="Dia '+(i+1)+' · '+U.fmtDate(E.dunDate(dun, i))+' · '+{skip:'respiro usado', ok:'andar vencido', today:'hoje', late:'pendente (marque até o próximo reset)', fut:'à frente'}[st]+'">'+(i+1)+'</i>';
  }
  function checklist(i){
    if (i < 0 || i >= dg.days) return '';
    var m = dun.marks[i] || [], day = E.dunDate(dun, i), fin = i === dg.days - 1 && dg.fin, f = dun.marks.f || [];
    return '<div class="stack" style="gap:2px"><span class="eyebrow" style="color:'+c+'">Dia '+(i+1)+' · '+U.fmtDate(day)+(i === idx ? ' · hoje' : ' · ontem')+'</span>'
      + dg.daily.map(function(x, j){ return '<label class="check"><input type="checkbox" data-c="dunMark" data-i2="'+i+'" data-j="'+j+'"'+(m[j] ? ' checked' : '')+'><span>'+U.esc(x)+'</span></label>'; }).join('')
      + (fin ? dg.fin.map(function(x, j){ return '<label class="check"><input type="checkbox" data-c="dunMark" data-i2="'+i+'" data-j="'+j+'" data-fin="1"'+(f[j] ? ' checked' : '')+'><span><b>Final:</b> '+U.esc(x)+'</span></label>'; }).join('') : '')
      + '</div>';
  }
  var showY = idx - 1 >= 0 && idx - 1 < dg.days && !E.dunDayOk(S, dun, idx - 1) && !dun.skip[idx - 1];
  return '<section class="win dunactive" style="--kc:'+c+'"><div class="win-h" style="color:'+c+'">'+U.icon('gate')+'Dungeon ativa · Rank '+dg.rank+'<button class="act" data-a="dunAbandonOpen">abandonar</button></div>'
    + '<div class="dunhero">'+U.portal(dg.rank, 120)+'<div class="stack" style="gap:8px;min-width:0"><h2>'+U.esc(dg.n)+'</h2><p class="dim" style="font-style:italic">'+U.esc(dg.lore)+'</p>'
    + '<div class="row" style="gap:6px"><span class="chip">dia '+Math.min(idx + 1, dg.days)+' de '+dg.days+'</span><span class="chip">respiros '+(dun.used || 0)+'/'+(dg.rest || 0)+'</span><span class="chip">entrou em '+U.fmtDate(dun.start)+'</span></div>'
    + H.bar(U.pct(Object.keys(dun.marks).filter(function(k){ return k !== 'f' && E.dunDayOk(S, dun, +k); }).length + Object.keys(dun.skip).length, dg.days), 'way', c) + '</div></div>'
    + '<div class="dtiles">'+tiles+'</div><div class="grid g2" style="gap:14px;margin-top:12px">'+(showY ? checklist(idx - 1) : '')+checklist(idx)+'</div></section>';
};
App.A.dunEnterOpen = function(el){ App.ui.modal = {type:'dunEnter', id:el.getAttribute('data-id')}; App.renderModal(); };
App.M.dunEnter = function(m){
  var dg = E.DUN[m.id], c = SYS.RANKC[dg.rank];
  return '<section class="win" style="--kc:'+c+'"><div class="win-h" style="color:'+c+'">'+U.icon('gate')+'Entrar na dungeon<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack" style="align-items:center;text-align:center">'+U.portal(dg.rank, 110)+'<h2>'+U.esc(dg.n)+'</h2><p class="dim" style="font-style:italic">'+U.esc(dg.lore)+'</p>'
    + '<div class="callout" style="text-align:left;font-size:14px;width:100%"><b>'+dg.days+' dias seguidos</b> a partir de hoje. Cada dia pede: '+U.esc(dg.daily.join(' + '))+(dg.fin ? '. No último dia: '+U.esc(dg.fin.join(' + ')) : '')+'. Respiros para dias perdidos: '+(dg.rest || 0)+'. Descanso oficial do Sistema conta como andar vencido.</div>'
    + '<p class="faint" style="font-size:12.5px">Usa 1 Chave Rank '+dg.rank+'. Se falhar, a chave se vai — o aprendizado fica.</p>'
    + '<div class="row" style="justify-content:center"><button class="btn ghost" data-a="closeModal">Agora não</button><button class="btn primary" data-a="dunEnterDo" data-id="'+dg.id+'">'+U.icon('gate')+'Atravessar o portal</button></div></div></section>';
};
App.A.dunEnterDo = function(el){ var id = el.getAttribute('data-id'); if (!E.dunEnter(App.S, id)) return; App.ui.modal = null; App.commit(['core']); App.toast({t:'Portal atravessado', s:E.DUN[id].n + '. Boa sorte, hunter.', ic:'gate'}); };
App.C.dunMark = function(el){
  var S = App.S; if (!S.dun) return;
  E.dunMark(S, +el.getAttribute('data-i2'), +el.getAttribute('data-j'), el.checked, el.getAttribute('data-fin'));
  var dv = E.dunEval(S); App.commit(['core']); if (dv) App.dunToast(dv);
};
App.A.dunAbandonOpen = function(){ App.ui.modal = {type:'confirm', title:'Abandonar a dungeon?', body:'A chave usada não volta. Não conta como falha para conquistas, mas também não dá recompensa.', danger:1, ok:'Abandonar', act:'dunAbandonDo'}; App.renderModal(); };
App.A.dunAbandonDo = function(){ var S = App.S; if (!S.dun) return; S.dunLog.push({id:S.dun.id, st:'abandoned', start:S.dun.start, end:U.today(), used:S.dun.used || 0}); S.dun = null; App.ui.modal = null; App.commit(['core']); };
