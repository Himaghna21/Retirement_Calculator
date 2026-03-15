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

export async function POST(request) {
  try {
    const body = await request.json();
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
    const yearsToRetirement = calculateYearsToRetirement(
      input.currentAge,
      input.retirementAge
    );

    const retirementAnnualExpense = inflateExpenses(
      input.currentAnnualExpenses,
      input.inflationRate,
      yearsToRetirement
    );

    const requiredCorpus = calculateRetirementCorpus(
      retirementAnnualExpense,
      input.postRetirementReturn,
      input.retirementDuration
    );

    const requiredMonthlySIP = calculateMonthlySIP(
      requiredCorpus,
      input.preRetirementReturn,
      yearsToRetirement
    );

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

    const calculations = {
      yearsToRetirement,
      retirementAnnualExpense,
      requiredCorpus,
      requiredMonthlySIP,
    };

    const retirementDuration = calculateRetirementDuration(input.retirementAge);
    const assumptions = {
      retirementDuration,
    };

    const responseData = formatCalculationResult(input, calculations, assumptions);

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
  }
}

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
