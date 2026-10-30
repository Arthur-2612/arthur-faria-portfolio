'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const menuButton = $('.menu-toggle');
const navigation = $('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 621px)').addEventListener('change', closeMenu);

const filterButtons = $$('[data-filter]');
const projectCards = $$('[data-category]');
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(filter => {
    filter.classList.toggle('active', filter === button);
    filter.setAttribute('aria-pressed', String(filter === button));
  });
  let count = 0;
  projectCards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) count++;
  });
  $('#filter-status').textContent = `${count} ${count === 1 ? 'projeto exibido' : 'projetos exibidos'}.`;
}));

// Native ARIA tabs, with automatic activation and keyboard navigation.
function activateTab(tab, focus = false) {
  const list = tab.closest('[role="tablist"]');
  list.querySelectorAll('[role="tab"]').forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    if (!selected) document.getElementById(item.getAttribute('aria-controls')).querySelectorAll('video').forEach(video => video.pause());
  });
  if (focus) tab.focus();
}
$$('[role="tablist"]').forEach(list => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      const visibleTabs = tabs.filter(item => !item.hidden);
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      const previous = vertical ? 'ArrowUp' : 'ArrowLeft';
      const next = vertical ? 'ArrowDown' : 'ArrowRight';
      let index = visibleTabs.indexOf(tab);
      if (event.key === previous) index = (index + visibleTabs.length - 1) % visibleTabs.length;
      else if (event.key === next) index = (index + 1) % visibleTabs.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = visibleTabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(visibleTabs[index], true);
    });
  });
});

const projects = {
  legal: {
    category: 'EXPERIÊNCIA NA 2RP NET / IA APLICADA AO JURÍDICO',
    title: 'Agente jurídico para termos aditivos',
    summary: 'Integração com o Projuris, recuperação de histórico com RAG e geração de minutas preliminares em DOCX, com revisão jurídica humana.',
    tags: ['Python', 'FastAPI', 'Projuris', 'RAG', 'pgvector', 'python-docx'],
    contextLabel: 'Especificações',
    learningLabel: 'Qualidade',
    context: `<p class="case-note"><strong>Em desenvolvimento.</strong> Este caso apresenta o escopo e a arquitetura documentados da solução.</p><h3>O problema</h3><p>A elaboração de um termo aditivo exige comparar o contrato vigente, a nova proposta e os aditivos anteriores. O agente busca esse contexto e apoia a redação de uma minuta preliminar editável.</p><h3>Minha participação</h3><p>Atuei principalmente na <strong>integração com o Projuris</strong> e na <strong>geração das minutas</strong>, em um projeto desenvolvido em equipe.</p><dl class="spec-list"><div><dt>Integração</dt><dd>Conexão com requisições, metadados e documentos do Projuris, incluindo o retorno da minuta à requisição.</dd></div><div><dt>Geração documental</dt><dd>Produção da minuta preliminar em DOCX com python-docx, a partir do contexto do contrato e das alterações solicitadas.</dd></div><div><dt>Entradas</dt><dd>Requisição, contrato vigente, proposta de alteração e histórico de aditivos.</dd></div><div><dt>Saída prevista</dt><dd>Minuta editável anexada no Projuris e informações de auditoria para conferência.</dd></div><div><dt>Revisão</dt><dd>A análise, a aprovação e a decisão jurídica permanecem com o advogado responsável.</dd></div></dl>`,
    learning: `<h3>Como a qualidade será avaliada</h3><p>Os itens abaixo são critérios previstos na documentação. Não representam resultados de produção ou ganhos já comprovados.</p><dl class="spec-list"><div><dt>Extração e OCR</dt><dd>CER e WER em amostras com referência, além da conferência de datas, valores e campos críticos.</dd></div><div><dt>Recuperação RAG</dt><dd>Precision@K e Recall@K para avaliar se os trechos recuperados correspondem ao contexto contratual necessário.</dd></div><div><dt>Redação</dt><dd>Comparação com casos de referência homologados pelo jurídico e revisão humana das minutas.</dd></div><div><dt>Rastreabilidade</dt><dd>Referências aos documentos e às cláusulas utilizadas; identificação da execução e registro de status.</dd></div><div><dt>Operação</dt><dd>Acompanhamento de latência, falhas, uso do modelo e acionamento de contingência.</dd></div></dl><p class="case-note">A revisão jurídica humana é obrigatória. A automação não aprova contratos nem substitui o parecer do advogado.</p>`,
    architectureNote: 'Resumo baseado no texto revisado da documentação, de 30/10/2026. A arquitetura descreve um agente geral com ferramentas modulares e duas esteiras de processamento.',
    source: null
  },
  agents: {
    category: 'DADOS & IA / PROJETO DE ESTÁGIO',
    title: 'Agentes para análise de crédito',
    summary: 'Dados do Home Credit, ferramentas Python e agentes especializados trabalhando juntos para organizar uma análise.',
    tags: ['Python', 'Google ADK', 'Pandas', 'BigQuery', 'Pydantic'],
    demo: {
      src: '/assets/demos/home-credit.mp4',
      poster: '/assets/demos/home-credit.jpg',
      duration: '3min29s',
      description: 'Veja a orquestração dos agentes no Google ADK em uma gravação do projeto.',
      source: 'https://www.linkedin.com/feed/update/urn:li:activity:7493019795823476736/'
    },
    context: '<h3>O problema</h3><p>As informações de um cliente estão distribuídas em sete tabelas do Home Credit. O projeto reúne esse contexto para responder perguntas sobre bureau, pagamentos, cartão e contratos.</p><h3>O que construímos</h3><p>Um sistema com um agente Concierge e quatro especialistas. As ferramentas Python processam os indicadores e o resultado é reunido em um relatório JSON estruturado.</p><p class="case-note">Desenvolvido em equipe durante o estágio na 2RP Net. A arquitetura, a equipe e as instruções de execução estão documentadas no repositório.</p>',
    flow: [
      ['Pergunta + cliente', 'O Concierge recebe a pergunta e o identificador do cliente.'],
      ['Delegação semântica', 'O ADK aciona os especialistas conforme o contexto.'],
      ['Ferramentas Python', 'Joins, agregações e cálculos sobre as tabelas relacionadas.'],
      ['Relatório JSON', 'Consolidação dos indicadores e da narrativa analítica.']
    ],
    architectureNote: 'A documentação inclui o mapeamento dos joins para BigQuery. As ferramentas de análise processam dados com Python e Pandas.',
    learning: '<h3>O que esse projeto me ajudou a entender</h3><ul><li>As relações entre tabelas precisam estar claras antes de construir uma análise.</li><li>Separar o cálculo dos indicadores da interpretação do modelo torna o fluxo mais organizado.</li><li>Contratos de saída estruturados ajudam a integrar as respostas dos especialistas.</li><li>Ausência de dados também precisa ter um tratamento explícito.</li></ul><p class="case-note">A experiência faz parte da minha formação em dados e IA aplicada. O repositório reúne a arquitetura, a equipe e as instruções de execução.</p>',
    source: 'https://github.com/Arthur-2612/multi-agent-system-synapse',
    sourceLabel: 'Código e documentação ↗'
  },
  exchange: {
    category: 'SISTEMAS / PROJETO INTEGRADOR DE ADS',
    title: 'SENAI Exchange',
    summary: 'Uma plataforma de troca de itens para a comunidade de alunos do SENAI, desenvolvida em equipe na faculdade.',
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'HTML / CSS / JavaScript'],
    demo: {
      src: '/assets/demos/senai-exchange.mp4',
      poster: '/assets/demos/senai-exchange.jpg',
      duration: '1min31s',
      description: 'Acompanhe a navegação pelo SENAI Exchange e veja a plataforma em funcionamento.',
      source: 'https://www.linkedin.com/feed/update/urn:li:activity:7473764030248120320/'
    },
    context: '<h3>O problema</h3><p>Materiais, livros e componentes que um aluno já não utiliza podem ser úteis para outro. O SENAI Exchange organiza os anúncios e as propostas de troca em uma aplicação web.</p><h3>O que construímos</h3><p>Cadastro de alunos, catálogo de itens, propostas, mensagens e perfis. O banco relaciona alunos, cursos, categorias, itens, imagens, trocas e mensagens.</p><p class="case-note">Projeto Integrador de ADS, desenvolvido em equipe. A documentação e o código estão disponíveis no GitHub.</p>',
    flow: [
      ['Interface web', 'HTML, CSS e JavaScript. Comunicação com a API usando Fetch.'],
      ['Spring Boot', 'API REST e arquivos estáticos servidos pela mesma aplicação.'],
      ['JPA + PostgreSQL', 'Persistência das entidades e relações do sistema.'],
      ['Ambiente local', 'PostgreSQL e pgAdmin organizados com Docker Compose.']
    ],
    architectureNote: 'O projeto é uma aplicação monolítica: o próprio Spring Boot serve a interface web. O Docker Compose organiza o banco e o pgAdmin.',
    learning: '<h3>Da modelagem à aplicação</h3><ul><li>Traduzir regras de troca em entidades, relacionamentos e estados.</li><li>Conectar o modelo relacional às operações da API.</li><li>Entender o fluxo entre interface, regras de negócio e persistência.</li><li>Organizar o desenvolvimento em equipe com uma base de código compartilhada.</li></ul><p class="case-note">É uma aplicação da minha formação em ADS, com conexão direta aos fundamentos de bancos de dados.</p>',
    source: 'https://github.com/Arthur-2612/sistema-trocas-alunos',
    sourceLabel: 'Código e documentação ↗'
  },
  pet: {
    category: 'IA APLICADA / VISÃO COMPUTACIONAL',
    title: 'IA para inspeção de garrafas PET',
    summary: 'Aplicação de IA e visão computacional para detectar irregularidades em garrafas PET e integrar as detecções a uma esteira de inspeção.',
    tags: ['Python', 'YOLO', 'Roboflow', 'Visão computacional', 'Integração de sistemas'],
    context: '<h3>O problema</h3><p>Detectar garrafas PET sem tampa ou sem rótulo em uma linha de inspeção, usando imagens para identificar as irregularidades.</p><h3>Como aplicamos IA</h3><p>No TCC, usei IA aplicada à visão computacional, com Python, YOLO e Roboflow. A câmera fornece as imagens e o processamento no notebook identifica as condições das garrafas. As detecções são integradas ao mecanismo de rejeição da esteira.</p><p class="case-note">TCC desenvolvido em equipe e apresentado no SENAI Gaspar Ricardo Jr. em 2025. A apresentação do projeto está no meu LinkedIn.</p>',
    flow: [
      ['Captura de imagens', 'A câmera USB fornece as imagens das garrafas na esteira.'],
      ['Inferência com IA', 'Python e YOLO processam as imagens no notebook, com uso de Roboflow no projeto.'],
      ['Detecção de irregularidades', 'A visão computacional identifica garrafas sem tampa ou sem rótulo.'],
      ['Integração com a esteira', 'Arduino e CLP Omron conectam o sinal da detecção ao mecanismo pneumático de rejeição.']
    ],
    architectureNote: 'O núcleo de IA roda no notebook e transforma imagens em detecções. A integração com o controle industrial permite que o resultado da análise acione uma ação física.',
    learning: '<h3>IA aplicada além da tela</h3><ul><li>Aplicar visão computacional à identificação de irregularidades em um objeto físico.</li><li>Conectar o processamento das imagens em Python ao restante do sistema.</li><li>Entender o caminho entre captura, inferência, detecção e acionamento.</li><li>Testar a integração entre a saída da IA e a esteira.</li></ul><p>O projeto conecta meu interesse por IA aplicada à integração de sistemas.</p>',
    source: 'https://pt.linkedin.com/posts/arthur-faria-e-silva-85b04a290_automa%C3%A7%C3%A3oindustrial-mecatr%C3%B4nica-clp-activity-7415834404188745728-lzUn',
    sourceLabel: 'Apresentação no LinkedIn ↗'
  }
};
const specialists = {
  bureau: 'Bureau externo: relaciona bureau_balance e bureau para explorar créditos externos, dívida e histórico de atrasos do cliente.',
  payments: 'Pagamentos: analisa parcelas e contratos POS. As ferramentas Python calculam indicadores de atraso e pagamentos abaixo do previsto.',
  card: 'Cartão: explora utilização de limite, pagamento mínimo e tendência de saldo, tratando também clientes sem dados de cartão.',
  contracts: 'Contratos: organiza propostas anteriores e motivos de recusa. A saída utiliza um esquema Pydantic para manter a estrutura da resposta.'
};
const dialog = $('#project-dialog');
let lastProjectButton = null;
function clearDemo() {
  const video = $('#case-demo video');
  if (video) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  $('#case-demo').replaceChildren();
}
function renderDemo(project) {
  clearDemo();
  const tab = $('#case-tab-demo');
  tab.hidden = !project.demo;
  dialog.classList.toggle('has-demo', Boolean(project.demo));
  if (!project.demo) return;
  const demo = project.demo;
  const panel = $('#case-demo');
  const heading = document.createElement('h3'); heading.textContent = 'Veja o projeto em ação';
  const description = document.createElement('p'); description.textContent = demo.description; description.id = 'demo-description';
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'none';
  video.poster = demo.poster;
  video.src = demo.src;
  video.setAttribute('aria-label', `Demonstração em vídeo: ${project.title}`);
  video.setAttribute('aria-describedby', description.id);
  video.textContent = 'Seu navegador não oferece reprodução de vídeo.';
  const meta = document.createElement('div'); meta.className = 'demo-meta';
  const duration = document.createElement('span'); duration.textContent = `${demo.duration} · 720p`;
  const source = document.createElement('a'); source.href = demo.source; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = 'Post original no LinkedIn ↗';
  meta.append(duration, source);
  const fallback = document.createElement('p'); fallback.className = 'demo-fallback'; fallback.hidden = true;
  fallback.append('Não foi possível reproduzir aqui. ');
  const direct = document.createElement('a'); direct.href = demo.src; direct.target = '_blank'; direct.rel = 'noopener noreferrer'; direct.textContent = 'Abrir o vídeo em outra aba ↗'; fallback.append(direct);
  video.addEventListener('error', () => { if (video.hasAttribute('src')) fallback.hidden = false; });
  panel.append(heading, description, video, meta, fallback);
}
function renderFlow(project, key) {
  if (key === 'legal') { renderLegalArchitecture(project); return; }
  const flow = document.createElement('ol');
  flow.className = 'case-flow';
  project.flow.forEach(([title, description], i) => {
    const item = document.createElement('li');
    const index = document.createElement('span'); index.textContent = `0${i + 1}`;
    const heading = document.createElement('strong'); heading.textContent = title;
    const body = document.createElement('small'); body.textContent = description;
    item.append(index, heading, body); flow.append(item);
  });
  const target = $('#case-architecture'); target.replaceChildren(flow);
  const note = document.createElement('p');note.className = 'case-note';note.textContent = project.architectureNote;target.append(note);
  if (key === 'agents') {
    const explorer = document.createElement('div');
    explorer.className = 'agent-explorer';
    explorer.innerHTML = `
      <div class="agent-sim-head">
        <span class="architecture-label">PLAYGROUND INTERATIVO · GOOGLE ADK</span>
        <h3>Simulador de Orquestração Multiagente</h3>
      </div>
      <p class="agent-sim-intro">Selecione um cenário para ver a delegação semântica do <strong>Concierge</strong> para os 4 especialistas e o contrato JSON emitido via Pydantic:</p>
      <div class="agent-scenarios" role="group" aria-label="Selecione um cliente para simulação">
        <button class="agent-scenario-btn active" data-scenario="low_risk">Cenário A · Baixo Risco (Score 840)</button>
        <button class="agent-scenario-btn" data-scenario="mid_risk">Cenário B · Sem Histórico Cartão</button>
        <button class="agent-scenario-btn" data-scenario="high_risk">Cenário C · Alerta de Inadimplência</button>
      </div>

      <div class="agent-graph-box">
        <div class="agent-node-concierge">
          <span class="agent-node-badge">ORQUESTRADOR ADK</span>
          <strong>Concierge Agent</strong>
          <small id="sim-concierge-status">Coletando variáveis e delegando contexto...</small>
        </div>
        <div class="agent-wires">
          <div class="agent-wire"></div>
          <div class="agent-wire"></div>
          <div class="agent-wire"></div>
          <div class="agent-wire"></div>
        </div>
        <div class="agent-specialists-grid">
          <div class="agent-spec-card">
            <span class="spec-name">01 · Bureau</span>
            <div class="spec-value" id="val-bureau"></div>
          </div>
          <div class="agent-spec-card">
            <span class="spec-name">02 · Pagamentos</span>
            <div class="spec-value" id="val-payments"></div>
          </div>
          <div class="agent-spec-card">
            <span class="spec-name">03 · Cartão</span>
            <div class="spec-value" id="val-card"></div>
          </div>
          <div class="agent-spec-card">
            <span class="spec-name">04 · Contratos</span>
            <div class="spec-value" id="val-contracts"></div>
          </div>
        </div>
      </div>

      <div class="agent-pydantic-output">
        <div class="pydantic-header">
          <span>CONTRATO DE SAÍDA VALIDADO (PYDANTIC / JSON)</span>
          <span class="pydantic-status">SCHEMA OK · STATUS 200</span>
        </div>
        <pre class="pydantic-code" id="sim-pydantic-code"><code></code></pre>
      </div>
    `;

    const scenarios = {
      low_risk: {
        status: 'Concierge: Contexto consolidado · Score de crédito elevado.',
        bureau: 'Dívida ativa: R$ 0<br>Atrasos externos: 0<br>Score: 840 (Excelente)',
        payments: '36 parcelas pagas<br>Pontualidade: 100%<br>Variação média: R$ 0',
        card: 'Limite utilizado: 18%<br>Pagamento integral de fatura<br>Tendência: Estável',
        contracts: '2 contratos quitados<br>Zero recusas históricas<br>Perfil elegível',
        json: {
          client_id: 10842,
          risk_tier: "LOW_RISK",
          recommendation: "APROVAR_CREDITO",
          suggested_credit_limit: 45000.00,
          interest_rate_modifier: -0.015,
          active_specialists_consulted: ["bureau", "payments", "card", "contracts"],
          pydantic_contract_version: "2.1.0"
        }
      },
      mid_risk: {
        status: 'Concierge: Cartão ausente · Acionando regra de contingência explícita.',
        bureau: 'Crédito externo: R$ 3.800<br>1 apontamento regularizado<br>Score: 650 (Médio)',
        payments: '14 parcelas analisadas<br>2 atrasos curtos (< 5 dias)<br>Pontualidade: 86%',
        card: 'Sem histórico de cartão<br>Tratamento de nulos em Pandas<br>Flag: NO_CARD_DATA',
        contracts: '1 contrato anterior em dia<br>Proposta aprovada sob limite',
        json: {
          client_id: 25910,
          risk_tier: "MODERATE_RISK",
          recommendation: "APROVAR_COM_CONDICIONANTES",
          suggested_credit_limit: 12000.00,
          notes: "Ausência de dados de cartão tratada explicitamente na agregação.",
          active_specialists_consulted: ["bureau", "payments", "contracts"],
          pydantic_contract_version: "2.1.0"
        }
      },
      high_risk: {
        status: 'Concierge: Múltiplas anomalias detectadas · Limite restrito recomendado.',
        bureau: 'Dívida ativa: R$ 14.500<br>3 atrasos consecutivos<br>Score: 390 (Crítico)',
        payments: 'Taxa de atraso: 34%<br>Parcelas em aberto: 3<br>Risco de inadimplência alto',
        card: 'Utilização de limite: 97%<br>Pagamento de mínimo recorrente<br>Alerta de rotativo',
        contracts: '1 recusa em 6 meses<br>Tentativa de refinanciamento',
        json: {
          client_id: 39201,
          risk_tier: "HIGH_RISK",
          recommendation: "ENCAMINHAR_ANALISE_HUMANA",
          suggested_credit_limit: 0.00,
          risk_flags: ["HIGH_REVOLVING_CREDIT", "CONSECUTIVE_DELINQUENCIES"],
          active_specialists_consulted: ["bureau", "payments", "card", "contracts"],
          pydantic_contract_version: "2.1.0"
        }
      }
    };

    function updateScenario(scenarioKey) {
      const data = scenarios[scenarioKey];
      if (!data) return;
      explorer.querySelector('#sim-concierge-status').textContent = data.status;
      explorer.querySelector('#val-bureau').innerHTML = data.bureau;
      explorer.querySelector('#val-payments').innerHTML = data.payments;
      explorer.querySelector('#val-card').innerHTML = data.card;
      explorer.querySelector('#val-contracts').innerHTML = data.contracts;
      explorer.querySelector('#sim-pydantic-code code').textContent = JSON.stringify(data.json, null, 2);
    }

    explorer.querySelectorAll('.agent-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        explorer.querySelectorAll('.agent-scenario-btn').forEach(b => b.classList.toggle('active', b === btn));
        updateScenario(btn.dataset.scenario);
      });
    });

    updateScenario('low_risk');
    target.append(explorer);
  }
}
function renderLegalArchitecture(project) {
  const target = $('#case-architecture');
  target.innerHTML = `<p class="architecture-intro">Duas esteiras conectadas pelo contexto do contrato.</p><div class="legal-entry"><span class="architecture-label">ENTRADA</span><strong>Projuris → Webhook REST → FastAPI</strong><small>Execução assíncrona com BackgroundTasks, em contêineres no Kubernetes.</small></div><div class="legal-pipelines"><section><p class="architecture-label">01 / INGESTÃO DOCUMENTAL</p><h3>Preparar o conhecimento</h3><ol><li><strong>Buscar documentos</strong><span>Download de contrato, proposta e aditivos no GED do Projuris.</span></li><li><strong>Extrair e normalizar</strong><span>PyMuPDF e python-docx; Tesseract quando houver documento escaneado.</span></li><li><strong>Fragmentar e indexar</strong><span>Chunks por seção, com contrato, versão, página e hash SHA-256.</span></li><li><strong>Gerar embeddings</strong><span>Vetores persistidos para recuperação por similaridade.</span></li></ol></section><section><p class="architecture-label">02 / AGENTE DE RAG</p><h3>Contextualizar e redigir</h3><ol><li><strong>Recuperar o histórico</strong><span>Busca vetorial filtrada por contrato e contexto do último aditivo em vigor.</span></li><li><strong>Gerar a proposta</strong><span>Agente geral e ferramentas modulares; Llama 3.1 8B como modelo principal.</span></li><li><strong>Validar e criar DOCX</strong><span>Regras determinísticas em Python e geração da minuta com python-docx.</span></li><li><strong>Devolver ao Projuris</strong><span>Anexação na requisição via SOAP GED, para revisão do advogado.</span></li></ol></section></div><div class="legal-store"><span class="architecture-label">BASE COMPARTILHADA</span><strong>PostgreSQL + pgvector · Amazon RDS</strong><small>Documentos, metadados, vetores e registros de execução. Busca com índice HNSW e similaridade de cosseno.</small></div><details class="architecture-details"><summary>Decisões e limites da arquitetura</summary><ul><li>A versão revisada utiliza BackgroundTasks do FastAPI para o processamento assíncrono.</li><li>Hash SHA-256 para evitar ingestão duplicada; metadados para preservar o vínculo com o contrato e a versão.</li><li>Fallback corporativo para falhas técnicas do modelo principal, desativado por padrão.</li><li>Arquivos temporários em volume persistente do Kubernetes; observabilidade prevista com Prometheus e Grafana.</li><li>Assinatura via DocuSign depende de comando posterior do advogado, após a revisão.</li></ul></details>`;
  const note = document.createElement('p'); note.className = 'case-note'; note.textContent = project.architectureNote; target.append(note);
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.project;
  const project = projects[key]; if (!project) return;
  lastProjectButton = button;
  $('#dialog-category').textContent = project.category;
  $('#dialog-title').textContent = project.title;
  $('#dialog-summary').textContent = project.summary;
  $('#dialog-tags').replaceChildren(...project.tags.map(label => {const tag=document.createElement('span');tag.textContent=label;return tag;}));
  $('#case-context').innerHTML = project.context;
  $('#case-learning').innerHTML = project.learning;
  $('#case-tab-context').textContent = project.contextLabel || 'Contexto';
  $('#case-tab-learning').textContent = project.learningLabel || 'Aprendizados';
  renderFlow(project, key);
  renderDemo(project);
  const source = $('#dialog-source'); source.hidden = !project.source;
  if (project.source) { source.href = project.source; source.textContent = project.sourceLabel; }
  else source.removeAttribute('href');
  $('.dialog-done').textContent = key === 'legal' ? 'Voltar ao portfólio ↙' : 'Voltar aos projetos ↙';
  activateTab(button.dataset.view === 'demo' && project.demo ? $('#case-tab-demo') : $('#case-tab-context'));
  dialog.showModal(); dialog.scrollTop = 0; document.body.classList.add('dialog-open');
}));
$$('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
let backdropStart = false;
dialog.addEventListener('pointerdown', event => {backdropStart = event.target === dialog;});
dialog.addEventListener('click', event => {if (event.target === dialog && backdropStart) dialog.close();});
dialog.addEventListener('close', () => {clearDemo();document.body.classList.remove('dialog-open');lastProjectButton?.focus({preventScroll:true});});
const copyBtn = $('#copy-profile');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const status = $('#copy-status');
    const url = 'https://www.linkedin.com/in/arthur-faria-e-silva-85b04a290/';
    const originalText = 'Copiar link do LinkedIn';
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      copyBtn.classList.add('copied');
      copyBtn.textContent = '✓ Link do LinkedIn copiado!';
      status.textContent = 'Copiado para a área de transferência!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.textContent = originalText;
        status.textContent = '';
      }, 2500);
    } catch {
      status.textContent = `Copie este link: ${url}`;
    }
  });
}
$('#year').textContent = String(new Date().getFullYear());



/* Dynamic Typist for Hero Specialties */
function initHeroTypewriter() {
  const target = document.getElementById('hero-rotating-text');
  if (!target) return;
  const words = [
    'Sistemas Multiagentes',
    'Arquiteturas RAG & pgvector',
    'IA Aplicada & Engenharia de Dados',

    'Integração de Modelos a Sistemas'
  ];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = true;
  const pauseEnd = 2400;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      target.textContent = currentWord.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, 35);
    } else {
      charIndex++;
      target.textContent = currentWord.substring(0, charIndex);
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, pauseEnd);
        return;
      }
      setTimeout(type, 65);
    }
  }

  setTimeout(type, pauseEnd);
}
initHeroTypewriter();

/* 3D Tilt and Specular Highlight for Project Cards */
function initProject3DTilt() {
  const cards = document.querySelectorAll('.project-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || window.innerWidth < 768) return;

  cards.forEach(card => {
    const visual = card.querySelector('.project-visual');
    if (!visual) return;

    let glow = visual.querySelector('.project-visual-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'project-visual-glow';
      visual.appendChild(glow);
    }

    card.addEventListener('mousemove', e => {
      const rect = visual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width - 0.5) * 2;
      const normY = (y / rect.height - 0.5) * 2;

      const rotateX = -normY * 7;
      const rotateY = normX * 7;

      visual.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

      const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));
      glow.style.background = `radial-gradient(circle at ${pctX.toFixed(1)}% ${pctY.toFixed(1)}%, rgba(245, 158, 11, 0.22) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      visual.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
initProject3DTilt();

/* Engineering Terminal (CLI) Implementation */
function initEngineeringTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const actionBtns = document.querySelectorAll('.terminal-btn');

  if (!output) return;

  const commands = {
    help: () => `
Comandos suportados:<br>
• <strong style="color:#fbbf24">skills</strong>: Detalhamento técnico da stack e proficiências<br>
• <strong style="color:#fbbf24">architecture</strong>: Filosofia de desenvolvimento de sistemas e agentes<br>
• <strong style="color:#fbbf24">metrics</strong>: Indicadores de engenharia e produção<br>
• <strong style="color:#fbbf24">whoami</strong>: Perfil e foco profissional de Arthur Faria<br>
• <strong style="color:#fbbf24">contact</strong>: Links diretos e canais de contato<br>
• <strong style="color:#fbbf24">clear</strong>: Limpa a janela do terminal
    `,
    skills: () => `
<strong style="color:#fbbf24">CORE STACK &amp; FERRAMENTAS:</strong><br>
[IA &amp; Agentes]     Python, LangChain, Google ADK, LangGraph, Prompt Engineering<br>
[Bancos &amp; Vetores] PostgreSQL, pgvector, BigQuery, Redis, SQLite<br>
[APIs &amp; Backend]   FastAPI, RESTful APIs, Spring Boot (Java), Pydantic<br>
[Eng. de Dados]   Pandas, PySpark, Data Pipelines, Extração/OCR<br>
[DevOps &amp; Cloud]  Docker, Git, Google Cloud Platform (GCP), Linux
    `,
    architecture: () => `
<strong style="color:#fbbf24">FILOSOFIA DE ARQUITETURA DE IA &amp; SOFTWARE:</strong><br>
1. <strong>Determinismo com Pydantic:</strong> LLMs geram saídas tipadas e validadas por esquemas estritos, sem alucinações de formato.<br>
2. <strong>Máquinas de Estados Explícitas:</strong> Orquestração multiagente delegada com escopos claros (Concierge + Especialistas).<br>
3. <strong>Human-in-the-Loop Obrigatório:</strong> Nenhuma automação crítica toma decisões jurídicas ou de crédito finais sem validação humana.<br>
4. <strong>RAG Híbrido &amp; Recuperação Densa:</strong> Busca vetorial com pgvector combinada com filtros relacionais para máxima precisão.
    `,
    metrics: () => `
<strong style="color:#fbbf24">BENCHMARKS &amp; MÉTRICAS EM DESTAQUE:</strong><br>
• <strong>Projetos Multiagente:</strong> 4 agentes especialistas simultâneos em produção piloto<br>
• <strong>Precisão de Extração:</strong> Validação estruturada via contratos Pydantic (100% de conformidade de schema)<br>
• <strong>Pipeline de Documentos:</strong> Geração automatizada de minutas preliminares DOCX integradas ao Projuris<br>
• <strong>Inspeção por Visão Computacional:</strong> Detecção em tempo real de garrafas PET com YOLO
    `,
    whoami: () => `
<strong style="color:#fbbf24">Arthur Faria e Silva</strong><br>
Estudante de Análise e Desenvolvimento de Sistemas no SENAI Gaspar Ricardo Jr.<br>
Estagiário em Engenharia de Dados &amp; IA na 2RP Net.<br>
Foco: Conectar dados corporativos, modelos de linguagem e engenharia de software robusta.
    `,
    contact: () => `
<strong style="color:#fbbf24">CANAL DE CONTATO:</strong><br>
• LinkedIn: <a href="https://www.linkedin.com/in/arthur-faria-e-silva-85b04a290/" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;text-decoration:underline">linkedin.com/in/arthur-faria-e-silva-85b04a290/</a><br>
• GitHub:   <a href="https://github.com/Arthur-2612" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;text-decoration:underline">github.com/Arthur-2612</a><br>
• Foco:     Estágio &amp; Oportunidades em IA Aplicada / Engenharia de Software
    `,
    clear: () => null
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      output.innerHTML = '';
      return;
    }

    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">arthur@portfolio:~$</span> <span class="terminal-cmd">${escapeHtml(cmd)}</span>`;
    output.appendChild(line);

    const outBox = document.createElement('div');
    outBox.className = 'terminal-output';

    if (commands[cmd]) {
      outBox.innerHTML = commands[cmd]();
    } else {
      outBox.innerHTML = `Comando não reconhecido: "<strong>${escapeHtml(cmd)}</strong>". Digite <span style="color:#f59e0b">help</span> para listar os comandos.`;
    }

    output.appendChild(outBox);
    output.scrollTop = output.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (form && input) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      executeCommand(input.value);
      input.value = '';
    });
  }

  actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) executeCommand(cmd);
    });
  });
}
initEngineeringTerminal();

/* Smooth Scroll Reveal Animations */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const targets = document.querySelectorAll('.section-head, .project-card, .stack-tabs, .stack-panel, .career-layout, .legal-feature, .contact-layout, .engineering-terminal');
  targets.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}
initScrollReveal();

/* Active Navigation Scrollspy */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id="terminal-section"]');
  const navLinks = document.querySelectorAll('#navigation a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secTop = sec.offsetTop - 140;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav-active');
      }
    });
  }, { passive: true });
}
initScrollSpy();





