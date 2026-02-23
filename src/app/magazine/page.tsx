'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

const articles = [
  {
    id: 'm1',
    title: '올바른 양치법, 이렇게 하세요',
    description: '바스법, 회전법 등 올바른 칫솔질 방법과 3분 양치의 중요성을 알아봅니다.',
    tag: '구강관리',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    date: '2025.03.01',
  },
  {
    id: 'm2',
    title: '스케일링 주기, 어떻게 잡을까?',
    description: '건강보험 적용 기준과 적절한 스케일링 주기, 필요한 신호를 정리했습니다.',
    tag: '치료정보',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    date: '2025.02.15',
  },
  {
    id: 'm3',
    title: '치아 미백의 모든 것',
    description: '자가 미백과 전문 미백의 차이, 비용, 유지 기간, 주의사항까지.',
    tag: '미용',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    date: '2025.02.01',
  },
  {
    id: 'm4',
    title: '잇몸 출혈, 무시하면 안 되는 이유',
    description: '양치할 때 피가 나는 원인과 치주질환의 초기 신호를 확인하세요.',
    tag: '구강관리',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    date: '2025.01.20',
  },
  {
    id: 'm5',
    title: '사랑니, 꼭 빼야 할까?',
    description: '사랑니 발치가 필요한 경우와 그렇지 않은 경우를 구분해봅니다.',
    tag: '치료정보',
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    date: '2025.01.10',
  },
  {
    id: 'm6',
    title: '임플란트 vs 브릿지, 뭐가 좋을까?',
    description: '두 보철 방식의 장단점, 비용, 수명을 비교 분석합니다.',
    tag: '치료정보',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    date: '2024.12.25',
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  구강관리: { bg: '#E8F0FE', text: '#4A90D9' },
  치료정보: { bg: '#E8F5E9', text: '#4CAF50' },
  미용: { bg: '#F3E5F5', text: '#AB47BC' },
};

export default function MagazineListPage() {
  const router = useRouter();

  return (
    <>
      <Header title="매거진" showBack showNotification={false} showProfile={false} />

      <main style={{ background: 'var(--color-background)', minHeight: '100vh' }}>
        <div
          style={{
            padding: 'var(--spacing-xl)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)',
          }}
        >
          {articles.map((article) => {
            const tagStyle = tagColors[article.tag] || { bg: '#F5F5F5', text: '#666' };
            return (
              <div
                key={article.id}
                onClick={() => router.push('/magazine/' + article.id)}
                style={{
                  background: 'var(--color-background-white)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '100%',
                    height: 100,
                    background: article.color,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: 'white',
                      background: 'rgba(0,0,0,0.2)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {article.tag}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        color: tagStyle.text,
                        background: tagStyle.bg,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {article.tag}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>
                      {article.date}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 'var(--font-md)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--font-xs)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {article.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
