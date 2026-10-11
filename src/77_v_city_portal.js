/* ===== CIDADE · telas dos portais: ficha, dentro do portal, entrega, revelação do drop, inventário, Licença e celular ===== */
(function(){
  var CY = SYS.CITY, RK = ['E', 'D', 'C', 'B', 'A', 'S'];
  var RARN = {common: 'comum', uncommon: 'incomum', rare: 'raro', epic: 'épico', legendary: 'lendário', mythic: 'mítico'};
  function C(){ return App.city; }
  function rc(r){ return (SYS.RARITY[r] || SYS.RARITY.common).c; }
  function wayOf(p){ return App.way(p.way); }
  function dOf(p){ return CY.DMAP[p.d] || {n: p.d, ruas: []}; }
  function left(p){ return Date.parse(p.due) - Date.now(); }
  function prazo(p){ var ms = left(p); return ms <= 0 ? 'venceu' : ms < 3600000 ? 'vence em ' + U.fmtDur(ms) : ms < 48 * 3600000 ? 'vence em ' + U.fmtDur(ms) : 'vence em ' + Math.round(ms / 86400000) + ' dias'; }
  function perigo(p){ return !p.cham && !p.reav && RK.indexOf(p.r) - RK.indexOf(E.cyLic(C()).r) >= 2; }
  App.cyRarName = function(r){ return RARN[r] || r; };

  /* ---------- descrição de um item de drop ---------- */
  App.cyItem = function(it){
    var I = CY.ITENS;
    switch (it.k) {
      case 'gem': return {ic: 'gem', t: '+' + U.num(it.n) + ' ◆', s: 'cristais'};
      case 'cr': var w = App.way(it.way); return {ic: w ? w.icon : 'helm', t: '+' + it.n + ' ' + (w ? w.cur.code : ''), s: 'créditos de ' + (w ? w.name : 'Caminho')};
      case 'chave': return {ic: 'lock', t: 'Chave de Dungeon · Rank ' + it.rank, s: 'vai direto para as suas chaves'};
      case 'mat': return {ic: 'sword', t: (I[it.id] || {n: it.id}).n, s: (I[it.id] || {}).d || ''};
      case 'passe': return {ic: 'map', t: 'Passe da vertente', s: (dOf(it).ruas[it.rua] || '') + ': um portal extra dela'};
      case 'caixa': return {ic: 'bag', t: 'Caixa ' + CY.CAIXA[it.grau] + ' (par)', s: it.so ? 'só a Amaldiçoada veio' : 'Abençoada ou Amaldiçoada'};
      case 'frag': return {ic: 'sparkle', t: 'Fragmento · ' + (CY.DMAP[it.d] || {n: ''}).n, s: '5 viram um cosmético do distrito'};
      case 'perg': return {ic: 'scroll', t: CY.PERG[it.tipo] + ' · ' + it.rank, s: it.tipo === 'permissao' ? 'entra num portal dois ranks acima' : 'guardado no inventário'};
      case 'reliq': return {ic: 'crown', t: 'Relíquia não identificada · ' + it.slot, s: 'identifica quando as Relíquias chegarem'};
      case 'vale': return {ic: 'cert', t: 'Vale de ' + CY.VALE_CAT[it.cat].n + ' · até R$ ' + it.teto, s: it.virou ? 'inventário cheio: virou ' + it.virou + ' ◆' : 'sai do Fundo de Recompensas'};
    }
    return {ic: 'dot', t: it.k, s: ''};
  };

  /* ---------- odds na tela, como nos baús ---------- */
  App.cyOddsHTML = function(p){
    var O = E.cyOdds(C(), p), w = wayOf(p), out = '';
    out += '<div class="cy-gar"><span class="eyebrow">Garantido</span><div class="row" style="gap:6px">'
      + '<span class="chip" style="color:' + w.color + '">+' + O.xp + ' XP · ' + U.esc(w.name) + '</span>'
      + '<span class="chip">' + U.icon('gem') + '+' + O.gem + ' ◆' + (O.gem < O.gemFull ? ' (de ' + O.gemFull + ')' : '') + '</span>'
      + (O.eco ? '<span class="chip">Eco ' + RARN[O.eco] + '</span>' : '') + (O.chave ? '<span class="chip">' + U.icon('lock') + 'chave ' + O.chave + '</span>' : '')
      + (p.tranc ? '<span class="chip warn">par de caixas, se fechar no tempo</span>' : '') + '</div></div>';
    out += '<div class="cy-rols"><span class="eyebrow">Rolagens</span><p style="font-size:13.5px">' + O.base + ' de base' + (O.q ? ' · Q +' + O.q + '%' : '') + (O.extra ? ' · +' + O.extra + ' do Vento a Favor' : '') + (p.tranc ? ' · dobradas no Trancado' : '')
      + ' → <b>' + O.rolMin + (O.frac > 0.001 ? ' e ' + Math.round(O.frac * 100) + '% de chance de mais 1' : '') + '</b>. Teto: <b style="color:' + rc(O.teto) + '">' + RARN[O.teto] + '</b>' + (O.r ? ' · R +' + O.r + '%' : '') + '.</p>'
      + '<div class="cy-odds">' + CY.RARS.map(function(r, i){ var v = O.rar[i]; return '<div class="cy-odd' + (v <= 0 ? ' off' : '') + '"><i style="--rc:' + rc(r) + ';width:' + Math.max(2, Math.min(100, v)) + '%"></i><span>' + RARN[r] + '</span><b>' + (v >= 10 ? Math.round(v) : v.toFixed(v >= 1 ? 1 : 2)).toString().replace('.', ',') + '%</b></div>'; }).join('') + '</div>'
      + '<details class="cy-gav"><summary>Gavetas desta faixa</summary><div class="cy-gavs">' + CY.DROP.gav.map(function(g, i){ return '<span>' + U.icon(g.ic) + U.esc(g.n) + ' <b>' + O.gav[i] + '%</b></span>'; }).join('') + '</div></details>'
      + (RK.indexOf(p.r) >= 2 ? '<p class="faint" style="font-size:12.5px">Pity: ' + O.pity + ' de ' + CY.DROP.pity.epico + ' portais C+ sem épico' + (O.pity >= CY.DROP.pity.epico ? ' · <b class="warn">a próxima rolagem é épica</b>' : '') + '.</p>' : '')
      + (O.corr ? '<p style="font-size:12.5px;color:var(--cy-red)">Corrupção ' + O.corr + ' no distrito: ◆ base −' + (O.corr * 25) + '%.</p>' : '') + '</div>';
    return out;
  };
  function modsHTML(p, opts){
    var ms = (p.mods || []).map(function(id){ return CY.MODMAP[id]; }).filter(Boolean);
    if (!ms.length) return p.fis ? '<p class="faint" style="font-size:13px">Portal físico: sem modificadores, nunca Trancado. Aqueça antes e pare se doer.</p>' : '';
    return '<div class="cy-mods">' + ms.map(function(m){
      var tag = m.t === 'praga' ? 'bad' : m.t === 'bencao' ? 'ok' : '';
      return '<div class="cy-mod"><span class="chip ' + tag + '">' + U.esc(m.t === 'bencao' ? 'bênção' : m.t) + '</span><b>' + U.esc(m.n) + '</b><span class="dim">' + U.esc(m.ef) + '</span><span class="mono" style="font-size:11.5px">' + (m.q ? 'Q +' + m.q + '% ' : '') + (m.r ? 'R +' + m.r + '%' : '') + (m.rol ? '+1 rolagem' : '') + '</span></div>';
    }).join('') + '</div>';
  }
  function head(p, depth){
    var w = wayOf(p), d = dOf(p), tags = '';
    if (p.cham) tags += '<span class="chip glow">' + U.icon('clock') + 'Portal do Chamado</span>';
    if (p.reav) tags += '<span class="chip warn">Reavaliação · Licença ' + p.reav.para + '</span>';
    if (p.tranc) tags += '<span class="chip warn">' + U.icon('lock') + 'Trancado</span>';
    if (p.fis) tags += '<span class="chip">físico</span>';
    if (perigo(p) && !p.in) tags += '<span class="chip bad">' + U.icon('alert') + 'perigo</span>';
    return '<header class="cyw-h cy-ph">' + (depth > 0 ? App.cyBackBtn() : '') + '<span class="cy-ph-rk">' + U.rankBadge(p.r, 46) + '</span>'
      + '<div class="cyw-tt"><span class="eyebrow" style="color:' + w.color + '">' + U.esc(d.n) + ' · ' + U.esc(d.ruas[p.rua] || '') + '</span><h2>' + U.esc(p.n) + '</h2>'
      + '<div class="row" style="gap:6px"><span class="chip">' + CY.RANK[p.r].tipo + ' · ' + CY.RANK[p.r].esf + '</span><span class="chip' + (left(p) < 6 * 3600000 ? ' warn' : '') + '">' + U.icon('clock') + prazo(p) + '</span>' + tags + '</div></div>'
      + '<button class="iconbtn cyw-x" data-a="cyWinX" aria-label="Fechar">' + U.icon('close') + '</button></header>';
  }

  /* ---------- janela do portal (abre por cima do bairro, do radar ou do mapa) ---------- */
  App.CYW = App.CYW || {};
  App.CYW.portal = function(w, depth){
    var p = E.cyPortal(C(), w.id);
    if (!p) return {ic: 'gate', sup: 'Portal', t: 'Portal fechado', b: '<p class="dim">Este portal não está mais no mapa.</p>'};
    return {h: head(p, depth), t: p.n, wc: wayOf(p).color, cls: 'wide', b: p.in ? dentro(p) : ficha(p)};
  };
  function ficha(p){
    var neb = (p.mods || []).indexOf('neblina') >= 0, ck = E.cyCanEnter(C(), p), t = p.min;
    if ((p.mods || []).indexOf('cronometrado') >= 0) t = Math.round(t / 2);
    var out = '<p class="cy-lore">' + U.esc(p.lore) + '</p>';
    out += '<section class="stack" style="gap:8px"><span class="eyebrow">Objetivo</span>' + (neb ? '<p class="dim">Neblina: o objetivo aparece quando você entrar.</p>' : '<p>' + U.esc(p.obj) + '</p>')
      + (p.node && !neb ? '<p class="faint" style="font-size:13px">' + U.icon('map') + ' Nó: ' + U.esc(p.node.t) + '</p>' : '') + '</section>';
    if (!neb) out += '<section class="stack" style="gap:6px"><span class="eyebrow">Entregável</span><p>' + U.esc(p.ent) + '</p><ul class="list">' + p.crit.map(function(c){ return '<li><span>' + U.esc(c) + '</span></li>'; }).join('') + '</ul></section>';
    out += '<p class="faint mono" style="font-size:12px">Tempo estimado: ' + t + ' min · para fechar: ' + U.esc(CY.PROVA[p.reav ? 'nota' : CY.RANK[p.r].prova]) + '</p>';
    out += modsHTML(p);
    out += '<section class="win flat cy-dropwin"><div class="win-h">' + U.icon('bag') + 'Drop previsto</div>' + App.cyOddsHTML(p) + '</section>';
    var btn;
    if (ck.ok) btn = '<button class="btn primary" data-a="cyEnter" data-id="' + p.id + '">' + U.icon('gate') + 'Entrar no portal' + (ck.perg ? ' (gasta 1 Pergaminho de Permissão)' : '') + '</button>' + (p.tranc ? '<span class="warn" style="font-size:13px">Ao entrar, o relógio corre e não pausa: ' + CY.TRANC.min[p.r] + ' min.</span>' : '');
    else btn = '<span class="chip bad">' + U.icon('lock') + (ck.why === 'perg' ? 'Dois ranks acima da sua Licença: precisa de Pergaminho de Permissão' : 'Rank alto demais para a sua Licença') + '</span>';
    return out + '<div class="row" style="margin-top:4px">' + btn + '</div>';
  }
  function dentro(p){
    var u = App.ui.cyEnt || (App.ui.cyEnt = {}), en = u[p.id] || (u[p.id] = {txt: '', res: '', link: '', extra: '', cump: {}, eco: {n: '', tipo: 'texto', link: ''}});
    var pr = p.reav ? 'nota' : CY.RANK[p.r].prova, out = '';
    if (p.tranc && p.lock) out += '<div class="callout fail cy-lock" data-lock="' + p.lock + '">' + U.icon('clock') + ' Trancado: <b class="cy-lockt">' + U.fmtDur(Date.parse(p.lock) - Date.now()) + '</b> para entregar. Estourou, quebra.</div>';
    if (p.vir) out += '<div class="callout" style="border-color:var(--warn)"><b>O briefing mudou.</b> ' + U.esc(p.vir) + '</div>';
    out += '<section class="stack" style="gap:8px"><span class="eyebrow">Objetivo</span><p>' + U.esc(p.obj) + '</p>' + (p.node ? '<p class="faint" style="font-size:13px">' + U.icon('map') + ' Nó: ' + U.esc(p.node.t) + '</p>' : '') + '</section>';
    if (p.passos && p.passos.length) out += '<section class="stack" style="gap:6px"><span class="eyebrow">Passos</span>' + p.passos.map(function(s, i){ var on = (p.ok || []).indexOf(i) >= 0; return '<button class="cy-step' + (on ? ' on' : '') + '" data-a="cyStep" data-id="' + p.id + '" data-i2="' + i + '" aria-pressed="' + on + '"><i>' + (on ? U.icon('check') : '') + '</i><span>' + U.esc(s) + '</span></button>'; }).join('') + '</section>';
    out += '<section class="stack" style="gap:6px"><span class="eyebrow">Critérios</span><ul class="list">' + p.crit.map(function(c){ return '<li><span>' + U.esc(c) + '</span></li>'; }).join('') + '</ul></section>';
    out += modsHTML(p);
    out += '<label class="fld">Rascunho (fica salvo, conta como ação no Chamado)<textarea data-i="cyDraft" data-id="' + p.id + '" rows="6" placeholder="Anote o que está fazendo.">' + U.esc(p.dr || '') + '</textarea></label>';
    /* entrega */
    var f = '<section class="win flat"><div class="win-h">' + U.icon('upload') + 'Entrega</div><div class="stack" style="gap:10px">';
    if (pr === 'linha' || pr === 'resultado') f += '<label class="fld">1 linha do que fez<input type="text" data-i="cyEn" data-id="' + p.id + '" data-f="txt" value="' + U.esc(en.txt) + '" maxlength="300"></label>';
    else f += '<label class="fld">Entregável (texto)<textarea data-i="cyEn" data-id="' + p.id + '" data-f="txt" rows="5" maxlength="8000">' + U.esc(en.txt) + '</textarea></label>';
    if (pr === 'resultado') f += '<label class="fld">Resultado (número, trecho ou link)<input type="text" data-i="cyEn" data-id="' + p.id + '" data-f="res" value="' + U.esc(en.res) + '" maxlength="500"></label>';
    if (pr !== 'linha') f += '<label class="fld">Link (opcional)<input type="url" data-i="cyEn" data-id="' + p.id + '" data-f="link" value="' + U.esc(en.link) + '" placeholder="https://"></label>';
    if ((p.mods || []).indexOf('peso_morto') >= 0) f += '<label class="fld">Peso Morto: a entrega a mais<input type="text" data-i="cyEn" data-id="' + p.id + '" data-f="extra" value="' + U.esc(en.extra) + '" maxlength="500"></label>';
    var honra = (p.mods || []).map(function(id){ return CY.MODMAP[id]; }).filter(function(m){ return m && !m.auto && (m.t === 'prefixo' || m.t === 'sufixo'); });
    if (honra.length) f += '<div class="stack" style="gap:4px"><span class="eyebrow">Cumpriu os modificadores?</span><span class="faint" style="font-size:12.5px">O que não foi cumprido não soma Q nem R. Sem culpa: só sem bônus.</span>' + honra.map(function(m){ return '<label class="check"><input type="checkbox" data-c="cyCump" data-id="' + p.id + '" data-m="' + m.id + '"' + (en.cump[m.id] ? ' checked' : '') + '><span><b>' + U.esc(m.n) + '</b> · ' + U.esc(m.ef) + '</span></label>'; }).join('') + '</div>';
    if ((p.mods || []).indexOf('alvorada') >= 0) { var h = new Date().getHours(); f += '<p class="faint" style="font-size:12.5px">da Alvorada: ' + (h >= 7 && h < 10 ? '<b class="ok">dentro da janela (7h às 10h)</b>' : 'só soma se você entregar entre 7h e 10h') + '.</p>'; }
    if (CY.RANK[p.r].eco) f += '<details class="cy-eco"' + (en.eco.n ? ' open' : '') + '><summary>Registrar o Eco (o que ficou de reutilizável)</summary><div class="stack" style="gap:8px;margin-top:8px"><label class="fld">Nome<input type="text" data-i="cyEco" data-id="' + p.id + '" data-f="n" value="' + U.esc(en.eco.n) + '" maxlength="60"></label><label class="fld">Tipo<select data-c="cyEcoT" data-id="' + p.id + '">' + ['template', 'snippet', 'preset', 'checklist', 'texto', 'áudio', 'diagrama', 'planilha'].map(function(t){ return '<option' + (en.eco.tipo === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label><label class="fld">Link ou onde está<input type="text" data-i="cyEco" data-id="' + p.id + '" data-f="link" value="' + U.esc(en.eco.link) + '" maxlength="300"></label><span class="faint" style="font-size:12.5px">Sem registro, o Eco não nasce, mas o portal fecha igual.</span></div></details>';
    if (E.cyPrecisaNota(p)) f += notaHTML(p, en);
    f += '<p class="cy-err bad" id="cyErr-' + p.id + '" style="font-size:13.5px">' + U.esc(App.ui.cyErr && App.ui.cyErr[p.id] || '') + '</p>';
    f += '<div class="row" style="justify-content:flex-end"><button class="btn primary" data-a="cyClose" data-id="' + p.id + '">' + U.icon('check') + 'Entregar e fechar</button></div></div></section>';
    return out + f;
  }

  /* ---------- Examinador: nota do B e da Reavaliação (manual quando a IA não está disponível) ---------- */
  function notaHTML(p, en){
    var min = E.cyNotaMin(p), nt = p.nt || null, ai = App.sample && !App.sampleOff, busy = App.ui.cyBusy === p.id;
    var h = '<div class="stack cy-nota" style="gap:8px"><span class="eyebrow">Examinador · nota mínima ' + min + '</span>';
    if (nt) h += '<div class="callout' + (nt.nota >= min ? ' gate' : ' fail') + '"><b>Nota ' + nt.nota + '</b>' + (nt.src === 'manual' ? ' (autoavaliação)' : '') + ' · ' + U.esc(nt.resumo || '') + (nt.lac && nt.lac.length ? '<br><span class="dim" style="font-size:13px">Faltou: ' + U.esc(nt.lac.join('; ')) + '</span>' : '') + '</div>';
    if (busy) h += '<div class="cy-wait">' + (App.img('eu-loading') ? '<img src="' + App.img('eu-loading') + '" alt="">' : '') + '<span class="mono">o Examinador está lendo · leva o tempo que precisar</span></div>';
    if (ai) h += '<button class="btn" data-a="cyGrade" data-id="' + p.id + '"' + (busy ? ' disabled' : '') + '>' + U.icon('oracle') + (busy ? 'O Examinador está lendo…' : nt ? 'Pedir outra nota' : 'Pedir a nota ao Examinador') + '</button>';
    else {
      var M = en.man || (en.man = {}), extra = p.reav ? ['Expliquei em voz alta, sem ler', 'Mostrei a alguém ou gravei a explicação'] : [];
      h += '<p class="faint" style="font-size:13px">O Examinador IA funciona quando o Sistema é aberto dentro do Claude. Enquanto isso, a autoavaliação honesta:</p>'
        + p.crit.concat(extra).map(function(c, i){ return '<label class="check"><input type="checkbox" data-c="cyMan" data-id="' + p.id + '" data-i2="' + i + '"' + (M[i] ? ' checked' : '') + '><span>' + U.esc(c) + '</span></label>'; }).join('')
        + '<button class="btn sm" data-a="cyManual" data-id="' + p.id + '">Registrar a autoavaliação</button>';
    }
    return h + '</div>';
  }
  App.cyGradePrompt = function(p, en){
    var w = wayOf(p);
    return 'Você é o EXAMINADOR da Cidade do System Ascension, um sistema pessoal de evolução no estilo Solo Leveling. Corrija com rigor de banca e justiça, em português do Brasil. Não invente fatos sobre o jogador.\n\n'
      + '=== PORTAL ===\nCaminho: ' + w.name + '\nRank: ' + p.r + (p.reav ? ' (Reavaliação da Licença: defesa, cruza dois Caminhos)' : '') + '\nNome: ' + p.n + '\nObjetivo: ' + p.obj + '\nEntregável pedido: ' + p.ent + '\nCritérios:\n- ' + p.crit.join('\n- ')
      + (p.vir ? '\nVirada do briefing: ' + p.vir : '') + ((p.mods || []).length ? '\nModificadores: ' + p.mods.map(function(id){ var m = CY.MODMAP[id]; return m ? m.n + ' (' + m.ef + ')' : id; }).join('; ') : '')
      + '\n\n=== ENTREGA DO JOGADOR ===\n' + String(en.txt || '').slice(0, 9000) + (en.link ? '\nLink: ' + en.link : '') + (en.extra ? '\nEntrega a mais: ' + en.extra : '')
      + '\n\nNota mínima para fechar: ' + E.cyNotaMin(p) + '. Entrega vaga, genérica, copiada ou fora do objetivo leva nota baixa. Cada critério não cumprido tira pontos de verdade.'
      + '\nResponda SOMENTE com um objeto JSON: {"nota": 0-100, "veredito": "APROVADO" | "REPROVADO", "resumo": "2 frases diretas", "acertos": ["..."], "lacunas": ["..."]}';
  };
  App.A.cyGrade = function(el){
    var id = el.getAttribute('data-id'), p = E.cyPortal(C(), id), en = (App.ui.cyEnt || {})[id]; if (!p || !en || !App.sample || App.ui.cyBusy) return;
    var err = E.cyCheck(p, Object.assign({}, en, {nota: 0})); if (err) { setErr(id, err); return; }
    App.ui.cyBusy = id; App.cyWinRender();
    App.sample.json(App.cyGradePrompt(p, en), {cache: false}).then(function(r){
      App.ui.cyBusy = null;
      var n = Math.max(0, Math.min(100, Math.round(+(r && r.nota) || 0)));
      p.nt = {nota: n, src: 'ia', resumo: String((r && r.resumo) || '').slice(0, 400), lac: ((r && r.lacunas) || []).slice(0, 4).map(function(x){ return String(x).slice(0, 160); })};
      App.commit(['city'], {norender: true}); App.cyWinRender();
    }, function(e){
      App.ui.cyBusy = null; var c = e && e.code;
      if (['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].indexOf(c) >= 0) App.sampleOff = true;
      setErr(id, 'O Examinador não respondeu (' + (c || 'erro') + '). ' + (App.sampleOff ? 'Use a autoavaliação.' : 'Tente de novo em instantes.'));
      App.cyWinRender();
    });
  };
  App.C.cyMan = function(el){ var en = (App.ui.cyEnt || {})[el.getAttribute('data-id')]; if (!en) return; (en.man || (en.man = {}))[el.getAttribute('data-i2')] = el.checked; };
  App.A.cyManual = function(el){
    var id = el.getAttribute('data-id'), p = E.cyPortal(C(), id), en = (App.ui.cyEnt || {})[id]; if (!p || !en) return;
    var tot = p.crit.length + (p.reav ? 2 : 0), ok = 0; for (var i = 0; i < tot; i++) if (en.man && en.man[i]) ok++;
    var min = E.cyNotaMin(p), n = ok === tot ? Math.max(min, p.reav ? CY.REAV.nota : 70) : Math.round(min * ok / tot) - 1;
    p.nt = {nota: n, src: 'manual', resumo: ok === tot ? 'Autoavaliação: todos os critérios cumpridos.' : 'Autoavaliação: ' + ok + ' de ' + tot + ' itens cumpridos.', lac: []};
    App.commit(['city'], {norender: true}); App.cyWinRender();
  };
  function setErr(id, msg){ (App.ui.cyErr || (App.ui.cyErr = {}))[id] = msg; var el = document.getElementById('cyErr-' + id); if (el) el.textContent = msg; }

  /* ---------- ações ---------- */
  App.A.cyOpen = function(el, ev){ if (ev && ev.stopPropagation) ev.stopPropagation(); App.cyWinOpen({t: 'portal', id: el.getAttribute('data-id')}); };
  App.A.cyEnter = function(el){
    var p = E.cyPortal(C(), el.getAttribute('data-id')), r = E.cyEnter(C(), App.S, p);
    if (!r.ok) { App.toast({t: 'Não deu para entrar', s: r.why === 'perg' ? 'Precisa de um Pergaminho de Permissão.' : r.why === 'rank' ? 'Rank alto demais para a sua Licença.' : 'Este portal não está aberto.', ic: 'lock'}); return; }
    App.commit(['city']);
    App.toast({t: 'Você entrou: ' + p.n, s: p.tranc ? 'Trancado: o relógio está correndo.' : 'O portal fica aberto até o prazo. Rascunho salvo sozinho.', ic: 'gate'});
  };
  App.I.cyDraft = function(el){ var p = E.cyPortal(C(), el.getAttribute('data-id')); if (!p) return; p.dr = el.value.slice(0, 6000); App.debSave('city'); };
  App.I.cyEn = function(el){ var en = (App.ui.cyEnt || {})[el.getAttribute('data-id')]; if (en) en[el.getAttribute('data-f')] = el.value; };
  App.I.cyEco = function(el){ var en = (App.ui.cyEnt || {})[el.getAttribute('data-id')]; if (en) en.eco[el.getAttribute('data-f')] = el.value; };
  App.C.cyEcoT = function(el){ var en = (App.ui.cyEnt || {})[el.getAttribute('data-id')]; if (en) en.eco.tipo = el.value; };
  App.C.cyCump = function(el){ var en = (App.ui.cyEnt || {})[el.getAttribute('data-id')]; if (en) en.cump[el.getAttribute('data-m')] = el.checked; };
  App.A.cyStep = function(el){ var p = E.cyPortal(C(), el.getAttribute('data-id')), i = +el.getAttribute('data-i2'); if (!p) return; p.ok = p.ok || []; var k = p.ok.indexOf(i); if (k >= 0) p.ok.splice(k, 1); else p.ok.push(i); App.commit(['city'], {norender: true}); App.cyWinRender(); };
  App.A.cyClose = function(el){
    var id = el.getAttribute('data-id'), p = E.cyPortal(C(), id), en = (App.ui.cyEnt || {})[id] || {};
    if (!p) return;
    var src = Object.assign({}, en, {nota: p.nt ? p.nt.nota : undefined, src: p.nt ? p.nt.src : ''});
    var r = E.cyClose(C(), App.S, p, src);
    if (!r.ok) { setErr(id, r.msg); if (r.reprovou) { App.cyWinRemove('portal', id); App.commit(['city']); App.toast({t: 'Reavaliação reprovada', s: r.msg, ic: 'alert', ms: 8000}); } return; }
    delete (App.ui.cyEnt || {})[id];
    App.ui.cyw = (App.ui.cyw || []).filter(function(x){ return !(x.t === 'portal' && x.id === id); });
    App.commit(r.core ? ['city', 'core'] : ['city']);
    App.ui.modal = {type: 'cyDrop', k: 0}; App.renderModal();
  };

  /* ---------- revelação do drop: as rolagens abrem uma a uma ---------- */
  App.M.cyDrop = function(m){
    var U2 = C().ult; if (!U2) return '';
    var res = U2.res, n = res.rolls.length, k = Math.min(m.k || 0, n), w = App.way(U2.p.way);
    var h = '<section class="win cy-reveal"><div class="win-h">' + U.icon('bag') + 'Portal fechado · ' + U.esc(U2.p.n) + '<button class="act" data-a="closeModal">fechar ✕</button></div><div class="stack" style="gap:12px">'
      + '<div class="row" style="gap:6px"><span class="chip" style="color:' + w.color + '">+' + res.gar.xp + ' XP · ' + U.esc(w.name) + '</span><span class="chip">' + U.icon('gem') + '+' + res.gar.gem + ' ◆</span>' + (res.gar.chave ? '<span class="chip">chave ' + res.gar.chave + '</span>' : '') + (res.gar.caixa ? '<span class="chip warn">par de caixas do Trancado</span>' : '') + (U2.eco ? '<span class="chip ok">Eco: ' + U.esc(U2.eco.n) + '</span>' : '') + '</div>'
      + '<div class="cy-cards">';
    res.rolls.forEach(function(it, i){
      var o = App.cyItem(it);
      h += i < k ? '<div class="cy-card on" style="--rc:' + rc(it.rar) + '"><span class="cy-card-r">' + RARN[it.rar] + (res.pity && i === 0 ? ' · pity' : '') + '</span>' + U.icon(o.ic) + '<b>' + U.esc(o.t) + '</b><span>' + U.esc(o.s) + '</span></div>'
        : '<button class="cy-card" data-a="cyReveal" aria-label="Revelar a rolagem ' + (i + 1) + '"><span class="cy-card-q">?</span><span>rolagem ' + (i + 1) + '</span></button>';
    });
    h += '</div>';
    if (!n) h += '<p class="dim">Nenhuma rolagem desta vez: só o garantido.</p>';
    if (k < n) h += '<div class="row" style="justify-content:flex-end"><button class="btn" data-a="cyRevealAll">Revelar tudo</button><button class="btn primary" data-a="cyReveal">Revelar</button></div>';
    else {
      if (U2.lic) h += '<div class="callout gate"><b>Licença ' + U2.lic.para + '.</b> ' + (U2.lic.salto ? 'Salto: a nota pulou um rank inteiro.' : 'A Reavaliação passou.') + '</div>';
      h += '<div class="row" style="justify-content:flex-end"><a class="btn" href="#/cidade" data-a="closeModal">Voltar ao mapa</a></div>';
    }
    return h + '</div></section>';
  };
  App.A.cyReveal = function(){ var m = App.ui.modal; if (!m || m.type !== 'cyDrop') return; m.k = (m.k || 0) + 1; App.renderModal(); };
  App.A.cyRevealAll = function(){ var m = App.ui.modal; if (!m || m.type !== 'cyDrop') return; m.k = 99; App.renderModal(); };

  /* ---------- listas, inventário, Licença e celular ---------- */
  App.cyRow = function(p){
    var d = dOf(p), st = p.in ? '<span class="chip glow">dentro</span>' : perigo(p) ? '<span class="chip bad">perigo</span>' : '';
    return '<button class="cy-prow" style="--wc:' + wayOf(p).color + '" data-a="cyOpen" data-id="' + p.id + '">' + U.rankBadge(p.r, 30) + '<span class="stack" style="gap:1px;min-width:0"><b>' + U.esc(p.n) + '</b><span class="faint" style="font-size:12.5px">' + U.esc(d.n) + ' · ' + U.esc(d.ruas[p.rua] || '') + (p.cham ? ' · Chamado' : '') + (p.reav ? ' · Reavaliação' : '') + (p.tranc ? ' · Trancado' : '') + '</span></span>'
      + '<span class="stack" style="gap:3px;align-items:flex-end">' + st + '<span class="mono" style="font-size:11.5px;color:' + (left(p) < 6 * 3600000 ? 'var(--warn)' : 'var(--dim)') + '">' + prazo(p) + '</span></span></button>';
  };
  App.cyPortalsHTML = function(list, vazio){
    list = list.slice().sort(function(a, b){ return Date.parse(a.due) - Date.parse(b.due); });
    return list.length ? '<div class="cy-plist">' + list.map(App.cyRow).join('') + '</div>' : '<p class="dim" style="font-size:14px">' + U.esc(vazio) + '</p>';
  };
  App.cyLicInner = function(){
    var c = C(), L = E.cyLic(c), nx = E.cyLicNext(c), row = E.cyLicRow(L.r), from = row.pts, to = nx ? nx.pts : row.pts;
    var reav = (c.portals || []).filter(function(p){ return p.reav && p.st === 'open'; })[0];
    var st = !nx ? 'Licença máxima.' : reav ? 'Reavaliação aberta: feche o portal para subir.' : L.pts >= to ? (L.falhou ? 'Nova Reavaliação em ' + Math.max(0, CY.REAV.espera - U.daysBetween(L.falhou, U.today())) + ' dias.' : 'Pontos batidos: a Reavaliação nasce na próxima manutenção.') : 'Faltam ' + (to - L.pts) + ' Pontos de Caça para a Reavaliação.';
    var per = CY.DIST.map(function(d){ var x = E.cityDist(c, d.id); return '<span class="cy-lpd" style="--wc:' + App.way(d.way).color + '" title="' + U.esc(d.n) + '">' + U.icon(d.ic) + '<b>' + (x.closed || 0) + '</b></span>'; }).join('');
    return '<div class="row" style="gap:16px;flex-wrap:nowrap">' + U.rankBadge(L.r, 64)
      + '<div class="stack" style="gap:6px;min-width:0;flex:1"><div class="row between mono" style="font-size:12px"><span>' + L.pts + ' Pontos de Caça</span><span class="dim">' + (nx ? 'Licença ' + nx.r + ' em ' + to : '') + '</span></div>'
      + H.bar(nx ? U.pct(L.pts - from, to - from) : 100, 'thin') + '<span class="dim" style="font-size:13px">' + st + '</span></div></div>'
      + '<div class="cy-lpds">' + per + '</div><p class="faint" style="font-size:12px">Portais fechados por bairro. E 1 · D 2 · C 5 · B 12 Pontos.</p>';
  };
  App.cyLicCard = function(){ return '<section class="win cy-lic"><div class="win-h">' + U.icon('cert') + 'Licença de Caçador</div>' + App.cyLicInner() + '</section>'; };
  App.cyInvInner = function(){
    var c = C(), I = E.cyInv(c), K = App.S.owned.keys || {}, rows = [];
    Object.keys(I.mat).forEach(function(k){ if (I.mat[k]) rows.push(['sword', (CY.ITENS[k] || {n: k}).n, '×' + I.mat[k]]); });
    I.caixas.forEach(function(x){ rows.push(['bag', 'Caixa ' + CY.CAIXA[x.grau] + ' (par)', x.so ? 'só Amaldiçoada' : 'fechada']); });
    I.vales.forEach(function(x){ rows.push(['cert', 'Vale de ' + CY.VALE_CAT[x.cat].n, 'até R$ ' + x.teto]); });
    I.perg.forEach(function(x){ rows.push(['scroll', CY.PERG[x.tipo] + ' · ' + x.rank, '']); });
    I.reliq.forEach(function(x){ rows.push(['crown', 'Relíquia ' + RARN[x.r] + ' · ' + x.slot, 'não identificada']); });
    Object.keys(I.frag).forEach(function(d){ if (I.frag[d]) rows.push(['sparkle', 'Fragmentos · ' + (CY.DMAP[d] || {n: d}).n, I.frag[d] + '/5']); });
    I.passe.forEach(function(x){ rows.push(['map', 'Passe · ' + ((CY.DMAP[x.d] || {ruas: []}).ruas[x.rua] || ''), '']); });
    (c.ecos || []).forEach(function(x){ rows.push(['star', 'Eco · ' + x.n, RARN[x.r]]); });
    var keys = RK.filter(function(r){ return K[r]; }).map(function(r){ return r + ' ×' + K[r]; }).join(' · ');
    return (keys ? '<p style="font-size:13.5px;margin-bottom:8px">' + U.icon('lock') + ' Chaves de Dungeon: <b>' + keys + '</b> · <a href="#/portoes/dungeons">usar nas Dungeons</a></p>' : '')
      + (rows.length ? '<div class="cy-inv">' + rows.map(function(r){ return '<div class="cy-invr">' + U.icon(r[0]) + '<span>' + U.esc(r[1]) + '</span><span class="dim mono" style="font-size:11.5px">' + U.esc(r[2]) + '</span></div>'; }).join('') + '</div>' : '<p class="dim" style="font-size:14px">Vazio. Os drops dos portais aparecem aqui.</p>')
      + '<p class="faint" style="font-size:12px;margin-top:8px">Caixas, vales, Relíquias, Forja e Ecos ganham uso nos próximos blocos; o que cair agora fica guardado.</p>';
  };
  App.cyInvCount = function(){ var I = E.cyInv(C()), n = I.caixas.length + I.vales.length + I.perg.length + I.reliq.length + I.passe.length + (C().ecos || []).length; Object.keys(I.mat).forEach(function(k){ n += I.mat[k] || 0; }); Object.keys(I.frag).forEach(function(k){ n += I.frag[k] || 0; }); return n; };
  App.cyInvHTML = function(){ return '<section class="win"><div class="win-h">' + U.icon('bag') + 'Inventário</div>' + App.cyInvInner() + '</section>'; };
  var LOGT = {
    nasceu: function(l){ return 'Portal ' + l.r + ' nasceu em ' + dn(l.d) + ': ' + l.n + '.'; },
    chamado: function(l){ return 'A janela abriu. Portal do Chamado em ' + dn(l.d) + ': ' + l.n + '.'; },
    entrou: function(l){ return 'Você entrou em ' + l.n + '.'; },
    fechou: function(l){ return 'Fechou ' + l.n + ' (' + l.r + '): +' + l.xp + ' XP, +' + l.gem + ' ◆, ' + l.rol + ' rolagem(ns).'; },
    quebrou: function(l){ return l.n + ' quebrou' + (l.why === 'trancado' ? ' no relógio' : '') + '. ' + dn(l.d) + ' em corrupção ' + l.corr + '.'; },
    sumiu: function(l){ return l.cham ? 'O Portal do Chamado fechou no veredito.' : l.n + ' foi fechado por outra guilda.'; },
    virada: function(l){ return 'O briefing de ' + l.n + ' mudou.'; },
    reav: function(l){ return 'Reavaliação para a Licença ' + l.para + ' nasceu: ' + l.n + '.'; },
    'reav-fim': function(l){ return 'Reavaliação ' + (l.ok ? 'aprovada' : 'não passou') + (l.nota != null ? ' (nota ' + l.nota + ')' : '') + '.'; },
    beta: function(){ return 'Você chegou à Cidade.'; }
  };
  function dn(d){ return (CY.DMAP[d] || {n: d}).n; }
  App.cyMsgs = function(n){ return (C().log || []).slice(-(n || 24)).reverse().filter(function(l){ return LOGT[l.k]; }).map(function(l){ return {k: l.k, at: l.at, t: LOGT[l.k](l)}; }); };
  App.cyPhoneInner = function(){
    var L = (C().log || []).slice(-24).reverse().filter(function(l){ return LOGT[l.k]; });
    return '<div class="cy-phone-scr">'
      + (L.length ? L.map(function(l){ var t = new Date(l.at); return '<div class="cy-msg cy-m-' + l.k + '"><span class="mono">' + String(t.getDate()).padStart(2, '0') + '/' + String(t.getMonth() + 1).padStart(2, '0') + ' ' + String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0') + '</span><p>' + U.esc(LOGT[l.k](l)) + '</p></div>'; }).join('') : '<p class="dim" style="font-size:13.5px">Sem mensagens. O Sistema escreve quando algo acontece na Cidade.</p>')
      + '</div>';
  };
  App.cyPhoneHTML = function(){ return '<section class="win cy-phone"><div class="win-h">' + U.icon('journal') + 'Celular</div>' + App.cyPhoneInner() + '</section>'; };

  /* relógio do Trancado na janela aberta */
  setInterval(function(){ var el = document.querySelector('.cy-lock'); if (!el) return; var t = el.querySelector('.cy-lockt'); if (t) t.textContent = U.fmtDur(Date.parse(el.getAttribute('data-lock')) - Date.now()); }, 15000);

  /* a Licença também mora no Perfil */
  var oldPerfil = App.V.perfil;
  if (oldPerfil) App.V.perfil = function(){ var h = oldPerfil.apply(this, arguments); return E.cityOn(App.S) && App.city && App.city.since ? h + App.cyLicCard() : h; };
})();
