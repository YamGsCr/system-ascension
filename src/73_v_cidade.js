/* ===== CIDADE · aba (beta): menu, radar, mapa, ficha do distrito e a chave nos Ajustes =====
   A aba só aparece com a chave "Cidade (beta)" ligada nos Ajustes. Nesta fase: mapa parado e radar vazio;
   o motor de portais, o drop e o resto chegam nos próximos blocos. */
(function(){
  var CY = SYS.CITY;

  /* menu: logo depois da Zona (ou de Portões); o 4º item diz quando o botão aparece */
  var at = -1;
  App.NAV.forEach(function(n, k){ if (n && n[0] === 'zona') at = k; });
  if (at < 0) App.NAV.forEach(function(n, k){ if (n && n[0] === 'portoes') at = k; });
  App.NAV.splice(at >= 0 ? at + 1 : 5, 0, ['cidade', 'Cidade', 'city', function(){ return E.cityOn(App.S); }]);
  App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });

  function ui(){ return App.ui.cy || (App.ui.cy = {sel: null, prev: {}}); }
  function state(id){
    var st = E.cityDist(App.city, id), p = ui().prev;
    return {corr: Object.prototype.hasOwnProperty.call(p, id) ? p[id] : st.corr, closed: st.closed, open: E.cityOpen(App.city, id), real: st.corr};
  }
  function openAll(){ return ((App.city && App.city.portals) || []).filter(function(p){ return p && p.st !== 'closed'; }); }

  /* ---------- tela com a Cidade desligada ---------- */
  function off(){
    return H.head('Cidade · beta', 'A Cidade', 'Portais nascem sozinhos nos 7 distritos, um por Caminho, com rank de E a S, prazo e drop. A Cidade está sendo construída: por enquanto, o mapa e o radar.')
      + '<section class="win"><div class="win-h">' + U.icon('city') + 'Cidade (beta)</div><div class="stack" style="gap:12px">'
      + '<p>A chave fica desligada até você pedir. Ligar não mexe no seu progresso: a Cidade guarda tudo num save próprio, separado do resto.</p>'
      + '<div class="row"><button class="btn primary" data-a="cityOn">' + U.icon('city') + 'Ligar a Cidade (beta)</button><span class="faint" style="font-size:13px">Dá para desligar em Perfil → Ajustes.</span></div>'
      + '</div></section>';
  }

  /* ---------- radar ---------- */
  function estacao(){
    var e = E.cityEstacao(U.today()), n = e.e.n, ev = e.e.evento + ' (' + U.fmtDate(e.e.inicio) + ')';
    if (e.fase === 'antes') return 'Estação 1 · ' + n + ' começa ' + (e.dias === 1 ? 'amanhã' : 'em ' + e.dias + ' dias') + ', na ' + ev;
    if (e.fase === 'agora') return 'Estação 1 · ' + n + ', semana ' + e.semana + ' de ' + e.e.semanas + (e.dias === 0 ? ' · hoje é a ' + e.e.evento : '');
    return 'Estação 1 · ' + n + ' terminou';
  }
  function radar(){
    var open = openAll(), R = CY.CONF.ritmo;
    var rows = [
      ['Portais', open.length + ' de ' + R.abertosMax + ' abertos'],
      ['Próximo', open.length ? 'no próximo reset' : 'o motor de portais ainda não ligou'],
      ['Raid', 'nenhuma anunciada · uma por mês'],
      ['Maldições', 'nenhuma ativa'],
      ['Mercador', 'fora da Cidade']
    ];
    return '<section class="win cy-radarwin"><div class="win-h">' + U.icon('radar') + 'Radar<span class="chip">beta</span></div><div class="cy-top">'
      + App.cyRadar(open)
      + '<div class="stack" style="gap:10px;min-width:0"><dl class="cy-rdlist">' + rows.map(function(r){ return '<dt>' + r[0] + '</dt><dd>' + U.esc(r[1]) + '</dd>'; }).join('') + '</dl>'
      + '<div class="callout" style="font-size:13.5px">' + U.esc(estacao()) + '</div></div></div></section>';
  }

  /* ---------- mapa e legenda ---------- */
  function mapWin(){
    var legend = '<div class="cy-legend"><span class="eyebrow" style="margin-right:2px">Ranks</span>'
      + CY.RANKS.map(function(r){ return '<span class="rk">' + U.rankBadge(r, 24) + '</span>'; }).join('')
      + '<span>E e D: exercício · C e B: projeto · A e S: projeto com defesa</span></div>'
      + '<div class="cy-legend"><span class="eyebrow" style="margin-right:2px">Corrupção</span><span><i class="cy-sw" style="background:rgba(255,59,92,.12)"></i>1</span><span><i class="cy-sw" style="background:rgba(255,59,92,.26)"></i>2</span><span><i class="cy-sw" style="background:rgba(255,59,92,.42)"></i>3</span><span>vermelho com ruído; as rachaduras crescem a cada nível</span></div>';
    return '<section class="win cy-mapwin"><div class="win-h">' + U.icon('city') + 'Mapa<span class="chip">7 distritos e o Centro</span></div>'
      + '<div class="cy-map">' + App.cityMap(state, ui().sel) + '</div>' + legend + '</section>';
  }

  /* ---------- ficha ---------- */
  function distRow(d){
    var w = App.way(d.way), st = state(d.id);
    return '<button class="cy-drow" style="--wc:' + w.color + '" data-a="cyPick" data-id="' + d.id + '">' + U.icon(d.ic) + '<span class="stack" style="gap:1px;min-width:0"><b>' + U.esc(d.n) + '</b><span class="faint" style="font-size:12.5px">' + U.esc(w.name) + '</span></span>'
      + '<span class="mono" style="font-size:11.5px;color:' + (st.corr ? 'var(--cy-red)' : 'var(--dim)') + '">' + (st.corr ? 'corr. ' + st.corr : st.open.length + ' portais') + '</span></button>';
  }
  function panel(){
    var sel = ui().sel;
    if (!sel) return '<section class="win"><div class="win-h">' + U.icon('map') + 'Distritos</div><p class="dim" style="font-size:14px;margin-bottom:10px">Toque num distrito, no mapa ou aqui, para ver as ruas, os clãs e o estado dele.</p><div class="cy-dlist">'
      + CY.DIST.map(distRow).join('') + '<button class="cy-drow" style="--wc:var(--glow)" data-a="cyPick" data-id="centro">' + U.icon('d_center') + '<span class="stack" style="gap:1px"><b>Centro</b><span class="faint" style="font-size:12.5px">Dungeons, Raids e Oficina</span></span><span></span></button></div></section>';
    var back = '<button class="act" data-a="cyPick" data-id="' + sel + '">fechar ✕</button>';
    if (sel === 'nevoa') return '<section class="win"><div class="win-h">' + U.icon('d_fog') + '???' + back + '</div><p class="dim">' + U.esc(CY.NEVOA.fala) + '</p></section>';
    if (sel === 'centro') return '<section class="win"><div class="win-h">' + U.icon('d_center') + 'Centro' + back + '</div><div class="stack" style="gap:10px">'
      + CY.CENTRO.itens.map(function(it){ return '<div class="cy-clan"><b>' + U.esc(it[0]) + '</b><i>' + U.esc(it[1]) + '</i></div>'; }).join('')
      + '<p class="faint" style="font-size:13px">As Dungeons ainda moram em <a href="#/portoes/dungeons">Portões → Dungeons</a>. Elas se mudam para o Centro mais adiante.</p></div></section>';
    var d = CY.DMAP[sel]; if (!d) { ui().sel = null; return panel(); }
    var w = App.way(d.way), st = state(d.id), depth = E.cityDepth(st.closed), prev = Object.prototype.hasOwnProperty.call(ui().prev, d.id);
    return '<section class="win cy-ficha" style="--wc:' + w.color + '"><div class="win-h" style="color:' + w.color + '">' + U.icon(d.ic) + U.esc(d.n) + back + '</div><div class="stack" style="gap:12px">'
      + '<a class="chip" href="#/caminhos/' + d.way + '" style="color:' + w.color + ';text-decoration:none;align-self:flex-start">' + U.icon(w.icon) + U.esc(w.name) + '</a>'
      + '<div class="stack" style="gap:6px"><span class="eyebrow">Ruas · as vertentes</span><div class="row" style="gap:6px">' + d.ruas.map(function(r){ return '<span class="chip">' + U.esc(r) + '</span>'; }).join('') + '</div></div>'
      + '<div class="stack" style="gap:4px"><span class="eyebrow">Estado</span>'
      + '<div class="row between mono" style="font-size:12px"><span>Profundidade ' + depth + ' de 10</span><span class="dim">' + st.closed + ' portais fechados</span></div>' + H.bar(depth * 10, 'thin')
      + '<p style="font-size:13.5px;margin-top:6px;color:' + (st.corr ? 'var(--cy-red)' : 'var(--dim)') + '"><b>' + CY.CORR[st.corr].n + '</b>' + (prev ? ' (prévia)' : '') + ' · ' + U.esc(CY.CORR[st.corr].d) + '</p></div>'
      + '<div class="stack" style="gap:0"><span class="eyebrow" style="margin-bottom:4px">Clãs</span>' + d.clas.map(function(c){ return '<div class="cy-clan"><b>' + U.esc(c[0]) + '</b><i>“' + U.esc(c[1]) + '”</i></div>'; }).join('')
      + '<p class="faint" style="font-size:12.5px;margin-top:6px">Os 17 clãs abrem as portas juntos, mais adiante.</p></div>'
      + '<div class="stack" style="gap:6px"><span class="eyebrow">Prévia da corrupção · só na tela</span><div class="cy-prev">'
      + [0, 1, 2, 3].map(function(v){ return '<button class="btn sm' + (st.corr === v ? ' on' : '') + '" data-a="cyPrev" data-v="' + v + '" aria-pressed="' + (st.corr === v) + '">' + (v ? v : 'limpo') + '</button>'; }).join('')
      + '</div><span class="faint" style="font-size:12.5px">Mostra no mapa como o distrito fica. Não grava nada.</span></div>'
      + '</div></section>';
  }

  App.V.cidade = function(){
    if (!E.cityOn(App.S)) return off();
    var since = App.city && App.city.since;
    return H.head('Cidade · beta', 'A Cidade', 'Sete distritos, um por Caminho, e o Centro. Os portais nascem nas ruas de cada distrito; por enquanto o radar está quieto.' + (since ? ' Na Cidade desde ' + U.fmtDate(since) + '.' : ''))
      + '<div class="stack" style="gap:16px">' + radar() + '<div class="cy-main">' + mapWin() + panel() + '</div></div>';
  };

  /* ---------- ações ---------- */
  function setCity(on){
    var S = App.S, C = App.city, docs = ['core'];
    S.settings.cityBeta = !!on;
    if (on && !C.since) { C.since = U.today(); C.log.push({at: new Date().toISOString(), k: 'beta'}); docs.push('city'); }
    App.commit(docs);
    App.toast(on ? {t: 'Cidade (beta) ligada', s: 'A aba Cidade apareceu no menu. Por enquanto: o mapa e o radar.', ic: 'city'} : {t: 'Cidade (beta) desligada', s: 'Nada foi apagado. Ligue de novo quando quiser.', ic: 'city'});
  }
  App.C.pCity = function(el){ setCity(el.checked); };
  App.A.cityOn = function(){ setCity(true); };
  App.A.cyPick = function(el, ev){
    var id = el.getAttribute('data-id'), u = ui();
    u.sel = u.sel === id ? null : id;
    App.renderView();
    if (ev && ev.detail === 0) { var b = document.querySelector('.cy-blk[data-id="' + id + '"]'); if (b && b.focus) b.focus(); }   /* veio do teclado: o foco volta para o mesmo distrito */
  };
  App.A.cyPrev = function(el){
    var u = ui(), id = u.sel, v = +el.getAttribute('data-v'); if (!CY.DMAP[id]) return;
    if (v === E.cityDist(App.city, id).corr) delete u.prev[id]; else u.prev[id] = v;
    App.renderView();
  };
  /* Enter e espaço num distrito do mapa funcionam como clique */
  document.addEventListener('keydown', function(ev){
    var t = ev.target;
    if ((ev.key === 'Enter' || ev.key === ' ') && t && t.classList && t.classList.contains('cy-blk')) { ev.preventDefault(); App.A.cyPick(t, {detail: 0}); }
  });
})();
