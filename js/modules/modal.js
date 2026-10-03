/**
 * REGISTRATION MODAL MODULE (TALLY.SO IFRAME EMBED)
 * Handles opening/closing of the full-fidelity modal dialog embedding the Tally form.
 * Features:
 * - Direct loading of https://tally.so/r/KYbqoA
 * - Loading indicator with smooth fade out on iframe load
 * - ESC key and click-outside dismissal
 * - Background scroll lock
 * - Direct external tab link fallback
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  window.EFT.initModal = function initModal() {
    const modalBackdrop = document.getElementById('tallyModal');
    const modalContent = document.getElementById('tallyModalContent');
    const iframe = document.getElementById('tallyIframe');
    const loader = document.getElementById('tallyLoader');
    const closeBtn = document.getElementById('closeTallyModal');
    const openBtns = document.querySelectorAll('.open-tally-modal');

    if (!modalBackdrop || !iframe) return;

    const hideLoader = () => {
      if (loader) {
        loader.classList.add('opacity-0');
        setTimeout(() => {
          loader.classList.add('hidden');
        }, 300);
      }
    };

    // Hide loader once iframe content has loaded
    iframe.addEventListener('load', hideLoader);

    // Safety timeout: dismiss loader after 2.5s max so it never gets stuck
    setTimeout(hideLoader, 2500);

    let closeTimeout = null;

    // Ensure initial JS state
    modalBackdrop.style.zIndex = '-50';
    modalBackdrop.style.visibility = 'hidden';

    function openModal() {
      clearTimeout(closeTimeout);

      // 1. Immediately elevate z-index to top and ensure visibility
      modalBackdrop.style.zIndex = '100';
      modalBackdrop.style.visibility = 'visible';

      // Ensure iframe src is always set to the Tally URL
      if (!iframe.src || !iframe.src.includes('tally.so')) {
        iframe.src = 'https://tally.so/r/KYbqoA';
      }

      // Show backdrop
      modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      modalBackdrop.classList.add('opacity-100', 'pointer-events-auto');

      // Animate modal card in
      if (modalContent) {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
      }

      // Lock body scroll
      document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
      // Hide backdrop
      modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
      modalBackdrop.classList.remove('opacity-100', 'pointer-events-auto');

      // Animate modal card out
      if (modalContent) {
        modalContent.classList.add('scale-95', 'opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
      }

      // Unlock body scroll
      document.body.classList.remove('overflow-hidden');

      // 2. Lower z-index to bottom and hide visibility after transition finishes
      clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        if (modalBackdrop.classList.contains('opacity-0')) {
          modalBackdrop.style.zIndex = '-50';
          modalBackdrop.style.visibility = 'hidden';
        }
      }, 300);
    }

    // Attach click triggers to all registration buttons
    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    // Click outside modal card to close
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    // ESC key to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modalBackdrop.classList.contains('pointer-events-none')) {
        closeModal();
      }
    });

    // Expose API
    window.EFT.openTallyModal = openModal;
    window.EFT.closeTallyModal = closeModal;
  };
})(window);
