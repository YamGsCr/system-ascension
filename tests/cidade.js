/* cidade · a aba (beta): chave nos Ajustes, menu, radar, mapa dos 7 distritos e do Centro, insígnias de rank,
   corrupção (dados e prévia), teclado, celular e animações desligadas */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(b, when, vp){
  const ctx = await b.newContext({ viewport: vp || { width: 1366, height: 1000 } });
  const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME_NOT|fonts\.g/.test(m.text())) p.errs.push('console: ' + m.text().slice(0, 200)); });
  await p.clock.install({ time: new Date(when) });
  await p.goto(URL); await p.clock.runFor(1800);
  await p.evaluate(() => { const A = SYS.App; A.S.pz.on = false; A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); });
  return { p, ctx };
}
const go = async (p, h) => { await p.evaluate(h => { location.hash = h; }, h); await p.clock.runFor(400); await sleep(40); };
const view = p => p.evaluate(() => document.getElementById('view').textContent);

(async () => {
  const b = await chromium.launch();
  let { p, ctx } = await open(b, '2026-10-14T10:00:00');

  sec('chave desligada');
  let r = await p.evaluate(() => ({ nav: !!document.querySelector('#side a[href="#/cidade"]'), route: SYS.App.ROUTES.indexOf('cidade') >= 0, db: Object.keys(window.__mock.db), more: Array.from(document.querySelectorAll('#more a')).map(a => a.getAttribute('href')) }));
  ok(!r.nav && r.more.indexOf('#/cidade') < 0, 'sem a chave, a Cidade não aparece no menu lateral nem no Mais do celular');
  ok(r.route, 'mas a rota existe');
  await go(p, '#/cidade');
  ok(/Ligar a Cidade \(beta\)/.test(await view(p)), 'abrir #/cidade direto mostra o convite para ligar, sem quebrar');
  ok(r.db.every(k => !/\/city$/.test(k)), 'nenhum documento city foi gravado');

  sec('ligar nos Ajustes');
  await go(p, '#/perfil');
  ok(await p.evaluate(() => !!document.querySelector('input[data-c="pCity"]')), 'a chave "Cidade (beta)" está nos Ajustes do Perfil');
  await p.click('input[data-c="pCity"]'); await p.clock.runFor(2500); await sleep(60);
  r = await p.evaluate(() => ({ on: SYS.App.S.settings.cityBeta, nav: !!document.querySelector('#side a[href="#/cidade"]'), since: SYS.App.city.since, toast: document.getElementById('toasts').textContent, db: Object.keys(window.__mock.db) }));
  ok(r.on && r.nav && r.since === '2026-10-14', 'ligada: botão no menu, data de entrada guardada (' + r.since + ')');
  ok(/Cidade \(beta\) ligada/.test(r.toast), 'com aviso na tela');
  ok(r.db.some(k => /\/city$/.test(k)), 'e o documento city subiu');

  sec('radar e mapa');
  await go(p, '#/cidade');
  r = await p.evaluate(() => {
    const blk = Array.from(document.querySelectorAll('.cy-blk')).map(g => g.getAttribute('data-id'));
    const wc = Array.from(document.querySelectorAll('.cy-blk')).filter(g => SYS.CITY.DMAP[g.getAttribute('data-id')]).every(g => g.style.getPropertyValue('--wc').trim() === SYS.App.way(SYS.CITY.DMAP[g.getAttribute('data-id')].way).color);
    const ics = SYS.CITY.DIST.every(d => document.querySelector('.cy-blk[data-id="' + d.id + '"] .cy-ic path').getAttribute('d') === SYS.ICONS[d.ic]);
    const streets = SYS.CITY.DIST.every(d => document.querySelectorAll('.cy-blk[data-id="' + d.id + '"] .cy-st').length === d.ruas.length);
    return { blk, wc, ics, streets, radar: !!document.querySelector('.cy-radarwin .cy-radar'), txt: document.querySelector('.cy-radarwin').textContent, legend: Array.from(document.querySelectorAll('.cy-legend .cy-badge')).map(g => g.textContent).join(''), svgW: document.querySelector('.cy-svg').getBoundingClientRect().width };
  });
  ok(r.blk.join(',') === 'servidores,estudio,piscinas,escritorio,agencia,biblioteca,galeria,centro,nevoa', 'mapa com os 7 distritos na ordem da Bíblia, o Centro e a névoa');
  ok(r.wc, 'cada distrito com a cor do seu Caminho');
  ok(r.ics, 'cada distrito com o seu ícone');
  ok(r.streets, 'uma rua por vertente em cada distrito');
  ok(r.radar && /0 de 6 abertos/.test(r.txt) && /Raid/.test(r.txt) && /Mercador/.test(r.txt), 'radar vazio: 0 de 6 portais, raid, maldições, Mercador');
  ok(/começa em 17 dias, na Noite dos Portais Vermelhos/.test(r.txt), 'contagem da Estação 1 até 31/10 ("' + (r.txt.match(/Estação 1[^.]*/) || [''])[0].slice(0, 70) + '")');
  ok(r.legend === 'EDCBAS', 'legenda com as 6 insígnias, de E a S');
  ok(r.svgW > 500, 'mapa ocupa a coluna no desktop (' + Math.round(r.svgW) + ' px)');

  sec('distrito selecionado, teclado e prévia da corrupção');
  await p.click('.cy-blk[data-id="piscinas"]'); await p.clock.runFor(200);
  r = await p.evaluate(() => ({ sel: document.querySelector('.cy-blk[data-id="piscinas"]').getAttribute('aria-pressed'), txt: document.querySelector('.cy-main > section:last-child').textContent }));
  ok(r.sel === 'true' && /Piscinas/.test(r.txt) && /Calistenia/.test(r.txt) && /Contemplação/.test(r.txt), 'clicar em Piscinas abre a ficha com as 4 ruas');
  ok(/Os Ingravidáveis/.test(r.txt) && /Casa do Vapor/.test(r.txt) && /Companhia do Palco/.test(r.txt), 'e os 3 clãs do distrito');
  await p.click('.cy-blk[data-id="piscinas"]'); await p.clock.runFor(200);
  ok(await p.evaluate(() => !SYS.App.ui.cy.sel && /Toque num distrito/.test(document.querySelector('.cy-main > section:last-child').textContent)), 'clicar de novo fecha a ficha e volta à lista');
  await p.focus('.cy-blk[data-id="biblioteca"]'); await p.keyboard.press('Enter'); await p.clock.runFor(200);
  r = await p.evaluate(() => ({ sel: SYS.App.ui.cy.sel, focus: document.activeElement && document.activeElement.getAttribute('data-id') }));
  ok(r.sel === 'biblioteca' && r.focus === 'biblioteca', 'Enter num distrito abre a ficha e o foco continua nele');
  const w0 = await p.evaluate(() => window.__mock.writes);
  const cracks = {};
  for (const v of [1, 2, 3]) {
    await p.click('.cy-prev [data-v="' + v + '"]'); await p.clock.runFor(200);
    cracks[v] = await p.evaluate(() => { const g = document.querySelector('.cy-blk[data-id="biblioteca"]'); const d = (g.querySelector('.cy-crack') || {getAttribute: () => ''}).getAttribute('d'); return { cls: g.getAttribute('class'), starts: (d.match(/M/g) || []).length, noise: !!g.querySelector('.cy-noise'), txt: g.textContent }; });
  }
  ok(/cy-c1/.test(cracks[1].cls) && /cy-c2/.test(cracks[2].cls) && /cy-c3/.test(cracks[3].cls), 'a prévia pinta o distrito nos níveis 1, 2 e 3');
  ok(cracks[1].noise && cracks[1].starts > 0 && cracks[1].starts < cracks[2].starts && cracks[2].starts < cracks[3].starts, 'com ruído, e as rachaduras crescem a cada nível (' + [1, 2, 3].map(v => cracks[v].starts).join(' < ') + ' traços)');
  ok(/corrupção 3/.test(cracks[3].txt), 'o rodapé do distrito avisa a corrupção');
  r = await p.evaluate(() => ({ real: SYS.App.city.dist.biblioteca.corr, writes: window.__mock.writes }));
  ok(r.real === 0 && r.writes === w0, 'a prévia não grava nada (corrupção real continua 0, nenhuma gravação)');
  await p.click('.cy-prev [data-v="0"]'); await p.clock.runFor(200);
  ok(await p.evaluate(() => !/cy-corr/.test(document.querySelector('.cy-blk[data-id="biblioteca"]').getAttribute('class')) && !Object.keys(SYS.App.ui.cy.prev).length), '"limpo" desfaz a prévia');

  sec('dados de verdade: corrupção e portais abertos');
  await p.evaluate(() => { const A = SYS.App, C = A.city; C.dist.agencia.corr = 2; C.portals = [{id: 'p1', d: 'servidores', r: 'E', rua: 0}, {id: 'p2', d: 'servidores', r: 'C', rua: 1}, {id: 'p3', d: 'piscinas', r: 'S'}, {id: 'p4', d: 'galeria', r: 'B', due: '2026-10-20'}, {id: 'p5', d: 'galeria', r: 'A', st: 'closed'}]; A.ui.cy = {sel: null, prev: {}}; A.commit(['city']); });
  await p.clock.runFor(300);
  r = await p.evaluate(() => {
    const q = (id) => Array.from(document.querySelectorAll('.cy-blk[data-id="' + id + '"] .cy-badge')).map(g => g.textContent).join('');
    return { serv: q('servidores'), pisc: q('piscinas'), gal: q('galeria'), ag: document.querySelector('.cy-blk[data-id="agencia"]').getAttribute('class'), blips: document.querySelectorAll('.cy-radarwin .cy-rd-blip').length, txt: document.querySelector('.cy-radarwin').textContent, tip: (document.querySelector('.cy-blk[data-id="galeria"] .cy-badge') || {getAttribute: () => ''}).getAttribute('data-tip'), foot: document.querySelector('.cy-blk[data-id="servidores"]').textContent };
  });
  ok(r.serv === 'EC' && r.pisc === 'S' && r.gal === 'B', 'cada portal aberto vira uma insígnia no distrito dele; o fechado some');
  ok(/cy-c2/.test(r.ag), 'corrupção gravada no documento aparece no mapa');
  ok(r.blips === 4 && /4 de 6 abertos/.test(r.txt), 'o radar mostra 4 pontos e "4 de 6 abertos"');
  ok(/Portal B · Observação e Leitura|Portal B · [A-Z]/.test(r.tip) && /prazo/.test(r.tip), 'a insígnia diz rank, rua e prazo (' + r.tip + ')');
  ok(/2 portais/.test(r.foot), 'o rodapé conta os portais do distrito');

  sec('Centro e névoa');
  await p.click('.cy-blk[data-id="centro"]'); await p.clock.runFor(200);
  ok(/Dungeons/.test(await view(p)) && /Oficina/.test(await view(p)) && await p.evaluate(() => !!document.querySelector('.cy-main a[href="#/portoes/dungeons"]')), 'Centro: Dungeons, Raids e Oficina, com o caminho para as Dungeons de hoje');
  await p.click('.cy-blk[data-id="nevoa"]'); await p.clock.runFor(200);
  ok(/Névoa\. O Sistema não mostra o que tem aqui\./.test(await view(p)), 'a névoa não diz o que esconde');

  sec('Estação 1 no calendário');
  for (const [when, re, label] of [['2026-10-31T10:00:00', /semana 1 de 10 · hoje é a Noite dos Portais Vermelhos/, 'no dia 31/10'], ['2026-11-20T10:00:00', /semana 3 de 10/, 'em 20/11'], ['2027-02-01T10:00:00', /terminou/, 'depois das 10 semanas']]) {
    await p.clock.setSystemTime(new Date(when)); await p.evaluate(() => SYS.App.renderView()); await p.clock.runFor(200);
    ok(re.test(await p.evaluate(() => document.querySelector('.cy-radarwin').textContent)), 'Estação 1 ' + label);
  }

  sec('desligar');
  await go(p, '#/perfil');
  await p.click('input[data-c="pCity"]'); await p.clock.runFor(2500);
  r = await p.evaluate(() => ({ on: SYS.App.S.settings.cityBeta, nav: !!document.querySelector('#side a[href="#/cidade"]'), since: SYS.App.city.since, portals: SYS.App.city.portals.length }));
  ok(!r.on && !r.nav && r.since === '2026-10-14' && r.portals === 5, 'desligar tira o botão do menu e não apaga a Cidade');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  sec('celular e animações');
  ({ p, ctx } = await open(b, '2026-10-14T10:00:00', { width: 390, height: 844 }));
  await p.evaluate(() => { const A = SYS.App; A.S.settings.cityBeta = true; A.city.dist.estudio.corr = 3; A.commit(['core', 'city']); });
  await go(p, '#/cidade');
  r = await p.evaluate(() => ({ sw: document.scrollingElement.scrollWidth, svg: document.querySelector('.cy-svg').getBoundingClientRect().width, more: Array.from(document.querySelectorAll('#more a')).map(a => a.getAttribute('href')).indexOf('#/cidade') >= 0 }));
  ok(r.sw <= 390, 'sem rolagem lateral em 390 px (' + r.sw + ')');
  ok(r.svg > 300 && r.svg <= 390, 'o mapa cabe na tela (' + Math.round(r.svg) + ' px)');
  ok(r.more, 'no celular a Cidade fica no Mais');
  await p.screenshot({ path: path.join(__dirname, 'shots', 'cidade_celular.png'), fullPage: false });
  const anim = () => p.evaluate(() => [getComputedStyle(document.querySelector('.cy-rd-sweep')).animationName, getComputedStyle(document.querySelector('.cy-blk[data-id="estudio"] .cy-noise')).animationName]);
  r = await anim();
  ok(r[0] === 'cy-spin' && r[1] === 'cy-jit', 'com animações: o radar gira e o ruído treme');
  await p.evaluate(() => { SYS.App.S.settings.motion = false; SYS.App.commit(['core']); }); await p.clock.runFor(200);
  r = await anim();
  ok(r[0] === 'none' && r[1] === 'none', 'com as animações desligadas nos Ajustes, tudo para');
  ok(p.errs.length === 0, 'sem erro de JS no celular ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
