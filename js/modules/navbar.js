/**
 * NAVBAR & MOBILE DRAWER MODULE
 * Handles scroll glassmorphism, mobile menu toggle, ARIA accessibility,
 * backdrop overlay, body scroll lock, and sliding switch indicator pill.
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  window.EFT.initNavbar = function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');

    // 1. Scrolled state detection
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Mobile drawer toggling
    if (mobileToggle && navMenu) {
      const setMenuOpen = (open) => {
        navMenu.classList.toggle('active', open);
        mobileToggle.classList.toggle('active', open);
        mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navOverlay?.classList.toggle('active', open);
        
        // Prevent body scrolling on mobile while menu is open
        if (open) {
          document.body.classList.add('overflow-hidden', 'touch-none');
        } else {
          document.body.classList.remove('overflow-hidden', 'touch-none');
        }
      };

      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('active');
        setMenuOpen(!isOpen);
      });

      // Close when clicking any nav link
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          setMenuOpen(false);
        });
      });

      // Close on backdrop overlay click
      if (navOverlay) {
        navOverlay.addEventListener('click', () => {
          setMenuOpen(false);
        });
      }

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          setMenuOpen(false);
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          setMenuOpen(false);
        }
      });

      // Reset when resizing back to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && navMenu.classList.contains('active')) {
          setMenuOpen(false);
        }
      }, { passive: true });
    }

    // 3. Sliding Switch Indicator (Glides between pages / nav items)
    const navLinksContainer = document.getElementById('navLinks');
    const indicator = document.getElementById('navIndicator');

    const updateIndicatorPosition = (targetEl) => {
      if (!navLinksContainer || !indicator || window.innerWidth < 1024) {
        if (indicator) indicator.style.opacity = '0';
        return;
      }

      if (!targetEl) {
        indicator.style.opacity = '0';
        return;
      }

      const containerRect = navLinksContainer.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const left = targetRect.left - containerRect.left;
      const width = targetRect.width;

      indicator.style.width = `${width}px`;
      indicator.style.transform = `translateX(${left}px)`;
      indicator.style.opacity = '1';
    };

    const updateIndicatorToActive = () => {
      if (!navLinksContainer) return;
      const activeLink = navLinksContainer.querySelector('a.active');
      updateIndicatorPosition(activeLink);
    };

    window.EFT.updateNavIndicator = updateIndicatorToActive;

    if (navLinksContainer && indicator) {
      const links = navLinksContainer.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) {
            updateIndicatorPosition(link);
          }
        });

        link.addEventListener('click', () => {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          updateIndicatorPosition(link);
        });
      });

      navLinksContainer.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
          updateIndicatorToActive();
        }
      });

      window.addEventListener('resize', updateIndicatorToActive, { passive: true });
      setTimeout(updateIndicatorToActive, 100);
    }
  };
})(window);
