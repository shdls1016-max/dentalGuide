'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { CheckIcon } from '@/components/Icons';

/* ───────────────────────── Question Data ───────────────────────── */

interface Question {
  id: string;
  question: string;
  subtitle: string;
  options: string[];
  multiSelect: boolean;
}

const questions: Question[] = [
  {
    id: 'pain',
    question: '통증이 있나요?',
    subtitle: '걱정 마세요, 간단한 확인이에요',
    options: ['없음', '가끔', '계속 아픔'],
    multiSelect: false,
  },
  {
    id: 'painTrigger',
    question: '통증은 언제 심해지나요?',
    subtitle: '해당하는 상황을 선택해 주세요',
    options: ['찬물 마실 때', '뜨거운 음식', '씹을 때', '가만히 있어도'],
    multiSelect: false,
  },
  {
    id: 'gumSymptom',
    question: '잇몸 증상이 있나요?',
    subtitle: '해당하는 증상을 모두 선택해 주세요',
    options: ['피남', '붓기', '냄새', '없음'],
    multiSelect: true,
  },
  {
    id: 'duration',
    question: '증상이 시작된 시기는?',
    subtitle: '대략적으로 선택해 주시면 돼요',
    options: ['오늘/어제', '1주일 이내', '1개월 이상', '잘 모름'],
    multiSelect: false,
  },
  {
    id: 'extraSymptom',
    question: '추가 증상이 있나요?',
    subtitle: '해당하는 증상을 모두 선택해 주세요',
    options: ['치아 흔들림', '치아 변색', '입 냄새', '없음'],
    multiSelect: true,
  },
];

/* ───────────────────── Conditional Flow ───────────────────── */

function getVisibleQuestions(answers: Record<string, string[]>): Question[] {
  return questions.filter((q) => {
    // Skip painTrigger if user answered "없음" (no pain)
    if (q.id === 'painTrigger' && answers.pain?.includes('없음')) {
      return false;
    }
    return true;
  });
}

/* ───────────────────────── Styles ───────────────────────── */

const styles = {
  wrapper: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    minHeight: '100vh',
    background: 'var(--color-background-white)',
    position: 'relative' as const,
  },
  content: {
    paddingTop: 'calc(var(--header-height) + 16px)',
    paddingBottom: 120,
    paddingLeft: 'var(--spacing-xl)',
    paddingRight: 'var(--spacing-xl)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-xxl)',
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    background: 'var(--color-border-light)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden' as const,
  },
  progressBarFill: (step: number, totalSteps: number) => ({
    height: '100%',
    width: `${((step + 1) / totalSteps) * 100}%`,
    background: 'var(--color-primary)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  stepLabel: {
    fontSize: 'var(--font-sm)',
    fontWeight: 600 as const,
    color: 'var(--color-primary)',
    whiteSpace: 'nowrap' as const,
    minWidth: 50,
    textAlign: 'right' as const,
  },
  questionArea: {
    marginBottom: 'var(--spacing-xxl)',
  },
  questionText: {
    fontSize: 'var(--font-title)',
    fontWeight: 700 as const,
    color: 'var(--color-text-primary)',
    lineHeight: 1.35,
    marginBottom: 'var(--spacing-sm)',
  },
  subtitleText: {
    fontSize: 'var(--font-md)',
    color: 'var(--color-text-tertiary)',
    lineHeight: 1.5,
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-md)',
    flex: 1,
  },
  optionButton: (selected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    width: '100%',
    padding: '18px 20px',
    borderRadius: 'var(--radius-card)',
    border: selected ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
    background: selected ? 'var(--color-primary-bg)' : 'var(--color-background-white)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    textAlign: 'left' as const,
  }),
  optionCheckbox: (selected: boolean) => ({
    width: 24,
    height: 24,
    borderRadius: selected ? 'var(--radius-full)' : 'var(--radius-full)',
    border: selected ? 'none' : '2px solid var(--color-border)',
    background: selected ? 'var(--color-primary)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  }),
  optionLabel: (selected: boolean) => ({
    fontSize: 'var(--font-lg)',
    fontWeight: selected ? 600 : 400,
    color: selected ? 'var(--color-primary-dark)' : 'var(--color-text-primary)',
    transition: 'all 0.2s ease',
  }),
  bottomBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--max-width)',
    padding: 'var(--spacing-lg) var(--spacing-xl)',
    paddingBottom: 'calc(var(--spacing-lg) + env(safe-area-inset-bottom, 0px))',
    background: 'var(--color-background-white)',
    borderTop: '1px solid var(--color-border-light)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    zIndex: 100,
  },
  multiSelectHint: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 'var(--font-sm)',
    color: 'var(--color-primary)',
    background: 'var(--color-primary-bg)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    marginTop: 'var(--spacing-sm)',
    fontWeight: 500 as const,
  },
};

/* ───────────────────────── Component ───────────────────────── */

export default function SymptomCheckPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const totalSteps = visibleQuestions.length;
  const currentQuestion = visibleQuestions[currentStep];
  const currentAnswers = answers[currentQuestion.id] || [];

  /* ── Selection handlers ── */

  const handleSelect = useCallback(
    (option: string) => {
      const q = visibleQuestions[currentStep];

      if (q.multiSelect) {
        // For multi-select: "없음" clears others, and selecting others clears "없음"
        setAnswers((prev) => {
          const current = prev[q.id] || [];
          if (option === '없음') {
            return { ...prev, [q.id]: ['없음'] };
          }
          const withoutNone = current.filter((o) => o !== '없음');
          if (withoutNone.includes(option)) {
            const next = withoutNone.filter((o) => o !== option);
            return { ...prev, [q.id]: next };
          }
          return { ...prev, [q.id]: [...withoutNone, option] };
        });
      } else {
        // Single select
        setAnswers((prev) => ({ ...prev, [q.id]: [option] }));
      }
    },
    [currentStep, visibleQuestions],
  );

  const canProceed = currentAnswers.length > 0;

  /* ── Navigation ── */

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Only save answers for visible questions (exclude skipped ones)
      const visibleIds = new Set(visibleQuestions.map((q) => q.id));
      const filteredAnswers: Record<string, string[]> = {};
      Object.entries(answers).forEach(([key, values]) => {
        if (visibleIds.has(key)) {
          filteredAnswers[key] = values;
        }
      });

      try {
        localStorage.setItem('symptomAnswers', JSON.stringify(filteredAnswers));
      } catch {
        // ignore storage errors
      }
      // Build query params as fallback
      const params = new URLSearchParams();
      Object.entries(filteredAnswers).forEach(([key, values]) => {
        params.set(key, values.join(','));
      });
      router.push(`/symptom-check/result?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      router.push('/');
    }
  };

  /* ── Render ── */

  return (
    <div style={styles.wrapper}>
      <Header title="증상 확인" showBack showNotification={false} showProfile={false} onBack={handleBack} />

      <div style={styles.content}>
        {/* Progress bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBarBg}>
            <div style={styles.progressBarFill(currentStep, totalSteps)} />
          </div>
          <span style={styles.stepLabel as React.CSSProperties}>
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        {/* Question */}
        <div style={styles.questionArea}>
          <p style={styles.questionText}>{currentQuestion.question}</p>
          <p style={styles.subtitleText}>{currentQuestion.subtitle}</p>
          {currentQuestion.multiSelect && (
            <div style={styles.multiSelectHint}>
              <CheckIcon size={14} />
              복수 선택 가능
            </div>
          )}
        </div>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => {
            const selected = currentAnswers.includes(option);
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                style={styles.optionButton(selected)}
              >
                <div style={styles.optionCheckbox(selected)}>
                  {selected && <CheckIcon size={14} color="#FFFFFF" />}
                </div>
                <span style={styles.optionLabel(selected)}>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={styles.bottomBar}>
        {currentStep > 0 && (
          <Button variant="text" onClick={handleBack} style={{ minWidth: 60 }}>
            이전
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canProceed}
          onClick={handleNext}
        >
          {currentStep < totalSteps - 1 ? '다음' : '결과 확인'}
        </Button>
      </div>
    </div>
  );
}
