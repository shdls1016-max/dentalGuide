'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ToothMap from '@/components/ToothMap';

/* ─── Symptom list ─── */
const SYMPTOMS = [
  '찬물 시림',
  '뜨거운 것에 반응',
  '씹을 때 통증',
  '가만히 있어도 아픔',
  '잇몸 출혈',
  '잇몸 부기',
  '치아 흔들림',
  '치아 변색',
  '최근 충격/외상',
] as const;

/* ─── Tooth description helper ─── */
function getToothDescription(num: number): string {
  const tens = Math.floor(num / 10);
  const ones = num % 10;

  let quadrant = '';
  switch (tens) {
    case 1: quadrant = '오른쪽 위'; break;
    case 2: quadrant = '왼쪽 위'; break;
    case 3: quadrant = '왼쪽 아래'; break;
    case 4: quadrant = '오른쪽 아래'; break;
  }

  let type = '';
  switch (ones) {
    case 1: type = '중절치 (앞니)'; break;
    case 2: type = '측절치 (앞니)'; break;
    case 3: type = '송곳니'; break;
    case 4: type = '제1소구치'; break;
    case 5: type = '제2소구치'; break;
    case 6: type = '제1대구치 (어금니)'; break;
    case 7: type = '제2대구치 (어금니)'; break;
    case 8: type = '제3대구치 (사랑니)'; break;
  }

  return `${quadrant} ${type}`;
}

/* ─── Symptom colour helper for saved-symptom pills ─── */
function getSymptomColor(symptom: string): { bg: string; fg: string } {
  if (symptom.includes('시림') || symptom.includes('뜨거운'))
    return { bg: '#E3F2FD', fg: '#1976D2' };
  if (symptom.includes('통증') || symptom.includes('아픔'))
    return { bg: '#FFF3E0', fg: '#E65100' };
  if (symptom.includes('출혈') || symptom.includes('부기'))
    return { bg: '#FFEBEE', fg: '#C62828' };
  if (symptom.includes('흔들림') || symptom.includes('충격'))
    return { bg: '#FFF8E1', fg: '#F57F17' };
  return { bg: 'var(--color-primary-bg)', fg: 'var(--color-primary)' };
}

/* ═══════════════════════════════════════════════════════════ */
export default function ToothMapPage() {
  const router = useRouter();
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [symptomTeeth, setSymptomTeeth] = useState<Map<number, string[]>>(new Map());
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Select a tooth */
  const handleSelectTooth = useCallback(
    (num: number) => {
      setSelectedTooth(num);
      setCurrentSymptoms(symptomTeeth.get(num) ?? []);
      setJustSaved(false);
    },
    [symptomTeeth],
  );

  /* Scroll detail panel into view on selection */
  useEffect(() => {
    if (selectedTooth !== null && panelRef.current) {
      const timer = setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [selectedTooth]);

  /* Toggle a symptom pill */
  const toggleSymptom = (s: string) => {
    setCurrentSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
    setJustSaved(false);
  };

  /* Save current symptoms for the selected tooth */
  const saveSymptoms = () => {
    if (selectedTooth === null) return;
    const next = new Map(symptomTeeth);
    if (currentSymptoms.length > 0) {
      next.set(selectedTooth, [...currentSymptoms]);
    } else {
      next.delete(selectedTooth);
    }
    setSymptomTeeth(next);
    setJustSaved(true);
  };

  /* Navigate to diagnosis result page */
  const goToResult = () => {
    if (selectedTooth === null || currentSymptoms.length === 0) return;
    saveSymptoms();
    const params = new URLSearchParams();
    params.set('tooth', String(selectedTooth));
    params.set('symptoms', currentSymptoms.join(','));
    router.push(`/diagnosis?${params.toString()}`);
  };

  /* Saved entries for bottom list */
  const savedEntries = Array.from(symptomTeeth.entries()).filter(
    ([, s]) => s.length > 0,
  );

  /* ─── Render ─── */
  return (
    <div className="app-wrapper">
      {/* ── Custom header ── */}
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
        }}
      >
        {/* Back button */}
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
          aria-label="뒤로 가기"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Title */}
        <h1
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 'var(--font-lg)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.3px',
          }}
        >
          치아맵
        </h1>

        {/* Right spacer for centring */}
        <div style={{ width: 40 }} />
      </header>

      {/* ── Page body ── */}
      <div
        className="page-container-no-tab"
        style={{
          background: 'var(--color-background)',
          paddingTop: 0,
          overflowX: 'hidden',
        }}
      >
        <div style={{ padding: 'var(--spacing-lg) var(--spacing-md) 40px', maxWidth: 430, margin: '0 auto' }}>
          {/* Instructions */}
          <p
            style={{
              textAlign: 'center',
              fontSize: 'var(--font-base)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            아픈 위치를 선택하세요
          </p>

          {/* ── Tooth Map Card ── */}
          <div
            style={{
              background: 'var(--color-background-card)',
              borderRadius: 'var(--radius-card)',
              padding: '12px 4px 8px',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            <ToothMap
              selectedTooth={selectedTooth}
              onSelectTooth={handleSelectTooth}
              symptomTeeth={symptomTeeth}
            />
          </div>

          {/* ── Selection detail panel ── */}
          {selectedTooth !== null && (
            <div
              ref={panelRef}
              style={{
                marginTop: 'var(--spacing-xl)',
                background: 'var(--color-background-card)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--spacing-xl)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Tooth info header */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  {/* Tooth icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--color-primary-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C9.5 2 7.5 3 6.5 5C5.5 3 3.5 2 1 2C1 7 3 10 6.5 13C3 16 1 19 1 22H6.5C6.5 19 8 16 12 14C16 16 17.5 19 17.5 22H23C23 19 21 16 17.5 13C21 10 23 7 23 2C20.5 2 18.5 3 17.5 5C16.5 3 14.5 2 12 2Z"
                        fill="var(--color-primary)"
                      />
                    </svg>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 'var(--font-xl)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {selectedTooth}번 치아
                    </span>
                    <p
                      style={{
                        fontSize: 'var(--font-sm)',
                        color: 'var(--color-text-secondary)',
                        marginTop: 2,
                      }}
                    >
                      {getToothDescription(selectedTooth)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Symptom section label */}
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                증상을 선택하세요
              </p>

              {/* Symptom pills */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 'var(--spacing-xl)',
                }}
              >
                {SYMPTOMS.map((s) => {
                  const active = currentSymptoms.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: active ? 'var(--color-primary-bg)' : '#fff',
                        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        fontSize: 'var(--font-sm)',
                        fontWeight: active ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        lineHeight: 1.2,
                      }}
                    >
                      {active && (
                        <span style={{ marginRight: 4 }}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ verticalAlign: '-1px' }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={saveSymptoms}
                  disabled={currentSymptoms.length === 0}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 'var(--radius-button)',
                    border: `1.5px solid ${justSaved ? 'var(--color-success)' : 'var(--color-primary)'}`,
                    background: justSaved ? '#E8F5E9' : '#fff',
                    color: justSaved ? 'var(--color-success)' : 'var(--color-primary)',
                    fontSize: 'var(--font-md)',
                    fontWeight: 600,
                    cursor: currentSymptoms.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentSymptoms.length === 0 ? 0.45 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {justSaved ? '저장됨' : '증상 저장'}
                </button>
                <button
                  onClick={goToResult}
                  disabled={currentSymptoms.length === 0}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 'var(--radius-button)',
                    border: 'none',
                    background:
                      currentSymptoms.length === 0
                        ? 'var(--color-inactive)'
                        : 'var(--color-primary)',
                    color: '#fff',
                    fontSize: 'var(--font-md)',
                    fontWeight: 600,
                    cursor: currentSymptoms.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  증상 확인하기
                </button>
              </div>
            </div>
          )}

          {/* ── Saved symptoms list ── */}
          {savedEntries.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-xxl)' }}>
              <h3
                style={{
                  fontSize: 'var(--font-base)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                저장된 증상
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savedEntries.map(([tooth, symptoms]) => (
                  <button
                    key={tooth}
                    onClick={() => handleSelectTooth(tooth)}
                    style={{
                      background: 'var(--color-background-card)',
                      borderRadius: 'var(--radius-card)',
                      padding: '14px 16px',
                      boxShadow: 'var(--shadow-sm)',
                      border:
                        selectedTooth === tooth
                          ? '1.5px solid var(--color-primary)'
                          : '1px solid var(--color-border-light)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                      width: '100%',
                    }}
                  >
                    {/* Tooth number + location */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 30,
                          height: 30,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-primary-bg)',
                          color: 'var(--color-primary)',
                          fontSize: 'var(--font-sm)',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {tooth}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-sm)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {getToothDescription(tooth)}
                      </span>
                    </div>

                    {/* Symptom pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {symptoms.map((s) => {
                        const { bg, fg } = getSymptomColor(s);
                        return (
                          <span
                            key={s}
                            style={{
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-full)',
                              background: bg,
                              color: fg,
                              fontSize: 'var(--font-xs)',
                              fontWeight: 500,
                              lineHeight: 1.4,
                            }}
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
