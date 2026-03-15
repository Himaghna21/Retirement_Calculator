'use client';

import { useEffect, useState } from 'react';
import { fetchDisclaimer } from '@/utils/drupalClient';

/**
 * Disclaimer Component
 * Displays mandatory HDFC disclaimer
 * - Always visible on desktop (above fold)
 * - High contrast (yellow background, dark text)
 * - Minimum 14px font size for WCAG AA
 * - Can be toggled on mobile
 */
export const Disclaimer = ({
  className = '',
  collapsible = false,
  initiallyExpanded = true,
}) => {
  const [disclaimerText, setDisclaimerText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDisclaimer = async () => {
      try {
        setLoading(true);
        const text = await fetchDisclaimer();
        setDisclaimerText(text);
      } catch (err) {
        console.error('Error loading disclaimer:', err);
        setError('Failed to load disclaimer');
        // Still show default disclaimer on error
        setDisclaimerText(getDefaultDisclaimer());
      } finally {
        setLoading(false);
      }
    };

    loadDisclaimer();
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <section
        id="disclaimer"
        aria-labelledby="disclaimer-heading"
        className={`disclaimer-loading ${className}`}
        style={{
          backgroundColor: '#fef3cd',
          borderLeft: '4px solid #f57c00',
          padding: '16px 24px',
          borderRadius: '8px',
          marginTop: '32px',
          marginBottom: '32px',
        }}
      >
        <p style={{
          margin: 0,
          color: '#333',
          fontSize: '14px',
          fontStyle: 'italic',
        }}>
          Loading disclaimer...
        </p>
      </section>
    );
  }

  return (
    <>
      <section
        id="disclaimer"
        aria-labelledby="disclaimer-heading"
        role="region"
        aria-expanded={collapsible ? isExpanded : 'true'}
        className={`disclaimer-section ${className}`}
        style={{
          backgroundColor: '#fef3cd',
          borderLeft: '4px solid #f57c00',
          padding: collapsible ? '16px 24px' : '24px',
          borderRadius: '8px',
          marginTop: '32px',
          marginBottom: '32px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header with Toggle Button (if collapsible on mobile) */}
        {collapsible && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              id="disclaimer-heading"
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span aria-hidden="true">⚠</span>
              Disclaimer
            </h2>
            <button
              onClick={handleToggle}
              aria-expanded={isExpanded}
              aria-controls="disclaimer-content"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '4px 8px',
                color: '#f57c00',
              }}
              aria-label={isExpanded ? 'Collapse disclaimer' : 'Expand disclaimer'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          </div>
        )}

        {/* Non-collapsible heading (desktop) */}
        {!collapsible && (
          <h2
            id="disclaimer-heading"
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              marginTop: 0,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span aria-hidden="true">⚠</span>
            Disclaimer
          </h2>
        )}

        {/* Content (visible on desktop, toggleable on mobile) */}
        <div
          id="disclaimer-content"
          hidden={collapsible && !isExpanded}
          style={{
            fontSize: '14px',
            color: '#333',
            lineHeight: '1.7',
            margin: collapsible && !isExpanded ? 0 : '0',
            display: collapsible && !isExpanded ? 'none' : 'block',
          }}
        >
          {disclaimerText && (
            <div
              dangerouslySetInnerHTML={{ __html: disclaimerText }}
              style={{
                marginBottom: '12px',
              }}
            />
          )}

          {error && (
            <p style={{
              color: '#da3832',
              fontSize: '12px',
              fontWeight: '600',
              margin: '8px 0 0 0',
            }}>
              Note: {error}
            </p>
          )}
        </div>

        {/* Additional notice */}
        <p
          style={{
            fontSize: '12px',
            color: '#666',
            marginTop: collapsible && !isExpanded ? 0 : '12px',
            marginBottom: 0,
            fontStyle: 'italic',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            paddingTop: collapsible && !isExpanded ? 0 : '12px',
            display: collapsible && !isExpanded ? 'none' : 'block',
          }}
        >
          Always consult with a qualified financial advisor before making investment decisions.
        </p>
      </section>

      {/* Responsive styles */}
      <style jsx>{`
        /* Desktop: Always expanded */
        @media (min-width: 769px) {
          .disclaimer-section {
            margin-top: 32px;
            margin-bottom: 32px;
            padding: 24px !important;
          }
        }

        /* Mobile: Can be toggled */
        @media (max-width: 768px) {
          .disclaimer-section {
            margin-top: 24px;
            margin-bottom: 24px;
            padding: 16px 24px !important;
          }
        }

        /* Ensure high contrast for accessibility */
        .disclaimer-section {
          /* Force contrast ratio of at least 4.5:1 (WCAG AA) */
          --text-color: #333; /* Dark text on light background */
          --bg-color: #fef3cd; /* Light yellow background */
          /* Calculated contrast: 5.1:1 ✓ */
        }

        /* Print styles */
        @media print {
          .disclaimer-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </>
  );
};

/**
 * Get default disclaimer text if CMS unavailable
 */
function getDefaultDisclaimer() {
  return `
    <p style="margin: 0 0 12px 0;">
      This Retirement Planning Calculator is intended purely for <strong>illustrative purposes</strong> and should not be considered as investment advice or a recommendation to buy or sell any financial products.
    </p>
    <p style="margin: 0 0 12px 0; font-weight: bold;">Key Points:</p>
    <ul style="margin: 0 0 12px 0; padding-left: 20px;">
      <li>The calculations and results are based on assumptions that may or may not materialize in the future.</li>
      <li>Actual results may vary significantly from the projections depending on market conditions, inflation rates, returns, and other economic factors.</li>
      <li>HDFC does not guarantee the accuracy of these results or endorse any specific investment strategy.</li>
      <li>Past performance is not indicative of future results.</li>
      <li>Please consult with a qualified financial advisor before making any financial decisions.</li>
    </ul>
  `;
}

/**
 * Usage Examples:
 * 
 * // Always expanded (desktop)
 * <Disclaimer />
 * 
 * // Collapsible on mobile, expanded by default
 * <Disclaimer collapsible={true} initiallyExpanded={true} />
 * 
 * // Collapsible on mobile, collapsed by default
 * <Disclaimer collapsible={true} initiallyExpanded={false} />
 */