/* garden · a Visão de Ascensão das Sombras e a aba Shadow Garden (SG0 a SG4):
   desligada por padrão; ligar troca nome, skin, voz e menu e cria o 5º documento (sg) com o número do agente;
   a cerimônia de entrada uma vez; o conselho com as 7 Sombras; saudação pronta sem gastar IA;
   a conversa com a IA (o prompt leva o retrato real, as regras e a mensagem; memória, afinidade e contador);
   limite do dia, linha cifrada sem IA, erro e "tentar de novo"; codinome, contato e intensidade no prompt;
   não lidas; desligar devolve o Sistema e guarda o Garden; recarregar; exportar e importar; a convocação */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test.html');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const sec = t => console.log('\n— ' + t + ' —');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(b, when, init, vp){
  const ctx = await b.newContext({ viewport: vp || { width: 1366, height: 860 } });
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); p.errs = [];
  p.on('pageerror', e => p.errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME_NOT|fonts\.g/.test(m.text())) p.errs.push('console: ' + m.text().slice(0, 200)); });
  await p.clock.install({ time: new Date(when) });
  await p.goto(URL); await p.clock.runFor(1800);
  await p.evaluate(() => { const A = SYS.App; A.S.profile.name = 'Yam'; A.S.settings.motion = false; A.S.pz.on = false; A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'], {quiet: true})); });
  await p.clock.runFor(1500); await sleep(20);
  return { p, ctx };
}
const run = async (p, ms) => { await sleep(12); await p.clock.runFor(ms || 250); await sleep(12); };
const go = async (p, h) => {
  await p.evaluate(h => { location.hash = h; }, h);
  const r = h.replace(/^#\//, '').split('/')[0];
  for (let i = 0; i < 60; i++) { if (await p.evaluate(r => SYS.App.ui.route === r, r)) break; await sleep(25); }
  await run(p, 300);
};
/* um clique que troca de rota: o hashchange chega em tempo real, fora do relógio simulado */
const clickTo = async (p, sel, param) => {
  await p.click(sel);
  for (let i = 0; i < 60; i++) { if (await p.evaluate(x => SYS.App.ui.route === 'garden' && SYS.App.ui.param === x, param)) break; await sleep(25); }
  await run(p, 300);
};
const st = p => p.evaluate(() => {
  const A = SYS.App, G = A.sg, root = document.documentElement, logo = document.querySelector('.logo');
  return { on: A.sgOn(), skin: root.getAttribute('data-skin'), atmo: root.getAttribute('data-atmo'), title: document.title, logo: logo ? logo.textContent : '',
    nav: !!document.querySelector('.nav a[href="#/garden"]'), navTxt: (document.querySelector('.nav a[href="#/garden"]') || {}).textContent || '',
    route: A.ui.route, param: A.ui.param, since: G.since, num: G.num, cod: G.cod, contato: G.contato, intens: G.intens, iaDia: G.iaDia, shadow: G.shadow,
    ia: G.ia, afin: Object.assign({}, G.afin), vis: Object.assign({}, G.vis), modal: A.ui.modal && A.ui.modal.type,
    talk: !!document.querySelector('#sgtalk.on'), toasts: document.getElementById('toasts').textContent, view: document.getElementById('view').textContent };
});
const cloud = (p, k) => p.evaluate(k => { const key = Object.keys(window.__mock.db).find(x => new RegExp('/' + k + '$').test(x)); return key ? JSON.parse(window.__mock.db[key]) : null; }, k);
const talk = p => p.evaluate(() => { const t = document.getElementById('sgtalk'); if (!t || !t.classList.contains('on')) return null; return { name: t.querySelector('.cyt-name b').textContent, txt: t.querySelector('.cyt-txt').textContent, n: t.querySelector('.cyt-n').textContent, sig: !!t.querySelector('.sgt-face svg.sg-sig') }; });
const canal = (p, id) => p.evaluate(id => { const c = SYS.App.sg.canal[id]; return { n: c.m.length, last: c.m[c.m.length - 1] || null, mem: c.mem, lido: c.lido, unread: SYS.App.sgNaoLidas(id), dom: document.querySelectorAll('#sgChat .sg-msg').length, ela: document.querySelectorAll('#sgChat .sg-msg.ela').length, status: (document.getElementById('sgStatus') || {}).textContent || '' }; }, id);

(async () => {
  const b = await chromium.launch();
  let { p, ctx } = await open(b, '2026-11-09T10:00:00');
  let s, c, r;

  sec('desligada por padrão');
  s = await st(p);
  ok(!s.on && s.skin !== 'sk_sombras' && !s.atmo && s.title === 'System Ascension', 'o app abre como System Ascension, sem a skin nem a névoa (' + s.skin + ')');
  ok(!s.nav && /System/.test(s.logo) && /Ascension/.test(s.logo), 'sem a aba Shadow Garden no menu e com a marca de sempre');
  ok(s.since === '' && !(await cloud(p, 'sg')), 'o documento sg não existe na nuvem enquanto a Visão está desligada');
  ok(!s.modal, 'nas páginas de teste a convocação só aparece quando a suíte pede');
  await go(p, '#/garden');
  s = await st(p);
  ok(s.route === 'garden' && /Aceitar a convocação/.test(s.view) && !s.talk, 'abrir #/garden desligada mostra o convite para ligar, sem cerimônia');

  sec('ligar pelo Perfil');
  await go(p, '#/perfil');
  ok(await p.evaluate(() => !!document.querySelector('input[data-c="pSombras"]')), 'a chave "Visão de Ascensão das Sombras" está nos Ajustes do Perfil');
  await p.click('input[data-c="pSombras"]'); await run(p, 1500);
  s = await st(p);
  ok(s.on && s.skin === 'sk_sombras' && s.atmo === 'sombras', 'liga a skin sombria e a névoa');
  ok(s.title === 'Visão de Ascensão das Sombras' && /Visão/.test(s.logo) && /de Ascensão das Sombras/.test(s.logo), 'o app passa a se chamar Visão de Ascensão das Sombras (título e marca)');
  ok(s.nav && /Shadow Garden/.test(s.navTxt), 'a aba Shadow Garden aparece no menu');
  ok(/\[Visão\] Visão de Ascensão das Sombras/.test(s.toasts), 'e o aviso já sai na voz da Visão');
  const today = await p.evaluate(() => SYS.U.today());
  ok(s.since === today && /^\d{3}$/.test(s.num) && [559, 664, 665, 666].indexOf(+s.num) < 0, 'o Garden registra a entrada (' + s.since + ') e dá ao agente o Número ' + s.num);
  const num = s.num;
  r = await cloud(p, 'sg');
  ok(r && r.since === today && r.num === num, 'o 5º documento (sg) vai para a nuvem');
  const core = await cloud(p, 'core');
  ok(core && core.settings && core.settings.sombras === true, 'e a chave fica salva no progresso');
  await p.evaluate(() => { SYS.App.toast({t: '[Sistema] Teste de voz', s: 'O [Sistema] fala.'}); SYS.App.ui.modal = {type: 'levelup', from: 1, to: 2}; SYS.App.renderModal(); }); await run(p, 100);
  r = await p.evaluate(() => ({ t: document.getElementById('toasts').textContent, m: document.getElementById('modal').textContent }));
  ok(/\[Visão\] Teste de voz/.test(r.t) && /O \[Visão\] fala/.test(r.t) && !/\[Sistema\]/.test(r.t), 'os avisos trocam [Sistema] por [Visão]');
  ok(/\[Visão\] Notificação/.test(r.m) && !/\[Sistema\]/.test(r.m), 'as janelas também');
  await p.evaluate(() => { SYS.App.ui.modal = null; SYS.App.renderModal(); });

  sec('a cerimônia de entrada');
  await go(p, '#/garden'); await run(p, 100);
  r = await talk(p);
  ok(r && r.name === 'Alpha' && r.n === '1/11' && r.sig, 'na primeira visita a cerimônia começa: Alpha, 11 falas, sigilo no lugar do retrato');
  ok(r && r.txt.indexOf('Número ' + num) === 0, 'e ela chama o agente pelo número (' + (r && r.txt.slice(0, 40)) + '…)');
  const names = [r && r.name];
  for (let i = 0; i < 10; i++) { await p.click('#sgtalk [data-a="sgCenaNext"]'); await run(p, 30); const t = await talk(p); names.push(t && t.name); }
  ok(names.join(',') === 'Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Alpha,Alpha,Shadow,Alpha', 'as Sete Sombras se apresentam, e o Shadow aparece uma vez (' + names.join(',') + ')');
  r = await talk(p);
  ok(r && /Sua contato direta será Alpha\. Bem-vindo ao Shadow Garden, Número \d{3}\./.test(r.txt), 'a última fala apresenta a contato direta');
  await p.click('#sgtalk [data-a="sgCenaNext"]'); await run(p, 100);
  s = await st(p);
  ok(!s.talk && s.vis.entrada === today, 'a cerimônia fecha e fica registrada');
  await go(p, '#/status'); await go(p, '#/garden'); await run(p, 100);
  ok(!(await st(p)).talk, 'voltar à aba não repete a cerimônia');
  await p.click('[data-a="sgEntrada"]'); await run(p, 50);
  ok(!!(await talk(p)), '"Rever a cerimônia" abre de novo');
  await p.keyboard.press('Escape'); await run(p, 50);
  ok(!(await talk(p)), 'e Esc pula');

  sec('o conselho');
  r = await p.evaluate(() => ({ cards: [].map.call(document.querySelectorAll('.sg-card[data-a="sgOpen"]'), e => e.getAttribute('data-id')), off: document.querySelectorAll('.sg-card.off').length,
    sig: document.querySelectorAll('.sg-card svg.sg-sig').length, agent: (document.querySelector('.sg-agent') || {}).textContent || '', view: document.getElementById('view').textContent }));
  ok(r.cards.join(',') === 'alpha,beta,gamma,delta,epsilon,zeta,eta' && r.off === 1, 'as 7 Sombras em cartões, mais o Shadow observando');
  ok(r.sig === 8, 'cada uma com o seu sigilo (os retratos entram quando chegarem)');
  ok(new RegExp('Número ' + num).test(r.agent) && /contato direta: Alpha/.test(r.agent) && /deus ex machina/.test(r.agent) && /nem nos Melhores Amigos/.test(r.agent), 'a ficha do agente: número, contato, missão e sigilo');
  ok(/Respostas de IA hoje: 0 de 20/.test(r.view), 'o contador de respostas de IA do dia');
  r = await p.evaluate(() => SYS.SG.MEMBROS.filter(M => !(M.fala && M.voz && M.agente && M.nunca && M.manias.length >= 3 && M.rel.length >= 3 && ['ola', 'falta', 'cumpriu', 'sumiu', 'semIA'].every(k => (M.falas[k] || []).length > 0))).map(M => M.id));
  ok(r.length === 0, 'as 7 fichas calibradas estão completas: tom, como fala, manias, relações, trato com o agente, limites e falas prontas' + (r.length ? ' (faltando: ' + r.join(',') + ')' : ''));
  r = await p.evaluate(() => SYS.SG.MAP.delta.falas);
  ok(Object.keys(r).every(k => r[k].every(t => /Delta/.test(t))), 'a Delta fala de si mesma na terceira pessoa em todas as falas prontas');

  sec('o canal: saudação pronta');
  const before = await p.evaluate(() => window.__mock.samples.length);
  await clickTo(p, '.sg-card[data-id="alpha"]', 'alpha');
  c = await canal(p, 'alpha');
  r = await p.evaluate(() => { const A = SYS.App, k = SYS.E.sgEstado(A.S); return { k, falas: SYS.SG.MAP.alpha.falas[k].map(A.sgFill) }; });
  ok((await st(p)).param === 'alpha' && c.n === 1 && c.last.de === 'alpha' && c.last.pr === 1, 'abrir o canal da Alpha: ela começa a conversa');
  ok(r.falas.indexOf(c.last.t) >= 0, 'com uma fala pronta do estado de hoje (' + r.k + ')');
  ok(c.unread === 0 && c.dom === 1 && (await p.evaluate(() => window.__mock.samples.length)) === before, 'lida na hora, na tela, sem gastar IA');
  await go(p, '#/garden'); await go(p, '#/garden/alpha');
  ok((await canal(p, 'alpha')).n === 1, 'reabrir no mesmo dia não repete a saudação');

  sec('a conversa com a IA');
  await p.fill('.sg-input textarea', 'Relatório de hoje: estudei 2 horas de redes.');
  await p.click('.sg-input [data-a="sgSend"]'); await sleep(20);
  r = await p.evaluate(() => ({ busy: SYS.App.ui.sgBusy, typing: !!document.querySelector('#sgChat .sg-typing'), dis: document.querySelector('.sg-input [data-a="sgSend"]').disabled, ta: document.querySelector('.sg-input textarea').value }));
  ok(r.busy === 'alpha' && r.typing && r.dis, 'enviando: "Alpha está escrevendo" e o botão espera');
  ok(r.ta === '', 'a caixa de texto esvazia');
  await run(p, 600);
  const P = await p.evaluate(() => window.__mock.sg || '');
  ok(/Você interpreta Alpha/.test(P) && /=== QUEM VOCÊ É ===/.test(P) && /acompanha o Caminho do Fundador \(The Founder Way\) dele/.test(P), 'o prompt é da Alpha, com o Caminho dela');
  ok(/=== RETRATO DO SISTEMA \(dados reais de agora\) ===\nHoje: 2026-11-09 \(segunda\), 10:0\d\./.test(P) && /Nível \d+/.test(P) && /Zona: protocolo desligado\./.test(P) && /Diárias de hoje: 0 de \d+/.test(P), 'leva o retrato real do Sistema (data, nível, diárias, Zona)');
  ok(/=== NOVA MENSAGEM DO AGENTE ===\nRelatório de hoje: estudei 2 horas de redes\./.test(P), 'e a mensagem do agente');
  ok(/Nunca critique descanso declarado/.test(P) && /saia do jogo/.test(P) && /não repita falas, bordões nem cenas/.test(P) && /Nunca invente dados/.test(P), 'com as regras da técnica, da saída do jogo, da obra e dos dados');
  ok(new RegExp('Número ' + num + '\\. Veio da Terra').test(P) && /Contato direta dele no Garden: Alpha/.test(P) && /Intensidade que ele pediu: padrao/.test(P), 'e com a ficha do agente');
  ok(/Fachada pública/.test(P) === false && /Como fala: frases curtas e completas/.test(P) && /Manias \(no máximo uma por resposta, só quando couber\): trabalha além da conta/.test(P), 'a ficha calibrada vai no prompt: como fala e manias com moderação');
  ok(/No Garden: lealdade absoluta ao mestre Shadow/.test(P) && /a Delta só obedece a ela e ao mestre/.test(P) && /Nunca: perder a compostura/.test(P) && /nunca romântica/.test(P), 'as relações no Garden, os limites dela e a regra de que com o agente é trabalho, nunca romance');
  c = await canal(p, 'alpha');
  s = await st(p);
  ok(c.n === 3 && c.last.de === 'alpha' && /qual é a entrega de hoje/.test(c.last.t) && c.last.h === 'neutra', 'a resposta chega no canal');
  ok(c.mem === 'Mandou o primeiro relatório.' && s.afin.alpha === 22 && s.ia.n === 1 && s.ia.dia === today, 'memória, afinidade (+2) e contador do dia atualizados');
  ok(c.dom === 3 && c.unread === 0 && /Respostas de IA hoje: 1 de 20/.test(c.status), 'na tela, lida, e o rodapé conta 1 de 20');
  await run(p, 2000);
  r = await cloud(p, 'sg');
  ok(r && r.canal.alpha.m.length === 3 && r.canal.alpha.mem === 'Mandou o primeiro relatório.', 'a conversa vai para a nuvem');
  await p.click('.sg-input textarea'); await p.keyboard.type('linha 1'); await p.keyboard.press('Shift+Enter'); await p.keyboard.type('linha 2');
  r = await p.evaluate(() => ({ v: document.querySelector('.sg-input textarea').value, busy: SYS.App.ui.sgBusy }));
  ok(r.v === 'linha 1\nlinha 2' && !r.busy, 'Shift+Enter quebra a linha');
  await p.keyboard.press('Enter'); await sleep(20);
  ok((await p.evaluate(() => SYS.App.ui.sgBusy)) === 'alpha', 'Enter envia');
  await run(p, 600);
  ok((await canal(p, 'alpha')).n === 5, 'e a resposta chega');
  await p.click('.sg-quick [data-q="tarefa"]');
  ok((await p.evaluate(() => document.querySelector('.sg-input textarea').value)) === 'Me dá uma tarefa para hoje.', 'os atalhos preenchem a caixa');
  await p.fill('.sg-input textarea', '');
  await p.evaluate(() => { SYS.App.ui.sgDraft.alpha = ''; });

  sec('limite do dia, linha cifrada, erro');
  await p.evaluate(() => { SYS.App.sg.ia = {dia: SYS.U.today(), n: 20}; });
  await p.fill('.sg-input textarea', 'mais uma'); await p.click('.sg-input [data-a="sgSend"]'); await run(p, 600);
  c = await canal(p, 'alpha');
  ok(c.n === 5 && /Limite de 20 respostas por dia atingido/.test(c.status), 'no limite do dia a mensagem não sai e o aviso explica');
  await p.evaluate(() => { window.__sample = SYS.App.sample; SYS.App.sample = null; SYS.App.renderView(); }); await run(p, 50);
  const n0 = await p.evaluate(() => window.__mock.samples.length);
  await p.fill('.sg-input textarea', 'oi, sem IA'); await p.click('.sg-input [data-a="sgSend"]'); await run(p, 100);
  c = await canal(p, 'alpha');
  r = await p.evaluate(() => SYS.SG.MAP.alpha.falas.semIA.map(SYS.App.sgFill));
  ok(c.n === 7 && c.last.off === 1 && r.indexOf(c.last.t) >= 0 && (await p.evaluate(() => window.__mock.samples.length)) === n0, 'sem a IA, ela responde com um recado pronto (linha cifrada), sem chamar a IA');
  ok(/linha cifrada/.test(await p.evaluate(() => document.getElementById('sgChat').textContent)) && /Linha cifrada/.test(c.status), 'e a tela avisa que a linha está cifrada');
  await p.evaluate(() => { SYS.App.sample = window.__sample; SYS.App.sg.ia = {dia: '', n: 0}; window.__mockFail = 'rate_limited'; SYS.App.renderView(); }); await run(p, 50);
  await p.fill('.sg-input textarea', 'teste de erro'); await p.click('.sg-input [data-a="sgSend"]'); await run(p, 600);
  c = await canal(p, 'alpha');
  ok(c.n === 8 && c.last.de === 'eu' && !!(await p.evaluate(() => SYS.App.ui.sgErr)) && !!(await p.$('#sgStatus [data-a="sgRetry"]')), 'a IA falhou: a mensagem fica, o erro aparece com "tentar de novo"');
  ok((await st(p)).ia.n === 0, 'e o erro não conta no limite do dia');
  await p.evaluate(() => { window.__mockFail = null; });
  await p.click('#sgStatus [data-a="sgRetry"]'); await run(p, 600);
  c = await canal(p, 'alpha');
  ok(c.n === 9 && c.last.de === 'alpha' && !(await p.evaluate(() => SYS.App.ui.sgErr)) && (await st(p)).ia.n === 1, '"tentar de novo" manda o mesmo pedido e a resposta chega');

  sec('dossiê e ajustes');
  await go(p, '#/garden/dossie');
  ok(/Afinidade/.test((await st(p)).view) && (await p.evaluate(() => document.querySelectorAll('.sg-affrow').length)) === 7, 'o dossiê mostra a afinidade com as 7');
  await p.fill('input[data-i="sgCod"]', 'Noctis'); await p.click('[data-a="sgCodSave"]'); await run(p, 300);
  ok((await st(p)).cod === 'Noctis' && (await p.evaluate(() => SYS.App.sgNome())) === 'Noctis', 'o codinome fica salvo');
  await go(p, '#/garden/ajustes');
  await p.selectOption('select[data-c="sgContato"]', 'zeta'); await run(p, 200);
  await p.click('[data-a="sgIntens"][data-v="pesada"]'); await run(p, 200);
  await p.click('[data-a="sgIaDia"][data-v="30"]'); await run(p, 200);
  await p.click('input[data-c="sgShadow"]'); await run(p, 200);
  s = await st(p);
  ok(s.contato === 'zeta' && s.intens === 'pesada' && s.iaDia === 30 && s.shadow === false, 'contato, intensidade, IA por dia e o Shadow nas cenas');
  await p.evaluate(() => SYS.App.sgEntrada()); await run(p, 50);
  r = await talk(p);
  ok(r && r.n === '1/10', 'sem o Shadow, a cerimônia tem 10 falas');
  await p.keyboard.press('Escape'); await run(p, 50);
  await go(p, '#/garden/beta');
  await p.fill('.sg-input textarea', 'oi, Beta'); await p.click('.sg-input [data-a="sgSend"]'); await run(p, 600);
  const P2 = await p.evaluate(() => window.__mock.sg || '');
  ok(/Você interpreta Beta/.test(P2) && new RegExp('Noctis \\(Número ' + num + '\\)').test(P2) && /Contato direta dele no Garden: Zeta/.test(P2) && /Intensidade que ele pediu: pesada \(provoque forte/.test(P2), 'o prompt muda junto: Beta, Noctis, contato Zeta, intensidade pesada');
  ok(/Fachada pública: Natsume Kafka/.test(P2) && /rivalidade secreta com a Epsilon/.test(P2) && /cobaia favorita da Eta/.test(P2), 'a Beta leva a fachada de romancista e as relações dela (Epsilon, Eta)');
  ok(await p.evaluate(() => { const d = document.querySelector('.sg-ficha'); return !!d && !d.open && /Ficha de Beta/.test(d.textContent) && /Natsume Kafka/.test(d.textContent) && d.querySelectorAll('li').length >= 8; }), 'o canal traz a ficha dela, recolhida');
  ok(/AGENTE: oi, Beta/.test(P2) === false && /=== CONVERSA RECENTE ===\nBETA: /.test(P2), 'a conversa recente vai no prompt (a saudação dela), e a mensagem nova só no fim');

  sec('não lidas');
  await p.fill('.sg-input textarea', 'volto já'); await p.click('.sg-input [data-a="sgSend"]'); await sleep(20);
  await go(p, '#/garden'); await run(p, 600);
  r = await p.evaluate(() => ({ badge: (document.querySelector('.sg-card[data-id="beta"] .sg-badge') || {}).textContent, n: SYS.App.sgNaoLidas('beta') }));
  ok(r.n === 1 && r.badge === '1', 'a resposta que chega com você fora do canal fica como não lida, com o selo no cartão');
  await clickTo(p, '.sg-card[data-id="beta"]', 'beta');
  ok((await canal(p, 'beta')).unread === 0, 'abrir o canal marca como lida');

  sec('desligar e voltar');
  await go(p, '#/garden/ajustes');
  await p.click('[data-a="sgSair"]'); await run(p, 400); await sleep(60); await run(p, 300);
  s = await st(p);
  ok(!s.on && s.skin !== 'sk_sombras' && !s.atmo && s.title === 'System Ascension' && /System/.test(s.logo), 'desligar devolve o nome, a skin e a marca de sempre');
  ok(!s.nav && s.route === 'status' && /Visão desligada/.test(s.toasts), 'esconde a aba e volta ao Status');
  ok(s.num === num && s.cod === 'Noctis' && (await canal(p, 'alpha')).n === 9, 'nada do Garden se perde');
  await go(p, '#/garden');
  await p.click('[data-a="sgOn"]'); await run(p, 500);
  s = await st(p);
  ok(s.on && s.since === today && s.num === num && (await canal(p, 'alpha')).n === 9, 'religar volta com o mesmo número, a mesma data de entrada e as conversas');

  sec('recarregar, exportar e importar');
  await run(p, 2000);
  await p.reload(); await p.clock.runFor(1800); await sleep(30);
  s = await st(p);
  ok(s.on && s.skin === 'sk_sombras' && s.title === 'Visão de Ascensão das Sombras' && s.cod === 'Noctis' && s.num === num, 'recarregado, a Visão continua ligada com o agente Noctis');
  ok((await canal(p, 'alpha')).n === 9 && (await canal(p, 'beta')).n >= 4, 'e as conversas estão lá');
  r = await p.evaluate(() => { const o = JSON.parse(SYS.App.saveJSON()); return { num: o.sg && o.sg.num, n: o.sg && o.sg.canal.alpha.m.length }; });
  ok(r.num === num && r.n === 9, 'o save exportado leva o Garden');
  r = await p.evaluate(() => { const A = SYS.App, o = JSON.parse(A.saveJSON()); o.sg.cod = 'Umbra'; A.ui.modal = {type: 'import', data: o}; A.A.importDo(); return { cod: A.sg.cod, on: A.sgOn() }; });
  ok(r.cod === 'Umbra' && r.on, 'e importar um save traz o Garden junto');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  sec('celular');
  ({ p, ctx } = await open(b, '2026-11-09T10:00:00', null, { width: 390, height: 844 }));
  await p.evaluate(() => { const A = SYS.App; A.sgSet(true); A.sg.vis.entrada = SYS.U.today(); A.commit(['sg'], {quiet: true}); }); await run(p, 300);
  for (const h of ['#/garden', '#/garden/alpha', '#/garden/dossie', '#/garden/ajustes']) {
    await go(p, h);
    r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
    ok(r.sw <= r.w + 1, h + ' cabe na largura do celular (' + r.sw + ' ≤ ' + r.w + ')');
  }
  await p.evaluate(() => SYS.App.sgEntrada()); await run(p, 50);
  r = await p.evaluate(() => { const b = document.querySelector('#sgtalk .cyt-box').getBoundingClientRect(), f = document.querySelector('#sgtalk .sgt-face').getBoundingClientRect(); return { box: b.top, face: f.bottom, w: b.width }; });
  ok(r.face <= r.box + 2 && r.w <= 390, 'na cerimônia, o sigilo fica acima da caixa de fala');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  sec('a convocação');
  ({ p, ctx } = await open(b, '2026-11-09T10:00:00', () => { window.__sgConvite = 1; }));
  await run(p, 61000);
  s = await st(p);
  r = await p.evaluate(() => document.getElementById('modal').textContent);
  ok(s.modal === 'sgConvite' && /\[Sistema\] Convocação/.test(r) && /Aceitar a convocação/.test(r), 'com o save em uso, o Sistema faz a convocação');
  await p.click('#modal [data-a="sgConviteNao"]'); await run(p, 300);
  s = await st(p);
  ok(!s.modal && !s.on && (await p.evaluate(() => SYS.App.S.flags.sgAdiado)) === '2026-11-09', '"Agora não" fecha e adia');
  await run(p, 61000);
  ok(!(await st(p)).modal, 'e não volta na mesma sessão');
  await p.evaluate(() => { SYS.App.ui.sgVisto = false; SYS.App.sgConvite(); });
  ok(!(await st(p)).modal, 'nem antes de 3 dias');
  await p.clock.setSystemTime(new Date('2026-11-12T10:00:00')); await run(p, 61000);
  await p.evaluate(() => { const A = SYS.App; A.ui.modal = null; A.renderModal(); A.ui.sgVisto = false; A.sgConvite(); }); await run(p, 100);
  ok((await st(p)).modal === 'sgConvite', 'três dias depois, a convocação volta');
  await p.click('#modal [data-a="sgConviteSim"]');
  for (let i = 0; i < 40; i++) { if (await p.evaluate(() => SYS.App.ui.route === 'garden')) break; await sleep(25); }
  await run(p, 400);
  s = await st(p);
  ok(s.on && s.route === 'garden' && s.skin === 'sk_sombras' && (await p.evaluate(() => SYS.App.S.flags.sgConvite)) === '2026-11-12', 'aceitar liga a Visão e leva à aba');
  ok(s.talk && (await talk(p)).name === 'Alpha', 'onde a cerimônia de entrada começa');
  await p.keyboard.press('Escape'); await run(p, 61000);
  ok(!(await st(p)).modal, 'aceita, a convocação não aparece mais');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 3).join(' | '));
  await ctx.close();

  console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
  await b.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('FAIL exceção: ' + (e && e.stack || e)); process.exit(1); });
