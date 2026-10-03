/**
 * MODAL MANAGER & REGISTRATION MODAL MODULE (TALLY.SO IFRAME EMBED)
 * Universal Module: compatible with both file:// protocol and web servers.
 * Features:
 * - EFT.ModalManager: Stack-based modal controller with hierarchical scroll locking.
 *   Only the topmost active modal can scroll; underlying modals are temporarily locked
 *   (preserving their scroll position and disabling touch/click events).
 *   Closing the topmost modal unlocks the immediate layer beneath it, all the way to the base page.
 * - EFT.initModal: Handles Tally registration dialog embed with loader, hit-test fixes, and stacking.
 */

(function(window) {
  window.EFT = window.EFT || {};

  /* ==========================================================================
     1. MODAL MANAGER (STACK-BASED SCROLL & FOCUS CONTROLLER)
     ========================================================================== */
  const ModalManager = {
    stack: [],

    /**
     * Push a modal onto the active stack.
     * @param {Object} config
     * @param {string} config.id - Unique modal identifier
     * @param {HTMLElement} config.modalEl - Backdrop / full-screen wrapper
     * @param {HTMLElement} config.contentEl - Inner modal card / content
     * @param {HTMLElement} [config.scrollEl] - The scrollable element inside modal
     * @param {Function} [config.close] - Callback to dismiss this modal on ESC
     */
    push(config) {
      if (!config || !config.id) return;

      // Deduplicate if already in stack
      const existingIdx = this.stack.findIndex(item => item.id === config.id);
      if (existingIdx !== -1) {
        this.stack.splice(existingIdx, 1);
      }

      // If an underlying modal exists, lock it
      if (this.stack.length > 0) {
        const prevTop = this.stack[this.stack.length - 1];
        this._lockModalLayer(prevTop);
      } else {
        // First modal opening -> lock background document
        this._lockDocument();
      }

      // Add new modal to top of stack
      this.stack.push(config);

      // Ensure new top modal is unlocked and interactive
      this._unlockModalLayer(config);
    },

    /**
     * Pop a modal from the active stack by its ID.
     * @param {string} modalId
     */
    pop(modalId) {
      if (!modalId) return;

      const idx = this.stack.findIndex(item => item.id === modalId);
      if (idx === -1) return;

      const [removed] = this.stack.splice(idx, 1);
      if (removed) {
        this._cleanupModalLayer(removed);
      }

      // Restore the next modal down the stack
      if (this.stack.length > 0) {
        const nextTop = this.stack[this.stack.length - 1];
        this._unlockModalLayer(nextTop);
      } else {
        // All modals are closed -> unlock the base document
        this._unlockDocument();
      }
    },

    /**
     * Check if a modal is currently at the top of the stack.
     * @param {string} modalId
     * @returns {boolean}
     */
    isTop(modalId) {
      if (!this.stack.length) return false;
      return this.stack[this.stack.length - 1].id === modalId;
    },

    /**
     * Get the topmost modal in the stack.
     * @returns {Object|null}
     */
    getTop() {
      if (!this.stack.length) return null;
      return this.stack[this.stack.length - 1];
    },

    _lockDocument() {
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    },

    _unlockDocument() {
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    },

    _lockModalLayer(layer) {
      if (!layer) return;

      // 1. Freeze scroll container and save current position
      if (layer.scrollEl) {
        layer.savedScrollTop = layer.scrollEl.scrollTop;
        layer.scrollEl.style.setProperty('overflow', 'hidden', 'important');
        layer.scrollEl.style.setProperty('touch-action', 'none', 'important');
      }

      // 2. Disable user interactions on underlying card
      if (layer.contentEl) {
        layer.contentEl.style.setProperty('pointer-events', 'none', 'important');
        layer.contentEl.setAttribute('aria-hidden', 'true');
        if ('inert' in layer.contentEl) layer.contentEl.inert = true;
      }
    },

    _unlockModalLayer(layer) {
      if (!layer) return;

      // 1. Unfreeze scroll container and restore exact scroll position
      if (layer.scrollEl) {
        layer.scrollEl.style.removeProperty('overflow');
        layer.scrollEl.style.removeProperty('touch-action');
        if (typeof layer.savedScrollTop === 'number') {
          layer.scrollEl.scrollTop = layer.savedScrollTop;
        }
      }

      // 2. Re-enable interactions on top card
      if (layer.contentEl) {
        layer.contentEl.style.removeProperty('pointer-events');
        layer.contentEl.removeAttribute('aria-hidden');
        if ('inert' in layer.contentEl) layer.contentEl.inert = false;
      }
    },

    _cleanupModalLayer(layer) {
      if (!layer) return;
      if (layer.scrollEl) {
        layer.scrollEl.style.removeProperty('overflow');
        layer.scrollEl.style.removeProperty('touch-action');
      }
      if (layer.contentEl) {
        layer.contentEl.style.removeProperty('pointer-events');
        layer.contentEl.removeAttribute('aria-hidden');
        if ('inert' in layer.contentEl) layer.contentEl.inert = false;
      }
    }
  };

  // Top-level ESC key listener: closes ONLY the topmost modal in the stack
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (ModalManager.stack.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const top = ModalManager.stack[ModalManager.stack.length - 1];
        if (top && typeof top.close === 'function') {
          top.close();
        }
      }
    }
  }, true); // Capture phase

  window.EFT.ModalManager = ModalManager;

  /* ==========================================================================
     2. TALLY REGISTRATION MODAL
     ========================================================================== */
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

    iframe.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 2500);

    let closeTimeout = null;

    modalBackdrop.style.zIndex = '-50';
    modalBackdrop.style.visibility = 'hidden';

    function openModal() {
      clearTimeout(closeTimeout);

      modalBackdrop.style.zIndex = '100';
      modalBackdrop.style.visibility = 'visible';

      if (!iframe.src || !iframe.src.includes('tally.so')) {
        iframe.src = 'https://tally.so/r/KYbqoA';
      }

      modalBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      modalBackdrop.classList.add('opacity-100', 'pointer-events-auto');

      if (modalContent) {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
      }

      // Register with central ModalManager
      ModalManager.push({
        id: 'tallyModal',
        modalEl: modalBackdrop,
        contentEl: modalContent,
        scrollEl: modalContent,
        close: closeModal
      });
    }

    function closeModal() {
      modalBackdrop.classList.add('opacity-0', 'pointer-events-none');
      modalBackdrop.classList.remove('opacity-100', 'pointer-events-auto');

      if (modalContent) {
        modalContent.classList.add('scale-95', 'opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
      }

      // Pop from central ModalManager
      ModalManager.pop('tallyModal');

      clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        if (modalBackdrop.classList.contains('opacity-0')) {
          modalBackdrop.style.zIndex = '-50';
          modalBackdrop.style.visibility = 'hidden';
        }
      }, 300);
    }

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

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    // Prevent wheel / touchmove outside modal card from propagating
    const handleTallyScrollLeak = (e) => {
      if (modalContent && modalContent.contains(e.target)) return;
      if (e.cancelable) e.preventDefault();
    };
    modalBackdrop.addEventListener('wheel', handleTallyScrollLeak, { passive: false });
    modalBackdrop.addEventListener('touchmove', handleTallyScrollLeak, { passive: false });

    window.EFT.openTallyModal = openModal;
    window.EFT.closeTallyModal = closeModal;
  };
})(window);
