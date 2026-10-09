/* ===== v11 · contadores, feitos, conquistas, marcos e loja — evolução real nos jogos ===== */

/* ---------- contadores: só coisa que mede melhora, nada de "horas jogadas" ---------- */
SYS.COUNTERS.push(
 {id:'revisoes', way:'mind', n:'Partidas revisadas com erro nomeado', unit:'revisões', ic:'eye', q:[1,3]},
 {id:'sessoesAlvo', way:'mind', n:'Sessões com alvo escrito antes de abrir o jogo', unit:'sessões', ic:'target', q:[1,3]},
 {id:'temporadasJogo', way:'mind', n:'Temporadas competitivas fechadas com relatório', unit:'temporadas', ic:'flag', q:[1]},
 {id:'pbRitmo', way:'mind', n:'Recordes pessoais de ritmo com treino documentado', unit:'recordes', ic:'sparkle', q:[1]},
 {id:'hipTemp', way:'mind', n:'Temporadas de Hiperfoco encerradas com relatório', unit:'temporadas', ic:'scroll', q:[1]},
 {id:'artefatos', way:'mind', n:'Artefatos publicados (dossiê, ficção, ensaio, coleção)', unit:'artefatos', ic:'book', q:[1]}
);

/* ---------- Feitos · JOGOS: cada um exige melhora verificável, não participação ---------- */
SYS.FEATS.push(
 {id:'jg_alvo30', way:'mind', br:'jog', n:'Trinta Sessões com Alvo', d:'30 sessões abertas com alvo escrito antes e resultado escrito depois.', r:'uncommon', ctr:'sessoesAlvo', goal:30},
 {id:'jg_rev25', way:'mind', br:'jog', n:'Vinte e Cinco Revisões', d:'25 partidas revisadas com timestamp e erro nomeado.', r:'rare', ctr:'revisoes', goal:25, title:'Revisor'},
 {id:'jg_rev100', way:'mind', br:'jog', n:'Cem Revisões', d:'100 partidas revisadas. Nesse ponto você já vê coisa que o replay não mostra.', r:'epic', ctr:'revisoes', goal:100, title:'Olho de Replay'},
 {id:'jg_erro', way:'mind', br:'jog', n:'Erro Extinto', d:'Um erro recorrente que aparecia em toda revisão desapareceu de 10 partidas seguidas.', r:'rare', title:'Corretor'},
 {id:'jg_tier', way:'mind', br:'jog', n:'Um Degrau de Elo', d:'Subiu uma divisão inteira com a rotina de revisão rodando — e sabe dizer por quê.', r:'rare'},
 {id:'jg_tier2', way:'mind', br:'jog', n:'Dois Degraus, Mesmo Método', d:'Subiu duas divisões sem trocar de estratégia no meio. Isso é melhora, não variância.', r:'epic', title:'Escalador'},
 {id:'jg_temp1', way:'mind', br:'jog', n:'Primeira Temporada Fechada', d:'Uma temporada competitiva inteira, do começo ao relatório final.', r:'rare', ctr:'temporadasJogo', goal:1, title:'Terminador de Temporada'},
 {id:'jg_temp3', way:'mind', br:'jog', n:'Três Temporadas Fechadas', d:'3 temporadas terminadas com relatório. Nenhuma abandonada no meio.', r:'legendary', ctr:'temporadasJogo', goal:3, title:'Não Larga no Meio'},
 {id:'jg_stop', way:'mind', br:'jog', n:'Respeitou o Freio', d:'Um mês inteiro sem quebrar o stop-loss de sessão, incluindo no dia em que doeu.', r:'rare', title:'Freio Respeitado'},
 {id:'jg_coach', way:'mind', br:'jog', n:'Coaching Bem Usado', d:'Sessão de coaching ou revisão com alguém melhor, com replay marcado e pergunta escrita antes.', r:'uncommon'},
 {id:'jg_torneio', way:'mind', br:'jog', n:'Torneio Jogado', d:'Participou de um torneio de verdade (online ou local) e escreveu o relatório.', r:'epic', title:'Competidor de Chave'},
 {id:'jg_ensina', way:'mind', br:'jog', n:'Ensinou Alguém', d:'Ensinou outra pessoa a jogar melhor e ela melhorou de forma verificável.', r:'rare', title:'Mentor de Fila'},
 {id:'rt_pb', way:'mind', br:'jog', n:'Primeiro Recorde Documentado', d:'Recorde pessoal de ritmo com o treino que levou até ele registrado.', r:'uncommon', ctr:'pbRitmo', goal:1},
 {id:'rt_pb10', way:'mind', br:'jog', n:'Dez Recordes Documentados', d:'10 recordes pessoais, cada um com o padrão treinado escrito.', r:'epic', ctr:'pbRitmo', goal:10, title:'Mãos Rápidas'},
 {id:'rt_padrao', way:'mind', br:'jog', n:'Padrão Fraco Virado', d:'Um padrão em que você era ruim passou a ser um dos seus melhores, com medição antes e depois.', r:'rare', title:'Virou o Padrão'},
 {id:'rt_degrau', way:'mind', br:'jog', n:'Teto Subiu', d:'Subiu um degrau de dificuldade em ritmo mantendo ou melhorando a precisão média.', r:'rare'},
 {id:'rt_limpo', way:'mind', br:'jog', n:'Mão Limpa', d:'Seis meses de ritmo sem dor: aquecimento, pausa e postura cumpridos.', r:'epic', title:'Punho Intacto'}
);

/* ---------- Feitos · HIPERFOCOS: entregável publicado, não tempo gasto ---------- */
SYS.FEATS.push(
 {id:'hp_temp1', way:'mind', br:'hip', n:'Primeira Temporada Encerrada', d:'Uma Temporada de Hiperfoco fechada na data com relatório escrito.', r:'uncommon', ctr:'hipTemp', goal:1},
 {id:'hp_temp5', way:'mind', br:'hip', n:'Cinco Temporadas Encerradas', d:'5 temporadas fechadas com relatório. O ciclo começar–largar virou método.', r:'epic', ctr:'hipTemp', goal:5, title:'Ciclo Quebrado'},
 {id:'hp_art1', way:'mind', br:'hip', n:'Primeiro Artefato no Ar', d:'Primeiro dossiê, ficção, ensaio ou coleção publicado com fonte e licença.', r:'uncommon', ctr:'artefatos', goal:1},
 {id:'hp_art10', way:'mind', br:'hip', n:'Dez Artefatos no Ar', d:'10 peças publicadas. Isso é obra, não hobby.', r:'legendary', ctr:'artefatos', goal:10, title:'Autor de Arquivo'},
 {id:'hp_fonte', way:'mind', br:'hip', n:'Achou a Origem', d:'Rastreou uma afirmação muito repetida até a fonte primária — e ela não dizia aquilo.', r:'rare', title:'Rastreador'},
 {id:'hp_arquivo', way:'mind', br:'hip', n:'Salvou o Que Morreu', d:'Arquivou conteúdo que depois saiu do ar. Você tem a única cópia indexada.', r:'rare', title:'Guardião de Arquivo'},
 {id:'hp_local', way:'mind', br:'hip', n:'História Local Escrita', d:'Pesquisa de história local com fontes primárias de arquivo, publicada.', r:'epic', title:'Historiador Local'},
 {id:'hp_scp', way:'mind', br:'hip', n:'Passou pela Crítica', d:'Texto seu sobreviveu à crítica pública de rascunho e ficou melhor depois.', r:'rare'},
 {id:'hp_arg', way:'mind', br:'hip', n:'ARG Rodado', d:'Projetou e rodou um ARG que outras pessoas terminaram sem você entregar a resposta.', r:'epic', title:'Condutor'},
 {id:'hp_disse', way:'mind', br:'hip', n:'Disse na Mesa', d:'Falou do seu hiperfoco num contexto profissional sem pedir desculpa nem emendar justificativa.', r:'rare', title:'Esquisito Declarado'}
);

/* ---------- Conquistas de Sistema: gatilhos automáticos, focados em melhora ---------- */
SYS.SYSACH.push(
 {id:'sys_jg_base', n:'Fundamento Antes do Rank', d:'Fechou o Selo de Jogar de Propósito antes de abrir o arco do competitivo.', r:'uncommon', ic:'target', c:function(D){ return !!D.gateDone.ijg1; }},
 {id:'sys_jg_rev', n:'Cinquenta Revisões', d:'50 partidas revisadas com erro nomeado. Dá para ver o padrão de longe agora.', r:'rare', ic:'eye', title:'Revisor Crônico', c:function(D){ return (D.ctr.revisoes || 0) >= 50; }},
 {id:'sys_jg_alvo', n:'Cem Sessões com Alvo', d:'100 sessões abertas com alvo escrito. Você não joga no automático há muito tempo.', r:'epic', ic:'target', ms:1, title:'Nunca no Automático', c:function(D){ return (D.ctr.sessoesAlvo || 0) >= 100; }},
 {id:'sys_jg_temp', n:'Temporada Inteira', d:'Uma temporada competitiva fechada com relatório — o boss era terminar.', r:'epic', ic:'sword', ms:1, title:'Fechou a Temporada', c:function(D){ return !!D.nodeDone.G12; }},
 {id:'sys_jg_um', n:'Um Jogo, Uma Temporada', d:'Declarou um competitivo só e um jogo de lazer sem meta. Nada de dois ranqueados.', r:'uncommon', ic:'shield', c:function(D){ return !!D.nodeDone.G03; }},
 {id:'sys_rt_cenario', n:'O Cenário Permanente', d:'Fechou o Selo de Ritmo & Precisão: ouvido, reflexo e mãos com medição.', r:'epic', ic:'wave', ms:1, title:'Ouvido, Reflexo e Mãos', c:function(D){ return !!D.gateDone.ijgs1; }},
 {id:'sys_rt_pb', n:'Cinco Recordes', d:'5 recordes pessoais de ritmo, cada um com o treino documentado.', r:'rare', ic:'sparkle', c:function(D){ return (D.ctr.pbRitmo || 0) >= 5; }},
 {id:'sys_hp_slot', n:'Um Slot Só', d:'Abriu a primeira Temporada de Hiperfoco com pergunta, prazo e entregável escritos.', r:'common', ic:'scroll', c:function(D){ return (D.hipAberta || 0) >= 1 || (D.ctr.hipTemp || 0) >= 1; }},
 {id:'sys_hp_honra', n:'Encerramento Honroso', d:'Encerrou uma temporada na data combinada, com relatório — inclusive quando a resposta foi “não deu”.', r:'uncommon', ic:'flag', c:function(D){ return (D.ctr.hipTemp || 0) >= 1; }},
 {id:'sys_hp_ciclo', n:'Ciclo Quebrado', d:'5 Temporadas de Hiperfoco encerradas com relatório. O padrão de começar e largar virou método.', r:'legendary', ic:'crown', ms:1, title:'Quebrou o Ciclo', c:function(D){ return (D.ctr.hipTemp || 0) >= 5; }},
 {id:'sys_hp_obra', n:'Coleção Assinada', d:'Três artefatos publicados sob uma introdução assinada. Virou obra.', r:'epic', ic:'book', ms:1, title:'Curador Assinado', c:function(D){ return !!D.nodeDone.H15; }},
 {id:'sys_hp_dossie', n:'Dossiê no Ar', d:'Dossiê publicado com aparato de fontes e graus de confiança declarados.', r:'rare', ic:'scroll', title:'Autor de Dossiê', c:function(D){ return !!D.nodeDone.H09; }},
 {id:'sys_hobby_zero', n:'Hobby Sem Cobrança', d:'Duas vertentes de hobby em andamento e nenhuma sequência diária ligada a elas. Era o ponto.', r:'rare', ic:'shield', secret:true, c:function(D){ return (D.brDone.mind && (D.brDone.mind.hip || 0) + (D.brDone.mind.jog || 0) >= 10); }}
);

/* ---------- Marcos: o que aparece em "próximos marcos" ---------- */
SYS.MSADD = [
  ['Partidas revisadas', 'revisoesCt', [1,25,100], 'eye'],
  ['Sessões com alvo escrito', 'sessoesAlvoCt', [1,30,100], 'target'],
  ['Temporadas competitivas fechadas', 'temporadasJogoCt', [1,3], 'sword'],
  ['Recordes de ritmo documentados', 'pbRitmoCt', [1,10], 'sparkle'],
  ['Temporadas de Hiperfoco encerradas', 'hipTempCt', [1,5], 'scroll'],
  ['Artefatos publicados', 'artefatosCt', [1,10], 'book']
];

/* ---------- Loja · JOGOS & SISTEMAS: loja de jogo de verdade, e o preço é progresso ----------
   Ordem de causa embutida nos requisitos: estação e ergonomia → medir latência →
   periférico e tela. Hardware caro não substitui padrão treinado, e o Sistema
   simplesmente não destrava na ordem errada.                                          */
SYS.shop('mind', [
 /* — consumíveis e itens de bancada — */
 {id:'mi_j1',tier:'common',br:'jog',n:'Moeda do jogo · pacote pequeno',c:12,
  d:'Valor fixo, decidido antes de abrir o jogo. Nunca caixa aleatória, nunca “mais uma” atrás do item que não saiu — o capítulo do loop de recompensa existe justamente por isso.',
  rule:'até R$ 30, valor definido antes',rep:1,lim:'mês'},
 {id:'mi_j2',tier:'common',br:'jog',n:'Café da revisão semanal de replay',rule:'até R$ 30',rep:1,lim:'semana'},
 {id:'mi_j3',tier:'common',br:'jog',n:'Caderno de bordo: sessões, revisões e mortes',rule:'até R$ 60'},
 {id:'mi_j4',tier:'common',br:'jog',n:'Mousepad novo ou limpeza completa da estação',rule:'até R$ 80',rep:1,lim:'mês'},

 /* — utilitários e conforto: só depois de existir rotina — */
 {id:'mi_j5',tier:'uncommon',br:'jog',n:'Passe de batalha da temporada',
  d:'Libera junto com a declaração de temporada. Passe sem temporada declarada é assinatura de culpa: você paga para ter tarefa.',
  rule:'preço do passe · 1x por temporada',req:'n_G03',rep:1,lim:'mês'},
 {id:'mi_j6',tier:'uncommon',br:'jog',n:'Apoio de punho e ajuste ergonômico da estação',
  d:'Antes de qualquer periférico caro, a geometria. Punho neutro não é conforto, é anos de mão funcionando.',
  rule:'até R$ 250',req:'n_G05'},
 {id:'mi_j7',tier:'uncommon',br:'jog',n:'Utilitário do jogo: overlay, tracker ou ferramenta de análise',
  d:'Só faz sentido se as revisões já estiverem acontecendo. Ferramenta acelera método que existe; não cria método.',
  rule:'até R$ 200 por ano',req:'n_G02'},
 {id:'mi_j8',tier:'uncommon',br:'jog',n:'Espaço de inventário: abas de baú, estoque ou organização de conta',
  d:'O item mais subestimado do gênero. Inventário cheio é tempo morto por sessão, e tempo morto é o maior ralo do farm.',
  rule:'até R$ 150',req:'n_G21'},
 {id:'mi_j9',tier:'uncommon',br:'jog',n:'Livro da vertente (Peak, Homo Ludens, A Arte de Game Design…)',rule:'até R$ 250',rep:1,lim:'mês'},

 /* — equipamento e gente melhor que você — */
 {id:'mi_j10',tier:'rare',br:'jog',n:'Cosmético avulso: skin, aparência ou efeito',
  d:'Vaidade liberada só depois de existir plano de temporada. Ficar bonito perdendo é o estado natural do jogador médio.',
  rule:'até R$ 120',req:'n_G11',rep:1,lim:'mês'},
 {id:'mi_j11',tier:'rare',br:'jog',n:'Uma hora de coaching pago no jogo da temporada',
  d:'Regra de uso: replay marcado e três perguntas escritas antes de entrar na chamada. Hora de gente boa é cara demais para improvisar.',
  rule:'até R$ 250',req:'n_G11',cd:72},
 {id:'mi_j12',tier:'rare',br:'jog',n:'Periférico principal do jogo da temporada',
  d:'Libera depois da estação ajustada e da latência medida. Nessa ordem, nunca na inversa.',
  rule:'até R$ 700',req:'n_R02',cd:72},
 {id:'mi_j13',tier:'rare',br:'jog',n:'Tela de alta taxa de atualização',
  d:'Só depois de medir onde o atraso realmente está. Na maioria das vezes ele estava no offset ou no sono.',
  rule:'até R$ 1.800',req:'n_R02',cd:72},
 {id:'mi_j14',tier:'rare',br:'jog',n:'Inscrição em torneio (online ou local)',
  d:'Chave de verdade, com gente que treina. Perder feio em torneio ensina mais que trinta partidas de fila.',
  rule:'até R$ 200',req:'n_G22',rep:1,lim:'mês'},
 {id:'mi_j15',tier:'rare',br:'jog',n:'Camisa ou moletom oficial do jogo',
  d:'Vestir a camisa depois de terminar uma temporada inteira, não antes. Merch é troféu, não uniforme de torcedor.',
  rule:'até R$ 300',req:'n_G12'},

 /* — as coisas grandes — */
 {id:'mi_j16',tier:'epic',br:'jog',n:'Pacote de temporada completo (passe + moeda + cosmético)',
  d:'O pacote inteiro, uma vez por ciclo, depois de ter fechado um ciclo antes. Quem nunca terminou uma temporada não precisa do pacote: precisa terminar uma temporada.',
  rule:'preço do pacote · 1x por temporada',req:'n_G12',cd:168},
 {id:'mi_j17',tier:'epic',br:'jog',n:'Controlador dedicado de ritmo (teclado, pad ou controle de arcade)',
  d:'Libera com a leitura de padrão encaminhada. Hardware bonito não substitui padrão treinado — mas depois do padrão, ele paga.',
  rule:'até R$ 1.500',req:'n_R04',cd:168},
 {id:'mi_j18',tier:'epic',br:'jog',n:'Colecionável, estatueta ou artbook do jogo',
  d:'Liberado por ter lido o jogo como obra, não por ter jogado muito. Objeto de quem entende o que está na estante.',
  rule:'até R$ 600',req:'n_G17',cd:168},
 {id:'mi_j19',tier:'epic',br:'jog',n:'Viagem curta a torneio, fliperama ou evento do jogo',
  d:'Vale fliperama japonês em viagem que você já ia fazer.',
  rule:'orçamento de viagem separado',req:'n_G12',cd:168},

 /* — lendário: só com selo — */
 {id:'mi_j20',tier:'legendary',br:'jog',n:'Comemoração da temporada fechada no prazo',
  d:'Só libera se a temporada terminou com relatório. Terminar é a conquista; o elo é detalhe.',
  rule:'orçamento de lazer',seals:1,cd:168,req:'n_G12'},
 {id:'mi_j21',tier:'legendary',br:'jog',n:'Estação de jogo completa, montada de propósito',
  d:'O último item da vertente: mesa, cadeira, tela, som e periférico escolhidos com dado medido, não com hype de vídeo.',
  rule:'até R$ 8.000',seals:2,cd:168}
]);

/* ---------- Loja · HIPERFOCOS: o mínimo para pesquisa e arquivo não morrerem ---------- */
SYS.shop('mind', [
 {id:'mi_h1',tier:'common',br:'hip',n:'Caderno de campo da temporada',c:12,rule:'até R$ 60',rep:1,lim:'mês'},
 {id:'mi_h2',tier:'uncommon',br:'hip',n:'Livro da vertente (Range, A Arte da Pesquisa, Apologia da História…)',rule:'até R$ 250',rep:1,lim:'mês'},
 {id:'mi_h3',tier:'uncommon',br:'hip',n:'HD ou SSD externo dedicado ao arquivo',d:'Três cópias, dois formatos, uma fora de casa. Esta é a segunda.',rule:'até R$ 400',req:'n_H06'},
 {id:'mi_h4',tier:'rare',br:'hip',n:'Domínio próprio e hospedagem para os artefatos',d:'Endereço que é seu, não feed de plataforma.',rule:'até R$ 300 por ano',req:'n_H14'},
 {id:'mi_h5',tier:'rare',br:'hip',n:'Viagem de pesquisa a um arquivo ou lugar liminar de verdade',rule:'orçamento de viagem separado',req:'n_H08',cd:72},
 {id:'mi_h6',tier:'epic',br:'hip',n:'Impressão encadernada da Coleção Assinada',d:'Três artefatos no papel, com introdução. Prova física de que virou obra.',rule:'até R$ 500',req:'n_H15',cd:168}
]);
