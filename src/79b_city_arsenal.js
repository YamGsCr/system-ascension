/* ===== CIDADE · Recompensas, parte 2: portais especiais, Ecos e Arsenal, Forja, corrupção e os ganchos no motor =====
   Portais especiais (Contenção, Revanche, Posseiro, Sirene, Inimigo Íntimo e o extra do Passe) ficam fora do limite de 6.
   Os ganchos embrulham o motor do Bloco 2 sem mudar o que ele já fazia: a rolagem continua pura e com semente. */
(function(){
  var CY = SYS.CITY, RK = ['E', 'D', 'C', 'B', 'A', 'S'], H1 = 3600000, D1 = 24 * H1;
  function iso(t){ return new Date(t).toISOString(); }
  function ri(r){ return Math.max(0, CY.RARS.indexOf(r)); }
  function fail(msg){ return {ok: false, msg: msg}; }
  function mn(id){ return (CY.ITENS[id] || {n: id}).n; }

  /* ---------- portais especiais ---------- */
  E.cyEsp = function(p){ return !!(p && (p.cont || p.rev || p.posse || p.sirene || p.ini || p.extra)); };
  E.cyEspKind = function(p){ return !p ? '' : p.cont ? 'cont' : p.rev ? 'rev' : p.posse ? 'posse' : p.sirene ? 'sirene' : p.ini ? 'ini' : p.extra ? 'extra' : ''; };
  E.cyCount = function(C){ return E.cyOpen(C).filter(function(p){ return !p.cham && !p.reav && !E.cyEsp(p); }).length; };
  function build(C, S, R, d, rank, t, mods, rua){
    rua = rua != null ? rua : t.rua >= 0 ? t.rua : Math.floor(R() * d.ruas.length);
    var node = E.cyRuaNode(S, d, rua, mods.indexOf('inimigo_intimo') >= 0), topico = node && node.st && node.st.length ? E.cyPick(R, node.st) : '';
    var f = function(s){ return E.cyFill(s, node, topico, d.ruas[rua]); };
    return {n: f(t.n), d: d.id, way: d.way, rua: rua, r: rank, tpl: t.id, lore: t.lore, obj: f(t.obj), ent: f(t.ent), crit: (t.crit || []).map(f), passos: (t.passos || []).map(f),
      min: t.min, fis: !!t.fis, node: node ? {id: node.id, t: node.t} : null, mods: mods, born: iso(Date.now()), st: 'open', in: null, tranc: false};
  }
  /* o = {kind: 'cont'|'rev'|'posse'|'sirene'|'ini'|'extra', d, rank, tpl?, rua?, mods?, horas?, flag?, seed?} */
  E.cyMakeEsp = function(C, S, o){
    var d = CY.DMAP[o.d]; if (!d || !S) return null;
    var R = E.cyRng(o.seed || ('esp:' + C.seed + ':' + o.kind + ':' + (C.nid || 0))), rank = o.rank;
    if ((E.cityDist(C, d.id).corr || 0) >= 3 && RK.indexOf(rank) > 2) rank = 'C';
    var all = (CY.CAT || []).filter(function(t){ return t.d === d.id && t.r === rank; }), t = null;
    if (o.tpl) t = (CY.CAT || []).filter(function(x){ return x.id === o.tpl; })[0] || null;
    if (!t && o.rua != null) { var na = all.filter(function(x){ return x.rua === o.rua; }); t = na.length ? E.cyPick(R, na) : null; }
    if (!t) t = all.length ? E.cyPick(R, all) : null;
    if (!t) return null;
    var mods = o.mods ? o.mods.slice() : E.cyRollMods(R, rank, E.cityDepth(E.cityDist(C, d.id).closed), t.fis);
    var p = build(C, S, R, d, rank, t, mods, o.rua != null && !(t.rua >= 0) ? o.rua : null);
    if (o.tpl && t.r !== rank) p.r = rank;
    p.id = E.cyUid(C, 'x');
    p[o.kind] = o.flag || 1;
    var hrs = o.horas || (CY.RANK[rank].prazo === 'reset' ? 24 : CY.RANK[rank].prazo);
    p.due = iso(Date.parse(p.born) + hrs * H1);
    C.portals.push(p);
    E.cyLog(C, {k: 'nasceu', p: p.id, n: p.n, r: p.r, d: p.d, esp: o.kind});
    return p;
  };

  /* ---------- corrupção: Contenção, Revanche, Eco Partido e a emergencial ---------- */
  E.cyContencao = function(C, S, d){
    var lvl = E.cityDist(C, d).corr || 0; if (!lvl || !S) return null;
    if (E.cyOpen(C).some(function(p){ return p.cont === lvl && p.d === d; })) return null;
    return E.cyMakeEsp(C, S, {kind: 'cont', flag: lvl, d: d, rank: CY.CONT.rank[lvl], horas: CY.CONT.prazo, seed: 'cont:' + C.seed + ':' + d + ':' + lvl + ':' + (C.nid || 0)});
  };
  E.cyCorrUp = function(C, S, d, why){
    var ds = C.dist[d] || (C.dist[d] = E.newDist()); ds.corr = Math.min(3, (ds.corr || 0) + 1);
    E.cyLog(C, {k: 'corrompeu', d: d, corr: ds.corr, why: why || ''});
    E.cyContencao(C, S, d);
  };
  E.cyCorrDown = function(C, d, n){ var ds = C.dist[d] || (C.dist[d] = E.newDist()), a = ds.corr || 0; ds.corr = n === 'tudo' ? 0 : Math.max(0, a - (n || 1)); if (ds.corr !== a) E.cyLog(C, {k: 'purificou', d: d, de: a, para: ds.corr}); return a - ds.corr; };
  var oldBreak = E.cyBreak;
  E.cyBreak = function(C, p, why){
    oldBreak(C, p, why);
    var S = App.S, at = iso(Date.now());
    if (CY.RANK[p.r] && CY.RANK[p.r].eco) (C.ecos || (C.ecos = [])).push({id: E.cyUid(C, 'e'), n: 'Eco Partido · ' + p.n, tipo: 'texto', link: '', r: CY.ECO.grau[p.r] || 'common', way: p.way, d: p.d, rua: p.rua, from: p.id, at: at, nv: 1, st: 'partido'});
    if (!p.rev && S) {
      var rv = E.cyMakeEsp(C, S, {kind: 'rev', flag: p.id, d: p.d, rank: p.r, tpl: p.tpl, rua: p.rua, mods: ['revanche'], horas: CY.REVANCHE.dias * 24, seed: 'rev:' + C.seed + ':' + p.id});
      (C.quebras || (C.quebras = [])).push({id: p.id, n: p.n, d: p.d, at: at, rev: rv ? rv.id : ''});
      if (C.quebras.length > 40) C.quebras = C.quebras.slice(-40);
    }
    E.cyContencao(C, S, p.d);
  };
  var oldExpire = E.cyExpire;
  E.cyExpire = function(C, S, now){
    E.cyOpen(C).forEach(function(p){
      if (p.sirene && now > Date.parse(p.due)) { p.st = 'perdida'; E.cyLog(C, {k: 'sirene', p: p.id, n: p.n, d: p.d}); E.cyCorrUp(C, S, p.d, 'emergencial'); }
    });
    C.portals = (C.portals || []).filter(function(p){ return p.st === 'open'; });
    return oldExpire(C, S, now);
  };

  /* ---------- nascimento: Bússola Rachada e Insônia do Servidor ---------- */
  var oldMake = E.cyMake;
  E.cyMake = function(C, S, R, o){
    if (C.bussola && !o.way && CY.DMAP[C.bussola]) { o = Object.assign({}, o, {way: CY.DMAP[C.bussola].way}); delete C.bussola; }
    var p = oldMake(C, S, R, o); if (!p) return p;
    if (E.cyMald(C).some(function(m){ return m.k === 'insonia' && m.d === p.d; })) p.due = iso(Date.parse(p.born) + (Date.parse(p.due) - Date.parse(p.born)) / 2);
    return p;
  };

  /* ---------- Ecos e Arsenal ---------- */
  CY.MODMAP.herdeiro.auto = 'herdeiro'; delete CY.MODMAP.herdeiro.off; delete CY.MODMAP.ecos_mudos.off;
  CY.MODMAP.revanche.auto = 'revanche';   /* vale sempre, sem checklist; continua fora do sorteio (só a quebra cria) */
  E.cyEcos = function(C, st){ return (C.ecos || []).filter(function(e){ return (e.st || 'ativo') === (st || 'ativo'); }); };
  E.cyEco = function(C, id){ return (C.ecos || []).filter(function(e){ return e.id === id; })[0] || null; };
  /* +2% de XP e de Q por Eco da mesma vertente (até +20%); Eco ascendido dá +5% de R no bairro */
  E.cyEcoBonus = function(C, p){
    if (!p || (p.mods || []).indexOf('ecos_mudos') >= 0) return {xp: 0, q: 0, r: 0, n: 0, asc: 0};
    var A = E.cyEcos(C), n = A.filter(function(e){ return e.d === p.d && e.rua === p.rua; }).length, asc = A.filter(function(e){ return e.d === p.d && e.nv >= CY.ECO.nvMax; }).length, b = Math.min(CY.ECO.bonusMax, n * CY.ECO.bonus);
    return {xp: b, q: b, r: Math.min(CY.ECO.ascMax, asc * CY.ECO.ascR), n: n, asc: asc};
  };
  function subir(C, e){ if (e.nv >= CY.ECO.nvMax) return; e.nv++; if (e.nv >= CY.ECO.nvMax) { e.asc = U.today(); E.cyLog(C, {k: 'eco-asc', n: e.n, d: e.d}); } }
  E.cyEcoInvocar = function(C, p, id){
    var e = E.cyEco(C, id);
    if (!p || p.st !== 'open' || !p.in || p.eco || !e || (e.st || 'ativo') !== 'ativo') return false;
    p.eco = id; e.usos = (e.usos || 0) + 1; subir(C, e);
    E.cyLog(C, {k: 'eco-inv', n: e.n, p: p.id});
    return true;
  };
  E.cyEcoJuntar = function(C, a, b){
    var x = E.cyEco(C, a), y = E.cyEco(C, b);
    if (!x || !y || a === b || x.st !== 'ativo' || y.st !== 'ativo' || x.d !== y.d || x.rua !== y.rua) return false;
    x.nv = Math.min(CY.ECO.nvMax, (x.nv || 1) + (y.nv || 1)); if (x.nv >= CY.ECO.nvMax && !x.asc) x.asc = U.today();
    if (ri(y.r) > ri(x.r)) x.r = y.r;
    x.usos = (x.usos || 0) + (y.usos || 0);
    C.ecos = C.ecos.filter(function(e){ return e.id !== b; });
    E.cyLog(C, {k: 'eco-junta', n: x.n});
    return true;
  };
  E.cyEcoAposentar = function(C, id){
    var e = E.cyEco(C, id); if (!e || e.st !== 'ativo') return false;
    C.ecos = C.ecos.filter(function(x){ return x.id !== id; });
    var I = E.cyInv(C); I.mat.poeira = (I.mat.poeira || 0) + 1;
    E.cyLog(C, {k: 'eco-apos', n: e.n});
    return true;
  };
  E.cyEcoPoeira = function(C, id){ var e = E.cyEco(C, id), I = E.cyInv(C); if (!e || e.st !== 'ativo' || !(I.mat.poeira > 0) || e.nv >= CY.ECO.nvMax) return false; I.mat.poeira--; subir(C, e); return true; };
  var oldQR = E.cyQR;
  E.cyQR = function(C, p, cump){ var o = oldQR(C, p, cump), b = E.cyEcoBonus(C, p); o.q += b.q; o.r += b.r; o.eco = b; return o; };
  var oldOk = E.cyModsOk;
  E.cyModsOk = function(p, cump){ return oldOk(p, cump).filter(function(m){ return m.auto !== 'herdeiro' || !cump || !!p.eco; }); };

  /* ---------- drop: Eco, Mão Vazia, Corrompido, Inimigo Íntimo e Contenção ---------- */
  var oldOdds = E.cyOdds;
  E.cyOdds = function(C, p, cump){
    var O = oldOdds(C, p, cump), b = E.cyEcoBonus(C, p);
    if (b.xp) O.xp = Math.round(O.xp * (1 + b.xp / 100));
    O.ecoXP = b.xp;
    if (E.cyMaldTem(C, 'mao_vazia')) { O.gem = Math.floor(O.gem / 2); O.maoVazia = true; }
    O.dobro = !!p.dobro;
    return O;
  };
  var oldRoll = E.cyRoll;
  E.cyRoll = function(C, S, p, cump){
    var res = oldRoll(C, S, p, cump);
    if (p.dobro) { var r2 = oldRoll(C, S, Object.assign({}, p, {id: p.id + ':2'}), cump); res.rolls = res.rolls.concat(r2.rolls); res.n += r2.n; res.dobro = true; }
    var corr = (p.mods || []).indexOf('corrompido') >= 0;
    res.rolls.forEach(function(it){
      if (it.k === 'reliq') { it.src = p.id; it.srcN = p.n; it.ctx = {tranc: !!p.tranc, corr: corr}; }
      if (it.k === 'caixa' && corr) it.so = true;
    });
    if (res.gar.caixa && corr) res.gar.caixa.so = true;
    if (E.cyMaldTem(C, 'mao_vazia')) { res.rolls.forEach(function(it){ if (it.k === 'gem') it.n = Math.floor(it.n / 2); }); res.maoVazia = true; }
    if (p.cont) res.gar.extra = [{k: 'caixa', grau: 'menor', so: false, d: p.d, rar: 'rare'}];
    return res;
  };
  var oldApply = E.cyApplyDrop;
  E.cyApplyDrop = function(C, S, p, res){
    var o = oldApply(C, S, p, res), at = iso(Date.now());
    (res.gar.extra || []).forEach(function(it){ if (E.cyGive(C, S, it, at) === 'core') o.core = true; });
    return o;
  };
  var oldEnter = E.cyEnter;
  E.cyEnter = function(C, S, p, now){
    var r = oldEnter(C, S, p, now);
    if (r.ok && p.oculto) { p.mods.push(p.oculto); E.cyLog(C, {k: 'revelou', p: p.id, n: p.n, mod: p.oculto}); delete p.oculto; }
    return r;
  };
  var oldClose = E.cyClose;
  E.cyClose = function(C, S, p, en, now){
    if (p && p.st === 'open' && p.in && E.cyMaldTem(C, 'espelho') && String((en || {}).ensino || '').trim().length < CY.ESPELHO_MIN)
      return {ok: false, msg: 'Maldição do Espelho: ensine o que você fez (' + CY.ESPELHO_MIN + ' caracteres ou mais) antes de fechar.'};
    var info = p ? {cont: p.cont, rev: p.rev, cx: p.cx, d: p.d, id: p.id} : {};
    var r = oldClose(C, S, p, en, now);
    if (!r.ok) return r;
    if (E.cyMaldTem(C, 'espelho')) E.cyMaldUsar(C, 'espelho');
    if (r.res && r.res.maoVazia) E.cyMaldUsar(C, 'mao_vazia');
    if (info.cont) { E.cyCorrDown(C, info.d, 1); r.contido = true; }
    if (info.rev) {
      E.cyCorrDown(C, info.d, 1);
      var e = (C.ecos || []).filter(function(x){ return x.st === 'partido' && x.from === info.rev; })[0];
      if (e) { e.st = 'ativo'; e.r = 'rare'; e.n = e.n.replace(/^Eco Partido · /, ''); }
      (C.quebras || []).forEach(function(q){ if (q.id === info.rev) q.desfeita = U.today(); });
      E.cyLog(C, {k: 'revanche', p: info.id, d: info.d});
      r.revanche = true;
    }
    if (info.cx) E.cyMaldCumpriu(C, info.cx);
    E.cyMald(C).forEach(function(m){ if (m.p === info.id) E.cyMaldFim(C, m, 'cumpriu'); });
    if (r.lic) { r.core = true; E.cyTrof(C, {k: 'titulo', id: 'cyt_lic_' + r.lic.para, at: iso(Date.now())}); }
    if (C.ult) { C.ult.contido = !!r.contido; C.ult.revanche = !!r.revanche; }
    return r;
  };

  /* ---------- manutenção: maldições vencem, o Fundo enche no mês novo ---------- */
  var oldTick = E.cyTick;
  E.cyTick = function(C, S, now){
    var ch = oldTick(C, S, now);
    if (!C || !C.since || !E.cityOn(S)) return ch;
    var before = JSON.stringify([C.mald, C.fundo, (C.portals || []).length]);
    E.cyMaldTick(C, now || Date.now());
    E.cyFundoTick(C);
    return ch || JSON.stringify([C.mald, C.fundo, (C.portals || []).length]) !== before;
  };

  /* ---------- usar itens ---------- */
  E.cyPurificar = function(C, d, mat){
    var I = E.cyInv(C); if (!(I.mat[mat] > 0) || !CY.DMAP[d]) return 0;
    var n = E.cyCorrDown(C, d, mat === 'purif' ? 'tudo' : 1); if (!n) return 0;
    I.mat[mat]--;
    var m = E.cyMald(C).filter(function(x){ return x.task === 'purif'; })[0]; if (m) E.cyMaldFim(C, m, 'cumpriu');
    return n;
  };
  E.cyPergUsar = function(C, S, id){
    var I = E.cyInv(C), s = I.perg.filter(function(x){ return x.id === id; })[0]; if (!s || s.tipo !== 'inimigo') return null;
    var w = s.way || (E.cyParado(C, S) || SYS.WAYS[0]).id, d = E.cyDistOf(w); if (!d) return null;
    var p = E.cyMakeEsp(C, S, {kind: 'ini', d: d.id, rank: s.rank, mods: ['inimigo_intimo'], seed: 'ini:' + C.seed + ':' + s.id});
    if (!p) return null;
    p.dobro = 1; if (s.cx) p.cx = s.cx;
    I.perg = I.perg.filter(function(x){ return x.id !== id; });
    return p;
  };
  E.cyPasseUsar = function(C, S, id){
    var I = E.cyInv(C), s = I.passe.filter(function(x){ return x.id === id; })[0]; if (!s) return null;
    var R = E.cyRng('passe:' + C.seed + ':' + s.id), rank = RK[E.cyWeighted(R, E.cyLicRow(E.cyLic(C).r).odds)];
    if (RK.indexOf(rank) > RK.indexOf(CY.SPAWN_MAX)) rank = CY.SPAWN_MAX;
    var p = E.cyMakeEsp(C, S, {kind: 'extra', d: s.d, rua: s.rua, rank: rank, seed: 'passe:' + C.seed + ':' + s.id});
    if (!p) return null;
    I.passe = I.passe.filter(function(x){ return x.id !== id; });
    return p;
  };
  E.cyCarimbo = function(C, p){ var I = E.cyInv(C); if (!p || p.st !== 'open' || !(I.mat.carimbo > 0) || p.posse) return false; I.mat.carimbo--; p.due = iso(Date.parse(p.due) + D1); E.cyLog(C, {k: 'carimbo', p: p.id, n: p.n}); return true; };
  E.cyBussola = function(C, d){ var I = E.cyInv(C); if (!(I.mat.bussola > 0) || !CY.DMAP[d]) return false; I.mat.bussola--; C.bussola = d; return true; };
  E.cyFio = function(C, id){ var I = E.cyInv(C), x = (C.rel || []).filter(function(r){ return r.id === id; })[0]; if (!x || !(I.mat.fio > 0)) return false; I.mat.fio--; x.v = ((x.v || 0) + 1) % CY.RELIQ.variantes.length; return true; };

  /* ---------- Forja: materiais num portal antes de entrar (3 no máximo) ---------- */
  function umMod(R, rank, tem, livre){
    var ed = rank === 'E' || rank === 'D', keys = ['bencao', 'prefixo', 'sufixo', 'praga'];
    for (var t = 0; t < 30; t++) {
      var tipo = ed && !livre ? (R() < 0.5 ? 'prefixo' : 'sufixo') : keys[E.cyWeighted(R, keys.map(function(k){ return CY.SLOT_TIPO[k]; }))];
      var pool = CY.MODS.filter(function(m){ return m.t === tipo && !m.off && tem.indexOf(m.id) < 0 && (!ed || m.leve || livre) && (!m.so || m.so.indexOf(rank) >= 0) && (!m.ate || RK.indexOf(rank) <= RK.indexOf(m.ate)); });
      if (pool.length) return E.cyPick(R, pool).id;
    }
    return null;
  }
  E.cyForjaPode = function(p){ return !!(p && p.st === 'open' && !p.in && !p.cham && !p.reav && !p.posse && (p.forja || 0) < CY.FORJA.porPortal); };
  E.cyForjar = function(C, S, p, mat){
    if (!p || p.st !== 'open') return fail('Este portal não está aberto.');
    if (p.in) return fail('A Forja só funciona fora de portal: você já entrou neste.');
    if (p.cham || p.reav || p.posse) return fail('Este portal não aceita a Forja.');
    if ((p.forja || 0) >= CY.FORJA.porPortal) return fail('Cada portal aceita no máximo ' + CY.FORJA.porPortal + ' materiais.');
    var I = E.cyInv(C); if (!(I.mat[mat] > 0)) return fail('Sem ' + mn(mat) + ' no inventário.');
    var R = E.cyRng('forja:' + C.seed + ':' + p.id + ':' + (p.forja || 0) + ':' + mat), depth = E.cityDepth(E.cityDist(C, p.d).closed), msg = '';
    p.mods = p.mods || [];
    if (mat === 'pedra') {
      if (p.fis) return fail('Portal físico nunca recebe modificador.');
      var sl = CY.SLOTS[p.r] || [0, 0], max = sl[1] + Math.floor(depth / 2);
      if (p.mods.filter(function(id){ return id !== 'corrompido'; }).length >= Math.max(1, max)) return fail('Os espaços de modificador deste rank estão cheios.');
      var add = umMod(R, p.r, p.mods); if (!add) return fail('Nenhum modificador cabe aqui.');
      p.mods.push(add); msg = 'Entrou: ' + CY.MODMAP[add].n + '.';
    } else if (mat === 'lixa') {
      var rem = p.mods.filter(function(id){ return id !== 'corrompido'; }); if (!rem.length) return fail('Nada para tirar: Corrompido nunca sai com Lixa.');
      var x = E.cyPick(R, rem); p.mods = p.mods.filter(function(id){ return id !== x; }); msg = 'Saiu: ' + CY.MODMAP[x].n + '.';
    } else if (mat === 'dado') {
      if (p.fis) return fail('Portal físico nunca recebe modificador.');
      var keep = p.mods.indexOf('corrompido') >= 0; p.mods = E.cyRollMods(R, p.r, depth, false); if (keep) p.mods.push('corrompido');
      msg = 'Modificadores sorteados de novo' + (keep ? ' (o Corrompido fica)' : '') + '.';
    } else if (mat === 'brasa') {
      var i = RK.indexOf(p.r), lic = RK.indexOf(E.cyLic(C).r);
      if (i >= 2) return fail('A Brasa só sobe portais de E a C.');
      if (i + 1 > lic) return fail('A Brasa não passa do rank da sua Licença.');
      p.r = RK[i + 1]; var add2 = p.fis ? null : umMod(R, p.r, p.mods); if (add2) p.mods.push(add2);
      msg = 'O portal subiu para ' + p.r + (add2 ? ', com ' + CY.MODMAP[add2].n : '') + '.';
    } else if (mat === 'carmesim') {
      if (p.mods.indexOf('corrompido') >= 0) return fail('Este portal já está Corrompido.');
      if (p.fis) return fail('Portal físico não se corrompe.');
      p.mods.push('corrompido'); p.oculto = umMod(R, p.r, p.mods, true) || undefined;
      msg = 'Corrompido: um modificador escondido aparece quando você entrar.';
    } else return fail('Este material não vai num portal.');
    I.mat[mat]--; p.forja = (p.forja || 0) + 1;
    E.cyLog(C, {k: 'forja', p: p.id, n: p.n, mat: mat});
    return {ok: true, msg: msg};
  };

  /* ---------- Forja: as 8 receitas ---------- */
  E.cyReceita = function(C, S, id, a){
    a = a || {}; var I = E.cyInv(C), K = S.owned.keys || (S.owned.keys = {}), at = iso(Date.now()), out = null;
    if (id === 'chave') {
      var r = a.rank, i = RK.indexOf(r); if (i < 0 || i > 4) return fail('Escolha um rank de E a A.');
      if ((K[r] || 0) < CY.FORJA.chave) return fail('Precisa de ' + CY.FORJA.chave + ' chaves Rank ' + r + '.');
      K[r] -= CY.FORJA.chave; K[RK[i + 1]] = (K[RK[i + 1]] || 0) + 1; out = {ok: true, msg: '1 chave Rank ' + RK[i + 1] + '.', core: true};
    } else if (id === 'perg') {
      var tipo = a.tipo, rk = a.rank, seq = CY.PERG_RANKS[tipo] || [], k = seq.indexOf(rk);
      var mine = I.perg.filter(function(x){ return x.tipo === tipo && x.rank === rk; });
      if (mine.length < CY.FORJA.perg) return fail('Precisa de ' + CY.FORJA.perg + ' pergaminhos iguais.');
      if (k < 0 || k >= seq.length - 1) return fail('Este pergaminho já está no rank mais alto.');
      var ids = mine.slice(0, CY.FORJA.perg).map(function(x){ return x.id; });
      I.perg = I.perg.filter(function(x){ return ids.indexOf(x.id) < 0; });
      I.perg.push({id: E.cyUid(C), tipo: tipo, rank: seq[k + 1], at: at, way: mine[0].way}); out = {ok: true, msg: '1 ' + CY.PERG[tipo] + ' · ' + seq[k + 1] + '.'};
    } else if (id === 'cosm') {
      var d = a.d, c = CY.COSM.filter(function(x){ return x.id === a.cid && x.d === d; })[0];
      if (!c) return fail('Escolha o cosmético do bairro.');
      if ((I.frag[d] || 0) < CY.FORJA.frag) return fail('Precisa de ' + CY.FORJA.frag + ' fragmentos de ' + CY.DMAP[d].curto + '.');
      if ((S.owned[c.kind] || []).indexOf(c.id) >= 0) return fail('Você já tem este.');
      I.frag[d] -= CY.FORJA.frag; E.cyGive(C, S, {k: 'cosm', kind: c.kind, id: c.id}, at); out = {ok: true, msg: c.n + ' entrou na sua coleção.', core: true};
    } else if (id === 'vale') {
      var v1 = E.cyVale(C, a.a), v2 = E.cyVale(C, a.b);
      if (!v1 || !v2 || a.a === a.b) return fail('Escolha 2 vales.');
      if (v1.r !== v2.r) return fail('Os 2 vales precisam ter a mesma raridade.');
      if ((v1.cat === 'tempo') !== (v2.cat === 'tempo')) return fail('Vale de Tempo só junta com vale de Tempo.');
      var j = ri(v1.r); if (j >= 5) return fail('Já é mítico.');
      var cat = v1.cat === 'tempo' ? 'tempo' : (CY.VALE_CAT[a.cat] && a.cat !== 'tempo' ? a.cat : v1.cat);
      I.vales = I.vales.filter(function(x){ return x.id !== a.a && x.id !== a.b; });
      I.vales.push({id: E.cyUid(C), cat: cat, teto: CY.DROP.vale[j + 1], r: CY.RARS[j + 1], d: v1.d, mes: v1.mes, at: at, consol: 1});
      out = {ok: true, msg: 'Vale ' + (CY.VALE_CAT[cat] || {n: cat}).n + ' até R$ ' + CY.DROP.vale[j + 1] + '.'};
    } else if (id === 'reciclar') {
      if ((I.mat.escoria || 0) < CY.FORJA.reciclar) return fail('Precisa de ' + CY.FORJA.reciclar + ' Escórias.');
      var sai = a.sai === 'lixa' ? 'lixa' : 'pedra'; I.mat.escoria -= CY.FORJA.reciclar; I.mat[sai] = (I.mat[sai] || 0) + 1; out = {ok: true, msg: '1 ' + mn(sai) + '.'};
    } else if (id === 'purificar') {
      if ((I.mat.escoria || 0) < CY.FORJA.purificar) return fail('Precisa de ' + CY.FORJA.purificar + ' Escórias.');
      if (!(E.cityDist(C, a.d).corr > 0)) return fail('Escolha um bairro corrompido.');
      I.mat.escoria -= CY.FORJA.purificar; E.cyCorrDown(C, a.d, 1); out = {ok: true, msg: CY.DMAP[a.d].n + ' perdeu 1 nível de corrupção.'};
    } else if (id === 'remendo') {
      var e = E.cyEco(C, a.eco);
      if (!e || e.st !== 'partido') return fail('Escolha um Eco Partido.');
      if ((I.mat.poeira || 0) < CY.FORJA.remendo) return fail('Precisa de ' + CY.FORJA.remendo + ' Poeiras de Eco.');
      I.mat.poeira -= CY.FORJA.remendo; e.st = 'ativo'; e.r = 'common'; e.n = e.n.replace(/^Eco Partido · /, ''); out = {ok: true, msg: e.n + ' voltou como Eco comum.'};
    } else if (id === 'desmanchar') {
      var x = (C.rel || []).filter(function(r2){ return r2.id === a.rel; })[0];
      if (!x || x.uni || x.origem) return fail('Escolha uma Relíquia que não seja única nem de origem.');
      var n = CY.RELIQ.desm[ri(x.r)] || 1, R = E.cyRng('desm:' + C.seed + ':' + x.id), got = {};
      for (var q = 0; q < n; q++) { var m = (q === 0 && ri(x.r) >= 3) ? 'fio' : E.cyPick(R, ri(x.r) >= 2 ? ['pedra', 'lixa', 'dado', 'brasa'] : ['pedra', 'lixa', 'pedra', 'dado']); got[m] = (got[m] || 0) + 1; I.mat[m] = (I.mat[m] || 0) + 1; }
      C.rel = C.rel.filter(function(r2){ return r2.id !== x.id; });
      Object.keys(C.eq || {}).forEach(function(s){ if (C.eq[s] === x.id) delete C.eq[s]; });
      out = {ok: true, msg: Object.keys(got).map(function(k2){ return got[k2] + '× ' + mn(k2); }).join(', ') + '.', got: got};
    } else return fail('Receita desconhecida.');
    E.cyLog(C, {k: 'receita', id: id, msg: out.msg});
    return out;
  };
})();
