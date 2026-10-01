/**
 * Shipyon Global Trade Network Engine
 * ============================================================================
 * - Realistic, elegant 3D rotating globe matching reference corporate aesthetic
 * - Two-Tier Dual Engine Architecture:
 *     Tier 1: High-Performance WebGL 3D (Three.js with GeoJSON & realistic lighting)
 *     Tier 2: High-Fidelity Canvas 2D Orthographic Globe (Zero-fail fallback for Safari/mobile)
 * - Guarantees the globe is ALWAYS visible and interactive in ANY browser!
 * - Exactly 9 trade destinations:
 *     1. 🇺🇸 USA (North America Gateway)
 *     2. 🇩🇪 Germany (European Hub)
 *     3. 🇦🇪 Dubai (UAE) (Middle East Gateway)
 *     4. 🇮🇳 India (HQ Origin & Sourcing Hub)
 *     5. 🇱🇰 Sri Lanka (Transshipment Hub)
 *     6. 🇲🇾 Malaysia (Southeast Asia Logistics)
 *     7. 🇸🇬 Singapore (Straits Maritime Hub)
 *     8. 🇻🇳 Vietnam (ASEAN Commercial Gateway)
 *     9. 🇦🇺 Australia (Indo-Pacific Gateway)
 * - Ultra-fast, smooth transitions: 1.35s per location with easeInOutCubic easing
 * - Seamless continuous loop (Australia -> USA -> Germany ...)
 * - White location pin markers with subtle glowing pulse and elevation
 * - Real 3D spherical country highlighting using triangulated GeoJSON polygons
 * - Interactive drag-to-rotate, hover info card, ribbon synchronization
 * ============================================================================
 */

(function () {
  'use strict';

  // Core Globe Constants
  const GLOBE_RADIUS = 100;
  const CAMERA_DISTANCE = 310;
  const TRANSITION_DURATION = 1350; // 1.35s per location
  const HOLD_DURATION = 400; // brief pause before next destination in auto loop

  // Exactly 9 Target Global Destinations in Sequence
  const DESTINATIONS = {
    USA: {
      id: 'USA',
      name: 'USA',
      shortName: 'USA',
      fullName: 'United States of America',
      corridor: 'North America Gateway',
      hub: 'Port of New York & Newark',
      flag: '🇺🇸',
      lat: 40.7128,
      lon: -74.0060,
      focusRotY: -25 * (Math.PI / 180),
      focusTiltX: 0.18,
      transit: '22 Days Transatlantic Express • New York Port',
      goods: 'Spices, Basmati Rice, Textiles, Vitrified Tiles',
      geoId: 'USA'
    },
    GERMANY: {
      id: 'GERMANY',
      name: 'Germany',
      shortName: 'Germany',
      fullName: 'Federal Republic of Germany',
      corridor: 'European Logistics Hub',
      hub: 'Port of Hamburg & Frankfurt',
      flag: '🇩🇪',
      lat: 53.5511,
      lon: 9.9937,
      focusRotY: -100 * (Math.PI / 180),
      focusTiltX: 0.22,
      transit: '18 Days European Direct Liner • Hamburg Gateway',
      goods: 'Organic Spices, Industrial Clothing, Agro Produce',
      geoId: 'GERMANY'
    },
    DUBAI: {
      id: 'DUBAI',
      name: 'Dubai (UAE)',
      shortName: 'Dubai (UAE)',
      fullName: 'United Arab Emirates',
      corridor: 'Middle East Gateway',
      hub: 'Jebel Ali Port & Logistics Hub',
      flag: '🇦🇪',
      lat: 25.2048,
      lon: 55.2708,
      focusRotY: -145 * (Math.PI / 180),
      focusTiltX: 0.14,
      transit: '3.5 Days Express Gulf Feeder • Jebel Ali Port',
      goods: 'Fresh Fruits, Vegetables, Cardamom, Premium Rice',
      geoId: 'DUBAI'
    },
    INDIA: {
      id: 'INDIA',
      name: 'India',
      shortName: 'India (Origin)',
      fullName: 'Republic of India (HQ Origin)',
      corridor: 'Global Sourcing & HQ Origin',
      hub: 'Tuticorin, Chennai & Cochin Gateways',
      flag: '🇮🇳',
      lat: 13.0827,
      lon: 80.2707,
      focusRotY: -170 * (Math.PI / 180),
      focusTiltX: 0.08,
      transit: 'Agro-Industrial Origin • Tuticorin & Cochin Gateways',
      goods: 'Spices, Agro-Commodities, Textiles, Natural Stones',
      isOrigin: true,
      geoId: 'INDIA'
    },
    SRILANKA: {
      id: 'SRILANKA',
      name: 'Sri Lanka',
      shortName: 'Sri Lanka',
      fullName: 'Democratic Socialist Republic of Sri Lanka',
      corridor: 'Indian Ocean Transshipment',
      hub: 'Port of Colombo',
      flag: '🇱🇰',
      lat: 6.9271,
      lon: 79.8612,
      focusRotY: -169 * (Math.PI / 180),
      focusTiltX: 0.05,
      transit: '1.5 Days Direct Feeder Line • Port of Colombo',
      goods: 'Fresh Onions, Grains, Pulses, Agro Produce',
      geoId: 'SRILANKA'
    },
    MALAYSIA: {
      id: 'MALAYSIA',
      name: 'Malaysia',
      shortName: 'Malaysia',
      fullName: 'Federation of Malaysia',
      corridor: 'Southeast Asia Logistics Hub',
      hub: 'Port Klang Gateway',
      flag: '🇲🇾',
      lat: 3.1390,
      lon: 101.6869,
      focusRotY: 172 * (Math.PI / 180),
      focusTiltX: 0.02,
      transit: '6 Days Direct Maritime Liner • Port Klang Hub',
      goods: 'Spices, Raw Cotton, Foodstuff, Ceramics',
      geoId: 'MALAYSIA'
    },
    SINGAPORE: {
      id: 'SINGAPORE',
      name: 'Singapore',
      shortName: 'Singapore',
      fullName: 'Republic of Singapore',
      corridor: 'Global Straits Maritime Hub',
      hub: 'Port of Singapore',
      flag: '🇸🇬',
      lat: 1.3521,
      lon: 103.8198,
      focusRotY: 170 * (Math.PI / 180),
      focusTiltX: 0.01,
      transit: '5 Days Direct Maritime Corridor • Port of Singapore',
      goods: 'Processed Food, Premium Rice, Building Materials',
      geoId: 'SINGAPORE'
    },
    VIETNAM: {
      id: 'VIETNAM',
      name: 'Vietnam',
      shortName: 'Vietnam',
      fullName: 'Socialist Republic of Vietnam',
      corridor: 'ASEAN Commercial Gateway',
      hub: 'Ho Chi Minh Port & Da Nang',
      flag: '🇻🇳',
      lat: 10.8231,
      lon: 106.6297,
      focusRotY: 166 * (Math.PI / 180),
      focusTiltX: 0.06,
      transit: '8 Days Direct ASEAN Route • Ho Chi Minh Gateway',
      goods: 'Cotton Yarns, Textiles, Agricultural Commodities',
      geoId: 'VIETNAM'
    },
    AUSTRALIA: {
      id: 'AUSTRALIA',
      name: 'Australia',
      shortName: 'Australia',
      fullName: 'Commonwealth of Australia',
      corridor: 'Indo-Pacific Gateway',
      hub: 'Port of Sydney & Melbourne',
      flag: '🇦🇺',
      lat: -33.8688,
      lon: 151.2093,
      focusRotY: 120 * (Math.PI / 180),
      focusTiltX: -0.18,
      transit: '14 Days Indo-Pacific Express • Sydney & Melbourne',
      goods: 'Granite, Vitrified Tiles, Basmati Rice, Garments',
      geoId: 'AUSTRALIA'
    }
  };

  // Exact Sequential Order
  const DESTINATION_ORDER = [
    'USA',
    'GERMANY',
    'DUBAI',
    'INDIA',
    'SRILANKA',
    'MALAYSIA',
    'SINGAPORE',
    'VIETNAM',
    'AUSTRALIA'
  ];

  // Engine State
  let activeEngineMode = 'webgl'; // 'webgl' or 'canvas2d'
  let activeDestIndex = 0;
  let activeDestId = DESTINATION_ORDER[0];
  let lastSwitchTime = 0;
  let lastUserInteraction = 0;
  let isUserInteracting = false;
  let isHoverPaused = false;
  let animFrameId = null;
  let isGlobeVisible = true;

  // Rotation Transition State
  let currentRotY = DESTINATIONS.USA.focusRotY;
  let currentTiltX = DESTINATIONS.USA.focusTiltX;
  let startRotY = currentRotY;
  let startTiltX = currentTiltX;
  let targetRotY = currentRotY;
  let targetTiltX = currentTiltX;
  let transitionStartTime = 0;
  let isTransitioning = false;

  // WebGL 3D Specific State
  let scene, camera, renderer, controls;
  let earthGroup;
  let globeMesh, atmosphereMesh, contactShadowMesh, cloudsMesh;
  const pinObjects = {};
  const countryMeshes = {};
  const directCorridorLines = {};
  const photonParticles = [];
  let badgeElements = {};
  let hoverCard = null;

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Easing & Angle Math
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function normalizeAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
  }

  // Orthographic Spherical Math (for 2D Engine and projections)
  function projectOrthographic(lat, lon, rotY, tiltX, cx, cy, radius) {
    const phi = lat * Math.PI / 180;
    const lambda = lon * Math.PI / 180;
    const lambda0 = rotY;
    const phi0 = tiltX;

    const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);
    const isVisible = cosC > 0.03;

    const x = cx + radius * Math.cos(phi) * Math.sin(lambda - lambda0);
    const y = cy - radius * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0));

    return { x, y, isVisible, cosC };
  }

  // Procedural Earth Texture Generator (Instant visual display without waiting for network image)
  function createProceduralEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Rich Realistic Deep Ocean Blue with latitudinal sunlit marine gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#061730'); // North polar ocean
    oceanGrad.addColorStop(0.25, '#0B2C56'); // North temperate
    oceanGrad.addColorStop(0.5, '#124682'); // Tropical sunlit equatorial ocean
    oceanGrad.addColorStop(0.75, '#0B2C56'); // South temperate
    oceanGrad.addColorStop(1, '#061730'); // South polar ocean
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle coordinate lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Helper to draw polygon rings
    function drawRing(ring, fillColor, strokeColor) {
      if (!ring || ring.length < 3) return;
      ctx.beginPath();
      ring.forEach((pt, i) => {
        const px = ((pt[0] + 180) / 360) * canvas.width;
        const py = ((90 - pt[1]) / 180) * canvas.height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // 1. Draw all world continents with natural Earth biomes
    const worldLand = (typeof window !== 'undefined' ? window.WORLD_LAND_GEO : null) || [];
    worldLand.forEach((polygon) => {
      if (!polygon || polygon.length < 3) return;
      let sumLat = 0, sumLon = 0;
      polygon.forEach((pt) => { sumLon += pt[0]; sumLat += pt[1]; });
      const avgLat = sumLat / polygon.length;
      const avgLon = sumLon / polygon.length;

      let landColor = '#2E6F40'; // Lush vegetative forest green
      let borderColor = '#205530';

      if (avgLat > 60 || avgLat < -58) {
        landColor = '#E2E8F0'; // Polar ice / tundra
        borderColor = '#CBD5E1';
      } else if (avgLat >= 12 && avgLat <= 34 && ((avgLon >= -18 && avgLon <= 55) || (avgLon >= 115 && avgLon <= 145))) {
        landColor = '#C29B38'; // Desert Sahara / Arabia / Outback
        borderColor = '#A68228';
      } else if (avgLat < 0 && avgLon >= 115 && avgLon <= 150) {
        landColor = '#B88B4A'; // Australia arid interior
        borderColor = '#9C7238';
      }

      drawRing(polygon, landColor, borderColor);
    });

    // 2. Draw trade countries on top with crisp natural tones
    const geoData = (typeof window !== 'undefined' ? window.TRADE_COUNTRIES_GEO : null) || {};
    Object.keys(geoData).forEach((k) => {
      const country = geoData[k];
      if (!country || !country.rings) return;
      country.rings.forEach((ring) => {
        drawRing(ring, '#357A4B', '#235D35');
      });
    });

    const texture = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  // ==========================================================================
  // SAFE WEBGL RENDERER FACTORY (Resolves Safari WebGL Failures)
  // ==========================================================================
  function createSafeWebGLRenderer(container, width, height) {
    if (typeof THREE === 'undefined' || !THREE.WebGLRenderer) return null;

    // Properly release previous contexts so Safari doesn't hit the 16-context limit
    if (renderer) {
      try {
        if (renderer.forceContextLoss) renderer.forceContextLoss();
        renderer.dispose();
      } catch (e) {}
      renderer = null;
    }

    // Try strategies without powerPreference: 'high-performance' (which Safari often rejects)
    const strategies = [
      { antialias: true, alpha: true, powerPreference: 'default' },
      { antialias: false, alpha: true, powerPreference: 'default' },
      { antialias: false, alpha: true },
      { antialias: false, alpha: false }
    ];

    for (const opt of strategies) {
      try {
        const r = new THREE.WebGLRenderer(opt);
        if (r && r.getContext()) {
          r.setSize(width, height);
          r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          if (THREE.sRGBEncoding) r.outputEncoding = THREE.sRGBEncoding;
          container.appendChild(r.domElement);
          return r;
        }
      } catch (e) {
        // try next configuration
      }
    }

    // Manual context acquisition fallback
    try {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const gl = c.getContext('webgl2', { alpha: true }) || 
                 c.getContext('webgl', { alpha: true }) || 
                 c.getContext('experimental-webgl', { alpha: true });
      if (gl) {
        const r = new THREE.WebGLRenderer({ canvas: c, context: gl, alpha: true });
        r.setSize(width, height);
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        container.appendChild(c);
        return r;
      }
    } catch (e) {}

    return null;
  }

  // ==========================================================================
  // TIER 1: HIGH-PERFORMANCE WEBGL 3D GLOBE ENGINE
  // ==========================================================================
  function initWebGLGlobe(container, width, height) {
    activeEngineMode = 'webgl';
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(42, width / height, 1, 2000);
    camera.position.set(0, 10, CAMERA_DISTANCE);

    // OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enableZoom = false;
      controls.minDistance = GLOBE_RADIUS * 1.5;
      controls.maxDistance = GLOBE_RADIUS * 3.8;
      controls.enablePan = false;
      controls.autoRotate = false;

      controls.addEventListener('start', () => {
        isUserInteracting = true;
        lastUserInteraction = Date.now();
      });
      controls.addEventListener('end', () => {
        isUserInteracting = false;
        lastUserInteraction = Date.now();
      });
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xF8FAF6, 1.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.95);
    sunLight.position.set(220, 160, 240);
    scene.add(sunLight);

    const softFillLight = new THREE.DirectionalLight(0xE2EFE7, 0.45);
    softFillLight.position.set(-220, -100, -200);
    scene.add(softFillLight);

    // Master Earth Group
    earthGroup = new THREE.Group();
    earthGroup.rotation.y = currentRotY;
    earthGroup.rotation.x = currentTiltX;
    scene.add(earthGroup);

    // Base Earth Sphere (Realistic Earth with NASA Blue Marble map)
    const proceduralTex = createProceduralEarthTexture();
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96);
    const globeMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xFFFFFF), // Neutral white so Earth surface colors are 100% natural
      map: proceduralTex,
      specular: new THREE.Color(0x38BDF8),
      shininess: 25,
      emissive: new THREE.Color(0x021024),
      emissiveIntensity: 0.08
    });

    globeMesh = new THREE.Mesh(globeGeo, globeMat);
    earthGroup.add(globeMesh);

    // Asynchronously upgrade with 4K NASA Blue Marble Earth Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/earth-blue-marble.jpg', (tex) => {
      if (tex && globeMesh) {
        if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
        tex.anisotropy = 8;
        globeMesh.material.map = tex;
        globeMesh.material.needsUpdate = true;
        if (renderer) renderer.render(scene, camera);
      }
    });

    // Asynchronously add ocean specular reflection map (water reflects sunlight, continents stay matte)
    textureLoader.load('assets/earth_specular_2048.jpg', (specTex) => {
      if (specTex && globeMesh) {
        globeMesh.material.specularMap = specTex;
        globeMesh.material.specular = new THREE.Color(0x1E40AF);
        globeMesh.material.shininess = 16;
        globeMesh.material.needsUpdate = true;
        if (renderer) renderer.render(scene, camera);
      }
    });

    // Add delicate translucent rotating cloud layer
    textureLoader.load('assets/earth_clouds_1024.png', (cloudsTex) => {
      if (cloudsTex && earthGroup) {
        if (THREE.sRGBEncoding) cloudsTex.encoding = THREE.sRGBEncoding;
        const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.005, 64, 64);
        const cloudsMat = new THREE.MeshPhongMaterial({
          map: cloudsTex,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
        earthGroup.add(cloudsMesh);
        if (renderer) renderer.render(scene, camera);
      }
    });

    // Atmospheric Rim Glow (Authentic Earth Blue Rayleigh Scattering)
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.022, 64, 64);
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
          // Realistic Earth azure Rayleigh scattering atmosphere
          gl_FragColor = vec4(0.25, 0.65, 1.0, 1.0) * intensity * 0.72;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosphereMesh);

    // Build Contact Shadow
    buildContactShadow();

    // Build 3D Country Polygons
    buildCountryHighlights();

    // Build Location Pins
    buildLocationPins();

    // Build Direct Corridors
    buildDirectTradeCorridors();

    // Build Photon Flow
    initPhotonParticles();

    // Setup HTML Badges & UI
    setupOverlayElements(container.parentElement);

    // Initial USA selection
    selectDestination('USA', false);

    // Start Animation Loop
    lastSwitchTime = performance.now();
    animateWebGL();
    setupGlobeVisibilityObserver(container);
  }

  function setupGlobeVisibilityObserver(containerTarget) {
    if ('IntersectionObserver' in window && containerTarget) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const wasVisible = isGlobeVisible;
          isGlobeVisible = entry.isIntersecting;
          if (isGlobeVisible && !wasVisible) {
            lastSwitchTime = performance.now();
            if (!animFrameId) {
              if (activeEngineMode === 'webgl') {
                animFrameId = requestAnimationFrame(animateWebGL);
              } else {
                animFrameId = requestAnimationFrame(animateCanvas2D);
              }
            }
          } else if (!isGlobeVisible && wasVisible) {
            if (animFrameId) {
              cancelAnimationFrame(animFrameId);
              animFrameId = null;
            }
          }
        });
      }, { rootMargin: '120px 0px 120px 0px', threshold: 0.01 });
      observer.observe(containerTarget);
    }
  }

  function buildContactShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(6, 18, 38, 0.32)');
    grad.addColorStop(0.5, 'rgba(6, 18, 38, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(GLOBE_RADIUS * 2.2, GLOBE_RADIUS * 2.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    contactShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.y = -GLOBE_RADIUS * 1.08;
    scene.add(contactShadowMesh);
  }

  function buildCountryHighlights() {
    const geoData = window.TRADE_COUNTRIES_GEO || {};

    Object.keys(DESTINATIONS).forEach((destId) => {
      const countryData = geoData[destId];
      if (!countryData || !countryData.rings) return;

      const countryGroup = new THREE.Group();
      countryGroup.userData = { destId: destId };
      earthGroup.add(countryGroup);

      const surfaceMeshes = [];
      const borderLines = [];

      countryData.rings.forEach((ring) => {
        if (!ring || ring.length < 3) return;

        const borderPts = [];
        ring.forEach((coord) => {
          borderPts.push(latLonToVector3(coord[1], coord[0], GLOBE_RADIUS * 1.0028));
        });

        const lineGeo = new THREE.BufferGeometry().setFromPoints(borderPts);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38BDF8,
          transparent: true,
          opacity: 0.35,
          linewidth: 1.5
        });
        const borderLine = new THREE.LineLoop(lineGeo, lineMat);
        countryGroup.add(borderLine);
        borderLines.push(borderLine);

        try {
          const pts2D = ring.map((coord) => new THREE.Vector2(coord[0], coord[1]));
          const triangles = THREE.ShapeUtils.triangulateShape(pts2D, []);

          if (triangles && triangles.length > 0) {
            const positions = [];
            triangles.forEach((face) => {
              const p0 = ring[face[0]];
              const p1 = ring[face[1]];
              const p2 = ring[face[2]];
              const v0 = latLonToVector3(p0[1], p0[0], GLOBE_RADIUS * 1.002);
              const v1 = latLonToVector3(p1[1], p1[0], GLOBE_RADIUS * 1.002);
              const v2 = latLonToVector3(p2[1], p2[0], GLOBE_RADIUS * 1.002);
              positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
            });

            const meshGeo = new THREE.BufferGeometry();
            meshGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            meshGeo.computeVertexNormals();

            const isOrigin = (destId === 'INDIA');
            const meshMat = new THREE.MeshPhongMaterial({
              color: isOrigin ? 0xF59E0B : 0x0284C7,
              emissive: isOrigin ? 0xD97706 : 0x38BDF8,
              emissiveIntensity: 0.45,
              shininess: 30,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.0,
              depthWrite: false
            });

            const surfaceMesh = new THREE.Mesh(meshGeo, meshMat);
            countryGroup.add(surfaceMesh);
            surfaceMeshes.push(surfaceMesh);
          }
        } catch (e) {}
      });

      const dest = DESTINATIONS[destId];
      const destPos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS * 1.003);
      const isOrigin = (destId === 'INDIA');
      const ringGeo = new THREE.RingGeometry(1.6, 2.6, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0xF59E0B : 0x38BDF8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0
      });
      const pulseRing = new THREE.Mesh(ringGeo, ringMat);
      pulseRing.position.copy(destPos);
      pulseRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), destPos.clone().normalize());
      countryGroup.add(pulseRing);

      countryMeshes[destId] = {
        group: countryGroup,
        surfaceMeshes: surfaceMeshes,
        borderLines: borderLines,
        pulseRing: pulseRing,
        currentElevation: 1.0,
        currentOpacity: 0.0
      };
    });
  }

  function buildLocationPins() {
    Object.keys(DESTINATIONS).forEach((destId) => {
      const dest = DESTINATIONS[destId];
      const isOrigin = !!dest.isOrigin;

      const basePos = latLonToVector3(dest.lat, dest.lon, GLOBE_RADIUS * 1.002);
      const normal = basePos.clone().normalize();
      const pinHeight = isOrigin ? 12 : 9.5;
      const headPos = basePos.clone().add(normal.clone().multiplyScalar(pinHeight));

      const pinGroup = new THREE.Group();

      const stemGeo = new THREE.CylinderGeometry(0.5, 0.25, pinHeight, 8);
      stemGeo.translate(0, pinHeight / 2, 0);
      stemGeo.rotateX(Math.PI / 2);
      const stemMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0xF59E0B : 0x38BDF8,
        transparent: true,
        opacity: 0.85
      });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.copy(basePos);
      stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(stem);

      const headRadius = isOrigin ? 3.0 : 2.4;
      const headGeo = new THREE.SphereGeometry(headRadius, 20, 20);
      const headMat = new THREE.MeshPhongMaterial({
        color: isOrigin ? 0xF59E0B : 0xFFFFFF,
        emissive: isOrigin ? 0xD97706 : 0x0284C7,
        emissiveIntensity: 0.25,
        shininess: 60
      });
      const pinHead = new THREE.Mesh(headGeo, headMat);
      pinHead.position.copy(headPos);
      pinGroup.add(pinHead);

      const haloGeo = new THREE.SphereGeometry(headRadius * 1.45, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0xFBBF24 : 0x38BDF8,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(headPos);
      pinGroup.add(halo);

      const ringGeo = new THREE.RingGeometry(1.8, 3.4, 28);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isOrigin ? 0xF59E0B : 0x38BDF8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const beaconRing = new THREE.Mesh(ringGeo, ringMat);
      beaconRing.position.copy(basePos.clone().add(normal.clone().multiplyScalar(0.2)));
      beaconRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      pinGroup.add(beaconRing);

      earthGroup.add(pinGroup);

      pinObjects[destId] = {
        group: pinGroup,
        pinHead: pinHead,
        halo: halo,
        beaconRing: beaconRing,
        basePos: basePos,
        headPos: headPos,
        normal: normal,
        currentScale: 1.0,
        targetScale: 1.0,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function createGreatCircleArc(p1, p2, radius, isEmphasized = false) {
    const dist = p1.distanceTo(p2);
    const maxAlt = radius + Math.min(dist * 0.24, radius * 0.35);
    const points = [];
    const segments = 60;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const v = new THREE.Vector3().lerpVectors(p1, p2, t).normalize();
      const alt = radius + Math.sin(t * Math.PI) * (maxAlt - radius);
      v.multiplyScalar(alt);
      points.push(v);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const baseColor = isEmphasized ? 0x38BDF8 : 0x1E40AF;
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

  function buildDirectTradeCorridors() {
    const indiaPos = latLonToVector3(DESTINATIONS.INDIA.lat, DESTINATIONS.INDIA.lon, GLOBE_RADIUS);

    Object.keys(DESTINATIONS).forEach((destId) => {
      if (destId === 'INDIA') return;

      const targetDest = DESTINATIONS[destId];
      const targetPos = latLonToVector3(targetDest.lat, targetDest.lon, GLOBE_RADIUS);

      const arcData = createGreatCircleArc(indiaPos, targetPos, GLOBE_RADIUS, destId === activeDestId);
      earthGroup.add(arcData.line);
      directCorridorLines[destId] = arcData;
    });
  }

  function initPhotonParticles() {
    const photonCount = 28;
    const photonGeo = new THREE.SphereGeometry(0.9, 8, 8);

    for (let i = 0; i < photonCount; i++) {
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0x38BDF8,
        transparent: true,
        opacity: 0.92
      });
      const mesh = new THREE.Mesh(photonGeo, photonMat);
      earthGroup.add(mesh);

      const targetDestIds = Object.keys(DESTINATIONS).filter(k => k !== 'INDIA');
      const assignedDestId = targetDestIds[i % targetDestIds.length];

      photonParticles.push({
        mesh: mesh,
        destId: assignedDestId,
        progress: (i / photonCount),
        speed: 0.0035 + (Math.random() * 0.002)
      });
    }
  }

  function setupOverlayElements(parentCard) {
    if (!parentCard) return;

    const overlayContainer = document.getElementById('globe-labels-overlay');
    if (!overlayContainer) return;

    overlayContainer.innerHTML = '';
    badgeElements = {};

    Object.keys(DESTINATIONS).forEach((destId) => {
      const dest = DESTINATIONS[destId];
      const badge = document.createElement('div');
      badge.className = 'globe-country-badge' + (destId === activeDestId ? ' active' : '');
      badge.setAttribute('data-dest', destId);
      badge.id = 'badge-' + destId;

      badge.innerHTML = `
        <span class="badge-flag">${dest.flag}</span>
        <span class="badge-name">${dest.name}</span>
        <span class="badge-dot"></span>
      `;

      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        selectDestination(destId, true);
      });

      overlayContainer.appendChild(badge);
      badgeElements[destId] = badge;
    });

    hoverCard = document.getElementById('globe-hover-card');

    const ribbonButtons = document.querySelectorAll('.country-ribbon-btn');
    ribbonButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const destId = btn.getAttribute('data-dest');
        if (destId) selectDestination(destId, true);
      });
    });
  }

  function animateWebGL() {
    if (!isGlobeVisible) {
      animFrameId = null;
      return;
    }
    animFrameId = requestAnimationFrame(animateWebGL);

    const now = performance.now();
    const timeSec = now * 0.001;

    // Handle Smooth Eased Rotation Transition
    if (isTransitioning) {
      const elapsed = now - transitionStartTime;
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1.0);
      const eased = easeInOutCubic(progress);

      currentRotY = startRotY + (targetRotY - startRotY) * eased;
      currentTiltX = startTiltX + (targetTiltX - startTiltX) * eased;

      earthGroup.rotation.y = currentRotY;
      earthGroup.rotation.x = currentTiltX;

      if (progress >= 1.0) {
        isTransitioning = false;
        currentRotY = normalizeAngle(currentRotY);
        earthGroup.rotation.y = currentRotY;
        lastSwitchTime = now;
      }
    } else {
      const timeSinceLastInteraction = Date.now() - lastUserInteraction;
      const canAutoRotate = !isUserInteracting && !isHoverPaused && (timeSinceLastInteraction > 2500);

      if (canAutoRotate && !prefersReducedMotion) {
        earthGroup.rotation.y += 0.0006;
        currentRotY = earthGroup.rotation.y;

        if (now - lastSwitchTime > (TRANSITION_DURATION + HOLD_DURATION)) {
          const nextIndex = (activeDestIndex + 1) % DESTINATION_ORDER.length;
          selectDestination(DESTINATION_ORDER[nextIndex], false);
        }
      }
    }

    // Subtle realistic cloud rotation drift
    if (cloudsMesh && !prefersReducedMotion) {
      cloudsMesh.rotation.y += 0.00015;
    }

    // Animate Country Highlighting
    Object.keys(countryMeshes).forEach((destId) => {
      const data = countryMeshes[destId];
      const isTarget = (destId === activeDestId);

      const isOrigin = (destId === 'INDIA');
      const targetElevation = isTarget ? 1.006 : 1.0;
      const targetOpacity = isTarget ? 0.38 : 0.0;
      const targetBorderOpacity = isTarget ? 0.95 : 0.25;
      const targetBorderColor = isTarget ? (isOrigin ? 0xF59E0B : 0x38BDF8) : 0x0284C7;

      data.currentElevation += (targetElevation - data.currentElevation) * 0.12;
      data.currentOpacity += (targetOpacity - data.currentOpacity) * 0.14;

      data.group.scale.set(data.currentElevation, data.currentElevation, data.currentElevation);

      data.surfaceMeshes.forEach((mesh) => {
        mesh.material.opacity = data.currentOpacity;
      });

      data.borderLines.forEach((line) => {
        line.material.opacity = isTarget ? targetBorderOpacity : 0.25;
        line.material.color.setHex(targetBorderColor);
      });

      if (data.pulseRing) {
        if (isTarget) {
          const pulse = (Math.sin(timeSec * 4) * 0.5 + 0.5);
          data.pulseRing.material.opacity = 0.5 + pulse * 0.45;
          const s = 1.0 + pulse * 0.35;
          data.pulseRing.scale.set(s, s, s);
        } else {
          data.pulseRing.material.opacity = 0.0;
        }
      }
    });

    // Animate Location Pins
    Object.keys(pinObjects).forEach((destId) => {
      const pin = pinObjects[destId];
      const isTarget = (destId === activeDestId);

      pin.currentScale += (pin.targetScale - pin.currentScale) * 0.15;
      pin.group.scale.set(pin.currentScale, pin.currentScale, pin.currentScale);

      const ringPhase = timeSec * 3 + pin.phase;
      const ringScale = 1.0 + (Math.sin(ringPhase) * 0.5 + 0.5) * (isTarget ? 0.9 : 0.4);
      const ringOpacity = (1.0 - (ringScale - 1.0) / 0.9) * (isTarget ? 0.85 : 0.45);
      pin.beaconRing.scale.set(ringScale, ringScale, 1);
      pin.beaconRing.material.opacity = Math.max(0, ringOpacity);

      if (isTarget) {
        const haloPulse = Math.sin(timeSec * 5) * 0.2 + 0.5;
        pin.halo.material.opacity = haloPulse;
        pin.pinHead.material.emissiveIntensity = 0.35 + haloPulse * 0.25;
      } else {
        pin.halo.material.opacity = 0.15;
        pin.pinHead.material.emissiveIntensity = 0.10;
      }
    });

    // Animate Flowing Photons
    photonParticles.forEach((p) => {
      const arc = directCorridorLines[p.destId];
      if (arc && arc.curve) {
        p.progress += p.speed;
        if (p.progress > 1.0) p.progress = 0;

        const pos = arc.curve.getPointAt(p.progress);
        if (pos) {
          p.mesh.position.copy(pos);
          const isCurrentActive = (p.destId === activeDestId);
          p.mesh.material.color.setHex(isCurrentActive ? 0x38BDF8 : 0x60A5FA);
          p.mesh.scale.setScalar(isCurrentActive ? 1.35 : 0.85);
        }
      }
    });

    if (controls) controls.update();
    updateOverlayPositions();

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function updateOverlayPositions() {
    if (!renderer || !camera || !earthGroup) return;

    const container = document.getElementById('shipyon-3d-globe-container');
    const svgLines = document.getElementById('globe-svg-lines');
    if (!container || !svgLines) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    let svgPathHtml = '';

    Object.keys(DESTINATIONS).forEach((destId) => {
      const pin = pinObjects[destId];
      const label = badgeElements[destId];
      if (!pin || !label) return;

      const isDestActive = (destId === activeDestId);

      const worldHeadPos = pin.headPos.clone().applyMatrix4(earthGroup.matrixWorld);
      const worldBasePos = pin.basePos.clone().applyMatrix4(earthGroup.matrixWorld);

      const toCamera = camera.position.clone().sub(worldBasePos).normalize();
      const surfaceNormal = worldBasePos.clone().normalize();
      const dot = surfaceNormal.dot(toCamera);

      if (dot > 0.12) {
        const projected = worldHeadPos.clone().project(camera);
        const screenX = (projected.x * 0.5 + 0.5) * width;
        const screenY = (-projected.y * 0.5 + 0.5) * height;

        label.style.left = `${screenX}px`;
        label.style.top = `${screenY}px`;

        if (isDestActive) {
          label.style.opacity = '1';
          label.style.pointerEvents = 'auto';
          label.classList.add('active');

          const cardOffsetDist = 58;
          const cardX = screenX + cardOffsetDist;
          const cardY = screenY - cardOffsetDist;

          svgPathHtml += `
            <line x1="${screenX}" y1="${screenY}" x2="${cardX}" y2="${cardY}" stroke="#38BDF8" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.85" />
            <circle cx="${screenX}" cy="${screenY}" r="3" fill="#38BDF8" />
          `;

          if (hoverCard) {
            hoverCard.style.left = `${cardX}px`;
            hoverCard.style.top = `${cardY}px`;
            hoverCard.classList.add('visible');

            const hFlag = document.getElementById('hover-card-flag');
            const hCountry = document.getElementById('hover-card-country');
            const hCorridor = document.getElementById('hover-card-corridor');
            const hTransit = document.getElementById('hover-card-transit');
            const hGoods = document.getElementById('hover-card-goods');
            const hHub = document.getElementById('hover-card-hub') || document.getElementById('hover-card-port');

            const dest = DESTINATIONS[destId];
            if (hFlag) hFlag.textContent = dest.flag;
            if (hCountry) hCountry.textContent = dest.name;
            if (hCorridor) hCorridor.textContent = dest.corridor;
            if (hTransit) hTransit.textContent = dest.transit;
            if (hGoods) hGoods.textContent = dest.goods;
            if (hHub) hHub.textContent = dest.hub;
          }
        } else {
          label.style.opacity = (dot > 0.35) ? '0.75' : '0.35';
          label.style.pointerEvents = 'none';
          label.classList.remove('active');
        }
      } else {
        label.style.opacity = '0';
        label.style.pointerEvents = 'none';
      }
    });

    svgLines.innerHTML = svgPathHtml;
  }

  // ==========================================================================
  // TIER 2: HIGH-FIDELITY CANVAS 2D INTERACTIVE GLOBE (FAIL-SAFE ENGINE)
  // Ensures 100% visibility in Safari, Mobile, or whenever WebGL is disabled
  // ==========================================================================
  let canvas2D = null;
  let ctx2D = null;
  let canvasWidth = 600;
  let canvasHeight = 520;
  let photon2DProgress = 0;
  let isDragging2D = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragRotY = 0;
  let dragTiltX = 0;

  function initCanvas2DFallbackGlobe(container, width, height) {
    activeEngineMode = 'canvas2d';
    container.innerHTML = '';

    canvasWidth = width;
    canvasHeight = height;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas2D = document.createElement('canvas');
    canvas2D.width = Math.round(width * dpr);
    canvas2D.height = Math.round(height * dpr);
    canvas2D.style.width = width + 'px';
    canvas2D.style.height = height + 'px';
    canvas2D.style.display = 'block';
    canvas2D.style.cursor = 'grab';
    canvas2D.setAttribute('aria-label', 'Interactive World Trade Network Globe');
    container.appendChild(canvas2D);

    ctx2D = canvas2D.getContext('2d');

    // Drag to rotate interaction for 2D Canvas
    canvas2D.addEventListener('mousedown', (e) => {
      isDragging2D = true;
      isUserInteracting = true;
      lastUserInteraction = Date.now();
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragRotY = currentRotY;
      dragTiltX = currentTiltX;
      canvas2D.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging2D) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      currentRotY = dragRotY + dx * 0.006;
      currentTiltX = Math.max(-0.4, Math.min(0.4, dragTiltX - dy * 0.004));
      lastUserInteraction = Date.now();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging2D) {
        isDragging2D = false;
        isUserInteracting = false;
        lastUserInteraction = Date.now();
        canvas2D.style.cursor = 'grab';
      }
    });

    // Touch support for Mobile
    canvas2D.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging2D = true;
        isUserInteracting = true;
        lastUserInteraction = Date.now();
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        dragRotY = currentRotY;
        dragTiltX = currentTiltX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging2D || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStartX;
      const dy = e.touches[0].clientY - dragStartY;
      currentRotY = dragRotY + dx * 0.007;
      currentTiltX = Math.max(-0.4, Math.min(0.4, dragTiltX - dy * 0.005));
      lastUserInteraction = Date.now();
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging2D) {
        isDragging2D = false;
        isUserInteracting = false;
        lastUserInteraction = Date.now();
      }
    });

    // Setup Ribbon & Callout UI
    setupOverlayElements(container.parentElement);

    // Initial Selection
    selectDestination('USA', false);

    // Start 2D Render Loop
    lastSwitchTime = performance.now();
    animateCanvas2D();
    setupGlobeVisibilityObserver(container);
  }

  function animateCanvas2D() {
    if (!isGlobeVisible) {
      animFrameId = null;
      return;
    }
    animFrameId = requestAnimationFrame(animateCanvas2D);
    if (!ctx2D || !canvas2D) return;

    const now = performance.now();
    const timeSec = now * 0.001;

    // Handle Smooth Transition
    if (isTransitioning) {
      const elapsed = now - transitionStartTime;
      const progress = Math.min(elapsed / TRANSITION_DURATION, 1.0);
      const eased = easeInOutCubic(progress);

      currentRotY = startRotY + (targetRotY - startRotY) * eased;
      currentTiltX = startTiltX + (targetTiltX - startTiltX) * eased;

      if (progress >= 1.0) {
        isTransitioning = false;
        currentRotY = normalizeAngle(currentRotY);
        lastSwitchTime = now;
      }
    } else {
      const timeSinceLast = Date.now() - lastUserInteraction;
      const canRotate = !isUserInteracting && !isHoverPaused && (timeSinceLast > 2500);

      if (canRotate && !prefersReducedMotion) {
        currentRotY += 0.0006;
        if (now - lastSwitchTime > (TRANSITION_DURATION + HOLD_DURATION)) {
          const nextIndex = (activeDestIndex + 1) % DESTINATION_ORDER.length;
          selectDestination(DESTINATION_ORDER[nextIndex], false);
        }
      }
    }

    // Canvas Dimensions & Scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas2D.width / dpr;
    const h = canvas2D.height / dpr;
    const cx = w / 2;
    const cy = h / 2 - 8;
    const R = Math.min(w, h) * 0.38;

    ctx2D.save();
    ctx2D.scale(dpr, dpr);
    ctx2D.clearRect(0, 0, w, h);

    // 1. Soft Contact Shadow Below Globe
    ctx2D.save();
    ctx2D.beginPath();
    ctx2D.ellipse(cx, cy + R * 1.08, R * 0.95, R * 0.18, 0, 0, Math.PI * 2);
    const shadowGrad = ctx2D.createRadialGradient(cx, cy + R * 1.08, 0, cx, cy + R * 1.08, R * 0.95);
    shadowGrad.addColorStop(0, 'rgba(13, 36, 19, 0.22)');
    shadowGrad.addColorStop(0.5, 'rgba(13, 36, 19, 0.08)');
    shadowGrad.addColorStop(1, 'transparent');
    ctx2D.fillStyle = shadowGrad;
    ctx2D.fill();
    ctx2D.restore();

    // 2. Outer Atmospheric Azure/Cyan Rim Glow (Earth Rayleigh Scattering)
    ctx2D.save();
    ctx2D.beginPath();
    ctx2D.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
    const glowGrad = ctx2D.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.08);
    glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    glowGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.12)');
    glowGrad.addColorStop(1, 'transparent');
    ctx2D.fillStyle = glowGrad;
    ctx2D.fill();
    ctx2D.restore();

    // 3. Shaded Spherical Ocean Body (Deep Vibrant Earth Marine Blue Palette)
    ctx2D.save();
    ctx2D.beginPath();
    ctx2D.arc(cx, cy, R, 0, Math.PI * 2);
    const oceanGrad = ctx2D.createRadialGradient(cx - R * 0.32, cy - R * 0.32, R * 0.05, cx, cy, R);
    oceanGrad.addColorStop(0, '#1E5FA8'); // Sunlit bright marine blue
    oceanGrad.addColorStop(0.38, '#12427C'); // Vibrant royal ocean blue
    oceanGrad.addColorStop(0.85, '#0A2852'); // Shaded ocean limb
    oceanGrad.addColorStop(1, '#05162E'); // Deep oceanic edge
    ctx2D.fillStyle = oceanGrad;
    ctx2D.fill();

    // Subtle Outer Sphere Border
    ctx2D.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx2D.lineWidth = 1.5;
    ctx2D.stroke();

    // Clip to spherical disk for countries & routes
    ctx2D.clip();

    // 4. Subtle Latitude / Longitude Curvature Grid Lines
    ctx2D.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx2D.lineWidth = 1;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx2D.beginPath();
      let first = true;
      for (let lon = -180; lon <= 180; lon += 6) {
        const pt = projectOrthographic(lat, lon, currentRotY, currentTiltX, cx, cy, R);
        if (pt.isVisible) {
          if (first) { ctx2D.moveTo(pt.x, pt.y); first = false; }
          else { ctx2D.lineTo(pt.x, pt.y); }
        } else {
          first = true;
        }
      }
      ctx2D.stroke();
    }

    // 5. Render All Earth Continents from WORLD_LAND_GEO with realistic biomes
    const worldLand = (typeof window !== 'undefined' ? window.WORLD_LAND_GEO : null) || [];
    worldLand.forEach((polygon) => {
      if (!polygon || polygon.length < 3) return;

      let anyVisible = false;
      const projectedPts = [];
      let sumLat = 0, sumLon = 0;

      polygon.forEach((coord) => {
        sumLon += coord[0];
        sumLat += coord[1];
        const pt = projectOrthographic(coord[1], coord[0], currentRotY, currentTiltX, cx, cy, R);
        if (pt.isVisible) anyVisible = true;
        projectedPts.push(pt);
      });

      if (!anyVisible) return;

      const avgLat = sumLat / polygon.length;
      const avgLon = sumLon / polygon.length;

      let landColor = '#2D6A4F'; // Rich vegetative forest green
      let strokeColor = 'rgba(30, 85, 50, 0.35)';

      if (avgLat > 60 || avgLat < -58) {
        landColor = '#E2E8F0'; // Polar ice / tundra
        strokeColor = 'rgba(203, 213, 225, 0.4)';
      } else if (avgLat >= 12 && avgLat <= 34 && ((avgLon >= -18 && avgLon <= 55) || (avgLon >= 115 && avgLon <= 145))) {
        landColor = '#C29B38'; // Desert Sahara / Arabia
        strokeColor = 'rgba(180, 140, 45, 0.35)';
      }

      ctx2D.beginPath();
      projectedPts.forEach((pt, idx) => {
        if (idx === 0) ctx2D.moveTo(pt.x, pt.y);
        else ctx2D.lineTo(pt.x, pt.y);
      });
      ctx2D.closePath();
      ctx2D.fillStyle = landColor;
      ctx2D.fill();
      ctx2D.strokeStyle = strokeColor;
      ctx2D.lineWidth = 0.8;
      ctx2D.stroke();
    });

    // Render Trade Countries from GeoJSON Data
    const geoData = (typeof window !== 'undefined' ? window.TRADE_COUNTRIES_GEO : null) || {};

    Object.keys(geoData).forEach((destId) => {
      const country = geoData[destId];
      if (!country || !country.rings) return;

      const isCurrentActive = (destId === activeDestId);
      const isOrigin = (destId === 'INDIA');

      country.rings.forEach((ring) => {
        if (!ring || ring.length < 3) return;

        let anyVisible = false;
        const projectedPts = [];

        ring.forEach((coord) => {
          const pt = projectOrthographic(coord[1], coord[0], currentRotY, currentTiltX, cx, cy, R);
          if (pt.isVisible) anyVisible = true;
          projectedPts.push(pt);
        });

        if (!anyVisible) return;

        ctx2D.beginPath();
        projectedPts.forEach((pt, idx) => {
          if (idx === 0) ctx2D.moveTo(pt.x, pt.y);
          else ctx2D.lineTo(pt.x, pt.y);
        });
        ctx2D.closePath();

        if (isCurrentActive) {
          // Highlighted active destination: vibrant luminous cyan or gold for origin
          ctx2D.fillStyle = isOrigin ? '#F59E0B' : '#38BDF8';
          ctx2D.fill();
          ctx2D.strokeStyle = '#FFFFFF';
          ctx2D.lineWidth = 2.2;
          ctx2D.stroke();
        } else {
          // Inactive trade country: clean natural green with subtle cyan outline
          ctx2D.fillStyle = '#2A7246';
          ctx2D.fill();
          ctx2D.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx2D.lineWidth = 1.0;
          ctx2D.stroke();
        }
      });
    });

    // 6. Draw Direct Trade Corridors (Curved Arcs from India)
    const indiaDest = DESTINATIONS.INDIA;
    const originPt = projectOrthographic(indiaDest.lat, indiaDest.lon, currentRotY, currentTiltX, cx, cy, R);

    Object.keys(DESTINATIONS).forEach((destId) => {
      if (destId === 'INDIA') return;

      const targetDest = DESTINATIONS[destId];
      const targetPt = projectOrthographic(targetDest.lat, targetDest.lon, currentRotY, currentTiltX, cx, cy, R);
      const isCurrentActive = (destId === activeDestId);

      // Draw arc if either origin or target is in front hemisphere
      if (originPt.isVisible || targetPt.isVisible) {
        ctx2D.beginPath();
        const segments = 24;
        let arcVisible = false;

        for (let s = 0; s <= segments; s++) {
          const t = s / segments;
          const iLat = indiaDest.lat + (targetDest.lat - indiaDest.lat) * t;
          const iLon = indiaDest.lon + (targetDest.lon - indiaDest.lon) * t;
          const pt = projectOrthographic(iLat, iLon, currentRotY, currentTiltX, cx, cy, R);

          // Elevate arc peak above surface
          const alt = Math.sin(t * Math.PI) * 18;
          const nx = (pt.x - cx) / Math.max(1, Math.hypot(pt.x - cx, pt.y - cy));
          const ny = (pt.y - cy) / Math.max(1, Math.hypot(pt.x - cx, pt.y - cy));
          const elevatedX = pt.x + nx * alt;
          const elevatedY = pt.y + ny * alt;

          if (s === 0) {
            ctx2D.moveTo(elevatedX, elevatedY);
          } else {
            ctx2D.lineTo(elevatedX, elevatedY);
          }
          if (pt.isVisible) arcVisible = true;
        }

        if (arcVisible) {
          ctx2D.save();
          if (isCurrentActive) {
            ctx2D.strokeStyle = '#38BDF8';
            ctx2D.lineWidth = 2.4;
            ctx2D.setLineDash([6, 3]);
            ctx2D.shadowColor = '#38BDF8';
            ctx2D.shadowBlur = 8;
            ctx2D.stroke();
          } else {
            ctx2D.strokeStyle = 'rgba(30, 64, 175, 0.32)';
            ctx2D.lineWidth = 1.2;
            ctx2D.setLineDash([4, 4]);
            ctx2D.stroke();
          }
          ctx2D.restore();
        }
      }
    });

    // 7. Draw Flowing Photons along Active Trade Corridor
    const activeDest = DESTINATIONS[activeDestId];
    if (activeDest && activeDestId !== 'INDIA') {
      photon2DProgress = (photon2DProgress + 0.008) % 1.0;
      const pLat = indiaDest.lat + (activeDest.lat - indiaDest.lat) * photon2DProgress;
      const pLon = indiaDest.lon + (activeDest.lon - indiaDest.lon) * photon2DProgress;
      const pPt = projectOrthographic(pLat, pLon, currentRotY, currentTiltX, cx, cy, R);

      if (pPt.isVisible) {
        const alt = Math.sin(photon2DProgress * Math.PI) * 18;
        const nx = (pPt.x - cx) / Math.max(1, Math.hypot(pPt.x - cx, pPt.y - cy));
        const ny = (pPt.y - cy) / Math.max(1, Math.hypot(pPt.x - cx, pPt.y - cy));
        const px = pPt.x + nx * alt;
        const py = pPt.y + ny * alt;

        ctx2D.save();
        ctx2D.beginPath();
        ctx2D.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx2D.fillStyle = '#38BDF8';
        ctx2D.shadowColor = '#38BDF8';
        ctx2D.shadowBlur = 10;
        ctx2D.fill();
        ctx2D.restore();
      }
    }

    // 8. Spherical Specular Sheen (Translucent Glass Highlight)
    const glassGrad = ctx2D.createLinearGradient(cx - R * 0.8, cy - R * 0.8, cx + R * 0.8, cy + R * 0.8);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.40)');
    glassGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.10)');
    glassGrad.addColorStop(0.7, 'transparent');
    glassGrad.addColorStop(1, 'rgba(11, 37, 69, 0.18)');
    ctx2D.fillStyle = glassGrad;
    ctx2D.fillRect(cx - R, cy - R, R * 2, R * 2);

    ctx2D.restore(); // restore clipping

    // 9. Draw Location Pins on Top of Sphere
    let activePinScreenPos = null;

    Object.keys(DESTINATIONS).forEach((destId) => {
      const dest = DESTINATIONS[destId];
      const pt = projectOrthographic(dest.lat, dest.lon, currentRotY, currentTiltX, cx, cy, R);
      if (!pt.isVisible) return;

      const isCurrentActive = (destId === activeDestId);
      const isOrigin = !!dest.isOrigin;

      // Pulse ring on pin base
      const pulse = (Math.sin(timeSec * 4 + (dest.lon % 5)) * 0.5 + 0.5);
      const pulseRadius = 6 + pulse * (isCurrentActive ? 12 : 5);
      const pulseAlpha = (1 - pulse) * (isCurrentActive ? 0.85 : 0.4);

      ctx2D.save();
      ctx2D.beginPath();
      ctx2D.arc(pt.x, pt.y, pulseRadius, 0, Math.PI * 2);
      ctx2D.strokeStyle = isOrigin ? `rgba(245, 158, 11, ${pulseAlpha})` : `rgba(56, 189, 248, ${pulseAlpha})`;
      ctx2D.lineWidth = 1.5;
      ctx2D.stroke();

      // Pin Pinhead
      ctx2D.beginPath();
      const headR = isCurrentActive ? 6.5 : (isOrigin ? 5.5 : 4.5);
      ctx2D.arc(pt.x, pt.y, headR, 0, Math.PI * 2);
      ctx2D.fillStyle = isCurrentActive ? (isOrigin ? '#F59E0B' : '#38BDF8') : (isOrigin ? '#F59E0B' : '#FFFFFF');
      ctx2D.shadowColor = isCurrentActive ? (isOrigin ? '#F59E0B' : '#38BDF8') : 'rgba(14, 42, 80, 0.2)';
      ctx2D.shadowBlur = isCurrentActive ? 10 : 4;
      ctx2D.fill();
      ctx2D.strokeStyle = isCurrentActive ? '#FFFFFF' : '#0B2545';
      ctx2D.lineWidth = 1.8;
      ctx2D.stroke();
      ctx2D.restore();

      // Pin Label Chip
      if (isCurrentActive || pt.cosC > 0.45) {
        ctx2D.save();
        ctx2D.font = isCurrentActive ? 'bold 11px Outfit, sans-serif' : '600 10px sans-serif';
        const labelText = `${dest.flag} ${dest.name}`;
        const textWidth = ctx2D.measureText(labelText).width;
        const chipPadX = 7;
        const chipPadY = 4;
        const chipW = textWidth + chipPadX * 2;
        const chipH = 20;
        const chipX = pt.x + 10;
        const chipY = pt.y - 12;

        ctx2D.beginPath();
        ctx2D.roundRect(chipX, chipY, chipW, chipH, 10);
        ctx2D.fillStyle = isCurrentActive ? '#062040' : 'rgba(255, 255, 255, 0.95)';
        ctx2D.shadowColor = 'rgba(11, 37, 69, 0.12)';
        ctx2D.shadowBlur = 6;
        ctx2D.fill();
        ctx2D.strokeStyle = isCurrentActive ? '#38BDF8' : 'rgba(56, 189, 248, 0.4)';
        ctx2D.lineWidth = 1.2;
        ctx2D.stroke();

        ctx2D.fillStyle = isCurrentActive ? '#FFFFFF' : '#0284C7';
        ctx2D.textBaseline = 'middle';
        ctx2D.fillText(labelText, chipX + chipPadX, chipY + chipH / 2);
        ctx2D.restore();

        if (isCurrentActive) {
          activePinScreenPos = { x: pt.x, y: pt.y };
        }
      }
    });

    // 10. Update Hover Info Card for Active Destination
    if (hoverCard && activePinScreenPos) {
      const cardOffsetDist = 58;
      const cardX = activePinScreenPos.x + cardOffsetDist;
      const cardY = activePinScreenPos.y - cardOffsetDist;

      hoverCard.style.left = `${cardX}px`;
      hoverCard.style.top = `${cardY}px`;
      hoverCard.classList.add('visible');

      const hFlag = document.getElementById('hover-card-flag');
      const hCountry = document.getElementById('hover-card-country');
      const hCorridor = document.getElementById('hover-card-corridor');
      const hTransit = document.getElementById('hover-card-transit');
      const hGoods = document.getElementById('hover-card-goods');
      const hHub = document.getElementById('hover-card-hub') || document.getElementById('hover-card-port');

      const dest = DESTINATIONS[activeDestId];
      if (dest) {
        if (hFlag) hFlag.textContent = dest.flag;
        if (hCountry) hCountry.textContent = dest.name;
        if (hCorridor) hCorridor.textContent = dest.corridor;
        if (hTransit) hTransit.textContent = dest.transit;
        if (hGoods) hGoods.textContent = dest.goods;
        if (hHub) hHub.textContent = dest.hub;
      }
    }

    ctx2D.restore();
  }

  // ==========================================================================
  // SHARED PUBLIC CONTROLLER & SYNCHRONIZATION
  // ==========================================================================
  function selectDestination(destId, manualInteraction = false) {
    const dest = DESTINATIONS[destId];
    if (!dest) return;

    activeDestId = destId;
    activeDestIndex = DESTINATION_ORDER.indexOf(destId);

    // Easing rotation parameters
    startRotY = currentRotY;
    startTiltX = currentTiltX;
    targetRotY = dest.focusRotY || 0;
    targetTiltX = dest.focusTiltX || 0.1;

    transitionStartTime = performance.now();
    isTransitioning = true;

    if (manualInteraction) {
      lastUserInteraction = Date.now();
    }
    lastSwitchTime = performance.now();

    // 1. Update Ribbon Active State
    const ribbonButtons = document.querySelectorAll('.country-ribbon-btn');
    ribbonButtons.forEach((btn) => {
      const btnDest = btn.getAttribute('data-dest');
      if (btnDest === destId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Update Direct Corridor Lines (WebGL Mode)
    if (activeEngineMode === 'webgl') {
      Object.keys(directCorridorLines).forEach((id) => {
        const arc = directCorridorLines[id];
        if (id === destId) {
          arc.material.color.setHex(0x38BDF8);
          arc.material.opacity = 0.95;
          arc.material.dashSize = 5;
        } else {
          arc.material.color.setHex(0x1E40AF);
          arc.material.opacity = 0.32;
          arc.material.dashSize = 3.5;
        }
        arc.material.needsUpdate = true;
      });

      Object.keys(pinObjects).forEach((id) => {
        const pin = pinObjects[id];
        pin.targetScale = (id === destId) ? 1.38 : 1.0;
      });
    }

    // 3. Update Bottom Telemetry Status Bar
    const flagEl = document.getElementById('bar-dest-flag');
    const nameEl = document.getElementById('bar-dest-name');
    const transitEl = document.getElementById('bar-dest-transit');

    if (flagEl) flagEl.textContent = dest.flag;
    if (nameEl) nameEl.textContent = `${dest.name} — ${dest.corridor}`;
    if (transitEl) transitEl.textContent = dest.transit;
  }

  // Responsive Container Resize Handler
  function onWindowResize() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container) return;

    const width = Math.max(container.clientWidth || 0, container.parentElement ? container.parentElement.clientWidth : 0, 320);
    const height = Math.max(container.clientHeight || 0, 320);

    if (activeEngineMode === 'webgl') {
      if (renderer && camera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        updateOverlayPositions();
      }
    } else if (activeEngineMode === 'canvas2d' && canvas2D) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas2D.width = Math.round(width * dpr);
      canvas2D.height = Math.round(height * dpr);
      canvas2D.style.width = width + 'px';
      canvas2D.style.height = height + 'px';
    }
  }

  // ==========================================================================
  // MASTER INITIALIZATION ENTRY POINT
  // ==========================================================================
  function initGlobe() {
    const container = document.getElementById('shipyon-3d-globe-container');
    if (!container) return;

    const width = Math.max(container.clientWidth || 0, container.parentElement ? container.parentElement.clientWidth : 0, 560);
    const height = Math.max(container.clientHeight || 0, 520);

    // Try Tier 1: Safe WebGL Renderer
    renderer = createSafeWebGLRenderer(container, width, height);

    if (renderer) {
      console.log('✓ Shipyon Globe: WebGL 3D Engine initialized successfully.');
      initWebGLGlobe(container, width, height);
    } else {
      console.warn('⚠ WebGL unavailable in current browser environment. Launching Tier 2 Canvas 2D Interactive Globe.');
      initCanvas2DFallbackGlobe(container, width, height);
    }

    // Attach ResizeObserver to auto-sync size as container expands
    if (typeof ResizeObserver !== 'undefined') {
      try {
        const ro = new ResizeObserver(() => onWindowResize());
        ro.observe(container);
        if (container.parentElement) ro.observe(container.parentElement);
      } catch (e) {}
    }
  }

  function startGlobe() {
    initGlobe();
    setTimeout(onWindowResize, 80);
    setTimeout(onWindowResize, 350);
    setTimeout(onWindowResize, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGlobe);
  } else {
    startGlobe();
  }

  window.addEventListener('load', onWindowResize);

  // Clean up WebGL context when navigating or reloading to protect Safari's context quota
  window.addEventListener('beforeunload', () => {
    if (renderer && renderer.forceContextLoss) {
      try { renderer.forceContextLoss(); } catch (e) {}
    }
  });

  // Export Unified Public API on both window.ShipyonGlobe and window.ShipyonGlobeEngine
  const publicApi = {
    initGlobe: initGlobe,
    selectDestination: selectDestination,
    getDestinations: () => DESTINATIONS,
    getActiveDestId: () => activeDestId,
    getActiveEngine: () => activeEngineMode,
    onWindowResize: onWindowResize,
    onSectionMouseMove: function (normX, normY) {
      if (!isGlobeVisible) return;
      if (activeEngineMode === 'webgl' && earthGroup) {
        earthGroup.rotation.x = currentTiltX + normY * 0.12;
      } else if (activeEngineMode === 'canvas2d') {
        currentTiltX = Math.max(-0.4, Math.min(0.4, DESTINATIONS[activeDestId].focusTiltX + normY * 0.12));
      }
    }
  };

  window.ShipyonGlobe = publicApi;
  window.ShipyonGlobeEngine = publicApi;

})();
