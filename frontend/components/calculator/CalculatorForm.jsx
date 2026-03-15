'use client';

import { useState, useEffect } from 'react';
import { InputField } from './InputField';
import { Button } from '../ui/Button';
import { useCalculator } from '@/hooks/useCalculator';
import styles from '@/styles/form.module.css';
import calcStyles from '@/styles/calculator.module.css';

/**
 * Main calculator form component
 */
export const CalculatorForm = ({ calculatorControls, onCalculationComplete }) => {
  const {
    formData,
    updateField,
    resetForm,
    submitCalculation,
    loading,
    error,
    formErrors,
  } = calculatorControls;

  const handleSubmit = async (e) => {
    console.log('--- HANDLE SUBMIT INITIATED ---');
    console.log('calculatorControls exists?', !!calculatorControls);
    if (e) e.preventDefault();
    try {
      console.log('Calling submitCalculation...');
      await submitCalculation();
      console.log('submitCalculation completed');
      if (onCalculationComplete) {
        console.log('Calling onCalculationComplete...');
        onCalculationComplete();
      }
    } catch (err) {
      console.error('ERROR in handleSubmit:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className={calcStyles.formSection}>
      {/* Header removed for single-title layout */}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            backgroundColor: 'rgba(218, 56, 50, 0.1)',
            borderLeft: '4px solid #da3832',
            padding: '12px 16px',
            borderRadius: '4px',
            color: '#da3832',
            marginBottom: '16px',
            fontSize: '14px',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className={calcStyles.formFields}>
        <InputField
          id="currentAge"
          name="currentAge"
          label="Current Age"
          type="number"
          placeholder="e.g., 35"
          value={formData.currentAge}
          onChange={(e) => updateField('currentAge', e.target.value)}
          error={formErrors.currentAge}
          helperText="Must be between 18 and 59 years"
          unit="years"
          required
          min="18"
          max="59"
          step="1"
        />

        <InputField
          id="retirementAge"
          name="retirementAge"
          label="Retirement Age"
          type="number"
          placeholder="e.g., 60"
          value={formData.retirementAge}
          onChange={(e) => updateField('retirementAge', e.target.value)}
          error={formErrors.retirementAge}
          helperText="Must be greater than current age and at most 60"
          unit="years"
          required
          min="18"
          max="60"
          step="1"
        />

        <InputField
          id="currentAnnualExpenses"
          name="currentAnnualExpenses"
          label="Current Annual Expenses"
          type="number"
          placeholder="e.g., 1000000"
          value={formData.currentAnnualExpenses}
          onChange={(e) => updateField('currentAnnualExpenses', e.target.value)}
          error={formErrors.currentAnnualExpenses}
          helperText="Annual expenses in rupees"
          unit="₹"
          required
          min="0"
          step="100000"
          tooltip="Your annual spending in the current year"
        />

        <InputField
          id="inflationRate"
          name="inflationRate"
          label="Expected Inflation Rate"
          type="number"
          placeholder="e.g., 6"
          value={formData.inflationRate}
          onChange={(e) => updateField('inflationRate', e.target.value)}
          error={formErrors.inflationRate}
          helperText="Annual inflation rate (0-50%)"
          unit="%"
          required
          min="0"
          max="50"
          step="0.1"
          tooltip="Expected average annual inflation rate"
        />

        <InputField
          id="postRetirementReturn"
          name="postRetirementReturn"
          label="Post-Retirement Return"
          type="number"
          placeholder="e.g., 7"
          value={formData.postRetirementReturn}
          onChange={(e) => updateField('postRetirementReturn', e.target.value)}
          error={formErrors.postRetirementReturn}
          helperText="Expected annual return after retirement (0-50%)"
          unit="%"
          required
          min="0"
          max="50"
          step="0.1"
          tooltip="Expected annual investment return during retirement phase"
        />

        <InputField
          id="preRetirementReturn"
          name="preRetirementReturn"
          label="Pre-Retirement Return"
          type="number"
          placeholder="e.g., 12"
          value={formData.preRetirementReturn}
          onChange={(e) => updateField('preRetirementReturn', e.target.value)}
          error={formErrors.preRetirementReturn}
          helperText="Expected annual return before retirement (0-50%)"
          unit="%"
          required
          min="0"
          max="50"
          step="0.1"
          tooltip="Expected annual investment return during accumulation phase"
        />
      </div>

      <div className={calcStyles.formActions}>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          variant="primary"
          aria-busy={loading}
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>
        <Button
          type="button"
          onClick={resetForm}
          disabled={loading}
          variant="secondary"
        >
          Reset
        </Button>
      </div>

      {/* Live region for screen readers */}
      <div id="live-region" aria-live="polite" aria-atomic="true" className="sr-only" />
      <div id="live-region-error" aria-live="assertive" aria-atomic="true" className="sr-only" />
    </div>
  );
};