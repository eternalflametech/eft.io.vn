/**
 * ACHIEVEMENTS & MEMORIES MODULE
 * Handles compact summary cards, detail modal with tabs & scroll isolation,
 * and high-resolution photo gallery lightbox modal with multiline captions.
 * Universal Module: compatible with both file:// protocol and web servers.
 */

(function(window) {
  window.EFT = window.EFT || {};

  window.EFT.initAchievements = function initAchievements() {
    /* ========================================================================
       1. DETAIL MODAL (ROBOCON / HACKATHON / VIDEO TABS)
       ======================================================================== */
    const detailModal = document.getElementById('achievementDetailModal');
    const modalContent = document.getElementById('achievementDetailContent');
    const detailBody = document.getElementById('achievementDetailBody');
    const closeDetailBtn = document.getElementById('closeAchievementModal');
    const openDetailBtns = document.querySelectorAll('.open-achievement-modal');
    const modalTabBtns = document.querySelectorAll('.achievement-modal-tab-btn');
    const modalTabPanes = document.querySelectorAll('.achievement-modal-pane');

    let detailCloseTimeout = null;

    if (detailModal) {
      detailModal.style.zIndex = '-50';
      detailModal.style.visibility = 'hidden';

      const switchModalTab = (tabId) => {
        modalTabBtns.forEach(btn => {
          const isTarget = btn.getAttribute('data-tab') === tabId;
          btn.classList.toggle('active', isTarget);
          btn.classList.toggle('bg-gradient-to-r', isTarget);
          btn.classList.toggle('from-violet-600', isTarget);
          btn.classList.toggle('to-rose-600', isTarget);
          btn.classList.toggle('text-white', isTarget);
          btn.classList.toggle('border-white/20', isTarget);
          btn.classList.toggle('shadow-md', isTarget);
          btn.classList.toggle('bg-white/[0.04]', !isTarget);
          btn.classList.toggle('text-zinc-400', !isTarget);
          btn.classList.toggle('border-white/10', !isTarget);
        });

        modalTabPanes.forEach(pane => {
          if (pane.getAttribute('data-tab-pane') === tabId) {
            pane.classList.remove('hidden');
          } else {
            pane.classList.add('hidden');
          }
        });

        // Reset scroll position to top when switching tabs
        if (detailBody) {
          detailBody.scrollTop = 0;
        }
      };

      const openModal = (tabId = 'robocon') => {
        clearTimeout(detailCloseTimeout);

        switchModalTab(tabId);

        detailModal.style.zIndex = '100';
        detailModal.style.visibility = 'visible';
        detailModal.classList.remove('opacity-0', 'pointer-events-none');
        detailModal.classList.add('opacity-100', 'pointer-events-auto');

        if (modalContent) {
          modalContent.classList.remove('scale-95', 'opacity-0');
          modalContent.classList.add('scale-100', 'opacity-100');
        }

        // Register with ModalManager stack
        if (window.EFT.ModalManager) {
          window.EFT.ModalManager.push({
            id: 'achievementDetailModal',
            modalEl: detailModal,
            contentEl: modalContent,
            scrollEl: detailBody,
            close: closeModal
          });
        }
      };

      const closeModal = () => {
        detailModal.classList.add('opacity-0', 'pointer-events-none');
        detailModal.classList.remove('opacity-100', 'pointer-events-auto');

        if (modalContent) {
          modalContent.classList.add('scale-95', 'opacity-0');
          modalContent.classList.remove('scale-100', 'opacity-100');
        }

        // Pop from ModalManager stack
        if (window.EFT.ModalManager) {
          window.EFT.ModalManager.pop('achievementDetailModal');
        }

        // Pause any video inside modal if playing
        const video = detailModal.querySelector('video');
        if (video) video.pause();

        clearTimeout(detailCloseTimeout);
        detailCloseTimeout = setTimeout(() => {
          if (detailModal.classList.contains('opacity-0')) {
            detailModal.style.zIndex = '-50';
            detailModal.style.visibility = 'hidden';
          }
        }, 300);
      };

      openDetailBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTab = btn.getAttribute('data-tab') || 'robocon';
          openModal(targetTab);
        });
      });

      if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', closeModal);
      }

      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal || e.target.classList.contains('modal-backdrop-click')) {
          closeModal();
        }
      });

      modalTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');
          switchModalTab(tabId);
        });
      });

      // Prevent wheel/touchmove from leaking outside detailBody
      const handleDetailScrollLeak = (e) => {
        // If not topmost (e.g. Lightbox is open), prevent all scrolling in detailModal
        if (window.EFT.ModalManager && !window.EFT.ModalManager.isTop('achievementDetailModal')) {
          if (e.cancelable) e.preventDefault();
          return;
        }

        // If inside detailBody, allow scrolling
        if (detailBody && detailBody.contains(e.target)) return;

        // Outside detailBody (e.g. backdrop or header), prevent leakage
        if (e.cancelable) e.preventDefault();
      };

      detailModal.addEventListener('wheel', handleDetailScrollLeak, { passive: false });
      detailModal.addEventListener('touchmove', handleDetailScrollLeak, { passive: false });

      window.EFT.openAchievementModal = openModal;
      window.EFT.closeAchievementModal = closeModal;
    }

    /* ========================================================================
       2. PHOTO LIGHTBOX MODAL (WITH MULTILINE CAPTION SUPPORT)
       ======================================================================== */
    const lightbox = document.getElementById('achievementLightbox');
    const lightboxCard = document.getElementById('lightboxCard');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevLightbox');
    const nextBtn = document.getElementById('nextLightbox');

    if (!lightbox || !lightboxImg) return;

    lightbox.style.zIndex = '-50';
    lightbox.style.visibility = 'hidden';
    let lightboxCloseTimeout = null;

    let galleryThumbs = [];
    let currentPhotoIndex = 0;

    const refreshThumbs = () => {
      galleryThumbs = Array.from(document.querySelectorAll('.achievement-photo-trigger'));
    };
    refreshThumbs();

    const openLightbox = (index) => {
      refreshThumbs();
      if (index < 0 || index >= galleryThumbs.length) return;
      currentPhotoIndex = index;
      const thumb = galleryThumbs[currentPhotoIndex];
      const fullSrc = thumb.getAttribute('data-full-src') || thumb.getAttribute('src');

      // Preserve exact multiline captions (converts any literal \n if present and trims)
      const rawCaption = thumb.hasAttribute('data-caption')
        ? thumb.getAttribute('data-caption')
        : (thumb.getAttribute('alt') || '');
      const caption = (rawCaption || '').replace(/\\n/g, '\n').trim();

      lightboxImg.src = fullSrc;
      if (lightboxCaption) {
        lightboxCaption.textContent = caption;
        lightboxCaption.style.display = caption ? 'block' : 'none';
        lightboxCaption.scrollTop = 0; // Reset caption scroll
      }

      clearTimeout(lightboxCloseTimeout);
      lightbox.style.zIndex = '120';
      lightbox.style.visibility = 'visible';
      lightbox.classList.remove('opacity-0', 'pointer-events-none');
      lightbox.classList.add('opacity-100', 'pointer-events-auto');

      // Register with central ModalManager stack
      if (window.EFT.ModalManager) {
        window.EFT.ModalManager.push({
          id: 'achievementLightbox',
          modalEl: lightbox,
          contentEl: lightboxCard,
          scrollEl: lightboxCaption,
          close: closeLightbox
        });
      }
    };

    const closeLightbox = () => {
      lightbox.classList.add('opacity-0', 'pointer-events-none');
      lightbox.classList.remove('opacity-100', 'pointer-events-auto');

      // Pop from central ModalManager stack
      if (window.EFT.ModalManager) {
        window.EFT.ModalManager.pop('achievementLightbox');
      }

      clearTimeout(lightboxCloseTimeout);
      lightboxCloseTimeout = setTimeout(() => {
        if (lightbox.classList.contains('opacity-0')) {
          lightbox.style.zIndex = '-50';
          lightbox.style.visibility = 'hidden';
          lightboxImg.src = '';
        }
      }, 300);
    };

    const showPrev = () => {
      refreshThumbs();
      const nextIndex = (currentPhotoIndex - 1 + galleryThumbs.length) % galleryThumbs.length;
      openLightbox(nextIndex);
    };

    const showNext = () => {
      refreshThumbs();
      const nextIndex = (currentPhotoIndex + 1) % galleryThumbs.length;
      openLightbox(nextIndex);
    };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.achievement-photo-trigger');
      if (trigger) {
        e.preventDefault();
        refreshThumbs();
        const idx = galleryThumbs.indexOf(trigger);
        if (idx !== -1) {
          openLightbox(idx);
        }
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop-click')) {
        closeLightbox();
      }
    });

    // Prevent wheel/touchmove from leaking through lightbox to underlying layers
    const handleLightboxScrollLeak = (e) => {
      if (lightboxCaption && lightboxCaption.contains(e.target)) {
        const isScrollable = lightboxCaption.scrollHeight > lightboxCaption.clientHeight;
        if (isScrollable) return; // Allow caption to scroll
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    lightbox.addEventListener('wheel', handleLightboxScrollLeak, { passive: false });
    lightbox.addEventListener('touchmove', handleLightboxScrollLeak, { passive: false });

    // Arrow navigation when Lightbox is active
    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('opacity-100')) return;
      if (window.EFT.ModalManager && !window.EFT.ModalManager.isTop('achievementLightbox')) return;
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    window.EFT.openAchievementLightbox = openLightbox;
    window.EFT.closeAchievementLightbox = closeLightbox;
  };
})(typeof window !== 'undefined' ? window : this);
