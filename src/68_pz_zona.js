/* ===== v13 · ZONA DE PENALIDADE · tela, prendas, quitação, IA, ajustes e instalador ===== */
App.pzPen = function(id){ return App.pz().pens.filter(function(p){ return p.id === id; })[0] || null; };
App.pzDr = function(p){ return p.dr || (p.dr = {}); };
App.pzAI = function(){ return !!App.sample && !App.sampleOff; };
App.pzRefresh = function(){ if (App.ui.pz) App.pzRender(false); if (App.ui.route === 'zona' && !App.typing()) App.renderView(); App.pzPaint(); };
App.pzPaidToast = function(p){ var k = E.pzKind(p.k) || {n:'Prenda'}; App.toast({t:'[' + SYS.PZ.NAME + '] ' + k.n + ' quitada', s:App.pzLine('paid') + (E.pzOpen(App.S).length ? '' : ' Loja liberada.'), ic:'check', ms:6500}); };

/* ---------- hoje: linha do tempo da janela ---------- */
App.pzToday = function(){
  var S = App.S, z = App.pz(), P = App.pzPhase(), rec = P.rec, c = App.pzClock();
  var a0 = P.ini - 90, a1 = P.ver + 120, span = a1 - a0, pos = function(m){ return U.clamp((m - a0) / span * 100, 0, 100).toFixed(2) + '%'; };
  var tl = '<div class="pztl" aria-hidden="true"><div class="tl-rail"></div>'
    + '<div class="tl-seg w" style="left:' + pos(P.ini) + ';width:' + ((P.fim - P.ini) / span * 100).toFixed(2) + '%"></div>'
    + '<div class="tl-seg l" style="left:' + pos(P.fim) + ';width:' + ((P.ver - P.fim) / span * 100).toFixed(2) + '%"></div>'
    + [[P.ini, z.ini, 'abre'], [P.fim, z.fim, 'fecha'], [P.ver, z.ver, 'veredito']].map(function(m){ return '<div class="mk' + (m[2] === 'fecha' ? ' b' : '') + '" style="left:' + pos(m[0]) + '"><span>' + U.esc(m[1]) + '<i> ' + m[2] + '</i></span></div>'; }).join('')
    + (P.min >= a0 && P.min <= a1 ? '<div class="now" style="left:' + pos(P.min) + '"></div>' : '') + '</div>';
  var msg, cls = '', acts = '';
  if (!P.armed) {
    if (!z.since) msg = 'O protocolo ainda não foi armado. Ele começa a valer quando você aceitar a apresentação do ' + SYS.PZ.NAME + '.';
    else if (z.since > c.day) msg = 'Protocolo armado. Primeira janela valendo: <b>' + App.pzDate(z.since) + ' às ' + U.esc(z.ini) + '</b>.';
    else if (z.pause && c.day <= z.pause) msg = 'Chamados suspensos até <b>' + App.pzDate(z.pause) + '</b>. O ' + SYS.PZ.NAME + ' volta no dia seguinte.';
    else msg = 'Hoje não é dia armado. Nenhuma janela, nenhum veredito.';
  } else if (rec.v === 'rest') { msg = rec.tr ? 'Trégua usada hoje. Sem janela, sem prenda.' : rec.g ? 'Hoje não vale: o dia foi armado com o portão já aberto. A primeira janela é a próxima.' : 'Dia de descanso declarado antes de o portão abrir. Janela desarmada.'; }
  else if (rec.v === 'ok') { cls = 'gate'; msg = rec.early && !P.a ? '<b>Cumprido antes da hora.</b> Diárias fechadas antes de o portão abrir.' : '<b>Janela cumprida · rank ' + E.pzRank(P.a) + '.</b> ' + P.a + ' ' + (P.a === 1 ? 'ação registrada' : 'ações registradas') + ' dentro do portão. Continuar é opcional e bem-vindo.'; }
  else if (rec.v === 'late') { msg = '<b>Atraso.</b> Você apareceu depois de o portão fechar: sem prenda, sem bônus.'; }
  else if (rec.v === 'miss') { cls = 'fail'; msg = '<b>Janela em branco.</b> Falta registrada' + (rec.p ? ' e prenda sorteada.' : '.'); }
  else if (P.ph === 'pre') { msg = 'O portão abre às <b>' + U.esc(z.ini) + '</b> — em ' + U.fmtDur(P.toIni * 1000) + '. Mínimo: ' + P.need + ' ' + (P.need === 1 ? 'ação real' : 'ações reais') + '.'; }
  else if (P.ph === 'janela') { cls = 'fail'; msg = '<b>Portão aberto.</b> Faltam ' + App.pzMMSS(P.left) + '. Ações na janela: ' + P.a + '/' + P.need + '.'; acts += '<button class="btn sm primary" data-a="pzRecall">' + U.icon('clock') + 'Ver o chamado</button>'; }
  else { cls = 'fail'; msg = z.tol ? '<b>O portão fechou.</b> Uma ação real até ' + U.esc(z.ver) + ' ainda conta como atraso e evita a Zona.' : '<b>O portão fechou vazio.</b> O veredito sai às ' + U.esc(z.ver) + '.'; }
  if (App.pzCanTruce() && !rec.v) acts += '<button class="btn sm ghost" data-a="pzTruce">' + U.icon('moon') + 'Usar trégua hoje (' + App.pzTruceLeft() + ')</button>';
  return '<section class="win"><div class="win-h">' + U.icon('clock') + 'Hoje · ' + App.pzDate(c.day) + '</div>' + tl
    + '<div class="callout ' + cls + '" style="margin-top:10px">' + msg + '</div>' + (acts ? '<div class="row" style="margin-top:10px">' + acts + '</div>' : '') + '</section>';
};

/* ---------- campos reutilizados nos cartões ---------- */
App.pzArea = function(p, key, ph, min, rows){
  var v = (p.dr || {})[key] || '';
  return '<label class="fld" style="text-transform:none;letter-spacing:0"><textarea rows="' + (rows || 7) + '" maxlength="6000" data-i="pzDr" data-id="' + p.id + '" data-k="' + key + '" data-min="' + (min || 0) + '" placeholder="' + U.esc(ph) + '">' + U.esc(v) + '</textarea>'
    + (min ? '<span class="faint mono" style="font-size:11px" id="pzcnt-' + p.id + '-' + key + '">' + v.trim().length + ' / mínimo ' + min + '</span>' : '') + '</label>';
};
App.pzCrit = function(p, list){
  var cr = (p.dr || {}).cr || [];
  return '<div class="stack" style="gap:0"><span class="eyebrow">Autoavaliação honesta</span>' + list.map(function(t, i){ return '<label class="check"><input type="checkbox" data-c="pzCk" data-id="' + p.id + '" data-k="cr" data-i2="' + i + '"' + (cr[i] ? ' checked' : '') + '><span>' + U.esc(t) + '</span></label>'; }).join('') + '</div>';
};

/* ---------- cartão de prenda aberta ---------- */
App.pzCard = function(p){
  var k = E.pzKind(p.k) || {n:p.k, ic:'alert', how:''}, c = App.pzClock(), b = p.body || {}, d = p.dr || {}, id = p.id, ai = App.pzAI();
  var busy = App.ui.pzBusy[id], err = App.ui.pzErr[id], res = App.ui.pzRes[id], body = '', foot = '';
  var started = (d.ck || []).some(Boolean) || (d.t || '').length > 40;
  var gen = (ai && k.ai && !p.gen && !busy && !started) ? '<button class="btn sm ghost" data-a="pzGenBtn" data-id="' + id + '">' + U.icon('oracle') + 'Redigir sob medida</button>' : '<span></span>';
  var frase = b.frase ? '<p class="dim" style="font-style:italic">“' + U.esc(b.frase) + '”</p>' : '';
  if (p.k === 'treino') {
    body = frase + '<p><b>' + U.esc(b.t) + '</b> <span class="dim">· ' + b.rounds + ' voltas · ' + U.esc(b.rest) + ' · cerca de ' + b.min + ' min</span></p>'
      + '<div class="stack" style="gap:2px"><span class="eyebrow">Aquecimento</span><p class="dim" style="font-size:13.5px">' + SYS.PZ.WARM.map(U.esc).join(' · ') + '</p></div>'
      + '<div class="stack" style="gap:0"><span class="eyebrow">Circuito · marque depois de fazer todas as voltas</span>'
      + b.items.map(function(it, i){ return '<label class="pzex"><span class="check" style="padding:0"><input type="checkbox" data-c="pzCk" data-id="' + id + '" data-k="ck" data-i2="' + i + '"' + ((d.ck || [])[i] ? ' checked' : '') + '></span><span>' + U.esc(it[0]) + '</span><b>' + U.esc(it[1]) + '</b></label>'; }).join('') + '</div>'
      + '<div class="callout" style="font-size:13px">' + U.esc(SYS.PZ.SAFE) + '</div>';
    foot = gen + '<button class="btn primary" data-a="pzPay" data-id="' + id + '">' + U.icon('check') + 'Circuito feito</button>';
  } else if (p.k === 'briefing') {
    body = frase + '<div class="row" style="gap:8px">' + (App.way(b.w) ? H.wayChip(b.w) : '') + '<b>' + U.esc(b.t) + '</b></div>'
      + '<div class="callout fail"><h4 style="margin-bottom:6px">Cenário</h4>' + U.esc(b.c) + '</div>'
      + '<div class="callout"><h4 style="margin-bottom:6px">O que entregar</h4>' + U.esc(b.q) + '</div>'
      + App.pzArea(p, 't', 'Situação · opções · recomendação · risco · próximo passo', 600, 9)
      + (ai ? '<p class="faint" style="font-size:12.5px">O Examinador avalia: ' + SYS.PZ.CRIT.map(function(x){ return x.toLowerCase(); }).join('; ') + '.</p>' : App.pzCrit(p, SYS.PZ.CRIT));
    foot = gen + (ai ? '<button class="btn primary" data-a="pzGrade" data-id="' + id + '"' + (busy ? ' disabled' : '') + '>' + U.icon('oracle') + 'Entregar ao Examinador</button>' : '<button class="btn primary" data-a="pzPay" data-id="' + id + '">' + U.icon('check') + 'Entregar briefing</button>');
  } else if (p.k === 'banca') {
    var n = E.NODE[b.node];
    body = (n ? '<p>Capítulo sorteado: <b>' + U.esc(n.id + ' · ' + App.chapNode(n).t) + '</b></p><div class="row" style="gap:8px">' + H.wayChip(n.way) + '<button class="btn sm" data-a="openNode" data-id="' + n.id + '">' + U.icon('scroll') + 'Abrir o capítulo</button></div>' : '<p class="dim">O capítulo sorteado não existe mais. Explique qualquer capítulo que você concluiu.</p>')
      + '<p class="dim" style="font-size:13.5px">' + App.PZ_BANCA.pedido + '</p>'
      + App.pzArea(p, 't', 'Com as suas palavras, com exemplo e com o modo de falha', 400, 8)
      + (ai && n ? '<p class="faint" style="font-size:12.5px">O Examinador avalia só este resumo: ' + App.PZ_BANCA.crit.map(function(c){ return '<b>' + c[0] + '</b> ' + c[1]; }).join('; ') + '. Não cobra a missão do capítulo, o entregável nem ferramentas.</p>'
        : App.pzCrit(p, App.PZ_BANCA.crit.map(function(c){ return c[0] + ' — ' + c[2]; })));
    foot = '<span></span>' + (ai && n ? '<button class="btn primary" data-a="pzGrade" data-id="' + id + '"' + (busy ? ' disabled' : '') + '>' + U.icon('oracle') + 'Entregar ao Examinador</button>' : '<button class="btn primary" data-a="pzPay" data-id="' + id + '">' + U.icon('check') + 'Entregar</button>');
  } else if (p.k === 'autopsia') {
    body = '<p class="dim" style="font-size:13.5px">Causa, não culpa. O objetivo é consertar o sistema que te fez faltar, não se punir por ter faltado.</p>'
      + '<span class="eyebrow">O que aconteceu na hora da janela?</span>' + App.pzArea(p, 'a', 'Fato, sem adjetivo: onde eu estava, o que eu estava fazendo', 60, 3)
      + '<span class="eyebrow">O que travou o início?</span>' + App.pzArea(p, 'b', 'O obstáculo real: cansaço, tarefa grande demais, não saber por onde começar…', 60, 3)
      + '<span class="eyebrow">O que muda na próxima janela?</span>' + App.pzArea(p, 'c', 'Uma mudança concreta e pequena, não uma promessa', 60, 3);
    foot = '<span></span><button class="btn primary" data-a="pzPay" data-id="' + id + '">' + U.icon('check') + 'Registrar autópsia</button>';
  } else if (p.k === 'marcha') {
    body = '<label class="check"><input type="checkbox" data-c="pzCk" data-id="' + id + '" data-k="ok" data-b="1"' + (d.ok ? ' checked' : '') + '><span><b>Caminhei ' + (b.min || 30) + ' minutos sem tela na mão.</b><br><span class="dim" style="font-size:13.5px">Fone pode. Rolar feed andando não conta.</span></span></label>'
      + '<label class="fld">Uma coisa que eu reparei no caminho<input type="text" maxlength="200" data-i="pzDr" data-id="' + id + '" data-k="obs" value="' + U.esc(d.obs || '') + '" placeholder="Algo que você só viu porque não estava olhando para a tela"></label>';
    foot = '<span></span><button class="btn primary" data-a="pzPay" data-id="' + id + '">' + U.icon('check') + 'Marcha feita</button>';
  } else if (p.k === 'leitura') {
    body = '<label class="fld">Livro (' + (b.pag || 20) + ' páginas)<input type="text" maxlength="120" data-i="pzDr" data-id="' + id + '" data-k="livro" value="' + U.esc(d.livro || '') + '" placeholder="Título do livro — de preferência um da Biblioteca do Sistema"></label>'
      + '<span class="eyebrow">Cinco linhas suas</span>' + App.pzArea(p, 't', 'O que mudou no que você pensa — não o resumo do capítulo', 250, 5);
    foot = '<a class="btn sm ghost" href="#/biblioteca">' + U.icon('book') + 'Biblioteca</a><button class="btn primary" data-a="pzPay" data-id="' + id + '">' + U.icon('check') + 'Leitura feita</button>';
  } else if (p.k === 'selo') {
    if (c.day > b.night) {
      body = '<p>A noite de <b>' + App.pzDate(b.night) + '</b> passou. Palavra sua, e só sua:</p>';
      foot = '<button class="btn sm danger" data-a="pzSeal" data-id="' + id + '" data-ok="0">Quebrei o selo</button><button class="btn primary" data-a="pzSeal" data-id="' + id + '" data-ok="1">' + U.icon('check') + 'Cumpri: não joguei</button>';
    } else {
      body = '<div class="pzseal"><span style="color:var(--accent2)">' + U.icon('lock') + '</span><span>' + (c.day === b.night ? '<b>É hoje.</b> Noite selada até o reset do dia (' + String(U.resetHour()).padStart(2, '0') + ':00). Ranqueada, casual, “só uma”: nada.' : 'Noite selada: <b>' + App.pzDate(b.night) + '</b>. Nada de jogo nessa noite.') + '</span></div>'
        + '<p class="faint" style="font-size:13px">A confirmação abre no dia seguinte. O Sistema não vigia o seu computador: quem responde é você.</p>';
    }
  } else if (p.k === 'dobro') {
    body = '<p>Na janela de <b>' + App.pzDate(b.day) + '</b> o mínimo sobe para <b>' + Math.max(2, (+App.pz().min || 1) * 2) + ' ações reais</b>. O Sistema confere sozinho: cumpriu, a prenda fecha na hora; faltou, vira multa.</p>';
  }
  var think = busy ? '<div class="exam-out"><div class="thinking"><i></i><i></i><i></i>' + (busy === 'gen' ? 'O ' + SYS.PZ.NAME + ' está redigindo a sua sentença…' : 'O Examinador está lendo. Pode levar até um minuto.') + '</div></div>' : '';
  var out = res ? '<div class="exam-out"><div class="row between"><span class="verdict ' + (res.pass ? 'APROVADO' : 'REPROVADO') + '">' + (res.pass ? 'ACEITO' : 'DEVOLVIDO') + '</span><span class="mono" style="font:700 24px/1 var(--f-mono)">' + res.nota + '<small class="dim" style="font-size:12px">/100</small></span></div>'
    + (res.resumo ? '<p>' + U.esc(res.resumo) + '</p>' : '') + ((res.faltou || []).length ? '<ul class="list">' + res.faltou.map(function(x){ return '<li><span>' + U.esc(x) + '</span></li>'; }).join('') + '</ul>' : '')
    + (res.pass ? '' : '<p class="faint" style="font-size:12.5px">Ajuste o texto e entregue de novo. A prenda só fecha com a nota mínima.</p>') + '</div>' : '';
  return '<article class="pzcard" id="pen-' + id + '"><div class="row between" style="gap:8px;align-items:flex-start"><h3>' + U.icon(k.ic) + ' ' + U.esc(k.n) + '</h3><div class="row" style="gap:6px">'
    + '<span class="chip ' + (p.over ? 'bad' : 'warn') + '">' + (p.over ? 'vencida · ' : 'prazo: ') + App.pzDue(p) + '</span><span class="chip">falta de ' + App.pzDate(p.f || p.d) + '</span>' + (p.src === 'ai' ? '<span class="chip glow">sob medida</span>' : '') + '</div></div>'
    + body + think + (err ? '<p class="bad" style="font-size:13.5px">' + U.esc(err) + '</p>' : '') + out
    + (foot ? '<div class="row between" style="gap:8px">' + foot + '</div>' : '') + '</article>';
};

/* ---------- validação e quitação ---------- */
App.pzCheck = function(p){
  var d = p.dr || {}, len = function(s){ return (s || '').trim().length; }, all = function(a, n){ for (var i = 0; i < n; i++) if (!(a || [])[i]) return false; return true; };
  if (p.k === 'treino') return all(d.ck, (p.body.items || []).length) ? '' : 'Marque cada exercício depois de fazer todas as voltas.';
  if (p.k === 'briefing') return len(d.t) < 600 ? 'O briefing pede pelo menos 600 caracteres. Faltam ' + (600 - len(d.t)) + '.' : all(d.cr, SYS.PZ.CRIT.length) ? '' : 'Confira os cinco critérios, com honestidade.';
  if (p.k === 'banca') return len(d.t) < 400 ? 'A explicação pede pelo menos 400 caracteres. Faltam ' + (400 - len(d.t)) + '.' : all(d.cr, 4) ? '' : 'Confira os quatro critérios, com honestidade.';
  if (p.k === 'autopsia') return (len(d.a) >= 60 && len(d.b) >= 60 && len(d.c) >= 60) ? '' : 'Três respostas, com pelo menos 60 caracteres cada.';
  if (p.k === 'marcha') return !d.ok ? 'Confirme a caminhada.' : len(d.obs) < 30 ? 'Escreva uma coisa que você reparou (pelo menos 30 caracteres).' : '';
  if (p.k === 'leitura') return len(d.livro) < 2 ? 'Qual livro?' : len(d.t) < 250 ? 'Cinco linhas próprias: pelo menos 250 caracteres. Faltam ' + (250 - len(d.t)) + '.' : '';
  return 'Esta prenda é conferida pelo próprio Sistema.';
};
App.A.pzPay = function(el){
  var id = el.getAttribute('data-id'), p = App.pzPen(id); if (!p || p.st !== 'open') return;
  if ((p.k === 'briefing' || (p.k === 'banca' && E.NODE[p.body.node])) && App.pzAI()) return;
  var err = App.pzCheck(p); if (err) { App.ui.pzErr[id] = err; App.renderView(); return; }
  var d = p.dr || {}, ev = {text:String(d.t || d.obs || d.c || '').slice(0, 500), livro:d.livro || ''};
  delete App.ui.pzErr[id];
  E.pzPayState(App.S, p, ev, App.pzClock().day);
  App.commit(['core']); App.pzPaidToast(p);
};
App.A.pzSeal = function(el){
  var S = App.S, z = App.pz(), c = App.pzClock(), id = el.getAttribute('data-id'), ok = el.getAttribute('data-ok') === '1', p = App.pzPen(id);
  if (!p || p.st !== 'open' || p.k !== 'selo' || c.day <= p.body.night) return;
  if (ok) { E.pzPayState(S, p, {seal:1}, c.day); App.commit(['core']); App.pzPaidToast(p); return; }
  p.st = 'failed'; p.paid = new Date().toISOString();
  var fine = E.pzFine(S, SYS.PZ.FINE.dobro); z.lastKind = 'selo';
  var np = E.pzOpen(S).length < SYS.PZ.MAXOPEN ? App.pzDraw(p.f || p.d) : null; if (np) z.pens.push(np);
  App.commit(['core']);
  App.toast({t:'[' + SYS.PZ.NAME + '] Selo quebrado', s:'Honestidade registrada.' + (fine ? ' −' + fine + ' ◆.' : '') + (np ? ' Nova prenda: ' + E.pzKind(np.k).n + '.' : ''), ic:'alert', ms:7500});
};
App.I.pzDr = function(el){
  var p = App.pzPen(el.getAttribute('data-id')); if (!p || p.st !== 'open') return;
  var k = el.getAttribute('data-k'); App.pzDr(p)[k] = el.value.slice(0, 6000); App.debSave('core');
  var c = App.$('pzcnt-' + p.id + '-' + k); if (c) c.textContent = el.value.trim().length + ' / mínimo ' + el.getAttribute('data-min');
};
App.C.pzCk = function(el){
  var p = App.pzPen(el.getAttribute('data-id')); if (!p || p.st !== 'open') return;
  var d = App.pzDr(p), k = el.getAttribute('data-k') || 'ck';
  if (el.getAttribute('data-b')) d[k] = el.checked; else { var a = d[k] = d[k] || []; a[+el.getAttribute('data-i2')] = el.checked; }
  delete App.ui.pzErr[p.id]; Store.save(['core']);
};

/* ---------- redação e avaliação pelo Claude (com reserva local sempre pronta) ---------- */
App.pzCtx = function(){
  var S = App.S, ways = E.focusWays(S).concat(E.fixedWays(S)).map(function(id){ var w = App.way(id); return w ? w.name + ' — ' + w.pt + ' (id: ' + id + ')' : ''; }).filter(Boolean), done = [], doing = [];
  Object.keys(S.nodes || {}).forEach(function(id){ var n = E.NODE[id], s = S.nodes[id]; if (!n) return; if (s.s === 'done') done.push([s.d1 || '', n.t]); else if (s.s === 'doing' || s.s === 'review') doing.push(n.t); });
  done.sort(function(a, b){ return a[0] < b[0] ? 1 : -1; });
  return {ways:ways, done:done.slice(0, 6).map(function(x){ return x[1]; }), doing:doing.slice(0, 4)};
};
App.PZ_WHO = 'Você é o ' + SYS.PZ.NAME + ', o executor de penalidades do "System Ascension", um sistema pessoal de evolução gamificado. O jogador deixou passar a janela diária de trabalho e uma prenda foi sorteada. Seu tom é seco, frio e direto, sem humilhar e sem atacar o valor da pessoa: você cobra o comportamento. Português do Brasil.';
App.pzPromptTreino = function(){
  var D = App.D, w = SYS.WAYMAP.aesthetic, b = w && w.brmap && w.brmap.cal, ti = (D.brTier.aesthetic && D.brTier.aesthetic.cal) || {n:'iniciante', i:0};
  var feitos = b ? b.nodes.filter(function(n){ return D.nodeDone[n.id]; }).map(function(n){ return n.t; }).slice(-8) : [];
  return App.PZ_WHO + '\n\nA prenda sorteada foi uma LISTA DE EXERCÍCIOS.\nNível do jogador na vertente de Calistenia do Sistema: "' + ti.n + '" (degrau ' + (ti.i + 1) + ' de 5). Capítulos de calistenia já concluídos: ' + (feitos.length ? feitos.join('; ') : 'nenhum ainda — trate como iniciante') + '.'
    + '\n\nMonte UM circuito de peso corporal adequado a esse nível. Regras de segurança obrigatórias: de 12 a 20 minutos no total; de 3 a 5 voltas; de 3 a 5 exercícios; repetições entre 4 e 20, ou tempo entre 10 e 60 segundos; volume moderado, nada até a falha, nada de teste de carga máxima; sem equipamento obrigatório (barra fixa só com alternativa); cada exercício com uma versão mais fácil entre parênteses no próprio nome.'
    + '\n\nResponda SOMENTE com JSON: {"titulo": "até 40 caracteres", "minutos": 12, "voltas": 4, "descanso": "ex.: 60 s entre voltas", "itens": [{"nome": "exercício (versão mais fácil)", "qtd": "ex.: 10, ou 30 s, ou 8 por perna"}], "frase": "uma frase seca do ' + SYS.PZ.NAME + ', até 120 caracteres"}';
};
App.pzPromptCena = function(){
  var x = App.pzCtx();
  return App.PZ_WHO + '\n\nA prenda sorteada foi um BRIEFING DE CENÁRIO.\nCaminhos do jogador no Sistema: ' + (x.ways.join(' | ') || 'não definidos') + '.\nCapítulos concluídos recentemente: ' + (x.done.join('; ') || 'nenhum') + '.\nEm andamento: ' + (x.doing.join('; ') || 'nenhum') + '.'
    + '\n\nCrie UM cenário de crise realista e específico, de mesa (resolve-se pensando e escrevendo, sem acesso a sistema nenhum), ligado a um desses Caminhos, que exija decisão com trade-off sob pressão de tempo. Dê números, prazos e uma restrição incômoda. Não use nome de pessoa ou empresa real.'
    + '\n\nResponda SOMENTE com JSON: {"caminho": "id do Caminho", "titulo": "até 60 caracteres", "cenario": "o que aconteceu, 300 a 700 caracteres", "tarefa": "o que o briefing de uma página precisa conter, até 400 caracteres", "frase": "uma frase seca do ' + SYS.PZ.NAME + ', até 120 caracteres"}';
};
App.pzPromptGrade = function(p, txt){
  var b = p.body;
  return App.EXAM_RULES + '\n\nVocê está avaliando um BRIEFING DE UMA PÁGINA entregue como pagamento de uma prenda. Seja rigoroso e justo; briefing vago, genérico ou sem decisão não passa.\n\n=== CENÁRIO ===\n' + b.t + '\n' + b.c + '\n\n=== O QUE FOI PEDIDO ===\n' + b.q + '\n\n=== CRITÉRIOS ===\n' + SYS.PZ.CRIT.join('\n') + '\n\n=== BRIEFING DO JOGADOR ===\n' + txt.slice(0, 6000)
    + '\n\nAprovação exige nota >= 65, recomendação clara e risco tratado. Responda SOMENTE com JSON: {"nota": 0, "resumo": "2 frases diretas", "faltou": ["até 3 itens, cada um com até 200 caracteres"]}';
};
App.pzCleanTreino = function(r){
  if (!r || typeof r !== 'object' || !Array.isArray(r.itens)) return null;
  var rounds = Math.round(+r.voltas), min = Math.round(+r.minutos), items = [];
  if (!(rounds >= 2 && rounds <= 5) || !(min >= 8 && min <= 22)) return null;
  for (var i = 0; i < r.itens.length; i++) {
    var it = r.itens[i] || {}, nome = String(it.nome || '').trim().slice(0, 90), qtd = String(it.qtd || '').trim().slice(0, 24), nums = qtd.match(/\d+/g) || [];
    if (!nome || !qtd || !nums.length || nums.some(function(x){ return +x > 60; })) return null;
    items.push([nome, qtd]);
  }
  if (items.length < 3 || items.length > 5) return null;
  return {t:String(r.titulo || 'Circuito sob medida').slice(0, 48), min:min, rounds:rounds, rest:String(r.descanso || '60 s entre voltas').slice(0, 40), items:items, frase:String(r.frase || '').slice(0, 140)};
};
App.pzCleanCena = function(r){
  if (!r || typeof r !== 'object') return null;
  var c = String(r.cenario || '').trim(), q = String(r.tarefa || '').trim(), t = String(r.titulo || '').trim();
  if (c.length < 120 || q.length < 40 || !t) return null;
  return {w:SYS.WAYMAP[r.caminho] ? r.caminho : E.mainWay(App.S), t:t.slice(0, 70), c:c.slice(0, 900), q:q.slice(0, 500), frase:String(r.frase || '').slice(0, 140)};
};
App.pzGen = function(id, silent){
  var p = App.pzPen(id), k = p && E.pzKind(p.k);
  if (!p || p.st !== 'open' || p.gen || !k || !k.ai || !App.pzAI() || App.ui.pzBusy[id]) return;
  var d = p.dr || {}; if ((d.ck || []).some(Boolean) || (d.t || '').length > 40) return;
  App.ui.pzBusy[id] = 'gen'; delete App.ui.pzErr[id]; App.pzRefresh();
  App.sample.json(p.k === 'treino' ? App.pzPromptTreino() : App.pzPromptCena(), {cache:false}).then(function(r){
    var q = App.pzPen(id); if (!q || q.st !== 'open') return;
    var b = q.k === 'treino' ? App.pzCleanTreino(r) : App.pzCleanCena(r), d2 = q.dr || {};
    var started = (d2.ck || []).some(Boolean) || (d2.t || '').trim().length > 0 || App.pzTypingIn(id);
    q.gen = 1;
    if (b && !started) { q.body = b; q.src = 'ai'; delete q.dr; }
    else if (b && started) { if (!silent) App.ui.pzErr[id] = 'Você já começou a de reserva: ela continua valendo.'; }
    else if (!silent) App.ui.pzErr[id] = 'A versão sob medida veio fora do padrão. Continua valendo a de reserva.';
    Store.asAuto(function(){ App.commit(['core'], {norender:true}); });
  }).catch(function(e){ var st = {}; App.examFail(st, e); if (!silent && st.err) App.ui.pzErr[id] = st.err; })
    .then(function(){
      delete App.ui.pzBusy[id]; App.pzRefresh();
      /* quem está digitando não tem a tela redesenhada: tira só o aviso de "redigindo" do cartão */
      var th = document.querySelector('#pen-' + id + ' .exam-out .thinking'); if (th && th.parentNode && th.parentNode.parentNode) th.parentNode.parentNode.removeChild(th.parentNode);
    });
};
App.pzTypingIn = function(id){ var a = document.activeElement, card = document.getElementById('pen-' + id); return !!(a && card && card.contains(a) && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT')); };
App.A.pzGenBtn = function(el){ App.pzGen(el.getAttribute('data-id'), false); };
/* banca: o Examinador julga pelo mesmo pedido que aparece na tela. A ficha do capítulo entra só como referência
   (resumo, tópicos e modos de falha); a missão prática, o entregável, o teach-back próprio do capítulo e as ferramentas ficam de fora */
App.PZ_BANCA = {
  pedido: 'Explique como se ensinasse alguém inteligente de fora da área — incluindo quando isso dá errado. Colar definição não passa.',
  crit: [['KNOW', 'explica com palavras suas, com um exemplo e os limites', 'expliquei sem consultar, com exemplo e limites'],
    ['DECIDE', 'mostra pelo menos uma escolha ou troca (o que se ganha e o que se perde)', 'mostrei uma escolha ou troca e justifiquei'],
    ['FAIL', 'conta como dá errado, como perceber e como corrigir', 'contei como dá errado, como percebo e como corrijo'],
    ['TEACH', 'um leigo inteligente entenderia, sem jargão solto', 'um leigo inteligente entenderia']]
};
App.pzBancaPrompt = function(n, txt){
  var w = App.way(n.way), arc = E.arcOf(n), t = (App.chapNode ? App.chapNode(n) : n).t;
  var ctx = '=== BANCA DA ZONA DE PENALIDADE ===\nO pedido mostrado ao jogador foi exatamente: "' + App.PZ_BANCA.pedido + '"\n'
    + 'É um resumo geral do capítulo para um leigo inteligente, escrito sem consulta. Não é a entrega da quest do capítulo: não cobre a missão prática, o entregável, o cliente ou a persona da missão, ferramentas, técnicas nem nomes de autores, e não exija passar por todos os tópicos. '
    + 'Termos da área valem quando o próprio texto os explica. Analogias e exemplos do dia a dia contam a favor. Erro de digitação só pesa se atrapalhar o entendimento.\n'
    + 'Julgue só o que foi pedido: ' + App.PZ_BANCA.crit.map(function(c){ return c[0] + ' (' + c[1] + ')'; }).join('; ') + '. DECIDE pode aparecer dentro de um exemplo.\n\n'
    + 'CAMINHO: ' + w.name + '\nARCO: ' + arc.n + '\nCAPÍTULO: ' + n.id + ' — ' + t + '\nRESUMO: ' + n.s
    + '\nTÓPICOS DO CAPÍTULO (referência para conferir se o que ele diz está certo, não lista de presença): ' + (n.st || []).join('; ')
    + '\nCOMO O TEMA DÁ ERRADO NA PRÁTICA (referência): ' + (n.f || '');
  return App.examGradePrompt({text: ctx}, {mode: 'teach', text: txt});
};
App.A.pzGrade = function(el){
  var id = el.getAttribute('data-id'), p = App.pzPen(id); if (!p || p.st !== 'open' || !App.pzAI() || App.ui.pzBusy[id]) return;
  var txt = ((p.dr || {}).t || '').trim(), min = p.k === 'banca' ? 400 : 600, pass = p.k === 'banca' ? 70 : 65, prompt;
  if (txt.length < min) { App.ui.pzErr[id] = 'Mínimo de ' + min + ' caracteres. Faltam ' + (min - txt.length) + '.'; App.renderView(); return; }
  prompt = p.k === 'banca' ? App.pzBancaPrompt(E.NODE[p.body.node], txt) : App.pzPromptGrade(p, txt);
  App.ui.pzBusy[id] = 'grade'; delete App.ui.pzErr[id]; delete App.ui.pzRes[id]; App.renderView();
  App.sample.json(prompt, {cache:false}).then(function(raw){
    var q = App.pzPen(id); if (!q || q.st !== 'open') return;
    var nota, resumo, faltou;
    if (q.k === 'banca') { var r = App.examClean(raw); if (!r) throw {code:'invalid_json'}; nota = r.nota; resumo = r.resumo; faltou = r.lacunas.slice(0, 3); App.S.exams.total = (App.S.exams.total || 0) + 1; App.S.exams.best = Math.max(App.S.exams.best || 0, nota); }
    else { if (!raw || typeof raw !== 'object') throw {code:'invalid_json'}; nota = Math.round(U.clamp(+raw.nota || 0, 0, 100)); resumo = String(raw.resumo || '').slice(0, 400); faltou = (Array.isArray(raw.faltou) ? raw.faltou : []).map(function(x){ return String(x).slice(0, 220); }).slice(0, 3); }
    App.ui.pzRes[id] = {nota:nota, resumo:resumo, faltou:faltou, pass:nota >= pass};
    if (nota >= pass) { E.pzPayState(App.S, q, {nota:nota, text:txt.slice(0, 500), ai:1}, App.pzClock().day); App.pzPaidToast(q); }
    App.commit(['core'], {norender:true});
  }).catch(function(e){ var st = {}; App.examFail(st, e); App.ui.pzErr[id] = st.err || 'Falha temporária do Examinador. Tente de novo.'; })
    .then(function(){ delete App.ui.pzBusy[id]; if (!App.typing()) App.render(); });
};

/* ---------- ajustes do protocolo ---------- */
App.pzSettings = function(){
  var z = App.pz(), c = App.pzClock(), DN = ['dom','seg','ter','qua','qui','sex','sáb'], on = SYS.PZ.KINDS.filter(function(k){ return z.off[k.id] !== true; }).length;
  var time = function(k, label){ return '<label class="fld">' + label + '<input type="time" data-c="pzTime" data-k="' + k + '" value="' + U.esc(z[k]) + '"></label>'; };
  return '<section class="win" id="pzset"><div class="win-h">' + U.icon('shield') + 'Protocolo</div><div class="stack" style="gap:14px">'
    + '<label class="check"><input type="checkbox" data-c="pzOn"' + (z.on ? ' checked' : '') + '><span><b>Protocolo armado</b><br><span class="dim" style="font-size:13.5px">Chamado, veredito e Zona de Penalidade. Desligado, nada disso roda e nenhum dia é julgado.</span></span></label>'
    + '<div class="grid g3" style="gap:8px">' + time('ini', 'Portão abre') + time('fim', 'Portão fecha') + time('ver', 'Veredito') + '</div>'
    + '<div class="stack" style="gap:6px"><span class="eyebrow">Dias armados</span><div class="daychips">' + [1,2,3,4,5,6,0].map(function(d){ return '<button class="' + (z.dias.indexOf(d) >= 0 ? 'on' : '') + '" data-a="pzDay" data-d="' + d + '" aria-pressed="' + (z.dias.indexOf(d) >= 0) + '">' + DN[d] + '</button>'; }).join('') + '</div></div>'
    + '<div class="stack" style="gap:6px"><span class="eyebrow">Mínimo de ações reais por janela</span><div class="seg" role="group">' + [1,2,3,5].map(function(n){ return '<button class="' + ((+z.min || 1) === n ? 'on' : '') + '" data-a="pzMinSet" data-v="' + n + '">' + n + '</button>'; }).join('') + '</div><span class="faint" style="font-size:12.5px">Rank da janela: ' + SYS.PZ.RANKS.slice().reverse().map(function(r){ return r[1] + ' ' + r[0] + '+'; }).join(' · ') + '.</span></div>'
    + '<label class="check"><input type="checkbox" data-c="pzTol"' + (z.tol ? ' checked' : '') + '><span><b>Tolerância de atraso</b><br><span class="dim" style="font-size:13.5px">Com isso ligado, uma ação real entre o fechamento do portão e o veredito conta como atraso: sem prenda, sem bônus, e a sequência não anda. Desligado, portão fechado vazio é falta.</span></span></label>'
    + '<div class="stack" style="gap:6px"><span class="eyebrow">Pausa para viagem ou doença</span><div class="row" style="gap:8px"><label class="fld" style="flex:1;min-width:170px">Suspender chamados até<input type="date" data-c="pzPause" min="' + c.day + '" max="' + U.addDays(c.day, 45) + '" value="' + U.esc(z.pause && z.pause >= c.day ? z.pause : '') + '"></label>' + (z.pause && z.pause >= c.day ? '<button class="btn sm ghost" data-a="pzPauseClear" style="align-self:flex-end">Cancelar pausa</button>' : '') + '</div>'
    + '<span class="faint" style="font-size:12.5px">Tréguas restantes neste mês: ' + App.pzTruceLeft() + ' de ' + SYS.PZ.TRUCES + '. Dia de descanso declarado antes de o portão abrir também desarma a janela.</span></div>'
    + '<div class="stack" style="gap:2px"><span class="eyebrow">Prendas na roleta (' + on + ' de ' + SYS.PZ.KINDS.length + ')</span>'
    + SYS.PZ.KINDS.map(function(k){ return '<label class="check"><input type="checkbox" data-c="pzKindTgl" data-k="' + k.id + '"' + (z.off[k.id] !== true ? ' checked' : '') + '><span><b>' + U.esc(k.n) + '</b> <span class="dim" style="font-size:13.5px">— ' + U.esc(k.d) + '</span></span></label>'; }).join('') + '</div>'
    + '<div class="stack" style="gap:6px"><span class="eyebrow">Ver como fica</span><div class="row" style="gap:8px"><button class="btn sm" data-a="pzDemo" data-k="call">O chamado</button><button class="btn sm" data-a="pzDemo" data-k="miss">A bronca e a roleta</button><button class="btn sm" data-a="pzDemo" data-k="ok">O veredito cumprido</button></div><span class="faint" style="font-size:12.5px">Prévia: não registra nada e não sorteia prenda de verdade.</span></div>'
    + '</div></section>';
};
App.C.pzOn = function(el){
  var z = App.pz(), c = App.pzClock(); z.on = el.checked;
  if (z.on) { z.since = ''; App.pzArm(); z.last = ''; z.show = null; z.intro = 1; }
  App.commit(['core']); App.pzSync();
  App.toast(z.on ? {t:'Protocolo armado', s:'Primeira janela valendo: ' + (z.since === c.day ? 'hoje' : App.pzDate(z.since)) + ' às ' + z.ini + '.', ic:'lock'} : {t:'Protocolo desligado', s:'Sem chamado, sem veredito. Prendas abertas continuam abertas.', ic:'moon'});
};
App.C.pzTime = function(el){
  var z = App.pz(), k = el.getAttribute('data-k'), v = el.value, P = App.pzPhase();
  if (!/^\d{2}:\d{2}$/.test(v)) { App.renderView(); return; }
  if (P.armed && !P.v && (P.ph === 'janela' || P.ph === 'limbo')) { App.toast({t:'Horário travado', s:'Não dá para mexer no relógio com o portão aberto ou o veredito pendente. Mude antes das ' + z.ini + ' ou depois do veredito.', ic:'lock', ms:7000}); App.renderView(); return; }
  var t = {ini:z.ini, fim:z.fim, ver:z.ver}; t[k] = v;
  var a = E.pzMin(t.ini), b = E.pzMin(t.fim), c2 = E.pzMin(t.ver), r = U.resetHour() * 60;
  if (!(a > r && b - a >= 15 && c2 >= b && c2 <= 1439)) { App.toast({t:'Horário inválido', s:'A ordem é abre → fecha → veredito, com pelo menos 15 minutos de janela, tudo depois do reset do dia (' + String(U.resetHour()).padStart(2, '0') + ':00).', ic:'alert', ms:7000}); App.renderView(); return; }
  App.pzSetting(function(){ z[k] = v; });
  App.toast({t:'Horário atualizado', s:'Se a abertura automática já está instalada no notebook, gere o instalador de novo para os horários baterem.', ic:'clock', ms:7000});
};
App.A.pzDay = function(el){ var z = App.pz(), d = +el.getAttribute('data-d'), i = z.dias.indexOf(d); if (i >= 0 && z.dias.length <= 1) return; App.pzSetting(function(){ if (i >= 0) z.dias.splice(i, 1); else z.dias.push(d); }); };
App.A.pzMinSet = function(el){ App.pz().min = +el.getAttribute('data-v') || 1; App.commit(['core']); App.pzSync(); };
App.C.pzTol = function(el){ App.pz().tol = el.checked; App.commit(['core']); };
App.C.pzPause = function(el){
  var z = App.pz(), c = App.pzClock(), v = el.value;
  if (!v || v < c.day || v > U.addDays(c.day, 45)) { App.renderView(); return; }
  App.pzSetting(function(){ z.pause = v; });
  App.toast({t:'Chamados suspensos', s:'Até ' + App.pzDate(v) + '. Dias já julgados não mudam.', ic:'moon'});
};
App.A.pzPauseClear = function(){ App.pzSetting(function(){ App.pz().pause = ''; }); if ((App.pzPhase().rec || {}).g) App.toast({t:'Pausa cancelada', s:'O portão de hoje já tinha aberto: hoje não vale. A primeira janela é a próxima.', ic:'moon', ms:8000}); };
App.C.pzKindTgl = function(el){
  var z = App.pz(), k = el.getAttribute('data-k');
  if (!el.checked && SYS.PZ.KINDS.filter(function(x){ return z.off[x.id] !== true; }).length <= 3) { App.toast({t:'Mínimo de três prendas', s:'Roleta com uma opção só não é roleta.', ic:'alert'}); App.renderView(); return; }
  if (el.checked) delete z.off[k]; else z.off[k] = true;
  App.commit(['core']);
};

/* ---------- abertura automática no notebook ---------- */
App.pzAutoCard = function(){
  var z = App.pz();
  return '<section class="win"><div class="win-h">' + U.icon('download') + 'Abrir sozinho no notebook (Windows)</div><div class="stack" style="gap:10px">'
    + '<p class="dim" style="font-size:14px">Uma página não consegue se abrir sozinha: quem faz isso é o Agendador de Tarefas do Windows. Com o instalador, o Sistema abre:</p>'
    + '<ul class="list"><li><span>às <b>' + U.esc(z.ini) + '</b>, com o chamado (ou quando você desbloquear o notebook dentro da janela);</span></li>'
    + '<li><span>às <b>' + U.esc(z.ver) + '</b>, com o veredito;</span></li>'
    + '<li><span>se o notebook estava fechado no veredito, <b>assim que você desbloquear a tela</b> — mesmo na manhã seguinte.</span></li>'
    + '<li><span>Notebook ligado, mas com a tela bloqueada na hora? A janela abre por trás do bloqueio e está lá quando você voltar.</span></li></ul>'
    + '<p class="dim" style="font-size:14px">No máximo uma abertura por chamado e uma por veredito, por dia. Quem decide entre “cumprido” e bronca é o Sistema, na hora em que abre.</p>'
    + '<div class="row"><button class="btn primary" data-a="pzInstall">' + U.icon('download') + 'Gerar instalador</button></div>'
    + '<p class="faint" style="font-size:12.5px">O instalador cria uma tarefa agendada no seu usuário e a pasta %LOCALAPPDATA%\\SystemAscension, com um script pequeno que só confere a hora e abre esta página. Não pede administrador, não acessa a rede e tem opção de remover tudo.</p></div></section>';
};
App.pzScriptNow = function(){ var z = App.pz(); return SYS.pzScript({ini:z.ini, fim:z.fim, ver:z.ver}); };
App.A.pzInstall = function(){ App.ui.modal = {type:'pzInstall'}; App.renderModal(); };
App.M.pzInstall = function(){
  return '<section class="win wide"><div class="win-h">' + U.icon('download') + 'Instalador · abertura automática<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack" style="gap:10px">'
    + '<ol style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;font-size:14.5px"><li>Abra o <b>PowerShell</b> pelo menu Iniciar (não precisa ser como administrador).</li><li>Clique em <b>Copiar</b>, aqui embaixo.</li><li>No PowerShell, digite <code class="pzcmd">iex (Get-Clipboard -Raw)</code> e aperte Enter. <span class="dim">Colar o texto inteiro direto na janela também funciona, mas no PowerShell antigo do Windows um texto deste tamanho às vezes se embaralha.</span></li><li>Escolha <b>1</b> para chamado e veredito, ou <b>2</b> para só o veredito.</li><li>Responda se quer janela própria e som, e aceite o teste no final: o Sistema tem que abrir sozinho.</li></ol>'
    + '<textarea class="pzcode" readonly spellcheck="false" wrap="off">' + U.esc(App.pzScriptNow()) + '</textarea>'
    + '<div class="row" style="justify-content:flex-end;gap:8px">' + (App.downloads && App.downloads.save ? '<button class="btn" data-a="pzInstallTxt">' + U.icon('download') + 'Baixar como .txt</button>' : '') + '<button class="btn primary" data-a="pzInstallCopy">' + U.icon('check') + 'Copiar</button></div>'
    + '<p class="faint" style="font-size:12.5px">Dá para ler antes de rodar: são cerca de 360 linhas comentadas. Mudou os horários aqui? Gere e rode de novo. A opção 4 mostra se a tarefa está rodando; a opção 5 remove tudo.</p></div></section>';
};
App.A.pzInstallCopy = function(){
  var ta = App.$('modal').querySelector('textarea'); if (!ta) return; ta.focus(); ta.select();
  var done = function(ok){ App.toast({t:ok ? 'Instalador copiado' : 'Selecione e copie', s:ok ? 'No PowerShell: iex (Get-Clipboard -Raw) e Enter.' : 'O texto está selecionado: use copiar.', ic:'check'}); };
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(App.pzScriptNow()).then(function(){ done(true); }, function(){ var ok = false; try { ok = document.execCommand('copy'); } catch (e) {} done(ok); }); return; } done(document.execCommand('copy')); } catch (e) { done(false); }
};
App.A.pzInstallTxt = function(){
  if (!App.downloads || !App.downloads.save) return;
  App.downloads.save({filename:'system-ascension-instalador.txt', data:App.pzScriptNow()}).then(function(){ App.toast({t:'Instalador salvo', s:'Abra o arquivo, copie tudo (Ctrl+A, Ctrl+C) e rode iex (Get-Clipboard -Raw) no PowerShell — ou renomeie para .ps1 e use “Executar com o PowerShell”.', ic:'download', ms:8000}); }).catch(function(e){ var c = e && e.code; if (c === 'declined') return; App.toast({t:'Não deu para baixar', s:'Use o botão Copiar.', ic:'alert'}); });
};

/* ---------- a tela ---------- */
App.V.zona = function(){
  var S = App.S, z = App.pz(), c = App.pzClock(), T = z.tot, open = E.pzOpen(S);
  var h = H.head('Protocolo do ' + SYS.PZ.NAME, 'Zona de Penalidade', 'Todo dia armado tem uma janela. Uma ação real dentro dela cumpre o dia. Janela vazia vira falta, e falta sorteia prenda.');
  if (!S._u) return h + '<section class="win"><div class="empty">O protocolo arma depois da sua primeira ação no Sistema.</div></section>';
  if (!z.on) return h + '<section class="win"><div class="callout">Protocolo desligado. Sem chamado, sem veredito, sem prenda nova.' + (open.length ? ' As ' + open.length + ' prendas abertas continuam valendo.' : '') + '</div></section>' + (open.length ? '<div class="stack" style="gap:12px">' + open.map(App.pzCard).join('') + '</div>' : '') + App.pzSettings();
  h += App.pzToday();
  h += '<div class="kpis">' + [[z.seq || 0, 'janelas seguidas'], [z.best || 0, 'melhor sequência'], [T.ok || 0, 'janelas cumpridas'], [T.miss || 0, 'faltas'], [T.paid || 0, 'prendas quitadas'], [App.pzTruceLeft(), 'tréguas no mês']].map(function(k){ return '<div class="kpi"><b>' + U.num(k[0]) + '</b><span>' + k[1] + '</span></div>'; }).join('') + '</div>';
  h += '<section class="win" style="--wc:var(--bad)"><div class="win-h" style="color:' + (open.length ? 'var(--bad)' : 'var(--ok)') + '">' + U.icon('lock') + 'Prendas abertas · ' + open.length + ' de ' + SYS.PZ.MAXOPEN + (open.length ? '<span class="act" style="cursor:default">loja selada</span>' : '') + '</div>'
    + (open.length ? '<div class="stack" style="gap:12px">' + open.map(App.pzCard).join('') + '</div>' : '<div class="empty">Zona vazia. Nenhuma prenda aberta — a loja está liberada e o ' + SYS.PZ.NAME + ' não tem assunto com você.</div>') + '</section>';
  var cells = '';
  for (var i = 27; i >= 0; i--) {
    var d = U.addDays(c.day, -i), r = z.log[d] || {}, v = r.v || '', lbl = {ok:'cumprida', miss:'falta', late:'atraso', rest:r.tr ? 'trégua' : r.g ? 'armado depois do portão' : 'descanso'}[v] || (E.pzArmed(S, d) ? (d === c.day ? 'hoje' : 'sem registro') : 'desarmado');
    cells += '<span class="pzd ' + v + (d === c.day ? ' today' : '') + '" data-tip="' + App.pzDate(d) + ' · ' + lbl + (r.a ? ' · ' + r.a + ' ações · rank ' + E.pzRank(r.a) : '') + '">' + U.parse(d).getDate() + '</span>';
  }
  h += '<section class="win"><div class="win-h">' + U.icon('status') + 'Últimos 28 dias</div><div class="pzdays">' + cells + '</div>'
    + '<div class="row" style="gap:12px;margin-top:10px;font-size:12.5px;color:var(--dim)"><span class="row" style="gap:5px"><span class="pzd ok" style="width:13px"></span>cumprida</span><span class="row" style="gap:5px"><span class="pzd miss" style="width:13px"></span>falta</span><span class="row" style="gap:5px"><span class="pzd late" style="width:13px"></span>atraso</span><span class="row" style="gap:5px"><span class="pzd rest" style="width:13px"></span>descanso ou trégua</span></div></section>';
  var past = z.pens.filter(function(p){ return p.st !== 'open'; }).slice(-8).reverse();
  if (past.length) h += '<section class="win"><div class="win-h">' + U.icon('scroll') + 'Prendas encerradas</div>' + past.map(function(p){ var k = E.pzKind(p.k) || {n:p.k, ic:'alert'}, ok = p.st === 'paid';
    return '<div class="notif"><span class="' + (ok ? 'ok' : 'bad') + '">' + U.icon(ok ? 'check' : 'alert') + '</span><span>' + U.esc(k.n) + ' <span class="dim">· ' + (ok ? (p.ev && p.ev.auto ? 'cumprida pelo Sistema' : 'quitada' + (p.over ? ' fora do prazo' : '') + (p.ev && p.ev.nota ? ' · nota ' + p.ev.nota : '')) : 'virou multa') + '</span></span><span class="faint mono" style="font-size:11px">' + U.fmtDate(p.paid || p.at) + '</span></div>'; }).join('') + '</section>';
  return h + '<div class="grid g2" style="align-items:start">' + App.pzSettings() + App.pzAutoCard() + '</div>';
};

/* ---------- regras, status e marcos ---------- */
(function(){
  var oldRules = App.V.regras;
  App.V.regras = function(){
    var z = App.pz();
    return oldRules() + '<section class="win"><div class="win-h">' + U.icon('lock') + 'O Chamado, o Veredito e a Zona de Penalidade</div><ul class="list">'
      + ['Todo dia armado tem uma janela (hoje ' + z.ini + '–' + z.fim + '). Uma ação real dentro dela cumpre o dia: tópico estudado, capítulo avançado, diária fechada, revisão registrada, prenda quitada. Abrir a página e olhar não conta; desmarcar e marcar de novo também não.',
         'Janela cumprida rende +' + SYS.PZ.REW + ' ◆ e soma na sequência de janelas, com bônus em 3, 7, 14, 30, 60 e 100. O rank da janela (D a S) vem do número de ações.',
         'Às ' + z.ver + ' sai o veredito. Janela vazia é falta: a sequência zera e uma prenda é sorteada — noite sem jogo, lista de exercícios, briefing de cenário, interrogatório, autópsia da falha, marcha, leitura ou janela dobrada.',
         'Prenda aberta sela as lojas dos Caminhos. São no máximo ' + SYS.PZ.MAXOPEN + ' abertas: com a Zona cheia, a falta é cobrada em cristal. Prenda vencida vira multa e continua valendo.',
         'Trabalho feito antes de o portão abrir fica registrado, mas a janela pede uma ação dentro do horário. A exceção: todas as diárias fechadas antes do portão cumprem a janela por antecipação. Dia de descanso só desarma se for declarado antes de o portão abrir.',
         'Válvulas: ' + SYS.PZ.TRUCES + ' tréguas por mês (valem para o dia de hoje, até você aceitar a sentença), tolerância de atraso opcional, e pausa de até 45 dias para viagem ou doença. Cancelar a pausa, armar um dia ou puxar o horário com o portão de hoje já aberto não arma o dia de hoje: a primeira janela é a próxima.',
         'O Sistema não vigia o seu computador. Noite Selada e Marcha são palavra sua. Honestidade continua sendo stat.',
         'Sumir vários dias rende no máximo duas prendas; o resto vira multa pequena. A ideia é ter como voltar, não enterrar você.',
         'Com mais de um aparelho, vale o que está na nuvem: o veredito só sai depois de conferir o save. Janela cumprida no celular não vira bronca no notebook.'].map(function(x){ return '<li><span>' + U.esc(x) + '</span></li>'; }).join('')
      + '</ul></section>';
  };
  var oldStatus = App.V.status;
  App.V.status = function(){
    var html = oldStatus(), S = App.S; if (!S._u) return html;
    var open = E.pzOpen(S); if (!open.length) return html;
    return '<section class="win emerg"><div class="win-h" style="color:var(--bad)">' + U.icon('lock') + 'Zona de Penalidade</div><div class="row between"><div class="stack" style="gap:4px"><h3>' + open.length + (open.length === 1 ? ' prenda aberta' : ' prendas abertas') + '</h3><p class="dim">' + open.map(function(p){ return (E.pzKind(p.k) || {n:p.k}).n; }).join(' · ') + '. Loja selada até quitar.</p></div><a class="btn danger" href="#/zona">' + U.icon('lock') + 'Ir para a Zona</a></div></section>' + html;
  };
  /* o reset do dia não pode passar por cima da janela do protocolo */
  var oldReset = App.C.pReset;
  if (oldReset) App.C.pReset = function(el){
    var z = App.pz(), h = +el.value;
    if (z.on && !isNaN(h) && h * 60 >= E.pzMin(z.ini)) { App.toast({t:'Reset depois do portão', s:'O portão do protocolo abre às ' + z.ini + '. O dia do Sistema precisa virar antes disso: mude a janela na Zona primeiro.', ic:'alert', ms:8000}); App.renderView(); return; }
    var r = oldReset(el); App.pzBase(); App.pzSoon(); return r;
  };
  if (App.NEXTMS) App.NEXTMS.push(['Janelas cumpridas', 'pzOk', [1,7,30,100], 'clock'], ['Melhor sequência de janelas', 'pzBest', [3,7,14,30], 'flame']);
})();
