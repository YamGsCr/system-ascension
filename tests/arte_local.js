/* Os ganchos locais continuam funcionais sem incluir as artes no build de publicação. */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const imgs = {
  'sg-alpha': 'img/sg-alpha.123.jpg', 'sg-alpha-full': 'img/sg-alpha-full.123.jpg',
  'sg-eta': 'img/sg-eta.123.jpg', 'sg-eta-full': 'img/sg-eta-full.123.jpg',
  'sg-beta': 'img/sg-beta.123.webp', 'sg-beta-full': 'img/sg-beta-full.123.jpg'
};
const styles = [];
const App = {
  img: k => imgs[k] || '',
  sgFace(id, size){ return imgs['sg-' + id] ? '<img class="sg-face" data-size="' + size + '">' : '<svg class="sg-sig"></svg>'; },
  sgRetratoHTML(M){ return imgs['sg-' + M.id] ? '<div class="sgt-portrait sgt-' + M.id + '"><img class="sgt-img"></div>' : '<div class="sgt-sigil"><svg class="sg-sig"></svg></div>'; }
};
const document = {createElement: () => ({}), head: {appendChild: el => styles.push(el)}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'src', '83_sg_arte_local.js'), 'utf8'), {App, document});

assert.match(App.sgFace('alpha', 48), /sg-local-face/);
assert.match(App.sgFace('alpha', 48), /data-size="48"/);
assert.match(App.sgFace('eta', 28), /sg-local-single/);
assert.match(App.sgRetratoHTML({id: 'alpha'}), /sg-local-portrait/);
assert.match(App.sgRetratoHTML({id: 'eta'}), /sg-local-portrait/);
assert.doesNotMatch(App.sgFace('beta', 48), /sg-local/);
assert.doesNotMatch(App.sgRetratoHTML({id: 'beta'}), /sg-local/);
assert.match(App.sgFace('zeta', 48), /sg-sig/);
assert.match(App.sgRetratoHTML({id: 'zeta'}), /sgt-sigil/);
delete imgs['sg-alpha-full'];
assert.doesNotMatch(App.sgFace('alpha', 48), /sg-local/);
assert.doesNotMatch(App.sgRetratoHTML({id: 'alpha'}), /sg-local/);
assert.strictEqual(styles.length, 1);
assert.match(styles[0].textContent, /sg-local-portrait/);
console.log('  ok   artes locais, recortes e sigilos preservados');
