"""Monta o System Ascension a partir de src/.

Saída em dist/ (a pasta inteira é o que se publica):
  system-ascension.html   a página: estilos, esqueleto e as tags <script> na ordem certa
  js/<bloco>.<hash>.js    o código, em blocos contíguos de src/ (nome com hash: nunca vem do cache errado)
  img/<nome>.<hash>.webp  as imagens de assets/img (retrato, carregamento, personagens)
  manifest.json           quais arquivos de src/ foram para cada bloco, com tamanhos
  test*.html              as páginas das suítes de teste (mesma pasta, mesmos blocos)

Dois modos:
  python build.py              build local: usa tudo o que estiver em assets/img e em src/
  python build.py --publicar   build de publicação (o que vai para o Artifact e o que os testes usam):
                               ignora as artes das Sombras (assets/img/sg-*) e os arquivos src/*_local.js,
                               e usa os retratos de assets/recortes/
  single/system-ascension.html   versão de arquivo único, como reserva

Os blocos são scripts clássicos carregados em ordem, cada um com "use strict": a mesma semântica
do script único de antes, desde que nenhum código de topo use uma função declarada num bloco
posterior (o teste tests/split.js confere que a página monta igual nas duas versões).
"""
import hashlib, json, os, shutil, sys

PUBLICAR = '--publicar' in sys.argv[1:]

root = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(root, 'src')
dist = os.path.join(root, 'dist')
PAGE = 'system-ascension.html'

# (nome do bloco, primeiro arquivo dele em src/). Cada arquivo vai para o último bloco cujo início
# vem antes dele na ordem alfabética, então os blocos seguem exatamente a ordem de antes.
CHUNKS = [
    ('sistema', '10_'),
    ('architect', '21_'),
    ('flaneur', '24a_'),
    ('aesthetic', '25a_'),
    ('navigation', '26a_'),
    ('ars', '27a_'),
    ('founder', '28_'),
    ('mind', '29_'),
    ('jogo', '30_'),
    ('motor', '40_'),
    ('telas', '50_'),
    ('sync', '64_'),
    ('zona', '65_'),
    ('cidade', '70_'),
    ('garden', '80_'),
    ('boot', '99_'),
]
PAGE_LIMIT = 200000      # a página em si não pode voltar a engordar: o peso vai para os blocos


def read(name):
    with open(os.path.join(src, name), encoding='utf8') as f:
        return f.read()


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf8') as f:
        f.write(text)


def chunk_of(fname):
    pick = None
    for name, start in CHUNKS:
        if fname >= start:
            pick = name
    if pick is None:
        sys.exit('arquivo fora de qualquer bloco: ' + fname)
    return pick


files = sorted(f for f in os.listdir(src) if f.endswith('.js') and not (PUBLICAR and f.endswith('_local.js')))
head = read('00_head.html')
body = read('01_body.html')

groups = {}
for f in files:
    code = read(f)
    if '</script' in code.lower():
        sys.exit('proibido </script em ' + f)
    groups.setdefault(chunk_of(f), []).append((f, code))

# limpa os blocos da montagem anterior (os nomes mudam com o hash)
shutil.rmtree(os.path.join(dist, 'js'), ignore_errors=True)
os.makedirs(os.path.join(dist, 'js'), exist_ok=True)

manifest = {'page': PAGE, 'chunks': []}
tags = []
for name, _ in CHUNKS:
    if name not in groups:
        continue
    text = '"use strict";\n' + '\n'.join('/* --- ' + f + ' --- */\n' + code for f, code in groups[name]) + '\n'
    data = text.encode('utf8')
    rel = 'js/' + name + '.' + hashlib.sha256(data).hexdigest()[:10] + '.js'
    with open(os.path.join(dist, rel), 'wb') as fh:
        fh.write(data)
    manifest['chunks'].append({'name': name, 'file': rel, 'bytes': len(data), 'src': [f for f, _ in groups[name]]})
    tags.append('<script src="' + rel + '"></script>')

# imagens (assets/img): copiadas com hash no nome; a página recebe os caminhos em window.SYS_IMG
shutil.rmtree(os.path.join(dist, 'img'), ignore_errors=True)
imgs = {}
asrc = os.path.join(root, 'assets', 'img')
arec = os.path.join(root, 'assets', 'recortes')
fontes = []
if os.path.isdir(asrc):
    fontes += [(asrc, f) for f in sorted(os.listdir(asrc)) if not (PUBLICAR and f.startswith('sg-'))]
if os.path.isdir(arec):
    # recortes de rosto e ombros: na publicação substituem as artes; no build local só entram onde não há arte
    tem = set(os.path.splitext(f)[0] for _, f in fontes)
    fontes += [(arec, f) for f in sorted(os.listdir(arec)) if PUBLICAR or os.path.splitext(f)[0] not in tem]
if fontes:
    os.makedirs(os.path.join(dist, 'img'), exist_ok=True)
    for pasta, f in fontes:
        stem, ext = os.path.splitext(f)
        with open(os.path.join(pasta, f), 'rb') as fh:
            data = fh.read()
        rel = 'img/' + stem + '.' + hashlib.sha256(data).hexdigest()[:10] + ext
        with open(os.path.join(dist, rel), 'wb') as fh:
            fh.write(data)
        imgs[stem] = rel
manifest['images'] = imgs


def imgtag(pre):
    return '<script>window.SYS_IMG=' + json.dumps({k: pre + v for k, v in imgs.items()}) + ';</script>'


# se algum bloco não carregar (publicação incompleta), a página explica em vez de ficar em branco
guard = ('<script>if (!window.SYS || !SYS.App || !SYS.Store || !SYS.bootOk) { var v = document.getElementById("view"); '
         'if (v) v.innerHTML = \'<section class="win"><div class="win-h">[Sistema] Os arquivos do app não carregaram</div>'
         '<p class="dim">Recarregue a página. Se continuar assim, a publicação ficou incompleta.</p></section>\'; }</script>')
page = head + '\n' + body + '\n' + imgtag('') + '\n' + '\n'.join(tags) + '\n' + guard + '\n'
write(os.path.join(dist, PAGE), page)
page_bytes = len(page.encode('utf8'))
if page_bytes > PAGE_LIMIT:
    sys.exit('a página passou de %d bytes (%d): mova código para um bloco' % (PAGE_LIMIT, page_bytes))

# reserva: tudo num arquivo só, como antes
script = '<script>\n"use strict";\n' + '\n'.join('/* --- ' + f + ' --- */\n' + read(f) for f in files) + '\n</script>\n'
write(os.path.join(dist, 'single', PAGE), head + '\n' + body + '\n' + imgtag('../') + '\n' + script)

manifest['pageBytes'] = page_bytes
manifest['totalBytes'] = page_bytes + sum(c['bytes'] for c in manifest['chunks'])
write(os.path.join(dist, 'manifest.json'), json.dumps(manifest, ensure_ascii=False, indent=1))

# páginas de teste: na mesma pasta da página, para os caminhos js/ valerem igual
DOC = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
       '<script>window.__TESTPAGE = 1;</script>')   # páginas de teste: o que é só do jogador real (a anistia de 17/10) fica desligado
with open(os.path.join(root, 'tests', 'mock.js'), encoding='utf8') as fh:
    mock = fh.read()
test = DOC + '<script>' + mock + '</script></head><body>' + page + '</body></html>'
write(os.path.join(dist, 'test.html'), test)
write(os.path.join(dist, 'test_nomock.html'), DOC + '</head><body>' + page + '</body></html>')
# suítes antigas (anteriores ao protocolo do Chamado): mesma página, com o protocolo começando desligado,
# para a tela cheia de apresentação não cobrir os cliques que elas fazem
legacy = test.replace('</body></html>', '<script>(function(){ var o = SYS.E.pzNew; SYS.E.pzNew = function(){ var z = o(); z.on = false; z.intro = 1; return z; }; })();</script></body></html>')
write(os.path.join(dist, 'test_legacy.html'), legacy)
# a mesma suíte de teste sobre a versão de arquivo único (o teste split.js compara as duas)
single = open(os.path.join(dist, 'single', PAGE), encoding='utf8').read()
write(os.path.join(dist, 'single', 'test.html'), DOC + '<script>' + mock + '</script></head><body>' + single + '</body></html>')

print('página %d bytes · %d blocos · total %d bytes · %s' % (page_bytes, len(manifest['chunks']), manifest['totalBytes'], 'publicação' if PUBLICAR else 'local'))
for c in manifest['chunks']:
    print('  %-28s %8d bytes  %2d arquivos' % (c['file'], c['bytes'], len(c['src'])))
