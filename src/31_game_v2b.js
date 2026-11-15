/* ===== v2 · MISSÕES EXTRAS, SEQUÊNCIA, DUNGEONS, BAÚS, APRIMORAMENTOS, NOVAS CONQUISTAS ===== */
SYS.RESET_HOUR = 8;
SYS.EXTRA_CAP = 3;
/* Missões extras: pequenas, reais, sem FOMO. +2 XP no Caminho e +1 ◆ cada (máx. 3 por dia contam). */
SYS.EXTRAS = [
 {id:'agua', n:'2 litros de água', way:'aesthetic', ic:'wave', why:'Hidratação sustenta atenção e humor. Não precisa virar galão.'},
 {id:'sol', n:'10 min de luz do dia pela manhã', way:'aesthetic', ic:'sparkle', why:'Luz cedo ajuda a acertar o relógio biológico e o sono da noite.'},
 {id:'mobilidade', n:'10 min de mobilidade', way:'aesthetic', ic:'flame', why:'Articulação que se move não enferruja. Punhos e ombros agradecem na barra.'},
 {id:'caminhar', n:'Caminhada de 20 min', way:'aesthetic', ic:'grass', why:'Movimento leve melhora humor e destrava ideias.'},
 {id:'proteina', n:'Proteína em todas as refeições', way:'aesthetic', ic:'flame', why:'Distribuir proteína no dia ajuda a recuperar e manter músculo.'},
 {id:'telas', n:'30 min sem tela antes de dormir', way:'aesthetic', ic:'moon', why:'Menos estímulo à noite costuma encurtar o tempo para pegar no sono.'},
 {id:'protetor', n:'Protetor solar (e reaplicar se saiu)', way:'aesthetic', ic:'shield', why:'É o skincare com mais evidência que existe.'},
 {id:'postura', n:'3 pausas de postura no dia', way:'aesthetic', ic:'user', why:'A melhor postura é a próxima: mudar de posição vale mais que “ficar reto”.'},
 {id:'vegetais', n:'3 porções de frutas ou verduras', way:'aesthetic', ic:'grass', why:'Comida de verdade primeiro — o Guia Alimentar brasileiro é claro nisso.'},
 {id:'respirar', n:'5 min de respiração lenta', way:'vitruviano', ic:'moon', why:'Respirar devagar reduz a ativação do estresse no curto prazo.'},
 {id:'gratidao', n:'Anotar 3 coisas boas do dia', way:'vitruviano', ic:'pen', why:'Treinar a atenção para o que funcionou equilibra o viés negativo.'},
 {id:'sem_redes', n:'Primeira hora do dia sem redes sociais', way:'vitruviano', ic:'eye', why:'Começar o dia no seu roteiro, não no algoritmo.'},
 {id:'meditar', n:'10 min de meditação', way:'vitruviano', ic:'oracle', why:'Atenção é músculo. Distrair e voltar é a repetição.'},
 {id:'anki', n:'Revisões do Anki em dia', way:'vitruviano', ic:'journal', why:'Repetição espaçada: poucos minutos, memória de longo prazo.'},
 {id:'arrumar', n:'10 min arrumando o espaço', way:'aesthetic', ic:'status', why:'Ambiente com menos fricção = começar mais fácil amanhã.'},
 {id:'pergunta', n:'Perguntar algo a alguém e ouvir a resposta inteira', way:'vitruviano', ic:'user', why:'Escuta de verdade é skill social rara.'},
 {id:'amigo', n:'Mensagem genuína para um amigo', way:null, ic:'sparkle', why:'Conexão social é um dos maiores preditores de bem-estar.'},
 {id:'familia', n:'Tempo de qualidade com a família, sem celular', way:null, ic:'user', why:'Presença é o presente. (O Sistema pede desculpas pelo trocadilho.)'},
 {id:'elogio', n:'Elogiar alguém de verdade', way:null, ic:'star', why:'Custa zero e muda o dia de alguém. Talvez o seu.'},
 {id:'ajudar', n:'Ajudar alguém sem pedir nada em troca', way:null, ic:'shield', why:'Gentileza gera sentido — e o sentido segura a motivação.'},
 {id:'natureza', n:'15 min em natureza (praça, mato, céu)', way:null, ic:'grass', why:'Verde e céu aberto baixam o ruído mental.'},
 {id:'inutil', n:'Criar algo inútil e bonito', way:null, ic:'sparkle', why:'Nem tudo precisa de ROI. Principalmente as melhores coisas.'},
 {id:'carteira', n:'Atualizar um valor da Carteira', way:'navigation', ic:'helm', why:'Cinco minutos por mês evitam decidir no escuro — e a carteira para de ser um mistério.'},
 {id:'pags10', n:'10 páginas extras de leitura', way:'flaneur', ic:'book', why:'Lote pequeno, todo dia: é assim que se lê 20 livros por ano.'},
 {id:'palavras200', n:'200 palavras de escrita livre', way:'flaneur', ic:'quill', why:'Escrita livre destrava a escrita “séria”.'},
 {id:'observar', n:'Anotar 1 observação da rua', way:'flaneur', ic:'eye', why:'O flâneur é quem repara. Caderno no bolso.'},
 {id:'poema', n:'Ler 1 poema em voz alta', way:'flaneur', ic:'quill', why:'Ritmo se aprende pelo ouvido.'},
 {id:'album', n:'Ouvir um álbum inteiro com atenção', way:'vitruviano', ic:'wave', why:'Escuta ativa: ouvir como produtor, não como playlist.'},
 {id:'tecnica', n:'10 min de escalas ou técnica no instrumento', way:'vitruviano', ic:'wave', why:'Técnica em doses curtas e diárias vence maratona semanal.'},
 {id:'ouvido', n:'5 min de treino de ouvido', way:'vitruviano', ic:'wave', why:'Intervalos e acordes de ouvido aceleram tudo na produção.'},
 {id:'digger', n:'Descobrir 3 faixas de um gênero desconhecido', way:'vitruviano', ic:'sparkle', why:'Repertório é a matéria-prima do compositor.'},
 {id:'doc', n:'Ler 1 página de documentação oficial', way:'architect', ic:'book', why:'Fonte primária vence tutorial de terceiro.'},
 {id:'refactor', n:'Refatorar algo pequeno que incomodava', way:'architect', ic:'compass', why:'Regra do escoteiro: deixe o código melhor do que achou.'},
 {id:'til', n:'Escrever 1 TIL (hoje aprendi)', way:'architect', ic:'pen', why:'Escrever o que aprendeu é recuperar da memória — fixa melhor.'},
 {id:'backup', n:'Conferir se um backup restaura', way:'architect', ic:'cloud', why:'Backup que nunca foi restaurado é esperança, não backup.'},
 {id:'gastos', n:'Registrar todos os gastos do dia', way:'navigation', ic:'helm', why:'O que é medido é gerenciado.'},
 {id:'noticia', n:'Ler 1 notícia econômica e resumir em 1 frase', way:'navigation', ic:'scroll', why:'Resumir obriga a entender.'},
 {id:'sem_impulso', n:'Dia sem compra por impulso', way:'navigation', ic:'shield', why:'Cada “não” pequeno treina o “não” grande.'},
 {id:'followup', n:'Fazer um follow-up que estava pendente', way:'founder', ic:'crown', why:'A maioria das vendas morre por falta de follow-up.'},
 {id:'feedback', n:'Pedir feedback a um cliente', way:'founder', ic:'user', why:'Cliente conta o que o dashboard não mostra.'},
 {id:'ideia', n:'Anotar 1 ideia de melhoria para o negócio', way:'founder', ic:'sparkle', why:'Ideia anotada vira experimento; ideia lembrada vira culpa.'}
];

/* Sequência: chamas por tier, marcos e frases do mascote */
SYS.FLAME = [
 {min:0, k:'ash', n:'Cinzas', a:'#6b7280', b:'#a3a3a3'},
 {min:1, k:'ember', n:'Brasa', a:'#ff6a1a', b:'#ffd166'},
 {min:7, k:'gold', n:'Chama Dourada', a:'#f59e0b', b:'#fff1a8'},
 {min:30, k:'blue', n:'Fogo Azul', a:'#2f7bff', b:'#a5f3fc'},
 {min:100, k:'violet', n:'Fogo Violeta', a:'#8b5cf6', b:'#f5b8ff'},
 {min:180, k:'heaven', n:'Chama Celeste', a:'#7dd3fc', b:'#fdf2f8'},
 {min:365, k:'monarch', n:'Chama do Monarca', a:'#1f1233', b:'#facc15'}
];
SYS.STREAK_MS = [3,7,14,30,50,100,180,250,365,500,1000];
SYS.SYSLINES = {
 worried:['Oi. Suas diárias ainda não fizeram check-in. Sem pressão. (Tem pressão.)','O fogo tá te olhando. Eu também.','Você não vai deixar {n} dias virarem cinza, né? Né?','Lembrete amigável e levemente ameaçador: diárias.'],
 panic:['FALTAM {h} PRO RESET. EU NÃO ESTOU NERVOSA. VOCÊ ESTÁ.','{h} para o reset. O fogo tá tremendo. Faz alguma coisa.','Termina as diárias e eu paro de piscar em vermelho.'],
 fresh:['Dia novo no Sistema. As diárias acordaram antes de você.','Reset feito. Página em branco, chama acesa.','Bom dia. O fogo quer lenha.'],
 happy:['Diárias feitas. Pode ir viver. Eu vigio o fogo.','Mais um dia no contador. O NPC que você era tá com inveja.','Garantido por hoje. Missão extra, se quiser ser insuportável.'],
 smug:['Dia EXTRA. Fazendo mais que o mínimo? Quem é você?','Diárias + extra. O Sistema está levemente impressionado. Levemente.','Chama dourada nas bordas. Continua assim e eu começo a te respeitar.'],
 sleepy:['Dia de descanso registrado. Músculo cresce parado. Eu também.','Descansar também é treino. Zzz.','Hoje o fogo fica em brasa baixa. Tá tudo bem.'],
 sad:['O fogo apagou. Acontece. Recomeçar é skill, não vergonha.','Sequência zerada. XP não: esse ninguém tira.','Quer reacender? Runa de Recuperação na loja. Ou recomeça do 1 com dignidade.'],
 frozen:['Um Gelo do Sistema segurou sua sequência. De nada.','Dia perdido, sequência salva. O gelo derreteu no seu lugar.']
};
SYS.MSLINES = {3:'Três dias. Uma faísca vira fogueira assim.',7:'Uma semana! O hábito começou a criar raiz.',14:'Duas semanas. Seu cérebro já tá desconfiando que isso é sério.',30:'30 dias. Isso aqui já é identidade.',50:'50. A coruja de um certo app ficaria orgulhosa.',100:'CEM. Fogo azul. Pode printar. Eu deixo.',180:'Seis meses. O tempo acelerou só pra você.',250:'250 dias. Você virou lenda urbana na sua própria casa.',365:'Um ano. Ajoelhem-se perante o Monarca da Rotina.',500:'500 dias. O Sistema não tem mais piadas. Só respeito.',1000:'MIL DIAS. Isso não é sequência, é biografia.'};

/* Dungeons especiais: entre com uma chave, sobreviva aos dias. Descanso oficial conta como andar vencido. */
SYS.RANKS = ['E','D','C','B','A','S'];
SYS.RANKC = {E:'#9aa6b8', D:'#57d68d', C:'#4fa3ff', B:'#b77bff', A:'#ff9f43', S:'#ff4757'};
SYS.DUNGEONS = [
 {id:'d_goblins', rank:'E', n:'Esgoto dos Goblins da Procrastinação', days:3, lore:'Cheira a “amanhã eu começo”. Os goblins se alimentam de abas abertas.', daily:['Todas as diárias do Sistema','1 missão extra'], rew:{gem:60}, ach:{n:'Exterminador de Goblins', title:'Caça-Goblins', r:'uncommon'}},
 {id:'d_sala', rank:'E', n:'Sala de Espera Liminal', days:3, lore:'Carpete bege, luz fluorescente zumbindo, uma revista de 1998. Ninguém chama seu nome.', daily:['30 min sem tela antes de dormir','10 páginas de leitura','Anotar um sonho ou pensamento ao acordar'], rew:{gem:60, freeze:1}, ach:{n:'Hóspede do Corredor', title:'Hóspede Liminal', r:'uncommon'}},
 {id:'d_biblioteca', rank:'D', n:'Biblioteca Afogada', days:7, lore:'Estantes submersas. Os livros só param de afundar enquanto alguém lê.', daily:['20 páginas de um livro da Biblioteca','3 linhas de fichamento'], fin:['Resenha de 300 palavras do que leu'], rew:{gem:150, chest:'ch_iron'}, ach:{n:'Leitor Submerso', title:'Bibliotecário Afogado', r:'rare'}},
 {id:'d_contador', rank:'D', n:'Caverna do Goblin Contador', days:7, lore:'Um goblin de óculos anota cada moeda que você deixa cair. Ele sabe do iFood.', daily:['Registrar todos os gastos do dia','Nenhuma compra por impulso'], fin:['Revisar a semana e ajustar o orçamento'], rew:{gem:150, chest:'ch_iron'}, ach:{n:'Contador de Moedas', title:'Goblin Contador', r:'rare'}},
 {id:'d_academia', rank:'C', n:'Academia Abandonada', days:14, rest:2, lore:'As barras ainda estão quentes. Alguém treina aqui à noite — e deixa as anilhas no lugar.', daily:['Treino de calistenia OU 15 min de mobilidade','Proteína nas refeições','7h de sono na noite anterior'], rew:{gem:320, chest:'ch_mana'}, ach:{n:'Sobrevivente da Academia', title:'Assombração do Supino', r:'epic'}},
 {id:'d_estudio', rank:'C', n:'Estúdio Assombrado', days:7, rest:1, lore:'A mesa de som liga sozinha às 3h e toca um Amen ao contrário.', daily:['Criar 1 loop de 8 compassos','10 min de treino de ouvido ou técnica'], fin:['Juntar os loops numa faixa de 2 min exportada'], rew:{gem:300, chest:'ch_mana', cos:'nc_haunted'}, ach:{n:'Exorcista de Loops', title:'Produtor Assombrado', r:'epic'}},
 {id:'d_fantasma', rank:'B', n:'Masmorra do Cliente Fantasma', days:10, rest:1, lore:'Propostas enviadas ecoam pelos corredores. Ninguém responde. Até você fazer follow-up.', daily:['1 ação comercial real (follow-up, proposta ou conversa)','Registrar a ação e a resposta'], fin:['Enviar 1 proposta completa com escopo e preço'], rew:{gem:450, chest:'ch_mana'}, ach:{n:'Caçador de Ghosting', title:'Caçador de Ghosting', r:'epic'}},
 {id:'d_memoria', rank:'B', n:'Palácio da Memória', days:14, rest:2, lore:'Cada sala guarda algo que você esqueceu. As portas só abrem com repetição espaçada.', daily:['Revisões do Anki em dia','Teach-back de 1 conceito em 5 linhas'], fin:['Explicar 3 conceitos ao Examinador (nota 70+)'], rew:{gem:450, chest:'ch_mana', freeze:1}, ach:{n:'Arquiteto da Memória', title:'Memória de Cristal', r:'epic'}},
 {id:'d_torre', rank:'A', n:'Torre do Arquiteto Demônio', days:21, rest:3, lore:'21 andares. Em cada um, um demônio pergunta: “e se cair?”', daily:['1 kata de arquitetura (ADR, diagrama, trade-off ou modo de falha)'], fin:['Defesa final ao Examinador com nota 80+'], rew:{gem:800, chest:'ch_monarch', cos:'fr_demon'}, ach:{n:'Conquistador da Torre', title:'Senhor da Torre', r:'legendary'}},
 {id:'d_castelo', rank:'A', n:'Castelo do Escritor Insone', days:30, rest:4, lore:'As velas nunca apagam. As páginas em branco sussurram seu nome às 3h.', daily:['500 palavras novas'], fin:['Rascunho de 15.000 palavras completo'], rew:{gem:900, chest:'ch_monarch', cos:'nc_castle'}, ach:{n:'Senhor do Castelo', title:'Insone Produtivo', r:'legendary'}},
 {id:'d_vermelho', rank:'S', n:'Portão Vermelho', days:30, rest:0, lore:'O portão ficou vermelho. Não dá para sair antes de terminar. Descanso oficial ainda vale — o Sistema não é monstro.', daily:['Todas as diárias','1 missão extra','Avançar o nó ativo (qualquer passo com evidência)'], fin:['Pelo menos 4 nós concluídos durante a dungeon'], rew:{gem:1500, chest:'ch_monarch', chests:2, cos:'nc_redgate'}, ach:{n:'Sobrevivente do Portão Vermelho', title:'Red Gate Survivor', r:'mythic'}},
 {id:'d_monarca', rank:'S', n:'Trono do Monarca da Rotina', days:60, rest:2, lore:'Sessenta dias. No fim, um trono vazio com o seu tamanho.', daily:['Todas as diárias','1 missão extra'], fin:['Carta ao eu de 60 dias atrás'], rew:{gem:2500, chest:'ch_monarch', chests:3, cos:'fr_routine'}, ach:{n:'Monarca da Rotina', title:'Monarca da Rotina', r:'mythic'}}
];
SYS.KEYPRICE = {E:40, D:90, C:180, B:300, A:520, S:900};

/* Baús: odds públicas, pity, duplicata vira ◆. Sem dinheiro real, nunca. */
SYS.CHESTS = [
 {id:'ch_iron', n:'Baú de Ferro', r:'uncommon', c:80, d:'Enferrujado, honesto e surpreendentemente útil.', drops:[[25,{k:'gem',v:30}],[12,{k:'gem',v:70}],[15,{k:'ticket',v:1}],[12,{k:'freeze',v:1}],[15,{k:'key',rank:'E'}],[8,{k:'key',rank:'D'}],[10,{k:'cos',pool:'common'}],[3,{k:'cos',pool:'rare'}]]},
 {id:'ch_mana', n:'Baú de Mana', r:'epic', c:220, d:'Brilha azul. Faz um zumbido que lembra modem discado.', pity:{n:10, pool:'epic'}, drops:[[18,{k:'gem',v:120}],[8,{k:'gem',v:260}],[15,{k:'freeze',v:1}],[15,{k:'key',rank:'D'}],[12,{k:'key',rank:'C'}],[9,{k:'ticket',v:2}],[16,{k:'cos',pool:'rare'}],[6,{k:'cos',pool:'epic'}],[1,{k:'key',rank:'B'}]]},
 {id:'ch_monarch', n:'Baú do Monarca', r:'legendary', c:520, d:'Frio ao toque. Tem uma coroa gravada e um aviso: “não abra por impulso”.', pity:{n:8, pool:'legendary'}, drops:[[15,{k:'gem',v:320}],[6,{k:'gem',v:700}],[12,{k:'freeze',v:2}],[12,{k:'key',rank:'C'}],[12,{k:'key',rank:'B'}],[8,{k:'key',rank:'A'}],[25,{k:'cos',pool:'epic'}],[8,{k:'cos',pool:'legendary'}],[2,{k:'key',rank:'S'}]]}
];
SYS.CHESTCOS = {
 common:[['namecards','nc_rain'],['namecards','nc_crt'],['frames','fr_iron']],
 rare:[['namecards','nc_poolrooms'],['namecards','nc_mall'],['frames','fr_mana'],['fx','fx_mana']],
 epic:[['namecards','nc_redsky'],['namecards','nc_backrooms'],['frames','fr_shadow'],['fx','fx_shadow']],
 legendary:[['namecards','nc_throne'],['frames','fr_throne'],['fx','fx_aurora']]
};
SYS.DUPGEM = {common:20, rare:60, epic:150, legendary:400};
SYS.FREEZE_MAX = 2;

SYS.NAMECARDS.push(
 {id:'nc_rain', n:'Chuva no Vidro', c:0, chest:'common'}, {id:'nc_crt', n:'Monitor CRT', c:0, chest:'common'},
 {id:'nc_poolrooms', n:'Poolrooms', c:0, chest:'rare'}, {id:'nc_mall', n:'Shopping às 3h', c:0, chest:'rare'},
 {id:'nc_redsky', n:'Céu Vermelho', c:0, chest:'epic'}, {id:'nc_backrooms', n:'Nível 0', c:0, chest:'epic'},
 {id:'nc_throne', n:'Salão do Trono', c:0, chest:'legendary'},
 {id:'nc_haunted', n:'Estúdio Assombrado', c:0, dun:'d_estudio'}, {id:'nc_castle', n:'Castelo Insone', c:0, dun:'d_castelo'}, {id:'nc_redgate', n:'Portão Vermelho', c:0, dun:'d_vermelho'}
);
SYS.FRAMES.push(
 {id:'fr_iron', n:'Moldura de Ferro', c:0, r:'common', chest:'common'}, {id:'fr_mana', n:'Moldura de Mana', c:0, r:'rare', chest:'rare'},
 {id:'fr_shadow', n:'Moldura das Sombras', c:0, r:'epic', chest:'epic'}, {id:'fr_throne', n:'Moldura do Trono', c:0, r:'legendary', chest:'legendary'},
 {id:'fr_demon', n:'Moldura do Demônio da Torre', c:0, r:'legendary', dun:'d_torre'}, {id:'fr_routine', n:'Moldura do Monarca da Rotina', c:0, r:'mythic', dun:'d_monarca'}
);
SYS.FX = [
 {id:'fx_cyan', n:'Gradiente ciano', shop:1}, {id:'fx_gold', n:'Dourado', shop:1}, {id:'fx_glitch', n:'Glitch', shop:1},
 {id:'fx_mana', n:'Mana', chest:'rare'}, {id:'fx_shadow', n:'Sombrio', chest:'epic'}, {id:'fx_aurora', n:'Aurora', chest:'legendary'}
];
SYS.SYSSHOP.push(
 {id:'up_freeze', n:'Gelo do Sistema', d:'Protege a sequência num dia perdido — usado automaticamente. Estoque máximo: 2.', c:150, kind:'freeze'},
 {id:'up_repair', n:'Runa de Recuperação', d:'Reacende uma sequência que apagou há até 3 dias, cobrindo até 3 dias perdidos.', c:400, kind:'repair'},
 {id:'up_showcase', n:'Expansão da Vitrine', d:'A vitrine do perfil passa de 8 para 12 medalhas.', c:600, kind:'showcase'}
);

/* Novas conquistas de sistema (v2) */
(function(){
  var G = function(id){ return SYS.SYSACH.filter(function(a){ return a.id === id; })[0]; };
  G('sys_st7').grant = {keys:{E:1}}; G('sys_st30').grant = {keys:{D:1}}; G('sys_st100').grant = {keys:{C:1}, freeze:1}; G('sys_st365').grant = {keys:{A:1}};
  G('sys_st7').title = 'Chama Acesa';
  SYS.SYSACH.push(
   {id:'sys_alem', n:'Prodígio ou Cheater?', d:'O Examinador marcou sua explicação como muito acima do esperado para a quest. Ou é gênio, ou colou. Ele não sabe qual.', r:'epic', ic:'oracle', title:'Suspeito de Hack', ms:1, c:function(D){ return D.examAlem >= 1; }},
   {id:'sys_alem5', n:'Fora da Curva', d:'5 explicações acima do esperado.', r:'legendary', ic:'oracle', title:'Fora da Curva', ms:1, c:function(D){ return D.examAlem >= 5; }},
   {id:'sys_fenix', n:'Fênix de Prova', d:'Reprovou num exame e depois foi aprovado na mesma quest.', r:'rare', ic:'oracle', title:'Fênix de Prova', c:function(D){ return D.examPhoenix >= 1; }},
   {id:'sys_ex25', n:'Freguês do Examinador', d:'25 exames feitos.', r:'rare', ic:'oracle', c:function(D){ return D.examTotal >= 25; }},
   {id:'sys_st3', n:'Faísca', d:'Sequência de 3 dias.', r:'common', ic:'flame', c:function(D){ return D.bestStreak >= 3; }},
   {id:'sys_st14', n:'Duas Semanas de Fogo', d:'Sequência de 14 dias.', r:'uncommon', ic:'flame', c:function(D){ return D.bestStreak >= 14; }},
   {id:'sys_st50', n:'Coruja Orgulhosa', d:'Sequência de 50 dias. Uma coruja verde em algum lugar chorou de orgulho.', r:'rare', ic:'flame', c:function(D){ return D.bestStreak >= 50; }},
   {id:'sys_st180', n:'Meio Ano de Chama', d:'Sequência de 180 dias.', r:'legendary', ic:'flame', title:'Chama Eterna', grant:{keys:{B:1}}, ms:1, c:function(D){ return D.bestStreak >= 180; }},
   {id:'sys_st500', n:'Quinhentos Sóis', d:'Sequência de 500 dias.', r:'legendary', ic:'flame', ms:1, c:function(D){ return D.bestStreak >= 500; }},
   {id:'sys_st1000', n:'Mil Dias', d:'Sequência de 1.000 dias. Isso é biografia.', r:'mythic', ic:'flame', title:'Monarca do Tempo', ms:1, c:function(D){ return D.bestStreak >= 1000; }},
   {id:'sys_extra1', n:'Um Pouco Além', d:'Primeiro dia extra: todas as diárias + 1 missão extra.', r:'common', ic:'sparkle', c:function(D){ return D.extraDays >= 1; }},
   {id:'sys_extra7', n:'Semana Dourada', d:'7 dias extras seguidos.', r:'uncommon', ic:'sparkle', c:function(D){ return D.bestExtraStreak >= 7; }},
   {id:'sys_extra30', n:'Mês Radiante', d:'30 dias extras seguidos.', r:'rare', ic:'sparkle', title:'Radiante', c:function(D){ return D.bestExtraStreak >= 30; }},
   {id:'sys_extra90', n:'Estação de Ouro', d:'90 dias extras seguidos.', r:'epic', ic:'sparkle', title:'Constância Dourada', ms:1, c:function(D){ return D.bestExtraStreak >= 90; }},
   {id:'sys_heaven', n:'Made in Heaven', d:'Seis meses de sequência fazendo extra em TODOS os dias. O tempo acelerou só pra você.', r:'mythic', ic:'sparkle', title:'Made in Heaven', ms:1, c:function(D){ return D.bestExtraStreak >= 180; }},
   {id:'sys_x100', n:'Cem Pequenas Vitórias', d:'100 missões extras feitas.', r:'uncommon', ic:'check', c:function(D){ return D.extrasTotal >= 100; }},
   {id:'sys_x1000', n:'Mil Gentilezas Consigo', d:'1.000 missões extras feitas.', r:'epic', ic:'check', title:'Autocuidado Rank S', c:function(D){ return D.extrasTotal >= 1000; }},
   {id:'sys_freeze', n:'Congelado no Tempo', d:'Um Gelo do Sistema salvou sua sequência.', r:'uncommon', ic:'moon', c:function(D){ return D.freezesUsed >= 1; }},
   {id:'sys_repair', n:'Reacendido', d:'Usou uma Runa de Recuperação.', r:'rare', ic:'flame', c:function(D){ return D.repairsUsed >= 1; }},
   {id:'sys_chest1', n:'Primeiro Baú', d:'Abriu o primeiro baú.', r:'common', ic:'bag', c:function(D){ return D.chestsOpened >= 1; }},
   {id:'sys_chest25', n:'Viciado em Baú? (Não)', d:'25 baús abertos.', r:'rare', ic:'bag', title:'Caçador de Baús', c:function(D){ return D.chestsOpened >= 25; }},
   {id:'sys_lucky', n:'Filho da Sorte', d:'Tirou um cosmético lendário num baú.', r:'epic', ic:'star', title:'Filho da Sorte', c:function(D){ return D.luckyDrop; }},
   {id:'sys_f2p', n:'F2P Supremo', d:'Acumulou 3.000 ◆ sem torrar. Os gachas choram.', r:'rare', ic:'gem', title:'F2P Supremo', c:function(D){ return D.gem >= 3000; }},
   {id:'sys_dun1', n:'Primeira Dungeon', d:'Limpou uma dungeon especial.', r:'uncommon', ic:'gate', c:function(D){ return D.dunCleared >= 1; }},
   {id:'sys_dun5', n:'Explorador de Portais', d:'5 dungeons limpas.', r:'epic', ic:'gate', title:'Explorador de Portais', c:function(D){ return D.dunCleared >= 5; }},
   {id:'sys_dunS', n:'Hunter Rank S', d:'Limpou uma dungeon Rank S.', r:'legendary', ic:'crown', title:'Hunter Rank S', ms:1, c:function(D){ return D.dunClearedS >= 1; }},
   {id:'sys_dunback', n:'Voltou do Portal', d:'Falhou numa dungeon e depois limpou outra.', r:'uncommon', ic:'gate', title:'Teimoso', c:function(D){ return D.dunComeback; }},
   {id:'sys_feat1', n:'Feito Real', d:'Primeiro Feito da vida real registrado.', r:'common', ic:'flag', c:function(D){ return D.featsDone >= 1; }},
   {id:'sys_feat10', n:'Lenda Local', d:'10 Feitos.', r:'rare', ic:'flag', title:'Lenda Local', c:function(D){ return D.featsDone >= 10; }},
   {id:'sys_feat30', n:'Protagonista', d:'30 Feitos.', r:'epic', ic:'flag', title:'Protagonista', ms:1, c:function(D){ return D.featsDone >= 30; }},
   {id:'sys_feat60', n:'Vida de Anime', d:'60 Feitos. Sua vida tem arco de personagem.', r:'legendary', ic:'flag', title:'Vida de Anime', ms:1, c:function(D){ return D.featsDone >= 60; }},
   {id:'sys_renasc', n:'Renascentista', d:'Concluiu nós nos 7 Caminhos na mesma semana.', r:'epic', ic:'eye', title:'Renascentista', c:function(D){ return D.renasc; }},
   {id:'sys_rank_s', n:'Rank S', d:'Chegue ao nível 55.', r:'epic', ic:'crown', title:'Rank S', ms:1, c:function(D){ return D.level >= 55; }},
   {id:'sys_arise', n:'ARISE', d:'Nível 99 e todos os selos. As sombras se levantam.', r:'mythic', ic:'crown', title:'Monarca das Sombras', ms:1, c:function(D){ return D.level >= 99 && D.gatesDone >= D.gatesTotal; }},
   {id:'sys_tri', n:'Tri-Vertente', d:'Dominou 3 vertentes por completo.', r:'epic', ic:'star', title:'Especialista Múltiplo', c:function(D){ return D.branchesMastered >= 3; }},
   {id:'sec_odds', n:'Leu as Letras Miúdas', d:'Abriu a tabela de probabilidades dos baús. Consumidor consciente detectado.', r:'common', ic:'eye', secret:1, c:function(D){ return D.flags.odds; }},
   {id:'sec_fri13', n:'Sexta-feira 13', d:'Derrotou um boss numa sexta-feira 13.', r:'rare', ic:'moon', secret:1, title:'Azarado Profissional', c:function(D){ return D.fri13; }},
   {id:'sec_clutch', n:'Clutch', d:'Completou as diárias nos últimos 10 minutos antes do reset.', r:'rare', ic:'clock', secret:1, title:'Clutch', c:function(D){ return D.flags.clutch; }}
  );
})();
