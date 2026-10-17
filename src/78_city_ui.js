/* ===== CIDADE · janelas com vinheta, Janela do Caçador, carregamento e diálogo =====
   Janelas: uma pilha (App.ui.cyw). A de cima responde; a de baixo aparece atrás dela, como uma aba. Voltar (← ou Esc)
   tira a de cima; ✕ ou clicar fora fecha todas. Cada tipo mora em App.CYW[tipo](janela, profundidade) e devolve
   {ic, sup, t, b, wc, chips, cls} ou um cabeçalho pronto em h.
   Carregamento: a arte "Take Your time." ao entrar na Cidade e enquanto a nuvem confere o save.
   Diálogo: retrato grande, placa com o nome, texto que vai aparecendo e um holofote no que a fala aponta.
   As imagens vêm de assets/img (o build põe os caminhos com hash em window.SYS_IMG). */
(function(){
  var CY = SYS.CITY;
  App.CYW = App.CYW || {};
  App.img = function(k){ return (window.SYS_IMG || {})[k] || ''; };
  App.cyAvatar = function(cls){ var s = App.img('eu-icone'); return s ? '<img class="' + (cls || 'cy-av') + '" src="' + s + '" alt="" draggable="false">' : '<span class="' + (cls || 'cy-av') + ' cy-noimg">' + U.icon('user') + '</span>'; };
  App.cyBackBtn = function(){ return '<button class="iconbtn cyw-bk" data-a="cyWinBack" aria-label="Voltar">' + U.icon('back') + '</button>'; };

  function box(id, cls){ var el = document.getElementById(id); if (!el) { el = document.createElement('div'); el.id = id; el.className = cls; document.body.appendChild(el); } return el; }
  function stack(){ return App.ui.cyw || (App.ui.cyw = []); }
  function key(w){ return w.t + ':' + (w.id || ''); }

  /* ---------- pilha de janelas ---------- */
  App.cyWinTop = function(){ var s = stack(); return s[s.length - 1] || null; };
  App.cyWinOpen = function(w, o){
    var s = stack(); if (o && o.reset) s.length = 0;
    var top = s[s.length - 1];
    if (!top || key(top) !== key(w)) s.push(w);
    if (App.hideTip) App.hideTip();
    App.cyWinRender();
  };
  App.cyWinPop = function(){ stack().pop(); App.cyWinRender(); };
  App.cyWinRemove = function(t, id){ App.ui.cyw = stack().filter(function(w){ return !(w.t === t && (id == null || w.id === id)); }); App.cyWinRender(); };
  App.cyWinClear = function(){ if (!stack().length) return; App.ui.cyw = []; App.cyWinRender(); };
  App.A.cyWin = function(el, ev){
    if (ev && ev.stopPropagation) ev.stopPropagation();
    var w = {t: el.getAttribute('data-w')}; if (el.getAttribute('data-id')) w.id = el.getAttribute('data-id');
    App.cyWinOpen(w, {reset: el.hasAttribute('data-reset')});
  };
  App.A.cyWinBack = function(){ App.cyWinPop(); };
  App.A.cyWinX = function(){ App.cyWinClear(); };
  App.A.cyWinTab = function(el){
    var w = App.cyWinTop(); if (!w) return; w.tab = el.getAttribute('data-tab'); App.cyWinRender();
    var b = document.querySelector('#cyw .cyw-top .cyw-b'); if (b) b.scrollTop = 0;
  };

  function head(o, depth){
    if (o.h) return o.h;
    return '<header class="cyw-h">' + (depth > 0 ? App.cyBackBtn() : '') + (o.ic ? '<span class="cyw-ic">' + U.icon(o.ic) + '</span>' : '')
      + '<div class="cyw-tt"><span class="eyebrow">' + U.esc(o.sup || '') + '</span><h2>' + U.esc(o.t || '') + '</h2>' + (o.chips ? '<div class="row" style="gap:6px">' + o.chips + '</div>' : '') + '</div>'
      + '<button class="iconbtn cyw-x" data-a="cyWinX" aria-label="Fechar">' + U.icon('close') + '</button></header>';
  }
  function winHTML(w, depth, under){
    var fn = App.CYW[w.t], o = null;
    try { o = fn ? fn(w, depth) : null; } catch(e){ if (window.console) console.error(e); o = {t: 'Erro do Sistema', b: '<p class="dim">' + U.esc(e.message) + '</p>'}; }
    if (!o) return '';
    return '<section class="cyw-win ' + (under ? 'cyw-under' : 'cyw-top') + (o.cls ? ' ' + o.cls : '') + '" style="--wc:' + (o.wc || 'var(--glow)') + '" data-w="' + w.t + '"'
      + (under ? ' aria-hidden="true" inert' : ' role="dialog" aria-modal="true" aria-label="' + U.esc(o.t || '') + '" tabindex="-1"') + '>'
      + head(o, depth) + (under ? '' : '<div class="cyw-b">' + o.b + '</div>') + '</section>';
  }
  /* o bairro da janela fica aceso no mapa, atrás da vinheta */
  function selMark(){
    var sel = App.cySel ? App.cySel() : null;
    Array.prototype.forEach.call(document.querySelectorAll('.cy-svg .cy-d, .cy-svg .cy-nev'), function(g){ g.classList.toggle('cy-sel', g.getAttribute('data-id') === sel); });
  }
  function typingIn(el){ var a = document.activeElement; return !!(a && el.contains(a) && (a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || (a.tagName === 'INPUT' && !/checkbox|radio|button|submit/.test(a.type)))); }
  App.cyWinRender = function(){
    var el = box('cyw', 'cyw'), s = stack();
    if (!s.length) {
      if (el.classList.contains('on') || el.innerHTML) { el.classList.remove('on'); el.innerHTML = ''; el.removeAttribute('data-k'); }
      selMark(); return;
    }
    var top = s[s.length - 1], k = key(top) + '#' + s.length, same = el.getAttribute('data-k') === k;
    if (same && typingIn(el)) return;   /* digitando: não redesenha por baixo dos dedos */
    var ob = el.querySelector('.cyw-top .cyw-b'), sc = ob ? ob.scrollTop : 0, a = document.activeElement, fk = null;
    if (same && a && el.contains(a) && a.getAttribute && a.getAttribute('data-a')) fk = '[data-a="' + a.getAttribute('data-a') + '"]' + ['data-tab', 'data-id', 'data-v', 'data-w', 'data-i2'].map(function(n){ var v = a.getAttribute(n); return v != null ? '[' + n + '="' + v + '"]' : ''; }).join('');
    var html = winHTML(top, s.length - 1, false);
    if (!html) { s.pop(); App.cyWinRender(); return; }
    el.innerHTML = '<div class="cyw-bg" data-a="cyWinX"></div>' + (s.length > 1 ? winHTML(s[s.length - 2], s.length - 2, true) : '') + html;
    el.classList.add('on'); el.classList.toggle('same', same); el.classList.toggle('dim', !!App.ui.modal); el.setAttribute('data-k', k);
    var nb = el.querySelector('.cyw-top .cyw-b'); if (nb && same) nb.scrollTop = sc;
    var t = (fk && el.querySelector('.cyw-top ' + fk)) || (!same && el.querySelector('.cyw-top'));
    if (t) try { t.focus({preventScroll: true}); } catch(e){}
    selMark();
  };

  /* redesenhar o app redesenha as janelas; um modal por cima (drop, level up) escurece a janela */
  var oldRender = App.render;
  App.render = function(){ var r = oldRender.apply(this, arguments); App.cyWinRender(); if (App.ui.cyTalk) App.cyTalkSync(); return r; };
  App.renderAll = App.render;
  var oldRM = App.renderModal;
  App.renderModal = function(){ var r = oldRM.apply(this, arguments); var el = document.getElementById('cyw'); if (el) el.classList.toggle('dim', !!App.ui.modal); return r; };

  /* Esc: pula o diálogo, depois volta uma janela; o modal do Sistema (se houver) fecha antes */
  document.addEventListener('keydown', function(ev){
    if (App.ui.cyTalk) {
      if (ev.key === 'Escape') { ev.stopPropagation(); ev.preventDefault(); App.A.cyTalkSkip(); }
      else if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'ArrowRight') { ev.stopPropagation(); ev.preventDefault(); App.A.cyTalkNext(); }
      return;
    }
    if (ev.key !== 'Escape' || App.ui.modal || !stack().length) return;
    ev.stopPropagation(); ev.preventDefault(); App.cyWinPop();
  }, true);

  /* trocar de aba do app fecha as janelas; entrar na Cidade mostra o carregamento */
  window.addEventListener('hashchange', function(){
    var to = (location.hash || '').replace(/^#\/?/, '').split('/')[0];
    if (stack().length) App.ui.cyw = [];
    if (App.ui.cyTalk) App.A.cyTalkSkip();
    if (to === 'cidade' && App.ui.cyFrom !== 'cidade' && App.S && E.cityOn(App.S)) App.cyLoad();
    App.ui.cyFrom = to;
  });

  /* ---------- Janela do Caçador: a janela que abre outras janelas ---------- */
  App.CYW.hub = function(){
    var c = App.city, L = E.cyLic(c), n = App.cyInvCount(), m = App.cyMsgs(1)[0];
    var tiles = [['perfil', 'user', 'Perfil do Caçador', 'Licença ' + L.r + ' · ' + L.pts + ' Pontos de Caça'], ['inv', 'bag', 'Inventário', n ? n + (n === 1 ? ' item guardado' : ' itens guardados') : 'vazio por enquanto'], ['phone', 'phone', 'Celular', m ? m.t : 'sem mensagens']]
      .concat(App.cyHubTiles ? App.cyHubTiles() : []);   /* Arsenal, Relíquias, Fundo e vales, Sala de Troféus (src/79c) */
    var soon = [['shield', 'Clãs', 'abrem com as Facções'], ['sparkle', 'Laços', 'chegam com Laços e Junções']];
    var b = '<div class="cy-hub-me">' + (App.img('eu-perfil') ? '<img class="cy-hub-ph" src="' + App.img('eu-perfil') + '" alt="" draggable="false">' : '')
      + '<div class="stack" style="gap:5px;min-width:0"><span class="eyebrow">Caçador</span><h3>' + U.esc(H.pname()) + '</h3>' + (H.ptitle() ? '<span class="dim" style="font-size:13px">' + U.esc(H.ptitle()) + '</span>' : '')
      + '<div class="row" style="gap:6px">' + U.rankBadge(L.r, 26) + '<span class="chip">Nível ' + App.D.level + '</span><span class="chip">' + L.pts + ' pts</span></div></div></div>'
      + '<div class="cy-tiles">' + tiles.map(function(t){ return '<button class="cy-tile" data-a="cyWin" data-w="' + t[0] + '">' + U.icon(t[1]) + '<b>' + t[2] + '</b><span>' + U.esc(t[3]) + '</span></button>'; }).join('')
      + soon.map(function(t){ return '<div class="cy-tile off" aria-disabled="true">' + U.icon(t[0]) + '<b>' + t[1] + '</b><span>' + t[2] + '</span></div>'; }).join('') + '</div>'
      + '<div class="row between"><button class="btn sm ghost" data-a="cyIntro">' + U.icon('eye') + 'Rever a apresentação do Ivo</button><a class="act" href="#/perfil">Ajustes da Cidade</a></div>';
    return {ic: 'helm', sup: 'Janela do Caçador', t: 'Perfil, inventário e recompensas', b: b, cls: 'cy-hubwin'};
  };
  App.CYW.perfil = function(){
    var c = App.city, closed = CY.DIST.reduce(function(a, d){ return a + (E.cityDist(c, d.id).closed || 0); }, 0), K = App.S.owned.keys || {}, keys = Object.keys(K).reduce(function(a, k){ return a + (+K[k] || 0); }, 0);
    var rows = [['Nível', App.D.level], ['Portais fechados', closed], ['Ecos', (c.ecos || []).length], ['Chaves de Dungeon', keys], ['Na Cidade desde', c.since ? U.fmtDate(c.since) : '—']];
    var b = '<div class="cy-perfil">' + (App.img('eu-perfil') ? '<div class="cy-perfil-ph"><img src="' + App.img('eu-perfil') + '" alt="Retrato do caçador" draggable="false"></div>' : '')
      + '<div class="stack" style="gap:8px;min-width:0"><span class="eyebrow">Caçador</span><h3>' + U.esc(H.pname()) + '</h3>' + (H.ptitle() ? '<span class="dim" style="font-size:13px">' + U.esc(H.ptitle()) + '</span>' : '')
      + '<dl class="cy-rdlist">' + rows.map(function(r){ return '<dt>' + r[0] + '</dt><dd>' + U.esc(String(r[1])) + '</dd>'; }).join('') + '</dl></div></div>'
      + '<section class="win flat cy-lic"><div class="win-h">' + U.icon('cert') + 'Licença de Caçador</div>' + App.cyLicInner() + '</section>';
    return {ic: 'user', sup: 'Janela do Caçador', t: 'Perfil do Caçador', b: b, cls: 'wide'};
  };
  App.CYW.inv = function(){ return {ic: 'bag', sup: 'Janela do Caçador', t: 'Inventário', b: App.cyInvInner()}; };
  App.CYW.phone = function(){ return {ic: 'phone', sup: 'Janela do Caçador', t: 'Celular', b: '<div class="cy-phone">' + App.cyPhoneInner() + '</div>', cls: 'cy-phonewin'}; };

  /* ---------- carregamento: "Take Your time." ---------- */
  function loader(){
    var el = document.getElementById('cyload');
    if (!el) {
      el = box('cyload', 'cyl'); el.hidden = true; el.setAttribute('role', 'status');
      el.innerHTML = '<div class="cyl-in">' + (App.img('eu-loading') ? '<img src="' + App.img('eu-loading') + '" alt="Take your time." draggable="false">' : '') + '<div class="cyl-bar"><i></i></div><span class="cyl-t"></span></div>';
      el.addEventListener('click', function(){ App.ui.cyLoadSkip = 1; });
    }
    return el;
  }
  /* o = {t: texto, min: ms na tela, max: ms no máximo, until: fn que diz se já carregou, then: fn} */
  App.cyLoad = function(o){
    o = o || {};
    var el = loader(), t0 = Date.now(), min = o.min == null ? 700 : o.min, max = o.max || 6000;
    el.querySelector('.cyl-t').textContent = o.t || 'carregando a Cidade';
    el.hidden = false; el.classList.remove('out'); App.ui.cyLoading = true; App.ui.cyLoadSkip = 0;
    clearTimeout(App.ui.cyLoadT);
    (function check(){
      var dt = Date.now() - t0, ready = !o.until || o.until();
      if ((dt >= min && ready) || dt >= max || (App.ui.cyLoadSkip && ready)) {
        el.classList.add('out');
        App.ui.cyLoadT = setTimeout(function(){ el.hidden = true; el.classList.remove('out'); App.ui.cyLoading = false; if (o.then) o.then(); App.cyMaybeIntro(); }, 220);
      } else App.ui.cyLoadT = setTimeout(check, 100);
    })();
  };
  /* depois de cada desenho da Cidade: na primeira vez, espera a nuvem conferir; depois, a apresentação do Ivo */
  App.cyAfter = function(){
    selMark();
    if (!App.ui.cyBoot) {
      App.ui.cyBoot = 1; App.ui.cyFrom = 'cidade';
      if (!App.cityReady()) { App.cyLoad({t: 'conferindo o save da Cidade', until: App.cityReady, max: 8000}); return; }
    }
    if (!App.ui.cyLoading) setTimeout(App.cyMaybeIntro, 0);
  };

  /* ---------- diálogo ---------- */
  function talkEl(){
    var el = document.getElementById('cytalk');
    if (!el) { el = box('cytalk', 'cyt'); el.addEventListener('click', function(ev){ if (ev.target.closest && ev.target.closest('[data-a]')) return; App.A.cyTalkNext(); }); }
    return el;
  }
  function spot(sel){
    var el = talkEl(), sp = el.querySelector('.cyt-spot'), dim = el.querySelector('.cyt-dim'); if (!sp) return;
    var t = sel ? document.querySelector(sel) : null, r = t && t.getBoundingClientRect();
    if (!r || r.width < 2 || r.height < 2) { sp.hidden = true; dim.hidden = false; return; }
    var pad = t.matches('.cy-mapbox') ? -6 : 8, round = t.matches('.cy-mini') || t.matches('.cy-badge');
    sp.hidden = false; dim.hidden = true;
    sp.style.left = (r.left - pad) + 'px'; sp.style.top = (r.top - pad) + 'px'; sp.style.width = (r.width + pad * 2) + 'px'; sp.style.height = (r.height + pad * 2) + 'px';
    sp.style.borderRadius = round ? '50%' : '14px';
  }
  function show(){
    var T = App.ui.cyTalk, el = talkEl(); if (!T) return;
    var f = T.sc.falas[T.i], txt = el.querySelector('.cyt-txt'), last = T.i === T.sc.falas.length - 1;
    T.k = 0; T.full = f.t;
    el.querySelector('.cyt-n').textContent = (T.i + 1) + '/' + T.sc.falas.length;
    el.querySelector('[data-a="cyTalkNext"]').textContent = last ? 'Fechar' : 'Continuar';
    spot(f.alvo);
    clearInterval(T.iv);
    if (!App.S.settings.motion) { txt.textContent = f.t; T.k = f.t.length; return; }
    txt.textContent = '';
    T.iv = setInterval(function(){ T.k = Math.min(T.full.length, T.k + 2); txt.textContent = T.full.slice(0, T.k); if (T.k >= T.full.length) clearInterval(T.iv); }, 24);
  }
  /* sc = {quem: id em CY.PERS, falas: [{t, alvo?}], fim: fn} */
  App.cyTalk = function(sc){
    var P = CY.PERS[sc.quem] || {n: sc.quem, cla: '', papel: ''}, el = talkEl(), d = CY.DMAP[P.d], wc = d ? App.way(d.way).color : 'var(--glow)';
    if (App.ui.cyTalk) clearInterval(App.ui.cyTalk.iv);
    App.ui.cyTalk = {sc: sc, i: 0, k: 0, full: ''};
    el.style.setProperty('--wc', wc);
    el.innerHTML = '<div class="cyt-dim"></div><div class="cyt-spot" hidden></div>' + (App.img(P.img) ? '<img class="cyt-por" src="' + App.img(P.img) + '" alt="' + U.esc(P.n) + '" draggable="false">' : '')
      + '<div class="cyt-box" role="dialog" aria-modal="true" aria-label="' + U.esc(P.n) + '"><div class="cyt-name"><b>' + U.esc(P.n) + '</b><span>' + U.esc([P.cla, P.papel].filter(Boolean).join(' · ')) + '</span></div>'
      + '<p class="cyt-txt" aria-live="polite"></p><div class="cyt-ft"><span class="cyt-n mono"></span><span class="cyt-hint">toque para continuar</span><button class="btn sm ghost" data-a="cyTalkSkip">Pular</button><button class="btn sm primary" data-a="cyTalkNext">Continuar</button></div></div>';
    el.classList.add('on');
    show();
    try { el.querySelector('[data-a="cyTalkNext"]').focus({preventScroll: true}); } catch(e){}
  };
  function end(){
    var T = App.ui.cyTalk; if (!T) return;
    clearInterval(T.iv); App.ui.cyTalk = null;
    var el = talkEl(); el.classList.remove('on'); el.innerHTML = '';
    if (T.sc.fim) T.sc.fim();
  }
  App.A.cyTalkNext = function(){
    var T = App.ui.cyTalk; if (!T) return;
    if (T.k < T.full.length) { clearInterval(T.iv); T.k = T.full.length; talkEl().querySelector('.cyt-txt').textContent = T.full; return; }
    if (T.i >= T.sc.falas.length - 1) { end(); return; }
    T.i++; show();
  };
  App.A.cyTalkSkip = function(){ end(); };
  App.cyTalkSync = function(){ var T = App.ui.cyTalk; if (T) spot(T.sc.falas[T.i].alvo); };
  window.addEventListener('resize', function(){ if (App.ui.cyTalk) setTimeout(App.cyTalkSync, 160); });

  /* a apresentação do Ivo: na primeira vez que a Cidade nova abre (a marca fica no save da Cidade, vale para todos os aparelhos) */
  App.cyIntro = function(){
    App.cyWinClear();
    App.cyTalk({quem: 'ivo', falas: CY.FALAS.ivoIntro, fim: function(){ var C = App.city; if (!C) return; C.vis = C.vis || {}; if (!C.vis.ivo) { C.vis.ivo = U.today(); App.commit(['city'], {norender: true}); } }});
  };
  App.A.cyIntro = function(){ App.cyIntro(); };
  App.cyMaybeIntro = function(){
    var C = App.city;
    if (!C || !C.since || App.ui.route !== 'cidade' || !App.S || !E.cityOn(App.S) || App.ui.cyTalk || App.ui.cyLoading || App.ui.modal || !App.cityReady()) return;
    if (C.vis && C.vis.ivo) return;
    App.cyIntro();
  };
})();
