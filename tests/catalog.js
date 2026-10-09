/* Catálogo de portais: confere formato, quantidade e as travas de segurança dos 245 modelos.
   Uso: node tests/catalog.js [distrito]   (sem argumento: todos; com distrito, só ele, sem exigir os outros) */
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = path.join(__dirname, '..', 'src');
let fails = 0, oks = 0;
const ok = (c, m) => { if (c) { oks++; console.log('  ok   ' + m); } else { fails++; console.log('  FAIL ' + m); } };
const only = process.argv[2] || '';

const ctx = { SYS: {}, console };
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(SRC, f), 'utf8'), ctx, { filename: f });
load('70_city_data.js');
const files = fs.readdirSync(SRC).filter(f => /^74[a-z]_cat_.*\.js$/.test(f)).sort();
files.forEach(load);
const CY = ctx.SYS.CITY, CAT = CY.CAT || [];
const DIST = CY.DIST.filter(d => !only || d.id === only);

/* faixa de minutos por rank (Bíblia: E 15–25, D 30–45, C 1–2 h numa sentada, B 3–5 sessões) */
const MIN = { E: [15, 25], D: [30, 45], C: [60, 120], B: [180, 480] };
const LEN = { n: 44, lore: 240, obj: 300, ent: 180, crit: 140 };
/* temas proibidos (Bíblia, travas do motor): carga física insegura, perda de sono, gastar dinheiro, contato com terceiros sem o seu ok */
const BAD = [
  /\b(compre|comprar|gaste|gastar|assine|assinar|pague|pagar|invista|investir de verdade|aposte|apostar)\b/i,
  /\b(madrugada|vire a noite|virar a noite|sem dormir|acorde às [0-5]h|durma menos)\b/i,
  /\b(at[eé] a falha|carga m[aá]xima|1 ?rm|m[aá]ximo de peso|sem aquecer)\b/i,
  /\b(ligue para|mande (uma )?mensagem para|envie (um )?e-?mail para|poste no perfil d[eo] cliente|contate)\b/i
];
const SAFE_SEND = /(rascunh|sem enviar|só envie se|enviar é opcional|com o seu ok|só com seu ok)/i;
const PH = /\{(no|topico)\}/g;

console.log('\n— ' + files.length + ' arquivo(s), ' + CAT.length + ' modelo(s) —');
const ids = {};
CAT.forEach(t => { ids[t.id] = (ids[t.id] || 0) + 1; });
const dup = Object.keys(ids).filter(k => ids[k] > 1);
ok(dup.length === 0, 'ids únicos ' + dup.slice(0, 5).join(','));

DIST.forEach(d => {
  const list = CAT.filter(t => t.d === d.id);
  const by = r => list.filter(t => t.r === r).length;
  console.log('\n— ' + d.n + ' (' + list.length + ') —');
  ok(by('E') === 10 && by('D') === 10 && by('C') === 10 && by('B') === 5, 'contagem: E ' + by('E') + ' · D ' + by('D') + ' · C ' + by('C') + ' · B ' + by('B') + ' (esperado 10 · 10 · 10 · 5)');
  const errs = [];
  list.forEach(t => {
    const where = t.id + ': ';
    ['id', 'd', 'r', 'n', 'lore', 'obj', 'ent'].forEach(k => { if (typeof t[k] !== 'string' || !t[k].trim()) errs.push(where + 'campo ' + k + ' vazio'); });
    if (!/^[a-z]{3}-[edcb]\d\d$/.test(t.id || '')) errs.push(where + 'id fora do padrão xxx-e01');
    if (!MIN[t.r]) errs.push(where + 'rank inválido ' + t.r);
    else if (!(t.min >= MIN[t.r][0] && t.min <= MIN[t.r][1])) errs.push(where + 'min ' + t.min + ' fora da faixa ' + MIN[t.r].join('–'));
    if (!Array.isArray(t.crit) || t.crit.length !== 3 || t.crit.some(c => typeof c !== 'string' || !c.trim())) errs.push(where + 'precisa de exatamente 3 critérios');
    if (!(Number.isInteger(t.rua) && t.rua >= -1 && t.rua < d.ruas.length)) errs.push(where + 'rua ' + t.rua + ' inválida (use -1 ou 0..' + (d.ruas.length - 1) + ')');
    if ((t.r === 'C' || t.r === 'B') && t.rua === -1 && !t.cruza) errs.push(where + 'C e B moram numa rua (rua -1 só com cruza: true)');
    Object.keys(LEN).forEach(k => { const v = k === 'crit' ? (t.crit || []) : [t[k] || '']; v.forEach(s => { if (String(s).length > LEN[k]) errs.push(where + k + ' com ' + String(s).length + ' caracteres (máx. ' + LEN[k] + ')'); }); });
    const all = [t.n, t.lore, t.obj, t.ent].concat(t.crit || [], t.passos || []).join(' ');
    const ph = all.match(PH) || [];
    if (ph.length && t.r !== 'E' && t.r !== 'D') errs.push(where + 'marcador {no}/{topico} só vale em E e D');
    if ((all.match(/\{[^}]*\}/g) || []).some(m => m !== '{no}' && m !== '{topico}')) errs.push(where + 'marcador desconhecido ' + (all.match(/\{[^}]*\}/g) || []).join(' '));
    BAD.forEach((re, i) => { if (re.test(all) && !(i === 3 && SAFE_SEND.test(all)) && !(i === 0 && /(n[aã]o (compre|gaste|pague|invista)|sem (comprar|gastar)|simulad|de mentira|papel)/i.test(all))) errs.push(where + 'tema proibido: ' + (all.match(re) || [''])[0]); });
    if (t.fis && !(d.fis || []).includes(t.rua)) errs.push(where + 'fis: true só nas ruas físicas do distrito (' + JSON.stringify(d.fis || []) + ')');
    if (t.fis && !/(aquec|pare se|sem dor|confort|no seu ritmo|t[eé]cnica)/i.test(all)) errs.push(where + 'portal físico precisa de aviso de aquecimento ou de parar com dor');
    if (t.passos && (!Array.isArray(t.passos) || t.passos.length < 2 || t.passos.length > 6)) errs.push(where + 'passos: de 2 a 6');
    if (/[“”]/.test(all) && false) errs.push(where + 'aspas');
  });
  ok(errs.length === 0, 'formato, faixas de tempo, marcadores e travas' + (errs.length ? '\n         ' + errs.slice(0, 25).join('\n         ') : ''));
  const ed = list.filter(t => t.r === 'E' || t.r === 'D');
  ok(ed.filter(t => /\{no\}|\{topico\}/.test(t.obj)).length >= 12, 'E e D puxam o nó ativo: ' + ed.filter(t => /\{no\}|\{topico\}/.test(t.obj)).length + ' de 20 com {no} ou {topico} no objetivo (mínimo 12)');
  const cb = list.filter(t => t.r === 'C' || t.r === 'B');
  const ruas = new Set(cb.map(t => t.rua));
  ok(d.ruas.every((_, i) => ruas.has(i)), 'C e B cobrem todas as ruas (' + d.ruas.length + ')');
  const names = list.map(t => t.n.toLowerCase());
  ok(new Set(names).size === names.length, 'nomes sem repetição no distrito');
});

if (!only) ok(CAT.length === 245, 'total de 245 modelos (' + CAT.length + ')');
console.log('\n=== ' + oks + ' ok · ' + fails + ' fail ===');
process.exit(fails ? 1 : 0);
