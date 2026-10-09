const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  const url = 'file://' + path.join(__dirname, '..', 'dist', process.argv[2] || 'test.html');
  await page.goto(url);
  await page.waitForTimeout(800);
  const routes = ['status','caminhos','caminhos/architect','caminhos/ars','missoes/ativas','missoes/diarias','missoes/bosses','missoes/laterais','missoes/mundo','missoes/certs','portoes','conquistas','conquistas/sistema','conquistas/architect','conquistas/secretas','titulos','marcos','metas','lojas','lojas/aesthetic','lojas/sistema','biblioteca','biblioteca/ars','diario/semana','diario/mes','diario/historico','perfil','regras','sequencia','portoes/dungeons','caminhos/flaneur/autor','caminhos/architect/feitos','marcos/feitos','lojas/sistema/baus','lojas/sistema/chaves','conquistas/feitos','conquistas/dungeons','caminhos/aesthetic','caminhos/aesthetic/cal','caminhos/navigation','caminhos/navigation/ger','lojas/navigation','lojas/navigation/inv','lojas/aesthetic/cal','caminhos/aesthetic/feitos','caminhos/ars','caminhos/ars/midi','caminhos/ars/str','caminhos/flaneur','caminhos/flaneur/obs','caminhos/flaneur/aca','caminhos/flaneur/pub','lojas/ars/str','lojas/flaneur/pub','lojas/architect','lojas/founder','lojas/mind','conquistas/flaneur','conquistas/ars','biblioteca/flaneur','caminhos/mind','caminhos/founder','carteira'];
  for (const r of routes) {
    await page.evaluate(h => { location.hash = '#/' + h; }, r);
    await page.waitForTimeout(120);
    const bad = await page.evaluate(() => { const v = document.getElementById('view'); return { err: v.innerText.includes('Erro do Sistema') ? v.innerText.slice(0, 300) : null, len: v.innerHTML.length }; });
    console.log(r.padEnd(22), bad.len, bad.err || '');
  }
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();
