const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1360,height:900} });
  const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL/.test(m.text())) errs.push('console: ' + m.text()); });
  await p.goto('file://' + path.join(__dirname, '..', 'dist', 'test_legacy.html')); await sleep(900);
  const log = (k, v) => console.log(k.padEnd(22), JSON.stringify(v));
  // counts
  log('shop counts', await p.evaluate(() => SYS.WAYS.reduce((m,w)=>(m[w.id]=w.shop.length,m),{})));
  log('cosmetics', await p.evaluate(() => ({nc:SYS.NAMECARDS.length, fr:SYS.FRAMES.length, fx:SYS.FX.length, anim:SYS.NAMECARDS.filter(x=>x.anim).length + SYS.FRAMES.filter(x=>x.anim).length + SYS.FX.filter(x=>x.anim).length})));
  // focus toggle via UI
  await p.evaluate(() => location.hash = '#/status'); await sleep(400);
  log('focus inicial', await p.evaluate(() => SYS.E.focusWays(SYS.App.S)));
  await p.click('[data-a="focusToggle"][data-id="architect"]'); await sleep(250); // remove architect
  log('apos remover arq', await p.evaluate(() => SYS.E.focusWays(SYS.App.S)));
  await p.click('[data-a="focusToggle"][data-id="flaneur"]'); await sleep(250);
  log('apos add flaneur', await p.evaluate(() => SYS.E.focusWays(SYS.App.S)));
  await p.click('[data-a="focusToggle"][data-id="navigation"]'); await sleep(250); // 3º foco
  await p.click('[data-a="focusToggle"][data-id="architect"]'); await sleep(250); // já são 3 → deve avisar
  log('tentando 4o', await p.evaluate(() => ({foc:SYS.E.focusWays(SYS.App.S), main:SYS.App.S.settings.season.main})));
  // reduzir a 1 e tentar zerar
  await p.evaluate(() => { SYS.E.setFocus(SYS.App.S, ['navigation']); SYS.App.commit(['core']); }); await sleep(300);
  await p.click('[data-a="focusToggle"][data-id="navigation"]'); await sleep(250);
  log('minimo 1', await p.evaluate(() => SYS.E.focusWays(SYS.App.S)));
  log('daily $main', await p.evaluate(() => SYS.App.dailyWay(SYS.SYS_D || SYS.DAILIES[0])));
  // comprar cosmético animado
  await p.evaluate(() => { SYS.App.S.ach.sys_first = '2026-09-17'; SYS.App.S.chests.gemBack = 5000; SYS.App.commit(['core']); }); await sleep(200);
  await p.evaluate(() => location.hash = '#/lojas/sistema/cosmeticos'); await sleep(450);
  const gem0 = await p.evaluate(() => SYS.App.D.gem);
  await p.evaluate(() => { const btn = [...document.querySelectorAll('[data-a="sysBuyOpen"][data-k="namecards"][data-id="nc_rgbsetup"]')][0]; btn && btn.click(); }); await sleep(350);
  await p.evaluate(() => { const b = [...document.querySelectorAll('[data-a="sysBuyDo"]')][0]; b && b.click(); }); await sleep(450);
  log('comprou namecard', await p.evaluate(() => ({owned:SYS.App.S.owned.namecards, gemAntes:0, gem:SYS.App.D.gem})));
  await p.evaluate(() => { SYS.App.S.profile.namecard='nc_rgbsetup'; SYS.App.S.profile.fx='fx_rainbow'; SYS.App.S.owned.fx.push('fx_rainbow'); SYS.App.commit(['core']); location.hash='#/perfil'; }); await sleep(500);
  await p.screenshot({ path:'shots/v3_perfil.png' });
  await p.evaluate(() => location.hash = '#/lojas/sistema/cosmeticos'); await sleep(500);
  await p.screenshot({ path:'shots/v3_cosmeticos.png', fullPage:false });
  await p.evaluate(() => location.hash = '#/status'); await sleep(400);
  await p.screenshot({ path:'shots/v3_status.png' });
  await p.evaluate(() => location.hash = '#/lojas/mind'); await sleep(400);
  await p.screenshot({ path:'shots/v3_shop_mind.png' });
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await b.close();
})();
