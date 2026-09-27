/**
 * Shipyon Realistic 3D Interactive World Globe
 * ============================================================================
 * - Authentic NASA Blue Marble Earth with high-resolution continents & oceans
 * - 9 Geographically accurate trade destinations:
 *     1. 🇮🇳 India (Origin)
 *     2. 🇦🇪 Dubai (UAE)
 *     3. 🇸🇬 Singapore
 *     4. 🇲🇾 Malaysia
 *     5. 🇱🇰 Sri Lanka
 *     6. 🇻🇳 Vietnam
 *     7. 🇦🇺 Australia
 *     8. 🇩🇪 Germany — European Market
 *     9. 🇺🇸 USA — North America Gateway
 * - Glowing location dots, animated pulse beacons, crisp leader lines & rounded badge cards
 * - Main sequential global trade chain (India -> UAE -> Singapore -> Malaysia -> Sri Lanka -> Vietnam -> Australia -> Germany -> USA)
 * - Direct export corridors from India with animated logistics photon particles
 * - Emphasized route by default: India -> USA
 * - Full bi-directional synchronization between globe markers and ribbon buttons
 * - OrbitControls with auto-rotation, mouse drag, touch drag, and zoom bounds
 * ============================================================================
 */

(function () {
  'use strict';

  // Constants
  const GLOBE_RADIUS = 100;
  const CAMERA_DISTANCE = 310;
  const AUTO_ROTATE_SPEED = 0.45;

  // 9 Exact Destinations with Geographically Correct Latitude & Longitude
  const DESTINATIONS = {
    INDIA: {
      id: 'INDIA',
      name: 'India (Origin)',
      shortName: 'India (Origin)',
      flag: '🇮🇳',
      lat: 13.0827,
      lon: 80.2707, // South Indian Sourcing Hub (Chennai / Tuticorin / Cochin)
      offset: { x: -70, y: -45 },
      focusRotY: -170 * (Math.PI / 180),
      transit: 'Agro-Industrial Origin • Tuticorin & Cochin Gateways',
      isOrigin: true
    },
    DUBAI: {
      id: 'DUBAI',
      name: 'Dubai (UAE)',
      shortName: 'Dubai (UAE)',
      flag: '🇦🇪',
      lat: 25.2048,
      lon: 55.2708,
      offset: { x: -70, y: -40 },
      focusRotY: -155 * (Math.PI / 180),
      transit: '3.5 Days Express Gulf Liner • Jebel Ali Port'
    },
    SINGAPORE: {
      id: 'SINGAPORE',
      name: 'Singapore',
      shortName: 'Singapore',
      flag: '🇸🇬',
      lat: 1.3521,
      lon: 103.8198,
      offset: { x: 60, y: 38 },
      focusRotY: 178 * (Math.PI / 180),
      transit: '5 Days Direct Strait Feeder • Port of Singapore'
    },
    MALAYSIA: {
      id: 'MALAYSIA',
      name: 'Malaysia',
      shortName: 'Malaysia',
      flag: '🇲🇾',
      lat: 3.1390,
      lon: 101.6869,
      offset: { x: 65, y: -30 },
      focusRotY: 178 * (Math.PI / 180),
      transit: '6 Days Direct Maritime Corridor • Port Klang Hub'
    },
    SRILANKA: {
      id: 'SRILANKA',
      name: 'Sri Lanka',
      shortName: 'Sri Lanka',
      flag: '🇱🇰',
      lat: 6.9271,
      lon: 79.8612,
      offset: { x: -65, y: 45 },
      focusRotY: -170 * (Math.PI / 180),
      transit: '1.5 Days Transshipment Hub • Port of Colombo'
    },
    VIETNAM: {
      id: 'VIETNAM',
      name: 'Vietnam',
      shortName: 'Vietnam',
      flag: '🇻🇳',
      lat: 10.8231,
      lon: 106.6297,
      offset: { x: 65, y: -50 },
      focusRotY: 176 * (Math.PI / 180),
      transit: '8 Days ASEAN Direct Route • Ho Chi Minh Gateway'
    },
    AUSTRALIA: {
      id: 'AUSTRALIA',
      name: 'Australia',
      shortName: 'Australia',
      flag: '🇦🇺',
      lat: -33.8688,
      lon: 151.2093,
      offset: { x: 70, y: 40 },
      focusRotY: 145 * (Math.PI / 180),
      transit: '14 Days Indo-Pacific Express • Sydney & Melbourne'
    },
    AFRICA: {
      id: 'AFRICA',
      name: 'Africa — Trans-Indian Corridor',
      shortName: 'Africa',
      flag: '🌍',
      lat: -29.8587,
      lon: 31.0218,
      offset: { x: -75, y: 40 },
      focusRotY: -140 * (Math.PI / 180),
      transit: '12 Days Direct Maritime Liner • Durban & Mombasa Gateways'
    },
    GERMANY: {
      id: 'GERMANY',
      name: 'Germany — European Market',
      shortName: 'Germany',
      flag: '🇩🇪',
      lat: 53.5511,
      lon: 9.9937,
      offset: { x: -80, y: -45 },
      focusRotY: -122 * (Math.PI / 180),
      transit: '18 Days European Gateway • Port of Hamburg'
    },
    USA: {
      id: 'USA',
      name: 'USA — North America Gateway',
      shortName: 'USA',
      flag: '🇺🇸',
      lat: 40.7128,
      lon: -74.0060,
      offset: { x: -85, y: -45 },
      focusRotY: -25 * (Math.PI / 180),
      transit: '22 Days Transatlantic • New York & Newark Gateway'
    }
  };

  // Main Sequential Route:
  // India → UAE → Singapore → Malaysia → Sri Lanka → Vietnam → Australia → Africa → Germany → USA
  const SEQUENTIAL_CHAIN = [
    'INDIA',
    'DUBAI',
    'SINGAPORE',
    'MALAYSIA',
    'SRILANKA',
    'VIETNAM',
    'AUSTRALIA',
    'AFRICA',
    'GERMANY',
    'USA'
  ];

  // Global Engine State
  let scene, camera, renderer, controls;
  let earthGroup;
  let globeMesh, atmosphereMesh;
  let activeDestId = 'USA'; // Default selected route: India -> USA (Emphasized)
  let lastUserInteraction = 0;
  let animFrameId = null;
  let targetRotationY = null;
  let targetTiltX = 0;
  let targetShiftX = 0;
  let targetShiftY = 0;
  let isEntranceActive = false;

  // Visual collections
  const markerMeshes = [];
  const beaconRings = [];
  const directCorridorLines = {}; // destId -> { line, curve, material }
  const chainRouteArcs = [];
  const photonParticles = [];
  let badgeElements = {};
  let svgLineElements = {};

  // Conversion: (lat, lon) -> 3D Vector3
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
  }

  // Create elevated 3D Great-Circle Arc between two points on the sphere
  function createGreatCircleArc(p1, p2, radius, isEmphasized = false, customColor = null) {
    const dist = p1.distanceTo(p2);
    const maxAlt = radius + Math.min(dist * 0.26, radius * 0.38);
    const points = [];
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const v = new THREE.Vector3().lerpVectors(p1, p2, t).normalize();
      const alt = radius + Math.sin(t * Math.PI) * (maxAlt - radius);
      v.multiplyScalar(alt);
      points.push(v);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const baseColor = customColor ? customColor : (isEmphasized ? 0x10B981 : 0x059669);
    const material = new THREE.LineDashedMaterial({
      color: baseColor,
      dashSize: isEmphasized ? 5 : 3.5,
      gapSize: 2.2,
      transparent: true,
      opacity: isEmphasized ? 0.95 : 0.35,
      linewidth: isEmphasized ? 2.5 : 1.2
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return { line, curve, points, material };
  }

  // Initialize the Realistic 3D Globe
  function initGlobe() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container) return;

    container.innerHTML = '';

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    // 1. Three.js Scene
    scene = new THREE.Scene();

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 10, CAMERA_DISTANCE);

    // 3. WebGL Renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL init fallback:', err);
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#064E3B;font-weight:700;">Global Maritime Corridors Active</div>';
      return;
    }

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = true;
      controls.minDistance = GLOBE_RADIUS * 1.5;
      controls.maxDistance = GLOBE_RADIUS * 4.0;
      controls.enablePan = false;
      controls.autoRotate = false; // We rotate earthGroup directly on its polar axis

      controls.addEventListener('start', () => {
        lastUserInteraction = Date.now();
        targetRotationY = null;
      });
      controls.addEventListener('change', () => {
        lastUserInteraction = Date.now();
      });
      controls.addEventListener('end', () => {
        lastUserInteraction = Date.now();
      });
    }

    // 5. Lighting: Crisp, uniform solar lighting + subtle fill
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.05);
    sunLight.position.set(200, 140, 220);
    scene.add(sunLight);

    const softFillLight = new THREE.DirectionalLight(0xE0F2FE, 0.40);
    softFillLight.position.set(-200, -80, -200);
    scene.add(softFillLight);

    // 6. Master Earth Group
    earthGroup = new THREE.Group();
    // Default initial orientation: Focus on USA corridor
    earthGroup.rotation.y = DESTINATIONS.USA.focusRotY;
    scene.add(earthGroup);

    // 7. Realistic Earth Sphere Texture
    const textureLoader = new THREE.TextureLoader();
    const earthMapTexture = textureLoader.load('assets/earth_realistic_4k.jpg', () => {
      if (renderer) renderer.render(scene, camera);
    });
    earthMapTexture.encoding = THREE.sRGBEncoding;
    earthMapTexture.generateMipmaps = true;

    let earthSpecularMap = null;
    let earthNormalMap = null;
    try {
      earthSpecularMap = textureLoader.load('assets/earth_specular_2048.jpg');
      earthNormalMap = textureLoader.load('assets/earth_normal_2048.jpg');
    } catch (e) {}

    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const globeMat = new THREE.MeshPhongMaterial({
      map: earthMapTexture,
      specularMap: earthSpecularMap,
      specular: new THREE.Color(0x182838), // Soft ocean specular without harsh white glare
      shininess: 35,
      normalMap: earthNormalMap,
      normalScale: new THREE.Vector2(0.35, 0.35)
    });

    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    earthGroup.add(globeMesh);

    // 8. Soft Luminous Atmospheric Rim
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.014, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          gl_FragColor = vec4(0.06, 0.72, 0.50, 1.0) * intensity * 0.40;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosphereMesh);

    // 9. Build Geographic Country Markers
    buildCountryMarkers();

    // 10. Build Sequential Global Chain Route
    buildSequentialRoute();

    // 11. Build Direct Export Corridors from India
    buildDirectCorridors();

    // 12. Build Logistics Photon Particles
    initPhotonParticles();

    // 13. Build HTML Overlay Callouts & SVG Leader Lines
    buildHtmlBadgesAndSvgLines(container.parentElement);

    // 14. Bind UI Click Interactions
    setupInteractions();

    // 15. Initial State: Highlight USA corridor by default
    selectDestination('USA', false);

    // 16. Window / Container Resize Handling
    window.addEventListener('resize', onWindowResize);

    // 17. Start Animation Loop
    animate();
  }

  // Build Surface Location Dots & Pulse Rings
  function buildCountryMarkers() {
    const dotGeo = new THREE.SphereGeometry(1.6, 16, 16);

    Object.keys(DESTINATIONS).forEach((destId) => {
      const dest = DESTINATIONS[destId];
      const pos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS * 1.003);

      const isOrigin = dest.isOrigin;
      const dotColor = isOrigin ? 0xF59E0B : 0x10B981;
      const dotMat = new THREE.MeshBasicMaterial({
        color: dotColor,
        transparent: true,
        opacity: 0.95
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = { destId: destId };
      earthGroup.add(dotMesh);
      markerMeshes.push(dotMesh);

      // Radar Pulse Beacon Ring on surface
      const ringGeo = new THREE.RingGeometry(1.4, 2.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: dotColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize());
      ringMesh.userData = {
        destId: destId,
        phase: Math.random() * Math.PI
      };
      earthGroup.add(ringMesh);
      beaconRings.push(ringMesh);
    });
  }

  // Build Sequential Global Chain Route:
  // India → UAE → Singapore → Malaysia → Sri Lanka → Vietnam → Australia → Germany → USA
  function buildSequentialRoute() {
    for (let i = 0; i < SEQUENTIAL_CHAIN.length - 1; i++) {
      const fromId = SEQUENTIAL_CHAIN[i];
      const toId = SEQUENTIAL_CHAIN[i + 1];
      const p1 = latLonToVector3(DESTINATIONS[fromId].lat, DESTINATIONS[fromId].lon, GLOBE_RADIUS);
      const p2 = latLonToVector3(DESTINATIONS[toId].lat, DESTINATIONS[toId].lon, GLOBE_RADIUS);

      const arc = createGreatCircleArc(p1, p2, GLOBE_RADIUS, false, 0x059669);
      arc.material.opacity = 0.32;
      earthGroup.add(arc.line);
      chainRouteArcs.push(arc);
    }
  }

  // Build Direct Corridors from India (Origin) to each trade partner
  function buildDirectCorridors() {
    const origin = DESTINATIONS.INDIA;
    const originPos = latLonToVector3(origin.lat, origin.lon, GLOBE_RADIUS);

    Object.keys(DESTINATIONS).forEach((destId) => {
      if (destId === 'INDIA') return;
      const dest = DESTINATIONS[destId];
      const destPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS);

      const isUSA = (destId === 'USA');
      const arc = createGreatCircleArc(originPos, destPos, GLOBE_RADIUS, isUSA);
      earthGroup.add(arc.line);

      directCorridorLines[destId] = arc;
    });
  }

  // Glowing Moving Photon Particles along Active Trade Corridors
  function initPhotonParticles() {
    // Photons on active corridor
    const particleGeo = new THREE.SphereGeometry(1.3, 12, 12);
    for (let i = 0; i < 6; i++) {
      const particleMat = new THREE.MeshBasicMaterial({
        color: 0x34D399,
        transparent: true,
        opacity: 0.95
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.visible = false;
      earthGroup.add(particle);
      photonParticles.push({
        mesh: particle,
        progress: (i / 6),
        speed: 0.20 + (i % 2) * 0.05
      });
    }

    // Additional subtle photons along sequential global network chain
    for (let i = 0; i < chainRouteArcs.length; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x6EE7B7,
        transparent: true,
        opacity: 0.75
      });
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), pMat);
      earthGroup.add(p);
      photonParticles.push({
        mesh: p,
        progress: Math.random(),
        speed: 0.12,
        fixedArc: chainRouteArcs[i]
      });
    }
  }

  // Build HTML Badges and SVG Leader Lines
  function buildHtmlBadgesAndSvgLines(wrapper) {
    if (!wrapper) return;

    // SVG layer for leader lines
    let svgOverlay = document.getElementById('globe-svg-lines');
    if (!svgOverlay) {
      svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgOverlay.id = 'globe-svg-lines';
      svgOverlay.className = 'globe-svg-leader-lines';
      wrapper.appendChild(svgOverlay);
    }
    svgOverlay.innerHTML = '';

    const width = wrapper.clientWidth || 900;
    const height = wrapper.clientHeight || 560;
    svgOverlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgOverlay.setAttribute('width', width);
    svgOverlay.setAttribute('height', height);

    // HTML Labels overlay
    let labelsOverlay = document.getElementById('globe-labels-overlay');
    if (!labelsOverlay) {
      labelsOverlay = document.createElement('div');
      labelsOverlay.id = 'globe-labels-overlay';
      labelsOverlay.className = 'globe-labels-overlay';
      wrapper.appendChild(labelsOverlay);
    }
    labelsOverlay.innerHTML = '';

    badgeElements = {};
    svgLineElements = {};

    Object.keys(DESTINATIONS).forEach((destId) => {
      const dest = DESTINATIONS[destId];

      // A. SVG Leader Line (Clean high-contrast emerald pointer)
      const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      svgLine.setAttribute('stroke', '#059669');
      svgLine.setAttribute('stroke-width', '1.8');
      svgLine.setAttribute('stroke-dasharray', '4 3');
      svgLine.setAttribute('stroke-linecap', 'round');
      svgOverlay.appendChild(svgLine);
      svgLineElements[destId] = svgLine;

      // B. HTML Callout Badge Card (Rounded card matching website aesthetic)
      const badge = document.createElement('div');
      badge.className = 'globe-country-badge' + (dest.isOrigin ? ' badge-origin' : '');
      badge.dataset.dest = destId;
      badge.innerHTML = `
        <span class="badge-flag">${dest.flag}</span>
        <span class="badge-name">${dest.name}</span>
      `;
      labelsOverlay.appendChild(badge);
      badgeElements[destId] = badge;

      // Click on badge selects destination
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        selectDestination(destId, true);
      });
    });
  }

  // Handle User Clicks & Dynamic Proximity on Country Ribbon Buttons and Canvas
  function setupInteractions() {
    // 1. Ribbon Buttons & Corridor Chips & Floating Ambient Labels
    const ribbonButtons = document.querySelectorAll('.country-ribbon-btn, .gtn-floating-dest');
    ribbonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const destId = btn.getAttribute('data-dest');
        if (destId && DESTINATIONS[destId]) {
          selectDestination(destId, true);
        }
      });
    });

    // 2. Click Raycaster on canvas for 3D destination markers
    if (renderer && renderer.domElement) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markerMeshes);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.destId) {
            selectDestination(hit.userData.destId, true);
          }
        }
      });

      // 3. Dynamic Cursor Proximity & Trade Route Brightening
      setupCanvasProximity(raycaster, mouse);
    }
  }

  // Dynamic Cursor Proximity Detection: Brightens Trade Routes & Reacts Nodes
  let hoveredDestId = null;
  function setupCanvasProximity(raycaster, mouse) {
    if (!renderer || !renderer.domElement) return;

    renderer.domElement.addEventListener('mousemove', (event) => {
      lastUserInteraction = Date.now();
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Subtle tilt & shift toward cursor while on canvas
      targetTiltX = -mouse.y * 0.14;
      targetShiftX = mouse.x * 15;
      targetShiftY = mouse.y * 10;

      raycaster.setFromCamera(mouse, camera);

      // A. Check Raycast against Destination Nodes
      const markerHits = raycaster.intersectObjects(markerMeshes);
      if (markerHits.length > 0) {
        const hit = markerHits[0].object;
        const destId = hit.userData.destId;
        if (destId && DESTINATIONS[destId]) {
          if (hoveredDestId !== destId) {
            hoveredDestId = destId;
            hit.scale.set(1.5, 1.5, 1.5);

            // Brighten this corridor line
            if (directCorridorLines[destId]) {
              directCorridorLines[destId].material.color.setHex(0x10B981);
              directCorridorLines[destId].material.opacity = 1.0;
              directCorridorLines[destId].material.linewidth = 3.2;
            }

            // Trigger custom cursor tooltip with destination name
            if (window.setShipyonGlobeCursor) {
              const destName = DESTINATIONS[destId].shortName || DESTINATIONS[destId].name;
              window.setShipyonGlobeCursor('destination', { destName: destName.toUpperCase() });
            }

            // Sync with ambient floating label
            const ambLabel = document.querySelector(`.gtn-floating-dest[data-dest="${destId}"]`);
            if (ambLabel) ambLabel.classList.add('active');
          }
          return;
        }
      } else {
        if (hoveredDestId) {
          const prevMarker = markerMeshes.find(m => m.userData.destId === hoveredDestId);
          if (prevMarker) prevMarker.scale.set(1.0, 1.0, 1.0);
          const ambLabel = document.querySelector(`.gtn-floating-dest[data-dest="${hoveredDestId}"]`);
          if (ambLabel && hoveredDestId !== activeDestId) ambLabel.classList.remove('active');
          hoveredDestId = null;
        }
      }

      // B. Check Proximity to Direct Corridor Route Curves
      const corridorLines = Object.values(directCorridorLines).map(c => c.line);
      const routeHits = raycaster.intersectObjects(corridorLines);
      if (routeHits.length > 0) {
        const hitLine = routeHits[0].object;
        let routeDestId = null;
        for (const [id, c] of Object.entries(directCorridorLines)) {
          if (c.line === hitLine) {
            routeDestId = id;
            break;
          }
        }
        if (routeDestId) {
          directCorridorLines[routeDestId].material.color.setHex(0x34D399);
          directCorridorLines[routeDestId].material.opacity = 1.0;
          directCorridorLines[routeDestId].material.linewidth = 3.2;

          // Pulse destination node
          const targetMarker = markerMeshes.find(m => m.userData.destId === routeDestId);
          if (targetMarker) targetMarker.scale.set(1.3, 1.3, 1.3);

          if (window.setShipyonGlobeCursor) {
            window.setShipyonGlobeCursor('route');
          }
          return;
        }
      } else {
        // Reset corridor lines to their active/default highlighted styles
        updateCorridorLineStyles();
        if (window.setShipyonGlobeCursor) {
          window.setShipyonGlobeCursor('globe');
        }
      }
    });

    renderer.domElement.addEventListener('mouseleave', () => {
      if (hoveredDestId) {
        const prevMarker = markerMeshes.find(m => m.userData.destId === hoveredDestId);
        if (prevMarker) prevMarker.scale.set(1.0, 1.0, 1.0);
        hoveredDestId = null;
      }
      markerMeshes.forEach(m => m.scale.set(1.0, 1.0, 1.0));
      updateCorridorLineStyles();
    });
  }

  // Update Corridor Line Appearance based on Active Destination
  function updateCorridorLineStyles() {
    Object.keys(directCorridorLines).forEach((id) => {
      const corridor = directCorridorLines[id];
      const isCur = (id === activeDestId);
      const isUSA = (id === 'USA');

      if (isCur) {
        corridor.material.color.setHex(0x10B981);
        corridor.material.opacity = 0.98;
        corridor.material.dashSize = 6;
        corridor.material.linewidth = 2.8;
      } else if (isUSA) {
        corridor.material.color.setHex(0x059669);
        corridor.material.opacity = 0.55;
        corridor.material.dashSize = 4;
        corridor.material.linewidth = 1.6;
      } else {
        corridor.material.color.setHex(0x047857);
        corridor.material.opacity = 0.22;
        corridor.material.dashSize = 3;
        corridor.material.linewidth = 1.0;
      }
      corridor.line.computeLineDistances();
      corridor.material.needsUpdate = true;
    });
  }

  // Select and Highlight a Trade Destination
  function selectDestination(destId, animateCamera = false) {
    if (!DESTINATIONS[destId]) return;
    activeDestId = destId;
    const dest = DESTINATIONS[destId];

    // 1. Update Country Ribbon Buttons & Chips & Floating Labels
    const ribbonButtons = document.querySelectorAll('.country-ribbon-btn, .gtn-floating-dest');
    ribbonButtons.forEach((btn) => {
      const bDest = btn.getAttribute('data-dest');
      const isActive = (bDest === destId);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 2. Update Badge Highlight Classes and SVG Lines
    Object.keys(badgeElements).forEach((id) => {
      const badge = badgeElements[id];
      const isSel = (id === destId);
      badge.classList.toggle('badge-active', isSel);

      const line = svgLineElements[id];
      if (line) {
        if (isSel) {
          line.setAttribute('stroke', '#10B981');
          line.setAttribute('stroke-width', '2.5');
          line.setAttribute('stroke-dasharray', 'none');
        } else {
          line.setAttribute('stroke', '#059669');
          line.setAttribute('stroke-width', '1.8');
          line.setAttribute('stroke-dasharray', '4 3');
        }
      }
    });

    // 3. Update Direct Corridor Lines
    updateCorridorLineStyles();

    // 4. Update Bottom Corridor Telemetry Status Card
    const flagEl = document.getElementById('bar-dest-flag');
    const nameEl = document.getElementById('bar-dest-name');
    const transitEl = document.getElementById('bar-dest-transit');

    if (flagEl) flagEl.textContent = dest.flag;
    if (nameEl) nameEl.textContent = dest.name;
    if (transitEl) transitEl.textContent = dest.transit;

    // 5. Smooth Camera Re-centering
    if (animateCamera && earthGroup && dest.focusRotY !== undefined) {
      rotateToAngle(dest.focusRotY);
    }
  }

  // Smoothly rotate globe to face destination
  function rotateToAngle(rotY) {
    const camAzimuth = (controls && typeof controls.getAzimuthalAngle === 'function') ? controls.getAzimuthalAngle() : 0;
    targetRotationY = rotY + camAzimuth;
    lastUserInteraction = Date.now() + 3000; // Pause auto-rotate during transition
  }

  // Cinematic Entrance Animation: Scales Globe & Sequential Outward Routes
  function triggerCinematicEntrance() {
    isEntranceActive = true;
    if (earthGroup) {
      earthGroup.scale.set(0.78, 0.78, 0.78);
    }

    // Sequential activation: South India Origin -> Middle East -> Europe -> Southeast Asia -> Africa -> North America
    const sequence = [
      { id: 'INDIA', delay: 0 },
      { id: 'DUBAI', delay: 320 },
      { id: 'GERMANY', delay: 640 },
      { id: 'SINGAPORE', delay: 960 },
      { id: 'AFRICA', delay: 1280 },
      { id: 'USA', delay: 1600 }
    ];

    sequence.forEach((item) => {
      setTimeout(() => {
        if (directCorridorLines[item.id]) {
          directCorridorLines[item.id].material.opacity = 0.95;
          directCorridorLines[item.id].material.linewidth = 2.8;
        }

        const ring = beaconRings.find(r => r.userData.destId === item.id);
        if (ring) {
          ring.scale.set(2.4, 2.4, 2.4);
          ring.material.opacity = 1.0;
        }

        if (item.id === 'USA') {
          selectDestination('USA', false);
        }
      }, item.delay);
    });
  }

  window.addEventListener('gtnSectionRevealed', triggerCinematicEntrance);

  // Window Resize
  function onWindowResize() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container || !renderer || !camera) return;

    const w = container.clientWidth || 900;
    const h = container.clientHeight || 560;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);

    const svgOverlay = document.getElementById('globe-svg-lines');
    if (svgOverlay) {
      svgOverlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svgOverlay.setAttribute('width', w);
      svgOverlay.setAttribute('height', h);
    }
  }

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    animFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Controls update
    if (controls) {
      controls.autoRotate = false;
      controls.update();
    }

    // 2. Smooth Globe Tilt & Shift toward cursor
    if (earthGroup) {
      earthGroup.rotation.x += (targetTiltX - earthGroup.rotation.x) * 0.05;
      earthGroup.position.x += (targetShiftX - earthGroup.position.x) * 0.05;
      earthGroup.position.y += (targetShiftY - earthGroup.position.y) * 0.05;

      // Cinematic entrance scale spring
      if (isEntranceActive) {
        earthGroup.scale.x += (1.0 - earthGroup.scale.x) * 0.06;
        earthGroup.scale.y += (1.0 - earthGroup.scale.y) * 0.06;
        earthGroup.scale.z += (1.0 - earthGroup.scale.z) * 0.06;
        if (Math.abs(1.0 - earthGroup.scale.x) < 0.005) {
          earthGroup.scale.set(1.0, 1.0, 1.0);
          isEntranceActive = false;
        }
      }
    }

    // 3. Smooth target rotation lerp when a country is clicked, or gentle auto-spin
    const now = Date.now();
    if (earthGroup) {
      if (targetRotationY !== null) {
        let diff = targetRotationY - earthGroup.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        earthGroup.rotation.y += diff * 0.08;
        if (Math.abs(diff) < 0.003) {
          earthGroup.rotation.y = targetRotationY;
          targetRotationY = null;
        }
      } else if (now - lastUserInteraction > 2500) {
        // Gentle planetary spin on axis
        earthGroup.rotation.y += 0.0016;
      }
    }

    // 4. Continuously animate trade route dashes to simulate real-time maritime flow
    Object.values(directCorridorLines).forEach((corridor) => {
      if (corridor && corridor.material) {
        corridor.material.dashOffset -= 0.035;
      }
    });
    chainRouteArcs.forEach((arc) => {
      if (arc && arc.material) {
        arc.material.dashOffset -= 0.025;
      }
    });

    // 5. Pulse Radar Beacon Rings
    beaconRings.forEach((ring) => {
      const isSel = (ring.userData.destId === activeDestId);
      const isHovered = (ring.userData.destId === hoveredDestId);
      const speed = (isSel || isHovered) ? 3.0 : 1.8;
      const phase = (elapsedTime * speed + ring.userData.phase) % Math.PI;

      const scale = 1.0 + Math.sin(phase) * ((isSel || isHovered) ? 2.5 : 1.5);
      const opacity = Math.cos(phase) * ((isSel || isHovered) ? 0.95 : 0.5);

      ring.scale.set(scale, scale, scale);
      ring.material.opacity = Math.max(0, opacity);
    });

    // 6. Animate Moving Photon Particles along Active Corridor & Sequential Routes
    const activeCorridor = directCorridorLines[activeDestId];
    photonParticles.forEach((p, idx) => {
      if (p.fixedArc) {
        p.mesh.visible = true;
        p.progress = (elapsedTime * p.speed + (idx * 0.15)) % 1.0;
        const pt = p.fixedArc.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      } else if (activeCorridor && activeCorridor.curve) {
        p.mesh.visible = true;
        p.progress = (elapsedTime * p.speed + (idx / 6)) % 1.0;
        const pt = activeCorridor.curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      } else {
        p.mesh.visible = false;
      }
    });

    // 7. Update HTML Badges & SVG Leader Lines with Precise Projection & Occlusion
    updateBadgesAndLeaderLines();

    // 8. Render
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Update HTML Badges and SVG Leader Lines on each frame
  function updateBadgesAndLeaderLines() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container || !camera || !earthGroup) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    Object.keys(DESTINATIONS).forEach((destId) => {
      const dest = DESTINATIONS[destId];
      const badge = badgeElements[destId];
      const line = svgLineElements[destId];
      if (!badge || !line) return;

      const localPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS * 1.003);
      const worldPos = localPos.clone().applyMatrix4(earthGroup.matrixWorld);

      // Occlusion test: vector from point to camera vs surface normal
      const toCam = camera.position.clone().sub(worldPos).normalize();
      const normal = worldPos.clone().normalize();
      const dot = normal.dot(toCam);

      if (dot < 0.12) {
        // Behind the horizon: hide badge and leader line
        badge.style.opacity = '0';
        badge.style.pointerEvents = 'none';
        line.setAttribute('opacity', '0');
      } else {
        // Front hemisphere: project to 2D screen coordinate
        const proj = worldPos.clone().project(camera);
        const sx = (proj.x * 0.5 + 0.5) * width;
        const sy = (-(proj.y * 0.5) + 0.5) * height;

        const bx = sx + dest.offset.x;
        const by = sy + dest.offset.y;

        const alpha = Math.min(1.0, (dot - 0.12) / 0.18);

        badge.style.opacity = String(alpha);
        badge.style.pointerEvents = alpha > 0.4 ? 'auto' : 'none';
        badge.style.left = `${bx}px`;
        badge.style.top = `${by}px`;

        line.setAttribute('opacity', String(alpha * 0.90));
        line.setAttribute('x1', String(sx));
        line.setAttribute('y1', String(sy));
        line.setAttribute('x2', String(bx));
        line.setAttribute('y2', String(by));
      }
    });
  }

  // Expose Global Public API for external section synchronization
  window.ShipyonGlobe = {
    selectDestination: selectDestination,
    onSectionMouseMove: function (normX, normY) {
      targetTiltX = normY * 0.12;
      targetShiftX = normX * 14;
      targetShiftY = -normY * 8;
    },
    triggerEntrance: triggerCinematicEntrance
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
