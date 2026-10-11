/* ===== CIDADE · a aba (beta): a cidade ocupando a tela, o HUD e as janelas dos bairros, do Centro e do radar =====
   Sem rolagem: o mapa preenche a área abaixo do HUD do Sistema (e acima da barra do celular). Tocar num bairro abre
   a janela dele por cima, com vinheta; o radar é o minimapa no canto e o botão com a sua foto abre a Janela do
   Caçador (src/78_city_ui.js). A aba só aparece com a chave "Cidade (beta)" ligada nos Ajustes. */
(function(){
  var CY = SYS.CITY;
  App.CYW = App.CYW || {};

  /* menu: logo depois da Zona (ou de Portões); o 4º item diz quando o botão aparece */
  var at = -1;
  App.NAV.forEach(function(n, k){ if (n && n[0] === 'zona') at = k; });
  if (at < 0) App.NAV.forEach(function(n, k){ if (n && n[0] === 'portoes') at = k; });
  App.NAV.splice(at >= 0 ? at + 1 : 5, 0, ['cidade', 'Cidade', 'city', function(){ return E.cityOn(App.S); }]);
  App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });

  function ui(){ return App.ui.cy || (App.ui.cy = {prev: {}}); }
  function state(id){
    var st = E.cityDist(App.city, id), p = ui().prev;
    return {corr: Object.prototype.hasOwnProperty.call(p, id) ? p[id] : st.corr, closed: st.closed, open: E.cityOpen(App.city, id), real: st.corr};
  }
  App.cyState = state;
  function openAll(){ return ((App.city && App.city.portals) || []).filter(function(p){ return p && p.st !== 'closed'; }); }
  App.cyOpenAll = openAll;
  function hr(){ return String(U.resetHour()).padStart(2, '0') + ':00'; }

  /* ---------- tela com a Cidade desligada ---------- */
  function off(){
    return H.head('Cidade · beta', 'A Cidade', 'Portais nascem sozinhos nos 7 bairros, um por Caminho, com rank de E a S, prazo e drop. Em beta: portais, drop e Licença já funcionam; caixas, vales, Ecos e Forja chegam nos próximos blocos.')
      + '<section class="win"><div class="win-h">' + U.icon('city') + 'Cidade (beta)</div><div class="stack" style="gap:12px">'
      + '<p>A chave fica desligada até você pedir. Ligar não mexe no seu progresso: a Cidade guarda tudo num save próprio, separado do resto.</p>'
      + '<div class="row"><button class="btn primary" data-a="cityOn">' + U.icon('city') + 'Ligar a Cidade (beta)</button><span class="faint" style="font-size:13px">Dá para desligar em Perfil → Ajustes.</span></div>'
      + '</div></section>';
  }

  /* ---------- Estação ---------- */
  App.cyEstacao = function(curta){
    var e = E.cityEstacao(U.today()), n = e.e.n, ev = e.e.evento + ' (' + U.fmtDate(e.e.inicio) + ')';
    if (curta) return e.fase === 'antes' ? 'Estação 1 · ' + n + ' em ' + (e.dias === 1 ? '1 dia' : e.dias + ' dias') : e.fase === 'agora' ? 'Estação 1 · ' + n + ' · semana ' + e.semana + '/' + e.e.semanas : 'Estação 1 · ' + n + ' terminou';
    if (e.fase === 'antes') return 'Estação 1 · ' + n + ' começa ' + (e.dias === 1 ? 'amanhã' : 'em ' + e.dias + ' dias') + ', na ' + ev;
    if (e.fase === 'agora') return 'Estação 1 · ' + n + ', semana ' + e.semana + ' de ' + e.e.semanas + (e.dias === 0 ? ' · hoje é a ' + e.e.evento : '');
    return 'Estação 1 · ' + n + ' terminou';
  };

  /* ---------- palco: o tamanho exato da área livre; em pé, a cidade gira ---------- */
  App.cyStage = function(){
    var mob = window.innerWidth <= 960, hud = document.getElementById('hud'), mn = document.getElementById('mnav');
    var w = window.innerWidth - (mob ? 0 : 236), h = window.innerHeight - (hud ? hud.offsetHeight : 61) - (mob && mn ? mn.offsetHeight : 0);
    w = Math.max(260, w); h = Math.max(280, h);
    return {w: w, h: h, or: w / h < 0.95 ? 'port' : 'land'};
  };
  /* o bairro destacado no mapa é o da primeira janela aberta */
  App.cySel = function(){ var w = (App.ui.cyw || [])[0]; return !w ? null : w.t === 'dist' ? w.id : w.t === 'centro' ? 'centro' : w.t === 'nevoa' ? 'nevoa' : null; };

  App.V.cidade = function(){
    if (!E.cityOn(App.S)) return off();
    var st = App.cyStage(), c = App.city, L = E.cyLic(c), n = E.cyCount(c), mx = CY.CONF.ritmo.abertosMax;
    ui().or = st.or;
    return '<div class="cy-stage cy-' + st.or + '" id="cyStage">'
      + '<div class="cy-mapbox">' + App.cityMap(state, {or: st.or, sel: App.cySel()}) + '</div>'
      + '<div class="cy-hud">'
      + '<button class="cy-me" data-a="cyWin" data-w="hub" data-reset aria-label="Janela do Caçador: perfil, inventário e celular"><span class="cy-me-av">' + App.cyAvatar() + '<span class="cy-me-rk">' + U.rankBadge(L.r, 22) + '</span></span>'
      + '<span class="cy-me-t"><b>' + U.esc(H.pname()) + '</b><span>Licença ' + L.r + ' · ' + L.pts + ' pts</span></span></button>'
      + '<button class="cy-mini" data-a="cyWin" data-w="radar" data-reset aria-label="Radar: ' + n + ' de ' + mx + ' portais abertos">' + App.cyMini(state, st.or) + '<span class="cy-mini-t">' + n + '/' + mx + '</span></button>'
      + '<div class="cy-est">' + U.icon('clock') + '<span>' + U.esc(App.cyEstacao(true)) + '</span></div>'
      + '</div></div>';
  };

  /* ---------- janelas: bairro, Centro, névoa e radar ---------- */
  function tabs(w, list){
    var cur = w.tab || list[0][0];
    return '<div class="tabs cyw-tabs" role="tablist">' + list.map(function(t){ var on = cur === t[0]; return '<button role="tab" aria-selected="' + on + '" class="' + (on ? 'on' : '') + '" data-a="cyWinTab" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>';
  }
  App.cyTabs = tabs;

  App.CYW.dist = function(w){
    var d = CY.DMAP[w.id]; if (!d) return null;
    var wy = App.way(d.way), st = state(d.id), depth = E.cityDepth(st.closed), list = st.open, tab = w.tab || 'portais', prev = Object.prototype.hasOwnProperty.call(ui().prev, d.id);
    var b = tabs(w, [['portais', 'Portais' + (list.length ? ' · ' + list.length : '')], ['bairro', 'Bairro'], ['clas', 'Clãs']]);
    if (tab === 'portais') b += App.cyPortalsHTML(list, 'Nenhum portal aberto aqui. Os próximos nascem no reset das ' + hr() + '.');
    else if (tab === 'bairro') b += '<div class="stack" style="gap:6px"><span class="eyebrow">Ruas · as vertentes</span><div class="row" style="gap:6px">' + d.ruas.map(function(r){ return '<span class="chip">' + U.esc(r) + '</span>'; }).join('') + '</div></div>'
      + '<div class="stack" style="gap:4px"><span class="eyebrow">Estado</span><div class="row between mono" style="font-size:12px"><span>Profundidade ' + depth + ' de 10</span><span class="dim">' + st.closed + ' portais fechados</span></div>' + H.bar(depth * 10, 'thin')
      + '<p style="font-size:13.5px;margin-top:6px;color:' + (st.corr ? 'var(--cy-red)' : 'var(--dim)') + '"><b>' + CY.CORR[st.corr].n + '</b>' + (prev ? ' (prévia)' : '') + ' · ' + U.esc(CY.CORR[st.corr].d) + '</p></div>'
      + '<div class="stack" style="gap:6px"><span class="eyebrow">Prévia da corrupção · só na tela</span><div class="cy-prev">'
      + [0, 1, 2, 3].map(function(v){ return '<button class="btn sm' + (st.corr === v ? ' on' : '') + '" data-a="cyPrev" data-v="' + v + '" aria-pressed="' + (st.corr === v) + '">' + (v ? v : 'limpo') + '</button>'; }).join('')
      + '</div><span class="faint" style="font-size:12.5px">Mostra no mapa, atrás desta janela, como o bairro fica. Não grava nada.</span></div>';
    else b += '<div class="stack" style="gap:0">' + d.clas.map(function(c){
        var rep = Object.keys(CY.PERS).map(function(k){ return CY.PERS[k]; }).filter(function(p){ return p.cla === c[0]; })[0];
        return '<div class="cy-clan"><b>' + U.esc(c[0]) + '</b><i>“' + U.esc(c[1]) + '”</i>' + (rep ? '<span class="cy-rep">' + (App.img(rep.img) ? '<img src="' + App.img(rep.img) + '" alt="">' : '') + 'Representante: ' + U.esc(rep.n) + '</span>' : '') + '</div>';
      }).join('') + '<p class="faint" style="font-size:12.5px;margin-top:8px">Os 17 clãs abrem as portas juntos, no bloco das Facções.</p></div>';
    return {ic: d.ic, sup: 'Bairro', t: d.n, wc: wy.color, b: b,
      chips: '<a class="chip" href="#/caminhos/' + d.way + '" style="color:' + wy.color + ';text-decoration:none">' + U.icon(wy.icon) + U.esc(wy.name) + '</a>' + (st.corr ? '<span class="chip bad">corrupção ' + st.corr + '</span>' : '<span class="chip">prof. ' + depth + '</span>') + '<span class="chip">' + list.length + (list.length === 1 ? ' portal' : ' portais') + '</span>'};
  };
  App.CYW.centro = function(){
    return {ic: 'd_center', sup: 'A praça do meio', t: 'Centro', wc: 'var(--glow)', b: '<div class="stack" style="gap:0">'
      + CY.CENTRO.itens.map(function(it){ return '<div class="cy-clan"><b>' + U.esc(it[0]) + '</b><i>' + U.esc(it[1]) + '</i></div>'; }).join('') + '</div>'
      + '<p class="faint" style="font-size:13px">As Dungeons ainda moram em <a href="#/portoes/dungeons">Portões → Dungeons</a>. Elas se mudam para o Centro mais adiante.</p>'};
  };
  App.CYW.nevoa = function(){ return {ic: 'd_fog', sup: 'Fora do mapa', t: '???', wc: 'var(--faint)', cls: 'narrow', b: '<p class="dim">' + U.esc(CY.NEVOA.fala) + '</p>'}; };
  App.CYW.radar = function(w){
    var open = openAll(), tab = w.tab || 'radar', c = App.city, S = App.S, day = U.today(), z = S.pz || {}, R = CY.CONF.ritmo, cont = E.cyCount(c), extra = open.length - cont;
    var b = tabs(w, [['radar', 'Radar'], ['portais', 'Portais · ' + open.length], ['legenda', 'Legenda']]);
    if (tab === 'radar') {
      var prox = E.cyPaused(S, day) ? 'em pausa junto com o protocolo' : c.spawn === day ? 'amanhã, no reset das ' + hr() + (cont > CY.NASCE.cheio ? ' (só 1: mais de 4 abertos)' : '') : 'agora, assim que a nuvem for conferida';
      var cham = !z.on ? 'protocolo desligado' : c.cham === day ? 'o portal de hoje já nasceu' : 'nasce quando a janela abrir, às ' + z.ini;
      var rows = [['Portais', cont + ' de ' + R.abertosMax + ' abertos' + (extra > 0 ? ' · +' + extra + ' fora do limite' : '')], ['Próximo', prox], ['Chamado', cham], ['Raid', 'nenhuma anunciada · uma por mês'], ['Maldições', 'nenhuma ativa'], ['Mercador', 'fora da Cidade']];
      b += '<div class="cy-top"><div class="cy-bigmini">' + App.cyMini(state, ui().or || 'land') + '</div><div class="stack" style="gap:10px;min-width:0"><dl class="cy-rdlist">'
        + rows.map(function(r){ return '<dt>' + r[0] + '</dt><dd>' + U.esc(r[1]) + '</dd>'; }).join('') + '</dl><div class="callout" style="font-size:13.5px">' + U.esc(App.cyEstacao()) + '</div></div></div>';
    } else if (tab === 'portais') b += App.cyPortalsHTML(open, 'Nenhum portal aberto agora. Os próximos nascem no reset das ' + hr() + '.');
    else b += '<div class="cy-legend"><span class="eyebrow" style="margin-right:2px">Ranks</span>' + CY.RANKS.map(function(r){ return '<span class="rk">' + U.rankBadge(r, 24) + '</span>'; }).join('')
      + '<span>E e D: exercício · C e B: projeto · A e S: projeto com defesa</span></div>'
      + '<div class="cy-legend"><span class="eyebrow" style="margin-right:2px">Corrupção</span><span><i class="cy-sw" style="background:rgba(255,59,92,.12)"></i>1</span><span><i class="cy-sw" style="background:rgba(255,59,92,.26)"></i>2</span><span><i class="cy-sw" style="background:rgba(255,59,92,.42)"></i>3</span><span>vermelho com ruído; as rachaduras crescem a cada nível</span></div>'
      + '<div class="cy-legend"><span class="eyebrow" style="margin-right:2px">Mapa</span><span>bairros encostados, avenidas entre eles, o rio com 4 pontes e névoa nas bordas</span></div>';
    return {ic: 'radar', sup: 'Minimapa', t: 'Radar', wc: 'var(--glow)', b: b, cls: 'cy-radarwin wide'};
  };

  /* ---------- ações ---------- */
  function setCity(on){
    App.citySet(on);
    App.toast(on ? {t: 'Cidade (beta) ligada', s: 'A aba Cidade apareceu no menu. Os primeiros portais nascem agora.', ic: 'city'} : {t: 'Cidade (beta) desligada', s: 'A Cidade congelou: nada vence nem quebra até você ligar de novo.', ic: 'city'});
  }
  App.C.pCity = function(el){ setCity(el.checked); };
  App.A.cityOn = function(){ setCity(true); };
  App.A.cyPick = function(el){
    var id = el.getAttribute('data-id');
    App.cyWinOpen(id === 'centro' ? {t: 'centro'} : id === 'nevoa' ? {t: 'nevoa'} : {t: 'dist', id: id}, {reset: true});
  };
  App.A.cyPrev = function(el){
    var w = App.cyWinTop(), id = w && w.id, u = ui(), v = +el.getAttribute('data-v'); if (!CY.DMAP[id]) return;
    if (v === E.cityDist(App.city, id).corr) delete u.prev[id]; else u.prev[id] = v;
    App.renderView(); App.cyWinRender();
  };
  /* Enter e espaço num bairro, na névoa ou numa insígnia do mapa funcionam como clique */
  document.addEventListener('keydown', function(ev){
    var t = ev.target; if ((ev.key !== 'Enter' && ev.key !== ' ') || !t || !t.getAttribute) return;
    var a = t.getAttribute('data-a');
    if (a === 'cyPick' && t.closest && t.closest('.cy-svg')) { ev.preventDefault(); App.A.cyPick(t); }
    else if (a === 'cyOpen' && t.classList.contains('cy-badge')) { ev.preventDefault(); App.A.cyOpen(t); }
  });

  /* tela inteira: sem rolagem na Cidade; o mapa redesenha quando a tela vira */
  var oldRV = App.renderView;
  App.renderView = function(){
    var full = App.ui.route === 'cidade' && !!App.S && E.cityOn(App.S), v = document.getElementById('view');
    document.documentElement.classList.toggle('cy-full', full);
    if (v) v.style.height = full ? App.cyStage().h + 'px' : '';
    if (full) try { window.scrollTo(0, 0); } catch(e){}
    var r = oldRV.apply(this, arguments);
    if (full && App.cyAfter) App.cyAfter();
    return r;
  };
  var rz = null;
  function fit(){
    if (App.ui.route !== 'cidade' || !App.S || !E.cityOn(App.S)) return null;
    var st = App.cyStage(), v = document.getElementById('view');
    if (v) v.style.height = st.h + 'px';
    return st;
  }
  window.addEventListener('resize', function(){
    fit();
    clearTimeout(rz);
    rz = setTimeout(function(){ var st = fit(); if (st && st.or !== ui().or) App.renderView(); }, 120);
  });
})();
