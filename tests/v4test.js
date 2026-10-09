const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1360,height:1100}});
  const errs=[]; p.on('pageerror',e=>errs.push('pageerror: '+e.message));
  p.on('console',m=>{ if(m.type()==='error'&&!/ERR_TUNNEL/.test(m.text())) errs.push('console: '+m.text()); });
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(900);
  const log=(k,v)=>console.log(k.padEnd(20), JSON.stringify(v));
  log('fixos/foco', await p.evaluate(()=>({fix:SYS.E.fixedWays(SYS.App.S), foc:SYS.E.focusWays(SYS.App.S), main:SYS.E.mainWay(SYS.App.S)})));
  log('contemplacao', await p.evaluate(()=>{const b=SYS.WAYMAP.aesthetic.brmap.con; return {nodes:b.nodes.length, arcs:b.arcs.length, xp:b.totXP, tiers:b.tiers.map(t=>t[0])};}));
  log('counters/feats', await p.evaluate(()=>({ctr:SYS.COUNTERS.length, feats:SYS.FEATS.length, ach:SYS.E.ACH.length, titles:SYS.E.TITLES.length})));
  await p.evaluate(()=>location.hash='#/status'); await sleep(500);
  await p.click('[data-a="fixToggle"][data-id="founder"]'); await sleep(300); // solta founder
  log('solta founder', await p.evaluate(()=>({fix:SYS.E.fixedWays(SYS.App.S), foc:SYS.E.focusWays(SYS.App.S)})));
  await p.click('[data-a="focusToggle"][data-id="founder"]'); await sleep(300);
  log('founder no foco', await p.evaluate(()=>SYS.E.focusWays(SYS.App.S)));
  await p.click('[data-a="fixToggle"][data-id="founder"]'); await sleep(300); // volta pra fixo (sai do foco)
  log('volta fixo', await p.evaluate(()=>({fix:SYS.E.fixedWays(SYS.App.S), foc:SYS.E.focusWays(SYS.App.S)})));
  await p.screenshot({path:'shots/v4_status.png'});
  await p.evaluate(()=>location.hash='#/caminhos/aesthetic/con'); await sleep(500);
  await p.screenshot({path:'shots/v4_contemplacao.png'});
  await p.evaluate(()=>location.hash='#/caminhos/aesthetic/feitos'); await sleep(500);
  await p.screenshot({path:'shots/v4_feitos.png'});
  await p.evaluate(()=>location.hash='#/lojas/aesthetic/con'); await sleep(500);
  await p.screenshot({path:'shots/v4_loja_con.png'});
  const m = await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await m.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(800);
  await m.evaluate(()=>location.hash='#/status'); await sleep(500);
  await m.screenshot({path:'shots/v4_m_status.png'});
  console.log('mobile overflow', await m.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth})));
  console.log('ERRORS:', errs.length?errs.join('\n'):'none');
  await b.close();
})();
