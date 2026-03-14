/**
 * Step 2: Calculate required retirement corpus using Present Value of Annuity formula
 * Formula: Corpus = Annual Expense × [(1 − (1 + r)^(−t)) ÷ r]
 * 
 * Where:
 * - Annual Expense = Inflation-adjusted annual expense at retirement
 * - r = Post-retirement annual return (as decimal, e.g., 0.07 for 7%)
 * - t = Expected retirement duration in years
 * 
 * @param {number} retirementAnnualExpense - Inflation-adjusted annual expense at retirement
 * @param {number} postRetirementReturn - Post-retirement annual return (as percentage, e.g., 7)
 * @param {number} retirementDuration - Expected retirement duration in years (default: 20)
 * @returns {number} Required corpus at retirement
 */
export const calculateRetirementCorpus = (
  retirementAnnualExpense,
  postRetirementReturn,
  retirementDuration = 20
) => {
  // Input validation
  if (typeof retirementAnnualExpense !== 'number' || retirementAnnualExpense < 0) {
    throw new Error('Retirement annual expense must be a non-negative number');
  }
  if (typeof postRetirementReturn !== 'number' || postRetirementReturn < 0 || postRetirementReturn > 100) {
    throw new Error('Post-retirement return must be between 0 and 100');
  }
  if (typeof retirementDuration !== 'number' || retirementDuration <= 0) {
    throw new Error('Retirement duration must be greater than 0');
  }

  // Convert percentage to decimal
  const rDecimal = postRetirementReturn / 100;

  // Handle edge case: r = 0 (zero return)
  // If return is 0, corpus = expense × duration (simple multiplication)
  if (rDecimal === 0) {
    return Math.round(retirementAnnualExpense * retirementDuration * 100) / 100;
  }

  // Present Value of Annuity formula: PV = PMT × [(1 - (1 + r)^-t) / r]
  // PV = corpus (what we're solving for)
  // PMT = annual expense (payment needed each year)
  // r = annual return rate
  // t = number of years
  
  const pvFactor = (1 - Math.pow(1 + rDecimal, -retirementDuration)) / rDecimal;
  const requiredCorpus = retirementAnnualExpense * pvFactor;

  // Round to 2 decimal places
  return Math.round(requiredCorpus * 100) / 100;
};

/**
 * Calculate retirement duration based on retirement age
 * Assumes life expectancy of 85 years
 * @param {number} retirementAge - Planned retirement age
 * @returns {number} Expected retirement duration in years
 */
export const calculateRetirementDuration = (retirementAge) => {
  const ASSUMED_LIFE_EXPECTANCY = 85;
  if (typeof retirementAge !== 'number') {
    throw new Error('Retirement age must be a number');
  }
  if (retirementAge >= ASSUMED_LIFE_EXPECTANCY) {
    return 1; // Minimum 1 year if already at or past life expectancy assumption
  }
  return ASSUMED_LIFE_EXPECTANCY - retirementAge;
};