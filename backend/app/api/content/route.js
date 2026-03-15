import { NextResponse } from 'next/server';

/**
 * GET /api/content
 * Fallback content endpoint for Drupal integration
 * Person 3 will modify this to fetch from actual Drupal
 */
export async function GET(request) {
  try {
    const disclaimer = `
      <p>This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.</p>
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