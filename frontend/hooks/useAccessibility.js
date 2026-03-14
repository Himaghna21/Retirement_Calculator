import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for managing accessibility features
 */
export const useAccessibility = () => {
  const resultsPanelRef = useRef(null);
  const errorAlertRef = useRef(null);

  /**
   * Announce results update to screen readers
   */
  const announceResults = useCallback(() => {
    if (resultsPanelRef.current) {
      // Move focus to results panel so screen reader announces it
      resultsPanelRef.current.focus();

      // Also announce via aria-live region
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = 'Your retirement calculation results have been updated. Please review the values below.';
      }
    }
  }, []);

  /**
   * Announce error to screen readers
   */
  const announceError = useCallback((message) => {
    if (errorAlertRef.current) {
      errorAlertRef.current.focus();
      errorAlertRef.current.setAttribute('role', 'alert');
    }

    const liveRegion = document.getElementById('live-region-error');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, []);

  /**
   * Focus on first form field
   */
  const focusFirstField = useCallback(() => {
    const firstInput = document.querySelector('input[type="number"], input[type="text"]');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  /**
   * Skip to main content
   */
  useEffect(() => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView();
        }
      });
    }
  }, []);

  return {
    resultsPanelRef,
    errorAlertRef,
    announceResults,
    announceError,
    focusFirstField,
  };
};