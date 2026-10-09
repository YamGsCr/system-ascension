/* ===== v9 · A MESA, O TERMINAL e o gatilho "não antes de" ===== */
SYS.MESA_LOCK = 90;

App.mesa = function(){ var S = App.S; S.mesa = S.mesa || {cap:0, teto:0, ini:'', fim:'', lock:'', ops:[], cycles:0}; S.mesa.ops = S.mesa.ops || []; return S.mesa; };
App.term = function(){ var S = App.S; S.term = S.term || {m:{}, log:[]}; S.term.m = S.term.m || {}; S.term.log = S.term.log || []; return S.term; };
App.money2 = function(v){ return 'R$ ' + (+v || 0).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}); };
App.pctTxt = function(v, d){ return (v == null || isNaN(v)) ? '—' : (v >= 0 ? '+' : '') + (+v).toFixed(d == null ? 2 : d) + '%'; };

/* ---------- A MESA ---------- */
App.mesaPanel = function(){
  var S = App.S, D = App.D, m = App.mesa(), t = U.today(), f = App.ui.f.mesa || (App.ui.f.mesa = {cap:'', teto:'', fim:'', motivo:'', tam:'', res:'', regra:true, nota:''});
  var locked = !!(m.lock && m.lock > t), aberta = !!(m.cap > 0 && !locked);
  var head = '<section class="win" style="--wc:#ff5470"><div class="win-h" style="color:var(--bad)">' + U.icon('sword') + 'A Mesa · dinheiro que pode zerar'
    + '<span class="act" style="cursor:default">sem XP por lucro</span></div>'
    + '<p class="dim" style="font-size:13.5px">Expectativa negativa por construção: é diversão paga, não plano de enriquecimento. O Sistema só reconhece processo — registro, limite respeitado e ciclo encerrado no prazo. Se virar perseguir prejuízo, fecha.</p>';
  if (locked) {
    return head + '<div class="callout fail" style="margin-top:12px"><b>Mesa travada até ' + U.fmtDate(m.lock) + '.</b> O kill switch existe para proteger o resto do patrimônio de uma sequência ruim. Ciclos encerrados até agora: ' + (m.cycles || 0) + '.</div>'
      + '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn sm ghost" data-a="mesaWipe">Limpar registro do ciclo travado</button></div></section>';
  }
  if (!aberta) {
    return head + '<div class="grid g3" style="gap:8px;margin-top:12px"><label class="fld">Capital da mesa (R$)<input type="number" min="0" step="10" data-i="mesaF" data-k="cap" value="' + U.esc(f.cap) + '" placeholder="dinheiro que pode zerar"></label>'
      + '<label class="fld">Teto por operação (R$)<input type="number" min="0" step="5" data-i="mesaF" data-k="teto" value="' + U.esc(f.teto) + '"></label>'
      + '<label class="fld">Prazo do ciclo (data final)<input type="date" data-c="mesaFd" data-k="fim" value="' + U.esc(f.fim) + '"></label></div>'
      + '<div class="callout" style="margin-top:10px;font-size:13.5px">Regra do arco: capital segregado em conta separada, teto por operação, saída definida antes de entrar, e proibição de aportar mais para recuperar. Zerar o capital trava a mesa por ' + SYS.MESA_LOCK + ' dias.</div>'
      + '<div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" data-a="mesaStart">' + U.icon('sword') + 'Abrir ciclo da mesa</button></div></section>';
  }
  var net = D.mesaNet, pct = m.cap ? (net / m.cap) * 100 : 0, dias = U.daysBetween(t, m.fim || t);
  var kpis = '<div class="kpis" style="margin-top:12px"><div class="kpi"><b>' + App.money2(m.cap) + '</b><span>capital da mesa</span></div>'
    + '<div class="kpi"><b>' + App.money2(m.teto) + '</b><span>teto por operação</span></div>'
    + '<div class="kpi"><b class="' + (net >= 0 ? 'ok' : 'bad') + '">' + App.money2(net) + '</b><span>resultado ' + App.pctTxt(pct, 1) + '</span></div>'
    + '<div class="kpi"><b>' + D.mesaOps + '</b><span>operações</span></div>'
    + '<div class="kpi"><b class="' + (D.mesaBroke ? 'bad' : 'ok') + '">' + D.mesaBroke + '</b><span>quebras de regra</span></div>'
    + '<div class="kpi"><b>' + (dias >= 0 ? dias : 0) + '</b><span>dias até o prazo</span></div></div>';
  var form = '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Registrar operação</span>'
    + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;align-items:end;margin-top:8px">'
    + '<label class="fld">Motivo (antes de entrar)<input type="text" maxlength="120" data-i="mesaF" data-k="motivo" value="' + U.esc(f.motivo) + '" placeholder="por que eu entrei"></label>'
    + '<label class="fld">Tamanho (R$)<input type="number" step="1" data-i="mesaF" data-k="tam" value="' + U.esc(f.tam) + '"></label>'
    + '<label class="fld">Resultado (R$, pode ser negativo)<input type="number" step="0.01" data-i="mesaF" data-k="res" value="' + U.esc(f.res) + '"></label>'
    + '<label class="fld">Nota / emoção<input type="text" maxlength="90" data-i="mesaF" data-k="nota" value="' + U.esc(f.nota) + '" placeholder="calmo, ansioso, com pressa…"></label></div>'
    + '<div class="row between" style="margin-top:8px"><label class="check" style="padding:0"><input type="checkbox" data-c="mesaRegra"' + (f.regra ? ' checked' : '') + '><span>Segui as minhas regras nesta operação</span></label>'
    + '<button class="btn" data-a="mesaAdd">' + U.icon('plus') + 'Registrar</button></div>';
  var ops = (m.ops || []).slice(-8).reverse().map(function(o){
    return '<div class="notif"><span class="' + (o.regra === false ? 'bad' : 'dim') + '">' + U.icon(o.regra === false ? 'alert' : 'journal') + '</span>'
      + '<span style="min-width:0"><b>' + U.esc(o.motivo || 'sem motivo escrito') + '</b><br><span class="faint mono" style="font-size:11px">' + U.fmtDate(o.d) + ' · tamanho ' + App.money2(o.tam) + (o.nota ? ' · ' + U.esc(o.nota) : '') + (o.regra === false ? ' · QUEBRA DE REGRA' : '') + '</span></span>'
      + '<span class="row" style="gap:6px;flex-wrap:nowrap"><span class="mono ' + ((+o.res || 0) >= 0 ? 'ok' : 'bad') + '" style="font-size:12.5px">' + App.money2(o.res) + '</span><button class="iconbtn" data-a="mesaDel" data-id="' + o.id + '" aria-label="Apagar">' + U.icon('trash') + '</button></span></div>';
  }).join('');
  var noPrazo = m.fim && t >= m.fim;
  var foot = '<div class="hr" style="margin:14px 0"></div><div class="row between">'
    + '<span class="faint mono" style="font-size:11.5px">Ciclos encerrados no prazo: ' + (m.cycles || 0) + (m.fim ? ' · prazo combinado: ' + U.fmtDate(m.fim) : '') + '</span>'
    + '<span class="row" style="gap:6px">' + (noPrazo ? '<button class="btn primary" data-a="mesaClose">' + U.icon('check') + 'Encerrar ciclo no prazo</button>' : '<button class="btn sm ghost" data-a="mesaCloseEarly">Encerrar antes do prazo (não conta)</button>')
    + '<button class="btn sm danger" data-a="mesaLock">' + U.icon('shield') + 'Travar agora (' + SYS.MESA_LOCK + " dias)" + '</button></span></div>';
  return head + kpis + form + (ops ? '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Últimas operações</span><div class="stack" style="gap:0;margin-top:6px">' + ops + '</div>' : '') + foot + '</section>';
};
App.I.mesaF = function(el){ App.ui.f.mesa[el.getAttribute('data-k')] = el.value; };
App.C.mesaFd = function(el){ App.ui.f.mesa[el.getAttribute('data-k')] = el.value; };
App.C.mesaRegra = function(el){ App.ui.f.mesa.regra = el.checked; };
App.A.mesaStart = function(){
  var f = App.ui.f.mesa, m = App.mesa(), cap = +f.cap || 0, teto = +f.teto || 0;
  if (cap <= 0) return App.toast({t:'Falta o capital', s:'Defina o valor que pode zerar sem mudar nada na tua vida.', ic:'alert'});
  if (teto <= 0 || teto > cap) return App.toast({t:'Teto inválido', s:'O teto por operação precisa ser positivo e menor que o capital.', ic:'alert'});
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.fim || '') || f.fim <= U.today()) return App.toast({t:'Prazo inválido', s:'Escolha uma data final futura — prazo é metade da regra.', ic:'alert'});
  m.cap = cap; m.teto = teto; m.fim = f.fim; m.ini = U.today(); m.ops = []; m.lock = '';
  App.commit(['core']); App.toast({t:'Mesa aberta', s:'Capital segregado, teto definido e prazo marcado. Lucro não dá XP aqui.', ic:'sword', ms:5200});
};
App.A.mesaAdd = function(){
  var f = App.ui.f.mesa, m = App.mesa(), tam = +f.tam || 0, res = +f.res || 0;
  if (!(f.motivo || '').trim()) return App.toast({t:'Sem motivo escrito', s:'Operação sem motivo é aposta cega. Escreva por que entrou.', ic:'alert'});
  if (tam <= 0) return App.toast({t:'Tamanho inválido', s:'Informe quanto foi arriscado nesta operação.', ic:'alert'});
  var quebrou = f.regra === false || tam > (m.teto || 0);
  m.ops.push({id:U.uid(), d:U.today(), motivo:f.motivo.trim().slice(0,120), tam:tam, res:res, nota:(f.nota || '').slice(0,90), regra:!quebrou});
  if (m.ops.length > 300) m.ops = m.ops.slice(-300);
  App.ui.f.mesa.motivo = ''; App.ui.f.mesa.tam = ''; App.ui.f.mesa.res = ''; App.ui.f.mesa.nota = ''; App.ui.f.mesa.regra = true;
  var net = m.ops.reduce(function(s, o){ return s + (+o.res || 0); }, 0), zerou = net <= -m.cap;
  if (zerou) { m.lock = U.addDays(U.today(), SYS.MESA_LOCK); }
  App.commit(['core']);
  if (zerou) App.toast({t:'Capital da mesa zerado · mesa travada', s:'Kill switch acionado por ' + SYS.MESA_LOCK + ' dias. Isso não é castigo, é a regra funcionando.', ic:'shield', ms:7000});
  else if (quebrou) App.toast({t:'Quebra de regra registrada', s:tam > (m.teto || 0) ? 'Tamanho acima do teto combinado. Registrado como quebra.' : 'Honestidade anotada. O diário serve para isso.', ic:'alert', ms:5200});
  else App.toast({t:'Operação registrada', s:'Processo em dia. Resultado é resultado; XP vem do registro.', ic:'journal'});
};
App.A.mesaDel = function(el){ var m = App.mesa(), id = el.getAttribute('data-id'); m.ops = m.ops.filter(function(o){ return o.id !== id; }); App.commit(['core']); };
App.mesaArchive = function(onTime){
  var m = App.mesa(), D = App.D;
  m.hist = (m.hist || []).concat([{ini:m.ini, fim:m.fim, end:U.today(), cap:m.cap, net:D.mesaNet, ops:D.mesaOps, broke:D.mesaBroke, onTime:!!onTime}]).slice(-20);
  if (onTime) m.cycles = (m.cycles || 0) + 1;
  m.cap = 0; m.teto = 0; m.fim = ''; m.ini = ''; m.ops = [];
};
App.A.mesaClose = function(){ App.mesaArchive(true); App.commit(['core']); App.toast({t:'Ciclo encerrado no prazo', s:'Fechar na data combinada é o boss de verdade. Relatório na mão e mesa vazia.', ic:'check', ms:6000}); };
App.A.mesaCloseEarly = function(){ App.ui.modal = {type:'confirm', title:'Encerrar antes do prazo?', body:'Não conta como ciclo cumprido. Encerrar cedo por decisão consciente é ótimo; encerrar para “resetar e voltar maior” não é.', ok:'Encerrar', act:'mesaCloseEarlyDo'}; App.renderModal(); };
App.A.mesaCloseEarlyDo = function(){ App.mesaArchive(false); App.ui.modal = null; App.commit(['core']); App.toast({t:'Mesa encerrada', s:'Sem ciclo contado. Sem drama também.', ic:'moon'}); };
App.A.mesaLock = function(){ var m = App.mesa(); m.lock = U.addDays(U.today(), SYS.MESA_LOCK); App.commit(['core']); App.toast({t:'Mesa travada', s:'Travada por ' + SYS.MESA_LOCK + ' dias. Freio de mão é skill.', ic:'shield', ms:5600}); };
App.A.mesaWipe = function(){ var m = App.mesa(); App.mesaArchive(false); App.commit(['core']); };

/* ---------- O TERMINAL ---------- */
App.TERMF = [['selic','Selic (% a.a.)'],['cdi','CDI do mês (%)'],['ipca','IPCA do mês (%)'],['ipca12','IPCA 12 meses (%)'],['di1','DI 1 ano (% a.a.)'],['premio','Prêmio do IPCA+ (% real)'],['usd','Dólar (R$)'],['custo','Custo fixo mensal (R$)']];
App.termPrev = function(mk){ var p = mk.split('-').map(Number), d = new Date(p[0], p[1] - 2, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
App.termPanel = function(){
  var S = App.S, T = App.term(), inv = App.invPos(), cur = App.ctrMonth();
  var f = App.ui.f.term || (App.ui.f.term = {mes:cur, v:{}, acao:'', motivo:'', muda:''});
  if (!f.v || f.mes !== f._loaded) { f.v = Object.assign({}, T.m[f.mes] || {}); f._loaded = f.mes; }
  var meses = Object.keys(T.m).sort().reverse();
  var head = '<section class="win"><div class="win-h">' + U.icon('status') + 'Terminal · números do mês<span class="act" style="cursor:default">' + meses.length + ' meses registrados</span></div>'
    + '<p class="dim" style="font-size:13.5px">Fonte primária, não vitrine de corretora: Banco Central (SGS), Tesouro Transparente, dados abertos da CVM, IBGE e ANBIMA. Puxa, registra, calcula e decide — a tela não decide nada, a tua IPS decide.</p>'
    + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:12px">'
    + '<label class="fld">Mês<input type="month" data-c="termMes" value="' + U.esc(f.mes) + '" max="' + cur + '"></label>'
    + App.TERMF.map(function(x){ return '<label class="fld">' + U.esc(x[1]) + '<input type="number" step="0.01" data-i="termF" data-k="' + x[0] + '" value="' + U.esc(f.v[x[0]] == null ? '' : f.v[x[0]]) + '"></label>'; }).join('')
    + '</div><div class="row between" style="margin-top:10px"><span class="faint mono" style="font-size:11.5px">O patrimônio vem do fechamento da Carteira (Evolução do patrimônio).</span>'
    + '<button class="btn primary" data-a="termSave">' + U.icon('check') + (T.m[f.mes] ? 'Atualizar ' + f.mes : 'Registrar ' + f.mes) + '</button></div>';
  /* métricas derivadas */
  var mk = f.mes, ind = T.m[mk] || {}, prevK = App.termPrev(mk);
  var sc = (inv.snaps || []).filter(function(s){ return s.m === mk; })[0], sp = (inv.snaps || []).filter(function(s){ return s.m === prevK; })[0];
  var r = (sc && sp && sp.total > 0) ? ((sc.total - sp.total - (+sc.ap || 0)) / sp.total) * 100 : null;
  var real = (r != null && ind.ipca != null) ? (((1 + r / 100) / (1 + (+ind.ipca) / 100)) - 1) * 100 : null;
  var spread = (r != null && ind.cdi != null) ? r - (+ind.cdi) : null;
  var cob = (sc && ind.selic != null && +ind.custo > 0) ? ((sc.total * ((+ind.selic) / 100) / 12) / (+ind.custo)) * 100 : null;
  var met = '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Métricas derivadas de ' + U.esc(mk) + '</span><div class="kpis" style="margin-top:8px">'
    + '<div class="kpi"><b class="' + (r == null ? '' : r >= 0 ? 'ok' : 'bad') + '">' + App.pctTxt(r) + '</b><span>retorno do mês</span></div>'
    + '<div class="kpi"><b class="' + (real == null ? '' : real >= 0 ? 'ok' : 'bad') + '">' + App.pctTxt(real) + '</b><span>retorno real (acima do IPCA)</span></div>'
    + '<div class="kpi"><b class="' + (spread == null ? '' : spread >= 0 ? 'ok' : 'bad') + '">' + App.pctTxt(spread) + '</b><span>spread contra o CDI</span></div>'
    + '<div class="kpi"><b>' + (cob == null ? '—' : cob.toFixed(0) + '%') + '</b><span>do custo fixo pago por juro de caixa</span></div>'
    + '<div class="kpi"><b>' + (ind.premio == null ? '—' : (+ind.premio).toFixed(2) + '%') + '</b><span>prêmio do IPCA+</span></div>'
    + '<div class="kpi"><b>' + (ind.usd == null ? '—' : App.money2(ind.usd)) + '</b><span>dólar registrado</span></div></div>'
    + '<p class="faint" style="font-size:12px;margin-top:8px">Retorno do mês usa os fechamentos da Carteira: (patrimônio de hoje − patrimônio anterior − aporte) ÷ patrimônio anterior. Sem fechamento do mês anterior, ele aparece vazio.</p>';
  /* log de decisão */
  var lf = '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Log de decisão</span>'
    + '<div class="grid g3" style="gap:8px;margin-top:8px"><label class="fld">O que eu fiz<input type="text" maxlength="120" data-i="logF" data-k="acao" value="' + U.esc(f.acao) + '" placeholder="aportei em X, troquei Y por Z…"></label>'
    + '<label class="fld">Por quê<input type="text" maxlength="200" data-i="logF" data-k="motivo" value="' + U.esc(f.motivo) + '"></label>'
    + '<label class="fld">O que me faria mudar<input type="text" maxlength="200" data-i="logF" data-k="muda" value="' + U.esc(f.muda) + '"></label></div>'
    + '<div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn" data-a="logAdd">' + U.icon('plus') + 'Registrar decisão</button></div>';
  var log = (T.log || []).slice(-10).reverse().map(function(l){
    return '<div class="notif"><span class="dim">' + U.icon('journal') + '</span><span style="min-width:0"><b>' + U.esc(l.acao) + '</b><br><span class="dim" style="font-size:13px">' + U.esc(l.motivo || '') + (l.muda ? ' <span class="faint">· mudo se: ' + U.esc(l.muda) + '</span>' : '') + '</span></span>'
      + '<span class="row" style="gap:6px;flex-wrap:nowrap"><span class="faint mono" style="font-size:11px">' + U.fmtDate(l.d) + '</span><button class="iconbtn" data-a="logDel" data-id="' + l.id + '" aria-label="Apagar">' + U.icon('trash') + '</button></span></div>';
  }).join('');
  var tbl = meses.length ? '<div class="hr" style="margin:14px 0"></div><span class="eyebrow">Histórico</span><div class="tablewrap" style="margin-top:8px"><table class="tbl"><thead><tr><th>Mês</th>' + App.TERMF.map(function(x){ return '<th>' + U.esc(x[1].replace(/ \(.*\)/, '')) + '</th>'; }).join('') + '<th></th></tr></thead><tbody>'
    + meses.slice(0, 12).map(function(k){ var v = T.m[k]; return '<tr><td class="mono">' + k + '</td>' + App.TERMF.map(function(x){ return '<td class="mono">' + (v[x[0]] == null ? '—' : v[x[0]]) + '</td>'; }).join('') + '<td style="text-align:right"><button class="iconbtn" data-a="termDel" data-k="' + k + '" aria-label="Apagar mês">' + U.icon('trash') + '</button></td></tr>'; }).join('')
    + '</tbody></table></div>' : '';
  return head + met + lf + (log ? '<div class="stack" style="gap:0;margin-top:10px">' + log + '</div>' : '<div class="empty" style="margin-top:10px">Nenhuma decisão registrada ainda. A primeira é a mais difícil de escrever com honestidade.</div>') + tbl + '</section>';
};
App.C.termMes = function(el){ var f = App.ui.f.term; f.mes = el.value || App.ctrMonth(); f._loaded = null; App.renderView(); };
App.I.termF = function(el){ var f = App.ui.f.term; f.v[el.getAttribute('data-k')] = el.value === '' ? null : +el.value; };
App.I.logF = function(el){ App.ui.f.term[el.getAttribute('data-k')] = el.value; };
App.A.termSave = function(){
  var T = App.term(), f = App.ui.f.term, novo = !T.m[f.mes];
  var v = {}; App.TERMF.forEach(function(x){ if (f.v[x[0]] != null && f.v[x[0]] !== '') v[x[0]] = +f.v[x[0]]; });
  if (!Object.keys(v).length) return App.toast({t:'Nada para salvar', s:'Preencha pelo menos um número do mês.', ic:'alert'});
  T.m[f.mes] = v;
  var ks = Object.keys(T.m).sort(); if (ks.length > 60) delete T.m[ks[0]];
  if (novo) App.ctrAddVal('terminal', 1);
  App.commit(['core']);
  App.toast({t:novo ? 'Mês registrado no terminal' : 'Mês atualizado', s:novo ? 'Número de fonte primária vale mais que print de rede social.' : 'Correção salva.', ic:'status'});
};
App.A.termDel = function(el){ var T = App.term(), k = el.getAttribute('data-k'); if (T.m[k]) { delete T.m[k]; App.ctrAddVal('terminal', -1); App.commit(['core']); } };
App.A.logAdd = function(){
  var T = App.term(), f = App.ui.f.term;
  if (!(f.acao || '').trim()) return App.toast({t:'Sem decisão escrita', s:'Escreva o que tu fez — o log serve para o teu eu de 2028.', ic:'alert'});
  T.log.push({id:U.uid(), d:U.today(), acao:f.acao.trim().slice(0,120), motivo:(f.motivo || '').slice(0,200), muda:(f.muda || '').slice(0,200)});
  if (T.log.length > 400) T.log = T.log.slice(-400);
  f.acao = ''; f.motivo = ''; f.muda = '';
  App.ctrAddVal('decisoes', 1); App.commit(['core']);
  App.toast({t:'Decisão registrada', s:'Processo antes de resultado. É assim que se separa sorte de método.', ic:'journal'});
};
App.A.logDel = function(el){ var T = App.term(), id = el.getAttribute('data-id'); var n = T.log.length; T.log = T.log.filter(function(l){ return l.id !== id; }); if (T.log.length < n) App.ctrAddVal('decisoes', -1); App.commit(['core']); };

/* ---------- gatilho "não antes de" ---------- */
App.nbBox = function(n){ return n.nb ? '<div class="callout" style="border-color:var(--warn);background:rgba(242,193,78,.08)"><h4 style="margin-bottom:6px;color:var(--warn)">' + U.icon('clock') + ' Não antes de</h4>' + U.esc(n.nb) + '<div class="faint" style="font-size:12.5px;margin-top:6px">Aviso, não trava: se o gatilho ainda não chegou, estudar isso agora é hobby — e hobby é permitido, só não se engane sobre o retorno.</div></div>' : ''; };

/* ---------- costuras nas views ---------- */
(function(){
  var oldMission = App.nodeMission;
  App.nodeMission = function(n){ return App.nbBox(n) + oldMission(n); };
  var oldCart = App.V.carteira;
  App.V.carteira = function(){ return oldCart() + App.termPanel(); };
  var oldWay = App.V.way;
  App.V.way = function(wid){ var html = oldWay(wid); if (wid === 'navigation' && App.ui.sub === 'tes') html += App.mesaPanel(); return html; };
  var oldRules = App.V.regras;
  App.V.regras = function(){
    return oldRules() + '<section class="win"><div class="win-h">' + U.icon('gem') + 'Tesouraria, Mesa e Terminal</div><ul class="list">'
      + ['Gatilho “não antes de”: nó avançado avisa a partir de qual patrimônio, exposição ou objetivo profissional ele começa a pagar. É aviso, não trava.',
         'A Mesa é dinheiro que pode zerar, em conta separada, com teto por operação e prazo. Operação acima do teto entra como quebra de regra — e o Sistema registra, não julga.',
         'Zerar o capital da Mesa aciona o kill switch: ' + SYS.MESA_LOCK + ' dias travada. Lucro na Mesa não dá XP: XP vem de registro, limite respeitado e ciclo encerrado no prazo.',
         'O Terminal fica na Carteira: números de fonte primária, métricas derivadas calculadas por ti e log de decisão. Cada mês registrado alimenta o contador do terminal; cada decisão registrada alimenta o contador de decisões.',
         'A tela nunca decide aporte. Quem decide é a política (IPS) — a tela só mostra distância do alvo, prêmio atual e o que tu escreveu na última vez.'].map(function(x){ return '<li><span>' + U.esc(x) + '</span></li>'; }).join('')
      + '</ul></section>';
  };
  if (App.NEXTMS) App.NEXTMS.push(['Meses de terminal', 'termMonths', [1,6,12,24], 'status'], ['Decisões registradas', 'decisoesLog', [1,12,50], 'journal'], ['Ciclos da Mesa encerrados', 'mesaCycles', [1,3], 'sword']);
})();
