const { chromium } = require('playwright');
const path = require('path');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1360,height:1000}});
  const errs=[]; p.on('pageerror',e=>errs.push('pageerror: '+e.message));
  p.on('console',m=>{ if(m.type()==='error'&&!/ERR_TUNNEL/.test(m.text())) errs.push('console: '+m.text()); });
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')); await sleep(900);
  const log=(k,v)=>console.log(k.padEnd(22), JSON.stringify(v));
  const el = o => ({getAttribute:a=>o[a]});

  // ---- MESA: validações e abertura
  log('mesa vazia', await p.evaluate(()=>{ const A=SYS.App; A.ui.f.mesa={cap:'',teto:'',fim:'',motivo:'',tam:'',res:'',regra:true,nota:''};
    A.A.mesaStart(); const m=A.mesa(); return {cap:m.cap, temPainel:A.mesaPanel().indexOf('Abrir ciclo')>0}; }));
  log('mesa aberta', await p.evaluate(()=>{ const A=SYS.App, U=SYS.U;
    A.ui.f.mesa={cap:'500',teto:'50',fim:U.addDays(U.today(),20),motivo:'',tam:'',res:'',regra:true,nota:''};
    A.A.mesaStart(); const m=A.mesa(); return {cap:m.cap, teto:m.teto, fim:m.fim, ini:m.ini}; }));
  log('op normal', await p.evaluate(()=>{ const A=SYS.App;
    A.ui.f.mesa.motivo='teste de rompimento'; A.ui.f.mesa.tam='40'; A.ui.f.mesa.res='-12'; A.ui.f.mesa.regra=true; A.A.mesaAdd();
    return {ops:A.D.mesaOps, net:A.D.mesaNet, broke:A.D.mesaBroke}; }));
  log('op acima do teto', await p.evaluate(()=>{ const A=SYS.App;
    A.ui.f.mesa.motivo='fomo puro'; A.ui.f.mesa.tam='200'; A.ui.f.mesa.res='-30'; A.ui.f.mesa.regra=true; A.A.mesaAdd();
    return {ops:A.D.mesaOps, broke:A.D.mesaBroke, ultima:A.mesa().ops.slice(-1)[0].regra}; }));
  log('20 ops + conquista', await p.evaluate(()=>{ const A=SYS.App, U=SYS.U, m=A.mesa();
    for(let i=0;i<18;i++) m.ops.push({id:U.uid(),d:U.today(),motivo:'op '+i,tam:20,res:1,nota:'',regra:true});
    A.commit(['core']); return {ops:A.D.mesaOps, achReg:!!A.S.ach.sys_mesa_reg, achRule:!!A.S.ach.sys_mesa_rule}; }));
  log('kill switch', await p.evaluate(()=>{ const A=SYS.App;
    A.ui.f.mesa.motivo='tentando recuperar'; A.ui.f.mesa.tam='50'; A.ui.f.mesa.res='-600'; A.ui.f.mesa.regra=true; A.A.mesaAdd();
    const m=A.mesa(); return {lock:m.lock, locked:A.D.mesaLocked, achKill:!!A.S.ach.sys_mesa_kill, painel:A.mesaPanel().indexOf('Mesa travada')>0}; }));
  log('ciclo no prazo', await p.evaluate(()=>{ const A=SYS.App, U=SYS.U, m=A.mesa();
    m.lock=''; m.fim=U.addDays(U.today(),-1); A.A.mesaClose();
    return {cycles:A.mesa().cycles, cap:A.mesa().cap, hist:(A.mesa().hist||[]).length, onTime:(A.mesa().hist||[]).slice(-1)[0].onTime}; }));

  // ---- TERMINAL
  log('terminal mês', await p.evaluate(()=>{ const A=SYS.App;
    A.ui.f.term={mes:A.ctrMonth(), v:{selic:15,cdi:1.1,ipca:0.4,ipca12:4.5,di1:14.2,premio:7.1,usd:5.4,custo:4000}, _loaded:A.ctrMonth(), acao:'',motivo:'',muda:''};
    A.A.termSave(); return {meses:Object.keys(A.term().m), ctr:A.D.ctr.terminal}; }));
  log('log decisão', await p.evaluate(()=>{ const A=SYS.App;
    A.ui.f.term.acao='aportei no degrau de 180 dias'; A.ui.f.term.motivo='classe abaixo do alvo'; A.ui.f.term.muda='se o prêmio do IPCA+ cair abaixo de 6%';
    A.A.logAdd(); return {log:A.term().log.length, ctr:A.D.ctr.decisoes, acao:A.term().log[0].acao}; }));
  log('métricas', await p.evaluate(()=>{ const A=SYS.App, inv=A.invPos(), cur=A.ctrMonth();
    const prev=A.termPrev(cur); inv.snaps=[{m:prev,total:100000,ap:0,d:'2026-08-31'},{m:cur,total:102000,ap:1000,d:'2026-09-27'}];
    A.commit(['core']); const h=A.termPanel();
    return {temRetorno:/retorno do m/.test(h), real:/retorno real/.test(h), spread:/spread contra o CDI/.test(h), cobertura:/custo fixo/.test(h)}; }));
  log('ctr negativo', await p.evaluate(()=>{ const A=SYS.App; const id=A.term().log[0].id;
    A.A.logDel({getAttribute:()=>id}); return {log:A.term().log.length, ctr:A.D.ctr.decisoes}; }));

  // ---- gatilho nb
  log('nb no nó', await p.evaluate(()=>{ const A=SYS.App; const h=A.nodeMission(SYS.E.NODE.C21);
    return {temGatilho:/Não antes de/.test(h), nb:!!SYS.E.NODE.C21.nb, bad:SYS._bad}; }));
  // ---- render: carteira, vertente, regras, marcos
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/carteira'); await sleep(700);
  log('carteira+terminal', await p.evaluate(()=>({terminal:/terminal · n/i.test(document.body.innerText), log:/log de decis/i.test(document.body.innerText), inputs:document.querySelectorAll('[data-i="termF"]').length})));
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/navigation/tes'); await sleep(700);
  log('vertente+mesa', await p.evaluate(()=>({mesa:/a mesa · dinheiro que pode zerar/i.test(document.body.innerText), semXP:/sem xp por lucro/i.test(document.body.innerText), form:!!document.querySelector('[data-i="mesaF"]')})));
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/regras'); await sleep(600);
  log('regras', await p.evaluate(()=>({sec:/tesouraria, mesa e terminal/i.test(document.body.innerText), kill:/kill switch/i.test(document.body.innerText)})));
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/marcos'); await sleep(600);
  log('marcos', await p.evaluate(()=>({term:document.body.innerText.includes('Meses de terminal'), dec:document.body.innerText.includes('Decisões registradas'), mesa:document.body.innerText.includes('Ciclos da Mesa')})));
  await p.setViewportSize({width:390,height:844});
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/carteira'); await sleep(700);
  log('mobile carteira', await p.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth})));
  await p.goto('file://'+path.join(__dirname,'..','dist','test_legacy.html')+'#/caminhos/navigation/tes'); await sleep(700);
  log('mobile vertente', await p.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth})));
  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
})();
