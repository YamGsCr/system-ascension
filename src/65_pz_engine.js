/* ===== v13 · O CHAMADO, O VEREDITO E A ZONA DE PENALIDADE · motor =========
   Janela diária (padrão 17:20–18:30): uma ação real dentro dela cumpre o dia.
   Veredito (padrão 19:30): janela vazia vira falta, e falta sorteia prenda.
   Estado em S.pz; tudo que o Sistema grava sozinho passa por Store.asAuto,
   para nunca contar como trabalho nem atropelar a nuvem.
   ========================================================================= */
E.pzNew = function(){
  return {v:1, on:true, since:'', ini:'17:20', fim:'18:30', ver:'19:30', dias:[0,1,2,3,4,5,6], min:1, tol:false,
    pause:'', truce:{m:'', n:0}, log:{}, pens:[], seq:0, best:0, clean:0,
    tot:{ok:0, miss:0, late:0, rest:0, early:0, s:0, paid:0, paidOn:0, same:0, exp:0, man:0},
    gin:0, gout:0, off:{}, intro:0, last:'', lastKind:'', show:null};
};
(function(){ var old = E.newState; E.newState = function(){ var s = old(); s.pz = E.pzNew(); return s; }; })();

E.pzMin = function(s){ var p = String(s || '').split(':'); return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); };
E.pzHM = function(m){ m = ((Math.round(m) % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
E.pzKind = function(id){ return SYS.PZ.KINDS.filter(function(k){ return k.id === id; })[0] || null; };
E.pzRank = function(a){ var r = ''; SYS.PZ.RANKS.forEach(function(x){ if (!r && a >= x[0]) r = x[1]; }); return r || '—'; };
E.pzOpen = function(S){ return ((S.pz && S.pz.pens) || []).filter(function(p){ return p.st === 'open'; }); };
E.pzArmed = function(S, day){
  var z = S.pz; if (!z || !z.on || !z.since || day < z.since) return false;
  if (z.pause && day <= z.pause) return false;
  return (z.dias || []).indexOf(U.parse(day).getDay()) >= 0;
};
E.pzNextArmed = function(S, from){ var d = from; for (var i = 0; i < 60; i++) { d = U.addDays(d, 1); if (E.pzArmed(S, d)) return d; } return U.addDays(from, 1); };
E.pzNeed = function(S, day){
  var z = S.pz, base = Math.max(1, +z.min || 1);
  var dob = E.pzOpen(S).some(function(p){ return p.k === 'dobro' && p.body && p.body.day === day; });
  return dob ? Math.max(2, base * 2) : base;
};

App.pz = function(){ var S = App.S; if (!S.pz) S.pz = E.pzNew(); return S.pz; };
/* relógio do dia do Sistema: minutos desde a meia-noite da data do dia (passa de 1440 de madrugada, antes do reset) */
App.pzClock = function(){
  var day = U.today(), now = new Date(), sec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  if (U.ymd(now) !== day) sec += 86400;                    /* madrugada antes do reset: ainda é o dia anterior do Sistema */
  return {day:day, min:Math.floor(sec / 60), sec:sec};
};
App.pzPhase = function(){
  var S = App.S, z = App.pz(), c = App.pzClock(), ini = E.pzMin(z.ini), fim = E.pzMin(z.fim), ver = E.pzMin(z.ver);
  var armed = E.pzArmed(S, c.day), rec = z.log[c.day] || {};
  var ph = !armed ? 'off' : c.min < ini ? 'pre' : c.min < fim ? 'janela' : c.min < ver ? 'limbo' : 'pos';
  return {day:c.day, min:c.min, sec:c.sec, ini:ini, fim:fim, ver:ver, ph:ph, armed:armed, rec:rec, v:rec.v || '', a:rec.a || 0,
    need:E.pzNeed(S, c.day), left:Math.max(0, fim * 60 - c.sec), toIni:Math.max(0, ini * 60 - c.sec), toVer:Math.max(0, ver * 60 - c.sec), dur:fim - ini};
};
App.pzTruceLeft = function(){ var z = App.pz(), m = U.monthKey(U.today()); return Math.max(0, SYS.PZ.TRUCES - (z.truce && z.truce.m === m ? z.truce.n : 0)); };

/* ---------- marcas de trabalho: uma por item (tópico, diária, capítulo, bloco de texto…) ----------
   Ação real = uma marca que passa do ponto mais alto que ESSE item já teve hoje. Assim:
   desmarcar e marcar o mesmo item não conta; desmarcar um e marcar OUTRO conta; enxugar uma
   nota não desconta nada do resto; e a faxina de dias antigos não mexe em nada. */
App.pzMap = function(){
  var S = App.S, N = App.N, J = App.J, M = {}, W = {doing:1, review:2, done:3};
  function put(k, v){ if (v) M[k] = v; }
  function txt(o){ var c = 0; Object.keys(o || {}).forEach(function(f){ if (typeof o[f] === 'string') c += Math.floor(o[f].length / 80); }); return c; }
  Object.keys(S.nodes || {}).forEach(function(id){ put('nd:' + id, W[(S.nodes[id] || {}).s] || 0); });
  Object.keys((N && N.n) || {}).forEach(function(id){
    var x = N.n[id] || {};
    (x.st || []).forEach(function(v){ put('st:' + id + ':' + v, 1); });
    Object.keys(x.cs || {}).forEach(function(k){ (x.cs[k] || []).forEach(function(v){ put('cs:' + id + ':' + k + ':' + v, 1); }); });
    put('tx:' + id, Math.floor((x.t || '').length / 80));
    if (x.ev) put('ev:' + id, 1);
    if (x.ex && x.ex.at) put('ex:' + id, 1);
    (x.mc || []).forEach(function(v, i){ if (v) put('mc:' + id + ':' + i, 1); });
  });
  Object.keys(S.tk || {}).forEach(function(id){ (S.tk[id] || []).forEach(function(v){ put('tk:' + id + ':' + v, 1); }); });
  var hoje = (S.daily || {})[U.today()] || {};
  Object.keys(hoje.q || {}).forEach(function(k){ put('dq:' + k, 1); });
  Object.keys(hoje.x || {}).forEach(function(k){ put('dx:' + k, 1); });
  Object.keys(S.ctr || {}).forEach(function(k){ put('ct:' + k, (S.ctr[k] && S.ctr[k].t) || 0); });
  Object.keys(S.feats || {}).forEach(function(k){ if (S.feats[k] && S.feats[k].d) put('ft:' + k, 2); });
  Object.keys(S.gates || {}).forEach(function(k){ var g = S.gates[k] || {}; (g.ev || []).forEach(function(v, i){ if (v) put('ge:' + k + ':' + i, 1); }); if (g.done) put('gd:' + k, 3); });
  Object.keys(S.books || {}).forEach(function(k){ var b = S.books[k] || {}; if (b.s) put('bk:' + k, b.s === 'read' ? 2 : 1); if (b.ap) put('ba:' + k, 1); });
  put('xm', (S.exams && S.exams.total) || 0);
  var h = S.hyp || {}; put('hd', (h.done || []).length * 2);
  if (h.on) put('ho:' + String(h.on.t || h.on.d0 || '').slice(0, 24), 1 + (h.on.log || []).length);
  put('ms', ((S.mesa || {}).ops || []).length); put('tm', Object.keys((S.term || {}).m || {}).length); put('tl', ((S.term || {}).log || []).length);
  put('of', (S.offs || []).length); put('mi', (S.milestones || []).length);
  put('sq', (S.sideq || []).filter(function(q){ return q && q.done; }).length);
  put('go', (S.goals || []).filter(function(g){ return g && g.done; }).length);
  if (J) {
    Object.keys(J.weeks || {}).forEach(function(k){ var w = J.weeks[k] || {}; put('jw:' + k, txt(w) + (w.cleared ? 2 : 0)); });
    Object.keys(J.months || {}).forEach(function(k){ var m = J.months[k] || {}; put('jm:' + k, txt(m) + (m.done ? 2 : 0)); });
    put('jo', (J.open || []).length);
  }
  put('pm', (((S.pz || {}).tot || {}).man || 0) * 2);       /* prendas quitadas pela pessoa (contador que só sobe) */
  return M;
};

/* ---------- contabilidade de um dia julgado ---------- */
E.pzCount = function(S, day, v){
  var z = S.pz, rec = z.log[day] || (z.log[day] = {}), T = z.tot, out = {gem:0, seqGem:0, lost:0, lostClean:0};
  rec.v = v;
  if (v === 'ok') {
    T.ok++; z.seq = (z.seq || 0) + 1; z.best = Math.max(z.best || 0, z.seq); z.clean = (z.clean || 0) + 1;
    if (rec.early) T.early++;
    out.gem = SYS.PZ.REW; out.seqGem = SYS.PZ.SEQREW[z.seq] || 0; z.gin = (z.gin || 0) + out.gem + out.seqGem;
  } else if (v === 'late') { T.late++; z.clean = (z.clean || 0) + 1; }
  else if (v === 'rest') { T.rest++; }
  else if (v === 'miss') { T.miss++; out.lost = z.seq || 0; out.lostClean = z.clean || 0; z.seq = 0; z.clean = 0; }
  return out;
};
E.pzJudge = function(S, day){
  var z = S.pz, rec = z.log[day] || {};
  if (rec.v) return rec.v;
  if (!E.pzArmed(S, day)) return 'off';
  if (rec.r) return 'rest';
  if (rec.dc != null && rec.dc < E.pzMin(z.ini)) return 'early';
  if ((rec.a || 0) >= E.pzNeed(S, day)) return 'ok';
  if (z.tol && (rec.l || 0) >= 1) return 'late';
  return 'miss';
};
E.pzFine = function(S, amt){
  var bal = Math.max(0, E.derive(S, App.J).gem), f = Math.max(0, Math.min(amt, bal));
  S.pz.gout = (S.pz.gout || 0) + f; return f;
};
E.pzPayState = function(S, p, ev, day){
  var z = S.pz; if (!p || p.st !== 'open') return false;
  p.st = 'paid'; p.paid = new Date().toISOString(); p.ev = ev || {}; delete p.dr;
  z.tot.paid++; if (!p.over) z.tot.paidOn++; if (day && day === p.d) z.tot.same++;
  if (!p.ev.auto) z.tot.man = (z.tot.man || 0) + 1;
  return true;
};
/* faxina: o registro guarda 150 dias; das prendas encerradas ficam 30, e só as 8 mais recentes com o conteúdo inteiro */
E.pzPrune = function(S){
  var z = S.pz, keys = Object.keys(z.log).sort();
  if (keys.length > 150) keys.slice(0, keys.length - 150).forEach(function(k){ delete z.log[k]; });
  var open = z.pens.filter(function(p){ return p.st === 'open'; }), closed = z.pens.filter(function(p){ return p.st !== 'open'; });
  if (closed.length > 30) closed = closed.slice(-30);
  closed.slice(0, Math.max(0, closed.length - 8)).forEach(function(p){
    delete p.body; delete p.dr; delete p.gen; delete p.src;
    if (p.ev) { delete p.ev.text; delete p.ev.livro; }
  });
  if (closed.length + open.length !== z.pens.length || closed.length > 8) z.pens = closed.concat(open);
};

/* ---------- derivação: cristais da janela, multas e contadores para conquistas ---------- */
(function(){
  var old = E.derive;
  E.derive = function(S, J){
    var D = old(S, J), z = S.pz || {}, T = z.tot || {}, gin = z.gin || 0, gout = z.gout || 0;
    D.gem += gin - gout; D.gemEarned += gin;
    D.pzOk = T.ok || 0; D.pzSeq = z.seq || 0; D.pzBest = z.best || 0; D.pzS = T.s || 0; D.pzEarly = T.early || 0;
    D.pzSame = T.same || 0; D.pzPaidOn = T.paidOn || 0; D.pzPaid = T.paid || 0; D.pzClean = z.clean || 0; D.pzMissTot = T.miss || 0;
    D.pzOpen = (z.pens || []).filter(function(p){ return p.st === 'open'; }).length;
    return D;
  };
})();

/* ---------- registro de ação: todo save passa por aqui ---------- */
/* ponto de partida da contagem: tudo o que já existe agora conta como "já visto".
   Com junta = true (estado que chegou de outro aparelho), soma ao que já tinha sido visto aqui. */
App.pzBase = function(junta){
  var M = App.pzMap(), H = (junta && App._pzHw) ? App._pzHw : {};
  Object.keys(M).forEach(function(k){ if (!(H[k] >= M[k])) H[k] = M[k]; });
  App._pzHw = H; App._pzDay = App.pzClock().day;
};
App.pzOnSave = function(names){
  var S = App.S; if (!S || !App.N) return names;
  var c = App.pzClock(), H = App._pzHw, sameDay = App._pzDay === c.day, delta = 0;
  if (!H || !sameDay) { App.pzBase(false); if (!H) return names; }
  else {
    var M = App.pzMap();
    Object.keys(M).forEach(function(k){ var top = H[k] || 0; if (M[k] > top) { delta += M[k] - top; H[k] = M[k]; } });
    delta = Math.min(3, delta);
  }
  var z = App.pz(); if (!z.on) return names;
  var ini = E.pzMin(z.ini), touched = false, rec, dr = S.daily[c.day];
  /* descanso declarado ANTES de o portão abrir desarma a janela do dia; depois disso, não */
  if (c.min < ini) {
    rec = z.log[c.day];
    if (dr && dr.rest) { if (!rec) rec = z.log[c.day] = {}; if (!rec.r) { rec.r = 1; touched = true; } }
    else if (rec && rec.r) { delete rec.r; touched = true; }
  }
  /* minuto em que as diárias do dia fecharam (para o "chegou antes") */
  if (dr && !dr.rest && !dr.frozen && E.dayComplete(dr)) { rec = z.log[c.day] || (z.log[c.day] = {}); if (rec.dc == null) { rec.dc = c.min; touched = true; } }
  if (delta > 0 && !Store.auto && E.pzArmed(S, c.day)) {
    var P = App.pzPhase(), key = P.ph === 'janela' ? 'a' : P.ph === 'limbo' ? 'l' : P.ph === 'pre' ? 'e' : 'x';
    rec = z.log[c.day] || (z.log[c.day] = {});
    rec[key] = (rec[key] || 0) + delta; touched = true;
    if (key === 'a') {
      if (rec.a >= SYS.PZ.RANKS[0][0] && !rec.sr) { rec.sr = 1; z.tot.s++; }
      if (!rec.v && rec.a >= P.need) App.pzHonor(c.day);
      else App.pzSoon();
    }
  }
  if (touched && names.indexOf('core') < 0) names = names.concat(['core']);
  return names;
};
(function(){
  var oldSave = Store.save;
  Store.save = function(names){
    try { names = App.pzOnSave(names) || names; } catch (e) { if (window.console) console.error(e); }
    return oldSave(names);
  };
  var oldReplace = App.replaceDoc;
  App.replaceDoc = function(k, doc){ var r = oldReplace(k, doc); App.pzBase(true); if (App.pzReconcile) App.pzReconcile(); App.pzSoon(); return r; };
})();

/* janela cumprida: registra, premia e avisa (o save em curso já leva o estado) */
App.pzHonor = function(day){
  var S = App.S, z = App.pz(), rec = z.log[day] || (z.log[day] = {});
  if (rec.v) return;
  var o = E.pzCount(S, day, 'ok'), res = {dobro:[], fine:0, changed:false};
  App.pzDobroPass(res);
  setTimeout(function(){
    App.toast({t:'[' + SYS.PZ.NAME + '] Janela cumprida · sequência ' + z.seq, s:App.pzLine('done') + ' +' + (o.gem + o.seqGem) + ' ◆' + (o.seqGem ? ' (bônus de sequência)' : ''), ic:'clock', ms:6500});
    if (res.dobro.length) App.toast({t:'Janela Dobrada cumprida', s:App.pzLine('paid') + (E.pzOpen(S).length ? '' : ' Loja liberada.'), ic:'check', ms:6500});
    if (App.ui.pz && App.ui.pz.k === 'call') App.pzHide();
    Store.asAuto(function(){ App.commit(['core']); });
  }, 60);
};
App.pzSoon = function(){ clearTimeout(App._pzT); App._pzT = setTimeout(function(){ App.pzSync(); }, 120); };

/* ---------- sorteio e conteúdo das prendas ---------- */
App.pzBody = function(kind, day){
  var S = App.S, z = App.pz(), D = App.D, c = App.pzClock();
  if (kind === 'selo') return {night:U.rand() < 0.6 ? day : U.addDays(day, 1)};
  if (kind === 'treino') {
    var ti = (D && D.brTier && D.brTier.aesthetic && D.brTier.aesthetic.cal) ? D.brTier.aesthetic.cal.i : 0, lv = ti <= 0 ? 0 : ti <= 2 ? 1 : 2;
    var t = U.pick(SYS.PZ.TREINOS[lv]);
    return {t:t.t, min:t.min, rounds:t.rounds, rest:t.rest, items:t.items.map(function(i){ return [i[0], i[1]]; }), lv:lv};
  }
  if (kind === 'briefing') {
    var mine = E.focusWays(S).concat(E.fixedWays(S)), pool = SYS.PZ.CENAS.filter(function(x){ return mine.indexOf(x.w) >= 0; });
    var s = U.pick(pool.length ? pool : SYS.PZ.CENAS);
    return {w:s.w, t:s.t, c:s.c, q:s.q};
  }
  if (kind === 'banca') { var ids = App.pzBancaPool(); return {node:ids.length ? U.pick(ids) : ''}; }
  if (kind === 'marcha') return {min:30};
  if (kind === 'leitura') return {pag:20};
  if (kind === 'dobro') {
    var rec = z.log[c.day] || {}, hoje = E.pzArmed(S, c.day) && c.min < E.pzMin(z.ini) && !rec.v;
    return {day:hoje ? c.day : E.pzNextArmed(S, c.day)};
  }
  return {};
};
App.pzBancaPool = function(){ var S = App.S; return Object.keys(S.nodes || {}).filter(function(id){ var s = (S.nodes[id] || {}).s; return E.NODE[id] && (s === 'done' || s === 'review' || s === 'doing'); }); };
App.pzDraw = function(forDay){
  var S = App.S, z = App.pz(), c = App.pzClock(), busy = {};
  E.pzOpen(S).forEach(function(p){ busy[p.k] = 1; });
  if (!App.pzBancaPool().length) busy.banca = 1;
  var free = SYS.PZ.KINDS.filter(function(k){ return !busy[k.id]; });
  var pool = free.filter(function(k){ return z.off[k.id] !== true && k.id !== z.lastKind; });
  if (!pool.length) pool = free.filter(function(k){ return z.off[k.id] !== true; });
  if (!pool.length) pool = free;
  if (!pool.length) return null;
  var tot = pool.reduce(function(s, k){ return s + k.w; }, 0), r = U.rand() * tot, kind = pool[pool.length - 1];
  for (var i = 0; i < pool.length; i++) { r -= pool[i].w; if (r < 0) { kind = pool[i]; break; } }
  z.lastKind = kind.id;
  var p = {id:'pz' + U.uid(), k:kind.id, d:c.day, f:forDay, at:new Date().toISOString(), st:'open', src:'table', body:App.pzBody(kind.id, c.day), due:''};
  p.due = kind.id === 'selo' ? p.body.night : kind.id === 'dobro' ? p.body.day : U.addDays(c.day, kind.due);
  return p;
};

/* ---------- varredura: julga dias passados e, depois do veredito, o dia de hoje ---------- */
App.pzSweep = function(){
  var S = App.S, z = App.pz(), c = App.pzClock(), res = {changed:false, miss:[], lost:0, lostClean:0, fine:0, over:0, dobro:[], fineToday:0, failedToday:[]};
  if (!z.on || !z.since) return res;
  function settle(day){
    var v = E.pzJudge(S, day); if (v === 'off') return;
    var rec = z.log[day] || (z.log[day] = {}); if (rec.v) return;
    if (v === 'early') { rec.early = 1; v = 'ok'; }
    var o = E.pzCount(S, day, v); res.changed = true;
    if (v === 'miss') { res.miss.push(day); res.lost = Math.max(res.lost, o.lost); res.lostClean = Math.max(res.lostClean, o.lostClean); }
  }
  var from = z.last ? U.addDays(z.last, 1) : z.since, y = U.addDays(c.day, -1), guard = 0;
  if (from < z.since) from = z.since;
  for (var d = from; d < c.day && guard < 150; d = U.addDays(d, 1), guard++) settle(d);
  if (y >= z.since && z.last !== y) { z.last = y; res.changed = true; }
  var ini = E.pzMin(z.ini), ver = E.pzMin(z.ver), rec = z.log[c.day] || {};
  if (E.pzArmed(S, c.day) && !rec.v) {
    if (c.min >= ver) settle(c.day);
    else if (c.min >= ini) { var v = E.pzJudge(S, c.day); if (v === 'early' || v === 'rest' || v === 'ok') settle(c.day); }
  }
  App.pzDobroPass(res);
  z.pens.forEach(function(p){
    if (p.st !== 'open' || p.over || p.k === 'dobro') return;
    var lim = p.k === 'selo' ? U.addDays(p.body.night, 2) : p.due;
    if (c.day > lim) { p.over = 1; z.tot.exp++; res.fine += E.pzFine(S, SYS.PZ.FINE.over); res.over++; res.changed = true; }
  });
  if (res.changed) E.pzPrune(S);
  return res;
};
/* Janela Dobrada: fecha sozinha conforme o veredito do dia marcado. Dia que não valeu
   (trégua, descanso, atraso tolerado, pausa, dia desarmado) empurra para a próxima janela. */
App.pzDobroPass = function(res){
  var S = App.S, z = App.pz(), c = App.pzClock();
  z.pens.forEach(function(p){
    if (p.st !== 'open' || p.k !== 'dobro' || !p.body) return;
    var day = p.body.day, v = (z.log[day] || {}).v;
    if (v === 'ok') { E.pzPayState(S, p, {auto:1}, c.day); res.dobro.push('ok'); res.changed = true; return; }
    if (v === 'miss') {
      var f = E.pzFine(S, SYS.PZ.FINE.dobro);
      p.st = 'failed'; p.paid = new Date().toISOString(); res.fine += f; res.dobro.push('fail'); res.changed = true;
      if (day === c.day && res.failedToday) { res.fineToday += f; res.failedToday.push(p.id); }
      return;
    }
    if (v || day < c.day || !E.pzArmed(S, day)) {
      var nd = App.pzBody('dobro', c.day).day;
      if (nd !== day) { p.body.day = nd; p.due = nd; res.changed = true; }
    }
  });
};
App.pzSentence = function(res){
  var S = App.S, z = App.pz(), c = App.pzClock(), n = res.miss.length; if (!n) return null;
  var slots = Math.max(0, SYS.PZ.MAXOPEN - E.pzOpen(S).length), give = Math.min(n >= 3 ? 2 : 1, slots), pens = [], fine = res.fine || 0, last = res.miss[n - 1];
  var back = res.fineToday || 0;                           /* o que uma trégua devolve: só o que a falta de HOJE custou */
  for (var i = 0; i < give; i++) { var p = App.pzDraw(last); if (p) { z.pens.push(p); pens.push(p.id); } }
  if (!pens.length) { var ff = E.pzFine(S, SYS.PZ.FINE.full); fine += ff; back += ff; }
  if (n > 1) fine += E.pzFine(S, Math.min(SYS.PZ.FINE.extraCap, (n - 1) * SYS.PZ.FINE.extra));
  (z.log[last] = z.log[last] || {}).p = pens[0] || '';
  var old = z.show && z.show.t === 'miss' ? z.show : null;
  z.show = {t:'miss', days:(old ? old.days : []).concat(res.miss).slice(-30), n:(old ? old.n : 0) + n, pens:(old ? old.pens : []).concat(pens), fine:(old ? old.fine : 0) + fine,
    lost:Math.max(old ? old.lost : 0, res.lost), lostClean:Math.max(old ? old.lostClean || 0 : 0, res.lostClean), full:!pens.length, today:!old && n === 1 && last === c.day, at:new Date().toISOString()};
  if (z.show.today) z.show.undo = {fine:back, dobro:(res.failedToday || []).slice()};
  return z.show;
};

/* Mexer num ajuste (cancelar a pausa, armar o dia da semana, puxar o horário para trás) pode armar o dia de hoje
   com o portão já aberto ou fechado. Nesse caso hoje não vale: a pessoa não teve a janela. */
App.pzSetting = function(fn){
  var S = App.S, z = App.pz(), c = App.pzClock();
  var had = E.pzArmed(S, c.day) && c.min >= E.pzMin(z.ini);
  fn();
  if (!had && E.pzArmed(S, c.day) && c.min >= E.pzMin(z.ini)) {
    var rec = z.log[c.day] || (z.log[c.day] = {});
    if (!rec.v) { rec.v = 'rest'; rec.g = 1; }
  }
  App.commit(['core']); App.pzSync();
};
/* trégua: vale para o dia de hoje, antes do veredito ou enquanto a sentença de hoje ainda não foi aceita */
App.pzCanTruce = function(){
  var z = App.pz(), c = App.pzClock(), rec = z.log[c.day] || {};
  if (!E.pzArmed(App.S, c.day) || App.pzTruceLeft() <= 0) return false;
  if (!rec.v) return true;
  return rec.v === 'miss' && !!(z.show && z.show.t === 'miss' && z.show.today);
};
/* a trégua desfaz a sentença que está na tela? só a de hoje, e só enquanto não foi aceita */
App.pzCanUndo = function(){
  var z = App.pz(), c = App.pzClock(), rec = z.log[c.day] || {};
  return E.pzArmed(App.S, c.day) && App.pzTruceLeft() > 0 && rec.v === 'miss' && !!(z.show && z.show.t === 'miss' && z.show.today);
};
App.pzUseTruce = function(){
  if (!App.pzCanTruce()) return false;
  var z = App.pz(), c = App.pzClock(), m = U.monthKey(c.day), rec = z.log[c.day] || (z.log[c.day] = {}), sh = z.show;
  if (rec.v === 'miss' && sh) {
    var un = sh.undo || {fine:0, dobro:[]};
    z.tot.miss = Math.max(0, z.tot.miss - 1);
    z.pens = z.pens.filter(function(p){ return sh.pens.indexOf(p.id) < 0; });
    z.pens.forEach(function(p){ if (un.dobro.indexOf(p.id) >= 0 && p.st === 'failed') { p.st = 'open'; delete p.paid; } });   /* a janela dobrada de hoje volta a valer e é remarcada */
    z.gout = Math.max(0, (z.gout || 0) - (un.fine || 0)); z.seq = sh.lost || 0; z.clean = sh.lostClean || 0; z.show = null;
    delete rec.p;
  }
  rec.v = 'rest'; rec.tr = 1; z.tot.rest++;
  if (!z.truce || z.truce.m !== m) z.truce = {m:m, n:0};
  z.truce.n++;
  return true;
};

/* ---------- falas ---------- */
App.pzFill = function(s, extra){
  var z = App.pz(), P = App.pzPhase(), o = {ini:z.ini, fim:z.fim, ver:z.ver, dur:P.dur, seq:z.seq || 0, left:Math.max(1, Math.ceil(P.left / 60))};
  Object.keys(extra || {}).forEach(function(k){ o[k] = extra[k]; });
  return String(s).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; });
};
App.pzLine = function(key, extra, seed){
  var L = SYS.PZ.LINES[key] || [''], pick = seed ? L[Math.floor(U.seeded(seed)() * L.length)] : U.pick(L);
  return App.pzFill(pick, extra);
};
App.pzCallLine = function(){
  var z = App.pz(), P = App.pzPhase(), open = E.pzOpen(App.S).length, y = z.log[U.addDays(P.day, -1)] || {}, seed = 'call' + P.day;
  if (P.left <= 15 * 60) return App.pzLine('callLow', null, seed);
  if (open) return App.pzLine('callDebt', {n:open === 1 ? 'uma prenda' : open + ' prendas'}, seed);
  if ((P.rec.e || 0) > 0) return App.pzLine('callEarly', null, seed);
  if (y.v === 'miss') return App.pzLine('callAfterMiss', null, seed);
  if ((z.seq || 0) >= 3 && U.seeded(seed + 's')() < 0.6) return App.pzLine('callSeq', null, seed);
  return App.pzLine('call', null, seed);
};
App.pzMissLine = function(sh){
  var seed = 'miss' + (sh.at || '');
  if (sh.full) return App.pzLine('full', null, seed);
  if (sh.n >= 3) return App.pzLine('missMany', {n:sh.n}, seed);
  if (sh.n === 2) return App.pzLine('missAgain', null, seed);
  return App.pzLine('miss', null, seed);
};

/* ---------- orquestração: quando julgar e o que mostrar ---------- */
/* há algo automático a decidir agora? simula a varredura numa cópia do protocolo, sem tocar no estado */
/* arma o protocolo: a primeira janela é a de hoje se o portão ainda não abriu; senão, a de amanhã */
App.pzArm = function(){
  var z = App.pz(), c = App.pzClock();
  if (z.since) return false;
  z.since = c.min < E.pzMin(z.ini) ? c.day : U.addDays(c.day, 1);
  return true;
};
App.pzTodo = function(){
  var S = App.S, keep = S.pz, r = false;
  if (!keep || !keep.on) return false;
  if (!keep.since) return !!keep.intro;                   /* antes de a apresentação ser aceita, nada é armado nem julgado */
  try { S.pz = JSON.parse(JSON.stringify(keep)); r = !!App.pzSweep().changed; } catch (e) { r = false; } finally { S.pz = keep; }
  return r;
};
App.pzSync = function(){
  var S = App.S; if (!S || !S._u) return;                 /* jogador novo: nada automático antes do primeiro save */
  if (Store.waking || !Store.settled()) return;           /* espera a nuvem ser conferida */
  if (document.hidden) return;                            /* aba em segundo plano não julga: decide quem está na frente */
  var z = App.pz(), c = App.pzClock(), changed = false, res = null;
  if (z.on && App.pzTodo() && !Store.isFresh('core', 4000) && (App._pzFail || 0) < 6) {
    /* antes de julgar, confere se outro aparelho já não fez o trabalho de hoje */
    if (App.pzPaint) App.pzPaint();
    if (App._pzVer || Date.now() < (App._pzRetry || 0)) return;
    App._pzVer = true;
    Store.verify('core').then(function(ok){
      App._pzVer = false;
      if (ok) App._pzFail = 0; else { App._pzFail = (App._pzFail || 0) + 1; App._pzRetry = Date.now() + Math.min(30000, 4000 * App._pzFail); }
      App.pzSync();
    });
    return;
  }
  if (z.on) Store.asAuto(function(){
    if (!z.since && z.intro && App.pzArm()) changed = true;
    res = App.pzSweep(); if (res.changed) changed = true;
    if (res.miss.length) { App.pzSentence(res); changed = true; }
    if (changed) App.commit(['core']);
  });
  if (res && !res.miss.length) {
    if (res.over) App.toast({t:'[' + SYS.PZ.NAME + '] Prenda vencida', s:App.pzLine('over') + (res.fine ? ' −' + res.fine + ' ◆' : ''), ic:'alert', ms:7000});
    res.dobro.forEach(function(r){ App.toast(r === 'ok' ? {t:'Janela Dobrada cumprida', s:App.pzLine('paid'), ic:'check', ms:6000} : {t:'Janela Dobrada falhou', s:'A prenda virou multa. O registro não esquece.', ic:'alert', ms:6000}); });
  }
  App._pzKey = App.pzKey();
  if (App.pzReconcile) App.pzReconcile();
  if (App.pzPaint) App.pzPaint();
  if (App.pzPresent) App.pzPresent();
};
App.pzKey = function(){ var P = App.pzPhase(); return P.day + '|' + P.ph + '|' + (P.left <= 900 && P.ph === 'janela' ? 'low' : ''); };
(function(){
  var oldInit = App.init;
  App.init = function(){
    var r = oldInit();
    App.pzBase(false);
    var n = 0, wait = setInterval(function(){
      n++;
      if (Store.settled()) { clearInterval(wait); App.pzSync(); return; }
      if (n === 12 && Store.mode === 'remote') Store.verify('core');   /* 2,4 s sem resposta definitiva: pergunta direto */
      if (n >= 150) clearInterval(wait);                               /* daí em diante o relógio de 1 s cuida */
    }, 200);
    document.addEventListener('visibilitychange', function(){ if (!document.hidden) App.pzSync(); });
    return r;
  };
  var oldClock = App.clockTick;
  App.clockTick = function(){
    oldClock();
    if (!App.S) return;
    if (App.pzTick) App.pzTick();
    if (App.pzKey() !== App._pzKey) App.pzSync();
    else if (App._pzDefer && App.pzPresent) App.pzPresent();
  };
  /* importar ou zerar o save não é "ação real": a impressão digital recomeça dali */
  ['importDo', 'resetDo'].forEach(function(k){ var old = App.A[k]; if (!old) return; App.A[k] = function(el, ev){ App._pzHw = null; var r = old(el, ev); App.pzBase(false); App.pzSoon(); return r; }; });
})();
