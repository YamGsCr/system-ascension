/* ===== v21 · Vitruviano: conquistas dos selos novos, certificações de idioma e os Títulos acima dos Ways =====
   Os selos que vieram do Ars (ar_*) e do Mind (mi_*) mantêm as conquistas de antes. */
Object.assign(SYS.GATEACH, {
  vt_mt1:{n:'Rank I · Elementa',title:'Elementarius'}, vt_mt2:{n:'Rank II · Calculus',title:'Calculator'},
  vt_mt3:{n:'Rank III · Linearis',title:'Geometra'}, vt_mt4:{n:'Rank IV · Signum',title:'Signifer'},
  vt_mt5:{n:'Rank V · Estimatio',title:'Aestimator'}, vt_mt6:{n:'Rank VI · Micromotus',title:'Radar Whisperer'},
  vt_mt7:{n:'Opus Publicum',title:'Auctor'},
  vt_hp1:{n:'Teclado como Mapa',title:'Pianista de Estúdio'}, vt_pa1:{n:'Os Antigos',title:'Leitor de Milesianos'},
  vt_pa2:{n:'Aristóteles',title:'Peripatético'},
  vt_po0:{n:'Ágora',title:'Homem de Aço'}, vt_po1:{n:'Os Clássicos da Pólis',title:'Polites'},
  vt_po2:{n:'O Estado Moderno',title:'Contratualista'}, vt_po3:{n:'A Esquerda',title:'Leitor de Marx'},
  vt_po4:{n:'A Direita',title:'Leitor de Burke'}, vt_po5:{n:'Realpolitik Hoje',title:'Archon'},
  vt_pox1:{n:'Natureza contra a Máquina',title:'Ludita Lúcido'}, vt_pox2:{n:'Rede Livre',title:'Cypherpunk'},
  vt_pox3:{n:'Fé, Ordem & Economias Esquecidas',title:'Arqueólogo de Heresias'}, vt_pox4:{n:'Conspirologia com Régua',title:'Cético de Colares'},
  vt_ln1:{n:'Inglês C1',title:'Advanced Speaker'}, vt_ln2:{n:'Japonês N2',title:'Nihongo Adept'},
  vt_ln3:{n:'Chinês HSK 4',title:'Hanyu Speaker'}, vt_ln4:{n:'Redação Mil',title:'Pena de Ouro'},
  vt_ld2:{n:'Q.E.D.',title:'Dialecticus'}, vt_lr2:{n:'Escrita Científica',title:'Rhetor'},
  vt_sm1:{n:'Superare Machinam',title:'Superare Machinam'}
});

/* idiomas: as provas oficiais entram em Missões › Certificações, com data e status */
SYS.CERTS.push(
 {id:'efset',n:'EF SET · nivelamento de inglês',way:'vitruviano',pri:'Alta',when:'Onda 3, no primeiro dia do inglês',notBefore:'Nada: é o ponto de partida do inglês.',prep:'Teste completo de uma vez, num horário bom, sem dicionário.',pass:'O seu nível de partida medido (marco L01).',url:'https://www.efset.org/',xp:40,title:'Ponto de Partida'},
 {id:'en_b2',n:'Inglês B2 · marco intermediário',way:'vitruviano',pri:'Média',when:'Depois de 8 semanas de escuta e fala diárias',notBefore:'L02 completo.',prep:'Simulados de leitura e escuta + escrita de e-mail técnico.',pass:'Discute trabalho técnico com folga.',url:'https://www.cambridgeenglish.org/exams-and-tests/cefr/',xp:100,title:'Upper Intermediate'},
 {id:'en_c1',n:'Inglês C1 · Cambridge C1 Advanced, IELTS 7 ou TOEFL iBT 5',way:'vitruviano',pri:'Alta',when:'Quando o B2 estiver confortável',notBefore:'B2 confirmado por prova.',prep:'Simulados no tempo oficial e writing corrigido por alguém de fora.',pass:'Consultoria e papers em inglês sem muleta. TOEFL iBT na escala nova de 1 a 6.',url:'https://www.cambridgeenglish.org/exams-and-tests/advanced/',xp:300,title:'C1 Certificado'},
 {id:'jlpt_n5',n:'JLPT N5 · japonês',way:'vitruviano',pri:'Média',when:'Onda 1, depois do kana completo',notBefore:'L05 (kana) completo.',prep:'Gramática do N5, cerca de 100 kanji e escuta lenta.',pass:'Primeiro degrau oficial do japonês.',url:'https://www.jlpt.jp/e/',xp:80,title:'Nihongo Shoshinsha'},
 {id:'jlpt_n4',n:'JLPT N4 · japonês (abre o chinês)',way:'vitruviano',pri:'Média',when:'Depois do N5',notBefore:'N5 aprovado.',prep:'Gramática do N4, cerca de 300 kanji e leitura de textos curtos.',pass:'Conversação básica. Aprovado aqui, a Onda 5 (chinês) pode entrar.',url:'https://www.jlpt.jp/e/',xp:150,title:'Nihongo Gakusei'},
 {id:'jlpt_n2',n:'JLPT N2 · japonês',way:'vitruviano',pri:'Alta',when:'Chefe do japonês',notBefore:'N4 aprovado e leitura longa no tempo.',prep:'Cerca de 1.000 kanji, leitura longa e escuta natural.',pass:'Lê jornal e entende conversa natural.',url:'https://www.jlpt.jp/e/',xp:400,title:'Nihongo Adept'},
 {id:'hsk1',n:'HSK 1 · chinês',way:'vitruviano',pri:'Opcional',when:'Onda 5, só depois do JLPT N4',notBefore:'JLPT N4 aprovado; pinyin e tons treinados (L09).',prep:'Vocabulário do HSK 1 e escuta.',pass:'Primeiro degrau oficial do chinês.',url:'https://www.chinesetest.cn/',xp:80,title:'Hanyu Chuxuezhe'},
 {id:'hsk4',n:'HSK 4 · chinês',way:'vitruviano',pri:'Alta',when:'Chefe do chinês',notBefore:'HSK 3 confortável.',prep:'Vocabulário do HSK 4, leitura de especificação e conversa de negociação.',pass:'Fala com fornecedor e lê especificação simples.',url:'https://www.chinesetest.cn/',xp:400,title:'Hanyu Speaker'}
);

/* Títulos acima dos Ways: o ideal grego do belo e bom pede corpo e caráter juntos.
   Prokopton (o que progride): tier IV no Vitruviano, no Aesthetic e na vertente Calistenia — o marco dos 6 a 12 meses
   e o gatilho da tatuagem. Kalokagathia: tier máximo nos três, o ápice. A regra mora em E.kalok (63b). */
SYS.SYSACH.push(
 {id:'sys_prokopton', n:'Prokopton', d:'Tier IV no Vitruviano, no Aesthetic e na vertente Calistenia ao mesmo tempo.', r:'legendary', ic:'banner', ms:1, title:'Prokopton', c:function(D){ return !!(E.kalok && E.kalok(D).prokopton); }},
 {id:'sys_kalokagathia', n:'Kalokagathia', d:'Tier máximo no Vitruviano, no Aesthetic e na vertente Calistenia: o belo e bom, corpo e caráter juntos.', r:'mythic', ic:'crown', ms:1, title:'Kalokagathia', c:function(D){ return !!(E.kalok && E.kalok(D).kalokagathia); }}
);
