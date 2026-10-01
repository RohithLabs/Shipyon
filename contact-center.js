/**
 * SHIPYON GLOBAL TRADE COMMUNICATION CENTER ENGINE
 * Immersive, High-Performance Interactive Architecture
 */

(function () {
  'use strict';

  // Desk Data Repository
  const TRADE_DESKS = {
    trade_desk: {
      id: 'trade_desk',
      name: 'International Trade Desk',
      sub: 'Domestic & Pan-Asia Sourcing Hub',
      badge: 'Asia & Regional Corridors',
      phone: '+91 95006 90740',
      phoneClean: '919500690740',
      email: 'aicentre.nitt@gmail.com',
      ports: 'Tuticorin, Chennai, Cochin, Nhava Sheva',
      commodities: 'Fresh Harvests, Premium Spices, Grains, Minerals',
      hours: '08:00 – 21:00 IST (UTC +5:30)',
      officer: 'Mr. Naveen Ananthan — Trade Operations Lead',
      actionText: 'Direct Call (+91 95006 90740)',
      actionHref: 'tel:+919500690740'
    },
    europe_desk: {
      id: 'europe_desk',
      name: 'Europe & Middle East Desk',
      sub: 'Customs, Maritime & Port Logistics',
      badge: 'Transatlantic & Gulf Corridors',
      phone: '+49 1515 6840689',
      phoneClean: '4915156840689',
      email: 'aicentre.nitt@gmail.com',
      ports: 'Rotterdam, Hamburg, Jebel Ali, Felixstowe',
      commodities: 'Phytosanitary Produce, Textiles, Agro-Commodities',
      hours: '09:00 – 19:00 CET / GST',
      officer: 'Mr. Pranesh Kumar — Maritime Compliance Desk',
      actionText: 'Direct Call (+49 1515 6840689)',
      actionHref: 'tel:+4915156840689'
    },
    institutional: {
      id: 'institutional',
      name: 'Institutional Procurement Desk',
      sub: 'High-Volume Enterprise & Sovereign Tenders',
      badge: 'Bulk Sourcing & Long-Term Contracts',
      phone: '+91 95006 90740',
      phoneClean: '919500690740',
      email: 'aicentre.nitt@gmail.com',
      ports: 'All Indian & International Discharge Ports',
      commodities: 'Full Vessel Rice, Bulk Spices, Raw Agricultural Output',
      hours: '24/7 Diplomatic & Enterprise Priority',
      officer: 'Shipyon Senior Directorate',
      actionText: 'Email Institutional Desk',
      actionHref: 'mailto:aicentre.nitt@gmail.com?subject=Institutional%20Procurement%20Tender'
    },
    logistics: {
      id: 'logistics',
      name: 'Maritime Logistics & Cold-Chain Desk',
      sub: 'Reefer Monitoring & Multimodal Freight',
      badge: 'End-to-End Fleet Stewardship',
      phone: '+91 95006 90740',
      phoneClean: '919500690740',
      email: 'aicentre.nitt@gmail.com',
      ports: 'Direct Port-Gateways & Reefer Yards',
      commodities: 'IoT Controlled Cold-Chain Freight & Breakbulk',
      hours: '24/7 Ocean Transit Telemetry',
      officer: 'Harbor Logistics Coordinators',
      actionText: 'Connect Logistics Team',
      actionHref: 'tel:+919500690740'
    },
    whatsapp_channel: {
      id: 'whatsapp_channel',
      name: 'Instant WhatsApp Trade Channel',
      sub: 'Real-Time FOB/CIF Spot Quotes & Docs',
      badge: 'Live 24/7 Verified Gateway',
      phone: '+91 95006 90740',
      phoneClean: '919500690740',
      email: 'aicentre.nitt@gmail.com',
      ports: 'Immediate Container Allocation Worldwide',
      commodities: 'All Export Catalog Commodities',
      hours: 'Instant Response (< 15 Minutes Average)',
      officer: 'Duty Trade Officer Online',
      actionText: 'Open WhatsApp Chat',
      actionHref: 'https://wa.me/919500690740?text=Hello%20Shipyon%2C%20I%20am%20inquiring%20about%20spot%20export%20quotations.'
    },
    sourcing_desk: {
      id: 'sourcing_desk',
      name: 'Agrarian Provenance & Sourcing Desk',
      sub: 'Direct Farmer Alliances & Terroir Assays',
      badge: 'Phytosanitary & SGS Audit Ready',
      phone: '+91 95006 90740',
      phoneClean: '919500690740',
      email: 'aicentre.nitt@gmail.com',
      ports: 'Tamil Nadu, Kerala, Andhra & Karnataka Hubs',
      commodities: 'Farm-Fresh Coconuts, Red Chilly, Turmeric, Basmati',
      hours: '07:00 – 19:00 IST',
      officer: 'Agronomy Quality Control Team',
      actionText: 'Inquire Sourcing Specs',
      actionHref: 'mailto:aicentre.nitt@gmail.com?subject=Origin%20Sourcing%20Specification'
    }
  };

  // Node Positions (degrees around center on desktop)
  const NODE_CONFIGS = [
    { id: 'trade_desk', angle: 300, icon: 'globe', title: 'International Trade Desk', sub: 'Domestic & Asia' },
    { id: 'europe_desk', angle: 60, icon: 'anchor', title: 'Europe & Mideast Desk', sub: 'Rotterdam / Jebel Ali' },
    { id: 'institutional', angle: 0, icon: 'briefcase', title: 'Institutional Inquiries', sub: 'Global Tenders' },
    { id: 'logistics', angle: 120, icon: 'truck', title: 'Logistics Support', sub: 'Cold-Chain Reefer' },
    { id: 'whatsapp_channel', angle: 180, icon: 'whatsapp', title: 'WhatsApp Channel', sub: 'Instant Spot Rates', badge: 'Active' },
    { id: 'sourcing_desk', angle: 240, icon: 'leaf', title: 'Product & Sourcing Desk', sub: 'Farm-Gate Assured' }
  ];

  let activeDeskKey = null;

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initLivingBackgroundCanvas();
    initOrbitingNodes();
    initRegionalGateways();
    initFloatingRFQPortal();
    initTelemetryDock();
    initCustomCursor();
  });

  /* ==========================================================================
     1. LIVING BACKGROUND CANVAS (World Map & Flowing Trade Routes)
     ========================================================================== */
  function initLivingBackgroundCanvas() {
    const canvas = document.getElementById('comm-network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    function resize() {
      width = canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
      height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    }
    let canvasRect = null;
    function updateCanvasRect() {
      canvasRect = canvas.getBoundingClientRect();
    }
    window.addEventListener('resize', () => { resize(); updateCanvasRect(); }, { passive: true });
    resize();
    updateCanvasRect();

    // Mouse parallax (listen only on parent element with cached rect)
    if (canvas.parentElement) {
      canvas.parentElement.addEventListener('mousemove', (e) => {
        if (!canvasRect) return;
        mouse.targetX = (e.clientX - canvasRect.left) / width;
        mouse.targetY = (e.clientY - canvasRect.top) / height;
      }, { passive: true });
    }

    // Key trade hub coordinates (relative normalized 0..1 on canvas)
    const HUBS = [
      { name: 'India HQ', x: 0.52, y: 0.48, r: 6, hq: true },
      { name: 'Rotterdam/Europe', x: 0.38, y: 0.32, r: 4 },
      { name: 'Dubai/Mideast', x: 0.47, y: 0.42, r: 4 },
      { name: 'Singapore', x: 0.62, y: 0.58, r: 4 },
      { name: 'New York/US', x: 0.22, y: 0.36, r: 4 },
      { name: 'Sydney/Oceana', x: 0.74, y: 0.72, r: 3 }
    ];

    // Shipping Route Arcs (indices in HUBS)
    const ROUTES = [
      { from: 0, to: 2, speed: 0.007 }, // India -> Dubai
      { from: 2, to: 1, speed: 0.005 }, // Dubai -> Europe
      { from: 0, to: 1, speed: 0.004 }, // India -> Europe (Direct)
      { from: 0, to: 3, speed: 0.006 }, // India -> Singapore
      { from: 1, to: 4, speed: 0.0035 }, // Europe -> US
      { from: 3, to: 5, speed: 0.003 }  // Singapore -> Australia
    ];

    // Multi-spectrum Photons traveling on routes (Gold, Cyan, Emerald)
    const photons = ROUTES.map((r, i) => ({
      routeIdx: i,
      t: Math.random(),
      speed: r.speed * (0.8 + Math.random() * 0.4),
      size: 2.5 + Math.random() * 1.5,
      spectrum: i % 3 // 0: Gold, 1: Cyan, 2: Emerald
    }));

    // Multi-spectrum Ambient floating particles (optimized count)
    const particles = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      r: 1 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.45,
      spectrum: i % 3 // 0: Gold, 1: Cyan, 2: Emerald
    }));

    let animId;
    function render() {
      if (!isCanvasVisible) {
        animId = null;
        return;
      }

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const offsetX = (mouse.x - 0.5) * 35;
      const offsetY = (mouse.y - 0.5) * 25;

      // Draw subtle continent silhouette dots
      drawSubtleContinents(ctx, width, height, offsetX, offsetY);

      // Draw Trade Route Arcs
      ctx.lineWidth = 1;
      ROUTES.forEach(r => {
        const h1 = HUBS[r.from];
        const h2 = HUBS[r.to];
        const x1 = h1.x * width + offsetX;
        const y1 = h1.y * height + offsetY;
        const x2 = h2.x * width + offsetX;
        const y2 = h2.y * height + offsetY;

        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - 40; // Arc curvature

        ctx.strokeStyle = 'rgba(176, 219, 156, 0.4)';
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw Photons moving on arcs
      photons.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const r = ROUTES[p.routeIdx];
        const h1 = HUBS[r.from];
        const h2 = HUBS[r.to];
        const x1 = h1.x * width + offsetX;
        const y1 = h1.y * height + offsetY;
        const x2 = h2.x * width + offsetX;
        const y2 = h2.y * height + offsetY;
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - 40;

        // Quadratic bezier position
        const t = p.t;
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

        // Draw multi-spectrum photon glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3.2);
        if (p.spectrum === 0) {
          // Solar Champagne Gold
          grad.addColorStop(0, 'rgba(245, 186, 49, 0.95)');
          grad.addColorStop(0.4, 'rgba(212, 175, 55, 0.6)');
          grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        } else if (p.spectrum === 1) {
          // Oceanic Maritime Cyan
          grad.addColorStop(0, 'rgba(6, 182, 212, 0.95)');
          grad.addColorStop(0.4, 'rgba(14, 165, 233, 0.6)');
          grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        } else {
          // Biophilic Emerald Neon
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.95)');
          grad.addColorStop(0.4, 'rgba(52, 211, 153, 0.6)');
          grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.85, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Hubs with multi-spectral radiance
      HUBS.forEach((h, idx) => {
        const hx = h.x * width + offsetX;
        const hy = h.y * height + offsetY;

        // Beacon halo
        let haloColor = 'rgba(27, 115, 57, 0.16)';
        let innerColor = '#1B7339';
        if (h.hq) {
          haloColor = 'rgba(245, 186, 49, 0.3)';
          innerColor = '#D4AF37';
        } else if (idx === 1 || idx === 3) {
          // Rotterdam & Singapore (Ocean Ports)
          haloColor = 'rgba(6, 182, 212, 0.25)';
          innerColor = '#06B6D4';
        } else {
          haloColor = 'rgba(16, 185, 129, 0.25)';
          innerColor = '#10B981';
        }

        ctx.fillStyle = haloColor;
        ctx.beginPath();
        ctx.arc(hx, hy, h.r * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Inner dot
        ctx.fillStyle = innerColor;
        ctx.beginPath();
        ctx.arc(hx, hy, h.r, 0, Math.PI * 2);
        ctx.fill();

        // Core white point
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(hx, hy, h.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Multi-Spectrum Ambient Particles
      particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0) pt.x = 1;
        if (pt.x > 1) pt.x = 0;
        if (pt.y < 0) pt.y = 1;
        if (pt.y > 1) pt.y = 0;

        const ptx = pt.x * width + offsetX * 0.5;
        const pty = pt.y * height + offsetY * 0.5;

        if (pt.spectrum === 0) {
          ctx.fillStyle = `rgba(245, 186, 49, ${pt.alpha * 0.75})`;
        } else if (pt.spectrum === 1) {
          ctx.fillStyle = `rgba(6, 182, 212, ${pt.alpha * 0.75})`;
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${pt.alpha * 0.75})`;
        }
        ctx.beginPath();
        ctx.arc(ptx, pty, pt.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    }

    let isCanvasVisible = true;
    animId = requestAnimationFrame(render);

    if ('IntersectionObserver' in window) {
      const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isCanvasVisible = entry.isIntersecting;
          if (isCanvasVisible) {
            updateCanvasRect();
            if (!animId) animId = requestAnimationFrame(render);
          } else {
            if (animId) {
              cancelAnimationFrame(animId);
              animId = null;
            }
          }
        });
      }, { rootMargin: '120px 0px 120px 0px', threshold: 0 });
      canvasObserver.observe(canvas);
    }
  }

  function drawSubtleContinents(ctx, w, h, ox, oy) {
    ctx.fillStyle = 'rgba(20, 53, 27, 0.025)';
    // Eurasian / Indian landmass silhouette hint
    ctx.beginPath();
    ctx.ellipse(w * 0.50 + ox, h * 0.45 + oy, w * 0.22, h * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    // European landmass hint
    ctx.beginPath();
    ctx.ellipse(w * 0.36 + ox, h * 0.32 + oy, w * 0.11, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    // African landmass hint
    ctx.beginPath();
    ctx.ellipse(w * 0.42 + ox, h * 0.56 + oy, w * 0.10, h * 0.18, 0.1, 0, Math.PI * 2);
    ctx.fill();
    // Americas hint
    ctx.beginPath();
    ctx.ellipse(w * 0.20 + ox, h * 0.46 + oy, w * 0.11, h * 0.24, -0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ==========================================================================
     2. ORBITING NODES & MORPHING CENTRAL INFORMATION DOSSIER
     ========================================================================== */
  function initOrbitingNodes() {
    const hubWrapper = document.querySelector('.comm-hub-wrapper');
    const nodesTrack = document.getElementById('comm-nodes-track');
    const svgLines = document.getElementById('comm-lines-svg');
    const coreDock = document.getElementById('comm-core-dock');
    const expandedPanel = document.getElementById('comm-expanded-panel');

    if (!hubWrapper || !nodesTrack || !svgLines || !coreDock) return;

    let radius = 320;
    function updateRadius() {
      const w = hubWrapper.offsetWidth;
      radius = w < 768 ? 0 : Math.min(390, Math.max(280, w * 0.38));
    }
    window.addEventListener('resize', updateRadius);
    updateRadius();

    // Icons map (simple SVG symbols)
    const ICONS = {
      globe: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      anchor: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`,
      briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      truck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
      whatsapp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>`,
      leaf: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`
    };

    // Render Nodes into DOM
    nodesTrack.innerHTML = '';
    NODE_CONFIGS.forEach((node, i) => {
      const el = document.createElement('div');
      el.className = 'comm-node-item';
      el.setAttribute('data-id', node.id);
      el.innerHTML = `
        <div class="comm-node-card">
          <div class="comm-node-icon">${ICONS[node.icon] || ICONS.globe}</div>
          <div class="comm-node-texts">
            <span class="comm-node-title">${node.title} ${node.badge ? `<span class="comm-node-badge">${node.badge}</span>` : ''}</span>
            <span class="comm-node-sub">${node.sub}</span>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        selectDesk(node.id);
      });

      nodesTrack.appendChild(el);
    });

    // Position Nodes in an ellipse around center and draw SVG connecting lines
    function updateNodePositions() {
      if (window.innerWidth <= 768) {
        svgLines.innerHTML = '';
        return;
      }

      const centerX = hubWrapper.offsetWidth / 2;
      const centerY = hubWrapper.offsetHeight / 2;

      let svgHtml = '';

      const nodeEls = nodesTrack.querySelectorAll('.comm-node-item');
      nodeEls.forEach((el, i) => {
        const cfg = NODE_CONFIGS[i];
        const rad = (cfg.angle * Math.PI) / 180;
        // Oval stretch: wider horizontally and vertically with generous clearance
        const nx = centerX + Math.cos(rad) * radius * 1.44;
        const ny = centerY + Math.sin(rad) * radius * 1.04;

        el.style.left = `${nx}px`;
        el.style.top = `${ny}px`;

        const isActive = activeDeskKey === cfg.id;
        const lineClass = isActive ? 'comm-orbit-line active' : 'comm-orbit-line';

        svgHtml += `
          <line x1="${centerX}" y1="${centerY}" x2="${nx}" y2="${ny}" class="${lineClass}" id="line-${cfg.id}"></line>
        `;
      });

      svgLines.innerHTML = svgHtml;
    }

    window.addEventListener('resize', updateNodePositions);
    setTimeout(updateNodePositions, 50);

    // Click Core Emblem to expand default trade desk
    const coreEmblem = document.getElementById('comm-core-emblem');
    if (coreEmblem) {
      coreEmblem.addEventListener('click', () => {
        selectDesk('trade_desk');
      });
    }

    // Select Desk Function
    window.selectDesk = function (deskId) {
      const data = TRADE_DESKS[deskId];
      if (!data) return;

      activeDeskKey = deskId;

      // Update Node active state
      document.querySelectorAll('.comm-node-item').forEach(n => {
        n.classList.toggle('active', n.getAttribute('data-id') === deskId);
      });

      // Update SVG lines
      document.querySelectorAll('.comm-orbit-line').forEach(l => {
        l.classList.remove('active');
      });
      const activeLine = document.getElementById(`line-${deskId}`);
      if (activeLine) activeLine.classList.add('active');

      // Populate & Expand Dossier Panel
      expandedPanel.innerHTML = `
        <div>
          <div class="panel-header-row">
            <div>
              <span class="panel-desk-badge">${data.badge}</span>
              <h3 class="panel-title">${data.name}</h3>
            </div>
            <button type="button" class="panel-close-btn" onclick="collapseDesk()" title="Close Dossier">&times;</button>
          </div>

          <div class="panel-details-grid">
            <div class="panel-detail-row">
              <span class="panel-detail-label">Direct Line</span>
              <a href="${data.actionHref}" class="panel-detail-val phone">
                📞 ${data.phone}
              </a>
            </div>

            <div class="panel-detail-row">
              <span class="panel-detail-label">Corporate Email</span>
              <a href="mailto:${data.email}" class="panel-detail-val email">
                ✉️ ${data.email}
              </a>
            </div>

            <div class="panel-detail-row">
              <span class="panel-detail-label">Key Harbors</span>
              <span class="panel-detail-val">
                ⚓ ${data.ports}
              </span>
            </div>

            <div class="panel-detail-row">
              <span class="panel-detail-label">Dispatch Officer</span>
              <span class="panel-detail-val">
                🛡️ ${data.officer}
              </span>
            </div>

            <div class="panel-detail-row">
              <span class="panel-detail-label">Hours / SLA</span>
              <span class="panel-detail-val">
                ⏱️ ${data.hours}
              </span>
            </div>
          </div>
        </div>

        <div class="panel-action-row">
          <a href="${data.actionHref}" class="btn-panel-action primary">
            <span>${data.actionText}</span>
            <span>&rarr;</span>
          </a>
          <a href="https://wa.me/919500690740?text=Hello%20Shipyon%2C%20connecting%20regarding%20${encodeURIComponent(data.name)}" target="_blank" class="btn-panel-action wa" title="Chat on WhatsApp">
            <span>WhatsApp</span>
          </a>
        </div>
      `;

      coreDock.classList.add('expanded');
    };

    window.collapseDesk = function () {
      activeDeskKey = null;
      coreDock.classList.remove('expanded');
      document.querySelectorAll('.comm-node-item').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.comm-orbit-line').forEach(l => l.classList.remove('active'));
    };
  }

  /* ==========================================================================
     3. REGIONAL GATEWAYS SYNC
     ========================================================================== */
  function initRegionalGateways() {
    const buttons = document.querySelectorAll('.region-pill-btn');
    if (!buttons.length) return;

    const REGION_MAP = {
      india: 'trade_desk',
      europe: 'europe_desk',
      mideast: 'europe_desk',
      asia: 'trade_desk',
      americas: 'institutional'
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const reg = btn.getAttribute('data-region');
        const deskId = REGION_MAP[reg] || 'trade_desk';
        if (typeof window.selectDesk === 'function') {
          window.selectDesk(deskId);
        }
      });
    });
  }

  /* ==========================================================================
     4. FLOATING PROGRESSIVE MULTI-STEP RFQ PORTAL
     ========================================================================== */
  function initFloatingRFQPortal() {
    const portal = document.getElementById('floating-rfq-portal');
    const trigger = document.getElementById('rfq-trigger');
    const beginBtn = document.getElementById('btn-rfq-begin');
    const progressBar = document.getElementById('rfq-progress-bar');
    const drawer = document.getElementById('rfq-drawer');

    if (!portal || !trigger) return;

    let currentStep = 1;
    const totalSteps = 5;

    function openPortal() {
      portal.classList.add('open');
      initRFQCartSync();
      goToStep(1);
    }

    function closePortal() {
      portal.classList.remove('open');
    }

    trigger.addEventListener('click', openPortal);
    if (beginBtn) {
      beginBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPortal();
      });
    }

    // Set up progressive steps
    window.goToStep = function (stepNum) {
      if (stepNum < 1 || stepNum > totalSteps) return;
      currentStep = stepNum;

      // Update progress line
      if (progressBar) {
        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
      }

      // Update step indicator
      const ind = document.getElementById('rfq-step-ind-text');
      if (ind) ind.textContent = `STEP 0${currentStep} / 05`;

      // Show stage
      document.querySelectorAll('.rfq-stage-step').forEach((stage, idx) => {
        stage.classList.toggle('active', idx + 1 === currentStep);
      });
    };

    window.openRFQDrawer = function () {
      openPortal();
    };

    window.closeRFQDrawer = function () {
      closePortal();
    };

    // Catalog Sub-Commodities mapping directly from the Product Section (products.html)
    const CATALOG_SUBCOMMODITIES = {
      'Agro Commodities & Spices': [
        '1121 XXL Basmati Rice',
        'Alleppey Green Cardamom',
        'Salem Finger Turmeric',
        'Guntur Teja Red Chilli',
        'Malabar Black Pepper',
        'Kabuli Chickpeas',
        'White Sesame Seeds',
        'Non-GMO Soybeans'
      ],
      'Processed Food': [
        'Alphonso Mango Pulp (Aseptic)',
        'Commercial Tomato Products',
        'IQF Frozen Vegetables',
        'Canned Tropical Fruits',
        'Pure Fruit Concentrates'
      ],
      'Seafood': [
        'Vannamei White Shrimp',
        'Frozen Black Tiger Shrimp',
        'Ocean Squid / Calamari',
        'Cleaned Sepia Cuttlefish',
        'Yellowfin Tuna Saku'
      ],
      'Textile & Commercial Fabrics': [
        'Combed Cotton Fabric',
        'Indigo Ring-Spun Denim',
        'Circular Knitted Jersey',
        'Viscose Rayon Twill',
        'Pure Flax Linen Fabric',
        'Technical Textiles'
      ],
      'Engineering & Industrial Castings': [
        'Ductile Iron Castings (SG Iron)',
        'Grey Iron Machine Housings',
        'Carbon & Stainless Steel Castings',
        'Die-Cast Aluminium Components',
        'Pump & Valve Castings',
        'Precision Investment Castings'
      ]
    };

    function renderSubCommodities(categoryName) {
      const container = document.getElementById('rfq-subcommodity-pills');
      if (!container) return;
      const items = CATALOG_SUBCOMMODITIES[categoryName] || [];
      container.innerHTML = '';
      items.forEach(sub => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'subcommodity-pill-opt';
        btn.textContent = sub;
        btn.addEventListener('click', () => {
          const isSelected = btn.classList.contains('selected');
          container.querySelectorAll('.subcommodity-pill-opt').forEach(b => b.classList.remove('selected'));
          const hiddenInput = document.getElementById('rfq-selected-commodity');
          if (!isSelected) {
            btn.classList.add('selected');
            if (hiddenInput) hiddenInput.value = `${categoryName} — ${sub}`;
          } else {
            if (hiddenInput) hiddenInput.value = categoryName;
          }
        });
        container.appendChild(btn);
      });
    }

    // Commodity Selection Pills
    document.querySelectorAll('.commodity-pill-opt').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.commodity-pill-opt').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        const cat = pill.getAttribute('data-category') || pill.getAttribute('data-val');
        const hiddenInput = document.getElementById('rfq-selected-commodity');
        if (hiddenInput) hiddenInput.value = cat;
        renderSubCommodities(cat);
      });
    });

    // Initial render for default selected category
    const initialSelectedPill = document.querySelector('.commodity-pill-opt.selected');
    if (initialSelectedPill) {
      const initialCat = initialSelectedPill.getAttribute('data-category') || initialSelectedPill.getAttribute('data-val');
      renderSubCommodities(initialCat);
    }

    // Cart synchronization from Products Catalog
    function initRFQCartSync() {
      const summaryBox = document.getElementById('rfq-cart-summary-box');
      const listContainer = document.getElementById('rfq-cart-items-scroll');
      const countEl = document.getElementById('rfq-cart-count');
      if (!summaryBox || !listContainer) return;

      try {
        const raw = localStorage.getItem('shipyon_cart');
        const cart = raw ? JSON.parse(raw) : [];
        if (Array.isArray(cart) && cart.length > 0) {
          summaryBox.style.display = 'block';
          if (countEl) countEl.textContent = cart.length;
          listContainer.innerHTML = cart.map(item => `
            <div class="rfq-cart-item-chip">
              <img src="${item.image}" alt="${item.title}" class="rfq-cart-item-thumb">
              <span class="rfq-cart-item-title">${item.title}</span>
              <span class="rfq-cart-item-qty">${item.qty} ${item.unit || 'MT'}</span>
            </div>
          `).join('');
        } else {
          summaryBox.style.display = 'none';
        }
      } catch (e) {
        summaryBox.style.display = 'none';
      }
    }

    initRFQCartSync();

    // Form Submission & WhatsApp Direct Dispatch
    window.submitProgressiveRFQ = function (e) {
      if (e) e.preventDefault();

      const name = (document.getElementById('rfq-name') || {}).value || 'Valued Trader';
      const company = (document.getElementById('rfq-company') || {}).value || 'Enterprise Procurement';
      const email = (document.getElementById('rfq-email') || {}).value || '';
      const phone = (document.getElementById('rfq-phone') || {}).value || '';
      const country = (document.getElementById('rfq-country') || {}).value || '';
      const entityType = (document.getElementById('rfq-type') || {}).value || '';
      const commodity = (document.getElementById('rfq-selected-commodity') || {}).value || 'Agro Commodities & Spices';
      const volume = (document.getElementById('rfq-volume') || {}).value || '';
      const incoterms = (document.getElementById('rfq-incoterms') || {}).value || '';
      const portName = (document.getElementById('rfq-port') || {}).value || 'Designated Seaport';
      const specs = (document.getElementById('rfq-specs') || {}).value || 'Standard export packaging requested.';

      const ticketId = 'SHP-' + Math.floor(100000 + Math.random() * 900000);

      // Load any selected products from cart
      let cartItemsText = '';
      let cartCount = 0;
      try {
        const raw = localStorage.getItem('shipyon_cart');
        const cart = raw ? JSON.parse(raw) : [];
        if (Array.isArray(cart) && cart.length > 0) {
          cartCount = cart.length;
          cartItemsText += `\n📦 *Products Selected from Catalog (${cart.length} Items):*\n`;
          cart.forEach((item, idx) => {
            cartItemsText += `  ${idx + 1}. *${item.title}* (Qty: ${item.qty} ${item.unit || 'MT'}) - ${item.packaging || 'Export Standard'}\n`;
          });
        }
      } catch (err) {}

      // Build formatted WhatsApp message with ALL details
      const msgLines = [
        `📋 *SHIPYON GLOBAL TRADE RFQ SPECIFICATION*`,
        `*Reference:* ${ticketId}`,
        `*Channel:* Official Communications Portal`,
        ``,
        `👤 *Procurement Representative:*`,
        `• *Name:* ${name}`,
        `• *Company:* ${company}`,
        `• *Incorporation Country:* ${country}`,
        `• *Entity Classification:* ${entityType}`,
        `• *Business Email:* ${email}`,
        `• *Direct Phone / WA:* ${phone}`,
        ``,
        `🌐 *Target Commodity Category:*`,
        `• ${commodity}`,
        cartItemsText.trimEnd(),
        ``,
        `🚢 *Logistics & Incoterms:*`,
        `• *Destination Seaport:* ${portName}`,
        `• *Estimated Volume:* ${volume}`,
        `• *Preferred Incoterms:* ${incoterms}`,
        ``,
        `📝 *Technical Packaging & Audit Notes:*`,
        `• ${specs}`
      ].filter(line => line !== '');

      const fullMessage = msgLines.join('\n');

      // Move to WhatsApp with all details typed into the chat
      const waUrl = `https://wa.me/919500690740?text=${encodeURIComponent(fullMessage)}`;
      window.open(waUrl, '_blank');

      // Render confirmation screen into drawer
      if (drawer) {
        drawer.innerHTML = `
          <div class="rfq-success-screen">
            <div class="rfq-success-icon">✓</div>
            <span class="rfq-badge-mini">SPECIFICATION TRANSMITTED</span>
            <h3 class="rfq-step-heading" style="font-size: 1.8rem; margin-top: 8px;">Inquiry Dispatched to Trade Desk</h3>
            <p class="rfq-step-description" style="max-width: 520px; margin: 0 auto 24px auto;">
              Thank you, <strong>${name}</strong> (${company}). Your request for <strong>${commodity}</strong> toward <strong>${portName}</strong> has been transferred to WhatsApp with your full specification.
            </p>
            <div style="background: rgba(20, 53, 27, 0.05); border: 1px dashed rgba(20, 53, 27, 0.2); padding: 14px 20px; border-radius: 12px; display: inline-block; font-family: monospace; font-size: 0.88rem; margin-bottom: 24px;">
              DISPATCH REFERENCE: <strong>${ticketId}</strong> &bull; STATUS: ACTIVE IN AUDIT QUEUE
            </div>
            <div>
              <button type="button" class="btn-rfq-begin" onclick="closeRFQDrawer()" style="display: inline-flex;">
                <span>RETURN TO COMMUNICATIONS HUB</span>
              </button>
            </div>
          </div>
        `;
      }
    };
  }

  /* ==========================================================================
     5. TELEMETRY DOCK (Data Copy & Visual Connection)
     ========================================================================== */
  function initTelemetryDock() {
    const cards = document.querySelectorAll('.telemetry-card');
    cards.forEach(card => {
      const copyBtn = card.querySelector('.telemetry-copy-btn');
      const valEl = card.querySelector('.telemetry-val');
      if (copyBtn && valEl) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const text = valEl.textContent.trim();
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓';
            setTimeout(() => { copyBtn.textContent = '📋'; }, 2000);
          }).catch(() => {});
        });
      }

      // Hover link to central hub
      card.addEventListener('mouseenter', () => {
        const channel = card.getAttribute('data-channel');
        if (channel === 'phone' && typeof window.selectDesk === 'function') {
          // Subtle pulse
        }
      });
    });
  }

  /* ==========================================================================
     6. CUSTOM CONTACT CURSOR (Morphing State Ring)
     ========================================================================== */
  function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    // Create cursor container if not existing
    let cursor = document.querySelector('.comm-custom-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'comm-custom-cursor';
      cursor.innerHTML = `
        <div class="comm-cursor-ring"></div>
        <div class="comm-cursor-dot"></div>
        <span class="comm-cursor-label">EXPLORE</span>
      `;
      document.body.appendChild(cursor);
    }

    const ring = cursor.querySelector('.comm-cursor-ring');
    const dot = cursor.querySelector('.comm-cursor-dot');
    const label = cursor.querySelector('.comm-cursor-label');

    let curX = 0, curY = 0;
    let ringX = 0, ringY = 0;

    const commSection = document.getElementById('global-comm-center');
    if (!commSection) return;

    let isCommCursorActive = false;
    commSection.addEventListener('mouseenter', () => {
      document.body.classList.add('has-comm-cursor');
      if (!isCommCursorActive) {
        isCommCursorActive = true;
        requestAnimationFrame(loopCursor);
      }
    });
    commSection.addEventListener('mouseleave', () => {
      isCommCursorActive = false;
      document.body.classList.remove('has-comm-cursor');
    });

    window.addEventListener('mousemove', (e) => {
      curX = e.clientX;
      curY = e.clientY;
      if (isCommCursorActive && dot) {
        dot.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
      }
    }, { passive: true });

    function loopCursor() {
      if (!isCommCursorActive) return;
      ringX += (curX - ringX) * 0.2;
      ringY += (curY - ringY) * 0.2;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      if (label) {
        label.style.transform = `translate3d(${ringX}px, ${ringY + 28}px, 0) translate(-50%, 0)`;
      }
      requestAnimationFrame(loopCursor);
    }

    // Contextual cursor morphing
    function bindCursor(selector, text, stateClass = 'state-hover') {
      document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add(stateClass);
          if (label) label.textContent = text;
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove(stateClass);
          cursor.classList.remove('state-gold');
        });
      });
    }

    bindCursor('.comm-node-item', 'EXPLORE');
    bindCursor('.btn-rfq-begin', 'START', 'state-gold');
    bindCursor('.btn-terminal-wa', 'CONNECT', 'state-hover');
    bindCursor('.telemetry-card', 'VIEW');
    bindCursor('.region-pill-btn', 'SELECT');
    bindCursor('.comm-core-emblem', 'DESKS', 'state-gold');
  }

})();
