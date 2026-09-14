/**
 * SHIPYON EXIM — Production Client Script
 * Features: Smooth Scroll, Navigation Spy, Category Filter, B2B Spec Modal, Form Validation & WhatsApp RFQ
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Sticky Header & Scroll Performance (RAF Throttled)
  // ------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (lastScrollY > 30) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state check

  // ------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('visible');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('visible');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ------------------------------------------------------------------------
  // 3. Multi-Page Active Link & Smooth Scroll Navigation Spy
  // ------------------------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.desktop-nav .nav-link, .drawer-menu .drawer-link');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0];
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else if (linkPath && linkPath !== currentPath) {
      link.classList.remove('active');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}` || href.endsWith(`#${currentId}`)) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => navObserver.observe(sec));
  }

  // ------------------------------------------------------------------------
  // 4. Products Category Filter Tabs
  // ------------------------------------------------------------------------
  const catTabs = document.querySelectorAll('.cat-tab');
  const productCards = document.querySelectorAll('.product-card');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const selectedCat = tab.getAttribute('data-cat');

      productCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 5. B2B Product Detail Specification Data & Modal Controller
  // ------------------------------------------------------------------------
  const productCatalogData = {
    'cardamom': {
      name: 'Theni Green Cardamom',
      category: 'Spices & Plantation Crops',
      origin: 'Theni & Idukki Hills (Tamil Nadu & Kerala)',
      availableForms: 'Whole 8mm+ Jumbo Pods, 7mm-8mm Bold, Machine Cleaned',
      specs: 'Moisture: < 10% | Volatile Oil: 7.5% - 8.5% | Color: Deep Emerald Green',
      packaging: '5kg Food-grade vacuum polybags in 10kg/20kg corrugated master cartons',
      moq: '500 Kilograms (Air Cargo) / 20ft FCL (Sea Freight)',
      loadingPort: 'Tuticorin Port (VOC) / Cochin Port / Chennai Port'
    },
    'turmeric': {
      name: 'Erode Turmeric (Finger & Bulb)',
      category: 'Spices & Plantation Crops',
      origin: 'Erode & Sangli (Tamil Nadu & Maharashtra)',
      availableForms: 'Polished Fingers, Unpolished Raw, Bulb Turmeric, Pure Powder',
      specs: 'Curcumin: 3.5% - 4.8% | Moisture: < 10% | Total Ash: < 6.5%',
      packaging: '25kg / 50kg Heavy-duty double-layered Jute or PP bags',
      moq: '5 Metric Tons (LCL) / 1x20ft FCL (18 Metric Tons)',
      loadingPort: 'Tuticorin Port / Chennai Harbor'
    },
    'red-chilly': {
      name: 'Guntur Dry Red Chilly',
      category: 'Spices & Plantation Crops',
      origin: 'Guntur & Warangal (Andhra Pradesh & Telangana)',
      availableForms: 'Teja S17 (High Heat), Sanam S4, Byadgi (High Color), Crushed Flakes',
      specs: 'Heat: 30,000 - 75,000 SHU | ASTA Color: 60 - 120 | Moisture: < 11%',
      packaging: '10kg / 25kg / 40kg Jute bags or customized compressed bales',
      moq: '1x20ft FCL (Approx. 6.5 MT) / 1x40ft HC (Approx. 14 MT)',
      loadingPort: 'Chennai Port / Krishnapatnam Port'
    },
    'basmati-rice': {
      name: 'Traditional Basmati Rice',
      category: 'Grains, Rice & Staples',
      origin: 'Punjab & Haryana Agricultural Plains',
      availableForms: 'Raw Milled, Steam Aged, Creamy Sella, Golden Sella',
      specs: 'Avg Grain Length: 8.35mm+ | Moisture: < 12.5% | Broken Grain: < 1%',
      packaging: '1kg, 5kg, 10kg, 25kg Non-Woven or BOPP retail bags / 50kg Master bags',
      moq: '1x20ft FCL (Approx. 25 Metric Tons)',
      loadingPort: 'Mundra Port / Nhava Sheva (JNPT), Mumbai'
    },
    'coconut': {
      name: 'Pollachi Semi-Husked Coconuts',
      category: 'Fresh Produce & Coconut',
      origin: 'Pollachi, Coimbatore Region (Tamil Nadu)',
      availableForms: 'Semi-Husked Mature Coconuts, Fresh Tender Coconuts, Coco Peat Blocks',
      specs: 'Weight: 550g - 650g per nut | Water Content: High | Anti-fungal Treated',
      packaging: '25 pieces per ventilated poly mesh bag (13.5kg - 15kg per bag)',
      moq: '1x40ft Reefer Container (Approx. 45,000 - 48,000 nuts, 12°C Controlled)',
      loadingPort: 'Tuticorin Port (VOC) / Cochin Port'
    },
    'onion': {
      name: 'Nashik Red Onions',
      category: 'Fresh Farm Produce',
      origin: 'Nashik & Lasalgaon (Maharashtra)',
      availableForms: 'Fresh Red Onions, Medium & Large Export Grade, Small Pink Shallots',
      specs: 'Diameter: 45mm - 60mm+ | Cured Skin | Moisture Tested for Transit',
      packaging: '10kg / 25kg / 50kg Red leno mesh bags on fumigated pallets',
      moq: '1x40ft Reefer Container (Approx. 29 Metric Tons, 0°C to 2°C)',
      loadingPort: 'Nhava Sheva (JNPT), Mumbai'
    },
    'grapes': {
      name: 'Thomson Seedless Table Grapes',
      category: 'Fresh & Dry Fruits',
      origin: 'Nashik & Sangli (Maharashtra)',
      availableForms: 'Fresh Green Thomson Seedless, Black Jumbo, Red Globe',
      specs: 'Brix Level: 16° - 18°+ | Berry Diameter: 16mm - 18mm+ | EU MRL Certified',
      packaging: '4.5kg / 5kg Ventilated cartons with sulfur dioxide preservation pads',
      moq: '1x40ft Reefer Container (Pre-cooled, 0°C - 1°C transit)',
      loadingPort: 'Nhava Sheva (JNPT), Mumbai'
    },
    'mango': {
      name: 'Salem Alphonso & Banganapalli Mangoes',
      category: 'Fresh & Dry Fruits',
      origin: 'Salem, Krishnagiri & Andhra Belts',
      availableForms: 'Naturally Tree-Ripened Fresh Mangoes (Alphonso, Banganapalli, Kesar)',
      specs: 'Weight: 250g - 350g per fruit | Hot Water Treated | APEDA Certified',
      packaging: '3kg / 5kg Export grade corrugated cartons with individual foam netting',
      moq: '1 Metric Ton (Air Express Cargo) / Palletized',
      loadingPort: 'Chennai International Airport Cargo'
    },
    'moringa': {
      name: 'Organic Moringa Leaf Powder',
      category: 'Processed Foods & Eco-Crafts',
      origin: 'Madurai & Theni (Tamil Nadu)',
      availableForms: 'Micro-Fine Green Powder, Cut Leaves, Moringa Seed Oil',
      specs: 'Mesh Size: 80 - 100 Mesh | Moisture: < 7.5% | 100% Additive-Free',
      packaging: '20kg / 25kg Fiber drums with inner food-grade double poly liners',
      moq: '500 Kilograms (Air Freight) / 2 Metric Tons (Sea Freight)',
      loadingPort: 'Tuticorin Port / Chennai Harbor'
    },
    'cotton-tshirts': {
      name: 'Tiruppur Combed Cotton Apparel',
      category: 'Apparel & Heavy Industrial',
      origin: 'Tiruppur Knitwear Capital (Tamil Nadu)',
      availableForms: 'Round Neck T-Shirts, Oversized Heavyweight Tees (220 GSM), Polos',
      specs: '100% Bio-Washed Combed Cotton | Reactive Dyed | Pre-Shrunk AQL 2.5',
      packaging: 'Individual eco-polybag in 5-ply export master cartons (50-100 pcs)',
      moq: '500 Pieces per color / Customized Private Label Tech Packs',
      loadingPort: 'Chennai Port / Tuticorin Port'
    },
    'black-granite': {
      name: 'Krishnagiri Black Granite Slabs',
      category: 'Minerals & Construction',
      origin: 'Krishnagiri & Andhra Pradesh Quarries',
      availableForms: 'Gang-saw Big Slabs, Cutter Slabs, Cut-to-Size Flooring Tiles',
      specs: 'Thickness: 18mm, 20mm, 30mm | Mirror Finish (>90 Gloss) | High Density',
      packaging: 'Heavy-duty fumigated wooden bundles with plastic wrapping',
      moq: '1x20ft Container (Weight limited to 27 MT ~ Approx. 420 sq meters)',
      loadingPort: 'Chennai Harbor (CITPL)'
    },
    'vitrified-tiles': {
      name: 'Morbi Glazed Vitrified Tiles',
      category: 'Ceramics & Construction',
      origin: 'Morbi Ceramics Cluster (Gujarat)',
      availableForms: 'GVT / PGVT Porcelain Tiles, High Gloss, Carving, Matte Finishes',
      specs: 'Sizes: 600x1200mm, 800x1600mm | Water Absorption: < 0.05%',
      packaging: 'Thermocol-cushioned corrugated boxes strapped on wooden pallets',
      moq: '1x20ft FCL Container',
      loadingPort: 'Mundra Port / Kandla Port'
    }
  };

  const modalBackdrop = document.getElementById('product-modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');
  const viewSpecButtons = document.querySelectorAll('.view-spec-btn');
  const requestQuoteButtons = document.querySelectorAll('.request-quote-btn');

  function openProductModal(productId) {
    const item = productCatalogData[productId];
    if (!item) return;

    modalBody.innerHTML = `
      <div class="modal-header-box">
        <span class="modal-cat">${item.category}</span>
        <h3 class="modal-title" id="modal-product-name">${item.name}</h3>
        <p class="modal-origin-line">📍 Provenance: ${item.origin}</p>
      </div>

      <div class="spec-table-grid">
        <div class="spec-table-item">
          <span class="spec-label">Available Forms</span>
          <span class="spec-val">${item.availableForms}</span>
        </div>
        <div class="spec-table-item">
          <span class="spec-label">Key Specifications</span>
          <span class="spec-val">${item.specs}</span>
        </div>
        <div class="spec-table-item">
          <span class="spec-label">Export Packaging</span>
          <span class="spec-val">${item.packaging}</span>
        </div>
        <div class="spec-table-item">
          <span class="spec-label">Minimum Order (MOQ)</span>
          <span class="spec-val">${item.moq}</span>
        </div>
        <div class="spec-table-item" style="grid-column: span 2;">
          <span class="spec-label">Designated Indian Loading Port</span>
          <span class="spec-val">${item.loadingPort}</span>
        </div>
      </div>

      <div class="modal-actions-row">
        <button class="btn btn-primary btn-block modal-rfq-trigger" data-product-name="${item.name}" data-product-cat="${item.category}">
          Request Commercial Quotation for this Commodity &rarr;
        </button>
      </div>
    `;

    // Bind inside button
    const modalRfqTrigger = modalBody.querySelector('.modal-rfq-trigger');
    if (modalRfqTrigger) {
      modalRfqTrigger.addEventListener('click', () => {
        closeProductModal();
        prefillAndScrollToContact(item.name, item.category);
      });
    }

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewSpecButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-product');
      openProductModal(pId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProductModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProductModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeProductModal();
    }
  });

  // ------------------------------------------------------------------------
  // 6. Request Quote Buttons (Pre-fill Form & Smooth Scroll)
  // ------------------------------------------------------------------------
  function prefillAndScrollToContact(productName, productCategory) {
    const contactSection = document.getElementById('contact');
    const categorySelect = document.getElementById('product-category');
    const specMessage = document.getElementById('spec-message');

    if (!contactSection && !categorySelect) {
      // Redirect to contact page with query parameters
      const qParams = new URLSearchParams();
      if (productName) qParams.set('product', productName);
      if (productCategory) qParams.set('category', productCategory);
      window.location.href = `contact.html?${qParams.toString()}#rfq-form`;
      return;
    }

    if (categorySelect && productCategory) {
      for (let i = 0; i < categorySelect.options.length; i++) {
        if (categorySelect.options[i].value.toLowerCase().includes(productCategory.toLowerCase()) || 
            productCategory.toLowerCase().includes(categorySelect.options[i].value.toLowerCase())) {
          categorySelect.selectedIndex = i;
          break;
        }
      }
    }

    if (specMessage && productName) {
      specMessage.value = `Commodity of Interest: ${productName}\nPlease provide current FOB / CIF quotation, laboratory test certificates, and available container allocation schedules.`;
    }

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const qtyInput = document.getElementById('quantity-required');
        if (qtyInput) qtyInput.focus();
      }, 600);
    }
  }

  // Read URL query parameters on page load for RFQ auto-fill
  const urlParams = new URLSearchParams(window.location.search);
  const qProduct = urlParams.get('product');
  const qCategory = urlParams.get('category');
  if (qProduct || qCategory) {
    setTimeout(() => {
      prefillAndScrollToContact(qProduct || '', qCategory || '');
    }, 250);
  }

  const categoryMap = {
    'spices': 'Spices & Plantation Crops',
    'grains': 'Grains, Rice & Staples',
    'produce': 'Fresh Farm Produce & Coconut',
    'fruits': 'Fresh & Premium Dry Fruits',
    'processed': 'Processed Foods & Eco-Crafts',
    'industrial': 'Apparel, Engineering & Industrial'
  };

  requestQuoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pName = btn.getAttribute('data-product');
      const card = btn.closest('.product-card');
      const catKey = card ? card.getAttribute('data-category') : '';
      const mappedCategory = categoryMap[catKey] || 'Spices & Plantation Crops';
      prefillAndScrollToContact(pName, mappedCategory);
    });
  });

  // ------------------------------------------------------------------------
  // 7. RFQ Form Validation & Direct WhatsApp Integration
  // ------------------------------------------------------------------------
  const rfqForm = document.getElementById('rfq-form');
  const formStatus = document.getElementById('form-status');

  function sanitizeString(str) {
    return str.replace(/[<>&"']/g, (m) => {
      switch (m) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    }).trim();
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
  }

  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fields = [
        { id: 'full-name', label: 'Full Name', validate: val => val.length >= 2 },
        { id: 'company-name', label: 'Company Name', validate: val => val.length >= 2 },
        { id: 'business-email', label: 'Business Email', validate: validateEmail },
        { id: 'phone-number', label: 'Phone Number', validate: validatePhone },
        { id: 'destination-port', label: 'Destination Port', validate: val => val.length >= 3 },
        { id: 'product-category', label: 'Product Category', validate: val => val !== '' },
        { id: 'quantity-required', label: 'Quantity Required', validate: val => val.length >= 2 }
      ];

      // Reset errors
      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errorSpan = document.getElementById(`error-${f.id}`);
        input.classList.remove('is-invalid');
        if (errorSpan) errorSpan.textContent = '';
      });

      // Check fields
      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const val = input.value.trim();
        const errorSpan = document.getElementById(`error-${f.id}`);

        if (!f.validate(val)) {
          isValid = false;
          input.classList.add('is-invalid');
          if (errorSpan) {
            errorSpan.textContent = `Please enter a valid ${f.label.toLowerCase()}.`;
          }
        }
      });

      if (!isValid) {
        formStatus.className = 'form-status-alert error';
        formStatus.textContent = 'Please correct the highlighted fields before submitting your quotation request.';
        return;
      }

      // Collect Sanitized Values
      const formData = {
        name: sanitizeString(document.getElementById('full-name').value),
        company: sanitizeString(document.getElementById('company-name').value),
        email: sanitizeString(document.getElementById('business-email').value),
        phone: sanitizeString(document.getElementById('phone-number').value),
        port: sanitizeString(document.getElementById('destination-port').value),
        category: sanitizeString(document.getElementById('product-category').value),
        quantity: sanitizeString(document.getElementById('quantity-required').value),
        message: sanitizeString(document.getElementById('spec-message').value)
      };

      // Construct WhatsApp message URL
      const waText = encodeURIComponent(
        `*New B2B RFQ — Shipyon Exim*\n` +
        `• Name: ${formData.name}\n` +
        `• Company: ${formData.company}\n` +
        `• Email: ${formData.email}\n` +
        `• Phone: ${formData.phone}\n` +
        `• Port: ${formData.port}\n` +
        `• Category: ${formData.category}\n` +
        `• Volume: ${formData.quantity}\n` +
        `• Notes: ${formData.message}`
      );
      const waUrl = `https://wa.me/919500690740?text=${waText}`;

      // Show success feedback
      formStatus.className = 'form-status-alert success';
      formStatus.innerHTML = `
        <strong>Quotation Inquiry Received!</strong><br/>
        Our international trade desk will review your specifications and issue a formal FOB/CIF quotation within 4 business hours.<br/>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; margin-top:8px; font-weight:700; color:#1D4ED8; text-decoration:underline;">
          Click here to instantly transmit this RFQ via WhatsApp to our duty manager &rarr;
        </a>
      `;

      rfqForm.reset();
    });
  }
});
