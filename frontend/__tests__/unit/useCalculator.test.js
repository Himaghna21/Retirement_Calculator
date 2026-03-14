import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '@/hooks/useCalculator';

describe('useCalculator hook', () => {
  test('initializes with empty form data', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.formData.currentAge).toBe('');
    expect(result.current.formData.retirementAge).toBe('');
  });

  test('updates field values', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.updateField('currentAge', '35');
    });

    expect(result.current.formData.currentAge).toBe('35');
  });

  test('resets form to initial state', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.updateField('currentAge', '35');
    });

    expect(result.current.formData.currentAge).toBe('35');

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData.currentAge).toBe('');
  });

  test('clears field error when user types', () => {
    const { result } = renderHook(() => useCalculator());

    // Simulate validation error
    act(() => {
      result.current.setFormErrors({ currentAge: 'Invalid age' });
    });

    expect(result.current.formErrors.currentAge).toBe('Invalid age');

    // Update field should clear error
    act(() => {
      result.current.updateField('currentAge', '35');
    });

    expect(result.current.formErrors.currentAge).toBeNull();
  });
});