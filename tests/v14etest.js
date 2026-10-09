/* v14e · consertos do motor achados na revisão: contagem por item, ajuste que arma o dia tarde, banca sem capítulo,
   prenda sob medida × rascunho, alcance da trégua, nada antes de a apresentação ser aceita */
const L = require('./v14lib.js'); const { ok, sec, open, at, run, prime, st } = L;
const esc = async (p) => { await p.keyboard.press('Escape'); await run(p, 500); };
const toasts = p => p.evaluate(() => document.getElementById('toasts').innerText);
const clearToasts = p => p.evaluate(() => { document.getElementById('toasts').innerHTML = ''; });
const zona = async (p) => { await p.evaluate(() => { location.hash = '#/status'; }); await run(p, 200); await p.evaluate(() => { location.hash = '#/zona'; }); await L.routed(p, 'zona'); await run(p, 400); };
const inject = (p, kinds, extra) => p.evaluate(({kinds, extra}) => { const A = SYS.App, z = A.S.pz, d = A.pzClock().day; const ids = kinds.map(k => 'pz_' + k); z.pens = z.pens.filter(x => x.st !== 'open' && ids.indexOf(x.id) < 0);
  kinds.forEach(k => { const body = Object.assign(A.pzBody(k, d), (extra || {})[k] || {}); z.pens.push({id:'pz_' + k, k:k, d:d, f:d, at:new Date().toISOString(), st:'open', src:'table', body:body, due:((extra || {})['due_' + k]) || (k === 'selo' ? body.night : k === 'dobro' ? body.day : SYS.U.addDays(d, SYS.E.pzKind(k).due))}); });
  z.show = null; A.pzHide(); SYS.Store.asAuto(() => A.commit(['core'])); }, {kinds, extra});
const pen = (p, id) => p.evaluate((id) => { const x = SYS.App.pzPen(id); return x ? { st: x.st, over: x.over, body: x.body, due: x.due, ev: x.ev, gen: x.gen, src: x.src, dr: x.dr } : null; }, id);
const z = p => p.evaluate(() => { const z = SYS.App.S.pz; return JSON.parse(JSON.stringify({ since: z.since, log: z.log, tot: z.tot, seq: z.seq, clean: z.clean, gin: z.gin, gout: z.gout, pens: z.pens.map(x => ({ id: x.id, k: x.k, st: x.st, over: x.over, day: x.body && x.body.day })), show: z.show, intro: z.intro, truce: z.truce, pause: z.pause, dias: z.dias, ini: z.ini })); });
const set = (p, code) => p.evaluate((code) => { const A = SYS.App, z = A.S.pz; (new Function('A', 'z', 'S', code))(A, z, A.S); SYS.Store.asAuto(() => A.commit(['core'])); }, code);
const errs = (p, t) => ok(p.errs.length === 0, 'sem erro de JS em "' + t + '" ' + p.errs.slice(0, 2).join(' | '));

(async () => {
  const b = await L.chromium.launch();
  let p, s, Z;

  /* ------------------------------------------------------------------ P6 */
  sec('P6 · antes de a apresentação ser aceita, nada é armado nem julgado');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, false);
  s = await st(p); Z = await z(p);
  ok(Z.intro === 0 && Z.since === '' && s.ov === 'intro', 'save usado, protocolo ligado, apresentação na tela e nada armado');
  await at(p, '2026-10-12T19:31:00', 5000);
  s = await st(p); Z = await z(p);
  ok(Z.since === '' && Z.tot.miss === 0 && Z.pens.length === 0 && !Z.show && Object.keys(Z.log).length === 0, '19:31 do mesmo dia: nenhuma falta, nenhuma prenda, nenhum registro');
  await at(p, '2026-10-13T18:00:00', 5000);
  Z = await z(p);
  ok(Z.since === '' && Z.tot.miss === 0 && Z.pens.length === 0, 'dia seguinte, 18:00, apresentação ainda não aceita: continua nada');
  s = await st(p);
  ok(s.ov === 'intro', 'a apresentação continua esperando');
  await p.evaluate(() => { SYS.App.pzIntroDone(); SYS.App.pzHide(); }); await run(p, 1200);
  s = await st(p); Z = await z(p);
  ok(Z.intro === 1 && Z.since === '2026-10-14' && s.ph === 'off', 'aceita às 18:00 (portão já aberto): a primeira janela é a de amanhã, hoje não vale');
  await at(p, '2026-10-13T19:31:00', 5000);
  Z = await z(p);
  ok(Z.tot.miss === 0 && Z.pens.length === 0, '19:31 do dia em que aceitou: sem falta');
  await at(p, '2026-10-14T19:31:00', 6000);
  s = await st(p); Z = await z(p);
  ok(Z.tot.miss === 1 && Z.pens.filter(x => x.st === 'open').length === 1 && s.ov === 'miss', 'no dia seguinte, janela vazia: aí sim, falta e prenda');
  errs(p, 'P6');
  await p.context().close();

  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, false);
  await p.evaluate(() => { SYS.App.pzIntroDone(); SYS.App.pzHide(); }); await run(p, 1200);
  Z = await z(p);
  ok(Z.since === '2026-10-12', 'aceita às 10:00 (antes do portão): a primeira janela é a de hoje');
  await p.context().close();

  /* ------------------------------------------------------------------ P2 */
  sec('P2 · ajuste que arma o dia de hoje com o portão já aberto: hoje não vale');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  Z = await z(p); ok(Z.since === '2026-10-12', 'armado desde hoje (' + Z.since + ')');
  await set(p, 'z.pause = "2026-10-13";');
  await at(p, '2026-10-12T18:00:00', 4000);
  s = await st(p); ok(s.ph === 'off' && !s.ov, '18:00 com pausa: dia desarmado, sem chamado');
  await clearToasts(p);
  await p.evaluate(() => SYS.App.A.pzPauseClear()); await run(p, 1500);
  s = await st(p); Z = await z(p);
  ok(Z.pause === '' && s.v === 'rest' && Z.log['2026-10-12'].g === 1, 'cancelou a pausa às 18:00: hoje fica como descanso (não teve a janela)');
  ok(/hoje n.o vale/i.test(await toasts(p)), 'e o aviso explica');
  ok(!s.ov, 'sem chamado para uma janela que já estava correndo');
  await at(p, '2026-10-12T19:31:00', 5000);
  s = await st(p); Z = await z(p);
  ok(Z.tot.miss === 0 && Z.pens.length === 0 && s.ov !== 'miss', '19:31: sem falta e sem prenda (antes: falta na hora)');
  ok(Z.tot.rest === 0 && Z.seq === 0, 'e não mexe em contador nenhum (descanso de cortesia não conta como descanso declarado)');

  await at(p, '2026-10-13T10:00:00', 4000);
  await set(p, 'z.dias = z.dias.filter(d => d !== 2);');           /* terça desarmada */
  await at(p, '2026-10-13T18:45:00', 4000);
  s = await st(p); ok(s.ph === 'off', 'terça desarmada, 18:45: nada rodando');
  await p.evaluate(() => SYS.App.A.pzDay({ getAttribute: () => '2' })); await run(p, 1500);
  s = await st(p); Z = await z(p);
  ok(Z.dias.indexOf(2) >= 0 && s.v === 'rest' && Z.log['2026-10-13'].g === 1, 'armou a terça às 18:45 (portão já fechado): hoje não vale');
  await at(p, '2026-10-13T19:31:00', 5000);
  Z = await z(p); ok(Z.tot.miss === 0 && Z.pens.length === 0, '19:31: sem falta');

  await at(p, '2026-10-14T10:00:00', 4000);
  await set(p, 'z.ini = "21:00"; z.fim = "22:00"; z.ver = "23:00";');
  await at(p, '2026-10-14T20:00:00', 4000);
  s = await st(p); ok(s.ph === 'pre', 'portão às 21:00; são 20:00: ainda não abriu');
  await p.evaluate(() => SYS.App.C.pzTime({ getAttribute: () => 'ini', value: '19:00' })); await run(p, 1500);
  s = await st(p); Z = await z(p);
  ok(Z.ini === '19:00' && s.v === 'rest' && Z.log['2026-10-14'].g === 1, 'puxou a abertura para 19:00 às 20:00: hoje não vale');
  await at(p, '2026-10-14T23:05:00', 5000);
  Z = await z(p); ok(Z.tot.miss === 0 && Z.pens.length === 0, 'veredito das 23:00: sem falta');

  /* controle: dia já armado e com o portão aberto NÃO ganha cortesia */
  await at(p, '2026-10-15T10:00:00', 4000);
  await set(p, 'z.ini = "17:20"; z.fim = "18:30"; z.ver = "19:30";');
  await at(p, '2026-10-15T17:40:00', 4000); await esc(p);
  await p.evaluate(() => SYS.App.A.pzMinSet({ getAttribute: () => '2' })); await run(p, 800);
  await p.evaluate(() => SYS.App.C.pzTol({ checked: true })); await run(p, 800);
  s = await st(p); ok(!s.v, 'mexer em mínimo/tolerância com o portão aberto não dá descanso de cortesia');
  await p.evaluate(() => SYS.App.C.pzTime({ getAttribute: () => 'fim', value: '19:00' })); await run(p, 800);
  Z = await z(p); ok(Z.log['2026-10-15'].v === undefined && /travado/i.test(await toasts(p)), 'e o relógio fica travado com o portão aberto');
  await at(p, '2026-10-15T19:31:00', 6000);
  Z = await z(p); ok(Z.tot.miss === 1, 'janela vazia nesse dia: falta normal');
  errs(p, 'P2');
  await p.context().close();

  /* ------------------------------------------------------------------ P5 */
  sec('P5 · a trégua devolve só o que a falta de HOJE custou');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  await set(p, 'z.gin = 200;');
  await inject(p, ['marcha'], { due_marcha: '2026-10-10' });       /* prenda antiga, que vence nesta varredura */
  const gem0 = (await st(p)).gem;
  await at(p, '2026-10-12T19:31:00', 6000);
  s = await st(p); Z = await z(p);
  const marcha = Z.pens.filter(x => x.id === 'pz_marcha')[0];
  ok(Z.tot.miss === 1 && s.ov === 'miss' && marcha.over === 1 && Z.gout === 10, 'falta de hoje + prenda antiga vencida na mesma varredura: multa de 10 ◆ pela vencida (gout ' + Z.gout + ')');
  ok(Z.show && Z.show.today && Z.show.fine === 10 && Z.show.undo && Z.show.undo.fine === 0, 'a sentença mostra a multa, mas a parte "de hoje" é zero');
  await p.evaluate(() => SYS.App.A.pzTruce()); await run(p, 1500);
  s = await st(p); Z = await z(p);
  ok(Z.log['2026-10-12'].v === 'rest' && Z.log['2026-10-12'].tr === 1 && Z.tot.miss === 0 && !Z.show, 'trégua: a falta de hoje sai');
  ok(Z.gout === 10 && s.gem === gem0 - 10, 'a multa da prenda vencida FICA (antes: a trégua devolvia junto) — gout ' + Z.gout);
  ok(Z.pens.filter(x => x.st === 'open').length === 1 && Z.pens.filter(x => x.id === 'pz_marcha')[0].over === 1, 'a prenda sorteada pela falta some; a antiga continua aberta e vencida');
  ok(Z.truce.n === 1, 'uma trégua gasta');
  errs(p, 'P5a');
  await p.context().close();

  sec('P5b · janela dobrada marcada para hoje + falta + trégua');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  await set(p, 'z.gin = 200; z.seq = 4; z.clean = 4; z.off.dobro = true;');
  await inject(p, ['dobro']);
  let d = await pen(p, 'pz_dobro');
  ok(d.body.day === '2026-10-12' && (await st(p)).need === 2, 'janela dobrada marcada para hoje: mínimo 2');
  await at(p, '2026-10-12T19:31:00', 6000);
  d = await pen(p, 'pz_dobro'); Z = await z(p);
  ok(d.st === 'failed' && Z.gout === 15 && Z.show.undo.fine === 15 && Z.show.undo.dobro.join() === 'pz_dobro', 'falta: a janela dobrada vira multa de 15 ◆, anotada como custo de hoje');
  ok(Z.seq === 0 && Z.show.lost === 4, 'sequência zerada (tinha 4)');
  await p.evaluate(() => SYS.App.A.pzTruce()); await run(p, 2000);
  d = await pen(p, 'pz_dobro'); Z = await z(p); s = await st(p);
  ok(d.st === 'open' && Z.gout === 0, 'trégua: a multa volta e a janela dobrada reabre');
  ok(d.body.day === '2026-10-13' && d.due === '2026-10-13', 'e é remarcada para a próxima janela (' + d.body.day + ')');
  ok(Z.seq === 4 && Z.clean === 4 && Z.tot.miss === 0, 'sequência devolvida');
  ok(Z.pens.filter(x => x.st === 'open').length === 1, 'só a janela dobrada continua aberta');
  errs(p, 'P5b');
  await p.context().close();

  sec('P5c · Zona lotada: a multa cheia de hoje volta com a trégua');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  await set(p, 'z.gin = 200;');
  await inject(p, ['marcha', 'leitura', 'autopsia']);
  await at(p, '2026-10-12T19:31:00', 6000);
  Z = await z(p);
  ok(Z.show && Z.show.full && Z.gout === 20 && Z.show.undo.fine === 20 && Z.pens.filter(x => x.st === 'open').length === 3, 'três prendas abertas: falta vira multa cheia de 20 ◆, sem prenda nova');
  await p.evaluate(() => SYS.App.A.pzTruce()); await run(p, 1500);
  Z = await z(p);
  ok(Z.gout === 0 && Z.tot.miss === 0 && Z.pens.filter(x => x.st === 'open').length === 3, 'trégua: multa devolvida, as três prendas antigas continuam');
  errs(p, 'P5c');
  await p.context().close();

  /* ------------------------------------------------------------------ P1 */
  sec('P1 · contagem por item: trocar um por outro conta, enxugar nota não desconta');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  await set(p, 'z.min = 5;');
  await p.evaluate(() => { const A = SYS.App; A.N.n.A01 = { st: [0, 1] }; A.N.n.A02 = { t: 'x'.repeat(800) }; SYS.Store.save(['notes']); }); await run(p, 600);
  await at(p, '2026-10-12T17:25:00', 4000); await esc(p);
  s = await st(p); ok(s.ph === 'janela' && s.a === 0, 'portão aberto, nada feito na janela ainda (o que foi feito de manhã não conta)');
  await p.evaluate(() => { SYS.App.N.n.A01.st = [1, 2]; SYS.Store.save(['notes']); }); await run(p, 600);
  s = await st(p); ok(s.a === 1, 'desmarcou um tópico antigo e marcou um NOVO no mesmo save: 1 ação (antes: zero, porque o total não mudava) — ' + s.a);
  await p.evaluate(() => { const n = SYS.App.N.n; n.A02.t = 'x'.repeat(100); n.A02.st = [0]; SYS.Store.save(['notes']); }); await run(p, 600);
  s = await st(p); ok(s.a === 2, 'enxugou uma nota e marcou um tópico: a ação conta (antes: a nota menor anulava) — ' + s.a);
  await p.evaluate(() => { SYS.App.N.n.A02.t = 'x'.repeat(800); SYS.Store.save(['notes']); }); await run(p, 600);
  s = await st(p); ok(s.a === 2, 'redigitar a nota até o tamanho que ela já teve hoje não é ação nova — ' + s.a);
  await p.evaluate(() => { SYS.App.N.n.A02.t = 'x'.repeat(2400); SYS.Store.save(['notes']); }); await run(p, 600);
  s = await st(p); ok(s.a === 5 && s.v === 'ok', 'texto novo de verdade conta, com teto de 3 por save: 2 + 3 = 5, janela cumprida — ' + s.a);
  await p.evaluate(() => { SYS.App.N.n.A01.st = [1]; SYS.Store.save(['notes']); }); await run(p, 400);
  await p.evaluate(() => { SYS.App.N.n.A01.st = [1, 2]; SYS.Store.save(['notes']); }); await run(p, 400);
  s = await st(p); ok(s.a === 5, 'desmarcar e marcar o mesmo tópico continua não contando — ' + s.a);
  errs(p, 'P1');
  await p.context().close();

  /* ------------------------------------------------------------------ P3 */
  sec('P3 · banca cujo capítulo não existe mais: dá para quitar');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  ok(await p.evaluate(() => SYS.App.pzAI()), 'Examinador disponível neste teste');
  await inject(p, ['banca'], { banca: { node: 'ZZ99' } });
  await zona(p);
  let card = await p.evaluate(() => { const c = document.getElementById('pen-pz_banca'); return c ? { txt: c.innerText, pay: !!c.querySelector('[data-a="pzPay"]'), grade: !!c.querySelector('[data-a="pzGrade"]'), crit: c.querySelectorAll('input[data-k="cr"]').length } : null; });
  ok(card && card.pay && !card.grade && card.crit === 4 && /n.o existe mais/i.test(card.txt), 'o cartão avisa que o capítulo sumiu e oferece a entrega com autoavaliação (4 critérios), não o Examinador');
  await p.click('#pen-pz_banca [data-a="pzPay"]'); await run(p, 500);
  d = await pen(p, 'pz_banca');
  ok(d.st === 'open' && /400 caracteres/.test(await p.evaluate(() => document.getElementById('pen-pz_banca').innerText)), 'sem texto, não quita: pede os 400 caracteres');
  await p.evaluate(() => { const A = SYS.App, x = A.pzPen('pz_banca'); A.pzDr(x).t = 'Explicação própria, com exemplo e modo de falha. '.repeat(10); A.pzDr(x).cr = [true, true, true, true]; SYS.Store.save(['core']); A.renderView(); }); await run(p, 500);
  await p.click('#pen-pz_banca [data-a="pzPay"]'); await run(p, 800);
  d = await pen(p, 'pz_banca');
  ok(d.st === 'paid' && d.ev && d.ev.text.length > 100, 'com texto e critérios conferidos, quita (antes: ficava presa para sempre, o Examinador não tinha capítulo para avaliar)');
  await inject(p, ['banca'], { banca: { node: '' } });
  await zona(p);
  card = await p.evaluate(() => { const c = document.getElementById('pen-pz_banca'); return c ? { pay: !!c.querySelector('[data-a="pzPay"]'), grade: !!c.querySelector('[data-a="pzGrade"]') } : null; });
  ok(card && card.pay && !card.grade, 'banca sem capítulo nenhum: mesma saída');
  errs(p, 'P3');
  await p.context().close();

  /* ------------------------------------------------------------------ P4 */
  sec('P4 · "sob medida" não passa por cima de quem já começou a escrever');
  ({ p } = await open(b, '2026-10-12T10:00:00'));
  await prime(p, true);
  await inject(p, ['briefing']);
  await zona(p);
  const body0 = (await pen(p, 'pz_briefing')).body;
  await p.evaluate(() => SYS.App.pzGen('pz_briefing', false)); await run(p, 100);
  ok(await p.evaluate(() => SYS.App.ui.pzBusy.pz_briefing === 'gen'), 'pediu a versão sob medida: redigindo…');
  await p.focus('#pen-pz_briefing textarea[data-k="t"]');
  await p.keyboard.type('Comecei a responder o cenario de reserva'); await run(p, 1500);
  d = await pen(p, 'pz_briefing');
  ok(d.gen === 1 && d.src === 'table' && JSON.stringify(d.body) === JSON.stringify(body0), 'a resposta chegou depois de a pessoa começar: o cenário de reserva continua');
  ok(d.dr && /Comecei a responder/.test(d.dr.t || ''), 'e o rascunho não foi apagado (antes: trocava o cenário e zerava o texto)');
  ok(/continua valendo/i.test(await p.evaluate(() => (document.getElementById('pen-pz_briefing') || { innerText: '' }).innerText + ' ' + JSON.stringify(SYS.App.ui.pzErr))), 'com aviso de que vale a de reserva');
  /* controle: sem ninguém escrevendo, a versão sob medida entra */
  await inject(p, ['treino']);
  await zona(p);
  await p.evaluate(() => { if (document.activeElement) document.activeElement.blur(); SYS.App.pzGen('pz_treino', false); }); await run(p, 1500);
  d = await pen(p, 'pz_treino');
  ok(d.gen === 1 && d.src === 'ai' && d.body.t === 'Circuito do Faltoso', 'controle: prenda intocada recebe a versão sob medida');
  errs(p, 'P4');
  await p.context().close();

  await L.done(b);
})();
