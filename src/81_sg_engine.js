/* ===== SHADOW GARDEN · motor: o 5º documento (sg), o retrato do Sistema, o prompt de cada membro e a conversa =====
   O documento sg só passa a existir na nuvem quando a Visão de Ascensão das Sombras é ligada, como a Cidade.
   Nada do que as personagens dizem sai do nada: o prompt leva o retrato com os dados reais do Sistema. */
(function(){
  var SG = SYS.SG;
  function dia(at){ var t = Date.parse(at || ''); return isNaN(t) ? '' : U.ymd(new Date(t - U.resetHour() * 3600000)); }
  App.sgDia = dia;

  /* ---------- o 5º documento ---------- */
  Store.KEYS.sg = 'sysasc.sg.v1'; Store.DOCS.push('sg'); Store.LABEL.sg = 'Shadow Garden';
  E.newSg = function(){
    var afin = {}, canal = {};
    SG.ORDEM.forEach(function(id){ afin[id] = id === 'alpha' ? 20 : 10; canal[id] = {m: [], mem: '', lido: ''}; });
    return {_u: '', v: 1, since: '', num: '', cod: '', contato: 'alpha', intens: 'padrao', iaDia: 20, shadow: true, afin: afin, canal: canal, ia: {dia: '', n: 0}, vis: {}};
  };
  E.sgFill = function(G){
    G = (G && typeof G === 'object' && !Array.isArray(G)) ? G : E.newSg();
    E.fill(G, E.newSg());
    SG.ORDEM.forEach(function(id){
      var c = G.canal[id]; if (!Array.isArray(c.m)) c.m = [];
      if (typeof c.mem !== 'string') c.mem = ''; if (typeof c.lido !== 'string') c.lido = '';
      G.afin[id] = Math.max(0, Math.min(100, Math.round(+G.afin[id]) || 0));
    });
    if (!SG.MAP[G.contato] || G.contato === 'shadow') G.contato = 'alpha';
    if (!SG.INTENS[G.intens]) G.intens = 'padrao';
    G.iaDia = Math.max(5, Math.min(60, Math.round(+G.iaDia) || 20));
    return G;
  };
  /* o documento fica bem abaixo do limite da nuvem: 24 mensagens por membro, e 12 se as mensagens forem muito longas */
  E.sgPrune = function(G){
    SG.ORDEM.forEach(function(id){ var c = G.canal[id]; if (c && c.m.length > SG.MSG_MAX) c.m = c.m.slice(-SG.MSG_MAX); });
    if (JSON.stringify(G).length > 180000) SG.ORDEM.forEach(function(id){ var c = G.canal[id]; if (c && c.m.length > 12) c.m = c.m.slice(-12); });
  };
  /* o número do agente: o mesmo em todo aparelho, tirado do save; nunca um que a obra já usa */
  E.sgNumero = function(S){
    var s = String(S.createdAt || '') + '|' + String(S.start || ''), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var n = 100 + h % 900; while (SG.NUM_EVITA.indexOf(n) >= 0) n++;
    return String(n);
  };
  var oldNew = E.newState;
  E.newState = function(){ var s = oldNew.apply(this, arguments); s.settings.sombras = false; return s; };

  var oldDocs = App.docs;
  App.docs = function(){ var o = oldDocs.apply(this, arguments); o.sg = App.sg; return o; };
  var oldReplace = App.replaceDoc;
  App.replaceDoc = function(k, doc){
    if (k !== 'sg') return oldReplace.apply(this, arguments);
    App.sg = E.sgFill(doc); U.ls.set(Store.KEYS.sg, doc);
    App.D = E.derive(App.S, App.J); App.render();
  };
  var oldInit = App.init;
  App.init = function(){ App.sg = E.sgFill(U.ls.get(Store.KEYS.sg)); return oldInit.apply(this, arguments); };
  var oldCommit = App.commit;
  App.commit = function(docs, opt){ if (docs && docs.indexOf('sg') >= 0 && App.sg) E.sgPrune(App.sg); return oldCommit.apply(this, arguments); };

  /* ---------- ligar e desligar a Visão ---------- */
  App.sgOn = function(){ return !!(App.S && App.S.settings && App.S.settings.sombras); };
  App.sgSet = function(on){
    var S = App.S, G = App.sg, docs = ['core'];
    S.settings.sombras = !!on;
    if (on && !G.since) { G.since = U.today(); G.num = G.num || E.sgNumero(S); docs.push('sg'); }
    App.commit(docs);
  };
  App.sgNome = function(){ var G = App.sg; return G.cod || ('Número ' + G.num); };
  App.sgFill = function(t){
    var G = App.sg;
    return String(t).replace(/Número \{n\}/g, G.cod ? G.cod : 'Número ' + G.num).replace(/\{n\}/g, G.cod || G.num)
      .replace(/\{num\}/g, G.num).replace(/\{contato\}/g, (SG.MAP[G.contato] || SG.MAP.alpha).n);
  };
  /* uma fala pronta: muda com o dia e com a conversa, mas é a mesma em todo aparelho */
  App.sgFala = function(id, k){
    var M = SG.MAP[id], F = (M && M.falas) || {}, L = F[k] || F.ola || ['…'], c = App.sg.canal[id];
    var R = U.seeded(id + ':' + k + ':' + U.today() + ':' + (c ? c.m.length : 0));
    return App.sgFill(L[Math.floor(R() * L.length)]);
  };
  /* como ele chega hoje: sumido, faltou ontem, cumpriu ontem ou só chegou */
  E.sgEstado = function(S){
    var t = U.today(), z = S.pz || {}, rec = (z.log || {})[U.addDays(t, -1)] || {}, k = t, gap = 0;
    for (var j = 0; j < 30; j++) { var r = S.daily[k]; if (r && E.qCount(r) > 0) break; gap++; k = U.addDays(k, -1); }
    if (gap >= 3) return 'sumiu';
    if (z.on && rec.v === 'miss') return 'falta';
    if (z.on && rec.v === 'ok') return 'cumpriu';
    return 'ola';
  };
  App.sgNaoLidas = function(id){ var c = App.sg.canal[id]; return c ? c.m.filter(function(x){ return x.de !== 'eu' && x.at > (c.lido || ''); }).length : 0; };

  /* ---------- o retrato do Sistema que vai no prompt ---------- */
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  E.sgRetrato = function(S, D, C, now){
    var t = U.today(), d = new Date(now || Date.now()), z = S.pz || {}, L = [];
    L.push('Hoje: ' + t + ' (' + DIAS[d.getDay()] + '), ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + '.');
    L.push('Nível ' + D.level + ' · ' + U.num(D.gem) + ' ◆ · sequência das diárias: ' + (D.streak || 0) + (D.streak === 1 ? ' dia.' : ' dias.'));
    var r = S.daily[t];
    L.push('Diárias de hoje: ' + (r ? E.qCount(r) : 0) + ' de ' + (S.settings.dailies || []).length + (r && r.rest ? ' (descanso declarado)' : '') + '.');
    var wk = U.addDays(t, -7), feitos = {};
    Object.keys(S.nodes || {}).forEach(function(id){ var x = S.nodes[id], n = E.NODE[id]; if (x && x.s === 'done' && x.d1 && x.d1 > wk && n) feitos[n.way] = (feitos[n.way] || 0) + 1; });
    L.push('Caminhos (XP total · nós concluídos nos últimos 7 dias): ' + SYS.WAYS.map(function(w){ return w.name.replace(/^The /, '') + ' ' + U.num(D.wayXP[w.id] || 0) + ' · ' + (feitos[w.id] || 0); }).join('; ') + '.');
    if (z.on) {
      var dd = [];
      for (var i = 7; i >= 1; i--) { var x = U.addDays(t, -i), v = ((z.log || {})[x] || {}).v; dd.push(x.slice(8, 10) + '/' + x.slice(5, 7) + ' ' + ({ok: 'cumpriu', late: 'atraso', miss: 'falta', rest: 'descanso'}[v] || '—')); }
      L.push('Zona: janela ' + z.ini + ' a ' + z.fim + ', sequência ' + (z.seq || 0) + ', prendas abertas ' + E.pzOpen(S).length + '. Últimos 7 dias: ' + dd.join(', ') + '.');
    } else L.push('Zona: protocolo desligado.');
    if (C && C.since && E.cityOn(S) && E.cyLic) {
      var Lc = E.cyLic(C), CY = SYS.CITY;
      var corr = CY.DIST.filter(function(x){ return (E.cityDist(C, x.id).corr || 0) > 0; }).map(function(x){ return x.curto + ' ' + E.cityDist(C, x.id).corr; });
      var mald = E.cyMald ? E.cyMald(C).map(function(m){ return (CY.MALDMAP[m.k] || {n: m.k}).n; }) : [];
      L.push('Cidade: Licença ' + Lc.r + ' (' + Lc.pts + ' pontos), ' + E.cyOpen(C).length + ' portais abertos, ' + (corr.length ? 'corrupção em ' + corr.join(', ') : 'sem corrupção') + (mald.length ? ', maldições: ' + mald.join(', ') : '') + '.');
    }
    var k = t, gap = 0; for (var j = 0; j < 60; j++) { var rr = S.daily[k]; if (rr && E.qCount(rr) > 0) break; gap++; k = U.addDays(k, -1); }
    L.push(gap === 0 ? 'Marcou diária hoje.' : gap >= 60 ? 'Nenhuma diária marcada nos últimos 60 dias.' : 'Última diária marcada: ' + k + ' (' + gap + (gap === 1 ? ' dia atrás).' : ' dias atrás).'));
    return L.join('\n');
  };

  /* ---------- o prompt de cada membro ---------- */
  E.sgPrompt = function(G, id, txt, ctx){
    var M = SG.MAP[id], w = App.way(M.way) || {name: M.way, pt: ''}, c = G.canal[id], contato = (SG.MAP[G.contato] || SG.MAP.alpha).n;
    var nome = G.cod ? G.cod + ' (Número ' + G.num + ')' : 'Número ' + G.num;
    var hist = c.m.slice(-10).map(function(x){ return (x.de === 'eu' ? 'AGENTE' : M.n.toUpperCase()) + ': ' + x.t; }).join('\n');
    return 'Você interpreta ' + M.n + ', do Shadow Garden (da obra The Eminence in Shadow), numa troca de mensagens com um agente novo do Garden. Responda como ela, em português do Brasil.\n\n'
      + '=== QUEM VOCÊ É ===\n' + M.n + ': ' + M.papel + '.\nVoz: ' + M.voz + '.\nVocê acompanha o ' + (w.pt || 'Caminho') + ' (' + w.name + ') dele: ' + M.foco + '.\nProvoca assim: ' + M.provoca + '. Ajuda assim: ' + M.ajuda + '.\n\n'
      + '=== O AGENTE ===\n' + nome + '. Veio da Terra, a dimensão de origem do mestre Shadow. Missão dele: ' + SG.MISSAO + '. Regra de sigilo do Garden: ' + SG.SIGILO + '.\n'
      + 'Contato direta dele no Garden: ' + contato + '. Intensidade que ele pediu: ' + G.intens + ' (' + SG.INTENS[G.intens] + ').\n\n'
      + '=== A TÉCNICA (pedido dele) ===\n'
      + '- Provoque, zoe e jogue na cara quando o retrato mostrar falha; sempre junte uma dica concreta para hoje.\n'
      + '- Quando couber, deixe um gancho para uma conversa mais funda (filosófica ou psicológica), sem palestra.\n'
      + '- Elogio só com prova no retrato, curto e específico.\n'
      + '- Nunca critique descanso declarado, trégua ou pausa. Nunca zombe de saúde, corpo, aparência, família, relacionamentos ou dinheiro pessoal.\n'
      + '- Se ele parecer mal de verdade (tristeza pesada, crise, falar em se machucar), saia do jogo: fale com cuidado, sem provocar, e sugira procurar alguém de confiança ou ajuda profissional.\n\n'
      + '=== REGRAS DA OBRA ===\n'
      + '- Toda fala é sua e original: não repita falas, bordões nem cenas do anime, do mangá ou dos livros.\n'
      + '- Use a lore só em termos gerais (o mestre Shadow, o Culto de Diablos, a Mitsugoshi, os Números).\n'
      + '- Fique na personagem. Se ele perguntar a sério se você é uma IA, admita sem quebrar o clima.\n'
      + '- Nunca invente dados sobre ele: use só o retrato abaixo e a conversa.\n\n'
      + '=== RETRATO DO SISTEMA (dados reais de agora) ===\n' + ctx + '\n\n'
      + '=== O QUE VOCÊ JÁ SABE DELE ===\n' + (c.mem || '(nada ainda)') + '\n\n'
      + '=== CONVERSA RECENTE ===\n' + (hist || '(primeira conversa)') + '\n\n'
      + '=== NOVA MENSAGEM DO AGENTE ===\n' + txt + '\n\n'
      + 'Responda SOMENTE com um objeto JSON: {"fala": "1 a 5 frases, tom de mensagem de chat, sem markdown e sem emoji", "humor": "neutra" | "satisfeita" | "decepcionada" | "irritada" | "divertida" | "preocupada", "memoria": "o que você sabe dele agora, em terceira pessoa, até 500 caracteres", "afinidade": -1 | 0 | 1}';
  };
  var HUMOR = ['neutra', 'satisfeita', 'decepcionada', 'irritada', 'divertida', 'preocupada'];
  E.sgClean = function(r){
    if (!r || typeof r !== 'object') return null;
    var fala = String(r.fala || '').trim().slice(0, 900); if (!fala) return null;
    return {fala: fala, humor: HUMOR.indexOf(r.humor) >= 0 ? r.humor : 'neutra', mem: String(r.memoria || '').trim().slice(0, SG.MEM_MAX), af: Math.max(-1, Math.min(1, Math.round(+r.afinidade || 0)))};
  };

  /* ---------- a conversa ---------- */
  App.sgIA = function(){ return !!App.sample && !App.sampleOff; };
  E.sgIaResta = function(G){ return G.ia.dia !== U.today() ? G.iaDia : Math.max(0, G.iaDia - (G.ia.n || 0)); };
  App.sgSend = function(id, txt){
    var G = App.sg, M = SG.MAP[id], c = G && G.canal[id], now = new Date().toISOString();
    txt = String(txt || '').trim().slice(0, SG.TXT_MAX);
    if (!M || !c || !txt || App.ui.sgBusy) return false;
    var ai = App.sgIA();
    if (ai && E.sgIaResta(G) <= 0) { App.ui.sgErr = 'Limite de ' + G.iaDia + ' respostas por dia atingido. A linha reabre amanhã; dá para mudar o limite nos Ajustes do Garden.'; App.sgPaint(); return false; }
    var prompt = ai ? E.sgPrompt(G, id, txt, E.sgRetrato(App.S, App.D, App.city)) : '';
    c.m.push({at: now, de: 'eu', t: txt}); c.lido = now; App.ui.sgErr = ''; App.ui.sgRetry = null;
    if (!ai) { c.m.push({at: now, de: id, t: App.sgFala(id, 'semIA'), off: 1}); c.lido = now; App.commit(['sg'], {norender: true}); App.sgPaint(); return true; }
    App.ui.sgBusy = id; App.commit(['sg'], {norender: true}); App.sgPaint();
    App.sgAsk(id, prompt);
    return true;
  };
  App.sgAsk = function(id, prompt){
    App.ui.sgBusy = id;
    App.sample.json(prompt, {cache: false}).then(function(raw){
      var r = E.sgClean(raw); if (!r) throw {code: 'invalid_json'};
      var G = App.sg, c = G.canal[id], t = U.today(), at = new Date().toISOString();
      c.m.push({at: at, de: id, t: r.fala, h: r.humor});
      if (App.ui.route === 'garden' && App.ui.param === id) c.lido = at;   /* se você saiu do canal, a resposta fica como não lida */
      if (r.mem) c.mem = r.mem;
      G.afin[id] = Math.max(0, Math.min(100, (G.afin[id] || 0) + r.af * 2));
      if (G.ia.dia !== t) G.ia = {dia: t, n: 0};
      G.ia.n++;
      App.ui.sgRetry = null;
    }).catch(function(e){
      var st = {}; App.examFail(st, e);
      App.ui.sgErr = st.err || 'A linha caiu. Tente de novo.'; App.ui.sgRetry = {id: id, prompt: prompt};
    }).then(function(){ App.ui.sgBusy = null; App.commit(['sg'], {norender: true}); App.sgPaint(); });
  };
  /* ao abrir o canal: se ela ainda não falou hoje, ela começa (fala pronta, sem gastar IA) */
  App.sgSaudar = function(id){
    var G = App.sg, c = G && G.canal[id], t = U.today(); if (!c || !G.since) return false;
    if (c.m.some(function(x){ return x.de === id && dia(x.at) === t; })) return false;
    c.m.push({at: new Date().toISOString(), de: id, t: App.sgFala(id, E.sgEstado(App.S)), pr: 1});
    return true;
  };
})();
