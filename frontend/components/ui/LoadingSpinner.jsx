/**
 * Loading spinner component
 */
export const LoadingSpinner = ({ message = 'Calculating...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        gap: '16px',
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #224c87',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
        aria-hidden="true"
      />
      <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};