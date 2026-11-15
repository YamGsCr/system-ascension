/* ===== v21 · SGM-Opus · dados =====
   Fonte: doc "SGM-Opus · Arsenal de Recursos" (aba principal: eras, software, hardware, dica e Shadow Levels de cada
   projeto; aba Compras: os 25 itens; aba Handoff: Way de cada projeto e as regras). Gerado a partir do doc em 15/11/2026.
   Marco de era: onde o doc dá o marco (coluna Marco do Artifex, condições da aba Compras), ele vem aqui; nas outras
   eras o marco está na v0.1 e a pessoa escreve na tela antes de concluir a era (S.opus.p[id].marco[n]).
   Projeto Way: 'ways' recebe o XP do marco de era (dividido quando há dois, como no Scrinium); 'br' é a vertente.
   Mythos foi para o Flâneur (decisão da migração v21: o worldbuilding mora no Flâneur). */
(function(){
  var O = SYS.OPUS = {};
  O.FAMILIAS = ['Infraestrutura','Assistência','Conhecimento e criação','Vida e exploração','Inteligência financeira','Projetos externos','Engenharia e fabricação'];
  O.P = [
 {
  "id": "umbra",
  "n": "Umbra",
  "fam": "Infraestrutura",
  "ways": [
   "architect"
  ],
  "nota": "MikroTik e Omada aparecem por um motivo prático: são o que provedores e empresas do interior usam, então o aprendizado vale também para trabalhos como o do resort.",
  "eras": [
   {
    "n": 1,
    "nome": "Limen",
    "sw": "OPNsense (ou pfSense CE) como firewall; RouterOS se for MikroTik",
    "hw": "Mini-PC \"firewall box\" com 2-4 portas Intel ou MikroTik hEX (baixo)",
    "dica": "OPNsense ensina mais conceitos; RouterOS é mais útil comercialmente no Brasil",
    "marco": "Rede do Garden separada da casa"
   },
   {
    "n": 2,
    "nome": "Dominium",
    "sw": "VLANs no firewall; Omada Controller ou UniFi Network",
    "hw": "Switch gerenciável 8 portas com 802.1Q, ex. TP-Link SG108E ou SG2008 (baixo); AP Omada EAP (médio)",
    "dica": "Separar no mínimo: casa, Garden, IoT (Hestia) e convidados",
    "marco": "VLANs casa, Garden, IoT e convidados"
   },
   {
    "n": 3,
    "nome": "Inter Nexus",
    "sw": "Proxmox VE; Docker + Compose; Tailscale ou WireGuard para acesso remoto; Caddy como proxy reverso; AdGuard Home como DNS",
    "hw": "Mini-PC corporativo usado (Lenovo Tiny, Dell Micro, HP Mini) com 16-32 GB (baixo)",
    "dica": "Tailscale evita abrir portas no roteador; corporativo usado é o melhor custo-benefício"
   },
   {
    "n": 4,
    "nome": "Bastion",
    "sw": "NUT (Network UPS Tools) para desligamento controlado; configs exportadas para um repositório Git",
    "hw": "Nobreak senoidal com porta USB, dimensionado pela carga (médio)",
    "dica": "Fontes com PFC ativo pedem nobreak senoidal",
    "marco": "Desligamento controlado pelo nobreak e configs no Git"
   }
  ],
  "shadow": [
   {
    "nome": "Architectum",
    "premium": "Host 32-64 GB com Terraform, Ansible e templates cloud-init no Proxmox",
    "ensina": "Infraestrutura como código",
    "custo": "Médio"
   },
   {
    "nome": "Velocitas",
    "premium": "Switch 2,5 GbE ou 10 GbE SFP+ (ex. MikroTik CRS305)",
    "ensina": "Gargalos, medição com iperf3",
    "custo": "Médio"
   },
   {
    "nome": "Duplex",
    "premium": "Dual-WAN com failover: segundo provedor ou modem 4G/5G; Starlink como topo premium",
    "ensina": "Failover, balanceamento, SD-WAN básico",
    "custo": "Médio a alto"
   },
   {
    "nome": "Armarium",
    "premium": "Rack de parede 12U, patch panel, cabeamento Cat6 crimpado e etiquetado",
    "ensina": "Cabeamento estruturado",
    "custo": "Médio"
   },
   {
    "nome": "Unificata",
    "premium": "Ecossistema UniFi completo (Cloud Gateway, APs Wi-Fi 7, switch PoE)",
    "ensina": "Rede gerenciada de padrão comercial",
    "custo": "Alto"
   },
   {
    "nome": "Legio",
    "premium": "Cluster de 3 nós Proxmox com Ceph e alta disponibilidade",
    "ensina": "Sistemas distribuídos, quorum",
    "custo": "Alto"
   }
  ]
 },
 {
  "id": "arca",
  "n": "Arca",
  "fam": "Infraestrutura",
  "ways": [
   "architect"
  ],
  "nota": "O ThinkPad parece usar Windows, então as eras 01-02 usam ferramentas que rodam nele.",
  "eras": [
   {
    "n": 1,
    "nome": "Repositorium",
    "sw": "WizTree (tamanho), dupeGuru (duplicatas), Everything (busca instantânea)",
    "hw": "Existente",
    "dica": "Marcar no inventário o que é insubstituível",
    "marco": "Inventário feito, com o insubstituível marcado"
   },
   {
    "n": 2,
    "nome": "Memoria",
    "sw": "Kopia ou Restic (backup versionado e criptografado); Veeam Agent Free (imagem do Windows)",
    "hw": "HD externo 2 TB (baixo)",
    "dica": "Sincronizar não é backup: Syncthing replica também o que você apagou"
   },
   {
    "n": 3,
    "nome": "Concordia",
    "sw": "TrueNAS Community (ZFS) ou Synology DSM; Immich para fotos; Nextcloud se precisar de nuvem própria",
    "hw": "Synology de 2 baías (médio) ou NAS montado; discos de linha NAS (WD Red Plus, IronWolf)",
    "dica": "Espelho de 2 discos entrega a capacidade de 1"
   },
   {
    "n": 4,
    "nome": "Perennitas",
    "sw": "Rclone para Backblaze B2 ou Hetzner Storage Box",
    "hw": "HD na Infomax como cópia física em outro local (baixo)",
    "dica": "A loja é um offsite gratuito; o criptografado vai para a nuvem"
   }
  ],
  "shadow": [
   {
    "nome": "Archivum Aeternum",
    "premium": "Scrub ZFS agendado, hashes (hashdeep), PDF/A, regra 3-2-1-1-0",
    "ensina": "Preservação digital",
    "custo": "Baixo"
   },
   {
    "nome": "Gemina",
    "premium": "Segundo NAS na Infomax com replicação (ZFS send ou Hyper Backup)",
    "ensina": "Replicação e recuperação remota",
    "custo": "Médio"
   },
   {
    "nome": "Thesaurus",
    "premium": "NAS de 4 baías com 10 GbE e cache NVMe",
    "ensina": "Storage de desempenho",
    "custo": "Alto"
   },
   {
    "nome": "Saeculum",
    "premium": "Gravador e discos M-DISC para arquivo frio de longa duração",
    "ensina": "Mídia de arquivo offline",
    "custo": "Baixo"
   }
  ]
 },
 {
  "id": "custos",
  "n": "Custos",
  "fam": "Infraestrutura",
  "ways": [
   "architect"
  ],
  "nota": "O cofre de senhas não deve depender do homelab que ele protege: se o Umbra cair, as senhas precisam continuar acessíveis.",
  "eras": [
   {
    "n": 1,
    "nome": "Vigilia",
    "sw": "Bitwarden; Aegis ou Ente Auth para 2FA; códigos de recuperação impressos",
    "hw": "Nenhum",
    "dica": "Vaultwarden self-hosted só depois do Probatio"
   },
   {
    "n": 2,
    "nome": "Tutela",
    "sw": "Uptime Kuma (serviços), Healthchecks.io (backups que não rodaram), Beszel ou Netdata (métricas), Scrutiny (saúde dos discos)",
    "hw": "Host compartilhado",
    "dica": "Alertas saem pelo ntfy do Nuntius"
   },
   {
    "n": 3,
    "nome": "Probatio",
    "sw": "Proxmox Backup Server; VM descartável para restauração",
    "hw": "Espaço no host ou na Arca",
    "dica": "Restauração não testada é backup imaginário"
   },
   {
    "n": 4,
    "nome": "Sentinella",
    "sw": "CrowdSec (bloqueio automático), Grafana + Loki + Prometheus (logs e métricas)",
    "hw": "Host compartilhado",
    "dica": "Toda rotina automática tem botão de desligar manual"
   }
  ],
  "shadow": [
   {
    "nome": "Clavis Ferrea",
    "premium": "Duas YubiKey 5 NFC (principal e reserva)",
    "ensina": "Autenticação por hardware, FIDO2",
    "custo": "Médio"
   },
   {
    "nome": "Exercitium",
    "premium": "Roteiro de falhas simuladas e \"dia de desastre\" trimestral",
    "ensina": "Resposta a incidentes",
    "custo": "Grátis"
   },
   {
    "nome": "Oculus Noctis",
    "premium": "Câmeras PoE + Frigate NVR com detecção por IA (Coral TPU ou GPU), integrado ao Hestia",
    "ensina": "Visão computacional, PoE",
    "custo": "Alto"
   },
   {
    "nome": "Arx",
    "premium": "Wazuh (SIEM) e um honeypot OpenCanary na rede",
    "ensina": "Segurança defensiva (blue team)",
    "custo": "Baixo"
   }
  ]
 },
 {
  "id": "nodus",
  "n": "Nodus",
  "fam": "Assistência",
  "ways": [
   "architect"
  ],
  "nota": "O Nodus é orquestração, não força bruta: ele roda bem num mini-PC chamando modelos por API. A IA local fica separada no Shadow Level, numa máquina que aceite GPU.",
  "eras": [
   {
    "n": 1,
    "nome": "Dialogus",
    "sw": "Claude (Projects) como interface; tarefas em Markdown versionado no Git, ou Vikunja self-hosted",
    "hw": "ThinkPad",
    "dica": "Formato aberto agora poupa migração depois"
   },
   {
    "n": 2,
    "nome": "Consilium",
    "sw": "Google Calendar ou CalDAV (Radicale); API da Claude; MCP (Model Context Protocol) para expor agenda e tarefas ao modelo",
    "hw": "ThinkPad",
    "dica": "Toda saída é rascunho até você aprovar"
   },
   {
    "n": 3,
    "nome": "Conductor",
    "sw": "n8n self-hosted (ou Node-RED); systemd timers; chave de idempotência por execução",
    "hw": "Mini-PC 16-32 GB (baixo a médio)",
    "dica": "O ID de execução evita ações duplicadas em novas tentativas"
   },
   {
    "n": 4,
    "nome": "Dignus Vindice",
    "sw": "PostgreSQL + pgvector (objetivos e memória); Langfuse para avaliar respostas e custo",
    "hw": "Host compartilhado",
    "dica": "Revisão semanal compara plano e resultado",
    "marco": "Dignus Vindice com Langfuse medindo custo por tarefa"
   }
  ],
  "shadow": [
   {
    "nome": "Mens Localis",
    "premium": "Ollama ou llama.cpp; GPU RTX 3060 12 GB usada (médio) ou RTX 5060 Ti 16 GB; topo: RTX 3090 24 GB usada ou Mac com memória unificada",
    "ensina": "Inferência local, quantização, benchmark",
    "custo": "Médio a alto"
   },
   {
    "nome": "Manus",
    "premium": "Ferramentas de ação via servidores MCP próprios, com modo de teste e log",
    "ensina": "Agentes com ferramentas",
    "custo": "Grátis"
   },
   {
    "nome": "Codex Umbrae",
    "premium": "Agentes de código (Claude Code, Codex) trabalhando nos repositórios do Garden com CI e revisão",
    "ensina": "Engenharia com agentes",
    "custo": "Alto (assinatura)"
   }
  ]
 },
 {
  "id": "spectrum",
  "n": "Spectrum",
  "fam": "Assistência",
  "ways": [
   "architect"
  ],
  "nota": "Como você já domina C#, Blazor é o caminho natural para o Spectrum: a mesma linguagem do Scrinium e dos projetos da Infomax.",
  "eras": [
   {
    "n": 1,
    "nome": "Speculum",
    "sw": "Página Blazor ou HTML local; Homepage (gethomepage.dev) para atalhos dos serviços",
    "hw": "ThinkPad",
    "dica": "Começar com \"hoje\", \"semana\" e \"XP do Ascension\""
   },
   {
    "n": 2,
    "nome": "Panorama",
    "sw": "API agregadora própria; Grafana para métricas técnicas",
    "hw": "Host compartilhado",
    "dica": "Todo dado mostra origem e hora da última atualização"
   },
   {
    "n": 3,
    "nome": "Horizon",
    "sw": "MudBlazor ou FullCalendar para o editor semanal",
    "hw": "Host compartilhado",
    "dica": "Arrastar um bloco no calendário gera uma proposta para o Nodus",
    "marco": "Painel Horizon pronto no navegador"
   },
   {
    "n": 4,
    "nome": "Confluens",
    "sw": "Fully Kiosk Browser (modo quiosque)",
    "hw": "Tablet Android de 10-11 polegadas em suporte de parede (médio)",
    "dica": "Tablet sai mais barato que monitor mais computador"
   }
  ],
  "shadow": [
   {
    "nome": "Oculus",
    "premium": "Tela compacta: ESP32 com display (\"Cheap Yellow Display\") ou tela touch de Raspberry Pi",
    "ensina": "Firmware, displays",
    "custo": "Baixo"
   },
   {
    "nome": "Charta",
    "premium": "E-ink: TRMNL pronto, ou Waveshare 7,5\" + ESP32 montado",
    "ensina": "Telas de baixo consumo",
    "custo": "Baixo a médio"
   },
   {
    "nome": "Tabula Tactilis",
    "premium": "Elgato Stream Deck como painel físico (iniciar foco, registrar treino, disparar rotinas do Nodus)",
    "ensina": "Interfaces físicas, macros",
    "custo": "Médio"
   },
   {
    "nome": "Lumen",
    "premium": "Fita LED com WLED que muda de cor pelo estado do Garden (ok, alerta, foco)",
    "ensina": "ESP32, sinalização ambiente",
    "custo": "Baixo"
   },
   {
    "nome": "Speculum Magnum",
    "premium": "TV ou monitor grande na parede com painel e modo arte do Aesthesis quando ocioso",
    "ensina": "Sinalização digital",
    "custo": "Alto"
   }
  ]
 },
 {
  "id": "nuntius",
  "n": "Nuntius",
  "fam": "Assistência",
  "ways": [
   "architect"
  ],
  "eras": [
   {
    "n": 1,
    "nome": "Vox",
    "sw": "Notificações nativas do Windows (toast via .NET); histórico em SQLite",
    "hw": "ThinkPad",
    "dica": "Cada aviso carrega projeto de origem e link"
   },
   {
    "n": 2,
    "nome": "Canalis",
    "sw": "ntfy self-hosted (push gratuito) ou Gotify; Apprise para falar com dezenas de serviços; bot do Telegram",
    "hw": "Celular existente",
    "dica": "ntfy para alertas, Telegram para conversa"
   },
   {
    "n": 3,
    "nome": "Colloquium",
    "sw": "Bot do Telegram com comandos e botões inline ligados ao ID da tarefa",
    "hw": "Celular existente",
    "dica": "Responder \"feito\" no Telegram fecha a tarefa no projeto certo"
   },
   {
    "n": 4,
    "nome": "Praesentia",
    "sw": "Matrix (Conduit ou Synapse) ou servidor privado no Discord com um canal por projeto",
    "hw": "Host compartilhado",
    "dica": "Matrix é self-hosted e guarda o histórico com você"
   }
  ],
  "shadow": [
   {
    "nome": "Vox Umbrarum",
    "premium": "Base: faster-whisper (fala para texto) e Piper (voz) locais. Premium: ElevenLabs com uma voz para cada uma das Sete Sombras; microfone USB de qualidade",
    "ensina": "Pipelines de voz",
    "custo": "Médio a alto"
   },
   {
    "nome": "Satelles",
    "premium": "Home Assistant Voice ou satélites ESP32-S3 em cada cômodo",
    "ensina": "Voz distribuída, wake word",
    "custo": "Médio"
   },
   {
    "nome": "Pulsus Carpi",
    "premium": "Avisos do Garden no relógio com respostas rápidas",
    "ensina": "Notificações em wearables",
    "custo": "Baixo"
   }
  ]
 },
 {
  "id": "scrinium",
  "n": "Scrinium",
  "fam": "Conhecimento e criação",
  "ways": [
   "vitruviano",
   "architect"
  ],
  "nota": "O Scrinium é software próprio em C#, então aqui a lista é de bibliotecas, não de apps prontos. Zotero, Calibre e Obsidian entram como referência de design e fonte de importação.",
  "eras": [
   {
    "n": 1,
    "nome": "Archivum",
    "sw": ".NET com Avalonia UI (ou WPF); SQLite com FTS5 para busca; PdfPig para extrair texto; Markdig para Markdown",
    "hw": "ThinkPad",
    "dica": "Original intocado numa pasta, metadados no banco",
    "marco": "Importar um PDF, criar nota e reencontrar offline"
   },
   {
    "n": 2,
    "nome": "Marginalia",
    "sw": "PDF.js dentro de WebView2 para leitura; modelo W3C Web Annotation para âncoras",
    "hw": "ThinkPad",
    "dica": "Âncora por citação de texto sobrevive a reprocessar o PDF"
   },
   {
    "n": 3,
    "nome": "Nexus",
    "sw": "Lucene.NET (ou só FTS5); tabela de arestas para links e backlinks",
    "hw": "ThinkPad",
    "dica": "Importar biblioteca do Zotero e do Calibre",
    "marco": "Scrinium Nexus pronto, com app próprio para sincronizar"
   },
   {
    "n": 4,
    "nome": "Peregrinus",
    "sw": "Syncthing, ou sincronização própria com registro de conflitos",
    "hw": "Boox Note Air ou Tab Ultra C (Android, roda app próprio e KOReader) (médio a alto)",
    "dica": "Boox é aberto; reMarkable e Kindle Scribe são fechados para app próprio"
   },
   {
    "n": 5,
    "nome": "Clavis",
    "sw": "Authentik ou Keycloak (login único)",
    "hw": "Host compartilhado",
    "dica": "Permissão por coleção, nunca por arquivo"
   },
   {
    "n": 6,
    "nome": "Bibliotheca Magna",
    "sw": "ASP.NET Core + PostgreSQL na Arca",
    "hw": "Host compartilhado e Arca",
    "dica": "Histórico com autor em toda alteração"
   }
  ],
  "shadow": [
   {
    "nome": "Scriptorium",
    "premium": "Tablet e-ink com caneta: Boox, reMarkable Paper Pro ou Supernote",
    "ensina": "Escrita manual ligada ao acervo",
    "custo": "Alto"
   },
   {
    "nome": "Interpres",
    "premium": "Busca com IA e citação do trecho: embeddings locais (nomic-embed via Ollama) + pgvector",
    "ensina": "RAG, avaliação de referências",
    "custo": "Médio"
   },
   {
    "nome": "Digitalis",
    "premium": "Scanner duplex ScanSnap iX1600 (alto) ou scanner aéreo de livros CZUR (médio); OCRmyPDF + Tesseract",
    "ensina": "OCR, captura em lote",
    "custo": "Médio a alto"
   },
   {
    "nome": "Lectio Sonora",
    "premium": "Audiobookshelf self-hosted; artigos do acervo lidos em voz (Piper ou ElevenLabs)",
    "ensina": "TTS, consumo em áudio",
    "custo": "Médio"
   },
   {
    "nome": "Mnemosyne",
    "premium": "Destaques viram cartões no Anki via AnkiConnect",
    "ensina": "Repetição espaçada",
    "custo": "Grátis"
   }
  ]
 },
 {
  "id": "mythos",
  "n": "Mythos",
  "fam": "Conhecimento e criação",
  "ways": [
   "flaneur"
  ],
  "br": "ofi",
  "nota": "O Mythos também serve às campanhas de RPG de mesa: o mesmo cânone alimenta histórias e sessões.",
  "eras": [
   {
    "n": 1,
    "nome": "Fragmenta",
    "sw": "Obsidian com plugin Longform (grátis) ou Scrivener (pago); Git para versões",
    "hw": "ThinkPad",
    "dica": "Markdown local nunca fica preso num serviço"
   },
   {
    "n": 2,
    "nome": "Textura",
    "sw": "Obsidian Canvas; Plottr ou Campfire para quadro de cenas",
    "hw": "ThinkPad",
    "dica": "Uma nota por personagem, lugar e cena"
   },
   {
    "n": 3,
    "nome": "Chronica",
    "sw": "Aeon Timeline (pago, referência no assunto) ou plugin de timeline no Obsidian",
    "hw": "Monitor compartilhado",
    "dica": "Separar cronologia do mundo e ordem da narrativa"
   },
   {
    "n": 4,
    "nome": "Cosmogonia",
    "sw": "LegendKeeper ou World Anvil; alternativa self-hosted: Wiki.js ou BookStack",
    "hw": "Host compartilhado",
    "dica": "Links para fontes do Scrinium"
   }
  ],
  "shadow": [
   {
    "nome": "Theatrum",
    "premium": "Twine ou Ink (inkle) grátis; articy:draft como topo",
    "ensina": "Narrativa ramificada",
    "custo": "Grátis a alto"
   },
   {
    "nome": "Cartographia",
    "premium": "Azgaar (grátis), Wonderdraft ou Inkarnate; mesa digitalizadora (médio) ou com tela, tipo Wacom Cintiq (alto)",
    "ensina": "Cartografia de fantasia",
    "custo": "Médio a alto"
   },
   {
    "nome": "Tabula Ludi",
    "premium": "Foundry VTT self-hosted no Umbra, puxando cânone do Mythos para as campanhas",
    "ensina": "Hospedagem, módulos JavaScript",
    "custo": "Baixo (licença única)"
   },
   {
    "nome": "Imago Mundi",
    "premium": "ComfyUI local para concept art de personagens e lugares (usa a GPU do Mens Localis)",
    "ensina": "Geração de imagem, fluxos de difusão",
    "custo": "Médio"
   }
  ]
 },
 {
  "id": "sonus",
  "n": "Sonus",
  "fam": "Conhecimento e criação",
  "ways": [
   "vitruviano"
  ],
  "br": "har",
  "nota": "Para drum and bass, jungle e breakcore, o Ableton Live é o padrão: o Simpler fatia breaks como o Amen em segundos. Reaper é a alternativa barata.",
  "eras": [
   {
    "n": 1,
    "nome": "Pulsus",
    "sw": "Ableton Live Lite ou Reaper; Songsterr para cordas",
    "hw": "Fone fechado (Superlux HD681 baixo; ATH-M50x médio); piano digital de 88 teclas com martelo (instrumento-base de teoria e ouvido); instrumento de cordas",
    "dica": "Gravar toda ideia, mesmo de 10 segundos"
   },
   {
    "n": 2,
    "nome": "Studium",
    "sw": "Metrônomo; Guitar Pro; treino de ouvido: Functional Ear Trainer e Syntorial (síntese de ouvido)",
    "hw": "Interface de 1 entrada se for gravar (baixo)",
    "dica": "Syntorial é o atalho para o Ars Subtilior"
   },
   {
    "n": 3,
    "nome": "Compositio",
    "sw": "Ableton Live Standard ou Suite (ou Bitwig); sintetizadores grátis Vital e Surge XT; samples via Splice",
    "hw": "Interface de 2 entradas com Hi-Z: Scarlett 2i2, Audient iD4 ou MOTU M2 (médio)",
    "dica": "Faixa concluída vale mais que dez loops"
   },
   {
    "n": 4,
    "nome": "Resonantia",
    "sw": "Ableton Link, MIDI e OSC para o Aesthesis",
    "hw": "Caixas ou sistema de reprodução",
    "dica": "O TouchDesigner recebe áudio e OSC direto"
   }
  ],
  "shadow": [
   {
    "nome": "Ars Subtilior",
    "premium": "Serum 2, FabFilter, Kilohearts; controlador Launchkey 37 (médio) ou Ableton Push 3 (alto)",
    "ensina": "Sound design experimental",
    "custo": "Médio a alto"
   },
   {
    "nome": "Auditorium",
    "premium": "Monitores Yamaha HS5, Kali LP-6 ou Adam T5V; painéis acústicos de lã de rocha; Sonarworks SoundID com microfone de medição",
    "ensina": "Acústica de sala, mixagem",
    "custo": "Alto"
   },
   {
    "nome": "Sampler",
    "premium": "Roland SP-404 MKII ou Elektron Digitakt II para fatiar breaks no hardware",
    "ensina": "Fluxo sem computador, performance",
    "custo": "Alto"
   },
   {
    "nome": "Discus",
    "premium": "Controladora de DJ (ex. Pioneer DDJ-FLX4) com Rekordbox ou Traktor",
    "ensina": "Mixagem ao vivo, sets",
    "custo": "Médio"
   },
   {
    "nome": "Fidicen",
    "premium": "Plugins de amp Neural DSP ou pedaleira de modelagem para as cordas",
    "ensina": "Timbre e gravação de cordas",
    "custo": "Médio a alto"
   }
  ]
 },
 {
  "id": "aesthesis",
  "n": "Aesthesis",
  "fam": "Conhecimento e criação",
  "ways": [
   "aesthetic"
  ],
  "br": "con",
  "nota": "O \"fluvial\" tem fonte real: a ANA publica dados de telemetria hidrológica, então o rio da obra pode subir com o rio de verdade.",
  "eras": [
   {
    "n": 1,
    "nome": "Pigmentum",
    "sw": "Krita (pintura), Blender, Aseprite (pixel art); Eagle para galeria",
    "hw": "ThinkPad",
    "dica": "Toda obra com data, ferramenta e parâmetros"
   },
   {
    "n": 2,
    "nome": "Motus",
    "sw": "p5.js ou Processing; TouchDesigner (licença não comercial grátis); three.js; shaders GLSL (The Book of Shaders)",
    "hw": "ThinkPad",
    "dica": "Expor parâmetros como sliders desde o início"
   },
   {
    "n": 3,
    "nome": "Symbiosis",
    "sw": "Open-Meteo (clima, grátis e sem chave); telemetria hidrológica da ANA; sensores do Hestia via MQTT",
    "hw": "Sensor opcional",
    "dica": "Sem dado, a obra entra num estado neutro (\"neblina\")"
   },
   {
    "n": 4,
    "nome": "Mundus Vivus",
    "sw": "Estado persistente em SQLite que evolui entre sessões",
    "hw": "Mini-PC com iGPU forte (Ryzen 780M) ou a máquina com GPU; tela 24-32 polegadas",
    "dica": "O mundo continua \"vivendo\" mesmo com a tela desligada"
   }
  ],
  "shadow": [
   {
    "nome": "Ars Immersiva",
    "premium": "Projetor de curta distância; mapeamento com TouchDesigner, MadMapper ou Resolume",
    "ensina": "Projeção mapeada",
    "custo": "Alto"
   },
   {
    "nome": "Organica",
    "premium": "Simulações persistentes: boids, reação-difusão, L-systems",
    "ensina": "Vida artificial",
    "custo": "Grátis"
   },
   {
    "nome": "Quadrum",
    "premium": "Tela fosca tipo moldura (Samsung The Frame ou similar) para a obra viva parecer um quadro",
    "ensina": "Exposição, calibração",
    "custo": "Alto"
   },
   {
    "nome": "Lux Viva",
    "premium": "LEDs endereçáveis (WLED) ou painéis Nanoleaf sincronizados com Sonus e clima",
    "ensina": "Iluminação generativa",
    "custo": "Médio"
   }
  ]
 },
 {
  "id": "hestia",
  "n": "Hestia",
  "fam": "Vida e exploração",
  "ways": [
   "architect"
  ],
  "nota": "Home Assistant numa VM do Proxmox é o centro. Zigbee e Matter funcionam sem internet; dispositivos Wi-Fi baratos dependem da nuvem do fabricante.",
  "eras": [
   {
    "n": 1,
    "nome": "Scintilla",
    "sw": "Home Assistant OS em VM",
    "hw": "Coordenador Zigbee SMLIGHT SLZB-06 (via Ethernet) ou SONOFF ZBDongle-E; uma lâmpada ou sensor Zigbee (baixo)",
    "dica": "Coordenador por Ethernet evita depender de USB na VM"
   },
   {
    "n": 2,
    "nome": "Focus",
    "sw": "Zigbee2MQTT + Mosquitto",
    "hw": "Relé Sonoff ZBMINI atrás do interruptor existente (baixo)",
    "dica": "O interruptor físico continua funcionando"
   },
   {
    "n": 3,
    "nome": "Domus",
    "sw": "Automações por cômodo",
    "hw": "Presença mmWave (Aqara FP2 premium ou LD2410 montado), sensores de porta e temperatura, tomadas com medição de energia",
    "dica": "Tomada com medição manda o custo de energia para o Aerarium"
   },
   {
    "n": 4,
    "nome": "Concordia Domus",
    "sw": "App Home Assistant Companion (presença pelo celular); integração com Nodus",
    "hw": "Tablet do Spectrum como painel",
    "dica": "Rotinas sempre com comando manual de saída"
   }
  ],
  "shadow": [
   {
    "nome": "Genius Loci",
    "premium": "ESPHome + ESP32 + sensores de baixa tensão",
    "ensina": "Firmware, eletrônica",
    "custo": "Baixo"
   },
   {
    "nome": "Atmosphaera",
    "premium": "AirGradient (CO2, PM2.5) ou SCD40 e BME680 montados",
    "ensina": "Qualidade do ar",
    "custo": "Baixo a médio"
   },
   {
    "nome": "Aura",
    "premium": "Controle infravermelho do ar-condicionado (Broadlink ou ESP32 com IR)",
    "ensina": "Protocolos IR, conforto térmico",
    "custo": "Baixo"
   },
   {
    "nome": "Vis Electrica",
    "premium": "Medidor da casa inteira (Shelly Pro 3EM ou similar), instalado por eletricista",
    "ensina": "Consumo e tarifa",
    "custo": "Médio"
   }
  ]
 },
 {
  "id": "corpus",
  "n": "Corpus",
  "fam": "Vida e exploração",
  "ways": [
   "aesthetic"
  ],
  "br": "cal",
  "nota": "A trava da v0.1 era o acesso aos dados do relógio. Isso mudou: a Garmin abriu em outubro de 2026 uma API pessoal, com chave gerada no Garmin Connect sem etapa de aprovação, mas só de leitura (the5krunner, Garmin). A Polar AccessLink é gratuita e o cadastro de desenvolvedor é self-service (Open Wearables).",
  "eras": [
   {
    "n": 1,
    "nome": "Fundamentum",
    "sw": "Hevy ou Strong (exportam CSV)",
    "hw": "Barra fixa, paralelas, argolas, elásticos (baixo)",
    "dica": "Exportação em CSV desde o primeiro dia"
   },
   {
    "n": 2,
    "nome": "Disciplina",
    "sw": "Boostcamp para programas; timer de intervalos; progressões da Recommended Routine (r/bodyweightfitness)",
    "hw": "Existente",
    "dica": "Progressão por variação, não só por repetição"
   },
   {
    "n": 3,
    "nome": "Concordia Corporis",
    "sw": "Garmin Personal API ou Polar AccessLink; Health Connect no Android como hub",
    "hw": "Garmin (Forerunner, Venu) ou Polar (médio a alto)",
    "dica": "Escolher o relógio pela API, não pela tela"
   },
   {
    "n": 4,
    "nome": "Adaptatio",
    "sw": "intervals.icu (análise gratuita com API); regras próprias de carga",
    "hw": "Existente",
    "dica": "Todo ajuste mostra em qual dado se baseou",
    "marco": "Garmin integrado e Adaptatio rodando"
   }
  ],
  "shadow": [
   {
    "nome": "Agon",
    "premium": "Kinovea (análise de vídeo grátis) + suporte de celular",
    "ensina": "Biomecânica, técnica",
    "custo": "Baixo"
   },
   {
    "nome": "Disciplina Martialis",
    "premium": "Equipamento definido pela modalidade e pelo instrutor",
    "ensina": "Arte marcial",
    "custo": "Variável"
   },
   {
    "nome": "Cor",
    "premium": "Cinta peitoral Polar H10",
    "ensina": "Zonas de frequência cardíaca precisas",
    "custo": "Médio"
   },
   {
    "nome": "Somnus",
    "premium": "Oura Ring ou WHOOP para sono, HRV e recuperação",
    "ensina": "Fisiologia da recuperação",
    "custo": "Alto (assinatura)"
   },
   {
    "nome": "Gymnasium",
    "premium": "Colete com peso, argolas de madeira, rack com anilhas",
    "ensina": "Treino com carga em casa",
    "custo": "Médio a alto"
   }
  ]
 },
 {
  "id": "iter",
  "n": "Iter",
  "fam": "Vida e exploração",
  "ways": [
   "aesthetic"
  ],
  "br": "con",
  "nota": "Santa Teresa é terra do Augusto Ruschi e fica numa das regiões mais ricas em aves da Mata Atlântica. O Avium é o Shadow Level com melhor retorno por real gasto.",
  "eras": [
   {
    "n": 1,
    "nome": "Vestigium",
    "sw": "iNaturalist (identificação por foto); fotos com GPS no Immich",
    "hw": "Celular",
    "dica": "Uma saída = um registro, mesmo curto"
   },
   {
    "n": 2,
    "nome": "Itinerarium",
    "sw": "Wikiloc (comum no Brasil); OsmAnd ou Organic Maps offline",
    "hw": "Celular + powerbank 20.000 mAh (baixo)",
    "dica": "Sinal some na serra: mapa offline sempre"
   },
   {
    "n": 3,
    "nome": "Atlas",
    "sw": "Importação de GPX; mapa próprio com MapLibre ou Leaflet",
    "hw": "Host compartilhado",
    "dica": "GPX é o formato universal"
   },
   {
    "n": 4,
    "nome": "Expeditio",
    "sw": "Checklists do Nodus por tipo de saída",
    "hw": "Estação de energia portátil (médio)",
    "dica": "O Corpus ajusta o treino da semana antes de trilha longa"
   }
  ],
  "shadow": [
   {
    "nome": "Avium",
    "premium": "Binóculo 8x42; Merlin Bird ID, eBird e WikiAves",
    "ensina": "Observação de aves",
    "custo": "Médio"
   },
   {
    "nome": "Firmamentum",
    "premium": "Stellarium e Clear Outside; binóculo 10x50; telescópio inteligente: Seestar S30 Plus, lançado em 10/11/2026 por US$ 499, ou S50 Pro por US$ 999 (Astronomy, Space.com)",
    "ensina": "Astrofotografia",
    "custo": "Médio a alto"
   },
   {
    "nome": "Imago",
    "premium": "Câmera bridge superzoom para aves (médio a alto) ou mirrorless com teleobjetiva (alto); tripé",
    "ensina": "Fotografia de natureza",
    "custo": "Alto"
   },
   {
    "nome": "Via Longa",
    "premium": "Estação de energia + painel solar dobrável; mochila cargueira",
    "ensina": "Logística de travessias",
    "custo": "Alto"
   },
   {
    "nome": "Vox Silvae",
    "premium": "BirdNET-Pi: Raspberry Pi com microfone no quintal identificando aves pelo canto 24 h; alimenta Iter e Aesthesis",
    "ensina": "Bioacústica, ML embarcado",
    "custo": "Baixo a médio"
   },
   {
    "nome": "Signum Caeli",
    "premium": "Comunicador via satélite (Garmin inReach) para SOS e mensagens sem sinal",
    "ensina": "Comunicação satelital, segurança",
    "custo": "Alto (assinatura)"
   },
   {
    "nome": "Ala",
    "premium": "Drone abaixo de 250 g, com registro e regras da ANAC/DECEA; OpenDroneMap",
    "ensina": "Fotogrametria",
    "custo": "Alto"
   }
  ]
 },
 {
  "id": "aerarium",
  "n": "Aerarium",
  "fam": "Inteligência financeira",
  "ways": [
   "navigation"
  ],
  "br": "ger",
  "nota": "O Brasil tem dados públicos financeiros muito bons e gratuitos, o que deixa o \"Bloomberg pessoal\" viável sem assinatura. Para os extratos, o Meu Pluggy permite que uma pessoa física conecte os próprios bancos via Open Finance e leia os dados pela API (Pluggy).",
  "eras": [
   {
    "n": 1,
    "nome": "Tabularium",
    "sw": "Python (pandas) ou C#; DuckDB como banco analítico; importadores de OFX e CSV; Meu Pluggy para Open Finance",
    "hw": "ThinkPad",
    "dica": "Todo lançamento guarda fonte e data de importação",
    "marco": "Tabularium funcionando com dados reais"
   },
   {
    "n": 2,
    "nome": "Trivium",
    "sw": "Fiscal: separação PF e PJ, base para IRPF. Investimentos: Ghostfolio self-hosted, export da Área do Investidor da B3, cotações via brapi.dev. Observatório: API SGS do Banco Central (Selic, IPCA, câmbio), SIDRA do IBGE, dados abertos da CVM",
    "hw": "ThinkPad",
    "dica": "Os três módulos compartilham só a camada de dados",
    "marco": "Trivium funcionando com dados reais"
   },
   {
    "n": 3,
    "nome": "Perspectiva",
    "sw": "Jupyter ou Quarto para cenários; Streamlit para painéis rápidos",
    "hw": "Monitor IPS 27 polegadas QHD com ajuste de altura (médio)",
    "dica": "Premissas de cada cenário em arquivo versionado"
   },
   {
    "n": 4,
    "nome": "Observatorium",
    "sw": "Atualizadores no n8n ou cron; notícias por RSS (FreshRSS ou Miniflux) resumidas pelo Nodus",
    "hw": "Host compartilhado",
    "dica": "Dado vencido aparece marcado, nunca como atual"
   }
  ],
  "shadow": [
   {
    "nome": "Prospectus",
    "premium": "Base histórica, backtest (vectorbt), simulação de Monte Carlo",
    "ensina": "Modelagem de cenários",
    "custo": "Grátis"
   },
   {
    "nome": "Specula",
    "premium": "Segundo monitor 24-27 polegadas ou ultrawide 34, com braço articulado",
    "ensina": "Ergonomia de análise",
    "custo": "Médio a alto"
   },
   {
    "nome": "Terminalis",
    "premium": "Assinaturas de dados: TradingView, Koyfin; Economatica como topo profissional brasileiro",
    "ensina": "Ferramentas de analista",
    "custo": "Alto (assinatura)"
   },
   {
    "nome": "Tessera",
    "premium": "Painel de LED (matriz HUB75 + ESP32) na parede com Selic, IPCA, câmbio e carteira em tempo real",
    "ensina": "Firmware, visualização física",
    "custo": "Médio"
   }
  ]
 },
 {
  "id": "inceptum",
  "n": "Inceptum",
  "fam": "Projetos externos",
  "ways": [
   "founder"
  ],
  "nota": "A ficha de cada iniciativa vira um repositório (ou pasta) com README no formato da ficha e decisões registradas como ADRs (Architecture Decision Records), o mesmo hábito que um arquiteto de soluções usa com clientes.",
  "eras": [],
  "shadow": [],
  "etapas": [
   "Intentio",
   "Investigatio",
   "Structura",
   "Executio",
   "Traditio"
  ],
  "inic": [
   {
    "id": "defesa",
    "n": "Pesquisa sobre defesa",
    "ferr": "Simulação antes de hardware: ROS 2, Gazebo, PX4 em modo SITL; RTL-SDR para recepção de rádio",
    "marco": "Mapa regulatório: produtos controlados pelo Exército, ANAC/DECEA para drones, controle de exportação"
   },
   {
    "id": "fila",
    "n": "Fila da Infomax",
    "ferr": "Planilha ou formulário para cronometrar; Lei de Little e modelo M/M/c para dimensionar atendentes",
    "marco": "Uma semana medindo chegada, espera e atendimento"
   },
   {
    "id": "sites",
    "n": "Sites JUCU / Infomax",
    "ferr": "Astro ou Next.js; Cloudflare Pages ou Vercel; domínio no Registro.br",
    "marco": "Página única publicada com contato funcionando"
   },
   {
    "id": "posts",
    "n": "Criador de posts",
    "ferr": "API da Claude com modelos de marca por empresa; fila de aprovação antes de publicar",
    "marco": "Gerar uma semana de posts e medir quantos foram usados sem edição"
   }
  ],
  "camadas": [
   {
    "n": "Gestão",
    "sw": "GitHub Projects (você já usa GitHub) ou Plane self-hosted",
    "dica": "Uma coluna por era: Intentio, Investigatio, Structura, Executio, Traditio"
   },
   {
    "n": "Decisões",
    "sw": "ADRs em Markdown dentro do repositório",
    "dica": "Uma decisão, um arquivo curto, com contexto e alternativas"
   },
   {
    "n": "Referências",
    "sw": "Scrinium",
    "dica": "Materiais de pesquisa ficam no acervo, o projeto só aponta para eles"
   }
  ]
 },
 {
  "id": "artifex",
  "n": "Artifex",
  "fam": "Engenharia e fabricação",
  "ways": [
   "vitruviano"
  ],
  "br": "mat",
  "nota": "O caminho tinkerer: sair de \"monto kit\" para \"produto meu, do circuito à caixa\". O projeto-âncora é o Vigil Caeli, um radar de aves e drones. É sensoriamento puro: detecta, mede e registra, sem nenhum atuador.",
  "eras": [
   {
    "n": 1,
    "nome": "Circuitus",
    "sw": "Arduino IDE ou PlatformIO; Wokwi para simular",
    "hw": "Kit ESP32 com protoboard e sensores, multímetro, ferro de solda Pinecil (baixo)",
    "marco": "ESP32 lendo um sensor e publicando no MQTT do Garden"
   },
   {
    "n": 2,
    "nome": "Sensus",
    "sw": "ESP-IDF ou ESPHome; Python para analisar os dados",
    "hw": "Sensores I2C/SPI, microfone I2S, ESP32-CAM (baixo)",
    "marco": "Nó de sensor rodando sozinho por uma semana"
   },
   {
    "n": 3,
    "nome": "Tabula",
    "sw": "KiCad",
    "hw": "Placas fabricadas por lote na JLCPCB (baixo)",
    "marco": "Primeira PCB própria funcionando"
   },
   {
    "n": 4,
    "nome": "Forma",
    "sw": "FreeCAD ou Fusion; Bambu Studio",
    "hw": "Impressora 3D Bambu Lab linha A1 (médio) ou serviço de impressão",
    "marco": "Dispositivo com caixa própria, fechado e montado"
   },
   {
    "n": 5,
    "nome": "Unda",
    "sw": "SDR++, GNU Radio, readsb + tar1090",
    "hw": "RTL-SDR com antena 1090 MHz (baixo)",
    "marco": "Aviões reais num mapa do Spectrum, captados só recebendo sinal"
   },
   {
    "n": 6,
    "nome": "Vigil Caeli",
    "sw": "Python (numpy, scipy), YOLO ou Frigate, painel no Spectrum",
    "hw": "Módulo radar Doppler comercial de 24 GHz, câmera e microfone",
    "marco": "Detectar, classificar e registrar aves e drones sobre o quintal"
   }
  ],
  "shadow": [
   {
    "nome": "Oscilloscopium",
    "premium": "Osciloscópio digital Rigol e analisador lógico",
    "ensina": "Depuração de sinal",
    "custo": "Médio"
   },
   {
    "nome": "Retis Longa",
    "premium": "Nós LoRa com Meshtastic para sensores longe da casa",
    "ensina": "Rádio de longo alcance",
    "custo": "Baixo"
   },
   {
    "nome": "Mens Machinae",
    "premium": "Jetson Orin Nano ou Coral para IA na borda",
    "ensina": "Visão embarcada",
    "custo": "Alto"
   },
   {
    "nome": "Radar Passivus",
    "premium": "KrakenSDR (SDR coerente de 5 canais) para radar passivo com sinais de FM",
    "ensina": "Processamento de sinal, radar passivo",
    "custo": "Alto"
   },
   {
    "nome": "Unda Millimetrica",
    "premium": "Kit de avaliação de radar FMCW mmWave (linha TI IWR)",
    "ensina": "Radar FMCW, nuvem de pontos",
    "custo": "Alto"
   },
   {
    "nome": "Fabrica",
    "premium": "Impressora 3D de linha superior com multicor",
    "ensina": "Prototipagem séria",
    "custo": "Alto"
   },
   {
    "nome": "Machina",
    "premium": "Cortadora a laser ou CNC de bancada",
    "ensina": "Fabricação subtrativa",
    "custo": "Alto"
   }
  ]
 }
];
  O.MAP = {}; O.P.forEach(function(p){ O.MAP[p.id] = p; });
  O.COMPRAS = [
 {
  "n": 1,
  "tier": "I",
  "item": "MikroTik hAP ax²",
  "preco": "R$ 798",
  "brl": 798,
  "usd": null,
  "proj": "umbra",
  "era": "01 Limen",
  "cond": "Livre (já na wishlist)",
  "way": "architect",
  "auto": {
   "livre": 1
  }
 },
 {
  "n": 2,
  "tier": "I",
  "item": "Switch TP-Link TL-SG108E",
  "preco": "R$ 241,75",
  "brl": 241.75,
  "usd": null,
  "proj": "umbra",
  "era": "02 Dominium",
  "cond": "Limen concluído: rede do Garden separada da casa",
  "way": "architect",
  "auto": {
   "era": [
    "umbra",
    1
   ]
  }
 },
 {
  "n": 3,
  "tier": "I",
  "item": "WD Red Plus 4 TB e case USB de 3,5 polegadas",
  "preco": "R$ 809,90 mais o case",
  "brl": 809.9,
  "usd": null,
  "proj": "arca",
  "era": "02 Memoria",
  "cond": "Inventário do Repositorium feito, com o insubstituível marcado",
  "way": "architect",
  "auto": {
   "era": [
    "arca",
    1
   ]
  }
 },
 {
  "n": 4,
  "tier": "I",
  "item": "Kit ESP32 e multímetro Minipa ET-1000",
  "preco": "R$ 124,92 e R$ 52,44",
  "brl": 177.36,
  "usd": null,
  "proj": "artifex",
  "era": "01 Circuitus",
  "cond": "Livre (porta de entrada)",
  "way": "vitruviano",
  "auto": {
   "livre": 1
  }
 },
 {
  "n": 5,
  "tier": "I",
  "item": "Fone Superlux HD681",
  "preco": "R$ 319,85",
  "brl": 319.85,
  "usd": null,
  "proj": "sonus",
  "era": "01 Pulsus",
  "cond": "Livre, se ainda não houver fone fechado",
  "way": "vitruviano",
  "auto": {
   "livre": 1
  }
 },
 {
  "n": 6,
  "tier": "II",
  "item": "Mini-PC ThinkCentre M920q, 16 GB (usado)",
  "preco": "a partir de R$ 2.349",
  "brl": 2349,
  "usd": null,
  "proj": "umbra",
  "era": "03 Inter Nexus",
  "cond": "Dominium concluído: VLANs casa, Garden, IoT e convidados",
  "way": "architect",
  "auto": {
   "era": [
    "umbra",
    2
   ]
  }
 },
 {
  "n": 7,
  "tier": "II",
  "item": "Nobreak Ragtech NEP 1200 VA senoidal",
  "preco": "R$ 709,99",
  "brl": 709.99,
  "usd": null,
  "proj": "umbra",
  "era": "04 Bastion",
  "cond": "Host rodando 24 horas por uma semana",
  "way": "architect"
 },
 {
  "n": 8,
  "tier": "II",
  "item": "Coordenador SMLIGHT SLZB-06U, dois SNZB-02P e um SNZB-06P24",
  "preco": "cerca de 132 dólares",
  "brl": null,
  "usd": 132,
  "proj": "hestia",
  "era": "01 a 03",
  "cond": "Home Assistant em VM no host",
  "way": "architect"
 },
 {
  "n": 9,
  "tier": "II",
  "item": "Garmin Forerunner 165",
  "preco": "R$ 1.848,05",
  "brl": 1848.05,
  "usd": null,
  "proj": "corpus",
  "era": "03 Concordia Corporis, e Nuntius · Pulsus Carpi",
  "cond": "Oito semanas de treino registradas em CSV",
  "way": "aesthetic"
 },
 {
  "n": 10,
  "tier": "II",
  "item": "Monitor ASUS XG27ACS 27 polegadas QHD",
  "preco": "R$ 1.499,99",
  "brl": 1499.99,
  "usd": null,
  "proj": "aerarium",
  "era": "03 Perspectiva",
  "cond": "Tabularium e Trivium funcionando com dados reais",
  "way": "navigation",
  "auto": {
   "era": [
    "aerarium",
    2
   ]
  }
 },
 {
  "n": 11,
  "tier": "II",
  "item": "Galaxy Tab A9+",
  "preco": "R$ 999",
  "brl": 999,
  "usd": null,
  "proj": "spectrum",
  "era": "04 Confluens",
  "cond": "Painel Horizon pronto no navegador",
  "way": "architect",
  "auto": {
   "era": [
    "spectrum",
    3
   ]
  }
 },
 {
  "n": 12,
  "tier": "II",
  "item": "Piano digital Yamaha P-145 (88 teclas com martelo, USB-MIDI)",
  "preco": "cerca de R$ 2.787 (Mercado Livre) a R$ 3.141 (Magalu)",
  "brl": 2787,
  "usd": null,
  "proj": "sonus",
  "era": "01 Pulsus (instrumento-base da Harmonia)",
  "cond": "30 dias seguidos de treino de ouvido e teoria (musictheory.net e Functional Ear Trainer)",
  "way": "vitruviano",
  "auto": {
   "rotina": [
    "har",
    30
   ]
  }
 },
 {
  "n": 13,
  "tier": "II",
  "item": "Bambu Lab A1 Mini",
  "preco": "R$ 2.015,04",
  "brl": 2015.04,
  "usd": null,
  "proj": "artifex",
  "era": "04 Forma",
  "cond": "Primeira PCB própria funcionando (Tabula)",
  "way": "vitruviano",
  "auto": {
   "era": [
    "artifex",
    3
   ]
  }
 },
 {
  "n": 14,
  "tier": "II",
  "item": "RTL-SDR Blog V4 com antenas",
  "preco": "39,95 dólares",
  "brl": null,
  "usd": 39.95,
  "proj": "artifex",
  "era": "05 Unda",
  "cond": "Nó de sensor rodando sozinho por uma semana (Sensus)",
  "way": "vitruviano",
  "auto": {
   "era": [
    "artifex",
    2
   ]
  }
 },
 {
  "n": 15,
  "tier": "II",
  "item": "Binóculo Celestron Nature DX 8x42",
  "preco": "cerca de 241 dólares",
  "brl": null,
  "usd": 241,
  "proj": "iter",
  "era": "Avium",
  "cond": "Dez registros no iNaturalist (Vestigium)",
  "way": "aesthetic"
 },
 {
  "n": 16,
  "tier": "III",
  "item": "Segundo WD Red Plus 4 TB e NAS (Synology ou TrueNAS montado)",
  "preco": "R$ 809,90 mais o NAS",
  "brl": 809.9,
  "usd": null,
  "proj": "arca",
  "era": "03 Concordia",
  "cond": "Kopia rodando há um mês com restauração testada",
  "way": "architect"
 },
 {
  "n": 17,
  "tier": "III",
  "item": "Duas YubiKey 5 NFC",
  "preco": "cerca de 116 dólares",
  "brl": null,
  "usd": 116,
  "proj": "custos",
  "era": "Clavis Ferrea",
  "cond": "Bitwarden e 2FA em todas as contas críticas",
  "way": "architect"
 },
 {
  "n": 18,
  "tier": "III",
  "item": "RTX 5060 Ti 16 GB e desktop",
  "preco": "R$ 3.610 mais o desktop",
  "brl": 3610,
  "usd": null,
  "proj": "nodus",
  "era": "Mens Localis",
  "cond": "Dignus Vindice com Langfuse medindo custo por tarefa",
  "way": "architect",
  "auto": {
   "era": [
    "nodus",
    4
   ]
  }
 },
 {
  "n": 19,
  "tier": "III",
  "item": "Polar H10",
  "preco": "R$ 949",
  "brl": 949,
  "usd": null,
  "proj": "corpus",
  "era": "Cor",
  "cond": "Garmin integrado e Adaptatio rodando",
  "way": "aesthetic",
  "auto": {
   "era": [
    "corpus",
    4
   ]
  }
 },
 {
  "n": 20,
  "tier": "III",
  "item": "Seestar S30 Pro",
  "preco": "699 dólares",
  "brl": null,
  "usd": 699,
  "proj": "iter",
  "era": "Firmamentum e Speculum Diurnum",
  "cond": "Avium ativo há três meses",
  "way": "aesthetic"
 },
 {
  "n": 21,
  "tier": "III",
  "item": "Par de Yamaha HS5",
  "preco": "R$ 3.581,91",
  "brl": 3581.91,
  "usd": null,
  "proj": "sonus",
  "era": "Auditorium",
  "cond": "Cinco faixas terminadas",
  "way": "vitruviano",
  "auto": {
   "faixas": 5
  }
 },
 {
  "n": 22,
  "tier": "III",
  "item": "Rigol DHO804",
  "preco": "439 dólares",
  "brl": null,
  "usd": 439,
  "proj": "artifex",
  "era": "Oscilloscopium",
  "cond": "Tabula concluída e um bug de sinal que o multímetro não explicou",
  "way": "vitruviano"
 },
 {
  "n": 23,
  "tier": "III",
  "item": "MikroTik RB5009",
  "preco": "R$ 1.700",
  "brl": 1700,
  "usd": null,
  "proj": "umbra",
  "era": "Velocitas e Vicarius",
  "cond": "Bastion concluído, com configs no Git",
  "way": "architect",
  "auto": {
   "era": [
    "umbra",
    4
   ]
  }
 },
 {
  "n": 24,
  "tier": "III",
  "item": "Boox Note Air6 C",
  "preco": "cerca de 580 dólares",
  "brl": null,
  "usd": 580,
  "proj": "scrinium",
  "era": "04 Peregrinus e Scriptorium",
  "cond": "Scrinium Nexus pronto, com app próprio para sincronizar",
  "way": "vitruviano",
  "auto": {
   "era": [
    "scrinium",
    3
   ]
  }
 },
 {
  "n": 25,
  "tier": "III",
  "item": "Stream Deck Neo",
  "preco": "R$ 623,52",
  "brl": 623.52,
  "usd": null,
  "proj": "spectrum",
  "era": "Tabula Tactilis",
  "cond": "Rotinas do Nodus disparadas por webhook",
  "way": "architect"
 }
];
  O.TIERS = {I:'Tier I · Agora', II:'Tier II · Próximo ciclo', III:'Tier III · Shadow Levels e cofre grande'};
  O.REGRAS_COMPRA = [
    'Desbloqueio por marco. Um item só entra no carrinho quando a condição da linha estiver cumprida. Item comprado antes disso não gera XP.',
    'XP na entrega, não na compra. O XP vem do marco da era que o item habilita, registrado no Way correspondente.',
    'Preço confirmado no dia. Os valores são referência de novembro de 2026. Se o preço subir mais de 15%, compare com a alternativa da seção do projeto antes de comprar.',
    'Importados. Valores em dólares não incluem imposto de importação, ICMS nem frete. Confira a regra vigente antes de fechar o pedido.',
    'Compra compartilhada conta uma vez. O relógio do Corpus atende o Nuntius; o mini-PC do Umbra hospeda Custos, Nodus, Spectrum, Nuntius e Hestia.'
  ];
  O.XP_ERA = function(n){ return 50 + 25 * (n - 1); };
  O.XP_SHADOW = 60;
  O.XP_ETAPA = 40;
})();
