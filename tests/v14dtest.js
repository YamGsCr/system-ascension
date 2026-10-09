/* v14d · contagem de ações à prova de truque e de poda, último aviso, relógio, dobro remarcado, selo vencido, virada do dia, bônus */
const L = require('./v14lib.js'); const { ok, sec, open, at, run, prime, st, act } = L;
const esc = async (p) => { await p.keyboard.press('Escape'); await run(p, 500); };
const toasts = p => p.evaluate(() => document.getElementById('toasts').innerText);
const rootTxt = p => p.evaluate(() => (document.getElementById('pzroot') || {innerText:''}).innerText);
const clearToasts = p => p.evaluate(() => { document.getElementById('toasts').innerHTML = ''; });
const zona = async (p) => { await p.evaluate(() => { location.hash = '#/status'; }); await run(p, 200); await p.evaluate(() => { location.hash = '#/zona'; }); await run(p, 400); };
const chg = (p, sel, v) => p.evaluate(({sel, v}) => { const el = document.querySelector(sel); if (!el) throw new Error('sem elemento ' + sel); if (el.type === 'checkbox') el.checked = v; else el.value = v; el.dispatchEvent(new Event('change', {bubbles:true})); }, {sel, v});
const inject = (p, kinds, extra) => p.evaluate(({kinds, extra}) => { const A = SYS.App, z = A.S.pz, d = A.pzClock().day; const ids = kinds.map(k => 'pz_' + k); z.pens = z.pens.filter(x => x.st !== 'open' && ids.indexOf(x.id) < 0);
  kinds.forEach(k => { const body = Object.assign(A.pzBody(k, d), (extra || {})[k] || {}); z.pens.push({id:'pz_' + k, k:k, d:d, f:d, at:new Date().toISOString(), st:'open', src:'table', body:body, due:k === 'selo' ? body.night : k === 'dobro' ? body.day : SYS.U.addDays(d, SYS.E.pzKind(k).due)}); });
  z.show = null; A.pzHide(); SYS.Store.asAuto(() => A.commit(['core'])); }, {kinds, extra});
const pen = (p, id) => p.evaluate((id) => { const x = SYS.App.pzPen(id); return x ? { st: x.st, over: x.over, body: x.body, due: x.due, ev: x.ev } : null; }, id);

(async () => {
  const b = await L.chromium.launch();
  let { p } = await open(b, '2026-10-05T10:00:00');
  await prime(p, true);

  sec('1 · desmarcar e marcar de novo não é ação');
  await at(p, '2026-10-05T17:25:00'); await esc(p);
  await p.evaluate(() => { SYS.App.S.pz.min = 3; SYS.Store.asAuto(() => SYS.App.commit(['core'])); location.hash = '#/status'; }); await run(p, 500);
  await p.click('[data-a="dailyToggle"] >> nth=0'); await run(p, 400);
  let s = await st(p); ok(s.a === 1, 'fechou uma diária na janela: 1 ação');
  await p.click('[data-a="dailyToggle"] >> nth=0'); await run(p, 400);
  await p.click('[data-a="dailyToggle"] >> nth=0'); await run(p, 400);
  s = await st(p); ok(s.a === 1, 'desmarcou e marcou a mesma diária: continua 1 (' + s.a + ')');
  await p.evaluate(() => { const A = SYS.App, x = A.N.n.A01 = A.N.n.A01 || {}; x.st = [0]; SYS.Store.save(['notes']); }); await run(p, 400);
  await p.evaluate(() => { SYS.App.N.n.A01.st = []; SYS.Store.save(['notes']); }); await run(p, 300);
  await p.evaluate(() => { SYS.App.N.n.A01.st = [0]; SYS.Store.save(['notes']); }); await run(p, 400);
  s = await st(p); ok(s.a === 2 && !s.v, 'tópico marcado, desmarcado e marcado: vale uma vez só (' + s.a + ' de 3)');
  await p.click('[data-a="dailyToggle"] >> nth=1'); await run(p, 600);
  s = await st(p); ok(s.a === 3 && s.v === 'ok', 'uma diária diferente conta: 3 de 3, janela cumprida');

  sec('2 · poda de diárias antigas não apaga a ação do dia');
  await at(p, '2026-10-06T17:25:00'); await esc(p);
  await p.evaluate(() => { const A = SYS.App, S = A.S; S.pz.min = 1; for (let i = 1; i <= 400; i++) { const d = SYS.U.addDays('2026-10-05', -i); S.daily[d] = { q: { a1: null, a2: null, a3: null, a4: null }, need: 4 }; } delete S.daily['2026-10-06']; SYS.Store.asAuto(() => A.commit(['core'])); location.hash = '#/missoes'; }); await run(p, 600);
  const d0 = await p.evaluate(() => { const k = Object.keys(SYS.App.S.daily).sort(); return { n: k.length, first: k[0], hoje: !!SYS.App.S.daily['2026-10-06'] }; });
  await p.evaluate(() => { location.hash = '#/status'; }); await run(p, 400);
  await p.click('[data-a="dailyToggle"] >> nth=0'); await run(p, 600);
  s = await st(p); const d1 = await p.evaluate(() => { const k = Object.keys(SYS.App.S.daily).sort(); return { n: k.length, first: k[0], hoje: !!SYS.App.S.daily['2026-10-06'] }; });
  ok(d0.n === 400 && !d0.hoje && d1.n === 400 && d1.hoje && d1.first > d0.first, 'o save estava no limite de 400 dias; o clique criou o dia de hoje e podou o mais antigo (' + d0.first + ' → ' + d1.first + ')');
  ok(s.a === 1 && s.v === 'ok', 'a diária fechada contou como ação mesmo com a poda (ações ' + s.a + ')');

  sec('3 · último aviso a 15 minutos do fim');
  await at(p, '2026-10-07T17:21:00'); await esc(p); await clearToasts(p);
  await at(p, '2026-10-07T18:14:00'); ok(!/Último aviso/i.test(await toasts(p)), '18:14: ainda quieto');
  await at(p, '2026-10-07T18:15:05', 2500);
  let t = await toasts(p); s = await st(p);
  ok(/Último aviso · 15 min/i.test(t) && /Ações na janela: 0\/1/.test(t) && s.rec.w === 1 && !s.ov, '18:15 com a janela vazia: aviso no canto (' + (t.split('\n')[0] || '') + ')');
  await clearToasts(p); await at(p, '2026-10-07T18:20:00', 2500);
  ok(!/Último aviso/i.test(await toasts(p)), 'uma vez só');
  await act(p, 1); await run(p, 500);
  await at(p, '2026-10-08T18:20:00', 2500);
  s = await st(p); ok(s.ov === 'call' && s.rec.w === 1 && /minutos|fechando/i.test(await rootTxt(p)), 'abriu o Sistema já no fim da janela: o próprio chamado avisa (' + (await p.evaluate(() => document.querySelector('#pzroot .pzline').textContent)) + ')');
  await esc(p); await act(p, 1); await run(p, 400);

  sec('4 · relógio do dia do Sistema');
  await at(p, '2026-10-09T02:00:00', 2500);
  let c = await p.evaluate(() => SYS.App.pzClock());
  ok(c.day === '2026-10-08' && c.min === 26 * 60, '02:00 da madrugada ainda é o dia 08 do Sistema (minuto ' + c.min + ')');
  s = await st(p); ok(s.ph === 'pos' && s.rec.v === 'ok', 'e o veredito do dia 08 continua valendo');
  await esc(p);
  await at(p, '2026-10-09T08:00:05', 2500);
  c = await p.evaluate(() => SYS.App.pzClock()); s = await st(p);
  ok(c.day === '2026-10-09' && c.min === 480 && s.ph === 'pre' && s.last === '2026-10-08', '08:00: virou o dia 09, fase "antes do portão", ontem fechado');
  ok(s.tot.ok === 4 && s.tot.miss === 0 && s.seq === 4, 'nenhum dia julgado duas vezes: 4 cumpridas, 0 faltas, sequência 4');
  ok(/Portão hoje às 17:20/i.test(await toasts(p)) && /Ontem: janela cumprida/.test(await toasts(p)), 'briefing da manhã na virada');

  sec('5 · bônus de sequência');
  s = await st(p);
  ok(s.gin === 5 * 4 + 10, 'três janelas seguidas renderam +10 ◆ de bônus (total do protocolo: ' + s.gin + ' ◆)');

  sec('6 · reset do dia não atropela a janela');
  await zona(p);
  await chg(p, '#pzset input[data-k="ini"]', '09:30'); await run(p, 300);
  ok((await p.evaluate(() => SYS.App.S.pz.ini)) === '09:30', 'janela movida para 09:30 (reset às 08:00)');
  await p.evaluate(() => { location.hash = '#/perfil'; }); await run(p, 400);
  await chg(p, 'select[data-c="pReset"]', '10'); await run(p, 300);
  ok((await p.evaluate(() => SYS.App.S.settings.resetHour)) === 8 && /Reset depois do portão/i.test(await toasts(p)), 'reset às 10:00 é recusado: o portão abre às 09:30');
  await chg(p, 'select[data-c="pReset"]', '6'); await run(p, 300);
  ok((await p.evaluate(() => SYS.App.S.settings.resetHour)) === 6, 'reset às 06:00 entra');
  await chg(p, 'select[data-c="pReset"]', '8'); await run(p, 300);
  await zona(p); await chg(p, '#pzset input[data-k="ini"]', '17:20'); await run(p, 300);
  ok((await p.evaluate(() => SYS.App.S.pz.ini)) === '17:20', 'janela de volta para 17:20');

  sec('7 · janela dobrada remarcada por trégua');
  await inject(p, ['dobro']); await run(p, 400);
  ok((await pen(p, 'pz_dobro')).body.day === '2026-10-09', 'dobro marcado para hoje');
  await zona(p); await p.click('#view [data-a="pzTruce"]'); await run(p, 800);
  s = await st(p); let x = await pen(p, 'pz_dobro');
  ok(s.rec.v === 'rest' && x.st === 'open' && x.body.day === '2026-10-10' && x.due === '2026-10-10', 'trégua hoje: a prenda não some, vai para a janela de amanhã (' + x.body.day + ')');
  await at(p, '2026-10-10T17:25:00'); await esc(p);
  s = await st(p); ok(s.need === 2, 'amanhã o mínimo é 2');
  await act(p, 1); await run(p, 400);
  await at(p, '2026-10-10T19:30:05', 2500);
  s = await st(p); x = await pen(p, 'pz_dobro'); t = await rootTxt(p);
  ok(s.ov === 'miss' && x.st === 'failed', 'uma ação só na janela dobrada: falta, e a prenda vira multa');
  ok(/multa: −15/i.test(t) && s.open === 1, 'bronca mostra a multa do dobro (−15 ◆) e sorteia outra prenda');
  await esc(p);
  await p.evaluate(() => { SYS.App.S.pz.pens = SYS.App.S.pz.pens.filter(q => q.st !== 'open'); SYS.Store.asAuto(() => SYS.App.commit(['core'])); }); await run(p, 400);

  sec('8 · janela dobrada remarcada por pausa');
  await at(p, '2026-10-11T09:00:00', 2500);
  await inject(p, ['dobro']); await run(p, 400);
  await zona(p); await chg(p, '#pzset input[data-c="pzPause"]', '2026-10-13'); await run(p, 800);
  x = await pen(p, 'pz_dobro'); ok(x.body.day === '2026-10-14', 'pausa até dia 13: o dobro espera a primeira janela armada (' + x.body.day + ')');
  await at(p, '2026-10-14T17:25:00', 2500); await esc(p); await act(p, 2); await run(p, 800);
  x = await pen(p, 'pz_dobro'); s = await st(p);
  ok(x.st === 'paid' && s.v === 'ok' && s.tot.miss === 1, 'voltou da pausa e cumpriu em dobro: quitada, sem falta nos dias pausados');

  sec('9 · noite selada sem confirmação');
  await at(p, '2026-10-15T09:00:00', 2500);
  await inject(p, ['selo'], { selo: { night: '2026-10-15' } }); await run(p, 400);
  for (const d of ['15', '16', '17']) { await at(p, '2026-10-' + d + 'T17:25:00', 2500); await esc(p); await act(p, 1); await run(p, 300); }
  x = await pen(p, 'pz_selo'); ok(x.st === 'open' && !x.over, 'dois dias depois da noite: ainda dá para confirmar sem multa');
  const g0 = (await st(p)).gem;
  await at(p, '2026-10-18T09:00:00', 2500);
  x = await pen(p, 'pz_selo'); s = await st(p);
  ok(x.over === 1 && x.st === 'open' && g0 - s.gem === 10 && /Prenda vencida/i.test(await toasts(p)), 'no terceiro dia vence: multa de 10 ◆ e continua aberta');
  await zona(p);
  await p.click('#pen-pz_selo [data-a="pzSeal"][data-ok="1"]'); await run(p, 500);
  x = await pen(p, 'pz_selo'); s = await st(p);
  ok(x.st === 'paid' && s.tot.paid >= 1 && s.tot.exp === 1, 'confirmou atrasado: quita, mas fica registrada como vencida');
  ok(await p.evaluate(() => /fora do prazo/.test(document.getElementById('view').innerText)), 'histórico mostra "quitada fora do prazo"');

  sec('10 · chamado aberto aqui, janela cumprida em outro aparelho');
  await at(p, '2026-10-18T17:21:00', 2500);
  s = await st(p); ok(s.ov === 'call', 'chamado na tela');
  await p.evaluate(() => { const k = 'data/users/u_test/core', R = JSON.parse(window.__mock.db[k]); const r = R.pz.log['2026-10-18'] = R.pz.log['2026-10-18'] || {}; r.a = 2; r.v = 'ok'; R.pz.seq += 1; R.pz.tot.ok += 1; R._by = 'sOutroAparelho'; R._u = new Date(Date.now() + 3000).toISOString(); R._w = R._u; window.__mock.db[k] = JSON.stringify(R); (window.__mock.listeners[k] || []).forEach(fn => fn({ exists: true, data: () => JSON.parse(window.__mock.db[k]), metadata: { fromCache: false, hasPendingWrites: false } })); });
  await run(p, 800);
  s = await st(p); ok(!s.ov && s.v === 'ok' && /JANELA C/.test(s.pill), 'o chamado fecha sozinho e a pílula fica verde: "' + s.pill + '"');

  sec('11 · compra travada mesmo com o modal já aberto');
  await inject(p, ['marcha']); await run(p, 400);
  const r11 = await p.evaluate(() => { const A = SYS.App; A.ui.modal = { type: 'buy', way: 'architect', id: A.way('architect').shop[0].id, ok: true }; const own0 = JSON.stringify(A.S.owned); A.A.buyDo(); return { modal: A.ui.modal, same: JSON.stringify(A.S.owned) === own0, toast: document.getElementById('toasts').innerText }; });
  ok(!r11.modal && r11.same && /Loja selada/i.test(r11.toast), 'confirmar a compra com prenda aberta: recusado e nada muda');

  sec('12 · quitar prenda dentro da janela conta como ação; a faxina do histórico não desconta');
  const sizeA = await p.evaluate(() => { const z = SYS.App.S.pz; z.pens = z.pens.filter(q => q.st !== 'open'); for (let i = 0; i < 40; i++) z.pens.unshift({ id: 'old' + i, k: 'briefing', d: '2026-09-01', f: '2026-09-01', at: '2026-09-01T20:00:00.000Z', st: 'paid', paid: '2026-09-02T10:00:00.000Z', src: 'table', body: { w: 'founder', t: 'x', c: 'c'.repeat(700), q: 'q'.repeat(300) }, ev: { nota: 80, text: 't'.repeat(500), ai: 1 } }); z.tot.man = (z.tot.man || 0) + 40; const n = JSON.stringify(z).length; SYS.Store.asAuto(() => SYS.App.commit(['core'])); return n; });
  await run(p, 500);
  await at(p, '2026-10-19T17:25:00', 2500); await esc(p);
  await inject(p, ['marcha']); await run(p, 400); await zona(p);
  await p.click('#pen-pz_marcha input[data-k="ok"]'); await p.fill('#pen-pz_marcha input[data-k="obs"]', 'O ipê da esquina da padaria já está florindo de novo.'); await run(p, 900);
  s = await st(p); ok(s.a === 0, 'preencher a prenda ainda não é ação (' + s.a + ')');
  await p.click('#pen-pz_marcha [data-a="pzPay"]'); await run(p, 700);
  s = await st(p); ok(s.a === 2 && s.v === 'ok' && s.open === 0, 'quitou a Marcha dentro da janela: conta (ações ' + s.a + '), janela cumprida');
  await at(p, '2026-10-20T10:00:00', 2500);
  const pr = await p.evaluate(() => { const z = SYS.App.S.pz, cl = z.pens.filter(q => q.st !== 'open'); return { n: cl.length, slim: cl.filter(q => !q.body).length, full: cl.filter(q => q.body).length, size: JSON.stringify(z).length, man: z.tot.man }; });
  ok(pr.n === 30 && pr.full <= 8 && pr.slim >= 22, 'histórico de prendas enxugado: ' + pr.n + ' guardadas, só ' + pr.full + ' com conteúdo inteiro');
  ok(pr.size < sizeA / 3, 'o protocolo ocupa ' + Math.round(pr.size / 1024) + ' KB no save (antes da faxina: ' + Math.round(sizeA / 1024) + ' KB)');
  await at(p, '2026-10-20T17:25:00', 2500); await esc(p); await act(p, 1); await run(p, 500);
  s = await st(p); ok(s.a === 1 && s.v === 'ok', 'depois da faxina, uma ação continua contando como uma (' + s.a + ')');

  await run(p, 6000); ok((await p.evaluate(() => SYS.Store.status)) === 'synced' && !(await p.evaluate(() => SYS.Store.DOCS.some(d => SYS.Store.pending[d] || SYS.Store.writing[d] || SYS.Store.checking[d]))), 'tudo gravado: indicador em "sincronizado", nada pendente');
  ok(p.errs.length === 0, 'zero erros de JS ' + p.errs.slice(0, 3).join(' | '));
  await L.done(b);
})();
