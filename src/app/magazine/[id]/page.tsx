'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, ChevronRightIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Magazine article data
──────────────────────────────────────── */
interface MagazineArticle {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  gradient: string;
  author: string;
  date: string;
  readTime: string;
  paragraphs: string[];
  relatedTreatment: {
    label: string;
    route: string;
  };
}

const magazineData: Record<string, MagazineArticle> = {
  m1: {
    id: 'm1',
    title: '올바른 양치법, 이렇게 하세요',
    tag: '구강관리',
    tagColor: '#4A90D9',
    tagBg: '#E8F0FE',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    author: '덴탈가이드 편집팀',
    date: '2025.01.15',
    readTime: '5분',
    paragraphs: [
      '많은 분들이 매일 양치질을 하지만, 올바른 방법으로 닦고 계신지 되돌아볼 필요가 있습니다. 치과 전문의들이 가장 많이 권장하는 양치법은 바로 "바스법(Bass Method)"입니다. 바스법은 칫솔모를 잇몸과 치아 사이 경계 부분에 45도 각도로 기울여 대고, 잇몸에서 치아 방향으로 짧게 진동을 주듯 닦는 방법입니다. 이 방법은 치태가 가장 많이 쌓이는 잇몸 경계 부분을 효과적으로 세정할 수 있어, 잇몸 질환 예방에 매우 효과적입니다. 특히 앞니 안쪽은 칫솔을 세로로 세워 위아래로 쓸어내리듯 닦아야 깨끗하게 관리할 수 있습니다.',
      '양치질 시간은 최소 3분 이상을 권장합니다. 대부분의 사람들은 실제로 1분 내외로 양치질을 마치는 경우가 많은데, 이는 치아 전체를 꼼꼼하게 닦기에 턱없이 부족한 시간입니다. 치아를 바깥쪽, 안쪽, 씹는 면으로 나누어 각 부분을 최소 10회 이상 닦아주어야 합니다. 양치질 순서를 정해두면 빠뜨리는 부위 없이 골고루 닦을 수 있습니다. 예를 들어, 위쪽 오른편 바깥쪽부터 시작하여 시계 방향으로 돌아가며 닦는 습관을 들이면 좋습니다.',
      '양치질 타이밍도 중요합니다. 식후 30분 이내에 양치질을 하는 것이 가장 효과적입니다. 다만 산성 음식이나 음료(오렌지주스, 탄산음료 등)를 섭취한 직후에는 치아 표면이 일시적으로 약해져 있으므로, 30분 정도 기다린 후에 닦는 것이 좋습니다. 또한 취침 전 양치질은 하루 중 가장 중요한 양치질입니다. 수면 중에는 침 분비가 줄어들어 세균이 번식하기 쉬운 환경이 되기 때문에, 자기 전에 반드시 치실과 함께 꼼꼼하게 닦아주어야 합니다.',
      '칫솔은 3개월마다 교체하는 것을 권장합니다. 칫솔모가 벌어지면 치태 제거 효율이 크게 떨어지며, 오래된 칫솔에는 세균이 번식할 수 있습니다. 칫솔모가 3개월 이내에 벌어진다면 양치질 시 너무 세게 힘을 주고 있다는 신호이므로, 힘 조절에 신경 써야 합니다. 전동 칫솔을 사용하는 경우에도 브러시 헤드는 동일하게 3개월 간격으로 교체해 주세요. 올바른 양치 습관은 건강한 치아를 평생 유지하는 가장 기본적이면서도 중요한 방법입니다.',
    ],
    relatedTreatment: {
      label: '스케일링 치료 정보 보기',
      route: '/treatment/scaling',
    },
  },
  m2: {
    id: 'm2',
    title: '스케일링 주기, 어떻게 잡을까?',
    tag: '치료정보',
    tagColor: '#F5576C',
    tagBg: '#FFEBEF',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    author: '덴탈가이드 편집팀',
    date: '2025.01.22',
    readTime: '4분',
    paragraphs: [
      '스케일링은 치석과 치태를 제거하여 잇몸 건강을 유지하는 데 필수적인 치과 관리입니다. 대한치과의사협회에서는 일반적으로 6개월에 한 번 스케일링을 받을 것을 권장하고 있습니다. 그러나 개인의 구강 상태에 따라 이 주기는 달라질 수 있습니다. 잇몸 질환이 있거나 치석이 빠르게 형성되는 분은 3~4개월 간격으로 스케일링을 받는 것이 좋으며, 구강 위생 관리가 잘 되는 분은 1년에 한 번으로도 충분할 수 있습니다.',
      '국민건강보험에서는 만 19세 이상 성인을 대상으로 연 1회 스케일링 비용을 지원하고 있습니다. 건강보험이 적용되면 본인 부담금은 약 1만 5천 원 내외로, 매우 저렴하게 스케일링을 받을 수 있습니다. 적용 기간은 매년 1월 1일부터 12월 31일까지이므로, 연말에 몰리지 않도록 미리 일정을 계획하는 것이 좋습니다. 비급여 스케일링(연 2회 이상)의 경우 3~5만 원 정도의 비용이 발생합니다.',
      '스케일링이 필요하다는 신호를 알아두면 적절한 시기에 치과를 방문할 수 있습니다. 양치질 시 잇몸에서 피가 나거나, 잇몸이 빨갛게 부어오르는 경우, 입 냄새가 지속되는 경우, 치아 사이에 갈색이나 노란색 치석이 눈에 보이는 경우에는 스케일링이 필요한 시점입니다. 특히 흡연자, 당뇨 환자, 임산부는 잇몸 질환 위험이 높으므로 더욱 정기적인 스케일링 관리가 중요합니다.',
      '스케일링 과정은 크게 초음파 스케일러를 이용한 치석 제거, 미세 연마, 구강 위생 교육의 순서로 진행됩니다. 시술 시간은 보통 30~40분 정도 소요되며, 시술 중 약간의 시린 느낌이 있을 수 있지만 대부분 참을 수 있는 수준입니다. 시술 후에는 1~2일간 찬 음식에 시린 증상이 있을 수 있으나 자연스럽게 사라집니다. 스케일링 후에는 2시간 동안 음식 섭취를 피하고, 당일 뜨겁거나 매운 음식은 자제하는 것이 좋습니다.',
    ],
    relatedTreatment: {
      label: '스케일링 치료 과정 알아보기',
      route: '/treatment/scaling',
    },
  },
  m3: {
    id: 'm3',
    title: '치아 미백의 모든 것',
    tag: '미용',
    tagColor: '#00B4D8',
    tagBg: '#E0F7FA',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    author: '덴탈가이드 편집팀',
    date: '2025.02.05',
    readTime: '6분',
    paragraphs: [
      '치아 미백은 크게 자가 미백(홈 블리칭)과 전문가 미백(오피스 블리칭) 두 가지로 나뉩니다. 자가 미백은 치과에서 개인 맞춤형 트레이를 제작한 후, 저농도의 미백제를 트레이에 넣어 하루 1~2시간씩 2~4주간 착용하는 방법입니다. 전문가 미백은 치과에서 고농도 미백제를 치아에 도포하고 특수 광선을 쏘여 1~2회 방문으로 빠른 효과를 기대할 수 있는 방법입니다. 최근에는 두 가지를 병행하는 듀얼 미백이 가장 효과적인 방법으로 주목받고 있습니다.',
      '치아 미백 비용은 방법과 치과에 따라 차이가 있습니다. 자가 미백은 보통 10~30만 원, 전문가 미백은 20~50만 원, 듀얼 미백은 30~60만 원 선입니다. 치아 미백은 건강보험이 적용되지 않는 비급여 항목이므로, 여러 치과의 가격을 비교해보는 것이 좋습니다. 다만 지나치게 저렴한 곳은 미백제의 질이나 시술 환경을 꼼꼼히 확인할 필요가 있습니다.',
      '미백 효과의 지속 기간은 개인의 식습관과 구강 관리에 따라 달라지지만, 일반적으로 6개월에서 2년 정도 유지됩니다. 커피, 홍차, 적포도주, 카레 등 착색을 유발하는 음식을 자주 섭취하면 효과가 빨리 줄어들 수 있습니다. 미백 효과를 오래 유지하려면 시술 후 48시간 동안은 착색 음식을 피하고, 이후에도 착색 음식 섭취 후 바로 양치질을 하는 습관을 들이는 것이 좋습니다. 필요에 따라 6개월~1년 간격으로 터치업 미백을 받으면 밝은 색상을 유지할 수 있습니다.',
      '치아 미백 시 알아두어야 할 부작용과 주의사항이 있습니다. 가장 흔한 부작용은 일시적인 치아 시림 증상으로, 대부분 시술 후 1~3일 이내에 자연스럽게 사라집니다. 시림이 심한 경우 불소 도포나 시린이 전용 치약 사용이 도움이 됩니다. 충치가 있거나 잇몸 질환이 있는 경우에는 미백 전에 반드시 치료를 먼저 받아야 합니다. 또한 임산부, 수유부, 만 18세 미만 청소년에게는 미백 시술이 권장되지 않습니다. 레진이나 크라운 등 보철물은 미백제에 반응하지 않으므로, 미백 후 색상 차이가 생길 수 있어 사전에 치과 의사와 충분히 상담하는 것이 중요합니다.',
    ],
    relatedTreatment: {
      label: '치과 치료 정보 둘러보기',
      route: '/treatment',
    },
  },
};

/* ────────────────────────────────────────
   Magazine Detail Page
──────────────────────────────────────── */
export default function MagazineDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const article = magazineData[id];

  /* ── Like state ── */
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  /* ── Comments state ── */
  const [comments, setComments] = useState<{ author: string; text: string; date: string }[]>([]);
  const [commentText, setCommentText] = useState('');

  /* ── Load likes from localStorage ── */
  useEffect(() => {
    if (!id) return;
    try {
      const stored = localStorage.getItem(`magazine_like_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLiked(parsed.liked);
        setLikeCount(parsed.count);
      }
    } catch {}
  }, [id]);

  /* ── Load comments from localStorage ── */
  useEffect(() => {
    if (!id) return;
    try {
      const stored = localStorage.getItem(`magazine_comments_${id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      }
    } catch {}
  }, [id]);

  /* ── Like handler ── */
  const handleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    localStorage.setItem(
      `magazine_like_${id}`,
      JSON.stringify({ liked: newLiked, count: newCount }),
    );
  };

  /* ── Add comment handler ── */
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      author: '익명',
      text: commentText.trim(),
      date: new Date()
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\. /g, '.')
        .replace(/\.$/, ''),
    };
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`magazine_comments_${id}`, JSON.stringify(updated));
    setCommentText('');
  };

  /* ── Not found ── */
  if (!article) {
    return (
      <div className="page-container-no-tab">
        <header
          style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            maxWidth: 430,
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 var(--spacing-lg)',
            background: 'var(--color-background-white)',
            zIndex: 200,
            borderBottom: '1px solid var(--color-border-light)',
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
            매거진
          </h1>
        </header>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-xl)',
          }}
        >
          <span style={{ fontSize: 48 }}>&#128196;</span>
          <p
            style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            아티클을 찾을 수 없습니다
          </p>
          <p
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            올바른 매거진을 선택해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-no-tab">
      {/* ── Sticky Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          maxWidth: 430,
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '0 var(--spacing-lg)',
          background: 'var(--color-background-white)',
          zIndex: 200,
          borderBottom: '1px solid var(--color-border-light)',
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
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {article.title}
        </h1>
      </header>

      {/* ── Hero Banner ── */}
      <div
        style={{
          width: '100%',
          height: 200,
          background: article.gradient,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: 'var(--spacing-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -20,
            right: 60,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 30,
            left: -15,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* Tag on banner */}
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: '#FFFFFF',
            background: 'rgba(0,0,0,0.2)',
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {article.tag}
        </span>
      </div>

      {/* ── Article Content ── */}
      <div style={{ padding: 'var(--spacing-xl)', paddingBottom: 40 }}>
        {/* Category tag */}
        <span
          style={{
            display: 'inline-block',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: article.tagColor,
            background: article.tagBg,
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {article.tag}
        </span>

        {/* Title */}
        <h2
          style={{
            fontSize: 'var(--font-title)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            lineHeight: 1.4,
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {article.title}
        </h2>

        {/* Author info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xxl)',
            paddingBottom: 'var(--spacing-xl)',
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          {/* Author avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21V19C20 17.94 19.58 16.92 18.83 16.17C18.08 15.42 17.06 15 16 15H8C6.94 15 5.92 15.42 5.17 16.17C4.42 16.92 4 17.94 4 19V21"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="7" r="4" stroke="var(--color-primary)" strokeWidth="2" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 'var(--font-md)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: 2,
              }}
            >
              {article.author}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {article.date}
              </span>
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-text-tertiary)',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                {article.readTime} 읽기
              </span>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xxl)',
          }}
        >
          {article.paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              style={{
                fontSize: 'var(--font-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                wordBreak: 'keep-all',
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'var(--color-border)',
            marginTop: 'var(--spacing-xxl)',
            marginBottom: 'var(--spacing-xxl)',
          }}
        />

        {/* ── Like Button ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xxl)',
          }}
        >
          <button
            onClick={handleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              border: liked
                ? '1.5px solid var(--color-primary)'
                : '1.5px solid var(--color-border)',
              background: liked ? 'var(--color-primary-bg)' : 'var(--color-background-white)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label={liked ? '좋아요 취소' : '좋아요'}
          >
            {liked ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="var(--color-primary)"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3
                     4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35
                     l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            )}
            <span
              style={{
                fontSize: 'var(--font-md)',
                fontWeight: 600,
                color: liked ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              좋아요 {likeCount > 0 ? likeCount : ''}
            </span>
          </button>
        </div>

        {/* ── Comments Section ── */}
        <div
          style={{
            marginBottom: 'var(--spacing-xxl)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-lg)',
            }}
          >
            댓글 {comments.length > 0 && `(${comments.length})`}
          </h3>

          {/* Comment input */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-xl)',
            }}
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddComment();
              }}
              placeholder="댓글을 입력하세요..."
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: 'var(--font-md)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-card)',
                outline: 'none',
                color: 'var(--color-text-primary)',
                background: 'var(--color-background)',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              style={{
                padding: '12px 20px',
                fontSize: 'var(--font-md)',
                fontWeight: 600,
                color: '#FFFFFF',
                background: commentText.trim()
                  ? 'var(--color-primary)'
                  : 'var(--color-text-tertiary)',
                border: 'none',
                borderRadius: 'var(--radius-card)',
                cursor: commentText.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              등록
            </button>
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-xl) 0',
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-md)',
              }}
            >
              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}
            >
              {comments.map((comment, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--spacing-lg)',
                    background: 'var(--color-background)',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--color-border-light)',
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
                        fontSize: 'var(--font-md)',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {comment.author}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-sm)',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {comment.date}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-md)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      wordBreak: 'keep-all',
                      margin: 0,
                    }}
                  >
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider before related link */}
        <div
          style={{
            width: '100%',
            height: 1,
            background: 'var(--color-border)',
            marginBottom: 'var(--spacing-xxl)',
          }}
        />

        {/* Related treatment link */}
        <div
          onClick={() => router.push(article.relatedTreatment.route)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') router.push(article.relatedTreatment.route);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'var(--color-primary-bg)',
            borderRadius: 'var(--radius-card)',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C9.5 2 7.5 3.5 7 5.5C6.5 7.5 5.5 9 4.5 11C3.5 13 3 15 4 17C5 19 6 21 8 21C9 21 10 20 10.5 18.5C11 17 11.5 16 12 16C12.5 16 13 17 13.5 18.5C14 20 15 21 16 21C18 21 19 19 20 17C21 15 20.5 13 19.5 11C18.5 9 17.5 7.5 17 5.5C16.5 3.5 14.5 2 12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: 'var(--font-md)',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              {article.relatedTreatment.label}
            </span>
          </div>
          <ChevronRightIcon size={20} color="var(--color-primary)" />
        </div>
      </div>
    </div>
  );
}
