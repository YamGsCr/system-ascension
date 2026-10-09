/* ===== VIEW: Carteira — investimentos centralizados (valores manuais) ===== */
App.INVCLS = [
 {id:'caixa', n:'Caixa / conta remunerada', g:'cx'},
 {id:'reserva', n:'Reserva (Selic / CDB de liquidez diária)', g:'cx'},
 {id:'cdb', n:'CDB', g:'rf'},
 {id:'lci', n:'LCI', g:'rf'},
 {id:'lca', n:'LCA', g:'rf'},
 {id:'tesouro', n:'Tesouro Direto', g:'rf'},
 {id:'credito', n:'CRI / CRA / Debênture', g:'rf'},
 {id:'fundorf', n:'Fundo de renda fixa', g:'rf'},
 {id:'acao', n:'Ação', g:'rv'},
 {id:'fii', n:'FII', g:'rv'},
 {id:'etf', n:'ETF', g:'rv'},
 {id:'bdr', n:'BDR / exterior', g:'rv'},
 {id:'cripto', n:'Cripto', g:'alt'},
 {id:'outro', n:'Outro', g:'alt'}
];
App.INVG = {cx:{n:'Caixa & reserva', c:'#3ee6a8'}, rf:{n:'Renda fixa', c:'#4fb3ff'}, rv:{n:'Renda variável', c:'#ff7a59'}, alt:{n:'Alternativos', c:'#b77bff'}};
App.INVGORD = ['cx','rf','rv','alt'];
App.invCls = function(id){ return App.INVCLS.filter(function(c){ return c.id === id; })[0] || App.INVCLS[0]; };
App.money = function(v){ v = +v || 0; return 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}); };
App.invPos = function(){ var S = App.S; S.inv = S.inv || {pos:[], snaps:[], alloc:{cx:10, rf:40, rv:45, alt:5}, cost:0}; S.inv.pos = S.inv.pos || []; S.inv.snaps = S.inv.snaps || []; return S.inv; };
App.invVal = function(p){ return p.v != null && p.v !== '' ? +p.v : +p.v0 || 0; };
App.invTotals = function(){
  var inv = App.invPos(), g = {cx:0, rf:0, rv:0, alt:0}, tot = 0, ap = 0, res = 0;
  inv.pos.forEach(function(p){ var v = App.invVal(p); tot += v; ap += +p.v0 || 0; g[App.invCls(p.cls).g] += v; if (p.res) res += v; });
  return {g:g, tot:tot, ap:ap, res:res, pl:tot - ap, plp:ap > 0 ? ((tot - ap) / ap) * 100 : 0};
};
App.invChart = function(snaps){
  var list = snaps.slice(-12); if (!list.length) return '<div class="empty">Sem fechamentos ainda. Registre o primeiro no fim do mês.</div>';
  var W = 360, Hh = 130, top = 18, bot = 22, n = Math.max(list.length, 4), gap = W / n, bw = Math.min(20, gap * .55);
  var max = Math.max.apply(null, list.map(function(s){ return s.total || 0; }).concat([1]));
  var bars = list.map(function(s, i){
    var v = s.total || 0, x = gap * i + (gap - bw) / 2, h = v ? Math.max(3, (Hh - top - bot) * v / max) : 0, y = Hh - bot - h, r = Math.min(4, h, bw / 2);
    var mk = h ? '<path d="M'+x.toFixed(1)+' '+(Hh-bot)+' V'+(y+r).toFixed(1)+' Q'+x.toFixed(1)+' '+y.toFixed(1)+' '+(x+r).toFixed(1)+' '+y.toFixed(1)+' H'+(x+bw-r).toFixed(1)+' Q'+(x+bw).toFixed(1)+' '+y.toFixed(1)+' '+(x+bw).toFixed(1)+' '+(y+r).toFixed(1)+' V'+(Hh-bot)+' Z" fill="var(--glow)" opacity=".85"><title>'+U.esc(s.m)+' · '+App.money(v)+'</title></path>' : '';
    var lbl = i === list.length - 1 && v ? '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(y-5).toFixed(1)+'" text-anchor="middle" class="cc-v">'+U.num(v/1000)+'k</text>' : '';
    return mk + lbl + '<text x="'+(x+bw/2).toFixed(1)+'" y="'+(Hh-6)+'" text-anchor="middle" class="cc-m">'+U.esc((s.m || '').slice(5))+'</text>';
  }).join('');
  return '<svg class="colchart" viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Evolução do patrimônio"><line x1="0" y1="'+(Hh-bot)+'" x2="'+W+'" y2="'+(Hh-bot)+'" stroke="var(--line)"/>'+bars+'</svg>';
};
App.V.carteira = function(){
  var S = App.S, inv = App.invPos(), T = App.invTotals(), f = App.ui.f.inv || (App.ui.f.inv = {cls:'cdb', n:'', v0:'', v:'', tax:'', venc:'', corr:'', res:0});
  var out = H.head('Patrimônio', 'Carteira', 'Tudo em um lugar só: renda fixa, LCI/LCA, Tesouro, ações, FIIs, ETFs, cripto e caixa. Os valores são seus, digitados por você — a página funciona offline e não busca cotação sozinha.');
  out += '<section class="win"><div class="kpis">'
    + '<div class="kpi"><b class="glow">'+App.money(T.tot)+'</b><span>patrimônio</span></div>'
    + '<div class="kpi"><b>'+App.money(T.ap)+'</b><span>aportado</span></div>'
    + '<div class="kpi"><b class="'+(T.pl >= 0 ? 'ok' : 'bad')+'">'+(T.pl >= 0 ? '+' : '')+App.money(T.pl)+'</b><span>resultado ('+(T.plp >= 0 ? '+' : '')+T.plp.toFixed(1)+'%)</span></div>'
    + '<div class="kpi"><b>'+App.money(T.res)+'</b><span>reserva'+(inv.cost > 0 ? ' · '+(T.res / inv.cost).toFixed(1)+' meses' : '')+'</span></div>'
    + '</div><p class="faint" style="font-size:12.5px;margin-top:10px">Conteúdo educacional, não é recomendação de investimento. Preço de ação, FII e cripto muda todo dia: atualize quando quiser (uma vez por mês já resolve) e decida com a sua política, não com a tela.</p></section>';

  /* alocação real x alvo */
  var alvo = inv.alloc || {}, aloc = App.INVGORD.map(function(k){
    var G = App.INVG[k], v = T.g[k] || 0, pr = T.tot > 0 ? (v / T.tot) * 100 : 0, pa = +alvo[k] || 0, dif = pr - pa;
    return '<div class="stack" style="gap:4px"><div class="row between"><span class="chip" style="color:'+G.c+';border-color:'+U.hexA(G.c,.45)+'">'+U.esc(G.n)+'</span><span class="mono" style="font-size:12px">'+App.money(v)+' · <b>'+pr.toFixed(0)+'%</b> <span class="faint">alvo '+pa+'%</span></span></div>'
      + H.bar(pr, 'wc', G.c)
      + '<span class="faint mono" style="font-size:11px">'+(Math.abs(dif) < 3 ? 'na faixa' : (dif > 0 ? 'acima do alvo em ' + dif.toFixed(0) + ' p.p. — o próximo aporte vai para outra classe' : 'abaixo do alvo em ' + Math.abs(dif).toFixed(0) + ' p.p. — candidato ao próximo aporte'))+'</span></div>';
  }).join('');
  var alvoForm = App.INVGORD.map(function(k){ return '<label class="fld">'+U.esc(App.INVG[k].n)+' (%)<input type="number" min="0" max="100" step="1" data-c="invAlloc" data-k="'+k+'" value="'+(+alvo[k] || 0)+'"></label>'; }).join('');
  var somaAlvo = App.INVGORD.reduce(function(a, k){ return a + (+alvo[k] || 0); }, 0);
  var cardAloc = '<section class="win"><div class="win-h">'+U.icon('target')+'Alocação · real x alvo</div><div class="stack" style="gap:12px">'+aloc+'</div>'
    + '<div class="hr" style="margin:14px 0"></div><div class="grid g2" style="gap:8px">'+alvoForm+'</div>'
    + '<div class="row between" style="margin-top:8px"><span class="faint mono" style="font-size:11px">soma dos alvos: '+somaAlvo+'%'+(somaAlvo !== 100 ? ' (o ideal é 100)' : '')+'</span><label class="fld" style="max-width:220px">Custo mensal de vida (para a reserva)<input type="number" min="0" step="50" data-c="invCost" value="'+(+inv.cost || 0)+'"></label></div></section>';

  /* vencimentos */
  var venc = inv.pos.filter(function(p){ return p.venc; }).sort(function(a, b){ return a.venc < b.venc ? -1 : 1; }).slice(0, 5);
  var cardVenc = '<section class="win"><div class="win-h">'+U.icon('clock')+'Próximos vencimentos</div>'
    + (venc.length ? venc.map(function(p){ return '<div class="notif"><span>'+U.icon('seal')+'</span><span>'+U.esc(p.n)+' <span class="faint mono" style="font-size:11px">'+U.esc(App.invCls(p.cls).n)+'</span></span><span class="mono" style="font-size:12px">'+U.fmtDate(p.venc)+'</span></div>'; }).join('') : '<div class="empty">Nenhum vencimento cadastrado.</div>')+'</section>';

  /* evolução */
  var last = inv.snaps[inv.snaps.length - 1], mes = App.ctrMonth();
  var cardEvo = '<section class="win"><div class="win-h">'+U.icon('status')+'Evolução do patrimônio</div>'+App.invChart(inv.snaps)
    + '<div class="row between" style="margin-top:10px;gap:8px"><label class="fld" style="max-width:200px">Aporte do mês<input type="number" min="0" step="50" data-i="invAp" value="'+(App.ui.f.invAp != null ? App.ui.f.invAp : '')+'" placeholder="quanto entrou"></label>'
    + '<button class="btn primary" data-a="invSnap">'+U.icon('check')+(last && last.m === mes ? 'Atualizar fechamento de ' + mes : 'Fechar ' + mes)+'</button></div>'
    + '<p class="faint" style="font-size:12px;margin-top:6px">Fechar o mês salva uma foto do patrimônio, soma no contador de meses com aporte e rende +10 XP no Caminho do Navegador.</p></section>';

  /* posições agrupadas */
  var grupos = App.INVGORD.map(function(k){
    var list = inv.pos.filter(function(p){ return App.invCls(p.cls).g === k; });
    if (!list.length) return '';
    var G = App.INVG[k], sub = list.reduce(function(a, p){ return a + App.invVal(p); }, 0);
    var rows = list.map(function(p){
      var v = App.invVal(p), v0 = +p.v0 || 0, pl = v - v0;
      return '<tr><td><b>'+U.esc(p.n || '—')+'</b>'+(p.res ? ' <span class="chip ok" style="font-size:9.5px">reserva</span>' : '')+'<br><span class="faint mono" style="font-size:11px">'+U.esc(App.invCls(p.cls).n)+(p.tax ? ' · '+U.esc(p.tax) : '')+(p.corr ? ' · '+U.esc(p.corr) : '')+(p.venc ? ' · vence '+U.fmtDate(p.venc) : '')+'</span></td>'
        + '<td class="mono" style="white-space:nowrap">'+App.money(v0)+'</td>'
        + '<td><input type="number" step="0.01" min="0" class="invv" data-i="invV" data-id="'+p.id+'" value="'+(p.v != null ? p.v : '')+'" placeholder="'+(v0 || 0)+'" aria-label="Valor atual de '+U.esc(p.n)+'"></td>'
        + '<td class="mono '+(pl >= 0 ? 'ok' : 'bad')+'" style="white-space:nowrap">'+(pl >= 0 ? '+' : '')+App.money(pl)+'</td>'
        + '<td style="text-align:right;white-space:nowrap"><button class="btn sm ghost" data-a="invRes" data-id="'+p.id+'" title="Marcar como reserva de emergência">'+U.icon('shield')+'</button><button class="btn sm ghost" data-a="invDel" data-id="'+p.id+'" title="Remover">'+U.icon('trash')+'</button></td></tr>';
    }).join('');
    return '<section class="win"><div class="win-h" style="color:'+G.c+'">'+U.icon('bag')+U.esc(G.n)+' · '+App.money(sub)+'</div><div class="tablewrap"><table class="tbl invtbl"><thead><tr><th>Posição</th><th>Aplicado</th><th>Valor hoje</th><th>Resultado</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></section>';
  }).join('');

  var clsSel = '<select data-c="invF" data-k="cls">'+App.INVCLS.map(function(c){ return '<option value="'+c.id+'"'+(f.cls === c.id ? ' selected' : '')+'>'+U.esc(c.n)+'</option>'; }).join('')+'</select>';
  var form = '<section class="win"><div class="win-h">'+U.icon('plus')+'Nova posição</div>'
    + '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;align-items:end">'
    + '<label class="fld">Tipo'+clsSel+'</label>'
    + '<label class="fld">Nome / ticker<input type="text" data-i="invF" data-k="n" maxlength="60" value="'+U.esc(f.n)+'" placeholder="Ex.: LCI Banco X · PETR4 · Tesouro Selic 2029"></label>'
    + '<label class="fld">Valor aplicado (R$)<input type="number" min="0" step="0.01" data-i="invF" data-k="v0" value="'+U.esc(f.v0)+'"></label>'
    + '<label class="fld">Valor hoje (R$)<input type="number" min="0" step="0.01" data-i="invF" data-k="v" value="'+U.esc(f.v)+'" placeholder="igual ao aplicado se vazio"></label>'
    + '<label class="fld">Taxa / índice<input type="text" data-i="invF" data-k="tax" maxlength="30" value="'+U.esc(f.tax)+'" placeholder="98% CDI · IPCA+6% · —"></label>'
    + '<label class="fld">Vencimento<input type="date" data-i="invF" data-k="venc" value="'+U.esc(f.venc)+'"></label>'
    + '<label class="fld">Corretora / banco<input type="text" data-i="invF" data-k="corr" maxlength="30" value="'+U.esc(f.corr)+'"></label>'
    + '</div>'
    + '<div class="row between" style="margin-top:10px"><label class="check"><input type="checkbox" data-c="invF" data-k="res"'+(f.res ? ' checked' : '')+'><span>Faz parte da reserva de emergência</span></label>'
    + '<button class="btn primary" data-a="invAdd">'+U.icon('plus')+'Adicionar</button></div></section>';

  out += '<div class="grid" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:start" id="invgrid"><div class="stack" style="gap:16px">'+form+(grupos || '<div class="empty">Nenhuma posição cadastrada ainda. Comece pela reserva de emergência.</div>')+'</div>'
    + '<div class="stack" style="gap:16px">'+cardAloc+cardEvo+cardVenc+'</div></div>';
  return out;
};

App.I.invF = function(el){ var f = App.ui.f.inv, k = el.getAttribute('data-k'); f[k] = el.value; };
App.C.invF = function(el){ var f = App.ui.f.inv, k = el.getAttribute('data-k'); f[k] = el.type === 'checkbox' ? (el.checked ? 1 : 0) : el.value; if (k === 'cls') App.renderView(); };
App.A.invAdd = function(){
  var f = App.ui.f.inv, inv = App.invPos();
  if (!f.n || !String(f.n).trim()) return App.toast({t:'Falta o nome', s:'Escreva o nome ou o ticker da posição.', ic:'alert'});
  var v0 = +f.v0 || 0; if (v0 <= 0) return App.toast({t:'Falta o valor', s:'Informe quanto você aplicou nessa posição.', ic:'alert'});
  inv.pos.push({id:U.uid(), cls:f.cls, n:String(f.n).trim().slice(0, 60), v0:v0, v:(f.v === '' || f.v == null ? v0 : +f.v), tax:String(f.tax || '').slice(0, 30), venc:f.venc || '', corr:String(f.corr || '').slice(0, 30), res:f.res ? 1 : 0, d:U.today()});
  App.ui.f.inv = {cls:f.cls, n:'', v0:'', v:'', tax:'', venc:'', corr:'', res:0};
  App.commit(['core']);
  App.toast({t:'Posição registrada', s:'A carteira agora soma '+App.money(App.invTotals().tot)+'.', ic:'helm'});
};
App.I.invV = function(el){
  var inv = App.invPos(), id = el.getAttribute('data-id'), p = inv.pos.filter(function(x){ return x.id === id; })[0]; if (!p) return;
  p.v = el.value === '' ? null : +el.value; inv.upd = U.today();
  clearTimeout(App._invT); App._invT = setTimeout(function(){ App.commit(['core'], {quiet:true}); }, 700);
};
App.A.invRes = function(el){
  var inv = App.invPos(), id = el.getAttribute('data-id'), p = inv.pos.filter(function(x){ return x.id === id; })[0]; if (!p) return;
  p.res = p.res ? 0 : 1; App.commit(['core']);
};
App.A.invDel = function(el){
  var inv = App.invPos(), id = el.getAttribute('data-id');
  inv.pos = inv.pos.filter(function(x){ return x.id !== id; }); App.commit(['core']);
};
App.C.invAlloc = function(el){ var inv = App.invPos(), k = el.getAttribute('data-k'); inv.alloc = inv.alloc || {}; inv.alloc[k] = Math.max(0, Math.min(100, +el.value || 0)); App.commit(['core']); };
App.C.invCost = function(el){ var inv = App.invPos(); inv.cost = Math.max(0, +el.value || 0); App.commit(['core']); };
App.I.invAp = function(el){ App.ui.f.invAp = el.value; };
App.A.invSnap = function(){
  var inv = App.invPos(), T = App.invTotals(), m = App.ctrMonth(), ap = +App.ui.f.invAp || 0;
  var cur = inv.snaps.filter(function(s){ return s.m === m; })[0];
  var novo = !cur;
  if (cur) { cur.total = T.tot; cur.ap = ap || cur.ap; cur.d = U.today(); }
  else { inv.snaps.push({m:m, total:T.tot, ap:ap, d:U.today()}); if (inv.snaps.length > 60) inv.snaps.shift(); }
  inv.upd = U.today();
  if (novo) {
    App.ctrAddVal('invest_months', 1);
    App.S.sideq.push({id:U.uid(), t:'Fechamento da carteira · '+m, way:'navigation', xp:10, d:U.today(), done:U.today()});
  }
  App.ui.f.invAp = '';
  App.commit(['core']);
  App.toast({t:novo ? 'Mês fechado' : 'Fechamento atualizado', s:App.money(T.tot)+' registrados em '+m+(ap ? ' · aporte de '+App.money(ap) : '')+'.', ic:'helm'});
};
