import { useState, useRef } from 'react';

/**
 * Accessible tooltip component
 */
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  const triggerRef = useRef(null);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  const tooltipStyles = {
    position: 'absolute',
    backgroundColor: '#224c87',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 10,
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)',
    },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      ref={triggerRef}
    >
      <span aria-describedby={isVisible ? tooltipId : undefined}>
        {children}
      </span>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{
            ...tooltipStyles,
            ...positionStyles[position],
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};