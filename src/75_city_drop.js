/* ===== CIDADE · drop: rolagem com semente, gavetas, raridade com teto, Q e R, pity e corrupção =====
   Toda rolagem acontece aqui, no motor local, com as odds da tabela. A semente sai do próprio portal:
   recarregar a página não rola de novo, e dois aparelhos chegam no mesmo resultado. */
(function(){
  var CY = SYS.CITY, RK = ['E', 'D', 'C', 'B', 'A', 'S'];
  E.cyRankIdx = function(r){ return RK.indexOf(r); };
  E.cyRng = function(seed){ return U.seeded(String(seed)); };
  /* sorteio ponderado: devolve o índice */
  E.cyWeighted = function(R, w){
    var tot = 0, i; for (i = 0; i < w.length; i++) tot += Math.max(0, w[i]);
    if (tot <= 0) return 0;
    var x = R() * tot;
    for (i = 0; i < w.length; i++) { x -= Math.max(0, w[i]); if (x < 0) return i; }
    return w.length - 1;
  };
  E.cyPick = function(R, arr){ return arr[Math.floor(R() * arr.length) % arr.length]; };

  /* modificadores que valem neste portal: sem `cump`, todos; com `cump` (o que a pessoa confirmou), os automáticos, as pragas e os confirmados */
  E.cyModsOk = function(p, cump){
    return (p.mods || []).map(function(id){ return CY.MODMAP[id]; }).filter(function(m){
      if (!m) return false;
      if (!cump) return true;
      if (m.t === 'praga' || m.t === 'bencao' || m.t === 'corrup') return true;
      if (m.auto === 'alvorada') return !!cump.alvorada;
      if (m.auto) return true;
      return !!cump[m.id];
    });
  };
  /* Q e R totais: modificadores + profundidade do distrito (+5% de Q a cada 2 níveis) */
  E.cyQR = function(C, p, cump){
    var q = 0, r = 0, rol = 0, gemBase = 1, ms = E.cyModsOk(p, cump);
    ms.forEach(function(m){ q += m.q || 0; r += m.r || 0; rol += m.rol || 0; if (m.gemBase === 0) gemBase = 0; });
    var st = E.cityDist(C, p.d), depth = E.cityDepth(st.closed);
    q += Math.floor(depth / 2) * CY.PROF.q;
    return {q: q, r: r, rol: rol, gemBase: gemBase, depth: depth, mods: ms};
  };
  /* raridade: base, R multiplica de raro para cima, e o que passa do teto vira o teto */
  E.cyRarOdds = function(rank, rPct){
    var base = CY.DROP.rar.slice(), mult = 1 + (rPct || 0) / 100, hi = 0, lo = 0, i;
    for (i = 2; i < 6; i++) { base[i] *= mult; hi += base[i]; }
    if (hi > 100) { for (i = 2; i < 6; i++) base[i] = base[i] * 100 / hi; hi = 100; }
    lo = CY.DROP.rar[0] + CY.DROP.rar[1];
    var room = 100 - hi; base[0] = CY.DROP.rar[0] * room / lo; base[1] = CY.DROP.rar[1] * room / lo;
    var teto = CY.RARS.indexOf((CY.RANK[rank] || CY.RANK.E).teto);
    for (i = teto + 1; i < 6; i++) { base[teto] += base[i]; base[i] = 0; }
    return base;
  };
  E.cyGavOdds = function(rank){ var f = CY.DROP.faixa(rank); return CY.DROP.gav.map(function(g){ return g.p[f]; }); };

  /* tudo o que o portal mostra antes de entrar: garantido, rolagens, teto e odds */
  E.cyOdds = function(C, p, cump){
    var RKD = CY.RANK[p.r] || CY.RANK.E, qr = E.cyQR(C, p, cump), corr = E.cityDist(C, p.d).corr || 0;
    var base = RKD.rol, rolF = base * (1 + qr.q / 100) + qr.rol;
    if (p.tranc) rolF *= 2;
    return {
      rank: p.r, base: base, q: qr.q, r: qr.r, extra: qr.rol, rol: rolF, rolMin: Math.floor(rolF), frac: rolF - Math.floor(rolF), depth: qr.depth,
      teto: RKD.teto, rar: E.cyRarOdds(p.r, qr.r), gav: E.cyGavOdds(p.r),
      xp: RKD.xp, gem: Math.round(RKD.gem * qr.gemBase * Math.max(0, 1 - CY.DROP.corrGem * corr)), gemFull: RKD.gem, corr: corr,
      eco: RKD.eco || null, chave: RKD.chave || null, tranc: !!p.tranc, pity: (C.pity && C.pity.c) || 0, mods: qr.mods
    };
  };

  /* um item de cada gaveta, pela raridade */
  function item(C, S, p, R, gav, ri, opt){
    var D = CY.DROP, rar = CY.RARS[ri];
    if (gav === 'gem') return {k: 'gem', n: D.gem[ri], rar: rar};
    if (gav === 'cr') return {k: 'cr', n: D.cr[ri], way: p.way, rar: rar};
    if (gav === 'chave') return {k: 'chave', rank: D.chave[ri], rar: rar};
    if (gav === 'frag') return {k: 'frag', d: p.d, rar: rar};
    if (gav === 'perg') return {k: 'perg', tipo: D.perg[ri][0], rank: D.perg[ri][1], rar: rar};
    if (gav === 'caixa') {
      var ix = E.cyRankIdx(p.r), grau = ix <= 2 ? 'menor' : 'maior', corr = E.cityDist(C, p.d).corr || 0;
      return {k: 'caixa', grau: grau, so: R() * 100 < D.corrPar[corr], d: p.d, rar: rar};
    }
    if (gav === 'vale') {
      var cats = Object.keys(CY.VALE_CAT), mes = U.today().slice(0, 7), tempoMes = (opt.tempoMes || 0);
      var w = cats.map(function(c){ var x = CY.VALE_CAT[c]; if (c === 'tempo' && tempoMes >= x.porMes) return 0; return (x.mais.indexOf(p.d) >= 0) ? 3 : 1; });
      var cat = cats[E.cyWeighted(R, w)];
      if (cat === 'tempo') opt.tempoMes = tempoMes + 1;
      return {k: 'vale', cat: cat, teto: D.vale[ri], rar: rar, d: p.d, mes: mes};
    }
    /* item: comum e incomum dão material de forja; raro, Carmesim, Carimbo, Purificação ou passe; épico+, Relíquia */
    if (ri <= 2) {
      var id = E.cyPick(R, CY.ITEM_RAR[ri]);
      if (id === 'passe') return {k: 'passe', way: p.way, d: p.d, rua: p.rua, rar: rar};
      return {k: 'mat', id: id, rar: rar};
    }
    return {k: 'reliq', slot: E.cyPick(R, CY.SLOT_RELIQ), d: p.d, rar: rar};
  }

  /* a rolagem inteira de um portal fechado. Pura: não mexe em nada, só calcula */
  E.cyRoll = function(C, S, p, cump){
    var R = E.cyRng('drop:' + (C.seed || '') + ':' + p.id), O = E.cyOdds(C, p, cump), out = {rolls: [], pity: false};
    var n = O.rolMin + (R() < O.frac ? 1 : 0), opt = {tempoMes: E.cyTempoMes(C)};
    var forceEpic = E.cyRankIdx(p.r) >= 2 && O.pity >= CY.DROP.pity.epico && CY.RARS.indexOf(O.teto) >= 3;
    for (var i = 0; i < n; i++) {
      var g = CY.DROP.gav[E.cyWeighted(R, O.gav)].id, ri = E.cyWeighted(R, O.rar);
      if (forceEpic && i === 0 && ri < 3) { ri = 3; out.pity = true; }
      out.rolls.push(Object.assign({gav: g}, item(C, S, p, R, g, ri, opt)));
    }
    out.gar = {xp: O.xp, gem: O.gem, way: p.way, eco: O.eco, chave: O.chave};
    if (p.tranc) out.gar.caixa = {k: 'caixa', grau: E.cyRankIdx(p.r) <= 2 ? 'menor' : 'maior', so: false, d: p.d, rar: 'rare'};
    out.n = n; out.q = O.q; out.r = O.r;
    return out;
  };
  E.cyTempoMes = function(C){
    var mes = U.today().slice(0, 7);
    return ((C.inv && C.inv.vales) || []).filter(function(v){ return v.cat === 'tempo' && v.mes === mes; }).length + ((C.inv && C.inv.tempoMes && C.inv.tempoMes[mes]) || 0);
  };

  /* aplica a rolagem: livro-razão (XP, ◆, créditos), chaves no progresso, o resto no inventário da Cidade */
  E.cyInv = function(C){
    var I = C.inv || (C.inv = {});
    I.mat = I.mat || {}; I.passe = I.passe || []; I.caixas = I.caixas || []; I.vales = I.vales || []; I.frag = I.frag || {}; I.perg = I.perg || []; I.reliq = I.reliq || [];
    return I;
  };
  E.cyLed = function(C){ var L = C.led || (C.led = {}); L.xp = L.xp || {}; L.cr = L.cr || {}; L.gem = L.gem || 0; return L; };
  E.cyGive = function(C, S, it, at){
    var I = E.cyInv(C), L = E.cyLed(C), uid = 'i' + (C.nid = (C.nid || 0) + 1);
    if (it.k === 'gem') { L.gem += it.n; return 'gem'; }
    if (it.k === 'cr') { L.cr[it.way] = (L.cr[it.way] || 0) + it.n; return 'cr'; }
    if (it.k === 'chave') { var K = S.owned.keys || (S.owned.keys = {}); K[it.rank] = (K[it.rank] || 0) + 1; return 'core'; }
    if (it.k === 'mat') { I.mat[it.id] = (I.mat[it.id] || 0) + 1; return 'mat'; }
    if (it.k === 'passe') { I.passe.push({id: uid, way: it.way, d: it.d, rua: it.rua, at: at}); return 'inv'; }
    if (it.k === 'caixa') { I.caixas.push({id: uid, grau: it.grau, so: !!it.so, d: it.d, at: at}); return 'inv'; }
    if (it.k === 'frag') { I.frag[it.d] = (I.frag[it.d] || 0) + 1; return 'inv'; }
    if (it.k === 'perg') { I.perg.push({id: uid, tipo: it.tipo, rank: it.rank, at: at}); return 'inv'; }
    if (it.k === 'reliq') { I.reliq.push({id: uid, r: it.rar, slot: it.slot, d: it.d, at: at}); return 'inv'; }
    if (it.k === 'vale') {
      if (I.vales.length >= CY.DROP.valeMax) {          /* cabem 5 vales; o sexto vira ◆ sozinho */
        var g = CY.DROP.valeGem[CY.RARS.indexOf(it.rar)] || 0; L.gem += g; it.virou = g; return 'gem';
      }
      I.vales.push({id: uid, cat: it.cat, teto: it.teto, r: it.rar, d: it.d, mes: it.mes, at: at}); return 'inv';
    }
    return '';
  };
  E.cyApplyDrop = function(C, S, p, res){
    var at = new Date().toISOString(), L = E.cyLed(C), core = false;
    L.xp[p.way] = (L.xp[p.way] || 0) + res.gar.xp; L.gem += res.gar.gem;
    if (res.gar.chave) { var K = S.owned.keys || (S.owned.keys = {}); K[res.gar.chave] = (K[res.gar.chave] || 0) + 1; core = true; }
    if (res.gar.caixa) E.cyGive(C, S, res.gar.caixa, at);
    res.rolls.forEach(function(it){ if (E.cyGive(C, S, it, at) === 'core') core = true; });
    /* pity: 10 portais C+ seguidos sem épico garantem épico na próxima rolagem */
    if (E.cyRankIdx(p.r) >= 2) {
      var P = C.pity || (C.pity = {c: 0});
      P.c = res.rolls.some(function(x){ return CY.RARS.indexOf(x.rar) >= 3; }) ? 0 : (P.c || 0) + 1;
    }
    return {core: core};
  };
})();
