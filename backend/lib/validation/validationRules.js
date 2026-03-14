/**
 * Validation rules and constraints for calculator inputs
 */

export const VALIDATION_RULES = {
  currentAge: {
    min: 18,
    max: 79,
    required: true,
    type: 'integer',
    description: 'Current age in years',
  },
  retirementAge: {
    min: 19, // Must be > currentAge
    max: 80,
    required: true,
    type: 'integer',
    description: 'Planned retirement age in years',
  },
  currentAnnualExpenses: {
    min: 0,
    max: 10000000000, // 100 crores
    required: true,
    type: 'number',
    description: 'Current annual expenses in rupees',
  },
  inflationRate: {
    min: 0,
    max: 50,
    required: true,
    type: 'number',
    description: 'Expected annual inflation rate (percentage)',
  },
  postRetirementReturn: {
    min: 0,
    max: 50,
    required: true,
    type: 'number',
    description: 'Expected post-retirement annual return (percentage)',
  },
  preRetirementReturn: {
    min: 0,
    max: 50,
    required: true,
    type: 'number',
    description: 'Expected pre-retirement annual return (percentage)',
  },
  retirementDuration: {
    min: 1,
    max: 100,
    required: false,
    type: 'integer',
    default: 20,
    description: 'Expected retirement duration in years (optional, defaults to 20)',
  },
};

/**
 * Get validation error message for a specific field and value
 */
export const getValidationError = (field, value, rules) => {
  const rule = rules[field];

  if (!rule) {
    return `Unknown field: ${field}`;
  }

  // Check if required
  if (rule.required && (value === null || value === undefined || value === '')) {
    return `${field} is required`;
  }

  // Skip validation for optional fields with no value
  if (!rule.required && (value === null || value === undefined || value === '')) {
    return null;
  }

  // Check type
  if (rule.type === 'integer') {
    if (!Number.isInteger(Number(value))) {
      return `${field} must be a whole number`;
    }
  } else if (rule.type === 'number') {
    if (isNaN(Number(value))) {
      return `${field} must be a valid number`;
    }
  }

  const numValue = Number(value);

  // Check min
  if (numValue < rule.min) {
    return `${field} must be at least ${rule.min}`;
  }

  // Check max
  if (numValue > rule.max) {
    return `${field} must be at most ${rule.max}`;
  }

  return null;
};

/**
 * Validate retirement age vs current age
 */
export const validateRetirementAge = (currentAge, retirementAge) => {
  const current = Number(currentAge);
  const retirement = Number(retirementAge);

  if (retirement <= current) {
    return 'Retirement age must be greater than current age';
  }

  return null;
};