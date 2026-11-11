#!/usr/bin/env node
/* Roda as suítes do System Ascension e resume o resultado.
   Uso: node tests/run.js [suíte ...]     (sem argumentos: todas)
   JOBS=n   suítes em paralelo (padrão 2)
   As suítes de asserção valem pelo código de saída. As sondas antigas (v2 a v11, smoke, interact, pzsmoke, reload)
   só imprimem valores: valem pela linha de erros no fim, que precisa vir vazia. */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ASSERT = ['catalog', 'split', 'cidade', 'cidade2', 'cityui', 'recompensas', 'anistia', 'garden', 'voz', 'arte_local', 'citysave', 'citymotor', 'v12test', 'v13test', 'v14test', 'v14btest', 'v14ctest', 'v14dtest', 'v14etest', 'v14rt', 'syncrace', 'mdev'];
const PROBE = ['v2test', 'v3test', 'v3btest', 'v4test', 'v5test', 'v7test', 'v9test', 'v10test', 'v11test', 'smoke', 'interact', 'pzsmoke', 'reload'];
/* falha de rede para fora (fontes do Google num ambiente sem internet) não é falha do app; arquivo do app que não carrega é */
const NET = /ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|ERR_PROXY_CONNECTION_FAILED|ERR_CONNECTION_(REFUSED|RESET|CLOSED|TIMED_OUT)/;

const want = process.argv.slice(2).map(s => s.replace(/\.js$/, ''));
const all = ASSERT.concat(PROBE).filter(s => fs.existsSync(path.join(DIR, s + '.js')));
const list = want.length ? all.filter(s => want.indexOf(s) >= 0) : all;
const unknown = want.filter(s => all.indexOf(s) < 0);
if (unknown.length) { console.error('suíte desconhecida: ' + unknown.join(', ')); process.exit(2); }
const JOBS = Math.max(1, +process.env.JOBS || 2);
const LOGS = path.join(DIR, 'logs');
fs.mkdirSync(LOGS, { recursive: true });
fs.mkdirSync(path.join(DIR, 'shots'), { recursive: true });

function probeErrors(out){
  if (/^erros:\s*nenhum\s*$/m.test(out) || /"errs":\[\]/.test(out)) return [];
  const m = out.match(/^ERRORS:\s*([\s\S]*)$/m);
  if (!m) return ['a sonda não imprimiu a linha de erros'];
  const body = m[1].trim();
  if (body === 'none') return [];
  return body.split('\n').map(s => s.trim()).filter(s => s && !NET.test(s));
}

function runOne(name){
  return new Promise(resolve => {
    const t0 = Date.now(), log = path.join(LOGS, name + '.log');
    const child = spawn(process.execPath, [name + '.js'], { cwd: DIR, env: process.env });
    let out = '';
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    const kill = setTimeout(() => { out += '\n[run] tempo esgotado (15 min)\n'; child.kill('SIGKILL'); }, 15 * 60 * 1000);
    child.on('close', code => {
      clearTimeout(kill);
      fs.writeFileSync(log, out);
      const oks = (out.match(/^\s*ok\s/gm) || []).length;
      const fails = (out.match(/^.*\bFAIL\b.*$/gm) || []);
      let bad = [];
      if (PROBE.indexOf(name) >= 0) bad = code === 0 ? probeErrors(out) : ['código de saída ' + code];
      else { if (code !== 0) bad.push('código de saída ' + code); bad = bad.concat(fails.slice(0, 8).map(s => s.trim())); }
      resolve({ name, code, oks, bad, s: Math.round((Date.now() - t0) / 1000), log });
    });
  });
}

(async () => {
  const queue = list.slice(), results = [];
  const t0 = Date.now();
  async function worker(){
    while (queue.length) {
      const n = queue.shift();
      const r = await runOne(n);
      results.push(r);
      console.log((r.bad.length ? 'FALHOU ' : 'ok     ') + n.padEnd(10) + ' ' + String(r.oks).padStart(4) + ' asserções  ' + String(r.s).padStart(4) + ' s');
      r.bad.forEach(b => console.log('         ' + b.slice(0, 300)));
    }
  }
  await Promise.all(Array.from({ length: Math.min(JOBS, list.length) }, worker));
  const bad = results.filter(r => r.bad.length);
  const total = results.reduce((a, r) => a + r.oks, 0);
  console.log('\n' + results.length + ' suítes · ' + total + ' asserções · ' + Math.round((Date.now() - t0) / 1000) + ' s · ' + (bad.length ? bad.length + ' com falha: ' + bad.map(r => r.name).join(', ') : 'tudo verde'));
  if (bad.length) console.log('logs em tests/logs/');
  process.exit(bad.length ? 1 : 0);
})();
