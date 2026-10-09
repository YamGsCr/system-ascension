/* ===== GAMIFICAÇÃO: raridade, níveis, conquistas, títulos, diárias, certificações, cosméticos, regras ===== */
SYS.RARITY = {
  common:{n:'Comum',c:'#9aa6b8',gem:10},
  uncommon:{n:'Incomum',c:'#57d68d',gem:25},
  rare:{n:'Raro',c:'#4fa3ff',gem:50},
  epic:{n:'Épico',c:'#b77bff',gem:100},
  legendary:{n:'Lendário',c:'#f2c14e',gem:200},
  mythic:{n:'Mítico',c:'#ff5470',gem:500}
};
SYS.RARITY_ORDER = ['common','uncommon','rare','epic','legendary','mythic'];
SYS.LETTERS = [[1,'E'],[10,'D'],[20,'C'],[30,'B'],[40,'A'],[55,'S'],[70,'SS'],[85,'SSS']];
SYS.GRANKS = [[0,'Initiate'],[1500,'Field Operator'],[4000,'Systems Adept'],[8000,'Senior Operator'],[13000,'Pathfinder'],[19000,'Architect of Ways'],[26000,'High Caliber'],[34000,'Master of Ways'],[45000,'Open World']];
SYS.MAXLVL = 99;
SYS.xpNeed = function(L){ var k=L-1; return 10*k*k + 40*k; };
SYS.DISC_LV = ['Não iniciado','Novato','Aprendiz','Proficiente','Avançado','Mestre'];

SYS.GATEACH = {
  arch_g1:{n:'Antes do Framework',title:'Junior Cartographer'}, arch_g2:{n:'Supervisor dos Goblins',title:'System Builder'},
  arch_g3:{n:'Última Unidade',title:'Data Warden'}, arch_g4:{n:'A Serra Derrubou a Internet',title:'Messenger of Eventually'},
  arch_g5:{n:'Tenant Guardian',title:'Keeper of Boundaries'}, arch_g6:{n:'Cloud Binder',title:'Cloud Binder'},
  arch_g7:{n:'Production Survivor',title:'Production Survivor'}, arch_g8:{n:'Cost Architect',title:'Cost Architect'},
  arch_g9:{n:'Enterprise Cartographer',title:'Enterprise Cartographer'}, arch_g10:{n:'THE ARCHITECT',title:'The Architect'},
  arch_s1:{n:'Domador de Oráculos',title:'Oracle Tamer'}, arch_s2:{n:'Senhor dos Cabos',title:'Lord of Cables'},
  fl_g1:{n:'Olhos Abertos',title:'Observer'}, fl_g2:{n:'Scene Maker',title:'Scene Maker'}, fl_g3:{n:'Bíblia Viva',title:'Worldsmith of Entrepôt'},
  fl_g4:{n:'Story Architect',title:'Story Architect'}, fl_g5:{n:'Autor em Campo',title:'Author'}, fl_g6:{n:'Keeper of Roads',title:'Keeper of Roads'},
  fl_s1:{n:'Flâneur da Serra',title:'Flâneur da Serra'}, fl_s2:{n:'O Estranho',title:'Keeper of the Eerie'},
  ae_g1:{n:'Primeiro Passo',title:'Initiate of Iron'}, ae_g2:{n:'Força Educada',title:'Calisthenic Adept'}, ae_g3:{n:'Skill Desbloqueada',title:'Skill Hunter'},
  ae_g4:{n:'Combustível Limpo',title:'Well-Fueled'}, ae_g5:{n:'Pele em Dia',title:'Barrier Keeper'}, ae_g6:{n:'Silhueta',title:'Silhouette'}, ae_g7:{n:'THE AESTHETE',title:'The Aesthete'},
  na_g1:{n:'Mapa na Mão',title:'Chartmaker'}, na_g2:{n:'Matemática do Tempo',title:'Snowball Tamer'}, na_g3:{n:'Leitor de Tempestades',title:'Storm Reader'},
  na_g4:{n:'Olho de Mercado',title:'Market Reader'}, na_g5:{n:'Estação Meteorológica',title:'Weather Keeper'}, na_g6:{n:'Capitão',title:'Captain'}, na_g7:{n:'Almirantado',title:'Capital Navigator'},
  ar_g1:{n:'Ouvido Ligado',title:'Listener'}, ar_g2:{n:'Teórico do Caos',title:'Theorist'}, ar_g3:{n:'Estúdio Aceso',title:'Producer'},
  ar_g4:{n:'Cirurgião do Amen',title:'Amen Surgeon'}, ar_g5:{n:'Alquimista do Grave',title:'Bass Alchemist'}, ar_g6:{n:'Arquiteto de Faixas',title:'Track Architect'},
  ar_g7:{n:'No Mundo',title:'Released'}, ar_g8:{n:'O Seletor',title:'The Selector'}, ar_g9:{n:'Cordas Vivas',title:'String Bearer'}, ar_g10:{n:'SUBTILIOR',title:'Subtilior'},
  fo_g1:{n:'Ouvido de Cliente',title:'Customer Whisperer'}, fo_g2:{n:'Preço Justo',title:'Price Maker'}, fo_g3:{n:'Blindado',title:'Contract Keeper'},
  fo_g4:{n:'Operação Fluindo',title:'Operator'}, fo_g5:{n:'Marca Viva',title:'Brand Keeper'}, fo_g6:{n:'CTO Fracionado',title:'Fractional CTO'}, fo_g7:{n:'A Máquina Roda Sozinha',title:'Holding Architect'},
  mi_g1:{n:'Mente Afiada',title:'Skeptic'}, mi_g2:{n:'Filósofo de Balcão',title:'Philosopher'}, mi_g3:{n:'Psique Mapeada',title:'Mind Mechanic'},
  mi_g4:{n:'A Descida',title:'Shadow Integrator'}, mi_g5:{n:'Orador',title:'Rhetor'}, mi_g6:{n:'THE LUCID',title:'The Lucid'}
};

/* Conquistas de sistema. D = estado derivado (engine) */
SYS.SYSACH = [
 {id:'sys_first',n:'Player Registrado',d:'Complete o primeiro nó de qualquer Caminho.',r:'common',ic:'check',c:function(D){return D.nodesDone>=1},ms:1},
 {id:'sys_n10',n:'Aprendiz do Sistema',d:'Complete 10 nós.',r:'uncommon',ic:'scroll',c:function(D){return D.nodesDone>=10}},
 {id:'sys_n50',n:'Veterano',d:'Complete 50 nós.',r:'rare',ic:'scroll',c:function(D){return D.nodesDone>=50},ms:1},
 {id:'sys_n100',n:'Centurião',d:'Complete 100 nós.',r:'epic',ic:'scroll',c:function(D){return D.nodesDone>=100},ms:1},
 {id:'sys_n200',n:'Lenda Viva',d:'Complete 200 nós.',r:'legendary',ic:'scroll',c:function(D){return D.nodesDone>=200},ms:1},
 {id:'sys_boss1',n:'Primeiro Boss',d:'Derrote o primeiro boss.',r:'rare',ic:'sword',c:function(D){return D.bossesDone>=1},ms:1},
 {id:'sys_boss5',n:'Caçador de Bosses',d:'Derrote 5 bosses.',r:'epic',ic:'sword',c:function(D){return D.bossesDone>=5},ms:1},
 {id:'sys_boss15',n:'Exterminador',d:'Derrote 15 bosses.',r:'legendary',ic:'sword',c:function(D){return D.bossesDone>=15},ms:1},
 {id:'sys_gate1',n:'Portão Aberto',d:'Conquiste o primeiro Selo/Portão.',r:'uncommon',ic:'gate',c:function(D){return D.gatesDone>=1}},
 {id:'sys_gate5',n:'Quebra-Portões',d:'Conquiste 5 Selos/Portões.',r:'rare',ic:'gate',c:function(D){return D.gatesDone>=5}},
 {id:'sys_gate15',n:'Chave-Mestra',d:'Conquiste 15 Selos/Portões.',r:'epic',ic:'gate',c:function(D){return D.gatesDone>=15}},
 {id:'sys_final1',n:'Primeiro Portão Final',d:'Conquiste o Selo Final de qualquer Caminho.',r:'legendary',ic:'crown',c:function(D){return D.finalsDone>=1},ms:1},
 {id:'sys_allgates',n:'Todos os Selos',d:'Conquiste todos os Selos de todos os Caminhos.',r:'mythic',ic:'crown',c:function(D){return D.gatesDone>=D.gatesTotal},ms:1},
 {id:'sys_lv10',n:'Despertar',d:'Chegue ao Nível 10.',r:'uncommon',ic:'sparkle',c:function(D){return D.level>=10},ms:1},
 {id:'sys_lv25',n:'Ascendente',d:'Chegue ao Nível 25.',r:'rare',ic:'sparkle',c:function(D){return D.level>=25},ms:1},
 {id:'sys_lv50',n:'Transcendente',d:'Chegue ao Nível 50.',r:'epic',ic:'sparkle',c:function(D){return D.level>=50},ms:1},
 {id:'sys_lv75',n:'Além do Limite',d:'Chegue ao Nível 75.',r:'legendary',ic:'sparkle',c:function(D){return D.level>=75},ms:1},
 {id:'sys_lv99',n:'Nível Máximo',d:'Chegue ao Nível 99.',r:'mythic',ic:'sparkle',c:function(D){return D.level>=99},ms:1},
 {id:'sys_st7',n:'Semana Perfeita',d:'Sequência de 7 dias de diárias (descanso conta).',r:'uncommon',ic:'flame',c:function(D){return D.bestStreak>=7}},
 {id:'sys_st30',n:'Mês de Ferro',d:'Sequência de 30 dias.',r:'rare',ic:'flame',c:function(D){return D.bestStreak>=30},ms:1},
 {id:'sys_st100',n:'Centenário',d:'Sequência de 100 dias.',r:'epic',ic:'flame',c:function(D){return D.bestStreak>=100},ms:1},
 {id:'sys_st365',n:'Ano Lendário',d:'Sequência de 365 dias.',r:'legendary',ic:'flame',c:function(D){return D.bestStreak>=365},ms:1},
 {id:'sys_d50',n:'Rotina Viva',d:'50 dias com todas as diárias feitas (não precisa ser seguido).',r:'uncommon',ic:'target',c:function(D){return D.dailyDays>=50}},
 {id:'sys_d200',n:'Ritual',d:'200 dias com todas as diárias feitas.',r:'epic',ic:'target',c:function(D){return D.dailyDays>=200}},
 {id:'sys_w4',n:'Semana Fechada x4',d:'Feche 4 semanas no Diário.',r:'uncommon',ic:'pen',c:function(D){return D.weeksCleared>=4}},
 {id:'sys_w12',n:'Trimestre Fechado',d:'Feche 12 semanas.',r:'rare',ic:'pen',c:function(D){return D.weeksCleared>=12}},
 {id:'sys_w52',n:'Um Ano de Semanas',d:'Feche 52 semanas.',r:'legendary',ic:'pen',c:function(D){return D.weeksCleared>=52},ms:1},
 {id:'sys_m3',n:'Reunião Consigo Mesmo',d:'Faça 3 revisões mensais.',r:'uncommon',ic:'journal',c:function(D){return D.monthsDone>=3}},
 {id:'sys_m12',n:'Doze Luas',d:'Faça 12 revisões mensais.',r:'epic',ic:'journal',c:function(D){return D.monthsDone>=12},ms:1},
 {id:'sys_grass10',n:'Tocou Grama',d:'Registre 10 momentos de tocar grama.',r:'uncommon',ic:'grass',c:function(D){return D.touchGrass>=10}},
 {id:'sys_grass50',n:'Druida',d:'Registre 50 momentos de tocar grama.',r:'rare',ic:'grass',c:function(D){return D.touchGrass>=50}},
 {id:'sys_rest',n:'Descanso Sem Culpa',d:'Registre 5 dias de descanso. Burnout não é achievement.',r:'common',ic:'moon',c:function(D){return D.restDays>=5}},
 {id:'sys_return',n:'Renascido',d:'Volte ao Sistema depois de 14+ dias longe. Sem sermão.',r:'uncommon',ic:'sparkle',c:function(D){return D.returned>=1}},
 {id:'sys_b1',n:'Primeira Página',d:'Marque 1 livro como lido e aplicado.',r:'common',ic:'book',c:function(D){return D.booksRead>=1}},
 {id:'sys_b10',n:'Biblioteca Viva',d:'10 livros lidos e aplicados.',r:'rare',ic:'book',c:function(D){return D.booksRead>=10},ms:1},
 {id:'sys_b30',n:'Devorador de Livros',d:'30 livros lidos e aplicados.',r:'legendary',ic:'book',c:function(D){return D.booksRead>=30},ms:1},
 {id:'sys_ex1',n:'Examinado',d:'Seja aprovado pelo Examinador pela primeira vez.',r:'uncommon',ic:'oracle',c:function(D){return D.examPasses>=1}},
 {id:'sys_ex10',n:'Defensor',d:'10 aprovações no Examinador.',r:'epic',ic:'oracle',c:function(D){return D.examPasses>=10}},
 {id:'sys_ex95',n:'Nota Máxima',d:'Tire 95+ no Examinador.',r:'rare',ic:'oracle',c:function(D){return D.examBest>=95}},
 {id:'sys_poly3',n:'Polímata',d:'Chegue ao 3º título de nível em 3 Caminhos.',r:'rare',ic:'eye',c:function(D){return D.waysTier3>=3}},
 {id:'sys_poly7',n:'Mestre dos Caminhos',d:'Chegue ao 4º título de nível em todos os 7 Caminhos.',r:'legendary',ic:'eye',c:function(D){return D.waysTier4>=7},ms:1},
 {id:'sys_buy1',n:'Primeira Compra',d:'Compre um item em qualquer loja.',r:'common',ic:'bag',c:function(D){return D.buysCount>=1}},
 {id:'sys_cd',n:'Paciência de Monge',d:'Conclua uma compra depois do cooldown.',r:'uncommon',ic:'clock',c:function(D){return D.cooldownDone>=1}},
 {id:'sys_cancel',n:'Impulso Derrotado',d:'Desista de uma compra durante o cooldown.',r:'rare',ic:'clock',c:function(D){return D.cooldownCanceled>=1}},
 {id:'sys_goal1',n:'Meta Batida',d:'Conclua uma meta.',r:'uncommon',ic:'target',c:function(D){return D.goalsDone>=1},ms:1},
 {id:'sys_goal5',n:'Arquiteto de Futuros',d:'Conclua 5 metas.',r:'epic',ic:'target',c:function(D){return D.goalsDone>=5},ms:1},
 {id:'sys_ow1',n:'Mundo Aberto',d:'Resolva uma quest de Mundo Aberto (lacuna real de projeto).',r:'rare',ic:'map',c:function(D){return D.openDone>=1}},
 {id:'sys_cert1',n:'Certificado',d:'Seja aprovado em uma certificação.',r:'epic',ic:'cert',c:function(D){return D.certsPassed>=1},ms:1},
 {id:'sys_profile',n:'Identidade Forjada',d:'Defina nome, equipe um título e fixe 3 medalhas na vitrine.',r:'common',ic:'user',c:function(D){return D.profileDone}},
 {id:'sys_ach25',n:'Colecionador',d:'Desbloqueie 25 conquistas.',r:'rare',ic:'medal',c:function(D){return D.achCount>=25}},
 {id:'sys_ach100',n:'Sala de Troféus',d:'Desbloqueie 100 conquistas.',r:'legendary',ic:'medal',c:function(D){return D.achCount>=100}},
 {id:'sec_333',n:'Insônia Liminal',d:'O Sistema viu você acordado às 3h. Agora vai dormir, criatura.',r:'common',ic:'moon',secret:1,c:function(D){return D.flags.three}},
 {id:'sec_logo',n:'Cutucador do Sistema',d:'Clicou 10 vezes no logo. Satisfeito?',r:'common',ic:'sparkle',secret:1,c:function(D){return D.flags.logo}},
 {id:'sec_konami',n:'Código Antigo',d:'↑↑↓↓←→←→BA. Uma skin estranha foi liberada.',r:'rare',ic:'sparkle',secret:1,c:function(D){return D.flags.konami}},
 {id:'sec_skins',n:'Colecionador de Realidades',d:'Tenha todas as skins de interface.',r:'epic',ic:'eye',secret:1,c:function(D){return D.allSkins}}
];

SYS.DAILIES = [
 {id:'focus',n:'Foco Profundo',d:'60–90 min no nó ativo do seu Caminho principal (o primeiro da lista).',way:'$main',xp:6,cr:3,ic:'target',def:1},
 {id:'move',n:'Movimento',d:'Treino do dia — ou 15 min de mobilidade no dia de descanso.',way:'aesthetic',xp:4,cr:2,ic:'flame',def:1},
 {id:'read',n:'Leitura',d:'20 páginas ou 20 minutos de um livro da Biblioteca.',way:'$read',xp:3,cr:2,ic:'book',def:1},
 {id:'sound',n:'Som',d:'20 min de instrumento, treino de ouvido ou DAW.',way:'ars',xp:3,cr:2,ic:'wave',def:1},
 {id:'log',n:'Registro',d:'3 linhas: o que aprendi, o que travou, próximo passo.',way:'mind',xp:2,cr:1,ic:'pen',def:1},
 {id:'cash',n:'Caixa em Dia',d:'Lançar entradas e saídas (pessoal e negócio).',way:'navigation',xp:2,cr:1,ic:'helm',def:0},
 {id:'deal',n:'Movimento de Fundador',d:'1 ação comercial: follow-up, proposta, post de prova ou conversa com cliente.',way:'founder',xp:2,cr:1,ic:'crown',def:0},
 {id:'grass',n:'Tocar Grama',d:'20 min fora de tela, sem ROI nenhum.',way:null,xp:2,cr:0,gem:3,ic:'grass',def:0}
];

SYS.CERTS = [
 {id:'az900',n:'AZ-900 · Azure Fundamentals',way:'architect',pri:'Opcional',when:'Início do Ato VI',notBefore:'A67 (primitivas de nuvem) completo.',prep:'Trilha oficial do Microsoft Learn + practice assessment.',pass:'Vocabulário de nuvem validado — não é prova de arquitetura.',url:'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/',xp:60,title:'Azure Fundamentals'},
 {id:'az104',n:'AZ-104 · Azure Administrator',way:'architect',pri:'Alta',when:'Depois da Semana 32',notBefore:'Boss VI completo; gate de rede/CIDR; lab de IaC; managed identity; monitoramento básico.',prep:'Trilha oficial + labs + practice assessment + revisão de lacunas.',pass:'Você administra e diagnostica o Azure que suas arquiteturas usam.',url:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104',xp:150,title:'Azure Administrator'},
 {id:'az305',n:'AZ-305 · Azure Solutions Architect Expert',way:'architect',pri:'Alta',when:'Semanas 43–44',notBefore:'Fluência nível AZ-104; arcos de confiabilidade, BCDR, FinOps e governança; Cerberus quase completo.',prep:'Trilha oficial + practice assessment + estudos de caso de arquitetura.',pass:'Você traduz requisitos de negócio em design Azure com trade-offs.',url:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305',xp:200,title:'Solutions Architect Expert'},
 {id:'sc900',n:'SC-900 · Security, Compliance & Identity Fundamentals',way:'architect',pri:'Opcional',when:'Depois da Semana 23',notBefore:'AuthN/AuthZ + threat model + LGPD completos.',prep:'Conteúdo oficial do Microsoft Learn + practice assessment.',pass:'Vocabulário de segurança e identidade — não é expertise em segurança.',url:'https://learn.microsoft.com/pt-br/credentials/certifications/resources/study-guides/sc-900',xp:60,title:'Security Fundamentals'},
 {id:'itil5',n:'ITIL Foundation (Version 5)',way:'architect',pri:'Média',when:'Depois do Ato VII',notBefore:'A83 (incidentes & ITIL) completo e um runbook real escrito.',prep:'Material oficial PeopleCert (a Version 5 foi lançada em 2026; a ITIL 4 segue válida em paralelo).',pass:'Linguagem de gestão de serviços para contratos, SLAs e operação com clientes.',url:'https://www.peoplecert.org/',xp:80,title:'Service Steward'},
 {id:'tf004',n:'HashiCorp Terraform Associate (004)',way:'architect',pri:'Opcional',when:'Depois da Semana 31',notBefore:'A74 completo e 2 ambientes recriados só por código.',prep:'Tutoriais oficiais da HashiCorp (a versão 004 substituiu a 003 em janeiro de 2026).',pass:'IaC portável entre nuvens.',url:'https://developer.hashicorp.com/terraform/tutorials',xp:80,title:'Infra Scribe'},
 {id:'togaf',n:'TOGAF Enterprise Architecture Foundation',way:'architect',pri:'Opcional',when:'Mundo Aberto',notBefore:'Ato IX completo e necessidade real de arquitetura corporativa.',prep:'TOGAF Standard, 10ª edição + guias da The Open Group.',pass:'Vocabulário de arquitetura corporativa reconhecido.',url:'https://www.opengroup.org/certifications/togaf-certification-portfolio',xp:80,title:'Enterprise Scribe'},
 {id:'aws',n:'AWS Solutions Architect – Associate (SAA-C03)',way:'architect',pri:'Alternativa',when:'Se clientes usarem AWS',notBefore:'A68 (Rosetta) + Gate VI completos.',prep:'AWS Skill Builder + labs.',pass:'Mesmo raciocínio arquitetural na outra nuvem.',url:'https://aws.amazon.com/certification/certified-solutions-architect-associate/',xp:150,title:'AWS Architect'},
 {id:'ai103',n:'AI-103 · Azure AI App and Agent Developer',way:'architect',pri:'Opcional',when:'Mundo Aberto',notBefore:'Arco Machine Minds completo (substituiu a AI-102 em 2026).',prep:'Trilha oficial do Microsoft Learn.',pass:'Apps e agentes de IA em produção no Azure.',url:'https://learn.microsoft.com/credentials/',xp:80,title:'Agent Smith'},
 {id:'dp700',n:'DP-700 · Fabric Data Engineer Associate',way:'architect',pri:'Opcional',when:'Mundo Aberto',notBefore:'Necessidade real de lakehouse/pipelines OU especialização deliberada.',prep:'Trilha oficial de Fabric Data Engineer + projeto prático.',pass:'Especialização em dados além da base de Solution Architect.',url:'https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/',xp:80,title:'Data Engineer'},
 {id:'cpa',n:'ANBIMA CPA (nova certificação, sucessora da CPA-10)',way:'navigation',pri:'Opcional',when:'Depois do Arco III do Navigation',notBefore:'V05 e V06 completos.',prep:'Material ANBIMA Edu (o novo trio é CPA, C-Pro R e C-Pro I).',pass:'Base formal do mercado financeiro brasileiro — só se for útil para você.',url:'https://anbimaedu.com.br/certificacoes',xp:60,title:'Market Certified'}
];

SYS.SKINS = [
 {id:'sk_system',n:'System Blue',d:'A janela padrão do Sistema.',c:0,free:1},
 {id:'sk_violet',n:'Violeta Abissal',d:'Para quem já olhou para dentro de um Portão Final.',c:800},
 {id:'sk_liminal',n:'Liminal Pool',d:'Azulejo, eco e água parada às 3h da manhã.',c:900},
 {id:'sk_vhs',n:'Analog Horror',d:'Fita encontrada. Não rebobine.',c:1000},
 {id:'sk_dream',n:'Dreamcore',d:'Pastel, nuvens e a sensação de já ter estado aqui.',c:1000},
 {id:'sk_cerne',n:'Cerne',d:'Verde-floresta e bronze. Liberada pelo Selo “Marca Viva”.',c:0,ach:'fo_g5'},
 {id:'sk_rave',n:'Jungle Rave',d:'Galpão, strobo e sub no peito. Liberada pelo “Cirurgião do Amen”.',c:0,ach:'ar_g4'},
 {id:'sk_glitch',n:'Glitch',d:'Uma skin que não deveria existir.',c:0,ach:'sec_konami',secret:1}
];
SYS.NAMECARDS = [
 {id:'nc_window',n:'Janela do Sistema',c:0,free:1},
 {id:'nc_grid',n:'Grade Azul',c:0,free:1},
 {id:'nc_liminal',n:'Corredor Liminal',c:300},
 {id:'nc_pool',n:'Piscina Vazia',c:300},
 {id:'nc_dream',n:'Nuvens de Dreamcore',c:400},
 {id:'nc_vhs',n:'Fita VHS Encontrada',c:400},
 {id:'nc_serra',n:'Neblina da Serra',c:0,ach:'fl_s1'},
 {id:'nc_rave',n:'Rave de Galpão',c:0,ach:'ar_g8'},
 {id:'nc_rings',n:'Anéis do Cerne',c:0,ach:'fo_g6'},
 {id:'nc_void',n:'Vazio Estrelado',c:0,ach:'sys_lv50'},
 {id:'nc_gate',n:'Portão Violeta',c:0,ach:'sys_final1'},
 {id:'nc_gold',n:'Salão Dourado',c:0,ach:'sys_allgates'}
];
SYS.FRAMES = [
 {id:'fr_basic',n:'Moldura Base',c:0,free:1,r:'common'},
 {id:'fr_rare',n:'Moldura Rara',c:250,r:'rare'},
 {id:'fr_epic',n:'Moldura Épica',c:600,r:'epic'},
 {id:'fr_legend',n:'Moldura Lendária',c:0,ach:'sys_lv50',r:'legendary'},
 {id:'fr_mythic',n:'Moldura Mítica',c:0,ach:'sys_allgates',r:'mythic'},
 {id:'fr_glitch',n:'Moldura Glitch',c:0,ach:'sec_konami',r:'epic'}
];
SYS.SYSSHOP = [
 {id:'tk_rest',n:'Ticket: Dia Livre Extra',d:'Um dia de descanso além dos 2 por semana, sem quebrar a sequência.',c:60,kind:'ticket'},
 {id:'fx_cyan',n:'Nome em gradiente ciano',d:'Seu nome brilha no perfil.',c:200,kind:'fx'},
 {id:'fx_gold',n:'Nome dourado',d:'Para quem gosta de ser visto.',c:350,kind:'fx'},
 {id:'fx_glitch',n:'Nome glitch',d:'Seu nome falha de propósito.',c:450,kind:'fx'},
 {id:'ct_title',n:'Título Customizado',d:'Escreva o seu próprio título (até 28 caracteres).',c:500,kind:'custom'}
];

SYS.GOAL_SUGGESTIONS = [
 {t:'Passar na AZ-104',way:'architect',h:'1a',krs:[['Worksheet de rede (A69)','A69'],['IaC reproduzível (A74)','A74'],['Prontidão AZ-104 (A75)','A75'],['Aprovado na prova',null]]},
 {t:'Publicar o primeiro conto ou zine',way:'flaneur',h:'6m',krs:[['2 contos finalizados (F16)','F16'],['Author Pack (F18)','F18'],['Publicado (F20)','F20']]},
 {t:'5 barras limpas',way:'aesthetic',h:'6m',krs:[['Consistência (E02)','E02'],['Progressão de puxar (E04)','E04']]},
 {t:'Escrever minha IPS v1',way:'navigation',h:'3m',krs:[['Mapa de risco (V05)','V05'],['Renda fixa (V06)','V06'],['IPS v1 (V11)','V11']]},
 {t:'Lançar a primeira faixa de jungle',way:'ars',h:'6m',krs:[['Amen Surgeon (M15)','M15'],['Mix (M24)','M24'],['Lançamento (M26)','M26']]},
 {t:'Tocar um set de drum & bass num rolê real',way:'ars',h:'1a',krs:[['Beatmatching sem sync (M27)','M27'],['Double drops (M28)','M28'],['O Set (M30)','M30'],['Tocar para público',null]]},
 {t:'Fechar o primeiro retainer de CTO fracionado',way:'founder',h:'1a',krs:[['Diagnóstico técnico (B17)','B17'],['Oferta de retainer (B19)','B19'],['Primeiro Retainer (B23)','B23']]},
 {t:'CERNE com as 3 esteiras rodando',way:'founder',h:'3a',krs:[['SaaS com clientes pagantes',null],['Web sob demanda recorrente',null],['Produto local vendido',null],['Métricas SaaS (B06)','B06']]},
 {t:'Terminar o Tratado Pessoal',way:'mind',h:'3a',krs:[['Ensaio & debate (P22)','P22'],['Diálogo Socrático (P23)','P23'],['Tratado Pessoal (P24)','P24']]},
 {t:'Derrotar o Cerberus',way:'architect',h:'3a',krs:[['Gate IV · Filial Offline',null],['Gate VII · Produção Hostil',null],['FINAL BOSS · CERBERUS (A94)','A94']]}
];

SYS.WEEKLY = [
 {k:'main',n:'Missão principal avançou',ph:'Qual nó avançou e o que saiu de evidência?'},
 {k:'side',n:'Missão lateral',ph:'Algo de outro Caminho ou um projeto real.'},
 {k:'physical',n:'Corpo',ph:'Treinos, sono, mobilidade.'},
 {k:'creative',n:'Criativo',ph:'Escreveu, observou, leu com intenção?'},
 {k:'money',n:'Dinheiro',ph:'Caixa, decisão financeira, lição.'},
 {k:'sound',n:'Som',ph:'Tocou, produziu, mixou, treinou ouvido?'},
 {k:'mind',n:'Mente',ph:'Ideia, leitura, reflexão, conversa difícil.'}
];
SYS.MONTHLY = [
 {k:'learned',n:'ARCHITECT · aprendi'},{k:'built',n:'ARCHITECT · construí ou quebrei'},
 {k:'wrote',n:'FLÂNEUR · escrevi / li'},{k:'trained',n:'AESTHETIC · treinei e cuidei'},
 {k:'money',n:'NAVIGATION · lição de dinheiro'},{k:'sound',n:'ARS SUBTILIOR · produzi / toquei'},
 {k:'business',n:'FOUNDER · o que mudou no negócio'},{k:'mind',n:'MIND · insight do mês'},
 {k:'useless',n:'VIDA · fiz algo inútil e bom?'},{k:'nextBoss',n:'BOSS DO PRÓXIMO MÊS'}
];

SYS.RULES = [
 {k:'KNOW',d:'Explicar o conceito com vocabulário próprio, exemplos e limites.',why:'Evita memorização vazia.',pass:'Explica sem consultar notas.',fail:'Só repete definição de livro.'},
 {k:'DECIDE',d:'Comparar alternativas e justificar a escolha para um contexto.',why:'Arquitetura (e vida) é decisão sob restrições.',pass:'Defende e também muda de ideia se as premissas mudarem.',fail:'Usa “é melhor” sem contexto.'},
 {k:'OPERATE',d:'Construir, configurar, testar ou diagnosticar uma versão mínima.',why:'Evita o arquiteto de PowerPoint.',pass:'Laboratório reproduzível.',fail:'Só sabe desenhar.'},
 {k:'FAIL',d:'Descrever modos de falha, detecção, impacto, recuperação e prevenção.',why:'Produção é ambiente hostil.',pass:'Tem resposta para “e se cair?”.',fail:'Tudo funciona só no caminho feliz.'},
 {k:'TEACH-BACK',d:'Ensinar em 5–15 min para alguém, sem jargão desnecessário.',why:'Prova entendimento.',pass:'A pessoa entende o problema e a decisão.',fail:'A explicação depende de buzzword.'},
 {k:'GATE',d:'Pré-requisito obrigatório antes de avançar.',why:'Evita buracos invisíveis.',pass:'Todos os itens do selo estão demonstrados.',fail:'Avançou porque a semana acabou.'},
 {k:'BOSS',d:'Projeto integrador no fim de um arco.',why:'Combina skills reais.',pass:'Entrega + defesa oral + revisão.',fail:'Funciona, mas ninguém sabe por quê.'},
 {k:'TOUCH GRASS',d:'Se 14 dias forem só trabalho/estudo/código, fazer algo sem ROI.',why:'Evita virar o departamento de operações de si mesmo.',pass:'Atividade humana inútil concluída.',fail:'Tentou monetizar o descanso.'}
];
SYS.LAWS = [
 ['XP nunca é gasto','XP mede domínio acumulado e desbloqueia níveis, títulos, tiers de loja e bosses.'],
 ['Créditos são separados por Caminho','Cada Caminho tem sua moeda e sua loja. Créditos não são reais: são permissão para gastar dentro da regra de dinheiro de cada item.'],
 ['Cristais ◆ são do Sistema','Vêm de diárias, semanas fechadas, revisões mensais, metas e conquistas de sistema. Compram cosméticos e tickets.'],
 ['Selos','Cada Portão/Selo conquistado vale 1 Selo daquele Caminho. Itens lendários consomem Selos.'],
 ['Regra do Portão','Não avance para o próximo Ato do Architect com o Portão anterior incompleto. “Vi a matéria” não conta. (O modo Mundo Aberto, no Perfil, remove as travas — use com honestidade.)'],
 ['Regra da Falha','Uma skill de arquitetura só está completa se você sabe explicar como ela falha, degrada e é recuperada.'],
 ['Regra da IA','IA pode pesquisar, implementar, revisar e sugerir. Você precisa explicar e defender a decisão final. O Examinador aconselha; quem marca o Portão é você.'],
 ['Regra do Cooldown','Itens caros entram em cooldown (72h ou 7 dias) antes da compra. Desistir durante o cooldown também é vitória.'],
 ['Regra da Vida','O Sistema não pune descanso. Não existe perda de XP por semana ruim. Até 2 dias de descanso por semana mantêm a sequência. Burnout não é achievement.'],
 ['Regra da Evidência','Conquistas são evidência de feitos, não participação. Marque só quando a condição foi demonstrada.']
];
SYS.PLAN2H = [
 ['Seg–Sex','60–90 min no Caminho principal (Foco Profundo) + 20–30 min nos outros principais + treino.'],
 ['Sábado','Bloco longo de 3h: lab, boss ou gravação. É o dia de produzir evidência.'],
 ['Domingo','Fechar a semana no Diário (15 min), escolher a missão da próxima semana e tocar grama. Sem estudo obrigatório.'],
 ['Caminhos','Rotina fixa (os Caminhos de vida: Presença, Fundador e Lucidez por padrão) roda todo dia pelas diárias e não ocupa slot. Além dela, de 1 a 3 Caminhos de foco, escolhidos por você no Status e trocáveis quando quiser.'],
 ['Semana ruim','Faça só as diárias mínimas ou marque descanso. O Sistema espera você.']
];

SYS.VOICE = {
 node:['Olha só quem resolveu estudar de verdade.','Tá. Essa foi limpa. Não se acostuma.','XP entrou. Humildade, não.','O NPC que você era tá chorando no canto.','Mais uma. O Examinador ficou levemente impressionado.','Evidência registrada. Vibes não contam, mas essa contou.'],
 level:['Seus stats subiram. Sua conta de café também.','Level up. O grind reconhece o grind.','Novo nível. Mesmo boleto.','Ascensão confirmada. Vai printar, né?'],
 ach:['Pode printar. Eu deixo.','Vai colocar na vitrine ou vai fingir humildade?','Medalha nova. Ego +1.','Registrado nos anais do Sistema.'],
 gate:['O próximo Ato abriu. Ele é pior.','Selo conquistado. Os bosses estão sabendo.','Portão aberto. Não olhe muito tempo lá pra dentro.'],
 buy:['Gasto consciente detectado. Raro nesta região.','Recompensa liberada. Aproveita sem culpa.','A loja agradece. Sua reserva também, espero.'],
 cooldown:['72 horas para você e o impulso conversarem.','Cooldown iniciado. Se ainda quiser depois, é desejo. Se não, era dopamina.'],
 cancel:['Impulso derrotado. Carteira agradece.','Desistiu no cooldown. Isso sim é endgame.'],
 rest:['O Sistema não pune descanso.','Descanso registrado. Músculo cresce parado, lembra?','Dia livre. Burnout não é achievement.'],
 daily:['Diárias completas. Nenhuma penalidade hoje. Que sem graça.','Rotina cumprida. O Sistema está orgulhoso (não conta pra ninguém).'],
 back:['Bem-vindo de volta. Sem sermão. Sem XP perdido. Bora.'],
 undo:['Status revertido. Honestidade também é stat.']
};
