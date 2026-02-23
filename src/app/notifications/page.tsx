'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { BellIcon, CalendarIcon, ChatIcon, CheckIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   알림 타입 및 데이터
──────────────────────────────────────── */
type NotificationType = '예약' | '커뮤니티' | '시스템';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  link: string;
}

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: '예약',
    title: '예약 알림',
    description: '7일 뒤 강남치과 예약이 있습니다',
    timeAgo: '2시간 전',
    isRead: false,
    link: '/mypage/appointments',
  },
  {
    id: 'n2',
    type: '시스템',
    title: '정기 검진 안내',
    description: '스케일링 후 6개월이 지났습니다. 재방문을 권장합니다',
    timeAgo: '5시간 전',
    isRead: false,
    link: '/mypage/appointments',
  },
  {
    id: 'n3',
    type: '커뮤니티',
    title: '새 댓글',
    description: '내 게시글에 새 댓글이 달렸습니다',
    timeAgo: '어제',
    isRead: false,
    link: '/community',
  },
  {
    id: 'n4',
    type: '커뮤니티',
    title: '리뷰 반응',
    description: '리뷰에 도움이 돼요가 눌렸습니다',
    timeAgo: '어제',
    isRead: true,
    link: '/community',
  },
  {
    id: 'n5',
    type: '예약',
    title: '예약 확정',
    description: '강남치과 예약이 확정되었습니다',
    timeAgo: '2일 전',
    isRead: true,
    link: '/mypage/appointments',
  },
  {
    id: 'n6',
    type: '시스템',
    title: '치아 건강 매거진',
    description: '치아 건강 매거진: 올바른 칫솔질 방법',
    timeAgo: '3일 전',
    isRead: true,
    link: '/',
  },
  {
    id: 'n7',
    type: '시스템',
    title: '증상 기록 확인',
    description: '증상 기록을 확인해보세요',
    timeAgo: '4일 전',
    isRead: true,
    link: '/symptom-check',
  },
  {
    id: 'n8',
    type: '커뮤니티',
    title: '답글 알림',
    description: '내 댓글에 답글이 달렸습니다',
    timeAgo: '5일 전',
    isRead: true,
    link: '/community',
  },
];

const tabFilters = ['전체', '예약', '커뮤니티', '시스템'] as const;

/* ────────────────────────────────────────
   아이콘 렌더링 헬퍼
──────────────────────────────────────── */
function getNotificationIcon(type: NotificationType) {
  const iconContainerStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  switch (type) {
    case '예약':
      return (
        <div style={{ ...iconContainerStyle, background: 'var(--color-primary-bg)' }}>
          <CalendarIcon size={20} color="var(--color-primary)" />
        </div>
      );
    case '커뮤니티':
      return (
        <div style={{ ...iconContainerStyle, background: '#F3E5F5' }}>
          <ChatIcon size={20} color="#AB47BC" />
        </div>
      );
    case '시스템':
      return (
        <div style={{ ...iconContainerStyle, background: '#FFF3E0' }}>
          <BellIcon size={20} color="#FF9800" />
        </div>
      );
  }
}

/* ────────────────────────────────────────
   알림 센터 페이지
──────────────────────────────────────── */
export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const filteredNotifications =
    activeTab === '전체'
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    router.push(notification.link);
  };

  return (
    <>
      <Header
        title="알림"
        showBack
        showNotification={false}
        showProfile={false}
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <CheckIcon size={16} color="var(--color-primary)" />
              모두 읽음
            </button>
          ) : undefined
        }
      />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)' }}>
        {/* ── 탭 필터 ── */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: 'var(--spacing-lg) var(--spacing-xl)',
            background: 'var(--color-background-white)',
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          {tabFilters.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-primary)' : 'var(--color-background)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── 알림 목록 ── */}
        <div style={{ padding: 'var(--spacing-sm) 0' }}>
          {filteredNotifications.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px var(--spacing-xl)',
                gap: 12,
              }}
            >
              <BellIcon size={48} color="var(--color-text-tertiary)" />
              <p
                style={{
                  fontSize: 'var(--font-base)',
                  color: 'var(--color-text-tertiary)',
                  textAlign: 'center',
                }}
              >
                알림이 없습니다
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  width: '100%',
                  padding: 'var(--spacing-lg) var(--spacing-xl)',
                  background: notification.isRead
                    ? 'var(--color-background-white)'
                    : 'var(--color-primary-bg)',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border-light)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* 읽지 않은 표시 (파란 점) */}
                {!notification.isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                    }}
                  />
                )}

                {/* 아이콘 */}
                {getNotificationIcon(notification.type)}

                {/* 텍스트 내용 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 'var(--font-md)',
                        fontWeight: notification.isRead ? 500 : 700,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {notification.title}
                    </p>
                    <span
                      style={{
                        fontSize: 'var(--font-xs)',
                        color: 'var(--color-text-tertiary)',
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {notification.timeAgo}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.45,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notification.description}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </>
  );
}
