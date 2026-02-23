'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { UserIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   프로필 수정 페이지
──────────────────────────────────────── */
export default function EditProfilePage() {
  const router = useRouter();

  const [name, setName] = useState('김민수');
  const [email] = useState('minsu@example.com');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'none'>('none');

  const handleSave = () => {
    alert('프로필이 저장되었습니다.');
    router.back();
  };

  /* ── 공통 입력 필드 스타일 ── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    fontSize: 'var(--font-base)',
    color: 'var(--color-text-primary)',
    background: 'var(--color-background)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--spacing-sm)',
  };

  return (
    <>
      <Header
        title="프로필 수정"
        showBack
        rightAction={
          <button
            onClick={handleSave}
            style={{
              fontSize: 'var(--font-base)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            저장
          </button>
        }
      />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background-white)' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* ── 아바타 섹션 ── */}
          <section
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: '28px 0',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* 아바타 원 */}
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UserIcon size={42} color="var(--color-text-tertiary)" />
              </div>

              {/* 카메라 오버레이 */}
              <button
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary)',
                  border: '2.5px solid var(--color-background-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="사진 변경"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23 19C23 19.53 22.79 20.04 22.41 20.41C22.04 20.79 21.53 21 21 21H3C2.47 21 1.96 20.79 1.59 20.41C1.21 20.04 1 19.53 1 19V8C1 7.47 1.21 6.96 1.59 6.59C1.96 6.21 2.47 6 3 6H7L9 3H15L17 6H21C21.53 6 22.04 6.21 22.41 6.59C22.79 6.96 23 7.47 23 8V19Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            </div>

            <button
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              사진 변경
            </button>
          </section>

          {/* ── 폼 필드 ── */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
            {/* 이름 */}
            <div>
              <label style={labelStyle}>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                style={inputStyle}
              />
            </div>

            {/* 이메일 (비활성) */}
            <div>
              <label style={labelStyle}>이메일</label>
              <input
                type="email"
                value={email}
                disabled
                style={{
                  ...inputStyle,
                  color: 'var(--color-text-tertiary)',
                  background: 'var(--color-border-light)',
                  cursor: 'not-allowed',
                }}
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label style={labelStyle}>전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={inputStyle}
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label style={labelStyle}>생년월일</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                style={{
                  ...inputStyle,
                  colorScheme: 'light',
                }}
              />
            </div>

            {/* 성별 */}
            <div>
              <label style={labelStyle}>성별</label>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                {[
                  { value: 'male' as const, label: '남성' },
                  { value: 'female' as const, label: '여성' },
                  { value: 'none' as const, label: '선택안함' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value)}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      fontSize: 'var(--font-md)',
                      fontWeight: gender === option.value ? 600 : 400,
                      color:
                        gender === option.value
                          ? 'var(--color-primary)'
                          : 'var(--color-text-tertiary)',
                      background:
                        gender === option.value
                          ? 'var(--color-primary-bg)'
                          : 'var(--color-background)',
                      border:
                        gender === option.value
                          ? '1.5px solid var(--color-primary)'
                          : '1.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 하단 여백 */}
          <div style={{ height: 60 }} />
        </div>
      </main>
    </>
  );
}
