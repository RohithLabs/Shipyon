/* ==========================================================================
   SHIPYON — ARCHITECTURAL INTERACTIVE ENGINE
   Awwwards & Stitch Motion Standards: Floating Nav Sync, Cinema Scale Scrub,
   Waterfall Cascade Stagger & Tactical Trade Form Handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Respect user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 0. Lenis Momentum Smooth Scrolling Engine ---
    let lenis = null;
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        try {
            lenis = new Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.8,
                infinite: false
            });

            // Sync Lenis with GSAP ScrollTrigger
            if (typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
            }

            if (typeof gsap !== 'undefined') {
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            } else {
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            }
        } catch (err) {
            console.warn('Lenis initialization bypassed:', err);
        }
    }

    // --- 1. Accessible Mobile Navigation Drawer ---
    const navToggle = document.getElementById('nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');

    if (navToggle && mobileDrawer && drawerBackdrop) {
        const toggleDrawer = (open) => {
            const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
            mobileDrawer.classList.toggle('open', isOpen);
            drawerBackdrop.classList.toggle('open', isOpen);
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        navToggle.addEventListener('click', () => toggleDrawer());
        drawerBackdrop.addEventListener('click', () => toggleDrawer(false));

        // Close drawer on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                toggleDrawer(false);
            }
        });

        // Close on nav link click in drawer
        mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => toggleDrawer(false));
        });
    }

    // --- 2. Floating Header Scroll Elevation ---
    const header = document.getElementById('main-header');
    if (header) {
        const handleHeaderScroll = () => {
            if (window.scrollY > 25) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleHeaderScroll, { passive: true });
        handleHeaderScroll();
    }

    // --- 3. Active Link Synchronization ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- 4. Interactive Bento Portfolio Category Filtering ---
    const filterChips = document.querySelectorAll('.filter-chip');
    const bentoCards = document.querySelectorAll('.gapless-bento-grid .bento-card');

    if (filterChips.length > 0 && bentoCards.length > 0) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.getAttribute('data-filter');

                // Toggle active state on buttons
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                // Filter cards with smooth presentation
                bentoCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || cardCat === filter;

                    if (shouldShow) {
                        card.style.display = '';
                        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                            gsap.fromTo(card, 
                                { opacity: 0, scale: 0.96 }, 
                                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                            );
                        } else {
                            card.style.opacity = '1';
                        }
                    } else {
                        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                            gsap.to(card, {
                                opacity: 0,
                                scale: 0.96,
                                duration: 0.25,
                                ease: 'power2.in',
                                onComplete: () => {
                                    card.style.display = 'none';
                                    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                                }
                            });
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });

                if (typeof ScrollTrigger !== 'undefined') {
                    setTimeout(() => ScrollTrigger.refresh(), 300);
                }
            });
        });
    }

    // --- 5. Interactive Global Maritime Radar Corridor Switcher ---
    const corridorTabs = document.querySelectorAll('.corridor-tab');
    const routeLanes = document.querySelectorAll('.radar-viewport .route-lane');
    const corridorHuds = document.querySelectorAll('.corridor-hud-box');
    const hubCircles = document.querySelectorAll('.radar-viewport .hub-circle');

    if (corridorTabs.length > 0) {
        corridorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetCorridor = tab.getAttribute('data-corridor');

                // Update active tab state
                corridorTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                if (targetCorridor === 'all') {
                    // Reset all corridors to standard visibility
                    routeLanes.forEach(lane => {
                        lane.classList.remove('highlighted');
                        lane.style.opacity = '0.9';
                        lane.style.stroke = '#82B29A';
                        lane.style.strokeWidth = '2.2';
                    });
                    corridorHuds.forEach(hud => {
                        hud.classList.remove('active');
                        hud.style.opacity = '1';
                    });
                    hubCircles.forEach(hub => {
                        hub.style.fill = '#82B29A';
                        hub.setAttribute('r', '4.5');
                    });
                } else {
                    // Highlight selected corridor, dim unselected
                    routeLanes.forEach(lane => {
                        if (lane.id === `lane-${targetCorridor}`) {
                            lane.classList.add('highlighted');
                            lane.style.opacity = '1';
                            lane.style.stroke = '#D24329'; // Terracotta accent
                            lane.style.strokeWidth = '3.5';
                        } else {
                            lane.classList.remove('highlighted');
                            lane.style.opacity = '0.18';
                            lane.style.stroke = '#82B29A';
                            lane.style.strokeWidth = '1.2';
                        }
                    });

                    // Highlight destination hub
                    hubCircles.forEach(hub => {
                        if (hub.id === `hub-${targetCorridor}`) {
                            hub.style.fill = '#D24329';
                            hub.setAttribute('r', '7.5');
                        } else {
                            hub.style.fill = '#82B29A';
                            hub.setAttribute('r', '3.5');
                        }
                    });

                    // Highlight corresponding HUD card
                    corridorHuds.forEach(hud => {
                        if (hud.id === `hud-${targetCorridor}`) {
                            hud.classList.add('active');
                            hud.style.opacity = '1';
                        } else {
                            hud.classList.remove('active');
                            hud.style.opacity = '0.45';
                        }
                    });
                }
            });
        });
    }

    // --- 6. Interactive Container Allocation & Tonnage Simulator ---
    const tonnageSlider = document.getElementById('tonnage-slider');
    const tonnageDisplay = document.getElementById('calc-tonnage-display');
    const containersDisplay = document.getElementById('calc-containers');
    const tempDisplay = document.getElementById('calc-temp');
    const readinessDisplay = document.getElementById('calc-readiness');
    const originPortDisplay = document.getElementById('calc-origin-port');
    const applyCalcBtn = document.getElementById('apply-calc-btn');
    const productSelect = document.getElementById('contact-product');
    const detailsTextarea = document.getElementById('contact-details');

    if (tonnageSlider && tonnageDisplay && containersDisplay) {
        const updateAllocationCalculator = () => {
            const tonnage = parseInt(tonnageSlider.value, 10);
            tonnageDisplay.textContent = `${tonnage} MT`;

            // Standard 40ft HC Reefer / FCL loads ~24-25 MT
            const reefersNeeded = Math.ceil(tonnage / 25);
            containersDisplay.textContent = `${reefersNeeded}x 40ft High Cube`;

            // Dynamic lead time calculation
            if (readinessDisplay) {
                if (tonnage <= 100) {
                    readinessDisplay.textContent = '48h Farmgate Load';
                } else if (tonnage <= 250) {
                    readinessDisplay.textContent = '72h Multi-Origin Pack';
                } else {
                    readinessDisplay.textContent = '5-Day Dedicated Block';
                }
            }

            // Atmosphere protocol based on selected commodity
            if (tempDisplay) {
                const selectedProd = productSelect ? productSelect.value : '';
                if (selectedProd.includes('spices')) {
                    tempDisplay.textContent = 'Ambient Dry (18°C/60%RH)';
                } else if (selectedProd.includes('processed')) {
                    tempDisplay.textContent = '+12.0°C Controlled';
                } else if (selectedProd.includes('textiles') || selectedProd.includes('castings')) {
                    tempDisplay.textContent = 'Standard Dry Marine';
                } else {
                    tempDisplay.textContent = '+4.0°C CA Controlled';
                }
            }
        };

        tonnageSlider.addEventListener('input', updateAllocationCalculator);

        if (productSelect) {
            productSelect.addEventListener('change', updateAllocationCalculator);
        }

        // Apply Specs directly to trade dossier form
        if (applyCalcBtn && detailsTextarea) {
            applyCalcBtn.addEventListener('click', () => {
                const tonnage = tonnageSlider.value;
                const reefers = Math.ceil(tonnage / 25);
                const tempSpec = tempDisplay ? tempDisplay.textContent : '+4.0°C CA Controlled';
                const readiness = readinessDisplay ? readinessDisplay.textContent : '48h Farmgate Load';
                const originPort = originPortDisplay ? originPortDisplay.textContent : 'INMAA (Chennai) Express';

                const generatedSpec = `ALLOCATION REQUIREMENT:\n- Target Volume: ${tonnage} Metric Tons\n- Reefer Fleet: ${reefers}x 40ft High Cube Reefers\n- Atmosphere Standard: ${tempSpec}\n- Preferred Loading Gateway: ${originPort}\n- Target Dispatch Window: ${readiness}`;

                detailsTextarea.value = generatedSpec;

                // Visual focus feedback
                detailsTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                detailsTextarea.focus();
                detailsTextarea.style.borderColor = 'var(--color-botanical)';
                detailsTextarea.style.boxShadow = '0 0 0 3px rgba(53, 107, 77, 0.2)';

                setTimeout(() => {
                    detailsTextarea.style.borderColor = '';
                    detailsTextarea.style.boxShadow = '';
                }, 1600);
            });
        }
    }

    // --- 7. URL Parameter Pre-selection & Contact Form Feedback ---
    if (productSelect) {
        const urlParams = new URLSearchParams(window.location.search);
        const cat = urlParams.get('cat');
        if (cat) {
            const matchingOption = Array.from(productSelect.options).find(opt => 
                opt.value.includes(cat) || cat.includes(opt.value)
            );
            if (matchingOption) {
                matchingOption.selected = true;
                if (tonnageSlider) {
                    tonnageSlider.dispatchEvent(new Event('input'));
                }
            }
        }
    }

    const enquiryForm = document.getElementById('trade-enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = enquiryForm.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Transmitting Dossier to Sovereign Trade Desk...';

            setTimeout(() => {
                const refNum = 'SPY-' + Math.floor(100000 + Math.random() * 900000);
                enquiryForm.innerHTML = `
                    <div style="text-align: center; padding: 3rem 1.5rem;">
                        <div style="width: 60px; height: 60px; background: var(--sea-glass-soft); border: 1.5px solid var(--color-botanical); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--color-botanical); font-size: 1.6rem; font-weight: 700;">&#10003;</div>
                        <h3 style="font-size: 1.95rem; color: var(--text-primary); margin-bottom: 0.75rem; font-family: var(--font-serif); font-weight: 500;">Trade Requirement Transmitted</h3>
                        <p style="color: var(--text-secondary); font-size: 1.02rem; margin-bottom: 1.85rem; max-width: 460px; margin-left: auto; margin-right: auto; line-height: 1.7;">
                            Thank you. Your dossier has been logged under priority reference <strong style="color: var(--color-botanical);">${refNum}</strong>. A trade representative from our India Origin HQ or Europe Desk will review your parameters and follow up shortly.
                        </p>
                        <a href="index.html" class="btn-corp">Return to Main Terminal &rarr;</a>
                    </div>
                `;
            }, 650);
        });
    }

    // --- 8. Advanced GSAP Motion Engine (Section 08 Calibration) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Asymmetric Hero Entrance (Section 06 Master Orchestration: 600-850ms)
        const asymmetricHero = document.querySelector('.hero-asymmetric-grid');
        if (asymmetricHero) {
            const heroTl = gsap.timeline({
                defaults: { ease: 'power2.out' }
            });

            heroTl
                .from('.hero-telemetry-badge', { opacity: 0, y: 10, duration: 0.45 })
                .from('.hero-asymmetric-title', { opacity: 0, y: 16, duration: 0.65 }, '-=0.3');

            if (document.querySelectorAll('.inline-photo-pill').length > 0) {
                heroTl.from('.inline-photo-pill', {
                    scale: 0.7,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out'
                }, '-=0.4');
            }

            heroTl
                .from('.hero-asymmetric-desc', { opacity: 0, y: 12, duration: 0.55 }, '-=0.35')
                .from('.hero-asymmetric-actions', { opacity: 0, y: 12, duration: 0.5 }, '-=0.4')
                .from('.hero-asymmetric-metrics .metric-block', {
                    opacity: 0,
                    y: 10,
                    duration: 0.45,
                    stagger: 0.08
                }, '-=0.35')
                .from('.hero-primary-photo-wrap', {
                    opacity: 0,
                    scale: 0.98,
                    duration: 0.75,
                    ease: 'power3.out'
                }, '-=0.6')
                .from('.hero-origin-inset', {
                    opacity: 0,
                    y: 16,
                    duration: 0.55,
                    ease: 'power2.out'
                }, '-=0.4')
                .from('.hero-floating-hud', {
                    opacity: 0,
                    y: -10,
                    duration: 0.45
                }, '-=0.35');
        }

        // Inner Pages Center Hero Entrance
        const centerHero = document.querySelector('.hero-center-container');
        if (centerHero) {
            const centerTl = gsap.timeline({
                defaults: { ease: 'power2.out', duration: 0.65 }
            });

            centerTl
                .from('.hero-telemetry-badge', { opacity: 0, y: 10, duration: 0.45 })
                .from('.cinematic-title', { opacity: 0, y: 16, duration: 0.65 }, '-=0.3')
                .from('.hero-subtitle', { opacity: 0, y: 12, duration: 0.55 }, '-=0.35')
                .from('.hero-actions-center', { opacity: 0, y: 12, duration: 0.5 }, '-=0.4')
                .from('.hero-panoramic-frame', { opacity: 0, y: 18, duration: 0.75, ease: 'power3.out' }, '-=0.5');
        }

        // Restrained Photographic Scrub on Scroll (Performance Safe)
        const mediaContainer = document.querySelector('.hero-media-composition, .hero-panoramic-frame');
        const mediaImg = document.querySelector('.hero-primary-photo-wrap img, .panoramic-img');
        if (mediaContainer && mediaImg) {
            gsap.to(mediaImg, {
                scrollTrigger: {
                    trigger: mediaContainer,
                    start: 'top 85%',
                    end: 'bottom top',
                    scrub: 1
                },
                scale: 1.06,
                yPercent: 3,
                ease: 'none'
            });
        }

        // Gapless Bento & Pipeline Waterfall Staggers
        const gridContainers = document.querySelectorAll(
            '.gapless-bento-grid, .pipeline-grid, .leadership-editorial-grid, .corridor-hud-grid'
        );

        gridContainers.forEach((grid) => {
            const items = grid.children;
            if (items.length > 0) {
                gsap.from(items, {
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 22,
                    duration: 0.75,
                    stagger: 0.12,
                    ease: 'power2.out'
                });
            }
        });

        // Individual Module Reveals
        const singleModules = document.querySelectorAll(
            '.desk-channel-card, .tonnage-calc-card, .trade-form-panel, .radar-viewport'
        );

        singleModules.forEach((mod) => {
            gsap.from(mod, {
                scrollTrigger: {
                    trigger: mod,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 18,
                duration: 0.75,
                ease: 'power2.out'
            });
        });
    }
});
