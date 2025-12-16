/**
 * Product Password Protection
 * Handles password verification and localStorage access management
 */

class ProductPassword {
  constructor() {
    this.storageKey = 'unlockedProducts';
    this.init();
  }

  init() {
    // Get product ID and password from data attributes
    const productInfo = document.querySelector('[data-product-password-id]');
    if (!productInfo) return;

    this.productId = productInfo.dataset.productPasswordId;
    this.correctPassword = productInfo.dataset.productPasswordValue;
    this.prompt = productInfo.dataset.productPasswordPrompt;

    // Check if product is already unlocked
    if (this.isUnlocked()) {
      this.unlockProduct();
    } else {
      this.showModal();
    }

    // Setup form handler
    this.setupFormHandler();
  }

  isUnlocked() {
    const unlockedProducts = this.getUnlockedProducts();
    return unlockedProducts.includes(this.productId);
  }

  getUnlockedProducts() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return [];
    }
  }

  saveUnlockedProduct() {
    try {
      const unlockedProducts = this.getUnlockedProducts();
      if (!unlockedProducts.includes(this.productId)) {
        unlockedProducts.push(this.productId);
        localStorage.setItem(this.storageKey, JSON.stringify(unlockedProducts));
      }
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }

  showModal() {
    const overlay = document.querySelector('.product-password-overlay');
    if (overlay) {
      overlay.classList.add('active');
      // Add blur to product content
      const productInfo = document.querySelector('product-info');
      if (productInfo) {
        productInfo.classList.add('product-password-protected');
      }
      // Focus on input
      setTimeout(() => {
        const input = document.querySelector('.product-password-input');
        if (input) input.focus();
      }, 300);
    }
  }

  hideModal() {
    const overlay = document.querySelector('.product-password-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  unlockProduct() {
    this.hideModal();
    // Remove blur from product content
    const productInfo = document.querySelector('product-info');
    if (productInfo) {
      productInfo.classList.remove('product-password-protected');
    }
  }

  showError() {
    const errorElement = document.querySelector('.product-password-error');
    if (errorElement) {
      errorElement.classList.add('active');
      // Shake animation
      const modal = document.querySelector('.product-password-modal');
      if (modal) {
        modal.style.animation = 'shake 0.5s';
        setTimeout(() => {
          modal.style.animation = '';
        }, 500);
      }
    }
  }

  hideError() {
    const errorElement = document.querySelector('.product-password-error');
    if (errorElement) {
      errorElement.classList.remove('active');
    }
  }

  setupFormHandler() {
    const form = document.querySelector('.product-password-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.hideError();

      const input = form.querySelector('.product-password-input');
      const enteredPassword = input.value.trim();

      // Case-sensitive password comparison
      if (enteredPassword === this.correctPassword) {
        this.saveUnlockedProduct();
        this.unlockProduct();
      } else {
        this.showError();
        input.value = '';
        input.focus();
      }
    });

    // Hide error when user starts typing
    const input = form.querySelector('.product-password-input');
    if (input) {
      input.addEventListener('input', () => {
        this.hideError();
      });
    }
  }
}

// Add shake animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProductPassword();
  });
} else {
  new ProductPassword();
}
