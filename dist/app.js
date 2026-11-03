'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
/* Synthesized Web Audio API Sound Effects (Zero External Assets) */
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('portfolio_audio_enabled') === 'true';
    this.initUI();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('portfolio_audio_enabled', String(this.enabled));
    this.updateButton();
    if (this.enabled) {
      this.ensureContext();
      this.playTone(587.33, 0.08, 'sine', 0.08); // Chime D5
    }
  }

  initUI() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;
    this.updateButton();
    btn.addEventListener('click', () => this.toggle());
  }

  updateButton() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;
    btn.classList.toggle('muted', !this.enabled);
    btn.setAttribute('aria-label', this.enabled ? 'Desativar efeitos sonoros' : 'Ativar efeitos sonoros');
    btn.setAttribute('title', this.enabled ? 'Sons ativados (clique para silenciar)' : 'Sons desativados (clique para ativar)');
    const iconOn = btn.querySelector('.sound-icon-on');
    const iconOff = btn.querySelector('.sound-icon-off');
    if (iconOn && iconOff) {
      iconOn.hidden = !this.enabled;
      iconOff.hidden = this.enabled;
    }
  }

  playTone(freq, duration = 0.05, type = 'sine', gainVal = 0.04) {
    if (!this.enabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay policy
    }
  }

  click() {
    this.playTone(880, 0.035, 'triangle', 0.03);
  }

  pop() {
    this.playTone(440, 0.06, 'sine', 0.04);
  }

  modalOpen() {
    if (!this.enabled) return;
    this.playTone(392.00, 0.06, 'sine', 0.03);
    setTimeout(() => this.playTone(587.33, 0.08, 'sine', 0.04), 50);
  }

  modalClose() {
    if (!this.enabled) return;
    this.playTone(523.25, 0.05, 'sine', 0.03);
    setTimeout(() => this.playTone(392.00, 0.07, 'sine', 0.02), 45);
  }

  success() {
    if (!this.enabled) return;
    this.playTone(523.25, 0.06, 'sine', 0.04);
    setTimeout(() => this.playTone(659.25, 0.08, 'sine', 0.04), 55);
  }

  alert() {
    if (!this.enabled) return;
    this.playTone(311.13, 0.09, 'sawtooth', 0.03);
  }
}
const sfx = new SoundFX();

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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
  if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
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
    category: 'EXPERIÊNCIA NA 2RP NET / ESTÁGIO EM DATA & AI',
    title: 'Agente de IA para minutas contratuais',
    summary: 'Automatização da análise e elaboração de minutas de termos aditivos para cliente financeiro, com integração Projuris e RAG com pgvector.',
    tags: ['Python', 'FastAPI', 'Projuris', 'RAG', 'PostgreSQL', 'pgvector', 'Docker', 'Kubernetes'],
    contextLabel: 'Especificações',
    learningLabel: 'Qualidade',
    context: `<p class="case-note"><strong>Em desenvolvimento na 2RP Net.</strong> Solução de IA para elaboração e análise de termos aditivos contratuais para cliente do setor financeiro.</p><h3>O escopo da solução</h3><p>A elaboração de um termo aditivo contratual requer a comparação detalhada entre o contrato vigente, a proposta de alteração e o histórico de aditivos anteriores. O agente automatiza a recuperação contextual e apoia a redação de uma minuta preliminar editável.</p><h3>Minha atuação no projeto</h3><dl class="spec-list"><div><dt>Integração Projuris</dt><dd>Implementação da integração com a plataforma de gestão jurídica Projuris para consulta e ingestão de documentos a serem processados.</dd></div><div><dt>RAG com pgvector</dt><dd>Desenvolvimento dos mecanismos de RAG com PostgreSQL e pgvector para recuperação de informações relevantes ao contexto da minuta.</dd></div><div><dt>Testes e Avaliação</dt><dd>Implementação de testes e avaliação contínua da qualidade dos documentos processados, validando precisão e conformidade.</dd></div><div><dt>Revisão Obrigatória</dt><dd>Arquitetura orientada a Human-in-the-Loop: a validação e homologação jurídica permanecem obrigatórias para o advogado responsável.</dd></div></dl>`,
    learning: `<h3>Como a qualidade é avaliada</h3><p>Critérios técnicos e métricas contínuas para validação da solução:</p><dl class="spec-list"><div><dt>Extração e OCR</dt><dd>CER e WER em amostras com referência, além da conferência de datas, valores e campos críticos.</dd></div><div><dt>Recuperação RAG</dt><dd>Precision@K e Recall@K para avaliar se os trechos recuperados correspondem ao contexto contratual necessário.</dd></div><div><dt>Redação</dt><dd>Comparação com casos de referência homologados pelo jurídico e revisão humana das minutas.</dd></div><div><dt>Rastreabilidade</dt><dd>Referências aos documentos e às cláusulas utilizadas; identificação da execução e registro de status.</dd></div><div><dt>Operação</dt><dd>Acompanhamento de latência, falhas, uso do modelo e contingência.</dd></div></dl><p class="case-note">A revisão jurídica humana é obrigatória. A automação não aprova contratos nem substitui o parecer do advogado.</p>`,
    architectureNote: 'Arquitetura corporativa na nuvem com ingestão assíncrona, orquestração de ferramentas modulares, Docker e Kubernetes.',
    source: null
  },
  agents: {
    category: 'DADOS & IA / SISTEMA MULTIAGENTE',
    title: 'Agentes de IA para Análise de Crédito – Home Credit',
    summary: 'Arquitetura multiagentes com orquestrador Concierge e 4 especialistas delegados. Validação com mais de 30 testes e schemas Pydantic.',
    tags: ['Python', 'Google ADK', 'Pandas', 'Pydantic', 'BigQuery'],
    demo: {
      src: './assets/demos/home-credit.mp4',
      poster: './assets/demos/home-credit.jpg',
      duration: '3min29s',
      description: 'Veja a orquestração dos agentes no Google ADK em uma gravação do projeto.',
      source: 'https://www.linkedin.com/feed/update/urn:li:activity:7493019795823476736/'
    },
    context: '<h3>O problema</h3><p>As informações de um cliente estão distribuídas em sete tabelas do Home Credit. O projeto organiza esse contexto para responder perguntas sobre bureau, pagamentos, cartão e contratos.</p><h3>O que desenvolvi</h3><p>Desenvolvimento do subagente <strong>Bureau</strong>, responsável pela análise de informações do histórico de crédito externo dos clientes, integrado ao agente <strong>Concierge</strong> (orquestrador).</p><p>A solução conta com uma arquitetura multiagentes composta por 1 orquestrador e 4 agentes especialistas: <strong>Bureau, Pagamentos, Cartão e Contratos</strong>. Os resultados são estruturados em JSON via Pydantic e foram executados <strong>mais de 30 testes</strong> para validação do funcionamento e integração dos agentes.</p><p class="case-note">Desenvolvido em equipe durante o estágio na 2RP Net. A arquitetura, a equipe e as instruções de execução estão documentadas no repositório.</p>',
    flow: [
      ['Pergunta + cliente', 'O Concierge recebe a pergunta e o identificador do cliente.'],
      ['Delegação semântica', 'O ADK aciona os especialistas conforme o contexto.'],
      ['Ferramentas Python', 'Joins, agregações e cálculos sobre as tabelas relacionadas.'],
      ['Relatório JSON', 'Consolidação dos indicadores em schemas Pydantic validados com +30 testes.']
    ],
    architectureNote: 'A documentação inclui o mapeamento dos joins para BigQuery. As ferramentas de análise processam dados com Python e Pandas.',
    learning: '<h3>O que esse projeto me ajudou a entender</h3><ul><li>Desenvolvimento de subagentes com papéis bem delimitados (subagente Bureau com histórico externo).</li><li>Separar o cálculo dos indicadores da interpretação do modelo torna o fluxo determinístico.</li><li>Contratos de saída estruturados em JSON via Pydantic garantem consistência entre agentes.</li><li>Execução de mais de 30 testes automatizados para assegurar a conformidade da orquestração.</li></ul><p class="case-note">A experiência faz parte da minha formação em dados e IA aplicada. O repositório reúne a arquitetura, a equipe e as instruções de execução.</p>',
    source: 'https://github.com/Arthur-2612/multi-agent-system-synapse',
    sourceLabel: 'Código e documentação ↗'
  },
  exchange: {
    category: 'SISTEMAS & BACK-END / PROJETO INTEGRADOR',
    title: 'SENAI Exchange – Sistema de Trocas entre Alunos',
    summary: 'Plataforma para troca de materiais acadêmicos entre alunos do SENAI em arquitetura MVC com Spring Boot, banco PostgreSQL modelado e Docker.',
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Spring Data JPA', 'Docker', 'MVC'],
    demo: {
      src: './assets/demos/senai-exchange.mp4',
      poster: './assets/demos/senai-exchange.jpg',
      duration: '1min31s',
      description: 'Acompanhe a navegação pelo SENAI Exchange e veja a plataforma em funcionamento.',
      source: 'https://www.linkedin.com/feed/update/urn:li:activity:7473764030248120320/'
    },
    context: '<h3>O problema</h3><p>Plataforma para troca e compartilhamento de materiais acadêmicos, livros e ferramentas entre a comunidade de alunos do SENAI.</p><h3>Minha atuação no projeto</h3><p>Responsável direto pela <strong>modelagem e criação do banco de dados PostgreSQL</strong> e por sua integração completa com o back-end em <strong>Spring Boot</strong>.</p><p>Aplicação estruturada em camadas MVC, com APIs REST e persistência utilizando Spring Data JPA/Hibernate. Inclui gerenciamento de anúncios, propostas de troca, mensagens entre alunos, autenticação de usuários e ambiente conteinerizado com Docker Compose.</p><p class="case-note">Projeto Integrador do Tecnólogo em Análise e Desenvolvimento de Sistemas (SENAI Sorocaba).</p>',
    flow: [
      ['Interface web', 'HTML, CSS e JavaScript responsivo. Comunicação com a API usando Fetch.'],
      ['Spring Boot MVC', 'API REST modular e camadas de serviço e controle.'],
      ['JPA + PostgreSQL', 'Modelagem relacional completa, mapeamento ORM e integridade referencial.'],
      ['Docker Compose', 'Ambiente de desenvolvimento padronizado com PostgreSQL e pgAdmin.']
    ],
    architectureNote: 'Arquitetura monolítica modular: back-end em Spring Boot com Spring Data JPA e banco PostgreSQL conteinerizado via Docker Compose.',
    learning: '<h3>Da modelagem à aplicação</h3><ul><li>Modelagem relacional e criação de schemas PostgreSQL para fluxo de anúncios e trocas.</li><li>Construção de APIs REST robustas com Java e Spring Boot com persistência JPA/Hibernate.</li><li>Fluxos de autenticação, controle de estado de propostas e mensagens entre alunos.</li><li>Organização do ambiente com Docker para reprodutibilidade.</li></ul><p class="case-note">Aplicação da graduação em ADS, integrando boas práticas de back-end e banco de dados relacional.</p>',
    source: 'https://github.com/Arthur-2612/sistema-trocas-alunos',
    sourceLabel: 'Código e documentação ↗'
  },
  pet: {
    category: 'IA APLICADA & VISÃO / TCC DE MECATRÔNICA',
    title: 'IA para Inspeção de Garrafas PET – TCC de Mecatrônica',
    summary: 'Solução de visão computacional em Python (YOLO/Roboflow) integrada a CLP Omron em esteira industrial. Modelo com +200 imagens e +50 testes.',
    tags: ['Python', 'YOLO', 'Roboflow', 'CLP Omron', 'Visão Computacional', 'Automação'],
    context: '<h3>O problema</h3><p>Identificação automatizada de irregularidades (garrafas PET sem tampa ou sem rótulo) em esteira transportadora, evitando o envio de peças não-conformes.</p><h3>O que fiz no TCC</h3><p><strong>Meu TCC foi desenvolvido durante o Técnico em Mecatrônica no SENAI Sorocaba (jan/2024 - dez/2025):</strong></p><ul><li>Treinamento do modelo de visão computacional com <strong>mais de 200 imagens</strong> anotadas via Roboflow/YOLO para detecção de irregularidades.</li><li>Programação da lógica de controle e automação no <strong>CLP Omron</strong> para acionamento do mecanismo mecânico de ejeção.</li><li>Execução de <strong>mais de 50 testes</strong> do código Python para garantir confiabilidade e sincronia entre a inspeção visual e a rejeição física.</li><li>Integração completa entre visão computacional e automação industrial.</li></ul><p class="case-note">TCC de Mecatrônica desenvolvido em equipe no SENAI Gaspar Ricardo Jr. em 2025. Demonstração prática disponível no LinkedIn.</p>',
    flow: [
      ['Captura de imagens', 'Câmera instalada na esteira fornecendo frames em tempo real.'],
      ['Inferência com YOLO', 'Modelo treinado com +200 imagens processando os frames via Python.'],
      ['Detecção de irregularidades', 'Identificação instantânea de garrafas sem tampa ou sem rótulo.'],
      ['Acionamento de CLP Omron', 'Sinal digital enviado ao CLP para ejeção física da peça não-conforme (+50 testes).']
    ],
    architectureNote: 'O pipeline de visão computacional em Python comunica diretamente com o CLP Omron via protocolo industrial para controle em tempo real.',
    learning: '<h3>IA aplicada além da tela</h3><ul><li>Treinamento de visão computacional (+200 imagens) voltado a padrões industriais.</li><li>Conexão direta entre modelos de IA em Python e equipamentos de automação de fábrica (CLP Omron).</li><li>Validação exaustiva com mais de 50 testes para sincronismo mecânico e de software.</li><li>Visão ponta a ponta adquirida durante a formação no Técnico em Mecatrônica.</li></ul><p class="case-note">O projeto une inteligência artificial aplicada à robótica e automação industrial.</p>',
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
        sfx.click();
      });
    });

    updateScenario('low_risk');
    target.append(explorer);
  }
  if (key === 'pet') {
    const explorer = document.createElement('div');
    explorer.className = 'vision-explorer';
    explorer.innerHTML = `
      <div class="agent-sim-head">
        <span class="architecture-label">PLAYGROUND INTERATIVO · YOLO &amp; AUTOMAÇÃO INDUSTRIAL</span>
        <h3>Simulador da Esteira de Inspeção em Tempo Real</h3>
      </div>
      <p class="agent-sim-intro">Selecione uma amostra da esteira para testar a inferência YOLOv8 e o envio de sinal elétrico ao CLP Omron:</p>
      <div class="agent-scenarios" role="group" aria-label="Selecione uma amostra para inspecionar">
        <button class="agent-scenario-btn active" data-sample="conforme">Amostra 01 · Conforme (Tampa + Rótulo)</button>
        <button class="agent-scenario-btn" data-sample="sem_tampa">Amostra 02 · Sem Tampa (Defeito Rejeitado)</button>
        <button class="agent-scenario-btn" data-sample="sem_rotulo">Amostra 03 · Sem Rótulo (Defeito Rejeitado)</button>
      </div>

      <div class="vision-viewport">
        <div class="vision-stream-header">
          <span class="vision-live-tag">LIVE FEED · USB CAM [640×640 @ 30 FPS]</span>
          <span id="vision-inference-stat">INFERÊNCIA: 22.8ms · YOLOv8n</span>
        </div>

        <div class="vision-conveyor-stage">
          <div class="vision-bottle-render">
            <div class="bottle-cap" id="render-bottle-cap"></div>
            <div class="bottle-neck"></div>
            <div class="bottle-body">
              <div class="bottle-label" id="render-bottle-label">PET 500ML</div>
            </div>
            <div class="vision-bbox bbox-cap" id="bbox-cap">
              <span class="bbox-tag" id="tag-cap">tampa 97.4%</span>
            </div>
            <div class="vision-bbox bbox-label" id="bbox-label">
              <span class="bbox-tag" id="tag-label">rotulo 98.1%</span>
            </div>
          </div>
        </div>

        <div class="vision-telemetry-row">
          <div class="vision-metric-pill success" id="pill-verdict">
            <span>VEREDITO VISÃO IA</span>
            <strong id="vision-verdict">CONFORME (APROVADO)</strong>
          </div>
          <div class="vision-metric-pill" id="pill-clp">
            <span>SINAL CLP (OMRON)</span>
            <strong id="vision-clp">0V (DESATIVADO)</strong>
          </div>
          <div class="vision-metric-pill" id="pill-piston">
            <span>ATUADOR PNEUMÁTICO</span>
            <strong id="vision-piston">RECOLHIDO (FLUXO LIVRE)</strong>
          </div>
          <div class="vision-metric-pill">
            <span>CONFIANÇA MÉDIA</span>
            <strong id="vision-confidence">97.8%</strong>
          </div>
        </div>
      </div>
    `;

    const samples = {
      conforme: {
        capVisible: true,
        labelVisible: true,
        capAlert: false,
        labelAlert: false,
        capText: 'tampa 97.4%',
        labelText: 'rotulo 98.1%',
        stat: 'INFERÊNCIA: 22.8ms · YOLOv8n',
        verdict: 'CONFORME (APROVADO)',
        isSuccess: true,
        clp: '0V (ESTEIRA CONTÍNUA)',
        piston: 'RECOLHIDO (FLUXO LIVRE)',
        confidence: '97.8%'
      },
      sem_tampa: {
        capVisible: false,
        labelVisible: true,
        capAlert: true,
        labelAlert: false,
        capText: 'AUSÊNCIA: TAMPA 0.0%',
        labelText: 'rotulo 96.8%',
        stat: 'INFERÊNCIA: 24.1ms · YOLOv8n',
        verdict: 'REJEITADO (SEM TAMPA)',
        isSuccess: false,
        clp: '24V HIGH (PULSO 150ms)',
        piston: 'DISPARADO (DESCARTE)',
        confidence: '48.4%'
      },
      sem_rotulo: {
        capVisible: true,
        labelVisible: false,
        capAlert: false,
        labelAlert: true,
        capText: 'tampa 96.2%',
        labelText: 'AUSÊNCIA: RÓTULO 0.0%',
        stat: 'INFERÊNCIA: 23.5ms · YOLOv8n',
        verdict: 'REJEITADO (SEM RÓTULO)',
        isSuccess: false,
        clp: '24V HIGH (PULSO 150ms)',
        piston: 'DISPARADO (DESCARTE)',
        confidence: '48.1%'
      }
    };

    function updateSample(sampleKey) {
      const data = samples[sampleKey];
      if (!data) return;
      const capEl = explorer.querySelector('#render-bottle-cap');
      const labelEl = explorer.querySelector('#render-bottle-label');
      const bboxCap = explorer.querySelector('#bbox-cap');
      const bboxLabel = explorer.querySelector('#bbox-label');
      const tagCap = explorer.querySelector('#tag-cap');
      const tagLabel = explorer.querySelector('#tag-label');
      const pillVerdict = explorer.querySelector('#pill-verdict');
      const pillClp = explorer.querySelector('#pill-clp');
      const pillPiston = explorer.querySelector('#pill-piston');

      capEl.style.opacity = data.capVisible ? '1' : '0.15';
      labelEl.style.opacity = data.labelVisible ? '1' : '0.15';

      bboxCap.classList.toggle('bbox-alert', data.capAlert);
      tagCap.classList.toggle('alert-tag', data.capAlert);
      tagCap.textContent = data.capText;

      bboxLabel.classList.toggle('bbox-alert', data.labelAlert);
      tagLabel.classList.toggle('alert-tag', data.labelAlert);
      tagLabel.textContent = data.labelText;

      explorer.querySelector('#vision-inference-stat').textContent = data.stat;
      explorer.querySelector('#vision-verdict').textContent = data.verdict;
      explorer.querySelector('#vision-clp').textContent = data.clp;
      explorer.querySelector('#vision-piston').textContent = data.piston;
      explorer.querySelector('#vision-confidence').textContent = data.confidence;

      pillVerdict.className = `vision-metric-pill ${data.isSuccess ? 'success' : 'warning'}`;
      pillClp.className = `vision-metric-pill ${data.isSuccess ? '' : 'warning'}`;
      pillPiston.className = `vision-metric-pill ${data.isSuccess ? '' : 'warning'}`;

      if (data.isSuccess) {
        sfx.success();
      } else {
        sfx.alert();
      }
    }

    explorer.querySelectorAll('.agent-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        explorer.querySelectorAll('.agent-scenario-btn').forEach(b => b.classList.toggle('active', b === btn));
        updateSample(btn.dataset.sample);
      });
    });

    target.append(explorer);
  }

  if (key === 'exchange') {
    const explorer = document.createElement('div');
    explorer.className = 'exchange-explorer';
    explorer.innerHTML = `
      <div class="agent-sim-head">
        <span class="architecture-label">PLAYGROUND INTERATIVO · SPRING BOOT &amp; POSTGRESQL</span>
        <h3>Simulador do Ciclo de Requisição &amp; Transação ACID</h3>
      </div>
      <p class="agent-sim-intro">Teste as rotas da API REST do SENAI Exchange e acompanhe a esteira de validação, regras de serviço e persistência relacional:</p>
      <div class="agent-scenarios" role="group" aria-label="Selecione um endpoint para testar">
        <button class="agent-scenario-btn active" data-exchange="post_troca">POST /api/trocas · Solicitar Troca</button>
        <button class="agent-scenario-btn" data-exchange="get_itens">GET /api/itens?status=DISPONIVEL · Catálogo</button>
        <button class="agent-scenario-btn" data-exchange="put_aceite">PUT /api/trocas/14/aceitar · Aceite &amp; Conclusão</button>
      </div>

      <div class="exchange-sim-box">
        <div class="exchange-api-strip">
          <span class="exchange-method post" id="exchange-method">POST</span>
          <span id="exchange-path">/api/trocas</span>
          <span class="exchange-status-code" id="exchange-status">201 CREATED (18ms)</span>
        </div>

        <div class="agent-pydantic-output">
          <div class="pydantic-header">
            <span>RESPOSTA DO ENDPOINT (JSON SERIALIZADO COM JACKSON)</span>
            <span class="pydantic-status" id="exchange-res-status">STATUS HTTP 201 · SUCESSO</span>
          </div>
          <pre class="pydantic-code" id="exchange-code"><code></code></pre>
        </div>

        <div class="exchange-flow-steps">
          <div class="exchange-step-card">
            <small>ETAPA 01 · CONTROLLER</small>
            <strong id="ex-step1-title">Validação Jakarta</strong>
            <p id="ex-step1-desc">Recebimento do DTO com @Valid. Checagem de integridade dos IDs e campos obrigatórios.</p>
          </div>
          <div class="exchange-step-card">
            <small>ETAPA 02 · SERVICE</small>
            <strong id="ex-step2-title">Regras de Negócio</strong>
            <p id="ex-step2-desc">Garante que ambos os itens pertencem a cursos compatíveis e estão com status DISPONÍVEL.</p>
          </div>
          <div class="exchange-step-card">
            <small>ETAPA 03 · JPA / POSTGRES</small>
            <strong id="ex-step3-title">Transação ACID</strong>
            <p id="ex-step3-desc">Execução com @Transactional. Atualização atômica das chaves estrangeiras e logs de troca.</p>
          </div>
        </div>
      </div>
    `;

    const exchangeScenarios = {
      post_troca: {
        method: 'POST',
        methodClass: 'post',
        path: '/api/trocas',
        status: '201 CREATED (18ms)',
        resStatus: 'STATUS HTTP 201 · TRANSAÇÃO INICIADA',
        json: {
          id: 14,
          aluno_solicitante: {
            id: 204,
            nome: "Arthur Silva",
            curso: "Análise e Desenvolvimento de Sistemas"
          },
          item_oferecido: {
            id: 88,
            titulo: "Livro Algoritmos Estruturados (Cormen)",
            categoria: "LIVROS"
          },
          aluno_receptor: {
            id: 119,
            nome: "Beatriz Oliveira",
            curso: "Mecatrônica Industrial"
          },
          item_solicitado: {
            id: 52,
            titulo: "Kit de Componentes Arduino + Sensores",
            categoria: "ELETRONICA"
          },
          status: "PENDENTE_CONFIRMACAO",
          criado_em: "2026-10-30T14:22:00Z"
        },
        step1: { title: "Validação Jakarta", desc: "DTO validado com @NotNull e @Positive. Bloqueio de self-trade pelo proponente." },
        step2: { title: "Regra de Negócio", desc: "Verificação de disponibilidade dos itens na tabela 'tb_itens' e cálculo de afinidade." },
        step3: { title: "Persistência JPA", desc: "Inserção em 'tb_trocas' com status PENDENTE e bloqueio temporário do item." }
      },
      get_itens: {
        method: 'GET',
        methodClass: 'get',
        path: '/api/itens?status=DISPONIVEL&categoria=LIVROS',
        status: '200 OK (11ms)',
        resStatus: 'STATUS HTTP 200 · CATÁLOGO RETORNADO',
        json: {
          total_itens: 42,
          pagina: 0,
          total_paginas: 5,
          conteudo: [
            { id: 88, titulo: "Livro Algoritmos Estruturados", conservacao: "EXCELENTE", dono_id: 204 },
            { id: 91, titulo: "Clean Code - Robert C. Martin", conservacao: "NOVO", dono_id: 302 },
            { id: 104, titulo: "Arquitetura Limpa", conservacao: "BOM", dono_id: 115 }
          ]
        },
        step1: { title: "Filtros REST", desc: "Parâmetros mapeados para Specification JPA com predicados dinâmicos." },
        step2: { title: "Index PostgreSQL", desc: "Consulta otimizada por índice B-Tree composto em (status, categoria)." },
        step3: { title: "Jackson Serialization", desc: "Projeção de DTO leve para otimizar payload na esteira de rede." }
      },
      put_aceite: {
        method: 'PUT',
        methodClass: 'put',
        path: '/api/trocas/14/aceitar',
        status: '200 OK (24ms)',
        resStatus: 'STATUS HTTP 200 · TRANSAÇÃO CONCLUÍDA',
        json: {
          troca_id: 14,
          status_anterior: "PENDENTE_CONFIRMACAO",
          status_atual: "FINALIZADA",
          transferencia_propriedade: {
            item_88_novo_proprietario: 119,
            item_52_novo_proprietario: 204
          },
          audit_timestamp: "2026-10-30T14:23:45.102Z",
          notificacao_enviada: true
        },
        step1: { title: "Autenticação & Auth", desc: "Checagem de token JWT: apenas o receptor pode executar a confirmação." },
        step2: { title: "Lock Otimista (@Version)", desc: "Garante integridade concorrente caso o item tenha sido trocado simultaneamente." },
        step3: { title: "Commit @Transactional", desc: "Atualização atômica de donos e encerramento de todas as outras propostas concorrentes." }
      }
    };

    function updateExchange(scenarioKey) {
      const data = exchangeScenarios[scenarioKey];
      if (!data) return;
      const methodEl = explorer.querySelector('#exchange-method');
      methodEl.className = `exchange-method ${data.methodClass}`;
      methodEl.textContent = data.method;
      explorer.querySelector('#exchange-path').textContent = data.path;
      explorer.querySelector('#exchange-status').textContent = data.status;
      explorer.querySelector('#exchange-res-status').textContent = data.resStatus;
      explorer.querySelector('#exchange-code code').textContent = JSON.stringify(data.json, null, 2);

      explorer.querySelector('#ex-step1-title').textContent = data.step1.title;
      explorer.querySelector('#ex-step1-desc').textContent = data.step1.desc;
      explorer.querySelector('#ex-step2-title').textContent = data.step2.title;
      explorer.querySelector('#ex-step2-desc').textContent = data.step2.desc;
      explorer.querySelector('#ex-step3-title').textContent = data.step3.title;
      explorer.querySelector('#ex-step3-desc').textContent = data.step3.desc;

      sfx.click();
    }

    explorer.querySelectorAll('.agent-scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        explorer.querySelectorAll('.agent-scenario-btn').forEach(b => b.classList.toggle('active', b === btn));
        updateExchange(btn.dataset.exchange);
      });
    });

    updateExchange('post_troca');
    target.append(explorer);
  }

}
function renderLegalArchitecture(project) {
  const target = $('#case-architecture');
  target.innerHTML = `<p class="architecture-intro">Duas esteiras conectadas pelo contexto do contrato.</p><div class="legal-entry"><span class="architecture-label">ENTRADA</span><strong>Projuris → Webhook REST → FastAPI</strong><small>Execução assíncrona com BackgroundTasks, em contêineres no Kubernetes.</small></div><div class="legal-pipelines"><section><p class="architecture-label">01 / INGESTÃO DOCUMENTAL</p><h3>Preparar o conhecimento</h3><ol><li><strong>Buscar documentos</strong><span>Download de contrato, proposta e aditivos no GED do Projuris.</span></li><li><strong>Extrair e normalizar</strong><span>PyMuPDF e python-docx; Tesseract quando houver documento escaneado.</span></li><li><strong>Fragmentar e indexar</strong><span>Chunks por seção, com contrato, versão, página e hash SHA-256.</span></li><li><strong>Gerar embeddings</strong><span>Vetores persistidos para recuperação por similaridade.</span></li></ol></section><section><p class="architecture-label">02 / AGENTE DE RAG</p><h3>Contextualizar e redigir</h3><ol><li><strong>Recuperar o histórico</strong><span>Busca vetorial filtrada por contrato e contexto do último aditivo em vigor.</span></li><li><strong>Gerar a proposta</strong><span>Agente geral e ferramentas modulares; Llama 3.1 8B como modelo principal.</span></li><li><strong>Validar e criar DOCX</strong><span>Regras determinísticas em Python e geração da minuta com python-docx.</span></li><li><strong>Devolver ao Projuris</strong><span>Anexação na requisição via SOAP GED, para revisão do advogado.</span></li></ol></section></div><div class="legal-store"><span class="architecture-label">BASE COMPARTILHADA</span><strong>PostgreSQL + pgvector · Amazon RDS</strong><small>Documentos, metadados, vetores e registros de execução. Busca com índice HNSW e similaridade de cosseno.</small></div><details class="architecture-details"><summary>Decisões e limites da arquitetura</summary><ul><li>A versão revisada utiliza BackgroundTasks do FastAPI para o processamento assíncrono.</li><li>Hash SHA-256 para evitar ingestão duplicada; metadados para preservar o vínculo com o contrato e a versão.</li><li>Fallback corporativo para falhas técnicas do modelo principal, desativado por padrão.</li><li>Arquivos temporários em volume persistente do Kubernetes; observabilidade prevista com Prometheus e Grafana.</li><li>Assinatura via DocuSign depende de comando posterior do advogado, após a revisão.</li></ul></details>`;
  const note = document.createElement('p'); note.className = 'case-note'; note.textContent = project.architectureNote; target.append(note);
}
function openProjectModal(key, view = 'context') {
  const project = projects[key]; if (!project) return;
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
  activateTab(view === 'demo' && project.demo ? $('#case-tab-demo') : $('#case-tab-context'));
  dialog.showModal(); dialog.scrollTop = 0; document.body.classList.add('dialog-open');
  sfx.modalOpen();
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => {
  lastProjectButton = button;
  openProjectModal(button.dataset.project, button.dataset.view);
}));
$$('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
let backdropStart = false;
dialog.addEventListener('pointerdown', event => {backdropStart = event.target === dialog;});
dialog.addEventListener('click', event => {if (event.target === dialog && backdropStart) dialog.close();});
dialog.addEventListener('close', () => {clearDemo();document.body.classList.remove('dialog-open');lastProjectButton?.focus({preventScroll:true});sfx.modalClose();});
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
    'Cloud & Data Lakes no GCP',
    'Agentes de IA com n8n',
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

/* 3D Tilt and Specular Highlight for Project Cards and Hero Portrait */
function initProject3DTilt() {
  const cards = document.querySelectorAll('.project-card');
  const portrait = document.querySelector('.hero-portrait');
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

  if (portrait) {
    const frame = portrait.querySelector('.portrait-frame');
    if (frame) {
      portrait.addEventListener('mousemove', e => {
        const rect = frame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;
        const rotateX = -normY * 8;
        const rotateY = normX * 8;
        frame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale(1.01)`;
      });
      portrait.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      });
    }
  }
}
initProject3DTilt();

/* Engineering Terminal (CLI) Implementation */
function initEngineeringTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const actionBtns = document.querySelectorAll('.terminal-btn');
  const termSection = document.getElementById('terminal-section');
  const fullscreenBtn = document.getElementById('terminal-fullscreen-btn');
  const btnFullscreenDot = document.getElementById('term-btn-fullscreen');
  const btnClearDot = document.getElementById('term-btn-clear');
  const btnMinDot = document.getElementById('term-btn-min');

  if (!output) return;

  function toggleFullscreen() {
    if (!termSection) return;
    const isFs = termSection.classList.toggle('is-fullscreen');
    document.body.classList.toggle('terminal-open-fullscreen', isFs);
    if (fullscreenBtn) {
      fullscreenBtn.innerHTML = isFs ? '⤡ <span>REDUZIR</span>' : '⤢ <span>EXPANDIR</span>';
      fullscreenBtn.setAttribute('title', isFs ? 'Sair do modo tela cheia (ESC)' : 'Alternar modo tela cheia');
    }
    if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
    if (isFs && input) input.focus();
  }

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (btnFullscreenDot) btnFullscreenDot.addEventListener('click', toggleFullscreen);

  if (btnClearDot) {
    btnClearDot.addEventListener('click', () => {
      output.innerHTML = '';
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
    });
  }

  if (btnMinDot) {
    btnMinDot.addEventListener('click', () => {
      output.scrollTo({ top: 0, behavior: 'smooth' });
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && termSection && termSection.classList.contains('is-fullscreen')) {
      toggleFullscreen();
    }
  });

  const commands = {
    help: () => `
Comandos suportados:<br>
• <strong style="color:#fbbf24">projects</strong>: Resumo dos projetos práticos do portfólio<br>
• <strong style="color:#fbbf24">skills</strong>: Detalhamento técnico da stack e proficiências<br>
• <strong style="color:#fbbf24">certs</strong>: Certificações técnicas e badges oficiais (GCP, n8n, LGPD)<br>
• <strong style="color:#fbbf24">top</strong>: Monitor de processos e agentes em tempo real<br>
• <strong style="color:#fbbf24">cv</strong>: Ficha técnica curricular completa em ASCII<br>
• <strong style="color:#fbbf24">architecture</strong>: Filosofia de engenharia (Determinismo, Pydantic, Human-in-the-Loop)<br>
• <strong style="color:#fbbf24">metrics</strong>: Indicadores de engenharia e produção<br>
• <strong style="color:#fbbf24">traceroute</strong>: Rota de rede simulada para infraestrutura GCP<br>
• <strong style="color:#fbbf24">recruiter</strong>: Abrir painel executivo Modo Recrutador (⌘R)<br>
• <strong style="color:#fbbf24">theme</strong>: Alternar modo Matrix / Phosphor Green<br>
• <strong style="color:#fbbf24">pet</strong>: Detalhes da esteira de visão computacional YOLO<br>
• <strong style="color:#fbbf24">agents</strong>: Arquitetura multiagente do Home Credit<br>
• <strong style="color:#fbbf24">exchange</strong>: Stack e endpoints do SENAI Exchange<br>
• <strong style="color:#fbbf24">legal</strong>: Especificações do agente jurídico e RAG<br>
• <strong style="color:#fbbf24">whoami</strong>: Perfil e foco profissional de Arthur Faria e Silva<br>
• <strong style="color:#fbbf24">contact</strong>: Links diretos e canais de contato<br>
• <strong style="color:#fbbf24">clear</strong>: Limpa a janela do terminal
    `,
    top: () => `
<div style="font-family:var(--mono);font-size:0.72rem;line-height:1.45;color:#38bdf8;margin-bottom:6px">
[TOP - MONITOR DE PROCESSOS &amp; AGENTES EM TEMPO REAL]
PID   AGENT / PROCESSO        CPU%   MEM%    LATÊNCIA   STATUS
1042  agent-concierge (ADK)    1.2   48 MB    124 ms    LISTENING
1043  spec-bureau (Python)     0.8   62 MB    240 ms    IDLE
1044  spec-payments (Pandas)   2.4   74 MB    310 ms    PROCESSING
1045  spec-card (Pydantic)     0.4   44 MB    180 ms    IDLE
1046  spec-contracts (Schema)  1.1   52 MB    290 ms    IDLE
2090  yolo-pet-infer (ONNX)    8.7  180 MB   22.8 ms    ACTIVE (30fps)
3010  pgvector-hnsw (Postgres) 0.6   96 MB    4.2 ms    READY
</div>
<span style="color:#10b981">✓ 7 processos ativos. Sistema operando em estado nominal (0 falhas).</span>
    `,
    cv: () => `
<pre style="color:#fbbf24;font-family:var(--mono);font-size:0.72rem;line-height:1.45;margin:0">
================================================================================
ARTHUR FARIA E SILVA | DESENVOLVEDOR EM FORMAÇÃO | IA, AGENTES &amp; DADOS
Sorocaba, SP | (15) 99858-5979 | afaria2612@gmail.com
================================================================================
[RESUMO PROFISSIONAL]
Estudante de ADS no SENAI Sorocaba e estagiário em Data &amp; AI na 2RP Net.
Atuação em agentes de IA, RAG com PostgreSQL e pgvector, APIs REST, Python e Java/Spring Boot.
Formação técnica em Mecatrônica com experiência em visão computacional e automação industrial.

[FORMAÇÃO ACADÊMICA &amp; TÉCNICA]
• Tecnólogo em Análise e Desenvolvimento de Sistemas — Faculdade SENAI Sorocaba (jan/2026 – dez/2027)
• Técnico em Mecatrônica — SENAI Sorocaba (jan/2024 – dez/2025 · Onde realizei meu TCC)

[EXPERIÊNCIA PROFISSIONAL]
• Estagiário em Data &amp; AI — 2RP Net (mar/2026 – Atual · Sorocaba, SP)
  - Agente de IA para minutas de termos aditivos com integração Projuris e RAG no pgvector
  - Avaliação contínua de qualidade e testes com revisão jurídica humana obrigatória
  - Techs: Python, FastAPI, RAG, PostgreSQL, pgvector, Docker e Kubernetes

[PROJETOS &amp; MÉTRICAS]
• Home Credit: Subagente Bureau integrado ao Concierge (4 especialistas), +30 testes
• Inspeção PET (TCC Mecatrônica): Modelo YOLO com +200 imagens, CLP Omron, +50 testes
• SENAI Exchange: Modelagem banco PostgreSQL, Spring Boot MVC, REST APIs e Docker

[CERTIFICAÇÕES TÉCNICAS (2025–2026)]
• Google Cloud: Data Lakes e Data Warehouses no GCP (Badge Oficial, 2026)
• Google Cloud: Infraestrutura Geral do GCP (Badge Oficial, 2026)
• Hashtag Treinamentos: Agentes de IA com n8n (2026)
• SENAI Sorocaba: Lei Geral de Proteção de Dados - LGPD (2025)

[COMPETÊNCIAS TÉCNICAS]
• Linguagens: Python, Java, SQL, JavaScript, HTML, CSS
• IA &amp; Dados: RAG, pgvector, Google ADK, Pandas, Pydantic, BigQuery, YOLO, Roboflow
• Back-end &amp; DB: Spring Boot, Spring Data JPA, FastAPI, PostgreSQL, APIs REST, MVC
• DevOps &amp; Cloud: Git, GitHub, Docker, Docker Compose, Kubernetes, Google Cloud (GCP)
================================================================================
</pre>
<span style="color:#8f98a8">Dica: Você também pode abrir a ficha executiva com o comando <strong style="color:#fbbf24">recruiter</strong> ou pressionando o botão <strong style="color:#fbbf24">⚡ Modo Recrutador (⌘R)</strong>.</span>
    `,
    resume: () => commands.cv(),
    curriculo: () => commands.cv(),
    traceroute: () => `
<pre style="color:#34d399;font-family:var(--mono);font-size:0.72rem;line-height:1.4;margin:0">
traceroute to southamerica-east1.gcp.internal (10.128.0.1), 30 hops max:
 1  gateway.local (192.168.1.1)                   0.612 ms
 2  sp-sorocaba-edge01.isp.net (177.x.x.x)        2.431 ms
 3  as15169.google.com (108.170.245.x)            5.842 ms
 4  gcp-vpc-peering.southamerica-east1.internal   7.190 ms
 5  bigquery-service.sa-east1.internal            8.240 ms
</pre>
<span style="color:#10b981">✓ Conexão de baixa latência estabelecida com região GCP São Paulo (8.24ms).</span>
    `,
    theme: () => {
      if (!termSection) return '';
      const isMatrix = termSection.classList.toggle('theme-matrix');
      if (typeof sfx !== 'undefined' && sfx.pop) sfx.pop();
      return isMatrix ?
        '<span style="color:#10b981">● Tema Terminal Matrix (Phosphor Green) ATIVADO.</span>' :
        '<span style="color:#fbbf24">● Tema Obsidian Amber restaurado.</span>';
    },
    recruiter: () => {
      if (typeof window.openRecruiterDrawer === 'function') {
        window.openRecruiterDrawer();
        return '<span style="color:#fbbf24">⚡ Modo Recrutador / Resumo Executivo acionado.</span>';
      }
      return '<span style="color:#fbbf24">⚡ Modo Recrutador indisponível.</span>';
    },
    skills: () => `
<strong style="color:#fbbf24">CORE STACK &amp; FERRAMENTAS:</strong><br>
[Linguagens]       Python, Java, SQL, JavaScript, HTML, CSS<br>
[IA &amp; Agentes]     RAG, pgvector, Google ADK, LangChain, Pydantic, Prompts<br>
[Dados &amp; Visão]    Pandas, BigQuery, YOLO, Roboflow, Visão Computacional<br>
[Back-end &amp; DB]   Spring Boot, Spring Data JPA, FastAPI, PostgreSQL, MVC<br>
[DevOps &amp; Nuvem]  Docker, Docker Compose, Kubernetes, Git, GitHub, Google Cloud (GCP)
    `,
    certs: () => `
<strong style="color:#fbbf24">CERTIFICAÇÕES TÉCNICAS &amp; BADGES OFICIAIS:</strong><br>
1. <strong>Google Cloud — Data Lakes e Data Warehouses no GCP</strong> [2026]<br>
   • Emissor: Google Cloud | Badge de conclusão oficial<br>
   • Foco: BigQuery, Data Lakes analíticos, particionamento e pipelines escaláveis.<br>
<br>
2. <strong>Google Cloud — Infraestrutura Geral do GCP</strong> [2026]<br>
   • Emissor: Google Cloud | Badge de conclusão oficial<br>
   • Foco: Compute Engine, VPC &amp; Redes, IAM Security, Storage &amp; Governança Cloud.<br>
<br>
3. <strong>Agentes de IA com n8n</strong> [2026]<br>
   • Emissor: Hashtag Treinamentos<br>
   • Foco: Orquestração de Agentes com LangChain no n8n, Webhooks, APIs e memória de contexto.<br>
<br>
4. <strong>Lei Geral de Proteção de Dados (LGPD)</strong> [2025]<br>
   • Emissor: SENAI Sorocaba<br>
   • Foco: Conformidade regulatória (Lei nº 13.709/2018), Privacy by Design e governança de dados.<br>
<br>
<span style="color:#8f98a8">Dica: Visualize os cards interativos na aba <strong style="color:#fbbf24">04: Certificações</strong> da seção Trajetória.</span>
    `,
    certifications: () => commands.certs(),
    certificados: () => commands.certs(),
    badges: () => commands.certs(),
    architecture: () => `
<strong style="color:#fbbf24">FILOSOFIA DE ARQUITETURA DE IA &amp; SOFTWARE:</strong><br>
1. <strong>Determinismo com Pydantic:</strong> LLMs geram saídas tipadas e validadas por esquemas estritos, sem alucinações de formato.<br>
2. <strong>Máquinas de Estados Explícitas:</strong> Orquestração multiagente delegada com escopos claros (Concierge + Especialistas).<br>
3. <strong>Human-in-the-Loop Obrigatório:</strong> Nenhuma automação crítica toma decisões jurídicas ou de crédito finais sem validação humana.<br>
4. <strong>RAG Híbrido &amp; Recuperação Densa:</strong> Busca vetorial com pgvector combinada com filtros relacionais para máxima precisão.
    `,
    metrics: () => `
<strong style="color:#fbbf24">BENCHMARKS &amp; MÉTRICAS EM DESTAQUE:</strong><br>
• <strong>Home Credit (Multiagentes):</strong> Orquestrador Concierge + 4 especialistas, validação com <span style="color:#34d399">+30 testes</span> e schemas JSON via Pydantic.<br>
• <strong>Inspeção PET (TCC Mecatrônica):</strong> Modelo YOLO treinado com <span style="color:#34d399">+200 imagens</span>, integração com CLP Omron e <span style="color:#34d399">+50 testes</span> no código Python.<br>
• <strong>SENAI Exchange (Back-end ADS):</strong> Modelagem relacional PostgreSQL, Spring Boot MVC, Spring Data JPA/Hibernate e Docker.<br>
• <strong>Agente Jurídico (2RP Net):</strong> Integração Projuris, RAG com PostgreSQL e pgvector, geração DOCX e revisão humana obrigatória.
    `,
    whoami: () => `
<strong style="color:#fbbf24">Arthur Faria e Silva</strong> (18 anos · Sorocaba – SP)<br>
• <strong>Estagiário em Data &amp; AI</strong> na 2RP Net (mar/2026 – atual)<br>
• <strong>Graduando em ADS</strong> na Faculdade SENAI Sorocaba (jan/2026 – dez/2027)<br>
• <strong>Técnico em Mecatrônica</strong> pelo SENAI Sorocaba (jan/2024 – dez/2025 · Onde desenvolvi meu TCC)<br>
Foco: Soluções práticas unindo agentes de IA, RAG, APIs REST, Python, dados e engenharia de software.
    `,
    contact: () => `
<strong style="color:#fbbf24">CANAL DE CONTATO:</strong><br>
• LinkedIn: <a href="https://www.linkedin.com/in/arthur-faria-e-silva-85b04a290/" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;text-decoration:underline">linkedin.com/in/arthur-faria-e-silva-85b04a290/</a><br>
• GitHub:   <a href="https://github.com/Arthur-2612" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;text-decoration:underline">github.com/Arthur-2612</a><br>
• Email:    <a href="mailto:afaria2612@gmail.com" style="color:#f59e0b;text-decoration:underline">afaria2612@gmail.com</a><br>
• Foco:     Estágio &amp; Oportunidades em IA, Dados e Software
    `,
    projects: () => `
<strong style="color:#fbbf24">PROJETOS EM DESTAQUE NO PORTFÓLIO:</strong><br>
1. <strong>agents:</strong> Home Credit · Multiagentes com Google ADK, 4 especialistas, Pydantic e +30 testes.<br>
2. <strong>pet:</strong> IA para Inspeção de Garrafas PET (TCC Mecatrônica) · YOLO, Roboflow, CLP Omron, +200 imagens e +50 testes.<br>
3. <strong>exchange:</strong> SENAI Exchange · Modelagem PostgreSQL, Spring Boot MVC, REST APIs e Docker.<br>
4. <strong>legal:</strong> Agente Jurídico (2RP Net) · Projuris, RAG híbrido com pgvector e geração de minutas DOCX.<br>
<span style="color:#8f98a8">Dica: Digite o nome de qualquer projeto (ex: <span style="color:#fbbf24">pet</span>, <span style="color:#fbbf24">agents</span>, <span style="color:#fbbf24">meca</span>) para ver os detalhes técnicos.</span>
    `,
    projetos: () => commands.projects(),
    pet: () => `
<strong style="color:#fbbf24">INSPEÇÃO DE GARRAFAS PET · TCC DE MECATRÔNICA:</strong><br>
• <strong>Formação:</strong> Desenvolvido no Técnico em Mecatrônica no SENAI Sorocaba (jan/2024 – dez/2025).<br>
• <strong>Visão Computacional:</strong> Modelo treinado com +200 imagens anotadas (YOLO/Roboflow).<br>
• <strong>Testes &amp; Validação:</strong> Execução de +50 testes no código Python de inspeção.<br>
• <strong>Automação Industrial:</strong> Programação da lógica no CLP Omron para descarte mecânico em esteira.<br>
• <strong>Classes:</strong> Tampa (conforme/ausente), Rótulo (conforme/ausente) e Garrafa.
    `,
    meca: () => `
<strong style="color:#fbbf24">TÉCNICO EM MECATRÔNICA · SENAI SOROCABA:</strong><br>
• Período: jan/2024 – dez/2025 (Concluído)<br>
• Trabalho de Conclusão de Curso (TCC): IA para inspeção de garrafas PET em esteira automatizada.<br>
• Competências: Visão computacional (YOLO, Roboflow), automação industrial, comandos elétricos, CLP Omron, sensores e atuadores.
    `,
    mecatronica: () => commands.meca(),
    tcc: () => commands.pet(),
    agents: () => `
<strong style="color:#fbbf24">HOME CREDIT · SISTEMA MULTIAGENTE (GOOGLE ADK):</strong><br>
• <strong>Subagente Bureau:</strong> Responsável pela análise do histórico de crédito externo dos clientes.<br>
• <strong>Orquestração:</strong> Agente Concierge orquestrando 4 especialistas (Bureau, Pagamentos, Cartão e Contratos).<br>
• <strong>Contratos Pydantic:</strong> Estruturação dos resultados em JSON com validação determinística.<br>
• <strong>Testes:</strong> Execução de +30 testes para validação e integração dos agentes.
    `,
    exchange: () => `
<strong style="color:#fbbf24">SENAI EXCHANGE · PROJETO INTEGRADOR ADS:</strong><br>
• <strong>Modelagem de Banco:</strong> Responsável pela modelagem e criação do banco de dados PostgreSQL.<br>
• <strong>Back-end:</strong> Java com Spring Boot, Spring Data JPA/Hibernate e APIs REST em arquitetura MVC.<br>
• <strong>Recursos:</strong> Gestão de anúncios, propostas de troca, mensagens entre alunos e autenticação.<br>
• <strong>Infraestrutura:</strong> Conteinerização com Docker e Docker Compose.
    `,
    legal: () => `
<strong style="color:#fbbf24">AGENTE JURÍDICO · PROJURIS &amp; RAG (2RP NET):</strong><br>
• <strong>Escopo:</strong> Agente de IA para minutas de termos aditivos contratuais para cliente do setor financeiro.<br>
• <strong>Integração Projuris:</strong> Conexão para consulta e ingestão de documentos na esteira do agente.<br>
• <strong>RAG com pgvector:</strong> Recuperação contextual densa no PostgreSQL/pgvector para apoiar a minuta.<br>
• <strong>Testes &amp; Qualidade:</strong> Implementação de testes e avaliação contínua da qualidade dos documentos processados.<br>
• <strong>Governança:</strong> Human-in-the-Loop obrigatório (revisão jurídica humana antes de qualquer decisão).
    `,
    matrix: () => commands.theme(),
    clear: () => null
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      output.innerHTML = '';
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
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

    if (typeof sfx !== 'undefined' && sfx.pop) sfx.pop();
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






function runTerminalCmd(cmd) {
  const terminalSec = document.getElementById('terminal-section');
  if (terminalSec) terminalSec.scrollIntoView({ behavior: 'smooth' });
  const termInput = document.getElementById('terminal-input');
  if (termInput) {
    termInput.value = cmd;
    const form = document.getElementById('terminal-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }
}

/* Command Palette (Ctrl+K / ⌘K) Implementation */
function initCommandPalette() {
  const dialog = document.getElementById('command-palette-dialog');
  const openBtn = document.getElementById('open-cmd-palette');
  const input = document.getElementById('cmd-search-input');
  const list = document.getElementById('cmd-results-list');
  if (!dialog || !input || !list) return;

  const actions = [
    {
      group: 'PROJETOS SELECIONADOS',
      id: 'proj_agents',
      title: 'Home Credit · Multiagentes',
      desc: 'Orquestração com Google ADK, 4 especialistas e Pydantic',
      badge: 'Multiagentes',
      keywords: 'home credit agentes google adk pydantic dados python bigquery',
      run: () => openProjectModal('agents')
    },
    {
      group: 'PROJETOS SELECIONADOS',
      id: 'proj_pet',
      title: 'Inspeção de Garrafas PET · YOLO',
      desc: 'Detecção de irregularidades e acionamento de CLP industrial',
      badge: 'YOLO & Visão',
      keywords: 'pet garrafas yolo visao computacional clp esteira tcc senai roboflow',
      run: () => openProjectModal('pet')
    },
    {
      group: 'PROJETOS SELECIONADOS',
      id: 'proj_exchange',
      title: 'SENAI Exchange · Spring Boot',
      desc: 'Plataforma de troca com API REST, PostgreSQL e Docker',
      badge: 'Full-Stack',
      keywords: 'senai exchange spring boot java postgresql docker api rest pi',
      run: () => openProjectModal('exchange')
    },
    {
      group: 'PROJETOS SELECIONADOS',
      id: 'proj_legal',
      title: 'Agente Jurídico · Projuris & RAG',
      desc: 'Recuperação com pgvector e geração de minutas preliminares DOCX',
      badge: 'RAG & pgvector',
      keywords: 'legal projuris juridico rag pgvector fastapi minutas 2rp',
      run: () => openProjectModal('legal')
    },
    {
      group: 'NAVEGAÇÃO RÁPIDA',
      id: 'nav_projetos',
      title: 'Projetos Selecionados',
      desc: 'Ver a grade de projetos práticos e demonstrações em vídeo',
      badge: 'Seção',
      keywords: 'projetos cases portfolio video demos',
      run: () => { const el = document.getElementById('projetos'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    },
    {
      group: 'NAVEGAÇÃO RÁPIDA',
      id: 'nav_estudos',
      title: 'Tecnologias & Áreas de Atuação',
      desc: 'Explorar stack: IA & RAG, Agentes, Dados & ML, Integrações',
      badge: 'Seção',
      keywords: 'tecnologias stack estudos competencias',
      run: () => { const el = document.getElementById('estudos'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    },
    {
      group: 'NAVEGAÇÃO RÁPIDA',
      id: 'nav_terminal',
      title: 'Terminal Interativo CLI',
      desc: 'Linha de comando para explorar métricas, stack e arquitetura',
      badge: 'Terminal',
      keywords: 'terminal cli console comandos bash',
      run: () => {
        const el = document.getElementById('terminal-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        const termInput = document.getElementById('terminal-input');
        if (termInput) setTimeout(() => termInput.focus(), 300);
      }
    },
    {
      group: 'NAVEGAÇÃO RÁPIDA',
      id: 'nav_trajetoria',
      title: 'Trajetória & Formação',
      desc: 'ADS e Mecatrônica no SENAI Sorocaba · Estágio em Data & AI na 2RP Net',
      badge: 'Carreira',
      keywords: 'trajetoria carreira senai ads meca mecatronica 2rp net estagio formacao tcc',
      run: () => { const el = document.getElementById('trajetoria'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    },
    {
      group: 'NAVEGAÇÃO RÁPIDA',
      id: 'nav_certs',
      title: 'Certificações & Badges Oficiais',
      desc: 'Google Cloud (2), Agentes de IA com n8n e Governança LGPD',
      badge: 'Badges',
      keywords: 'certificacoes certs badges google cloud gcp n8n hashtag senai lgpd',
      run: () => {
        const tab = document.getElementById('career-tab-certs');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'NAVEGAÇÃO RÁPIDA',
      id: 'nav_conectar',
      title: 'Contato & Redes',
      desc: 'LinkedIn, GitHub e canais para contato profissional',
      badge: 'Contato',
      keywords: 'contato linkedin github email conectar',
      run: () => { const el = document.getElementById('conectar'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    },
    {
      group: 'FILTROS DE PROJETOS',
      id: 'filter_all',
      title: 'Filtrar: Todos os Projetos',
      desc: 'Exibir todos os 3 projetos selecionados',
      badge: 'Filtro',
      keywords: 'filtro todos all',
      run: () => {
        const btn = document.querySelector('[data-filter="all"]');
        if (btn) btn.click();
        const el = document.getElementById('projetos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'FILTROS DE PROJETOS',
      id: 'filter_data',
      title: 'Filtrar: Agentes & Dados',
      desc: 'Exibir projetos de multiagentes e engenharia de dados',
      badge: 'Filtro',
      keywords: 'filtro agentes dados multiagent',
      run: () => {
        const btn = document.querySelector('[data-filter="data"]');
        if (btn) btn.click();
        const el = document.getElementById('projetos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'FILTROS DE PROJETOS',
      id: 'filter_vision',
      title: 'Filtrar: Visão & IA',
      desc: 'Exibir projetos de visão computacional e automação',
      badge: 'Filtro',
      keywords: 'filtro visao ia yolo',
      run: () => {
        const btn = document.querySelector('[data-filter="vision"]');
        if (btn) btn.click();
        const el = document.getElementById('projetos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'FILTROS DE PROJETOS',
      id: 'filter_dev',
      title: 'Filtrar: Sistemas & Full-Stack',
      desc: 'Exibir projetos integradores e desenvolvimento backend',
      badge: 'Filtro',
      keywords: 'filtro sistemas dev web fullstack',
      run: () => {
        const btn = document.querySelector('[data-filter="dev"]');
        if (btn) btn.click();
        const el = document.getElementById('projetos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'DESTAQUES & RECURSOS',
      id: 'cmd_recruiter',
      title: 'Abrir Modo Recrutador / Resumo Executivo (⌘R)',
      desc: 'Ficha executiva completa com perfil, stack, projetos e certificações',
      badge: 'Executivo',
      keywords: 'recrutador recruiter resumo curriculo cv fast track perfil vaga estagio',
      run: () => {
        if (typeof window.openRecruiterDrawer === 'function') window.openRecruiterDrawer();
      }
    },
    {
      group: 'DESTAQUES & RECURSOS',
      id: 'cmd_traj_meca',
      title: 'Formação: Técnico em Mecatrônica (TCC)',
      desc: 'SENAI Sorocaba (jan/2024 – dez/2025) · Onde desenvolvi meu TCC em visão computacional',
      badge: 'Formação',
      keywords: 'meca mecatronica tcc senai sorocaba tecnico yolo clp omron formacao',
      run: () => {
        const tab = document.getElementById('career-tab-meca');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'DESTAQUES & RECURSOS',
      id: 'cmd_traj_work',
      title: 'Experiência: Estágio em Data & AI (2RP Net)',
      desc: 'Atuação em agentes de IA, RAG com PostgreSQL e pgvector e Projuris',
      badge: 'Atuação',
      keywords: '2rp net estagio trabalho experiencia data ai rag pgvector projuris',
      run: () => {
        const tab = document.getElementById('career-tab-work');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_term_fs',
      title: 'Terminal: Alternar Modo Tela Cheia',
      desc: 'Expandir o console de engenharia em tela cheia',
      badge: 'CLI',
      keywords: 'terminal tela cheia fullscreen expandir maximizar',
      run: () => {
        const fsBtn = document.getElementById('terminal-fullscreen-btn');
        if (fsBtn) fsBtn.click();
      }
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_skills',
      title: 'Executar: skills no Terminal',
      desc: 'Apresentar resumo detalhado da stack técnica',
      badge: 'CLI',
      keywords: 'skills terminal stack tecnologias python java',
      run: () => runTerminalCmd('skills')
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_arch',
      title: 'Executar: architecture no Terminal',
      desc: 'Filosofia de arquitetura, contratos Pydantic e Human-in-the-Loop',
      badge: 'CLI',
      keywords: 'architecture arquitetura terminal filosofia',
      run: () => runTerminalCmd('architecture')
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_metrics',
      title: 'Executar: metrics no Terminal',
      desc: 'Benchmarks de latência, número de especialistas e esteiras',
      badge: 'CLI',
      keywords: 'metrics metricas indicadores benchmarks terminal',
      run: () => runTerminalCmd('metrics')
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_certs',
      title: 'Executar: certs no Terminal',
      desc: 'Listar certificações oficiais e badges (GCP, n8n, LGPD)',
      badge: 'CLI',
      keywords: 'certs certificacoes badges gcp cloud n8n lgpd terminal',
      run: () => runTerminalCmd('certs')
    },
    {
      group: 'CERTIFICAÇÕES & BADGES',
      id: 'cert_gcp_datalake',
      title: 'GCP: Data Lakes e Data Warehouses (2026)',
      desc: 'Badge de conclusão oficial do Google Cloud · BigQuery e Pipelines',
      badge: 'Google Cloud',
      keywords: 'google cloud gcp data lakes data warehouses bigquery badge 2026',
      run: () => {
        const tab = document.getElementById('career-tab-certs');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'CERTIFICAÇÕES & BADGES',
      id: 'cert_gcp_infra',
      title: 'GCP: Infraestrutura Geral do GCP (2026)',
      desc: 'Badge oficial Google Cloud · Compute Engine, VPC e IAM Security',
      badge: 'Google Cloud',
      keywords: 'google cloud gcp infraestrutura compute engine vpc redes iam 2026',
      run: () => {
        const tab = document.getElementById('career-tab-certs');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'CERTIFICAÇÕES & BADGES',
      id: 'cert_n8n',
      title: 'Agentes de IA com n8n · Hashtag (2026)',
      desc: 'Orquestração de Agentes com LangChain, Webhooks e APIs',
      badge: 'Agentes IA',
      keywords: 'agentes ia n8n hashtag treinamentos langchain automacao 2026',
      run: () => {
        const tab = document.getElementById('career-tab-certs');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'CERTIFICAÇÕES & BADGES',
      id: 'cert_lgpd',
      title: 'Lei Geral de Proteção de Dados - LGPD (2025)',
      desc: 'SENAI Sorocaba · Conformidade, privacidade e Privacy by Design',
      badge: 'Governança',
      keywords: 'lgpd lei geral de protecao de dados senai privacidade compliance 2025',
      run: () => {
        const tab = document.getElementById('career-tab-certs');
        if (tab) tab.click();
        const el = document.getElementById('trajetoria');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_sound',
      title: 'Alternar Efeitos Sonoros da Interface',
      desc: 'Ativar ou desativar sintetizador Web Audio de microinterações',
      badge: 'Áudio',
      keywords: 'som audio som efeitos sonoros sound fx toggle',
      run: () => sfx.toggle()
    },
    {
      group: 'COMANDOS & UTILIDADES',
      id: 'cmd_copy',
      title: 'Copiar link do LinkedIn de Arthur',
      desc: 'Copia https://www.linkedin.com/in/arthur-faria-e-silva-85b04a290/ para o clipboard',
      badge: 'Social',
      keywords: 'copiar link linkedin perfil compartilhar',
      run: () => {
        const copyBtn = document.getElementById('copy-profile');
        if (copyBtn) copyBtn.click();
      }
    }
  ];

  let selectedIndex = 0;
  let filtered = [...actions];

  function openPalette() {
    dialog.showModal();
    input.value = '';
    renderResults('');
    input.focus();
    sfx.click();
  }

  function closePalette() {
    dialog.close();
    sfx.click();
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    filtered = actions.filter(item => {
      if (!q) return true;
      return item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q);
    });

    list.replaceChildren();

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'cmd-empty';
      empty.style.padding = '24px 16px';
      empty.style.textAlign = 'center';
      empty.style.color = '#8f98a8';
      empty.style.fontSize = '.85rem';
      empty.textContent = `Nenhum resultado para "${query}". Tente "pet", "skills", "rag" ou "projetos".`;
      list.appendChild(empty);
      return;
    }

    selectedIndex = Math.min(selectedIndex, filtered.length - 1);
    let currentGroup = '';

    filtered.forEach((item, index) => {
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        const groupEl = document.createElement('div');
        groupEl.className = 'cmd-group-label';
        groupEl.textContent = currentGroup;
        list.appendChild(groupEl);
      }

      const row = document.createElement('div');
      row.className = `cmd-item ${index === selectedIndex ? 'selected' : ''}`;
      row.setAttribute('role', 'option');
      row.setAttribute('aria-selected', String(index === selectedIndex));
      row.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon">›</span>
          <div class="cmd-item-title">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.desc)}</small>
          </div>
        </div>
        <span class="cmd-item-badge">${escapeHtml(item.badge)}</span>
      `;

      row.addEventListener('click', () => {
        closePalette();
        item.run();
      });

      row.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelection();
      });

      list.appendChild(row);
    });

    ensureVisible();
  }

  function updateSelection() {
    const items = list.querySelectorAll('.cmd-item');
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === selectedIndex);
      item.setAttribute('aria-selected', String(i === selectedIndex));
    });
    ensureVisible();
  }

  function ensureVisible() {
    const active = list.querySelector('.cmd-item.selected');
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  input.addEventListener('input', () => {
    selectedIndex = 0;
    renderResults(input.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) {
        selectedIndex = (selectedIndex + 1) % filtered.length;
        updateSelection();
        sfx.click();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length > 0) {
        selectedIndex = (selectedIndex - 1 + filtered.length) % filtered.length;
        updateSelection();
        sfx.click();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        const chosen = filtered[selectedIndex];
        closePalette();
        chosen.run();
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  if (openBtn) openBtn.addEventListener('click', openPalette);

  dialog.addEventListener('click', e => {
    if (e.target === dialog) closePalette();
  });

  document.addEventListener('keydown', e => {
    const isCtrlK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !dialog.open;
    if (isCtrlK || isSlash) {
      e.preventDefault();
      if (dialog.open) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });
}
initCommandPalette();

/* Tech Tag Synchronization & Highlighting across the Portfolio */
function initTechTagHighlight() {
  const allTags = document.querySelectorAll('.tags span, .tech-strip-inner span:not(.strip-label), .bento-pill');
  if (!allTags.length) return;

  const normalize = text => text.replace(/^[●\s]+/, '').trim().toLowerCase();

  allTags.forEach(tag => {
    const rawText = tag.textContent;
    const norm = normalize(rawText);
    if (!norm || norm.length < 2) return;

    tag.style.cursor = 'pointer';
    tag.setAttribute('title', `Destacar "${tag.textContent.trim()}" em todo o portfólio`);

    tag.addEventListener('mouseenter', () => {
      let matchCount = 0;
      allTags.forEach(other => {
        if (normalize(other.textContent) === norm) {
          other.classList.add('tag-highlighted');
          matchCount++;
        }
      });
      if (matchCount > 1) {
        sfx.pop();
      }
    });

    tag.addEventListener('mouseleave', () => {
      allTags.forEach(other => other.classList.remove('tag-highlighted'));
    });
  });
}
initTechTagHighlight();

/* Interactive Certifications Filter */
function initCertificationsFilter() {
  const filterBtns = document.querySelectorAll('.cert-filter-pill');
  const cards = document.querySelectorAll('.cert-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-cert-filter');
      filterBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;
        card.style.display = show ? 'flex' : 'none';
      });

      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
    });
  });
}
initCertificationsFilter();


/* Vector Search Sandbox removed per user request for visual clarity */
function initRagSandbox() {}
initRagSandbox();

/* Recruiter Fast-Track / Executive Summary Drawer */
function initRecruiterDrawer() {
  const drawer = document.getElementById('recruiter-drawer');
  const openPillBtn = document.getElementById('open-recruiter-drawer');
  const openHeaderBtn = document.getElementById('header-open-recruiter');
  const closeBtn = document.getElementById('close-recruiter-drawer');
  const copyContactBtn = document.getElementById('drawer-copy-contact');
  const printBtn = document.getElementById('drawer-print-btn');

  if (!drawer) return;

  function openDrawer() {
    drawer.showModal();
    if (typeof sfx !== 'undefined' && sfx.modalOpen) sfx.modalOpen();
  }

  function closeDrawer() {
    drawer.close();
    if (typeof sfx !== 'undefined' && sfx.modalClose) sfx.modalClose();
  }

  if (openPillBtn) openPillBtn.addEventListener('click', openDrawer);
  if (openHeaderBtn) openHeaderBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', e => {
    if (e.target === drawer) closeDrawer();
  });

  if (copyContactBtn) {
    copyContactBtn.addEventListener('click', async () => {
      const url = 'https://www.linkedin.com/in/arthur-faria-e-silva-85b04a290/';
      try {
        await navigator.clipboard.writeText(url);
        const originalText = copyContactBtn.textContent;
        copyContactBtn.textContent = 'Link copiado! ✓';
        copyContactBtn.style.color = '#10b981';
        if (typeof sfx !== 'undefined' && sfx.success) sfx.success();
        setTimeout(() => {
          copyContactBtn.textContent = originalText;
          copyContactBtn.style.color = '';
        }, 2500);
      } catch {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      if (typeof sfx !== 'undefined' && sfx.click) sfx.click();
      window.print();
    });
  }

  document.addEventListener('keydown', e => {
    const isCmdR = (e.metaKey || e.ctrlKey || e.altKey) && e.key.toLowerCase() === 'r';
    const tag = document.activeElement ? document.activeElement.tagName : '';
    const isEditing = ['INPUT', 'TEXTAREA'].includes(tag);

    if (isCmdR && !isEditing) {
      if (e.altKey || (e.ctrlKey && e.shiftKey) || e.metaKey) {
        e.preventDefault();
        if (drawer.open) closeDrawer();
        else openDrawer();
      }
    }
  });

  window.openRecruiterDrawer = openDrawer;
}
initRecruiterDrawer();
