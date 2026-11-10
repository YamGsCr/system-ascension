# AGENTS.md · System Ascension

Guia para quem mexe no projeto: o Yam, o GPT (Codex) e o Claude. Leia antes de mudar qualquer coisa.

## O projeto

- Sistema pessoal de evolução no estilo Solo Leveling: 7 Caminhos de estudo, missões, sequência, Zona de Penalidade, a Cidade de portais e a Visão de Ascensão das Sombras (aba Shadow Garden).
- Roda como Artifact no claude.ai. Lá ele tem save na nuvem (`db`, 5 documentos), IA (`sample`), download de arquivo (`downloads`) e o usuário (`user`). Aberto pela pasta, roda sem nuvem e sem IA, com o save só no navegador.
- JavaScript puro, sem framework e sem bundler. O código fica em `src/`, em arquivos numerados: a ordem alfabética é a ordem de carga. O `build.py` monta tudo em `dist/`.

## Comandos

```
python build.py               # build local: usa tudo o que estiver em assets/img e em src/
python build.py --publicar    # build de publicação: o que vai para o Artifact e o que os testes usam
npm ci                        # uma vez
npx playwright install chromium   # uma vez
node tests/run.js             # todas as suítes (JOBS=n roda n em paralelo)
node tests/run.js garden cidade   # só algumas
```

Os testes valem sobre o build de publicação: rode `python build.py --publicar` antes de `node tests/run.js`.

## Regras do código

- Nunca editar `dist/` à mão. Ela sai sempre do `build.py`.
- A página (`dist/system-ascension.html`) fica abaixo de 200 KB; o build falha se passar. Código vai para os blocos (`CHUNKS` no `build.py`).
- Arquivo novo em `src/`: o número define quando ele carrega. Prefira encaixar envolvendo funções que já existem (`var old = App.x; App.x = function(){ ... old.apply(this, arguments) ... }`) em vez de editar o núcleo.
- Save: `Store.DOCS` tem `core`, `journal`, `notes`, `city` e `sg`. Cada documento vai até 250 KB (`Store.LIMIT`). Documento novo precisa entrar em `Store.KEYS`, `Store.DOCS`, `Store.LABEL`, `App.docs()` e `App.replaceDoc`.
- Escrita automática (virada de dia, marcação de lido) vai dentro de `Store.asAuto(...)`, para não contar como edição da pessoa.
- Mudou comportamento, mudou ou criou teste junto (`tests/<suíte>.js`, registrada em `tests/run.js`).
- Commits pequenos, com mensagem em português dizendo o que muda para quem usa.

## Conteúdo

- Shadow Garden: lore da obra só em termos gerais. Toda fala é original; nada de falas, bordões ou cenas copiadas do anime, do mangá ou dos livros.
- Fichas das Sombras em `src/80_sg_data.js`; prompt e conversa em `src/81_sg_engine.js`; tela em `src/82_sg_ui.js`.
- As regras da técnica no prompt não saem: provocar sempre com uma dica concreta, nunca criticar descanso, nunca zombar de saúde, corpo, aparência, família, relacionamentos ou dinheiro pessoal, e sair do jogo com cuidado se o Yam parecer mal de verdade.

## Quem faz o quê

- **Yam**: decide o rumo.
- **GPT (Codex)**: artes, rascunhos de código base, segunda opinião sobre arquitetura e caminhos.
- **Claude**: código, programação e bases; junta o que vem de cada branch, testa, publica no Artifact e mantém o doc de Implementação.

## Fluxo com git

- Cada IA trabalha na sua branch: `gpt/<assunto>` ou `claude/<assunto>`. A `main` é o que está publicado.
- Branch nova sai sempre da `main` atual: `git switch -c gpt/<assunto> main`.
- Duas frentes não editam o mesmo arquivo ao mesmo tempo.
- Antes de entregar: `python build.py --publicar` e `node tests/run.js` verdes.
- Só o Claude publica no Artifact, sempre a partir da `main` e do build `--publicar`.
- O Claude entrega por bundle em `Claude outputs/`. Para pegar: `git fetch "Claude outputs/<arquivo>.bundle" main:main` (com outra branch aberta) e depois `git push origin main`.

## Artes das Sombras

- As artes completas ficam em `assets/img/sg-<id>.*` (e `sg-<id>-full.*`). São do Yam e do GPT.
- Elas ficam só na pasta, fora do git: `assets/img/sg-*` está no `.gitignore`. Não use `git add -f` nelas. Cópia de segurança fica por conta do Yam (a branch `gpt/arte-local` no GitHub guarda a versão de 10/11).
- Uma arte só vai para o Artifact depois que o Claude abre e aprova. A aprovação fica em `assets/aprovadas.json` (no git), com o sha256 de cada arquivo: o build `--publicar` só leva arte das Sombras e `src/*_local.js` que estejam lá com o mesmo hash. Trocou o arquivo, ele sai da publicação até nova revisão.
- O que passa: arte feita do zero, sem clima sensual (roupa casual, moletom ou o uniforme das Sombras de um jeito sóbrio). Remendo de uma arte reprovada não passa. A decisão é do Claude, por imagem.
- Na publicação, a arte aprovada em PNG sai em JPG (qualidade 88, uns 300 KB). Onde não há arte aprovada, entram os retratos de rosto e ombros de `assets/recortes/` (480 × 480).
- No build local, as artes de `assets/img` têm prioridade; os recortes só entram onde não há arte.
- A exibição das artes completas (CSS e retrato da cena) fica num arquivo próprio, `src/83_sg_arte_local.js`, do Yam e do GPT. O Claude não o edita; ele entra na publicação aprovado por hash, como as artes.
- Aviso para o GPT: o `arteLocal()` do 83 só reconhece arte em JPG (`/\.jpe?g/`). Com as artes novas em PNG, o build local não aplica o enquadramento; a publicação funciona porque sai em JPG. Se ajustar o 83 para aceitar PNG, avise: o Claude revisa e atualiza o hash.
- Ganchos para esse arquivo: `App.sgFace(id, size)` devolve o avatar redondo (cartões, canal, dossiê) e `App.sgRetratoHTML(M)` devolve o retrato da cena do conselho. Para trocar, guarde o original e envolva: `var old = App.sgRetratoHTML; App.sgRetratoHTML = function(M){ ... }`. CSS pode entrar por um `<style>` criado pelo próprio arquivo.
- A suíte `arte_local` (`tests/arte_local.js`) roda o `83_sg_arte_local.js` com imagens falsas e confere os ganchos. Mudou o arquivo, ajuste a suíte junto.

## Estado atual (10/11/2026, v20.6)

- `main` = v20.6 (publicada): as artes aprovadas da Gamma, da Delta e da Eta no Artifact, com o `83_sg_arte_local.js`.
- Artes reprovadas na revisão de 10/11: Alpha, Beta e Epsilon. Seguem com o recorte de rosto e ombros até chegar arte nova feita do zero.
- Próximo do GPT: artes novas da Alpha, da Beta e da Epsilon, e as da Zeta e do Shadow, em branch nova saída da `main`. Avise o Claude para revisar.
- Próximo do Claude: SG-B (SG5 a SG8: projetos, eventos, posto e medida), um bloco por vez.
- Depois do SG-B: avaliar a versão fora do Artifact (Firebase e servidor da API). O GPT dá a segunda opinião de arquitetura.
