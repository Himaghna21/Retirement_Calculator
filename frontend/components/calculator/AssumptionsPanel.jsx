'use client';

import { useState } from 'react';
import assumptionStyles from '@/styles/calculator.module.css';

/**
 * Assumptions disclosure panel
 */
export const AssumptionsPanel = ({ assumptions, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!assumptions) {
    return null;
  }

  return (
    <section
      className={assumptionStyles.assumptionsPanel}
      aria-labelledby="assumptions-heading"
      role="region"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        aria-controls="assumptions-content"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#224c87',
          width: '100%',
          marginBottom: '16px',
        }}
      >
        <span aria-hidden="true">{isCollapsed ? '▶' : '▼'}</span>
        <h3 id="assumptions-heading" style={{ margin: 0 }}>
          Assumptions – Illustrative Only
        </h3>
      </button>

      <div
        id="assumptions-content"
        hidden={isCollapsed}
        style={{ display: isCollapsed ? 'none' : 'block' }}
      >
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid #919090',
          }}
        >
          {assumptions && Object.entries(assumptions).length > 0 ? (
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                listStyleType: 'disc',
              }}
            >
              {Object.entries(assumptions).map(([key, value]) => (
                <li
                  key={key}
                  style={{
                    marginBottom: '12px',
                    fontSize: '14px',
                    color: '#333',
                    lineHeight: '1.6',
                  }}
                >
                  <strong>{formatAssumptionLabel(key)}:</strong> {formatAssumptionValue(value)}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              No additional assumptions to display.
            </p>
          )}
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '12px',
            fontStyle: 'italic',
            margin: '12px 0 0 0',
          }}
        >
          These assumptions are for illustration purposes only and may not reflect actual market conditions.
        </p>
      </div>
    </section>
  );
};

/**
 * Format assumption key for display
 */
const formatAssumptionLabel = (key) => {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format assumption value for display
 */
const formatAssumptionValue = (value) => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  return value;
};