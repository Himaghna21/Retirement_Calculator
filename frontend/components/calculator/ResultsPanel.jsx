'use client';

import { useEffect, useRef } from 'react';
import { NumberDisplay } from '../ui/NumberDisplay';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import resultsStyles from '@/styles/results.module.css';

/**
 * Results display panel component
 */
export const ResultsPanel = ({ results, loading, visible }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (visible && results && panelRef.current) {
      // Announce to screen readers
      panelRef.current.focus();
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = `Calculation complete. Your retirement corpus is ${results.requiredCorpus}. Required monthly SIP is ${results.requiredMonthlySIP}.`;
      }
    }
  }, [visible, results]);

  if (loading) {
    return <LoadingSpinner message="Calculating your retirement plan..." />;
  }

  if (!visible || !results) {
    return null;
  }

  return (
    <section
      ref={panelRef}
      className={`${resultsStyles.resultsPanel} ${visible ? resultsStyles.visible : ''}`}
      aria-labelledby="results-heading"
      tabIndex="-1"
    >
      <div className={resultsStyles.resultsHeader}>
        <h2 id="results-heading">Your Retirement Plan Summary</h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
          Based on your inputs - for illustration purposes only
        </p>
      </div>

      <div className={resultsStyles.resultGrid}>
        <div className={resultsStyles.resultItem}>
          <NumberDisplay
            label="Retirement Annual Expense"
            value={results.retirementAnnualExpense}
            type="currency"
            subtitle="Adjusted for inflation"
          />
        </div>

        <div className={resultsStyles.resultItem}>
          <NumberDisplay
            label="Required Corpus at Retirement"
            value={results.requiredCorpus}
            type="currency"
            subtitle="Lump sum needed"
          />
        </div>

        <div className={resultsStyles.resultItem}>
          <NumberDisplay
            label="Required Monthly SIP"
            value={results.requiredMonthlySIP}
            type="currency"
            subtitle="Monthly investment amount"
          />
        </div>
      </div>

      <div className={resultsStyles.disclaimerSection}>
        <p>
          <strong>Important:</strong> These calculations are illustrative and based on the assumptions you provided. 
          Actual results may vary significantly based on market conditions, inflation changes, and actual returns. 
          Please consult with a financial advisor before making investment decisions.
        </p>
      </div>
    </section>
  );
};