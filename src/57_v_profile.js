/* ===== VIEW: Perfil (cartão, vitrine, identidade, ajustes, save) ===== */
App.profileCard = function(){
  var S = App.S, D = App.D, P = S.profile, nc = (P.namecard || 'nc_window').replace('nc_', 'nc-');
  var sc = P.showcase.filter(function(id){ return E.ACHMAP[id] && S.ach[id]; });
  var max = S.owned.showcase12 ? 12 : 8, slots = ''; for (var i = 0; i < max; i++) { var a = sc[i] && E.ACHMAP[sc[i]]; slots += a ? '<button class="slot" data-a="achOpen" data-id="'+a.id+'" title="'+U.esc(a.n)+'" style="cursor:pointer">'+U.medal(a, {size:64})+'</button>' : '<a class="slot" href="#/conquistas" title="Fixar medalha" style="color:var(--faint)">'+U.icon('plus')+'</a>'; }
  return '<section class="namecard"><div class="ncbg '+nc+'"></div><div class="ncin">'+H.avatar(96)
    + '<div class="stack" style="gap:6px;min-width:0"><span class="pname pc-name '+H.fx()+'">'+U.esc(H.pname())+'</span><span class="ptitle" style="color:var(--glow)">'+U.esc(H.ptitle())+'</span><span class="mono dim" style="font-size:12px">NÍVEL '+D.level+' · '+U.esc(D.grank.n).toUpperCase()+' · '+U.num(D.xp)+' XP</span><span class="pc-sig" style="font-style:italic;color:var(--text);opacity:.85">“'+U.esc(P.sig || '…')+'”</span></div>'
    + '<div class="rank">'+D.letter+'</div></div>'
    + '<div style="position:relative;padding:0 22px 18px"><div class="showcase'+(max > 8 ? ' s12' : '')+'">'+slots+'</div></div></section>';
};
App.V.perfil = function(){
  var S = App.S, D = App.D, P = S.profile;
  var h = H.head('Cartão do jogador', 'Perfil', 'Seu cartão estilo namecard, a vitrine com 8 medalhas, identidade, cosméticos, ajustes e o save.');
  h += App.profileCard();
  h += '<div class="kpis">'+[[D.achCount,'conquistas'],[D.nodesDone,'nós'],[D.gatesDone,'selos'],[D.bossesDone,'bosses'],[D.bestStreak,'melhor sequência'],[D.booksRead,'livros aplicados']].map(function(k){ return '<div class="kpi"><b>'+U.num(k[0])+'</b><span>'+k[1]+'</span></div>'; }).join('')+'</div>';
  var ident = '<section class="win"><div class="win-h">'+U.icon('user')+'Identidade</div><div class="stack" style="gap:10px">'
    + '<label class="fld">Nome do jogador<input type="text" data-i="pName" data-c="pCommit" maxlength="32" value="'+U.esc(P.name)+'" placeholder="'+U.esc((App.me && App.me.name) || 'Seu nome')+'"></label>'
    + '<label class="fld">Assinatura (frase do cartão)<input type="text" data-i="pSig" data-c="pCommit" maxlength="90" value="'+U.esc(P.sig)+'"></label>'
    + '<div class="stack" style="gap:6px"><span class="eyebrow">Avatar</span><div class="seg" role="group" aria-label="Avatar">'+[['sigil','Inicial'],['emoji','Emoji']].concat(App.me && App.me.avatarUrl ? [['claude','Foto da conta']] : []).map(function(o){ return '<button class="'+(P.avatar === o[0] ? 'on' : '')+'" data-a="pAvatar" data-s="'+o[0]+'">'+o[1]+'</button>'; }).join('')+'</div>'
    + (P.avatar === 'emoji' ? '<label class="fld">Emoji<input type="text" data-i="pEmoji" data-c="pCommit" maxlength="8" value="'+U.esc(P.emoji)+'" style="max-width:120px"></label>' : '')+'</div>'
    + '<label class="fld">Título equipado<select data-c="pTitle"><option value="">— nenhum —</option>'+(S.owned.custom && S.customTitle ? '<option value="custom"'+(P.title === 'custom' ? ' selected' : '')+'>'+U.esc(S.customTitle)+' (custom)</option>' : '')+E.TITLES.filter(function(t){ return E.titleUnlocked(S, D, t); }).map(function(t){ return '<option value="'+t.id+'"'+(P.title === t.id ? ' selected' : '')+'>'+U.esc(t.n)+'</option>'; }).join('')+'</select></label>'
    + '</div></section>';
  function owned(list, kind){ return list.filter(function(x){ return E.ownsCosmetic(S, list, x.id, kind); }); }
  var cos = '<section class="win"><div class="win-h">'+U.icon('sparkle')+'Cosméticos<a class="act" href="#/lojas/sistema">loja ◆ →</a></div><div class="stack" style="gap:10px">'
    + '<label class="fld">Skin da interface<select data-c="pCos" data-k="skins">'+owned(SYS.SKINS, 'skins').map(function(x){ return '<option value="'+x.id+'"'+(S.settings.skin === x.id ? ' selected' : '')+'>'+U.esc(x.n)+'</option>'; }).join('')+'</select></label>'
    + '<label class="fld">Namecard<select data-c="pCos" data-k="namecards">'+owned(SYS.NAMECARDS, 'namecards').map(function(x){ return '<option value="'+x.id+'"'+(P.namecard === x.id ? ' selected' : '')+'>'+U.esc(x.n)+'</option>'; }).join('')+'</select></label>'
    + '<label class="fld">Moldura<select data-c="pCos" data-k="frames">'+owned(SYS.FRAMES, 'frames').map(function(x){ return '<option value="'+x.id+'"'+(P.frame === x.id ? ' selected' : '')+'>'+U.esc(x.n)+'</option>'; }).join('')+'</select></label>'
    + '<label class="fld">Efeito no nome<select data-c="pCos" data-k="fx"><option value="">— nenhum —</option>'+SYS.FX.filter(function(x){ return (S.owned.fx || []).indexOf(x.id) >= 0; }).map(function(x){ return '<option value="'+x.id+'"'+(P.fx === x.id ? ' selected' : '')+'>'+U.esc(x.n)+'</option>'; }).join('')+'</select></label>'
    + '<div class="stack" style="gap:6px"><span class="eyebrow">Vitrine ('+P.showcase.length+'/'+(S.owned.showcase12 ? 12 : 8)+')</span>'+(P.showcase.length ? '<div class="row" style="gap:6px">'+P.showcase.map(function(id, i){ var a = E.ACHMAP[id]; if (!a) return ''; return '<span class="chip" style="color:'+SYS.RARITY[a.r].c+'">'+U.esc(a.n)+'<button class="linkbtn" data-a="scMove" data-i2="'+i+'" data-d="-1" aria-label="Mover para a esquerda"'+(i === 0 ? ' disabled' : '')+'>‹</button><button class="linkbtn" data-a="scMove" data-i2="'+i+'" data-d="1" aria-label="Mover para a direita"'+(i === P.showcase.length-1 ? ' disabled' : '')+'>›</button><button class="linkbtn" data-a="scRm" data-i2="'+i+'" aria-label="Remover">✕</button></span>'; }).join('')+'</div>' : '<span class="faint" style="font-size:13px">Abra uma conquista desbloqueada e toque em “Fixar na vitrine”.</span>')+'</div>'
    + '</div></section>';
  var sets = '<section class="win"><div class="win-h">'+U.icon('shield')+'Ajustes</div><div class="stack" style="gap:6px">'
    + '<label class="check"><input type="checkbox" data-c="pOpenWorld"'+(S.settings.openWorld ? ' checked' : '')+'><span><b>Modo Mundo Aberto</b><br><span class="dim" style="font-size:13.5px">Remove as travas de arco e pré-requisitos de selo. Útil se você já domina um arco — mas lembre: “vi a matéria” não conta. Evidências dos selos continuam exigidas.</span></span></label>'
    + '<label class="fld" style="margin:4px 0 6px">Hora do reset diário (o dia do Sistema vira nesse horário)<select data-c="pReset">'+[4,5,6,7,8,9,10].map(function(h){ return '<option value="'+h+'"'+(+S.settings.resetHour === h ? ' selected' : '')+'>'+String(h).padStart(2,'0')+':00'+(h === 8 ? ' (padrão)' : '')+'</option>'; }).join('')+'</select></label>'
    + '<label class="check"><input type="checkbox" data-c="pMotion"'+(S.settings.motion ? ' checked' : '')+'><span><b>Animações</b><br><span class="dim" style="font-size:13.5px">Janelas do Sistema “materializando”, brilhos e molduras animadas.</span></span></label>'
    + '<label class="check"><input type="checkbox" data-c="pCity"'+(S.settings.cityBeta ? ' checked' : '')+'><span><b>Cidade (beta)</b><br><span class="dim" style="font-size:13.5px">Liga a aba Cidade: portais nascem todo dia nos 7 distritos, com prazo, drop e Licença de Caçador. Desligada, a Cidade congela: nada vence nem quebra.</span></span></label>'
    + '<p class="faint mono" style="font-size:11.5px;margin-top:6px">Início no Sistema: '+U.fmtDate(S.start)+' · principais desde '+U.fmtDate(S.settings.season.start)+'</p></div></section>';
  var sizes = Store.DOCS.map(function(k){ var n = JSON.stringify(App.docs()[k]).length; return '<div class="stack" style="gap:3px"><div class="row between mono" style="font-size:11.5px"><span>'+{core:'Progresso',journal:'Diário & Mundo Aberto',notes:'Notas das quests',city:'Cidade'}[k]+'</span><span class="dim">'+Math.round(n/1024)+' KB / '+Math.round(Store.LIMIT/1000)+' KB</span></div>'+H.bar(U.pct(n, Store.LIMIT), n > 200000 ? 'warnbar thin' : 'thin')+'</div>'; }).join('');
  var save = '<section class="win"><div class="win-h">'+U.icon('cloud')+'Save</div><div class="stack" style="gap:10px"><p id="syncbox" style="font-size:14px">'+App.syncDetail()+'</p>'+sizes
    + '<div class="row"><button class="btn" data-a="exportSave">'+U.icon('download')+'Exportar save (.json)</button><button class="btn" data-a="importSave">'+U.icon('upload')+'Importar save</button></div>'
    + '<div class="hr"></div><div class="row between"><span class="dim" style="font-size:13.5px">Recomeçar do zero apaga progresso, diário, notas e a Cidade.</span><button class="btn sm danger" data-a="resetOpen">'+U.icon('trash')+'Resetar Sistema</button></div></div></section>';
  return h + '<div class="grid g2" style="align-items:start"><div class="stack" style="gap:16px">'+ident+sets+'</div><div class="stack" style="gap:16px">'+cos+save+'</div></div>';
};
App.I.pName = function(el){ App.S.profile.name = el.value.slice(0, 32); App.debSave('core'); document.querySelectorAll('.pc-name').forEach(function(n){ n.textContent = H.pname(); }); };
App.I.pSig = function(el){ App.S.profile.sig = el.value.slice(0, 90); App.debSave('core'); document.querySelectorAll('.pc-sig').forEach(function(n){ n.textContent = '“' + (App.S.profile.sig || '…') + '”'; }); };
App.I.pEmoji = function(el){ App.S.profile.emoji = el.value.slice(0, 8); App.debSave('core'); };
App.C.pCommit = function(){ App.commit(['core'], {norender:true}); App.renderHud(); App.renderSide(); };
App.A.pAvatar = function(el){ App.S.profile.avatar = el.getAttribute('data-s'); App.commit(['core']); };
App.C.pTitle = function(el){ App.S.profile.title = el.value || null; App.commit(['core']); };
App.C.pCos = function(el){ var k = el.getAttribute('data-k'); App.A.cosEquip({getAttribute:function(a){ return a === 'data-k' ? k : el.value; }}); };
App.C.pOpenWorld = function(el){ App.S.settings.openWorld = el.checked; App.commit(['core']); App.toast({t:el.checked ? 'Mundo Aberto ativado' : 'Travas restauradas', s:el.checked ? 'Poder ilimitado, responsabilidade idem. O Sistema está de olho.' : 'A Regra do Portão voltou a valer.', ic:el.checked ? 'map' : 'lock'}); };
App.C.pMotion = function(el){ App.S.settings.motion = el.checked; App.commit(['core']); };
App.A.scMove = function(el){ var sc = App.S.profile.showcase, i = +el.getAttribute('data-i2'), j = i + (+el.getAttribute('data-d')); if (j < 0 || j >= sc.length) return; var t = sc[i]; sc[i] = sc[j]; sc[j] = t; App.commit(['core']); };
App.A.scRm = function(el){ App.S.profile.showcase.splice(+el.getAttribute('data-i2'), 1); App.commit(['core']); };

/* ---------- save: exportar, importar, resetar ---------- */
App.saveJSON = function(){ return JSON.stringify({app:'system-ascension', v:2, exportedAt:new Date().toISOString(), core:App.S, journal:App.J, notes:App.N, city:App.city}, null, 1); };
App.A.exportSave = function(){
  var data = App.saveJSON(), name = 'system-ascension-save-' + U.today() + '.json';
  if (App.downloads && App.downloads.save) {
    App.downloads.save({filename:name, data:data}).then(function(){ App.toast({t:'Save exportado', s:name, ic:'download'}); }).catch(function(e){
      var c = e && e.code; if (c === 'declined') return;
      if (c === 'rate_limited') { App.toast({t:'Aguarde', s:'Já existe um pedido de download aberto.', ic:'clock'}); return; }
      App.ui.modal = {type:'exportText'}; App.renderModal();
    });
  } else { App.ui.modal = {type:'exportText'}; App.renderModal(); }
};
App.M.exportText = function(){
  return '<section class="win wide"><div class="win-h">'+U.icon('download')+'Exportar save<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><p class="dim" style="font-size:14px">O download de arquivo não está disponível nesta visualização. Copie o texto abaixo e guarde num arquivo <b>.json</b>.</p><textarea readonly rows="12" style="font:12px/1.4 var(--f-mono)">'+U.esc(App.saveJSON())+'</textarea><div class="row" style="justify-content:flex-end"><button class="btn primary" data-a="copySave">'+U.icon('check')+'Copiar</button></div></div></section>';
};
App.A.copySave = function(){ var ta = App.$('modal').querySelector('textarea'); if (!ta) return; ta.focus(); ta.select(); var ok = false; try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(ta.value).then(function(){ App.toast({t:'Copiado', s:'Cole num arquivo .json e guarde bem.', ic:'check'}); }, function(){ try { document.execCommand('copy'); } catch(e){} }); return; } ok = document.execCommand('copy'); } catch(e){} App.toast({t:ok ? 'Copiado' : 'Selecione e copie', s:ok ? 'Cole num arquivo .json.' : 'Use Ctrl+C / copiar.', ic:'check'}); };
App.A.importSave = function(){ var inp = App.$('importFile'); inp.value = ''; inp.click(); };
App.onImportFile = function(ev){
  var file = ev.target.files && ev.target.files[0]; if (!file) return;
  if (file.size > 3000000) { App.toast({t:'Arquivo grande demais', s:'Um save do Sistema tem poucos KB.', ic:'alert'}); return; }
  var r = new FileReader();
  r.onload = function(){
    var o; try { o = JSON.parse(r.result); } catch(e){ App.toast({t:'Arquivo inválido', s:'Não é um JSON válido.', ic:'alert'}); return; }
    if (!o || o.app !== 'system-ascension' || !o.core || typeof o.core !== 'object' || !o.core.profile || !o.core.nodes) { App.toast({t:'Save não reconhecido', s:'Esse arquivo não parece um save do System Ascension.', ic:'alert'}); return; }
    App.ui.modal = {type:'import', data:o}; App.renderModal();
  };
  r.readAsText(file);
};
App.M.import = function(m){
  var c = m.data.core, n = Object.keys(c.nodes || {}).filter(function(k){ return c.nodes[k] && c.nodes[k].s === 'done'; }).length;
  return '<section class="win"><div class="win-h" style="color:var(--warn)">'+U.icon('upload')+'Importar save<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><p>Save de <b>'+U.esc((c.profile && c.profile.name) || 'Player')+'</b>, exportado em '+U.fmtDate(m.data.exportedAt || '')+': '+n+' nós concluídos, '+Object.keys(c.ach || {}).length+' conquistas.</p><div class="callout fail" style="font-size:14px">Isso <b>substitui</b> todo o progresso, diário, notas e a Cidade atuais. Exporte o save atual antes, se quiser guardar.'+(m.data.city && typeof m.data.city === 'object' ? '' : ' Este arquivo é de antes da Cidade: ela volta ao começo.')+'</div><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn danger" data-a="importDo">Substituir e importar</button></div></div></section>';
};
App.A.importDo = function(){
  var m = App.ui.modal; if (!m || !m.data) return; var o = m.data;
  App.S = E.fill(o.core, E.newState()); App.J = E.fill(o.journal && typeof o.journal === 'object' ? o.journal : E.newJournal(), E.newJournal()); App.N = E.fill(o.notes && typeof o.notes === 'object' ? o.notes : E.newNotes(), E.newNotes());
  App.city = E.cityFill(o.city && typeof o.city === 'object' ? o.city : E.newCity()); App.ui.cy = null;
  App.ui.modal = null; E.checkAch(App.S, App.J); App.D = E.derive(App.S, App.J);
  App.commit(['core','journal','notes','city'], {quiet:true});
  App.toast({t:'Save importado', s:'Bem-vindo de volta, '+H.pname()+'.', ic:'upload'});
};
App.A.resetOpen = function(){ App.ui.modal = {type:'reset', txt:''}; App.renderModal(); };
App.M.reset = function(m){
  return '<section class="win"><div class="win-h" style="color:var(--bad)">'+U.icon('alert')+'Resetar Sistema<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><p>Isso apaga <b>todo</b> o progresso, conquistas, compras, diário, notas e a Cidade — neste navegador e na sua conta. Não tem volta.</p><label class="fld">Digite RESETAR para confirmar<input type="text" data-i="resetTxt" value="'+U.esc(m.txt || '')+'" autocomplete="off"></label><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn danger" data-a="resetDo"'+(m.txt === 'RESETAR' ? '' : ' disabled')+'>Apagar tudo</button></div></div></section>';
};
App.I.resetTxt = function(el){ if (!App.ui.modal) return; App.ui.modal.txt = el.value.trim().toUpperCase(); var b = App.$('modal').querySelector('[data-a="resetDo"]'); if (b) b.disabled = App.ui.modal.txt !== 'RESETAR'; };
App.A.resetDo = function(){
  if (!App.ui.modal || App.ui.modal.txt !== 'RESETAR') return;
  App.S = E.newState(); App.J = E.newJournal(); App.N = E.newNotes(); App.city = E.cityFill(E.newCity()); App.ui.modal = null; App.ui.f = {}; App.ui.cy = null;
  App.D = E.derive(App.S, App.J); App.commit(['core','journal','notes','city'], {quiet:true}); App.go('status');
  App.toast({t:'Sistema reiniciado', s:'Nível 1 de novo. O NPC voltou. Bora.', ic:'sparkle'});
};

App.C.pReset = function(el){ var S = App.S, h = +el.value; if (isNaN(h)) return; S.settings.resetHour = h; S.flags.fzDay = U.today(); App._day = U.today(); App.commit(['core']); App.toast({t:'Reset às ' + String(h).padStart(2, '0') + ':00', s:'O dia do Sistema agora vira nesse horário. Diárias de hoje continuam onde estavam.', ic:'clock'}); };
