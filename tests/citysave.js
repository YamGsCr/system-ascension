/* citysave · o 4º documento (city): save do v13 sem ele, ligar a Cidade, dois aparelhos, divergência,
   limite de tamanho, exportar/importar, resetar e a página antiga (v15) convivendo com a nova */
const H = require('./mdevlib.js'); const { sleep } = H;
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
let fails = 0, oks = 0; const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const CITY = 'data/users/u_test/city', JOURNAL = 'data/users/u_test/journal';
const OFF = 's.pz.on = false; s.pz.intro = 1;';
const city = (C) => { const b = C.docs.get(CITY); return b ? JSON.parse(b) : null; };
const st = (dev) => dev.ev(() => { const A = SYS.App, S = SYS.Store; return { on: !!A.S.settings.cityBeta, since: A.city.since, v: A.city.v, dists: Object.keys(A.city.dist).length, closed: A.city.dist.estudio.closed, status: S.status, err: S.err, nav: !!document.querySelector('#side a[href="#/cidade"]'), lost: Object.keys(JSON.parse(localStorage.getItem('sysasc.lost.v1') || '{}')), local: !!localStorage.getItem('sysasc.city.v1') }; });
const ligar = (dev) => dev.ev(() => { location.hash = '#/perfil'; return new Promise(r => setTimeout(() => { document.querySelector('input[data-c="pCity"]').click(); r(); }, 400)); });
const editCity = (dev, n) => dev.ev((n) => { const A = SYS.App; A.city.dist.estudio.closed = n; A.commit(['city']); }, n);
const only = process.argv[2] || '';
const want = n => !only || only.split(',').indexOf(n) >= 0;

/* a versão publicada antes da Cidade (tag v15), montada do histórico do git, para testar a convivência */
function oldBuild(){
  try {
    const root = path.join(__dirname, '..');
    cp.execSync('git rev-parse --verify --quiet v15^{commit}', { cwd: root, stdio: 'ignore' });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sysasc-v15-'));
    cp.execSync('git archive v15 | tar -x -C "' + dir + '"', { cwd: root, stdio: 'ignore', shell: '/bin/bash' });
    cp.execSync('python3 build.py', { cwd: dir, stdio: 'ignore' });
    const page = path.join(dir, 'dist', 'test_nomock.html');
    return fs.existsSync(page) ? 'file://' + page : null;
  } catch (e) { return null; }
}

(async () => {
  const b = await H.chromium.launch();

  if (want('1')) {
    sec('1 · save do v13 (três documentos) abre sem a Cidade e não grava nada dela');
    const base = await H.baseState(b, OFF);
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(4500);
    const a = await st(A);
    ok(!a.on && a.since === '' && a.v === 2 && a.dists === 7, 'a Cidade nasce vazia na memória, desligada, com os 7 distritos e a versão atual do documento');
    ok(!C.docs.has(CITY) && !a.local, 'nenhum documento city na nuvem nem no navegador enquanto a Cidade está desligada');
    ok(a.status === 'synced', 'sincronizado como antes (' + a.status + ')');
    const sizes = await A.ev(() => { location.hash = '#/perfil'; return new Promise(r => setTimeout(() => r(document.getElementById('view').innerText), 400)); });
    ok(/Cidade/.test(sizes) && /250 KB/.test(sizes), 'os Ajustes mostram o tamanho dos quatro saves, com a Cidade');
    ok(A.errs.length === 0, 'sem erro de JS ' + A.errs.slice(0, 2).join(' | '));
    await A.ctx.close();
  }

  if (want('2')) {
    sec('2 · ligar a Cidade grava o 4º documento, e o outro aparelho adota');
    const base = await H.baseState(b, OFF);
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(4000);
    await ligar(A); await sleep(3500);
    const a = await st(A), c = city(C);
    ok(a.on && a.nav && /\d{4}-\d\d-\d\d/.test(a.since), 'a chave liga, o botão Cidade aparece no menu e a data de entrada fica guardada');
    ok(c && c.since === a.since && c.v === 2 && Object.keys(c.dist).length === 7 && c.portals.length === 3, 'o documento city chegou na nuvem com a data, a versão, os 7 distritos e os 3 portais do dia');
    ok(c && c._u && c._e && c._e <= c._u && c._w === c._u && c._by, 'com os carimbos da guarda (_u, _e, _w, _by): a edição foi a chave, o nascimento foi manutenção');
    ok(c && !('_b' in c) && !('_bx' in c) && !('_b0' in c), 'sem as marcas locais do aparelho');
    ok(C.core() && C.core().settings.cityBeta === true, 'a chave mora no progresso (core), então vale em todo aparelho');
    const B = await H.openDevice(b, C, 'B', {});
    await sleep(5000);
    const bb = await st(B);
    ok(bb.on && bb.since === a.since && bb.nav, 'aparelho novo adota o progresso e a Cidade: chave ligada e mesma data');
    await editCity(A, 5); await sleep(3000);
    ok((await st(B)).closed === 5, 'mudança na Cidade feita num aparelho aparece no outro ao vivo');
    const w0 = C.writes; await sleep(8000);
    ok(C.writes - w0 <= 1, 'parados, os dois não ficam regravando a Cidade (' + (C.writes - w0) + ' gravação)');
    ok(A.errs.length + B.errs.length === 0, 'sem erro de JS ' + A.errs.concat(B.errs).slice(0, 2).join(' | '));
    await A.ctx.close(); await B.ctx.close();
  }

  if (want('3')) {
    sec('3 · dois aparelhos sem sinal mexem na Cidade: vale a edição mais nova, a outra fica guardada');
    const base = await H.baseState(b, OFF + ' s.settings.cityBeta = true;');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(3500); await editCity(A, 1); await sleep(3000);
    const B = await H.openDevice(b, C, 'B', {});
    await sleep(4500);
    ok((await st(B)).closed === 1, 'os dois partem da mesma Cidade');
    A.offline = true; B.offline = true;
    await editCity(A, 7); await sleep(400); await editCity(B, 9);
    await sleep(1500);
    A.offline = false; B.offline = false;
    await A.ev(() => SYS.Store.onWake()); await B.ev(() => SYS.Store.onWake());
    /* espera a convergência (até 30 s): sob carga a nuvem simulada demora mais a circular */
    for (let t = 0; t < 60; t++) { await sleep(500); const c0 = city(C), a0 = await st(A), b0 = await st(B); if (t >= 12 && c0 && c0.dist.estudio.closed === 9 && a0.closed === 9 && b0.closed === 9 && a0.lost.indexOf('city') >= 0) break; }
    const a = await st(A), bb = await st(B), c = city(C);
    ok(c && c.dist.estudio.closed === 9, 'na nuvem ficou a edição mais nova (9)');
    ok(a.closed === 9 && bb.closed === 9, 'e os dois aparelhos terminam iguais (' + a.closed + ' / ' + bb.closed + ')');
    ok(a.lost.indexOf('city') >= 0, 'a versão que perdeu (7) ficou guardada no aparelho A para o Exportar save');
    const exp = await A.ev(() => JSON.parse(SYS.App.saveJSON()));
    ok(exp.conflito && exp.conflito.city && exp.conflito.city.doc.dist.estudio.closed === 7, 'e sai junto no arquivo exportado');
    await A.ctx.close(); await B.ctx.close();
  }

  if (want('4')) {
    sec('4 · limite de tamanho: a Cidade grande demais para de subir, o resto continua');
    const base = await H.baseState(b, OFF + ' s.settings.cityBeta = true;');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(3500); await editCity(A, 2); await sleep(3000);
    const before = C.docs.get(CITY);
    await A.ev(() => { const A = SYS.App, big = 'x'.repeat(1500); for (let i = 0; i < 200; i++) A.city.log.push({at: '2026-10-08', k: 'teste', t: big}); A.city.dist.estudio.closed = 3; A.commit(['city']); });
    await sleep(3000);
    const a = await st(A);
    ok(a.status === 'error' && /Cidade/.test(a.err || ''), 'o status vira erro, com o nome do save: "' + (a.err || '').slice(0, 70) + '…"');
    ok(C.docs.get(CITY) === before, 'a nuvem ficou com a última Cidade válida (nada cortado pela metade)');
    ok(a.local && a.closed === 3, 'neste navegador a Cidade continua inteira');
    await A.ev(() => { SYS.App.S.profile.name = 'DEPOIS-DO-LIMITE'; SYS.App.commit(['core']); }); await sleep(3000);
    ok(C.core().profile.name === 'DEPOIS-DO-LIMITE', 'o progresso (core) segue subindo normalmente');
    const pr = await A.ev(() => { SYS.App.city.log = []; for (let i = 0; i < 400; i++) SYS.App.city.log.push({at: '2026-10-08', k: 'x'}); SYS.App.commit(['city']); return SYS.App.city.log.length; });
    ok(pr === 300, 'o histórico da Cidade tem teto de 300 entradas (' + pr + ')');
    await sleep(3000);
    ok(city(C) && city(C).log.length === 300, 'e, de volta ao tamanho normal, a Cidade volta a subir');
    await A.ctx.close();
  }

  if (want('5')) {
    sec('5 · exportar leva a Cidade; importar devolve; arquivo antigo e resetar zeram');
    const base = await H.baseState(b, OFF + ' s.settings.cityBeta = true;');
    const C = H.mkCloud(); C.put(H.CORE, base);
    const A = await H.openDevice(b, C, 'A', { seed: { 'sysasc.core.v1': base } });
    await sleep(3500);
    await A.ev(() => { const A = SYS.App; A.city.since = '2026-10-01'; A.city.dist.piscinas.corr = 2; A.commit(['city']); });
    await sleep(2500);
    const o = await A.ev(() => JSON.parse(SYS.App.saveJSON()));
    ok(o.v === 2 && o.city && o.city.since === '2026-10-01' && o.city.dist.piscinas.corr === 2, 'o arquivo exportado é a versão 2 e carrega a Cidade');
    ok(!('_b' in o.city) && !('_bx' in o.city), 'sem as marcas locais do aparelho');
    await A.ev(() => { const A = SYS.App; A.city.since = '2026-12-25'; A.city.dist.piscinas.corr = 0; A.commit(['city']); });
    await A.ev((o) => { const A = SYS.App; A.ui.modal = {type: 'import', data: o}; A.renderModal(); A.A.importDo(); }, o);
    await sleep(3000);
    let a = await A.ev(() => ({ since: SYS.App.city.since, corr: SYS.App.city.dist.piscinas.corr }));
    ok(a.since === '2026-10-01' && a.corr === 2 && city(C).since === '2026-10-01', 'importar devolve a Cidade do arquivo, aqui e na nuvem');
    const v1 = JSON.parse(JSON.stringify(o)); v1.v = 1; delete v1.city;
    const txt = await A.ev((v1) => { const A = SYS.App; A.ui.modal = {type: 'import', data: v1}; A.renderModal(); return document.getElementById('modal').innerText; }, v1);
    ok(/antes da Cidade/.test(txt), 'o aviso do arquivo antigo (sem Cidade) diz que ela volta ao começo');
    await A.ev(() => SYS.App.A.importDo()); await sleep(3000);
    a = await A.ev(() => ({ since: SYS.App.city.since, dists: Object.keys(SYS.App.city.dist).length }));
    ok(a.since === '' && a.dists === 7 && city(C).since === '', 'importar o arquivo antigo zera a Cidade, aqui e na nuvem');
    await A.ev(() => { const A = SYS.App; A.city.since = '2026-10-02'; A.commit(['city']); A.ui.modal = {type: 'reset', txt: 'RESETAR'}; A.A.resetDo(); });
    await sleep(3000);
    a = await st(A);
    ok(a.since === '' && !a.on && city(C).since === '' && C.core().settings.cityBeta === false, 'resetar apaga a Cidade e desliga a chave, aqui e na nuvem');
    ok(A.errs.length === 0, 'sem erro de JS ' + A.errs.slice(0, 2).join(' | '));
    await A.ctx.close();
  }

  if (want('6')) {
    sec('6 · a página antiga (v15, sem Cidade) aberta em outro aparelho');
    const OLD = oldBuild();
    if (!OLD) console.log('  (pulado: a tag v15 não está neste clone; no CI o checkout traz o histórico inteiro)');
    else {
      const base = await H.baseState(b, OFF + ' s.settings.cityBeta = true;');
      const C = H.mkCloud(); C.put(H.CORE, base);
      const N = await H.openDevice(b, C, 'N', { seed: { 'sysasc.core.v1': base } });
      await sleep(3500); await editCity(N, 4); await sleep(3000);
      const O = await H.openDevice(b, C, 'O', { url: OLD });
      await sleep(4500);
      const old = await O.ev(() => ({ city: !!(window.SYS && SYS.CITY), name: SYS.App.S.profile.name }));
      ok(!old.city && old.name === 'BASE', 'a página antiga abre o mesmo save (e não conhece a Cidade)');
      await O.ev(() => { SYS.App.S.profile.name = 'ESCRITO-NA-ANTIGA'; SYS.App.commit(['core']); });
      await sleep(4000);
      ok(C.core().profile.name === 'ESCRITO-NA-ANTIGA' && C.core().settings.cityBeta === true, 'o que a antiga grava no progresso mantém a chave da Cidade ligada');
      ok(city(C) && city(C).dist.estudio.closed === 4, 'e ela nunca toca no documento city');
      const n = await st(N);
      ok(n.on && n.closed === 4 && (await N.ev(() => SYS.App.S.profile.name)) === 'ESCRITO-NA-ANTIGA', 'o aparelho novo adota o progresso e segue com a Cidade intacta');
      ok(N.errs.length === 0, 'sem erro de JS no aparelho novo ' + N.errs.slice(0, 2).join(' | '));
      await N.ctx.close(); await O.ctx.close();
    }
  }

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
