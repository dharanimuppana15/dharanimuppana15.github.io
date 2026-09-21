/**
 * Dharani Muppana — Portfolio Main JavaScript
 * Handles navigation, mobile drawer, scroll animations, counters, filters, modals, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollReveal();
  initScrollspy();
  initStatCounters();
  initWorkFilters();
  initDossierModal();
  initEmailCopy();
  initContactForm();
  initBackToTop();
  // initMediumFeed(); // Disabled to preserve the curated Ciena research case study showcase
});

/* ==========================================================================
   1. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileDrawer || !mobileBackdrop) return;

  function openDrawer() {
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  mobileBackdrop.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   2. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Fallback for environments where IntersectionObserver isn't available
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. Active Navigation Scrollspy
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('header nav a[href^="#"]');

  if (!sections.length || !desktopLinks.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================================
   4. Animated Stat Number Counters
   ========================================================================== */
function initStatCounters() {
  const counterElements = document.querySelectorAll('.counter-val');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);

          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Selected Work Category Filters
   ========================================================================== */
function initWorkFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const workCards = document.querySelectorAll('.work-item');

  if (!filterTabs.length || !workCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active state on tabs
      filterTabs.forEach(t => t.classList.remove('is-active', 'bg-primary', 'text-surface'));
      tab.classList.add('is-active', 'bg-primary', 'text-surface');

      // Filter cards
      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   6. Interactive Dossier Modal Preview
   ========================================================================== */
const dossierDatabase = {
  'case-ciena': {
    tag: 'EQUITY RESEARCH · STAN ANALYST CASE STUDY',
    title: 'Ciena Corporation (NYSE: CIEN) — The Bandwidth Egress Trade',
    subtitle: 'The AI Trade’s Second Act: Why Ciena Is the Right Company at the Wrong Price',
    context: 'An institutional-grade equity research case study evaluating Ciena Corporation (NYSE: CIEN) through a combination of structural AI infrastructure thesis building, an original 3-scenario valuation model, and peer comp benchmarks. Investigates how AI workloads transitioning from training capex to recurring inference shifts the binding constraint outward to the optical transport layer ("scale across"), while establishing that CIEN at ~80x forward P/E has priced in near-perfection.',
    methodology: [
      'Bandwidth Egress Thesis: Proved that AI traffic cannot monetize until it leaves the data center. Evaluated Ciena’s "scale-across" coherent optical architecture chosen by 3 of 4 major US hyperscalers for multi-campus AI training clusters.',
      'Three-Scenario Valuation Model: Built an operating model flexing FY26–FY28 revenue growth, operating margins, and exit multiples. Modeled Bear ($124, -75%), Base ($262, -48%), and Bull ($476, -6%) cases against a current price of $503, yielding a probability-weighted fair value of $270 (-46%).',
      'Peer Comp Multiple Benchmarking: Cross-checked against networking and optical peers (CSCO, NOK, ANET, COHR, LITE; peer median ~37x P/E), demonstrating base-case FY27 EPS ($6.89) implies $254.',
      'Multi-Channel Analytical Output: Synthesized SEC Form 8-K filings and Q4 FY25 earnings call transcripts into an executive investment memo, a 12-tweet structured thesis thread, and a long-form Substack publication.'
    ],
    metrics: [
      { label: 'Fair Value (Model)', value: '$270 (-46%)' },
      { label: 'Accumulation Target', value: '$350–$420' },
      { label: 'Analyst Stance', value: 'HOLD / Neutral' }
    ],
    actionText: 'Open Full PDF Paper (11 Pages)',
    link: 'assets/docs/ciena-analyst-case-study.pdf',
    secondaryText: 'LinkedIn Post & Discussion',
    secondaryLink: 'https://lnkd.in/p/gDA99Pye'
  },
  'inventory-management': {
    tag: 'OPEN SOURCE · STREAMLIT & PROPHET',
    title: 'Inventory Management & Forecasting Dashboard',
    subtitle: 'End-to-End Stock Monitoring, Expiry Prediction & 90-Day Prophet Sales Forecasting',
    context: 'An interactive Streamlit analytics platform that reads high-dimensional grocery inventory and sales records (Grocery_Inventory_and_Sales_Dataset.csv), transforming raw logs into actionable operational decisions for stock managers and founders to prevent costly expiration and stockouts.',
    methodology: [
      'Multi-Tab Interface: Built 4 distinct operational views (Overview, Analytics, Products Explorer, and Reports) with interactive Plotly Express charts for category turnover, expiry risks, and supplier performance.',
      'Predictive Sales Forecasting: Integrated the Prophet machine learning engine (with 7-day moving average fallback) to model and forecast 90-day demand curves per individual SKU.',
      'Automated Stock Alerts & Dynamic Reorder: Implemented automated triggers flagging low stock and items expiring within 30 days, calculating suggested reorder quantities dynamically.',
      'Executive Reporting: Engineered automated PDF generation using ReportLab, compiling total inventory value, sales volumes, and top 20 high-value stock items.'
    ],
    metrics: [
      { label: 'Forecast Horizon', value: '90-Day Prophet' },
      { label: 'Expiry Alert Buffer', value: '30 Days' },
      { label: 'Stack', value: 'Streamlit & Plotly' }
    ],
    link: 'https://github.com/dharanimuppana15/Inventory-Management-'
  },
  'pipeline-quant': {
    tag: 'OPEN SOURCE · STREAMLIT & PROPHET',
    title: 'Inventory Management & Forecasting Dashboard',
    subtitle: 'End-to-End Stock Monitoring, Expiry Prediction & 90-Day Prophet Sales Forecasting',
    context: 'An interactive Streamlit analytics platform that reads high-dimensional grocery inventory and sales records, transforming raw logs into actionable operational decisions to prevent costly expiration and stockouts.',
    methodology: [
      'Multi-Tab Interface: Built 4 distinct operational views with interactive Plotly Express charts for category turnover, expiry risks, and supplier performance.',
      'Predictive Sales Forecasting: Integrated the Prophet machine learning engine to model and forecast 90-day demand curves per individual SKU.',
      'Automated Stock Alerts: Implemented automated triggers flagging low stock and items expiring within 30 days with dynamic reorder quantity algorithms.'
    ],
    metrics: [
      { label: 'Forecast Horizon', value: '90-Day Prophet' },
      { label: 'Expiry Alert Buffer', value: '30 Days' },
      { label: 'Stack', value: 'Streamlit & Plotly' }
    ],
    link: 'https://github.com/dharanimuppana15/Inventory-Management-'
  },
  'hr-analytics-dashboard': {
    tag: 'OPEN SOURCE · XGBOOST & SHAP',
    title: 'AI-Powered HR Analytics & Attrition Dashboard',
    subtitle: 'Employee Attrition Prediction with Model Explainability & Lifetime Value (ELTV) Modeling',
    context: 'An interactive machine learning platform examining workforce attrition across 1,470 employee records (IBM HR Analytics dataset). Combines an XGBoost classifier with SHAP (SHapley Additive exPlanations) so HR leaders can understand not just who might leave, but why.',
    methodology: [
      '8 Comprehensive Views: Built multi-tab navigation spanning Attrition Splits, Satisfaction Distributions, Demographics, Predictor, Explainability, Profile Deep-Dive, ELTV Leaderboards, and Time-Based Turnover.',
      'ML Classifier Architecture: Implemented Scikit-learn preprocessing (label encoding, feature scaling, 70/30 train/test split) powering an XGBoost attrition classifier.',
      'SHAP Explainability: Eliminated black-box opacity by providing global feature importance summary plots and individual employee SHAP waterfall breakdowns.',
      'ELTV Simulation: Formulated Estimated Lifetime Value scoring (Monthly Income × Performance Rating × Tenure × 1.2) allowing managers to simulate retention impact.'
    ],
    metrics: [
      { label: 'Dataset Size', value: '1,470 Records' },
      { label: 'Model Stack', value: 'XGBoost + SHAP' },
      { label: 'Dashboard Views', value: '8 Deep Views' }
    ],
    link: 'https://github.com/dharanimuppana15/A-HR-dashboard'
  },
  'pipeline-market': {
    tag: 'OPEN SOURCE · XGBOOST & SHAP',
    title: 'AI-Powered HR Analytics & Attrition Dashboard',
    subtitle: 'Employee Attrition Prediction with Model Explainability & Lifetime Value (ELTV) Modeling',
    context: 'An interactive machine learning platform examining workforce attrition across 1,470 employee records (IBM HR Analytics dataset). Combines an XGBoost classifier with SHAP explainability.',
    methodology: [
      '8 Comprehensive Views: Built multi-tab navigation spanning Attrition Splits, Satisfaction Distributions, Demographics, and Time-Based Turnover.',
      'ML Classifier Architecture: Implemented Scikit-learn preprocessing powering an XGBoost attrition classifier.',
      'SHAP Explainability: Global feature importance summary plots and individual employee SHAP waterfall breakdowns.'
    ],
    metrics: [
      { label: 'Dataset Size', value: '1,470 Records' },
      { label: 'Model Stack', value: 'XGBoost + SHAP' },
      { label: 'Dashboard Views', value: '8 Deep Views' }
    ],
    link: 'https://github.com/dharanimuppana15/A-HR-dashboard'
  },
  'case-retail-elasticity': {
    tag: 'PRICING STRATEGY · UALBANY SHOWCASE',
    title: 'Price Elasticity & Demand Analysis in Multi-Product Retail',
    subtitle: 'Customer Response to Price Changes, Inelastic Demand & Segmented Strategy',
    context: 'An empirical pricing research study presented at the UAlbany Showcase analyzing customer purchasing behavior across 788,000+ transaction records from the UCI Online Retail II dataset. Examined how price adjustments impact quantity demanded across diverse product categories and customer classifications.',
    methodology: [
      'Large-Scale E-Commerce Dataset: Processed and cleaned over 788,000 transaction records to estimate price elasticity of demand across multiple product tiers.',
      'Inelastic Demand Identification: Discovered demand is generally inelastic across products (elasticity between -0.22 and -0.58), demonstrating that targeted price increases can directly improve gross revenues without proportional volume destruction.',
      'Customer Persona Impact: Established that customer classification drives price sensitivity far more significantly than raw product price point.',
      'Wholesale vs. Retail Dynamics: Discovered that retail-type shoppers are nearly twice as price-sensitive as wholesale buyers, proving that uniform pricing underperforms segmented pricing structures.'
    ],
    metrics: [
      { label: 'Dataset Records', value: '788K+ Transactions' },
      { label: 'Demand Elasticity', value: '-0.22 to -0.58' },
      { label: 'Retail vs Wholesale', value: '~2x Sensitivity' }
    ],
    actionText: 'View LinkedIn Post & Presentation',
    link: 'https://lnkd.in/p/gjAjYECB'
  },
  'case-econometric-pricing': {
    tag: 'ECONOMETRICS & PRICING · SUNY ALBANY',
    title: 'Econometric Demand Modeling & Fixed-Effects Pricing',
    subtitle: 'Pooled OLS, Product Fixed-Effects & Wholesale/Retail Segmentation',
    context: 'An econometric research analysis conducted during the MS in Business Analytics program at SUNY Albany, evaluating 788,100 transaction records to estimate aggregate and SKU-level price elasticity of demand and uncover structural mispricing.',
    methodology: [
      'Pooled OLS Regression: Applied pooled Ordinary Least Squares regression to establish baseline demand elasticity of -0.42 across all product transactions.',
      'Product Fixed-Effects Control: Incorporated fixed-effects specifications controlling for unobserved product heterogeneity, refining overall elasticity to -0.34.',
      'Product-Level Elasticity Range: Discovered wide elasticity variation ranging from -0.22 for essential commodity bulk items to -0.58 for premium retail items.',
      'Revenue Optimization Audit: Concluded that products were systematically underpriced relative to their revenue-maximizing equilibrium, with price sensitivity driven predominantly by buyer segment.'
    ],
    metrics: [
      { label: 'Pooled Elasticity', value: '-0.42 (-0.34 FE)' },
      { label: 'Elasticity Range', value: '-0.22 to -0.58' },
      { label: 'Key Finding', value: 'Systematic Underpricing' }
    ],
    actionText: 'View LinkedIn Post & Discussion',
    link: 'https://lnkd.in/p/gSiivkgf'
  }
};

function initDossierModal() {
  const modalOverlay = document.getElementById('dossier-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalContext = document.getElementById('modal-context');
  const modalMethodology = document.getElementById('modal-methodology');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const modalSecondaryBtn = document.getElementById('modal-secondary-btn');

  if (!modalOverlay) return;

  function openModal(dossierId) {
    const data = dossierDatabase[dossierId];
    if (!data) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalContext.textContent = data.context;

    // Populate Methodology
    modalMethodology.innerHTML = '';
    data.methodology.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2.5 text-body-md text-on-surface-variant';
      li.innerHTML = `<span class="text-secondary font-bold select-none">›</span><span>${item}</span>`;
      modalMethodology.appendChild(li);
    });

    // Populate Metrics
    modalMetrics.innerHTML = '';
    data.metrics.forEach(metric => {
      const card = document.createElement('div');
      card.className = 'p-3 bg-surface-container-low hairline-all';
      card.innerHTML = `
        <div class="font-headline-sm text-primary font-semibold">${metric.value}</div>
        <div class="font-label-mono text-[11px] text-outline uppercase tracking-wider mt-0.5">${metric.label}</div>
      `;
      modalMetrics.appendChild(card);
    });

    modalActionBtn.href = data.link;
    const btnTextEl = modalActionBtn.querySelector('span:first-child');
    if (btnTextEl) {
      btnTextEl.textContent = data.actionText || 'Open Reference Resource';
    }
    if (data.link.startsWith('http') || data.link.endsWith('.pdf')) {
      modalActionBtn.target = '_blank';
      modalActionBtn.rel = 'noopener';
    } else {
      modalActionBtn.removeAttribute('target');
      modalActionBtn.removeAttribute('rel');
    }

    if (modalSecondaryBtn) {
      if (data.secondaryLink) {
        modalSecondaryBtn.href = data.secondaryLink;
        const secText = modalSecondaryBtn.querySelector('span:first-child');
        if (secText) secText.textContent = data.secondaryText || 'LinkedIn Dispatch';
        modalSecondaryBtn.classList.remove('hidden');
      } else {
        modalSecondaryBtn.classList.add('hidden');
      }
    }

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('[data-dossier-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-dossier-trigger');
      openModal(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. One-Click Copy Email Action
   ========================================================================== */
function initEmailCopy() {
  const copyButtons = document.querySelectorAll('.btn-copy-email');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'dharanimuppana83@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard!`);
        }).catch(() => {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
    document.body.removeChild(tempInput);
  }
}

/* ==========================================================================
   8. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Build payload from form data
    const formData = new FormData(form);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    // If a custom subject was specified, format it cleanly
    if (payload.custom_subject && payload.custom_subject.trim()) {
      payload.subject = `Dharani Muppana inquiry: ${payload.custom_subject.trim()}`;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Dispatching note...</span>';

    try {
      const response = await fetch('https://api.staticforms.dev/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        showToast('Thank you! Your executive note has been dispatched to Dharani.');
        form.reset();
      } else {
        showToast(result.message || 'Error submitting note. Please try email directly.');
      }
    } catch (err) {
      console.error('StaticForms submission error:', err);
      // Safe fallback: standard form submission
      showToast('Dispatching via gateway...');
      form.submit();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ==========================================================================
   9. Floating Back-to-Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span class="text-secondary font-bold">✓</span><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ==========================================================================
   10. Dynamic Medium Blog Feed Fetcher
   ========================================================================== */
async function initMediumFeed() {
  const container = document.getElementById('medium-articles-grid');
  const feedStatusIndicator = document.getElementById('medium-feed-status');
  if (!container) return;

  const username = 'dharanimuppana15';
  const rssUrl = `https://medium.com/feed/@${username}`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
      container.innerHTML = '';

      if (feedStatusIndicator) {
        feedStatusIndicator.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded font-label-mono text-[11px] text-primary">
            <span class="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>LIVE MEDIUM FEED</span>
          </span>
        `;
      }

      data.items.forEach((item, idx) => {
        const article = document.createElement('article');
        article.className = `reveal-on-scroll ${idx > 0 ? 'delay-' + (idx * 100) : ''} bg-surface-container-lowest p-6 sm:p-8 hairline-all flex flex-col justify-between hover:-translate-y-1 hover:border-secondary transition-all duration-200 is-revealed`;

        // Format publication date
        let pubDateStr = 'RECENT';
        if (item.pubDate) {
          const cleanDate = item.pubDate.replace(/-/g, '/');
          const date = new Date(cleanDate);
          if (!isNaN(date.getTime())) {
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            pubDateStr = `${months[date.getMonth()]} ${date.getFullYear()}`;
          }
        }

        // Clean plain text and excerpt
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.description || item.content || '';
        const plainText = (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim();
        const excerpt = plainText.length > 170 ? plainText.substring(0, 170).trim() + '...' : plainText;

        // Reading time calculation
        const words = plainText.split(/\s+/).filter(Boolean).length;
        const readTime = Math.max(1, Math.ceil(words / 220));

        // Category Tag
        let categoryTag = 'STRATEGY & AI';
        if (item.categories && item.categories.length > 0) {
          categoryTag = item.categories[0].toUpperCase().replace(/-/g, ' ');
        }

        article.innerHTML = `
          <div>
            <div class="flex justify-between items-center font-label-mono text-xs text-outline mb-3">
              <span>${pubDateStr}</span>
              <span>${readTime} MIN READ</span>
            </div>
            <h3 class="font-headline-sm text-xl text-primary mb-3 leading-snug">
              <a href="${item.link}" target="_blank" rel="noopener" class="hover:text-secondary transition-colors">
                ${item.title}
              </a>
            </h3>
            <p class="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
              ${excerpt}
            </p>
          </div>
          <div class="pt-4 hairline-t flex justify-between items-center">
            <span class="font-label-caps text-[10px] text-secondary font-semibold">${categoryTag}</span>
            <a class="font-title-md text-xs sm:text-sm text-primary hover:text-secondary font-semibold flex items-center gap-1" href="${item.link}" rel="noopener" target="_blank">
              <span>Read on Medium</span>
              <span>↗</span>
            </a>
          </div>
        `;

        container.appendChild(article);
      });

      // If fewer than 3 posts, append an elegant follow card to balance the 3-column grid
      if (data.items.length < 3) {
        const followCard = document.createElement('article');
        followCard.className = `reveal-on-scroll delay-200 bg-surface-container-low p-6 sm:p-8 hairline-all flex flex-col justify-between border-dashed hover:-translate-y-1 hover:border-secondary transition-all duration-200 is-revealed`;
        followCard.innerHTML = `
          <div>
            <div class="flex justify-between items-center font-label-mono text-xs text-secondary font-semibold mb-3">
              <span>FORTHCOMING</span>
              <span>BI-WEEKLY DISPATCH</span>
            </div>
            <h3 class="font-headline-sm text-xl text-primary mb-3 leading-snug">
              More Strategic Notes &amp; Teardowns in Progress
            </h3>
            <p class="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
              Follow along on Medium for upcoming deep dives exploring early-stage startup metrics, product-led distribution models, and quantitative AI economics.
            </p>
          </div>
          <div class="pt-4 hairline-t flex justify-between items-center">
            <span class="font-label-caps text-[10px] text-outline font-semibold">PUBLIC PROFILE</span>
            <a class="font-title-md text-xs sm:text-sm text-secondary hover:text-primary font-semibold flex items-center gap-1" href="https://medium.com/@${username}" rel="noopener" target="_blank">
              <span>Follow @${username}</span>
              <span>↗</span>
            </a>
          </div>
        `;
        container.appendChild(followCard);
      }
    }
  } catch (err) {
    console.warn('Could not fetch dynamic Medium feed, keeping pre-rendered articles:', err);
  }
}

