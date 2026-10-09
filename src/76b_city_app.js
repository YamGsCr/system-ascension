/* ===== CIDADE · ligações com o app: manutenção sob a guarda, Chamado, loja selada e chave beta =====
   A manutenção (nascer, vencer, quebrar) só roda depois que a Cidade e o progresso foram conferidos na nuvem:
   aparelho com cache velho nunca faz nascer portal por cima do que outro aparelho já fez. */
(function(){
  App.cityReady = function(){
    if (Store.mode === 'remote') return !!(Store.ready.city && Store.ready.core);
    return !!(Store.localFinal || !window.claude || Store.status === 'local');
  };
  App.cityTick = function(){
    var S = App.S, C = App.city; if (!S || !C || !C.since || !E.cityOn(S) || !App.cityReady()) return false;
    var changed = false;
    Store.asAuto(function(){ changed = E.cyTick(C, S); if (changed) App.commit(['city'], {quiet: true}); });
    return changed;
  };
  var oldTick = App.tick;
  App.tick = function(){ var r = oldTick.apply(this, arguments); App.cityTick(); return r; };
  var oldInit = App.init;
  App.init = function(){
    var r = oldInit.apply(this, arguments), n = 0;
    (function wait(){ if (App.cityTick() || App.cityReady() || n++ > 120) return; setTimeout(wait, 500); })();
    return r;
  };
  /* chegou uma versão da nuvem: a manutenção é refeita em cima dela (só grava se mudar alguma coisa) */
  var oldReplace = App.replaceDoc;
  App.replaceDoc = function(k, doc){ var r = oldReplace.apply(this, arguments); if (k === 'city' || k === 'core') setTimeout(App.cityTick, 0); return r; };

  /* Chamado: entrar, escrever no rascunho e fechar portal dentro da janela contam como ação real */
  var oldMap = App.pzMap;
  App.pzMap = function(){
    var M = oldMap.apply(this, arguments), C = App.city;
    if (!C) return M;
    (C.portals || []).forEach(function(p){
      if (p.in) M['cy:' + p.id + ':in'] = 1;
      if (p.dr) M['cy:' + p.id + ':dr'] = 1 + Math.floor(String(p.dr).length / 80);
    });
    (C.log || []).slice(-20).forEach(function(l){ if (l.k === 'fechou') M['cy:' + l.p + ':ok'] = 3; });
    return M;
  };

  /* Mercado Fechado: com um portal desses aberto e começado, as lojas ficam seladas */
  App.citySealed = function(){
    var p = E.cyOpen(App.city).filter(function(x){ return x.in && (x.mods || []).indexOf('mercado_fechado') >= 0; })[0];
    if (!p) return false;
    App.toast({t: 'Loja selada', s: 'O portal “' + p.n + '” tem Mercado Fechado: as lojas reabrem quando ele fechar.', ic: 'lock', ms: 6500});
    return true;
  };
  ['buyOpen', 'buyDo', 'sysBuyOpen', 'sysBuyDo'].forEach(function(k){
    var o = App.A[k]; if (!o) return;
    App.A[k] = function(el, ev){ if (App.citySealed()) { if (/Do$/.test(k)) { App.ui.modal = null; App.renderModal(); } return; } return o.apply(this, arguments); };
  });

  /* chave beta: desligada, a Cidade congela (nada vence nem quebra); ao religar, os prazos andam o tempo que ficou parada */
  App.citySet = function(on){
    var S = App.S, C = App.city, now = Date.now(), docs = ['core', 'city'];
    S.settings.cityBeta = !!on;
    if (on) {
      if (!C.since) { C.since = U.today(); C.log.push({at: new Date(now).toISOString(), k: 'beta'}); }
      if (!C.seed) C.seed = 's' + Math.random().toString(36).slice(2, 10) + now.toString(36);
      if (C.off) { var gap = now - Date.parse(C.off); if (gap > 0) E.cyOpen(C).forEach(function(p){ p.due = new Date(Date.parse(p.due) + gap).toISOString(); if (p.lock) p.lock = new Date(Date.parse(p.lock) + gap).toISOString(); }); C.off = ''; }
    } else C.off = new Date(now).toISOString();
    App.commit(docs);
    if (on) setTimeout(App.cityTick, 0);
  };
})();
