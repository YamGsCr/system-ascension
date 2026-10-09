/* ===== FOUNDER v2 · arcos laterais (varejo/balcão e copy/conteúdo) + loja expandida ===== */
SYS.lib({
  hopkinsSci:{t:'Scientific Advertising',a:'Claude C. Hopkins',y:'1923 · domínio público',w:'founder',note:'A origem da propaganda testada: medir, comparar, repetir o que vendeu.'},
  ogilvyAd:{t:'Ogilvy on Advertising',a:'David Ogilvy',y:'1983',w:'founder',note:'Título, promessa e prova — com exemplos e opinião forte de quem vendeu muito.'},
  schwartzBreak:{t:'Breakthrough Advertising',a:'Eugene M. Schwartz',y:'1966',w:'founder',note:'Níveis de consciência do cliente e estado do mercado: o livro de copy mais citado (e mais caro).'},
  underhillBuy:{t:'Why We Buy: The Science of Shopping',a:'Paco Underhill',y:'ed. atualizada',pt:'Vamos às Compras!',w:'founder',note:'Etnografia de loja: fluxo, zona de descompressão, o que faz o cliente parar e comprar.'}
});

SYS.arc('founder', { id:'os1', side:1, needGate:'og1', n:'ARCO LATERAL · VAREJO & BALCÃO', wk:'Lateral', sub:'O caixa que paga as contas hoje: atendimento, estoque, vitrine e números do balcão.', nodes:[
 {id:'B26',d:'Varejo',t:'Atendimento de balcão & experiência do cliente',xp:50,cr:18,ach:'Balcão Vivo',
  s:'Os 10 primeiros segundos decidem se a venda existe — e se o cliente volta.',
  st:['Abordagem em 10 segundos sem parecer robô de script','Diagnóstico antes da oferta: 3 perguntas que evitam vender errado','Venda adicional honesta (o que resolve junto, não o que encalha)','Tempo de espera percebido: fila, ordem de atendimento, sinalização','Pós-venda: retorno em 7 dias no serviço técnico','Registro de atendimento: quem, o quê, resultado','Medir satisfação com 1 pergunta (nota de 0 a 10 + “por quê?”)'],
  wh:[['Sebrae — conteúdos para pequenos negócios','https://sebrae.com.br/','site','PT'],['Atendimento no varejo: erros comuns',yt('atendimento ao cliente varejo balcao treinamento'),'vídeo','PT']],
  bk:[['underhillBuy','Comportamento do cliente na loja'],['mitoEmpreendedor','Processo antes de heroísmo']],
  q:'Escreva o padrão de atendimento da loja (abordagem, diagnóstico, fechamento, pós-venda), treine a equipe e meça 2 semanas.',
  dv:'Padrão escrito + medição de 2 semanas', g:'A equipe usa o padrão sem decorar e a nota média está registrada.',
  f:'“Pois não?” e silêncio até o cliente ir embora.'},
 {id:'B27',d:'Varejo',t:'Estoque, giro & curva ABC',xp:50,cr:18,ach:'Giro Rápido',
  s:'Estoque parado é dinheiro seu dormindo na prateleira.',
  st:['Curva ABC por receita E por margem (elas discordam mais do que parece)','Giro e cobertura: quantos dias de estoque você tem de cada item','Ponto de pedido e lead time real do fornecedor (não o prometido)','Ruptura x encalhe: os dois custam, um é invisível','Inventário cíclico semanal em vez do inventário anual traumático','Capital de giro: quanto do caixa está em prateleira (ponte com o Navigator)','Plano de queima para itens parados há mais de X dias'],
  wh:[['Sebrae — gestão de estoque','https://sebrae.com.br/','site','PT'],['Curva ABC na prática',yt('curva abc estoque varejo planilha'),'vídeo','PT']],
  bk:[['aMeta','Gargalo e fluxo']],
  q:'Monte a curva ABC da loja, calcule giro e cobertura dos 20 itens principais e defina ponto de pedido para os A.',
  dv:'Planilha de ABC + política de compra', g:'Você sabe quanto do caixa está parado e quais itens queimar.',
  f:'Comprar pelo desconto do fornecedor e descobrir 60 unidades encalhadas em dezembro.'},
 {id:'B28',d:'Varejo',t:'Vitrine, layout & visual merchandising',xp:45,cr:16,ach:'Vitrine Que Para',
  s:'A loja fala antes de você — o layout é argumento de venda em silêncio.',
  st:['Zona de descompressão: os 3 primeiros metros da entrada','Fluxo natural e pontos quentes da loja','Agrupar por solução (o que o cliente quer resolver), não por marca','Preço visível: item sem preço é item não comprado','Iluminação, limpeza e altura dos olhos','Troca de vitrine por sazonalidade e campanha','Medir: contagem de entradas x vendas = taxa de conversão da loja'],
  wh:[['Visual merchandising para pequenas lojas',yt('visual merchandising loja pequena vitrine dicas'),'vídeo','PT'],['Sebrae — layout de loja','https://sebrae.com.br/','site','PT']],
  bk:[['underhillBuy','Fluxo, vitrine e comportamento']],
  q:'Refaça a vitrine e um ponto quente da loja, e compare conversão e ticket médio por 3 semanas.',
  dv:'Fotos antes/depois + números', g:'Mudança medida, não só bonita.',
  f:'Vitrine com 40 produtos, 0 preços e uma faixa de Natal em julho.'},
 {id:'B29',d:'BOSS',t:'BOSS · Um mês de balcão medido',xp:260,cr:90,boss:1,ach:'Mês Medido',
  s:'O varejo vira jogo quando você enxerga o placar.',
  st:['Definir 4 indicadores','Medir todos os dias','3 mudanças e comparação'],
  q:'Meça um mês inteiro de balcão (ticket médio, conversão, itens por venda, recompra), aplique 3 mudanças e compare com o mês anterior.',
  dv:'Painel do mês + relatório de mudanças', g:'Os 4 indicadores existem, com base de comparação e conclusão honesta.',
  f:'“Esse mês foi fraco” sem um número para provar.'}
]});

SYS.arc('founder', { id:'os2', side:1, needGate:'og5', n:'ARCO LATERAL · COPY & CONTEÚDO', wk:'Lateral', sub:'Escrever para vender sem virar aquele perfil que só posta link de compra.', nodes:[
 {id:'B30',d:'Marketing',t:'Copywriting clássico',xp:50,cr:18,ach:'Copy de Verdade',
  s:'Quase tudo que a internet chama de “copy” é rodapé do que Hopkins, Ogilvy e Schwartz já testaram.',
  st:['Hopkins: propaganda como experimento — medir resposta, não aplauso','Ogilvy: título, promessa específica e prova','Schwartz: níveis de consciência do cliente e estado do mercado','AIDA é esqueleto, não receita','Escrever para UMA pessoa (o cliente que você atendeu ontem)','Específico vence genérico: número, nome, prazo, garantia','Testar título antes de escrever o texto inteiro'],
  wh:[['Scientific Advertising — resumo e leitura',yt('scientific advertising claude hopkins summary'),'vídeo','EN'],['Níveis de consciência explicados',yt('eugene schwartz levels of awareness copywriting'),'vídeo','EN']],
  bk:[['hopkinsSci','Propaganda testada'],['ogilvyAd','Título, promessa e prova'],['schwartzBreak','Consciência e mercado']],
  q:'Reescreva 3 peças suas (anúncio, página de serviço e mensagem de prospecção) aplicando nível de consciência e prova; teste 2 títulos em cada.',
  dv:'3 peças reescritas + resultado dos testes', g:'Cada peça tem promessa específica, prova e um teste de título registrado.',
  f:'“Somos líderes em soluções inovadoras” — e ninguém liga.'},
 {id:'B31',d:'Marketing',t:'Conteúdo que vende sem implorar',xp:45,cr:16,ach:'Pauta Cheia',
  s:'Conteúdo bom faz o cliente chegar sabendo o que quer — e já confiando.',
  st:['Três pilares: educar, provar, humanizar','Calendário de 4 semanas com pautas definidas de antemão','Formato por canal (não é o mesmo texto em todo lugar)','Reaproveitamento: 1 peça grande vira 5 pequenas','Prova em vídeo curto: antes/depois de serviço, bastidor, cliente falando (com autorização)','Chamada discreta e recorrente, não implorada','Medir: alcance x conversa iniciada x venda atribuída'],
  wh:[['Calendário editorial para pequenos negócios',yt('calendario editorial conteudo pequena empresa'),'vídeo','PT']],
  bk:[['traction','Canais e tração'],['ogilvyAd','Mensagem que vende']],
  q:'Rode 4 semanas de calendário editorial (12 peças) em 1 canal principal e meça conversas geradas.',
  dv:'Calendário + relatório', g:'12 peças publicadas no prazo e conversas contadas.',
  f:'Postar 3 dias seguidos, sumir 2 meses, reclamar que “rede social não funciona”.'},
 {id:'B32',d:'Marketing',t:'E-mail e WhatsApp com consentimento (LGPD)',xp:50,cr:18,ach:'Lista Limpa',
  s:'Base própria é ativo. Lista comprada é passivo com juros.',
  st:['Base própria x lista comprada (nunca compre)','LGPD: base legal, finalidade, transparência e descarte (Lei 13.709/2018)','Consentimento verificável e opt-out fácil em toda mensagem','WhatsApp Business: regras da plataforma, listas de transmissão e modelos de mensagem','Segmentação simples: cliente ativo, inativo, orçamento aberto','Cadência que respeita: frequência combinada, horário civilizado','Governança: quem acessa a base, onde ela fica, por quanto tempo, e quem responde ao titular'],
  wh:[['LGPD — Lei 13.709/2018','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm','doc','PT'],['ANPD — Autoridade Nacional de Proteção de Dados','https://www.gov.br/anpd/pt-br','site','PT']],
  q:'Monte a base própria com consentimento registrado, escreva a política de uso de dados da loja e dispare 1 campanha segmentada.',
  dv:'Base + política + campanha', g:'Consentimento registrado, opt-out funcionando e política publicada.',
  f:'Importar 3 mil números de um grupo e mandar promoção às 23h.'},
 {id:'B33',d:'BOSS',t:'BOSS · Campanha que se paga',xp:260,cr:90,boss:1,ach:'Campanha Paga',
  s:'Marketing sem número é hobby caro.',
  st:['Oferta clara e mensurável','Copy e canal escolhidos com critério','Medição de custo x receita'],
  q:'Rode uma campanha completa de 30 dias (oferta, copy, canal, cadência) com meta definida e entregue o relatório de custo, receita atribuída e decisão.',
  dv:'Relatório da campanha', g:'Receita atribuída maior que o custo — ou aprendizado documentado com números.',
  f:'“Deu uma movimentada” como métrica de sucesso.'}
]});

[
 {id:'ogs1',arc:'os1',n:'Selo Lateral · Balcão',ev:['Padrão de atendimento + medição','Curva ABC + política de compra','Vitrine refeita com números','Boss Mês Medido'],oral:'Qual é o seu ticket médio e o que o move?',fail:'Qual cliente você perdeu por falha de processo, e o que mudou depois?',ach:'fo_s1',xp:220},
 {id:'ogs2',arc:'os2',n:'Selo Lateral · Copy & Conteúdo',ev:['3 peças reescritas com teste de título','12 peças publicadas','Base com consentimento + política','Boss Campanha que se Paga'],oral:'Explique nível de consciência do cliente usando um anúncio seu.',fail:'Qual campanha queimou dinheiro e o que você aprendeu?',ach:'fo_s2',xp:220}
].forEach(function(g){ SYS.gate('founder', g); });

SYS.shop('founder', [
 {id:'fo_x1',tier:'uncommon',n:'Livro: Vamos às Compras! (Why We Buy) — Paco Underhill',rule:'até R$ 150',req:'n_B28'},
 {id:'fo_x2',tier:'uncommon',n:'Livro: The Mom Test — Rob Fitzpatrick',rule:'até R$ 150',req:'n_B01'},
 {id:'fo_x3',tier:'rare',n:'Livro: Ogilvy on Advertising — David Ogilvy',rule:'até R$ 300 (importado)',req:'n_B30'},
 {id:'fo_x4',tier:'rare',n:'Livro: Obviously Awesome — April Dunford',rule:'até R$ 250 (importado)',req:'n_B02'},
 {id:'fo_x5',tier:'rare',n:'Livro: Estratégia Boa, Estratégia Ruim — Richard Rumelt',rule:'até R$ 250',req:'n_B20'},
 {id:'fo_x6',tier:'epic',n:'Livro: Breakthrough Advertising — Eugene M. Schwartz',d:'O livro de copy mais caro do mercado — e o único que explica estado de mercado direito.',rule:'até R$ 900 (importado; confira edições legítimas)',cd:72,req:'n_B30'},
 {id:'fo_x7',tier:'rare',n:'Ferramenta de e-mail marketing (plano anual)',rule:'até R$ 900 por ano',req:'n_B32'},
 {id:'fo_x8',tier:'rare',n:'Curso de copywriting com correção de peças',rule:'até R$ 900',cd:72,req:'n_B30'},
 {id:'fo_x9',tier:'epic',n:'Kit de conteúdo: luz + microfone + tripé',rule:'até R$ 1.500',cd:72,req:'n_B31'},
 {id:'fo_x10',tier:'epic',n:'Leitor de código de barras + sistema de inventário',rule:'até R$ 2.000',cd:72,req:'n_B27'},
 {id:'fo_x11',tier:'epic',n:'Reforma da vitrine e da iluminação da loja',rule:'até R$ 3.000',cd:168,req:'n_B28'},
 {id:'fo_x12',tier:'rare',n:'Treinamento de atendimento para a equipe (turma fechada)',rule:'até R$ 1.200',cd:72,req:'n_B26'},
 {id:'fo_x13',tier:'legendary',n:'Ingresso + viagem para um grande evento de marketing ou varejo no Brasil',rule:'orçamento separado',seals:2,cd:168,req:'n_B33'},
 {id:'fo_x14',tier:'legendary',n:'Viagem para a NRF Retail’s Big Show (Nova York)',d:'A feira do varejo mundial. Só depois de ter o balcão medido — senão vira turismo caro.',rule:'orçamento separado + reserva intacta',seals:2,cd:168,req:'n_B29'}
]);
