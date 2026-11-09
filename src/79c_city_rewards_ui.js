/* ===== CIDADE · Recompensas, parte 3: as janelas e os ganchos de tela =====
   Inventário com uso, o par de caixas, Fundo e vales (com a Lista de Desejos e a Lista Secreta), Arsenal dos Ecos,
   Relíquias no avatar, Sala de Troféus, Forja no Centro, maldições no HUD, Breu no mapa e as mensagens do celular.
   O que se digita nas janelas fica em App.ui.cyF até o botão gravar: redesenhar não apaga nada. */
(function(){
  var CY = SYS.CITY, RK = ['E', 'D', 'C', 'B', 'A', 'S'];
  Object.assign(SYS.ICONS, {
    anvil: 'M3 7h13a5 5 0 0 1-5 5H9v3h4l2 4H5l2-4h2v-3 M16 7h5 M3 7v2.5',
    box: 'M3.5 8L12 3.5 20.5 8v8.5L12 21l-8.5-4.5z M3.5 8L12 12.5 20.5 8 M12 12.5V21',
    skull: 'M12 3a7.5 7.5 0 0 0-7.5 7.5c0 2.6 1.3 4.5 3 5.6V19h9v-2.9c1.7-1.1 3-3 3-5.6A7.5 7.5 0 0 0 12 3z M9 10.5h.01 M15 10.5h.01 M10 19v2 M14 19v2 M11 14.5l1-1.5 1 1.5'
  });
  var SLOTS = CY.SLOT_RELIQ;
  function C(){ return App.city; }
  function rc(r){ return (SYS.RARITY[r] || SYS.RARITY.common).c; }
  function rn(r){ return App.cyRarName(r); }
  function ri(r){ return Math.max(0, CY.RARS.indexOf(r)); }
  function mn(id){ return (CY.ITENS[id] || {n: id}).n; }
  function dn(d){ return (CY.DMAP[d] || {n: d || '—'}).n; }
  function money(v){ v = Math.round((+v || 0) * 100) / 100; return 'R$ ' + v.toLocaleString('pt-BR', {minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2}); }
  function num(s){ s = String(s == null ? '' : s).trim().replace(/\s|R\$/g, ''); if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.'); return +s || 0; }
  function F(){ return App.ui.cyF || (App.ui.cyF = {}); }
  function fv(k){ var v = F()[k]; return v == null ? '' : v; }
  function dd(s){ if (!s) return ''; var d = new Date(s.length > 10 ? s : s + 'T12:00:00'); return isNaN(d) ? '' : String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); }
  function sec(t, body, extra){ return '<section class="cy-sec"><div class="cy-sec-h"><span class="eyebrow">' + t + '</span>' + (extra || '') + '</div>' + body + '</section>'; }
  function row(ic, t, s, act){ return '<div class="cy-ir">' + U.icon(ic) + '<span class="stack" style="gap:1px;min-width:0"><b>' + t + '</b>' + (s ? '<span class="faint" style="font-size:12px">' + s + '</span>' : '') + '</span>' + (act ? '<span class="cy-ir-a">' + act + '</span>' : '') + '</div>'; }
  function btn(a, label, attrs, cls){ return '<button class="btn sm' + (cls ? ' ' + cls : '') + '" data-a="' + a + '"' + (attrs || '') + '>' + label + '</button>'; }
  function relIc(slot){ var d = CY.RELIQ.ic[slot]; return d ? '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>' : U.icon('crown'); }
  function err(id, msg){ (App.ui.cyErr || (App.ui.cyErr = {}))[id] = msg || ''; var el = document.getElementById('cyErr-' + id); if (el) el.textContent = msg || ''; }
  function errHTML(id){ return '<p class="cy-err bad" id="cyErr-' + id + '" style="font-size:13px">' + U.esc((App.ui.cyErr || {})[id] || '') + '</p>'; }
  function sel(f, opts, ph, attrs){ return '<select class="cy-sel" data-c="cyFs" data-f="' + f + '"' + (attrs || '') + '><option value="">' + U.esc(ph) + '</option>' + opts.map(function(o){ return '<option value="' + U.esc(o[0]) + '"' + (fv(f) === o[0] ? ' selected' : '') + (o[2] ? ' disabled' : '') + '>' + U.esc(o[1]) + '</option>'; }).join('') + '</select>'; }
  function tirar(t, id){ App.ui.cyw = (App.ui.cyw || []).filter(function(x){ return !(x.t === t && x.id === id); }); }
  App.I.cyF = function(el){ F()[el.getAttribute('data-f')] = el.value; };
  App.C.cyFc = function(el){ F()[el.getAttribute('data-f')] = el.checked; };
  App.C.cyFs = function(el){ F()[el.getAttribute('data-f')] = el.value; el.blur(); App.cyWinRender(); };
  /* um botão que abre janela pode escolher a aba (data-tab) */
  var oldWin = App.A.cyWin;
  App.A.cyWin = function(el, ev){ oldWin(el, ev); var t = el.getAttribute('data-tab'), w = App.cyWinTop(); if (t && w) { w.tab = t; App.cyWinRender(); } };

  /* ---------- Breu, portais especiais, título e maldições no HUD ---------- */
  App.cyBreu = function(p){ return !!(C() && E.cyMaldTem(C(), 'breu') && !(p && p.in)); };
  var ESP = {cont: ['Contenção', 'fechar tira 1 nível de corrupção e dá um par de caixas', 'shield', 'warn'], rev: ['Revanche', 'fechar desfaz a quebra e conserta o Eco Partido', 'sword', 'warn'],
    posse: ['Posseiro', 'não some até ser fechado', 'skull', 'bad'], sirene: ['Emergencial', 'perder vale corrupção no bairro', 'alert', 'bad'],
    ini: ['Inimigo Íntimo', 'drop dobrado', 'scroll', 'glow'], extra: ['Passe', 'portal extra da vertente, fora do limite', 'map', 'glow']};
  App.cyEspName = function(p){ var k = E.cyEspKind(p); return k ? ESP[k][0] : ''; };
  App.cyTagsEsp = function(p){
    var k = E.cyEspKind(p), t = '';
    if (k) t += '<span class="chip ' + ESP[k][3] + '" title="' + U.esc(ESP[k][1]) + '">' + U.icon(ESP[k][2]) + ESP[k][0] + (k === 'cont' ? ' · nível ' + p.cont : '') + '</span>';
    if (p.dobro && k !== 'ini') t += '<span class="chip glow">drop dobrado</span>';
    if (p.forja) t += '<span class="chip">' + U.icon('anvil') + 'Forja ' + p.forja + '/' + CY.FORJA.porPortal + '</span>';
    if (p.eco) { var e = E.cyEco(C(), p.eco); if (e) t += '<span class="chip ok">' + U.icon('star') + U.esc(e.n) + '</span>'; }
    return t;
  };
  App.cyTitleHUD = function(){ var S = App.S, t = E.TITLEMAP && E.TITLEMAP[S.profile.title]; return t && E.titleUnlocked(S, App.D, t) ? '<span class="cy-me-tt" style="color:' + rc(t.r) + '">' + U.esc(t.n) + '</span>' : ''; };
  App.cyMaldHUD = function(){
    var M = E.cyMald(C()); if (!M.length) return '';
    return '<button class="cy-maldb" data-a="cyWin" data-w="mald" data-reset aria-label="Maldições ativas: ' + M.length + '">' + U.icon('skull') + '<span>' + (M.length === 1 ? (CY.MALDMAP[M[0].k] || {n: ''}).n : M.length + ' maldições') + '</span></button>';
  };
  App.cyMaldTxt = function(){ var M = E.cyMald(C()); return M.length ? M.map(function(m){ return (CY.MALDMAP[m.k] || {n: m.k}).n; }).join(', ') : 'nenhuma ativa'; };
  App.cyMitico = function(){ var eq = E.cyEquipped(C()); return Object.keys(eq).some(function(s){ return eq[s].r === 'mythic'; }); };
  function maldLeft(m){
    if (m.usos != null) return m.usos + (m.usos === 1 ? ' uso restante' : ' usos restantes');
    if (!m.ate) return 'até fechar o portal';
    var ms = Date.parse(m.ate) - Date.now(); return ms <= 0 ? 'acabando' : 'acaba em ' + (ms > 48 * 3600000 ? Math.ceil(ms / 86400000) + ' dias' : U.fmtDur(ms));
  }
  function maldTask(m){
    if (m.task === 'purif') return 'Cumprir: use a Purificação que veio na caixa.';
    if (m.task === 'perg') return 'Cumprir: use o Pergaminho do Inimigo Íntimo e feche o portal dele.';
    if (m.k === 'posseiro' || m.k === 'sirene') return 'Cumprir: feche o portal ' + (m.k === 'sirene' ? 'emergencial' : 'C') + ' em ' + dn(m.d) + '.';
    return '';
  }
  function maldBox(m, big){
    var x = CY.MALDMAP[m.k] || {n: m.k, ef: ''}, task = maldTask(m);
    return '<div class="cy-mald' + (big ? ' big' : '') + '">' + U.icon('skull') + '<div class="stack" style="gap:3px;min-width:0"><b>' + (big ? 'Maldição: ' : '') + U.esc(x.n) + (m.d ? ' · ' + U.esc(dn(m.d)) : '') + '</b><span>' + U.esc(x.ef) + '.</span><span class="faint mono" style="font-size:11.5px">' + maldLeft(m) + '</span>'
      + (task ? '<span class="dim" style="font-size:12.5px">' + task + '</span>' : '') + (m.p && E.cyPortal(C(), m.p) ? '<span>' + btn('cyOpen', U.icon('gate') + 'Abrir o portal', ' data-id="' + m.p + '"') + '</span>' : '') + '</div></div>';
  }
  App.CYW.mald = function(){
    var M = E.cyMald(C());
    var b = (M.length ? M.map(function(m){ return maldBox(m); }).join('') : '<p class="dim">Nenhuma maldição ativa.</p>')
      + '<p class="faint" style="font-size:12.5px">Maldições vêm da caixa Amaldiçoada e duram até você cumprir o que veio nela, no máximo ' + CY.MALD_MAX + ' dias.</p>';
    return {ic: 'skull', sup: 'Amaldiçoada', t: 'Maldições ativas', wc: 'var(--cy-red)', b: b, cls: 'narrow'};
  };

  /* ---------- mensagens do celular ---------- */
  var LT = App.cyLOGT || {};
  var oldNasceu = LT.nasceu;
  Object.assign(LT, {
    nasceu: function(l){
      if (l.esp === 'cont') return 'Contenção ' + l.r + ' aberta em ' + dn(l.d) + ': fechar tira 1 nível de corrupção.';
      if (l.esp === 'rev') return 'Revanche aberta em ' + dn(l.d) + ': ' + l.n + '. Fechar desfaz a quebra.';
      if (l.esp === 'posse') return 'Posseiro: um portal C ocupou ' + dn(l.d) + ' e não sai até ser fechado.';
      if (l.esp === 'sirene') return 'Sirene! Emergencial ' + l.r + ' em ' + dn(l.d) + ': ' + CY.SIRENE.prazo + ' h para fechar.';
      if (l.esp === 'ini') return 'O pergaminho abriu ' + l.n + ' em ' + dn(l.d) + ', com drop dobrado.';
      if (l.esp === 'extra') return 'O passe abriu um portal extra em ' + dn(l.d) + ': ' + l.n + '.';
      return oldNasceu ? oldNasceu(l) : l.n;
    },
    caixa: function(l){ return 'Você abriu a ' + (l.qual === 'ab' ? 'Abençoada' : 'Amaldiçoada') + ' do par ' + CY.CAIXA[l.grau] + ': ' + l.t + '.' + (l.sus ? ' A outra sussurrou: ' + l.sus + '.' : ''); },
    maldicao: function(l){ var m = CY.MALDMAP[l.mk] || {n: l.mk, ef: ''}; return 'Maldição: ' + m.n + (l.d ? ' em ' + dn(l.d) : '') + '. ' + m.ef + '.'; },
    'maldicao-fim': function(l){ return 'A maldição ' + (CY.MALDMAP[l.mk] || {n: l.mk}).n + ' acabou.'; },
    corrompeu: function(l){ return dn(l.d) + ' subiu para corrupção ' + l.corr + (l.why === 'emergencial' ? ': a emergencial se perdeu' : '') + '.'; },
    purificou: function(l){ return dn(l.d) + ' purificado: corrupção ' + l.de + ' → ' + l.para + '.'; },
    revanche: function(l){ return 'Revanche vencida em ' + dn(l.d) + ': a quebra foi desfeita.'; },
    sirene: function(l){ return 'A emergencial ' + l.n + ' se perdeu.'; },
    revelou: function(l){ return 'Ao entrar em ' + l.n + ', o Corrompido mostrou: ' + (CY.MODMAP[l.mod] || {n: l.mod}).n + '.'; },
    forja: function(l){ return 'Forja: ' + mn(l.mat) + ' em ' + l.n + '.'; },
    receita: function(l){ return 'Forja: ' + l.msg; },
    resgate: function(l){ return l.cat === 'tempo' ? 'Vale de Tempo resgatado: ' + l.o + '.' : 'Vale resgatado: ' + l.o + ' (' + money(l.v) + ' do Fundo).'; },
    'vale-gem': function(l){ return 'Um vale virou ' + l.gem + ' ◆.'; },
    'eco-inv': function(l){ return 'Você invocou o Eco ' + l.n + '.'; },
    'eco-asc': function(l){ return 'O Eco ' + l.n + ' ascendeu em ' + dn(l.d) + '.'; },
    'eco-junta': function(l){ return 'Dois Ecos viraram um: ' + l.n + '.'; },
    'eco-apos': function(l){ return 'O Eco ' + l.n + ' se aposentou e deixou Poeira.'; },
    carimbo: function(l){ return 'Carimbo de Prazo em ' + l.n + ': +24 h.'; },
    anistia: function(l){ return 'Anistia do Sistema: o que aconteceu na Cidade de ' + dd(l.de) + ' a ' + dd(l.ate) + ' foi perdoado' + (l.corr ? ', a corrupção voltou' : '') + (l.mald ? ', as maldições acabaram' : '') + '.'; }
  });

  /* ---------- itens novos no drop ---------- */
  var oldItem = App.cyItem;
  App.cyItem = function(it){
    if (it.k === 'reliq') return {ic: 'crown', t: (it.got || 'Relíquia · ' + it.slot) + (it.uni ? ' · única' : ''), s: it.virou ? 'Relíquias cheias: virou materiais' : 'Relíquia ' + rn(it.rar) + ' · ' + it.slot};
    if (it.k === 'cosm') { var c = (it.kind === 'namecards' ? SYS.NAMECARDS : SYS.FRAMES).filter(function(x){ return x.id === it.id; })[0]; return {ic: 'sparkle', t: c ? c.n : it.id, s: it.kind === 'namecards' ? 'namecard do perfil' : 'moldura do perfil'}; }
    if (it.k === 'titulo') { var t = CY.TITMAP[it.id]; return {ic: 'banner', t: 'Título · ' + (t ? t.n : it.id), s: 'equipe na Sala de Troféus'}; }
    if (it.k === 'perg' && it.tipo === 'inimigo') return {ic: 'scroll', t: CY.PERG.inimigo + ' · ' + it.rank, s: 'abre um portal do Caminho mais parado, com drop dobrado'};
    return oldItem(it);
  };
  var oldDrop = App.M.cyDrop;
  App.M.cyDrop = function(m){
    var h = oldDrop(m), u = C().ult; if (!h || !u) return h;
    var n = [];
    if (u.res.dobro) n.push('<span class="chip glow">drop dobrado · Inimigo Íntimo</span>');
    if (u.res.maoVazia) n.push('<span class="chip bad">Mão Vazia: ◆ pela metade</span>');
    if ((u.res.gar.extra || []).length) n.push('<span class="chip warn">+1 par de caixas da Contenção</span>');
    if (u.contido) n.push('<span class="chip ok">Contenção: −1 nível de corrupção</span>');
    if (u.revanche) n.push('<span class="chip ok">Revanche: a quebra foi desfeita</span>');
    return n.length ? h.replace('<div class="cy-cards">', '<div class="row" style="gap:6px">' + n.join('') + '</div><div class="cy-cards">') : h;
  };

  /* ---------- Janela do Caçador: as 4 janelas novas ---------- */
  App.cyHubTiles = function(){
    var c = C(), A = E.cyEcos(c), R = c.rel || [], eq = Object.keys(E.cyEquipped(c)).length, f = c.fundo || {}, I = E.cyInv(c);
    var t = CY.TITULOS.filter(function(x){ var T = E.TITLEMAP && E.TITLEMAP[x.id]; return T && E.titleUnlocked(App.S, App.D, T); }).length;
    return [
      ['arsenal', 'star', 'Arsenal', A.length ? A.length + (A.length === 1 ? ' Eco ativo' : ' Ecos ativos') : 'nenhum Eco ainda'],
      ['reliq', 'crown', 'Relíquias', R.length ? R.length + (R.length === 1 ? ' guardada' : ' guardadas') + ' · ' + eq + ' no avatar' : 'nenhuma ainda'],
      ['fundo', 'cert', 'Fundo e vales', money(f.saldo || 0) + ' no Fundo · ' + I.vales.length + (I.vales.length === 1 ? ' vale' : ' vales')],
      ['trof', 'medal', 'Sala de Troféus', t + (t === 1 ? ' título da Cidade' : ' títulos da Cidade')]
    ];
  };

  /* ---------- inventário com uso ---------- */
  App.cyInvCount = function(){
    var c = C(), I = E.cyInv(c), n = I.caixas.length + I.vales.length + I.perg.length + I.passe.length + (c.rel || []).length + (c.ecos || []).length;
    Object.keys(I.mat).forEach(function(k){ n += I.mat[k] || 0; }); Object.keys(I.frag).forEach(function(k){ n += I.frag[k] || 0; });
    return n;
  };
  function distSel(c, list, attrs, ph){ return '<select class="cy-sel"' + attrs + '><option value="">' + ph + '</option>' + list.map(function(d){ var x = E.cityDist(c, d.id).corr || 0; return '<option value="' + d.id + '">' + U.esc(d.n) + (x ? ' · corrupção ' + x : '') + '</option>'; }).join('') + '</select>'; }
  function matAct(c, k){
    if (k === 'purif' || k === 'purif1') { var cor = CY.DIST.filter(function(d){ return E.cityDist(c, d.id).corr > 0; }); return cor.length ? distSel(c, cor, ' data-c="cyPurif" data-m="' + k + '" aria-label="Purificar um bairro"', 'Usar em…') : '<span class="faint" style="font-size:12px">nenhum bairro corrompido</span>'; }
    if (k === 'bussola') return c.bussola ? '<span class="chip">próximo: ' + U.esc(dn(c.bussola)) + '</span>' : distSel(c, CY.DIST, ' data-c="cyBuss" aria-label="Escolher o bairro do próximo portal"', 'Apontar para…');
    if (CY.MAT_PORTAL.indexOf(k) >= 0) return '<span class="faint" style="font-size:12px">na ficha de um portal</span>';
    if (k === 'fio') return btn('cyWin', 'Relíquias', ' data-w="reliq"', 'ghost');
    if (k === 'poeira') return btn('cyWin', 'Arsenal', ' data-w="arsenal"', 'ghost');
    if (k === 'escoria') return btn('cyWin', 'Forja', ' data-w="forja"', 'ghost');
    return '';
  }
  function pergUse(x){
    if (x.tipo === 'inimigo') return 'abre um portal ' + x.rank + ' do Caminho ' + (x.way && App.way(x.way) ? App.way(x.way).name : 'mais parado') + ', com drop dobrado';
    if (x.tipo === 'permissao') return 'gasto sozinho quando você entra num portal dois ranks acima';
    return 'guardado: ganha uso com as Dungeons, as Raids e a história';
  }
  function valeN(v){ return v.cat === 'secreto' ? 'Vale Secreto' : 'Vale de ' + (CY.VALE_CAT[v.cat] || {n: v.cat}).n; }
  function valeT(v){ return '<span style="color:' + rc(v.r) + '">' + valeN(v) + '</span> · ' + (v.cat === 'tempo' ? CY.TEMPO[ri(v.r)] : 'até ' + money(v.teto)); }
  App.cyInvInner = function(){
    var c = C(), S = App.S, I = E.cyInv(c), K = S.owned.keys || {}, out = '<p class="dim" style="font-size:13.5px">Caixas, vales, materiais, pergaminhos e passes. Relíquias, Ecos e a Forja têm janela própria.</p>';
    var keys = RK.filter(function(r){ return K[r]; }).map(function(r){ return r + ' ×' + K[r]; }).join(' · ');
    if (keys) out += '<p style="font-size:13.5px">' + U.icon('lock') + ' Chaves de Dungeon: <b>' + keys + '</b> · <a href="#/portoes/dungeons">usar nas Dungeons</a></p>';
    if (I.caixas.length) out += sec('Caixas · sempre em par', I.caixas.map(function(x){ return row('box', 'Par ' + CY.CAIXA[x.grau] + (x.so ? ' · só a Amaldiçoada' : ''), (x.d ? U.esc(dn(x.d)) + ' · ' : '') + dd(x.at), btn('cyWin', 'Abrir', ' data-w="caixa" data-id="' + x.id + '"', 'primary')); }).join(''));
    if (I.vales.length) out += sec('Vales · ' + I.vales.length + ' de ' + CY.DROP.valeMax, I.vales.map(function(v){ var fech = v.cat === 'secreto' && !v.rev; return row('cert', valeT(v), rn(v.r) + (v.d ? ' · ' + U.esc(dn(v.d)) : '') + (fech ? ' · fechado' : ''), btn('cyWin', fech ? 'Abrir' : 'Resgatar', ' data-w="vale" data-id="' + v.id + '"')); }).join(''), '<button class="act" data-a="cyWin" data-w="fundo">Fundo: ' + money((c.fundo || {}).saldo || 0) + '</button>');
    var mats = Object.keys(I.mat).filter(function(k){ return I.mat[k] > 0; });
    if (mats.length) out += sec('Materiais', mats.map(function(k){ return row(k === 'dourada' ? 'lock' : 'sword', U.esc(mn(k)) + ' <span class="mono dim">×' + I.mat[k] + '</span>', U.esc((CY.ITENS[k] || {}).d || ''), matAct(c, k)); }).join(''), '<button class="act" data-a="cyWin" data-w="forja">Forja</button>');
    if (I.perg.length) out += sec('Pergaminhos', I.perg.map(function(x){ return row('scroll', U.esc((CY.PERG[x.tipo] || x.tipo) + ' · ' + x.rank), U.esc(pergUse(x)), x.tipo === 'inimigo' ? btn('cyPerg', 'Usar', ' data-id="' + x.id + '"', 'primary') : ''); }).join(''));
    if (I.passe.length) out += sec('Passes de vertente', I.passe.map(function(x){ var d = CY.DMAP[x.d] || {ruas: []}; return row('map', 'Passe · ' + U.esc(d.ruas[x.rua] || ''), U.esc(dn(x.d)) + ': um portal extra desta vertente, fora do limite', btn('cyPasse', 'Usar', ' data-id="' + x.id + '"', 'primary')); }).join(''));
    var fr = Object.keys(I.frag).filter(function(d){ return I.frag[d] > 0; });
    if (fr.length) out += sec('Fragmentos', fr.map(function(d){ var ok = I.frag[d] >= CY.FORJA.frag; return row('sparkle', 'Fragmentos · ' + U.esc(dn(d)) + ' <span class="mono dim">' + I.frag[d] + '/' + CY.FORJA.frag + '</span>', ok ? 'já dá para forjar o cosmético do bairro' : 'com ' + CY.FORJA.frag + ', a Forja faz um cosmético do bairro', ok ? btn('cyWin', 'Forja', ' data-w="forja"') : ''); }).join(''));
    if (!I.caixas.length && !I.vales.length && !mats.length && !I.perg.length && !I.passe.length && !fr.length) out += '<p class="dim" style="font-size:14px">Vazio. Os drops dos portais aparecem aqui.</p>';
    return out + '<div class="row" style="gap:8px">' + btn('cyWin', U.icon('crown') + 'Relíquias · ' + (c.rel || []).length, ' data-w="reliq"') + btn('cyWin', U.icon('star') + 'Arsenal · ' + E.cyEcos(c).length, ' data-w="arsenal"') + btn('cyWin', U.icon('anvil') + 'Forja', ' data-w="forja"') + '</div>';
  };
  App.CYW.inv = function(){ return {ic: 'bag', sup: 'Janela do Caçador', t: 'Inventário', b: App.cyInvInner(), cls: 'wide'}; };
  function abriu(p, msg){
    if (!p) { App.toast({t: 'Não deu', s: 'Nenhum modelo de portal cabe aqui agora. O item continua guardado.', ic: 'alert'}); return; }
    App.commit(['city']);
    App.toast({t: msg, s: p.n + ' · ' + dn(p.d), ic: 'gate'});
    App.cyWinOpen({t: 'portal', id: p.id});
  }
  App.A.cyPerg = function(el){ abriu(E.cyPergUsar(C(), App.S, el.getAttribute('data-id')), 'O pergaminho abriu um portal'); };
  App.A.cyPasse = function(el){ abriu(E.cyPasseUsar(C(), App.S, el.getAttribute('data-id')), 'O passe abriu um portal extra'); };
  App.C.cyPurif = function(el){
    var d = el.value; if (!d) return; el.blur();
    var n = E.cyPurificar(C(), d, el.getAttribute('data-m')); if (!n) return;
    App.commit(['city']); App.toast({t: dn(d) + ' purificado', s: E.cityDist(C(), d).corr ? 'Menos ' + n + ' nível de corrupção.' : 'O bairro está limpo.', ic: 'sparkle'});
  };
  App.C.cyBuss = function(el){ var d = el.value; if (!d) return; el.blur(); if (!E.cyBussola(C(), d)) return; App.commit(['city']); App.toast({t: 'Bússola apontada', s: 'O próximo portal que nascer vem de ' + dn(d) + '.', ic: 'compass'}); };

  /* ---------- o par de caixas ---------- */
  App.CYW.caixa = function(w){
    var c = C(), box = E.cyInv(c).caixas.filter(function(b){ return b.id === w.id; })[0], r = w.res;
    if (r) {
      var o = App.cyItem(r.it), ab = r.qual === 'ab', cor = ab ? '#ffd166' : 'var(--cy-red)';
      var b = '<div class="cy-cxres"><div class="cy-card on" style="--rc:' + cor + '"><span class="cy-card-r">' + (ab ? 'Abençoada' : 'Amaldiçoada') + ' · ' + CY.CAIXA[r.grau] + '</span>' + U.icon(o.ic) + '<b>' + U.esc(r.t) + '</b><span>' + U.esc(r.why ? 'Porque ' + r.why + '.' : o.s) + '</span></div>'
        + (r.sussurro ? '<p class="cy-sus">A outra caixa sussurra: <i>' + U.esc(r.sussurro) + '</i></p>' : '') + '</div>';
      if (r.mald) b += maldBox(r.mald, true);
      b += '<div class="row" style="justify-content:flex-end;gap:8px">' + (r.it.k === 'perg' || r.it.k === 'mat' ? btn('cyWin', 'Ver no inventário', ' data-w="inv"') : '') + btn('cyWinBack', 'Pronto', '', 'primary') + '</div>';
      return {ic: 'box', sup: 'Par ' + CY.CAIXA[r.grau], t: ab ? 'Você abriu a Abençoada' : 'Você abriu a Amaldiçoada', b: b, wc: cor};
    }
    if (!box) return {ic: 'box', sup: 'Caixa', t: 'Par aberto', b: '<p class="dim">Este par já foi aberto.</p>', cls: 'narrow'};
    var so = !!box.so, wish = (c.wish || []).length;
    var b2 = '<p class="dim" style="font-size:13.5px">Um par, uma escolha. A que você não abrir some, mas sussurra o que tinha.</p><div class="cy-cx">'
      + '<button class="cy-cxb ab"' + (so ? ' disabled aria-disabled="true"' : ' data-a="cyCx" data-q="ab" data-id="' + box.id + '"') + '><span class="cy-cxi">' + U.icon('box') + '</span><b>Abençoada</b><span>' + (so ? 'não veio: o portal era Corrompido' : wish ? 'um item da sua Lista de Desejos, até o grau ' + CY.CAIXA[box.grau] : 'Lista de Desejos vazia: vêm ◆') + '</span></button>'
      + '<button class="cy-cxb am" data-a="cyCx" data-q="am" data-id="' + box.id + '"><span class="cy-cxi">' + U.icon('skull') + '</span><b>Amaldiçoada</b><span>o que o Sistema acha que você precisa, e uma de ' + CY.MALD.length + ' maldições</span></button></div>'
      + '<div class="row between"><button class="act" data-a="cyWin" data-w="fundo" data-tab="desejos">Editar a Lista de Desejos</button><span class="faint" style="font-size:12px">A maldição dura até cumprir, no máximo ' + CY.MALD_MAX + ' dias.</span></div>';
    return {ic: 'box', sup: 'Caixa · par ' + CY.CAIXA[box.grau], t: 'Abençoada ou Amaldiçoada', b: b2, cls: 'wide'};
  };
  App.A.cyCx = function(el){
    var w = App.cyWinTop(), r = E.cyCaixaAbrir(C(), App.S, el.getAttribute('data-id'), el.getAttribute('data-q'));
    if (!r.ok) { App.toast({t: 'Caixa', s: r.msg, ic: 'alert'}); return; }
    if (w && w.t === 'caixa') w.res = r;
    App.commit(r.core ? ['city', 'core'] : ['city']);
  };

  /* ---------- vale ---------- */
  App.CYW.vale = function(w){
    var c = C(), v = E.cyVale(c, w.id), f = c.fundo || {};
    if (!v) return {ic: 'cert', sup: 'Vale', t: 'Vale usado', b: '<p class="dim">Este vale não está mais no inventário.</p>', cls: 'narrow'};
    var tempo = v.cat === 'tempo', lib = E.cyValeLiberado(App.S), id = v.id, gem = CY.DROP.valeGem[ri(v.r)] || 0;
    var b = '<div class="row" style="gap:6px"><span class="chip" style="color:' + rc(v.r) + '">' + rn(v.r) + '</span><span class="chip">' + (tempo ? CY.TEMPO[ri(v.r)] : 'teto ' + money(v.teto)) + '</span>' + (v.d ? '<span class="chip">' + U.esc(dn(v.d)) + '</span>' : '') + (v.consol ? '<span class="chip">consolidado</span>' : '') + '</div>'
      + '<p style="font-size:14px">Cobre: ' + U.esc(CY.VALE_COBRE[v.cat] || '') + '.</p>';
    if (v.cat === 'secreto' && !v.rev) {
      b += '<div class="callout">' + U.icon('eye') + ' O Vale Secreto sorteia um desejo da sua Lista Secreta que caiba no teto. Se nenhum couber, vira vale de Lazer.</div>'
        + '<div class="row" style="justify-content:flex-end">' + btn('cyValeOpen', U.icon('eye') + 'Abrir o Vale Secreto', ' data-id="' + id + '"', 'primary') + '</div>';
      return {ic: 'cert', sup: 'Vale Secreto', t: 'Fechado · até ' + money(v.teto), b: b, wc: rc(v.r), cls: 'narrow'};
    }
    if (v.rev) b += '<div class="callout gate">O Sistema sorteou da Lista Secreta: <b>' + U.esc(v.rev.n) + '</b> (' + money(v.rev.preco) + ').</div>';
    if (!tempo) b += '<p class="mono" style="font-size:12.5px">Fundo: <b>' + money(f.saldo || 0) + '</b> · enche ' + money(E.cyFundoMensal(c)) + ' por mês</p>';
    if (!lib) b += '<div class="callout fail">' + U.icon('lock') + ' Prenda aberta na Zona: o resgate fica congelado até ela sair, como nas lojas.</div>';
    b += '<label class="fld">' + (tempo ? 'O que você vai fazer com o tempo' : 'O que você comprou') + '<input type="text" data-i="cyF" data-f="vo_' + id + '" value="' + U.esc(fv('vo_' + id) || (v.rev ? v.rev.n : '')) + '" maxlength="120"></label>';
    if (!tempo) b += '<label class="fld">Quanto custou (R$)<input type="text" inputmode="decimal" data-i="cyF" data-f="vc_' + id + '" value="' + U.esc(fv('vc_' + id)) + '" placeholder="0,00"></label>'
      + '<label class="check"><input type="checkbox" data-c="cyFc" data-f="vr_' + id + '"' + (F()['vr_' + id] ? ' checked' : '') + '><span>Guardar como Relíquia de origem (vai para a Sala de Troféus)</span></label>';
    b += errHTML('v' + id) + '<div class="row" style="justify-content:flex-end;gap:8px">' + btn('cyValeGem', 'Virar ' + gem + ' ◆', ' data-id="' + id + '"', 'ghost') + btn('cyResg', U.icon('check') + 'Resgatar', ' data-id="' + id + '"' + (lib ? '' : ' disabled'), 'primary') + '</div>'
      + '<p class="faint" style="font-size:12px">Vale nunca vira dívida: passou do teto ou do saldo, não resgata. Virar ◆ é na hora.</p>';
    return {ic: 'cert', sup: valeN(v), t: tempo ? CY.TEMPO[ri(v.r)] : 'até ' + money(v.teto), b: b, wc: rc(v.r), cls: 'narrow'};
  };
  App.A.cyResg = function(el){
    var id = el.getAttribute('data-id'), v = E.cyVale(C(), id), o = {oque: fv('vo_' + id) || (v && v.rev ? v.rev.n : ''), custo: num(fv('vc_' + id)), origem: !!F()['vr_' + id]};
    var r = E.cyResgatar(C(), App.S, id, o);
    if (!r.ok) { err('v' + id, r.msg); return; }
    delete F()['vo_' + id]; delete F()['vc_' + id]; delete F()['vr_' + id]; err('v' + id, '');
    tirar('vale', id); App.commit(['city']);
    App.toast({t: 'Vale resgatado', s: r.v ? money(r.v) + ' saíram do Fundo.' + (r.rel ? ' A Relíquia de origem foi para a Sala de Troféus.' : '') : 'Tempo livre, sem culpa.', ic: 'cert', ms: 6000});
  };
  App.A.cyValeGem = function(el){ var id = el.getAttribute('data-id'), g = E.cyValeGem(C(), id); if (!g) return; tirar('vale', id); App.commit(['city']); App.toast({t: '+' + g + ' ◆', s: 'O vale virou cristais.', ic: 'gem'}); };
  App.A.cyValeOpen = function(el){
    var r = E.cyValeAbrir(C(), el.getAttribute('data-id')); if (!r) return;
    App.commit(['city']);
    App.toast(r.lazer ? {t: 'Nenhum desejo coube no teto', s: 'O Vale Secreto virou vale de Lazer.', ic: 'cert'} : {t: 'O Vale Secreto abriu', s: r.rev.n, ic: 'eye'});
  };

  /* ---------- Fundo, Lista de Desejos e Lista Secreta ---------- */
  App.CYW.fundo = function(w){
    var c = C(), S = App.S, f = c.fundo || {}, tab = w.tab || 'fundo', L = E.cyLic(c), I = E.cyInv(c);
    var b = App.cyTabs(w, [['fundo', 'Fundo'], ['desejos', 'Desejos · ' + (c.wish || []).length + '/' + CY.CONF.desejos], ['secreta', 'Lista Secreta · ' + (c.secreta || []).length]]);
    if (tab === 'fundo') {
      var mens = E.cyFundoMensal(c), fixo = f.fixo != null;
      b += '<div class="cy-fundo"><span class="eyebrow">Saldo</span><b>' + money(f.saldo || 0) + '</b><span class="dim" style="font-size:13px">Enche ' + money(mens) + ' por mês (' + (fixo ? 'valor seu' : 'padrão da Licença ' + L.r) + '). A sobra passa adiante até ' + CY.FUNDO.meses + ' meses de Fundo.</span></div>'
        + '<div class="cy-forms"><div class="stack" style="gap:6px"><label class="fld">Valor mensal (R$)<input type="text" inputmode="decimal" data-i="cyF" data-f="fMes" value="' + U.esc(fv('fMes') || (fixo ? String(f.fixo) : '')) + '" placeholder="' + CY.FUNDO.porRank[L.r] + '"></label><div class="row" style="gap:6px">' + btn('cyFundoFixo', 'Salvar') + (fixo ? btn('cyFundoPadrao', 'Usar o padrão', '', 'ghost') : '') + '</div></div>'
        + '<div class="stack" style="gap:6px"><label class="fld">Depositar no Fundo (R$)<input type="text" inputmode="decimal" data-i="cyF" data-f="fDep" value="' + U.esc(fv('fDep')) + '" placeholder="0,00"></label><div class="row">' + btn('cyFundoDep', U.icon('plus') + 'Depositar') + '</div></div></div>'
        + '<p class="faint" style="font-size:12px">Depositar é dinheiro seu entrando no Fundo, sem mexer no valor mensal: é o Cofre.</p>' + errHTML('fundo');
      if (I.vales.length) b += sec('Vales no inventário', I.vales.map(function(v){ return row('cert', valeT(v), rn(v.r), btn('cyWin', 'Abrir', ' data-w="vale" data-id="' + v.id + '"')); }).join(''));
      var H2 = (f.hist || []).map(function(h){ return {at: h.at, t: (h.cat === 'tempo' ? (h.dur || 'tempo') + ': ' : '') + h.o, v: -(h.v || 0), tempo: h.cat === 'tempo'}; })
        .concat((f.dep || []).map(function(x){ return {at: x.at, t: 'Depósito', v: x.v}; })).sort(function(a, z){ return a.at < z.at ? 1 : a.at > z.at ? -1 : 0; }).slice(0, 12);
      b += sec('Histórico', H2.length ? '<div class="cy-hist">' + H2.map(function(h){ return '<div><span class="mono faint">' + dd(h.at) + '</span><span>' + U.esc(h.t) + '</span><b class="mono' + (h.v > 0 ? ' ok' : '') + '">' + (h.tempo ? 'tempo' : (h.v > 0 ? '+' : '−') + money(Math.abs(h.v))) + '</b></div>'; }).join('') + '</div>' : '<p class="dim" style="font-size:13.5px">Nada resgatado ainda.</p>');
    } else if (tab === 'desejos') {
      var W = (c.wish || []).map(function(k){ return E.cyDesejo(S, k); }).filter(Boolean), full = W.length >= CY.CONF.desejos;
      b += '<p class="dim" style="font-size:13.5px">Até ' + CY.CONF.desejos + ' desejos. A Abençoada entrega um deles quando o grau da caixa alcança o do desejo; com a lista vazia, ela vem com ◆.</p>';
      b += W.length ? '<div class="cy-wish">' + W.map(function(x){ var own = x.own && x.own(S); return row('star', U.esc(x.t), 'caixa ' + CY.CAIXA[CY.GRAUS[x.g]] + ' ou maior' + (own ? ' · você já tem' : ''), btn('cyWishDel', U.icon('close'), ' data-k="' + U.esc(x.key) + '" aria-label="Tirar da lista"', 'ghost')); }).join('') + '</div>' : '<p class="faint">Lista vazia.</p>';
      if (!full) {
        var grupos = {};
        E.cyDesejos(S).filter(function(x){ return (c.wish || []).indexOf(x.key) < 0 && !(x.own && x.own(S)); }).forEach(function(x){ (grupos[x.grupo] = grupos[x.grupo] || []).push(x); });
        b += '<label class="fld">Acrescentar<select class="cy-sel" data-c="cyWishAdd"><option value="">Escolha um desejo…</option>' + Object.keys(grupos).map(function(g){ return '<optgroup label="' + U.esc(g) + '">' + grupos[g].map(function(x){ return '<option value="' + U.esc(x.key) + '">' + U.esc(x.t) + ' · ' + CY.CAIXA[CY.GRAUS[x.g]] + '</option>'; }).join('') + '</optgroup>'; }).join('') + '</select></label>';
      }
    } else {
      var L2 = c.secreta || [], show = !!App.ui.cySecShow, cheia = L2.length >= CY.SECRETA_MAX;
      b += '<p class="dim" style="font-size:13.5px">Escreva e esqueça: até ' + CY.SECRETA_MAX + ' desejos, guardados embaralhados. O Vale Secreto sorteia um que caiba no teto dele.</p>'
        + '<div class="cy-forms"><label class="fld">Desejo<input type="text" data-i="cyF" data-f="sN" value="' + U.esc(fv('sN')) + '" maxlength="80" placeholder="um disco, um curso, um jantar…"></label><label class="fld">Preço (R$)<input type="text" inputmode="decimal" data-i="cyF" data-f="sP" value="' + U.esc(fv('sP')) + '" placeholder="0,00"></label></div>'
        + '<div class="row">' + btn('cySecAdd', U.icon('plus') + 'Guardar', cheia ? ' disabled' : '') + '</div>' + errHTML('sec')
        + '<div class="row between"><span class="mono" style="font-size:12.5px">' + L2.length + ' de ' + CY.SECRETA_MAX + ' guardados</span>' + (L2.length ? '<button class="act" data-a="cySecShow">' + (show ? 'Esconder' : 'Mostrar a lista') + '</button>' : '') + '</div>';
      if (L2.length) b += '<div class="cy-wish">' + L2.map(function(x){ return row(show ? 'eye' : 'lock', show ? U.esc(x.n) : '••••••••', show ? money(x.preco) : 'R$ ••', show ? btn('cySecDel', U.icon('close'), ' data-id="' + x.id + '" aria-label="Tirar da lista"', 'ghost') : ''); }).join('') + '</div>';
    }
    return {ic: 'cert', sup: 'Recompensas reais', t: 'Fundo e vales', b: b, cls: 'wide'};
  };
  App.A.cyFundoFixo = function(){
    var v = fv('fMes'); if (String(v).trim() === '') { err('fundo', 'Escreva o valor mensal.'); return; }
    E.cyFundoFixo(C(), num(v)); delete F().fMes; err('fundo', '');
    App.commit(['city']); App.toast({t: 'Fundo de Recompensas', s: 'Valor mensal: ' + money(E.cyFundoMensal(C())) + '.', ic: 'cert'});
  };
  App.A.cyFundoPadrao = function(){ E.cyFundoFixo(C(), ''); delete F().fMes; App.commit(['city']); };
  App.A.cyFundoDep = function(){
    var v = num(fv('fDep')); if (!E.cyFundoDeposito(C(), v)) { err('fundo', 'Escreva quanto vai depositar.'); return; }
    delete F().fDep; err('fundo', ''); App.commit(['city']); App.toast({t: 'Depósito no Fundo', s: '+' + money(v) + '.', ic: 'cert'});
  };
  App.C.cyWishAdd = function(el){ var k = el.value, c = C(); if (!k) return; el.blur(); E.cyWishSet(c, (c.wish || []).concat([k])); App.commit(['city']); };
  App.A.cyWishDel = function(el){ var c = C(), k = el.getAttribute('data-k'); E.cyWishSet(c, (c.wish || []).filter(function(x){ return x !== k; })); App.commit(['city']); };
  App.A.cySecAdd = function(){
    if (!E.cySecretaAdd(C(), fv('sN'), num(fv('sP')))) { err('sec', (C().secreta || []).length >= CY.SECRETA_MAX ? 'A lista está cheia.' : 'Escreva o desejo e o preço.'); return; }
    delete F().sN; delete F().sP; err('sec', ''); App.commit(['city']); App.toast({t: 'Guardado na Lista Secreta', s: 'Agora esqueça.', ic: 'lock'});
  };
  App.A.cySecDel = function(el){ var c = C(), id = el.getAttribute('data-id'); c.secreta = (c.secreta || []).filter(function(x){ return x.id !== id; }); App.commit(['city']); };
  App.A.cySecShow = function(){ App.ui.cySecShow = !App.ui.cySecShow; App.cyWinRender(); };

  /* ---------- Arsenal dos Ecos ---------- */
  function ecoCard(c, e, po){
    var d = CY.DMAP[e.d] || {ruas: []}, part = e.st === 'partido', nv = e.nv || 1, conf = App.ui.cyConf === 'apos:' + e.id;
    var mates = E.cyEcos(c).filter(function(x){ return x.id !== e.id && x.d === e.d && x.rua === e.rua; });
    var link = e.link ? (/^https?:\/\//.test(e.link) ? '<a href="' + U.esc(e.link) + '" target="_blank" rel="noopener">' + U.esc(e.link.replace(/^https?:\/\//, '').slice(0, 48)) + '</a>' : U.esc(e.link)) : '';
    var h = '<div class="cy-eco' + (part ? ' part' : '') + '" style="--rc:' + rc(e.r) + '"><div class="row between" style="gap:8px;flex-wrap:nowrap"><span class="stack" style="gap:2px;min-width:0"><b>' + U.esc(e.n) + '</b><span class="faint" style="font-size:12px">' + U.esc(e.tipo || 'texto') + ' · ' + U.esc(d.ruas[e.rua] || '') + ' · ' + rn(e.r) + (e.usos ? ' · ' + e.usos + (e.usos === 1 ? ' uso' : ' usos') : '') + '</span></span>'
      + '<span class="cy-pips" role="img" aria-label="Nível ' + nv + ' de ' + CY.ECO.nvMax + '">' + [1, 2, 3, 4, 5].map(function(i){ return '<i' + (i <= nv ? ' class="on"' : '') + '></i>'; }).join('') + '</span></div>'
      + (link ? '<span style="font-size:12.5px">' + U.icon('ext') + ' ' + link + '</span>' : '');
    if (part) return h + '<span class="bad" style="font-size:12.5px">Partido: o portal quebrou. Feche a Revanche ou faça um Remendo na Forja (' + CY.FORJA.remendo + ' Poeiras).</span></div>';
    h += (e.asc ? '<span><span class="chip glow">ascendido em ' + dd(e.asc) + '</span></span>' : '') + '<div class="row" style="gap:6px">'
      + (po > 0 && nv < CY.ECO.nvMax ? btn('cyEcoPo', U.icon('plus') + '1 nível (Poeira)', ' data-id="' + e.id + '"') : '')
      + (mates.length ? sel('ej_' + e.id, mates.map(function(x){ return [x.id, x.n + ' (nv ' + (x.nv || 1) + ')']; }), 'Juntar com…', ' aria-label="Juntar com outro Eco"') + (fv('ej_' + e.id) ? btn('cyEcoJunta', 'Juntar', ' data-id="' + e.id + '"', 'primary') : '') : '')
      + btn('cyEcoApos', conf ? 'Confirmar: aposentar' : 'Aposentar (+1 Poeira)', ' data-id="' + e.id + '"', conf ? 'danger' : 'ghost') + '</div>';
    return h + '</div>';
  }
  App.CYW.arsenal = function(){
    var c = C(), I = E.cyInv(c), A = c.ecos || [], po = I.mat.poeira || 0, part = E.cyEcos(c, 'partido').length;
    var b = '<p class="dim" style="font-size:13.5px">Cada Eco ativo dá +' + CY.ECO.bonus + '% de XP e de Q nos portais da mesma vertente (até +' + CY.ECO.bonusMax + '%). Invocar num portal sobe 1 nível; no nível ' + CY.ECO.nvMax + ' o Eco ascende e dá +' + CY.ECO.ascR + '% de R no bairro.</p>'
      + '<div class="row" style="gap:6px"><span class="chip">' + E.cyEcos(c).length + ' ativos</span>' + (part ? '<span class="chip bad">' + part + (part === 1 ? ' partido' : ' partidos') + '</span>' : '') + '<span class="chip">' + U.icon('sparkle') + po + (po === 1 ? ' Poeira' : ' Poeiras') + ' de Eco</span></div>';
    if (!A.length) b += '<p class="dim">Nenhum Eco ainda. Ecos nascem quando você fecha um portal C ou maior e registra o que ficou de reutilizável.</p>';
    CY.DIST.forEach(function(d){
      var L = A.filter(function(e){ return e.d === d.id; }); if (!L.length) return;
      var bon = d.ruas.map(function(r, i){ var n = E.cyEcos(c).filter(function(e){ return e.d === d.id && e.rua === i; }).length; return n ? r + ' +' + Math.min(CY.ECO.bonusMax, n * CY.ECO.bonus) + '%' : ''; }).filter(Boolean).join(' · ');
      b += sec(U.esc(d.n), L.map(function(e){ return ecoCard(c, e, po); }).join(''), bon ? '<span class="faint mono" style="font-size:11.5px">' + U.esc(bon) + '</span>' : '');
    });
    return {ic: 'star', sup: 'Ecos', t: 'Arsenal', b: b, cls: 'wide'};
  };
  App.A.cyEcoPo = function(el){ if (E.cyEcoPoeira(C(), el.getAttribute('data-id'))) App.commit(['city']); };
  App.A.cyEcoJunta = function(el){
    var a = el.getAttribute('data-id'), b = fv('ej_' + a); if (!b) return;
    delete F()['ej_' + a];
    if (E.cyEcoJuntar(C(), a, b)) { App.commit(['city']); App.toast({t: 'Ecos juntos', s: 'Os níveis somaram; o outro Eco foi absorvido.', ic: 'star'}); }
  };
  App.A.cyEcoApos = function(el){
    var id = el.getAttribute('data-id');
    if (App.ui.cyConf !== 'apos:' + id) { App.ui.cyConf = 'apos:' + id; App.cyWinRender(); return; }
    App.ui.cyConf = null;
    if (E.cyEcoAposentar(C(), id)) { App.commit(['city']); App.toast({t: 'Eco aposentado', s: '+1 Poeira de Eco.', ic: 'sparkle'}); }
  };

  /* ---------- Relíquias: avatar com 5 espaços ---------- */
  var FUT = {raid: 'chega com as Raids', chefe: 'chega com os chefes A e S', misterio5: 'chega com O Mistério das 3h33', misterio: 'chega com O Mistério das 3h33'};
  App.cyAvatarHTML = function(small){
    var eq = E.cyEquipped(C()), ph = App.img('eu-perfil');
    return '<div class="cy-ava' + (small ? ' sm' : '') + '">' + (ph ? '<img class="cy-ava-ph" src="' + ph + '" alt="" draggable="false">' : '<span class="cy-ava-ph cy-noimg">' + U.icon('user') + '</span>')
      + SLOTS.map(function(s, i){ var x = eq[s]; return '<div class="cy-slot s' + i + (x ? ' on v' + (x.v || 0) : '') + '" style="--rc:' + (x ? rc(x.r) : 'var(--line2)') + '" title="' + U.esc(s + ': ' + (x ? x.n : 'vazio')) + '">' + relIc(s) + '<span>' + U.esc(x ? x.n : s) + '</span></div>'; }).join('') + '</div>';
  };
  function relRow(c, fio, x){
    var on = !!x.slot && (c.eq || {})[x.slot] === x.id;
    return '<div class="cy-rel' + (on ? ' on' : '') + '" style="--rc:' + rc(x.r) + '"><span class="cy-rel-ic v' + (x.v || 0) + '">' + relIc(x.slot || 'Amuleto') + '</span><span class="stack" style="gap:2px;min-width:0"><b>' + U.esc(x.n) + (x.uni ? ' <span class="chip glow">única</span>' : '') + '</b>'
      + '<span class="faint" style="font-size:12px">' + rn(x.r) + (x.d ? ' · ' + U.esc(dn(x.d)) : '') + ' · ' + dd(x.at) + (x.v ? ' · ' + CY.RELIQ.variantes[x.v] : '') + '</span><i class="dim" style="font-size:12.5px">' + U.esc(x.lore || '') + '</i></span>'
      + '<span class="stack" style="gap:4px;align-items:flex-end">' + (x.slot ? btn('cyEquip', on ? 'Tirar' : 'Equipar', ' data-id="' + x.id + '"', on ? '' : 'primary') : '<span class="chip">origem</span>') + (fio && x.slot ? btn('cyFio', 'Fio de Ouro', ' data-id="' + x.id + '"', 'ghost') : '') + '</span></div>';
  }
  App.CYW.reliq = function(w){
    var c = C(), R = c.rel || [], fio = E.cyInv(c).mat.fio || 0, tab = w.tab || 'todas', nu = R.filter(function(x){ return x.uni; }).length;
    var b = App.cyTabs(w, [['todas', 'Relíquias · ' + R.length], ['unicas', 'Únicas · ' + nu + '/' + CY.RELIQ.unicas.length]]);
    if (tab === 'todas') {
      b += App.cyAvatarHTML() + '<p class="faint" style="font-size:12.5px">Uma por espaço. Lendária equipada toca um acorde quando o Perfil abre; mítica muda um detalhe do mapa.' + (fio ? ' Fio de Ouro: ' + fio + '.' : '') + '</p>';
      if (!R.length) b += '<p class="dim">Nenhuma Relíquia ainda. Elas caem nas rolagens dos portais, mais de C para cima.</p>';
      SLOTS.forEach(function(s){ var L = R.filter(function(x){ return x.slot === s; }).sort(function(a, z){ return ri(z.r) - ri(a.r); }); if (L.length) b += sec(s, L.map(function(x){ return relRow(c, fio, x); }).join('')); });
      var O = R.filter(function(x){ return !x.slot; });
      if (O.length) b += sec('De origem', O.map(function(x){ return relRow(c, 0, x); }).join(''));
    } else b += '<div class="cy-unis">' + CY.RELIQ.unicas.map(function(u){
        var x = R.filter(function(r){ return r.uni === u.id; })[0];
        return '<div class="cy-uni' + (x ? ' on' : '') + '" style="--rc:' + rc(u.r) + '">' + (x ? relIc(u.slot) : U.icon('lock')) + '<b>' + (x ? U.esc(u.n) : '???') + '</b><span>' + U.esc(x ? u.look : u.onde) + '</span><span class="faint mono" style="font-size:11px">' + rn(u.r) + ' · ' + u.slot + (x ? ' · ' + dd(x.at) : FUT[u.ctx] ? ' · ' + FUT[u.ctx] : '') + '</span></div>';
      }).join('') + '</div>';
    return {ic: 'crown', sup: 'Avatar', t: 'Relíquias', b: b, cls: 'wide'};
  };
  App.A.cyEquip = function(el){ if (E.cyEquip(C(), el.getAttribute('data-id'))) App.commit(['city']); };
  App.A.cyFio = function(el){ if (E.cyFio(C(), el.getAttribute('data-id'))) { App.commit(['city']); App.toast({t: 'Fio de Ouro', s: 'A Relíquia trocou de variante.', ic: 'sparkle'}); } };
  /* lendária ou mítica equipada: um acorde curto quando o Perfil abre */
  var AC = null;
  App.cyChime = function(){
    var eq = E.cyEquipped(C()); if (!Object.keys(eq).some(function(s){ return ri(eq[s].r) >= 4; })) return false;
    try {
      var K = window.AudioContext || window.webkitAudioContext; if (!K) return false;
      AC = AC || new K(); var t = AC.currentTime + 0.02;
      [659.25, 830.61, 987.77, 1318.51].forEach(function(f, i){
        var o = AC.createOscillator(), g = AC.createGain(), t0 = t + i * 0.09;
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
        o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + 1);
      });
      App.ui.cyChimed = (App.ui.cyChimed || 0) + 1;
      return true;
    } catch(e){ return false; }
  };
  var oldPerfil = App.CYW.perfil;
  App.CYW.perfil = function(w, depth){
    var o = oldPerfil(w, depth);
    o.b += '<section class="win flat"><div class="win-h">' + U.icon('crown') + 'Relíquias equipadas<button class="act" data-a="cyWin" data-w="reliq">abrir</button></div>' + App.cyAvatarHTML(true) + '</section>';
    if (!w.som) { w.som = 1; App.cyChime(); }
    return o;
  };

  /* ---------- Sala de Troféus ---------- */
  function trofDate(c, id){ var x = (c.trof || []).filter(function(t){ return t.k === 'titulo' && t.id === id; })[0]; return x ? x.at : ''; }
  App.CYW.trof = function(w){
    var c = C(), S = App.S, tab = w.tab || 'titulos';
    var b = App.cyTabs(w, [['titulos', 'Títulos'], ['reliq', 'Relíquias'], ['cenas', 'Retratos e cenas']]);
    if (tab === 'titulos') {
      b += '<p class="dim" style="font-size:13.5px">Um título equipado por vez: aparece no Perfil e no topo da Cidade.</p><div class="cy-tits">' + CY.TITULOS.map(function(t){
        var T = E.TITLEMAP && E.TITLEMAP[t.id], ok = !!(T && E.titleUnlocked(S, App.D, T)), when = t.lic ? trofDate(c, t.id) : (S.owned.cyt || {})[t.id], on = S.profile.title === t.id;
        return '<div class="cy-tit' + (ok ? '' : ' off') + (on ? ' on' : '') + '" style="--rc:' + rc(t.r) + '">' + U.icon(ok ? 'banner' : 'lock') + '<span class="stack" style="gap:2px;min-width:0"><b>' + (ok ? U.esc(t.n) : '???') + '</b><span class="faint" style="font-size:12px">' + rn(t.r) + ' · ' + (t.lic ? 'Licença ' + t.lic : 'Abençoada · ' + U.esc(dn(t.d))) + (ok && when ? ' · ' + dd(when) : '') + '</span></span>'
          + (ok ? btn('cyTitulo', on ? 'Tirar' : 'Equipar', ' data-id="' + t.id + '"', on ? '' : 'primary') : '') + '</div>';
      }).join('') + '</div><p class="faint" style="font-size:12.5px">Os outros títulos do Sistema seguem em <a href="#/titulos">Títulos</a>.</p>';
    } else if (tab === 'reliq') {
      var R = (c.rel || []).slice().sort(function(a, z){ return a.at < z.at ? 1 : a.at > z.at ? -1 : 0; });
      if (!R.length) b += '<p class="dim">Nenhuma Relíquia ainda.</p>';
      CY.DIST.concat([{id: '', n: 'Sem bairro'}]).forEach(function(d){
        var L = R.filter(function(x){ return (x.d || '') === d.id; }); if (!L.length) return;
        b += sec(U.esc(d.n), L.map(function(x){ return row('crown', '<span style="color:' + rc(x.r) + '">' + U.esc(x.n) + '</span>', dd(x.at) + ' · ' + U.esc(x.origem ? 'vale resgatado' : x.uni ? 'única' : x.fonte ? 'portal ' + x.fonte : 'drop')); }).join(''));
      });
    } else b += '<div class="cy-soon">' + U.icon('eye') + '<p class="dim">Retratos e cenas dos clãs chegam com as Facções e os Laços.</p></div>';
    return {ic: 'medal', sup: 'Janela do Caçador', t: 'Sala de Troféus', b: b, cls: 'wide'};
  };
  App.A.cyTitulo = function(el){ var id = el.getAttribute('data-id'), P = App.S.profile; P.title = P.title === id ? null : id; App.commit(['core']); };

  /* ---------- Forja ---------- */
  function recCard(c, S, I, K, r){
    var id = r.id, f = function(k){ return 'rc_' + id + '_' + k; }, ctl = '', conf = App.ui.cyConf === 'rec:' + id, have = '';
    if (id === 'chave') ctl = sel(f('rank'), ['E', 'D', 'C', 'B', 'A'].map(function(x){ return [x, x + ' → ' + RK[RK.indexOf(x) + 1] + ' (tem ' + (K[x] || 0) + ')', (K[x] || 0) < CY.FORJA.chave]; }), 'Rank…');
    else if (id === 'perg') { var g = {}; I.perg.forEach(function(x){ var k = x.tipo + '|' + x.rank; g[k] = (g[k] || 0) + 1; }); ctl = sel(f('g'), Object.keys(g).map(function(k){ var p = k.split('|'); return [k, (CY.PERG[p[0]] || p[0]) + ' · ' + p[1] + ' (' + g[k] + '/' + CY.FORJA.perg + ')', g[k] < CY.FORJA.perg]; }), 'Pergaminho…'); }
    else if (id === 'cosm') ctl = sel(f('cid'), CY.COSM.filter(function(x){ return x.d; }).map(function(x){ var own = (S.owned[x.kind] || []).indexOf(x.id) >= 0, n = I.frag[x.d] || 0; return [x.id, x.n + ' (' + n + '/' + CY.FORJA.frag + ')' + (own ? ' · já tem' : ''), own || n < CY.FORJA.frag]; }), 'Cosmético…');
    else if (id === 'vale') { var vs = I.vales.map(function(v){ return [v.id, (CY.VALE_CAT[v.cat] || {n: v.cat}).n + ' · ' + rn(v.r) + (v.cat === 'tempo' ? '' : ' · ' + money(v.teto))]; }); ctl = sel(f('a'), vs, '1º vale…') + sel(f('b'), vs, '2º vale…') + sel(f('cat'), Object.keys(CY.VALE_CAT).filter(function(k){ return k !== 'tempo'; }).map(function(k){ return [k, CY.VALE_CAT[k].n]; }), 'Categoria…'); }
    else if (id === 'reciclar') { ctl = sel(f('sai'), [['pedra', mn('pedra')], ['lixa', mn('lixa')]], 'Sai…'); have = 'Escória ×' + (I.mat.escoria || 0); }
    else if (id === 'purificar') { ctl = sel(f('d'), CY.DIST.map(function(d){ var x = E.cityDist(c, d.id).corr || 0; return [d.id, d.n + (x ? ' · corrupção ' + x : ' · limpo'), !x]; }), 'Bairro…'); have = 'Escória ×' + (I.mat.escoria || 0); }
    else if (id === 'remendo') { ctl = sel(f('eco'), E.cyEcos(c, 'partido').map(function(e){ return [e.id, e.n]; }), 'Eco Partido…'); have = 'Poeira ×' + (I.mat.poeira || 0); }
    else if (id === 'desmanchar') ctl = sel(f('rel'), (c.rel || []).filter(function(x){ return !x.uni && !x.origem; }).map(function(x){ return [x.id, x.n + ' · ' + rn(x.r) + ((c.eq || {})[x.slot] === x.id ? ' · equipada' : '')]; }), 'Relíquia…');
    return '<div class="cy-rec"><b>' + U.esc(r.n) + '</b><span class="dim" style="font-size:12.5px">' + U.esc(r.entra) + ' → ' + U.esc(r.sai) + '</span>' + (have ? '<span class="faint mono" style="font-size:11.5px">' + have + '</span>' : '')
      + '<div class="row" style="gap:6px">' + ctl + btn('cyRec', conf ? 'Confirmar' : 'Forjar', ' data-id="' + id + '"', conf ? 'danger' : 'primary') + '</div>' + errHTML('rc' + id) + '</div>';
  }
  App.CYW.forja = function(w){
    var c = C(), S = App.S, I = E.cyInv(c), K = S.owned.keys || {}, tab = w.tab || 'receitas';
    var b = App.cyTabs(w, [['receitas', 'Receitas'], ['portais', 'Materiais nos portais']]);
    if (tab === 'receitas') b += '<div class="cy-recs">' + CY.RECEITAS.map(function(r){ return recCard(c, S, I, K, r); }).join('') + '</div>';
    else {
      var P = E.cyOpen(c).filter(E.cyForjaPode);
      b += '<p class="dim" style="font-size:13.5px">Pedra, Lixa, Dado, Brasa e Fragmento Carmesim vão num portal aberto em que você ainda não entrou, até ' + CY.FORJA.porPortal + ' por portal. O Carimbo dá +24 h a qualquer portal aberto. Abra o portal e use na ficha dele.</p>'
        + '<div class="row" style="gap:6px">' + CY.MAT_PORTAL.map(function(k){ return '<span class="chip" title="' + U.esc((CY.ITENS[k] || {}).d || '') + '">' + U.esc(mn(k)) + ' ×' + (I.mat[k] || 0) + '</span>'; }).join('') + '</div>'
        + sec('Portais que aceitam a Forja agora', App.cyPortalsHTML(P, 'Nenhum agora: todos já foram começados ou chegaram a ' + CY.FORJA.porPortal + ' materiais.'));
    }
    return {ic: 'anvil', sup: 'Centro', t: 'Forja', b: b, cls: 'wide'};
  };
  App.A.cyRec = function(el){
    var id = el.getAttribute('data-id'), g = function(k){ return fv('rc_' + id + '_' + k); }, a = {};
    if (id === 'chave') a.rank = g('rank');
    else if (id === 'perg') { var p = String(g('g')).split('|'); a.tipo = p[0]; a.rank = p[1]; }
    else if (id === 'cosm') { var x = CY.COSM.filter(function(y){ return y.id === g('cid'); })[0]; if (x) { a.cid = x.id; a.d = x.d; } }
    else if (id === 'vale') { a.a = g('a'); a.b = g('b'); a.cat = g('cat'); }
    else if (id === 'reciclar') a.sai = g('sai') || 'pedra';
    else if (id === 'purificar') a.d = g('d');
    else if (id === 'remendo') a.eco = g('eco');
    else if (id === 'desmanchar') { a.rel = g('rel'); if (a.rel && App.ui.cyConf !== 'rec:' + id) { App.ui.cyConf = 'rec:' + id; App.cyWinRender(); return; } }
    App.ui.cyConf = null;
    var r = E.cyReceita(C(), App.S, id, a);
    if (!r.ok) { err('rc' + id, r.msg); App.cyWinRender(); return; }
    Object.keys(F()).forEach(function(k){ if (k.indexOf('rc_' + id + '_') === 0) delete F()[k]; });
    err('rc' + id, '');
    App.commit(r.core ? ['city', 'core'] : ['city']);
    App.toast({t: 'Forja · ' + (CY.RECEITAS.filter(function(y){ return y.id === id; })[0] || {n: id}).n, s: r.msg, ic: 'anvil'});
  };

  /* ---------- na ficha do portal: Forja e Carimbo; lá dentro: Eco e Espelho ---------- */
  App.cyFichaExtra = function(p){
    var I = E.cyInv(C()), out = '', ms = ['pedra', 'lixa', 'dado', 'brasa', 'carmesim'].filter(function(k){ return I.mat[k] > 0; });
    if (E.cyForjaPode(p) && ms.length) out += '<section class="win flat cy-forjaw"><div class="win-h">' + U.icon('anvil') + 'Forja · ' + (p.forja || 0) + '/' + CY.FORJA.porPortal + '</div><div class="stack" style="gap:8px"><div class="row" style="gap:6px">'
      + ms.map(function(k){ return btn('cyForjar', U.esc(mn(k)) + ' ×' + I.mat[k], ' data-id="' + p.id + '" data-m="' + k + '" title="' + U.esc((CY.ITENS[k] || {}).d || '') + '"'); }).join('') + '</div>' + errHTML('fj' + p.id) + '</div></section>';
    if (I.mat.carimbo > 0 && !p.posse) out += '<div class="row">' + btn('cyCarimbo', U.icon('clock') + 'Carimbo de Prazo: +24 h (×' + I.mat.carimbo + ')', ' data-id="' + p.id + '"') + '</div>';
    return out;
  };
  App.cyDentroExtra = function(p){
    var c = C(), I = E.cyInv(c), A = E.cyEcos(c), out = '';
    if (p.eco) { var e = E.cyEco(c, p.eco); if (e) out += '<p class="ok" style="font-size:13px">' + U.icon('star') + ' Eco invocado: ' + U.esc(e.n) + ' (nível ' + (e.nv || 1) + ').</p>'; }
    else if (A.length) {
      var L = A.filter(function(e){ return e.d === p.d; }).concat(A.filter(function(e){ return e.d !== p.d; }));
      out += '<div class="row cy-ecoinv" style="gap:8px">' + sel('ei_' + p.id, L.map(function(e){ return [e.id, e.n + ' · nv ' + (e.nv || 1) + (e.d !== p.d ? ' (' + (CY.DMAP[e.d] || {curto: ''}).curto + ')' : '')]; }), 'Invocar um Eco…', ' aria-label="Invocar um Eco"')
        + (fv('ei_' + p.id) ? btn('cyEcoInv', U.icon('star') + 'Invocar', ' data-id="' + p.id + '"', 'primary') : '') + '<span class="faint" style="font-size:12px">Começar de um Eco sobe o nível dele' + ((p.mods || []).indexOf('herdeiro') >= 0 ? ' e cumpre o do Herdeiro' : '') + '.</span></div>';
    }
    if (I.mat.carimbo > 0 && !p.posse && !p.tranc) out += '<div class="row">' + btn('cyCarimbo', U.icon('clock') + 'Carimbo de Prazo: +24 h (×' + I.mat.carimbo + ')', ' data-id="' + p.id + '"') + '</div>';
    return out;
  };
  App.cyEspelhoHTML = function(p, en){
    if (!E.cyMaldTem(C(), 'espelho')) return '';
    return '<label class="fld cy-espelho">Maldição do Espelho: ensine o que você fez, como se explicasse para alguém (' + CY.ESPELHO_MIN + ' caracteres ou mais)<textarea data-i="cyEn" data-id="' + p.id + '" data-f="ensino" rows="4" maxlength="4000">' + U.esc(en.ensino || '') + '</textarea></label>';
  };
  App.A.cyForjar = function(el){
    var id = el.getAttribute('data-id'), m = el.getAttribute('data-m'), p = E.cyPortal(C(), id), r = E.cyForjar(C(), App.S, p, m);
    if (!r.ok) { err('fj' + id, r.msg); return; }
    err('fj' + id, ''); App.commit(['city']); App.toast({t: 'Forja · ' + mn(m), s: r.msg, ic: 'anvil'});
  };
  App.A.cyCarimbo = function(el){ var p = E.cyPortal(C(), el.getAttribute('data-id')); if (!E.cyCarimbo(C(), p)) return; App.commit(['city']); App.toast({t: 'Carimbo de Prazo', s: p.n + ': +24 h.', ic: 'clock'}); };
  App.A.cyEcoInv = function(el){ var id = el.getAttribute('data-id'), p = E.cyPortal(C(), id); if (!E.cyEcoInvocar(C(), p, fv('ei_' + id))) return; delete F()['ei_' + id]; App.commit(['city']); };
})();
