/* ===== VIEW v2: Sequência (chama + mascote), missões extras, calendário ===== */
App.sysMood = function(){
  var S = App.S, D = App.D, t = U.today(), r = S.daily[t];
  if (S.streakLost && S.streakLost.at === t && !E.dayComplete(r)) return 'sad';
  if (r && r.rest) return 'sleepy';
  if (E.dayComplete(r)) { if (SYS.STREAK_MS.indexOf(D.streak) >= 0) return 'party'; return E.extraDay(r) ? 'smug' : 'happy'; }
  if (U.msToReset() < 3 * 3600000 && D.streak > 0) return 'panic';
  return D.streak > 0 ? 'worried' : 'fresh';
};
App.sysLine = function(mood){
  var D = App.D, t = U.today();
  if (mood === 'party' && SYS.MSLINES[D.streak]) return SYS.MSLINES[D.streak];
  var arr = SYS.SYSLINES[mood === 'party' ? 'happy' : mood] || SYS.SYSLINES.fresh, rnd = U.seeded(t + mood)();
  return arr[Math.floor(rnd * arr.length)].replace('{n}', D.streak).replace('{h}', U.fmtDur(U.msToReset()));
};
App.dayState = function(d){
  var r = App.S.daily[d]; if (d > U.today()) return {k:'fut', n:'futuro'};
  if (!r) return {k:'', n:'nada registrado'};
  if (r.frozen) return {k:'fz', n:r.rep ? 'reacendido pela runa' : 'protegido por gelo'};
  if (E.extraDay(r)) return {k:'xd', n:(r.rest ? 'descanso' : 'completo') + ' + ' + E.xCount(r) + ' extra' + (E.xCount(r) > 1 ? 's' : '')};
  if (r.rest) return {k:'rs', n:'descanso oficial'};
  if (E.dayComplete(r)) return {k:'ok', n:'diárias completas'};
  var n = E.qCount(r); return n ? {k:'pt', n:'parcial · ' + n + '/' + (r.need || 0)} : {k:'', n:'nada registrado'};
};
App.heatmap = function(weeks){
  var t = U.today(), start = U.addDays(U.weekKey(t), -7 * (weeks - 1)), cells = '', months = '';
  for (var w = 0; w < weeks; w++) {
    var wk = U.addDays(start, 7 * w), p = U.parse(wk);
    months += '<span>' + (p.getDate() <= 7 || w === 0 ? U.esc(p.toLocaleDateString('pt-BR', {month:'short'}).replace('.', '')) : '') + '</span>';
    for (var d = 0; d < 7; d++) { var day = U.addDays(wk, d), st = App.dayState(day); cells += '<i class="hc ' + st.k + '"' + (st.k === 'fut' ? '' : ' data-tip="' + U.esc(U.fmtDate(day) + ' · ' + st.n) + '" tabindex="0"') + '></i>'; }
  }
  var leg = [['pt','parcial'],['ok','completo'],['xd','dia extra'],['rs','descanso'],['fz','gelo / runa']];
  return '<div class="heatwrap"><div class="hm-months" style="grid-template-columns:repeat(' + weeks + ',15px)">' + months + '</div><div class="hm" role="img" aria-label="Calendário de sequência: ' + weeks + ' semanas">' + cells + '</div></div>'
    + '<div class="hm-legend">' + leg.map(function(l){ return '<span><i class="hc ' + l[0] + '"></i>' + l[1] + '</span>'; }).join('') + '</div>';
};
App.extrasSuggest = function(day){
  var S = App.S, pins = S.settings.extrasPin || [], rnd = U.seeded('x' + day), pool = SYS.EXTRAS.filter(function(x){ return pins.indexOf(x.id) < 0; }).slice();
  for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp; }
  var out = [], ways = {};
  pool.forEach(function(x){ if (out.length < 3 && !ways[x.way || 'sys']) { out.push(x.id); ways[x.way || 'sys'] = 1; } });
  return out;
};
App.extraRow = function(x, on, pinned){
  var w = x.way && App.way(x.way);
  return '<div class="xq' + (on ? ' on' : '') + '"><button class="xq-main" data-a="extraToggle" data-id="' + x.id + '" aria-pressed="' + on + '"><span class="box">' + U.icon('check') + '</span><span style="min-width:0;text-align:left"><span class="t">' + U.esc(x.n) + '</span><span class="d">' + U.esc(x.why) + '</span></span><span class="rw">+2 XP<br>' + (w ? '<span style="color:' + w.color + '">' + w.attr + '</span> · ' : '') + '+1 ◆</span></button>'
    + '<button class="iconbtn pin' + (pinned ? ' on' : '') + '" data-a="extraPin" data-id="' + x.id + '" aria-pressed="' + pinned + '" aria-label="' + (pinned ? 'Desafixar' : 'Fixar') + ' missão extra" data-tip="' + (pinned ? 'Desafixar' : 'Fixar nas sugestões') + '">' + U.icon('star') + '</button></div>';
};
App.extrasBlock = function(){
  var S = App.S, t = U.today(), rec = S.daily[t] || {}, x = rec.x || {}, done = Object.keys(x), pins = S.settings.extrasPin || [], all = App.ui.f.xall;
  var ids = all ? SYS.EXTRAS.map(function(e){ return e.id; }) : pins.concat(App.extrasSuggest(t)).concat(done).filter(function(id, i, a){ return a.indexOf(id) === i && E.EXTRA[id]; });
  var dayOk = E.dayComplete(S.daily[t]);
  return '<section class="win"><div class="win-h">' + U.icon('sparkle') + 'Missões extras<span class="act" style="cursor:default">' + Math.min(done.length, SYS.EXTRA_CAP) + '/' + SYS.EXTRA_CAP + ' com recompensa</span></div>'
    + '<p class="dim" style="font-size:13.5px;margin-bottom:10px">Pequenas, reais e opcionais. Cada uma dá +2 XP e +1 ◆ (até ' + SYS.EXTRA_CAP + ' por dia). <b>Diárias completas + 1 extra = dia extra</b> (+3 ◆ e chama dourada). ' + (dayOk ? '' : 'Faça as diárias primeiro — extra sem diária não conta para o dia extra.') + '</p>'
    + '<div class="stack" style="gap:6px">' + ids.map(function(id){ return App.extraRow(E.EXTRA[id], !!x[id], pins.indexOf(id) >= 0); }).join('') + '</div>'
    + '<div class="row between" style="margin-top:10px"><span class="faint mono" style="font-size:11.5px">Sugestões mudam a cada reset · ☆ fixa uma missão</span><button class="btn sm ghost" data-a="extrasAll">' + (all ? 'Mostrar só sugestões' : 'Ver todas (' + SYS.EXTRAS.length + ')') + '</button></div></section>';
};
App.A.extraToggle = function(el){
  var S = App.S, id = el.getAttribute('data-id'), t = U.today(), rec = S.daily[t] || (S.daily[t] = {q:{}, need:S.settings.dailies.length});
  rec.x = rec.x || {}; var was = E.extraDay(rec);
  if (rec.x[id]) delete rec.x[id]; else rec.x[id] = 1;
  if (!Object.keys(rec.x).length) delete rec.x;
  App.commit(['core']);
  if (!was && E.extraDay(rec)) App.toast({t:'Dia extra desbloqueado · +3 ◆', s:U.pick(SYS.SYSLINES.smug), ic:'sparkle'});
};
App.A.extraPin = function(el){ var p = App.S.settings.extrasPin, id = el.getAttribute('data-id'), k = p.indexOf(id); if (k >= 0) p.splice(k, 1); else { if (p.length >= 6) p.shift(); p.push(id); } App.commit(['core']); };
App.A.extrasAll = function(){ App.ui.f.xall = !App.ui.f.xall; App.renderView(); };

App.V.sequencia = function(){
  var S = App.S, D = App.D, t = U.today(), rec = S.daily[t] || {q:{}}, tier = U.flameTier(D.streak), mood = App.sysMood(), next = SYS.STREAK_MS.filter(function(m){ return m > D.streak; })[0];
  var act = S.settings.dailies, done = act.filter(function(id){ return rec.q && (id in rec.q); }).length;
  var h = H.head('Chama do Sistema', 'Sequência', 'Dias seguidos com todas as diárias. Descanso oficial (até 2 por semana) e o Gelo do Sistema seguram a chama. O dia do Sistema vira às ' + String(U.resetHour()).padStart(2, '0') + ':00.');
  if (S.streakLost && E.repairable(S)) h += '<section class="win emerg"><div class="win-h" style="color:var(--bad)">' + U.icon('flame') + 'A chama apagou</div><div class="row between"><p class="dim" style="max-width:62ch">Sua sequência de <b>' + S.streakLost.len + ' dias</b> apagou (' + S.streakLost.gap.length + ' dia' + (S.streakLost.gap.length > 1 ? 's' : '') + ' perdido' + (S.streakLost.gap.length > 1 ? 's' : '') + '). A Runa de Recuperação reacende se usada até ' + U.fmtDate(U.addDays(S.streakLost.at, 3)) + '. Ou recomece do 1 — XP ninguém tira.</p><button class="btn danger" data-a="sysBuyOpen" data-k="up" data-id="up_repair">' + U.icon('flame') + 'Runa · ' + SYS.SYSSHOP.filter(function(x){ return x.id === 'up_repair'; })[0].c + ' ◆</button></div></section>';
  h += '<section class="win streakhero fl-' + tier.k + '"><div class="sh-flame">' + U.flame(D.streak, 132) + '<div class="sh-num"><b>' + D.streak + '</b><span>dia' + (D.streak === 1 ? '' : 's') + ' de sequência</span><em>' + U.esc(tier.n) + '</em></div></div>'
    + '<div class="sh-sys"><div class="bubble">' + U.esc(App.sysLine(mood)) + '</div>' + U.mascot(mood, 104) + '</div>'
    + '<div class="sh-stats"><div class="kpi"><b>' + D.bestStreak + '</b><span>melhor sequência</span></div><div class="kpi"><b class="gold">' + D.extraStreak + '</b><span>dias extras seguidos</span></div><div class="kpi"><b>' + (S.owned.freezes || 0) + '/' + SYS.FREEZE_MAX + '</b><span>gelos equipados</span></div><div class="kpi"><b id="hudreset2">' + U.fmtDur(U.msToReset()) + '</b><span>para o reset</span></div></div></section>';
  var wk = U.weekKey(t), strip = '';
  for (var i = 0; i < 7; i++) { var d = U.addDays(wk, i), st = App.dayState(d), lbl = ['S','T','Q','Q','S','S','D'][i]; strip += '<div class="wd ' + st.k + (d === t ? ' today' : '') + '" data-tip="' + U.esc(U.fmtDate(d) + ' · ' + st.n) + '"><span>' + lbl + '</span><i>' + (st.k === 'ok' || st.k === 'xd' ? U.icon('check') : st.k === 'rs' ? U.icon('moon') : st.k === 'fz' ? U.icon('shield') : '') + '</i></div>'; }
  var today = '<section class="win"><div class="win-h">' + U.icon('target') + 'Hoje · ' + done + '/' + act.length + ' diárias<a class="act" href="#/missoes/diarias">configurar</a></div><div class="weekstrip">' + strip + '</div><div class="stack" style="gap:6px;margin-top:12px">'
    + act.map(function(id){ var dd = App.dailyDef(id); if (!dd) return ''; var on = !!(rec.q && (id in rec.q)), wid = App.dailyWay(dd), w = wid && App.way(wid);
        return '<button class="daily compact' + (on ? ' on' : '') + '" data-a="dailyToggle" data-id="' + id + '" aria-pressed="' + on + '"><span class="box">' + U.icon('check') + '</span><span class="t">' + U.esc(dd.n) + '</span><span class="rw">+' + dd.xp + ' XP' + (w ? ' · <span style="color:' + w.color + '">' + w.attr + '</span>' : '') + '</span></button>'; }).join('')
    + '</div><div class="row between" style="margin-top:10px"><span class="faint mono" style="font-size:11.5px">Descansos nesta semana: ' + E.restThisWeek(S, t) + '/2</span><button class="btn sm ghost" data-a="restDay">' + U.icon('moon') + (rec.rest ? 'Desfazer descanso' : 'Dia de descanso') + '</button></div></section>';
  var road = '<section class="win"><div class="win-h">' + U.icon('flag') + 'Marcos da chama</div><div class="road">'
    + SYS.STREAK_MS.map(function(m){ var got = D.bestStreak >= m, isNext = m === next, ft = U.flameTier(m), gr = {7:'Chave E', 30:'Chave D', 100:'Chave C + Gelo', 180:'Chave B', 365:'Chave A'}[m];
        return '<div class="rd' + (got ? ' got' : '') + (isNext ? ' next' : '') + '"><span class="rd-ic" style="--fc:' + ft.a + '">' + (got ? U.icon('flame') : U.icon('lock')) + '</span><b>' + m + '</b><span class="rd-l">' + (gr ? U.esc(gr) : '&nbsp;') + '</span>' + (isNext ? '<span class="rd-p">' + H.bar(U.pct(D.streak, m), 'thin') + '</span>' : '') + '</div>'; }).join('')
    + '</div>' + (next ? '<p class="faint mono" style="font-size:11.5px;margin-top:8px">Próximo marco: ' + next + ' dias · faltam ' + (next - D.streak) + '</p>' : '') + '</section>';
  var gold = '<section class="win"><div class="win-h" style="color:var(--hm-extra)">' + U.icon('sparkle') + 'Sequência dourada</div><p class="dim" style="font-size:13.5px">Dias extras seguidos: todas as diárias + pelo menos 1 missão extra. A lenda diz que 180 dias seguidos aceleram o tempo.</p>'
    + '<div class="row between mono" style="font-size:12px;margin-top:10px"><span>Made in Heaven</span><span>' + Math.min(D.bestExtraStreak, 180) + '/180</span></div>' + H.bar(U.pct(Math.min(D.bestExtraStreak, 180), 180), 'goldbar')
    + '<div class="row" style="gap:6px;margin-top:10px"><span class="chip">atual ' + D.extraStreak + '</span><span class="chip">melhor ' + D.bestExtraStreak + '</span><span class="chip">' + D.extraDays + ' dias extras no total</span><span class="chip">' + D.extrasTotal + ' extras feitas</span></div></section>';
  var ice = '<section class="win"><div class="win-h">' + U.icon('shield') + 'Proteção da chama</div><div class="stack" style="gap:8px"><div class="row between"><span><b>Gelo do Sistema</b><br><span class="dim" style="font-size:13px">Usado sozinho num dia perdido. Estoque ' + (S.owned.freezes || 0) + '/' + SYS.FREEZE_MAX + ' · usados: ' + D.freezesUsed + '</span></span><button class="btn sm" data-a="sysBuyOpen" data-k="up" data-id="up_freeze"' + ((S.owned.freezes || 0) >= SYS.FREEZE_MAX ? ' disabled' : '') + '>' + U.icon('gem') + '150 ◆</button></div>'
    + '<div class="row between"><span><b>Dia de descanso</b><br><span class="dim" style="font-size:13px">2 por semana, sem custo. Tickets extras: ' + (S.owned.tickets || 0) + '</span></span><a class="btn sm ghost" href="#/lojas/sistema">Loja ◆</a></div></div></section>';
  var cal = '<section class="win"><div class="win-h">' + U.icon('journal') + 'Calendário · 26 semanas</div>' + App.heatmap(26) + '</section>';
  return h + '<div class="grid g2" style="align-items:start"><div class="stack" style="gap:18px">' + today + App.extrasBlock() + '</div><div class="stack" style="gap:18px">' + road + gold + ice + '</div></div>' + cal;
};
