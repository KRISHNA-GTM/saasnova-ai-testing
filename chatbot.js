/* ═══════════════════════════════════════════════════
   SaaSNova Offline GTM Assistant — chatbot.js
   100% local, rule-based keyword matching. No API calls.
   Works as: (a) floating widget on every page (via #chatbot-fab
   + #sn-chatbot-panel injected by shared.js), or (b) full-page
   experience on chatbot.html (via #sn-chatbot-fullpage).
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  const BOT_NAME = 'Nova'; // Used internally for the greeting
  const STORAGE_KEY = 'sn_chat_history_v1';
  const CALENDLY_URL = 'https://calendly.com/jen-saasnova/founder-strategy-session-scale-your-gtm-via-aws?month=2026-03';

  /* ── 1. STYLES ─────────────────────────────────── */
  const CSS = `
    #chatbot-fab {
      position: fixed; bottom: 30px; right: 30px; z-index: 10050;
      width: 60px; height: 60px; border-radius: 50%; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--blue,#008BF8), var(--pink,#FA0F9C));
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
      background: #fff; border-radius: 22px; overflow: hidden;
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
      background: #fff; border-radius: 24px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(15,25,35,.08); border: 1px solid var(--border-light, #E8EEF4);
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
      background: linear-gradient(180deg, #FAFBFF 0%, #fff 30%);
    }
    .sn-chat-body::-webkit-scrollbar { width: 6px; }
    .sn-chat-body::-webkit-scrollbar-thumb { background: #D0DAE6; border-radius: 3px; }

    .sn-msg { max-width: 84%; font-size: 14px; line-height: 1.55; animation: sn-msg-in .25s ease; }
    @keyframes sn-msg-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .sn-msg-bot { align-self: flex-start; }
    .sn-msg-user { align-self: flex-end; }
    .sn-msg-bubble { padding: 11px 14px; border-radius: 16px; word-wrap: break-word; }
    .sn-msg-bot .sn-msg-bubble {
      background: #fff; border: 1px solid var(--border-light, #E8EEF4); color: var(--text-primary, #0F1923);
      border-bottom-left-radius: 4px; box-shadow: 0 2px 8px rgba(15,25,35,.03);
    }
    .sn-msg-user .sn-msg-bubble {
      background: linear-gradient(135deg, var(--blue,#008BF8), var(--pink,#FA0F9C));
      color: #fff; border-bottom-right-radius: 4px;
    }
    .sn-msg-bubble p { margin: 0 0 6px; color: inherit; line-height: 1.55; }
    .sn-msg-bubble p:last-child { margin-bottom: 0; }
    .sn-msg-bubble ul { margin: 4px 0 6px 18px; padding: 0; }
    .sn-msg-bubble li { margin-bottom: 3px; }
    .sn-msg-bubble strong { color: inherit; }
    .sn-msg-user .sn-msg-bubble strong { color: #fff; }

    .sn-chat-link-btn {
      display: inline-flex; align-items: center; gap: 6px; margin: 4px 6px 0 0;
      padding: 7px 13px; border-radius: 999px; font-size: 12.5px; font-weight: 700;
      background: rgba(0,139,248,.08); color: var(--blue,#008BF8); text-decoration: none;
      border: 1px solid rgba(0,139,248,.18); transition: all .15s ease;
    }
    .sn-chat-link-btn:hover { background: var(--blue,#008BF8); color: #fff; }
    .sn-chat-link-btn.sn-link-primary { background: var(--pink,#FA0F9C); color: #fff; border-color: var(--pink,#FA0F9C); }
    .sn-chat-link-btn.sn-link-primary:hover { background: #D90085; }
    .sn-chat-link-row { display: flex; flex-wrap: wrap; margin-top: 2px; }

    .sn-chat-quickreplies { display: flex; flex-wrap: wrap; gap: 8px; padding: 2px 2px 4px; align-self: flex-start; max-width: 100%; }
    .sn-qr-btn {
      padding: 8px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer;
      background: #fff; border: 1.5px solid rgba(0,139,248,.25); color: var(--blue,#008BF8);
      transition: all .15s ease; font-family: inherit;
    }
    .sn-qr-btn:hover { background: var(--blue,#008BF8); color: #fff; transform: translateY(-1px); }

    .sn-chat-typing { align-self: flex-start; display: flex; gap: 4px; padding: 12px 14px; background: #fff; border: 1px solid var(--border-light,#E8EEF4); border-radius: 16px; border-bottom-left-radius: 4px; }
    .sn-chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: #B7C4D1; animation: sn-typing-bounce 1.1s infinite ease-in-out; }
    .sn-chat-typing span:nth-child(2) { animation-delay: .15s; }
    .sn-chat-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes sn-typing-bounce { 0%,60%,100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }

    .sn-chat-input-wrap {
      flex-shrink: 0; padding: 12px 14px 20px; border-top: 1px solid var(--border-light,#E8EEF4);
      background: #fff; display: flex; align-items: center; gap: 8px;
    }
    .sn-chat-input {
      flex: 1; border: 1.5px solid var(--border,#D0DAE6); border-radius: 999px; padding: 11px 16px;
      font-size: 14px; font-family: inherit; outline: none; transition: border-color .15s ease; min-width: 0;
    }
    .sn-chat-input:focus { border-color: var(--blue,#008BF8); box-shadow: 0 0 0 3px rgba(0,139,248,.08); }
    .sn-chat-send {
      width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer; flex-shrink: 0;
      background: linear-gradient(135deg, var(--blue,#008BF8), var(--pink,#FA0F9C)); color: #fff;
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
    { label: '📊 Case Studies & ROI', msg: 'case studies' },
    { label: '🏢 About SaaSNova', msg: 'about saasnova' },
    { label: '💼 Careers', msg: 'careers' },
    { label: '📰 Blog & News', msg: 'blog' },
    { label: '🤝 Partners', msg: 'partners' },
    { label: '💬 Book a Call', msg: 'book a call' },
    { label: '✉️ Contact', msg: 'contact' }
  ];

  const INTENTS = [
    {
      id: 'greeting',
      patterns: ['hi', 'hello', 'hey', 'yo', 'sup', 'good morning', 'good afternoon', 'good evening', 'howdy'],
      response: `<p>Hey there! I'm <strong>${BOT_NAME}</strong>, SaaSNova's GTM assistant. I can help you find the right program, understand our services, or connect you with the team.</p><p>What are you looking for?</p>`,
      quickReplies: MAIN_MENU_QR
    },
    {
      id: 'about',
      patterns: ['what is saasnova', 'who are you', 'about saasnova', 'company', 'what do you do', 'tell me about', 'who is this'],
      response: `<p><strong>SaaSNova</strong> is an operator-led cloud GTM execution engine for SaaS ISVs scaling through the <strong>AWS, Azure, and GCP</strong> marketplaces.</p><p>Instead of handing you a strategy deck, we actually execute: activating field relationships, running co-sell motions, and delivering board-ready pipeline evidence. Founded by <strong>Jen Dawson</strong>, a 25+ year cloud GTM practitioner who has activated 100+ ISVs including Arctic Wolf, Dataminr, New Relic, and Freshworks.</p>${linkRow(linkBtn('about.html', 'Meet the Team'))}`,
      quickReplies: [{ label: 'Our Programs', msg: 'programs' }, { label: 'Case Studies', msg: 'case studies' }]
    },
    {
      id: 'services_overview',
      patterns: ['services', 'what services', 'programs', 'solutions', 'what do you offer', 'help with', 'offerings'],
      response: `<p>We run two tracks of execution:</p><p><strong>GTM Programs</strong> (timeline-driven sprints):</p><ul><li><strong>Ignite</strong> — 1 month, Marketplace activation for unlisted/no-traction ISVs</li><li><strong>SuperNova</strong> — 4 months, US market entry for global ISVs</li><li><strong>NovaX</strong> — 6 months, multi-cloud scale (AWS + Azure + GCP)</li></ul><p><strong>Managed Services</strong> (ongoing, fractional):</p><ul><li><strong>PDMaaS</strong> — Partner Development as a Service</li><li><strong>PMMaaS</strong> — Partner Marketing as a Service</li><li><strong>PALaaS</strong> — Partner Alliance Lead as a Service</li><li><strong>PRMaaS / PCMaaS</strong> — free PRM & Partner Central migration readiness</li></ul>${linkRow(linkBtn('services.html', 'See Full Solutions Matrix', true))}`,
      quickReplies: [{ label: 'Ignite', msg: 'ignite' }, { label: 'SuperNova', msg: 'supernova' }, { label: 'NovaX', msg: 'novax' }, { label: 'PDMaaS', msg: 'pdmaas' }]
    },
    {
      id: 'ignite',
      patterns: ['ignite'],
      response: `<p><strong>SaaSNova Ignite</strong> — 1 month, cloud GTM activation.</p><p>Built for SaaS ISVs who need a marketplace listing or are already listed with little to no traction. Delivers an optimized Marketplace listing, foundational "Better Together" messaging, Partner Portal readiness validation, and early co-sell activation guidance.</p><p><strong>Ideal stage:</strong> Pre-Series A → Series A</p>${linkRow(linkBtn('ignite.html', 'Explore Ignite', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'supernova',
      patterns: ['supernova', 'super nova'],
      response: `<p><strong>SaaSNova SuperNova</strong> — 4 months, US market entry. <span style="color:#F19953;font-weight:700">Most popular program.</span></p><p>Designed for APAC/EMEA ISVs entering the US market. Covers US channel/SI/GSI activation, targeted field engagement, and clear attribution models for cloud-influenced US deals.</p><p><strong>Ideal stage:</strong> Series A → Series B</p>${linkRow(linkBtn('supernova.html', 'Explore SuperNova', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'novax',
      patterns: ['novax', 'nova x'],
      response: `<p><strong>SaaSNova NovaX</strong> — 6 months, multi-cloud GTM acceleration and scale.</p><p>For ISVs expanding beyond early traction into repeatable, attributable, multi-cloud revenue across AWS, Azure, and GCP simultaneously. Includes PRM-powered partner lifecycle automation and scalable attribution systems.</p><p><strong>Ideal stage:</strong> Series B → Series C</p>${linkRow(linkBtn('novax.html', 'Explore NovaX', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }, { label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'compare_programs',
      patterns: ['compare programs', 'difference between ignite supernova novax', 'which program', 'program comparison'],
      response: `<p>Quick comparison:</p><ul><li><strong>Ignite</strong> (1 mo) — activation for unlisted/no-pipeline ISVs</li><li><strong>SuperNova</strong> (4 mo) — US market entry for global ISVs</li><li><strong>NovaX</strong> (6 mo) — multi-cloud scale for growth-stage ISVs</li></ul><p>Not sure which fits? Book a free strategy session and Jen will tell you directly.</p>${linkRow(linkBtn('services.html', 'View Full Matrix'), linkBtn(CALENDLY_URL, 'Book a Call', true))}`,
      quickReplies: MAIN_MENU_QR.slice(0, 4)
    },
    {
      id: 'pdmaas',
      patterns: ['pdmaas', 'pdm as a service', 'partner development'],
      response: `<p><strong>PDMaaS (Partner Development as a Service)</strong> — a fractional Partner Development Manager who runs weekly field alignment, co-sell pipeline progression (ACE / Partner Center), and funding workflows (MDF).</p>${linkRow(linkBtn('pdmaas.html', 'Explore PDMaaS', true))}`,
      quickReplies: [{ label: 'PMMaaS', msg: 'pmmaas' }, { label: 'PALaaS', msg: 'palaas' }]
    },
    {
      id: 'pmmaas',
      patterns: ['pmmaas', 'pmm as a service', 'partner marketing'],
      response: `<p><strong>PMMaaS (Partner Marketing as a Service)</strong> — cloud-aligned "Better Together" messaging, co-sell pitch decks, battlecards, and continuous Marketplace listing optimization.</p>${linkRow(linkBtn('pmmaas.html', 'Explore PMMaaS', true))}`,
      quickReplies: [{ label: 'PDMaaS', msg: 'pdmaas' }, { label: 'PALaaS', msg: 'palaas' }]
    },
    {
      id: 'palaas',
      patterns: ['palaas', 'pal as a service', 'alliance lead', 'partner alliance'],
      response: `<p><strong>PALaaS (Partner Alliance Lead as a Service)</strong> — executive alliance coordination across AWS, Azure, and GCP: QBR prep, program navigation (tiering, competencies), and multi-cloud executive alignment.</p>${linkRow(linkBtn('palaas.html', 'Explore PALaaS', true))}`,
      quickReplies: [{ label: 'PDMaaS', msg: 'pdmaas' }, { label: 'PMMaaS', msg: 'pmmaas' }]
    },
    {
      id: 'prmaas',
      patterns: ['prmaas', 'prm as a service', 'partner revenue measurement', 'prm deadline', 'prm implementation'],
      response: `<p><strong>PRMaaS</strong> is a <strong>free</strong> end-to-end AWS Partner Revenue Measurement implementation: resource tagging, IaC integration, and attribution validation.</p><p>⏰ Heads up: AWS requires all APN partners to complete PRM by <strong>July 31, 2026</strong>, or risk losing MDF, the "Deployed on AWS" badge, and co-sell eligibility.</p>${linkRow(linkBtn('prmaas.html', 'Explore PRMaaS', true), linkBtn('blog-aws-prm-deadline.html', 'Read the PRM Deadline Post'))}`,
      quickReplies: [{ label: 'Book Implementation Call', msg: 'book a call' }, { label: 'PCMaaS', msg: 'pcmaas' }]
    },
    {
      id: 'pcmaas',
      patterns: ['pcmaas', 'pcm as a service', 'partner central migration'],
      response: `<p><strong>PCMaaS</strong> is a <strong>free</strong> readiness engagement for partners migrating to the unified AWS Partner Central experience, covering IAM/SSO alignment and zero-duplicate-registration validation.</p>${linkRow(linkBtn('pcmaas.html', 'Explore PCMaaS', true))}`,
      quickReplies: [{ label: 'PRMaaS', msg: 'prmaas' }]
    },
    {
      id: 'case_studies',
      patterns: ['case studies', 'case study', 'results', 'roi', 'proof', 'success stories', 'testimonials'],
      response: `<p>Real, attributable results:</p><ul><li><strong>Arctic Wolf</strong> — 2K+ PSQLs generated, 9X validated ROI, 300%+ of pipeline goal, elevated to fully managed AWS status</li><li><strong>Dataminr</strong> — Graduated AWS Rising Star in under 12 months, $300K in MDF secured, Public Sector Marketplace wins</li></ul>${linkRow(linkBtn('case-study.html', 'Read Full Case Studies', true))}`,
      quickReplies: [{ label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'pricing',
      patterns: ['price', 'pricing', 'cost', 'how much', 'budget', 'fees', 'rate'],
      response: `<p>We don't publish flat pricing since every engagement is scoped to your cloud mix, stage, and program (Ignite, SuperNova, NovaX, or a managed service). The best next step is a free <strong>30-minute Execution Strategy Session</strong> — Jen Dawson reviews every submission personally and recommends the right fit.</p>${linkRow(linkBtn(CALENDLY_URL, 'Book Your Free Session', true))}`,
      quickReplies: [{ label: 'Compare Programs', msg: 'compare programs' }]
    },
    {
      id: 'book_call',
      patterns: ['book a call', 'book a demo', 'schedule a call', 'talk to sales', 'strategy session', 'calendly', 'consultation', 'speak to someone', 'get started'],
      response: `<p>Great! Book a free 30-minute <strong>Execution Strategy Session</strong> — you'll get a cloud GTM readiness score, an execution gap analysis, and a clear program recommendation. Jen Dawson reviews every submission personally.</p>${linkRow(linkBtn(CALENDLY_URL, 'Open Calendly & Book Now', true), linkBtn('contact.html', 'Or Send a Message'))}`,
      quickReplies: [{ label: 'Contact Info', msg: 'contact' }]
    },
    {
      id: 'contact',
      patterns: ['contact', 'email', 'phone', 'reach you', 'get in touch', 'talk to a human'],
      response: `<p>You can reach us directly:</p><ul><li>📧 <strong>jen@saasnova.ai</strong></li><li>📧 marketing@saasnova.ai</li><li>📧 support@saasnova.ai</li><li>📞 +1 (201) 755-5369</li></ul>${linkRow(linkBtn('contact.html', 'Open Contact Form', true), linkBtn('support.html', 'Customer Support'))}`,
      quickReplies: [{ label: 'Book a Call', msg: 'book a call' }]
    },
    {
      id: 'support',
      patterns: ['support', 'help desk', 'ticket', 'existing customer', 'i have an issue', 'problem with my account'],
      response: `<p>For existing-customer support, submit a ticket — our team responds within a <strong>24-hour SLA</strong>, backed by a dedicated engagement manager.</p>${linkRow(linkBtn('support.html', 'Submit a Support Ticket', true))}`,
      quickReplies: [{ label: 'Contact Sales', msg: 'contact' }]
    },
    {
      id: 'careers',
      patterns: ['careers', 'jobs', 'hiring', 'job openings', 'work at saasnova', 'open roles', 'apply'],
      response: `<p>We're hiring! Current open roles:</p><ul><li>Partner Pipeline Executive — US (Remote)</li><li>Partner Pipeline Executive — London, UK</li><li>HubSpot Associate, GTM Operations — Chennai</li><li>Cloud Engineer — Chennai/Bangalore</li></ul>${linkRow(linkBtn('careers.html', 'View Open Roles', true))}`,
      quickReplies: [{ label: 'About SaaSNova', msg: 'about saasnova' }]
    },
    {
      id: 'blog',
      patterns: ['blog', 'articles', 'resources', 'read', 'insights', 'news'],
      response: `<p>Popular reads from the blog:</p><ul><li>The July 31 AWS PRM Deadline — how to keep your funding</li><li>Why Your Cloud Marketplace Listing Is Silent</li><li>Why AWS Marketplace GTM Fails for Most SaaS Companies</li></ul>${linkRow(linkBtn('blog.html', 'Visit the Blog', true), linkBtn('news-press.html', 'News & Press'))}`,
      quickReplies: [{ label: 'Subscribe to Newsletter', msg: 'newsletter' }]
    },
    {
      id: 'newsletter',
      patterns: ['newsletter', 'nova brief', 'subscribe', 'weekly email'],
      response: `<p><strong>The Nova Brief</strong> — weekly co-sell tactics, field motion intelligence, and marketplace execution across AWS, Azure, and GCP from Jen Dawson. Free, no spam.</p>${linkRow(linkBtn('newsletter.html', 'Subscribe Free', true))}`
    },
    {
      id: 'partners',
      patterns: ['partners', 'partnership', 'saasify', 'workspan', 'pronix', 'ecosystem'],
      response: `<p>Our partner ecosystem includes:</p><ul><li><strong>SaaSify</strong> — Marketplace listing infrastructure & automation</li><li><strong>Workspan</strong> — Co-sell tracking & pipeline intelligence</li><li><strong>Pronix</strong> — SI/GSI enterprise deployment</li><li>AWS, Azure & GCP SME/field registration programs</li></ul>${linkRow(linkBtn('partners.html', 'Explore Partners', true))}`,
      quickReplies: MAIN_MENU_QR.slice(0, 3)
    },
    {
      id: 'clouds',
      patterns: ['which clouds', 'aws azure gcp', 'multi cloud', 'multicloud', 'cloud providers', 'hyperscalers'],
      response: `<p>We execute across all three major hyperscalers: <strong>AWS</strong>, <strong>Microsoft Azure</strong>, and <strong>Google Cloud (GCP)</strong> — with true multi-cloud depth, not a primary cloud with two afterthoughts.</p>${linkRow(linkBtn('services.html', 'See Our Programs'))}`
    },
    {
      id: 'jen',
      patterns: ['jen dawson', 'founder', 'ceo', 'who founded', 'who runs saasnova'],
      response: `<p><strong>Jen Dawson</strong> is the Founder & CEO of SaaSNova — a 25+ year cloud GTM practitioner who has led 100+ ISV marketplace activations across AWS, Azure, and GCP, including her tenure as Global GTM Lead at AWS.</p>${linkRow(linkBtn('about.html', 'Meet the Team', true))}`
    },
    {
      id: 'thanks',
      patterns: ['thanks', 'thank you', 'appreciate it', 'awesome', 'great', 'cool thanks'],
      response: `<p>You're welcome! Anything else I can help you find, or would you like to book a strategy session with the team?</p>`,
      quickReplies: [{ label: 'Book a Call', msg: 'book a call' }, { label: 'Main Menu', msg: 'menu' }]
    },
    {
      id: 'bye',
      patterns: ['bye', 'goodbye', 'see you', 'that\'s all', 'no thanks', 'nothing else'],
      response: `<p>Sounds good — thanks for stopping by SaaSNova! If anything comes up, I'll be right here. 👋</p>`
    },
    {
      id: 'menu',
      patterns: ['menu', 'main menu', 'start over', 'options', 'help'],
      response: `<p>Here's what I can help with:</p>`,
      quickReplies: MAIN_MENU_QR
    }
  ];

  const FALLBACK_RESPONSE = `<p>I don't have a canned answer for that yet — but here's what I can definitely help with, or you can talk directly to the team.</p>${linkRow(linkBtn(CALENDLY_URL, 'Book a Strategy Session', true), linkBtn('contact.html', 'Contact Us'))}`;

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
          <img src="images/logo-favicon.png" alt="SaaSNova AI" />
        </div>
        <div class="sn-chat-head-text">
          <div class="sn-chat-head-name">SaaSNova AI Assistant</div>
          <div class="sn-chat-head-status"><span class="sn-chat-online-dot"></span>Active Now</div>
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
        <input type="text" class="sn-chat-input" id="sn-chat-input" placeholder="Ask about services, pricing, careers…" autocomplete="off" maxlength="300" aria-label="Type your message"/>
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
      // Fab icon markup (chat bubble + close X)
      fab.innerHTML = `
        <svg class="sn-fab-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        <svg class="sn-fab-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span class="sn-fab-badge"></span>
      `;
      buildShell(panel);
      fab.addEventListener('click', toggleWidget);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) closeWidget(); });
    } else {
      // Neither container present yet — nothing to mount.
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

  // Expose minimal API in case other scripts want to open it programmatically.
  window.SaaSNovaChat = { open: openWidget, close: closeWidget, toggle: toggleWidget };
})();