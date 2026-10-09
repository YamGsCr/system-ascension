/* Build em blocos: a página publicada carrega os blocos de js/ na ordem e monta igual à versão de arquivo único */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const SRC = path.join(__dirname, '..', 'src');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  console.log('\n— arquivos —');
  const man = JSON.parse(fs.readFileSync(path.join(DIST, 'manifest.json'), 'utf8'));
  const page = fs.readFileSync(path.join(DIST, man.page), 'utf8');
  const srcs = fs.readdirSync(SRC).filter(f => f.endsWith('.js')).sort();
  const listed = man.chunks.reduce((a, c) => a.concat(c.src), []);
  ok(JSON.stringify(listed) === JSON.stringify(srcs), 'todo arquivo de src/ entra em exatamente um bloco, na ordem de antes (' + srcs.length + ' arquivos, ' + man.chunks.length + ' blocos)');
  const tags = (page.match(/<script src="([^"]+)"><\/script>/g) || []).map(t => t.match(/src="([^"]+)"/)[1]);
  ok(JSON.stringify(tags) === JSON.stringify(man.chunks.map(c => c.file)), 'a página chama os blocos na ordem do manifest');
  ok(tags.every(t => /^js\/[a-z]+\.[0-9a-f]{10}\.js$/.test(t) && fs.existsSync(path.join(DIST, t))), 'todo bloco chamado existe, com caminho relativo e hash no nome');
  ok(Buffer.byteLength(page) < 200000, 'a página em si ficou leve: ' + Math.round(Buffer.byteLength(page) / 1024) + ' KB (o código mora nos blocos)');
  ok(man.chunks.every(c => fs.readFileSync(path.join(DIST, c.file), 'utf8').startsWith('"use strict";')), 'cada bloco começa com "use strict", como o script único de antes');
  ok(!/<script>[\s\S]{2000,}<\/script>/.test(page), 'nenhum script grande embutido na página');

  const b = await chromium.launch();
  async function open(file, hash){
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage(); p.errs = []; p.bad = [];
    p.on('pageerror', e => p.errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME_NOT|fonts\.g/.test(m.text())) p.errs.push('console: ' + m.text().slice(0, 200)); });
    p.on('requestfailed', r => { if (!/fonts\.g/.test(r.url())) p.bad.push(r.url().split('/').pop() + ' ' + (r.failure() || {}).errorText); });
    await p.clock.install({ time: new Date('2026-10-14T10:00:00') });
    await p.goto('file://' + path.join(DIST, file) + (hash || '')); await p.clock.runFor(2000); await sleep(100);
    return { p, ctx };
  }
  const surface = p => p.evaluate(() => {
    const k = o => Object.keys(o || {}).sort().join(',');
    return { sys: k(SYS), app: k(SYS.App), e: k(SYS.E), u: k(SYS.U), store: k(SYS.Store), A: k(SYS.App.A), V: k(SYS.App.V), routes: SYS.App.ROUTES.join(','), boot: !!SYS.bootOk };
  });
  const sweep = async p => {
    const routes = await p.evaluate(() => SYS.App.ROUTES.slice());
    const out = {};
    for (const r of routes) {
      await p.evaluate(r => { location.hash = '#/' + r; }, r); await p.clock.runFor(300); await sleep(30);
      out[r] = await p.evaluate(() => { const v = document.getElementById('view'); return { err: /Erro do Sistema/.test(v.innerHTML), len: v.innerHTML.length, acts: Array.from(v.querySelectorAll('[data-a]')).map(e => e.getAttribute('data-a')).sort().join(',') }; });
    }
    return out;
  };

  console.log('\n— a página em blocos monta igual à de arquivo único —');
  const A = await open('test.html'), B = await open('single/test.html');
  ok(A.p.bad.length === 0, 'nenhum arquivo do app falhou ao carregar ' + A.p.bad.slice(0, 3).join(' | '));
  const sa = await surface(A.p), sb = await surface(B.p);
  ok(sa.boot && sb.boot, 'o último bloco carregou nas duas versões');
  ['sys', 'app', 'e', 'u', 'store', 'A', 'V', 'routes'].forEach(k => ok(sa[k] === sb[k], 'mesma superfície em ' + k + ' (' + sa[k].split(',').length + ' nomes)'));
  const wa = await sweep(A.p), wb = await sweep(B.p);
  const rs = Object.keys(wa);
  ok(rs.length >= 15, 'varreu ' + rs.length + ' telas');
  ok(rs.every(r => !wa[r].err && wa[r].len > 200), 'nenhuma tela com erro na versão em blocos ' + rs.filter(r => wa[r].err || wa[r].len <= 200).join(','));
  ok(rs.every(r => wb[r] && wa[r].acts === wb[r].acts), 'as mesmas ações em cada tela nas duas versões ' + rs.filter(r => !wb[r] || wa[r].acts !== wb[r].acts).join(','));
  ok(A.p.errs.length === 0 && B.p.errs.length === 0, 'sem erro de JS ' + A.p.errs.concat(B.p.errs).slice(0, 3).join(' | '));
  await A.ctx.close(); await B.ctx.close();

  console.log('\n— publicação incompleta —');
  const test = fs.readFileSync(path.join(DIST, 'test.html'), 'utf8');
  const last = man.chunks[man.chunks.length - 1].file;
  fs.writeFileSync(path.join(DIST, '_quebrada.html'), test.replace(last, 'js/sumiu.0000000000.js'));
  const C = await open('_quebrada.html');
  const msg = await C.p.evaluate(() => document.getElementById('view').textContent);
  ok(/não carregaram/.test(msg), 'sem o último bloco, a página explica o que houve em vez de ficar em branco');
  await C.ctx.close();
  fs.unlinkSync(path.join(DIST, '_quebrada.html'));

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
