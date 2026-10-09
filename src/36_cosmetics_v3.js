/* ===== v3 · cosméticos animados: namecards, molduras e efeitos de nome ===== */
SYS.NAMECARDS.push(
 {id:'nc_darkworld', n:'Mundo Escuro', c:450, anim:1},
 {id:'nc_soulbox', n:'Caixa da Alma', c:450, anim:1},
 {id:'nc_overworld', n:'Overworld 8-bit', c:400, anim:1},
 {id:'nc_dungeon8', n:'Masmorra 8-bit', c:400, anim:1},
 {id:'nc_terminal', n:'Terminal Verde', c:350, anim:1},
 {id:'nc_glyphrain', n:'Chuva de Glifos', c:500, anim:1},
 {id:'nc_bluescreen', n:'Tela Azul', c:350, anim:1},
 {id:'nc_loading', n:'Carregando…', c:300, anim:1},
 {id:'nc_404', n:'Erro 404', c:350, anim:1},
 {id:'nc_rgbsetup', n:'Setup RGB', c:450, anim:1},
 {id:'nc_deepfried', n:'Deep Fried', c:300, anim:1},
 {id:'nc_skillissue', n:'Skill Issue', c:300, anim:1},
 {id:'nc_speedrun', n:'Speedrun', c:400, anim:1},
 {id:'nc_lofi', n:'Lo-fi 3h da Manhã', c:400, anim:1},
 {id:'nc_boss', n:'Barra de Boss', c:0, ach:'sys_boss5', anim:1},
 {id:'nc_gacha', n:'Tela de Gacha', c:0, ach:'sys_chest25', anim:1},
 {id:'nc_arise', n:'ARISE', c:0, ach:'sys_arise', anim:1}
);

SYS.FRAMES.push(
 {id:'fr_rgb', n:'Moldura RGB (setup gamer)', c:500, r:'epic', anim:1},
 {id:'fr_fire', n:'Moldura em Chamas', c:550, r:'epic', anim:1},
 {id:'fr_pixel', n:'Moldura 8-bit', c:400, r:'rare', anim:1},
 {id:'fr_static', n:'Moldura Estática', c:450, r:'rare', anim:1},
 {id:'fr_soul', n:'Moldura da Alma', c:500, r:'epic', anim:1},
 {id:'fr_heaven', n:'Moldura Made in Heaven', c:0, ach:'sys_heaven', r:'mythic', anim:1}
);

SYS.FX.push(
 {id:'fx_rainbow', n:'Arco-íris', shop:1, anim:1},
 {id:'fx_fire', n:'Chamas', shop:1, anim:1},
 {id:'fx_ice', n:'Gelo', shop:1, anim:1},
 {id:'fx_neon', n:'Neon', shop:1, anim:1},
 {id:'fx_static', n:'Estática', shop:1, anim:1},
 {id:'fx_terminal', n:'Terminal', shop:1, anim:1},
 {id:'fx_pixel', n:'Pixel', shop:1, anim:1},
 {id:'fx_wave', n:'Onda', shop:1, anim:1}
);

SYS.SYSSHOP.push(
 {id:'fx_rainbow', n:'Nome arco-íris (animado)', d:'O nome cicla cores sem parar. Discreto? Não.', c:420, kind:'fx'},
 {id:'fx_fire', n:'Nome em chamas (animado)', d:'Pega fogo de baixo para cima.', c:450, kind:'fx'},
 {id:'fx_ice', n:'Nome de gelo (animado)', d:'Brilho frio que atravessa o nome.', c:450, kind:'fx'},
 {id:'fx_neon', n:'Nome neon (animado)', d:'Pulsa como letreiro de bar às 2h.', c:400, kind:'fx'},
 {id:'fx_static', n:'Nome com estática (animado)', d:'Sinal ruim, presença forte.', c:480, kind:'fx'},
 {id:'fx_terminal', n:'Nome de terminal (animado)', d:'Verde fosforescente com cursor piscando.', c:380, kind:'fx'},
 {id:'fx_pixel', n:'Nome pixelado (animado)', d:'Troca de paleta em passos, como console velho.', c:360, kind:'fx'},
 {id:'fx_wave', n:'Nome em onda (animado)', d:'Gradiente que anda pela palavra.', c:430, kind:'fx'}
);
