/* ===== STORE: save privado por usuário (db) + cache local ===== */
var Store = SYS.Store = {mode:'local', status:'local', uid:null, db:null, refs:{}, pending:{}, writing:{}, timer:null, listeners:[], err:null};
Store.KEYS = {core:'sysasc.core.v1', journal:'sysasc.journal.v1', notes:'sysasc.notes.v1'};
Store.DOCS = ['core','journal','notes'];
Store.loadLocal = function(){ return {core:U.ls.get(Store.KEYS.core), journal:U.ls.get(Store.KEYS.journal), notes:U.ls.get(Store.KEYS.notes)}; };
Store.setStatus = function(s, msg){ Store.status = s; Store.err = msg || null; if (SYS.App && SYS.App.renderSync) SYS.App.renderSync(); };
Store.touch = function(doc){ doc._u = new Date().toISOString(); };
Store.save = function(names){
  var App = SYS.App;
  names.forEach(function(k){
    var doc = App.docs()[k]; Store.touch(doc);
    U.ls.set(Store.KEYS[k], doc);
    Store.pending[k] = true;
  });
  if (Store.mode === 'remote') { Store.setStatus('saving'); clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 1200); }
};
Store.flush = function(){
  Store.DOCS.forEach(function(k){
    if (!Store.pending[k] || Store.writing[k] || !Store.refs[k]) return;
    var doc = SYS.App.docs()[k];
    var body = JSON.parse(JSON.stringify(doc));
    var size = JSON.stringify(body).length;
    if (size > 250000) { Store.setStatus('error', 'O documento “'+k+'” passou do limite de tamanho. Exporte o save e limpe notas antigas.'); Store.pending[k] = false; return; }
    Store.pending[k] = false; Store.writing[k] = true;
    Store.refs[k].set(body).then(function(){
      Store.writing[k] = false;
      if (Store.pending[k]) { clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 400); }
      else if (!Store.DOCS.some(function(d){ return Store.pending[d] || Store.writing[d]; })) Store.setStatus('synced');
    }).catch(function(e){
      Store.writing[k] = false;
      var code = e && e.code;
      if (code === 'unavailable') { Store.pending[k] = true; clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 2500 + Math.random()*1500); Store.setStatus('saving'); }
      else if (code === 'invalid_argument') { Store.setStatus('error', 'A nuvem recusou o save (tamanho ou permissão). Seus dados continuam neste navegador.'); }
      else if (code === 'quota_exceeded' || code === 'resource_exhausted') { Store.setStatus('error', 'Limite do armazenamento atingido. Exporte o save.'); }
      else { Store.mode = 'local'; Store.setStatus('local'); }
    });
  });
};
Store.connect = function(){
  if (!window.claude || typeof window.claude.use !== 'function') { Store.setStatus('local'); return; }
  Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function(res){
    var db = res[0], user = res[1];
    SYS.App.userCap = user;
    if (!db || !user) { Store.setStatus('local'); return null; }
    return user.id().then(function(uid){
      if (!uid) { Store.setStatus('local'); return; }
      Store.db = db; Store.uid = uid; Store.mode = 'remote'; Store.setStatus('saving');
      Store.DOCS.forEach(function(k){
        var ref = db.doc('data/users/' + uid + '/' + k);
        Store.refs[k] = ref;
        ref.onSnapshot(function(snap){ Store.onSnap(k, snap); }, function(err){
          if (err && err.code === 'unavailable') { setTimeout(function(){ Store.resubscribe(k); }, 4000); }
          else if (err && err.code === 'revoked') { Store.mode = 'local'; Store.setStatus('local'); }
          else Store.setStatus('error', 'Falha ao sincronizar (' + (err && err.code) + '). Os dados seguem salvos neste navegador.');
        });
      });
      if (user.me) user.me().then(function(me){ SYS.App.me = me; SYS.App.render(); }).catch(function(){});
    });
  }).catch(function(){ Store.setStatus('local'); });
};
Store.resubscribe = function(k){
  if (!Store.db || !Store.uid) return;
  Store.refs[k].onSnapshot(function(snap){ Store.onSnap(k, snap); }, function(){ Store.setStatus('error','Sincronização instável. Dados seguem salvos localmente.'); });
};
Store.onSnap = function(k, snap){
  var App = SYS.App, local = App.docs()[k];
  if (!snap.exists) {
    if (snap.metadata && snap.metadata.fromCache) return;
    if (local && local._u) { Store.pending[k] = true; Store.flush(); } else { Store.setStatus('synced'); }
    return;
  }
  if (snap.metadata && snap.metadata.hasPendingWrites) return;
  var remote = snap.data() || {}, lu = (local && local._u) || '', ru = remote._u || '';
  if (ru > lu) { App.replaceDoc(k, JSON.parse(JSON.stringify(remote))); }
  else if (lu > ru && !Store.writing[k]) { Store.pending[k] = true; clearTimeout(Store.timer); Store.timer = setTimeout(Store.flush, 300); }
  if (!Store.DOCS.some(function(d){ return Store.pending[d] || Store.writing[d]; })) Store.setStatus('synced');
};
