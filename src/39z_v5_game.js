/* ===== v5 · Fora do roteiro, trilhas e técnicas: recompensas e conquistas ===== */
SYS.OFF_XP = 15; SYS.OFF_CR = 3;
SYS.SYSACH.push(
 {id:'sys_tr1', n:'Encruzilhada', d:'Escolha sua primeira trilha num capítulo que exige escolher.', r:'common', ic:'compass', c:function(D){ return D.tracksChosen >= 1; }},
 {id:'sys_tr5', n:'Cinco Bifurcações', d:'Tenha trilha escolhida em 5 escolhas diferentes.', r:'rare', ic:'compass', title:'Escolhedor Consciente', c:function(D){ return D.tracksChosen >= 5; }},
 {id:'sys_trall', n:'Todas as Bifurcações', d:'Tenha trilha escolhida em todas as escolhas do Sistema.', r:'epic', ic:'map', title:'Cartógrafo das Bifurcações', c:function(D){ return D.tracksTotal > 0 && D.tracksChosen >= D.tracksTotal; }, ms:1},
 {id:'sys_trswap', n:'Vira-Casaca', d:'Troque de trilha 3 vezes. Mudar de ideia com dado na mão é virtude.', r:'rare', ic:'back', secret:1, title:'Vira-Casaca', c:function(D){ return D.trackSwaps >= 3; }},
 {id:'sys_tk10', n:'Curioso de Plantão', d:'Marque 10 técnicas ou ferramentas como investigadas.', r:'uncommon', ic:'eye', c:function(D){ return D.tkCount >= 10; }},
 {id:'sys_tk50', n:'Investigador', d:'Marque 50 técnicas ou ferramentas como investigadas.', r:'rare', ic:'eye', title:'Investigador', c:function(D){ return D.tkCount >= 50; }},
 {id:'sys_tk150', n:'Enciclopédia Ambulante', d:'Marque 150 técnicas ou ferramentas como investigadas.', r:'epic', ic:'book', title:'Enciclopédia Ambulante', c:function(D){ return D.tkCount >= 150; }, ms:1},
 {id:'sys_off1', n:'Fora do Roteiro', d:'Registre a primeira técnica que o Sistema não listou e que você usou de verdade num entregável.', r:'uncommon', ic:'flag', title:'Fora do Roteiro', c:function(D){ return D.offCount >= 1; }, ms:1},
 {id:'sys_off5', n:'Desconfiado Profissional', d:'Registre 5 técnicas fora do roteiro.', r:'rare', ic:'flag', title:'Desconfiado Profissional', c:function(D){ return D.offCount >= 5; }},
 {id:'sys_off15', n:'Cartógrafo de Técnicas', d:'Registre 15 técnicas fora do roteiro.', r:'epic', ic:'map', title:'Cartógrafo de Técnicas', c:function(D){ return D.offCount >= 15; }},
 {id:'sys_offw4', n:'Contrabandista de Método', d:'Traga técnicas de fora do roteiro para 4 Caminhos diferentes.', r:'epic', ic:'gem', title:'Contrabandista de Método', c:function(D){ return D.offWays >= 4; }},
 {id:'sys_off40', n:'Além do Mapa', d:'Registre 40 técnicas fora do roteiro. A essa altura, o roteiro é você.', r:'legendary', ic:'crown', title:'Além do Mapa', c:function(D){ return D.offCount >= 40; }, ms:1}
);
