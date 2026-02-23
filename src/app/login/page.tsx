'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ToothIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Social Login Button Component
──────────────────────────────────────── */
interface SocialButtonProps {
  label: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function SocialButton({ label, bgColor, textColor, icon, onClick }: SocialButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: bgColor,
        color: textColor,
        borderRadius: 12,
        border: 'none',
        fontSize: 'var(--font-base)',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Icon on the left */}
      <span
        style={{
          position: 'absolute',
          left: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </span>
      {/* Centered text */}
      {label}
    </button>
  );
}

/* ────────────────────────────────────────
   Kakao Icon
──────────────────────────────────────── */
function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C6.48 3 2 6.58 2 10.94C2 13.74 3.88 16.2 6.73 17.62L5.71 21.28C5.63 21.56 5.95 21.78 6.2 21.62L10.55 18.76C11.02 18.82 11.5 18.86 12 18.86C17.52 18.86 22 15.28 22 10.94C22 6.58 17.52 3 12 3Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

/* ────────────────────────────────────────
   Naver Icon
──────────────────────────────────────── */
function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M13.56 10.7L6.17 0H0V20H6.44V9.3L13.83 20H20V0H13.56V10.7Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* ────────────────────────────────────────
   Apple Icon
──────────────────────────────────────── */
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.05 20.28C15.98 21.36 14.82 21.17 13.7 20.68C12.52 20.18 11.44 20.15 10.19 20.68C8.63 21.36 7.81 21.17 6.87 20.28C1.55 14.73 2.33 6.26 8.56 5.95C10.05 6.03 11.1 6.78 11.98 6.84C13.25 6.58 14.47 5.81 15.84 5.91C17.47 6.04 18.7 6.7 19.5 7.87C16.18 9.86 16.96 14.21 20.03 15.52C19.4 17.13 18.56 18.71 17.05 20.29V20.28ZM11.87 5.88C11.7 3.74 13.4 1.98 15.4 1.82C15.69 4.28 13.2 6.13 11.87 5.88Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* ────────────────────────────────────────
   Login Page
──────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();

  const handleSocialLogin = () => {
    router.push('/signup');
  };

  const handleGuest = () => {
    router.push('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-background-white)',
        padding: '0 var(--spacing-xxl)',
      }}
    >
      {/* Top section: logo + welcome */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 80,
          paddingBottom: 20,
        }}
      >
        {/* Logo icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-primary-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <ToothIcon size={38} color="var(--color-primary)" />
        </div>

        {/* Logo text */}
        <p
          style={{
            fontSize: 'var(--font-md)',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '2px',
            marginBottom: 24,
          }}
        >
          DENTAL GUIDE
        </p>

        {/* Welcome title */}
        <h1
          style={{
            fontSize: 'var(--font-hero)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            marginBottom: 8,
          }}
        >
          반갑습니다!
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'var(--font-base)',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          소셜 계정으로 간편하게 시작하세요
        </p>
      </div>

      {/* Social login buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingBottom: 24,
        }}
      >
        {/* Kakao */}
        <SocialButton
          label="카카오로 시작하기"
          bgColor="#FEE500"
          textColor="#3C1E1E"
          icon={<KakaoIcon />}
          onClick={handleSocialLogin}
        />

        {/* Naver */}
        <SocialButton
          label="네이버로 시작하기"
          bgColor="#03C75A"
          textColor="#FFFFFF"
          icon={<NaverIcon />}
          onClick={handleSocialLogin}
        />

        {/* Apple */}
        <SocialButton
          label="Apple로 시작하기"
          bgColor="#000000"
          textColor="#FFFFFF"
          icon={<AppleIcon />}
          onClick={handleSocialLogin}
        />
      </div>

      {/* Bottom links */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          paddingBottom: 48,
        }}
      >
        {/* Guest link */}
        <button
          onClick={handleGuest}
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-tertiary)',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          로그인 없이 둘러보기
        </button>

        {/* Terms text */}
        <p
          style={{
            fontSize: 'var(--font-xs)',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          로그인 시{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>이용약관</span> 및{' '}
          <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>개인정보처리방침</span>에
          동의합니다.
        </p>
      </div>
    </div>
  );
}
