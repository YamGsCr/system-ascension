/* ===== THE MIND WAY · jogos e escrita criativa =====
   Desde a v21 o Mind fica com as vertentes Hiperfocos & Arquivos e Jogos & Sistemas. A antiga base
   (lógica, filosofia, psicologia, Jung, retórica, memória e atenção) mudou para o Vitruviano com os mesmos IDs. */
SYS.lib({
  scoutMindset:{t:'The Scout Mindset',a:'Julia Galef',y:'2021',w:'mind',note:'Querer ver as coisas como são, não como gostaríamos.'},
  naoLugares:{t:'Non-lieux',a:'Marc Augé',y:'1992',pt:'Não-Lugares (Papirus)',w:'mind',note:'Aeroportos, shoppings e rodovias: a antropologia por trás dos espaços liminares.'},
  poeticaEspaco:{t:'La Poétique de l’Espace',a:'Gaston Bachelard',y:'1957',pt:'A Poética do Espaço (Martins Fontes)',w:'mind',note:'A casa, o porão, a gaveta, o canto: como o espaço vive na imaginação.'},
  simulacros:{t:'Simulacres et Simulation',a:'Jean Baudrillard',y:'1981',pt:'Simulacros e Simulação',w:'mind',note:'Hiper-realidade: quando a cópia vale mais que o real (weirdcore agradece).'},
  sociedadeCansaco:{t:'Müdigkeitsgesellschaft',a:'Byung-Chul Han',y:'2010',pt:'Sociedade do Cansaço (Vozes)',w:'mind',note:'Sociedade do desempenho, autoexploração e burnout. Base filosófica da Regra da Vida deste Sistema.'},
  flow:{t:'Flow',a:'Mihaly Csikszentmihalyi',y:'1990',w:'mind',note:'Condições do estado de fluxo: desafio e habilidade em equilíbrio.'}
});

SYS.way({
  id:'mind', name:'The Mind Way', pt:'Caminho do Jogo e do Mito', attr:'IMA', attrName:'Imaginação', color:'#9b8cff', icon:'eye',
  cur:{code:'MND', name:'Créditos da Mente'},
  tagline:'Jogos e escrita criativa, em duas vertentes de hobby: Hiperfocos & Arquivos (pesquisa, mitologia digital, estéticas da internet e o que você escreve a partir disso) e Jogos & Sistemas.',
  lore:'Hobby com forma, sem diária e sem cobrança. Filosofia, política, lógica, retórica e psicologia moraram aqui até a reestruturação: hoje estão no Vitruviano. O Mind ficou com o que é jogo e imaginação.',
  checks:['Existe registro (caderno, replay, ficha ou texto)','O hobby teve forma: alvo, escopo ou data','Terminou, publicou ou fechou com relatório'],
  tierNames:['Lurker','Player','Archivist','Myth Weaver','Shadow Walker','The Curious'], branches:[]
});
