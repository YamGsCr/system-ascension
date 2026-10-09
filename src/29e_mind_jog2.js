/* ===== v12 · MIND · JOGOS: build, tática e endgame no arco do competitivo ===== */
(function(){
  var arc = SYS.WAYMAP.mind.arcs.filter(function(a){ return a.id === 'ij2'; })[0];
  if (!arc) { SYS._bad.push('arc:ij2'); return; }

  var G21 = {id:'G21',d:'Competitivo',t:'Construção de poder & itemização',xp:70,cr:24,ach:'Construtor de Build',
    s:'Toda build tem um motor e um gargalo. Quem copia guia tem os dois e não sabe qual é qual.',
    st:['Fonte de poder × multiplicador: o que cria dano e o que multiplica o que já existe',
        'Aditivo × multiplicativo: empilhar cinco aumentos de 20% quase nunca é o que você acha que é',
        'O gargalo da build: a estatística que, se dobrar, dobra o resultado — e ela muda conforme você investe',
        'Orçamento: cada peça escolhida é outra peça abandonada. Build sem renúncia é build de papel',
        'Sinergia real × sinergia de nome: duas coisas que combinam no texto e não se multiplicam na conta',
        'Ponto de corte: valor a partir do qual investir mais não muda nada (e o desperdício silencioso disso)',
        'Defesa faz parte da build, não é o que sobra depois: build que morre não entrega dano nenhum',
        'Copiar build × entender build: copiar é o começo legítimo, parar aí é o teto',
        'Testar uma variável por vez e medir: sem isso você tem opinião, não build'],
    wh:[['Aditivo × multiplicativo em sistemas de jogo',yt('additive versus multiplicative damage scaling explained game math'),'vídeo','EN'],
        ['Gargalo e ponto de corte em otimização',yt('breakpoint diminishing returns build optimization games explained'),'vídeo','EN']],
    bk:[['artGameDesign','Economia interna e equilíbrio: por que a conta é assim'],['peak','Entender o sistema em vez de decorar a receita']],
    q:'Escolha uma build, escreva a tese dela em três linhas (o que é o motor, o que multiplica, qual é o gargalo), teste, meça e ajuste uma variável por vez.',
    dv:'Ficha de build com tese escrita', g:'Sabe apontar de onde vem cada multiplicador da sua build e qual é o gargalo atual.',
    f:'Copiar guia e não saber qual peça é o motor; empilhar aditivo achando que dobra; deixar defesa para depois.'};

  var G22 = {id:'G22',d:'Competitivo',t:'Execução & tática sob pressão',xp:65,cr:22,ach:'Mão Que Executa',
    s:'Saber o certo e fazer o certo com o coração a mil são duas habilidades. A segunda se treina fora da pressão.',
    st:['Separar saber de executar: a maioria das derrotas é de execução, não de conhecimento',
        'Sequência padrão: a ordem que você faz sem pensar, escrita antes de precisar dela',
        'Gatilhos de exceção: os três casos em que você abandona a sequência padrão — e só três',
        'Decisão default: o que fazer quando não dá tempo de pensar. Sem isso, o default é congelar',
        'Erro caro × erro barato: onde errar custa a partida e onde errar custa nada',
        'Economia de atenção: a cada momento existe uma coisa que importa e o resto é ruído',
        'Ensaiar a sequência em ambiente sem pressão até virar automático',
        'Interferência própria: quanto mais você se cobra no meio da luta, pior executa',
        'Medir execução: taxa de acerto da sequência, não sensação de ter jogado bem'],
    wh:[['Treinar execução sob pressão',yt('performing under pressure training execution routine sport psychology'),'vídeo','EN'],
        ['Rotina pré-jogada e decisão default',yt('pre shot routine default decision pressure performance'),'vídeo','EN']],
    bk:[['innerGame','Interferência própria: o texto clássico sobre travar sob pressão'],['peak','Automatizar a sequência antes de precisar dela'],['flow','Desafio e habilidade em equilíbrio']],
    q:'Escreva a sua sequência padrão e os três gatilhos de exceção, ensaie fora da pressão e meça a taxa de execução correta ao longo de dez sessões.',
    dv:'Cartilha de execução + medição', g:'A sequência está escrita, foi ensaiada, e a taxa de execução correta subiu de forma medida.',
    f:'Achar que sabe porque entende; improvisar do zero toda vez; medir por sensação.'};

  var G23 = {id:'G23',d:'Competitivo',t:'Endgame, economia & o ciclo da temporada',xp:70,cr:24,ach:'Dono do Ciclo',
    s:'O jogo de verdade começa onde o conteúdo “acaba”. E todo jogo tem uma economia — inclusive os que fingem que não.',
    st:['Endgame: onde o jogo passa a cobrar sistema em vez de reflexo, e por que quase todo mundo para antes',
        'Economia interna: de onde entra recurso (fonte) e por onde ele sai (ralo) — e o que acontece quando falta ralo',
        'Inflação: por que o que valia muito no início do ciclo vale pouco no fim',
        'Valor relativo: preço não é raridade, é demanda. Item raro que ninguém quer é item barato',
        'Início × fim de ciclo: as mesmas horas rendem coisas completamente diferentes dependendo do dia',
        'Reset de temporada como recurso: todo mundo volta ao zero junto, e isso é a sua chance',
        'Planejar o início do ciclo antes dele começar: a vantagem maior do jogo inteiro está aí',
        'Ponto de saída escrito: em que momento você considera a temporada cumprida e para sem culpa',
        '“Acabou o conteúdo” × “acabei o que eu queria”: só o segundo é motivo honesto de encerrar'],
    wh:[['Economia de jogo: fontes, ralos e inflação',yt('game economy sources sinks inflation virtual economy explained'),'vídeo','EN'],
        ['Ciclo de temporada e planejamento de início',yt('season league start planning strategy live service game'),'vídeo','EN']],
    bk:[['artGameDesign','Fontes, ralos e equilíbrio de economia'],['irresistible','O ciclo que existe para você não sair'],['homoLudens','O jogo como ciclo com começo, regra e fim']],
    q:'Mapeie o ciclo econômico do seu jogo (fontes, ralos, o que infla), escreva o plano de início da próxima temporada e o seu ponto de saída.',
    dv:'Mapa do ciclo + plano de temporada com ponto de saída', g:'Entende onde o valor é criado e destruído no seu jogo, e tem ponto de saída escrito antes de começar.',
    f:'Entrar na temporada sem plano e sair por cansaço; confundir fim de conteúdo com fim do seu objetivo.'};

  /* ordem final do arco: recurso → build → probabilidade → leitura → tática → patch → rank → ciclo → boss */
  var want = ['G06','G07','G21','G08','G09','G22','G10','G11','G23','G12'];
  var by = {}; arc.nodes.forEach(function(n){ by[n.id] = n; });
  by.G21 = G21; by.G22 = G22; by.G23 = G23;
  var out = want.map(function(id){ return by[id]; }).filter(Boolean);
  if (out.length !== want.length) { SYS._bad.push('ij2:ordem'); return; }
  arc.nodes.length = 0; arc.nodes.push.apply(arc.nodes, out);

  /* o selo do arco ganha as evidências dos capítulos novos */
  var g = SYS.WAYMAP.mind.gates.filter(function(x){ return x.id === 'ijg2'; })[0];
  if (g) g.ev = g.ev.concat(['Ficha de build com tese escrita', 'Cartilha de execução + medição', 'Mapa do ciclo + plano de temporada']);
  else SYS._bad.push('gate:ijg2');
})();
