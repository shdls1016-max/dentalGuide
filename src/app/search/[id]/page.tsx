'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { MapPinIcon, StarIcon, HeartIcon, CalendarIcon, ChevronRightIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Mock Clinic Data
──────────────────────────────────────── */
const clinicData: Record<string, {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  hours: { day: string; time: string }[];
  services: string[];
  equipment: string[];
  parking: string;
  reviews: { author: string; rating: number; date: string; text: string; treatment: string }[];
  treatments: { name: string; price: string; description: string }[];
}> = {
  '1': {
    name: '서울밝은치과',
    rating: 4.8,
    reviewCount: 312,
    address: '서울시 강남구 테헤란로 123, 3층',
    phone: '02-555-1234',
    hours: [
      { day: '월요일', time: '09:00 - 21:00' },
      { day: '화요일', time: '09:00 - 21:00' },
      { day: '수요일', time: '09:00 - 21:00' },
      { day: '목요일', time: '09:00 - 21:00' },
      { day: '금요일', time: '09:00 - 21:00' },
      { day: '토요일', time: '09:00 - 14:00' },
      { day: '일요일', time: '휴진' },
    ],
    services: ['일반진료', '임플란트', '치아교정', '미백', '라미네이트', '소아치과'],
    equipment: ['3D CT', '디지털 엑스레이', '구강스캐너', '레이저 장비'],
    parking: '건물 지하주차장 이용 가능 (2시간 무료)',
    reviews: [
      { author: '김**', rating: 5, date: '2025.01.15', text: '의사 선생님이 정말 친절하시고 꼼꼼하게 설명해주셔서 안심하고 치료받았습니다. 시설도 깨끗하고 대기 시간도 짧았어요.', treatment: '임플란트' },
      { author: '이**', rating: 4, date: '2025.01.10', text: '스케일링 받으러 갔는데 빠르고 깔끔하게 해주셨습니다. 다만 주차가 좀 불편했어요.', treatment: '스케일링' },
      { author: '박**', rating: 5, date: '2025.01.05', text: '교정 상담 받았는데 여러 옵션을 자세히 설명해주시고 강압적이지 않아서 좋았습니다.', treatment: '치아교정' },
    ],
    treatments: [
      { name: '스케일링', price: '보험적용 시 15,000원~', description: '치석 및 치태 제거' },
      { name: '레진 충전', price: '80,000원~', description: '충치 부위 레진 충전 치료' },
      { name: '인레이', price: '200,000원~', description: '세라믹/골드 인레이' },
      { name: '크라운', price: '350,000원~', description: 'PFM/지르코니아 크라운' },
      { name: '임플란트', price: '1,200,000원~', description: '1개 기준, 브랜드별 상이' },
      { name: '치아교정', price: '3,000,000원~', description: '메탈/세라믹/투명교정' },
      { name: '미백', price: '200,000원~', description: '전문가 미백 (상/하악)' },
      { name: '신경치료', price: '보험적용', description: '근관치료' },
    ],
  },
};

const defaultClinic = clinicData['1'];

/* ────────────────────────────────────────
   Clinic Detail Page
──────────────────────────────────────── */
export default function ClinicDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const clinic = clinicData[id] || defaultClinic;

  const [activeTab, setActiveTab] = useState<'info' | 'review' | 'treatment'>('info');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const tabs = [
    { key: 'info' as const, label: '정보' },
    { key: 'review' as const, label: '리뷰' },
    { key: 'treatment' as const, label: '치료항목' },
  ];

  return (
    <>
      <Header
        title={clinic.name}
        showBack
        onBack={() => router.back()}
        showNotification={false}
        showProfile={false}
      />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)', paddingBottom: 100 }}>
        {/* Hero Image Placeholder */}
        <div
          style={{
            width: '100%',
            height: 220,
            background: 'linear-gradient(135deg, #4A90D9 0%, #357ABD 50%, #2E6DB4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -30,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              left: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }}
          />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C9.5 2 7.5 3.5 7 5.5C6.5 7.5 5.5 9 4.5 11C3.5 13 3 15 4 17C5 19 6 21 8 21C9 21 10 20 10.5 18.5C11 17 11.5 16 12 16C12.5 16 13 17 13.5 18.5C14 20 15 21 16 21C18 21 19 19 20 17C21 15 20.5 13 19.5 11C18.5 9 17.5 7.5 17 5.5C16.5 3.5 14.5 2 12 2Z"
                fill="rgba(255,255,255,0.9)"
              />
            </svg>
            <p style={{ fontSize: 'var(--font-sm)', color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
              치과 사진
            </p>
          </div>
        </div>

        <div style={{ padding: '0 var(--spacing-xl)' }}>
          {/* Clinic Info Card */}
          <Card style={{ marginTop: -30, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h2 style={{ fontSize: 'var(--font-xxl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {clinic.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <StarIcon size={18} color="#FBBF24" />
                <span style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {clinic.rating}
                </span>
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)', marginLeft: 2 }}>
                  ({clinic.reviewCount})
                </span>
              </div>
            </div>

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <MapPinIcon size={16} color="var(--color-text-tertiary)" />
              <span style={{ fontSize: 'var(--font-md)', color: 'var(--color-text-secondary)' }}>
                {clinic.address}
              </span>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span style={{ fontSize: 'var(--font-md)', color: 'var(--color-primary)', fontWeight: 500 }}>
                {clinic.phone}
              </span>
            </div>

            {/* Operating Hours */}
            <div
              style={{
                background: 'var(--color-background)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6V12L16 14" />
                </svg>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  진료시간
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {clinic.hours.map((h) => (
                  <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)', minWidth: 52 }}>
                      {h.day}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-sm)',
                        fontWeight: 500,
                        color: h.time === '휴진' ? 'var(--color-danger)' : 'var(--color-text-primary)',
                      }}
                    >
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 'var(--spacing-lg)',
            }}
          >
            <button
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '14px 0',
                background: 'var(--color-background-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                전화하기
              </span>
            </button>

            <button
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '14px 0',
                background: 'var(--color-background-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11L22 2L13 21L11 13L3 11Z" />
              </svg>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                길찾기
              </span>
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '14px 0',
                background: isBookmarked ? 'var(--color-primary-bg)' : 'var(--color-background-white)',
                borderRadius: 'var(--radius-lg)',
                border: isBookmarked ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={isBookmarked ? 'var(--color-primary)' : 'none'}
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61C20.33 4.1 19.72 3.7 19.05 3.44C18.38 3.18 17.67 3.04 16.95 3.04C16.23 3.04 15.52 3.18 14.85 3.44C14.18 3.7 13.57 4.1 13.06 4.61L12 5.67L10.94 4.61C9.9 3.57 8.5 2.99 7.05 2.99C5.6 2.99 4.2 3.57 3.16 4.61C2.12 5.65 1.54 7.05 1.54 8.5C1.54 9.95 2.12 11.35 3.16 12.39L12 21.23L20.84 12.39C21.35 11.88 21.75 11.27 22.01 10.6C22.27 9.93 22.41 9.22 22.41 8.5C22.41 7.78 22.27 7.07 22.01 6.4C21.75 5.73 21.35 5.12 20.84 4.61Z" />
              </svg>
              <span
                style={{
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-primary)',
                }}
              >
                즐겨찾기
              </span>
            </button>
          </div>

          {/* Tab Section */}
          <div
            style={{
              display: 'flex',
              marginTop: 'var(--spacing-xl)',
              borderBottom: '2px solid var(--color-border)',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  padding: '14px 0',
                  fontSize: 'var(--font-base)',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: -2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Services */}
                <Card padding="16px">
                  <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                    진료 과목
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {clinic.services.map((s) => (
                      <span
                        key={s}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-primary-bg)',
                          color: 'var(--color-primary)',
                          fontSize: 'var(--font-sm)',
                          fontWeight: 500,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Equipment */}
                <Card padding="16px">
                  <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>
                    보유 장비
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {clinic.equipment.map((e) => (
                      <div key={e} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17L4 12" />
                        </svg>
                        <span style={{ fontSize: 'var(--font-md)', color: 'var(--color-text-secondary)' }}>{e}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Parking */}
                <Card padding="16px">
                  <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>
                    주차 안내
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-text-tertiary)" stroke="none">P</text>
                    </svg>
                    <span style={{ fontSize: 'var(--font-md)', color: 'var(--color-text-secondary)' }}>
                      {clinic.parking}
                    </span>
                  </div>
                </Card>
              </div>
            )}

            {/* Review Tab */}
            {activeTab === 'review' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Summary */}
                <Card padding="16px">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 'var(--font-hero)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {clinic.rating}
                      </span>
                      <div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              size={18}
                              color={star <= Math.floor(clinic.rating) ? '#FBBF24' : '#E0E6ED'}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)' }}>
                          리뷰 {clinic.reviewCount}개
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/search/${id}/review`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 'var(--font-sm)',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      전체보기
                      <ChevronRightIcon size={16} color="var(--color-primary)" />
                    </button>
                  </div>
                </Card>

                {/* Recent Reviews */}
                {clinic.reviews.map((review, idx) => (
                  <Card key={idx} padding="16px">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-sm)',
                            fontWeight: 600,
                            color: 'var(--color-primary)',
                          }}
                        >
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {review.author}
                          </span>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon key={star} size={12} color={star <= review.rating ? '#FBBF24' : '#E0E6ED'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-tertiary)' }}>
                        {review.date}
                      </span>
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-primary-bg)',
                        color: 'var(--color-primary)',
                        fontSize: 'var(--font-xs)',
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      {review.treatment}
                    </span>
                    <p style={{ fontSize: 'var(--font-md)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {review.text}
                    </p>
                  </Card>
                ))}
              </div>
            )}

            {/* Treatment Tab */}
            {activeTab === 'treatment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {clinic.treatments.map((t, idx) => (
                  <Card key={idx} padding="14px 16px">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: 'var(--font-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                          {t.name}
                        </h4>
                        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)' }}>
                          {t.description}
                        </span>
                      </div>
                      <span style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-primary)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                        {t.price}
                      </span>
                    </div>
                  </Card>
                ))}

                <p
                  style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--color-text-tertiary)',
                    textAlign: 'center',
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  * 실제 치료비는 환자 상태에 따라 달라질 수 있습니다.
                  <br />
                  정확한 비용은 치과에 문의해주세요.
                </p>
              </div>
            )}
          </div>
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
          onClick={() => router.push(`/search/${id}/appointment`)}
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <CalendarIcon size={20} color="#FFFFFF" />
          예약하기
        </Button>
      </div>
    </>
  );
}
