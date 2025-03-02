// skuGenerator.js

/**
 * Generates a unique SKU for a product.
 * @param {string} [productName] - Optional product name to help generate a SKU prefix.
 * @returns {string} A unique SKU string.
 */
function generateSKU(productName?: string) {
  // Use the first 3 characters of the product name as a prefix if available, otherwise default to 'PRO'
  const prefix =
    productName && productName.trim().length >= 3
      ? productName.trim().substring(0, 3).toUpperCase()
      : "PRO";

  // Generate a random alphanumeric string (4 characters)
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Use the last 4 digits of the current timestamp as an extra uniqueness factor
  const timePart = Date.now().toString().slice(-4);

  // Combine the parts with dashes
  return `${prefix}-${randomPart}-${timePart}`;
}

export { generateSKU };
