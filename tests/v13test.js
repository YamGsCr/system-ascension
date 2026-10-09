/* v13 · três trilhas de jogo com capítulos próprios + loja temática */
const { chromium } = require('playwright');
const path = require('path');
const F = 'file://' + path.resolve(__dirname, '../dist/test_legacy.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts\.g/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto(F); await p.waitForTimeout(1400);

  console.log('\n— estrutura —');
  let d = await p.evaluate(() => {
    const w = SYS.WAYMAP.mind, arc = w.arcs.filter(a => a.id === 'ij2')[0];
    return { bad: SYS._bad, ordem: arc.nodes.map(n => n.id), jogNodes: w.brmap.jog.nodes.length,
      opts: SYS.CHOICES.jogo.opts.map(o => o.id), trk: SYS.CHOICES.jogo.nodes,
      evs: w.gates.filter(g => g.id === 'ijg2')[0].ev.length,
      shop: w.shop.filter(s => s.br === 'jog').map(s => s.id),
      reqBad: w.shop.filter(s => s.req).map(s => s.req.replace('n_','')).filter(id => !SYS.nodeById(id)) };
  });
  ok(d.bad.length === 0, 'SYS._bad vazio (' + JSON.stringify(d.bad) + ')');
  ok(d.ordem.join(',') === 'G06,G07,G21,G08,G09,G22,G10,G11,G23,G12', 'ordem do arco: ' + d.ordem.join(','));
  ok(d.jogNodes === 29, 'vertente Jogos com 29 nós: ' + d.jogNodes);
  ok(d.opts.join(',') === 'tft,hok,arpg', '3 trilhas: ' + d.opts.join(','));
  ok(d.trk.length === 10, '10 capítulos mudam com a trilha: ' + d.trk.join(','));
  ok(d.evs === 10, 'selo ijg2 com 10 evidências: ' + d.evs);
  ok(d.shop.length === 21, 'loja da vertente com 21 itens: ' + d.shop.length);
  ok(d.reqBad.length === 0, 'todo req aponta para nó existente (' + JSON.stringify(d.reqBad) + ')');

  console.log('\n— capítulo troca de nome e de conteúdo por trilha —');
  const titulos = {};
  for (const t of ['tft', 'hok', 'arpg']) {
    titulos[t] = await p.evaluate((tr) => {
      App.S.tracks.jogo = tr; App.commit(['core']);
      const ids = SYS.CHOICES.jogo.nodes;
      const out = {};
      ids.forEach(id => { out[id] = App.chapNode(SYS.nodeById(id)).t; });
      out._row = H.nodeRow(SYS.nodeById('G21'));
      out._mis = App.nodeMission(App.chapNode(SYS.nodeById('G21')));
      return out;
    }, t);
  }
  ok(titulos.tft.G21 === 'Comps, componentes e o carry certo', 'G21 na trilha TFT: “' + titulos.tft.G21 + '”');
  ok(titulos.hok.G21 === 'Build de itens, emblemas e ordem de habilidade', 'G21 na trilha HoK: “' + titulos.hok.G21 + '”');
  ok(titulos.arpg.G21 === 'Afixos, escalonamento e as camadas de defesa', 'G21 na trilha ARPG: “' + titulos.arpg.G21 + '”');
  ok(titulos.tft.G12 !== titulos.arpg.G12 && /Set Inteiro/.test(titulos.tft.G12) && /Liga Inteira/.test(titulos.arpg.G12), 'o BOSS muda de nome: “' + titulos.tft.G12 + '” × “' + titulos.arpg.G12 + '”');
  const diff = SYS_diff(titulos);
  function SYS_diff(t){ return Object.keys(t.tft).filter(k => k[0] !== '_' && t.tft[k] !== t.hok[k] && t.hok[k] !== t.arpg[k]).length; }
  ok(diff === 10, 'os 10 capítulos têm título distinto nas 3 trilhas: ' + diff);
  ok(/Afixos, escalonamento/.test(titulos.arpg._row), 'a lista de capítulos já mostra o título da trilha');
  ok(/Capítulo na trilha/.test(titulos.arpg._mis), 'a missão avisa que o capítulo é daquela trilha');

  console.log('\n— conteúdo de estudo troca junto —');
  d = await p.evaluate(() => {
    const out = {};
    ['tft','hok','arpg'].forEach(tr => { App.S.tracks.jogo = tr; App.commit(['core']); out[tr] = App.trackBlocks(SYS.nodeById('G21')); });
    App.S.tracks.jogo = 'arpg'; App.commit(['core']);
    return { tft: out.tft, hok: out.hok, arpg: out.arpg,
      g23: App.trackBlocks(SYS.nodeById('G23')), g09: App.trackBlocks(SYS.nodeById('G09')),
      mis: App.nodeMission(App.chapNode(SYS.nodeById('G11'))) };
  });
  ok(/carry/i.test(d.tft) && !/Path of Building/i.test(d.tft), 'TFT fala de carry e não traz o planejador de ARPG');
  ok(/emblema/i.test(d.hok) && !/Path of Building/i.test(d.hok), 'HoK fala de emblema e não traz o planejador de ARPG');
  ok(/afixo/i.test(d.arpg) && /multiplicativo/i.test(d.arpg) && /Path of Building/i.test(d.arpg), 'ARPG fala de afixo, escalonamento multiplicativo e planejador');
  ok(/moeda/i.test(d.g23) && /infla/i.test(d.g23), 'G23 na trilha ARPG traz economia de liga e inflação');
  ok(/telegrafia|afixo/i.test(d.g09), 'G09 na trilha ARPG vira leitura de encontro');
  ok(/camada/i.test(d.mis) && !/colocação média/i.test(d.mis), 'G11 na trilha ARPG mede camada limpa, não colocação');

  console.log('\n— progresso é por trilha e não some ao trocar —');
  d = await p.evaluate(() => {
    App.S.tracks.jogo = 'arpg'; App.commit(['core']);
    App.C.trackTick({ getAttribute: (k) => ({ 'data-id':'G21','data-k':'jogo','data-o':'arpg','data-i':'0' })[k], checked: true });
    const depois = JSON.parse(JSON.stringify((App.N.n.G21 || {}).cs || {}));
    App.S.tracks.jogo = 'tft'; App.commit(['core']);
    const naTft = ((App.N.n.G21 || {}).cs || {})['jogo:tft'] || [];
    App.S.tracks.jogo = 'arpg'; App.commit(['core']);
    const devolta = ((App.N.n.G21 || {}).cs || {})['jogo:arpg'] || [];
    return { depois: depois, naTft: naTft.length, devolta: devolta.length };
  });
  ok(d.devolta === 1 && d.naTft === 0, 'tique marcado na trilha ARPG volta intacto e não vaza para TFT');

  console.log('\n— gaveta do capítulo abre certa —');
  await p.evaluate(() => { App.S.tracks.jogo = 'arpg'; App.commit(['core']); App.A.openNode({ getAttribute: () => 'G21' }); });
  await p.waitForTimeout(600);
  let dr = await p.evaluate(() => document.querySelector('.drawer').innerText);
  ok(/Afixos, escalonamento/i.test(dr), 'cabeçalho da gaveta usa o título da trilha');
  ok(/G07/.test(dr) && /G08/.test(dr), 'navegação prev/próximo continua certa: G07 ← G21 → G08');
  await p.evaluate(() => { App.ui.drawer = null; App.renderAll(); });

  console.log('\n— loja temática —');
  await p.goto(F + '#/lojas/mind/jog'); await p.waitForTimeout(900);
  const loja = await p.evaluate(() => document.body.innerText);
  for (const termo of ['Moeda do jogo', 'Passe de batalha', 'Espaço de invent', 'Cosmético avulso', 'Camisa ou moletom', 'Pacote de temporada', 'Colecionável', 'Controlador dedicado', 'overlay, tracker']) {
    ok(new RegExp(termo, 'i').test(loja), 'loja tem “' + termo + '”');
  }
  ok(/caixa aleat/i.test(loja), 'item de moeda traz a trava contra caixa aleatória');
  d = await p.evaluate(() => {
    const w = SYS.WAYMAP.mind, it = {}; w.shop.filter(s => s.br === 'jog').forEach(s => it[s.id] = { c: s.c, bmx: s.bmx, req: s.req || null, tier: s.tier });
    return it;
  });
  ok(d.mi_j1.c > 0 && d.mi_j21.c > d.mi_j1.c, 'preços escalonam do comum ao lendário (' + d.mi_j1.c + ' → ' + d.mi_j21.c + ')');
  ok(d.mi_j12.req === 'n_R02' && d.mi_j15.req === 'n_G12', 'ordem de causa mantida: periférico pede latência medida, camisa pede temporada fechada');

  console.log('\n— regressão rápida das outras telas —');
  for (const h of ['#/caminhos/mind', '#/caminhos/mind/jog', '#/caminhos/mind/hip', '#/status', '#/marcos', '#/conquistas']) {
    await p.goto(F + h); await p.waitForTimeout(500);
    const len = await p.evaluate(() => document.getElementById('view').innerText.length);
    ok(len > 400, h + ' renderiza (' + len + ' chars)');
  }

  console.log('\n— erros de página —');
  ok(errs.length === 0, 'zero erros de JS (' + errs.slice(0, 3).join(' | ') + ')');
  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close();
  process.exit(fails ? 1 : 0);
})();
