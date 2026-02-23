'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ChevronRightIcon } from '@/components/Icons';
import Card from '@/components/Card';

interface TreatmentItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const treatments: TreatmentItem[] = [
  {
    id: 'scaling',
    name: '스케일링',
    emoji: '🪥',
    color: '#4A90D9',
    description: '치석 및 치태 제거',
  },
  {
    id: 'resin',
    name: '레진',
    emoji: '🦷',
    color: '#5CC6BA',
    description: '충치 부위 충전 치료',
  },
  {
    id: 'inlay',
    name: '인레이',
    emoji: '🔶',
    color: '#FF9800',
    description: '정밀 맞춤형 충전물',
  },
  {
    id: 'root-canal',
    name: '신경치료',
    emoji: '🩺',
    color: '#F44336',
    description: '신경 염증 제거 치료',
  },
  {
    id: 'crown',
    name: '크라운',
    emoji: '👑',
    color: '#9C27B0',
    description: '치아 전체 씌우기',
  },
  {
    id: 'extraction',
    name: '발치',
    emoji: '🔧',
    color: '#607D8B',
    description: '치아 발거 시술',
  },
  {
    id: 'implant',
    name: '임플란트',
    emoji: '⚙️',
    color: '#3F51B5',
    description: '인공 치아 식립',
  },
  {
    id: 'dentures',
    name: '틀니',
    emoji: '🫧',
    color: '#00BCD4',
    description: '탈부착식 보철물',
  },
];

export default function TreatmentListPage() {
  const router = useRouter();

  return (
    <div className="page-container-no-tab">
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
          gap: '12px',
          padding: '0 var(--spacing-lg)',
          background: 'var(--color-background-white)',
          zIndex: 200,
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
            borderRadius: 'var(--radius-full)',
          }}
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon size={22} color="var(--color-text-primary)" />
        </button>
        <h1
          style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          치료 정보
        </h1>
      </header>

      {/* Content */}
      <div style={{ padding: 'var(--spacing-xl)' }}>
        {/* Intro text */}
        <p
          style={{
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xl)',
            lineHeight: 1.6,
          }}
        >
          치과에서 받을 수 있는 주요 치료들을 알아보세요. 치료 과정, 통증 정도, 비용까지 한눈에 확인할 수 있습니다.
        </p>

        {/* Treatment Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)',
          }}
        >
          {treatments.map((treatment) => (
            <Card
              key={treatment.id}
              onClick={() => router.push(`/treatment/${treatment.id}`)}
              padding="var(--spacing-lg)"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 'var(--spacing-md)',
                position: 'relative',
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-lg)',
                  background: `${treatment.color}14`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                {treatment.emoji}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '4px',
                  }}
                >
                  {treatment.name}
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {treatment.description}
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  position: 'absolute',
                  top: 'var(--spacing-lg)',
                  right: 'var(--spacing-md)',
                }}
              >
                <ChevronRightIcon size={16} color="var(--color-text-tertiary)" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
