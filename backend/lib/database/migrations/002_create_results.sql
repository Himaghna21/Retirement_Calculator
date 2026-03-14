-- Create calculator_results table
-- Stores calculation inputs and results for analysis and auditing

CREATE TABLE IF NOT EXISTS calculator_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL COMMENT 'Reference to calculator_sessions.session_id',
  
  -- Input fields
  current_age INT NOT NULL COMMENT 'User current age',
  retirement_age INT NOT NULL COMMENT 'User planned retirement age',
  current_annual_expenses DECIMAL(15, 2) NOT NULL COMMENT 'Annual expenses in rupees',
  inflation_rate DECIMAL(5, 2) NOT NULL COMMENT 'Expected inflation rate (%)',
  post_retirement_return DECIMAL(5, 2) NOT NULL COMMENT 'Post-retirement return rate (%)',
  pre_retirement_return DECIMAL(5, 2) NOT NULL COMMENT 'Pre-retirement return rate (%)',
  retirement_duration INT NOT NULL COMMENT 'Expected retirement duration (years)',
  
  -- Calculated results
  years_to_retirement INT NOT NULL COMMENT 'Calculated years until retirement',
  retirement_annual_expense DECIMAL(15, 2) NOT NULL COMMENT 'Inflation-adjusted annual expense at retirement',
  required_corpus DECIMAL(15, 2) NOT NULL COMMENT 'Total corpus required at retirement',
  required_monthly_sip DECIMAL(15, 2) NOT NULL COMMENT 'Monthly SIP amount required',
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the calculation was performed',
  
  -- Indexes for efficient querying
  KEY idx_session_id (session_id),
  KEY idx_created_at (created_at),
  KEY idx_current_age (current_age),
  KEY idx_retirement_age (retirement_age),
  
  CONSTRAINT fk_session_id FOREIGN KEY (session_id) 
    REFERENCES calculator_sessions(session_id) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores retirement calculator inputs and results';

-- Create index for analytics queries
CREATE INDEX idx_composite_ages ON calculator_results (current_age, retirement_age, created_at);