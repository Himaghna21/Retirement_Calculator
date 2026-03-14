import { calculateRetirementCorpus, calculateRetirementDuration } from '@/lib/calculations/retirementCorpus.js';

describe('calculateRetirementCorpus', () => {
  test('calculates corpus for basic case', () => {
    // Annual expense: 1,000,000, Return: 7%, Duration: 20 years
    // PV = 1,000,000 × [(1 - (1.07)^-20) / 0.07]
    const result = calculateRetirementCorpus(1000000, 7, 20);
    expect(result).toBeCloseTo(10594014.41, 0);
  });

  test('handles zero return rate', () => {
    // With 0% return, corpus = expense × duration
    const result = calculateRetirementCorpus(1000000, 0, 20);
    expect(result).toBe(20000000);
  });

  test('handles high return rate', () => {
    const result = calculateRetirementCorpus(1000000, 15, 20);
    expect(result).toBeGreaterThan(0);
  });

  test('handles short retirement duration', () => {
    const result = calculateRetirementCorpus(1000000, 7, 5);
    expect(result).toBeLessThan(calculateRetirementCorpus(1000000, 7, 20));
  });

  test('throws error for negative expense', () => {
    expect(() => {
      calculateRetirementCorpus(-1000000, 7, 20);
    }).toThrow('Retirement annual expense must be a non-negative number');
  });

  test('throws error for invalid return', () => {
    expect(() => {
      calculateRetirementCorpus(1000000, 101, 20);
    }).toThrow('Post-retirement return must be between 0 and 100');
  });

  test('throws error for zero duration', () => {
    expect(() => {
      calculateRetirementCorpus(1000000, 7, 0);
    }).toThrow('Retirement duration must be greater than 0');
  });
});

describe('calculateRetirementDuration', () => {
  test('calculates duration for age 60', () => {
    const duration = calculateRetirementDuration(60);
    expect(duration).toBe(25); // 85 - 60
  });

  test('calculates duration for age 55', () => {
    const duration = calculateRetirementDuration(55);
    expect(duration).toBe(30); // 85 - 55
  });

  test('returns 1 for age at or beyond life expectancy', () => {
    const duration = calculateRetirementDuration(85);
    expect(duration).toBe(1);
  });

  test('returns 1 for age beyond life expectancy', () => {
    const duration = calculateRetirementDuration(90);
    expect(duration).toBe(1);
  });
});