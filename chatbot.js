/* ═══════════════════════════════════════════════════
   SaaSNova Offline GTM Assistant — chatbot.js
   100% local, rule-based keyword matching. No API calls.
   Works as: (a) floating widget on every page (via #chatbot-fab
   + #sn-chatbot-panel injected by shared.js), or (b) full-page
   experience on chatbot.html (via #sn-chatbot-fullpage).
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const BOT_NAME = 'Nova';
  const STORAGE_KEY = 'sn_chat_history_v1';
  const CALENDLY_URL = 'https://calendly.com/jen-saasnova/founder-strategy-session-scale-your-gtm-via-aws?month=2026-03';

  /* ── 1. STYLES ─────────────────────────────────── */
  const CSS = `
    #chatbot-fab {
      position: fixed; bottom: 30px; right: 30px; z-index: 10050;
      width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, #008BF8, #FA0F9C);
      color: #fff; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 30px rgba(250,15,156,.35), 0 4px 12px rgba(0,139,248,.25);
      transition: transform .25s ease, box-shadow .25s ease;
    }
    #chatbot-fab:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 16px 40px rgba(250,15,156,.4); }
    #chatbot-fab svg { width: 26px; height: 26px; transition: opacity .15s ease, transform .15s ease; }
    #chatbot-fab .sn-fab-close-icon { display: none; }
    #chatbot-fab.open .sn-fab-chat-icon { display: none; }
    #chatbot-fab.open .sn-fab-close-icon { display: block; }
    #chatbot-fab .sn-fab-badge {
      position: absolute; top: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%;
      background: #34A853; border: 2px solid #fff; animation: sn-chat-pulse 2s infinite;
    }
    @keyframes sn-chat-pulse {
      0% { box-shadow: 0 0 0 0 rgba(52,168,83,.5); }
      70% { box-shadow: 0 0 0 8px rgba(52,168,83,0); }
      100% { box-shadow: 0 0 0 0 rgba(52,168,83,0); }
    }
    @media (max-width: 1024px) {
      #chatbot-fab { bottom: 24px; right: 24px; width: 54px; height: 54px; }
    }

    #sn-chatbot-panel {
      position: fixed; bottom: 105px; right: 30px; z-index: 10049;
      width: 380px; max-width: calc(100vw - 32px); height: 600px; max-height: calc(100vh - 120px);
      background: rgba(255, 255, 255, 0.95); border-radius: 22px; overflow: hidden;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 30px 80px rgba(15,25,35,.25), 0 4px 20px rgba(15,25,35,.1);
      display: flex; flex-direction: column;
      opacity: 0; transform: translateY(16px) scale(.98); pointer-events: none;
      transition: opacity .22s ease, transform .22s ease;
      font-family: 'Inter', system-ui, sans-serif;
      border: 1px solid rgba(0,0,0,.06);
    }
    #sn-chatbot-panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
    @media (max-width: 640px) {
      #sn-chatbot-panel { bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%; height: 100%; max-height: 100%; border-radius: 0; }
    }

    /* Full-page mode (chatbot.html) */
    #sn-chatbot-fullpage {
      max-width: 760px; margin: 0 auto; height: 640px;
      background: rgba(255, 255, 255, 0.95); border-radius: 24px; overflow: hidden;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 20px 60px rgba(15,25,35,.08); border: 1px solid #E8EEF4;
      display: flex; flex-direction: column;
    }
    @media (max-width: 640px) {
      #sn-chatbot-fullpage { border-radius: 16px; height: 70vh; }
    }

    .sn-chat-head {
      background: linear-gradient(135deg, #0A1628 0%, #0D1F45 60%, #1A0A2E 100%);
      color: #fff; padding: 18px 20px; display: flex; align-items: center; gap: 14px;
      flex-shrink: 0; position: relative; overflow: hidden;
    }
    .sn-chat-head::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse 60% 80% at 90% 0%, rgba(0,139,248,.35) 0%, transparent 55%);
    }
    
    .sn-chat-avatar {
      width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; position: relative; z-index: 1;
      background: #0F1923; border: 2px solid rgba(255, 255, 255, 0.15);
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .sn-chat-avatar img {
      width: 100%; height: 100%; object-fit: cover;
    }
    .sn-chat-head-text { flex: 1; min-width: 0; position: relative; z-index: 1; }
    .sn-chat-head-name { font-weight: 800; font-size: 16px; display: flex; align-items: center; gap: 6px; }
    .sn-chat-head-status { font-size: 12px; color: rgba(255,255,255,.55); display: flex; align-items: center; gap: 5px; margin-top: 2px; font-weight: 500; }
    .sn-chat-online-dot { width: 6px; height: 6px; border-radius: 50%; background: #34A853; flex-shrink: 0; }
    .sn-chat-head-actions { display: flex; gap: 6px; position: relative; z-index: 1; }
    .sn-chat-head-btn {
      width: 30px; height: 30px; border-radius: 8px; border: none; cursor: pointer;
      background: rgba(255,255,255,.08); color: rgba(255,255,255,.75); display: flex; align-items: center; justify-content: center;
      transition: background .15s ease;
    }
    .sn-chat-head-btn:hover { background: rgba(255,255,255,.18); color: #fff; }

    .sn-chat-body {
      flex: 1; overflow-y: auto; padding: 18px 16px; display: flex; flex-direction: column; gap: 12px;
      background: linear-gradient(180deg, #FAFBFF 0%, transparent 30%);
    }
    .sn-chat-body::-webkit-scrollbar { width: 6px; }
    .sn-chat-body::-webkit-scrollbar-thumb { background: #D0DAE6; border-radius: 3px; }

    .sn-msg { max-width: 84%; font-size: 14px; line-height: 1.55; animation: sn-msg-in .25s ease; }
    @keyframes sn-msg-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .sn-msg-bot { align-self: flex-start; }
    .sn-msg-user { align-self: flex-end; }
    .sn-msg-bubble { padding: 11px 14px; border-radius: 16px; word-wrap: break-word; }
    .sn-msg-bot .sn-msg-bubble {
      background: #fff; border: 1px solid #E8EEF4; color: #0F1923;
      border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(15,25,35,.03);
    }
    .sn-msg-user .sn-msg-bubble {
      background: linear-gradient(135deg, #008BF8, #FA0F9C);
      color: #fff; border-bottom-right-radius: 4px;
    }
    .sn-msg-bubble p { margin: 0 0 6px; color: inherit; line-height: 1.55; }
    .sn-msg-bubble p:last-child { margin-bottom: 0; }
    .sn-msg-bubble ul { margin: 4px 0 6px 18px; padding: 0; }
    .sn-msg-bubble li { margin-bottom: 3px; }
    .sn-msg-bubble strong { color: inherit; font-weight: 700; }
    .sn-msg-user .sn-msg-bubble strong { color: #fff; }

    .sn-chat-link-btn {
      display: inline-flex; align-items: center; gap: 6px; margin: 4px 6px 0 0;
      padding: 7px 13px; border-radius: 999px; font-size: 12.5px; font-weight: 700;
      background: rgba(0,139,248,.08); color: #008BF8; text-decoration: none;
      border: 1px solid rgba(0,139,248,.18); transition: all .15s ease;
    }
    .sn-chat-link-btn:hover { background: #008BF8; color: #fff; }
    .sn-chat-link-btn.sn-link-primary { background: #FA0F9C; color: #fff; border-color: #FA0F9C; }
    .sn-chat-link-btn.sn-link-primary:hover { background: #D90085; }
    .sn-chat-link-row { display: flex; flex-wrap: wrap; margin-top: 2px; }

    .sn-chat-quickreplies { display: flex; flex-wrap: wrap; gap: 8px; padding: 2px 2px 4px; align-self: flex-start; max-width: 100%; }
    .sn-qr-btn {
      padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer;
      background: #fff; border: 1.5px solid rgba(0,139,248,.25); color: #008BF8;
      transition: all .15s ease; font-family: inherit;
    }
    .sn-qr-btn:hover { background: #008BF8; color: #fff; transform: translateY(-1px); }

    .sn-chat-typing { align-self: flex-start; display: flex; gap: 4px; padding: 12px 14px; background: #fff; border: 1px solid #E8EEF4; border-radius: 16px; border-bottom-left-radius: 4px; }
    .sn-chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: #B7C4D1; animation: sn-typing-bounce 1.1s infinite ease-in-out; }
    .sn-chat-typing span:nth-child(2) { animation-delay: .15s; }
    .sn-chat-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes sn-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }

    .sn-chat-input-wrap {
      flex-shrink: 0; padding: 12px 14px 20px; border-top: 1px solid #E8EEF4;
      background: transparent; display: flex; align-items: center; gap: 8px;
    }
    .sn-chat-input {
      flex: 1; border: 1.5px solid #D0DAE6; border-radius: 999px; padding: 11px 16px;
      font-size: 14px; font-family: inherit; outline: none; transition: border-color .15s ease; min-width: 0;
    }
    .sn-chat-input:focus { border-color: #008BF8; box-shadow: 0 0 0 3px rgba(0,139,248,.08); }
    .sn-chat-send {
      width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer; flex-shrink: 0;
      background: linear-gradient(135deg, #008BF8, #FA0F9C); color: #fff;
      display: flex; align-items: center; justify-content: center; transition: transform .15s ease;
    }
    .sn-chat-send:hover { transform: scale(1.08); }
    .sn-chat-send:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  `;

  /* ── 2. KNOWLEDGE BASE ─────────────────────────── */
  function linkBtn(href, label, primary) {
    const target = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}" class="sn-chat-link-btn${primary ? ' sn-link-primary' : ''}"${target}>${label}</a>`;
  }
  function linkRow(...links) { return `<div class="sn-chat-link-row">${links.join('')}</div>`; }

  const MAIN_MENU_QR = [
    { label: '🚀 Programs & Services', msg: 'services' },
    { label: '📊 Case Studies', msg: 'case studies' },
    { label: '🏢 About SaaSNova', msg: 'about saasnova' },
    { label: '🤝 Partners', msg: 'partners' },
    { label: '📰 Blog', msg: 'blog' },
    { label: '💬 Book a Call', msg: 'book a call' }
  ];

  // Massive expansion of intents to cover the entire execution strategy. No filler, no AI phrasing.
  const INTENTS = [
    {
      id: 'greeting',
      patterns: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy'],
      response: `<p>Hello. I am <strong>${BOT_NAME}</strong>, SaaSNova's GTM assistant. I provide direct answers regarding our execution programs, pricing, and partner alignments.</p><p>What do you need to find?</p>`,
      quickReplies: MAIN_MENU_QR
    },
    {
      id: 'about',
      patterns: ['what is saasnova', 'who are you', 'about saasnova', 'company', 'what do you do', 'tell me about', 'who is this'],
      response: `<p><strong>SaaSNova</strong> is an operator-led cloud GTM execution engine for SaaS ISVs scaling through the <strong>AWS, Azure, and GCP</strong> marketplaces.</p><p>We do not provide generic strategy decks. We execute. We activate field relationships, manage co-sell motions, and deliver board-ready pipeline evidence. SaaSNova was founded by <strong>Jen Dawson</strong>, a 25-year cloud GTM practitioner who has activated over 100 ISVs.</p>${linkRow(linkBtn('about.html', 'Meet the Team'))}`,
      quickReplies: [{ label: 'Our Programs', msg: 'programs' }, { label: 'Case Studies', msg: 'case studies' }]
    },
    {
      id: 'services_overview',
      patterns: ['services', 'what services', 'programs', 'solutions', 'what do you offer', 'help with', 'offerings'],
      response: `<p>SaaSNova executes across two primary tracks:</p><p><strong>GTM Programs:</strong></p><ul><li><strong>Ignite:</strong> 1 month. Marketplace activation for unlisted or zero-traction ISVs.</li><li><strong>SuperNova:</strong> 4 months. US market entry for global ISVs.</li><li><strong>NovaX:</strong> 6 months. Multi-cloud scale across AWS, Azure, and GCP.</li></ul><p><strong>Managed Services:</strong></p><ul><li><strong>PDMaaS:</strong> Partner Development as a Service.</li><li><strong>PMMaaS:</strong> Partner Marketing as a Service.</li><li><strong>PALaaS:</strong> Partner Alliance Lead as a Service.</li><li><strong>PRMaaS:</strong> Partner Revenue Measurement implementation.</li></ul>${linkRow(linkBtn('services.html', 'See Full Solutions Matrix', true))}`,
      quickReplies: [{ label: 'Ignite', msg: 'ignite' }, { label: 'SuperNova', msg: 'supernova' }, { label: 'NovaX', msg: 'novax' }, { label: 'Managed Services', msg: 'managed services' }]
    },
    {
      id: 'ignite',
      patterns: ['ignite'],
      response: `<p><strong>SaaSNova Ignite:</strong> 1 month of rapid cloud GTM activation.</p><p>This program is built for SaaS ISVs who require a new marketplace listing or are currently listed but generating zero pipeline. Ignite delivers an optimized listing, baseline Better Together messaging, Partner Portal validation, and initial co-sell execution.</p><p><strong>Target Stage:</strong> Pre-Series A to Series A.</p>${linkRow(linkBtn('ignite.html', 'Explore Ignite', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'supernova',
      patterns: ['supernova', 'super nova'],
      response: `<p><strong>SaaSNova SuperNova:</strong> 4 months of aggressive US market entry. This is our most requested program.</p><p>SuperNova is designed specifically for APAC and EMEA ISVs entering the US market. We execute US channel activation, direct field engagement, and establish verifiable attribution models for cloud-influenced deals.</p><p><strong>Target Stage:</strong> Series A to Series B.</p>${linkRow(linkBtn('supernova.html', 'Explore SuperNova', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'novax',
      patterns: ['novax', 'nova x'],
      response: `<p><strong>SaaSNova NovaX:</strong> 6 months of multi-cloud GTM scale.</p><p>NovaX is for ISVs expanding beyond single-cloud traction into repeatable revenue across AWS, Azure, and GCP. The program deploys PRM-powered partner lifecycle automation and scales active field alignment.</p><p><strong>Target Stage:</strong> Series B to Series C.</p>${linkRow(linkBtn('novax.html', 'Explore NovaX', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'compare_programs',
      patterns: ['compare programs', 'difference between ignite supernova novax', 'which program', 'program comparison'],
      response: `<p>Here is the breakdown by timeline and objective:</p><ul><li><strong>Ignite (1 month):</strong> Base activation for silent listings.</li><li><strong>SuperNova (4 months):</strong> Dedicated US market entry.</li><li><strong>NovaX (6 months):</strong> Multi-cloud scale for mature ISVs.</li></ul><p>If you are unsure of your requirements, book a Strategy Session. Jen Dawson will provide a direct recommendation based on your current cloud posture.</p>${linkRow(linkBtn('services.html', 'View Full Matrix'), linkBtn(CALENDLY_URL, 'Book a Call', true))}`,
      quickReplies: MAIN_MENU_QR.slice(0, 4)
    },
    {
      id: 'managed_services',
      patterns: ['managed services', 'fractional', 'fractional services'],
      response: `<p>SaaSNova offers fractional execution roles to augment your existing team. We provide PDMaaS (Partner Development), PMMaaS (Partner Marketing), and PALaaS (Alliance Leadership).</p><p>These roles run weekly field alignment, co-sell pipeline progression, and funding workflows.</p>`,
      quickReplies: [{ label: 'PDMaaS', msg: 'pdmaas' }, { label: 'PMMaaS', msg: 'pmmaas' }, { label: 'PALaaS', msg: 'palaas' }]
    },
    {
      id: 'pdmaas',
      patterns: ['pdmaas', 'pdm as a service', 'partner development'],
      response: `<p><strong>PDMaaS:</strong> A fractional Partner Development Manager. This role drives weekly field alignment, manages co-sell pipeline progression via ACE or Partner Center, and secures cloud funding.</p>${linkRow(linkBtn('pdmaas.html', 'Explore PDMaaS', true))}`,
      quickReplies: [{ label: 'PMMaaS', msg: 'pmmaas' }, { label: 'PALaaS', msg: 'palaas' }]
    },
    {
      id: 'pmmaas',
      patterns: ['pmmaas', 'pmm as a service', 'partner marketing'],
      response: `<p><strong>PMMaaS:</strong> Partner Marketing as a Service. We build cloud-aligned Better Together messaging, operationalize co-sell pitch decks, and continuously optimize your Marketplace listing.</p>${linkRow(linkBtn('pmmaas.html', 'Explore PMMaaS', true))}`,
      quickReplies: [{ label: 'PDMaaS', msg: 'pdmaas' }, { label: 'PALaaS', msg: 'palaas' }]
    },
    {
      id: 'palaas',
      patterns: ['palaas', 'pal as a service', 'alliance lead', 'partner alliance'],
      response: `<p><strong>PALaaS:</strong> Executive Alliance Leadership. We handle cross-cloud coordination, Quarterly Business Review preparation, program tiering navigation, and executive stakeholder alignment.</p>${linkRow(linkBtn('palaas.html', 'Explore PALaaS', true))}`,
      quickReplies: [{ label: 'PDMaaS', msg: 'pdmaas' }, { label: 'PMMaaS', msg: 'pmmaas' }]
    },
    {
      id: 'prmaas',
      patterns: ['prmaas', 'prm as a service', 'partner revenue measurement', 'prm deadline', 'prm implementation'],
      response: `<p><strong>PRMaaS</strong> is a required implementation to track cloud-influenced revenue. We handle resource tagging, Infrastructure as Code alignment, and attribution validation.</p><p>AWS mandates PRM completion by <strong>July 31, 2026</strong>. Failure to comply results in blocked funding and loss of co-sell status.</p>${linkRow(linkBtn('prmaas.html', 'Explore PRMaaS', true), linkBtn('blog-aws-prm-deadline.html', 'Read the Deadline Alert'))}`,
      quickReplies: [{ label: 'Book PRM Call', msg: 'book a call' }]
    },
    {
      id: 'case_studies',
      patterns: ['case studies', 'case study', 'results', 'roi', 'proof', 'success stories', 'testimonials'],
      response: `<p>We focus on verifiable, attributable results. For example:</p><ul><li><strong>Arctic Wolf:</strong> Generated 2,000+ Partner Sourced Qualified Leads, delivered a 9X ROI, and achieved fully managed AWS status.</li><li><strong>Dataminr:</strong> Graduated to AWS Rising Star in under 12 months and secured $300K in Market Development Funds.</li></ul>${linkRow(linkBtn('case-study.html', 'Read Case Studies', true))}`,
      quickReplies: [{ label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'pricing',
      patterns: ['price', 'pricing', 'cost', 'how much', 'budget', 'fees', 'rate'],
      response: `<p>SaaSNova scopes pricing directly to your cloud mix, market stage, and revenue targets. We do not use flat-rate retainers.</p><p>The required first step is a 30-minute Execution Strategy Session to define your baseline and establish the required execution model.</p>${linkRow(linkBtn(CALENDLY_URL, 'Book the Strategy Session', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }]
    },
    {
      id: 'book_call',
      patterns: ['book a call', 'book a demo', 'schedule a call', 'talk to sales', 'strategy session', 'calendly', 'consultation', 'speak to someone', 'get started'],
      response: `<p>Understood. You can book a 30-minute <strong>Execution Strategy Session</strong> using the link below. Jen Dawson reviews all submissions personally to prepare an initial gap analysis.</p>${linkRow(linkBtn(CALENDLY_URL, 'Open Calendly', true), linkBtn('contact.html', 'Send a Message'))}`,
      quickReplies: [{ label: 'Contact Info', msg: 'contact' }]
    },
    {
      id: 'contact',
      patterns: ['contact', 'email', 'phone', 'reach you', 'get in touch', 'talk to a human'],
      response: `<p>Direct contact information:</p><ul><li>📧 <strong>jen@saasnova.ai</strong></li><li>📧 marketing@saasnova.ai</li><li>📞 +1 (201) 755-5369</li></ul>${linkRow(linkBtn('contact.html', 'Open Contact Form', true))}`,
      quickReplies: [{ label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'partners',
      patterns: ['partners', 'partnership', 'ecosystem', 'who do you work with'],
      response: `<p>SaaSNova builds a complete execution ecosystem to support our ISVs:</p><ul><li><strong>SaaSify:</strong> Listing infrastructure and transaction automation.</li><li><strong>Workspan:</strong> Co-sell tracking and pipeline integration.</li><li><strong>Pronix:</strong> Global SI and enterprise deployment.</li><li><strong>Carahsoft:</strong> Public sector distribution and CPPO execution.</li></ul>${linkRow(linkBtn('partners.html', 'View Partner Ecosystem', true))}`,
      quickReplies: [{ label: 'Carahsoft', msg: 'carahsoft' }, { label: 'SaaSify', msg: 'saasify' }, { label: 'Pronix', msg: 'pronix' }]
    },
    {
      id: 'carahsoft',
      patterns: ['carahsoft', 'cppo', 'public sector', 'distribution', 'government'],
      response: `<p><strong>Carahsoft</strong> is our strategic distribution partner. We combine their Master Government Aggregator status and CPPO transaction capabilities with SaaSNova's hands-on AWS Marketplace execution to rapidly scale ISV revenue in the public sector and enterprise channels.</p>${linkRow(linkBtn('partner-carahsoft.html', 'Review Carahsoft Partnership', true))}`,
      quickReplies: [{ label: 'All Partners', msg: 'partners' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'saasify',
      patterns: ['saasify', 'listing partner', 'automation'],
      response: `<p><strong>SaaSify</strong> provides the foundational marketplace infrastructure. SaaSNova drives the GTM execution. Together, we deliver the AWS Partner Starter Bundle to make ISVs market-ready and co-sell active simultaneously.</p>${linkRow(linkBtn('partner-saasify.html', 'Review SaaSify Partnership', true))}`,
      quickReplies: [{ label: 'All Partners', msg: 'partners' }]
    },
    {
      id: 'pronix',
      patterns: ['pronix', 'si partner', 'gsi partner', 'system integrator'],
      response: `<p><strong>Pronix</strong> brings deep systems integration delivery. We unify their enterprise deployment frameworks with SaaSNova's continuous commercial alignment to solidify cloud marketplace adoption strategies.</p>${linkRow(linkBtn('partner-pronix.html', 'Review Pronix Partnership', true))}`,
      quickReplies: [{ label: 'All Partners', msg: 'partners' }]
    },
    {
      id: 'blog',
      patterns: ['blog', 'articles', 'resources', 'read', 'insights', 'news'],
      response: `<p>SaaSNova publishes practitioner-led intelligence on cloud execution. Recent articles cover the July 31 AWS PRM Deadline, fixing silent marketplace listings, and the new Carahsoft partnership.</p>${linkRow(linkBtn('blog.html', 'Access the Blog', true))}`,
      quickReplies: [{ label: 'Subscribe to Newsletter', msg: 'newsletter' }]
    },
    {
      id: 'newsletter',
      patterns: ['newsletter', 'nova brief', 'subscribe', 'weekly email'],
      response: `<p><strong>The Nova Brief</strong> delivers weekly co-sell tactics and field motion intelligence directly from Jen Dawson. It contains actionable execution strategy, not marketing filler.</p>${linkRow(linkBtn('newsletter.html', 'Subscribe', true))}`
    },
    {
      id: 'clouds',
      patterns: ['which clouds', 'aws azure gcp', 'multi cloud', 'multicloud', 'cloud providers', 'hyperscalers'],
      response: `<p>We execute multi-cloud scale. SaaSNova builds alignment and pipeline across <strong>AWS</strong>, <strong>Microsoft Azure</strong>, and <strong>Google Cloud (GCP)</strong> with dedicated subject matter expertise for each environment.</p>${linkRow(linkBtn('services.html', 'See Programs'))}`
    },
    {
      id: 'jen',
      patterns: ['jen dawson', 'founder', 'ceo', 'who founded', 'who runs saasnova'],
      response: `<p><strong>Jen Dawson</strong> is the Founder and CEO of SaaSNova. She is a 25-year cloud GTM practitioner who previously served as a Global GTM Lead at AWS. She has directed the marketplace activation for over 100 ISVs.</p>${linkRow(linkBtn('about.html', 'Read Bio', true))}`
    },
    {
      id: 'thanks',
      patterns: ['thanks', 'thank you', 'appreciate it', 'awesome', 'great', 'cool thanks', 'ok', 'okay'],
      response: `<p>Understood. Let me know what else you need to verify, or book a strategy session with the team when you are ready.</p>`,
      quickReplies: [{ label: 'Book a Call', msg: 'book a call' }, { label: 'Main Menu', msg: 'menu' }]
    },
    {
      id: 'bye',
      patterns: ['bye', 'goodbye', 'see you', 'that\'s all', 'no thanks', 'nothing else', 'exit'],
      response: `<p>Goodbye. Feel free to re-engage if you require further details.</p>`
    },
    {
      id: 'menu',
      patterns: ['menu', 'main menu', 'start over', 'options', 'help'],
      response: `<p>Here are the primary execution areas:</p>`,
      quickReplies: MAIN_MENU_QR
    }
  ];

  const FALLBACK_RESPONSE = `<p>I do not have a defined answer for that query. I recommend reviewing our execution programs or booking time to speak directly with Jen Dawson.</p>${linkRow(linkBtn(CALENDLY_URL, 'Book a Strategy Session', true), linkBtn('contact.html', 'Contact Us'))}`;

  /* ── 3. MATCHING ENGINE ────────────────────────── */
  function normalize(s) {
    return (s || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  function findIntent(rawText) {
    const t = normalize(rawText);
    if (!t) return null;
    let best = null, bestScore = 0;
    INTENTS.forEach(intent => {
      let score = 0;
      intent.patterns.forEach(p => {
        const np = normalize(p);
        if (!np) return;
        if (t === np) score += np.split(' ').length * 3;
        else if (t.includes(np)) score += np.split(' ').length * 2;
        else if (np.includes(t) && t.length > 2) score += 1;
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return bestScore > 0 ? best : null;
  }

  /* ── 4. STATE ──────────────────────────────────── */
  let history = [];
  let els = {};
  let isFullPage = false;

  function saveHistory() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
  }
  
  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  /* ── 5. RENDERING ──────────────────────────────── */
  function buildShell(container) {
    container.innerHTML = `
      <div class="sn-chat-head">
        <div class="sn-chat-avatar">
          <img src="images/logo-favicon-32x32.png" alt="SaaSNova AI" />
        </div>
        <div class="sn-chat-head-text">
          <div class="sn-chat-head-name">SaaSNova Execution Assistant</div>
          <div class="sn-chat-head-status"><span class="sn-chat-online-dot"></span>Online</div>
        </div>
        <div class="sn-chat-head-actions">
          <button class="sn-chat-head-btn" id="sn-chat-reset" title="Restart conversation" aria-label="Restart conversation">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </button>
          ${isFullPage ? '' : `<button class="sn-chat-head-btn" id="sn-chat-close" title="Close chat" aria-label="Close chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>`}
        </div>
      </div>
      <div class="sn-chat-body" id="sn-chat-body"></div>
      <div class="sn-chat-input-wrap">
        <input type="text" class="sn-chat-input" id="sn-chat-input" placeholder="Ask about programs, Carahsoft, PRM..." autocomplete="off" maxlength="300" aria-label="Type your message"/>
        <button class="sn-chat-send" id="sn-chat-send" aria-label="Send message">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    els.body = container.querySelector('#sn-chat-body');
    els.input = container.querySelector('#sn-chat-input');
    els.send = container.querySelector('#sn-chat-send');
    els.reset = container.querySelector('#sn-chat-reset');
    els.close = container.querySelector('#sn-chat-close');

    els.send.addEventListener('click', handleSend);
    els.input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    els.reset.addEventListener('click', () => { history = []; saveHistory(); els.body.innerHTML = ''; greet(); });
    if (els.close) els.close.addEventListener('click', closeWidget);
  }

  function scrollToBottom() {
    if (els.body) els.body.scrollTop = els.body.scrollHeight;
  }

  function renderMessage(msg, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'sn-msg ' + (msg.role === 'user' ? 'sn-msg-user' : 'sn-msg-bot');
    const bubble = document.createElement('div');
    bubble.className = 'sn-msg-bubble';
    if (msg.role === 'user') {
      bubble.textContent = msg.text;
    } else {
      bubble.innerHTML = msg.html;
    }
    wrap.appendChild(bubble);
    els.body.appendChild(wrap);

    if (msg.role === 'bot' && msg.quickReplies && msg.quickReplies.length) {
      const qrWrap = document.createElement('div');
      qrWrap.className = 'sn-chat-quickreplies';
      msg.quickReplies.forEach(qr => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sn-qr-btn';
        b.textContent = qr.label;
        b.addEventListener('click', () => sendUserMessage(qr.msg, qr.label));
        qrWrap.appendChild(b);
      });
      els.body.appendChild(qrWrap);
    }
    if (!opts.skipScroll) scrollToBottom();
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'sn-chat-typing';
    t.id = 'sn-chat-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    els.body.appendChild(t);
    scrollToBottom();
  }
  
  function hideTyping() {
    const t = document.getElementById('sn-chat-typing-indicator');
    if (t) t.remove();
  }

  function addBotMessage(html, quickReplies) {
    const msg = { role: 'bot', html: html, quickReplies: quickReplies || null };
    history.push(msg);
    saveHistory();
    renderMessage(msg);
  }
  
  function addUserMessage(text) {
    const msg = { role: 'user', text: text };
    history.push(msg);
    saveHistory();
    renderMessage(msg);
  }

  function respondTo(displayLabel, rawInput) {
    const intent = findIntent(rawInput);
    showTyping();
    const delay = 420 + Math.random() * 380;
    setTimeout(() => {
      hideTyping();
      if (intent) {
        addBotMessage(intent.response, intent.quickReplies);
      } else {
        addBotMessage(FALLBACK_RESPONSE, MAIN_MENU_QR.slice(0, 4));
      }
    }, delay);
  }

  function sendUserMessage(rawInput, displayLabel) {
    addUserMessage(displayLabel || rawInput);
    respondTo(displayLabel, rawInput);
  }

  function handleSend() {
    const val = (els.input.value || '').trim();
    if (!val) return;
    els.input.value = '';
    sendUserMessage(val, val);
  }

  function greet() {
    const intent = INTENTS.find(i => i.id === 'greeting');
    addBotMessage(intent.response, intent.quickReplies);
  }

  function replayHistory() {
    els.body.innerHTML = '';
    history.forEach(m => renderMessage(m, { skipScroll: true }));
    scrollToBottom();
  }

  /* ── 6. WIDGET OPEN/CLOSE (fab mode only) ──────── */
  function openWidget() {
    const fab = document.getElementById('chatbot-fab');
    const panel = document.getElementById('sn-chatbot-panel');
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (fab) { fab.classList.add('open'); fab.setAttribute('aria-expanded', 'true'); }
    setTimeout(() => els.input && els.input.focus(), 200);
  }
  
  function closeWidget() {
    const fab = document.getElementById('chatbot-fab');
    const panel = document.getElementById('sn-chatbot-panel');
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (fab) { fab.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); }
  }
  
  function toggleWidget() {
    const panel = document.getElementById('sn-chatbot-panel');
    if (!panel) return;
    if (panel.classList.contains('open')) closeWidget(); else openWidget();
  }

  /* ── 7. INIT ───────────────────────────────────── */
  function injectCss() {
    if (document.getElementById('sn-chatbot-css')) return;
    const style = document.createElement('style');
    style.id = 'sn-chatbot-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function init() {
    injectCss();

    const fullPageContainer = document.getElementById('sn-chatbot-fullpage');
    const fab = document.getElementById('chatbot-fab');
    const panel = document.getElementById('sn-chatbot-panel');

    if (fullPageContainer) {
      isFullPage = true;
      buildShell(fullPageContainer);
    } else if (fab && panel) {
      isFullPage = false;
      fab.innerHTML = `
        <svg class="sn-fab-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <svg class="sn-fab-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span class="sn-fab-badge"></span>
      `;
      buildShell(panel);
      fab.addEventListener('click', toggleWidget);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) closeWidget(); });
    } else {
      return;
    }

    history = loadHistory();
    if (history.length) {
      replayHistory();
    } else {
      greet();
    }

    if (isFullPage) setTimeout(() => els.input && els.input.focus(), 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SaaSNovaChat = { open: openWidget, close: closeWidget, toggle: toggleWidget };
})();