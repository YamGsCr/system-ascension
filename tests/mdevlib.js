/* Vários aparelhos de verdade (páginas com o app inteiro) contra UMA nuvem compartilhada que mora no Node.
   Cada aparelho tem a sua latência, pode ficar sem sinal, e pode ter relógio simulado. */
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.join(__dirname, '..', 'dist', 'test_nomock.html');
/* página vazia da mesma origem, só para semear o cache antes de o app carregar. (Semear dentro do script de inicialização
   não serve: neste Chromium, mexer no localStorage tão cedo às vezes deixa a aba com um armazenamento "solto", que nenhuma
   outra aba nem o recarregar enxergam — parecia perda de dados do app e era do banco de testes.) */
const SEED = 'file://' + path.join(__dirname, '..', 'dist', '_seed.html');
require('fs').writeFileSync(path.join(__dirname, '..', 'dist', '_seed.html'), '<!doctype html><meta charset="utf-8"><title>seed</title>');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CORE = 'data/users/u_test/core', NOTES = 'data/users/u_test/notes';

function mkCloud() {
  const C = { docs: new Map(), subs: [], writes: 0, reads: 0, log: [], hist: [], t0: Date.now(), devs: {} };
  C.stamp = () => ((Date.now() - C.t0) / 1000).toFixed(2);
  C.deliver = async (dev, p, body) => { try { await dev.page.evaluate(([p, body]) => window.__deliver && window.__deliver(p, body), [p, body]); } catch (e) {} };
  C.broadcast = (p) => { const body = C.docs.has(p) ? C.docs.get(p) : null; C.subs.filter(s => s.path === p && !s.dev.offline && !s.dev.closed).forEach(s => C.deliver(s.dev, p, body)); };
  C.core = () => { const b = C.docs.get(CORE); return b ? JSON.parse(b) : null; };
  C.notes = () => { const b = C.docs.get(NOTES); return b ? JSON.parse(b) : null; };
  C.put = (p, obj) => { C.docs.set(p, JSON.stringify(obj)); };
  return C;
}
async function openDevice(browser, C, name, o) {
  o = o || {};
  const lat = Object.assign({ get: 20, set: 30, echo: 30, sub: 60 }, o.lat || {});
  const fresh = !o.ctx;
  const ctx = o.ctx || await browser.newContext(o.mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: o.viewport || { width: 1280, height: 900 } });
  const dev = { name, ctx, lat, offline: false, closed: false, errs: [] };
  if (fresh) {
    await ctx.exposeFunction('__cget', async (who, p) => { const d = C.devs[who]; C.reads++; await sleep(d.lat.get); if (d.offline) throw new Error('unavailable'); return C.docs.has(p) ? C.docs.get(p) : null; });
    await ctx.exposeFunction('__cset', async (who, p, body) => {
      const d = C.devs[who]; const j = JSON.parse(body);
      await sleep(d.lat.set); if (d.offline) throw new Error('unavailable');
      C.writes++; C.log.push(C.stamp() + ' ' + who + ' gravou ' + p.split('/').pop() + ' _u=' + String(j._u).slice(11, 23) + ' _e=' + String(j._e).slice(11, 23));
      C.hist.push({ who, doc: p.split('/').pop(), u: j._u, e: j._e, w: j._w }); C.docs.set(p, body); setTimeout(() => C.broadcast(p), d.lat.echo); return true;
    });
    await ctx.exposeFunction('__csub', async (who, p) => { const d = C.devs[who]; C.subs.push({ dev: d, path: p }); setTimeout(() => { if (!d.offline && !d.closed) C.deliver(d, p, C.docs.has(p) ? C.docs.get(p) : null); }, d.lat.sub); return true; });
  }
  C.devs[name] = dev;
  const page = await ctx.newPage(); dev.page = page;
  page.on('pageerror', e => dev.errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts\.g|Failed to load resource/.test(m.text())) dev.errs.push('console: ' + m.text().slice(0, 300)); });
  if (o.clock) await page.clock.install({ time: new Date(o.clock) });
  if (o.seed) { await page.goto(SEED); await page.evaluate((seed) => { Object.keys(seed).forEach(k => localStorage.setItem(k, JSON.stringify(seed[k]))); }, o.seed); }
  await page.addInitScript(({ name }) => {
    if (!/test_nomock/.test(location.href)) return;
    const L = {};
    const snapOf = (p, body, cache) => ({ id: p.split('/').pop(), exists: body != null, data: () => body == null ? undefined : JSON.parse(body), metadata: { fromCache: !!cache, hasPendingWrites: false } });
    /* cache = true: o navegador entregando a cópia guardada dele, antes de a nuvem responder */
    window.__deliver = (p, body, cache) => { (L[p] || []).forEach(fn => fn(snapOf(p, body, cache))); };
    const err = (e) => { throw { code: 'unavailable', message: String(e && e.message) }; };
    const db = { doc: (p) => ({
      get: () => window.__cget(name, p).then(body => snapOf(p, body), err),
      set: (data) => window.__cset(name, p, JSON.stringify(data)).then(() => undefined, err),
      onSnapshot: (next) => { (L[p] = L[p] || []).push(next); window.__csub(name, p); return () => {}; }
    }) };
    const user = { id: () => Promise.resolve('u_test'), me: () => Promise.resolve({ id: 'u_test', name: 'T' }) };
    window.claude = { use: (n) => new Promise(res => setTimeout(() => res(n === 'db' ? db : n === 'user' ? user : null), 20)) };
  }, { name });
  await page.goto(o.url || URL);   /* o.url: outra montagem do app (ex.: a versão antiga, para testar convivência) */
  dev.ev = (fn, arg) => page.evaluate(fn, arg);
  dev.core = () => page.evaluate(() => { const A = SYS.App, St = SYS.Store, z = A.S.pz || {}; return { name: A.S.profile.name, a01: !!A.S.nodes.A01, _u: A.S._u, _e: A.S._e, status: St.status, pending: !!St.pending.core, writing: !!St.writing.core, d: St.meta.core && St.meta.core.d, adopted: St.adopted.core || 0, hold: document.body.classList.contains('sy-hold'), ask: !!document.getElementById('syhold'), ov: A.ui.pz ? A.ui.pz.k : null, miss: (z.tot || {}).miss, open: (z.pens || []).filter(x => x.st === 'open').length, lost: !!localStorage.getItem('sysasc.lost.v1'), marks: Object.keys(A.S.flags.marks || {}).sort().join(','), toasts: (document.getElementById('toasts') || {}).innerText || '' }; });
  dev.close = async () => { dev.closed = true; try { await page.close(); } catch (e) {} };
  return dev;
}
/* estado base: um save "usado", produzido pelo próprio app; mut é código que ajusta o estado (recebe s) */
async function baseState(browser, mut, clock) {
  const p = await browser.newPage();
  if (clock) await p.clock.install({ time: new Date(clock) });
  await p.goto(URL);
  if (clock) await p.clock.runFor(600); else await sleep(500);
  const base = await p.evaluate((mut) => { const A = SYS.App; A.S.profile.name = 'BASE'; A.S.settings.motion = false; A.commit(['core'], { quiet: true }); const s = JSON.parse(JSON.stringify(A.S)); delete s._by; delete s._bn; delete s._b0; s._b = s._u; s._bx = s._e || s._u; /* cache de um aparelho que sincronizou exatamente esta versão */ if (mut) (new Function('s', mut))(s); return s; }, mut || '');
  await p.close(); return base;
}
/* avança o relógio simulado de vários aparelhos em passos, deixando a nuvem (tempo real) circular entre eles */
async function advance(devs, ms, step) {
  step = step || 250;
  for (let t = 0; t < ms; t += step) { for (const d of devs) { try { await d.page.clock.runFor(step); } catch (e) {} } await sleep(45); }
}
module.exports = { chromium, URL, sleep, mkCloud, openDevice, baseState, advance, CORE, NOTES };
