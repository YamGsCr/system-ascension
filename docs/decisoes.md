# Decisões da Cidade

Respostas dadas na lista **Decisões** da Bíblia da Cidade (8 de outubro de 2026), com o que cada uma vira no código.
Os números ficam em `SYS.CITY.CONF` (`src/70_city_data.js`), para mudar num lugar só.

| # | Pergunta | Resposta | No código |
|---|---|---|---|
| 1 | Economia de ◆ | equilibrar | Calibrado no Bloco 2 com os valores da Bíblia: na Licença E, quem fecha tudo o que nasce (uns 2,7 portais por dia) faz 46 ◆ por dia; quem fecha até 2 por dia, uns 29. Simulação de 60 dias em `tests/citymotor.js`. `CONF.econ` |
| 2 | Fundo de Recompensas | equilibrar pelo rank, com config | Feito no Bloco 3. Valor mensal pela Licença, como ponto de partida: E R$ 80, D 120, C 180, B 260, A 380, S 520 (`CY.FUNDO.porRank`). Editável na janela Fundo e vales. A sobra passa adiante até 2 meses de Fundo. O "Cofre" virou o botão Depositar no Fundo: dinheiro seu que entra por cima, sem mexer no valor mensal. |
| 3 | Tetos dos vales | manter; vale de Tempo limitado | Tetos de R$ 25 a R$ 800, dobrando por raridade. Vale de Tempo: no máximo 2 por mês. `CONF.vales` |
| 4 | Chaves na loja | subir o preço | Aplicado no Bloco 3: com a Cidade ligada, as chaves custam +50% na loja (arredondado de 5 em 5). Com a Cidade desligada, o preço antigo volta. `CONF.chaveMult` |
| 5 | Onde guardar a Cidade | 4º documento | Feito no Bloco 1: documento `city` na nuvem, com guarda de sincronização e limite de tamanho. |
| 6 | Ritmo | raid mensal | 3 portais por reset, 6 abertos no máximo, 1 raid por mês. `CONF.ritmo` |
| 7 | Portais físicos | sim | Regras de segurança confirmadas; treino vira um tipo de exercício próprio. |
| 8 | Custo da IA | *em aberto* | Vale o padrão da Bíblia: 3 gerações por dia. `CONF.iaPorDia` |
| 9 | Caixa recusada | *em aberto* | Vale o padrão da Bíblia: o sussurro fica sempre ligado. |
| 10 | Lista de Desejos | 5 itens | `CONF.desejos = 5` |
| 11 | Clãs | os 17 de uma vez | Abrem todos juntos, mas só quando o bloco de Facções for feito. |
| 12 | Juramento | como está | 1 clã por Estação, votos semanais no peso atual. |
| 13 | Estação 1 | na Noite dos Portais Vermelhos | A Estação 1 (Rachadura) conta a partir de 31/10/2026. O radar da aba Cidade já mostra a contagem. As mecânicas ligam quando o motor de portais chegar, no calendário que começou em 31/10. `CONF.estacao1` |
| 14 | Mistério das 3h33 | tudo bem | O Ato I pode mexer na interface do Sistema com uma linha de log falsa. |
| 15 | Companheiro | o nome Chiado fica | |
| 16 | Mudança de Classe | 4 classes | `CONF.classes = 4` |
| 17 | Raid com gente de verdade | depois | A raid é solo. |
| 18 | Nomes | *em aberto* | Ficam os nomes atuais da Bíblia. |
| 19 | Oficina | as 9 bancadas | Abre com as 9 de uma vez. `CONF.bancadas = 9` |
| 20 | Caminhos de estudo | só na Cidade | Contadores, Babel, Prumo e Contraponto ficam na Cidade, como perícia de uma skill, sem virar arco lateral dos Caminhos. |
| 21 | Histórias | ordem boa, em aberto | |
| 22 | Laços e Junções | bom, em aberto | |

## Escolhas do Bloco 3 (Recompensas)

Pontos em que a Bíblia depende de um sistema que ainda não existe. Ficaram assim até o bloco dele:

| Tema | Como ficou |
|---|---|
| Sirene | A Bíblia fala em quest emergencial. Sem o sistema de quests da Cidade, a Sirene abre um portal emergencial D de 24 h; perder sobe 1 nível de corrupção no bairro. |
| Únicas de raid, chefe e Mistério | Dado de Osso, Ampulheta, Molho do Zelador e Ponteiro Quebrado aparecem trancadas na galeria de únicas, com o lugar de onde vêm. Adaga, Lanterna e Manto já caem. |
| Lente e Bússola | Itens do Mercador. Funcionam se aparecerem no inventário; o Mercador chega no bloco dele. |
| Chave Dourada | Fica guardada até as Dungeons se mudarem para o Centro. |
| Relíquias cheias | Até 120 Relíquias comuns guardadas (únicas e de origem não contam). A 121ª vira materiais, como o vale que vira ◆ quando o inventário enche. Mantém o documento `city` longe do limite de 250 KB. |
| Retratos e cenas | A aba existe na Sala de Troféus e abre com as Facções e os Laços. |

Quando uma resposta em aberto for dada, ela entra aqui e no `CONF`.
