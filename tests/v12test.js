/* v12 · Mind Way hobby: vertentes, ritmo, Temporada de Hiperfoco, loja/conquistas de jogos */
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

  console.log('\n— dados carregados —');
  const d = await p.evaluate(() => {
    const w = SYS.WAYMAP.mind;
    return {
      bad: SYS._bad,
      branches: w.branches.map(x => ({ id: x.id, n: x.n, nodes: x.nodes.length, xp: x.totXP, tier: x.tiers && x.tiers.length })),
      tierNames: w.tierNames,
      nodes: w.arcs.reduce((s, a) => s + a.nodes.length, 0),
      baseArcs: w.arcs.filter(a => a.base && !a.br).map(a => a.id),
      integ: w.arcs.filter(a => !a.base && !a.br).map(a => a.id),
      gates: w.gates.filter(g => /^i[gh]|^ij/.test(g.id)).map(g => g.id),
      shopMind: w.shop.length,
      shopBr: w.shop.reduce((m, s) => (m[s.br || '-'] = (m[s.br || '-'] || 0) + 1, m), {}),
      choices: Object.keys(SYS.CHOICES).filter(k => SYS.CHOICES[k].way === 'mind'),
      trackNodes: Object.keys(SYS.CHOICES).filter(k => SYS.CHOICES[k].way === 'mind').map(k => k + ':' + SYS.CHOICES[k].nodes.join(',')),
      feats: SYS.FEATS.filter(f => f.way === 'mind' && (f.br === 'hip' || f.br === 'jog')).length,
      ctrs: SYS.COUNTERS.filter(c => c.way === 'mind').map(c => c.id),
      msadd: (SYS.MSADD || []).length,
      nextms: App.NEXTMS.length,
      nbNodes: ['H07','H09','H13','H15','G07','G11','G12','R02','R04','R05'].filter(id => { const n = SYS.nodeById(id); return n && n.nb; }),
      gateach: ['mi_h1','mi_h2','mi_h3','mi_h4','mi_hs1','mi_j1','mi_j2','mi_j3','mi_j4','mi_js1'].filter(k => SYS.GATEACH[k])
    };
  });
  ok(d.bad.length === 0, 'SYS._bad vazio (' + JSON.stringify(d.bad) + ')');
  ok(d.branches.length === 2, '2 vertentes no Mind: ' + d.branches.map(x => x.id + '/' + x.nodes + 'nós/' + x.xp + 'xp').join(' '));
  ok(d.branches.every(x => x.tier === 5), 'cada vertente tem 5 tiers calculados');
  ok(d.nodes === 84, 'Mind com 84 nós (era 32) — ' + d.nodes);
  ok(d.baseArcs.length === 7, '7 arcos em Fundamentos: ' + d.baseArcs.join(','));
  ok(d.integ.join(',') === 'i6', 'só i6 em Integração (selo final): ' + d.integ.join(','));
  ok(d.gates.length === 18, '18 selos no Mind (6+2 base, 5 hip, 5 jog): ' + d.gates.length);
  ok(d.shopMind === 67, 'loja do Mind com 67 itens (40 base + 21 jogos + 6 hip): ' + d.shopMind);
  ok(d.shopBr.jog === 21 && d.shopBr.hip === 6, 'loja por vertente: ' + JSON.stringify(d.shopBr));
  ok(d.choices.includes('jogo') && d.choices.includes('ritmo'), 'escolhas de trilha: ' + d.choices.join(','));
  ok(d.feats === 27, '27 Feitos nas vertentes de hobby: ' + d.feats);
  ok(d.ctrs.length === 6, '6 contadores novos: ' + d.ctrs.join(','));
  ok(d.msadd === 6 && d.nextms >= 17, 'marcos adicionados (MSADD ' + d.msadd + ', NEXTMS ' + d.nextms + ')');
  ok(d.nbNodes.length === 10, 'gatilho "não antes de" em 10 nós: ' + d.nbNodes.length);
  ok(d.gateach.length === 10, '10 conquistas de selo novas: ' + d.gateach.length);
  console.log('  trilhas: ' + d.trackNodes.join(' | '));

  console.log('\n— econ / tiers —');
  const e = await p.evaluate(() => {
    const w = SYS.WAYMAP.mind;
    return { tiers: w.tiers.map(t => t[0] + ':' + t[1]), tot: w.totXP,
      shopPrices: w.shop.filter(s => s.br).slice(0, 4).map(s => s.id + '=' + s.c + 'cr/' + (s.bmx || 0) + 'xp'),
      reqOk: w.shop.filter(s => s.req).map(s => s.req.replace('n_', '')).filter(id => !SYS.nodeById(id)) };
  });
  ok(e.reqOk.length === 0, 'todo req de loja aponta para nó existente (' + JSON.stringify(e.reqOk) + ')');
  ok(e.tiers[5].split(':')[0] > 7000, 'tier máximo reescalou com o conteúdo novo: ' + e.tiers.join(' · '));
  console.log('  preços auto: ' + e.shopPrices.join(' '));

  console.log('\n— navegação: vertentes renderizam —');
  for (const [hash, needle] of [['#/caminhos/mind', 'Fundamentos'], ['#/caminhos/mind/hip', 'HIPERFOCO'], ['#/caminhos/mind/jog', 'JOGAR DE PROPÓSITO']]) {
    await p.goto(F + hash); await p.waitForTimeout(700);
    const txt = await p.evaluate(() => document.body.innerText);
    ok(new RegExp(needle, 'i').test(txt), hash + ' mostra "' + needle + '"');
  }
  await p.goto(F + '#/caminhos/mind/jog'); await p.waitForTimeout(600);
  const jt = await p.evaluate(() => document.body.innerText);
  ok(/RITMO & PRECIS/i.test(jt), 'arco lateral de Ritmo aparece dentro de Jogos');
  ok(/Temporada Registrada/i.test(jt), 'boss "A Temporada Registrada" aparece');

  console.log('\n— Temporada de Hiperfoco: painel oculto quando inativa —');
  await p.goto(F + '#/caminhos/mind'); await p.waitForTimeout(700);
  let t0 = await p.evaluate(() => document.body.innerText);
  ok(!/Nenhuma temporada ativa|Fila de espera/i.test(t0), 'sem temporada ativa, painel NÃO aparece na trilha principal');
  await p.goto(F + '#/caminhos/mind/hip'); await p.waitForTimeout(700);
  let t1 = await p.evaluate(() => document.body.innerText);
  ok(/Temporada de Hiperfoco/i.test(t1), 'na vertente hip, o abridor aparece');
  ok(/sem sequ[êe]ncia/i.test(t1), 'painel declara "sem sequência · sem diária"');

  console.log('\n— abrir temporada: validações e ciclo completo —');
  let r = await p.evaluate(() => { App.A.hypStart(); return { on: !!App.S.hyp.on }; });
  ok(!r.on, 'não abre sem assunto/pergunta/entregável');
  r = await p.evaluate(() => {
    const f = App.hypF(); f.t = 'ARGs brasileiros'; f.q = 'quais ARGs nacionais chegaram ao fim?'; f.no = 'sem creepypasta'; f.dv = 'dossiê curto'; f.sem = 99;
    App.A.hypStart(); const on = App.S.hyp.on;
    return { on: !!on, sem: on && on.sem, dias: on && U.daysBetween(on.ini, on.fim) };
  });
  ok(r.on, 'temporada abre com os 4 campos preenchidos');
  ok(r.sem === 6, 'semanas travadas no teto de 6 (pedi 99): ' + r.sem);
  ok(r.dias === 42, 'prazo = 42 dias');
  r = await p.evaluate(() => { const f = App.hypF(); f.t = 'outra coisa'; f.q = 'q'; f.dv = 'd'; App.A.hypStart(); return App.S.hyp.on.t; });
  ok(r === 'ARGs brasileiros', 'slot único: segunda temporada é recusada');
  await p.goto(F + '#/caminhos/mind'); await p.waitForTimeout(700);
  t0 = await p.evaluate(() => document.body.innerText);
  ok(/ARGs brasileiros/i.test(t0), 'com temporada ativa, painel APARECE na trilha principal');

  r = await p.evaluate(() => {
    const f = App.hypF(); f.achado = 'achei um arquivo de 2013'; f.onde = 'wayback, acesso hoje'; f.perg = 'quem era o condutor?';
    App.A.hypLogAdd();
    const f2 = App.hypF(); f2.achado = 'segundo achado'; App.A.hypLogAdd();
    return { n: App.S.hyp.on.log.length, limpo: App.hypF().achado === '' };
  });
  ok(r.n === 2 && r.limpo, 'caderno de campo grava e limpa o form: ' + r.n + ' anotações');
  r = await p.evaluate(() => { const z = App.S.hyp.on; z.sem = 4; z.fim = U.addDays(z.ini, 28); App.A.hypExtend(); const a = z.sem, e1 = z.ext; App.A.hypExtend(); return { a: a, e1: e1, sem2: z.sem, ext: z.ext }; });
  ok(r.a === 6 && r.e1 === 1, 'esticar 4→6 semanas funciona (sem=' + r.a + ')');
  ok(r.sem2 === 6 && r.ext === 1, 'segunda prorrogação é recusada (sem=' + r.sem2 + ', ext=' + r.ext + ')');
  r = await p.evaluate(() => { App.hypF().rel = 'curto'; App.A.hypClose({ getAttribute: () => '1' }); return !!App.S.hyp.on; });
  ok(r, 'não encerra com relatório curto demais');
  r = await p.evaluate(() => {
    App.hypF().rel = 'Achei três ARGs nacionais e só um teve final publicado. Fica aberto o caso do segundo.';
    App.A.hypClose({ getAttribute: () => '0' });
    return { on: !!App.S.hyp.on, done: App.S.hyp.done.length, ok: App.S.hyp.done[0].ok, ctr: App.D.ctr.hipTemp, feat: App.D.featDone.hp_temp1 };
  });
  ok(!r.on && r.done === 1, 'encerramento honroso move para o histórico e libera o slot');
  ok(r.ok === false, 'encerrou como "não deu" e ainda contou');
  ok(r.ctr === 1, 'contador hipTemp = ' + r.ctr);
  ok(r.feat === true, 'Feito "Primeira Temporada Encerrada" disparou automaticamente');

  console.log('\n— fila de espera e promoção —');
  r = await p.evaluate(() => {
    App.hypF().ideia = 'imigração italiana em Santa Teresa'; App.A.hypFilaAdd();
    const n = App.S.hyp.fila.length, id = App.S.hyp.fila[0].id;
    App.A.hypPromote({ getAttribute: () => id });
    return { n: n, fila: App.S.hyp.fila.length, campo: App.hypF().t };
  });
  ok(r.n === 1 && r.fila === 0 && /imigra/i.test(r.campo), 'fila guarda e promove para o formulário');

  console.log('\n— conquistas de sistema de jogos —');
  r = await p.evaluate(() => {
    App.ctrAddVal('revisoes', 50); App.ctrAddVal('sessoesAlvo', 100); App.ctrAddVal('pbRitmo', 5);
    App.S.gates.ijg1 = { done: U.today(), ev: [] };
    App.commit(['core']);
    const D = App.D, A = App.S.ach;
    return { rev: !!A.sys_jg_rev, alvo: !!A.sys_jg_alvo, base: !!A.sys_jg_base, pb: !!A.sys_rt_pb,
      f25: !!D.featDone.jg_rev25, f30: !!D.featDone.jg_alvo30, ms: D.revisoesCt + '/' + D.sessoesAlvoCt };
  });
  ok(r.rev && r.alvo && r.base && r.pb, 'conquistas automáticas de melhora disparam: ' + JSON.stringify(r));
  ok(r.f25 && r.f30, 'Feitos por contador disparam (25 revisões, 30 sessões com alvo)');

  console.log('\n— marcos e regras —');
  await p.goto(F + '#/marcos'); await p.waitForTimeout(700);
  const mt = await p.evaluate(() => document.body.innerText);
  ok(/Partidas revisadas/i.test(mt) && /Temporadas de Hiperfoco/i.test(mt), 'próximos marcos incluem os novos');
  await p.goto(F + '#/regras'); await p.waitForTimeout(700);
  const rt = await p.evaluate(() => document.body.innerText);
  ok(/Temporada de Hiperfoco/i.test(rt) && /Horas jogadas n[ãa]o contam/i.test(rt), 'regras explicam a mecânica e o "horas não contam"');

  console.log('\n— trilhas: escolha de jogo e de ritmo —');
  r = await p.evaluate(() => {
    App.S.tracks.jogo = 'tft'; App.S.tracks.ritmo = 'keys'; App.commit(['core']);
    const w = SYS.WAYMAP.mind;
    return {
      cross: App.crossWin(w, 'jog'),
      g7: App.trackBlocks(SYS.nodeById('G07')),
      r4: App.trackBlocks(SYS.nodeById('R04')),
      g11mis: App.nodeMission(SYS.nodeById('G11')),
      h9mis: App.nodeMission(SYS.nodeById('H09')),
      semTrilha: App.missingTracks(SYS.nodeById('G06'))
    };
  });
  ok(/Competitivo da temporada/i.test(r.cross) && /Cen[áa]rio de ritmo/i.test(r.cross), 'painel de Encruzilhadas lista as duas escolhas novas');
  ok(/juro sobre ouro/i.test(r.g7), 'nó G07 rende o conteúdo da trilha TFT escolhida');
  ok(!/rota|selva/i.test(r.g7), 'nó G07 NÃO mostra o conteúdo da trilha MOBA não escolhida');
  ok(/coluna|acorde/i.test(r.r4), 'nó R04 rende o conteúdo da trilha VSRG escolhida');
  ok(/n[ãa]o antes de/i.test(r.g11mis) && /25 revis/i.test(r.g11mis), 'nó G11 mostra o gatilho "não antes de"');
  ok(/n[ãa]o antes de/i.test(r.h9mis), 'nó H09 (dossiê) também traz o gatilho');
  ok(r.semTrilha.length === 0, 'com trilha escolhida, G06 não reclama de escolha pendente');
  r = await p.evaluate(() => { App.S.tracks.jogo = 'hok'; App.commit(['core']); return App.trackBlocks(SYS.nodeById('G07')); });
  ok(/rota|mapa|rota[çc]/i.test(r) && !/juro sobre ouro/i.test(r), 'trocar para Honor of Kings troca o conteúdo sem apagar nada (progresso é por trilha)');

  console.log('\n— erros de página —');
  ok(errs.length === 0, 'zero erros de JS (' + errs.slice(0, 3).join(' | ') + ')');

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close();
  process.exit(fails ? 1 : 0);
})();
