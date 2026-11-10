# CLAUDE.md

Leia o [AGENTS.md](AGENTS.md): as regras de lá valem para o Claude.

Lembretes do Claude:

- O papel do Claude aqui é código, programação e bases: integrar, testar, publicar e manter o doc de Implementação.
- Não abrir, ver, recortar, editar nem publicar as artes das Sombras (`assets/img/sg-*`) nem os arquivos `src/*_local.js`.
- Publicação: `python build.py --publicar`, testes verdes, e no Artifact vão a página e os arquivos novos de `dist/js` e `dist/img`, com os que saíram marcados como removidos.
- Fim de bloco: testes verdes, commit, publicação, entrega do código (branch ou bundle), status no doc de Implementação e um resumo com o gasto de tokens.
