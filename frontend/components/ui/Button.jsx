import styles from '@/styles/form.module.css';

/**
 * Accessible button component
 */
export const Button = ({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  ariaLabel,
  className,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

// Export variant styles
export const buttonStyles = {
  primary: `
    background-color: #224c87;
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: 2px solid #224c87;
    cursor: pointer;
    transition: all 300ms ease-in-out;
  `,
  secondary: `
    background-color: transparent;
    color: #224c87;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: 2px solid #224c87;
    cursor: pointer;
    transition: all 300ms ease-in-out;
  `,
  danger: `
    background-color: #da3832;
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    border: 2px solid #da3832;
    cursor: pointer;
    transition: all 300ms ease-in-out;
  `,
};