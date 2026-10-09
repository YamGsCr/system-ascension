/* ===== CIDADE · motor: o documento city (o 4º save na nuvem) e as contas que o mapa e o radar usam =====
   O documento city mora separado do progresso (core) para o save principal não chegar ao limite de 250 KB.
   Ele só é gravado depois que a Cidade beta é ligada nos Ajustes; save do v13 (três documentos) abre sem ele. */
E.CITY_LOG_MAX = 300;     /* entradas de histórico guardadas no documento */
E.CITY_SOFT = 200000;     /* aviso nos Ajustes antes do limite duro de 250 KB */

E.newCity = function(){ return {_u: '', v: SYS.CITY.V, since: '', dist: {}, portals: [], log: []}; };
E.newDist = function(){ return {corr: 0, closed: 0}; };

/* completa um documento que veio do cache, da nuvem ou de um arquivo: campos que faltam, distritos que faltam, versão */
E.cityFill = function(C){
  C = (C && typeof C === 'object' && !Array.isArray(C)) ? C : E.newCity();
  E.fill(C, E.newCity());
  if (!C.dist || typeof C.dist !== 'object' || Array.isArray(C.dist)) C.dist = {};
  if (!Array.isArray(C.portals)) C.portals = [];
  if (!Array.isArray(C.log)) C.log = [];
  SYS.CITY.DIST.forEach(function(d){
    var x = C.dist[d.id];
    if (!x || typeof x !== 'object') x = C.dist[d.id] = E.newDist();
    E.fill(x, E.newDist());
    x.corr = Math.max(0, Math.min(3, Math.round(+x.corr) || 0));
    x.closed = Math.max(0, Math.round(+x.closed) || 0);
  });
  return E.cityMigrate(C);
};
/* versões do documento: hoje só existe a 1. Uma versão nova acrescenta um passo aqui, nunca apaga dado */
E.cityMigrate = function(C){
  if (!C.v || C.v < 1) C.v = 1;
  return C;
};
/* mantém o documento longe do limite: histórico com teto */
E.cityPrune = function(C){
  if (C && Array.isArray(C.log) && C.log.length > E.CITY_LOG_MAX) C.log = C.log.slice(-E.CITY_LOG_MAX);
};
E.cityOn = function(S){ return !!(S && S.settings && S.settings.cityBeta); };

/* profundidade do distrito: cada 5 portais fechados sobem 1 nível, de 1 a 10 */
E.cityDepth = function(closed){ return Math.min(10, 1 + Math.floor((closed || 0) / 5)); };
E.cityDist = function(C, id){ return (C && C.dist && C.dist[id]) || E.newDist(); };
E.cityOpen = function(C, id){ return ((C && C.portals) || []).filter(function(p){ return p && p.d === id && p.st !== 'closed'; }); };

/* Estação 1: a contagem começa na Noite dos Portais Vermelhos (decisão 13) */
E.cityEstacao = function(today){
  var e = SYS.CITY.CONF.estacao1, d = U.daysBetween(today, e.inicio);
  if (d > 0) return {fase: 'antes', dias: d, e: e};
  var passou = -d, sem = Math.floor(passou / 7) + 1;
  if (sem > e.semanas) return {fase: 'fim', dias: passou, e: e};
  return {fase: 'agora', dias: passou, semana: sem, e: e};
};
