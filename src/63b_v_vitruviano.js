/* ===== v21 · VIEW + REGRAS do Vitruviano =====
   · ranks da Mathematica (sobem só com Prova), examinadoras por domínio, faixa do mês da Harmonia;
   · Prova fecha só com o mini-artigo (pergunta, método, resultado, limitações, próximo passo) e o projeto do SGM-Opus;
   · XP dupla: o projeto escolhido define o segundo Caminho (a soma acontece em 87_v21_ganchos.js);
   · Filtro de Vitrúvio nas missões laterais do Vitruviano: sem "serve a qual Prova ou projeto?", não entra;
   · chinês só depois do JLPT N4 (reqN nos nós);
   · Chefes e calibração (ITA, MIT OCW, ENEM 2027, problema aberto, Vigil Caeli), registrados como Ommen Bannal;
   · Títulos Prokopton e Kalokagathia, com a condição e as três barras na tela.
   Estado novo no core: S.vit = {proj:{nó:projeto}, calib:[], faixa:{mês:{t,d}}}. O texto do mini-artigo mora no
   documento notes (App.N.n[nó].art), como as outras notas de nó. */
(function(){
  var VW = 'vitruviano';
  SYS.VIT = {
    RANKS: [['mt1','I · Elementa','Ensino médio'],['mt2','II · Calculus','Graduação, 1º ano'],['mt3','III · Linearis','Graduação, 2º ano'],['mt4','IV · Signum','Graduação, 3º e 4º anos de Engenharia Elétrica'],['mt5','V · Estimatio','Fim da graduação e início do mestrado'],['mt6','VI · Micromotus','Mestrado'],['mt7','Shadow · Opus Publicum','Pesquisa']],
    PROVAS: ['MT05','MT10','MT15','MT20','MT25','MT30','MT35'],
    CHEFES_DOMINIO: [['mat','MT30','Ver Chefes e calibração'],['har','M75','Faixa com restrição imposta, com a progressão tocada ao piano'],['phi','P23','Diálogo socrático escrito sobre uma decisão real'],['pol','PO06','Disputa de poder real analisada a frio: os dois lados no Teste de Turing, mapa de poder e previsão conferida'],['lin','L04','Certificações de cada idioma'],['shadow','SM06','Em cada domínio, achar e corrigir com prova um erro real de uma IA']],
    ART: [['perg','Pergunta','A pergunta numa frase.'],['met','Método','O que você mediu ou calculou, e como outra pessoa repete.'],['res','Resultado','O que deu, com o número e a figura que dizem a conclusão.'],['lim','Limitações','Onde o resultado pode estar errado.'],['prox','Próximo passo','O que essa Prova abre.']],
    ART_MIN: 20,
    CHEFES: [
      {id:'ita', n:'ITA (prova antiga em casa ou como treineiro)', mede:'Precisão e velocidade no terreno dos especialistas', ranks:'Mathematica I e II, mais inglês', como:'Protocolo duplo: uma prova sem limite de tempo (precisão) e outra de ano próximo no tempo oficial (velocidade). A diferença é o déficit de fluência. Escopo: Matemática, Física e Inglês; Química fica fora.', prot:true},
      {id:'mit', n:'Provas finais do MIT OpenCourseWare', mede:'Domínio de graduação', ranks:'Mathematica II a IV', como:'Prova final com gabarito, no tempo da disciplina.'},
      {id:'enem', n:'ENEM 2027', mede:'Evolução contra a linha de base', ranks:'Mathematica I e II; Lingua (redação)', como:'Comparar com a média de 620, feita sem preparo, sem sono e com pressa.', base:620},
      {id:'aberto', n:'Problema aberto do SGM-Opus', mede:'Modelagem: transformar o mundo em problema', ranks:'Todos', como:'Ex.: a fila da Infomax, a partir de dados reais e bagunçados.'},
      {id:'vigil', n:'Classificador do Vigil Caeli', mede:'Pesquisa aplicada', ranks:'Mathematica VI', como:'ROC e matriz de confusão publicadas.'}
    ],
    CODINOME: 'Ommen Bannal',
    REGRAS: [
      ['Filtro de Vitrúvio','Todo item de estudo novo do Vitruviano responde "serve a qual Prova ou projeto?". Sem resposta, não entra (utilitas). Só conta o que foi provado ou medido (firmitas). A entrega precisa ser bem-feita (venustas).'],
      ['XP dupla','Prova de um domínio feita dentro de projeto de outro Way dá XP nos dois: o Monte Carlo do Prospectus conta para Navigation e Mathematica; o Variabilitas conta para o Way físico e Mathematica.'],
      ['Toda Prova vira mini-artigo','Até duas páginas: pergunta, método, resultado, limitações, próximo passo. A Prova só fecha com o texto anexado. O preprint do Opus Publicum é o sétimo texto desse formato, não o primeiro.'],
      ['Ranks da Mathematica','Cada rank só sobe com uma Prova entregue num projeto do SGM-Opus. O selo do rank abre o seguinte.'],
      ['Composição em dose fixa','A Harmonia compõe uma faixa por mês, no máximo. O piano é o instrumento-base de teoria e ouvido e só é comprado depois de 30 dias seguidos de treino de ouvido e teoria.'],
      ['Idiomas em ordem','Inglês e português desde já; japonês na Onda 3; chinês só depois do JLPT N4, aproveitando os kanji.'],
      ['Química de bancada não é domínio','É uma ficha de segurança do Artifex (baterias de lítio, fumaça de solda, filamentos, corrosão), lida antes da primeira solda.'],
      ['Chefes medem, não passam','Cada resultado vai para o Ascension com data e condições. Os simulados são registrados como "Ommen Bannal". Nunca na prova oficial: identificação fora do lugar pode anular a prova.']
    ]
  };
  var V = SYS.VIT;

  /* ---------- estado ---------- */
  var oldNew = E.newState;
  E.newState = function(){ var s = oldNew.apply(this, arguments); s.vit = {proj:{}, calib:[], faixa:{}}; return s; };
  App.vit = function(){ var S = App.S; var v = S.vit || (S.vit = {proj:{}, calib:[], faixa:{}}); v.proj = v.proj || {}; v.calib = v.calib || []; v.faixa = v.faixa || {}; return v; };

  /* ---------- regras ---------- */
  E.isProva = function(n){ return !!(n && n.prova); };
  E.artOk = function(N, id){
    var a = N && N.n && N.n[id] && N.n[id].art;
    return !!a && V.ART.every(function(f){ return String(a[f[0]] || '').trim().length >= V.ART_MIN; });
  };
  E.provaPronta = function(S, N, n){ return E.artOk(N, n.id) && !!(S.vit && S.vit.proj && S.vit.proj[n.id]); };
  E.mathRank = function(S){
    var r = 0;
    for (var i = 0; i < V.PROVAS.length; i++) { var st = S.nodes[V.PROVAS[i]]; if (st && st.s === 'done') r = i + 1; else break; }
    return r;
  };
  E.mathRankName = function(r){ return r ? V.RANKS[r - 1][1] : 'sem rank'; };

  /* chinês só depois do JLPT N4: nó com reqN só anda depois dos nós listados */
  var oldReq = E.reqOk;
  E.reqOk = function(S, n){
    if (!oldReq(S, n)) return false;
    if (S.settings.openWorld || !n.reqN) return true;
    return n.reqN.every(function(id){ var st = S.nodes[id]; return !!(st && st.s === 'done'); });
  };
  var oldLock = App.nodeLockMsg;
  App.nodeLockMsg = function(n){
    var msgs = oldLock(n), S = App.S;
    if (!S.settings.openWorld) (n.reqN || []).forEach(function(id){ var st = S.nodes[id], m = E.NODE[id]; if (!(st && st.s === 'done') && m) msgs.push('Abre depois de <b>' + U.esc(m.id + ' · ' + m.t) + '</b>.'); });
    return msgs;
  };

  /* Prokopton e Kalokagathia: corpo e caráter juntos, nos três ao mesmo tempo */
  E.kalok = function(D){
    var wv = SYS.WAYMAP.vitruviano, wa = SYS.WAYMAP.aesthetic, cal = wa && wa.brmap && wa.brmap.cal;
    if (!wv || !wa || !cal || !D || !D.tier) return {rows:[], prokopton:false, kalokagathia:false};
    var rows = [
      {k:'vitruviano', n:'Vitruviano', w:wv, xp:D.wayXP.vitruviano || 0, ti:D.tier.vitruviano, tiers:wv.tiers},
      {k:'aesthetic', n:'Aesthetic (Presença)', w:wa, xp:D.wayXP.aesthetic || 0, ti:D.tier.aesthetic, tiers:wa.tiers},
      {k:'cal', n:'Calistenia (o Way físico · Corpus)', w:wa, xp:(D.brXP.aesthetic || {}).cal || 0, ti:(D.brTier.aesthetic || {}).cal, tiers:cal.tiers}
    ];
    rows.forEach(function(r){ r.iv = r.tiers[3]; r.max = r.tiers[r.tiers.length - 1]; r.i = r.ti ? r.ti.i : 0; r.okIV = r.i >= 3; r.okMax = r.i >= r.tiers.length - 1; });
    return {rows:rows, prokopton:rows.every(function(r){ return r.okIV; }), kalokagathia:rows.every(function(r){ return r.okMax; })};
  };
  App.kalokPanel = function(){
    var K = E.kalok(App.D); if (!K.rows.length) return '';
    var row = function(r, alvo, ok){ var t = alvo === 'iv' ? r.iv : r.max; return '<div class="stack" style="gap:3px"><div class="row between mono" style="font-size:12px"><span style="color:'+r.w.color+'">'+U.esc(r.n)+'</span><span class="'+(ok ? 'ok' : 'dim')+'">'+U.num(r.xp)+' / '+U.num(t[0])+' XP · '+U.esc(t[1])+(ok ? ' ✓' : '')+'</span></div>'+H.bar(U.pct(r.xp, t[0] || 1), 'way', r.w.color)+'</div>'; };
    var bloco = function(nome, alvo, done, cond){ return '<div class="stack" style="gap:8px;padding:10px 0"><div class="row between"><b>'+nome+'</b>'+(done ? '<span class="chip ok">'+U.icon('check')+'desbloqueado</span>' : '<span class="chip">'+U.icon('lock')+'bloqueado</span>')+'</div><p class="dim" style="font-size:13.5px;margin:0">'+cond+'</p>'+K.rows.map(function(r){ return row(r, alvo, alvo === 'iv' ? r.okIV : r.okMax); }).join('')+'</div>'; };
    return '<section class="win kalok"><div class="win-h">'+U.icon('banner')+'Títulos acima dos Ways<a class="act" href="#/titulos">títulos →</a></div>'
      + '<p class="dim" style="font-size:14px">O ideal grego do belo e bom pede corpo e caráter juntos, por isso é Título e não Way. O progresso dos três aparece ao mesmo tempo.</p>'
      + bloco('Prokopton · προκόπτων, o que progride', 'iv', K.prokopton, 'Condição: tier IV no Vitruviano, no Aesthetic e na vertente Calistenia. É o marco dos 6 a 12 meses de ascensão e o gatilho da tatuagem.')
      + bloco('Kalokagathia · καλὸς κἀγαθός', 'max', K.kalokagathia, 'Condição: tier máximo no Vitruviano, no Aesthetic e na vertente Calistenia. O ápice.')
      + '<div class="callout" style="font-size:13.5px"><b>Recompensa planejada:</b> a tatuagem nas costas, no Prokopton. Opções: a tríade Firmitas · Utilitas · Venustas, καλὸς κἀγαθός, o Homem Vitruviano ou Sustine et abstine. O Homem Vitruviano não usa a proporção áurea.</div></section>';
  };

  /* ---------- nomes e examinadoras ---------- */
  App.sombraNome = function(id){ var M = SYS.SG && SYS.SG.MAP && SYS.SG.MAP[id]; return M ? M.n : id.charAt(0).toUpperCase() + id.slice(1); };
  App.examinadoras = function(br){ var w = SYS.WAYMAP.vitruviano, ids = (w && w.exam && w.exam[br]) || []; return ids.map(App.sombraNome).join(' e '); };
  App.projNome = function(pid){ var P = SYS.OPUS && SYS.OPUS.MAP && SYS.OPUS.MAP[pid]; return P ? P.n : pid; };
  App.projWays = function(pid){ var P = SYS.OPUS && SYS.OPUS.MAP && SYS.OPUS.MAP[pid]; return P ? P.ways : []; };
  App.mesKey = function(){ return U.calToday().slice(0, 7); };

  /* ---------- faixa de domínios (aparece em todas as abas do Vitruviano) ---------- */
  App.vitStrip = function(){
    var S = App.S, D = App.D, w = SYS.WAYMAP.vitruviano, r = E.mathRank(S), v = App.vit(), fm = v.faixa[App.mesKey()];
    var cards = w.branches.map(function(b){
      var extra = b.id === 'mat' ? (r ? 'rank ' + E.mathRankName(r) : 'rank I em andamento') : b.id === 'har' ? (fm ? 'Faixa do mês: ' + fm.t : 'Faixa do mês: ainda não') : '';
      return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto"><span style="color:'+w.color+'">'+U.icon(b.ic)+'</span><span><b>'+U.esc(b.n)+'</b><br><span class="faint" style="font-size:12.5px">examinadora: '+U.esc(App.examinadoras(b.id))+(extra ? ' · '+U.esc(extra) : '')+'</span></span><span class="mono dim" style="font-size:11.5px">'+(D.brDone.vitruviano[b.id] || 0)+'/'+b.nodes.length+'</span></div>';
    }).join('');
    return '<section class="win vitstrip" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('vitruvian')+'Cinco domínios e o Shadow<span class="act dim">Superare Machinam · banca das Sete Sombras</span></div><div class="grid g2" style="gap:4px 18px">'+cards+'</div>'
      + '<div class="row" style="gap:8px;margin-top:10px">'+(fm ? '<span class="chip ok">'+U.icon('wave')+'Faixa de '+U.esc(App.mesKey())+': '+U.esc(fm.t)+'</span>' : '<button class="btn sm" data-a="vitFaixa">'+U.icon('wave')+'Registrar a faixa do mês</button>')+'<a class="btn sm ghost" href="#/caminhos/vitruviano/provas">'+U.icon('cert')+'Provas & rank</a><a class="btn sm ghost" href="#/caminhos/vitruviano/chefes">'+U.icon('target')+'Chefes & calibração</a></div></section>';
  };

  /* ---------- abas novas ---------- */
  var oldTabs = App.wayTabs;
  App.wayTabs = function(w){
    var t = oldTabs(w); if (w.id !== VW) return t;
    var S = App.S, at = t.length - 1;   /* antes de Feitos */
    t.splice(at, 0, ['provas', 'Provas & Rank', 'cert', E.mathRank(S) + '/7'], ['chefes', 'Chefes', 'target', App.vit().calib.length], ['regras', 'Regras', 'shield']);
    return t;
  };
  var oldTrail = App.wayTrail;
  App.wayTrail = function(w, br){
    if (w.id === VW) { var sub = App.ui.sub; if (sub === 'provas') return App.provasPanel(); if (sub === 'chefes') return App.chefesPanel(); if (sub === 'regras') return App.vitRegras(); }
    return oldTrail(w, br);
  };
  var oldWay = App.V.way;
  App.V.way = function(wid){
    var html = oldWay(wid); if (wid !== VW) return html;
    var cut = html.indexOf('</section>'); if (cut < 0) return html;
    cut += '</section>'.length;
    return html.slice(0, cut) + App.vitStrip() + App.kalokPanel() + html.slice(cut);
  };
  var oldTit = App.V.titulos;
  App.V.titulos = function(){ return App.kalokPanel() + oldTit(); };

  App.provasPanel = function(){
    var S = App.S, N = App.N, v = App.vit(), r = E.mathRank(S);
    var head = '<section class="win"><div class="win-h">'+U.icon('cert')+'Ranks da Mathematica · '+U.esc(E.mathRankName(r))+'</div><p class="dim" style="font-size:14px">Cada rank sobe com uma Prova entregue num projeto do SGM-Opus. A Prova só fecha com o mini-artigo (até duas páginas). Se o projeto for de outro Way, a Prova dá XP nos dois.</p>'
      + '<div class="stack" style="gap:6px">' + V.RANKS.map(function(rk, i){
        var n = E.NODE[V.PROVAS[i]], st = H.st(n.id), proj = v.proj[n.id], art = E.artOk(N, n.id), ways = proj ? App.projWays(proj).filter(function(x){ return x !== VW; }) : [];
        return '<div class="q '+st+(n.final ? ' boss' : '')+'" style="--wc:'+SYS.WAYMAP.vitruviano.color+';cursor:default"><span class="st">'+(st === 'done' ? U.icon('check') : '<span>'+(i < 6 ? 'R'+(i+1) : 'S')+'</span>')+'</span>'
          + '<span style="min-width:0"><span class="tt">'+U.esc(rk[1])+' · '+U.esc(rk[2])+'</span><span class="mt"><span class="chip">'+U.esc(n.id)+'</span><span class="chip">'+U.esc(n.t.replace(/^PROVA [^·]+· /, ''))+'</span>'
          + '<span class="chip '+(art ? 'ok' : '')+'">'+U.icon('journal')+(art ? 'mini-artigo pronto' : 'mini-artigo pendente')+'</span>'
          + (proj ? '<span class="chip">'+U.icon('map')+U.esc(App.projNome(proj))+'</span>' : '<span class="chip warn">sem projeto</span>')
          + (ways.length ? '<span class="chip glow">XP dupla: '+ways.map(function(x){ return U.esc(SYS.WAYMAP[x].name.replace(/^The /, '')); }).join(' + ')+'</span>' : '')
          + '</span></span><span class="row" style="gap:6px;flex-wrap:nowrap"><button class="btn sm" data-a="vitArt" data-id="'+n.id+'">'+U.icon('pen')+'Mini-artigo</button><button class="btn sm ghost" data-a="openNode" data-id="'+n.id+'">Abrir</button></span></div>';
      }).join('') + '</div></section>';
    var outros = '<section class="win"><div class="win-h">'+U.icon('sword')+'Chefes dos domínios</div><div class="stack" style="gap:6px">'
      + V.CHEFES_DOMINIO.map(function(c){ var n = E.NODE[c[1]], b = SYS.WAYMAP.vitruviano.brmap[c[0]]; if (!n) return ''; return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto"><span><b>'+U.esc(b ? b.n : 'Shadow · Superare Machinam')+'</b> · '+U.esc(c[2])+'<br><span class="faint" style="font-size:12.5px">examinadora: '+U.esc(App.examinadoras(c[0]))+'</span></span>'+H.stChip(H.st(n.id))+'</div>'; }).join('')
      + '</div></section>';
    return head + outros;
  };

  App.chefesPanel = function(){
    var v = App.vit(), f = App.ui.f.calib || (App.ui.f.calib = {chefe:'ita', d:U.today(), prot:'precisao', nota:'', max:'', tempo:'', cond:'', obs:''});
    var list = v.calib.slice().sort(function(a, b){ return a.d < b.d ? 1 : -1; });
    var ita = (function(){ var p = list.filter(function(x){ return x.chefe === 'ita' && x.prot === 'precisao' && x.max; })[0], s = list.filter(function(x){ return x.chefe === 'ita' && x.prot === 'velocidade' && x.max; })[0]; if (!p || !s) return null; var pp = 100 * p.nota / p.max, sp = 100 * s.nota / s.max; return {p:pp, s:sp, def:pp - sp}; })();
    var enem = list.filter(function(x){ return x.chefe === 'enem' && x.nota; })[0];
    var cards = V.CHEFES.map(function(c){ var n = list.filter(function(x){ return x.chefe === c.id; }).length; return '<article class="item"><span class="in">'+U.esc(c.n)+'</span><dl class="kv" style="grid-template-columns:1fr;gap:2px;font-size:13.5px"><dt>Mede</dt><dd>'+U.esc(c.mede)+'</dd><dt>Ranks</dt><dd>'+U.esc(c.ranks)+'</dd><dt>Como</dt><dd>'+U.esc(c.como)+'</dd></dl><span class="chip">'+n+' registro'+(n === 1 ? '' : 's')+'</span></article>'; }).join('');
    var form = '<section class="win"><div class="win-h">'+U.icon('plus')+'Registrar um resultado · '+U.esc(V.CODINOME)+'</div><p class="dim" style="font-size:13.5px">O objetivo é medir, não passar. Data e condições sempre. Simulado registrado como “'+U.esc(V.CODINOME)+'”, aqui e no caderno; nunca na prova oficial.</p>'
      + '<div class="grid g2" style="gap:8px"><label class="fld">Chefe<select data-c="calF" data-k="chefe">'+V.CHEFES.map(function(c){ return '<option value="'+c.id+'"'+(f.chefe === c.id ? ' selected' : '')+'>'+U.esc(c.n)+'</option>'; }).join('')+'</select></label>'
      + '<label class="fld">Data<input type="date" data-c="calF" data-k="d" value="'+U.esc(f.d)+'"></label>'
      + (f.chefe === 'ita' ? '<label class="fld">Protocolo<select data-c="calF" data-k="prot"><option value="precisao"'+(f.prot === 'precisao' ? ' selected' : '')+'>Precisão · sem limite de tempo</option><option value="velocidade"'+(f.prot === 'velocidade' ? ' selected' : '')+'>Velocidade · tempo oficial, ano próximo</option></select></label>' : '')
      + '<label class="fld">Nota ou acertos<input type="number" min="0" step="any" data-i="calF" data-k="nota" value="'+U.esc(f.nota)+'"></label>'
      + '<label class="fld">De quanto (máximo)<input type="number" min="0" step="any" data-i="calF" data-k="max" value="'+U.esc(f.max)+'"></label>'
      + '<label class="fld">Tempo usado<input type="text" maxlength="40" data-i="calF" data-k="tempo" value="'+U.esc(f.tempo)+'" placeholder="ex.: 4h10"></label></div>'
      + '<label class="fld">Condições (sono, local, interrupções, prova de que ano)<input type="text" maxlength="240" data-i="calF" data-k="cond" value="'+U.esc(f.cond)+'"></label>'
      + '<label class="fld">O que o resultado diz<textarea rows="3" maxlength="800" data-i="calF" data-k="obs">'+U.esc(f.obs)+'</textarea></label>'
      + '<div class="row" style="justify-content:flex-end"><button class="btn primary" data-a="calAdd">'+U.icon('plus')+'Registrar</button></div></section>';
    var resumo = '<section class="win"><div class="win-h">'+U.icon('target')+'Calibração</div><div class="stack" style="gap:6px;font-size:14px">'
      + (ita ? '<div>ITA · precisão '+ita.p.toFixed(0)+'% · velocidade '+ita.s.toFixed(0)+'% · <b>déficit de fluência '+ita.def.toFixed(0)+' pontos</b></div>' : '<div class="dim">ITA: registre uma prova de precisão e uma de velocidade para ver o déficit de fluência.</div>')
      + (enem ? '<div>ENEM · última média '+U.esc(String(enem.nota))+' contra a linha de base de 620 ('+(enem.nota - 620 >= 0 ? '+' : '')+(enem.nota - 620).toFixed(0)+')</div>' : '<div class="dim">ENEM 2027: a linha de base é a média de 620.</div>')
      + '<div class="faint" style="font-size:13px">Treineiro do ITA: pelo edital, quem não cumpre os requisitos de idade ou escolaridade pode fazer a prova como treineiro, sem validade para matrícula. Para matrícula, o candidato não pode completar 25 anos até 31 de dezembro do ano de ingresso. Conferir o edital do ano.</div></div></section>';
    var hist = '<section class="win"><div class="win-h">'+U.icon('journal')+'Registros · '+list.length+'</div>'+(list.length ? '<div class="stack" style="gap:6px">'+list.map(function(x){ var c = V.CHEFES.filter(function(k){ return k.id === x.chefe; })[0] || {n:x.chefe}; return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto"><span><b>'+U.esc(c.n)+'</b>'+(x.prot ? ' · '+(x.prot === 'precisao' ? 'precisão' : 'velocidade') : '')+' · '+U.esc(String(x.nota))+(x.max ? ' / '+U.esc(String(x.max)) : '')+(x.tempo ? ' · '+U.esc(x.tempo) : '')+'<br><span class="faint" style="font-size:12.5px">'+U.fmtDate(x.d)+' · '+U.esc(x.cod || V.CODINOME)+(x.cond ? ' · '+U.esc(x.cond) : '')+'</span>'+(x.obs ? '<br><span class="dim" style="font-size:13px">'+U.esc(x.obs)+'</span>' : '')+'</span><button class="iconbtn" data-a="calDel" data-id="'+x.id+'" aria-label="Apagar registro">'+U.icon('trash')+'</button></div>'; }).join('')+'</div>' : '<div class="empty">Nenhum chefe medido ainda.</div>')+'</section>';
    return '<div class="stack" style="gap:16px">'+resumo+form+'<div class="shop">'+cards+'</div>'+hist+'</div>';
  };
  App.vitRegras = function(){
    return '<section class="win"><div class="win-h">'+U.icon('shield')+'Regras do Vitruviano</div><ul class="list">'+V.REGRAS.map(function(r){ return '<li><span><b>'+U.esc(r[0])+'.</b> '+U.esc(r[1])+'</span></li>'; }).join('')+'</ul></section>';
  };

  /* ---------- ações: chefes ---------- */
  App.C.calF = function(el){ App.ui.f.calib[el.getAttribute('data-k')] = el.value; if (el.getAttribute('data-k') === 'chefe') App.renderView(); };
  App.I.calF = function(el){ App.ui.f.calib[el.getAttribute('data-k')] = el.value; };
  App.A.calAdd = function(){
    var f = App.ui.f.calib, v = App.vit();
    if (!f || f.nota === '' || isNaN(+f.nota)) { App.toast({t:'Falta a nota', s:'Chefe sem número não calibra nada.', ic:'alert'}); return; }
    if (!f.d) { App.toast({t:'Falta a data', s:'Todo resultado vai com data e condições.', ic:'alert'}); return; }
    v.calib.push({id:U.uid(), chefe:f.chefe, d:f.d, prot:f.chefe === 'ita' ? f.prot : null, nota:+f.nota, max:f.max === '' ? null : +f.max, tempo:(f.tempo || '').slice(0, 40), cond:(f.cond || '').slice(0, 240), obs:(f.obs || '').slice(0, 800), cod:V.CODINOME});
    if (v.calib.length > 200) v.calib = v.calib.slice(-200);
    App.ui.f.calib = {chefe:f.chefe, d:U.today(), prot:f.prot, nota:'', max:'', tempo:'', cond:'', obs:''};
    App.commit(['core']);
    App.toast({t:'Chefe medido', s:'Registrado como ' + V.CODINOME + '. O número agora é seu.', ic:'target'});
  };
  App.A.calDel = function(el){ var v = App.vit(), id = el.getAttribute('data-id'); v.calib = v.calib.filter(function(x){ return x.id !== id; }); App.commit(['core']); };

  /* ---------- ações: faixa do mês ---------- */
  App.A.vitFaixa = function(){ App.ui.modal = {type:'vitFaixa', t:''}; App.renderModal(); };
  App.M.vitFaixa = function(m){
    return '<section class="win"><div class="win-h">'+U.icon('wave')+'Faixa de '+U.esc(App.mesKey())+'<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><p class="dim">Dose fixa: uma faixa terminada por mês. Terminada é exportada, não “quase”.</p><label class="fld">Nome da faixa<input type="text" maxlength="80" data-i="vitFaixaT" value="'+U.esc(m.t || '')+'"></label><div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn primary" data-a="vitFaixaOk">'+U.icon('check')+'Registrar</button></div></div></section>';
  };
  App.I.vitFaixaT = function(el){ if (App.ui.modal) App.ui.modal.t = el.value; };
  App.A.vitFaixaOk = function(){
    var m = App.ui.modal, t = ((m && m.t) || '').trim(); if (t.length < 2) { App.toast({t:'Sem nome', s:'Toda faixa terminada tem nome.', ic:'alert'}); return; }
    App.vit().faixa[App.mesKey()] = {t:t.slice(0, 80), d:U.today()}; App.ui.modal = null; App.commit(['core']);
    App.toast({t:'Faixa do mês registrada', s:'Uma por mês. A próxima espera o mês virar.', ic:'wave'});
  };

  /* ---------- mini-artigo e projeto da Prova ---------- */
  App.A.vitArt = function(el){ App.ui.drawer = null; App.ui.modal = {type:'vitArt', id:el.getAttribute('data-id')}; App.renderDrawer(); App.renderModal(); };
  App.M.vitArt = function(m){
    var n = E.NODE[m.id], a = (App.N.n[n.id] && App.N.n[n.id].art) || {}, proj = App.vit().proj[n.id] || '', sug = n.proj || [];
    var opts = (SYS.OPUS && SYS.OPUS.P || []).map(function(P){ return '<option value="'+P.id+'"'+(proj === P.id ? ' selected' : '')+'>'+U.esc(P.n)+(sug.indexOf(P.id) >= 0 ? ' (sugerido)' : '')+'</option>'; }).join('');
    return '<section class="win wide"><div class="win-h">'+U.icon('journal')+'Mini-artigo · '+U.esc(n.id)+'<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack">'
      + '<h3>'+U.esc(n.t)+'</h3><p class="dim" style="font-size:13.5px">Até duas páginas. Cada parte precisa de pelo menos '+V.ART_MIN+' caracteres para a Prova fechar. Salvo automaticamente.</p>'
      + '<label class="fld">Projeto do SGM-Opus onde a Prova aconteceu<select data-c="vitProj" data-id="'+n.id+'"><option value="">— escolha —</option>'+opts+'</select></label>'
      + V.ART.map(function(f){ return '<label class="fld">'+U.esc(f[1])+' <span class="faint">· '+U.esc(f[2])+'</span><textarea rows="3" maxlength="2400" data-i="vitArtF" data-id="'+n.id+'" data-k="'+f[0]+'">'+U.esc(a[f[0]] || '')+'</textarea></label>'; }).join('')
      + '<div class="row" style="justify-content:flex-end"><button class="btn primary" data-a="closeModal">'+U.icon('check')+'Pronto</button></div></div></section>';
  };
  App.I.vitArtF = function(el){ var id = el.getAttribute('data-id'), k = el.getAttribute('data-k'); var note = App.N.n[id] = App.N.n[id] || {}; var a = note.art = note.art || {}; a[k] = el.value.slice(0, 2400); App.debSave('notes'); };
  App.C.vitProj = function(el){ var id = el.getAttribute('data-id'), v = App.vit(); if (el.value) v.proj[id] = el.value; else delete v.proj[id]; App.commit(['core'], {norender:true}); };

  /* a Prova só fecha com o mini-artigo e o projeto */
  var oldDone = App.M.done;
  App.M.done = function(m){
    var html = oldDone(m), n = E.NODE[m.id]; if (!E.isProva(n)) return html;
    var ok = E.provaPronta(App.S, App.N, n);
    var box = '<div class="callout '+(ok ? 'gate' : 'fail')+'" style="font-size:14px"><b>Prova:</b> '+(ok ? 'mini-artigo e projeto prontos.' : 'só fecha com o mini-artigo completo (pergunta, método, resultado, limitações, próximo passo) e o projeto do SGM-Opus.')+' <button class="btn sm" data-a="vitArt" data-id="'+n.id+'">'+U.icon('pen')+'Mini-artigo</button></div>';
    html = html.replace('<label class="fld">Evidência (opcional)', box + '<label class="fld">Evidência (opcional)');
    if (!ok) html = html.replace('data-a="confirmDone"', 'data-a="confirmDone" disabled');
    return html;
  };
  var oldCheck = App.C.doneCheck;
  App.C.doneCheck = function(el){ oldCheck(el); var m = App.ui.modal, n = m && E.NODE[m.id]; if (n && E.isProva(n) && !E.provaPronta(App.S, App.N, n)) { var b = App.$('modal').querySelector('[data-a="confirmDone"]'); if (b) b.disabled = true; } };
  var oldConfirm = App.A.confirmDone;
  App.A.confirmDone = function(el){
    var m = App.ui.modal, n = m && E.NODE[m.id];
    if (n && E.isProva(n) && !E.provaPronta(App.S, App.N, n)) { App.toast({t:'Prova sem mini-artigo', s:'A Prova só fecha com o texto anexado e o projeto escolhido.', ic:'alert'}); return; }
    return oldConfirm.apply(this, arguments);
  };

  /* examinadora no topo da missão dos nós do Vitruviano */
  var oldMission = App.nodeMission;
  App.nodeMission = function(n){
    var h = oldMission(n); if (n.way !== VW) return h;
    var arc = E.arcOf(n), br = arc.br || 'shadow';
    var pre = '<p class="faint mono" style="font-size:12px;margin:0">Examinadora: '+U.esc(App.examinadoras(br))+(n.prova ? ' · Prova: fecha com mini-artigo · projetos sugeridos: '+U.esc((n.proj || []).map(App.projNome).join(', ')) : '')+'</p>';
    return pre + h;
  };

  /* ---------- Filtro de Vitrúvio nas missões laterais ---------- */
  App.serveOpts = function(val){
    var provas = V.PROVAS.concat(V.CHEFES_DOMINIO.map(function(c){ return c[1]; })).filter(function(id, i, a){ return E.NODE[id] && a.indexOf(id) === i; });
    return '<option value="">— serve a qual Prova ou projeto? —</option><optgroup label="Provas e chefes">'+provas.map(function(id){ var n = E.NODE[id]; return '<option value="n:'+id+'"'+(val === 'n:'+id ? ' selected' : '')+'>'+U.esc(id+' · '+n.t)+'</option>'; }).join('')+'</optgroup>'
      + '<optgroup label="Projetos do SGM-Opus">'+(SYS.OPUS && SYS.OPUS.P || []).map(function(P){ return '<option value="p:'+P.id+'"'+(val === 'p:'+P.id ? ' selected' : '')+'>'+U.esc(P.n)+'</option>'; }).join('')+'</optgroup>';
  };
  App.serveLabel = function(s){ if (!s) return ''; var k = s.slice(0, 2), id = s.slice(2); if (k === 'n:' && E.NODE[id]) return id + ' · ' + E.NODE[id].t; if (k === 'p:') return App.projNome(id); return s; };
  var oldLat = App.Q.laterais;
  App.Q.laterais = function(){
    var html = oldLat(), f = App.ui.f.side;
    if (!f || f.way !== VW) return html;
    var campo = '<div class="callout" style="margin-top:10px;font-size:13.5px"><b>Filtro de Vitrúvio.</b> Sem resposta, não entra (utilitas).<label class="fld" style="margin-top:6px">Serve a qual Prova ou projeto?<select data-c="sideServe">'+App.serveOpts(f.serve || '')+'</select></label></div>';
    return html.replace('<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="sideAdd">', campo + '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="sideAdd">');
  };
  App.C.sideServe = function(el){ App.ui.f.side.serve = el.value; };
  var oldSideWay = App.C.sideWay;
  App.C.sideWay = function(el){ oldSideWay(el); App.renderView(); };
  var oldSideAdd = App.A.sideAdd;
  App.A.sideAdd = function(){
    var f = App.ui.f.side, S = App.S;
    if (f && f.way === VW && !f.serve && (f.t || '').trim().length >= 3) { App.toast({t:'Filtro de Vitrúvio', s:'Serve a qual Prova ou projeto? Sem resposta, não entra.', ic:'alert'}); return; }
    var n0 = S.sideq.length, serve = f && f.serve;
    oldSideAdd.apply(this, arguments);
    if (f && f.way === VW && S.sideq.length > n0) { S.sideq[S.sideq.length - 1].serve = serve; f.serve = ''; Store.save(['core']); }
  };
})();
