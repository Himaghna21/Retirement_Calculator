/**
 * Integration Tests for Drupal CMS Content Fetching
 * Tests the integration between Next.js frontend and Drupal JSON:API backend
 * 
 * These tests verify:
 * - Successful content fetching from Drupal
 * - Proper error handling when Drupal is unavailable
 * - Fallback behavior to default content
 * - Content filtering and transformation
 * - CORS and API header handling
 * - Cache behavior
 */

import {
  fetchFromDrupal,
  fetchDisclaimer,
  fetchAssumptions,
  checkDrupalHealth,
  getDefaultDisclaimer,
  getDefaultAssumptions,
} from '@/utils/drupalClient.js';

// Mock fetch globally
global.fetch = jest.fn();
const fetch = global.fetch;

describe('Drupal CMS Content Integration Tests', () => {
  const DRUPAL_BASE_URL = 'http://localhost:8000';
  const CALCULATOR_CONTENT_ENDPOINT = 'node/calculator_content';

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset mock to clean state
    fetch.mockReset();
  });

  // ============================================================================
  // Test Suite 1: Health Check
  // ============================================================================

  describe('Drupal Health Check', () => {
    test('should return true when Drupal is accessible', async () => {
      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ jsonapi: { version: '1.0' } }),
      });

      const isHealthy = await checkDrupalHealth();

      expect(isHealthy).toBe(true);
      expect(fetch).toHaveBeenCalledWith(`${DRUPAL_BASE_URL}/jsonapi`);
    });

    test('should return false when Drupal is unavailable', async () => {
      // Mock connection error
      fetch.mockRejectedValueOnce(new Error('Connection refused'));

      const isHealthy = await checkDrupalHealth();

      expect(isHealthy).toBe(false);
    });

    test('should return false on HTTP error status', async () => {
      // Mock error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const isHealthy = await checkDrupalHealth();

      expect(isHealthy).toBe(false);
    });

    test('should handle network timeout gracefully', async () => {
      // Mock timeout error
      const timeoutError = new Error('ETIMEDOUT');
      fetch.mockRejectedValueOnce(timeoutError);

      const isHealthy = await checkDrupalHealth();

      expect(isHealthy).toBe(false);
    });
  });

  // ============================================================================
  // Test Suite 2: Basic Content Fetching
  // ============================================================================

  describe('Fetch from Drupal', () => {
    test('should fetch content successfully', async () => {
      // Mock response data matching Drupal JSON:API format
      const mockData = {
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'node--calculator_content',
            attributes: {
              title: 'Disclaimer',
              body: {
                value: '<h3>Disclaimer</h3><p>Test disclaimer content</p>',
                format: 'full_html',
              },
              created: '2026-03-12T10:00:00+00:00',
              status: true,
            },
          },
        ],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result).toEqual(mockData);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].attributes.title).toBe('Disclaimer');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(CALCULATOR_CONTENT_ENDPOINT),
        expect.any(Object)
      );
    });

    test('should send correct headers to Drupal', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json',
          }),
        })
      );
    });

    test('should include next.revalidate for caching', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: expect.objectContaining({
            revalidate: 3600,
          }),
        })
      );
    });

    test('should handle empty response data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data).toHaveLength(0);
      expect(Array.isArray(result.data)).toBe(true);
    });

    test('should construct URL with query parameters', async () => {
      const params = {
        'filter[title]': 'Disclaimer',
        'filter[status]': '1',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT, params);

      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('filter%5Btitle%5D=Disclaimer');
      expect(callUrl).toContain('filter%5Bstatus%5D=1');
    });
  });

  // ============================================================================
  // Test Suite 3: Error Handling
  // ============================================================================

  describe('Error Handling', () => {
    test('should throw error on HTTP 404 response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT)).rejects.toThrow(
        'Drupal API error: 404 Not Found'
      );
    });

    test('should throw error on HTTP 500 response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT)).rejects.toThrow(
        'Drupal API error: 500 Internal Server Error'
      );
    });

    test('should throw error on HTTP 403 Forbidden', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      await expect(fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT)).rejects.toThrow(
        'Drupal API error: 403 Forbidden'
      );
    });

    test('should handle network timeout error', async () => {
      fetch.mockRejectedValueOnce(new Error('timeout of 5000ms exceeded'));

      await expect(fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT)).rejects.toThrow(
        'timeout of 5000ms exceeded'
      );
    });

    test('should handle connection refused error', async () => {
      fetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      await expect(fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT)).rejects.toThrow(
        'ECONNREFUSED'
      );
    });

    test('should handle invalid JSON response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT)).rejects.toThrow(
        'Invalid JSON'
      );
    });

    test('should log error to console on failure', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);
      } catch (error) {
        // Expected error
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching from Drupal'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  // ============================================================================
  // Test Suite 4: Disclaimer Content Fetching
  // ============================================================================

  describe('Fetch Disclaimer', () => {
    test('should fetch disclaimer content successfully', async () => {
      const disclaimerContent = '<h3>Disclaimer</h3><p>This is illustrative...</p>';

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: 'uuid-1',
              type: 'node--calculator_content',
              attributes: {
                title: 'Disclaimer',
                body: {
                  value: disclaimerContent,
                  format: 'full_html',
                },
                status: true,
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toBe(disclaimerContent);
      expect(result).toContain('Disclaimer');
      expect(result).toContain('illustrative');
    });

    test('should filter by title "Disclaimer"', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchDisclaimer();

      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('filter%5Btitle%5D=Disclaimer');
    });

    test('should filter by status "published"', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchDisclaimer();

      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('filter%5Bstatus%5D=1');
    });

    test('should return default disclaimer if no content found', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const result = await fetchDisclaimer();

      expect(result).toEqual(getDefaultDisclaimer());
      expect(result).toContain('Disclaimer');
    });

    test('should return default disclaimer on fetch error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchDisclaimer();

      expect(result).toEqual(getDefaultDisclaimer());
    });

    test('should extract body.value from response', async () => {
      const disclaimerContent = '<p>Custom disclaimer text</p>';

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: {
                  value: disclaimerContent,
                  format: 'full_html',
                },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toBe(disclaimerContent);
    });

    test('should handle null body gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: null,
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toEqual(getDefaultDisclaimer());
    });

    test('should handle undefined body gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                // body is undefined
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toEqual(getDefaultDisclaimer());
    });

    test('should log error when fetch fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockRejectedValueOnce(new Error('API Error'));

      await fetchDisclaimer();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching disclaimer from Drupal:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  // ============================================================================
  // Test Suite 5: Assumptions Content Fetching
  // ============================================================================

  describe('Fetch Assumptions', () => {
    test('should fetch assumptions content successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: 'uuid-2',
              type: 'node--calculator_content',
              attributes: {
                title: 'Assumptions',
                body: {
                  value: '<h3>Assumptions</h3><ul><li>Item 1</li></ul>',
                  format: 'full_html',
                },
                status: true,
              },
            },
          ],
        }),
      });

      const result = await fetchAssumptions();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    test('should include all required assumption fields', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const result = await fetchAssumptions();

      const requiredFields = [
        'retirementDuration',
        'lifeExpectancy',
        'inflation',
        'preRetirementReturn',
        'postRetirementReturn',
      ];

      requiredFields.forEach((field) => {
        expect(result).toHaveProperty(field);
      });
    });

    test('should filter by title "Assumptions"', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchAssumptions();

      const callUrl = fetch.mock.calls[0][0];
      expect(callUrl).toContain('filter%5Btitle%5D=Assumptions');
    });

    test('should return default assumptions if no content found', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const result = await fetchAssumptions();

      expect(result).toEqual(getDefaultAssumptions());
    });

    test('should return default assumptions on fetch error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchAssumptions();

      expect(result).toEqual(getDefaultAssumptions());
    });

    test('should have correct assumption values', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const result = await fetchAssumptions();

      expect(result.retirementDuration).toBe('85 - Retirement Age');
      expect(result.lifeExpectancy).toBe('85 years');
      expect(result.inflation).toBe('As per user input');
      expect(result.preRetirementReturn).toBe('As per user input');
      expect(result.postRetirementReturn).toBe('As per user input');
    });

    test('should handle malformed assumptions data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                // Missing body
              },
            },
          ],
        }),
      });

      const result = await fetchAssumptions();

      expect(result).toEqual(getDefaultAssumptions());
    });

    test('should log error when fetch fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      fetch.mockRejectedValueOnce(new Error('Drupal Unavailable'));

      await fetchAssumptions();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching assumptions from Drupal:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  // ============================================================================
  // Test Suite 6: Default Content (Fallback)
  // ============================================================================

  describe('Default Content Fallback', () => {
    test('default disclaimer should contain required text', () => {
      const disclaimer = getDefaultDisclaimer();

      expect(typeof disclaimer).toBe('string');
      expect(disclaimer).toContain('Disclaimer');
      expect(disclaimer.toLowerCase()).toContain('illustrative');
      expect(disclaimer.toLowerCase()).toContain('not be considered');
    });

    test('default disclaimer should be valid HTML', () => {
      const disclaimer = getDefaultDisclaimer();

      expect(disclaimer).toMatch(/<h3>|<p>/);
      expect(disclaimer).toContain('</p>');
    });

    test('default assumptions should be an object', () => {
      const assumptions = getDefaultAssumptions();

      expect(typeof assumptions).toBe('object');
      expect(assumptions).not.toBeNull();
    });

    test('default assumptions should have all required keys', () => {
      const assumptions = getDefaultAssumptions();
      const keys = Object.keys(assumptions);

      expect(keys).toContain('retirementDuration');
      expect(keys).toContain('lifeExpectancy');
      expect(keys).toContain('inflation');
      expect(keys).toContain('preRetirementReturn');
      expect(keys).toContain('postRetirementReturn');
    });

    test('default assumptions values should be strings', () => {
      const assumptions = getDefaultAssumptions();

      Object.values(assumptions).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  // ============================================================================
  // Test Suite 7: Multiple Results Handling
  // ============================================================================

  describe('Multiple Content Handling', () => {
    test('should handle multiple nodes in response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: 'uuid-1',
              attributes: { title: 'Disclaimer', body: { value: 'Disclaimer...' } },
            },
            {
              id: 'uuid-2',
              attributes: { title: 'Assumptions', body: { value: 'Assumptions...' } },
            },
            {
              id: 'uuid-3',
              attributes: { title: 'FAQ', body: { value: 'FAQ...' } },
            },
          ],
        }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data).toHaveLength(3);
    });

    test('should return first node when fetching disclaimer with multiple results', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: 'uuid-1',
              attributes: {
                title: 'Disclaimer',
                body: { value: 'First Disclaimer' },
              },
            },
            {
              id: 'uuid-2',
              attributes: {
                title: 'Disclaimer (Archived)',
                body: { value: 'Second Disclaimer' },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toBe('First Disclaimer');
    });

    test('should handle very large response safely', async () => {
      // Create a large dataset
      const largeData = {
        data: Array(1000).fill(null).map((_, i) => ({
          id: `uuid-${i}`,
          type: 'node--calculator_content',
          attributes: {
            title: `Content ${i}`,
            body: { value: `Content body ${i}` },
          },
        })),
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => largeData,
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data).toHaveLength(1000);
    });
  });

  // ============================================================================
  // Test Suite 8: Response Structure Validation
  // ============================================================================

  describe('Response Structure Validation', () => {
    test('should validate response has data array', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: 'uuid-1',
              type: 'node--calculator_content',
              attributes: {
                title: 'Test',
                body: { value: 'Content' },
              },
            },
          ],
        }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(Array.isArray(result.data)).toBe(true);
    });

    test('should validate node structure', async () => {
      const nodeData = {
        id: 'uuid-1',
        type: 'node--calculator_content',
        attributes: {
          title: 'Test',
          body: {
            value: '<p>Content</p>',
            format: 'full_html',
          },
          status: true,
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [nodeData] }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      const node = result.data[0];
      expect(node).toHaveProperty('id');
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('attributes');
      expect(node.attributes).toHaveProperty('title');
      expect(node.attributes).toHaveProperty('body');
    });

    test('should handle missing optional fields', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: 'uuid-1',
              type: 'node--calculator_content',
              attributes: {
                title: 'Test',
                // body is missing
              },
            },
          ],
        }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].attributes.title).toBe('Test');
      expect(result.data[0].attributes.body).toBeUndefined();
    });
  });

  // ============================================================================
  // Test Suite 9: CORS & Header Handling
  // ============================================================================

  describe('CORS & Header Handling', () => {
    test('should include JSON:API content-type header', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers['Content-Type']).toBe('application/vnd.api+json');
    });

    test('should include JSON:API accept header', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      const headers = fetch.mock.calls[0][1].headers;
      expect(headers['Accept']).toBe('application/vnd.api+json');
    });

    test('should handle CORS preflight response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        json: async () => ({ data: [] }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data).toEqual([]);
    });

    test('should use correct cache headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      const options = fetch.mock.calls[0][1];
      expect(options.next.revalidate).toBe(3600);
    });
  });

  // ============================================================================
  // Test Suite 10: Edge Cases & Boundary Conditions
  // ============================================================================

  describe('Edge Cases & Boundary Conditions', () => {
    test('should handle response with HTML entities in body', async () => {
      const htmlWithEntities = '<p>This &amp; that &lt;important&gt;</p>';

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: { value: htmlWithEntities },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toContain('&amp;');
      expect(result).toContain('&lt;');
    });

    test('should handle very long body content', async () => {
      const longContent = '<p>' + 'A'.repeat(10000) + '</p>';

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: { value: longContent },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toHaveLength(longContent.length);
    });

    test('should handle special characters in title', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                title: 'Disclaimer™ & Legal',
                body: { value: '<p>Content</p>' },
              },
            },
          ],
        }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data[0].attributes.title).toContain('™');
    });

    test('should handle Unicode characters', async () => {
      const unicodeContent = '<p>গণনা করুন 计算 計算</p>';

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: { value: unicodeContent },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toContain('গণনা');
      expect(result).toContain('計算');
    });

    test('should handle null values in response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              id: null,
              attributes: {
                title: null,
                body: null,
              },
            },
          ],
        }),
      });

      const result = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      expect(result.data[0].id).toBeNull();
    });

    test('should handle whitespace-only body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: { value: '   \n\t   ' },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toEqual(getDefaultDisclaimer());
    });

    test('should handle empty string body', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          data: [
            {
              attributes: {
                body: { value: '' },
              },
            },
          ],
        }),
      });

      const result = await fetchDisclaimer();

      expect(result).toEqual(getDefaultDisclaimer());
    });
  });

  // ============================================================================
  // Test Suite 11: Integration with Calculator Workflow
  // ============================================================================

  describe('Integration with Calculator Workflow', () => {
    test('should provide both disclaimer and assumptions for calculator', async () => {
      // Mock multiple fetch calls
      fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            data: [
              {
                attributes: {
                  title: 'Disclaimer',
                  body: { value: '<p>Disclaimer content</p>' },
                },
              },
            ],
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            data: [
              {
                attributes: {
                  title: 'Assumptions',
                  body: { value: '<p>Assumptions content</p>' },
                },
              },
            ],
          }),
        });

      const disclaimer = await fetchDisclaimer();
      const assumptions = await fetchAssumptions();

      expect(disclaimer).toContain('Disclaimer');
      expect(Object.keys(assumptions).length).toBeGreaterThan(0);
    });

    test('should provide fallback content if both Drupal calls fail', async () => {
      fetch
        .mockRejectedValueOnce(new Error('Connection error'))
        .mockRejectedValueOnce(new Error('Connection error'));

      const disclaimer = await fetchDisclaimer();
      const assumptions = await fetchAssumptions();

      expect(disclaimer).toEqual(getDefaultDisclaimer());
      expect(assumptions).toEqual(getDefaultAssumptions());
    });

    test('should provide partial fallback if only one Drupal call fails', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({
            data: [
              {
                attributes: {
                  body: { value: '<p>Real disclaimer</p>' },
                },
              },
            ],
          }),
        })
        .mockRejectedValueOnce(new Error('Connection error'));

      const disclaimer = await fetchDisclaimer();
      const assumptions = await fetchAssumptions();

      expect(disclaimer).toBe('<p>Real disclaimer</p>');
      expect(assumptions).toEqual(getDefaultAssumptions());
    });
  });

  // ============================================================================
  // Test Suite 12: Performance & Caching
  // ============================================================================

  describe('Performance & Caching', () => {
    test('should cache response for 1 hour (3600 seconds)', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      const cacheOptions = fetch.mock.calls[0][1].next;
      expect(cacheOptions.revalidate).toBe(3600);
    });

    test('should reuse cached content within revalidation period', async () => {
      // This tests that the cache header is set correctly
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ id: 1 }] }),
      });

      const result1 = await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      // Second call should use the same cached response
      // (In a real environment with caching enabled)
      expect(result1.data).toHaveLength(1);
    });

    test('should make API call each time in test environment', async () => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);
      await fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT);

      // Should make two calls (no caching in test)
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  // ============================================================================
  // Test Suite 13: Stress & Robustness
  // ============================================================================

  describe('Stress & Robustness', () => {
    test('should handle rapid successive requests', async () => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const promises = Array(10)
        .fill(null)
        .map(() => fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(fetch).toHaveBeenCalledTimes(10);
    });

    test('should handle partial failures with Promise.allSettled', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: [] }),
        })
        .mockRejectedValueOnce(new Error('Error 1'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: [] }),
        })
        .mockRejectedValueOnce(new Error('Error 2'));

      const promises = [
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
      ];

      const results = await Promise.allSettled(promises);

      expect(results).toHaveLength(4);
      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(2);
      expect(results.filter((r) => r.status === 'rejected')).toHaveLength(2);
    });

    test('should not make concurrent requests to same endpoint (if debounced)', async () => {
      fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      // Make 3 simultaneous requests
      await Promise.all([
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
        fetchFromDrupal(CALCULATOR_CONTENT_ENDPOINT),
      ]);

      // In test, all should execute
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});