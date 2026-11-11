/* voz · a voz das Sombras no canal (v20.7): nada de lista nem de tom de assistente.
   As fichas ganham como cada uma ensina, elogia, se apega e se interessa, e o que sabe da Terra pelo mestre (a Sabedoria das Sombras);
   o prompt pede uma coisa por mensagem, o que funcionou primeiro, o trecho reescrito na voz dela e uma pergunta no fim;
   a rede de segurança (E.sgVoz) desfaz lista, markdown e tique de assistente que a IA deixar escapar, também no histórico;
   o modo protótipo mostra e move Philia (afeto e sentimento, nunca romance) e Interesse, e desligado não mostra nem move nada. */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const run = async (p, ms) => { await sleep(12); await p.clock.runFor(ms || 250); await sleep(12); };
const go = async (p, h) => {
  await p.evaluate(h => { location.hash = h; }, h);
  const r = h.replace(/^#\//, '').split('/')[0];
  for (let i = 0; i < 60; i++) { if (await p.evaluate(r => SYS.App.ui.route === r, r)) break; await sleep(25); }
  await run(p, 300);
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 860 } });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME_NOT|fonts\.g/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
  await p.clock.install({ time: new Date('2026-11-11T09:00:00') });
  await p.goto(URL); await p.clock.runFor(1800);
  await p.evaluate(() => { const A = SYS.App; A.S.profile.name = 'Yam'; A.S.settings.motion = false; A.S.pz.on = false; A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); });
  await p.clock.runFor(1500);
  let r;

  sec('as fichas: como cada uma ensina, elogia, se apega e se interessa');
  r = await p.evaluate(() => SYS.SG.MEMBROS.map(M => ({ id: M.id, falta: ['ensina', 'elogia', 'gosta', 'curiosa', 'terra'].filter(k => typeof M[k] !== 'string' || M[k].length < 40),
    ini: M.ini && M.ini.philia >= 0 && M.ini.philia <= 100 && M.ini.inter >= 0 && M.ini.inter <= 100, rotulo: /^quando /.test(M.gosta || '') })));
  ok(r.every(x => !x.falta.length), 'as 7 fichas têm ensina, elogia, gosta, curiosa e terra' + r.filter(x => x.falta.length).map(x => ' (' + x.id + ': ' + x.falta + ')').join(''));
  ok(r.every(x => x.ini), 'cada uma tem o ponto de partida de Philia e Interesse entre 0 e 100');
  ok(r.every(x => !x.rotulo), '"gosta" começa pelo gesto, sem repetir o rótulo');
  r = await p.evaluate(() => SYS.SG.MEMBROS.filter(M => !/mestre|Sabedoria das Sombras/.test(M.terra)).map(M => M.id));
  ok(r.length === 0, 'o que cada uma sabe da Terra veio do mestre' + (r.length ? ' (' + r + ')' : ''));
  r = await p.evaluate(() => SYS.SG.MAP.beta.ensina);
  ok(/funcionou/.test(r) && /reescreve um trecho/.test(r) && /uma coisa por vez/.test(r) && /pergunta/.test(r), 'a Beta ensina como cronista: o que funcionou, o trecho reescrito, uma coisa por vez e uma pergunta');
  r = await p.evaluate(() => { const E = SYS.E; const out = []; SYS.SG.MEMBROS.forEach(M => ['voz', 'fala', 'agente', 'provoca', 'ajuda', 'ensina', 'elogia', 'gosta', 'curiosa', 'terra'].forEach(k => { const t = E.sgTiques(M[k]); if (t.length) out.push(M.id + '.' + k + ': ' + t); })); return out; });
  ok(r.length === 0, 'nenhum campo das fichas tem tom de lista ou de assistente' + (r.length ? ' (' + r.slice(0, 3).join(' | ') + ')' : ''));

  sec('as falas prontas: originais, sem lista e sem tique');
  r = await p.evaluate(() => { const E = SYS.E, todas = [], ruins = [], vistas = {}, rep = [];
    SYS.SG.MEMBROS.forEach(M => Object.keys(M.falas).forEach(k => M.falas[k].forEach(f => todas.push([M.id + '.' + k, f]))));
    SYS.SG.ENTRADA.forEach((f, i) => todas.push(['entrada.' + i, f.t]));
    todas.forEach(x => { const t = E.sgTiques(x[1]); if (t.length) ruins.push(x[0] + ' (' + t + ')'); if (vistas[x[1]]) rep.push(x[1]); vistas[x[1]] = 1; });
    return { n: todas.length, ruins, rep }; });
  ok(r.n >= 80 && r.ruins.length === 0, r.n + ' falas prontas e da cerimônia sem lista, markdown, emoji ou tique de assistente' + (r.ruins.length ? ' (' + r.ruins.slice(0, 3) + ')' : ''));
  ok(r.rep.length === 0, 'nenhuma fala pronta se repete' + (r.rep.length ? ' (' + r.rep[0] + ')' : ''));

  sec('o detector de tom de assistente');
  r = await p.evaluate(() => { const T = SYS.E.sgTiques; return {
    num: T('1. muda isso\n2. olha essa frase'), hif: T('- muda isso\n- olha essa frase'), bol: T('• muda isso'), neg: T('isso está **ótimo**'), tit: T('## Correções'), emo: T('Bom trabalho 😀'),
    claro: T('Claro! Vou olhar.'), tiques: ['Ótima pergunta, agente.', 'Aqui estão os pontos.', 'Espero ter ajudado.', 'Qualquer dúvida, me chame.', 'Como assistente, eu diria.', 'Pontos de melhoria no seu texto.'].map(t => T(t).length),
    limpa: T('Três notebooks antes do almoço… essa abertura tem ritmo. Qual das duas versões soa mais como você?'), meio: T('O passo 2 do seu plano está certo, e o 3 vem antes dele. Por quê?') }; });
  ok(r.num.indexOf('lista') >= 0 && r.hif.indexOf('lista') >= 0 && r.bol.indexOf('lista') >= 0, 'pega lista numerada, com hífen e com bolinha');
  ok(r.neg.indexOf('markdown') >= 0 && r.tit.indexOf('markdown') >= 0 && r.emo.indexOf('emoji') >= 0, 'pega negrito, título e emoji');
  ok(r.claro.indexOf('abertura de assistente') >= 0 && r.tiques.every(n => n > 0), 'pega abertura "Claro!" e os tiques (ótima pergunta, aqui estão, espero ter ajudado, qualquer dúvida, como assistente, pontos de melhoria)');
  ok(!r.limpa.length && !r.meio.length, 'não acusa fala limpa nem número no meio da frase');

  sec('a rede de segurança');
  r = await p.evaluate(() => { const E = SYS.E, v = E.sgVoz('Claro! Aqui estão minhas sugestões:\n1. muda isso\n2. olha essa frase\n- e tira o **negrito**\nEspero ter ajudado!');
    const cod = E.sgVoz('Olha o teste.\n    public int Soma(int a, int b) => a + b;\nRodou?'), cena = 'A abertura tem ritmo.\n\n"A loja abriu cedo."\n\nQual soa mais como você?';
    return { v, t: E.sgTiques(v), cod, cena: E.sgVoz(cena) === cena }; });
  ok(r.t.length === 0 && r.v.split('\n').length === 1, 'lista, negrito, "Claro!", "Aqui estão" e "Espero ter ajudado" viram uma frase corrida: ' + JSON.stringify(r.v));
  ok(/muda isso/i.test(r.v) && /olha essa frase/i.test(r.v) && /negrito/.test(r.v), 'sem perder o conteúdo');
  ok(r.cod.indexOf('    public int Soma') >= 0 && r.cena, 'o recuo do código e a fala limpa ficam como estão');
  r = await p.evaluate(() => { const E = SYS.E; return { a: E.sgClean({fala: '- muda isso\n- olha essa frase', humor: 'eufórica', afinidade: 5, philia: 3, interesse: -9}), b: E.sgClean({fala: 'Claro!'}) }; });
  ok(r.a && !/^\s*-/m.test(r.a.fala) && r.a.humor === 'neutra' && r.a.af === 1 && r.a.ph === 1 && r.a.it === -1, 'sgClean limpa a fala e corta os passos em -1, 0 e 1');
  ok(r.b === null, 'resposta que era só tique vira erro, e não balão vazio');

  sec('o prompt');
  r = await p.evaluate(() => { const E = SYS.E, G = E.sgFill(JSON.parse(JSON.stringify(SYS.E.newSg()))); G.num = '436';
    return SYS.SG.ORDEM.map(id => { const M = SYS.SG.MAP[id], P = E.sgPrompt(G, id, 'Relatório de hoje: treinei e escrevi.', 'RETRATO');
      const regras = ['Uma coisa por mensagem', 'Nunca lista, tópicos, numeração', 'Nada de tom de assistente', 'primeiro diga o que funcionou', 'reescrevendo um trecho curto', 'Termine com uma pergunta', 'Escreva cada fala do zero',
        '=== A SABEDORIA DAS SOMBRAS ===', 'veio do mestre Shadow', 'O canon é flexível', 'nunca romântica', 'Você interpreta ' + M.n].filter(s => P.indexOf(s) < 0);
      const ficha = ['ensina', 'elogia', 'gosta', 'curiosa', 'terra'].filter(k => P.indexOf(M[k]) < 0);
      return { id, regras, ficha, proto: /PHILIA E INTERESSE|"philia"|"interesse"/.test(P) }; }); });
  ok(r.every(x => !x.regras.length), 'as regras da voz estão no prompt das 7' + r.filter(x => x.regras.length).map(x => ' (' + x.id + ': ' + x.regras[0] + ')').join(''));
  ok(r.every(x => !x.ficha.length), 'e a ficha nova entra inteira');
  ok(r.every(x => !x.proto), 'com o protótipo desligado, nada de Philia e Interesse no prompt nem no JSON');
  r = await p.evaluate(() => { const E = SYS.E, G = E.sgFill({num: '436', proto: true, philia: {zeta: 81}, inter: {zeta: 12}}); return E.sgPrompt(G, 'zeta', 'oi', 'R'); });
  ok(/Philia, o afeto e o sentimento que você tem por ele: 81\/100, nível 5 \(laço\)/.test(r) && /Interesse: 12\/100, nível 1 \(indiferente\)/.test(r), 'com o protótipo ligado, os níveis entram no prompt');
  ok(/"philia": -1 \| 0 \| 1/.test(r) && /"interesse": -1 \| 0 \| 1/.test(r), 'e o JSON pede philia e interesse');
  ok(/amor de amizade/.test(r) && /nunca há romance, flerte ou ciúme/.test(r) && /é do mestre Shadow/.test(r), 'Philia é amor de amizade: o amor dela é do mestre, com o agente nunca há romance');

  sec('ligar a Visão e conversar com a Beta');
  await p.evaluate(() => { const A = SYS.App; A.sgSet(true); A.sg.vis.entrada = SYS.U.today(); A.commit(['sg'], {quiet: true}); }); await run(p, 300);
  r = await p.evaluate(() => { const G = SYS.App.sg; return { proto: G.proto, ph: Object.assign({}, G.philia), it: Object.assign({}, G.inter), ini: SYS.SG.MEMBROS.map(M => M.ini) }; });
  ok(r.proto === false && noInicio(r), 'a Visão nasce com o protótipo desligado e Philia e Interesse no ponto de partida de cada uma');
  function noInicio(r){ return ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta'].every((id, i) => r.ph[id] === r.ini[i].philia && r.it[id] === r.ini[i].inter); }
  await go(p, '#/garden');
  ok((await p.evaluate(() => document.querySelectorAll('.sg-med').length)) === 0, 'protótipo desligado: nenhum medidor no conselho');
  await go(p, '#/garden/beta');
  r = await p.evaluate(() => ({ med: document.querySelectorAll('.sg-med').length, ficha: (document.querySelector('.sg-ficha') || {}).textContent || '' }));
  ok(r.med === 0 && /Ensina/.test(r.ficha) && /Quando gosta/.test(r.ficha) && /Da Terra/.test(r.ficha), 'nem no canal; a ficha mostra como ela ensina, quando gosta e o que sabe da Terra');
  await p.evaluate(() => { window.__mockSg = {fala: 'Claro! Aqui estão:\n1. a abertura tem ritmo\n2. a frase corre sem respirar\nEspero ter ajudado!', humor: 'satisfeita', memoria: 'Mandou um texto da loja.', afinidade: 1, philia: 1, interesse: 1}; });
  await p.fill('.sg-input textarea', 'Olha meu texto: hoje a loja abriu cedo e eu vendi três notebooks.');
  await p.keyboard.press('Enter'); await run(p, 1200);
  r = await p.evaluate(() => { const c = SYS.App.sg.canal.beta, last = c.m[c.m.length - 1], bal = [].slice.call(document.querySelectorAll('#sgChat .sg-msg.ela')).pop();
    return { de: last.de, t: last.t, dom: bal ? bal.textContent : '', ph: SYS.App.sg.philia.beta, it: SYS.App.sg.inter.beta, ini: SYS.SG.MAP.beta.ini, P: window.__mock.sg || '' }; });
  ok(r.de === 'beta' && !temTique(r.t) && /A abertura tem ritmo\. A frase corre sem respirar\./.test(r.t), 'a resposta em lista da IA chega no canal como frase corrida: ' + JSON.stringify(r.t));
  function temTique(t){ return /^\s*(\d+\.|-|•)\s/m.test(t) || /Claro!|Aqui estão|Espero ter ajudado/.test(t); }
  ok(!temTique(r.dom), 'e assim aparece no balão');
  ok(r.ph === r.ini.philia && r.it === r.ini.inter, 'com o protótipo desligado, Philia e Interesse não andam');
  ok(/Uma coisa por mensagem/.test(r.P) && !/"philia"/.test(r.P), 'o prompt enviado leva as regras da voz, sem os medidores');

  sec('modo protótipo');
  await go(p, '#/garden/ajustes');
  ok(await p.evaluate(() => !!document.querySelector('[data-c="sgProto"]') && /Philia \(afeto e sentimento/.test(document.getElementById('view').textContent)), 'a chave "Modo protótipo" está nos ajustes, explicando Philia e Interesse');
  await p.click('[data-c="sgProto"]'); await run(p, 300);
  ok(await p.evaluate(() => SYS.App.sg.proto === true), 'e liga');
  await go(p, '#/garden');
  r = await p.evaluate(() => ({ cards: [].map.call(document.querySelectorAll('.sg-card[data-id]'), e => e.querySelectorAll('.sg-med').length), nomes: [].map.call(document.querySelectorAll('.sg-card .sg-med-n'), e => e.textContent).slice(0, 2), rot: (document.querySelector('.sg-card .sg-med-r') || {}).textContent || '' }));
  ok(r.cards.length === 7 && r.cards.every(n => n === 2) && r.nomes.join(',') === 'Philia,Interesse', 'o conselho mostra Philia e Interesse nos 7 cartões');
  ok(/^nv [1-5] · \S/.test(r.rot), 'com nível e nome do nível (' + r.rot + ')');
  await go(p, '#/garden/beta');
  await p.evaluate(() => { window.__mockSg = {fala: 'Essa cena da loja abrindo cedo eu vou guardar. Qual foi o primeiro cliente?', humor: 'satisfeita', memoria: 'Mandou um texto da loja.', afinidade: 0, philia: 1, interesse: 1}; });
  const antes = await p.evaluate(() => ({ ph: SYS.App.sg.philia.beta, it: SYS.App.sg.inter.beta }));
  await p.fill('.sg-input textarea', 'Foi o Cesar, logo cedo.'); await p.keyboard.press('Enter'); await run(p, 1200);
  r = await p.evaluate(() => ({ ph: SYS.App.sg.philia.beta, it: SYS.App.sg.inter.beta, P: window.__mock.sg || '', bars: [].map.call(document.querySelectorAll('#sgProto .sg-med-bar'), e => e.getAttribute('aria-valuenow')) }));
  ok(r.ph === antes.ph + 2 && r.it === antes.it + 4, 'com o protótipo ligado, Philia sobe 2 e Interesse sobe 4 (' + antes.ph + '→' + r.ph + ', ' + antes.it + '→' + r.it + ')');
  ok(r.bars.join(',') === r.ph + ',' + r.it, 'as barras do canal acompanham na hora');
  ok(/=== PHILIA E INTERESSE/.test(r.P) && /"philia": -1/.test(r.P), 'e o prompt leva os níveis e pede philia e interesse');
  await p.evaluate(() => { const G = SYS.App.sg; G.philia.beta = 99; G.inter.beta = 2; window.__mockSg = {fala: 'Hm. Entendi. E agora?', humor: 'neutra', memoria: 'x', afinidade: 0, philia: 5, interesse: -5}; });
  await p.fill('.sg-input textarea', 'só isso'); await p.keyboard.press('Enter'); await run(p, 1200);
  r = await p.evaluate(() => ({ ph: SYS.App.sg.philia.beta, it: SYS.App.sg.inter.beta }));
  ok(r.ph === 100 && r.it === 0, 'os medidores ficam entre 0 e 100');
  await go(p, '#/garden/dossie');
  r = await p.evaluate(() => { const w = document.querySelector('.sg-protowin'); return w ? { rows: w.querySelectorAll('.sg-protorow').length, med: w.querySelectorAll('.sg-med').length, txt: w.textContent } : null; });
  ok(r && r.rows === 7 && r.med === 14 && /nunca romance/.test(r.txt), 'o dossiê ganha a seção do protótipo: 7 Sombras, 14 barras e o aviso de que Philia nunca é romance');
  await p.reload(); await p.clock.runFor(2500);
  r = await p.evaluate(() => ({ proto: SYS.App.sg.proto, ph: SYS.App.sg.philia.beta }));
  ok(r.proto === true && r.ph === 100, 'recarregar mantém o protótipo e os medidores');
  await p.evaluate(() => { const G = SYS.App.sg; G.proto = false; SYS.App.commit(['sg'], {quiet: true}); }); await go(p, '#/garden/dossie');
  ok((await p.evaluate(() => document.querySelectorAll('.sg-med, .sg-protowin').length)) === 0, 'desligar esconde tudo de novo');

  sec('documento antigo');
  r = await p.evaluate(() => { const E = SYS.E, G = E.sgFill({num: '436', afin: {alpha: 30}}), X = E.sgFill({philia: {beta: 999, gamma: -5, delta: 'x'}, inter: [1, 2], proto: 'sim'});
    return { G: { ph: G.philia, it: G.inter, proto: G.proto }, X: { ph: X.philia, it: X.inter, proto: X.proto }, ini: SYS.SG.MAP }; });
  ok(r.G.proto === false && r.G.ph.alpha === r.ini.alpha.ini.philia && r.G.it.eta === r.ini.eta.ini.inter, 'um sg sem os medidores ganha o ponto de partida da ficha e o protótipo desligado');
  ok(r.X.ph.beta === 100 && r.X.ph.gamma === 0 && r.X.ph.delta === r.ini.delta.ini.philia && r.X.it.alpha === r.ini.alpha.ini.inter && r.X.proto === false, 'valores tortos são cortados ou refeitos');
  r = await p.evaluate(() => { const N = SYS.E.sgNivel; return [0, 19, 20, 59, 60, 99, 100, 150].map(v => N('philia', v).n + ':' + N('philia', v).rot).join(',') + '|' + N('inter', 85).rot; });
  ok(r === '1:distante,1:distante,2:cordial,3:apreço,4:carinho,5:laço,5:laço,5:laço|fascinada', 'os níveis: de 20 em 20 pontos (' + r + ')');

  sec('o histórico entra limpo');
  r = await p.evaluate(() => { const E = SYS.E, G = E.sgFill({num: '436'});
    G.canal.beta.m = [{at: '2026-11-10T10:00:00Z', de: 'eu', t: 'olha meu texto'}, {at: '2026-11-10T10:01:00Z', de: 'beta', t: '1. muda isso\n2. olha essa frase'}];
    return E.sgPrompt(G, 'beta', 'e agora?', 'R').split('=== CONVERSA RECENTE ===')[1].split('=== NOVA MENSAGEM')[0]; });
  ok(/BETA: Muda isso\. Olha essa frase\./.test(r) && !/^\s*\d\./m.test(r), 'uma fala antiga em lista entra no prompt como frase corrida, para a IA não aprender a lista');

  ok(errs.length === 0, 'sem erros na página' + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close();
  console.log('\n' + oks + ' ok, ' + fails + ' falhas');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.log('  FAIL erro no teste: ' + e.message); process.exit(1); });
