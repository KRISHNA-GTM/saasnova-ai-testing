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
    { label: '✨ FQ Source', msg: 'fq source' },
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
      id: 'storefront',
      patterns: ['storefront', 'aws marketplace storefront', 'saasnova storefront', 'branded storefront', 'launch partner'],
      response: `<p><strong>SaaSNova Storefront</strong> is our branded seller storefront on AWS Marketplace. Ignite, SuperNova, NovaX and our managed services are listed as pre-scoped engagements.</p><p>You procure through your existing AWS account and draw down against your existing AWS commit, so there is no separate procurement process and no new budget line.</p><p>SaaSNova is an official launch partner for AWS Marketplace Storefront.</p>${linkRow(linkBtn('https://solutions.storefront.saasnova.ai/', 'Explore the Storefront', true), linkBtn('storefront-saasnova.html', 'How it works'))}`,
      quickReplies: [{ label: 'Storefront as a Service', msg: 'sfaas' }, { label: 'Pricing', msg: 'pricing' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'sfaas',
      patterns: ['sfaas', 'storefront as a service', 'build my storefront', 'build our storefront', 'build a storefront', 'build us a storefront', 'create a storefront', 'need a storefront', 'want a storefront', 'own storefront', 'storefront setup', 'set up a storefront', 'storefront deployment', 'storefront for us'],
      response: `<p><strong>Storefront as a Service (SFaaS)</strong> is how we deploy and operate branded AWS Marketplace storefronts for other companies.</p><p>Scope covers listing build, catalog and product setup, storefront configuration and branding, private offer setup, and ongoing operation once it is live.</p><p>We built and operate the Women-Owned Cloud Innovation Storefront with AWS and The Female Quotient this way.</p>${linkRow(linkBtn('services.html', 'See SFaaS', true), linkBtn('storefront-saasnova.html', 'Our own Storefront'))}`,
      quickReplies: [{ label: 'FQ Source', msg: 'fq source' }, { label: 'Pricing', msg: 'pricing' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'fq_source',
      patterns: ['fq source', 'fq', 'female quotient', 'the fq', 'fq program', 'women owned cloud innovation storefront', 'b20', 'shelley zalis'],
      response: `<p><strong>FQ Source</strong> is a joint initiative by AWS, SaaSNova and The Female Quotient. It helps women-owned technology companies become enterprise-ready and grow through AWS Marketplace.</p><p>Participants come away with four things:</p><ul><li>A live AWS Marketplace listing</li><li>A deployed, branded storefront</li><li>Co-sell opportunities registered in AWS ACE</li><li>Private offers ready to send to buyers</li></ul><p>No AWS Marketplace experience is required. Registration is open ahead of the November 9 launch at the B20 USA Summit in Washington, D.C.</p>${linkRow(linkBtn('fq-source.html', 'Register for FQ Source', true))}`,
      quickReplies: [{ label: 'Am I eligible?', msg: 'women owned business' }, { label: 'The FQ Storefront', msg: 'storefront' }, { label: 'Contact Us', msg: 'contact' }]
    },
    {
      id: 'women_owned',
      patterns: ['women owned business', 'women owned', 'woman owned', 'women led', 'female founder', 'female founded', 'diverse supplier', 'diversity certification', 'wbenc', 'am i eligible', 'eligibility'],
      response: `<p>SaaSNova is itself a women-owned business, and we run <strong>FQ Source</strong> with AWS and The Female Quotient specifically for women-owned and women-led technology companies.</p><p>It is built for SaaS, cloud and innovation suppliers seeking procurement access and enterprise buyers. You do not need an existing AWS Marketplace listing or AWS Partner registration to take part.</p>${linkRow(linkBtn('fq-source.html', 'See FQ Source', true), linkBtn('contact.html', 'Ask a Question'))}`,
      quickReplies: [{ label: 'What do I get?', msg: 'fq source' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'getting_started',
      patterns: ['where do i start', 'how do i start', 'not listed yet', 'no listing', 'never listed', 'first step', 'what is the first step', 'brand new to marketplace', 'new to aws marketplace', 'from scratch', 'zero traction', 'just getting started'],
      response: `<p>Start with where you are today:</p><ul><li><strong>No listing yet:</strong> <strong>Ignite</strong> delivers a published AWS Marketplace listing in one month.</li><li><strong>Listed but no pipeline:</strong> Ignite also covers listing optimization and initial co-sell execution.</li><li><strong>Women-owned technology company:</strong> <strong>FQ Source</strong> covers listing, storefront, co-sell and procurement pathways.</li><li><strong>Already scaling on one cloud:</strong> <strong>SuperNova</strong> for US market entry, <strong>NovaX</strong> for multi-cloud.</li></ul>${linkRow(linkBtn('ignite.html', 'Explore Ignite', true), linkBtn('services.html', 'Compare Everything'))}`,
      quickReplies: [{ label: 'Ignite', msg: 'ignite' }, { label: 'FQ Source', msg: 'fq source' }, { label: 'Pricing', msg: 'pricing' }]
    },
    {      id: 'thanks',
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

  const FALLBACK_RESPONSE = `<p>I could not match that to anything I hold. I cover our programs (Ignite, SuperNova, NovaX), managed services, AWS Marketplace Storefront, FQ Source, pricing and partners.</p><p>Try naming one of those, or pick a topic below.</p>`;

  function suggestionResponse(suggestions) {
    const names = suggestions.map(function (s) { return '<strong>' + s.label + '</strong>'; });
    const list = names.length > 1
      ? names.slice(0, -1).join(', ') + ' or ' + names[names.length - 1]
      : names[0];
    return '<p>I am not certain I follow. Did you mean ' + list + '?</p>';
  }

  /* ── 3. MATCHING ENGINE ────────────────────────── */
  // Words that carry no intent signal. Removed before token scoring so
  // "what do you charge for" scores on "charge", not on "what do you".
  const STOPWORDS = new Set([
    'a','an','the','is','are','was','were','be','been','am','do','does','did','can','could',
    'will','would','should','shall','may','might','have','has','had','i','me','my','we','our',
    'us','you','your','it','its','they','them','their','this','that','these','those','to','for',
    'of','in','on','at','by','with','from','about','into','and','or','but','if','so','as','than',
    'then','there','here','what','which','who','whom','how','when','where','why','any','some',
    'no','not','yes','ok','okay','just','also','very','more','most','much','get','got','need',
    'want','like','know','tell','show','give','looking','please','thanks','hi','hello','hey'
  ]);

  // alias -> canonical token. Applied to both the query and the intent patterns,
  // so "expensive", "fees" and "how much" all collapse onto "price".
  const SYNONYMS = {
    price:['pricing','prices','cost','costs','costing','fee','fees','rate','rates','budget','charge','charges','expensive','cheap','afford','quote','invoice','spend','spends','dollar','dollars','usd'],
    listing:['list','listed','listings','publish','published','publishing','sku','skus','catalog','catalogue'],
    marketplace:['mp','marketplaces'],
    storefront:['store','shop','shopfront'],
    start:['started','starting','begin','beginning','onboard','onboarding','kickoff','first','new','newbie','beginner','scratch','zero'],
    program:['programs','programme','programmes','offering','offerings','package','packages','engagement','engagements','service','services','solution','solutions'],
    demo:['demos','walkthrough','trial'],
    call:['calls','meeting','meet','chat','session','sessions','consult','consultation','appointment','schedule','scheduling','booking','book','calendly'],
    proof:['results','result','roi','evidence','outcome','outcomes','metrics','testimonial','testimonials','reference','references','casestudy'],
    cosell:['co','sell','selling','ace','opportunity','opportunities'],
    woman:['women','womens','woman','female','femaleowned','womenowned','diverse','diversity','minority','wbenc','supplier','suppliers'],
    fq:['fqsource','femalequotient','quotient'],
    partner:['partners','partnership','partnerships','ecosystem','alliance','alliances','reseller','resellers','distributor','distributors'],
    cloud:['clouds','hyperscaler','hyperscalers','aws','amazon','azure','microsoft','gcp','google'],
    contact:['email','mail','phone','reach','touch','human','person','someone','speak','talk'],
    help:['support','assist','stuck','confused','lost','guide']
  };

  // Flattened for O(1) lookup.
  const ALIAS = (function () {
    const m = Object.create(null);
    Object.keys(SYNONYMS).forEach(function (canon) {
      m[canon] = canon;
      SYNONYMS[canon].forEach(function (a) { m[a] = canon; });
    });
    return m;
  })();

  // Human-readable names, used by the "did you mean" suggestions.
  const INTENT_LABELS = {
    greeting:'Start over', about:'About SaaSNova', services_overview:'Programs & services',
    ignite:'Ignite', supernova:'SuperNova', novax:'NovaX', compare_programs:'Compare programs',
    managed_services:'Managed services', pdmaas:'PDMaaS', pmmaas:'PMMaaS', palaas:'PALaaS',
    prmaas:'PRMaaS', case_studies:'Case studies', pricing:'Pricing', book_call:'Book a call',
    contact:'Contact us', partners:'Partners', carahsoft:'Carahsoft', saasify:'SaaSify',
    pronix:'Pronix', blog:'Blog', newsletter:'Newsletter', clouds:'Which clouds',
    jen:'Jen Dawson', menu:'Main menu', thanks:'Anything else', bye:'Goodbye',
    storefront:'AWS Marketplace Storefront',
    sfaas:'Storefront as a Service', fq_source:'FQ Source', getting_started:'Where to start',
    women_owned:'Women-owned businesses'
  };

  function normalize(s) {
    return (s || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Normalized text -> array of canonical, de-stopworded tokens.
  function tokenize(s) {
    const out = [];
    normalize(s).split(' ').forEach(function (w) {
      if (!w || STOPWORDS.has(w)) return;
      const canon = ALIAS[w] || w;
      if (out.indexOf(canon) === -1) out.push(canon);
    });
    return out;
  }

  // Cache each intent's token set once, on first use.
  function intentTokens(intent) {
    if (!intent._tokens) {
      const set = [];
      intent.patterns.forEach(function (p) {
        tokenize(p).forEach(function (t) { if (set.indexOf(t) === -1) set.push(t); });
      });
      tokenize(intent.id.replace(/_/g, ' ')).forEach(function (t) {
        if (set.indexOf(t) === -1) set.push(t);
      });
      intent._tokens = set;
    }
    return intent._tokens;
  }

  // Whole-word phrase containment. normalize() collapses runs of whitespace,
  // so padding both sides with a space makes indexOf word-exact: ' yo ' no
  // longer matches inside 'you'.
  function hasPhrase(haystack, needle) {
    return (' ' + haystack + ' ').indexOf(' ' + needle + ' ') !== -1;
  }

  // A phrase hit outweighs any number of loose token hits, so every pattern
  // that matched before still matches. W_COVERAGE rewards matching a high
  // proportion of the query's meaningful tokens, which is what lets a single
  // decisive synonym ("expensive" -> price) answer confidently.
  const W_EXACT    = 120;  // query === pattern
  const W_PHRASE   = 40;   // query contains a pattern, per pattern word
  const W_PARTIAL  = 14;   // pattern contains the whole (short) query
  const W_TOKEN    = 13;   // per shared canonical token
  const W_COVERAGE = 30;   // scaled by share of query tokens matched

  const CONFIDENT_MIN = 26;  // answer directly
  const SUGGEST_MIN   = 12;  // offer "did you mean"; below this, fall back

  function scoreIntent(intent, qNorm, qTokens) {
    let score = 0;
    intent.patterns.forEach(function (p) {
      const np = normalize(p);
      if (!np) return;
      if (qNorm === np) { score += W_EXACT; return; }
      if (hasPhrase(qNorm, np)) { score += W_PHRASE * np.split(' ').length; return; }
      if (qNorm.length > 2 && hasPhrase(np, qNorm)) score += W_PARTIAL;
    });
    const iTokens = intentTokens(intent);
    let matched = 0;
    qTokens.forEach(function (t) {
      if (iTokens.indexOf(t) !== -1) matched++;
    });
    if (matched) {
      score += W_TOKEN * matched;
      score += W_COVERAGE * (matched / qTokens.length);
    }
    return Math.round(score);
  }

  // Returns { intent, score, suggestions } — suggestions populated only when
  // the top score sits in the ambiguous band.
  function findIntent(rawText) {
    const qNorm = normalize(rawText);
    if (!qNorm) return { intent: null, score: 0, suggestions: [] };
    const qTokens = tokenize(rawText);

    const ranked = INTENTS
      .map(function (i) { return { intent: i, score: scoreIntent(i, qNorm, qTokens) }; })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });

    if (!ranked.length) return { intent: null, score: 0, suggestions: [] };

    const top = ranked[0];
    if (top.score >= CONFIDENT_MIN) return { intent: top.intent, score: top.score, suggestions: [] };
    if (top.score >= SUGGEST_MIN) {
      return {
        intent: null,
        score: top.score,
        suggestions: ranked.slice(0, 3).map(function (r) {
          return { label: INTENT_LABELS[r.intent.id] || r.intent.id, msg: r.intent.patterns[0] };
        })
      };
    }
    return { intent: null, score: top.score, suggestions: [] };
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
    const match = findIntent(rawInput);
    showTyping();
    const delay = 420 + Math.random() * 380;
    setTimeout(() => {
      hideTyping();
      if (match.intent) {
        addBotMessage(match.intent.response, match.intent.quickReplies);
      } else if (match.suggestions.length) {
        addBotMessage(suggestionResponse(match.suggestions),
          match.suggestions.concat([{ label: 'Something else', msg: 'menu' }]));
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