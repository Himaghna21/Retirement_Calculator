import { VALIDATION_RULES, getValidationError, validateRetirementAge } from './validationRules.js';

/**
 * Validate all calculator inputs
 * @param {Object} input - Input object containing all calculator fields
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateCalculatorInput = (input) => {
  const errors = {};

  // Check for required fields
  for (const [field, rule] of Object.entries(VALIDATION_RULES)) {
    const value = input[field];
    const error = getValidationError(field, value, VALIDATION_RULES);

    if (error) {
      errors[field] = error;
    }
  }

  // Additional cross-field validation
  if (!errors.currentAge && !errors.retirementAge) {
    const ageError = validateRetirementAge(input.currentAge, input.retirementAge);
    if (ageError) {
      errors.retirementAge = ageError;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : null,
  };
};

/**
 * Sanitize and convert input values to appropriate types
 * @param {Object} input - Raw input object
 * @returns {Object} Sanitized input with proper types
 */
export const sanitizeInput = (input) => {
  return {
    currentAge: parseInt(input.currentAge, 10),
    retirementAge: parseInt(input.retirementAge, 10),
    currentAnnualExpenses: parseFloat(input.currentAnnualExpenses),
    inflationRate: parseFloat(input.inflationRate),
    postRetirementReturn: parseFloat(input.postRetirementReturn),
    preRetirementReturn: parseFloat(input.preRetirementReturn),
    retirementDuration: input.retirementDuration
      ? parseInt(input.retirementDuration, 10)
      : VALIDATION_RULES.retirementDuration.default,
  };
};

/**
 * Comprehensive input validation and sanitization
 * @param {Object} input - Raw input
 * @returns {Object} { success: boolean, data: Object, errors: Object }
 */
export const validateAndSanitize = (input) => {
  // Validate
  const validation = validateCalculatorInput(input);

  if (!validation.isValid) {
    return {
      success: false,
      data: null,
      errors: validation.errors,
    };
  }

  // Sanitize
  const sanitized = sanitizeInput(input);

  return {
    success: true,
    data: sanitized,
    errors: null,
  };
};

/**
 * Build human-readable error message from validation errors
 * @param {Object} errors - Validation errors object
 * @returns {string} Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return null;

  const messages = Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join('; ');

  return messages;
};