/**
 * AMBIENT CANVAS PARTICLES MODULE
 * Lightweight, high-performance ambient dust effect.
 * Mobile optimized:
 * - Reduced particle count on mobile screens to conserve battery and CPU
 * - Pauses rendering when document/tab is hidden
 * - Debounced resize listener
 * - Respects prefers-reduced-motion
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  window.EFT.initAmbientCanvas = function initAmbientCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isMobile = width < 768;
    let animationFrameId = null;
    let isPaused = false;

    // Reduced particle count for phones to save battery
    const getParticleCount = () => {
      return isMobile ? 16 : Math.min(Math.floor((width * height) / 28000), 38);
    };

    let particles = [];

    class AmbientParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.4 + 0.6;
        this.speedY = -(Math.random() * 0.35 + 0.12);
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.alpha = Math.random() * 0.3 + 0.08;
        this.color = Math.random() > 0.4 ? 'rgba(192, 132, 252,' : 'rgba(244, 63, 94,';
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.y < -10) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color} ${this.alpha})`;
        ctx.fill();
      }
    }

    const setupParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new AmbientParticle());
      }
    };

    setupParticles();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        isMobile = width < 768;
        setupParticles();
      }, 150);
    }, { passive: true });

    // Battery saving: pause when tab is hidden or phone screen locked
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isPaused = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        loop();
      }
    });

    function loop() {
      if (isPaused) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(loop);
    }

    loop();
  };
})(window);
