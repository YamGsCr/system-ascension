/* cidade · a aba (beta): chave nos Ajustes, menu, a cidade ocupando a tela sem rolar, bairros encostados, minimapa-radar,
   janelas com vinheta (bairro, Centro, névoa, radar), corrupção (dados e prévia), teclado, celular e animações desligadas */
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
const go = async (p, h, ms) => { await p.evaluate(h => { location.hash = h; }, h); await p.clock.runFor(ms || 400); await sleep(40); };
const run = async (p, ms) => { await p.clock.runFor(ms || 250); await sleep(30); };
const view = p => p.evaluate(() => document.getElementById('view').textContent);
const win = p => p.evaluate(() => { const w = document.querySelector('#cyw.on .cyw-top'); return w ? { t: w.getAttribute('data-w'), txt: w.textContent } : null; });
/* clica num ponto de dentro do bairro (o ícone do rótulo, que não pega clique: o clique cai no bairro) */
const zone = async (p, id) => {
  const pt = await p.evaluate((id) => { const svg = document.querySelector('.cy-svg'), a = SYS.App.cyGeo(SYS.App.ui.cy.or).lb[id], m = svg.getScreenCTM(); return { x: m.a * a[0] + m.c * a[1] + m.e, y: m.b * a[0] + m.d * a[1] + m.f }; }, id);
  await p.mouse.click(pt.x, pt.y); await run(p);
};

(async () => {
  const b = await chromium.launch();
  let { p, ctx } = await open(b, '2026-10-14T10:00:00');

  sec('chave desligada');
  let r = await p.evaluate(() => ({ nav: !!document.querySelector('#side a[href="#/cidade"]'), route: SYS.App.ROUTES.indexOf('cidade') >= 0, db: Object.keys(window.__mock.db), more: Array.from(document.querySelectorAll('#more a')).map(a => a.getAttribute('href')) }));
  ok(!r.nav && r.more.indexOf('#/cidade') < 0, 'sem a chave, a Cidade não aparece no menu lateral nem no Mais do celular');
  ok(r.route, 'mas a rota existe');
  await go(p, '#/cidade');
  ok(/Ligar a Cidade \(beta\)/.test(await view(p)), 'abrir #/cidade direto mostra o convite para ligar, sem quebrar');
  ok(await p.evaluate(() => !document.documentElement.classList.contains('cy-full')), 'o convite é uma página comum (sem a tela cheia da Cidade)');
  ok(r.db.every(k => !/\/city$/.test(k)), 'nenhum documento city foi gravado');

  sec('ligar nos Ajustes');
  await go(p, '#/perfil');
  ok(await p.evaluate(() => !!document.querySelector('input[data-c="pCity"]')), 'a chave "Cidade (beta)" está nos Ajustes do Perfil');
  await p.click('input[data-c="pCity"]'); await p.clock.runFor(2500); await sleep(60);
  r = await p.evaluate(() => ({ on: SYS.App.S.settings.cityBeta, nav: !!document.querySelector('#side a[href="#/cidade"]'), since: SYS.App.city.since, toast: document.getElementById('toasts').textContent, db: Object.keys(window.__mock.db) }));
  ok(r.on && r.nav && r.since === '2026-10-14', 'ligada: botão no menu, data de entrada guardada (' + r.since + ')');
  ok(/Cidade \(beta\) ligada/.test(r.toast), 'com aviso na tela');
  ok(r.db.some(k => /\/city$/.test(k)), 'e o documento city subiu');

  sec('a cidade na tela inteira, sem rolar');
  await p.evaluate(() => { SYS.App.city.vis = {ivo: '2026-10-14'}; });   /* a apresentação do Ivo tem suíte própria (cityui) */
  await go(p, '#/cidade', 300);
  r = await p.evaluate(() => { const l = document.getElementById('cyload'); return { on: l && !l.hidden, img: l && l.querySelector('img') && l.querySelector('img').getAttribute('src') }; });
  ok(r.on && /^img\/eu-loading\.[0-9a-f]{10}\.webp$/.test(r.img), 'entrar na Cidade mostra o carregamento com a arte (' + r.img + ')');
  await run(p, 900);
  r = await p.evaluate(() => {
    const se = document.scrollingElement, hud = document.getElementById('hud').offsetHeight, v = document.getElementById('view');
    return { load: document.getElementById('cyload').hidden, sh: se.scrollHeight, ih: innerHeight, vh: v.getBoundingClientRect().height, hud, full: document.documentElement.classList.contains('cy-full'), or: SYS.App.ui.cy.or,
      side: !!document.getElementById('cySide') || !!document.querySelector('.cy-low') || !!document.querySelector('#view .cy-prow'), head: !!document.querySelector('#view .vhead, #view h1') };
  });
  ok(r.load, 'e o carregamento sai sozinho');
  ok(r.full && r.sh <= r.ih && Math.abs(r.vh - (r.ih - r.hud)) <= 1, 'a Cidade ocupa exatamente a área abaixo do HUD e a página não rola (' + r.sh + ' ≤ ' + r.ih + ')');
  ok(r.or === 'land', 'no desktop o mapa fica deitado');
  ok(!r.side, 'sem painel de bairro ao lado do mapa e sem listas embaixo: só o mapa e o HUD');
  r = await p.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('.cy-svg .cy-d')).map(g => g.getAttribute('data-id'));
    const wc = SYS.CITY.DIST.every(d => document.querySelector('.cy-svg .cy-d[data-id="' + d.id + '"]').style.getPropertyValue('--wc').trim() === SYS.App.way(d.way).color);
    const ics = SYS.CITY.DIST.every(d => document.querySelector('.cy-lb[data-id="' + d.id + '"] .cy-ic path').getAttribute('d') === SYS.ICONS[d.ic]);
    const g = SYS.App.cyGeo('land'), ruas = SYS.CITY.DIST.every(d => g.z[d.id].ruas.length === d.ruas.length && (document.querySelector('.cy-d[data-id="' + d.id + '"] .cy-st').getAttribute('d').match(/M/g) || []).length === d.ruas.length);
    const me = document.querySelector('.cy-me img'), mini = document.querySelector('.cy-mini .cy-mini-svg');
    return { ids, wc, ics, ruas, nev: !!document.querySelector('.cy-nev[data-id="nevoa"]'), me: me && me.getAttribute('src'), meW: me && me.naturalWidth, mini: !!mini, miniT: document.querySelector('.cy-mini-t').textContent, est: document.querySelector('.cy-est').textContent, rio: !!document.querySelector('.cy-rio'), pontes: document.querySelectorAll('.cy-ponte').length };
  });
  ok(r.ids.join(',') === 'servidores,estudio,piscinas,escritorio,agencia,biblioteca,galeria,centro' && r.nev, 'mapa com os 7 bairros na ordem da Bíblia, o Centro e a névoa');
  ok(r.wc && r.ics, 'cada bairro com a cor e o ícone do seu Caminho');
  ok(r.ruas, 'uma rua principal por vertente em cada bairro');
  ok(r.rio && r.pontes === 4, 'um rio atravessa a cidade, com 4 pontes');
  ok(/^img\/eu-icone\.[0-9a-f]{10}\.webp$/.test(r.me) && r.meW === 192, 'o botão do Caçador usa a sua foto sem a frase (' + r.meW + ' px)');
  ok(r.mini && r.miniT === '3/6', 'o minimapa-radar fica no canto com a contagem (' + r.miniT + ')');
  ok(/Estação 1 · Rachadura em 17 dias/.test(r.est), 'a Estação aparece num cantinho (' + r.est + ')');
  r = await p.evaluate(() => {
    /* os bairros encostam: todo ponto dentro da cidade cai em exatamente um bairro (sem fresta, sem sobra) */
    const res = {};
    ['land', 'port'].forEach(or => {
      const g = SYS.App.cyGeo(or), Z = Object.keys(g.z).map(k => g.z[k].P);
      const ins = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
      let n = 0, bad = 0;
      for (let x = 3; x < g.W; x += 7) for (let y = 3; y < g.H; y += 7) { if (!ins(g.out, x, y)) continue; n++; if (Z.filter(P => ins(P, x, y)).length !== 1) bad++; }
      res[or] = { n, bad };
    });
    return res;
  });
  ok(r.land.n > 9000 && r.land.bad === 0 && r.port.bad === 0, 'os bairros encostam uns nos outros: ' + r.land.n + ' pontos da cidade, cada um em exatamente um bairro (deitado e em pé)');

  sec('o radar no canto abre as informações');
  await p.click('.cy-mini'); await run(p);
  r = await p.evaluate(() => ({ w: document.querySelector('#cyw.on .cyw-top').getAttribute('data-w'), txt: document.querySelector('#cyw .cy-radarwin').textContent, bg: !!document.querySelector('#cyw .cyw-bg') }));
  ok(r.w === 'radar' && r.bg, 'tocar no minimapa abre a janela do radar, com a vinheta atrás');
  ok(/3 de 6 abertos/.test(r.txt) && /Chamado/.test(r.txt) && /Raid/.test(r.txt) && /Mercador/.test(r.txt), 'radar: portais abertos de 6, Chamado, raid, maldições, Mercador');
  ok(/começa em 17 dias, na Noite dos Portais Vermelhos/.test(r.txt), 'contagem da Estação 1 até 31/10');
  await p.click('#cyw [data-a="cyWinTab"][data-tab="legenda"]'); await run(p);
  ok(await p.evaluate(() => Array.from(document.querySelectorAll('#cyw .cy-legend .cy-badge')).map(g => g.textContent).join('')) === 'EDCBAS', 'aba Legenda: as 6 insígnias, de E a S');
  await p.click('#cyw [data-a="cyWinTab"][data-tab="portais"]'); await run(p);
  ok(await p.evaluate(() => document.querySelectorAll('#cyw .cy-prow').length) === 3, 'aba Portais: a lista dos 3 abertos');
  await p.click('#cyw .cyw-bg', { position: { x: 20, y: 20 } }); await run(p);
  ok(await p.evaluate(() => !document.querySelector('#cyw.on')), 'clicar fora fecha a janela');

  sec('bairro: tocar abre direto, Esc fecha, teclado e prévia da corrupção');
  await zone(p, 'piscinas');
  r = await win(p);
  ok(r && r.t === 'dist' && /Piscinas/.test(r.txt) && await p.evaluate(() => document.querySelector('.cy-svg .cy-d[data-id="piscinas"]').classList.contains('cy-sel')), 'tocar em Piscinas abre a janela do bairro; no mapa, atrás, o bairro fica aceso');
  await p.click('#cyw [data-tab="bairro"]'); await run(p);
  r = await win(p);
  ok(/Calistenia/.test(r.txt) && /Contemplação/.test(r.txt) && /Profundidade 1 de 10/.test(r.txt), 'aba Bairro: as 4 ruas e o estado');
  await p.click('#cyw [data-tab="clas"]'); await run(p);
  r = await win(p);
  ok(/Os Ingravidáveis/.test(r.txt) && /Casa do Vapor/.test(r.txt) && /Companhia do Palco/.test(r.txt), 'aba Clãs: os 3 clãs do bairro');
  await p.keyboard.press('Escape'); await run(p);
  ok(await p.evaluate(() => !document.querySelector('#cyw.on') && !document.querySelector('.cy-svg .cy-sel')), 'Esc fecha a janela e apaga o destaque');
  await zone(p, 'servidores'); await p.click('#cyw [data-tab="clas"]'); await run(p);
  r = await p.evaluate(() => { const i = document.querySelector('#cyw .cy-rep img'); return { txt: document.querySelector('#cyw .cyw-top').textContent, img: i && i.getAttribute('src') }; });
  ok(/Casa de Babel/.test(r.txt) && /Representante: Ivo Lint/.test(r.txt) && /^img\/ivo\./.test(r.img || ''), 'na Sala de Servidores, a Casa de Babel mostra o representante: Ivo Lint');
  await p.keyboard.press('Escape'); await run(p);
  await p.focus('.cy-dz[data-id="biblioteca"]'); await p.keyboard.press('Enter'); await run(p);
  r = await win(p);
  ok(r && r.t === 'dist' && /Biblioteca às 3h/.test(r.txt), 'Enter num bairro (pelo teclado) abre a janela dele');
  await p.click('#cyw [data-tab="bairro"]'); await run(p);
  const w0 = await p.evaluate(() => window.__mock.writes);
  const cracks = {};
  for (const v of [1, 2, 3]) {
    await p.click('#cyw .cy-prev [data-v="' + v + '"]'); await run(p, 200);
    cracks[v] = await p.evaluate(() => { const g = document.querySelector('.cy-svg .cy-d[data-id="biblioteca"]'); const d = (g.querySelector('.cy-crack') || {getAttribute: () => ''}).getAttribute('d'); return { cls: g.getAttribute('class'), starts: (d.match(/M/g) || []).length, noise: !!g.querySelector('.cy-noise'), sub: document.querySelector('.cy-lb[data-id="biblioteca"] .cy-sub').textContent, win: !!document.querySelector('#cyw.on .cyw-top[data-w="dist"]') }; });
  }
  ok(/cy-c1/.test(cracks[1].cls) && /cy-c2/.test(cracks[2].cls) && /cy-c3/.test(cracks[3].cls) && cracks[3].win, 'a prévia pinta o bairro nos níveis 1, 2 e 3, com a janela aberta');
  ok(cracks[1].noise && cracks[1].starts > 0 && cracks[1].starts < cracks[2].starts && cracks[2].starts < cracks[3].starts, 'com ruído, e as rachaduras crescem a cada nível (' + [1, 2, 3].map(v => cracks[v].starts).join(' < ') + ' traços)');
  ok(/corrupção 3/.test(cracks[3].sub), 'o rótulo do bairro avisa a corrupção');
  r = await p.evaluate(() => ({ real: SYS.App.city.dist.biblioteca.corr, writes: window.__mock.writes }));
  ok(r.real === 0 && r.writes === w0, 'a prévia não grava nada (corrupção real continua 0, nenhuma gravação)');
  await p.click('#cyw .cy-prev [data-v="0"]'); await run(p, 200);
  ok(await p.evaluate(() => !/cy-corr/.test(document.querySelector('.cy-svg .cy-d[data-id="biblioteca"]').getAttribute('class')) && !Object.keys(SYS.App.ui.cy.prev).length), '"limpo" desfaz a prévia');
  await p.keyboard.press('Escape'); await run(p);

  sec('dados de verdade: corrupção e portais abertos');
  await p.evaluate(() => { const A = SYS.App, C = A.city, mk = (id, d, r, rua, due, st) => ({id, n: 'Portal ' + id, d, way: SYS.CITY.DMAP[d].way, rua, r, st: st || 'open', born: '2026-10-14T11:00:00.000Z', due: due || '2026-10-16T11:00:00.000Z', mods: [], crit: ['a', 'b', 'c'], obj: 'x', ent: 'y', lore: 'z', min: 20});
    C.dist.agencia.corr = 2; C.portals = [mk('p1', 'servidores', 'E', 0), mk('p2', 'servidores', 'C', 1), mk('p3', 'piscinas', 'S'), mk('p4', 'galeria', 'B', 0, '2026-10-20T11:00:00.000Z'), mk('p5', 'galeria', 'A', 0, null, 'closed')]; C.spawn = '2026-10-14'; A.ui.cy.prev = {}; A.commit(['city']); });
  await run(p, 300);
  r = await p.evaluate(() => {
    const g = SYS.App.cyGeo('land');
    const ins = (P, x, y) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const where = Array.from(document.querySelectorAll('.cy-svg .cy-badge[data-a="cyOpen"]')).map(el => { const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(el.getAttribute('transform')), p = SYS.App.city.portals.find(x => x.id === el.getAttribute('data-id')); return { r: el.textContent, ok: ins(g.z[p.d].P, +m[1], +m[2]) }; });
    return { badges: where.map(w => w.r).join(''), inside: where.every(w => w.ok), ag: document.querySelector('.cy-svg .cy-d[data-id="agencia"]').getAttribute('class'), blips: document.querySelectorAll('.cy-mini .cy-rd-blip').length, mini: document.querySelector('.cy-mini-t').textContent,
      tip: (document.querySelector('.cy-svg .cy-badge[data-id="p4"]') || {getAttribute: () => ''}).getAttribute('data-tip'), cnt: (document.querySelector('.cy-lb[data-id="servidores"] .cy-cnt') || {}).textContent, sub: document.querySelector('.cy-lb[data-id="servidores"] .cy-sub').textContent };
  });
  ok(r.badges.split('').sort().join('') === 'BCES' && r.inside, 'cada portal aberto vira uma insígnia numa rua do bairro dele; o fechado some');
  ok(/cy-c2/.test(r.ag), 'corrupção gravada no documento aparece no mapa');
  ok(r.blips === 4 && r.mini === '4/6', 'o minimapa mostra 4 pontos e "4/6"');
  ok(/^Portal B · Observação e Leitura · prazo/.test(r.tip), 'a insígnia diz rank, rua e prazo (' + r.tip + ')');
  ok(r.cnt === '2' && /2 portais/.test(r.sub), 'o rótulo conta os portais do bairro');
  await zone(p, 'servidores');
  ok(await p.evaluate(() => document.querySelectorAll('#cyw .cyw-top .cy-prow').length) === 2, 'a janela do bairro lista os 2 portais dele');
  await p.click('#cyw .cy-prow[data-id="p2"]'); await run(p);
  r = await p.evaluate(() => ({ w: Array.from(document.querySelectorAll('#cyw .cyw-win')).map(x => x.getAttribute('data-w') + (x.classList.contains('cyw-under') ? '(atrás)' : '')).join(' '), back: !!document.querySelector('#cyw .cyw-top [data-a="cyWinBack"]') }));
  ok(r.w === 'dist(atrás) portal' && r.back, 'o portal abre por cima do bairro, que fica atrás como uma aba (' + r.w + ')');
  await p.click('#cyw .cyw-top [data-a="cyWinBack"]'); await run(p);
  ok((await win(p)).t === 'dist', '← volta para o bairro');
  await p.click('#cyw .cyw-top [data-a="cyWinX"]'); await run(p);
  ok(await p.evaluate(() => !document.querySelector('#cyw.on')), '✕ fecha tudo');

  sec('Centro e névoa');
  await zone(p, 'centro');
  r = await win(p);
  ok(r && r.t === 'centro' && /Dungeons/.test(r.txt) && /Oficina/.test(r.txt) && await p.evaluate(() => !!document.querySelector('#cyw a[href="#/portoes/dungeons"]')), 'Centro: Dungeons, Raids e Oficina, com o caminho para as Dungeons de hoje');
  await p.keyboard.press('Escape'); await run(p);
  await p.click('.cy-nev', { force: true }); await run(p);
  ok(/Névoa\. O Sistema não mostra o que tem aqui\./.test((await win(p) || {}).txt || ''), 'a névoa não diz o que esconde');
  await p.keyboard.press('Escape'); await run(p);

  sec('Estação 1 no calendário');
  for (const [when, re, label] of [['2026-10-31T10:00:00', /semana 1 de 10 · hoje é a Noite dos Portais Vermelhos/, 'no dia 31/10'], ['2026-11-20T10:00:00', /semana 3 de 10/, 'em 20/11'], ['2027-02-01T10:00:00', /terminou/, 'depois das 10 semanas']]) {
    await p.clock.setSystemTime(new Date(when)); await p.evaluate(() => { SYS.App.renderView(); SYS.App.cyWinOpen({t: 'radar'}, {reset: true}); }); await run(p, 200);
    ok(re.test(await p.evaluate(() => document.querySelector('#cyw .cy-radarwin').textContent)), 'Estação 1 ' + label);
  }
  await p.keyboard.press('Escape'); await run(p);

  sec('desligar');
  await go(p, '#/perfil');
  ok(await p.evaluate(() => !document.documentElement.classList.contains('cy-full') && !document.querySelector('#cyw.on')), 'sair da Cidade devolve a rolagem normal');
  const antes = await p.evaluate(() => SYS.App.city.portals.length);
  await p.click('input[data-c="pCity"]'); await p.clock.runFor(2500);
  r = await p.evaluate(() => ({ on: SYS.App.S.settings.cityBeta, nav: !!document.querySelector('#side a[href="#/cidade"]'), since: SYS.App.city.since, portals: SYS.App.city.portals.length }));
  ok(!r.on && !r.nav && r.since === '2026-10-14' && r.portals === antes && antes > 0, 'desligar tira o botão do menu e não apaga a Cidade (' + r.portals + ' portais guardados)');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  sec('celular e animações');
  ({ p, ctx } = await open(b, '2026-10-14T10:00:00', { width: 390, height: 844 }));
  await p.evaluate(() => { const A = SYS.App; A.S.settings.cityBeta = true; A.city.dist.estudio.corr = 3; A.city.since = '2026-10-14'; A.city.vis = {ivo: '2026-10-14'}; A.commit(['core', 'city']); });
  await go(p, '#/cidade', 1300);
  r = await p.evaluate(() => { const se = document.scrollingElement, s = document.querySelector('.cy-svg').getBoundingClientRect(), st = document.getElementById('cyStage').getBoundingClientRect(); return { sw: se.scrollWidth, sh: se.scrollHeight, ih: innerHeight, or: SYS.App.ui.cy.or, port: !!document.querySelector('.cy-stage.cy-port'), svgIn: s.left >= st.left - 1 && s.right <= st.right + 1 && s.bottom <= st.bottom + 1, more: Array.from(document.querySelectorAll('#more a')).map(a => a.getAttribute('href')).indexOf('#/cidade') >= 0 }; });
  ok(r.sw <= 390 && r.sh <= r.ih, 'sem rolagem nenhuma em 390 px (' + r.sw + ' × ' + r.sh + ')');
  ok(r.or === 'port' && r.port && r.svgIn, 'em pé, a cidade gira e cabe inteira na tela');
  ok(r.more, 'no celular a Cidade fica no Mais');
  await p.screenshot({ path: path.join(__dirname, 'shots', 'cidade_celular.png'), fullPage: false });
  const anim = () => p.evaluate(() => [getComputedStyle(document.querySelector('.cy-mini .cy-rd-sweep')).animationName, getComputedStyle(document.querySelector('.cy-svg .cy-d[data-id="estudio"] .cy-noise')).animationName]);
  r = await anim();
  ok(r[0] === 'cy-spin' && r[1] === 'cy-jit', 'com animações: o radar gira e o ruído treme');
  await p.evaluate(() => { SYS.App.S.settings.motion = false; SYS.App.commit(['core']); }); await run(p, 200);
  r = await anim();
  ok(r[0] === 'none' && r[1] === 'none', 'com as animações desligadas nos Ajustes, tudo para');
  ok(p.errs.length === 0, 'sem erro de JS no celular ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})();
