const { chromium } = require('playwright'); const path=require('path');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1360,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push('pageerror: '+e.message));
 p.on('console',m=>{ if(m.type()==='error'&&!/ERR_TUNNEL/.test(m.text())) errs.push('console: '+m.text()); });
 await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(900);
 const log=(k,v)=>console.log(k.padEnd(20), JSON.stringify(v));
 const ids=['V60','V61','V62','V63','V64','V71','V65','V66','V67','V68','V69','V72','V70','V49b','V49c'];
 log('nós novos', await p.evaluate((ids)=>({faltando:ids.filter(i=>!SYS.E.NODE[i]), semTk:ids.filter(i=>SYS.E.NODE[i]&&!(SYS.E.NODE[i].tk||[]).length), bad:SYS._bad,
   st:ids.map(i=>SYS.E.NODE[i]?SYS.E.NODE[i].st.length:0)}), ids));
 log('arcos', await p.evaluate(()=>{ const w=SYS.WAYMAP.navigation;
   return {ni4:w.arcs.find(a=>a.id==='ni4').nodes.map(n=>n.id), ni5:w.arcs.find(a=>a.id==='ni5').nodes.map(n=>n.id), nr2:w.arcs.find(a=>a.id==='nr2').nodes.map(n=>n.id),
     needGate:{ni4:w.arcs.find(a=>a.id==='ni4').needGate, ni5:w.arcs.find(a=>a.id==='ni5').needGate}}; }));
 log('selos', await p.evaluate(()=>['ng12','ng13'].map(id=>{ const g=SYS.WAYMAP.navigation.gates.find(x=>x.id===id); return id+':'+(SYS.GATEACH[g.ach]||{}).title+':'+g.ev.length; })));
 log('vertente inv', await p.evaluate(()=>{ const b=SYS.WAYMAP.navigation.brmap.inv; return {nos:b.nodes.length, arcos:b.arcs.length, xp:b.totXP}; }));
 log('livros', await p.evaluate(()=>['schilit','damodaran','bogle'].filter(k=>!SYS.LIB[k])));
 log('gatilhos', await p.evaluate(()=>['V60','V66','V69','V70'].map(i=>!!SYS.E.NODE[i].nb)));
 await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/navigation/inv'); await sleep(700);
 log('página inv', await p.evaluate(()=>({leitura:/leitura profunda/i.test(document.body.innerText), carteira:/carteira de renda vari/i.test(document.body.innerText), v60:!!document.querySelector('[data-a="openNode"][data-id="V60"]'), v70:!!document.querySelector('[data-a="openNode"][data-id="V70"]')})));
 await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/navigation/ger'); await sleep(700);
 log('debêntures', await p.evaluate(()=>({v49b:!!document.querySelector('[data-a="openNode"][data-id="V49b"]'), v49c:!!document.querySelector('[data-a="openNode"][data-id="V49c"]')})));
 const open=async(id,tab)=>{ await p.evaluate(([id])=>SYS.App.A.openNode({getAttribute:()=>id}),[id]); await sleep(250); if(tab){ await p.click('#drawer [data-a="drTab"][data-tab="'+tab+'"]'); await sleep(250);} };
 await open('V49b','estudar');
 log('V49b estudar', await p.evaluate(()=>{ const d=document.querySelector('#drawer .dr-body'); return {top:d.querySelectorAll('.check').length, tk:d.querySelectorAll('.tk').length, escritura:/escritura/i.test(d.innerText)}; }));
 await open('V60','missao');
 log('V60 gatilho', await p.evaluate(()=>/não antes de/i.test(document.querySelector('#drawer .dr-body').innerText)));
 await p.setViewportSize({width:390,height:844}); await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/navigation/inv'); await sleep(700);
 log('mobile', await p.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth})));
 console.log('ERRORS:', errs.length?errs:'none'); await b.close(); })();
