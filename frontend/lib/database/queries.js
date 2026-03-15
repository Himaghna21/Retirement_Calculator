import { executeQuery } from './connection.js';

/**
 * Create a new session
 * @param {string} sessionId - UUID for the session
 * @returns {Promise<Object>} Inserted session object
 */
export const createSession = async (sessionId) => {
  const sql = 'INSERT INTO calculator_sessions (session_id) VALUES (?)';
  const result = await executeQuery(sql, [sessionId]);
  return { id: result.insertId, session_id: sessionId };
};

/**
 * Store calculation result
 * @param {string} sessionId - Session UUID
 * @param {Object} input - Input values
 * @param {Object} results - Calculated results
 * @returns {Promise<Object>} Inserted result object
 */
export const storeCalculationResult = async (sessionId, input, results) => {
  const sql = `
    INSERT INTO calculator_results (
      session_id,
      current_age,
      retirement_age,
      current_annual_expenses,
      inflation_rate,
      post_retirement_return,
      pre_retirement_return,
      retirement_duration,
      years_to_retirement,
      retirement_annual_expense,
      required_corpus,
      required_monthly_sip
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    sessionId,
    input.currentAge,
    input.retirementAge,
    input.currentAnnualExpenses,
    input.inflationRate,
    input.postRetirementReturn,
    input.preRetirementReturn,
    input.retirementDuration,
    results.yearsToRetirement,
    results.retirementAnnualExpense,
    results.requiredCorpus,
    results.requiredMonthlySIP,
  ];

  const result = await executeQuery(sql, values);
  return { id: result.insertId, ...results };
};

/**
 * Get calculation result by ID
 * @param {number} resultId - Result ID
 * @returns {Promise<Object|null>} Result object or null if not found
 */
export const getCalculationResult = async (resultId) => {
  const sql = 'SELECT * FROM calculator_results WHERE id = ?';
  const results = await executeQuery(sql, [resultId]);
  return results.length > 0 ? results[0] : null;
};

/**
 * Get all results for a session
 * @param {string} sessionId - Session UUID
 * @returns {Promise<Array>} Array of result objects
 */
export const getSessionResults = async (sessionId) => {
  const sql = 'SELECT * FROM calculator_results WHERE session_id = ? ORDER BY created_at DESC';
  return executeQuery(sql, [sessionId]);
};

/**
 * Get calculation statistics (for analytics)
 * @returns {Promise<Object>} Statistics object
 */
export const getCalculationStatistics = async () => {
  const sql = `
    SELECT
      COUNT(*) as total_calculations,
      AVG(current_age) as avg_current_age,
      AVG(retirement_age) as avg_retirement_age,
      AVG(required_corpus) as avg_required_corpus,
      AVG(required_monthly_sip) as avg_monthly_sip,
      MIN(created_at) as first_calculation,
      MAX(created_at) as last_calculation
    FROM calculator_results
  `;
  const results = await executeQuery(sql);
  return results[0] || {};
};

/**
 * Delete old sessions (data cleanup)
 * @param {number} daysOld - Delete sessions older than this many days
 * @returns {Promise<number>} Number of deleted sessions
 */
export const deleteOldSessions = async (daysOld = 30) => {
  const sql = `
    DELETE FROM calculator_sessions 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
  `;
  const result = await executeQuery(sql, [daysOld]);
  return result.affectedRows;
};