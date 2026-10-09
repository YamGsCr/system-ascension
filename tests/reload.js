const { chromium } = require('playwright'); const path = require('path'); const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext(); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const url = 'file://' + path.join(__dirname, '..', 'dist', 'test_legacy.html');
  await p.goto(url); await sleep(600);
  await p.evaluate(() => { const A = SYS.App; A.S.nodes.M01 = {s:'done', d0:'2026-09-17', d1:'2026-09-17'}; A.N.n.M01 = {t:'nota teste'}; A.commit(['core','notes'], {quiet:true}); });
  await sleep(1800);
  const before = await p.evaluate(() => ({ writes: window.__mock.writes, st: SYS.Store.status }));
  await p.reload(); await sleep(1500);
  const after = await p.evaluate(() => ({ m01: SYS.App.S.nodes.M01, note: SYS.App.N.n.M01, st: SYS.Store.status, writes: window.__mock.writes, remote: Object.keys(window.__mock.db) }));
  console.log(JSON.stringify({before, after, errs}));
  await b.close();
})();
