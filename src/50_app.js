/* ===== APP CORE: estado, commit, rotas, eventos, toasts ===== */
var App = SYS.App = {S:null, J:null, N:null, D:null, ui:{route:'status', param:null, drawer:null, modal:null, more:false, f:{}}, me:null, userCap:null, sample:null, downloads:null, A:{}, C:{}, I:{}, V:{}};
App.docs = function(){ return {core:App.S, journal:App.J, notes:App.N}; };
App.$ = function(id){ return document.getElementById(id); };
App.way = function(id){ return SYS.WAYMAP[id]; };

App.init = function(){
  E.build();
  var L = Store.loadLocal();
  App.S = E.migrate(E.fill(L.core || E.newState(), E.newState()));
  App.J = E.fill(L.journal || E.newJournal(), E.newJournal());
  App.N = E.fill(L.notes || E.newNotes(), E.newNotes());
  var silent = E.checkAch(App.S, App.J);
  App.D = E.derive(App.S, App.J);
  if (silent.length && App.S._u) Store.save(['core']);
  App.bind(); App.route(); App.onSeen(); App.render();
  Store.connect();
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('sample').then(function(s){ App.sample = s; if (App.ui.drawer || App.ui.modal) { App.renderDrawer(); App.renderModal(); } }).catch(function(){});
    window.claude.use('downloads').then(function(d){ App.downloads = d; }).catch(function(){});
  }
  setInterval(App.tick, 60000); setInterval(App.clockTick, 1000);
};
App.replaceDoc = function(k, doc){
  if (k === 'core') App.S = E.migrate(E.fill(doc, E.newState()));
  else if (k === 'journal') App.J = E.fill(doc, E.newJournal());
  else App.N = E.fill(doc, E.newNotes());
  U.ls.set(Store.KEYS[k], doc);
  App.D = E.derive(App.S, App.J); App.render();
};
App.onSeen = function(){
  var S = App.S, t = U.today(), changed = false;
  App._day = t;
  if (!S._u) return;
  var fz = E.freezeCheck(S);
  if (fz.used) { changed = true; setTimeout(function(){ App.toast({t:'Gelo do Sistema usado' + (fz.used > 1 ? ' ×' + fz.used : ''), s:U.pick(SYS.SYSLINES.frozen), ic:'moon', ms:6000}); }, 900); }
  else if (fz.lost) { changed = true; setTimeout(function(){ App.toast({t:'A sequência de ' + fz.lost.len + ' dias apagou', s:U.pick(SYS.SYSLINES.sad), ic:'flame', ms:7000}); }, 900); }
  if (S.flags.fzDay === t) changed = true;
  var dv = E.dunEval(S);
  if (dv) { changed = true; setTimeout(function(){ App.dunToast(dv); }, 1400); }
  if (S.lastSeen && U.daysBetween(S.lastSeen, t) >= 14) { S.flags.returned = (S.flags.returned||0) + 1; changed = true; setTimeout(function(){ App.toast({t:'Bem-vindo de volta', s:U.pick(SYS.VOICE.back), ic:'sparkle'}); }, 600); }
  if (!S.lastSeen || S.lastSeen < t) { S.lastSeen = t; changed = true; }   /* só anda para a frente: dois aparelhos com datas diferentes não ficam se regravando */
  if (new Date().getHours() === 3 && !S.flags.three) { S.flags.three = true; changed = true; }
  if (changed) App.commit(['core']);
};
App.tick = function(){
  if (App._day && App._day !== U.today()) { App.onSeen(); App.D = E.derive(App.S, App.J); App.render(); App.toast({t:'Novo dia no Sistema', s:U.pick(SYS.SYSLINES.fresh), ic:'sparkle'}); return; }
  App.D = E.derive(App.S, App.J);
  if (['lojas','status','sequencia'].indexOf(App.ui.route) >= 0 && !App.typing()) App.renderView();
  App.renderHud();
};
App.typing = function(){ var a = document.activeElement; return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT')); };
App.clockTick = function(){ var c = App.$('hudclock'); if (c) c.textContent = U.clock(); var r = App.$('hudreset'); if (r) r.textContent = 'reset ' + U.fmtDur(U.msToReset()); if (App._day && App._day !== U.today()) App.tick(); };
App.commit = function(docs, opt){
  opt = opt || {};
  var before = App.D ? App.D.level : null;
  var un = E.checkAch(App.S, App.J);
  if (un.length && docs.indexOf('core') < 0) docs = docs.concat(['core']);
  E.pruneDaily(App.S);
  App.D = E.derive(App.S, App.J);
  Store.save(docs);
  if (!opt.quiet) {
    un.forEach(function(a, i){ setTimeout(function(){ App.toastAch(a); }, 350 + i*450); });
    if (before != null && App.D.level > before) { App.S.lvlog.push({l:App.D.level, d:U.today()}); if (App.S.lvlog.length > 120) App.S.lvlog = App.S.lvlog.slice(-120); Store.save(['core']); }
    if (before != null && App.D.level > before) setTimeout(function(){ App.ui.modal = {type:'levelup', from:before, to:App.D.level}; App.renderModal(); }, 250);
  }
  if (!opt.norender) App.render();
};

App.NAV = [['status','Status','status'],['sequencia','Sequência','flame'],['caminhos','Caminhos','map'],['missoes','Missões','scroll'],['portoes','Portões','gate'],0,['conquistas','Conquistas','medal'],['titulos','Títulos','banner'],['marcos','Marcos','flag'],['metas','Metas','target'],['carteira','Carteira','helm'],0,['lojas','Lojas','bag'],['biblioteca','Biblioteca','book'],['diario','Diário','journal'],0,['perfil','Perfil','user'],['regras','Regras','shield']];
App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });
App.route = function(){
  var h = (location.hash || '').replace(/^#\/?/, ''); var p = h.split('/');
  App.ui.route = App.ROUTES.indexOf(p[0]) >= 0 ? p[0] : 'status';
  App.ui.param = p[1] ? decodeURIComponent(p[1]) : null;
  App.ui.sub = p[2] ? decodeURIComponent(p[2]) : null;
};
App.go = function(r){ location.hash = '#/' + r; };

App.bind = function(){
  document.addEventListener('click', function(ev){
    var el = ev.target.closest('[data-a]'); if (!el) return;
    var fn = App.A[el.getAttribute('data-a')]; if (!fn) return;
    if (el.tagName === 'A' && (el.getAttribute('href') || '#') === '#') ev.preventDefault();
    fn(el, ev);
  });
  document.addEventListener('change', function(ev){ var el = ev.target.closest('[data-c]'); if (el && App.C[el.getAttribute('data-c')]) App.C[el.getAttribute('data-c')](el, ev); });
  document.addEventListener('input', function(ev){ var el = ev.target.closest('[data-i]'); if (el && App.I[el.getAttribute('data-i')]) App.I[el.getAttribute('data-i')](el, ev); });
  document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape') App.A.closeAll(); App.konami(ev); });
  window.addEventListener('hashchange', function(){ App.route(); App.ui.more = false; App.ui.drawer = null; App.renderAll(); try { window.scrollTo(0,0); } catch(e){} });
  App.$('importFile').addEventListener('change', App.onImportFile);
  document.addEventListener('pointerover', function(ev){ var el = ev.target && ev.target.closest ? ev.target.closest('[data-tip]') : null; if (el) App.showTip(el); else App.hideTip(); });
  document.addEventListener('focusin', function(ev){ var el = ev.target && ev.target.closest ? ev.target.closest('[data-tip]') : null; if (el) App.showTip(el); else App.hideTip(); });
  window.addEventListener('scroll', App.hideTip, {passive:true});
};
App.showTip = function(el){
  var tip = App.$('tip'); if (!tip) return; tip.textContent = el.getAttribute('data-tip'); tip.hidden = false;
  var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
  var x = Math.min(window.innerWidth - tw - 8, Math.max(8, r.left + r.width / 2 - tw / 2)), y = r.top - th - 8; if (y < 8) y = r.bottom + 8;
  tip.style.left = Math.round(x) + 'px'; tip.style.top = Math.round(y) + 'px';
};
App.hideTip = function(){ var tip = App.$('tip'); if (tip && !tip.hidden) tip.hidden = true; };
App.dunToast = function(dv){
  if (dv.st === 'failed') App.toast({t:'Dungeon falhou · ' + dv.dg.n, s:'O portal fechou. A chave se foi, o aprendizado fica. Volte quando quiser.', ic:'gate', ms:7000});
  else if (dv.st === 'cleared') { App.toast({t:'Dungeon limpa · ' + dv.dg.n, s:'+' + (dv.got.gem || 0) + ' ◆' + (dv.got.chests.length ? ' · ' + dv.got.chests.length + ' baú(s) aberto(s)' : '') + (dv.got.cos ? ' · cosmético exclusivo' : ''), ic:'crown', ms:7000}); }
};
App.render = function(){ App.applySkin(); App.renderSide(); App.renderHud(); App.renderView(); App.renderMnav(); App.renderDrawer(); App.renderModal(); };
App.renderAll = App.render;
App.renderSync = function(){ var el = document.querySelector('.sync'); if (el) el.outerHTML = App.syncHTML(); var el2 = App.$('syncbox'); if (el2) el2.innerHTML = App.syncDetail(); };
App.applySkin = function(){
  var S = App.S, root = document.documentElement;
  var sk = S.settings.skin; if (!E.ownsCosmetic(S, SYS.SKINS, sk, 'skins')) sk = 'sk_system';
  if (root.getAttribute('data-skin') !== sk) root.setAttribute('data-skin', sk);
  root.setAttribute('data-motion', S.settings.motion ? 'on' : 'off');
};
App.renderView = function(){
  var v = App.$('view'), fn = App.V[App.ui.route] || App.V.status, y = window.scrollY;
  var html; try { html = fn(); } catch(e){ html = '<div class="win"><div class="win-h">Erro do Sistema</div><p class="dim">'+U.esc(e.message)+'</p></div>'; if (window.console) console.error(e); }
  v.innerHTML = html;
  if (Math.abs(window.scrollY - y) > 2) try { window.scrollTo(0, y); } catch(e){}
};

/* ---------- toasts ---------- */
App.toast = function(o){
  var box = App.$('toasts'), el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = (o.medal ? o.medal : '<div class="iconbtn" style="color:var(--glow)">'+U.icon(o.ic || 'sparkle')+'</div>') + '<div><div class="tt">'+U.esc(o.t)+'</div>'+(o.s ? '<div class="ts">'+U.esc(o.s)+'</div>' : '')+'</div>';
  box.appendChild(el);
  while (box.children.length > 4) box.removeChild(box.firstChild);
  setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ if (el.parentNode) el.parentNode.removeChild(el); }, 320); }, o.ms || 4200);
};
App.toastAch = function(a){ App.toast({t:(a.cat === 'gate' ? 'Selo · ' : 'Conquista · ') + a.n, s:U.pick(SYS.VOICE.ach) + ' (' + SYS.RARITY[a.r].n + ')', medal:U.medal(a, {size:48}), ms:5200}); };

/* ---------- helpers de view ---------- */
var H = App.H = {};
H.st = function(id){ var s = App.S.nodes[id]; return s ? s.s : 'todo'; };
H.stLabel = {todo:'Não iniciado', doing:'Em progresso', review:'Evidência pronta', done:'Completo'};
H.stChip = function(s){ var c = {todo:'', doing:'glow', review:'warn', done:'ok'}[s]; return '<span class="chip '+c+'">'+H.stLabel[s]+'</span>'; };
H.bar = function(p, cls, wc){ cls = (cls || '').replace(/\bway\b/, 'wc'); return '<div class="bar '+cls+'"'+(wc?' style="--wc:'+wc+'"':'')+'><i style="width:'+U.clamp(p,0,100)+'%"></i></div>'; };
H.cur = function(wid){ return App.way(wid).cur.code; };
H.rew = function(xp, cr, wid){ return '+'+xp+' XP'+(cr ? ' · +'+cr+' '+H.cur(wid) : ''); };
H.wayChip = function(wid){ var w = App.way(wid); if (!w) return ''; return '<span class="chip" style="color:'+w.color+';border-color:'+U.hexA(w.color,.45)+'">'+U.icon(w.icon)+U.esc(w.pt.replace('Caminho d', '').replace(/^[oa] /,''))+'</span>'; };
H.rar = function(r){ var R = SYS.RARITY[r]; return '<span class="chip" style="color:'+R.c+';border-color:'+U.hexA(R.c,.5)+'">'+R.n+'</span>'; };
H.nodeRow = function(n){
  var S = App.S, st = H.st(n.id), arc = E.arcOf(n), locked = E.arcLocked(S, arc) || !E.reqOk(S, n);
  var ico = st === 'done' ? U.icon('check') : locked ? U.icon('lock') : n.boss ? U.icon('sword') : st === 'review' ? U.icon('flag') : '<span>'+U.esc(n.id)+'</span>';
  var w = App.way(n.way);
  return '<button class="q '+st+(locked?' locked':'')+(n.boss?' boss':'')+'" data-a="openNode" data-id="'+n.id+'" style="--wc:'+w.color+'">'
    + '<span class="st">'+ico+'</span>'
    + '<span style="min-width:0"><span class="tt">'+U.esc(n.t)+'</span><span class="mt">'
    + (n.w ? '<span class="chip">S'+n.w+'</span>' : '') + '<span class="chip">'+U.esc(n.d)+'</span>'
    + (n.boss ? '<span class="chip boss">'+U.icon('sword')+(n.final?'Final Boss':'Boss')+'</span>' : '')
    + (st !== 'todo' && st !== 'done' ? H.stChip(st) : '')
    + (App.N.n[n.id] && App.N.n[n.id].ex && App.N.n[n.id].ex.nota >= 70 ? '<span class="chip ok">'+U.icon('oracle')+'Teach-back</span>' : '')
    + '</span></span><span class="rw">+'+n.xp+' XP<br>+'+n.cr+' '+w.cur.code+'</span></button>';
};
H.avatar = function(size){
  var S = App.S, p = S.profile, fr = (SYS.FRAMES.filter(function(f){ return f.id === p.frame; })[0] || SYS.FRAMES[0]).id.replace('fr_','fr-');
  var inner;
  if (p.avatar === 'claude' && App.me && App.me.avatarUrl) inner = '<img src="'+U.esc(App.me.avatarUrl)+'" alt="">';
  else if (p.avatar === 'emoji') inner = '<span style="font-size:calc(var(--fs) * .42)">'+U.esc(p.emoji || '🗡️')+'</span>';
  else inner = '<span>'+U.esc(((p.name || (App.me && App.me.name) || 'P').trim()[0] || 'P').toUpperCase())+'</span>';
  return '<div class="avatar" style="--fs:'+(size||92)+'px"><div class="fr '+fr+'"></div><div class="in">'+inner+'</div></div>';
};
H.pname = function(){ var p = App.S.profile; return p.name || (App.me && App.me.name) || 'Player'; };
H.ptitle = function(){ var S = App.S, p = S.profile; if (p.title === 'custom' && S.owned.custom && S.customTitle) return S.customTitle; var t = E.TITLEMAP[p.title]; return t && E.titleUnlocked(S, App.D, t) ? t.n : 'Sem título equipado'; };
H.fx = function(){ var f = App.S.profile.fx; return f ? f.replace('fx_', 'fx-') : ''; };

App.konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; App.kpos = 0;
App.konami = function(ev){
  var k = ev.key && ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
  if (k === App.konamiSeq[App.kpos]) { App.kpos++; if (App.kpos === App.konamiSeq.length) { App.kpos = 0; if (!App.S.flags.konami) { App.S.flags.konami = true; App.commit(['core']); App.toast({t:'[ERRO] REALIDADE INSTÁVEL', s:'Algo foi desbloqueado. Não conte pra ninguém.', ic:'alert'}); } } }
  else App.kpos = (k === App.konamiSeq[0]) ? 1 : 0;
};
