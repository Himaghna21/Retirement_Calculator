/**
 * Accessible error message component
 */
export const ErrorMessage = ({ message, fieldName, visible = true }) => {
  if (!visible || !message) return null;

  return (
    <div
      id={`error-${fieldName}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{
        color: '#da3832',
        fontSize: '14px',
        fontWeight: '600',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <span aria-hidden="true">⚠</span>
      <span>{message}</span>
    </div>
  );
};