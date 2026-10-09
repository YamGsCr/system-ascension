/* ===== v11 · TEMPORADA DE HIPERFOCO · um slot, prazo curto, log leve, encerramento honroso ===== */
SYS.HYP_MIN = 2;  /* semanas */
SYS.HYP_MAX = 6;

App.hyp = function(){ var S = App.S; S.hyp = S.hyp || {on:null, done:[], fila:[]}; S.hyp.done = S.hyp.done || []; S.hyp.fila = S.hyp.fila || []; if (S.hyp.on) S.hyp.on.log = S.hyp.on.log || []; return S.hyp; };

App.hypF = function(){ return App.ui.f.hyp || (App.ui.f.hyp = {t:'', q:'', no:'', dv:'', sem:4, achado:'', onde:'', perg:'', rel:'', ideia:''}); };

/* ---------- painel: compacto quando não tem temporada ativa, completo quando tem ---------- */
App.hypPanel = function(){
  var S = App.S, D = App.D, Z = App.hyp(), on = Z.on, f = App.hypF(), t = U.today(), wc = SYS.WAYMAP.mind.color;
  var fila = (Z.fila || []).map(function(x){ return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto auto;gap:8px"><span>' + U.esc(x.t) + '</span>'
      + (on ? '' : '<button class="btn sm ghost" data-a="hypPromote" data-id="' + x.id + '">abrir</button>')
      + '<button class="btn sm ghost" data-a="hypFilaDel" data-id="' + x.id + '">✕</button></div>'; }).join('')
    || '<p class="faint" style="font-size:13px">Fila vazia. Ideia que chegar fora de hora dorme aqui — não vira segunda temporada.</p>';
  var filaBox = '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Fila de espera</span>'
    + '<p class="dim" style="font-size:13px;margin:4px 0 8px">A fila existe para a ideia não ser perdida nem promovida na hora. Ela espera o slot abrir.</p>' + fila
    + '<div class="row" style="gap:8px;margin-top:8px"><label class="fld" style="flex:1">Nova ideia para a fila<input type="text" maxlength="120" data-i="hypF" data-k="ideia" value="' + U.esc(f.ideia) + '" placeholder="scp, cor de internet, história do bairro…"></label>'
    + '<button class="btn sm" data-a="hypFilaAdd" style="align-self:flex-end">' + U.icon('plus') + 'Guardar</button></div>';

  var hist = (Z.done || []).slice(-8).reverse().map(function(h){
    return '<div class="disc" style="grid-template-columns:auto minmax(0,1fr) auto;gap:8px"><span class="' + (h.ok ? 'ok' : 'dim') + '">' + U.icon(h.ok ? 'check' : 'flag') + '</span>'
      + '<span class="stack" style="gap:2px;min-width:0"><span style="font-size:13.5px;font-weight:600">' + U.esc(h.t) + '</span><span class="faint" style="font-size:12px">' + U.fmtDate(h.ini) + ' → ' + U.fmtDate(h.fim) + ' · ' + (h.log || 0) + ' anotações · ' + (h.ok ? 'entregou' : 'não deu — e está tudo bem') + '</span></span>'
      + '<span class="mono faint" style="font-size:11px">' + (h.sem || '?') + 'sem</span></div>'; }).join('');
  var histBox = (Z.done || []).length ? '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Temporadas encerradas · ' + (Z.done || []).length + '</span>'
    + '<p class="dim" style="font-size:13px;margin:4px 0 8px">Encerrada com relatório conta, mesmo quando a resposta foi “não deu”. Era esse o combinado.</p>' + hist : '';

  var head = '<section class="win" style="--wc:' + wc + '"><div class="win-h" style="color:' + wc + '">' + U.icon('scroll') + 'Temporada de Hiperfoco'
    + '<span class="act" style="cursor:default">sem sequência · sem diária</span></div>';

  if (!on) {
    return head + '<p class="dim" style="font-size:13.5px">Nenhuma temporada ativa. Um assunto por vez, de ' + SYS.HYP_MIN + ' a ' + SYS.HYP_MAX + ' semanas, com pergunta escrita e data de encerramento. Hobby aqui não gera cobrança diária: só ciclo com começo e fim.</p>'
      + '<div class="grid g2" style="gap:8px;margin-top:12px"><label class="fld">Assunto<input type="text" maxlength="90" data-i="hypF" data-k="t" value="' + U.esc(f.t) + '" placeholder="ARGs brasileiros, frutiger aero, imigração italiana em ES…"></label>'
      + '<label class="fld">Semanas (' + SYS.HYP_MIN + '–' + SYS.HYP_MAX + ')<input type="number" min="' + SYS.HYP_MIN + '" max="' + SYS.HYP_MAX + '" step="1" data-i="hypF" data-k="sem" value="' + U.esc(f.sem) + '"></label></div>'
      + '<label class="fld" style="margin-top:8px">Pergunta-guia (uma frase)<input type="text" maxlength="160" data-i="hypF" data-k="q" value="' + U.esc(f.q) + '" placeholder="o que exatamente eu quero saber?"></label>'
      + '<label class="fld" style="margin-top:8px">Escopo negativo — o que eu NÃO vou investigar<input type="text" maxlength="160" data-i="hypF" data-k="no" value="' + U.esc(f.no) + '" placeholder="sem isso, vira rolagem infinita com nome bonito"></label>'
      + '<label class="fld" style="margin-top:8px">Entregável mínimo honesto<input type="text" maxlength="120" data-i="hypF" data-k="dv" value="' + U.esc(f.dv) + '" placeholder="dossiê curto, verbete, coleção de 30 itens anotada…"></label>'
      + '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="hypStart">' + U.icon('scroll') + 'Abrir temporada</button></div>'
      + filaBox + histBox + '</section>';
  }

  var dias = U.daysBetween(t, on.fim), venceu = dias < 0, sem = on.sem || SYS.HYP_MAX;
  var total = Math.max(1, U.daysBetween(on.ini, on.fim)), passou = Math.min(total, Math.max(0, U.daysBetween(on.ini, t)));
  var kpis = '<div class="kpis" style="margin-top:12px"><div class="kpi"><b class="' + (venceu ? 'bad' : '') + '">' + (venceu ? Math.abs(dias) + ' dias' : dias + ' dias') + '</b><span>' + (venceu ? 'passou do prazo' : 'até encerrar') + '</span></div>'
    + '<div class="kpi"><b>' + (on.log || []).length + '</b><span>anotações</span></div>'
    + '<div class="kpi"><b>' + sem + '</b><span>semanas combinadas</span></div>'
    + '<div class="kpi"><b>' + (Z.done || []).length + '</b><span>encerradas antes</span></div></div>';

  var ficha = '<div class="callout" style="margin-top:12px;font-size:13.5px"><b>' + U.esc(on.t) + '</b><br>'
    + '<span class="dim">Pergunta:</span> ' + U.esc(on.q) + '<br>'
    + (on.no ? '<span class="dim">Fora do escopo:</span> ' + U.esc(on.no) + '<br>' : '')
    + '<span class="dim">Entregável:</span> ' + U.esc(on.dv) + '<br>'
    + '<span class="faint mono" style="font-size:11.5px">' + U.fmtDate(on.ini) + ' → ' + U.fmtDate(on.fim) + '</span></div>'
    + '<div class="stack" style="gap:4px;margin-top:8px">' + H.bar(U.pct(passou, total), 'thin', wc) + '</div>';

  var aviso = venceu ? '<div class="callout fail" style="margin-top:10px;font-size:13.5px"><b>Passou do prazo.</b> Duas saídas honrosas: encerrar agora com o relatório do que deu (mesmo que seja pouco), ou esticar uma vez até o teto de ' + SYS.HYP_MAX + ' semanas. Arrastar sem decidir é o que virou dívida a vida inteira.</div>' : '';

  var logs = (on.log || []).slice().reverse().slice(0, 10).map(function(l){
    return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:start"><span class="stack" style="gap:2px;min-width:0">'
      + '<span style="font-size:13.5px;font-weight:600">' + U.esc(l.a) + '</span>'
      + (l.o ? '<span class="faint" style="font-size:12px">fonte: ' + U.esc(l.o) + '</span>' : '<span class="faint" style="font-size:12px">sem procedência anotada</span>')
      + (l.p ? '<span class="dim" style="font-size:12.5px">↳ ' + U.esc(l.p) + '</span>' : '')
      + '<span class="faint mono" style="font-size:11px">' + U.fmtDate(l.d) + '</span></span>'
      + '<button class="btn sm ghost" data-a="hypLogDel" data-id="' + l.id + '">✕</button></div>'; }).join('')
    || '<p class="faint" style="font-size:13px">Nada anotado ainda. Três linhas por sessão bastam: o que achei, onde achei, que pergunta abriu.</p>';

  var logForm = '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Caderno de campo</span>'
    + '<div class="grid g2" style="gap:8px;margin-top:8px"><label class="fld">O que encontrei<input type="text" maxlength="140" data-i="hypF" data-k="achado" value="' + U.esc(f.achado) + '"></label>'
    + '<label class="fld">Onde (link, livro, pessoa, data)<input type="text" maxlength="140" data-i="hypF" data-k="onde" value="' + U.esc(f.onde) + '"></label></div>'
    + '<label class="fld" style="margin-top:8px">Que pergunta isso abriu (opcional)<input type="text" maxlength="160" data-i="hypF" data-k="perg" value="' + U.esc(f.perg) + '"></label>'
    + '<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn sm primary" data-a="hypLogAdd">' + U.icon('plus') + 'Anotar</button></div>'
    + '<div style="margin-top:10px">' + logs + '</div>';

  var fim = '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Encerramento honroso</span>'
    + '<p class="dim" style="font-size:13px;margin:4px 0 8px">Uma página respondendo a pergunta-guia. “Não deu” é resposta legítima e conta igual — o que não conta é sumir.</p>'
    + '<label class="fld">Relatório de encerramento<input type="text" maxlength="400" data-i="hypF" data-k="rel" value="' + U.esc(f.rel) + '" placeholder="o que eu descobri, o que ficou aberto, o que não vou mais investigar"></label>'
    + '<div class="row" style="gap:8px;justify-content:flex-end;margin-top:10px;flex-wrap:wrap">'
    + (venceu ? '<button class="btn sm ghost" data-a="hypExtend">' + U.icon('plus') + 'Esticar uma vez</button>' : '')
    + '<button class="btn sm" data-a="hypClose" data-ok="0">' + U.icon('flag') + 'Encerrar · não deu</button>'
    + '<button class="btn primary" data-a="hypClose" data-ok="1">' + U.icon('check') + 'Encerrar · entreguei</button></div>'
    + '<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn sm danger ghost" data-a="hypDrop">Descartar sem relatório (não conta)</button></div>';

  return head + ficha + kpis + aviso + logForm + fim + filaBox + histBox + '</section>';
};

/* ---------- entradas ---------- */
App.I.hypF = function(el){ App.hypF()[el.getAttribute('data-k')] = el.value; };

App.A.hypStart = function(){
  var Z = App.hyp(), f = App.hypF(), t = U.today();
  if (Z.on) return App.toast({t:'Já tem temporada aberta', s:'Um slot só. É o ponto inteiro da mecânica.', ic:'alert'});
  if (!(f.t || '').trim()) return App.toast({t:'Sem assunto', s:'Escreve o assunto. “Várias coisas” não é temporada.', ic:'alert'});
  if (!(f.q || '').trim()) return App.toast({t:'Sem pergunta-guia', s:'Sem pergunta, é rolagem infinita com nome bonito.', ic:'alert'});
  if (!(f.dv || '').trim()) return App.toast({t:'Sem entregável', s:'Uma coisa que exista fora da tua cabeça no fim. Pode ser pequena.', ic:'alert'});
  var sem = Math.max(SYS.HYP_MIN, Math.min(SYS.HYP_MAX, Math.round(+f.sem || 4)));
  Z.on = {id:U.uid(), t:f.t.trim(), q:f.q.trim(), no:(f.no || '').trim(), dv:f.dv.trim(), sem:sem, ini:t, fim:U.addDays(t, sem * 7), ext:0, log:[]};
  f.t = f.q = f.no = f.dv = ''; f.sem = 4;
  App.commit(['core']);
  App.toast({t:'Temporada aberta · ' + sem + ' semanas', s:'Encerra em ' + U.fmtDate(Z.on.fim) + '. Sem diária, sem sequência: só a data.', ic:'scroll'});
};

App.A.hypLogAdd = function(){
  var Z = App.hyp(), f = App.hypF();
  if (!Z.on) return;
  if (!(f.achado || '').trim()) return App.toast({t:'Nada anotado', s:'Escreve o que tu encontrou — o caderno serve para o teu eu de dezembro.', ic:'alert'});
  Z.on.log.push({id:U.uid(), d:U.today(), a:f.achado.trim(), o:(f.onde || '').trim(), p:(f.perg || '').trim()});
  f.achado = f.onde = f.perg = '';
  App.commit(['core']);
  if (!Z.on.log[Z.on.log.length - 1].o) App.toast({t:'Anotado sem procedência', s:'Sem de onde veio, daqui a um mês vira boato com carinho.', ic:'alert'});
};
App.A.hypLogDel = function(el){ var Z = App.hyp(), id = el.getAttribute('data-id'); if (!Z.on) return; Z.on.log = (Z.on.log || []).filter(function(l){ return l.id !== id; }); App.commit(['core']); };

App.A.hypExtend = function(){
  var Z = App.hyp(); if (!Z.on) return;
  if ((Z.on.ext || 0) >= 1) return App.toast({t:'Já esticou uma vez', s:'Prorrogar duas vezes é como um hiperfoco vira dívida. Encerra com o que deu.', ic:'alert'});
  var novoSem = Math.min(SYS.HYP_MAX, (Z.on.sem || 4) + 2);
  if (novoSem === Z.on.sem) return App.toast({t:'Teto atingido', s:'Já está no máximo de ' + SYS.HYP_MAX + ' semanas. Encerra honroso.', ic:'alert'});
  Z.on.ext = 1; Z.on.sem = novoSem; Z.on.fim = U.addDays(Z.on.ini, novoSem * 7);
  App.commit(['core']);
  App.toast({t:'Esticado até ' + U.fmtDate(Z.on.fim), s:'Uma vez só. Depois disso o encerramento é o próximo passo, com o que deu.', ic:'flag'});
};

App.A.hypClose = function(el){
  var Z = App.hyp(), f = App.hypF(), ok = el.getAttribute('data-ok') === '1';
  if (!Z.on) return;
  if ((f.rel || '').trim().length < 20) return App.toast({t:'Relatório curto demais', s:'Encerramento honroso pede pelo menos uma frase de verdade. Inclusive o “não deu”.', ic:'alert'});
  Z.done.push({id:Z.on.id, t:Z.on.t, q:Z.on.q, dv:Z.on.dv, ini:Z.on.ini, fim:U.today(), prazo:Z.on.fim, sem:Z.on.sem, log:(Z.on.log || []).length, rel:f.rel.trim(), ok:ok});
  if (Z.done.length > 60) Z.done = Z.done.slice(-60);
  Z.on = null; f.rel = '';
  App.ctrAddVal('hipTemp', 1);
  App.commit(['core']);
  App.toast({t:ok ? 'Temporada entregue' : 'Temporada encerrada honrosamente',
    s:ok ? 'Entregável no mundo. Slot livre — a fila pode subir.' : 'Fechou com relatório em vez de sumir. É isso que quebra o ciclo.', ic:'flag'});
};

App.A.hypDrop = function(){
  var Z = App.hyp(); if (!Z.on) return;
  if (!App.ui._hypDrop) { App.ui._hypDrop = 1; return App.toast({t:'Clica de novo para confirmar', s:'Descartar sem relatório não conta como encerramento e some com as anotações.', ic:'alert'}); }
  App.ui._hypDrop = 0; Z.on = null; App.commit(['core']);
  App.toast({t:'Temporada descartada', s:'Sem penalidade — mas também sem crédito. O relatório era o barato.', ic:'alert'});
};

App.A.hypFilaAdd = function(){
  var Z = App.hyp(), f = App.hypF();
  if (!(f.ideia || '').trim()) return;
  if (Z.fila.length >= 20) return App.toast({t:'Fila cheia', s:'Vinte ideias esperando já é recado. Encerra ou poda.', ic:'alert'});
  Z.fila.push({id:U.uid(), t:f.ideia.trim(), d:U.today()}); f.ideia = '';
  App.commit(['core']);
};
App.A.hypFilaDel = function(el){ var Z = App.hyp(), id = el.getAttribute('data-id'); Z.fila = Z.fila.filter(function(x){ return x.id !== id; }); App.commit(['core']); };
App.A.hypPromote = function(el){
  var Z = App.hyp(), f = App.hypF(), id = el.getAttribute('data-id');
  if (Z.on) return App.toast({t:'Slot ocupado', s:'Encerra a atual antes. Um por vez.', ic:'alert'});
  var it = Z.fila.filter(function(x){ return x.id === id; })[0]; if (!it) return;
  f.t = it.t; Z.fila = Z.fila.filter(function(x){ return x.id !== id; });
  App.commit(['core']);
  App.toast({t:'Assunto trazido da fila', s:'Agora escreve a pergunta-guia, o escopo negativo e o entregável.', ic:'scroll'});
};

/* ---------- encaixe nas telas existentes ---------- */
(function(){
  var oldWay = App.V.way;
  App.V.way = function(wid){
    var html = oldWay(wid);
    if (wid !== 'mind') return html;
    var sub = App.ui.sub, ativa = !!(App.S.hyp && App.S.hyp.on);
    /* painel completo na vertente de hiperfocos; na trilha principal só aparece se tiver temporada rodando */
    if (sub === 'hip' || (ativa && sub !== 'jog' && sub !== 'feitos' && sub !== 'autor')) html += App.hypPanel();
    return html;
  };
  var oldRules = App.V.regras;
  App.V.regras = function(){
    return oldRules() + '<section class="win"><div class="win-h">' + U.icon('scroll') + 'Hobby: Temporada de Hiperfoco, jogos e o que NÃO tem cobrança</div><ul class="list">'
      + ['Vertentes de hobby (Hiperfocos & Arquivos, Jogos & Sistemas) não geram diária, sequência nem meta semanal. Se hobby virar dever, ele morre — esse era o problema desde o começo.',
         'Temporada de Hiperfoco: um slot só, de ' + SYS.HYP_MIN + ' a ' + SYS.HYP_MAX + ' semanas, com pergunta-guia, escopo negativo, entregável e data. Ideia nova espera na fila; não abre segunda temporada.',
         'Encerramento honroso conta mesmo quando a resposta é “não deu”, desde que tenha relatório. Descartar sem relatório não gera penalidade e também não gera crédito.',
         'Prorrogação: uma vez, até o teto de ' + SYS.HYP_MAX + ' semanas. Prorrogar sem limite é exatamente como hiperfoco viraria dívida.',
         'Nos jogos, XP e conquistas vêm de melhora verificável — sessão com alvo escrito, replay revisado com erro nomeado, padrão fraco treinado, temporada fechada com relatório. Horas jogadas não contam nada.',
         'O boss da vertente de jogos é terminar uma temporada competitiva inteira com registro, não alcançar elo nenhum. Elo é resultado; processo é o que você controla.',
         'A loja de jogos segue ordem de causa: estação e ergonomia, depois medição de latência, só então periférico e tela. Hardware caro não substitui padrão treinado.'].map(function(x){ return '<li><span>' + U.esc(x) + '</span></li>'; }).join('')
      + '</ul></section>';
  };
  if (App.NEXTMS && SYS.MSADD) App.NEXTMS.push.apply(App.NEXTMS, SYS.MSADD);
})();
