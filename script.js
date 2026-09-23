/**
 * SHIPYON V2 - INTERACTIONS & FUNCTIONALITY
 * Clean, soft, responsive interactions for architectural trade site
 */

document.addEventListener('DOMContentLoaded', () => {
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
});

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

  if (!cards.length || !images.length) return;

  const data = [
    { tag: 'Pillar 01 • Sourcing', title: 'Origin Control & Certified Grading' },
    { tag: 'Pillar 02 • Cold Chain', title: 'Precision Reefer & Cold Chain Fleet' },
    { tag: 'Pillar 03 • Seaports', title: 'Deep-Water Seaport Direct Berths' },
    { tag: 'Pillar 04 • Compliance', title: 'Phytosanitary & Institutional Trust' }
  ];

  let currentIndex = 0;
  let autoTimer = null;

  function setActivePillar(index) {
    currentIndex = index;
    cards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });

    images.forEach((img, idx) => {
      img.classList.toggle('active', idx === index);
    });

    if (tagEl && data[index]) tagEl.textContent = data[index].tag;
    if (titleEl && data[index]) titleEl.textContent = data[index].title;

    // Animate progress bar
    if (progressFill) {
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      setTimeout(() => {
        progressFill.style.transition = 'width 4.8s linear';
        progressFill.style.width = '100%';
      }, 50);
    }
  }

  function startAutoCycle() {
    stopAutoCycle();
    autoTimer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % cards.length;
      setActivePillar(nextIndex);
    }, 4800);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Interacting with cards switches view immediately and continues continuous cycle
  cards.forEach((card, idx) => {
    card.addEventListener('mouseenter', () => {
      setActivePillar(idx);
      startAutoCycle();
    });

    card.addEventListener('click', () => {
      setActivePillar(idx);
      startAutoCycle();
    });
  });

  // Cursor on image or outside does NOT stop cycle - continues working uninterrupted
  const display = document.getElementById('why-console-display');
  if (display) {
    display.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % cards.length;
      setActivePillar(nextIndex);
      startAutoCycle();
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
    });
  }

  panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      setActivePanel(panel);
    });

    panel.addEventListener('click', () => {
      setActivePanel(panel);
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActivePanel(panel);
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
  const counters = document.querySelectorAll('.counter-value');
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
  const clipPath = document.getElementById("road-clip-path");
  const roadTruck = document.getElementById("road-cargo-truck");
  const arrowHead = document.getElementById("road-arrow-head");
  const tabs = document.querySelectorAll(".zigzag-tab-btn");
  const statusText = document.getElementById("zigzag-status-chip-text");
  
  if (!track || !clipPath) return;

  const pins = [
    document.getElementById("pin-marker-01"),
    document.getElementById("pin-marker-02"),
    document.getElementById("pin-marker-03"),
    document.getElementById("pin-marker-04")
  ];

  // Presentation card element references
  const badgeEl = document.getElementById("zstage-badge");
  const pctEl = document.getElementById("zstage-pct");
  const headlineEl = document.getElementById("zstage-headline");
  const descEl = document.getElementById("zstage-description");
  const photoEl = document.getElementById("zstage-photo");
  const photoBadgeEl = document.getElementById("zstage-photo-badge-text");
  const val1 = document.getElementById("zmetric-val-1");
  const lbl1 = document.getElementById("zmetric-lbl-1");
  const val2 = document.getElementById("zmetric-val-2");
  const lbl2 = document.getElementById("zmetric-lbl-2");
  const val3 = document.getElementById("zmetric-val-3");
  const lbl3 = document.getElementById("zmetric-lbl-3");
  const hintEl = document.getElementById("zstage-hint-text");

  // Rich operational stage data across all 4 stages
  const STAGES = [
    {
      badge: "STAGE 01 OF 04 • ORIGIN PROCUREMENT",
      pct: "25% Pipeline",
      headline: "Farm-Level Direct Sourcing",
      description: "Direct agrarian partnerships across 3,500+ verified regional growers in Tamil Nadu & Kerala. 100% terroir traceability, fair farmgate pricing, and rigorous soil-to-harvest purity inspection.",
      photo: "assets/shipyon-coconut.png",
      photoBadge: "Origin Hub: Pollachi & Salem Core",
      metrics: [
        { val: "3,500+", lbl: "Verified Farms" },
        { val: "100%", lbl: "Origin Traceable" },
        { val: "Zero", lbl: "Middlemen Markups" }
      ],
      status: "Stage 01: Sourcing at origin farms (Tamil Nadu)",
      hint: "Scroll down to advance to Quality Grading"
    },
    {
      badge: "STAGE 02 OF 04 • QUALITY & LAB TESTING",
      pct: "50% Pipeline",
      headline: "Sortex Optical Grading & Lab Testing",
      description: "State-of-the-art AI optical color sorting, density classification, and comprehensive NABL-accredited phytosanitary lab testing. Verified zero aflatoxins and pesticide residue clearance.",
      photo: "assets/shipyon-reefer-terminal.jpg",
      photoBadge: "APEDA & FDA Certified Lab Facility",
      metrics: [
        { val: "99.9%", lbl: "Purity Standard" },
        { val: "NABL", lbl: "Certified Labs" },
        { val: "0.1%", lbl: "Defect Ceiling" }
      ],
      status: "Stage 02: Precision optical grading & lab assays",
      hint: "Scroll down to advance to Cold Chain Logistics"
    },
    {
      badge: "STAGE 03 OF 04 • REEFER COLD CHAIN",
      pct: "75% Pipeline",
      headline: "Precision Multimodal Cold Chain",
      description: "Continuous temperature and humidity-controlled transit from farmgate to deepwater ports. Multi-sensor IoT telemetry streams real-time cargo vital signs directly to buyers.",
      photo: "assets/shipyon-dock-cranes.jpg",
      photoBadge: "IoT Telemetry: -20°C to +14°C Active Reefer",
      metrics: [
        { val: "24/7", lbl: "IoT Telemetry" },
        { val: "±0.5°C", lbl: "Thermal Precision" },
        { val: "Zero", lbl: "Thermal Breaches" }
      ],
      status: "Stage 03: Reefer convoy en route to port",
      hint: "Scroll down to advance to Global Ocean Export"
    },
    {
      badge: "STAGE 04 OF 04 • GLOBAL OCEAN EXPORT",
      pct: "100% Pipeline",
      headline: "Port Customs Clearance & Ocean Liners",
      description: "Priority port staging at VOCPT Tuticorin, Chennai Port, and ICTT Vallarpadam. Direct liner berths to 50+ global destinations across North America, Europe, GCC, and ASEAN.",
      photo: "assets/shipyon-sunset-containership.jpg",
      photoBadge: "Direct Liner Berths • VOCPT & ICTT Ports",
      metrics: [
        { val: "50+", lbl: "Destination Ports" },
        { val: "Tier-1", lbl: "Shipping Liners" },
        { val: "100%", lbl: "On-Time Vessel ETA" }
      ],
      status: "Stage 04: Vessel dispatched to global ports",
      hint: "Stage 04 complete! Keep scrolling to explore Our Values"
    }
  ];

  // SVG Path geometry length
  let totalLength = 1000;
  try {
    totalLength = clipPath.getTotalLength();
  } catch (e) {
    totalLength = 1050;
  }

  // Pre-configure initial state: show starting stage
  clipPath.style.strokeDasharray = totalLength;
  clipPath.style.strokeDashoffset = totalLength * 0.95; // starting point visible

  let targetProgress = 0;
  let currentProgress = 0;
  let activeStageIndex = 0;
  let isUpdatingCard = false;

  // Compute scroll progress relative to track
  function onScroll() {
    const rect = track.getBoundingClientRect();
    const maxScroll = track.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
    targetProgress = progress;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth 60fps lerp animation loop
  function animLoop() {
    // Lerp progress for buttery feel
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0008) {
      currentProgress += diff * 0.12;
    } else {
      currentProgress = targetProgress;
    }

    // Clamp progress
    const p = Math.max(0, Math.min(1, currentProgress));

    // 1. Reveal road along the curve
    const offset = totalLength * (1 - p);
    clipPath.style.strokeDashoffset = offset;

    // 2. Drive the container truck along the road
    try {
      const truckPos = clipPath.getPointAtLength(p * totalLength);
      const delta = 0.008;
      const nextPos = clipPath.getPointAtLength(Math.min(1, p + delta) * totalLength);
      const angle = Math.atan2(nextPos.y - truckPos.y, nextPos.x - truckPos.x) * (180 / Math.PI);
      
      if (roadTruck) {
        roadTruck.setAttribute("transform", `translate(${truckPos.x.toFixed(1)}, ${truckPos.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
      }
    } catch (err) {}

    // 3. Arrow head active highlight at the finish
    if (arrowHead) {
      arrowHead.classList.toggle("active", p >= 0.95);
    }

    // 4. Determine stage index based on progress
    let newStage = 0;
    if (p < 0.22) {
      newStage = 0;
    } else if (p < 0.55) {
      newStage = 1;
    } else if (p < 0.85) {
      newStage = 2;
    } else {
      newStage = 3;
    }

    // Update pins state
    if (pins[0]) pins[0].classList.add("active");
    if (pins[1]) pins[1].classList.toggle("active", p >= 0.22);
    if (pins[2]) pins[2].classList.toggle("active", p >= 0.55);
    if (pins[3]) pins[3].classList.toggle("active", p >= 0.85);

    // Update stage card if changed
    if (newStage !== activeStageIndex && !isUpdatingCard) {
      activeStageIndex = newStage;
      updateStageCard(activeStageIndex);
    }

    requestAnimationFrame(animLoop);
  }

  function updateStageCard(stageIdx) {
    const data = STAGES[stageIdx];
    if (!data) return;

    // Update Tab navigation highlights
    tabs.forEach((tab, idx) => {
      const isActive = idx === stageIdx;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    // Update Status chip text
    if (statusText) {
      statusText.textContent = data.status;
    }

    // Cross-fade card content smoothly
    const animatedEls = [headlineEl, descEl, photoEl, val1, val2, val3];
    animatedEls.forEach(el => {
      if (el) el.classList.add("zstage-fade-out");
    });

    isUpdatingCard = true;
    setTimeout(() => {
      if (badgeEl) badgeEl.textContent = data.badge;
      if (pctEl) pctEl.textContent = data.pct;
      if (headlineEl) headlineEl.textContent = data.headline;
      if (descEl) descEl.textContent = data.description;
      if (photoEl) photoEl.src = data.photo;
      if (photoBadgeEl) photoBadgeEl.textContent = data.photoBadge;

      if (val1 && data.metrics[0]) val1.textContent = data.metrics[0].val;
      if (lbl1 && data.metrics[0]) lbl1.textContent = data.metrics[0].lbl;
      if (val2 && data.metrics[1]) val2.textContent = data.metrics[1].val;
      if (lbl2 && data.metrics[1]) lbl2.textContent = data.metrics[1].lbl;
      if (val3 && data.metrics[2]) val3.textContent = data.metrics[2].val;
      if (lbl3 && data.metrics[2]) lbl3.textContent = data.metrics[2].lbl;

      if (hintEl) hintEl.textContent = data.hint;

      animatedEls.forEach(el => {
        if (el) el.classList.remove("zstage-fade-out");
      });
      isUpdatingCard = false;
    }, 180);
  }

  // Interactive Tab Clicks (Direct scroll to that stage milestone)
  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      const targetPercent = [0.0, 0.33, 0.67, 1.0][idx];
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const maxScroll = track.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: trackTop + maxScroll * targetPercent,
        behavior: "smooth"
      });
    });
  });

  // Interactive Pin Clicks
  pins.forEach((pin, idx) => {
    if (!pin) return;
    pin.addEventListener("click", () => {
      const targetPercent = [0.0, 0.33, 0.67, 1.0][idx];
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const maxScroll = track.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: trackTop + maxScroll * targetPercent,
        behavior: "smooth"
      });
    });
  });

  // Initial call
  updateStageCard(0);
  requestAnimationFrame(animLoop);
}

// 14. Mobile Swipe & Auxiliary Handlers
function initMobileMovesSwipe() {
  // Mobile swipe support if needed
}

// 15. Continuous Kinetic Values Interactive System & Harmonic Oscillators
function initValuesInteractiveCards() {
  const showcaseWrapper = document.getElementById("values-showcase-wrapper");
  const cards = document.querySelectorAll(".value-luxury-card");
  if (!cards.length) return;

  // --- A. Dynamic SVG Interconnecting Artery Coordinates ---
  const arterySvg = document.getElementById("values-artery-svg");
  const path12 = document.getElementById("artery-path-1-2");
  const path23 = document.getElementById("artery-path-2-3");
  const path34 = document.getElementById("artery-path-3-4");

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

      const flow12 = document.getElementById("artery-flow-1-2");
      const flow23 = document.getElementById("artery-flow-2-3");
      const flow34 = document.getElementById("artery-flow-3-4");
      if (flow12) flow12.setAttribute("d", d12);
      if (flow23) flow23.setAttribute("d", d23);
      if (flow34) flow34.setAttribute("d", d34);
    }
  }

  function showWrapperIsVisible() {
    return showcaseWrapper.offsetParent !== null;
  }

  setTimeout(updateArteryCoordinates, 350);
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

  // IntersectionObserver to save CPU when offscreen
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!waveAnimFrameId) renderHarmonicWaves();
          updateArteryCoordinates();
        } else {
          if (waveAnimFrameId) {
            cancelAnimationFrame(waveAnimFrameId);
            waveAnimFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });

    const valuesSection = document.getElementById("values-section");
    if (valuesSection) observer.observe(valuesSection);
    else renderHarmonicWaves();
  } else {
    renderHarmonicWaves();
  }

  // --- C. Autonomous Intelligent Resonance Cascade ---
  let activeIndex = 0;
  let resonanceInterval = null;
  let userHovering = false;

  function setResonantCard(idx) {
    cards.forEach((c, i) => {
      if (i === idx) {
        c.classList.add("active-resonance");
      } else {
        c.classList.remove("active-resonance");
      }
    });
  }

  function startResonanceCycle() {
    if (resonanceInterval) clearInterval(resonanceInterval);
    setResonantCard(activeIndex);
    resonanceInterval = setInterval(() => {
      if (!userHovering) {
        activeIndex = (activeIndex + 1) % cards.length;
        setResonantCard(activeIndex);
      }
    }, 3200);
  }

  startResonanceCycle();

  // --- D. 3D Magnetic Cursor Tilt & Spotlight Tracking ---
  cards.forEach((card, idx) => {
    card.addEventListener("mouseenter", () => {
      userHovering = true;
      card.classList.add("is-hovered");
      setResonantCard(idx);
    });

    card.addEventListener("mouseleave", () => {
      userHovering = false;
      card.classList.remove("is-hovered");
      card.style.transform = "";
      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");
      activeIndex = idx;
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Calculate subtle 3D magnetic tilt (-6 to +6 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = -((y - centerY) / centerY) * 6;
      const tiltY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-8px) scale(1.02)`;
    });
  });
}

