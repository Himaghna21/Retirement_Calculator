import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Hook for managing calculator form state and API calls
 */
export const useCalculator = () => {
  const [formData, setFormData] = useState({
    currentAge: '',
    retirementAge: '',
    currentAnnualExpenses: '',
    inflationRate: '',
    postRetirementReturn: '',
    preRetirementReturn: '',
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  /**
   * Update form field
   */
  const updateField = useCallback((fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[fieldName]) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  }, [formErrors]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData({
      currentAge: '',
      retirementAge: '',
      currentAnnualExpenses: '',
      inflationRate: '',
      postRetirementReturn: '',
      preRetirementReturn: '',
    });
    setResults(null);
    setError(null);
    setFormErrors({});
  }, []);

  /**
   * Submit form and call calculator API
   */
  const submitCalculation = useCallback(async () => {
    setError(null);
    setFormErrors({});

    try {
      // Client-side validation first
      const validationErrors = validateFormData(formData);
      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      setLoading(true);

      // Convert form data to API format
      const apiPayload = {
        currentAge: parseInt(formData.currentAge, 10),
        retirementAge: parseInt(formData.retirementAge, 10),
        currentAnnualExpenses: parseFloat(formData.currentAnnualExpenses),
        inflationRate: parseFloat(formData.inflationRate),
        postRetirementReturn: parseFloat(formData.postRetirementReturn),
        preRetirementReturn: parseFloat(formData.preRetirementReturn),
      };

      const response = await axios.post(`${API_BASE_URL}/api/calculate`, apiPayload);

      if (response.data) {
        setResults(response.data);
      }
    } catch (err) {
      console.error('Calculation error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred during calculation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return {
    formData,
    updateField,
    resetForm,
    submitCalculation,
    results,
    loading,
    error,
    formErrors,
    setFormErrors,
  };
};

/**
 * Validate form data on client side
 */
const validateFormData = (formData) => {
  const errors = {};

  // Current Age validation
  if (!formData.currentAge) {
    errors.currentAge = 'Current age is required';
  } else {
    const age = parseInt(formData.currentAge, 10);
    if (isNaN(age) || age < 18 || age > 59) {
      errors.currentAge = 'Age must be between 18 and 59';
    }
  }

  // Retirement Age validation
  if (!formData.retirementAge) {
    errors.retirementAge = 'Retirement age is required';
  } else {
    const retirementAge = parseInt(formData.retirementAge, 10);
    const currentAge = parseInt(formData.currentAge, 10);
    if (isNaN(retirementAge) || retirementAge <= currentAge || retirementAge > 60) {
      errors.retirementAge = 'Retirement age must be greater than current age and at most 60';
    }
  }

  // Current Annual Expenses validation
  if (!formData.currentAnnualExpenses) {
    errors.currentAnnualExpenses = 'Current annual expenses is required';
  } else {
    const expenses = parseFloat(formData.currentAnnualExpenses);
    if (isNaN(expenses) || expenses <= 0) {
      errors.currentAnnualExpenses = 'Expenses must be greater than 0';
    }
  }

  // Inflation Rate validation
  if (formData.inflationRate === '') {
    errors.inflationRate = 'Inflation rate is required';
  } else {
    const rate = parseFloat(formData.inflationRate);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      errors.inflationRate = 'Rate must be between 0 and 50%';
    }
  }

  // Post-Retirement Return validation
  if (formData.postRetirementReturn === '') {
    errors.postRetirementReturn = 'Post-retirement return is required';
  } else {
    const rate = parseFloat(formData.postRetirementReturn);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      errors.postRetirementReturn = 'Rate must be between 0 and 50%';
    }
  }

  // Pre-Retirement Return validation
  if (formData.preRetirementReturn === '') {
    errors.preRetirementReturn = 'Pre-retirement return is required';
  } else {
    const rate = parseFloat(formData.preRetirementReturn);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      errors.preRetirementReturn = 'Rate must be between 0 and 50%';
    }
  }

  return errors;
};