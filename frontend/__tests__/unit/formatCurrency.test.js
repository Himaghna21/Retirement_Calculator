import { formatCurrency, formatCurrencyDetailed, parseCurrency } from '@/utils/formatCurrency';

describe('formatCurrency', () => {
  describe('basic formatting', () => {
    test('formats small numbers with rupee symbol', () => {
      expect(formatCurrency(50000)).toMatch(/₹/);
    });

    test('formats numbers in crores', () => {
      expect(formatCurrency(50000000)).toContain('Cr');
    });

    test('formats numbers in lakhs', () => {
      expect(formatCurrency(1000000)).toContain('L');
    });

    test('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('₹0');
    });

    test('handles null values', () => {
      expect(formatCurrency(null)).toBe('₹0');
    });

    test('handles undefined values', () => {
      expect(formatCurrency(undefined)).toBe('₹0');
    });

    test('handles NaN values', () => {
      expect(formatCurrency(NaN)).toBe('₹0');
    });

    test('handles negative numbers', () => {
      const result = formatCurrency(-1000000);
      expect(result).toMatch(/₹/);
      expect(result).toContain('-');
    });
  });

  describe('decimal places', () => {
    test('formats with 2 decimal places by default', () => {
      expect(formatCurrency(1234567.89)).toMatch(/1\.23/);
    });

    test('formats with custom decimal places', () => {
      expect(formatCurrency(1234567, 1)).toMatch(/1\./);
    });
  });
});

describe('parseCurrency', () => {
  test('parses number input', () => {
    expect(parseCurrency(1000000)).toBe(1000000);
  });

  test('parses currency string with crore notation', () => {
    expect(parseCurrency('5Cr')).toBe(50000000);
  });

  test('parses currency string with lakh notation', () => {
    expect(parseCurrency('10L')).toBe(1000000);
  });

  test('returns 0 for invalid input', () => {
    expect(parseCurrency('invalid')).toBe(0);
  });
});