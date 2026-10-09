const { chromium } = require('playwright'); const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '../dist/test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
async function open(b, when, init, arg){
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  /* LAT=1: nuvem lenta (leitura 250 ms, gravação 300 ms, eco 700 ms, primeira resposta 400 ms) */
  if (process.env.LAT) await ctx.addInitScript(() => { window.__lat = { get: 250, set: 300, echo: 700, sub: 400 }; });
  if (init) await ctx.addInitScript(init, arg);
  const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push('pageerror: ' + e.message + ' @ ' + ((e.stack || '').split('\n')[1] || '').trim()));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts\.g/.test(m.text())) p.errs.push('console: ' + m.text().slice(0, 240)); });
  await p.clock.install({ time: new Date(when) });
  await p.goto(URL); await p.clock.runFor(1700);
  return { p, ctx };
}
/* depois de avançar o relógio simulado, cede um instante de tempo REAL: eventos do navegador (hashchange, layout) não obedecem ao relógio falso */
const real = ms => new Promise(r => setTimeout(r, ms));
const at = async (p, when, ms) => { await p.clock.setSystemTime(new Date(when)); await p.clock.runFor(ms || 1500); await real(20); };
const run = async (p, ms) => { await real(12); await p.clock.runFor(ms); await real(12); };
/* deixa o save "usado", sem animação, com o protocolo já apresentado */
const prime = async (p, intro) => { await p.evaluate((intro) => { const A = SYS.App; A.S.profile.name = 'Yam'; A.S.settings.motion = false; if (intro) A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'])); }, intro !== false); await run(p, 2600); };
const st = p => p.evaluate(() => { const A = SYS.App, z = A.S.pz, P = A.pzPhase(); return { ph: P.ph, v: P.v, a: P.a, need: P.need, seq: z.seq, best: z.best, clean: z.clean, ov: A.ui.pz ? A.ui.pz.k : null, step: A.ui.pz ? A.ui.pz.step : null, open: SYS.E.pzOpen(A.S).length, pens: z.pens.map(x => x.k + ':' + x.st), show: z.show ? z.show.t + ':' + z.show.n : null, gem: A.D.gem, tot: z.tot, since: z.since, last: z.last, rec: P.rec, day: P.day, gin: z.gin, gout: z.gout, truce: A.pzTruceLeft(), route: A.ui.route, pill: [].map.call(document.querySelectorAll('.pzpill'), e => e.textContent).join(' | '), toasts: document.getElementById('toasts').innerText }; });
/* uma ação real: marca mais um tópico estudado (igual a clicar no checkbox) */
const act = async (p, n) => { for (let i = 0; i < (n || 1); i++) { await p.evaluate(() => { const A = SYS.App, x = A.N.n.A01 = A.N.n.A01 || {}; x.st = x.st || []; x.st.push(x.st.length); SYS.Store.save(['notes']); }); await run(p, 400); } };
/* a troca de rota vem do evento hashchange, que o navegador entrega em tempo real (fora do relógio simulado) */
const routed = async (p, r) => { for (let i = 0; i < 60; i++) { if (await p.evaluate((r) => SYS.App.ui.route === r, r)) break; await new Promise(res => setTimeout(res, 50)); } await run(p, 300); };
const done = async (b) => { console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ==='); await b.close(); process.exit(fails ? 1 : 0); };
module.exports = { chromium, URL, ok, sec, open, at, run, prime, st, act, routed, done, fails: () => fails };
