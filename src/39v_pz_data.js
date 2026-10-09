/* ===== v13 · O CHAMADO · dados: falas do ALGOZ, prendas, treinos, cenários, conquistas =====
   ALGOZ é o executor de penalidades deste Sistema — figura e falas originais.            */
SYS.SELF_URL = 'https://claude.ai/artifact/YZt99TcUV9jxg284soxckp';

SYS.PZ = {
  NAME:'ALGOZ',
  REW:5,                                   /* ◆ por janela cumprida */
  SEQREW:{3:10, 7:25, 14:40, 30:100, 60:150, 100:300},
  FINE:{over:10, full:20, dobro:15, extra:10, extraCap:40},
  MAXOPEN:3,
  TRUCES:2,                                /* tréguas por mês */
  RANKS:[[8,'S'],[5,'A'],[3,'B'],[2,'C'],[1,'D']],

  LINES:{
    intro:[
      'Eu sou o ALGOZ. O Sistema me acordou porque está tudo dando certo demais.',
      'Todo dia, das {ini} às {fim}, o portão abre. Você entra e deixa uma marca: uma ação real. Só isso.',
      'Se a janela fechar vazia, às {ver} sai o veredito. E o veredito tem uma porta só.'
    ],
    call:[
      'O portão abriu às {ini}. Fecha às {fim}. Eu não negocio horário.',
      '{dur} minutos. É tudo que eu vim buscar. É tudo que você anda escondendo.',
      'Não vim motivar ninguém. Vim cobrar.',
      'Tudo está dando certo. É exatamente aí que a maioria para de treinar.',
      'Você não precisa de vontade. Precisa de uma ação. Uma. Agora.',
      'Conforto é o boss que ninguém percebe que está enfrentando. Você está perdendo essa luta sentado.',
      'Promessa eu tenho uma gaveta cheia. Abre uma missão.',
      'O relógio já começou sem você. Ele sempre começa.',
      'Rotina não é prisão. Prisão é o que eu tenho preparado para quem não tem rotina.',
      'Escolhe uma missão. Antes que eu escolha uma prenda.',
      'Ninguém está olhando. Por isso mesmo conta.',
      'Você pediu pressão. Pressão chegou. Reclamações são aceitas depois das {fim}.',
      'Talento sem horário é só uma história boa para contar em churrasco.',
      'Hoje você não precisa ser bom. Precisa aparecer.',
      'O Sistema registra tudo. Inclusive o que você não fez.',
      '“Amanhã” é o dia mais produtivo de todo mundo que eu já penalizei.',
      'Um nó. Um tópico. Uma diária. Qualquer coisa que deixe marca no registro.',
      'A janela está aberta. A Zona também, do outro lado do corredor.',
      'Não existe dia perfeito para começar. Existe {ini}.',
      'Você construiu um Sistema inteiro para não ter que decidir todo dia. Então não decide. Entra.'
    ],
    callSeq:[
      '{seq} janelas seguidas. Estou quase respeitando. Não estrague.',
      '{seq} dias no horário. Sequência não se defende sozinha.',
      'Você tem {seq} janelas limpas. Eu tenho paciência. Vamos ver quem cede primeiro.',
      '{seq} seguidas. A partir daqui, falhar custa mais do que cumprir.'
    ],
    callAfterMiss:[
      'Ontem a janela fechou vazia. Hoje é a resposta.',
      'Ontem você faltou. Hoje eu cheguei mais cedo no seu pensamento.',
      'Uma falta é acidente. A próxima é assinatura. Entra.'
    ],
    callDebt:[
      'Você ainda me deve {n}. Mesmo assim o portão abriu. Entra.',
      'Dívida aberta não suspende horário. Entra agora, quita depois.'
    ],
    callEarly:[
      'Vi que você já trabalhou hoje. O portão não é sobre quantidade: é sobre horário. Uma ação, agora.',
      'O que você fez mais cedo está anotado. A janela é das {ini} às {fim}. Deixa uma marca nela.',
      'Trabalho de antes do portão conta para você. Para mim, conta o que acontece entre {ini} e {fim}.'
    ],
    callLow:[
      'Faltam {left} minutos. Uma ação cabe em três.',
      '{left} minutos. Eu já estou separando a roleta.',
      'O portão está fechando. Decide de que lado você fica.'
    ],
    done:[
      'Registrado. Era só isso. Sempre é só isso.',
      'Janela cumprida. Eu volto amanhã, no mesmo minuto.',
      'Viu? Não doeu. O que dói é a Zona.',
      'Marca feita. Pode continuar — ninguém vai te impedir de fazer mais.'
    ],
    ok:[
      'Veredito: cumprido. Não tenho assunto com você hoje.',
      'Você apareceu. Anotado a seu favor.',
      'Sem penalidade. Aproveita a noite — você pagou por ela.',
      'Limpo. Amanhã, {ini}, eu confiro de novo.',
      'Nada a cobrar. É assim que eu gosto de não trabalhar.'
    ],
    early:[
      'Você chegou antes de mim. Isso é raro. Não se acostume — mas registrado.',
      'Diárias fechadas antes de o portão abrir. Hoje eu só vim olhar.'
    ],
    late:[
      'Atrasado. Sem penalidade, sem glória. O horário existe por um motivo.',
      'Você apareceu depois do portão fechar. Conta como presença, não como pontualidade.'
    ],
    miss:[
      '{ini}. {fim}. Dois horários. Você errou os dois.',
      'A janela fechou com você do lado de fora.',
      'Eu esperei {dur} minutos. O que você fez com eles?',
      'Não foi falta de tempo. Foi falta de início.',
      'Você tinha uma tarefa: aparecer. Nem precisava ser bom.',
      'Está tudo dando certo, não é? Então não vai fazer falta pagar a prenda.',
      'Eu não aceito “amanhã”. O Sistema também não.',
      'O registro de hoje está em branco. Em branco também é resposta.',
      'Eu não estou bravo. Bravo passa. Eu estou anotando.'
    ],
    missAgain:[
      'Segunda falta seguida. Uma é acidente. Duas é decisão.',
      'De novo. Você está transformando exceção em estilo de vida. Eu transformo em prenda.',
      'Duas janelas vazias em sequência. A Zona já sabe o seu nome de cor.'
    ],
    missMany:[
      '{n} janelas vazias. Sumir não apaga a dívida. Só acumula juro.',
      '{n} dias sem aparecer. Eu continuei vindo. Todo dia. No mesmo minuto.'
    ],
    full:[
      'A Zona está lotada de prendas suas. Enquanto não quitar, eu cobro em cristal.'
    ],
    paid:[
      'Prenda quitada. A Zona fecha a porta atrás de você.',
      'Pago. Sem ressentimento — é só contabilidade.',
      'Dívida encerrada. Tente não voltar.'
    ],
    over:[
      'Prenda vencida. A dívida cresceu sozinha enquanto você olhava para o outro lado.'
    ],
    truce:[
      'Trégua concedida. Eu sei contar: {n} neste mês.',
      'Hoje eu deixo passar. Trégua não é perdão — é crédito, e crédito acaba.'
    ],
    morning:[
      'Decide agora o que você abre às {ini}. Quem decide na hora perde a janela decidindo.',
      'Deixa o capítulo aberto antes de sair. Às {ini} é só continuar.',
      'O dia é seu até as {ini}. Depois é meu por {dur} minutos.',
      'Eu não esqueci de você. {ini}.',
      'Não precisa de dia bom. Precisa de uma ação entre {ini} e {fim}.',
      'Escolhe a missão de hoje enquanto ainda está descansado. Às {ini} você só executa.',
      'Hoje tem portão. O resto do dia é contexto.',
      'Quem chega às {ini} com a tarefa escolhida já entrou com meia janela ganha.'
    ]
  },

  /* prendas: w = peso na roleta · due = dias de prazo · ai = pode ser redigida sob medida */
  KINDS:[
    {id:'selo', n:'Noite Selada', ic:'lock', w:3, due:0, d:'Uma noite inteira sem jogo. O Sistema escolhe qual.', how:'Não jogue na noite marcada. No dia seguinte, confirme com honestidade.'},
    {id:'treino', n:'Lista de Exercícios', ic:'flame', w:3, due:1, ai:1, d:'Um circuito curto, sem equipamento. Disciplina no corpo quando faltou na agenda.', how:'Faça o circuito inteiro e marque item por item.'},
    {id:'briefing', n:'Briefing de Cenário', ic:'scroll', w:3, due:3, ai:1, d:'Um cenário de crise cai na sua mesa. Você entrega um briefing de uma página.', how:'Escreva situação, opções, recomendação, risco e próximo passo.'},
    {id:'banca', n:'Interrogatório', ic:'oracle', w:2, due:3, d:'Teach-back de um capítulo que você diz dominar, diante do Examinador.', how:'Explique o capítulo sorteado com as suas palavras, incluindo quando dá errado.'},
    {id:'autopsia', n:'Autópsia da Falha', ic:'journal', w:2, due:1, d:'Post-mortem sem culpa: o que aconteceu, o que travou, o que muda.', how:'Três respostas curtas e honestas. Sem autoflagelo: causa, não culpa.'},
    {id:'marcha', n:'Marcha', ic:'grass', w:2, due:2, d:'Trinta minutos andando, sem tela na mão.', how:'Caminhe 30 minutos sem celular na mão e registre uma coisa que você reparou.'},
    {id:'leitura', n:'Leitura Forçada', ic:'book', w:2, due:2, d:'Vinte páginas de um livro do Sistema e cinco linhas próprias.', how:'Leia 20 páginas e escreva o que mudou no que você pensa.'},
    {id:'dobro', n:'Janela Dobrada', ic:'clock', w:2, due:0, d:'A próxima janela vale o dobro: o mínimo de ações é multiplicado por dois.', how:'Cumpra a próxima janela com o dobro de ações. O Sistema confere sozinho.'}
  ],

  /* treinos de reserva por nível da vertente de Calistenia (0 = começo, 1 = meio, 2 = avançado) */
  TREINOS:[
    [
      {t:'Circuito de Entrada', min:14, rounds:3, rest:'60 a 90 s entre voltas', items:[['Flexão inclinada (mãos na mesa)','8'],['Agachamento','12'],['Prancha','20 s'],['Ponte de glúteo','12']]},
      {t:'Escada Curta', min:15, rounds:3, rest:'60 a 90 s entre voltas', items:[['Flexão de joelhos','8'],['Afundo alternado','8 por perna'],['Superman','10'],['Prancha lateral','15 s por lado']]},
      {t:'Quatro Voltas Honestas', min:15, rounds:4, rest:'60 s entre voltas', items:[['Agachamento','10'],['Flexão inclinada','6'],['Dead bug','8 por lado'],['Polichinelo','20']]}
    ],
    [
      {t:'Circuito do Devedor', min:17, rounds:4, rest:'60 s entre voltas', items:[['Flexão','12'],['Agachamento','20'],['Remada australiana (ou superman)','10'],['Prancha','40 s']]},
      {t:'Ombro e Centro', min:17, rounds:4, rest:'75 s entre voltas', items:[['Flexão fechada','8'],['Afundo','10 por perna'],['Hollow hold','25 s'],['Pike push-up','6']]},
      {t:'Cinco Voltas', min:18, rounds:5, rest:'60 s entre voltas', items:[['Barra fixa (ou remada australiana 10)','4'],['Flexão','10'],['Agachamento com salto','10'],['Prancha','30 s']]}
    ],
    [
      {t:'Circuito do Reincidente', min:19, rounds:5, rest:'75 s entre voltas', items:[['Barra fixa','6'],['Flexão','15'],['Agachamento búlgaro','8 por perna'],['Hollow hold','35 s']]},
      {t:'Empurra e Puxa', min:20, rounds:5, rest:'90 s entre voltas', items:[['Paralelas (ou banco firme)','8'],['Barra supinada','5'],['Pistol assistido','5 por perna'],['L-sit ou tuck','15 s']]},
      {t:'Controle', min:18, rounds:4, rest:'90 s entre voltas', items:[['Flexão arqueiro','6 por lado'],['Barra fixa','6'],['Afundo com salto','8 por perna'],['Prancha','60 s']]}
    ]
  ],
  WARM:['1 minuto de polichinelo leve','10 círculos de ombro para cada lado','10 agachamentos lentos','Punhos e tornozelos: 20 s cada'],
  SAFE:'Adapte ao seu nível e use a versão mais fácil sempre que precisar. Dor aguda, tontura ou falta de ar fora do normal: pare. Prenda é disciplina, não lesão.',

  /* cenários de reserva para o Briefing */
  CENAS:[
    {w:'architect', t:'A rede caiu no feriado', c:'Sexta, 19h, feriado prolongado. O enlace que liga os dois lados do terreno de um resort caiu e metade dos módulos de hospedagem está sem Wi-Fi. Casa cheia, recepção recebendo reclamação, o dono ligando. Você tem um técnico no local e acesso remoto ao controlador.', q:'Escreva o briefing: situação em 3 linhas, opções (contorno imediato, reparo, escalar fornecedor), recomendação, risco principal e a mensagem de 4 linhas para o dono.'},
    {w:'architect', t:'A migração travou no meio', c:'Deploy de sexta à tarde. A migração de banco travou na metade em produção: a tabela de reservas está bloqueada e existem 14 reservas pendentes de confirmação. O rollback nunca foi testado nesse volume.', q:'Escreva o briefing: o que você faz nos primeiros 15 minutos, as opções (seguir em frente, rollback, restaurar backup), a recomendação com o motivo, o risco de cada uma e o que muda no processo para isso não repetir.'},
    {w:'architect', t:'A senha do admin vazou', c:'Um print com a senha do painel administrativo de um sistema de reservas apareceu num grupo de mensagens com 40 pessoas. Não se sabe há quanto tempo. O sistema tem dados pessoais de hóspedes.', q:'Escreva o briefing: contenção imediata, como descobrir o que foi acessado, quem precisa ser avisado e quando, e as três mudanças estruturais que você exige depois.'},
    {w:'founder', t:'Trinta por cento na hora de assinar', c:'Orçamento de R$ 5 mil aprovado de boca. No dia de assinar, o cliente — outro empresário, bem relacionado na cidade — pede 30% de desconto “pela parceria” e deixa no ar que tem outros projetos.', q:'Escreva o briefing: o que ele realmente está testando, suas opções (ceder, recusar, trocar desconto por escopo ou prazo), a recomendação, o que você diz na frase exata e onde fica o seu limite.'},
    {w:'founder', t:'O técnico-chave vai sair', c:'Seu melhor técnico avisa que sai em 15 dias. Três projetos em andamento dependem só dele e nada está documentado. Ele está disposto a ajudar na transição, mas com pouca paciência.', q:'Escreva o briefing: o que precisa ser extraído dele por ordem de risco, o plano dos 15 dias, o que você comunica aos três clientes e o que muda para nenhum projeto depender de uma pessoa só.'},
    {w:'founder', t:'Reescrever ou consertar', c:'Dono de pousada com um sistema legado cheio de remendos quer saber se reescreve do zero ou conserta. Você tem uma hora de conversa e nenhum acesso ao código. Ele já foi enganado por dois prestadores.', q:'Escreva o briefing: as cinco perguntas que você faz nessa hora, os sinais que apontam para cada caminho, o que você se recusa a prometer e a proposta de próximo passo pago e pequeno.'},
    {w:'navigation', t:'Oitenta mil parados', c:'A empresa tem R$ 80 mil em conta corrente. Vence imposto trimestral em 40 dias, um fornecedor em 20, e apareceu uma oportunidade de estoque com desconto para pagamento à vista em 5 dias.', q:'Escreva o briefing: o caixa separado por função e prazo, as opções, a conta que decide se o desconto do estoque vale, a recomendação e o gatilho que te faria mudar de ideia.'},
    {w:'navigation', t:'Dois e meio por cento ao mês, garantido', c:'Um conhecido oferece uma “operação estruturada” que paga 2,5% ao mês, garantido, com saque a qualquer momento. Três pessoas que você respeita já entraram. Ele precisa da resposta até sexta.', q:'Escreva o briefing: o que esse retorno exige que seja verdade, as perguntas de diligência, os sinais de alerta presentes, sua decisão e o que você responde sem queimar a relação.'},
    {w:'mind', t:'A segunda unidade', c:'Um sócio quer abrir uma segunda unidade no mês que vem. Os números são mistos: faturamento subindo, margem caindo, equipe no limite. Ele está empolgado e tem pressa.', q:'Escreva o briefing: o melhor argumento a favor (steelman), o melhor argumento contra, qual evidência decidiria a questão, sua posição e o que te faria mudar.'},
    {w:'aesthetic', t:'Cinco minutos amanhã', c:'Amanhã você tem 5 minutos para apresentar uma proposta a seis pessoas que não te conhecem. Não vai ter projetor. Uma delas é abertamente cética.', q:'Escreva o briefing: a frase única que precisa ficar, a estrutura dos 5 minutos, como você abre, como responde ao cético e o que você pede no final.'},
    {w:'ars', t:'A faixa parada em oitenta por cento', c:'Uma faixa sua está parada há três semanas em 80%. Você já ouviu tanto que não sabe mais se é boa. Existe outra ideia nova e empolgante esperando.', q:'Escreva o briefing: o que falta de verdade para fechar, as opções (terminar, cortar, arquivar), o critério que decide e o prazo que você se dá.'},
    {w:'flaneur', t:'A estatística sem fonte', c:'Um texto que você ia publicar depende de uma estatística citada em três artigos. Nenhum dos três aponta a fonte primária, e o prazo é amanhã.', q:'Escreva o briefing: como rastrear a origem em uma hora, o que fazer se ela não aparecer, como reescrever sem o número e o que isso muda na sua tese.'}
  ],
  CRIT:['Situação em poucas linhas, sem enrolação','Pelo menos duas opções reais, com o custo de cada uma','Recomendação clara com o motivo','Risco principal e como você detecta cedo','Próximo passo com responsável e prazo']
};

/* ---------- conquistas: só o que premia aparecer e pagar ---------- */
SYS.SYSACH.push(
 {id:'pz_first', n:'Primeiro Portão', d:'Primeira janela cumprida no horário.', r:'common', ic:'clock', c:function(D){ return (D.pzOk || 0) >= 1; }},
 {id:'pz_7', n:'Sete Janelas', d:'7 janelas seguidas no horário.', r:'rare', ic:'clock', title:'Pontual', c:function(D){ return (D.pzBest || 0) >= 7; }},
 {id:'pz_30', n:'Trinta Janelas', d:'30 janelas seguidas. A rotina que você dizia não ter.', r:'epic', ic:'clock', title:'Relógio do Sistema', ms:1, c:function(D){ return (D.pzBest || 0) >= 30; }},
 {id:'pz_100', n:'Cem Janelas', d:'100 janelas cumpridas no total.', r:'legendary', ic:'crown', title:'Inadiável', ms:1, c:function(D){ return (D.pzOk || 0) >= 100; }},
 {id:'pz_s', n:'Janela Rank S', d:'8 ou mais ações reais dentro de uma única janela.', r:'rare', ic:'sparkle', title:'Rank S na Janela', c:function(D){ return (D.pzS || 0) >= 1; }},
 {id:'pz_early', n:'Chegou Antes', d:'Diárias fechadas antes de o portão abrir.', r:'uncommon', ic:'check', c:function(D){ return (D.pzEarly || 0) >= 1; }},
 {id:'pz_same', n:'Dívida Zero', d:'Quitou uma prenda no mesmo dia em que ela foi sorteada.', r:'uncommon', ic:'shield', c:function(D){ return (D.pzSame || 0) >= 1; }},
 {id:'pz_paid10', n:'Bom Pagador', d:'10 prendas quitadas dentro do prazo.', r:'rare', ic:'shield', title:'Bom Pagador', c:function(D){ return (D.pzPaidOn || 0) >= 10; }},
 {id:'pz_clean', n:'Ficha Limpa', d:'30 dias armados sem pisar na Zona de Penalidade.', r:'epic', ic:'shield', title:'Ficha Limpa', ms:1, c:function(D){ return (D.pzClean || 0) >= 30; }},
 {id:'pz_back', n:'Volta por Cima', d:'Depois de uma falta, 7 janelas seguidas.', r:'rare', ic:'flame', title:'Reincidente Regenerado', c:function(D){ return (D.pzMissTot || 0) >= 1 && (D.pzSeq || 0) >= 7; }}
);

/* ---------- instalador do Windows: abre o Sistema sozinho no chamado e no veredito ----------
   Texto único usado pelo app (copiar/baixar) e pelo arquivo .ps1 entregue no chat.
   Só ASCII, para não depender da codificação do arquivo no PowerShell 5.1.            */
SYS.PZ_PS = String.raw`# System Ascension - chamado e veredito (abertura automatica no Windows)
#
# O que este script faz, e somente isto:
#   1. cria a pasta %LOCALAPPDATA%\SystemAscension com um script pequeno (abrir.js)
#   2. registra UMA tarefa agendada chamada "System Ascension", no seu usuario,
#      sem pedir privilegio de administrador
#   3. a tarefa roda no horario do chamado, no horario do veredito e quando voce
#      entra no Windows ou desbloqueia a tela
#   4. abrir.js confere a hora e abre o System Ascension no navegador, no maximo
#      uma vez por chamado e uma vez por veredito, por dia. Fora desses momentos
#      ele nao faz nada. Nao acessa a rede e nao le nada do computador alem de
#      qual e o navegador padrao. Se voce quiser, toca um som do proprio Windows.
#
# Para desfazer: rode de novo e escolha a opcao 5, ou apague a tarefa
# "System Ascension" no Agendador de Tarefas do Windows.
#
# Como rodar (qualquer um dos dois jeitos, sem administrador):
#   a) copie este texto inteiro, abra o PowerShell e rode esta linha:
#          iex (Get-Clipboard -Raw)
#      (colar o texto inteiro direto na janela tambem funciona na maioria dos
#      computadores, mas no PowerShell antigo um texto deste tamanho as vezes
#      se embaralha; a linha acima nao tem esse problema)
#   b) com o arquivo salvo como .ps1: botao direito > "Executar com o PowerShell",
#      ou, no Executar (Win+R):
#          powershell -NoProfile -ExecutionPolicy Bypass -File "C:\caminho\system-ascension-instalador.ps1"

& {
param([string]$Opcao = '')
$ErrorActionPreference = 'Stop'
$Url      = '@@URL@@'
$Ini      = '@@INI@@'
$Fim      = '@@FIM@@'
$Veredito = '@@VER@@'
$Tarefa   = 'System Ascension'
$Pasta    = Join-Path $env:LOCALAPPDATA 'SystemAscension'
$Runner   = Join-Path $Pasta 'abrir.js'
$Wscript  = Join-Path $env:SystemRoot 'System32\wscript.exe'

$RunnerCode = @'
// System Ascension - abre o Sistema no chamado e no veredito.
// Roda pelo Windows Script Host (wscript.exe), sem janela. Nao acessa a rede:
// confere a hora, anota em arquivos desta pasta e abre o navegador.
var URL = '__URL__';
var INI = __INI__, FIM = __FIM__, VER = __VER__;   // minutos desde 00:00
var CHAMADO = __CHAMADO__, JANELA = __JANELA__, SOM = __SOM__;
var sh = new ActiveXObject('WScript.Shell');
var fso = new ActiveXObject('Scripting.FileSystemObject');
var pasta = fso.GetParentFolderName(WScript.ScriptFullName);
var modo = WScript.Arguments.length > 0 ? String(WScript.Arguments(0)) : 'auto';

function dois(n) { return (n < 10 ? '0' : '') + n; }
function ymd(d) { return d.getFullYear() + '-' + dois(d.getMonth() + 1) + '-' + dois(d.getDate()); }
function hm(d) { return dois(d.getHours()) + ':' + dois(d.getMinutes()); }
function ler(nome) {
  try {
    var arq = fso.BuildPath(pasta, nome);
    if (!fso.FileExists(arq)) return '';
    var f = fso.OpenTextFile(arq, 1);
    var s = f.AtEndOfStream ? '' : f.ReadAll();
    f.Close();
    return String(s);
  } catch (e) { return ''; }
}
function gravar(nome, txt) {
  try {
    var f = fso.OpenTextFile(fso.BuildPath(pasta, nome), 2, true);
    f.Write(txt);
    f.Close();
    return true;
  } catch (e) { return false; }
}
function anotar(txt) {
  var antigo = ler('log.txt');
  if (antigo.length > 4000) antigo = antigo.substring(antigo.indexOf('\n', antigo.length - 3000) + 1);
  gravar('log.txt', antigo + txt + '\r\n');
}
// Qual abertura vale agora?
//   chamado:  dentro da janela (uma vez por dia)
//   veredito: do horario do veredito ate o proximo chamado, inclusive na manha
//             seguinte, se ainda nao abriu para aquele dia
function decidir(agora) {
  var t = agora.getHours() * 60 + agora.getMinutes();
  var hoje = ymd(agora);
  var ontem = ymd(new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 1));
  if (CHAMADO && t >= INI && t < FIM) return { tipo: 'chamado', dia: hoje };
  if (t >= VER) return { tipo: 'veredito', dia: hoje };
  if (t < (CHAMADO ? INI : VER)) return { tipo: 'veredito', dia: ontem };
  return { tipo: '', dia: hoje };
}
function navegador() {
  if (!JANELA) return '';
  try {
    var prog = String(sh.RegRead('HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\https\\UserChoice\\ProgId'));
    var nome = '';
    if (/^ChromeHTML/i.test(prog)) nome = 'chrome.exe';
    else if (/^MSEdgeHTM/i.test(prog)) nome = 'msedge.exe';
    else if (/^BraveHTML/i.test(prog)) nome = 'brave.exe';
    if (!nome) return '';
    var raizes = ['HKCU', 'HKLM'];
    for (var i = 0; i < raizes.length; i++) {
      try {
        var p = String(sh.RegRead(raizes[i] + '\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\' + nome + '\\'));
        if (p && fso.FileExists(p)) return p;
      } catch (e2) {}
    }
  } catch (e1) {}
  return '';
}
function abrir() {
  var exe = navegador();
  if (exe) {
    try { sh.Run('"' + exe + '" --app=' + URL, 1, false); return 'janela propria'; } catch (e1) {}
  }
  try { sh.Run(URL, 1, false); return 'navegador padrao'; } catch (e2) { return 'ERRO ao abrir: ' + e2.message; }
}
// Som do proprio Windows (pasta Media), tocado pelo audio do sistema. Sem som, segue em silencio.
function tocar(tipo) {
  if (!SOM) return;
  try {
    var media = sh.ExpandEnvironmentStrings('%SystemRoot%') + '\\Media\\';
    var nomes = tipo === 'veredito' ? ['Windows Notify System Generic.wav', 'notify.wav', 'chimes.wav'] : ['Alarm01.wav', 'Windows Notify Calendar.wav', 'notify.wav'];
    for (var i = 0; i < nomes.length; i++) {
      if (!fso.FileExists(media + nomes[i])) continue;
      var fluxo = new ActiveXObject('SAPI.SpFileStream');
      fluxo.Open(media + nomes[i]);
      var voz = new ActiveXObject('SAPI.SpVoice');
      voz.SpeakStream(fluxo);
      fluxo.Close();
      return;
    }
  } catch (e) {}
}

var agora = new Date();
var carimbo = ymd(agora) + ' ' + hm(agora);
if (modo === 'teste') {
  anotar(carimbo + ' teste: ' + abrir());
  tocar('chamado');
} else {
  var d = decidir(agora);
  var feito = d.tipo ? ler(d.tipo + '.txt').replace(/\s+/g, '') : '';
  if (modo === 'marcar') {
    if (d.tipo) gravar(d.tipo + '.txt', d.dia);
    gravar('ultima.txt', carimbo + ' instalado' + (d.tipo ? ' (' + d.tipo + ' de ' + d.dia + ' conta como ja aberto)' : ''));
  } else if (!d.tipo) {
    gravar('ultima.txt', carimbo + ' fora de horario: nada a abrir');
  } else if (feito === d.dia) {
    gravar('ultima.txt', carimbo + ' ' + d.tipo + ' de ' + d.dia + ' ja tinha aberto: nada a abrir');
  } else {
    gravar(d.tipo + '.txt', d.dia);
    WScript.Sleep(2500);
    var como = abrir();
    gravar('ultima.txt', carimbo + ' ' + d.tipo + ' de ' + d.dia + ': ' + como);
    anotar(carimbo + ' ' + d.tipo + ' de ' + d.dia + ': ' + como);
    tocar(d.tipo);
  }
}
'@

function Minutos([string]$hm) {
  $p = $hm.Split(':')
  return ([int]$p[0]) * 60 + ([int]$p[1])
}

function Wsh-Desativado {
  foreach ($k in 'HKCU:\Software\Microsoft\Windows Script Host\Settings', 'HKLM:\Software\Microsoft\Windows Script Host\Settings') {
    try {
      $v = (Get-ItemProperty -Path $k -Name Enabled -ErrorAction Stop).Enabled
      if ([string]$v -eq '0') { return $true }
    } catch { }
  }
  return $false
}

function Gravar-Runner([bool]$ComChamado, [bool]$JanelaPropria, [bool]$ComSom) {
  if (-not (Test-Path $Pasta)) { New-Item -ItemType Directory -Path $Pasta | Out-Null }
  $c = $RunnerCode.Replace('__URL__', $Url)
  $c = $c.Replace('__INI__', [string](Minutos $Ini)).Replace('__FIM__', [string](Minutos $Fim)).Replace('__VER__', [string](Minutos $Veredito))
  if ($ComChamado) { $c = $c.Replace('__CHAMADO__', 'true') } else { $c = $c.Replace('__CHAMADO__', 'false') }
  if ($JanelaPropria) { $c = $c.Replace('__JANELA__', 'true') } else { $c = $c.Replace('__JANELA__', 'false') }
  if ($ComSom) { $c = $c.Replace('__SOM__', 'true') } else { $c = $c.Replace('__SOM__', 'false') }
  Set-Content -Path $Runner -Value $c -Encoding ASCII
}

# A tarefa agendada roda em silencio (//B). No teste, sem o //B, um erro do script aparece na tela.
# //E:JScript escolhe o motor na mao: nao depende de como este Windows abre arquivos .js.
# Espera so o wscript terminar (com limite), nao o navegador que ele abre.
function Rodar-Runner([string]$Modo, [bool]$Silencioso = $true, [int]$Segundos = 20) {
  $a = @('//Nologo', '//E:JScript', ('"' + $Runner + '"'), $Modo)
  if ($Silencioso) { $a = @('//B') + $a }
  $p = Start-Process -FilePath $Wscript -ArgumentList $a -PassThru
  if ($p) { try { [void]$p.WaitForExit($Segundos * 1000) } catch { Start-Sleep -Seconds 3 } }
}

# Gatilho diario em hora local, sem fuso: o horario nao anda se o fuso do Windows mudar.
function Gatilho-Diario([string]$hm) {
  $g = New-ScheduledTaskTrigger -Daily -At $hm
  try { $g.StartBoundary = (Get-Date).ToString('yyyy-MM-dd') + 'T' + $hm + ':00' } catch { }
  return $g
}

# Registra a tarefa. Tenta do mais completo para o mais simples e devolve o que o Windows aceitou.
function Registrar-Tarefa([bool]$ComChamado) {
  $quem = ''
  try { $quem = [Security.Principal.WindowsIdentity]::GetCurrent().Name } catch { $quem = '' }
  if (-not $quem) { $quem = $env:USERDOMAIN + '\' + $env:USERNAME }
  $acao = New-ScheduledTaskAction -Execute $Wscript -Argument ('//B //Nologo //E:JScript "' + $Runner + '"')
  # Queue: dois gatilhos quase juntos (desbloqueou as 17:19:58, chamado as 17:20) rodam um depois do outro, nenhum se perde.
  # Priority 4: prioridade normal. O padrao do Agendador (7) deixaria o navegador aberto por ele lento.
  $ajustes = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances Queue -Priority 4 -ExecutionTimeLimit (New-TimeSpan -Minutes 2)
  $desc = 'Abre o System Ascension na hora do chamado e do veredito.'
  $diarios = @()
  if ($ComChamado) { $diarios += Gatilho-Diario $Ini }
  $diarios += Gatilho-Diario $Veredito
  $entrar = $null
  try { $entrar = New-ScheduledTaskTrigger -AtLogOn -User $quem } catch { $entrar = $null }
  $destravar = $null
  try {
    $classe = Get-CimClass -Namespace 'Root/Microsoft/Windows/TaskScheduler' -ClassName 'MSFT_TaskSessionStateChangeTrigger'
    $destravar = New-CimInstance -CimClass $classe -Property @{ StateChange = 8; UserId = $quem; Enabled = $true } -ClientOnly
  } catch { $destravar = $null }
  $planos = @()
  if ($entrar -and $destravar) { $planos += @{ Nome = 'completo'; Gat = @($diarios + $entrar + $destravar) } }
  if ($destravar) { $planos += @{ Nome = 'desbloqueio'; Gat = @($diarios + $destravar) } }
  if ($entrar) { $planos += @{ Nome = 'entrada'; Gat = @($diarios + $entrar) } }
  $planos += @{ Nome = 'horarios'; Gat = @($diarios) }
  $feito = ''
  $erro = ''
  foreach ($comUsuario in $true, $false) {
    foreach ($pl in $planos) {
      if ($feito) { break }
      try {
        if ($comUsuario) {
          $principal = New-ScheduledTaskPrincipal -UserId $quem -LogonType Interactive -RunLevel Limited
          Register-ScheduledTask -TaskName $Tarefa -Action $acao -Trigger $pl.Gat -Settings $ajustes -Principal $principal -Description $desc -Force -ErrorAction Stop | Out-Null
        } else {
          Register-ScheduledTask -TaskName $Tarefa -Action $acao -Trigger $pl.Gat -Settings $ajustes -Description $desc -Force -ErrorAction Stop | Out-Null
        }
        $feito = $pl.Nome
      } catch { $erro = $_.Exception.Message }
    }
  }
  if (-not $feito) { throw ('o Windows recusou a tarefa agendada: ' + $erro) }
  return $feito
}

function Instalar([bool]$ComChamado) {
  if (-not (Test-Path $Wscript)) { throw 'wscript.exe nao foi encontrado neste Windows.' }
  if (Wsh-Desativado) { throw 'o Windows Script Host esta desativado neste Windows (Enabled=0 no registro). A abertura automatica usa o wscript.exe para rodar sem piscar janela. Reative o WSH, ou peca a versao em PowerShell puro.' }
  $resp = Read-Host '  Abrir como janela propria do Sistema (Chrome, Edge ou Brave)? [S/n]'
  $janela = -not ($resp -match '^[nN]')
  $resp = Read-Host '  Tocar um som do Windows quando abrir? [S/n]'
  $som = -not ($resp -match '^[nN]')
  Gravar-Runner $ComChamado $janela $som
  $modo = [string](@(Registrar-Tarefa $ComChamado) | Select-Object -Last 1)
  $ult = Join-Path $Pasta 'ultima.txt'
  if (Test-Path $ult) { Remove-Item $ult -Force }
  Rodar-Runner 'marcar'
  $marca = ''
  if (Test-Path $ult) { $marca = [string](Get-Content $ult -Raw) }
  Write-Host ''
  if (-not ($marca -match 'instalado')) {
    Write-Host '  ATENCAO: a tarefa foi criada, mas o script de abertura (abrir.js) nao rodou neste Windows.'
    Write-Host '  Sem ele nada abre. Causa comum: Windows Script Host bloqueado por politica ou pelo antivirus.'
    Write-Host '  Rode a opcao 3: sem o modo silencioso, o erro aparece na tela.'
    Write-Host ''
  }
  Write-Host '  Instalado.'
  if ($ComChamado) { Write-Host ('  - ' + $Ini + ': o Sistema abre sozinho com o chamado (janela ate ' + $Fim + ').') }
  Write-Host ('  - ' + $Veredito + ': o Sistema abre sozinho com o veredito.')
  if ($modo -eq 'completo' -or $modo -eq 'desbloqueio') {
    Write-Host '  - Notebook fechado na hora? Abre assim que voce desbloquear a tela.'
  } elseif ($modo -eq 'entrada') {
    Write-Host '  - Notebook desligado na hora? Abre quando voce entrar no Windows.'
    Write-Host '    (O Windows nao aceitou o gatilho de desbloqueio: voltando do sono, pode levar ate uns 10 minutos.)'
  } else {
    Write-Host '  - Notebook fechado na hora? O Windows roda a tarefa perdida alguns minutos depois de ligar (ate uns 10).'
    Write-Host '    (Ele nao aceitou os gatilhos de entrada e de desbloqueio sem administrador.)'
  }
  Write-Host '  - Tela bloqueada na hora (notebook ligado)? A janela abre por tras do bloqueio e esta la quando voce voltar.'
  Write-Host '  - No maximo uma abertura por chamado e uma por veredito, por dia.'
  Write-Host '  - O veredito de um dia vale ate o chamado do dia seguinte.'
  if ($marca -match '\((\w+) de ([\d-]+) conta como ja aberto\)') {
    Write-Host ('  - A abertura que valeria agora (' + $Matches[1] + ' de ' + $Matches[2] + ') conta como feita: a primeira automatica e a proxima.')
  }
  Write-Host ''
  $t = Read-Host '  Testar agora? [S/n]'
  if (-not ($t -match '^[nN]')) { Testar }
}

function Testar {
  if (-not (Test-Path $Runner)) { Write-Host '  Ainda nao instalado. Use a opcao 1 ou 2 primeiro.'; return }
  $log = Join-Path $Pasta 'log.txt'
  $antes = [long]0
  if (Test-Path $log) { $antes = (Get-Item $log).LastWriteTimeUtc.Ticks }
  Rodar-Runner 'teste' $false 30
  $depois = [long]0
  $linhas = @()
  if (Test-Path $log) { $depois = (Get-Item $log).LastWriteTimeUtc.Ticks; $linhas = @(Get-Content $log) }
  if ($depois -gt $antes -and $linhas.Count -gt 0 -and ($linhas[$linhas.Count - 1] -match 'teste')) {
    Write-Host ('  Registro do teste: ' + $linhas[$linhas.Count - 1])
    Write-Host '  O Sistema deve ter aberto no navegador. Se abriu a tela de login, entre no Claude nesse navegador uma vez.'
  } else {
    Write-Host '  O script de abertura nao chegou a rodar. Se apareceu uma janela de erro do Windows Script Host,'
    Write-Host '  anote a linha e a mensagem: e por ali que se conserta.'
  }
}

function Data-Curta($d) {
  if ($null -eq $d) { return '(nenhuma)' }
  try { return ([datetime]$d).ToString('dd/MM/yyyy HH:mm') } catch { return [string]$d }
}

function Situacao {
  try {
    $t = Get-ScheduledTask -TaskName $Tarefa -ErrorAction Stop
    $i = Get-ScheduledTaskInfo -TaskName $Tarefa -ErrorAction Stop
    Write-Host ('  Tarefa: ' + $t.State + '  |  gatilhos: ' + @($t.Triggers).Count)
    if ([string]$i.LastTaskResult -eq '267011') { Write-Host '  Ultima execucao:  ainda nao rodou' }
    else { Write-Host ('  Ultima execucao:  ' + (Data-Curta $i.LastRunTime) + '  (resultado ' + $i.LastTaskResult + ')') }
    Write-Host ('  Proxima execucao: ' + (Data-Curta $i.NextRunTime))
  } catch { Write-Host '  Tarefa nao instalada.' }
  foreach ($n in 'ultima.txt', 'log.txt') {
    $a = Join-Path $Pasta $n
    if (Test-Path $a) {
      Write-Host ('  --- ' + $n)
      Get-Content $a -Tail 8 | ForEach-Object { Write-Host ('  ' + $_) }
    }
  }
}

function Remover {
  try { Unregister-ScheduledTask -TaskName $Tarefa -Confirm:$false -ErrorAction Stop; Write-Host '  Tarefa removida.' }
  catch { Write-Host '  Nenhuma tarefa para remover.' }
  if (Test-Path $Pasta) { Remove-Item $Pasta -Recurse -Force; Write-Host '  Pasta removida.' }
}

try {
  Write-Host ''
  Write-Host '  SYSTEM ASCENSION - chamado e veredito'
  Write-Host ('  janela ' + $Ini + ' a ' + $Fim + '  |  veredito ' + $Veredito)
  Write-Host ''
  Write-Host ('  [1] Instalar: chamado (' + $Ini + ') e veredito (' + $Veredito + ')')
  Write-Host ('  [2] Instalar: so o veredito (' + $Veredito + ')')
  Write-Host '  [3] Testar agora (abre o Sistema)'
  Write-Host '  [4] Ver a situacao (tarefa e ultimos registros)'
  Write-Host '  [5] Remover tudo'
  Write-Host ''
  if (-not $Opcao) { $Opcao = Read-Host '  Opcao' }
  switch ($Opcao.Trim()) {
    '1' { Instalar $true }
    '2' { Instalar $false }
    '3' { Testar }
    '4' { Situacao }
    '5' { Remover }
    default { Write-Host '  Nada feito.' }
  }
} catch {
  Write-Host ''
  Write-Host ('  ERRO: ' + $_.Exception.Message)
}
Write-Host ''
[void](Read-Host '  Enter para terminar')
} @args
`;
SYS.pzScript = function(o){
  o = o || {};
  var ok = function(s, d){ return /^\d{2}:\d{2}$/.test(String(s || '')) ? s : d; };
  return SYS.PZ_PS.replace(/@@URL@@/g, o.url || SYS.SELF_URL).replace(/@@INI@@/g, ok(o.ini, '17:20')).replace(/@@FIM@@/g, ok(o.fim, '18:30')).replace(/@@VER@@/g, ok(o.ver, '19:30')).replace(/\r?\n/g, '\r\n');
};
