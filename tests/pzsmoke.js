const { chromium } = require('playwright'); const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
  const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message + ' @ ' + (e.stack || '').split('\n')[1]));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts\.g/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  await p.clock.install({ time: new Date('2026-10-07T16:00:00') });
  await p.goto('file://' + path.resolve(__dirname, '../dist/test.html')); await p.clock.runFor(1500);
  console.log('boot:', JSON.stringify(await p.evaluate(() => ({ u: SYS.App.S._u, pz: !!SYS.App.S.pz, settled: SYS.Store.settled(), go: !!SYS.App._pzGo, routes: SYS.App.ROUTES.indexOf('zona') >= 0 }))));
  await p.evaluate(() => { SYS.App.S.profile.name = 'Yam'; SYS.App.commit(['core']); });
  await p.clock.runFor(2500);
  console.log('após 1º save:', JSON.stringify(await p.evaluate(() => { const z = SYS.App.S.pz; return { since: z.since, intro: z.intro, ov: SYS.App.ui.pz && SYS.App.ui.pz.k, phase: SYS.App.pzPhase().ph, today: SYS.U.today() }; })));
  await p.screenshot({ path: 'shots/v14_intro.png' });
  console.log('erros:', errs.join('\n') || 'nenhum');
  await b.close();
})();
