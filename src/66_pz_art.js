/* ===== v13 · ALGOZ · figura original do executor de penalidades =====
   Sentinela geométrica feita das próprias peças da interface: máscara em escudo
   com fenda de luz, ombros em lâmina, corpo que afunila e se desfaz em barras de
   dado, estilhaços flutuando ao lado e o anel do portão ao fundo (o arco aceso é
   a janela se esgotando).
   mode: call | miss | ok | intro | late   ·   opt.prog: 0..1 (fração restante da janela) */
U._az = 0;
U.algoz = function(mode, opt){
  opt = opt || {};
  var id = 'az' + (++U._az), W = opt.w || 300, prog = opt.prog == null ? 1 : U.clamp(opt.prog, 0, 1), R = 118, C = 2 * Math.PI * R, cx = 160, cy = 152;
  var ticks = '';
  for (var i = 0; i < 24; i++) {
    var a = i * Math.PI / 12, big = i % 6 === 0, mid = i % 2 === 0, r1 = R + 8, r2 = R + (big ? 21 : mid ? 15 : 12);
    ticks += '<path d="M' + (cx + Math.sin(a) * r1).toFixed(1) + ' ' + (cy - Math.cos(a) * r1).toFixed(1) + ' L' + (cx + Math.sin(a) * r2).toFixed(1) + ' ' + (cy - Math.cos(a) * r2).toFixed(1) + '" stroke="var(--pzc)" stroke-width="' + (big ? 2.2 : 1) + '" opacity="' + (big ? .8 : mid ? .4 : .22) + '"/>';
  }
  var visor = mode === 'ok' ? '<path class="f-visor" d="M140 99 H180 V104 H140 Z" fill="var(--pzc)"/>'
    : mode === 'miss' ? '<path class="f-visor" d="M122 90 L160 104 L198 90 L198 98 L160 113 L122 98 Z" fill="var(--pzc)"/>'
    : '<path class="f-visor" d="M126 94 L160 103 L194 94 L194 100 L160 110 L126 100 Z" fill="var(--pzc)"/>';
  var crack = mode === 'miss' ? '<path d="M150 57 L157 78 L149 92 M171 112 L164 128 L170 146" fill="none" stroke="var(--pzc)" stroke-width="1.2" opacity=".8"/>' : '';
  var body = 'M132 164 L80 190 L34 134 L56 222 L102 332 L138 374 L160 404 L182 374 L218 332 L264 222 L286 134 L240 190 L188 164 L160 190 Z';
  var mask = 'M136 54 H184 L207 98 L191 146 L160 164 L129 146 L113 98 Z';
  var drips = [[150,398,46,0],[162,402,70,.8],[138,380,30,1.6],[176,384,40,.3],[122,360,24,2.0],[192,362,34,1.1],[106,338,18,.5],[208,340,22,1.8]];
  var shards = '<g class="f-shard" style="animation-delay:-1.2s"><path d="M22 250 l9 -26 9 26 -9 40z" fill="url(#' + id + 'b)" stroke="var(--pzc)" stroke-width="1.2"/></g>'
    + '<g class="f-shard" style="animation-delay:-3.1s"><path d="M280 232 l9 -30 9 30 -9 46z" fill="url(#' + id + 'b)" stroke="var(--pzc)" stroke-width="1.2"/></g>'
    + '<g class="f-shard" style="animation-delay:-2.2s"><path d="M34 320 l5 -13 5 13 -5 20z" fill="var(--pzc)" opacity=".5"/></g>'
    + '<g class="f-shard" style="animation-delay:-.4s"><path d="M276 312 l5 -13 5 13 -5 20z" fill="var(--pzc)" opacity=".5"/></g>';
  return '<svg class="pzfig m-' + mode + '" viewBox="0 0 320 450" width="' + W + '" role="img" aria-label="ALGOZ, o executor de penalidades do Sistema">'
    + '<defs><linearGradient id="' + id + 'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pzc)" stop-opacity=".34"/><stop offset=".5" stop-color="var(--pzc)" stop-opacity=".10"/><stop offset="1" stop-color="var(--pzc)" stop-opacity=".03"/></linearGradient>'
    + '<linearGradient id="' + id + 'd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pzc)" stop-opacity=".6"/><stop offset="1" stop-color="var(--pzc)" stop-opacity="0"/></linearGradient>'
    + '<radialGradient id="' + id + 'm" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="var(--pzc)" stop-opacity=".16"/><stop offset="1" stop-color="var(--pzc)" stop-opacity="0"/></radialGradient></defs>'
    + '<g class="f-ring"><circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 26) + '" fill="none" stroke="var(--pzc)" stroke-width="1" stroke-dasharray="1 9" opacity=".4"/>' + ticks + '</g>'
    + '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="var(--pzc)" stroke-width="1" opacity=".16"/>'
    + '<circle class="f-arc" cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="var(--pzc)" stroke-width="3.2" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - prog)).toFixed(1) + '" data-c="' + C.toFixed(1) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>'
    + '<ellipse cx="160" cy="440" rx="66" ry="5" fill="var(--pzc)" opacity=".13"/>'
    + shards
    + '<g class="f-float">'
    + drips.map(function(b){ return '<rect class="f-drip" x="' + b[0] + '" y="' + b[1] + '" width="8" height="' + b[2] + '" fill="url(#' + id + 'd)" style="animation-delay:-' + b[3] + 's"/>'; }).join('')
    + '<path d="' + body + '" fill="#030811"/><path d="' + body + '" fill="url(#' + id + 'b)" stroke="var(--pzc)" stroke-width="1.8" stroke-linejoin="round"/>'
    + '<path d="M160 190 V404 M118 216 L146 372 M202 216 L174 372 M80 190 L118 216 L160 190 L202 216 L240 190 M56 222 L118 216 M264 222 L202 216" fill="none" stroke="var(--pzc)" stroke-width="1" opacity=".3"/>'
    + '<path d="M132 164 L160 190 L188 164" fill="none" stroke="var(--pzc)" stroke-width="3" stroke-linejoin="miter"/>'
    + '<g fill="var(--pzc)"><circle cx="160" cy="216" r="3"/><circle cx="160" cy="232" r="2.6" opacity=".65"/><circle cx="160" cy="246" r="2.2" opacity=".35"/></g>'
    + '<path d="' + mask + '" fill="#030811"/><path d="' + mask + '" fill="url(#' + id + 'm)" stroke="var(--pzc)" stroke-width="2.6" stroke-linejoin="round"/>'
    + '<path d="M141 64 H179 L197 99 L184 139 L160 152 L136 139 L123 99 Z" fill="none" stroke="var(--pzc)" stroke-width="1" opacity=".3"/>'
    + '<path d="M160 113 V152 M146 122 L152 142 M174 122 L168 142" stroke="var(--pzc)" stroke-width="1" opacity=".35" fill="none"/>'
    + crack + visor
    + '<path d="M160 54 V30" stroke="var(--pzc)" stroke-width="2.6" stroke-linecap="round"/><path d="M160 8 l7 11 -7 11 -7 -11z" fill="var(--pzc)"/>'
    + '<path d="M136 54 L124 36 M184 54 L196 36" stroke="var(--pzc)" stroke-width="2" stroke-linecap="round" opacity=".7"/>'
    + '<rect class="f-scan" x="56" y="40" width="208" height="2" fill="var(--pzc)"/>'
    + '</g></svg>';
};
