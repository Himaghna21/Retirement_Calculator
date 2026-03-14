'use client';

import { useState, useEffect } from 'react';
import { CalculatorForm } from './CalculatorForm';
import { ResultsPanel } from './ResultsPanel';
import { AssumptionsPanel } from './AssumptionsPanel';
import { useCalculator } from '@/hooks/useCalculator';
import { fetchAssumptions } from '@/utils/drupalClient';
import calcStyles from '@/styles/calculator.module.css';

/**
 * Parent wrapper component for calculator
 * Fetches assumptions from Drupal CMS
 */
export const CalculatorWrapper = () => {
  const { results, loading } = useCalculator();
  const [showResults, setShowResults] = useState(false);
  const [assumptions, setAssumptions] = useState(null);
  const [assumptionsLoading, setAssumptionsLoading] = useState(true);

  // Fetch assumptions from Drupal
  useEffect(() => {
    const loadAssumptions = async () => {
      try {
        setAssumptionsLoading(true);
        const data = await fetchAssumptions();
        setAssumptions(data);
      } catch (error) {
        console.error('Error loading assumptions:', error);
        // Will use defaults from Drupal client
        setAssumptions(null);
      } finally {
        setAssumptionsLoading(false);
      }
    };

    loadAssumptions();
  }, []);

  useEffect(() => {
    if (results) {
      setShowResults(true);
    }
  }, [results]);

  const handleCalculationComplete = () => {
    setShowResults(true);
  };

  return (
    <div className={calcStyles.calculatorContainer}>
      <div className={calcStyles.calculatorHeader}>
        <h1>Retirement Planning Calculator</h1>
        <p>Calculate your retirement corpus and required monthly SIP</p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
          This tool provides illustrative calculations only. All figures are for illustration purposes.
        </p>
      </div>

      {/* Calculator Form */}
      <CalculatorForm onCalculationComplete={handleCalculationComplete} />

      {/* Results Section */}
      {results && (
        <>
          <ResultsPanel results={results} loading={loading} visible={showResults} />
          
          {/* Assumptions from Drupal CMS */}
          {!assumptionsLoading && assumptions && (
            <AssumptionsPanel assumptions={assumptions} />
          )}
        </>
      )}
    </div>
  );
};