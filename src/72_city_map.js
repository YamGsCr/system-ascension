/* ===== CIDADE · mapa: bairros orgânicos encostados, rio, o Centro na praça e névoa nas bordas =====
   A geometria-base é em paisagem (1000×700). Em tela em pé (celular), a mesma cidade gira 90° e os textos
   continuam de pé: a cidade inteira cabe sem rolar. O desenho fixo (bordas tortas, quadras, ruas, rio, pontes,
   avenidas e névoa) sai de sementes fixas e fica em cache por orientação; o que muda (corrupção, seleção e
   portais) é montado a cada desenho. Os quatro cantos são névoa: é ali que o HUD da tela fica. */
(function(){
  var CY = SYS.CITY;

  /* ícones novos, no mesmo traço dos SYS.ICONS (24×24, só contorno) */
  var IC = {
    city: 'M3 21V10l4-3v14 M7 21V4h6v17 M13 21V9h4l4 3v9 M2 21h20 M9.5 7.5h1 M9.5 11h1 M9.5 14.5h1 M16.5 13h1 M16.5 16.5h1',
    radar: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 12l6.4-6.4 M12 3v2 M21 12h-2',
    phone: 'M7 2.5h10a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V4A1.5 1.5 0 0 1 7 2.5z M10 5h4 M11 18.5h2',
    d_servers: 'M5 3.5h14v5H5z M5 9.5h14v5H5z M5 15.5h14v5H5z M8 6h.01 M8 12h.01 M8 18h.01 M12 6h4 M12 12h4 M12 18h4',
    d_studio: 'M4 15v-3a8 8 0 0 1 16 0v3 M4 14.5h3.5v6H5a1 1 0 0 1-1-1z M20 14.5h-3.5v6H19a1 1 0 0 0 1-1z',
    d_pools: 'M8 2.5v12 M16 2.5v12 M8 6h8 M8 10h8 M2 17.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5 M2 21.5c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5',
    d_office: 'M4 21V6h9v15 M2 21h20 M7 9.5h3 M7 13h3 M7 16.5h3 M16 21v-8h4v8 M19.5 2.5a3 3 0 1 0 2 4.5a2.3 2.3 0 0 1-2-4.5z',
    d_agency: 'M3 9l9-5.5L21 9z M5 9v12 M19 9v12 M2.5 21h19 M8 12.5h8 M8 15.5h8 M8 18.5h8',
    d_library: 'M4.5 4h3.5v16H4.5z M10 4h3.5v16H10z M15.4 5.3l3.2-.8 3.4 14.7-3.2.8z M2.5 20.5h19',
    d_gallery: 'M3 8.5L12 3l9 5.5 M2 8.5h20 M3.5 21v-8a2.5 2.5 0 0 1 5 0v8 M9.5 21v-8a2.5 2.5 0 0 1 5 0v8 M15.5 21v-8a2.5 2.5 0 0 1 5 0v8 M2 21h20',
    d_center: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M12 3v4 M12 17v4 M3 12h4 M17 12h4',
    d_fog: 'M3 9c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0 M3 14c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0 M6 19c2-1.2 4-1.2 6 0s4 1.2 6 0'
  };
  Object.keys(IC).forEach(function(k){ SYS.ICONS[k] = IC[k]; });

  /* rótulos em até duas linhas: o nome inteiro, que é o que dá o clima (às 3h, às 23h, sem janela) */
  var ROT = {servidores: ['Sala de', 'Servidores'], estudio: ['Estúdio', 'sem Janela'], piscinas: ['Piscinas'], escritorio: ['Escritório', 'às 23h'],
    agencia: ['Agência', 'Fechada'], biblioteca: ['Biblioteca', 'às 3h'], galeria: ['Galeria', 'Coberta'], centro: ['Centro']};

  function f1(n){ return String(Math.round(n * 10) / 10); }
  var LW = 1000, LH = 700;

  /* ---------- geometria-base (paisagem) ---------- */
  var PT = {O1: [118, 96], O2: [352, 56], O3: [650, 52], O4: [884, 98], O5: [958, 250], O6: [962, 470], O7: [858, 640], O8: [410, 664], O9: [118, 610], O10: [42, 470], O11: [44, 250],
    C1: [440, 212], C2: [560, 212], C3: [610, 262], C4: [606, 350], C5: [660, 476], C6: [342, 474], C7: [394, 350], C8: [390, 262], Q: [392, 478]};
  /* bordas: tipo (out = beira da cidade, av = avenida entre bairros, cen = calçada do Centro, rio) e os pontos.
     Dois bairros vizinhos usam a mesma borda, então nunca sobra fresta entre eles */
  var BD = {
    o1: ['out', 'O1', [230, 50], 'O2'], o2: ['out', 'O2', [500, 40], 'O3'], o3: ['out', 'O3', [770, 48], 'O4'], o4: ['out', 'O4', [940, 160], 'O5'],
    o5: ['out', 'O5', [972, 360], 'O6'], o6: ['out', 'O6', [952, 548], [902, 598], 'O7'], o7: ['out', 'O7', [700, 668], [560, 654], 'O8'], o8: ['out', 'O8', [260, 668], 'O9'],
    o9: ['out', 'O9', [52, 560], 'O10'], o10: ['out', 'O10', [30, 360], 'O11'], o11: ['out', 'O11', [58, 168], 'O1'],
    a1: ['av', 'O2', [380, 120], [414, 172], 'C1'], a2: ['av', 'O3', [620, 120], [586, 172], 'C2'], a3: ['av', 'C8', [300, 252], [180, 240], 'O11'],
    a4: ['av', 'C3', [700, 252], [830, 238], 'O5'], a5: ['av', 'Q', [400, 560], 'O8'],
    c1: ['cen', 'C1', 'C8'], c2: ['cen', 'C1', 'C2'], c3: ['cen', 'C2', 'C3'], c4: ['cen', 'C8', 'C7', 'C6'], c5: ['cen', 'C3', 'C4', 'C5'],
    r1: ['rio', 'O10', [120, 458], [200, 474], [280, 486], 'C6'], r2: ['rio', 'C6', 'Q'], r3: ['rio', 'Q', [450, 470], [500, 478], [560, 486], 'C5'], r4: ['rio', 'C5', [760, 490], [860, 472], 'O6']
  };
  var ZN = {
    servidores: ['o1', 'a1', 'c1', 'a3', 'o11'], estudio: ['o2', 'a2', '-c2', '-a1'], piscinas: ['o3', 'o4', '-a4', '-c3', '-a2'],
    escritorio: ['-a3', 'c4', '-r1', 'o10'], agencia: ['a4', 'o5', '-r4', '-c5'], biblioteca: ['r1', 'r2', 'a5', 'o8', 'o9'],
    galeria: ['r3', 'r4', 'o6', 'o7', '-a5'], centro: ['c2', 'c3', 'c5', '-r3', '-r2', '-c4', '-c1']
  };
  var OUT = ['o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8', 'o9', 'o10', 'o11'];
  var RIO = [[-40, 462], [42, 470], [120, 458], [200, 474], [280, 486], [342, 474], [392, 478], [450, 470], [500, 478], [560, 486], [660, 476], [760, 490], [860, 472], [962, 470], [1040, 478]];
  var PONTES = [170, 392, 500, 800];
  var PRACA = [500, 300];
  var NEV = [938, 654];   /* o "???": um banco de névoa fora da cidade, no canto de baixo */
  /* grade de cada bairro: ângulo (graus) e passo das quadras */
  var GRADE = {servidores: [0, 24], estudio: [0, 30], piscinas: [-8, 32], escritorio: [6, 28], agencia: [-6, 28], biblioteca: [4, 26], galeria: [-3, 30]};
  /* rótulos: ícone no ponto e o nome embaixo, centrado. Cada orientação tem os seus pontos */
  var LB = {
    land: {servidores: [236, 104], estudio: [436, 84], piscinas: [772, 108], escritorio: [212, 300], agencia: [792, 300], biblioteca: [240, 524], galeria: [700, 528], centro: [500, 392]},
    port: {servidores: [548, 92], estudio: [588, 458], piscinas: [556, 750], escritorio: [338, 88], agencia: [340, 748], biblioteca: [136, 160], galeria: [130, 640], centro: [400, 592]}
  };

  function pt(x){ return typeof x === 'string' ? PT[x] : x; }
  function tp(or){ return or === 'port' ? function(p){ return [LH - p[1], p[0]]; } : function(p){ return [p[0], p[1]]; }; }

  /* borda com tremido: subdivide e empurra para o lado com a semente da própria borda */
  var JIT = {out: [6, 18], av: [2.2, 24], cen: [0, 0], rio: [0, 0]}, EDG = {}, EDR = {};
  function edge(name, raw){
    var memo = raw ? EDR : EDG; if (memo[name]) return memo[name];
    var b = BD[name], pts = b.slice(1).map(pt), j = raw ? [0, 0] : JIT[b[0]], out = [pts[0]];
    if (!j[0]) return (memo[name] = pts.slice());
    var R = U.seeded('borda:' + name);
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], c = pts[i], dx = c[0] - a[0], dy = c[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1, n = Math.max(1, Math.round(L / j[1])), nx = -dy / L, ny = dx / L;
      for (var k = 1; k < n; k++) { var t = k / n, o = (R() - 0.5) * 2 * j[0] * Math.sin(Math.PI * t); out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]); }
      out.push(c);
    }
    return (memo[name] = out);
  }
  function ring(list, raw){
    var out = [];
    list.forEach(function(s){ var rev = s.charAt(0) === '-', e = edge(rev ? s.slice(1) : s, raw).slice(); if (rev) e.reverse(); if (out.length) e.shift(); out = out.concat(e); });
    out.pop();
    return out;
  }
  function ptsStr(P){ return P.map(function(p){ return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  function pathStr(P, close){ return P.map(function(p, i){ return (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1]); }).join('') + (close ? 'Z' : ''); }
  function inside(P, x, y){ var c = false; for (var i = 0, j = P.length - 1; i < P.length; j = i++) { var a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
  function spans(P, y){
    var xs = [];
    for (var i = 0, j = P.length - 1; i < P.length; j = i++) { var a = P[i], b = P[j]; if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])); }
    xs.sort(function(m, n){ return m - n; });
    var out = []; for (var k = 0; k + 1 < xs.length; k += 2) out.push([xs[k], xs[k + 1]]);
    return out;
  }
  function rot(p, c, a){ var s = Math.sin(a), co = Math.cos(a), dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * co - dy * s, c[1] + dx * s + dy * co]; }
  function bbox(P){ var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; P.forEach(function(p){ x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); return [x0, y0, x1, y1]; }
  function centroid(P){ var b = bbox(P); return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]; }
  /* curva suave pelos pontos (Catmull-Rom) */
  function smooth(P){
    var d = 'M' + f1(P[0][0]) + ' ' + f1(P[0][1]);
    for (var i = 0; i < P.length - 1; i++) {
      var p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += 'C' + f1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
    }
    return d;
  }
  function lbl(or){ var port = or === 'port'; return {r: port ? 19 : 16, fs: port ? 25 : 19, lh: port ? 27 : 21}; }
  /* caixa ocupada pelo rótulo (para as ruas principais desviarem) */
  function lblBox(or, id){
    var a = LB[or][id], L = lbl(or), lines = ROT[id] || [id], w = Math.max.apply(null, lines.map(function(s){ return s.length; })) * L.fs * 0.6 + 20;
    var h = L.r * 2 + 6 + lines.length * L.lh + (or === 'land' ? 16 : 0) + 8;
    return [a[0] - w / 2, a[1] - L.r - 6, a[0] + w / 2, a[1] - L.r - 6 + h];
  }

  /* ruas principais (uma por vertente): faixas iguais ao longo do bairro, na direção da grade, desviando do rótulo.
     Faixa sem lugar (o rótulo ocupa tudo) procura no bairro inteiro, sem encostar nas ruas já escolhidas */
  function ruasOf(P, n, ang, boxes){
    var c = centroid(P), a = ang * Math.PI / 180, Pr = P.map(function(p){ return rot(p, c, -a); }), bb = bbox(Pr), M = 26;
    var bx = boxes.map(function(b){ return bbox([[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]].map(function(p){ return rot(p, c, -a); })); });
    var y0 = bb[1] + M, y1 = bb[3] - M, got = [];
    function seg(y){
      var best = null;
      spans(Pr, y).forEach(function(s){
        var segs = [[s[0] + 16, s[1] - 16]];
        bx.forEach(function(b){ if (y < b[1] - 6 || y > b[3] + 6) return; var nx = []; segs.forEach(function(g){ if (b[2] < g[0] || b[0] > g[1]) nx.push(g); else { if (b[0] - 8 > g[0]) nx.push([g[0], b[0] - 8]); if (b[2] + 8 < g[1]) nx.push([b[2] + 8, g[1]]); } }); segs = nx; });
        segs.forEach(function(g){ if (!best || g[1] - g[0] > best.L) best = {y: y, a: g[0], b: g[1], L: g[1] - g[0]}; });
      });
      return best;
    }
    for (var i = 0; i < n; i++) {
      var lo = y0 + (y1 - y0) * i / n, hi = y0 + (y1 - y0) * (i + 1) / n, mid = (lo + hi) / 2, pick = null;
      for (var y = lo + 4; y <= hi - 4; y += 3) { var s = seg(y); if (s && s.L >= 46 && (!pick || s.L - Math.abs(y - mid) * 0.8 > pick.sc)) { s.sc = s.L - Math.abs(y - mid) * 0.8; pick = s; } }
      if (pick) got.push(pick);
    }
    [46, 30].forEach(function(minL){
      while (got.length < n) {
        var cand = null;
        for (var y = y0; y <= y1; y += 3) { if (got.some(function(q){ return Math.abs(q.y - y) < 20; })) continue; var s = seg(y); if (s && s.L >= minL && (!cand || s.L > cand.L)) cand = s; }
        if (!cand) break;
        got.push(cand);
      }
    });
    for (var k = got.length; k < n; k++) { var yy = y0 + (y1 - y0) * (k + 0.5) / n, sp = spans(Pr, yy)[0] || [bb[0] + 40, bb[2] - 40]; got.push({y: yy, a: sp[0] + 16, b: Math.max(sp[0] + 20, sp[1] - 16)}); }
    got.sort(function(m, q){ return m.y - q.y; });
    return got.map(function(g){ return [rot([g.a, g.y], c, a), rot([g.b, g.y], c, a)]; });
  }

  /* quadras e ruelas: grade girada do bairro, quarteirões sorteados com semente fixa */
  function blocksOf(id, P, ang, step, ruas){
    var c = centroid(P), a = ang * Math.PI / 180, Pr = P.map(function(p){ return rot(p, c, -a); }), bb = bbox(Pr), R = U.seeded('lotes:' + id);
    var ry = ruas.map(function(r){ var p = rot(r[0], c, -a), q = rot(r[1], c, -a); return [p[1], Math.min(p[0], q[0]), Math.max(p[0], q[0])]; });
    var x0 = bb[0] - step, y0 = bb[1] - step, st = '', bl = '';
    function back(p){ return rot(p, c, a); }
    for (var gx = x0; gx <= bb[2] + step; gx += step) st += pathStr([back([gx, bb[1] - 8]), back([gx, bb[3] + 8])]);
    for (var gy = y0; gy <= bb[3] + step; gy += step) st += pathStr([back([bb[0] - 8, gy]), back([bb[2] + 8, gy])]);
    for (gy = y0; gy <= bb[3]; gy += step) {
      for (gx = x0; gx <= bb[2]; gx += step) {
        var cx = gx + step / 2, cy = gy + step / 2, r1 = R(), r2 = R(), r3 = R(), r4 = R();
        if (!inside(Pr, cx, cy) || r1 < 0.2) continue;
        if (ry.some(function(r){ return Math.abs(r[0] - cy) < step * 0.62 && cx > r[1] - step && cx < r[2] + step; })) continue;
        var bx = gx + 3 + r2 * 3, by = gy + 3 + r3 * 3, bw = step - 7 - r4 * 6, bh = step - 7 - r2 * 6;
        bl += pathStr([back([bx, by]), back([bx + bw, by]), back([bx + bw, by + bh]), back([bx, by + bh])], true);
      }
    }
    return {st: st, bl: bl};
  }

  var GEO = {};
  function geo(or){
    or = or === 'port' ? 'port' : 'land';
    if (GEO[or]) return GEO[or];
    var T = tp(or), g = {or: or, W: or === 'port' ? LH : LW, H: or === 'port' ? LW : LH, z: {}, lb: LB[or]};
    Object.keys(ZN).forEach(function(id){
      var P = ring(ZN[id]).map(T), Z = g.z[id] = {P: P, c: centroid(P), bb: bbox(P), pts: ptsStr(P), base: ptsStr(ring(ZN[id], true).map(T))};
      var d = CY.DMAP[id]; if (!d) return;
      var gr = GRADE[id], box = lblBox(or, id);
      Z.ruas = ruasOf(P, d.ruas.length, gr[0], [box]);
      var b = blocksOf(id, P, gr[0], gr[1], Z.ruas);
      Z.s = '<g class="cy-zs" clip-path="url(#cy-cl-' + id + ')"><path class="cy-st2" d="' + b.st + '"/><path class="cy-bld" d="' + b.bl + '"/>'
        + '<path class="cy-st" d="' + Z.ruas.map(function(r){ return pathStr(r); }).join('') + '"/></g>';
    });
    g.out = ring(OUT).map(T);
    var rio = RIO.map(T), pr = T(PRACA), av = '';
    ['a1', 'a2', 'a3', 'a4', 'a5'].forEach(function(k){ av += pathStr(edge(k).map(T)); });
    av += pathStr([T([PRACA[0], PRACA[1] - 62]), T([500, 34])]) + pathStr([T([PRACA[0], PRACA[1] + 62]), T([500, 668])]);
    var cal = ['c1', 'c2', 'c3', 'c4', 'c5'].map(function(k){ return pathStr(edge(k).map(T)); }).join('');
    var pontes = PONTES.map(function(x){
      for (var i = 1; i < RIO.length; i++) if (RIO[i][0] >= x) break;
      var a = RIO[i - 1], b = RIO[i], t = (x - a[0]) / (b[0] - a[0]), y = a[1] + (b[1] - a[1]) * t, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
      return '<polygon class="cy-ponte" points="' + ptsStr([[x - ux * 8 - nx * 25, y - uy * 8 - ny * 25], [x + ux * 8 - nx * 25, y + uy * 8 - ny * 25], [x + ux * 8 + nx * 25, y + uy * 8 + ny * 25], [x - ux * 8 + nx * 25, y - uy * 8 + ny * 25]].map(T)) + '"/>';
    }).join('');
    var R = U.seeded('nevoa:borda'), mist = '', oc = centroid(g.out);
    for (var i = 0; i < 14; i++) {
      var q = g.out[Math.floor(R() * g.out.length)], vx = q[0] - oc[0], vy = q[1] - oc[1], vl = Math.sqrt(vx * vx + vy * vy) || 1, push = 18 + R() * 30;
      mist += '<circle class="cy-mist" cx="' + f1(q[0] + vx / vl * push) + '" cy="' + f1(q[1] + vy / vl * push) + '" r="' + f1(38 + R() * 34) + '"/>';
    }
    var W = g.W, H = g.H;
    g.rioD = smooth(rio);
    g.stat = '<path class="cy-av" d="' + av + '"/><path class="cy-avc" d="' + av + '"/>'
      + '<path class="cy-cal" d="' + cal + '"/>'
      + '<path class="cy-rio" d="' + g.rioD + '"/><path class="cy-rio2" d="' + g.rioD + '"/>' + pontes
      + '<path class="cy-fog" fill-rule="evenodd" d="M-400 -400H' + (W + 400) + 'V' + (H + 400) + 'H-400Z' + pathStr(g.out, true) + '" filter="url(#cy-fogf)"/>'
      + '<path class="cy-frame" d="' + pathStr(g.out, true) + '"/>'
      + '<g class="cy-drift" filter="url(#cy-blurf)">' + mist + '</g>';
    g.praca = '<circle class="cy-plaza" cx="' + f1(pr[0]) + '" cy="' + f1(pr[1]) + '" r="62"/><circle class="cy-ring" cx="' + f1(pr[0]) + '" cy="' + f1(pr[1]) + '" r="44" filter="url(#cy-glowf)"/>'
      + '<g class="cy-spin" style="transform-origin:' + f1(pr[0]) + 'px ' + f1(pr[1]) + 'px"><circle class="cy-ring2" cx="' + f1(pr[0]) + '" cy="' + f1(pr[1]) + '" r="53"/></g>'
      + '<circle class="cy-gate" cx="' + f1(pr[0]) + '" cy="' + f1(pr[1]) + '" r="20"/>';
    g.nev = T(NEV); g.pr = pr;
    g.clips = Object.keys(g.z).map(function(id){ return '<clipPath id="cy-cl-' + id + '"><polygon points="' + g.z[id].pts + '"/></clipPath>'; }).join('');
    return (GEO[or] = g);
  }
  App.cyGeo = geo;

  /* insígnia de rank: losango com a letra. A e S ganham contorno duplo; S pulsa */
  App.cyBadge = function(r, x, y, s, attrs){
    var c = SYS.RANKC[r] || '#9aa6b8', d = function(k){ return 'M0 ' + f1(-k) + 'L' + f1(k) + ' 0L0 ' + f1(k) + 'L' + f1(-k) + ' 0Z'; };
    return '<g class="cy-badge cy-r' + r + '" transform="translate(' + f1(x) + ' ' + f1(y) + ')" style="--rc:' + c + '"' + (attrs || '') + '>'
      + (r === 'A' || r === 'S' ? '<path class="cy-badge-o" d="' + d(s + 4) + '"/>' : '')
      + '<path class="cy-badge-b" d="' + d(s) + '"/>'
      + '<text class="cy-badge-t" y="0.5" dominant-baseline="central" text-anchor="middle" style="font-size:' + f1(s * 1.1) + 'px">' + r + '</text></g>';
  };
  U.rankBadge = function(r, size){ var s = size || 28; return '<svg class="cy-rk" viewBox="-16 -16 32 32" width="' + s + '" height="' + s + '" role="img" aria-label="Rank ' + r + '">' + App.cyBadge(r, 0, 0, 11) + '</svg>'; };

  /* rachaduras: sempre as mesmas para o mesmo bairro; o nível 2 tem as do 1 e mais, e todas crescem */
  function cracks(id, lvl, Z){
    var R = U.seeded('rachadura:' + id), n = [0, 2, 4, 7][lvl] || 0, d = '', grow = 0.6 + lvl * 0.35, P = Z.P, c = Z.c;
    for (var i = 0; i < 7; i++) {
      var k = Math.floor(R() * P.length), a = P[k], b = P[(k + 1) % P.length], t = R(), px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t;
      var ang = Math.atan2(c[1] - py, c[0] - px), segs = 4 + Math.floor(R() * 3), path = 'M' + f1(px) + ' ' + f1(py), bx = null, by = null, bang = 0;
      for (var s = 0; s < segs; s++) {
        ang += (R() - 0.5) * 1.1; var len = (9 + R() * 12) * grow; px += Math.cos(ang) * len; py += Math.sin(ang) * len; path += 'L' + f1(px) + ' ' + f1(py);
        if (s === 1) { bx = px; by = py; bang = ang + (R() < 0.5 ? -0.9 : 0.9); }
      }
      var bl = (8 + R() * 10) * grow;
      if (bx != null) path += 'M' + f1(bx) + ' ' + f1(by) + 'L' + f1(bx + Math.cos(bang) * bl) + ' ' + f1(by + Math.sin(bang) * bl);
      if (i < n) d += path;
    }
    return d;
  }

  /* portais abertos do bairro, distribuídos pelas ruas (rua sorteada pelo id quando o portal não diz qual) */
  function marks(g, id, list){
    var rs = (g.z[id] || {}).ruas; if (!rs || !rs.length || !list.length) return [];
    var by = {}, out = [];
    list.forEach(function(p){ var r = (typeof p.rua === 'number' && p.rua >= 0 && p.rua < rs.length) ? p.rua : Math.floor(U.seeded('rua:' + p.id)() * rs.length); (by[r] = by[r] || []).push(p); });
    Object.keys(by).forEach(function(r){ var a = rs[r][0], b = rs[r][1], ps = by[r], m = ps.length; ps.forEach(function(p, k){ var t = (k + 1) / (m + 1); out.push({p: p, rua: +r, x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t}); }); });
    return out;
  }
  App.cyMarks = function(or, state){ var g = geo(or), all = []; CY.DIST.forEach(function(d){ all = all.concat(marks(g, d.id, state(d.id).open || [])); }); return all; };

  function icon(name, x, y, s){ return '<g class="cy-ic" transform="translate(' + f1(x - 12 * s) + ' ' + f1(y - 12 * s) + ') scale(' + f1(s) + ')"><path d="' + (SYS.ICONS[name] || SYS.ICONS.dot) + '"/></g>'; }
  function label(g, id, ic, wc, sub, cnt){
    var a = g.lb[id], L = lbl(g.or), x = a[0], y = a[1], lines = ROT[id] || [id];
    var out = '<g class="cy-lb' + (sub && sub.red ? ' cy-lbr' : '') + '" data-id="' + id + '" style="--wc:' + wc + '" aria-hidden="true"><circle class="cy-icb" cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + L.r + '"/>' + icon(ic, x, y, L.r / 20);
    lines.forEach(function(l, i){ out += '<text class="cy-name" x="' + f1(x) + '" y="' + f1(y + L.r + 4 + L.fs * 0.8 + i * L.lh) + '" style="font-size:' + L.fs + 'px">' + U.esc(l) + '</text>'; });
    if (sub && g.or === 'land') out += '<text class="cy-sub' + (sub.red ? ' cy-redt' : '') + '" x="' + f1(x) + '" y="' + f1(y + L.r + 4 + lines.length * L.lh + 13) + '">' + U.esc(sub.t) + '</text>';
    if (cnt) { var bx = x + L.r * 0.8, by = y - L.r * 0.8; out += '<g class="cy-cnt"><circle cx="' + f1(bx) + '" cy="' + f1(by) + '" r="' + (g.or === 'port' ? 11 : 9) + '"/><text x="' + f1(bx) + '" y="' + f1(by + 0.5) + '" dominant-baseline="central">' + cnt + '</text></g>'; }
    return out + '</g>';
  }

  function zone(g, d, st, sel){
    var Z = g.z[d.id], way = App.way(d.way), lvl = st.corr || 0, open = st.open || [], bb = Z.bb;
    var aria = d.n + ', ' + way.name + ', ' + CY.CORR[lvl].n.toLowerCase() + ', ' + open.length + (open.length === 1 ? ' portal aberto' : ' portais abertos');
    var out = '<g class="cy-d' + (lvl ? ' cy-corr cy-c' + lvl : '') + (sel ? ' cy-sel' : '') + '" data-id="' + d.id + '" style="--wc:' + way.color + '">'
      + '<polygon class="cy-dz" points="' + Z.pts + '" data-a="cyPick" data-id="' + d.id + '" role="button" tabindex="0" aria-label="' + U.esc(aria) + '" data-tip="' + U.esc(d.n + ' · ' + way.name) + '"/>' + Z.s;
    if (lvl) out += '<polygon class="cy-tint" points="' + Z.pts + '"/>'
      + '<g clip-path="url(#cy-cl-' + d.id + ')"><rect class="cy-noise" x="' + f1(bb[0] - 8) + '" y="' + f1(bb[1] - 8) + '" width="' + f1(bb[2] - bb[0] + 16) + '" height="' + f1(bb[3] - bb[1] + 16) + '" filter="url(#cy-noisef)"/></g>'
      + '<path class="cy-crack" d="' + cracks(d.id, lvl, Z) + '" clip-path="url(#cy-cl-' + d.id + ')"/>';
    return out + '<polygon class="cy-edge" points="' + Z.pts + '" clip-path="url(#cy-cl-' + d.id + ')"/></g>';
  }

  /* o mapa inteiro. state(id) devolve {corr, closed, open:[portais]}; opt = {or: 'land'|'port', sel: id} */
  App.cityMap = function(state, opt){
    opt = opt || {};
    var g = geo(opt.or), sel = opt.sel, W = g.W, H = g.H, lab = '', bad = '';
    var out = '<svg class="cy-svg cy-' + g.or + '" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="' + (g.or === 'port' ? 'xMidYMax' : 'xMidYMid') + ' meet" role="group" aria-label="Mapa da Cidade: 7 bairros, o Centro e a névoa">'
      + '<defs>' + g.clips
      + '<filter id="cy-glowf" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
      + '<filter id="cy-noisef" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .17  0 0 0 0 .33  0 0 0 1.7 -.66"/></filter>'
      + '<filter id="cy-blurf" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>'
      + '<filter id="cy-fogf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>'
      + '<rect class="cy-bgr" x="-400" y="-400" width="' + (W + 800) + '" height="' + (H + 800) + '"/>';
    CY.DIST.forEach(function(d){
      var st = state(d.id), way = App.way(d.way), open = st.open || [], lvl = st.corr || 0;
      out += zone(g, d, st, sel === d.id);
      lab += label(g, d.id, d.ic, way.color, {t: (lvl ? 'corrupção ' + lvl : 'prof. ' + E.cityDepth(st.closed)) + ' · ' + open.length + (open.length === 1 ? ' portal' : ' portais'), red: !!lvl}, open.length);
      marks(g, d.id, open).forEach(function(m){
        var p = m.p, rk = App.cyBreu && App.cyBreu(p) ? '?' : CY.RANKS.indexOf(p.r) >= 0 ? p.r : 'E', tip = 'Portal ' + rk + ' · ' + d.ruas[m.rua] + (p.due ? ' · prazo ' + U.fmtDate(p.due) : '');   /* Breu: o mapa esconde o rank */
        bad += App.cyBadge(rk, m.x, m.y, g.or === 'port' ? 15 : 12, ' data-tip="' + U.esc(tip) + '" data-a="cyOpen" data-id="' + U.esc(p.id) + '" role="button" tabindex="0" aria-label="' + U.esc('Abrir portal ' + rk + ': ' + (p.n || '')) + '"');
      });
    });
    var Zc = g.z.centro;
    out += '<g class="cy-d cy-centro' + (sel === 'centro' ? ' cy-sel' : '') + '" data-id="centro" style="--wc:var(--glow)"><polygon class="cy-dz" points="' + Zc.pts + '" data-a="cyPick" data-id="centro" role="button" tabindex="0" aria-label="Centro: Dungeons, Raids e Oficina" data-tip="Centro · Dungeons, Raids e Oficina"/>'
      + '<polygon class="cy-edge" points="' + Zc.pts + '" clip-path="url(#cy-cl-centro)"/></g>';
    out += g.stat + g.praca;
    if (App.cyMitico && App.cyMitico()) {   /* Relíquia mítica equipada: o relógio da praça marca 3h33 */
      var cx = g.pr[0], cy = g.pr[1], hd = function(deg, len){ var a = (deg - 90) * Math.PI / 180; return 'M' + f1(cx) + ' ' + f1(cy) + 'L' + f1(cx + Math.cos(a) * len) + ' ' + f1(cy + Math.sin(a) * len); };
      out += '<g class="cy-clock" aria-hidden="true"><circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="15"/><path d="' + hd(106.5, 8) + hd(198, 12) + '"/></g>';
    }
    var nv = g.nev, rx = g.or === 'port' ? 44 : 58, ry = g.or === 'port' ? 58 : 44;
    out += '<g class="cy-nev' + (sel === 'nevoa' ? ' cy-sel' : '') + '" data-a="cyPick" data-id="nevoa" role="button" tabindex="0" aria-label="Névoa" data-tip="???"><ellipse class="cy-nevz" cx="' + f1(nv[0]) + '" cy="' + f1(nv[1]) + '" rx="' + rx + '" ry="' + ry + '" filter="url(#cy-blurf)"/>'
      + '<ellipse class="cy-nevh" cx="' + f1(nv[0]) + '" cy="' + f1(nv[1]) + '" rx="' + rx + '" ry="' + ry + '"/><text class="cy-fogt" x="' + f1(nv[0]) + '" y="' + f1(nv[1] + 8) + '">???</text></g>';
    lab += label(g, 'centro', 'd_center', 'var(--glow)', {t: 'Dungeons · Raids · Oficina'}, 0);
    return out + lab + bad + '</svg>';
  };

  /* minimapa-radar: a mesma cidade em miniatura, um ponto por portal (no lugar dele no mapa) e a varredura */
  App.cyMini = function(state, or){
    var g = geo(or), W = g.W, H = g.H, R = Math.sqrt(W * W + H * H) / 2 * 0.96, S = 2 * R, ox = R - W / 2, oy = R - H / 2, id = 'cy-mc-' + g.or;
    var out = '<svg class="cy-mini-svg" viewBox="0 0 ' + f1(S) + ' ' + f1(S) + '" aria-hidden="true"><defs><clipPath id="' + id + '"><circle cx="' + f1(R) + '" cy="' + f1(R) + '" r="' + f1(R - 6) + '"/></clipPath></defs>'
      + '<circle class="cy-rd-bg" cx="' + f1(R) + '" cy="' + f1(R) + '" r="' + f1(R - 6) + '"/><g clip-path="url(#' + id + ')"><g transform="translate(' + f1(ox) + ' ' + f1(oy) + ')">';
    CY.DIST.forEach(function(d){ var st = state(d.id); out += '<polygon class="cy-mz' + (st.corr ? ' red' : '') + '" points="' + g.z[d.id].base + '" style="--wc:' + App.way(d.way).color + '"/>'; });
    out += '<polygon class="cy-mz cen" points="' + g.z.centro.base + '"/><path class="cy-mrio" d="' + g.rioD + '"/>';
    App.cyMarks(g.or, state).forEach(function(m){ out += '<circle class="cy-rd-blip" cx="' + f1(m.x) + '" cy="' + f1(m.y) + '" r="' + f1(R * 0.042) + '" style="fill:' + ((App.cyBreu && App.cyBreu(m.p) ? '' : SYS.RANKC[m.p.r]) || '#fff') + '"/>'; });
    var a = Math.PI / 4;
    out += '</g><circle class="cy-rd-l" cx="' + f1(R) + '" cy="' + f1(R) + '" r="' + f1(R * 0.36) + '"/><circle class="cy-rd-l" cx="' + f1(R) + '" cy="' + f1(R) + '" r="' + f1(R * 0.7) + '"/>'
      + '<g class="cy-rd-sweep" style="transform-origin:' + f1(R) + 'px ' + f1(R) + 'px"><path class="cy-rd-w" d="M' + f1(R) + ' ' + f1(R) + 'L' + f1(R) + ' 0A' + f1(R) + ' ' + f1(R) + ' 0 0 1 ' + f1(R + R * Math.sin(a)) + ' ' + f1(R - R * Math.cos(a)) + 'Z"/>'
      + '<path class="cy-rd-e" d="M' + f1(R) + ' ' + f1(R) + 'L' + f1(R + R * Math.sin(a)) + ' ' + f1(R - R * Math.cos(a)) + '"/></g></g>'
      + '<circle class="cy-rd-ring" cx="' + f1(R) + '" cy="' + f1(R) + '" r="' + f1(R - 6) + '"/></svg>';
    return out;
  };
})();
