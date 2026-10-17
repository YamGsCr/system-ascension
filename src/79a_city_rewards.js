/* ===== CIDADE · Recompensas, parte 1: documento v3, Relíquias, caixas em par e maldições, Fundo e vales, títulos =====
   Tudo que sorteia usa semente própria (a semente da Cidade + o id da coisa): abrir de novo não muda o resultado.
   O que vai para o progresso (chaves, cosméticos, títulos de bairro) fica no core; o resto mora no documento city. */
(function(){
  var CY = SYS.CITY, RK = ['E', 'D', 'C', 'B', 'A', 'S'], H1 = 3600000, D1 = 24 * H1;
  function iso(t){ return new Date(t).toISOString(); }
  function C0(){ return App.city; }
  function rar(i){ return CY.RARS[Math.max(0, Math.min(5, i))]; }
  function ri(r){ return Math.max(0, CY.RARS.indexOf(r)); }
  E.cyUid = function(C, p){ return (p || 'i') + (C.nid = (C.nid || 0) + 1); };

  /* ---------- documento v3 ---------- */
  var oldNew = E.newCity;
  E.newCity = function(){
    var c = oldNew();
    c.wish = []; c.secreta = []; c.fundo = {fixo: null, saldo: 0, mes: '', hist: [], dep: []}; c.mald = []; c.rel = []; c.eq = {}; c.quebras = []; c.trof = [];
    return c;
  };
  var oldMig = E.cityMigrate;
  E.cityMigrate = function(C){
    C = oldMig(C);
    if (C.v < 3) {
      var I = E.cyInv(C);
      (I.reliq || []).forEach(function(x){ C.rel.push(E.cyRelMake(C, {slot: x.slot, rar: x.r, d: x.d}, x.at, x.id)); });   /* as não identificadas ganham nome */
      I.reliq = [];
      (C.ecos || []).forEach(function(e){ if (!e.st) e.st = 'ativo'; if (!e.nv) e.nv = 1; });
      C.v = 3;
    }
    return C;
  };

  /* ---------- Relíquias ---------- */
  E.cyRelMake = function(C, it, at, id){
    id = id || E.cyUid(C, 'r');
    var R = E.cyRng('reliq:' + id), slot = it.slot || E.cyPick(R, CY.RELIQ.slots), d = CY.DMAP[it.d] ? it.d : E.cyPick(R, CY.DIST).id;
    var base = E.cyPick(R, CY.RELIQ.nomes[slot]), de = E.cyPick(R, CY.RELIQ.de[d]), lore = E.cyPick(R, CY.RELIQ.lore[d]);
    return {id: id, slot: slot, r: it.rar || 'epic', n: base + ' ' + de, lore: lore, d: d, at: at || iso(Date.now()), src: it.src || '', fonte: it.srcN || '', v: 0};
  };
  E.cyRelUni = function(C, id){ return (C.rel || []).some(function(x){ return x.uni === id; }); };
  /* a única da vez: quando o contexto do portal bate e a raridade alcança a dela, cai a única no lugar da comum */
  E.cyRelUnica = function(C, it){
    var ctx = it.ctx || {}, i = ri(it.rar);
    return CY.RELIQ.unicas.filter(function(u){
      if (E.cyRelUni(C, u.id) || i < ri(u.r)) return false;
      return (u.ctx === 'tranc' && ctx.tranc) || (u.ctx === 'biblioteca' && it.d === 'biblioteca') || (u.ctx === 'corrompido' && ctx.corr) || (u.ctx === 'raid' && ctx.raid) || (u.ctx === 'chefe' && ctx.chefe);
    })[0] || null;
  };
  E.cyRelGive = function(C, it, at){
    var u = E.cyRelUnica(C, it), x;
    if (!u && (C.rel || []).filter(function(r){ return !r.uni && !r.origem; }).length >= CY.RELIQ.max) {   /* Relíquias cheias: a nova vira materiais, como o vale que vira ◆ */
      var I = E.cyInv(C), n = CY.RELIQ.desm[ri(it.rar)] || 1, got = {};
      for (var q = 0; q < n; q++) { var m = q === 0 && ri(it.rar) >= 3 ? 'fio' : ['pedra', 'lixa', 'dado'][q % 3]; got[m] = (got[m] || 0) + 1; I.mat[m] = (I.mat[m] || 0) + 1; }
      return {n: 'Relíquia desmanchada (cheias)', cheia: got};
    }
    if (u) x = {id: E.cyUid(C, 'r'), slot: u.slot, r: u.r, n: u.n, lore: u.look, d: it.d, at: at, src: it.src || '', fonte: it.srcN || '', v: 0, uni: u.id};
    else x = E.cyRelMake(C, it, at);
    if (it.src) x.src = it.src;
    C.rel.push(x);
    return x;
  };
  E.cyEquip = function(C, id){
    var x = (C.rel || []).filter(function(r){ return r.id === id; })[0]; if (!x || !x.slot) return false;
    C.eq = C.eq || {};
    if (C.eq[x.slot] === id) delete C.eq[x.slot]; else C.eq[x.slot] = id;
    return true;
  };
  E.cyEquipped = function(C){ var out = {}; Object.keys((C && C.eq) || {}).forEach(function(s){ var x = (C.rel || []).filter(function(r){ return r.id === C.eq[s]; })[0]; if (x) out[s] = x; }); return out; };

  /* ---------- itens novos que o drop e as caixas entregam ---------- */
  var oldGive = E.cyGive;
  E.cyGive = function(C, S, it, at){
    if (it.k === 'reliq') { var x = E.cyRelGive(C, it, at); it.got = x.n; it.uni = x.uni || ''; if (x.cheia) it.virou = 1; return 'inv'; }
    if (it.k === 'cosm') { var own = S.owned[it.kind] || (S.owned[it.kind] = []); if (own.indexOf(it.id) < 0) own.push(it.id); E.cyTrof(C, {k: 'cosm', id: it.id, at: at}); return 'core'; }
    if (it.k === 'titulo') { var T = S.owned.cyt || (S.owned.cyt = {}); if (!T[it.id]) T[it.id] = U.today(); E.cyTrof(C, {k: 'titulo', id: it.id, at: at}); return 'core'; }
    if (it.k === 'perg') { var r0 = oldGive(C, S, it, at); var I = E.cyInv(C), last = I.perg[I.perg.length - 1]; if (last && it.way) last.way = it.way; if (last && it.cx) last.cx = it.cx; return r0; }
    return oldGive(C, S, it, at);
  };
  E.cyTrof = function(C, o){ (C.trof || (C.trof = [])).push(o); if (C.trof.length > 400) C.trof = C.trof.slice(-400); };

  /* ---------- caixas: o par Abençoada e Amaldiçoada ---------- */
  function gi(g){ return Math.max(0, CY.GRAUS.indexOf(g)); }
  /* o que pode entrar na Lista de Desejos (até 5) e o grau de caixa que entrega cada coisa */
  E.cyDesejos = function(S){
    var out = [];
    ['E', 'D', 'C', 'B', 'A'].forEach(function(r){ out.push({key: 'chave:' + r, t: 'Chave de Dungeon · Rank ' + r, g: RK.indexOf(r) <= 1 ? 0 : 1, grupo: 'Chaves', it: {k: 'chave', rank: r}}); });
    CY.DIST.forEach(function(d){ d.ruas.forEach(function(rua, i){ out.push({key: 'passe:' + d.id + ':' + i, t: 'Passe · ' + rua + ' (' + d.curto + ')', g: 0, grupo: 'Passes de vertente', it: {k: 'passe', way: d.way, d: d.id, rua: i}}); }); });
    CY.TITULOS.filter(function(t){ return t.d; }).forEach(function(t){ out.push({key: 'tit:' + t.id, t: 'Título · ' + t.n, g: 1, grupo: 'Títulos de bairro', it: {k: 'titulo', id: t.id}, own: function(S){ return !!(S.owned.cyt && S.owned.cyt[t.id]); }}); });
    function cos(list, kind, r){ return list.filter(function(x){ return !x.free && !x.ach && !x.lic && (x.c > 0 || x.cy); }).forEach(function(x){
      var rr = x.r || (x.c >= 400 ? 'uncommon' : 'common'), g = ri(rr) <= 1 ? 0 : ri(rr) <= 3 ? 1 : 2;
      out.push({key: 'cos:' + kind + ':' + x.id, t: (kind === 'namecards' ? 'Namecard · ' : 'Moldura · ') + x.n, g: g, grupo: 'Cosméticos', it: {k: 'cosm', kind: kind, id: x.id}, own: function(S){ return E.ownsCosmetic(S, list, x.id, kind); }});
    }); }
    cos(SYS.NAMECARDS, 'namecards'); cos(SYS.FRAMES, 'frames');
    return out;
  };
  E.cyDesejo = function(S, key){ return E.cyDesejos(S).filter(function(x){ return x.key === key; })[0] || null; };
  E.cyWishSet = function(C, keys){ C.wish = (keys || []).filter(function(k, i, a){ return a.indexOf(k) === i; }).slice(0, CY.CONF.desejos); return C.wish; };

  /* "o Caminho mais parado": o de menos portais fechados no bairro dele, e de menos XP */
  E.cyParado = function(C, S){
    var D = App.D || {wayXP: {}};
    return SYS.WAYS.slice().sort(function(a, b){
      var da = E.cyDistOf(a.id), db = E.cyDistOf(b.id), ca = da ? E.cityDist(C, da.id).closed : 0, cb = db ? E.cityDist(C, db.id).closed : 0;
      return ca - cb || ((D.wayXP || {})[a.id] || 0) - ((D.wayXP || {})[b.id] || 0) || (a.id < b.id ? -1 : 1);
    })[0];
  };
  /* "a diária que mais falha": a que mais ficou sem marcar nos últimos 30 dias */
  E.cyDiariaFalha = function(S){
    var cnt = {}, t = U.today(), ids = S.settings.dailies || [];
    for (var i = 1; i <= 30; i++) { var r = S.daily[U.addDays(t, -i)]; if (!r || r.rest || r.frozen) continue; ids.forEach(function(id){ if (!(r.q || {})[id]) cnt[id] = (cnt[id] || 0) + 1; }); }
    var best = ids.slice().sort(function(a, b){ return (cnt[b] || 0) - (cnt[a] || 0); })[0], d = SYS.DAILIES.filter(function(x){ return x.id === best; })[0];
    return best && cnt[best] ? (d ? d.n || d.t || best : best) : '';
  };
  function abencoada(C, S, R, g){
    var W = (C.wish || []).map(function(k){ return E.cyDesejo(S, k); }).filter(function(x){ return x && !(x.own && x.own(S)) && x.g <= gi(g); });
    if (W.length) { var top = Math.max.apply(null, W.map(function(x){ return x.g; })); var w = E.cyPick(R, W.filter(function(x){ return x.g === top; })); return {it: w.it, t: w.t, desejo: w.key}; }
    if (CY.CX[g].dourada) return {it: {k: 'mat', id: 'dourada'}, t: 'Chave Dourada'};
    var rg = CY.CX[g].gem, n = rg[0] + Math.round(R() * (rg[1] - rg[0]) / 5) * 5;
    return {it: {k: 'gem', n: n}, t: n + ' ◆ (sem Lista de Desejos)'};
  }
  function amaldicoada(C, S, R, g){
    var M = CY.CX[g].mal, needs = [];
    var worst = CY.DIST.map(function(d){ return [d.id, E.cityDist(C, d.id).corr || 0]; }).sort(function(a, b){ return b[1] - a[1]; })[0];
    if (worst[1] > 0) needs.push({w: 3, it: {k: 'mat', id: M.purif >= 3 ? 'purif' : 'purif1'}, t: (M.purif >= 3 ? 'Purificação' : 'Purificação Menor'), why: 'o bairro mais corrompido é ' + CY.DMAP[worst[0]].n, alvo: worst[0]});
    var way = E.cyParado(C, S);
    if (way) needs.push({w: 2, it: {k: 'perg', tipo: 'inimigo', rank: M.perg, way: way.id}, t: CY.PERG.inimigo + ' · ' + M.perg, why: 'o Caminho mais parado é ' + way.name});
    var dly = E.cyDiariaFalha(S), kr = E.cyPick(R, M.chaves);
    needs.push({w: 1, it: {k: 'chave', rank: kr}, t: 'Chave de Dungeon · Rank ' + kr, why: dly ? 'a diária que mais falha é ' + dly : 'a dungeon que você mais adia'});
    var n = needs[E.cyWeighted(R, needs.map(function(x){ return x.w; }))];
    return {it: n.it, t: n.t, why: n.why, alvo: n.alvo || ''};
  }
  /* o conteúdo do par sai da semente: abrir agora ou daqui a uma semana, é o mesmo par */
  E.cyCaixaPar = function(C, S, box){
    var R = E.cyRng('caixa:' + (C.seed || '') + ':' + box.id), g = CY.CX[box.grau] ? box.grau : 'menor';
    var ab = box.so ? null : abencoada(C, S, R, g), am = amaldicoada(C, S, R, g), m = CY.MALD[Math.floor(R() * CY.MALD.length)];
    return {ab: ab, am: am, mald: m.id, grau: g};
  };
  E.cyCaixaAbrir = function(C, S, boxId, qual){
    var I = E.cyInv(C), box = I.caixas.filter(function(b){ return b.id === boxId; })[0]; if (!box) return {ok: false, msg: 'Essa caixa não está mais aqui.'};
    var par = E.cyCaixaPar(C, S, box), at = iso(Date.now());
    if (qual === 'ab' && !par.ab) return {ok: false, msg: 'Só a Amaldiçoada veio neste par.'};
    var pick = qual === 'ab' ? par.ab : par.am, other = qual === 'ab' ? par.am : par.ab;
    I.caixas = I.caixas.filter(function(b){ return b.id !== boxId; });
    var it = Object.assign({}, pick.it, {cx: box.id});
    var core = E.cyGive(C, S, it, at) === 'core';
    var out = {ok: true, qual: qual, grau: par.grau, t: pick.t, it: it, why: pick.why || '', sussurro: other ? other.t : '', core: core};
    if (qual === 'am') {
      out.mald = E.cyMaldAdd(C, S, par.mald, {cx: box.id, it: it, alvo: pick.alvo});
      if (out.mald && out.mald.core) out.core = true;
    }
    E.cyLog(C, {k: 'caixa', qual: qual, grau: par.grau, t: pick.t, sus: out.sussurro, mald: qual === 'am' ? par.mald : ''});
    return out;
  };

  /* ---------- maldições ---------- */
  E.cyMald = function(C){ return (C.mald || []).filter(function(m){ return !m.fim; }); };
  E.cyMaldTem = function(C, k){ return E.cyMald(C).filter(function(m){ return m.k === k && (m.usos == null || m.usos > 0); })[0] || null; };
  /* o bairro mais abandonado: o de menos portais fechados (e o primeiro da Bíblia no empate) */
  E.cyAbandonado = function(C){ return CY.DIST.slice().sort(function(a, b){ return E.cityDist(C, a.id).closed - E.cityDist(C, b.id).closed; })[0]; };
  E.cyMaldAdd = function(C, S, k, ctx){
    var M = CY.MALDMAP[k]; if (!M) return null;
    var now = Date.now(), m = {id: E.cyUid(C, 'm'), k: k, at: iso(now), ate: iso(now + Math.min(CY.MALD_MAX, M.dias || CY.MALD_MAX) * D1), cx: (ctx || {}).cx || ''};
    if (M.usos) m.usos = M.usos;
    var it = (ctx || {}).it || {};
    if (it.k === 'perg' && it.tipo === 'inimigo') m.task = 'perg';
    if (it.k === 'mat' && /^purif/.test(it.id)) m.task = 'purif';
    var R = E.cyRng('mald:' + C.seed + ':' + m.id);
    if (k === 'posseiro') {
      var d = E.cyAbandonado(C), p = E.cyMakeEsp(C, S, {kind: 'posse', d: d.id, rank: 'C', seed: 'posse:' + m.id});
      if (p) { p.posse = 1; p.due = iso(now + 3650 * D1); m.p = p.id; m.d = d.id; m.ate = ''; }
    }
    if (k === 'insonia') {
      var dd = E.cyPick(R, CY.DIST); m.d = dd.id;
      E.cyOpen(C).forEach(function(p){ if (p.d === dd.id && !p.in && !p.posse) { var left = Date.parse(p.due) - now; if (left > 0) p.due = iso(now + left / 2); } });
    }
    if (k === 'sirene') {
      var ds = E.cyPick(R, CY.DIST), ps = E.cyMakeEsp(C, S, {kind: 'sirene', d: ds.id, rank: CY.SIRENE.rank, seed: 'sirene:' + m.id});
      if (ps) { ps.sirene = 1; ps.due = iso(now + CY.SIRENE.prazo * H1); m.p = ps.id; m.d = ds.id; }
    }
    C.mald.push(m);
    E.cyLog(C, {k: 'maldicao', mk: k, d: m.d || ''});
    return m;
  };
  E.cyMaldFim = function(C, m, why){ if (m && !m.fim) { m.fim = iso(Date.now()); m.why = why || 'fim'; E.cyLog(C, {k: 'maldicao-fim', mk: m.k}); } };
  E.cyMaldUsar = function(C, k){ var m = E.cyMaldTem(C, k); if (!m) return; if (m.usos != null) m.usos--; if (m.usos != null && m.usos <= 0) E.cyMaldFim(C, m, 'usos'); };
  /* a caixa pedia uma coisa (o portal do pergaminho, a purificação): cumprida, a maldição dela acaba antes */
  E.cyMaldCumpriu = function(C, cx){ E.cyMald(C).forEach(function(m){ if (cx && m.cx === cx) E.cyMaldFim(C, m, 'cumpriu'); }); };
  E.cyMaldTick = function(C, now){
    E.cyMald(C).forEach(function(m){
      if (m.ate && now > Date.parse(m.ate)) E.cyMaldFim(C, m, 'prazo');
      if (m.p && !E.cyPortal(C, m.p) && (m.k === 'posseiro' || m.k === 'sirene')) E.cyMaldFim(C, m, 'portal');
    });
    if ((C.mald || []).length > 40) C.mald = C.mald.filter(function(m){ return !m.fim; }).concat(C.mald.filter(function(m){ return m.fim; }).slice(-20));
  };

  /* ---------- Fundo de Recompensas ---------- */
  function mesSeg(m){ var y = +m.slice(0, 4), mo = +m.slice(5, 7) + 1; if (mo > 12) { mo = 1; y++; } return y + '-' + String(mo).padStart(2, '0'); }
  E.cyFundoMensal = function(C){ var f = C.fundo || {}; return f.fixo != null && f.fixo >= 0 ? +f.fixo : CY.FUNDO.porRank[E.cyLic(C).r] || CY.FUNDO.porRank.E; };
  /* todo mês o Fundo enche com o valor mensal; a sobra passa adiante até 2 meses de Fundo */
  E.cyFundoTick = function(C){
    var f = C.fundo || (C.fundo = {fixo: null, saldo: 0, mes: '', hist: [], dep: []}), m = U.today().slice(0, 7), mens = E.cyFundoMensal(C), changed = false;
    if (!f.mes) { f.mes = m; f.saldo = (f.saldo || 0) + mens; return true; }
    for (var i = 0; i < 36 && f.mes < m; i++) { f.mes = mesSeg(f.mes); f.saldo = Math.min((f.saldo || 0) + mens, Math.max(f.saldo || 0, mens * CY.FUNDO.meses)); changed = true; }
    return changed;
  };
  E.cyFundoDeposito = function(C, v){ v = Math.round((+v || 0) * 100) / 100; if (v <= 0) return false; var f = C.fundo; f.saldo = Math.round(((f.saldo || 0) + v) * 100) / 100; f.dep.push({at: U.today(), v: v}); return true; };
  E.cyFundoFixo = function(C, v){ var f = C.fundo; if (v === '' || v == null) { f.fixo = null; return true; } v = Math.max(0, Math.round(+v || 0)); f.fixo = v; return true; };

  /* ---------- vales ---------- */
  E.cyVale = function(C, id){ return (E.cyInv(C).vales || []).filter(function(v){ return v.id === id; })[0] || null; };
  E.cyValeLiberado = function(S){ return !(S.pz && E.pzOpen(S).length); };
  E.cyResgatar = function(C, S, id, o){
    var v = E.cyVale(C, id); if (!v) return {ok: false, msg: 'Vale não encontrado.'};
    if (!E.cyValeLiberado(S)) return {ok: false, msg: 'Prenda aberta na Zona congela o resgate, como já faz com as lojas.'};
    if (v.cat === 'secreto' && !v.rev) return {ok: false, msg: 'Abra o Vale Secreto primeiro.'};
    o = o || {}; var oque = String(o.oque || (v.rev ? v.rev.n : '')).trim().slice(0, 120), at = U.today(), I = E.cyInv(C);
    if (oque.length < 3) return {ok: false, msg: 'Escreva o que você comprou (ou o que vai fazer com o tempo).'};
    if (v.cat === 'tempo') {
      I.vales = I.vales.filter(function(x){ return x.id !== id; });
      C.fundo.hist.push({at: at, cat: 'tempo', o: oque, v: 0, r: v.r, dur: CY.TEMPO[ri(v.r)]});
      E.cyLog(C, {k: 'resgate', cat: 'tempo', o: oque, v: 0});
      return {ok: true, v: 0};
    }
    var custo = Math.round((+String(o.custo || '').replace(',', '.') || 0) * 100) / 100, f = C.fundo;
    if (!(custo > 0)) return {ok: false, msg: 'Quanto custou? O valor sai do Fundo.'};
    if (custo > v.teto) return {ok: false, msg: 'Passa do teto do vale (R$ ' + v.teto + '). Vale nunca vira dívida.'};
    if (custo > (f.saldo || 0)) return {ok: false, curto: true, msg: 'Saldo curto: o Fundo tem R$ ' + U.num(f.saldo || 0) + '. O vale espera o Fundo encher, ou vira ◆ agora.'};
    f.saldo = Math.round((f.saldo - custo) * 100) / 100;
    I.vales = I.vales.filter(function(x){ return x.id !== id; });
    f.hist.push({at: at, cat: v.cat, o: oque, v: custo, r: v.r});
    var rel = null;
    if (o.origem) { rel = {id: E.cyUid(C, 'r'), slot: null, r: 'common', n: oque, lore: 'Comprado com um vale ' + (CY.VALE_CAT[v.cat] || {n: v.cat}).n.toLowerCase() + ' em ' + U.fmtDate(at) + '.', d: v.d || '', at: iso(Date.now()), src: 'vale', v: 0, origem: true}; C.rel.push(rel); }
    E.cyLog(C, {k: 'resgate', cat: v.cat, o: oque, v: custo});
    return {ok: true, v: custo, rel: rel};
  };
  E.cyValeGem = function(C, id){
    var v = E.cyVale(C, id); if (!v || v.comprado) return 0;
    var g = CY.DROP.valeGem[ri(v.r)] || 0, L = E.cyLed(C); L.gem += g;
    var I = E.cyInv(C); I.vales = I.vales.filter(function(x){ return x.id !== id; });
    E.cyLog(C, {k: 'vale-gem', cat: v.cat, gem: g});
    return g;
  };
  /* o Vale Secreto sorteia um desejo da Lista Secreta que caiba no teto; se nenhum couber, vira vale de Lazer */
  E.cyValeAbrir = function(C, id){
    var v = E.cyVale(C, id); if (!v || v.cat !== 'secreto' || v.rev) return null;
    var cabe = (C.secreta || []).filter(function(w){ return +w.preco <= v.teto; });
    if (!cabe.length) { v.cat = 'lazer'; v.virou = 1; return {lazer: true}; }
    var w = E.cyPick(E.cyRng('secreto:' + C.seed + ':' + v.id), cabe);
    v.rev = {n: w.n, preco: +w.preco};
    C.secreta = C.secreta.filter(function(x){ return x.id !== w.id; });
    return {rev: v.rev};
  };
  E.cySecretaAdd = function(C, n, preco){
    n = String(n || '').trim().slice(0, 80); preco = Math.round((+String(preco || '').replace(',', '.') || 0) * 100) / 100;
    if (n.length < 2 || !(preco > 0)) return false;
    if ((C.secreta || []).length >= CY.SECRETA_MAX) return false;
    var list = C.secreta || (C.secreta = []), pos = Math.floor(E.cyRng('emb:' + C.seed + ':' + list.length + ':' + n)() * (list.length + 1));
    list.splice(pos, 0, {id: E.cyUid(C, 'w'), n: n, preco: preco});   /* entra embaralhado */
    return true;
  };

  /* ---------- títulos e cosméticos da Cidade no Sistema ---------- */
  var oldBuild = E.build;
  E.build = function(){                                             /* os índices de títulos nascem no App.init */
    var r = oldBuild.apply(this, arguments);
    CY.TITULOS.forEach(function(t){
      if (E.TITLEMAP[t.id]) return;
      var x = {id: t.id, n: t.n, r: t.r, src: t.lic ? 'Cidade · Licença ' + t.lic : 'Cidade · ' + CY.DMAP[t.d].n, cy: t.lic ? 'lic' : 'd', lic: t.lic, d: t.d};
      E.TITLES.push(x); E.TITLEMAP[x.id] = x;
    });
    return r;
  };
  var oldTU = E.titleUnlocked;
  E.titleUnlocked = function(S, D, t){
    if (t && t.cy === 'lic') return !!(App.city && E.cityOn(S) && RK.indexOf(E.cyLic(App.city).r) >= RK.indexOf(t.lic));
    if (t && t.cy === 'd') return !!(S.owned.cyt && S.owned.cyt[t.id]);
    return oldTU(S, D, t);
  };
  CY.COSM.forEach(function(c){
    var x = {id: c.id, n: c.n, c: 0, r: c.r, cy: c.lic ? 'Licença ' + c.lic + ' na Cidade' : 'Forja: 5 fragmentos de ' + CY.DMAP[c.d].curto, lic: c.lic, d: c.d};
    (c.kind === 'namecards' ? SYS.NAMECARDS : SYS.FRAMES).push(x);
  });
  var oldOwn = E.ownsCosmetic;
  E.ownsCosmetic = function(S, list, id, kind){
    if (/^fr_lic_/.test(id)) { var r = id.slice(7); return !!(App.city && E.cityOn(S) && RK.indexOf(E.cyLic(App.city).r) >= RK.indexOf(r)); }
    return oldOwn(S, list, id, kind);
  };
  if (App.cosBtn) {
    var oldBtn = App.cosBtn;
    App.cosBtn = function(kind, it, cs, eq){ if (it && it.cy && !E.ownsCosmetic(App.S, kind === 'namecards' ? SYS.NAMECARDS : SYS.FRAMES, it.id, kind)) return '<span class="chip">' + U.icon('lock') + U.esc(it.cy) + '</span>'; return oldBtn.apply(this, arguments); };
  }
  /* o desenho dos cosméticos de bairro e das molduras da Licença, na cor de cada Caminho e de cada rank */
  (function(){
    var css = '';
    CY.DIST.forEach(function(d){
      var c = (SYS.WAYMAP[d.way] || {}).color || '#4fb3ff';
      css += '.nc-cy_' + d.id + '{background:radial-gradient(ellipse at 85% 120%,' + c + '66,transparent 60%),repeating-linear-gradient(90deg,transparent 0 18px,' + c + '22 18px 19px),linear-gradient(135deg,' + c + '33,transparent 70%)}';
      css += '.fr-cy_' + d.id + '{background:conic-gradient(from 30deg,' + c + ',#ffffff55,' + c + ',#00000066,' + c + ');box-shadow:0 0 16px ' + c + '}';
    });
    RK.forEach(function(r){ var c = SYS.RANKC[r] || '#9aa6b8'; css += '.fr-lic_' + r + '{background:linear-gradient(135deg,' + c + ',#ffffff88 45%,' + c + ' 55%,#00000055);box-shadow:0 0 12px ' + c + '}'; });
    var st = document.createElement('style'); st.id = 'cy-cosm'; st.textContent = css; document.head.appendChild(st);
  })();

  /* chaves continuam na loja, 50% mais caras, para quem tem a Cidade ligada (Decisão 4) */
  Object.keys(SYS.KEYPRICE).forEach(function(k){
    var base = SYS.KEYPRICE[k];
    Object.defineProperty(SYS.KEYPRICE, k, {enumerable: true, configurable: true, get: function(){ return App.S && E.cityOn(App.S) ? Math.round(base * CY.CONF.chaveMult / 5) * 5 : base; }});
  });
})();
