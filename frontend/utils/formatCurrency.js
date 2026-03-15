/**
 * Format number to Indian currency (₹) with lakh/crore notation
 * @param {number} value - The numeric value to format
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, decimalPlaces = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '₹0';
  }
  if (value === 0) {
    return '₹0';
  }

  const absValue = Math.abs(value);
  let formattedValue;

  if (absValue >= 10000000) {
    // Crore
    formattedValue = (value / 10000000).toFixed(decimalPlaces);
    return `₹${formattedValue}Cr`;
  } else if (absValue >= 100000) {
    // Lakh
    formattedValue = (value / 100000).toFixed(decimalPlaces);
    return `₹${formattedValue}L`;
  } else {
    // Regular number with thousand separators
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value);
  }
};

/**
 * Format currency for display in results (more verbose)
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted currency string with full breakdown
 */
export const formatCurrencyDetailed = (value) => {
  const formatted = formatCurrency(value);
  const absValue = Math.abs(value);

  if (absValue >= 10000000) {
    const crores = (value / 10000000).toFixed(2);
    const lakhs = ((value % 10000000) / 100000).toFixed(2);
    return `${formatted} (${crores} Crore)`;
  } else if (absValue >= 100000) {
    const lakhs = (value / 100000).toFixed(2);
    return `${formatted} (${lakhs} Lakhs)`;
  }

  return formatted;
};

/**
 * Parse currency input string to number
 * @param {string} currencyString - Currency string or number
 * @returns {number} Parsed numeric value
 */
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') {
    return currencyString;
  }

  if (typeof currencyString !== 'string') {
    return 0;
  }

  // Remove currency symbols and text
  let cleaned = currencyString.replace(/[₹, L, Cr, C]/g, '').trim();

  // Handle crore notation
  if (currencyString.includes('Cr') || currencyString.includes('C')) {
    return parseFloat(cleaned) * 10000000;
  }

  // Handle lakh notation
  if (currencyString.includes('L')) {
    return parseFloat(cleaned) * 100000;
  }

  return parseFloat(cleaned) || 0;
};