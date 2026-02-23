import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Card({
  children,
  padding = 'var(--spacing-xl)',
  onClick,
  style: customStyle,
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: 'var(--color-background-card)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'box-shadow 0.2s ease',
    ...customStyle,
  };

  if (onClick) {
    return (
      <div
        style={baseStyle}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div style={baseStyle}>
      {children}
    </div>
  );
}
