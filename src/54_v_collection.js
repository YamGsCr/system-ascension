/* ===== VIEW: Conquistas, Títulos, Marcos, Metas ===== */
App.achCats = function(){
  var S = App.S, cats = [];
  function mk(id, n, ic, color, list){ var got = list.filter(function(a){ return S.ach[a.id]; }).length; cats.push({id:id, n:n, ic:ic, c:color, list:list, got:got}); }
  var unl = E.ACH.filter(function(a){ return S.ach[a.id]; }).sort(function(a, b){ return S.ach[a.id] < S.ach[b.id] ? 1 : -1; });
  cats.push({id:'recentes', n:'Recentes', ic:'sparkle', c:'var(--glow)', list:unl.slice(0, 36), got:unl.length, recent:1});
  mk('sistema', 'Sistema', 'status', 'var(--glow)', E.ACH.filter(function(a){ return a.cat === 'system'; }));
  SYS.WAYS.forEach(function(w){ mk(w.id, w.name, w.icon, w.color, E.ACH.filter(function(a){ return a.way === w.id && a.cat !== 'cert' && a.cat !== 'feat'; })); });
  mk('feitos', 'Feitos da vida real', 'flag', 'var(--ok)', E.ACH.filter(function(a){ return a.cat === 'feat'; }));
  mk('dungeons', 'Dungeons', 'gate', '#ff4757', E.ACH.filter(function(a){ return a.cat === 'dungeon'; }));
  mk('certs', 'Certificações', 'cert', 'var(--warn)', E.ACH.filter(function(a){ return a.cat === 'cert'; }));
  mk('secretas', 'Secretas', 'eye', 'var(--bad)', E.ACH.filter(function(a){ return a.cat === 'secret'; }));
  return cats;
};
App.V.conquistas = function(){
  var S = App.S, D = App.D, cats = App.achCats(), cur = cats.filter(function(c){ return c.id === App.ui.param; })[0] || cats[0], st = App.ui.f.achSt || 'all';
  var byR = {}; SYS.RARITY_ORDER.forEach(function(r){ byR[r] = 0; }); E.ACH.forEach(function(a){ if (S.ach[a.id]) byR[a.r]++; });
  var h = H.head('Sala de troféus', 'Conquistas', U.num(D.achCount)+' de '+E.ACH.length+' desbloqueadas. Medalhas vão para a vitrine do seu Perfil (até 8). Conquistas de sistema dão ◆; as de Caminho dão créditos daquele Caminho.');
  h += '<section class="win"><div class="row" style="gap:8px">'+SYS.RARITY_ORDER.map(function(r){ var R = SYS.RARITY[r]; return '<span class="chip" style="color:'+R.c+';border-color:'+U.hexA(R.c,.45)+'">'+R.n+' · '+byR[r]+'</span>'; }).join('')+'</div>'+H.bar(U.pct(D.achCount, E.ACH.length))+'</section>';
  var side = '<div class="catlist hide-md">'+cats.map(function(c){ return '<a class="cat'+(c === cur ? ' on' : '')+'" href="#/conquistas/'+c.id+'" style="--wc:'+c.c+'"><span style="color:'+c.c+'">'+U.icon(c.ic)+'</span><span style="min-width:0"><span class="cn">'+U.esc(c.n)+'</span>'+(c.recent ? '' : H.bar(U.pct(c.got, c.list.length), 'way thin', c.c))+'</span><span class="mono dim" style="font-size:11px">'+(c.recent ? c.got : c.got+'/'+c.list.length)+'</span></a>'; }).join('')+'</div>'
    + '<label class="fld show-md">Categoria<select data-c="achCat">'+cats.map(function(c){ return '<option value="'+c.id+'"'+(c === cur ? ' selected' : '')+'>'+U.esc(c.n)+' ('+(c.recent ? c.got : c.got+'/'+c.list.length)+')</option>'; }).join('')+'</select></label>';
  var list = cur.list.filter(function(a){ return st === 'all' || (st === 'got' ? S.ach[a.id] : !S.ach[a.id]); });
  if (!cur.recent) list = list.slice().sort(function(a, b){ return (!!S.ach[b.id] - !!S.ach[a.id]) || (SYS.RARITY_ORDER.indexOf(a.r) - SYS.RARITY_ORDER.indexOf(b.r)); });
  var grid = '<section class="win"><div class="win-h" style="color:'+cur.c+'">'+U.icon(cur.ic)+U.esc(cur.n)+'</div>'
    + (cur.recent ? '' : '<div class="seg" role="group" aria-label="Filtro" style="margin-bottom:12px">'+[['all','Todas'],['got','Desbloqueadas'],['lock','Bloqueadas']].map(function(o){ return '<button class="'+(st === o[0] ? 'on' : '')+'" data-a="achSt" data-s="'+o[0]+'">'+o[1]+'</button>'; }).join('')+'</div>')
    + (list.length ? '<div class="medals">'+list.map(App.medalCard).join('')+'</div>' : '<div class="empty">'+(cur.recent ? '[SISTEMA] Nenhuma medalha ainda. A primeira vem com o primeiro nó concluído.' : 'Nada aqui com esse filtro.')+'</div>')
    + '</section>';
  return h + '<div class="achgrid">'+side+grid+'</div>';
};
App.medalCard = function(a){
  var got = !!App.S.ach[a.id], R = SYS.RARITY[a.r], hide = a.secret && !got, pinned = App.S.profile.showcase.indexOf(a.id) >= 0;
  return '<button class="mcard'+(got ? '' : ' lk')+'" data-a="achOpen" data-id="'+a.id+'" title="'+U.esc(hide ? 'Conquista secreta' : a.n)+'">'+U.medal(a, {size:64, locked:!got})+'<span class="mn">'+(hide ? '???' : U.esc(a.n))+'</span><span class="mr" style="color:'+R.c+'">'+R.n+(pinned ? ' · vitrine' : '')+'</span></button>';
};
App.C.achCat = function(el){ App.go('conquistas/' + el.value); };
App.A.achSt = function(el){ App.ui.f.achSt = el.getAttribute('data-s'); App.renderView(); };
App.A.achOpen = function(el){ App.ui.modal = {type:'ach', id:el.getAttribute('data-id')}; App.renderModal(); };
App.M.ach = function(m){
  var a = E.ACHMAP[m.id], S = App.S; if (!a) return '';
  var got = S.ach[a.id], R = SYS.RARITY[a.r], hide = a.secret && !got, w = a.way && App.way(a.way), pinned = S.profile.showcase.indexOf(a.id) >= 0;
  var catN = {node:'Quest', gate:'Selo', mastery:'Maestria', cert:'Certificação', system:'Sistema', secret:'Secreta'}[a.cat];
  var rew = []; if (a.way && a.cr) rew.push('+'+a.cr+' '+w.cur.code); if (a.cat === 'system' || a.cat === 'secret') rew.push('+'+R.gem+' ◆'); if (a.title) rew.push('título “'+a.title+'”');
  var link = a.node ? '<button class="btn sm" data-a="openNode" data-id="'+a.node+'">'+U.icon('scroll')+'Abrir quest</button>' : a.gate ? '<button class="btn sm" data-a="openGate" data-id="'+a.gate+'">'+U.icon('gate')+'Abrir selo</button>' : '';
  var tt = a.title && E.TITLES.filter(function(t){ return t.n.toLowerCase() === a.title.toLowerCase(); })[0];
  return '<section class="win"><div class="win-h" style="color:'+R.c+'">'+U.icon('medal')+catN+(w ? ' · '+U.esc(w.name) : '')+'<button class="act" data-a="closeModal">fechar ✕</button></div>'
    + '<div class="stack" style="align-items:center;text-align:center;gap:10px"><div class="medal-hero'+(got ? ' got' : '')+'" style="--rc:'+R.c+'">'+U.medal(a, {size:132, locked:!got})+'</div>'
    + '<h2>'+(hide ? '???' : U.esc(a.n))+'</h2><span class="chip" style="color:'+R.c+';border-color:'+U.hexA(R.c,.5)+'">'+R.n+'</span>'
    + '<p class="dim" style="max-width:44ch">'+(hide ? 'Conquista secreta. O Sistema não dá dica. Talvez só um pouquinho: explore coisas que ninguém explora.' : U.esc(a.d))+'</p>'
    + (rew.length && !hide ? '<p class="mono faint" style="font-size:12px">Recompensa: '+U.esc(rew.join(' · '))+'</p>' : '')
    + (got ? '<span class="chip ok">'+U.icon('check')+'desbloqueada em '+U.fmtDate(got)+'</span>' : '<span class="chip">'+U.icon('lock')+'bloqueada</span>')
    + '<div class="row" style="justify-content:center">'+link
    + (got ? '<button class="btn sm'+(pinned ? '' : ' primary')+'" data-a="pinAch" data-id="'+a.id+'">'+U.icon('star')+(pinned ? 'Tirar da vitrine' : 'Fixar na vitrine')+'</button>' : '')
    + (got && tt && E.titleUnlocked(S, App.D, tt) && S.profile.title !== tt.id ? '<button class="btn sm" data-a="equipTitle" data-id="'+tt.id+'">'+U.icon('banner')+'Equipar título</button>' : '')
    + '</div></div></section>';
};
App.A.pinAch = function(el){
  var id = el.getAttribute('data-id'), sc = App.S.profile.showcase, k = sc.indexOf(id);
  if (k >= 0) sc.splice(k, 1);
  else { var max = App.S.owned.showcase12 ? 12 : 8; if (sc.length >= max) { App.toast({t:'Vitrine cheia', s:max+' medalhas no máximo. Tire uma no Perfil — ou compre a Expansão da Vitrine. Escolhas, criatura.', ic:'medal'}); return; } sc.push(id); }
  App.commit(['core']);
};
App.A.equipTitle = function(el){ App.S.profile.title = el.getAttribute('data-id'); App.commit(['core']); App.toast({t:'Título equipado', s:H.ptitle(), ic:'banner'}); };

App.titleReq = function(t){
  if (t.alt && t.alt.length) { var o = App.titleReq1(t), alts = t.alt.map(App.titleReq1).filter(Boolean); return o + (alts.length ? ' — ou: ' + alts.join(' — ou: ') : ''); }
  return App.titleReq1(t);
};
App.titleReq1 = function(t){
  if (t.ach) { var a = E.ACHMAP[t.ach]; return a ? (a.secret && !App.S.ach[a.id] ? 'Conquista secreta' : a.d) : ''; }
  if (t.xp != null) return 'XP no '+App.way(t.way).name+' ≥ '+U.num(t.xp);
  if (t.gxp != null) return 'XP total ≥ '+U.num(t.gxp);
  return '';
};
App.V.titulos = function(){
  var S = App.S, D = App.D, f = App.ui.f.tit || 'all';
  var unl = E.TITLES.filter(function(t){ return E.titleUnlocked(S, D, t); });
  var h = H.head('Registro de títulos', 'Títulos', unl.length+' de '+E.TITLES.length+' títulos liberados. Títulos vêm de conquistas de quest, selos, níveis de cada Caminho, rank global e certificações. Equipado, aparece no Status e no Perfil.');
  h += '<section class="win"><div class="win-h">'+U.icon('banner')+'Equipado</div><div class="row between"><div class="stack" style="gap:2px"><span class="pname '+H.fx()+'" style="font-size:22px">'+U.esc(H.pname())+'</span><span class="ptitle" style="color:var(--glow)">'+U.esc(H.ptitle())+'</span></div>'
    + (S.profile.title ? '<button class="btn sm ghost" data-a="unequipTitle">Desequipar</button>' : '')+'</div>'
    + (S.owned.custom ? '<div class="hr" style="margin:12px 0"></div><div class="grid" style="grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end"><label class="fld">Título customizado (até 28)<input type="text" data-i="customTitle" maxlength="28" value="'+U.esc(S.customTitle || '')+'" placeholder="Ex.: Arquiteto do Riacho"></label><button class="btn'+(S.profile.title === 'custom' ? '' : ' primary')+'" data-a="equipCustom">'+(S.profile.title === 'custom' ? 'Equipado' : 'Equipar')+'</button></div>' : '<p class="faint" style="font-size:12.5px;margin-top:8px">Quer escrever o seu próprio? “Título Customizado” na Loja do Sistema.</p>')
    + '</section>';
  h += '<div class="seg" role="group" aria-label="Filtro">'+[['all','Todos'],['got','Liberados'],['lock','Bloqueados']].map(function(o){ return '<button class="'+(f === o[0] ? 'on' : '')+'" data-a="titF" data-s="'+o[0]+'">'+o[1]+'</button>'; }).join('')+'</div>';
  var groups = [['Rank global', null, E.TITLES.filter(function(t){ return t.gxp != null; })]];
  SYS.WAYS.forEach(function(w){ groups.push([w.name, w, E.TITLES.filter(function(t){ return t.way === w.id && t.src !== 'Certificação'; })]); });
  groups.push(['Certificações', null, E.TITLES.filter(function(t){ return t.src === 'Certificação'; })]);
  groups.push(['Sistema, Segredos & Dungeons', null, E.TITLES.filter(function(t){ return !t.way && t.gxp == null; })]);
  h += groups.map(function(g){
    var items = g[2].filter(function(t){ var u = E.titleUnlocked(S, D, t); return f === 'all' || (f === 'got' ? u : !u); });
    if (!items.length) return '';
    return '<section class="win"'+(g[1] ? ' style="--wc:'+g[1].color+'"' : '')+'><div class="win-h"'+(g[1] ? ' style="color:'+g[1].color+'"' : '')+'>'+U.icon(g[1] ? g[1].icon : 'crown')+U.esc(g[0])+' · '+g[2].filter(function(t){ return E.titleUnlocked(S, D, t); }).length+'/'+g[2].length+'</div><div class="titles">'
      + items.map(function(t){ var u = E.titleUnlocked(S, D, t), R = SYS.RARITY[t.r], eq = S.profile.title === t.id;
          return '<div class="tcard'+(u ? '' : ' lk')+(eq ? ' eq' : '')+'" style="--rc:'+R.c+'"><div class="row between" style="flex-wrap:nowrap;gap:8px"><span class="tn">'+U.esc(t.n)+'</span>'+(u ? (eq ? '<span class="chip ok">equipado</span>' : '<button class="btn sm" data-a="equipTitle" data-id="'+t.id+'">Equipar</button>') : U.icon('lock'))+'</div><span class="mono" style="font-size:10.5px;color:'+R.c+';letter-spacing:.08em;text-transform:uppercase">'+R.n+' · '+U.esc(t.src)+'</span><span class="dim" style="font-size:12.5px">'+U.esc(App.titleReq(t))+'</span></div>'; }).join('')
      + '</div></section>';
  }).join('');
  return h;
};
App.A.titF = function(el){ App.ui.f.tit = el.getAttribute('data-s'); App.renderView(); };
App.A.unequipTitle = function(){ App.S.profile.title = null; App.commit(['core']); };
App.I.customTitle = function(el){ App.S.customTitle = el.value.slice(0, 28); App.debSave('core'); App.renderHud(); };
App.A.equipCustom = function(){ var S = App.S; if (!S.owned.custom) return; if (!(S.customTitle || '').trim()) { App.toast({t:'Título vazio', s:'Escreva algo antes. Até o Sistema tem limites.', ic:'alert'}); return; } S.profile.title = 'custom'; App.commit(['core']); };

/* ---------- Marcos ---------- */
App.NEXTMS = [
  ['Nível', 'level', [10,25,50,75,99], 'sparkle'], ['Nós concluídos', 'nodesDone', [1,10,50,100,200], 'scroll'], ['Bosses derrotados', 'bossesDone', [1,5,15], 'sword'],
  ['Selos conquistados', 'gatesDone', [1,5,15], 'gate'], ['Melhor sequência', 'bestStreak', [7,30,100,365], 'flame'], ['Livros lidos + aplicados', 'booksRead', [1,10,30], 'book'],
  ['Semanas fechadas', 'weeksCleared', [4,12,52], 'pen'], ['Metas concluídas', 'goalsDone', [1,5], 'target']
];
App.V.marcos = function(){
  var S = App.S, D = App.D, t = U.today(), day = U.daysBetween(S.start, t) + 1, tab = App.ui.param === 'feitos' ? 'feitos' : 'linha';
  var h = H.head('Linha do tempo', 'Marcos & Feitos', 'Os momentos que contam: bosses, selos, certificações, níveis, Feitos da vida real e os marcos que você registrar. Dia '+day+' no Sistema.');
  h += H.tabs('marcos', [['linha','Linha do tempo','flag'],['feitos','Feitos de todos os Caminhos','star', D.featsDone+'/'+SYS.FEATS.length]], tab);
  if (tab === 'feitos') return h + App.featsAll();
  h += '<div class="kpis">'+[[D.level,'nível'],[D.nodesDone,'nós'],[D.bossesDone,'bosses'],[D.gatesDone,'selos'],[D.achCount,'conquistas'],[day,'dias']].map(function(k){ return '<div class="kpi"><b>'+U.num(k[0])+'</b><span>'+k[1]+'</span></div>'; }).join('')+'</div>';
  var next = App.NEXTMS.map(function(m){ var v = D[m[1]] || 0, goal = m[2].filter(function(x){ return x > v; })[0]; if (goal == null) return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto"><span class="ok">'+U.icon('check')+'</span><span>'+m[0]+'</span><b>completo</b></div>';
      var prev = m[2].filter(function(x){ return x <= v; }).pop() || 0; return '<div class="stack" style="gap:4px;padding:6px 0;border-bottom:1px dashed var(--line)"><div class="row between" style="font-size:13.5px"><span class="row" style="gap:6px">'+U.icon(m[3])+m[0]+'</span><span class="mono dim" style="font-size:12px">'+U.num(v)+' / '+U.num(goal)+'</span></div>'+H.bar(U.pct(v - prev, goal - prev), 'thin')+'</div>'; }).join('');
  var f = App.ui.f.ms || (App.ui.f.ms = {t:'', d:t, way:'', note:''});
  var form = '<section class="win"><div class="win-h">'+U.icon('plus')+'Registrar marco da vida real</div><p class="dim" style="font-size:13.5px;margin-bottom:8px">Primeiro cliente fechado, primeira faixa tocada num rolê, a rede do resort no ar, 5 barras limpas. Marco é fato com data.</p>'
    + '<label class="fld">Marco<input type="text" data-i="msF" data-k="t" maxlength="120" value="'+U.esc(f.t)+'" placeholder="O que aconteceu?"></label>'
    + '<div class="grid g2" style="gap:8px;margin-top:8px"><label class="fld">Data<input type="date" data-c="msDate" value="'+U.esc(f.d)+'"></label><label class="fld">Caminho'+H.waySelect('data-c="msWay"', f.way, '<option value="">Vida (nenhum)</option>')+'</label></div>'
    + '<label class="fld" style="margin-top:8px">Nota (opcional)<input type="text" data-i="msF" data-k="note" maxlength="240" value="'+U.esc(f.note)+'"></label>'
    + '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="msAdd">'+U.icon('flag')+'Registrar</button></div></section>';
  h += '<div class="grid g2" style="align-items:start"><section class="win"><div class="win-h">'+U.icon('target')+'Próximos marcos</div>'+next+'</section>'+form+'</div>';
  var ev = [];
  E.ACH.forEach(function(a){ if (a.ms && S.ach[a.id]) ev.push({d:S.ach[a.id].slice(0,10), t:a.n, s:a.d, c:SYS.RARITY[a.r].c, ic:a.cat === 'gate' ? 'seal' : a.cat === 'cert' ? 'cert' : a.node ? 'sword' : 'medal', way:a.way}); });
  SYS.FEATS.forEach(function(f){ var r = S.feats[f.id]; if (D.featDone[f.id] && r && r.d) ev.push({d:r.d, t:'Feito: '+f.n, s:f.d, c:SYS.RARITY[f.r].c, ic:'flag', way:f.way}); });
  (S.dunLog || []).forEach(function(l){ var dg = E.DUN[l.id]; if (dg && l.st === 'cleared') ev.push({d:l.end, t:'Dungeon limpa: '+dg.n, s:'Rank '+dg.rank+' · '+dg.days+' dias', c:SYS.RANKC[dg.rank], ic:'gate'}); });
  (S.lvlog || []).forEach(function(l){ if (l.l % 5 === 0 || l.l === 2) ev.push({d:l.d, t:'Nível '+l.l+' · Rank '+E.letterOf(l.l), s:'Level up.', c:'var(--glow)', ic:'sparkle'}); });
  S.milestones.forEach(function(m){ ev.push({d:m.d, t:m.t, s:m.note, c:m.way ? App.way(m.way).color : 'var(--warn)', ic:'flag', way:m.way, id:m.id}); });
  ev.push({d:S.start, t:'Despertar no Sistema', s:'O dia em que você aceitou o contrato.', c:'var(--glow)', ic:'sparkle'});
  ev.sort(function(a, b){ return a.d < b.d ? 1 : a.d > b.d ? -1 : 0; });
  h += '<section class="win"><div class="win-h">'+U.icon('flag')+'Linha do tempo · '+ev.length+'</div><div class="tl">'
    + ev.slice(0, 200).map(function(e){ return '<div class="ev" style="--rc:'+e.c+'"><div class="row between" style="flex-wrap:nowrap;align-items:flex-start;gap:8px"><div class="stack" style="gap:2px;min-width:0"><span class="mono faint" style="font-size:11px">'+U.fmtDate(e.d)+'</span><b style="color:'+e.c+'">'+U.esc(e.t)+'</b>'+(e.s ? '<span class="dim" style="font-size:13.5px">'+U.esc(e.s)+'</span>' : '')+(e.way ? '<span>'+H.wayChip(e.way)+'</span>' : '')+'</div>'+(e.id ? '<button class="iconbtn" data-a="msDel" data-id="'+e.id+'" aria-label="Apagar marco">'+U.icon('trash')+'</button>' : '<span style="color:'+e.c+'">'+U.icon(e.ic)+'</span>')+'</div></div>'; }).join('')
    + '</div></section>';
  return h;
};
App.I.msF = function(el){ App.ui.f.ms[el.getAttribute('data-k')] = el.value; };
App.C.msDate = function(el){ App.ui.f.ms.d = el.value; };
App.C.msWay = function(el){ App.ui.f.ms.way = el.value; };
App.A.msAdd = function(){
  var f = App.ui.f.ms, S = App.S;
  if (!f || (f.t || '').trim().length < 3) { App.toast({t:'Marco sem nome', s:'Descreva o que aconteceu.', ic:'alert'}); return; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.d || '')) f.d = U.today();
  S.milestones.push({id:U.uid(), t:f.t.trim().slice(0,120), d:f.d, way:f.way || null, note:(f.note || '').slice(0,240)});
  if (S.milestones.length > 300) S.milestones = S.milestones.slice(-300);
  App.ui.f.ms = {t:'', d:U.today(), way:'', note:''}; App.commit(['core']);
  App.toast({t:'Marco registrado', s:'Isso aqui vai estar no seu documentário.', ic:'flag'});
};
App.A.msDel = function(el){ var id = el.getAttribute('data-id'); App.S.milestones = App.S.milestones.filter(function(m){ return m.id !== id; }); App.commit(['core']); };

/* ---------- Metas ---------- */
App.HORIZ = [['3m','3 meses'],['6m','6 meses'],['1a','1 ano'],['3a','3 anos']];
App.krDone = function(kr){ return kr.node ? !!App.D.nodeDone[kr.node] : !!kr.done; };
App.V.metas = function(){
  var S = App.S, D = App.D, f = App.ui.f.goal || (App.ui.f.goal = {t:'', way:S.settings.season.main, h:'1a', krs:[{t:'', node:''},{t:'', node:''}]});
  var act = S.goals.filter(function(g){ return !g.done; }), fin = S.goals.filter(function(g){ return g.done; });
  var h = H.head('Metas & OKRs', 'Metas', 'Metas de verdade, com resultados-chave. KRs ligados a um nó se completam sozinhos quando a quest é concluída. Meta concluída = +30 ◆. Mantenha no máximo 3–5 ativas.');
  function card(g){
    var w = App.way(g.way) || SYS.WAYS[0], dn = g.krs.filter(App.krDone).length, all = dn === g.krs.length && g.krs.length > 0;
    return '<article class="win flat" style="--wc:'+w.color+';border-left:3px solid '+w.color+'"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap;gap:10px"><div class="stack" style="gap:6px;min-width:0"><h3>'+U.esc(g.t)+'</h3><div class="row" style="gap:6px">'+H.wayChip(g.way)+'<span class="chip">horizonte '+U.esc((App.HORIZ.filter(function(x){ return x[0] === g.h; })[0] || ['', g.h])[1])+'</span><span class="chip">desde '+U.fmtDate(g.d)+'</span>'+(g.done ? '<span class="chip ok">concluída '+U.fmtDate(g.done)+'</span>' : '')+'</div></div><button class="iconbtn" data-a="goalDel" data-id="'+g.id+'" aria-label="Apagar meta">'+U.icon('trash')+'</button></div>'
      + '<div class="stack" style="gap:4px;margin:10px 0"><div class="row between mono dim" style="font-size:12px"><span>'+dn+'/'+g.krs.length+' resultados-chave</span><span>'+U.pct(dn, g.krs.length)+'%</span></div>'+H.bar(U.pct(dn, g.krs.length), 'way', w.color)+'</div>'
      + '<div class="stack" style="gap:0">'+g.krs.map(function(kr, i){ var ok = App.krDone(kr), n = kr.node && E.NODE[kr.node];
          return n ? '<div class="check" style="cursor:default"><span class="kbox'+(ok ? ' on' : '')+'">'+U.icon(ok ? 'check' : 'lock')+'</span><span>'+U.esc(kr.t)+' <button class="chip glow" data-a="openNode" data-id="'+n.id+'" style="cursor:pointer">'+U.esc(n.id)+'</button><br><span class="faint" style="font-size:12px">completa ao concluir a quest</span></span></div>'
            : '<label class="check"><input type="checkbox" data-c="krTick" data-id="'+g.id+'" data-i="'+i+'"'+(ok ? ' checked' : '')+(g.done ? ' disabled' : '')+'><span>'+U.esc(kr.t)+'</span></label>'; }).join('')+'</div>'
      + (!g.done ? '<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn'+(all ? ' primary' : '')+'" data-a="goalDone" data-id="'+g.id+'"'+(all ? '' : ' disabled')+'>'+U.icon('target')+'Concluir meta · +30 ◆</button></div>' : '<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn sm ghost" data-a="goalReopen" data-id="'+g.id+'">Reabrir</button></div>')
      + '</article>';
  }
  var wayNodes = App.way(f.way).arcs.reduce(function(a, arc){ return a.concat(arc.nodes); }, []);
  var form = '<section class="win"><div class="win-h">'+U.icon('plus')+'Nova meta</div>'
    + '<label class="fld">Meta<input type="text" data-i="goalF" data-k="t" maxlength="120" value="'+U.esc(f.t)+'" placeholder="Ex.: Fechar o primeiro retainer de CTO fracionado"></label>'
    + '<div class="grid g2" style="gap:8px;margin-top:8px"><label class="fld">Caminho'+H.waySelect('data-c="goalWay"', f.way)+'</label><label class="fld">Horizonte<select data-c="goalH">'+App.HORIZ.map(function(x){ return '<option value="'+x[0]+'"'+(f.h === x[0] ? ' selected' : '')+'>'+x[1]+'</option>'; }).join('')+'</select></label></div>'
    + '<div class="stack" style="gap:8px;margin-top:10px"><span class="eyebrow">Resultados-chave</span>'
    + f.krs.map(function(kr, i){ return '<div class="grid krrow" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto;gap:6px;align-items:center"><input type="text" data-i="krF" data-i2="'+i+'" maxlength="120" value="'+U.esc(kr.t)+'" placeholder="KR '+(i+1)+'" aria-label="Resultado-chave '+(i+1)+'"><select data-c="krNode" data-i2="'+i+'" aria-label="Quest ligada"><option value="">— manual —</option>'+wayNodes.map(function(n){ return '<option value="'+n.id+'"'+(kr.node === n.id ? ' selected' : '')+'>'+U.esc(n.id+' · '+n.t).slice(0,70)+'</option>'; }).join('')+'</select><button class="iconbtn" data-a="krRm" data-i2="'+i+'" aria-label="Remover KR">'+U.icon('close')+'</button></div>'; }).join('')
    + (f.krs.length < 6 ? '<button class="btn sm ghost" data-a="krAdd" style="align-self:flex-start">'+U.icon('plus')+'Adicionar KR</button>' : '')
    + '</div><div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="goalAdd">'+U.icon('target')+'Criar meta</button></div></section>';
  var sug = SYS.GOAL_SUGGESTIONS.filter(function(s){ return !S.goals.some(function(g){ return g.t === s.t; }); });
  var sugs = sug.length ? '<section class="win"><div class="win-h">'+U.icon('sparkle')+'Sugestões do Sistema</div><div class="stack" style="gap:8px">'+sug.map(function(s){ var i = SYS.GOAL_SUGGESTIONS.indexOf(s), w = App.way(s.way); return '<div class="res" style="cursor:default;--wc:'+w.color+'"><span style="color:'+w.color+'">'+U.icon(w.icon)+'</span><span style="min-width:0"><b>'+U.esc(s.t)+'</b><br><span class="ty">'+U.esc(w.name)+' · '+s.krs.length+' KRs · '+U.esc((App.HORIZ.filter(function(x){ return x[0] === s.h; })[0] || ['',s.h])[1])+'</span></span><button class="btn sm" data-a="goalSug" data-i="'+i+'">Adotar</button></div>'; }).join('')+'</div></section>' : '';
  h += '<div class="grid g2" style="align-items:start"><div class="stack" style="gap:14px">'+(act.length ? act.map(card).join('') : '<div class="empty">Nenhuma meta ativa. Sem destino, todo caminho serve — inclusive o sofá.</div>')+'</div><div class="stack" style="gap:14px">'+form+sugs+'</div></div>';
  if (fin.length) h += '<section class="win"><div class="win-h">'+U.icon('check')+'Concluídas · '+fin.length+'</div><div class="stack" style="gap:12px">'+fin.slice().reverse().map(card).join('')+'</div></section>';
  return h;
};
App.I.goalF = function(el){ App.ui.f.goal[el.getAttribute('data-k')] = el.value; };
App.C.goalWay = function(el){ var f = App.ui.f.goal; f.way = el.value; f.krs.forEach(function(k){ if (k.node && E.NODE[k.node] && E.NODE[k.node].way !== f.way) k.node = ''; }); App.renderView(); };
App.C.goalH = function(el){ App.ui.f.goal.h = el.value; };
App.I.krF = function(el){ App.ui.f.goal.krs[+el.getAttribute('data-i2')].t = el.value; };
App.C.krNode = function(el){ var kr = App.ui.f.goal.krs[+el.getAttribute('data-i2')]; kr.node = el.value; if (el.value && !kr.t) { kr.t = E.NODE[el.value].t; App.renderView(); } };
App.A.krAdd = function(){ var f = App.ui.f.goal; if (f.krs.length < 6) f.krs.push({t:'', node:''}); App.renderView(); };
App.A.krRm = function(el){ var f = App.ui.f.goal; f.krs.splice(+el.getAttribute('data-i2'), 1); if (!f.krs.length) f.krs.push({t:'', node:''}); App.renderView(); };
App.A.goalAdd = function(){
  var f = App.ui.f.goal, S = App.S, krs = f.krs.filter(function(k){ return (k.t || '').trim() || k.node; });
  if ((f.t || '').trim().length < 3) { App.toast({t:'Meta sem nome', s:'“Ser alguém na vida” não conta. Seja específico.', ic:'alert'}); return; }
  if (!krs.length) { App.toast({t:'Sem resultados-chave', s:'Meta sem KR é desejo. Adicione pelo menos um.', ic:'alert'}); return; }
  if (S.goals.filter(function(g){ return !g.done; }).length >= 12) { App.toast({t:'Metas demais', s:'12 metas ativas é lista de desejos. Conclua ou apague algumas.', ic:'alert'}); return; }
  S.goals.push({id:U.uid(), t:f.t.trim().slice(0,120), way:f.way, h:f.h, d:U.today(), done:null, krs:krs.map(function(k){ return {t:(k.t || E.NODE[k.node].t).slice(0,120), node:k.node || null, done:false}; })});
  App.ui.f.goal = {t:'', way:f.way, h:f.h, krs:[{t:'', node:''},{t:'', node:''}]};
  App.commit(['core']); App.toast({t:'Meta criada', s:'Agora ela te observa. Boa sorte.', ic:'target'});
};
App.A.goalSug = function(el){
  var s = SYS.GOAL_SUGGESTIONS[+el.getAttribute('data-i')], S = App.S; if (!s) return;
  S.goals.push({id:U.uid(), t:s.t, way:s.way, h:s.h, d:U.today(), done:null, krs:s.krs.map(function(k){ return {t:k[0], node:k[1] || null, done:false}; })});
  App.commit(['core']); App.toast({t:'Meta adotada', s:s.t, ic:'target'});
};
App.C.krTick = function(el){ var g = App.S.goals.filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; if (!g) return; g.krs[+el.getAttribute('data-i')].done = el.checked; App.commit(['core']); };
App.A.goalDone = function(el){ var g = App.S.goals.filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; if (!g || !g.krs.every(App.krDone)) return; g.done = U.today(); App.commit(['core']); App.toast({t:'Meta concluída · +30 ◆', s:'Você disse que ia fazer e fez. Raro. Registrado.', ic:'target', ms:5200}); };
App.A.goalReopen = function(el){ var g = App.S.goals.filter(function(x){ return x.id === el.getAttribute('data-id'); })[0]; if (!g) return; g.done = null; App.commit(['core']); };
App.A.goalDel = function(el){ App.ui.modal = {type:'confirm', title:'Apagar meta?', body:'Metas concluídas apagadas tiram os +30 ◆ do saldo. Conquistas já ganhas continuam.', danger:1, ok:'Apagar', act:'goalDelDo', id:el.getAttribute('data-id')}; App.renderModal(); };
App.A.goalDelDo = function(){ var id = App.ui.modal && App.ui.modal.id; App.S.goals = App.S.goals.filter(function(g){ return g.id !== id; }); App.ui.modal = null; App.commit(['core']); };

App.featsAll = function(){
  var D = App.D;
  return SYS.WAYS.map(function(w){
    var fs = SYS.FEATS.filter(function(f){ return f.way === w.id; }); if (!fs.length) return '';
    return '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon(w.icon)+U.esc(w.name)+' · '+fs.filter(function(f){ return D.featDone[f.id]; }).length+'/'+fs.length+'<a class="act" href="#/caminhos/'+w.id+'/feitos">contadores →</a></div><div class="stack" style="gap:8px">'+fs.map(App.featRow).join('')+'</div></section>';
  }).join('');
};
