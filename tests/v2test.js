const { chromium } = require('playwright'); const path = require('path'); const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1360,height:900} }); const errs = [];
  p.on('pageerror', e => errs.push(e.message + ' ' + (e.stack||'').split('\n')[1]));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('ERR_TUNNEL')) errs.push(m.text()); });
  await p.goto('file://' + path.join(__dirname, '..', 'dist', 'test_legacy.html')); await sleep(700);
  const log = (k, v) => console.log(k.padEnd(22), typeof v === 'string' ? v : JSON.stringify(v));
  const ev = f => p.evaluate(f);
  log('today/reset', await ev(() => ({ today: SYS.U.today(), cal: SYS.U.calToday(), next: SYS.U.nextReset().toString(), ms: SYS.U.fmtDur(SYS.U.msToReset()) })));
  // extras + extra day
  log('extras', await ev(() => { const A = SYS.App, S = A.S, U = SYS.U, t = U.today(); S.settings.dailies.forEach(id => { A.A.dailyToggle({getAttribute: () => id}); }); A.A.extraToggle({getAttribute: () => 'agua'}); A.A.extraToggle({getAttribute: () => 'sol'}); return { rec: S.daily[t], extraDays: A.D.extraDays, xst: A.D.extraStreak, gem: A.D.gem, ach: Object.keys(S.ach) }; }));
  // freeze auto-use: build 5-day streak ending 3 days ago with gap 2 days, 2 freezes
  log('freeze', await ev(() => { const A = SYS.App, S = A.S, U = SYS.U, t = U.today(); const need = S.settings.dailies.length; for (let i = 3; i <= 7; i++) { const d = U.addDays(t, -i); const q = {}; S.settings.dailies.forEach(id => q[id] = null); S.daily[d] = {q, need}; } S.owned.freezes = 2; S.flags.fzDay = ''; const r = SYS.E.freezeCheck(S); A.commit(['core'], {quiet:true}); return { r, freezes: S.owned.freezes, streak: A.D.streak, frozen: [U.addDays(t,-1), U.addDays(t,-2)].map(d => S.daily[d] && S.daily[d].frozen) }; }));
  // streak lost + repair
  log('lost+repair', await ev(() => { const A = SYS.App, S = A.S, U = SYS.U, t = U.today(); [1,2].forEach(i => { delete S.daily[U.addDays(t,-i)]; }); S.owned.freezes = 0; S.flags.fzDay = ''; const r = SYS.E.freezeCheck(S); const rep1 = SYS.E.repairable(S); S.sysbuys.push({id:'x', c:0, d:t}); const ok = SYS.E.repair(S); A.commit(['core'], {quiet:true}); return { lost: r.lost, rep1, ok, streak: A.D.streak, used: S.stats.repairsUsed }; }));
  // chests: give gems via gemBack then open many
  log('chests', await ev(() => { const A = SYS.App, S = A.S; S.chests.gemBack += 20000; A.commit(['core'], {quiet:true}); const res = []; for (let i = 0; i < 30; i++) { A.ui.modal = {type:'sysbuy', k:'chest', id: i % 3 === 0 ? 'ch_monarch' : i % 3 === 1 ? 'ch_mana' : 'ch_iron'}; A.A.sysBuyDo(); res.push(A.ui.modal && A.ui.modal.res && A.App === undefined ? 0 : (A.ui.modal.res.k + (A.ui.modal.res.item ? ':' + A.ui.modal.res.item : '') + (A.ui.modal.res.rank ? ':' + A.ui.modal.res.rank : ''))); } return { n: S.chests.n, pity: S.chests.pity, lucky: S.chests.lucky, keys: S.owned.keys, freezes: S.owned.freezes, owned: S.owned, sample: res.slice(0, 12), gem: A.D.gem }; }));
  await p.screenshot({ path: 'shots/v2_chest_modal.png' });
  await ev(() => SYS.App.A.closeAll());
  // dungeon: enter E, mark days, simulate time
  log('dungeon', await ev(() => { const A = SYS.App, S = A.S, E = SYS.E, U = SYS.U; S.dun = null; S.owned.keys.E = 2; const ok = E.dunEnter(S, 'd_goblins'); const dun = S.dun; dun.start = U.addDays(U.today(), -2); [0,1,2].forEach(i => { E.dunMark(S, i, 0, true); E.dunMark(S, i, 1, true); }); const r = E.dunEval(S); A.commit(['core'], {quiet:true}); return { ok, r: r && r.st, got: r && r.got, log: S.dunLog, ach: !!S.ach['dun_d_goblins'] }; }));
  log('dungeon fail', await ev(() => { const A = SYS.App, S = A.S, E = SYS.E, U = SYS.U; const ok = E.dunEnter(S, 'd_sala'); S.dun.start = U.addDays(U.today(), -3); const r = E.dunEval(S); A.commit(['core'], {quiet:true}); return { ok, st: r && r.st, log: S.dunLog.map(l => l.id + ':' + l.st) }; }));
  // feats + counters
  log('feats', await ev(() => { const A = SYS.App, S = A.S; A.ctrAddVal('kdp_sales', 12); A.ctrAddVal('pages', 150); A.ctrAddVal('paid_sw', 3); S.feats.ego = {d: SYS.U.today()}; S.feats.hello_prod = {d: SYS.U.today()}; A.commit(['core'], {quiet:true}); return { featsDone: A.D.featsDone, done: Object.keys(A.D.featDone), archXP: A.D.wayXP.architect, ach: Object.keys(S.ach).filter(k => k.startsWith('ft_')) }; }));
  // routes render
  for (const r of ['sequencia','portoes/dungeons','caminhos/flaneur/autor','caminhos/architect/feitos','lojas/sistema','marcos','marcos/feitos','perfil','conquistas/feitos','titulos']) { await ev(h => { location.hash = '#/' + h; }, r); await sleep(200); const bad = await ev(() => document.getElementById('view').innerText.includes('Erro do Sistema')); if (bad) log('RENDER ERROR', r); }
  await ev(() => { location.hash = '#/sequencia'; }); await sleep(400); await p.screenshot({ path: 'shots/v2_streak.png', fullPage: false });
  await ev(() => { location.hash = '#/caminhos/flaneur/autor'; }); await sleep(400); await p.screenshot({ path: 'shots/v2_author.png' });
  await ev(() => { location.hash = '#/portoes/dungeons'; }); await sleep(400); await p.screenshot({ path: 'shots/v2_dungeons.png' });
  await ev(() => { location.hash = '#/lojas/sistema/baus'; }); await sleep(400); await p.screenshot({ path: 'shots/v2_chests.png' });
  // examiner alem via mock override
  log('alem', await ev(async () => { const A = SYS.App; const orig = A.sample.json; A.sample.json = () => Promise.resolve({nota:97, veredito:'APROVADO', resumo:'Absurdo.', acertos:['tudo'], lacunas:[], erros:[], falha:'ok', perguntas:[], proximo_passo:'x', alem:true}); const st = A.examState('A02'); st.mode = 'teach'; st.text = 'x'.repeat(300); A.A.exGrade({getAttribute: k => k === 'data-kind' ? 'node' : 'A02'}); await new Promise(r => setTimeout(r, 300)); A.sample.json = orig; return { exams: A.S.exams, ach: !!A.S.ach.sys_alem }; }));
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await b.close();
})();
