/* Arte local do Garden. As composições JPG têm o retrato à esquerda;
   Eta tem um retrato separado. Os recortes de publicação usam o visual padrão. */
(function(){
  function arteLocal(id){
    var src = App.img('sg-' + id);
    return src && /\.jpe?g(?:[?#]|$)/i.test(src) && App.img('sg-' + id + '-full');
  }

  var oldFace = App.sgFace;
  App.sgFace = function(id, size){
    var html = oldFace.apply(this, arguments);
    if (!arteLocal(id)) return html;
    return html.replace('class="sg-face"', 'class="sg-face sg-local-face' + (id === 'eta' ? ' sg-local-single' : '') + '"');
  };

  var oldRetrato = App.sgRetratoHTML;
  App.sgRetratoHTML = function(M){
    var html = oldRetrato.apply(this, arguments);
    if (!arteLocal(M.id)) return html;
    return html.replace('sgt-portrait', 'sgt-portrait sg-local-portrait');
  };

  var style = document.createElement('style');
  style.textContent = [
    '.sg-face.sg-local-face{object-position:0% 40%}',
    '.sg-face.sg-local-single{object-position:50% 25%}',
    '.sgt-face.sg-local-portrait{top:12px;width:min(620px,calc(100vw - 44px),calc(93.8dvh - 220.43px));aspect-ratio:800/853;overflow:hidden;background:#fff}',
    '.sg-local-portrait .sgt-img{display:block;position:absolute;top:0;left:0;width:160%;height:100%;max-width:none;object-fit:fill}',
    '.sg-local-portrait.sgt-alpha{width:min(620px,calc(100vw - 44px),calc(105.6dvh - 248.16px));aspect-ratio:760/720}',
    '.sg-local-portrait.sgt-alpha .sgt-img{width:168.421%}',
    '.sg-local-portrait.sgt-gamma{width:min(620px,calc(100vw - 44px),calc(97.3dvh - 228.655px));aspect-ratio:830/853}',
    '.sg-local-portrait.sgt-gamma .sgt-img{width:154.217%}',
    '.sg-local-portrait.sgt-eta{width:min(550px,calc(100vw - 44px),calc(75dvh - 176.25px));aspect-ratio:960/1280}',
    '.sg-local-portrait.sgt-eta .sgt-img{width:100%}',
    '@media(max-width:600px){.sgt-face.sg-local-portrait{width:min(calc(100vw - 34px),calc(93.8dvh - 234.5px))}.sgt-face.sg-local-portrait.sgt-alpha{width:min(calc(100vw - 34px),calc(105.6dvh - 264px))}.sgt-face.sg-local-portrait.sgt-gamma{width:min(calc(100vw - 34px),calc(97.3dvh - 243.25px))}.sgt-face.sg-local-portrait.sgt-eta{width:min(calc(100vw - 34px),calc(75dvh - 187.5px))}}'
  ].join('\n');
  document.head.appendChild(style);
})();
