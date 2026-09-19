/**
 * SHIPYON V2 - INTERACTIONS & FUNCTIONALITY
 * Clean, soft, responsive interactions for architectural trade site
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initQuoteModal();
  initCounters();
  initProductFilters();
  initHeroConsole();
});

// 1. Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navLinks = document.getElementById('nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggleBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.textContent = '☰';
      });
    });
  }
}

// 3. Quote Request Modal
function initQuoteModal() {
  const overlay = document.getElementById('quote-modal-overlay');
  const openButtons = document.querySelectorAll('.open-quote-modal-btn');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('quote-name').value;
  const category = document.getElementById('quote-category').value;
  alert(`Thank you, ${name}! Your trade quotation request for ${category} has been received. Our export desk will connect within 4 business hours.`);
  const overlay = document.getElementById('quote-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  e.target.reset();
}

// 4. Subtle Counting Animation on Viewport Entry
function initCounters() {
  const stats = document.querySelectorAll('.snapshot-value, .why-metric-stat');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  stats.forEach(stat => {
    stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(stat);
  });
}

// 5. Product Filtering (for products.html)
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const productCards = document.querySelectorAll('.catalog-item-card');

  if (!filterBtns.length || !productCards.length) return;

  // Check URL parameter if any
  const urlParams = new URLSearchParams(window.location.search);
  const requestedCat = urlParams.get('category');

  if (requestedCat) {
    filterBtns.forEach(btn => {
      if (btn.dataset.category === requestedCat) {
        activateTab(btn, requestedCat);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      activateTab(btn, category);
    });
  });

  function activateTab(activeBtn, category) {
    filterBtns.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    productCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// 6. Hero Maritime Console Interactive Tabs
function initHeroConsole() {
  const tabs = document.querySelectorAll('.console-tab-item');
  const panels = document.querySelectorAll('.console-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetMode = tab.dataset.mode;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(`panel-${targetMode}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

