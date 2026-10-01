/**
 * SHIPYON GLOBAL TRADE ENGINE
 * State management for Sourcing Manifest (Cart), Saved Commodities (Wishlist),
 * Technical Spec Sheet (Quick View), Export Filters, Search, and Scroll-Spy
 */

(function () {
  'use strict';

  // --- State Stores ---
  const state = {
    cart: [],
    wishlist: new Set(),
    activeFilters: {
      categories: [],
      maxPrice: 100000,
      minRating: 0,
      minDiscount: 0,
      inStockOnly: false,
      brands: []
    },
    activeSort: 'featured',
    searchQuery: ''
  };

  // --- Commodity Database Cache ---
  let productsCache = [];

  document.addEventListener('DOMContentLoaded', initEcommerceApp);

  function saveCartToStorage() {
    try {
      localStorage.setItem('shipyon_cart', JSON.stringify(state.cart));
    } catch (e) {
      console.warn('Unable to persist cart to localStorage', e);
    }
  }

  function loadCartFromStorage() {
    try {
      const raw = localStorage.getItem('shipyon_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          state.cart = parsed;
        }
      }
    } catch (e) {
      console.warn('Unable to load cart from localStorage', e);
    }
  }

  function initEcommerceApp() {
    loadCartFromStorage();
    indexProducts();
    initHeroControls();
    initCategoryNavigation();
    initProductCardActions();
    initFilterDrawer();
    initCartDrawer();
    initWishlistDrawer();
    initQuickViewModal();
    initProductQuoteModal();
    initCarouselNavs();
    updateCartBadges();
    syncCartButtonsState();
  }

  // 1. Index commodities from DOM
  function indexProducts() {
    const cards = document.querySelectorAll('.ecom-product-card');
    productsCache = Array.from(cards).map(card => {
      const title = card.querySelector('.product-title')?.textContent.trim() || '';
      const category = card.dataset.category || '';
      const keywords = card.dataset.keywords || '';
      const desc = card.querySelector('.product-desc')?.textContent.trim() || '';
      const brand = card.dataset.brand || '';
      const origin = card.dataset.origin || '';
      const hsCode = card.dataset.hsCode || '';
      const isFeatured = card.dataset.featured === 'true';

      return {
        element: card,
        id: card.dataset.id || title.toLowerCase().replace(/\s+/g, '-'),
        title,
        category,
        brand,
        origin,
        keywords,
        hsCode,
        isFeatured,
        moq: card.dataset.moq || '1 Metric Ton',
        packaging: card.dataset.packaging || 'Export Standard',
        unit: card.dataset.unit || 'MT',
        price: parseFloat(card.dataset.price || '0'),
        originalPrice: parseFloat(card.dataset.originalPrice || '0'),
        rating: parseFloat(card.dataset.rating || '4.8'),
        reviews: card.dataset.reviews || '150',
        discount: parseInt(card.dataset.discount || '0', 10),
        image: card.querySelector('.product-card-img')?.src || '',
        desc,
        inStock: card.dataset.inStock !== 'false'
      };
    });
  }

  // 2. Hero Search & Sort Controls
  function initHeroControls() {
    const searchInput = document.getElementById('ecom-search-input');
    const searchClear = document.getElementById('ecom-search-clear');
    const sortSelect = document.getElementById('ecom-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        if (searchClear) {
          searchClear.classList.toggle('visible', state.searchQuery.length > 0);
        }
        applyFiltersAndSearch();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          state.searchQuery = '';
          searchClear.classList.remove('visible');
          applyFiltersAndSearch();
          searchInput.focus();
        }
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.activeSort = e.target.value;
        applySorting();
      });
    }
  }

  // 3. Category Navigation & Scroll-Spy
  function initCategoryNavigation() {
    // Large Hero Category Cards Click
    const heroCategoryCards = document.querySelectorAll('.category-hero-card');
    heroCategoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = card.getAttribute('data-target-section');
        scrollToSection(targetId);
      });
    });

    // Sticky Category Navigation Pills
    const navPillBtns = document.querySelectorAll('.category-nav-pill-btn');
    navPillBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target-section');
        scrollToSection(targetId);
      });
    });

    // IntersectionObserver for Scroll-Spy
    const sections = document.querySelectorAll('.ecom-category-product-section');
    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            updateActiveNavPill(id);
          }
        });
      }, {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      });

      sections.forEach(sec => observer.observe(sec));
    }
  }

  function scrollToSection(targetId) {
    if (!targetId || targetId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateActiveNavPill('all');
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const headerOffset = 110;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      updateActiveNavPill(targetId);
    }
  }

  function updateActiveNavPill(activeSectionId) {
    const navPillBtns = document.querySelectorAll('.category-nav-pill-btn');
    navPillBtns.forEach(btn => {
      const target = btn.getAttribute('data-target-section');
      btn.classList.toggle('active', target === activeSectionId);
    });
  }

  // 4. Product Card Actions (Cart & Saved Wishlist)
  function initProductCardActions() {
    document.addEventListener('click', (e) => {
      // Add to Cart button
      const addBtn = e.target.closest('.btn-add-to-cart');
      if (addBtn && !addBtn.closest('#quick-view-overlay') && !addBtn.closest('.side-drawer-items-list')) {
        if (addBtn.classList.contains('is-in-cart') || addBtn.hasAttribute('disabled')) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const card = addBtn.closest('.ecom-product-card');
        const productId = card ? card.dataset.id : addBtn.dataset.productId;
        if (productId) {
          if (isInCart(productId)) return;
          addToCart(productId, 1, addBtn);
        }
      }

      // Wishlist toggle
      const wishBtn = e.target.closest('.product-wishlist-btn');
      if (wishBtn) {
        e.preventDefault();
        const card = wishBtn.closest('.ecom-product-card');
        const productId = card?.dataset.id;
        if (productId) {
          toggleWishlist(productId, wishBtn);
        }
      }

      // Quick View button
      const qvBtn = e.target.closest('.btn-quick-view');
      if (qvBtn) {
        const productId = qvBtn.dataset.productId;
        if (productId) {
          openQuickViewModal(productId);
        }
      }
    });
  }

  function isInCart(productId) {
    return state.cart.some(item => item.id === productId);
  }

  // 5. Wishlist Management
  function toggleWishlist(productId, btnElement) {
    const product = productsCache.find(p => p.id === productId);
    if (!product) return;

    if (state.wishlist.has(productId)) {
      state.wishlist.delete(productId);
      if (btnElement) btnElement.classList.remove('active');
      showToast(`Removed "${product.title}" from Saved List`);
    } else {
      state.wishlist.add(productId);
      if (btnElement) {
        btnElement.classList.add('active');
        btnElement.classList.add('pulse-pop');
        setTimeout(() => btnElement.classList.remove('pulse-pop'), 400);
      }
      showToast(`✓ Saved "${product.title}" to Saved List`);
    }

    updateWishlistBadges();
    renderWishlistDrawer();
  }

  function updateWishlistBadges() {
    const badges = document.querySelectorAll('.wishlist-badge-count');
    const totalCount = state.wishlist.size;
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
      badge.classList.add('badge-bounce');
      setTimeout(() => badge.classList.remove('badge-bounce'), 300);
    });
  }

  // 6. Cart Management
  function addToCart(productId, qty = 1, btnElement) {
    const product = productsCache.find(p => p.id === productId);
    if (!product) return;

    // Block if already in cart
    if (isInCart(productId)) {
      showToast(`"${product.title}" is already in your cart`);
      syncCartButtonsState();
      return;
    }

    state.cart.push({
      id: product.id,
      title: product.title,
      packaging: product.packaging,
      unit: product.unit || 'MT',
      image: product.image,
      category: product.category,
      origin: product.origin,
      hsCode: product.hsCode,
      qty: 1
    });

    updateCartBadges();
    renderCartDrawer();
    syncCartButtonsState();
    saveCartToStorage();
    showToast(`✓ Added "${product.title}" to Cart`);
  }

  // Sync button states: Products inside cart are blocked and stay as 'Added to Cart'
  function syncCartButtonsState() {
    const cartSet = new Set(state.cart.map(item => item.id));

    // Update all product cards in DOM
    document.querySelectorAll('.ecom-product-card').forEach(card => {
      const productId = card.dataset.id;
      const btn = card.querySelector('.btn-add-to-cart');
      if (!btn) return;

      if (cartSet.has(productId)) {
        btn.classList.add('is-in-cart');
        btn.setAttribute('disabled', 'true');
        btn.setAttribute('aria-label', 'Added to Cart');
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Added to Cart</span>
        `;
      } else {
        btn.classList.remove('is-in-cart');
        btn.removeAttribute('disabled');
        btn.setAttribute('aria-label', 'Add to Cart');
        btn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Add to Cart</span>
        `;
      }
    });

    // Update Quick View modal button if open
    const qvBtn = document.getElementById('qv-add-cart-btn');
    if (qvBtn) {
      const qvId = qvBtn.dataset.productId;
      if (qvId && cartSet.has(qvId)) {
        qvBtn.classList.add('is-in-cart');
        qvBtn.setAttribute('disabled', 'true');
        qvBtn.setAttribute('aria-label', 'Added to Cart');
        qvBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Added to Cart</span>
        `;
      } else if (qvId) {
        qvBtn.classList.remove('is-in-cart');
        qvBtn.removeAttribute('disabled');
        qvBtn.setAttribute('aria-label', 'Add to Cart');
        qvBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Add to Cart</span>
        `;
      }
    }
  }

  function updateCartBadges() {
    const badges = document.querySelectorAll('.cart-badge-count');
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
      badge.classList.add('badge-bounce');
      setTimeout(() => badge.classList.remove('badge-bounce'), 300);
    });
  }

  function renderCartDrawer() {
    const listContainer = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const countEl = document.getElementById('cart-drawer-count');
    if (!listContainer) return;

    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (countEl) countEl.textContent = `(${totalCount})`;

    if (state.cart.length === 0) {
      listContainer.innerHTML = `
        <div class="drawer-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h4>Your cart is empty</h4>
          <p>Add certified commodities to request commercial container rates (FOB/CIF).</p>
          <button class="btn-category-view-all" onclick="closeAllDrawers()">Explore Commodities</button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = 'Ready for Quote';
      return;
    }

    listContainer.innerHTML = state.cart.map((item, idx) => {
      return `
        <div class="drawer-product-row">
          <img src="${item.image}" alt="${item.title}" class="drawer-product-thumb" loading="lazy">
          <div class="drawer-product-info">
            <div>
              <h5 class="drawer-item-title">${item.title}</h5>
              <span class="drawer-item-price" style="font-size: 11.5px; color: #64748B; font-weight: 600;">${item.packaging || 'Export Standard'}</span>
            </div>
            <div class="drawer-item-qty-row">
              <div class="qty-pill-controls">
                <button type="button" class="qty-btn" onclick="window.ecomEngine.changeQty(${idx}, -1)">−</button>
                <span class="qty-value">${item.qty}</span>
                <button type="button" class="qty-btn" onclick="window.ecomEngine.changeQty(${idx}, 1)">+</button>
              </div>
              <button type="button" class="drawer-item-remove" onclick="window.ecomEngine.removeCartItem(${idx})" title="Remove commodity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `${totalCount} item${totalCount > 1 ? 's' : ''} listed`;
  }

  function changeQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].qty += delta;
    if (state.cart[index].qty <= 0) {
      state.cart.splice(index, 1);
    }
    updateCartBadges();
    renderCartDrawer();
    syncCartButtonsState();
    saveCartToStorage();
  }

  function removeCartItem(index) {
    if (!state.cart[index]) return;
    const item = state.cart[index];
    state.cart.splice(index, 1);
    updateCartBadges();
    renderCartDrawer();
    syncCartButtonsState();
    saveCartToStorage();
    showToast(`Removed "${item.title}" from Cart`);
  }

  // 7. Wishlist Drawer Logic
  function renderWishlistDrawer() {
    const listContainer = document.getElementById('wishlist-items-list');
    const countEl = document.getElementById('wishlist-drawer-count');
    if (!listContainer) return;

    if (countEl) countEl.textContent = `(${state.wishlist.size})`;

    if (state.wishlist.size === 0) {
      listContainer.innerHTML = `
        <div class="drawer-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h4>Your saved list is empty</h4>
          <p>Tap the heart icon on any export commodity to save it for easy access.</p>
        </div>
      `;
      return;
    }

    const items = Array.from(state.wishlist).map(id => productsCache.find(p => p.id === id)).filter(Boolean);

    listContainer.innerHTML = items.map(item => `
      <div class="drawer-product-row">
        <img src="${item.image}" alt="${item.title}" class="drawer-product-thumb" loading="lazy">
        <div class="drawer-product-info">
          <div>
            <h5 class="drawer-item-title">${item.title}</h5>
            <span class="drawer-item-price" style="font-size: 11.5px; color: #64748B; font-weight: 600;">${item.packaging || 'Export Standard'}</span>
          </div>
          <div class="drawer-item-qty-row">
            <button type="button" class="btn-add-to-cart ${isInCart(item.id) ? 'is-in-cart' : ''}" ${isInCart(item.id) ? 'disabled' : ''} style="height: 30px; font-size: 11px; padding: 0 10px;" onclick="window.ecomEngine.moveWishlistToCart('${item.id}')">
              ${isInCart(item.id) ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button type="button" class="drawer-item-remove" onclick="window.ecomEngine.removeFromWishlist('${item.id}')" title="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function moveWishlistToCart(productId) {
    addToCart(productId, 1);
    state.wishlist.delete(productId);
    const cardBtn = document.querySelector(`.ecom-product-card[data-id="${productId}"] .product-wishlist-btn`);
    if (cardBtn) cardBtn.classList.remove('active');
    updateWishlistBadges();
    renderWishlistDrawer();
    syncCartButtonsState();
  }

  function removeFromWishlist(productId) {
    state.wishlist.delete(productId);
    const cardBtn = document.querySelector(`.ecom-product-card[data-id="${productId}"] .product-wishlist-btn`);
    if (cardBtn) cardBtn.classList.remove('active');
    updateWishlistBadges();
    renderWishlistDrawer();
    showToast('Removed item from Saved List');
  }

  // 8. Drawers Setup
  function initCartDrawer() {
    const triggerBtn = document.getElementById('header-cart-btn');
    const overlay = document.getElementById('cart-drawer-overlay');
    const closeBtn = document.getElementById('cart-drawer-close');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        renderCartDrawer();
        if (overlay) overlay.classList.add('active');
        const drawer = document.getElementById('cart-drawer');
        if (drawer) drawer.classList.add('active');
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => closeAllDrawers());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllDrawers();
      });
    }
  }

  function initWishlistDrawer() {
    const triggerBtn = document.getElementById('header-wishlist-btn');
    const overlay = document.getElementById('wishlist-drawer-overlay');
    const closeBtn = document.getElementById('wishlist-drawer-close');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        renderWishlistDrawer();
        if (overlay) overlay.classList.add('active');
        const drawer = document.getElementById('wishlist-drawer');
        if (drawer) drawer.classList.add('active');
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => closeAllDrawers());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllDrawers();
      });
    }
  }

  function initFilterDrawer() {
    const triggerBtn = document.getElementById('btn-filter-trigger');
    const overlay = document.getElementById('filter-drawer-overlay');
    const drawer = document.getElementById('filter-drawer');
    const closeBtn = document.getElementById('filter-drawer-close');
    const applyBtn = document.getElementById('btn-filter-apply');
    const resetBtn = document.getElementById('btn-filter-reset');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        if (overlay) overlay.classList.add('active');
        if (drawer) drawer.classList.add('active');
      });
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => closeAllDrawers());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllDrawers();
      });
    }

    // Rating Filter Chips
    const ratingChips = document.querySelectorAll('.rating-filter-chip');
    ratingChips.forEach(chip => {
      chip.addEventListener('click', () => {
        ratingChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeFilters.minRating = parseFloat(chip.dataset.rating || '0');
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        // Collect checked categories
        const checkedCats = Array.from(document.querySelectorAll('.filter-cat-check:checked')).map(cb => cb.value);
        state.activeFilters.categories = checkedCats;

        // Collect checked brands
        const checkedBrands = Array.from(document.querySelectorAll('.filter-brand-check:checked')).map(cb => cb.value);
        state.activeFilters.brands = checkedBrands;

        applyFiltersAndSearch();
        closeAllDrawers();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-cat-check, .filter-brand-check').forEach(cb => cb.checked = false);
        ratingChips.forEach(c => c.classList.remove('active'));
        if (ratingChips[0]) ratingChips[0].classList.add('active');

        state.activeFilters = {
          categories: [],
          maxPrice: 100000,
          minRating: 0,
          minDiscount: 0,
          inStockOnly: false,
          brands: []
        };

        applyFiltersAndSearch();
        closeAllDrawers();
      });
    }
  }

  function closeAllDrawers() {
    document.querySelectorAll('.filter-drawer-overlay, .ecom-side-drawer-overlay, .quick-view-overlay').forEach(el => {
      el.classList.remove('active');
    });
    document.querySelectorAll('.filter-drawer, .ecom-side-drawer').forEach(el => {
      el.classList.remove('active');
    });
  }

  // 9. Quick View Spec Sheet Modal
  function initQuickViewModal() {
    const overlay = document.getElementById('quick-view-overlay');
    const closeBtn = document.getElementById('quick-view-close-btn');

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDrawers();
    });
  }

  function openQuickViewModal(productId) {
    const product = productsCache.find(p => p.id === productId);
    if (!product) return;

    const overlay = document.getElementById('quick-view-overlay');
    const mainImg = document.getElementById('qv-main-img');
    const catPill = document.getElementById('qv-cat-pill');
    const title = document.getElementById('qv-title');
    const ratingVal = document.getElementById('qv-rating-val');
    const reviewsVal = document.getElementById('qv-reviews-val');
    const originVal = document.getElementById('qv-origin-val');
    const desc = document.getElementById('qv-desc');
    const addCartBtn = document.getElementById('qv-add-cart-btn');

    if (mainImg) mainImg.src = product.image;
    if (catPill) catPill.textContent = product.category;
    if (title) title.textContent = product.title;
    if (ratingVal) ratingVal.textContent = product.rating;
    if (reviewsVal) reviewsVal.textContent = `(Export Grade Verified)`;
    if (originVal) originVal.textContent = product.origin || 'India';
    if (desc) desc.textContent = product.desc;

    if (addCartBtn) {
      addCartBtn.dataset.productId = product.id;
      addCartBtn.onclick = () => {
        if (isInCart(product.id)) return;
        addToCart(product.id, 1, addCartBtn);
      };
    }

    syncCartButtonsState();

    if (overlay) overlay.classList.add('active');
  }

  // 10. Horizontal Carousel Navigation Buttons
  function initCarouselNavs() {
    document.querySelectorAll('.carousel-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.direction;
        const section = btn.closest('.ecom-category-product-section');
        const grid = section.querySelector('.ecom-products-grid');
        if (grid) {
          const scrollAmount = direction === 'next' ? 340 : -340;
          grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      });
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  function clearSearch() {
    const searchInput = document.getElementById('ecom-search-input');
    const searchClear = document.getElementById('ecom-search-clear');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    state.searchQuery = '';
    if (searchClear) searchClear.classList.remove('visible');
    applyFiltersAndSearch();
  }

  // 11. Filtering and Searching Engine
  function applyFiltersAndSearch() {
    let visibleCount = 0;
    const filterCounter = document.getElementById('filter-active-count');
    let activeFilterTotal = 0;

    if (state.activeFilters.categories.length) activeFilterTotal += state.activeFilters.categories.length;
    if (state.activeFilters.brands.length) activeFilterTotal += state.activeFilters.brands.length;
    if (state.activeFilters.minRating > 0) activeFilterTotal++;

    if (filterCounter) {
      filterCounter.textContent = activeFilterTotal;
      filterCounter.classList.toggle('visible', activeFilterTotal > 0);
    }

    productsCache.forEach(item => {
      let isVisible = true;

      // 1. Search Query: Real-time word prefix & substring multi-token matching
      if (state.searchQuery) {
        const tokens = state.searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        const corpus = [
          item.title,
          item.desc,
          item.category,
          item.brand,
          item.origin,
          item.hsCode,
          item.keywords
        ].join(' ').toLowerCase();

        const words = corpus.split(/[\s,./\-_()&;]+/).filter(Boolean);

        // Every token typed by user must match a word prefix (e.g. "oni" -> "onion", "shri" -> "shrimp")
        // or a substring within the corpus/HS code if >= 3 characters
        const matchesAll = tokens.every(token => {
          if (words.some(w => w.startsWith(token))) return true;
          if (token.length >= 3 && corpus.includes(token)) return true;
          return false;
        });

        if (!matchesAll) {
          isVisible = false;
        }
      }

      // 2. Category Checkboxes
      if (isVisible && state.activeFilters.categories.length > 0) {
        if (!state.activeFilters.categories.includes(item.category)) {
          isVisible = false;
        }
      }

      // 3. Rating Filter
      if (isVisible && item.rating < state.activeFilters.minRating) {
        isVisible = false;
      }

      // 4. Brand Filter
      if (isVisible && state.activeFilters.brands.length > 0) {
        if (!state.activeFilters.brands.includes(item.brand)) {
          isVisible = false;
        }
      }

      // Toggle DOM element
      item.element.style.display = isVisible ? 'flex' : 'none';
      if (isVisible) visibleCount++;
    });

    // Update Search Feedback notification bar
    const feedbackWrap = document.getElementById('ecom-search-feedback-wrap');
    const feedbackText = document.getElementById('ecom-search-feedback-text');
    if (feedbackWrap && feedbackText) {
      if (state.searchQuery) {
        feedbackWrap.classList.add('visible');
        feedbackText.innerHTML = `Found <strong>${visibleCount}</strong> export commodit${visibleCount === 1 ? 'y' : 'ies'} matching "<strong>${escapeHtml(state.searchQuery)}</strong>"`;
      } else {
        feedbackWrap.classList.remove('visible');
      }
    }

    // Empty search state container
    const emptyState = document.getElementById('ecom-search-empty-state');
    const emptyQuerySpan = document.getElementById('ecom-search-empty-query');
    if (emptyState) {
      if (visibleCount === 0 && state.searchQuery) {
        emptyState.classList.add('visible');
        if (emptyQuerySpan) emptyQuerySpan.textContent = state.searchQuery;
      } else {
        emptyState.classList.remove('visible');
      }
    }

    // Check each section: hide sections with 0 visible commodities
    document.querySelectorAll('.ecom-category-product-section').forEach(sec => {
      const visibleInSection = sec.querySelectorAll('.ecom-product-card[style*="display: flex"], .ecom-product-card:not([style*="display: none"])');
      const hasVisible = Array.from(visibleInSection).some(c => c.style.display !== 'none');
      sec.style.display = hasVisible ? 'block' : 'none';
    });
  }

  // 12. Sorting Engine
  function applySorting() {
    const sortType = state.activeSort;
    document.querySelectorAll('.ecom-products-grid').forEach(grid => {
      const cards = Array.from(grid.children);
      cards.sort((a, b) => {
        const titleA = (a.querySelector('.product-title')?.textContent || '').trim().toLowerCase();
        const titleB = (b.querySelector('.product-title')?.textContent || '').trim().toLowerCase();
        const ratingA = parseFloat(a.dataset.rating || '0');
        const ratingB = parseFloat(b.dataset.rating || '0');
        const featuredA = a.dataset.featured === 'true' ? 1 : 0;
        const featuredB = b.dataset.featured === 'true' ? 1 : 0;

        if (sortType === 'featured') {
          // Prioritize featured commodities at the front
          if (featuredB !== featuredA) return featuredB - featuredA;
          return ratingB - ratingA;
        }
        if (sortType === 'name-asc') return titleA.localeCompare(titleB);
        if (sortType === 'name-desc') return titleB.localeCompare(titleA);
        if (sortType === 'rating') return ratingB - ratingA;
        return 0; // default
      });

      cards.forEach(card => grid.appendChild(card));
    });
  }

  // 13. Toast System
  function showToast(message) {
    let container = document.getElementById('ecom-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ecom-toast-container';
      container.className = 'ecom-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'ecom-toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // 14. Product Quotation Modal with Selected Products & WhatsApp Dispatch
  function initProductQuoteModal() {
    const modalOverlay = document.getElementById('product-quote-overlay');
    const closeBtn = document.getElementById('product-quote-close');
    const form = document.getElementById('product-quote-form');
    const proceedBtn = document.getElementById('btn-proceed-quote');

    if (proceedBtn) {
      proceedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openProductQuoteModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeProductQuoteModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeProductQuoteModal();
      });
    }

    if (form) {
      form.addEventListener('submit', handleProductQuoteSubmit);
    }
  }

  function openProductQuoteModal() {
    if (state.cart.length === 0) {
      showToast('Please add at least one commodity to your cart first.');
      return;
    }

    closeAllDrawers();

    const overlay = document.getElementById('product-quote-overlay');
    const listEl = document.getElementById('product-quote-items-list');
    const countEl = document.getElementById('product-quote-count-badge');

    if (listEl) {
      listEl.innerHTML = state.cart.map((item) => `
        <div class="quote-product-row">
          <img src="${item.image}" alt="${item.title}" class="quote-product-thumb" loading="lazy">
          <div class="quote-product-meta">
            <h5 class="quote-product-title">${item.title}</h5>
            <span class="quote-product-sub">${item.packaging || 'Export Standard'} &bull; Origin: ${item.origin || 'India'}</span>
          </div>
          <div class="quote-product-qty">
            <span>Qty: <strong>${item.qty} ${item.unit || 'MT'}</strong></span>
          </div>
        </div>
      `).join('');
    }

    if (countEl) {
      const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
      countEl.textContent = `${totalCount} Commodity Line${totalCount > 1 ? 's' : ''}`;
    }

    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeProductQuoteModal() {
    const overlay = document.getElementById('product-quote-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function handleProductQuoteSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('prod-quote-name')?.value.trim() || 'Procurement Representative';
    const company = document.getElementById('prod-quote-company')?.value.trim() || 'Enterprise Trader';
    const email = document.getElementById('prod-quote-email')?.value.trim() || '';
    const phone = document.getElementById('prod-quote-phone')?.value.trim() || '';
    const port = document.getElementById('prod-quote-port')?.value.trim() || 'Global Gateway';
    const volume = document.getElementById('prod-quote-volume')?.value || '1 FCL Container';
    const incoterms = document.getElementById('prod-quote-incoterms')?.value || 'CIF';
    const notes = document.getElementById('prod-quote-notes')?.value.trim() || 'Standard export packaging and phyto inspection requested.';

    const ticketId = 'SHP-' + Math.floor(100000 + Math.random() * 900000);

    // Build the formatted WhatsApp message with ALL details and selected products
    let itemsText = '';
    state.cart.forEach((item, idx) => {
      itemsText += `  ${idx + 1}. *${item.title}* (${item.qty} ${item.unit || 'MT'}) - ${item.packaging || 'Export Standard'}\n`;
    });

    const msgLines = [
      `📋 *SHIPYON GLOBAL TRADE QUOTATION INQUIRY*`,
      `*Reference:* ${ticketId}`,
      `*Source:* Products Sourcing Catalog`,
      ``,
      `👤 *Procurement Representative:*`,
      `• *Name:* ${name}`,
      `• *Company:* ${company}`,
      `• *Business Email:* ${email}`,
      `• *Direct Phone / WA:* ${phone}`,
      ``,
      `📦 *Selected Commodities (${state.cart.length} Lines):*`,
      itemsText.trimEnd(),
      ``,
      `🚢 *Trade & Logistics Terms:*`,
      `• *Destination Seaport:* ${port}`,
      `• *Estimated Volume:* ${volume}`,
      `• *Preferred Incoterms:* ${incoterms}`,
      ``,
      `📝 *Trade Notes / Specifications:*`,
      `• ${notes}`
    ];

    const fullMessage = msgLines.join('\n');

    // Open WhatsApp with all entered details
    const waUrl = `https://wa.me/919500690740?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank');

    // Show Confirmation Screen inside Modal
    const body = document.getElementById('product-quote-body');
    if (body) {
      body.innerHTML = `
        <div class="quote-modal-success">
          <div class="quote-success-icon">✓</div>
          <span class="quote-badge-pill">TRANSMISSION DISPATCHED</span>
          <h3 class="quote-success-heading">Specification Dispatched to Trade Desk</h3>
          <p class="quote-success-desc">
            Thank you, <strong>${name}</strong> (${company}). Your trade quotation inquiry for <strong>${state.cart.length} commodities</strong> toward <strong>${port}</strong> has been transferred to our WhatsApp 24/7 Desk.
          </p>
          <div class="quote-ticket-pill">
            DISPATCH REF: <strong>${ticketId}</strong> &bull; STATUS: ACTIVE IN AUDIT QUEUE
          </div>
          <div>
            <button type="button" class="btn-pill-cobalt" onclick="window.ecomEngine.closeProductQuoteModal();" style="margin: 0 auto; display: inline-flex;">
              <span>Continue Exploring Catalog</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;
    }
  }

  // Global Engine Object for inline handlers
  window.ecomEngine = {
    addToCart,
    changeQty,
    removeCartItem,
    moveWishlistToCart,
    removeFromWishlist,
    openQuickViewModal,
    openProductQuoteModal,
    closeProductQuoteModal,
    closeAllDrawers,
    clearSearch
  };

})();
