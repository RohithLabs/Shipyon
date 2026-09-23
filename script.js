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

// 6. Interactive Animated World Trade Map
function initWorldTradeMap() {
  const mapCard = document.querySelector('.world-map-canvas-card');
  if (!mapCard) return;

  // IntersectionObserver to trigger smooth coordinated entrance animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mapCard.classList.add('map-animated');
        observer.unobserve(mapCard);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(mapCard);

  // Country callout interaction: click opens quote modal with destination pre-filled
  const callouts = mapCard.querySelectorAll('.country-callout, .map-country-callout');
  const modal = document.getElementById('quote-modal-overlay');
  const destInput = document.getElementById('quote-destination');

  callouts.forEach(callout => {
    const country = callout.dataset.country;
    if (!country) return;

    callout.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      if (destInput) {
        destInput.value = country;
      }
    });

    callout.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callout.click();
      }
    });
  });

  // Cruising vessel click opens quote modal with route pre-filled
  const vessels = mapCard.querySelectorAll('.cruising-vessel');
  vessels.forEach(vessel => {
    const route = vessel.dataset.route;
    if (!route) return;
    vessel.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      if (destInput) {
        destInput.value = route;
      }
    });
  });

  // Interactive route highlighting on callout hover
  const routeSelectorMap = {
    'USA': '#stream-us, #track-us',
    'GERMANY': '#stream-de, #track-de',
    'DUBAI (UAE)': '#stream-ae, #track-ae',
    'SRI LANKA': '#stream-lk, #track-lk',
    'MALAYSIA': '#stream-my, #track-my',
    'SINGAPORE': '#stream-sg, #track-sg',
    'VIETNAM': '#stream-vn, #track-vn',
    'AUSTRALIA': '#stream-au, #track-au'
  };

  callouts.forEach(callout => {
    const country = callout.dataset.country;
    if (!country || !routeSelectorMap[country]) return;
    const targetPaths = mapCard.querySelectorAll(routeSelectorMap[country]);

    callout.addEventListener('mouseenter', () => {
      targetPaths.forEach(p => {
        p.style.stroke = '#F59E0B';
        p.style.strokeWidth = '6.5px';
        p.style.filter = 'drop-shadow(0 0 12px #F59E0B)';
      });
    });

    callout.addEventListener('mouseleave', () => {
      targetPaths.forEach(p => {
        p.style.stroke = '';
        p.style.strokeWidth = '';
        p.style.filter = '';
      });
    });
  });

  // 3D Interactive Mouse Parallax Tilt
  const stage = document.querySelector('.map-3d-perspective-stage');
  if (stage && mapCard) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = 8 - y * 12;
      const rotY = x * 10;
      mapCard.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(0.99)`;
    });

    stage.addEventListener('mouseleave', () => {
      mapCard.style.transform = 'rotateX(8deg) rotateY(0deg) scale(0.985)';
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

