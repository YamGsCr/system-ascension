/* citymotor · o motor de portais e o drop: nascimento, pesos, Licença, modificadores, prazos, quebra, pausa,
   Chamado, rolagem (distribuição de verdade), pity, corrupção, Reavaliação, entrada e entrega, economia */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const near = (a, b, tol) => Math.abs(a - b) <= tol;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext(); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.clock.install({ time: new Date('2026-10-14T10:00:00') });
  await p.goto(URL); await p.clock.runFor(1800);
  /* ambiente de laboratório: um save com foco em architect e ars, fixos aesthetic, founder e mind */
  await p.evaluate(() => {
    const A = SYS.App, E = SYS.E; A.S.pz.on = false; A.S.pz.intro = 1;
    window.T = {
      novo: (o) => { const C = E.cityFill(E.newCity()); C.since = '2026-10-14'; C.seed = 'sTeste'; Object.assign(C, o || {}); return C; },
      S: () => A.S
    };
  });
  const ev = (fn, arg) => p.evaluate(fn, arg);

  sec('nascimento');
  let r = await ev(() => {
    const E = SYS.E, S = T.S(), C1 = T.novo(), C2 = T.novo();
    const a = E.cySpawn(C1, S, '2026-10-14').map(x => x.id + x.tpl + x.r + x.mods.join()), b = E.cySpawn(C2, S, '2026-10-14').map(x => x.id + x.tpl + x.r + x.mods.join());
    const C3 = T.novo(); for (let i = 0; i < 5; i++) C3.portals.push({id: 'x' + i, st: 'open', due: '2030-01-01T00:00:00Z', r: 'E', d: 'servidores'});
    const n5 = E.cySpawn(C3, S, '2026-10-14').length;
    const C4 = T.novo(); for (let i = 0; i < 6; i++) C4.portals.push({id: 'x' + i, st: 'open', due: '2030-01-01T00:00:00Z', r: 'E', d: 'servidores'});
    C4.portals.push({id: 'cham', cham: 1, st: 'open', due: '2030-01-01T00:00:00Z'}); C4.portals[0].st = 'open';
    const n6 = E.cySpawn(C4, S, '2026-10-14').length;
    const C5 = T.novo(); for (let i = 0; i < 3; i++) C5.portals.push({id: 'x' + i, st: 'open', due: '2030-01-01T00:00:00Z', r: 'E', d: 'servidores'}); C5.portals.push({id: 'c', cham: 1, st: 'open', due: '2030-01-01T00:00:00Z'}, {id: 'r', reav: {}, st: 'open', due: '2030-01-01T00:00:00Z'});
    const n3 = E.cySpawn(C5, S, '2026-10-14').length;
    return { igual: JSON.stringify(a) === JSON.stringify(b), n: a.length, n5, n6, n3 };
  });
  ok(r.igual && r.n === 3, 'mesma semente, mesmo dia, mesmo estado: os mesmos 3 portais (dois aparelhos chegam no mesmo)');
  ok(r.n5 === 1, 'com mais de 4 abertos, nasce só 1 (' + r.n5 + ')');
  ok(r.n6 === 0, 'com 6 abertos, nada nasce (' + r.n6 + ')');
  ok(r.n3 === 3, 'Chamado e Reavaliação não contam no limite de 6');

  r = await ev(() => {
    const E = SYS.E, S = T.S(), C = T.novo(), W = {}, Rk = {}, RkB = {}, N = 7000;
    for (let i = 0; i < N; i++) { const p = E.cyMake(C, S, E.cyRng('w' + i), {day: '2026-10-14', idx: i}); W[p.way] = (W[p.way] || 0) + 1; Rk[p.r] = (Rk[p.r] || 0) + 1; }
    const CB = T.novo({lic: {r: 'B', pts: 500, hist: [], tent: 0}});
    for (let i = 0; i < 3000; i++) { const p = E.cyMake(CB, S, E.cyRng('b' + i), {day: '2026-10-14', idx: i}); RkB[p.r] = (RkB[p.r] || 0) + 1; }
    const CC = T.novo({lic: {r: 'B', pts: 500, hist: [], tent: 0}}); CC.dist.servidores.corr = 3; let alto = 0;
    for (let i = 0; i < 600; i++) { const p = E.cyMake(CC, S, E.cyRng('c' + i), {day: '2026-10-14', idx: i, way: 'architect'}); if ('BAS'.indexOf(p.r) >= 0) alto++; }
    const foc = E.focusWays(S), fix = E.fixedWays(S);
    return { W, Rk, RkB, alto, N, foc, fix };
  });
  const wsum = r.foc.length * 3 + r.fix.length * 2 + (7 - r.foc.length - r.fix.length);
  const wexp = id => (r.foc.includes(id) ? 3 : r.fix.includes(id) ? 2 : 1) / wsum * 100;
  ok(Object.keys(r.W).every(id => near(r.W[id] / r.N * 100, wexp(id), 2.2)), 'peso por Caminho: em foco ×3, fixos ×2, os demais ×1 (' + Object.keys(r.W).map(id => id + ' ' + (r.W[id] / r.N * 100).toFixed(1) + '%').join(', ') + ')');
  ok(near(r.Rk.E / r.N * 100, 50, 2.5) && near(r.Rk.D / r.N * 100, 35, 2.5) && near(r.Rk.C / r.N * 100, 15, 2) && !r.Rk.B, 'Licença E: E 50%, D 35%, C 15% (' + ['E', 'D', 'C'].map(k => k + ' ' + (r.Rk[k] / r.N * 100).toFixed(1)).join(' · ') + ')');
  ok(!r.RkB.A && !r.RkB.S && near((r.RkB.B || 0) / 3000 * 100, 40, 3), 'A e S ainda não nascem (saem do Examinador): na Licença B viram B (' + ((r.RkB.B || 0) / 30).toFixed(1) + '% de B)');
  ok(r.alto === 0, 'corrupção 3: nada acima de C nasce no distrito');

  sec('modificadores e Trancado');
  r = await ev(() => {
    const E = SYS.E, S = T.S(), C = T.novo({lic: {r: 'B', pts: 500, hist: [], tent: 0}}), M = SYS.CITY.MODMAP;
    let edPesado = 0, edN = 0, slotsOk = true, fisMod = 0, fisTr = 0, tr = 0, trBase = 0, ben = 0, slots = 0, off = 0, so = 0;
    for (let i = 0; i < 6000; i++) {
      const p = E.cyMake(C, S, E.cyRng('m' + i), {day: '2026-10-14', idx: i});
      const sl = SYS.CITY.SLOTS[p.r], max = sl[1] + Math.floor(E.cityDepth(E.cityDist(C, p.d).closed) / 2);
      if (!p.fis && (p.mods.length < sl[0] || p.mods.length > max)) slotsOk = false;
      if (p.r === 'E' || p.r === 'D') { edN++; p.mods.forEach(id => { if (!M[id].leve) edPesado++; }); }
      else p.mods.forEach(id => { slots++; if (M[id].t === 'bencao') ben++; });
      p.mods.forEach(id => { if (M[id].off) off++; if (M[id].so && M[id].so.indexOf(p.r) < 0) so++; });
      if (p.fis) { if (p.mods.length) fisMod++; if (p.tranc) fisTr++; }
      if ((p.r === 'D' || p.r === 'C') && !p.fis) { trBase++; if (p.tranc) tr++; }
    }
    return { edPesado, slotsOk, fisMod, fisTr, tr: tr / trBase * 100, ben: ben / slots * 100, off, so };
  });
  ok(r.slotsOk, 'quantidade de modificadores dentro dos slots do rank (+1 máximo a cada 2 níveis de profundidade)');
  ok(r.edPesado === 0, 'E e D só recebem prefixos e sufixos leves');
  ok(r.off === 0 && r.so === 0, 'nada que dependa de sistema futuro (Examinador, Ecos, Revanche) nem fora do rank permitido');
  ok(near(r.ben, 10, 2), 'bênção é rara: ' + r.ben.toFixed(1) + '% dos slots (1 em 10)');
  ok(r.fisMod === 0 && r.fisTr === 0, 'portal físico nunca recebe modificador nem nasce Trancado');
  ok(near(r.tr, 5, 1.2), '1 em cada 20 D ou C nasce Trancado (' + r.tr.toFixed(2) + '%)');

  sec('prazos');
  r = await ev(() => {
    const E = SYS.E, h = (rank, mods) => E.cyDur(rank, '2026-10-14', mods || []) / 3600000;
    return { E: h('E'), D: h('D'), C: h('C'), B: h('B'), mare: h('C', ['mare_vermelha']), atalho: h('D', ['atalho']), born: new Date(E.cyDayStart('2026-10-14')).getHours() };
  });
  ok(r.E === 24 && r.D === 48 && r.C === 72 && r.B === 168, 'E até o reset (24 h), D 48 h, C 3 dias, B 7 dias');
  ok(r.mare === 36 && r.atalho === 72, 'Maré Vermelha corta o prazo pela metade; Atalho dá +50%');
  ok(r.born === 8, 'o portal nasce no reset do dia (08:00)');

  sec('vencer, quebrar e sumir');
  r = await ev(() => {
    const E = SYS.E, S = T.S(), C = T.novo(), t0 = Date.parse('2026-10-20T12:00:00Z');
    const base = (id, r, extra) => Object.assign({id, n: id, d: 'piscinas', way: 'aesthetic', rua: 1, r, st: 'open', born: '2026-10-14T11:00:00Z', due: '2026-10-16T11:00:00Z', mods: [], crit: []}, extra || {});
    C.portals = [base('e1', 'E'), base('c1', 'C'), base('c2', 'C', {in: '2026-10-15T00:00:00Z'}), base('d1', 'D', {tranc: true, in: '2026-10-20T10:00:00Z', lock: '2026-10-20T10:45:00Z', due: '2026-10-30T00:00:00Z'})];
    E.cyExpire(C, S, t0);
    return { open: C.portals.length, corr: C.dist.piscinas.corr, esc: C.inv.mat.escoria, log: C.log.map(l => l.p + ':' + l.k).join(',') };
  });
  ok(r.log.indexOf('e1:sumiu') >= 0 && r.log.indexOf('c1:sumiu') >= 0, 'E vencido some; C em que você nem entrou também some (outra guilda fechou)');
  ok(r.log.indexOf('c2:quebrou') >= 0 && r.log.indexOf('d1:quebrou') >= 0, 'C começado e vencido quebra; Trancado estourado quebra na hora');
  ok(r.corr === 2 && r.esc === 2 && r.open === 0, 'cada quebra corrompe o distrito (+1 nível) e deixa 1 Escória');

  sec('pausa do protocolo e Portal do Chamado');
  r = await ev(() => {
    const E = SYS.E, S = JSON.parse(JSON.stringify(T.S())), C = T.novo();
    S.pz.on = true; S.pz.pause = '2026-10-16';
    C.portals = [{id: 'a', st: 'open', due: '2026-10-17T11:00:00.000Z', r: 'D', d: 'galeria'}]; C.tickDay = '2026-10-13';
    const shifted = E.cyPauseShift(C, S, '2026-10-14');
    const due = C.portals[0].due, again = E.cyPauseShift(C, S, '2026-10-14');
    const spawnPaused = E.cyPaused(S, '2026-10-14');
    return { shifted, due, again, spawnPaused };
  });
  ok(r.shifted === 1 && r.due === '2026-10-18T11:00:00.000Z' && r.again === 0, 'dia de pausa empurra os prazos abertos em 24 h, uma vez por dia');
  ok(r.spawnPaused, 'na pausa nada nasce');
  await p.clock.setSystemTime(new Date('2026-10-14T17:40:00')); await p.clock.runFor(100);
  r = await ev(() => {
    const E = SYS.E, A = SYS.App, C = T.novo(), z = A.S.pz; z.on = true; z.since = '2026-10-01'; z.pause = '';
    const ph = A.pzPhase(), c = E.cyChamado(C, A.S, '2026-10-14'), again = E.cyChamado(C, A.S, '2026-10-14');
    z.on = false;
    return { ph: ph.ph, dur: ph.fim - ph.ini, id: c && c.id, r: c && c.r, due: c && c.due, foco: c && E.focusWays(A.S).indexOf(c.way) >= 0, again: !!again, conta: E.cyCount(C) };
  });
  ok(r.ph === 'janela' && r.id === 'c20261014' && r.again === false, 'na janela nasce 1 Portal do Chamado por dia');
  ok(r.r === 'D' && r.dur === 70, 'do tamanho da janela: 70 min → D');
  ok(r.foco && /T22:30:00/.test(r.due), 'num Caminho em foco, e expira no veredito (19:30)');
  ok(r.conta === 0, 'e não conta no limite de 6');
  await p.clock.setSystemTime(new Date('2026-10-14T10:00:00')); await p.clock.runFor(100);

  sec('drop: distribuição de verdade (120 mil rolagens por caso)');
  r = await ev(() => {
    const E = SYS.E, CY = SYS.CITY, S = T.S(), C = T.novo(), N = 120000;
    const run = (rank, mods, corr) => { const G = {}, Rr = {}; C.dist.galeria.corr = corr || 0; let rolls = 0;
      for (let i = 0; i < N / 10; i++) { const p = {id: 'd' + rank + i + (mods || []).join(), r: rank, d: 'galeria', way: 'flaneur', rua: 0, mods: mods || []}; const res = E.cyRoll(C, S, p); rolls += res.n; res.rolls.forEach(x => { G[x.gav] = (G[x.gav] || 0) + 1; Rr[x.rar] = (Rr[x.rar] || 0) + 1; }); }
      return {G, Rr, rolls, n: N / 10}; };
    const d = run('D'), c = run('C'), cR = run('C', ['lua_cheia']), q = run('C', ['mare_vermelha']);
    const odds = E.cyOdds(C, {id: 'x', r: 'C', d: 'galeria', way: 'flaneur', mods: ['lua_cheia']});
    return { d, c, cR, q, gavD: CY.DROP.gav.map(g => g.p[0]), gavC: CY.DROP.gav.map(g => g.p[1]), oddsR: odds.rar, ids: CY.DROP.gav.map(g => g.id) };
  });
  const pct = (o, k) => (o[k] || 0) / Object.values(o).reduce((a, b) => a + b, 0) * 100;
  ok(r.ids.every((id, i) => near(pct(r.d.G, id), r.gavD[i], 0.9)), 'gavetas E–D batem com a tabela (' + r.ids.map(id => id + ' ' + pct(r.d.G, id).toFixed(1)).join(' · ') + ')');
  ok(r.ids.every((id, i) => near(pct(r.c.G, id), r.gavC[i], 0.9)), 'gavetas C–B batem com a tabela');
  ok(near(pct(r.d.Rr, 'common'), 55, 1) && near(pct(r.d.Rr, 'uncommon'), 28, 1) && near(pct(r.d.Rr, 'rare'), 17, 1) && !r.d.Rr.epic, 'raridade em D: comum 55, incomum 28, raro 17 (o que passa do teto vira raro)');
  ok(near(pct(r.c.Rr, 'epic'), 5, 0.6) && !r.c.Rr.legendary, 'em C o teto é épico: 4% + o que passaria dele (' + pct(r.c.Rr, 'epic').toFixed(2) + '%)');
  ok(near(pct(r.cR.Rr, 'rare') + pct(r.cR.Rr, 'epic'), 25.5, 1.2), 'Lua Cheia (R +50%) multiplica de raro para cima: 17% → ' + (pct(r.cR.Rr, 'rare') + pct(r.cR.Rr, 'epic')).toFixed(1) + '%');
  ok(near(r.cR.rolls / r.cR.n, 2, 0.01) && near(r.q.rolls / r.q.n, 3, 0.03), 'Q vira rolagem extra: C com Q +50% faz 3 em média (' + (r.q.rolls / r.q.n).toFixed(2) + ')');
  ok(Math.abs(r.oddsR.reduce((a, b) => a + b, 0) - 100) < 0.001, 'as odds mostradas no portal somam 100%');

  r = await ev(() => {
    const E = SYS.E, S = JSON.parse(JSON.stringify(T.S())), C = T.novo();
    C.pity.c = 10; const p = {id: 'pity1', r: 'C', d: 'galeria', way: 'flaneur', rua: 0, mods: []};
    const res = E.cyRoll(C, S, p); E.cyApplyDrop(C, S, p, res);
    const pity = {first: res.rolls[0].rar, flag: res.pity, after: C.pity.c};
    C.dist.galeria.corr = 2; const o2 = E.cyOdds(C, {id: 'x', r: 'D', d: 'galeria', mods: []}), o3 = E.cyOdds(C, {id: 'y', r: 'D', d: 'galeria', mods: ['fome_mana']});
    C.dist.galeria.corr = 0;
    const res2 = E.cyRoll(C, S, {id: 'tr', r: 'C', d: 'galeria', way: 'flaneur', mods: [], tranc: true});
    const C6 = T.novo(); for (let i = 0; i < 5; i++) C6.inv.vales.push({id: 'v' + i, cat: 'lazer'}); const g0 = C6.led.gem;
    E.cyGive(C6, S, {k: 'vale', cat: 'lazer', teto: 50, rar: 'uncommon', d: 'galeria', mes: '2026-10'}, '');
    const k0 = (S.owned.keys.D || 0); E.cyGive(C6, S, {k: 'chave', rank: 'D', rar: 'rare'}, '');
    return { pity, gem2: o2.gem, gem3: o3.gem, trRol: res2.n, trCaixa: !!res2.gar.caixa, vales: C6.inv.vales.length, virou: C6.led.gem - g0, chave: (S.owned.keys.D || 0) - k0 };
  });
  ok(r.pity.first === 'epic' && r.pity.flag && r.pity.after === 0, 'pity: 10 portais C+ sem épico garantem épico na rolagem seguinte, e o contador zera');
  ok(r.gem2 === 8 && r.gem3 === 0, 'corrupção 2 corta 50% do ◆ base (15 → 8); Fome de Mana zera');
  ok(r.trRol >= 4 && r.trCaixa, 'Trancado fechado no tempo: rolagens dobradas e um par de caixas garantido');
  ok(r.vales === 5 && r.virou === 80, 'cabem 5 vales; o sexto vira ◆ sozinho (incomum: 80 ◆)');
  ok(r.chave === 1, 'chave de dungeon vai direto para as chaves do Sistema');

  sec('Licença, Reavaliação e salto');
  r = await ev(() => {
    const E = SYS.E, S = JSON.parse(JSON.stringify(T.S())), C = T.novo(), out = {};
    C.lic.pts = 29; out.antes = !!E.cyReavCheck(C, S, '2026-10-14');
    C.lic.pts = 30; const rv = E.cyReavCheck(C, S, '2026-10-14'); out.rv = rv && {r: rv.r, para: rv.reav.para, a: rv.reav.a, b: rv.reav.b, prazo: (Date.parse(rv.due) - Date.parse(rv.born)) / 3600000, obj: rv.obj};
    out.dup = !!E.cyReavCheck(C, S, '2026-10-14');
    E.cyEnter(C, S, rv);
    const longo = 'Entreguei o protótipo cruzando os dois Caminhos, com prova e decisões. '.repeat(2);
    const r1 = E.cyClose(C, S, rv, {txt: longo, nota: 60, src: 'ia'});
    out.reprovou = r1.reprovou && C.lic.falhou === '2026-10-14' && C.lic.r === 'E';
    out.espera = !!E.cyReavCheck(C, S, '2026-10-18');
    const rv2 = E.cyReavCheck(C, S, '2026-10-21'); out.outro = rv2 && rv2.n !== rv.n;
    E.cyEnter(C, S, rv2); C.lic.pts = 130;
    const r2 = E.cyClose(C, S, rv2, {txt: longo, nota: 97, src: 'ia'});
    out.salto = r2.ok && C.lic.r === 'C' && r2.lic && r2.lic.salto;
    const C2 = T.novo(); C2.lic.pts = 35; const rv3 = E.cyReavCheck(C2, S, '2026-10-14'); E.cyEnter(C2, S, rv3);
    const r3 = E.cyClose(C2, S, rv3, {txt: longo, nota: 80, src: 'manual'}); out.normal = r3.ok && C2.lic.r === 'D' && !r3.lic.salto;
    return out;
  });
  ok(!r.antes && r.rv && r.rv.para === 'D' && r.rv.r === 'C' && r.rv.a !== r.rv.b && r.rv.prazo === 168, 'aos 30 Pontos nasce a Reavaliação para D: um C que cruza dois Caminhos, 7 dias');
  ok(!/\{way[AB]\}/.test(r.rv.obj), 'o desafio já vem com os nomes dos dois Caminhos');
  ok(!r.dup, 'uma Reavaliação aberta por vez');
  ok(r.reprovou, 'nota abaixo de 75: não sobe, e marca a tentativa');
  ok(!r.espera && r.outro, 'nova tentativa só depois de 7 dias, com outro desafio');
  ok(r.salto, 'salto: nota 95+ do Examinador com Pontos para dois ranks pula um rank inteiro (E → C)');
  ok(r.normal, 'nota 80 sobe um rank só (E → D)');

  sec('entrar e entregar');
  r = await ev(() => {
    const E = SYS.E, S = JSON.parse(JSON.stringify(T.S())), C = T.novo(), out = {};
    const mk = (id, r, extra) => Object.assign({id, n: id, d: 'biblioteca', way: 'mind', rua: 0, r, st: 'open', born: '2026-10-14T11:00:00Z', due: '2030-01-01T00:00:00Z', mods: [], crit: ['a', 'b', 'c']}, extra || {});
    const pc = mk('c1', 'C'); C.portals.push(pc);
    out.semPerg = E.cyEnter(C, S, pc).why;
    C.inv.perg.push({id: 'pp', tipo: 'permissao', rank: 'E'});
    out.comPerg = E.cyEnter(C, S, pc).ok && C.inv.perg.length === 0 && !!pc.in;
    const pe = mk('e1', 'E'); C.portals.push(pe); E.cyEnter(C, S, pe);
    out.curta = E.cyClose(C, S, pe, {txt: 'fiz'}).msg;
    const pd = mk('d1', 'D'); C.portals.push(pd); E.cyEnter(C, S, pd);
    out.semRes = E.cyClose(C, S, pd, {txt: 'fiz o drill de três variações'}).msg;
    out.cCurto = E.cyClose(C, S, pc, {txt: 'pronto, fiz'}).msg;
    C.lic.r = 'C'; const pb = mk('b1', 'B', {mods: ['auditoria']}); C.portals.push(pb); E.cyEnter(C, S, pb);
    const txt = 'Projeto completo entregue em quatro sessões, com o resultado e as decisões explicadas.';
    out.bNota = E.cyClose(C, S, pb, {txt, nota: 70, src: 'ia'}).msg;
    out.bMin = E.cyNotaMin(pb);
    const fim = E.cyClose(C, S, pb, {txt, nota: 80, src: 'ia', eco: {n: 'Template de case', tipo: 'template', link: ''}});
    out.bOk = fim.ok && C.lic.pts === 12 && C.dist.biblioteca.closed === 1 && C.ecos.length === 1 && C.ecos[0].r === 'rare' && (S.owned.keys.E || 0) >= 1;
    const pm = mk('m1', 'C', {mods: ['sem_consulta', 'mare_vermelha']}); C.portals.push(pm);
    out.qSem = E.cyQR(C, pm, {}).r; out.qCom = E.cyQR(C, pm, {sem_consulta: true}).r; out.qPraga = E.cyQR(C, pm, {}).q;
    return out;
  });
  ok(r.semPerg === 'perg' && r.comPerg, 'dois ranks acima pede Pergaminho de Permissão; entrar gasta o pergaminho');
  ok(/linha/.test(r.curta) && /resultado/.test(r.semRes) && /entregável/.test(r.cCurto), 'a entrega segue o rank: E 1 linha, D linha + resultado, C entregável');
  ok(r.bMin === 75 && /abaixo de 75/.test(r.bNota), 'B com da Auditoria: nota mínima 65 + 10');
  ok(r.bOk, 'B aprovado: 12 Pontos, profundidade, Eco raro registrado e a chave E garantida');
  ok(r.qSem === 0 && r.qCom === 40 && r.qPraga === 50, 'modificador não cumprido não soma; praga soma sempre');

  sec('livro-razão no progresso e Chamado');
  r = await ev(() => {
    const A = SYS.App, E = SYS.E, before = E.derive(A.S, A.J);
    const keep = JSON.stringify(A.city); A.city.led = {xp: {mind: 300}, cr: {mind: 40}, gem: 120};
    const after = E.derive(A.S, A.J);
    A.city = E.cityFill(JSON.parse(keep));
    return { xp: after.xp - before.xp, gem: after.gem - before.gem, cr: after.wayCr.mind - before.wayCr.mind, lv: after.level >= before.level, tier: !!after.tier.mind };
  });
  ok(r.xp === 300 && r.gem === 120 && r.cr === 40 && r.lv && r.tier, 'XP vai para o Caminho, ◆ e créditos entram no saldo, e o nível recalcula');
  r = await ev(() => {
    const A = SYS.App; const C = A.city; const keep = JSON.stringify(C);
    C.portals = [{id: 'zz', st: 'open', in: '2026-10-14T20:30:00Z', dr: 'x'.repeat(170)}];
    const M = A.pzMap(); A.city = SYS.E.cityFill(JSON.parse(keep));
    return { in: M['cy:zz:in'], dr: M['cy:zz:dr'] };
  });
  ok(r.in === 1 && r.dr === 3, 'entrar e escrever no rascunho viram marcas de ação para o Chamado');

  sec('economia: 60 dias na Licença E');
  r = await ev(() => {
    const E = SYS.E, sim = (porDia) => {
      const S = JSON.parse(JSON.stringify(T.S())), C = T.novo(); let day = '2026-10-14', fechou = 0;
      for (let i = 0; i < 60; i++) {
        E.cySpawn(C, S, day);
        E.cyOpen(C).sort((a, b) => Date.parse(a.due) - Date.parse(b.due)).slice(0, porDia).forEach(p => { if (!E.cyCanEnter(C, p).ok) return; E.cyEnter(C, S, p); const r = E.cyClose(C, S, p, {txt: 'Entrega completa, com o que fiz, o resultado e o link da prova de verdade.', res: 'ok', link: 'https://exemplo.com/x', nota: 80, src: 'ia'}); if (r.ok) fechou++; });
        day = SYS.U.addDays(day, 1); E.cyExpire(C, S, SYS.E.cyDayStart(day) + 1);
      }
      return { gem: C.led.gem / 60, fechou: fechou / 60, xp: Object.values(C.led.xp).reduce((a, b) => a + b, 0) / 60, pts: C.lic.pts, lic: C.lic.r, vales: C.inv.vales.length, caixas: C.inv.caixas.length };
    };
    return { dois: sim(2), tudo: sim(6) };
  });
  ['dois', 'tudo'].forEach(k => { const x = r[k]; console.log('  · ' + (k === 'dois' ? 'até 2 por dia' : 'tudo o que der') + ': ' + x.fechou.toFixed(2) + ' portais/dia · ' + x.gem.toFixed(1) + ' ◆/dia · ' + x.xp.toFixed(0) + ' XP/dia · ' + x.pts + ' Pontos (Licença ' + x.lic + ') · ' + x.vales + ' vales · ' + x.caixas + ' caixas'); });
  ok(r.tudo.gem >= 35 && r.tudo.gem <= 60, 'quem fecha tudo o que nasce fica perto da meta da Bíblia, uns 45 ◆ por dia na Licença E (' + r.tudo.gem.toFixed(1) + ')');
  ok(r.dois.gem < r.tudo.gem && r.dois.gem >= 20, 'quem fecha menos ganha menos, sem cair a zero (' + r.dois.gem.toFixed(1) + ')');

  ok(errs.length === 0, 'sem erro de JS ' + errs.slice(0, 3).join(' | '));
  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
