'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { StarIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

/* ────────────────────────────────────────
   Types
──────────────────────────────────────── */
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  treatment: string;
  text: string;
  helpfulCount: number;
}

const sortOptions = ['최신순', '평점높은순', '평점낮은순'];

/* ────────────────────────────────────────
   Review List Page
──────────────────────────────────────── */
export default function ReviewListPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeSort, setActiveSort] = useState('최신순');
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('clinic_id', id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('리뷰 불러오기 실패:', error);
          return;
        }

        const mapped: Review[] = (data || []).map((row) => ({
          id: row.id,
          author: row.author ?? '익명',
          rating: row.rating,
          date: new Date(row.created_at).toISOString().slice(0, 10).replace(/-/g, '.'),
          treatment: row.treatment,
          text: row.content,
          helpfulCount: row.helpful_count ?? 0,
        }));

        setReviews(mapped);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  /* ── Computed values from fetched data ── */
  const totalReviews = reviews.length;

  const overallRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars],
      percentage: totalReviews > 0 ? Math.round((counts[stars] / totalReviews) * 100) : 0,
    }));
  }, [reviews, totalReviews]);

  /* ── Sorted reviews (client-side) ── */
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (activeSort) {
      case '최신순':
        sorted.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case '평점높은순':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case '평점낮은순':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
    }
    return sorted;
  }, [reviews, activeSort]);

  const toggleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  return (
    <>
      <Header
        title="리뷰"
        showBack
        onBack={() => router.back()}
        showNotification={false}
        showProfile={false}
      />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)', paddingBottom: 100 }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* Overall Rating Summary */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Big Rating Number */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '44px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1 }}>
                  {overallRating}
                </div>
                <div style={{ display: 'flex', gap: 3, marginTop: 8, justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={16}
                      color={star <= Math.floor(overallRating) ? '#FBBF24' : '#E0E6ED'}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-text-tertiary)',
                    marginTop: 4,
                  }}
                >
                  {totalReviews}개 리뷰
                </div>
              </div>

              {/* Distribution Bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ratingDistribution.map((item) => (
                  <div key={item.stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-tertiary)', minWidth: 12, textAlign: 'right' }}>
                      {item.stars}
                    </span>
                    <StarIcon size={12} color="#FBBF24" />
                    <div
                      style={{
                        flex: 1,
                        height: 8,
                        borderRadius: 4,
                        background: 'var(--color-border)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          height: '100%',
                          borderRadius: 4,
                          background: item.stars >= 4 ? '#FBBF24' : item.stars === 3 ? '#FFD54F' : '#FFB74D',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-tertiary)', minWidth: 28, textAlign: 'right' }}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Sort Filter */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveSort(opt)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  border: activeSort === opt ? 'none' : '1px solid var(--color-border)',
                  background: activeSort === opt ? 'var(--color-primary)' : 'var(--color-background-white)',
                  color: activeSort === opt ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Review Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-md)' }}>
                리뷰를 불러오는 중...
              </div>
            ) : sortedReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-md)' }}>
                아직 리뷰가 없습니다.
              </div>
            ) : (
              sortedReviews.map((review) => (
              <Card key={review.id} padding="16px">
                {/* Header: Author & Date */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
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
                      <div style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {review.author}
                      </div>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-tertiary)' }}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={14}
                      color={star <= review.rating ? '#FBBF24' : '#E0E6ED'}
                    />
                  ))}
                </div>

                {/* Treatment Tag */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-bg)',
                    color: 'var(--color-primary)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 500,
                    marginBottom: 10,
                  }}
                >
                  {review.treatment}
                </span>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: 'var(--font-md)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: 12,
                  }}
                >
                  {review.text}
                </p>

                {/* Helpful Button */}
                <button
                  onClick={() => toggleHelpful(review.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: helpfulReviews[review.id]
                      ? '1px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                    background: helpfulReviews[review.id] ? 'var(--color-primary-bg)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 'var(--font-sm)' }}>
                    {helpfulReviews[review.id] ? String.fromCodePoint(0x1F44D) : String.fromCodePoint(0x1F44D)}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-sm)',
                      color: helpfulReviews[review.id] ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                      fontWeight: helpfulReviews[review.id] ? 600 : 400,
                    }}
                  >
                    도움이 돼요 {review.helpfulCount + (helpfulReviews[review.id] ? 1 : 0)}
                  </span>
                </button>
              </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Floating Write Review Button */}
      <button
        onClick={() => router.push(`/search/${id}/review/write`)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: '50%',
          transform: 'translateX(calc(min(215px, 50vw - 24px)))',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 24px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary)',
          color: '#FFFFFF',
          fontSize: 'var(--font-base)',
          fontWeight: 600,
          boxShadow: '0 4px 16px rgba(74, 144, 217, 0.4)',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20H21" />
          <path d="M16.5 3.5C16.9 3.1 17.44 2.88 18 2.88C18.56 2.88 19.1 3.1 19.5 3.5C19.9 3.9 20.12 4.44 20.12 5C20.12 5.56 19.9 6.1 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" />
        </svg>
        리뷰 작성
      </button>
    </>
  );
}
