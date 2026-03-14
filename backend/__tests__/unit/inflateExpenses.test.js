import { inflateExpenses, calculateYearsToRetirement } from '@/lib/calculations/inflateExpenses.js';

describe('inflateExpenses', () => {
    test('calculates inflation for basic case', () => {
        // Current expense: 1,000,000, Inflation: 6%, Years: 25
        // Expected: 1,000,000 * (1.06)^25 ≈ 4291870.72
        const result = inflateExpenses(1000000, 6, 25);
        expect(result).toBeCloseTo(4291870.72, 0);
    });

    test('handles zero years correctly', () => {
        const result = inflateExpenses(1000000, 6, 0);
        expect(result).toBe(1000000);
    });

    test('handles zero inflation correctly', () => {
        const result = inflateExpenses(1000000, 0, 25);
        expect(result).toBe(1000000);
    });

    test('handles high inflation', () => {
        const result = inflateExpenses(500000, 10, 10);
        expect(result).toBeCloseTo(1296871.23, 0);
    });

    test('throws error for negative expense', () => {
        expect(() => {
            inflateExpenses(-1000000, 6, 25);
        }).toThrow('Current expenses must be a non-negative number');
    });

    test('throws error for invalid inflation rate', () => {
        expect(() => {
            inflateExpenses(1000000, 101, 25);
        }).toThrow('Inflation rate must be between 0 and 100');
    });

    test('throws error for negative years', () => {
        expect(() => {
            inflateExpenses(1000000, 6, -5);
        }).toThrow('Years to retirement must be a non-negative number');
    });

    test('precision: handles two decimal places', () => {
        const result = inflateExpenses(1234567.89, 5.5, 10);
        // Check that result has max 2 decimal places
        const decimalPlaces = (result.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
});

describe('calculateYearsToRetirement', () => {
    test('calculates correct years', () => {
        const years = calculateYearsToRetirement(35, 60);
        expect(years).toBe(25);
    });

    test('throws error when retirement age equals current age', () => {
        expect(() => {
            calculateYearsToRetirement(60, 60);
        }).toThrow('Retirement age must be greater than current age');
    });

    test('throws error when retirement age is less than current age', () => {
        expect(() => {
            calculateYearsToRetirement(60, 50);
        }).toThrow('Retirement age must be greater than current age');
    });
});