/* ===== VIEW: navegação, HUD, Status ===== */
App.renderSide = function(){
  var r = App.ui.route, D = App.D;
  var h = '<button class="logo" data-a="logo" aria-label="System Ascension"><span class="logo-mark">'+U.icon('sparkle')+'</span><span><b>System</b><small>Ascension</small></span></button><nav class="nav">';
  App.NAV.forEach(function(n){ if (!n) { h += '<div class="sep"></div>'; return; } h += '<a href="#/'+n[0]+'" class="'+(r === n[0] ? 'on' : '')+'"'+(r === n[0] ? ' aria-current="page"' : '')+'>'+U.icon(n[2])+n[1]+'</a>'; });
  h += '</nav><div class="side-foot">'+D.nodesDone+'/'+D.nodesTotal+' nós · '+D.gatesDone+'/'+D.gatesTotal+' selos<br>Dia '+(U.daysBetween(App.S.start, U.today())+1)+' no Sistema</div>';
  App.$('side').innerHTML = h;
};
App.syncHTML = function(){
  var s = Store.status, lbl = {local:'Local', saving:'Salvando', synced:'Sincronizado', error:'Erro'}[s] || s;
  return '<span class="sync '+s+'" title="'+U.esc(Store.err || (s === 'local' ? 'Save guardado neste navegador' : 'Save privado sincronizado na sua conta'))+'"><i></i><span class="hide-sm">'+lbl+'</span></span>';
};
App.syncDetail = function(){
  var s = Store.status;
  if (s === 'error') return '<span class="bad">'+U.esc(Store.err || 'Erro de sincronização.')+'</span>';
  if (Store.mode === 'remote') return 'Save privado na sua conta Claude — só você vê. Sincroniza entre dispositivos. Status: <b>'+({saving:'salvando…', synced:'sincronizado', local:'local'}[s] || s)+'</b>.';
  return 'Save guardado <b>só neste navegador</b> (a sincronização não está disponível nesta visualização). Exporte o save de vez em quando.';
};
App.renderHud = function(){
  var D = App.D, S = App.S, p = U.pct(D.xp - D.lvFloor, D.lvNext - D.lvFloor), main = E.mainWay(S), w = App.way(main);
  App.$('hud').innerHTML = '<div class="hud-lv"><div class="lvbox" title="Nível '+D.level+'">'+D.level+'<small>LV</small></div>'
    + '<div class="hud-xp"><div class="row"><span>'+U.esc(D.grank.n)+' · Rank '+D.letter+'</span><span>'+U.num(D.xp - D.lvFloor)+' / '+U.num(D.lvNext - D.lvFloor)+' XP</span></div>'+H.bar(p)+'</div></div>'
    + '<div class="hud-pills"><span class="pill" title="Cristais do Sistema">'+U.icon('gem')+'<b>'+U.num(D.gem)+'</b></span>'
    + '<a class="pill hide-sm" href="#/lojas/'+main+'" style="color:'+w.color+';text-decoration:none" title="'+U.esc(w.cur.name)+'">'+U.icon(w.icon)+'<b>'+U.num(D.wayCr[main])+'</b>'+w.cur.code+'</a>'
    + '<a class="pill streakpill fl-'+U.flameTier(D.streak).k+'" href="#/sequencia" title="Sequência de diárias" style="text-decoration:none">'+U.icon('flame')+'<b>'+D.streak+'</b></a>'
    + '<span class="pill clockpill" title="Hora local · o dia do Sistema vira às '+String(U.resetHour()).padStart(2,'0')+':00">'+U.icon('clock')+'<b id="hudclock">'+U.clock()+'</b><small id="hudreset" class="hide-sm">reset '+U.fmtDur(U.msToReset())+'</small></span>'+App.syncHTML()+'</div>';
};
App.renderScrim = function(){ App.$('scrim').className = 'scrim' + ((App.ui.more || App.ui.drawer || App.ui.modal) ? ' on' : ''); };
App.renderMnav = function(){
  var r = App.ui.route, main = ['status','sequencia','caminhos','missoes'];
  var items = [['status','Status','status'],['sequencia','Chama','flame'],['caminhos','Caminhos','map'],['missoes','Missões','scroll']];
  App.$('mnav').innerHTML = items.map(function(n){ return '<a href="#/'+n[0]+'" class="'+(r === n[0] ? 'on' : '')+'">'+U.icon(n[2])+n[1]+'</a>'; }).join('') + '<button data-a="more" class="'+(main.indexOf(r) < 0 ? 'on' : '')+'">'+U.icon('dots')+'Mais</button>';
  var more = App.$('more');
  more.className = 'more-sheet' + (App.ui.more ? ' on' : '');
  more.innerHTML = '<div class="row between" style="margin-bottom:10px"><span class="eyebrow">Janelas do Sistema</span><button class="iconbtn" data-a="closeAll" aria-label="Fechar">'+U.icon('close')+'</button></div><div class="grid">'
    + App.NAV.filter(function(n){ return n && main.indexOf(n[0]) < 0; }).map(function(n){ return '<a href="#/'+n[0]+'">'+U.icon(n[2])+n[1]+'</a>'; }).join('') + '</div>';
  App.renderScrim();
};
App.dailyWay = function(d){ var S = App.S; if (!d.way) return null; if (d.way === '$main') return E.mainWay(S); if (d.way === '$read') return S.settings.readWay; return d.way; };
App.lastGrass = function(){
  var S = App.S, J = App.J, last = null;
  Object.keys(S.daily).forEach(function(k){ if (S.daily[k].q && ('grass' in S.daily[k].q)) { if (!last || k > last) last = k; } });
  Object.keys(J.weeks).forEach(function(k){ if (J.weeks[k].grass) { var d = U.addDays(k, 6); if (!last || d > last) last = d; } });
  return last;
};
App.events = function(limit){
  var S = App.S, ev = [];
  Object.keys(S.ach).forEach(function(id){ var a = E.ACHMAP[id]; if (a) ev.push({d:S.ach[id], t:(a.cat === 'gate' ? 'Selo conquistado: ' : 'Conquista: ') + a.n, ic:a.cat === 'gate' ? 'gate' : 'medal', c:SYS.RARITY[a.r].c}); });
  Object.keys(S.nodes).forEach(function(id){ var n = E.NODE[id], s = S.nodes[id]; if (n && s.s === 'done' && s.d1) ev.push({d:s.d1, t:'Quest concluída: ' + n.t, ic:n.boss ? 'sword' : 'check', c:App.way(n.way).color}); });
  S.buys.forEach(function(b){ ev.push({d:b.d, t:'Compra: ' + b.n, ic:'bag', c:App.way(b.way).color}); });
  ev.sort(function(a, b){ return a.d < b.d ? 1 : -1; });
  return ev.slice(0, limit || 8);
};

App.V.status = function(){
  var S = App.S, D = App.D, p = U.pct(D.xp - D.lvFloor, D.lvNext - D.lvFloor), t = U.today();
  var out = '';
  var lg = App.lastGrass(), started = U.daysBetween(S.start, t);
  if (S._u && started >= 14 && (!lg || U.daysBetween(lg, t) > 14)) {
    out += '<section class="win emerg"><div class="win-h" style="color:var(--bad)">'+U.icon('alert')+'Missão de emergência</div><div class="row between"><div class="stack" style="gap:4px"><h3>TOUCH GRASS</h3><p class="dim">'+(lg ? 'Último registro há '+U.daysBetween(lg, t)+' dias.' : 'Nenhum registro de tocar grama ainda.')+' Faça 20 minutos de algo sem ROI. Monetizar o descanso invalida a missão.</p></div><button class="btn danger" data-a="grassNow">'+U.icon('grass')+'Toquei grama hoje</button></div></section>';
  }
  if (!S._u) {
    out += '<section class="win"><div class="win-h">'+U.icon('sparkle')+'[Sistema] Novo jogador detectado</div><div class="stack"><h2>Você foi escolhido pelo Sistema. Parabéns, ou meus pêsames.</h2><p class="lead">7 Caminhos, '+D.nodesTotal+' nós, '+D.gatesTotal+' selos e '+E.ACH.length+' conquistas. Comece definindo seu nome no Perfil, escolha a temporada abaixo e marque a primeira diária de hoje. O save é privado e fica na sua conta.</p><div class="row"><a class="btn primary" href="#/perfil">'+U.icon('user')+'Criar perfil</a><a class="btn" href="#/caminhos/architect">'+U.icon('map')+'Ver o Architect Way</a><a class="btn ghost" href="#/regras">'+U.icon('shield')+'Como funciona</a></div></div></section>';
  }
  var hero = '<section class="win"><div class="win-h">'+U.icon('status')+'Janela de Status</div><div class="hero">'+H.avatar(92)
    + '<div class="stack" style="gap:8px;min-width:0;width:100%"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap"><div style="min-width:0"><div class="pname '+H.fx()+'">'+U.esc(H.pname())+'</div><div class="ptitle" style="color:var(--glow)">'+U.esc(H.ptitle())+'</div></div><div class="rank" title="Rank '+D.letter+'">'+D.letter+'</div></div>'
    + '<div class="row between mono dim" style="font-size:12px"><span>NÍVEL '+D.level+' · '+U.esc(D.grank.n).toUpperCase()+'</span><span>'+U.num(D.xp)+' XP</span></div>'+H.bar(p)
    + '<div class="mono faint" style="font-size:11.5px">'+(D.level >= SYS.MAXLVL ? 'Nível máximo.' : 'Faltam '+U.num(D.lvNext - D.xp)+' XP para o nível '+(D.level+1))+(D.grank.next ? ' · Próximo rank: '+U.esc(D.grank.next[1]) : '')+'</div></div></div>'
    + '<div class="hr" style="margin:14px 0 4px"></div><div class="stats">'
    + SYS.WAYS.map(function(w){ return '<a class="stat" href="#/caminhos/'+w.id+'" style="--wc:'+w.color+';text-decoration:none;color:inherit" title="'+U.esc(w.attrName+' · '+w.name)+'"><b>'+w.attr+'</b><span>'+U.esc(D.tier[w.id].n)+'</span><em>'+D.attr[w.id]+'</em></a>'; }).join('')
    + '</div><div class="row" style="margin-top:12px;gap:6px">'
    + SYS.WAYS.map(function(w){ return '<a class="chip" href="#/lojas/'+w.id+'" style="text-decoration:none;color:'+w.color+';border-color:'+U.hexA(w.color,.4)+'">'+U.num(D.wayCr[w.id])+' '+w.cur.code+(D.seals[w.id] ? ' · '+D.seals[w.id]+U.icon('seal') : '')+'</a>'; }).join('')
    + '<span class="chip glow">'+U.icon('gem')+U.num(D.gem)+' ◆</span></div></section>';
  var radar = '<section class="win"><div class="win-h">'+U.icon('eye')+'Atributos</div>'
    + U.radar(SYS.WAYS.map(function(w){ return {k:w.attr, v:D.wayNodes[w.id] ? D.wayDone[w.id]/D.wayNodes[w.id] : 0, c:w.color, val:U.pct(D.wayDone[w.id], D.wayNodes[w.id])+'%'}; }), 300)
    + '<p class="faint mono" style="font-size:11px;text-align:center;margin-top:6px">Radar: % de nós completos · Atributo: 10 + XP do Caminho ÷ 40</p></section>';
  out += '<div class="grid g-status">'+hero+radar+'</div>';

  var rec = S.daily[t] || {q:{}}, act = S.settings.dailies, done = act.filter(function(id){ return rec.q && (id in rec.q); }).length;
  var rests = E.restThisWeek(S, t);
  var dailies = '<section class="win"><div class="win-h">'+U.icon('target')+'Missões diárias<a class="act" href="#/missoes">configurar</a></div>'
    + '<a class="streak fl-'+U.flameTier(D.streak).k+'" href="#/sequencia" style="margin-bottom:10px;text-decoration:none;color:inherit">'+U.flame(D.streak, 34)+'<b>'+D.streak+'</b><div class="stack" style="gap:0;min-width:0"><span style="font-weight:600">dias de sequência</span><span class="faint mono" style="font-size:11.5px">melhor: '+D.bestStreak+' · hoje '+done+'/'+act.length+(rec.rest ? ' · descanso' : '')+' · extras '+E.xCount(rec)+'</span></div><span class="sys-mini">'+U.mascot(App.sysMood(), 40)+'</span></a><div class="stack" style="gap:6px">'
    + act.map(function(id){ var d = SYS.DAILIES.filter(function(x){ return x.id === id; })[0]; if (!d) return ''; var on = !!(rec.q && (id in rec.q)); var wid = App.dailyWay(d), w = wid && App.way(wid);
        return '<button class="daily'+(on?' on':'')+'" data-a="dailyToggle" data-id="'+id+'" aria-pressed="'+on+'"><span class="box">'+U.icon('check')+'</span><span style="min-width:0;text-align:left"><span class="t">'+U.esc(d.n)+'</span><br><span class="d">'+U.esc(d.d)+'</span></span><span class="rw">+'+d.xp+' XP<br>'+(w ? '<span style="color:'+w.color+'">'+w.attr+' · +'+d.cr+' '+w.cur.code+'</span>' : '+'+(d.gem||0)+' ◆')+'</span></button>'; }).join('')
    + '</div><div class="row between" style="margin-top:12px"><span class="faint mono" style="font-size:11.5px">Tudo feito = +10 ◆ · descansos nesta semana: '+rests+'/2'+(S.owned.tickets ? ' · tickets: '+S.owned.tickets : '')+'</span><button class="btn sm ghost" data-a="restDay">'+U.icon('moon')+(rec.rest ? 'Desfazer descanso' : 'Dia de descanso')+'</button></div></section>';

  var foc = E.focusWays(S), fix = E.fixedWays(S);
  var LBL = ['Principal','Segundo','Terceiro'];
  function shortName(w){ return w.pt.replace(/^Caminho d[oa] /, ''); }
  function chip(w, on, act, num){
    return '<button class="chip fchip'+(on ? ' on' : '')+'" data-a="'+act+'" data-id="'+w.id+'" style="--wc:'+w.color+'" aria-pressed="'+on+'" title="'+U.esc(w.name)+'">'+U.icon(w.icon)+U.esc(shortName(w))+(num ? '<b class="fnum">'+num+'</b>' : '')+'</button>';
  }
  var fixChips = SYS.WAYS.map(function(w){ return chip(w, fix.indexOf(w.id) >= 0, 'fixToggle', 0); }).join('');
  var focChips = SYS.WAYS.filter(function(w){ return fix.indexOf(w.id) < 0; }).map(function(w){ var i = foc.indexOf(w.id); return chip(w, i >= 0, 'focusToggle', i >= 0 ? i + 1 : 0); }).join('');
  var nxt = function(wid, label){ var n = E.nextNode(S, wid), w = App.way(wid); return '<div class="stack" style="gap:6px"><div class="row between"><span class="eyebrow" style="color:'+w.color+'">'+label+' · '+U.esc(shortName(w))+'</span><span class="faint mono" style="font-size:11px">'+D.wayDone[wid]+'/'+D.wayNodes[wid]+' nós</span></div>'+(n ? H.nodeRow(n) : '<div class="empty">Caminho completo ou travado. Veja os Portões.</div>')+'</div>'; };
  var dailyOf = function(wid){ var d = SYS.DAILIES.filter(function(x){ return App.dailyWay(x) === wid; })[0]; return d ? d.n : null; };
  var fixRows = fix.length ? fix.map(function(wid){
    var w = App.way(wid), n = E.nextNode(S, wid), dn = dailyOf(wid);
    return '<div class="row between fixrow" style="--wc:'+w.color+'"><span class="row" style="gap:8px;min-width:0"><span style="color:'+w.color+'">'+U.icon(w.icon)+'</span><span style="min-width:0"><b>'+U.esc(shortName(w))+'</b>'+(dn ? ' <span class="faint mono" style="font-size:11px">diária: '+U.esc(dn)+'</span>' : '')+'<br><span class="dim" style="font-size:13px">'+(n ? U.esc(n.id + ' · ' + n.t) : 'sem próximo nó liberado')+'</span></span></span>'
      + (n ? '<button class="btn sm ghost" data-a="openNode" data-id="'+n.id+'">abrir</button>' : '')+'</div>';
  }).join('') : '<div class="empty">Nenhum Caminho fixo. Rotina 100% por foco — corajoso.</div>';
  var readyGates = Object.keys(E.GATE).map(function(k){ return E.GATE[k]; }).filter(function(g){ return !(S.gates[g.id] && S.gates[g.id].done) && E.gateReady(S, g); });
  var season = '<section class="win"><div class="win-h">'+U.icon('sword')+'Caminhos &amp; missões ativas</div>'
    + '<span class="eyebrow" style="font-size:10.5px">Rotina fixa · não ocupa slot</span>'
    + '<div class="fchips" style="margin:6px 0 4px">'+fixChips+'</div>'
    + '<p class="faint" style="font-size:12px;margin-bottom:12px">Caminho de vida (treino, negócio, cabeça) não disputa foco com estudo: ele roda todo dia pela diária. Clique para fixar ou soltar.</p>'
    + '<div class="stack" style="gap:6px;margin-bottom:14px">'+fixRows+'</div>'
    + '<div class="hr" style="margin:0 0 12px"></div>'
    + '<span class="eyebrow" style="font-size:10.5px">Foco da vez · 1 a 3</span>'
    + '<div class="fchips" style="margin:6px 0 4px">'+focChips+'</div>'
    + '<p class="faint" style="font-size:12px;margin-bottom:12px">A ordem é a que você clicar. A diária <b>Foco Profundo</b> conta XP para o primeiro. Troque quando quiser.</p>'
    + '<div class="stack">'+foc.map(function(wid, i){ return nxt(wid, LBL[i]); }).join('')+'</div>'
    + (readyGates.length ? '<div class="hr" style="margin:14px 0"></div><div class="stack" style="gap:6px"><span class="eyebrow ok">Selos prontos para conquistar</span>'+readyGates.map(function(g){ return '<button class="gatecard" data-a="openGate" data-id="'+g.id+'" style="text-align:left;color:inherit;cursor:pointer">'+U.icon('gate')+'<span><b>'+U.esc(g.n)+'</b><br><span class="dim" style="font-size:13px">'+U.esc(App.way(g.way).name)+'</span></span><span class="chip ok">Pronto</span></button>'; }).join('')+'</div>' : '')
    + '</section>';
  out += '<div class="grid g2">'+dailies+season+'</div>';

  var ev = App.events(8);
  out += '<section class="win"><div class="win-h">'+U.icon('scroll')+'Registro do Sistema</div>'
    + (ev.length ? ev.map(function(e){ return '<div class="notif"><span style="color:'+e.c+'">'+U.icon(e.ic)+'</span><span>'+U.esc(e.t)+'</span><span class="faint mono" style="font-size:11px">'+U.fmtDate(e.d)+'</span></div>'; }).join('') : '<div class="empty">[SISTEMA] Nenhum registro ainda. O primeiro nó está esperando você — e julgando em silêncio.</div>')
    + '</section>';
  return out;
};

App.A.logo = function(){ App.logoN = (App.logoN || 0) + 1; if (App.logoN >= 10 && !App.S.flags.logo) { App.S.flags.logo = true; App.commit(['core']); } App.go('status'); };
App.A.more = function(){ App.ui.more = !App.ui.more; App.renderMnav(); };
App.A.closeAll = function(){ App.ui.more = false; App.ui.drawer = null; App.ui.modal = null; App.renderMnav(); App.renderDrawer(); App.renderModal(); };
App.A.dailyToggle = function(el){
  var S = App.S, id = el.getAttribute('data-id'), t = U.today();
  var rec = S.daily[t] || (S.daily[t] = {q:{}, need:0});
  var was = E.dayComplete(rec) && !rec.rest;
  rec.need = S.settings.dailies.length;
  var def = SYS.DAILIES.filter(function(d){ return d.id === id; })[0];
  if (id === 'grass') delete rec.gx;
  if (id in rec.q) delete rec.q[id]; else { rec.q[id] = App.dailyWay(def); if (rec.rest) { rec.rest = false; if (rec.ticket) { S.owned.tickets++; rec.ticket = false; } } }
  var now = E.dayComplete(rec) && !rec.rest;
  if (now && !was && U.msToReset() <= 600000) S.flags.clutch = true;
  App.commit(['core']);
  if (now && !was) App.toast({t:'Missões diárias completas', s:U.pick(SYS.VOICE.daily) + ' +10 ◆', ic:'check'});
};
App.A.restDay = function(){
  var S = App.S, t = U.today(), rec = S.daily[t] || (S.daily[t] = {q:{}, need:S.settings.dailies.length});
  if (rec.rest) { rec.rest = false; if (rec.ticket) { S.owned.tickets++; rec.ticket = false; } App.commit(['core']); return; }
  if (E.restThisWeek(S, t) >= 2) {
    if (S.owned.tickets > 0) { S.owned.tickets--; rec.ticket = true; }
    else { App.toast({t:'Limite de descanso da semana', s:'Dois dias por semana mantêm a sequência. Descansar mesmo assim continua valendo — só a sequência reinicia. Tickets extras na Loja do Sistema.', ic:'moon', ms:6500}); return; }
  }
  rec.rest = true; App.commit(['core']);
  App.toast({t:'Dia de descanso registrado', s:U.pick(SYS.VOICE.rest), ic:'moon'});
};
App.A.grassNow = function(){
  var S = App.S, t = U.today(), rec = S.daily[t] || (S.daily[t] = {q:{}, need:S.settings.dailies.length});
  if (S.settings.dailies.indexOf('grass') < 0) rec.gx = 1; rec.q.grass = null; App.commit(['core']);
  App.toast({t:'Missão de emergência cumprida', s:'Grama tocada. O Sistema está orgulhoso e um pouco surpreso.', ic:'grass'});
};
App.A.fixToggle = function(el){
  var S = App.S, id = el.getAttribute('data-id'), fix = E.fixedWays(S).slice(), i = fix.indexOf(id);
  if (i >= 0) fix.splice(i, 1);
  else {
    if (SYS.WAYS.length - fix.length <= 1) return App.toast({t:'Sobrou pouco', s:'Deixe pelo menos um Caminho livre para o foco.', ic:'alert'});
    fix.push(id);
  }
  E.setFixed(S, fix); S.stats.focusSwaps = (S.stats.focusSwaps || 0) + 1; App.commit(['core']);
  App.toast({t:i >= 0 ? 'Soltou da rotina' : 'Fixado na rotina', s:App.way(id).name + (i >= 0 ? ' agora pode entrar no foco.' : ' roda todo dia, sem ocupar slot.'), ic:'flame'});
};
App.A.focusToggle = function(el){
  var S = App.S, id = el.getAttribute('data-id'), foc = E.focusWays(S).slice(), i = foc.indexOf(id);
  if (i >= 0) { if (foc.length === 1) return App.toast({t:'Pelo menos um', s:'O Sistema precisa de no mínimo 1 Caminho principal.', ic:'alert'}); foc.splice(i, 1); }
  else { if (foc.length >= 3) return App.toast({t:'Máximo de três', s:'Tire um Caminho antes de colocar outro. Foco é escolha.', ic:'alert'}); foc.push(id); }
  E.setFocus(S, foc); S.settings.season.start = S.settings.season.start || U.today(); S.stats.focusSwaps = (S.stats.focusSwaps || 0) + 1; App.commit(['core']);
};
