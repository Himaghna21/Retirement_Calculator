import {
  validateCalculatorInput,
  sanitizeInput,
  validateAndSanitize,
  formatValidationErrors,
} from '@/lib/validation/inputValidator.js';

describe('validateCalculatorInput', () => {
  const validInput = {
    currentAge: 35,
    retirementAge: 60,
    currentAnnualExpenses: 1000000,
    inflationRate: 6,
    postRetirementReturn: 7,
    preRetirementReturn: 12,
  };

  test('validates correct input', () => {
    const result = validateCalculatorInput(validInput);
    expect(result.isValid).toBe(true);
    expect(result.errors).toBeNull();
  });

  test('rejects missing current age', () => {
    const input = { ...validInput, currentAge: undefined };
    const result = validateCalculatorInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.currentAge).toBeDefined();
  });

  test('rejects age below minimum', () => {
    const input = { ...validInput, currentAge: 17 };
    const result = validateCalculatorInput(input);
    expect(result.isValid).toBe(false);
  });

  test('rejects retirement age less than current age', () => {
    const input = { ...validInput, retirementAge: 30 };
    const result = validateCalculatorInput(input);
    expect(result.isValid).toBe(false);
  });

  test('rejects negative expenses', () => {
    const input = { ...validInput, currentAnnualExpenses: -1000000 };
    const result = validateCalculatorInput(input);
    expect(result.isValid).toBe(false);
  });

  test('rejects invalid inflation rate', () => {
    const input = { ...validInput, inflationRate: 101 };
    const result = validateCalculatorInput(input);
    expect(result.isValid).toBe(false);
  });
});

describe('sanitizeInput', () => {
  test('converts string numbers to actual numbers', () => {
    const input = {
      currentAge: '35',
      retirementAge: '60',
      currentAnnualExpenses: '1000000.50',
      inflationRate: '6.5',
      postRetirementReturn: '7',
      preRetirementReturn: '12',
    };
    const sanitized = sanitizeInput(input);
    expect(typeof sanitized.currentAge).toBe('number');
    expect(sanitized.currentAge).toBe(35);
    expect(sanitized.currentAnnualExpenses).toBe(1000000.50);
  });

  test('sets default retirement duration if not provided', () => {
    const input = {
      currentAge: 35,
      retirementAge: 60,
      currentAnnualExpenses: 1000000,
      inflationRate: 6,
      postRetirementReturn: 7,
      preRetirementReturn: 12,
    };
    const sanitized = sanitizeInput(input);
    expect(sanitized.retirementDuration).toBe(20); // default
  });
});

describe('validateAndSanitize', () => {
  test('returns success with valid input', () => {
    const input = {
      currentAge: '35',
      retirementAge: '60',
      currentAnnualExpenses: '1000000',
      inflationRate: '6',
      postRetirementReturn: '7',
      preRetirementReturn: '12',
    };
    const result = validateAndSanitize(input);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeNull();
  });

  test('returns errors with invalid input', () => {
    const input = {
      currentAge: 'invalid',
      retirementAge: 60,
      currentAnnualExpenses: 1000000,
      inflationRate: 6,
      postRetirementReturn: 7,
      preRetirementReturn: 12,
    };
    const result = validateAndSanitize(input);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});

describe('formatValidationErrors', () => {
  test('formats error object into readable string', () => {
    const errors = {
      currentAge: 'Age must be between 18 and 79',
      retirementAge: 'Retirement age must be greater than current age',
    };
    const formatted = formatValidationErrors(errors);
    expect(formatted).toContain('currentAge');
    expect(formatted).toContain('retirementAge');
    expect(formatted).toContain('Age must be between');
  });
});