/* ===== v7 · ARCO LATERAL SOCIOTÉCNICO · a arquitetura que não é CPU ===== */
SYS.lib({
  teamtop:{t:'Team Topologies',a:'Matthew Skelton & Manuel Pais',y:'2019',w:'architect',note:'Quatro tipos de time, três modos de interação e carga cognitiva. Leia pensando na sua equipe real, não na de big tech.'}
});

SYS.arc('architect', { id:'s5', side:1, n:'ARCO LATERAL · GEOMETRIA HUMANA', wk:'Livre — vale mais quando já existe time ou cliente', sub:'Times, fronteiras, comunicação e negociação: a parte da arquitetura limitada por gente, não por CPU.', nodes:[
 {id:'T01',d:'Sociotécnico',t:'Lei de Conway',xp:40,cr:12,ach:'Leitor de Conway',
  s:'O sistema que você entrega se parece com a estrutura de comunicação de quem o construiu. Sempre.',
  st:['Lei de Conway: o desenho do sistema copia o desenho da comunicação','Manobra inversa: mudar os times para permitir a arquitetura desejada','Fronteira de módulo × fronteira de time × fronteira de conversa com o cliente','Custo de coordenação: cada handoff vira fila e espera','Monólito com cinco donos × serviço com um dono: qual dói mais','Conway de uma pessoa só: seus próprios contextos e trocas de chapéu','Sinais de desalinhamento: PR travado, módulo que ninguém assume, reunião para mudar uma linha'],
  wh:[['Martin Fowler — Conway’s Law','https://martinfowler.com/bliki/ConwaysLaw.html','artigo','EN'],['Melvin Conway — How do committees invent?','https://www.melconway.com/Home/Committees_Paper.html','artigo','EN'],['Manobra inversa de Conway na prática',yt('inverse conway maneuver team structure architecture'),'vídeo','EN']],
  bk:[['teamtop','Conway e fluxo: o desenho do time decide o desenho do sistema'],['buildingms','Fronteiras de serviço e times autônomos']],
  q:'Desenhe o mapa de quem fala com quem no seu projeto (você, sócio, cliente, freelancer, fornecedor) ao lado do diagrama de containers e aponte 3 pontos onde a estrutura humana explica a técnica.',
  dv:'Mapa Conway: comunicação × arquitetura', g:'Mostra pelo menos uma fronteira técnica que existe por causa de gente, e não de tecnologia.',
  f:'Desenhar a arquitetura dos sonhos sem perguntar quem mantém cada parte; culpar o dev pelo que é problema de fronteira.'},
 {id:'T02',d:'Sociotécnico',t:'Team Topologies',xp:45,cr:14,ach:'Topologista de Times',
  s:'Quatro formatos de time e três modos de interação — o suficiente para parar de inventar organograma no susto.',
  st:['Stream-aligned: time dono de um fluxo de valor de ponta a ponta','Platform: reduz atrito dos outros, entrega serviço interno','Enabling: ensina e sai de cena, não vira dono','Complicated-subsystem: especialista onde o assunto exige','Modos de interação: colaboração, X-as-a-service e facilitação','Carga cognitiva: quanto contexto um time consegue segurar','Tamanho de time e limite de relações (Dunbar aplicado à equipe)','Tradução para empresa pequena: um time, papéis diferentes por dia da semana','Fluxo vence utilização: time 100% ocupado entrega mais devagar'],
  wh:[['Team Topologies — conceitos-chave','https://teamtopologies.com/key-concepts','site','EN'],['DORA — capacidades de entrega','https://dora.dev/capabilities/','doc','EN'],['Team Topologies explicado',yt('team topologies four team types three interaction modes'),'vídeo','EN']],
  bk:[['teamtop','Os 4 tipos, os 3 modos e a carga cognitiva'],['accelerate','Autonomia de time e métricas de entrega']],
  q:'Mapeie quem faz o quê hoje nos seus projetos nos 4 tipos de time, marque a carga cognitiva de cada frente e proponha uma mudança pequena de modo de interação.',
  dv:'Topologia atual → desejada', g:'Explica qual frente está com carga cognitiva alta e qual mudança de interação alivia.',
  f:'Copiar organograma de big tech com 3 pessoas; time “enabling” que virou dono eterno; plataforma interna que ninguém pediu.'},
 {id:'T03',d:'Sociotécnico',t:'Ownership & fronteiras',xp:40,cr:12,ach:'Dono de Fronteira',
  s:'Código sem dono apodrece. Dono sem fronteira queima.',
  st:['Dono por módulo, serviço e dado: um nome, não um comitê','CODEOWNERS e revisão obrigatória na fronteira','“Você constrói, você opera”: quem escreve carrega o plantão','Responsável único pela decisão, com prazo','Trabalho compartilhado sem dono é fila invisível','Handoff × fluxo: quantas mãos até chegar em produção','Contrato de fronteira: o que o módulo promete e o que ele não promete','Bus factor: quem mais consegue abrir isso se você sumir','Plantão em equipe pequena: escala, limite e direito de dormir'],
  wh:[['GitHub — CODEOWNERS','https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners','doc','PT/EN'],['Google SRE — estar de plantão','https://sre.google/sre-book/being-on-call/','doc','EN'],['Ownership e bus factor na prática',yt('code ownership bus factor software team'),'vídeo','EN']],
  bk:[['teamtop','Fronteiras de time e ownership de longo prazo'],['srw','Plantão sustentável e responsabilidade de operação']],
  q:'Liste cada módulo, serviço e integração com dono e substituto. Onde o dono for “ninguém”, decida agora ou marque para desativar.',
  dv:'Tabela de ownership + bus factor', g:'Todo item crítico tem dono, substituto e fronteira escrita.',
  f:'Dono no papel que nunca abriu o código; plantão sem escala; bus factor 1 em algo que fatura.'},
 {id:'T04',d:'Sociotécnico',t:'Comunicação arquitetural',xp:45,cr:14,ach:'Tradutor de Arquitetura',
  s:'A mesma arquitetura precisa caber na cabeça do dev, do cliente e de quem paga. Três versões, uma verdade.',
  st:['A plateia decide o nível: contexto para leigo, container para dev, código só quando dói','Uma mensagem por diagrama; título, legenda e nenhuma sigla nova','Escrita vence reunião: documento curto que sobrevive sem você na sala','ADR como contrato: decisão, alternativas e consequência','RFC interno para decisão grande, com prazo de comentário','Apresentar em três camadas: problema → opções → recomendação','Linguagem de dinheiro para dono: risco, prazo, custo, receita','Registrar objeção e quem decidiu, para não virar fofoca em março','Matar a arquitetura de PowerPoint: mostre algo rodando'],
  wh:[['Gregor Hohpe — The Architect Elevator','https://architectelevator.com/','site','EN'],['adr.github.io — templates de ADR','https://adr.github.io/','doc','EN'],['Comunicar arquitetura para plateias diferentes',yt('Simon Brown communicating software architecture diagrams audience'),'vídeo','EN']],
  bk:[['elevator','Subir e descer o elevador: técnico e estratégico na mesma frase'],['sa4dev','Comunicação visual de arquitetura com C4']],
  q:'Pegue uma decisão real e produza três versões: 1 página para dev, 1 slide para o cliente e 3 frases para quem paga. Mostre para uma pessoa de cada tipo.',
  dv:'Pacote de comunicação da decisão (3 versões)', g:'As três plateias repetem a decisão com as próprias palavras e acertam o motivo.',
  f:'Mesmo diagrama para todo mundo; sigla nova sem explicar; decisão comunicada depois de implementada.'},
 {id:'T05',d:'BOSS',t:'BOSS · A Mesa',xp:260,cr:80,ach:'Negociador de Trade-offs',boss:1,
  s:'Uma decisão arquitetural real defendida diante de quem paga: opções, número, consequência — e um “não” dito com alternativa.',
  st:['Três opções com custo, prazo, risco e consequência de manutenção','Recomendação explícita e o que faria você mudar de ideia','Decisão reversível × irreversível (porta de mão única)','Dizer não com alternativa e com preço','Registro da decisão, de quem decidiu e da data de revisão'],
  q:'Leve uma decisão de verdade (banco, nuvem, comprar × construir, prazo) para uma conversa real com cliente ou sócio e saia com decisão registrada e revisão marcada.',
  dv:'ADR assinado + ata de 1 página com quem decidiu e o gatilho de revisão', g:'A decisão saiu da conversa com dono, número e data de revisão, e a outra parte entendeu o trade-off.',
  f:'Ganhar a discussão e perder o cliente; aceitar prazo impossível para evitar conflito; decidir sozinho algo que outra pessoa vai operar.'}
]});

SYS.gate('architect', {id:'ags5',arc:'s5',n:'Selo Lateral · Geometria Humana',ev:['Mapa Conway','Topologia atual → desejada','Tabela de ownership','Pacote de comunicação em 3 versões','Boss A Mesa'],oral:'Explique como a estrutura dos times aparece na arquitetura e qual fronteira você mudaria primeiro.',fail:'Conte uma decisão que falhou por gente, não por tecnologia, e o que você faria diferente.',ach:'arch_s5',xp:220});
