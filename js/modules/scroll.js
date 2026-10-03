/**
 * SCROLL UTILITIES MODULE
 * Handles the top progress bar, back-to-top floating button,
 * and active section tracking in navbar and stepper.
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  window.EFT.initScrollProgressBar = function initScrollProgressBar() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${scrollPercent}%`;

      const scrollHint = document.getElementById('heroScrollHint');
      if (scrollHint) {
        if (scrollTop > 40) {
          scrollHint.style.opacity = '0';
          scrollHint.style.pointerEvents = 'none';
        } else {
          scrollHint.style.opacity = '0.75';
          scrollHint.style.pointerEvents = 'auto';
        }
      }
    }, { passive: true });
  };

  window.EFT.initBackToTop = function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  window.EFT.initSmoothScroll = function initSmoothScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sideDots = document.querySelectorAll('.side-dot');

    if (!sections.length) return;

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 140;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          current = sectionId;
        }
      });

      let activeChanged = false;
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${current}`;
        if (isMatch && !link.classList.contains('active')) {
          activeChanged = true;
          link.classList.add('active');
        } else if (!isMatch && link.classList.contains('active')) {
          activeChanged = true;
          link.classList.remove('active');
        }
      });

      if (activeChanged && typeof window.EFT.updateNavIndicator === 'function') {
        window.EFT.updateNavIndicator();
      }

      sideDots.forEach((dot) => {
        dot.classList.remove('active');
        if (dot.getAttribute('href') === `#${current}`) {
          dot.classList.add('active');
        }
      });
    }, { passive: true });
  };
})(window);
