/* ===== v3 · conquistas, títulos e cosméticos de referência (homenagens originais) ===== */
SYS.SYSACH.push(
 /* ---- ossos, determinação e espaguete ---- */
 {id:'ref_determ', n:'Cheio de Determinação', d:'Reacendeu uma sequência perdida e chegou de novo a 7 dias seguidos. O save não corrompeu.', r:'epic', ic:'flame', title:'Determinado', ms:1, c:function(D){ return D.repairsUsed >= 1 && D.streak >= 7; }},
 {id:'ref_bones', n:'Osso Azul: Fique Parado', d:'10 dias de descanso registrados. Parado é diferente de derrotado — o ataque azul ensinou isso.', r:'uncommon', ic:'moon', title:'Parado com Estilo', c:function(D){ return D.restDays >= 10; }},
 {id:'ref_pasta', n:'Espaguete às 3h', d:'25 missões extras concluídas. Alguém aí cozinha de madrugada com entusiasmo suspeito.', r:'rare', ic:'sparkle', title:'Chef Confiante', c:function(D){ return D.extrasTotal >= 25; }},
 {id:'ref_mercy', n:'MISERICÓRDIA', d:'Sequência de 30 dias sem nunca se punir por descansar (4 descansos usados). Poupar a si mesmo também é rota.', r:'rare', ic:'shield', title:'Rota Pacifista', c:function(D){ return D.bestStreak >= 30 && D.restDays >= 4; }},
 {id:'ref_gaster', n:'█rro na Fonte', d:'250 conquistas. Você viu coisas que não estavam no arquivo original.', r:'legendary', ic:'oracle', secret:1, title:'Fora do Arquivo', ms:1, c:function(D){ return D.achCount >= 250; }},
 /* ---- o batedor e a purificação ---- */
 {id:'ref_purify', n:'Zona Purificada', d:'3 dungeons limpas. Missão sagrada: apagar o que estava fora do lugar.', r:'rare', ic:'sword', title:'O Batedor', c:function(D){ return D.dunCleared >= 3; }},
 /* ---- o cavaleiro, o pop-up e quem dirige a alma ---- */
 {id:'ref_knight', n:'O Cavaleiro Sem Rosto', d:'8 dungeons limpas. Alguém andou abrindo portais por aí — e não conta para ninguém.', r:'epic', ic:'gate', title:'Abre-Portais', ms:1, c:function(D){ return D.dunCleared >= 8; }},
 {id:'ref_spamton', n:'[OFERTA] VOCÊ FOI SELECIONADO', d:'25 compras feitas nas lojas. Pop-up ambulante, você virou o próprio algoritmo de vendas.', r:'rare', ic:'bag', title:'Grande Nome', c:function(D){ return D.buysCount >= 25; }},
 {id:'ref_vessel', n:'Quem Está no Controle?', d:'Trocou os Caminhos principais 12 vezes. A alma no volante está indecisa — mas está dirigindo.', r:'uncommon', ic:'user', secret:1, title:'Vessel', c:function(D){ return (D.focusSwaps || 0) >= 12; }},
 {id:'ref_flower', n:'A Flor Que Fala Demais', d:'100 missões extras. Nesse mundo, é matar ou ser morto pela procrastinação.', r:'epic', ic:'grass', title:'Amigo Sorridente', c:function(D){ return D.extrasTotal >= 100; }},
 /* ---- operação militar ---- */
 {id:'ref_ghost', n:'Não Aparece no Relatório', d:'Sumiu, voltou e sumiu de novo — e ainda assim voltou. Duas reaparições registradas.', r:'rare', ic:'eye', title:'Máscara de Caveira', c:function(D){ return D.returned >= 2; }},
 {id:'ref_price', n:'Capitão de Bigode', d:'10 Selos conquistados. Quem lidera é quem entra primeiro.', r:'epic', ic:'gate', title:'Capitão', ms:1, c:function(D){ return D.gatesDone >= 10; }},
 {id:'ref_radio', n:'Rádio: Missão Confirmada', d:'50 dias com as diárias fechadas. Operação em andamento, sem drama.', r:'rare', ic:'target', title:'Operador', c:function(D){ return D.dailyDays >= 50; }},
 /* ---- monstrinhos, ideais e pesadelos ---- */
 {id:'ref_ideals', n:'Rei dos Ideais', d:'10 metas concluídas. Ideais viram fato quando têm prazo.', r:'epic', ic:'crown', title:'Rei dos Ideais', ms:1, c:function(D){ return D.goalsDone >= 10; }},
 {id:'ref_truth', n:'Dragão da Verdade', d:'25 exames aprovados pelo Examinador. A verdade queima, mas passa na banca.', r:'epic', ic:'oracle', title:'Verdade Branca', c:function(D){ return D.examPasses >= 25; }},
 {id:'ref_nightmare', n:'Senhor dos Pesadelos', d:'30 dias seguidos com missão extra. Dormir? Talvez depois do streak.', r:'legendary', ic:'moon', title:'Insone Lendário', ms:1, c:function(D){ return D.bestExtraStreak >= 30; }},
 {id:'ref_lamp', n:'Lustre Fantasma', d:'3.000 cristais ganhos no total. A chama roxa consome a alma de quem passa (e o seu saldo).', r:'epic', ic:'gem', title:'Chama Fantasma', c:function(D){ return D.gemEarned >= 3000; }},
 /* ---- indies em geral ---- */
 {id:'ref_dash', n:'Dash Duplo', d:'5 dias extras seguidos. Sem ar no meio do salto e mesmo assim chegou do outro lado.', r:'rare', ic:'sparkle', title:'Sem Ar, Mas Chegou', c:function(D){ return D.bestExtraStreak >= 5; }},
 {id:'ref_assist', n:'Modo Assistência (e tá tudo bem)', d:'Usou 2 gelos e seguiu com 14 dias de chama. Usar a ajuda que existe não diminui a conquista.', r:'uncommon', ic:'shield', title:'Sem Vergonha de Usar', c:function(D){ return D.freezesUsed >= 2 && D.streak >= 14; }},
 {id:'ref_loop', n:'22 Minutos', d:'22 semanas fechadas. O loop reinicia, você lembra de tudo e vai mais longe.', r:'legendary', ic:'clock', title:'Viajante do Loop', ms:1, c:function(D){ return D.weeksCleared >= 22; }},
 {id:'ref_run', n:'Mais Uma Run', d:'12 dungeons limpas. Morreu, aprendeu, voltou com build melhor.', r:'epic', ic:'sword', title:'Run Perfeita', c:function(D){ return D.dunCleared >= 12; }},
 /* ---- transmissões, fitas e alternados ---- */
 {id:'ref_broadcast', n:'Transmissão Interrompida', d:'3 dias congelados por gelo. O sinal caiu, o aviso apareceu, a programação voltou.', r:'uncommon', ic:'alert', title:'Sinal Perdido', c:function(D){ return D.freezesUsed >= 3; }},
 {id:'ref_alternate', n:'Não É Você', d:'150 conquistas. Tem alguém com a sua cara na lista — e sorri um pouco errado.', r:'epic', ic:'eye', secret:1, title:'Alternado', c:function(D){ return D.achCount >= 150; }},
 {id:'ref_tape', n:'Fita Educativa Vol. 1', d:'10 livros lidos e aplicados. "Boa noite, e lembre-se: nunca olhe diretamente para o conteúdo."', r:'rare', ic:'book', title:'Arquivista de Fitas', c:function(D){ return D.booksRead >= 10; }},
 /* ---- nostalgia de interface ---- */
 {id:'ref_aero', n:'Brilho de 2007', d:'100 dias com as diárias fechadas. Bolha, gradiente e reflexo: a era em que tudo era translúcido.', r:'epic', ic:'sparkle', title:'Aero', ms:1, c:function(D){ return D.dailyDays >= 100; }},
 {id:'ref_msn', n:'Zumbido!', d:'30 dias com as diárias fechadas. Você chacoalhou a janela do Sistema até ele responder.', r:'uncommon', ic:'status', title:'Online', c:function(D){ return D.dailyDays >= 30; }},
 {id:'ref_scrap', n:'Depoimento Sincero', d:'Perfil completo: nome, assinatura, título, moldura e vitrine. Escreveu no seu próprio scrapbook.', r:'uncommon', ic:'user', title:'Top 8', c:function(D){ return D.profileDone; }}
);

/* ---- namecards de nostalgia e transmissão ---- */
SYS.NAMECARDS.push(
 {id:'nc_aero', n:'Frutiger Aero 2007', c:450, anim:1},
 {id:'nc_eco', n:'Frutiger Eco', c:400, anim:1},
 {id:'nc_metro', n:'Blocos Metro', c:400, anim:1},
 {id:'nc_zumbido', n:'Zumbido', c:350, anim:1},
 {id:'nc_scrapbook', n:'Depoimento', c:350, anim:1},
 {id:'nc_testcard', n:'Transmissão Interrompida', c:450, anim:1},
 {id:'nc_alternate', n:'Alternado', c:0, ach:'ref_alternate', anim:1},
 {id:'nc_edutape', n:'Fita Educativa', c:400, anim:1},
 {id:'nc_indiepix', n:'Pixel Indie', c:350, anim:1}
);
SYS.FRAMES.push(
 {id:'fr_aero', n:'Moldura Aero', c:450, r:'rare', anim:1},
 {id:'fr_tape', n:'Moldura de Fita', c:400, r:'rare', anim:1}
);
SYS.FX.push(
 {id:'fx_aero', n:'Aero 2007', shop:1, anim:1},
 {id:'fx_signal', n:'Sinal Perdido', shop:1, anim:1}
);
SYS.SYSSHOP.push(
 {id:'fx_aero', n:'Nome Aero (animado)', d:'Brilho aquoso de interface de 2007. Bolhas não inclusas.', c:420, kind:'fx'},
 {id:'fx_signal', n:'Nome com sinal perdido (animado)', d:'O nome pisca como transmissão fora do ar.', c:460, kind:'fx'}
);

/* ---- feitos: cosplay & cultura ---- */
SYS.FEATS.push(
 {id:'cos_first', way:'aesthetic', br:'sty', n:'Primeiro Cosplay Completo', d:'Montou um cosplay inteiro (roupa, cabelo, maquiagem) e usou.', r:'uncommon', title:'Cosplayer'},
 {id:'cos_craft', way:'aesthetic', br:'sty', n:'Feito à Mão', d:'Fabricou uma peça do zero: costura, EVA, impressão 3D ou pintura.', r:'rare', title:'Prop Maker'},
 {id:'cos_event', way:'aesthetic', br:'sty', n:'Cosplay em Evento', d:'Usou um cosplay num evento, feira ou encontro — e tirou foto.', r:'rare', title:'Presença de Evento'},
 {id:'cos_shoot', way:'aesthetic', br:'sty', n:'Ensaio de Cosplay', d:'Ensaio fotográfico do personagem, com edição e publicação.', r:'epic', title:'Personagem Vivo'},
 {id:'cos_stage', way:'aesthetic', br:'sty', n:'Palco do Concurso', d:'Se inscreveu num concurso de cosplay e subiu no palco.', r:'epic', title:'Cosplayer de Palco'},
 {id:'ref_speedrun', way:'mind', n:'Speedrun Pessoal', d:'Bateu o próprio recorde numa tarefa repetida (mesma tarefa, tempo menor, medido).', r:'uncommon', title:'Sub-1h'},
 {id:'ref_platinum', way:'mind', n:'Platina', d:'Terminou 100% de um jogo que você ama — sem guia, ou com guia e sem culpa.', r:'rare', title:'Caçador de Troféus'},
 {id:'ref_argsolve', way:'flaneur', br:'obs', n:'Quebrou o ARG', d:'Resolveu (ou ajudou a resolver) um puzzle de ARG ou creepypasta interativa.', r:'epic', title:'Decodificador'}
);

/* ---- loja: cosplay, colecionáveis e nostalgia ---- */
SYS.shop('aesthetic', [
 {id:'es_cos1',tier:'common',br:'sty',n:'Maquiagem de caracterização (base, tinta, cola)',c:35,rule:'até R$ 120',rep:1,lim:'mês'},
 {id:'es_cos2',tier:'uncommon',br:'sty',n:'Tecido e aviamentos para uma peça de cosplay',rule:'até R$ 250'},
 {id:'es_cos3',tier:'uncommon',br:'sty',n:'Peruca + kit de styling',rule:'até R$ 300'},
 {id:'es_cos4',tier:'uncommon',br:'sty',n:'Placas de EVA, cola quente e ferramentas de prop',rule:'até R$ 250'},
 {id:'es_cos5',tier:'rare',br:'sty',n:'Ingresso de evento geek, anime ou game',rule:'até R$ 300',rep:1,lim:'mês'},
 {id:'es_cos6',tier:'rare',br:'sty',n:'Lentes de contato coloridas',d:'Só em ótica, com orientação profissional e prescrição. Olho não é acessório.',rule:'até R$ 400'},
 {id:'es_cos7',tier:'rare',br:'sty',n:'Impressão 3D de um prop (serviço ou filamento)',rule:'até R$ 400'},
 {id:'es_cos8',tier:'epic',br:'sty',n:'Ensaio fotográfico de cosplay com fotógrafo',rule:'até R$ 800',cd:72,req:'n_E58'},
 {id:'es_cos9',tier:'epic',br:'sty',n:'Máquina de costura de entrada',rule:'até R$ 1.500',cd:168},
 {id:'es_cos10',tier:'legendary',br:'sty',n:'Cosplay completo de armadura (materiais + tempo de oficina)',rule:'orçamento separado, com prazo de meses',seals:2,cd:168}
]);
SYS.shop('architect', [
 {id:'as_r1',tier:'common',n:'Camiseta de um jogo indie que te marcou',c:35,rule:'até R$ 120'},
 {id:'as_r2',tier:'uncommon',n:'Chaveiro ou pin de coração pixelado',rule:'até R$ 60'},
 {id:'as_r3',tier:'rare',n:'Teclado com switches que fazem barulho de terminal antigo',rule:'até R$ 700',cd:72}
]);
SYS.shop('mind', [
 {id:'mi_r1',tier:'uncommon',n:'Artbook de um jogo que mexeu com você',rule:'até R$ 300'},
 {id:'mi_r2',tier:'uncommon',n:'Pelúcia de fantasma, esqueleto ou monstrinho',rule:'até R$ 200'},
 {id:'mi_r3',tier:'rare',n:'Coleção de fitas VHS (ou um videocassete que ainda funciona)',d:'Para a estética, para o medo e para gravar suas próprias fitas.',rule:'até R$ 400'}
]);
SYS.shop('vitruviano', [
 {id:'ms_r1',tier:'uncommon',br:'har',n:'Trilha sonora de jogo em vinil ou cassete',rule:'até R$ 300'},
 {id:'ms_r2',tier:'rare',br:'har',n:'Kit de gravação de voz para fitas e transmissões falsas',rule:'até R$ 400',req:'n_M42'}
]);
SYS.shop('flaneur', [
 {id:'fs_r1',tier:'uncommon',n:'Livro de terror analógico, creepypasta impressa ou zine de ARG',rule:'até R$ 150'},
 {id:'fs_r2',tier:'rare',n:'Impressora de etiquetas/fotos para props de ARG',rule:'até R$ 500',req:'n_F28'}
]);
