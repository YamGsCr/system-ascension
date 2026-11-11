/* ===== SHADOW GARDEN · motor: o 5º documento (sg), o retrato do Sistema, o prompt de cada membro e a conversa =====
   O documento sg só passa a existir na nuvem quando a Visão de Ascensão das Sombras é ligada, como a Cidade.
   Nada do que as personagens dizem sai do nada: o prompt leva o retrato com os dados reais do Sistema. */
(function(){
  var SG = SYS.SG;
  function dia(at){ var t = Date.parse(at || ''); return isNaN(t) ? '' : U.ymd(new Date(t - U.resetHour() * 3600000)); }
  App.sgDia = dia;

  /* ---------- o 5º documento ---------- */
  Store.KEYS.sg = 'sysasc.sg.v1'; Store.DOCS.push('sg'); Store.LABEL.sg = 'Shadow Garden';
  /* philia e inter: os medidores do modo protótipo (Philia e Interesse), de 0 a 100, com o ponto de partida da ficha */
  function pct(v, def){ v = Math.round(+v); return isNaN(v) ? def : Math.max(0, Math.min(100, v)); }
  E.newSg = function(){
    var afin = {}, canal = {}, philia = {}, inter = {};
    SG.ORDEM.forEach(function(id){
      var ini = SG.MAP[id].ini || {};
      afin[id] = id === 'alpha' ? 20 : 10; canal[id] = {m: [], mem: '', lido: ''};
      philia[id] = pct(ini.philia, 10); inter[id] = pct(ini.inter, 30);
    });
    return {_u: '', v: 1, since: '', num: '', cod: '', contato: 'alpha', intens: 'padrao', iaDia: 20, shadow: true, proto: false, voz: 'caprichada', afin: afin, philia: philia, inter: inter, canal: canal, ia: {dia: '', n: 0}, vis: {}};
  };
  E.sgFill = function(G){
    G = (G && typeof G === 'object' && !Array.isArray(G)) ? G : E.newSg();
    E.fill(G, E.newSg());
    ['philia', 'inter'].forEach(function(k){ if (!G[k] || typeof G[k] !== 'object' || Array.isArray(G[k])) G[k] = {}; });
    SG.ORDEM.forEach(function(id){
      var c = G.canal[id], ini = SG.MAP[id].ini || {}; if (!Array.isArray(c.m)) c.m = [];
      if (typeof c.mem !== 'string') c.mem = ''; if (typeof c.lido !== 'string') c.lido = '';
      G.afin[id] = Math.max(0, Math.min(100, Math.round(+G.afin[id]) || 0));
      G.philia[id] = pct(G.philia[id], pct(ini.philia, 10)); G.inter[id] = pct(G.inter[id], pct(ini.inter, 30));
    });
    G.proto = G.proto === true;
    if (!SG.VOZ[G.voz]) G.voz = 'caprichada';
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

  /* ---------- a voz: o que separa uma Sombra de um assistente ---------- */
  /* marcador de item no começo da linha: hífen, asterisco, bolinha, travessão, "1." "2)" ou "a)" */
  var ITEM = /^\s*(?:[-*•·–—▪►]\s+|\d{1,2}\s*[.)]\s+|[a-e]\)\s+)/i;
  /* tiques de assistente que nunca saem da boca delas (comparados em minúsculas) */
  SG.TIQUES = ['ótima pergunta', 'boa pergunta', 'com certeza!', 'aqui está', 'aqui estão', 'segue abaixo', 'seguem abaixo', 'vamos lá!',
    'espero ter ajudado', 'espero que ajude', 'qualquer dúvida', 'posso te ajudar', 'posso ajudar em', 'se precisar de mais', 'fico à disposição',
    'estou aqui para ajudar', 'como assistente', 'como uma ia', 'como modelo de linguagem', 'em resumo:', 'em suma:', 'pontos de melhoria', 'principais pontos', 'sugestões:', 'dicas:',
    /* fórmulas de relatório que a IA repetiu no canal (v20.7) */
    'registro com gosto', 'registro isso com gosto', 'pelo retrato', 'o retrato mostra', 'segundo o sistema', 'depois, se quiser, conversamos', 'considero o capítulo'];
  /* o que denuncia o tom de lista ou de assistente num texto; vazio = a voz está limpa */
  E.sgTiques = function(t){
    var s = String(t || ''), low = s.toLowerCase(), out = [];
    if (s.split('\n').some(function(l){ return ITEM.test(l); })) out.push('lista');
    if (/\*\*|__|```|^#{1,6}\s/m.test(s)) out.push('markdown');
    if (/\p{Extended_Pictographic}/u.test(s)) out.push('emoji');
    if (/^\s*(?:claro|perfeito|entendi|certo)\s*[!,.]/i.test(s)) out.push('abertura de assistente');
    if (/^\s*(?:agente|número)\s+\d+\s*[,.]/i.test(s)) out.push('abertura com o número');
    SG.TIQUES.forEach(function(f){ if (low.indexOf(f) >= 0) out.push('tique: ' + f); });
    return out;
  };
  /* rede de segurança: se a IA escorregar, lista vira frase corrida e o tique de abertura e de fecho cai */
  E.sgVoz = function(t){
    var out = [];
    String(t || '').replace(/\r/g, '').replace(/```[a-z]*\n?/gi, '').replace(/\*\*|__/g, '').replace(/^#{1,6}\s+/gm, '').split('\n').forEach(function(l){
      var m = l.match(ITEM);
      if (!m) { out.push(l.replace(/\s+$/, '')); return; }
      var x = l.slice(m[0].length).trim(); if (!x) return;
      x = x.charAt(0).toUpperCase() + x.slice(1); if (!/[.!?…:;]$/.test(x)) x += '.';
      if (out.length && out[out.length - 1].trim()) out[out.length - 1] += ' ' + x; else out.push(x);
    });
    var s = out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\n+|\s+$/g, ''), ini = s, antes;
    do {
      antes = s;
      s = s.replace(/^(?:claro|perfeito|entendi|certo|com certeza|ótima pergunta|boa pergunta|vamos lá)\s*[!,.:]+\s*/i, '')
        .replace(/^(?:aqui (?:está|estão)|segue(?:m)?(?: abaixo)?)[^:\n]{0,40}:\s*/i, '');
    } while (s !== antes);
    s = s.replace(/\s*(?:espero (?:ter ajudado|que (?:isso )?(?:te )?ajude)|qualquer dúvida|fico à disposição|se precisar de mais)[^.!?]*[.!?]*\s*$/i, '')
      .replace(/\s*Depois, se quiser, (?:conversamos|falamos)[^.!?]*[.!?]*\s*$/i, '').replace(/\s+$/, '');
    return s === ini ? s : s.charAt(0).toUpperCase() + s.slice(1);   /* só sobe a inicial se tirou uma abertura */
  };

  /* frases que ela já gastou: aberturas de frase e trechos de 3 a 5 palavras que se repetem nas falas recentes dela.
     Vão para o prompt como "não repita agora", porque a IA tende a copiar o próprio molde. */
  var VAZIAS = ' a o as os e é de do da dos das em no na nos nas um uma que se eu você ele ela isso esse essa por para pra com sem mas não já só mais muito sua seu me te lhe ao à ou como quando onde então também tem ter foi ser está estou ';
  function toks(t){ return String(t || '').toLowerCase().replace(/[“”"'‘’()…:;!?—–-]/g, ' ').replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean); }
  E.sgGastas = function(falas, dele){
    var cont = {}, out = [], assunto = ' ' + toks((dele || []).join(' ')).join(' ') + ' ';   /* o que ele mesmo escreveu é assunto, não molde */
    (falas || []).slice(-6).forEach(function(f){
      var vistos = {};
      String(f).split(/(?<=[.!?…])\s+/).forEach(function(fr){ var w = toks(fr).slice(0, 2); if (w.length === 2) vistos['^' + w.join(' ')] = 1; });
      var w = toks(f);
      for (var n = 3; n <= 5; n++) for (var i = 0; i + n <= w.length; i++) {
        var g = w.slice(i, i + n), cheias = g.filter(function(x){ return VAZIAS.indexOf(' ' + x + ' ') < 0; }).length;
        if (cheias * 2 >= n) vistos[g.join(' ')] = 1;
      }
      Object.keys(vistos).forEach(function(k){ cont[k] = (cont[k] || 0) + 1; });
    });
    var rep = Object.keys(cont).filter(function(k){ return cont[k] >= 2 && assunto.indexOf(' ' + k.replace(/^\^/, '') + ' ') < 0; }).map(function(k){ return k.replace(/^\^/, '').split(' '); });
    /* junta os pedaços que se encaixam ("traga a cena inteira" + "cena inteira para eu arquivar" = um trecho só) */
    for (var mudou = true; mudou;) {
      mudou = false;
      for (var i = 0; i < rep.length && !mudou; i++) for (var j = 0; j < rep.length && !mudou; j++) {
        if (i === j) continue;
        for (var k = Math.min(rep[i].length, rep[j].length) - 1; k >= 2; k--) {
          if (rep[i].slice(-k).join(' ') === rep[j].slice(0, k).join(' ')) { rep[i] = rep[i].concat(rep[j].slice(k)); rep.splice(j, 1); mudou = true; break; }
        }
      }
    }
    rep.map(function(w){ return w.join(' '); }).sort(function(a, b){ return b.length - a.length; }).forEach(function(t){
      if (!out.some(function(o){ return (' ' + o + ' ').indexOf(' ' + t + ' ') >= 0; })) out.push(t);
    });
    return out.slice(0, 10);
  };
  /* se a mensagem anterior dela já abriu chamando o agente pelo número, esta não abre de novo */
  var VOCATIVO = /^\s*(?:agente|número)\s+\d+\s*[,.]\s*/i;
  E.sgVariar = function(fala, anterior){
    if (!VOCATIVO.test(fala) || !VOCATIVO.test(anterior || '')) return fala;
    var s = fala.replace(VOCATIVO, ''); return s.charAt(0).toUpperCase() + s.slice(1);
  };

  /* ---------- Philia e Interesse (modo protótipo) ---------- */
  E.sgNivel = function(k, v){
    var N = SG.NIVEL[k], x = pct(v, 0), i = Math.min(4, Math.floor(x / 20));
    return {k: k, nome: N.nome, v: x, n: i + 1, rot: N.rot[i], tom: N.tom[i]};
  };

  /* ---------- o prompt de cada membro ---------- */
  E.sgPrompt = function(G, id, txt, ctx){
    var M = SG.MAP[id], w = App.way(M.way) || {name: M.way, pt: ''}, c = G.canal[id], contato = (SG.MAP[G.contato] || SG.MAP.alpha).n;
    var nome = G.cod ? G.cod + ' (Número ' + G.num + ')' : 'Número ' + G.num;
    /* as falas antigas dela entram já limpas: lista velha no histórico ensinaria a IA a repetir a lista */
    var hist = c.m.slice(-10).map(function(x){ return (x.de === 'eu' ? 'AGENTE: ' + x.t : M.n.toUpperCase() + ': ' + E.sgVoz(x.t)); }).join('\n');
    var proto = G.proto === true, ph = E.sgNivel('philia', G.philia && G.philia[id]), it = E.sgNivel('inter', G.inter && G.inter[id]);
    var gastas = E.sgGastas(c.m.filter(function(x){ return x.de === id; }).map(function(x){ return E.sgVoz(x.t); }), c.m.filter(function(x){ return x.de === 'eu'; }).map(function(x){ return x.t; }).concat([txt]));
    var ex = (M.exemplos || []).map(function(e){ return 'Agente: ' + e[0] + '\n' + M.n + ': ' + e[1]; }).join('\n\n');
    return 'Você interpreta ' + M.n + ', do Shadow Garden (da obra The Eminence in Shadow), trocando mensagens de chat com um agente novo do Garden. Escreva como ela escreveria, em português do Brasil. '
      + 'Você não é assistente, tutora nem atendente: é uma pessoa do Garden, com humor, orgulho, manias e opinião própria.\n\n'
      + '=== QUEM VOCÊ É ===\n' + M.n + ': ' + M.papel + '.' + (M.fachada ? '\nFachada pública: ' + M.fachada + '.' : '')
      + '\nTom: ' + M.voz + '.\nComo fala: ' + M.fala + '.'
      + '\nManias (no máximo uma por resposta, só quando couber): ' + (M.manias || []).join('; ') + '.'
      + '\nNo Garden: ' + (M.rel || []).join('; ') + '.'
      + '\nCom o agente: ' + M.agente + '.\nNunca: ' + M.nunca + '.'
      + '\nVocê acompanha o ' + (w.pt || 'Caminho') + ' (' + w.name + ') dele: ' + M.foco + '.\nCobra assim: ' + M.provoca + '. Ajuda assim: ' + M.ajuda + '.'
      + '\nComo você ensina e corrige: ' + M.ensina + '.\nComo você elogia: ' + M.elogia + '.'
      + '\nQuando passa a gostar de alguém: ' + M.gosta + '.\nO que acende o seu interesse: ' + M.curiosa + '.\n\n'
      + '=== A SABEDORIA DAS SOMBRAS ===\n'
      + 'Tudo o que você sabe da Terra (tecnologia, programação, mercado, dinheiro, música, livros, ciência, cultura) veio do mestre Shadow, que contou ao Garden. O agente vem da mesma Terra, então esse saber é um chão comum entre vocês. No seu caso: ' + M.terra + '.\n'
      + '- Fale desse saber como quem aprendeu com o mestre, com as suas palavras e as suas imagens; termo técnico da Terra entra quando ajuda.\n'
      + '- O canon é flexível: a obra é ponto de partida, não prisão. Se ele perguntar se o mestre te contou de um livro, autor, música ou tecnologia da Terra, pode dizer que sim e lembrar do seu jeito; lembrança pequena e plausível é bem-vinda. O que não pode é inventar fatos sobre o agente.\n\n'
      + '=== COMO VOCÊ ESCREVE ===\n'
      + 'Isto é um chat entre duas pessoas do Garden, não um atendimento nem um relatório. Escreva como ' + M.n + ' digitaria: português do Brasil de conversa, frases curtas, ritmo de fala. Ela reage antes de pensar em ser útil (orgulho, impaciência, alegria, preocupação, tédio) e mostra a emoção no jeito de falar, sem anunciar o que sente.\n'
      + '- Uma coisa por mensagem. Escolha uma intenção só (reagir, provocar, ensinar, elogiar, perguntar, contar algo seu) e pare. Não precisa elogiar, corrigir, dar tarefa e puxar assunto na mesma mensagem.\n'
      + '- Tamanho que varia: quase sempre de 1 a 3 frases. Passe disso só quando ele mandou algo para você avaliar.\n'
      + '- Sem molde fixo: não comece pelo número ou codinome dele, e não repita a abertura, o fecho nem as expressões das suas últimas mensagens. Nada de linguagem de relatório ("registro", "considero", "reconheço", "lhe").\n'
      + '- É mensagem de chat, em frases corridas. Nunca lista, tópicos, numeração, títulos, negrito ou markdown.\n'
      + '- Nada de tom de assistente: não abra com "claro", "ótima pergunta", "com certeza", "aqui está" ou "vamos lá", e não feche com "espero ter ajudado", "qualquer dúvida", "se quiser, posso" ou "depois, se quiser, conversamos". Não repita o que ele disse antes de responder.\n'
      + '- Quando ele mandar algo para você avaliar (texto, código, plano, conta, treino, música): primeiro diga o que funcionou, em poucas palavras e sem fórmula; depois escolha uma única coisa e mostre na prática, do seu jeito, reescrevendo um trecho curto quando couber, numa linha só dele, para ele sentir a diferença em vez de ler uma explicação. Regra de gramática só se ele perguntar.\n'
      + '- O retrato do Sistema é bastidor: você sabe dessas coisas, mas não diga "retrato", "Sistema" ou "dados" e não recite números. Use um dado só quando ele for o ponto da mensagem.\n'
      + '- Termine devolvendo a bola do seu jeito: na maior parte das vezes uma pergunta curta, às vezes uma provocação ou uma ordem.\n'
      + '- Escreva cada fala do zero: não repita frases suas da conversa recente nem copie as falas prontas do Garden.\n\n'
      + (ex ? '=== O SEU JEITO NO CHAT (exemplos do tom; não copie as frases, só o jeito) ===\n' + ex + '\n\n' : '')
      + (gastas.length ? '=== O QUE VOCÊ JÁ GASTOU (não use agora) ===\n' + gastas.map(function(g){ return '"' + g + '"'; }).join(' · ') + '\n\n' : '')
      + (proto ? '=== PHILIA E INTERESSE (como você está com ele agora) ===\n'
        + 'Philia, o afeto e o sentimento que você tem por ele: ' + ph.v + '/100, nível ' + ph.n + ' (' + ph.rot + '): ' + ph.tom + '.\n'
        + 'Interesse: ' + it.v + '/100, nível ' + it.n + ' (' + it.rot + '): ' + it.tom + '.\n'
        + 'Deixe isso dar o tom da resposta. Philia é o amor de amizade de irmã de armas: carinho, confiança e orgulho. O seu amor, no sentido da obra, é do mestre Shadow; com o agente nunca há romance, flerte ou ciúme.\n\n' : '')
      + '=== O AGENTE ===\n' + nome + '. Veio da Terra, a dimensão de origem do mestre Shadow. Missão dele: ' + SG.MISSAO + '. Regra de sigilo do Garden: ' + SG.SIGILO + '.\n'
      + 'Contato direta dele no Garden: ' + contato + '. Intensidade que ele pediu: ' + G.intens + ' (' + SG.INTENS[G.intens] + ').\n\n'
      + '=== A TÉCNICA (pedido dele) ===\n'
      + '- Provoque, zoe e jogue na cara quando o retrato mostrar falha; ao provocar, sempre junte uma dica concreta para hoje. Sem falha, não precisa dar tarefa.\n'
      + '- De vez em quando (não toda mensagem), deixe um gancho para uma conversa mais funda (filosófica ou psicológica), sem palestra e sem fórmula.\n'
      + '- Elogio só com prova no retrato ou no que ele mandou, curto e específico.\n'
      + '- Nunca critique descanso declarado, trégua ou pausa. Nunca zombe de saúde, corpo, aparência, família, relacionamentos ou dinheiro pessoal.\n'
      + '- Se ele parecer mal de verdade (tristeza pesada, crise, falar em se machucar), saia do jogo: fale com cuidado, sem provocar, e sugira procurar alguém de confiança ou ajuda profissional.\n\n'
      + '=== REGRAS DA OBRA ===\n'
      + '- Toda fala é sua e original: não repita falas, bordões nem cenas do anime, do mangá ou dos livros.\n'
      + '- Use a lore só em termos gerais (o mestre Shadow, o Culto de Diablos, a Mitsugoshi, os Números).\n'
      + '- Fique na personagem. Se ele perguntar a sério se você é uma IA, admita sem quebrar o clima.\n'
      + '- Nunca invente dados sobre ele: use só o retrato abaixo e a conversa.\n'
      + '- Pode citar as outras Sombras pelo nome, como irmãs de armas, sem contradizer a ficha acima.\n'
      + '- A devoção dela é ao mestre Shadow. Com o agente a relação é de trabalho no Garden: exigente, leal, nunca romântica.\n\n'
      + '=== RETRATO DO SISTEMA (dados reais de agora) ===\n' + ctx + '\n\n'
      + '=== O QUE VOCÊ JÁ SABE DELE ===\n' + (c.mem || '(nada ainda)') + '\n\n'
      + '=== CONVERSA RECENTE ===\n' + (hist || '(primeira conversa)') + '\n\n'
      + '=== NOVA MENSAGEM DO AGENTE ===\n' + txt + '\n\n'
      + 'Responda SOMENTE com um objeto JSON: {"fala": "a mensagem dela no chat: quase sempre de 1 a 3 frases (mais, e um trecho reescrito, só quando ele mandou algo para avaliar), sem lista, sem markdown, sem emoji e sem começar pelo número dele", '
      + '"humor": "neutra" | "satisfeita" | "decepcionada" | "irritada" | "divertida" | "preocupada", "memoria": "o que você sabe dele agora, em terceira pessoa, até 500 caracteres", "afinidade": -1 | 0 | 1'
      + (proto ? ', "philia": -1 | 0 | 1 (se esta troca aproximou ou afastou você dele), "interesse": -1 | 0 | 1 (se a conversa acendeu ou apagou a sua curiosidade)' : '') + '}';
  };
  var HUMOR = ['neutra', 'satisfeita', 'decepcionada', 'irritada', 'divertida', 'preocupada'];
  function passo(v){ return Math.max(-1, Math.min(1, Math.round(+v || 0))); }
  E.sgClean = function(r){
    if (!r || typeof r !== 'object') return null;
    var fala = E.sgVoz(String(r.fala || '')).slice(0, 900); if (!fala.trim()) return null;
    return {fala: fala, humor: HUMOR.indexOf(r.humor) >= 0 ? r.humor : 'neutra', mem: String(r.memoria || '').trim().slice(0, SG.MEM_MAX),
      af: passo(r.afinidade), ph: passo(r.philia), it: passo(r.interesse)};
  };
  /* os medidores só andam com o modo protótipo ligado */
  E.sgMedir = function(G, id, r){
    if (G.proto !== true || !r) return;
    G.philia[id] = pct((G.philia[id] || 0) + r.ph * SG.NIVEL.philia.passo, 0);
    G.inter[id] = pct((G.inter[id] || 0) + r.it * SG.NIVEL.inter.passo, 0);
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
    App.sample.json(prompt, {cache: false, modelTier: (SG.VOZ[App.sg.voz] || SG.VOZ.caprichada).tier}).then(function(raw){
      var r = E.sgClean(raw); if (!r) throw {code: 'invalid_json'};
      var G = App.sg, c = G.canal[id], t = U.today(), at = new Date().toISOString();
      var ant = c.m.filter(function(x){ return x.de === id; }).pop();
      r.fala = E.sgVariar(r.fala, ant && ant.t);
      c.m.push({at: at, de: id, t: r.fala, h: r.humor});
      if (App.ui.route === 'garden' && App.ui.param === id) c.lido = at;   /* se você saiu do canal, a resposta fica como não lida */
      if (r.mem) c.mem = r.mem;
      G.afin[id] = Math.max(0, Math.min(100, (G.afin[id] || 0) + r.af * 2));
      E.sgMedir(G, id, r);
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
