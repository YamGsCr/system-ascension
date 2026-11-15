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
 {id:'vm16',tier:'mythic',br:'mat',n:'Inscrição num congresso científico para apresentar o dataset (ex.: SBrT, IEEE Radar)',d:'O Opus Publicum sai do quarto.',rule:'orçamento separado + reserva intacta',seals:3,cd:336,req:'n_MT35'}
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
 {id:'vf4',tier:'epic',br:'phi',n:'Edição bilíngue grego-português de um diálogo de Platão',rule:'até R$ 400',req:'n_P04'}
]);

/* ---------- POLITEIA ---------- */
SYS.shop('vitruviano', [
 {id:'vp1',tier:'common',br:'pol',n:'Pastas, etiquetas e caderno de dossiê',c:30,rule:'até R$ 50',rep:1,lim:'mês'},
 {id:'vp2',tier:'uncommon',br:'pol',n:'Edição comentada de A República',rule:'até R$ 150',req:'n_PO01'},
 {id:'vp3',tier:'uncommon',br:'pol',n:'Edição comentada da Política de Aristóteles',rule:'até R$ 150',req:'n_PO02'},
 {id:'vp4',tier:'rare',br:'pol',n:'História da Guerra do Peloponeso em edição boa',rule:'até R$ 250',req:'n_PO03'},
 {id:'vp5',tier:'rare',br:'pol',n:'Constituição anotada ou vade-mécum do ano',rule:'até R$ 300',req:'n_PO04'},
 {id:'vp6',tier:'rare',br:'pol',n:'Jogo de tabuleiro de política e estratégia (ex.: Diplomacy, Twilight Struggle)',d:'Tucídides em quatro horas, com amigos e traição.',rule:'até R$ 450',cd:72,req:'n_PO03'},
 {id:'vp7',tier:'epic',br:'pol',n:'Viagem a Brasília: sessão do Congresso e visita ao STF',rule:'orçamento separado',seals:1,cd:168,req:'n_PO05'},
 {id:'vp8',tier:'legendary',br:'pol',n:'Viagem a Atenas: Ágora, Pnyx e Acrópole',d:'O lugar onde a palavra política nasceu.',rule:'orçamento separado + reserva intacta',seals:2,cd:336,req:'n_PO06'}
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
 {id:'vl12',tier:'legendary',br:'lin',n:'Curso de imersão curto num país do idioma',rule:'orçamento separado + reserva intacta',seals:2,cd:336,req:'n_L04'}
]);

/* ---------- SHADOW · SUPERARE MACHINAM ---------- */
SYS.shop('vitruviano', [
 {id:'vs1',tier:'rare',n:'Créditos de API para testar modelos de IA e caçar erros',d:'Munição do Superare Machinam: perguntas que você sabe resolver, para ver onde a máquina erra.',rule:'até R$ 100 por mês',rep:1,lim:'mês',req:'n_SM01'},
 {id:'vs2',tier:'legendary',n:'Placa gravada: Superare Machinam',d:'Para a parede do Garden, com os cinco erros corrigidos listados no verso.',rule:'até R$ 400',seals:5,cd:336,req:'n_SM06'}
]);
