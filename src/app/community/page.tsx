'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TabBar from '@/components/TabBar';
import { SearchIcon, HeartIcon, CommentIcon, PlusIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

/* ────────────────────────────────────────
   카테고리 데이터
──────────────────────────────────────── */
const categories = [
  { id: 'all', label: '전체' },
  { id: 'question', label: '질문' },
  { id: 'review', label: '후기' },
  { id: 'info', label: '정보공유' },
  { id: 'free', label: '자유' },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  question: { bg: '#E8F0FE', text: '#4A90D9' },
  review: { bg: '#E8F5E9', text: '#4CAF50' },
  info: { bg: '#FFF3E0', text: '#FF9800' },
  free: { bg: '#F3E5F5', text: '#AB47BC' },
};

/* ────────────────────────────────────────
   상대 시간 포맷 헬퍼
──────────────────────────────────────── */
function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffWeeks < 5) return `${diffWeeks}주 전`;
  return `${diffMonths}개월 전`;
}

/* ────────────────────────────────────────
   게시글 타입
──────────────────────────────────────── */
interface Post {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
}

/* ────────────────────────────────────────
   커뮤니티 페이지
──────────────────────────────────────── */
export default function CommunityPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
        return;
      }

      const mapped: Post[] = (data ?? []).map((row) => ({
        id: row.id,
        category: row.category,
        categoryLabel: row.category_label,
        title: row.title,
        content: row.content,
        author: row.author,
        date: formatRelativeTime(row.created_at),
        likes: row.likes,
        comments: row.comments_count,
      }));

      setPosts(mapped);
      setLoading(false);
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.includes(searchQuery) ||
      post.content.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* ── 헤더 ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          maxWidth: 'var(--max-width)',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 var(--spacing-xl)',
          background: 'var(--color-background-white)',
          zIndex: 200,
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          커뮤니티
        </h1>
      </header>

      <main className="page-container" style={{ background: 'var(--color-background-white)' }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>
          {/* ── 검색바 ── */}
          <div
            style={{
              marginTop: 'var(--spacing-xl)',
              marginBottom: 'var(--spacing-md)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SearchIcon size={18} color="var(--color-text-tertiary)" />
            </div>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 40,
                padding: '0 12px 0 38px',
                background: 'var(--color-background)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-md)',
                color: 'var(--color-text-primary)',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-light)';
              }}
            />
          </div>

          {/* ── 카테고리 탭 ── */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 'var(--spacing-md)',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: isActive ? 600 : 500,
                    background: isActive ? 'var(--color-primary)' : 'var(--color-background)',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    border: isActive ? 'none' : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ── 게시글 목록 ── */}
          <div>
            {loading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 0',
                  color: 'var(--color-text-tertiary)',
                  fontSize: 'var(--font-md)',
                }}
              >
                로딩 중...
              </div>
            ) : (
              <>
                {filteredPosts.map((post, index) => {
                  const catColor = categoryColors[post.category] || categoryColors.free;
                  return (
                    <React.Fragment key={post.id}>
                      <article
                        onClick={() => router.push(`/community/${post.id}`)}
                        style={{
                          padding: '16px 0',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {/* 카테고리 태그 */}
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--font-xs)',
                            fontWeight: 600,
                            background: catColor.bg,
                            color: catColor.text,
                            marginBottom: 8,
                          }}
                        >
                          {post.categoryLabel}
                        </span>

                        {/* 제목 */}
                        <h3
                          style={{
                            fontSize: 'var(--font-base)',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            lineHeight: 1.4,
                            marginBottom: 6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {post.title}
                        </h3>

                        {/* 내용 미리보기 */}
                        <p
                          style={{
                            fontSize: 'var(--font-sm)',
                            color: 'var(--color-text-tertiary)',
                            lineHeight: 1.5,
                            marginBottom: 10,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {post.content}
                        </p>

                        {/* 하단 정보 */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            fontSize: 'var(--font-xs)',
                            color: 'var(--color-text-tertiary)',
                          }}
                        >
                          <span style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                            {post.author}
                          </span>
                          <span>{post.date}</span>
                          <div style={{ flex: 1 }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <HeartIcon size={14} color="var(--color-text-tertiary)" />
                            <span>{post.likes}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <CommentIcon size={14} color="var(--color-text-tertiary)" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </article>

                      {/* 구분선 */}
                      {index < filteredPosts.length - 1 && (
                        <div
                          style={{
                            height: 1,
                            background: 'var(--color-border-light)',
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {filteredPosts.length === 0 && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '60px 0',
                      color: 'var(--color-text-tertiary)',
                      fontSize: 'var(--font-md)',
                    }}
                  >
                    게시글이 없습니다
                  </div>
                )}
              </>
            )}
          </div>

          {/* 하단 여백 */}
          <div style={{ height: 80 }} />
        </div>
      </main>

      {/* ── 글쓰기 플로팅 버튼 ── */}
      <button
        onClick={() => router.push('/community/write')}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--tabbar-height) + 16px)',
          right: 'calc(50% - min(215px, 50vw - 16px))',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(74, 144, 217, 0.4)',
          zIndex: 150,
          cursor: 'pointer',
          border: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        aria-label="글쓰기"
      >
        <PlusIcon size={26} color="#FFFFFF" />
      </button>

      <TabBar />
    </>
  );
}
