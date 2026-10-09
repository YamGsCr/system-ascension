/* ===== v3 · extras da vertente Contemplação (carregam depois do 30/31) ===== */
Object.assign(SYS.GATEACH, {
  ae_g12:{n:'O Caminhante',title:'Andarilho'}, ae_g13:{n:'Olho de Campo',title:'Field Observer'},
  ae_g14:{n:'Instante Decisivo',title:'Fotógrafo'}, ae_g15:{n:'Repertório Vivo',title:'Curador'}
});

SYS.COUNTERS.push(
 {id:'km', way:'aesthetic', n:'Quilômetros caminhados', unit:'km', ic:'grass', q:[1,5,10]},
 {id:'birds', way:'aesthetic', n:'Espécies de aves registradas', unit:'espécies', ic:'eye', q:[1,5]},
 {id:'films', way:'aesthetic', n:'Filmes, séries e exposições registrados', unit:'obras', ic:'star', q:[1]},
 {id:'photos', way:'aesthetic', n:'Fotos selecionadas e publicadas', unit:'fotos', ic:'sparkle', q:[1,5]}
);

SYS.FEATS.push(
 {id:'km100', way:'aesthetic', br:'con', n:'Cem Quilômetros', d:'100 km caminhados registrados.', r:'common', ctr:'km', goal:100},
 {id:'km500', way:'aesthetic', br:'con', n:'Meio Milhar', d:'500 km caminhados.', r:'uncommon', ctr:'km', goal:500, title:'Caminhante de Longa Data'},
 {id:'km1000', way:'aesthetic', br:'con', n:'Mil Quilômetros', d:'1.000 km caminhados. Isso é atravessar estado a pé.', r:'epic', ctr:'km', goal:1000, title:'Andarilho da Serra'},
 {id:'birds50', way:'aesthetic', br:'con', n:'Cinquenta Espécies', d:'50 espécies de aves registradas.', r:'uncommon', ctr:'birds', goal:50},
 {id:'birds150', way:'aesthetic', br:'con', n:'Cento e Cinquenta', d:'150 espécies registradas. Você virou referência no grupo.', r:'epic', ctr:'birds', goal:150, title:'Observador de Aves'},
 {id:'ave_rara', way:'aesthetic', br:'con', n:'Registro Raro', d:'Registrou uma espécie rara, ameaçada ou fora de época — com foto ou áudio confirmados pela comunidade.', r:'rare', title:'Caçador de Raridades'},
 {id:'nascer_sol', way:'aesthetic', br:'con', n:'Nascer do Sol na Trilha', d:'Saiu antes do sol e viu o dia começar do alto.', r:'uncommon', title:'Madrugador de Trilha'},
 {id:'meteoros', way:'aesthetic', br:'con', n:'Chuva de Meteoros', d:'Assistiu a uma chuva de meteoros do começo ao fim (com frio e tudo).', r:'rare', title:'Vigia do Céu'},
 {id:'films52', way:'aesthetic', br:'con', n:'Um Por Semana', d:'52 obras registradas com nota e comentário.', r:'uncommon', ctr:'films', goal:52, title:'Cinéfilo de Carteirinha'},
 {id:'films200', way:'aesthetic', br:'con', n:'Duzentas Obras', d:'200 obras registradas. Repertório de verdade.', r:'epic', ctr:'films', goal:200},
 {id:'photos100', way:'aesthetic', br:'con', n:'Cem Fotos Escolhidas', d:'100 fotos selecionadas e publicadas — selecionadas, não despejadas.', r:'rare', ctr:'photos', goal:100, title:'Editor de Si'},
 {id:'expo_foto', way:'aesthetic', br:'con', n:'Exposição', d:'Suas fotos numa parede: exposição caseira, café, feira ou galeria.', r:'epic', title:'Exposto'}
);

