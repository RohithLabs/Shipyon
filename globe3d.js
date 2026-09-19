/**
 * SHIPYON 3D INTERACTIVE WORLD GLOBE
 * Authentic WebGL 3D Earth model with 3D Parabolic Great-Circle Trade Arcs
 * Automatic 4-Second Country Tour | Strict Zoom Limits | High-Contrast Maritime Texture
 * Zero emojis | High-fidelity clean cartographic typography
 */

(function () {
  'use strict';

  const DESTINATIONS = [
    { id: 'DUBAI', name: 'DUBAI (UAE)', lat: 25.2048, lon: 55.2708, desc: 'Middle East Transshipment Hub (Jebel Ali)' },
    { id: 'SINGAPORE', name: 'SINGAPORE', lat: 1.3521, lon: 103.8198, desc: 'Southeast Asia Multimodal Hub' },
    { id: 'MALAYSIA', name: 'MALAYSIA', lat: 4.2105, lon: 101.9758, desc: 'Port Klang Trade Gateway' },
    { id: 'SRILANKA', name: 'SRI LANKA', lat: 7.8731, lon: 80.7718, desc: 'Colombo Feeder Port Direct Link' },
    { id: 'VIETNAM', name: 'VIETNAM', lat: 14.0583, lon: 108.2772, desc: 'Mekong Regional Distribution Hub' },
    { id: 'AUSTRALIA', name: 'AUSTRALIA', lat: -25.2744, lon: 133.7751, desc: 'Oceania Commercial Gateway (Sydney/Melbourne)' },
    { id: 'GERMANY', name: 'GERMANY', lat: 51.1657, lon: 10.4515, desc: 'European Union Gateway (Hamburg/Bremen)' },
    { id: 'USA', name: 'USA', lat: 37.0902, lon: -95.7129, desc: 'North America Atlantic & Pacific Hubs' }
  ];

  const INDIA_HQ = {
    id: 'INDIA',
    name: 'INDIA (HQ)',
    lat: 11.0168,
    lon: 76.9558, // South India / Coimbatore / Tuticorin Corridor
    desc: 'Shipyon Headquarters & Agrarian Export Core'
  };

  const GLOBE_RADIUS = 100;
  const TOUR_INTERVAL_MS = 4000; // 4 seconds interval between country hops

  let scene, camera, renderer, controls;
  let globeMesh, atmosphereMesh;
  let arcObjects = [];
  let vesselVessels = [];
  let labelElements = [];
  let rippleMesh = null;
  let animFrameId = null;

  // Auto-tour states
  let isAutoTourActive = true;
  let tourTimer = null;
  let currentTourIndex = -1;
  let userInteractionTimeout = null;
  let isUserInteracting = false;
  let isCameraTweening = false;

  // Instant embedded master texture URI (Prevents blank sphere on file:// protocol or offline)
  const FALLBACK_EARTH_DATA_URI = 'data:image/jpeg;base64,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';

  // Converts Latitude & Longitude to 3D Cartesian coordinates on sphere
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
  }

  // Initializes the 3D Scene
  function initGlobe() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container) return;

    if (animFrameId) cancelAnimationFrame(animFrameId);
    stopAutoTour();
    container.innerHTML = '';

    const width = container.clientWidth || 1100;
    const height = container.clientHeight || 650;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    const initTargetPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS * 2.3);
    camera.position.set(initTargetPos.x * 0.9, initTargetPos.y + 35, initTargetPos.z * 1.05);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls with Strict Zoom Limits & Continuous Auto-Rotation
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;

    // ALWAYS-ON AUTO-ROTATION
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.85; // Continuous smooth celestial rotation

    // STRICT ZOOM LIMITS: Prevents clipping inside the globe or zooming out into a tiny dot
    controls.enableZoom = true;
    controls.zoomSpeed = 0.75;
    controls.minDistance = 142; // Close-up view (globe fills ~80% of view, zero mesh clipping)
    controls.maxDistance = 275; // Far view (entire globe & high parabolic arcs comfortably framed)

    // Handle user interaction: rotation resumes immediately on release
    controls.addEventListener('start', () => {
      isUserInteracting = true;
      stopAutoTour();
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
    });

    controls.addEventListener('end', () => {
      isUserInteracting = false;
      controls.autoRotate = true; // Auto-rotation always active
      if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
      userInteractionTimeout = setTimeout(() => {
        if (isAutoTourActive) {
          startAutoTour(true);
        }
      }, 5000);
    });

    // 5. Balanced Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.72);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 0.78);
    sunLight.position.set(260, 180, 240);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38BDF8, 0.28);
    fillLight.position.set(-260, -100, -200);
    scene.add(fillLight);

    // 6. Earth Sphere Mesh
    const textureLoader = new THREE.TextureLoader();
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    // Step A: Load instant master texture from embedded data URI (GUARANTEES SPHERE IS NEVER BLANK)
    const instantTexture = textureLoader.load(FALLBACK_EARTH_DATA_URI, () => {
      if (renderer && scene && camera) renderer.render(scene, camera);
    });
    instantTexture.encoding = THREE.sRGBEncoding;

    const globeMat = new THREE.MeshPhongMaterial({
      map: instantTexture,
      shininess: 22,
      specular: new THREE.Color(0x1D4ED8)
    });

    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // Step B: Asynchronously upgrade to 2048x1024 high-res master file when available over HTTP
    textureLoader.load(
      'assets/bright_earth_equirect.jpg',
      (hdTex) => {
        hdTex.encoding = THREE.sRGBEncoding;
        if (globeMesh) {
          globeMesh.material.map = hdTex;
          globeMesh.material.needsUpdate = true;
          if (renderer && scene && camera) renderer.render(scene, camera);
        }
      },
      undefined,
      (err) => {
        // Embedded texture handles offline and file:// flawlessly
      }
    );

    // 7. Atmospheric Halo Rim
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.018, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.13,
      side: THREE.BackSide
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphereMesh);

    // 8. India Origin Beacon & Subtle Local Surface Ripple
    buildIndiaOriginBeacon();

    // 9. 3D Parabolic Great-Circle Bezier Arcs & Moving Cruising Vessels
    buildTradeArcs();

    // 10. Destination Pins & Projected HTML Labels
    buildDestinationPinsAndLabels(container);

    // 11. Bind UI Controls
    bindHUDControls();

    // 12. Window Resize Handler
    window.addEventListener('resize', onWindowResize, false);

    // 13. Start 4-Second Auto-Tour
    startAutoTour(false);

    // 14. Render Loop
    animate();
  }

  // Auto-Tour: Automatically change to next country every 4 seconds
  function startAutoTour(immediateStep) {
    stopAutoTour();
    isAutoTourActive = true;
    updateTourButtonState();

    if (immediateStep) {
      advanceTourStep();
    }

    tourTimer = setInterval(() => {
      advanceTourStep();
    }, TOUR_INTERVAL_MS);
  }

  function advanceTourStep() {
    if (isUserInteracting) return;
    currentTourIndex = (currentTourIndex + 1) % DESTINATIONS.length;
    const dest = DESTINATIONS[currentTourIndex];

    focusOnCorridor(dest.id, false);
    updateHUDActiveButton(dest.id);
    updateLiveTourBadge(dest);
  }

  function stopAutoTour() {
    if (tourTimer) {
      clearInterval(tourTimer);
      tourTimer = null;
    }
  }

  function updateTourButtonState() {
    const tourBtn = document.getElementById('btn-toggle-tour');
    if (tourBtn) {
      tourBtn.classList.toggle('active', isAutoTourActive);
      const span = tourBtn.querySelector('span');
      if (span) span.textContent = isAutoTourActive ? 'Auto-Tour (4s)' : 'Resume Tour';
    }
  }

  function updateHUDActiveButton(destId) {
    const navButtons = document.querySelectorAll('.globe-nav-btn');
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dest === destId);
    });
  }

  function updateLiveTourBadge(dest) {
    const badgeEl = document.getElementById('tour-badge-corridor');
    if (badgeEl && dest) {
      const idxStr = (currentTourIndex + 1) + '/' + DESTINATIONS.length;
      badgeEl.innerHTML = `[${idxStr}] <strong>${dest.name}</strong> &mdash; <span class="badge-sub">${dest.desc}</span>`;
    }
  }

  // Builds India Origin Marker & Small Subtle 3D Ripple
  function buildIndiaOriginBeacon() {
    const originPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS);

    const beaconGeo = new THREE.SphereGeometry(1.8, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.copy(originPos);
    scene.add(beaconMesh);

    const pinTopPos = originPos.clone().multiplyScalar(1.045);
    const stemGeo = new THREE.BufferGeometry().setFromPoints([originPos, pinTopPos]);
    const stemMat = new THREE.LineBasicMaterial({ color: 0xF59E0B, linewidth: 2.5 });
    const stemLine = new THREE.Line(stemGeo, stemMat);
    scene.add(stemLine);

    const headGeo = new THREE.SphereGeometry(2.4, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.copy(pinTopPos);
    scene.add(headMesh);

    // Small Subtle Ripple Ring Tangent to Surface
    const ringGeo = new THREE.RingGeometry(1.5, 3.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x15803D,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    rippleMesh = new THREE.Mesh(ringGeo, ringMat);
    rippleMesh.position.copy(originPos.clone().multiplyScalar(1.002));
    rippleMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), originPos.clone().normalize());
    scene.add(rippleMesh);
  }

  // Builds 3D Parabolic Great-Circle Arcs
  function buildTradeArcs() {
    const originPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS);
    arcObjects = [];
    vesselVessels = [];

    DESTINATIONS.forEach((dest, idx) => {
      const destPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS);
      const distance = originPos.distanceTo(destPos);

      // Parabolic altitude proportional to spherical distance
      const arcAltitude = GLOBE_RADIUS + Math.min(distance * 0.32, GLOBE_RADIUS * 0.42);
      const midPoint = new THREE.Vector3().addVectors(originPos, destPos).multiplyScalar(0.5);
      midPoint.normalize().multiplyScalar(arcAltitude);

      // Smooth 3D Quadratic Curve
      const curve = new THREE.QuadraticBezierCurve3(originPos, midPoint, destPos);
      const points = curve.getPoints(80);

      // Geometry & Gradient Colors along the 3D Arc
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const colors = [];
      const colorOrigin = new THREE.Color(0x10B981); // Emerald start at India
      const colorMid = new THREE.Color(0xF59E0B);    // Radiant gold peak
      const colorDest = new THREE.Color(0x0284C7);   // Luminous sky blue touchdown

      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const c = new THREE.Color();
        if (t < 0.5) {
          c.lerpColors(colorOrigin, colorMid, t * 2);
        } else {
          c.lerpColors(colorMid, colorDest, (t - 0.5) * 2);
        }
        colors.push(c.r, c.g, c.b);
      }
      arcGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const arcMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        linewidth: 2.2
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcLine.userData = { id: dest.id, curve: curve, baseOpacity: 0.85 };
      scene.add(arcLine);
      arcObjects.push(arcLine);

      // Animated Cruising Vessel (Glowing Satellite Cargo Packet)
      const vesselGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const vesselMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
      const vesselMesh = new THREE.Mesh(vesselGeo, vesselMat);
      vesselMesh.userData = {
        curve: curve,
        progress: (idx * 0.12) % 1.0,
        speed: 0.0022 + (idx % 3) * 0.0004
      };
      scene.add(vesselMesh);
      vesselVessels.push(vesselMesh);
    });
  }

  // Builds Destination Pins and Clean Unboxed 3D Projected Labels
  function buildDestinationPinsAndLabels(container) {
    const labelsOverlay = document.getElementById('globe-labels-overlay');
    if (!labelsOverlay) return;
    labelsOverlay.innerHTML = '';
    labelElements = [];

    const allLocations = [INDIA_HQ, ...DESTINATIONS];

    allLocations.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS);
      const isIndia = loc.id === 'INDIA';

      if (!isIndia) {
        const pinGeo = new THREE.SphereGeometry(1.5, 12, 12);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x0284C7 });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(pos);
        scene.add(pinMesh);

        const pinTop = pos.clone().multiplyScalar(1.035);
        const stemGeo = new THREE.BufferGeometry().setFromPoints([pos, pinTop]);
        const stemMat = new THREE.LineBasicMaterial({ color: 0x0B1E36, linewidth: 2 });
        const stem = new THREE.Line(stemGeo, stemMat);
        scene.add(stem);

        const headGeo = new THREE.SphereGeometry(2.0, 12, 12);
        const headMat = new THREE.MeshBasicMaterial({ color: 0x10B981 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.copy(pinTop);
        scene.add(head);
      }

      const labelEl = document.createElement('div');
      labelEl.className = `globe-projected-label ${isIndia ? 'label-origin' : ''}`;
      labelEl.dataset.dest = loc.id;
      labelEl.innerHTML = `
        <span class="label-dot"></span>
        <span class="label-text">${loc.name}</span>
      `;

      labelEl.addEventListener('click', () => {
        if (loc.id !== 'INDIA') {
          const idx = DESTINATIONS.findIndex(d => d.id === loc.id);
          if (idx !== -1) currentTourIndex = idx;
        }
        focusOnCorridor(loc.id);
        updateHUDActiveButton(loc.id);
        if (loc.id !== 'INDIA') {
          const d = DESTINATIONS.find(item => item.id === loc.id);
          if (d) updateLiveTourBadge(d);
        }

        const modal = document.getElementById('quote-modal-overlay');
        const destInput = document.getElementById('quote-destination');
        if (loc.id !== 'INDIA' && modal && destInput) {
          destInput.value = loc.name;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      labelsOverlay.appendChild(labelEl);

      labelElements.push({
        element: labelEl,
        worldPos: pos.clone().multiplyScalar(1.045),
        id: loc.id
      });
    });
  }

  // Updates Projected 2D Screen Positions of Labels each frame
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

  // Binds HUD Buttons
  function bindHUDControls() {
    const navButtons = document.querySelectorAll('.globe-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const destId = btn.dataset.dest;
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (destId === 'ALL') {
          focusOnCorridor('ALL');
          stopAutoTour();
          isAutoTourActive = false;
          updateTourButtonState();
        } else {
          const idx = DESTINATIONS.findIndex(d => d.id === destId);
          if (idx !== -1) {
            currentTourIndex = idx;
            updateLiveTourBadge(DESTINATIONS[idx]);
          }
          focusOnCorridor(destId);

          // Restart 4-second tour from this country after brief pause
          stopAutoTour();
          if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
          userInteractionTimeout = setTimeout(() => {
            if (isAutoTourActive) startAutoTour(false);
          }, 5000);
        }
      });
    });

    const tourBtn = document.getElementById('btn-toggle-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => {
        isAutoTourActive = !isAutoTourActive;
        if (isAutoTourActive) {
          startAutoTour(true);
        } else {
          stopAutoTour();
          updateTourButtonState();
        }
      });
    }

    const rotateBtn = document.getElementById('btn-toggle-rotate');
    if (rotateBtn) {
      rotateBtn.classList.add('active');
      rotateBtn.addEventListener('click', () => {
        controls.autoRotate = true;
        rotateBtn.classList.add('active');
      });
    }

    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        focusOnCorridor('INDIA');
        controls.autoRotate = true; // Always keep auto-rotate on!
        const navBtns = document.querySelectorAll('.globe-nav-btn');
        navBtns.forEach(b => b.classList.remove('active'));
      });
    }
  }

  // Smoothly Pivots the Camera toward target Country or India
  function focusOnCorridor(destId) {
    let targetLoc = INDIA_HQ;
    if (destId !== 'ALL' && destId !== 'INDIA') {
      const match = DESTINATIONS.find(d => d.id === destId);
      if (match) targetLoc = match;
    }

    // Camera target vector positioned in front of target location
    const targetCamVec = latLonToVector3(targetLoc.lat, targetLoc.lon, GLOBE_RADIUS * 2.2);

    // Highlight active 3D arc
    arcObjects.forEach(arc => {
      if (destId === 'ALL') {
        arc.material.opacity = 0.85;
      } else if (arc.userData.id === destId) {
        arc.material.opacity = 1.0;
      } else {
        arc.material.opacity = 0.22;
      }
    });

    // Smooth Tween using requestAnimationFrame
    const startCamPos = camera.position.clone();
    const duration = 1200; // Smooth 1.2-second transition
    const startTime = performance.now();
    isCameraTweening = true;

    function stepTween(now) {
      if (isUserInteracting) {
        isCameraTweening = false;
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startCamPos, targetCamVec, ease);
      controls.update();

      if (progress < 1.0) {
        requestAnimationFrame(stepTween);
      } else {
        isCameraTweening = false;
      }
    }
    requestAnimationFrame(stepTween);
  }

  function onWindowResize() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 650;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Main Render Loop
  let rippleScale = 1.0;
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    // 1. Controls update (Always keep auto-rotation actively running)
    if (controls) {
      controls.autoRotate = true;
      controls.update();
    }

    // 2. Small India Ripple Animation (Delicate 3D Pulse)
    if (rippleMesh) {
      rippleScale += 0.008;
      if (rippleScale > 2.4) rippleScale = 1.0;
      rippleMesh.scale.set(rippleScale, rippleScale, rippleScale);
      rippleMesh.material.opacity = Math.max(0, 0.85 * (1 - (rippleScale - 1.0) / 1.4));
    }

    // 3. Move Cruising Cargo Vessels along 3D Arcs
    vesselVessels.forEach(vessel => {
      const data = vessel.userData;
      data.progress = (data.progress + data.speed) % 1.0;
      const point = data.curve.getPointAt(data.progress);
      vessel.position.copy(point);
    });

    // 4. Update 2D Projected Screen Labels
    updateLabels();

    // 5. Render WebGL Scene
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Global Exports for Initialization
  window.initShipyonGlobe = initGlobe;

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
