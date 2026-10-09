/* ===== BOOT ===== */
SYS.bootOk = 1;   /* último bloco carregado: a página confere isso antes de dar o app como montado */
(function(){
  function start(){
    try { App.init(); }
    catch(e){ if (window.console) console.error(e); var v = document.getElementById('view'); if (v) v.innerHTML = '<section class="win"><div class="win-h">[Sistema] Falha ao iniciar</div><p class="dim">'+String(e && e.message).replace(/[<>&]/g, '')+'</p></section>'; }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
