/**
 * Step 3: Calculate required Monthly SIP using Future Value of Annuity formula
 * Formula (rearranged to solve for P): P = FV ÷ [((1 + i)^n − 1) ÷ i] × (1 + i)
 * 
 * Where:
 * - FV = Future Value (required corpus from Step 2)
 * - i = Monthly return rate (annual rate ÷ 12)
 * - n = Number of months to retirement (years × 12)
 * - P = Monthly SIP payment (what we're solving for)
 * 
 * @param {number} requiredCorpus - Total corpus needed at retirement (from Step 2)
 * @param {number} preRetirementReturn - Pre-retirement annual return (as percentage, e.g., 12)
 * @param {number} yearsToRetirement - Number of years until retirement
 * @returns {number} Required monthly SIP amount
 */
export const calculateMonthlySIP = (
  requiredCorpus,
  preRetirementReturn,
  yearsToRetirement
) => {
  // Input validation
  if (typeof requiredCorpus !== 'number' || requiredCorpus < 0) {
    throw new Error('Required corpus must be a non-negative number');
  }
  if (typeof preRetirementReturn !== 'number' || preRetirementReturn < 0 || preRetirementReturn > 100) {
    throw new Error('Pre-retirement return must be between 0 and 100');
  }
  if (typeof yearsToRetirement !== 'number' || yearsToRetirement <= 0) {
    throw new Error('Years to retirement must be greater than 0');
  }

  // Convert annual percentage to monthly decimal
  const monthlyReturn = preRetirementReturn / 100 / 12;
  const numberOfMonths = yearsToRetirement * 12;

  // Handle edge case: monthly return = 0
  if (monthlyReturn === 0) {
    // Simple case: P = FV / n (equal monthly payments with no returns)
    return Math.round((requiredCorpus / numberOfMonths) * 100) / 100;
  }

  // Future Value of Annuity Due formula (assuming regular monthly contributions)
  // FV = P × [((1 + i)^n - 1) / i] × (1 + i)
  // Rearranged: P = FV / {[((1 + i)^n - 1) / i] × (1 + i)}
  
  const termOne = Math.pow(1 + monthlyReturn, numberOfMonths);
  const futureValueFactor = ((termOne - 1) / monthlyReturn) * (1 + monthlyReturn);
  
  // SIP (Monthly payment)
  const monthlySIP = requiredCorpus / futureValueFactor;

  // Round to 2 decimal places
  return Math.round(monthlySIP * 100) / 100;
};

/**
 * Alternative SIP calculation using ordinary annuity (payments at end of month)
 * Some may prefer this simpler version
 * @param {number} requiredCorpus - Total corpus needed
 * @param {number} preRetirementReturn - Annual return percentage
 * @param {number} yearsToRetirement - Years to retirement
 * @returns {number} Monthly SIP amount (ordinary annuity)
 */
export const calculateMonthlySIPOrdinary = (
  requiredCorpus,
  preRetirementReturn,
  yearsToRetirement
) => {
  const monthlyReturn = preRetirementReturn / 100 / 12;
  const numberOfMonths = yearsToRetirement * 12;

  if (monthlyReturn === 0) {
    return Math.round((requiredCorpus / numberOfMonths) * 100) / 100;
  }

  // Ordinary annuity (payment at end of period)
  // FV = P × [((1 + i)^n - 1) / i]
  // P = FV / [((1 + i)^n - 1) / i]
  
  const termOne = Math.pow(1 + monthlyReturn, numberOfMonths);
  const futureValueFactor = (termOne - 1) / monthlyReturn;
  const monthlySIP = requiredCorpus / futureValueFactor;

  return Math.round(monthlySIP * 100) / 100;
};