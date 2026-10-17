/* cityui · a interface da Cidade: carregamento "Take Your time.", a apresentação do Ivo (diálogo com retrato e holofote),
   a pilha de janelas (Janela do Caçador → Perfil/Inventário/Celular), modal por cima, sair da Cidade, sem rolar em 6 tamanhos
   de tela (deitada e em pé), digitar sem perder o foco, a espera do Examinador e a geometria das ruas */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME_NOT|fonts\.g/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await p.clock.install({ time: new Date('2026-10-14T10:00:00') });
  await p.goto(URL); await p.clock.runFor(1800);
  const run = async (ms) => { await p.clock.runFor(ms || 250); await sleep(30); };
  const go = async (h, ms) => { await p.evaluate(h => { location.hash = h; }, h); await run(ms || 300); };
  const rect = sel => p.evaluate(sel => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; }, sel);
  const top = () => p.evaluate(() => { const w = document.querySelector('#cyw.on .cyw-top'); return w ? { t: w.getAttribute('data-w'), txt: w.textContent } : null; });
  await p.evaluate(() => { const A = SYS.App; A.S.pz.on = false; A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); A.citySet(true); });
  await run(1500);

  sec('carregamento ao entrar na Cidade');
  await go('#/cidade', 200);
  let r = await p.evaluate(() => { const l = document.getElementById('cyload'), i = l && l.querySelector('img'); return { on: l && !l.hidden, src: i && i.getAttribute('src'), w: i && i.naturalWidth, t: l && l.textContent, talk: !!document.querySelector('#cytalk.on') }; });
  ok(r.on && /^img\/eu-loading\.[0-9a-f]{10}\.webp$/.test(r.src) && r.w === 540, 'a arte "Take Your time." cobre a troca de área (' + r.src + ', ' + r.w + ' px)');
  ok(/carregando a Cidade/.test(r.t) && !r.talk, 'com a legenda, e nada começa por baixo dele');
  await run(900);
  ok(await p.evaluate(() => document.getElementById('cyload').hidden), 'e sai sozinho em menos de 1 s');

  sec('a apresentação do Ivo');
  r = await p.evaluate(() => { const t = document.getElementById('cytalk'), i = t && t.querySelector('.cyt-por'); return { on: t && t.classList.contains('on'), name: t && t.querySelector('.cyt-name').textContent, src: i && i.getAttribute('src'), w: i && i.naturalWidth, n: t && t.querySelector('.cyt-n').textContent, txt: t && t.querySelector('.cyt-txt').textContent }; });
  ok(r.on && /Ivo Lint/.test(r.name) && /Casa de Babel/.test(r.name) && /representante/.test(r.name), 'na primeira vez, o Ivo aparece num diálogo com a placa do nome e do clã');
  ok(/^img\/ivo\.[0-9a-f]{10}\.webp$/.test(r.src) && r.w === 480, 'com o retrato dele na skin de representante (' + r.w + ' px, fundo transparente)');
  const full = await p.evaluate(() => SYS.CITY.FALAS.ivoIntro[0].t);
  ok(r.n === '1/7' && r.txt.length > 0 && r.txt.length < full.length && full.indexOf(r.txt) === 0, 'o texto vai aparecendo aos poucos (' + r.txt.length + ' de ' + full.length + ' letras)');
  await p.mouse.click(700, 300); await run(50);
  ok(await p.evaluate(() => document.querySelector('#cytalk .cyt-txt').textContent) === full, 'tocar completa a fala');
  await p.mouse.click(700, 300); await run(50);
  ok(await p.evaluate(() => document.querySelector('#cytalk .cyt-n').textContent) === '2/7', 'e tocar de novo passa para a próxima');
  for (let i = 0; i < 4; i++) { await p.keyboard.press('Enter'); await run(30); }
  /* o holofote desliza até o alvo (transição de CSS): confere o destino, não o meio do caminho */
  r = await p.evaluate(() => { const s = document.querySelector('#cytalk .cyt-spot'), m = document.querySelector('.cy-mini').getBoundingClientRect(), q = { left: parseFloat(s.style.left), top: parseFloat(s.style.top), right: parseFloat(s.style.left) + parseFloat(s.style.width), bottom: parseFloat(s.style.top) + parseFloat(s.style.height), width: parseFloat(s.style.width) }; return { n: document.querySelector('#cytalk .cyt-n').textContent, vis: !s.hidden, around: q.left <= m.left && q.top <= m.top && q.right >= m.right && q.bottom >= m.bottom && q.width < m.width + 40, round: s.style.borderRadius }; });
  ok(r.n === '4/7' && r.vis && r.around && r.round === '50%', 'a fala do radar acende um holofote redondo em volta do minimapa (Enter também avança)');
  await p.keyboard.press('Enter'); await p.keyboard.press('Enter'); await run(30);
  r = await p.evaluate(() => { const e = document.querySelector('#cytalk .cyt-spot'), s = { left: parseFloat(e.style.left), top: parseFloat(e.style.top), right: parseFloat(e.style.left) + parseFloat(e.style.width), bottom: parseFloat(e.style.top) + parseFloat(e.style.height) }, m = document.querySelector('.cy-me').getBoundingClientRect(); return { n: document.querySelector('#cytalk .cyt-n').textContent, around: s.left <= m.left && s.right >= m.right && s.top <= m.top && s.bottom >= m.bottom }; });
  ok(r.n === '5/7' && r.around, 'a fala da Janela do Caçador acende o botão com a sua foto');
  const w0 = await p.evaluate(() => window.__mock.writes);
  await p.keyboard.press('Escape'); await run(2500);
  r = await p.evaluate(() => { const k = Object.keys(window.__mock.db).find(k => /\/city$/.test(k)); return { on: !!document.querySelector('#cytalk.on'), vis: (SYS.App.city.vis || {}).ivo, cloud: k && (JSON.parse(window.__mock.db[k]).vis || {}).ivo, writes: window.__mock.writes }; });
  ok(!r.on && r.vis === '2026-10-14', 'Esc pula a apresentação, e ela fica marcada como vista');
  ok(r.cloud === '2026-10-14' && r.writes > w0, 'a marca vai para o save da Cidade na nuvem (vale para os outros aparelhos)');
  await go('#/status'); await go('#/cidade', 1300);
  ok(await p.evaluate(() => !document.querySelector('#cytalk.on')), 'voltando para a Cidade, o carregamento passa e o Ivo não repete');

  sec('Janela do Caçador: a janela que abre outras janelas');
  await p.click('.cy-me'); await run(); await sleep(150);
  r = await p.evaluate(() => { const i = document.querySelector('#cyw .cy-hub-ph'); return { w: document.querySelector('#cyw.on .cyw-top').getAttribute('data-w'), tiles: Array.from(document.querySelectorAll('#cyw .cy-tile')).map(t => (t.classList.contains('off') ? '-' : '') + t.querySelector('b').textContent).join('|'), src: i && i.getAttribute('src'), iw: i && i.naturalWidth }; });
  ok(r.w === 'hub' && r.tiles === 'Perfil do Caçador|Inventário|Celular|Arsenal|Relíquias|Fundo e vales|Sala de Troféus|-Clãs|-Laços', 'abre com Perfil, Inventário, Celular e as 4 janelas das Recompensas; Clãs e Laços aparecem trancados (' + r.tiles + ')');
  ok(/^img\/eu-perfil\.[0-9a-f]{10}\.webp$/.test(r.src) && r.iw === 480, 'com o seu retrato sem a frase');
  await p.click('#cyw [data-w="perfil"]'); await run();
  r = await p.evaluate(() => ({ w: Array.from(document.querySelectorAll('#cyw .cyw-win')).map(x => x.getAttribute('data-w') + (x.classList.contains('cyw-under') ? '(atrás)' : '')).join(' '), lic: !!document.querySelector('#cyw .cyw-top .cy-lic'), txt: document.querySelector('#cyw .cyw-top').textContent }));
  ok(r.w === 'hub(atrás) perfil' && r.lic && /Portais fechados/.test(r.txt), 'Perfil do Caçador abre por cima, com a Licença e os números; a Janela do Caçador fica atrás');
  await p.click('#cyw .cyw-top .cyw-bk'); await run();
  ok((await top()).t === 'hub', '← volta para a Janela do Caçador');
  await p.click('#cyw [data-w="inv"]'); await run();
  ok((await top()).t === 'inv', 'Inventário abre');
  await p.keyboard.press('Escape'); await run();
  ok((await top()).t === 'hub', 'Esc volta uma janela');
  await p.click('#cyw [data-w="phone"]'); await run();
  ok((await top()).t === 'phone' && await p.evaluate(() => !!document.querySelector('#cyw .cy-phonewin .cy-msg')), 'o Celular abre com as mensagens da Cidade');
  await p.click('#cyw .cyw-top .cyw-x'); await run();
  ok(await p.evaluate(() => !document.querySelector('#cyw.on') && !(SYS.App.ui.cyw || []).length), '✕ fecha a pilha inteira');

  sec('modal do Sistema por cima de uma janela');
  await p.click('.cy-me'); await run();
  await p.evaluate(() => { SYS.App.ui.modal = {type: 'confirm', title: 'Teste de modal', body: 'x', act: 'closeModal'}; SYS.App.renderModal(); }); await run();
  ok(await p.evaluate(() => document.getElementById('cyw').classList.contains('dim') && !!document.querySelector('.modal .win')), 'a janela escurece embaixo do modal');
  await p.keyboard.press('Escape'); await run();
  ok(await p.evaluate(() => !SYS.App.ui.modal && !!document.querySelector('#cyw.on') && !document.getElementById('cyw').classList.contains('dim')), 'Esc fecha só o modal; a janela continua lá');
  await p.evaluate(() => { SYS.App.cyWinOpen({t: 'dist', id: 'galeria'}, {reset: true}); }); await run();
  await go('#/status');
  r = await p.evaluate(() => ({ win: !!document.querySelector('#cyw.on'), full: document.documentElement.classList.contains('cy-full'), h: document.getElementById('view').style.height }));
  ok(!r.win && !r.full && !r.h, 'sair da Cidade fecha as janelas e devolve a página normal');

  sec('sem rolar, em 6 tamanhos de tela');
  await go('#/cidade', 1300);
  for (const [w, h, or] of [[1366, 768, 'land'], [1920, 1080, 'land'], [1024, 768, 'land'], [768, 1024, 'port'], [390, 844, 'port'], [360, 640, 'port']]) {
    await p.setViewportSize({ width: w, height: h }); await sleep(80); await p.evaluate(() => window.dispatchEvent(new Event('resize'))); await run(400);
    r = await p.evaluate(() => { const se = document.scrollingElement, st = document.getElementById('cyStage').getBoundingClientRect(), inS = sel => { const q = document.querySelector(sel).getBoundingClientRect(); return q.left >= st.left - 1 && q.right <= st.right + 1 && q.top >= st.top - 1 && q.bottom <= st.bottom + 1; };
      return { sh: se.scrollHeight, sw: se.scrollWidth, ih: innerHeight, iw: innerWidth, or: SYS.App.ui.cy.or, cls: document.getElementById('cyStage').className, hud: inS('.cy-me') && inS('.cy-mini'), svg: inS('.cy-svg') }; });
    ok(r.sh <= r.ih && r.sw <= r.iw && r.or === or && r.cls.indexOf('cy-' + or) >= 0 && r.hud && r.svg, w + '×' + h + ': ' + (or === 'land' ? 'deitada' : 'em pé') + ', sem rolagem (' + r.sw + '×' + r.sh + '), HUD e mapa dentro da tela');
  }
  await p.setViewportSize({ width: 1366, height: 768 }); await run(400);

  sec('digitar numa janela não perde o foco');
  await p.evaluate(() => { const A = SYS.App, C = A.city; C.portals.push({id: 'pt1', n: 'Portal de Teste', d: 'escritorio', way: 'founder', rua: 0, r: 'B', st: 'open', born: '2026-10-14T11:00:00.000Z', due: '2026-10-21T11:00:00.000Z', mods: [], crit: ['Um', 'Dois', 'Três'], obj: 'Escreva.', ent: 'O texto.', lore: 'Telefones.', min: 240, in: '2026-10-14T12:00:00.000Z'}); C.lic.r = 'C'; A.commit(['city']); A.cyWinOpen({t: 'portal', id: 'pt1'}, {reset: true}); });
  await run();
  await p.click('#cyw textarea[data-i="cyDraft"]'); await p.keyboard.type('primeira linha');
  await p.evaluate(() => SYS.App.commit(['city'])); await run();
  await p.keyboard.type(' e o resto');
  r = await p.evaluate(() => ({ v: document.querySelector('#cyw textarea[data-i="cyDraft"]').value, f: document.activeElement && document.activeElement.getAttribute('data-i') }));
  ok(r.v === 'primeira linha e o resto' && r.f === 'cyDraft', 'um salvamento no meio da digitação não redesenha a janela por baixo dos dedos');

  sec('a espera do Examinador');
  await p.fill('#cyw textarea[data-i="cyEn"][data-f="txt"]', 'Texto completo com as três partes pedidas, revisado duas vezes, com exemplos e a lista do que mudou no fim.');
  await p.click('#cyw [data-a="cyGrade"]'); await run(100);
  r = await p.evaluate(() => { const i = document.querySelector('#cyw .cy-wait img'); return { src: i && i.getAttribute('src'), txt: (document.querySelector('#cyw .cy-wait') || {}).textContent }; });
  ok(/^img\/eu-loading\./.test(r.src || '') && /leva o tempo que precisar/.test(r.txt || ''), 'enquanto o Examinador lê, a janela mostra o "Take Your time."');
  await run(900);
  ok(await p.evaluate(() => !document.querySelector('#cyw .cy-wait') && (SYS.App.city.portals.find(x => x.id === 'pt1').nt || {}).nota === 82), 'e some quando a nota chega');
  await p.click('#cyw .cyw-top .cyw-x'); await run();

  sec('geometria: ruas e portais dentro dos bairros, nas duas orientações');
  r = await p.evaluate(() => {
    const ins = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const out = {};
    ['land', 'port'].forEach(or => {
      const g = SYS.App.cyGeo(or); let bad = 0, n = 0, len = 1e9;
      SYS.CITY.DIST.forEach(d => g.z[d.id].ruas.forEach(rr => { n++; const L = Math.hypot(rr[1][0] - rr[0][0], rr[1][1] - rr[0][1]); len = Math.min(len, L); if (!ins(g.z[d.id].P, rr[0][0], rr[0][1]) || !ins(g.z[d.id].P, rr[1][0], rr[1][1])) bad++; }));
      const mk = SYS.App.cyMarks(or, SYS.App.cyState).filter(m => !ins(g.z[m.p.d].P, m.x, m.y)).length;
      out[or] = { n, bad, len: Math.round(len), mk };
    });
    return out;
  });
  ok(r.land.n === 24 && r.land.bad === 0 && r.port.bad === 0 && r.land.len >= 46 && r.port.len >= 46, '24 ruas principais, todas dentro do bairro delas e com pelo menos ' + Math.min(r.land.len, r.port.len) + ' de comprimento');
  ok(r.land.mk === 0 && r.port.mk === 0, 'todo portal fica numa rua do próprio bairro, deitado e em pé');
  ok(errs.length === 0, 'sem erro de JS ' + errs.slice(0, 3).join(' | '));
  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
