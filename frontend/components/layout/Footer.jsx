'use client';

/**
 * Site footer component
 */
export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        padding: '32px 16px',
        marginTop: '48px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}
        >
          {/* Company Info */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              HDFC
            </h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
              India's trusted financial services company providing retirement planning tools.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              Resources
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ fontSize: '14px', color: '#224c87', textDecoration: 'none' }}>
                  Financial Planning Guide
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ fontSize: '14px', color: '#224c87', textDecoration: 'none' }}>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: '14px', color: '#224c87', textDecoration: 'none' }}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ fontSize: '14px', color: '#224c87', textDecoration: 'none' }}>
                  Privacy Policy
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ fontSize: '14px', color: '#224c87', textDecoration: 'none' }}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" style={{ fontSize: '14px', color: '#224c87', textDecoration: 'none' }}>
                  Accessibility Statement
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #e0e0e0',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#666',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} HDFC. All rights reserved.
          </p>
          <p style={{ margin: 0 }}>
            For accessibility issues, <a href="mailto:accessibility@hdfc.com">contact us</a>
          </p>
        </div>
      </div>
    </footer>
  );
};