/**
 * KEYBOARD STEPPER NAVIGATION MODULE
 * Enables arrow key & page key navigation between full-height snap sections on desktop.
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  window.EFT.initKeyboardSnap = function initKeyboardSnap() {
    const snapSections = Array.from(document.querySelectorAll('.snap-section'));
    if (!snapSections.length) return;

    // Only enable keyboard snapping on desktop viewports
    if (window.innerWidth < 900) return;

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      // Do not snap sections if any modal is open or body is scroll-locked
      if (document.body.classList.contains('overflow-hidden') || (window.EFT?.ModalManager?.stack?.length > 0)) return;

      const currentScroll = window.scrollY;
      let currentIndex = 0;

      snapSections.forEach((sec, idx) => {
        const top = sec.offsetTop;
        if (currentScroll >= top - 180) {
          currentIndex = idx;
        }
      });

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (currentIndex < snapSections.length - 1) {
          e.preventDefault();
          snapSections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          e.preventDefault();
          snapSections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  };
})(window);
