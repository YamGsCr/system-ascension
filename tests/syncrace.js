/* Sincronização entre aparelhos: quem vence em cada cenário */
const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
const ymd = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
let fails = 0; const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fails++; };

async function boot(b, local, remoto, meta, wait){
  const ctx = await b.newContext();
  await ctx.addInitScript(({local, remoto, meta}) => {
    /* a "marca de sincronização" viaja dentro do próprio cache: _b = carimbo da nuvem de que ele descende, _bx = edição de pessoa que essa versão tinha */
    try { if (local && window.name !== 'semeado') { if (meta) { local._b = meta.core.s; local._bx = meta.core.x || meta.core.s; } localStorage.setItem('sysasc.core.v1', JSON.stringify(local)); window.name = 'semeado'; } } catch (e) {}
    let m; Object.defineProperty(window, '__mock', { configurable:true, get(){ return m; }, set(v){ m = v; if (remoto) v.db['data/users/u_test/core'] = JSON.stringify(remoto); } });
  }, {local, remoto, meta});
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL); await sleep(wait == null ? 2600 : wait);
  const snap = () => p.evaluate(() => { const r = window.__mock.db['data/users/u_test/core']; const R = r ? JSON.parse(r) : null; return { nome: SYS.App.S.profile.name, a01: !!SYS.App.S.nodes.A01, b01: !!SYS.App.S.nodes.B01, rNome: R && R.profile.name, rA01: !!(R && R.nodes.A01), rB01: !!(R && R.nodes.B01), rSeen: R && R.lastSeen, hoje: SYS.U.today(), st: SYS.Store.status, writes: window.__mock.writes }; });
  return { p, ctx, errs, snap };
}

(async () => {
  const b = await chromium.launch();
  const p0 = await b.newPage(); await p0.goto(URL); await sleep(900);
  const base = await p0.evaluate(() => { const A = SYS.App; A.S.profile.name = 'BASE'; A.commit(['core'], {quiet:true}); return JSON.parse(JSON.stringify(A.S)); });
  await p0.close();
  const d2 = new Date(Date.now() - 2 * 86400000), h1 = new Date(Date.now() - 3600000), hoje = ymd(new Date());
  /* _u = última gravação · _e = última edição feita por pessoa (por padrão, a mesma) */
  const mk = (nome, u, seen, extra, e) => { const s = JSON.parse(JSON.stringify(base)); s.profile.name = nome; s._u = u.toISOString(); s._w = s._u; s._e = (e || u).toISOString(); delete s._by; delete s._b; delete s._bx; delete s._bn; delete s._b0; s.lastSeen = seen; Object.assign(s.nodes, extra || {}); return s; };

  console.log('\n1 · cache local velho + nuvem mais nova (outro aparelho progrediu)');
  let t = await boot(b, mk('LOCAL-VELHO', d2, ymd(d2)), mk('REMOTO-NOVO', h1, ymd(d2), {A01:{s:'done', d0:hoje, d1:hoje}}));
  let r = await t.snap();
  ok(r.nome === 'REMOTO-NOVO' && r.a01, 'a tela mostra o progresso da nuvem');
  ok(r.rA01 && r.rNome === 'REMOTO-NOVO', 'a nuvem NÃO foi sobrescrita pelo cache velho');
  ok(r.rSeen === r.hoje, 'manutenção do dia (lastSeen) reaplicada em cima da nuvem: ' + r.rSeen);
  ok(t.errs.length === 0, 'sem erro de JS ' + t.errs.join('|'));
  await t.ctx.close();

  console.log('\n2 · edição offline neste aparelho mais nova que a nuvem');
  t = await boot(b, mk('LOCAL-NOVO', h1, ymd(d2), {B01:{s:'done', d0:hoje, d1:hoje}}), mk('REMOTO-VELHO', d2, ymd(d2)));
  r = await t.snap();
  ok(r.nome === 'LOCAL-NOVO' && r.b01, 'a tela mantém a edição local');
  ok(r.rNome === 'LOCAL-NOVO' && r.rB01, 'a edição local subiu para a nuvem');
  await t.ctx.close();

  console.log('\n3 · mesmo aparelho, dia novo, nuvem e cache iguais');
  const igual = mk('MESMO', d2, ymd(d2), {A01:{s:'done', d0:ymd(d2), d1:ymd(d2)}});
  t = await boot(b, igual, JSON.parse(JSON.stringify(igual)));
  r = await t.snap();
  ok(r.nome === 'MESMO' && r.a01 && r.rA01, 'estado preservado dos dois lados');
  ok(r.rSeen === r.hoje && r.st === 'synced', 'manutenção do dia subiu normalmente (' + r.st + ')');
  await t.ctx.close();

  console.log('\n4 · página aberta, sem edição aqui, outro aparelho grava na nuvem');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await t.p.evaluate((hoje) => { const k = 'data/users/u_test/core'; const R = JSON.parse(window.__mock.db[k]); R.profile.name = 'OUTRO-APARELHO'; R.nodes.B01 = {s:'done', d0:hoje, d1:hoje}; R._by = 'sOutroAparelho'; R._u = new Date(Date.now() + 5000).toISOString(); R._e = R._u; R._w = R._u; window.__mock.db[k] = JSON.stringify(R); (window.__mock.listeners[k] || []).forEach(fn => fn({exists:true, data:() => JSON.parse(window.__mock.db[k]), metadata:{fromCache:false, hasPendingWrites:false}})); }, hoje);
  await sleep(900); r = await t.snap();
  ok(r.nome === 'OUTRO-APARELHO' && r.b01, 'a mudança do outro aparelho chegou ao vivo');
  ok(r.rNome === 'OUTRO-APARELHO' && r.rB01, 'e a nuvem ficou com ela');
  await t.ctx.close();

  console.log('\n5 · edição da pessoa aqui continua subindo');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await t.p.evaluate(() => { SYS.App.S.profile.name = 'EDITEI-AQUI'; SYS.App.commit(['core'], {quiet:true}); });
  await sleep(2200); r = await t.snap();
  ok(r.nome === 'EDITEI-AQUI' && r.rNome === 'EDITEI-AQUI', 'edição local chegou na nuvem');
  ok(r.st === 'synced', 'status sincronizado');
  const dirty = await t.p.evaluate(() => SYS.Store.userDirty.core);
  ok(!dirty, 'guarda rearmada depois do eco da nuvem');
  await t.ctx.close();

  console.log('\n6 · primeira vez (sem cache, sem nuvem)');
  t = await boot(b, null, null); r = await t.snap();
  ok(t.errs.length === 0 && r.st !== 'error', 'abre normal (' + r.st + ')');
  await t.ctx.close();

  console.log('\n7 · sem cache local, nuvem com progresso (aparelho novo)');
  t = await boot(b, null, mk('NUVEM', h1, hoje, {A01:{s:'done', d0:hoje, d1:hoje}})); r = await t.snap();
  ok(r.nome === 'NUVEM' && r.a01 && r.rA01, 'aparelho novo recebe o progresso da nuvem');
  await t.ctx.close();

  const silent = (page, fn, arg) => page.evaluate(({fn, arg}) => { const k = 'data/users/u_test/core'; const R = JSON.parse(window.__mock.db[k]); (new Function('R', 'arg', fn))(R, arg); R._by = 'sOutroAparelho'; R._e = R._u; R._w = R._u; window.__mock.db[k] = JSON.stringify(R); }, {fn, arg});

  console.log('\n8 · sessão anterior só fez manutenção e fechou antes de sincronizar; a nuvem andou nesse meio-tempo');
  const m1 = new Date(Date.now() - 60000), h3 = new Date(Date.now() - 3 * 3600000);
  t = await boot(b, mk('LOCAL-MANUT', m1, hoje, null, d2), mk('REMOTO-1H', h1, ymd(d2), {A01:{s:'done', d0:hoje, d1:hoje}}), {core:{s:d2.toISOString(), d:0}});
  r = await t.snap();
  ok(r.nome === 'REMOTO-1H' && r.a01, 'carimbo local inflado pela manutenção não engana: a nuvem vence');
  ok(r.rNome === 'REMOTO-1H' && r.rA01, 'e a nuvem não foi sobrescrita');
  await t.ctx.close();

  console.log('\n9 · edição da pessoa pendente de outra sessão: vale a mais recente entre ela e a nuvem');
  t = await boot(b, mk('EDITEI-HA-3H', m1, hoje, {B01:{s:'done', d0:hoje, d1:hoje}}, h3), mk('REMOTO-1H', h1, ymd(d2), {A01:{s:'done', d0:hoje, d1:hoje}}), {core:{s:d2.toISOString(), d:1}});
  r = await t.snap();
  ok(r.nome === 'REMOTO-1H' && r.a01 && !r.b01, 'nuvem (1h atrás) é mais nova que a edição daqui (3h atrás): nuvem vence');
  await t.ctx.close();
  t = await boot(b, mk('EDITEI-HA-1H', m1, hoje, {B01:{s:'done', d0:hoje, d1:hoje}}, h1), mk('REMOTO-3H', h3, ymd(d2), {A01:{s:'done', d0:hoje, d1:hoje}}), {core:{s:d2.toISOString(), d:1}});
  r = await t.snap();
  ok(r.nome === 'EDITEI-HA-1H' && r.b01 && r.rNome === 'EDITEI-HA-1H' && r.rB01, 'edição daqui (1h atrás) é mais nova que a nuvem (3h atrás): sobe');
  await t.ctx.close();

  console.log('\n10 · aparelho sem cache: clicou em algo antes de a nuvem responder');
  t = await boot(b, null, mk('NUVEM-COM-TUDO', h1, hoje, {A01:{s:'done', d0:hoje, d1:hoje}}), null, 0);
  await t.p.evaluate(() => { try { SYS.App.S.profile.name = 'CLIQUE-RAPIDO'; SYS.App.commit(['core'], {quiet:true}); } catch (e) {} });
  await sleep(2600); r = await t.snap();
  ok(r.nome === 'NUVEM-COM-TUDO' && r.a01, 'o save da nuvem é adotado');
  ok(r.rNome === 'NUVEM-COM-TUDO' && r.rA01, 'um aparelho em branco nunca sobrescreve um save que existe');
  await t.ctx.close();

  console.log('\n11 · manutenção automática com a nuvem já adiante (o aviso ao vivo ainda não chegou)');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await silent(t.p, "R.profile.name = 'OUTRO-APARELHO'; R.nodes.B01 = {s:'done', d0:arg, d1:arg}; R._u = new Date(Date.now() + 2000).toISOString();", hoje);
  await t.p.evaluate(() => { SYS.Store.asAuto(() => { SYS.App.S.flags.zz = 1; SYS.App.commit(['core'], {quiet:true}); }); });
  await sleep(2600); r = await t.snap();
  ok(r.rNome === 'OUTRO-APARELHO' && r.rB01, 'a escrita automática conferiu a nuvem antes e NÃO gravou por cima');
  ok(r.nome === 'OUTRO-APARELHO' && r.b01, 'e a tela adotou o que estava na nuvem');
  await t.ctx.close();

  console.log('\n12 · virada do dia numa aba velha');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await silent(t.p, "R.profile.name = 'OUTRO-APARELHO'; R.nodes.B01 = {s:'done', d0:arg, d1:arg}; R._u = new Date(Date.now() + 2000).toISOString();", hoje);
  await t.p.evaluate(() => { const A = SYS.App; A._day = '2020-01-01'; A.S.lastSeen = '2020-01-01'; A.tick(); });
  await sleep(2600); r = await t.snap();
  ok(r.rNome === 'OUTRO-APARELHO' && r.rB01, 'a manutenção da virada não sobrescreveu o progresso do outro aparelho');
  ok(!(await t.p.evaluate(() => SYS.Store.userDirty.core)), 'virada do dia não conta como edição da pessoa');
  await t.ctx.close();

  console.log('\n13 · voltou do sono: confere a nuvem antes de liberar a edição');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await silent(t.p, "R.profile.name = 'ENQUANTO-DORMIA'; R.nodes.B01 = {s:'done', d0:arg, d1:arg}; R._u = new Date(Date.now() + 2000).toISOString();", hoje);
  const held = await t.p.evaluate(() => { SYS.Store.onWake(); return document.body.classList.contains('sy-hold'); });
  await sleep(700); r = await t.snap();
  ok(held, 'edição travada enquanto confere');
  ok(r.nome === 'ENQUANTO-DORMIA' && r.b01, 'o progresso feito em outro aparelho aparece ao acordar');
  ok(!(await t.p.evaluate(() => document.body.classList.contains('sy-hold') || SYS.Store.waking)), 'trava liberada em seguida');
  await t.ctx.close();

  console.log('\n14 · a trava da abertura solta sozinha');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)), null, 30);
  const h0 = await t.p.evaluate(() => document.body.classList.contains('sy-hold'));
  await sleep(900);
  const h1b = await t.p.evaluate(() => document.body.classList.contains('sy-hold'));
  ok(h0 && !h1b, 'travada nos primeiros instantes (' + h0 + ') e solta assim que a nuvem responde (' + h1b + ')');
  await t.ctx.close();

  console.log('\n15 · eco atrasado de uma gravação própria não desfaz a gravação seguinte');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await t.p.evaluate(() => { /* nuvem lenta: o eco de cada gravação chega 900 ms depois */
    const M = window.__mock, k = 'data/users/u_test/core', ref = SYS.Store.refs.core, snapOf = () => ({ exists: true, data: () => JSON.parse(M.db[k]), metadata: { fromCache: false, hasPendingWrites: false } });
    ref.set = (data) => { M.writes++; const body = JSON.stringify(data); return new Promise(res => setTimeout(() => { M.db[k] = body; res(); setTimeout(() => (M.listeners[k] || []).forEach(fn => fn({ exists: true, data: () => JSON.parse(body), metadata: { fromCache: false, hasPendingWrites: false } })), 900); }, 60)); };
    SYS.Store.asAuto(() => { SYS.App.S.flags.um = 1; SYS.App.commit(['core'], { quiet: true }); });
  });
  await sleep(1500);                                   /* a 1ª gravação saiu; o eco dela ainda está a caminho */
  await t.p.evaluate(() => { SYS.Store.asAuto(() => { SYS.App.S.flags.dois = 1; SYS.App.commit(['core'], { quiet: true }); }); });
  await sleep(700);                                    /* chega o eco da 1ª */
  let f = await t.p.evaluate(() => ({ um: SYS.App.S.flags.um, dois: SYS.App.S.flags.dois, adopted: SYS.Store.adopted.core || 0 }));
  ok(f.um === 1 && f.dois === 1 && f.adopted === 0, 'o eco da 1ª gravação chegou e a 2ª mudança continua na tela (adoções: ' + f.adopted + ')');
  await sleep(3500);
  f = await t.p.evaluate(() => { const R = JSON.parse(window.__mock.db['data/users/u_test/core']); return { r1: R.flags.um, r2: R.flags.dois, st: SYS.Store.status, by: R._by === SYS.Store.sid }; });
  ok(f.r1 === 1 && f.r2 === 1 && f.by, 'e a 2ª gravação também chegou na nuvem, marcada com a sessão desta aba (' + f.st + ')');
  await t.ctx.close();

  console.log('\n16 · duas abas no mesmo navegador: a outra aba não é confundida com eco próprio');
  t = await boot(b, JSON.parse(JSON.stringify(igual)), JSON.parse(JSON.stringify(igual)));
  await t.p.evaluate((hoje) => { const k = 'data/users/u_test/core'; const R = JSON.parse(window.__mock.db[k]); R.profile.name = 'OUTRA-ABA'; R.nodes.B01 = {s:'done', d0:hoje, d1:hoje}; R._by = 'sOutraAba123'; R._u = new Date(Date.now() + 5000).toISOString(); R._e = R._u; R._w = R._u; window.__mock.db[k] = JSON.stringify(R); (window.__mock.listeners[k] || []).forEach(fn => fn({exists:true, data:() => JSON.parse(window.__mock.db[k]), metadata:{fromCache:false, hasPendingWrites:false}})); }, hoje);
  await sleep(900); r = await t.snap();
  ok(r.nome === 'OUTRA-ABA' && r.b01, 'gravação de outra aba (outra sessão) é adotada normalmente');
  await t.ctx.close();

  console.log('\n=== ' + (fails ? fails + ' FALHA(S)' : 'tudo ok') + ' ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
