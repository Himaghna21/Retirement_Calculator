import { calculateMonthlySIP, calculateMonthlySIPOrdinary } from '@/lib/calculations/sipCalculator.js';

describe('calculateMonthlySIP', () => {
  test('calculates SIP for basic case', () => {
    // Corpus: 1,000,000, Return: 12% annual, Years: 25
    // Should calculate monthly SIP needed
    const result = calculateMonthlySIP(1000000, 12, 25);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10000); // Should be reasonable amount
  });

  test('handles zero return rate', () => {
    // With 0% return, SIP = corpus / (years × 12)
    const result = calculateMonthlySIP(1000000, 0, 25);
    expect(result).toBeCloseTo(1000000 / (25 * 12), 2);
  });

  test('calculates lower SIP with higher returns', () => {
    const sipLow = calculateMonthlySIP(1000000, 8, 25);
    const sipHigh = calculateMonthlySIP(1000000, 12, 25);
    expect(sipHigh).toBeLessThan(sipLow);
  });

  test('throws error for negative corpus', () => {
    expect(() => {
      calculateMonthlySIP(-1000000, 12, 25);
    }).toThrow('Required corpus must be a non-negative number');
  });

  test('throws error for invalid return', () => {
    expect(() => {
      calculateMonthlySIP(1000000, 101, 25);
    }).toThrow('Pre-retirement return must be between 0 and 100');
  });

  test('throws error for zero years', () => {
    expect(() => {
      calculateMonthlySIP(1000000, 12, 0);
    }).toThrow('Years to retirement must be greater than 0');
  });

  test('result rounds to 2 decimal places', () => {
    const result = calculateMonthlySIP(1000000, 12, 25);
    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);
  });
});

describe('calculateMonthlySIPOrdinary', () => {
  test('calculates ordinary annuity SIP', () => {
    const result = calculateMonthlySIPOrdinary(1000000, 12, 25);
    expect(result).toBeGreaterThan(0);
  });

  test('ordinary annuity SIP is greater than annuity due', () => {
    const due = calculateMonthlySIP(1000000, 12, 25);
    const ordinary = calculateMonthlySIPOrdinary(1000000, 12, 25);
    expect(ordinary).toBeGreaterThan(due);
  });
});