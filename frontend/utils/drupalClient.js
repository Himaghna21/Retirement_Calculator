/**
 * Drupal CMS Client for Next.js
 * Fetches content from Drupal via JSON:API
 * Includes caching, error handling, and fallbacks
 */

const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_API_URL || 'http://localhost:8000';
const CACHE_DURATION = 3600; // 1 hour in seconds
const TIMEOUT = 5000; // 5 second timeout

// In-memory cache
const contentCache = new Map();

/**
 * Fetch content from Drupal JSON:API with timeout
 * @param {string} endpoint - API endpoint path (e.g., 'node/calculator_content')
 * @param {Object} params - Query parameters
 * @param {boolean} useCache - Use cached results if available
 * @returns {Promise<Object>} API response data
 */
export const fetchFromDrupal = async (endpoint, params = {}, useCache = true) => {
  try {
    // Check cache first
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    if (useCache && contentCache.has(cacheKey)) {
      const cached = contentCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
        console.log(`[Drupal Cache HIT] ${endpoint}`);
        return cached.data;
      }
    }

    // Build URL with parameters
    const queryString = new URLSearchParams(params).toString();
    const url = `${DRUPAL_BASE_URL}/jsonapi/${endpoint}${queryString ? '?' + queryString : ''}`;

    console.log(`[Drupal Fetch] ${url}`);

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      signal: controller.signal,
      next: { revalidate: CACHE_DURATION }, // Next.js ISR cache
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Drupal API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the result
    if (useCache) {
      contentCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      console.log(`[Drupal Cache SET] ${endpoint}`);
    }

    return data;
  } catch (error) {
    console.error(`[Drupal Error] ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Fetch disclaimer content from Drupal
 * @param {boolean} useCache - Use cached results
 * @returns {Promise<string>} Disclaimer HTML content
 */
export const fetchDisclaimer = async (useCache = true) => {
  try {
    const params = {
      'filter[title]': 'Disclaimer',
      'filter[status]': '1',
    };

    const data = await fetchFromDrupal('node/calculator_content', params, useCache);

    if (data.data && data.data.length > 0) {
      const node = data.data[0];
      const body = node.attributes?.body?.value;
      
      if (body) {
        console.log('[Drupal] Disclaimer loaded successfully');
        return body;
      }
    }

    console.warn('[Drupal] Disclaimer not found, using default');
    return getDefaultDisclaimer();
  } catch (error) {
    console.error('[Drupal] Error fetching disclaimer:', error);
    return getDefaultDisclaimer();
  }
};

/**
 * Fetch assumptions content from Drupal
 * @param {boolean} useCache - Use cached results
 * @returns {Promise<Object>} Assumptions data
 */
export const fetchAssumptions = async (useCache = true) => {
  try {
    const params = {
      'filter[title]': 'Assumptions',
      'filter[status]': '1',
    };

    const data = await fetchFromDrupal('node/calculator_content', params, useCache);

    if (data.data && data.data.length > 0) {
      console.log('[Drupal] Assumptions loaded successfully');
      
      // Parse assumptions from body content
      const node = data.data[0];
      const body = node.attributes?.body?.value;
      
      // Return structured assumptions
      return {
        retirementDuration: '85 - Retirement Age',
        lifeExpectancy: '85 years',
        inflation: 'As per user input',
        preRetirementReturn: 'As per user input',
        postRetirementReturn: 'As per user input',
        rawContent: body,
      };
    }

    console.warn('[Drupal] Assumptions not found, using default');
    return getDefaultAssumptions();
  } catch (error) {
    console.error('[Drupal] Error fetching assumptions:', error);
    return getDefaultAssumptions();
  }
};

/**
 * Health check for Drupal
 * @returns {Promise<boolean>} True if Drupal is accessible
 */
export const checkDrupalHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(`${DRUPAL_BASE_URL}/jsonapi`, {
      signal: controller.signal,
      next: { revalidate: 60 }, // Check every minute
    });

    clearTimeout(timeoutId);

    const isHealthy = response.ok;
    console.log(`[Drupal Health] ${isHealthy ? 'OK' : 'FAIL'}`);
    return isHealthy;
  } catch (error) {
    console.error('[Drupal Health] Error:', error);
    return false;
  }
};

/**
 * Clear cache for a specific endpoint
 * @param {string} endpoint - Endpoint to clear cache for
 */
export const clearCache = (endpoint = null) => {
  if (endpoint) {
    const keysToDelete = [];
    for (const key of contentCache.keys()) {
      if (key.startsWith(endpoint)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => contentCache.delete(key));
    console.log(`[Drupal Cache] Cleared ${keysToDelete.length} entries for ${endpoint}`);
  } else {
    contentCache.clear();
    console.log('[Drupal Cache] Cleared all entries');
  }
};

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export const getCacheStats = () => {
  return {
    size: contentCache.size,
    entries: Array.from(contentCache.keys()),
  };
};

/**
 * Default disclaimer text (fallback)
 */
export const getDefaultDisclaimer = () => {
  return `
    <h3>Disclaimer</h3>
    <p>This Retirement Planning Calculator is intended purely for <strong>illustrative purposes</strong> and should not be considered as investment advice or a recommendation to buy or sell any financial products.</p>
    
    <p><strong>Key Points:</strong></p>
    <ul>
      <li>The calculations and results are based on assumptions that may or may not materialize in the future.</li>
      <li>Actual results may vary significantly from the projections depending on market conditions, inflation rates, returns, and other economic factors.</li>
      <li>HDFC does not guarantee the accuracy of these results or endorse any specific investment strategy.</li>
      <li>Past performance is not indicative of future results.</li>
      <li>Please consult with a qualified financial advisor before making any financial decisions.</li>
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
 * Batch fetch multiple content items
 * @param {Array<string>} titles - Array of content titles to fetch
 * @returns {Promise<Object>} Map of title => content
 */
export const fetchMultipleContent = async (titles = []) => {
  const results = {};

  await Promise.allSettled(
    titles.map(async (title) => {
      try {
        const params = {
          'filter[title]': title,
          'filter[status]': '1',
        };
        
        const data = await fetchFromDrupal('node/calculator_content', params);
        
        if (data.data && data.data.length > 0) {
          results[title] = data.data[0].attributes;
        }
      } catch (error) {
        console.error(`[Drupal] Error fetching ${title}:`, error);
      }
    })
  );

  return results;
};

/**
 * Refetch all cached content
 * Useful when Drupal content has been updated
 */
export const refetchAllContent = async () => {
  clearCache();
  
  try {
    // Refetch disclaimer and assumptions
    await Promise.all([
      fetchDisclaimer(false), // Don't use cache for this fetch
      fetchAssumptions(false),
    ]);
    
    console.log('[Drupal] All content refetched successfully');
    return true;
  } catch (error) {
    console.error('[Drupal] Error refetching content:', error);
    return false;
  }
};

/**
 * Export Drupal client configuration
 */
export const drupalConfig = {
  baseUrl: DRUPAL_BASE_URL,
  cacheDuration: CACHE_DURATION,
  timeout: TIMEOUT,
};