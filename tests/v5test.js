const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1360,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push('pageerror: '+e.message));
  p.on('console',m=>{ if(m.type()==='error'&&!/ERR_TUNNEL/.test(m.text())) errs.push('console: '+m.text()); });
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(900);
  const log=(k,v)=>console.log(k.padEnd(22), JSON.stringify(v));
  const open = async (id, tab) => { await p.evaluate(([id])=>SYS.App.A.openNode({getAttribute:()=>id}), [id]); await sleep(250); if (tab) { await p.click('#drawer [data-a="drTab"][data-tab="'+tab+'"]'); await sleep(250); } };
  log('dados', await p.evaluate(()=>({choices:SYS.CHOICE_ORDER.length, a01st:SYS.E.NODE.A01.st.length, a01tk:SYS.E.NODE.A01.tk.length, b11st:SYS.E.NODE.B11.st.length, nodesTk:Object.values(SYS.E.NODE).filter(n=>n.tk).length, bad:SYS._bad})));
  // A01: técnicas
  await open('A01','estudar');
  log('A01 blocos', await p.evaluate(()=>({tk:document.querySelectorAll('#drawer .tkbox .tk').length, st:document.querySelectorAll('#drawer [data-c="studyTick"]').length, off:!!document.querySelector('#drawer .offbox')})));
  await p.click('#drawer .tkbox .tk[data-i="0"]'); await sleep(250);
  await p.click('#drawer .tkbox .tk[data-i="2"]'); await sleep(250);
  log('A01 investigadas', await p.evaluate(()=>({tk:SYS.App.S.tk.A01, count:SYS.App.D.tkCount, on:document.querySelectorAll('#drawer .tk.on').length})));
  await p.screenshot({path:'shots/v5_a01_estudar.png'});
  // A74: escolha de trilha
  await open('A74','estudar');
  log('A74 antes', await p.evaluate(()=>({trk:document.querySelectorAll('#drawer .trk').length, pend:!!document.querySelector('#drawer .trk .chip.warn'), opts:document.querySelectorAll('#drawer .trk-opt').length})));
  await p.click('#drawer [data-a="trackPick"][data-k="iac"][data-o="bicep"]'); await sleep(300);
  log('A74 bicep', await p.evaluate(()=>({tr:SYS.App.S.tracks.iac, st:document.querySelectorAll('#drawer [data-c="trackTick"]').length, ach:!!SYS.App.S.ach.sys_tr1})));
  await p.click('#drawer [data-c="trackTick"][data-i="0"]'); await sleep(250);
  await p.click('#drawer [data-a="trackPick"][data-k="iac"][data-o="tf"]'); await sleep(300);
  log('A74 troca tf', await p.evaluate(()=>({tr:SYS.App.S.tracks.iac, swaps:SYS.App.S.stats.trackSwaps, cs:SYS.App.N.n.A74.cs, st:document.querySelectorAll('#drawer [data-c="trackTick"]').length})));
  await p.screenshot({path:'shots/v5_a74_trilha.png'});
  // escolha compartilhada: A76 herda
  await open('A76','estudar');
  log('A76 herda', await p.evaluate(()=>document.querySelector('#drawer .trk .chip.ok')?.textContent));
  // conclusão exige trilha (M08 · DAW)
  await p.evaluate(()=>{ SYS.App.S.settings.openWorld = true; SYS.App.commit(['core']); }); await sleep(200);
  await open('M08','missao');
  log('M08 chip missão', await p.evaluate(()=>document.querySelector('#drawer .trkrow')?.textContent));
  await p.click('#drawer [data-a="setStatus"][data-s="done"]'); await sleep(300);
  for (const cb of await p.$$('#modal [data-c="doneCheck"]')) { await cb.check(); await sleep(60); }
  log('M08 trava', await p.evaluate(()=>({disabled:document.querySelector('#modal [data-a="confirmDone"]').disabled, callout:!!document.querySelector('#modal .callout.fail')})));
  await p.click('#modal [data-a="closeModal"]'); await sleep(200);
  await open('M08','estudar');
  await p.click('#drawer [data-a="trackPick"][data-k="daw"][data-o="reaper"]'); await sleep(300);
  await open('M08','missao');
  await p.click('#drawer [data-a="setStatus"][data-s="done"]'); await sleep(300);
  for (const cb of await p.$$('#modal [data-c="doneCheck"]')) { await cb.check(); await sleep(60); }
  log('M08 libera', await p.evaluate(()=>document.querySelector('#modal [data-a="confirmDone"]').disabled));
  await p.click('#modal [data-a="confirmDone"]'); await sleep(400);
  log('M08 concluído', await p.evaluate(()=>SYS.App.S.nodes.M08));
  // Fora do roteiro
  await open('A01','estudar');
  await p.click('#drawer [data-a="offOpen"]'); await sleep(250);
  log('off botão travado', await p.evaluate(()=>document.querySelector('#modal [data-a="offSave"]').disabled));
  await p.fill('#modal [data-i="offN"]', 'Service Blueprint'); await sleep(100);
  await p.fill('#modal [data-i="offWhy"]', 'mostrou o bastidor do atendimento que o swimlane escondia'); await sleep(100);
  const xp0 = await p.evaluate(()=>SYS.App.D.wayXP.architect);
  await p.click('#modal [data-a="offSave"]'); await sleep(500);
  log('off salvo', await p.evaluate((xp0)=>({n:SYS.App.S.offs.length, count:SYS.App.D.offCount, dxp:SYS.App.D.wayXP.architect - xp0, ach:!!SYS.App.S.ach.sys_off1, row:!!document.querySelector('#drawer .offrow')}), xp0));
  // examinador recebe trilha e técnicas
  log('exam ctx', await p.evaluate(()=>{ const t = SYS.App.examCtx({kind:'node', id:'A74'}).text; return {trilha:/TRILHA ESCOLHIDA \(Infraestrutura como código\): Terraform/.test(t), tk:/TÉCNICAS/.test(SYS.App.examCtx({kind:'node', id:'A01'}).text)}; }));
  // página do Caminho: encruzilhadas + fora do roteiro em feitos
  await p.evaluate(()=>{ SYS.App.ui.drawer=null; SYS.App.renderDrawer(); location.hash='#/caminhos/architect'; }); await sleep(500);
  log('encruzilhadas arq', await p.evaluate(()=>document.querySelectorAll('.crossrow').length));
  await p.screenshot({path:'shots/v5_way_arch.png'});
  await p.evaluate(()=>location.hash='#/caminhos/architect/feitos'); await sleep(500);
  log('feitos off', await p.evaluate(()=>document.querySelectorAll('.offrow').length));
  await p.evaluate(()=>location.hash='#/caminhos/ars/midi'); await sleep(500);
  log('encruzilhadas midi', await p.evaluate(()=>[...document.querySelectorAll('.crossrow b')].map(x=>x.textContent)));
  await p.evaluate(()=>location.hash='#/regras'); await sleep(400);
  log('regras', await p.evaluate(()=>document.body.textContent.includes('Técnicas, trilhas e fora do roteiro')));
  // todas as escolhas renderizam, todas as opções
  log('render todas', await p.evaluate(()=>{ const out=[]; SYS.CHOICE_ORDER.forEach(k=>{ const c=SYS.CHOICES[k]; c.opts.forEach(o=>{ SYS.App.S.tracks[k]=o.id; c.nodes.forEach(id=>{ const h=SYS.App.nodeStudy(SYS.E.NODE[id]); if(!h.includes('data-c="trackTick"')) out.push(id+':'+o.id); }); }); }); return out.length ? out : 'ok'; }));
  log('conquistas v5', await p.evaluate(()=>['sys_tr1','sys_tr5','sys_trall','sys_trswap','sys_tk10','sys_off1'].map(id=>id+':'+(SYS.E.ACHMAP[id]?'def':'MISSING'))));
  // mobile
  const m = await b.newPage({viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
  m.on('pageerror',e=>errs.push('m pageerror: '+e.message));
  await m.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(800);
  for (const [id, tab] of [['N03','estudar'],['A01','estudar'],['E08','estudar']]) {
    await m.evaluate(([id])=>SYS.App.A.openNode({getAttribute:()=>id}), [id]); await sleep(250);
    await m.click('#drawer [data-a="drTab"][data-tab="'+tab+'"]'); await sleep(250);
    if (id==='N03') { await m.click('#drawer [data-a="trackPick"][data-o="mikrotik"]'); await sleep(300); }
    const ov = await m.evaluate(()=>{ const d=document.querySelector('#drawer .dr-body'); return {sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, dsw:d.scrollWidth, dcw:d.clientWidth}; });
    log('mobile '+id, ov);
    await m.screenshot({path:'shots/v5_m_'+id+'.png'});
  }
  await m.evaluate(()=>{ SYS.App.ui.drawer=null; SYS.App.renderDrawer(); location.hash='#/caminhos/architect'; }); await sleep(500);
  log('mobile way', await m.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth})));
  console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
  await b.close();
})();
