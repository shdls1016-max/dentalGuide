'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

/* ────────────────────────────────────────
   카테고리 옵션
──────────────────────────────────────── */
const categoryOptions = [
  { id: 'question', label: '질문' },
  { id: 'review', label: '후기' },
  { id: 'info', label: '정보공유' },
  { id: 'free', label: '자유' },
];

/* ────────────────────────────────────────
   카메라 아이콘
──────────────────────────────────────── */
function CameraIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M23 19C23 19.53 22.79 20.04 22.41 20.41C22.04 20.79 21.53 21 21 21H3C2.47 21 1.96 20.79 1.59 20.41C1.21 20.04 1 19.53 1 19V8C1 7.47 1.21 6.96 1.59 6.59C1.96 6.21 2.47 6 3 6H7L9 3H15L17 6H21C21.53 6 22.04 6.21 22.41 6.59C22.79 6.96 23 7.47 23 8V19Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* ────────────────────────────────────────
   글쓰기 페이지
──────────────────────────────────────── */
export default function WritePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = selectedCategory && title.trim() && content.trim() && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const categoryOption = categoryOptions.find((c) => c.id === selectedCategory);
    if (!categoryOption) return;

    setSubmitting(true);

    const { error } = await supabase.from('posts').insert({
      category: categoryOption.id,
      category_label: categoryOption.label,
      title: title.trim(),
      content: content.trim(),
      author: '익명',
    });

    if (error) {
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
      setSubmitting(false);
      return;
    }

    router.push('/community');
  };

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
          justifyContent: 'space-between',
          padding: '0 var(--spacing-lg)',
          background: 'var(--color-background-white)',
          zIndex: 200,
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
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
            글쓰기
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 600,
            color: canSubmit ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
            background: 'none',
            border: 'none',
            cursor: canSubmit ? 'pointer' : 'default',
            padding: '8px 4px',
            transition: 'color 0.2s ease',
            opacity: submitting ? 0.5 : 1,
          }}
        >
          {submitting ? '등록 중...' : '등록'}
        </button>
      </header>

      <main
        className="page-container-no-tab"
        style={{ background: 'var(--color-background-white)' }}
      >
        <div style={{ padding: '0 var(--spacing-xl)' }}>
          {/* ── 카테고리 선택 ── */}
          <div
            style={{
              paddingTop: 'var(--spacing-xl)',
              paddingBottom: 'var(--spacing-lg)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: 10,
              }}
            >
              카테고리 선택
            </p>
            <div
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-sm)',
                      fontWeight: isSelected ? 600 : 500,
                      background: isSelected ? 'var(--color-primary)' : 'var(--color-background-white)',
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      border: isSelected
                        ? '1.5px solid var(--color-primary)'
                        : '1.5px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 구분선 ── */}
          <div style={{ height: 1, background: 'var(--color-border-light)' }} />

          {/* ── 제목 입력 ── */}
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            style={{
              width: '100%',
              padding: '18px 0',
              fontSize: 'var(--font-xl)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--color-border-light)',
              outline: 'none',
            }}
          />

          {/* ── 내용 입력 ── */}
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: 300,
              padding: '18px 0',
              fontSize: 'var(--font-base)',
              color: 'var(--color-text-primary)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.7,
              fontFamily: 'inherit',
            }}
          />

          {/* ── 하단 툴바 ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 0',
              borderTop: '1px solid var(--color-border-light)',
            }}
          >
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-background)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
                transition: 'background 0.2s ease',
              }}
            >
              <CameraIcon size={18} color="var(--color-text-secondary)" />
              사진 첨부
            </button>
          </div>

          {/* ── 가이드라인 안내 ── */}
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-tertiary)',
              lineHeight: 1.5,
              padding: '12px 0 40px',
            }}
          >
            커뮤니티 가이드라인을 준수해주세요. 부적절한 게시물은 사전 통보 없이 삭제될 수
            있습니다. 의료 상담은 반드시 전문의와 상의하세요.
          </p>
        </div>
      </main>
    </>
  );
}
