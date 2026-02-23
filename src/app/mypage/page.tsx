'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import {
  UserIcon,
  EditIcon,
  CommentIcon,
  StarIcon,
  HeartIcon,
  CalendarIcon,
  ClipboardIcon,
  ToothIcon,
  BellIcon,
  SettingsIcon,
  ChevronRightIcon,
} from '@/components/Icons';

/* ────────────────────────────────────────
   메뉴 아이템 타입 & 데이터
──────────────────────────────────────── */
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  action?: () => void;
  iconBg: string;
  iconColor: string;
}

const activityMenu: MenuItem[] = [
  {
    icon: <EditIcon size={18} />,
    label: '내 작성글',
    href: '/mypage/activity?tab=posts',
    iconBg: 'var(--color-primary-bg)',
    iconColor: 'var(--color-primary)',
  },
  {
    icon: <CommentIcon size={18} />,
    label: '내 댓글',
    href: '/mypage/activity?tab=comments',
    iconBg: '#F3E5F5',
    iconColor: '#AB47BC',
  },
  {
    icon: <StarIcon size={18} />,
    label: '내 리뷰',
    href: '/mypage/activity?tab=reviews',
    iconBg: '#FFF3E0',
    iconColor: '#FFA726',
  },
  {
    icon: <HeartIcon size={18} />,
    label: '즐겨찾기 치과',
    href: '/mypage/activity?tab=bookmarks',
    iconBg: '#FCE4EC',
    iconColor: '#EF5350',
  },
];

const dentalMenu: MenuItem[] = [
  {
    icon: <CalendarIcon size={18} />,
    label: '방문 기록',
    href: '/records',
    iconBg: '#E8F5E9',
    iconColor: '#66BB6A',
  },
  {
    icon: <ClipboardIcon size={18} />,
    label: '예약 내역',
    href: '/mypage/appointments',
    iconBg: '#E3F2FD',
    iconColor: '#42A5F5',
  },
  {
    icon: <ToothIcon size={18} />,
    label: '증상 기록',
    href: '/symptom-check',
    iconBg: '#FFF8E1',
    iconColor: '#FFB300',
  },
];

/* ────────────────────────────────────────
   마이페이지
──────────────────────────────────────── */
export default function MyPage() {
  const router = useRouter();

  /* ── 공통 메뉴 아이템 렌더 ── */
  const renderMenuItem = (item: MenuItem, idx: number, total: number) => (
    <button
      key={item.label}
      onClick={() => {
        if (item.href) router.push(item.href);
        if (item.action) item.action();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        width: '100%',
        padding: '14px 0',
        background: 'none',
        borderBottom: idx < total - 1 ? '1px solid var(--color-border-light)' : 'none',
      }}
    >
      {/* 아이콘 영역 */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-lg)',
          background: item.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: item.iconColor,
          flexShrink: 0,
        }}
      >
        {item.icon}
      </div>

      {/* 라벨 */}
      <span
        style={{
          flex: 1,
          textAlign: 'left',
          fontSize: 'var(--font-base)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}
      >
        {item.label}
      </span>

      {/* 화살표 */}
      <ChevronRightIcon size={18} color="var(--color-text-tertiary)" />
    </button>
  );

  /* ── 설정 메뉴 (별도 처리: 로그아웃 포함) ── */
  const settingsMenu: MenuItem[] = [
    {
      icon: <BellIcon size={18} />,
      label: '알림 설정',
      href: '/mypage/settings',
      iconBg: '#EDE7F6',
      iconColor: '#7E57C2',
    },
    {
      icon: <SettingsIcon size={18} />,
      label: '약관 및 정책',
      href: '/mypage/settings',
      iconBg: '#ECEFF1',
      iconColor: '#78909C',
    },
  ];

  return (
    <>
      <Header title="마이페이지" showBack />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* ── 프로필 섹션 ── */}
          <Card
            style={{
              marginTop: 'var(--spacing-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              padding: '28px var(--spacing-xl)',
            }}
          >
            {/* 아바타 */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserIcon size={36} color="var(--color-text-tertiary)" />
            </div>

            {/* 이름 & 이메일 */}
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 'var(--font-xl)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                김민수
              </p>
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                  marginTop: 2,
                }}
              >
                minsu@example.com
              </p>
            </div>

            {/* 프로필 수정 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/mypage/edit')}
              style={{ marginTop: 4 }}
            >
              프로필 수정
            </Button>
          </Card>

          {/* ── 통계 행 ── */}
          <Card
            style={{
              marginTop: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '18px var(--spacing-lg)',
            }}
          >
            {[
              { label: '작성글', value: 12 },
              { label: '리뷰', value: 5 },
              { label: '즐겨찾기', value: 3 },
            ].map((stat, idx, arr) => (
              <React.Fragment key={stat.label}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <p
                    style={{
                      fontSize: 'var(--font-xxl)',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-sm)',
                      color: 'var(--color-text-tertiary)',
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 36,
                      background: 'var(--color-border-light)',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Card>

          {/* ── 내 활동 ── */}
          <section style={{ marginTop: 'var(--spacing-xl)' }}>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 'var(--spacing-sm)',
                paddingLeft: 4,
              }}
            >
              내 활동
            </p>
            <Card padding="4px var(--spacing-lg)">
              {activityMenu.map((item, idx) =>
                renderMenuItem(item, idx, activityMenu.length),
              )}
            </Card>
          </section>

          {/* ── 치과 관리 ── */}
          <section style={{ marginTop: 'var(--spacing-xl)' }}>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 'var(--spacing-sm)',
                paddingLeft: 4,
              }}
            >
              치과 관리
            </p>
            <Card padding="4px var(--spacing-lg)">
              {dentalMenu.map((item, idx) =>
                renderMenuItem(item, idx, dentalMenu.length),
              )}
            </Card>
          </section>

          {/* ── 설정 ── */}
          <section style={{ marginTop: 'var(--spacing-xl)' }}>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 'var(--spacing-sm)',
                paddingLeft: 4,
              }}
            >
              설정
            </p>
            <Card padding="4px var(--spacing-lg)">
              {settingsMenu.map((item, idx) =>
                renderMenuItem(item, idx, settingsMenu.length + 1),
              )}

              {/* 로그아웃 */}
              <button
                onClick={() => alert('로그아웃 되었습니다.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  width: '100%',
                  padding: '14px 0',
                  background: 'none',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-lg)',
                    background: '#FFEBEE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {/* 로그아웃 아이콘 (인라인 SVG) */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H9"
                      stroke="var(--color-danger)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="16 17 21 12 16 7"
                      stroke="var(--color-danger)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="21"
                      y1="12"
                      x2="9"
                      y2="12"
                      stroke="var(--color-danger)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    fontSize: 'var(--font-base)',
                    fontWeight: 500,
                    color: 'var(--color-danger)',
                  }}
                >
                  로그아웃
                </span>
                <ChevronRightIcon size={18} color="var(--color-text-tertiary)" />
              </button>
            </Card>
          </section>

          {/* 하단 여백 */}
          <div style={{ height: 40 }} />
        </div>
      </main>
    </>
  );
}
