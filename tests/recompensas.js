/* recompensas · Bloco 3 da Cidade: documento v3, caixas em par e maldições, Fundo e vales, Ecos, Relíquias, Forja,
   títulos e cosméticos, preço das chaves, corrupção (Contenção, Revanche, emergencial) e as janelas na tela */
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
  await p.evaluate(() => {
    const A = SYS.App, E = SYS.E; A.S.pz.on = false; A.S.pz.intro = 1;
    window.T = {
      novo: (o) => { const C = E.cityFill(E.newCity()); C.since = '2026-10-14'; C.seed = 'sRec'; Object.assign(C, o || {}); return C; },
      lic: (C, r) => { C.lic.r = r; return C; },
      mk: (C, id, r, extra) => { const p = Object.assign({id, n: 'Portal ' + id, d: 'biblioteca', way: 'mind', rua: 0, r, st: 'open', born: '2026-10-14T11:00:00Z', due: '2030-01-01T00:00:00Z', mods: [], crit: ['a', 'b']}, extra || {}); C.portals.push(p); return p; },
      en: (r) => r === 'E' ? {txt: 'fiz o exercício inteiro'} : r === 'D' ? {txt: 'fiz o drill de três variações', res: '3 variações'} : {txt: 'Entreguei o mini-projeto inteiro, com o resultado e as decisões explicadas passo a passo.'}
    };
  });
  const ev = (fn, arg) => p.evaluate(fn, arg);

  sec('documento v3');
  let r = await ev(() => {
    const E = SYS.E, doc = () => ({v: 2, since: '2026-10-01', seed: 'x', inv: {mat: {}, passe: [], caixas: [], vales: [], frag: {}, perg: [], reliq: [{id: 'i7', r: 'epic', slot: 'Anel', d: 'galeria', at: '2026-10-10T10:00:00Z'}]}, ecos: [{id: 'e1', n: 'Template', d: 'biblioteca', rua: 0, r: 'rare'}]});
    const a = E.cityFill(doc()), b2 = E.cityFill(doc());
    return { v: a.v, rel: a.rel.length, n: a.rel[0] && a.rel[0].n, same: a.rel[0].n === b2.rel[0].n, slot: a.rel[0].slot, reliq: a.inv.reliq.length, eco: a.ecos[0].st + a.ecos[0].nv, campos: Array.isArray(a.wish) && Array.isArray(a.secreta) && !!a.fundo && Array.isArray(a.mald) && !!a.eq, novo: E.newCity().v };
  });
  ok(r.v === 3 && r.novo === 3 && r.campos, 'v2 → v3: Lista de Desejos, Lista Secreta, Fundo, maldições e avatar entram sem apagar nada');
  ok(r.rel === 1 && r.reliq === 0 && r.slot === 'Anel' && r.n && r.n.length > 6 && r.same, 'a Relíquia não identificada ganha nome (o mesmo em todo aparelho): ' + r.n);
  ok(r.eco === 'ativo1', 'Ecos antigos viram ativos, nível 1');

  sec('caixas em par');
  r = await ev(() => {
    const E = SYS.E, S = T.S ? T.S() : SYS.App.S, C = T.novo(), I = E.cyInv(C);
    I.caixas.push({id: 'b1', grau: 'menor', d: 'galeria'}, {id: 'b2', grau: 'maior'}, {id: 'b3', grau: 'menor', so: true}, {id: 'b4', grau: 'menor'});
    const p1 = JSON.stringify(E.cyCaixaPar(C, S, I.caixas[0])), p2 = JSON.stringify(E.cyCaixaPar(C, S, I.caixas[0]));
    const vazio = E.cyCaixaPar(C, S, I.caixas[0]).ab;
    E.cyWishSet(C, ['chave:C', 'chave:D', 'chave:D', 'tit:cyt_d_galeria', 'passe:galeria:0', 'chave:E', 'chave:B']);
    const wl = C.wish.length, dup = C.wish.filter(k => k === 'chave:D').length;
    C.wish = ['chave:C']; const menorC = E.cyCaixaPar(C, S, I.caixas[0]).ab.it.k, maiorC = E.cyCaixaPar(C, S, I.caixas[1]).ab.it;
    C.wish = ['chave:D'];
    const kD = (S.owned.keys.D || 0), ab = E.cyCaixaAbrir(C, S, 'b1', 'ab'), abOk = ab.ok && ab.it.k === 'chave' && (S.owned.keys.D || 0) === kD + 1 && ab.core;
    const am = E.cyCaixaAbrir(C, S, 'b4', 'am');
    const so = E.cyCaixaAbrir(C, S, 'b3', 'ab');
    return { igual: p1 === p2, vazio: vazio.it.k + ':' + vazio.it.n, wl, dup, menorC, maiorC: maiorC.k + maiorC.rank, abOk, sus: ab.sussurro, sai: I.caixas.map(x => x.id).join(), am: am.ok && !!am.mald && C.mald.length === 1 && SYS.CITY.MALDMAP[am.mald.k] ? am.mald.k : '', why: am.why, so: so.ok + ':' + so.msg };
  });
  ok(r.igual, 'o par sai da semente: abrir agora ou daqui a uma semana dá o mesmo par');
  ok(/^gem:\d+$/.test(r.vazio) && +r.vazio.split(':')[1] >= 40 && +r.vazio.split(':')[1] <= 100, 'Lista de Desejos vazia: a Abençoada Menor vem com 40 a 100 ◆ (' + r.vazio + ')');
  ok(r.wl === 5 && r.dup === 1, 'Lista de Desejos: até 5, sem repetir');
  ok(r.menorC === 'gem' && r.maiorC === 'chaveC', 'o desejo só cai quando o grau da caixa alcança: chave C não sai da Menor, sai da Maior');
  ok(r.abOk && r.sus && r.sai === 'b2,b3', 'abrir a Abençoada entrega o desejo, some com o par e a outra sussurra (' + r.sus + ')');
  ok(!!r.am && !!r.why, 'a Amaldiçoada entrega o que o Sistema acha que falta (' + r.why + ') e uma maldição: ' + r.am);
  ok(/^false:Só a Amaldiçoada/.test(r.so), 'portal Corrompido: o par vem só com a Amaldiçoada');

  sec('maldições');
  r = await ev(() => {
    const E = SYS.E, S = SYS.App.S, C = T.lic(T.novo(), 'C'), out = {}, now = Date.now();
    E.cyMaldAdd(C, S, 'breu', {}); out.breu = !!E.cyMaldTem(C, 'breu');
    E.cyMaldTick(C, now + 3 * 86400000); out.breuFim = !E.cyMaldTem(C, 'breu');
    const pe = T.mk(C, 'p1', 'E'); E.cyEnter(C, S, pe); E.cyMaldAdd(C, S, 'espelho', {});
    out.esp1 = E.cyClose(C, S, pe, T.en('E')).msg;
    out.esp2 = E.cyClose(C, S, pe, Object.assign(T.en('E'), {ensino: 'Expliquei como montei o exercício: primeiro a base, depois as variações e por fim o que eu mudaria.'})).ok;
    out.espFim = !E.cyMaldTem(C, 'espelho');
    const pm = T.mk(C, 'p2', 'C'); const g0 = E.cyOdds(C, pm).gem; E.cyMaldAdd(C, S, 'mao_vazia', {}); const g1 = E.cyOdds(C, pm).gem; out.mao = g1 === Math.floor(g0 / 2);
    C.portals = []; C.dist.servidores.closed = 9; C.dist.estudio.closed = 9; C.dist.piscinas.closed = 9; C.dist.escritorio.closed = 9; C.dist.agencia.closed = 9; C.dist.galeria.closed = 9;
    const mp = E.cyMaldAdd(C, S, 'posseiro', {}), pp = E.cyPortal(C, mp.p);
    out.posse = pp && pp.posse && pp.d === 'biblioteca' && pp.r === 'C' && Date.parse(pp.due) > now + 3000 * 86400000 && E.cyCount(C) === 0;
    const pi = T.mk(C, 'p3', 'D', {d: 'servidores', way: 'architect', due: new Date(now + 40 * 3600000).toISOString()});
    const pin = T.mk(C, 'p4', 'D', {d: 'servidores', way: 'architect', due: new Date(now + 40 * 3600000).toISOString(), in: new Date(now).toISOString()});
    const R = E.cyRng; E.cyRng = (s) => () => 0;   /* sorteio no primeiro bairro: Servidores */
    E.cyMaldAdd(C, S, 'insonia', {}); E.cyRng = R;
    out.ins = Math.round((Date.parse(pi.due) - now) / 3600000) + '/' + Math.round((Date.parse(pin.due) - now) / 3600000);
    const ms = E.cyMaldAdd(C, S, 'sirene', {}), ps = E.cyPortal(C, ms.p), d = ps.d, c0 = C.dist[d].corr;
    out.sirene = ps.sirene && Math.round((Date.parse(ps.due) - now) / 3600000) === 24;
    E.cyExpire(C, S, now + 25 * 3600000);
    out.sirPerdeu = C.dist[d].corr === c0 + 1 && C.log.some(l => l.k === 'sirene') && !E.cyPortal(C, ms.p);
    /* a caixa pediu o pergaminho: fechar o portal dele acaba a maldição */
    const I = E.cyInv(C); I.perg.push({id: 'g1', tipo: 'inimigo', rank: 'C', way: 'mind', cx: 'bx'}); const mc = E.cyMaldAdd(C, S, 'breu', {cx: 'bx', it: {k: 'perg', tipo: 'inimigo'}});
    const pg = E.cyPergUsar(C, S, 'g1'); out.ini = !!pg && pg.ini && pg.dobro && pg.cx === 'bx' && pg.mods.indexOf('inimigo_intimo') >= 0 && I.perg.length === 0;
    E.cyEnter(C, S, pg); const fc = E.cyClose(C, S, pg, T.en(pg.r)); out.cumpriu = fc.ok && !!mc.fim && mc.why === 'cumpriu' && fc.res.dobro && fc.res.rolls.length >= 2;
    return out;
  });
  ok(r.breu && r.breuFim, 'Breu dura 2 dias');
  ok(/Espelho/.test(r.esp1) && r.esp2 && r.espFim, 'Espelho: o portal só fecha depois de ensinar o que fez (80+ caracteres); depois a maldição acaba');
  ok(r.mao, 'Mão Vazia: ◆ pela metade');
  ok(r.posse, 'Posseiro: o bairro mais abandonado ganha um portal C que não some e não conta no limite');
  ok(r.ins === '20/40', 'Insônia: os portais em que você não entrou vencem na metade do tempo (' + r.ins + ')');
  ok(r.sirene && r.sirPerdeu, 'Sirene: emergencial de 24 h; perder sobe a corrupção do bairro');
  ok(r.ini && r.cumpriu, 'Pergaminho do Inimigo Íntimo: abre o portal do Caminho parado com drop dobrado, e fechar cumpre a maldição da caixa');

  sec('Fundo de Recompensas e vales');
  r = await ev(() => {
    const E = SYS.E, S = SYS.App.S, C = T.novo(), I = E.cyInv(C), out = {};
    E.cyFundoTick(C); out.f1 = C.fundo.saldo + '@' + C.fundo.mes;
    C.fundo.mes = '2026-07'; E.cyFundoTick(C); out.f2 = C.fundo.saldo;
    E.cyFundoDeposito(C, 50); out.dep = C.fundo.saldo + ':' + C.fundo.dep.length;
    C.fundo.saldo = 30;
    I.vales.push({id: 'v1', cat: 'ferramenta', teto: 60, r: 'rare', d: 'servidores'}, {id: 'v2', cat: 'tempo', teto: 0, r: 'common'}, {id: 'v3', cat: 'secreto', teto: 60, r: 'rare'}, {id: 'v4', cat: 'secreto', teto: 20, r: 'common'}, {id: 'v5', cat: 'lazer', teto: 25, r: 'common'});
    out.teto = E.cyResgatar(C, S, 'v1', {oque: 'um livro', custo: 70}).msg;
    out.curto = E.cyResgatar(C, S, 'v1', {oque: 'um livro', custo: 50}).curto;
    C.fundo.saldo = 100;
    const pens = S.pz.pens; S.pz.pens = [{id: 'x', st: 'open'}]; out.zona = E.cyResgatar(C, S, 'v1', {oque: 'um livro', custo: 50}).msg; S.pz.pens = pens;
    const ok1 = E.cyResgatar(C, S, 'v1', {oque: 'um livro de algoritmos', custo: 52.5, origem: true});
    out.res = ok1.ok && C.fundo.saldo === 47.5 && C.fundo.hist.length === 1 && ok1.rel && ok1.rel.slot === null && ok1.rel.origem && C.rel.length === 1;
    out.tempo = E.cyResgatar(C, S, 'v2', {oque: 'uma tarde no parque'}).ok && C.fundo.saldo === 47.5;
    E.cySecretaAdd(C, 'um disco', '35,90'); E.cySecretaAdd(C, 'um jantar caro', 400);
    const ab = E.cyValeAbrir(C, 'v3'); out.sec = ab && ab.rev && ab.rev.n === 'um disco' && C.secreta.length === 1;
    const ab2 = E.cyValeAbrir(C, 'v4'); out.lazer = ab2 && ab2.lazer && E.cyVale(C, 'v4').cat === 'lazer';
    const g0 = C.led.gem, g = E.cyValeGem(C, 'v5'); out.gem = g === SYS.CITY.DROP.valeGem[0] && C.led.gem === g0 + g && !E.cyVale(C, 'v5');
    for (let i = 0; i < 20; i++) E.cySecretaAdd(C, 'desejo ' + i, 10); out.max = C.secreta.length;
    E.cyFundoFixo(C, 300); out.fixo = E.cyFundoMensal(C); E.cyFundoFixo(C, ''); out.padrao = E.cyFundoMensal(C);
    return out;
  });
  ok(r.f1 === '80@2026-10', 'o Fundo nasce com o valor do mês pela Licença (E: R$ 80)');
  ok(r.f2 === 160 && r.dep === '210:1', 'a sobra passa adiante até 2 meses de Fundo; depositar soma por cima');
  ok(/teto/.test(r.teto) && r.curto && /Prenda/.test(r.zona), 'vale nunca vira dívida: passa do teto ou do saldo, não resgata; prenda aberta na Zona congela');
  ok(r.res, 'resgatar desconta do Fundo, registra o histórico e pode virar Relíquia de origem');
  ok(r.tempo, 'vale de Tempo não gasta o Fundo');
  ok(r.sec && r.lazer, 'Vale Secreto sorteia da Lista Secreta o que cabe no teto; se nada couber, vira Lazer');
  ok(r.gem && r.max === 12, 'vale vira ◆ na hora; a Lista Secreta guarda até 12');
  ok(r.fixo === 300 && r.padrao === 80, 'o valor mensal é editável e volta ao padrão da Licença');

  sec('Ecos e Arsenal');
  r = await ev(() => {
    const E = SYS.E, S = SYS.App.S, C = T.lic(T.novo(), 'C'), out = {}, I = E.cyInv(C);
    const eco = (id, extra) => C.ecos.push(Object.assign({id, n: 'Eco ' + id, tipo: 'template', r: 'common', d: 'biblioteca', rua: 0, nv: 1, st: 'ativo', at: '2026-10-10'}, extra || {}));
    eco('a'); eco('b'); eco('c'); eco('d', {rua: 1}); eco('x', {st: 'partido'});
    const p = T.mk(C, 'p1', 'C'); out.bonus = JSON.stringify(E.cyEcoBonus(C, p));
    const pm = T.mk(C, 'p2', 'C', {mods: ['ecos_mudos']}); out.mudo = E.cyEcoBonus(C, pm).q;
    out.qr = E.cyQR(C, p, {}).q - (E.cyQR(C, Object.assign({}, p, {mods: ['ecos_mudos']}), {}).q);
    out.forasem = E.cyEcoInvocar(C, p, 'a');
    E.cyEnter(C, S, p); out.inv = E.cyEcoInvocar(C, p, 'a') && E.cyEco(C, 'a').nv === 2 && p.eco === 'a';
    const ph = T.mk(C, 'p3', 'C', {mods: ['herdeiro']}); out.herdSem = E.cyModsOk(ph, {}).length; ph.eco = 'b'; out.herdCom = E.cyModsOk(ph, {}).length;
    out.junta = E.cyEcoJuntar(C, 'a', 'b') && E.cyEco(C, 'a').nv === 3 && !E.cyEco(C, 'b');
    out.naoJunta = E.cyEcoJuntar(C, 'a', 'd');
    out.apos = E.cyEcoAposentar(C, 'c') && I.mat.poeira === 1;
    out.po = E.cyEcoPoeira(C, 'a') && E.cyEco(C, 'a').nv === 4 && I.mat.poeira === 0;
    I.mat.poeira = 1; E.cyEcoPoeira(C, 'a'); out.asc = E.cyEco(C, 'a').nv === 5 && !!E.cyEco(C, 'a').asc && E.cyEcoBonus(C, p).r === 5;
    I.mat.poeira = 3; out.rem = E.cyReceita(C, S, 'remendo', {eco: 'x'}).ok && E.cyEco(C, 'x').st === 'ativo';
    return out;
  });
  ok(r.bonus === JSON.stringify({xp: 6, q: 6, r: 0, n: 3, asc: 0}) && r.mudo === 0 && r.qr === 6, 'cada Eco da mesma vertente dá +2% de XP e Q; Ecos Mudos corta o bônus');
  ok(!r.forasem && r.inv, 'invocar um Eco só lá dentro do portal: sobe 1 nível');
  ok(r.herdSem === 0 && r.herdCom === 1, 'do Herdeiro só soma quando um Eco foi invocado');
  ok(r.junta && !r.naoJunta, 'juntar Ecos da mesma vertente soma os níveis; de vertentes diferentes, não');
  ok(r.apos && r.po && r.asc, 'aposentar deixa Poeira; Poeira sobe nível; no 5 o Eco ascende e dá +5% de R no bairro');
  ok(r.rem, 'Remendo de Eco: o Partido volta com 3 Poeiras');

  sec('Relíquias');
  r = await ev(() => {
    const E = SYS.E, S = SYS.App.S, C = T.novo(), out = {}, I = E.cyInv(C), at = '2026-10-14T12:00:00Z';
    const u1 = E.cyRelGive(C, {slot: 'Anel', rar: 'epic', d: 'servidores', ctx: {tranc: true}, src: 'p9', srcN: 'O Deploy'}, at);
    const u2 = E.cyRelGive(C, {slot: 'Anel', rar: 'epic', d: 'servidores', ctx: {tranc: true}}, at);
    const u3 = E.cyRelGive(C, {slot: 'Anel', rar: 'rare', d: 'biblioteca'}, at);
    const u4 = E.cyRelGive(C, {slot: 'Anel', rar: 'epic', d: 'biblioteca'}, at);
    out.uni = u1.uni + '|' + (u2.uni || '-') + '|' + (u3.uni || '-') + '|' + u4.uni + '|' + u1.fonte;
    E.cyEquip(C, u2.id); E.cyEquip(C, u3.id); out.eq = C.eq.Anel === u3.id; E.cyEquip(C, u3.id); out.tira = !C.eq.Anel;
    I.mat.fio = 1; out.fio = E.cyFio(C, u2.id) && u2.v === 1 && !E.cyFio(C, u2.id);
    const L = E.cyRelGive(C, {slot: 'Manto', rar: 'legendary', d: 'galeria'}, at);
    const d = E.cyReceita(C, S, 'desmanchar', {rel: L.id}); out.desm = d.ok && Object.values(d.got).reduce((a, b) => a + b, 0) === 5 && d.got.fio >= 1 && !C.rel.some(x => x.id === L.id);
    out.desmUni = E.cyReceita(C, S, 'desmanchar', {rel: u1.id}).ok;
    const mt = E.cyRelGive(C, {slot: 'Relógio', rar: 'mythic', d: 'galeria'}, at); E.cyEquip(C, mt.id); out.mit = E.cyEquipped(C)['Relógio'].r === 'mythic';
    while (C.rel.filter(x => !x.uni && !x.origem).length < SYS.CITY.RELIQ.max) C.rel.push({id: 'f' + C.rel.length, slot: 'Arma', r: 'common', n: 'x', d: 'galeria', at});
    const n0 = C.rel.length, cheia = E.cyRelGive(C, {slot: 'Arma', rar: 'rare', d: 'galeria'}, at); out.cheia = C.rel.length === n0 && !!cheia.cheia;
    return out;
  });
  ok(r.uni === 'u_adaga|-|-|u_lanterna|O Deploy', 'únicas: Adaga do Prazo Vencido no Trancado épico, Lanterna na Biblioteca épica, uma vez cada (' + r.uni + ')');
  ok(r.eq && r.tira, 'uma Relíquia por espaço do avatar: equipar troca, tocar de novo tira');
  ok(r.fio, 'Fio de Ouro troca a variante');
  ok(r.desm && !r.desmUni, 'desmanchar uma lendária dá 5 materiais com Fio de Ouro; única não se desmancha');
  ok(r.cheia && r.mit, 'com 120 Relíquias comuns a próxima vira materiais; a mítica vai para o avatar');

  sec('Forja');
  r = await ev(() => {
    const E = SYS.E, S = SYS.App.S, C = T.novo(), out = {}, I = E.cyInv(C);
    Object.assign(I.mat, {pedra: 4, lixa: 1, brasa: 2, carmesim: 1, escoria: 15, carimbo: 1});
    const p = T.mk(C, 'p1', 'C', {mods: []});
    out.pedra = E.cyForjar(C, S, p, 'pedra').ok && p.mods.length === 1 && p.forja === 1;
    out.carm = E.cyForjar(C, S, p, 'carmesim').ok && p.mods.indexOf('corrompido') >= 0 && !!p.oculto;
    out.lixa = E.cyForjar(C, S, p, 'lixa').ok && p.mods.indexOf('corrompido') >= 0 && p.mods.length === 1;
    out.max = E.cyForjar(C, S, p, 'pedra').msg;
    const pe = T.mk(C, 'p2', 'E'); C.lic.r = 'E'; out.brasaE = E.cyForjar(C, S, pe, 'brasa').msg;
    C.lic.r = 'D'; out.brasaD = E.cyForjar(C, S, pe, 'brasa').ok && pe.r === 'D';
    E.cyEnter(C, S, pe); out.dentro = E.cyForjar(C, S, pe, 'pedra').msg;
    const pc = T.mk(C, 'p3', 'D'); const due0 = Date.parse(pc.due); out.carimbo = E.cyCarimbo(C, pc) && Date.parse(pc.due) - due0 === 86400000 && !I.mat.carimbo;
    C.lic.r = 'C'; E.cyEnter(C, S, p); out.revela = p.mods.length === 2 && !p.oculto;
    S.owned.keys.E = 3; const kD = S.owned.keys.D || 0; out.chave = E.cyReceita(C, S, 'chave', {rank: 'E'}).ok && S.owned.keys.E === 0 && S.owned.keys.D === kD + 1;
    out.recic = E.cyReceita(C, S, 'reciclar', {sai: 'lixa'}).ok && I.mat.lixa === 1 && I.mat.escoria === 10;
    C.dist.galeria.corr = 2; out.purif = E.cyReceita(C, S, 'purificar', {d: 'galeria'}).ok && C.dist.galeria.corr === 1 && I.mat.escoria === 0;
    I.frag.estudio = 5; out.cosm = E.cyReceita(C, S, 'cosm', {cid: 'fr_cy_estudio', d: 'estudio'}).core && S.owned.frames.indexOf('fr_cy_estudio') >= 0 && I.frag.estudio === 0;
    I.perg.push({id: 'a', tipo: 'permissao', rank: 'E'}, {id: 'b', tipo: 'permissao', rank: 'E'}, {id: 'c', tipo: 'permissao', rank: 'E'});
    out.perg = E.cyReceita(C, S, 'perg', {tipo: 'permissao', rank: 'E'}).ok && I.perg.length === 1 && I.perg[0].rank === 'D';
    I.vales.push({id: 'v1', cat: 'lazer', teto: 25, r: 'common'}, {id: 'v2', cat: 'assinatura', teto: 25, r: 'common'});
    out.vale = E.cyReceita(C, S, 'vale', {a: 'v1', b: 'v2', cat: 'ferramenta'}).ok && I.vales.length === 1 && I.vales[0].cat === 'ferramenta' && I.vales[0].r === 'uncommon';
    return out;
  });
  ok(r.pedra && r.carm && r.lixa, 'Pedra põe um modificador; Carmesim corrompe com um escondido; Lixa tira, mas nunca o Corrompido');
  ok(/no máximo 3/.test(r.max), 'no máximo 3 materiais por portal');
  ok(/Licença/.test(r.brasaE) && r.brasaD, 'Brasa sobe o rank até o da Licença');
  ok(/já entrou/.test(r.dentro) && r.revela, 'a Forja só vale antes de entrar; ao entrar, o escondido aparece');
  ok(r.carimbo, 'Carimbo de Prazo: +24 h');
  ok(r.chave && r.recic && r.purif, 'receitas: 3 chaves viram 1 do rank seguinte; 5 Escórias reciclam; 10 purificam');
  ok(r.cosm && r.perg && r.vale, 'receitas: cosmético do bairro com 5 fragmentos; pergaminho maior; 2 vales viram 1 da raridade seguinte');

  sec('títulos, cosméticos e chaves');
  r = await ev(() => {
    const E = SYS.E, A = SYS.App, S = A.S, out = {};
    A.citySet(true); const C = A.city; C.lic.r = 'D';
    const t = id => E.titleUnlocked(S, A.D, E.TITLEMAP[id]);
    out.lic = t('cyt_lic_E') && t('cyt_lic_D') && !t('cyt_lic_C');
    out.bairro0 = t('cyt_d_galeria');
    E.cyGive(C, S, {k: 'titulo', id: 'cyt_d_galeria'}, '2026-10-14T12:00:00Z'); out.bairro1 = t('cyt_d_galeria') && C.trof.some(x => x.id === 'cyt_d_galeria');
    out.titulos = E.TITLES.filter(x => x.cy).length;
    out.fr = E.ownsCosmetic(S, SYS.FRAMES, 'fr_lic_D', 'frames') && !E.ownsCosmetic(S, SYS.FRAMES, 'fr_lic_C', 'frames');
    out.nc = SYS.NAMECARDS.some(x => x.id === 'nc_cy_galeria');
    out.k = SYS.KEYPRICE.E + '/' + SYS.KEYPRICE.S;
    S.settings.cityBeta = false; out.k0 = SYS.KEYPRICE.E + '/' + SYS.KEYPRICE.S; S.settings.cityBeta = true;
    out.desejos = E.cyDesejos(S).length;
    return out;
  });
  ok(r.lic && !r.bairro0 && r.bairro1 && r.titulos === 13, 'os 13 títulos da Cidade: os da Licença pelo rank, os de bairro pela Abençoada');
  ok(r.fr && r.nc, 'molduras da Licença e cosméticos de bairro entram no Sistema');
  const kk = r.k.split('/').map(Number), k0 = r.k0.split('/').map(Number);
  ok(kk[0] === Math.round(k0[0] * 1.5 / 5) * 5 && kk[1] === Math.round(k0[1] * 1.5 / 5) * 5, 'com a Cidade ligada as chaves custam 50% a mais na loja (' + r.k0 + ' → ' + r.k + ')');
  ok(r.desejos > 40, 'a Lista de Desejos oferece chaves, passes, títulos e cosméticos (' + r.desejos + ' opções)');

  sec('corrupção: Contenção e Revanche');
  r = await ev(() => {
    const E = SYS.E, S = SYS.App.S, C = T.lic(T.novo(), 'C'), out = {}, now = Date.parse('2026-10-20T12:00:00Z');
    const pc = T.mk(C, 'c1', 'C', {d: 'piscinas', way: 'aesthetic', rua: 1, due: '2026-10-16T11:00:00Z', in: '2026-10-15T00:00:00Z', tpl: null});
    E.cyExpire(C, S, now);
    const rev = C.portals.find(x => x.rev), cont = C.portals.find(x => x.cont);
    out.esp = !!rev && !!cont && rev.mods.indexOf('revanche') >= 0 && cont.cont === 1 && E.cyCount(C) === 0;
    out.partido = C.ecos.length === 1 && C.ecos[0].st === 'partido';
    E.cyEnter(C, S, cont); const fc = E.cyClose(C, S, cont, T.en(cont.r)); out.cont = fc.ok && C.dist.piscinas.corr === 0 && (fc.res.gar.extra || []).length === 1 && C.ult.contido;
    C.dist.piscinas.corr = 1;
    E.cyEnter(C, S, rev); const fr = E.cyClose(C, S, rev, T.en(rev.r)); out.rev = fr.ok && C.dist.piscinas.corr === 0 && C.ecos[0].st === 'ativo' && C.ecos[0].r === 'rare' && C.quebras[0].desfeita && C.ult.revanche;
    out.revMods = E.cyModsOk(rev, {}).some(m => m.id === 'revanche');
    C.dist.galeria.corr = 3; E.cyInv(C).mat.purif = 1; out.purif = E.cyPurificar(C, 'galeria', 'purif') === 3 && C.dist.galeria.corr === 0;
    return out;
  });
  ok(r.esp && r.partido, 'quebrar deixa uma Revanche (7 dias), abre a Contenção do nível e o Eco Partido; especiais ficam fora do limite');
  ok(r.cont, 'fechar a Contenção tira 1 nível e entrega um par de caixas a mais');
  ok(r.rev && r.revMods, 'fechar a Revanche desfaz a quebra e conserta o Eco Partido (vira raro)');
  ok(r.purif, 'Purificação zera o bairro');

  sec('janelas: inventário, caixa, vale e Fundo');
  await p.evaluate(() => {
    const A = SYS.App, E = SYS.E, C = A.city, I = E.cyInv(C);
    C.vis = {ivo: '2026-10-14'}; C.wish = ['chave:E'];
    I.caixas.push({id: 'bx1', grau: 'menor', d: 'galeria', at: '2026-10-14T10:00:00Z'});
    I.vales.push({id: 'vx1', cat: 'ferramenta', teto: 60, r: 'rare', d: 'servidores', at: '2026-10-14T10:00:00Z'});
    Object.assign(I.mat, {pedra: 2, escoria: 6, purif1: 1}); C.dist.agencia.corr = 1;
    C.fundo.saldo = 100; C.fundo.mes = '2026-10';
    C.ecos.push({id: 'ex1', n: 'Checklist de revisão', tipo: 'checklist', r: 'common', d: 'biblioteca', rua: 0, nv: 2, st: 'ativo', at: '2026-10-10', link: 'https://exemplo.com/check'});
    C.rel.push({id: 'rx1', slot: 'Anel', r: 'legendary', n: 'Anel das 3h', lore: 'teste', d: 'biblioteca', at: '2026-10-14T10:00:00Z', v: 0});
    A.commit(['city'], {quiet: true}); location.hash = '#/cidade';
  });
  await run(1500);
  const top = () => p.evaluate(() => { const w = document.querySelector('#cyw.on .cyw-top'); return w ? {t: w.getAttribute('data-w'), txt: w.textContent} : {t: '', txt: ''}; });
  await p.click('.cy-me'); await run(); await p.click('#cyw [data-w="inv"]'); await run();
  r = await top();
  ok(r.t === 'inv' && /Caixas · sempre em par/.test(r.txt) && /Vales · 1 de 5/.test(r.txt) && /Materiais/.test(r.txt) && /Purificação Menor/.test(r.txt), 'o inventário mostra caixas, vales e materiais com uso');
  await p.click('#cyw [data-w="caixa"][data-id="bx1"]'); await run();
  r = await top();
  ok(r.t === 'caixa' && /Abençoada/.test(r.txt) && /Amaldiçoada/.test(r.txt) && /Lista de Desejos/.test(r.txt), 'a janela do par mostra as duas caixas');
  const kE = await p.evaluate(() => SYS.App.S.owned.keys.E || 0);
  await p.click('#cyw .cy-cxb.ab'); await run();
  r = await top(); r.k = await p.evaluate(() => SYS.App.S.owned.keys.E || 0); r.box = await p.evaluate(() => SYS.E.cyInv(SYS.App.city).caixas.length);
  ok(/Você abriu a Abençoada/.test(r.txt) && /sussurra/.test(r.txt) && r.k === kE + 1 && r.box === 0, 'abrir a Abençoada: a chave do desejo chega e a outra sussurra');
  await p.click('#cyw .cyw-top [data-a="cyWinBack"]'); await run();
  await p.click('#cyw [data-w="vale"][data-id="vx1"]'); await run();
  await p.fill('#cyw [data-f="vo_vx1"]', 'livro de grafos'); await p.fill('#cyw [data-f="vc_vx1"]', '72'); await p.click('#cyw [data-a="cyResg"]'); await run();
  r = await p.evaluate(() => document.getElementById('cyErr-vvx1').textContent);
  ok(/teto/.test(r), 'passou do teto: a janela avisa e não resgata');
  await p.fill('#cyw [data-f="vc_vx1"]', '45,90'); await p.click('#cyw [data-a="cyResg"]'); await run();
  r = await p.evaluate(() => ({ saldo: SYS.App.city.fundo.saldo, vales: SYS.E.cyInv(SYS.App.city).vales.length, w: (document.querySelector('#cyw.on .cyw-top') || {getAttribute: () => ''}).getAttribute('data-w') }));
  ok(r.saldo === 54.1 && r.vales === 0 && r.w === 'inv', 'resgatar com R$ 45,90 desconta do Fundo e volta ao inventário');
  await p.selectOption('#cyw [data-c="cyPurif"]', 'agencia'); await run();
  r = await p.evaluate(() => SYS.App.city.dist.agencia.corr);
  ok(r === 0, 'Purificação Menor usada pelo inventário');
  await p.click('#cyw .cyw-top .cyw-x'); await run();
  await p.click('.cy-me'); await run(); await p.click('#cyw [data-w="fundo"]'); await run();
  r = await top();
  ok(r.t === 'fundo' && /R\$ 54,1/.test(r.txt) && /livro de grafos/.test(r.txt), 'Fundo e vales: saldo e histórico');
  await p.click('#cyw [data-tab="secreta"]'); await run();
  await p.fill('#cyw [data-f="sN"]', 'um teclado bonito'); await p.fill('#cyw [data-f="sP"]', '120'); await p.click('#cyw [data-a="cySecAdd"]'); await run();
  r = await top();
  ok(/1 de 12 guardados/.test(r.txt) && !/teclado/.test(r.txt) && /••••/.test(r.txt), 'Lista Secreta: guarda e esconde');
  await p.click('#cyw [data-tab="desejos"]'); await run();
  await p.selectOption('#cyw [data-c="cyWishAdd"]', 'chave:D'); await run();
  r = await p.evaluate(() => SYS.App.city.wish.join());
  ok(r === 'chave:E,chave:D', 'Lista de Desejos: acrescentar pela janela');

  sec('janelas: Arsenal, Relíquias, Troféus e Forja');
  await p.keyboard.press('Escape'); await run(); await p.click('#cyw [data-w="arsenal"]'); await run();
  r = await top(); r.pips = await p.evaluate(() => document.querySelectorAll('#cyw .cy-pips i.on').length);
  ok(r.t === 'arsenal' && /Checklist de revisão/.test(r.txt) && r.pips === 2 && /\+2%/.test(r.txt), 'Arsenal: Eco com nível, vertente e bônus');
  await p.keyboard.press('Escape'); await run(); await p.click('#cyw [data-w="reliq"]'); await run();
  await p.click('#cyw [data-a="cyEquip"][data-id="rx1"]'); await run();
  r = await p.evaluate(() => ({ eq: SYS.App.city.eq.Anel, slot: !!document.querySelector('#cyw .cy-slot.on'), uni: document.querySelector('#cyw [data-tab="unicas"]').textContent }));
  ok(r.eq === 'rx1' && r.slot && /0\/7/.test(r.uni), 'Relíquias: equipar acende o espaço no avatar');
  await p.keyboard.press('Escape'); await run();
  const ch0 = await p.evaluate(() => SYS.App.ui.cyChimed || 0);
  await p.click('#cyw [data-w="perfil"]'); await run();
  r = await p.evaluate(() => ({ som: SYS.App.ui.cyChimed || 0, ava: !!document.querySelector('#cyw .cyw-top .cy-ava.sm .cy-slot.on') }));
  ok(r.som === ch0 + 1 && r.ava, 'lendária equipada: o Perfil abre com um acorde e mostra as Relíquias');
  await p.keyboard.press('Escape'); await run(); await p.click('#cyw [data-w="trof"]'); await run();
  await p.click('#cyw [data-a="cyTitulo"][data-id="cyt_lic_E"]'); await run();
  r = await p.evaluate(() => ({ t: SYS.App.S.profile.title, hud: (document.querySelector('.cy-me-tt') || {}).textContent }));
  ok(r.t === 'cyt_lic_E' && r.hud === 'Caçador de Rua', 'Sala de Troféus: equipar o título mostra no topo da Cidade');
  await p.click('#cyw .cyw-top .cyw-x'); await run();
  await p.click('.cy-svg .cy-centro .cy-dz', {force: true}); await run();
  await p.click('#cyw [data-w="forja"]'); await run();
  await p.selectOption('#cyw [data-f="rc_reciclar_sai"]', 'pedra'); await run();
  await p.click('#cyw [data-a="cyRec"][data-id="reciclar"]'); await run();
  r = await p.evaluate(() => ({ e: SYS.E.cyInv(SYS.App.city).mat.escoria, pd: SYS.E.cyInv(SYS.App.city).mat.pedra }));
  ok(r.e === 1 && r.pd === 3, 'Forja no Centro: reciclar 5 Escórias em 1 Pedra');
  await p.click('#cyw .cyw-top .cyw-x'); await run();

  sec('portal: Forja na ficha, Breu, maldição no HUD e o relógio da praça');
  const pid = await p.evaluate(() => { const C = SYS.App.city, x = C.portals.find(q => q.st === 'open' && !q.in && !q.fis && SYS.E.cyForjaPode(q)); if (x) x.mods = []; return x ? x.id : ''; });
  await p.evaluate(id => SYS.App.cyWinOpen({t: 'portal', id}), pid); await run();
  const m0 = await p.evaluate(id => SYS.E.cyPortal(SYS.App.city, id).mods.length, pid);
  r = await p.evaluate(() => !!document.querySelector('#cyw .cy-forjaw [data-a="cyForjar"][data-m="pedra"]'));
  await p.click('#cyw .cy-forjaw [data-m="pedra"]'); await run();
  r = { btn: r, m: await p.evaluate(id => SYS.E.cyPortal(SYS.App.city, id).mods.length, pid), chip: /Forja 1\/3/.test((await top()).txt) };
  ok(pid && r.btn && m0 === 0 && r.m === 1 && r.chip, 'na ficha do portal, a Forja põe a Pedra antes de entrar (e a ficha conta 1/3)');
  await p.click('#cyw .cyw-top .cyw-x'); await run();
  await p.evaluate(() => { const A = SYS.App, E = SYS.E; E.cyMaldAdd(A.city, A.S, 'breu', {}); A.commit(['city'], {quiet: true}); });
  await run();
  r = await p.evaluate(() => ({ q: Array.from(document.querySelectorAll('.cy-svg .cy-badge[data-a="cyOpen"] .cy-badge-t')).map(t => t.textContent), chip: (document.querySelector('.cy-maldb') || {}).textContent }));
  ok(r.q.length > 0 && r.q.every(t => t === '?') && /Breu/.test(r.chip), 'Breu: o mapa mostra "?" no lugar do rank, e a maldição aparece no HUD');
  await p.click('.cy-maldb'); await run();
  r = await top();
  ok(r.t === 'mald' && /2 dias|acaba em/.test(r.txt) && /esconde o rank/.test(r.txt), 'a maldição abre numa janela com o efeito e o tempo');
  await p.click('#cyw .cyw-top .cyw-x'); await run();
  r = await p.evaluate(() => !!document.querySelector('.cy-svg .cy-clock'));
  await p.evaluate(() => { const A = SYS.App; A.city.rel.push({id: 'rm', slot: 'Relógio', r: 'mythic', n: 'Ponteiro', d: 'galeria', at: '2026-10-14T10:00:00Z', v: 0}); SYS.E.cyEquip(A.city, 'rm'); A.commit(['city'], {quiet: true}); });
  await run();
  r = { antes: r, depois: await p.evaluate(() => !!document.querySelector('.cy-svg .cy-clock')) };
  ok(!r.antes && r.depois, 'mítica equipada: o relógio da praça aparece marcando 3h33');
  r = await p.evaluate(() => { const L = SYS.App.cyLOGT, C = SYS.App.city; return C.log.filter(l => ['caixa', 'maldicao', 'resgate', 'receita', 'purificou'].indexOf(l.k) >= 0).map(l => L[l.k] ? L[l.k](l) : '').filter(Boolean); });
  ok(r.length >= 4 && r.every(t => t.length > 10), 'o celular conta caixas, maldições, resgates, Forja e purificação (' + r.length + ' mensagens)');

  sec('erros');
  ok(errs.length === 0, 'sem erro de JS' + (errs.length ? ' ' + errs.slice(0, 3).join(' | ') : ''));
  console.log('\n' + oks + ' ok, ' + fails + ' falhas');
  await b.close();
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
