import { formatPercentage, parsePercentage, percentageToDecimal, decimalToPercentage } from '@/utils/formatPercentage';

describe('formatPercentage', () => {
  test('formats number as percentage', () => {
    expect(formatPercentage(6)).toBe('6.00%');
  });

  test('formats with custom decimal places', () => {
    expect(formatPercentage(6.5, 1)).toBe('6.5%');
  });

  test('handles zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  test('handles null', () => {
    expect(formatPercentage(null)).toBe('0%');
  });
});

describe('parsePercentage', () => {
  test('parses percentage string', () => {
    expect(parsePercentage('6%')).toBe(6);
  });

  test('parses number input', () => {
    expect(parsePercentage(6)).toBe(6);
  });
});

describe('conversion functions', () => {
  test('converts percentage to decimal', () => {
    expect(percentageToDecimal(6)).toBeCloseTo(0.06);
  });

  test('converts decimal to percentage', () => {
    expect(decimalToPercentage(0.06)).toBeCloseTo(6);
  });
});