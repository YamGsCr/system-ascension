(function(){
  var M = window.__mock = {db:{}, listeners:{}, saves:[], samples:[], writes:0};
  function snap(path){ var has = Object.prototype.hasOwnProperty.call(M.db, path); var body = has ? JSON.parse(M.db[path]) : undefined; return {exists:has, data:function(){ return body ? JSON.parse(JSON.stringify(body)) : undefined; }, metadata:{fromCache:false, hasPendingWrites:false}, id:path.split('/').pop()}; }
  /* latência opcional (window.__lat = {get, set, echo, sub} em ms) para ensaiar a nuvem lenta */
  function lat(k, d){ var L = window.__lat || {}; return L[k] == null ? d : L[k]; }
  function later(ms, fn){ return new Promise(function(res){ if (!ms) return res(fn()); setTimeout(function(){ res(fn()); }, ms); }); }
  var db = {doc:function(path){ return {
    get:function(){ return later(lat('get', 0), function(){ return snap(path); }); },
    set:function(data){ M.writes++; if (JSON.stringify(data).length > 256000) return Promise.reject({code:'invalid_argument', message:'too big'}); var body = JSON.stringify(data);
      return later(lat('set', 0), function(){ M.db[path] = body; setTimeout(function(){ var sn = snap(path); (M.listeners[path] || []).forEach(function(fn){ fn(sn); }); }, lat('echo', 30)); }); },
    onSnapshot:function(next){ (M.listeners[path] = M.listeners[path] || []).push(next); setTimeout(function(){ next(snap(path)); }, lat('sub', 60)); return function(){}; }
  }; }};
  var user = {id:function(){ return Promise.resolve('u_test'); }, me:function(){ return Promise.resolve({id:'u_test', name:'Yam Teste', avatarUrl:'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%234fb3ff"/></svg>', color:'#4fb3ff', email:null, isOwner:true, canEdit:true}); }};
  function sample(input, opts){ M.samples.push(input); return new Promise(function(res){ setTimeout(function(){ res({text:'ok', truncated:false, modelTierApplied:'default'}); }, 200); }); }
  sample.json = function(input, opts){
    M.samples.push(String(input).slice(0, 200));
    return new Promise(function(res, rej){ setTimeout(function(){
      if (opts && opts.signal && opts.signal.aborted) return rej({code:'cancelled', message:'x'});
      var s = String(input);
      if (s.indexOf('array JSON de 3 strings') >= 0) return res(['O que é X e onde ele deixa de funcionar?', 'Entre A e B, qual escolheria para uma pousada com 12 chalés e por quê?', 'Como você detecta e recupera uma falha de X em produção?']);
      if (window.__mockFail) return rej({code:window.__mockFail, message:'x'});
      if (s.indexOf('=== QUEM VOCÊ É ===') >= 0) { M.sg = s; return res(window.__mockSg || {fala:'Relatório recebido. Agora o que importa: qual é a entrega de hoje?', humor:'neutra', memoria:'Mandou o primeiro relatório.', afinidade:1}); }
      if (s.indexOf('LISTA DE EXERC') >= 0) return res(window.__mockTreino || {titulo:'Circuito do Faltoso', minutos:16, voltas:4, descanso:'60 s entre voltas', itens:[{nome:'Flexão (inclinada na mesa)', qtd:'10'},{nome:'Agachamento (com apoio)', qtd:'15'},{nome:'Prancha (de joelhos)', qtd:'30 s'},{nome:'Afundo (meio afundo)', qtd:'8 por perna'}], frase:'Dezesseis minutos. Você tinha setenta.'});
      if (s.indexOf('BRIEFING DE UMA P') >= 0) return res({nota:window.__mockNota == null ? 78 : window.__mockNota, resumo:'Briefing direto, com decisão e risco tratado.', faltou:['Faltou o custo da segunda opção']});
      if (s.indexOf('BRIEFING DE CEN') >= 0) return res({caminho:'founder', titulo:'O fornecedor sumiu', cenario:'Faltam 6 dias para a entrega de 40 máquinas a um cliente corporativo e o fornecedor principal parou de responder. O sinal de 30% já foi pago. Existe um segundo fornecedor 18% mais caro com prazo de 5 dias, e o contrato tem multa de 10% por atraso.', tarefa:'Briefing com a situação, as três opções com custo, a recomendação, o risco principal e a mensagem ao cliente.', frase:'Seis dias. Decide.'});
      if (s.indexOf('Mundo Aberto') >= 0) return res({titulo:'VLANs do resort', missao:'Desenhar e testar VLANs separando hóspedes, câmeras e gestão.', criterio:'Hóspede não alcança câmera; roaming funciona entre módulos.', falha:'Trunk mal configurado derruba o Wi-Fi inteiro.'});
      res({nota:82, veredito:'APROVADO', resumo:'Explicação sólida. Quase me convenceu que você sabe o que está fazendo.', acertos:['Definiu bem o conceito','Deu exemplo real'], lacunas:['Não mediu custo'], erros:[], falha:'Tratou falha e recuperação de forma razoável.', perguntas:['E se o link cair?','Qual o custo?','Como testaria?'], proximo_passo:'Escreva um ADR curto.'});
    }, 400); });
  };
  sample.limits = function(){ return Promise.resolve({maxPromptBytes:65536}); };
  var downloads = {save:function(o){ M.saves.push({filename:o.filename, size:String(o.data).length}); return Promise.resolve({status:'saved'}); }};
  var caps = {db:db, user:user, sample:sample, downloads:downloads};
  window.claude = {use:function(name){ return new Promise(function(res){ setTimeout(function(){ res(caps[name] || null); }, 40); }); }};
})();
