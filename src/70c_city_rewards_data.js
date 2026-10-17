/* ===== CIDADE · Recompensas (Bloco 3): caixas, maldições, Fundo e vales, Ecos, Relíquias, Forja, títulos e corrupção =====
   Tudo em números, como na Bíblia da Cidade. Valores marcados como "ponto de partida" ficam nas Decisões. */
(function(){
  var CY = SYS.CITY;
  CY.V = 3;   /* documento city v3: Lista de Desejos, Lista Secreta, Fundo, maldições, Relíquias identificadas, avatar e troféus */

  /* ---------- caixas aleatórias: sempre em par ---------- */
  CY.GRAUS = ['menor', 'maior', 'suprema'];
  CY.CX = {
    menor: {gem: [40, 100], chaves: ['E', 'D'], cosm: ['common', 'uncommon'], mal: {perg: 'C', chaves: ['D', 'C'], purif: 1}},
    maior: {gem: [150, 400], chaves: ['C', 'B', 'A'], cosm: ['rare', 'epic'], mal: {perg: 'B', chaves: ['B'], purif: 3}},
    suprema: {gem: [600, 1000], chaves: [], cosm: ['legendary'], dourada: true, mal: {perg: 'A', chaves: ['A'], purif: 3}}
  };
  /* as 6 maldições da Amaldiçoada: duram até cumprir o que veio na caixa, no máximo 7 dias */
  CY.MALD = [
    {id: 'breu', n: 'Breu', ef: 'o mapa esconde o rank dos portais por 2 dias', dias: 2},
    {id: 'espelho', n: 'Espelho', ef: 'o próximo portal só fecha depois de ensinar o que você fez', usos: 1},
    {id: 'mao_vazia', n: 'Mão Vazia', ef: '−50% de ◆ nos próximos 3 portais', usos: 3},
    {id: 'posseiro', n: 'Posseiro', ef: 'o bairro mais abandonado ganha um portal C que não some até ser fechado'},
    {id: 'insonia', n: 'Insônia do Servidor', ef: 'os portais de um bairro vencem 50% mais rápido por 3 dias', dias: 3},
    {id: 'sirene', n: 'Sirene', ef: 'uma emergencial garantida nesta semana: perder vale corrupção', dias: 7}
  ];
  CY.MALDMAP = {}; CY.MALD.forEach(function(m){ CY.MALDMAP[m.id] = m; });
  CY.MALD_MAX = 7;
  CY.ESPELHO_MIN = 80;   /* caracteres da explicação pedida pelo Espelho */

  /* ---------- Fundo de Recompensas e vales reais ---------- */
  CY.FUNDO = {porRank: {E: 80, D: 120, C: 180, B: 260, A: 380, S: 520}, meses: 2};   /* R$ por mês pela Licença: ponto de partida, editável */
  CY.TEMPO = ['1 hora livre', '2 horas livres', 'meio período livre', '1 dia de trabalho livre', '1 dia inteiro livre', 'um fim de semana livre'];
  CY.SECRETA_MAX = 12;
  CY.VALE_COBRE = {assinatura: '1 mês de um serviço, sem renovação automática', ferramenta: 'livro, curso, plugin, software, peça do setup ou equipamento de treino', lazer: 'cinema, show, jogo, comida especial ou passeio', tempo: 'horas livres e sem culpa; não gasta o Fundo', secreto: 'um desejo da Lista Secreta'};

  /* ---------- Ecos e Arsenal ---------- */
  CY.ECO = {bonus: 2, bonusMax: 20, nvMax: 5, ascR: 5, ascMax: 20, grau: {C: 'common', B: 'rare', A: 'epic', S: 'legendary'}};

  /* ---------- Relíquias ---------- */
  CY.RELIQ = {
    slots: CY.SLOT_RELIQ,   /* os 5 espaços do avatar */
    /* ícones dos 5 espaços (24×24, contorno) */
    ic: {
      Arma: 'M5 19l4-4 M7.5 16.5l-3 3 M9 15L19.5 4.5l.5 2.5L10.5 16.5z M14 6l4 4',
      Manto: 'M8 3.5h8l1.5 3-1.5 1V20l-4-2-4 2V7.5L6.5 6.5z M9.5 3.5c.5 1.5 1.5 2.2 2.5 2.2s2-.7 2.5-2.2',
      Anel: 'M12 8.5a6 6 0 1 0 0 12a6 6 0 1 0 0-12z M9.5 4.5h5l1.5 2-4 2.5-4-2.5z',
      Amuleto: 'M8 3c0 3 1.8 5 4 5s4-2 4-5 M12 8v2 M12 10l5 5-5 6-5-6z M12 13.5v4',
      'Relógio': 'M12 5.5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M12 9v3.5l2.5 1.5 M9.5 2.5h5 M12 2.5v3'
    },
    nomes: {
      Arma: ['Adaga', 'Lâmina', 'Régua Afiada', 'Pena de Aço', 'Bastão', 'Estilete'],
      Manto: ['Manto', 'Capa', 'Casaco', 'Xale', 'Sobretudo', 'Capuz'],
      Anel: ['Anel', 'Aliança', 'Sinete', 'Aro', 'Argola', 'Selo'],
      Amuleto: ['Amuleto', 'Medalhão', 'Pingente', 'Talismã', 'Chaveiro', 'Broche'],
      'Relógio': ['Relógio', 'Cronômetro', 'Ampulheta', 'Metrônomo', 'Despertador', 'Relógio de Bolso']
    },
    de: {
      servidores: ['do Servidor Insone', 'da Fila de Logs', 'do Último Deploy', 'do Rack Sem Nome'],
      estudio: ['da Sala Abafada', 'do Metrônomo Torto', 'da Fita Sem Rótulo', 'do Contraponto'],
      piscinas: ['da Piscina Vazia', 'do Azulejo Frio', 'do Vapor', 'da Borda Funda'],
      escritorio: ['das 23h', 'da Planilha Aberta', 'do Elevador Parado', 'da Mesa da Meia-Noite'],
      agencia: ['da Agência Fechada', 'do Cofre Mudo', 'do Livro-Razão', 'da Maré Baixa'],
      biblioteca: ['das 3h', 'da Estante Funda', 'da Lamparina', 'do Arquivo Morto'],
      galeria: ['da Galeria Coberta', 'da Marquise', 'da Vitrine Apagada', 'do Canto do Olho']
    },
    lore: {
      servidores: ['Achada atrás de um rack que ninguém desliga.', 'Ainda quente, como se tivesse acabado de compilar.', 'Tem um comentário gravado: "não mexer".'],
      estudio: ['Vibra num tom que só se ouve de olhos fechados.', 'Veio de uma sessão que nunca foi mixada.', 'Cheira a cabo novo e café velho.'],
      piscinas: ['Pinga água clorada mesmo seca.', 'Estava no fundo da piscina, onde a luz não chega.', 'O eco dela demora um segundo a mais.'],
      escritorio: ['Ficou na mesa de quem saiu às 23h e não voltou.', 'Tem uma reunião marcada para ontem.', 'O crachá preso nela não tem nome.'],
      agencia: ['Saiu do cofre sem passar pelo caixa.', 'Conta juros de um dinheiro que não existe.', 'A fila da agência ainda espera por ela.'],
      biblioteca: ['Estava entre dois livros que não deveriam existir.', 'A bibliotecária jura que nunca a catalogou.', 'Só brilha quando alguém lê em voz baixa.'],
      galeria: ['Estava numa vitrine que ninguém lembra de ter visto.', 'O reflexo dela anda um passo atrás.', 'Veio de um canto da galeria que não está no mapa.']
    },
    desm: [1, 2, 3, 4, 5, 5],   /* materiais por raridade no desmanche */
    max: 120,                   /* Relíquias comuns guardadas; a 121ª vira materiais (únicas e de origem não contam) */
    unicas: [
      {id: 'u_adaga', n: 'Adaga do Prazo Vencido', slot: 'Arma', r: 'epic', look: 'lâmina feita de ponteiro de relógio; o fio pinga areia', onde: 'Portais Trancados, épico', ctx: 'tranc'},
      {id: 'u_lanterna', n: 'Lanterna de Vidro Fosco', slot: 'Arma', r: 'epic', look: 'projeta frases soltas na parede do Perfil', onde: 'Biblioteca às 3h, épico', ctx: 'biblioteca'},
      {id: 'u_manto', n: 'Manto da Neblina', slot: 'Manto', r: 'legendary', look: 'a barra do manto se desfaz em névoa', onde: 'portais Corrompidos, lendário', ctx: 'corrompido'},
      {id: 'u_dado', n: 'Dado de Osso', slot: 'Amuleto', r: 'legendary', look: 'mostra sempre a face que você não escolheu', onde: 'baú do chefe de raid, lendário', ctx: 'raid'},
      {id: 'u_ampulheta', n: 'Ampulheta de Areia Preta', slot: 'Relógio', r: 'legendary', look: 'a areia sobe em vez de descer', onde: 'baú do chefe de A e S, lendário', ctx: 'chefe'},
      {id: 'u_molho', n: 'Molho do Zelador', slot: 'Amuleto', r: 'legendary', look: 'chaves que tilintam quando um portal nasce', onde: 'Ato V de O Mistério das 3h33', ctx: 'misterio5'},
      {id: 'u_ponteiro', n: 'Ponteiro Quebrado', slot: 'Relógio', r: 'mythic', look: 'marca 3h33 e, ao entardecer, anda ao contrário', onde: 'final de O Mistério das 3h33, mítico', ctx: 'misterio'}
    ],
    variantes: ['original', 'ouro velho', 'prata fria', 'carmim']   /* Fio de Ouro troca a variante */
  };
  CY.RELIQ.UMAP = {}; CY.RELIQ.unicas.forEach(function(u){ CY.RELIQ.UMAP[u.id] = u; });

  /* ---------- Forja: os 10 materiais, os itens de uso e as 8 receitas ---------- */
  Object.assign(CY.ITENS, {
    lente: {n: 'Lente de Aumento', d: 'mostra a condição oculta de um portal; a recompensa dela cai pela metade', mercador: true},
    bussola: {n: 'Bússola Rachada', d: 'escolhe o bairro do próximo portal que nascer', mercador: true},
    fio: {n: 'Fio de Ouro', d: 'troca a variante visual de uma Relíquia'},
    poeira: {n: 'Poeira de Eco', d: 'sobe 1 nível de outro Eco'},
    purif1: {n: 'Purificação Menor', d: 'tira 1 nível de corrupção de um bairro'},
    dourada: {n: 'Chave Dourada', d: 'abre uma dungeon secreta rank S, quando as Dungeons se mudarem para o Centro'}
  });
  CY.MAT_FORJA = ['pedra', 'lixa', 'dado', 'brasa', 'lente', 'bussola', 'fio', 'poeira', 'escoria', 'carmesim'];
  CY.MAT_PORTAL = ['pedra', 'lixa', 'dado', 'brasa', 'carmesim', 'carimbo'];   /* usados num portal antes de entrar */
  CY.FORJA = {porPortal: 3, reciclar: 5, purificar: 10, remendo: 3, chave: 3, perg: 3, frag: 5};
  CY.RECEITAS = [
    {id: 'chave', n: 'Chave maior', entra: '3 chaves do mesmo rank, de E a A', sai: '1 chave do rank seguinte'},
    {id: 'perg', n: 'Pergaminho maior', entra: '3 pergaminhos do mesmo tipo e rank', sai: '1 pergaminho do rank seguinte'},
    {id: 'cosm', n: 'Cosmético de bairro', entra: '5 fragmentos do mesmo bairro', sai: 'o cosmético daquele bairro que você escolher'},
    {id: 'vale', n: 'Consolidar vale', entra: '2 vales da mesma raridade', sai: '1 vale da raridade seguinte, na categoria que você escolher'},
    {id: 'reciclar', n: 'Reciclar', entra: '5 Escórias', sai: '1 Pedra de Afiar ou 1 Lixa'},
    {id: 'purificar', n: 'Purificar', entra: '10 Escórias', sai: 'o bairro perde 1 nível de corrupção'},
    {id: 'remendo', n: 'Remendo de Eco', entra: '1 Eco Partido e 3 Poeiras de Eco', sai: 'o Eco volta como comum'},
    {id: 'desmanchar', n: 'Desmanchar', entra: '1 Relíquia', sai: 'de 1 a 5 materiais pela raridade; épico ou maior inclui Fio de Ouro'}
  ];
  CY.PERG.inimigo = 'Pergaminho do Inimigo Íntimo';
  CY.PERG_RANKS = {permissao: ['E', 'D', 'C'], dungeon: ['D', 'C', 'B'], historia: ['C', 'B'], selado: ['A', 'S'], inimigo: ['C', 'B', 'A']};

  /* ---------- cosméticos de bairro (Forja: 5 fragmentos) e molduras da Licença ---------- */
  CY.COSM = [];
  CY.DIST.forEach(function(d){
    CY.COSM.push({id: 'nc_cy_' + d.id, kind: 'namecards', d: d.id, n: 'Cartão · ' + d.n, r: 'rare'});
    CY.COSM.push({id: 'fr_cy_' + d.id, kind: 'frames', d: d.id, n: 'Moldura · ' + d.n, r: 'epic'});
  });
  ['E', 'D', 'C', 'B', 'A', 'S'].forEach(function(r, i){ CY.COSM.push({id: 'fr_lic_' + r, kind: 'frames', lic: r, n: 'Moldura da Licença ' + r, r: SYS.RARITY_ORDER[i]}); });

  /* ---------- títulos da Cidade: 1 equipado por vez, no Perfil e no topo da Cidade ---------- */
  CY.TITULOS = [
    {id: 'cyt_lic_E', n: 'Caçador de Rua', r: 'common', lic: 'E'},
    {id: 'cyt_lic_D', n: 'Caçador de Bairro', r: 'uncommon', lic: 'D'},
    {id: 'cyt_lic_C', n: 'Caçador da Cidade', r: 'rare', lic: 'C'},
    {id: 'cyt_lic_B', n: 'Caçador de Elite', r: 'epic', lic: 'B'},
    {id: 'cyt_lic_A', n: 'Caçador de Raid', r: 'legendary', lic: 'A'},
    {id: 'cyt_lic_S', n: 'Caçador Nacional', r: 'mythic', lic: 'S'},
    {id: 'cyt_d_servidores', n: 'Sentinela dos Racks', r: 'rare', d: 'servidores'},
    {id: 'cyt_d_estudio', n: 'Insone do Estúdio sem Janela', r: 'rare', d: 'estudio'},
    {id: 'cyt_d_piscinas', n: 'Nadador das Piscinas Vazias', r: 'rare', d: 'piscinas'},
    {id: 'cyt_d_escritorio', n: 'Plantonista das 23h', r: 'rare', d: 'escritorio'},
    {id: 'cyt_d_agencia', n: 'Gerente da Agência Fechada', r: 'rare', d: 'agencia'},
    {id: 'cyt_d_biblioteca', n: 'Leitor das 3h', r: 'rare', d: 'biblioteca'},
    {id: 'cyt_d_galeria', n: 'Flâneur da Galeria Coberta', r: 'rare', d: 'galeria'}
  ];
  CY.TITMAP = {}; CY.TITULOS.forEach(function(t){ CY.TITMAP[t.id] = t; });

  /* ---------- corrupção: contenção, Revanche e emergencial ---------- */
  CY.CONT = {prazo: 72, rank: ['D', 'D', 'C', 'C']};   /* por nível de corrupção alcançado */
  CY.REVANCHE = {dias: 7};
  CY.SIRENE = {prazo: 24, rank: 'D'};
})();
