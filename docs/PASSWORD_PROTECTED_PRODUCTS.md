# Password-Protected Products

This feature allows you to add password protection to individual products with custom security questions.

## How It Works

- Protected products are **hidden from collection pages** and search results
- Customers can only access them via direct URL
- Once unlocked, access persists in the browser (localStorage)
- Each product can have a unique password and custom prompt

## Setting Up Password Protection

### Step 1: Create Product Metafields

You need to add three custom metafields to your Shopify store:

1. **Navigate to:** Settings → Custom data → Products
2. **Add these three metafield definitions:**

#### Metafield 1: Enable Protection
- **Namespace and key:** `custom.is_password_protected`
- **Name:** Is Password Protected
- **Type:** True/False (Boolean)
- **Description:** Toggle password protection on/off for this product

#### Metafield 2: Password/Answer
- **Namespace and key:** `custom.access_password`
- **Name:** Access Password
- **Type:** Single line text
- **Description:** The password or answer required to unlock this product

#### Metafield 3: Custom Prompt
- **Namespace and key:** `custom.access_prompt`
- **Name:** Access Prompt
- **Type:** Single line text
- **Description:** The question or message shown to users (e.g., "What is the secret code?")

### Step 2: Configure a Product

1. Go to **Products** in your Shopify Admin
2. Select the product you want to protect
3. Scroll down to the **Metafields** section
4. Fill in the three fields:
   - **Is Password Protected:** ✅ (check the box)
   - **Access Password:** `yourpassword` (the answer users must enter)
   - **Access Prompt:** `What is the answer to blah?` (your custom question)
5. Save the product

## Example Configuration

```
Product: Secret Collection Item

Is Password Protected: ✅
Access Password: unicorn2024
Access Prompt: What is the secret word for VIP access?
```

When a customer visits this product directly:
1. They'll see a modal overlay asking: "What is the secret word for VIP access?"
2. They must type: `unicorn2024`
3. Once entered correctly, the product is revealed and they can add it to cart
4. The product remains unlocked for future visits (stored in browser)

## Important Notes

### Visibility
- Protected products **DO NOT appear** in:
  - Collection pages
  - Product grids
  - Search results (standard Shopify search)

- They **CAN** be accessed via:
  - Direct URL (e.g., `yourstore.com/products/secret-item`)
  - Custom navigation links
  - Email campaigns with product links

### Security Considerations
⚠️ **This is not high-security encryption!**

- Passwords are stored as plain text in metafields
- Anyone with product editing access can see the passwords
- Passwords are compared client-side (in the browser)
- This is suitable for:
  - Soft access control (exclusive releases, VIP products)
  - Quiz-style access ("What's our brand color?")
  - Simple gating mechanisms

- This is **NOT** suitable for:
  - Protecting sensitive information
  - Legal/compliance requirements
  - Financial data
  - True security needs

### Browser Storage
- Unlocked products are stored in the browser's localStorage
- Clearing browser data will require re-entering the password
- Each browser/device is tracked separately

## Troubleshooting

### Product still shows in collections
- Ensure `Is Password Protected` is checked (✅)
- Refresh the collection page
- Check that the metafield namespace is exactly `custom.is_password_protected`

### Password not working
- Passwords are **case-sensitive**: `Secret` ≠ `secret`
- Check for extra spaces before/after the password
- Verify the metafield value in Shopify Admin

### Modal doesn't appear
- Ensure the product has all three metafields filled:
  1. `is_password_protected` = true
  2. `access_password` = (some value)
  3. `access_prompt` = (some text)
- Check browser console for JavaScript errors
- Make sure you're viewing the actual product page (not a collection)

## Removing Password Protection

To make a protected product public again:
1. Edit the product
2. Uncheck **Is Password Protected** (or delete the metafield value)
3. Save

The product will now appear in collections normally.

## Tips & Best Practices

1. **Share direct links:** Since protected products are hidden, share the direct product URL with your audience
2. **Use descriptive prompts:** Make it clear what you're asking ("Enter the code from your email" vs just "Password?")
3. **Keep passwords simple:** Users need to type them, so avoid complex strings
4. **Test in incognito:** Check the experience by opening the product URL in a private/incognito window
5. **Consider email campaigns:** Send the product link + password to your VIP list

## Technical Details

### Files Modified
- `sections/main-product.liquid` - Renders password modal on product pages
- `snippets/card-product.liquid` - Hides protected products from grids
- `sections/main-collection-product-grid.liquid` - Filters collection displays

### Files Created
- `assets/product-password.js` - Password verification logic
- `assets/product-password.css` - Modal styling
- `snippets/product-password-modal.liquid` - Password prompt UI

### Customization
To customize the appearance, edit:
- **Styling:** `/assets/product-password.css`
- **Text/translations:** Edit the Liquid translations in `product-password-modal.liquid` or add to your theme's locale files
- **Behavior:** Modify `/assets/product-password.js`
