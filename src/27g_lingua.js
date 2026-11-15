/* ===== VITRUVIANO · LINGUA (examinadoras: Beta e Zeta) =====
   O Trivium (Grammatica, Dialectica, Rhetorica) e os idiomas. Lógica, Retórica e Memória vieram da base do Mind
   com os mesmos IDs (P01…P03, P20…P22, P25…P28, ig1, ig5, igs1). */
SYS.lib({
  copiLogica:{t:'Introduction to Logic',a:'Irving M. Copi',y:'edição mais recente',pt:'Introdução à Lógica (Mestre Jou)',w:'vitruviano',note:'Argumentos, validade, falácias e raciocínio indutivo — o clássico.'},
  arteTerRazao:{t:'Die Kunst, Recht zu behalten',a:'Arthur Schopenhauer',y:'póstumo',pt:'A Arte de Ter Razão',w:'vitruviano',note:'38 estratagemas de debate desonesto — para reconhecer, não para usar.'},
  retorica:{t:'Retórica',a:'Aristóteles',y:'séc. IV a.C.',w:'vitruviano',note:'Livro I: ethos, pathos, logos.'},
  adlerRead:{t:'How to Read a Book',a:'Mortimer J. Adler & Charles Van Doren',y:'ed. revista · 1972',pt:'Como Ler Livros',w:'vitruviano',note:'Os quatro níveis de leitura, da inspecional à sintópica. O manual de leitura sério.'},
  thankYouArguing:{t:'Thank You for Arguing',a:'Jay Heinrichs',y:'4ª ed.',w:'vitruviano',note:'Retórica clássica aplicada a discussões modernas.'},
  piramideMinto:{t:'The Pyramid Principle',a:'Barbara Minto',y:'ed. mais recente',w:'vitruviano',note:'Pensar e escrever com a resposta primeiro — o padrão das consultorias.'}
});

SYS.lib({
  writingScience:{t:'Writing Science',a:'Joshua Schimel',y:'2012',w:'vitruviano',note:'Como contar a história de um resultado: o arco OCAR, parágrafo que puxa o próximo, o leitor que não tem tempo.'},
  taeKim:{t:'Guide to Japanese Grammar',a:'Tae Kim',y:'grátis online',u:'https://guidetojapanese.org/learn/',w:'vitruviano',note:'Gramática japonesa explicada como japonês, não como tradução do inglês. Alternativa grátis ao Genki.'},
  genki:{t:'Genki I & II',a:'Eri Banno et al.',y:'3ª ed. · The Japan Times',w:'vitruviano',note:'O livro-texto mais usado para chegar ao N4 com estrutura de curso.'},
  englishPronunciation:{t:'English Pronunciation in Use',a:'Cambridge University Press',y:'níveis Intermediate e Advanced',w:'vitruviano',note:'Sons, acento e entonação, com áudio. Para a boca acompanhar o que o olho já lê.'},
  fluentForever:{t:'Fluent Forever',a:'Gabriel Wyner',y:'2014',w:'vitruviano',note:'Pronúncia primeiro, frases com áudio e imagem no Anki. Serve para o japonês e para o inglês.'},
  wallworkPapers:{t:'English for Writing Research Papers',a:'Adrian Wallwork',y:'2ª ed. · 2016',w:'vitruviano',note:'O inglês dos papers para quem não é nativo: estrutura, abstract e os erros clássicos.'},
  hskStandard:{t:'HSK Standard Course',a:'Jiang Liping (org.)',y:'Beijing Language and Culture University Press',w:'vitruviano',note:'O curso oficial alinhado às provas HSK, nível por nível.'}
});

/* ---------- GRAMMATICA · os quatro idiomas ----------
   Cada idioma tem um primeiro marco e um chefe. As provas oficiais também entram em Marcos › Certificações
   (39u_vitruviano_game.js), com data e nota. O chinês só abre depois do JLPT N4 (reqN). */
SYS.arc('vitruviano', { id:'ln2', br:'lin', n:'GRAMMATICA · JAPONÊS', wk:'Lingua · Grammatica', sub:'O idioma da Onda 1: cultura, mídia e a viagem. Primeiro marco: kana completo e JLPT N5. Chefe: JLPT N2.', nodes:[
 {id:'L05',d:'Japonês',t:'Kana completo: hiragana & katakana',xp:40,cr:14,ach:'Kana',
  s:'Os dois silabários lidos e escritos à mão, antes de qualquer kanji.',
  st:['Hiragana: 46 básicos, dakuten e combinações','Katakana: o mesmo, mais as palavras estrangeiras','Escrita à mão com ordem de traços','Leitura de palavras reais (cardápio, embalagem, jogo)'],
  wh:[['Tae Kim — Guide to Japanese','https://guidetojapanese.org/learn/','livro grátis','EN'],['Anki','https://apps.ankiweb.net/','ferramenta','EN']],
  bk:[['taeKim','Escrita: hiragana e katakana']],
  q:'Kana escrito à mão 10 minutos por dia até ler 100 palavras reais sem tabela.',
  dv:'Caderno de kana + teste de leitura de 100 palavras', g:'Lê os dois silabários sem consulta.',
  f:'Romaji como muleta permanente.'},
 {id:'L06',d:'Japonês',t:'JLPT N5',xp:60,cr:21,
  s:'O primeiro degrau oficial: gramática e kanji básicos.',
  st:['Gramática do N5','Cerca de 100 kanji','Escuta lenta','Simulado oficial'],
  wh:[['JLPT — site oficial','https://www.jlpt.jp/e/','doc','EN'],['WaniKani (kanji, assinatura)','https://www.wanikani.com/','ferramenta','EN']],
  bk:[['genki','Genki I'],['taeKim','Gramática básica']],
  q:'Faça a prova do N5 (ou um simulado oficial completo no tempo) e registre.',
  dv:'Resultado do N5', g:'Aprovado no N5 ou simulado oficial acima da nota de corte.',
  f:'Estudar só kanji e chegar sem escuta.'},
 {id:'L07',d:'Japonês',t:'JLPT N4 · abre o chinês',xp:80,cr:28,ach:'N4',
  s:'Conversação básica e leitura simples. Aprovado aqui, os kanji abrem a porta do chinês.',
  st:['Gramática do N4','Cerca de 300 kanji','Leitura de textos curtos','Simulado oficial'],
  wh:[['JLPT — site oficial','https://www.jlpt.jp/e/','doc','EN']],
  bk:[['genki','Genki II']],
  q:'Faça a prova do N4 e registre.',
  dv:'Resultado do N4', g:'Aprovado no N4.',
  f:'Pular para o chinês antes do N4 e travar nos dois.'},
 {id:'L08',d:'BOSS',t:'BOSS · JLPT N2',xp:350,cr:120,boss:1,ach:'N2',
  s:'Chefe do japonês: ler jornal e entender conversa natural.',
  st:['Gramática do N2','Cerca de 1.000 kanji','Leitura longa no tempo','Escuta em velocidade natural'],
  wh:[['JLPT — site oficial','https://www.jlpt.jp/e/','doc','EN']],
  bk:[],
  q:'Faça a prova do N2 e registre a nota.',
  dv:'Certificado N2', g:'Aprovado no N2.',
  f:'Ficar no conforto do N4 com anime.'}
]});
SYS.arc('vitruviano', { id:'ln1', br:'lin', n:'GRAMMATICA · INGLÊS DE VERDADE', wk:'Lingua · Grammatica', sub:'Onda 3. Você já lê o inglês de internet; aqui é sair dele: escutar sem legenda, falar em voz alta e, por fim, o inglês científico de papers e consultoria. Chefe: C1 oficial.', nodes:[
 {id:'L01',d:'Inglês',t:'Nivelamento honesto: EF SET & a gravação do dia 1',xp:40,cr:14,ach:'Placement Done',
  s:'Medir o que o inglês de internet esconde: a escuta sem legenda e a fala em voz alta.',
  st:['EF SET completo, com a nota de leitura e a de escuta separadas','Gravar 3 minutos falando do seu trabalho, sem roteiro','Ouvir uma palestra técnica de 10 minutos sem legenda e resumir','Listar o que travou: som, vocabulário ou velocidade'],
  wh:[['EF SET (teste grátis)','https://www.efset.org/','ferramenta','EN'],['TED (palestras com transcrição)','https://www.ted.com/talks','site','EN']],
  bk:[['englishPronunciation','Diagnóstico inicial']],
  q:'Faça o EF SET, grave os 3 minutos e o resumo da palestra. Guarde a gravação: ela volta no B2.',
  dv:'Nota do EF SET + gravação do dia 1 + resumo', g:'Resultado registrado em Marcos e um diagnóstico do que trava a escuta e a fala.',
  f:'Fazer só a parte de leitura, que você já domina.'},
 {id:'L02',d:'Inglês',t:'Escuta de verdade & fala em voz alta',xp:45,cr:16,
  s:'O motor da Onda 3: ouvido treinado em velocidade natural e boca acostumada a falar, não só a digitar.',
  st:['Escuta diária sem legenda (podcast, palestra, entrevista) e depois com a transcrição','Shadowing de 5 a 10 minutos','Anki com frases que você ouviu, com áudio','Conversa semanal com tutor ou parceiro de idioma','Gravação quinzenal para comparar'],
  wh:[['Anki — manual','https://docs.ankiweb.net/','doc','EN'],['italki (tutores)','https://www.italki.com/','site','EN']],
  bk:[['fluentForever','Pronúncia e frases com áudio'],['englishPronunciation','Unidades de sons e entonação']],
  q:'8 semanas de escuta diária, shadowing três vezes por semana e uma conversa por semana.',
  dv:'Registro de minutos + gravações da semana 1 e da 8', g:'A gravação da semana 8 é mais fluida que a da 1, e quem conversa com você nota.',
  f:'Ficar só no input e nunca abrir a boca.'},
 {id:'L03',d:'Inglês',t:'Marco B2 & o inglês científico',xp:60,cr:21,
  s:'Discutir trabalho com folga e começar a ler e escrever como a ciência escreve.',
  st:['Conversa de 15 minutos sobre o seu trabalho, sem travar','Um paper por semana, lido em três passadas','Abstract de 200 palavras reescrito no padrão da área','E-mail técnico para alguém de fora','Prova de nível B2 (EF SET de novo ou equivalente)'],
  wh:[['Academic Phrasebank (Universidade de Manchester)','https://www.phrasebank.manchester.ac.uk/','site','EN'],['Cambridge English — níveis CEFR','https://www.cambridgeenglish.org/exams-and-tests/cefr/','doc','EN']],
  bk:[['wallworkPapers','Capítulos sobre abstract e estrutura'],['writingScience','O arco da história']],
  q:'Registre o B2 por prova e escreva um abstract em inglês de um projeto seu.',
  dv:'Resultado B2 + abstract + gravação comparada com a do dia 1', g:'B2 confirmado por prova e um abstract que um leitor de fora entende.',
  f:'Achar que entende série com legenda e chamar de B2.'},
 {id:'L04',d:'BOSS',t:'BOSS · C1 (Cambridge C1 Advanced, IELTS 7 ou TOEFL iBT 5)',xp:300,cr:105,boss:1,ach:'Advanced',
  s:'Chefe do inglês: certificação oficial no nível C1. TOEFL iBT na escala nova de 1 a 6.',
  st:['Escolher a prova pelo uso (consultoria, estudo, trabalho fora)','Simulados no tempo oficial, com a parte oral gravada','Writing corrigido por alguém de fora','Prova feita e nota registrada'],
  wh:[['Cambridge C1 Advanced','https://www.cambridgeenglish.org/exams-and-tests/advanced/','doc','EN'],['IELTS','https://ielts.org/','doc','EN'],['TOEFL iBT','https://www.ets.org/toefl.html','doc','EN']],
  bk:[],
  q:'Faça a prova e registre a nota em Marcos › Certificações.',
  dv:'Certificado C1', g:'C1 oficial: Cambridge C1, IELTS 7 ou TOEFL iBT 5.',
  f:'Remarcar a prova três vezes esperando estar perfeito.'}
]});
SYS.arc('vitruviano', { id:'ln3', br:'lin', n:'GRAMMATICA · CHINÊS', wk:'Lingua · Grammatica', sub:'Fornecedores de hardware e indústria (Artifex, Infomax). Só depois do JLPT N4: pinyin, tons e HSK 1. Chefe: HSK 4.', nodes:[
 {id:'L09',d:'Chinês',t:'Pinyin & tons',xp:45,cr:16,ach:'Four Tones',reqN:['L07'],
  s:'Os quatro tons e o pinyin antes de qualquer frase. Os kanji do japonês ajudam na leitura, não na pronúncia.',
  st:['Iniciais e finais do pinyin','Os quatro tons e o neutro','Sandhi tonal (3º tom)','Pares mínimos de escuta'],
  wh:[['Pleco (dicionário)','https://www.pleco.com/','ferramenta','EN'],['Anki','https://apps.ankiweb.net/','ferramenta','EN']],
  bk:[],
  q:'Grave 50 palavras com tons, compare com o áudio nativo e refaça as erradas.',
  dv:'Gravações + lista de correções', g:'Tons certos em pelo menos 45 de 50.',
  f:'Ignorar os tons achando que o contexto resolve.'},
 {id:'L10',d:'Chinês',t:'HSK 1',xp:60,cr:21,reqN:['L07'],
  s:'O primeiro degrau oficial do chinês.',
  st:['Vocabulário do HSK 1','Gramática básica','Escuta','Simulado oficial'],
  wh:[['Chinese Testing International (HSK)','https://www.chinesetest.cn/','doc','EN']],
  bk:[['hskStandard','HSK 1']],
  q:'Faça a prova do HSK 1 e registre.',
  dv:'Resultado do HSK 1', g:'Aprovado no HSK 1.',
  f:'Estudar caractere sem som.'},
 {id:'L11',d:'BOSS',t:'BOSS · HSK 4',xp:350,cr:120,boss:1,ach:'HSK 4',reqN:['L07'],
  s:'Chefe do chinês: conversar com fornecedor e ler especificação simples.',
  st:['Vocabulário do HSK 4','Leitura de especificação de produto','Conversa de negociação simples','Simulado oficial'],
  wh:[['Chinese Testing International (HSK)','https://www.chinesetest.cn/','doc','EN']],
  bk:[['hskStandard','HSK 4']],
  q:'Faça a prova do HSK 4 e registre a nota.',
  dv:'Certificado HSK 4', g:'Aprovado no HSK 4.',
  f:'Abandonar no platô do HSK 3.'}
]});
SYS.arc('vitruviano', { id:'ln4', br:'lin', n:'GRAMMATICA · PORTUGUÊS', wk:'Lingua · Grammatica', sub:'Maestria: redação, retórica e escrita técnica. Uma redação por semana na grade do ENEM.', nodes:[
 {id:'L12',d:'Português',t:'Uma redação por semana na grade do ENEM',xp:50,cr:18,ach:'Redator',
  s:'Escrever toda semana e corrigir pelas cinco competências, com nota por competência.',
  st:['As cinco competências e o que cada uma cobra','Estrutura: introdução, dois desenvolvimentos, conclusão com proposta','Repertório legitimado','Correção própria com a grade e correção de fora'],
  wh:[['INEP — redação do ENEM (cartilha do participante)','https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem','doc','PT']],
  bk:[],
  q:'Oito redações em oito semanas, cada uma corrigida pela grade, com a nota por competência registrada.',
  dv:'Oito redações + planilha de notas', g:'A nota sobe nas competências mais fracas.',
  f:'Escrever sem corrigir; decorar modelo pronto.'},
 {id:'L13',d:'BOSS',t:'BOSS · Nota máxima em todas as competências',xp:300,cr:105,boss:1,ach:'Mil',
  s:'Chefe do português: uma redação com nota máxima nas cinco competências, corrigida por alguém de fora.',
  st:['Tema sorteado no tempo oficial','Correção cega por alguém que conhece a grade','As cinco competências no máximo'],
  q:'Escreva no tempo, peça correção cega e registre.',
  dv:'Redação + correção', g:'Nota máxima nas cinco competências.',
  f:'Escolher o tema que você já treinou.'}
]});

SYS.arc('vitruviano', { id:'i1', br:'lin', n:'DIALECTICA · LÓGICA & PENSAMENTO CRÍTICO', wk:'Lingua · Dialectica I', sub:'Argumentos, vieses e epistemologia prática.', nodes:[
 {id:'P01',d:'Lógica',t:'Argumentos & falácias',xp:40,cr:14,ach:'Fallacy Hunter',
  s:'Separar o que foi provado do que só foi dito com confiança.',
  st:['Premissas e conclusão','Validade vs solidez','Dedução, indução e abdução','Falácias: espantalho, ad hominem, falso dilema, apelo à autoridade…','Steelman: a versão mais forte do argumento contrário','Diagramar argumentos'],
  wh:[['Your Logical Fallacy Is','https://yourlogicalfallacyis.com/','site','EN'],['Khan Academy — Wireless Philosophy','https://www.khanacademy.org/humanities/philosophy','curso','EN'],['Stanford Encyclopedia of Philosophy','https://plato.stanford.edu/','doc','EN']],
  bk:[['copiLogica','Capítulos iniciais e falácias'],['arteTerRazao','38 estratagemas (para reconhecer)']],
  q:'Analise 5 argumentos reais (notícia, post, reunião): premissas, conclusão, falácias e versão steelman.',
  dv:'Caderno de 5 análises', g:'Cada análise tem diagrama e steelman honesto.',
  f:'Usar nome de falácia como xingamento; atacar só a pior versão do outro lado.'},
 {id:'P02',d:'Lógica',t:'Vieses cognitivos & heurísticas',xp:45,cr:16,ach:'Bias Aware',
  s:'O cérebro economiza energia — e cobra juros em decisões ruins.',
  st:['Sistema 1 e Sistema 2','Disponibilidade, ancoragem, representatividade','Viés de confirmação','Excesso de confiança (e as ressalvas sobre Dunning-Kruger)','Custo afundado','Crise de replicação: nem todo efeito famoso se sustenta'],
  wh:[['Crash Course Psychology',yt('Crash Course Psychology cognition biases'),'vídeo','EN'],['Farnam Street — Mental Models','https://fs.blog/mental-models/','artigo','EN']],
  bk:[['rapidoDevagar','Partes I e II'],['scoutMindset','Livro inteiro']],
  q:'Registre 10 decisões da semana e marque o viés mais provável em cada.',
  dv:'Diário de vieses', g:'Identifica 3 padrões pessoais recorrentes.',
  f:'Ver viés só nos outros; tratar psicologia pop como lei da física.'},
 {id:'P03',d:'Lógica',t:'Epistemologia prática & ciência',xp:45,cr:16,ach:'Falsifiable',
  s:'Crenças com grau de confiança — e disposição para atualizar.',
  st:['Crença justificada','Falsificabilidade (Popper)','Ceticismo razoável vs cinismo','Correlação ≠ causalidade','Probabilidade e atualização bayesiana (intuição)','Previsões calibradas','Kit de detecção de bobagem (Sagan)'],
  wh:[['Stanford Encyclopedia — Karl Popper','https://plato.stanford.edu/entries/popper/','artigo','EN'],['3Blue1Brown — Teorema de Bayes',yt('3Blue1Brown Bayes theorem'),'vídeo','EN']],
  bk:[['mundoAssombrado','Kit de detecção de bobagem'],['superforecasting','Calibração']],
  q:'Faça 20 previsões com probabilidade para os próximos 3 meses e depois pontue sua calibração.',
  dv:'Planilha de previsões + pontuação', g:'Sabe, com números, se é otimista ou pessimista demais.',
  f:'“Eu sabia” retroativo; previsões vagas impossíveis de errar.'}
]});

SYS.arc('vitruviano', { id:'ld2', br:'lin', needGate:'ig1', n:'DIALECTICA · DEMONSTRAÇÃO', wk:'Lingua · Dialectica II', sub:'Lógica formal e prova. Sobe junto com a Mathematica: ranks I e II, demonstrações curtas; ranks III e IV, solução dissertativa no padrão do ITA. O chefe da Dialectica é o diálogo socrático da Alpha (P23).', nodes:[
 {id:'L14',d:'Lógica',t:'Lógica proposicional e de predicados',xp:45,cr:16,ach:'Quantifier',
  s:'Escrever o que se afirma sem ambiguidade: conectivos, quantificadores e negação.',
  st:['Tabela-verdade e equivalências','Implicação, contrapositiva e recíproca','Quantificadores e a negação deles','Tradução entre português e lógica'],
  wh:[['Book of Proof (grátis)','https://richardhammack.github.io/BookOfProof/','livro grátis','EN']],
  bk:[['bookOfProof','Capítulos 2 e 3'],['copiLogica','Lógica simbólica']],
  q:'Traduza 20 frases do seu dia (contratos, regras da loja, notícias) para lógica e ache as ambíguas.',
  dv:'20 traduções + as ambiguidades achadas', g:'Nega corretamente frases com quantificador.',
  f:'Confundir implicação com equivalência.'},
 {id:'L15',d:'Lógica',t:'Demonstração: direta, por contradição e por indução',xp:50,cr:18,ach:'Q.E.D.',
  s:'Ler e escrever demonstrações curtas: o nível dos ranks I e II da Mathematica.',
  st:['Prova direta','Contrapositiva e contradição','Indução matemática','Contraexemplo','Escrever a prova para outra pessoa ler'],
  wh:[['Book of Proof (grátis)','https://richardhammack.github.io/BookOfProof/','livro grátis','EN']],
  bk:[['bookOfProof','Capítulos 4 a 10'],['howToProve','Capítulo 3']],
  q:'Escreva 15 demonstrações curtas (5 de cada tipo) e peça para alguém achar o furo.',
  dv:'15 demonstrações revisadas', g:'Cada passo justificado; nenhuma prova por exemplo.',
  f:'Provar com três casos e chamar de indução.'},
 {id:'L16',d:'BOSS',t:'BOSS · Solução dissertativa no padrão do ITA',xp:260,cr:90,boss:1,ach:'Dissertativa',
  s:'Ranks III e IV: resolver questões dissertativas de matemática e física do ITA com solução completa, corrigida por rubrica.',
  st:['Rubrica: enunciado entendido, estratégia, execução, conclusão','Questões antigas do ITA no tempo','Correção cega pela rubrica','Registro de erros por tipo'],
  wh:[['Vestibular ITA — provas anteriores','https://vestibular.ita.br/','doc','PT']],
  bk:[],
  q:'Resolva 10 dissertativas de provas antigas no tempo e corrija pela rubrica.',
  dv:'10 soluções + rubrica preenchida', g:'Média ≥ 70% da rubrica e cada solução legível por outra pessoa.',
  f:'Resposta certa sem justificativa.'}
]});

SYS.arc('vitruviano', { id:'i5', br:'lin', n:'RHETORICA · RETÓRICA & ESCRITA DE IDEIAS', wk:'Lingua · Rhetorica I', sub:'Retórica clássica, pensamento estruturado, ensaio e debate.', nodes:[
 {id:'P20',d:'Retórica',t:'Retórica clássica',xp:40,cr:14,ach:'Ethos Pathos Logos',
  s:'Credibilidade, emoção e lógica — no pitch e na defesa de arquitetura.',
  st:['Ethos, pathos, logos','Kairos: o momento certo','Estrutura de discurso','Figuras de linguagem com função','Retórica em vendas, pitch e defesa técnica'],
  wh:[['Stanford Encyclopedia — Aristotle’s Rhetoric','https://plato.stanford.edu/entries/aristotle-rhetoric/','artigo','EN']],
  bk:[['retorica','Livro I'],['thankYouArguing','Retórica aplicada']],
  q:'Reescreva um pitch seu (produto ou retainer) equilibrando ethos, pathos e logos.',
  dv:'Pitch antes/depois com anotações', g:'Aponta cada apelo e por que está ali.',
  f:'Só hype (pathos) ou só planilha (logos) sem história.'},
 {id:'P21',d:'Retórica',t:'Pensamento estruturado (Pirâmide)',xp:45,cr:16,ach:'Pyramid Mind',
  s:'A resposta na primeira linha.',
  st:['Resposta primeiro, argumentos depois','Agrupamento MECE','Situação → complicação → pergunta → resposta','Títulos que afirmam','Memo de 1 página'],
  wh:[['Pyramid Principle explicado',yt('Barbara Minto pyramid principle explained'),'vídeo','EN']],
  bk:[['piramideMinto','Livro inteiro']],
  q:'Transforme 3 mensagens longas de trabalho em memos em pirâmide.',
  dv:'3 memos antes/depois', g:'Um leitor apressado entende a decisão pedida na primeira linha.',
  f:'Contar a história cronológica inteira antes de dizer o que quer.'},
 {id:'P22',d:'Retórica',t:'Ensaio & debate',xp:50,cr:18,ach:'Essayist',
  s:'Pensar escrevendo e mudar de ideia em público com elegância.',
  st:['Ensaio à Montaigne','Tese, contra-argumento e síntese','Steelman escrito','Debate estruturado: tempo, réplica e tréplica','Mudar de ideia sem perder a dignidade'],
  wh:[['Paul Graham — ensaios','https://paulgraham.com/articles.html','artigo','EN']],
  bk:[['montaigne','Ensaios selecionados'],['arteTerRazao','Estratagemas para reconhecer em debates']],
  q:'Publique um ensaio de 1.500 palavras e faça um debate de 30 min sobre o tema com alguém que discorda.',
  dv:'Ensaio publicado + notas do debate', g:'Incorporou pelo menos 1 objeção forte numa versão revisada.',
  f:'Debate como luta de ego; ensaio sem nenhum contra-argumento.'}
]});

SYS.arc('vitruviano', { id:'lr2', br:'lin', needGate:'ig5', n:'RHETORICA · ESCRITA CIENTÍFICA', wk:'Lingua · Rhetorica II', sub:'Da redação do ENEM ao relatório de cada Prova e, por fim, ao preprint do Opus Publicum. O preprint é o sétimo texto deste formato, não o primeiro.', nodes:[
 {id:'L17',d:'Retórica',t:'Escrita técnica e científica: pergunta, método, resultado, limitação',xp:50,cr:18,ach:'Methods Section',
  s:'O formato que o Garden usa para tudo que mede: o leitor sabe o que foi perguntado, como, o que deu e onde pode estar errado.',
  st:['A pergunta numa frase','Método que outra pessoa repete','Resultado com figura que diz a conclusão','Limitações escritas antes de alguém apontar','Próximo passo'],
  wh:[['Simon Peyton Jones — How to Write a Great Research Paper',yt('Simon Peyton Jones How to Write a Great Research Paper'),'vídeo','EN']],
  bk:[['writingScience','O arco da história'],['craftResearch','Da pergunta ao argumento']],
  q:'Reescreva um relatório antigo seu (da loja ou de um projeto) no formato e peça leitura a alguém de fora.',
  dv:'Relatório reescrito + comentário do leitor', g:'O leitor repete o método sem perguntar nada.',
  f:'Esconder a limitação no último parágrafo.'},
 {id:'L18',d:'BOSS',t:'BOSS · O mini-artigo da Prova',xp:240,cr:85,boss:1,ach:'Mini-Artigo',
  s:'Até duas páginas: pergunta, método, resultado, limitações e próximo passo. Toda Prova da Mathematica fecha com um destes.',
  st:['Duas páginas no máximo','Figuras geradas por script','Revisão por alguém de fora','Versão final anexada à Prova'],
  q:'Entregue o mini-artigo da sua primeira Prova da Mathematica, revisado.',
  dv:'Mini-artigo da Prova I', g:'Cabe em duas páginas e outra pessoa entende o resultado.',
  f:'Escrever o texto depois que todo mundo esqueceu o projeto.'}
]});

SYS.arc('vitruviano', { id:'is1', br:'lin', side:1, needGate:'ig1', n:'ARCO LATERAL · MEMÓRIA & APRENDIZAGEM', wk:'Lingua · lateral', sub:'Aprender com método testado: espaçamento, recuperação e leitura analítica.', nodes:[
 {id:'P25',d:'Aprendizagem',t:'Repetição espaçada com Anki',xp:50,cr:18,ach:'Curva Domada',
  s:'Revisar na hora em que você está prestes a esquecer é o truque mais barato que existe.',
  st:['Curva do esquecimento e por que espaçar funciona','Cartão atômico: uma ideia por cartão, resposta curta','Cloze x frente-verso; quando cada um serve','Nunca decorar o que você não entendeu — primeiro entenda, depois memorize','Baralho pequeno e vivo: deletar cartão ruim é progresso','Rotina de 10 min/dia (e o que fazer quando acumulou 400 revisões)','Medir retenção de verdade: teste escrito, não sensação'],
  wh:[['Anki — manual oficial','https://docs.ankiweb.net/','doc','EN'],['Gwern — Spaced Repetition','https://gwern.net/spaced-repetition','artigo','EN']],
  bk:[['fixeConhecimento','Espaçamento e prática de recuperação']],
  q:'Monte um baralho de 100 cartões atômicos sobre um tema seu e mantenha 30 dias de revisão diária.',
  dv:'Baralho + estatísticas de 30 dias', g:'Retenção verificada por um teste escrito no fim, não pelo app.',
  f:'Baixar baralho de 8.000 cartões pronto e abandonar na terceira noite.'},
 {id:'P26',d:'Aprendizagem',t:'Prática de recuperação, intercalação & espaçamento',xp:50,cr:18,ach:'Recuperação Ativa',
  s:'Testar-se é estudar; reler é sensação de estudar.',
  st:['Efeito de teste: puxar da memória fixa mais do que reler','Intercalação x blocos: misturar tipos de problema','Prática distribuída: 4 sessões de 30 min batem 1 de 2 h','Dificuldade desejável: se está fácil demais, não está aprendendo','Feedback atrasado e por que ele às vezes ajuda','Ilusões de fluência: grifar, reler, assistir a vídeo em 2x','Montar um protocolo de estudo para um tema difícil e segui-lo'],
  wh:[['Retrieval Practice — recursos','https://www.retrievalpractice.org/','site','EN'],['The Learning Scientists','https://www.learningscientists.org/','site','EN']],
  bk:[['fixeConhecimento','As técnicas com evidência']],
  q:'Aplique o protocolo (recuperação + intercalação + espaçamento) a um tema por 3 semanas e compare com seu método antigo em um teste igual.',
  dv:'Protocolo + dois resultados de teste', g:'Comparação honesta: mesma prova, condições parecidas.',
  f:'Reler o resumo 6 vezes e jurar que “fixou”.'},
 {id:'P27',d:'Aprendizagem',t:'Leitura analítica (Adler & Van Doren)',xp:45,cr:16,ach:'Quatro Níveis',
  s:'Ler um livro difícil é uma conversa — e você precisa saber fazer perguntas.',
  st:['Os quatro níveis: elementar, inspecional, analítico, sintópico','Leitura inspecional em 20 min: sumário, índice, conclusão, amostragem','Perguntas ao livro: do que trata? o que diz? é verdade? e daí?','Resumir a tese do autor em uma frase antes de discordar','Concordar/discordar com fundamento (e o direito de suspender o juízo)','Leitura sintópica: 4 livros sobre o mesmo tema, em conversa','Fichar sem copiar: reformular com suas palavras'],
  wh:[['Como ler um livro — método de Adler',yt('how to read a book adler analytical reading'),'vídeo','EN']],
  bk:[['adlerRead','Os quatro níveis'],['scoutMindset','Ler para entender, não para vencer']],
  q:'Faça leitura analítica completa de um livro difícil e leitura sintópica de 4 fontes sobre um tema, entregando um mapa comparativo.',
  dv:'Ficha analítica + mapa sintópico', g:'O mapa mostra onde os autores concordam, discordam e por quê.',
  f:'Ler 4 livros que dizem a mesma coisa e chamar de pesquisa.'},
 {id:'P28',d:'BOSS',t:'BOSS · Aprender algo difícil em 30 dias',xp:260,cr:90,boss:1,ach:'Aprendiz Provado',
  s:'Prova de que o método funciona: um teste no dia 0 e outro no dia 30.',
  st:['Definir o teste objetivo antes de começar','30 dias com espaçamento e recuperação','Comparar resultados e explicar'],
  q:'Escolha um tema difícil, crie um teste objetivo no dia 0, estude 30 dias com o protocolo e refaça o mesmo teste; entregue os dois resultados.',
  dv:'Teste inicial + final + protocolo', g:'Ganho demonstrado no mesmo teste, com o log de estudo do período.',
  f:'Escolher o teste depois de estudar, para garantir que “foi bem”.'}
]});

[
 {id:'lng1',arc:'ln1',n:'Selo · Inglês',ev:['EF SET e gravação do dia 1','8 semanas de escuta e fala','B2 e o primeiro abstract','C1 oficial'],oral:'Explique em inglês, por dois minutos, um projeto seu do SGM-Opus.',fail:'Em que situação você ainda abre o tradutor?',ach:'vt_ln1',xp:300},
 {id:'lng2',arc:'ln2',n:'Selo · Japonês',ev:['Kana à mão','N5','N4','N2'],oral:'Leia em voz alta um trecho de notícia simples.',fail:'Qual parte da escuta ainda some quando a fala acelera?',ach:'vt_ln2',xp:350},
 {id:'lng3',arc:'ln3',n:'Selo · Chinês',ev:['50 tons gravados','HSK 1','HSK 4'],oral:'Peça um orçamento simples a um fornecedor em chinês.',fail:'Qual tom você ainda troca?',ach:'vt_ln3',xp:350},
 {id:'lng4',arc:'ln4',n:'Selo · Português',ev:['Oito redações corrigidas','Nota máxima nas cinco competências'],oral:'Defenda a sua proposta de intervenção em um minuto.',fail:'Qual competência cai primeiro quando o tempo aperta?',ach:'vt_ln4',xp:250},
 {id:'ldg2',arc:'ld2',n:'Selo · Demonstração',ev:['20 traduções para lógica','15 demonstrações revisadas','10 dissertativas pela rubrica'],oral:'Demonstre por indução uma fórmula que eu escolher.',fail:'Qual furo apareceu numa prova sua e como você viu?',ach:'vt_ld2',xp:220},
 {id:'lrg2',arc:'lr2',n:'Selo · Escrita Científica',ev:['Relatório reescrito e lido por alguém de fora','Mini-artigo da Prova I'],oral:'Resuma um mini-artigo seu em quatro frases: pergunta, método, resultado, limitação.',fail:'Qual limitação você quase deixou de fora?',ach:'vt_lr2',xp:200}
].forEach(function(g){ SYS.gate('vitruviano', g); });

[
 {id:'ig1',arc:'i1',n:'Selo I · Lógica',ev:['Caderno de 5 análises','Diário de vieses','Planilha de previsões'],oral:'Faça o steelman de uma posição que você detesta.',fail:'Qual viés mais distorce suas decisões e qual regra você criou contra ele?',ach:'mi_g1',xp:100},
 {id:'ig5',arc:'i5',n:'Selo V · Retórica',ev:['Pitch anotado','3 memos em pirâmide','Ensaio publicado + debate'],oral:'Defenda uma ideia em 2 minutos com a resposta primeiro.',fail:'Qual objeção ao seu ensaio você ainda não respondeu bem?',ach:'mi_g5',xp:150},
 {id:'igs1',arc:'is1',n:'Selo Lateral · Memória',ev:['Baralho de 100 cartões + 30 dias','Protocolo aplicado com comparação','Ficha analítica + mapa sintópico','Boss 30 dias'],oral:'Explique por que reler é a ilusão de estudo mais comum.',fail:'Qual assunto você “aprendeu” e esqueceu em 2 semanas?',ach:'mi_s1',xp:220}
].forEach(function(g){ SYS.gate('vitruviano', g); });

SYS.shop('vitruviano', [
 {id:'mi_x1',tier:'common',br:'lin',n:'Fichas e canetas para cartões físicos',c:20,rule:'até R$ 50',rep:1,lim:'mês'},
 {id:'mi_x2',tier:'uncommon',br:'lin',n:'AnkiMobile (iOS) ou doação ao projeto Anki',rule:'confira o valor atual',req:'n_P25'},
 {id:'mi_x3',tier:'uncommon',br:'lin',n:'Livro: Como Ler Livros — Mortimer J. Adler & Charles Van Doren',rule:'até R$ 150',req:'n_P27'},
 {id:'mi_x4',tier:'uncommon',br:'lin',n:'Livro: Fixe o Conhecimento (Make It Stick) — Brown, Roediger & McDaniel',rule:'até R$ 150',req:'n_P26'}
]);
