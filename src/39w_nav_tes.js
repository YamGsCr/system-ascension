/* ===== v8 · contadores, feitos, conquistas e loja da vertente Tesouraria & Capital ===== */
SYS.COUNTERS.push(
 {id:'decisoes', way:'navigation', n:'Decisões registradas no log', unit:'decisões', ic:'journal', q:[1,5]},
 {id:'teses', way:'navigation', n:'Teses escritas com falsificador', unit:'teses', ic:'scroll', q:[1]},
 {id:'terminal', way:'navigation', n:'Meses com o terminal alimentado', unit:'meses', ic:'status', q:[1]}
);

SYS.FEATS.push(
 {id:'caixa_rende', way:'navigation', br:'tes', n:'Caixa Acordado', d:'Primeiro mês com o caixa (PF ou PJ) rendendo em instrumento escolhido de propósito.', r:'common'},
 {id:'escada_pronta', way:'navigation', br:'tes', n:'Escada Montada', d:'Escada de liquidez com pelo menos 3 degraus casados com compromissos reais.', r:'uncommon'},
 {id:'failover_ok', way:'navigation', br:'tes', n:'Failover Testado', d:'Drill de 3 meses sem a receita principal, feito com números reais.', r:'rare', title:'Plano B Real'},
 {id:'taxa_neg', way:'navigation', br:'tes', n:'Taxa Renegociada', d:'Reduziu uma taxa real (antecipação, maquininha, crédito) numa negociação de verdade.', r:'uncommon', title:'Cortador de Juros'},
 {id:'tese1', way:'navigation', br:'tes', n:'Primeira Tese', d:'Primeira ficha de tese completa, com falsificador escrito.', r:'common', ctr:'teses', goal:1},
 {id:'tese10', way:'navigation', br:'tes', n:'Dez Teses', d:'10 teses escritas com falsificador.', r:'rare', ctr:'teses', goal:10, title:'Tesista'},
 {id:'log12', way:'navigation', br:'tes', n:'Doze Decisões', d:'12 decisões registradas no log, com motivo.', r:'uncommon', ctr:'decisoes', goal:12},
 {id:'terminal12', way:'navigation', br:'tes', n:'Um Ano de Terminal', d:'12 meses com o terminal alimentado.', r:'epic', ctr:'terminal', goal:12, title:'Terminal Vivo'},
 {id:'alt1', way:'navigation', br:'tes', n:'Primeiro Alternativo', d:'Primeiro investimento alternativo por porta regulada, com due diligence escrita.', r:'rare'},
 {id:'mesa_fechada', way:'navigation', br:'tes', n:'Mesa Encerrada no Prazo', d:'Fechou o ciclo da Mesa na data combinada, com relatório e sem prorrogar.', r:'epic', title:'Mão Que Para'}
);

SYS.SYSACH.push(
 {id:'sys_regua', n:'Régua Antes da Ferramenta', d:'Completou a Régua (C01, C02 e C03) antes de sair comprando estratégia.', r:'uncommon', ic:'target', c:function(D){ return !!(D.nodeDone.C01 && D.nodeDone.C02 && D.nodeDone.C03); }},
 {id:'sys_terminal3', n:'Três Meses de Terminal', d:'Terminal alimentado por 3 meses seguidos.', r:'rare', ic:'status', title:'Operador de Dados', c:function(D){ return (D.ctr.terminal || 0) >= 3; }},
 {id:'sys_defesa', n:'Continuar Rico', d:'Selo de Defesa do Patrimônio conquistado: failover, contraparte, fraude e seguro.', r:'rare', ic:'shield', title:'Continuar Rico', c:function(D){ return !!D.gateDone.ngt4; }},
 {id:'sys_carta', n:'Carta ao Cotista', d:'Escreveu a Carta de Capital e a IPS v2 — e o cotista é você.', r:'epic', ic:'scroll', ms:1, title:'Cotista de Si Mesmo', c:function(D){ return !!D.nodeDone.C34; }},
 {id:'sys_mesa_off', n:'Sabe a Hora de Parar', d:'Encerrou a Mesa no prazo combinado.', r:'rare', ic:'shield', title:'Sabe Parar', c:function(D){ return !!D.nodeDone.C38; }}
);

SYS.shop('navigation', [
 {id:'ns_t1',tier:'common',br:'tes',n:'Café da revisão mensal do terminal',c:12,rule:'até R$ 30',rep:1,lim:'mês'},
 {id:'ns_t2',tier:'common',br:'tes',n:'Caderno bonito só para o log de decisões',rule:'até R$ 60'},
 {id:'ns_t3',tier:'uncommon',br:'tes',n:'Calculadora financeira (a clássica de 12 teclas)',rule:'até R$ 400'},
 {id:'ns_t4',tier:'uncommon',br:'tes',n:'Livro físico da vertente (Fortuna, Bernstein, Ang…)',rule:'até R$ 200',rep:1,lim:'mês'},
 {id:'ns_t5',tier:'uncommon',br:'tes',n:'SSD externo para o backup do terminal e dos dados',rule:'até R$ 350'},
 {id:'ns_t6',tier:'rare',br:'tes',n:'Assinatura anual de dados ou casa de research',d:'Research não é ordem: é opinião com CNPJ. Continue decidindo pela sua IPS.',rule:'até R$ 600 por ano'},
 {id:'ns_t7',tier:'rare',br:'tes',n:'Curso pago de renda fixa, valuation ou crédito',rule:'até R$ 800',cd:72},
 {id:'ns_t8',tier:'rare',br:'tes',n:'Segunda tela dedicada ao terminal',rule:'até R$ 1.200',cd:72},
 {id:'ns_t9',tier:'epic',br:'tes',n:'Uma hora paga com contador, CFP ou advogado tributarista',d:'Pergunta escrita antes da reunião. Hora de especialista é caro para improvisar.',rule:'até R$ 900',cd:72},
 {id:'ns_t10',tier:'epic',br:'tes',n:'Visita presencial para ver um ativo de perto (fazenda, imóvel, galpão)',rule:'orçamento de viagem separado',cd:168,req:'n_C32'},
 {id:'ns_t11',tier:'legendary',br:'tes',n:'Fim de semana fora comemorando o primeiro ano de terminal',rule:'orçamento de lazer, reserva intacta',seals:1,cd:168},
 {id:'ns_t12',tier:'legendary',br:'tes',n:'Estação dedicada ao terminal e à carteira',rule:'até R$ 6.000',seals:2,cd:168}
]);
