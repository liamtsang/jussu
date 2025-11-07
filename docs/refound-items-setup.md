# Refound Items Setup Guide

## Overview
This guide explains how to manage "refound" items - vintage items that have been restocked after being found again in the wild.

## Setup Instructions

### 1. Create the Refound Collection (Automated)

1. Go to **Products** > **Collections** in Shopify admin
2. Click **Create collection**
3. Set the collection details:
   - **Title**: "Refound Items" (or your preferred name)
   - **Description**: Add a description about restocked vintage finds
4. Under **Collection type**, select **Automated**
5. Set the condition:
   - **Product tag** > **is equal to** > `refound`
6. Click **Save**

This collection will automatically include any product tagged with "refound".

### 2. Tagging Products as Refound

When you find the same item again:

1. Go to **Products** and find the product
2. In the **Tags** section, add: `refound`
3. Click **Save**

The product will automatically appear in the "Refound Items" collection and be excluded from the "All Products" collection.

### 3. Visual Indicator (Optional)

Products in the Refound Items collection will display a "Refound" badge to highlight that these are restocked vintage finds.

## How It Works

- Products tagged with `refound` appear in the dedicated "Refound Items" collection
- These products are automatically excluded from the "All Products" collection view
- The tag-based system makes it easy to manage without manual collection curation
- You can still assign refound items to other collections (by category, color, etc.) as normal
