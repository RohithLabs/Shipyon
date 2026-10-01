/**
 * SHIPYON V2 - INTERACTIONS & FUNCTIONALITY
 * Clean, soft, responsive interactions for architectural trade site
 */

function initShipyonApp() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  initSmoothScrolling();
  initSmoothNavAnchors();
  initScrollSpy();
  initHeaderScroll();
  initMobileNav();
  initQuoteModal();
  initCounters();
  initProductFilters();
  initWorldTradeMap();
  initWhyChooseShowcase();
  initCuriousFolio();
  initSleekShipScrollbar();
  initHeroConsoleTilt();
  initCounterAnimation();
  initScrollReveals();
  initParallaxEngine();
  initProcessRoadMilestones();
  initMobileMovesSwipe();
  initValuesInteractiveCards();
  initShipyonCursorGimmicks();
  initGlobalTradeNetworkInteractions();
  initHighwayAtmosphereAndAutopilot();
  initSequentialHoverTestimonials();
  initWhatsAppFloatingButton();
  initUniversalVisibilityManager();
  initProSpotlightAndTilt();
  initProScrollReveals();
  initProMetricCounters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShipyonApp);
} else {
  initShipyonApp();
}

// 1. Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('main-header') || document.getElementById('site-header') || document.querySelector('.site-header-serene');
  if (!header) return;

  let isScrolled = false;
  const onScroll = () => {
    const shouldBeScrolled = (window.scrollY || window.pageYOffset || 0) > 25;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      header.classList.toggle('scrolled', isScrolled);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle-serene') || document.getElementById('mobile-toggle-btn');
  const header = document.querySelector('.site-header-serene') || document.getElementById('main-header');
  const navLinks = document.getElementById('primary-nav') || document.getElementById('nav-links');

  if (toggleBtn && header) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = header.classList.toggle('mobile-nav-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        header.classList.remove('mobile-nav-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking any nav link
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          header.classList.remove('mobile-nav-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
}

// 3. Quote Request Modal
function initQuoteModal() {
  const overlay = document.getElementById('quote-modal-overlay');
  const openButtons = document.querySelectorAll('.open-quote-modal-btn');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  function renderQuoteModalCart() {
    let cartBox = overlay.querySelector('.modal-cart-preview');
    try {
      const raw = localStorage.getItem('shipyon_cart');
      const cart = raw ? JSON.parse(raw) : [];
      if (Array.isArray(cart) && cart.length > 0) {
        if (!cartBox) {
          cartBox = document.createElement('div');
          cartBox.className = 'modal-cart-preview';
          const form = overlay.querySelector('#quote-modal-form');
          if (form) form.insertBefore(cartBox, form.firstChild);
        }
        cartBox.innerHTML = `
          <div style="background: rgba(20,53,27,0.06); border: 1px solid rgba(27,115,57,0.25); border-radius: 10px; padding: 10px 14px; margin-bottom: 16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
              <span style="font-size: 0.78rem; font-weight: 800; color: #1B7339; text-transform: uppercase; letter-spacing: 0.04em;">✦ Selected Products (${cart.length})</span>
              <span style="font-size: 0.72rem; color: #1B7339; background: rgba(27,115,57,0.1); padding: 2px 6px; border-radius: 4px; font-weight: 700;">Included in WhatsApp Quote</span>
            </div>
            <div style="max-height: 110px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px;">
              ${cart.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #14351B; background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(20,53,27,0.1);">
                  <span style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">${item.title}</span>
                  <span style="color: #1B7339; font-weight: 800; font-size: 0.76rem; background: #ECFDF5; padding: 2px 6px; border-radius: 4px;">${item.qty} ${item.unit || 'MT'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        cartBox.style.display = 'block';
      } else if (cartBox) {
        cartBox.style.display = 'none';
      }
    } catch (e) {
      if (cartBox) cartBox.style.display = 'none';
    }
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderQuoteModalCart();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('quote-name')?.value.trim() || 'Procurement Representative';
  const email = document.getElementById('quote-email')?.value.trim() || '';
  const category = document.getElementById('quote-category')?.value || 'Agro Commodities & Spices';
  const destination = document.getElementById('quote-destination')?.value.trim() || 'Global Seaport';

  let cartText = '';
  try {
    const raw = localStorage.getItem('shipyon_cart');
    const cart = raw ? JSON.parse(raw) : [];
    if (Array.isArray(cart) && cart.length > 0) {
      cartText += `\n📦 *Selected Products from Catalog (${cart.length} Items):*\n`;
      cart.forEach((item, idx) => {
        cartText += `  ${idx + 1}. *${item.title}* (${item.qty} ${item.unit || 'MT'}) - ${item.packaging || 'Export Standard'}\n`;
      });
    }
  } catch (err) {}

  const msgLines = [
    `📋 *SHIPYON TRADE QUOTATION INQUIRY*`,
    `• *Representative / Company:* ${name}`,
    `• *Corporate Email:* ${email}`,
    `• *Trade Category:* ${category}`,
    `• *Destination Country / Port:* ${destination}`,
    cartText.trimEnd()
  ].filter(l => l !== '');

  const waUrl = `https://wa.me/919500690740?text=${encodeURIComponent(msgLines.join('\n'))}`;
  window.open(waUrl, '_blank');

  const overlay = document.getElementById('quote-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  e.target.reset();
}

// 4. Subtle Counting Animation on Viewport Entry
function initCounters() {
  const stats = document.querySelectorAll('.snapshot-value, .why-metric-stat');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  stats.forEach(stat => {
    stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(stat);
  });
}

// 5. Product Filtering (for products.html)
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const productCards = document.querySelectorAll('.catalog-item-card');

  if (!filterBtns.length || !productCards.length) return;

  // Check URL parameter if any
  const urlParams = new URLSearchParams(window.location.search);
  const requestedCat = urlParams.get('category');

  if (requestedCat) {
    filterBtns.forEach(btn => {
      if (btn.dataset.category === requestedCat) {
        activateTab(btn, requestedCat);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      activateTab(btn, category);
    });
  });

  function activateTab(activeBtn, category) {
    filterBtns.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    productCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// 6. Interactive Animated Blue World Trade Map & Telemetry Controller
function initWorldTradeMap() {
  const mapCard = document.getElementById('world-map-2d-card') || document.querySelector('.world-map-2d-card');
  if (!mapCard) return;

  const filterBtns = document.querySelectorAll('.map-filter-btn');
  const routePaths = mapCard.querySelectorAll('.trade-corridor-path');
  const countryNodes = mapCard.querySelectorAll('.country-node');
  const tooltip = document.getElementById('map-interactive-tooltip');
  const tooltipClose = document.getElementById('tooltip-close-btn');
  const tooltipDestName = document.getElementById('tooltip-dest-name');
  const tooltipTransit = document.getElementById('tooltip-transit-val');
  const tooltipPorts = document.getElementById('tooltip-ports-val');
  const tooltipCargo = document.getElementById('tooltip-cargo-val');
  const tooltipInquireBtn = document.getElementById('tooltip-inquire-btn');

  const modal = document.getElementById('quote-modal-overlay');
  const destInput = document.getElementById('quote-destination');

  let activeCorridor = 'all';
  let activeDestName = '';

  // 1. Corridor Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      activeCorridor = btn.dataset.corridor;

      // Filter route paths with smooth highlights
      routePaths.forEach(path => {
        if (activeCorridor === 'all') {
          path.classList.remove('route-dimmed', 'route-highlight');
        } else if (path.classList.contains(`corridor-${activeCorridor}`)) {
          path.classList.add('route-highlight');
          path.classList.remove('route-dimmed');
        } else {
          path.classList.add('route-dimmed');
          path.classList.remove('route-highlight');
        }
      });

      // Filter country nodes
      countryNodes.forEach(node => {
        const nodeCorridor = node.dataset.corridor;
        if (activeCorridor === 'all' || nodeCorridor === 'all' || nodeCorridor === activeCorridor) {
          node.style.opacity = '1';
          node.style.pointerEvents = 'auto';
        } else {
          node.style.opacity = '0.35';
          node.style.pointerEvents = 'auto';
        }
      });
    });
  });

  // 2. Interactive Tooltip Popover on Country Nodes
  function showTooltip(node) {
    if (!tooltip) return;

    const country = node.dataset.country;
    const transit = node.dataset.transit;
    const ports = node.dataset.ports;
    const cargo = node.dataset.cargo;

    if (!country) return;
    activeDestName = country;

    if (tooltipDestName) tooltipDestName.textContent = country;
    if (tooltipTransit) tooltipTransit.textContent = transit || 'Direct Liner Service';
    if (tooltipPorts) tooltipPorts.textContent = ports || 'Primary Seaport Berth';
    if (tooltipCargo) tooltipCargo.textContent = cargo || 'Agricultural & Industrial Exports';

    // Position tooltip relative to map card
    const cardRect = mapCard.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    let left = nodeRect.left - cardRect.left + (nodeRect.width / 2) - 160;
    let top = nodeRect.top - cardRect.top - 190;

    // Boundary checks
    if (left < 16) left = 16;
    if (left + 330 > cardRect.width) left = cardRect.width - 340;
    if (top < 16) top = nodeRect.bottom - cardRect.top + 16;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove('visible');
  }

  countryNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      showTooltip(node);
      const corridor = node.dataset.corridor;
      if (corridor && corridor !== 'all') {
        const matchingPath = mapCard.querySelector(`.trade-corridor-path.corridor-${corridor}`);
        if (matchingPath) matchingPath.classList.add('route-highlight');
      }
    });

    node.addEventListener('mouseleave', () => {
      if (activeCorridor === 'all') {
        routePaths.forEach(p => p.classList.remove('route-highlight'));
      }
    });

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      showTooltip(node);
    });
  });

  if (tooltipClose) {
    tooltipClose.addEventListener('click', (e) => {
      e.stopPropagation();
      hideTooltip();
    });
  }

  // Click outside tooltip to hide
  document.addEventListener('click', (e) => {
    if (tooltip && !tooltip.contains(e.target) && !e.target.closest('.country-node')) {
      hideTooltip();
    }
  });

  // Inquire button inside tooltip
  if (tooltipInquireBtn) {
    tooltipInquireBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      if (destInput && activeDestName) {
        destInput.value = activeDestName;
      }
      hideTooltip();
    });
  }
}
// 7. Interactive Why Choose Us Showcase
function initWhyChooseShowcase() {
  const cards = document.querySelectorAll('.why-pillar-card');
  const images = document.querySelectorAll('.why-console-frame .console-img');
  const tagEl = document.getElementById('why-hud-tag');
  const titleEl = document.getElementById('why-hud-title');
  const progressFill = document.getElementById('why-hud-progress');
  const listEl = document.getElementById('why-pillars-list');

  if (!cards.length || !images.length) return;

  const data = [
    { tag: 'Pillar 01 • Sourcing', title: 'Origin Control & Certified Grading' },
    { tag: 'Pillar 02 • Cold Chain', title: 'Precision Reefer & Cold Chain Fleet' },
    { tag: 'Pillar 03 • Seaports', title: 'Deep-Water Seaport Access' },
    { tag: 'Pillar 04 • Compliance', title: 'Phytosanitary & Institutional Trust' }
  ];

  let currentIndex = 0;
  let autoTimer = null;
  let isHovered = false;
  let progressTimeout = null;

  function setActivePillar(index) {
    currentIndex = index;
    cards.forEach((card, idx) => {
      const isActive = idx === index;
      card.classList.toggle('active', isActive);
      card.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    images.forEach((img, idx) => {
      img.classList.toggle('active', idx === index);
    });

    if (tagEl && data[index]) tagEl.textContent = data[index].tag;
    if (titleEl && data[index]) titleEl.textContent = data[index].title;

    // Animate progress bar cleanly without overlapping timers
    if (progressFill) {
      if (progressTimeout) clearTimeout(progressTimeout);
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      progressTimeout = setTimeout(() => {
        if (!isHovered) {
          progressFill.style.transition = 'width 4.8s linear';
          progressFill.style.width = '100%';
        } else {
          progressFill.style.transition = 'width 0.3s ease';
          progressFill.style.width = '100%';
        }
      }, 50);
    }
  }

  function startAutoCycle() {
    stopAutoCycle();
    if (isHovered) return;
    autoTimer = setInterval(() => {
      if (!isHovered) {
        const nextIndex = (currentIndex + 1) % cards.length;
        setActivePillar(nextIndex);
      }
    }, 4800);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Interacting with cards switches view immediately and pauses cycle while user reads
  cards.forEach((card, idx) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'tab');
    card.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoCycle();
      setActivePillar(idx);
    });

    card.addEventListener('click', () => {
      isHovered = true;
      stopAutoCycle();
      setActivePillar(idx);
    });

    card.addEventListener('focus', () => {
      isHovered = true;
      stopAutoCycle();
      setActivePillar(idx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActivePillar(idx);
      }
    });
  });

  // When mouse leaves the pillars list container, resume smooth auto-cycle
  if (listEl) {
    listEl.addEventListener('mouseleave', () => {
      isHovered = false;
      startAutoCycle();
      if (progressFill) {
        progressFill.style.transition = 'width 4.8s linear';
        progressFill.style.width = '100%';
      }
    });
  }

  // Clicking console advances to next pillar
  const display = document.getElementById('why-console-display');
  if (display) {
    display.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % cards.length;
      setActivePillar(nextIndex);
    });
  }

  // Start initial pillar and continuous cycle
  setActivePillar(0);
  startAutoCycle();
}

// 8. Curious Agro-Terroir Folio Interactions (Auto-Cycle & Interactive Expansion)
function initCuriousFolio() {
  const deck = document.getElementById('curious-folio-deck');
  if (!deck) return;

  const panels = deck.querySelectorAll('.curious-folio-panel');
  if (!panels.length) return;

  let currentIndex = 0;
  let autoTimer = null;
  let isHovered = false;

  function setActivePanel(indexOrPanel) {
    let targetIndex = typeof indexOrPanel === 'number' ? indexOrPanel : Array.from(panels).indexOf(indexOrPanel);
    if (targetIndex < 0 || targetIndex >= panels.length) return;
    currentIndex = targetIndex;

    panels.forEach((panel, idx) => {
      const isTarget = idx === targetIndex;
      panel.classList.toggle('active', isTarget);
      panel.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
      if (isTarget) {
        const bar = panel.querySelector('.folio-progress-timer-bar');
        if (bar) {
          bar.style.animation = 'none';
          void bar.offsetHeight;
          bar.style.animation = '';
        }
      }
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    if (isHovered) return;
    autoTimer = setInterval(() => {
      if (!isHovered) {
        const nextIndex = (currentIndex + 1) % panels.length;
        setActivePanel(nextIndex);
      }
    }, 4500);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  panels.forEach((panel, idx) => {
    panel.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoCycle();
      setActivePanel(idx);
    });

    panel.addEventListener('click', (e) => {
      if (e.target.closest('.folio-btn-action')) return;
      isHovered = true;
      stopAutoCycle();
      setActivePanel(idx);
    });

    panel.addEventListener('focusin', () => {
      isHovered = true;
      stopAutoCycle();
      setActivePanel(idx);
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('.folio-btn-action')) {
          e.preventDefault();
          isHovered = true;
          stopAutoCycle();
          setActivePanel(idx);
        }
      }
    });
  });

  deck.addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoCycle();
  });

  deck.addEventListener('mouseleave', () => {
    isHovered = false;
    startAutoCycle();
  });

  // Start initial panel and continuous auto-cycle
  setActivePanel(0);
  startAutoCycle();
}

// 9. Sleek Non-Emoji Custom Ship Scrollbar & Indicator
function initSleekShipScrollbar() {
  if (document.getElementById('sleek-ship-scrollbar-track')) return;

  const track = document.createElement('div');
  track.id = 'sleek-ship-scrollbar-track';
  track.className = 'sleek-ship-scrollbar-track';
  track.setAttribute('role', 'scrollbar');
  track.setAttribute('aria-label', 'Sleek Ship Scroll Bar Indicator');

  track.innerHTML = `
    <div class="sleek-ship-scrollbar-rail"></div>
    <div id="sleek-ship-thumb" class="sleek-ship-thumb">
      <svg class="sleek-ship-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 15.5L4.8 11H20.2L22.5 15.5C22.5 15.5 20 17 12.5 17C5 17 2.5 15.5 2.5 15.5Z" fill="#1E2A44" stroke="#FFFFFF" stroke-width="1" stroke-linejoin="round"/>
        <path d="M3.5 14H21.5" stroke="#16A085" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="6" y="8" width="3.5" height="3" rx="0.5" fill="#16A085" stroke="#FFFFFF" stroke-width="0.6"/>
        <rect x="10.5" y="8" width="3.5" height="3" rx="0.5" fill="#0E6BA8" stroke="#16A085" stroke-width="0.6"/>
        <path d="M15.5 11V6.5C15.5 6.2 15.7 6 16 6H19C19.3 6 19.5 6.2 19.5 6.5V11" fill="#FFFFFF" stroke="#1E2A44" stroke-width="0.9"/>
        <path d="M17.5 6V3.8" stroke="#16A085" stroke-width="1" stroke-linecap="round"/>
        <circle cx="17.5" cy="3.5" r="0.7" fill="#58D3BD"/>
      </svg>
      <div id="sleek-ship-tooltip" class="sleek-ship-tooltip">0%</div>
    </div>
  `;

  document.body.appendChild(track);

  const thumb = track.querySelector('#sleek-ship-thumb');
  const tooltip = track.querySelector('#sleek-ship-tooltip');
  const shipIcon = track.querySelector('.sleek-ship-icon');

  let isDragging = false;
  let startY = 0;
  let startScrollTop = 0;
  let lastScrollY = window.scrollY;

  function updateScrollPosition() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      track.style.display = 'none';
      return;
    } else {
      track.style.display = 'block';
    }

    const currentY = window.scrollY;
    const progress = Math.min(Math.max(currentY / totalHeight, 0), 1);
    
    const trackHeight = track.clientHeight;
    const padding = 18;
    const availableHeight = trackHeight - (padding * 2);
    thumb.style.top = (padding + (progress * availableHeight)) + 'px';

    const pct = Math.round(progress * 100);
    tooltip.textContent = `${pct}%`;
    track.setAttribute('aria-valuenow', pct.toString());

    if (currentY > lastScrollY + 2) {
      shipIcon.style.transform = 'rotate(10deg)';
    } else if (currentY < lastScrollY - 2) {
      shipIcon.style.transform = 'rotate(-10deg)';
    } else {
      shipIcon.style.transform = 'rotate(0deg)';
    }

    lastScrollY = currentY;
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollPosition();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateScrollPosition, { passive: true });
  updateScrollPosition();

  track.addEventListener('click', (e) => {
    if (e.target.closest('#sleek-ship-thumb')) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const progress = Math.min(Math.max(clickY / rect.height, 0), 1);
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * totalHeight,
      behavior: 'smooth'
    });
  });

  thumb.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = window.scrollY;
    thumb.classList.add('dragging');
    thumb.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  thumb.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const trackHeight = track.clientHeight;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDelta = (deltaY / trackHeight) * totalHeight;
    const targetScroll = startScrollTop + scrollDelta;
    window.scrollTo(0, targetScroll);
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      thumb.classList.remove('dragging');
      shipIcon.style.transform = 'rotate(0deg)';
    }
  };

  thumb.addEventListener('pointerup', stopDrag);
  thumb.addEventListener('pointercancel', stopDrag);
}



// 10. Interactive 3D Perspective Tilt on Hero Showcase Console
function initHeroConsoleTilt() {
  const heroConsole = document.getElementById('hero-showcase-card');
  if (!heroConsole) return;

  heroConsole.addEventListener('mousemove', (e) => {
    const rect = heroConsole.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;

    heroConsole.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  heroConsole.addEventListener('mouseleave', () => {
    heroConsole.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

// 11. Eased Number Counter Animation with Auto-Formatting
function initCounterAnimation() {
  const counterEls = document.querySelectorAll(
    '.metric-number, .metric-num, .metric-val, .snapshot-value, ' +
    '.why-metric-stat, .counter-value, .why-metric-number, [data-counter]'
  );
  if (!counterEls.length) return;

  function parseNumberFormat(rawText) {
    const trimmed = (rawText || '').trim();
    if (!trimmed || trimmed === '24/7') return null;

    // Matches numbers with optional prefix (like $) and suffixes (like +, %, + Yrs, M, etc.)
    const match = trimmed.match(/^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return null;

    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];

    const hasCommas = numStr.includes(',');
    const cleanNumStr = numStr.replace(/,/g, '');
    const target = parseFloat(cleanNumStr);
    if (isNaN(target)) return null;

    const decimals = cleanNumStr.includes('.') ? cleanNumStr.split('.')[1].length : 0;
    return { prefix, target, decimals, hasCommas, suffix };
  }

  function animateCounter(el, parsed) {
    const duration = 1600;
    const startTime = performance.now();
    const { prefix, target, decimals, hasCommas, suffix } = parsed;

    function formatNum(val) {
      let str = val.toFixed(decimals);
      if (hasCommas) {
        const parts = str.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        str = parts.join('.');
      }
      return prefix + str + suffix;
    }

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential ease-out: 1 - 2^(-10 * t)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = target * ease;

      el.textContent = formatNum(currentVal);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = formatNum(target);
      }
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const parsed = el.__parsedCounter;
        if (parsed) {
          animateCounter(el, parsed);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  counterEls.forEach(el => {
    const parsed = parseNumberFormat(el.textContent);
    if (parsed) {
      el.__parsedCounter = parsed;
      observer.observe(el);
    }
  });
}

// 12. Fluid Universal Scroll Reveal Animations
function initScrollReveals() {
  // Pre-tag candidate parent elements as stagger groups across all sections and subpages
  const staggerContainers = document.querySelectorAll(
    '.about-col-metrics, .gtn-clean-metrics-row, .charter-pillars-grid, ' +
    '.modern-values-grid, .volza-pillars-grid, .volza-leadership-grid, .volza-trust-badges, ' +
    '.floating-features-card, .footer-columns-grid, .category-hero-grid, ' +
    '.ecom-categories-grid, .ecom-products-grid, .ecom-trust-ribbon, ' +
    '.globe-country-ribbon, .zigzag-milestones-tabs-bar, .zigzag-boxes-layer, ' +
    '.testimonials-slider-track, .testimonials-grid, .testimonials-client-logos, ' +
    '.testimonials-provenance-bar, .comm-regional-gateways, ' +
    '.global-contact-cards-grid, .hero-provenance-metrics, .pipeline-track, ' +
    '.featured-metrics-grid, .premium-services-grid, .services-hero-badges, .quayside-showcase-grid'
  );
  staggerContainers.forEach(container => {
    container.classList.add('stagger-reveal-group');
  });

  // Pre-tag candidate standalone elements as reveal-on-scroll (safe cards only - never whole sections or headers)
  const standaloneElements = document.querySelectorAll(
    '.volza-section-header, .ecom-section-header, ' +
    '.section-head-lux, .about-editorial-header, .about-col-narrative, ' +
    '.portfolio-header-split, .curious-folio-deck, .gtn-content-col, .gtn-visual-col, .gtn-globe-display-card, ' +
    '.comm-hub-wrapper, .comm-core-dock, .floating-rfq-portal, .live-whatsapp-terminal, ' +
    '.volza-about-text-col, .volza-about-visual-col, .volza-timeline-track, ' +
    '.volza-trade-map-card, .contact-card, .contact-form-card, .faq-accordion-item, ' +
    '.pipeline-header, .featured-service-hero, .catalog-header-bar, .category-group-header'
  );
  standaloneElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  // Tag directional & scale emergence variants for rich UI choreography
  document.querySelectorAll('.gtn-content-col, .about-col-narrative, .volza-about-text-col, .floating-rfq-portal, .featured-content-col').forEach(el => {
    el.classList.add('reveal-from-left');
  });
  document.querySelectorAll('.gtn-visual-col, .volza-about-visual-col, .live-whatsapp-terminal, .featured-visual-col').forEach(el => {
    el.classList.add('reveal-from-right');
  });
  document.querySelectorAll('.gtn-globe-display-card, .comm-core-dock, .featured-service-hero, .quayside-showcase-card').forEach(el => {
    el.classList.add('reveal-scale');
  });

  const revealTargets = document.querySelectorAll(
    '.reveal-on-scroll, .stagger-reveal-group, .reveal-from-left, .reveal-from-right, .reveal-scale'
  );
  if (!revealTargets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '250px 0px 250px 0px'
  });

  const vh = window.innerHeight || 800;

  revealTargets.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh + 100 && rect.bottom > -100) {
      el.classList.add('is-revealed');
    } else {
      observer.observe(el);
    }
  });

  // Safety fallback: reveal any remaining elements to guarantee 0 hidden content
  setTimeout(() => {
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  }, 1000);
}

// ============================================================================
// 12B. LENIS SMOOTH SCROLLING, ANCHOR NAVIGATION, SCROLL-SPY & PARALLAX ENGINE
// ============================================================================
let lenisInstance = null;
let parallaxElements = [];

function initSmoothScrolling() {
  // Pure native browser scrolling: instant, direct hardware response without inertia or lag
  window.lenis = null;
  lenisInstance = null;
  document.documentElement.style.scrollBehavior = 'auto';

  window.addEventListener('scroll', () => {
    if (parallaxElements.length) {
      updateParallax();
    }
  }, { passive: true });
}

function initSmoothNavAnchors() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    // Check if on index.html and clicking "Home" (href="index.html" or "index.html#...")
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    
    if (isHomePage && (href === 'index.html' || href === './index.html' || href === '/')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check for in-page anchors (e.g. href="#about-section" or href="index.html#about-section" while on index.html)
    try {
      const url = new URL(link.href, window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        const target = document.querySelector(url.hash);
        if (target) {
          e.preventDefault();
          const header = document.querySelector('.site-header-serene') || document.getElementById('main-header');
          const headerHeight = header ? header.offsetHeight : 80;
          const offset = -(headerHeight + 20);
          const targetY = target.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });

          // Close mobile menu if open
          if (header) {
            header.classList.remove('mobile-nav-open');
            const toggle = document.getElementById('mobile-nav-toggle-serene') || document.getElementById('mobile-toggle-btn');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    } catch (err) {}
  });

  // Handle URL hash on initial page load with proper header offset
  if (window.location.hash) {
    setTimeout(() => {
      try {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget) {
          const header = document.querySelector('.site-header-serene') || document.getElementById('main-header');
          const offset = header ? -(header.offsetHeight + 20) : -90;
          const targetY = hashTarget.getBoundingClientRect().top + window.pageYOffset + offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      } catch (err) {}
    }, 250);
  }
}

function initScrollSpy() {
  const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
  const navLinks = document.querySelectorAll('.nav-links-serene .nav-link-serene');
  if (!navLinks.length) return;

  // On the home page, keep 'Home' selected in the menu bar at all times
  if (isHomePage) {
    navLinks.forEach(link => {
      const isHome = link.getAttribute('href') === 'index.html' || link.textContent.trim() === 'Home';
      link.classList.toggle('active', isHome);
    });
  }
}

function initParallaxEngine() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroImg = document.querySelector('.hero-scenic-img');
  if (heroImg) {
    heroImg.setAttribute('data-parallax', 'true');
    heroImg.setAttribute('data-parallax-speed', '0.07');
  }

  const orb1 = document.querySelector('.hero-ambient-orb.orb-1');
  if (orb1) {
    orb1.setAttribute('data-parallax', 'true');
    orb1.setAttribute('data-parallax-speed', '-0.05');
  }

  const orb2 = document.querySelector('.hero-ambient-orb.orb-2');
  if (orb2) {
    orb2.setAttribute('data-parallax', 'true');
    orb2.setAttribute('data-parallax-speed', '0.05');
  }

  const goldenGlows = document.querySelectorAll('.golden-aurora-glow, .about-golden-glow');
  goldenGlows.forEach(glow => {
    glow.setAttribute('data-parallax', 'true');
    glow.setAttribute('data-parallax-speed', '0.04');
  });

  const atmosphericMesh = document.querySelector('.values-ambient-mesh');
  if (atmosphericMesh) {
    atmosphericMesh.setAttribute('data-parallax', 'true');
    atmosphericMesh.setAttribute('data-parallax-speed', '0.04');
  }

  parallaxElements = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!parallaxElements.length) return;

  cacheParallaxMetrics();
  window.addEventListener('resize', cacheParallaxMetrics, { passive: true });

  window.addEventListener('scroll', () => {
    if (!lenisInstance) {
      updateParallax();
    }
  }, { passive: true });

  updateParallax();
}

let parallaxMetrics = [];
let parallaxRafPending = false;

function cacheParallaxMetrics() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  parallaxMetrics = parallaxElements.map(el => {
    const rect = el.getBoundingClientRect();
    const speed = parseFloat(el.getAttribute('data-parallax-speed') || '0.05');
    return {
      el,
      speed,
      top: rect.top + scrollY,
      height: rect.height || 100
    };
  });
}

function updateParallax() {
  if (parallaxRafPending) return;
  parallaxRafPending = true;

  requestAnimationFrame(() => {
    parallaxRafPending = false;
    if (!parallaxMetrics.length) return;

    const vh = window.innerHeight || 800;
    const vCenter = vh * 0.5;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    for (let i = 0; i < parallaxMetrics.length; i++) {
      const item = parallaxMetrics[i];
      const elTop = item.top - scrollY;
      const elBottom = elTop + item.height;

      if (elBottom >= -120 && elTop <= vh + 120) {
        const elCenter = elTop + item.height * 0.5;
        const distFromCenter = elCenter - vCenter;
        const translateY = Math.round(distFromCenter * item.speed * 10) / 10;
        item.el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    }
  });
}


// ============================================================================
// 13. 3D ISOMETRIC ZIGZAG HIGHWAY ROAD & 4-STAGE PIPELINE (SCROLL-DRIVEN)
// ============================================================================
function initProcessRoadMilestones() {
  const track = document.getElementById("zigzag-scroll-track");
  const roadTruck = document.getElementById("road-cargo-truck");
  const arrowHead = document.getElementById("road-arrow-head");
  const tabs = document.querySelectorAll(".zigzag-tab-btn");
  const statusText = document.getElementById("zigzag-status-chip-text");
  
  if (!track || !roadTruck) return;

  const boxes = [
    document.getElementById("zbox-01"),
    document.getElementById("zbox-02"),
    document.getElementById("zbox-03"),
    document.getElementById("zbox-04")
  ];

  const pins = [
    document.getElementById("pin-marker-01"),
    document.getElementById("pin-marker-02"),
    document.getElementById("pin-marker-03"),
    document.getElementById("pin-marker-04")
  ];

  const connectors = [
    document.getElementById("connector-line-01"),
    document.getElementById("connector-line-02"),
    document.getElementById("connector-line-03"),
    document.getElementById("connector-line-04")
  ];

  const activeRoadPaths = document.querySelectorAll(
    ".road-path-asphalt-active, .road-path-white-shoulder, .road-path-inner-lane, .road-path-centerline"
  );
  const clipPathEl = document.getElementById("road-clip-path");

  const STAGE_STATUS_MESSAGES = [
    "Stage 01: Sourcing direct from regional farms (Tamil Nadu & Kerala)",
    "Stage 02: AI optical color sorting & certified phytosanitary clearance",
    "Stage 03: Real-time IoT temperature-controlled cold chain transit",
    "Stage 04: Priority vessel berths dispatched to 50+ global ports!"
  ];

  // --- Analytical 3-Segment Cubic Bézier Spline Math Engine ---
  // Guarantees 100% deterministic truck position & angle across all browsers (including Safari/iOS)
  const BEZIER_SEGMENTS = [
    { p0: { x: 145, y: 380 }, p1: { x: 265, y: 380 }, p2: { x: 325, y: 120 }, p3: { x: 445, y: 120 } },
    { p0: { x: 445, y: 120 }, p1: { x: 565, y: 120 }, p2: { x: 625, y: 380 }, p3: { x: 745, y: 380 } },
    { p0: { x: 745, y: 380 }, p1: { x: 865, y: 380 }, p2: { x: 925, y: 120 }, p3: { x: 1045, y: 120 } }
  ];

  function bezierPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;
    const x = mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x;
    const y = mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y;
    return { x, y };
  }

  function bezierDeriv(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
    const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
    return { dx, dy };
  }

  // Pre-sample 300 points along the path for uniform arc-length speed
  const ARC_SAMPLES = [];
  let totalLength = 0;
  let prevPt = BEZIER_SEGMENTS[0].p0;

  BEZIER_SEGMENTS.forEach((seg, sIdx) => {
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      if (sIdx > 0 && i === 0) continue;
      const t = i / steps;
      const pt = bezierPoint(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const deriv = bezierDeriv(seg.p0, seg.p1, seg.p2, seg.p3, t);
      const dist = Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
      totalLength += dist;
      const angle = Math.atan2(deriv.dy, deriv.dx) * (180 / Math.PI);
      ARC_SAMPLES.push({ d: totalLength, x: pt.x, y: pt.y, angle });
      prevPt = pt;
    }
  });

  function getTruckPosAtProgress(progress) {
    const p = Math.max(0, Math.min(1, progress));
    const targetDist = p * totalLength;
    for (let k = 0; k < ARC_SAMPLES.length - 1; k++) {
      if (ARC_SAMPLES[k + 1].d >= targetDist) {
        const s0 = ARC_SAMPLES[k];
        const s1 = ARC_SAMPLES[k + 1];
        const ratio = (targetDist - s0.d) / Math.max(0.0001, s1.d - s0.d);
        const x = s0.x + ratio * (s1.x - s0.x);
        const y = s0.y + ratio * (s1.y - s0.y);
        const angle = s0.angle + ratio * (s1.angle - s0.angle);
        return { x, y, angle };
      }
    }
    const last = ARC_SAMPLES[ARC_SAMPLES.length - 1];
    return { x: last.x, y: last.y, angle: last.angle };
  }

  // Configure initial road reveal stroke
  activeRoadPaths.forEach(path => {
    path.style.strokeDasharray = totalLength + " " + totalLength;
    path.style.strokeDashoffset = totalLength + "px";
  });
  if (clipPathEl) {
    clipPathEl.style.strokeDasharray = totalLength + " " + totalLength;
    clipPathEl.style.strokeDashoffset = totalLength + "px";
  }

  let targetProgress = 0;
  let currentProgress = 0;
  let currentStageIndex = 0;

  let trackTop = 0;
  let trackHeight = 0;
  let trackMaxScroll = 0;

  function cacheTrackMetrics() {
    const rect = track.getBoundingClientRect();
    trackTop = rect.top + (window.scrollY || window.pageYOffset || 0);
    trackHeight = track.offsetHeight || rect.height;
    trackMaxScroll = trackHeight - window.innerHeight;
  }
  cacheTrackMetrics();
  window.addEventListener("resize", cacheTrackMetrics, { passive: true });

  let isRoadVisible = false;
  let isRoadLoopRunning = false;

  function scheduleAnimLoop() {
    if (!isRoadLoopRunning && isRoadVisible) {
      isRoadLoopRunning = true;
      requestAnimationFrame(animLoop);
    }
  }

  // Compute scroll progress relative to track without layout thrashing
  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (trackMaxScroll > 0) {
      const scrolled = scrollY - trackTop;
      targetProgress = Math.max(0, Math.min(1, scrolled / trackMaxScroll));
    } else {
      const vpHeight = window.innerHeight || 800;
      const totalSpan = trackHeight + vpHeight;
      const scrolled = vpHeight - (trackTop - scrollY);
      targetProgress = Math.max(0, Math.min(1, scrolled / totalSpan));
    }
    scheduleAnimLoop();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const roadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isRoadVisible = entry.isIntersecting;
        if (isRoadVisible) {
          cacheTrackMetrics();
          scheduleAnimLoop();
        }
      });
    }, { rootMargin: '150px 0px 150px 0px', threshold: 0.01 });
    roadObserver.observe(track);
  } else {
    isRoadVisible = true;
    scheduleAnimLoop();
  }

  // Ultra-efficient animation loop that sleeps when settled or offscreen
  function animLoop() {
    if (!isRoadVisible) {
      isRoadLoopRunning = false;
      return;
    }

    const diff = targetProgress - currentProgress;
    let shouldContinue = false;

    if (Math.abs(diff) > 0.0004) {
      currentProgress += diff * 0.07;
      shouldContinue = true;
    } else {
      currentProgress = targetProgress;
    }

    const p = Math.max(0, Math.min(1, currentProgress));

    // 1. Reveal road along curve
    const offset = (totalLength * (1 - p)).toFixed(1);
    activeRoadPaths.forEach(path => {
      path.style.strokeDashoffset = offset + "px";
    });
    if (clipPathEl) {
      clipPathEl.style.strokeDashoffset = offset + "px";
    }

    // 2. Drive the container truck along the zigzag road path
    const truck = getTruckPosAtProgress(p);
    roadTruck.setAttribute(
      "transform",
      "translate(" + truck.x.toFixed(1) + ", " + truck.y.toFixed(1) + ") rotate(" + truck.angle.toFixed(1) + ")"
    );

    // 3. Arrow head active highlight at final destination
    if (arrowHead) {
      arrowHead.classList.toggle("active", p >= 0.92);
    }

    // 4. Sequential milestone & connector reveals along zigzag path
    const isStage1 = p >= 0.31;
    const isStage2 = p >= 0.64;
    const isStage3 = p >= 0.95;

    if (boxes[0]) {
      boxes[0].classList.add("revealed");
      boxes[0].classList.toggle("active-milestone", !isStage1);
    }
    if (boxes[1]) {
      boxes[1].classList.toggle("revealed", isStage1);
      boxes[1].classList.toggle("active-milestone", isStage1 && !isStage2);
    }
    if (boxes[2]) {
      boxes[2].classList.toggle("revealed", isStage2);
      boxes[2].classList.toggle("active-milestone", isStage2 && !isStage3);
    }
    if (boxes[3]) {
      boxes[3].classList.toggle("revealed", isStage3);
      boxes[3].classList.toggle("active-milestone", isStage3);
    }

    // Connectors
    if (connectors[0]) connectors[0].classList.add("active");
    if (connectors[1]) connectors[1].classList.toggle("active", isStage1);
    if (connectors[2]) connectors[2].classList.toggle("active", isStage2);
    if (connectors[3]) connectors[3].classList.toggle("active", isStage3);

    // SVG station pins
    if (pins[0]) pins[0].classList.add("active");
    if (pins[1]) pins[1].classList.toggle("active", isStage1);
    if (pins[2]) pins[2].classList.toggle("active", isStage2);
    if (pins[3]) pins[3].classList.toggle("active", isStage3);

    // Active milestone index
    let activeIdx = 0;
    if (isStage3) {
      activeIdx = 3;
    } else if (isStage2) {
      activeIdx = 2;
    } else if (isStage1) {
      activeIdx = 1;
    } else {
      activeIdx = 0;
    }

    // Tab buttons
    tabs.forEach((tab, idx) => {
      const isSelected = idx === activeIdx;
      const isPassed = idx <= activeIdx;
      tab.classList.toggle("active", isPassed);
      tab.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    // Status text
    if (activeIdx !== currentStageIndex) {
      currentStageIndex = activeIdx;
      if (statusText) {
        statusText.textContent = STAGE_STATUS_MESSAGES[currentStageIndex];
      }
    }

    if (shouldContinue) {
      requestAnimationFrame(animLoop);
    } else {
      isRoadLoopRunning = false;
    }
  }

  // Interactive Tab Clicks
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      const targetPercent = [0.0, 0.33, 0.67, 1.0][idx];
      if (trackMaxScroll > 0) {
        const destY = trackTop + trackMaxScroll * targetPercent;
        window.scrollTo({
          top: destY,
          behavior: "smooth"
        });
      } else {
        targetProgress = targetPercent;
        scheduleAnimLoop();
      }
    });
  });

  // Interactive Pin Clicks
  pins.forEach((pin, idx) => {
    if (!pin) return;
    pin.addEventListener("click", () => {
      const targetPercent = [0.0, 0.33, 0.67, 1.0][idx];
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const maxScroll = track.offsetHeight - window.innerHeight;
      if (maxScroll > 0) {
        window.scrollTo({
          top: trackTop + maxScroll * targetPercent,
          behavior: "smooth"
        });
      } else {
        targetProgress = targetPercent;
      }
    });
  });

  // Interactive Box Clicks
  boxes.forEach((box, idx) => {
    if (!box) return;
    box.addEventListener("click", () => {
      const targetPercent = [0.0, 0.33, 0.67, 1.0][idx];
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const maxScroll = track.offsetHeight - window.innerHeight;
      if (maxScroll > 0) {
        window.scrollTo({
          top: trackTop + maxScroll * targetPercent,
          behavior: "smooth"
        });
      } else {
        targetProgress = targetPercent;
      }
    });
  });

  if (statusText) {
    statusText.textContent = STAGE_STATUS_MESSAGES[0];
  }
  requestAnimationFrame(animLoop);
}

// 14. Mobile Swipe & Auxiliary Handlers
function initMobileMovesSwipe() {
  // Mobile swipe support if needed
}

// 15. The Shipyon Charter: Four Pillars Interactive System with Glowing Auto-Cycle & 3D Micro-Tilt
function initValuesInteractiveCards() {
  const section = document.getElementById("values-section");
  if (!section) return;

  const cards = section.querySelectorAll(".charter-pillar-card");
  const grid = section.querySelector(".charter-pillars-grid");
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let autoTimer = null;
  let isHovered = false;

  function setActiveCard(idx) {
    if (idx < 0 || idx >= cards.length) return;
    activeIndex = idx;
    cards.forEach((card, i) => {
      const isCurrent = (i === activeIndex);
      card.classList.toggle("is-active", isCurrent);
      card.setAttribute("aria-pressed", isCurrent ? "true" : "false");
      if (isCurrent) {
        const fill = card.querySelector(".pillar-progress-fill");
        if (fill) {
          fill.style.animation = "none";
          void fill.offsetHeight;
          fill.style.animation = "";
        }
      }
    });

    // Update continuous SVG artery nodes
    const nodes = section.querySelectorAll(".charter-artery-node");
    nodes.forEach((node, nIdx) => {
      node.classList.toggle("is-active", nIdx === activeIndex);
    });
  }

  function startAutoCycle() {
    stopAutoCycle();
    if (isHovered || prefersReducedMotion) return;
    autoTimer = setInterval(() => {
      if (!isHovered) {
        const nextIndex = (activeIndex + 1) % cards.length;
        setActiveCard(nextIndex);
      }
    }, 4200);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Set initial active card (Pillar I) and start glowing sequence
  setActiveCard(0);
  startAutoCycle();

  cards.forEach((card, idx) => {
    // Hover: focus card elevation and pause auto-cycle
    card.addEventListener("mouseenter", () => {
      isHovered = true;
      stopAutoCycle();
      setActiveCard(idx);
    });

    // Click: set active card
    card.addEventListener("click", () => {
      isHovered = true;
      stopAutoCycle();
      setActiveCard(idx);
    });

    // Keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        isHovered = true;
        stopAutoCycle();
        setActiveCard(idx);
      }
    });

    if (prefersReducedMotion) return;

    const glare = card.querySelector(".pillar-card-glare");

    // Dynamic 3D micro-tilt and specular glare tracking
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (glare) {
        glare.style.left = `${x}px`;
        glare.style.top = `${y}px`;
      }

      // Elegant, subtle 3D tilt (max 3.2 degrees - controlled and refined)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (((y - centerY) / centerY) * -3.2).toFixed(2);
      const tiltY = (((x - centerX) / centerX) * 3.2).toFixed(2);
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // When mouse leaves the entire grid, resume glowing auto-cycle
  if (grid) {
    grid.addEventListener("mouseenter", () => {
      isHovered = true;
      stopAutoCycle();
    });

    grid.addEventListener("mouseleave", () => {
      isHovered = false;
      cards.forEach((card) => {
        card.style.transform = "";
      });
      startAutoCycle();
    });
  }
}

/**
 * Interactive 3D Parallax Tilt & Specular Coordinates for Executive Leadership Cards
 */
function initLeadershipInteractiveCards() {
  const cards = document.querySelectorAll(".leader-exec-card[data-tilt]");
  if (!cards.length) return;

  cards.forEach((card) => {
    let ticking = false;

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
      card.classList.remove("is-hovered");
    });

    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        // Subtle, elegant 3D tilt (-5deg to +5deg)
        const tiltX = ((y - centerY) / centerY) * -5.2;
        const tiltY = ((x - centerX) / centerX) * 5.2;

        card.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale(1.015)`;
        ticking = false;
      });
    });
  });
}

/**
 * Global smooth scroll & service highlight handler for Testimonials
 * Works across both services.html and about.html
 */
function navigateToService(targetServiceId) {
  const targetElement = document.getElementById(targetServiceId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetElement.classList.add('service-highlight-pulse');
    setTimeout(() => {
      targetElement.classList.remove('service-highlight-pulse');
    }, 4200);
  } else {
    // If clicked on about.html or another page, redirect cleanly to services.html
    window.location.href = `services.html#${targetServiceId}`;
  }
}

window.navigateToService = navigateToService;

/**
 * Center-Distance Dynamic Hover Controller for Testimonials Marquee
 * Elevates & illuminates testimonial cards strictly when they reach a particular distance at the middle of the screen
 */
function initSequentialHoverTestimonials() {
  const wrapper = document.getElementById('testimonials-marquee-wrapper');
  const track = document.getElementById('testimonials-marquee-track');
  if (!wrapper || !track) return;

  const cards = track.querySelectorAll('.testimonial-card-exim');
  if (!cards || cards.length === 0) return;

  let currentAutoActiveCard = null;
  let rafId;

  // Manual hover interaction:
  // Allows user to hover any card with full elevated styling (via .is-manual-hovered & :hover).
  // Automatic center-stage hovering NEVER pauses or falters during manual hovering; both run concurrently.
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('is-manual-hovered');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-manual-hovered');
    });

    card.addEventListener('touchstart', () => {
      cards.forEach(c => {
        if (c !== card) c.classList.remove('is-manual-hovered');
      });
      card.classList.add('is-manual-hovered');
    }, { passive: true });
  });

  let isMarqueeVisible = false;
  let lastCheckTime = 0;

  function updateCenterHover() {
    if (!isMarqueeVisible) {
      rafId = null;
      return;
    }

    const now = performance.now();
    // Run distance calculations at max 10Hz (every 100ms) rather than 60/120Hz
    // This reduces DOM reflows by over 90% while keeping marquee auto-hover silky smooth
    if (now - lastCheckTime > 100) {
      lastCheckTime = now;
      const centerX = (window.innerWidth || 1200) / 2;
      let closestCard = null;
      let minDistance = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const rect = card.getBoundingClientRect();

        // Clear active state if card scrolls completely offscreen
        if (rect.right < 0 || rect.left > window.innerWidth) {
          if (card === currentAutoActiveCard) {
            card.classList.remove('is-auto-hovered');
            currentAutoActiveCard = null;
          }
          card.classList.remove('is-manual-hovered');
          continue;
        }

        const cardCenterX = rect.left + rect.width / 2;
        const distFromCenter = Math.abs(cardCenterX - centerX);

        if (distFromCenter < minDistance) {
          minDistance = distFromCenter;
          closestCard = card;
        }
      }

      if (closestCard && closestCard !== currentAutoActiveCard) {
        const cardWidth = closestCard.offsetWidth || 300;
        const middleTriggerZone = Math.max(90, cardWidth * 0.45);

        if (minDistance <= middleTriggerZone) {
          if (currentAutoActiveCard) {
            currentAutoActiveCard.classList.remove('is-auto-hovered');
          }
          closestCard.classList.add('is-auto-hovered');
          currentAutoActiveCard = closestCard;
        }
      }
    }

    rafId = requestAnimationFrame(updateCenterHover);
  }

  if ('IntersectionObserver' in window) {
    const marqueeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isMarqueeVisible;
        isMarqueeVisible = entry.isIntersecting;
        if (isMarqueeVisible && !wasVisible) {
          if (!rafId) rafId = requestAnimationFrame(updateCenterHover);
        } else if (!isMarqueeVisible && wasVisible) {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          if (currentAutoActiveCard) {
            currentAutoActiveCard.classList.remove('is-auto-hovered');
            currentAutoActiveCard = null;
          }
        }
      });
    }, { rootMargin: '100px 0px 100px 0px', threshold: 0.01 });
    marqueeObserver.observe(wrapper);
  } else {
    isMarqueeVisible = true;
    rafId = requestAnimationFrame(updateCenterHover);
  }
}

/**
 * ==========================================================================
 * SHIPYON CELESTIAL COMPASS & OPTICAL RETICLE CURSOR SYSTEM
 * Style: Luxury Maritime Navigational Instrument in Golden Yellow
 * Elements:
 * 1. Central Golden Core (shipyon-cursor-dot): 6.5px radiant gold photon dot,
 *    follows mouse instantaneously (0ms delay)
 * 2. Celestial Compass Reticle (shipyon-cursor-ring): 38px gold compass reticle
 *    with 4 cardinal tick marks (N, E, S, W) and viewfinder optical brackets,
 *    fluid spring delay (0.18 lerp) with velocity-based gyroscopic tilt
 * Contextual States:
 * - buttons: expands to 56px, magnetic 3-5px pull on button
 * - links: displays golden directional arrow (→)
 * - images: morphs into optical viewfinder brackets (⌜ ⌝ ⌞ ⌟)
 * - globe / map: switches to rotating radar dashed ring
 * - explore: displays golden pill badge with destination name
 * - journey / values: highlights charter pillars
 * - click: triggers golden solar shockwave ripple
 * - fast velocity: emits subtle stardust trail particles
 * ==========================================================================
 */
function initShipyonCursorGimmicks() {
  // Use natural native OS cursor everywhere to ensure 100% visibility, zero lag, and instant responsiveness
  window.setShipyonGlobeCursor = function () {};
  const existingRoot = document.getElementById('shipyon-cursor-root');
  if (existingRoot) existingRoot.remove();
  return;

  // Create the root multi-shape cursor container
  const root = document.createElement('div');
  root.className = 'shipyon-cursor-root';
  root.id = 'shipyon-cursor-root';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="shipyon-cursor-circle" id="shipyon-cursor-circle">
      <div class="cursor-circle-content" id="cursor-circle-content">
        <span class="cursor-circle-label" id="cursor-circle-label"></span>
        <span class="cursor-circle-icon" id="cursor-circle-icon"></span>
      </div>
    </div>
    <div class="shipyon-cursor-arrow" id="shipyon-cursor-arrow">
      <svg class="classic-arrow-svg" viewBox="0 0 24 24" width="22" height="22">
        <path class="classic-arrow-path" 
              d="M 2.2 1.8 L 9.8 21.2 L 13.4 13.8 L 20.8 10.2 Z" 
              fill="#FFFFFF" 
              stroke="#0A1C10" 
              stroke-width="1.5" 
              stroke-linejoin="round" 
              stroke-linecap="round"/>
      </svg>
      <span class="cursor-explore-badge" id="cursor-explore-badge" aria-hidden="true">EXPLORE</span>
    </div>
  `;

  document.body.appendChild(root);

  const circle = root.querySelector('#shipyon-cursor-circle');
  const arrow = root.querySelector('#shipyon-cursor-arrow');
  const circleLabel = root.querySelector('#cursor-circle-label');
  const circleIcon = root.querySelector('#cursor-circle-icon');
  const exploreBadge = root.querySelector('#cursor-explore-badge');

  // Vector Shape Icons for Circle
  const ICONS = {
    arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
    arrowLeft: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
    arrowUpRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>`,
    orbit: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5BA31" stroke-width="2.2" stroke-linecap="round"><path d="M21 12A9 9 0 1 1 18.36 5.64L21 3M21 3L21 8L16 8"/></svg>`
  };

  let mouseX = -100;
  let mouseY = -100;
  let prevMouseX = -100;
  let prevMouseY = -100;
  let circleX = -100;
  let circleY = -100;
  let isVisible = false;
  let lastTrailTime = 0;
  let activeTrailCount = 0;
  const MAX_TRAIL_COUNT = 3;

  // Stardust Particle Generator (trailing particles when moving fast)
  function spawnMotionParticle(x, y) {
    if (activeTrailCount >= MAX_TRAIL_COUNT) return;
    activeTrailCount++;

    const p = document.createElement('div');
    p.className = 'shipyon-motion-trail-particle';
    const offsetX = (Math.random() - 0.5) * 6;
    const offsetY = (Math.random() - 0.5) * 6;
    p.style.transform = `translate3d(${(x + offsetX).toFixed(1)}px, ${(y + offsetY).toFixed(1)}px, 0)`;
    document.body.appendChild(p);

    setTimeout(() => {
      p.remove();
      activeTrailCount = Math.max(0, activeTrailCount - 1);
    }, 280);
  }

  // Click Shockwave Ripple (Concentric Circles)
  function triggerClickShockwave(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'shipyon-click-ripple';
    ripple.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 380);
  }

  // Smooth Spring Lerp Loop for Trailing Circle (Sleeps when idle to save 100% CPU)
  let circleSettled = true;
  let isCursorRafRunning = false;

  function wakeCursorLoop() {
    if (!isCursorRafRunning) {
      isCursorRafRunning = true;
      requestAnimationFrame(renderCircleLoop);
    }
  }

  function renderCircleLoop() {
    if (!isVisible) {
      isCursorRafRunning = false;
      return;
    }

    const dx = mouseX - circleX;
    const dy = mouseY - circleY;

    if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
      circleX += dx * 0.22;
      circleY += dy * 0.22;
      circle.style.transform = `translate3d(${circleX.toFixed(1)}px, ${circleY.toFixed(1)}px, 0) translate(-50%, -50%)`;
      circleSettled = false;
      requestAnimationFrame(renderCircleLoop);
    } else {
      if (!circleSettled) {
        circleX = mouseX;
        circleY = mouseY;
        circle.style.transform = `translate3d(${circleX.toFixed(1)}px, ${circleY.toFixed(1)}px, 0) translate(-50%, -50%)`;
        circleSettled = true;
      }
      isCursorRafRunning = false;
    }
  }

  // Mouse Movement - Direct 0ms Tracking for Lead Arrow + Target for Follower Circle
  window.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      arrow.classList.add('visible');
      circle.classList.add('visible');
      circleX = mouseX;
      circleY = mouseY;
    }

    // Direct 0ms Arrow tip alignment at (2.2, 1.8)
    arrow.style.transform = `translate3d(${(mouseX - 2.2).toFixed(1)}px, ${(mouseY - 1.8).toFixed(1)}px, 0)`;

    // Wake circle loop when mouse moves
    wakeCursorLoop();

    // Velocity trail particles (only on fast deliberate gestures)
    if (prevMouseX > 0 && prevMouseY > 0) {
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const speed = Math.hypot(vx, vy);
      const now = performance.now();
      if (speed > 16.0 && now - lastTrailTime > 60) {
        lastTrailTime = now;
        spawnMotionParticle(mouseX, mouseY);
      }
    }
  }, { passive: true });

  // Mouse Down / Up Tactile Feedback
  window.addEventListener('mousedown', (e) => {
    root.classList.add('cursor-pressed');
    triggerClickShockwave(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    root.classList.remove('cursor-pressed');
  });

  // Window Boundary Detection
  document.addEventListener('mouseleave', () => {
    arrow.classList.remove('visible');
    circle.classList.remove('visible');
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (mouseX > 0 && mouseY > 0) {
      arrow.classList.add('visible');
      circle.classList.add('visible');
      isVisible = true;
    }
  });

  // Helper to clear contextual states
  function clearStates() {
    root.classList.remove(
      'cursor-state-button',
      'cursor-state-link',
      'cursor-state-product',
      'cursor-state-carousel-prev',
      'cursor-state-carousel-next',
      'cursor-state-globe',
      'cursor-state-input',
      'cursor-state-explore'
    );
  }

  // Contextual Hover Detection (Circles & Arrows)
  document.addEventListener('mouseover', (e) => {
    // 1. Destination / Country Tag Check
    const countryEl = e.target.closest('[data-cursor="DESTINATION"], .country-ribbon-btn, .gtn-floating-dest, .country-card, [data-dest]');
    if (countryEl) {
      clearStates();
      const destName = countryEl.getAttribute('data-dest-name') || countryEl.getAttribute('data-dest') || countryEl.textContent.trim();
      root.classList.add('cursor-state-explore');
      if (exploreBadge) {
        exploreBadge.textContent = (destName || 'EXPLORE').toUpperCase();
      }
      return;
    }

    // 2. 3D Globe / Spatial Map Check
    const globeEl = e.target.closest('#globe-canvas, .globe-container, .comm-core-radar-stage, [data-cursor="globe"]');
    if (globeEl) {
      clearStates();
      root.classList.add('cursor-state-globe');
      if (circleLabel) circleLabel.textContent = 'DRAG';
      if (circleIcon) circleIcon.innerHTML = ICONS.orbit;
      return;
    }

    // 3. Products / Commodities / Cards Check
    const productEl = e.target.closest('.ecom-product-card, .catalog-item-card, .category-hero-card, .curious-folio-panel, .charter-pillar-card, [data-cursor="product"]');
    if (productEl) {
      clearStates();
      root.classList.add('cursor-state-product');
      if (circleLabel) circleLabel.textContent = 'VIEW';
      if (circleIcon) circleIcon.innerHTML = ICONS.arrowRight;
      return;
    }

    // 4. Primary Button CTAs
    const btnEl = e.target.closest('button, .btn, [role="button"], input[type="submit"], .btn-rfq-begin, .btn-quote-submit-wa, .btn-pill-cobalt, .btn-terminal-wa');
    if (btnEl) {
      clearStates();
      root.classList.add('cursor-state-button');
      return;
    }

    // 5. Form & Search Inputs
    const inputEl = e.target.closest('input, textarea, select');
    if (inputEl) {
      clearStates();
      root.classList.add('cursor-state-input');
      return;
    }

    // 6. Hyperlinks / Navigation Items
    const linkEl = e.target.closest('a, .nav-link, .link');
    if (linkEl) {
      clearStates();
      root.classList.add('cursor-state-link');
      return;
    }

    // Normal State
    clearStates();
  });

  // Carousel Directional Arrows on Mouse Move over Carousels
  document.addEventListener('mousemove', (e) => {
    if (e.target.closest('.ecom-product-card, .catalog-item-card, .category-hero-card, button, a, input, [role="button"]')) {
      return;
    }

    const carouselEl = e.target.closest('.ecom-product-carousel, .carousel-track, .splide__track, .ecom-products-carousel-wrap');
    if (carouselEl) {
      const rect = carouselEl.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      if (relX < rect.width * 0.45) {
        clearStates();
        root.classList.add('cursor-state-carousel-prev');
        if (circleLabel) circleLabel.textContent = '';
        if (circleIcon) circleIcon.innerHTML = ICONS.arrowLeft;
      } else if (relX > rect.width * 0.55) {
        clearStates();
        root.classList.add('cursor-state-carousel-next');
        if (circleLabel) circleLabel.textContent = '';
        if (circleIcon) circleIcon.innerHTML = ICONS.arrowRight;
      }
    }
  }, { passive: true });

  // Global helper for Three.js globe raycaster
  window.setShipyonGlobeCursor = function (state, meta) {
    if (state === 'explore' || state === 'button') {
      clearStates();
      root.classList.add('cursor-state-explore');
      if (meta && meta.destName && exploreBadge) {
        exploreBadge.textContent = meta.destName.toUpperCase();
      }
    } else {
      clearStates();
    }
  };
}


/**
 * ==========================================================================
 * GLOBAL TRADE NETWORK: MODERN IMMERSIVE SECTION INTERACTIONS
 * - Cinematic Staggered Entrance Reveal with IntersectionObserver
 * - Multi-layer Mouse Parallax (Grid, Map, Light Blobs, Headline)
 * - 3D Glass Data Card Tilt Physics
 * - Word-level Headline Shimmer Physics
 * - Magnetic CTA Button & Micro-Particle Sparkle Emitter
 * ==========================================================================
 */
function initGlobalTradeNetworkInteractions() {
  const section = document.getElementById('global-trade-map');
  if (!section) return;

  // Immediately reveal section to guarantee no blank/hidden states
  section.classList.add('gtn-revealed');
  window.dispatchEvent(new CustomEvent('gtnSectionRevealed'));

  // 1. Cinematic Staggered Scroll Entrance Reveal
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add('gtn-revealed');
          window.dispatchEvent(new CustomEvent('gtnSectionRevealed'));
          if (window.ShipyonGlobeEngine && window.ShipyonGlobeEngine.onWindowResize) {
            window.ShipyonGlobeEngine.onWindowResize();
          }
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.02, rootMargin: '200px' });

    observer.observe(section);
  }

  // 2. Multi-Layer Parallax Physics on Mouse Movement
  const parallaxGrid = document.getElementById('gtn-parallax-grid');
  const parallaxMap = document.getElementById('gtn-parallax-map');
  const lightLeft = document.getElementById('gtn-light-left');
  const lightRight = document.getElementById('gtn-light-right');
  const lightCenter = document.getElementById('gtn-light-center');
  const headline = document.getElementById('gtn-interactive-headline');

  let targetNormX = 0;
  let targetNormY = 0;
  let currentNormX = 0;
  let currentNormY = 0;
  let isGtnVisible = false;
  let isGtnParallaxRunning = false;

  let sectionRect = null;
  function updateSectionRect() {
    sectionRect = section.getBoundingClientRect();
  }
  window.addEventListener('resize', updateSectionRect, { passive: true });
  updateSectionRect();

  function scheduleGtnParallax() {
    if (!isGtnParallaxRunning && isGtnVisible) {
      isGtnParallaxRunning = true;
      requestAnimationFrame(animateParallax);
    }
  }

  section.addEventListener('mousemove', (e) => {
    if (!sectionRect) updateSectionRect();
    const centerX = sectionRect.left + sectionRect.width / 2;
    const centerY = sectionRect.top + sectionRect.height / 2;

    targetNormX = (e.clientX - centerX) / (sectionRect.width / 2);
    targetNormY = (e.clientY - centerY) / (sectionRect.height / 2);

    scheduleGtnParallax();

    // Also communicate normalized position to 3D Globe for subtle tilt & shift
    if (window.ShipyonGlobe && typeof window.ShipyonGlobe.onSectionMouseMove === 'function') {
      window.ShipyonGlobe.onSectionMouseMove(targetNormX, targetNormY);
    }
  }, { passive: true });

  section.addEventListener('mouseleave', () => {
    targetNormX = 0;
    targetNormY = 0;
    scheduleGtnParallax();
    if (window.ShipyonGlobe && typeof window.ShipyonGlobe.onSectionMouseMove === 'function') {
      window.ShipyonGlobe.onSectionMouseMove(0, 0);
    }
  });

  // Smooth lerp animation loop for parallax layers (sleeps when idle or offscreen)
  function animateParallax() {
    if (!isGtnVisible) {
      isGtnParallaxRunning = false;
      return;
    }

    const diffX = targetNormX - currentNormX;
    const diffY = targetNormY - currentNormY;
    let shouldContinue = false;

    if (Math.abs(diffX) > 0.0008 || Math.abs(diffY) > 0.0008) {
      currentNormX += diffX * 0.08;
      currentNormY += diffY * 0.08;
      shouldContinue = true;
    } else {
      currentNormX = targetNormX;
      currentNormY = targetNormY;
    }

    if (parallaxGrid) {
      parallaxGrid.style.transform = `translate3d(${(-currentNormX * 16).toFixed(1)}px, ${(-currentNormY * 16).toFixed(1)}px, 0)`;
    }
    if (parallaxMap) {
      parallaxMap.style.transform = `translate(calc(-50% + ${(currentNormX * 22).toFixed(1)}px), calc(-50% + ${(currentNormY * 18).toFixed(1)}px))`;
    }
    if (lightLeft) {
      lightLeft.style.transform = `translate3d(${(-currentNormX * 30).toFixed(1)}px, ${(-currentNormY * 24).toFixed(1)}px, 0)`;
    }
    if (lightRight) {
      lightRight.style.transform = `translate3d(${(currentNormX * 30).toFixed(1)}px, ${(currentNormY * 24).toFixed(1)}px, 0)`;
    }
    if (lightCenter) {
      lightCenter.style.transform = `translate3d(${(currentNormX * 14).toFixed(1)}px, ${(currentNormY * 12).toFixed(1)}px, 0)`;
    }
    if (headline) {
      headline.style.transform = `translate3d(${(currentNormX * 6).toFixed(1)}px, ${(currentNormY * 4).toFixed(1)}px, 0)`;
    }

    if (shouldContinue) {
      requestAnimationFrame(animateParallax);
    } else {
      isGtnParallaxRunning = false;
    }
  }

  if ('IntersectionObserver' in window) {
    const gtnObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isGtnVisible = entry.isIntersecting;
        if (isGtnVisible) {
          updateSectionRect();
          scheduleGtnParallax();
        }
      });
    }, { rootMargin: '100px 0px 100px 0px', threshold: 0.01 });
    gtnObserver.observe(section);
  } else {
    isGtnVisible = true;
    scheduleGtnParallax();
  }

  // 3. 3D Glass Data Cards Tilt Effect
  const tiltCards = section.querySelectorAll('.gtn-data-card[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = (e.clientX - rect.left) / rect.width - 0.5;
      const cardY = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -cardY * 14;
      const rotY = cardX * 16;
      card.style.transform = `perspective(700px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg) translateY(-5px) scale3d(1.025, 1.025, 1.025)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 4. Word-level Headline Shimmer Physics
  const headlineWords = section.querySelectorAll('.gtn-headline-word');
  headlineWords.forEach((word) => {
    word.addEventListener('mouseenter', () => {
      word.style.transform = 'translateY(-4px) scale(1.04)';
      word.style.filter = 'drop-shadow(0 6px 16px rgba(16, 185, 129, 0.4))';
    });
    word.addEventListener('mouseleave', () => {
      word.style.transform = '';
      word.style.filter = '';
    });
  });

  // 5. Magnetic CTA Button Micro-Sparkles on Hover
  const ctaBtn = document.getElementById('gtn-explore-corridors-btn');
  let ctaSparkleInterval = null;

  if (ctaBtn) {
    ctaBtn.addEventListener('mouseenter', () => {
      if (ctaSparkleInterval) clearInterval(ctaSparkleInterval);
      ctaSparkleInterval = setInterval(() => {
        const rect = ctaBtn.getBoundingClientRect();
        const spark = document.createElement('div');
        spark.className = 'shipyon-click-spark';
        const posX = rect.left + Math.random() * rect.width;
        const posY = rect.top + Math.random() * rect.height;
        const tx = (Math.random() - 0.5) * 24;
        const ty = (Math.random() - 0.5) * 24;
        spark.style.setProperty('--tx', `${tx.toFixed(1)}px`);
        spark.style.setProperty('--ty', `${ty.toFixed(1)}px`);
        spark.style.left = `${posX}px`;
        spark.style.top = `${posY}px`;
        spark.style.background = '#D4AF37';
        spark.style.boxShadow = '0 0 6px #D4AF37';
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 450);
      }, 140);
    });

    ctaBtn.addEventListener('mouseleave', () => {
      if (ctaSparkleInterval) {
        clearInterval(ctaSparkleInterval);
        ctaSparkleInterval = null;
      }
    });
  }
}

/**
 * ==========================================================================
 * UNIQUE & CREATIVE FEATURE:
 * THE SHIPYON MULTIMODAL COMMAND HORIZON
 * 1. Climate & Atmosphere Switcher (Day / Golden Hour Sunset / Maritime Night Radar)
 * 2. Autopilot Multimodal Highway Dispatch Simulation
 * 3. 40ft High-Cube Cargo X-Ray Scanner & IoT Telemetry Inspector
 * 4. Cryptographic Digital Bill of Lading (e-BL) Maritime Manifest
 * ==========================================================================
 */
function initHighwayAtmosphereAndAutopilot() {
  const stage = document.getElementById('zigzag-panorama-stage');
  if (stage) {
    stage.classList.remove('atmo-day', 'atmo-night');
    stage.classList.add('atmo-dusk');
  }
}

/**
 * ==========================================================================
 * PERSISTENT FLOATING WHATSAPP BUTTON (Always present at bottom-right corner)
 * ==========================================================================
 */
function initWhatsAppFloatingButton() {
  if (document.getElementById('shipyon-whatsapp-fab')) return;

  const aside = document.createElement('aside');
  aside.className = 'shipyon-whatsapp-floating';
  aside.id = 'shipyon-whatsapp-fab';
  aside.setAttribute('aria-label', 'WhatsApp Trade Assistance');

  aside.innerHTML = `
    <a href="https://wa.me/919500690740?text=Hello%20Shipyon%2C%20I%20would%20like%20to%20inquire%20about%20international%20trade%20and%20commodities." 
       class="wa-float-btn" 
       target="_blank" 
       rel="noopener noreferrer" 
       aria-label="Chat with Shipyon on WhatsApp (+91 95006 90740)"
       title="Chat with Shipyon on WhatsApp">
      <span class="wa-pulse-aura" aria-hidden="true"></span>
      <span class="wa-pulse-aura secondary" aria-hidden="true"></span>
      <span class="wa-tooltip-pill" aria-hidden="true">
        <span class="wa-tooltip-title">Chat with us</span>
        <span class="wa-tooltip-sub">24/7 Trade Desk</span>
      </span>
      <span class="wa-icon-sphere">
        <svg class="wa-svg-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.485.681 4.887 1.973 6.985L2.8 28.533a1.067 1.067 0 0 0 1.306 1.307l5.694-1.802A13.275 13.275 0 0 0 16 29.333c7.364 0 13.333-5.969 13.333-13.333S23.364 2.667 16 2.667zm7.534 18.066c-.314.883-1.558 1.62-2.158 1.722-.572.096-1.314.137-2.12-.12a14.77 14.77 0 0 1-5.46-3.486 15.65 15.65 0 0 1-3.626-5.36c-.4-.9-.044-1.385.204-1.8.225-.375.498-.44.743-.44.246 0 .493.003.71.013.23.01.537-.087.84.64.315.753 1.077 2.628 1.173 2.822.095.195.158.423.03.676-.126.253-.19.41-.378.63-.19.223-.4.498-.57.668-.19.19-.388.397-.167.776.222.38 1.025 1.69 2.215 2.748 1.533 1.363 2.828 1.786 3.23 1.986.402.2.639.167.876-.104.237-.272 1.016-1.186 1.288-1.593.272-.407.544-.339.914-.203.37.136 2.348 1.108 2.75 1.31.402.203.67.305.768.474.098.17.098.983-.216 1.867z" fill="white"/>
        </svg>
        <span class="wa-status-badge" aria-hidden="true"></span>
      </span>
    </a>
  `;

  document.body.appendChild(aside);
}

/**
 * ============================================================================
 * 34. UNIVERSAL VISIBILITY & PERFORMANCE ENGINE
 * Pauses off-screen CSS animations, keyframes, HTML5 videos, and heavy loops
 * Guarantees 60-120 FPS buttery smooth scrolling with minimal CPU/GPU usage
 * ============================================================================
 */
function initUniversalVisibilityManager() {
  if (!('IntersectionObserver' in window)) return;

  const targetSections = document.querySelectorAll(
    'section, header, footer, .services-hero-wrapper, .supply-pipeline-section, ' +
    '.featured-service-section, .services-catalog-section, .quayside-showcase-section, ' +
    '.hero-serene-stage, .about-editorial-section, .curious-folio-section, ' +
    '.global-trade-network-section, .delivery-process-section, .charter-values-section, ' +
    '.shipyon-vision-section, .volza-about-split-section, .ecom-hero-header, ' +
    '.ecom-categories-section, .comm-hero-header, .site-footer'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      if (entry.isIntersecting) {
        section.classList.remove('is-offscreen');
        section.classList.add('is-in-viewport');

        // Resume HTML5 videos inside section
        const videos = section.querySelectorAll('video');
        videos.forEach(v => {
          if (v.paused && v.dataset.manualPaused !== 'true') {
            v.play().catch(() => {});
          }
        });
      } else {
        section.classList.add('is-offscreen');
        section.classList.remove('is-in-viewport');

        // Pause HTML5 videos to free GPU hardware decoder
        const videos = section.querySelectorAll('video');
        videos.forEach(v => {
          if (!v.paused) {
            v.pause();
          }
        });
      }
    });
  }, {
    rootMargin: '120px 0px 120px 0px',
    threshold: 0
  });

  targetSections.forEach(sec => observer.observe(sec));
}

/**
 * 1. Professional Spotlight Glow & 3D Tilt for Non-Home/Expertise/Product Cards
 */
function initProSpotlightAndTilt() {
  const cards = document.querySelectorAll(`
    .volza-stat-card,
    .institutional-card,
    .expertise-card.export-service-card,
    .why-pillar-card,
    .contact-desk-normal-card,
    .contact-form-card,
    .leader-exec-card,
    .volza-pillar-card,
    .workspace-showcase-frame,
    .metric-stack-item
  `);

  cards.forEach(card => {
    if (!card.classList.contains('pro-card-shimmer-border')) {
      card.classList.add('pro-card-shimmer-border');
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -5;
      const tiltY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}

/**
 * 2. Professional Staggered Scroll Reveal System (Safe - elements immediately visible)
 */
function initProScrollReveals() {
  const targetSelectors = `
    #about-section .about-col-story,
    #about-section .about-col-visual,
    #about-section .metric-stack-item,
    #about-overview .volza-about-content,
    #about-overview .volza-stat-card,
    #leadership-section .leader-exec-card,
    #values-section .volza-pillar-card,
    #why-choose-us-section .why-pillar-card,
    #why-choose-us-section .why-metric-col,
    #global-trade-map .section-header-editorial,
    #core-export-services .expertise-card,
    #institutional-solutions .institutional-card,
    .contact-left-column,
    .contact-form-card
  `;

  const elements = document.querySelectorAll(targetSelectors);
  if (!elements.length) return;

  elements.forEach((el) => {
    el.classList.add('is-revealed');
  });
}

/**
 * 3. Smooth Animated Metric Counters for Statistics Cards
 */
function initProMetricCounters() {
  if (!('IntersectionObserver' in window)) return;

  const statEls = document.querySelectorAll('.volza-stat-number, .metric-number, .why-metric-number');
  if (!statEls.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSingleCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statEls.forEach(el => observer.observe(el));

  function animateSingleCounter(el) {
    const rawText = el.innerText.trim();
    const matches = rawText.match(/([\d\.,]+)/);
    if (!matches) return;

    const numStr = matches[0].replace(/,/g, '');
    const targetVal = parseFloat(numStr);
    if (isNaN(targetVal)) return;

    const prefix = rawText.substring(0, rawText.indexOf(matches[0]));
    const suffix = rawText.substring(rawText.indexOf(matches[0]) + matches[0].length);
    const hasDecimals = numStr.includes('.');
    const decimalPlaces = hasDecimals ? numStr.split('.')[1].length : 0;

    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetVal * easeProgress;

      let formattedNum = hasDecimals 
        ? currentVal.toFixed(decimalPlaces)
        : Math.floor(currentVal).toLocaleString();

      el.innerText = `${prefix}${formattedNum}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = rawText;
      }
    }

    requestAnimationFrame(update);
  }
}



