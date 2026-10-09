/* ===== SYSTEM REGISTRY ===== */
window.SYS = { RES:{}, LIB:{}, WAYS:[], WAYMAP:{}, ACH:[], TITLES:[], SYSSHOP:[], DAILIES:[], CERTS:[], RULES:[], SKINS:[], NAMECARDS:[], FRAMES:[], GOAL_SUGGESTIONS:[], MILESTONES:[] };
SYS.res = function(o){ Object.assign(SYS.RES, o); };
SYS.lib = function(o){ Object.assign(SYS.LIB, o); };
SYS.way = function(w){ w.arcs = w.arcs || []; w.gates = w.gates || []; w.shop = w.shop || []; SYS.WAYS.push(w); SYS.WAYMAP[w.id] = w; };
SYS.arc = function(wayId, arc){ SYS.WAYMAP[wayId].arcs.push(arc); };
SYS.gate = function(wayId, g){ SYS.WAYMAP[wayId].gates.push(g); };
SYS.shop = function(wayId, items){ SYS.WAYMAP[wayId].shop.push.apply(SYS.WAYMAP[wayId].shop, items); };
function yt(q){ return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q); }

/* ===== v5 · técnicas a investigar, escolhas de trilha e acréscimos de estudo =====
   SYS.tech({ID:[[nome, tipo], ...]})         → n.tk (só o nome; o "como" é do jogador)
   SYS.stAdd({ID:['tópico', ...]})            → acrescenta ao FINAL de n.st (nunca reordena: o progresso é salvo por índice)
   SYS.choice({key, way, n, q, why, opts})     → escolha real entre ecossistemas que não se complementam
   SYS.track(ID, key, {opt:{st:[], tk:[]}})    → assuntos próprios de cada opção dentro do nó */
SYS.CHOICES = {}; SYS.CHOICE_ORDER = []; SYS._bad = [];
SYS.TKKINDS = ['técnica','notação','ferramenta','método','norma','referência'];
SYS.nodeById = function(id){
  for (var i = 0; i < SYS.WAYS.length; i++) { var arcs = SYS.WAYS[i].arcs; for (var j = 0; j < arcs.length; j++) { var ns = arcs[j].nodes; for (var k = 0; k < ns.length; k++) if (ns[k].id === id) return ns[k]; } }
  return null;
};
SYS.tech = function(map){ Object.keys(map).forEach(function(id){ var n = SYS.nodeById(id); if (!n) { SYS._bad.push('tech:' + id); return; } n.tk = (n.tk || []).concat(map[id]); }); };
SYS.stAdd = function(map){ Object.keys(map).forEach(function(id){ var n = SYS.nodeById(id); if (!n) { SYS._bad.push('stAdd:' + id); return; } n.st = n.st.concat(map[id]); }); };
SYS.choice = function(c){ c.nodes = []; SYS.CHOICES[c.key] = c; SYS.CHOICE_ORDER.push(c.key); };
SYS.track = function(id, key, per){
  var n = SYS.nodeById(id), c = SYS.CHOICES[key];
  if (!n || !c) { SYS._bad.push('track:' + id + ':' + key); return; }
  (n.chx = n.chx || []).push({key:key, per:per}); c.nodes.push(id);
};

/* v9 · gatilho de skill: "não antes de" nos nós avançados (aviso, não trava) */
SYS.nb = function(map){ Object.keys(map).forEach(function(id){ var n = SYS.nodeById(id); if (!n) { SYS._bad.push('nb:' + id); return; } n.nb = map[id]; }); };
