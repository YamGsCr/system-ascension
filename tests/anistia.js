/* anistia · o pedido de 17/10: faltas seguidas da Zona viram descanso, prendas saem, multa da sentença volta,
   a chama fica protegida sem gastar gelo; uma vez só, até 31/10, e "agora não" deixa para a próxima abertura.
   O pedido de 21/10: só as prendas das faltas até 21/10 saem, de 21/10 a 04/11.
   O pedido de 09/11: a Zona e a Cidade do período (de 22/10 até a aplicação), sem mexer na chama.
   O pedido de 15/11: o mesmo desde 09/11 e, na véspera da jornada, a Zona sem veredito.
   E a banca da Zona: o Examinador julga pelo mesmo pedido que aparece na tela */
const L = require('./v14lib.js'); const { ok, sec, open, at, run, prime } = L;
const DAYS = (a, b) => { const out = []; let d = new Date(a + 'T12:00:00'); const e = new Date(b + 'T12:00:00'); while (d <= e) { out.push(d.toISOString().slice(0, 10)); d = new Date(d.getTime() + 864e5); } return out; };
/* dez dias e pouco de Sistema em dia: Zona cumprida e diárias feitas de 01/10 a 11/10, 1 gelo no estoque */
const seed = (p) => p.evaluate((days) => {
  const A = SYS.App, S = A.S, z = S.pz, need = S.settings.dailies.length, q = {};
  S.settings.dailies.forEach(k => { q[k] = 1; });
  z.on = true; z.since = days[0]; z.intro = 1; z.dias = [0, 1, 2, 3, 4, 5, 6];
  days.forEach(d => { z.log[d] = {v: 'ok', a: 2}; z.tot.ok++; S.daily[d] = {q: Object.assign({}, q), need: need}; });
  z.seq = days.length; z.best = days.length; z.clean = days.length; S.owned.freezes = 1;
  SYS.Store.asAuto(() => A.commit(['core'], {quiet: true}));
}, DAYS('2026-10-01', '2026-10-11'));
const st = p => p.evaluate(() => { const A = SYS.App, S = A.S, z = S.pz, m = document.querySelector('.modal .win'); return { modal: A.ui.modal && A.ui.modal.type, mid: A.ui.modal && A.ui.modal.id, txt: m ? m.textContent : '', ov: A.ui.pz ? A.ui.pz.k : null, open: SYS.E.pzOpen(S).length, pens: z.pens.length, gout: z.gout || 0, seq: z.seq, clean: z.clean, miss: z.tot.miss, rest: z.tot.rest, show: !!z.show, lost: !!S.streakLost, fz: S.owned.freezes, streak: A.D.streak, flag: S.flags.anistia || '', an: (z.anistias || []).length }; });

(async () => {
  const b = await L.chromium.launch();
  let { p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; });
  await prime(p, true); await seed(p);
  await at(p, '2026-10-11T21:00:00', 2500);
  let s = await st(p), r;
  ok(s.seq === 11 && s.streak === 11 && s.modal !== 'anistia', 'antes: 11 dias de Zona cumprida e chama com 11 dias, nada a perdoar (' + s.seq + '/' + s.streak + ')');
  await p.evaluate(() => { SYS.App.pzHide(); SYS.App.ui.modal = null; SYS.App.renderModal(); });

  sec('seis dias sem abrir o Sistema');
  await at(p, '2026-10-17T20:00:00', 4000);
  s = await st(p);
  ok(s.modal === 'anistia' && !s.ov, 'na abertura, o pedido de anistia aparece antes da sentença da Zona');
  ok(/6 faltas seguidas na Zona \(12\/10 a 17\/10\)/.test(s.txt) && /volta a 11/.test(s.txt), 'mostra as 6 faltas seguidas (12/10 a 17/10) e a sequência que volta (11)');
  ok(/2 prendas saem/.test(s.txt) && /40 ◆/.test(s.txt), 'as 2 prendas sorteadas e os 40 ◆ da multa');
  ok(/5 dias sem nada \(12\/10 a 16\/10\)/.test(s.txt) && /a chama segue com 16 dias/.test(s.txt), 'e os 5 dias parados da chama (hoje ainda vale), que segue com 16');
  ok(s.miss === 6 && s.open === 2 && s.gout === 40 && s.seq === 0 && s.lost, 'por enquanto o estrago está todo no save: 6 faltas, 2 prendas, −40 ◆, sequência zerada, chama perdida');
  const gem0 = await p.evaluate(() => SYS.App.D.gem);
  await p.click('.modal [data-a="pzAnOk"]'); await run(p, 800);
  s = await st(p);
  const log = await p.evaluate(() => ['2026-10-12', '2026-10-17'].map(d => SYS.App.S.pz.log[d]).map(r => r.v + (r.an ? '+an' : '')).join(','));
  ok(log === 'rest+an,rest+an' && s.miss === 0 && s.rest === 6, 'aplicada: as faltas viram descanso marcado como anistia');
  ok(s.open === 0 && s.pens === 0 && !s.show && !s.ov, 'as prendas saem e a sentença some, sem tela da Zona por cima');
  const gem1 = await p.evaluate(() => SYS.App.D.gem);
  ok(s.gout === 0 && gem1 >= gem0 + 40, 'os 40 ◆ voltam para o saldo (' + gem0 + ' → ' + gem1 + ')');
  ok(s.seq === 11 && s.clean === 11, 'a sequência do Chamado volta a 11 (recontada pelo registro)');
  ok(!s.lost && s.streak === 16 && s.fz === 1, 'a chama fica protegida (16 dias) sem gastar o gelo do estoque');
  ok(s.flag === '2026-10-17' && s.an === 1, 'o registro guarda a anistia');
  ok(/Anistia aplicada/.test(await p.evaluate(() => document.getElementById('toasts').textContent)), 'com aviso na tela');
  await run(p, 2500);
  ok(await p.evaluate(() => { const k = Object.keys(window.__mock.db).find(k => /\/core$/.test(k)); return k && /"anistia":"2026-10-17"/.test(window.__mock.db[k]); }), 'e vai para a nuvem');
  await p.evaluate(() => { SYS.App.pzPresent(); }); await run(p, 300);
  ok(!(await st(p)).modal, 'vale uma vez só');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 2).join(' | '));
  await ctx.close();

  sec('"agora não", gelo gasto e prazo');
  ({ p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; }));
  await prime(p, true); await seed(p);
  await at(p, '2026-10-11T21:00:00', 2500);
  await at(p, '2026-10-13T08:00:00', 4000);   /* 12/10 parado: o gelo do estoque cobre a chama */
  s = await st(p);
  ok(s.fz === 0 && !s.lost && s.modal === 'anistia', 'um dia parado: o gelo cobre a chama, e mesmo assim o pedido aparece');
  ok(/1 gelo gasto volta/.test(s.txt), 'e promete devolver o gelo gasto');
  await p.click('.modal [data-a="pzAnLater"]'); await run(p, 600);
  s = await st(p);
  ok(!s.modal && s.ov === 'miss' && s.open === 1, '"agora não": a sentença normal da Zona aparece');
  await p.evaluate(() => { const A = SYS.App; A.pzHide(); A.ui.anLater = false; A.pzPresent(); }); await run(p, 300);
  ok((await st(p)).modal === 'anistia', 'na próxima abertura o pedido volta');
  await p.click('.modal [data-a="pzAnOk"]'); await run(p, 600);
  s = await st(p);
  ok(s.fz === 1 && s.open === 0 && s.seq === 11, 'aplicada: o gelo volta, a prenda sai, a sequência volta a 11');
  await ctx.close();

  ({ p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; }));
  await prime(p, true); await seed(p);
  await at(p, '2026-10-11T21:00:00', 2500);
  await at(p, '2026-11-01T20:00:00', 4000);
  s = await st(p);
  ok(!(s.modal === 'anistia' && s.mid === 'a1'), 'depois de 31/10 o pedido não aparece mais');
  ok(s.modal !== 'anistia' && s.open >= 1, 'e o de 21/10 não pega prenda de falta depois de 21/10');
  await ctx.close();

  sec('pedido de 21/10: só as prendas saem');
  ({ p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; }));
  await prime(p, true); await seed(p);
  await p.evaluate(() => { const A = SYS.App; A.S.flags.anistia = '2026-10-17'; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); });
  await at(p, '2026-10-11T21:00:00', 2500);
  await at(p, '2026-10-14T21:00:00', 4000);
  await p.evaluate(() => { SYS.App.pzHide(); SYS.App.ui.modal = null; SYS.App.renderModal(); });
  s = await st(p);
  ok(s.open === 2 && s.modal !== 'anistia', 'antes de 21/10 o pedido novo não aparece, mesmo com 2 prendas abertas');
  await at(p, '2026-10-21T20:00:00', 4000);
  s = await st(p);
  const antes = { miss: s.miss, gout: s.gout, seq: s.seq, rest: s.rest };
  ok(s.modal === 'anistia' && s.mid === 'a2' && !s.ov && s.open === 3, 'em 21/10, com a anistia de 17/10 já usada, o pedido novo aparece antes da sentença (' + s.open + ' prendas)');
  ok(/ocupado na hora do chamado/.test(s.txt) && (s.txt.match(/sai da Zona/g) || []).length === 3 && /As faltas e a multa continuam/.test(s.txt), 'lista cada prenda e avisa que faltas e multa ficam');
  await p.click('.modal [data-a="pzAnOk"]'); await run(p, 800);
  s = await st(p);
  const refs = await p.evaluate(() => Object.keys(SYS.App.S.pz.log).filter(d => SYS.App.S.pz.log[d].p).length);
  ok(s.open === 0 && s.miss === antes.miss && s.gout === antes.gout && s.seq === antes.seq && s.rest === antes.rest && refs === 0, 'aplicado: as prendas saem; faltas, multa e sequência ficam como estavam');
  ok(await p.evaluate(() => SYS.App.S.flags.anistia2 === '2026-10-21' && SYS.App.S.pz.anistias.slice(-1)[0].so === 'prendas'), 'o registro guarda a anistia de 21/10');
  await p.evaluate(() => { SYS.App.pzHide(); SYS.App.ui.modal = null; SYS.App.renderModal(); });
  await at(p, '2026-10-23T21:00:00', 4000);
  s = await st(p);
  ok(s.mid !== 'a2' && s.open >= 1, 'vale uma vez: a falta de depois gera prenda normal');
  await ctx.close();

  ({ p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; }));
  await prime(p, true); await seed(p);
  await p.evaluate(() => { const A = SYS.App; A.S.flags.anistia = '2026-10-17'; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); });
  await at(p, '2026-10-11T21:00:00', 2500);
  await at(p, '2026-10-14T21:00:00', 4000);
  await p.evaluate(() => { SYS.App.pzHide(); SYS.App.ui.modal = null; SYS.App.renderModal(); });
  await at(p, '2026-11-05T20:00:00', 4000);
  s = await st(p);
  ok(s.mid !== 'a2' && s.open >= 2, 'depois de 04/11 o pedido de 21/10 não aparece mais');
  await ctx.close();

  sec('pedido de 09/11: Zona e Cidade do período, sem mexer na chama');
  ({ p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; }));
  await prime(p, true); await seed(p);
  await p.evaluate((days) => {
    const A = SYS.App, S = A.S, z = S.pz, need = S.settings.dailies.length, q = {};
    S.settings.dailies.forEach(k => { q[k] = 1; });
    days.forEach(d => { z.log[d] = {v: 'ok', a: 2}; z.tot.ok++; S.daily[d] = {q: Object.assign({}, q), need: need}; });
    z.seq += days.length; z.best = z.seq; z.clean = z.seq; z.last = days[days.length - 1];
    S.flags.anistia = '2026-10-17'; S.flags.anistia2 = '2026-10-21';
    SYS.Store.asAuto(() => A.commit(['core'], {quiet: true}));
  }, DAYS('2026-10-12', '2026-10-21'));
  await at(p, '2026-10-21T21:00:00', 2500);
  await p.evaluate(() => { const A = SYS.App; A.citySet(true); A.city.vis = {ivo: '2026-10-21'}; A.commit(['city'], {quiet: true}); });
  await run(p, 600);
  await at(p, '2026-10-23T12:00:00', 3000);
  await p.evaluate(() => {
    const A = SYS.App, E = SYS.E, C = A.city, S = A.S, now = Date.now(); C.lic.r = 'C';
    C.portals.push({id: 'qx1', n: 'Portal Quebrado', d: 'piscinas', way: 'aesthetic', rua: 1, r: 'C', st: 'open', born: new Date(now - 4 * 864e5).toISOString(), due: new Date(now - 36e5).toISOString(), in: new Date(now - 2 * 864e5).toISOString(), mods: [], crit: ['a']});
    E.cyExpire(C, S, now); E.cyMaldAdd(C, S, 'posseiro', {});
    A.pzHide(); A.ui.modal = null; A.renderModal(); A.commit(['city'], {quiet: true});
  });
  r = await p.evaluate(() => ({ corr: SYS.App.city.dist.piscinas.corr, mald: SYS.E.cyMald(SYS.App.city).length, eco: SYS.App.city.ecos.filter(e => e.st === 'partido').length }));
  ok(r.corr === 1 && r.mald === 1 && r.eco === 1, 'antes: a quebra de 23/10 corrompeu as Piscinas, deixou um Eco Partido, e o Posseiro está ativo');
  await at(p, '2026-11-09T20:00:00', 4000);
  s = await st(p);
  const g0 = s.gout, chama0 = await p.evaluate(() => JSON.stringify([SYS.App.S.streakLost, SYS.App.S.daily['2026-10-25'] || null]));
  ok(s.modal === 'anistia' && s.mid === 'a3' && !s.ov, 'em 09/11, com as anistias de outubro já usadas, o pedido novo aparece antes da sentença');
  ok(/fora de operação até agora/.test(s.txt) && /19 faltas na Zona entre 22\/10 e 09\/11/.test(s.txt) && /3 prendas saem/.test(s.txt) && /◆ de multa do período/.test(s.txt), 'mostra as 19 faltas do período, as 3 prendas e a multa');
  ok(/Corrupção volta/.test(s.txt) && /Piscinas 1 → 0/.test(s.txt) && /1 maldição acaba/.test(s.txt) && /Quebras do período perdoadas/.test(s.txt), 'e a Cidade: corrupção de volta, a maldição e o que a quebra deixou');
  const gemA = await p.evaluate(() => SYS.App.D.gem);
  await p.click('.modal [data-a="pzAnOk"]'); await run(p, 800);
  s = await st(p);
  r = await p.evaluate(() => { const A = SYS.App, C = A.city, z = A.S.pz; return {
    rest: Object.keys(z.log).filter(d => d >= '2026-10-22' && d <= '2026-11-09' && z.log[d].v === 'rest' && z.log[d].an).length,
    corr: C.dist.piscinas.corr, mald: SYS.E.cyMald(C).length, posse: C.portals.filter(p => p.posse).length, eco: C.ecos.filter(e => e.st === 'partido').length,
    qb: (C.quebras || []).filter(q => q.perdoada).length, log: C.log.some(l => l.k === 'anistia'), flag: A.S.flags.anistia3, an: z.anistias.slice(-1)[0].so,
    chama: JSON.stringify([A.S.streakLost, A.S.daily['2026-10-25'] || null]) }; });
  const gemB = await p.evaluate(() => SYS.App.D.gem);
  ok(r.rest === 19 && s.open === 0 && s.seq === 21 && !s.show, 'aplicado: as 19 faltas viram descanso, as prendas saem e a sequência volta a 21');
  ok(s.gout < g0 && gemB - gemA === g0 - s.gout, 'a multa do período volta para o saldo (+' + (g0 - s.gout) + ' ◆)');
  ok(r.corr === 0 && r.mald === 0 && r.posse === 0 && r.eco === 0 && r.qb === 1 && r.log, 'Cidade: Piscinas limpas, maldição e portal do Posseiro fora, Eco Partido fora, quebra perdoada, celular avisa');
  ok(r.chama === chama0 && r.flag === '2026-11-09' && r.an === 'periodo', 'a chama fica como estava; o registro guarda a anistia de 09/11');
  await ctx.close();

  sec('pedido de 15/11: Zona zerada e sem veredito na véspera da jornada');
  ({ p, ctx } = await open(b, '2026-11-12T08:00:00', () => { window.__anistia = 1; }));
  await prime(p, true);
  await p.evaluate(() => {
    const A = SYS.App, z = A.S.pz; z.on = true; z.since = '2026-11-01'; z.intro = 1; z.dias = [0, 1, 2, 3, 4, 5, 6];
    ['2026-11-12', '2026-11-13'].forEach(d => { z.log[d] = {v: 'ok', a: 2}; z.tot.ok++; });
    z.log['2026-11-14'] = {v: 'miss', a: 0, p: 'pzX'}; z.tot.miss = (z.tot.miss || 0) + 1; z.seq = 0;
    z.pens.push({id: 'pzX', k: 'treino', d: '2026-11-14', f: '2026-11-14', at: new Date().toISOString(), st: 'open', due: '2026-11-17'});
    A.S.flags.anistia = '2026-10-17'; A.S.flags.anistia2 = '2026-10-21'; A.S.flags.anistia3 = '2026-11-09';
    SYS.Store.asAuto(() => A.commit(['core'], {quiet: true}));
  });
  await at(p, '2026-11-15T10:30:00', 4000);
  s = await st(p);
  ok(s.modal === 'anistia' && s.mid === 'a4' && /a jornada começa em 16\/11/.test(s.txt) && /faltas? na Zona entre 09\/11 e 15\/11/.test(s.txt) && /prendas? sa/.test(s.txt) && /Sem veredito hoje/.test(s.txt), 'em 15/11 o pedido novo mostra as faltas desde 09/11, as prendas e o dia sem veredito');
  await p.click('.modal [data-a="pzAnOk"]'); await run(p, 800);
  s = await st(p);
  r = await p.evaluate(() => { const A = SYS.App, E = SYS.E, S = A.S, z = S.pz; return { v14: z.log['2026-11-14'].v, pausa: z.pause, hoje: E.pzArmed(S, '2026-11-15'), amanha: E.pzArmed(S, '2026-11-16'), flag: S.flags.anistia4 }; });
  ok(r.v14 === 'rest' && s.open === 0 && !s.show, 'aplicado: a falta de 14/11 vira descanso e a prenda sai');
  ok(r.pausa === '2026-11-15' && !r.hoje && r.amanha && r.flag === '2026-11-15', 'a Zona descansa hoje e o Chamado volta em 16/11');
  await at(p, '2026-11-15T21:00:00', 2500);
  s = await st(p);
  ok(s.open === 0 && !s.show && !(await p.evaluate(() => SYS.App.S.pz.log['2026-11-15'] && SYS.App.S.pz.log['2026-11-15'].v === 'miss')), 'à noite não sai veredito nem prenda');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 2).join(' | '));
  await ctx.close();

  sec('banca: o Examinador julga o pedido da tela');
  ({ p, ctx } = await open(b, '2026-10-21T08:00:00'));
  await prime(p, true);
  const pid = await p.evaluate(() => {
    const A = SYS.App, z = A.S.pz; z.on = true; z.since = '2026-10-21'; z.dias = [0, 1, 2, 3, 4, 5, 6];
    const pen = {id: 'pzBanca', k: 'banca', d: '2026-10-20', f: '2026-10-20', at: new Date().toISOString(), st: 'open', src: 'table', body: {node: 'A01'}, due: '2026-10-24'};
    z.pens.push(pen); A.sampleOff = false;
    A.sample = {json: (prompt) => { window.__prompt = prompt; return Promise.resolve({nota: 74, veredito: 'APROVADO', resumo: 'Claro e com exemplo.', acertos: [], lacunas: [], erros: [], falha: 'ok', perguntas: [], proximo_passo: '', alem: false}); }};
    SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); location.hash = '#/zona'; return pen.id;
  });
  await run(p, 800);
  const tela = await p.evaluate((id) => { const c = document.getElementById('pen-' + id); return c ? c.textContent : ''; }, pid);
  ok(/alguém inteligente de fora da área/.test(tela) && /O Examinador avalia só este resumo/.test(tela) && /KNOW/.test(tela) && /DECIDE/.test(tela) && /FAIL/.test(tela) && /TEACH/.test(tela) && /Não cobra a missão/.test(tela), 'com o Examinador ligado, a tela mostra os 4 critérios e o que não é cobrado');
  await p.fill('#pen-' + pid + ' textarea', 'Enquadrar o problema é descrever o que dói e o resultado que se quer antes de escolher qualquer solução. '.repeat(6));
  await p.click('#pen-' + pid + ' [data-a="pzGrade"]'); await run(p, 600);
  const pr = await p.evaluate(() => window.__prompt || '');
  ok(pr.indexOf('alguém inteligente de fora da área') > 0 && /CAPÍTULO: A01/.test(pr) && /TÓPICOS DO CAPÍTULO/.test(pr), 'o prompt leva o pedido da tela e o capítulo como referência');
  ok(!/dono de pousada/.test(pr) && !/MISSÃO PRÁTICA/.test(pr) && !/ENTREGÁVEL:/.test(pr) && !/TÉCNICAS E FERRAMENTAS/.test(pr), 'sem o teach-back próprio do capítulo, a missão, o entregável e a lista de ferramentas');
  ok(await p.evaluate((id) => SYS.App.pzPen(id).st === 'paid', pid), 'nota 74: a prenda fecha');
  await ctx.close();
  await L.done(b);
})();
