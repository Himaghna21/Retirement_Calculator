/**
 * Drupal CMS Client for Next.js
 * Fetches content from Drupal via JSON:API
 */

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_API_URL || 'http://localhost:8000';

/**
 * Fetch content from Drupal JSON:API
 * @param {string} endpoint - API endpoint path (e.g., 'node/calculator_content')
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response data
 */
export const fetchFromDrupal = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${DRUPAL_BASE_URL}/jsonapi/${endpoint}${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Drupal API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from Drupal (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Fetch disclaimer content from Drupal
 * @returns {Promise<string>} Disclaimer HTML content
 */
export const fetchDisclaimer = async () => {
  try {
    const params = {
      'filter[title]': 'Disclaimer',
      'filter[status]': '1',
    };

    const data = await fetchFromDrupal('node/calculator_content', params);

    if (data.data && data.data.length > 0) {
      const node = data.data[0];
      const body = node.attributes?.body?.value;
      return (body && body.trim() !== '') ? body : getDefaultDisclaimer();
    }

    return getDefaultDisclaimer();
  } catch (error) {
    console.error('Error fetching disclaimer from Drupal:', error);
    return getDefaultDisclaimer();
  }
};

/**
 * Fetch assumptions content from Drupal
 * @returns {Promise<Object>} Assumptions data
 */
export const fetchAssumptions = async () => {
  try {
    const params = {
      'filter[title]': 'Assumptions',
      'filter[status]': '1',
    };

    const data = await fetchFromDrupal('node/calculator_content', params);

    if (data.data && data.data.length > 0) {
      const node = data.data[0];
      const assumptions = {
        retirementDuration: '85 - Retirement Age',
        lifeExpectancy: '85 years',
        inflation: 'As per user input',
        preRetirementReturn: 'As per user input',
        postRetirementReturn: 'As per user input',
      };
      return assumptions;
    }

    return getDefaultAssumptions();
  } catch (error) {
    console.error('Error fetching assumptions from Drupal:', error);
    return getDefaultAssumptions();
  }
};

/**
 * Default disclaimer text (fallback)
 */
export const getDefaultDisclaimer = () => {
  return `
    <h3>Disclaimer</h3>
    <p>This Retirement Planning Calculator is intended purely for illustrative purposes and should not be considered as investment advice or a recommendation.</p>
    <p><strong>Key Points:</strong></p>
    <ul>
      <li>The calculations are based on assumptions that may not materialize.</li>
      <li>Actual results may vary significantly from projections.</li>
      <li>HDFC does not guarantee accuracy or endorse any investment strategy.</li>
      <li>Please consult with a qualified financial advisor.</li>
    </ul>
  `;
};

/**
 * Default assumptions (fallback)
 */
export const getDefaultAssumptions = () => {
  return {
    retirementDuration: '85 - Retirement Age',
    lifeExpectancy: '85 years',
    inflation: 'As per user input',
    preRetirementReturn: 'As per user input',
    postRetirementReturn: 'As per user input',
  };
};

/**
 * Health check for Drupal
 * @returns {Promise<boolean>} True if Drupal is accessible
 */
export const checkDrupalHealth = async () => {
  try {
    const response = await fetch(`${DRUPAL_BASE_URL}/jsonapi`);
    return response.ok;
  } catch (error) {
    console.error('Drupal health check failed:', error);
    return false;
  }
};