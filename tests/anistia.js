/* anistia · o pedido de 17/10: faltas seguidas da Zona viram descanso, prendas saem, multa da sentença volta,
   a chama fica protegida sem gastar gelo; uma vez só, até 31/10, e "agora não" deixa para a próxima abertura */
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
const st = p => p.evaluate(() => { const A = SYS.App, S = A.S, z = S.pz, m = document.querySelector('.modal .win'); return { modal: A.ui.modal && A.ui.modal.type, txt: m ? m.textContent : '', ov: A.ui.pz ? A.ui.pz.k : null, open: SYS.E.pzOpen(S).length, pens: z.pens.length, gout: z.gout || 0, seq: z.seq, clean: z.clean, miss: z.tot.miss, rest: z.tot.rest, show: !!z.show, lost: !!S.streakLost, fz: S.owned.freezes, streak: A.D.streak, flag: S.flags.anistia || '', an: (z.anistias || []).length }; });

(async () => {
  const b = await L.chromium.launch();
  let { p, ctx } = await open(b, '2026-10-01T08:00:00', () => { window.__anistia = 1; });
  await prime(p, true); await seed(p);
  await at(p, '2026-10-11T21:00:00', 2500);
  let s = await st(p);
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
  ok((await st(p)).modal !== 'anistia', 'depois de 31/10 o pedido não aparece mais');
  await ctx.close();
  await L.done(b);
})();
