/**
 * SHIPYON V2 - INTERACTIONS & FUNCTIONALITY
 * Clean, soft, responsive interactions for architectural trade site
 */

function initShipyonApp() {
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
  initProcessRoadMilestones();
  initMobileMovesSwipe();
  initValuesInteractiveCards();
  initProSpotlightAndTilt();
  initProScrollReveals();
  initProMetricCounters();
  initCardSpotlightAnd3DTilt();
  initPremiumWebsiteMotion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShipyonApp);
} else {
  initShipyonApp();
}

// 1. Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navLinks = document.getElementById('nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      toggleBtn.classList.toggle('is-open', isOpen);
    });

    // Close when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.classList.remove('is-open');
      });
    });
  }
}

// 3. Quote Request Modal
function initQuoteModal() {
  const overlay = document.getElementById('quote-modal-overlay');
  const openButtons = document.querySelectorAll('.open-quote-modal-btn');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
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
  const name = document.getElementById('quote-name').value;
  const category = document.getElementById('quote-category').value;
  alert(`Thank you, ${name}! Your trade quotation request for ${category} has been received. Our export desk will connect within 4 business hours.`);
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

// 8. Curious Agro-Terroir Folio Interactions
function initCuriousFolio() {
  const deck = document.getElementById('curious-folio-deck');
  if (!deck) return;

  const panels = deck.querySelectorAll('.curious-folio-panel');
  if (!panels.length) return;

  function setActivePanel(activePanel) {
    panels.forEach(panel => {
      const isTarget = panel === activePanel;
      panel.classList.toggle('active', isTarget);
      panel.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
      if (!isTarget && document.activeElement === panel) {
        panel.blur();
      }
    });
  }

  panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      setActivePanel(panel);
    });

    panel.addEventListener('click', (e) => {
      if (e.target.closest('.folio-btn-action')) return;
      setActivePanel(panel);
    });

    panel.addEventListener('focusin', () => {
      setActivePanel(panel);
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('.folio-btn-action')) {
          e.preventDefault();
          setActivePanel(panel);
        }
      }
    });
  });
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
    window.scrollTo(0, startScrollTop + scrollDelta);
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

// 11. Eased Number Counter Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-value, .why-metric-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const originalText = el.textContent;
        const isPlus = originalText.includes('+');
        const isPercent = originalText.includes('%');
        const isSupport = originalText.includes('/7');

        if (isSupport) {
          el.textContent = '24/7';
          observer.unobserve(el);
          return;
        }

        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = (start + (target - start) * easeProgress).toFixed(decimals);

          el.textContent = currentVal + (isPercent ? '%' : (isPlus ? '+' : ''));

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = target.toFixed(decimals) + (isPercent ? '%' : (isPlus ? '+' : ''));
          }
        }

        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(c => observer.observe(c));
}

// 12. Fluid Universal Scroll Reveal Animations
function initScrollReveals() {
  const revealEls = document.querySelectorAll('.reveal-on-scroll, .section-header-editorial, .snapshot-item, .curious-folio-panel, .global-map-section');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
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

  // Compute scroll progress relative to track
  function onScroll() {
    const rect = track.getBoundingClientRect();
    const maxScroll = track.offsetHeight - window.innerHeight;
    
    if (maxScroll > 0) {
      const scrolled = -rect.top;
      targetProgress = Math.max(0, Math.min(1, scrolled / maxScroll));
    } else {
      // Responsive fallback when track is not taller than window
      const vpHeight = window.innerHeight || 800;
      const totalSpan = rect.height + vpHeight;
      const scrolled = vpHeight - rect.top;
      targetProgress = Math.max(0, Math.min(1, scrolled / totalSpan));
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  // Smooth 60fps animation loop
  function animLoop() {
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0004) {
      currentProgress += diff * 0.14;
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
    // Precise physical node arrival thresholds: Node 2 @ 0.31, Node 3 @ 0.64, Node 4 @ 0.95
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

    requestAnimationFrame(animLoop);
  }

  // Interactive Tab Clicks
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
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

// 15. Continuous Kinetic Values Interactive System & One-by-One Smooth Sequence Flow
function initValuesInteractiveCards() {
  const showcaseWrapper = document.getElementById("values-showcase-wrapper");
  const cards = document.querySelectorAll(".value-luxury-card");
  if (!cards.length) return;

  // --- A. Dynamic SVG Interconnecting Artery Coordinates ---
  const arterySvg = document.getElementById("values-artery-svg");
  const path12 = document.getElementById("artery-path-1-2");
  const path23 = document.getElementById("artery-path-2-3");
  const path34 = document.getElementById("artery-path-3-4");
  const flow12 = document.getElementById("artery-flow-1-2");
  const flow23 = document.getElementById("artery-flow-2-3");
  const flow34 = document.getElementById("artery-flow-3-4");
  const flowBeams = [flow12, flow23, flow34];

  function updateArteryCoordinates() {
    if (!arterySvg || !path12 || !path23 || !path34 || window.innerWidth < 992 || !showWrapperIsVisible()) return;
    const wrapperRect = showcaseWrapper.getBoundingClientRect();
    if (wrapperRect.width <= 0) return;

    const centers = [];
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cx = (r.left + r.width / 2) - wrapperRect.left;
      const cy = (r.top + r.height / 2) - wrapperRect.top;
      centers.push({ x: cx, y: cy });
    });

    if (centers.length === 4) {
      arterySvg.setAttribute("viewBox", `0 0 ${wrapperRect.width} ${wrapperRect.height}`);
      arterySvg.style.height = `${wrapperRect.height}px`;
      arterySvg.style.top = "0";
      arterySvg.style.transform = "none";

      function makeSpline(p1, p2) {
        const dx = (p2.x - p1.x) * 0.5;
        const dip = (p1.y + p2.y) / 2 + 35;
        return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${(p1.x + dx).toFixed(1)} ${dip.toFixed(1)}, ${(p2.x - dx).toFixed(1)} ${dip.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }

      const d12 = makeSpline(centers[0], centers[1]);
      const d23 = makeSpline(centers[1], centers[2]);
      const d34 = makeSpline(centers[2], centers[3]);

      path12.setAttribute("d", d12);
      path23.setAttribute("d", d23);
      path34.setAttribute("d", d34);

      if (flow12) flow12.setAttribute("d", d12);
      if (flow23) flow23.setAttribute("d", d23);
      if (flow34) flow34.setAttribute("d", d34);
    }
  }

  function showWrapperIsVisible() {
    return showcaseWrapper.offsetParent !== null;
  }

  setTimeout(updateArteryCoordinates, 300);
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateArteryCoordinates, 150);
  });

  // --- B. 60fps Mathematical Harmonic Sine Wave Visualizer ---
  const canvases = document.querySelectorAll(".harmonic-wave-canvas");
  const waveStates = [];

  canvases.forEach((canvas, idx) => {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth || 220;
    const h = 34;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const baseFreqs = [0.038, 0.046, 0.032, 0.052];
    const speeds = [0.042, 0.035, 0.048, 0.039];

    waveStates.push({
      canvas,
      ctx,
      dpr,
      w,
      h,
      t: idx * 2.5,
      baseFreq: baseFreqs[idx] || 0.04,
      speed: speeds[idx] || 0.04,
      targetAmp: 4.5,
      currentAmp: 4.5,
      card: cards[idx]
    });
  });

  let waveAnimFrameId = null;

  function renderHarmonicWaves() {
    waveStates.forEach((state) => {
      const { ctx, canvas, dpr, w, h, baseFreq, speed, card } = state;
      if (!ctx || !canvas) return;

      const isResonant = card.classList.contains("active-resonance") || card.classList.contains("is-hovered");
      state.targetAmp = isResonant ? 9.5 : 4.5;
      state.currentAmp += (state.targetAmp - state.currentAmp) * 0.12;
      state.t += speed * (isResonant ? 1.6 : 1.0);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const midY = h / 2;
      const amp = state.currentAmp;

      // 1. Translucent underfill gradient
      ctx.beginPath();
      ctx.moveTo(0, midY);
      for (let x = 0; x <= w; x += 2) {
        const y = midY + 
          Math.sin(x * baseFreq - state.t) * amp * 0.75 + 
          Math.cos(x * baseFreq * 0.45 - state.t * 0.6) * (amp * 0.35);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
      fillGrad.addColorStop(0, isResonant ? "rgba(101, 208, 244, 0.28)" : "rgba(35, 115, 244, 0.12)");
      fillGrad.addColorStop(1, "rgba(11, 25, 44, 0.0)");
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // 2. High-energy stroke gradient
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = midY + 
          Math.sin(x * baseFreq - state.t) * amp * 0.75 + 
          Math.cos(x * baseFreq * 0.45 - state.t * 0.6) * (amp * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const strokeGrad = ctx.createLinearGradient(0, 0, w, 0);
      strokeGrad.addColorStop(0, "#2373F4");
      strokeGrad.addColorStop(0.5, "#65D0F4");
      strokeGrad.addColorStop(0.85, isResonant ? "#F2F7A0" : "#65D0F4");
      strokeGrad.addColorStop(1, "#578EF5");

      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = isResonant ? 2.4 : 1.6;
      ctx.shadowColor = isResonant ? "#65D0F4" : "rgba(35, 115, 244, 0.6)";
      ctx.shadowBlur = isResonant ? 8 : 4;
      ctx.stroke();

      // 3. Traveling photon node on the wave
      const photonX = ((state.t * 24) % (w + 20)) - 10;
      if (photonX >= 0 && photonX <= w) {
        const photonY = midY + 
          Math.sin(photonX * baseFreq - state.t) * amp * 0.75 + 
          Math.cos(photonX * baseFreq * 0.45 - state.t * 0.6) * (amp * 0.35);

        ctx.beginPath();
        ctx.arc(photonX, photonY, isResonant ? 3 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isResonant ? "#F2F7A0" : "#FFFFFF";
        ctx.shadowColor = "#F2F7A0";
        ctx.shadowBlur = 10;
        ctx.fill();
      }

      ctx.restore();
    });

    waveAnimFrameId = requestAnimationFrame(renderHarmonicWaves);
  }

  // --- C. Continuous Auto-Advancing Values Progression (Under 3 Sec: 2.8s Cycle) ---
  const CYCLE_INTERVAL_MS = 2800; // Continuous transition under 3 seconds
  let activeIndex = 0;
  let cycleTimer = null;
  let isUserHovering = false;
  let idleResumeTimer = null;

  function setActiveCard(idx, restartTimer = false) {
    activeIndex = (idx + cards.length) % cards.length;

    cards.forEach((card, i) => {
      const isActive = (i === activeIndex);
      card.classList.toggle("active-resonance", isActive);

      // Re-trigger 2.8s countdown progress animation on the active card
      const fill = card.querySelector(".value-indicator-fill");
      if (fill) {
        fill.style.animation = "none";
        fill.offsetHeight; // force reflow
        if (isActive && !isUserHovering) {
          fill.style.animation = `valueFillTimer ${CYCLE_INTERVAL_MS}ms linear forwards`;
        } else if (isActive && isUserHovering) {
          fill.style.width = "100%";
        } else {
          fill.style.width = "0%";
        }
      }
    });

    // Light up connecting energy artery beam linking current card to next
    if (flowBeams && flowBeams.length) {
      flowBeams.forEach((beam, bIdx) => {
        if (beam) {
          // Beam 0 links 0->1, Beam 1 links 1->2, Beam 2 links 2->3
          const isBeamActive = (bIdx === activeIndex && activeIndex < cards.length - 1);
          beam.classList.toggle("active-beam", isBeamActive);
        }
      });
    }

    if (restartTimer) {
      startCycleTimer();
    }
  }

  function advanceToNextCard() {
    if (!isUserHovering) {
      const nextIdx = (activeIndex + 1) % cards.length;
      setActiveCard(nextIdx);
    }
  }

  function startCycleTimer() {
    stopCycleTimer();
    cycleTimer = setInterval(advanceToNextCard, CYCLE_INTERVAL_MS);
  }

  function stopCycleTimer() {
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  }

  // Ensure all cards are revealed and start continuous under-3s auto-advance
  cards.forEach(card => card.classList.add("val-card-revealed"));
  setActiveCard(0);
  startCycleTimer();

  // --- D. Intersection Observer for Smooth Pause/Resume ---
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!waveAnimFrameId) renderHarmonicWaves();
          updateArteryCoordinates();
          startCycleTimer();
        } else {
          stopCycleTimer();
          if (waveAnimFrameId) {
            cancelAnimationFrame(waveAnimFrameId);
            waveAnimFrameId = null;
          }
        }
      });
    }, { threshold: 0.15 });

    const valuesSection = document.getElementById("values-section");
    if (valuesSection) observer.observe(valuesSection);
  }

  // --- E. Interactive Hover & Click Handling ---
  cards.forEach((card, idx) => {
    // Clicking any card immediately highlights it and restarts the 2.8s continuous cycle
    card.addEventListener("click", () => {
      isUserHovering = false;
      setActiveCard(idx, true);
    });

    card.addEventListener("mouseenter", () => {
      isUserHovering = true;
      card.classList.add("is-hovered");
      setActiveCard(idx);
      stopCycleTimer();

      // Auto-resume fallback if mouse is left idle over card for > 5s
      clearTimeout(idleResumeTimer);
      idleResumeTimer = setTimeout(() => {
        isUserHovering = false;
        startCycleTimer();
      }, 5000);
    });

    card.addEventListener("mouseleave", () => {
      clearTimeout(idleResumeTimer);
      isUserHovering = false;
      card.classList.remove("is-hovered");
      card.style.transform = "";
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
      // Smoothly advance from current card after a fresh 2.8s cycle
      setActiveCard(idx, true);
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -6;
      const tiltY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
    });
  });
}

/**
 * Global smooth scroll & service highlight handler for Testimonials in Services Page
 */
function navigateToService(targetServiceId) {
  const targetElement = document.getElementById(targetServiceId) || document.getElementById('core-export-services');
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    targetElement.classList.add('service-highlight-pulse');
    setTimeout(() => {
      targetElement.classList.remove('service-highlight-pulse');
    }, 3500);
  }
}

window.navigateToService = navigateToService;

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
    // Add shimmer border class for extra prestige
    if (!card.classList.contains('pro-card-shimmer-border')) {
      card.classList.add('pro-card-shimmer-border');
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D Tilt calculation
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
 * 2. Professional Staggered Scroll Reveal System
 */
function initProScrollReveals() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;
  if (!('IntersectionObserver' in window)) return;

  // Target sections outside Home, Expertise, and Product
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
    .contact-left-column,
    .contact-form-card
  `;

  const elements = document.querySelectorAll(targetSelectors);
  if (!elements.length) return;

  elements.forEach((el, index) => {
    if (!el.classList.contains('pro-reveal')) {
      el.classList.add('pro-reveal');
      // Alternate slide direction for visual dynamics
      if (index % 3 === 0) el.classList.add('pro-reveal-slide-left');
      else if (index % 3 === 1) el.classList.add('pro-reveal-slide-right');
      else el.classList.add('pro-reveal-scale');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
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
  }, { threshold: 0.3 });

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

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetVal * easeProgress;

      let formattedNum = hasDecimals 
        ? currentVal.toFixed(decimalPlaces)
        : Math.floor(currentVal).toLocaleString();

      el.innerText = `${prefix}${formattedNum}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = rawText; // restore exact original formatting
      }
    }

    requestAnimationFrame(update);
  }
}



/**
 * Card Mouse Spotlight & 3D Interactive Tilt Effect for Theme Cards
 */
function initCardSpotlightAnd3DTilt() {
  const cards = document.querySelectorAll(
    '.leader-exec-card, .volza-stat-card, .volza-pillar-card, .expertise-card, .testimonial-card-exim, .volza-hero-image-wrap'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Calculate 3D tilt angles
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * MASTER CINEMATIC SCROLL-DRIVEN MOTION SYSTEM
 * Continuous Canvas, Layered Section Takeover, Differential Parallax Compression,
 * Card Flight, Editorial Cascade Clip Reveals, and Dual Directional Founder Reveals.
 */
function initPremiumWebsiteMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    initGSAPScrollMotion();
  } else {
    initFallbackScrollMotion();
  }
}

function initGSAPScrollMotion() {
  // Enforce 100% solid opacity across elements (No opacity fading, no blur filter)
  gsap.set('.hero-eyebrow-serene, .volza-pill-tag, .subpage-badge-pill, .hero-serif-title, .volza-hero-title, .subpage-title, .hero-serene-desc, .volza-hero-desc, .subpage-subtitle, .hero-serene-actions, .volza-hero-actions, .hero-prov-item, .volza-trust-item, .hero-scenic-backdrop, .volza-hero-image-wrap, .feature-col-item, .volza-pillar-card, .expertise-card, .export-service-card, .curious-folio-panel, .institutional-card, .leader-exec-card', { opacity: 1, filter: 'none' });

  // 1. HERO SECTION: "Solid Physical Depth & Parallax Compression"
  const heroSection = document.querySelector('#hero-section, .volza-hero-section, .subpage-hero-section');
  if (heroSection) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.0 } });

    heroTl.fromTo('.hero-eyebrow-serene, .volza-pill-tag, .subpage-badge-pill', 
      { y: 30 }, 
      { y: 0, duration: 0.7 }
    )
    .fromTo('.hero-serif-title, .volza-hero-title, .subpage-title', 
      { y: 45 }, 
      { y: 0, duration: 0.9 }, 
      '-=0.4'
    )
    .fromTo('.hero-serene-desc, .volza-hero-desc, .subpage-subtitle', 
      { y: 25 }, 
      { y: 0, duration: 0.8 }, 
      '-=0.6'
    )
    .fromTo('.hero-serene-actions, .volza-hero-actions', 
      { y: 20, scale: 0.96 }, 
      { y: 0, scale: 1, duration: 0.75 }, 
      '-=0.5'
    )
    .fromTo('.hero-provenance-metrics .hero-prov-item, .volza-trust-badges .volza-trust-item', 
      { y: 18 }, 
      { y: 0, stagger: 0.08, duration: 0.6 }, 
      '-=0.4'
    )
    .fromTo('.hero-scenic-backdrop, .volza-hero-image-wrap', 
      { scale: 0.94 }, 
      { scale: 1, duration: 1.1, ease: 'power2.out' }, 
      '-=1.0'
    );

    // Scroll Exit: Controlled, Stable Parallax (No fading, no blur)
    const heroText = heroSection.querySelector('.hero-serene-content, .volza-hero-content, .subpage-hero-content');
    const heroImg = heroSection.querySelector('.hero-scenic-img, .volza-hero-image-wrap img');
    const nextSection = heroSection.nextElementSibling;

    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    if (heroText) {
      exitTl.to(heroText, { y: -120, scale: 0.96, ease: 'none' }, 0);
    }
    if (heroImg) {
      exitTl.to(heroImg, { scale: 1.08, y: 70, ease: 'none' }, 0);
    }
    if (nextSection) {
      exitTl.fromTo(nextSection, { y: 50 }, { y: 0, ease: 'none' }, 0);
    }
  }

  // 2. FOUR PILLARS: "Physical Card Flight & Layered Takeover" (Solid Opacity: 1)
  const pillarCards = gsap.utils.toArray('.floating-features-card .feature-col-item, .volza-pillars-section .volza-pillar-card, #snapshots-section .feature-col-item');
  if (pillarCards.length) {
    const pillarsContainer = pillarCards[0].closest('.floating-features-card, .volza-pillars-section, #snapshots-section');

    gsap.fromTo(pillarCards, 
      { y: 50, scale: 0.95 },
      {
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pillarsContainer,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Controlled Card Flight exit scrubbed on scroll (cards lift away at solid opacity)
    const flightTl = gsap.timeline({
      scrollTrigger: {
        trigger: pillarsContainer,
        start: 'top 35%',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    pillarCards.forEach((card, idx) => {
      const flightSpeed = -35 - (idx % 4) * 20;
      flightTl.to(card, {
        y: flightSpeed,
        scale: 0.94 - (idx * 0.012),
        ease: 'none'
      }, 0);
    });
  }

  // 3. SERVICE CARDS: "Staggered Card Field & Stable Depth Shift"
  const serviceCards = gsap.utils.toArray('#core-export-services .expertise-card, .export-service-card, .curious-folio-panel');
  if (serviceCards.length) {
    const serviceContainer = serviceCards[0].closest('#core-export-services, .expertise-grid, #trade-portfolio-section');

    serviceCards.forEach((card, idx) => {
      const badge = card.querySelector('.expertise-icon-box, .folio-spine-number');
      const cardTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });

      cardTl.fromTo(card,
        { y: 45, scale: 0.96 },
        { y: 0, scale: 1, duration: 0.8, delay: (idx % 3) * 0.1, ease: 'power3.out' }
      );

      if (badge) {
        cardTl.fromTo(badge,
          { scale: 0.7 },
          { scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
          '-=0.4'
        );
      }
    });

    // Stable Controlled Scroll Depth Shift
    if (serviceContainer) {
      gsap.timeline({
        scrollTrigger: {
          trigger: serviceContainer,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      }).to(serviceCards, {
        y: (i) => (i % 2 === 0 ? -25 : 20),
        ease: 'none'
      });
    }
  }

  // 4. INSTITUTIONAL SOLUTIONS: Smooth, Non-Popping Entrance & Gliding Transit Motion
  const instSection = document.querySelector('#institutional-solutions, .institutional-solutions-section');
  if (instSection) {
    const instHeader = instSection.querySelector('.section-header-editorial, .volza-leadership-header');
    const instCards = gsap.utils.toArray('.institutional-solution-box, #institutional-solutions .institutional-solution-box');

    if (instHeader) {
      gsap.fromTo(instHeader,
        { y: 20 },
        {
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: instHeader,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Complete Box + Icon + Title + Description + Tags move together smoothly (NO SCALE POPPING, NO JITTER)
    if (instCards.length) {
      gsap.fromTo(instCards,
        { y: 25 },
        {
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: instSection,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // 4B. MINI GREEN EXPORT CARGO TRUCK SCROLL-DRIVEN HORIZONTAL TRAVEL (Smooth Gliding, scrub: 0.8)
    const instTruck = instSection.querySelector('.inst-export-truck');
    const instLane = instSection.querySelector('.inst-cargo-transit-lane');
    if (instTruck && instLane) {
      const getTravelDist = () => (instLane.offsetWidth || 900) + 100;
      gsap.fromTo(instTruck,
        { x: 0 },
        {
          x: getTravelDist,
          ease: 'none',
          scrollTrigger: {
            trigger: instSection,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.8
          }
        }
      );

      // Rotate wheels smoothly as truck glides
      const wheels = instTruck.querySelectorAll('.truck-wheel-inner');
      if (wheels.length) {
        gsap.to(wheels, {
          rotate: 1080,
          transformOrigin: 'center center',
          ease: 'none',
          scrollTrigger: {
            trigger: instSection,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.8
          }
        });
      }
    }
  }

  // 5. FOUNDERS / LEADERSHIP: "Sharp Crisp Directional Entry & Depth Separation (NO BLUR, NO FADING)"
  const leaderCards = gsap.utils.toArray('.leadership-cards-grid .leader-exec-card, #leadership-section .leader-exec-card');
  if (leaderCards.length) {
    const leaderContainer = leaderCards[0].closest('#leadership-section, .leadership-cards-grid');

    leaderCards.forEach((card, idx) => {
      const isLeft = idx % 2 === 0;
      const photo = card.querySelector('.leader-portrait-wrap img');
      const name = card.querySelector('.leader-name');
      const role = card.querySelector('.leader-role-title, .leader-badge-pill');
      const quote = card.querySelector('.leader-bio-text');
      const tags = card.querySelectorAll('.leader-tag-item');

      const leaderTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // Sharp Crisp Directional Entry: Left from -50px, Right from +50px (Opacity 1, No Blur Filter)
      leaderTl.fromTo(card,
        { x: isLeft ? -50 : 50, y: 30, scale: 0.97 },
        { x: 0, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }
      );

      if (photo) {
        leaderTl.fromTo(photo,
          { scale: 0.92 },
          { scale: 1, duration: 0.65, ease: 'power2.out' },
          '-=0.6'
        );
      }

      if (name) {
        leaderTl.fromTo(name,
          { x: isLeft ? -12 : 12 },
          { x: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.45'
        );
      }

      if (role) {
        leaderTl.fromTo(role,
          { y: 8 },
          { y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.35'
        );
      }

      if (quote) {
        leaderTl.fromTo(quote,
          { y: 10 },
          { y: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.35'
        );
      }

      if (tags.length) {
        leaderTl.fromTo(tags,
          { scale: 0.92, y: 6 },
          { scale: 1, y: 0, stagger: 0.06, duration: 0.4, ease: 'power2.out' },
          '-=0.35'
        );
      }
    });

    // Sharp Depth Separation on Scroll Progress (100% Solid Opacity 1, Crisp & Readable, No Blur)
    if (leaderContainer && leaderCards.length >= 2) {
      gsap.timeline({
        scrollTrigger: {
          trigger: leaderContainer,
          start: 'top center',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(leaderCards[0], { y: -25, x: -10, ease: 'none' }, 0)
      .to(leaderCards[1], { y: -12, x: 10, ease: 'none' }, 0);
    }
  }

  // 6. MASTER LAYERED SECTION TAKEOVER (Sections Overlapping Continuously with Controlled Motion)
  const sections = gsap.utils.toArray('section[id], footer[id]');
  sections.forEach((sec, idx) => {
    if (idx < sections.length - 1) {
      const nextSec = sections[idx + 1];
      gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'bottom 60%',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(sec, { y: -35, scale: 0.98, ease: 'none' }, 0)
      .fromTo(nextSec, { y: 35 }, { y: 0, ease: 'none' }, 0);
    }
  });
}

function initFallbackScrollMotion() {
  let ticking = false;
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const vh = window.innerHeight;

        sections.forEach(sec => {
          const rect = sec.getBoundingClientRect();
          if (rect.top < vh && rect.bottom > 0) {
            const progress = (vh - rect.top) / (vh + rect.height);
            const clamped = Math.min(Math.max(progress, 0), 1);
            sec.style.setProperty('--scroll-progress', clamped.toFixed(3));
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}




