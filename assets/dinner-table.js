{% comment %}
=================================================================================
FILE: assets/dinner-table.js
=================================================================================
{% endcomment %}

<script>
class DinnerTableComponent {
  constructor() {
    this.bindEvents();
    this.preloadHoverImages();
  }
  
  bindEvents() {
    // Handle different click actions
    document.addEventListener('click', (e) => {
      const clickTarget = e.target.closest('.item-click-target');
      if (!clickTarget) return;
      
      const productItem = clickTarget.closest('.table-product-item');
      const clickAction = productItem.dataset.clickAction;
      const productHandle = clickTarget.dataset.productHandle;
      
      switch (clickAction) {
        case 'add_to_cart':
          e.preventDefault();
          this.addToCart(productItem);
          break;
        case 'quick_view':
          e.preventDefault();
          this.openQuickView(productHandle);
          break;
        // 'product_page' - let default link behavior happen
      }
    });
    
    // Track hover events for analytics
    document.addEventListener('mouseenter', (e) => {
      const productItem = e.target.closest('.table-product-item');
      if (!productItem) return;
      
      this.trackHover(productItem.dataset.productId);
    }, true);
  }
  
  preloadHoverImages() {
    const hoverImages = document.querySelectorAll('.item-hover-state');
    hoverImages.forEach(img => {
      const imagePreloader = new Image();
      imagePreloader.src = img.src;
    });
  }
  
  async addToCart(productItem) {
    const productId = productItem.dataset.productId;
    
    try {
      productItem.dataset.loading = 'true';
      
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: productId,
          quantity: 1
        })
      });
      
      if (response.ok) {
        this.showSuccess(productItem);
        this.updateCartCount();
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      this.showError(productItem, error.message);
    } finally {
      productItem.dataset.loading = 'false';
    }
  }
  
  openQuickView(productHandle) {
    // Trigger quick view modal (assumes you have a quick view system)
    if (window.quickView) {
      window.quickView.open(productHandle);
    } else {
      // Fallback to product page
      window.location.href = `/products/${productHandle}`;
    }
  }
  
  showSuccess(productItem) {
    const successMsg = document.createElement('div');
    successMsg.className = 'cart-success-message';
    successMsg.textContent = 'Added to cart!';
    successMsg.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #28a745;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      z-index: 40;
      animation: fadeInOut 2s ease forwards;
    `;
    
    productItem.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 2000);
  }
  
  showError(productItem, message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'cart-error-message';
    errorMsg.textContent = message || 'Error adding to cart';
    errorMsg.style.cssText = `
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: #dc3545;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      z-index: 40;
      animation: fadeInOut 3s ease forwards;
    `;
    
    productItem.appendChild(errorMsg);
    setTimeout(() => errorMsg.remove(), 3000);
  }
  
  async updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      // Update cart count in header (adjust selector as needed)
      const cartCountElements = document.querySelectorAll('.cart-count');
      cartCountElements.forEach(el => {
        el.textContent = cart.item_count;
      });
    } catch (error) {
      console.warn('Could not update cart count:', error);
    }
  }
  
  trackHover(productId) {
    // Send analytics event (Google Analytics, Klaviyo, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'dinner_table_hover', {
        'product_id': productId,
        'event_category': 'product_interaction'
      });
    }
  }
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new DinnerTableComponent());
} else {
  new DinnerTableComponent();
}
</script>

{% comment %}
=================================================================================
USAGE INSTRUCTIONS:
=================================================================================

1. Add the section file: sections/interactive-dinner-table.liquid
2. Add the snippet file: snippets/dinner-table-product-item.liquid  
3. Add the JavaScript file: assets/dinner-table.js
4. Include the JS in your theme.liquid: {{ 'dinner-table.js' | asset_url | script_tag }}

MERCHANT SETUP:
1. Upload a dinner table background image
2. For each product, upload two images:
   - Normal state (outline/subtle version)
   - Hover state (highlighted/full version)
3. Position each product using the X/Y percentage sliders
4. Choose click action: product page, add to cart, or quick view

CUSTOMIZATION OPTIONS:
- Table dimensions and styling
- Product positioning with visual sliders
- Hover effects and scaling
- Click behaviors
- Product info overlays
- Mobile responsiveness

The system is fully flexible - merchants can add/remove/reposition products
through the Shopify admin without touching code!
{% endcomment %}