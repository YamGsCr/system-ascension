/* ===== v13 · O CHAMADO · telas: chamado, veredito, bronca, Zona, HUD e ajustes ===== */
App.PZV = {};
App.ui.pzBusy = {}; App.ui.pzErr = {}; App.ui.pzRes = {};

/* ---------- tela cheia: ciclo de vida ---------- */
App.pzRoot = function(){ var el = App.$('pzroot'); if (!el) { el = document.createElement('div'); el.id = 'pzroot'; document.body.appendChild(el); } return el; };
App.pzShow = function(k, opt){ var o = opt || {}; o.k = k; o.step = o.step || 0; App.ui.pz = o; App._pzDefer = false; App.pzRender(true); };
App.pzHide = function(){ App.ui.pz = null; clearInterval(App._pzType); clearTimeout(App._pzSpin); var el = App.$('pzroot'); if (el) el.innerHTML = ''; };
App.pzMotion = function(){ return !!App.S.settings.motion && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
App.pzMMSS = function(sec){ sec = Math.max(0, Math.floor(sec)); var m = Math.floor(sec / 60), s = sec % 60; return (m >= 60 ? Math.floor(m / 60) + ':' + String(m % 60).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(s).padStart(2, '0'); };
App.pzType = function(el, full, done){
  clearInterval(App._pzType); if (!el) { if (done) done(); return; }
  if (!App.pzMotion()) { el.textContent = full; if (done) done(); return; }
  var i = 0; el.innerHTML = '<span class="cur"></span>';
  App._pzType = setInterval(function(){
    i++;
    if (i >= full.length) { clearInterval(App._pzType); el.textContent = full; if (done) done(); return; }
    el.innerHTML = U.esc(full.slice(0, i)) + '<span class="cur"></span>';
  }, 22);
};
App.pzRender = function(fresh){
  var u = App.ui.pz, root = App.pzRoot();
  if (!u) { root.innerHTML = ''; return; }
  var fn = App.PZV[u.k], html = '';
  try { html = fn ? fn(u) : ''; } catch (e) { if (window.console) console.error(e); html = ''; }
  if (!html) { App.pzHide(); return; }
  /* mesma tela, conteúdo novo (passo da roleta, relógio, texto que chegou): troca só o painel,
     para a entrada não piscar de novo e a figura continuar o movimento de onde estava */
  var ov = root.querySelector('.pzov'), swapped = false;
  if (!fresh && ov && ov.getAttribute('data-k') === u.k) {
    var tmp = document.createElement('div'); tmp.innerHTML = html;
    var np = tmp.querySelector('.pzpan'), op = ov.querySelector('.pzpan');
    if (np && op) { op.innerHTML = np.innerHTML; swapped = true; }
  }
  if (!swapped) root.innerHTML = '<div class="pzov k-' + u.k + (fresh ? '' : ' still') + '" data-k="' + u.k + '" role="dialog" aria-modal="true" aria-label="' + SYS.PZ.NAME + '">' + html + '</div>';
  var line = root.querySelector('.pzline[data-t]'), later = root.querySelectorAll('[data-after]');
  function reveal(){ for (var i = 0; i < later.length; i++) later[i].style.visibility = 'visible'; }
  if (line) { if (fresh) { for (var i = 0; i < later.length; i++) later[i].style.visibility = 'hidden'; App.pzType(line, line.getAttribute('data-t'), reveal); } else { line.textContent = line.getAttribute('data-t'); } }
  if (fresh) { var b = root.querySelector('.btn.primary'); if (b) try { b.focus({preventScroll:true}); } catch (e) {} }
};
App.pzBox = function(mode, prog, inner, extra){
  return '<div class="pzbox"><div class="pzfigw">' + U.algoz(mode, {w:300, prog:prog}) + '</div><div class="pzpan">' + inner + (extra || '') + '</div></div>';
};
App.pzTag = function(t){ return '<div class="pztag">' + U.icon('alert') + U.esc(t) + '</div>'; };
App.pzChip = function(t, cls){ return '<span class="chip' + (cls ? ' ' + cls : '') + '">' + t + '</span>'; };
App.pzDate = function(d){ var x = U.parse(d); return x.toLocaleDateString('pt-BR', {weekday:'short', day:'2-digit', month:'short'}).replace(/\.$/, ''); };

/* ---------- CHAMADO ---------- */
App.PZV.call = function(u){
  var S = App.S, z = App.pz(), P = App.pzPhase(), left = u.demo ? 52 * 60 + 10 : P.left, prog = u.demo ? 0.74 : (P.dur ? U.clamp(P.left / (P.dur * 60), 0, 1) : 0);
  var line = u.line || (u.line = u.demo ? App.pzLine('call') : App.pzCallLine());
  var main = E.mainWay(S), n = E.nextNode(S, main), w = App.way(main), open = E.pzOpen(S).length;
  return App.pzBox('call', prog,
    App.pzTag('Chamado do Sistema · ' + SYS.PZ.NAME)
    + '<p class="pzline" data-t="' + U.esc(line) + '"></p>'
    + '<div class="pzclock"><b id="pzclk">' + App.pzMMSS(left) + '</b><span>até o portão fechar<br>' + U.esc(z.ini) + ' — ' + U.esc(z.fim) + '</span></div>'
    + '<div class="pzbar"><i id="pzbar" style="width:' + (prog * 100).toFixed(1) + '%"></i></div>'
    + '<div class="pzfacts">' + App.pzChip('ações na janela: ' + P.a + '/' + P.need) + App.pzChip('sequência: ' + (z.seq || 0)) + (open ? App.pzChip('prendas abertas: ' + open, 'bad') : '') + App.pzChip('veredito às ' + U.esc(z.ver)) + '</div>'
    + (n ? '<div class="stack" style="gap:6px" data-after="1"><span class="eyebrow" style="color:var(--pzc)">Missão mais próxima · ' + U.esc(w.pt) + '</span>' + H.nodeRow(n).replace('data-a="openNode"', 'data-a="pzEnter"') + '</div>' : '')
    + '<div class="pzacts" data-after="1"><button class="btn primary" data-a="pzEnter"' + (n ? ' data-id="' + n.id + '"' : '') + '>' + U.icon('sword') + 'Entrar no portão</button>'
    + '<button class="btn" data-a="pzGo" data-r="status">Ver as diárias</button>'
    + (!u.demo && !P.v && App.pzCanTruce() ? '<button class="btn ghost" data-a="pzTruce">Hoje não dá · trégua (' + App.pzTruceLeft() + ')</button>' : '')
    + (u.demo ? '<button class="btn ghost" data-a="pzClose">Fechar prévia</button>' : '') + '</div>'
    + '<p class="faint" style="font-size:12.5px" data-after="1">Qualquer ação real conta: marcar um tópico estudado, avançar um capítulo, fechar uma diária, registrar uma revisão.</p>');
};

/* ---------- VEREDITO: CUMPRIDO / ATRASO ---------- */
App.PZV.ok = function(u){
  var z = App.pz(), P = App.pzPhase(), rec = u.demo ? {a:4, v:'ok'} : P.rec, late = u.k === 'late', a = rec.a || 0;
  var line = u.line || (u.line = App.pzLine(late ? 'late' : rec.early ? 'early' : 'ok', null, u.demo ? null : 'v' + P.day));
  var bonus = SYS.PZ.SEQREW[z.seq] || 0;
  return App.pzBox(late ? 'late' : 'ok', 1,
    App.pzTag('Veredito · ' + (late ? 'atraso' : rec.early ? 'cumprido antes da hora' : 'janela cumprida'))
    + '<p class="pzline" data-t="' + U.esc(line) + '"></p>'
    + '<div class="pzfacts">' + (rec.early ? App.pzChip('diárias fechadas antes das ' + U.esc(z.ini), 'ok') : App.pzChip('ações na janela: ' + a))
    + (late ? App.pzChip('sem prenda, sem bônus', 'warn') : App.pzChip('rank da janela: ' + (rec.early && !a ? 'antecipado' : E.pzRank(a)), 'ok') + App.pzChip('+' + SYS.PZ.REW + ' ◆' + (bonus ? ' · bônus de sequência +' + bonus + ' ◆' : ''), 'glow'))
    + App.pzChip('sequência de janelas: ' + (z.seq || 0)) + App.pzChip('melhor: ' + (z.best || 0)) + '</div>'
    + '<p class="pzsub" data-after="1">' + (late ? 'Você apareceu depois de o portão fechar. A Zona fica fechada hoje, mas a sequência não anda.' : 'Próxima janela: <b>' + U.esc(z.ini) + '</b>. O ' + SYS.PZ.NAME + ' volta no mesmo minuto.') + '</p>'
    + '<div class="pzacts" data-after="1"><button class="btn primary" data-a="pzClose">' + U.icon('check') + 'Fechar</button><button class="btn ghost" data-a="pzGo" data-r="zona">Ver a Zona</button></div>');
};
App.PZV.late = App.PZV.ok;

/* ---------- VEREDITO: FALTA → ROLETA → SENTENÇA ---------- */
App.pzPensOf = function(u){ if (u.fake) return u.fake; var z = App.pz(), ids = (u.sh && u.sh.pens) || []; return z.pens.filter(function(p){ return ids.indexOf(p.id) >= 0; }); };
App.PZV.miss = function(u){
  var z = App.pz(), sh = u.sh || (u.sh = z.show); if (!sh) return '';
  var pens = App.pzPensOf(u), inner;
  if (u.step === 0) {
    var line = u.line || (u.line = App.pzMissLine(sh));
    var days = sh.n > 1 ? sh.n + ' janelas vazias: ' + sh.days.slice(-6).map(App.pzDate).join(', ') + (sh.days.length > 6 ? '…' : '') : 'Janela de ' + U.esc(z.ini) + ' a ' + U.esc(z.fim) + ' · ' + App.pzDate(sh.days[sh.days.length - 1]) + ' · nenhuma ação registrada';
    inner = App.pzTag('Veredito · janela em branco')
      + '<p class="pzline" data-t="' + U.esc(line) + '"></p>'
      + '<p class="pzsub">' + days + '.</p>'
      + '<div class="pzfacts">' + (sh.lost ? App.pzChip('sequência perdida: ' + sh.lost, 'bad') : '') + (sh.fine ? App.pzChip('multa: −' + sh.fine + ' ◆', 'bad') : '') + App.pzChip('prendas abertas agora: ' + (u.demo ? 1 : E.pzOpen(App.S).length), 'bad') + '</div>'
      + '<div class="pzacts" data-after="1">' + (pens.length ? '<button class="btn primary" data-a="pzSpin">' + U.icon('lock') + 'Entrar na Zona · receber a prenda</button>' : '<button class="btn primary" data-a="pzClose">Entendido</button>')
      + (!u.demo && App.pzCanUndo() ? '<button class="btn ghost" data-a="pzTruce">Usar trégua (' + App.pzTruceLeft() + ' neste mês)</button>' : '')
      + (u.demo ? '<button class="btn ghost" data-a="pzClose">Fechar prévia</button>' : '') + '</div>'
      + (sh.full ? '<p class="faint" style="font-size:12.5px" data-after="1">A Zona já tem ' + SYS.PZ.MAXOPEN + ' prendas abertas: nenhuma nova entra enquanto você não quitar. Esta falta foi cobrada em cristal.</p>' : '');
  } else if (u.step === 1) {
    var off = z.off || {}, kinds = SYS.PZ.KINDS.filter(function(k){ return off[k.id] !== true || pens.some(function(p){ return p.k === k.id; }); });
    inner = App.pzTag('Zona de Penalidade · sorteio')
      + '<p class="pzline" style="min-height:0">A prenda é sorteada. O prazo, não.</p>'
      + '<div class="pzwheel">' + kinds.map(function(k){ return '<span data-k="' + k.id + '">' + U.icon(k.ic) + U.esc(k.n) + '</span>'; }).join('') + '</div>'
      + '<p class="faint mono" style="font-size:12px">sorteando…</p>';
  } else {
    inner = App.pzTag('Sentença · ' + (pens.length > 1 ? pens.length + ' prendas' : 'prenda sorteada'))
      + pens.map(function(p){ var k = E.pzKind(p.k); return '<div class="pzsent"><div class="row between" style="gap:8px"><h3>' + U.icon(k.ic) + ' ' + U.esc(k.n) + '</h3>' + App.pzChip('prazo: ' + App.pzDue(p), 'warn') + '</div><p class="pzsub">' + U.esc(k.d) + '</p>' + App.pzBrief(p) + '</div>'; }).join('')
      + (pens.length > 1 ? '<p class="faint" style="font-size:12.5px">Ausência prolongada rende mais de uma prenda.</p>' : '')
      + '<p class="pzsub">Enquanto houver prenda aberta, <b>a loja fica selada</b>. Prenda vencida vira multa em cristal e continua valendo.</p>'
      + '<div class="pzacts"><button class="btn primary" data-a="pzAccept">' + U.icon('check') + (u.demo ? 'Fechar prévia' : 'Aceitar · ir para a Zona') + '</button></div>';
  }
  return App.pzBox('miss', 1, inner, u.step === 0 ? '<div class="pzsys" aria-hidden="true">' + U.mascot('panic', 62) + '</div>' : '');
};
App.pzDue = function(p){
  if (p.k === 'selo') return 'noite de ' + App.pzDate(p.body.night);
  if (p.k === 'dobro') return 'janela de ' + App.pzDate(p.body.day);
  return 'até ' + App.pzDate(p.due);
};
/* resumo curto do conteúdo da prenda (usado na sentença) */
App.pzBrief = function(p){
  var b = p.body || {};
  if (p.k === 'treino') return '<p class="pzsub"><b>' + U.esc(b.t) + '</b> · ' + b.rounds + ' voltas · cerca de ' + b.min + ' min<br>' + b.items.map(function(i){ return U.esc(i[0]) + ' <span class="mono">' + U.esc(i[1]) + '</span>'; }).join(' · ') + '</p>';
  if (p.k === 'briefing') return '<p class="pzsub"><b>' + U.esc(b.t) + '</b><br>' + U.esc(b.c) + '</p>';
  if (p.k === 'banca') { var n = E.NODE[b.node]; return '<p class="pzsub">Capítulo sorteado: <b>' + U.esc(n ? n.id + ' · ' + App.chapNode(n).t : '—') + '</b></p>'; }
  if (p.k === 'selo') return '<p class="pzsub">Noite selada: <b>' + App.pzDate(b.night) + '</b>. Nada de jogo nessa noite.</p>';
  if (p.k === 'dobro') return '<p class="pzsub">Na janela de <b>' + App.pzDate(b.day) + '</b> o mínimo de ações dobra.</p>';
  return '';
};
App.pzSpinRun = function(target, done){
  var cells = [].slice.call(document.querySelectorAll('#pzroot .pzwheel span')), n = cells.length;
  if (!n) return done();
  var ids = cells.map(function(c){ return c.getAttribute('data-k'); }), ti = Math.max(0, ids.indexOf(target));
  function mark(i, hit){ cells.forEach(function(c){ c.classList.remove('on'); }); cells[i].classList.add('on'); if (hit) cells[i].classList.add('hit'); }
  if (!App.pzMotion()) { mark(ti, true); App._pzSpin = setTimeout(done, 500); return; }
  var total = n * 3 + ti, i = 0;
  (function step(){
    mark(i % n, i >= total);
    if (i >= total) { App._pzSpin = setTimeout(done, 1300); return; }
    var left = total - i; i++;
    App._pzSpin = setTimeout(step, left > 10 ? 65 : left > 5 ? 130 : left > 2 ? 240 : 400);
  })();
};

/* ---------- APRESENTAÇÃO DO PROTOCOLO ---------- */
App.PZV.intro = function(u){
  var z = App.pz(), c = App.pzClock(), L = SYS.PZ.LINES.intro, hoje = z.since ? z.since <= c.day : c.min < E.pzMin(z.ini);
  return App.pzBox('intro', 1,
    App.pzTag('Novo protocolo · ' + SYS.PZ.NAME)
    + '<p class="pzline" data-t="' + U.esc(App.pzFill(L[0])) + '"></p>'
    + '<p class="pzsub" data-after="1">' + U.esc(App.pzFill(L[1])) + '<br>' + U.esc(App.pzFill(L[2])) + '</p>'
    + '<ul class="pzlist" data-after="1">'
    + '<li><span><b>Janela ' + U.esc(z.ini) + '–' + U.esc(z.fim) + '.</b> Uma ação real dentro dela cumpre o dia: tópico estudado, capítulo avançado, diária fechada, revisão registrada.</span></li>'
    + '<li><span><b>Veredito às ' + U.esc(z.ver) + '.</b> Janela vazia é falta. Falta sorteia prenda: noite sem jogo, lista de exercícios, briefing de cenário, interrogatório e outras.</span></li>'
    + '<li><span><b>Prenda aberta sela as lojas dos Caminhos.</b> Prenda vencida vira multa em cristal.</span></li>'
    + '<li><span><b>Válvulas:</b> ' + SYS.PZ.TRUCES + ' tréguas por mês, dia de descanso declarado antes de o portão abrir, e pausa para viagem nos ajustes.</span></li></ul>'
    + '<p class="faint" style="font-size:12.5px" data-after="1">Primeira janela valendo: <b style="color:var(--text)">' + (hoje ? 'hoje' : App.pzDate(z.since || U.addDays(c.day, 1))) + ' às ' + U.esc(z.ini) + '</b>.</p>'
    + '<div class="pzacts" data-after="1"><button class="btn primary" data-a="pzIntroOk">' + U.icon('lock') + 'Armar o protocolo</button><button class="btn" data-a="pzIntroOk" data-r="zona">Ajustar horários primeiro</button></div>');
};

/* ---------- o que mostrar agora ---------- */
App.pzBusy = function(){ return App.typing() || !!App.ui.drawer || !!App.ui.modal; };
App.pzMark = function(flag){
  var z = App.pz(), c = App.pzClock(), rec = z.log[c.day] || (z.log[c.day] = {});
  if (rec[flag]) return; rec[flag] = 1;
  Store.asAuto(function(){ App.commit(['core'], {norender:true}); });
};
App.pzPresent = function(){
  if (App.ui.pz || document.hidden || !App.S || !App.S._u) return;
  if (Store.waking || !Store.settled()) return;
  var z = App.pz(); if (!z.on) return;
  var P = App.pzPhase(), rec = P.rec;
  if (!z.intro) { if (App.pzBusy()) { App._pzDefer = true; return; } return App.pzShow('intro'); }
  if (z.show && z.show.t === 'miss') {
    if (App.typing() && (App._pzWait = (App._pzWait || 0) + 1) < 120) { App._pzDefer = true; return; }
    App._pzWait = 0; App.ui.drawer = null; App.ui.modal = null; App.renderDrawer(); App.renderModal();
    return App.pzShow('miss');
  }
  App._pzDefer = false;
  if (!P.armed) return;
  if (P.ph === 'pre' && !rec.v && !rec.b && z.introD !== P.day) { App.pzMark('b'); App.pzBriefing(); }
  if (P.ph === 'janela' && !rec.v && !rec.c) {
    if (P.left <= 900) App.pzMark('w');                    /* abriu já no fim: o próprio chamado é o último aviso */
    if (App.pzBusy()) { App.pzMark('c'); App.toast({t:'[' + SYS.PZ.NAME + '] O portão abriu', s:App.pzCallLine(), ic:'clock', ms:9000}); return; }
    return App.pzShow('call');
  }
  if (P.ph === 'janela' && !rec.v && rec.c && !rec.w && P.left <= 900) {
    /* último aviso: o chamado foi fechado e a janela continua vazia */
    App.pzMark('w');
    App.toast({t:'[' + SYS.PZ.NAME + '] Último aviso · ' + Math.max(1, Math.ceil(P.left / 60)) + ' min', s:App.pzLine('callLow', null, 'w' + P.day) + ' Ações na janela: ' + P.a + '/' + P.need + '.', ic:'alert', ms:14000});
    return;
  }
  if (P.ph === 'limbo' && !rec.v && !rec.c2) {
    App.pzMark('c2');
    App.toast({t:'[' + SYS.PZ.NAME + '] O portão fechou', s:z.tol ? 'Uma ação real até ' + z.ver + ' ainda conta como atraso e evita a Zona.' : 'Janela vazia. O veredito sai às ' + z.ver + '.', ic:'alert', ms:9000});
    return;
  }
  if ((rec.v === 'ok' || rec.v === 'late') && !rec.s && (P.ph === 'pos' || rec.early)) {
    if (App.pzBusy()) { App.pzMark('s'); App.toast({t:'[' + SYS.PZ.NAME + '] Veredito: ' + (rec.v === 'late' ? 'atraso' : 'cumprido'), s:App.pzLine(rec.v === 'late' ? 'late' : rec.early ? 'early' : 'ok'), ic:'check', ms:7000}); return; }
    return App.pzShow(rec.v === 'late' ? 'late' : 'ok');
  }
};
App.pzAck = function(){ var z = App.pz(); if (!z.show) return; z.show = null; Store.asAuto(function(){ App.commit(['core'], {norender:true}); }); };
App.pzIntroDone = function(){ var z = App.pz(); if (z.intro) return; z.intro = 1; z.introD = App.pzClock().day; App.pzArm(); Store.asAuto(function(){ App.commit(['core'], {norender:true}); }); App.pzPaint(); };
/* briefing do dia: um aviso curto na primeira vez que o Sistema abre antes de o portão abrir */
App.pzBriefing = function(){
  var z = App.pz(), P = App.pzPhase(), y = z.log[U.addDays(P.day, -1)] || {}, open = E.pzOpen(App.S).length, bits = [];
  if (P.rec.r) { App.toast({t:'[' + SYS.PZ.NAME + '] Hoje é descanso', s:'Declarado antes de o portão abrir: sem janela e sem veredito hoje.' + (open ? ' Prendas abertas: ' + open + '.' : ''), ic:'moon', ms:9000}); return; }
  var ont = {ok:'Ontem: janela cumprida' + (y.a ? ' (rank ' + E.pzRank(y.a) + ')' : '') + '.', late:'Ontem: atraso.', miss:'Ontem: falta.', rest:y.tr ? 'Ontem: trégua.' : 'Ontem: descanso.'}[y.v];
  if (ont) bits.push(ont);
  if ((z.seq || 0) > 0) bits.push('Sequência: ' + z.seq + (z.seq === 1 ? ' janela.' : ' janelas.'));
  if (open) bits.push('Prendas abertas: ' + open + '.');
  bits.push(App.pzLine('morning', null, 'b' + P.day));
  App.toast({t:'[' + SYS.PZ.NAME + '] Portão hoje às ' + z.ini + (P.need > 1 ? ' · mínimo ' + P.need + ' ações' : ''), s:bits.join(' '), ic:'clock', ms:11000});
};
/* o estado mudou por baixo (outro aparelho, outra aba): a tela cheia acompanha */
App.pzReconcile = function(){
  var u = App.ui.pz; if (!u || u.demo) return;
  var z = App.pz(), P = App.pzPhase(), rec = P.rec;
  if (u.k === 'miss') {
    if (u.step === 2) { if (!App.pzPensOf(u).length) App.pzHide(); return; }
    if (!z.show || z.show.t !== 'miss') { App.pzHide(); return; }
    if (u.sh !== z.show) { clearTimeout(App._pzSpin); u.sh = z.show; u.line = null; u.step = 0; App.pzRender(false); }
  }
  else if (u.k === 'call') { if (P.ph !== 'janela' || rec.v || rec.c) App.pzHide(); }
  else if (u.k === 'ok' || u.k === 'late') { if (rec.s || (rec.v !== 'ok' && rec.v !== 'late')) App.pzHide(); }
  else if (u.k === 'intro') { if (z.intro) App.pzHide(); }
};
App.pzCloseSeen = function(){
  var u = App.ui.pz; if (!u) return;
  if (!u.demo) { if (u.k === 'call') App.pzMark('c'); else if (u.k === 'ok' || u.k === 'late') App.pzMark('s'); else if (u.k === 'miss') App.pzAck(); else if (u.k === 'intro') App.pzIntroDone(); }
  App.pzHide(); App.pzPaint();
  setTimeout(function(){ App.pzPresent(); }, 280);
};

/* ---------- ações das telas ---------- */
App.A.pzClose = function(){ App.pzCloseSeen(); };
App.A.pzGo = function(el){ var r = el.getAttribute('data-r'); App.pzCloseSeen(); App.go(r); };
App.A.pzEnter = function(el){
  var id = el.getAttribute('data-id'), u = App.ui.pz;
  if (u && !u.demo) App.pzMark('c');
  App.pzHide();
  if (id && E.NODE[id]) App.A.openNode({getAttribute:function(k){ return k === 'data-id' ? id : null; }}); else App.go('missoes');
};
App.A.pzTruce = function(){
  var u = App.ui.pz, onMiss = !!(u && u.k === 'miss');
  if ((onMiss && !App.pzCanUndo()) || !App.pzUseTruce()) { App.toast({t:'Sem trégua disponível', s:'As ' + SYS.PZ.TRUCES + ' deste mês já foram usadas, ou a sentença de hoje já foi aceita.', ic:'alert'}); return; }
  App.pzHide(); App.commit(['core']); App.pzSoon();          /* a varredura remarca o que dependia de hoje (janela dobrada) */
  var left = App.pzTruceLeft();
  App.toast({t:'[' + SYS.PZ.NAME + '] Trégua concedida', s:App.pzLine('truce', {n:left === 1 ? 'resta uma' : left === 0 ? 'não resta nenhuma' : 'restam ' + left}), ic:'moon', ms:7000});
};
App.A.pzSpin = function(){
  var u = App.ui.pz; if (!u || u.k !== 'miss' || u.step !== 0) return;
  var pens = App.pzPensOf(u); u.step = 1; App.pzRender(false);
  App.pzSpinRun((pens[0] || {}).k, function(){
    if (App.ui.pz !== u) return;
    u.step = 2; if (!u.demo) App.pzAck();
    App.pzRender(false);
    var b = document.querySelector('#pzroot .btn.primary'); if (b) try { b.focus({preventScroll:true}); } catch (e) {}
    if (!u.demo) pens.forEach(function(p){ App.pzGen(p.id, true); });
  });
};
App.A.pzAccept = function(){ var u = App.ui.pz, demo = u && u.demo; App.pzHide(); App.pzPaint(); if (!demo) App.go('zona'); };
App.A.pzIntroOk = function(el){ var r = el.getAttribute('data-r'); App.pzIntroDone(); App.pzHide(); if (r) App.go(r); setTimeout(function(){ App.pzPresent(); }, 320); };
App.A.pzRecall = function(){ var P = App.pzPhase(); if (P.ph === 'janela' && !P.v) App.pzShow('call'); else App.go('zona'); };
App.A.pzDemo = function(el){
  var k = el.getAttribute('data-k'), c = App.pzClock(), z = App.pz();
  if (k === 'miss') {
    var kind = U.pick(SYS.PZ.KINDS.filter(function(x){ return x.id === 'treino' || x.id === 'briefing' || x.id === 'selo'; })), body = App.pzBody(kind.id, c.day);
    var fake = {id:'demo', k:kind.id, d:c.day, body:body, due:kind.id === 'selo' ? body.night : U.addDays(c.day, kind.due), st:'open'};
    return App.pzShow('miss', {demo:true, fake:[fake], sh:{t:'miss', n:1, days:[c.day], pens:['demo'], fine:0, lost:z.seq || 0}});
  }
  App.pzShow(k, {demo:true});
};
(function(){
  var oldCloseAll = App.A.closeAll;
  App.A.closeAll = function(){ if (App.ui.pz) { if (App.ui.pz.k === 'miss' && App.ui.pz.step === 1) return; App.pzCloseSeen(); return; } return oldCloseAll(); };
})();

/* ---------- relógio: contagem na tela cheia e no HUD ---------- */
App.pzTick = function(){
  var P = App.pzPhase(), t = App.$('pzpillt'); if (t) t.textContent = App.pzMMSS(P.left);
  var u = App.ui.pz;
  if (u && u.k === 'call' && !u.demo) {
    if (P.ph !== 'janela' || P.v) { App.pzHide(); return; }
    var c = App.$('pzclk'); if (c) c.textContent = App.pzMMSS(P.left);
    var prog = P.dur ? U.clamp(P.left / (P.dur * 60), 0, 1) : 0, b = App.$('pzbar'); if (b) b.style.width = (prog * 100).toFixed(1) + '%';
    var arc = document.querySelector('#pzroot .f-arc'); if (arc) arc.setAttribute('stroke-dashoffset', (+arc.getAttribute('data-c') * (1 - prog)).toFixed(1));
  }
};
App.pzPillHTML = function(){
  var S = App.S; if (!S || !S._u) return '';
  var z = App.pz(); if (!z.on) return '';
  var P = App.pzPhase(), open = E.pzOpen(S), out = '';
  function pill(cls, ic, html, title, act){ return act ? '<button class="pzpill ' + cls + '" data-a="' + act + '" title="' + U.esc(title) + '">' + U.icon(ic) + '<b>' + html + '</b></button>' : '<a class="pzpill ' + cls + '" href="#/zona" title="' + U.esc(title) + '">' + U.icon(ic) + '<b>' + html + '</b></a>'; }
  if (P.armed && P.v !== 'rest') {
    if (P.ph === 'janela') out += P.v === 'ok' ? pill('p-done', 'check', 'JANELA ' + E.pzRank(P.a), 'Janela cumprida · ' + P.a + ' ações') : pill('p-janela', 'clock', '<span id="pzpillt">' + App.pzMMSS(P.left) + '</span> · ' + P.a + '/' + P.need, 'Portão aberto: uma ação real cumpre a janela', 'pzRecall');
    else if (P.ph === 'pre' && P.toIni <= 7200) out += pill('p-pre', 'clock', 'PORTÃO ' + U.esc(z.ini), 'O portão abre às ' + z.ini);
    else if (P.ph === 'limbo') out += P.v === 'ok' ? pill('p-done', 'check', 'JANELA ' + E.pzRank(P.a), 'Janela cumprida') : pill('p-limbo', 'clock', 'VEREDITO ' + U.esc(z.ver), 'Portão fechado. Veredito às ' + z.ver);
  }
  if (open.some(function(p){ return p.k === 'selo' && p.body.night === P.day; })) out += pill('p-selo', 'lock', 'NOITE SELADA', 'Sem jogo nesta noite');
  if (open.length) out += pill('p-zona', 'alert', 'ZONA · ' + open.length, open.length + ' prenda(s) aberta(s) · loja selada');
  return out;
};
App.pzPaint = function(){
  var box = document.querySelector('#hud .hud-pills'); if (!box) return;
  var old = box.querySelectorAll('.pzpill'); for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
  var html = App.pzPillHTML(); if (html) box.insertAdjacentHTML('afterbegin', html);
};
(function(){
  var oldHud = App.renderHud; App.renderHud = function(){ oldHud(); App.pzPaint(); };
  var sealed = function(){ if (!E.pzOpen(App.S).length) return false; App.toast({t:'Loja selada', s:'Há prenda aberta na Zona de Penalidade. Quite primeiro; recompensa vem depois.', ic:'lock', ms:6500}); return true; };
  var oldBuy = App.A.buyOpen, oldBuyDo = App.A.buyDo;
  App.A.buyOpen = function(el){ if (sealed()) return; return oldBuy(el); };
  App.A.buyDo = function(el){ if (sealed()) { App.ui.modal = null; App.renderModal(); return; } return oldBuyDo(el); };
  var i = -1; App.NAV.forEach(function(n, k){ if (n && n[0] === 'portoes') i = k; });
  App.NAV.splice(i >= 0 ? i + 1 : 5, 0, ['zona', 'Zona', 'lock']);
  App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });
})();
