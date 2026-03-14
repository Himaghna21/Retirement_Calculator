'use client';

/**
 * Site header component with HDFC branding
 */
export const Header = () => {
  return (
    <header
      style={{
        backgroundColor: '#224c87',
        color: 'white',
        padding: '20px 16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* HDFC Logo placeholder - using SVG */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="HDFC Logo"
          >
            <rect width="48" height="48" fill="white" rx="4" />
            <text x="24" y="30" fontSize="24" fontWeight="bold" fill="#224c87" textAnchor="middle">
              HD
            </text>
          </svg>

          <div>
            <h1
              style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: 'bold',
                lineHeight: '1.2',
              }}
            >
              HDFC Retirement Planning
            </h1>
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                opacity: '0.9',
                fontStyle: 'italic',
              }}
            >
              Illustrative Tool
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};