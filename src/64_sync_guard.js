/* ===== v13 · GUARDA DE SINCRONIZAÇÃO ENTRE APARELHOS ======================
   O save é um documento inteiro por vez, e vale o último que gravou. Sozinho,
   isso perde progresso sempre que um aparelho grava em cima de algo que não
   viu. Esta guarda decide QUEM pode gravar e QUANDO:

   1. Ler antes de gravar. Nenhum aparelho grava um documento antes de ter
      lido, nesta sessão, o que está na nuvem. Aparelho sem cache nunca
      sobrescreve um save que existe.
   2. Edição da pessoa e manutenção automática são coisas diferentes. Cada
      documento carrega _u (última gravação, de qualquer tipo) e _e (última
      edição feita por uma pessoa). Manutenção (dia novo, veredito, marcas
      de "já vi") nunca vence uma edição de pessoa: nem a deste aparelho,
      nem a de outro que ainda não conseguiu enviar.
   3. Sem edição pendente aqui: se a nuvem andou, ela vence, e a manutenção
      é refeita em cima dela (só grava se mudar alguma coisa de verdade).
   4. Com edição pendente aqui: vale a edição de pessoa mais recente. A que
      perde fica guardada neste aparelho e entra no "Exportar save".
   5. Cada gravação leva a marca desta aba (_by): o eco de uma gravação
      própria nunca é tratado como novidade.
   6. Ao abrir e ao voltar do sono, a edição fica travada até a nuvem ser
      conferida. Se ela demorar, a pessoa decide se segue assim mesmo.
   7. Enquanto a pessoa digita, o que chega da nuvem entra sem redesenhar o
      campo debaixo do cursor.
   8. O carimbo nunca anda para trás. Ele é a hora deste aparelho, mas sempre
      maior que qualquer carimbo que o aparelho já viu: relógio adiantado ou
      atrasado em outro aparelho não troca a ordem das gravações. Quem decide
      que a sua versão vale por cima de outra regrava com um carimbo novo.
   9. Uma página antiga do System (sem esta guarda) aberta em outro aparelho
      é reconhecida: o que ela grava conta como edição de pessoa, o que
      estava aqui antes fica guardado, e a pessoa é avisada para recarregar.
   ========================================================================= */
(function(){
  Store.ready = {}; Store.adopted = {}; Store.blank = {}; Store.seenAt = {}; Store.checking = {}; Store.checks = {}; Store.cacheOnly = {}; Store._ver = {};
  Store.userDirty = {}; Store.bootU = {}; Store.sentU = {};
  Store.auto = 0; Store.localFinal = false; Store.connecting = false; Store.waking = false; Store.blind = false; Store.holding = ''; Store.renderLater = false;
  Store.LOST = 'sysasc.lost.v1'; Store.meta = {};
  Store.sid = 's' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);   /* esta aba, nesta carga de página */
  Store.hi = ''; Store.mine = []; Store.oldSeen = {}; Store.upSaved = {};

  /* ---------- carimbos ---------- */
  function note(x){ if (typeof x === 'string' && x.length === 24 && x > Store.hi) Store.hi = x; }
  /* hora deste aparelho, nunca atrás do carimbo mais alto já visto (aqui ou na nuvem) */
  Store.stamp = function(){
    var n = Date.now(), h = Store.hi ? Date.parse(Store.hi) : 0;
    if (h >= n && h < 253370764800000) n = h + 1;
    var x = new Date(n).toISOString(); Store.hi = x; return x;
  };
  /* última edição de PESSOA que um documento carrega. Documento gravado por página sem esta guarda (_w não acompanha _u)
     não sabe separar edição de manutenção: conta inteiro como edição de pessoa */
  function edOf(d){ return (!d || !d._u) ? '' : (d._w === d._u ? (d._e || d._u) : d._u); }

  /* por documento: s = último carimbo da nuvem que este aparelho viu · d = há edição da pessoa ainda não confirmada
     x = carimbo da última edição de pessoa que este aparelho já viu NA NUVEM (para saber se algo inédito seria sobrescrito)
     n = cache que veio da versão sem guarda e ainda não foi conferido com a nuvem (vale a ordem simples dos carimbos)
     Isso viaja DENTRO do próprio cache do documento (_b, _bx, _bn): assim o cache sempre sabe de qual versão da nuvem ele
     descende, mesmo com duas abas do mesmo navegador gravando no mesmo lugar. _b0 marca um cache que nasceu num aparelho
     que nunca chegou a ver a nuvem (continua valendo "o save que existe vence" depois de recarregar). Nada disso sobe. */
  Store.metaOf = function(k){ return Store.meta[k] || (Store.meta[k] = {s:'', d:0, x:'', n:0}); };
  function base(k, l, m){ l._b = m.s || ''; l._bx = m.x || ''; if (m.n) l._bn = 1; else delete l._bn; if (Store.blank[k]) l._b0 = 1; else delete l._b0; }
  function keep(k){
    var m = Store.metaOf(k), l = App.docs()[k];
    Store.bootU[k] = m.s; Store.userDirty[k] = m.d;
    if (l && l._u && (l._b !== (m.s || '') || (l._bx || '') !== (m.x || '') || !!l._bn !== !!m.n || !!l._b0 !== !!Store.blank[k])) { base(k, l, m); U.ls.set(Store.KEYS[k], l); }
  }
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  function idle(){ return !Store.DOCS.some(function(d){ return Store.pending[d] || Store.writing[d] || Store.checking[d]; }); }
  function seen(k, definitive){ if (definitive) { Store.ready[k] = 1; Store.seenAt[k] = Date.now(); } }
  function calm(){ if (idle() && Store.status === 'saving') Store.setStatus('synced'); }
  /* o que está aqui precisa subir (a menos que exatamente isto já tenha sido enviado) */
  function need(k){
    var l = App.docs()[k]; if (!l || !l._u || Store.sentU[k] === l._u) return;
    Store.pending[k] = true; clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 300);
  }

  var oldLoad = Store.loadLocal;
  Store.loadLocal = function(){
    var L = oldLoad();
    Store.DOCS.forEach(function(k){
      var doc = L[k], lu = (doc && doc._u) || '', m;
      Store.blank[k] = !lu || !!doc._b0;
      if (!lu) m = {s:'', d:0, x:'', n:0};
      else if (typeof doc._b === 'string') m = {s:doc._b, d:0, x:String(doc._bx || ''), n:doc._bn ? 1 : 0};
      else m = {s:lu, d:0, x:edOf(doc), n:1};              /* cache da versão sem guarda: o carimbo dele é o último ponto em comum conhecido */
      /* o cache carrega uma edição de pessoa que a nuvem (como este aparelho a viu por último) não tinha: está pendente */
      if (lu && edOf(doc) > m.x) m.d = 1;
      Store.meta[k] = m; Store.bootU[k] = m.s; Store.userDirty[k] = m.d;
      note(lu); note(doc && doc._e); note(m.s); note(m.x);
    });
    return L;
  };

  /* escrita automática (boot, virada de dia, veredito) não conta como edição da pessoa */
  Store.asAuto = function(fn){ Store.auto++; try { return fn(); } finally { Store.auto--; } };
  Store.touch = function(doc){
    var e = edOf(doc);
    doc._u = Store.stamp(); doc._w = doc._u;
    if (Store.auto) { if (e) doc._e = e; }
    else { doc._e = doc._u; Store.mine.push(doc._e); if (Store.mine.length > 24) Store.mine.shift(); }
  };
  /* a versão daqui vai valer por cima de uma que está na nuvem: sobe com carimbo novo, para todo aparelho adotar */
  function lift(k){ var l = App.docs()[k]; if (!l || !l._u) return; var e = edOf(l); l._u = Store.stamp(); l._w = l._u; if (e) l._e = e; base(k, l, Store.metaOf(k)); U.ls.set(Store.KEYS[k], l); }
  function push(k, ru){ var l = App.docs()[k]; if (l && l._u && !(l._u > ru)) lift(k); need(k); }
  /* a versão da nuvem carrega uma edição de pessoa que este aparelho nunca incorporou? */
  function unseen(re, M, le, live){ return !!re && re !== (M.x || '') && re !== le && Store.mine.indexOf(re) < 0 && (re > (M.x || '') || live); }
  var oldTick = App.tick;
  App.tick = function(){ return Store.asAuto(oldTick); };

  /* a manutenção do dia só grava quando muda alguma coisa (antes gravava sempre: dois aparelhos abertos ficavam se regravando sem parar) */
  var oldSeen = App.onSeen;
  App.onSeen = function(){
    var before = JSON.stringify(App.S), real = App.commit, asked = null;
    App.commit = function(docs, opt){ asked = [docs, opt]; };
    try { oldSeen(); } finally { App.commit = real; }
    if (asked && JSON.stringify(App.S) !== before) App.commit(asked[0], asked[1]);
  };

  var oldSave = Store.save;
  Store.save = function(names){
    names.forEach(function(k){ var l = App.docs()[k]; if (l) base(k, l, Store.metaOf(k)); });   /* o cache leva junto de qual versão da nuvem ele descende */
    var r = oldSave(names);
    if (!Store.auto) names.forEach(function(k){ Store.metaOf(k).d = 1; Store.userDirty[k] = 1; });
    return r;
  };

  var oldStatus = Store.setStatus;
  Store.setStatus = function(s, msg){ if (Store.connecting && (s === 'local' || s === 'error')) Store.localFinal = true; return oldStatus(s, msg); };
  var oldConnect = Store.connect;
  Store.connect = function(){ Store.connecting = true; return oldConnect(); };

  /* ---------- o que perdeu numa divergência fica guardado neste aparelho ---------- */
  /* slot: sem nada = divergência de verdade (avisa a pessoa) · '_antes' / '_antes2' = cópia de segurança silenciosa */
  Store.keepLost = function(k, doc, side, slot){
    var all = U.ls.get(Store.LOST) || {}, quiet = !!slot;
    all[k + (slot || '')] = {at:new Date().toISOString(), side:side, doc:clone(doc)};
    /* cópia de segurança nunca pode disputar espaço com o save de verdade */
    if (JSON.stringify(all).length > 400000) Object.keys(all).forEach(function(q){ if (/_antes2?$/.test(q) && q !== k + (slot || '')) delete all[q]; });
    if (JSON.stringify(all).length > 600000) { var only = {}; if (all[k + (slot || '')]) only[k + (slot || '')] = all[k + (slot || '')]; all = only; }
    if (JSON.stringify(all).length > 600000) all = {};
    U.ls.set(Store.LOST, all);
    if (quiet || Store._lostToast) return;
    Store._lostToast = true;
    setTimeout(function(){
      Store._lostToast = false;
      if (App.toast) App.toast({t:'Dois aparelhos, duas versões', s:(side === 'local' ? 'A nuvem tinha uma edição mais nova que a deste aparelho, e ela valeu. A versão daqui' : 'A edição deste aparelho era a mais nova, e ela valeu. A versão que estava na nuvem') + ' ficou guardada: Perfil → Exportar save leva as duas.', ic:'alert', ms:12000});
    }, 400);
  };
  var oldJSON = App.saveJSON;
  if (oldJSON) App.saveJSON = function(){
    var o = JSON.parse(oldJSON()), lost = U.ls.get(Store.LOST);
    Store.DOCS.forEach(function(k){ if (o[k]) { delete o[k]._b; delete o[k]._bx; delete o[k]._bn; delete o[k]._b0; } });   /* marcas deste aparelho não fazem parte do save */
    if (lost && Object.keys(lost).length) o.conflito = lost;
    return JSON.stringify(o, null, 1);
  };

  /* ---------- trocar o documento em memória sem atrapalhar quem está digitando ---------- */
  Store.replace = function(k, doc){
    if (!App.typing()) return App.replaceDoc(k, doc);
    var real = App.render; App.render = function(){ Store.renderLater = true; };
    try { App.replaceDoc(k, doc); } finally { App.render = real; }
    try { App.renderHud(); } catch (e) {}
  };
  /* outra página, sem esta guarda, gravou: ela não confere a nuvem antes de gravar. Guarda o que estava aqui e avisa (uma vez por sessão) */
  Store.oldPage = function(k, local){
    if (local && local._u) {
      /* a primeira cópia da sessão fica; depois, só guarda de novo se a pessoa editou aqui desde então */
      var first = (U.ls.get(Store.LOST) || {})[k + '_antes'];
      if (!Store.oldSeen[k]) Store.keepLost(k, local, 'local', '_antes');
      else if (!first || edOf(first.doc) !== edOf(local)) Store.keepLost(k, local, 'local', '_antes2');
    }
    Store.oldSeen[k] = 1;
    if (Store._oldToast) return; Store._oldToast = true;
    setTimeout(function(){
      if (App.toast) App.toast({t:'Versão antiga aberta em outro aparelho', s:'Outro aparelho gravou com a página antiga do System, que não confere a nuvem antes de gravar. Recarregue a página nele. O que estava neste aparelho antes ficou guardado: Perfil → Exportar save.', ic:'alert', ms:14000});
    }, 600);
  };
  /* def = a versão veio da nuvem de verdade (não do cache do navegador): só aí o cache antigo conta como conferido */
  function adopt(k, remote, def){
    var M = Store.metaOf(k), local = App.docs()[k];
    if (M.d && local && local._u) Store.keepLost(k, local, 'local');
    else if (!Store.blank[k] && local && local._u) {
      /* primeira conferência depois de atualizar: guarda (uma vez) o cache que veio da versão sem guarda */
      if (M.n) { if (!Store.upSaved[k]) { Store.upSaved[k] = 1; Store.keepLost(k, local, 'local', '_antes'); } }
      else if (remote._u && remote._w !== remote._u) Store.oldPage(k, local);
    }
    Store.blank[k] = false; M.s = remote._u || ''; M.d = 0; M.x = edOf(remote); if (def) M.n = 0;
    Store.bootU[k] = M.s; Store.userDirty[k] = 0;
    Store.pending[k] = false; Store.adopted[k] = (Store.adopted[k] || 0) + 1;
    var c = clone(remote); base(k, c, M);
    Store.replace(k, c);
    if (k === 'core') Store.asAuto(function(){ App.onSeen(); });
  }

  /* ---------- chegou uma versão da nuvem (aviso ao vivo ou leitura direta): quem vale? ---------- */
  /* got = veio de uma leitura direta (get), que pode chegar atrasada em relação a um aviso ao vivo já aplicado */
  Store.onSnap = function(k, snap, got){
    var meta = snap.metadata || {}, def = !meta.fromCache, local = App.docs()[k], lu = (local && local._u) || '';
    if (!snap.exists) {
      if (!def) return;                                    /* "ainda não sei": espera a resposta definitiva */
      Store.blank[k] = false; seen(k, true);
      if (lu) { Store.pending[k] = true; Store.flush(); } else calm();
      return;
    }
    if (meta.hasPendingWrites) return;                     /* visão otimista de uma gravação própria ainda não confirmada */
    var R = snap.data() || {}, ru = R._u || '', aware = !!ru && R._w === ru, re = edOf(R), M = Store.metaOf(k), le = edOf(local), live = !got && def;
    note(ru); note(re);
    if (ru === lu) {                                       /* a nuvem tem exatamente o que está aqui */
      Store.blank[k] = false; M.s = ru; M.d = 0; M.x = re; if (def) M.n = 0; keep(k);
      if (!Store.writing[k]) Store.pending[k] = false;
    }
    else if (aware && R._by === Store.sid) {               /* eco de uma gravação desta própria aba */
      if (ru > M.s) M.s = ru;
      if (re > (M.x || '')) M.x = re;
      if (ru > lu && !(le > re)) { M.d = 0; M.x = re; Store.pending[k] = false; var c = clone(R); base(k, c, M); Store.replace(k, c); keep(k); }
      else { keep(k); push(k, ru); }                       /* aqui já existe coisa mais nova (ou uma edição de pessoa adotada depois): garante o envio */
    }
    else if (Store.blank[k]) adopt(k, R, def);             /* aparelho sem cache: o save que existe sempre vence */
    else if (!M.d) {                                       /* nada de pessoa pendente aqui */
      if (ru > M.s) adopt(k, R, def);                      /* a nuvem andou: ela vence */
      else if (ru === M.s || M.n) need(k);                 /* a nuvem está onde este aparelho a deixou: sobe a manutenção daqui, se houver */
      else if (re > le) adopt(k, R, def);                  /* carimbo menor, mas com edição de pessoa mais nova (relógio atrasado lá): vence */
      else if (live) {                                     /* a nuvem voltou para trás de verdade: repõe a versão daqui */
        if (unseen(re, M, le, true)) Store.keepLost(k, R, 'remote');
        lift(k); need(k);
      }                                                    /* (numa leitura direta pode ser só um retrato atrasado: ignora) */
    }
    else if (re > le) adopt(k, R, def);                    /* a nuvem tem uma edição de pessoa mais nova que a daqui */
    else {                                                 /* a edição daqui é a mais nova: ela sobe */
      if (unseen(re, M, le, live)) Store.keepLost(k, R, 'remote');
      if (ru > M.s) M.s = ru;
      if (live || re > (M.x || '')) M.x = re;
      keep(k); push(k, ru);
    }
    if (def && M.n) { M.n = 0; keep(k); }
    seen(k, def);
    calm();
  };

  /* ---------- gravação: um documento por vez ---------- */
  Store.writeDoc = function(k){
    if (!Store.pending[k] || Store.writing[k] || !Store.refs[k]) return;
    var doc = App.docs()[k], body = clone(doc); body._by = Store.sid;
    delete body._b; delete body._bx; delete body._bn; delete body._b0;   /* marcas deste aparelho: não sobem */
    var size = JSON.stringify(body).length;
    if (size > 250000) { Store.setStatus('error', 'O documento “' + k + '” passou do limite de tamanho. Exporte o save e limpe notas antigas.'); Store.pending[k] = false; return; }
    Store.pending[k] = false; Store.writing[k] = true; Store.sentU[k] = body._u || '';
    Store.refs[k].set(body).then(function(){
      Store.writing[k] = false;
      if (Store.pending[k]) { clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 400); }
      else if (idle()) Store.setStatus('synced');
    }).catch(function(e){
      Store.writing[k] = false; Store.sentU[k] = '';
      var code = e && e.code;
      if (code === 'unavailable') { Store.pending[k] = true; clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 2500 + Math.random() * 1500); Store.setStatus('saving'); }
      else if (code === 'invalid_argument') { Store.setStatus('error', 'A nuvem recusou o save (tamanho ou permissão). Seus dados continuam neste navegador.'); }
      else if (code === 'quota_exceeded' || code === 'resource_exhausted') { Store.setStatus('error', 'Limite do armazenamento atingido. Exporte o save.'); }
      else { Store.mode = 'local'; Store.setStatus('local'); }
    });
  };
  Store.peek = function(k){
    var ref = Store.refs[k];
    if (!ref || typeof ref.get !== 'function') return Promise.resolve(null);
    try { return ref.get().then(function(s){ return s || null; }, function(){ return null; }); } catch (e) { return Promise.resolve(null); }
  };
  Store.flush = function(){
    Store.DOCS.forEach(function(k){
      if (!Store.pending[k] || Store.writing[k] || Store.checking[k] || !Store.refs[k]) return;
      /* caminho rápido: a nuvem já foi lida nesta sessão e o que está pendente é edição da pessoa */
      if (Store.ready[k] && Store.metaOf(k).d) { Store.writeDoc(k); return; }
      /* primeira gravação da sessão, ou só manutenção automática: lê a nuvem antes de escrever por cima */
      Store.checking[k] = true;
      Store.peek(k).then(function(snap){
        Store.checking[k] = false;
        var blurry = !snap || !!(snap.metadata && snap.metadata.fromCache);
        if (blurry) {
          Store.checks[k] = (Store.checks[k] || 0) + 1;
          if (!Store.ready[k]) {                           /* nunca leu nesta sessão: não grava às cegas, tenta de novo */
            if (Store.checks[k] === 12) oldStatus('error', 'A nuvem não está respondendo. Seus dados continuam salvos neste navegador e sobem quando ela voltar.');
            clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, Math.min(10000, 2000 + Store.checks[k] * 500));
            return;
          }
          if (Store.checks[k] < 3) { clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 2500); return; }
        } else {
          Store.checks[k] = 0;
          if (snap.exists) Store.onSnap(k, snap, true);    /* mesma decisão de um aviso ao vivo: pode adotar e cancelar a gravação */
          else { Store.blank[k] = false; seen(k, true); }
        }
        if (Store.pending[k] && !Store.writing[k]) { clearTimeout(Store.timer); Store.writeDoc(k); }
        else calm();
      });
    });
  };

  /* ---------- conferência sob demanda ---------- */
  /* resolve true quando a cópia da nuvem deste documento acabou de ser lida e aplicada pelo mesmo caminho do aviso ao vivo */
  Store.verify = function(k){
    if (Store.mode !== 'remote' || !Store.refs[k]) return Promise.resolve(Store.settled());
    if (Store._ver[k]) return Store._ver[k];
    var p = Store.peek(k).then(function(snap){
      Store._ver[k] = null;
      if (!snap) return false;
      var meta = snap.metadata || {};
      if (meta.fromCache) { Store.cacheOnly[k] = (Store.cacheOnly[k] || 0) + 1; if (Store.cacheOnly[k] < 3) return false; }
      else Store.cacheOnly[k] = 0;
      Store.onSnap(k, snap, true);
      if (meta.fromCache) seen(k, true);                   /* três leituras só de cache: é o melhor que existe agora */
      return true;
    });
    Store._ver[k] = p;
    return p;
  };
  Store.refresh = function(){ return Promise.all(Store.DOCS.map(function(k){ return Store.verify(k); })); };
  Store.isFresh = function(k, ms){ return Store.mode !== 'remote' || (Date.now() - (Store.seenAt[k] || 0)) <= ms; };

  /* true quando já dá para confiar no estado em memória (nuvem conferida, ou modo só-local decidido) */
  Store.settled = function(){ return !!(Store.ready.core || Store.localFinal || (!window.claude)); };

  /* ---------- trava de edição enquanto a nuvem é conferida ---------- */
  Store.holdOn = function(why){
    if (!document.body || Store.blind) return;
    Store.holding = why; document.body.classList.add('sy-hold');
    clearTimeout(Store._hb); Store._hb = setTimeout(Store.holdAsk, why === 'boot' ? 3500 : 2500);
  };
  Store.holdOff = function(){
    Store.holding = ''; clearTimeout(Store._hb);
    if (document.body) document.body.classList.remove('sy-hold');
    var el = document.getElementById('syhold'); if (el && el.parentNode) el.parentNode.removeChild(el);
  };
  /* a nuvem está demorando: explica e deixa a pessoa decidir */
  Store.holdAsk = function(){
    if (!Store.holding || document.getElementById('syhold')) return;
    var el = document.createElement('div'); el.id = 'syhold'; el.className = 'syhold'; el.setAttribute('role', 'status');
    el.innerHTML = '<span><b>A nuvem está demorando a responder.</b> A edição fica travada até o seu save ser conferido: o que você fizer agora pode passar por cima do que foi feito em outro aparelho.</span><button class="btn sm" data-a="syGo">Editar assim mesmo</button>';
    document.body.appendChild(el);
  };
  App.A.syGo = function(){
    Store.blind = true; Store.waking = false; Store.holdOff();
    if (App.toast) App.toast({t:'Editando sem conferir a nuvem', s:'Quando ela responder, vale a edição mais recente. Se houver duas versões, a que perder fica guardada neste aparelho.', ic:'alert', ms:9000});
    if (App.pzSync) App.pzSync();
  };

  Store.onWake = function(){
    if (Store.waking) return;
    if (Store.mode !== 'remote') { if (App.pzSync) App.pzSync(); return; }
    Store.waking = true; Store.holdOn('wake');
    (function attempt(n){
      Store.refresh().then(function(r){
        if (!Store.waking) return;                         /* a pessoa mandou seguir sem esperar */
        if (r.every(Boolean)) { Store.waking = false; Store.holdOff(); if (App.pzSync) App.pzSync(); return; }
        setTimeout(function(){ attempt(n + 1); }, Math.min(8000, 1500 + n * 500));
      }, function(){ setTimeout(function(){ attempt(n + 1); }, 3000); });
    })(0);
  };

  var oldInit = App.init;
  App.init = function(){
    var r = Store.asAuto(oldInit);
    if (window.claude && !Store.settled()) {
      Store.holdOn('boot');
      var kicked = false, t = setInterval(function(){
        /* o que ficou pendente antes de a nuvem conectar sobe (passando pela leitura) assim que ela conecta */
        if (!kicked && Store.mode === 'remote') { kicked = true; setTimeout(Store.flush, 1500); }
        if (Store.blind || Store.holding !== 'boot') { if (kicked || Store.localFinal) clearInterval(t); return; }
        if (Store.settled()) Store.holdOff();
      }, 100);
    }
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) { Store.hiddenAt = Date.now(); return; }
      var away = Store.hiddenAt ? Date.now() - Store.hiddenAt : 0; Store.hiddenAt = 0;
      if (away > 20000) Store.onWake();
    });
    return r;
  };
  var oldClock = App.clockTick, lastTick = 0;
  App.clockTick = function(){
    var now = Date.now(), gap = lastTick ? now - lastTick : 0; lastTick = now;
    if (gap > 90000) Store.onWake();                       /* o relógio pulou: o aparelho dormiu */
    if (Store.renderLater && !App.typing()) { Store.renderLater = false; App.render(); }
    return oldClock();
  };
})();
