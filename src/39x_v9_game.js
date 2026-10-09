/* ===== v9 · conquistas, feitos e loja da Mesa e do Terminal ===== */
SYS.SYSACH.push(
 {id:'sys_mesa_reg', n:'Registro Limpo', d:'20 operações da Mesa registradas com motivo escrito antes de entrar.', r:'uncommon', ic:'journal', c:function(D){ return (D.mesaOps || 0) >= 20; }},
 {id:'sys_mesa_rule', n:'Regra Acima do Impulso', d:'20 operações registradas e nenhuma quebra de regra.', r:'rare', ic:'shield', title:'Disciplinado', c:function(D){ return (D.mesaOps || 0) >= 20 && (D.mesaBroke || 0) === 0; }},
 {id:'sys_mesa_kill', n:'Freio de Mão', d:'Mesa travada pelo kill switch e respeitada — nada de reabrir mais cedo.', r:'rare', ic:'shield', title:'Freio de Mão', c:function(D){ return !!D.mesaLocked; }},
 {id:'sys_mesa_c3', n:'Três Ciclos Fechados', d:'3 ciclos da Mesa encerrados na data combinada.', r:'epic', ic:'sword', title:'Encerrador', ms:1, c:function(D){ return (D.mesaCycles || 0) >= 3; }},
 {id:'sys_term6', n:'Meio Ano de Terminal', d:'6 meses de números registrados de fonte primária.', r:'rare', ic:'status', c:function(D){ return (D.termMonths || 0) >= 6; }},
 {id:'sys_term24', n:'Arquivo de Dois Anos', d:'24 meses de terminal alimentado. Isso já é série histórica própria.', r:'epic', ic:'status', title:'Arquivista de Dados', ms:1, c:function(D){ return (D.termMonths || 0) >= 24; }},
 {id:'sys_log50', n:'Cinquenta Decisões', d:'50 decisões registradas no log, com motivo e gatilho de mudança.', r:'epic', ic:'journal', title:'Historiador de Si', c:function(D){ return (D.decisoesLog || 0) >= 50; }}
);

SYS.FEATS.push(
 {id:'term_auto', way:'navigation', br:'tes', n:'Terminal Automatizado', d:'Script rodando sozinho, puxando as séries oficiais e salvando o histórico sem você digitar.', r:'rare', title:'Automatizador'},
 {id:'mesa_zero', way:'navigation', br:'tes', n:'Zerou Sem Drama', d:'Perdeu o capital da Mesa, respeitou o kill switch e não aportou de novo para recuperar.', r:'rare', title:'Aceitou o Zero'},
 {id:'ips_v2', way:'navigation', br:'tes', n:'IPS v2 Assinada', d:'Política de investimentos com camadas, limites, regra de rebalanceamento e política de exclusão.', r:'epic', title:'Autor da Própria Política'}
);

SYS.shop('navigation', [
 {id:'ns_t13',tier:'common',br:'tes',n:'Post-it e caneta para o mural de regras da Mesa',c:10,rule:'até R$ 30'},
 {id:'ns_t14',tier:'uncommon',br:'tes',n:'Quadro branco pequeno para o painel do mês',rule:'até R$ 200'},
 {id:'ns_t15',tier:'rare',br:'tes',n:'Impressão emoldurada da tua IPS v2',d:'Política na parede é mais difícil de trair às 2 da manhã.',rule:'até R$ 150',req:'n_C34'},
 {id:'ns_t16',tier:'rare',br:'tes',n:'Mês de teste de uma plataforma de dados paga',d:'Experimentar antes de assinar o ano inteiro. Anota o que tu realmente usou.',rule:'até R$ 300',rep:1,lim:'mês'},
 {id:'ns_t17',tier:'epic',br:'tes',n:'Mini-servidor ou placa dedicada para rodar o terminal sozinho',rule:'até R$ 800',cd:72,req:'n_C33'},
 {id:'ns_t18',tier:'legendary',br:'tes',n:'Comemoração do ciclo da Mesa encerrado no prazo',d:'Só libera se o ciclo fechou na data. Sair inteiro merece jantar.',rule:'orçamento de lazer, reserva intacta',seals:1,cd:168,req:'n_C38'}
]);
