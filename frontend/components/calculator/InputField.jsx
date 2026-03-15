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

  const handleKeyDown = (e) => {
    if (type !== 'number') return;
    
    const numericStep = parseFloat(step) || 1;
    const currentVal = parseFloat(value) || 0;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextVal = currentVal + numericStep;
      const formattedVal = numericStep % 1 !== 0 
        ? parseFloat(nextVal.toFixed(2)) 
        : nextVal;
        
      if (max && formattedVal > parseFloat(max)) return;
      
      onChange({ target: { name, value: formattedVal.toString(), id } });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextVal = currentVal - numericStep;
      const formattedVal = numericStep % 1 !== 0 
        ? parseFloat(nextVal.toFixed(2)) 
        : nextVal;
        
      if (min && formattedVal < parseFloat(min)) return;
      
      onChange({ target: { name, value: formattedVal.toString(), id } });
    }
  };

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
          type="text"
          inputMode={type === 'number' ? (step && step.toString().includes('.') ? 'decimal' : 'numeric') : undefined}
          pattern={type === 'number' ? "[0-9]*\\.?[0-9]*" : undefined}
          className={inputClasses}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          onKeyDown={handleKeyDown}
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
          aria-invalid={!!error}
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