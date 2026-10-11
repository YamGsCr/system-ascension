/* ===== CIDADE · dados: distritos, Centro, ranks, corrupção e as Decisões (docs/decisoes.md) =====
   A Cidade é o modo de portais da Bíblia da Cidade. Neste bloco: o mapa, o radar vazio e o save próprio.
   Ordem dos distritos = ordem do mapa da Bíblia (e da tabela de clãs na aba Facções). */
SYS.CITY = {
  V: 2,   /* versão do documento city na nuvem (2: portais, Licença, inventário e livro-razão) */

  /* as respostas das Decisões, em números. Mudar aqui muda o jogo inteiro */
  CONF: {
    econ: {gemDiaE: 45, chaveE: 40, bauMana: 220},      /* ◆ por dia na Licença E, a calibrar contra a chave E e o Baú de Mana */
    fundo: {porRank: true, ajustavel: true},             /* Fundo de Recompensas: padrão pelo rank da Licença, editável nos Ajustes */
    vales: {tetoMin: 25, tetoMax: 800, tempoPorMes: 2},  /* tetos de R$ 25 a R$ 800; vale de Tempo no máximo 2 por mês */
    chaveMult: 1.5,                                      /* chaves continuam na loja, mais caras, quando os portais começarem a dropar chaves */
    ritmo: {porReset: 3, abertosMax: 6, raid: 'mensal'},
    iaPorDia: 3,                                         /* em aberto: vale o padrão da Bíblia */
    desejos: 5,
    classes: 4,
    bancadas: 9,
    clas: 'todos', /* os 17 abrem juntos, quando o bloco de Facções chegar */
    estacao1: {n: 'Rachadura', inicio: '2026-10-31', semanas: 10, evento: 'Noite dos Portais Vermelhos'}
  },

  RANKS: ['E', 'D', 'C', 'B', 'A', 'S'],
  RANKNOTE: {E: 'exercício', D: 'exercício', C: 'projeto', B: 'projeto', A: 'projeto com defesa', S: 'projeto com defesa'},

  /* col/row = posição no mapa 3×3 (o Centro fica no meio; o canto que sobra é névoa) */
  DIST: [
    {id: 'servidores', way: 'architect', n: 'Sala de Servidores', curto: 'Servidores', ic: 'd_servers', col: 0, row: 0,
      ruas: ['Campanha · Atos I a X', 'Arcos laterais'], sel: [{arcs: ['act1','act2','act3','act4','act5','act6','act7','act8','act9','act10']}, {arcs: ['s1','s2','s3','s4','s5']}],
      clas: [['Contadores de Ciclos', 'Tudo tem custo. O que não foi medido foi pago às cegas.'], ['Casa de Babel', 'Código é texto para gente; a máquina só lê de passagem.'], ['Ordem do Prumo', 'Ou está no prumo, ou não está.']]},
    {id: 'estudio', way: 'ars', n: 'Estúdio sem Janela', curto: 'Estúdio', ic: 'd_studio', col: 1, row: 0,
      ruas: ['Ouvido e Teoria', 'MIDI e Produção', 'Cordas'], sel: [{tronco: true}, {br: 'midi'}, {br: 'str'}],
      clas: [['Seita do Amen', 'Corta no tempo errado. De propósito.'], ['Ordem do Contraponto', 'Duas vozes, nenhuma obedece, e mesmo assim soa.']]},
    {id: 'piscinas', way: 'aesthetic', n: 'Piscinas', curto: 'Piscinas', ic: 'd_pools', col: 2, row: 0,
      ruas: ['Calistenia', 'Cuidado', 'Estilo e Didática', 'Contemplação'], sel: [{br: 'cal'}, {br: 'cui'}, {br: 'sty'}, {br: 'con'}], fis: [0],
      clas: [['Os Ingravidáveis', 'O chão é só uma sugestão.'], ['Casa do Vapor', 'Descanso também é treino.'], ['Companhia do Palco', 'Se não sabe explicar, ainda não sabe.']]},
    {id: 'escritorio', way: 'founder', n: 'Escritório às 23h', curto: 'Escritório', ic: 'd_office', col: 0, row: 1,
      ruas: ['Cliente e Preço', 'Operação e Marca', 'CTO fracionado', 'Estratégia'], sel: [{arcs: ['o1','o2','o3']}, {arcs: ['o4','o5','os1','os2']}, {arcs: ['o6']}, {arcs: ['o7']}],
      clas: [['Mesa da Meia-Noite', 'Diz o número e fica quieto.'], ['Conselho do Último Andar', 'Estratégia é a lista do que você recusou.']]},
    {id: 'agencia', way: 'navigation', n: 'Agência Fechada', curto: 'Agência', ic: 'd_agency', col: 2, row: 1,
      ruas: ['Economia Básica', 'Ações e ETFs', 'Gerenciamento', 'Tesouraria e Capital'], sel: [{br: 'eco'}, {br: 'inv'}, {br: 'ger'}, {br: 'tes'}],
      clas: [['Liga do Livro-Razão', 'Centavo que some volta. Com juros.'], ['Navegadores da Maré', 'Ninguém prevê a maré; a gente lê e ajusta a vela.']]},
    {id: 'biblioteca', way: 'mind', n: 'Biblioteca às 3h', curto: 'Biblioteca', ic: 'd_library', col: 0, row: 2,
      ruas: ['Pensamento', 'Hiperfocos e Arquivos', 'Jogos e Sistemas'], sel: [{tronco: true}, {br: 'hip'}, {br: 'jog'}],
      clas: [['Círculo da Lamparina', 'Defina os termos. Depois a gente briga.'], ['Casa da Sombra', 'O que você não olha, olha você.'], ['Arquivistas do Hiperfoco', 'Tudo que você amou por uma semana merece uma ficha.']]},
    {id: 'galeria', way: 'flaneur', n: 'Galeria Coberta', curto: 'Galeria', ic: 'd_gallery', col: 1, row: 2,
      ruas: ['Observação e Leitura', 'Ofício da Escrita', 'Teoria e Academia', 'Publicação'], sel: [{br: 'obs'}, {br: 'ofi'}, {br: 'aca'}, {br: 'pub'}],
      clas: [['Cronistas da Marquise', 'Anda devagar. A cidade fala baixo.'], ['Sociedade do Estranho', 'Escreve o que você viu no canto do olho.']]}
  ],
  CENTRO: {id: 'centro', n: 'Centro', curto: 'Centro', ic: 'd_center', col: 1, row: 1,
    itens: [['Dungeons', 'as 12 Dungeons e as secretas'], ['Raids', 'o alerta de raid e o quadro de eventos'], ['Oficina', 'as 9 bancadas de ferramentas']]},
  NEVOA: {id: 'nevoa', n: '???', col: 2, row: 2, fala: 'Névoa. O Sistema não mostra o que tem aqui.'},

  /* gente da Cidade: retrato (imagem em assets/img), clã e papel. Os outros representantes chegam com as Facções */
  PERS: {
    ivo: {n: 'Ivo Lint', cla: 'Casa de Babel', papel: 'representante', d: 'servidores', img: 'ivo'}
  },
  /* falas em cena: cada uma pode apontar para uma parte da tela (alvo = seletor; sem alvo, só a vinheta) */
  FALAS: {
    ivoIntro: [
      {t: 'Ah. O caçador novo. Ivo Lint, Casa de Babel. Eu reviso código; pelo visto, hoje eu reviso você.'},
      {t: 'Isso é a Cidade: sete bairros, um por Caminho, o Centro na praça e um rio que ninguém documentou.', alvo: '.cy-mapbox'},
      {t: 'Toca num bairro e a janela dele abre direto. Tinha um painel do lado repetindo o mapa. Tirei: era atalho para uma coisa que já estava ali.', alvo: '.cy-mapbox'},
      {t: 'No canto fica o radar. Cada ponto é um portal aberto; toca nele para ver prazo, Chamado e o resto.', alvo: '.cy-mini'},
      {t: 'Aqui é você. Perfil, inventário e celular moram nessa janela. Uma janela que abre outras janelas: recursão, só que com moderação.', alvo: '.cy-me'},
      {t: 'Os losangos são portais, e a letra é o rank. Entra, entrega, rola o drop. Portal C+ que você começou e largou quebra, e a corrupção cobra com juros.', alvo: '.cy-svg .cy-badge'},
      {t: 'Último conselho, de graça: pergunta o porquê antes do como. O resto eu cobro em pull request.'}
    ]
  },

  /* corrupção do distrito (aba Quebra e corrupção da Bíblia) */
  CORR: [
    {n: 'Limpo', d: 'Nenhuma quebra pendente.'},
    {n: 'Corrupção 1', d: '◆ base −25%; metade dos pares de caixa vem só com a Amaldiçoada.'},
    {n: 'Corrupção 2', d: '◆ base −50%; 70% dos pares só com a Amaldiçoada.'},
    {n: 'Corrupção 3', d: '◆ base −75%; 90% dos pares só com a Amaldiçoada; nada acima de C nasce ali.'}
  ]
};
SYS.CITY.DMAP = {};
SYS.CITY.DIST.forEach(function(d){ SYS.CITY.DMAP[d.id] = d; });
