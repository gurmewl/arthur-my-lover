// script.js — Артур Пирожков Fan Site Custom JS
// Author: gurmewl
// Description: Handles UI interactions, animations, audio controls, and accessibility

document.addEventListener('DOMContentLoaded', () => {
  // Helper: Safe querySelector
  function $(selector, scope = document) {
    return scope.querySelector(selector);
  }
  function $all(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  // 1. Navbar: Collapse on link click (mobile)
  const navbarCollapse = $('#navbarNav');
  $all('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  // 2. Animate Elements on Scroll
  function animateOnScroll() {
    $all('.animate-from-bottom, .animate-from-top, .animate-from-left, .animate-from-right').forEach(el => {
      if (isElementInViewport(el)) {
        el.classList.add('in-view');
      }
    });
  }
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight - 100 && rect.bottom > 100
    );
  }
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  // 3. Smooth Scrolling for Anchor Links
  $all('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 4. "Back to Top" Button
  const backToTop = $('#backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Bootstrap Tooltips
  if (window.bootstrap) {
    $all('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }

  // 6. Audio Player Controls
  $all('.play-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const audioId = this.getAttribute('data-audio-id');
      const audio = document.getElementById(audioId);
      if (!audio) return;
      // Pause other audios
      $all('audio').forEach(a => {
        if (a !== audio) a.pause();
      });
      // Play or pause current
      if (audio.paused) {
        audio.play();
        this.innerHTML = '<i class="bi bi-pause-fill"></i> Пауза';
      } else {
        audio.pause();
        this.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
      }
      // Reset other play buttons
      $all('.play-btn').forEach(otherBtn => {
        if (otherBtn !== this) {
          otherBtn.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
        }
      });
    });
  });

  // 7. Audio Progress Bar (and reset on end)
  $all('audio').forEach(audio => {
    const progress = $(`.audio-progress[data-audio-id="${audio.id}"] .progress-bar`);
    audio.addEventListener('timeupdate', () => {
      if (progress) {
        progress.style.width = `${(audio.currentTime / audio.duration) * 100 || 0}%`;
      }
    });
    audio.addEventListener('ended', () => {
      if (progress) progress.style.width = '0%';
      const playBtn = $(`.play-btn[data-audio-id="${audio.id}"]`);
      if (playBtn) playBtn.innerHTML = '<i class="bi bi-play-fill"></i> Воспроизвести';
    });
  });

  // 8. Custom Cursor (Optional)
  const cursor = $('#custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    // Add interactive effect for buttons/links
    $all('a, button, .btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // 9. Ripple Effect for Buttons
  $all('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      circle.style.left = `${e.clientX - rect.left}px`;
      circle.style.top = `${e.clientY - rect.top}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // 10. Modal Video Pause on Close
  const promoModal = $('#promoModal');
  if (promoModal) {
    promoModal.addEventListener('hidden.bs.modal', () => {
      const video = $('#promoModalVideo');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  // 11. Gallery Carousel (autoplay, optional)
  const galleryCarousel = $('#carouselGallery');
  if (galleryCarousel && window.bootstrap) {
    const carousel = bootstrap.Carousel.getOrCreateInstance(galleryCarousel, {
      interval: 6000,
      ride: false,
    });
    // Optional: Auto-pause on mouseenter
    galleryCarousel.addEventListener('mouseenter', () => carousel.pause());
    galleryCarousel.addEventListener('mouseleave', () => carousel.cycle());
  }

  // 12. Keyboard Accessibility Improvements
  // Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $all('.modal.show').forEach(modalEl => {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      });
    }
  });

  // 13. Prevent JS errors for missing elements (defensive coding throughout)
  // All selectors are checked for null before being used above.

  // 14. Optional: Lazy loading images (modern browsers only)
  $all('img').forEach(img => {
    img.loading = 'lazy';
  });
});
