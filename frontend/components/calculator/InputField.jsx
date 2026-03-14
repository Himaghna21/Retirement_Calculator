import { useState } from 'react';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Tooltip } from '../ui/Tooltip';
import styles from '@/styles/form.module.css';

/**
 * Reusable accessible input field component
 */
export const InputField = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  tooltip,
  unit,
  required = false,
  disabled = false,
  min,
  max,
  step,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const describedByIds = [
    error && `error-${id}`,
    helperText && `helper-${id}`,
    tooltip && `tooltip-${id}`,
    ariaDescribedBy,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    styles.input,
    error && styles.error,
    unit && styles.withUnit,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={`${styles.label} ${required ? styles.required : ''}`}>
        {label}
        {tooltip && (
          <Tooltip content={tooltip} position="right">
            <span style={{ marginLeft: '8px', cursor: 'help' }} aria-label="more information">
              ⓘ
            </span>
          </Tooltip>
        )}
      </label>

      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={name}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          aria-label={ariaLabel || label}
          aria-describedby={describedByIds || undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
        />
        {unit && <div className={styles.inputUnit}>{unit}</div>}
      </div>

      {helperText && (
        <div id={`helper-${id}`} className={styles.helperText}>
          {helperText}
        </div>
      )}

      <ErrorMessage message={error} fieldName={id} visible={!!error} />
    </div>
  );
};