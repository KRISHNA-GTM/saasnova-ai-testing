/* --- GOOGLE ANALYTICS (G-185EJ40PT4) INJECTION --- */
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-185EJ40PT4';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag; // Expose globally
  gtag('js', new Date());
  gtag('config', 'G-185EJ40PT4');
})();
/* ------------------------------------------------- */

/* SaaSNova V5.5, shared.js — Updated with AWS/Azure/GCP GTM + Careers pages */

const CALENDLY = "https://calendly.com/jen-saasnova/founder-strategy-session-scale-your-gtm-via-aws?month=2026-03";

const SVG = {
  chevDown: `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 4l3 3 3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  bars: `<svg width="22" height="16" viewBox="0 0 22 16" fill="none"><rect width="22" height="2" rx="1" fill="#0F1923"/><rect y="7" width="16" height="2" rx="1" fill="#0F1923"/><rect y="14" width="22" height="2" rx="1" fill="#0F1923"/></svg>`,
  resCase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M12 12v4"/></svg>`,
  resMic: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
  resVideo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  resBlog: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  resNews: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  srvAll: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  srvIgnite: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  srvSuper: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  srvNova: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  partAll: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
  part3PI: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  partCloud: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  careers: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
};

// ── DESKTOP NAV & GLOBAL STYLES ──
const NAV_STYLE_AND_DESKTOP = `
<style>
  /* --- FLOATING NAV STYLES --- */
  #nav { 
    transition: all 0.3s ease-in-out; 
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    z-index: 9999; 
    background: transparent; 
  }
  #nav.is-floating { 
    position: fixed; 
    top: 15px; 
    left: 50%; 
    transform: translateX(-50%); 
    width: 95%; 
    max-width: 1200px; 
    background: rgba(255, 255, 255, 0.95); 
    backdrop-filter: blur(10px); 
    -webkit-backdrop-filter: blur(10px); 
    border-radius: 50px; 
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); 
  }
  #nav.is-floating .nav-inner {
    padding: 10px 24px;
  }

  .nav-inner { transition: all 0.3s ease-in-out; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 20px 32px; }
  #hamburger { display: none; background: transparent; border: none; cursor: pointer; padding: 8px; }
  
  @media (max-width: 1024px) {
    #nav .nav-links, #nav .nav-cta { display: none !important; }
    #nav #hamburger { 
      display: flex !important; 
      align-items: center !important; 
      justify-content: center !important; 
      width: 44px !important; 
      height: 44px !important; 
      background: #EEF2F8 !important; 
      border-radius: 8px !important;
      border: 1px solid #D0DAE6 !important;
      margin-left: auto !important;
    }
    #nav.is-floating .nav-inner { padding: 10px 16px; }
  }

  .nav-links { margin-left: auto; margin-right: 32px; }

  .dropdown-submenu { position: relative; }
  .dropdown-submenu::after { content: ''; position: absolute; top: 0; right: -10px; bottom: 0; width: 10px; }
  .submenu-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #3D4E5C; border-radius: 8px; cursor: pointer; transition: background 0.15s ease, color 0.15s ease; }
  .submenu-item:hover { background: #F8FAFC; color: #0F1923; }
  .dropdown-menu-sub { position: absolute; top: -6px; left: 100%; margin-left: 2px; background: #fff; border: 1px solid #E8EEF4; border-radius: 12px; box-shadow: 0 12px 32px rgba(15,25,35,.12); padding: 6px; min-width: 220px; opacity: 0; visibility: hidden; transform: translateX(-8px); transition: all 0.2s ease; z-index: 10; }
  .dropdown-submenu:hover .dropdown-menu-sub { opacity: 1; visibility: visible; transform: translateX(0); }

  .premium-dd-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; border-radius: 10px; text-decoration: none; transition: all 0.2s ease; }
  .premium-dd-item:hover { background: #F8FAFC; transform: translateX(4px); }
  .dd-icon-wrap { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0; }

  /* ── NUCLEAR CACHE BUSTER FOR MOBILE MENU ── */
  #sn-mob-menu { display: none !important; position: fixed !important; top: 64px !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background: #ffffff !important; z-index: 9999 !important; padding: 24px !important; flex-direction: column !important; gap: 2px !important; overflow-y: auto !important; border-top: 1px solid #E8EEF4 !important; }
  #sn-mob-menu.open { display: flex !important; }
  .mob-accordion { border-bottom: 1px solid rgba(0,0,0,0.04) !important; display: block !important; visibility: visible !important; }
  .mob-accordion-btn { display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; padding: 18px 20px !important; font-size: 18px !important; font-weight: 600 !important; color: #0F1923 !important; background: none !important; border: none !important; cursor: pointer !important; text-align: left !important; visibility: visible !important; font-family: inherit !important;}
  .mob-accordion-btn svg { transition: transform 0.3s ease !important; color: #6B7E8F !important; }
  .mob-accordion-btn.open svg { transform: rotate(180deg) !important; color: #008BF8 !important; }
  .mob-accordion-content { max-height: 0 !important; overflow: hidden !important; transition: max-height 0.4s ease-in-out !important; background: #F8FAFC !important; display: block !important; }
  .mob-accordion-content.open { max-height: 1500px !important; }
  .mob-sub-link { display: flex !important; align-items: center !important; padding: 14px 20px 14px 24px !important; color: #3D4E5C !important; font-size: 16px !important; font-weight: 500 !important; text-decoration: none !important; border-bottom: 1px solid rgba(0,0,0,0.03) !important; }
  .mob-sub-link:last-child { border-bottom: none !important; }
</style>

<nav id="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo" aria-label="SaaSNova Home">
      <img src="images/logo-color.png" alt="SaaSNova" style="height:48px;width:auto;object-fit:contain"/>
    </a>
    <nav class="nav-links" aria-label="Main">
      <a href="/" class="nav-link">Home</a>
      
      <!-- SERVICES DROPDOWN -->
      <div class="dropdown">
        <button class="dropdown-trigger" aria-expanded="false" aria-haspopup="true">
          Services ${SVG.chevDown}
        </button>
        <div class="dropdown-menu" role="menu" style="min-width: 270px; padding: 8px;">
          <a href="/services" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(15,25,35,0.05); color:var(--text-primary);">${SVG.srvAll}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">All Services</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">View full execution suite</div>
            </div>
          </a>
          <div style="margin: 4px 0; height: 1px; background: var(--border-light);"></div>
          <a href="/ignite" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(0,139,248,0.1); color:var(--blue);">${SVG.srvIgnite}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Ignite</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Cloud GTM Activation</div>
            </div>
          </a>
          <a href="/supernova" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(241,153,83,0.1); color:var(--orange);">${SVG.srvSuper}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">SuperNova</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">US Market Entry</div>
            </div>
          </a>
          <a href="/novax" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(250,15,156,0.1); color:var(--pink);">${SVG.srvNova}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">NovaX</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Global Multi-Cloud Scale</div>
            </div>
          </a>
        </div>
      </div>
      
      <a href="/about" class="nav-link">About</a>
      
      <!-- PARTNERS DROPDOWN -->
      <div class="dropdown">
        <button class="dropdown-trigger" aria-expanded="false" aria-haspopup="true">
          Partners ${SVG.chevDown}
        </button>
        <div class="dropdown-menu" role="menu" style="min-width: 290px; padding: 8px;">
          <a href="/partners" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(0,139,248,0.1); color:var(--blue);">${SVG.partAll}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">All Partners</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">The SaaSNova ecosystem</div>
            </div>
          </a>
          <div style="margin: 4px 0; height: 1px; background: var(--border-light);"></div>

          <!-- Cloud GTM SME Sub-menu -->
          <div class="dropdown-submenu">
            <div class="premium-dd-item" style="cursor:default;">
              <div class="dd-icon-wrap" style="background:rgba(0,139,248,0.08); color:var(--blue);">${SVG.partCloud}</div>
              <div style="flex:1;">
                <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px; display:flex; justify-content:space-between; align-items:center;">
                  Cloud GTM Partners <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 1.5L7 5L3 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div style="font-size:12px; color:var(--text-muted); font-weight:500;">AWS · Azure · GCP SME Registration</div>
              </div>
            </div>
            <div class="dropdown-menu-sub" style="min-width: 260px; padding: 8px;">
              <a href="/partner-aws-gtm" class="premium-dd-item">
                <div class="dd-icon-wrap" style="background:#FFF8ED; border:1px solid rgba(255,153,0,0.2);"><img src="images/aws-logo.png" style="width:20px;height:20px;object-fit:contain;"/></div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">AWS Partner GTM</div>
                  <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Amazonians & SME Registration</div>
                </div>
              </a>
              <a href="/partner-azure-gtm" class="premium-dd-item">
                <div class="dd-icon-wrap" style="background:#EEF6FF; border:1px solid rgba(0,120,212,0.2);"><img src="images/azure-logo.png" style="width:20px;height:20px;object-fit:contain;"/></div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Azure Partner GTM</div>
                  <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Microsoft Field & SME Registration</div>
                </div>
              </a>
              <a href="/partner-gcp-gtm" class="premium-dd-item">
                <div class="dd-icon-wrap" style="background:#EDFFF4; border:1px solid rgba(66,133,244,0.2);"><img src="images/gcp-logo.png" style="width:20px;height:20px;object-fit:contain;"/></div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">GCP Partner GTM</div>
                  <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Google Cloud Field Registration</div>
                </div>
              </a>
            </div>
          </div>

          <!-- 3PI Sub-menu -->
          <div class="dropdown-submenu">
            <div class="premium-dd-item" style="cursor:default;">
              <div class="dd-icon-wrap" style="background:rgba(100,116,139,0.08); color:var(--text-muted);">${SVG.part3PI}</div>
              <div style="flex:1;">
                <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px; display:flex; justify-content:space-between; align-items:center;">
                  3PI Partners <svg width="10" height="10" viewBox="0 10 10" fill="none"><path d="M3 1.5L7 5L3 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div style="font-size:12px; color:var(--text-muted); font-weight:500;">SaaSify, Workspan</div>
              </div>
            </div>
            <div class="dropdown-menu-sub" style="min-width: 240px; padding: 8px;">
              <a href="/partner-saasify" class="premium-dd-item">
                <div class="dd-icon-wrap" style="background:#fff; border:1px solid var(--border-light);"><img src="images/saasify-logo.png" style="width:20px;height:20px;object-fit:contain;"/></div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">SaaSify</div>
                  <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Listing Infrastructure</div>
                </div>
              </a>
              <a href="/partner-workspan" class="premium-dd-item">
                <div class="dd-icon-wrap" style="background:#fff; border:1px solid var(--border-light);"><img src="images/workspan-logo.jpeg" style="width:20px;height:20px;object-fit:contain;border-radius:4px;"/></div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Workspan</div>
                  <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Co-Sell Automation</div>
                </div>
              </a>
            </div>
          </div>

          <!-- SI / GSI Sub-menu -->
          <div class="dropdown-submenu">
            <div class="premium-dd-item" style="cursor:default;">
              <div class="dd-icon-wrap" style="background:#fff; border:1px solid var(--border-light);"><img src="images/SI-GSI.png" alt="SI / GSI" style="width:22px;height:22px;object-fit:contain;"/></div>
              <div style="flex:1;">
                <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px; display:flex; justify-content:space-between; align-items:center;">
                  SI / GSI <svg width="10" height="10" viewBox="0 10 10" fill="none"><path d="M3 1.5L7 5L3 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Pronix</div>
              </div>
            </div>
            <div class="dropdown-menu-sub" style="min-width: 240px; padding: 8px;">
              <a href="/partner-pronix" class="premium-dd-item">
                <div class="dd-icon-wrap" style="background:#fff; border:1px solid var(--border-light);"><img src="images/pronix_inc_logo.jpeg" style="width:20px;height:20px;object-fit:contain;border-radius:4px;"/></div>
                <div>
                  <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Pronix</div>
                  <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Enterprise Deployment</div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- RESOURCES DROPDOWN -->
      <div class="dropdown">
        <button class="dropdown-trigger">Resources ${SVG.chevDown}</button>
        <div class="dropdown-menu" role="menu" style="min-width: 270px; padding: 8px;">
          
          <a href="/blog" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(0,139,248,0.1); color:var(--blue);">${SVG.resBlog}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Blog</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Practitioner-grade intel</div>
            </div>
          </a>
          
          <a href="/show" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:#fff; border:1px solid var(--border-light); width: 42px; height: 42px; padding: 0; overflow:hidden; display: flex; align-items: center; justify-content: center;">
               <img src="images/SAASNOVA LOGO JEN SHOW.png" style="width: 100%; height: 100%; object-fit: cover;" alt="The Jen GTM Show" onerror="this.outerHTML='<span style=\\'color:var(--text-primary);font-size:10px;font-weight:800;\\'>SHOW</span>'"/>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center;">
              <div style="font-weight:700; color:var(--text-primary); margin-bottom: 2px;">The Jen GTM Show</div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 500;">Cloud strategy conversations</div>
            </div>
          </a>
          
          <a href="/case-study" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(241,153,83,0.1); color:var(--orange);">${SVG.resCase}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Case Studies</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Attributable ROI & evidence</div>
            </div>
          </a>
          
          <a href="/webinars" class="premium-dd-item">
            <div class="dd-icon-wrap" style="background:rgba(16,185,129,0.1); color:var(--green);">${SVG.resVideo}</div>
            <div>
              <div style="font-weight:700; color:var(--text-primary); margin-bottom:2px;">Webinars</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Live execution breakdowns</div>
            </div>
          </a>
          
          <div style="margin: 8px 0; height: 1px; background: var(--border-light);"></div>
          
          <a href="/newsletter" class="premium-dd-item" style="background:linear-gradient(135deg, rgba(250,15,156,0.05), rgba(0,139,248,0.05));">
            <div class="dd-icon-wrap" style="background:#fff; color:var(--pink); box-shadow:0 2px 8px rgba(0,0,0,0.05);">${SVG.resNews}</div>
            <div>
              <div style="font-weight:700; color:var(--pink); margin-bottom:2px;">The Nova Brief</div>
              <div style="font-size:12px; color:var(--text-muted); font-weight:500;">Weekly insights directly to your inbox</div>
            </div>
          </a>
          
        </div>
      </div>

      <a href="/careers" class="nav-link">Careers</a>
      <a href="/contact" class="nav-link">Contact</a>
    </nav>
  
    <div class="nav-cta">
      <a href="${CALENDLY}" target="_blank" rel="noopener"
         class="btn btn-primary"
         style="padding:13px 28px;font-size:15px;font-weight:800;letter-spacing:-.01em;background-color:var(--pink);color:#fff;border-radius:12px;border:none;box-shadow: 0 8px 24px rgba(0, 139, 248, 0.4), 0 4px 12px rgba(250, 15, 156, 0.3);">
        Get Started
      </a>
    </div>

    <button id="hamburger" onclick="toggleMob()" aria-label="Open menu">${SVG.bars}</button>
  </div>
</nav>
`;

// ── MOBILE MENU ──
const NAV_MOBILE = `
<div id="sn-mob-menu" role="dialog" aria-label="Mobile navigation" aria-hidden="true">
  <a href="/" class="mob-link" style="padding:18px 20px !important; font-weight:600 !important; text-decoration:none !important; color:#0F1923 !important; border-bottom:1px solid rgba(0,0,0,0.04) !important; display:block !important;">Home</a>
  
  <div class="mob-accordion">
    <button class="mob-accordion-btn">Services ${SVG.chevDown}</button>
    <div class="mob-accordion-content">
      <a href="/services" class="mob-sub-link" style="color:#008BF8 !important; font-weight:700 !important;">All Services</a>
      <a href="/ignite" class="mob-sub-link">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#008BF8; margin-right:12px; box-shadow: 0 0 8px rgba(0,139,248,0.4);"></span> Ignite
      </a>
      <a href="/supernova" class="mob-sub-link">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#F19953; margin-right:12px; box-shadow: 0 0 8px rgba(241,153,83,0.4);"></span> SuperNova
      </a>
      <a href="/novax" class="mob-sub-link">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#FA0F9C; margin-right:12px; box-shadow: 0 0 8px rgba(250,15,156,0.4);"></span> NovaX
      </a>
    </div>
  </div>
  
  <a href="/about" class="mob-link" style="padding:18px 20px !important; font-weight:600 !important; text-decoration:none !important; color:#0F1923 !important; border-bottom:1px solid rgba(0,0,0,0.04) !important; display:block !important;">About</a>
  
  <div class="mob-accordion">
    <button class="mob-accordion-btn">Partners ${SVG.chevDown}</button>
    <div class="mob-accordion-content">
      <a href="/partners" class="mob-sub-link" style="color:#008BF8 !important; font-weight:700 !important;">All Partners</a>
      
      <div class="mob-accordion" style="border-bottom:none !important; display:block !important;">
        <button class="mob-accordion-btn" style="padding: 14px 20px 14px 24px !important; font-size:15px !important; color:#3D4E5C !important;">
          <span style="display:flex;align-items:center;gap:8px;color:var(--blue);">${SVG.partCloud} Cloud GTM Partners</span> ${SVG.chevDown}
        </button>
        <div class="mob-accordion-content" style="background: #f1f5f9 !important;">
          <a href="/partner-aws-gtm" class="mob-sub-link" style="padding-left: 40px !important;"><img src="images/aws-logo.png" alt="AWS" style="width:18px;height:18px;margin-right:12px;object-fit:contain;"/> AWS Partner GTM</a>
          <a href="/partner-azure-gtm" class="mob-sub-link" style="padding-left: 40px !important;"><img src="images/azure-logo.png" alt="Azure" style="width:18px;height:18px;margin-right:12px;object-fit:contain;"/> Azure Partner GTM</a>
          <a href="/partner-gcp-gtm" class="mob-sub-link" style="padding-left: 40px !important;"><img src="images/gcp-logo.png" alt="GCP" style="width:18px;height:18px;margin-right:12px;object-fit:contain;"/> GCP Partner GTM</a>
        </div>
      </div>

      <div class="mob-accordion" style="border-bottom:none !important; display:block !important;">
        <button class="mob-accordion-btn" style="padding: 14px 20px 14px 24px !important; font-size:15px !important; color:#3D4E5C !important;">
          <span style="display:flex;align-items:center;gap:8px;color:#64748B;">${SVG.part3PI} 3PI Partners</span> ${SVG.chevDown}
        </button>
        <div class="mob-accordion-content" style="background: #f1f5f9 !important;">
          <a href="/partner-saasify" class="mob-sub-link" style="padding-left: 40px !important;"><img src="images/saasify-logo.png" alt="SaaSify" style="width:18px;height:18px;margin-right:12px;object-fit:contain;border-radius:3px;"/> SaaSify</a>
          <a href="/partner-workspan" class="mob-sub-link" style="padding-left: 40px !important;"><img src="images/workspan-logo.jpeg" alt="Workspan" style="width:18px;height:18px;margin-right:12px;object-fit:contain;border-radius:3px;"/> Workspan</a>
        </div>
      </div>

      <div class="mob-accordion" style="border-bottom:none !important; display:block !important;">
        <button class="mob-accordion-btn" style="padding: 14px 20px 14px 24px !important; font-size:15px !important; color:#3D4E5C !important;">
          <span style="display:flex;align-items:center;gap:8px;"><img src="images/SI-GSI.png" alt="SI / GSI" style="width:18px;height:18px;object-fit:contain;"/> SI / GSI</span> ${SVG.chevDown}
        </button>
        <div class="mob-accordion-content" style="background: #f1f5f9 !important;">
          <a href="/partner-pronix" class="mob-sub-link" style="padding-left: 40px !important;"><img src="images/pronix_inc_logo.jpeg" alt="Pronix" style="width:18px;height:18px;margin-right:12px;object-fit:contain;border-radius:3px;"/> Pronix</a>
        </div>
      </div>
    </div>
  </div>
  
  <div class="mob-accordion">
    <button class="mob-accordion-btn">Resources ${SVG.chevDown}</button>
    <div class="mob-accordion-content">
      <a href="/blog" class="mob-sub-link">Blog</a>
      <a href="/show" class="mob-sub-link">The Jen GTM Show</a>
      <a href="/case-study" class="mob-sub-link">Case Studies</a>
      <a href="/webinars" class="mob-sub-link">Webinars</a>
      <a href="/newsletter" class="mob-sub-link" style="color:#FA0F9C !important;">The Nova Brief</a>
    </div>
  </div>

  <a href="/careers" class="mob-link" style="padding:18px 20px !important; font-weight:600 !important; text-decoration:none !important; color:#0F1923 !important; border-bottom:1px solid rgba(0,0,0,0.04) !important; display:block !important;">Careers</a>
  <a href="/contact" class="mob-link" style="padding:18px 20px !important; font-weight:600 !important; text-decoration:none !important; color:#0F1923 !important; border-bottom:none !important; display:block !important;">Contact</a>
  
  <div style="padding:24px 20px 80px !important; display:block !important;">
    <a href="${CALENDLY}" target="_blank" rel="noopener"
       class="btn btn-primary w-full"
       style="justify-content:center;display:flex;font-weight:800;padding:14px;background-color:#FA0F9C;color:#fff;border-radius:12px;border:none;box-shadow: 0 8px 24px rgba(0, 139, 248, 0.4), 0 4px 12px rgba(250, 15, 156, 0.3);">
      Get Started
    </a>
  </div>
</div>
`;

// ── BULLETPROOF RESPONSIVE FOOTER ──
const FOOTER_HTML = `
<style>
  #footer { background-color: #0F1923; color: #ffffff; font-family: 'Inter', sans-serif; overflow: hidden; width: 100%; }
  .footer-container { max-width: 1200px; margin: 0 auto; padding: 64px 24px 32px; width: 100%; box-sizing: border-box; }
  .footer-grid { display: grid; grid-template-columns: 2.5fr 1fr 1fr 1.5fr; gap: 40px; width: 100%; }
  @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 48px; } }
  @media (max-width: 768px) {
    .footer-container { padding: 48px 24px 32px; }
    .footer-grid { display: flex; flex-direction: column; gap: 48px; width: 100%; }
    .footer-grid > div { width: 100%; max-width: 100%; display: block; }
  }
  .footer-col-title { font-size: 12px; font-weight: 700; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 20px; text-transform: uppercase; }
  .footer-link { display: block; color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 12px; font-size: 14px; transition: color 0.2s; }
  .footer-link:hover { color: #ffffff; }
</style>
<footer id="footer" role="contentinfo">
  <div class="footer-container">
    <div class="footer-grid">
      <div>
        <a href="/" aria-label="SaaSNova Home" style="display:inline-block;margin-bottom:16px;">
          <img src="images/logo-white.png" alt="SaaSNova" style="height:36px;width:auto;object-fit:contain"/>
        </a>
        <p style="margin-bottom:24px; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6;">The world's first GTM execution engine for SaaS ISVs scaling through AWS, Azure, and GCP Marketplace.</p>
        <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">
            <img src="images/aws-logo.png" alt="AWS" style="height:14px;width:auto;object-fit:contain;filter:brightness(0) invert(1);opacity:.75"/>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">
            <img src="images/azure-logo.png" alt="Azure" style="height:14px;width:auto;object-fit:contain;opacity:.8"/>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)">
            <img src="images/gcp-logo.png" alt="GCP" style="height:14px;width:auto;object-fit:contain;opacity:.8"/>
          </div>
        </div>
        <div style="display:flex;gap:16px;align-items:center;">
          <a href="#" style="color:#0A66C2;" aria-label="LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          <a href="#" style="color:#FF0000;" aria-label="YouTube">
            <svg width="26" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582 6.186c-.23-.86-.908-1.538-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418c-.86.23-1.538.908-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.86.908 1.538 1.768 1.768 1.56.418 7.814.418 7.814.418s6.254 0 7.814-.418c.86-.23 1.538-.908 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"/></svg>
          </a>
        </div>
      </div>
      
      <div>
        <div class="footer-col-title">SERVICES</div>
        <a href="/services" class="footer-link">All Services</a>
        <a href="/ignite" class="footer-link">Ignite</a>
        <a href="/supernova" class="footer-link">SuperNova</a>
        <a href="/novax" class="footer-link">NovaX</a>
      </div>
      
      <div>
        <div class="footer-col-title">COMPANY</div>
        <a href="/about" class="footer-link">About &amp; Team</a>
        <a href="/case-study" class="footer-link">Case Studies</a>
        <a href="/show" class="footer-link">The Jen GTM Show</a>
        <a href="/partners" class="footer-link">Partners</a>
        <a href="/careers" class="footer-link">Careers</a>
        <a href="/contact" class="footer-link">Contact</a>
      </div>
      
      <div>
        <div class="footer-col-title" style="color: #FA0F9C;">THE NOVA BRIEF</div>
        <p style="font-size:13px; color:rgba(255,255,255,0.7); margin-bottom:16px;">Insights and GTM intelligence delivered directly to your inbox.</p>
        <form id="footer-hs-form" onsubmit="handleFooterNewsletterSubmit(event)" style="display:flex;gap:8px;margin-bottom:24px;max-width:320px;width:100%;">
          <input type="email" name="email" placeholder="The Nova Brief" required style="flex:1; width:100%; padding:10px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:14px;outline:none;"/>
          <button type="submit" class="btn btn-primary" style="padding:10px 18px;font-size:14px;background:var(--pink, #FA0F9C);color:white;font-weight:bold;border:none;border-radius:8px;cursor:pointer;">Join</button>
        </form>
        <div class="footer-col-title" style="margin-top:40px;margin-bottom:20px;">CONTACT</div>
        <a href="mailto:jen@saasnova.ai" class="footer-link" style="text-transform:none;">jen@saasnova.ai</a>
        <a href="tel:+12017555369" class="footer-link" style="text-transform:none;">+1 (201) 755-5369</a>
        <a href="mailto:operations@saasnova.ai" class="footer-link" style="text-transform:none;">operations@saasnova.ai</a>
      </div>
    </div>
    
    <hr style="margin:48px 0 24px; border:none; height:1px; background:linear-gradient(90deg, #008BF8 0%, #FA0F9C 50%, rgba(255,255,255,0.05) 100%); width: 100%;"/>
    
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px; width: 100%;">
      <span style="font-size:14px;color:rgba(255,255,255,0.45);">&copy; 2026 SaaSNova. All rights reserved.</span>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        <a href="/privacy" style="font-size:14px;color:rgba(255,255,255,0.45);text-decoration:none;">Privacy Policy</a>
        <a href="/terms" style="font-size:14px;color:rgba(255,255,255,0.45);text-decoration:none;">Terms of Use</a>
      </div>
    </div>
  </div>
</footer>
`;

// HubSpot Footer Form
window.handleFooterNewsletterSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[name="email"]').value;
  const originalText = btn.textContent;
  btn.textContent = 'Joining...';
  btn.disabled = true;
  const portalId = '245317385';
  const formId = '80375307-028c-4c4f-819c-96dc9e0f6727';
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: [{ name: 'email', value: emailInput }],
      context: { pageUri: window.location.href, pageName: document.title }
    })
  }).then(async (response) => {
    if (!response.ok) { const errTxt = await response.text(); throw new Error(errTxt); }
    form.innerHTML = '<div style="color:#10B981; font-weight:600; font-size:14px; padding:10px 0;">✓ Subscribed successfully!</div>';
  }).catch(err => {
    btn.textContent = originalText; btn.disabled = false; console.error(err);
    alert('HubSpot blocked the submission. Please make sure reCAPTCHA is turned off in your HubSpot form settings.');
  });
};

// DOM Injections
const navEl = document.getElementById('nav-placeholder');
if(navEl) navEl.innerHTML = NAV_STYLE_AND_DESKTOP;

if (!document.getElementById('sn-mob-menu')) {
  document.body.insertAdjacentHTML('beforeend', NAV_MOBILE);
}

const footerEl = document.getElementById('footer-placeholder');
if(footerEl) footerEl.innerHTML = FOOTER_HTML;

// Navigation Floating / Scroll Effect
window.addEventListener('scroll', () => {
  const navHeader = document.getElementById('nav');
  if (navHeader) {
    if (window.scrollY > 50) {
      navHeader.classList.add('is-floating');
    } else {
      navHeader.classList.remove('is-floating');
    }
  }
}, { passive: true });

// Mobile Menu Toggle
function toggleMob() {
  const menu = document.getElementById('sn-mob-menu');
  const btn = document.getElementById('hamburger');
  if(!menu) return;
  const isOpen = menu.classList.toggle('open');
  menu.setAttribute('aria-hidden', !isOpen);
  if(btn) btn.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// Global Click Handlers
document.addEventListener('click', e => {
  if(e.target.closest('#sn-mob-menu a')) {
    document.getElementById('sn-mob-menu')?.classList.remove('open');
    document.body.style.overflow = '';
  }
  const mobBtn = e.target.closest('.mob-accordion-btn');
  if(mobBtn) {
    mobBtn.classList.toggle('open');
    mobBtn.nextElementSibling.classList.toggle('open');
  }
});

// Active Link Setup
const path = window.location.pathname;
const isHome = path === '/' || path === '/index' || path.endsWith('/index.html') || path.endsWith('saasnova.ai/');

document.querySelectorAll('.nav-link').forEach(l => {
  const href = l.getAttribute('href');
  if (!href) return;
  if (href === '/' || href === '/') {
    if (isHome) l.classList.add('active');
  } else {
    if (path.includes(href)) l.classList.add('active');
  }
});

// Intersection Observer for Animations
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

// Scroll FAB Feature
function initScrollFab() {
  const fabHTML = `
    <style>
      .sn-scroll-fab { position: fixed; bottom: 30px; right: 30px; z-index: 99; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.05); padding: 8px 16px 8px 8px; border-radius: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); cursor: pointer; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); color: var(--text-primary); text-decoration: none; }
      .sn-scroll-fab:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.12); background: rgba(255,255,255,0.95); }
      .sn-fab-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--blue, #008BF8), var(--pink, #FA0F9C)); color: white; transition: transform 0.4s ease; }
      .sn-fab-label { font-size: 14px; font-weight: 600; white-space: nowrap; }
      .sn-fab-up .sn-fab-icon { transform: rotate(180deg); }
      @media (max-width: 1024px) { #sn-scroll-fab { width: 50px !important; height: 50px !important; padding: 0 !important; border-radius: 50% !important; justify-content: center !important; bottom: 24px !important; right: 24px !important; } #sn-scroll-fab .sn-fab-label { display: none !important; } #sn-scroll-fab .sn-fab-icon { margin: 0 !important; } }
    </style>
    <button id="sn-scroll-fab" class="sn-scroll-fab" aria-label="Scroll down">
      <div class="sn-fab-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <span class="sn-fab-label">Scroll Down</span>
    </button>
  `;
  document.body.insertAdjacentHTML('beforeend', fabHTML);
  const fab = document.getElementById('sn-scroll-fab');
  const label = fab.querySelector('.sn-fab-label');
  let isUp = false;
  function getSections() { return Array.from(document.querySelectorAll('section, footer')).filter(s => s.offsetHeight > 100); }
  fab.addEventListener('click', () => {
    if (isUp) { window.scrollTo({ top: 0, behavior: 'smooth' }); } else {
      const sections = getSections();
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      let next = -1;
      for (let i = 0; i < sections.length; i++) { if (sections[i].offsetTop > scrollY) { next = i; break; } }
      if (next !== -1) { sections[next].scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      else { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }
    }
  });
  function onScroll() {
    const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 150);
    if (atBottom && !isUp) { isUp = true; fab.classList.add('sn-fab-up'); fab.setAttribute('aria-label','Back to top'); label.textContent = 'Back to Top'; }
    else if (!atBottom && isUp) { isUp = false; fab.classList.remove('sn-fab-up'); fab.setAttribute('aria-label','Scroll down'); label.textContent = 'Scroll Down'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
  initScrollFab();
  if (!localStorage.getItem('sn_popup_dismissed')) {
    const popupScript = document.createElement('script');
    popupScript.src = 'popup.js';
    popupScript.defer = true;
    document.body.appendChild(popupScript);
  }
});