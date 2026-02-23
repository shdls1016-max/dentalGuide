'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToothIcon } from '@/components/Icons';

export default function SplashPage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    const fadeTimer = setTimeout(() => setVisible(true), 100);

    // Auto-redirect after 2 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/onboarding');
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #E8F0FE 0%, #D0E2FA 40%, #4A90D9 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background circles */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '-15%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '-10%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '45%',
          right: '5%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo icon area */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-background-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(74, 144, 217, 0.25)',
          }}
        >
          <ToothIcon size={52} color="var(--color-primary)" />
        </div>

        {/* Logo text */}
        <h1
          style={{
            fontSize: 'var(--font-hero)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.5px',
            marginTop: 4,
          }}
        >
          DENTAL GUIDE
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'var(--font-lg)',
            color: 'var(--color-text-secondary)',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          내 치아 건강, 스스로 챙기기
        </p>
      </div>

      {/* Loading dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          display: 'flex',
          gap: 8,
          opacity: visible ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              opacity: 0.4,
              animation: `splashPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Keyframe animation via style tag */}
      <style>{`
        @keyframes splashPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
