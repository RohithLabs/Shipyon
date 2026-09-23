/**
 * SHIPYON REAL 3D WORLD GLOBE MODEL
 * Authentic NASA 4K Blue Marble Earth with Topography Normal Maps,
 * Liquid Ocean Specular Highlights, Drifting Parallax Cloud Layer,
 * 3D Connecting Trade Corridors to India Origin, and Spherical Slerp Camera Transitions.
 *
 * SPECIFICATION:
 * 1. NO auto-revolution / auto-spin of the turntable.
 * 2. All destination countries connected to India via 3D trade lines.
 * 3. Shows countries' names with a feel-good smooth animation.
 * 4. Ultra-smooth spherical slerp camera transitions to each country.
 * 5. High-contrast solid highlighting (NO glowing effects).
 */

(function () {
  'use strict';

  // Constants
  const GLOBE_RADIUS = 100;
  const TRANSITION_DURATION_MS = 1600;
  const AUTO_TOUR_INTERVAL_MS = 4800;

  // Origin: India HQ (Tamil Nadu / South India agro-industrial gateway)
  const INDIA_HQ = {
    id: 'INDIA',
    name: 'India (Origin)',
    fullName: 'India — Origin & Headquarters',
    flag: '🇮🇳',
    lat: 13.0827,
    lon: 80.2707,
    transit: 'Origin Sourcing Hub',
    port: 'Tuticorin (VOCPT) & Cochin (ICTT)'
  };

  // Destination Trade Corridors
  const DESTINATIONS = [
    {
      id: 'DUBAI',
      name: 'Dubai (UAE)',
      flag: '🇦🇪',
      lat: 25.2048,
      lon: 55.2708,
      transit: '3.5 Days Express',
      port: 'Jebel Ali Port (DP World)'
    },
    {
      id: 'SINGAPORE',
      name: 'Singapore',
      flag: '🇸🇬',
      lat: 1.3521,
      lon: 103.8198,
      transit: '4 Days Express',
      port: 'Port of Singapore (PSA)'
    },
    {
      id: 'MALAYSIA',
      name: 'Malaysia',
      flag: '🇲🇾',
      lat: 4.2105,
      lon: 101.9758,
      transit: '4.5 Days Direct',
      port: 'Port Klang'
    },
    {
      id: 'SRILANKA',
      name: 'Sri Lanka',
      flag: '🇱🇰',
      lat: 7.8731,
      lon: 80.7718,
      transit: '1.5 Days Coastal',
      port: 'Port of Colombo'
    },
    {
      id: 'VIETNAM',
      name: 'Vietnam',
      flag: '🇻🇳',
      lat: 14.0583,
      lon: 108.2772,
      transit: '6 Days Direct',
      port: 'Ho Chi Minh Port'
    },
    {
      id: 'AUSTRALIA',
      name: 'Australia',
      flag: '🇦🇺',
      lat: -33.8688,
      lon: 151.2093,
      transit: '16 Days Direct',
      port: 'Port of Sydney & Melbourne'
    },
    {
      id: 'GERMANY',
      name: 'Germany',
      flag: '🇩🇪',
      lat: 53.5511,
      lon: 9.9937,
      transit: '18 Days Ocean',
      port: 'Port of Hamburg'
    },
    {
      id: 'USA',
      name: 'USA',
      flag: '🇺🇸',
      lat: 40.7128,
      lon: -74.0060,
      transit: '22 Days Ocean',
      port: 'Port of New York & New Jersey'
    }
  ];

  // Three.js State Variables
  let scene, camera, renderer, controls;
  let globeMesh, cloudsMesh;
  let arcObjects = [];
  let vesselObjects = [];
  let pinMarkers = [];
  let labelElements = [];
  let animFrameId = null;

  // Tour & Transition State
  let isAutoTourActive = true;
  let tourTimer = null;
  let currentTourIndex = 0;
  let isUserInteracting = false;
  let userInteractionTimeout = null;
  let isTransitioning = false;
  let activeDestinationId = 'DUBAI';

  // Math Helper: Geographic (Lat, Lon) to 3D Cartesian (x, y, z)
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
  }

  // Initialize the 3D Globe
  function initGlobe() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container) return;

    if (animFrameId) cancelAnimationFrame(animFrameId);
    stopAutoTour();
    container.innerHTML = '';

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 620;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera: Positioned looking towards South Asia / India
    camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    const initCamPos = latLonToVector3(20, 70, GLOBE_RADIUS * 2.85);
    camera.position.copy(initCamPos);

    // 3. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent backdrop
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls (NO AUTO-ROTATE — user instruction)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = false; // MUST NOT revolve automatically
    controls.enableZoom = true;
    controls.zoomSpeed = 0.7;
    controls.minDistance = 180;
    controls.maxDistance = 380;

    // Detect user manual rotation
    controls.addEventListener('start', () => {
      isUserInteracting = true;
      stopAutoTour();
    });

    controls.addEventListener('end', () => {
      isUserInteracting = false;
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
      userInteractionTimeout = setTimeout(() => {
        if (isAutoTourActive) {
          startAutoTour(true);
        }
      }, 6000);
    });

    // 5. Realistic Celestial Lighting
    const ambientLight = new THREE.AmbientLight(0xF8FAFC, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.15);
    sunLight.position.set(300, 180, 250);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x2373F4, 0.35);
    fillLight.position.set(-250, -120, -200);
    scene.add(fillLight);

    // 6. Photorealistic 4K Earth Mesh
    const textureLoader = new THREE.TextureLoader();
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      shininess: 28,
      specular: new THREE.Color(0x65D0F4)
    });

    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // 4K NASA Blue Marble Texture
    textureLoader.load(
      'assets/earth_realistic_4k.jpg',
      (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        globeMesh.material.map = tex;
        globeMesh.material.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback texture if needed
        textureLoader.load('assets/earth_atmos_2048.jpg', (fallbackTex) => {
          fallbackTex.encoding = THREE.sRGBEncoding;
          globeMesh.material.map = fallbackTex;
          globeMesh.material.needsUpdate = true;
        });
      }
    );

    // Normal Map for Topography Relief
    textureLoader.load('assets/earth_normal_2048.jpg', (normalTex) => {
      globeMesh.material.normalMap = normalTex;
      globeMesh.material.normalScale = new THREE.Vector2(0.85, 0.85);
      globeMesh.material.needsUpdate = true;
    });

    // Specular Map for Reflective Water Sunlight Glint
    textureLoader.load('assets/earth_specular_2048.jpg', (specularTex) => {
      globeMesh.material.specularMap = specularTex;
      globeMesh.material.needsUpdate = true;
    });

    // 7. Drifting Atmospheric Clouds Layer
    const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.008, 64, 64);
    const cloudsMat = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);

    textureLoader.load('assets/earth_clouds_1024.png', (cloudTex) => {
      cloudsMesh.material.map = cloudTex;
      cloudsMesh.material.needsUpdate = true;
    });

    // 8. India Origin Beacon
    buildIndiaOriginBeacon();

    // 9. 3D Connecting Lines to India
    buildTradeLinesToIndia();

    // 10. Destination 3D Pins & Projected 2D HTML Labels
    buildDestinationPinsAndLabels();

    // 11. Bind UI Controls
    bindControls();

    // 12. Handle Resize
    window.addEventListener('resize', onWindowResize, false);

    // 13. Set initial destination & start auto-transition
    highlightDestination('DUBAI');
    startAutoTour(false);

    // 14. Render Loop
    animate();
  }

  // Builds India Origin Marker
  function buildIndiaOriginBeacon() {
    const originPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS);

    // Ground anchor dot
    const dotGeo = new THREE.SphereGeometry(1.8, 16, 16);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(originPos);
    scene.add(dot);

    // Elevated pin
    const pinTop = originPos.clone().multiplyScalar(1.045);
    const stemGeo = new THREE.BufferGeometry().setFromPoints([originPos, pinTop]);
    const stemMat = new THREE.LineBasicMaterial({ color: 0xF59E0B, linewidth: 2 });
    const stem = new THREE.Line(stemGeo, stemMat);
    scene.add(stem);

    const headGeo = new THREE.SphereGeometry(2.4, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.copy(pinTop);
    scene.add(head);

    // Solid Concentric Ring (No blur glow)
    const ringGeo = new THREE.RingGeometry(1.6, 2.6, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xF59E0B,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(originPos.clone().multiplyScalar(1.002));
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), originPos.clone().normalize());
    scene.add(ring);
  }

  // Builds 3D Connecting Lines between India and every Destination Country
  function buildTradeLinesToIndia() {
    const originPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS);
    arcObjects = [];
    vesselObjects = [];

    DESTINATIONS.forEach((dest, idx) => {
      const destPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS);
      const distance = originPos.distanceTo(destPos);

      // Elevated Great-Circle Arc
      const arcAltitude = GLOBE_RADIUS + Math.min(distance * 0.32, GLOBE_RADIUS * 0.45);
      const midPoint = new THREE.Vector3().addVectors(originPos, destPos).multiplyScalar(0.5);
      midPoint.normalize().multiplyScalar(arcAltitude);

      // Smooth 3D Quadratic Curve
      const curve = new THREE.QuadraticBezierCurve3(originPos, midPoint, destPos);
      const points = curve.getPoints(70);

      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      
      // Clean, solid, high-contrast line material (NO glowing effects)
      const isInitialActive = dest.id === 'DUBAI';
      const arcMat = new THREE.LineBasicMaterial({
        color: isInitialActive ? 0x2373F4 : 0x578EF5,
        transparent: true,
        opacity: isInitialActive ? 1.0 : 0.30,
        linewidth: isInitialActive ? 3.5 : 1.8
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.userData = { id: dest.id, curve: curve };
      scene.add(arcLine);
      arcObjects.push(arcLine);

      // Cruising Cargo Indicator
      const vesselGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const vesselMat = new THREE.MeshBasicMaterial({ color: 0xF2F7A0 });
      const vessel = new THREE.Mesh(vesselGeo, vesselMat);
      vessel.userData = {
        curve: curve,
        progress: (idx * 0.12) % 1.0,
        speed: 0.0024 + (idx % 3) * 0.0004
      };
      scene.add(vessel);
      vesselObjects.push(vessel);
    });
  }

  // Builds 3D Pins & Projected 2D HTML Labels for feel-good country animation
  function buildDestinationPinsAndLabels() {
    const labelsOverlay = document.getElementById('globe-labels-overlay');
    if (!labelsOverlay) return;
    labelsOverlay.innerHTML = '';
    labelElements = [];
    pinMarkers = [];

    const allLocations = [INDIA_HQ, ...DESTINATIONS];

    allLocations.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS);
      const isIndia = loc.id === 'INDIA';

      if (!isIndia) {
        // Base ground pin
        const pinGeo = new THREE.SphereGeometry(1.6, 14, 14);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x2373F4 });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(pos);
        scene.add(pinMesh);

        // Pin stem
        const pinTop = pos.clone().multiplyScalar(1.036);
        const stemGeo = new THREE.BufferGeometry().setFromPoints([pos, pinTop]);
        const stemMat = new THREE.LineBasicMaterial({ color: 0x0B192C, linewidth: 2 });
        const stem = new THREE.Line(stemGeo, stemMat);
        scene.add(stem);

        // Elevated pin head
        const headGeo = new THREE.SphereGeometry(2.2, 14, 14);
        const headMat = new THREE.MeshBasicMaterial({ color: 0x2373F4 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.copy(pinTop);
        head.userData = { id: loc.id, baseScale: 1.0 };
        scene.add(head);
        pinMarkers.push(head);
      }

      // 2D Projected Label
      const labelEl = document.createElement('div');
      labelEl.className = `globe-projected-label ${isIndia ? 'label-origin' : ''}`;
      labelEl.dataset.dest = loc.id;
      labelEl.innerHTML = `
        <span class="label-dot"></span>
        <span class="label-text">${loc.flag ? loc.flag + ' ' : ''}${loc.name}</span>
      `;

      labelEl.addEventListener('click', (e) => {
        e.stopPropagation();
        stopAutoTour();
        navigateToCountry(loc.id);
        if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
        userInteractionTimeout = setTimeout(() => {
          if (isAutoTourActive) startAutoTour(false);
        }, 6000);
      });

      labelsOverlay.appendChild(labelEl);

      labelElements.push({
        element: labelEl,
        worldPos: pos.clone().multiplyScalar(1.045),
        id: loc.id
      });
    });
  }

  // Update screen coordinates of floating 2D labels each frame
  function updateLabels() {
    if (!camera || !renderer) return;
    const canvas = renderer.domElement;
    const widthHalf = canvas.clientWidth / 2;
    const heightHalf = canvas.clientHeight / 2;

    labelElements.forEach(item => {
      const wp = item.worldPos.clone();
      const cameraToPoint = wp.clone().sub(camera.position).normalize();
      const surfaceNormal = wp.clone().normalize();
      const dot = cameraToPoint.dot(surfaceNormal);

      // Backside culling: smoothly hide labels when facing away
      if (dot > 0.05) {
        item.element.style.opacity = '0';
        item.element.style.pointerEvents = 'none';
        return;
      }

      wp.project(camera);

      const x = (wp.x * widthHalf) + widthHalf;
      const y = -(wp.y * heightHalf) + heightHalf;

      item.element.style.left = `${x.toFixed(1)}px`;
      item.element.style.top = `${y.toFixed(1)}px`;
      item.element.style.opacity = '1';
      item.element.style.pointerEvents = 'auto';
    });
  }

  // Binds Ribbon Pills & Status Bar Controls
  function bindControls() {
    // Top Ribbon Country Buttons
    const ribbonButtons = document.querySelectorAll('.country-ribbon-btn');
    ribbonButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const destId = btn.dataset.dest;
        stopAutoTour();
        navigateToCountry(destId);

        if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
        userInteractionTimeout = setTimeout(() => {
          if (isAutoTourActive) startAutoTour(false);
        }, 6000);
      });
    });

    // Auto Transition Toggle Button
    const tourBtn = document.getElementById('btn-toggle-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => {
        isAutoTourActive = !isAutoTourActive;
        tourBtn.classList.toggle('active', isAutoTourActive);
        const iconSpan = tourBtn.querySelector('.tour-btn-icon');
        const textSpan = tourBtn.querySelector('.tour-btn-text');
        if (isAutoTourActive) {
          if (iconSpan) iconSpan.innerHTML = '&#10074;&#10074;';
          if (textSpan) textSpan.textContent = 'Auto Transition (4.5s)';
          startAutoTour(true);
        } else {
          if (iconSpan) iconSpan.innerHTML = '&#9654;';
          if (textSpan) textSpan.textContent = 'Resume Transition';
          stopAutoTour();
        }
      });
    }

    // Reset View to India Origin Button
    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        stopAutoTour();
        navigateToCountry('INDIA');
      });
    }
  }

  // Starts Automatic Stepping between Countries
  function startAutoTour(immediateStep) {
    stopAutoTour();
    isAutoTourActive = true;

    if (immediateStep) {
      advanceTourStep();
    }

    tourTimer = setInterval(() => {
      advanceTourStep();
    }, AUTO_TOUR_INTERVAL_MS);
  }

  function stopAutoTour() {
    if (tourTimer) {
      clearInterval(tourTimer);
      tourTimer = null;
    }
  }

  function advanceTourStep() {
    if (isUserInteracting || isTransitioning) return;
    currentTourIndex = (currentTourIndex + 1) % DESTINATIONS.length;
    const nextDest = DESTINATIONS[currentTourIndex];
    navigateToCountry(nextDest.id);
  }

  // Highlights active line, pin, label, and UI status (SOLID HIGH-CONTRAST — NO GLOW EFFECTS)
  function highlightDestination(destId) {
    activeDestinationId = destId;
    const target = (destId === 'INDIA') ? INDIA_HQ : DESTINATIONS.find(d => d.id === destId);
    if (!target) return;

    // 1. Highlight Connecting Line: Active is solid 1.0 opacity, others dimmed to 0.25
    arcObjects.forEach(arc => {
      const isActive = arc.userData.id === destId;
      arc.material.opacity = isActive ? 1.0 : 0.25;
      arc.material.color.setHex(isActive ? 0x2373F4 : 0x578EF5);
      arc.material.linewidth = isActive ? 3.5 : 1.8;
      arc.material.needsUpdate = true;
    });

    // 2. Highlight 3D Pins: Active pin scales up cleanly
    pinMarkers.forEach(head => {
      const isActive = head.userData.id === destId;
      head.scale.setScalar(isActive ? 1.6 : 1.0);
      head.material.color.setHex(isActive ? 0x2373F4 : 0x65D0F4);
    });

    // 3. Highlight Floating Labels (SOLID NAVY & WHITE — NO GLOW)
    labelElements.forEach(item => {
      const isOrigin = item.id === 'INDIA';
      if (item.id === destId) {
        item.element.classList.add('label-active');
      } else {
        item.element.classList.remove('label-active');
      }
    });

    // 4. Highlight Top Country Ribbon Buttons
    const ribbonButtons = document.querySelectorAll('.country-ribbon-btn');
    ribbonButtons.forEach(btn => {
      const isActive = btn.dataset.dest === destId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 5. Update Bottom Status Bar
    const flagEl = document.getElementById('bar-dest-flag');
    const nameEl = document.getElementById('bar-dest-name');
    const transitEl = document.getElementById('bar-dest-transit');

    if (flagEl) flagEl.textContent = target.flag || '';
    if (nameEl) nameEl.textContent = target.name || '';
    if (transitEl) transitEl.textContent = target.transit || 'Direct Liner';
  }

  // ULTRA-SMOOTH SPHERICAL SLERP CAMERA TRANSITION (Constant orbital altitude)
  function navigateToCountry(destId) {
    const targetLoc = (destId === 'INDIA') ? INDIA_HQ : DESTINATIONS.find(d => d.id === destId);
    if (!targetLoc) return;

    highlightDestination(destId);

    // Compute target camera vector in spherical space
    // We position the camera slightly tilted above the country for an architectural angle
    const targetCamVec = latLonToVector3(
      Math.max(-45, Math.min(65, targetLoc.lat + 4)),
      targetLoc.lon,
      GLOBE_RADIUS * 2.85
    );

    // Build quaternions for true Spherical Slerp
    const vStart = camera.position.clone().normalize();
    const vTarget = targetCamVec.clone().normalize();

    // If already close, do nothing
    if (vStart.distanceTo(vTarget) < 0.005) return;

    const qStart = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), vStart);
    const qTarget = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), vTarget);

    const orbitDistance = GLOBE_RADIUS * 2.85;
    const startTime = performance.now();
    isTransitioning = true;

    function stepSlerp(now) {
      if (isUserInteracting) {
        isTransitioning = false;
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TRANSITION_DURATION_MS, 1.0);

      // Smooth easeInOutCubic curve
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Spherical quaternion slerp
      const qCur = qStart.clone().slerp(qTarget, ease);
      const curDir = new THREE.Vector3(0, 0, 1).applyQuaternion(qCur);

      // Maintain constant orbital distance throughout the flight
      camera.position.copy(curDir.multiplyScalar(orbitDistance));
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);

      if (progress < 1.0) {
        requestAnimationFrame(stepSlerp);
      } else {
        isTransitioning = false;
      }
    }

    requestAnimationFrame(stepSlerp);
  }

  function onWindowResize() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 620;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Render Loop
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    // Controls update with damping (NO auto-rotate)
    if (controls) {
      controls.update();
    }

    // Gentle cloud parallax drift
    if (cloudsMesh) {
      cloudsMesh.rotation.y += 0.0003;
    }

    // Cruising cargo vessels moving along the 3D connecting lines
    vesselObjects.forEach(vessel => {
      const data = vessel.userData;
      data.progress = (data.progress + data.speed) % 1.0;
      const point = data.curve.getPointAt(data.progress);
      vessel.position.copy(point);
    });

    // Update 3D-projected floating country labels
    updateLabels();

    // Render WebGL frame
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Expose to window
  window.initShipyonGlobe = initGlobe;

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
