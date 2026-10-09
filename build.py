import os, re, sys, json
root = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(root, 'src'); dist = os.path.join(root, 'dist')
os.makedirs(dist, exist_ok=True)
files = sorted(os.listdir(src))
head = open(os.path.join(src, '00_head.html'), encoding='utf8').read()
body = open(os.path.join(src, '01_body.html'), encoding='utf8').read()
js = []
for f in files:
    if f.endswith('.js'):
        code = open(os.path.join(src, f), encoding='utf8').read()
        if '</script' in code.lower():
            sys.exit('forbidden </script in ' + f)
        js.append('/* --- ' + f + ' --- */\n' + code)
script = '<script>\n"use strict";\n' + '\n'.join(js) + '\n</script>\n'
page = head + '\n' + body + '\n' + script
open(os.path.join(dist, 'system-ascension.html'), 'w', encoding='utf8').write(page)
print('page bytes', len(page.encode('utf8')))
mock = open(os.path.join(root, 'tests', 'mock.js'), encoding='utf8').read()
test = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script>' + mock + '</script></head><body>' + page + '</body></html>'
open(os.path.join(dist, 'test.html'), 'w', encoding='utf8').write(test)
nomock = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>'
open(os.path.join(dist, 'test_nomock.html'), 'w', encoding='utf8').write(nomock)
# suítes antigas (anteriores ao protocolo do Chamado): mesma página, com o protocolo começando desligado,
# para a tela cheia de apresentação não cobrir os cliques que elas fazem
legacy = test.replace('</body></html>', '<script>(function(){ var o = SYS.E.pzNew; SYS.E.pzNew = function(){ var z = o(); z.on = false; z.intro = 1; return z; }; })();</script></body></html>')
open(os.path.join(dist, 'test_legacy.html'), 'w', encoding='utf8').write(legacy)
print('test harness written')
