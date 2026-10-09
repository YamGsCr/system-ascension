/* ===== v10 · NAVIGATION · leitura profunda, carteira de renda variável e debêntures ===== */
SYS.lib({
  schilit:{t:'Financial Shenanigans',a:'Howard Schilit, Jeremy Perler & Yoni Engelhart',y:'4ª ed. · 2018',w:'navigation',note:'Catálogo de truques contábeis com casos reais. Leia com o balanço de uma empresa sua do lado.'},
  damodaran:{t:'Narrative and Numbers',a:'Aswath Damodaran',y:'2017',w:'navigation',note:'Amarrar história e planilha: toda tese boa tem as duas, e elas precisam combinar.'},
  bogle:{t:'Common Sense on Mutual Funds',a:'John C. Bogle',y:'2010',w:'navigation',note:'Custo, persistência e a matemática chata que explica por que a maioria dos fundos perde do índice.'}
});

/* ---------- IV · LEITURA PROFUNDA ---------- */
SYS.arc('navigation', { id:'ni4', br:'inv', needGate:'ng9', n:'IV · LEITURA PROFUNDA', wk:'Ações · IV', sub:'Ler balanço com desconfiança, entender setores que têm régua própria e saber o que é um índice por dentro.', nodes:[
 {id:'V60',d:'Fundamentalista',t:'Contabilidade forense & red flags',xp:55,cr:18,ach:'Detetive de Balanço',
  s:'Lucro é opinião, caixa é fato. A distância entre os dois é onde mora a história.',
  st:['Qualidade do lucro: lucro líquido × caixa operacional ao longo de 5 anos','Receita reconhecida cedo demais e contrato de longo prazo','Despesa capitalizada virando ativo no balanço','Provisão como gaveta: guardar lucro hoje para soltar amanhã','Item “não recorrente” que recorre todo trimestre','Contas a receber e estoque crescendo mais rápido que a receita','Partes relacionadas, empréstimo a controlador e garantia cruzada','Troca de auditor, ressalva, atraso de balanço e republicação','Ajuste de exercícios anteriores: o retrovisor mudou de lugar','Nota explicativa é onde o corpo está enterrado'],
  wh:[['CVM — dados abertos (DFP, ITR e fatos relevantes)','https://dados.cvm.gov.br/','doc','PT'],['CVM — Portal do Investidor','https://www.gov.br/investidor/pt-br','doc','PT'],['Red flags em demonstrações financeiras',yt('financial shenanigans red flags earnings quality analysis'),'vídeo','EN']],
  bk:[['schilit','Os truques, por categoria, com caso real'],['damodaran','Quando a narrativa não bate com o número']],
  q:'Escolha uma empresa listada, compare lucro líquido e caixa operacional dos últimos 5 anos e liste 3 sinais amarelos com a linha exata da demonstração ou da nota.',
  dv:'Relatório de red flags de uma empresa', g:'Aponta 3 sinais com a linha de origem e explica o que cada um pode estar escondendo.',
  f:'Ler só o release da empresa; aceitar “ajuste não recorrente” sem olhar os três anos anteriores.'},
 {id:'V61',d:'Setores',t:'Bancos & seguradoras',xp:55,cr:18,ach:'Leitor de Spread',
  s:'Banco não se lê como varejo: o produto dele é risco, e o estoque dele é dívida dos outros.',
  st:['Margem financeira (o que ele ganha emprestando) e receita de serviço e tarifa','Provisão para devedores duvidosos e inadimplência acima de 90 dias','Índice de Basileia e capital: por que existe limite para alavancar','Carteira por segmento: consignado, cartão, imobiliário, PME','ROE alto é normal no setor — compare com pares, não com indústria','Seguradora: prêmio, sinistralidade e índice combinado','Float: o dinheiro do segurado rendendo até o sinistro chegar','Resultado de subscrição × resultado financeiro','Por que P/L e EV/EBITDA não servem para banco'],
  wh:[['Banco Central — relatórios e estatísticas do sistema financeiro','https://www.bcb.gov.br/estatisticas','doc','PT'],['SUSEP — mercado de seguros','https://www.gov.br/susep/pt-br','doc','PT'],['Como analisar banco: margem, PDD e Basileia',yt('como analisar banco margem financeira PDD basileia'),'vídeo','PT']],
  bk:[['damodaran','Setores com contabilidade própria']],
  q:'Pegue um banco e uma seguradora listados e monte a ficha de cada um com as métricas do setor, não com as genéricas.',
  dv:'Ficha setorial de banco e seguradora', g:'Explica o que faz o lucro de cada um e qual número estraga primeiro numa crise.',
  f:'Comparar P/L de banco com o de varejo; achar que ROE alto de banco é sinal de genialidade.'},
 {id:'V62',d:'Setores',t:'Concessões, utilities & commodities',xp:55,cr:18,ach:'Leitor de Ciclo',
  s:'Uns ganham por contrato e regra; outros ganham por preço que ninguém controla.',
  st:['Concessão: prazo, base de ativos regulatória, revisão tarifária e indexador','Risco regulatório e político: a caneta que muda a conta','Energia: geração, transmissão e distribuição têm riscos diferentes','Utilities como proxy de renda fixa longa: sofrem com juro subindo','Commodity: preço internacional, custo de extração e câmbio','Produtor de baixo custo é quem sobrevive ao fundo do ciclo','Capex pesado, ciclo de investimento e o tempo até gerar caixa','Dívida em dólar com receita em real (e vice-versa)','Dividendo de fim de ciclo: alto e insustentável'],
  wh:[['ANEEL — informações do setor elétrico','https://www.gov.br/aneel/pt-br','doc','PT'],['ANP — dados de petróleo e gás','https://www.gov.br/anp/pt-br','doc','PT'],['Como analisar empresa de commodity e ciclo',yt('analise empresa commodity ciclo custo de producao'),'vídeo','PT']],
  q:'Escolha uma concessionária e uma empresa de commodity e escreva o que faz cada uma ganhar dinheiro, além do que faz cada uma quebrar.',
  dv:'Duas fichas setoriais com o gatilho de risco', g:'Sabe qual variável externa manda em cada uma e onde ela aparece no resultado.',
  f:'Comprar commodity no topo do ciclo por causa do P/L baixo; ignorar revisão tarifária em concessão.'},
 {id:'V63',d:'Setores',t:'Varejo, consumo & tecnologia',xp:55,cr:18,ach:'Leitor de Giro',
  s:'Aqui tu tem vantagem: já opera varejo. A bolsa só muda a escala.',
  st:['Venda em mesma loja, ticket médio e fluxo','Margem × giro: as duas formas de ganhar dinheiro no varejo','Estoque, capital de giro e o efeito da sazonalidade','E-commerce: GMV não é receita; frete e take rate','Tecnologia e SaaS: receita recorrente, churn e retenção líquida','CAC, payback e unit economics na demonstração','Queima de caixa e diluição do acionista em emissão','Promoção que compra receita e destrói margem','Concorrência: quem consegue repassar preço e quem não consegue'],
  wh:[['Relatórios de RI e dados abertos da CVM','https://dados.cvm.gov.br/','doc','PT'],['Métricas de varejo e de SaaS explicadas',yt('same store sales churn net revenue retention metricas'),'vídeo','EN/PT']],
  bk:[['damodaran','Histórias de crescimento e o número que sustenta']],
  q:'Analise uma varejista e uma empresa de tecnologia listadas e compare com o que tu enxerga no teu próprio balcão: giro, margem, ticket e sazonalidade.',
  dv:'Comparativo varejo × tecnologia', g:'Usa a experiência da tua loja para checar se o número da empresa faz sentido no mundo real.',
  f:'Comprar crescimento sem olhar diluição; confundir GMV com receita.'},
 {id:'V64',d:'Índices',t:'Índice por dentro',xp:50,cr:17,ach:'Leitor de Índice',
  s:'Comprar índice sem saber a regra dele é terceirizar a decisão para um comitê que tu nunca leu.',
  st:['Como o Ibovespa é montado: liquidez, negociabilidade e free float','Rebalanceamento periódico e o efeito de entrar ou sair da carteira teórica','Concentração setorial: o índice brasileiro não é a economia brasileira','Cada índice é uma regra: small caps, dividendos, IFIX, ESG','Índices de renda fixa (IMA-B, IRF-M) e a duration embutida','Índice global: peso por capitalização e o que isso implica','ETF replica o índice, não o mercado — e nem sempre bem','Ler a metodologia antes de comprar o produto'],
  wh:[['B3 — índices','https://www.b3.com.br/','doc','PT'],['ANBIMA Data — índices de renda fixa','https://data.anbima.com.br/','doc','PT'],['Metodologia de índice: por que importa',yt('metodologia indice ibovespa free float rebalanceamento'),'vídeo','PT']],
  bk:[['bogle','Índice, custo e a matemática do investidor médio']],
  q:'Leia a metodologia de dois índices que tu investiria e escreva em 10 linhas o que cada um realmente compra e quando ele rebalanceia.',
  dv:'Resumo de metodologia de 2 índices', g:'Explica a regra de entrada, saída e peso de cada índice sem abrir o site de novo.',
  f:'Comprar “o índice” achando que é diversificação automática; ignorar concentração em poucos setores.'},
 {id:'V71',d:'Macro & Setor',t:'Ciclo macro × setor',xp:55,cr:18,ach:'Tradutor de Ciclo',
  s:'O encaixe entre a vertente de Economia e a de bolsa: o mesmo juro que muda a Selic muda o múltiplo.',
  st:['Juro real subindo comprime múltiplo, principalmente de empresa de crescimento','Exportadora e câmbio: receita em dólar, custo em real','Varejo e crédito: Selic alta seca a venda parcelada','Utilities e concessão como proxy de renda fixa longa','Commodity e ciclo global: demanda externa manda mais que o governo daqui','Inflação de custo × poder de repasse: quem passa o preço adiante','Onde cada setor sofre no aperto e onde respira no afrouxamento','Usar macro como contexto, não como gatilho de compra','Cuidado: previsão macro tem histórico ruim, inclusive a dos profissionais'],
  wh:[['Banco Central — Relatório de Política Monetária e SGS','https://www.bcb.gov.br/estatisticas/sgs','doc','PT'],['IBGE SIDRA','https://sidra.ibge.gov.br/','doc','PT'],['Juro e múltiplo: a relação explicada',yt('taxa de juros e multiplos de acoes relacao explicada'),'vídeo','PT']],
  bk:[['ilmanen','Regimes macro e prêmios ao longo do tempo']],
  q:'Monte a tabela: para cada setor da tua watchlist, o que acontece com juro subindo, câmbio subindo e inflação de custo. Confira contra um episódio real do passado.',
  dv:'Matriz setor × choque macro', g:'Para cada posição da carteira, tu sabe qual cenário macro é o pior e por quê.',
  f:'Montar carteira inteira apostando num cenário macro; trocar tese de empresa por palpite de Copom.'}
]});

/* ---------- V · CARTEIRA DE RENDA VARIÁVEL ---------- */
SYS.arc('navigation', { id:'ni5', br:'inv', needGate:'ngt5', n:'V · CARTEIRA DE RENDA VARIÁVEL', wk:'Ações · V', sub:'Tamanho, capacidade, execução, FII nível 2, fundo × ETF e os proventos entrando na tesouraria.', nodes:[
 {id:'V65',d:'Carteira RV',t:'Dimensionamento & limites',xp:55,cr:18,ach:'Dono do Tamanho',
  s:'A pergunta não é “compro?”, é “quanto?”. É o tamanho que decide se o erro é lição ou trauma.',
  st:['Tamanho por risco assumido, não por empolgação com a tese','Limite por ativo, por setor e por fator — escrito na IPS','Posição vencedora que virou 30% da carteira: regra de aparar definida antes','Convicção × liquidez × correlação com o resto da carteira','Adicionar na queda só com tese revisada, nunca com esperança','Critério de Kelly como intuição — e por que se usa uma fração dele','Caixa é posição: ficar parado também é decisão','O que fazer quando a tese quebra: sair, reduzir ou reescrever (com data)'],
  wh:[['Dimensionamento de posição e risco de ruína',yt('position sizing risk of ruin kelly fraction explained'),'vídeo','EN'],['CVM — Portal do Investidor','https://www.gov.br/investidor/pt-br','doc','PT']],
  bk:[['ang','Risco por posição e por fator'],['thinkingBets','Tamanho da aposta sob incerteza']],
  q:'Escreva a regra de sizing da tua IPS (limite por ativo, por setor, por fator) e aplique na carteira atual: o que precisa ser aparado hoje?',
  dv:'Regra de sizing + ajuste executado', g:'Todo ativo tem teto escrito e a carteira respeita os limites, inclusive o vencedor.',
  f:'Deixar o vencedor virar a carteira inteira e chamar isso de convicção; dobrar na queda sem revisar nada.'},
 {id:'V66',d:'Carteira RV',t:'Capacidade, liquidez & small caps',xp:50,cr:17,ach:'Medidor de Porta',
  s:'Toda posição tem uma porta de saída. Em ativo pequeno, ela é giratória e estreita.',
  st:['Volume médio diário e o quanto tu consegue comprar sem mover o preço','Regra prática: fatia pequena do volume diário por dia de execução','Spread em ativo ilíquido come retorno antes de começar','Sair é mais difícil que entrar, e é na queda que tu precisa sair','Small cap: prêmio possível, risco de governança e liquidez juntos','Capacidade da estratégia: o que funciona com 50 mil não funciona com 5 milhões','Free float pequeno, controlador dominante e o minoritário no banco de trás','FII pequeno tem o mesmo problema, com menos gente olhando'],
  wh:[['B3 — volume e liquidez','https://www.b3.com.br/','doc','PT'],['Liquidez, capacidade e impacto de mercado',yt('market impact liquidity capacity small cap investing'),'vídeo','EN']],
  bk:[['harris','Liquidez, spread e impacto de ordem']],
  q:'Para cada posição da tua watchlist, calcule quantos dias tu levaria para montar e desmontar sem passar de uma fatia pequena do volume diário.',
  dv:'Tabela de capacidade e saída', g:'Sabe, em dias, quanto custa entrar e sair de cada posição — e recusa as impossíveis.',
  f:'Comprar ilíquido por causa do gráfico; descobrir o spread só na hora de vender.'},
 {id:'V67',d:'Carteira RV',t:'Execução: leilão, book & ordem',xp:50,cr:17,ach:'Mão na Ordem',
  s:'Execução ruim é imposto voluntário. Dá para economizar meio ponto só sabendo como enviar a ordem.',
  st:['Leilão de abertura e de fechamento: quando ajudam e quando atrapalham','Ordem limitada como padrão; a mercado só em ativo muito líquido','Ordem a mercado em ilíquido é doação para quem está do outro lado','Stop: proteção real e a armadilha do gap de abertura','Fracionário × lote padrão: spread e custo diferentes','Liquidez ao longo do dia: pontas e meio do pregão','Corretagem, emolumento e o custo invisível do spread','Registrar preço médio, custos e data para o imposto e para a verdade'],
  wh:[['B3 — tipos de ordem e sessões de negociação','https://www.b3.com.br/','doc','PT'],['Tipos de ordem e execução na prática',yt('tipos de ordem limitada mercado stop leilao B3'),'vídeo','PT']],
  bk:[['harris','Como a ordem vira preço']],
  q:'Execute cinco ordens reais pequenas usando limitada, registre preço de referência, preço obtido e custo total, e compare com o que teria dado a mercado.',
  dv:'Registro de execução de 5 ordens', g:'Mede a própria execução em reais e sabe quando usar leilão ou limitada.',
  f:'Mandar a mercado em FII pequeno no meio do dia; usar stop em ativo que abre com gap.'},
 {id:'V68',d:'Carteira RV',t:'FII nível 2: FFO, laudo & alavancagem',xp:55,cr:18,ach:'Auditor de Cotas',
  s:'Dividend yield de FII é a parte fácil. O resto está no relatório que ninguém abre.',
  st:['FFO e FFO por cota: o resultado que realmente distribui','Laudo de avaliação, valor patrimonial e P/VP com olhar crítico','Cap rate implícito: renda anual sobre o valor de mercado da cota','LTV e alavancagem em fundo de papel: o risco que dobra nos dois sentidos','Contrato típico × atípico, indexador e data de revisional','Vacância física × vacância financeira','Emissões: preço, custo de captação e diluição do cotista','Gestão, taxa e conflito de interesse na compra de ativo','Fundo de fundos: diversificação com uma camada extra de taxa'],
  wh:[['B3 — fundos imobiliários','https://www.b3.com.br/','doc','PT'],['CVM — regulamentos e informes de FII','https://dados.cvm.gov.br/','doc','PT'],['Como ler relatório gerencial de FII a fundo',yt('FFO cap rate implicito LTV FII relatorio gerencial'),'vídeo','PT']],
  q:'Pegue dois FIIs, calcule FFO por cota e cap rate implícito de cada um, e diga qual está pagando renda que ele realmente gera.',
  dv:'Análise nível 2 de dois FIIs', g:'Separa rendimento sustentável de rendimento que vem de ganho pontual ou de alavancagem.',
  f:'Comprar pelo yield do último mês; ignorar LTV em fundo de papel; achar que P/VP baixo é sempre barato.'},
 {id:'V69',d:'Carteira RV',t:'Fundo ativo × ETF',xp:50,cr:17,ach:'Cético de Ranking',
  s:'A pergunta certa não é “esse fundo é bom?”, é “ele é bom depois da taxa, do imposto e da sorte?”.',
  st:['Taxa de administração e de performance com benchmark adequado (e marca d’água)','Persistência: o ranking de ontem prevê muito pouco do amanhã','Viés de sobrevivência: fundos ruins somem da lista','Tracking difference × tracking error no ETF','Come-cotas em fundo aberto × ausência em ETF e ação','Multimercado: o que promete, o que entrega e o custo da promessa','Fundo ativo faz sentido quando: mandato claro, capacidade limitada, gestor investido junto','Custo total de propriedade da carteira, somando tudo'],
  wh:[['CVM — dados abertos de fundos','https://dados.cvm.gov.br/','doc','PT'],['ANBIMA Data','https://data.anbima.com.br/','doc','PT'],['Gestão ativa × passiva: evidência',yt('gestao ativa versus passiva evidencia persistencia fundos'),'vídeo','PT/EN']],
  bk:[['bogle','Custo, persistência e o investidor médio'],['ilmanen','O que sobra de alpha depois dos custos']],
  q:'Compare um fundo ativo que te ofereceram com o ETF equivalente: taxa, benchmark, tracking, imposto e resultado líquido de 5 anos.',
  dv:'Comparativo fundo × ETF em 1 página', g:'Decide com número líquido e sabe dizer o que o gestor precisa entregar só para empatar.',
  f:'Escolher fundo por rentabilidade de 12 meses; comparar fundo com benchmark errado.'},
 {id:'V72',d:'Carteira RV',t:'Proventos como fluxo de caixa',xp:50,cr:17,ach:'Cobrador de Renda',
  s:'O encaixe com a Tesouraria: provento não é presente, é fluxo de caixa com calendário e imposto.',
  st:['Dividendo, JCP e rendimento de FII: tributação e data de crédito diferentes','Data com e data ex: o preço ajusta, o dinheiro só chega depois','Yield on cost: útil para acompanhar, enganoso para decidir','Reinvestir × usar: a conta feita com a IPS na mão, não com vontade','Provento cobrindo custo fixo: a métrica que entra no terminal','Sustentabilidade: payout, capex necessário e dívida','Concentração de renda em poucos pagadores é risco, não renda garantida','Provento não é retorno se o preço cai na mesma proporção'],
  wh:[['Receita Federal — tributação de proventos','https://www.gov.br/receitafederal/pt-br','doc','PT'],['Calendário de proventos e data ex',yt('data com data ex proventos como funciona'),'vídeo','PT']],
  bk:[['bernstein','Renda, retorno total e a diferença que confunde']],
  q:'Monte o calendário de proventos da carteira, projete a renda dos próximos 12 meses e ligue esse número ao indicador de cobertura do custo fixo no terminal.',
  dv:'Calendário de proventos + cobertura', g:'Sabe quanto de renda entra por mês, com imposto, e quanto do teu custo fixo isso paga.',
  f:'Montar carteira perseguindo yield alto; contar provento que depende de lucro não recorrente.'},
 {id:'V70',d:'BOSS',t:'BOSS · Comitê de Investimento de Uma Pessoa',xp:280,cr:95,ach:'Comitê de Um',boss:1,
  s:'Três teses, sizing aplicado, limites respeitados e uma banca fazendo as perguntas chatas.',
  st:['Três fichas de tese completas, incluindo uma que você rejeitou e por quê','Sizing de cada posição com o limite da IPS aplicado','Carteira de renda variável encaixada nas camadas da Tesouraria','Ata: decisão, quem votou contra, e a data de revisão'],
  q:'Apresente o comitê para alguém que entenda de dinheiro: três teses, o tamanho de cada uma, a carteira final dentro dos limites e as perguntas respondidas na hora.',
  dv:'Ata do comitê + carteira de RV com limites', g:'Defende tamanho, não só escolha — e aceita a pergunta “e se tu estiver errado?” com número.',
  f:'Apresentar só as teses que deram certo; montar carteira que estoura o limite da própria IPS.'}
]});

/* ---------- DEBÊNTURES no arco de Renda Fixa (nr2) ---------- */
(function(){
  var arc = SYS.WAYMAP.navigation.arcs.filter(function(a){ return a.id === 'nr2'; })[0];
  if (!arc) { SYS._bad.push('arc:nr2'); return; }
  arc.nodes.push(
 {id:'V49b',d:'Renda Fixa',t:'Debêntures por dentro',xp:50,cr:17,ach:'Leitor de Escritura',
  s:'Emprestar direto para uma empresa, sem FGC no meio. Todo o resto está escrito na escritura.',
  st:['Debênture é dívida direta da empresa: quem paga é o caixa dela, não um fundo garantidor','Escritura de emissão: onde estão prazo, remuneração, garantias e obrigações','Agente fiduciário: o que ele faz, o que ele não faz e como acompanhar','Garantia real, flutuante, quirografária e subordinada — a fila do recebimento','Covenant financeiro (dívida/EBITDA, cobertura de juros) e vencimento antecipado','Tipos: simples, conversível, permutável e perpétua','Remuneração: % do CDI, CDI+, IPCA+ e prefixada','Rating: quem paga pela nota e o que ela não cobre','Assembleia de debenturistas, repactuação e waiver','Recuperação judicial: onde o debenturista senta na mesa'],
  wh:[['CVM — ofertas e documentos da emissão','https://dados.cvm.gov.br/','doc','PT'],['ANBIMA Data — mercado de dívida corporativa','https://data.anbima.com.br/','doc','PT'],['Escritura, garantias e agente fiduciário',yt('debenture escritura agente fiduciario garantias covenant'),'vídeo','PT']],
  bk:[['fortuna','Debêntures: estrutura, garantias e remuneração']],
  q:'Baixe a escritura de uma debênture real, leia garantias, covenants e cláusula de vencimento antecipado, e escreva em uma página o que acontece se a empresa piorar.',
  dv:'Resumo de escritura em 1 página', g:'Diz qual é a garantia, quem executa, em quanto tempo, e em que posição tu recebe.',
  f:'Comprar pela taxa e descobrir que era subordinada; achar que agente fiduciário é sinônimo de proteção.'},
 {id:'V49c',d:'Renda Fixa',t:'Variantes: incentivada, securitização & notas',xp:50,cr:17,ach:'Mapeador de Devedor',
  s:'CRI, CRA, LF, nota comercial e FIDC parecem primos. Só que o devedor muda em cada um.',
  st:['Debênture incentivada (Lei 12.431): isenção para pessoa física e por que o governo criou isso','Infraestrutura, prazo longo e a liquidez que some quando tu precisa','Debênture comum: IR regressivo e comparação por bruto equivalente','CRI e CRA: securitizadora no meio — o devedor real é o cedente ou o sacado','Letra financeira: dívida de banco, prazo mínimo e público-alvo','Nota comercial (commercial paper): prazo curto e menos ritual','FIDC: carteira de recebíveis com cota sênior e subordinada','Onde cada instrumento entra na carteira e em qual camada','Secundário, marcação e o spread entre compra e venda','Sinal de alerta: taxa muito acima do mercado é risco precificado, não sorte'],
  wh:[['Receita Federal — tributação de renda fixa','https://www.gov.br/receitafederal/pt-br','doc','PT'],['CVM — securitização e fundos','https://www.gov.br/cvm/pt-br','doc','PT'],['ANBIMA Data — índices e mercado de crédito','https://data.anbima.com.br/','doc','PT']],
  bk:[['fortuna','Securitização e instrumentos de dívida no Brasil']],
  q:'Monte a tabela comparando cinco instrumentos (debênture comum, incentivada, CRI, LF e nota comercial): quem deve, qual garantia, qual imposto, qual liquidez e qual taxa hoje.',
  dv:'Tabela comparativa de instrumentos de dívida', g:'Para cada um, tu nomeia o devedor real, a garantia e o motivo da diferença de taxa.',
  f:'Tratar CRA como renda fixa sem risco porque é isento; comparar taxa isenta com tributada sem converter.'}
  );
})();

/* ---------- SELOS ---------- */
[
 {id:'ng12',arc:'ni4',n:'Selo · Leitura Profunda',ev:['Relatório de red flags','Ficha de banco e seguradora','Ficha de concessão e commodity','Comparativo varejo × tecnologia','Metodologia de 2 índices','Matriz setor × choque macro'],oral:'Por que P/L não serve para banco, e qual régua serve para cada setor que você estudou?',fail:'Mostre um sinal amarelo encontrado num balanço real e o que ele pode estar escondendo.',ach:'na_g12',xp:240},
 {id:'ng13',arc:'ni5',n:'Selo · Carteira de Renda Variável',ev:['Regra de sizing aplicada','Tabela de capacidade e saída','Registro de execução','Análise nível 2 de FII','Comparativo fundo × ETF','Calendário de proventos','Ata do comitê'],oral:'Qual é o teu limite por ativo e por setor, e o que te faz aparar uma posição vencedora?',fail:'A tese quebrou e o preço subiu. O que você faz, e onde isso está escrito?',ach:'na_g13',xp:260}
].forEach(function(g){ SYS.gate('navigation', g); });
