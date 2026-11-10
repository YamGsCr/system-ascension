# CLAUDE.md

Leia o [AGENTS.md](AGENTS.md): as regras de lá valem para o Claude.

Lembretes do Claude:

- O papel do Claude aqui é código, programação e bases: integrar, testar, publicar e manter o doc de Implementação.
- Artes das Sombras e `src/*_local.js`: o Claude só abre para revisar antes de publicar, nunca recorta nem edita. O que passa vai para `assets/aprovadas.json` com o sha256; o que não passa fica fora, e o Claude diz qual imagem e por quê, em termos gerais.
- Para publicar com arte: trazer da pasta do Yam só as artes aprovadas para `assets/img`; o build confere o hash.
- Publicação: `python build.py --publicar`, testes verdes, e no Artifact vão a página e os arquivos novos de `dist/js` e `dist/img`, com os que saíram marcados como removidos.
- Fim de bloco: testes verdes, commit, publicação, entrega do código (branch ou bundle), status no doc de Implementação e um resumo com o gasto de tokens.
