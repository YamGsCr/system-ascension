# System Ascension

Janela de Sistema pessoal: 7 Caminhos de estudo, missões, sequência, Zona de Penalidade e, em beta, a Cidade de portais.
Roda como um Artifact no claude.ai, com save privado na conta (capacidades `db` e `user`), IA do Examinador (`sample`) e exportação de arquivo (`downloads`).

## Estrutura

```
src/        o código, em arquivos numerados: a ordem alfabética é a ordem de carga
  00_head.html, 01_body.html   estilos e esqueleto da página
  10–39     dados (registro, Caminhos, jogo, Zona)
  40–42     util, arte, motor e Store (save na nuvem)
  50–63     telas
  64        guarda de sincronização entre aparelhos
  65–68     Zona de Penalidade
  70–78     Cidade (beta): dados, motor, mapa, tela, catálogo, drop, portais e janelas
  99        boot
assets/img  imagens (retrato do caçador, carregamento, personagens)
build.py    monta dist/
tests/      suítes do Playwright e o runner
docs/       decisões e notas de projeto
```

## Build

```
python3 build.py
```

Gera em `dist/`:

- `system-ascension.html`: a página (estilos, esqueleto e as tags de script). Fica abaixo de 200 KB; o build falha se passar.
- `js/<bloco>.<hash>.js`: o código, em blocos contíguos de `src/`, carregados em ordem. O hash no nome evita cache velho.
- `img/<nome>.<hash>.webp`: as imagens de `assets/img`; a página recebe os caminhos em `window.SYS_IMG`.
- `manifest.json`: quais arquivos de `src/` estão em cada bloco, e as imagens.
- `single/system-ascension.html`: tudo num arquivo só, como reserva.
- `test*.html`: as páginas que as suítes abrem.

## Testes

```
npm ci
npx playwright install chromium
python3 build.py
node tests/run.js              # todas as suítes
node tests/run.js cidade mdev  # só algumas
```

O runner roda 2 suítes por vez (`JOBS=n` muda), guarda os logs em `tests/logs/` e sai com erro se alguma falhar.
O GitHub Actions (`.github/workflows/ci.yml`) faz build e testes a cada push e guarda o `dist/` montado como artefato da execução.

Suítes principais: `catalog` (os 245 modelos de portal), `citymotor` (nascimento, prazos, drop com distribuição, Licença e economia), `cidade` e `cidade2` (a aba, o mapa e jogar na tela), `cityui` (carregamento, apresentação do Ivo, janelas e a tela sem rolar em 6 tamanhos), `split` (build em blocos), `citysave` (o 4º save), `mdev` e `syncrace` (sincronização entre aparelhos), `v14*` (Zona), `v12`/`v13` e as sondas antigas `v2`–`v11`.

## Saves

Quatro documentos por pessoa, em `data/users/<id>/`: `core` (progresso), `journal` (diário e Mundo Aberto), `notes` (notas das quests) e `city` (a Cidade).
Cada um tem até 250 KB. A guarda de sincronização (`src/64_sync_guard.js`) decide quem grava quando dois aparelhos mexem no mesmo documento; a versão que perde fica guardada no aparelho e sai no Exportar save.
O documento `city` só passa a existir quando a Cidade beta é ligada nos Ajustes.

## A tela da Cidade

O mapa ocupa a área toda, sem rolar: sete bairros encostados, com avenidas entre eles, um rio com pontes e o Centro na praça. Em tela em pé (celular), a mesma cidade gira 90° e os textos continuam de pé.
Tocar num bairro abre a janela dele por cima, com vinheta. O minimapa no canto é o radar; o botão com a sua foto abre a Janela do Caçador (Perfil, Inventário e Celular).
As janelas formam uma pilha: ← ou Esc voltam uma, ✕ ou clicar fora fecham todas. Na primeira vez, o Ivo Lint (Casa de Babel) apresenta a tela; a marca de visto fica no save da Cidade.

## Publicação

A página, os blocos e as imagens são publicados juntos no mesmo Artifact: `system-ascension.html` como página e cada `js/...` e `img/...` como arquivo ao lado, no mesmo caminho relativo. Blocos de uma versão anterior que não estão no `manifest.json` atual podem ser removidos na publicação.

## Repositório no GitHub

```
git remote add origin https://github.com/<você>/system-ascension.git
git push -u origin main --follow-tags
```

A tag `v15` marca a versão anterior à Cidade; a suíte `citysave` a usa para testar a página antiga aberta em outro aparelho.

Decisões de projeto: [docs/decisoes.md](docs/decisoes.md).
