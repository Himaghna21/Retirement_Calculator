import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database/connection.js';

/**
 * GET /api/health
 * Health check endpoint for monitoring
 */
export async function GET(request) {
  try {
    // Check database connectivity
    await executeQuery('SELECT 1');

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      },
      { status: 503 }
    );
  }
}