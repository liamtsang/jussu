class ProductHoverInfo {
  constructor() {
    this.init();
  }

  init() {
    this.productGrid = document.getElementById('product-grid');
    this.infoPanel = document.getElementById('product-info-panel');
    this.infoPlaceholder = this.infoPanel?.querySelector('.product-info-placeholder');
    this.infoDetails = this.infoPanel?.querySelector('.product-info-details');
    this.infoImage = document.getElementById('info-product-image');
    this.infoTitle = document.getElementById('info-product-title');
    this.infoDescription = document.getElementById('info-product-description');
    this.infoPrice = document.getElementById('info-product-price');

    if (!this.productGrid || !this.infoPanel) return;

    this.bindEvents();
  }

  bindEvents() {
    const productItems = this.productGrid.querySelectorAll('.grid__item[data-product-id]');
    
    productItems.forEach(item => {
      item.addEventListener('mouseenter', () => this.showProductInfo(item));
      item.addEventListener('mouseleave', () => this.hideProductInfo());
    });

    // Hide info when hovering over the info panel itself to prevent flickering
    this.infoPanel.addEventListener('mouseenter', () => {
      // Keep the current state when hovering over info panel
    });
  }

  showProductInfo(productItem) {
    const productData = {
      id: productItem.dataset.productId,
      title: productItem.dataset.productTitle,
      itemNumber: productItem.dataset.productItemNumber,
      description: productItem.dataset.productDescription,
      price: productItem.dataset.productPrice,
      comparePrice: productItem.dataset.productComparePrice,
      available: productItem.dataset.productAvailable === 'true',
      image: productItem.dataset.productImage,
      imageAlt: productItem.dataset.productImageAlt
    };

    this.updateInfoPanel(productData);
  }

  hideProductInfo() {
    if (!this.infoPanel) return;
    
    // Small delay to prevent flickering when moving between products
    setTimeout(() => {
      if (!this.infoPanel.matches(':hover') && !this.productGrid.matches(':hover')) {
        this.showPlaceholder();
      }
    }, 100);
  }

  updateInfoPanel(productData) {
    if (!this.infoDetails || !this.infoPlaceholder) return;

    // Update content
    if (this.infoImage && productData.image) {
      this.infoImage.src = productData.image;
      this.infoImage.alt = productData.imageAlt || productData.title;
    }

    if (this.infoTitle) {
      // Use item number if available, otherwise fallback to title
      this.infoTitle.textContent = productData.itemNumber || productData.title;
    }

    if (this.infoDescription) {
      this.infoDescription.textContent = productData.description || 'No description available.';
    }

    if (this.infoPrice) {
      let priceHtml = `<span class="price-item price-item--regular">${productData.price}</span>`;
      
      if (productData.comparePrice && productData.comparePrice !== productData.price) {
        priceHtml = `
          <span class="price-item price-item--sale">${productData.price}</span>
          <s class="price-item price-item--regular">${productData.comparePrice}</s>
        `;
      }

      if (!productData.available) {
        priceHtml += '<span class="price-item--unavailable"> - Sold Out</span>';
      }

      this.infoPrice.innerHTML = priceHtml;
    }

    // Show details, hide placeholder
    this.infoPlaceholder.style.display = 'none';
    this.infoDetails.style.display = 'block';
  }

  showPlaceholder() {
    if (!this.infoDetails || !this.infoPlaceholder) return;
    
    this.infoDetails.style.display = 'none';
    this.infoPlaceholder.style.display = 'block';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProductHoverInfo();
});

// Reinitialize after AJAX updates (for filtering, pagination, etc.)
document.addEventListener('shopify:section:load', () => {
  new ProductHoverInfo();
});