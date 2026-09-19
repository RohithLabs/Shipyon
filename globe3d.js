/**
 * SHIPYON 3D INTERACTIVE WORLD GLOBE
 * Authentic WebGL 3D Earth model with 3D Parabolic Great-Circle Trade Arcs
 * Zero emojis | High-fidelity clean cartographic typography
 */

(function () {
  'use strict';

  const DESTINATIONS = [
    { id: 'USA', name: 'USA', lat: 37.0902, lon: -95.7129, desc: 'North America Atlantic & Pacific Hubs' },
    { id: 'GERMANY', name: 'GERMANY', lat: 51.1657, lon: 10.4515, desc: 'European Union Gateway (Hamburg/Bremen)' },
    { id: 'DUBAI', name: 'DUBAI (UAE)', lat: 25.2048, lon: 55.2708, desc: 'Middle East Transshipment Hub (Jebel Ali)' },
    { id: 'SRILANKA', name: 'SRI LANKA', lat: 7.8731, lon: 80.7718, desc: 'Colombo Feeder Port Direct Link' },
    { id: 'MALAYSIA', name: 'MALAYSIA', lat: 4.2105, lon: 101.9758, desc: 'Port Klang Trade Gateway' },
    { id: 'SINGAPORE', name: 'SINGAPORE', lat: 1.3521, lon: 103.8198, desc: 'Southeast Asia Multimodal Hub' },
    { id: 'VIETNAM', name: 'VIETNAM', lat: 14.0583, lon: 108.2772, desc: 'Mekong Regional Distribution' },
    { id: 'AUSTRALIA', name: 'AUSTRALIA', lat: -25.2744, lon: 133.7751, desc: 'Oceania Commercial Gateway (Sydney/Melbourne)' }
  ];

  const INDIA_HQ = {
    id: 'INDIA',
    name: 'INDIA (HQ)',
    lat: 11.0168,
    lon: 76.9558, // South India / Coimbatore / Tuticorin Corridor
    desc: 'Shipyon Headquarters & Agrarian Export Core'
  };

  const GLOBE_RADIUS = 100;
  let scene, camera, renderer, controls;
  let globeMesh, atmosphereMesh;
  let arcObjects = [];
  let vesselVessels = [];
  let labelElements = [];
  let rippleMesh = null;
  let isAutoRotating = true;
  let animFrameId = null;

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

    // Clean up any prior instance
    if (animFrameId) cancelAnimationFrame(animFrameId);
    container.innerHTML = '';

    const width = container.clientWidth || 1100;
    const height = container.clientHeight || 650;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    // Initial view positioned to feature South India and Indian Ocean
    const initTargetPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS * 2.6);
    camera.position.set(initTargetPos.x * 0.9, initTargetPos.y + 40, initTargetPos.z * 1.1);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = GLOBE_RADIUS * 1.4;
    controls.maxDistance = GLOBE_RADIUS * 3.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.7;

    // Pause auto-rotation on user drag
    controls.addEventListener('start', () => {
      isAutoRotating = false;
      updateAutoRotateButtonState();
    });

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 0.85);
    sunLight.position.set(300, 200, 300);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xE0F2FE, 0.4);
    fillLight.position.set(-300, -100, -200);
    scene.add(fillLight);

    // 6. Earth Sphere Mesh
    const textureLoader = new THREE.TextureLoader();
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    // Load bright equirectangular texture (with fallback)
    const earthTexture = textureLoader.load(
      'assets/bright_earth_equirect.jpg',
      () => { renderer.render(scene, camera); },
      undefined,
      () => {
        // Fallback to NASA satellite texture if custom texture is unavailable
        textureLoader.load('assets/earth_atmos_2048.jpg', (fallbackTex) => {
          if (globeMesh) globeMesh.material.map = fallbackTex;
        });
      }
    );

    const globeMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 14,
      specular: new THREE.Color(0x38BDF8)
    });

    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // 7. Atmospheric Halo
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.018, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphereMesh);

    // 8. India Origin Beacon & Subtle Local Ripple
    buildIndiaOriginBeacon();

    // 9. 3D Parabolic Great-Circle Arcs & Moving Cargo Vessels
    buildTradeArcs();

    // 10. Destination Pins & Projected HTML Labels
    buildDestinationPinsAndLabels(container);

    // 11. Bind UI Controls
    bindHUDControls();

    // 12. Window Resize Handler
    window.addEventListener('resize', onWindowResize, false);

    // 13. Render Loop
    animate();
  }

  // Builds India Origin Marker & Small Subtle 3D Ripple
  function buildIndiaOriginBeacon() {
    const originPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS);

    // 3D Pin Beacon Base
    const beaconGeo = new THREE.SphereGeometry(1.8, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.copy(originPos);
    scene.add(beaconMesh);

    // Outer Pin Stem
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

  // Builds 3D Parabolic Great-Circle Arcs (Ultra-Clean, Elegant Bezier Trajectories)
  function buildTradeArcs() {
    const originPos = latLonToVector3(INDIA_HQ.lat, INDIA_HQ.lon, GLOBE_RADIUS);

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

    // All destinations + India HQ
    const allLocations = [INDIA_HQ, ...DESTINATIONS];

    allLocations.forEach((loc) => {
      const pos = latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS);
      const isIndia = loc.id === 'INDIA';

      // 3D Pin Point on Sphere
      if (!isIndia) {
        const pinGeo = new THREE.SphereGeometry(1.5, 12, 12);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x0284C7 });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(pos);
        scene.add(pinMesh);

        // Small stem
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

      // Clean Unboxed HTML Label
      const labelEl = document.createElement('div');
      labelEl.className = `globe-projected-label ${isIndia ? 'label-origin' : ''}`;
      labelEl.dataset.dest = loc.id;
      labelEl.innerHTML = `
        <span class="label-dot"></span>
        <span class="label-text">${loc.name}</span>
      `;

      labelEl.addEventListener('click', () => {
        focusOnCorridor(loc.id);
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
      // Horizon Culling: Check if facing camera
      const cameraToPoint = wp.clone().sub(camera.position).normalize();
      const surfaceNormal = wp.clone().normalize();
      const dot = cameraToPoint.dot(surfaceNormal);

      if (dot > 0.05) {
        // Point is on the back side of the Earth sphere
        item.element.style.opacity = '0';
        item.element.style.pointerEvents = 'none';
        return;
      }

      // Project 3D coordinate to 2D screen coordinate
      wp.project(camera);

      const x = (wp.x * widthHalf) + widthHalf;
      const y = -(wp.y * heightHalf) + heightHalf;

      item.element.style.left = `${x.toFixed(1)}px`;
      item.element.style.top = `${y.toFixed(1)}px`;
      item.element.style.opacity = '1';
      item.element.style.pointerEvents = 'auto';
    });
  }

  // Binds HUD Buttons to smoothly pivot 3D Camera to Corridors
  function bindHUDControls() {
    const navButtons = document.querySelectorAll('.globe-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const destId = btn.dataset.dest;
        focusOnCorridor(destId);
      });
    });

    const rotateBtn = document.getElementById('btn-toggle-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        controls.autoRotate = isAutoRotating;
        updateAutoRotateButtonState();
      });
    }

    const resetBtn = document.getElementById('btn-reset-view');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        focusOnCorridor('INDIA');
      });
    }
  }

  function updateAutoRotateButtonState() {
    const rotateBtn = document.getElementById('btn-toggle-rotate');
    if (rotateBtn) {
      rotateBtn.classList.toggle('active', isAutoRotating);
    }
    if (controls) controls.autoRotate = isAutoRotating;
  }

  // Smoothly Pivots the Camera toward target Country or India
  function focusOnCorridor(destId) {
    let targetLoc = INDIA_HQ;
    if (destId !== 'ALL' && destId !== 'INDIA') {
      const match = DESTINATIONS.find(d => d.id === destId);
      if (match) targetLoc = match;
    }

    // Target Camera Position along the spherical normal vector
    const targetCamVec = latLonToVector3(targetLoc.lat, targetLoc.lon, GLOBE_RADIUS * 2.3);

    // Highlight active 3D arc
    arcObjects.forEach(arc => {
      if (destId === 'ALL') {
        arc.material.opacity = 0.85;
      } else if (arc.userData.id === destId) {
        arc.material.opacity = 1.0;
      } else {
        arc.material.opacity = 0.18;
      }
    });

    // Smooth Tween using requestAnimationFrame
    const startCamPos = camera.position.clone();
    const duration = 1000;
    const startTime = performance.now();

    function stepTween(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startCamPos, targetCamVec, ease);
      controls.update();

      if (progress < 1.0) {
        requestAnimationFrame(stepTween);
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

    // 1. Controls update (auto-rotate and damping)
    if (controls) controls.update();

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
