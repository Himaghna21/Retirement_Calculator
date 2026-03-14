import { NextResponse } from 'next/server';

/**
 * GET /api/content
 * Fallback content endpoint for Drupal integration
 * Person 3 will modify this to fetch from actual Drupal
 */
export async function GET(request) {
  try {
    const disclaimer = `
      <h3>Disclaimer</h3>
      <p>This Retirement Planning Calculator is intended purely for illustrative purposes and should not be considered as investment advice or a recommendation.</p>
      <p><strong>Key Points:</strong></p>
      <ul>
        <li>Calculations are based on assumptions that may not materialize.</li>
        <li>Actual results may vary significantly from projections.</li>
        <li>HDFC does not guarantee accuracy or endorse any investment strategy.</li>
        <li>Please consult with a qualified financial advisor.</li>
      </ul>
    `;

    const assumptions = {
      retirement_duration: 20,
      inflation_assumption: 'As per user input',
      pre_retirement_return: 'As per user input',
      post_retirement_return: 'As per user input',
    };

    return NextResponse.json({
      success: true,
      data: {
        disclaimer,
        assumptions,
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}