import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  inflateExpenses,
  calculateYearsToRetirement,
  calculateRetirementCorpus,
  calculateRetirementDuration,
  calculateMonthlySIP,
} from '@/lib/calculations/index.js';
import { validateAndSanitize, formatValidationErrors } from '@/lib/validation/inputValidator.js';
import { createSession, storeCalculationResult } from '@/lib/database/queries.js';
import { formatCalculationResult, formatErrorResponse } from '@/lib/helpers/responseFormatter.js';
import { isReasonableResult } from '@/lib/helpers/edgeCaseHandler.js';

/**
 * POST /api/calculate
 * Main calculator endpoint
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate and sanitize inputs
    const validation = validateAndSanitize(body);

    if (!validation.success) {
      return NextResponse.json(
        formatErrorResponse(
          'Validation failed',
          validation.errors,
          400
        ),
        { status: 400 }
      );
    }

    const input = validation.data;

    // Step 1: Calculate years to retirement
    const yearsToRetirement = calculateYearsToRetirement(
      input.currentAge,
      input.retirementAge
    );

    // Step 2: Inflate annual expenses
    const retirementAnnualExpense = inflateExpenses(
      input.currentAnnualExpenses,
      input.inflationRate,
      yearsToRetirement
    );

    // Step 3: Calculate retirement corpus
    const requiredCorpus = calculateRetirementCorpus(
      retirementAnnualExpense,
      input.postRetirementReturn,
      input.retirementDuration
    );

    // Step 4: Calculate monthly SIP
    const requiredMonthlySIP = calculateMonthlySIP(
      requiredCorpus,
      input.preRetirementReturn,
      yearsToRetirement
    );

    // Validate results are reasonable
    if (!isReasonableResult(requiredCorpus, requiredMonthlySIP)) {
      return NextResponse.json(
        formatErrorResponse(
          'Calculation resulted in unreasonable values. Please check your inputs.',
          null,
          400
        ),
        { status: 400 }
      );
    }

    // Prepare response
    const calculations = {
      yearsToRetirement,
      retirementAnnualExpense,
      requiredCorpus,
      requiredMonthlySIP,
    };

    // Get retirement duration assumption
    const retirementDuration = calculateRetirementDuration(input.retirementAge);

    const assumptions = {
      retirementDuration,
    };

    // Format and return response
    const responseData = formatCalculationResult(input, calculations, assumptions);

    // Store in database asynchronously (don't block response)
    storeCalculationAsync(input, calculations, assumptions).catch((error) => {
      console.error('Error storing calculation:', error);
    });

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error in calculator API:', error);
    return NextResponse.json(
      formatErrorResponse(
        'An error occurred during calculation',
        error.message,
        500
      ),
      { status: 500 }
    );
  }
}

/**
 * Store calculation result in database asynchronously
 */
async function storeCalculationAsync(input, calculations, assumptions) {
  try {
    const sessionId = uuidv4();
    await createSession(sessionId);
    await storeCalculationResult(sessionId, input, {
      ...calculations,
      retirementDuration: assumptions.retirementDuration,
    });
  } catch (error) {
    console.error('Database storage error:', error);
    // Don't throw - this is non-critical background operation
  }
}

/**
 * OPTIONS request for CORS preflight
 */
export async function OPTIONS(request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}