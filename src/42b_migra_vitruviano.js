/* ===== v21 · migração do save para o Vitruviano =====
   O Ars Subtilior virou a Harmonia do Vitruviano e a base do Mind foi para Philosophia, Lingua e Politeia.
   Os nós, selos, conquistas e feitos mantiveram os IDs, então o XP deles acompanha a definição sozinho.
   O que o save guarda com o Caminho escrito é remapeado aqui:
     · 'ars' → 'vitruviano' em diárias, arquivo de diárias, compras, pendências, laterais, ofertas, metas, marcos,
       foco da temporada, Caminho de leitura e briefings da Zona;
     · a diária "Registro" (log), que era do Mind, segue com o histórico para o Vitruviano;
     · compras e pendências de itens da loja do Mind que mudaram de loja vão junto.
   Nada é apagado: o XP total antes e depois fica registrado em S.flags.v21 (o teste confere a igualdade).
   Antes da primeira migração, uma cópia do core vai para o localStorage (sysasc.backup.v21).
   A migração roda em memória a cada carga até a pessoa salvar algo: não força escrita na nuvem. */
(function(){
  var NOVO = 'vitruviano';
  /* itens da loja do Mind que foram para a Philosophia ou a Lingua (27f, 27g, 37) */
  var LOJA_MIND = {};
  ['mi1','mi2','mi3','mi4','mi5','mi6','mi7','mi8','mi9','mi10','mi11','mi12',
   'mi_x1','mi_x2','mi_x3','mi_x4','mi_x5','mi_x6','mi_x7','mi_x8','mi_x9','mi_x10','mi_x11','mi_x12','mi_x13','mi_x14',
   'mi_f1','mi_f2','mi_f8','mi_f11'].forEach(function(id){ LOJA_MIND[id] = 1; });
  E.V21_LOJA_MIND = LOJA_MIND;

  function conta(rep, k){ rep[k] = (rep[k] || 0) + 1; }
  /* troca way/w === 'ars' em qualquer objeto da lista */
  function troca(list, rep, k, extra){
    (list || []).forEach(function(o){
      if (!o || typeof o !== 'object') return;
      if (o.way === 'ars') { o.way = NOVO; conta(rep, k); }
      else if (extra && o.way === 'mind' && extra(o)) { o.way = NOVO; conta(rep, k); }
    });
  }

  E.migraVitruviano = function(S){
    var F = S.flags || (S.flags = {});
    if (F.v21 && F.v21.at) return S;
    var rep = {}, antes = null;
    try { antes = E.NODE ? E.derive(S, null).xp : null; } catch(e){ antes = null; }
    try { if (U.ls && !U.ls.get('sysasc.backup.v21') && S._u) U.ls.set('sysasc.backup.v21', JSON.parse(JSON.stringify(S))); } catch(e){}

    Object.keys(S.daily || {}).forEach(function(day){
      var q = (S.daily[day] || {}).q || {};
      Object.keys(q).forEach(function(id){
        if (q[id] === 'ars') { q[id] = NOVO; conta(rep, 'diárias'); }
        else if (id === 'log' && q[id] === 'mind') { q[id] = NOVO; conta(rep, 'diárias'); }
      });
    });
    var ar = S.dstats && S.dstats.arch;
    if (ar) ['xp','cr'].forEach(function(k){ var m = ar[k]; if (m && m.ars) { m[NOVO] = (m[NOVO] || 0) + m.ars; delete m.ars; conta(rep, 'arquivo de diárias'); } });
    var daMind = function(o){ return !!LOJA_MIND[o.id]; };
    troca(S.buys, rep, 'compras', daMind);
    troca(S.pending, rep, 'pendências', daMind);
    troca(S.sideq, rep, 'laterais');
    troca(S.offs, rep, 'ofertas');
    troca(S.goals, rep, 'metas');
    troca(S.milestones, rep, 'marcos');
    if (S.pz && S.pz.pens) S.pz.pens.forEach(function(p){ if (p && p.body && p.body.w === 'ars') { p.body.w = NOVO; conta(rep, 'briefings'); } });

    var st = S.settings || {}, ss = st.season;
    if (st.readWay === 'ars') { st.readWay = NOVO; conta(rep, 'leitura'); }
    if (ss) {
      ['focus','fixed'].forEach(function(k){ if (Array.isArray(ss[k])) ss[k] = ss[k].map(function(id){ return id === 'ars' ? NOVO : id; }).filter(function(id, i, a){ return a.indexOf(id) === i; }); });
      /* o Vitruviano é Way principal ao lado do Architect: entra no foco logo depois dele */
      if (Array.isArray(ss.focus) && ss.focus.indexOf(NOVO) < 0 && (ss.fixed || []).indexOf(NOVO) < 0) {
        var at = ss.focus.indexOf('architect');
        ss.focus.splice(at >= 0 ? at + 1 : 0, 0, NOVO);
        ss.focus = ss.focus.slice(0, 3);
        conta(rep, 'foco');
      }
      if (Array.isArray(ss.focus) && ss.focus.length) { ss.main = ss.focus[0]; ss.a = ss.focus[1] || ss.focus[0]; ss.b = ss.focus[2] || ss.focus[1] || ss.focus[0]; }
    }
    var depois = null;
    try { depois = E.NODE ? E.derive(S, null).xp : null; } catch(e){ depois = null; }
    F.v21 = {at: U.today(), rep: rep, xp: [antes, depois]};
    return S;
  };

  var oldMigrate = E.migrate;
  E.migrate = function(S){ return E.migraVitruviano(oldMigrate(S)); };

  /* journal e cidade: só trocam o id do Caminho */
  E.migraJournal = function(J){
    var n = 0; (J && J.open || []).forEach(function(o){ if (o && o.way === 'ars') { o.way = NOVO; n++; } });
    return n;
  };
  E.migraCity = function(C){
    if (!C || C.v21) return 0;
    var n = 0;
    (function walk(o){
      if (!o || typeof o !== 'object') return;
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o.way === 'ars') { o.way = NOVO; n++; }
      Object.keys(o).forEach(function(k){ if (o[k] && typeof o[k] === 'object') walk(o[k]); });
    })(C.portals || []);
    walk2(C.inv); walk2(C.ecos); walk2(C.trof);
    function walk2(x){ (function w(o){ if (!o || typeof o !== 'object') return; if (Array.isArray(o)) { o.forEach(w); return; } if (o.way === 'ars') { o.way = NOVO; n++; } Object.keys(o).forEach(function(k){ if (o[k] && typeof o[k] === 'object') w(o[k]); }); })(x); }
    var L = C.led;
    if (L) ['xp','cr'].forEach(function(k){ if (L[k] && L[k].ars) { L[k][NOVO] = (L[k][NOVO] || 0) + L[k].ars; delete L[k].ars; n++; } });
    C.v21 = 1;
    return n;
  };
})();
