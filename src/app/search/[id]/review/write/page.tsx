'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { StarIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

/* ────────────────────────────────────────
   Treatment Types
──────────────────────────────────────── */
const treatmentTypes = [
  '스케일링',
  '충치치료',
  '신경치료',
  '크라운',
  '임플란트',
  '치아교정',
  '미백',
  '발치',
  '잇몸치료',
  '기타',
];

/* ────────────────────────────────────────
   Write Review Page
──────────────────────────────────────── */
export default function WriteReviewPage() {
  const router = useRouter();
  const params = useParams();
  const clinicId = params.id as string;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = rating > 0 && selectedTreatment && reviewText.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        clinic_id: clinicId,
        author: '익명',
        rating,
        treatment: selectedTreatment,
        content: reviewText,
      });

      if (error) {
        throw error;
      }

      router.back();
    } catch (err) {
      console.error('리뷰 등록 실패:', err);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header
        title="리뷰 작성"
        showBack
        onBack={() => router.back()}
        showNotification={false}
        showProfile={false}
      />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)', paddingBottom: 120 }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* Star Rating Selector */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="24px">
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                진료는 어떠셨나요?
              </h3>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)', marginBottom: 20 }}>
                별점을 눌러 평가해주세요
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      padding: 4,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    }}
                    aria-label={`${star}점`}
                  >
                    <StarIcon
                      size={40}
                      color={(hoverRating || rating) >= star ? '#FBBF24' : '#E0E6ED'}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <span
                  style={{
                    fontSize: 'var(--font-md)',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  {rating === 5
                    ? '매우 만족해요!'
                    : rating === 4
                    ? '만족해요'
                    : rating === 3
                    ? '보통이에요'
                    : rating === 2
                    ? '별로예요'
                    : '매우 별로예요'}
                </span>
              )}
            </div>
          </Card>

          {/* Treatment Type Selector */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 14 }}>
              어떤 치료를 받으셨나요?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {treatmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTreatment(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 500,
                    border: selectedTreatment === type ? 'none' : '1px solid var(--color-border)',
                    background: selectedTreatment === type ? 'var(--color-primary)' : 'var(--color-background-white)',
                    color: selectedTreatment === type ? '#FFFFFF' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>

          {/* Review Text Area */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 14 }}>
              상세 후기
            </h3>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="치료 경험을 공유해주세요 (최소 10자)"
              style={{
                width: '100%',
                minHeight: 160,
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-background)',
                fontSize: 'var(--font-md)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-xs)',
                  color: reviewText.length < 10 ? 'var(--color-text-tertiary)' : 'var(--color-success)',
                }}
              >
                {reviewText.length}자
              </span>
            </div>
          </Card>
        </div>
      </main>

      {/* Fixed Bottom Button */}
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
          disabled={!isValid || submitting}
          onClick={handleSubmit}
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          {submitting ? '등록 중...' : '등록'}
        </Button>
      </div>
    </>
  );
}
