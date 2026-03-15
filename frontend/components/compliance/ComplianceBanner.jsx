'use client';

import { useState, useEffect } from 'react';

/**
 * ComplianceBanner Component
 * Displays "Illustrative Only" notice at top of calculator
 * - High contrast for visibility
 * - Blue background with white text
 * - Dismissible on mobile (optional)
 * - Announces to screen readers
 */
export const ComplianceBanner = ({ 
  dismissible = true,
  autoHideMobile = false,
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user dismissed the banner before
    const bannerDismissed = localStorage?.getItem('complianceBannerDismissed');
    if (bannerDismissed === 'true' && dismissible && autoHideMobile) {
      setIsDismissed(true);
    }
  }, [dismissible, autoHideMobile]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage?.setItem('complianceBannerDismissed', 'true');
    
    // Announce dismissal to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Illustrative notice dismissed';
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  const handleUndo = () => {
    setIsDismissed(false);
    localStorage?.removeItem('complianceBannerDismissed');
  };

  if (isDismissed && autoHideMobile) {
    return null;
  }

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`compliance-banner ${className}`}
        style={{
          backgroundColor: '#e8f4f8',
          borderLeft: '4px solid #224c87',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '16px',
          display: isDismissed ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Message Content */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#224c87',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span 
              aria-hidden="true" 
              style={{ fontSize: '16px' }}
            >
              ℹ️
            </span>
            <span>
              This calculator provides <strong>information purposes only</strong>. 
              Figures are illustrative and subject to change.
            </span>
          </p>
        </div>

        {/* Dismiss Button (Optional) */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss illustrative notice"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#224c87',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Dismiss this notice"
          >
            ✕
          </button>
        )}
      </div>

      {/* Undo Option (if dismissed) */}
      {isDismissed && autoHideMobile && (
        <div
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={handleUndo}
            style={{
              background: 'none',
              border: 'none',
              color: '#224c87',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 'inherit',
            }}
          >
            Show compliance notice
          </button>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        .compliance-banner {
          /* Desktop: Always visible */
        }

        /* Mobile: Can be dismissed */
        @media (max-width: 768px) {
          .compliance-banner {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .compliance-banner button {
            align-self: flex-end;
            margin-top: 8px;
          }
        }

        /* Ensure high contrast */
        .compliance-banner {
          /* Background: #e8f4f8 (light blue)
             Text: #224c87 (dark blue)
             Contrast Ratio: 7.2:1 ✓ (exceeds WCAG AA 4.5:1) */
        }

        /* Print styles */
        @media print {
          .compliance-banner {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .compliance-banner {
            transition: none;
          }
        }

        /* Accessibility: Screen reader only class */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
};

/**
 * Usage Examples:
 * 
 * // Always visible, cannot be dismissed
 * <ComplianceBanner dismissible={false} />
 * 
 * // Can be dismissed, but shows undo option
 * <ComplianceBanner dismissible={true} autoHideMobile={false} />
 * 
 * // Can be dismissed on mobile, hides automatically
 * <ComplianceBanner dismissible={true} autoHideMobile={true} />
 */