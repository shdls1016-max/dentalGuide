'use client';

import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  disabled = false,
  onClick,
  style: customStyle,
  type = 'button',
}: ButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '8px 16px',
      fontSize: 'var(--font-sm)',
      height: '36px',
      borderRadius: 'var(--radius-md)',
    },
    md: {
      padding: '10px 20px',
      fontSize: 'var(--font-base)',
      height: '44px',
      borderRadius: 'var(--radius-button)',
    },
    lg: {
      padding: '14px 24px',
      fontSize: 'var(--font-lg)',
      height: '52px',
      borderRadius: 'var(--radius-button)',
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--color-primary)',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      background: 'var(--color-primary-bg)',
      color: 'var(--color-primary)',
      border: 'none',
    },
    outline: {
      background: 'var(--color-background-white)',
      color: 'var(--color-primary)',
      border: '1.5px solid var(--color-primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: 'none',
    },
    danger: {
      background: 'transparent',
      color: 'var(--color-danger)',
      border: '1.5px solid var(--color-danger)',
    },
    text: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      border: 'none',
    },
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap' as const,
    fontFamily: 'inherit',
    lineHeight: 1,
    opacity: disabled ? 0.5 : 1,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...customStyle,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
