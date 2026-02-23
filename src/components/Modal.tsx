'use client';

import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true);
        });
      });
    } else {
      setAnimating(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!visible) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: animating ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
      zIndex: 400,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      transition: 'background 0.3s ease',
    },
    sheet: {
      width: '100%',
      maxWidth: 'var(--max-width)',
      background: 'var(--color-background-white)',
      borderRadius: '20px 20px 0 0',
      maxHeight: '85vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
      transform: animating ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    },
    handleBar: {
      display: 'flex',
      justifyContent: 'center',
      padding: '12px 0 8px',
      flexShrink: 0,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: 'var(--color-border)',
      cursor: 'pointer',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 var(--spacing-xl) var(--spacing-lg)',
      position: 'relative' as const,
      flexShrink: 0,
    },
    title: {
      fontSize: 'var(--font-xl)',
      fontWeight: 700,
      color: 'var(--color-text-primary)',
    },
    closeButton: {
      position: 'absolute' as const,
      right: 'var(--spacing-xl)',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-border-light)',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    content: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '0 var(--spacing-xl) var(--spacing-xxl)',
    },
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.sheet}>
        {/* Handle bar */}
        <div style={styles.handleBar}>
          <div style={styles.handle} onClick={onClose} />
        </div>

        {/* Header with title */}
        {title && (
          <div style={styles.header}>
            <span style={styles.title}>{title}</span>
            <button
              style={styles.closeButton}
              onClick={onClose}
              aria-label="닫기"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="var(--color-text-secondary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
