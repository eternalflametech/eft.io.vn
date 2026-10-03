/**
 * ETERNAL FLAME TECH (EFT) - MAIN CLIENT ENTRY POINT
 * Universal Module System: Loads smoothly on both file:/// protocol and web servers (http://).
 * Coordinates:
 * - EFT.initScrollProgressBar
 * - EFT.initNavbar
 * - EFT.initAmbientCanvas
 * - EFT.initLogoTilt
 * - EFT.initSmoothScroll
 * - EFT.initScrollReveal
 * - EFT.initBackToTop
 * - EFT.initKeyboardSnap
 */

(function() {
  function start() {
    const EFT = window.EFT || {};

    if (typeof EFT.initScrollProgressBar === 'function') EFT.initScrollProgressBar();
    if (typeof EFT.initNavbar === 'function') EFT.initNavbar();
    if (typeof EFT.initAmbientCanvas === 'function') EFT.initAmbientCanvas();
    if (typeof EFT.initLogoTilt === 'function') EFT.initLogoTilt();
    if (typeof EFT.initSmoothScroll === 'function') EFT.initSmoothScroll();
    if (typeof EFT.initScrollReveal === 'function') EFT.initScrollReveal();
    if (typeof EFT.initBackToTop === 'function') EFT.initBackToTop();
    if (typeof EFT.initKeyboardSnap === 'function') EFT.initKeyboardSnap();
    if (typeof EFT.initModal === 'function') EFT.initModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
