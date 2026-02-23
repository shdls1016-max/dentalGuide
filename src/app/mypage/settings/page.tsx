'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { ChevronRightIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   토글 스위치 컴포넌트
──────────────────────────────────────── */
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: 48,
        height: 28,
        borderRadius: 'var(--radius-full)',
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.25s ease',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          width: 22,
          height: 22,
          borderRadius: 'var(--radius-full)',
          background: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </button>
  );
}

/* ────────────────────────────────────────
   설정 페이지
──────────────────────────────────────── */
export default function SettingsPage() {
  const router = useRouter();

  /* 알림 토글 상태 */
  const [reservationNotif, setReservationNotif] = useState(true);
  const [communityNotif, setCommunityNotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);

  /* ── 알림 항목 데이터 ── */
  const notificationItems = [
    {
      label: '예약 알림',
      description: '예약 확인 및 리마인더 알림을 받습니다',
      checked: reservationNotif,
      onChange: setReservationNotif,
    },
    {
      label: '커뮤니티 알림',
      description: '내 글의 댓글, 좋아요 등 알림을 받습니다',
      checked: communityNotif,
      onChange: setCommunityNotif,
    },
    {
      label: '마케팅 알림',
      description: '이벤트, 프로모션 등 마케팅 알림을 받습니다',
      checked: marketingNotif,
      onChange: setMarketingNotif,
    },
  ];

  /* ── 정보 메뉴 항목 ── */
  const infoItems = [
    { label: '이용약관' },
    { label: '개인정보처리방침' },
    { label: '오픈소스 라이선스' },
  ];

  /* ── 공통 링크 아이템 스타일 ── */
  const linkItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '15px 0',
    background: 'none',
    cursor: 'pointer',
    border: 'none',
  };

  /* ── 섹션 제목 스타일 ── */
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    letterSpacing: 0.5,
    marginBottom: 'var(--spacing-sm)',
    paddingLeft: 4,
  };

  return (
    <>
      <Header title="설정" showBack />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* ── 알림 설정 ── */}
          <section style={{ marginTop: 'var(--spacing-lg)' }}>
            <p style={sectionTitleStyle}>알림 설정</p>
            <Card padding="4px var(--spacing-lg)">
              {notificationItems.map((item, idx) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-md)',
                    padding: '16px 0',
                    borderBottom:
                      idx < notificationItems.length - 1
                        ? '1px solid var(--color-border-light)'
                        : 'none',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 'var(--font-base)',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        marginBottom: 2,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: 'var(--font-sm)',
                        color: 'var(--color-text-tertiary)',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                  <ToggleSwitch checked={item.checked} onChange={item.onChange} />
                </div>
              ))}
            </Card>
          </section>

          {/* ── 계정 ── */}
          <section style={{ marginTop: 'var(--spacing-xl)' }}>
            <p style={sectionTitleStyle}>계정</p>
            <Card padding="4px var(--spacing-lg)">
              {/* 비밀번호 변경 */}
              <button
                style={{
                  ...linkItemStyle,
                  borderBottom: '1px solid var(--color-border-light)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  비밀번호 변경
                </span>
                <ChevronRightIcon size={18} color="var(--color-text-tertiary)" />
              </button>

              {/* 연결된 소셜 계정 */}
              <div style={{ padding: '15px 0' }}>
                <p
                  style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)',
                  }}
                >
                  연결된 소셜 계정
                </p>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  {/* 카카오 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: '8px 14px',
                      background: '#FEE500',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: 600,
                      color: '#191919',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#191919">
                      <path d="M12 3C6.48 3 2 6.58 2 10.94C2 13.74 3.88 16.19 6.68 17.56L5.72 21.16C5.64 21.46 5.98 21.7 6.24 21.52L10.52 18.72C11 18.78 11.5 18.82 12 18.82C17.52 18.82 22 15.24 22 10.88C22 6.58 17.52 3 12 3Z" />
                    </svg>
                    카카오
                  </div>

                  {/* 네이버 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: '8px 14px',
                      background: '#03C75A',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M16.27 12.27L7.46 3H3V21H7.73V11.73L16.54 21H21V3H16.27V12.27Z" />
                    </svg>
                    네이버
                  </div>

                  {/* 애플 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: '8px 14px',
                      background: '#000000',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.83 9.28 4.8C10.56 4.78 11.78 5.68 12.56 5.68C13.34 5.68 14.82 4.58 16.39 4.75C17.07 4.78 18.83 5.03 19.95 6.68C19.86 6.74 17.62 8.07 17.64 10.82C17.67 14.1 20.48 15.18 20.51 15.19C20.49 15.27 20.02 16.9 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                    </svg>
                    애플
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ── 정보 ── */}
          <section style={{ marginTop: 'var(--spacing-xl)' }}>
            <p style={sectionTitleStyle}>정보</p>
            <Card padding="4px var(--spacing-lg)">
              {infoItems.map((item, idx) => (
                <button
                  key={item.label}
                  style={{
                    ...linkItemStyle,
                    borderBottom:
                      idx < infoItems.length
                        ? '1px solid var(--color-border-light)'
                        : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--font-base)',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {item.label}
                  </span>
                  <ChevronRightIcon size={18} color="var(--color-text-tertiary)" />
                </button>
              ))}

              {/* 앱 버전 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 0',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  앱 버전
                </span>
                <span
                  style={{
                    fontSize: 'var(--font-md)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  1.0.0
                </span>
              </div>
            </Card>
          </section>

          {/* ── 계정 관리 ── */}
          <section style={{ marginTop: 'var(--spacing-xl)' }}>
            <p style={sectionTitleStyle}>계정 관리</p>
            <Card
              padding="var(--spacing-lg)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-lg)',
              }}
            >
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  alert('로그아웃 되었습니다.');
                  router.push('/');
                }}
                style={{
                  color: 'var(--color-danger)',
                  borderColor: 'var(--color-danger)',
                }}
              >
                로그아웃
              </Button>

              <button
                onClick={() => {
                  if (confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
                    alert('탈퇴 처리가 완료되었습니다.');
                    router.push('/');
                  }
                }}
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-danger)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  opacity: 0.7,
                }}
              >
                회원탈퇴
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
