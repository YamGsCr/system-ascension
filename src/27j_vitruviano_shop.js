/* ===== VITRUVIANO · Loja das vertentes (preço e XP mínimo calculados pelo tier quando omitidos) =====
   A Harmonia já tem a loja do antigo Ars (27d) e a Philosophia e a Lingua herdaram a do Mind (27f, 27g, 37).
   Aqui entram a Mathematica e a Politeia, o que faltava na Lingua, no piano da Harmonia e no Shadow.
   O crédito (VTR) é um só para os cinco domínios; o XP mínimo de item com vertente é medido nela.
   req 'op_<n>': a linha n da lista de compras do SGM-Opus precisa estar liberada (85_opus.js). */

/* ---------- MATHEMATICA ---------- */
SYS.shop('vitruviano', [
 {id:'vm1',tier:'common',br:'mat',n:'Caderno de problemas (quadriculado) + lapiseira 0,5',c:40,rule:'até R$ 50',rep:1,lim:'mês'},
 {id:'vm2',tier:'common',br:'mat',n:'Canetas de cores e marca-texto para resolver no papel',c:25,rule:'até R$ 35',rep:1,lim:'mês'},
 {id:'vm3',tier:'common',br:'mat',n:'Pôster: identidades trigonométricas e tabela de transformadas',c:45,rule:'até R$ 70',req:'n_MT01'},
 {id:'vm4',tier:'uncommon',br:'mat',n:'Quadro branco de parede 60 × 90 cm + marcadores e apagador',rule:'até R$ 220',req:'n_MT01'},
 {id:'vm5',tier:'uncommon',br:'mat',n:'Calculadora científica simples (ex.: Casio fx-82 ou fx-991)',d:'Para conferir conta, não para pensar por você. Nas provas do ITA e do ENEM ela não entra.',rule:'até R$ 180',req:'n_MT01'},
 {id:'vm6',tier:'uncommon',br:'mat',n:'Livro: Think Stats ou Think Bayes impresso',rule:'até R$ 250',req:'n_MT08'},
 {id:'vm7',tier:'rare',br:'mat',n:'Quadro branco profissional: vidro temperado ou 120 × 90 cm com moldura de alumínio',d:'O quadro de quem já escreve demonstração inteira de pé.',rule:'até R$ 900',cd:72,req:'n_MT05'},
 {id:'vm8',tier:'rare',br:'mat',n:'Calculadora gráfica (ex.: TI-84 Plus CE ou Casio fx-CG50)',d:'Explorar função, série e transformada na mão antes de abrir o notebook.',rule:'até R$ 1.200',cd:72,req:'n_MT10'},
 {id:'vm9',tier:'rare',br:'mat',n:'Livro: Introduction to Linear Algebra (Gilbert Strang)',rule:'até R$ 450',req:'n_MT11'},
 {id:'vm10',tier:'rare',br:'mat',n:'Taxa de inscrição no ITA como treineiro (ou outra prova da calibração)',d:'Chefe é medição: a taxa paga a régua, não a aprovação.',rule:'taxa oficial do edital',req:'n_MT10'},
 {id:'vm11',tier:'epic',br:'mat',n:'Livro: Understanding Digital Signal Processing (Richard Lyons)',rule:'até R$ 700',req:'n_MT16'},
 {id:'vm12',tier:'epic',br:'mat',n:'Licença pessoal do MATLAB Home ou do Wolfram Mathematica',d:'Python resolve quase tudo; isto é para conferir resultado e rodar código que vem com paper.',rule:'confira o valor atual',cd:72,req:'n_MT20'},
 {id:'vm13',tier:'epic',br:'mat',n:'Bancada de estudo: mesa ampla + luminária de luz neutra regulável',rule:'até R$ 1.800',cd:168,req:'n_MT15'},
 {id:'vm14',tier:'legendary',br:'mat',n:'Livro: The Micro-Doppler Effect in Radar (Victor C. Chen)',d:'O livro-alvo do rank VI.',rule:'até R$ 1.200',seals:2,cd:168,req:'n_MT25'},
 {id:'vm15',tier:'legendary',br:'mat',n:'Visita a um museu ou laboratório de ciência (ex.: Catavento, Museu do Amanhã, observatório)',rule:'orçamento separado',seals:2,cd:168,req:'n_MT25'},
 {id:'vm16',tier:'mythic',br:'mat',n:'Inscrição num congresso científico para apresentar o dataset (ex.: SBrT, IEEE Radar)',d:'O Opus Publicum sai do quarto.',rule:'orçamento separado + reserva intacta',seals:3,cd:336,req:'n_MT35'},
 {id:'vm17',tier:'common',br:'mat',n:'Livro: O Homem que Calculava (Malba Tahan)',d:'Beremiz resolvendo problema no deserto. Leitura de cabeceira.',c:30,rule:'até R$ 50'},
 {id:'vm18',tier:'common',br:'mat',n:'Livro: O Último Teorema de Fermat (Simon Singh)',d:'350 anos atrás de uma demonstração, contados como suspense.',c:35,rule:'até R$ 70'},
 {id:'vm19',tier:'common',br:'mat',n:'Livro: Planolândia (Edwin A. Abbott)',d:'Um quadrado descobre a terceira dimensão. Curto e genial.',c:25,rule:'até R$ 50'},
 {id:'vm20',tier:'uncommon',br:'mat',n:'Livro: A Arte de Resolver Problemas (George Pólya)',d:'Entender, planejar, executar e revisar: o método de quem resolve.',rule:'até R$ 120',req:'n_MT01'},
 {id:'vm21',tier:'uncommon',br:'mat',n:'Coleção Fundamentos de Matemática Elementar (Iezzi): os volumes de álgebra e trigonometria',d:'O clássico de quem mira engenharia, com lista para mais de um ano.',rule:'até R$ 350',req:'n_MT01'},
 {id:'vm22',tier:'uncommon',br:'mat',n:'Livro: Tópicos de Física, volume 1',rule:'até R$ 250',req:'n_MT02'},
 {id:'vm23',tier:'uncommon',br:'mat',n:'Livro: Book of Proof (Richard Hammack) impresso',d:'O PDF é grátis; o impresso aguenta lápis e café.',rule:'até R$ 150',req:'n_MT05'},
 {id:'vm24',tier:'rare',br:'mat',n:'Livro: Um Curso de Cálculo, volume 1 (Guidorizzi) ou Cálculo, volume 1 (Stewart)',rule:'até R$ 400',req:'n_MT06'},
 {id:'vm25',tier:'rare',br:'mat',n:'Livro: Curso de Física Básica, volume 1 (Moysés Nussenzveig)',rule:'até R$ 300',req:'n_MT07'},
 {id:'vm26',tier:'rare',br:'mat',n:'Livro: Introduction to Probability (Blitzstein & Hwang) impresso',d:'Grátis online; o impresso é para riscar.',rule:'até R$ 500',req:'n_MT08'},
 {id:'vm27',tier:'rare',br:'mat',n:'Livro: How to Prove It (Daniel Velleman)',rule:'até R$ 400',req:'n_MT10'},
 {id:'vm28',tier:'rare',br:'mat',n:'Livro: O Que É Matemática? (Richard Courant & Herbert Robbins)',d:'Números, geometria, topologia e cálculo, sem pressa e sem decoreba.',rule:'até R$ 350',req:'n_MT10'},
 {id:'vm29',tier:'rare',br:'mat',n:'Livro: Curso de Física Básica, volume 2 (fluidos, oscilações, ondas e calor)',rule:'até R$ 300',req:'n_MT12'},
 {id:'vm30',tier:'rare',br:'mat',n:'Livro: Mathematics for Machine Learning (Deisenroth, Faisal & Ong) impresso',rule:'até R$ 400',req:'n_MT13'},
 {id:'vm31',tier:'rare',br:'mat',n:'Livro: Linear Algebra Done Right (Sheldon Axler) impresso',d:'A outra visão: espaços vetoriais antes das matrizes. O PDF é livre.',rule:'até R$ 450',req:'n_MT15'},
 {id:'vm32',tier:'rare',br:'mat',n:'Livro: Fundamentos de Física, volume 3 (Halliday, Resnick & Walker)',rule:'até R$ 350',req:'n_MT22'},
 {id:'vm33',tier:'epic',br:'mat',n:'Livro: Gödel, Escher, Bach (Douglas Hofstadter)',d:'Lógica, música e consciência num tijolo só. A ponte entre a Mathematica e a Harmonia.',rule:'até R$ 250',cd:72,req:'n_MT15'},
 {id:'vm34',tier:'epic',br:'mat',n:'Livro: Signals and Systems (Oppenheim & Willsky)',rule:'até R$ 900',cd:72,req:'n_MT16'},
 {id:'vm35',tier:'epic',br:'mat',n:'Livro: Visual Complex Analysis (Tristan Needham)',d:'Números complexos desenhados. Depois dele, Fourier faz sentido com os olhos.',rule:'até R$ 600',cd:72,req:'n_MT16'},
 {id:'vm36',tier:'epic',br:'mat',n:'Livro: Equações Diferenciais Elementares e Problemas de Valores de Contorno (Boyce & DiPrima)',rule:'até R$ 450',cd:72,req:'n_MT21'},
 {id:'vm37',tier:'epic',br:'mat',n:'Livro: Pattern Recognition and Machine Learning (Christopher Bishop) impresso',rule:'até R$ 1.000',cd:72,req:'n_MT28'},
 {id:'vm38',tier:'rare',br:'mat',n:'Livro: The Craft of Research (Booth, Colomb, Williams & Bizup)',d:'Da pergunta ao argumento: o manual de quem vai escrever o preprint.',rule:'até R$ 250',req:'n_MT31'},
 {id:'vm39',tier:'legendary',br:'mat',n:'Livro: Estimation with Applications to Tracking and Navigation (Bar-Shalom, Li & Kirubarajan)',d:'O livro de rastreamento que fica na mesa de quem faz radar.',rule:'até R$ 1.500',seals:2,cd:168,req:'n_MT24'},
 {id:'vm40',tier:'legendary',br:'mat',n:'Livro: A Wavelet Tour of Signal Processing (Stéphane Mallat)',rule:'até R$ 1.200',seals:2,cd:168,req:'n_MT26'},
 {id:'vm41',tier:'legendary',br:'mat',n:'Livro: Antenna Theory (Constantine Balanis)',rule:'até R$ 1.200',seals:2,cd:168,req:'n_MT27'}
]);

/* ---------- HARMONIA · o piano e o que faltava ---------- */
SYS.shop('vitruviano', [
 {id:'vh1',tier:'common',br:'har',n:'Metrônomo de pêndulo (sem tela, sem notificação)',c:45,rule:'até R$ 120'},
 {id:'vh2',tier:'common',br:'har',n:'Caderno de pauta + lápis para ditado e transcrição',c:30,rule:'até R$ 40',rep:1,lim:'mês'},
 {id:'vh3',tier:'uncommon',br:'har',n:'Livro de peças para piano do seu nível (ex.: Alfred Livro 2)',rule:'até R$ 200',req:'n_M72'},
 {id:'vh4',tier:'uncommon',br:'har',n:'Pedal de sustain de verdade (tipo piano, não o quadradinho)',rule:'até R$ 250',req:'n_M71'},
 {id:'vh5',tier:'uncommon',br:'har',n:'Banco de piano regulável',rule:'até R$ 450',req:'op_12'},
 {id:'vh6',tier:'rare',br:'har',n:'Pacote de 4 aulas de piano presenciais',d:'Professor corrige postura e mão em uma aula o que vídeo nenhum vê.',rule:'até R$ 600',rep:1,lim:'mês',req:'n_M71'},
 {id:'vh7',tier:'rare',br:'har',n:'Ingresso de recital de piano ou concerto de orquestra',rule:'até R$ 300',rep:1,lim:'mês',req:'n_M03'},
 {id:'vh8',tier:'epic',br:'har',n:'Show de órgão de tubos (catedral ou sala de concerto)',d:'Ouvir harmonia que você sente no peito. Ótimo para a cabeça de quem produz grave.',rule:'até R$ 400 + deslocamento',cd:72,req:'n_M73'},
 {id:'vh9',tier:'epic',br:'har',n:'Teclado de 61 teclas sensitivas para estudar fora do estúdio',rule:'até R$ 1.500',cd:168,req:'n_M73'},
 {id:'vh10',tier:'legendary',br:'har',n:'Piano digital de 88 teclas com martelo (ex.: Yamaha P-145)',d:'É o item 12 da lista de compras do SGM-Opus: só libera depois de 30 dias seguidos de treino de ouvido e teoria (Onda 2).',rule:'até R$ 3.200 · preço confirmado no dia',seals:1,cd:168,req:'op_12'},
 {id:'vh11',tier:'legendary',br:'har',n:'Masterclass ou workshop presencial de composição ou harmonia',rule:'orçamento separado',seals:2,cd:168,req:'n_M75'}
]);

/* ---------- PHILOSOPHIA · o que faltava ---------- */
SYS.shop('vitruviano', [
 {id:'vf1',tier:'common',br:'phi',n:'Ampulheta de 30 minutos para leitura sem tela',c:35,rule:'até R$ 60'},
 {id:'vf2',tier:'uncommon',br:'phi',n:'Diário de capa dura para o exame noturno',rule:'até R$ 120',req:'n_P34'},
 {id:'vf3',tier:'rare',br:'phi',n:'Estatueta ou busto de Marco Aurélio, Sêneca ou Sócrates para a mesa',rule:'até R$ 350',req:'n_P23'},
 {id:'vf4',tier:'epic',br:'phi',n:'Edição bilíngue grego-português de um diálogo de Platão',rule:'até R$ 400',req:'n_P04'},
 {id:'vf5',tier:'common',br:'phi',n:'Livro: O Mundo de Sofia (Jostein Gaarder)',c:35,rule:'até R$ 70'},
 {id:'vf6',tier:'common',br:'phi',n:'Livro de bolso: Manual de Epicteto ou Meditações de Marco Aurélio',d:'Cabe no balcão da loja.',c:25,rule:'até R$ 40'},
 {id:'vf7',tier:'uncommon',br:'phi',n:'Livro: Sociedade do Cansaço (Byung-Chul Han)',rule:'até R$ 80',req:'n_P10'},
 {id:'vf8',tier:'uncommon',br:'phi',n:'Livro: Em Busca de Sentido (Viktor Frankl)',rule:'até R$ 80',req:'n_P19'},
 {id:'vf9',tier:'uncommon',br:'phi',n:'Livros: De Anima e Poética de Aristóteles (Editora 34)',rule:'até R$ 200',req:'n_P39'},
 {id:'vf10',tier:'rare',br:'phi',n:'Livro: Órganon de Aristóteles (Edipro)',rule:'até R$ 200',req:'n_P35'},
 {id:'vf11',tier:'rare',br:'phi',n:'Livro: Metafísica de Aristóteles (Loyola, ed. Giovanni Reale)',d:'O livro do rei da metafísica, com o texto grego ao lado.',rule:'até R$ 450',req:'n_P38'},
 {id:'vf12',tier:'rare',br:'phi',n:'Livro: The Lagoon (Armand Marie Leroi)',rule:'até R$ 250',req:'n_P41'},
 {id:'vf13',tier:'rare',br:'phi',n:'Livro: Comporte-se (Robert Sapolsky)',rule:'até R$ 200',req:'n_P14'},
 {id:'vf14',tier:'epic',br:'phi',n:'Cartas a Lucílio completas (Sêneca)',rule:'até R$ 400',cd:72,req:'n_P34'},
 {id:'vf15',tier:'epic',br:'phi',n:'Coleção História da Filosofia (Giovanni Reale & Dario Antiseri)',d:'Dos pré-socráticos até hoje, para consultar a vida inteira.',rule:'até R$ 900',cd:72,req:'n_P33'}
]);

/* ---------- POLITEIA ---------- */
SYS.shop('vitruviano', [
 {id:'vp1',tier:'common',br:'pol',n:'Pastas, etiquetas e caderno de dossiê',c:30,rule:'até R$ 50',rep:1,lim:'mês'},
 {id:'vp2',tier:'uncommon',br:'pol',n:'Edição comentada de A República',rule:'até R$ 150',req:'n_PO01'},
 {id:'vp3',tier:'uncommon',br:'pol',n:'Edição comentada da Política de Aristóteles',rule:'até R$ 150',req:'n_PO02'},
 {id:'vp4',tier:'rare',br:'pol',n:'História da Guerra do Peloponeso em edição boa',rule:'até R$ 250',req:'n_PO03'},
 {id:'vp5',tier:'rare',br:'pol',n:'Box dos contratualistas: Leviatã, Segundo Tratado e Contrato Social',d:'Três livros que discordam entre si na mesma prateleira.',rule:'até R$ 300',req:'n_PO17'},
 {id:'vp6',tier:'rare',br:'pol',n:'Jogo de tabuleiro de política e estratégia (ex.: Diplomacy, Twilight Struggle)',d:'Tucídides em quatro horas, com amigos e traição.',rule:'até R$ 450',cd:72,req:'n_PO03'},
 {id:'vp7',tier:'epic',br:'pol',n:'Viagem a Brasília: uma sessão do Congresso de caderno na mão',d:'Não é turismo cívico: é ver onde o poder de fato se senta.',rule:'orçamento separado',seals:1,cd:168,req:'n_PO33'},
 {id:'vp8',tier:'legendary',br:'pol',n:'Viagem a Atenas: Ágora, Pnyx e Acrópole',d:'O lugar onde a palavra política nasceu.',rule:'orçamento separado + reserva intacta',seals:2,cd:336,req:'n_PO06'},
 {id:'vp9',tier:'common',br:'pol',n:'Caderno de previsões com data de vencimento',d:'Cada previsão com número e prazo. O placar não perdoa.',c:20,rule:'até R$ 40',rep:1,lim:'mês',req:'n_PO10'},
 {id:'vp10',tier:'uncommon',br:'pol',n:'Jogo de dedução social (ex.: The Resistance, Coup)',d:'Retórica, blefe e leitura fria de gente, numa noite.',rule:'até R$ 200',req:'n_PO09'},
 {id:'vp11',tier:'uncommon',br:'pol',n:'O Capital, Livro I, em edição boa',rule:'até R$ 200',req:'n_PO18'},
 {id:'vp12',tier:'uncommon',br:'pol',n:'A Riqueza das Nações em edição completa',rule:'até R$ 200',req:'n_PO23'},
 {id:'vp13',tier:'rare',br:'pol',n:'Estante dos dois lados: Burke, Paine, Hayek e Polanyi',d:'Cada livro de um lado ao lado do crítico dele.',rule:'até R$ 450',cd:72,req:'n_PO08'},
 {id:'vp14',tier:'common',br:'pol',n:'Quadro de cortiça, alfinetes e barbante vermelho',d:'Para mapear casos como detetive de série. Com régua, claro.',c:25,rule:'até R$ 80',req:'n_PO45'},
 {id:'vp15',tier:'rare',br:'pol',n:'Raspberry Pi para um servidor caseiro só com software livre',d:'Do Manifesto GNU para a prática. Um relay Tor é opcional.',rule:'até R$ 600',cd:72,req:'n_PO37'},
 {id:'vp16',tier:'epic',br:'pol',n:'Viagem de pesquisa a Varginha ou a Colares',d:'Ouvir o folclore no lugar e ler os autos na volta.',rule:'orçamento separado',seals:1,cd:168,req:'n_PO47'},
 {id:'vp17',tier:'epic',br:'pol',n:'Viagem ao sertão de Canudos (Parque Estadual de Canudos, BA)',d:'Os Sertões na mochila.',rule:'orçamento separado',seals:1,cd:168,req:'n_PO43'},
 {id:'vp18',tier:'uncommon',br:'pol',n:'Livro: Conflito de Visões (Thomas Sowell)',rule:'até R$ 120',req:'n_PO08'},
 {id:'vp19',tier:'uncommon',br:'pol',n:'Livro: A Mente Moralista (Jonathan Haidt)',rule:'até R$ 120',req:'n_PO08'},
 {id:'vp20',tier:'uncommon',br:'pol',n:'Livro: Superprevisões (Philip Tetlock & Dan Gardner)',rule:'até R$ 120',req:'n_PO10'},
 {id:'vp21',tier:'uncommon',br:'pol',n:'Livro: O Príncipe (Maquiavel) em edição comentada',rule:'até R$ 80',req:'n_PO13'},
 {id:'vp22',tier:'rare',br:'pol',n:'Livro: Uma Teoria da Justiça (John Rawls)',rule:'até R$ 250',req:'n_PO20'},
 {id:'vp23',tier:'rare',br:'pol',n:'Livros de 1944: O Caminho da Servidão (Hayek) e A Grande Transformação (Polanyi)',d:'Escritos no mesmo ano, um contra o outro.',rule:'até R$ 250',req:'n_PO26'},
 {id:'vp24',tier:'uncommon',br:'pol',n:'Livro: Os Sertões (Euclides da Cunha) em edição comentada',rule:'até R$ 150',req:'n_PO43'}
]);

/* ---------- LINGUA · o que faltava ---------- */
SYS.shop('vitruviano', [
 {id:'vl1',tier:'common',br:'lin',n:'Caderno genkō yōshi (grade para kana e kanji) + caneta de ponta fina',c:35,rule:'até R$ 50',rep:1,lim:'mês'},
 {id:'vl2',tier:'common',br:'lin',n:'Post-its para etiquetar a casa no idioma da vez',c:20,rule:'até R$ 25',rep:1,lim:'mês'},
 {id:'vl3',tier:'uncommon',br:'lin',n:'Kit de shodō: pincel, tinta, suzuri e papel hanshi',rule:'até R$ 250',req:'n_L05'},
 {id:'vl4',tier:'uncommon',br:'lin',n:'Mangá em japonês do seu nível (ex.: Yotsuba&!)',rule:'até R$ 120',rep:1,lim:'mês',req:'n_L06'},
 {id:'vl5',tier:'rare',br:'lin',n:'Genki I e II com workbooks',rule:'até R$ 700',req:'n_L05'},
 {id:'vl6',tier:'rare',br:'lin',n:'Assinatura anual do WaniKani',rule:'confira o valor atual',req:'n_L06'},
 {id:'vl7',tier:'rare',br:'lin',n:'Pleco com os dicionários extras',rule:'confira o valor atual',req:'n_L09'},
 {id:'vl8',tier:'rare',br:'lin',n:'Taxa de inscrição no JLPT ou no HSK',rule:'taxa oficial',req:'n_L05'},
 {id:'vl9',tier:'epic',br:'lin',n:'Inscrição na prova C1 (Cambridge C1 Advanced, IELTS ou TOEFL iBT)',rule:'taxa oficial',cd:72,req:'n_L03'},
 {id:'vl10',tier:'epic',br:'lin',n:'Dicionários de papel bons: Houaiss e Oxford Advanced Learner’s',rule:'até R$ 600',req:'n_L12'},
 {id:'vl11',tier:'legendary',br:'lin',n:'Orçamento para livros e mangá em japonês numa livraria do Japão (ex.: Kinokuniya)',rule:'orçamento separado',seals:2,cd:168,req:'n_L07'},
 {id:'vl12',tier:'legendary',br:'lin',n:'Curso de imersão curto num país do idioma',rule:'orçamento separado + reserva intacta',seals:2,cd:336,req:'n_L04'},
 {id:'vl13',tier:'common',br:'lin',n:'Livro: Como Escrever Bem (William Zinsser)',c:40,rule:'até R$ 70'},
 {id:'vl14',tier:'uncommon',br:'lin',n:'Livro: Fluent Forever (Gabriel Wyner)',d:'Pronúncia primeiro e frases com áudio no Anki. Serve para o japonês agora e para o inglês depois.',rule:'até R$ 150',req:'n_L05'},
 {id:'vl15',tier:'rare',br:'lin',n:'Livro: Remembering the Kanji (James Heisig)',rule:'até R$ 250',req:'n_L06'},
 {id:'vl16',tier:'rare',br:'lin',n:'Livro: A Dictionary of Basic Japanese Grammar (Makino & Tsutsui)',rule:'até R$ 300',req:'n_L06'},
 {id:'vl17',tier:'rare',br:'lin',n:'Livro: Tobira, Gateway to Advanced Japanese',d:'A ponte do N4 para o N2.',rule:'até R$ 400',req:'n_L07'},
 {id:'vl18',tier:'uncommon',br:'lin',n:'Livro: English Pronunciation in Use (Cambridge), com áudio',rule:'até R$ 300',req:'n_L01'},
 {id:'vl19',tier:'rare',br:'lin',n:'Livro: English for Writing Research Papers (Adrian Wallwork)',rule:'até R$ 400',req:'n_L03'},
 {id:'vl20',tier:'rare',br:'lin',n:'Livro: Moderna Gramática Portuguesa (Evanildo Bechara)',rule:'até R$ 250',req:'n_L12'},
 {id:'vl21',tier:'rare',br:'lin',n:'Livro: Introdução à Lógica (Irving Copi)',rule:'até R$ 300',req:'n_P01'}
]);

/* ---------- SHADOW · SUPERARE MACHINAM ---------- */
SYS.shop('vitruviano', [
 {id:'vs1',tier:'rare',n:'Créditos de API para testar modelos de IA e caçar erros',d:'Munição do Superare Machinam: perguntas que você sabe resolver, para ver onde a máquina erra.',rule:'até R$ 100 por mês',rep:1,lim:'mês',req:'n_SM01'},
 {id:'vs2',tier:'legendary',n:'Placa gravada: Superare Machinam',d:'Para a parede do Garden, com os cinco erros corrigidos listados no verso.',rule:'até R$ 400',seals:5,cd:336,req:'n_SM06'}
]);
