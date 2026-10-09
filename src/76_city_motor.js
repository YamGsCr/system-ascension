/* ===== CIDADE · motor de portais: nascimento, prazos, quebra, Chamado, pausa, Licença e Reavaliação =====
   Nascimento é determinístico: a semente da Cidade + o dia + a vaga. Dois aparelhos com o mesmo estado fazem
   nascer os mesmos portais, e a guarda de sincronização resolve o resto. Toda manutenção roda como automática
   (Store.asAuto): nunca vence uma edição da pessoa. */
(function(){
  var CY = SYS.CITY, RK = ['E', 'D', 'C', 'B', 'A', 'S'], H1 = 3600000;
  function iso(t){ return new Date(t).toISOString(); }
  E.cyDayStart = function(day){ var d = U.parse(day); d.setHours(U.resetHour(), 0, 0, 0); return d.getTime(); };
  E.cyLog = function(C, o){ o.at = o.at || new Date().toISOString(); (C.log || (C.log = [])).push(o); E.cityPrune(C); return o; };

  /* ---------- Licença ---------- */
  E.cyLic = function(C){ var L = C.lic || (C.lic = {r: 'E', pts: 0, hist: [], tent: 0}); if (!L.hist) L.hist = []; return L; };
  E.cyLicRow = function(r){ return CY.LIC.filter(function(x){ return x.r === r; })[0] || CY.LIC[0]; };
  E.cyLicNext = function(C, from){ var i = RK.indexOf(from || E.cyLic(C).r); return CY.LIC[i + 1] || null; };
  /* entrar: até um rank acima da Licença; dois acima só com Pergaminho de Permissão. Chamado e Reavaliação ficam fora do limite */
  E.cyCanEnter = function(C, p){
    if (p.cham || p.reav) return {ok: true};
    var d = RK.indexOf(p.r) - RK.indexOf(E.cyLic(C).r);
    if (d <= 1) return {ok: true};
    if (d === 2) { var s = (E.cyInv(C).perg || []).filter(function(x){ return x.tipo === 'permissao'; })[0]; return s ? {ok: true, perg: s} : {ok: false, why: 'perg'}; }
    return {ok: false, why: 'rank'};
  };

  /* ---------- estado ---------- */
  E.cyOpen = function(C){ return ((C && C.portals) || []).filter(function(p){ return p && p.st === 'open'; }); };
  E.cyCount = function(C){ return E.cyOpen(C).filter(function(p){ return !p.cham && !p.reav; }).length; };
  E.cyPortal = function(C, id){ return ((C && C.portals) || []).filter(function(p){ return p.id === id; })[0] || null; };
  E.cyDistOf = function(way){ return CY.DIST.filter(function(d){ return d.way === way; })[0]; };
  E.cyWayW = function(S){ var foc = E.focusWays(S), fix = E.fixedWays(S), P = CY.NASCE.peso; return SYS.WAYS.map(function(w){ return {id: w.id, w: foc.indexOf(w.id) >= 0 ? P.foco : fix.indexOf(w.id) >= 0 ? P.fixo : P.outro}; }); };
  E.cyPaused = function(S, day){ var z = S && S.pz; return !!(z && z.on && z.pause && day <= z.pause); };

  /* nó ativo da rua (o kata é sobre o que você está estudando); "inimigo" = o nó começado há mais tempo */
  E.cyRuaNode = function(S, d, ri, inimigo){
    var w = SYS.WAYMAP[d.way], sel = (d.sel || [])[ri] || {}; if (!w) return null;
    var arcs = w.arcs.filter(function(a){ return sel.br ? a.br === sel.br : sel.arcs ? sel.arcs.indexOf(a.id) >= 0 : sel.tronco ? !a.br : true; });
    var doing = null, first = null, side = null, old = null, od = '';
    arcs.forEach(function(a){
      if (E.arcLocked(S, a)) return;
      a.nodes.forEach(function(n){
        var st = S.nodes[n.id]; if (st && st.s === 'done') return;
        if (st && (st.s === 'doing' || st.s === 'review') && st.d0 && (!od || st.d0 < od)) { od = st.d0; old = n; }
        if (!E.reqOk(S, n)) return;
        if (!doing && st && (st.s === 'doing' || st.s === 'review')) doing = n;
        if (a.side) { if (!side) side = n; } else if (!first) first = n;
      });
    });
    return (inimigo && old) || doing || first || side;
  };
  E.cyFill = function(s, node, topico, rua){ var t = node ? node.t : rua; return String(s || '').replace(/\{no\}/g, t).replace(/\{topico\}/g, topico || t); };

  /* ---------- modelo e modificadores ---------- */
  E.cyTpl = function(C, R, d, rank){
    var recent = (C.tpl && C.tpl[d.id]) || [], all = (CY.CAT || []).filter(function(t){ return t.d === d.id && t.r === rank; });
    var pool = all.filter(function(t){ return recent.indexOf(t.id) < 0; });
    if (!pool.length) pool = all;
    return pool.length ? E.cyPick(R, pool) : null;
  };
  E.cyRollMods = function(R, rank, depth, fis){
    if (fis) return [];                                     /* portal físico nunca recebe modificador */
    var sl = CY.SLOTS[rank] || [0, 0], max = sl[1] + Math.floor((depth || 1) / 2), n = sl[0] + Math.floor(R() * (max - sl[0] + 1));
    var ed = rank === 'E' || rank === 'D', out = [], tries = 0, keys = ['bencao', 'prefixo', 'sufixo', 'praga'];
    while (out.length < n && tries++ < 40) {
      var tipo = ed ? (R() < 0.5 ? 'prefixo' : 'sufixo') : keys[E.cyWeighted(R, keys.map(function(k){ return CY.SLOT_TIPO[k]; }))];
      var pool = CY.MODS.filter(function(m){ return m.t === tipo && !m.off && out.indexOf(m.id) < 0 && (!ed || m.leve) && (!m.so || m.so.indexOf(rank) >= 0) && (!m.ate || RK.indexOf(rank) <= RK.indexOf(m.ate)); });
      if (pool.length) out.push(E.cyPick(R, pool).id);
    }
    return out;
  };
  E.cyDur = function(rank, day, mods){
    var born = E.cyDayStart(day), dur = rank === 'E' ? E.cyDayStart(U.addDays(day, 1)) - born : CY.RANK[rank].prazo * H1;
    (mods || []).forEach(function(id){ var m = CY.MODMAP[id]; if (m && m.prazo) dur *= m.prazo; });
    return Math.round(dur);
  };
  /* um portal novo. o = {day, idx, way?, rank?} */
  E.cyMake = function(C, S, R, o){
    var day = o.day, born = E.cyDayStart(day);
    var ww = E.cyWayW(S), way = o.way || ww[E.cyWeighted(R, ww.map(function(x){ return x.w; }))].id, d = E.cyDistOf(way);
    if (!d) return null;
    var rank = o.rank || RK[E.cyWeighted(R, E.cyLicRow(E.cyLic(C).r).odds)];
    if (RK.indexOf(rank) > RK.indexOf(CY.SPAWN_MAX)) rank = CY.SPAWN_MAX;
    if ((E.cityDist(C, d.id).corr || 0) >= 3 && RK.indexOf(rank) > 2) rank = 'C';    /* corrupção 3: nada acima de C nasce ali */
    var t = E.cyTpl(C, R, d, rank); if (!t) return null;
    var rua = t.rua >= 0 ? t.rua : Math.floor(R() * d.ruas.length);
    var mods = E.cyRollMods(R, rank, E.cityDepth(E.cityDist(C, d.id).closed), t.fis);
    var node = E.cyRuaNode(S, d, rua, mods.indexOf('inimigo_intimo') >= 0), topico = node && node.st && node.st.length ? E.cyPick(R, node.st) : '';
    var f = function(s){ return E.cyFill(s, node, topico, d.ruas[rua]); };
    var p = {id: 'p' + day.replace(/-/g, '') + '-' + o.idx, n: f(t.n), d: d.id, way: way, rua: rua, r: rank, tpl: t.id, lore: t.lore,
      obj: f(t.obj), ent: f(t.ent), crit: (t.crit || []).map(f), passos: (t.passos || []).map(f), min: t.min, fis: !!t.fis,
      node: node ? {id: node.id, t: node.t} : null, mods: mods, born: iso(born), st: 'open', in: null};
    p.tranc = !t.fis && (rank === 'D' || rank === 'C') && R() < CY.TRANC.chance;
    p.due = iso(born + E.cyDur(rank, day, mods));
    return p;
  };

  /* ---------- nascimento do dia: 3 por reset; com mais de 4 abertos, 1; nunca passa de 6 ---------- */
  E.cySpawn = function(C, S, day){
    var open = E.cyCount(C), n = open > CY.NASCE.cheio ? CY.NASCE.devagar : CY.NASCE.porReset, made = [];
    n = Math.max(0, Math.min(n, CY.NASCE.max - open));
    C.tpl = C.tpl || {};
    for (var i = 0; i < n; i++) {
      var p = E.cyMake(C, S, E.cyRng('nasce:' + C.seed + ':' + day + ':' + i), {day: day, idx: i + 1});
      if (!p || E.cyPortal(C, p.id)) continue;
      C.portals.push(p); made.push(p);
      var rec = C.tpl[p.d] || (C.tpl[p.d] = []); rec.push(p.tpl); if (rec.length > CY.NASCE.repetir) rec.splice(0, rec.length - CY.NASCE.repetir);
      E.cyLog(C, {k: 'nasceu', p: p.id, n: p.n, r: p.r, d: p.d, at: p.born});
    }
    C.spawn = day;
    return made;
  };

  /* ---------- Portal do Chamado: nasce quando a janela abre, do tamanho dela, e expira no veredito ---------- */
  E.cyChamado = function(C, S, day){
    var z = S.pz; if (!z || !z.on || !App.pzPhase || C.cham === day || E.cyPaused(S, day)) return null;
    var P = App.pzPhase(); if (P.day !== day || !P.armed || P.ph !== 'janela') return null;
    var dur = P.fim - P.ini, rank = dur < CY.CHAMADO.E ? 'E' : dur <= CY.CHAMADO.D ? 'D' : 'C';
    var R = E.cyRng('chamado:' + C.seed + ':' + day), foc = E.focusWays(S);
    var p = E.cyMake(C, S, R, {day: day, idx: 0, way: E.cyPick(R, foc.length ? foc : [SYS.WAYS[0].id]), rank: rank});
    C.cham = day;
    if (!p) return null;
    p.id = 'c' + day.replace(/-/g, ''); p.cham = 1; p.tranc = false;
    p.due = iso(U.parse(day).getTime() + P.ver * 60000);
    C.portals.push(p);
    E.cyLog(C, {k: 'chamado', p: p.id, n: p.n, r: p.r, d: p.d});
    return p;
  };

  /* ---------- Reavaliação: ao bater os pontos, um desafio que cruza dois Caminhos ---------- */
  E.cyReavCheck = function(C, S, day){
    var L = E.cyLic(C), nx = E.cyLicNext(C);
    if (!nx || L.pts < nx.pts) return null;
    if ((C.portals || []).some(function(p){ return p.reav && p.st === 'open'; })) return null;
    if (L.falhou && U.daysBetween(L.falhou, day) < CY.REAV.espera) return null;
    var R = E.cyRng('reav:' + C.seed + ':' + (L.tent || 0)), list = [];
    E.focusWays(S).concat(E.fixedWays(S)).concat(SYS.WAYS.map(function(w){ return w.id; })).forEach(function(id){ if (list.indexOf(id) < 0) list.push(id); });
    var a = list[0], rest = list.slice(1, 4), b = E.cyPick(R, rest.length ? rest : list), t = CY.REAVS[(L.tent || 0) % CY.REAVS.length];
    var wa = SYS.WAYMAP[a], wb = SYS.WAYMAP[b], d = E.cyDistOf(a), now = Date.now();
    var f = function(s){ return String(s).replace(/\{wayA\}/g, wa.name).replace(/\{wayB\}/g, wb.name); };
    var p = {id: 'r' + day.replace(/-/g, '') + '-' + (L.tent || 0), n: 'Reavaliação · ' + t.n, d: d.id, way: a, rua: 0, r: RK.indexOf(nx.r) <= 2 ? 'C' : 'B',
      reav: {para: nx.r, a: a, b: b}, lore: 'O Sistema quer ver se a Licença ' + nx.r + ' cabe em você. Ninguém mais entra neste portal.',
      obj: f(t.obj), ent: f(t.ent), crit: t.crit.slice(), passos: [], min: t.min, mods: [], born: iso(now), due: iso(now + CY.REAV.prazo * H1), st: 'open', in: null};
    L.tent = (L.tent || 0) + 1;
    C.portals.push(p);
    E.cyLog(C, {k: 'reav', p: p.id, n: p.n, r: p.r, d: p.d, para: nx.r});
    return p;
  };

  /* ---------- prazos: quebra, some, Trancado estourado, briefing que muda ---------- */
  E.cyBreak = function(C, p, why){
    var ds = C.dist[p.d] || (C.dist[p.d] = E.newDist());
    ds.corr = Math.min(3, (ds.corr || 0) + 1);
    var I = E.cyInv(C); I.mat.escoria = (I.mat.escoria || 0) + 1;
    p.st = 'quebrou';
    E.cyLog(C, {k: 'quebrou', p: p.id, n: p.n, r: p.r, d: p.d, corr: ds.corr, why: why || 'prazo'});
  };
  E.cyExpire = function(C, S, now){
    E.cyOpen(C).forEach(function(p){
      if (p.tranc && p.in && p.lock && now > Date.parse(p.lock)) { E.cyBreak(C, p, 'trancado'); return; }
      if (now <= Date.parse(p.due)) return;
      if (p.reav) { var L = E.cyLic(C); L.falhou = U.today(); p.st = 'expirou'; E.cyLog(C, {k: 'reav-fim', p: p.id, n: p.n, para: p.reav.para, ok: false}); return; }
      if (!p.cham && CY.RANK[p.r].quebra && p.in) { E.cyBreak(C, p, 'prazo'); return; }
      p.st = 'sumiu';
      E.cyLog(C, {k: 'sumiu', p: p.id, n: p.n, r: p.r, d: p.d, cham: !!p.cham});
    });
    C.portals = (C.portals || []).filter(function(p){ return p.st === 'open'; });
  };
  E.cyTwist = function(C, now){
    E.cyOpen(C).forEach(function(p){
      if (p.vir || (p.mods || []).indexOf('cliente_volivel') < 0) return;
      var b = Date.parse(p.born), d = Date.parse(p.due);
      if (now >= b + (d - b) / 2) { p.vir = E.cyPick(E.cyRng('virada:' + p.id), CY.VIRADAS); E.cyLog(C, {k: 'virada', p: p.id, n: p.n, d: p.d}); }
    });
  };
  /* pausa do protocolo: os prazos param (um dia de pausa empurra todos os prazos abertos em 24 h), e nada nasce */
  E.cyPauseShift = function(C, S, day){
    var from = C.tickDay && C.tickDay < day ? U.addDays(C.tickDay, 1) : day, shifted = 0;
    for (var d = from; d <= day; d = U.addDays(d, 1)) {
      if (!E.cyPaused(S, d) || (C.pausa && C.pausa >= d)) continue;
      E.cyOpen(C).forEach(function(p){ p.due = iso(Date.parse(p.due) + 24 * H1); });
      C.pausa = d; shifted++;
    }
    return shifted;
  };

  /* ---------- manutenção: roda ao abrir, a cada minuto e quando chega uma versão da nuvem ---------- */
  E.cyTick = function(C, S, now){
    if (!C || !C.since || !E.cityOn(S)) return false;
    now = now || Date.now();
    var before = JSON.stringify(C), day = U.today();
    if (!C.seed) C.seed = 's' + U.hash(C.since + ':' + ((C.log && C.log[0] && C.log[0].at) || ''));
    C.portals = C.portals || []; E.cyInv(C); E.cyLed(C); E.cyLic(C);
    E.cyPauseShift(C, S, day);
    E.cyExpire(C, S, now);
    E.cyTwist(C, now);
    if (C.spawn !== day && !E.cyPaused(S, day)) E.cySpawn(C, S, day);
    E.cyChamado(C, S, day);
    E.cyReavCheck(C, S, day);
    C.tickDay = day;
    return JSON.stringify(C) !== before;
  };

  /* ---------- ações da pessoa ---------- */
  E.cyEnter = function(C, S, p, now){
    if (!p || p.st !== 'open' || p.in) return {ok: false, why: 'estado'};
    var ck = E.cyCanEnter(C, p); if (!ck.ok) return ck;
    if (ck.perg) { var I = E.cyInv(C); I.perg = I.perg.filter(function(x){ return x.id !== ck.perg.id; }); p.perg = 1; }
    now = now || Date.now(); p.in = iso(now);
    if (p.tranc) p.lock = iso(now + (CY.TRANC.min[p.r] || 45) * 60000);
    E.cyLog(C, {k: 'entrou', p: p.id, n: p.n, r: p.r, d: p.d});
    return {ok: true, perg: !!ck.perg};
  };
  /* nota mínima: a do rank, +10/+15 pelos modificadores; Reavaliação pede 75 */
  E.cyNotaMin = function(p){ if (p.reav) return CY.REAV.nota; var n = CY.RANK[p.r].nota || 0; (p.mods || []).forEach(function(id){ var m = CY.MODMAP[id]; if (m && m.nota) n += m.nota; }); return n; };
  E.cyPrecisaNota = function(p){ return !!p.reav || CY.RANK[p.r].prova === 'nota' || CY.RANK[p.r].prova === 'defesa'; };
  /* confere a entrega pelo rank: E 1 linha; D linha + resultado; C entregável; B entregável + nota */
  E.cyCheck = function(p, en){
    var pr = p.reav ? 'nota' : CY.RANK[p.r].prova, t = String(en.txt || '').trim(), res = String(en.res || '').trim(), link = /^https?:\/\/\S+$/i.test(String(en.link || '').trim());
    if (t.length < 8) return 'Escreva pelo menos uma linha do que fez.';
    if (pr === 'resultado' && !res && !link) return 'Falta o resultado: um número, um trecho ou um link.';
    if ((pr === 'entregavel' || pr === 'nota') && t.length < 60 && !link) return 'O entregável precisa de um link ou de um texto de verdade (60 caracteres ou mais).';
    if ((p.mods || []).indexOf('peso_morto') >= 0 && String(en.extra || '').trim().length < 8) return 'Peso Morto: falta a entrega a mais.';
    if (E.cyPrecisaNota(p) && !(en.nota >= 0)) return 'Falta a nota do Examinador.';
    return '';
  };
  E.cyClose = function(C, S, p, en, now){
    if (!p || p.st !== 'open' || !p.in) return {ok: false, msg: 'Entre no portal antes de entregar.'};
    now = now || Date.now();
    if (p.tranc && p.lock && now > Date.parse(p.lock)) return {ok: false, msg: 'O relógio do Trancado estourou.'};
    var err = E.cyCheck(p, en); if (err) return {ok: false, msg: err};
    var day = U.today(), L = E.cyLic(C);
    if (E.cyPrecisaNota(p) && en.nota < E.cyNotaMin(p)) {
      if (p.reav) { L.falhou = day; p.st = 'reprovou'; C.portals = C.portals.filter(function(x){ return x.id !== p.id; }); E.cyLog(C, {k: 'reav-fim', p: p.id, n: p.n, para: p.reav.para, ok: false, nota: en.nota}); return {ok: false, reprovou: true, msg: 'Nota ' + en.nota + ': a Licença fica onde está. Nova tentativa em ' + CY.REAV.espera + ' dias, com outro desafio.'}; }
      return {ok: false, msg: 'Nota ' + en.nota + ', abaixo de ' + E.cyNotaMin(p) + '. O portal continua aberto até o prazo.'};
    }
    var cump = Object.assign({}, en.cump || {}), h = new Date(now).getHours(); cump.alvorada = h >= 7 && h < 10;
    var res = E.cyRoll(C, S, p, cump), ap = E.cyApplyDrop(C, S, p, res);
    L.pts += CY.PTS[p.r] || 0;
    var ds = C.dist[p.d] || (C.dist[p.d] = E.newDist()); ds.closed = (ds.closed || 0) + 1;
    var subiu = null;
    if (p.reav) {
      var from = L.r, to = p.reav.para, nx2 = E.cyLicNext(C, to);
      if (en.nota >= CY.REAV.salto && en.src === 'ia' && nx2 && L.pts >= nx2.pts) to = nx2.r;   /* salto: nota 95+ com pontos para dois ranks */
      L.r = to; L.hist.push({r: to, d: day, nota: en.nota, de: from}); delete L.falhou; subiu = {de: from, para: to, salto: to !== p.reav.para};
    }
    var eco = null, RKD = CY.RANK[p.r];
    if (RKD.eco && en.eco && String(en.eco.n || '').trim()) {
      eco = {id: 'e' + (C.nid = (C.nid || 0) + 1), n: String(en.eco.n).trim().slice(0, 60), tipo: en.eco.tipo || 'texto', link: String(en.eco.link || '').slice(0, 300), r: RKD.eco, way: p.way, d: p.d, rua: p.rua, from: p.id, at: new Date(now).toISOString(), nv: 1};
      (C.ecos || (C.ecos = [])).push(eco);
    }
    p.st = 'fechou';
    C.portals = C.portals.filter(function(x){ return x.id !== p.id; });
    var sum = {id: p.id, n: p.n, r: p.r, d: p.d, way: p.way, cham: !!p.cham, reav: p.reav || null, tranc: !!p.tranc};
    C.ult = {p: sum, res: res, eco: eco, lic: subiu, at: new Date(now).toISOString(), visto: false};
    E.cyLog(C, {k: 'fechou', p: p.id, n: p.n, r: p.r, d: p.d, nota: en.nota != null ? en.nota : undefined, rol: res.n, xp: res.gar.xp, gem: res.gar.gem});
    return {ok: true, res: res, core: ap.core, eco: eco, lic: subiu};
  };

  /* ---------- recompensas da Cidade entram no progresso (XP do Caminho, ◆ e créditos) ---------- */
  var oldDerive = E.derive;
  E.derive = function(S, J){
    var D = oldDerive(S, J), C = SYS.App && SYS.App.city, L = C && C.led;
    if (!L) return D;
    var x = 0;
    SYS.WAYS.forEach(function(w){
      var ax = (L.xp && L.xp[w.id]) || 0, ac = (L.cr && L.cr[w.id]) || 0;
      if (!ax && !ac) return;
      D.wayXP[w.id] += ax; x += ax; D.crEarn[w.id] += ac; D.wayCr[w.id] += ac;
    });
    D.gem += L.gem || 0; D.gemEarned += L.gem || 0;
    D.cityXP = x; D.cityGem = L.gem || 0;
    if (x) {
      D.xp += x; D.level = E.levelOf(D.xp); D.letter = E.letterOf(D.level);
      D.lvFloor = SYS.xpNeed(D.level); D.lvNext = D.level >= SYS.MAXLVL ? D.lvFloor : SYS.xpNeed(D.level + 1);
      D.grank = E.grankOf(D.xp);
      var t3 = 0, t4 = 0;
      SYS.WAYS.forEach(function(w){ var ti = E.tierOf(w.tiers, D.wayXP[w.id]); D.tier[w.id] = ti; if (ti.i >= 2) t3++; if (ti.i >= 3) t4++; D.attr[w.id] = 10 + Math.floor(D.wayXP[w.id] / 40); });
      D.waysTier3 = t3; D.waysTier4 = t4;
    }
    return D;
  };
})();
