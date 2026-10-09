/* ===== CIDADE · mapa em SVG: os 7 distritos e o Centro, ícones, insígnias de rank E–S e corrupção =====
   Layout 3×3 com o Centro no meio, na ordem do mapa da Bíblia (leitura em linhas). Cada distrito tem as ruas
   das vertentes do seu Caminho: é nelas que os portais nascem. O canto que sobra é névoa. */
(function(){
  var CY = SYS.CITY;

  /* ícones novos, no mesmo traço dos SYS.ICONS (24×24, só contorno) */
  var IC = {
    city: 'M3 21V10l4-3v14 M7 21V4h6v17 M13 21V9h4l4 3v9 M2 21h20 M9.5 7.5h1 M9.5 11h1 M9.5 14.5h1 M16.5 13h1 M16.5 16.5h1',
    radar: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 12l6.4-6.4 M12 3v2 M21 12h-2',
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

  /* rótulos do mapa em até duas linhas: o nome inteiro, que é o que dá o clima (às 3h, às 23h, sem janela) */
  var ROT = {servidores: ['Sala de', 'Servidores'], estudio: ['Estúdio', 'sem Janela'], piscinas: ['Piscinas'], escritorio: ['Escritório', 'às 23h'],
    agencia: ['Agência', 'Fechada'], biblioteca: ['Biblioteca', 'às 3h'], galeria: ['Galeria', 'Coberta'], centro: ['Centro']};

  var G = {W: 608, M: 12, CS: 184, AV: 16, CH: 14};
  function X(col){ return G.M + col * (G.CS + G.AV); }
  function Y(row){ return G.M + row * (G.CS + G.AV); }
  function f1(n){ return String(Math.round(n * 10) / 10); }
  function poly(x, y, w, h, c){ return [[x + c, y], [x + w - c, y], [x + w, y + c], [x + w, y + h - c], [x + w - c, y + h], [x + c, y + h], [x, y + h - c], [x, y + c]].map(function(p){ return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  function icon(name, x, y, s){ return '<g class="cy-ic" transform="translate(' + f1(x - 12 * s) + ' ' + f1(y - 12 * s) + ') scale(' + s + ')"><path d="' + (SYS.ICONS[name] || SYS.ICONS.dot) + '"/></g>'; }
  function label(lines, x, y){
    var top = lines.length > 1 ? y - 8 : y + 1;
    return lines.map(function(l, i){ return '<text class="cy-name" x="' + f1(x) + '" y="' + f1(top + i * 18) + '">' + U.esc(l) + '</text>'; }).join('');
  }

  /* insígnia de rank: losango com a letra. A e S ganham contorno duplo; S pulsa */
  App.cyBadge = function(r, x, y, s, attrs){
    var c = SYS.RANKC[r] || '#9aa6b8', d = function(k){ return 'M0 ' + f1(-k) + 'L' + f1(k) + ' 0L0 ' + f1(k) + 'L' + f1(-k) + ' 0Z'; };
    return '<g class="cy-badge cy-r' + r + '" transform="translate(' + f1(x) + ' ' + f1(y) + ')" style="--rc:' + c + '"' + (attrs || '') + '>'
      + (r === 'A' || r === 'S' ? '<path class="cy-badge-o" d="' + d(s + 4) + '"/>' : '')
      + '<path class="cy-badge-b" d="' + d(s) + '"/>'
      + '<text class="cy-badge-t" y="0.5" dominant-baseline="central" text-anchor="middle" style="font-size:' + f1(s * 1.1) + 'px">' + r + '</text></g>';
  };
  U.rankBadge = function(r, size){ var s = size || 28; return '<svg class="cy-rk" viewBox="-16 -16 32 32" width="' + s + '" height="' + s + '" role="img" aria-label="Rank ' + r + '">' + App.cyBadge(r, 0, 0, 11) + '</svg>'; };

  /* rachaduras: sempre as mesmas para o mesmo distrito; o nível 2 tem as do 1 e mais, e todas crescem */
  function cracks(id, lvl, x, y, w, h){
    var R = U.seeded('rachadura:' + id), n = [0, 2, 4, 7][lvl] || 0, d = '', grow = 0.55 + lvl * 0.3;
    function cl(v, a, b){ return Math.max(a, Math.min(b, v)); }
    for (var i = 0; i < 7; i++) {
      var side = Math.floor(R() * 4), t = 0.18 + R() * 0.64, px, py, ang, segs = 4 + Math.floor(R() * 3), path = '';
      if (side === 0) { px = x + t * w; py = y; ang = Math.PI / 2; }
      else if (side === 1) { px = x + w; py = y + t * h; ang = Math.PI; }
      else if (side === 2) { px = x + t * w; py = y + h; ang = -Math.PI / 2; }
      else { px = x; py = y + t * h; ang = 0; }
      path += 'M' + f1(px) + ' ' + f1(py);
      var bx = null, by = null, bang = 0;
      for (var k = 0; k < segs; k++) {
        ang += (R() - 0.5) * 1.2; var len = (7 + R() * 9) * grow;
        px = cl(px + Math.cos(ang) * len, x + 3, x + w - 3); py = cl(py + Math.sin(ang) * len, y + 3, y + h - 3);
        path += 'L' + f1(px) + ' ' + f1(py);
        if (k === 1) { bx = px; by = py; bang = ang + (R() < 0.5 ? -0.9 : 0.9); }
      }
      var blen = (6 + R() * 8) * grow;
      if (bx != null) path += 'M' + f1(bx) + ' ' + f1(by) + 'L' + f1(cl(bx + Math.cos(bang) * blen, x + 3, x + w - 3)) + ' ' + f1(cl(by + Math.sin(bang) * blen, y + 3, y + h - 3));
      if (i < n) d += path;
    }
    return d;
  }

  /* quarteirões: prédios pequenos entre as ruas, sorteados com semente fixa (o desenho não muda entre aberturas) */
  function blocksOf(id, x, top, w, bottom, streets){
    var R = U.seeded('lotes:' + id), out = '';
    for (var gy = top; gy + 12 <= bottom; gy += 14) {
      for (var gx = x + 10; gx + 16 <= x + w - 8; gx += 20) {
        var mid = gy + 6;
        if (streets.some(function(s){ return Math.abs(s - mid) < 8; })) continue;
        var r1 = R(), bw = 15 - R() * 5, bh = 10 - R() * 4;
        if (r1 < 0.27) continue;
        out += '<rect class="cy-bld" x="' + f1(gx + 1) + '" y="' + f1(gy + 1) + '" width="' + f1(bw) + '" height="' + f1(bh) + '"/>';
      }
    }
    return out;
  }

  /* portais abertos no distrito, distribuídos pelas ruas (rua sorteada pelo id quando o portal não diz qual) */
  function markers(d, list, x, w, streets){
    if (!list.length) return '';
    var byRua = {};
    list.forEach(function(p){ var r = (typeof p.rua === 'number' && p.rua >= 0 && p.rua < streets.length) ? p.rua : Math.floor(U.seeded('rua:' + p.id)() * streets.length); (byRua[r] = byRua[r] || []).push(p); });
    var out = '';
    Object.keys(byRua).forEach(function(r){
      var ps = byRua[r], m = ps.length;
      ps.forEach(function(p, k){
        var px = x + 20 + (w - 40) * (k + 1) / (m + 1), tip = 'Portal ' + p.r + ' · ' + d.ruas[r] + (p.due ? ' · prazo ' + U.fmtDate(p.due) : '');
        out += App.cyBadge(CY.RANKS.indexOf(p.r) >= 0 ? p.r : 'E', px, streets[r], 9, ' data-tip="' + U.esc(tip) + '"');
      });
    });
    return out;
  }

  function district(d, st, sel){
    var x = X(d.col), y = Y(d.row), w = G.CS, h = G.CS, way = App.way(d.way), lvl = st.corr || 0, open = st.open || [];
    var top = y + 62, bottom = y + h - 26, n = d.ruas.length, gap = (bottom - top) / n, streets = [];
    for (var i = 0; i < n; i++) streets.push(top + gap * (i + 0.5));
    var aria = d.n + ', ' + way.name + ', ' + CY.CORR[lvl].n.toLowerCase() + ', ' + open.length + (open.length === 1 ? ' portal aberto' : ' portais abertos');
    var out = '<g class="cy-blk' + (lvl ? ' cy-corr cy-c' + lvl : '') + (sel ? ' cy-sel' : '') + '" style="--wc:' + way.color + '" data-a="cyPick" data-id="' + d.id + '" role="button" tabindex="0" aria-label="' + U.esc(aria) + '" aria-pressed="' + (sel ? 'true' : 'false') + '" data-tip="' + U.esc(d.n + ' · ' + way.name) + '">'
      + '<polygon class="cy-fill" points="' + poly(x, y, w, h, G.CH) + '"/>'
      + blocksOf(d.id, x, top - 4, w, bottom + 4, streets)
      + streets.map(function(s){ return '<line class="cy-st" x1="' + f1(x + 8) + '" y1="' + f1(s) + '" x2="' + f1(x + w - 8) + '" y2="' + f1(s) + '"/>'; }).join('');
    if (lvl) {
      out += '<polygon class="cy-tint" points="' + poly(x, y, w, h, G.CH) + '"/>'
        + '<g clip-path="url(#cy-clip-' + d.id + ')"><rect class="cy-noise" x="' + f1(x - 8) + '" y="' + f1(y - 8) + '" width="' + f1(w + 16) + '" height="' + f1(h + 16) + '" filter="url(#cy-noisef)"/></g>'
        + '<path class="cy-crack" d="' + cracks(d.id, lvl, x, y, w, h) + '" filter="url(#cy-glowf)"/>';
    }
    out += '<polygon class="cy-edge" points="' + poly(x, y, w, h, G.CH) + '" filter="url(#cy-glowf)"/>'
      + '<circle class="cy-icb" cx="' + f1(x + 26) + '" cy="' + f1(y + 29) + '" r="15"/>' + icon(d.ic, x + 26, y + 29, 0.75)
      + label(ROT[d.id] || [d.n], x + 48, y + 30)
      + markers(d, open, x, w, streets)
      + '<text class="cy-sub' + (lvl ? ' cy-redt' : '') + '" x="' + f1(x + 12) + '" y="' + f1(y + h - 9) + '">' + (lvl ? 'corrupção ' + lvl : 'prof. ' + E.cityDepth(st.closed)) + ' · ' + open.length + (open.length === 1 ? ' portal' : ' portais') + '</text>'
      + '</g>';
    return out;
  }

  function centro(sel){
    var c = CY.CENTRO, x = X(c.col), y = Y(c.row), w = G.CS, h = G.CS, mx = x + w / 2, my = y + 104;
    return '<g class="cy-blk cy-centro' + (sel ? ' cy-sel' : '') + '" style="--wc:var(--glow)" data-a="cyPick" data-id="centro" role="button" tabindex="0" aria-label="Centro: Dungeons, Raids e Oficina" aria-pressed="' + (sel ? 'true' : 'false') + '" data-tip="Centro · Dungeons, Raids e Oficina">'
      + '<polygon class="cy-fill" points="' + poly(x, y, w, h, G.CH) + '"/>'
      + '<circle class="cy-plaza" cx="' + f1(mx) + '" cy="' + f1(my) + '" r="42"/>'
      + '<circle class="cy-ring" cx="' + f1(mx) + '" cy="' + f1(my) + '" r="30" filter="url(#cy-glowf)"/>'
      + '<g class="cy-spin" style="transform-origin:' + f1(mx) + 'px ' + f1(my) + 'px"><circle class="cy-ring2" cx="' + f1(mx) + '" cy="' + f1(my) + '" r="36"/></g>'
      + '<circle class="cy-gate" cx="' + f1(mx) + '" cy="' + f1(my) + '" r="16"/>'
      + '<text class="cy-sub" x="' + f1(mx) + '" y="' + f1(y + h - 9) + '" text-anchor="middle">Dungeons · Raids · Oficina</text>'
      + '<polygon class="cy-edge" points="' + poly(x, y, w, h, G.CH) + '" filter="url(#cy-glowf)"/>'
      + '<circle class="cy-icb" cx="' + f1(x + 26) + '" cy="' + f1(y + 29) + '" r="15"/>' + icon('d_center', x + 26, y + 29, 0.75)
      + label(ROT.centro, x + 48, y + 30)
      + '</g>';
  }

  function nevoa(sel){
    var c = CY.NEVOA, x = X(c.col), y = Y(c.row), w = G.CS, h = G.CS;
    return '<g class="cy-blk cy-fog' + (sel ? ' cy-sel' : '') + '" style="--wc:var(--faint)" data-a="cyPick" data-id="nevoa" role="button" tabindex="0" aria-label="Névoa" aria-pressed="' + (sel ? 'true' : 'false') + '" data-tip="???">'
      + '<polygon class="cy-fill" points="' + poly(x, y, w, h, G.CH) + '"/>'
      + '<g clip-path="url(#cy-clip-nevoa)"><g class="cy-drift">'
      + [[0.3, 0.35, 46], [0.7, 0.55, 54], [0.45, 0.8, 40], [0.85, 0.2, 34]].map(function(b){ return '<circle class="cy-mist" cx="' + f1(x + b[0] * w) + '" cy="' + f1(y + b[1] * h) + '" r="' + b[2] + '" filter="url(#cy-blurf)"/>'; }).join('')
      + '</g></g>'
      + '<polygon class="cy-edge cy-dash" points="' + poly(x, y, w, h, G.CH) + '"/>'
      + '<text class="cy-fogt" x="' + f1(x + w / 2) + '" y="' + f1(y + h / 2 + 8) + '" text-anchor="middle">???</text>'
      + '</g>';
  }

  /* o mapa inteiro. state(id) devolve {corr, closed, open:[portais]} de cada distrito; sel = id selecionado */
  App.cityMap = function(state, sel){
    var W = G.W, clips = CY.DIST.concat([CY.NEVOA]).map(function(d){ return '<clipPath id="cy-clip-' + d.id + '"><polygon points="' + poly(X(d.col), Y(d.row), G.CS, G.CS, G.CH) + '"/></clipPath>'; }).join('');
    var av1 = G.M + G.CS + G.AV / 2, av2 = av1 + G.CS + G.AV, br = 22;
    var out = '<svg class="cy-svg" viewBox="0 0 ' + W + ' ' + W + '" role="group" aria-label="Mapa da Cidade: 7 distritos e o Centro">'
      + '<defs><pattern id="cy-gridp" width="16" height="16" patternUnits="userSpaceOnUse"><path class="cy-gridl" d="M16 0H0V16"/></pattern>'
      + '<filter id="cy-glowf" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
      + '<filter id="cy-noisef" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .17  0 0 0 0 .33  0 0 0 1.7 -.66"/></filter>'
      + '<filter id="cy-blurf" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12"/></filter>'
      + clips + '</defs>'
      + '<rect class="cy-bgr" width="' + W + '" height="' + W + '"/><rect width="' + W + '" height="' + W + '" fill="url(#cy-gridp)"/>'
      + '<path class="cy-av" d="M' + G.M + ' ' + f1(av1) + 'H' + (W - G.M) + 'M' + G.M + ' ' + f1(av2) + 'H' + (W - G.M) + 'M' + f1(av1) + ' ' + G.M + 'V' + (W - G.M) + 'M' + f1(av2) + ' ' + G.M + 'V' + (W - G.M) + '"/>'
      + '<path class="cy-frame" d="M2 ' + br + 'V2H' + br + 'M' + (W - br) + ' 2H' + (W - 2) + 'V' + br + 'M' + (W - 2) + ' ' + (W - br) + 'V' + (W - 2) + 'H' + (W - br) + 'M' + br + ' ' + (W - 2) + 'H2V' + (W - br) + '"/>';
    CY.DIST.forEach(function(d){ out += district(d, state(d.id), sel === d.id); });
    out += centro(sel === 'centro') + nevoa(sel === 'nevoa');
    return out + '</svg>';
  };

  /* radar: varredura girando (para com as animações desligadas) e um ponto por portal aberto */
  App.cyRadar = function(blips){
    var out = '<svg class="cy-radar" viewBox="0 0 120 120" width="112" height="112" aria-hidden="true">'
      + '<circle class="cy-rd-bg" cx="60" cy="60" r="56"/><circle class="cy-rd-l" cx="60" cy="60" r="38"/><circle class="cy-rd-l" cx="60" cy="60" r="20"/>'
      + '<path class="cy-rd-l" d="M60 4V116M4 60H116"/>'
      + '<g class="cy-rd-sweep" style="transform-origin:60px 60px"><path class="cy-rd-w" d="M60 60L60 4A56 56 0 0 1 99.6 20.4Z"/><path class="cy-rd-e" d="M60 60L99.6 20.4"/></g>';
    (blips || []).forEach(function(b, i){ var R = U.seeded('blip:' + (b.id || i)), a = R() * 2 * Math.PI, r = 14 + R() * 38; out += '<circle class="cy-rd-blip" cx="' + f1(60 + Math.cos(a) * r) + '" cy="' + f1(60 + Math.sin(a) * r) + '" r="3" style="fill:' + (SYS.RANKC[b.r] || '#fff') + '"/>'; });
    return out + '<circle class="cy-rd-c" cx="60" cy="60" r="2.5"/></svg>';
  };
})();
