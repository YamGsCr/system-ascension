/* ===== VIEW v5: técnicas a investigar, escolhas de trilha e Fora do roteiro ===== */
App.TKCLS = {'técnica':'tec', 'notação':'not', 'ferramenta':'fer', 'método':'met', 'norma':'nor', 'referência':'ref'};
App.trackOpt = function(key){ var c = SYS.CHOICES[key], cur = (App.S.tracks || {})[key]; return c ? c.opts.filter(function(o){ return o.id === cur; })[0] || null : null; };
App.tkList = function(n, src){
  if (!src || src === 'base') return n.tk || [];
  var p = src.split(':'), x = (n.chx || []).filter(function(y){ return y.key === p[1]; })[0];
  return (x && x.per[p[2]] && x.per[p[2]].tk) || [];
};
App.techChips = function(n, list, src){
  var got = (App.S.tk && App.S.tk[n.id]) || [];
  return '<div class="tkgrid">' + list.map(function(t, i){
    var on = got.indexOf(t[0]) >= 0;
    return '<button class="tk k-'+(App.TKCLS[t[1]] || 'tec')+(on ? ' on' : '')+'" data-a="tkToggle" data-id="'+n.id+'" data-src="'+src+'" data-i="'+i+'" aria-pressed="'+on+'" title="'+(on ? 'Investigado — toque para desmarcar' : 'Toque quando tiver investigado')+'"><span class="tkn">'+U.esc(t[0])+'</span><span class="tkk">'+(on ? U.icon('check') : '')+U.esc(t[1])+'</span></button>';
  }).join('') + '</div>';
};
App.techBlock = function(n){
  var tk = n.tk || []; if (!tk.length) return '';
  var got = (App.S.tk && App.S.tk[n.id]) || [], done = tk.filter(function(t){ return got.indexOf(t[0]) >= 0; }).length;
  return '<section class="tkbox"><div class="row between"><span class="eyebrow">Técnicas & ferramentas a investigar</span><span class="mono dim" style="font-size:12px">'+done+'/'+tk.length+'</span></div>'
    + '<p class="faint" style="font-size:13px">Só o nome, de propósito. O “como” é contigo: pesquise, teste e use num entregável. Toque em uma quando tiver investigado.</p>'
    + App.techChips(n, tk, 'base') + '</section>';
};
App.trackBlock = function(n, x){
  var c = SYS.CHOICES[x.key]; if (!c) return '';
  var w = App.way(n.way), opt = App.trackOpt(x.key), others = c.nodes.filter(function(id){ return id !== n.id; });
  var h = '<section class="trk" style="--wc:'+w.color+'"><div class="row between" style="align-items:flex-start;gap:8px;flex-wrap:nowrap"><div class="stack" style="gap:3px;min-width:0"><span class="eyebrow">'+U.icon('compass')+' Escolha de trilha · '+U.esc(c.n)+'</span><b class="trk-q">'+U.esc(c.q)+'</b></div>'
    + (opt ? '<span class="chip ok">'+U.icon('check')+U.esc(opt.n)+'</span>' : '<span class="chip warn">escolha pendente</span>') + '</div>'
    + '<p class="dim" style="font-size:13.5px">'+U.esc(c.why)+'</p>'
    + '<div class="trk-opts" role="radiogroup" aria-label="'+U.esc(c.n)+'">'+c.opts.map(function(o){ var on = opt && opt.id === o.id; return '<button class="trk-opt'+(on ? ' on' : '')+'" role="radio" aria-checked="'+!!on+'" data-a="trackPick" data-k="'+x.key+'" data-o="'+o.id+'"><b>'+U.esc(o.n)+'</b><span class="t">'+U.esc(o.tag)+'</span><span class="w">'+U.esc(o.who)+'</span></button>'; }).join('')+'</div>'
    + '<p class="faint mono" style="font-size:11.5px">'+(others.length ? 'Vale também para '+others.map(function(id){ return '<button class="lnk" data-a="openNode" data-id="'+id+'">'+id+'</button>'; }).join(', ')+'. ' : '')+'Trocar é livre; o progresso de cada trilha fica salvo.</p>';
  if (opt) {
    var p = x.per[opt.id] || {}, st = p.st || [], note = App.N.n[n.id] || {}, ticks = (note.cs || {})[x.key + ':' + opt.id] || [];
    var dn = st.filter(function(_, i){ return ticks.indexOf(i) >= 0; }).length;
    h += '<div class="stack" style="gap:4px"><div class="row between"><span class="eyebrow">Trilha '+U.esc(opt.n)+' · o que estudar</span><span class="mono dim" style="font-size:12px">'+dn+'/'+st.length+'</span></div>'+H.bar(U.pct(dn, st.length))+'</div>'
      + '<div class="stack" style="gap:0">'+st.map(function(s, i){ return '<label class="check"><input type="checkbox" data-c="trackTick" data-id="'+n.id+'" data-k="'+x.key+'" data-o="'+opt.id+'" data-i="'+i+'"'+(ticks.indexOf(i) >= 0 ? ' checked' : '')+'><span>'+U.esc(s)+'</span></label>'; }).join('')+'</div>'
      + (p.tk && p.tk.length ? '<div class="stack" style="gap:6px"><span class="eyebrow" style="color:var(--dim)">Da trilha '+U.esc(opt.n)+' · a investigar</span>'+App.techChips(n, p.tk, 'o:'+x.key+':'+opt.id)+'</div>' : '');
  } else h += '<div class="empty" style="padding:14px">Escolha uma trilha para ver os assuntos dela.</div>';
  return h + '</section>';
};
App.trackBlocks = function(n){ return (n.chx || []).map(function(x){ return App.trackBlock(n, x); }).join(''); };
App.offBlock = function(n){
  var mine = (App.S.offs || []).filter(function(o){ return o.node === n.id; });
  return '<section class="offbox"><div class="row between" style="gap:8px"><span class="eyebrow">'+U.icon('flag')+' Fora do roteiro</span><button class="btn sm" data-a="offOpen" data-id="'+n.id+'">'+U.icon('plus')+'Registrar técnica</button></div>'
    + '<p class="faint" style="font-size:13px">Usou num entregável uma técnica ou ferramenta que o Sistema não listou? Registre: +'+SYS.OFF_XP+' XP e +'+SYS.OFF_CR+' créditos. Desconfiar do framework também é stat.</p>'
    + (mine.length ? '<div class="stack" style="gap:0">'+mine.map(App.offRow).join('')+'</div>' : '') + '</section>';
};
App.offRow = function(o){
  var w = App.way(o.way);
  return '<div class="offrow"><span style="color:'+(w ? w.color : 'var(--glow)')+'">'+U.icon('flag')+'</span><span style="min-width:0"><b>'+U.esc(o.n)+'</b>'+(o.why ? '<br><span class="dim" style="font-size:13px">'+U.esc(o.why)+'</span>' : '')+'<br><span class="faint mono" style="font-size:11px">'+U.fmtDate(o.d)+(o.node ? ' · '+U.esc(o.node) : '')+(w ? ' · '+U.esc(w.pt) : '')+(o.ev ? ' · evidência: '+U.esc(o.ev) : '')+'</span></span><button class="iconbtn" data-a="offDel" data-id="'+o.id+'" aria-label="Apagar registro">'+U.icon('trash')+'</button></div>';
};

/* ---------- aba "O que estudar" e missão ganham as camadas novas ---------- */
App._nodeStudyV4 = App.nodeStudy;
App.nodeStudy = function(n){ return App.trackBlocks(n) + App._nodeStudyV4(n) + App.techBlock(n) + App.offBlock(n); };
App._nodeMissionV4 = App.nodeMission;
App.nodeMission = function(n){
  var out = App._nodeMissionV4(n); if (!(n.chx || []).length) return out;
  var row = '<div class="row trkrow" style="gap:6px">'+n.chx.map(function(x){ var c = SYS.CHOICES[x.key], o = App.trackOpt(x.key); return '<button class="chip '+(o ? 'ok' : 'warn')+'" data-a="drTab" data-tab="estudar">'+U.icon('compass')+U.esc(c.n)+': '+U.esc(o ? o.n : 'escolher')+'</button>'; }).join('')+'</div>';
  return row + out;
};
App.missingTracks = function(n){ return (n.chx || []).filter(function(x){ return !App.trackOpt(x.key); }).map(function(x){ return SYS.CHOICES[x.key].n; }); };
App._mDoneV4 = App.M.done;
App.M.done = function(m){
  var n = E.NODE[m.id], miss = App.missingTracks(n), out = App._mDoneV4(m);
  if (!miss.length) return out;
  out = out.replace('<div class="callout gate"', '<div class="callout fail" style="font-size:14px">'+U.icon('compass')+' Escolha a trilha antes de concluir (aba <b>O que estudar</b>): '+U.esc(miss.join(', '))+'. É ela que diz o que você estudou.</div><div class="callout gate"');
  return out.replace('data-a="confirmDone"', 'data-a="confirmDone" data-trkmiss="1" disabled');
};
App._cDoneCheckV4 = App.C.doneCheck;
App.C.doneCheck = function(el){ App._cDoneCheckV4(el); var m = App.ui.modal; if (!m) return; var b = App.$('modal').querySelector('[data-a="confirmDone"]'); if (b && App.missingTracks(E.NODE[m.id]).length) b.disabled = true; };
App._aConfirmDoneV4 = App.A.confirmDone;
App.A.confirmDone = function(el){
  var m = App.ui.modal; if (!m) return; var n = E.NODE[m.id];
  if (App.missingTracks(n).length) { App.toast({t:'Falta escolher a trilha', s:'Abra “O que estudar” e escolha antes de concluir.', ic:'compass'}); return; }
  App._aConfirmDoneV4(el);
  var rec = App.S.nodes[n.id];
  if (rec && rec.s === 'done' && (n.chx || []).length) { rec.tr = {}; n.chx.forEach(function(x){ rec.tr[x.key] = App.S.tracks[x.key]; }); Store.save(['core']); }
};

/* ---------- ações ---------- */
App.A.tkToggle = function(el){
  var id = el.getAttribute('data-id'), n = E.NODE[id]; if (!n) return;
  var t = App.tkList(n, el.getAttribute('data-src'))[+el.getAttribute('data-i')]; if (!t) return;
  var S = App.S; S.tk = S.tk || {}; var a = S.tk[id] = S.tk[id] || [], k = a.indexOf(t[0]);
  if (k >= 0) a.splice(k, 1); else a.push(t[0]);
  if (!a.length) delete S.tk[id];
  App.commit(['core']);
};
App.A.trackPick = function(el){
  var key = el.getAttribute('data-k'), o = el.getAttribute('data-o'), S = App.S, c = SYS.CHOICES[key];
  if (!c || !c.opts.some(function(x){ return x.id === o; })) return;
  S.tracks = S.tracks || {}; var prev = S.tracks[key]; if (prev === o) return;
  S.tracks[key] = o;
  if (prev) S.stats.trackSwaps = (S.stats.trackSwaps || 0) + 1;
  App.commit(['core']);
  var opt = c.opts.filter(function(x){ return x.id === o; })[0];
  App.toast({t:(prev ? 'Trilha trocada · ' : 'Trilha escolhida · ') + opt.n, s:prev ? 'O progresso da trilha anterior ficou guardado. Pode voltar quando quiser.' : c.n + ' — vale para ' + c.nodes.join(', ') + '.', ic:'compass'});
};
App.C.trackTick = function(el){
  var id = el.getAttribute('data-id'), key = el.getAttribute('data-k') + ':' + el.getAttribute('data-o'), i = +el.getAttribute('data-i');
  var note = App.N.n[id] = App.N.n[id] || {}; var cs = note.cs = note.cs || {}; var a = cs[key] = cs[key] || [];
  var k = a.indexOf(i); if (el.checked && k < 0) a.push(i); if (!el.checked && k >= 0) a.splice(k, 1);
  Store.save(['notes']); App.renderDrawer();
};
App.A.offOpen = function(el){
  var id = el.getAttribute('data-id') || '', n = E.NODE[id], way = el.getAttribute('data-way') || (n ? n.way : (E.mainWay ? E.mainWay(App.S) : SYS.WAYS[0].id));
  App.ui.modal = {type:'off', node:n ? id : '', way:way, n:'', why:'', ev:''}; App.renderModal();
  setTimeout(function(){ var i = App.$('modal').querySelector('[data-i="offN"]'); if (i) i.focus(); }, 30);
};
App.M.off = function(m){
  var w = App.way(m.way), ok = (m.n || '').trim().length >= 2;
  return '<section class="win"><div class="win-h" style="color:'+w.color+'">'+U.icon('flag')+'Fora do roteiro<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack">'
    + '<p class="dim" style="font-size:14px">Técnica, notação, ferramenta ou método que o Sistema <b>não</b> listou e que você <b>usou de verdade</b> num entregável. Honra do jogador.</p>'
    + '<label class="fld">Nome da técnica ou ferramenta<input type="text" data-i="offN" maxlength="80" value="'+U.esc(m.n)+'" placeholder="ex.: Service Blueprint, Kanban pessoal, Figma…"></label>'
    + '<label class="fld">Caminho<select data-c="offWay">'+SYS.WAYS.map(function(x){ return '<option value="'+x.id+'"'+(x.id === m.way ? ' selected' : '')+'>'+U.esc(x.pt)+'</option>'; }).join('')+'</select></label>'
    + (m.node ? '<p class="faint mono" style="font-size:11.5px">Capítulo: '+U.esc(m.node)+' · '+U.esc(E.NODE[m.node].t)+'</p>' : '')
    + '<label class="fld">Por que ela e não a do roteiro? (1 linha)<input type="text" data-i="offWhy" maxlength="160" value="'+U.esc(m.why)+'" placeholder="o que ela resolveu que a lista não resolvia"></label>'
    + '<label class="fld">Evidência (opcional)<input type="text" data-i="offEv" maxlength="200" value="'+U.esc(m.ev)+'" placeholder="link do entregável, arquivo, print…"></label>'
    + '<div class="row" style="justify-content:flex-end"><button class="btn ghost" data-a="closeModal">Cancelar</button><button class="btn primary" data-a="offSave"'+(ok ? '' : ' disabled')+'>'+U.icon('check')+'+'+SYS.OFF_XP+' XP · +'+SYS.OFF_CR+' '+w.cur.code+'</button></div></div></section>';
};
App.I.offN = function(el){ var m = App.ui.modal; if (!m) return; m.n = el.value; var b = App.$('modal').querySelector('[data-a="offSave"]'); if (b) b.disabled = m.n.trim().length < 2; };
App.I.offWhy = function(el){ if (App.ui.modal) App.ui.modal.why = el.value; };
App.I.offEv = function(el){ if (App.ui.modal) App.ui.modal.ev = el.value; };
App.C.offWay = function(el){ var m = App.ui.modal; if (!m) return; m.way = el.value; App.renderModal(); };
App.A.offSave = function(){
  var m = App.ui.modal; if (!m || (m.n || '').trim().length < 2) return;
  var S = App.S; S.offs = S.offs || [];
  S.offs.push({id:U.uid(), n:m.n.trim().slice(0, 80), way:m.way, node:m.node || '', why:(m.why || '').trim().slice(0, 160), ev:(m.ev || '').trim().slice(0, 200), d:U.today()});
  if (S.offs.length > 500) S.offs = S.offs.slice(-500);
  App.ui.modal = null; App.commit(['core']);
  App.toast({t:'Fora do roteiro · ' + m.n.trim(), s:'+' + SYS.OFF_XP + ' XP. O mapa ficou maior porque você foi além dele.', ic:'flag'});
};
App.A.offDel = function(el){ var id = el.getAttribute('data-id'), S = App.S; S.offs = (S.offs || []).filter(function(o){ return o.id !== id; }); App.commit(['core']); };

/* ---------- painéis: encruzilhadas do Caminho e Fora do roteiro nos Feitos ---------- */
App.crossWin = function(w, br){
  var keys = (SYS.CHOICE_ORDER || []).filter(function(k){ var c = SYS.CHOICES[k]; return c.nodes.some(function(id){ var n = E.NODE[id]; return n && n.way === w.id && (!br || n.br === br); }); });
  if (!keys.length) return '';
  return '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('compass')+'Encruzilhadas</div><p class="faint" style="font-size:12.5px;margin-bottom:6px">Capítulos em que você escolhe um lado. Uma trilha por vez, troca livre.</p>'
    + keys.map(function(k){ var c = SYS.CHOICES[k], o = App.trackOpt(k); return '<button class="crossrow" data-a="openNode" data-id="'+c.nodes[0]+'"><span style="color:'+(o ? 'var(--ok)' : 'var(--warn)')+'">'+U.icon(o ? 'check' : 'compass')+'</span><span style="min-width:0"><b>'+U.esc(c.n)+'</b><br><span class="dim" style="font-size:12.5px">'+(o ? U.esc(o.n) : 'escolha pendente')+' · '+c.nodes.join(', ')+'</span></span></button>'; }).join('') + '</section>';
};
App.offPanel = function(wid){
  var w = App.way(wid), list = (App.S.offs || []).filter(function(o){ return o.way === wid; }).slice().reverse();
  return '<section class="win" style="--wc:'+w.color+'"><div class="win-h" style="color:'+w.color+'">'+U.icon('flag')+'Fora do roteiro<button class="act" data-a="offOpen" data-way="'+wid+'">+ registrar</button></div>'
    + '<p class="dim" style="font-size:13.5px">Técnicas e ferramentas que você trouxe de fora da lista e usou num entregável deste Caminho. Cada uma vale +'+SYS.OFF_XP+' XP e conta para as conquistas de desconfiado profissional.</p>'
    + (list.length ? '<div class="stack" style="gap:0;margin-top:6px">'+list.map(App.offRow).join('')+'</div>' : '<div class="empty" style="margin-top:8px">Nada ainda. Quando o roteiro não bastar, este é o lugar.</div>') + '</section>';
};

/* marcador de encruzilhada na lista de capítulos */
H._nodeRowV4 = H.nodeRow;
H.nodeRow = function(n){
  var out = H._nodeRowV4(n); if (!(n.chx || []).length) return out;
  var all = n.chx.every(function(x){ return App.trackOpt(x.key); });
  return out.replace('<span class="mt">', '<span class="mt"><span class="chip '+(all ? 'ok' : 'warn')+'" title="Capítulo com escolha de trilha">'+U.icon('compass')+'trilha</span>');
};
