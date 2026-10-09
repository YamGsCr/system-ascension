/* ===== ARTE PROCEDURAL v2: chama, mascote Sys, portal, baú, emblema ===== */
var _aid = 0;
U.flameTier = function(n){ var t = SYS.FLAME[0]; SYS.FLAME.forEach(function(f){ if (n >= f.min) t = f; }); return t; };
U.flame = function(n, size, opt){
  opt = opt || {}; var t = opt.tier || U.flameTier(n), id = 'fl' + (++_aid), sz = size || 96, dead = t.k === 'ash';
  var halo = t.k === 'heaven' ? '<ellipse cx="50" cy="16" rx="18" ry="5" fill="none" stroke="'+t.b+'" stroke-width="2.5" opacity=".9"/>' : '';
  var crown = t.k === 'monarch' ? '<path d="M34 20 L40 8 L46 17 L50 4 L54 17 L60 8 L66 20 Z" fill="'+t.b+'" stroke="#fff6c2" stroke-width="1"/>' : '';
  var sparks = dead ? '<g fill="'+t.b+'" opacity=".7"><circle cx="38" cy="96" r="2"/><circle cx="60" cy="100" r="2.5"/><circle cx="50" cy="90" r="1.6"/></g>'
    : '<g class="fl-sparks" fill="'+t.b+'"><circle cx="24" cy="60" r="2"/><circle cx="78" cy="48" r="2.4"/><circle cx="70" cy="22" r="1.6"/><circle cx="30" cy="30" r="1.4"/></g>';
  var body = dead
    ? '<path d="M22 104 C24 92 36 88 50 88 C64 88 76 92 78 104 Z" fill="url(#'+id+'o)"/><path d="M40 92 C44 84 56 84 60 92" stroke="'+t.b+'" stroke-width="2" fill="none" opacity=".6"/>'
    : '<g class="fl-body"><path d="M50 8 C62 32 86 46 86 76 C86 99 70 114 50 114 C30 114 14 99 14 76 C14 58 26 48 32 36 C34 50 40 56 46 58 C44 42 44 24 50 8 Z" fill="url(#'+id+'o)"/>'
      + '<path d="M50 52 C58 66 70 74 70 90 C70 104 61 111 50 111 C39 111 30 104 30 90 C30 80 36 74 40 68 C42 76 45 80 49 81 C47 72 46 62 50 52 Z" fill="url(#'+id+'i)"/>'
      + '<ellipse cx="50" cy="98" rx="9" ry="7" fill="#fff" opacity=".55"/></g>';
  return '<svg class="flame fl-'+t.k+(dead ? ' dead' : '')+'" viewBox="0 0 100 120" width="'+sz+'" height="'+Math.round(sz*1.2)+'" role="img" aria-label="'+U.esc(t.n)+'">'
    + '<defs><linearGradient id="'+id+'o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+t.a+'"/><stop offset="1" stop-color="'+t.b+'" stop-opacity=".85"/></linearGradient>'
    + '<radialGradient id="'+id+'i" cx="50%" cy="75%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="'+t.b+'"/><stop offset="1" stop-color="'+t.a+'"/></radialGradient></defs>'
    + (dead ? '' : '<ellipse cx="50" cy="112" rx="30" ry="5" fill="'+t.a+'" opacity=".25"/>') + halo + body + crown + sparks + '</svg>';
};
/* Sys, o espírito da janela do Sistema (mascote original) */
U.mascot = function(mood, size){
  var s = size || 110, id = 'ms' + (++_aid), eyes, mouth, extra = '';
  switch (mood) {
    case 'happy': eyes = '<path d="M40 58 q6 -8 12 0 M68 58 q6 -8 12 0" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; mouth = '<path d="M50 72 q10 9 20 0" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>'; break;
    case 'smug': eyes = '<path d="M39 58 h13 M68 58 h13" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M41 55 q5 -3 10 0 M70 55 q5 -3 10 0" stroke="currentColor" stroke-width="2" fill="none" opacity=".6"/>'; mouth = '<path d="M52 73 q9 5 17 -3" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>'; extra = '<path d="M92 26 l2.4 5.2 5.6 .8 -4 3.9 1 5.6 -5 -2.7 -5 2.7 1 -5.6 -4 -3.9 5.6 -.8z" fill="#f2c14e"/>'; break;
    case 'worried': eyes = '<circle cx="46" cy="58" r="4" fill="currentColor"/><circle cx="74" cy="58" r="4" fill="currentColor"/><path d="M39 49 l12 -3 M81 49 l-12 -3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'; mouth = '<path d="M50 76 q5 -4 10 0 q5 4 10 0" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>'; extra = '<path d="M90 40 q5 8 0 11 q-5 -3 0 -11z" fill="#7cc7ff"/>'; break;
    case 'panic': eyes = '<circle cx="46" cy="57" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="74" cy="57" r="6" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="46" cy="57" r="2" fill="currentColor"/><circle cx="74" cy="57" r="2" fill="currentColor"/>'; mouth = '<ellipse cx="60" cy="76" rx="6" ry="7" fill="currentColor"/>'; extra = '<g fill="#ff5470"><rect x="95" y="16" width="5" height="16" rx="2"/><rect x="95" y="36" width="5" height="5" rx="2"/></g>'; break;
    case 'sleepy': eyes = '<path d="M40 60 q6 4 12 0 M68 60 q6 4 12 0" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; mouth = '<ellipse cx="60" cy="75" rx="4" ry="3" fill="currentColor" opacity=".8"/>'; extra = '<text x="88" y="34" font-size="14" font-family="var(--f-mono)" fill="currentColor" opacity=".8">z</text><text x="97" y="22" font-size="10" font-family="var(--f-mono)" fill="currentColor" opacity=".6">z</text>'; break;
    case 'sad': eyes = '<path d="M40 60 q6 -5 12 0 M68 60 q6 -5 12 0" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round" transform="rotate(180 60 58)"/>'; mouth = '<path d="M50 79 q10 -8 20 0" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>'; extra = '<path d="M44 66 q3 6 0 8 q-3 -2 0 -8z" fill="#7cc7ff"/>'; break;
    case 'party': eyes = '<path d="M46 50 l2 5 5 .6 -3.8 3.4 1 5 -4.2 -2.6 -4.2 2.6 1 -5 -3.8 -3.4 5 -.6z M74 50 l2 5 5 .6 -3.8 3.4 1 5 -4.2 -2.6 -4.2 2.6 1 -5 -3.8 -3.4 5 -.6z" fill="currentColor"/>'; mouth = '<path d="M48 70 q12 14 24 0 z" fill="currentColor"/>'; extra = '<g class="confetti"><rect x="14" y="20" width="5" height="5" fill="#f2c14e" transform="rotate(20 16 22)"/><rect x="100" y="30" width="5" height="5" fill="#ff5fd2" transform="rotate(-15 102 32)"/><rect x="22" y="96" width="4" height="4" fill="#3ee6a8"/><rect x="96" y="92" width="5" height="5" fill="#4fb3ff" transform="rotate(40 98 94)"/></g>'; break;
    default: eyes = '<ellipse cx="46" cy="58" rx="3.6" ry="5" fill="currentColor"/><ellipse cx="74" cy="58" rx="3.6" ry="5" fill="currentColor"/>'; mouth = '<path d="M53 73 q7 5 14 0" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }
  return '<svg class="mascot m-'+(mood||'fresh')+'" viewBox="0 0 120 120" width="'+s+'" height="'+s+'" role="img" aria-label="Sys, o espírito do Sistema">'
    + '<defs><linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--panel2)"/><stop offset="1" stop-color="var(--bg0)"/></linearGradient></defs>'
    + '<ellipse class="m-shadow" cx="60" cy="112" rx="26" ry="4" fill="var(--glow)" opacity=".18"/>'
    + '<g class="m-float"><path d="M60 14 v-8" stroke="var(--glow)" stroke-width="2.5" stroke-linecap="round"/><circle cx="60" cy="5" r="4" fill="var(--glow)"/>'
    + '<path d="M18 56 C18 30 36 14 60 14 C84 14 102 30 102 56 C102 84 86 102 60 102 C34 102 18 84 18 56 Z" fill="url(#'+id+'b)" stroke="var(--glow)" stroke-width="2.5"/>'
    + '<path d="M26 36 H94" stroke="var(--glow)" stroke-width="1.5" opacity=".45"/><circle cx="33" cy="29" r="2" fill="var(--glow)" opacity=".7"/><circle cx="40" cy="29" r="2" fill="var(--glow)" opacity=".5"/><circle cx="47" cy="29" r="2" fill="var(--glow)" opacity=".35"/>'
    + '<ellipse cx="38" cy="70" rx="6" ry="3.5" fill="#ff7ab0" opacity=".35"/><ellipse cx="82" cy="70" rx="6" ry="3.5" fill="#ff7ab0" opacity=".35"/>'
    + '<g style="color:var(--text)">'+eyes+mouth+'</g></g>' + extra + '</svg>';
};
U.portal = function(rank, size, opt){
  opt = opt || {}; var c = SYS.RANKC[rank] || '#4fb3ff', id = 'pt' + (++_aid), s = size || 120;
  return '<svg class="portal'+(opt.dim ? ' dim' : '')+'" viewBox="0 0 100 130" width="'+s+'" height="'+Math.round(s*1.3)+'" role="img" aria-label="Portal Rank '+rank+'">'
    + '<defs><radialGradient id="'+id+'g" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".25" stop-color="'+c+'"/><stop offset=".75" stop-color="'+U.hexA(c,.35)+'"/><stop offset="1" stop-color="#000" stop-opacity=".9"/></radialGradient></defs>'
    + '<ellipse cx="50" cy="120" rx="40" ry="6" fill="'+c+'" opacity=".25"/>'
    + '<ellipse cx="50" cy="58" rx="38" ry="52" fill="url(#'+id+'g)" stroke="'+c+'" stroke-width="3"/>'
    + '<g class="pt-swirl" style="transform-origin:50px 58px" fill="none" stroke="#fff" stroke-linecap="round" opacity=".55"><path d="M50 22 C74 30 76 70 54 82" stroke-width="2"/><path d="M50 94 C26 86 24 46 46 34" stroke-width="2"/><path d="M34 58 C38 44 62 44 66 58" stroke-width="1.5"/></g>'
    + '<ellipse cx="50" cy="58" rx="44" ry="58" fill="none" stroke="'+c+'" stroke-width="1" opacity=".45"/>'
    + '<rect x="36" y="104" width="28" height="18" rx="3" fill="var(--bg0)" stroke="'+c+'" stroke-width="2"/><text x="50" y="118" text-anchor="middle" font-family="var(--f-display)" font-weight="700" font-size="14" fill="'+c+'">'+rank+'</text></svg>';
};
U.chest = function(ch, size, opened){
  var R = SYS.RARITY[ch.r] || SYS.RARITY.rare, c = R.c, id = 'ch' + (++_aid), s = size || 110;
  return '<svg class="chest'+(opened ? ' opened' : '')+'" viewBox="0 0 120 110" width="'+s+'" height="'+Math.round(s*110/120)+'" role="img" aria-label="'+U.esc(ch.n)+'">'
    + '<defs><linearGradient id="'+id+'w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+U.hexA(c,.9)+'"/><stop offset="1" stop-color="'+U.hexA(c,.45)+'"/></linearGradient><radialGradient id="'+id+'l" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="'+c+'"/><stop offset="1" stop-color="'+c+'" stop-opacity="0"/></radialGradient></defs>'
    + '<ellipse cx="60" cy="102" rx="44" ry="6" fill="'+c+'" opacity=".22"/>'
    + '<path class="ch-light" d="M30 52 L10 0 H110 L90 52 Z" fill="url(#'+id+'l)" opacity="0"/>'
    + '<g class="ch-body"><rect x="18" y="52" width="84" height="46" rx="5" fill="var(--bg1)" stroke="'+c+'" stroke-width="3"/>'
    + '<rect x="18" y="62" width="84" height="8" fill="url(#'+id+'w)" opacity=".8"/><rect x="54" y="60" width="12" height="18" rx="2" fill="'+c+'"/><circle cx="60" cy="68" r="2.5" fill="var(--bg0)"/></g>'
    + '<g class="ch-lid" style="transform-origin:18px 52px"><path d="M18 52 V40 C18 26 36 20 60 20 C84 20 102 26 102 40 V52 Z" fill="var(--bg1)" stroke="'+c+'" stroke-width="3"/><path d="M26 44 C28 32 44 28 60 28 C76 28 92 32 94 44" fill="none" stroke="'+c+'" stroke-width="2" opacity=".6"/></g></svg>';
};
U.emblem = function(w, size, n){
  var s = size || 56, id = 'em' + (++_aid), br = (w.branches || []).length;
  var pips = br ? '<g>' + w.branches.map(function(b, i){ var x = 50 + (i - (br - 1) / 2) * 12; return '<circle cx="'+x.toFixed(1)+'" cy="86" r="3.5" fill="'+w.color+'" opacity="'+(n && n[b.id] ? 1 : .4)+'"/>'; }).join('') + '</g>' : '';
  return '<svg class="emblem" viewBox="0 0 100 100" width="'+s+'" height="'+s+'" aria-hidden="true">'
    + '<defs><linearGradient id="'+id+'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+w.color+'"/><stop offset="1" stop-color="'+U.hexA(w.color,.35)+'"/></linearGradient></defs>'
    + '<path d="M50 4 L90 18 V50 C90 74 72 90 50 97 C28 90 10 74 10 50 V18 Z" fill="var(--bg0)" stroke="url(#'+id+'g)" stroke-width="3.5"/>'
    + '<path d="M50 12 L82 23 V50 C82 69 68 82 50 88 C32 82 18 69 18 50 V23 Z" fill="'+U.hexA(w.color,.1)+'" stroke="'+U.hexA(w.color,.35)+'" stroke-width="1"/>'
    + '<g fill="none" stroke="'+w.color+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(29 25) scale(1.75)"><path d="'+(SYS.ICONS[w.icon] || SYS.ICONS.star)+'"/></g>'
    + pips + '</svg>';
};
