'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { ArrowLeftIcon, CheckIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Constants
──────────────────────────────────────── */
const genderOptions = ['남성', '여성', '선택안함'];

const treatmentOptions = [
  '스케일링',
  '충치치료',
  '교정',
  '미백',
  '임플란트',
  '기타',
];

const visitCycleOptions = [
  { label: '3개월', value: '3months' },
  { label: '6개월', value: '6months' },
  { label: '1년', value: '1year' },
  { label: '잘 안 감', value: 'rarely' },
];

/* ────────────────────────────────────────
   Shared input styles
──────────────────────────────────────── */
const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 10,
  border: '1.5px solid var(--color-border)',
  background: 'var(--color-background-white)',
  fontSize: 'var(--font-base)',
  color: 'var(--color-text-primary)',
  transition: 'border-color 0.2s ease',
  outline: 'none',
};

/* ────────────────────────────────────────
   Signup Page
──────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();

  /* Form state */
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [gender, setGender] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [visitCycle, setVisitCycle] = useState('');

  /* Focus tracking for border highlight */
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getFocusStyle = (fieldName: string): React.CSSProperties =>
    focusedField === fieldName
      ? { borderColor: 'var(--color-primary)' }
      : {};

  /* Treatment toggle */
  const toggleTreatment = (treatment: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(treatment)
        ? prev.filter((t) => t !== treatment)
        : [...prev, treatment]
    );
  };

  /* Submit handler */
  const handleSubmit = () => {
    router.push('/');
  };

  /* Validation: at minimum name is required */
  const isValid = name.trim().length > 0;

  /* Generate year/month/day options */
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-background-white)',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 'var(--header-height)',
          padding: '0 var(--spacing-lg)',
          position: 'sticky',
          top: 0,
          background: 'var(--color-background-white)',
          zIndex: 100,
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: -8,
          }}
          aria-label="뒤로 가기"
        >
          <ArrowLeftIcon size={22} color="var(--color-text-primary)" />
        </button>
        <h1
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginRight: 32,
          }}
        >
          회원가입
        </h1>
      </header>

      {/* ── Progress bar ── */}
      <div
        style={{
          height: 3,
          background: 'var(--color-border)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: '50%',
            background: 'var(--color-primary)',
            borderRadius: '0 2px 2px 0',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          padding: 'var(--spacing-xxl)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: 'var(--font-title)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 6,
          }}
        >
          추가 정보를 입력해주세요
        </h2>
        <p
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-tertiary)',
            marginBottom: 32,
          }}
        >
          더 나은 서비스를 위해 필요해요
        </p>

        {/* ── Form fields ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          {/* 이름 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 8,
              }}
            >
              이름 <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...inputBaseStyle,
                ...getFocusStyle('name'),
              }}
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 8,
              }}
            >
              생년월일
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Year */}
              <div style={{ flex: 1.2, position: 'relative' }}>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  onFocus={() => setFocusedField('year')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputBaseStyle,
                    appearance: 'none',
                    color: birthYear ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    ...getFocusStyle('year'),
                  }}
                >
                  <option value="">년</option>
                  {years.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}년
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                  }}
                >
                  ▼
                </span>
              </div>
              {/* Month */}
              <div style={{ flex: 1, position: 'relative' }}>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(e.target.value)}
                  onFocus={() => setFocusedField('month')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputBaseStyle,
                    appearance: 'none',
                    color: birthMonth ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    ...getFocusStyle('month'),
                  }}
                >
                  <option value="">월</option>
                  {months.map((m) => (
                    <option key={m} value={String(m)}>
                      {m}월
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                  }}
                >
                  ▼
                </span>
              </div>
              {/* Day */}
              <div style={{ flex: 1, position: 'relative' }}>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(e.target.value)}
                  onFocus={() => setFocusedField('day')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputBaseStyle,
                    appearance: 'none',
                    color: birthDay ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    ...getFocusStyle('day'),
                  }}
                >
                  <option value="">일</option>
                  {days.map((d) => (
                    <option key={d} value={String(d)}>
                      {d}일
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--color-text-tertiary)',
                    fontSize: 12,
                  }}
                >
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* 성별 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 8,
              }}
            >
              성별
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {genderOptions.map((option) => {
                const isSelected = gender === option;
                return (
                  <button
                    key={option}
                    onClick={() => setGender(option)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 10,
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'var(--color-primary-bg)' : 'var(--color-background-white)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontSize: 'var(--font-md)',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 관심 있는 치과 치료 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 8,
              }}
            >
              관심 있는 치과 치료
              <span
                style={{
                  fontSize: 'var(--font-xs)',
                  fontWeight: 400,
                  color: 'var(--color-text-tertiary)',
                  marginLeft: 6,
                }}
              >
                다중선택
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {treatmentOptions.map((treatment) => {
                const isSelected = selectedTreatments.includes(treatment);
                return (
                  <button
                    key={treatment}
                    onClick={() => toggleTreatment(treatment)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'var(--color-primary-bg)' : 'var(--color-background-white)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected && <CheckIcon size={14} color="var(--color-primary)" />}
                    {treatment}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 치과 방문 주기 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 8,
              }}
            >
              치과 방문 주기
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {visitCycleOptions.map((option) => {
                const isSelected = visitCycle === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setVisitCycle(option.value)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-full)',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: isSelected ? 'var(--color-primary-bg)' : 'var(--color-background-white)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Submit button ── */}
        <div style={{ paddingTop: 32, paddingBottom: 24 }}>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid}
          >
            가입 완료
          </Button>
        </div>
      </div>
    </div>
  );
}
