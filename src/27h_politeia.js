/* ===== VITRUVIANO · POLITEIA (examinadora: Gamma) =====
   Platão, Aristóteles, Tucídides e instituições reais. O P08 (Ética & justiça) veio do arco de Filosofia do Mind. */
SYS.lib({
  justica:{t:'Justice: What’s the Right Thing to Do?',a:'Michael J. Sandel',y:'2009',pt:'Justiça: O Que É Fazer a Coisa Certa (Civilização Brasileira)',w:'vitruviano',note:'Utilitarismo, Kant, Aristóteles e dilemas reais.'},
  politicaAristoteles:{t:'Política',a:'Aristóteles',y:'séc. IV a.C. · domínio público',w:'vitruviano',note:'Livros I, III e IV: o cidadão, os regimes e a constituição mista. A lente do dossiê da Gamma.'},
  tucidides:{t:'História da Guerra do Peloponeso',a:'Tucídides',y:'séc. V a.C. · domínio público',w:'vitruviano',note:'Discurso Fúnebre, Diálogo Meliano e a guerra civil em Córcira: poder, medo e interesse.'},
  constituicao88:{t:'Constituição da República Federativa do Brasil de 1988',a:'Assembleia Nacional Constituinte',y:'1988 · texto atualizado no Planalto',u:'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',w:'vitruviano',note:'Leia os títulos I a IV com o lápis na mão: princípios, direitos, organização do Estado e dos poderes.'}
});

SYS.arc('vitruviano', { id:'po1', br:'pol', n:'I · OS CLÁSSICOS DA PÓLIS', wk:'Politeia · I', sub:'Platão, Aristóteles e Tucídides: justiça, regimes e o poder sem máscara.', nodes:[
 {id:'PO01',d:'Pólis',t:'A República: justiça, a cidade e o governo',xp:45,cr:16,ach:'Kallipolis',
  s:'A cidade como a alma em letras grandes: o que é justiça, quem deve governar e por que a democracia degenera.',
  st:['Livros I e II: Trasímaco e o anel de Giges','Livro IV: as três partes da alma e da cidade','Livros V a VII: o rei-filósofo e a caverna política','Livro VIII: a degeneração dos regimes','O que Platão erra sobre democracia e o que acerta'],
  wh:[['Stanford Encyclopedia — Plato’s Ethics and Politics in The Republic','https://plato.stanford.edu/entries/plato-ethics-politics/','doc','EN'],['Domínio Público','http://www.dominiopublico.gov.br/','site','PT']],
  bk:[['republica','Livros I, II, IV, VII e VIII']],
  q:'Escreva duas páginas aplicando o Livro VIII a uma instituição que você conhece (associação, câmara, empresa).',
  dv:'Duas páginas com citações', g:'Usa o texto, não o resumo, e aponta o limite da analogia.',
  f:'Ler o resumo da caverna e pular a política.'},
 {id:'P08',d:'Filosofia',t:'Ética & justiça',xp:45,cr:16,ach:'Moral Engineer',
  s:'Três lentes para decisões difíceis — no trabalho inclusive.',
  st:['Consequencialismo (utilitarismo)','Deontologia (Kant)','Ética das virtudes','Dilemas (o bonde) e seus limites','Justiça distributiva','Ética em negócios e tecnologia: dados, IA e poder'],
  wh:[['Harvard — Justice with Michael Sandel (grátis)','https://justiceharvard.org/','curso','EN'],['Stanford Encyclopedia — Kant’s Moral Philosophy','https://plato.stanford.edu/entries/kant-moral/','artigo','EN']],
  bk:[['justica','Livro inteiro'],['menteMoralista','Intuições morais']],
  q:'Analise 3 dilemas reais do seu trabalho (clientes, dados, funcionários) pelas 3 lentes.',
  dv:'Casos éticos analisados', g:'Mostra onde as lentes discordam e decide com justificativa.',
  f:'Escolher a teoria que justifica o que você já queria fazer.'},
 {id:'PO02',d:'Pólis',t:'Política de Aristóteles: cidadão, regimes & constituição mista',xp:45,cr:16,ach:'Politeia',
  s:'Seis regimes, o critério do bem comum e a classe média como estabilizador.',
  st:['O ser humano como animal político','Quem é cidadão','Os seis regimes: três retos, três desviados','Constituição mista e o meio-termo','Causas de revolução (Livro V)'],
  wh:[['Stanford Encyclopedia — Aristotle’s Political Theory','https://plato.stanford.edu/entries/aristotle-politics/','doc','EN']],
  bk:[['politicaAristoteles','Livros I, III, IV e V']],
  q:'Classifique três governos reais (atuais ou históricos) pelos seis regimes e justifique com o texto.',
  dv:'Quadro de três governos + justificativas', g:'O critério é o bem comum, não a simpatia.',
  f:'Usar Aristóteles como rótulo de torcida.'},
 {id:'PO03',d:'Pólis',t:'Tucídides: poder, medo & interesse',xp:45,cr:16,ach:'Meliano',
  s:'A guerra contada sem deuses: o Discurso Fúnebre, o Diálogo Meliano e Córcira.',
  st:['A causa mais verdadeira da guerra','O Discurso Fúnebre de Péricles','O Diálogo Meliano: força e justiça','Stasis em Córcira: as palavras mudam de sentido','Tucídides e o realismo nas relações internacionais'],
  wh:[['Stanford Encyclopedia — Thucydides','https://plato.stanford.edu/entries/thucydides/','doc','EN']],
  bk:[['tucidides','Livro I (causas), II (Discurso Fúnebre), III (Córcira), V (Melos)']],
  q:'Reescreva o Diálogo Meliano como uma negociação comercial real e diga o que cada lado poderia ter feito.',
  dv:'Diálogo reescrito + análise', g:'Preserva a lógica do poder e acha uma saída que o original não viu.',
  f:'Moralizar o texto em vez de entender a lógica.'}
]});
SYS.arc('vitruviano', { id:'po2', br:'pol', needGate:'pog1', n:'II · INSTITUIÇÕES REAIS', wk:'Politeia · II', sub:'Da pólis grega para Brasília e Santa Teresa: a Constituição, o município e o dossiê da Gamma.', nodes:[
 {id:'PO04',d:'Instituições',t:'A Constituição de 1988, os três poderes & a federação',xp:50,cr:18,ach:'Carta',
  s:'Quem decide o quê no Brasil, com o texto da Constituição aberto.',
  st:['Princípios fundamentais e direitos (títulos I e II)','Organização do Estado: União, estados e municípios','Os três poderes e os freios entre eles','Processo legislativo: como uma lei nasce','Tribunais de contas e Ministério Público'],
  wh:[['Constituição Federal (Planalto)','https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm','doc','PT'],['Câmara dos Deputados — Como funciona','https://www.camara.leg.br/','site','PT']],
  bk:[['constituicao88','Títulos I a IV']],
  q:'Siga um projeto de lei real do protocolo à votação e desenhe o caminho com datas.',
  dv:'Linha do tempo de um projeto de lei', g:'Cada etapa tem a base constitucional citada.',
  f:'Opinar sobre o STF sem ter lido o artigo que define a competência.'},
 {id:'PO05',d:'Instituições',t:'O município por dentro: câmara, prefeitura & orçamento',xp:50,cr:18,ach:'Polites',
  s:'A instituição mais perto de você: quem decide em Santa Teresa e com qual dinheiro.',
  st:['Lei Orgânica do Município','Câmara de vereadores: sessões e atas','PPA, LDO e LOA: o ciclo do orçamento','Portal da transparência e lei de acesso à informação','Conselhos municipais'],
  wh:[['Portal da Transparência (federal)','https://portaldatransparencia.gov.br/','site','PT'],['Lei de Acesso à Informação','https://www.gov.br/acessoainformacao/pt-br','doc','PT']],
  bk:[],
  q:'Leia a LOA do seu município, ache as três maiores despesas e assista a uma sessão da câmara.',
  dv:'Resumo da LOA + notas da sessão', g:'Números com fonte e uma pergunta concreta que a sessão não respondeu.',
  f:'Concluir sobre o orçamento sem abrir o orçamento.'},
 {id:'PO06',d:'BOSS',t:'BOSS · Dossiê de uma instituição real',xp:280,cr:100,boss:1,ach:'Dossiê da Gamma',
  s:'Chefe da Gamma: o dossiê de uma instituição real pela lente de Aristóteles — regime, cidadãos, bem comum e risco de stasis.',
  st:['Escolher a instituição (câmara, cooperativa, associação, conselho)','Fontes primárias: atas, orçamento, regimento','A lente de Aristóteles: que regime é, de fato','Risco de degeneração e o que o evitaria','Fontes citadas com data'],
  q:'Escreva o dossiê com fontes primárias e apresente as conclusões para alguém que conhece a instituição.',
  dv:'Dossiê com fontes + parecer de quem conhece', g:'Conclusões sustentadas por documento, não por impressão.',
  f:'Dossiê de opinião sem fonte primária.'}
]});
[
 {id:'pog1',arc:'po1',n:'Selo · Os Clássicos da Pólis',ev:['Duas páginas sobre o Livro VIII','Casos éticos pelas três lentes','Quadro de três governos','Diálogo Meliano reescrito'],oral:'Explique a diferença entre regime reto e desviado com um exemplo atual.',fail:'Onde a analogia entre cidade e alma não aguenta?',ach:'vt_po1',xp:200},
 {id:'pog2',arc:'po2',n:'Selo · Instituições Reais',ev:['Linha do tempo de um projeto de lei','Resumo da LOA + sessão','Dossiê com fontes'],oral:'Explique o ciclo PPA, LDO e LOA em dois minutos.',fail:'Que documento você não conseguiu e por quê?',ach:'vt_po2',xp:280,final:1}
].forEach(function(g){ SYS.gate('vitruviano', g); });
