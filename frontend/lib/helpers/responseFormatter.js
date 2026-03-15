/**
 * Format API response for success
 * @param {Object} data - Data to include in response
 * @param {string} message - Optional success message
 * @returns {Object} Formatted response
 */
export const formatSuccessResponse = (data, message = 'Calculation successful') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format API response for errors
 * @param {string} message - Error message
 * @param {Object} errors - Detailed error information
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
export const formatErrorResponse = (message, errors = null, statusCode = 400) => {
  return {
    success: false,
    message,
    errors,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format calculation results for API response
 * @param {Object} input - User inputs
 * @param {Object} calculations - Calculated values
 * @param {Object} assumptions - Applied assumptions
 * @returns {Object} Formatted calculation result
 */
export const formatCalculationResult = (input, calculations, assumptions) => {
  return {
    retirementAnnualExpense: calculations.retirementAnnualExpense,
    requiredCorpus: calculations.requiredCorpus,
    requiredMonthlySIP: calculations.requiredMonthlySIP,
    yearsToRetirement: calculations.yearsToRetirement,
    assumptions: {
      inflationRate: `${input.inflationRate}%`,
      preRetirementReturn: `${input.preRetirementReturn}%`,
      postRetirementReturn: `${input.postRetirementReturn}%`,
      retirementDuration: `${assumptions.retirementDuration} years`,
      lifeExpectancyAssumption: '85 years',
    },
    disclaimer:
      'This is an illustrative calculation. Actual results may vary based on market conditions and other factors.',
    calculatedAt: new Date().toISOString(),
  };
};