'use client';

import { useEffect } from 'react';

/**
 * PageWrapper Component
 * Semantic wrapper for main content area
 * Handles focus management and accessibility
 */
export const PageWrapper = ({ 
  children, 
  mainId = 'main-content',
  className = '',
  ariaLabel,
  role = 'main',
}) => {
  useEffect(() => {
    // Focus management for page transitions
    const mainElement = document.getElementById(mainId);
    if (mainElement) {
      // Allow focusing on main element
      mainElement.setAttribute('tabindex', '-1');
      
      // Optional: Focus main content on page load (skip-link behavior)
      // Uncomment if you want automatic focus on page transitions
      // mainElement.focus();
    }
  }, [mainId]);

  return (
    <>
      {/* Skip to content link - visually hidden but accessible via keyboard */}
      <a 
        href={`#${mainId}`} 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Main content container - semantic HTML5 element */}
      <main
        id={mainId}
        role={role}
        aria-label={ariaLabel}
        className={`page-wrapper ${className}`}
        style={{
          minHeight: 'calc(100vh - 200px)',
          outline: 'none', // Remove focus outline since we're using focus styles elsewhere
        }}
      >
        {/* Container div for max-width and padding */}
        <div className="container" style={{ padding: '32px 16px' }}>
          {children}
        </div>
      </main>

      {/* Skip link styling */}
      <style jsx>{`
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background-color: #224c87;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 8px;
          z-index: 1000;
          font-weight: 600;
        }

        .skip-link:focus {
          top: 0;
          outline: 2px solid #da3832;
          outline-offset: 2px;
        }

        /* Smooth scroll behavior for anchor links */
        html {
          scroll-behavior: smooth;
        }

        .page-wrapper {
          display: flex;
          flex-direction: column;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Mobile responsive padding */
        @media (max-width: 768px) {
          .container {
            padding: 24px 16px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 16px 12px;
          }
        }
      `}</style>
    </>
  );
};

/**
 * Usage Example:
 * 
 * <PageWrapper mainId="main-content" ariaLabel="Retirement Calculator">
 *   <CalculatorForm />
 * </PageWrapper>
 */