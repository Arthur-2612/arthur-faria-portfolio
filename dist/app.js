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
    const explorer = document.createElement('div'); explorer.className = 'agent-explorer';
    explorer.innerHTML = '<h3>Explore os quatro especialistas</h3><div class="agent-buttons" role="group" aria-label="Selecionar agente especialista"></div><p id="agent-description" role="status" aria-live="polite"></p>';
    const names = {bureau:'Bureau',payments:'Pagamentos',card:'Cartão',contracts:'Contratos'};
    Object.entries(names).forEach(([id, name], i) => {
      const button = document.createElement('button');button.textContent = name;button.setAttribute('aria-pressed', String(i === 0));
      button.addEventListener('click', () => {
        explorer.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        explorer.querySelector('#agent-description').textContent = specialists[id];
      });
      explorer.querySelector('.agent-buttons').append(button);
    });
    explorer.querySelector('#agent-description').textContent = specialists.bureau;
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
$('#copy-profile').addEventListener('click', async () => {
  const status = $('#copy-status');
  const url = 'https://www.linkedin.com/in/arthur-faria-e-silva-85b04a290/';
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);status.textContent = 'Link copiado!';
  } catch {status.textContent = `Copie este link: ${url}`;}
});
$('#year').textContent = String(new Date().getFullYear());

/* Interactive Neural Network & Vector Node Canvas */
function initHeroNeuralCanvas() {
  const canvas = document.getElementById('hero-neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('inicio');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let animId = null;
  let isVisible = true;
  const mouse = { x: null, y: null, maxDist: 150 };

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
    initParticles();
  }

  function initParticles() {
    const count = width < 768 ? 28 : 55;
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.8 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        color: i % 4 === 0 ? '#83b5ff' : i % 4 === 1 ? '#5495ff' : i % 4 === 2 ? '#3b74e6' : '#a6ccff'
      });
    }
  }

  function update() {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > height) { p.y = height; p.vy *= -1; }

      // Mouse gentle interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.maxDist) {
          const force = (1 - dist / mouse.maxDist) * 0.03;
          p.x += dx * force;
          p.y += dy * force;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting edges
    const maxEdgeDist = width < 768 ? 95 : 125;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxEdgeDist) {
          const alpha = (1 - dist / maxEdgeDist) * 0.32;
          ctx.strokeStyle = `rgba(84, 149, 255, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw mouse connection
      if (mouse.x !== null && mouse.y !== null) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.maxDist) {
          const alpha = (1 - dist / mouse.maxDist) * 0.45;
          ctx.strokeStyle = `rgba(131, 181, 255, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const currentRadius = p.r + Math.sin(p.pulse) * 0.5;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
      ctx.fill();

      // Ambient node glow on key points
      if (i % 5 === 0) {
        ctx.fillStyle = 'rgba(84, 149, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function loop() {
    if (!isVisible) return;
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  hero.addEventListener('mousemove', event => {
    const rect = hero.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) {
      if (!animId) loop();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });
  observer.observe(hero);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  });

  resize();
  loop();
}
initHeroNeuralCanvas();

/* Dynamic Typist for Hero Specialties */
function initHeroTypewriter() {
  const target = document.getElementById('hero-rotating-text');
  if (!target) return;
  const words = [
    'Sistemas Multiagentes',
    'Arquiteturas RAG & pgvector',
    'IA Aplicada & Engenharia de Dados',
    'Visão Computacional & YOLO',
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
      glow.style.background = `radial-gradient(circle at ${pctX.toFixed(1)}% ${pctY.toFixed(1)}%, rgba(131, 181, 255, 0.28) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      visual.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}
initProject3DTilt();



