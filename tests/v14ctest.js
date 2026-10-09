/* v14c · ausência longa, Zona cheia, pausa, ajustes, tolerância, aparelho desatualizado, prévias, instalador, briefing, telas reconciliadas */
const L = require('./v14lib.js'); const { ok, sec, open, at, run, prime, st, act } = L;
const path = require('path');
const chg = (p, sel, v) => p.evaluate(({sel, v}) => { const el = document.querySelector(sel); if (!el) throw new Error('sem elemento ' + sel); if (el.type === 'checkbox') el.checked = v; else el.value = v; el.dispatchEvent(new Event('change', {bubbles:true})); }, {sel, v});
const zona = async (p) => { await p.evaluate(() => { location.hash = '#/status'; }); await run(p, 200); await p.evaluate(() => { location.hash = '#/zona'; }); await run(p, 400); };
const esc = async (p) => { await p.keyboard.press('Escape'); await run(p, 500); };
const rootTxt = p => p.evaluate(() => (document.getElementById('pzroot') || {innerText:''}).innerText);
const toasts = p => p.evaluate(() => document.getElementById('toasts').innerText);
const cloud = p => p.evaluate(() => { const r = window.__mock.db['data/users/u_test/core']; return r ? JSON.parse(r) : null; });

(async () => {
  const b = await L.chromium.launch();

  sec('A · sumiu quatro dias');
  let { p } = await open(b, '2026-10-05T10:00:00');
  await prime(p, true);
  await at(p, '2026-10-05T17:25:00'); await esc(p); await act(p, 1); await run(p, 500);
  let s = await st(p); ok(s.v === 'ok' && s.seq === 1, 'segunda cumprida');
  /* a Janela Dobrada fecha sozinha no veredito seguinte e mudaria a contagem; ela tem teste próprio no v14b */
  await p.evaluate(() => { SYS.App.S.pz.gin += 200; SYS.App.S.pz.off.dobro = true; SYS.Store.asAuto(() => SYS.App.commit(['core'])); }); await run(p, 1600);
  const g0 = (await st(p)).gem;
  await at(p, '2026-10-10T11:00:00', 2500);
  s = await st(p);
  ok(s.ov === 'miss' && s.tot.miss === 4 && s.last === '2026-10-09', 'voltou no sábado: quatro faltas julgadas de uma vez (' + s.tot.miss + ')');
  ok(s.open === 2, 'ausência longa rende no máximo duas prendas: ' + s.pens.filter(x => /open/.test(x)).join(', '));
  ok(g0 - s.gem === 30, 'as outras faltas viram multa pequena: −' + (g0 - s.gem) + ' ◆');
  let txt = await rootTxt(p);
  ok(/4 janelas vazias/i.test(txt) && /multa: −30/i.test(txt) && /sequência perdida: 1/i.test(txt), 'bronca lista as quatro janelas, a multa e a sequência perdida');
  ok(!/trégua/i.test(txt), 'trégua não apaga falta de dia passado');
  await p.click('#pzroot [data-a="pzSpin"]'); await run(p, 1200);
  txt = await rootTxt(p);
  ok(/Sentença · 2 prendas/i.test(txt) && /Ausência prolongada/i.test(txt), 'sentença com as duas prendas');
  await p.click('#pzroot [data-a="pzAccept"]'); await run(p, 600);
  ok((await p.evaluate(() => document.querySelectorAll('#view .pzcard').length)) === 2, 'dois cartões na Zona');
  s = await st(p); ok(s.ph === 'pre' && !s.ov, 'e o dia de hoje segue valendo (portão às 17:20)');

  sec('A2 · Zona cheia cobra em cristal');
  await at(p, '2026-10-10T17:21:00'); await esc(p);
  await at(p, '2026-10-10T19:30:05', 2500);
  s = await st(p); ok(s.ov === 'miss' && s.open === 3, 'falta de hoje: terceira prenda (' + s.open + ' abertas)');
  ok(/Usar trégua/i.test(await rootTxt(p)), 'falta de hoje ainda aceita trégua');
  await esc(p);
  const g1 = (await st(p)).gem;
  await at(p, '2026-10-11T17:21:00'); await esc(p);
  await at(p, '2026-10-11T19:30:05', 2500);
  s = await st(p); txt = await rootTxt(p);
  ok(s.ov === 'miss' && s.open === 3, 'Zona cheia: nenhuma prenda nova entra');
  ok(g1 - s.gem >= 20 && /Zona já tem 3 prendas abertas/i.test(txt) && /Entendido/i.test(txt) && !/receber a prenda/i.test(txt), 'a falta é cobrada em cristal (−' + (g1 - s.gem) + ' ◆, com prendas vencidas) e a tela explica');
  await p.click('#pzroot [data-a="pzClose"]'); await run(p, 600);
  ok(!(await st(p)).ov && !(await st(p)).show, 'entendido: fecha');
  await run(p, 6000); ok((await p.evaluate(() => SYS.Store.status)) === 'synced' && !(await p.evaluate(() => SYS.Store.DOCS.some(d => SYS.Store.pending[d] || SYS.Store.writing[d] || SYS.Store.checking[d]))), 'tudo gravado: indicador em "sincronizado", nada pendente');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 2).join(' | '));
  await p.context().close();

  sec('B · pausa para viagem');
  ({ p } = await open(b, '2026-10-05T10:00:00'));
  await prime(p, true); await zona(p);
  await chg(p, '#pzset input[data-c="pzPause"]', '2026-10-07'); await run(p, 600);
  s = await st(p);
  ok(s.ph === 'off' && /Chamados suspensos/i.test(await toasts(p)), 'pausa até quarta: hoje já está desarmado');
  ok(await p.evaluate(() => /Chamados suspensos até/.test(document.getElementById('view').innerText) && !!document.querySelector('[data-a="pzPauseClear"]')), 'a Zona mostra a pausa e o botão de cancelar');
  await chg(p, '#pzset input[data-c="pzPause"]', '2027-03-01'); await run(p, 400);
  ok((await p.evaluate(() => SYS.App.S.pz.pause)) === '2026-10-07', 'pausa acima de 45 dias é recusada');
  await at(p, '2026-10-06T19:31:00'); ok((await st(p)).tot.miss === 0 && !(await st(p)).ov, 'terça em branco durante a pausa: sem falta');
  await at(p, '2026-10-08T10:00:00', 2500);
  s = await st(p); ok(s.tot.miss === 0 && s.ph === 'pre' && !s.ov, 'quinta: nenhuma falta dos dias pausados, portão volta hoje');
  ok(/Portão hoje às 17:20/i.test(await toasts(p)), 'briefing do dia avisa o horário do portão');
  await at(p, '2026-10-08T19:30:05', 2500);
  ok((await st(p)).ov === 'miss' && (await st(p)).tot.miss === 1, 'e a quinta em branco já vale');
  await p.context().close();

  sec('C · ajustes do protocolo');
  ({ p } = await open(b, '2026-10-05T10:00:00'));
  await prime(p, true); await zona(p);
  const tm = k => p.evaluate((k) => SYS.App.S.pz[k], k);
  await chg(p, '#pzset input[data-k="ini"]', '18:40'); await run(p, 300);
  ok((await tm('ini')) === '17:20' && /Horário inválido/i.test(await toasts(p)), 'abrir depois de fechar é recusado');
  await chg(p, '#pzset input[data-k="fim"]', '17:30'); await run(p, 300);
  ok((await tm('fim')) === '18:30', 'janela de 10 minutos é recusada (mínimo 15)');
  await chg(p, '#pzset input[data-k="ini"]', '07:00'); await run(p, 300);
  ok((await tm('ini')) === '17:20', 'janela antes do reset do dia (08:00) é recusada');
  await chg(p, '#pzset input[data-k="ver"]', '18:00'); await run(p, 300);
  ok((await tm('ver')) === '19:30', 'veredito antes de o portão fechar é recusado');
  await chg(p, '#pzset input[data-k="ini"]', '17:00'); await run(p, 400);
  ok((await tm('ini')) === '17:00' && /Horário atualizado/i.test(await toasts(p)), 'horário válido entra: portão às 17:00');
  ok(/gere o instalador de novo/i.test(await toasts(p)), 'e lembra de gerar o instalador de novo');
  ok(await p.evaluate(() => SYS.App.pzScriptNow().indexOf("$Ini      = '17:00'") > 0 && SYS.App.pzScriptNow().indexOf("$Veredito = '19:30'") > 0), 'o instalador gerado usa os horários atuais');
  await at(p, '2026-10-05T17:05:00'); s = await st(p); ok(s.ov === 'call', 'chamado no horário novo (17:05)');
  await esc(p); await zona(p);
  await chg(p, '#pzset input[data-k="fim"]', '20:00'); await run(p, 300);
  ok((await tm('fim')) === '18:30' && /Horário travado/i.test(await toasts(p)), 'com o portão aberto o relógio não se mexe');
  await act(p, 1); await run(p, 500);
  await chg(p, '#pzset input[data-k="fim"]', '18:45'); await run(p, 300);
  ok((await tm('fim')) === '18:45', 'depois de cumprir a janela, ajustar volta a ser permitido');
  await p.click('#pzset [data-a="pzMinSet"][data-v="2"]'); await run(p, 300);
  ok((await tm('min')) === 2, 'mínimo de ações: 2');
  const dias0 = (await tm('dias')).length;
  await p.click('#pzset [data-a="pzDay"][data-d="0"]'); await run(p, 300);
  ok((await tm('dias')).length === dias0 - 1 && (await tm('dias')).indexOf(0) < 0, 'domingo desarmado');
  for (const d of [1, 2, 3, 4, 5, 6]) { await p.click('#pzset [data-a="pzDay"][data-d="' + d + '"]'); await run(p, 120); }
  ok((await tm('dias')).length === 1, 'o último dia armado não sai (sobra ' + JSON.stringify(await tm('dias')) + ')');
  const kinds = await p.evaluate(() => SYS.PZ.KINDS.map(k => k.id));
  for (const k of kinds) { await chg(p, '#pzset input[data-c="pzKindTgl"][data-k="' + k + '"]', false); await run(p, 120); }
  const off = await p.evaluate(() => Object.keys(SYS.App.S.pz.off).length);
  ok(kinds.length - off === 3 && /Mínimo de três prendas/i.test(await toasts(p)), 'a roleta nunca fica com menos de três prendas (' + (kinds.length - off) + ')');
  await chg(p, '#pzset input[data-c="pzOn"]', false); await run(p, 400);
  s = await st(p); ok(s.ph === 'off' && !/PORTÃO|VEREDITO/.test(s.pill), 'protocolo desligado: nada armado');
  ok(await p.evaluate(() => /Protocolo desligado/.test(document.getElementById('view').innerText) && !!document.querySelector('#pzset input[data-c="pzOn"]')), 'a Zona explica e deixa religar');
  await at(p, '2026-10-06T20:00:00', 2500);
  ok((await st(p)).tot.miss === 0 && !(await st(p)).ov, 'desligado, dia em branco não é julgado');
  await zona(p); await chg(p, '#pzset input[data-c="pzOn"]', true); await run(p, 500);
  s = await st(p); ok(s.since === '2026-10-07' && s.tot.miss === 0 && !s.ov, 'religado às 20:00: vale a partir de amanhã, sem bronca retroativa');
  ok(p.errs.length === 0, 'sem erro de JS ' + p.errs.slice(0, 2).join(' | '));
  await p.context().close();

  sec('D · tolerância de atraso');
  ({ p } = await open(b, '2026-10-05T10:00:00'));
  await prime(p, true); await zona(p);
  await chg(p, '#pzset input[data-c="pzTol"]', true); await run(p, 400);
  await at(p, '2026-10-05T17:21:00'); await esc(p);
  await at(p, '2026-10-05T18:31:00');
  ok(/ainda conta como atraso/.test(await toasts(p)), 'portão fechou: aviso diz que ainda dá para evitar a Zona');
  await act(p, 1);
  await at(p, '2026-10-05T19:30:05', 2500);
  s = await st(p); txt = await rootTxt(p);
  ok(s.ov === 'late' && s.rec.v === 'late' && s.open === 0 && s.tot.miss === 0 && s.tot.late === 1, 'ação depois do portão vira atraso: sem falta, sem prenda');
  ok(s.seq === 0 && s.gin === 0 && /sem prenda, sem bônus/i.test(txt), 'e também sem sequência e sem cristal');
  ok(await p.evaluate(() => !!document.querySelector('#pzroot svg.pzfig.m-late')), 'figura no modo atraso');
  await esc(p);
  await at(p, '2026-10-06T19:30:05', 2500);
  ok((await st(p)).ov === 'miss', 'no dia seguinte, sem ação nenhuma, é falta do mesmo jeito');
  await p.context().close();

  sec('E · notebook desatualizado, janela cumprida no celular');
  ({ p } = await open(b, '2026-10-07T10:00:00'));
  await prime(p, true); await run(p, 1500);
  const velho = await p.evaluate(() => ({ core: localStorage.getItem('sysasc.core.v1'), notes: localStorage.getItem('sysasc.notes.v1'), journal: localStorage.getItem('sysasc.journal.v1'), sync: localStorage.getItem('sysasc.sync.v1') }));
  await at(p, '2026-10-07T17:30:00'); await esc(p); await act(p, 2); await run(p, 2500);
  const novo = await p.evaluate(() => JSON.parse(JSON.stringify(window.__mock.db)));
  ok(JSON.parse(novo['data/users/u_test/core']).pz.log['2026-10-07'].v === 'ok', 'no "celular" a janela de hoje ficou cumprida e subiu para a nuvem');
  await p.context().close();
  const seed = ({velho, novo, delay}) => {
    try { if (!localStorage.getItem('__s')) { ['core', 'notes', 'journal'].forEach(k => { if (velho[k]) localStorage.setItem('sysasc.' + k + '.v1', velho[k]); }); if (velho.sync) localStorage.setItem('sysasc.sync.v1', velho.sync); localStorage.setItem('__s', '1'); } } catch (e) {}
    let m, c;
    Object.defineProperty(window, '__mock', { configurable: true, get(){ return m; }, set(v){ m = v; Object.keys(novo).forEach(k => { v.db[k] = novo[k]; }); } });
    if (delay) Object.defineProperty(window, 'claude', { configurable: true, get(){ return c; }, set(v){ const use = v.use; v.use = function(n){ return n === 'db' ? new Promise(res => setTimeout(() => use(n).then(res), delay)) : use(n); }; c = v; } });
  };
  ({ p } = await open(b, '2026-10-07T20:00:00', seed, { velho, novo, delay: 0 }));
  await run(p, 2500);
  s = await st(p);
  ok(s.tot.miss === 0 && s.open === 0 && s.ov !== 'miss', 'notebook abriu às 20:00 com o cache da manhã: NENHUMA bronca falsa');
  ok(s.ov === 'ok' && s.rec.v === 'ok' && s.a === 2, 'ele adotou a nuvem e mostrou o veredito de cumprido');
  let c = await cloud(p);
  ok(c.pz.log['2026-10-07'].v === 'ok' && c.pz.tot.miss === 0, 'e a nuvem continua com a janela cumprida');
  ok((await p.evaluate(() => (SYS.App.N.n.A01 || {st:[]}).st.length)) === 2, 'o que foi estudado no celular aparece no notebook');
  await p.context().close();

  sec('E2 · mesma situação com a nuvem demorando 8 segundos');
  ({ p } = await open(b, '2026-10-07T20:00:00', seed, { velho, novo, delay: 8000 }));
  await run(p, 3500);
  s = await st(p);
  ok(!s.ov && s.tot.miss === 0 && (await p.evaluate(() => !SYS.Store.settled())), 'enquanto a nuvem não responde, o veredito espera (nada de julgar com dado velho)');
  ok(await p.evaluate(() => document.body.classList.contains('sy-hold') && /nuvem está demorando/i.test((document.getElementById('syhold') || {}).innerText || '')), 'a edição continua travada e aparece o aviso com a opção de seguir assim mesmo');
  await run(p, 7000);
  s = await st(p);
  ok(s.tot.miss === 0 && s.ov === 'ok', 'nuvem respondeu: cumprido, sem bronca');
  ok(!(await p.evaluate(() => document.body.classList.contains('sy-hold') || !!document.getElementById('syhold'))), 'trava e aviso somem sozinhos');
  c = await cloud(p); ok(c.pz.log['2026-10-07'].v === 'ok', 'nuvem intacta');
  await p.context().close();

  sec('E3 · aba aberta desde cedo, notebook dormiu, janela cumprida no celular');
  ({ p } = await open(b, '2026-10-07T12:00:00', ({velho}) => { try { if (!localStorage.getItem('__s')) { ['core', 'notes', 'journal'].forEach(k => { if (velho[k]) localStorage.setItem('sysasc.' + k + '.v1', velho[k]); }); if (velho.sync) localStorage.setItem('sysasc.sync.v1', velho.sync); localStorage.setItem('__s', '1'); } } catch (e) {} let m; Object.defineProperty(window, '__mock', { configurable: true, get(){ return m; }, set(v){ m = v; v.db['data/users/u_test/core'] = velho.core; v.db['data/users/u_test/notes'] = velho.notes; } }); }, { velho }));
  await run(p, 2000);
  await p.evaluate((novo) => { Object.keys(novo).forEach(k => { window.__mock.db[k] = novo[k]; }); }, novo);   /* o celular gravou; o aviso ao vivo não chegou (aba dormindo) */
  await at(p, '2026-10-07T20:00:00', 2500);
  s = await st(p);
  ok(s.tot.miss === 0 && s.ov === 'ok' && s.rec.v === 'ok', 'acordou às 20:00: conferiu a nuvem antes de julgar — cumprido, sem bronca');
  c = await cloud(p); ok(c.pz.log['2026-10-07'].v === 'ok' && c.pz.tot.miss === 0, 'nuvem intacta');
  await p.context().close();

  sec('E4 · a conferência falha (sem resposta da nuvem)');
  ({ p } = await open(b, '2026-10-07T10:00:00'));
  await prime(p, true); await run(p, 1500);
  await p.evaluate(() => { SYS.Store.refs.core.get = () => Promise.reject({ code: 'unavailable' }); SYS.Store.refs.notes.get = SYS.Store.refs.core.get; SYS.Store.refs.journal.get = SYS.Store.refs.core.get; });
  await at(p, '2026-10-07T19:30:05', 6000);
  s = await st(p); ok(s.tot.miss === 0 && !s.ov, 'sem conseguir conferir, o veredito espera');
  ok(await p.evaluate(() => document.body.classList.contains('sy-hold') && !!document.querySelector('#syhold [data-a="syGo"]')), 'a edição fica travada e o aviso oferece seguir assim mesmo');
  await run(p, 60000);
  s = await st(p); ok(s.tot.miss === 0 && !s.ov, 'um minuto depois, ainda sem nuvem: continua esperando (nada de julgar às cegas)');
  await p.click('#syhold [data-a="syGo"]'); await run(p, 1000);
  ok(!(await p.evaluate(() => document.body.classList.contains('sy-hold') || !!document.getElementById('syhold'))), '"Editar assim mesmo" solta a trava');
  await run(p, 100000);
  s = await st(p); ok(s.tot.miss === 1 && s.ov === 'miss', 'depois de a pessoa assumir o risco e de várias tentativas, julga com o que tem');
  await p.context().close();

  sec('F · aba em segundo plano não julga');
  ({ p } = await open(b, '2026-10-07T10:00:00', () => { window.__hid = false; Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get(){ return window.__hid; } }); }));
  await prime(p, true);
  await p.evaluate(() => { window.__hid = true; document.dispatchEvent(new Event('visibilitychange')); });
  await at(p, '2026-10-07T19:30:05', 3000);
  s = await st(p); ok(s.tot.miss === 0 && !s.ov, 'escondida às 19:30: nada julgado');
  await p.evaluate(() => { window.__hid = false; document.dispatchEvent(new Event('visibilitychange')); }); await run(p, 1500);
  s = await st(p); ok(s.tot.miss === 1 && s.ov === 'miss', 'voltou para a frente: julga e mostra');
  await p.context().close();

  sec('G · prévias não mexem em nada');
  ({ p } = await open(b, '2026-10-07T10:00:00'));
  await prime(p, true); await zona(p);
  const snap0 = await p.evaluate(() => JSON.stringify(SYS.App.S.pz));
  await p.click('#pzset [data-a="pzDemo"][data-k="call"]'); await run(p, 400);
  txt = await rootTxt(p); ok(/Chamado do Sistema/i.test(txt) && /52:10/.test(txt) && /Fechar prévia/i.test(txt) && !/trégua/i.test(txt), 'prévia do chamado');
  await p.click('#pzroot [data-a="pzClose"]'); await run(p, 500);
  await p.click('#pzset [data-a="pzDemo"][data-k="miss"]'); await run(p, 400);
  ok(/janela em branco/i.test(await rootTxt(p)), 'prévia da bronca');
  await p.click('#pzroot [data-a="pzSpin"]'); await run(p, 1200);
  ok(/Sentença/i.test(await rootTxt(p)) && /Fechar prévia/i.test(await rootTxt(p)), 'prévia da roleta e da sentença');
  await p.click('#pzroot [data-a="pzAccept"]'); await run(p, 500);
  await p.click('#pzset [data-a="pzDemo"][data-k="ok"]'); await run(p, 400);
  ok(/janela cumprida/i.test(await rootTxt(p)), 'prévia do veredito cumprido');
  await esc(p);
  ok((await p.evaluate(() => JSON.stringify(SYS.App.S.pz))) === snap0 && (await st(p)).route === 'zona', 'estado do protocolo idêntico depois das três prévias');

  sec('H · instalador');
  ok(/desbloquear a tela/.test(await p.evaluate(() => document.getElementById('view').innerText)), 'cartão explica quando o Sistema abre sozinho');
  await p.click('[data-a="pzInstall"]'); await run(p, 400);
  const code = await p.evaluate(() => (document.querySelector('#modal textarea.pzcode') || {}).value || '');
  ok(code.length > 9000 && /Register-ScheduledTask/.test(code) && /abrir\.js/.test(code) && code.indexOf("$Ini      = '17:20'") > 0 && /YZt99TcUV9jxg284soxckp/.test(code), 'modal traz o script completo com URL e horários (' + code.length + ' bytes)');
  ok(!/[^\x00-\x7F]/.test(code) && !/@@[A-Z]+@@/.test(code) && (await p.evaluate(() => /\r\n/.test(SYS.App.pzScriptNow()) && !/[^\r]\n/.test(SYS.App.pzScriptNow()))), 'script só ASCII, sem placeholder, e o texto de origem em CRLF');
  await p.click('#modal [data-a="pzInstallTxt"]'); await run(p, 500);
  const sv = await p.evaluate(() => window.__mock.saves.slice(-1)[0]);
  ok(sv && sv.filename === 'system-ascension-instalador.txt' && sv.size === (await p.evaluate(() => SYS.App.pzScriptNow().length)), 'download como .txt: ' + (sv && sv.filename));
  await p.click('#modal [data-a="pzInstallCopy"]');
  let copied = false;                                   /* a área de transferência responde em tempo real, fora do relógio simulado */
  for (let i = 0; i < 40 && !copied; i++) { await new Promise(r => setTimeout(r, 100)); await run(p, 50); copied = /Instalador copiado|Selecione e copie/i.test(await toasts(p)); }
  ok(copied, 'botão de copiar responde');
  await esc(p);

  sec('I · briefing do dia');
  await at(p, '2026-10-07T17:25:00'); await esc(p); await act(p, 3); await run(p, 600);
  await at(p, '2026-10-07T19:30:05', 2500); await esc(p);
  await at(p, '2026-10-08T09:00:00', 2500);
  txt = await toasts(p); s = await st(p);
  ok(/Portão hoje às 17:20/i.test(txt) && /Ontem: janela cumprida \(rank B\)/.test(txt) && /Sequência: 1 janela/.test(txt), 'primeira abertura do dia: portão, resultado de ontem e sequência');
  ok(s.rec.b === 1 && !s.ov, 'é só um aviso, não tela cheia');
  await p.evaluate(() => { document.getElementById('toasts').innerHTML = ''; }); await at(p, '2026-10-08T12:00:00', 2500);
  ok(!/Portão hoje/i.test(await toasts(p)), 'não repete no mesmo dia');

  sec('J · ocupado na hora');
  await zona(p);
  await p.focus('#pzset input[data-c="pzPause"]');
  await at(p, '2026-10-08T17:20:03', 2500);
  s = await st(p); ok(!s.ov && s.rec.c === 1 && /O portão abriu/i.test(await toasts(p)), 'digitando às 17:20: aviso no canto em vez de tela cheia');
  ok(/1:\d\d:\d\d · 0\/1|\d\d:\d\d · 0\/1/.test(s.pill), 'e a pílula do HUD em contagem: ' + s.pill);
  await p.evaluate(() => { document.activeElement.blur(); });
  await p.click('.pzpill.p-janela'); await run(p, 400);
  ok((await st(p)).ov === 'call', 'clicar na pílula reabre o chamado');
  await esc(p);
  await p.evaluate(() => { SYS.App.A.openNode({ getAttribute: k => k === 'data-id' ? 'A01' : null }); }); await run(p, 400);
  ok(await p.evaluate(() => !!SYS.App.ui.drawer), 'capítulo aberto na gaveta');
  await at(p, '2026-10-08T19:30:05', 2500);
  s = await st(p); ok(s.ov === 'miss' && !(await p.evaluate(() => SYS.App.ui.drawer)), 'bronca não espera: fecha a gaveta e toma a tela');

  sec('K · outro aparelho aceitou a sentença');
  await run(p, 4000);                                    /* o veredito daqui termina de subir antes de o "outro aparelho" gravar em cima dele */
  await p.evaluate(() => { const k = 'data/users/u_test/core', R = JSON.parse(window.__mock.db[k]); R.pz.show = null; R._by = 'sOutroAparelho'; R._u = new Date(Date.now() + 3000).toISOString(); R._w = R._u; window.__mock.db[k] = JSON.stringify(R); (window.__mock.listeners[k] || []).forEach(fn => fn({ exists: true, data: () => JSON.parse(window.__mock.db[k]), metadata: { fromCache: false, hasPendingWrites: false } })); });
  await run(p, 800);
  s = await st(p); ok(!s.ov && s.open === 1 && !s.show, 'a tela cheia daqui fecha sozinha e a prenda continua aberta');

  sec('L · importar save não conta como ação');
  await at(p, '2026-10-09T17:25:00'); await esc(p);
  const exp = await p.evaluate(() => JSON.parse(SYS.App.saveJSON()));
  await p.evaluate((exp) => { exp.notes.n.A02 = { st: [0, 1, 2, 3, 4, 5] }; exp.core.nodes.A02 = { s: 'done', d0: '2026-10-01', d1: '2026-10-02' }; SYS.App.ui.modal = { type: 'import', data: exp }; SYS.App.A.importDo(); }, exp);
  await run(p, 900);
  s = await st(p); ok(s.a === 0 && !s.v, 'importar um save maior dentro da janela não cumpre a janela (ações ' + s.a + ')');
  const needL = s.need;                                  /* 2 se a prenda sorteada ontem foi a Janela Dobrada */
  await act(p, needL); await run(p, 500); s = await st(p); ok(s.a === needL && s.v === 'ok', 'ação de verdade depois, cumpre (mínimo de hoje: ' + needL + ')');

  sec('M · regras, status e navegação');
  await p.evaluate(() => { location.hash = '#/regras'; }); await run(p, 400);
  ok(await p.evaluate(() => /O Chamado, o Veredito e a Zona de Penalidade/i.test(document.getElementById('view').innerText) && /tréguas por mês/.test(document.getElementById('view').innerText)), 'Regras explicam o protocolo');
  ok(await p.evaluate(() => !!document.querySelector('#side a[href="#/zona"]')), 'Zona no menu lateral');
  await p.evaluate(() => { location.hash = '#/marcos'; }); await run(p, 400);
  ok(await p.evaluate(() => /Janelas cumpridas/.test(document.getElementById('view').innerText)), 'Marcos têm a trilha de janelas cumpridas');
  await p.evaluate(() => { location.hash = '#/conquistas'; }); await run(p, 400);
  ok(await p.evaluate(() => /Primeiro Portão/.test(document.getElementById('view').innerText)), 'Conquistas listam as do protocolo');
  ok(p.errs.length === 0, 'zero erros de JS ' + p.errs.slice(0, 3).join(' | '));
  await p.context().close();

  sec('N · sem nuvem nenhuma (arquivo solto)');
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const q = await ctx.newPage(); q.errs = []; q.on('pageerror', e => q.errs.push(e.message));
  await q.clock.install({ time: new Date('2026-10-07T10:00:00') });
  await q.goto('file://' + path.resolve(__dirname, '../dist/test_nomock.html')); await q.clock.runFor(1500);
  await q.evaluate(() => { const A = SYS.App; A.S.profile.name = 'Yam'; A.S.settings.motion = false; A.S.pz.intro = 1; SYS.Store.asAuto(() => A.commit(['core'])); }); await q.clock.runFor(2000);
  await q.clock.setSystemTime(new Date('2026-10-07T19:30:05')); await q.clock.runFor(2500);
  const sq = await q.evaluate(() => ({ miss: SYS.App.S.pz.tot.miss, ov: SYS.App.ui.pz && SYS.App.ui.pz.k, hold: document.body.classList.contains('sy-hold'), settled: SYS.Store.settled() }));
  ok(sq.settled && sq.miss === 1 && sq.ov === 'miss' && !sq.hold, 'só local: julga normalmente, sem esperar nuvem e sem travar a edição');
  ok(q.errs.length === 0, 'sem erro de JS ' + q.errs.slice(0, 2).join(' | '));
  await ctx.close();

  await L.done(b);
})();
