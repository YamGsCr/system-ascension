/* mdev · dois aparelhos de verdade contra a mesma nuvem: quem grava, quem adota, o que nunca pode se perder */
const H = require('./mdevlib.js'); const { sleep } = H;
let fails = 0, oks = 0; const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hoje = ymd(new Date(Date.now() - 8 * 3600000));
const OFF = 's.pz.on = false; s.pz.intro = 1;';
const only = process.argv[2] || '';
const want = n => !only || only.split(',').indexOf(n) >= 0;

(async () => {
  const b = await H.chromium.launch();

  if (want('1')) {
    sec('1 · dois aparelhos abertos, ninguém toca em nada');
    const base = await H.baseState(b, 's.pz.intro = 1;');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(4000);
    const w0 = C.writes;
    const B = await H.openDevice(b, C, 'B', { seed: { 'sysasc.core.v1': base } });
    await sleep(15000);
    const a = await A.core(), bb = await B.core();
    ok(C.writes - w0 <= 2, 'em 15 s parados a nuvem recebeu ' + (C.writes - w0) + ' gravação(ões) — sem tempestade de regravação');
    ok(a.status === 'synced' && bb.status === 'synced', 'os dois terminam em "sincronizado" (' + a.status + ' / ' + bb.status + ')');
    ok(A.errs.length + B.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await B.ctx.close();
  }

  if (want('2')) {
    sec('2 · digitando num aparelho enquanto o outro está aberto e grava');
    const base = await H.baseState(b, OFF + ' s.profile.sig = "";');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const A = await H.openDevice(b, C, 'A', { seed }), B = await H.openDevice(b, C, 'B', { seed });
    await sleep(4000);
    await A.page.evaluate(() => { location.hash = '#/perfil'; }); await sleep(600);
    const sel = 'input[data-i="pSig"]';
    await A.page.click(sel);
    const text = 'O rato roeu a roupa do rei de Roma e a rainha ficou muito brava';
    let lostFocus = 0, i = 0;
    for (const ch of text) {
      if (!(await A.page.evaluate((sel) => document.activeElement === document.querySelector(sel), sel))) { lostFocus++; await A.page.click(sel); await A.page.keyboard.press('End'); }
      await A.page.keyboard.type(ch); await sleep(110);
      if (++i === 20 || i === 45) await B.ev((i) => { SYS.Store.asAuto(() => { SYS.App.S.flags['auto' + i] = 1; SYS.App.commit(['core'], { quiet: true }); }); }, i);   /* o outro aparelho grava manutenção no meio */
    }
    await sleep(4000);
    const r = await A.page.evaluate((sel) => ({ dom: document.querySelector(sel) && document.querySelector(sel).value, mem: SYS.App.S.profile.sig }), sel);
    ok(r.dom === text && r.mem === text, 'o texto digitado ficou inteiro no campo e na memória');
    ok(lostFocus === 0, 'o campo não perdeu o foco nenhuma vez (' + lostFocus + ')');
    ok((C.core().profile.sig || '') === text, 'e chegou inteiro na nuvem: "' + (C.core().profile.sig || '').slice(0, 30) + '…"');
    await A.ctx.close(); await B.ctx.close();
  }

  const mkStale = async () => {
    const base = await H.baseState(b, OFF);
    const remote = JSON.parse(JSON.stringify(base)); remote.profile.name = 'PROGRESSO-DO-CELULAR'; remote.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; remote._u = new Date(Date.now() - 3600000).toISOString(); remote._e = remote._u; remote._w = remote._u; remote._by = 'sCelular';
    const local = JSON.parse(JSON.stringify(base)); local.profile.name = 'CACHE-VELHO-DO-NOTEBOOK'; local._u = new Date(Date.now() - 2 * 86400000).toISOString(); local._e = local._u; local._w = local._u; local._b = local._u; local._bx = local._u;
    return { base, remote, local };
  };
  const tryClick = async (dev) => { const btn = await dev.page.$('#view [data-a="dailyToggle"]'); if (!btn) return 'sem botão'; try { await btn.click({ timeout: 1200 }); return 'clicou'; } catch (e) { return 'bloqueado'; } };

  if (want('3')) {
    sec('3 · aparelho SEM cache, nuvem lenta (6 s), a pessoa tenta clicar aos 4 s');
    const { remote } = await mkStale();
    const C = H.mkCloud(); C.put(H.CORE, remote);
    const A = await H.openDevice(b, C, 'A', { seed: null, lat: { sub: 6000, get: 6000, set: 300 } });
    await sleep(4000);
    const st = await A.core(), cl = await tryClick(A);
    ok(st.hold && st.ask && cl === 'bloqueado', 'aos 4 s a edição está travada, com o aviso na tela, e o clique não passa (' + cl + ')');
    await sleep(11000);
    const a = await A.core(), cc = C.core();
    ok(cc.profile.name === 'PROGRESSO-DO-CELULAR' && !!cc.nodes.A01, 'o save da nuvem continua inteiro');
    ok(a.name === 'PROGRESSO-DO-CELULAR' && !a.hold && !a.ask, 'o aparelho adotou o save e a trava soltou sozinha');
    await A.ctx.close();

    sec('3b · mesmo caso, e a pessoa escolhe "Editar assim mesmo"');
    const C2 = H.mkCloud(); C2.put(H.CORE, remote);
    const A2 = await H.openDevice(b, C2, 'A', { seed: null, lat: { sub: 7000, get: 7000, set: 300 } });
    await sleep(4000);
    await A2.page.click('#syhold [data-a="syGo"]'); await sleep(300);
    const cl2 = await tryClick(A2);
    await sleep(14000);
    const a2 = await A2.core(), cc2 = C2.core();
    ok(cl2 === 'clicou', 'a trava soltou e o clique passou');
    ok(cc2.profile.name === 'PROGRESSO-DO-CELULAR' && !!cc2.nodes.A01 && a2.name === 'PROGRESSO-DO-CELULAR', 'mesmo assim um aparelho em branco NUNCA sobrescreve um save que existe (nuvem: ' + cc2.profile.name + ')');
    await A2.ctx.close();

    sec('3c · e se, depois de editar às cegas, ela RECARREGA a página antes de a nuvem responder?');
    const C3 = H.mkCloud(); C3.put(H.CORE, remote);
    const A3 = await H.openDevice(b, C3, 'A', { seed: null, lat: { sub: 7000, get: 7000, set: 300 } });
    await sleep(4000);
    await A3.page.click('#syhold [data-a="syGo"]'); await sleep(300);
    await A3.ev(() => { const A = SYS.App; A.S.profile.name = 'EDITEI-NUM-APARELHO-EM-BRANCO'; A.commit(['core'], { quiet: true }); });
    await sleep(400);
    const c0 = await A3.ev(() => { const c = JSON.parse(localStorage.getItem('sysasc.core.v1') || 'null'); return c && { name: c.profile.name, b0: c._b0 }; });
    ok(c0 && c0.name === 'EDITEI-NUM-APARELHO-EM-BRANCO' && c0.b0 === 1, 'o cache criado às cegas leva a marca de que nunca viu a nuvem');
    await A3.page.reload();
    await sleep(15000);
    const a3 = await A3.core(), cc3 = C3.core();
    ok(cc3.profile.name === 'PROGRESSO-DO-CELULAR' && !!cc3.nodes.A01, 'a nuvem continua com o save de verdade (antes: depois de recarregar, o aparelho em branco passava por cima)');
    ok(a3.name === 'PROGRESSO-DO-CELULAR' && a3.a01, 'e o aparelho adota esse save');
    const l3 = await A3.ev(() => { const l = JSON.parse(localStorage.getItem('sysasc.lost.v1') || '{}'); return l.core ? { side: l.core.side, name: l.core.doc.profile.name } : null; });
    ok(l3 && l3.side === 'local' && l3.name === 'EDITEI-NUM-APARELHO-EM-BRANCO', 'o que foi editado às cegas ficou guardado no aparelho (' + JSON.stringify(l3) + ')');
    const c1 = await A3.ev(() => JSON.parse(localStorage.getItem('sysasc.core.v1'))._b0);
    ok(c1 === undefined && cc3._b0 === undefined, 'a marca some depois de conferir, e nunca sobe');
    await A3.ctx.close();
  }

  if (want('4')) {
    sec('4 · cache velho + nuvem lenta (6 s), clique aos 4 s');
    const { remote, local } = await mkStale();
    const C = H.mkCloud(); C.put(H.CORE, remote);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': local }, lat: { sub: 6000, get: 6000, set: 300 } });
    await sleep(4000);
    const st = await A.core(), cl = await tryClick(A);
    ok(st.hold && cl === 'bloqueado', 'edição travada enquanto a nuvem não responde: o clique não passa');
    await sleep(11000);
    const a = await A.core(), cc = C.core();
    ok(cc.profile.name === 'PROGRESSO-DO-CELULAR' && !!cc.nodes.A01, 'o progresso do celular continua na nuvem');
    ok(a.name === 'PROGRESSO-DO-CELULAR' && a.a01 && !a.hold, 'e o notebook adotou esse progresso');
    await A.ctx.close();

    sec('4b · mesmo caso com "Editar assim mesmo": divergência assumida, nada some sem cópia');
    const C2 = H.mkCloud(); C2.put(H.CORE, remote);
    const A2 = await H.openDevice(b, C2, 'A', { seed: { 'sysasc.core.v1': local }, lat: { sub: 7000, get: 7000, set: 300 } });
    await sleep(4000);
    await A2.page.click('#syhold [data-a="syGo"]'); await sleep(300);
    const cl2 = await tryClick(A2);
    await sleep(16000);
    const a2 = await A2.core(), cc2 = C2.core();
    const lost = await A2.ev(() => { const l = JSON.parse(localStorage.getItem('sysasc.lost.v1') || '{}'); return l.core ? { side: l.core.side, name: l.core.doc.profile.name, a01: !!l.core.doc.nodes.A01 } : null; });
    ok(cl2 === 'clicou' && cc2.profile.name === 'CACHE-VELHO-DO-NOTEBOOK', 'a edição feita às cegas é a mais recente e vale (a pessoa foi avisada)');
    ok(lost && lost.side === 'remote' && lost.name === 'PROGRESSO-DO-CELULAR' && lost.a01, 'a versão que estava na nuvem ficou guardada no aparelho (' + JSON.stringify(lost) + ')');
    const exp = await A2.ev(() => JSON.parse(SYS.App.saveJSON()));
    ok(exp.conflito && exp.conflito.core && exp.conflito.core.doc.profile.name === 'PROGRESSO-DO-CELULAR', '"Exportar save" leva as duas versões');
    await A2.ctx.close();
  }

  if (want('5')) {
    sec('5 · notebook dormiu com a página aberta; o celular progrediu; ao acordar a rede ainda não voltou');
    const base = await H.baseState(b, OFF);
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(3500);
    A.offline = true;
    const R = C.core(); R.profile.name = 'PROGRESSO-DO-CELULAR'; R.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; R._u = new Date().toISOString(); R._e = R._u; R._w = R._u; R._by = 'sCelular'; C.put(H.CORE, R);
    await sleep(1200);
    await A.page.evaluate(() => { SYS.Store.onWake(); });
    await sleep(500);
    let st = await A.core(); const cl = await tryClick(A);
    ok(st.hold && cl === 'bloqueado', 'acordou sem rede: edição travada, clique não passa (' + cl + ')');
    await sleep(3000); st = await A.core();
    ok(st.hold && st.ask, 'continua travado, agora com o aviso e a opção de seguir assim mesmo');
    A.offline = false;
    await sleep(9000);
    const a = await A.core(), cc = C.core();
    ok(a.name === 'PROGRESSO-DO-CELULAR' && a.a01 && !a.hold && !a.ask, 'a rede voltou: adotou o progresso do celular e destravou sozinho');
    ok(cc.profile.name === 'PROGRESSO-DO-CELULAR' && !!cc.nodes.A01, 'nuvem intacta');
    await A.ctx.close();
  }

  if (want('6')) {
    for (const mode of ['resume', 'reload']) {
      sec('6 · trabalho feito no celular sem sinal; depois o notebook só ABRE a página (' + (mode === 'resume' ? 'celular continuou com a página viva' : 'celular recarregou a página') + ')');
      const base = await H.baseState(b, OFF);
      const C = H.mkCloud(); C.put(H.CORE, base);
      const seed = { 'sysasc.core.v1': base };
      const P = await H.openDevice(b, C, 'CEL', { seed });
      await sleep(3500);
      P.offline = true;
      await P.ev((hoje) => { const A = SYS.App; A.S.profile.name = 'TRABALHO-FEITO-NO-CELULAR'; A.S.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; A.commit(['core'], { quiet: true }); }, hoje);
      await sleep(800);
      if (mode === 'reload') await P.close();
      await sleep(1200);
      const N = await H.openDevice(b, C, 'NOTE', { seed });
      await N.ev(() => { SYS.App.S.lastSeen = '2020-01-01'; SYS.Store.asAuto(() => SYS.App.onSeen()); });   /* manutenção automática do notebook, com carimbo mais novo que a edição do celular */
      await sleep(4500);
      const mid = C.core();
      ok(mid.profile.name === 'BASE' && mid._u > base._u, 'o notebook gravou só manutenção, com carimbo mais novo (' + mid._u.slice(11, 19) + ')');
      await N.ctx.close();
      let P2 = P;
      if (mode === 'reload') P2 = await H.openDevice(b, C, 'CEL', { ctx: P.ctx });
      else { P.offline = false; await P.page.evaluate(() => SYS.Store.onWake()); }
      await sleep(7000);
      const a = await P2.core(), cc = C.core();
      ok(a.name === 'TRABALHO-FEITO-NO-CELULAR' && a.a01, 'o celular continua com o trabalho feito');
      ok(cc.profile.name === 'TRABALHO-FEITO-NO-CELULAR' && !!cc.nodes.A01, 'e o trabalho chegou na nuvem: manutenção de outro aparelho não vence edição de pessoa');
      await P.ctx.close();
    }
  }

  if (want('7')) {
    sec('7 · 25 edições reais num aparelho, com outro aberto ao lado (nuvem com latência)');
    const base = await H.baseState(b, OFF + ' s.flags.marks = {};');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base }, lat = { get: 180, set: 270, echo: 180, sub: 80 };
    const D0 = await H.openDevice(b, C, 'D0', { seed, lat }), D1 = await H.openDevice(b, C, 'D1', { seed, lat });
    await sleep(4500);
    const w0 = C.writes;
    for (let r = 0; r < 25; r++) { await sleep(250 + Math.random() * 1900); await D0.ev((r) => { const A = SYS.App; A.S.flags.marks = A.S.flags.marks || {}; A.S.flags.marks['m' + r] = 1; A.commit(['core'], { quiet: true }); }, r); }
    await sleep(8000);
    const cc = C.core(), lost = []; for (let r = 0; r < 25; r++) if (!(cc.flags.marks || {})['m' + r]) lost.push('m' + r);
    const n1 = await D1.ev(() => Object.keys(SYS.App.S.flags.marks || {}).length);
    ok(lost.length === 0, 'nenhuma das 25 edições se perdeu' + (lost.length ? ' — perdidas: ' + lost.join(',') : ''));
    ok(n1 === 25, 'o aparelho ao lado recebeu todas (' + n1 + ')');
    ok(C.writes - w0 <= 40, 'gravações na nuvem: ' + (C.writes - w0) + ' para 25 edições');
    ok(D0.errs.length + D1.errs.length === 0, 'sem erro de JS ' + D0.errs.concat(D1.errs).slice(0, 2).join(' | '));
    await D0.ctx.close(); await D1.ctx.close();
  }

  if (want('8')) {
    sec('8 · veredito com dois aparelhos abertos e a janela vazia');
    const base = await H.baseState(b, 's.pz.intro = 1; s.pz.since = "2026-10-06"; s.pz.last = "2026-10-06"; s.pz.log = {"2026-10-06": {a: 2, v: "ok"}}; s.pz.seq = 1; s.pz.best = 1; s.pz.tot.ok = 1; s.lastSeen = "2026-10-07"; s.flags.fzDay = "2026-10-07";', '2026-10-07T12:00:00');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const A = await H.openDevice(b, C, 'A', { seed, clock: '2026-10-07T19:29:40' }), B = await H.openDevice(b, C, 'B', { seed, clock: '2026-10-07T19:29:40' });
    await H.advance([A, B], 6000);
    let a = await A.core(), bb = await B.core();
    ok(!a.ov && !bb.ov && a.miss === 0, '19:29:46 · os dois sincronizados, nada na tela');
    await H.advance([A, B], 40000);
    a = await A.core(); bb = await B.core(); const cc = C.core();
    ok(cc.pz.tot.miss === 1 && cc.pz.pens.filter(x => x.st === 'open').length === 1, 'na nuvem: UMA falta e UMA prenda (faltas ' + cc.pz.tot.miss + ', prendas ' + cc.pz.pens.length + ')');
    ok(a.miss === 1 && bb.miss === 1 && a.open === 1 && bb.open === 1, 'os dois aparelhos concordam: 1 falta, 1 prenda');
    const pa = await A.ev(() => SYS.App.S.pz.pens.map(x => x.id).join(',')), pb = await B.ev(() => SYS.App.S.pz.pens.map(x => x.id).join(','));
    ok(pa === pb && pa === cc.pz.pens.map(x => x.id).join(','), 'e é a MESMA prenda nos dois e na nuvem');
    ok(a.ov === 'miss' && bb.ov === 'miss', 'a bronca aparece nos dois');
    const w1 = C.writes;
    await A.page.keyboard.press('Escape'); await H.advance([A, B], 8000);
    a = await A.core(); bb = await B.core();
    ok(!a.ov && !bb.ov, 'fechou num, fecha no outro');
    await H.advance([A, B], 20000);
    ok(C.writes - w1 <= 3, 'depois disso a nuvem sossega (' + (C.writes - w1) + ' gravações em 28 s)');
    ok(A.errs.length + B.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await B.ctx.close();
  }

  if (want('9')) {
    sec('9 · chamado: aba antiga aberta, a tarefa do Windows abre outra janela, a pessoa cumpre na nova');
    const base = await H.baseState(b, 's.pz.intro = 1; s.pz.since = "2026-10-07"; s.lastSeen = "2026-10-07"; s.flags.fzDay = "2026-10-07";', '2026-10-07T12:00:00');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const A = await H.openDevice(b, C, 'A', { seed, clock: '2026-10-07T17:19:40' });
    await H.advance([A], 30000);
    let a = await A.core(); ok(a.ov === 'call', '17:20 · chamado na aba antiga');
    const B = await H.openDevice(b, C, 'B', { seed, clock: '2026-10-07T17:20:12' });
    await H.advance([A, B], 6000);
    let bb = await B.core(); ok(bb.ov === 'call', 'a janela nova abre também com o chamado');
    await B.page.keyboard.press('Escape'); await H.advance([A, B], 1500);
    await B.ev(() => { const A = SYS.App, x = A.N.n.A01 = A.N.n.A01 || {}; x.st = [0]; SYS.Store.save(['notes']); });
    await H.advance([A, B], 9000);
    a = await A.core(); bb = await B.core(); const cc = C.core();
    ok(cc.pz.log['2026-10-07'].v === 'ok' && cc.pz.log['2026-10-07'].a === 1 && cc.pz.seq === 1, 'janela cumprida na nuvem (1 ação, sequência 1)');
    ok(!a.ov, 'o chamado da aba antiga fecha sozinho');
    const pa = await A.ev(() => ({ v: SYS.App.S.pz.log['2026-10-07'].v, seq: SYS.App.S.pz.seq, gin: SYS.App.S.pz.gin, st: (SYS.App.N.n.A01 || {}).st }));
    ok(pa.v === 'ok' && pa.seq === 1 && pa.gin === 5 && JSON.stringify(pa.st) === '[0]', 'e ela mostra a janela cumprida uma vez só (+5 ◆, sem contar em dobro)');
    const w1 = C.writes; await H.advance([A, B], 20000);
    ok(C.writes - w1 <= 2, 'a nuvem sossega (' + (C.writes - w1) + ' gravações em 20 s)');
    ok(A.errs.length + B.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await B.ctx.close();
  }

  const clone = o => JSON.parse(JSON.stringify(o));
  const mark = (d, m) => d.ev((m) => { const A = SYS.App; A.S.flags.marks = A.S.flags.marks || {}; A.S.flags.marks[m] = 1; A.commit(['core'], { quiet: true }); }, m);
  const lostOf = d => d.ev(() => JSON.parse(localStorage.getItem('sysasc.lost.v1') || '{}'));
  const WORK = 'TRABALHO-FEITO-NO-CELULAR';

  if (want('6c')) {
    sec('6c · trabalho feito no celular sem sinal; o notebook abre, faz a manutenção e CONTINUA ABERTO quando o celular volta');
    const base = await H.baseState(b, OFF);
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const P = await H.openDevice(b, C, 'CEL', { seed });
    await sleep(3500);
    P.offline = true;
    await P.ev(({ hoje, WORK }) => { const A = SYS.App; A.S.profile.name = WORK; A.S.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; A.commit(['core'], { quiet: true }); }, { hoje, WORK });
    await sleep(2000);
    const N = await H.openDevice(b, C, 'NOTE', { seed });
    await N.ev(() => { SYS.App.S.lastSeen = '2020-01-01'; SYS.Store.asAuto(() => SYS.App.onSeen()); });
    await sleep(4500);
    const mid = C.core();
    ok(mid.profile.name === 'BASE' && mid._u > base._u, 'o notebook gravou só manutenção, com carimbo mais novo que a edição do celular');
    P.offline = false; await P.page.evaluate(() => SYS.Store.onWake());
    await sleep(8000);
    const a = await P.core(), n = await N.core(), cc = C.core();
    ok(a.name === WORK && a.a01, 'o celular continua com o trabalho feito');
    ok(cc.profile.name === WORK && !!cc.nodes.A01, 'o trabalho chegou na nuvem');
    ok(n.name === WORK && n.a01, 'e o notebook aberto ADOTOU o trabalho (antes ele regravava a manutenção por cima)');
    ok(cc._u > mid._u, 'a gravação que venceu subiu com carimbo maior que o da manutenção (' + cc._u.slice(11, 23) + ' > ' + mid._u.slice(11, 23) + ')');
    const w1 = C.writes; await sleep(6000);
    ok(C.writes === w1, 'nuvem quieta depois (' + (C.writes - w1) + ' gravações em 6 s)');
    ok(P.errs.length + N.errs.length === 0, 'sem erro de JS ' + P.errs.concat(N.errs).slice(0, 2).join(' | '));
    await P.ctx.close(); await N.ctx.close();
  }

  if (want('10')) {
    sec('10 · o save na nuvem tem carimbo do FUTURO (outro aparelho com o relógio adiantado 6 h): mesmo roteiro do 9');
    const base = await H.baseState(b, 's.pz.intro = 1; s.pz.since = "2026-10-07"; s.lastSeen = "2026-10-07"; s.flags.fzDay = "2026-10-07";', '2026-10-07T23:30:00');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const A = await H.openDevice(b, C, 'A', { seed, clock: '2026-10-07T17:19:40' });
    await H.advance([A], 30000);
    let a = await A.core(); ok(a.ov === 'call', '17:20 · chamado na aba antiga');
    const B = await H.openDevice(b, C, 'B', { seed, clock: '2026-10-07T17:20:12' });
    await H.advance([A, B], 6000);
    let bb = await B.core(); ok(bb.ov === 'call', 'a janela nova abre também com o chamado');
    await B.page.keyboard.press('Escape'); await H.advance([A, B], 1500);
    await B.ev(() => { const A = SYS.App, x = A.N.n.A01 = A.N.n.A01 || {}; x.st = [0]; SYS.Store.save(['notes']); });
    await H.advance([A, B], 9000);
    a = await A.core(); bb = await B.core(); const cc = C.core(), lg = (cc.pz.log || {})['2026-10-07'] || {};
    ok(lg.v === 'ok' && lg.a === 1 && cc.pz.seq === 1, 'janela cumprida na nuvem (1 ação, sequência 1) — antes, com carimbo do futuro na nuvem, isto se perdia');
    ok(!a.ov, 'o chamado da aba antiga fecha sozinho');
    const us = C.hist.filter(h => h.doc === 'core').map(h => h.u);
    ok(us.every((u, i) => u > base._u && (!i || u > us[i - 1])), 'todo carimbo gravado é maior que o anterior, mesmo com o relógio "atrás" do save (' + us.length + ' gravações)');
    const w1 = C.writes; await H.advance([A, B], 20000);
    ok(C.writes - w1 <= 2, 'a nuvem sossega (' + (C.writes - w1) + ' gravações em 20 s)');
    ok(A.errs.length + B.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await B.ctx.close();
  }

  if (want('11')) {
    sec('11 · dois aparelhos abertos, um com o relógio 6 min ATRASADO, editando um de cada vez');
    const base = await H.baseState(b, OFF + ' s.flags.marks = {};', '2026-10-07T12:00:00');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const A = await H.openDevice(b, C, 'CERTO', { seed, clock: '2026-10-07T17:30:00' }), B = await H.openDevice(b, C, 'ATRASADO', { seed, clock: '2026-10-07T17:24:00' });
    await H.advance([A, B], 5000);
    await mark(A, 'm1'); await H.advance([A, B], 5000);
    await mark(B, 'm2'); await H.advance([A, B], 5000);
    await mark(A, 'm3'); await H.advance([A, B], 5000);
    await mark(B, 'm4'); await H.advance([A, B], 7000);
    const a = await A.core(), bb = await B.core(), cc = C.core();
    ok(Object.keys(cc.flags.marks || {}).sort().join(',') === 'm1,m2,m3,m4', 'as 4 edições estão na nuvem (' + Object.keys(cc.flags.marks || {}).sort().join(',') + ')');
    ok(a.marks === 'm1,m2,m3,m4' && bb.marks === 'm1,m2,m3,m4', 'e nos dois aparelhos (' + a.marks + ' / ' + bb.marks + ')');
    const la = await lostOf(A), lb = await lostOf(B);
    ok(!la.core && !lb.core && !/duas vers/i.test(a.toasts + bb.toasts), 'sem divergência: nenhum alarme de "duas versões"');
    const us = C.hist.filter(h => h.doc === 'core').map(h => h.u);
    ok(us.every((u, i) => !i || u > us[i - 1]), 'os carimbos na nuvem só andam para a frente (' + us.length + ' gravações)');
    const w1 = C.writes; await H.advance([A, B], 15000);
    ok(C.writes === w1, 'nuvem quieta depois (' + (C.writes - w1) + ' gravações em 15 s)');
    ok(A.errs.length + B.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await B.ctx.close();
  }

  if (want('12')) {
    sec('12 · a página ANTIGA do System (sem a guarda) continua aberta em outro aparelho e grava');
    const base = await H.baseState(b, OFF);
    const C = H.mkCloud(); C.put(H.CORE, base);
    const N = await H.openDevice(b, C, 'NOTE', { seed: { 'sysasc.core.v1': base } });
    await sleep(3500);
    const old1 = C.core(); old1.profile.name = 'PAGINA-ANTIGA'; old1._u = new Date().toISOString(); C.put(H.CORE, old1); C.broadcast(H.CORE);   /* _w e _e ficam os de antes: é assim que a página antiga regrava */
    await sleep(2500);
    let n = await N.core(), lost = await lostOf(N);
    ok(n.name === 'PAGINA-ANTIGA', 'vale o último que gravou, como sempre foi');
    ok(lost.core_antes && lost.core_antes.doc.profile.name === 'BASE', 'mas o que estava neste aparelho antes ficou guardado');
    ok(/vers.o antiga aberta/i.test(n.toasts), 'e a pessoa é avisada para recarregar o outro aparelho');
    ok(!lost.core, 'sem alarme de "duas versões" (não é uma divergência de edição)');
    await N.ev((hoje) => { const A = SYS.App; A.S.profile.name = 'EDITEI-NO-NOTE'; A.S.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; A.commit(['core'], { quiet: true }); }, hoje);
    await sleep(3500);
    let cc = C.core();
    ok(cc.profile.name === 'EDITEI-NO-NOTE' && cc._w === cc._u && cc._e === cc._u, 'a edição do notebook sobe com a marca da guarda');
    const old2 = clone(old1); old2.profile.name = 'ANTIGA-DE-NOVO'; old2._u = new Date().toISOString(); C.put(H.CORE, old2); C.broadcast(H.CORE);    /* a página antiga não viu a edição e grava o estado dela por cima */
    await sleep(2500);
    n = await N.core(); lost = await lostOf(N);
    ok(n.name === 'ANTIGA-DE-NOVO', 'a página antiga atropela (ela não confere a nuvem)');
    ok(lost.core_antes2 && lost.core_antes2.doc.profile.name === 'EDITEI-NO-NOTE' && !!lost.core_antes2.doc.nodes.A01, 'a edição atropelada ficou guardada no notebook');
    ok(lost.core_antes && lost.core_antes.doc.profile.name === 'BASE', 'e a primeira cópia da sessão continua lá');
    const ex = await N.ev(() => JSON.parse(SYS.App.saveJSON()));
    ok(ex.conflito && ex.conflito.core_antes2 && ex.conflito.core_antes2.doc.profile.name === 'EDITEI-NO-NOTE', '"Exportar save" leva as cópias');
    ok(N.errs.length === 0, 'sem erro de JS ' + N.errs.slice(0, 2).join(' | '));
    await N.ctx.close();
  }

  if (want('13')) {
    sec('13 · duas abas no MESMO navegador (dividem o cache local)');
    const base = await H.baseState(b, OFF + ' s.flags.marks = {};');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const A = await H.openDevice(b, C, 'ABA1', { seed });
    await sleep(3500);
    const B = await H.openDevice(b, C, 'ABA2', { ctx: A.ctx });
    await sleep(3500);
    await mark(A, 't1'); await sleep(3500);
    await mark(B, 't2'); await sleep(3500);
    let a = await A.core(), bb = await B.core();
    ok(a.marks === 't1,t2' && bb.marks === 't1,t2', 'edição numa aba chega na outra (' + a.marks + ' / ' + bb.marks + ')');
    await A.page.reload(); await sleep(4500);
    a = await A.core();
    ok(a.marks === 't1,t2' && a.status === 'synced' && !a.lost, 'recarregar uma aba não perde nem inventa divergência (' + a.status + ')');
    /* a aba 1 fica parada (sem receber nada); a aba 2 segue editando; a aba 1 acorda, grava só manutenção em cima do cache
       que as duas dividem, e o navegador fecha antes de ela conferir a nuvem */
    A.offline = true;
    await mark(B, 't3'); await sleep(3500);
    await A.ev(() => { SYS.App.S.lastSeen = '2020-01-01'; SYS.Store.asAuto(() => SYS.App.onSeen()); });
    await sleep(600);
    const st = await A.ev(() => { const c = JSON.parse(localStorage.getItem('sysasc.core.v1')); return { m: Object.keys(c.flags.marks).sort().join(','), b: c._b, u: c._u }; });
    ok(st.m === 't1,t2' && C.core().flags.marks.t3 === 1 && st.b < C.core()._u, 'montado: o cache ficou com a versão parada da aba 1 (sem a t3), e ele sabe de qual versão da nuvem descende');
    await A.close(); await B.close();
    const A2 = await H.openDevice(b, C, 'ABA3', { ctx: A.ctx });
    await sleep(5000);
    let a2 = await A2.core(), cc = C.core();
    ok(a2.marks === 't1,t2,t3', 'ao reabrir, o aparelho adota a nuvem (t1,t2,t3) em vez de confiar no cache parado: ' + a2.marks);
    ok(Object.keys(cc.flags.marks).sort().join(',') === 't1,t2,t3', 'e a nuvem continua com a t3 (antes: o cache parado subia por cima como "manutenção")');
    /* edição de pessoa que não chegou a subir; o navegador fecha; outro aparelho grava manutenção nesse meio-tempo */
    A2.offline = true;
    await mark(A2, 't4'); await sleep(500);
    await A2.close();
    const D = await H.openDevice(b, C, 'OUTRO', { seed: { 'sysasc.core.v1': clone(cc) } });
    await sleep(3000);
    await D.ev(() => { SYS.App.S.lastSeen = '2020-01-01'; SYS.Store.asAuto(() => SYS.App.onSeen()); });
    await sleep(4000);
    const mid = C.core();
    ok(!(mid.flags.marks || {}).t4 && mid._u > cc._u, 'a nuvem andou sem a t4 (manutenção de outro aparelho)');
    const A3 = await H.openDevice(b, C, 'ABA4', { ctx: A.ctx });
    await sleep(6000);
    const a3 = await A3.core(), d = await D.core(); cc = C.core();
    ok(a3.marks === 't1,t2,t3,t4', 'ao reabrir, a edição pendente continua no aparelho');
    ok(Object.keys(cc.flags.marks).sort().join(',') === 't1,t2,t3,t4', 'e sobe para a nuvem: manutenção de outro aparelho não apaga edição pendente');
    ok(d.marks === 't1,t2,t3,t4', 'o outro aparelho adota');
    ok(cc._b === undefined && cc._bx === undefined, 'as marcas internas do cache não sobem para a nuvem');
    ok(A.errs.length + B.errs.length + A2.errs.length + A3.errs.length + D.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs, A2.errs, A3.errs, D.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await D.ctx.close();
  }

  if (want('14')) {
    sec('14 · a nuvem volta para trás (alguém gravou sem ter visto a versão atual)');
    const base = await H.baseState(b, OFF);
    const C = H.mkCloud(); C.put(H.CORE, base);
    const seed = { 'sysasc.core.v1': base };
    const N1 = await H.openDevice(b, C, 'N1', { seed }), N2 = await H.openDevice(b, C, 'N2', { seed });
    await sleep(3500);
    await N1.ev((hoje) => { const A = SYS.App; A.S.profile.name = 'ATUAL'; A.S.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; A.commit(['core'], { quiet: true }); }, hoje);
    await sleep(3500);
    let n2 = await N2.core(); const cur = C.core();
    ok(n2.name === 'ATUAL' && cur.profile.name === 'ATUAL', 'ponto de partida: os dois e a nuvem com a versão atual');
    const R = clone(base); R.profile.name = 'VELHO-POR-CIMA'; R._u = new Date(Date.parse(base._u) + 1).toISOString(); R._e = R._u; R._w = R._u; R._by = 'sCego';
    const w0 = C.writes; C.put(H.CORE, R); C.broadcast(H.CORE);
    await sleep(5000);
    let n1 = await N1.core(); n2 = await N2.core(); let cc = C.core();
    ok(cc.profile.name === 'ATUAL' && !!cc.nodes.A01 && cc._u > cur._u, 'a versão atual foi reposta na nuvem, com carimbo novo');
    ok(n1.name === 'ATUAL' && n2.name === 'ATUAL', 'os dois aparelhos continuam com ela');
    const l1 = await lostOf(N1), l2 = await lostOf(N2), kept = (l1.core || l2.core);
    ok(kept && kept.side === 'remote' && kept.doc.profile.name === 'VELHO-POR-CIMA', 'e a versão que foi sobrescrita ficou guardada (não some sem cópia)');
    ok(C.writes - w0 <= 4, 'sem briga entre os dois para repor: ' + (C.writes - w0) + ' gravações');
    const w1 = C.writes; await sleep(6000);
    ok(C.writes === w1, 'nuvem quieta depois');

    sec('14b · carimbo menor, mas com edição de pessoa mais nova (a nuvem tinha manutenção com carimbo adiantado)');
    const M = C.core(); M._u = new Date(Date.now() + 600000).toISOString(); M._w = M._u; M._by = 'sAdiantado'; M.flags.three = true;   /* manutenção de um aparelho com relógio 10 min adiantado: _e não muda */
    C.put(H.CORE, M); C.broadcast(H.CORE);
    await sleep(3000);
    n1 = await N1.core();
    ok(n1._u === M._u, 'os aparelhos adotam a manutenção adiantada');
    const R2 = clone(M); R2.profile.name = 'EDICAO-COM-RELOGIO-CERTO'; R2._u = new Date().toISOString(); R2._e = R2._u; R2._w = R2._u; R2._by = 'sCerto';
    const w2 = C.writes; C.put(H.CORE, R2); C.broadcast(H.CORE);
    await sleep(4000);
    n1 = await N1.core(); n2 = await N2.core(); cc = C.core();
    ok(n1.name === 'EDICAO-COM-RELOGIO-CERTO' && n2.name === 'EDICAO-COM-RELOGIO-CERTO', 'a edição de pessoa vence a manutenção, mesmo com carimbo menor');
    ok(cc.profile.name === 'EDICAO-COM-RELOGIO-CERTO' && C.writes === w2, 'e ninguém regrava por cima dela');
    await N1.ev(() => { const A = SYS.App; A.S.profile.sig = 'depois'; A.commit(['core'], { quiet: true }); });
    await sleep(3500);
    cc = C.core(); n2 = await N2.core();
    ok(cc._u > M._u && cc.profile.name === 'EDICAO-COM-RELOGIO-CERTO' && cc.profile.sig === 'depois', 'a próxima edição sobe com carimbo acima do adiantado e mantém tudo');
    ok(n2._u === cc._u, 'e o outro aparelho adota');
    ok(N1.errs.length + N2.errs.length === 0, 'sem erro de JS ' + N1.errs.concat(N2.errs).slice(0, 2).join(' | '));
    await N1.ctx.close(); await N2.ctx.close();
  }

  if (want('15')) {
    sec('15 · primeira abertura depois de atualizar: o navegador entrega a cópia dele antes de a nuvem responder');
    const base = await H.baseState(b, OFF);
    const velho = clone(base); velho.profile.name = 'CACHE-DA-VERSAO-ANTIGA'; velho._u = new Date(Date.now() - 2 * 86400000).toISOString();
    ['_b', '_bx', '_bn', '_b0', '_w', '_e', '_by'].forEach(k => delete velho[k]);                 /* cache como a versão sem guarda deixava */
    const d1 = clone(velho); d1.profile.name = 'CELULAR-NA-VERSAO-ANTIGA'; d1.nodes.A01 = { s: 'done', d0: hoje, d1: hoje }; d1._u = new Date(Date.now() - 3600000).toISOString();
    const C = H.mkCloud(); C.put(H.CORE, d1);
    const N = await H.openDevice(b, C, 'NOTE', { seed: { 'sysasc.core.v1': velho }, lat: { sub: 4500, get: 4500, set: 300 } });
    await sleep(1500);
    await N.page.evaluate(([p, body]) => window.__deliver(p, body, true), [H.CORE, JSON.stringify(velho)]);
    await sleep(500);
    let m = await N.ev(() => SYS.Store.meta.core);
    ok(m.n === 1, 'a cópia do cache do navegador não conta como "conferido com a nuvem"');
    await sleep(6000);
    let n = await N.core(), lost = await lostOf(N);
    ok(n.name === 'CELULAR-NA-VERSAO-ANTIGA' && n.a01, 'a nuvem respondeu: adota o progresso que estava lá');
    ok(!/vers.o antiga aberta/i.test(n.toasts) && !/duas vers/i.test(n.toasts), 'sem alarme: é só o save de antes da atualização, não uma página antiga aberta');
    ok(lost.core_antes && lost.core_antes.doc.profile.name === 'CACHE-DA-VERSAO-ANTIGA' && !lost.core, 'o cache antigo deste aparelho ficou guardado em silêncio');
    m = await N.ev(() => SYS.Store.meta.core);
    ok(m.n === 0 && C.core().profile.name === 'CELULAR-NA-VERSAO-ANTIGA', 'agora sim, conferido — e a nuvem não foi sobrescrita pelo cache velho');
    const d2 = clone(d1); d2.profile.name = 'ANTIGA-AINDA-ABERTA'; d2._u = new Date().toISOString(); C.put(H.CORE, d2); C.broadcast(H.CORE);
    await sleep(2500);
    n = await N.core();
    ok(n.name === 'ANTIGA-AINDA-ABERTA' && /vers.o antiga aberta/i.test(n.toasts), 'uma gravação NOVA sem a marca da guarda, depois disso, é página antiga aberta em algum lugar: aí avisa');
    ok(N.errs.length === 0, 'sem erro de JS ' + N.errs.slice(0, 2).join(' | '));
    await N.ctx.close();
  }

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
