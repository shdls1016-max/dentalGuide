'use client';

import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import {
  ToothIcon,
  GumIcon,
  ShieldIcon,
  AlertTriangleIcon,
  MapPinIcon,
  RefreshIcon,
  CalendarIcon,
  InfoIcon,
  ClipboardIcon,
} from '@/components/Icons';

/* ─────────────────────── Types ─────────────────────── */

interface Answers {
  pain: string[];
  painTrigger: string[];
  gumSymptom: string[];
  duration: string[];
  extraSymptom: string[];
}

type RiskLevel = 'low' | 'medium' | 'high';

interface Condition {
  name: string;
  description: string;
  likelihood: number; // 0-100
  icon: React.ReactNode;
}

interface Recommendation {
  text: string;
  description: string;
  icon: React.ReactNode;
}

/* ─────────────────────── Scoring Logic ─────────────────────── */

function parseAnswers(searchParams: URLSearchParams): Answers | null {
  // Try search params first
  const pain = searchParams.get('pain')?.split(',').filter(Boolean);
  const painTrigger = searchParams.get('painTrigger')?.split(',').filter(Boolean);
  const gumSymptom = searchParams.get('gumSymptom')?.split(',').filter(Boolean);
  const duration = searchParams.get('duration')?.split(',').filter(Boolean);
  const extraSymptom = searchParams.get('extraSymptom')?.split(',').filter(Boolean);

  if (pain && gumSymptom && duration && extraSymptom) {
    return { pain, painTrigger: painTrigger || [], gumSymptom, duration, extraSymptom };
  }

  // Try localStorage fallback
  try {
    const stored = localStorage.getItem('symptomAnswers');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        pain: parsed.pain || [],
        painTrigger: parsed.painTrigger || [],
        gumSymptom: parsed.gumSymptom || [],
        duration: parsed.duration || [],
        extraSymptom: parsed.extraSymptom || [],
      };
    }
  } catch {
    // ignore
  }

  return null;
}

function calculateScore(answers: Answers): number {
  let score = 0;

  // Step 1 - 통증
  if (answers.pain.includes('계속 아픔')) score += 3;
  else if (answers.pain.includes('가끔')) score += 1;

  // Step 2 - 통증 트리거
  if (answers.painTrigger.includes('찬물 마실 때')) score += 2;
  if (answers.painTrigger.includes('뜨거운 음식')) score += 3;
  if (answers.painTrigger.includes('씹을 때')) score += 2;
  if (answers.painTrigger.includes('가만히 있어도')) score += 4;

  // Step 3 - 잇몸 증상
  if (answers.gumSymptom.includes('피남')) score += 2;
  if (answers.gumSymptom.includes('붓기')) score += 2;
  if (answers.gumSymptom.includes('냄새')) score += 1;

  // Step 4 - 기간
  if (answers.duration.includes('1개월 이상')) score += 3;
  else if (answers.duration.includes('1주일 이내')) score += 1;
  else if (answers.duration.includes('오늘/어제')) score += 0;

  // Step 5 - 추가 증상
  if (answers.extraSymptom.includes('치아 흔들림')) score += 3;
  if (answers.extraSymptom.includes('치아 변색')) score += 2;
  if (answers.extraSymptom.includes('입 냄새')) score += 1;

  return score;
}

function getRiskLevel(score: number): RiskLevel {
  if (score <= 4) return 'low';
  if (score <= 10) return 'medium';
  return 'high';
}

function getRiskLabel(level: RiskLevel): string {
  if (level === 'low') return '낮음';
  if (level === 'medium') return '보통';
  return '높음';
}

function getRiskColor(level: RiskLevel): string {
  if (level === 'low') return 'var(--color-success)';
  if (level === 'medium') return 'var(--color-warning)';
  return 'var(--color-danger)';
}

function getRiskBgColor(level: RiskLevel): string {
  if (level === 'low') return '#E8F5E9';
  if (level === 'medium') return '#FFF3E0';
  return '#FFEBEE';
}

function getConditions(answers: Answers, score: number): Condition[] {
  const conditions: Condition[] = [];

  // Cavity possibility
  const hasColdSensitivity = answers.painTrigger.includes('찬물 마실 때');
  const hasHotSensitivity = answers.painTrigger.includes('뜨거운 음식');
  const hasDiscoloration = answers.extraSymptom.includes('치아 변색');
  const hasConstantPain = answers.pain.includes('계속 아픔');
  const hasBitePain = answers.painTrigger.includes('씹을 때');

  let cavityScore = 0;
  if (hasColdSensitivity) cavityScore += 25;
  if (hasHotSensitivity) cavityScore += 20;
  if (hasDiscoloration) cavityScore += 25;
  if (hasConstantPain) cavityScore += 15;
  if (hasBitePain) cavityScore += 15;

  if (cavityScore > 0) {
    const likelihood = Math.min(cavityScore, 95);
    conditions.push({
      name: hasHotSensitivity || hasConstantPain ? '충치 (진행 가능성)' : '초기 충치 가능성',
      description:
        hasHotSensitivity || hasConstantPain
          ? '뜨거운 자극에 반응하거나 지속적 통증은 충치가 진행되었을 수 있어요'
          : '찬 자극에 민감하거나 변색이 있으면 초기 충치를 의심할 수 있어요',
      likelihood,
      icon: <ToothIcon size={22} color="var(--color-warning)" />,
    });
  }

  // Gum disease possibility
  const hasGumBleed = answers.gumSymptom.includes('피남');
  const hasSwelling = answers.gumSymptom.includes('붓기');
  const hasGumSmell = answers.gumSymptom.includes('냄새');
  const hasLooseTooth = answers.extraSymptom.includes('치아 흔들림');
  const hasBadBreath = answers.extraSymptom.includes('입 냄새');

  let gumScore = 0;
  if (hasGumBleed) gumScore += 25;
  if (hasSwelling) gumScore += 25;
  if (hasGumSmell) gumScore += 15;
  if (hasLooseTooth) gumScore += 20;
  if (hasBadBreath) gumScore += 15;

  if (gumScore > 0) {
    const likelihood = Math.min(gumScore, 95);
    conditions.push({
      name: hasLooseTooth ? '치주염 가능성' : '잇몸 염증 가능성',
      description: hasLooseTooth
        ? '치아 흔들림과 잇몸 증상이 함께 나타나면 치주질환이 진행되었을 수 있어요'
        : '잇몸 출혈이나 붓기는 잇몸 염증(치은염)의 대표적인 증상이에요',
      likelihood,
      icon: <GumIcon size={22} color="var(--color-danger)" />,
    });
  }

  // Sensitivity
  if (hasColdSensitivity && !hasConstantPain && cavityScore < 40) {
    conditions.push({
      name: '치아 시림 (지각과민)',
      description: '충치 외에도 잇몸 퇴축이나 에나멜 마모로 시림이 생길 수 있어요',
      likelihood: 40,
      icon: <ToothIcon size={22} color="var(--color-primary)" />,
    });
  }

  // If spontaneous pain
  if (answers.painTrigger.includes('가만히 있어도') && hasConstantPain) {
    conditions.push({
      name: '치수염 가능성',
      description: '자극 없이도 통증이 지속되면 치아 신경에 염증이 있을 수 있어요',
      likelihood: Math.min(70 + (answers.duration.includes('1개월 이상') ? 15 : 0), 95),
      icon: <AlertTriangleIcon size={22} color="var(--color-danger)" />,
    });
  }

  // If score is very low and no significant findings
  if (conditions.length === 0) {
    conditions.push({
      name: '특별한 이상 소견 없음',
      description: '현재 입력하신 증상으로는 큰 문제가 없어 보여요. 정기 검진을 추천드려요',
      likelihood: 0,
      icon: <ShieldIcon size={22} color="var(--color-success)" />,
    });
  }

  // Sort by likelihood desc
  conditions.sort((a, b) => b.likelihood - a.likelihood);
  return conditions;
}

function getRecommendations(answers: Answers, riskLevel: RiskLevel): Recommendation[] {
  const recs: Recommendation[] = [];

  if (riskLevel === 'high') {
    recs.push({
      text: '가능한 빨리 치과 방문을 권장합니다',
      description: '증상이 심한 편이에요. 1주 내에 치과에서 정밀 검사를 받아보세요',
      icon: <CalendarIcon size={20} color="var(--color-danger)" />,
    });
  } else if (riskLevel === 'medium') {
    recs.push({
      text: '2주 내 치과 방문을 권장합니다',
      description: '빠른 시일 내 검진을 받으면 큰 치료를 예방할 수 있어요',
      icon: <CalendarIcon size={20} color="var(--color-warning)" />,
    });
  } else {
    recs.push({
      text: '정기 검진을 받아보세요',
      description: '6개월에 한 번 정기 검진으로 구강 건강을 유지하세요',
      icon: <CalendarIcon size={20} color="var(--color-success)" />,
    });
  }

  const hasGumIssue =
    answers.gumSymptom.includes('피남') ||
    answers.gumSymptom.includes('붓기');

  if (hasGumIssue) {
    recs.push({
      text: '스케일링 우선 권장',
      description: '잇몸 증상이 있는 경우 스케일링을 통해 개선할 수 있어요',
      icon: <ClipboardIcon size={20} color="var(--color-primary)" />,
    });
  }

  if (answers.extraSymptom.includes('입 냄새') || answers.gumSymptom.includes('냄새')) {
    recs.push({
      text: '구강 위생 관리 강화',
      description: '올바른 칫솔질과 치실 사용, 혀 클리닝을 실천해 보세요',
      icon: <ShieldIcon size={20} color="var(--color-secondary)" />,
    });
  }

  if (answers.painTrigger.includes('찬물 마실 때')) {
    recs.push({
      text: '시린이 전용 치약 사용',
      description: '시린이 전용 치약을 2주 이상 사용하면 증상이 완화될 수 있어요',
      icon: <InfoIcon size={20} color="var(--color-primary)" />,
    });
  }

  return recs;
}

/* ─────────────────────── Styles ─────────────────────── */

const styles = {
  wrapper: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    minHeight: '100vh',
    background: 'var(--color-background)',
    position: 'relative' as const,
  },
  content: {
    paddingTop: 'calc(var(--header-height) + 16px)',
    paddingBottom: 120,
    paddingLeft: 'var(--spacing-xl)',
    paddingRight: 'var(--spacing-xl)',
  },
  resultCard: {
    background: 'var(--color-background-white)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--spacing-xxl)',
    marginBottom: 'var(--spacing-xl)',
    textAlign: 'center' as const,
  },
  resultSubtitle: {
    fontSize: 'var(--font-md)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--spacing-xl)',
    lineHeight: 1.5,
  },
  riskBadge: (level: RiskLevel) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 16px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-sm)',
    fontWeight: 700 as const,
    color: getRiskColor(level),
    background: getRiskBgColor(level),
    marginBottom: 'var(--spacing-xl)',
  }),
  scoreCircleOuter: {
    position: 'relative' as const,
    width: 140,
    height: 140,
    margin: '0 auto',
    marginBottom: 'var(--spacing-lg)',
  },
  scoreCircleSvg: {
    transform: 'rotate(-90deg)',
  },
  scoreCircleText: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
  },
  scoreNumber: (level: RiskLevel) => ({
    fontSize: 'var(--font-hero)',
    fontWeight: 700 as const,
    color: getRiskColor(level),
    lineHeight: 1,
  }),
  scoreUnit: {
    fontSize: 'var(--font-xs)',
    color: 'var(--color-text-tertiary)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 'var(--font-xl)',
    fontWeight: 700 as const,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-lg)',
  },
  conditionCard: {
    background: 'var(--color-background-white)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-sm)',
    padding: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-md)',
  },
  conditionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-md)',
  },
  conditionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-background)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  conditionName: {
    fontSize: 'var(--font-base)',
    fontWeight: 600 as const,
    color: 'var(--color-text-primary)',
  },
  conditionDesc: {
    fontSize: 'var(--font-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
    marginBottom: 'var(--spacing-md)',
  },
  likelihoodBarBg: {
    height: 8,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-border-light)',
    overflow: 'hidden' as const,
  },
  likelihoodBarFill: (percent: number) => ({
    height: '100%',
    width: `${percent}%`,
    borderRadius: 'var(--radius-full)',
    background:
      percent >= 70
        ? 'var(--color-danger)'
        : percent >= 40
          ? 'var(--color-warning)'
          : 'var(--color-primary)',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  likelihoodLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  likelihoodText: {
    fontSize: 'var(--font-xs)',
    color: 'var(--color-text-tertiary)',
  },
  likelihoodPercent: (percent: number) => ({
    fontSize: 'var(--font-sm)',
    fontWeight: 600 as const,
    color:
      percent >= 70
        ? 'var(--color-danger)'
        : percent >= 40
          ? 'var(--color-warning)'
          : 'var(--color-primary)',
  }),
  recCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-md)',
    background: 'var(--color-background-white)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-sm)',
    padding: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-md)',
  },
  recIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-background)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recText: {
    fontSize: 'var(--font-base)',
    fontWeight: 600 as const,
    color: 'var(--color-text-primary)',
    marginBottom: 4,
  },
  recDesc: {
    fontSize: 'var(--font-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  disclaimer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-sm)',
    background: 'var(--color-background)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    marginTop: 'var(--spacing-xl)',
    marginBottom: 'var(--spacing-xl)',
  },
  disclaimerText: {
    fontSize: 'var(--font-sm)',
    color: 'var(--color-text-tertiary)',
    lineHeight: 1.6,
  },
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
    gap: 'var(--spacing-md)',
    zIndex: 100,
  },
};

/* ─────────────────────── Component ─────────────────────── */

function ScoreCircle({ score, maxScore, riskLevel }: { score: number; maxScore: number; riskLevel: RiskLevel }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(score / maxScore, 1);
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div style={styles.scoreCircleOuter}>
      <svg width={140} height={140} style={styles.scoreCircleSvg}>
        {/* Background circle */}
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={10}
        />
        {/* Score arc */}
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke={getRiskColor(riskLevel)}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={styles.scoreCircleText as React.CSSProperties}>
        <div style={styles.scoreNumber(riskLevel)}>{score}</div>
        <div style={styles.scoreUnit}>/ {maxScore}</div>
      </div>
    </div>
  );
}

function SymptomResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<Answers | null>(null);

  useEffect(() => {
    const parsed = parseAnswers(searchParams);
    setAnswers(parsed);
  }, [searchParams]);

  const analysis = useMemo(() => {
    if (!answers) return null;

    const score = calculateScore(answers);
    const riskLevel = getRiskLevel(score);
    const conditions = getConditions(answers, score);
    const recommendations = getRecommendations(answers, riskLevel);

    return { score, riskLevel, conditions, recommendations };
  }, [answers]);

  if (!answers || !analysis) {
    return (
      <div style={styles.wrapper}>
        <Header title="증상 확인 결과" showBack showNotification={false} showProfile={false} onBack={() => router.back()} />
        <div
          style={{
            ...styles.content,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
          }}
        >
          <div>
            <p style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
              증상 데이터를 찾을 수 없습니다.
            </p>
            <Button variant="primary" onClick={() => router.push('/symptom-check')}>
              증상 확인 시작하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { score, riskLevel, conditions, recommendations } = analysis;
  const MAX_SCORE = 24;

  return (
    <div style={styles.wrapper}>
      <Header title="증상 확인 결과" showBack showNotification={false} showProfile={false} onBack={() => router.back()} />

      <div style={styles.content}>
        {/* ── Result Summary Card ── */}
        <div style={styles.resultCard}>
          <p style={styles.resultSubtitle}>
            입력된 정보를 종합해 분석했습니다
          </p>

          <ScoreCircle score={score} maxScore={MAX_SCORE} riskLevel={riskLevel} />

          <div style={styles.riskBadge(riskLevel)}>
            {riskLevel === 'high' && <AlertTriangleIcon size={14} />}
            {riskLevel === 'medium' && <InfoIcon size={14} />}
            {riskLevel === 'low' && <ShieldIcon size={14} />}
            위험도: {getRiskLabel(riskLevel)}
          </div>
        </div>

        {/* ── Possible Conditions ── */}
        <h2 style={styles.sectionTitle}>가능성 높은 상태</h2>
        {conditions.map((condition, index) => (
          <Card key={index} style={styles.conditionCard}>
            <div style={styles.conditionHeader}>
              <div style={styles.conditionIconWrap}>{condition.icon}</div>
              <span style={styles.conditionName}>{condition.name}</span>
            </div>
            <p style={styles.conditionDesc}>{condition.description}</p>
            {condition.likelihood > 0 && (
              <div>
                <div style={styles.likelihoodLabel}>
                  <span style={styles.likelihoodText}>가능성</span>
                  <span style={styles.likelihoodPercent(condition.likelihood)}>
                    {condition.likelihood}%
                  </span>
                </div>
                <div style={styles.likelihoodBarBg}>
                  <div style={styles.likelihoodBarFill(condition.likelihood)} />
                </div>
              </div>
            )}
          </Card>
        ))}

        {/* ── Recommendations ── */}
        <h2 style={styles.sectionTitle}>권장 행동</h2>
        {recommendations.map((rec, index) => (
          <div key={index} style={styles.recCard}>
            <div style={styles.recIconWrap}>{rec.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={styles.recText}>{rec.text}</p>
              <p style={styles.recDesc}>{rec.description}</p>
            </div>
          </div>
        ))}

        {/* ── Disclaimer ── */}
        <div style={styles.disclaimer}>
          <InfoIcon size={18} color="var(--color-text-tertiary)" />
          <p style={styles.disclaimerText}>
            본 결과는 의료 진단이 아닌 참고용 안내입니다. 정확한 진단과 치료는 반드시 치과 전문의와 상담하세요.
          </p>
        </div>
      </div>

      {/* ── Bottom Buttons ── */}
      <div style={styles.bottomBar}>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => router.push('/symptom-check')}
          style={{ flex: 1 }}
        >
          <RefreshIcon size={18} />
          다시 확인하기
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/search')}
          style={{ flex: 1 }}
        >
          <MapPinIcon size={18} color="#FFFFFF" />
          치과 찾기
        </Button>
      </div>
    </div>
  );
}

export default function SymptomResultPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.wrapper}>
          <Header title="증상 확인 결과" showBack showNotification={false} showProfile={false} />
          <div
            style={{
              ...styles.content,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
            }}
          >
            <p style={{ fontSize: 'var(--font-md)', color: 'var(--color-text-tertiary)' }}>
              결과를 불러오는 중...
            </p>
          </div>
        </div>
      }
    >
      <SymptomResultContent />
    </Suspense>
  );
}
