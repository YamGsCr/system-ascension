/* ===== CIDADE · regras em números: ranks, Licença, modificadores e tabela de drop =====
   Tudo aqui sai das seções Portais, Modificadores, Tabela de drop e Licença de Caçador da Bíblia.
   O motor (75 e 76) só lê daqui. Mudar um valor aqui muda o jogo. */
(function(){
  var CY = SYS.CITY;

  /* ---------- ranks ---------- */
  CY.RANK = {
    E: {tipo: 'exercício', esf: '15–25 min', prazo: 'reset', prova: 'linha', quebra: false, pts: 1, xp: 10, gem: 8, rol: 1, teto: 'rare'},
    D: {tipo: 'exercício', esf: '30–45 min', prazo: 48, prova: 'resultado', quebra: false, pts: 2, xp: 20, gem: 15, rol: 1, teto: 'rare'},
    C: {tipo: 'mini-projeto', esf: '1–2 h, numa sentada', prazo: 72, prova: 'entregavel', quebra: true, pts: 5, xp: 50, gem: 35, eco: 'common', rol: 2, teto: 'epic'},
    B: {tipo: 'projeto da semana', esf: '3–5 sessões', prazo: 168, prova: 'nota', nota: 65, quebra: true, pts: 12, xp: 120, gem: 80, eco: 'rare', chave: 'E', rol: 2, teto: 'epic'},
    A: {tipo: 'torre de 3 andares', esf: '2–3 semanas', prazo: 504, prova: 'defesa', nota: 70, quebra: true, pts: 30, xp: 300, gem: 200, eco: 'epic', chave: 'C', rol: 3, bau: true, teto: 'legendary'},
    S: {tipo: 'projeto grande', esf: '4–8 semanas', prazo: 1080, prova: 'defesa', nota: 80, quebra: true, pts: 70, xp: 600, gem: 450, eco: 'legendary', mana: true, rol: 4, bau: true, teto: 'legendary'}
  };
  /* A e S saem da IA (Examinador da Cidade, bloco 4). Até lá, o que a tabela sortear acima de B nasce como B */
  CY.SPAWN_MAX = 'B';
  CY.PROVA = {
    linha: 'Marque e escreva 1 linha do que fez.',
    resultado: '1 linha do que fez e o resultado (número, trecho, link).',
    entregavel: 'O entregável: texto ou link.',
    nota: 'O entregável, corrigido pelo Examinador: nota mínima 65.',
    defesa: 'As entregas e a defesa ao Examinador.'
  };

  /* ---------- Licença de Caçador ---------- */
  CY.LIC = [
    {r: 'E', pts: 0, odds: [50, 35, 15, 0, 0, 0]},
    {r: 'D', pts: 30, odds: [30, 40, 25, 5, 0, 0]},
    {r: 'C', pts: 120, odds: [15, 30, 35, 15, 5, 0]},
    {r: 'B', pts: 400, odds: [10, 20, 30, 25, 12, 3]},
    {r: 'A', pts: 1200, odds: [5, 15, 25, 28, 20, 7]},
    {r: 'S', pts: 3000, odds: [5, 10, 20, 30, 25, 10]}
  ];
  CY.PTS = {E: 1, D: 2, C: 5, B: 12, A: 30, S: 70, raid: 90, hist: 5, oculta: 3};
  CY.REAV = {nota: 75, salto: 95, espera: 7, prazo: 168};

  /* ---------- nascimento ---------- */
  CY.NASCE = {porReset: 3, cheio: 4, devagar: 1, max: 6, peso: {foco: 3, fixo: 2, outro: 1}, repetir: 10};
  CY.TRANC = {chance: 0.05, min: {D: 45, C: 120}};
  CY.CHAMADO = {E: 45, D: 90};   /* janela com menos de 45 min: E; até 90: D; acima: C */

  /* ---------- modificadores (31) ----------
     t: prefixo, sufixo, praga, bencao, corrup · q e r em % · leve: cabe em E e D
     ate: rank máximo · so: só nesses ranks · off: depende de um sistema que ainda não chegou (fica fora do sorteio)
     auto: o motor confere sozinho (hora, prazo) · sem auto, a pessoa confirma que cumpriu ao entregar */
  CY.MODS = [
    {id: 'sem_consulta', n: 'Sem Consulta', t: 'prefixo', ef: 'Nada de documentação, tutorial ou IA durante o portal.', r: 40},
    {id: 'cronometrado', n: 'Cronometrado', t: 'prefixo', ef: 'Metade do tempo estimado.', q: 20, r: 20, leve: true, tempo: 0.5},
    {id: 'papel_caneta', n: 'Papel e Caneta', t: 'prefixo', ef: 'A primeira versão sai à mão: rascunho, diagrama ou partitura.', r: 25, leve: true},
    {id: 'ferramenta_unica', n: 'Ferramenta Única', t: 'prefixo', ef: 'Uma ferramenta só: um editor, um plugin, um equipamento.', q: 15, leve: true},
    {id: 'silencio_total', n: 'Silêncio Total', t: 'prefixo', ef: 'Sem música, sem notificação, celular em outro cômodo.', q: 15, leve: true},
    {id: 'mao_trocada', n: 'Mão Trocada', t: 'prefixo', ef: 'Outra linguagem, outra DAW, outro gênero ou a mão não dominante.', r: 30},
    {id: 'primeira_tomada', n: 'Primeira Tomada', t: 'prefixo', ef: 'Sem desfazer: take único, texto corrido, código sem apagar.', r: 35},
    {id: 'escassez', n: 'Escassez', t: 'prefixo', ef: 'Só recursos gratuitos e o que já está na mesa.', q: 10, leve: true},
    {id: 'neblina', n: 'Neblina', t: 'prefixo', ef: 'O objetivo só aparece depois de entrar.', r: 20, leve: true, auto: 'neblina'},
    {id: 'monologo', n: 'Monólogo', t: 'prefixo', ef: 'Explicar em voz alta, gravando, enquanto faz.', q: 20},
    {id: 'espelho', n: 'do Espelho', t: 'sufixo', ef: 'Só fecha depois de ensinar o que fez ao Examinador.', q: 25, off: 'Examinador da Cidade'},
    {id: 'vitrine', n: 'da Vitrine', t: 'sufixo', ef: 'Publicar o resultado: post, repositório ou áudio.', q: 30, r: 20},
    {id: 'herdeiro', n: 'do Herdeiro', t: 'sufixo', ef: 'Começar de um Eco seu; o Eco ganha um uso.', q: 10, off: 'Ecos e Arsenal'},
    {id: 'elo_duplo', n: 'do Elo Duplo', t: 'sufixo', ef: 'Dois Caminhos no mesmo entregável.', q: 35},
    {id: 'alvorada', n: 'da Alvorada', t: 'sufixo', ef: 'Concluir entre 7h e 10h.', q: 15, leve: true, auto: 'alvorada'},
    {id: 'inimigo_intimo', n: 'do Inimigo Íntimo', t: 'sufixo', ef: 'O tema é o nó mais atrasado do Caminho.', r: 30, auto: 'inimigo'},
    {id: 'auditoria', n: 'da Auditoria', t: 'sufixo', ef: 'Nota mínima do Examinador +10.', r: 25, so: ['B', 'A', 'S'], nota: 10, auto: 'nota'},
    {id: 'cliente_volivel', n: 'do Cliente Volúvel', t: 'sufixo', ef: 'O briefing muda no meio do prazo.', q: 20, r: 15, so: ['C', 'B', 'A', 'S'], auto: 'virada'},
    {id: 'revanche', n: 'da Revanche', t: 'sufixo', ef: 'Refaz um portal que quebrou; fechar desfaz a quebra.', r: 20, off: 'Revanche'},
    {id: 'uma_tirada', n: 'de Uma Tirada', t: 'sufixo', ef: 'Numa sessão só, sem salvar parcial.', q: 15, r: 15, leve: true, ate: 'C'},
    {id: 'mare_vermelha', n: 'Maré Vermelha', t: 'praga', ef: 'Prazo pela metade.', q: 50, prazo: 0.5, auto: 'prazo'},
    {id: 'peso_morto', n: 'Peso Morto', t: 'praga', ef: '+1 entrega obrigatória.', q: 40, extra: 1},
    {id: 'ecos_mudos', n: 'Ecos Mudos', t: 'praga', ef: 'Seus Ecos não dão bônus aqui.', r: 30, off: 'Ecos e Arsenal'},
    {id: 'fome_mana', n: 'Fome de Mana', t: 'praga', ef: '◆ base zerado; só os drops.', r: 60, gemBase: 0, auto: 'mana'},
    {id: 'olhos_nuca', n: 'Olhos na Nuca', t: 'praga', ef: 'Nota mínima do Examinador +15.', r: 45, so: ['B', 'A', 'S'], nota: 15, auto: 'nota'},
    {id: 'mercado_fechado', n: 'Mercado Fechado', t: 'praga', ef: 'Lojas seladas até fechar o portal.', q: 35, r: 15, auto: 'loja'},
    {id: 'vento_favor', n: 'Vento a Favor', t: 'bencao', ef: '+1 rolagem.', rol: 1, auto: 'rol'},
    {id: 'lua_cheia', n: 'Lua Cheia', t: 'bencao', ef: 'Raridade a mais sem custo.', r: 50, auto: 'gratis'},
    {id: 'atalho', n: 'Atalho', t: 'bencao', ef: 'Prazo +50%.', prazo: 1.5, auto: 'prazo'},
    {id: 'mao_amiga', n: 'Mão Amiga', t: 'bencao', ef: 'Uma dica do Examinador sem perder bônus.', off: 'Examinador da Cidade'},
    {id: 'corrompido', n: 'Corrompido', t: 'corrup', ef: 'Um modificador escondido, revelado ao entrar; a caixa que cair aqui vem só Amaldiçoada.', q: 30, r: 30, off: 'Fragmento Carmesim e eventos'}
  ];
  CY.MODMAP = {}; CY.MODS.forEach(function(m){ CY.MODMAP[m.id] = m; });
  CY.SLOTS = {E: [0, 1], D: [0, 1], C: [1, 1], B: [1, 2], A: [2, 3], S: [3, 4], raid: [4, 6]};
  CY.SLOT_TIPO = {bencao: 10, prefixo: 36, sufixo: 36, praga: 18};   /* bênção é rara: 1 em cada 10 slots */
  CY.AFIXOS = [
    {id: 'interrogador', n: 'Interrogador', ef: '5 perguntas na defesa, em vez de 3.'},
    {id: 'advogado', n: 'Advogado do Diabo', ef: 'Defender também a alternativa que você descartou.'},
    {id: 'ao_vivo', n: 'Ao Vivo', ef: 'Defesa em voz alta, gravada.'},
    {id: 'postmortem', n: 'Postmortem', ef: 'O chefe injeta uma falha no seu entregável e você responde.'},
    {id: 'segunda_fase', n: 'Segunda Fase', ef: 'Com nota acima de 90, o chefe volta com uma pergunta extra e um drop extra.'}
  ];
  /* "o briefing muda no meio do prazo": viradas genéricas, sorteadas na metade do prazo */
  CY.VIRADAS = [
    'O cliente mudou de ideia: o público agora é outro. Ajuste o entregável para quem nunca ouviu falar do assunto.',
    'Cortaram o escopo: entregue com 30% a menos, sem perder o que importa. Diga o que saiu e por quê.',
    'Pediram uma versão para o celular: o entregável precisa funcionar numa tela pequena ou em 1 minuto de leitura.',
    'Chegou uma restrição nova: uma ferramenta que você usaria saiu da mesa. Termine sem ela.',
    'O prazo apertou no meio: a primeira versão precisa existir hoje, mesmo crua.',
    'Querem comparar: entregue também uma alternativa que você descartaria, com uma linha de por quê.'
  ];
  /* profundidade: cada 5 fechados sobe 1 nível (1 a 10); a cada 2 níveis, +1 slot máximo e +5% de Q base */
  CY.PROF = {porNivel: 5, max: 10, q: 5};

  /* ---------- tabela de drop ---------- */
  CY.RARS = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  CY.DROP = {
    rar: [55, 28, 12, 4, 0.9, 0.1],
    faixa: function(r){ return r === 'E' || r === 'D' ? 0 : r === 'C' || r === 'B' ? 1 : r === 'raid' ? 3 : 2; },
    gav: [
      {id: 'gem', n: '◆ extra', ic: 'gem', p: [43, 31, 19, 12]},
      {id: 'cr', n: 'Créditos do Caminho', ic: 'helm', p: [25, 20, 15, 10]},
      {id: 'item', n: 'Item', ic: 'sword', p: [15, 18, 20, 20]},
      {id: 'chave', n: 'Chave de Dungeon', ic: 'lock', p: [6, 10, 12, 12]},
      {id: 'caixa', n: 'Caixa aleatória', ic: 'bag', p: [5, 9, 14, 20]},
      {id: 'frag', n: 'Fragmento de cosmético', ic: 'sparkle', p: [3, 6, 10, 12]},
      {id: 'perg', n: 'Pergaminho', ic: 'scroll', p: [1, 2, 4, 6]},
      {id: 'vale', n: 'Vale real', ic: 'cert', p: [2, 4, 6, 8]}
    ],
    gem: [5, 15, 40, 100, 250, 600],
    cr: [3, 8, 20, 50, 120, 300],
    chave: ['E', 'E', 'D', 'C', 'A', 'S'],
    perg: [['permissao', 'E'], ['permissao', 'D'], ['dungeon', 'D'], ['historia', 'C'], ['selado', 'A'], ['selado', 'S']],
    vale: [25, 50, 100, 200, 400, 800],
    valeGem: [40, 80, 160, 320, 640, 1280],
    valeMax: 5,
    pity: {epico: 10},
    corrGem: 0.25,
    corrPar: [0, 50, 70, 90]
  };
  CY.ITENS = {
    pedra: {n: 'Pedra de Afiar', d: 'põe 1 modificador sorteado num portal (Forja)'},
    lixa: {n: 'Lixa', d: 'tira 1 modificador sorteado (Forja)'},
    dado: {n: 'Dado Torto', d: 'sorteia de novo os modificadores (Forja)'},
    brasa: {n: 'Brasa de Rank', d: 'sobe um portal de E a C em um rank (Forja)'},
    carmesim: {n: 'Fragmento Carmesim', d: 'corrompe um portal por vontade própria'},
    carimbo: {n: 'Carimbo de Prazo', d: 'segura um prazo por mais um dia'},
    purif: {n: 'Purificação', d: 'zera a corrupção de um distrito'},
    escoria: {n: 'Escória', d: 'sobra de portal quebrado; matéria das receitas de reciclagem'}
  };
  CY.ITEM_RAR = [['pedra', 'lixa'], ['dado', 'brasa'], ['carmesim', 'carimbo', 'purif', 'passe']];
  CY.PERG = {permissao: 'Pergaminho de Permissão', dungeon: 'Pergaminho de Dungeon', historia: 'Pergaminho de História', selado: 'Pergaminho Selado'};
  CY.SLOT_RELIQ = ['Arma', 'Manto', 'Anel', 'Amuleto', 'Relógio'];
  CY.VALE_CAT = {
    assinatura: {n: 'Assinatura', mais: ['escritorio', 'agencia']},
    ferramenta: {n: 'Ferramenta', mais: ['servidores', 'estudio', 'biblioteca']},
    lazer: {n: 'Lazer', mais: ['piscinas', 'galeria']},
    tempo: {n: 'Tempo', mais: ['piscinas', 'biblioteca'], porMes: 2},
    secreto: {n: 'Secreto', mais: ['galeria']}
  };
  CY.CAIXA = {menor: 'Menor', maior: 'Maior', suprema: 'Suprema'};

  /* ---------- Reavaliação: desafio que cruza dois Caminhos, com defesa (nota mínima 75) ---------- */
  CY.REAVS = [
    {n: 'A Ponte de Dois Mapas', obj: 'Escolha um problema real seu que precise de {wayA} e de {wayB} ao mesmo tempo. Resolva uma parte dele usando um nó de cada Caminho e mostre onde um corrigiu o outro.', ent: 'O resultado (texto ou link) e uma página com as duas decisões que só existiram porque os Caminhos se cruzaram.', crit: ['Os dois Caminhos aparecem no resultado, não só no texto', 'Uma decisão de um Caminho mudou por causa do outro', 'Dá para usar amanhã'], min: 120},
    {n: 'Ensine o Vizinho', obj: 'Explique um nó de {wayA} usando só exemplos de {wayB}, e depois o contrário. Grave ou escreva as duas explicações para alguém que não conhece nenhum dos dois.', ent: 'As duas explicações e uma lista do que se perdeu em cada tradução.', crit: ['Cada explicação se sustenta sozinha', 'Os exemplos são do outro Caminho de verdade', 'A lista do que se perdeu é honesta'], min: 90},
    {n: 'O Case Atravessado', obj: 'Monte um mini case de portfólio que use {wayA} e {wayB}: o problema, o que você fez em cada frente, o resultado e o que faria diferente.', ent: 'O case em até 2 páginas, com uma imagem, link ou trecho de prova.', crit: ['Problema, ação, resultado e lição estão lá', 'As duas frentes têm prova concreta', 'Cabe em 2 páginas'], min: 150},
    {n: 'Inventário de Lacunas', obj: 'Liste o que você sabe e o que finge saber em {wayA} e em {wayB}. Depois transforme as 3 maiores lacunas num plano de 2 semanas que use um Caminho para atacar a lacuna do outro.', ent: 'A lista e o plano de 2 semanas, com uma ação por dia útil.', crit: ['Há pelo menos 3 lacunas por Caminho', 'O plano cruza os Caminhos em pelo menos 3 dias', 'Cada ação cabe em 45 minutos'], min: 90},
    {n: 'Protótipo Mestiço', obj: 'Faça uma coisa pequena que só existe porque {wayA} e {wayB} se encontraram: uma ferramenta, uma peça, um texto, uma planilha, um ritual.', ent: 'O protótipo (link, foto ou texto) e 5 linhas de como cada Caminho entrou nele.', crit: ['O protótipo funciona ou existe de fato', 'Sem um dos Caminhos ele não existiria', 'As 5 linhas apontam partes concretas'], min: 120}
  ];
})();
