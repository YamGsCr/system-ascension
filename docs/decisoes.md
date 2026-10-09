# Decisões da Cidade

Respostas dadas na lista **Decisões** da Bíblia da Cidade (8 de outubro de 2026), com o que cada uma vira no código.
Os números ficam em `SYS.CITY.CONF` (`src/70_city_data.js`), para mudar num lugar só.

| # | Pergunta | Resposta | No código |
|---|---|---|---|
| 1 | Economia de ◆ | equilibrar | Meta de uns 45 ◆ por dia na Licença E, calibrada contra a chave E e o Baú de Mana quando a rolagem de drop chegar (com teste de distribuição). `CONF.econ` |
| 2 | Fundo de Recompensas | equilibrar pelo rank, com config | Valor mensal por rank de Licença como padrão, editável nos Ajustes. A ideia de um "Cofre" que libera o Fundo quando sobra dinheiro fica anotada para o bloco dos vales. `CONF.fundo` |
| 3 | Tetos dos vales | manter; vale de Tempo limitado | Tetos de R$ 25 a R$ 800, dobrando por raridade. Vale de Tempo: no máximo 2 por mês. `CONF.vales` |
| 4 | Chaves na loja | subir o preço | Continuam à venda, mais caras (+50% como ponto de partida), a partir do bloco em que portais começam a dropar chaves. Antes disso o preço atual fica. `CONF.chaveMult` |
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

Quando uma resposta em aberto for dada, ela entra aqui e no `CONF`.
