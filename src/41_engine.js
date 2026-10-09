/* ===== ENGINE v2: índices, economia, estado, derivação, travas, conquistas, sequência, baús, dungeons ===== */
var E = SYS.E = {};
E.round = function(v, s){ return Math.round(v / s) * s; };

E.build = function(){
  var NODE = {}, GATE = {}, ARC = {}, BOOKUSE = {}, DISC = {}, BOSSES = [];
  SYS.WAYS.forEach(function(w){
    w.brmap = {};
    (w.branches || []).forEach(function(b){ b.way = w.id; b.arcs = []; b.nodes = []; w.brmap[b.id] = b; });
    w.gates.forEach(function(g){ g.way = w.id; GATE[g.id] = g; });
    w.arcs.forEach(function(a){
      a.way = w.id; ARC[w.id + ':' + a.id] = a;
      a.gate = w.gates.filter(function(g){ return g.arc === a.id; })[0] || null;
      var b = a.br && w.brmap[a.br]; if (b) b.arcs.push(a);
      a.nodes.forEach(function(n){
        n.way = w.id; n.arc = a.id; n.br = b ? b.id : null; NODE[n.id] = n; if (b) b.nodes.push(n);
        (n.bk || []).forEach(function(x){ (BOOKUSE[x[0]] = BOOKUSE[x[0]] || []).push(n.id); });
        if (n.boss) BOSSES.push(n);
        if (n.d !== 'BOSS') { var k = w.id + '|' + n.d; (DISC[k] = DISC[k] || {way:w.id, d:n.d, nodes:[], arcs:{}}).nodes.push(n.id); DISC[k].arcs[a.id] = true; }
      });
    });
  });
  var prev = null;
  SYS.WAYMAP.architect.arcs.forEach(function(a){ if (a.side) return; if (prev && !a.needGate && prev.gate) a.needGate = prev.gate.id; prev = a; });
  E.NODE = NODE; E.GATE = GATE; E.ARC = ARC; E.BOOKUSE = BOOKUSE; E.DISC = DISC; E.BOSSES = BOSSES;
  E.econ();
  E.FEAT = {}; SYS.FEATS.forEach(function(f){ var rw = SYS.FEATREW[f.r] || SYS.FEATREW.common; if (f.xp == null) f.xp = rw[0]; if (f.cr == null) f.cr = rw[1]; E.FEAT[f.id] = f; });
  E.CTR = {}; SYS.COUNTERS.forEach(function(c){ E.CTR[c.id] = c; });
  E.EXTRA = {}; SYS.EXTRAS.forEach(function(x){ E.EXTRA[x.id] = x; });
  E.DUN = {}; SYS.DUNGEONS.forEach(function(d){ E.DUN[d.id] = d; });
  E.CHEST = {}; SYS.CHESTS.forEach(function(c){ E.CHEST[c.id] = c; });
  E.ACH = E.buildAch(); E.ACHMAP = {}; E.ACH.forEach(function(a){ E.ACHMAP[a.id] = a; });
  E.TITLES = E.buildTitles(); E.TITLEMAP = {}; E.TITLES.forEach(function(t){ E.TITLEMAP[t.id] = t; });
};
E.arcOf = function(n){ return E.ARC[n.way + ':' + n.arc]; };

/* Economia: totais por Caminho/vertente; tiers e preços automáticos quando não definidos à mão */
E.TIERFR = {5:[0,.1,.3,.55,.85], 6:[0,.07,.2,.4,.62,.88], 7:[0,.05,.14,.28,.46,.68,.9]};
E.SHOPFR = {common:{c:.012,x:0}, uncommon:{c:.03,x:.08}, rare:{c:.06,x:.2}, epic:{c:.1,x:.38}, legendary:{c:.16,x:.6}, mythic:{c:.24,x:.85}};
E.econ = function(){
  SYS.WAYS.forEach(function(w){
    var xp = 0, cr = 0, gx = 0;
    w.arcs.forEach(function(a){ a.nodes.forEach(function(n){ xp += n.xp; cr += n.cr; }); });
    w.gates.forEach(function(g){ gx += g.xp; });
    w.totXP = xp + gx; w.totCr = cr;
    (w.branches || []).forEach(function(b){
      var bx = 0, bc = 0;
      b.nodes.forEach(function(n){ bx += n.xp; bc += n.cr; });
      b.arcs.forEach(function(a){ if (a.gate) bx += a.gate.xp; });
      b.totXP = bx; b.totCr = bc;
      if (b.tierNames) { var fr = E.TIERFR[b.tierNames.length] || E.TIERFR[5]; b.tiers = b.tierNames.map(function(nm, i){ return [i ? Math.max(25, E.round(fr[i] * bx, 25)) : 0, nm]; }); }
    });
    if (w.tierNames) { var fw = E.TIERFR[w.tierNames.length] || E.TIERFR[6]; w.tiers = w.tierNames.map(function(nm, i){ return [i ? Math.max(50, E.round(fw[i] * w.totXP, 50)) : 0, nm]; }); }
    w.shop.forEach(function(it){
      var f = E.SHOPFR[it.tier] || E.SHOPFR.common;
      if (it.c == null) it.c = Math.max(10, E.round(f.c * w.totCr * (it.sz || 1), 5));
      if (it.br && w.brmap[it.br]) { if (it.bmx == null) it.bmx = E.round(f.x * w.brmap[it.br].totXP, 25); }
      else if (it.mx == null) it.mx = E.round(f.x * w.totXP, 50);
    });
  });
};

E.buildAch = function(){
  var L = [];
  SYS.WAYS.forEach(function(w){
    w.arcs.forEach(function(a){ a.nodes.forEach(function(n){
      if (!n.ach) return;
      var r = n.final ? 'legendary' : n.boss ? 'epic' : n.xp >= 60 ? 'rare' : n.xp >= 45 ? 'uncommon' : 'common';
      L.push({id:'n_'+n.id, n:n.ach, d:'Complete “'+n.t+'”.', r:r, cat:'node', way:w.id, br:n.br, ic:w.icon, node:n.id, cr:10, title:n.ach, ms:n.boss?1:0, final:n.final, c:function(D){ return !!D.nodeDone[n.id]; }});
    }); });
    w.gates.forEach(function(g){
      var meta = SYS.GATEACH[g.ach] || {n:g.n, title:null};
      var arc = w.arcs.filter(function(a){ return a.id === g.arc; })[0];
      var r = g.final ? 'legendary' : (arc && arc.side) ? 'epic' : g.xp >= 250 ? 'epic' : 'rare';
      L.push({id:g.ach, n:meta.n, d:'Conquiste “'+g.n+'”.', r:r, cat:'gate', way:w.id, br:arc && arc.br, ic:g.final?'crown':'gate', gate:g.id, cr:Math.round(g.xp*0.35), title:meta.title, ms:1, final:g.final, c:function(D){ return !!D.gateDone[g.id]; }});
    });
    (w.branches || []).forEach(function(b){
      L.push({id:'br_'+w.id+'_'+b.id, n:b.mt || ('Mestre: '+b.n), d:'Complete todos os '+b.nodes.length+' nós da vertente '+b.n+'.', r:'legendary', cat:'mastery', way:w.id, br:b.id, ic:b.ic || 'star', cr:40, title:b.mt || null, ms:1, c:function(D){ return b.nodes.length > 0 && ((D.brDone[w.id] || {})[b.id] || 0) >= b.nodes.length; }});
    });
  });
  Object.keys(E.DISC).forEach(function(k){
    var x = E.DISC[k]; if (x.nodes.length < 3) return;
    L.push({id:'m_'+U.slug(k), n:'Mestre: '+x.d, d:'Complete todos os '+x.nodes.length+' nós de “'+x.d+'”.', r:x.nodes.length >= 6 ? 'epic' : 'rare', cat:'mastery', way:x.way, ic:'star', cr:15, c:function(D){ return (D.discDone[k]||0) >= x.nodes.length; }});
  });
  SYS.CERTS.forEach(function(ct){
    L.push({id:'cert_'+ct.id, n:ct.n.split(' · ')[0].split(' (')[0]+' aprovado', d:'Aprovação registrada em '+ct.n+'.', r:ct.id === 'az305' ? 'legendary' : 'epic', cat:'cert', way:ct.way, ic:'cert', title:ct.title, ms:1, cr:0, c:function(D){ return !!D.certPassed[ct.id]; }});
  });
  SYS.FEATS.forEach(function(f){
    var w = SYS.WAYMAP[f.way];
    L.push({id:'ft_'+f.id, n:f.n, d:f.d, r:f.r, cat:'feat', way:f.way, br:f.br || null, ic:w ? w.icon : 'flag', title:f.title || null, cr:0, ms:SYS.RARITY_ORDER.indexOf(f.r) >= 2 ? 1 : 0, feat:f.id, c:function(D){ return !!D.featDone[f.id]; }});
  });
  SYS.DUNGEONS.forEach(function(dg){
    L.push({id:'dun_'+dg.id, n:dg.ach.n, d:'Limpe a dungeon Rank '+dg.rank+' “'+dg.n+'”.', r:dg.ach.r, cat:'dungeon', way:null, ic:'gate', title:dg.ach.title, ms:1, dun:dg.id, c:function(D){ return !!D.dunClearedIds[dg.id]; }});
  });
  SYS.SYSACH.forEach(function(s){
    L.push({id:s.id, n:s.n, d:s.d, r:s.r, cat:s.secret ? 'secret' : 'system', secret:s.secret, ic:s.ic, ms:s.ms, way:null, title:s.title || null, grant:s.grant || null, c:s.c});
  });
  return L;
};

E.TSRC = {node:'Conquista', gate:'Selo', cert:'Certificação', feat:'Feito', mastery:'Maestria', dungeon:'Dungeon', system:'Sistema', secret:'Segredo'};
E.buildTitles = function(){
  var T = [], seen = {};
  function add(t){ var key = t.n.toLowerCase(); if (seen[key]) { var o = seen[key]; if (SYS.RARITY_ORDER.indexOf(t.r) > SYS.RARITY_ORDER.indexOf(o.r)) o.r = t.r; o.alt = (o.alt || []).concat([t]); return; } seen[key] = t; T.push(t); }
  E.ACH.forEach(function(a){ if (a.title) add({id:'t_'+a.id, n:a.title, r:a.r, src:E.TSRC[a.cat] || 'Conquista', way:a.way, br:a.br || null, ach:a.id}); });
  SYS.WAYS.forEach(function(w){
    w.tiers.forEach(function(t, i){ add({id:'tier_'+w.id+'_'+i, n:t[1], r:SYS.RARITY_ORDER[Math.min(5, i)], src:'Nível · '+w.pt, way:w.id, xp:t[0]}); });
    (w.branches || []).forEach(function(b){ (b.tiers || []).forEach(function(t, i){ add({id:'btier_'+w.id+'_'+b.id+'_'+i, n:t[1], r:SYS.RARITY_ORDER[Math.min(5, i)], src:'Vertente · '+b.n, way:w.id, br:b.id, bxp:t[0]}); }); });
  });
  SYS.GRANKS.forEach(function(g, i){ add({id:'rank_'+i, n:g[1], r:SYS.RARITY_ORDER[Math.min(5, Math.round(i*5/(SYS.GRANKS.length-1)))], src:'Rank global', gxp:g[0]}); });
  return T;
};

E.newState = function(){
  var t = U.today();
  return {
    v:2, _u:'', createdAt:new Date().toISOString(), start:t, lastSeen:t,
    profile:{name:'', sig:'Ainda renderizando.', avatar:'sigil', emoji:'🗡️', title:null, namecard:'nc_window', frame:'fr_basic', fx:null, showcase:[]},
    settings:{skin:'sk_system', openWorld:false, readWay:'flaneur', dailies:SYS.DAILIES.filter(function(d){return d.def;}).map(function(d){return d.id;}), season:{focus:['architect','ars'], fixed:['aesthetic','founder','mind'], main:'architect', a:'ars', b:'aesthetic', start:t}, motion:true, resetHour:SYS.RESET_HOUR, extrasPin:[]},
    nodes:{}, gates:{}, books:{}, ach:{}, buys:[], pending:[], sysbuys:[],
    owned:{skins:[], namecards:[], frames:[], fx:[], tickets:0, custom:false, freezes:0, keys:{E:0, D:0, C:0, B:0, A:0, S:0}, showcase12:false},
    inv:{pos:[], snaps:[], alloc:{cx:10, rf:40, rv:45, alt:5}, cost:0, upd:''},
    mesa:{cap:0, teto:0, ini:'', fim:'', lock:'', ops:[], cycles:0}, term:{m:{}, log:[]},
    hyp:{on:null, done:[], fila:[]},
    daily:{}, dstats:{best:0, bestExtra:0, arch:null}, certs:{}, goals:[], milestones:[], sideq:[], lvlog:[],
    feats:{}, ctr:{}, chests:{n:0, pity:{}, log:[], lucky:false, gemBack:0}, dun:null, dunLog:[], streakLost:null, tracks:{}, tk:{}, offs:[],
    exams:{passes:0, best:0, total:0, alem:0, phoenix:0}, flags:{three:false, logo:false, konami:false, returned:0, odds:false, clutch:false, fzDay:''}, stats:{cdDone:0, cdCancel:0, freezesUsed:0, repairsUsed:0, focusSwaps:0, trackSwaps:0}, customTitle:''
  };
};
E.newJournal = function(){ return {_u:'', weeks:{}, months:{}, open:[]}; };
E.newNotes = function(){ return {_u:'', n:{}, b:{}}; };
E.fill = function(target, defaults){
  Object.keys(defaults).forEach(function(k){
    if (target[k] === undefined || target[k] === null && defaults[k] !== null) target[k] = JSON.parse(JSON.stringify(defaults[k]));
    else if (defaults[k] && typeof defaults[k] === 'object' && !Array.isArray(defaults[k]) && typeof target[k] === 'object' && !Array.isArray(target[k])) E.fill(target[k], defaults[k]);
  });
  return target;
};

/* ---------- Caminhos principais (1 a 3, livres) ---------- */
E.fixedWays = function(S){
  var ss = (S.settings || {}).season || {}, list = (ss.fixed || []).filter(function(id){ return SYS.WAYMAP[id]; });
  return list;
};
E.focusWays = function(S){
  var ss = (S.settings || {}).season || {}, fx = E.fixedWays(S);
  var list = (ss.focus || []).filter(function(id){ return SYS.WAYMAP[id] && fx.indexOf(id) < 0; });
  if (!list.length) { var free = SYS.WAYS.filter(function(w){ return fx.indexOf(w.id) < 0; }); list = free.length ? [free[0].id] : [SYS.WAYS[0].id]; }
  return list.slice(0, 3);
};
E.mainWay = function(S){ return E.focusWays(S)[0]; };
E.setFocus = function(S, list){
  var seen = {}, fx = E.fixedWays(S);
  var f = list.filter(function(id){ if (!SYS.WAYMAP[id] || seen[id] || fx.indexOf(id) >= 0) return false; seen[id] = 1; return true; }).slice(0, 3);
  if (!f.length) return false;
  var ss = S.settings.season; ss.focus = f; ss.main = f[0]; ss.a = f[1] || f[0]; ss.b = f[2] || f[1] || f[0];
  return true;
};
E.setFixed = function(S, list){
  var seen = {}, ss = S.settings.season;
  ss.fixed = list.filter(function(id){ if (!SYS.WAYMAP[id] || seen[id]) return false; seen[id] = 1; return true; });
  var rest = (ss.focus || []).filter(function(id){ return ss.fixed.indexOf(id) < 0 && SYS.WAYMAP[id]; });
  if (!rest.length) { var free = SYS.WAYS.filter(function(w){ return ss.fixed.indexOf(w.id) < 0; }); rest = free.length ? [free[0].id] : []; }
  if (rest.length) E.setFocus(S, rest);
  return true;
};
E.migrate = function(S){
  var ss = S.settings && S.settings.season; if (!ss) return S;
  if (!ss._m2) {
    var old = [ss.main, ss.a, ss.b].filter(function(id, i, arr){ return id && SYS.WAYMAP[id] && arr.indexOf(id) === i; });
    if (!old.length) old = (Array.isArray(ss.focus) ? ss.focus : []).filter(function(id){ return SYS.WAYMAP[id]; });
    ss.focus = (old.length ? old : ['architect']).slice(0, 3);
    ss._m2 = 1;
  }
  if (!ss._m3) {
    if (!Array.isArray(ss.fixed)) ss.fixed = ['aesthetic','founder','mind'];
    ss.focus = (Array.isArray(ss.focus) ? ss.focus : []).filter(function(id){ return SYS.WAYMAP[id] && ss.fixed.indexOf(id) < 0; });
    ss._m3 = 1;
  }
  if (!Array.isArray(ss.fixed)) ss.fixed = [];
  if (!Array.isArray(ss.focus) || !ss.focus.length) { var free0 = SYS.WAYS.filter(function(w){ return ss.fixed.indexOf(w.id) < 0; }); ss.focus = [free0.length ? free0[0].id : SYS.WAYS[0].id]; }
  ss.main = ss.focus[0]; ss.a = ss.focus[1] || ss.focus[0]; ss.b = ss.focus[2] || ss.focus[1] || ss.focus[0];
  return S;
};

E.levelOf = function(xp){ var L = 1; while (L < SYS.MAXLVL && SYS.xpNeed(L+1) <= xp) L++; return L; };
E.letterOf = function(L){ var r = 'E'; SYS.LETTERS.forEach(function(x){ if (L >= x[0]) r = x[1]; }); return r; };
E.grankOf = function(xp){ var r = SYS.GRANKS[0], idx = 0; SYS.GRANKS.forEach(function(g, i){ if (xp >= g[0]) { r = g; idx = i; } }); return {n:r[1], i:idx, next:SYS.GRANKS[idx+1] || null}; };
E.tierOf = function(tiers, xp){ var idx = 0; tiers.forEach(function(t, i){ if (xp >= t[0]) idx = i; }); return {i:idx, n:tiers[idx][1], next:tiers[idx+1] || null, floor:tiers[idx][0]}; };

/* ---------- diárias, extras, sequência ---------- */
E.qCount = function(r){ return Object.keys(r.q || {}).filter(function(k){ return !(r.gx && k === 'grass'); }).length; };
E.dayComplete = function(r){ if (!r) return false; if (r.rest || r.frozen) return true; return r.need > 0 && E.qCount(r) >= r.need; };
E.xCount = function(r){ return r && r.x ? Object.keys(r.x).length : 0; };
E.extraDay = function(r){ return !!r && !r.frozen && E.dayComplete(r) && E.xCount(r) >= 1; };
E.runs = function(S, okFn){
  var days = S.daily, t = U.today(), cur = 0, d = okFn(days[t]) ? t : U.addDays(t, -1);
  while (okFn(days[d])) { cur++; d = U.addDays(d, -1); }
  var keys = Object.keys(days).sort(), best = 0, run = 0, prev = null;
  keys.forEach(function(k){ if (!okFn(days[k])) { run = 0; prev = k; return; } run = (prev && run > 0 && U.daysBetween(prev, k) === 1) ? run + 1 : 1; if (run > best) best = run; prev = k; });
  return {cur:cur, best:Math.max(best, cur)};
};
E.streak = function(S){ return E.runs(S, E.dayComplete); };
E.extraStreak = function(S){ return E.runs(S, E.extraDay); };
E.restThisWeek = function(S, day){ var wk = U.weekKey(day); return Object.keys(S.daily).filter(function(k){ return S.daily[k].rest && U.weekKey(k) === wk && k !== day; }).length; };

E.ownsCosmetic = function(S, list, id, kind){
  var it = list.filter(function(x){ return x.id === id; })[0]; if (!it) return false;
  if (it.free) return true; if (it.ach && S.ach[it.ach]) return true;
  return (S.owned[kind] || []).indexOf(id) >= 0;
};
E.ctrTotal = function(S, id){ var c = S.ctr[id]; return c ? (c.t || 0) : 0; };
E.featDone = function(S, f){ if (f.ctr) return E.ctrTotal(S, f.ctr) >= (f.goal || 1); var r = S.feats[f.id]; return !!(r && r.d); };

E.derive = function(S, J){
  var D = {wayXP:{}, crEarn:{}, crSpent:{}, wayCr:{}, seals:{}, sealsSpent:{}, wayNodes:{}, wayDone:{}, wayGatesDone:{}, nodeDone:{}, gateDone:{}, discDone:{}, certPassed:{}, flags:S.flags, dailyXP:{}, brXP:{}, brDone:{}, featDone:{}, ctr:{}, dunClearedIds:{}};
  var gem = 0, sysXP = 0;
  SYS.WAYS.forEach(function(w){ D.wayXP[w.id]=0; D.crEarn[w.id]=0; D.crSpent[w.id]=0; D.seals[w.id]=0; D.sealsSpent[w.id]=0; D.wayNodes[w.id]=0; D.wayDone[w.id]=0; D.wayGatesDone[w.id]=0; D.brXP[w.id]={}; D.brDone[w.id]={}; (w.branches||[]).forEach(function(b){ D.brXP[w.id][b.id]=0; D.brDone[w.id][b.id]=0; }); });
  var nodesDone = 0, bossesDone = 0, weekWays = {}, fri13 = false;
  Object.keys(E.NODE).forEach(function(id){
    var n = E.NODE[id]; D.wayNodes[n.way]++;
    var st = S.nodes[id];
    if (st && st.s === 'done') {
      D.nodeDone[id] = true; nodesDone++; D.wayDone[n.way]++; D.wayXP[n.way] += n.xp; D.crEarn[n.way] += n.cr;
      if (n.br) { D.brXP[n.way][n.br] += n.xp; D.brDone[n.way][n.br]++; }
      if (n.boss) { bossesDone++; if (st.d1) { var dd = U.parse(st.d1); if (dd.getDate() === 13 && dd.getDay() === 5) fri13 = true; } }
      if (n.d !== 'BOSS') { var k = n.way+'|'+n.d; D.discDone[k] = (D.discDone[k]||0) + 1; }
      if (st.d1) { var wk = U.weekKey(st.d1); (weekWays[wk] = weekWays[wk] || {})[n.way] = 1; }
    }
  });
  D.renasc = Object.keys(weekWays).some(function(k){ return Object.keys(weekWays[k]).length >= SYS.WAYS.length; });
  D.fri13 = fri13;
  var gatesDone = 0, finals = 0;
  Object.keys(E.GATE).forEach(function(id){ var g = E.GATE[id]; if (S.gates[id] && S.gates[id].done) { D.gateDone[id] = true; gatesDone++; D.wayGatesDone[g.way]++; D.wayXP[g.way] += g.xp; D.seals[g.way]++; if (g.final) finals++; var a = E.ARC[g.way+':'+g.arc]; if (a && a.br) D.brXP[g.way][a.br] += g.xp; } });
  var booksRead = 0;
  Object.keys(S.books).forEach(function(k){ var b = S.books[k], L = SYS.LIB[k]; if (L && b.s === 'read' && b.ap) { booksRead++; if (D.wayXP[L.w] != null) { D.wayXP[L.w] += 25; D.crEarn[L.w] += 8; } } });
  var dailyDays = 0, restDays = 0, touch = 0, extrasTotal = 0, extraDays = 0, DMAP = {};
  SYS.DAILIES.forEach(function(d){ DMAP[d.id] = d; });
  Object.keys(S.daily).forEach(function(day){
    var r = S.daily[day], q = r.q || {};
    Object.keys(q).forEach(function(id){ var def = DMAP[id]; if (!def) return; var w = q[id];
      if (w && D.wayXP[w] != null) { D.wayXP[w] += def.xp; D.crEarn[w] += def.cr; D.dailyXP[w] = (D.dailyXP[w]||0) + def.xp; } else { sysXP += def.xp; }
      if (def.gem) gem += def.gem; if (id === 'grass') touch++; });
    var xs = Object.keys(r.x || {}).slice(0, SYS.EXTRA_CAP);
    xs.forEach(function(xid){ var x = E.EXTRA[xid]; if (!x) return; extrasTotal++; gem += 1; if (x.way && D.wayXP[x.way] != null) D.wayXP[x.way] += 2; else sysXP += 2; });
    if (r.rest) restDays++;
    if (E.dayComplete(r) && !r.frozen) { dailyDays++; if (!r.rest) gem += 10; }
    if (E.extraDay(r)) { extraDays++; gem += 3; }
  });
  var ar = S.dstats.arch;
  if (ar) { dailyDays += ar.days||0; restDays += ar.rest||0; touch += ar.touch||0; gem += ar.gem||0; sysXP += ar.sysxp||0; extrasTotal += ar.extras||0; extraDays += ar.xdays||0; Object.keys(ar.xp||{}).forEach(function(w){ if (D.wayXP[w] != null) D.wayXP[w] += ar.xp[w]; }); Object.keys(ar.cr||{}).forEach(function(w){ if (D.crEarn[w] != null) D.crEarn[w] += ar.cr[w]; }); }
  S.sideq.forEach(function(q){ if (q.done && D.wayXP[q.way] != null) { D.wayXP[q.way] += q.xp; D.crEarn[q.way] += Math.round(q.xp/5); } });
  var offWays = {}, offCount = 0;
  (S.offs || []).forEach(function(o){ if (!o || !o.n) return; offCount++; if (D.wayXP[o.way] != null) { D.wayXP[o.way] += SYS.OFF_XP; D.crEarn[o.way] += SYS.OFF_CR; offWays[o.way] = 1; } });
  D.offCount = offCount; D.offWays = Object.keys(offWays).length;
  var trk = S.tracks || {}; D.tracksChosen = (SYS.CHOICE_ORDER || []).filter(function(k){ var c = SYS.CHOICES[k]; return trk[k] && c.opts.some(function(o){ return o.id === trk[k]; }); }).length;
  D.tracksTotal = (SYS.CHOICE_ORDER || []).length; D.trackSwaps = (S.stats && S.stats.trackSwaps) || 0;
  var tkc = 0; Object.keys(S.tk || {}).forEach(function(id){ if (E.NODE[id]) tkc += (S.tk[id] || []).length; }); D.tkCount = tkc;
  var certsPassed = 0;
  SYS.CERTS.forEach(function(c){ var st = S.certs[c.id]; if (st && st.s === 'passed') { certsPassed++; D.certPassed[c.id] = true; D.wayXP[c.way] += c.xp; D.crEarn[c.way] += 40; } });
  SYS.COUNTERS.forEach(function(c){ D.ctr[c.id] = E.ctrTotal(S, c.id); });
  var featsDone = 0;
  SYS.FEATS.forEach(function(f){ if (!E.featDone(S, f)) return; D.featDone[f.id] = true; featsDone++; if (D.wayXP[f.way] != null) { D.wayXP[f.way] += f.xp; D.crEarn[f.way] += f.cr; if (f.br && D.brXP[f.way][f.br] != null) D.brXP[f.way][f.br] += f.xp; } });
  var weeksCleared = 0, monthsDone = 0, openDone = 0;
  if (J) {
    Object.keys(J.weeks || {}).forEach(function(k){ var w = J.weeks[k]; if (w.cleared) { weeksCleared++; gem += 50; sysXP += 30; } if (w.grass) touch++; });
    Object.keys(J.months || {}).forEach(function(k){ if (J.months[k].done) { monthsDone++; gem += 100; sysXP += 60; } });
    (J.open || []).forEach(function(o){ if (o.status === 'done') { openDone++; if (D.wayXP[o.way] != null) D.wayXP[o.way] += 40; } });
  }
  var goalsDone = S.goals.filter(function(g){ return g.done; }).length; gem += goalsDone * 30;
  var dunCleared = 0, dunS = 0, sawFail = false, comeback = false;
  (S.dunLog || []).forEach(function(l){ var dg = E.DUN[l.id]; if (!dg) return; if (l.st === 'cleared') { dunCleared++; D.dunClearedIds[l.id] = true; if (dg.rank === 'S') dunS++; gem += dg.rew.gem || 0; if (sawFail) comeback = true; } else if (l.st === 'failed') sawFail = true; });
  gem += (S.chests && S.chests.gemBack) || 0;
  var achCount = 0;
  Object.keys(S.ach).forEach(function(id){ var a = E.ACHMAP[id]; if (!a) return; achCount++; if (a.way && a.cr && D.crEarn[a.way] != null) D.crEarn[a.way] += a.cr; if (a.cat === 'system' || a.cat === 'secret') gem += SYS.RARITY[a.r].gem; });
  S.buys.forEach(function(b){ if (D.crSpent[b.way] != null) D.crSpent[b.way] += b.c; if (b.seals) D.sealsSpent[b.way] += b.seals; });
  var gemSpent = S.sysbuys.reduce(function(s, b){ return s + b.c; }, 0);
  SYS.WAYS.forEach(function(w){ D.wayCr[w.id] = D.crEarn[w.id] - D.crSpent[w.id]; D.seals[w.id] -= D.sealsSpent[w.id]; });
  D.gem = gem - gemSpent; D.gemEarned = gem; D.sysXP = sysXP;
  D.xp = sysXP + SYS.WAYS.reduce(function(s, w){ return s + D.wayXP[w.id]; }, 0);
  D.level = E.levelOf(D.xp); D.letter = E.letterOf(D.level);
  D.lvFloor = SYS.xpNeed(D.level); D.lvNext = D.level >= SYS.MAXLVL ? D.lvFloor : SYS.xpNeed(D.level + 1);
  D.grank = E.grankOf(D.xp);
  D.tier = {}; D.brTier = {}; D.attr = {}; var t3 = 0, t4 = 0, mastered = 0;
  SYS.WAYS.forEach(function(w){
    var ti = E.tierOf(w.tiers, D.wayXP[w.id]); D.tier[w.id] = ti; if (ti.i >= 2) t3++; if (ti.i >= 3) t4++;
    D.attr[w.id] = 10 + Math.floor(D.wayXP[w.id] / 40);
    D.brTier[w.id] = {};
    (w.branches || []).forEach(function(b){ D.brTier[w.id][b.id] = E.tierOf(b.tiers, D.brXP[w.id][b.id]); if (b.nodes.length && D.brDone[w.id][b.id] >= b.nodes.length) mastered++; });
  });
  var st = E.streak(S), xs2 = E.extraStreak(S);
  D.streak = st.cur; D.bestStreak = Math.max(st.best, S.dstats.best || 0);
  D.extraStreak = xs2.cur; D.bestExtraStreak = Math.max(xs2.best, S.dstats.bestExtra || 0);
  D.extrasTotal = extrasTotal; D.extraDays = extraDays;
  D.nodesDone = nodesDone; D.nodesTotal = Object.keys(E.NODE).length; D.bossesDone = bossesDone; D.bossesTotal = E.BOSSES.length;
  D.gatesDone = gatesDone; D.gatesTotal = Object.keys(E.GATE).length; D.finalsDone = finals;
  D.booksRead = booksRead; D.dailyDays = dailyDays; D.restDays = restDays; D.touchGrass = touch;
  D.weeksCleared = weeksCleared; D.monthsDone = monthsDone; D.openDone = openDone; D.goalsDone = goalsDone; D.certsPassed = certsPassed; D.achCount = achCount;
  D.examPasses = S.exams.passes || 0; D.examBest = S.exams.best || 0; D.examTotal = S.exams.total || 0; D.examAlem = S.exams.alem || 0; D.examPhoenix = S.exams.phoenix || 0;
  D.focusSwaps = (S.stats && S.stats.focusSwaps) || 0;
  D.buysCount = S.buys.length + S.sysbuys.length; D.cooldownDone = S.stats.cdDone || 0; D.cooldownCanceled = S.stats.cdCancel || 0;
  D.freezesUsed = S.stats.freezesUsed || 0; D.repairsUsed = S.stats.repairsUsed || 0;
  D.chestsOpened = (S.chests && S.chests.n) || 0; D.luckyDrop = !!(S.chests && S.chests.lucky);
  D.dunCleared = dunCleared; D.dunClearedS = dunS; D.dunComeback = comeback;
  D.featsDone = featsDone; D.branchesMastered = mastered;
  D.returned = S.flags.returned || 0; D.waysTier3 = t3; D.waysTier4 = t4;
  D.profileDone = !!(S.profile.name && S.profile.title && S.profile.showcase.length >= 3);
  D.allSkins = SYS.SKINS.every(function(sk){ return E.ownsCosmetic(S, SYS.SKINS, sk.id, 'skins'); });
  var mz = S.mesa || {}, mops = mz.ops || [];
  D.mesaOps = mops.length; D.mesaBroke = mops.filter(function(o){ return o.regra === false; }).length;
  D.mesaNet = mops.reduce(function(s, o){ return s + (+o.res || 0); }, 0);
  D.mesaCycles = mz.cycles || 0; D.mesaLocked = !!(mz.lock && mz.lock > U.today()); D.mesaCap = +mz.cap || 0;
  D.termMonths = D.ctr.terminal || 0; D.decisoesLog = D.ctr.decisoes || 0; D.tesesFeitas = D.ctr.teses || 0;

  /* v11 · Temporada de Hiperfoco (sem sequencia, sem diaria: so ciclo com data) */
  var hz = S.hyp || {}, hon = hz.on || null;
  D.hipOn = hon; D.hipAberta = hon ? 1 : 0; D.hipFila = (hz.fila || []).length; D.hipFeitas = (hz.done || []).length;
  D.hipLog = hon ? (hon.log || []).length : 0;
  D.hipDias = hon && hon.fim ? U.daysBetween(U.today(), hon.fim) : null;
  D.hipVenceu = !!(hon && hon.fim && hon.fim < U.today());
  D.revisoesCt = D.ctr.revisoes || 0; D.sessoesAlvoCt = D.ctr.sessoesAlvo || 0; D.temporadasJogoCt = D.ctr.temporadasJogo || 0;
  D.pbRitmoCt = D.ctr.pbRitmo || 0; D.hipTempCt = D.ctr.hipTemp || 0; D.artefatosCt = D.ctr.artefatos || 0;
  return D;
};

E.arcLocked = function(S, a){ if (S.settings.openWorld || !a.needGate) return false; return !(S.gates[a.needGate] && S.gates[a.needGate].done); };
E.reqOk = function(S, n){ if (S.settings.openWorld) return true; return !(n.req || []).some(function(g){ return !(S.gates[g] && S.gates[g].done); }); };
E.gateReady = function(S, g){ var a = E.ARC[g.way + ':' + g.arc]; return a.nodes.every(function(n){ return S.nodes[n.id] && S.nodes[n.id].s === 'done'; }); };
E.gateProgress = function(S, g){ var a = E.ARC[g.way + ':' + g.arc]; var d = a.nodes.filter(function(n){ return S.nodes[n.id] && S.nodes[n.id].s === 'done'; }).length; return {done:d, total:a.nodes.length}; };
E.nextNode = function(S, wayId, br){
  var w = SYS.WAYMAP[wayId], doing = null, first = null, side = null;
  w.arcs.forEach(function(a){
    if (br && a.br !== br) return;
    if (E.arcLocked(S, a)) return;
    a.nodes.forEach(function(n){
      var st = S.nodes[n.id]; if (st && st.s === 'done') return;
      if (!E.reqOk(S, n)) return;
      if (!doing && st && (st.s === 'doing' || st.s === 'review')) doing = n;
      if (a.side) { if (!side) side = n; } else if (!first) first = n;
    });
  });
  return doing || first || side;
};
E.discLevels = function(S, D, wayId, br){
  return Object.keys(E.DISC).map(function(k){ return E.DISC[k]; }).filter(function(x){ return x.way === wayId && (!br || x.nodes.some(function(id){ return E.NODE[id].br === br; })); }).map(function(x){
    var k = x.way + '|' + x.d, done = D.discDone[k] || 0, tot = x.nodes.length, lv;
    if (!done) lv = 0; else if (done === tot) { lv = Object.keys(x.arcs).every(function(aid){ var a = E.ARC[x.way+':'+aid]; return !a.gate || (S.gates[a.gate.id] && S.gates[a.gate.id].done); }) ? 5 : 4; }
    else lv = done/tot >= 0.7 ? 3 : done/tot >= 0.4 ? 2 : 1;
    return {d:x.d, done:done, tot:tot, lv:lv};
  });
};
E.titleUnlocked = function(S, D, t){
  if (!t) return false;
  if (t.alt && t.alt.some(function(x){ return E.titleUnlocked(S, D, x); })) return true;
  if (t.ach) return !!S.ach[t.ach];
  if (t.bxp != null) return ((D.brXP[t.way] || {})[t.br] || 0) >= t.bxp;
  if (t.xp != null) return D.wayXP[t.way] >= t.xp;
  if (t.gxp != null) return D.xp >= t.gxp;
  return false;
};
E.applyGrant = function(S, g){
  if (!g) return;
  Object.keys(g.keys || {}).forEach(function(r){ S.owned.keys[r] = (S.owned.keys[r] || 0) + g.keys[r]; });
  if (g.freeze) { var room = SYS.FREEZE_MAX - (S.owned.freezes || 0), add = Math.max(0, Math.min(room, g.freeze)); S.owned.freezes = (S.owned.freezes || 0) + add; if (g.freeze > add) S.chests.gemBack += 60 * (g.freeze - add); }
};
E.checkAch = function(S, J){
  var out = [];
  for (var pass = 0; pass < 4; pass++) {
    var D = E.derive(S, J), any = false;
    E.ACH.forEach(function(a){ if (S.ach[a.id]) return; var ok = false; try { ok = a.c(D); } catch(e){ ok = false; } if (ok) { S.ach[a.id] = new Date().toISOString(); if (a.grant) E.applyGrant(S, a.grant); out.push(a); any = true; } });
    if (!any) break;
  }
  return out;
};
E.reqMet = function(S, D, req){ if (S.ach[req]) return true; if (req.slice(0,2) === 'n_') return !!D.nodeDone[req.slice(2)]; return false; };
E.reqLabel = function(req){ var a = E.ACHMAP[req]; if (a) return 'Conquista: ' + a.n; if (req.slice(0,2) === 'n_' && E.NODE[req.slice(2)]) return 'Quest: ' + req.slice(2) + ' · ' + E.NODE[req.slice(2)].t; return req; };
E.itemState = function(S, D, wayId, it){
  var reasons = [], w = SYS.WAYMAP[wayId];
  var bought = S.buys.filter(function(b){ return b.id === it.id; });
  if (!it.rep && bought.length) return {st:'owned', reasons:[]};
  if (it.rep && it.lim && bought.length) {
    var last = bought[bought.length-1].d, now = U.today();
    var same = it.lim === 'semana' ? U.weekKey(last) === U.weekKey(now) : U.monthKey(last) === U.monthKey(now);
    if (same) return {st:'limit', reasons:['Já resgatado nesta ' + it.lim]};
  }
  if (it.br && w.brmap[it.br]) { if (((D.brXP[wayId] || {})[it.br] || 0) < (it.bmx || 0)) reasons.push('XP em ' + w.brmap[it.br].n + ' ≥ ' + U.num(it.bmx)); }
  else if ((D.wayXP[wayId]||0) < (it.mx||0)) reasons.push('XP do Caminho ≥ ' + U.num(it.mx));
  if (it.req && !E.reqMet(S, D, it.req)) reasons.push(E.reqLabel(it.req));
  if (it.seals && D.seals[wayId] < it.seals) reasons.push(it.seals + ' Selos do Caminho');
  var pend = S.pending.filter(function(p){ return p.id === it.id; })[0];
  if (pend) return {st: Date.now() >= Date.parse(pend.until) ? 'ready' : 'cooldown', reasons:reasons, pend:pend, poor:D.wayCr[wayId] < it.c};
  if (D.wayCr[wayId] < it.c) reasons.push('Faltam ' + U.num(it.c - D.wayCr[wayId]) + ' ' + w.cur.code);
  return {st: reasons.length ? 'locked' : 'available', reasons:reasons};
};
E.pruneDaily = function(S){
  var keys = Object.keys(S.daily).sort(); if (keys.length <= 400) return;
  var cut = keys.slice(0, keys.length - 400), ar = S.dstats.arch || {days:0, rest:0, touch:0, gem:0, sysxp:0, xp:{}, cr:{}, extras:0, xdays:0};
  S.dstats.best = Math.max(S.dstats.best || 0, E.streak(S).best); S.dstats.bestExtra = Math.max(S.dstats.bestExtra || 0, E.extraStreak(S).best);
  cut.forEach(function(day){
    var r = S.daily[day], q = r.q || {};
    Object.keys(q).forEach(function(id){ var def = SYS.DAILIES.filter(function(d){ return d.id === id; })[0]; if (!def) return; var w = q[id];
      if (w) { ar.xp[w] = (ar.xp[w]||0) + def.xp; ar.cr[w] = (ar.cr[w]||0) + def.cr; } else ar.sysxp += def.xp;
      if (def.gem) ar.gem += def.gem; if (id === 'grass') ar.touch++; });
    Object.keys(r.x || {}).slice(0, SYS.EXTRA_CAP).forEach(function(xid){ var x = E.EXTRA[xid]; if (!x) return; ar.extras = (ar.extras||0) + 1; ar.gem += 1; if (x.way) ar.xp[x.way] = (ar.xp[x.way]||0) + 2; else ar.sysxp += 2; });
    if (r.rest) ar.rest++; if (E.dayComplete(r) && !r.frozen) { ar.days++; if (!r.rest) ar.gem += 10; } if (E.extraDay(r)) { ar.xdays = (ar.xdays||0) + 1; ar.gem += 3; }
    delete S.daily[day];
  });
  S.dstats.arch = ar;
};

/* ---------- gelo & runa ---------- */
E.freezeCheck = function(S){
  var t = U.today(), res = {used:0, lost:null};
  if (S.flags.fzDay === t) return res;
  S.flags.fzDay = t;
  var y = U.addDays(t, -1);
  if (E.dayComplete(S.daily[y])) return res;
  var gap = [y], d = U.addDays(y, -1), guard = 0;
  while (!E.dayComplete(S.daily[d]) && guard < 45) { gap.push(d); d = U.addDays(d, -1); guard++; }
  if (guard >= 45) return res;
  var len = 0, k = d; while (E.dayComplete(S.daily[k])) { len++; k = U.addDays(k, -1); }
  if (!len) return res;
  if (gap.length <= (S.owned.freezes || 0)) {
    gap.forEach(function(g){ var r = S.daily[g] || (S.daily[g] = {q:{}, need:S.settings.dailies.length}); r.frozen = true; });
    S.owned.freezes -= gap.length; S.stats.freezesUsed = (S.stats.freezesUsed || 0) + gap.length; res.used = gap.length; S.streakLost = null;
  } else {
    S.dstats.best = Math.max(S.dstats.best || 0, len);
    S.streakLost = {len:len, gap:gap.slice(0, 10), at:t}; res.lost = S.streakLost;
  }
  return res;
};
E.repairable = function(S){ var L = S.streakLost; return !!(L && L.gap && L.gap.length <= 3 && U.daysBetween(L.at, U.today()) <= 3); };
E.repair = function(S){
  if (!E.repairable(S)) return false;
  S.streakLost.gap.forEach(function(g){ var r = S.daily[g] || (S.daily[g] = {q:{}, need:S.settings.dailies.length}); r.frozen = true; r.rep = true; });
  S.stats.repairsUsed = (S.stats.repairsUsed || 0) + 1; S.streakLost = null; return true;
};

/* ---------- baús ---------- */
E.cosList = function(kind){ return kind === 'namecards' ? SYS.NAMECARDS : kind === 'frames' ? SYS.FRAMES : SYS.FX; };
E.cosName = function(kind, id){ var it = E.cosList(kind).filter(function(x){ return x.id === id; })[0]; return it ? it.n : id; };
E.ownsAny = function(S, kind, id){ if (kind === 'fx') return (S.owned.fx || []).indexOf(id) >= 0; return E.ownsCosmetic(S, E.cosList(kind), id, kind); };
E.openChest = function(S, id){
  var ch = E.CHEST[id], C = S.chests; if (!ch) return null;
  C.n = (C.n || 0) + 1; C.pity[id] = (C.pity[id] || 0) + 1;
  var spec = null, pity = false;
  if (ch.pity && C.pity[id] >= ch.pity.n) { spec = {k:'cos', pool:ch.pity.pool}; pity = true; }
  else { var tot = ch.drops.reduce(function(s, x){ return s + x[0]; }, 0), roll = U.rand() * tot; for (var i = 0; i < ch.drops.length; i++) { roll -= ch.drops[i][0]; if (roll < 0) { spec = ch.drops[i][1]; break; } } if (!spec) spec = ch.drops[ch.drops.length - 1][1]; }
  var res = {chest:id, k:spec.k, pity:pity, d:U.today()};
  if (spec.k === 'gem') { C.gemBack += spec.v; res.v = spec.v; }
  else if (spec.k === 'ticket') { S.owned.tickets = (S.owned.tickets || 0) + spec.v; res.v = spec.v; }
  else if (spec.k === 'freeze') { var room = SYS.FREEZE_MAX - (S.owned.freezes || 0), add = Math.max(0, Math.min(room, spec.v)); S.owned.freezes = (S.owned.freezes || 0) + add; res.v = add; if (spec.v > add) { res.conv = 60 * (spec.v - add); C.gemBack += res.conv; } }
  else if (spec.k === 'key') { S.owned.keys[spec.rank] = (S.owned.keys[spec.rank] || 0) + 1; res.rank = spec.rank; }
  else if (spec.k === 'cos') {
    var pool = SYS.CHESTCOS[spec.pool] || [], fresh = pool.filter(function(p){ return !E.ownsAny(S, p[0], p[1]); });
    res.pool = spec.pool;
    if (!fresh.length) { res.dup = true; res.v = SYS.DUPGEM[spec.pool] || 20; C.gemBack += res.v; }
    else { var p = fresh[Math.floor(U.rand() * fresh.length)]; S.owned[p[0]] = S.owned[p[0]] || []; S.owned[p[0]].push(p[1]); res.kind = p[0]; res.item = p[1]; }
    if (ch.pity && SYS.RARITY_ORDER.indexOf(spec.pool) >= SYS.RARITY_ORDER.indexOf(ch.pity.pool)) C.pity[id] = 0;
    if (spec.pool === 'legendary' && !res.dup) C.lucky = true;
  }
  C.log.push(res); if (C.log.length > 40) C.log = C.log.slice(-40);
  return res;
};

/* ---------- dungeons ---------- */
E.dunMark = function(S, i, j, val, fin){ var dun = S.dun; if (!dun) return; var key = fin ? 'f' : i; var m = dun.marks[key] = dun.marks[key] || []; m[j] = !!val; };
E.dunDate = function(dun, i){ return U.addDays(dun.start, i); };
E.dunDayOk = function(S, dun, i){
  var dg = E.DUN[dun.id], day = E.dunDate(dun, i), r = S.daily[day];
  if (r && r.rest && i < dg.days - 1) return true;
  var m = dun.marks[i] || [], ok = dg.daily.every(function(_, j){ return m[j]; });
  if (ok && i === dg.days - 1 && dg.fin) { var f = dun.marks.f || []; ok = dg.fin.every(function(_, j){ return f[j]; }); }
  return ok;
};
E.dunEnter = function(S, id){
  var dg = E.DUN[id]; if (!dg || S.dun || !(S.owned.keys[dg.rank] > 0)) return false;
  S.owned.keys[dg.rank]--; S.dun = {id:id, start:U.today(), marks:{}, skip:{}, used:0}; return true;
};
E.dunClear = function(S){
  var dun = S.dun, dg = E.DUN[dun.id], rw = dg.rew, got = {gem:rw.gem || 0, chests:[]};
  if (rw.freeze) E.applyGrant(S, {freeze:rw.freeze});
  if (rw.cos) { var kind = rw.cos.slice(0,3) === 'nc_' ? 'namecards' : rw.cos.slice(0,3) === 'fr_' ? 'frames' : 'fx'; S.owned[kind] = S.owned[kind] || []; if (S.owned[kind].indexOf(rw.cos) < 0) S.owned[kind].push(rw.cos); got.cos = [kind, rw.cos]; }
  var nC = rw.chest ? (rw.chests || 1) : 0; for (var i = 0; i < nC; i++) got.chests.push(E.openChest(S, rw.chest));
  S.dunLog.push({id:dun.id, st:'cleared', start:dun.start, end:U.today(), used:dun.used || 0});
  if (S.dunLog.length > 60) S.dunLog = S.dunLog.slice(-60);
  S.dun = null; return got;
};
E.dunEval = function(S){
  var dun = S.dun; if (!dun) return null;
  var dg = E.DUN[dun.id]; if (!dg) { S.dun = null; return null; }
  var t = U.today(), idx = U.daysBetween(dun.start, t);
  for (var i = 0; i < Math.min(idx - 1, dg.days); i++) {
    if (E.dunDayOk(S, dun, i) || dun.skip[i]) continue;
    if (i < dg.days - 1 && (dun.used || 0) < (dg.rest || 0)) { dun.used = (dun.used || 0) + 1; dun.skip[i] = 1; continue; }
    S.dunLog.push({id:dun.id, st:'failed', start:dun.start, end:t, used:dun.used || 0}); S.dun = null;
    return {st:'failed', dg:dg};
  }
  var all = true; for (var j = 0; j < dg.days; j++) { if (!(E.dunDayOk(S, dun, j) || dun.skip[j])) { all = false; break; } }
  if (all) return {st:'cleared', dg:dg, got:E.dunClear(S)};
  return null;
};
