/* ===== v21 · Rotina: ondas de ativação, dia mínimo, menu de bolso, Abstinentia e regras de proteção =====
   Fonte: aba Handoff do doc SGM-Opus, seção Rotina. Início: segunda, 16/11/2026. Cerca de 2 horas por dia, mais o tempo
   morto da loja. Uma onda nova só entra quando a anterior já roda no automático (em geral umas 3 semanas).
   · Dia mínimo: em dia ruim, 10 minutos de cada bloco ativo, nunca zero. Regra: nunca falhar dois dias seguidos.
   · Sono é a métrica número um, acima de qualquer streak: três noites ruins seguidas ligam o modo leve sozinho
     (vale o dia mínimo e o Chamado da Zona fica suspenso no dia).
   · Um dia de folga por semana, sem culpa e sem perda de streak (marca também o descanso das diárias).
   · Pausa manual sempre visível (pílula no topo): suspende a Rotina, o Chamado da Zona e protege a sequência.
   · Design congelado: mudanças no sistema só na revisão mensal; cada hora mexendo exige uma hora usando.
   Estado no core: S.rot = {ondas:{n:data}, dias:{data:{b:{bloco:'full'|'min'}, m:{bloco:minutos}, sono, folga}},
   pausa:{de, ate, motivo}|null, leve:{de}|null, abst:{ini, log:[]}, rev:{prox, mexe, usa, log:[]}}. */
(function(){
  var R = SYS.ROT = {
    INICIO: '2026-11-16',
    ESPERA: 21,
    MIN: 10,
    BLOCOS: [
      {id:'mat', onda:1, n:'Mathematica · rank I', way:'vitruviano', br:'mat', d:'Um problema no papel até o fim, ou um exemplo resolvido refeito de cabeça.'},
      {id:'jap', onda:1, n:'Japonês · kana e Anki', way:'vitruviano', br:'lin', d:'Kana escrito à mão e Anki em dia. A viagem é a meta: chegar lendo placa e cardápio.'},
      {id:'corpus', onda:1, n:'Treino do Corpus', way:'aesthetic', br:'cal', d:'A sessão do dia. Em dia ruim, mobilidade e técnica leve.'},
      {id:'har', onda:2, n:'Harmonia · ouvido e teoria', way:'vitruviano', br:'har', d:'musictheory.net e Functional Ear Trainer. O piano só é comprado depois de 30 dias seguidos deste treino.'},
      {id:'eng', onda:3, n:'Inglês de verdade · escuta, fala e científico', way:'vitruviano', br:'lin', d:'Sair do inglês de internet: escutar sem legenda, falar em voz alta e, depois, ler e escrever ciência.'},
      {id:'phi', onda:4, n:'Philosophia e Politeia · leitura curta', way:'vitruviano', br:'phi', d:'Cabe no balcão e antes de dormir.'},
      {id:'zho', onda:5, n:'Chinês · pinyin e tons', way:'vitruviano', br:'lin', d:'Só depois do JLPT N4.'}
    ],
    ONDAS: [[1,'Mathematica rank I; japonês (kana e Anki); treino do Corpus','Começa em 16/11'],[2,'Harmonia: treino de ouvido e teoria','O piano só é comprado depois de 30 dias seguidos desse treino'],[3,'Inglês de verdade: escuta, fala e inglês científico','Você já lê; agora é ouvir, falar e escrever ciência'],[4,'Philosophia e Politeia','Leitura curta, cabe no balcão e antes de dormir'],[5,'Chinês','Só depois do JLPT N4']],
    BOLSO: [[2,'Anki: kana e vocabulário de japonês, depois o inglês','Lingua',['jap','eng']],[5,'Uma passagem do Manual de Epicteto ou das Meditações','Philosophia',['phi']],[5,'Flashcard de fórmula ou exemplo resolvido refeito de cabeça','Mathematica',['mat']],[10,'Kana escrito à mão','Lingua',['jap']],[15,'Um problema de matemática no papel, até o fim','Mathematica',['mat']],[15,'Escuta em inglês sem legenda: um trecho de palestra ou podcast técnico, com shadowing','Lingua',['eng']],[30,'Uma lição do Genki ou do Tae Kim, com os exercícios','Lingua',['jap']],[30,'Esqueleto de redação ou trecho de A República','Lingua e Politeia',['phi']]],
    ABST: {ini:'2026-11-14', dias:30},
    MUSICA: 'Instrumental calma no estudo de bolso; silêncio ou som constante no estudo profundo; nenhuma música no estudo de idioma.',
    PROTECAO: ['Sono é a métrica número um, acima de qualquer streak. Três noites ruins seguidas colocam o sistema em modo leve automaticamente.','Um dia de folga por semana, sem culpa e sem perda de streak.','Botão de pausa manual sempre visível.','Design congelado: mudanças no sistema só na revisão mensal. Cada hora mexendo no sistema exige uma hora usando.','Ritual de fechamento: era concluída, um dia de comemoração antes de abrir a próxima.','Projeto novo só entra quando outro fecha uma era.']
  };
  R.MAP = {}; R.BLOCOS.forEach(function(b){ R.MAP[b.id] = b; });

  function novo(){ return {ondas:{1:R.INICIO}, dias:{}, pausa:null, leve:null, abst:{ini:R.ABST.ini, log:[]}, rev:{prox:'', mexe:0, usa:0, log:[]}}; }
  var oldNew = E.newState;
  E.newState = function(){ var s = oldNew.apply(this, arguments); s.rot = novo(); return s; };
  App.rot = function(){ var S = App.S; var r = S.rot || (S.rot = novo()); E.fill(r, novo()); return r; };

  /* ---------- engine ---------- */
  E.rotN4 = function(S){ var c = S.certs && S.certs.jlpt_n4, n = S.nodes && S.nodes.L07; return !!((c && c.s === 'passed') || (n && n.s === 'done')); };
  E.rotOndaDe = function(S, n){ var r = S.rot; return (r && r.ondas && r.ondas[n]) || null; };
  E.rotAtivos = function(S, day){ return R.BLOCOS.filter(function(b){ var d = E.rotOndaDe(S, b.onda); return d && d <= day; }); };
  E.rotPausado = function(S, day){ var p = S.rot && S.rot.pausa; return !!(p && p.de && day >= p.de && (!p.ate || day <= p.ate)); };
  E.rotBloco = function(rec, id){ if (!rec) return null; var b = rec.b && rec.b[id]; if (b === 'full') return 'full'; if (b === 'min' || ((rec.m && rec.m[id]) || 0) >= R.MIN) return 'min'; return null; };
  /* antes · pausa · folga · completo · minimo · aberto · falhou */
  E.rotDia = function(S, day){
    var t = U.today(), at = E.rotAtivos(S, day), rec = S.rot && S.rot.dias && S.rot.dias[day];
    if (!at.length) return 'antes';
    if (E.rotPausado(S, day)) return 'pausa';
    if (rec && rec.folga) return 'folga';
    var st = at.map(function(b){ return E.rotBloco(rec, b.id); });
    if (st.every(Boolean)) return st.every(function(x){ return x === 'full'; }) ? 'completo' : 'minimo';
    return day < t ? 'falhou' : 'aberto';
  };
  E.rotOk = function(st){ return st === 'completo' || st === 'minimo' || st === 'folga' || st === 'pausa'; };
  /* dias seguidos em que um bloco teve pelo menos o mínimo (hoje conta se já tiver) */
  E.rotSeguidos = function(S, id){
    var d = U.today(), n = 0, dias = (S.rot && S.rot.dias) || {};
    if (!E.rotBloco(dias[d], id)) d = U.addDays(d, -1);
    for (var i = 0; i < 400; i++) { if (E.rotBloco(dias[d], id)) { n++; d = U.addDays(d, -1); } else break; }
    return n;
  };
  E.rotFolgaSemana = function(S, day){ var wk = U.weekKey(day), dias = (S.rot && S.rot.dias) || {}; return Object.keys(dias).filter(function(k){ return dias[k].folga && U.weekKey(k) === wk && k !== day; }).length; };
  E.rotSonoRuim3 = function(S, day){ var dias = (S.rot && S.rot.dias) || {}; for (var i = 0; i < 3; i++) { var r = dias[U.addDays(day, -i)]; if (!r || r.sono !== 'ruim') return false; } return true; };
  E.rotQuebras = function(S){
    var dias = Object.keys((S.rot && S.rot.dias) || {}), t = U.today(), ini = E.rotOndaDe(S, 1); if (!ini) return 0;
    var n = 0, prev = false;
    for (var d = ini; d < t; d = U.addDays(d, 1)) { var f = E.rotDia(S, d) === 'falhou'; if (f && prev) n++; prev = f; }
    return n;
  };
  E.rotAbst = function(S){ var a = (S.rot && S.rot.abst) || {ini:R.ABST.ini}; return Math.max(0, U.daysBetween(a.ini, U.today())); };

  /* modo leve, pausa e folga tocam a Zona e as diárias: só por aqui */
  E.rotAplica = function(S){
    var r = S.rot; if (!r) return false;
    var t = U.today(), mudou = false;
    if (!r.leve && E.rotSonoRuim3(S, t)) { r.leve = {de:t}; mudou = true; }
    if (r.leve) {
      var hoje = r.dias[t];
      if (hoje && (hoje.sono === 'bom' || hoje.sono === 'ok')) { r.leve = null; mudou = true; }
      else if (S.pz && S.pz.on && (!S.pz.pause || S.pz.pause < t)) { S.pz.pause = t; r.leve.pz = t; mudou = true; }
    }
    if (r.pausa && r.pausa.ate && r.pausa.ate < t) { r.pausa = null; mudou = true; }
    return mudou;
  };
  E.rotProtegeDias = function(S, de, ate){
    var need = (S.settings && S.settings.dailies || []).length || 5;
    for (var d = de, i = 0; d <= ate && i < 31; d = U.addDays(d, 1), i++) { var rec = S.daily[d] || (S.daily[d] = {q:{}, need:need}); rec.frozen = true; rec.pausa = 1; }
  };

  /* ---------- rota ---------- */
  var at = -1; App.NAV.forEach(function(n, k){ if (n && n[0] === 'sequencia') at = k; });
  App.NAV.splice(at >= 0 ? at + 1 : 2, 0, ['rotina', 'Rotina', 'clock']);
  App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });

  App.V.rotina = function(){
    var S = App.S, r = App.rot(), t = U.today(), at0 = E.rotAtivos(S, t), st = E.rotDia(S, t), rec = r.dias[t] || {};
    var head = H.head('Rotina', 'Ondas, dia mínimo e proteção.', 'Cerca de 2 horas por dia, mais o tempo morto da loja. Uma onda nova só entra quando a anterior já roda no automático. Sono vem antes de qualquer streak.');
    var aviso = '';
    if (r.pausa && E.rotPausado(S, t)) aviso += '<div class="callout" style="font-size:14px">'+U.icon('moon')+' <b>Pausa</b> até '+(r.pausa.ate ? U.fmtDate(r.pausa.ate) : 'você encerrar')+(r.pausa.motivo ? ' · '+U.esc(r.pausa.motivo) : '')+'. Rotina, Chamado da Zona e sequência estão protegidos. <button class="btn sm" data-a="rotPausaFim">Encerrar a pausa</button></div>';
    if (r.leve) aviso += '<div class="callout warn" style="font-size:14px">'+U.icon('moon')+' <b>Modo leve</b> desde '+U.fmtDate(r.leve.de)+': três noites ruins seguidas. Hoje vale o dia mínimo e o Chamado da Zona fica suspenso. Sai sozinho na primeira noite boa registrada.</div>';
    var ontem = U.addDays(t, -1);
    if (at0.length && E.rotDia(S, ontem) === 'falhou' && !E.rotOk(st)) aviso += '<div class="callout fail" style="font-size:14px">'+U.icon('alert')+' Ontem falhou. Hoje não pode: nem que seja o dia mínimo, 10 minutos de cada bloco.</div>';
    if (!at0.length) aviso += '<div class="callout" style="font-size:14px">'+U.icon('clock')+' A Onda 1 começa em '+U.fmtDate(E.rotOndaDe(S, 1) || R.INICIO)+'.</div>';

    var sono = '<section class="win"><div class="win-h">'+U.icon('moon')+'Sono · métrica número um</div><div class="row" style="gap:8px">'
      + [['bom','Noite boa'],['ok','Mais ou menos'],['ruim','Noite ruim']].map(function(o){ return '<button class="btn sm'+(rec.sono === o[0] ? ' primary' : '')+'" data-a="rotSono" data-k="'+o[0]+'">'+o[1]+'</button>'; }).join('')
      + '<span class="faint" style="font-size:13px">Três noites ruins seguidas ligam o modo leve.</span></div></section>';

    var blocos = '<section class="win"><div class="win-h">'+U.icon('check')+'Hoje · '+U.fmtDate(t)+'<span class="act">'+App.rotStLabel(st)+'</span></div>'
      + (at0.length ? '<div class="stack" style="gap:8px">'+at0.map(function(b){
          var v = E.rotBloco(rec, b.id), mins = (rec.m && rec.m[b.id]) || 0, w = SYS.WAYMAP[b.way];
          return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto;--wc:'+w.color+'"><span><b>'+U.esc(b.n)+'</b>'+(mins ? ' <span class="chip">'+mins+' min de bolso</span>' : '')+'<br><span class="faint" style="font-size:12.5px">'+U.esc(b.d)+'</span></span><span class="row" style="gap:6px;flex-wrap:nowrap">'
            + '<button class="btn sm'+(v === 'min' ? ' primary' : '')+'" data-a="rotBloco" data-id="'+b.id+'" data-k="min">Mínimo · 10 min</button><button class="btn sm'+(v === 'full' ? ' primary' : '')+'" data-a="rotBloco" data-id="'+b.id+'" data-k="full">Completo</button></span></div>';
        }).join('')+'</div>'
        + '<div class="row between" style="margin-top:10px"><span class="faint mono" style="font-size:11.5px">Folgas nesta semana: '+E.rotFolgaSemana(S, t)+'/1 · quebras (dois dias seguidos falhados): '+E.rotQuebras(S)+'</span><button class="btn sm ghost" data-a="rotFolga"'+(rec.folga ? '' : '')+'>'+U.icon('moon')+(rec.folga ? 'Desfazer a folga' : 'Folga de hoje')+'</button></div>' : '<div class="empty">Nenhum bloco ativo ainda.</div>')
      + '</section>';

    var semana = (function(){ var out = ''; for (var i = 13; i >= 0; i--) { var d = U.addDays(t, -i), s = E.rotDia(S, d); out += '<span class="chip '+({completo:'ok', minimo:'ok', folga:'', pausa:'', falhou:'bad', aberto:'glow'}[s] || '')+'" title="'+U.esc(d+' · '+App.rotStLabel(s))+'">'+d.slice(8)+'</span>'; } return '<section class="win"><div class="win-h">'+U.icon('flame')+'Últimos 14 dias</div><div class="row" style="gap:4px">'+out+'</div></section>'; })();

    var ondas = '<section class="win"><div class="win-h">'+U.icon('wave')+'Ondas de ativação</div><div class="stack" style="gap:6px">'
      + R.ONDAS.map(function(o){
        var n = o[0], d = E.rotOndaDe(S, n), prev = n > 1 ? E.rotOndaDe(S, n - 1) : null, falta = prev ? R.ESPERA - U.daysBetween(prev, t) : 0;
        var trava = n === 5 && !E.rotN4(S), pode = !d && n > 1 && prev && prev <= t && falta <= 0 && !trava;
        var acao = d ? (d > t ? '<span class="chip glow">começa em '+U.fmtDate(d)+'</span>' : '<span class="chip ok">ativa desde '+U.fmtDate(d)+'</span>') : pode ? '<button class="btn sm primary" data-a="rotOnda" data-n="'+n+'">'+U.icon('plus')+'Ativar a Onda '+n+'</button>' : '<span class="chip">'+U.icon('lock')+(trava ? 'depois do JLPT N4' : prev ? (falta > 0 ? 'faltam '+falta+' dias' : 'em breve') : 'depois da Onda '+(n - 1))+'</span>';
        return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto"><b>'+n+'</b><span>'+U.esc(o[1])+'<br><span class="faint" style="font-size:12.5px">'+U.esc(o[2])+'</span></span>'+acao+'</div>';
      }).join('') + '</div><p class="faint" style="font-size:12.5px;margin-top:8px">A onda seguinte libera '+R.ESPERA+' dias depois da anterior: tempo para ela rodar no automático.</p></section>';

    var f = App.ui.f.bolso || (App.ui.f.bolso = {min:30});
    var ativosId = at0.map(function(b){ return b.id; });
    var menu = R.BOLSO.filter(function(x){ return x[3].some(function(id){ return ativosId.indexOf(id) >= 0; }); });
    var bolso = '<section class="win"><div class="win-h">'+U.icon('bag')+'Menu de bolso · tempo morto da loja</div><p class="dim" style="font-size:13.5px">Só tarefas com ponto de salvamento. O menu cresce com as ondas: só aparece o que pertence a um bloco já ativo.</p>'
      + '<div class="row" style="gap:6px;margin:8px 0">'+[2,5,10,15,30].map(function(m){ return '<button class="btn sm'+(+f.min === m ? ' primary' : '')+'" data-a="rotBolsoMin" data-k="'+m+'">'+m+' min</button>'; }).join('')+'</div>'
      + (menu.length ? '<div class="stack" style="gap:6px">'+menu.filter(function(x){ return x[0] <= +f.min; }).map(function(x){ var bid = x[3].filter(function(id){ return ativosId.indexOf(id) >= 0; })[0]; return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto"><span class="chip">'+x[0]+' min</span><span>'+U.esc(x[1])+'<br><span class="faint" style="font-size:12.5px">'+U.esc(x[2])+'</span></span><button class="btn sm" data-a="rotBolso" data-id="'+bid+'" data-k="'+x[0]+'">Feito</button></div>'; }).join('')+'</div>' : '<div class="empty">Nenhum bloco ativo ainda.</div>')
      + '<p class="faint" style="font-size:12.5px;margin-top:8px">Música: '+U.esc(R.MUSICA)+'</p></section>';

    var dias = E.rotAbst(S), a = r.abst;
    var abst = '<section class="win"><div class="win-h">'+U.icon('shield')+'Abstinentia · 30 dias sem Reels</div><div class="row between"><b style="font-size:22px">'+dias+' dia'+(dias === 1 ? '' : 's')+'</b><span class="faint mono" style="font-size:12px">desde '+U.fmtDate(a.ini)+' · app apagado</span></div>'+H.bar(U.pct(Math.min(dias, R.ABST.dias), R.ABST.dias))
      + '<p class="dim" style="font-size:13.5px;margin-top:8px">Instagram só pelo navegador do PC; a conta da loja pelo Meta Business Suite.</p>'
      + (dias >= R.ABST.dias ? '<div class="callout gate" style="font-size:14px">Trinta dias. Hora de reavaliar com calma, sem decidir no impulso. <button class="btn sm" data-a="rotAbstLog" data-k="reavaliei">Reavaliei</button></div>' : '')
      + '<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn sm ghost" data-a="rotAbstLog" data-k="recaida">Recaí: recomeçar a contagem</button></div>'
      + (a.log.length ? '<p class="faint" style="font-size:12px">'+a.log.slice(-5).map(function(l){ return U.fmtDate(l.d)+' · '+(l.k === 'recaida' ? 'recomeço' : 'reavaliação'); }).join(' · ')+'</p>' : '') + '</section>';

    var rv = r.rev, prox = rv.prox || App.rotProxRev(t);
    var protecao = '<section class="win"><div class="win-h">'+U.icon('shield')+'Regras de proteção</div><ul class="list">'+R.PROTECAO.map(function(x){ return '<li><span>'+U.esc(x)+'</span></li>'; }).join('')+'</ul>'
      + '<div class="grid g2" style="gap:10px;margin-top:10px"><div class="stack" style="gap:6px"><span class="eyebrow">Design congelado</span><span style="font-size:14px">Próxima revisão mensal: <b>'+U.fmtDate(prox)+'</b></span><span class="faint mono" style="font-size:12px">mexendo no sistema: '+(rv.mexe / 60).toFixed(1)+' h · usando: '+(rv.usa / 60).toFixed(1)+' h</span>'+(rv.mexe > rv.usa ? '<span class="chip bad">mexeu mais do que usou: hora de usar</span>' : '')+'</div>'
      + '<div class="row" style="gap:6px;align-items:flex-start"><button class="btn sm" data-a="rotHora" data-k="mexe">+30 min mexendo</button><button class="btn sm" data-a="rotHora" data-k="usa">+30 min usando</button><button class="btn sm ghost" data-a="rotRev"'+(t >= prox ? '' : ' disabled')+'>Fiz a revisão do mês</button></div></div>'
      + '<div class="row" style="gap:6px;margin-top:10px"><button class="btn sm" data-a="rotPausa">'+U.icon('moon')+'Pausa manual</button><a class="btn sm ghost" href="#/opus">'+U.icon('layers')+'Ritual de fechamento e projetos no SGM-Opus</a></div></section>';

    return head + aviso + sono + blocos + semana + bolso + ondas + abst + protecao;
  };
  App.rotStLabel = function(s){ return {antes:'antes do início', pausa:'pausa', folga:'folga', completo:'dia completo', minimo:'dia mínimo cumprido', aberto:'em aberto', falhou:'falhou'}[s] || s; };
  App.rotProxRev = function(t){ var d = new Date(t + 'T12:00:00'); d.setMonth(d.getMonth() + 1, 1); return d.toISOString().slice(0, 10); };

  /* ---------- ações ---------- */
  function dia(){ var r = App.rot(), t = U.today(); var rec = r.dias[t] || (r.dias[t] = {}); rec.b = rec.b || {}; rec.m = rec.m || {}; return rec; }
  App.A.rotBloco = function(el){ var rec = dia(), id = el.getAttribute('data-id'), k = el.getAttribute('data-k'); if (rec.b[id] === k) delete rec.b[id]; else rec.b[id] = k; App.commit(['core']); };
  App.A.rotSono = function(el){ var rec = dia(); rec.sono = el.getAttribute('data-k'); E.rotAplica(App.S); App.commit(['core']); };
  App.A.rotBolsoMin = function(el){ App.ui.f.bolso.min = +el.getAttribute('data-k'); App.renderView(); };
  App.A.rotBolso = function(el){ var rec = dia(), id = el.getAttribute('data-id'); rec.m[id] = (rec.m[id] || 0) + (+el.getAttribute('data-k')); App.commit(['core']); App.toast({t:'Bolso feito', s:'+' + el.getAttribute('data-k') + ' min em ' + R.MAP[id].n + '.', ic:'check'}); };
  App.A.rotFolga = function(){
    var S = App.S, rec = dia(), t = U.today();
    if (rec.folga) { delete rec.folga; App.commit(['core']); return; }
    if (E.rotFolgaSemana(S, t) >= 1) { App.toast({t:'Folga da semana já usada', s:'Um dia por semana. Hoje vale o dia mínimo.', ic:'moon'}); return; }
    rec.folga = true;
    var dr = S.daily[t] || (S.daily[t] = {q:{}, need:S.settings.dailies.length}); if (!dr.rest && E.restThisWeek(S, t) < 2) dr.rest = true;
    App.commit(['core']); App.toast({t:'Folga registrada', s:'Sem culpa e sem perder a sequência.', ic:'moon'});
  };
  App.A.rotOnda = function(el){ var S = App.S, r = App.rot(), n = +el.getAttribute('data-n'); if (n === 5 && !E.rotN4(S)) return; r.ondas[n] = U.today(); App.commit(['core']); App.toast({t:'Onda ' + n + ' ativa', s:'Um bloco novo entra. O resto continua igual.', ic:'wave'}); };
  App.A.rotAbstLog = function(el){ var r = App.rot(), k = el.getAttribute('data-k'); r.abst.log.push({d:U.today(), k:k}); if (k === 'recaida') r.abst.ini = U.today(); if (r.abst.log.length > 50) r.abst.log = r.abst.log.slice(-50); App.commit(['core']); };
  App.A.rotHora = function(el){ var r = App.rot(), k = el.getAttribute('data-k'); r.rev[k] = (r.rev[k] || 0) + 30; App.commit(['core']); };
  App.A.rotRev = function(){ var r = App.rot(), t = U.today(); r.rev.log.push({d:t, mexe:r.rev.mexe, usa:r.rev.usa}); if (r.rev.log.length > 36) r.rev.log = r.rev.log.slice(-36); r.rev.prox = App.rotProxRev(t); r.rev.mexe = 0; r.rev.usa = 0; App.commit(['core']); App.toast({t:'Revisão mensal feita', s:'O design congela de novo até ' + U.fmtDate(r.rev.prox) + '.', ic:'shield'}); };

  /* pausa manual: suspende a Rotina e o Chamado da Zona e protege a sequência das diárias */
  App.A.rotPausa = function(){ var r = App.rot(); App.ui.modal = {type:'rotPausa', ate:(r.pausa && r.pausa.ate) || U.addDays(U.today(), 6), motivo:(r.pausa && r.pausa.motivo) || ''}; App.renderModal(); };
  App.M.rotPausa = function(m){
    var r = App.rot(), on = !!(r.pausa && E.rotPausado(App.S, U.today()));
    return '<section class="win"><div class="win-h">'+U.icon('moon')+'Pausa manual<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><p class="dim" style="font-size:14px">Doença, viagem, semana pesada. Durante a pausa a Rotina não cobra, o Chamado da Zona fica suspenso e a sequência das diárias fica protegida. Até 31 dias por vez.</p>'
      + '<label class="fld">Até quando<input type="date" data-i="rotPausaF" data-k="ate" value="'+U.esc(m.ate || '')+'"></label>'
      + '<label class="fld">Motivo (opcional)<input type="text" maxlength="80" data-i="rotPausaF" data-k="motivo" value="'+U.esc(m.motivo || '')+'"></label>'
      + '<div class="row" style="justify-content:flex-end">'+(on ? '<button class="btn ghost" data-a="rotPausaFim">Encerrar a pausa</button>' : '')+'<button class="btn primary" data-a="rotPausaOk">'+U.icon('moon')+(on ? 'Atualizar a pausa' : 'Pausar')+'</button></div></div></section>';
  };
  App.I.rotPausaF = function(el){ if (App.ui.modal) App.ui.modal[el.getAttribute('data-k')] = el.value; };
  App.A.rotPausaOk = function(){
    var m = App.ui.modal, S = App.S, r = App.rot(), t = U.today();
    var ate = m.ate && m.ate >= t ? m.ate : t; if (U.daysBetween(t, ate) > 30) ate = U.addDays(t, 30);
    r.pausa = {de:(r.pausa && E.rotPausado(S, t) && r.pausa.de) || t, ate:ate, motivo:(m.motivo || '').slice(0, 80)};
    if (S.pz && S.pz.on && (!S.pz.pause || S.pz.pause < ate)) S.pz.pause = ate;
    E.rotProtegeDias(S, t, ate);
    App.ui.modal = null; App.commit(['core']); App.toast({t:'Pausa até ' + U.fmtDate(ate), s:'Descansar também é parte do sistema.', ic:'moon'});
  };
  App.A.rotPausaFim = function(){
    var S = App.S, r = App.rot(), t = U.today(); if (!r.pausa) return;
    var ate = r.pausa.ate; r.pausa = null;
    if (S.pz && S.pz.pause && S.pz.pause === ate) S.pz.pause = '';
    for (var d = U.addDays(t, 1), i = 0; ate && d <= ate && i < 31; d = U.addDays(d, 1), i++) { var rec = S.daily[d]; if (rec && rec.pausa && !Object.keys(rec.q || {}).length) delete S.daily[d]; }
    App.ui.modal = null; App.commit(['core']); App.toast({t:'Pausa encerrada', s:'Volta pelo dia mínimo. Sem pressa de compensar.', ic:'sparkle'});
  };

  /* pílula de pausa sempre visível no topo */
  var oldHud = App.renderHud;
  App.renderHud = function(){
    oldHud.apply(this, arguments);
    var box = App.$('hud') && App.$('hud').querySelector('.hud-pills'); if (!box || box.querySelector('.pausepill')) return;
    var S = App.S, p = S.rot && S.rot.pausa && E.rotPausado(S, U.today());
    var a = document.createElement('button'); a.className = 'pill pausepill'; a.type = 'button'; a.setAttribute('data-a', 'rotPausa');
    a.title = p ? 'Pausado até ' + U.fmtDate(S.rot.pausa.ate) : 'Pausa manual: protege a Rotina, a Zona e a sequência';
    a.innerHTML = U.icon('moon') + '<b>' + (p ? 'pausado' : 'pausa') + '</b>';
    box.insertBefore(a, box.firstChild);
  };

  /* virada de dia: modo leve e fim de pausa */
  var oldSeen = App.onSeen;
  App.onSeen = function(){ oldSeen.apply(this, arguments); var S = App.S; if (S && S._u && S.rot && E.rotAplica(S)) Store.asAuto(function(){ App.commit(['core'], {quiet:true}); }); };
})();
