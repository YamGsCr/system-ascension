/* ===== v12 · CAPÍTULO POR TRILHA ==========================================
   A trilha escolhida passa a trocar o capítulo inteiro (título, gancho,
   missão, entregável, critério e armadilhas) — não só os tópicos de estudo.
   O payload de SYS.track ganha as chaves t, s, q, dv, g, f e tb.
   Nada é mutado: a sobreposição é uma view em cima do nó original, então
   o progresso continua salvo por id e por índice, trilha a trilha.
   ========================================================================= */
App.CHAPK = ['t','s','q','dv','g','f','tb'];

App.chapOv = function(n){
  var ov = null;
  (n.chx || []).forEach(function(x){
    var o = App.trackOpt(x.key); if (!o) return;
    var p = x.per[o.id]; if (!p) return;
    App.CHAPK.forEach(function(k){ if (p[k]) { ov = ov || {}; ov[k] = p[k]; } });
  });
  return ov;
};
App.chapNode = function(n){
  var ov = App.chapOv(n); if (!ov) return n;
  var c = Object.create(n); Object.keys(ov).forEach(function(k){ c[k] = ov[k]; });
  c._chap = 1; return c;
};
/* executa fn() com E.NODE[id] temporariamente sobreposto pela trilha ativa */
App.withChap = function(id, fn){
  var n = E.NODE[id]; if (!n) return fn();
  var ov = App.chapOv(n); if (!ov) return fn();
  E.NODE[id] = App.chapNode(n);
  try { return fn(); } finally { E.NODE[id] = n; }
};

(function(){
  /* navegação prev/próximo por id: a sobreposição quebra comparação por identidade */
  App.nodeNav = function(n){
    var arc = E.arcOf(n), ids = arc.nodes.map(function(x){ return x.id; }), i = ids.indexOf(n.id);
    var prev = i > 0 ? arc.nodes[i - 1] : null, next = i >= 0 ? arc.nodes[i + 1] : null;
    return '<div class="row between" style="margin-top:6px">'
      + (prev ? '<button class="btn sm ghost" data-a="openNode" data-id="' + prev.id + '">' + U.icon('back') + U.esc(prev.id) + '</button>' : '<span></span>')
      + (next ? '<button class="btn sm ghost" data-a="openNode" data-id="' + next.id + '">' + U.esc(next.id) + U.icon('chev') + '</button>' : '<span></span>') + '</div>';
  };

  /* lista de capítulos: título já sai com a cara da trilha */
  var oldRow = H.nodeRow;
  H.nodeRow = function(n){ return oldRow(App.chapNode(n)); };

  /* gaveta do capítulo + modais de concluir/reverter */
  var oldDrawer = App.nodeDrawer;
  App.nodeDrawer = function(u){ return App.withChap(u.id, function(){ return oldDrawer(u); }); };
  ['done','undo'].forEach(function(k){
    var old = App.M[k]; if (!old) return;
    App.M[k] = function(m){ return (m && m.id) ? App.withChap(m.id, function(){ return old(m); }) : old(m); };
  });

  /* aviso na missão de que aquele capítulo muda com a trilha */
  var oldMission = App.nodeMission;
  App.nodeMission = function(n){
    var out = oldMission(n);
    if (!n._chap) return out;
    var nomes = (n.chx || []).map(function(x){ var o = App.trackOpt(x.key); return o ? o.n : null; }).filter(Boolean).join(' · ');
    return '<div class="callout" style="border-color:var(--accent2);background:rgba(143,107,255,.08)"><b>Capítulo na trilha ' + U.esc(nomes) + '.</b> '
      + '<span class="dim">Título, missão e critério mudam com a trilha escolhida — o progresso de cada uma fica salvo separado, então trocar de jogo não apaga nada.</span></div>' + out;
  };
})();
