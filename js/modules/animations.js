/**
 * SCROLL REVEAL & COUNTER ANIMATIONS MODULE
 * Uses IntersectionObserver to trigger entry animations and counter numbers.
 * Includes desktop-only gentle 3D tilt for the logo card.
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  function animateCounter(counter) {
    if (counter.dataset.animated === 'true') return;
    counter.dataset.animated = 'true';

    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 1200; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const suffix = counter.innerText.includes('%') ? '%' : '';

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(target * (progress * (2 - progress)));

      counter.innerText = current + suffix;

      if (frame >= totalFrames) {
        counter.innerText = target + suffix;
        clearInterval(timer);
      }
    }, frameRate);
  }

  window.EFT.animateCounter = animateCounter;

  window.EFT.initScrollReveal = function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const isMobile = window.innerWidth < 900;
    const observerOptions = {
      root: null,
      // Trigger when element enters 40px into the viewport so reveal animation is distinctly seen
      rootMargin: isMobile ? '0px 0px -40px 0px' : '0px 0px -60px 0px',
      threshold: isMobile ? 0.08 : 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          const counters = entry.target.querySelectorAll('[data-target]');
          if (counters.length > 0) {
            counters.forEach(counter => animateCounter(counter));
          }

          if (entry.target.hasAttribute('data-target')) {
            animateCounter(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  };

  /**
   * 3D Tilt on Logo (Desktop only - disabled on touch devices)
   */
  window.EFT.initLogoTilt = function initLogoTilt() {
    // Only enable on devices with a mouse/precise pointer
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const wrapper = document.getElementById('logoCardWrapper');
    const card = document.getElementById('logoCard');
    if (!wrapper || !card) return;

    const maxTilt = 8;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  };
})(window);
