-- Create calculator_sessions table
-- Stores unique session information for tracking calculator usage

CREATE TABLE IF NOT EXISTS calculator_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(36) UNIQUE NOT NULL COMMENT 'UUID for session tracking',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the session was created',
  INDEX idx_session_id (session_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores unique calculator session information';