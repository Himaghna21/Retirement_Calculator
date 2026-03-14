/**
 * Check if rate is effectively zero (handle floating-point precision)
 * @param {number} rate - Rate as decimal (e.g., 0.07)
 * @param {number} tolerance - Tolerance for comparison (default: 1e-10)
 * @returns {boolean} True if rate is effectively zero
 */
export const isZeroRate = (rate, tolerance = 1e-10) => {
  return Math.abs(rate) < tolerance;
};

/**
 * Handle division by zero in financial calculations
 * @param {number} numerator - Numerator
 * @param {number} denominator - Denominator
 * @param {number} fallbackValue - Value to return if denominator is zero
 * @returns {number} Result or fallback value
 */
export const safeDivide = (numerator, denominator, fallbackValue = 0) => {
  if (isZeroRate(denominator)) {
    return fallbackValue;
  }
  return numerator / denominator;
};

/**
 * Round to 2 decimal places safely
 * @param {number} value - Value to round
 * @returns {number} Rounded value
 */
export const roundTo2Decimals = (value) => {
  return Math.round(value * 100) / 100;
};

/**
 * Validate that corpus and SIP values are within reasonable bounds
 * @param {number} corpus - Required corpus
 * @param {number} monthlySIP - Required monthly SIP
 * @returns {boolean} True if values are reasonable
 */
export const isReasonableResult = (corpus, monthlySIP) => {
  // Corpus should not exceed 100 crores (1 billion rupees)
  if (corpus > 1000000000) {
    return false;
  }

  // Monthly SIP should not exceed 1 crore
  if (monthlySIP > 10000000) {
    return false;
  }

  // Both should be positive
  if (corpus <= 0 || monthlySIP <= 0) {
    return false;
  }

  return true;
};

/**
 * Get safe maximum values for validation
 */
export const getMaximumLimits = () => {
  return {
    maxCorpus: 1000000000, // 100 crores
    maxMonthlySIP: 10000000, // 1 crore
    maxAnnualExpense: 500000000, // 50 crores
  };
};