/* ═══════════════════════════════════════════════════
   SaaSNova Lead Popup, popup.js  v3.0
   Bundles its own CSS, uses HubSpot API, and strict LocalStorage
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  const SKIP_PATHS  = ['/contact', '/newsletter', 'contact.html', 'newsletter.html'];
  const STORAGE_KEY = 'sn_popup_dismissed'; // Upgraded to permanent storage
  
  // Set to 20 seconds for users who stay on the page
  const DELAY_MS    = 20000; 

  function shouldShow() {
    // Shows only once EVER per device
    if (localStorage.getItem(STORAGE_KEY)) return false;
    
    const path = window.location.pathname.toLowerCase() + window.location.href.toLowerCase();
    return !SKIP_PATHS.some(p => path.includes(p));
  }

  function injectCSS() {
    const styles = `
      #sn-popup-overlay {
        position: fixed; inset: 0;
        background: rgba(10,22,40,.68);
        backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
        z-index: 100000;
        display: flex; align-items: center; justify-content: center;
        padding: 16px;
        opacity: 0; pointer-events: none;
        transition: opacity .28s ease;
        font-family: 'Inter', sans-serif;
      }
      #sn-popup-overlay.sn-popup-visible { opacity: 1; pointer-events: all; }
      #sn-popup-overlay.sn-popup-closing { opacity: 0; pointer-events: none; }

      #sn-popup-card {
        background: #fff; border-radius: 24px; padding: 36px 36px 32px;
        max-width: 440px; width: 100%; position: relative;
        box-shadow: 0 24px 80px rgba(15,25,35,.24); border: 1px solid #E8EEF4;
        transform: translateY(20px) scale(.97);
        transition: transform .3s cubic-bezier(.34,1.4,.64,1);
        box-sizing: border-box;
        overflow: hidden; 
      }
      #sn-popup-overlay.sn-popup-visible #sn-popup-card { transform: translateY(0) scale(1); }
      #sn-popup-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #008BF8, #FA0F9C); }

      #sn-popup-close {
        position: absolute; top: 16px; right: 16px;
        width: 32px; height: 32px; border-radius: 50%;
        background: #F7F9FC; border: 1px solid #E8EEF4;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #6B7E8F; transition: all .15s ease;
      }
      #sn-popup-close:hover { background: #E8EEF4; color: #0F1923; }

      #sn-popup-badge {
        display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 999px;
        background: rgba(241,153,83,.12); color: #C85000;
        font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em;
        margin-bottom: 14px;
      }
      #sn-popup-headline {
        font-size: clamp(18px,3vw,22px); font-weight: 800; color: #0F1923; line-height: 1.2; margin-bottom: 10px; margin-top:0;
      }
      #sn-popup-sub {
        font-size: 14px; color: #3D4E5C; line-height: 1.72; margin-bottom: 14px; margin-top:0;
      }
      #sn-popup-proof {
        display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        font-size: 12px; font-weight: 600; color: #6B7E8F; margin-bottom: 20px;
      }
      #sn-popup-fields { display: flex; gap: 10px; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
      #sn-popup-email {
        flex: 1; padding: 12px 14px; border: 1.5px solid #E8EEF4; border-radius: 12px;
        font-size: 14px; font-family: inherit; color: #0F1923;
        background: #F7F9FC; outline: none; transition: all .15s ease;
        width: 100%; box-sizing: border-box;
      }
      #sn-popup-email:focus { border-color: #008BF8; background: #fff; }

      #sn-popup-submit {
        width: 100%; padding: 14px 20px; background: #FA0F9C; color: white;
        border: none; border-radius: 12px; font-size: 15px; font-weight: 700;
        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: all .15s ease; box-sizing: border-box;
      }
      #sn-popup-submit:hover { background: #D90085; transform: translateY(-1px); }

      #sn-popup-success {
        flex-direction: column; align-items: center; justify-content: center;
        padding: 20px 0 8px; text-align: center; gap: 10px;
      }
      #sn-popup-success-text { font-size: 18px; font-weight: 700; color: #0F1923; }
      #sn-popup-success-sub  { font-size: 14px; color: #6B7E8F; }

      @media (max-width: 540px) {
        #sn-popup-card { padding: 28px 20px 24px; border-radius: 20px 20px 0 0; }
        #sn-popup-overlay { align-items: flex-end; padding: 0; }
        #sn-popup-fields { flex-direction: column; }
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
  }

  function buildPopup() {
    let root = document.getElementById('sn-popup-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'sn-popup-root';
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div id="sn-popup-overlay" role="dialog" aria-modal="true" aria-label="Subscribe to The Nova Brief" aria-hidden="true">
        <div id="sn-popup-card">
          <button id="sn-popup-close" aria-label="Close popup">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <div id="sn-popup-badge">The Nova Brief</div>
          <h2 id="sn-popup-headline">Get the cloud GTM intelligence your competitors are already reading.</h2>
          <p id="sn-popup-sub">Weekly co-sell tactics, field motion intelligence, and marketplace execution across AWS, Azure, and GCP. From Jen Dawson, practitioner.</p>
          <div id="sn-popup-proof">
            <span>Trusted by 100+ ISVs</span>
            <span aria-hidden="true">·</span>
            <span>No spam. Unsubscribe anytime.</span>
          </div>
          <form id="sn-popup-form">
            <div id="sn-popup-fields">
              <input type="email" name="email" id="sn-popup-email" placeholder="Enter your work email" autocomplete="email" required/>
            </div>
            <button type="submit" id="sn-popup-submit">
              Get The Nova Brief
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </form>
          <div id="sn-popup-success" style="display:none">
            <div id="sn-popup-success-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" stroke="#34A853" stroke-width="2"/><path d="M9 16l5 5 9-9" stroke="#34A853" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div id="sn-popup-success-text">You are subscribed.</div>
            <div id="sn-popup-success-sub">First issue coming soon. Check your inbox.</div>
          </div>
        </div>
      </div>`;

    attachEvents();
  }

  function attachEvents() {
    document.getElementById('sn-popup-overlay').addEventListener('click', e => { if (e.target.id === 'sn-popup-overlay') closePopup(); });
    document.getElementById('sn-popup-close').addEventListener('click', closePopup);
    document.getElementById('sn-popup-form').addEventListener('submit', handleSubmit);
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', esc); } });
  }

  function openPopup() {
    const overlay = document.getElementById('sn-popup-overlay');
    if (!overlay) return;
    overlay.classList.add('sn-popup-visible');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => { const n = document.getElementById('sn-popup-email'); if (n) n.focus(); }, 300);
  }

  function closePopup() {
    const overlay = document.getElementById('sn-popup-overlay');
    if (!overlay) return;
    overlay.classList.remove('sn-popup-visible');
    overlay.classList.add('sn-popup-closing');
    
    // Permanently block popup for this user
    localStorage.setItem(STORAGE_KEY, 'true');
    
    setTimeout(() => { overlay.classList.remove('sn-popup-closing'); overlay.setAttribute('aria-hidden', 'true'); }, 280);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn  = document.getElementById('sn-popup-submit');
    const emailInput = document.getElementById('sn-popup-email').value;
    
    const originalContent = btn.innerHTML;
    btn.textContent = 'Subscribing…';
    btn.disabled = true;

    // REVERTED to Paid Account HubSpot Forms API endpoint
    const portalId = '245317385';
    const formId = '80375307-028c-4c4f-819c-96dc9e0f6727';
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [{ name: 'email', value: emailInput }],
          context: { pageUri: window.location.href, pageName: document.title }
        })
      });

      if (!response.ok) {
         const errText = await response.text();
         throw new Error("HubSpot API rejected: " + errText);
      }

      form.style.display = 'none';
      document.getElementById('sn-popup-success').style.display = 'flex';
      
      // Permanently block popup from ever showing again after successful subscribe
      localStorage.setItem(STORAGE_KEY, 'true');
      
      setTimeout(closePopup, 3200);
    } catch (err) {
      console.error(err);
      btn.innerHTML = originalContent;
      btn.disabled = false;
      alert('HubSpot blocked the submission. Please ensure reCAPTCHA is turned off.');
    }
  }

  function init() {
    if (!shouldShow()) return;
    injectCSS();
    buildPopup();
    setTimeout(openPopup, DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();