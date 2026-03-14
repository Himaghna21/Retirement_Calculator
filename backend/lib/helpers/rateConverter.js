/**
 * Convert annual rate to monthly rate
 * @param {number} annualRate - Annual rate (as percentage, e.g., 12)
 * @returns {number} Monthly rate (as decimal, e.g., 0.00948...)
 */
export const annualRateToMonthly = (annualRate) => {
  const annualDecimal = annualRate / 100;
  return Math.pow(1 + annualDecimal, 1 / 12) - 1;
};

/**
 * Convert monthly rate back to annual rate
 * @param {number} monthlyRate - Monthly rate (as decimal)
 * @returns {number} Annual rate (as percentage)
 */
export const monthlyRateToAnnual = (monthlyRate) => {
  return (Math.pow(1 + monthlyRate, 12) - 1) * 100;
};

/**
 * Simple conversion: annual rate / 12
 * Use this for simple interest calculations
 * @param {number} annualRate - Annual rate (as percentage)
 * @returns {number} Monthly rate (as percentage)
 */
export const annualRateToMonthlySimple = (annualRate) => {
  return annualRate / 12;
};

/**
 * Convert annual rate (percentage) to decimal
 * @param {number} annualRate - Annual rate (as percentage)
 * @returns {number} Annual rate (as decimal)
 */
export const percentageToDecimal = (annualRate) => {
  return annualRate / 100;
};

/**
 * Convert decimal rate to percentage
 * @param {number} decimalRate - Rate as decimal
 * @returns {number} Rate as percentage
 */
export const decimalToPercentage = (decimalRate) => {
  return decimalRate * 100;
};