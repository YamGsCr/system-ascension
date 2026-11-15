/* ===== v21 · SGM-Opus: aba com os 16 projetos, eras, Shadow Levels e a lista de compras =====
   Regras (aba Handoff do doc):
   · o marco de era concluído vira XP no Way do projeto (a soma acontece em 87_v21_ganchos.js);
   · ritual de fechamento: era concluída, um dia de comemoração antes de abrir a próxima;
   · projeto novo só entra quando outro fecha uma era (o primeiro é livre);
   · Shadow Levels são opcionais e aparecem como ramificação do projeto, com custo e o que ensinam;
   · compras: o item só libera quando o marco da linha estiver cumprido; o XP vem da entrega, não da compra;
     preço reconfirmado no dia (se subiu mais de 15%, comparar com a alternativa); importados sem impostos no valor;
     compra compartilhada conta uma vez.
   Estado no core: S.opus = {p:{id:{ini, era, done:{n:data}, marco:{n:texto}, ev:{n:texto}, sh:{nome:data}}},
   inic:{id:{n:data}}, starts:[{p, d}], buys:{n:{st, d, preco, cond}}}. */
(function(){
  var O = SYS.OPUS;
  var oldNew = E.newState;
  E.newState = function(){ var s = oldNew.apply(this, arguments); s.opus = {p:{}, inic:{}, starts:[], buys:{}}; return s; };
  App.opus = function(){ var S = App.S, o = S.opus || (S.opus = {p:{}, inic:{}, starts:[], buys:{}}); o.p = o.p || {}; o.inic = o.inic || {}; o.starts = o.starts || []; o.buys = o.buys || {}; return o; };
  App.opusP = function(id){ var o = App.opus(); var r = o.p[id] || (o.p[id] = {ini:null, era:1, done:{}, marco:{}, ev:{}, sh:{}}); r.done = r.done || {}; r.marco = r.marco || {}; r.ev = r.ev || {}; r.sh = r.sh || {}; return r; };

  /* ---------- engine ---------- */
  E.opusFechadas = function(o){ var n = 0; Object.keys((o && o.p) || {}).forEach(function(id){ n += Object.keys(o.p[id].done || {}).length; }); return n; };
  /* fichas para abrir projeto: a primeira é livre; cada era fechada dá uma */
  E.opusFichas = function(o){ return 1 + E.opusFechadas(o) - ((o && o.starts) || []).length; };
  E.opusEraDone = function(S, pid, n){ var o = S.opus, r = o && o.p && o.p[pid]; return !!(r && r.done && r.done[n]); };
  E.opusMarco = function(o, P, n){ var e = P.eras[n - 1], r = o.p[P.id]; return (e && e.marco) || (r && r.marco && r.marco[n]) || ''; };
  E.opusFesta = function(r){ var n = r.era, d = r.done && r.done[n]; return !!(d && d >= U.today()); };
  /* XP de cada fonte do SGM-Opus: [{way, br, xp}] */
  E.opusXP = function(S){
    var o = S.opus, out = []; if (!o) return out;
    function dar(P, xp, motivo){ var ws = P.ways, parte = Math.round(xp / ws.length); ws.forEach(function(w, i){ out.push({way:w, br:i === 0 ? P.br || null : null, xp:parte, m:motivo}); }); }
    Object.keys(o.p || {}).forEach(function(pid){
      var P = O.MAP[pid], r = o.p[pid]; if (!P || !r) return;
      Object.keys(r.done || {}).forEach(function(n){ dar(P, O.XP_ERA(+n), 'era'); });
      Object.keys(r.sh || {}).forEach(function(){ dar(P, O.XP_SHADOW, 'shadow'); });
    });
    var inc = O.MAP.inceptum;
    Object.keys(o.inic || {}).forEach(function(iid){ Object.keys(o.inic[iid] || {}).forEach(function(){ dar(inc, O.XP_ETAPA, 'etapa'); }); });
    return out;
  };
  /* compra: bloqueado / liberado / comprado */
  E.compraEstado = function(S, c){
    var o = S.opus || {}, b = (o.buys || {})[c.n] || {};
    if (b.st === 'comprado') return 'comprado';
    var a = c.auto, ok = false;
    if (a && a.livre) ok = true;
    else if (a && a.era) ok = E.opusEraDone(S, a.era[0], a.era[1]);
    else if (a && a.rotina) ok = !!(E.rotSeguidos && E.rotSeguidos(S, a.rotina[0]) >= a.rotina[1]);
    else if (a && a.faixas) ok = Object.keys((S.vit && S.vit.faixa) || {}).length >= a.faixas || E.ctrTotal(S, 'tracks') >= a.faixas;
    if (!ok && b.cond) ok = true;
    return ok ? 'liberado' : 'bloqueado';
  };

  /* loja: req 'op_<n>' = a linha n da lista de compras precisa estar liberada (ou já comprada) */
  var oldReqMet = E.reqMet, oldReqLabel = E.reqLabel;
  E.reqMet = function(S, D, req){
    if (String(req).slice(0, 3) === 'op_') { var c = O.COMPRAS.filter(function(x){ return x.n === +req.slice(3); })[0]; return !!c && E.compraEstado(S, c) !== 'bloqueado'; }
    return oldReqMet.apply(this, arguments);
  };
  E.reqLabel = function(req){
    if (String(req).slice(0, 3) === 'op_') { var c = O.COMPRAS.filter(function(x){ return x.n === +req.slice(3); })[0]; return c ? 'SGM-Opus · compra ' + c.n + ' liberada: ' + c.cond : req; }
    return oldReqLabel.apply(this, arguments);
  };

  /* ---------- rota e navegação ---------- */
  var at = -1; App.NAV.forEach(function(n, k){ if (n && n[0] === 'caminhos') at = k; });
  App.NAV.splice(at >= 0 ? at + 1 : 3, 0, ['opus', 'SGM-Opus', 'layers']);
  App.ROUTES = App.NAV.filter(Boolean).map(function(n){ return n[0]; });

  App.V.opus = function(){
    var tab = App.ui.param === 'compras' || App.ui.param === 'regras' ? App.ui.param : 'projetos', o = App.opus(), S = App.S;
    var ativos = O.P.filter(function(P){ return o.p[P.id] && o.p[P.id].ini; }).length, fichas = E.opusFichas(o);
    var head = H.head('SGM-Opus · Shadow Garden Magnum Opus', 'Dezesseis projetos, eras e Shadow Levels.', 'Cada marco de era concluído vira XP no Way do projeto. Projeto novo só entra quando outro fecha uma era; era fechada ganha um dia de comemoração antes da próxima.');
    var tabs = H.tabs('opus', [['projetos','Projetos','layers', ativos + '/' + O.P.length],['compras','Compras','bag', O.COMPRAS.filter(function(c){ return E.compraEstado(S, c) === 'liberado'; }).length + ' liberados'],['regras','Regras','shield']], tab);
    var body = tab === 'compras' ? App.opusCompras() : tab === 'regras' ? App.opusRegras() : App.opusProjetos(fichas);
    return head + tabs + body;
  };

  App.opusProjetos = function(fichas){
    var o = App.opus(), S = App.S;
    var topo = '<section class="win"><div class="row between"><span class="dim" style="font-size:14px">'+E.opusFechadas(o)+' era(s) fechada(s) · '+(fichas > 0 ? '<b>pode abrir '+fichas+' projeto'+(fichas > 1 ? 's' : '')+'</b>' : 'feche uma era para abrir um projeto novo')+'</span><span class="faint mono" style="font-size:12px">XP por era: 50 · 75 · 100 · 125 · 150 · 175 · Shadow Level: 60</span></div></section>';
    return topo + O.FAMILIAS.map(function(fam){
      var ps = O.P.filter(function(P){ return P.fam === fam; }); if (!ps.length) return '';
      return '<div class="brsep"><span>'+U.icon('layers')+U.esc(fam)+'</span></div><div class="stack" style="gap:12px">'+ps.map(function(P){ return App.opusCard(P, fichas); }).join('')+'</div>';
    }).join('');
  };
  App.opusCard = function(P, fichas){
    var o = App.opus(), r = o.p[P.id] || {era:1, done:{}, sh:{}}, ativo = !!r.ini, w = SYS.WAYMAP[P.ways[0]];
    var chips = P.ways.map(function(id){ return H.wayChip(id); }).join('') + (P.br ? '<span class="chip">'+U.esc((SYS.WAYMAP[P.ways[0]].brmap[P.br] || {}).n || P.br)+'</span>' : '');
    var dots = (P.eras || []).map(function(e){ var d = r.done && r.done[e.n]; return '<span class="chip '+(d ? 'ok' : (ativo && r.era === e.n ? 'glow' : ''))+'" title="'+U.esc(e.nome)+'">'+String(e.n).padStart(2, '0')+' '+U.esc(e.nome)+'</span>'; }).join('');
    var acao = ativo ? '<span class="chip ok">ativo desde '+U.fmtDate(r.ini)+'</span>' : '<button class="btn sm'+(fichas > 0 ? ' primary' : '')+'" data-a="opusAbrir" data-id="'+P.id+'"'+(fichas > 0 ? '' : ' disabled')+'>'+U.icon('plus')+'Abrir projeto</button>';
    var corpo = P.id === 'inceptum' ? App.opusInceptum(P, ativo) : App.opusEras(P, r, ativo);
    var sh = (P.shadow || []).length ? '<details class="opus-sh"><summary class="dim" style="cursor:pointer;font-size:13.5px">'+U.icon('moon')+'Shadow Levels opcionais · '+Object.keys(r.sh || {}).length+'/'+P.shadow.length+'</summary><div class="stack" style="gap:6px;margin-top:8px">'
      + P.shadow.map(function(s){ var d = r.sh && r.sh[s.nome]; return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto"><span><b>'+U.esc(s.nome)+'</b> · '+U.esc(s.premium)+'<br><span class="faint" style="font-size:12.5px">ensina: '+U.esc(s.ensina)+' · custo '+U.esc(s.custo)+'</span></span>'+(d ? '<button class="btn sm ghost" data-a="opusSh" data-id="'+P.id+'" data-k="'+U.esc(s.nome)+'">'+U.icon('check')+U.fmtDate(d)+'</button>' : '<button class="btn sm" data-a="opusSh" data-id="'+P.id+'" data-k="'+U.esc(s.nome)+'"'+(ativo ? '' : ' disabled')+'>Feito</button>')+'</div>'; }).join('')
      + '</div></details>' : '';
    return '<section class="win opus" style="--wc:'+w.color+'"><div class="row between" style="align-items:flex-start;gap:10px"><div class="stack" style="gap:6px;min-width:0"><h3 style="margin:0">'+U.esc(P.n)+'</h3><div class="row" style="gap:6px">'+chips+'</div></div>'+acao+'</div>'
      + (P.nota ? '<p class="faint" style="font-size:13px;margin:8px 0 0">'+U.esc(P.nota)+'</p>' : '')
      + '<div class="row" style="gap:5px;margin-top:10px">'+dots+'</div>'+corpo+sh+'</section>';
  };
  App.opusEras = function(P, r, ativo){
    if (!ativo) return '';
    var o = App.opus(), n = r.era, e = P.eras[n - 1]; if (!e) return '';
    var feito = r.done && r.done[n], fixo = e.marco, marco = E.opusMarco(o, P, n), ev = (r.ev && r.ev[n]) || '';
    var info = '<dl class="kv" style="grid-template-columns:auto 1fr;gap:2px 10px;font-size:13.5px"><dt>Software</dt><dd>'+U.esc(e.sw)+'</dd><dt>Hardware</dt><dd>'+U.esc(e.hw)+'</dd>'+(e.dica ? '<dt>Dica</dt><dd>'+U.esc(e.dica)+'</dd>' : '')+'</dl>';
    var box;
    if (feito) {
      var prox = P.eras[n], festa = E.opusFesta(r);
      box = '<div class="callout gate" style="font-size:14px"><b>Era '+String(n).padStart(2, '0')+' · '+U.esc(e.nome)+' concluída em '+U.fmtDate(feito)+'.</b> '+U.esc(marco)+'</div>'
        + (prox ? (festa ? '<div class="callout" style="font-size:14px">'+U.icon('sparkle')+' Hoje é dia de comemoração. A era '+String(n + 1).padStart(2, '0')+' · '+U.esc(prox.nome)+' abre amanhã.</div>' : '<div class="row"><button class="btn primary" data-a="opusProx" data-id="'+P.id+'">'+U.icon('chev')+'Abrir a era '+String(n + 1).padStart(2, '0')+' · '+U.esc(prox.nome)+'</button></div>') : '<div class="callout" style="font-size:14px">'+U.icon('crown')+' Todas as eras fechadas. Os Shadow Levels seguem abertos.</div>')
        + '<div class="row" style="justify-content:flex-end"><button class="btn sm ghost" data-a="opusDesfaz" data-id="'+P.id+'">Desfazer a conclusão</button></div>';
    } else {
      box = '<div class="stack" style="gap:8px"><label class="fld">Marco da era'+(fixo ? '' : ' <span class="faint">(o doc deixa este marco na v0.1: escreva-o antes de concluir)</span>')+(fixo ? '<div class="callout" style="font-size:14px">'+U.esc(fixo)+'</div>' : '<input type="text" maxlength="200" data-i="opusMarco" data-id="'+P.id+'" value="'+U.esc(marco)+'" placeholder="o que precisa estar funcionando">')+'</label>'
        + '<label class="fld">Evidência (link, arquivo ou descrição curta)<input type="text" maxlength="300" data-i="opusEv" data-id="'+P.id+'" value="'+U.esc(ev)+'" placeholder="https://…"></label>'
        + '<div class="row" style="justify-content:flex-end"><button class="btn primary" data-a="opusFecha" data-id="'+P.id+'">'+U.icon('seal')+'Concluir a era · +'+O.XP_ERA(n)+' XP</button></div></div>';
    }
    return '<div class="stack" style="gap:8px;margin-top:12px"><span class="eyebrow">Era atual · '+String(n).padStart(2, '0')+' · '+U.esc(e.nome)+'</span>'+info+box+'</div>';
  };
  App.opusInceptum = function(P, ativo){
    var o = App.opus();
    var cam = '<details><summary class="dim" style="cursor:pointer;font-size:13.5px">'+U.icon('book')+'Camadas do Inceptum</summary><dl class="kv" style="grid-template-columns:auto 1fr;gap:2px 10px;font-size:13.5px;margin-top:6px">'+P.camadas.map(function(c){ return '<dt>'+U.esc(c.n)+'</dt><dd>'+U.esc(c.sw)+' · <span class="faint">'+U.esc(c.dica)+'</span></dd>'; }).join('')+'</dl></details>';
    return '<div class="stack" style="gap:8px;margin-top:12px"><span class="eyebrow">Por iniciativa: '+P.etapas.join(' · ')+' · +'+O.XP_ETAPA+' XP por etapa</span>'
      + P.inic.map(function(I){
        var rec = o.inic[I.id] || {}, k = P.etapas.filter(function(_, i){ return rec[i + 1]; }).length;
        return '<div class="disc" style="grid-template-columns:minmax(0,1fr) auto"><span><b>'+U.esc(I.n)+'</b> · '+P.etapas.map(function(et, i){ return '<span class="'+(rec[i + 1] ? 'ok' : 'faint')+'">'+et+'</span>'; }).join(' · ')+'<br><span class="faint" style="font-size:12.5px">primeiro marco: '+U.esc(I.marco)+' · '+U.esc(I.ferr)+'</span></span>'
          + (k < P.etapas.length ? '<button class="btn sm" data-a="opusEtapa" data-id="'+I.id+'"'+(ativo ? '' : ' disabled')+'>'+U.esc(P.etapas[k])+' feita</button>' : '<span class="chip ok">'+U.icon('check')+'Traditio</span>')+'</div>';
      }).join('') + cam + '</div>';
  };

  App.opusCompras = function(){
    var S = App.S, o = App.opus();
    var regras = '<section class="win"><div class="win-h">'+U.icon('bag')+'Lista por prioridade · 25 itens em 3 tiers</div><ul class="list">'+O.REGRAS_COMPRA.map(function(x){ return '<li><span>'+U.esc(x)+'</span></li>'; }).join('')+'</ul></section>';
    return regras + ['I','II','III'].map(function(t){
      var its = O.COMPRAS.filter(function(c){ return c.tier === t; });
      var brl = its.reduce(function(s, c){ return s + (c.brl || 0); }, 0), usd = its.reduce(function(s, c){ return s + (c.usd || 0); }, 0);
      return '<section class="win"><div class="win-h">'+U.icon('bag')+U.esc(O.TIERS[t])+'<span class="act dim">referência: R$ '+U.num(Math.round(brl))+(usd ? ' + US$ '+U.num(Math.round(usd))+' em importados' : '')+'</span></div><div class="stack" style="gap:8px">'
        + its.map(function(c){
          var est = E.compraEstado(S, c), b = o.buys[c.n] || {}, P = O.MAP[c.proj], w = SYS.WAYMAP[c.way];
          var bt = est === 'comprado' ? '<span class="chip ok">'+U.icon('check')+'comprado '+U.fmtDate(b.d)+(b.preco ? ' · '+U.esc(b.preco) : '')+'</span><button class="iconbtn" data-a="compraDesfaz" data-id="'+c.n+'" aria-label="Desfazer compra">'+U.icon('back')+'</button>'
            : est === 'liberado' ? '<button class="btn sm primary" data-a="compraAbrir" data-id="'+c.n+'">'+U.icon('bag')+'Comprar</button>'
            : (!c.auto ? '<button class="btn sm" data-a="compraCond" data-id="'+c.n+'">'+U.icon('check')+'Condição cumprida</button>' : '<span class="chip">'+U.icon('lock')+'bloqueado</span>');
          return '<div class="q '+(est === 'comprado' ? 'done' : est === 'liberado' ? '' : 'locked')+'" style="--wc:'+w.color+';cursor:default"><span class="st"><span>'+c.n+'</span></span><span style="min-width:0"><span class="tt">'+U.esc(c.item)+'</span><span class="mt"><span class="chip">'+U.esc(c.preco)+'</span><span class="chip">'+U.esc(P ? P.n : c.proj)+' · '+U.esc(c.era)+'</span>'+H.wayChip(c.way)+(c.usd ? '<span class="chip warn">importado: sem impostos</span>' : '')+'</span><span class="faint" style="font-size:12.5px;display:block;margin-top:4px">desbloqueio: '+U.esc(c.cond)+(b.cond && est !== 'comprado' ? ' · confirmado em '+U.fmtDate(b.cond) : '')+'</span></span><span class="row" style="gap:6px;flex-wrap:nowrap">'+bt+'</span></div>';
        }).join('') + '</div></section>';
    }).join('');
  };
  App.opusRegras = function(){
    var r = ['Cada marco de era concluído vira XP no Way do projeto (dividido quando o projeto é de dois Ways, como o Scrinium).','Ritual de fechamento: era concluída, um dia de comemoração antes de abrir a próxima.','Projeto novo só entra quando outro fecha uma era. O primeiro é livre.','Shadow Levels são opcionais: ramificações do projeto, com custo e o que ensinam.','Prova de um domínio do Vitruviano feita dentro de um projeto de outro Way dá XP nos dois (XP dupla).','Software, hardware, dica e marco de cada era vêm do doc SGM-Opus · Arsenal de Recursos; onde o marco está só na v0.1, ele é escrito aqui antes de fechar a era.'];
    return '<section class="win"><div class="win-h">'+U.icon('shield')+'Regras do SGM-Opus</div><ul class="list">'+r.map(function(x){ return '<li><span>'+U.esc(x)+'</span></li>'; }).join('')+'</ul></section>';
  };

  /* ---------- ações ---------- */
  App.A.opusAbrir = function(el){
    var o = App.opus(), id = el.getAttribute('data-id');
    if (E.opusFichas(o) <= 0) { App.toast({t:'Projeto novo ainda não', s:'Projeto novo só entra quando outro fecha uma era.', ic:'lock'}); return; }
    var r = App.opusP(id); if (r.ini) return; r.ini = U.today(); r.era = r.era || 1; o.starts.push({p:id, d:U.today()});
    App.commit(['core']); App.toast({t:'Projeto aberto · ' + O.MAP[id].n, s:'Era 01 em andamento. Uma era por vez.', ic:'layers'});
  };
  App.I.opusMarco = function(el){ var r = App.opusP(el.getAttribute('data-id')); r.marco[r.era] = el.value.slice(0, 200); App.debSave('core'); };
  App.I.opusEv = function(el){ var r = App.opusP(el.getAttribute('data-id')); r.ev[r.era] = el.value.slice(0, 300); App.debSave('core'); };
  App.A.opusFecha = function(el){
    var id = el.getAttribute('data-id'), P = O.MAP[id], o = App.opus(), r = App.opusP(id), n = r.era;
    if (!r.ini) return;
    if (!E.opusMarco(o, P, n).trim()) { App.toast({t:'Falta o marco', s:'Escreva o marco da era antes de concluir. Marco é o que precisa estar funcionando.', ic:'alert'}); return; }
    if (!(r.ev[n] || '').trim()) { App.toast({t:'Falta a evidência', s:'Link, arquivo ou descrição curta do que está funcionando.', ic:'alert'}); return; }
    r.done[n] = U.today(); App.commit(['core']);
    App.toast({t:'Era fechada · ' + P.n + ' ' + String(n).padStart(2, '0') + ' ' + P.eras[n - 1].nome, s:'+' + O.XP_ERA(n) + ' XP. Hoje é dia de comemoração; a próxima era abre amanhã.', ic:'seal', ms:6000});
  };
  App.A.opusProx = function(el){
    var id = el.getAttribute('data-id'), r = App.opusP(id), P = O.MAP[id];
    if (!r.done[r.era] || E.opusFesta(r) || r.era >= P.eras.length) return;
    r.era++; App.commit(['core']);
  };
  App.A.opusDesfaz = function(el){ var r = App.opusP(el.getAttribute('data-id')); delete r.done[r.era]; App.commit(['core']); App.toast({t:'Conclusão desfeita', s:'O XP da era sai do saldo. Honestidade também é stat.', ic:'back'}); };
  App.A.opusSh = function(el){ var id = el.getAttribute('data-id'), k = el.getAttribute('data-k'), r = App.opusP(id); if (!r.ini) return; if (r.sh[k]) delete r.sh[k]; else r.sh[k] = U.today(); App.commit(['core']); };
  App.A.opusEtapa = function(el){
    var iid = el.getAttribute('data-id'), o = App.opus(), P = O.MAP.inceptum, rec = o.inic[iid] || (o.inic[iid] = {});
    var k = P.etapas.filter(function(_, i){ return rec[i + 1]; }).length; if (k >= P.etapas.length) return;
    rec[k + 1] = U.today(); App.commit(['core']); App.toast({t:P.etapas[k] + ' feita', s:'+' + O.XP_ETAPA + ' XP no Founder.', ic:'flag'});
  };
  App.A.compraCond = function(el){ var o = App.opus(), n = +el.getAttribute('data-id'), b = o.buys[n] || (o.buys[n] = {}); b.cond = U.today(); App.commit(['core']); };
  App.A.compraAbrir = function(el){ App.ui.modal = {type:'compra', id:+el.getAttribute('data-id'), preco:'', comparei:false}; App.renderModal(); };
  App.M.compra = function(m){
    var c = O.COMPRAS.filter(function(x){ return x.n === m.id; })[0]; if (!c) return '';
    var ref = c.brl || c.usd, moeda = c.brl ? 'R$' : 'US$', v = parseFloat(String(m.preco || '').replace(/\./g, '').replace(',', '.')), alto = ref && v > ref * 1.15;
    return '<section class="win"><div class="win-h">'+U.icon('bag')+'Comprar · item '+c.n+'<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack"><h3>'+U.esc(c.item)+'</h3>'
      + '<p class="dim" style="font-size:14px">Referência de novembro de 2026: '+U.esc(c.preco)+'. Confirme o preço no dia.'+(c.usd ? ' Valores em dólares não incluem imposto de importação, ICMS nem frete.' : '')+' O XP vem da entrega do marco, não da compra.</p>'
      + '<label class="fld">Preço de hoje ('+moeda+')<input type="text" inputmode="decimal" data-i="compraPreco" value="'+U.esc(m.preco || '')+'"></label>'
      + (alto ? '<div class="callout fail" style="font-size:14px">Subiu mais de 15% sobre a referência. Compare com a alternativa da seção do projeto antes de comprar.<label class="check"><input type="checkbox" data-c="compraComparei"'+(m.comparei ? ' checked' : '')+'><span>Comparei com a alternativa</span></label></div>' : '')
      + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn primary" data-a="compraOk"'+(alto && !m.comparei ? ' disabled' : '')+'>'+U.icon('check')+'Registrar compra</button></div></div></section>';
  };
  App.I.compraPreco = function(el){ var m = App.ui.modal; if (!m) return; var antes = m.preco; m.preco = el.value; var c = O.COMPRAS.filter(function(x){ return x.n === m.id; })[0], ref = c && (c.brl || c.usd); var f = function(s){ return parseFloat(String(s || '').replace(/\./g, '').replace(',', '.')) > ref * 1.15; }; if (ref && f(antes) !== f(m.preco)) { App.renderModal(); var inp = App.$('modal').querySelector('[data-i="compraPreco"]'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } } };
  App.C.compraComparei = function(el){ var m = App.ui.modal; if (!m) return; m.comparei = el.checked; var b = App.$('modal').querySelector('[data-a="compraOk"]'); if (b) b.disabled = !el.checked; };
  App.A.compraOk = function(){
    var m = App.ui.modal, o = App.opus(), c = O.COMPRAS.filter(function(x){ return x.n === m.id; })[0];
    if (!c || E.compraEstado(App.S, c) !== 'liberado') return;
    var b = o.buys[c.n] || (o.buys[c.n] = {}); b.st = 'comprado'; b.d = U.today(); b.preco = String(m.preco || '').slice(0, 30) ? (c.brl ? 'R$ ' : 'US$ ') + String(m.preco).slice(0, 30) : '';
    App.ui.modal = null; App.commit(['core']); App.toast({t:'Compra registrada', s:'Agora o XP vem da entrega do marco que ela habilita.', ic:'bag'});
  };
  App.A.compraDesfaz = function(el){ var o = App.opus(), n = +el.getAttribute('data-id'), b = o.buys[n]; if (b) { delete b.st; delete b.d; delete b.preco; } App.commit(['core']); };
})();
