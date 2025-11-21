/**
 * Movie Script Text - Auto-scroll functionality
 */

class MovieScriptText {
  constructor(container) {
    this.container = container;
    this.scrollable = container.querySelector('.movie-script-text__scrollable');
    this.content = container.querySelector('.movie-script-text__content');
    this.isAutoScrollEnabled = this.container.dataset.autoScroll === 'true';
    this.scrollSpeed = parseInt(this.container.dataset.scrollSpeed) || 30;
    this.isPaused = false;

    if (this.isAutoScrollEnabled && this.content) {
      this.init();
    }
  }

  init() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // Set up the animation
    this.setupAnimation();

    // Add hover pause functionality
    this.setupHoverPause();

    // Handle window resize
    this.handleResize();
  }

  setupAnimation() {
    // Calculate the duration based on a single item's height and scroll speed
    // Since we have two copies of the content, we only need to animate through one
    const firstItem = this.content.querySelector('.movie-script-text__item');
    if (!firstItem) return;

    const itemHeight = firstItem.scrollHeight;
    const duration = itemHeight / this.scrollSpeed;

    this.content.style.animationDuration = `${duration}s`;
    this.content.classList.add('scrolling');
  }

  setupHoverPause() {
    // Add visual indicator that hovering will pause
    this.container.classList.add('can-pause');

    // Pause on hover
    this.container.addEventListener('mouseenter', () => {
      if (this.isAutoScrollEnabled) {
        this.content.classList.add('paused');
        this.isPaused = true;
      }
    });

    // Resume on mouse leave
    this.container.addEventListener('mouseleave', () => {
      if (this.isAutoScrollEnabled) {
        this.content.classList.remove('paused');
        this.isPaused = false;
      }
    });

    // Also pause if user clicks (for touch devices)
    this.container.addEventListener('click', (e) => {
      // Don't toggle if clicking on a link
      if (e.target.tagName === 'A') {
        return;
      }

      if (this.isAutoScrollEnabled) {
        if (this.isPaused) {
          this.content.classList.remove('paused');
          this.isPaused = false;
        } else {
          this.content.classList.add('paused');
          this.isPaused = true;
        }
      }
    });
  }

  handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Recalculate animation duration on resize
        if (this.isAutoScrollEnabled) {
          this.setupAnimation();
        }
      }, 250);
    });
  }

  destroy() {
    // Clean up if needed
    if (this.content) {
      this.content.classList.remove('scrolling', 'paused');
      this.content.style.animationDuration = '';
    }
  }
}

// Initialize all movie script sections on the page
function initMovieScriptSections() {
  const containers = document.querySelectorAll('.movie-script-text__container');
  containers.forEach((container) => {
    if (!container.movieScriptInstance) {
      container.movieScriptInstance = new MovieScriptText(container);
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMovieScriptSections);
} else {
  initMovieScriptSections();
}

// Reinitialize on Shopify theme editor section updates
if (Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const container = event.target.querySelector('.movie-script-text__container');
    if (container) {
      // Destroy old instance if exists
      if (container.movieScriptInstance) {
        container.movieScriptInstance.destroy();
      }
      // Create new instance
      container.movieScriptInstance = new MovieScriptText(container);
    }
  });

  document.addEventListener('shopify:section:unload', (event) => {
    const container = event.target.querySelector('.movie-script-text__container');
    if (container && container.movieScriptInstance) {
      container.movieScriptInstance.destroy();
    }
  });
}
