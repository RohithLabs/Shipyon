/**
 * ============================================================================
 * SHIPYON SERVICES & GLOBAL TRADE CORRIDORS CONTROLLER
 * Micro-interactions, dynamic cursor spotlight, interactive trade routes map,
 * supply-chain pipeline stream, and RFQ modal integration.
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. DYNAMIC CURSOR LIGHT-FOLLOWING EFFECT FOR SERVICE CARDS
  function initCardSpotlights() {
    const cards = document.querySelectorAll('.premium-service-card');
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // 2. INTERACTIVE GLOBAL TRADE CORRIDORS MAP
  const TRADE_ROUTES_DATA = {
    'jebel-ali': {
      name: 'Port of Jebel Ali (Dubai, UAE)',
      region: 'Middle East / GCC Corridor',
      transit: '4–6 Days Direct Reefer Liner',
      commodities: 'Fresh Mangoes, Pomegranates, Green Cardamom, Red Onions, Aseptic Fruit Purees',
      services: '2°C–8°C Cold-Chain Reefer • Phytosanitary Express Clearance • Sea Freight',
      routeId: 'route-jebel-ali'
    },
    'rotterdam': {
      name: 'Port of Rotterdam & Hamburg',
      region: 'European Union Corridor',
      transit: '18–22 Days Ocean Container Transit',
      commodities: 'Organic Grapes, High-Curcumin Turmeric, Aged Basmati Rice, Black Pepper, Moringa Powder',
      services: 'GlobalGAP Audit • EU Organic Compliance • APEDA Documentation • FCL Liner Schedule',
      routeId: 'route-rotterdam'
    },
    'singapore': {
      name: 'Port of Singapore & Port Klang',
      region: 'Southeast Asia / ASEAN Corridor',
      transit: '6–8 Days Express Liner Schedule',
      commodities: '1121 Parboiled Rice, Yellow Lentils, Fresh Table Grapes, Industrial Food Ingredients',
      services: 'Automated Moisture-Controlled Packaging • Direct Port Berthing • Certificate of Origin',
      routeId: 'route-singapore'
    },
    'new-york': {
      name: 'Port of New York & Newark',
      region: 'North America Transatlantic Corridor',
      transit: '24–28 Days Deep-Water Vessel Route',
      commodities: 'Single-Estate Tellicherry Pepper, Whole Spices, Basmati Reserves, Bulk Agro Aggregation',
      services: 'US FDA Compliance • Vacuum-Sealed Nitrogen Flushed Packaging • Vessel Chartering',
      routeId: 'route-new-york'
    },
    'chennai-origin': {
      name: 'South India Sovereign Trade Gateway',
      region: 'Origin Ports: Cochin (ICTT) • Tuticorin (VOC) • Chennai (CCT)',
      transit: 'Direct Farm-to-Vessel Express Feeder Connectivity',
      commodities: 'Primary Aggregation: Tamil Nadu, Kerala & Andhra Farm Clusters',
      services: 'Farm-Gate Sourcing • Sortex Optical Grading • Pre-Cooling Reefers • Port Quayside Docks',
      routeId: null
    }
  };

  function initInteractiveTradeMap() {
    const mapWrapper = document.getElementById('trade-map-canvas-wrapper');
    const tooltip = document.getElementById('trade-map-tooltip');
    if (!mapWrapper || !tooltip) return;

    const ports = mapWrapper.querySelectorAll('.port-node-group');
    const routes = mapWrapper.querySelectorAll('.trade-route-arc');
    const filterBtns = document.querySelectorAll('.map-filter-btn');

    // Port hover / click tooltips
    ports.forEach((port) => {
      const portKey = port.getAttribute('data-port');
      const data = TRADE_ROUTES_DATA[portKey];
      if (!data) return;

      const showTooltip = (e) => {
        tooltip.innerHTML = `
          <div class="tooltip-port-title">${data.name}</div>
          <div class="tooltip-transit-time">⏱ ${data.transit}</div>
          <div class="tooltip-commodities"><strong>Commodities:</strong> ${data.commodities}</div>
          <div style="margin-top:6px; font-size:0.72rem; color:#86EFAC;"><strong>Applied Services:</strong> ${data.services}</div>
        `;

        const wrapperRect = mapWrapper.getBoundingClientRect();
        const portRect = port.getBoundingClientRect();
        const posX = portRect.left - wrapperRect.left + portRect.width / 2;
        const posY = portRect.top - wrapperRect.top;

        tooltip.style.left = `${posX}px`;
        tooltip.style.top = `${posY}px`;
        if (posY < 180) {
          tooltip.classList.remove('pos-top');
          tooltip.classList.add('pos-bottom');
        } else {
          tooltip.classList.remove('pos-bottom');
          tooltip.classList.add('pos-top');
        }
        tooltip.classList.add('active');

        // Highlight matching route
        if (data.routeId) {
          const matchingRoute = document.getElementById(data.routeId);
          if (matchingRoute) matchingRoute.classList.add('highlighted');
        }
      };

      const hideTooltip = () => {
        tooltip.classList.remove('active');
        routes.forEach((r) => r.classList.remove('highlighted'));
      };

      port.addEventListener('mouseenter', showTooltip);
      port.addEventListener('mouseleave', hideTooltip);
      port.addEventListener('click', showTooltip);
    });

    // Corridor Filter Buttons
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const corridor = btn.getAttribute('data-corridor');
        routes.forEach((route) => {
          if (corridor === 'all' || route.getAttribute('data-corridor') === corridor) {
            route.style.opacity = '1';
            route.style.strokeWidth = corridor === 'all' ? '2' : '3.5';
          } else {
            route.style.opacity = '0.15';
            route.style.strokeWidth = '1';
          }
        });
      });
    });
  }

  // 3. SERVICE CATALOG CATEGORY SWITCHER / TABS
  function initCategorySwitcher() {
    const tabBtns = document.querySelectorAll('.catalog-tab-btn');
    const cards = document.querySelectorAll('.premium-service-card');
    const groupHeaders = document.querySelectorAll('.category-group-header');

    if (!tabBtns.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-category');

        cards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'all' || cardCat === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
              card.style.opacity = '1';
            }, 30);
          } else {
            card.style.display = 'none';
          }
        });

        // Hide/show group headers when filtering
        groupHeaders.forEach((gh) => {
          const ghCat = gh.getAttribute('data-category');
          if (filter === 'all' || ghCat === filter) {
            gh.style.display = 'flex';
          } else {
            gh.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. SUPPLY CHAIN PIPELINE NODE CLICK-TO-HIGHLIGHT
  function initPipelineNavigation() {
    const nodes = document.querySelectorAll('.pipeline-node');
    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        const targetId = node.getAttribute('data-target-service');
        if (targetId && typeof window.navigateToService === 'function') {
          window.navigateToService(targetId);
        }
      });
    });
  }

  // 5. EXPLORE SERVICE → QUOTE MODAL PRE-FILL INTEGRATION
  function initExploreServiceButtons() {
    const exploreLinks = document.querySelectorAll('.explore-service-link, .btn-featured-primary, .service-card-action-bar');
    const modalOverlay = document.getElementById('quote-modal-overlay');
    const categorySelect = document.getElementById('quote-category');

    exploreLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.premium-service-card') || link.closest('.featured-service-hero');
        const serviceName = card ? (card.querySelector('.service-card-title, .featured-title')?.textContent.trim() || '') : '';

        // Open modal
        if (modalOverlay) {
          modalOverlay.classList.add('active');

          // Try to match appropriate category in select dropdown
          if (categorySelect && serviceName) {
            if (/spice/i.test(serviceName) || /fruit/i.test(serviceName) || /vegetable/i.test(serviceName) || /grain/i.test(serviceName)) {
              categorySelect.selectedIndex = 0; // Agro & Spices
            } else if (/bulk/i.test(serviceName) || /logistics/i.test(serviceName) || /freight/i.test(serviceName)) {
              categorySelect.selectedIndex = 4; // Industrial / Commercial
            }
          }
        }
      });
    });
  }

  // 6. FEATURED VIDEO CONTROLLER (SOUND TOGGLE & PLAYBACK)
  function initFeaturedVideo() {
    const video = document.getElementById('featured-logistics-video');
    const audioBtn = document.getElementById('featured-video-audio-btn');
    if (!video || !audioBtn) return;

    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      const isMuted = video.muted;
      const mutedIcon = audioBtn.querySelector('.audio-icon-muted');
      const unmutedIcon = audioBtn.querySelector('.audio-icon-unmuted');
      if (mutedIcon && unmutedIcon) {
        mutedIcon.style.display = isMuted ? 'block' : 'none';
        unmutedIcon.style.display = isMuted ? 'none' : 'block';
      }
    });

    video.addEventListener('click', () => {
      if (video.paused) {
        video.dataset.manualPaused = 'false';
        video.play();
      } else {
        video.dataset.manualPaused = 'true';
        video.pause();
      }
    });
  }

  // Initialize all features once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initCardSpotlights();
    initInteractiveTradeMap();
    initCategorySwitcher();
    initPipelineNavigation();
    initExploreServiceButtons();
    initFeaturedVideo();
  });
})();
