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
  const calculatorControls = useCalculator();
  const { results, loading } = calculatorControls;
  
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
        <h1 className="sr-only">Retirement Planning</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#224c87' }}>
          Retirement Planning Calculator
        </h2>
        <p style={{ fontSize: '16px', color: '#000000', margin: '0 0 16px 0' }}>
          Calculate your retirement corpus and required monthly SIP
        </p>
        <div style={{ 
          height: '2px', 
          background: '#919090', 
          width: '60px', 
          margin: '0 auto 24px auto',
          opacity: '0.3'
        }} />
      </div>

      {/* Calculator Form */}
      <CalculatorForm 
        calculatorControls={calculatorControls}
        onCalculationComplete={handleCalculationComplete} 
      />

      {/* Results Section */}
      {results && (
        <>
          <ResultsPanel results={results} loading={loading} visible={showResults} />
        </>
      )}
    </div>
  );
};