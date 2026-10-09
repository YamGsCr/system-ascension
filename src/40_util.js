/* ===== UTILITÁRIOS, ÍCONES, MEDALHAS, RADAR ===== */
var U = SYS.U = {};
U.esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
U.ymd = function(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
U.resetHour = function(){ var A = SYS.App, h = A && A.S && A.S.settings ? A.S.settings.resetHour : null; h = (h == null ? SYS.RESET_HOUR : +h); return isNaN(h) ? 8 : h; };
U.today = function(){ return U.ymd(new Date(Date.now() - U.resetHour() * 3600000)); };
U.calToday = function(){ return U.ymd(new Date()); };
U.nextReset = function(){ var n = new Date(), r = new Date(n.getTime()); r.setHours(U.resetHour(), 0, 0, 0); if (r.getTime() <= n.getTime()) r.setDate(r.getDate() + 1); return r; };
U.msToReset = function(){ return U.nextReset().getTime() - Date.now(); };
U.fmtDur = function(ms){ var m = Math.max(0, Math.floor(ms / 60000)), h = Math.floor(m / 60); m = m % 60; return h ? h + 'h' + String(m).padStart(2, '0') : m + 'min'; };
U.clock = function(){ var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
U.hash = function(s){ var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
U.seeded = function(seed){ var a = U.hash(String(seed)); return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
U.rand = function(){ try { var b = new Uint32Array(1); crypto.getRandomValues(b); return b[0] / 4294967296; } catch(e){ return Math.random(); } };
U.parse = function(s){ var p = s.split('-').map(Number); return new Date(p[0], p[1]-1, p[2]); };
U.addDays = function(s, n){ var d = U.parse(s); d.setDate(d.getDate()+n); return U.ymd(d); };
U.weekKey = function(s){ var d = U.parse(s); var wd = (d.getDay()+6)%7; d.setDate(d.getDate()-wd); return U.ymd(d); };
U.monthKey = function(s){ return s.slice(0,7); };
U.daysBetween = function(a, b){ return Math.round((U.parse(b) - U.parse(a)) / 86400000); };
U.fmtDate = function(s){ if(!s) return ''; var d = s.length > 10 ? new Date(s) : U.parse(s); return d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}); };
U.fmtMonth = function(k){ var p=k.split('-'); return new Date(+p[0], +p[1]-1, 1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}); };
U.uid = function(){ return Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4); };
U.slug = function(s){ return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); };
U.num = function(n){ return Math.round(n).toLocaleString('pt-BR'); };
U.pick = function(a){ return a[Math.floor(Math.random()*a.length)]; };
U.clamp = function(v,a,b){ return Math.max(a, Math.min(b, v)); };
U.pct = function(a,b){ return b ? Math.round(a/b*100) : 0; };
U.ls = {
  get:function(k){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }catch(e){ return null; } },
  set:function(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
  del:function(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
U.hexA = function(hex, a){ var h = hex.replace('#',''); var n = parseInt(h,16); return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; };

SYS.ICONS = {
  compass:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M15.5 8.5l-2 5-5 2 2-5z',
  quill:'M20 4c-7 1-12 6-14 13l-2 3 M6 17c2-1 5-1 7-3 M12 11c2-1 5-3 6-6',
  flame:'M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.8 2.2-5.5 0.8 1 1.6 1.7 2.8 2 0.2-2.3-0.8-4.2 0-6.5z',
  helm:'M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M12 2v5 M12 17v5 M2 12h5 M17 12h5 M4.9 4.9l3.6 3.6 M15.5 15.5l3.6 3.6 M19.1 4.9l-3.6 3.6 M8.5 15.5l-3.6 3.6',
  wave:'M2 12h3l2-6 3 12 3-9 2 6 2-3h5',
  crown:'M3 19h18 M4 19l-1.5-11 5.5 4 4-7 4 7 5.5-4-1.5 11',
  eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  status:'M3 4h18v16H3z M3 9h18 M7 13h6 M7 16h10',
  map:'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14',
  scroll:'M7 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8 M7 3a2 2 0 0 0-2 2v2h4 M7 3a2 2 0 0 1 2 2v14a2 2 0 0 0 2 2 M12 8h5 M12 12h5 M12 16h3',
  gate:'M4 21V10a8 8 0 0 1 16 0v11 M3 21h18 M8 21v-8a4 4 0 0 1 8 0v8',
  medal:'M12 11a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M8 3l4 7 4-7 M12 14.5v3',
  banner:'M6 3h12v18l-6-4-6 4z',
  flag:'M5 21V4 M5 4h12l-2.5 4L17 12H5',
  target:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z M12 11.2a0.8 0.8 0 1 0 0 1.6a0.8 0.8 0 1 0 0-1.6z',
  bag:'M5 8h14l-1.2 12.5H6.2z M9 8V6.5a3 3 0 0 1 6 0V8',
  book:'M4 19V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14',
  journal:'M5 3h13a1 1 0 0 1 1 1v17H6a1 1 0 0 1-1-1z M9 3v18 M12 8h4 M12 12h4',
  pen:'M4 20h4L19 9l-4-4L4 16z M13.5 6.5l4 4',
  user:'M12 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z M3.5 21a8.5 8.5 0 0 1 17 0',
  shield:'M12 3l8 3v6c0 5-3.5 8.3-8 9-4.5-0.7-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5',
  lock:'M5 11h14v10H5z M8 11V8a4 4 0 0 1 8 0v3',
  check:'M4.5 12.5l4.5 4.5 10-10',
  star:'M12 3l2.7 5.6 6.1 0.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-0.8z',
  sword:'M14 3h7v7l-9.5 9.5 M3 21l4.5-4.5 M5.5 13.5l5 5 M10.5 13.5l-2-2',
  clock:'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7v5.5l3.5 2',
  sparkle:'M12 2l2.2 6.2L20.5 10l-6.3 1.9L12 18l-2.2-6.1L3.5 10l6.3-1.8z M19 16l0.8 2.2 2.2 0.8-2.2 0.8L19 22l-0.8-2.2-2.2-0.8 2.2-0.8z',
  cloud:'M7 18h10.5a4 4 0 0 0 0.3-8A6 6 0 0 0 6.3 11.2 3.5 3.5 0 0 0 7 18z',
  download:'M12 4v11 M7 10.5l5 5 5-5 M5 20h14',
  upload:'M12 20V9 M7 13.5l5-5 5 5 M5 4h14',
  alert:'M12 3l10 18H2z M12 10v5 M12 17.5v0.5',
  grass:'M4 21c1.5-4 1.5-8 0.5-12 M9 21c0-5 1-9.5 4-13.5 M14 21c-1-4 0-7.5 3-10.5 M19.5 21c-1-3-1-5.5 1-8',
  moon:'M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  oracle:'M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z M5 19h14',
  dots:'M5 12h.01 M12 12h.01 M19 12h.01',
  close:'M6 6l12 12 M18 6L6 18',
  ext:'M14 4h6v6 M20 4l-9 9 M18 14v6H4V6h6',
  cert:'M7 3h10v7a5 5 0 0 1-10 0z M9.5 21L12 18l2.5 3 M12 15v3',
  plus:'M12 5v14 M5 12h14',
  trash:'M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14',
  chev:'M9 5l7 7-7 7',
  back:'M15 5l-7 7 7 7',
  gem:'M6 3h12l4 6-10 12L2 9z M2 9h20 M9 3l3 18 3-18',
  seal:'M12 2l2.5 2.3 3.3-0.5 0.9 3.2 3 1.6-1.2 3.1 1.2 3.1-3 1.6-0.9 3.2-3.3-0.5L12 22l-2.5-2.3-3.3 0.5-0.9-3.2-3-1.6 1.2-3.1-1.2-3.1 3-1.6 0.9-3.2 3.3 0.5z M9 12l2 2 4-4',
  dot:'M12 11a1 1 0 1 0 0 2a1 1 0 1 0 0-2z'
};
U.icon = function(name, cls){ return '<svg class="ic '+(cls||'')+'" viewBox="0 0 24 24" aria-hidden="true"><path d="'+(SYS.ICONS[name]||SYS.ICONS.dot)+'"/></svg>'; };

var _mid = 0;
function polyPts(n, r, rot, cx, cy){ var p=[]; for(var i=0;i<n;i++){ var a = rot + i*2*Math.PI/n; p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)); } return p.join(' '); }
function starPts(n, r1, r2, cx, cy){ var p=[]; for(var i=0;i<n*2;i++){ var r = i%2 ? r2 : r1; var a = -Math.PI/2 + i*Math.PI/n; p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)); } return p.join(' '); }
U.shape = function(kind, scale){
  var s = scale || 1, c = 50;
  function sc(v){ return c + (v - c) * s; }
  switch(kind){
    case 'hex': return '<polygon points="'+polyPts(6, 44*s, -Math.PI/2, 50, 50)+'"/>';
    case 'oct': return '<polygon points="'+polyPts(8, 44*s, -Math.PI/8, 50, 50)+'"/>';
    case 'star': return '<polygon points="'+starPts(8, 46*s, 37*s, 50, 50)+'"/>';
    case 'diamond': return '<polygon points="'+[[50,4],[94,50],[50,96],[6,50]].map(function(p){return sc(p[0]).toFixed(1)+','+sc(p[1]).toFixed(1)}).join(' ')+'"/>';
    case 'shield': return '<path d="M'+sc(50)+' '+sc(5)+' L'+sc(87)+' '+sc(17)+' V'+sc(47)+' C'+sc(87)+' '+sc(72)+' '+sc(69)+' '+sc(88)+' '+sc(50)+' '+sc(95)+' C'+sc(31)+' '+sc(88)+' '+sc(13)+' '+sc(72)+' '+sc(13)+' '+sc(47)+' V'+sc(17)+' Z"/>';
    case 'badge': return '<rect x="'+sc(9)+'" y="'+sc(9)+'" width="'+(82*s)+'" height="'+(82*s)+'" rx="'+(18*s)+'"/>';
    case 'pent': return '<polygon points="'+polyPts(5, 46*s, -Math.PI/2, 50, 53)+'"/>';
    case 'portal': return '<ellipse cx="50" cy="50" rx="'+(36*s)+'" ry="'+(46*s)+'"/>';
    default: return '<circle cx="50" cy="50" r="'+(44*s)+'"/>';
  }
};
/* Medalha procedural: forma pela categoria, cor pela raridade, glifo pelo ícone */
U.medal = function(a, opts){
  opts = opts || {};
  var size = opts.size || 72, locked = !!opts.locked;
  var R = SYS.RARITY[a.r] || SYS.RARITY.common, col = R.c, id = 'md' + (++_mid);
  var shape = {node:'hex', gate:a.final ? 'star' : 'shield', mastery:'oct', cert:'badge', system:'circle', secret:'diamond', feat:'pent', dungeon:'portal'}[a.cat] || 'circle';
  var icon = locked && a.secret ? 'lock' : (a.ic || 'star');
  var ribbons = (a.r === 'legendary' || a.r === 'mythic') ? '<g opacity=".95"><polygon points="34,70 24,98 36,91 44,99 48,74" fill="'+U.hexA(col,.85)+'"/><polygon points="66,70 76,98 64,91 56,99 52,74" fill="'+U.hexA(col,.7)+'"/></g>' : '';
  var sparks = a.r === 'mythic' ? '<g stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".85"><path d="M14 18l0 6 M11 21h6 M86 16v5 M83.5 18.5h5 M88 80v4 M86 82h4"/></g>' : '';
  var svg = '<svg class="medal'+(locked?' locked':'')+(a.r==='mythic'&&!locked?' mythic':'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 100 100" role="img" aria-label="'+U.esc(locked && a.secret ? 'Conquista secreta' : a.n)+'">'
    + '<defs><radialGradient id="'+id+'g" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset=".35" stop-color="'+col+'"/><stop offset="1" stop-color="'+U.hexA(col,.55)+'"/></radialGradient>'
    + '<radialGradient id="'+id+'i" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#16243f"/><stop offset="1" stop-color="#060b16"/></radialGradient></defs>'
    + ribbons
    + '<g fill="url(#'+id+'g)">'+U.shape(shape,1)+'</g>'
    + '<g fill="url(#'+id+'i)" stroke="'+U.hexA(col,.9)+'" stroke-width="1.5">'+U.shape(shape,.8)+'</g>'
    + '<g fill="none" stroke="'+col+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" transform="translate(31 31) scale(1.58)"><path d="'+(SYS.ICONS[icon]||SYS.ICONS.star)+'"/></g>'
    + '<path d="M26 30 A30 30 0 0 1 50 18" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>'
    + sparks + '</svg>';
  return svg;
};

/* Radar heptagonal dos atributos */
U.radar = function(items, size){
  size = size || 280; var cx = 150, cy = 150, R = 105, n = items.length;
  function pt(i, r){ var a = -Math.PI/2 + i*2*Math.PI/n; return [cx + r*Math.cos(a), cy + r*Math.sin(a)]; }
  var rings = [0.25,0.5,0.75,1].map(function(f){ return '<polygon points="'+items.map(function(_,i){ return pt(i,R*f).map(function(v){return v.toFixed(1)}).join(','); }).join(' ')+'" fill="none" stroke="var(--line)" stroke-width="1"/>'; }).join('');
  var axes = items.map(function(_,i){ var p = pt(i,R); return '<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'" stroke="var(--line)" stroke-width="1"/>'; }).join('');
  var poly = items.map(function(it,i){ return pt(i, R*Math.max(0.04, it.v)).map(function(v){return v.toFixed(1)}).join(','); }).join(' ');
  var dots = items.map(function(it,i){ var p = pt(i, R*Math.max(0.04,it.v)); return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.5" fill="'+it.c+'" stroke="var(--bg0)" stroke-width="1.5"/>'; }).join('');
  var labels = items.map(function(it,i){ var p = pt(i, R+26); return '<text x="'+p[0].toFixed(1)+'" y="'+(p[1]-3).toFixed(1)+'" text-anchor="middle" class="rd-k" fill="'+it.c+'">'+U.esc(it.k)+'</text><text x="'+p[0].toFixed(1)+'" y="'+(p[1]+11).toFixed(1)+'" text-anchor="middle" class="rd-v">'+U.esc(it.val)+'</text>'; }).join('');
  return '<svg class="radar" viewBox="0 0 300 300" width="'+size+'" height="'+size+'" role="img" aria-label="Radar de atributos">'+rings+axes+'<polygon points="'+poly+'" fill="var(--accent)" fill-opacity=".18" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>'+dots+labels+'</svg>';
};
