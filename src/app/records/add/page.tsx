'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { ArrowLeftIcon, CalendarIcon, ToothIcon, CheckIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────
interface FormData {
  visitDate: string;
  clinicName: string;
  treatmentType: string;
  treatedTeeth: string;
  memo: string;
  nextVisitDate: string;
}

interface FormErrors {
  visitDate?: string;
  clinicName?: string;
  treatmentType?: string;
  treatedTeeth?: string;
  memo?: string;
}

// ── Treatment types ──────────────────────────────────
const treatmentTypes = [
  '스케일링',
  '레진',
  '인레이',
  '신경치료',
  '크라운',
  '발치',
  '임플란트',
  '기타',
];

// ── Input Styles ─────────────────────────────────────
const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '10px',
  border: '1.5px solid var(--color-border)',
  fontSize: 'var(--font-base)',
  color: 'var(--color-text-primary)',
  background: 'var(--color-background-white)',
  transition: 'border-color 0.2s ease',
  fontFamily: 'inherit',
  outline: 'none',
};

const inputErrorStyle: React.CSSProperties = {
  ...inputBaseStyle,
  borderColor: 'var(--color-danger)',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--font-md)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  marginBottom: '8px',
  display: 'block',
};

// ── Component ────────────────────────────────────────
export default function AddRecordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    visitDate: '',
    clinicName: '',
    treatmentType: '',
    treatedTeeth: '',
    memo: '',
    nextVisitDate: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.visitDate) {
      newErrors.visitDate = '방문일을 선택해주세요';
    }
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = '치과명을 입력해주세요';
    }
    if (!formData.treatmentType) {
      newErrors.treatmentType = '치료 종류를 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!validate()) return;
    if (submitting) return;

    setSubmitting(true);

    const { error } = await supabase.from('records').insert({
      visit_date: formData.visitDate,
      clinic_name: formData.clinicName.trim(),
      treatment_type: formData.treatmentType,
      treated_teeth: formData.treatedTeeth,
      memo: formData.memo,
      next_visit_date: formData.nextVisitDate || null,
    });

    if (error) {
      console.error('Failed to insert record:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
      return;
    }

    router.push('/records');
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getInputStyle = (field: string): React.CSSProperties => {
    const hasError = submitted && errors[field as keyof FormErrors];
    const isFocused = focusedField === field;
    return {
      ...inputBaseStyle,
      borderColor: hasError
        ? 'var(--color-danger)'
        : isFocused
        ? 'var(--color-primary)'
        : 'var(--color-border)',
      boxShadow: isFocused ? '0 0 0 3px var(--color-primary-bg)' : 'none',
    };
  };

  return (
    <>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          maxWidth: 'var(--max-width)',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 var(--spacing-lg)',
          background: 'var(--color-background-white)',
          zIndex: 200,
          gap: '12px',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-full)',
          }}
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon size={22} color="var(--color-text-primary)" />
        </button>
        <span
          style={{
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          기록 추가
        </span>
      </header>

      <div className="page-container-no-tab">
        <div
          style={{
            padding: 'var(--spacing-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            paddingBottom: '120px',
          }}
        >
          {/* ── 방문일 (Visit Date) ─────────── */}
          <div>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarIcon size={16} color="var(--color-primary)" />
                방문일
                <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-sm)' }}>*</span>
              </span>
            </label>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => updateField('visitDate', e.target.value)}
              onFocus={() => setFocusedField('visitDate')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('visitDate')}
            />
            {submitted && errors.visitDate && (
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-danger)', marginTop: '6px' }}>
                {errors.visitDate}
              </p>
            )}
          </div>

          {/* ── 치과명 (Clinic Name) ────────── */}
          <div>
            <label style={labelStyle}>
              치과명
              <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-sm)', marginLeft: '4px' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="예: 서울밝은치과"
              value={formData.clinicName}
              onChange={(e) => updateField('clinicName', e.target.value)}
              onFocus={() => setFocusedField('clinicName')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('clinicName')}
            />
            {submitted && errors.clinicName && (
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-danger)', marginTop: '6px' }}>
                {errors.clinicName}
              </p>
            )}
          </div>

          {/* ── 치료 종류 (Treatment Type) ──── */}
          <div>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ToothIcon size={16} color="var(--color-primary)" />
                치료 종류
                <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-sm)' }}>*</span>
              </span>
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {treatmentTypes.map((type) => {
                const isSelected = formData.treatmentType === type;
                return (
                  <button
                    key={type}
                    onClick={() => updateField('treatmentType', type)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: isSelected ? 600 : 400,
                      background: isSelected ? 'var(--color-primary)' : 'var(--color-background-white)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      border: isSelected ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    {isSelected && (
                      <CheckIcon
                        size={14}
                        color="#FFFFFF"
                        style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }}
                      />
                    )}
                    {type}
                  </button>
                );
              })}
            </div>
            {submitted && errors.treatmentType && (
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-danger)', marginTop: '6px' }}>
                {errors.treatmentType}
              </p>
            )}
          </div>

          {/* ── 치료 부위 (Treated Teeth) ───── */}
          <div>
            <label style={labelStyle}>
              치료 부위
            </label>
            <input
              type="text"
              placeholder="예: 16, 36 (FDI 치아 번호)"
              value={formData.treatedTeeth}
              onChange={(e) => updateField('treatedTeeth', e.target.value)}
              onFocus={() => setFocusedField('treatedTeeth')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('treatedTeeth')}
            />
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-text-tertiary)',
                marginTop: '6px',
                lineHeight: 1.4,
              }}
            >
              FDI 표기법: 상악 우측(11-18), 상악 좌측(21-28), 하악 좌측(31-38), 하악 우측(41-48)
            </p>
            {/* Mini tooth reference diagram */}
            <div
              style={{
                marginTop: '10px',
                padding: '12px',
                background: 'var(--color-background)',
                borderRadius: '10px',
                overflowX: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1px',
                  fontSize: '9px',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <div style={{ display: 'flex', gap: '1px' }}>
                  {[18, 17, 16, 15, 14, 13, 12, 11].map((n) => (
                    <span
                      key={n}
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        background: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary-bg)'
                          : 'transparent',
                        color: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary)'
                          : 'var(--color-text-tertiary)',
                        fontWeight: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 700
                          : 400,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                  <span style={{ width: 4 }} />
                  {[21, 22, 23, 24, 25, 26, 27, 28].map((n) => (
                    <span
                      key={n}
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        background: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary-bg)'
                          : 'transparent',
                        color: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary)'
                          : 'var(--color-text-tertiary)',
                        fontWeight: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 700
                          : 400,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 1,
                    background: 'var(--color-border)',
                    margin: '1px 0',
                  }}
                />
                <div style={{ display: 'flex', gap: '1px' }}>
                  {[48, 47, 46, 45, 44, 43, 42, 41].map((n) => (
                    <span
                      key={n}
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        background: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary-bg)'
                          : 'transparent',
                        color: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary)'
                          : 'var(--color-text-tertiary)',
                        fontWeight: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 700
                          : 400,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                  <span style={{ width: 4 }} />
                  {[31, 32, 33, 34, 35, 36, 37, 38].map((n) => (
                    <span
                      key={n}
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        background: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary-bg)'
                          : 'transparent',
                        color: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 'var(--color-primary)'
                          : 'var(--color-text-tertiary)',
                        fontWeight: formData.treatedTeeth.split(',').map((s) => s.trim()).includes(String(n))
                          ? 700
                          : 400,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── 메모 (Memo) ────────────────── */}
          <div>
            <label style={labelStyle}>메모</label>
            <textarea
              placeholder="치료 내용, 의사 소견 등을 자유롭게 기록하세요"
              value={formData.memo}
              onChange={(e) => updateField('memo', e.target.value)}
              onFocus={() => setFocusedField('memo')}
              onBlur={() => setFocusedField(null)}
              rows={4}
              style={{
                ...getInputStyle('memo'),
                resize: 'vertical',
                minHeight: '120px',
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* ── 다음 방문 예정일 (Next Visit) ── */}
          <div>
            <label style={labelStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarIcon size={16} color="var(--color-text-tertiary)" />
                다음 방문 예정일
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-tertiary)',
                    fontWeight: 400,
                  }}
                >
                  (선택)
                </span>
              </span>
            </label>
            <input
              type="date"
              value={formData.nextVisitDate}
              onChange={(e) => updateField('nextVisitDate', e.target.value)}
              onFocus={() => setFocusedField('nextVisitDate')}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle('nextVisitDate')}
            />
          </div>
        </div>

        {/* ── Submit Button (fixed bottom) ──── */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 'var(--max-width)',
            padding: '12px var(--spacing-xl)',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            background: 'var(--color-background-white)',
            borderTop: '1px solid var(--color-border-light)',
            zIndex: 100,
          }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </>
  );
}
