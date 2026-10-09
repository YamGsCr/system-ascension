const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1360,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push('pageerror: '+e.message));
  p.on('console',m=>{ if(m.type()==='error'&&!/ERR_TUNNEL/.test(m.text())) errs.push('console: '+m.text()); });
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(900);
  const log=(k,v)=>console.log(k.padEnd(20), JSON.stringify(v));
  const NEW=['A04b','A34b','A54b','A62b','A71b','A73b','A87b','T01','T02','T03','T04','T05'];
  log('dados novos', await p.evaluate((ids)=>({bad:SYS._bad, faltando:ids.filter(i=>!SYS.E.NODE[i]),
    semTk:ids.filter(i=>!(SYS.E.NODE[i].tk||[]).length), semSt:ids.filter(i=>!(SYS.E.NODE[i].st||[]).length),
    st:ids.map(i=>SYS.E.NODE[i].st.length), tk:ids.map(i=>SYS.E.NODE[i].tk.length)}), NEW));
  log('arco s5', await p.evaluate(()=>{ const a=SYS.WAYMAP.architect.arcs.find(x=>x.id==='s5'); const g=SYS.WAYMAP.architect.gates.find(x=>x.id==='ags5');
    return {n:a.n, nodes:a.nodes.map(n=>n.id), boss:a.nodes.filter(n=>n.boss).map(n=>n.id), gate:g.n, ev:g.ev.length, ach:SYS.GATEACH[g.ach]}; }));
  log('ag1 evidências', await p.evaluate(()=>SYS.WAYMAP.architect.gates.find(g=>g.id==='ag1').ev));
  log('stAdd v7', await p.evaluate(()=>({A22:SYS.E.NODE.A22.st.slice(-1), A59:SYS.E.NODE.A59.st.slice(-3), A90:SYS.E.NODE.A90.st.slice(-2), A01st:SYS.E.NODE.A01.st.length})));
  // caminho architect: arco lateral aparece com os nós
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/architect'); await sleep(700);
  log('página caminho', await p.evaluate(()=>({socio:document.body.innerText.includes('GEOMETRIA HUMANA'),
    t01:!!document.querySelector('[data-a="openNode"][data-id="T01"]'), t05:!!document.querySelector('[data-a="openNode"][data-id="T05"]'),
    a04b:!!document.querySelector('[data-a="openNode"][data-id="A04b"]'), selo:document.body.innerText.includes('Selo Lateral · Geometria Humana')})));
  const open = async (id, tab) => { await p.evaluate(([id])=>SYS.App.A.openNode({getAttribute:()=>id}), [id]); await sleep(250); if (tab) { await p.click('#drawer [data-a="drTab"][data-tab="'+tab+'"]'); await sleep(250); } };
  await open('T02','estudar');
  log('T02 estudar', await p.evaluate(()=>{ const d=document.querySelector('#drawer .dr-body');
    return {topicos:d.querySelectorAll('.check').length, tkchips:d.querySelectorAll('.tk').length, tkbox:!!d.querySelector('.tkbox'), texto:d.innerText.includes('Carga cognitiva')}; }));
  await open('A04b','estudar');
  log('A04b estudar', await p.evaluate(()=>{ const d=document.querySelector('#drawer .dr-body');
    return {topicos:d.querySelectorAll('.check').length, tkchips:d.querySelectorAll('.tk').length, utility:d.innerText.includes('Utility tree')}; }));
  await open('A62b','onde');
  log('A62b onde', await p.evaluate(()=>({links:[...document.querySelectorAll('#drawer .res')].map(a=>a.getAttribute('href')).length, slsa:document.querySelector('#drawer .dr-body').innerText.includes('SLSA')})));
  log('examinador T01', await p.evaluate(()=>{ const t=SYS.App.examCtx({kind:'node',id:'T01'}).text; return {temTecnicas:/TÉCNICAS E FERRAMENTAS/.test(t), temTopicos:/Conway/.test(t), len:t.length}; }));
  // mobile
  await p.setViewportSize({width:390,height:844}); await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/architect'); await sleep(700);
  log('mobile caminho', await p.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth})));
  await open('T05','missao');
  log('mobile T05', await p.evaluate(()=>{ const d=document.querySelector('#drawer .dr-body'); return {sw:d.scrollWidth, cw:d.clientWidth, boss:document.querySelector('#drawer').innerText.includes('Boss')}; }));
  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
})();
