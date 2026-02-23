'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Card from '@/components/Card';
import { SearchIcon, MapPinIcon, StarIcon, HeartIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Mock Data
──────────────────────────────────────── */
const filterOptions = ['거리순', '평점순', '리뷰많은순', '야간진료', '주말진료'];

const mockClinics = [
  {
    id: '1',
    name: '서울밝은치과',
    rating: 4.8,
    reviewCount: 312,
    address: '서울시 강남구 테헤란로 123',
    distance: '150m',
    isOpen: true,
    hours: '09:00 - 21:00',
    specialties: ['임플란트', '교정'],
    bookmarked: false,
  },
  {
    id: '2',
    name: '강남연세치과의원',
    rating: 4.5,
    reviewCount: 256,
    address: '서울시 강남구 역삼동 456-7',
    distance: '350m',
    isOpen: true,
    hours: '09:00 - 18:30',
    specialties: ['신경치료', '보철'],
    bookmarked: true,
  },
  {
    id: '3',
    name: '미소가득치과',
    rating: 4.7,
    reviewCount: 189,
    address: '서울시 강남구 선릉로 89길 15',
    distance: '520m',
    isOpen: false,
    hours: '10:00 - 19:00',
    specialties: ['미백', '레진'],
    bookmarked: false,
  },
  {
    id: '4',
    name: '플러스치과의원',
    rating: 4.3,
    reviewCount: 128,
    address: '서울시 강남구 봉은사로 201',
    distance: '780m',
    isOpen: true,
    hours: '09:30 - 20:00',
    specialties: ['스케일링', '충치치료'],
    bookmarked: false,
  },
  {
    id: '5',
    name: '뉴욕플란트치과',
    rating: 4.9,
    reviewCount: 467,
    address: '서울시 강남구 삼성로 100길 8',
    distance: '1.2km',
    isOpen: true,
    hours: '09:00 - 22:00',
    specialties: ['임플란트', '치아교정'],
    bookmarked: true,
  },
];

/* ────────────────────────────────────────
   Search Page
──────────────────────────────────────── */
export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('거리순');
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(
    Object.fromEntries(mockClinics.map((c) => [c.id, c.bookmarked]))
  );

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /** Parse distance string like "150m" or "1.2km" to meters */
  const parseDistance = (d: string): number => {
    if (d.endsWith('km')) return parseFloat(d) * 1000;
    return parseFloat(d);
  };

  /** Parse closing hour from hours string like "09:00 - 21:00" */
  const parseClosingHour = (hours: string): number => {
    const parts = hours.split('-');
    if (parts.length < 2) return 0;
    const closing = parts[1].trim();
    const [h] = closing.split(':').map(Number);
    return h;
  };

  const filteredClinics = useMemo(() => {
    // 1) Text search filter
    const query = searchQuery.trim().toLowerCase();
    let result = mockClinics.filter((c) => {
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query)
      );
    });

    // 2) Special filters
    if (activeFilter === '야간진료') {
      result = result.filter((c) => parseClosingHour(c.hours) >= 21);
    }

    // 3) Sorting
    if (activeFilter === '거리순') {
      result = [...result].sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    } else if (activeFilter === '평점순') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === '리뷰많은순') {
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, activeFilter]);

  return (
    <>
      <Header title="치과검색" showBack={false} showNotification={false} showProfile={false} />

      <main className="page-container" style={{ background: 'var(--color-background)' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* Search Bar */}
          <div
            style={{
              marginTop: 'var(--spacing-xl)',
              paddingTop: 'var(--spacing-sm)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SearchIcon size={20} color="var(--color-text-tertiary)" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="치과명, 지역 검색"
              style={{
                width: '100%',
                height: 48,
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-background-white)',
                padding: '0 16px 0 44px',
                fontSize: 'var(--font-base)',
                color: 'var(--color-text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginTop: 'var(--spacing-md)',
              overflowX: 'auto',
              paddingBottom: 4,
              scrollbarWidth: 'none',
            }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  flexShrink: 0,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  border: activeFilter === filter ? 'none' : '1px solid var(--color-border)',
                  background: activeFilter === filter ? 'var(--color-primary)' : 'var(--color-background-white)',
                  color: activeFilter === filter ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Map Placeholder */}
          <div
            style={{
              marginTop: 'var(--spacing-lg)',
              height: 200,
              borderRadius: 'var(--radius-card)',
              background: 'linear-gradient(135deg, #E8EDF2 0%, #D5DCE4 50%, #C8D1DB 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Grid lines for map effect */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.6,
              }}
            />
            {/* Road lines */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: 0,
                right: 0,
                height: 3,
                background: 'rgba(255,255,255,0.5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '55%',
                width: 3,
                background: 'rgba(255,255,255,0.5)',
              }}
            />

            {/* Map pin markers */}
            <div style={{ position: 'absolute', top: 35, left: '30%' }}>
              <MapPinIcon size={20} color="var(--color-primary)" />
            </div>
            <div style={{ position: 'absolute', top: 70, left: '65%' }}>
              <MapPinIcon size={20} color="var(--color-danger)" />
            </div>
            <div style={{ position: 'absolute', top: 120, left: '25%' }}>
              <MapPinIcon size={16} color="var(--color-text-tertiary)" />
            </div>
            <div style={{ position: 'absolute', top: 50, right: '15%' }}>
              <MapPinIcon size={16} color="var(--color-text-tertiary)" />
            </div>

            {/* Center icon */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <MapPinIcon size={32} color="var(--color-text-secondary)" />
            </div>
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              }}
            >
              지도 영역
            </span>
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 'var(--font-xs)',
                color: 'var(--color-text-tertiary)',
                fontWeight: 400,
                marginTop: 2,
              }}
            >
              지도 서비스 연동 예정
            </span>

            {/* Current Location Button */}
            <button
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-background-white)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-primary)',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
              현재 위치
            </button>
          </div>

          {/* Nearby Clinics Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'var(--spacing-xl)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-xl)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              내 주변 치과
            </h3>
            <span
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              총 {filteredClinics.length}개
            </span>
          </div>

          {/* Clinic Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
            {filteredClinics.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  color: 'var(--color-text-tertiary)',
                  fontSize: 'var(--font-base)',
                }}
              >
                검색 결과가 없습니다
              </div>
            )}
            {filteredClinics.map((clinic) => (
              <Card
                key={clinic.id}
                onClick={() => router.push(`/search/${clinic.id}`)}
                padding="16px"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name and rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <h4
                        style={{
                          fontSize: 'var(--font-lg)',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {clinic.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                        <StarIcon size={14} color="#FBBF24" />
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
                    </div>

                    {/* Review count and distance */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)' }}>
                        리뷰 {clinic.reviewCount}개
                      </span>
                      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-border)' }}>|</span>
                      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>
                        {clinic.distance}
                      </span>
                    </div>

                    {/* Address */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      <MapPinIcon size={13} color="var(--color-text-tertiary)" />
                      <span
                        style={{
                          fontSize: 'var(--font-sm)',
                          color: 'var(--color-text-secondary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {clinic.address}
                      </span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--font-xs)',
                          fontWeight: 600,
                          background: clinic.isOpen ? '#E8F5E9' : '#FFEBEE',
                          color: clinic.isOpen ? 'var(--color-success)' : 'var(--color-danger)',
                        }}
                      >
                        {clinic.isOpen ? '진료중' : '진료종료'}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-xs)',
                          color: 'var(--color-text-tertiary)',
                        }}
                      >
                        {clinic.hours}
                      </span>
                    </div>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(clinic.id);
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-full)',
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                    aria-label="즐겨찾기"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={bookmarks[clinic.id] ? '#F44336' : 'none'}
                      stroke={bookmarks[clinic.id] ? '#F44336' : 'var(--color-text-tertiary)'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61C20.33 4.1 19.72 3.7 19.05 3.44C18.38 3.18 17.67 3.04 16.95 3.04C16.23 3.04 15.52 3.18 14.85 3.44C14.18 3.7 13.57 4.1 13.06 4.61L12 5.67L10.94 4.61C9.9 3.57 8.5 2.99 7.05 2.99C5.6 2.99 4.2 3.57 3.16 4.61C2.12 5.65 1.54 7.05 1.54 8.5C1.54 9.95 2.12 11.35 3.16 12.39L12 21.23L20.84 12.39C21.35 11.88 21.75 11.27 22.01 10.6C22.27 9.93 22.41 9.22 22.41 8.5C22.41 7.78 22.27 7.07 22.01 6.4C21.75 5.73 21.35 5.12 20.84 4.61Z" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <TabBar />
    </>
  );
}
