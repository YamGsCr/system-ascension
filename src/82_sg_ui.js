/* ===== SHADOW GARDEN · tela: a atmosfera (nome, skin, voz), a convocação, a cerimônia e a aba do conselho =====
   A atmosfera é uma camada por cima do Sistema: os nomes das funções ficam, a voz e o visual mudam.
   Desligar nos Ajustes devolve tudo como era; o documento sg fica guardado. */
(function(){
  var SG = SYS.SG;
  function G(){ return App.sg; }
  function on(){ return App.sgOn(); }
  function hhmm(at){ var d = new Date(at); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

  /* ---------- sigilos (originais) e retratos, quando houver ---------- */
  App.sgSigil = function(id, size){
    var M = SG.MAP[id] || SG.MAP.alpha, s = size || 40, c = M.cor;
    var mid = id === 'shadow' ? '<path d="M24.5 10.5a9.6 9.6 0 1 0 0 19a7.6 7.6 0 1 1 0-19z" fill="' + c + '" opacity=".9"/>'
      : '<text x="20" y="26.4" text-anchor="middle" font-size="17" font-family="Georgia, \'Times New Roman\', serif" fill="' + c + '">' + M.letra + '</text>';
    return '<svg class="sg-sig" viewBox="0 0 40 40" width="' + s + '" height="' + s + '" role="img" aria-label="Sigilo de ' + U.esc(M.n) + '">'
      + '<circle cx="20" cy="20" r="18" fill="none" stroke="' + c + '" stroke-width="1.2" opacity=".85"/>'
      + '<rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)" fill="none" stroke="' + c + '" stroke-width=".8" opacity=".5"/>'
      + '<circle cx="20" cy="2.4" r="1.3" fill="' + c + '"/><circle cx="20" cy="37.6" r="1.3" fill="' + c + '"/>' + mid + '</svg>';
  };
  App.sgFace = function(id, size){
    var src = App.img('sg-' + id), s = size || 40;
    return src ? '<img class="sg-face" src="' + src + '" alt="' + U.esc((SG.MAP[id] || {}).n || '') + '" style="width:' + s + 'px;height:' + s + 'px" draggable="false">' : App.sgSigil(id, s);
  };

  /* ---------- atmosfera: skin, título, marca e voz ---------- */
  var oldSkin = App.applySkin;
  App.applySkin = function(){
    var r = oldSkin.apply(this, arguments), root = document.documentElement;
    if (on()) { root.setAttribute('data-skin', 'sk_sombras'); root.setAttribute('data-atmo', 'sombras'); }
    else if (root.hasAttribute('data-atmo')) root.removeAttribute('data-atmo');
    var t = on() ? SG.APP : 'System Ascension'; if (document.title !== t) document.title = t;
    return r;
  };
  var oldSide = App.renderSide;
  App.renderSide = function(){
    var r = oldSide.apply(this, arguments);
    if (on()) { var b = document.querySelector('.logo[data-a="logo"]'); if (b) { b.setAttribute('aria-label', SG.APP); b.innerHTML = '<span class="logo-mark">' + U.icon('moon') + '</span><span><b>Visão</b><small>de Ascensão das Sombras</small></span>'; } }
    return r;
  };
  function voz(s){ return String(s).replace(/\[Sistema\]/g, '[Visão]'); }
  function vozDom(root){
    if (!on() || !root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) if (n.nodeValue.indexOf('[Sistema]') >= 0) n.nodeValue = voz(n.nodeValue);
  }
  var oldToast = App.toast;
  App.toast = function(o){ if (o && on()) o = Object.assign({}, o, {t: voz(o.t || ''), s: o.s ? voz(o.s) : o.s}); return oldToast.call(this, o); };
  var oldRV = App.renderView;
  App.renderView = function(){ var r = oldRV.apply(this, arguments); vozDom(App.$('view')); App.sgAfter(); return r; };
  var oldRM = App.renderModal;
  App.renderModal = function(){ var r = oldRM.apply(this, arguments); vozDom(App.$('modal')); return r; };

  /* a aba no menu, logo depois da Cidade */
  var at = -1;
  App.NAV.forEach(function(n, k){ if (n && n[0] === 'cidade') at = k; });
  App.NAV.splice(at >= 0 ? at + 1 : 6, 0, ['garden', 'Shadow Garden', 'moon', function(){ return on(); }]);
  App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });

  /* ---------- ligar: nos Ajustes do Perfil, na tela da aba ou na convocação ---------- */
  function ligar(v){
    App.sgSet(v);
    App.toast(v ? {t: '[Visão] ' + SG.APP, s: 'O Shadow Garden abriu um canal. A aba do conselho está no menu.', ic: 'moon', ms: 6000}
      : {t: 'Visão desligada', s: 'O Sistema voltou ao normal. O Garden guarda tudo até você voltar.', ic: 'moon'});
  }
  App.C.pSombras = function(el){ ligar(el.checked); };
  App.A.sgOn = function(){ ligar(true); };
  App.M.sgConvite = function(){
    return '<section class="win sg-convite"><div class="win-h">' + U.icon('moon') + '[Sistema] Convocação</div><div class="stack" style="gap:14px;align-items:center;text-align:center">'
      + App.sgSigil('shadow', 64)
      + '<p>O Shadow Garden encontrou um agente na dimensão de origem do mestre.</p>'
      + '<p class="dim" style="font-size:13.5px">Aceitar muda o nome do app para <b>' + SG.APP + '</b>, veste a atmosfera do Garden e abre a aba do conselho. Dá para sair quando quiser, nos Ajustes.</p>'
      + '<div class="row" style="justify-content:center;gap:8px"><button class="btn ghost" data-a="sgConviteNao">Agora não</button><button class="btn primary" data-a="sgConviteSim">' + U.icon('moon') + 'Aceitar a convocação</button></div></div></section>';
  };
  /* aparece uma vez por sessão; "agora não" adia três dias. Pedidos da Zona e level ups vêm antes */
  App.sgConvite = function(){
    var S = App.S, ad = S && S.flags.sgAdiado;
    if (!S || !S._u || on() || S.flags.sgConvite || App.ui.sgVisto || App.ui.modal || App.ui.modalNext || App.ui.pz || App.ui.sgTalk) return false;
    if (ad && U.daysBetween(ad, U.today()) < 3) return false;
    if (window.__TESTPAGE && !window.__sgConvite) return false;   /* nas páginas de teste, só quando a suíte pede (tests/garden.js) */
    if (Store.waking || !Store.settled()) return false;
    App.ui.sgVisto = true; App.ui.modal = {type: 'sgConvite'}; App.renderModal();
    return true;
  };
  App.A.sgConviteSim = function(){ App.S.flags.sgConvite = U.today(); App.ui.modal = null; App.renderModal(); ligar(true); App.go('garden'); };
  App.A.sgConviteNao = function(){ App.S.flags.sgAdiado = U.today(); App.ui.modal = null; App.renderModal(); App.commit(['core'], {quiet: true}); };
  var oldTick = App.tick;
  App.tick = function(){ var r = oldTick.apply(this, arguments); App.sgConvite(); return r; };
  var oldInit = App.init;
  App.init = function(){ var r = oldInit.apply(this, arguments); setTimeout(App.sgConvite, 2500); return r; };

  /* ---------- cenas do conselho: placa de nome, texto que vai aparecendo, sigilo no lugar do retrato ---------- */
  function talkEl(){
    var el = document.getElementById('sgtalk');
    if (!el) { el = document.createElement('div'); el.id = 'sgtalk'; el.className = 'cyt sgt'; document.body.appendChild(el); el.addEventListener('click', function(ev){ if (ev.target.closest && ev.target.closest('[data-a]')) return; App.A.sgCenaNext(); }); }
    return el;
  }
  function show(){
    var T = App.ui.sgTalk, el = talkEl(); if (!T) return;
    var f = T.L[T.i], M = SG.MAP[f.quem] || SG.MAP.alpha, w = App.way(M.way), last = T.i === T.L.length - 1, src = App.img('sg-' + M.id);
    T.full = App.sgFill(f.t); T.k = 0;
    el.style.setProperty('--wc', M.cor);
    el.innerHTML = '<div class="cyt-dim"></div>' + (src ? '<img class="cyt-por" src="' + src + '" alt="" draggable="false">' : '<div class="sgt-face">' + App.sgSigil(M.id, 150) + '</div>')
      + '<div class="cyt-box" role="dialog" aria-modal="true" aria-label="' + U.esc(M.n) + '"><div class="cyt-name"><b>' + U.esc(M.n) + '</b><span>' + U.esc(M.id === 'shadow' ? 'o mestre' : 'Shadow Garden' + (w ? ' · ' + w.name : '')) + '</span></div>'
      + '<p class="cyt-txt" aria-live="polite"></p><div class="cyt-ft"><span class="cyt-n mono">' + (T.i + 1) + '/' + T.L.length + '</span><span class="cyt-hint">toque para continuar</span>'
      + '<button class="btn sm ghost" data-a="sgCenaSkip">Pular</button><button class="btn sm primary" data-a="sgCenaNext">' + (last ? 'Fechar' : 'Continuar') + '</button></div></div>';
    var p = el.querySelector('.cyt-txt'); clearInterval(T.iv);
    if (!App.S.settings.motion) { p.textContent = T.full; T.k = T.full.length; return; }
    T.iv = setInterval(function(){ T.k = Math.min(T.full.length, T.k + 2); p.textContent = T.full.slice(0, T.k); if (T.k >= T.full.length) clearInterval(T.iv); }, 24);
  }
  App.sgCena = function(lines, fim){
    var L = lines.filter(function(f){ return !f.shadow || G().shadow; });
    if (!L.length) return;
    if (App.ui.sgTalk) clearInterval(App.ui.sgTalk.iv);
    App.ui.sgTalk = {L: L, i: 0, k: 0, full: '', fim: fim};
    talkEl().classList.add('on'); show();
    try { talkEl().querySelector('[data-a="sgCenaNext"]').focus({preventScroll: true}); } catch(e){}
  };
  function end(){
    var T = App.ui.sgTalk; if (!T) return;
    clearInterval(T.iv); App.ui.sgTalk = null;
    var el = talkEl(); el.classList.remove('on'); el.innerHTML = '';
    if (T.fim) T.fim();
  }
  App.A.sgCenaNext = function(){
    var T = App.ui.sgTalk; if (!T) return;
    if (T.k < T.full.length) { clearInterval(T.iv); T.k = T.full.length; var p = document.querySelector('#sgtalk .cyt-txt'); if (p) p.textContent = T.full; return; }
    if (T.i >= T.L.length - 1) { end(); return; }
    T.i++; show();
  };
  App.A.sgCenaSkip = function(){ end(); };
  document.addEventListener('keydown', function(ev){
    if (!App.ui.sgTalk) return;
    if (ev.key === 'Escape') { ev.stopPropagation(); ev.preventDefault(); end(); }
    else if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'ArrowRight') { ev.stopPropagation(); ev.preventDefault(); App.A.sgCenaNext(); }
  }, true);
  App.sgEntrada = function(){
    App.sgCena(SG.ENTRADA, function(){ var g = G(); if (!g.vis.entrada) { g.vis.entrada = U.today(); App.commit(['sg'], {quiet: true, norender: true}); } });
  };
  App.A.sgEntrada = function(){ App.sgEntrada(); };

  /* ---------- a aba ---------- */
  function wayChip(w){ return w ? '<span class="chip" style="color:' + w.color + '">' + U.icon(w.icon) + U.esc(w.name) + '</span>' : ''; }
  function off(){
    return H.head('Shadow Garden', 'Shadow Garden', 'O conselho das Sete Sombras fala com você aqui, a partir do que o Sistema registra.')
      + '<section class="win"><div class="win-h">' + U.icon('moon') + SG.APP + '</div><div class="stack" style="gap:12px"><p>A aba aparece quando a Visão de Ascensão das Sombras está ligada. Ela muda o nome e a atmosfera do app; as funções continuam as mesmas.</p>'
      + '<div class="row"><button class="btn primary" data-a="sgOn">' + U.icon('moon') + 'Aceitar a convocação</button></div></div></section>';
  }
  function iaLinha(){
    var g = G();
    return App.sgIA() ? 'Respostas de IA hoje: ' + (g.iaDia - E.sgIaResta(g)) + ' de ' + g.iaDia : 'Linha cifrada: sem a IA nesta visualização, elas respondem com recados prontos.';
  }
  function conselho(){
    var g = G(), ph = App.img('eu-perfil'), ct = SG.MAP[g.contato] || SG.MAP.alpha;
    var agente = '<section class="win sg-agent"><div class="sg-agent-in">' + (ph ? '<img class="sg-agent-ph" src="' + ph + '" alt="" draggable="false">' : '')
      + '<div class="stack" style="gap:6px;min-width:0"><span class="eyebrow">Agente do Shadow Garden</span><h2>' + U.esc(App.sgNome()) + '</h2>'
      + '<div class="row" style="gap:6px">' + (g.cod ? '<span class="chip">Número ' + U.esc(g.num) + '</span>' : '') + '<span class="chip" style="color:' + ct.cor + '">contato direta: ' + ct.n + '</span><span class="chip">desde ' + U.fmtDate(g.since) + '</span></div>'
      + '<p class="dim" style="font-size:13.5px"><b>Missão:</b> ' + U.esc(SG.MISSAO) + '.</p><p class="dim" style="font-size:13.5px"><b>Sigilo:</b> ' + U.esc(SG.SIGILO) + '.</p></div></div></section>';
    var cards = SG.ORDEM.map(function(id){
      var M = SG.MAP[id], w = App.way(M.way), c = g.canal[id], u = App.sgNaoLidas(id), last = c.m[c.m.length - 1];
      return '<button class="sg-card" style="--sc:' + M.cor + '" data-a="sgOpen" data-id="' + id + '">' + App.sgFace(id, 48)
        + '<span class="stack" style="gap:3px;min-width:0"><b>' + M.n + (u ? ' <span class="sg-badge">' + u + '</span>' : '') + '</b>' + wayChip(w)
        + '<span class="sg-last">' + U.esc(last ? (last.de === 'eu' ? 'você: ' : '') + last.t : M.papel) + '</span></span>'
        + '<span class="sg-aff" title="Afinidade ' + g.afin[id] + '"><i style="width:' + g.afin[id] + '%"></i></span></button>';
    }).join('');
    if (g.shadow) cards += '<div class="sg-card off" style="--sc:' + SG.SHADOW.cor + '">' + App.sgSigil('shadow', 48) + '<span class="stack" style="gap:3px;min-width:0"><b>Shadow</b><span class="sg-last">o mestre observa; aparece nos marcos grandes</span></span></div>';
    return H.head('Shadow Garden', 'O conselho', 'Sete Sombras, sete Caminhos. Cada uma lê o que o Sistema registra e responde na voz dela.')
      + agente + '<div class="sg-roster">' + cards + '</div>'
      + '<div class="row between" style="gap:8px"><div class="row" style="gap:8px"><button class="btn sm" data-a="sgEntrada">' + U.icon('eye') + 'Rever a cerimônia de entrada</button><a class="btn sm ghost" href="#/garden/dossie">Dossiê</a><a class="btn sm ghost" href="#/garden/ajustes">Ajustes do Garden</a></div>'
      + '<span class="faint mono" style="font-size:11.5px">' + iaLinha() + '</span></div>';
  }
  function chatHTML(id){
    var g = G(), M = SG.MAP[id], c = g.canal[id], busy = App.ui.sgBusy === id;
    var msgs = c.m.map(function(x){
      var eu = x.de === 'eu';
      return '<div class="sg-msg ' + (eu ? 'eu' : 'ela') + '">' + (eu ? '' : '<span class="sg-msg-f">' + App.sgFace(id, 28) + '</span>') + '<div class="sg-bub"><p>' + U.esc(x.t) + '</p><span class="mono">' + hhmm(x.at) + (x.off ? ' · linha cifrada' : '') + '</span></div></div>';
    }).join('');
    if (busy) msgs += '<div class="sg-msg ela"><span class="sg-msg-f">' + App.sgFace(id, 28) + '</span><div class="sg-bub sg-typing"><i></i><i></i><i></i><span class="faint" style="font-size:12px">' + M.n + ' está escrevendo</span></div></div>';
    return msgs || '<p class="dim" style="font-size:13.5px">Nenhuma mensagem ainda.</p>';
  }
  function statusHTML(id){
    var err = App.ui.sgErr || '';
    return (err ? '<p class="bad" style="font-size:13px">' + U.esc(err) + (App.ui.sgRetry && App.ui.sgRetry.id === id ? ' <button class="act" data-a="sgRetry">tentar de novo</button>' : '') + '</p>' : '')
      + '<span class="faint mono" style="font-size:11.5px">' + iaLinha() + '</span>';
  }
  /* o humor da última resposta dela (só quando não é neutro) */
  function humorHTML(id){
    var last = G().canal[id].m.filter(function(x){ return x.de === id && x.h; }).slice(-1)[0];
    return last && last.h !== 'neutra' ? '<span class="chip">' + U.esc(last.h) + '</span>' : '';
  }
  function canal(id){
    var g = G(), M = SG.MAP[id], w = App.way(M.way);
    var draft = (App.ui.sgDraft || {})[id] || '', busy = !!App.ui.sgBusy;
    return '<section class="win sg-canal" style="--sc:' + M.cor + '"><div class="sg-canal-h"><a class="iconbtn" href="#/garden" aria-label="Voltar ao conselho">' + U.icon('back') + '</a>' + App.sgFace(id, 44)
      + '<div class="stack" style="gap:3px;min-width:0"><b class="sg-nome">' + M.n + '</b><span class="faint" style="font-size:12.5px">' + U.esc(M.papel) + '</span></div>'
      + '<div class="row" style="gap:6px;margin-left:auto">' + wayChip(w) + '<span id="sgHumor">' + humorHTML(id) + '</span></div></div>'
      + '<div class="sg-chat" id="sgChat" aria-live="polite">' + chatHTML(id) + '</div>'
      + '<div class="sg-quick">' + [['relatorio', 'Relatório de hoje'], ['tarefa', 'Me dá uma tarefa'], ['desabafo', 'Hoje tá difícil']].map(function(q){ return '<button class="chip" data-a="sgQuick" data-id="' + id + '" data-q="' + q[0] + '">' + q[1] + '</button>'; }).join('') + '</div>'
      + '<div class="sg-input"><textarea data-i="sgDraft" data-id="' + id + '" rows="2" maxlength="' + SG.TXT_MAX + '" placeholder="Mensagem para ' + M.n + ' (Enter envia, Shift+Enter quebra a linha)">' + U.esc(draft) + '</textarea>'
      + '<button class="btn primary" data-a="sgSend" data-id="' + id + '"' + (busy ? ' disabled' : '') + '>' + U.icon('check') + 'Enviar</button></div>'
      + '<div class="sg-status" id="sgStatus">' + statusHTML(id) + '</div></section>';
  }
  function dossie(){
    var g = G(), ct = SG.MAP[g.contato] || SG.MAP.alpha;
    var rows = [['Número', g.num], ['Contato direta', ct.n], ['No Garden desde', U.fmtDate(g.since)], ['Intensidade', g.intens], ['Missão', SG.MISSAO], ['Sigilo', SG.SIGILO]];
    var aff = SG.ORDEM.map(function(id){ var M = SG.MAP[id]; return '<div class="sg-affrow" style="--sc:' + M.cor + '">' + App.sgFace(id, 26) + '<b>' + M.n + '</b><span class="sg-aff"><i style="width:' + g.afin[id] + '%"></i></span><span class="mono dim" style="font-size:11.5px">' + g.afin[id] + '</span></div>'; }).join('');
    return H.head('Shadow Garden', 'Dossiê', 'A sua ficha no Garden. A afinidade sobe e desce com o que você conversa e entrega.')
      + '<section class="win"><div class="win-h">' + U.icon('user') + U.esc(App.sgNome()) + '<a class="act" href="#/garden">conselho</a></div><div class="stack" style="gap:12px">'
      + '<dl class="cy-rdlist">' + rows.map(function(r){ return '<dt>' + r[0] + '</dt><dd>' + U.esc(String(r[1])) + '</dd>'; }).join('') + '</dl>'
      + '<div class="row" style="gap:8px;align-items:flex-end"><label class="fld" style="flex:1;min-width:180px">Codinome (vazio = só o número)<input type="text" maxlength="24" data-i="sgCod" value="' + U.esc((App.ui.sgCod != null ? App.ui.sgCod : g.cod) || '') + '"></label><button class="btn" data-a="sgCodSave">Salvar</button></div></div></section>'
      + '<section class="win"><div class="win-h">' + U.icon('star') + 'Afinidade</div><div class="stack" style="gap:6px">' + aff + '</div></section>';
  }
  function ajustes(){
    var g = G();
    var seg = function(a, list, cur){ return '<div class="seg" role="group" style="align-self:flex-start">' + list.map(function(v){ return '<button class="' + (String(cur) === String(v[0]) ? 'on' : '') + '" data-a="' + a + '" data-v="' + v[0] + '" aria-pressed="' + (String(cur) === String(v[0])) + '">' + v[1] + '</button>'; }).join('') + '</div>'; };
    return H.head('Shadow Garden', 'Ajustes do Garden', 'Quem fala com você, com que força e quantas respostas de IA por dia.')
      + '<section class="win"><div class="win-h">' + U.icon('shield') + 'Conselho<a class="act" href="#/garden">voltar</a></div><div class="stack" style="gap:14px">'
      + '<label class="fld">Contato direta<select data-c="sgContato">' + SG.ORDEM.map(function(id){ return '<option value="' + id + '"' + (g.contato === id ? ' selected' : '') + '>' + SG.MAP[id].n + '</option>'; }).join('') + '</select></label>'
      + '<div class="stack" style="gap:6px"><span class="eyebrow">Intensidade</span>' + seg('sgIntens', [['leve', 'leve'], ['padrao', 'padrão'], ['pesada', 'pesada']], g.intens) + '<span class="faint" style="font-size:12.5px">' + U.esc(SG.INTENS[g.intens]) + '.</span></div>'
      + '<div class="stack" style="gap:6px"><span class="eyebrow">Respostas de IA por dia</span>' + seg('sgIaDia', SG.IA_DIA.map(function(n){ return [n, n]; }), g.iaDia) + '<span class="faint" style="font-size:12.5px">Cada resposta usa uns 3 mil tokens do seu uso do Claude.</span></div>'
      + '<label class="check"><input type="checkbox" data-c="sgShadow"' + (g.shadow ? ' checked' : '') + '><span><b>Shadow nas cenas</b><br><span class="dim" style="font-size:13.5px">O mestre aparece, raro, nas cenas do conselho.</span></span></label>'
      + '</div></section>'
      + '<section class="win"><div class="win-h">' + U.icon('moon') + 'Saída</div><div class="stack" style="gap:10px"><p class="dim" style="font-size:13.5px">Desligar devolve o nome, a voz e o visual do Sistema de sempre e esconde a aba. Nada do Garden se perde.</p>'
      + '<div class="row"><button class="btn danger" data-a="sgSair">Desligar a ' + SG.APP + '</button></div></div></section>';
  }
  App.V.garden = function(){
    if (!on()) return off();
    var p = App.ui.param;
    if (p && SG.MAP[p] && p !== 'shadow') return canal(p);
    if (p === 'dossie') return dossie();
    if (p === 'ajustes') return ajustes();
    return conselho();
  };
  /* depois de desenhar: a cerimônia na primeira visita, a saudação e a leitura do canal aberto */
  App.sgAfter = function(){
    if (App.ui.route !== 'garden' || !on()) return;
    var g = G(), p = App.ui.param;
    if (!g.vis.entrada && !App.ui.sgTalk && !App.ui.modal) { setTimeout(function(){ if (!G().vis.entrada && !App.ui.sgTalk) App.sgEntrada(); }, 0); return; }
    if (p && g.canal[p]) {
      var c = g.canal[p], mudou = App.sgSaudar(p), u = App.sgNaoLidas(p);
      if (u || mudou) { c.lido = new Date().toISOString(); Store.asAuto(function(){ App.commit(['sg'], {quiet: true, norender: true}); }); if (mudou) App.sgPaint(); }
      var ch = App.$('sgChat'); if (ch) ch.scrollTop = ch.scrollHeight;
    }
  };
  /* redesenha só a conversa e o rodapé: o que você está digitando fica onde está */
  App.sgPaint = function(){
    var id = App.ui.param, ch = App.$('sgChat'), st = App.$('sgStatus');
    if (App.ui.route !== 'garden' || !ch || !SG.MAP[id]) { if (App.ui.route === 'garden' && !App.typing()) App.renderView(); return; }
    ch.innerHTML = chatHTML(id); ch.scrollTop = ch.scrollHeight;
    if (st) st.innerHTML = statusHTML(id);
    var hm = App.$('sgHumor'); if (hm) hm.innerHTML = humorHTML(id);
    var b = document.querySelector('.sg-input [data-a="sgSend"]'); if (b) b.disabled = !!App.ui.sgBusy;
  };

  /* ---------- ações ---------- */
  App.A.sgOpen = function(el){ App.ui.sgErr = ''; App.go('garden/' + el.getAttribute('data-id')); };
  App.I.sgDraft = function(el){ (App.ui.sgDraft || (App.ui.sgDraft = {}))[el.getAttribute('data-id')] = el.value; };
  App.A.sgSend = function(el){
    var id = el.getAttribute('data-id'), D = App.ui.sgDraft || (App.ui.sgDraft = {}), ta = document.querySelector('.sg-input textarea');
    var txt = D[id] != null ? D[id] : (ta ? ta.value : '');
    if (App.sgSend(id, txt)) { D[id] = ''; if (ta) ta.value = ''; }
  };
  App.A.sgRetry = function(){ var r = App.ui.sgRetry; if (!r || App.ui.sgBusy) return; App.ui.sgErr = ''; App.sgPaint(); App.sgAsk(r.id, r.prompt); App.sgPaint(); };
  var QUICK = {relatorio: 'Relatório de hoje: ', tarefa: 'Me dá uma tarefa para hoje.', desabafo: 'Hoje tá difícil: '};
  App.A.sgQuick = function(el){
    var id = el.getAttribute('data-id'), D = App.ui.sgDraft || (App.ui.sgDraft = {}), ta = document.querySelector('.sg-input textarea');
    D[id] = QUICK[el.getAttribute('data-q')] || ''; if (ta) { ta.value = D[id]; try { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); } catch(e){} }
  };
  document.addEventListener('keydown', function(ev){
    var t = ev.target; if (ev.key !== 'Enter' || ev.shiftKey || !t || !t.matches || !t.matches('.sg-input textarea')) return;
    ev.preventDefault(); var b = document.querySelector('.sg-input [data-a="sgSend"]'); if (b && !b.disabled) App.A.sgSend(b);
  });
  App.I.sgCod = function(el){ App.ui.sgCod = el.value; };
  App.A.sgCodSave = function(){
    var v = String(App.ui.sgCod != null ? App.ui.sgCod : G().cod).trim().slice(0, 24); G().cod = v; App.ui.sgCod = null;
    App.commit(['sg']); App.toast({t: v ? 'Codinome: ' + v : 'Sem codinome', s: v ? 'O conselho passa a te chamar assim.' : 'O conselho volta a usar o seu número.', ic: 'moon'});
  };
  App.C.sgContato = function(el){ if (!SG.MAP[el.value]) return; G().contato = el.value; App.commit(['sg']); };
  App.A.sgIntens = function(el){ var v = el.getAttribute('data-v'); if (!SG.INTENS[v]) return; G().intens = v; App.commit(['sg']); };
  App.A.sgIaDia = function(el){ var v = +el.getAttribute('data-v'); if (SG.IA_DIA.indexOf(v) < 0) return; G().iaDia = v; App.commit(['sg']); };
  App.C.sgShadow = function(el){ G().shadow = !!el.checked; App.commit(['sg']); };
  App.A.sgSair = function(){ ligar(false); App.go('status'); };
})();
