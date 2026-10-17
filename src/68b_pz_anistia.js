/* ===== Anistia (pedida em 17/10/2026): as prendas saem e os últimos dias parados viram descanso =====
   Uma vez só, até 31/10. Na próxima abertura, depois de a nuvem conferir o save e de a Zona julgar o atraso,
   o Sistema mostra o que encontrou e espera um toque para aplicar:
   - Zona: a sequência mais recente de faltas vira descanso (como uma trégua), as prendas abertas saem,
     a multa da sentença ainda não aceita volta e a sequência do Chamado é recontada pelo registro;
   - Sequência (a chama): os últimos dias sem nada feito ficam protegidos, sem gastar gelo
     (o gelo já gasto nesses dias volta para o estoque).
   O registro guarda a anistia em S.pz.anistias. */
(function(){
  var ATE = '2026-10-31', PEDIDO = '2026-10-17', MOTIVO = 'foco total no sistema da loja';
  function fmt(d){ return d.slice(8, 10) + '/' + d.slice(5, 7); }

  /* o que a anistia cobriria agora */
  App.pzAnPlan = function(){
    var S = App.S, z = S.pz || {}, t = U.today(), out = {zd: [], pens: [], gem: 0, sd: [], fz: 0, streak: 0, seq: 0};
    if (z.log) {
      var d = (z.log[t] && z.log[t].v === 'miss') ? t : U.addDays(t, -1);
      for (var i = 0; i < 60; i++) {
        var rec = z.log[d];
        if (rec && rec.v === 'miss') out.zd.push(d);
        else if (!(rec && rec.v) && z.since && d >= z.since && (z.dias || []).indexOf(U.parse(d).getDay()) < 0) { /* dia de folga da semana: não quebra a sequência de faltas */ }
        else break;
        d = U.addDays(d, -1);
      }
    }
    (z.pens || []).forEach(function(p){
      if (p.st === 'open' || (p.st === 'failed' && p.k === 'dobro' && p.body && out.zd.indexOf(p.body.day) >= 0)) out.pens.push(p.id);
    });
    if (z.show && z.show.t === 'miss') out.gem = Math.min(z.show.fine || 0, z.gout || 0);
    /* a chama: dias seguidos sem nada feito, de ontem para trás */
    var k = U.addDays(t, -1);
    for (var j = 0; j < 45; j++) {
      var r = S.daily[k];
      if (r && (r.rest || r.rep || r.an || E.qCount(r) > 0)) break;
      out.sd.push(k); if (r && r.frozen) out.fz++;
      k = U.addDays(k, -1);
    }
    var len = 0; while (len < 2000 && E.dayComplete(S.daily[k])) { len++; k = U.addDays(k, -1); }
    if (!len) { out.sd = []; out.fz = 0; }                          /* sem chama antes do buraco: não há o que proteger */
    out.streak = len + out.sd.length;
    out.seq = replay(S, out.zd).seq;
    out.any = !!(out.zd.length || out.pens.length || out.sd.length);
    return out;
  };
  /* recontar a sequência do Chamado pelo registro, com os dias perdoados valendo como descanso */
  function replay(S, perd){
    var z = S.pz, seq = 0, clean = 0, best = 0;
    Object.keys(z.log || {}).sort().forEach(function(d){
      var v = perd.indexOf(d) >= 0 ? 'rest' : z.log[d].v;
      if (v === 'ok') { seq++; clean++; best = Math.max(best, seq); }
      else if (v === 'late') clean++;
      else if (v === 'miss') { seq = 0; clean = 0; }
    });
    return {seq: seq, clean: clean, best: best};
  }

  App.pzAnApply = function(){
    var S = App.S, z = S.pz, P = App.pzAnPlan(), t = U.today();
    if (!P.any) return null;
    P.zd.forEach(function(d){
      var rec = z.log[d] || (z.log[d] = {});
      rec.v = 'rest'; rec.an = 1; delete rec.p;
      z.tot.miss = Math.max(0, (z.tot.miss || 0) - 1); z.tot.rest = (z.tot.rest || 0) + 1;
    });
    if (P.pens.length) z.pens = z.pens.filter(function(p){ return P.pens.indexOf(p.id) < 0; });
    if (P.gem) z.gout = Math.max(0, (z.gout || 0) - P.gem);
    if (z.show && z.show.t === 'miss') z.show = null;
    var R = replay(S, []); z.seq = R.seq; z.clean = R.clean; z.best = Math.max(z.best || 0, R.best);
    P.sd.forEach(function(d){
      var r = S.daily[d] || (S.daily[d] = {q: {}, need: S.settings.dailies.length});
      r.frozen = true; r.an = true;
    });
    if (P.fz) { S.owned.freezes = Math.min(SYS.FREEZE_MAX, (S.owned.freezes || 0) + P.fz); S.stats.freezesUsed = Math.max(0, (S.stats.freezesUsed || 0) - P.fz); }
    if (S.streakLost && (S.streakLost.gap || []).every(function(g){ return P.sd.indexOf(g) >= 0; })) S.streakLost = null;
    (z.anistias || (z.anistias = [])).push({at: t, pedido: PEDIDO, motivo: MOTIVO, zona: P.zd.slice(), prendas: P.pens.length, gem: P.gem, chama: P.sd.slice(), gelo: P.fz});
    S.flags.anistia = t;
    App.commit(['core']);
    return P;
  };

  /* a oferta: uma vez, até 31/10, depois de a nuvem conferir */
  function pending(){
    var S = App.S;
    if (!S || !S._u || !S.pz || S.flags.anistia || App.ui.anLater || U.today() > ATE) return false;
    if (window.__TESTPAGE && !window.__anistia) return false;      /* nas páginas de teste, só quando a suíte pede (tests/anistia.js) */
    if (Store.waking || !Store.settled()) return false;
    return true;
  }
  App.pzAnOffer = function(){
    if (!pending()) return false;
    if (App.ui.modal && App.ui.modal.type === 'anistia') return true;
    if (App.ui.pz) return false;                                    /* uma tela da Zona já está aberta: o pedido espera ela fechar */
    var P = App.pzAnPlan();
    if (!P.any) return false;                                       /* nada a perdoar agora: a oferta continua valendo até o prazo */
    if (App.ui.modal && !App.ui.modalNext) App.ui.modalNext = App.ui.modal;   /* um level up que estava aberto vem depois */
    App.ui.modal = {type: 'anistia'}; App.renderModal();
    return true;
  };
  /* a sentença da Zona espera a decisão sobre a anistia */
  var oldPresent = App.pzPresent;
  App.pzPresent = function(){ if (App.pzAnOffer()) return; return oldPresent.apply(this, arguments); };

  function span(list){ var a = list.slice().sort(); return a.length === 1 ? fmt(a[0]) : fmt(a[0]) + ' a ' + fmt(a[a.length - 1]); }
  App.M.anistia = function(){
    var P = App.pzAnPlan(), rows = [];
    if (!P.any) return '';
    if (P.zd.length) rows.push(['gate', '<b>' + P.zd.length + (P.zd.length === 1 ? ' falta' : ' faltas seguidas') + ' na Zona</b> (' + span(P.zd) + ') viram descanso. A sequência do Chamado volta a ' + P.seq + '.']);
    if (P.pens.length) rows.push(['scroll', '<b>' + P.pens.length + (P.pens.length === 1 ? ' prenda sai' : ' prendas saem') + '</b> da Zona.']);
    if (P.gem) rows.push(['gem', '<b>' + P.gem + ' ◆</b> de multa voltam para o saldo.']);
    if (P.sd.length) rows.push(['flame', '<b>' + P.sd.length + (P.sd.length === 1 ? ' dia sem nada' : ' dias sem nada') + '</b> (' + span(P.sd) + ') ficam protegidos: a chama segue com ' + P.streak + ' dias' + (P.fz ? ', e ' + P.fz + (P.fz === 1 ? ' gelo gasto volta' : ' gelos gastos voltam') + ' para o estoque' : '') + '.']);
    return '<section class="win"><div class="win-h">' + U.icon('seal') + '[Sistema] Pedido de anistia</div><div class="stack" style="gap:12px">'
      + '<p class="dim" style="font-size:13.5px">Pedido em ' + fmt(PEDIDO) + '. Motivo: ' + MOTIVO + '. O Sistema conferiu o registro e encontrou:</p>'
      + '<ul class="list plain">' + rows.map(function(r){ return '<li><span class="row" style="gap:10px;flex-wrap:nowrap;align-items:flex-start">' + U.icon(r[0]) + '<span>' + r[1] + '</span></span></li>'; }).join('') + '</ul>'
      + '<p class="faint" style="font-size:12.5px">Vale uma vez, até ' + fmt(ATE) + '. O registro da Zona guarda a anistia. Daqui para frente, as regras de sempre: trégua, descanso declarado e pausa para viagem.</p>'
      + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="pzAnLater">Agora não</button><button class="btn primary" data-a="pzAnOk">' + U.icon('check') + 'Aplicar a anistia</button></div></div></section>';
  };
  App.A.pzAnOk = function(){
    var P = App.pzAnApply(); App.ui.modal = App.ui.modalNext || null; App.ui.modalNext = null; App.renderModal();
    if (P) App.toast({t: '[Sistema] Anistia aplicada', s: [P.zd.length ? P.zd.length + ' faltas viraram descanso' : '', P.pens.length ? P.pens.length + ' prendas retiradas' : '', P.sd.length ? 'chama protegida (' + P.streak + ' dias)' : ''].filter(Boolean).join(' · ') + '.', ic: 'seal', ms: 8000});
    if (App.pzPaint) App.pzPaint();
    if (App.pzPresent) App.pzPresent();
  };
  App.A.pzAnLater = function(){ App.ui.anLater = true; App.ui.modal = App.ui.modalNext || null; App.ui.modalNext = null; App.renderModal(); if (App.pzPresent) App.pzPresent(); };
})();
