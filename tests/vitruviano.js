/* v21 · Vitruviano: estrutura dos Ways, migração do save real sem perder XP, Provas com mini-artigo, XP dupla,
   Filtro de Vitrúvio, chinês depois do N4, Títulos, SGM-Opus (eras, ritual, compras) e Rotina (ondas, mínimo, sono, pausa). */
const L = require('./v14lib.js'); const { ok, sec, open, at, run } = L;
const FX = require('./fixtures/core_v20_yam.json');
const ANTES = { xp: 81, architect: 18, flaneur: 6, aesthetic: 20, navigation: 19, founder: 0, sistema: 4, ars: 6, mindLog: 8 };

(async () => {
  const b = await L.chromium.launch();

  sec('1 · estrutura: sete Ways, Ars dissolvido, Mind reduzido');
  let { p } = await open(b, '2026-11-15T10:00:00');
  let s = await p.evaluate(() => {
    const W = SYS.WAYMAP, v = W.vitruviano, m = W.mind, ids = a => a.nodes.map(n => n.id);
    const harm = v.arcs.filter(a => a.br === 'har').reduce((x, a) => x.concat(ids(a)), []);
    const mindNodes = m.arcs.reduce((x, a) => x.concat(ids(a)), []);
    return {
      ways: SYS.WAYS.map(w => w.id).join(','), ars: !!W.ars, br: v.branches.map(b => b.id).join(','),
      mt: v.arcs.filter(a => a.br === 'mat').length, provas: v.arcs.filter(a => a.br === 'mat').map(a => a.nodes.filter(n => n.prova).length).join(''),
      harmAll: Array.from({ length: 70 }, (_, i) => 'M' + String(i + 1).padStart(2, '0')).every(id => harm.indexOf(id) >= 0), piano: ['M71','M72','M73','M74','M75'].every(id => harm.indexOf(id) >= 0),
      mindBase: m.arcs.filter(a => !a.br).length, mindBr: m.branches.map(b => b.id).join(','), mindHasP: mindNodes.some(id => /^P\d/.test(id)),
      pWay: Array.from({ length: 32 }, (_, i) => SYS.E.NODE['P' + String(i + 1).padStart(2, '0')].way).every(w => w === 'vitruviano'),
      p08: SYS.E.NODE.P08.br, p23: SYS.E.NODE.P23.br, l09: (SYS.E.NODE.L09.reqN || []).join(','),
      gates: ['mg1','mg10','ig1','ig6','igs1','igs2','mtg7','smg1'].map(g => SYS.E.GATE[g] && SYS.E.GATE[g].way).join(','),
      daily: SYS.DAILIES.filter(d => d.id === 'sound' || d.id === 'log').map(d => d.way).join(','),
      choices: ['daw','dj'].map(k => SYS.CHOICES[k].way).join(','), estudio: SYS.CITY.DIST.filter(d => d.id === 'estudio')[0].way,
      eps: SYS.SG.MAP.epsilon.way, exam: v.exam.mat[0] + v.exam.har[0] + v.exam.phi[0] + v.exam.pol[0] + v.exam.lin.join('') ,
      bad: SYS._bad.length, semSelo: Object.values(SYS.E.ARC).filter(a => !a.gate).length,
      certs: SYS.CERTS.filter(c => c.way === 'vitruviano').length, sys: ['sys_prokopton','sys_kalokagathia'].every(id => SYS.E.ACHMAP[id] && SYS.E.ACHMAP[id].title)
    };
  });
  ok(s.ways === 'architect,flaneur,aesthetic,navigation,vitruviano,founder,mind' && !s.ars, 'sete Ways, sem o Ars: ' + s.ways);
  ok(s.br === 'mat,har,phi,pol,lin', 'Vitruviano com os cinco domínios: ' + s.br);
  ok(s.mt === 7 && s.provas === '1111111', 'Mathematica: seis ranks e o Shadow, uma Prova em cada');
  ok(s.harmAll && s.piano, 'Harmonia guarda os 70 nós do Ars com os mesmos IDs e ganha o piano (M71 a M75)');
  ok(s.mindBase === 0 && s.mindBr === 'hip,jog' && !s.mindHasP, 'Mind fica só com Hiperfocos & Arquivos e Jogos & Sistemas');
  ok(s.pWay && s.p08 === 'pol' && s.p23 === 'phi', 'P01 a P32 moram no Vitruviano; Ética & justiça na Politeia; o Diálogo Socrático é o chefe da Philosophia');
  ok(s.l09 === 'L07', 'o chinês pede o JLPT N4 (L07)');
  ok(s.gates === Array(8).fill('vitruviano').join(','), 'selos do Ars e da base do Mind mudaram de Caminho com os mesmos IDs');
  ok(s.daily === 'vitruviano,vitruviano' && s.choices === 'vitruviano,vitruviano', 'diárias Som e Registro e as escolhas de DAW e DJ vão para o Vitruviano');
  ok(s.estudio === 'vitruviano' && s.eps === 'vitruviano', 'Estúdio sem Janela e Epsilon seguem a Harmonia');
  ok(s.exam === 'etaepsilonalphagammabetazeta', 'examinadoras: Eta, Epsilon, Alpha, Gamma, Beta e Zeta');
  ok(s.bad === 0 && s.semSelo === 0, 'nenhuma referência quebrada e todo arco com selo');
  ok(s.certs === 8 && s.sys, 'oito certificações de idioma e os Títulos Prokopton e Kalokagathia');
  const cid = await p.evaluate(() => { const E = SYS.E, S = SYS.App.S, D = SYS.CITY.DIST; const est = D.filter(d => d.id === 'estudio')[0], bib = D.filter(d => d.id === 'biblioteca')[0]; return { e0: (E.cyRuaNode(S, est, 0) || {}).id, e2: (E.cyRuaNode(S, est, 2) || {}).id, b0: (E.cyRuaNode(S, bib, 0) || {}).way, b1: (E.cyRuaNode(S, bib, 1) || {}).way }; });
  ok(cid.e0 === 'M71' && cid.e2 === 'M53' && cid.b0 === 'vitruviano' && cid.b1 === 'mind', 'Cidade: ruas do Estúdio puxam Harmonia; a rua Pensamento puxa o Vitruviano (' + JSON.stringify(cid) + ')');
  ok(p.errs.length === 0, 'sem erro de página: ' + p.errs.join(' | '));

  sec('2 · o save real migra sem perder XP');
  ({ p } = await open(b, '2026-11-15T10:00:00', (core) => { localStorage.setItem('sysasc.core.v1', JSON.stringify(core)); }, FX.core));
  s = await p.evaluate(() => {
    const A = SYS.App, S = A.S, D = A.D, q = Object.values(S.daily).map(r => Object.values(r.q || {})).reduce((a, b) => a.concat(b), []);
    return { xp: D.xp, w: D.wayXP, sys: D.sysXP, f: S.flags.v21, foco: S.settings.season.focus.join(','), main: S.settings.season.main, fixed: S.settings.season.fixed.join(','),
      ars: q.indexOf('ars') >= 0, logs: Object.values(S.daily).filter(r => r.q && r.q.log).map(r => r.q.log).join(','), backup: !!localStorage.getItem('sysasc.backup.v21'), tracks: S.tracks.jogo, a01: S.nodes.A01.s };
  });
  ok(s.f && s.f.xp[0] === s.f.xp[1] && s.xp === ANTES.xp, 'XP total igual antes e depois da migração: ' + (s.f && s.f.xp.join(' → ')) + ' (v20.7: ' + ANTES.xp + ')');
  ok(s.w.vitruviano === ANTES.ars + ANTES.mindLog && s.w.mind === 0, 'Som (6 XP do Ars) e Registro (8 XP do Mind) estão no Vitruviano: ' + s.w.vitruviano);
  ok(s.w.architect === ANTES.architect && s.w.flaneur === ANTES.flaneur && s.w.aesthetic === ANTES.aesthetic && s.w.navigation === ANTES.navigation && s.w.founder === ANTES.founder && s.sys === ANTES.sistema, 'os outros Ways ficam como estavam');
  ok(!s.ars && s.logs === 'vitruviano,vitruviano,vitruviano,vitruviano', 'nenhuma diária aponta para o Ars; os quatro Registros vieram junto');
  ok(s.foco === 'architect,vitruviano,navigation' && s.main === 'architect' && s.fixed === 'aesthetic,founder,mind', 'foco: Architect e Vitruviano lado a lado (' + s.foco + ')');
  ok(s.backup && s.tracks === 'tft' && s.a01 === 'doing', 'cópia de segurança no navegador; trilha TFT e o A01 em andamento intactos');
  ok(s.f.rep['diárias'] === 6 && s.f.rep.foco === 1, 'registro do que mudou: ' + JSON.stringify(s.f.rep));
  const again = await p.evaluate(() => { const E = SYS.E, S = SYS.App.S, x = JSON.stringify(S.daily); E.migrate(S); return JSON.stringify(S.daily) === x; });
  ok(again, 'migrar de novo não muda nada');
  ok(p.errs.length === 0, 'sem erro de página: ' + p.errs.join(' | '));

  sec('3 · Prova com mini-artigo, XP dupla e Filtro de Vitrúvio');
  ({ p } = await open(b, '2026-11-16T10:00:00'));
  await p.evaluate(() => { const A = SYS.App; A.S.profile.name = 'Yam'; A.S.settings.motion = false; A.S.settings.openWorld = true; SYS.Store.asAuto(() => A.commit(['core'])); });
  await run(p, 300);
  await p.evaluate(() => { location.hash = '#/caminhos/vitruviano/provas'; }); await L.routed(p, 'caminhos');
  s = await p.evaluate(() => { const v = document.getElementById('view').innerText; return { rank: /Ranks da Mathematica/i.test(v), pend: /mini-artigo pendente/i.test(v) }; });
  ok(s.rank && s.pend, 'aba Provas mostra os ranks e o mini-artigo pendente');
  await p.evaluate(() => { SYS.App.ui.modal = { type: 'done', id: 'MT05', checks: [true, true, true], ev: '' }; SYS.App.renderModal(); });
  await run(p, 200);
  s = await p.evaluate(() => { const b = document.querySelector('#modal [data-a="confirmDone"]'); return { dis: b && b.disabled, txt: document.getElementById('modal').innerText }; });
  ok(s.dis && /só fecha com o mini-artigo/.test(s.txt), 'sem mini-artigo o botão de concluir a Prova fica travado');
  await p.evaluate(() => SYS.App.A.confirmDone()); await run(p, 200);
  ok(await p.evaluate(() => !SYS.App.S.nodes.MT05 || SYS.App.S.nodes.MT05.s !== 'done'), 'e mesmo chamando direto a Prova não fecha');
  const antes = await p.evaluate(() => ({ a: SYS.App.D.wayXP.aesthetic, cal: SYS.App.D.brXP.aesthetic.cal, v: SYS.App.D.wayXP.vitruviano, xp: SYS.App.D.xp }));
  await p.evaluate(() => { const A = SYS.App; A.N.n.MT05 = { art: { perg: 'O volume semanal de treino prediz a minha melhora?', met: 'Oito semanas registradas em CSV, gráficos por script.', res: 'Correlação fraca: 0,3 com intervalo largo.', lim: 'Uma pessoa só, oito semanas, sono não controlado.', prox: 'Medir também o sono e repetir por mais oito.' } }; A.S.vit.proj.MT05 = 'corpus'; A.ui.modal = { type: 'done', id: 'MT05', checks: [true, true, true], ev: '' }; A.renderModal(); });
  await run(p, 200);
  ok(await p.evaluate(() => !document.querySelector('#modal [data-a="confirmDone"]').disabled), 'com o mini-artigo e o projeto, a Prova pode fechar');
  await p.evaluate(() => SYS.App.A.confirmDone()); await run(p, 300);
  s = await p.evaluate(() => ({ st: SYS.App.S.nodes.MT05.s, a: SYS.App.D.wayXP.aesthetic, cal: SYS.App.D.brXP.aesthetic.cal, v: SYS.App.D.wayXP.vitruviano, xp: SYS.App.D.xp, rank: SYS.E.mathRank(SYS.App.S), dupla: SYS.App.D.duplaXP }));
  ok(s.st === 'done' && s.rank === 1, 'Prova I fechada: rank I · Elementa');
  ok(s.v - antes.v === 200 && s.a - antes.a === 200 && s.cal - antes.cal === 200 && s.dupla === 200, 'XP dupla: +200 no Vitruviano e +200 no Aesthetic (Calistenia), pelo Corpus');
  await p.evaluate(() => { location.hash = '#/missoes/laterais'; }); await L.routed(p, 'missoes');
  await p.evaluate(() => { const f = SYS.App.ui.f.side || (SYS.App.ui.f.side = {}); f.t = 'Resolver a lista 3 de trigonometria'; f.way = 'vitruviano'; f.xp = 10; f.serve = ''; SYS.App.renderView(); });
  ok(await p.evaluate(() => /Filtro de Vitrúvio/.test(document.getElementById('view').innerText)), 'a lateral do Vitruviano pede "serve a qual Prova ou projeto?"');
  let n0 = await p.evaluate(() => SYS.App.S.sideq.length);
  await p.evaluate(() => SYS.App.A.sideAdd()); await run(p, 200);
  ok(await p.evaluate(() => SYS.App.S.sideq.length) === n0, 'sem resposta, não entra');
  await p.evaluate(() => { SYS.App.ui.f.side.serve = 'n:MT10'; SYS.App.A.sideAdd(); }); await run(p, 200);
  s = await p.evaluate(() => SYS.App.S.sideq[SYS.App.S.sideq.length - 1]);
  ok(s && s.way === 'vitruviano' && s.serve === 'n:MT10', 'com a resposta, entra e guarda a Prova que ela serve');
  await p.evaluate(() => { SYS.App.S.settings.openWorld = false; });
  s = await p.evaluate(() => ({ l09: SYS.E.reqOk(SYS.App.S, SYS.E.NODE.L09), msg: SYS.App.nodeLockMsg(SYS.E.NODE.L09).join(' ') }));
  ok(!s.l09 && /L07/.test(s.msg), 'chinês travado até o JLPT N4: ' + s.msg.replace(/<[^>]+>/g, ''));
  await p.evaluate(() => { SYS.App.S.nodes.L07 = { s: 'done', d0: '2026-11-16', d1: '2026-11-16' }; });
  ok(await p.evaluate(() => SYS.E.reqOk(SYS.App.S, SYS.E.NODE.L09)), 'com o L07, o chinês abre');

  sec('4 · Prokopton e Kalokagathia');
  s = await p.evaluate(() => { const K = SYS.E.kalok(SYS.App.D); return { rows: K.rows.map(r => r.k + ':' + r.iv[1] + '/' + r.max[1]).join(' '), pk: K.prokopton, kk: K.kalokagathia }; });
  ok(s.rows === 'vitruviano:Peritus/Vitruvianus aesthetic:Iron Monk/The Aesthete cal:Lever Adept/Gravity Breaker' && !s.pk && !s.kk, 'três barras com a condição: ' + s.rows);
  s = await p.evaluate(() => { const D = JSON.parse(JSON.stringify(SYS.App.D)), W = SYS.WAYMAP, E = SYS.E; const iv = (t) => t[3][0], mx = (t) => t[t.length - 1][0];
    const set = (vx, ax, cx) => { D.wayXP.vitruviano = vx; D.wayXP.aesthetic = ax; D.brXP.aesthetic.cal = cx; D.tier.vitruviano = E.tierOf(W.vitruviano.tiers, vx); D.tier.aesthetic = E.tierOf(W.aesthetic.tiers, ax); D.brTier.aesthetic.cal = E.tierOf(W.aesthetic.brmap.cal.tiers, cx); return E.kalok(D); };
    const a = set(iv(W.vitruviano.tiers), iv(W.aesthetic.tiers), iv(W.aesthetic.brmap.cal.tiers)), c = set(mx(W.vitruviano.tiers), mx(W.aesthetic.tiers), mx(W.aesthetic.brmap.cal.tiers)), d = set(mx(W.vitruviano.tiers), mx(W.aesthetic.tiers), 0);
    return { a: [a.prokopton, a.kalokagathia], c: [c.prokopton, c.kalokagathia], d: [d.prokopton, d.kalokagathia] }; });
  ok(s.a.join() === 'true,false', 'tier IV nos três: Prokopton, ainda não Kalokagathia');
  ok(s.c.join() === 'true,true', 'tier máximo nos três: Kalokagathia');
  ok(s.d.join() === 'false,false', 'sem o corpo (Calistenia) não há título');
  await p.evaluate(() => { location.hash = '#/titulos'; }); await L.routed(p, 'titulos');
  ok(await p.evaluate(() => /Prokopton/.test(document.getElementById('view').innerText) && /tier IV no Vitruviano, no Aesthetic e na vertente Calistenia/.test(document.getElementById('view').innerText)), 'Títulos mostra a condição escrita na tela');

  sec('5 · SGM-Opus: projetos, eras, ritual de fechamento e compras');
  s = await p.evaluate(() => ({ n: SYS.OPUS.P.length, ids: SYS.OPUS.P.map(P => P.id).join(','), eras: SYS.OPUS.P.reduce((a, P) => a + P.eras.length, 0), sh: SYS.OPUS.P.reduce((a, P) => a + P.shadow.length, 0), c: SYS.OPUS.COMPRAS.length, t: ['I','II','III'].map(t => SYS.OPUS.COMPRAS.filter(c => c.tier === t).length).join('/'), myth: SYS.OPUS.MAP.mythos.ways.join(), scr: SYS.OPUS.MAP.scrinium.ways.join() }));
  ok(s.n === 16 && s.c === 25 && s.t === '5/10/10', '16 projetos e 25 compras em 3 tiers (' + s.t + ')');
  ok(s.eras === 64 && s.sh === 70, 'eras e Shadow Levels do doc: ' + s.eras + ' eras, ' + s.sh + ' Shadow Levels');
  ok(s.myth === 'flaneur' && s.scr === 'vitruviano,architect', 'Mythos no Flâneur; Scrinium dividido entre Vitruviano e Architect');
  await p.evaluate(() => { location.hash = '#/opus/compras'; }); await L.routed(p, 'opus');
  s = await p.evaluate(() => { const E = SYS.E, S = SYS.App.S, C = SYS.OPUS.COMPRAS; return [1, 2, 4, 12].map(n => E.compraEstado(S, C.filter(c => c.n === n)[0])).join(','); });
  ok(s === 'liberado,bloqueado,liberado,bloqueado', 'livres liberados; o switch espera o Limen; o piano espera 30 dias de treino: ' + s);
  await p.evaluate(() => { SYS.App.A.opusAbrir({ getAttribute: () => 'umbra' }); }); await run(p, 200);
  await p.evaluate(() => { SYS.App.A.opusAbrir({ getAttribute: () => 'arca' }); }); await run(p, 200);
  s = await p.evaluate(() => ({ u: !!SYS.App.S.opus.p.umbra.ini, a: !!(SYS.App.S.opus.p.arca && SYS.App.S.opus.p.arca.ini) }));
  ok(s.u && !s.a, 'o primeiro projeto é livre; o segundo espera uma era fechar');
  const x0 = await p.evaluate(() => SYS.App.D.wayXP.architect);
  await p.evaluate(() => SYS.App.A.opusFecha({ getAttribute: () => 'umbra' })); await run(p, 200);
  ok(await p.evaluate(() => !SYS.App.S.opus.p.umbra.done[1]), 'sem evidência a era não fecha');
  await p.evaluate(() => { SYS.App.S.opus.p.umbra.ev[1] = 'foto da topologia + export do RouterOS'; SYS.App.A.opusFecha({ getAttribute: () => 'umbra' }); }); await run(p, 200);
  s = await p.evaluate(() => ({ d: SYS.App.S.opus.p.umbra.done[1], xp: SYS.App.D.wayXP.architect, festa: SYS.E.opusFesta(SYS.App.S.opus.p.umbra), sw: SYS.E.compraEstado(SYS.App.S, SYS.OPUS.COMPRAS[1]), fichas: SYS.E.opusFichas(SYS.App.S.opus) }));
  ok(s.d && s.xp - x0 === 50, 'Limen fechado: +50 XP no Architect');
  ok(s.festa && s.sw === 'liberado' && s.fichas === 1, 'dia de comemoração, o switch liberado e uma ficha para projeto novo');
  await p.evaluate(() => SYS.App.A.opusProx({ getAttribute: () => 'umbra' })); await run(p, 200);
  ok(await p.evaluate(() => SYS.App.S.opus.p.umbra.era === 1), 'no dia da comemoração a era 02 não abre');
  await at(p, '2026-11-17T10:00:00');
  await p.evaluate(() => SYS.App.A.opusProx({ getAttribute: () => 'umbra' })); await run(p, 200);
  ok(await p.evaluate(() => SYS.App.S.opus.p.umbra.era === 2), 'no dia seguinte a era 02 · Dominium abre');
  await p.evaluate(() => { SYS.App.ui.modal = { type: 'compra', id: 2, preco: '300', comparei: false }; SYS.App.renderModal(); }); await run(p, 200);
  s = await p.evaluate(() => ({ dis: document.querySelector('#modal [data-a="compraOk"]').disabled, txt: document.getElementById('modal').innerText }));
  ok(s.dis && /Subiu mais de 15%/.test(s.txt), 'preço 24% acima da referência: compara com a alternativa antes');
  const xc = await p.evaluate(() => SYS.App.D.xp);
  await p.evaluate(() => { SYS.App.ui.modal.comparei = true; SYS.App.A.compraOk(); }); await run(p, 200);
  s = await p.evaluate(() => ({ st: SYS.E.compraEstado(SYS.App.S, SYS.OPUS.COMPRAS[1]), xp: SYS.App.D.xp, pr: SYS.App.S.opus.buys[2].preco }));
  ok(s.st === 'comprado' && s.xp === xc && s.pr === 'R$ 300', 'comprado com o preço do dia e sem XP de compra');

  sec('6 · Rotina: ondas, dia mínimo, sono, folga e pausa');
  await at(p, '2026-11-18T10:00:00');
  await p.evaluate(() => { location.hash = '#/rotina'; }); await L.routed(p, 'rotina');
  s = await p.evaluate(() => ({ at: SYS.E.rotAtivos(SYS.App.S, SYS.U.today()).map(b => b.id).join(','), menu: document.getElementById('view').innerText }));
  ok(s.at === 'mat,eng,corpus', 'Onda 1 ativa: Mathematica, inglês e Corpus');
  ok(/Anki: vocabulário de inglês/.test(s.menu) && !/Kana escrito à mão/.test(s.menu), 'o menu de bolso só mostra o que pertence a bloco ativo');
  await p.evaluate(() => { ['mat','eng','corpus'].forEach(id => SYS.App.A.rotBloco({ getAttribute: k => k === 'data-id' ? id : 'min' })); });
  ok(await p.evaluate(() => SYS.E.rotDia(SYS.App.S, SYS.U.today()) === 'minimo'), '10 minutos de cada bloco: dia mínimo cumprido');
  ok(await p.evaluate(() => SYS.E.rotDia(SYS.App.S, '2026-11-17') === 'falhou'), 'o dia em branco conta como falha');
  await p.evaluate(() => { const r = SYS.App.rot(); ['2026-11-16','2026-11-17'].forEach(d => { r.dias[d] = r.dias[d] || {}; r.dias[d].sono = 'ruim'; }); SYS.App.A.rotSono({ getAttribute: () => 'ruim' }); });
  s = await p.evaluate(() => ({ leve: !!SYS.App.S.rot.leve, pz: SYS.App.S.pz.pause, on: SYS.App.S.pz.on, t: SYS.U.today() }));
  ok(s.leve && (!s.on || s.pz === s.t), 'três noites ruins seguidas: modo leve' + (s.on ? ' e o Chamado da Zona suspenso hoje' : ''));
  await p.evaluate(() => SYS.App.A.rotSono({ getAttribute: () => 'bom' }));
  ok(await p.evaluate(() => !SYS.App.S.rot.leve), 'uma noite boa e o modo leve sai');
  await p.evaluate(() => SYS.App.A.rotFolga()); await run(p, 100);
  s = await p.evaluate(() => ({ f: SYS.E.rotDia(SYS.App.S, SYS.U.today()), rest: !!SYS.App.S.daily[SYS.U.today()].rest }));
  ok(s.f === 'folga' && s.rest, 'folga da semana marca também o descanso das diárias');
  await at(p, '2026-11-19T10:00:00');
  await p.evaluate(() => SYS.App.A.rotFolga()); await run(p, 100);
  ok(await p.evaluate(() => SYS.E.rotDia(SYS.App.S, SYS.U.today()) !== 'folga'), 'só uma folga por semana');
  ok(await p.evaluate(() => !!document.querySelector('#hud .pausepill')), 'pílula de pausa visível no topo');
  await p.evaluate(() => { SYS.App.ui.modal = { type: 'rotPausa', ate: '2026-11-22', motivo: 'gripe' }; SYS.App.A.rotPausaOk(); }); await run(p, 200);
  s = await p.evaluate(() => ({ dia: SYS.E.rotDia(SYS.App.S, '2026-11-21'), fz: !!(SYS.App.S.daily['2026-11-21'] && SYS.App.S.daily['2026-11-21'].frozen), pz: SYS.App.S.pz.pause, on: SYS.App.S.pz.on }));
  ok(s.dia === 'pausa' && s.fz && (!s.on || s.pz === '2026-11-22'), 'pausa: Rotina não cobra, diárias protegidas e Zona suspensa');
  await p.evaluate(() => SYS.App.A.rotPausaFim()); await run(p, 200);
  ok(await p.evaluate(() => !SYS.App.S.rot.pausa && !SYS.App.S.daily['2026-11-21']), 'encerrar a pausa devolve os dias futuros');
  s = await p.evaluate(() => ({ d: SYS.E.rotAbst(SYS.App.S) }));
  ok(s.d === 5, 'Abstinentia conta desde 14/11: ' + s.d + ' dias');
  ok(p.errs.length === 0, 'sem erro de página: ' + p.errs.join(' | '));


  sec('7 · loja das vertentes');
  s = await p.evaluate(() => { const W = SYS.WAYMAP.vitruviano, by = {}; W.shop.forEach(i => { by[i.br || 'shadow'] = (by[i.br || 'shadow'] || 0) + 1; });
    const bad = W.shop.filter(i => i.req && !(/^n_/.test(i.req) ? SYS.E.NODE[i.req.slice(2)] : /^op_/.test(i.req) ? SYS.OPUS.COMPRAS.some(c => c.n === +i.req.slice(3)) : SYS.E.ACHMAP[i.req])).map(i => i.id);
    const ids = W.shop.map(i => i.id), dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    const nomes = ['vm4','vm5','vm7','vm8','vh8','vh9','vh10'].map(id => (W.shop.filter(i => i.id === id)[0] || {}).n || '?');
    return { by, bad, dup, nomes }; });
  ok(s.by.mat >= 16 && s.by.pol >= 8 && s.by.lin >= 16 && s.by.phi >= 30 && s.by.har >= 73 && s.by.shadow >= 2, 'todas as vertentes com loja: ' + JSON.stringify(s.by));
  ok(s.bad.length === 0 && s.dup.length === 0, 'todo req aponta para nó, conquista ou compra que existe; ids únicos ' + s.bad.concat(s.dup).join(','));
  ok(/Quadro branco de parede/.test(s.nomes[0]) && /científica/.test(s.nomes[1]) && /profissional/.test(s.nomes[2]) && /gráfica/.test(s.nomes[3]) && /órgão/.test(s.nomes[4]) && /Teclado/.test(s.nomes[5]) && /Piano digital/.test(s.nomes[6]), 'quadros, calculadoras, órgão, teclado e piano na loja');
  s = await p.evaluate(() => { const E = SYS.E, S = SYS.App.S, D = SYS.App.D, r = SYS.App.rot(), antes = E.reqMet(S, D, 'op_12'), t = SYS.U.today();
    for (let i = 0; i < 30; i++) { const d = SYS.U.addDays(t, -i); r.dias[d] = r.dias[d] || {}; r.dias[d].b = Object.assign(r.dias[d].b || {}, { har: 'min' }); }
    return { antes, depois: E.reqMet(S, D, 'op_12'), label: E.reqLabel('op_12') }; });
  ok(!s.antes && s.depois && /30 dias seguidos/.test(s.label), 'o piano da loja espera a compra 12 do SGM-Opus (30 dias de treino): ' + s.label);

  await L.done(b);
})();
