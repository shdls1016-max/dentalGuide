'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, BellIcon, UserIcon } from './Icons';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  hasUnread?: boolean;
  onBack?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  showNotification = true,
  showProfile = true,
  hasUnread,
  onBack,
  onNotificationClick,
  onProfileClick,
  rightAction,
}: HeaderProps) {
  const router = useRouter();
  const handleBack = onBack || (() => router.back());

  // Internal unread state derived from localStorage
  const [internalHasUnread, setInternalHasUnread] = useState(true);

  useEffect(() => {
    const read = localStorage.getItem('notifications_read');
    if (read === 'true') {
      setInternalHasUnread(false);
    }
  }, []);

  // Use the explicit prop if provided, otherwise fall back to internal state
  const showUnreadDot = hasUnread !== undefined ? hasUnread : internalHasUnread;

  const handleNotificationClick = () => {
    // Mark notifications as read in localStorage and update internal state
    localStorage.setItem('notifications_read', 'true');
    setInternalHasUnread(false);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };
  const styles: Record<string, React.CSSProperties> = {
    header: {
      position: 'sticky',
      top: 0,
      width: '100%',
      maxWidth: 'var(--max-width)',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-lg)',
      background: 'var(--color-background-white)',
      borderBottom: '1px solid var(--color-border-light)',
      zIndex: 200,
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '80px',
    },
    backButton: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    logoText: {
      fontSize: 'var(--font-lg)',
      fontWeight: 700,
      color: 'var(--color-text-primary)',
      letterSpacing: '-0.3px',
    },
    centerTitle: {
      position: 'absolute' as const,
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: 'var(--font-lg)',
      fontWeight: 600,
      color: 'var(--color-text-primary)',
      whiteSpace: 'nowrap' as const,
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '80px',
      justifyContent: 'flex-end',
    },
    iconButton: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      position: 'relative' as const,
    },
    profileButton: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-primary-bg)',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    notificationDot: {
      position: 'absolute' as const,
      top: 6,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--color-danger)',
      border: '1.5px solid white',
    },
  };

  return (
    <header style={styles.header}>
      {/* Left section */}
      <div style={styles.leftSection}>
        {showBack ? (
          <button
            style={styles.backButton}
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <ArrowLeftIcon size={22} color="var(--color-text-primary)" />
          </button>
        ) : (
          <div style={styles.logoContainer}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C9.5 2 7.5 3.5 7 5.5C6.5 7.5 5.5 9 4.5 11C3.5 13 3 15 4 17C5 19 6 21 8 21C9 21 10 20 10.5 18.5C11 17 11.5 16 12 16C12.5 16 13 17 13.5 18.5C14 20 15 21 16 21C18 21 19 19 20 17C21 15 20.5 13 19.5 11C18.5 9 17.5 7.5 17 5.5C16.5 3.5 14.5 2 12 2Z"
                fill="var(--color-primary)"
              />
            </svg>
            <span style={styles.logoText}>DENTAL GUIDE</span>
          </div>
        )}
      </div>

      {/* Center title */}
      {title && <span style={styles.centerTitle}>{title}</span>}

      {/* Right section */}
      <div style={styles.rightSection}>
        {rightAction}
        {showNotification && (
          <button style={styles.iconButton} aria-label="알림" onClick={handleNotificationClick}>
            <BellIcon size={22} color="var(--color-text-secondary)" />
            {showUnreadDot && <span style={styles.notificationDot} />}
          </button>
        )}
        {showProfile && (
          <button style={styles.profileButton} aria-label="내 정보" onClick={onProfileClick}>
            <UserIcon size={20} color="var(--color-primary)" />
          </button>
        )}
      </div>
    </header>
  );
}
