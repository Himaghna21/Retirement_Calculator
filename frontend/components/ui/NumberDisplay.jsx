import { formatCurrency } from '@/utils/formatCurrency';
import { formatPercentage } from '@/utils/formatPercentage';

/**
 * Component for displaying formatted numbers
 */
export const NumberDisplay = ({ 
  value, 
  type = 'currency', // 'currency' or 'percentage'
  label,
  subtitle,
  className,
}) => {
  let formattedValue;

  if (type === 'currency') {
    formattedValue = formatCurrency(value);
  } else if (type === 'percentage') {
    formattedValue = formatPercentage(value);
  } else {
    formattedValue = value?.toString() || '0';
  }

  return (
    <div className={className}>
      {label && (
        <div
          style={{
            fontSize: '14px',
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            fontWeight: '600',
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#224c87',
          wordBreak: 'break-word',
        }}
      >
        {formattedValue}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: '14px',
            color: '#999',
            marginTop: '8px',
            fontStyle: 'italic',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};