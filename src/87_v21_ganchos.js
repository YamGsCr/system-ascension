/* ===== v21 · ganchos: XP do SGM-Opus e da XP dupla, migração do journal e da Cidade, ícones e estilo =====
   Fica por último (antes do boot) para envolver o E.derive já envolvido pela Cidade. */
(function(){
  /* ---------- ícones novos (o 40_util cria SYS.ICONS; aqui só acrescenta) ---------- */
  Object.assign(SYS.ICONS, {
    vitruvian:'M12 2.5a9.5 9.5 0 1 0 0 19a9.5 9.5 0 1 0 0-19M5.5 5.5h13v13h-13zM12 6a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2M12 9.2v5.3M6.5 10.5h11M12 14.5l-3.2 4.5M12 14.5l3.2 4.5',
    layers:'M12 3l9 5l-9 5l-9-5zM3 13l9 5l9-5M3 17.5l9 5l9-5'
  });

  /* ---------- XP: marcos do SGM-Opus e a XP dupla das Provas ---------- */
  E.v21XP = function(S){
    var out = (E.opusXP ? E.opusXP(S) : []).slice(), proj = (S.vit && S.vit.proj) || {};
    Object.keys(proj).forEach(function(id){
      var n = E.NODE[id], st = S.nodes[id], P = SYS.OPUS && SYS.OPUS.MAP[proj[id]];
      if (!n || !n.prova || !st || st.s !== 'done' || !P) return;
      P.ways.forEach(function(w, i){ if (w !== n.way) out.push({way:w, br:i === 0 ? P.br || null : null, xp:n.xp, m:'dupla'}); });
    });
    return out;
  };
  var oldDerive = E.derive;
  E.derive = function(S, J){
    var D = oldDerive(S, J), add = E.v21XP(S), x = 0, dupla = 0, opus = 0;
    add.forEach(function(a){
      if (D.wayXP[a.way] == null || !a.xp) return;
      D.wayXP[a.way] += a.xp; D.crEarn[a.way] += Math.round(a.xp / 5); D.wayCr[a.way] += Math.round(a.xp / 5); x += a.xp;
      if (a.br && D.brXP[a.way] && D.brXP[a.way][a.br] != null) D.brXP[a.way][a.br] += a.xp;
      if (a.m === 'dupla') dupla += a.xp; else opus += a.xp;
    });
    D.opusXP = opus; D.duplaXP = dupla;
    if (!x) return D;
    D.xp += x; D.level = E.levelOf(D.xp); D.letter = E.letterOf(D.level);
    D.lvFloor = SYS.xpNeed(D.level); D.lvNext = D.level >= SYS.MAXLVL ? D.lvFloor : SYS.xpNeed(D.level + 1);
    D.grank = E.grankOf(D.xp);
    var t3 = 0, t4 = 0;
    SYS.WAYS.forEach(function(w){
      var ti = E.tierOf(w.tiers, D.wayXP[w.id]); D.tier[w.id] = ti; if (ti.i >= 2) t3++; if (ti.i >= 3) t4++;
      D.attr[w.id] = 10 + Math.floor(D.wayXP[w.id] / 40);
      (w.branches || []).forEach(function(b){ D.brTier[w.id][b.id] = E.tierOf(b.tiers, D.brXP[w.id][b.id]); });
    });
    D.waysTier3 = t3; D.waysTier4 = t4;
    return D;
  };

  /* ---------- migração do journal e da Cidade (o core migra em E.migrate, 42b) ---------- */
  var oldCityFill = E.cityFill;
  E.cityFill = function(C){ var out = oldCityFill.apply(this, arguments); E.migraCity(out); return out; };
  var oldInit = App.init;
  App.init = function(){ oldInit.apply(this, arguments); if (E.migraJournal(App.J)) { App.D = E.derive(App.S, App.J); App.render(); } };
  var oldReplace = App.replaceDoc;
  App.replaceDoc = function(k, doc){ oldReplace.apply(this, arguments); if (k === 'journal' && E.migraJournal(App.J)) { App.D = E.derive(App.S, App.J); App.render(); } };

  /* ---------- estilo ---------- */
  var css = '.vitstrip .grid .disc{padding:6px 0}.kalok .bar{height:6px}.opus h3{font-size:18px}.opus details summary{list-style:none}.opus details summary::-webkit-details-marker{display:none}'
    + '.pausepill{cursor:pointer;font:inherit;color:inherit;background:none}.chip.bad{color:var(--bad, #ff6b6b);border-color:currentColor}';
  var st = document.createElement('style'); st.id = 'v21css'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
})();
