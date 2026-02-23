'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';

/* ────────────────────────────────────────
   치료 정보 카드 데이터
──────────────────────────────────────── */
const treatmentItems = [
  { id: 'scaling', label: '스케일링', color: '#E3F2FD', accent: '#42A5F5' },
  { id: 'resin', label: '레진', color: '#F3E5F5', accent: '#AB47BC' },
  { id: 'inlay', label: '인레이', color: '#E8F5E9', accent: '#66BB6A' },
  { id: 'rootcanal', label: '신경치료', color: '#FFF3E0', accent: '#FFA726' },
  { id: 'crown', label: '크라운', color: '#FCE4EC', accent: '#EF5350' },
];

/* ────────────────────────────────────────
   매거진 카드 데이터
──────────────────────────────────────── */
const magazineItems = [
  {
    id: 'm1',
    title: '올바른 양치법,\n이렇게 하세요',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tag: '구강관리',
  },
  {
    id: 'm2',
    title: '스케일링 주기,\n어떻게 잡을까?',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tag: '치료정보',
  },
  {
    id: 'm3',
    title: '치아 미백의\n모든 것',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tag: '미용',
  },
];

/* ────────────────────────────────────────
   Home Page
──────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(true);

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  return (
    <>
      <Header
        onNotificationClick={handleNotificationClick}
        onProfileClick={() => router.push('/mypage')}
      />

      <main className="page-container" style={{ background: 'var(--color-background)' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* ── Hero Banner ── */}
          <section
            style={{
              background: 'linear-gradient(135deg, #4A90D9 0%, #357ABD 50%, #2E6DB4 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 24px',
              marginTop: 'var(--spacing-lg)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 170,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: 'absolute',
                top: -30,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -40,
                right: 40,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
              }}
            />

            {/* Text content */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                지금 치과 가야 할까?
              </p>
              <h2
                style={{
                  fontSize: 'var(--font-xxl)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.35,
                  marginBottom: 18,
                  whiteSpace: 'pre-line',
                }}
              >
                {'내 증상에 딱 맞는\n맞춤형 가이드'}
              </h2>
              <button
                onClick={() => router.push('/symptom-check')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  background: '#FFFFFF',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: 'var(--font-md)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease',
                }}
              >
                내 증상 확인하기
                <span style={{ fontSize: 16 }}>&rarr;</span>
              </button>
            </div>

            {/* Illustration placeholder: tooth + phone icon */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: 100,
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {/* Phone shape */}
              <div
                style={{
                  width: 62,
                  height: 100,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.18)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {/* Tooth icon inside phone */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C10.08 2 8.5 2.74 7.5 4.2C6.78 3.3 5.58 2.6 4 2.6C4 6.6 5.5 9 7.5 11.5C5 14.5 4 17 4 20H7.5C7.5 17.5 8.8 15 12 13.5C15.2 15 16.5 17.5 16.5 20H20C20 17 19 14.5 16.5 11.5C18.5 9 20 6.6 20 2.6C18.42 2.6 17.22 3.3 16.5 4.2C15.5 2.74 13.92 2 12 2Z"
                    fill="rgba(255,255,255,0.9)"
                  />
                </svg>
                <div
                  style={{
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.4)',
                  }}
                />
              </div>
              {/* Small floating plus */}
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 5,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                +
              </div>
            </div>
          </section>

          {/* ── Recent Visit Card ── */}
          <section
            onClick={() => router.push('/records')}
            style={{
              marginTop: 'var(--spacing-xl)',
              background: 'var(--color-background-white)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            {/* Shield / tooth icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  fill="var(--color-primary)"
                  opacity="0.2"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                  fontWeight: 500,
                  marginBottom: 2,
                }}
              >
                최근 방문치과
              </p>
              <p style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                <span style={{ fontSize: 'var(--font-hero)', color: 'var(--color-primary)' }}>180</span>
                <span style={{ fontSize: 'var(--font-md)', fontWeight: 500, color: 'var(--color-text-secondary)', marginLeft: 4 }}>
                  일 경과
                </span>
              </p>
            </div>

            {/* Arrow */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </section>

          {/* ── Treatment Info Section ── */}
          <section style={{ marginTop: 'var(--spacing-xxl)' }}>
            <h3
              style={{
                fontSize: 'var(--font-xl)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              치료 정보
            </h3>

            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {treatmentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push('/treatment/' + item.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-lg)',
                      background: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {/* Tooth mini icon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C10.08 2 8.5 2.74 7.5 4.2C6.78 3.3 5.58 2.6 4 2.6C4 6.6 5.5 9 7.5 11.5C5 14.5 4 17 4 20H7.5C7.5 17.5 8.8 15 12 13.5C15.2 15 16.5 17.5 16.5 20H20C20 17 19 14.5 16.5 11.5C18.5 9 20 6.6 20 2.6C18.42 2.6 17.22 3.3 16.5 4.2C15.5 2.74 13.92 2 12 2Z"
                        fill={item.accent}
                        opacity="0.85"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-sm)',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Magazine Section ── */}
          <section style={{ marginTop: 'var(--spacing-xxl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              <h3
                style={{
                  fontSize: 'var(--font-xl)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                매거진
              </h3>
              <button
                onClick={() => router.push('/magazine')}
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                더보기
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 8,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {magazineItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push('/magazine/' + item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push('/magazine/' + item.id); }}
                  style={{
                    flexShrink: 0,
                    width: 200,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    background: 'var(--color-background-white)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '100%',
                      height: 120,
                      background: item.color,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      padding: 12,
                      position: 'relative',
                    }}
                  >
                    {/* Decorative circle */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--font-xs)',
                        fontWeight: 600,
                        color: 'white',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  {/* Card body */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p
                      style={{
                        fontSize: 'var(--font-md)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.4,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom spacing for notification + tab bar */}
          <div style={{ height: 60 }} />
        </div>
      </main>

      {/* ── Floating Notification Bar ── */}
      {showNotification && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(var(--tabbar-height) + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: 'calc(var(--max-width) - 40px)',
            background: 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            zIndex: 150,
            boxShadow: '0 4px 16px rgba(74, 144, 217, 0.35)',
          }}
        >
          {/* Bell icon */}
          <div
            onClick={() => router.push('/appointment')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') router.push('/appointment'); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: '#FFFFFF',
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              7일 뒤, 예약한 치과 일정이 있습니다
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowNotification(false)}
            style={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            aria-label="알림 닫기"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <TabBar />
    </>
  );
}
