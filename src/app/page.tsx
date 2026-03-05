'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';

import Image from "next/image";


/* ────────────────────────────────────────
   치료 정보 카드 데이터
──────────────────────────────────────── */
const treatmentItems = [
  { id: 'scaling', label: '스케일링', color: '#E3F2FD', accent: '#42A5F5' },
  { id: 'resin', label: '레진', color: '#F3E5F5', accent: '#AB47BC' },
  { id: 'inlay', label: '인레이', color: '#E8F5E9', accent: '#66BB6A' },
  { id: 'rootcanal', label: '신경치료', color: '#FFF3E0', accent: '#FFA726' },
  { id: 'crown', label: '크라운', color: '#FCE4EC', accent: '#EF5350' },
  { id: 'extraction', label: '발치', color: '#FCE4EC', accent: '#EF5350' },
  { id: 'implant', label: '임플란트', color: '#FCE4EC', accent: '#EF5350' },
];

/* ────────────────────────────────────────
   매거진 카드 데이터
──────────────────────────────────────── */
const magazineItems = [
  {
    id: 'm1',
    title: '올바른 양치법,\n이렇게 하세요',
    img: '/magazineC1.jpg',
    tag: '구강관리',
  },
  {
    id: 'm2',
    title: '스케일링 주기,\n어떻게 잡을까?',
    img: '/magazineC2.jpg',
    tag: '치료정보',
  },
  {
    id: 'm3',
    title: '치아 미백의\n모든 것',
    img: '/magazineC3.jpg',
    tag: '미용',
  },
];


/* ────────────────────────────────────────
   컨텐츠 pc에서 가로스크롤 가능하게
──────────────────────────────────────── */
const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 2.5; // 배율 높이면 더 빠르게
    if (ref.current) ref.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
     isDragging.current = false; 
     if (ref.current) ref.current.style.cursor = 'grab';
    };

  return { ref, onMouseDown, onMouseMove, onMouseLeave: onMouseUp, onMouseUp };
};



/* ────────────────────────────────────────
   Home Page
──────────────────────────────────────── */
export default function HomePage() {
  const treatmentScroll = useDragScroll();
  const magazineScroll = useDragScroll();

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

      <main className="page-container" style={{ background: 'var(--color-background)', padding:'0' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* ── Hero Banner ── */}
          <section
            style={{
              background: 'linear-gradient(135deg, #78a5e9 0%, #6192DA 100%)',
              padding: '28px 24px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: 243,
              display: 'flex',
              justifyContent: 'space-between',
              userSelect: 'none',

              marginLeft:-20,
              marginRight:-20,
            }}
          >


            {/* Text content */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <p
                style={{
                  fontSize: 'var(--font-md)',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 300,
                  marginBottom: 3,
                }}
              >
                지금 치과 가야 할까?
              </p>
              <h2
                style={{
                  fontSize: 'var(--font-title)',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  lineHeight: 1.35,
                  marginBottom: 46,
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
                  padding: '12px 16px',
                  background: '#FFFFFF',
                  color: 'var(--color-text-primary)',
                  fontWeight: 300,
                  fontSize: 'var(--font-lg)',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
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
                width: 140,
                minHeight: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >

              <Image
                src="/pageHero.png"
                alt="샘플"
                width={185}
                height={211}
                draggable="false"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "400px",
                }}
              />

            </div>
          </section>

          {/* ── Recent Visit Card ── */}
          <section
            onClick={() => router.push('/records')}
            style={{
              marginTop: 'var(--spacing-xl)',
              background: 'var(--color-background-white)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'start',
              gap: 14,
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease',
              border:'1px solid var(--color-border)'
            }}
          >
            {/* Shield / tooth icon */}
            <div
              draggable="false"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                background:'#fafafa',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginTop:-8
              }}
            >
              <Image
                draggable="false"
                src="/recentLogo.png"
                alt="최근방문치과로고"
                width={48}
                height={48}
                style={{ width: '60%', height: 'auto', objectFit: 'contain', userSelect: 'none'}}
              />
              
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 'var(--font-xxl)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 400,
                  marginBottom: 2,
                  userSelect: 'none',
                }}
              >
                최근 방문치과
              </p>
              <p style={{ fontSize: 'var(--font-xl)', color: 'var(--color-text-primary)', userSelect: 'none' }}>
                <span style={{ fontSize: 'var(--font-hero2)', color: 'var(--color-text-primary)', fontWeight: 300 }}>180</span>
                <span style={{ fontSize: 'var(--font-md)', fontWeight: 300, color: 'var(--color-text-primary)', marginLeft: 4 }}>
                  일 경과
                </span>
              </p>
            </div>

            {/* Arrow */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </section>

          {/* ── Treatment Info Section ── */}
          <section style={{ marginTop: 'var(--spacing-xxl3)' }}>
            <h3
              style={{
                fontSize: 'var(--font-xxl)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
                userSelect: 'none',
              }}
            >
              치료 정보
            </h3>

            <div
              ref={treatmentScroll.ref}
              onMouseDown={treatmentScroll.onMouseDown}
              onMouseMove={treatmentScroll.onMouseMove}
              onMouseLeave={treatmentScroll.onMouseLeave}
              onMouseUp={treatmentScroll.onMouseUp}
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 4,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',  
                userSelect: 'none',
                cursor: 'grab',
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
                      width: 68,
                      height: 68,
                      borderRadius: 'var(--radius-sm)',
                      background: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s ease',
                      overflow: 'hidden', 
                      position: 'relative',
                    }}
                  >

                   <Image
                      src={`/${item.id}.jpg`} alt={item.label}
                      fill
                      draggable="false"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    /> 
                    
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
          <section style={{ marginTop: 'var(--spacing-xxl3)', marginBottom:'var(--spacing-xxl3)' }}>
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
                  fontSize: 'var(--font-xxl)',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  userSelect: 'none',
                }}
              >
                매거진
              </h3>
              <button
                onClick={() => router.push('/magazine')}
                style={{
                  fontSize: 'var(--font-md)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 300,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                더보기
              </button>
            </div>

            <div
              ref={magazineScroll.ref}
              onMouseDown={magazineScroll.onMouseDown}
              onMouseMove={magazineScroll.onMouseMove}
              onMouseLeave={magazineScroll.onMouseLeave}
              onMouseUp={magazineScroll.onMouseUp}
              style={{
                display: 'flex',
                gap: 10,
                overflowX: 'auto',
                paddingBottom: 8,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                cursor: 'grab',
              }}
            >
              {magazineItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push('/magazine/' + item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') router.push('/magazine/' + item.id); }}
                  draggable="false"
                  style={{
                    flexShrink: 0,
                    width: 200,
                    borderRadius: 'var(--radius-md)',
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
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      padding: 12,
                      position: 'relative',
                      overflow:'hidden'
                    }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      draggable="false"
                      style={{ objectFit: 'cover', objectPosition: 'center', userSelect: 'none' }}
                    />
                   
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        fontSize: 'var(--font-xs)',
                        fontWeight: 500,
                        color: 'white',
                        background: 'rgba(0,0,0,0.5)',
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
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.4,
                        whiteSpace: 'pre-line',
                        userSelect: 'none'
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
