const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('ERR_TUNNEL')) errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack||'').split('\n').slice(0,3).join('\n')));
  await page.goto('file://' + path.join(__dirname, '..', 'dist', 'test_legacy.html'));
  await sleep(900);
  const S = () => page.evaluate(() => ({ nodes: Object.keys(SYS.App.S.nodes).length, done: SYS.App.D.nodesDone, ach: Object.keys(SYS.App.S.ach), lv: SYS.App.D.level, xp: SYS.App.D.xp, gem: SYS.App.D.gem, sync: SYS.Store.status, mode: SYS.Store.mode }));
  const log = (k, v) => console.log(k.padEnd(28), typeof v === 'string' ? v : JSON.stringify(v));
  log('initial', await S());
  // daily toggle
  await page.click('[data-a="dailyToggle"][data-id="focus"]'); await sleep(150);
  log('after daily', await page.evaluate(() => SYS.App.S.daily[SYS.U.today()]));
  // profile name
  await page.evaluate(() => location.hash = '#/perfil'); await sleep(150);
  await page.fill('[data-i="pName"]', 'Yam'); await page.dispatchEvent('[data-i="pName"]', 'change'); await sleep(150);
  log('name', await page.evaluate(() => SYS.App.S.profile.name));
  // node A01 flow
  await page.evaluate(() => location.hash = '#/caminhos/architect'); await sleep(200);
  await page.click('button.q[data-id="A01"]'); await sleep(350);
  await page.click('#drawer [data-a="setStatus"][data-s="doing"]'); await sleep(150);
  await page.click('#drawer [data-a="setStatus"][data-s="done"]'); await sleep(200);
  const checks = await page.$$('#modal [data-c="doneCheck"]');
  for (const c of checks) { await c.check(); }
  await sleep(100);
  await page.click('#modal [data-a="confirmDone"]'); await sleep(900);
  log('after A01', await S());
  log('toasts', await page.evaluate(() => [...document.querySelectorAll('#toasts .tt')].map(e => e.textContent)));
  // drawer tabs
  for (const t of ['estudar','onde','livros','exam','notas','missao']) { await page.click('#drawer [data-a="drTab"][data-tab="'+t+'"]'); await sleep(80); }
  // exam teach-back
  await page.click('#drawer [data-a="drTab"][data-tab="exam"]'); await sleep(100);
  await page.fill('#drawer [data-i="exText"]', 'Explicação longa '.repeat(20)); await sleep(50);
  await page.click('#drawer [data-a="exGrade"]'); await sleep(900);
  log('exam', await page.evaluate(() => ({ ex: SYS.App.S.exams, v: (document.querySelector('#drawer .verdict')||{}).textContent })));
  // grill mode
  await page.click('#drawer [data-a="exMode"][data-s="grill"]'); await sleep(80);
  await page.click('#drawer [data-a="exQs"]'); await sleep(700);
  const ans = await page.$$('#drawer [data-i="exAns"]');
  for (const a of ans) await a.fill('Resposta com bastante conteúdo para passar o mínimo exigido pelo examinador.');
  await page.click('#drawer [data-a="exGrade"]'); await sleep(900);
  log('grill', await page.evaluate(() => ({ ex: SYS.App.S.exams, qs: (SYS.App.X.s.A01||{}).qs })));
  await page.click('#drawer [data-a="closeAll"]'); await sleep(200);
  // mass-complete architect act1 nodes and claim gate
  await page.evaluate(() => { const A = SYS.App, E = SYS.E; const arc = E.ARC['architect:act1']; arc.nodes.forEach(n => { A.S.nodes[n.id] = {s:'done', d0:SYS.U.today(), d1:SYS.U.today()}; }); A.commit(['core']); });
  await sleep(600);
  log('after act1', await S());
  log('modal after lvl', await page.evaluate(() => SYS.App.ui.modal && SYS.App.ui.modal.type));
  await page.evaluate(() => SYS.App.A.closeModal()); await sleep(100);
  const gid = await page.evaluate(() => SYS.E.ARC['architect:act1'].gate.id);
  await page.evaluate(g => { location.hash = '#/portoes'; }, gid); await sleep(200);
  await page.click('[data-a="openGate"][data-id="'+gid+'"]'); await sleep(300);
  const nEv = (await page.$$('#modal [data-c="gateEv"]')).length;
  for (let i = 0; i < nEv; i++) { await page.locator('#modal [data-c="gateEv"]').nth(i).check(); await sleep(80); }
  await page.click('#modal [data-a="claimGate"]'); await sleep(700);
  log('gate claimed', await page.evaluate(g => SYS.App.S.gates[g], gid));
  log('modal after gate', await page.evaluate(() => SYS.App.ui.modal && SYS.App.ui.modal.type));
  await page.evaluate(() => SYS.App.A.closeModal()); await sleep(150);
  // gate exam drawer
  await page.click('[data-a="openGate"][data-id="'+gid+'"]'); await sleep(200);
  await page.click('#modal [data-a="examGate"]'); await sleep(300);
  log('exam drawer', await page.evaluate(() => document.querySelector('#drawer h2') && document.querySelector('#drawer h2').textContent));
  await page.evaluate(() => SYS.App.A.closeAll()); await sleep(100);
  await page.evaluate(() => SYS.App.A.closeAll()); await sleep(100);
  // shops
  await page.evaluate(() => location.hash = '#/lojas/architect'); await sleep(200);
  log('arch credits', await page.evaluate(() => SYS.App.D.wayCr.architect));
  const buyBtn = await page.$('[data-a="buyOpen"][data-way="architect"]');
  if (buyBtn) { await buyBtn.click(); await sleep(150); await page.check('#modal [data-c="buyOk"]'); await sleep(100); await page.click('#modal [data-a="buyDo"]'); await sleep(300); }
  log('buys', await page.evaluate(() => SYS.App.S.buys.map(b => b.id + ':' + b.c)));
  const cdBtn = await page.$('[data-a="cdStart"]');
  if (cdBtn) { await cdBtn.click(); await sleep(200); log('pending', await page.evaluate(() => SYS.App.S.pending.map(p => p.id))); await page.click('[data-a="cdCancel"]'); await sleep(300); }
  log('cd cancel', await page.evaluate(() => ({ st: SYS.App.S.stats, ach: !!SYS.App.S.ach.sys_cancel })));
  // gems via fake dailies, buy skin
  await page.evaluate(() => { const S = SYS.App.S, U = SYS.U; for (let i = 1; i <= 100; i++) { const d = U.addDays(U.today(), -i); S.daily[d] = {q:{focus:'architect', move:'aesthetic', read:'flaneur', sound:'ars', log:'mind'}, need:5}; } SYS.App.commit(['core']); });
  await sleep(400);
  await page.evaluate(() => SYS.App.A.closeAll()); await sleep(100);
  // cooldown path via a satisfiable cd item
  log('cd test', await page.evaluate(() => {
    const A = SYS.App, E = SYS.E; let found = null;
    SYS.WAYS.forEach(w => w.shop.forEach(it => { if (!found && it.cd && !it.seals) found = [w.id, it]; }));
    const [wid, it] = found; A.S.flags.testXP = 1;
    // satisfy requirement + XP + credits by completing that way's nodes
    E.NODE && Object.keys(E.NODE).forEach(id => { if (E.NODE[id].way === wid) A.S.nodes[id] = {s:'done', d0:'2026-01-01', d1:'2026-01-01'}; });
    SYS.WAYMAP[wid].gates.forEach(g => { A.S.gates[g.id] = {ev:g.ev.map(() => true), done:'2026-01-02'}; });
    A.commit(['core'], {quiet:true});
    const st0 = E.itemState(A.S, A.D, wid, it).st; if (st0 !== 'available') return {wid, item: it, st0: E.itemState(A.S, A.D, wid, it), cr: A.D.wayCr[wid], xp: A.D.wayXP[wid]};
    A.A.cdStart({getAttribute: k => k === 'data-way' ? wid : it.id});
    const p = A.S.pending.map(x => x.id + '@' + x.until);
    const st1 = E.itemState(A.S, A.D, wid, it).st;
    A.S.pending[0].until = new Date(Date.now() - 1000).toISOString();
    const st2 = E.itemState(A.S, A.D, wid, it).st;
    A.ui.modal = {type:'buy', way:wid, id:it.id, ok:true}; A.A.buyDo();
    const st3 = E.itemState(A.S, A.D, wid, it).st;
    return {wid, item: it.id, st0, p, st1, st2, st3, stats: A.S.stats, ach: !!A.S.ach.sys_cd};
  }));
  await page.evaluate(() => SYS.App.A.closeAll()); await sleep(100);
  await page.evaluate(() => location.hash = '#/lojas/sistema'); await sleep(250);
  log('gem', await page.evaluate(() => SYS.App.D.gem));
  await page.click('[data-a="sysBuyOpen"][data-id="sk_violet"]'); await sleep(150); await page.click('#modal [data-a="sysBuyDo"]'); await sleep(300);
  await page.click('[data-a="cosEquip"][data-id="sk_violet"]'); await sleep(200);
  log('skin', await page.evaluate(() => document.documentElement.getAttribute('data-skin')));
  await page.evaluate(() => SYS.App.A.closeAll()); await sleep(100);
  // goals, side, open world, journal
  await page.evaluate(() => location.hash = '#/metas'); await sleep(200);
  await page.click('[data-a="goalSug"]'); await sleep(200);
  log('goals', await page.evaluate(() => SYS.App.S.goals.map(g => g.t + ' ' + g.krs.length)));
  await page.evaluate(() => location.hash = '#/missoes/laterais'); await sleep(200);
  await page.fill('[data-i="sideT"]', 'Mapear a rede da Infomax'); await page.click('[data-a="sideAdd"]'); await sleep(200);
  await page.click('[data-a="sideToggle"]'); await sleep(200);
  log('side', await page.evaluate(() => SYS.App.S.sideq));
  await page.evaluate(() => location.hash = '#/missoes/mundo'); await sleep(200);
  await page.fill('[data-i="owF"][data-k="t"]', 'VLANs do resort');
  await page.fill('[data-i="owF"][data-k="gap"]', 'Não sei separar hóspedes, câmeras e gestão sem derrubar o Wi-Fi dos 12 módulos.');
  await page.click('[data-a="owGen"]'); await sleep(900);
  await page.click('[data-a="owAdd"]'); await sleep(200);
  await page.click('[data-a="owSt"][data-s="done"]'); await sleep(200);
  log('open', await page.evaluate(() => SYS.App.J.open));
  await page.evaluate(() => location.hash = '#/diario/semana'); await sleep(200);
  const tas = await page.$$('[data-i="wkF"]');
  for (let i = 0; i < 3; i++) await tas[i].fill('Semana boa com bastante coisa feita.');
  await sleep(100); await page.click('[data-a="wkClose"]'); await sleep(300);
  log('week', await page.evaluate(() => SYS.App.J.weeks[SYS.U.weekKey(SYS.U.today())]));
  // achievements modal + pin
  await page.evaluate(() => location.hash = '#/conquistas/recentes'); await sleep(200);
  await page.click('.mcard'); await sleep(200); await page.click('#modal [data-a="pinAch"]'); await sleep(200);
  log('showcase', await page.evaluate(() => SYS.App.S.profile.showcase));
  await page.evaluate(() => SYS.App.A.closeModal());
  // export
  await page.evaluate(() => location.hash = '#/perfil'); await sleep(200);
  await page.click('[data-a="exportSave"]'); await sleep(300);
  log('saves', await page.evaluate(() => window.__mock.saves));
  await sleep(2500);
  log('final', await S());
  log('db docs', await page.evaluate(() => Object.keys(window.__mock.db).map(k => k + ' ' + window.__mock.db[k].length)));
  await page.screenshot({ path: path.join(__dirname, 'shots', 'shot_desktop.png') });
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
