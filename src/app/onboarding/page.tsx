'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { ToothIcon, ClipboardIcon, MapPinIcon, HeartIcon, ArrowRightIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Onboarding slide data
──────────────────────────────────────── */
const slides = [
  {
    icon: ToothIcon,
    iconColor: '#4A90D9',
    bgColor: '#E8F0FE',
    title: '내 증상, 간단히 확인해보세요',
    description: '몇 가지 질문으로 치과 방문이 필요한지 알아볼 수 있어요',
  },
  {
    icon: ClipboardIcon,
    iconColor: '#5CC6BA',
    bgColor: '#E0F7F1',
    title: '치과 방문 기록을 관리하세요',
    description: '언제, 어떤 치료를 받았는지 한눈에 확인할 수 있어요',
  },
  {
    icon: MapPinIcon,
    iconColor: '#FF9800',
    bgColor: '#FFF3E0',
    title: '내 주변 치과를 찾아보세요',
    description: '리뷰와 평점으로 나에게 맞는 치과를 선택하세요',
  },
  {
    icon: HeartIcon,
    iconColor: '#EF5350',
    bgColor: '#FFEBEE',
    title: '걱정 마세요, 함께할게요',
    description: '치과가 무서운 분들을 위한 치료 과정 안내까지',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLastPage = currentPage === slides.length - 1;

  const goToPage = useCallback(
    (page: number) => {
      if (isAnimating || page < 0 || page >= slides.length) return;
      setIsAnimating(true);
      setCurrentPage(page);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating]
  );

  const handleNext = () => {
    if (isLastPage) {
      router.push('/login');
    } else {
      goToPage(currentPage + 1);
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  /* ── Touch handlers ── */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setTouchDelta(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = e.touches[0].clientX - touchStart;
    setTouchDelta(delta);
  };

  const handleTouchEnd = () => {
    if (touchStart === null) return;
    if (touchDelta < -50 && currentPage < slides.length - 1) {
      goToPage(currentPage + 1);
    } else if (touchDelta > 50 && currentPage > 0) {
      goToPage(currentPage - 1);
    }
    setTouchStart(null);
    setTouchDelta(0);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-background-white)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Skip button */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 20,
          zIndex: 10,
        }}
      >
        <button
          onClick={handleSkip}
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-tertiary)',
            fontWeight: 500,
            padding: '8px 12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          건너뛰기
        </button>
      </div>

      {/* Slide area */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        {/* Slides container with translateX animation */}
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(-${currentPage * 100}% + ${touchStart !== null ? touchDelta : 0}px))`,
              transition: touchStart !== null ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform',
            }}
          >
            {slides.map((slide, index) => {
              const IconComponent = slide.icon;
              return (
                <div
                  key={index}
                  style={{
                    minWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0 var(--spacing-xxl)',
                  }}
                >
                  {/* Illustration placeholder */}
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: slide.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 40,
                      boxShadow: `0 8px 32px ${slide.iconColor}20`,
                    }}
                  >
                    <IconComponent size={72} color={slide.iconColor} />
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: 'var(--font-title)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      textAlign: 'center',
                      lineHeight: 1.35,
                      marginBottom: 12,
                    }}
                  >
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 'var(--font-base)',
                      color: 'var(--color-text-secondary)',
                      textAlign: 'center',
                      lineHeight: 1.6,
                      maxWidth: 300,
                    }}
                  >
                    {slide.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom area: dots + button */}
      <div
        style={{
          padding: '0 var(--spacing-xxl) 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}
      >
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: 8 }}>
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => goToPage(index)}
              style={{
                width: index === currentPage ? 24 : 8,
                height: 8,
                borderRadius: 'var(--radius-full)',
                background:
                  index === currentPage
                    ? 'var(--color-primary)'
                    : 'var(--color-border)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Next / Start button */}
        <Button
          onClick={handleNext}
          variant="primary"
          size="lg"
          fullWidth
        >
          {isLastPage ? '시작하기' : '다음'}
          {!isLastPage && <ArrowRightIcon size={18} color="#FFFFFF" />}
        </Button>
      </div>
    </div>
  );
}
