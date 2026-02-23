'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, HomeFilledIcon, SearchIcon, ClipboardIcon, ChatIcon } from './Icons';

interface Tab {
  id: string;
  label: string;
  href: string;
  icon: (props: { size: number; color: string }) => React.ReactNode;
  activeIcon: (props: { size: number; color: string }) => React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: 'home',
    label: '홈',
    href: '/',
    icon: ({ size, color }) => <HomeIcon size={size} color={color} />,
    activeIcon: ({ size, color }) => <HomeFilledIcon size={size} color={color} />,
  },
  {
    id: 'search',
    label: '치과검색',
    href: '/search',
    icon: ({ size, color }) => <SearchIcon size={size} color={color} />,
    activeIcon: ({ size, color }) => <SearchIcon size={size} color={color} />,
  },
  {
    id: 'records',
    label: '증상기록',
    href: '/records',
    icon: ({ size, color }) => <ClipboardIcon size={size} color={color} />,
    activeIcon: ({ size, color }) => <ClipboardIcon size={size} color={color} />,
  },
  {
    id: 'community',
    label: '커뮤니티',
    href: '/community',
    icon: ({ size, color }) => <ChatIcon size={size} color={color} />,
    activeIcon: ({ size, color }) => <ChatIcon size={size} color={color} />,
  },
];

export default function TabBar() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const styles: Record<string, React.CSSProperties> = {
    nav: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--max-width)',
      background: 'var(--color-background-white)',
      borderTop: '1px solid var(--color-border-light)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
      paddingTop: '8px',
      paddingBottom: '34px',
      zIndex: 200,
      boxShadow: 'var(--shadow-tabbar)',
    },
    tabLink: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '4px',
      padding: '4px 0',
      minWidth: 64,
      textDecoration: 'none',
      transition: 'all 0.2s ease',
    },
    labelActive: {
      fontSize: 'var(--font-xs)',
      fontWeight: 600,
      color: 'var(--color-primary)',
      lineHeight: 1,
    },
    labelInactive: {
      fontSize: 'var(--font-xs)',
      fontWeight: 400,
      color: 'var(--color-inactive)',
      lineHeight: 1,
    },
  };

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => {
        const active = isActive(tab.href);
        const iconColor = active ? 'var(--color-primary)' : 'var(--color-inactive)';

        return (
          <Link
            key={tab.id}
            href={tab.href}
            style={styles.tabLink}
            aria-label={tab.label}
          >
            {active
              ? tab.activeIcon({ size: 24, color: iconColor })
              : tab.icon({ size: 24, color: iconColor })
            }
            <span style={active ? styles.labelActive : styles.labelInactive}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
