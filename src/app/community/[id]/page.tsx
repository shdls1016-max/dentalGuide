'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon, CommentIcon } from '@/components/Icons';
import { supabase } from '@/lib/supabase';

/* ────────────────────────────────────────
   카테고리 색상
──────────────────────────────────────── */
const categoryColors: Record<string, { bg: string; text: string }> = {
  review: { bg: '#E8F5E9', text: '#4CAF50' },
  question: { bg: '#E8F0FE', text: '#4A90D9' },
  info: { bg: '#FFF3E0', text: '#FF9800' },
  free: { bg: '#F3E5F5', text: '#AB47BC' },
};

/* ────────────────────────────────────────
   타입 정의
──────────────────────────────────────── */
interface Post {
  id: string;
  category: string;
  category_label: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
  likes: number;
  replies?: Comment[];
}

/* ────────────────────────────────────────
   날짜 포맷 유틸
──────────────────────────────────────── */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

/* ────────────────────────────────────────
   북마크 아이콘
──────────────────────────────────────── */
function BookmarkIcon({
  size = 24,
  color = 'currentColor',
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <path
        d="M19 21L12 16L5 21V5C5 4.47 5.21 3.96 5.59 3.59C5.96 3.21 6.47 3 7 3H17C17.53 3 18.04 3.21 18.41 3.59C18.79 3.96 19 4.47 19 5V21Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────────────────────────────────
   전송 아이콘
──────────────────────────────────────── */
function SendIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22 2L11 13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ────────────────────────────────────────
   댓글 컴포넌트
──────────────────────────────────────── */
function CommentItem({
  comment,
  isReply = false,
}: {
  comment: Comment;
  isReply?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div
      style={{
        padding: isReply ? '12px 0 12px 40px' : '14px 0',
        position: 'relative',
      }}
    >
      {/* 대댓글 연결선 */}
      {isReply && (
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: 0,
            width: 14,
            height: 28,
            borderLeft: '1.5px solid var(--color-border-light)',
            borderBottom: '1.5px solid var(--color-border-light)',
            borderRadius: '0 0 0 8px',
          }}
        />
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        {/* 아바타 */}
        <div
          style={{
            width: isReply ? 30 : 34,
            height: isReply ? 30 : 34,
            borderRadius: '50%',
            background: 'var(--color-background)',
            border: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: isReply ? 'var(--font-xs)' : 'var(--font-sm)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {comment.author.charAt(0)}
        </div>

        {/* 내용 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-sm)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {comment.author}
            </span>
            <span
              style={{
                fontSize: 'var(--font-xs)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {comment.date}
            </span>
          </div>
          <p
            style={{
              fontSize: 'var(--font-md)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.55,
              marginBottom: 8,
              wordBreak: 'break-word',
            }}
          >
            {comment.content}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <button
              onClick={handleLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 'var(--font-xs)',
                color: liked ? 'var(--color-danger)' : 'var(--color-text-tertiary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <HeartIcon
                size={14}
                color={liked ? 'var(--color-danger)' : 'var(--color-text-tertiary)'}
              />
              {likeCount > 0 && likeCount}
            </button>
            {!isReply && (
              <button
                style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--color-text-tertiary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                답글
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────
   게시글 상세 페이지
──────────────────────────────────────── */
export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');

  /* ── 댓글 fetch ── */
  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error || !data) return;

    // parent comments와 replies 그룹핑
    const parentComments: Comment[] = [];
    const replyMap: Record<string, Comment[]> = {};

    for (const row of data) {
      const mapped: Comment = {
        id: row.id,
        author: row.author,
        date: formatDate(row.created_at),
        content: row.content,
        likes: row.likes,
      };

      if (row.parent_id) {
        if (!replyMap[row.parent_id]) {
          replyMap[row.parent_id] = [];
        }
        replyMap[row.parent_id].push(mapped);
      } else {
        parentComments.push(mapped);
      }
    }

    // replies를 parent에 연결
    for (const parent of parentComments) {
      if (replyMap[parent.id]) {
        parent.replies = replyMap[parent.id];
      }
    }

    setComments(parentComments);
  }, [postId]);

  /* ── 초기 데이터 fetch ── */
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // 게시글 fetch
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (!postError && postData) {
        setPost(postData as Post);
        setLikeCount(postData.likes);
      }

      // 댓글 fetch
      await fetchComments();

      setLoading(false);
    }

    fetchData();
  }, [postId, fetchComments]);

  /* ── 댓글 작성 ── */
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        parent_id: null,
        author: '익명',
        content: commentText.trim(),
        likes: 0,
      });

    if (error) return;

    setCommentText('');

    // 댓글 다시 fetch
    await fetchComments();

    // posts 테이블의 comments_count 업데이트
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    await supabase
      .from('posts')
      .update({ comments_count: count ?? 0 })
      .eq('id', postId);

    // post 상태도 업데이트
    setPost((prev) => prev ? { ...prev, comments_count: count ?? 0 } : prev);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  /* ── 로딩 상태 ── */
  if (loading) {
    return (
      <>
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
            borderBottom: '1px solid var(--color-border-light)',
            gap: 12,
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
            게시글
          </h1>
        </header>
        <main
          className="page-container-no-tab"
          style={{
            background: 'var(--color-background-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-md)' }}>
            로딩 중...
          </p>
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
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
            borderBottom: '1px solid var(--color-border-light)',
            gap: 12,
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
            게시글
          </h1>
        </header>
        <main
          className="page-container-no-tab"
          style={{
            background: 'var(--color-background-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
          }}
        >
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-md)' }}>
            게시글을 찾을 수 없습니다.
          </p>
        </main>
      </>
    );
  }

  const catColor = categoryColors[post.category] || categoryColors.free;
  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

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
          padding: '0 var(--spacing-lg)',
          background: 'var(--color-background-white)',
          zIndex: 200,
          borderBottom: '1px solid var(--color-border-light)',
          gap: 12,
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
          게시글
        </h1>
      </header>

      <main
        className="page-container-no-tab"
        style={{
          background: 'var(--color-background-white)',
          paddingBottom: 80,
        }}
      >
        <div style={{ padding: '0 var(--spacing-xl)' }}>
          {/* ── 게시글 본문 영역 ── */}
          <div style={{ paddingTop: 'var(--spacing-xl)' }}>
            {/* 카테고리 태그 */}
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-xs)',
                fontWeight: 600,
                background: catColor.bg,
                color: catColor.text,
                marginBottom: 12,
              }}
            >
              {post.category_label}
            </span>

            {/* 제목 */}
            <h2
              style={{
                fontSize: 'var(--font-xxl)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.4,
                marginBottom: 16,
              }}
            >
              {post.title}
            </h2>

            {/* 작성자 정보 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid var(--color-border-light)',
              }}
            >
              {/* 아바타 */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--color-primary-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 'var(--font-md)',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 'var(--font-md)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: 2,
                  }}
                >
                  {post.author}
                </p>
                <p
                  style={{
                    fontSize: 'var(--font-xs)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {formatDate(post.created_at)}
                </p>
              </div>
            </div>

            {/* 본문 */}
            <div
              style={{
                fontSize: 'var(--font-base)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.75,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginBottom: 24,
              }}
            >
              {post.content}
            </div>

            {/* 좋아요 / 북마크 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingBottom: 16,
              }}
            >
              <button
                onClick={handleLike}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: liked ? '#FFEBEE' : 'var(--color-background)',
                  border: `1px solid ${liked ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  color: liked ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                }}
              >
                <HeartIcon
                  size={16}
                  color={liked ? 'var(--color-danger)' : 'var(--color-text-secondary)'}
                />
                좋아요 {likeCount}
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: bookmarked ? 'var(--color-primary-bg)' : 'var(--color-background)',
                  border: `1px solid ${bookmarked ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 500,
                  color: bookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                }}
              >
                <BookmarkIcon
                  size={16}
                  color={bookmarked ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
                  filled={bookmarked}
                />
                저장
              </button>
            </div>
          </div>

          {/* ── 구분선 ── */}
          <div
            style={{
              height: 8,
              background: 'var(--color-background)',
              margin: '0 calc(-1 * var(--spacing-xl))',
            }}
          />

          {/* ── 댓글 섹션 ── */}
          <div style={{ paddingTop: 'var(--spacing-lg)' }}>
            <h3
              style={{
                fontSize: 'var(--font-lg)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              댓글
              <span
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                }}
              >
                {totalComments}
              </span>
            </h3>

            {/* 댓글 목록 */}
            <div>
              {comments.map((comment, index) => (
                <React.Fragment key={comment.id}>
                  <CommentItem comment={comment} />
                  {/* 대댓글 */}
                  {comment.replies?.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                  {index < comments.length - 1 && (
                    <div
                      style={{
                        height: 1,
                        background: 'var(--color-border-light)',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 하단 여백 */}
            <div style={{ height: 20 }} />
          </div>
        </div>
      </main>

      {/* ── 댓글 입력 바 ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 'var(--max-width)',
          background: 'var(--color-background-white)',
          borderTop: '1px solid var(--color-border-light)',
          padding: '10px var(--spacing-xl)',
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            flex: 1,
            height: 40,
            padding: '0 14px',
            background: 'var(--color-background)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--font-md)',
            color: 'var(--color-text-primary)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              handleSubmitComment();
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-light)';
          }}
        />
        <button
          onClick={handleSubmitComment}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: commentText.trim()
              ? 'var(--color-primary)'
              : 'var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: commentText.trim() ? 'pointer' : 'default',
            border: 'none',
            transition: 'background 0.2s ease',
            flexShrink: 0,
          }}
          aria-label="댓글 보내기"
        >
          <SendIcon size={18} color="#FFFFFF" />
        </button>
      </div>
    </>
  );
}
