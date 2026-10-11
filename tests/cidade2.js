/* cidade2 · jogar na tela: portais no mapa, janela do portal com odds, entrar, entregar, nota do Examinador (IA e manual),
   revelação do drop, inventário e celular na Janela do Caçador, Licença no Perfil e Mercado Fechado */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 1000 } }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME_NOT|fonts\.g/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await p.clock.install({ time: new Date('2026-10-14T10:00:00') });
  await p.goto(URL); await p.clock.runFor(1800);
  const run = async (ms) => { await p.clock.runFor(ms || 300); await sleep(40); };
  await p.evaluate(() => { const A = SYS.App; A.S.pz.on = false; A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); A.citySet(true); A.city.vis = {ivo: '2026-10-14'}; location.hash = '#/cidade'; });
  await run(1500);

  sec('portais no mapa, no radar e no celular');
  const top = () => p.evaluate(() => { const w = document.querySelector('#cyw.on .cyw-top'); return w ? w.textContent : ''; });
  await p.click('.cy-mini'); await run();
  let r = await p.evaluate(() => ({ n: SYS.App.city.portals.length, badges: document.querySelectorAll('.cy-svg .cy-badge[data-a="cyOpen"]').length, radar: document.querySelector('#cyw .cy-radarwin').textContent }));
  await p.click('#cyw [data-tab="portais"]'); await run();
  r.rows = await p.evaluate(() => document.querySelectorAll('#cyw .cy-prow').length);
  ok(r.n === 3 && r.rows === 3 && r.badges === 3, 'ligar a Cidade faz nascer os 3 portais do dia: no mapa e na lista do radar');
  ok(/3 de 6 abertos/.test(r.radar) && /amanhã, no reset das 08:00/.test(r.radar), 'o radar conta os abertos e diz quando nasce o próximo');
  await p.click('#cyw .cyw-top .cyw-x'); await run();
  await p.click('.cy-me'); await run(); await p.click('#cyw [data-w="phone"]'); await run();
  r = { phone: await top() };
  await p.click('#cyw .cyw-top .cyw-bk'); await run(); await p.click('#cyw [data-w="perfil"]'); await run();
  r.lic = await p.evaluate(() => !!document.querySelector('#cyw .cyw-top .cy-lic') && /Pontos de Caça/.test(document.querySelector('#cyw .cyw-top').textContent));
  ok(/nasceu em/.test(r.phone) && r.lic, 'na Janela do Caçador: o celular avisa o nascimento e o Perfil mostra a Licença');
  await p.keyboard.press('Escape'); await p.keyboard.press('Escape'); await run();

  sec('ficha, entrar e entregar um exercício');
  const pid = await p.evaluate(() => (SYS.App.city.portals.find(x => x.r === 'E' || x.r === 'D')).id);
  await p.click('.cy-svg .cy-badge[data-id="' + pid + '"]'); await run();
  r = await p.evaluate(() => { const w = document.querySelector('#cyw.on .cyw-top[data-w="portal"]'); return { open: !!w, txt: w ? w.textContent : '', odds: document.querySelectorAll('#cyw .cy-odd').length }; });
  ok(r.open && /Drop previsto/.test(r.txt) && /Garantido/.test(r.txt) && r.odds === 6, 'clicar na insígnia do mapa abre a janela do portal com o drop previsto e as 6 raridades');
  await p.click('[data-a="cyEnter"]'); await run();
  const prova = await p.evaluate((pid) => SYS.CITY.RANK[SYS.App.city.portals.find(x => x.id === pid).r].prova, pid);
  await p.fill('textarea[data-i="cyDraft"]', 'Comecei pelo tópico e anotei duas dúvidas sobre o limite.'); await run(900);
  ok(await p.evaluate((pid) => /duas dúvidas/.test(SYS.App.city.portals.find(x => x.id === pid).dr || ''), pid), 'o rascunho fica salvo no portal');
  await p.fill('input[data-i="cyEn"][data-f="txt"]', 'ok'); await p.click('[data-a="cyClose"]'); await run();
  ok(/linha/.test(await p.evaluate((pid) => document.getElementById('cyErr-' + pid).textContent, pid)), 'entrega curta demais é recusada com o motivo');
  await p.fill('input[data-i="cyEn"][data-f="txt"]', 'Fiz o exercício inteiro e anotei o que ainda não entendi.');
  if (prova === 'resultado') await p.fill('input[data-i="cyEn"][data-f="res"]', '3 variações, 1 falhou de propósito');
  const gem0 = await p.evaluate(() => SYS.App.D.gem);
  await p.click('[data-a="cyClose"]'); await run();
  r = await p.evaluate(() => ({ modal: !!document.querySelector('.cy-reveal'), cards: document.querySelectorAll('.cy-card').length, ocultas: document.querySelectorAll('.cy-card:not(.on)').length }));
  ok(r.modal && r.cards >= 1 && r.ocultas === r.cards, 'fechou: a revelação abre com as rolagens ainda viradas');
  await p.click('[data-a="cyReveal"]'); await run();
  ok(await p.evaluate(() => document.querySelectorAll('.cy-card.on').length) === 1, 'Revelar vira uma de cada vez');
  if (await p.$('[data-a="cyRevealAll"]')) { await p.click('[data-a="cyRevealAll"]'); await run(); }
  r = await p.evaluate(() => ({ on: document.querySelectorAll('.cy-card.on').length, all: document.querySelectorAll('.cy-card').length, gem: SYS.App.D.gem, pts: SYS.App.city.lic.pts, n: SYS.App.city.portals.length }));
  ok(r.on === r.all && r.gem > gem0 && r.pts >= 1 && r.n === 2 && !(await p.evaluate(() => !!document.querySelector('#cyw .cyw-win[data-w="portal"]'))), 'tudo revelado; ◆ no saldo, Pontos na Licença, o portal saiu do mapa e a janela dele fechou');
  await p.click('.modal [data-a="closeModal"]'); await run();
  await p.click('.cy-me'); await run(); await p.click('#cyw [data-w="phone"]'); await run();
  ok(/Fechou/.test(await top()), 'o celular registra o portal fechado com o drop');
  await p.click('#cyw .cyw-top .cyw-x'); await run();

  sec('B com nota do Examinador');
  await p.evaluate(() => { const A = SYS.App, C = A.city; C.lic.r = 'C'; C.portals.push({id: 'pb1', n: 'Projeto de Teste', d: 'escritorio', way: 'founder', rua: 0, r: 'B', st: 'open', born: '2026-10-14T11:00:00.000Z', due: '2026-10-21T11:00:00.000Z', mods: [], crit: ['Tem começo, meio e fim', 'Mostra números', 'Cabe em 2 páginas'], obj: 'Monte um case.', ent: 'O case.', lore: 'Telefones tocam no andar vazio.', min: 240, in: null}); A.commit(['city']); });
  await run();
  await p.click('.cy-svg .cy-badge[data-id="pb1"]'); await run(); await p.click('[data-a="cyEnter"]'); await run();
  await p.fill('textarea[data-i="cyEn"][data-f="txt"]', 'Case completo: problema da loja, o que fiz em quatro sessões, números de antes e depois, e o que faria diferente.');
  await p.click('[data-a="cyGrade"]'); await run(900);
  r = await p.evaluate(() => ({ nt: SYS.App.city.portals.find(x => x.id === 'pb1').nt, txt: document.querySelector('#cyw .cyw-top').textContent, prompts: window.__mock.samples.length }));
  ok(r.nt && r.nt.nota === 82 && r.nt.src === 'ia' && /Nota 82/.test(r.txt), 'o Examinador corrige o entregável (nota 82) e a nota fica no portal');
  await p.click('[data-a="cyClose"]'); await run();
  r = await p.evaluate(() => ({ modal: !!document.querySelector('.cy-reveal'), pts: SYS.App.city.lic.pts, chave: SYS.App.city.ult.res.gar.chave, err: (document.getElementById('cyErr-pb1') || {}).textContent, ult: SYS.App.city.ult.p.id }));
  ok(r.modal && r.chave === 'E', 'nota acima de 65 fecha o B, com a chave E garantida');
  await p.click('.modal [data-a="closeModal"]'); await run(400);
  r = await p.evaluate(() => SYS.App.ui.modal);
  ok(r && r.type === 'levelup', 'o level up que veio junto espera a revelação fechar e aparece depois');
  await p.evaluate(() => SYS.App.A.closeModal()); await run();

  sec('autoavaliação quando a IA não está disponível');
  await p.evaluate(() => { const A = SYS.App, C = A.city; A.sampleOff = true; C.portals.push({id: 'pb2', n: 'Outro Projeto', d: 'galeria', way: 'flaneur', rua: 1, r: 'B', st: 'open', born: '2026-10-14T11:00:00.000Z', due: '2026-10-21T11:00:00.000Z', mods: [], crit: ['Um', 'Dois', 'Três'], obj: 'Escreva.', ent: 'O texto.', lore: 'Vitrines.', min: 240, in: '2026-10-14T12:00:00.000Z'}); A.commit(['city']); });
  await run(); await p.click('.cy-svg .cy-badge[data-id="pb2"]'); await run();
  await p.fill('textarea[data-i="cyEn"][data-f="txt"]', 'Texto completo com as três partes pedidas, revisado duas vezes e com a lista do que mudou.');
  for (const i of [0, 1, 2]) await p.check('input[data-c="cyMan"][data-i2="' + i + '"]');
  await p.click('[data-a="cyManual"]'); await run();
  ok(await p.evaluate(() => { const x = SYS.App.city.portals.find(y => y.id === 'pb2').nt; return x && x.src === 'manual' && x.nota >= 65; }), 'os 3 critérios marcados viram nota de autoavaliação suficiente');
  await p.click('[data-a="cyClose"]'); await run();
  ok(await p.evaluate(() => !!document.querySelector('.cy-reveal') && !SYS.App.city.portals.some(x => x.id === 'pb2')), 'e o B fecha');
  await p.click('.modal [data-a="closeModal"]'); await run();
  await p.evaluate(() => { SYS.App.sampleOff = false; });

  sec('Mercado Fechado, inventário e Licença no Perfil');
  await p.evaluate(() => { const A = SYS.App, C = A.city; C.portals.push({id: 'pm1', n: 'Portal Selado', d: 'agencia', way: 'navigation', rua: 0, r: 'C', st: 'open', born: '2026-10-14T11:00:00.000Z', due: '2026-10-17T11:00:00.000Z', mods: ['mercado_fechado'], crit: ['a', 'b', 'c'], obj: 'x', ent: 'y', lore: 'z', min: 60, in: '2026-10-14T12:00:00.000Z'}); A.commit(['city']); A.ui.modal = null; A.ui.modalNext = null; A.renderModal(); document.getElementById('toasts').innerHTML = ''; A.A.sysBuyOpen({getAttribute: k => k === 'data-k' ? 'key' : 'E'}); });
  await run();
  r = await p.evaluate(() => ({ toast: document.getElementById('toasts').textContent, modal: !!SYS.App.ui.modal }));
  ok(/Loja selada/.test(r.toast) && /Mercado Fechado/.test(r.toast) && !r.modal, 'com um portal de Mercado Fechado começado, a loja fica selada');
  await p.click('.cy-me'); await run(); await p.click('#cyw [data-w="inv"]'); await run();
  ok(/Inventário/.test(await top()) && /Caixas, vales/.test(await top()), 'o inventário da Cidade abre pela Janela do Caçador');
  await p.keyboard.press('Escape'); await run();
  ok(/Perfil, inventário e celular/.test(await top()), 'Esc volta para a Janela do Caçador');
  await p.keyboard.press('Escape'); await run();
  await p.evaluate(() => { location.hash = '#/perfil'; }); await run();
  ok(await p.evaluate(() => !!document.querySelector('#view .cy-lic') && /Pontos de Caça/.test(document.querySelector('#view .cy-lic').textContent)), 'a carteirinha da Licença aparece no Perfil');

  sec('celular');
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => { location.hash = '#/cidade'; }); await run(600);
  r = await p.evaluate(() => ({ sw: document.scrollingElement.scrollWidth, sh: document.scrollingElement.scrollHeight, ih: innerHeight }));
  ok(r.sw <= 390 && r.sh <= r.ih, 'a aba inteira cabe em 390 px, sem rolar (' + r.sw + ' × ' + r.sh + ')');
  ok(errs.length === 0, 'sem erro de JS ' + errs.slice(0, 3).join(' | '));
  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
