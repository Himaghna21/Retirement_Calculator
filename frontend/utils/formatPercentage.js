/**
 * Format number as percentage
 * @param {number} value - The numeric value (e.g., 6 for 6%)
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimalPlaces = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${parseFloat(value).toFixed(decimalPlaces)}%`;
};

/**
 * Parse percentage input to decimal
 * @param {string|number} percentageString - Percentage string or number
 * @returns {number} Parsed percentage value
 */
export const parsePercentage = (percentageString) => {
  if (typeof percentageString === 'number') {
    return percentageString;
  }

  if (typeof percentageString !== 'string') {
    return 0;
  }

  const cleaned = percentageString.replace(/%/g, '').trim();
  return parseFloat(cleaned) || 0;
};

/**
 * Convert percentage to decimal for calculations
 * @param {number} percentage - Percentage value (e.g., 6)
 * @returns {number} Decimal value (e.g., 0.06)
 */
export const percentageToDecimal = (percentage) => {
  return percentage / 100;
};

/**
 * Convert decimal to percentage
 * @param {number} decimal - Decimal value (e.g., 0.06)
 * @returns {number} Percentage value (e.g., 6)
 */
export const decimalToPercentage = (decimal) => {
  return decimal * 100;
};