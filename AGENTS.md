# AGENTS.md · System Ascension

Guia para quem mexe no projeto: o Yam, o GPT (Codex) e o Claude. Leia antes de mudar qualquer coisa.

## O projeto

- Sistema pessoal de evolução no estilo Solo Leveling: 7 Caminhos de estudo, missões, sequência, Rotina, Zona de Penalidade, a Cidade de portais, o SGM-Opus (projetos e compras) e a Visão de Ascensão das Sombras (aba Shadow Garden).
- Os 7 Caminhos (v21): Architect e Vitruviano são os principais; depois Aesthetic (com a Calistenia, que é o Way físico), Navigation, Founder, Flâneur e Mind. O Ars Subtilior não existe mais: virou a Harmonia do Vitruviano. O Mind ficou só com jogos e escrita criativa (vertentes Hiperfocos & Arquivos e Jogos & Sistemas).
- Fonte de verdade da reestruturação v21: o doc "SGM-Opus · Arsenal de Recursos" (claude.ai/artifact/G5T9baEHQSQPsZbF49C5Q1), aba Handoff, depois as outras abas, depois este código.
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
- A voz (v20.7): elas falam como pessoas do Garden, nunca como assistente. Uma coisa por mensagem; ao avaliar algo, primeiro o que funcionou, depois o trecho reescrito na voz dela; emoção; pergunta no fim; nada de lista, markdown ou frase de assistente. Cada ficha diz como ela ensina, elogia, se apega e se interessa (`ensina`, `elogia`, `gosta`, `curiosa`) e o que sabe da Terra pelo mestre (`terra`, a Sabedoria das Sombras). O canon é flexível.
- `E.sgVoz` é a rede de segurança: desfaz lista, markdown e tique de assistente na resposta da IA e no histórico. `E.sgTiques` aponta o que sobrou. A suíte `voz` barra o tom de lista e de assistente nas fichas, nas falas prontas e no prompt: fala nova precisa passar nela.
- Modo protótipo (Ajustes do Garden, `sg.proto`): medidores de Philia (afeto e sentimento, o amor de amizade dela pelo agente) e Interesse, de 0 a 100 em 5 níveis, em `sg.philia` e `sg.inter`. Só aparecem e só andam com o modo ligado. Philia nunca vira romance: o amor delas, no sentido da obra, é do mestre Shadow, e com o agente nunca há romance, flerte ou ciúme.

## Vitruviano, SGM-Opus e Rotina (v21)

- Vitruviano (`src/27_vitruviano.js` a `27i_superare.js`, bloco `vitruviano` do build): cinco vertentes, `mat` Mathematica, `har` Harmonia, `phi` Philosophia, `pol` Politeia e `lin` Lingua, e o arco `sm1` (Shadow · Superare Machinam) sem vertente, que aparece como Integração. As examinadoras ficam em `way.exam`: Eta, Epsilon, Alpha, Gamma, Beta e Zeta; as Sete Sombras no Shadow.
- IDs: a Harmonia guarda os IDs do Ars (`M01`…`M70`, selos `mg*`, conquistas `ar_*`, loja `ms_*`) e a base do Mind foi com os dela (`P01`…`P32`, `ig1`…`ig6`, `igs1`, `igs2`, loja `mi*`). Não renumere: o progresso salvo acompanha o ID. Novos: `MT01`…`MT35` (Mathematica), `M71`…`M75` (piano), `P33`, `P34`, `PO01`…`PO06`, `L01`…`L18`, `SM01`…`SM06`.
- Mathematica: cada arco é um rank (`rank:1`…`7`) e o último nó é a Prova (`prova:1`, `proj:[projetos sugeridos]`). A Prova só fecha com o mini-artigo completo (`App.N.n[id].art`, cinco campos) e o projeto em `S.vit.proj[id]`. O rank é `E.mathRank(S)`.
- XP dupla e XP do SGM-Opus somam num `E.derive` envolvido em `src/87_v21_ganchos.js` (`E.v21XP`). Era vale 50, 75, 100… XP no Way do projeto (dividido quando há dois, como o Scrinium); Shadow Level, 60; etapa do Inceptum, 40. Compra não dá XP.
- Regras do Vitruviano na tela: `src/63b_v_vitruviano.js` (abas Provas, Chefes e Regras; Filtro de Vitrúvio nas laterais; `reqN` trava o chinês até o `L07`; Prokopton e Kalokagathia em `E.kalok`). Os Títulos são `sys_prokopton` (tier IV no Vitruviano, no Aesthetic e na Calistenia) e `sys_kalokagathia` (tier máximo nos três), em `39u_vitruviano_game.js`.
- SGM-Opus (`84_opus_data.js`, dados gerados do doc; `85_opus.js`, tela e regras): `S.opus`. Marco de era vem do doc quando ele dá; senão a pessoa escreve antes de fechar. Ritual de fechamento (um dia de comemoração) e projeto novo só depois de fechar uma era (o primeiro é livre).
- Rotina (`86_rotina.js`): `S.rot`. Ondas a partir de 16/11/2026 (a seguinte libera 21 dias depois; a 5 só com o JLPT N4), dia mínimo de 10 min por bloco, menu de bolso, Abstinentia (desde 14/11/2026), sono com modo leve automático, folga semanal, pausa manual (pílula no topo) e revisão mensal. Modo leve e pausa suspendem o Chamado da Zona por `S.pz.pause`; a pausa congela as diárias dos dias pausados.
- Migração v21 (`42b_migra_vitruviano.js`): troca `ars` por `vitruviano` em tudo que o save guarda com o Caminho escrito e leva a diária Registro junto; grava `S.flags.v21` com o XP total antes e depois (iguais) e uma cópia em `localStorage['sysasc.backup.v21']`. Roda em memória e não força gravação. A Cidade e o journal migram em `87`.
- Cidade: o Estúdio sem Janela é o distrito do Vitruviano (ruas pelos arcos da Harmonia). A Biblioteca continua do Mind; a rua Pensamento puxa os nós de filosofia e lógica do Vitruviano por `sel.way` (`E.cyRuaNode`), mas a recompensa segue do distrito (Mind). Rever se isso incomodar.
- A suíte `vitruviano` confere a estrutura, a migração do save real (`tests/fixtures/core_v20_yam.json`, sem carteira, Zona nem textos livres), as Provas, a XP dupla, o Filtro, os Títulos, o SGM-Opus e a Rotina.

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

## Estado atual (15/11/2026, v21 em branch)

- Branch `claude/vitruviano` (saiu da `main` v20.7): a reestruturação v21 do doc SGM-Opus. Ars vira Harmonia; a base do Mind vai para Philosophia, Lingua e Politeia; entra o Vitruviano com Mathematica (7 ranks por Prova), Politeia, Lingua (Trivium e quatro idiomas), Shadow Superare Machinam, Títulos Prokopton e Kalokagathia, a aba SGM-Opus e a Rotina. Ainda não está na `main` nem publicada.
- Mexe em `build.py` (bloco `ars` virou `vitruviano` a partir de `27_`; bloco novo `opus` a partir de `84_`), nos arquivos `27*`, `29_mind.js` (o `29b_mind_side.js` saiu), em referências de `24b`, `25a`, `26a`, `29z`, `30`, `31`, `37`, `38`, `39v`, `41`, `52`, `70`, `74b`, `74f`, `76` e `80_sg_data.js` (só o `way` da Epsilon), e cria `39u`, `42b`, `63b`, `84` a `87` e a suíte `vitruviano`. Não toca no `83` nem nas falas das Sombras.
- Pendências do doc: o rank do Prokopton foi decidido como IV (Kalokagathia ficou no tier máximo); os marcos das eras que só existem na v0.1 são escritos na tela; o nome do Way físico continua "Calistenia (Aesthetic)".
- Testes: 36 suítes e 1.139 asserções verdes com `JOBS=3`. Com `JOBS=6` a `anistia`, a `cityui` e a `citysave` às vezes falham por tempo (a `anistia` falhou assim também na `main` v20.7); rodadas sozinhas passam.

## Estado anterior (11/11/2026, v20.7)

- `main` = v20.7 (publicada): a voz nova das Sombras no canal (fichas, prompt, `E.sgVoz` e a suíte `voz`) e o modo protótipo com Philia e Interesse. As artes aprovadas da Gamma, da Delta e da Eta seguem no Artifact, com o `83_sg_arte_local.js`.
- A v20.7 mexe em `src/00_head.html`, `80_sg_data.js`, `81_sg_engine.js`, `82_sg_ui.js` e `tests/run.js`, e não toca no `83` nem na `tests/arte_local.js`. Para pegar com a `gpt/roupas-garden` aberta: `git fetch "Claude outputs/system-ascension-v20-7.bundle" main:main`, e depois `git rebase main` na branch do GPT, quando ele quiser.
- Artes reprovadas na revisão de 10/11: Alpha, Beta e Epsilon. Seguem com o recorte de rosto e ombros até chegar arte nova feita do zero.
- Próximo do GPT: artes novas da Alpha, da Beta e da Epsilon, e as da Zeta e do Shadow, em branch nova saída da `main`. Avise o Claude para revisar.
- Próximo do Claude: SG-B (SG5 a SG8: projetos, eventos, posto e medida), um bloco por vez.
- Depois do SG-B: avaliar a versão fora do Artifact (Firebase e servidor da API). O GPT dá a segunda opinião de arquitetura.
