import { POST } from '@/app/api/calculate/route.js';

describe('POST /api/calculate', () => {
  const validRequest = {
    currentAge: 35,
    retirementAge: 60,
    currentAnnualExpenses: 1000000,
    inflationRate: 6,
    postRetirementReturn: 7,
    preRetirementReturn: 12,
  };

  test('returns valid calculation result', async () => {
    const request = new Request('http://localhost/api/calculate', {
      method: 'POST',
      body: JSON.stringify(validRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.retirementAnnualExpense).toBeGreaterThan(0);
    expect(data.data.requiredCorpus).toBeGreaterThan(0);
    expect(data.data.requiredMonthlySIP).toBeGreaterThan(0);
  });

  test('rejects invalid input', async () => {
    const invalidRequest = {
      ...validRequest,
      currentAge: 'invalid',
    };

    const request = new Request('http://localhost/api/calculate', {
      method: 'POST',
      body: JSON.stringify(invalidRequest),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
  });

  test('rejects retirement age less than current age', async () => {
    const request = new Request('http://localhost/api/calculate', {
      method: 'POST',
      body: JSON.stringify({
        ...validRequest,
        retirementAge: 30,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  test('includes assumptions in response', async () => {
    const request = new Request('http://localhost/api/calculate', {
      method: 'POST',
      body: JSON.stringify(validRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.data.assumptions).toBeDefined();
    expect(data.data.assumptions.retirementDuration).toBeDefined();
  });

  test('includes disclaimer in response', async () => {
    const request = new Request('http://localhost/api/calculate', {
      method: 'POST',
      body: JSON.stringify(validRequest),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.data.disclaimer).toBeDefined();
    expect(data.data.disclaimer).toContain('illustrative');
  });
});