/* ===== MIND v2 · arcos laterais (memória & atenção) + loja expandida ===== */
SYS.lib({
  adlerRead:{t:'How to Read a Book',a:'Mortimer J. Adler & Charles Van Doren',y:'ed. revista · 1972',pt:'Como Ler Livros',w:'mind',note:'Os quatro níveis de leitura, da inspecional à sintópica. O manual de leitura sério.'},
  deepWork:{t:'Deep Work',a:'Cal Newport',y:'2016',pt:'Trabalho Focado',w:'mind',note:'Blocos longos de concentração como habilidade rara e treinável.'},
  stolenFocus:{t:'Stolen Focus',a:'Johann Hari',y:'2022',pt:'Foco Roubado',w:'mind',note:'Reportagem sobre as causas coletivas da distração — leia com ceticismo ativo e cheque as fontes.'},
  pieperOcio:{t:'Leisure: The Basis of Culture',a:'Josef Pieper',y:'1948',pt:'Ócio e Culto',w:'mind',note:'O ócio contemplativo como base da cultura — o contrário exato da vida de produtividade total.'}
});

SYS.arc('mind', { id:'is1', base:1, side:1, needGate:'ig1', n:'ARCO LATERAL · MEMÓRIA & APRENDIZAGEM', wk:'Lateral', sub:'Aprender com método testado: espaçamento, recuperação e leitura analítica.', nodes:[
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

SYS.arc('mind', { id:'is2', base:1, side:1, needGate:'ig3', n:'ARCO LATERAL · ATENÇÃO & PRESENÇA', wk:'Lateral', sub:'Recuperar a capacidade de ficar com uma coisa só — e tolerar o tédio de onde vêm as ideias.', nodes:[
 {id:'P29',d:'Atenção',t:'Economia da atenção & trabalho focado',xp:50,cr:18,ach:'Bloco Profundo',
  s:'Sua atenção é o produto que alguém está vendendo. Dá para comprar de volta.',
  st:['Trabalho profundo x raso: qual parte do seu dia é qual','Blocos de 60–90 min com ritual de entrada e saída','Custo de troca de contexto e o resíduo de atenção','Design persuasivo: notificações, rolagem infinita, recompensa variável','Medir: tempo de tela, número de desbloqueios, tempo em bloco focado','Ambiente: telefone em outro cômodo vence qualquer força de vontade','Regra de encerramento: hora de parar, lista do dia seguinte'],
  wh:[['Center for Humane Technology','https://www.humanetech.com/','site','EN'],['Trabalho focado na prática',yt('deep work time blocking routine'),'vídeo','EN']],
  bk:[['deepWork','Blocos e rituais'],['stolenFocus','As causas coletivas da distração'],['sociedadeCansaco','O cansaço como sintoma da época']],
  q:'Rode 3 semanas com no mínimo 5 blocos profundos por semana, medindo tempo de tela e tempo focado.',
  dv:'Registro de 3 semanas', g:'15 blocos cumpridos e a comparação semanal registrada.',
  f:'Marcar “deep work” na agenda e passar o bloco respondendo WhatsApp.'},
 {id:'P30',d:'Atenção',t:'Atenção plena: o que a pesquisa diz e o que não diz',xp:45,cr:16,ach:'Respiração Contada',
  s:'Prática simples, evidência modesta, promessa de internet gigante. Fique com as duas primeiras.',
  st:['O que é: treinar atenção e retorno gentil ao foco — não esvaziar a mente','Prática de 10 min: âncora na respiração, notar a distração, voltar','O que a pesquisa sustenta hoje: efeitos modestos em ansiedade, dor e sono, com estudos de qualidade variável','O que NÃO é: substituto de tratamento de saúde; desconforto persistente pede profissional','Fontes confiáveis x cursos com promessa milagrosa','Registro simples: minutos praticados e efeito percebido','Meditação e religião: separar prática de crença, se você preferir'],
  wh:[['NCCIH (NIH) — Meditation and Mindfulness: What You Need To Know','https://www.nccih.nih.gov/health/meditation-and-mindfulness-what-you-need-to-know','doc','EN']],
  q:'Pratique 21 dias de 10 minutos e escreva 1 página separando o que você observou do que a evidência sustenta.',
  dv:'Registro de 21 dias + página crítica', g:'A página distingue experiência pessoal de afirmação científica.',
  f:'Ler um estudo de 30 pessoas e sair anunciando cura de ansiedade.'},
 {id:'P31',d:'Atenção',t:'Tédio, ócio & criatividade',xp:45,cr:16,ach:'Ócio Fértil',
  s:'As melhores ideias chegam no banho porque o banho é o último lugar sem tela.',
  st:['Tédio como matéria-prima: a mente errante e a incubação de ideias','Modo focado x modo difuso','Ócio contemplativo (Pieper) x descanso produtivista','Caminhada sem fone: 30 min, caderno no bolso (ponte com a flânerie)','Limites do “grind”: fadiga de decisão e retorno decrescente','Diário das ideias que aparecem quando você não está tentando','Agenda com espaço vazio de propósito — e defendido'],
  wh:[['Mente errante e criatividade',yt('mind wandering creativity boredom research'),'vídeo','EN']],
  bk:[['pieperOcio','O ócio como base da cultura'],['sociedadeCansaco','Autoexploração e cansaço'],['flow','Atenção, desafio e experiência ótima']],
  q:'Faça 14 dias com 30 min diários sem tela nem fone (caminhada, café, janela) e registre as ideias que aparecerem.',
  dv:'Diário de 14 dias', g:'Pelo menos 5 ideias registradas viraram nota, esboço ou decisão.',
  f:'Trocar o tédio por podcast em 2x e chamar de descanso.'},
 {id:'P32',d:'BOSS',t:'BOSS · 30 dias de atenção auditada',xp:260,cr:90,boss:1,ach:'Atenção Auditada',
  s:'Você não conserta o que não mede — inclusive a própria cabeça.',
  st:['Medir tela, interrupções e blocos','Prática diária de atenção','Três mudanças permanentes'],
  q:'Audite 30 dias (tempo de tela, interrupções, blocos focados, prática diária) e entregue gráfico simples + 3 mudanças que ficaram.',
  dv:'Auditoria de 30 dias', g:'Gráfico com dados reais e 3 mudanças ainda em pé no dia 30.',
  f:'Instalar 4 apps de foco e passar a semana configurando os 4.'}
]});

[
 {id:'igs1',arc:'is1',n:'Selo Lateral · Memória',ev:['Baralho de 100 cartões + 30 dias','Protocolo aplicado com comparação','Ficha analítica + mapa sintópico','Boss 30 dias'],oral:'Explique por que reler é a ilusão de estudo mais comum.',fail:'Qual assunto você “aprendeu” e esqueceu em 2 semanas?',ach:'mi_s1',xp:220},
 {id:'igs2',arc:'is2',n:'Selo Lateral · Atenção',ev:['15 blocos profundos registrados','21 dias de prática + página crítica','Diário de 14 dias de tédio','Boss Atenção Auditada'],oral:'Mostre seus números de tela e explique o que mudou de verdade.',fail:'Qual hábito digital você tentou cortar e voltou? Por quê?',ach:'mi_s2',xp:220}
].forEach(function(g){ SYS.gate('mind', g); });

SYS.shop('mind', [
 {id:'mi_x1',tier:'common',n:'Fichas e canetas para cartões físicos',c:20,rule:'até R$ 50',rep:1,lim:'mês'},
 {id:'mi_x2',tier:'uncommon',n:'AnkiMobile (iOS) ou doação ao projeto Anki',rule:'confira o valor atual',req:'n_P25'},
 {id:'mi_x3',tier:'uncommon',n:'Livro: Como Ler Livros — Mortimer J. Adler & Charles Van Doren',rule:'até R$ 150',req:'n_P27'},
 {id:'mi_x4',tier:'uncommon',n:'Livro: Fixe o Conhecimento (Make It Stick) — Brown, Roediger & McDaniel',rule:'até R$ 150',req:'n_P26'},
 {id:'mi_x5',tier:'rare',n:'Livro: Trabalho Focado (Deep Work) — Cal Newport',rule:'até R$ 120',req:'n_P29'},
 {id:'mi_x6',tier:'rare',n:'Livro: Foco Roubado — Johann Hari',rule:'até R$ 150',req:'n_P29'},
 {id:'mi_x7',tier:'rare',n:'Almofada de meditação (zafu) + tapete',rule:'até R$ 400',req:'n_P30'},
 {id:'mi_x8',tier:'rare',n:'Box de estoicos em edição boa (Sêneca, Marco Aurélio, Epicteto)',rule:'até R$ 500',req:'n_P06'},
 {id:'mi_x9',tier:'rare',n:'Cofre de celular com timer (para blocos focados)',rule:'até R$ 300',req:'n_P29'},
 {id:'mi_x10',tier:'epic',n:'Livro: Os Ensaios — Michel de Montaigne (edição completa em 3 volumes)',rule:'até R$ 600',cd:72,req:'n_P22'},
 {id:'mi_x11',tier:'epic',n:'Curso de filosofia (escola livre ou extensão universitária)',rule:'até R$ 1.200',cd:72,req:'n_P23'},
 {id:'mi_x12',tier:'epic',n:'Canto de leitura: poltrona + luminária decentes',rule:'até R$ 3.000',cd:168,req:'n_P27'},
 {id:'mi_x13',tier:'legendary',n:'Livro: O Livro Vermelho (Liber Novus) — C. G. Jung, edição ilustrada',d:'O tijolo ilustrado mais caro da estante. Não é leitura de metrô — é objeto de estudo.',rule:'orçamento discricionário; espere promoção',seals:2,cd:168,req:'n_P18'},
 {id:'mi_x14',tier:'legendary',n:'Retiro de silêncio laico de fim de semana',d:'Sem promessa terapêutica: é descanso de estímulo, não tratamento.',rule:'orçamento separado',seals:1,cd:168,req:'n_P32'}
]);
