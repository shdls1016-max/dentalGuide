'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import {
  HeartIcon,
  CommentIcon,
  StarIcon,
  MapPinIcon,
} from '@/components/Icons';

/* ────────────────────────────────────────
   탭 정의
──────────────────────────────────────── */
const TABS = [
  { key: 'posts', label: '작성글' },
  { key: 'comments', label: '댓글' },
  { key: 'reviews', label: '리뷰' },
  { key: 'bookmarks', label: '즐겨찾기' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/* ────────────────────────────────────────
   목 데이터
──────────────────────────────────────── */
const mockPosts = [
  {
    id: 1,
    title: '스케일링 후 잇몸에서 피가 나요',
    date: '2025.12.20',
    likes: 8,
    comments: 3,
  },
  {
    id: 2,
    title: '레진 치료 후기 공유합니다',
    date: '2025.12.15',
    likes: 15,
    comments: 7,
  },
  {
    id: 3,
    title: '교정 중 통증이 심한데 괜찮을까요?',
    date: '2025.12.10',
    likes: 22,
    comments: 12,
  },
  {
    id: 4,
    title: '사랑니 발치 경험담',
    date: '2025.12.05',
    likes: 31,
    comments: 18,
  },
];

const mockComments = [
  {
    id: 1,
    text: '저도 같은 증상이었어요. 잇몸약 처방받으시면 나아질 거예요.',
    postTitle: '잇몸이 자꾸 부어요',
    date: '2025.12.22',
  },
  {
    id: 2,
    text: '레진 시술 2일 정도 지나면 적응됩니다!',
    postTitle: '레진 치료 후 불편감',
    date: '2025.12.18',
  },
  {
    id: 3,
    text: '정기적으로 스케일링 받으시는 걸 추천합니다.',
    postTitle: '치석이 잘 생기는 편인데요',
    date: '2025.12.12',
  },
];

const mockReviews = [
  {
    id: 1,
    clinicName: '서울밝은치과',
    rating: 5,
    text: '원장님이 친절하시고 설명을 자세히 해주셔서 좋았습니다. 시설도 깔끔하고 대기 시간도 짧았어요.',
    date: '2025.12.21',
  },
  {
    id: 2,
    clinicName: '강남미소치과',
    rating: 4,
    text: '스케일링 꼼꼼하게 해주셨어요. 주차가 조금 불편한 점 빼면 만족합니다.',
    date: '2025.12.14',
  },
  {
    id: 3,
    clinicName: '하나치과의원',
    rating: 4,
    text: '응급으로 갔는데 빠르게 치료해주셔서 감사합니다.',
    date: '2025.12.08',
  },
];

const mockBookmarks = [
  {
    id: 1,
    name: '서울밝은치과',
    address: '서울시 강남구 테헤란로 123',
    rating: 4.8,
  },
  {
    id: 2,
    name: '강남미소치과',
    address: '서울시 강남구 역삼동 456',
    rating: 4.5,
  },
  {
    id: 3,
    name: '하나치과의원',
    address: '서울시 서초구 서초대로 789',
    rating: 4.6,
  },
  {
    id: 4,
    name: '연세좋은치과',
    address: '서울시 마포구 홍대입구 321',
    rating: 4.9,
  },
];

/* ────────────────────────────────────────
   내 활동 페이지
──────────────────────────────────────── */
function ActivityContent() {
  const searchParams = useSearchParams();
  const defaultTab = (searchParams.get('tab') as TabKey) || 'posts';
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  /* ── 별점 렌더링 ── */
  const renderStars = (count: number) => (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          size={14}
          color={i < count ? '#FFB300' : 'var(--color-border)'}
        />
      ))}
    </div>
  );

  /* ── 빈 상태 ── */
  const emptyMessages: Record<TabKey, string> = useMemo(
    () => ({
      posts: '아직 작성한 글이 없습니다.',
      comments: '아직 작성한 댓글이 없습니다.',
      reviews: '아직 작성한 리뷰가 없습니다.',
      bookmarks: '즐겨찾기한 치과가 없습니다.',
    }),
    [],
  );

  const renderEmpty = (tab: TabKey) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0',
        gap: 'var(--spacing-sm)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        {tab === 'posts' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4V20C4 20.53 4.21 21.04 4.59 21.41C4.96 21.79 5.47 22 6 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V8L14 2Z" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {tab === 'comments' && <CommentIcon size={24} color="var(--color-text-tertiary)" />}
        {tab === 'reviews' && <StarIcon size={24} color="var(--color-text-tertiary)" />}
        {tab === 'bookmarks' && <HeartIcon size={24} color="var(--color-text-tertiary)" />}
      </div>
      <p
        style={{
          fontSize: 'var(--font-md)',
          color: 'var(--color-text-tertiary)',
          textAlign: 'center',
        }}
      >
        {emptyMessages[tab]}
      </p>
    </div>
  );

  /* ── 작성글 탭 ── */
  const renderPosts = () =>
    mockPosts.length === 0
      ? renderEmpty('posts')
      : mockPosts.map((post, idx) => (
          <Card
            key={post.id}
            style={{
              marginBottom: idx < mockPosts.length - 1 ? 'var(--spacing-md)' : 0,
              padding: 'var(--spacing-lg)',
              cursor: 'pointer',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-base)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                lineHeight: 1.4,
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              {post.title}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {post.date}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <HeartIcon size={14} color="var(--color-text-tertiary)" />
                {post.likes}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <CommentIcon size={14} color="var(--color-text-tertiary)" />
                {post.comments}
              </div>
            </div>
          </Card>
        ));

  /* ── 댓글 탭 ── */
  const renderComments = () =>
    mockComments.length === 0
      ? renderEmpty('comments')
      : mockComments.map((comment, idx) => (
          <Card
            key={comment.id}
            style={{
              marginBottom: idx < mockComments.length - 1 ? 'var(--spacing-md)' : 0,
              padding: 'var(--spacing-lg)',
              cursor: 'pointer',
            }}
          >
            {/* 원글 참조 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              <CommentIcon size={13} color="var(--color-text-tertiary)" />
              <span
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {comment.postTitle}
              </span>
            </div>
            <p
              style={{
                fontSize: 'var(--font-base)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.5,
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              {comment.text}
            </p>
            <span
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {comment.date}
            </span>
          </Card>
        ));

  /* ── 리뷰 탭 ── */
  const renderReviews = () =>
    mockReviews.length === 0
      ? renderEmpty('reviews')
      : mockReviews.map((review, idx) => (
          <Card
            key={review.id}
            style={{
              marginBottom: idx < mockReviews.length - 1 ? 'var(--spacing-md)' : 0,
              padding: 'var(--spacing-lg)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-base)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                {review.clinicName}
              </span>
              {renderStars(review.rating)}
            </div>
            <p
              style={{
                fontSize: 'var(--font-md)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              {review.text}
            </p>
            <span
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {review.date}
            </span>
          </Card>
        ));

  /* ── 즐겨찾기 탭 ── */
  const renderBookmarks = () =>
    mockBookmarks.length === 0
      ? renderEmpty('bookmarks')
      : mockBookmarks.map((clinic, idx) => (
          <Card
            key={clinic.id}
            style={{
              marginBottom: idx < mockBookmarks.length - 1 ? 'var(--spacing-md)' : 0,
              padding: 'var(--spacing-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              cursor: 'pointer',
            }}
          >
            {/* 아이콘 */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPinIcon size={20} color="var(--color-primary)" />
            </div>

            {/* 정보 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 'var(--font-base)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 2,
                }}
              >
                {clinic.name}
              </p>
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {clinic.address}
              </p>
            </div>

            {/* 평점 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <StarIcon size={14} color="#FFB300" />
              <span
                style={{
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                {clinic.rating}
              </span>
            </div>
          </Card>
        ));

  /* ── 탭별 컨텐츠 매핑 ── */
  const tabContent: Record<TabKey, React.ReactNode> = {
    posts: renderPosts(),
    comments: renderComments(),
    reviews: renderReviews(),
    bookmarks: renderBookmarks(),
  };

  return (
    <>
      <Header title="내 활동" showBack />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)' }}>

        {/* ── 탭 바 ── */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-background-white)',
            borderBottom: '1px solid var(--color-border-light)',
            position: 'sticky',
            top: 'var(--header-height)',
            zIndex: 100,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '14px 0',
                fontSize: 'var(--font-md)',
                fontWeight: activeTab === tab.key ? 600 : 400,
                color:
                  activeTab === tab.key
                    ? 'var(--color-primary)'
                    : 'var(--color-text-tertiary)',
                background: 'none',
                borderBottom:
                  activeTab === tab.key
                    ? '2.5px solid var(--color-primary)'
                    : '2.5px solid transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 컨텐츠 ── */}
        <div style={{ padding: 'var(--spacing-lg) var(--spacing-xl)' }}>
          {tabContent[activeTab]}
        </div>

        {/* 하단 여백 */}
        <div style={{ height: 40 }} />
      </main>
    </>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-background-white)' }} />}>
      <ActivityContent />
    </Suspense>
  );
}
