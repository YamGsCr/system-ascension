# System Ascension

Janela de Sistema pessoal: 7 Caminhos de estudo, missões, sequência, Zona de Penalidade, em beta a Cidade de portais e, como atmosfera opcional, a Visão de Ascensão das Sombras com a aba Shadow Garden.
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
  70–79     Cidade (beta): dados, motor, mapa, tela, catálogo, drop, portais, janelas e recompensas
  80–82     Shadow Garden: dados das Sete Sombras, motor da conversa e a tela (atmosfera, cerimônia, conselho)
  99        boot
assets/img  imagens (retrato do caçador, carregamento, personagens)
build.py    monta dist/
tests/      suítes do Playwright e o runner
docs/       decisões e notas de projeto
```

## Build

```
python3 build.py --publicar   # o que vai para o Artifact e o que os testes usam
python3 build.py              # build local, com as artes de assets/img
```

O modo `--publicar` ignora as artes das Sombras (`assets/img/sg-*`) e os arquivos `src/*_local.js`, e usa os retratos de `assets/recortes/`. Quem faz o quê e o fluxo com git: [AGENTS.md](AGENTS.md).

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
python3 build.py --publicar
node tests/run.js              # todas as suítes
node tests/run.js cidade mdev  # só algumas
```

O runner roda 2 suítes por vez (`JOBS=n` muda), guarda os logs em `tests/logs/` e sai com erro se alguma falhar.
O GitHub Actions (`.github/workflows/ci.yml`) faz build e testes a cada push e guarda o `dist/` montado como artefato da execução.

Suítes principais: `catalog` (os 245 modelos de portal), `citymotor` (nascimento, prazos, drop com distribuição, Licença e economia), `cidade` e `cidade2` (a aba, o mapa e jogar na tela), `cityui` (carregamento, apresentação do Ivo, janelas e a tela sem rolar em 6 tamanhos), `recompensas` (caixas, maldições, Fundo e vales, Ecos, Relíquias, Forja, títulos e corrupção), `anistia` (as anistias de 17/10, 21/10 e 09/11 e a banca da Zona), `garden` (a Visão das Sombras, a cerimônia, o conselho e a conversa com IA), `split` (build em blocos), `citysave` (o 4º save), `mdev` e `syncrace` (sincronização entre aparelhos), `v14*` (Zona), `v12`/`v13` e as sondas antigas `v2`–`v11`.

## Saves

Cinco documentos por pessoa, em `data/users/<id>/`: `core` (progresso), `journal` (diário e Mundo Aberto), `notes` (notas das quests), `city` (a Cidade) e `sg` (o Shadow Garden).
Cada um tem até 250 KB. A guarda de sincronização (`src/64_sync_guard.js`) decide quem grava quando dois aparelhos mexem no mesmo documento; a versão que perde fica guardada no aparelho e sai no Exportar save.
Os documentos `city` e `sg` só passam a existir quando a Cidade beta ou a Visão das Sombras são ligadas. O `sg` guarda até 24 mensagens por membro (12 se ficarem longas).

## A tela da Cidade

O mapa ocupa a área toda, sem rolar: sete bairros encostados, com avenidas entre eles, um rio com pontes e o Centro na praça. Em tela em pé (celular), a mesma cidade gira 90° e os textos continuam de pé.
Tocar num bairro abre a janela dele por cima, com vinheta. O minimapa no canto é o radar; o botão com a sua foto abre a Janela do Caçador (Perfil, Inventário, Celular, Arsenal, Relíquias, Fundo e vales, Sala de Troféus). A Forja fica no Centro.
As janelas formam uma pilha: ← ou Esc voltam uma, ✕ ou clicar fora fecham todas. Na primeira vez, o Ivo Lint (Casa de Babel) apresenta a tela; a marca de visto fica no save da Cidade.

## Recompensas da Cidade

- Caixas sempre em par: a Abençoada entrega um item da Lista de Desejos (até 5); a Amaldiçoada entrega o que o Sistema acha que falta e uma de 6 maldições, que dura até cumprir (no máximo 7 dias). A que não foi aberta sussurra o que tinha.
- Fundo de Recompensas em reais: enche todo mês pelo rank da Licença (editável), aceita depósito e paga os vales. Vale nunca vira dívida; prenda aberta na Zona congela o resgate. O Vale Secreto sorteia da Lista Secreta.
- Ecos dão +2% de XP e Q na vertente (até +20%), sobem de nível quando invocados e ascendem no 5. Quebra deixa Eco Partido, Revanche e Contenção.
- Relíquias identificadas vão para os 5 espaços do avatar; 7 únicas. Forja: materiais nos portais (até 3) e 8 receitas.
- 13 títulos e as molduras da Licença entram no Sistema. Com a Cidade ligada, as chaves custam +50% na loja.
- Regras e números: `src/70c_city_rewards_data.js`; motor: `79a` e `79b`; janelas: `79c`. Escolhas em `docs/decisoes.md`.

## Shadow Garden

- Uma chave no Perfil (ou a convocação, uma vez) liga a Visão de Ascensão das Sombras: o app muda de nome, veste a skin sombria com névoa, a voz passa de [Sistema] para [Visão] e a aba Shadow Garden entra no menu. Desligar devolve tudo; nada do Garden se perde.
- A cerimônia de entrada apresenta as Sete Sombras e dá o Número do agente (fixo, tirado do save). O conselho mostra os 7 membros, um por Caminho, com afinidade e mensagens não lidas.
- Cada canal começa com uma fala pronta do dia (sem gastar IA). A resposta da IA leva o retrato real do Sistema (nível, diárias, Caminhos, Zona, Cidade), a memória dela sobre o agente e as regras: provocar com dica concreta, nunca criticar descanso, sair do jogo se ele estiver mal de verdade, falas sempre originais. Limite de respostas por dia nos Ajustes do Garden.
- Retratos: `assets/recortes/sg-<id>.webp` (rosto e ombros, 480 × 480) entram no lugar do sigilo sem mexer em código, nos cartões, no canal e na cena do conselho. As artes completas ficam em `assets/img` e só aparecem no build local (ver AGENTS.md).
- Dados e falas prontas: `src/80_sg_data.js`; motor e prompt: `81`; tela: `82`.

## Publicação

A página, os blocos e as imagens são publicados juntos no mesmo Artifact: `system-ascension.html` como página e cada `js/...` e `img/...` como arquivo ao lado, no mesmo caminho relativo. Blocos de uma versão anterior que não estão no `manifest.json` atual podem ser removidos na publicação.

## Repositório no GitHub

```
git remote add origin https://github.com/<você>/system-ascension.git
git push -u origin main --follow-tags
```

A tag `v15` marca a versão anterior à Cidade; a suíte `citysave` a usa para testar a página antiga aberta em outro aparelho.

Decisões de projeto: [docs/decisoes.md](docs/decisoes.md).
