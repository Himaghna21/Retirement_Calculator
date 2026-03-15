/**
 * Step 1: Calculate inflation-adjusted annual expenses at retirement
 * Formula: Retirement Annual Expense = Current Annual Expense × (1 + inflation_rate)^(years_to_retirement)
 * 
 * @param {number} currentExpenses - Current annual expenses
 * @param {number} inflationRate - Annual inflation rate (as percentage, e.g., 6 for 6%)
 * @param {number} yearsToRetirement - Number of years until retirement
 * @returns {number} Inflation-adjusted annual expense at retirement
 */
export const inflateExpenses = (currentExpenses, inflationRate, yearsToRetirement) => {
  // Input validation
  if (typeof currentExpenses !== 'number' || currentExpenses < 0) {
    throw new Error('Current expenses must be a non-negative number');
  }
  if (typeof inflationRate !== 'number' || inflationRate < 0 || inflationRate > 100) {
    throw new Error('Inflation rate must be between 0 and 100');
  }
  if (typeof yearsToRetirement !== 'number' || yearsToRetirement < 0) {
    throw new Error('Years to retirement must be a non-negative number');
  }

  // Convert percentage to decimal
  const inflationDecimal = inflationRate / 100;

  // Apply inflation formula: FV = PV × (1 + r)^n
  const inflationFactor = Math.pow(1 + inflationDecimal, yearsToRetirement);
  const retirementExpense = currentExpenses * inflationFactor;

  // Round to 2 decimal places
  return Math.round(retirementExpense * 100) / 100;
};

/**
 * Calculate years to retirement
 * @param {number} currentAge - Current age
 * @param {number} retirementAge - Planned retirement age
 * @returns {number} Years to retirement
 */
export const calculateYearsToRetirement = (currentAge, retirementAge) => {
  if (typeof currentAge !== 'number' || typeof retirementAge !== 'number') {
    throw new Error('Both ages must be numbers');
  }
  if (currentAge >= retirementAge) {
    throw new Error('Retirement age must be greater than current age');
  }
  return retirementAge - currentAge;
};