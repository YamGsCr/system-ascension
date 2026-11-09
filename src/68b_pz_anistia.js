/* ===== Anistias: pedidos feitos no chat, que o próprio app aplica depois de um toque =====
   Cada pedido vale uma vez, numa janela de datas, e só aparece depois de a nuvem conferir o save e de a Zona julgar o atraso.
   O Sistema mostra o que encontrou e espera o toque para aplicar.
   a1 · pedido em 17/10, até 31/10 · foco total no sistema da loja
     - Zona: a sequência mais recente de faltas vira descanso (como uma trégua), as prendas abertas saem,
       a multa da sentença ainda não aceita volta e a sequência do Chamado é recontada pelo registro;
     - Sequência (a chama): os últimos dias sem nada feito ficam protegidos, sem gastar gelo
       (o gelo já gasto nesses dias volta para o estoque).
   a2 · pedido em 21/10, de 21/10 até 04/11 · ocupado na hora do chamado
     - só as prendas abertas das faltas até 21/10 saem; as faltas, a multa e a sequência ficam como estão.
   a3 · pedido em 09/11, de 09/11 até 23/11 · fora de operação até agora · o período vai de 22/10 até o dia em que for aplicada
     - Zona: as faltas do período viram descanso, as prendas abertas saem, a multa do período volta (pela tabela de multas,
       sem passar do que a Zona cobrou) e a sequência do Chamado é recontada;
     - Cidade: a corrupção de cada bairro volta ao nível de antes do período, as maldições acabam, e o que as quebras
       do período deixaram (Revanche, Eco Partido, Contenção acima do nível novo) sai. A chama não entra.
   O registro guarda cada anistia em S.pz.anistias; a marca de aplicada fica em S.flags (anistia, anistia2). */
(function(){
  var PEDIDOS = [
    {id: 'a1', flag: 'anistia', pedido: '2026-10-17', de: '', ate: '2026-10-31', motivo: 'foco total no sistema da loja'},
    {id: 'a2', flag: 'anistia2', pedido: '2026-10-21', de: '2026-10-21', ate: '2026-11-04', motivo: 'ocupado na hora do chamado', so: 'prendas'},
    {id: 'a3', flag: 'anistia3', pedido: '2026-11-09', de: '2026-11-09', ate: '2026-11-23', desde: '2026-10-22', motivo: 'fora de operação até agora', so: 'periodo'}
  ];
  function ped(id){ return PEDIDOS.filter(function(x){ return x.id === id; })[0] || PEDIDOS[0]; }
  function fmt(d){ return d.slice(8, 10) + '/' + d.slice(5, 7); }
  function dia(at){ var t = Date.parse(at || ''); return isNaN(t) ? '' : U.ymd(new Date(t - U.resetHour() * 3600000)); }

  /* a3: a multa que a Zona cobrou no período, pela tabela (sentença, prenda vencida, Janela Dobrada) */
  function multa(z, ini, fim, pens){
    var F = SYS.PZ.FINE, tot = 0, n = 0;
    Object.keys(z.log || {}).sort().forEach(function(d){
      var r = z.log[d]; if (d < ini || d > fim || !r || r.v !== 'miss') return;
      n++;
      if (Object.prototype.hasOwnProperty.call(r, 'p')) { tot += (r.p === '' ? F.full : 0) + (n > 1 ? Math.min(F.extraCap, (n - 1) * F.extra) : 0); n = 0; }   /* fim de uma sentença */
    });
    (z.pens || []).forEach(function(p){
      if (pens.indexOf(p.id) < 0) return;
      if (p.over && p.k !== 'dobro') tot += F.over;
      if (p.k === 'dobro' && p.st === 'failed') tot += F.dobro;
    });
    return Math.min(z.gout || 0, tot);
  }
  /* a3: a Cidade do período */
  function planCidade(ini, fim){
    var C = App.city; if (!C || !C.since || !E.cityOn || !E.cityOn(App.S) || !E.cyOpen) return null;
    var inP = function(at){ var d = dia(at); return d >= ini && d <= fim; }, antes = {}, out = {corr: [], mald: [], rem: [], ecos: [], quebras: [], any: false};
    (C.log || []).forEach(function(l){
      if (!l.d || antes[l.d] != null || !inP(l.at)) return;
      if (l.k === 'quebrou' || l.k === 'corrompeu') antes[l.d] = Math.max(0, (l.corr || 1) - 1);
      else if (l.k === 'purificou') antes[l.d] = l.de;
    });
    SYS.CITY.DIST.forEach(function(d){ var cur = E.cityDist(C, d.id).corr || 0; if (antes[d.id] != null && antes[d.id] < cur) out.corr.push({d: d.id, de: cur, para: antes[d.id]}); });
    E.cyMald(C).forEach(function(m){ out.mald.push(m.id); if (m.p) out.rem.push(m.p); });
    (C.quebras || []).forEach(function(q){ if (inP(q.at) && !q.desfeita && !q.perdoada) { out.quebras.push(q.id); if (q.rev) out.rem.push(q.rev); } });
    (C.ecos || []).forEach(function(e){ if (e.st === 'partido' && inP(e.at)) out.ecos.push(e.id); });
    E.cyOpen(C).forEach(function(p){
      if (!p.cont) return;
      var x = out.corr.filter(function(c){ return c.d === p.d; })[0], nv = x ? x.para : (E.cityDist(C, p.d).corr || 0);
      if (p.cont > nv) out.rem.push(p.id);
    });
    out.rem = out.rem.filter(function(id, i, a){ var p = E.cyPortal(C, id); return a.indexOf(id) === i && p && !p.in; });   /* portal em que você já entrou fica */
    out.any = !!(out.corr.length || out.mald.length || out.rem.length || out.ecos.length || out.quebras.length);
    return out;
  }

  /* o que a anistia cobriria agora */
  App.pzAnPlan = function(id){
    var A = ped(id), S = App.S, z = S.pz || {}, t = U.today(), out = {id: A.id, zd: [], pens: [], gem: 0, sd: [], fz: 0, streak: 0, seq: 0};
    if (A.so === 'prendas') {
      (z.pens || []).forEach(function(p){ if (p.st === 'open' && (p.f || p.d) <= A.pedido) out.pens.push(p.id); });
      out.any = !!out.pens.length;
      return out;
    }
    if (A.so === 'periodo') {
      var fim = t > A.ate ? A.ate : t;
      out.ini = A.desde; out.fim = fim;
      Object.keys(z.log || {}).sort().forEach(function(d){ if (d >= A.desde && d <= fim && z.log[d].v === 'miss') out.zd.push(d); });
      (z.pens || []).forEach(function(p){
        if (p.st === 'open') out.pens.push(p.id);
        else if (p.st === 'failed' && p.k === 'dobro' && p.body && p.body.day >= A.desde && p.body.day <= fim) out.pens.push(p.id);
      });
      out.gem = multa(z, A.desde, fim, out.pens);
      out.seq = replay(S, out.zd).seq;
      out.cy = planCidade(A.desde, fim);
      out.any = !!(out.zd.length || out.pens.length || out.gem || (out.cy && out.cy.any));
      return out;
    }
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

  App.pzAnApply = function(id){
    var A = ped(id), S = App.S, z = S.pz, P = App.pzAnPlan(A.id), t = U.today();
    if (!P.any) return null;
    if (A.so === 'prendas') {
      var tipos = [];
      z.pens = z.pens.filter(function(p){ if (P.pens.indexOf(p.id) < 0) return true; tipos.push(p.k); return false; });
      Object.keys(z.log || {}).forEach(function(d){ var r = z.log[d]; if (r && r.p && P.pens.indexOf(r.p) >= 0) delete r.p; });
      (z.anistias || (z.anistias = [])).push({at: t, pedido: A.pedido, motivo: A.motivo, so: 'prendas', prendas: P.pens.length, tipos: tipos});
      S.flags[A.flag] = t;
      App.commit(['core']);
      return P;
    }
    if (A.so === 'periodo' && P.cy) {
      var C = App.city, Q = P.cy;
      Q.corr.forEach(function(x){ (C.dist[x.d] || (C.dist[x.d] = E.newDist())).corr = x.para; });
      E.cyMald(C).forEach(function(m){ if (Q.mald.indexOf(m.id) >= 0) E.cyMaldFim(C, m, 'anistia'); });
      C.portals = (C.portals || []).filter(function(p){ return Q.rem.indexOf(p.id) < 0; });
      C.ecos = (C.ecos || []).filter(function(e){ return Q.ecos.indexOf(e.id) < 0; });
      (C.quebras || []).forEach(function(q){ if (Q.quebras.indexOf(q.id) >= 0) q.perdoada = t; });
      E.cyLog(C, {k: 'anistia', de: P.ini, ate: P.fim, corr: Q.corr.length, mald: Q.mald.length, rem: Q.rem.length});
    }
    P.zd.forEach(function(d){
      var rec = z.log[d] || (z.log[d] = {});
      rec.v = 'rest'; rec.an = 1; delete rec.p;
      z.tot.miss = Math.max(0, (z.tot.miss || 0) - 1); z.tot.rest = (z.tot.rest || 0) + 1;
    });
    if (P.pens.length) z.pens = z.pens.filter(function(p){ return P.pens.indexOf(p.id) < 0; });
    if (P.gem) z.gout = Math.max(0, (z.gout || 0) - P.gem);
    if (z.show && z.show.t === 'miss') z.show = null;
    var R = replay(S, []); z.seq = R.seq; z.clean = R.clean; z.best = Math.max(z.best || 0, R.best);
    if (P.sd.length) {                                              /* a chama só entra no pedido de 17/10 */
      P.sd.forEach(function(d){
        var r = S.daily[d] || (S.daily[d] = {q: {}, need: S.settings.dailies.length});
        r.frozen = true; r.an = true;
      });
      if (P.fz) { S.owned.freezes = Math.min(SYS.FREEZE_MAX, (S.owned.freezes || 0) + P.fz); S.stats.freezesUsed = Math.max(0, (S.stats.freezesUsed || 0) - P.fz); }
      if (S.streakLost && (S.streakLost.gap || []).every(function(g){ return P.sd.indexOf(g) >= 0; })) S.streakLost = null;
    }
    (z.anistias || (z.anistias = [])).push(A.so === 'periodo'
      ? {at: t, pedido: A.pedido, motivo: A.motivo, so: 'periodo', de: P.ini, ate: P.fim, zona: P.zd.slice(), prendas: P.pens.length, gem: P.gem, cidade: P.cy ? {corr: P.cy.corr, mald: P.cy.mald.length, rem: P.cy.rem.length, ecos: P.cy.ecos.length, quebras: P.cy.quebras.length} : null}
      : {at: t, pedido: A.pedido, motivo: A.motivo, zona: P.zd.slice(), prendas: P.pens.length, gem: P.gem, chama: P.sd.slice(), gelo: P.fz});
    S.flags[A.flag] = t;
    App.commit(A.so === 'periodo' && P.cy ? ['core', 'city'] : ['core']);
    return P;
  };

  /* a oferta: cada pedido uma vez, dentro da janela dele, depois de a nuvem conferir */
  function pend(A){
    var S = App.S, t = U.today();
    if (!S || !S._u || !S.pz || S.flags[A.flag] || (App.ui.anLater && App.ui.anLater[A.id]) || t > A.ate || (A.de && t < A.de)) return false;
    if (window.__TESTPAGE && !window.__anistia) return false;      /* nas páginas de teste, só quando a suíte pede (tests/anistia.js) */
    if (Store.waking || !Store.settled()) return false;
    return true;
  }
  App.pzAnOffer = function(){
    var list = PEDIDOS.filter(pend); if (!list.length) return false;
    if (App.ui.modal && App.ui.modal.type === 'anistia') return true;
    if (App.ui.pz) return false;                                    /* uma tela da Zona já está aberta: o pedido espera ela fechar */
    for (var i = 0; i < list.length; i++) {
      if (!App.pzAnPlan(list[i].id).any) continue;                  /* nada a perdoar agora: a oferta continua valendo até o prazo */
      if (App.ui.modal && !App.ui.modalNext) App.ui.modalNext = App.ui.modal;   /* um level up que estava aberto vem depois */
      App.ui.modal = {type: 'anistia', id: list[i].id}; App.renderModal();
      return true;
    }
    return false;
  };
  /* a sentença da Zona espera a decisão sobre a anistia */
  var oldPresent = App.pzPresent;
  App.pzPresent = function(){ if (App.pzAnOffer()) return; return oldPresent.apply(this, arguments); };

  function span(list){ var a = list.slice().sort(); return a.length === 1 ? fmt(a[0]) : fmt(a[0]) + ' a ' + fmt(a[a.length - 1]); }
  App.M.anistia = function(m){
    var A = ped(m && m.id), P = App.pzAnPlan(A.id), rows = [], fim;
    if (!P.any) return '';
    if (A.so === 'prendas') {
      P.pens.forEach(function(id){
        var p = App.S.pz.pens.filter(function(x){ return x.id === id; })[0]; if (!p) return;
        var k = SYS.PZ.KINDS.filter(function(x){ return x.id === p.k; })[0] || {n: p.k, ic: 'scroll'};
        rows.push([k.ic || 'scroll', '<b>' + U.esc(k.n) + '</b> · falta de ' + fmt(p.f || p.d) + (p.over ? ' · vencida' : '') + ': sai da Zona.']);
      });
      fim = 'Vale uma vez, até ' + fmt(A.ate) + '. As faltas e a multa continuam no registro; só as prendas saem. Num dia cheio, a trégua ou o descanso declarado antes de o portão abrir evitam a prenda.';
    } else if (A.so === 'periodo') {
      if (P.zd.length) rows.push(['gate', '<b>' + P.zd.length + (P.zd.length === 1 ? ' falta' : ' faltas') + ' na Zona</b> entre ' + fmt(P.ini) + ' e ' + fmt(P.fim) + ' viram descanso. A sequência do Chamado volta a ' + P.seq + '.']);
      if (P.pens.length) rows.push(['scroll', '<b>' + P.pens.length + (P.pens.length === 1 ? ' prenda sai' : ' prendas saem') + '</b> da Zona.']);
      if (P.gem) rows.push(['gem', '<b>' + P.gem + ' ◆</b> de multa do período voltam para o saldo.']);
      var Q = P.cy;
      if (Q) {
        if (Q.corr.length) rows.push(['city', '<b>Corrupção</b> volta ao nível de antes do período: ' + Q.corr.map(function(x){ return U.esc((SYS.CITY.DMAP[x.d] || {curto: x.d}).curto || x.d) + ' ' + x.de + ' → ' + x.para; }).join(', ') + '.']);
        if (Q.mald.length) rows.push(['alert', '<b>' + Q.mald.length + (Q.mald.length === 1 ? ' maldição acaba' : ' maldições acabam') + '</b> agora.']);
        if (Q.quebras.length || Q.ecos.length || Q.rem.length) rows.push(['sword', '<b>Quebras do período perdoadas</b>' + (Q.quebras.length ? ' (' + Q.quebras.length + ')' : '') + ': ' + [Q.ecos.length ? Q.ecos.length + (Q.ecos.length === 1 ? ' Eco Partido sai' : ' Ecos Partidos saem') : '', Q.rem.length ? Q.rem.length + (Q.rem.length === 1 ? ' portal de Revanche, Contenção ou maldição sai do mapa' : ' portais de Revanche, Contenção ou maldição saem do mapa') : ''].filter(Boolean).join(' e ') + '.']);
      }
      fim = 'Vale uma vez, até ' + fmt(A.ate) + '. A chama das diárias fica como está. O registro da Zona e o celular da Cidade guardam a anistia.';
    } else {
      if (P.zd.length) rows.push(['gate', '<b>' + P.zd.length + (P.zd.length === 1 ? ' falta' : ' faltas seguidas') + ' na Zona</b> (' + span(P.zd) + ') viram descanso. A sequência do Chamado volta a ' + P.seq + '.']);
      if (P.pens.length) rows.push(['scroll', '<b>' + P.pens.length + (P.pens.length === 1 ? ' prenda sai' : ' prendas saem') + '</b> da Zona.']);
      if (P.gem) rows.push(['gem', '<b>' + P.gem + ' ◆</b> de multa voltam para o saldo.']);
      if (P.sd.length) rows.push(['flame', '<b>' + P.sd.length + (P.sd.length === 1 ? ' dia sem nada' : ' dias sem nada') + '</b> (' + span(P.sd) + ') ficam protegidos: a chama segue com ' + P.streak + ' dias' + (P.fz ? ', e ' + P.fz + (P.fz === 1 ? ' gelo gasto volta' : ' gelos gastos voltam') + ' para o estoque' : '') + '.']);
      fim = 'Vale uma vez, até ' + fmt(A.ate) + '. O registro da Zona guarda a anistia. Daqui para frente, as regras de sempre: trégua, descanso declarado e pausa para viagem.';
    }
    return '<section class="win"><div class="win-h">' + U.icon('seal') + '[Sistema] Pedido de anistia</div><div class="stack" style="gap:12px">'
      + '<p class="dim" style="font-size:13.5px">Pedido em ' + fmt(A.pedido) + '. Motivo: ' + A.motivo + '. O Sistema conferiu o registro e encontrou:</p>'
      + '<ul class="list plain">' + rows.map(function(r){ return '<li><span class="row" style="gap:10px;flex-wrap:nowrap;align-items:flex-start">' + U.icon(r[0]) + '<span>' + r[1] + '</span></span></li>'; }).join('') + '</ul>'
      + '<p class="faint" style="font-size:12.5px">' + fim + '</p>'
      + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="pzAnLater" data-id="' + A.id + '">Agora não</button><button class="btn primary" data-a="pzAnOk" data-id="' + A.id + '">' + U.icon('check') + 'Aplicar a anistia</button></div></div></section>';
  };
  function idOf(el){ return (el && el.getAttribute && el.getAttribute('data-id')) || (App.ui.modal && App.ui.modal.id) || 'a1'; }
  App.A.pzAnOk = function(el){
    var A = ped(idOf(el)), P = App.pzAnApply(A.id);
    App.ui.modal = App.ui.modalNext || null; App.ui.modalNext = null; App.renderModal();
    if (P) App.toast(A.so === 'prendas'
      ? {t: '[Sistema] Anistia aplicada', s: P.pens.length + (P.pens.length === 1 ? ' prenda retirada da Zona.' : ' prendas retiradas da Zona.'), ic: 'seal', ms: 8000}
      : A.so === 'periodo' ? {t: '[Sistema] Anistia aplicada', s: [P.zd.length ? P.zd.length + ' faltas viraram descanso' : '', P.pens.length ? P.pens.length + ' prendas retiradas' : '', P.gem ? '+' + P.gem + ' ◆' : '', P.cy && P.cy.any ? 'Cidade limpa' : ''].filter(Boolean).join(' · ') + '.', ic: 'seal', ms: 8000}
      : {t: '[Sistema] Anistia aplicada', s: [P.zd.length ? P.zd.length + ' faltas viraram descanso' : '', P.pens.length ? P.pens.length + ' prendas retiradas' : '', P.sd.length ? 'chama protegida (' + P.streak + ' dias)' : ''].filter(Boolean).join(' · ') + '.', ic: 'seal', ms: 8000});
    if (App.pzPaint) App.pzPaint();
    if (App.pzPresent) App.pzPresent();
  };
  App.A.pzAnLater = function(el){
    var L = App.ui.anLater && typeof App.ui.anLater === 'object' ? App.ui.anLater : {};
    L[idOf(el)] = true; App.ui.anLater = L;
    App.ui.modal = App.ui.modalNext || null; App.ui.modalNext = null; App.renderModal();
    if (App.pzPresent) App.pzPresent();
  };
})();
