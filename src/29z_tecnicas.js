/* ===== v5 · Técnicas a investigar, trilhas de escolha e acréscimos de estudo =====
   Critério: o NOME do capítulo apita "isso tem técnica/ferramenta/software/ecossistema"?
   Então os assuntos foram conferidos; o que faltava entrou aqui. Só o nome — o "como" é pesquisa sua.
   Escolha de trilha só onde as opções NÃO se complementam (uma casa por vez). */

/* ---------- tópicos que faltavam (sempre no fim da lista) ---------- */
SYS.stAdd({
  A01:['Mapa de stakeholders: sponsor (quem banca e protege), decisor (quem assina), influenciador e usuário — poder × interesse',
       'Do sintoma à causa: dor → sintoma → problema → necessidade → valor, e as técnicas de causa raiz',
       'Modelar o as-is: visão macro primeiro (SIPOC), raias e handoffs depois (swimlane/BPMN), tempo e espera só no gargalo (VSM)',
       'Problem Brief: declaração do problema, escopo, restrições e critério de sucesso em 1 página'],
  B11:['Desenhar o processo atual antes de mexer: macro (SIPOC) → raias e handoffs (swimlane/BPMN) → tempo e espera no gargalo (VSM)']
});

/* ---------- ARQUITETO ---------- */
SYS.tech({
  A01:[['SIPOC','técnica'],['Fluxograma swimlane (raias)','notação'],['BPMN 2.0','notação'],['VSM — Mapeamento do Fluxo de Valor','técnica'],['Matriz poder × interesse (Mendelow)','técnica'],['Matriz RACI','técnica'],['5 Porquês','técnica'],['Diagrama de Ishikawa (espinha de peixe)','técnica'],['Árvore de problemas','técnica'],['Declaração do problema (problem statement)','técnica'],['Mapa de empatia','técnica'],['Project Model Canvas','método'],['BABOK Guide (IIBA)','referência'],['draw.io / diagrams.net','ferramenta'],['bpmn.io ou Camunda Modeler','ferramenta'],['Bizagi Modeler','ferramenta']],
  A02:[['INVEST (critério de boa user story)','técnica'],['User Story Mapping (Jeff Patton)','técnica'],['Example Mapping','técnica'],['Casos de uso (UML)','notação'],['Matriz de rastreabilidade de requisitos','técnica'],['Reqnroll (BDD em .NET, sucessor do SpecFlow)','ferramenta']],
  A03:[['Árvore de utilidade (utility tree)','técnica'],['QAW — Quality Attribute Workshop','método'],['ATAM — Architecture Tradeoff Analysis Method','método'],['arc42 · seção de requisitos de qualidade','referência']],
  A04:[['WSJF — Weighted Shortest Job First','técnica'],['RICE score','técnica'],['Modelo Kano','técnica'],['Matriz esforço × impacto','técnica'],['Story map fatiado em releases','técnica']],
  A05:[['Structurizr DSL (diagrama como código)','ferramenta'],['C4-PlantUML','ferramenta'],['Mermaid (C4, experimental)','ferramenta'],['draw.io com formas C4','ferramenta']],
  A06:[['Structurizr: um modelo, várias views','técnica'],['IcePanel (reconhecimento)','ferramenta']],
  A07:[['PlantUML','ferramenta'],['Mermaid (sequenceDiagram)','ferramenta'],['sequencediagram.org','ferramenta']],
  A08:[['Tabela de transição de estados','técnica'],['Stateless (biblioteca .NET de máquina de estados)','ferramenta'],['Mermaid (stateDiagram)','ferramenta']],
  A09:[['Structurizr (deployment view)','ferramenta'],['Ícones oficiais de arquitetura do Azure','notação']],
  A10:[['Template de Michael Nygard','técnica'],['MADR — Markdown ADR','técnica'],['adr-tools / Log4brains','ferramenta'],['Design doc / RFC interno (decisões maiores)','técnica']],
  A11:[['Métricas de instabilidade e abstração (Robert C. Martin)','técnica'],['Matriz de estrutura de dependências (DSM)','técnica'],['NDepend (reconhecimento)','ferramenta']],
  A12:[['SonarQube Server / SonarQube Cloud','ferramenta'],['Hotspots: churn × complexidade (Adam Tornhill)','técnica'],['CodeScene (reconhecimento)','ferramenta'],['Registro de dívida em issues com rótulo','técnica']],
  A14:[['Minimal APIs com endpoint por feature','técnica'],['Wolverine','ferramenta'],['FastEndpoints','ferramenta'],['MediatR (virou licença comercial em 2025 — confira antes de usar)','ferramenta']],
  A15:[['Repositório de referência: modular-monolith-with-ddd (Kamil Grzybek)','referência'],['Schema por módulo no banco','técnica']],
  A16:[['Saga (orquestrada × coreografada)','técnica'],['Strangler Fig','técnica'],['Aspire (orquestração local de serviços .NET)','ferramenta']],
  A18:[['DevTools do navegador (aba Network)','ferramenta'],['curl / HTTPie','ferramenta'],['Wireshark (reconhecimento)','ferramenta'],['dotnet-counters / dotnet-trace','ferramenta']],
  A21:[['dotnet user-secrets','ferramenta'],['Azure Key Vault','ferramenta'],['HashiCorp Vault / OpenBao (reconhecimento)','ferramenta']],
  A23:[['FluentValidation','ferramenta'],['Mapster ou mapeamento manual (extension methods)','ferramenta']],
  A25:[['Core Domain Chart (DDD Crew)','técnica'],['Wardley Mapping','técnica'],['EventStorming — Big Picture','técnica']],
  A26:[['Domain Storytelling','técnica'],['Glossário versionado no repositório','técnica']],
  A27:[['EventStorming — Process e Design Level','técnica'],['Domain Message Flow Modelling (DDD Crew)','técnica']],
  A28:[['Context Mapper (DSL de mapas de contexto)','ferramenta'],['Context Mapping cheat sheet (DDD Crew)','referência']],
  A30:[['Aggregate Design Canvas (DDD Crew)','técnica']],
  A32:[['xUnit (ou NUnit/MSTest — o conceito é o mesmo)','ferramenta'],['NSubstitute','ferramenta'],['Shouldly (asserções legíveis)','ferramenta'],['FsCheck (property-based)','ferramenta'],['Stryker.NET (teste de mutação)','ferramenta'],['Coverlet + ReportGenerator (cobertura)','ferramenta']],
  A33:[['Respawn (limpar o banco entre testes)','ferramenta'],['WireMock.Net (simular API externa)','ferramenta']],
  A34:[['Verify (snapshot testing)','ferramenta'],['Playwright codegen','ferramenta']],
  A35:[['AGENTS.md / CLAUDE.md (instruções do repositório)','técnica'],['Spec em Markdown com critérios de aceite','técnica'],['Claude Code / GitHub Copilot / Cursor (reconhecimento)','ferramenta']],
  A36:[['Semgrep','ferramenta'],['CodeQL','ferramenta'],['Analisadores Roslyn + dotnet format','ferramenta'],['OWASP ASVS como checklist de revisão','norma']],
  A38:[['Notação pé-de-galinha (crow’s foot)','notação'],['DBML / dbdiagram.io','ferramenta'],['DBeaver (diagrama ER de banco existente)','ferramenta']],
  A39:[['Dicionário de dados','técnica']],
  A40:[['EF Core Migrations','ferramenta'],['DbUp / Flyway (SQL versionado)','ferramenta']],
  A41:[['Reproduzir anomalias com duas sessões abertas','técnica']],
  A43:[['use-the-index-luke.com (Markus Winand)','referência']],
  A44:[['Log de SQL do EF Core / MiniProfiler','ferramenta']],
  A46:[['StackExchange.Redis','ferramenta'],['Valkey / Garnet (compatíveis com Redis — a licença do Redis mudou em 2024 e 2025, confira)','ferramenta'],['redis-cli MONITOR (só em dev)','ferramenta']],
  A47:[['Azure Cosmos DB / MongoDB (documento)','ferramenta'],['Azure Blob Storage / S3 (objeto)','ferramenta']],
  A48:[['RFC 9110 (semântica HTTP)','norma'],['curl -v / HTTPie','ferramenta']],
  A49:[['OpenAPI + Scalar ou Swagger UI','ferramenta'],['Spectral (lint de OpenAPI)','ferramenta'],['Microsoft REST API Guidelines','referência']],
  A50:[['grpcurl','ferramenta'],['Postman / Bruno (cliente de API)','ferramenta'],['SignalR','ferramenta']],
  A51:[['Standard Webhooks (especificação)','norma'],['webhook.site / smee.io (testar recebimento)','ferramenta']],
  A53:[['RabbitMQ','ferramenta'],['Azure Service Bus','ferramenta'],['Wolverine / MassTransit (MassTransit v9 é comercial — confira)','ferramenta'],['AsyncAPI (documentar eventos)','norma']],
  A56:[['Outbox pronto no Wolverine/MassTransit','ferramenta'],['Debezium (CDC — reconhecimento)','ferramenta']],
  A59:[['ASP.NET Core Identity','ferramenta'],['jwt.io (inspecionar token de teste — nunca de produção)','ferramenta']],
  A60:[['Keycloak (IdP open source)','ferramenta'],['Microsoft Entra External ID','ferramenta'],['RFC 9700 — boas práticas de segurança do OAuth 2.0','norma']],
  A61:[['OWASP Threat Dragon','ferramenta'],['Microsoft Threat Modeling Tool','ferramenta'],['Árvores de ataque','técnica'],['LINDDUN (ameaças à privacidade)','técnica'],['OWASP ASVS','norma']],
  A62:[['Azure Key Vault','ferramenta'],['gitleaks / trufflehog (segredo vazado no git)','ferramenta'],['Secret scanning do GitHub','ferramenta']],
  A63:[['RIPD — Relatório de Impacto à Proteção de Dados','técnica'],['Registro das operações de tratamento (art. 37)','técnica'],['Mapeamento de dados (data mapping)','técnica'],['Guias orientativos da ANPD','referência']],
  A64:[['Finbuckle.MultiTenant','ferramenta'],['Guia de SaaS multitenant do Azure Architecture Center','referência']],
  A67:[['Azure CLI (az)','ferramenta'],['Azure Resource Graph Explorer','ferramenta']],
  A69:[['Calculadora de sub-rede (ipcalc)','ferramenta'],['ping / traceroute (tracert) / mtr','ferramenta'],['nslookup / dig','ferramenta'],['Wireshark','ferramenta'],['Cisco Packet Tracer (simulador)','ferramenta']],
  A70:[['Azure Network Watcher (IP flow verify, next hop)','ferramenta']],
  A71:[['Árvore de decisão de compute do Azure Architecture Center','referência']],
  A72:[['Azure Storage Explorer','ferramenta'],['AzCopy','ferramenta']],
  A73:[['Azure CLI / PowerShell Az','ferramenta'],['Microsoft Graph Explorer','ferramenta']],
  A77:[['SonarQube Cloud (análise estática)','ferramenta'],['dotnet format --verify-no-changes','ferramenta']],
  A78:[['Feature flags: Azure App Configuration / OpenFeature','ferramenta'],['Métricas DORA numa planilha simples','técnica']],
  A79:[['Serilog','ferramenta'],['Seq (logs estruturados locais)','ferramenta'],['Application Insights (consultas KQL)','ferramenta']],
  A80:[['OpenTelemetry .NET','ferramenta'],['Grafana + Prometheus','ferramenta'],['Jaeger / Tempo (traces)','ferramenta'],['Aspire Dashboard (OpenTelemetry local)','ferramenta']],
  A81:[['Alertas de burn rate (multijanela)','técnica'],['OpenSLO (especificação)','norma'],['Google SRE Workbook — capítulo de SLOs','referência']],
  A82:[['Point-in-time restore (PITR)','técnica'],['pg_dump / pg_restore ou BACKUP/RESTORE do SQL Server','ferramenta'],['Azure Backup','ferramenta'],['restic','ferramenta']],
  A83:[['Matriz de severidade (SEV1–SEV4)','técnica'],['Template de postmortem (Google SRE)','técnica'],['5 Porquês','técnica'],['Diagrama de Ishikawa','técnica'],['Status page (Uptime Kuma, Upptime)','ferramenta']],
  A84:[['Polly v8 / Microsoft.Extensions.Http.Resilience','ferramenta'],['Estratégias de caos do Polly (ex-Simmy)','ferramenta'],['Toxiproxy (rede ruim de propósito)','ferramenta']],
  A85:[['Roteiro de game day','técnica'],['Azure Chaos Studio','ferramenta']],
  A86:[['k6','ferramenta'],['NBomber (.NET)','ferramenta'],['JMeter / Locust (reconhecimento)','ferramenta'],['Método RED (Rate, Errors, Duration)','técnica']],
  A87:[['Azure Pricing Calculator','ferramenta'],['Azure Cost Management + Advisor','ferramenta'],['Infracost (custo no pull request)','ferramenta'],['FinOps Framework (FinOps Foundation)','referência']],
  A88:[['Showback / chargeback','técnica'],['FOCUS (especificação aberta de dados de custo)','norma'],['Planilha de unit economics por plano','técnica']],
  A89:[['ADM — Architecture Development Method','método'],['ArchiMate','notação'],['Archi (modelador ArchiMate gratuito)','ferramenta'],['Mapa de capacidades de negócio','técnica']],
  A90:[['Build Your Own Radar (Thoughtworks)','ferramenta'],['Comitê de arquitetura / RFC interno','técnica']],
  A91:[['Modelo TIME (Tolerar, Investir, Migrar, Eliminar)','técnica'],['Wardley Mapping','técnica'],['Structurizr (system landscape)','ferramenta'],['LeanIX (EA corporativo — reconhecimento)','ferramenta']],
  A92:[['Azure Well-Architected Review (assessment)','ferramenta'],['Azure Advisor','ferramenta']],
  A93:[['Practice assessment do Microsoft Learn','ferramenta'],['Arquiteturas de referência do Azure Architecture Center','referência']],
  S01:[['Microsoft.Extensions.AI','ferramenta'],['Semantic Kernel','ferramenta'],['Ollama (modelo local)','ferramenta'],['Contador de tokens do provedor','ferramenta']],
  S02:[['BM25 (busca por palavra-chave)','técnica'],['RRF — Reciprocal Rank Fusion','técnica'],['Azure AI Search','ferramenta'],['Qdrant (reconhecimento)','ferramenta']],
  S03:[['SDK oficial do MCP para C#','ferramenta'],['MCP Inspector','ferramenta'],['Claude Agent SDK / Semantic Kernel Agents (reconhecimento)','ferramenta']],
  S04:[['promptfoo','ferramenta'],['Ragas','ferramenta'],['DeepEval','ferramenta']],
  N01:[['Cisco Packet Tracer / GNS3 (laboratório simulado)','ferramenta'],['Wireshark','ferramenta'],['nmap -sn / Advanced IP Scanner (inventário da sua rede)','ferramenta']],
  N02:[['Padrão T568A / T568B','norma'],['ABNT NBR 14565 (cabeamento estruturado)','norma'],['ABNT NBR 5410 (instalações elétricas de baixa tensão)','norma'],['Testador de cabo / certificador (reconhecimento)','ferramenta'],['Calculadora de orçamento PoE','ferramenta']],
  N03:[['Site survey com mapa de calor (NetSpot; Ekahau — reconhecimento)','ferramenta'],['WiFi Analyzer (Android)','ferramenta'],['iPerf3 (throughput real)','ferramenta']],
  N04:[['Perfil de elevação no Google Earth','ferramenta'],['Planejador de enlace do fabricante (ex.: UISP Design Center)','ferramenta'],['Calculadora de zona de Fresnel','ferramenta']],
  N05:[['OPNsense / pfSense (firewall dedicado)','ferramenta'],['RADIUS (FreeRADIUS) para WPA-Enterprise','ferramenta'],['nmap (auditar portas — só na rede que é sua ou do cliente, com autorização)','ferramenta']],
  N06:[['Zabbix (muito usado no Brasil)','ferramenta'],['LibreNMS','ferramenta'],['Uptime Kuma','ferramenta'],['NetBox / phpIPAM (documentar IPs)','ferramenta'],['Bitwarden / Vaultwarden (cofre de senhas do cliente)','ferramenta']],
  S08:[['etcd (Raft em produção)','ferramenta'],['TLA+ (reconhecimento)','ferramenta']],
  S09:[['Elle (verificador de histórico do Jepsen)','ferramenta']],
  S10:[['Maelstrom (Jepsen)','ferramenta'],['Gossip Glomers (desafios de sistemas distribuídos da Fly.io)','ferramenta']],
  S11:[['VMware ESXi (reconhecimento: mercado em migração pós-Broadcom)','ferramenta'],['XCP-ng (reconhecimento)','ferramenta']]
});

/* ---------- FLÂNEUR ---------- */
SYS.tech({
  F01:[['Descrição densa (Clifford Geertz)','técnica'],['Notas de campo etnográficas','técnica'],['Mapa sensorial do lugar','técnica']],
  F02:[['Reverse outline (esqueleto do texto alheio)','técnica'],['Marginália (anotar na margem)','técnica']],
  F30:[['Readwise / exportar destaques do Kindle','ferramenta'],['Fichas pautadas (index cards)','ferramenta']],
  F12:[['World Anvil / Campfire (reconhecimento)','ferramenta'],['Linha do tempo em planilha','técnica']],
  F38:[['Snowflake Method (Randy Ingermanson)','método'],['Save the Cat! (beat sheet)','método'],['Cartões de cena (index cards)','técnica'],['Reverse outline do próprio rascunho','técnica']],
  F39:[['Pomodoro','técnica'],['Planilha de palavras por dia','ferramenta']],
  F40:[['Critical Response Process (Liz Lerman)','método'],['Método Milford/Clarion de oficina','método']],
  F41:[['VOLP — Vocabulário Ortográfico da Língua Portuguesa (ABL)','referência'],['Dicionários Houaiss / Aulete Digital','referência'],['LanguageTool','ferramenta'],['Controle de alterações (Word/Docs)','ferramenta'],['Ouvir o texto em voz sintética (TTS)','técnica']],
  F47:[['Escansão marcada no papel','técnica'],['Tratado de Versificação — Olavo Bilac & Guimarães Passos (domínio público)','referência'],['Dicionário de rimas','ferramenta']],
  F26:[['Estética de fita no editor de vídeo: ruído, tracking, timecode','técnica'],['Dossiê fictício: ata, relatório, formulário (sempre marcado como ficção)','técnica']],
  F27:[['Convenções do r/nosleep','referência'],['Wiki colaborativa no formato SCP','ferramenta']],
  F28:[['CyberChef (codificar/decodificar pistas)','ferramenta'],['Espectrograma no Sonic Visualiser ou Audacity','ferramenta'],['Esteganografia simples em imagem','técnica'],['Cifras clássicas: César, Vigenère, Base64','técnica'],['Site estático (Neocities / GitHub Pages)','ferramenta'],['Discord para a comunidade','ferramenta'],['Planilha de pistas: trailhead → solução → próxima pista','técnica']],
  F62:[['Operadores booleanos, aspas e truncamento','técnica'],['Connected Papers / ResearchRabbit (mapa de citações)','ferramenta'],['Plataforma Lattes','ferramenta']],
  F63:[['ABNT NBR 6023 (referências)','norma'],['ABNT NBR 10520 (citações)','norma'],['ABNT NBR 14724 (trabalhos acadêmicos)','norma'],['ABNT NBR 6022 (artigo)','norma'],['ABNT NBR 6028 (resumo)','norma'],['MORE — Mecanismo Online para Referências (UFSC)','ferramenta'],['Estilo ABNT no Zotero','ferramenta'],['abnTeX2 + Overleaf (LaTeX — reconhecimento)','ferramenta']],
  F18:[['Carta de apresentação (query letter)','técnica'],['Sinopse de 1 página','técnica']],
  F19:[['Página de autor na Amazon (Author Central)','ferramenta'],['Site de uma página (Carrd / WordPress)','ferramenta'],['Newsletter (Substack / MailerLite)','ferramenta']],
  F66:[['Licenças Creative Commons','norma'],['EDA — Escritório de Direitos Autorais (Biblioteca Nacional)','ferramenta']],
  F67:[['Formulário W-8BEN (entrevista fiscal)','ferramenta'],['Carnê-Leão (rendimento do exterior)','ferramenta']],
  F68:[['Sigil (editor de EPUB)','ferramenta'],['Calibre','ferramenta'],['EPUBCheck (validar EPUB)','ferramenta'],['Pandoc','ferramenta'],['Atticus / Vellum (pagos; Vellum só no Mac)','ferramenta']],
  F69:[['Gerador de template de capa do KDP','ferramenta'],['Canva / Affinity / GIMP / Photopea','ferramenta']],
  F70:[['Autocompletar da busca da Amazon (pesquisa de palavra-chave)','técnica'],['Publisher Rocket (reconhecimento)','ferramenta'],['Códigos BISAC (categorias)','norma']],
  F73:[['Clube de Autores / UICLAP (impressão sob demanda no Brasil)','ferramenta'],['IngramSpark (reconhecimento)','ferramenta']],
  F75:[['BookFunnel / StoryOrigin (entrega de cópia antecipada)','ferramenta'],['Skoob (rede de leitores brasileira)','ferramenta'],['Goodreads','ferramenta']],
  F76:[['MailerLite / Kit / Brevo (e-mail)','ferramenta'],['Página de captura com ímã de leitor','técnica']],
  F77:[['Skoob, BookTok e Bookstagram','ferramenta'],['Calendário de conteúdo em planilha','técnica']],
  F78:[['Amazon Ads (Sponsored Products)','ferramenta'],['Meta Ads','ferramenta'],['Planilha de ACOS por campanha','técnica']],
  F81:[['Distribuidores de audiolivro (confira quais aceitam autor brasileiro)','ferramenta'],['Regras de narração sintética de cada loja','técnica'],['Planilha de direitos: obra × mídia × território × prazo','técnica']]
});

/* ---------- FOUNDER ---------- */
SYS.tech({
  B01:[['Mapa de empatia','técnica'],['Jornada do cliente (customer journey map)','técnica'],['Canvas de proposta de valor (Strategyzer)','método']],
  B02:[['Método de posicionamento de April Dunford (Obviously Awesome)','método'],['Declaração de posicionamento (Geoffrey Moore)','técnica']],
  B03:[['CRM: RD Station CRM, Pipedrive ou HubSpot (planilha no começo também vale)','ferramenta'],['GPCT / MEDDIC (reconhecimento)','técnica']],
  B04:[['EAP / WBS (estrutura analítica do projeto)','técnica'],['Estimativa de três pontos (PERT)','técnica'],['Project Model Canvas','método']],
  B05:[['Van Westendorp (sensibilidade a preço)','técnica'],['EVC — valor econômico para o cliente','técnica']],
  B06:[['Planilha de coortes','técnica'],['Rule of 40 (reconhecimento)','técnica']],
  B07:[['Pix Automático (Banco Central, desde junho de 2025)','ferramenta'],['Cobrança recorrente: Asaas, Stripe, Pagar.me, Mercado Pago (compare taxas)','ferramenta']],
  B08:[['Assinatura eletrônica: gov.br, Clicksign, D4Sign','ferramenta'],['Matriz de prioridade de chamados (P1–P4)','técnica'],['Termo de aceite','técnica'],['Acordo de tratamento de dados (DPA)','técnica']],
  B09:[['Simulador do Simples Nacional (anexos e Fator R)','ferramenta'],['PGDAS-D (Portal do Simples Nacional)','ferramenta'],['Emissor Nacional de NFS-e','ferramenta']],
  B10:[['ZOPA (zona de acordo possível)','técnica'],['Método de Harvard (Como chegar ao sim)','método']],
  B11:[['SIPOC','técnica'],['Fluxograma swimlane (raias)','notação'],['BPMN 2.0','notação'],['VSM — Mapeamento do Fluxo de Valor','técnica'],['POP — Procedimento Operacional Padrão','técnica'],['Kanban','método'],['PDCA','método'],['Tambor-Pulmão-Corda (Teoria das Restrições)','técnica'],['Diagrama de espaguete (deslocamento no layout)','técnica']],
  B12:[['Entrevista comportamental (STAR)','técnica'],['Scorecard da vaga','técnica'],['Matriz RACI','técnica'],['Níveis de delegação (delegation poker)','técnica']],
  B13:[['SBI — Situação, Comportamento, Impacto','técnica'],['Pauta de 1:1 compartilhada','técnica']],
  B14:[['Arquétipos de marca','técnica'],['Moodboard','técnica'],['Manual de marca (brandbook)','técnica'],['Canva (peças rápidas) / Figma (sistema visual)','ferramenta']],
  B15:[['Google Search Console','ferramenta'],['Google Analytics 4','ferramenta'],['Schema.org LocalBusiness','norma'],['NAP consistente (nome, endereço, telefone)','técnica'],['Planejador de palavras-chave do Google Ads','ferramenta']],
  B16:[['Bullseye Framework (Tração — Weinberg & Mares)','método'],['AARRR (métricas piratas)','técnica'],['ICE score','técnica'],['Links com UTM','técnica']],
  B17:[['CIS Controls v8.1 — IG1','norma'],['NIST CSF 2.0 (reconhecimento)','norma'],['GLPI (inventário e chamados, open source)','ferramenta'],['Matriz de risco probabilidade × impacto','técnica']],
  B18:[['Wardley Mapping','técnica'],['Matriz de maturidade de TI','técnica'],['TCO — custo total de propriedade','técnica'],['OKR','método']],
  B19:[['Helpdesk: GLPI, Zammad ou Freshdesk','ferramenta'],['RMM: Tactical RMM, NinjaOne, Action1 (reconhecimento)','ferramenta'],['Acesso remoto: RustDesk, AnyDesk','ferramenta'],['Relatório mensal de valor (template)','técnica']],
  B20:[['Cinco Forças (Porter)','técnica'],['VRIO','técnica'],['Canvas estratégico (Oceano Azul)','técnica']],
  B21:[['Lean Canvas','método'],['Test Card / Learning Card (Strategyzer)','técnica'],['Canvas de proposta de valor','método']],
  B26:[['NPS','técnica'],['CSAT','técnica'],['Cliente oculto','técnica']],
  B27:[['PEPS / FIFO','técnica'],['Estoque de segurança','técnica'],['Relatório de giro no ERP (ex.: Bling, Tiny, Omie)','ferramenta']],
  B28:[['Planograma','técnica'],['Contador de fluxo na porta','ferramenta']],
  B30:[['PAS (Problema, Agitação, Solução)','técnica'],['Swipe file','técnica'],['Teste A/B','técnica']],
  B31:[['Meta Business Suite (agendar)','ferramenta'],['mLabs (agendador brasileiro)','ferramenta'],['Canva','ferramenta'],['CapCut','ferramenta']],
  B32:[['WhatsApp Business App × WhatsApp Business Platform (API)','ferramenta'],['Double opt-in','técnica'],['Brevo / MailerLite (e-mail)','ferramenta']]
});

/* ---------- MIND ---------- */
SYS.tech({
  P01:[['Modelo de Toulmin','técnica'],['Mapa de argumentos','técnica'],['Argdown / Kialo (reconhecimento)','ferramenta']],
  P02:[['Pré-mortem (Gary Klein)','técnica'],['Diário de decisões','técnica'],['Checklist de vieses antes de decisão grande','técnica']],
  P03:[['Brier score (calibração)','técnica'],['Estimativa de Fermi','técnica'],['Good Judgment Open / Metaculus (treinar previsões)','ferramenta']],
  P11:[['Método Cornell de anotação','técnica'],['Interrogação elaborativa','técnica']],
  P12:[['Intenções de implementação (se X, então Y)','técnica'],['Empilhamento de hábitos','técnica'],['Octalysis (framework de gamificação)','método'],['Rastreador de hábitos','ferramenta']],
  P13:[['Matriz ACT','técnica'],['Roda das emoções (Plutchik)','ferramenta']],
  P14:[['IPIP-NEO (inventário Big Five de domínio público)','ferramenta'],['BFI-2','ferramenta']],
  P20:[['Os cinco cânones da retórica','técnica']],
  P21:[['SCQA','técnica'],['Árvore de questões (issue tree)','técnica'],['Ghost deck (roteiro de slides antes dos slides)','técnica']],
  P22:[['Regras de Rapoport (Dennett)','técnica'],['Formato Parlamentar Britânico','método']],
  P25:[['FSRS (agendador moderno do Anki)','ferramenta'],['AnkiDroid / AnkiWeb (sincronização)','ferramenta'],['Oclusão de imagem (nativa)','ferramenta']],
  P29:[['Time blocking','técnica'],['Bloqueadores: Cold Turkey, Freedom, modo foco do celular','ferramenta'],['Pomodoro','técnica']],
  P30:[['MBSR (programa de 8 semanas)','método'],['Escaneamento corporal (body scan)','técnica'],['Medito / Insight Timer (apps gratuitos)','ferramenta']]
});

/* ---------- AESTHETIC ---------- */
SYS.tech({
  E21:[['CARs — rotações articulares controladas','técnica'],['RAMP (protocolo de aquecimento)','método']],
  E22:[['Hevy / Strong (registro de treino) ou planilha','ferramenta'],['Kinovea (análise de vídeo, grátis)','ferramenta']],
  E07:[['Marcos de volume: MEV, MAV, MRV','técnica'],['Divisões: full body, upper/lower, push/pull/legs','técnica']],
  E28:[['Periodização linear, ondulatória (DUP) e em blocos','técnica'],['Planilha de mesociclo','ferramenta']],
  E29:[['EMOM / AMRAP / Tabata','técnica'],['Teste da fala (talk test)','técnica']],
  E30:[['Modelo semáforo de monitoramento da dor','técnica']],
  E10:[['TACO — Tabela Brasileira de Composição de Alimentos (Unicamp)','ferramenta'],['Cronometer / MyFitnessPal (1–2 semanas de registro, não para sempre)','ferramenta'],['Método do prato','técnica']],
  E11:[['Examine.com (evidência sobre suplementos)','referência'],['Consulta de produtos regularizados na Anvisa','ferramenta'],['Laudo de pureza de terceira parte','técnica']],
  E12:[['Diário do sono','ferramenta'],['TCC-I (terapia cognitivo-comportamental para insônia, com profissional)','método']],
  E14:[['Pirâmide olfativa (saída, corpo, fundo)','técnica'],['Fragrantica (base de perfumes)','ferramenta'],['Amostras e decants antes do frasco','técnica']],
  E49:[['Respiração em caixa (box breathing)','técnica'],['Suspiro fisiológico','técnica'],['NSDR / yoga nidra','técnica']],
  E50:[['Modo noturno do sistema / f.lux','ferramenta'],['Questionário de cronotipo (MEQ)','ferramenta']],
  E52:[['Teste de Cooper (12 min)','técnica'],['Frequência cardíaca de repouso pela manhã','técnica']],
  E54:[['Tempo de uso / Bem-estar digital (celular)','ferramenta'],['Regra dos 20 segundos (fricção)','técnica']],
  E16:[['Projeto 333','método'],['Planilha de custo por uso','ferramenta']],
  E56:[['Análise de coloração pessoal (método sazonal expandido)','técnica'],['Teste do tecido (drapeado)','técnica'],['Círculo cromático','ferramenta']],
  E18:[['Exercícios de trato vocal semiocluído (canudo, vibração de lábios)','técnica'],['Fonoaudiólogo de voz profissional','referência']],
  E19:[['PREP (ponto, razão, exemplo, ponto)','técnica'],['Toastmasters (clube de prática)','referência'],['Pecha Kucha / Ignite (formatos curtos)','método']],
  E59:[['Iluminação de três pontos','técnica'],['Microfone de lapela','ferramenta'],['OBS Studio (gravação)','ferramenta']],
  E60:[['Princípios de instrução de Rosenshine','referência'],['Teoria da carga cognitiva (Sweller)','referência']],
  E62:[['Planejamento reverso (Backward Design — Wiggins & McTighe)','método'],['Plano de aula em 1 página','técnica']],
  E63:[['Princípios de aprendizagem multimídia (Mayer)','referência'],['Excalidraw (quadro digital)','ferramenta']],
  E64:[['Bilhete de saída (exit ticket)','técnica'],['Pense-par-compartilhe','técnica'],['Mentimeter / Kahoot / Plickers','ferramenta'],['Rubrica analítica','técnica']],
  E66:[['Story Spine (Kenn Adams)','técnica'],['Teste do jantar (Matthew Dicks)','técnica']],
  E67:[['Técnica de ponte (bridging)','técnica']],
  E68:[['CapCut / DaVinci Resolve / InShot','ferramenta'],['Roteiro em duas colunas (áudio | imagem)','técnica'],['Legenda automática + revisão humana','técnica']],
  E70:[['Strava ou o app de saúde do celular','ferramenta']],
  E71:[['Wikiloc (trilhas, muito usado no Brasil)','ferramenta'],['Arquivo GPX e mapa offline','ferramenta'],['Compartilhar localização em tempo real','técnica']],
  E75:[['WikiAves','ferramenta'],['eBird','ferramenta'],['Guia de campo impresso de aves do Brasil','referência']],
  E76:[['iNaturalist (plantas, insetos, fungos)','ferramenta']],
  E77:[['Stellarium (planetário grátis)','ferramenta'],['Planisfério / carta celeste','ferramenta'],['Light Pollution Map (escala de Bortle)','ferramenta']],
  E79:[['Modo Pro/manual da câmera do celular','ferramenta']],
  E80:[['Planejador de luz (ex.: PhotoPills — reconhecimento)','ferramenta']],
  E81:[['Foco pelo botão traseiro (back-button focus)','técnica'],['Esconderijo portátil (blind)','ferramenta']],
  E84:[['Letterboxd (diário de filmes)','ferramenta'],['Cinemateca Brasileira (acervo)','referência']],
  E85:[['Decupagem plano a plano','técnica']],
  E86:[['Serializd / TV Time (registro de séries)','ferramenta']],
  E87:[['Visual Thinking Strategies (VTS)','método'],['Observação lenta (slow looking)','técnica'],['Google Arts & Culture (zoom em alta resolução)','ferramenta']]
});

/* ---------- NAVIGATION ---------- */
SYS.tech({
  V03:[['HP 12C (ou emulador)','ferramenta'],['Calculadora do Cidadão (BCB)','ferramenta']],
  V18:[['SIDRA (IBGE)','ferramenta']],
  V19:[['Boletim Focus (BCB)','ferramenta'],['Atas e comunicados do Copom','referência'],['Curva de juros (ETTJ — ANBIMA)','ferramenta']],
  V20:[['PNAD Contínua e SIDRA (IBGE)','ferramenta'],['Novo Caged','ferramenta'],['IBC-Br (BCB)','ferramenta']],
  V21:[['PTAX (BCB)','ferramenta'],['Comex Stat (balança comercial)','ferramenta']],
  V22:[['Tesouro Transparente','ferramenta'],['IFI — Instituição Fiscal Independente (Senado)','referência']],
  V04:[['VPL e TIR na planilha','ferramenta'],['Árvore de decisão com valor esperado','técnica']],
  V33:[['Dados abertos da CVM','ferramenta'],['Planilha de análise padronizada','técnica']],
  V34:[['Status Invest / Fundamentus / Investidor10 (confira na fonte primária)','ferramenta']],
  V35:[['Planilha de FCD','ferramenta'],['Dados de Damodaran (prêmio de risco do Brasil, betas setoriais)','referência'],['CAPM e WACC (reconhecimento)','técnica']],
  V38:[['Lâmina e regulamento do ETF','referência'],['Lista de ETFs listados na B3','ferramenta']],
  V39:[['Fundos.NET (documentos dos fundos na B3)','ferramenta'],['Relatório gerencial do FII','referência']],
  V40:[['Lei 14.754/2023 (aplicações no exterior)','norma'],['Declaração de Capitais Brasileiros no Exterior (BCB)','ferramenta']],
  V41:[['Sicalc Web (gerar DARF)','ferramenta'],['Código de DARF 6015','norma'],['Planilha de apuração mensal','ferramenta']],
  V43:[['GOOGLEFINANCE (Google Planilhas)','ferramenta'],['yfinance (Python)','ferramenta'],['Séries históricas da B3','ferramenta']],
  V48:[['Simulador do Tesouro Direto','ferramenta']],
  V11:[['IPS em 1 página','técnica'],['Aba Carteira do Sistema (alocação alvo × real)','ferramenta']],
  V14:[['Declaração pré-preenchida (conta gov.br prata/ouro)','ferramenta'],['Programa IRPF / app Meu Imposto de Renda','ferramenta'],['Carnê-Leão Web','ferramenta']],
  V51:[['Planilha de cenários (conservador, base, otimista)','ferramenta']],
  V52:[['Planilha de DRE gerencial por centro de custo','ferramenta']],
  V10:[['Ciclo de caixa: PMR, PME e PMP','técnica']],
  V53:[['Markup divisor','técnica'],['Margem de contribuição unitária','técnica']],
  V58:[['Planilha SAC × Price','ferramenta']]
});

/* ---------- ARS ---------- */
SYS.tech({
  M01:[['Analisador de espectro (ex.: Voxengo SPAN, grátis)','ferramenta'],['Sweep / gerador de tom','ferramenta'],['Decibelímetro no celular','ferramenta']],
  M02:[['Takadimi / konnakol (sílabas rítmicas)','técnica'],['Metrônomo com subdivisão','ferramenta']],
  M03:[['Functional Ear Trainer','ferramenta'],['Exercícios do musictheory.net','ferramenta'],['EarMaster / ToneGym (reconhecimento)','ferramenta']],
  M04:[['Hooktheory (teoria dentro de músicas reais)','ferramenta']],
  M05:[['Análise harmônica com numeração romana','técnica']],
  M06:[['Contraponto de espécies (Fux)','técnica']],
  M09:[['Freesound (confira a licença de cada som)','ferramenta'],['Packs licenciados (Splice e afins — reconhecimento)','ferramenta']],
  M37:[['Monitor MIDI (Protokol, MIDI-OX, MIDI Monitor)','ferramenta']],
  M38:[['Melodics (reconhecimento)','ferramenta']],
  M39:[['Melodics','ferramenta'],['Controladores de pads: MPC, Maschine, Launchpad, Push (reconhecimento)','ferramenta']],
  M16:[['Syntorial (ouvido para síntese)','ferramenta'],['Vital (grátis)','ferramenta'],['Surge XT (grátis, open source)','ferramenta']],
  M19:[['Bitcrusher e emulação de fita (nativos ou grátis)','ferramenta']],
  M24:[['Voxengo SPAN','ferramenta'],['Medidor de correlação estéreo','ferramenta'],['Faixa de referência dentro do projeto','técnica']],
  M25:[['Youlean Loudness Meter (grátis)','ferramenta'],['iZotope Ozone (reconhecimento)','ferramenta']],
  M26:[['Distribuidoras: DistroKid, ONErpm, CD Baby, Tratore (compare taxa e contrato)','ferramenta'],['ISRC (gravação) e ISWC (obra)','norma']],
  M28:[['Análise de tom (nativa do software ou Mixed In Key)','ferramenta']],
  M42:[['Gravador portátil (Zoom, Tascam — reconhecimento)','ferramenta'],['Protetor de vento (dead cat)','ferramenta'],['Audacity para limpeza (iZotope RX — reconhecimento)','ferramenta']],
  M43:[['Valhalla Supermassive (grátis)','ferramenta']],
  M44:[['Tom de Shepard','técnica'],['Mickey-mousing (e por que evitar)','técnica']],
  M47:[['Loopers: pedal (Boss RC), iOS (Loopy Pro) ou dentro da DAW','ferramenta']],
  M07:[['MuseScore (grátis)','ferramenta'],['TuxGuitar (grátis) / Guitar Pro','ferramenta'],['Songsterr','ferramenta'],['Cifra Club (confira a precisão)','ferramenta']],
  M55:[['App de treino de braço (fretboard trainer)','ferramenta']],
  M58:[['Transcribe! (desacelerar sem mudar o tom)','ferramenta'],['Moises (separar instrumentos)','ferramenta'],['MuseScore','ferramenta']],
  M62:[['NAM — Neural Amp Modeler (grátis)','ferramenta'],['Simuladores de amp (Neural DSP, AmpliTube — reconhecimento)','ferramenta'],['Pedaleira multiefeitos','ferramenta']],
  M65:[['Interface com entrada de instrumento (Hi-Z)','ferramenta'],['Caixa de reamp','ferramenta']],
  M67:[['Melodyne (reconhecimento) ou a afinação nativa da DAW','ferramenta']],
  M69:[['Diagramas de fiação dos fabricantes de captadores','referência']]
});

/* =====================================================================
   ESCOLHAS DE TRILHA — só onde as opções não se complementam.
   Cada escolha vale para todos os nós listados; trocar é livre e o
   progresso de cada trilha fica salvo separadamente.
   ===================================================================== */

/* ---------- ARQUITETO · banco relacional ---------- */
SYS.choice({key:'db', way:'architect', n:'Banco relacional principal', q:'PostgreSQL ou SQL Server?',
  why:'Os conceitos são os mesmos; ferramentas, custo e clientes, não. SQL Server é o mundo corporativo Microsoft (licença, SSMS, T-SQL). PostgreSQL é o padrão de SaaS e nuvem aberta (grátis, extensões, JSONB). O CERNE nasce em PostgreSQL; o legado de muitos clientes mora em SQL Server. Ler plano de execução nos dois ao mesmo tempo é dobrar o trabalho e não aprender nenhum.',
  opts:[
    {id:'pg', n:'PostgreSQL', tag:'Aberto, extensões, padrão de SaaS', who:'SaaS, startups, nuvem e quem quer custo baixo'},
    {id:'mssql', n:'SQL Server', tag:'Microsoft, T-SQL, ferramentas maduras', who:'PMEs e empresas Microsoft, ERPs e sistemas legados'}
  ]});
SYS.track('A43', 'db', {
  pg:{st:['B-tree, GIN (JSONB e texto) e BRIN (tabelas enormes e ordenadas)','Índice parcial e índice de expressão','CREATE INDEX CONCURRENTLY em produção','pg_stat_user_indexes: achar o índice que ninguém usa'], tk:[['psql / pgAdmin / DBeaver','ferramenta']]},
  mssql:{st:['Clustered x nonclustered e a escolha da chave de clustering','INCLUDE para covering index','Índices filtrados','DMVs de índices não usados e de missing indexes (com senso crítico)'], tk:[['SSMS (SQL Server Management Studio)','ferramenta']]}
});
SYS.track('A44', 'db', {
  pg:{st:['EXPLAIN (ANALYZE, BUFFERS) e como ler de dentro para fora','pg_stat_statements: as consultas que mais custam no total','auto_explain para capturar query lenta','Estatísticas: ANALYZE e quando a estimativa mente'], tk:[['explain.dalibo.com (visualizar plano)','ferramenta']]},
  mssql:{st:['Plano estimado x plano real no SSMS','Query Store: regressão de plano e plano forçado','SET STATISTICS IO, TIME ON','Parameter sniffing e as saídas possíveis'], tk:[['First Responder Kit / sp_Blitz (Brent Ozar)','ferramenta']]}
});
SYS.track('A45', 'db', {
  pg:{st:['Um processo por conexão: por que max_connections é caro','PgBouncer em modo transaction e o que ele quebra (sessão, prepared statements)','Pool do Npgsql no .NET','PgBouncer embutido no Azure Database for PostgreSQL Flexible Server']},
  mssql:{st:['Pool do Microsoft.Data.SqlClient definido pela connection string','Limites de workers e sessões por camada (Azure SQL)','Sessões bloqueadas: sp_who2 e DMVs de espera','Connection resiliency (retry) no EF Core']}
});

/* ---------- ARQUITETO · infraestrutura como código ---------- */
SYS.choice({key:'iac', way:'architect', n:'Infraestrutura como código', q:'Bicep ou Terraform?',
  why:'Os dois descrevem a mesma nuvem de jeitos diferentes. Bicep fala direto com o Azure e não tem arquivo de estado. Terraform fala com qualquer nuvem e vive de um state file. Misturar os dois no mesmo ambiente cria duas fontes da verdade brigando pelo mesmo recurso.',
  opts:[
    {id:'bicep', n:'Bicep', tag:'Nativo do Azure, sem state file', who:'Quem vive no Azure e quer menos peças móveis (e está na trilha AZ-104/AZ-305)'},
    {id:'tf', n:'Terraform / OpenTofu', tag:'Multinuvem, state file e ecossistema enorme', who:'Quem vai atender clientes em mais de uma nuvem ou entra num time que já usa'}
  ]});
SYS.track('A74', 'iac', {
  bicep:{st:['Sintaxe: resources, params, variables, outputs e decorators','Arquivo .bicepparam por ambiente','what-if antes de todo deploy','Módulos locais e Azure Verified Modules','Escopos de deploy: resource group, subscription, management group','Deployment stacks para gerenciar e apagar o conjunto (reconhecimento)'], tk:[['Extensão Bicep do VS Code','ferramenta'],['Azure Verified Modules','referência']]},
  tf:{st:['HCL: provider azurerm, resources, variables, outputs e locals','plan → apply → destroy, e ler o plan com calma','State remoto em Storage Account com lock','Módulos e o Terraform Registry','Workspaces x uma pasta por ambiente','Licença: Terraform (BSL desde 2023) x OpenTofu (fork aberto) — escolha consciente'], tk:[['OpenTofu','ferramenta'],['tflint / checkov (análise estática)','ferramenta']]}
});
SYS.track('A76', 'iac', {
  bicep:{st:['Ambiente inteiro em Bicep, com what-if rodando no pipeline','Destruir e recriar: resource group descartável ou deployment stack','Budget e alertas de custo também em Bicep']},
  tf:{st:['Ambiente inteiro em Terraform com state remoto e lock','destroy + apply do zero, cronometrados','Budget e alertas de custo também em Terraform']}
});

/* ---------- ARQUITETO · CI/CD ---------- */
SYS.choice({key:'ci', way:'architect', n:'Plataforma de CI/CD', q:'GitHub Actions ou Azure DevOps?',
  why:'Fazem a mesma coisa com culturas diferentes. Cliente corporativo Microsoft costuma estar no Azure DevOps, com Boards e Repos. Projeto próprio, SaaS e open source costuma estar no GitHub. Um repositório, um pipeline: escolha a casa.',
  opts:[
    {id:'gha', n:'GitHub Actions', tag:'Workflows em YAML ao lado do código', who:'Projetos próprios, SaaS e open source'},
    {id:'ado', n:'Azure DevOps', tag:'Pipelines + Boards + Repos + Artifacts', who:'Clientes corporativos Microsoft e times que já usam Boards'}
  ]});
SYS.track('A77', 'ci', {
  gha:{st:['Workflows em .github/workflows: eventos, jobs, steps e matrix','Runners hospedados x self-hosted (e o risco do self-hosted em repositório público)','Secrets, variables e environments','Login no Azure por OIDC: federação, nenhum segredo guardado','Actions de terceiros: fixar versão por SHA','Reusable workflows e composite actions','Cache de dependências e artefatos'], tk:[['act (rodar Actions localmente)','ferramenta'],['Dependabot','ferramenta']]},
  ado:{st:['azure-pipelines.yml: stages, jobs, steps e templates','Agentes hospedados pela Microsoft x self-hosted','Service connections com workload identity federation','Variable groups ligados ao Key Vault','Branch policies no Azure Repos (ou pipeline sobre repositório do GitHub)','Artifacts: feeds de pacotes do time'], tk:[['Azure Boards (reconhecimento)','ferramenta'],['Renovate (atualizar dependências)','ferramenta']]}
});
SYS.track('A78', 'ci', {
  gha:{st:['Environments com revisores obrigatórios e regras de proteção','Deploy no Azure com OIDC e slots de App Service','Build uma vez, promover o mesmo artefato','concurrency para nunca deployar duas vezes ao mesmo tempo']},
  ado:{st:['Pipeline multi-stage: dev → homologação → produção','Aprovações e checks nos environments','Promover o artefato publicado, não rebuildar','Deployment jobs com estratégia runOnce, rolling ou canary']}
});

/* ---------- ARQUITETO · hypervisor do homelab ---------- */
SYS.choice({key:'hyper', way:'architect', n:'Hypervisor do laboratório', q:'Linux ou Windows no metal?',
  why:'Um servidor, um hypervisor bare-metal. Proxmox é o mundo Linux: KVM, containers LXC, ZFS e interface web. Hyper-V é o mundo Windows Server — o mesmo que muito cliente PME já roda. Os dois ensinam virtualização; operar é outra conversa.',
  opts:[
    {id:'pve', n:'Proxmox VE', tag:'KVM + LXC + ZFS, grátis, interface web', who:'Homelab, provedores e quem saiu do VMware'},
    {id:'hv', n:'Hyper-V', tag:'Windows Server, PowerShell e o ecossistema Microsoft', who:'Quem atende PMEs com Windows Server, Active Directory e licenças Microsoft'}
  ]});
SYS.track('S11', 'hyper', {
  pve:{st:['Instalação e repositório: no-subscription x enterprise','Bridge Linux (vmbr0) com VLAN-aware','LXC x VM: quando cada um','ZFS: pool, ARC (a RAM que ele come) e snapshots','Templates + cloud-init','Proxmox Backup Server: deduplicação e verificação','Cluster e quorum (reconhecimento: com 2 nós você precisa de um QDevice)'], tk:[['Proxmox Backup Server','ferramenta'],['Scripts da comunidade (leia antes de rodar — sempre)','ferramenta']]},
  hv:{st:['Onde roda: função Hyper-V do Windows Server, ou do Windows 11 Pro para laboratório','Licenciamento: Standard x Datacenter e quantas VMs Windows cada um cobre (confira as regras atuais)','Virtual Switch externo, interno e privado; VLAN por adaptador','Hyper-V Manager, Windows Admin Center e PowerShell (New-VM, Checkpoint-VM)','Checkpoint padrão x checkpoint de produção','Backup e restore testado (Windows Server Backup; Veeam Community — reconhecimento)','Hyper-V Replica e Failover Cluster (reconhecimento)'], tk:[['Windows Admin Center','ferramenta'],['Módulo Hyper-V do PowerShell','ferramenta']]}
});

/* ---------- ARQUITETO · Wi-Fi e rede gerenciada ---------- */
SYS.choice({key:'wifi', way:'architect', n:'Ecossistema de rede gerenciada', q:'Qual controladora manda nos seus APs?',
  why:'AP de um fabricante não entra na controladora de outro. O ecossistema decide interface, preço, portal de hóspede e como você dá suporte remoto. O roteador/firewall da borda pode ser de outra marca; os APs de um mesmo cliente, não.',
  opts:[
    {id:'unifi', n:'Ubiquiti UniFi', tag:'Polido, integrado, mais caro', who:'Pousadas e resorts que querem gestão centralizada e visual premium'},
    {id:'omada', n:'TP-Link Omada', tag:'Controladora parecida, custo menor', who:'Clientes sensíveis a preço que ainda querem VLAN, portal e gestão central'},
    {id:'mikrotik', n:'MikroTik', tag:'RouterOS: poder total, curva íngreme', who:'Provedores e quem quer controle fino com pouco dinheiro — e aguenta Winbox e CLI'}
  ]});
SYS.track('N03', 'wifi', {
  unifi:{st:['Controladora: UniFi OS no gateway/Cloud Key ou aplicação auto-hospedada','Adoção de APs e perfis de rádio: potência, canal, largura','Hotspot de hóspede com vouchers','Roaming rápido e band steering: quando ligar, quando atrapalha','Relatórios de clientes e de interferência']},
  omada:{st:['Controladora em hardware, software ou nuvem','Adoção de EAPs e perfis de SSID/rádio','Portal com vouchers e isolamento de clientes','Mesh e roaming rápido: quando usar','Estatísticas e mapa de APs']},
  mikrotik:{st:['RouterOS nos APs e gestão central por CAPsMAN (confira: o pacote wifi novo e o wireless antigo têm CAPsMAN diferentes)','Winbox, WebFig e CLI: o mesmo sistema por três portas','Hotspot nativo com usuários e vouchers (User Manager)','Canal, potência e perfis por interface','Export da configuração em texto como backup legível']}
});
SYS.track('N05', 'wifi', {
  unifi:{st:['Redes/VLANs e regras de firewall no gateway UniFi','Rede de convidados com isolamento','VPN nativa (WireGuard) para acesso remoto','Janela e controle de atualização de firmware']},
  omada:{st:['VLANs e ACLs no gateway e nos switches Omada','Isolamento de convidados e portal','VPN no gateway (confira os protocolos do seu modelo)','Firmware e backup da controladora']},
  mikrotik:{st:['Bridge com VLAN filtering e interface lists','Firewall filter: input e forward, established/related, drop por padrão','WireGuard nativo no RouterOS v7','Desligar serviços não usados (telnet, ftp, api) e manter firmware em dia']}
});
SYS.track('N06', 'wifi', {
  unifi:{st:['Alertas da controladora e app no celular','Estatísticas por cliente e por AP','Backup automático da controladora — e uma cópia fora dela','Acesso remoto para suporte pela conta UI']},
  omada:{st:['Alertas e relatórios da controladora','Gestão remota pela nuvem Omada','Backup agendado da controladora','Logs de eventos e envio para syslog']},
  mikrotik:{st:['The Dude ou Zabbix via SNMP','Netwatch e scripts de alerta','Backup + export agendados e copiados para fora','Logs remotos via syslog']}
});

/* ---------- FLÂNEUR · casa das notas ---------- */
SYS.choice({key:'notas', way:'flaneur', n:'Casa das notas', q:'Onde mora o seu segundo cérebro?',
  why:'Fichas, bíblias e notas espalhadas em três lugares viram três meias memórias. Escolha uma casa principal; o resto orbita. Papel, arquivos locais e banco de dados na nuvem mudam o jeito de ligar uma ideia à outra.',
  opts:[
    {id:'papel', n:'Papel', tag:'Caderno, fichas e caneta', who:'Quem pensa escrevendo à mão e quer zero notificação'},
    {id:'obsidian', n:'Obsidian', tag:'Markdown local, links e grafo', who:'Quem quer arquivos próprios, links entre notas e que durem décadas'},
    {id:'notion', n:'Notion', tag:'Bancos de dados na nuvem', who:'Quem pensa em tabelas e propriedades e quer compartilhar'}
  ]});
SYS.track('F30', 'notas', {
  papel:{st:['Caderno de leitura com índice nas últimas páginas','Fichas numeradas em caixa (o sistema de Luhmann em papel)','Símbolos fixos para citação, paráfrase e comentário','Fotografar só o índice, para nunca perder o mapa']},
  obsidian:{st:['Uma nota por ideia, com título que afirma algo','Links e backlinks; tags com parcimônia','Nota de literatura x nota permanente','Template de ficha de livro; plugin só quando a falta doer']},
  notion:{st:['Banco de leituras com propriedades (autor, tema, status)','Relações entre livros, citações e projetos','Template de ficha','Exportar em Markdown de tempos em tempos: seus dados, sua cópia']}
});
SYS.track('F12', 'notas', {
  papel:{st:['Fichário por entidade: pessoa, lugar, instituição, objeto','Mapa desenhado e atualizado a lápis','Linha do tempo em folha dobrável']},
  obsidian:{st:['Uma nota por entidade, todas ligadas','Canvas para o mapa de relações','Propriedades nas notas para montar a cronologia (Bases/Dataview — reconhecimento)']},
  notion:{st:['Bancos: personagens, lugares, facções, eventos','Relações e rollups entre eles','Visualização em linha do tempo para a cronologia']}
});
SYS.track('F80', 'notas', {
  papel:{st:['Caderno da série separado do caderno de cada livro','Índice de continuidade: nomes, idades, datas']},
  obsidian:{st:['Pasta da série com nota por livro e por personagem','Consulta de continuidade: quem aparece onde']},
  notion:{st:['Banco de cenas com livro, capítulo e personagens','Filtro de continuidade por personagem']}
});

/* ---------- FLÂNEUR · ferramenta do manuscrito ---------- */
SYS.choice({key:'manuscrito', way:'flaneur', n:'Ferramenta do manuscrito', q:'Onde o livro vai ser escrito?',
  why:'Romance é um arquivo que vive meses. Documento linear, fichário de cenas ou texto puro mudam como você planeja, revisa e exporta. Trocar no meio do livro custa caro; escolha antes do capítulo 1.',
  opts:[
    {id:'doc', n:'Word ou Google Docs', tag:'Documento linear e universal', who:'Quem vai mandar para editora ou preparador (todo mundo abre .docx)'},
    {id:'scriv', n:'Scrivener', tag:'Fichário de cenas, cortiça e compilação', who:'Romance longo, estrutura que muda e pesquisa junto do texto'},
    {id:'md', n:'Texto puro (Markdown)', tag:'Arquivos .md + Pandoc + git', who:'Quem é dev, quer versionar o livro e exportar por comando'}
  ]});
SYS.track('F38', 'manuscrito', {
  doc:{st:['Estilo de título por capítulo e o painel de navegação','Um arquivo por livro (ou por parte) e versões datadas','Comentários e controle de alterações na revisão','Modelo de manuscrito: fonte, espaçamento, margens']},
  scriv:{st:['Binder: uma cena por documento','Corkboard e outliner com sinopse por cena','Metadados: ponto de vista, status, rótulos','Compile para DOCX e EPUB (e o formato de saída)']},
  md:{st:['Um arquivo por cena ou capítulo, numerados','git: commit por sessão, branch para reescrita grande','Pandoc para gerar DOCX e EPUB','Editor à escolha: Obsidian, VS Code ou iA Writer']}
});
SYS.track('F68', 'manuscrito', {
  doc:{st:['Estilos limpos → Kindle Create ou conversão para EPUB','Localizar e substituir para caçar espaços e enters duplos']},
  scriv:{st:['Compile para EPUB com formato próprio (confira as opções da sua versão)','Páginas iniciais e finais configuradas no compile']},
  md:{st:['pandoc com metadados e CSS gerando o EPUB','EPUBCheck no arquivo gerado']}
});

/* ---------- FLÂNEUR · distribuição do e-book ---------- */
SYS.choice({key:'dist', way:'flaneur', n:'Distribuição do e-book', q:'Exclusivo na Amazon ou em todas as lojas?',
  why:'Não dá para ter os dois ao mesmo tempo: o KDP Select exige o e-book só na Amazon durante cada período de 90 dias. Um lado ganha Kindle Unlimited e promoções; o outro ganha independência e leitor de outras lojas. Dá para mudar entre ciclos, não no meio de um.',
  opts:[
    {id:'select', n:'Exclusivo · KDP Select', tag:'Kindle Unlimited, KENP e promoções', who:'Estreia, séries e gêneros em que o leitor lê por assinatura'},
    {id:'wide', n:'Wide · várias lojas', tag:'Kobo, Apple, Google e outras', who:'Quem não quer depender de uma loja só e quer leitor fora da Amazon'}
  ]});
SYS.track('F72', 'dist', {
  select:{st:['Inscrição de 90 dias e renovação automática (desmarque se quiser sair)','KENP: como a página é contada e o teto por leitor (confira o atual)','Dias grátis e oferta com contagem regressiva (disponibilidade por marketplace)','Calendário de promoções dentro de cada ciclo'], tk:[['Relatórios do KDP (KENP lido)','ferramenta']]},
  wide:{st:['Lojas diretas: Kobo Writing Life, Apple Books, Google Play Livros','Agregador (ex.: Draft2Digital) x publicar loja por loja','Preço por loja e promoções sem exclusividade','Link universal para o leitor escolher a loja'], tk:[['Draft2Digital','ferramenta'],['Books2Read (link universal)','ferramenta']]}
});
SYS.track('F68', 'dist', {
  select:{st:['Kindle Create basta: o arquivo é pensado para a loja Kindle','Kindle Previewer em todos os tamanhos de tela']},
  wide:{st:['EPUB válido é a moeda de todas as lojas: EPUBCheck sempre','Um arquivo para todas: nada de recurso exclusivo de uma loja','Testar em apps diferentes (Apple Books, Kobo, Google)']}
});
SYS.track('F79', 'dist', {
  select:{st:['KENP lido por dia e taxa de leitura','O efeito de cada promoção do Select','Renovar ou sair com os dados do ciclo de 90 dias']},
  wide:{st:['Painel por loja e do agregador','Vendas por país e por loja','Qual loja cresce sem anúncio']}
});

/* ---------- AESTHETIC · skill do bloco ---------- */
SYS.choice({key:'skill', way:'aesthetic', n:'Skill principal do bloco', q:'Qual skill você persegue nos próximos 90 dias?',
  why:'Skill é treino de sistema nervoso: prática frequente e com pouca fadiga. Duas skills pesadas ao mesmo tempo dividem a recuperação e nenhuma sai. Uma por bloco; a próxima espera na fila.',
  opts:[
    {id:'hs', n:'Parada de mão', tag:'Equilíbrio e ombro', who:'A base de quase toda skill de empurrar'},
    {id:'lsit', n:'L-sit', tag:'Compressão e core', who:'Core forte e porta para V-sit e press'},
    {id:'mu', n:'Muscle-up', tag:'Puxada explosiva + transição', who:'Quem já faz umas 10 barras limpas'},
    {id:'fl', n:'Front lever', tag:'Puxada estática e escápula', who:'Puxada forte e paciência de meses'},
    {id:'pistol', n:'Pistol squat', tag:'Perna unilateral e mobilidade', who:'Força de perna sem academia'}
  ]});
SYS.track('E08', 'skill', {
  hs:{st:['Parada na parede de frente e de costas, com tempos-alvo','Alinhamento: ombro aberto, costela fechada, glúteo ativo','Subida controlada e saída segura (roda ou pirueta)','Equilíbrio pelos dedos e pelo punho','Aprofunde em E25 e E37']},
  lsit:{st:['Compressão: pike e elevações sentado','Tuck → uma perna → L completo','Depressão escapular nas paralelas','Tempo acumulado por sessão','Aprofunde em E26']},
  mu:{st:['Pré-requisitos: barras e mergulhos limpos','Barra alta e explosiva (até o peito)','Transição com elástico ou em negativa','Pegada falsa (reconhecimento) x kipping','Aprofunde em E27']},
  fl:{st:['Tuck → advanced tuck → uma perna → straddle','Escápula deprimida e retraída','Remada em front lever (tuck)','Negativas controladas','Aprofunde em E33']},
  pistol:{st:['Mobilidade de tornozelo e quadril','Pistol até a caixa e em negativa','Contrapeso à frente (anilha ou garrafa)','Controle do joelho e do pé','Aprofunde em E24']}
});

/* ---------- AESTHETIC · revelação de RAW ---------- */
SYS.choice({key:'raw', way:'aesthetic', n:'Revelador de fotos', q:'Onde suas fotos vão ser reveladas?',
  why:'O próprio capítulo manda: escolha um e domine. Catálogo, módulos e atalhos são diferentes em cada um, e o catálogo prende. Revelar no celular também vale — só não é o mesmo fluxo.',
  opts:[
    {id:'darktable', n:'darktable', tag:'Livre, fluxo por módulos', who:'Controle total sem assinatura'},
    {id:'lr', n:'Lightroom', tag:'Catálogo, máscaras com IA, nuvem (assinatura)', who:'Rapidez e sincronizar celular e computador'},
    {id:'mobile', n:'Celular (Snapseed / Lightroom Mobile)', tag:'Revelar onde você fotografa', who:'Quem fotografa com o celular e publica no mesmo dia'}
  ]});
SYS.track('E82', 'raw', {
  darktable:{st:['Lighttable, darkroom e o fluxo scene-referred','Módulos essenciais: exposição, filmic ou sigmoid, color calibration','Máscaras desenhadas e paramétricas','Estilos e cópia de ajustes em lote','Exportar com perfil de cor e nitidez de saída']},
  lr:{st:['Lightroom Classic (catálogo local) x Lightroom (nuvem): escolha consciente','Importar com palavras-chave e preset de importação','Máscaras: céu, pessoa, objeto','Sincronizar ajustes numa série','Presets de exportação por destino']},
  mobile:{st:['RAW, ProRAW ou DNG, se o seu celular grava','Snapseed: pilhas editáveis e pincéis','Lightroom Mobile: o que é grátis e o que é premium (confira)','Presets próprios para manter a série coerente']}
});

/* ---------- NAVIGATION · método de orçamento ---------- */
SYS.choice({key:'orcamento', way:'navigation', n:'Método de orçamento', q:'Como o seu dinheiro se organiza todo mês?',
  why:'Os três resolvem o mesmo problema com rituais diferentes. Dois métodos ao mesmo tempo viram duas planilhas que ninguém atualiza. Escolha um por 3 meses e avalie com os dados na mão.',
  opts:[
    {id:'zero', n:'Base zero', tag:'Todo real ganha uma função antes do mês', who:'Quem quer controle fino e topa revisar toda semana'},
    {id:'env', n:'Envelopes (caixinhas)', tag:'Uma caixinha por destino', who:'Quem controla melhor vendo o saldo de cada destino acabar'},
    {id:'pct', n:'Porcentagens', tag:'Faixas fixas e automação', who:'Quem quer o mínimo de trabalho e tem renda previsível'}
  ]});
SYS.track('V46', 'orcamento', {
  zero:{st:['Planejar o mês antes dele começar: renda esperada → categorias','Categoria estourou? Remaneje com decisão, não com culpa','Conferir a conta toda semana','Categoria para gastos anuais, dividida por 12'], tk:[['Planilha de base zero','ferramenta'],['YNAB (reconhecimento)','ferramenta']]},
  env:{st:['Uma caixinha por destino: fixo, variável, anual, lazer','Transferência automática no dia em que o dinheiro entra','Envelope vazio é envelope vazio (ou você decide de onde tirar)','Caixinha da empresa separada da pessoal'], tk:[['Caixinhas/cofrinhos do seu banco digital','ferramenta']]},
  pct:{st:['Faixas definidas pela sua realidade, não 50/30/20 copiado','Pagar-se primeiro: o investimento sai no dia em que o dinheiro entra','Automatizar transferências e esquecer o resto do mês','Revisar as faixas a cada trimestre'], tk:[['Pix e transferência agendados','ferramenta']]}
});

/* ---------- ARS · DAW ---------- */
SYS.choice({key:'daw', way:'ars', n:'DAW principal', q:'Em qual DAW você vai morar?',
  why:'Cada DAW tem um jeito de pensar: padrão e playlist (FL), clipe e cena (Live), linha do tempo livre (REAPER), tracker (Renoise). Atalho, roteamento e template só viram reflexo numa casa só. Trocar é possível; dominar uma vale mais que arranhar quatro.',
  opts:[
    {id:'reaper', n:'REAPER', tag:'Leve, barata e customizável até o osso', who:'Quem grava áudio (cordas, voz), edita muito e monta o próprio fluxo'},
    {id:'fl', n:'FL Studio', tag:'Padrões + playlist, piano roll lendário', who:'Quem pensa em loop e padrão: breaks, beats, eletrônica de quarto'},
    {id:'live', n:'Ableton Live', tag:'Session View: clipes, cenas e palco', who:'Quem quer tocar ao vivo, improvisar e arranjar por clipes'},
    {id:'renoise', n:'Renoise', tag:'Tracker: comandos por linha, edição microscópica', who:'Quem quer o DNA do jungle e do breakcore'}
  ]});
SYS.track('M08', 'daw', {
  reaper:{st:['Licença de uso pessoal e avaliação (confira o preço atual)','Track sem tipo: toda track pode ser áudio, MIDI ou pasta','Actions e atalhos: monte os 10 que você usa todo dia','Folder tracks, sends e receives','Templates de projeto e de track; screensets','Render de stems e a Region Render Matrix'], tk:[['SWS Extension','ferramenta'],['ReaPack','ferramenta']]},
  fl:{st:['Edições e o que cada uma libera (confira a tabela atual)','Channel Rack, padrões e Playlist: a lógica de blocos','Mixer: roteamento para insert, sends e sidechain','Piano roll: chop, strum, arpejo e ghost notes','Nativos que valem: Sytrus, Harmor, Slicex, Fruity Limiter','Template, atalhos e browser organizado'], tk:[['Manual oficial do FL Studio','referência']]},
  live:{st:['Intro, Standard e Suite: o que muda (confira a tabela atual)','Session View x Arrangement View: quando cada uma','Clipes, cenas, follow actions e quantização de disparo','Racks de instrumento e efeito, macros e chains','Warp: modos Beats, Complex e Re-Pitch','Max for Live (reconhecimento: vem na Suite)'], tk:[['Learning Music e Learning Synths (Ableton, grátis)','referência']]},
  renoise:{st:['Pattern editor: linhas, colunas de nota e de efeito','Comandos por linha: slice/offset (0Sxx), retrigger (0Rxy), reverso (0B00)','Instrument editor: sample, slices, keyzones e modulação','Pattern Matrix e a sequência do arranjo','Phrases: mini-sequências dentro do instrumento','Render de stems para mixar onde quiser'], tk:[['Manual oficial do Renoise','referência'],['OpenMPT ou MilkyTracker (trackers grátis para sentir a lógica)','ferramenta']]}
});
SYS.track('M11', 'daw', {
  reaper:{st:['Dynamic split por transiente','ReaSamplOmatic5000: uma fatia por nota','Mandar as fatias para um sampler e tocar no MIDI','Stretch markers para ajustar o groove sem fatiar']},
  fl:{st:['Slicex: detectar transientes e mapear no teclado','Fruity Slicer x Slicex: quando cada um','Chop no piano roll e resequenciamento','Envelope curto e cut groups para o choke']},
  live:{st:['Simpler em modo Slice: por transiente, por batida ou manual','Slice to New MIDI Track','Drum Rack com uma fatia por pad e choke groups','Warp nas fatias: evitar o artefato ou abraçar']},
  renoise:{st:['Autoslice direto no instrumento','0Sxx para disparar fatia por linha','Retrigger (0Rxy) e reverso por comando','Phrases para rolls prontos']}
});
SYS.track('M40', 'daw', {
  reaper:{st:['Editor MIDI: grid, swing e quantize com força parcial','Groove templates: extrair e aplicar','Lanes de velocity e de CC','Scripts de humanização da comunidade (ReaPack)']},
  fl:{st:['Randomize, quantize parcial, strum e arpeggiate','Ghost notes de outros canais e Chop','Swing global e por padrão','Riff Machine como ponto de partida, não de chegada']},
  live:{st:['Groove Pool: timing, random e velocity','MIDI Tools: transformações e geradores','Probabilidade e faixa de velocity por nota','Clipes de tamanhos diferentes para polirritmia']},
  renoise:{st:['Coluna de delay por nota para micro-timing','Groove (swing) da música e LPB','Velocity como fraseado, linha a linha','Patterns de tamanhos diferentes para defasar']}
});
SYS.track('M46', 'daw', {
  reaper:{st:['Sem Session View nativa: regiões e marcadores em loop','Extensões de lançamento de clipes (ex.: Playtime — paga, reconhecimento)','Entrada ao vivo com monitoramento e pouca latência','Plano B: stems no arranjo com marcadores e mutes']},
  fl:{st:['Performance Mode: clipes da playlist disparados pelo controlador','Mapear pads e cenas','Padrões por função: bateria, grave, tema, efeito','Plano B: arranjo gravado com mutes ao vivo']},
  live:{st:['Session View: cenas, follow actions e quantização de disparo','Racks de performance com macros','Push ou Launchpad como interface','Resample da saída ao vivo']},
  renoise:{st:['Pattern Matrix ao vivo: ligar e desligar blocos','Loop de sequência e pontos de retorno','MIDI mapping de controles','Plano B: stems renderizados disparados em outra ferramenta']}
});

/* ---------- ARS · software de DJ ---------- */
SYS.choice({key:'dj', way:'ars', n:'Software de DJ', q:'Em que ecossistema sua biblioteca vai morar?',
  why:'Cue points, beatgrids e playlists ficam presos ao software. Dá para converter, mas dói. E o software decide o hardware: em clube, quase sempre é CDJ.',
  opts:[
    {id:'rekordbox', n:'rekordbox', tag:'Padrão de clube: prepara o pendrive para CDJ', who:'Quem quer tocar em festa e clube com CDJ/XDJ'},
    {id:'serato', n:'Serato DJ', tag:'Controladora e toca-discos com vinil de timecode', who:'Quem vai de controladora, scratch ou turntablism'},
    {id:'mixxx', n:'Mixxx', tag:'Grátis e open source', who:'Quem quer aprender o ofício antes de gastar em hardware'}
  ]});
SYS.track('M27', 'dj', {
  rekordbox:{st:['Desligar Sync e Quantize e esconder o BPM no treino','Faixa do pitch (±6/±10/±16) e o que ela muda na precisão','Beatgrid: corrigir à mão quando a análise erra','Cue no primeiro kick e pendrive testado num CDJ antes do dia']},
  serato:{st:['Desligar Sync e esconder a forma de onda colorida no treino','Faixa do pitch e jog para empurrar e segurar','Beatgrid e marcação do tempo forte','Vinil de timecode (DVS): beatmatch em toca-discos — reconhecimento']},
  mixxx:{st:['Desligar Sync e Quantize; só o ouvido','Faixa do pitch e controles de nudge','Corrigir beatgrid e BPM detectado','Mapear a controladora que você tiver (ou teclado + mouse no começo)']}
});
SYS.track('M29', 'dj', {
  rekordbox:{st:['Playlists e intelligent playlists','My Tag e cores por energia e função','Backup da biblioteca e do banco do rekordbox','Histórico de sets para revisar a seleção']},
  serato:{st:['Crates, subcrates e smart crates','Comentários e cores por energia','Backup da pasta _Serato_','Histórico de sessões']},
  mixxx:{st:['Crates e playlists','Cores e comentários como tags','Backup do banco de dados do Mixxx','Histórico e tracklist exportada']}
});

/* ===== v7 · lacunas do Architect: tópicos e técnicas dos nós novos e ajustados ===== */
SYS.stAdd({
  A22:['Regra de dependência que vira teste automatizado (fitness function — ver A34b)'],
  A58:['Ordem parcial por chave (filial, agregado) e reprocessamento seguro'],
  A59:['RBAC × ABAC: papel fixo vs atributo (tenant, dono do recurso, plano, horário)','Autorização por recurso e por dono (resource-based)','Política externalizada (OPA/Rego, Cedar) e quando isso compensa'],
  A77:['Varredura de dependências e geração de SBOM no pipeline'],
  A78:['Fitness functions de arquitetura no pipeline: violação quebra o build'],
  A90:['Princípios de arquitetura: 5 a 10 frases que decidem no seu lugar','Cada princípio com razão, implicação e o que ele proíbe'],
  A91:['TCO de comprar × construir em 3 anos (licença, gente, migração, saída)']
});
SYS.tech({
  A04b:[['Utility tree (ATAM)','técnica'],['Cenário de atributo de qualidade','técnica'],['Attribute-Driven Design (ADD)','método'],['Matriz de conflito de requisitos','técnica'],['Matriz de rastreabilidade requisito → ADR','técnica'],['Quality Attribute Workshop (QAW)','método'],['ISO/IEC 25010','norma']],
  A34b:[['ArchUnit','ferramenta'],['ArchUnitNET','ferramenta'],['NetArchTest','ferramenta'],['dependency-cruiser','ferramenta'],['Deptrac (PHP — reconhecimento)','ferramenta'],['Fitness function atômica × holística','técnica'],['Teste de regra de camada no CI','técnica']],
  A54b:[['Chave de partição','técnica'],['Message sessions (Service Bus)','ferramenta'],['FIFO com message group id (SQS)','ferramenta'],['Número de sequência / versão de agregado','técnica'],['Buffer de reordenação','técnica'],['Diagnóstico de hot partition','técnica']],
  A62b:[['SBOM CycloneDX','norma'],['SPDX','norma'],['Dependabot','ferramenta'],['Renovate','ferramenta'],['OWASP Dependency-Check','ferramenta'],['Trivy','ferramenta'],['Syft / Grype','ferramenta'],['SLSA','norma'],['Sigstore / cosign','ferramenta'],['gitleaks','ferramenta'],['NIST SSDF (SP 800-218)','norma'],['dotnet list package --vulnerable','técnica']],
  A71b:[['Health endpoint monitoring','técnica'],['Desligamento gracioso e drenagem de conexão','técnica'],['Autoscaling por tamanho de fila','técnica'],['Azure Load Balancer / Application Gateway','ferramenta'],['AWS ALB / NLB','ferramenta'],['Sticky session','técnica'],['Instância mínima quente','técnica']],
  A73b:[['Landing zone (Cloud Adoption Framework)','método'],['Management groups','ferramenta'],['Azure Policy','ferramenta'],['AWS Organizations / SCP','ferramenta'],['Convenção de nomes e tags obrigatórias','técnica'],['Acesso just-in-time (PIM)','ferramenta'],['Controle de cotas e limites','técnica']],
  A87b:[['Modelo de TCO de 3 anos','técnica'],['Calculadora de TCO (Azure)','ferramenta'],['Forecasting (FinOps Framework)','método'],['Análise de cenários base / otimista / pessimista','técnica'],['Reservas e savings plans','técnica'],['Custo marginal por cliente','técnica'],['FOCUS (dados de custo)','norma']],
  T01:[['Lei de Conway','referência'],['Manobra inversa de Conway','técnica'],['Mapa de comunicação (quem fala com quem)','técnica'],['Custo de coordenação / handoff','técnica']],
  T02:[['Team Topologies','método'],['Medida de carga cognitiva de time','técnica'],['Modos de interação (colaboração, X-as-a-service, facilitação)','técnica'],['Value stream mapping','técnica'],['DORA (métricas de entrega)','referência']],
  T03:[['CODEOWNERS','ferramenta'],['Responsável único pela decisão (DRI)','técnica'],['Bus factor','técnica'],['Escala de plantão','técnica'],['Contrato de fronteira de módulo','técnica']],
  T04:[['C4 por plateia','notação'],['ADR','técnica'],['RFC interno','técnica'],['Estrutura problema → opções → recomendação','técnica'],['Risco em linguagem de dinheiro','técnica']],
  T05:[['Decisão reversível × irreversível','técnica'],['Matriz de opções (custo × prazo × risco)','técnica'],['Ata de decisão com dono e revisão','técnica'],['BATNA (negociação)','técnica']],
  A22:[['Teste de regra de dependência','técnica']],
  A58:[['Chave de ordem por filial','técnica']],
  A59:[['ABAC com condições no Azure RBAC','técnica'],['OPA / Rego','ferramenta'],['Cedar / AWS Verified Permissions','ferramenta'],['NIST SP 800-162 (ABAC)','norma']],
  A77:[['Geração de SBOM no CI','técnica'],['Varredura de CVE no pipeline','técnica']],
  A78:[['Fitness functions no pipeline','técnica']],
  A90:[['Princípios de arquitetura (nome, enunciado, razão, implicação)','técnica']],
  A91:[['Modelo de TCO comprar × construir','técnica']]
});

/* ===== v8 · Navigation · técnicas da vertente Tesouraria & Capital e acréscimos ===== */
SYS.stAdd({
  V05:['Risco de contraparte: quem precisa estar solvente para você receber','Risco de sequência: a ordem dos retornos muda o resultado com a mesma média'],
  V11:['Camadas com limite escrito: piso, reserva, failover, núcleo, satélites e mesa','Política de exclusão: o que nunca entra na carteira, por decisão sua'],
  V13:['Diferimento tributário como ferramenta (PGBL, VGBL e o nó C26)'],
  V19:['Curva de juros (DI futuro) e o que a inclinação sugere','Da Selic até o seu crédito: o caminho do spread'],
  V42:['Payoff: o desenho de lucro e perda antes de operar','Futuros, margem de garantia e ajuste diário','Hedge corporativo: por que empresa trava câmbio ou juro'],
  V43:['Look-ahead bias: usar informação que não existia naquele dia','Cherry-picking do período inicial','Mudança de regime: juro real de 12% e de 3% não são o mesmo mundo','Amostra pequena e a ilusão de significância','Benchmark adequado: comparar com o que você faria sem esforço','Custos e impostos dentro do backtest'],
  V47:['Camada acima da reserva: o Fundo de Failover (C15) substitui renda, não só gasto'],
  V50:['Rebalanceamento como fonte de retorno (bônus de diversificação)','Bandas de tolerância × calendário: custo e eficácia de cada um','Rebalancear por aporte novo para não gerar imposto']
});
SYS.tech({
  C01:[['Planilha dos quatro motores','técnica'],['Calculadora do Cidadão','ferramenta'],['Deflacionar série (juro real)','técnica'],['Séries SGS do Banco Central','ferramenta']],
  C02:[['Classificação de aposta (prêmio, soma zero, negativa)','técnica'],['Prêmio de risco','referência'],['Falsificador de tese','técnica']],
  C03:[['Ficha de Skill ROI','técnica'],['Valor esperado','técnica'],['Gatilho de patrimônio e de exposição','técnica']],
  C04:[['Conta remunerada e CDB de liquidez diária','ferramenta'],['Tesouro Selic','ferramenta'],['Rendimento líquido (IR, IOF e taxa)','técnica'],['Separação de caixa por função','técnica']],
  C05:[['Escada de vencimentos (laddering)','técnica'],['Casamento de ativo e passivo','técnica'],['Marcação a mercado','técnica']],
  C06:[['Política de caixa mínimo','técnica'],['Limite do FGC por instituição','norma'],['Redundância bancária','técnica']],
  C07:[['Projeção de caixa de 13 semanas','técnica'],['Análise de cenários base e pessimista','técnica'],['Erro de previsão (previsto × realizado)','técnica']],
  C08:[['Tabela regressiva de IR','norma'],['IOF de 30 dias','norma'],['Come-cotas','norma'],['Bruto equivalente (isento × tributado)','técnica']],
  C09:[['Auditoria anual de tarifas','técnica'],['Custo total da carteira','técnica'],['Spread de câmbio e IOF','técnica']],
  C10:[['Curva DI futuro','ferramenta'],['Decomposição do spread bancário','técnica'],['Juro real ex-ante','técnica']],
  C11:[['Custo Efetivo Total (CET)','norma'],['Taxa equivalente mensal e anual','técnica'],['Custo de antecipação de recebíveis','técnica']],
  C12:[['Aplicação caucionada','técnica'],['Alienação fiduciária','norma'],['Aval e fiança','norma'],['Perda esperada do credor','técnica']],
  C13:[['Desconto à vista em taxa equivalente','técnica'],['Valor do dinheiro no tempo','técnica'],['Ciclo financeiro','técnica']],
  C14:[['Spread do ativo','técnica'],['Serviço da dívida sobre geração de caixa','técnica'],['Portabilidade de crédito','norma'],['Avalanche × bola de neve','técnica']],
  C15:[['RTO e RPO financeiro','técnica'],['Drill de restauração de renda','técnica'],['Linha pré-aprovada como extintor','técnica'],['Ordem de saque em crise','técnica']],
  C16:[['Mapa de contraparte','técnica'],['Segregação patrimonial e custódia','norma'],['Simulação de ordem de retornos','técnica']],
  C17:[['Autenticador TOTP','ferramenta'],['Mecanismo Especial de Devolução (MED)','norma'],['Envelope de emergência','técnica'],['Limite por dispositivo e por transação','técnica']],
  C18:[['Matriz reter, reduzir ou transferir','técnica'],['Seguro de responsabilidade civil profissional','ferramenta'],['Seguro de pessoa-chave','ferramenta'],['Leitura de apólice (franquia e exclusão)','técnica']],
  C19:[['Estrutura núcleo-satélite','técnica'],['Limite por camada','técnica'],['Regra de distribuição do aporte','técnica']],
  C20:[['Ficha de tese de 6 campos','técnica'],['Matriz de correlação de temas','técnica'],['Teto por tema','técnica'],['Revisão anual de tese','técnica']],
  C21:[['Fatores: valor, tamanho, qualidade e momento','referência'],['Prêmio de prazo, crédito e iliquidez','referência'],['Decomposição de retorno','técnica']],
  C22:[['Exposição cambial do patrimônio','técnica'],['BDR e ETF de índice global','ferramenta'],['Declaração de capitais no exterior (CBE)','norma'],['Hedge cambial simples','técnica']],
  C23:[['Escolha de veículo por custo total','técnica'],['Rebalanceamento por aporte','técnica'],['Compensação de prejuízo','norma'],['Ordem fiscal de aporte','técnica']],
  C24:[['Walk-forward','técnica'],['Teste fora da amostra','técnica'],['Benchmark adequado','técnica'],['Custos e slippage no backtest','técnica'],['Detecção de overfitting','técnica']],
  C25:[['Bandas de tolerância','técnica'],['Rebalanceamento por calendário','técnica'],['Bônus de diversificação','referência'],['Log de rebalanceamento','técnica']],
  C26:[['Dedução de 12% no PGBL','norma'],['Tabela regressiva de previdência','norma'],['Portabilidade de previdência','norma'],['Taxa de carregamento','técnica']],
  C27:[['CPR (Cédula de Produto Rural)','norma'],['Fiagro','ferramenta'],['CRA','ferramenta'],['Análise de originador','técnica'],['Barter no agro','técnica']],
  C28:[['Cascata de subordinação','técnica'],['Sobrecolateralização','técnica'],['Inadimplência defasada','técnica'],['Leitura de regulamento de FIDC','técnica'],['Covenant','norma']],
  C29:[['Cessão de crédito','norma'],['Fila cronológica de precatório','norma'],['Memorando de risco jurídico','técnica'],['Retorno anualizado sobre prazo incerto','técnica']],
  C30:[['Cap rate','técnica'],['Custo total de propriedade do imóvel','técnica'],['Análise de vacância','técnica'],['Pesquisa de preço de escritura','técnica'],['Fluxo de pedestre e vantagem local','técnica']],
  C31:[['Valor patrimonial por cota','técnica'],['Relatório gerencial de FII','referência'],['Yield on cost','técnica']],
  C32:[['Checklist de due diligence','técnica'],['Mapa de quem ganha na originação','técnica'],['Investidor qualificado e profissional','norma'],['Limite de alocação em alternativos','técnica']],
  C33:[['API do SGS (Banco Central)','ferramenta'],['Tesouro Transparente','ferramenta'],['Dados abertos da CVM','ferramenta'],['SIDRA (IBGE)','ferramenta'],['Log de decisão','técnica'],['Painel de métricas derivadas','técnica'],['pandas (opcional)','ferramenta']],
  C34:[['Carta ao cotista','técnica'],['IPS (Investment Policy Statement)','técnica'],['Atribuição de resultado','técnica']],
  C35:[['Taxa-base (base rate)','técnica'],['Custo por operação','técnica'],['IR de day trade e DARF','norma'],['Expectativa matemática','técnica']],
  C36:[['Capital segregado','técnica'],['Teto por operação','técnica'],['Kill switch','técnica'],['Saída definida antes da entrada','técnica']],
  C37:[['Diário de operações','técnica'],['Detecção de tilt','técnica'],['Falácia do jogador','referência'],['Revisão processo × resultado','técnica']],
  C38:[['Relatório de encerramento','técnica'],['Resultado líquido de custos e imposto','técnica']],
  V05:[['Mapa de contraparte','técnica'],['Risco de sequência','técnica']],
  V11:[['Limite por camada','técnica'],['Política de exclusão','técnica']],
  V13:[['Tabela regressiva de previdência','norma']],
  V19:[['Curva DI futuro','ferramenta']],
  V42:[['Payoff diagram','notação'],['Margem de garantia','norma'],['Hedge cambial','técnica']],
  V43:[['Walk-forward','técnica'],['Teste fora da amostra','técnica'],['Benchmark adequado','técnica']],
  V47:[['RTO e RPO financeiro','técnica']],
  V50:[['Bandas de tolerância','técnica'],['Rebalanceamento por aporte','técnica']]
});

/* ===== v9 · gatilhos "não antes de" nos nós avançados ===== */
SYS.nb({
  C21:'Vale quando já existe núcleo montado. Com carteira pequena, o ganho de fator é menor que o custo de aprender e de implementar.',
  C22:'Vale a partir do momento em que existe patrimônio investido além da reserva — antes disso, dolarizar é só custo de câmbio.',
  C24:'Vale quando existe uma estratégia real para testar. Backtest de ideia solta é entretenimento com planilha.',
  C26:'Só compensa declarando no modelo completo e com renda tributável suficiente para usar a dedução.',
  C27:'Porta regulada primeiro (Fiagro, CRA em fundo). Operação direta de CPR pede volume, jurídico e estômago para iliquidez.',
  C28:'Comece por fundo de crédito auditado. Operação direta (CCB, nota comercial) costuma exigir investidor qualificado.',
  C29:'Não antes de ter advogado especializado no time e dinheiro que pode esperar anos sem mudar tua vida.',
  C30:'Não antes de existir entrada sem tocar na reserva e sem comprometer o caixa mínimo da empresa.',
  C32:'Regra de tamanho antes de olhar taxa: alternativo é fatia pequena do patrimônio, definida na IPS.',
  C35:'Só com capital segregado que pode zerar sem mudar nada na tua vida — e nunca com dinheiro de reserva ou de imposto.',
  C36:'Só depois de C35: sem entender a expectativa negativa, regra vira decoração.',
  V42:'Reconhecimento agora; operar opção só com exposição real para proteger ou capital de mesa.',
  V43:'Vale mais depois de C19 e C20: sem carteira definida, backtest não tem o que testar.',
  A87b:'Vale quando existe conta de nuvem de verdade rodando — TCO de sistema imaginário é ficção contábil.'
});

/* ===== v10 · técnicas da leitura profunda, carteira de RV e debêntures ===== */
SYS.stAdd({
  V08:['Fundo ativo × ETF: taxa, persistência e viés de sobrevivência (V69)'],
  V31:['Fracionário × lote padrão: spread e custo diferentes','Leilão de abertura e de fechamento (detalhado em V67)'],
  V34:['Indicador não serve para todo setor: banco, seguradora e concessão têm régua própria (V61 e V62)'],
  V39:['FFO, cap rate implícito e alavancagem entram em V68','Emissões, custo de captação e diluição do cotista'],
  V49:['Debênture por dentro: escritura, garantias e agente fiduciário (V49b)','Variantes e securitização: incentivada, CRI, CRA, LF e nota comercial (V49c)']
});
SYS.tech({
  V60:[['Qualidade do lucro (lucro × caixa)','técnica'],['Análise de itens não recorrentes','técnica'],['Leitura de notas explicativas','técnica'],['Mapa de partes relacionadas','técnica'],['Modelo de red flags (Schilit)','referência'],['DFP e ITR na CVM','ferramenta']],
  V61:[['Margem financeira líquida','técnica'],['PDD e inadimplência de 90 dias','técnica'],['Índice de Basileia','norma'],['Índice combinado (seguros)','técnica'],['Análise de float','técnica']],
  V62:[['Base de ativos regulatória (RAB)','referência'],['Ciclo de revisão tarifária','norma'],['Curva de custo do produtor','técnica'],['Sensibilidade a preço de commodity','técnica'],['Casamento de moeda entre receita e dívida','técnica']],
  V63:[['Venda em mesma loja','técnica'],['Margem × giro','técnica'],['Retenção líquida de receita','técnica'],['CAC e payback','técnica'],['GMV × receita líquida','técnica']],
  V64:[['Metodologia de índice','referência'],['Free float ajustado','técnica'],['Rebalanceamento de carteira teórica','técnica'],['IMA-B e IRF-M','referência'],['Tracking difference','técnica']],
  V71:[['Matriz setor × choque macro','técnica'],['Sensibilidade de múltiplo a juro real','técnica'],['Análise de repasse de preço','técnica'],['Séries do Banco Central','ferramenta']],
  V65:[['Dimensionamento por risco','técnica'],['Limite por ativo, setor e fator','técnica'],['Fração de Kelly (reconhecimento)','referência'],['Regra de aparar posição','técnica'],['Protocolo de tese quebrada','técnica']],
  V66:[['Volume médio diário (ADTV)','técnica'],['Participação no volume','técnica'],['Impacto de mercado','técnica'],['Capacidade de estratégia','técnica']],
  V67:[['Ordem limitada e a mercado','técnica'],['Leilão de abertura e fechamento','técnica'],['Ordem stop e risco de gap','técnica'],['Cálculo de preço médio e custos','técnica'],['Medição de slippage','técnica']],
  V68:[['FFO por cota','técnica'],['Cap rate implícito','técnica'],['LTV de fundo de papel','técnica'],['Laudo de avaliação','referência'],['Contrato típico × atípico','norma'],['Vacância física × financeira','técnica']],
  V69:[['Tracking difference × tracking error','técnica'],['Marca d’água em taxa de performance','norma'],['Viés de sobrevivência em rankings','técnica'],['Custo total de propriedade da carteira','técnica']],
  V72:[['Calendário de proventos','técnica'],['Data com e data ex','norma'],['Yield on cost','técnica'],['Cobertura do custo fixo por renda passiva','técnica'],['Análise de sustentabilidade de payout','técnica']],
  V70:[['Ata de comitê','técnica'],['Ficha de tese','técnica'],['Defesa de sizing','técnica']],
  V49b:[['Leitura de escritura de emissão','técnica'],['Covenant e vencimento antecipado','norma'],['Ordem de preferência de garantias','norma'],['Agente fiduciário','referência'],['Rating de crédito','referência']],
  V49c:[['Lei 12.431 (debênture incentivada)','norma'],['Securitização (CRI e CRA)','norma'],['Letra financeira','norma'],['Nota comercial','norma'],['Bruto equivalente entre isento e tributado','técnica'],['Marcação no secundário','técnica']],
  V31:[['Ordem fracionária','técnica']],
  V39:[['Relatório gerencial de FII','referência']]
});
SYS.nb({
  V60:'Vale quando já existe uma empresa real na watchlist para dissecar — forense sem alvo é leitura de romance policial.',
  V66:'Fica crítico a partir do momento em que uma ordem tua passa de uma fatia pequena do volume diário do ativo.',
  V69:'Vale antes de contratar qualquer fundo: a conta precisa existir antes da reunião com o assessor.',
  V70:'Não antes de ter três teses escritas e a IPS v2 com limites — comitê sem regra é conversa de bar.'
});

/* =====================================================================
   v11 · MIND · HOBBY: escolhas de trilha, técnicas e gatilhos
   ===================================================================== */

/* ---------- MIND · competitivo da temporada · 3 trilhas com capítulos próprios ---------- */
SYS.choice({key:'jogo', way:'mind', n:'Competitivo da temporada', q:'TFT, Honor of Kings ou ARPG de temporada (Diablo 4 / Path of Exile 2)?',
  why:'A base do arco é a mesma nos três — alvo por sessão, revisão de replay, gestão de tilt, regra de parada. Daí para frente os capítulos mudam de nome e de conteúdo, porque masterizar cada um exige coisas diferentes. TFT é decisão econômica em turno: juro, odds, pool e posicionamento, 35 minutos de partida e resultado 100% seu. Honor of Kings é tempo real no celular: mecânica, macro, teamfight, 12 a 18 minutos e quatro estranhos no seu time. ARPG de temporada é projeto de personagem: build, afixos, escalonamento multiplicativo, camadas de defesa, endgame em camadas e economia de liga — você joga sozinho, no seu ritmo, contra uma planilha. Os três treinam músculos diferentes e nenhum deles consolida se você dividir o tempo. Escolha uma trilha: os capítulos passam a ser os daquele jogo e o progresso de cada trilha fica salvo separado, então trocar depois não apaga nada.',
  opts:[
    {id:'tft', n:'TFT', tag:'Autobattler: juro, odds, pool, posicionamento e pivot', who:'Quem tem 35 minutos inteiros e quer o resultado 100% próprio, sem exigência mecânica'},
    {id:'hok', n:'Honor of Kings', tag:'MOBA móvel 5v5: mecânica, macro e teamfight', who:'Quem quer partida curta, jogo social e aguenta variância de time'},
    {id:'arpg', n:'Diablo 4 / Path of Exile 2', tag:'ARPG de temporada: build, itemização, endgame e economia', who:'Quem quer construir personagem como projeto e jogar no próprio ritmo'}
  ]});

SYS.track('G06', 'jogo', {
  tft:{t:'Anatomia do autobattler: colocação, vida e pool', s:'Oito pessoas disputando um estoque finito de peças. Quem entende isso para de jogar “a comp que eu gosto”.',
    st:['Oito jogadores, colocação de 1º a 8º: subir depende de colocação média, não de vitória','Top 4 é o divisor real — segundo lugar consistente sobe mais que primeiro esporádico','Vida como recurso: o dano por rodada cresce, então perder cedo é barato e perder tarde é fatal','Pool compartilhado entre os oito: o que os outros pegaram muda as suas chances','Chance por custo muda com o nível do banco — a tabela é publicada e se decora','Combate é automático: tudo é decidido antes, em compra, nível e posicionamento','Estágios: onde a partida é realmente decidida e onde nada importa','Modos: ranqueado, Hyper Roll e duplas — só o ranqueado mede'],
    q:'Escreva a ficha do autobattler: o que a colocação mede, como o pool funciona, a tabela de chance por nível e os estágios em que a partida é decidida.',
    dv:'Ficha de anatomia do autobattler', g:'Explica por que colocação média manda e como o pool dos outros muda as suas chances.',
    f:'Jogar sempre a mesma comp; achar que um primeiro lugar esporádico vale mais que top 4 constante.',
    tk:[['Tabela de chance por nível','referência'],['Scouting de tabuleiro adversário','técnica'],['Colocação média','notação']]},
  hok:{t:'Anatomia do MOBA móvel: rotas, objetivos e papéis', s:'Doze a dezoito minutos, cinco pessoas, um mapa que decide tudo. Abate não é condição de vitória.',
    st:['Rotas, selva, torres e objetivos neutros: o mapa é a condição de vitória, não o abate','Ouro e experiência como recursos: farm, negação de farm e prioridade de rota','Papel e pool de heróis: reduzir o pool aumenta a taxa de execução correta','Visão como informação comprada: onde colocar e o que isso revela do adversário','Ban e pick: parte da partida é decidida antes de começar','Controle por toque: o que o celular limita e o que ele acelera','Variância de time: a sua vitória depende de quatro pessoas — daí a métrica de processo','Encerrar a partida × alongar: o erro mais comum de quem está ganhando'],
    q:'Escreva a ficha do MOBA: condição de vitória real, ordem de prioridade dos objetivos, o que cada papel deve estar fazendo por minuto e o seu pool de heróis.',
    dv:'Ficha de anatomia do MOBA', g:'Sabe dizer, por minuto de partida, qual é o objetivo certo e o que o seu papel deveria estar fazendo.',
    f:'Caçar abate e perder torre; aprender pela tier list sem entender prioridade de objetivo.',
    tk:[['Gestão de onda (wave management)','técnica'],['Controle de visão','técnica'],['Prioridade de objetivo','método']]},
  arpg:{t:'Anatomia do ARPG de temporada: campanha, endgame e liga', s:'A campanha é o tutorial. O jogo começa quando ela acaba — e recomeça toda temporada.',
    st:['Campanha como tutorial longo: ela não é o jogo, e tratá-la como jogo é o erro nº 1 do gênero','Endgame em camadas: dificuldade escalonada com recompensa escalonada (os nomes mudam entre Diablo e Path of Exile; a estrutura não)','Temporada / liga: reset periódico com mecânica nova — todo mundo volta ao zero junto','O personagem é o projeto, não a conta: o que você constrói é a build, não o tempo jogado','Poder vem de item e de árvore passiva, muito mais que de nível','Densidade de monstro como recurso: mais inimigos por minuto é mais de tudo','Custo da morte: o gênero cobra progresso, não só tempo — por isso não morrer é estratégia',' O que o jogo realmente mede: camada limpa com consistência, não camada tocada uma vez','Sazonal × eterno: o que some no reset e o que fica'],
    q:'Escreva a ficha do ARPG: as camadas de endgame em ordem, o que cada uma exige, o que a morte custa e o que o reset de temporada apaga.',
    dv:'Ficha de anatomia do ARPG', g:'Sabe mapear as camadas do endgame e dizer o que separa cada uma da seguinte.',
    f:'Achar que zerar a campanha é zerar o jogo; medir progresso por nível em vez de por camada limpa.',
    tk:[['Camadas de endgame','referência'],['Densidade de monstro','notação'],['Ciclo de liga/temporada','método']]}
});

SYS.track('G07', 'jogo', {
  tft:{t:'Ouro, juro e a rodada certa de gastar', s:'O jogo paga juro para quem sabe esperar e cobra vida de quem espera demais.',
    st:['Juro sobre ouro guardado por faixa, até um teto: guardar literalmente rende','O trade central: gastar agora para não tomar dano × guardar para chegar mais forte depois','Vida gasta de propósito é investimento, e existe um piso abaixo do qual não dá mais','Nível do banco × ouro: subir nível é comprar acesso a unidade melhor, e tem hora certa','Ponto de conversão: quando parar de economizar e gastar tudo de uma vez','Pivot: abandonar a composição que deixou de pagar, e o custo de pivotar tarde','Curva de economia por estágio: como a rodada ideal muda conforme a vida cai'],
    q:'Anote, em vinte partidas, a decisão de economia mais importante de cada uma e se ela foi certa. Depois escreva a sua regra de bolso de quando guardar e quando converter.',
    dv:'Vinte decisões de economia anotadas', g:'Tem regra escrita de quando guardar e quando converter, tirada dos seus próprios dados.',
    f:'Guardar ouro até perder de vida; gastar tudo no estágio errado e ficar sem economia.',
    tk:[['Curva de economia por rodada','método'],['Critério escrito de pivot','método']]},
  hok:{t:'Ouro, experiência e tempo de mapa', s:'O recurso mais escasso do MOBA não é ouro. É onde você está a cada segundo.',
    st:['Tempo de mapa é o recurso escasso: cada segundo num lugar é um não gasto em outro','Ouro e experiência: farm, negação e a diferença entre estar rico e estar forte','Tempo relativo: estar na frente da curva de itens vale mais que força absoluta','Rotação e timing: chegar antes é quase todo o jogo em nível médio','Ponto de conversão: quando parar de farmar e começar a forçar objetivo','Recall e janela de vantagem: o momento em que a vantagem existe e depois evapora','Custo afundado dentro da partida: abandonar a rota perdida em vez de alimentá-la'],
    q:'Anote, em vinte partidas, a decisão de rotação mais importante de cada uma e se ela foi certa. Depois escreva a sua regra de quando sair da rota.',
    dv:'Vinte decisões de rotação anotadas', g:'Tem regra escrita de quando abandonar farm por objetivo, tirada dos seus próprios registros.',
    f:'Farmar até a partida acabar em outro lugar; rotacionar toda hora e nunca completar nada.',
    tk:[['Timing de rotação','técnica'],['Janela de vantagem de itens','método']]},
  arpg:{t:'Tempo por hora: densidade, ritmo e o que é farm de verdade', s:'“Farmei a tarde inteira” não é métrica. Itens por hora é.',
    st:['Experiência por hora e itens por hora: as duas métricas que transformam farm em trabalho medido','Densidade de monstro costuma valer mais que qualidade de monstro — conte inimigos, não raridade','Tempo morto é o maior ralo: viagem, menu, recarregar mapa, organizar inventário','Velocidade de movimento é estatística de farm, não conforto','Escolher a atividade pelo recurso que falta, não pela que é mais divertida naquele dia','Ponto de conversão: quando parar de farmar insumo e transformar em poder','Custo de oportunidade de rota: a atividade que você escolheu é outra que você deixou','Sessão curta × sessão longa: o que rende em vinte minutos e o que só rende em duas horas'],
    q:'Meça experiência por hora e itens por hora em três atividades diferentes do endgame, com cronômetro, e escreva qual paga o quê.',
    dv:'Medição comparada de três atividades', g:'Sabe, com número próprio, qual atividade paga qual recurso e quanto tempo morto você tem por sessão.',
    f:'Chamar de farm qualquer tempo jogado; repetir a atividade preferida ignorando o que ela não paga.',
    tk:[['Experiência por hora (XP/h)','notação'],['Tempo morto por sessão','método'],['Quantidade de item encontrado','notação']]}
});

SYS.track('G21', 'jogo', {
  tft:{t:'Comps, componentes e o carry certo', s:'Item no carry errado é a derrota mais silenciosa do jogo.',
    st:['Componentes e combinação: o que dá para montar com o que caiu, e o que nunca vale forçar','Emblema e flexibilidade: a peça que abre composição que não estava no plano','Traços e limiares: o número que liga o bônus, e o custo de ficar um abaixo dele','Carry principal × secundário: quem recebe item primeiro e por quê','Itens defensivos no alvo certo: dano no carry só existe se ele sobreviver','Itens invertidos: reconhecer cedo e o custo real de corrigir','Comp flexível × comp forçada: quando insistir é teimosia e quando é leitura','Itemizar cedo × esperar o item ideal: perder vida esperando perfeição é o erro caro'],
    q:'Escolha duas composições flexíveis, escreva a ordem de itemização de cada uma e teste em vinte partidas anotando quando você itemizou errado.',
    dv:'Ficha de itemização de duas comps', g:'Tem ordem de itemização escrita por comp e sabe reconhecer itemização errada ainda a tempo.',
    f:'Guardar componente esperando o item perfeito; dar item ao carry que não vai chegar no fim.',
    tk:[['Ordem de itemização','método'],['Limiar de traço','notação'],['Itemização defensiva do carry','técnica']]},
  hok:{t:'Build de itens, emblemas e ordem de habilidade', s:'Build copiada de guia contra uma composição diferente já começa errada.',
    st:['Itens núcleo × itens situacionais: o que é sempre e o que responde ao inimigo','Adaptar ao adversário: defesa mágica, defesa física, redução de cura, quebra de escudo','Emblema e runa por papel: a escolha que quase ninguém revisa depois de configurar uma vez','Ordem de habilidade e picos de poder: o minuto em que você fica forte de verdade','Timing de item: comprar o item certo tarde é quase o mesmo que não comprar','Penetração × dano bruto: quando cada uma paga mais','Itens de utilidade e o que o time já tem: build é decisão coletiva','Testar a build no treino antes de levar para o ranqueado'],
    q:'Monte a build núcleo de dois heróis do seu pool, liste os itens situacionais com o gatilho de cada um e valide em vinte partidas.',
    dv:'Ficha de build de dois heróis com gatilhos', g:'Cada item situacional tem gatilho escrito, e você adapta a build sem consultar guia.',
    f:'Comprar sempre a mesma sequência; ignorar cura e escudo do time inimigo até ser tarde.',
    tk:[['Item situacional com gatilho','método'],['Pico de poder por nível','notação'],['Ordem de habilidade','método']]},
  arpg:{t:'Afixos, escalonamento e as camadas de defesa', s:'ARPG é um jogo de planilha com gráfico bonito. A planilha é a build — e ela não perdoa achismo.',
    st:['Afixos e níveis de afixo: onde o poder realmente mora no item','Aditivo × multiplicativo: o erro número um do gênero, e a conta que prova','Fonte de dano × multiplicador de dano: identificar o motor da sua build','Camadas de defesa: mitigação, resistência, evasão, bloqueio, recuperação e vida efetiva','Ponto de corte: o valor a partir do qual investir mais não muda nada (resistência é o exemplo clássico)','Gargalo móvel: a estatística que, dobrada agora, dobra o resultado — e que muda conforme você investe','Planejador de build como calculadora antes de gastar, não como receita para copiar','Crafting como investimento: custo por tentativa e valor esperado antes de apertar o botão','Build de início de liga precisa ser robusta e barata; a build dos sonhos vem depois','Copiar build é começo legítimo — parar aí é o teto'],
    q:'Escolha uma build, escreva a tese dela em três linhas (motor, multiplicador, gargalo), simule no planejador, execute e ajuste uma variável por vez medindo o efeito.',
    dv:'Ficha de build com tese e simulação', g:'Explica de onde vem cada multiplicador da sua build, qual é o gargalo atual e quais camadas de defesa te seguram.',
    f:'Empilhar aditivo achando que dobra; deixar defesa para depois; copiar guia sem saber qual peça é o motor.',
    tk:[['Path of Building','ferramenta'],['Planejador de build (Maxroll, Mobalytics)','ferramenta'],['Vida efetiva (EHP)','notação'],['Ponto de corte de resistência','notação'],['Aditivo × multiplicativo','notação']]}
});

SYS.track('G08', 'jogo', {
  tft:{t:'Odds, pool e o custo de rolar', s:'O jogo publica as chances. Quem não decora joga contra a matemática achando que é azar.',
    st:['Chance publicada por nível e por custo: a base de todo cálculo de valor esperado','Quantas rolagens em média até achar a unidade que falta, e quanto isso custa em ouro','Contagem de pool: quantas cópias existem e quantas já saíram no lobby','Rolar × subir de nível: dois caminhos com valor esperado diferente na mesma rodada','Por que “rolei trinta e não saiu” é matematicamente esperado, não azar pessoal','Plano B antes de rolar: qual composição você aceita se a unidade não vier','Orçamento de rolagem escrito antes de começar a rodada'],
    q:'Calcule o valor esperado das três decisões de rolagem mais frequentes da sua comp e teste em trinta partidas, registrando decisão e resultado separados.',
    dv:'Planilha de valor esperado de rolagem', g:'Justifica as três decisões por valor esperado e não muda a regra por causa de uma sequência ruim.',
    f:'Rolar até acabar o ouro sem plano B; culpar a sorte de uma amostra de dez partidas.',
    tk:[['Cálculo de rolagem esperada','método'],['Contagem de pool no lobby','técnica']]},
  hok:{t:'Taxa de vitória, amostra e a aposta de forçar luta', s:'Vinte partidas não dizem nada sobre você. Dizem bastante sobre a sua paciência.',
    st:['Taxa de vitória por herói e por confronto: o que é sinal e o que é amostra pequena','Quantas partidas para a sua taxa significar algo — bem mais do que parece','Percentual de vitória após pegar o objetivo grande: o número que justifica forçar','Decisão sob informação parcial: forçar luta sem visão é aposta com odds calculáveis','Falácia do apostador em fila: “perdi cinco, agora vem uma fácil” não existe','Plano B: a jogada que sobrevive à luta dar errado','Registrar decisão e resultado separados para julgar processo sem contaminar com sorte'],
    q:'Escolha as três decisões de risco mais frequentes do seu papel, estime o valor esperado de cada uma e teste em trinta partidas registrando decisão e resultado separados.',
    dv:'Planilha de risco por decisão', g:'Sabe justificar cada decisão de risco por probabilidade e não abandona a regra depois de duas derrotas.',
    f:'Mudar de herói toda derrota; tratar dez partidas como evidência.',
    tk:[['Leitura de taxa de vitória com senso crítico','método'],['Percentual de vitória pós-objetivo','referência']]},
  arpg:{t:'Drop, crafting e o valor esperado da tentativa', s:'Crafting é um caça-níquel que você mesmo opera. A diferença é que dá para calcular antes.',
    st:['Taxa de queda: o que o jogo publica, o que a comunidade mediu e o que ninguém sabe','Crafting como aposta com custo por tentativa: quanto custa em média chegar no resultado','A conta que decide tudo: custo médio de craftar × preço de comprar pronto','“Quase acertei” não existe: cada tentativa é independente da anterior','Piso de garantia e limite de tentativas, quando o jogo tem — e o que muda quando não tem','Amostra pequena: a sensação de azar é estatisticamente esperada e não é sinal','Orçamento de tentativa escrito antes de começar, e a regra de parar quando ele acaba','Quando comprar pronto é matematicamente melhor que insistir no craft'],
    q:'Escolha um item que você quer, calcule o custo esperado de craftá-lo, compare com o preço de comprar pronto, escreva o orçamento máximo e execute respeitando o limite.',
    dv:'Conta de craft × compra com orçamento escrito', g:'Tem a conta feita antes de gastar e respeitou o orçamento até o fim, inclusive quando não saiu.',
    f:'Craftar “só mais uma” até zerar a moeda; ignorar que comprar pronto costuma ser mais barato.',
    tk:[['Custo esperado de craft','método'],['Tabela de afixos e pesos','referência'],['Orçamento de tentativa','norma']]}
});

SYS.track('G09', 'jogo', {
  tft:{t:'Scout, contestação e posicionamento reativo', s:'Metade da informação do jogo está nos outros sete tabuleiros. Olhar custa segundos e paga partidas.',
    st:['Rotina de scout: quando olhar os outros sete e o que procurar em cada um','Contestação: dois querendo a mesma unidade num pool finito, e quem deve desistir','Posicionamento como leitura: ajustar o tabuleiro contra o adversário específico da rodada','Ordem de confronto: prever quem você enfrenta e preparar para aquele tabuleiro','Ler o vencedor do lobby cedo e decidir se compete ou se garante o segundo lugar','Ler quem está morrendo: o pool deles volta e muda as suas chances'],
    q:'Em vinte partidas, anote uma leitura de scout por partida, a decisão que ela mudou e se você acertou.',
    dv:'Vinte leituras de scout anotadas', g:'Tem taxa de acerto medida das suas leituras e sabe em que estágio elas falham.',
    f:'Jogar olhando só o próprio tabuleiro; contestar uma comp que já está três níveis à frente.',
    tk:[['Rotina de scout por estágio','método'],['Posicionamento reativo','técnica']]},
  hok:{t:'Leitura de mapa, cooldown e ausência', s:'O que o adversário não fez diz mais que o que ele fez.',
    st:['Leitura de mapa: o que a ausência do adversário no mostrador significa','Rastrear cooldown da habilidade decisiva e da habilidade de invocador','Nível de jogo do adversário: contra quem não tem plano, a leitura é outra','Ler intenção por padrão de movimento e por composição escolhida','Comunicar informação para o time sem comandar as pessoas','Sinal × ruído: a maioria das jogadas do adversário não tem intenção nenhuma'],
    q:'Em vinte partidas, anote uma leitura por partida, a decisão que ela mudou e se você acertou.',
    dv:'Vinte leituras de mapa anotadas', g:'Tem taxa de acerto medida e sabe em que situação a sua leitura falha.',
    f:'Superinterpretar jogada aleatória; jogar sem nunca olhar o mostrador.',
    tk:[['Rastreamento de cooldown','técnica'],['Leitura de mapa por ausência','técnica']]},
  arpg:{t:'Leitura de encontro: afixo, telegrafia e o que te matou', s:'Aqui o oponente é o encontro. Ele avisa antes de matar — você é que não estava lendo.',
    st:['Afixos de monstro e de mapa: quais são perigosos para a sua build especificamente','Regra escrita do que você simplesmente não joga: nem todo mapa vale o risco','Telegrafia: o aviso visual e sonoro antes do golpe, e treinar o olho para ele','Morte por acúmulo × morte por um golpe: diagnósticos opostos e correções opostas','Recapitulação de morte e registro: o que te matou, com que dano, em que situação','Densidade × perigo: a troca central do farm em endgame','Quando o problema é build e quando é execução — e como separar os dois','Chefe × limpeza de mapa: exigem leituras completamente diferentes'],
    q:'Registre as suas vinte últimas mortes com causa, tipo (acúmulo ou golpe único) e correção aplicada. Depois escreva a sua regra do que você não joga.',
    dv:'Registro de vinte mortes + regra do que não jogar', g:'Sabe separar morte por build de morte por execução e tem regra escrita de afixo proibido.',
    f:'Morrer sem olhar a causa; culpar a build quando o problema era não usar a defensiva.',
    tk:[['Recapitulação de morte','ferramenta'],['Afixo proibido','norma'],['Telegrafia de ataque','notação']]}
});

SYS.track('G22', 'jogo', {
  tft:{t:'Posicionamento e as rodadas que decidem', s:'O combate é automático. A sua jogada inteira acontece antes dele começar.',
    st:['Posicionamento por ameaça: contra quem você está posicionando nesta rodada','Canto, linha de frente e espalhar contra dano em área: as três formas básicas','Ajustar o tabuleiro contra o adversário específico, toda rodada, sem exceção','Ordem de alvo e alcance: quem o inimigo vai atacar primeiro e como enganar isso','Estabilizar × ir para o tudo ou nada: a decisão de vida que define a colocação','As rodadas em que a colocação é realmente decidida — e as que não importam','Rotina fixa antes do combate: conferir tabuleiro, itens e posição, sempre na mesma ordem'],
    q:'Escreva a sua rotina pré-combate em três passos, aplique em todas as rodadas por dez partidas e meça quantas vezes você esqueceu.',
    dv:'Rotina pré-combate + medição', g:'A rotina está escrita, é cumprida quase sempre, e você reposiciona contra o adversário da rodada.',
    f:'Posicionar uma vez e deixar a partida inteira; esquecer de conferir antes do combate quando está nervoso.',
    tk:[['Rotina pré-combate','método'],['Posicionamento anti-área','técnica']]},
  hok:{t:'Teamfight, foco e o momento de engajar', s:'Luta boa é ganha antes de começar, no posicionamento e no motivo de estar ali.',
    st:['Ordem de foco: quem você consegue matar de verdade, não quem você quer matar','Iniciar × responder: qual dos dois o seu herói faz, e o custo de confundir','Posicionamento antes da luta: onde você está quando ela começa decide metade','Guardar a habilidade decisiva em vez de gastar na primeira oportunidade','Desengajar sem virar derrota: a habilidade mais rara do elo médio','Luta por objetivo × luta sem motivo: só a primeira vale o risco','Comunicar sem comandar e a decisão default quando o time vai sem você'],
    q:'Escreva a sua sequência de teamfight e os três gatilhos de exceção, revise dez lutas no replay e meça quantas você executou como escreveu.',
    dv:'Sequência de teamfight + revisão de dez lutas', g:'Executa a sequência escrita na maioria das lutas e sabe nomear por que falhou nas outras.',
    f:'Entrar primeiro sempre; gastar a habilidade decisiva na linha de frente inimiga.',
    tk:[['Ordem de foco','método'],['Desengajar','técnica']]},
  arpg:{t:'Rotação, mobilidade e a regra de não morrer', s:'Em endgame, morrer custa progresso. Executar bem é economia, não estilo.',
    st:['Rotação de habilidades: a ordem fixa de aplicar debuff, dano e limpeza','Mobilidade como defesa, não como deslocamento: sair é uma jogada, não desistência','Defensivas ativas usadas antes de precisar — o hábito que separa quem sobrevive','Gestão de recurso em luta longa: acabar mana no chefe é derrota por planejamento','Regra escrita de recuo: em que situação você sai do pacote, sem pensar','Chefe × limpeza de mapa: sequências diferentes, treinadas separadamente','Automatizar a sequência até a mão fazer sozinha, para a cabeça olhar o perigo','Medir execução: mortes por hora e tempo médio de mapa, não sensação'],
    q:'Escreva a sua sequência de rotação e a regra de recuo, ensaie em conteúdo abaixo do seu nível e meça mortes por hora antes e depois.',
    dv:'Cartilha de rotação + mortes por hora medidas', g:'A sequência e a regra de recuo estão escritas e as mortes por hora caíram de forma medida.',
    f:'Guardar a defensiva para “quando precisar”; improvisar a rotação em cada luta.',
    tk:[['Rotação de habilidades','método'],['Regra de recuo','norma'],['Mortes por hora','notação']]}
});

SYS.track('G10', 'jogo', {
  tft:{t:'Set, patch e o que sobrevive ao reset', s:'Todo set recomeça do zero. É presente para quem estudou invariante e castigo para quem decorou comp.',
    st:['Set novo a cada poucos meses: todo mundo volta a zero junto, e isso é a sua chance','Atualização de meio de set: o meio-termo que reabre o jogo sem reconstruir tudo','Ler as notas oficiais no dia e estimar o impacto antes da lista de tiers sair','Tier list é resultado agregado de outras pessoas, não explicação','Primeira semana de patch: onde a vantagem aparece e como capturar antes','O que não expira: juro, tempo, odds, pool, posicionamento e gestão de tilt','Rotina de atualização de duas horas por patch, em vez de reconstruir o repertório'],
    q:'Acompanhe dois patches: antes, escreva a sua previsão do que muda; depois, compare com o que aconteceu e com o que a comunidade disse.',
    dv:'Duas previsões de patch avaliadas', g:'Separa por escrito o que no jogo é invariante e o que era moda daquele mês.',
    f:'Trocar de comp toda semana; decorar tier list sem entender o motivo.',
    tk:[['Leitura de notas na fonte','método'],['Separação invariante × moda','método']]},
  hok:{t:'Temporada, patch e o ajuste do pool', s:'O patch muda heróis. O seu método continua o mesmo — se ele existir.',
    st:['Ciclo de temporada e o que o reset de elo faz com a fila','Ler as notas oficiais e ajustar só o que muda no seu pool, não tudo','Herói nerfado no seu pool: quando insistir e quando trocar','Meta de ban e pick: o que sobe e desce por temporada','Primeira semana: fila mais caótica e mais fácil de subir','O que não expira: macro, prioridade de objetivo, leitura de mapa, gestão de tilt','Criador de conteúdo: o incentivo dele é publicar, não estar certo'],
    q:'Acompanhe dois patches: antes, escreva a sua previsão do impacto no seu pool; depois, compare com o que aconteceu de verdade.',
    dv:'Duas previsões de patch avaliadas', g:'Ajusta o pool com base na nota oficial e sabe o que no seu jogo não depende de patch.',
    f:'Trocar o pool inteiro toda temporada; jogar herói nerfado por teimosia sem medir.',
    tk:[['Leitura de notas na fonte','método'],['Ajuste de pool por patch','método']]},
  arpg:{t:'Liga, nerf e o que sobrevive à nota de atualização', s:'Toda liga alguém grita que o jogo morreu. Quem sabe ler a nota já está testando no planejador.',
    st:['Ciclo de liga: o que muda de verdade e o que é barulho de fim de semana','Ler a nota de atualização e estimar o impacto no planejador antes do choro coletivo','Nerf de build: como calcular o quanto você perdeu em vez de adivinhar','Build de início de liga precisa ser robusta e barata, não ótima','O que não expira: escalonamento, camadas de defesa, economia, leitura de encontro','Criador de conteúdo e o incentivo de publicar build chamativa que não sustenta endgame','Testar antes de reagir: o planejador responde em dez minutos o que a comunidade discute por três dias'],
    q:'Acompanhe duas atualizações: antes, escreva a sua previsão do impacto na sua build; depois, simule no planejador e compare com o que a comunidade afirmou.',
    dv:'Duas previsões de nerf avaliadas no planejador', g:'Calcula o impacto de um nerf sozinho, antes de a comunidade decidir o que pensar.',
    f:'Abandonar a build porque o fórum disse que morreu; confiar em build de vídeo sem simular.',
    tk:[['Simulação de nerf no planejador','método'],['Build de início de liga','método']]}
});

SYS.track('G11', 'jogo', {
  tft:{t:'Colocação média: a métrica que não mente', s:'Vitória é ruído. Colocação média é habilidade.',
    st:['Métrica honesta do autobattler: colocação média, não vitórias','Volume mínimo para ela significar algo: centenas de partidas, não dezenas','Especializar: dominar duas ou três composições flexíveis em vez de aprender todas','Ler as notas no dia e ajustar as duas composições, sem reconstruir o repertório','Coaching bem usado: levar três partidas marcadas em que você não sabe se decidiu certo','Teto honesto: o elo que o seu tempo disponível permite, sem drama','Relatório de temporada: onde começou, onde terminou, o que mudou no processo'],
    q:'Monte o plano do set: colocação média alvo, volume, rotina de revisão e data do relatório. Execute e escreva o relatório no fim.',
    dv:'Plano de set + relatório final', g:'A colocação média melhorou de forma verificável, independentemente de onde o elo parou.',
    f:'Meta só de elo; jogar volume e chamar de plano.',
    tk:[['Colocação média','notação']]},
  hok:{t:'Subir de elo eliminando erro recorrente', s:'Elo é resultado. Erro extinto é o que você controla.',
    st:['Métrica honesta do MOBA: erro recorrente eliminado, não taxa de vitória','Volume mínimo por herói antes de julgar se o herói é o problema','Especializar: dois ou três heróis por papel, um papel principal','Ler as notas e ajustar só o que muda no seu pool','Coaching bem usado: levar replay marcado nos minutos em que a partida virou','Teto honesto: o elo que o seu tempo permite — e a fila de duo como variável','Relatório de temporada com o erro que sumiu e o que continua'],
    q:'Monte o plano da temporada: erro recorrente alvo, volume, rotina de revisão e data do relatório. Execute e escreva o relatório no fim.',
    dv:'Plano de temporada + relatório final', g:'O erro recorrente escolhido caiu de forma medida, independentemente do elo final.',
    f:'Meta só de elo; trocar de herói toda vez que perde duas seguidas.',
    tk:[['Pool reduzido de heróis','método'],['Erro recorrente extinto','notação']]},
  arpg:{t:'Progressão de endgame: o personagem é o rank', s:'Não existe elo. Existe a camada mais alta que você limpa com consistência — e “com consistência” é a palavra inteira.',
    st:['Métrica honesta: camada máxima limpa sem morrer, não camada máxima tocada uma vez','Tempo por mapa e mortes por hora: as duas medidas reais de progressão','Subir de camada por degrau e medir a taxa de sucesso antes do próximo degrau','Separar o gargalo: falta item, falta build ou falta execução? Os três se corrigem diferente','Meta de temporada escrita: até onde você quer chegar e por quê','Revisão de build com alguém melhor, com a ficha e o planejador na mão','Comparar com jogador melhor no mesmo orçamento, não no absoluto','Relatório de liga: onde começou o personagem, onde terminou, o que você aprendeu de sistema'],
    q:'Monte o plano da liga: camada alvo com taxa de sucesso mínima, tempo por mapa aceitável, rotina de revisão e data do relatório. Execute e escreva o relatório.',
    dv:'Plano de liga + relatório final', g:'Limpa a camada alvo com taxa de sucesso medida — não uma vez de sorte.',
    f:'Entrar na camada mais alta e morrer sempre, chamando de progresso; medir por nível do personagem.',
    tk:[['Taxa de sucesso por camada','notação'],['Tempo médio por mapa','notação'],['Revisão de build por terceiro','método']]}
});

SYS.track('G23', 'jogo', {
  tft:{t:'Ladder, fim de set e o reset como presente', s:'O set tem data de validade. Use isso como ponto de saída, não como luto.',
    st:['Ladder e o que o fim de set faz com ela: a corrida tem linha de chegada','Set novo: todo mundo volta a zero e quem estudou invariante volta na frente','Atualização de meio de set: uma segunda largada dentro da mesma temporada','Economia do lobby: o pool é um recurso coletivo e finito, não um estoque infinito','Recompensa de fim de set como prazo natural do seu ciclo','Ponto de saída escrito antes do set começar: até onde e por quê'],
    q:'Mapeie o calendário do set (início, meio de set, fim), escreva o seu plano de largada e o ponto de saída antes de o set começar.',
    dv:'Calendário do set + plano com ponto de saída', g:'Tem plano de largada e ponto de saída escritos antes do set, não improvisados no meio.',
    f:'Começar o set duas semanas atrasado todo ciclo; parar por cansaço em vez de por meta cumprida.',
    tk:[['Calendário de set','referência'],['Ponto de saída','norma']]},
  hok:{t:'Temporada, reset de elo e a hora de parar', s:'A temporada tem fim. Quem não escreve o ponto de saída joga até enjoar.',
    st:['Reset de elo: o que ele realmente faz e o que a fila vira nas primeiras semanas','Primeiras semanas: fila mais caótica, mais fácil de subir e mais fácil de tiltar','Recompensa de temporada como prazo natural do seu ciclo','Economia de heróis e cosméticos: o que o jogo quer que você compre e quando','Meta de temporada cumprida × temporada acabada: são coisas diferentes','Ponto de saída escrito antes da temporada começar'],
    q:'Mapeie o calendário da temporada, escreva o plano das primeiras semanas e o ponto de saída antes de ela começar.',
    dv:'Calendário da temporada + plano com ponto de saída', g:'Tem plano de largada e ponto de saída escritos antes da temporada.',
    f:'Entrar na temporada no último mês; jogar até enjoar e chamar isso de fim.',
    tk:[['Calendário de temporada','referência'],['Ponto de saída','norma']]},
  arpg:{t:'Economia de liga, moeda e o valor real das coisas', s:'Em Path of Exile a moeda é insumo de craft; em Diablo quase não há troca. Saber em qual jogo você está muda a estratégia inteira.',
    st:['Moeda como insumo de craft × moeda como dinheiro: dois jogos econômicos diferentes','Preço é demanda, não raridade: item raro que ninguém quer é item barato','Início de liga: tudo caro em moeda e barato em tempo — o inverso do fim','Inflação ao longo da liga e o momento certo de vender o que você achou','Comprar pronto × craftar: a conta que decide, refeita a cada semana da liga','Jogo com economia aberta × jogo praticamente sem troca: estratégias opostas para o mesmo gênero','Segurança em negociação: golpe comum, e a regra de nunca sair da interface oficial','Fonte e ralo de moeda: por que a liga inflaciona e o que isso faz com o seu estoque','Ponto de saída da liga escrito antes de começar'],
    q:'Mapeie a economia da sua liga (o que gera moeda, o que consome, o que infla), acompanhe o preço de três itens por quatro semanas e escreva o seu plano de venda.',
    dv:'Mapa da economia + acompanhamento de três preços', g:'Sabe onde o valor é criado e destruído na liga e decidiu comprar ou craftar com conta feita.',
    f:'Guardar item esperando valorizar até a liga acabar; negociar fora da interface oficial.',
    tk:[['Fonte e ralo de moeda','notação'],['Acompanhamento de preço','método'],['Regra de negociação segura','norma']]}
});

SYS.track('G12', 'jogo', {
  tft:{t:'BOSS · O Set Inteiro', s:'Um set completo, do primeiro dia ao último, com revisão semanal e relatório. O boss é terminar.',
    st:['Um set completo do jogo, do início ao encerramento oficial','Volume declarado antes e cumprido, ou o motivo escrito de não ter cumprido','Revisões semanais registradas, com erros nomeados e evolução visível','Regras de sessão respeitadas, com registro das vezes que o gatilho disparou','Relatório final: colocação média inicial e final, o que melhorou no processo, o que ficou de invariante','Decisão explícita para o próximo set: continuar, trocar de jogo ou encerrar como honroso','Nada aqui exige elo mínimo'],
    q:'Complete um set inteiro de TFT com revisões semanais, regras de sessão respeitadas e relatório final escrito.',
    dv:'Set completo documentado', g:'Set fechado com registro contínuo e relatório — não um elo específico.',
    f:'Sumir no meio do set e chamar de pausa; registrar só as duas primeiras semanas.'},
  hok:{t:'BOSS · A Temporada Ranqueada', s:'Uma temporada inteira, do reset ao fim, com revisão semanal e relatório. O boss é terminar.',
    st:['Uma temporada completa, do reset de elo ao encerramento','Volume declarado antes e cumprido, ou o motivo escrito de não ter cumprido','Revisões semanais registradas, com erros nomeados e evolução visível','Regras de sessão respeitadas, com registro das vezes que o gatilho disparou','Relatório final: erro recorrente que sumiu, o que melhorou no processo, o que é invariante','Decisão explícita para a próxima: continuar, trocar de jogo ou encerrar como honroso','Nada aqui exige elo mínimo'],
    q:'Complete uma temporada inteira de Honor of Kings com revisões semanais, regras de sessão respeitadas e relatório final escrito.',
    dv:'Temporada completa documentada', g:'Temporada fechada com registro contínuo e relatório — não um elo específico.',
    f:'Parar quando o elo trava; registrar só no começo, entusiasmo de primeira semana.'},
  arpg:{t:'BOSS · A Liga Inteira', s:'Do dia um da liga ao ponto de saída escrito, com build documentada e progressão registrada. O boss é terminar o ciclo, não zerar o jogo.',
    st:['Uma liga ou temporada completa, do primeiro dia ao ponto de saída que você escreveu','Build documentada: tese, simulação, versões e o que mudou no caminho','Progressão registrada: camada alcançada, taxa de sucesso, tempo por mapa, mortes por hora','Plano de largada cumprido ou o motivo escrito de não ter sido','Economia: o que você craftou, o que comprou, o que vendeu e o que aprendeu com isso','Relatório final: o que era invariante, o que era moda, e o que você levaria para a próxima liga','Decisão explícita: próxima liga, outro jogo, ou encerrar como honroso','Nada aqui exige camada máxima do jogo'],
    q:'Complete uma liga inteira do seu ARPG, do dia um ao ponto de saída escrito, com build documentada, progressão registrada e relatório final.',
    dv:'Liga completa documentada', g:'Liga fechada no ponto de saída combinado, com build e progressão registradas — não uma camada específica.',
    f:'Abandonar na segunda semana e chamar de pausa; ir até o burnout porque não tinha ponto de saída.'}
});

/* ---------- MIND · cenário de ritmo ---------- */
SYS.choice({key:'ritmo', way:'mind', n:'Cenário de ritmo', q:'osu!standard (cursor) ou VSRG de teclas?',
  why:'Ouvido e subdivisão são os mesmos nos dois — é por isso que ritmo é cenário e não moda. A partir daí, o treino divide: osu!standard é cursor, mira e tapping, com cena ocidental gigante e acervo de mapas infinito; VSRG de teclas (osu!mania, Etterna, Quaver, IIDX, SDVX) é leitura de coluna e independência de dedos, com cena japonesa nichada e hardware dedicado. São músculos diferentes e periférico diferente: treinar os dois em paralelo divide o tempo de mão pela metade e atrasa os dois. Escolha uma trilha; a base de ouvido, latência e postura vale para as duas, e o progresso de cada uma fica salvo separado.',
  opts:[
    {id:'osu', n:'osu!standard', tag:'Cursor: mira + tapping + leitura', who:'Quem quer cena ocidental enorme, mapa de tudo, e periférico barato (mouse ou tablet)'},
    {id:'keys', n:'VSRG de teclas', tag:'Colunas: leitura de padrão + independência de dedos', who:'Quem quer o nicho japonês, teto técnico mais alto e não se importa com hardware dedicado'}
  ]});
SYS.track('R02', 'ritmo', {
  osu:{st:['Cursor: mouse × mesa digitalizadora, e por que a maioria do topo usa tablet','Área ativa do tablet: a variável que mais muda a sua mira, e por que mexer nela reseta o treino','Sensibilidade e área: escolher uma e não mexer por meses','Taxa de leitura do periférico e suavização: onde o atraso entra sem você ver','Modo de exclusividade de tela e limite de quadros: a configuração que corta latência de graça'], tk:[['Mesa digitalizadora com área fixa','ferramenta'],['Teste de área ativa','método']]},
  keys:{st:['Teclado: curso de tecla, força de ativação e por que switch leve ajuda em nota rápida','Bloqueio de teclas simultâneas: quantas teclas o teclado registra ao mesmo tempo de verdade','Hardware dedicado: controle de 7 teclas com scratch, controle de 4 botões com knob','Taxa de leitura e latência de USB no controle dedicado','Latência de áudio com driver de baixa latência — em VSRG isso é mais crítico que vídeo'], tk:[['Teste de teclas simultâneas','método'],['Driver de áudio de baixa latência','ferramenta']]}
});
SYS.track('R04', 'ritmo', {
  osu:{st:['Leitura de padrão de cursor: fluxo, salto, retorno e mudança de direção','Tapping: alternância de dedo, toque simples e o limite de velocidade sustentável','Sliders e spinners: o que eles cobram em controle fino em vez de velocidade','Classificação de dificuldade e modificadores: o que cada modificador realmente treina','Escolher mapa por padrão fraco, não por música favorita — o erro mais comum do gênero'], tk:[['Classificação por estrelas','referência'],['Treino por tipo de padrão de cursor','método']]},
  keys:{st:['Padrões nomeados: repetição na mesma coluna, corrida, rajada, trinado, acorde em repetição','Notas longas e a coordenação de segurar e tocar ao mesmo tempo','Velocidade de rolagem: ajustar até o padrão virar forma legível, e travar','Independência de dedo: exercício isolado por dedo antes de padrão composto','Índice de dificuldade da comunidade e por que ele não é comparável entre jogos'], tk:[['Nomenclatura de padrões (jack, stream, trill)','notação'],['Treino isolado por dedo','técnica']]}
});
SYS.track('R05', 'ritmo', {
  osu:{st:['Precisão como métrica principal: acerto médio e desvio, não só a nota final','Pontos de desempenho: como o sistema recompensa dificuldade e precisão juntas','Farmar mapa fácil por pontuação × subir dificuldade de verdade','Recorde pessoal como evento raro: semanas de treino, não sessão de sorte'], tk:[['Desvio de acerto (unstable rate)','notação']]},
  keys:{st:['Precisão por janela de julgamento: como o jogo mede e o que conta como perfeito','Aproveitamento × sobreviver: passar raspando esconde base imprecisa','Baixar dificuldade para subir precisão: contraintuitivo e é o que quebra platô','Recorde pessoal registrado com o padrão treinado que levou até ele'], tk:[['Janela de julgamento','notação'],['Índice de habilidade da comunidade','referência']]}
});

/* ---------- técnicas a investigar: vertentes de hobby ---------- */
SYS.tech({
  H01:[['Inventário de hiperfocos com tempo e entregável','método']],
  H02:[['Temporada com escopo negativo escrito','método'],['Fila de espera de ideias','método']],
  H03:[['Caderno de campo de três campos','método'],['Relatório de encerramento de uma página','método']],
  H04:[['Teste das três perguntas (hobby × ofício)','método']],
  H05:[['Rastreamento de cadeia de citação','método'],['Crítica interna e externa de fonte','método'],['Grau de confiança por achado','notação']],
  H06:[['Wayback Machine','ferramenta'],['Formato WARC de arquivamento','norma'],['Regra 3-2-1 de backup','norma'],['Conifer','ferramenta']],
  H07:[['Busca reversa de imagem','técnica'],['ExifTool','ferramenta'],['Cronolocalização por sombra','técnica'],['Geolocalização por pista visual','técnica']],
  H08:[['Hemeroteca Digital Brasileira','ferramenta'],['Catálogo AtoM de arquivo','ferramenta'],['Paleografia de documento do séc. XIX','técnica'],['História oral com consentimento gravado','método'],['Citação de fundo, série e caixa','norma']],
  H09:[['Estrutura de dossiê investigativo','método'],['Aparato de fontes com data de acesso','norma']],
  H10:[['Índice de motivos folclóricos','referência'],['Coleta de variantes','método'],['Ostensão','notação']],
  H11:[['Análise de recurso narrativo por texto','método']],
  H12:[['Formato de verbete de contenção','notação'],['Crítica pública de rascunho','método'],['Licença CC BY-SA','norma']],
  H13:[['Estrutura de trilha de ARG','método'],['Esteganografia de nível hobby','técnica'],['Cifra clássica','técnica'],['Canal fora da ficção','norma']],
  H14:[['Revisão em três passadas','método'],['Leitura em voz alta para revisão','técnica']],
  H16:[['Taxonomia comparada de estéticas','método']],
  H17:[['Não-lugar','notação'],['Anemoia','notação'],['Vale da estranheza','notação']],
  H18:[['Degradação analógica simulada','técnica'],['Composição do vazio','técnica'],['Render de cena vazia','técnica']],
  H19:[['Nota de curador por item','método'],['Are.na','ferramenta'],['Procedência de achado','norma']],
  H20:[['Mapa de fachada e bastidores','método']],
  H21:[['Higiene de identidade pseudônima','método'],['Remoção de metadado antes de publicar','técnica']],
  H22:[['Leitura de histórico antes de propor','norma']],
  G01:[['Alvo único por sessão','método'],['Prática deliberada','método'],['Representação mental','notação']],
  G02:[['Revisão de replay com timestamp','método'],['Separação erro de decisão × execução','método'],['Três erros por partida','norma']],
  G03:[['Declaração de temporada com gatilho de troca','método']],
  G04:[['Stop-loss de sessão','norma'],['Registro de gatilho de tilt','método'],['Reset físico de cinco minutos','técnica']],
  G05:[['Punho neutro e apoio de antebraço','técnica'],['Aquecimento de dois minutos','método'],['Pausa curta programada','norma']],
  G06:[['Ficha de anatomia do jogo','método']],
  G07:[['Curva de recurso por fase','método'],['Critério escrito de conversão','método']],
  G08:[['Valor esperado de decisão','método'],['Registro separado de decisão e resultado','método']],
  G09:[['Rotina de coleta de informação do adversário','método']],
  G10:[['Leitura de notas de atualização na fonte','método'],['Separação invariante × moda','método']],
  G11:[['Meta de processo × meta de resultado','método'],['Pauta escrita antes do coaching','norma']],
  G13:[['Auditoria de simplificação do modelo','método']],
  G14:[['Diário de run com decisão-chave','método'],['Interpretação de Berlim','referência']],
  G15:[['Mapa de loop de recompensa','método'],['Reforço em intervalo variável','notação']],
  G16:[['Restrição autoimposta','método'],['Lei de Goodhart','notação']],
  G17:[['Dissonância ludonarrativa','notação'],['Narrativa ambiental','notação']],
  G18:[['Diagrama de loop central','método'],['Mapa de fontes e ralos de economia','método']],
  G19:[['Tese antes de evidência','método'],['Crítica sem nota','norma']],
  G20:[['Círculo mágico','notação'],['Atividade autotélica','notação']],
  R01:[['Metrônomo e contagem em voz alta','técnica'],['Calibração de offset','método']],
  R03:[['Independência de dedo','técnica'],['Relaxamento de antebraço','técnica'],['Gravação das mãos para diagnóstico','método']],
  R06:[['Plano de dez anos de habilidade','método']]
});

/* ---------- gatilho "não antes de" nos nós que só pagam depois de base ---------- */
SYS.nb({
  H07:'Só depois de H05 (crítica de fonte) e com as regras éticas escritas. Técnica de rastreamento sem crítica de fonte produz dossiê convincente e errado — e sem regra escrita, produz dano em pessoa real.',
  H09:'Só depois de H05 e H06. Dossiê sem cadeia de citação rastreada e sem arquivo das fontes é opinião longa com aparência de pesquisa.',
  H13:'Só depois de ter publicado algo (H14) e com o canal fora da ficção definido. ARG sem aviso de que é ficção vira boato de verdade, com gente batendo na porta errada.',
  H15:'Só depois de duas temporadas encerradas com relatório. Coleção assinada com uma peça só é pasta com capa bonita.',
  G07:'Só depois de G06. Otimizar recurso antes de saber o que o jogo realmente premia é treinar a coisa errada com muita disciplina.',
  G11:'Só depois de 25 revisões registradas (G02). Plano de subida sem rotina de revisão é volume com nome de plano.',
  G12:'Só depois do Selo de Jogar de Propósito e de um mês de regras de sessão respeitadas. O boss é o processo inteiro, e processo não se improvisa na última semana.',
  R02:'Só depois de G05 (estação ajustada) e R01 (offset calibrado). Comprar tela e periférico antes de medir é pagar caro por um atraso que estava no offset.',
  R04:'Só depois de R01. Quem não subdivide decora chart — e mapa decorado cria teto falso que trava por anos.',
  R05:'Só depois de R04. Perseguir precisão sem saber ler padrão é farmar o mesmo mapa com número melhor e nível igual.'
});

/* ---------- v12 · capítulos novos do arco do competitivo ---------- */
SYS.tech({
  G21:[['Tese de build em três linhas','método'],['Aditivo × multiplicativo','notação'],['Ponto de corte','notação'],['Teste de uma variável por vez','método']],
  G22:[['Sequência padrão escrita','método'],['Gatilho de exceção','norma'],['Decisão default','método'],['Ensaio fora de pressão','técnica']],
  G23:[['Mapa de fonte e ralo','método'],['Ponto de saída escrito','norma'],['Plano de largada de temporada','método']]
});
SYS.nb({
  G21:'Só depois de G06 e G07. Otimizar build antes de saber qual é o recurso escasso do jogo é montar planilha bonita para a pergunta errada.',
  G22:'Só depois de G21. Execução treina a build que você escolheu — trocar de build toda semana joga fora o treino de mão.',
  G23:'Só depois de uma temporada jogada até o fim (G12) ou de pelo menos dois meses no jogo. Ler economia e ciclo com duas semanas de jogo é ler gráfico sem série histórica.'
});
