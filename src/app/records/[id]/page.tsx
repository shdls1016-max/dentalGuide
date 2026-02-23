'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import {
  CalendarIcon,
  ToothIcon,
  CheckIcon,
  EditIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from '@/components/Icons';

// ── Types ──────────────────────────────────────────────
interface RecordDetail {
  id: string;
  date: string;
  clinicName: string;
  treatmentType: string;
  description: string;
  treatedTeeth: number[];
  doctorNotes: string;
  nextRecommendations: { text: string; done: boolean }[];
}

// ── Treatment tag color mapping ──────────────────────
const treatmentColors: Record<string, { bg: string; color: string }> = {
  스케일링: { bg: 'var(--color-primary-bg)', color: 'var(--color-primary)' },
  충치치료: { bg: '#FFF3E0', color: 'var(--color-warning)' },
  신경치료: { bg: '#FFEBEE', color: 'var(--color-danger)' },
  레진: { bg: '#E8F5E9', color: 'var(--color-success)' },
  크라운: { bg: '#F3E5F5', color: '#9C27B0' },
  발치: { bg: '#FFEBEE', color: 'var(--color-danger)' },
  임플란트: { bg: '#E0F7FA', color: '#00838F' },
  인레이: { bg: '#FFF8E1', color: '#F57F17' },
  기타: { bg: '#F5F5F5', color: 'var(--color-text-secondary)' },
};

// ── Mock Data ────────────────────────────────────────
const mockDetails: Record<string, RecordDetail> = {
  '1': {
    id: '1',
    date: '2025.03.12',
    clinicName: '서울밝은치과',
    treatmentType: '스케일링',
    description: '정기 스케일링 및 치석 제거 완료. 전체적으로 치석이 많이 쌓여 있었으며, 특히 하악 전치부 설면에 치석이 집중되어 있었습니다. 잇몸 상태는 양호하나 칫솔질 방법 개선이 필요합니다.',
    treatedTeeth: [31, 32, 33, 41, 42, 43],
    doctorNotes: '하악 전치부 치석이 많았으나 깨끗하게 제거 완료. 칫솔질 시 잇몸 경계 부분을 더 신경 써서 닦아주세요. 치간 칫솔 사용을 권장합니다.',
    nextRecommendations: [
      { text: '6개월 후 스케일링 재방문', done: false },
      { text: '치간 칫솔 사용 시작', done: false },
      { text: '바스법 칫솔질 연습', done: true },
    ],
  },
  '2': {
    id: '2',
    date: '2025.02.28',
    clinicName: '강남연세치과',
    treatmentType: '충치치료',
    description: '좌측 하단 어금니(#36) 교합면에 발생한 중간 크기 충치를 레진으로 충전 치료하였습니다. 충치가 상아질까지 진행되었으나 신경에 가까운 정도는 아니었습니다.',
    treatedTeeth: [36],
    doctorNotes: '레진 충전 후 교합 조정 완료. 치료 후 2~3일간 시린 증상이 있을 수 있습니다. 단단한 음식은 당분간 반대쪽으로 씹어주세요.',
    nextRecommendations: [
      { text: '1주일 후 경과 확인 내원', done: true },
      { text: '반대쪽 어금니 충치 검진', done: false },
      { text: '증상 발생 시 즉시 내원', done: false },
    ],
  },
  '3': {
    id: '3',
    date: '2025.01.15',
    clinicName: '서울밝은치과',
    treatmentType: '신경치료',
    description: '우측 상단 어금니(#16) 신경치료 1차 진행. 깊은 충치로 인해 신경까지 감염이 진행되어 신경치료를 시작하였습니다. 총 3회 내원이 필요합니다.',
    treatedTeeth: [16],
    doctorNotes: '신경 제거 후 임시 충전재를 넣었습니다. 다음 방문 시까지 해당 부위로 씹지 마세요. 통증이 심할 경우 처방 받은 진통제를 복용하세요.',
    nextRecommendations: [
      { text: '2주 후 신경치료 2차 내원', done: true },
      { text: '4주 후 신경치료 3차 (근관 충전)', done: false },
      { text: '신경치료 완료 후 크라운 보철', done: false },
    ],
  },
  '4': {
    id: '4',
    date: '2024.12.20',
    clinicName: '미소드림치과',
    treatmentType: '스케일링',
    description: '하반기 정기 스케일링 진행. 전반적으로 구강 상태 양호하며, 상악 구치부에 경미한 치석만 확인되었습니다.',
    treatedTeeth: [14, 15, 16, 24, 25, 26],
    doctorNotes: '구강 위생 상태 양호합니다. 다음 스케일링은 6개월 후에 방문해주세요.',
    nextRecommendations: [
      { text: '6개월 후 스케일링 재방문', done: false },
      { text: '구강 세정기 사용 권장', done: true },
    ],
  },
  '5': {
    id: '5',
    date: '2024.11.05',
    clinicName: '강남연세치과',
    treatmentType: '기타',
    description: '잇몸 염증 검진을 위해 방문. 좌측 하단 잇몸이 부어오르고 출혈이 있어 내원하였습니다. 치주 포켓 검사 결과 경미한 치주염으로 진단되었습니다.',
    treatedTeeth: [34, 35, 36],
    doctorNotes: '경미한 치은염입니다. 처방받은 항생제와 가글을 1주일간 사용해주세요. 증상 개선이 되지 않으면 재방문 하세요.',
    nextRecommendations: [
      { text: '1주일 후 경과 확인', done: true },
      { text: '증상 발생 시 즉시 내원', done: false },
    ],
  },
  '6': {
    id: '6',
    date: '2024.09.18',
    clinicName: '서울밝은치과',
    treatmentType: '충치치료',
    description: '우측 상단 소구치(#15) 인레이 치료 완료. 기존 아말감 충전물을 제거하고 세라믹 인레이로 교체하였습니다.',
    treatedTeeth: [15],
    doctorNotes: '인레이 접착 완료. 24시간 동안 끈적한 음식은 피해주세요. 교합 불편감이 있으면 내원해주세요.',
    nextRecommendations: [
      { text: '1주일 후 교합 점검', done: true },
      { text: '6개월 후 정기 검진', done: false },
    ],
  },
};

// ── Tooth Map Component ──────────────────────────────
function ToothMap({ treatedTeeth }: { treatedTeeth: number[] }) {
  // Simplified FDI tooth numbering system representation
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  const renderToothRow = (teeth: number[]) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {teeth.map((num) => {
        const isActive = treatedTeeth.includes(num);
        return (
          <div
            key={num}
            style={{
              width: 28,
              height: 28,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: isActive ? 700 : 400,
              background: isActive ? 'var(--color-primary)' : 'var(--color-background)',
              color: isActive ? '#FFFFFF' : 'var(--color-text-tertiary)',
              border: isActive ? 'none' : '1px solid var(--color-border)',
              transition: 'all 0.2s ease',
            }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
      {/* Upper jaw */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {renderToothRow(upperRight)}
        <div style={{ width: 1, background: 'var(--color-border)' }} />
        {renderToothRow(upperLeft)}
      </div>
      {/* Divider */}
      <div
        style={{
          width: '100%',
          height: 1,
          background: 'var(--color-border)',
          margin: '2px 0',
        }}
      />
      {/* Lower jaw */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {renderToothRow(lowerRight)}
        <div style={{ width: 1, background: 'var(--color-border)' }} />
        {renderToothRow(lowerLeft)}
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────
export default function RecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const record = mockDetails[id];

  if (!record) {
    return (
      <>
        {/* Header */}
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
            gap: '12px',
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
            }}
            aria-label="뒤로가기"
          >
            <ArrowLeftIcon size={22} color="var(--color-text-primary)" />
          </button>
          <span style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            방문 기록
          </span>
        </header>

        <div className="page-container-no-tab">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 20px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 'var(--font-lg)', color: 'var(--color-text-secondary)' }}>
              기록을 찾을 수 없습니다
            </p>
          </div>
        </div>
      </>
    );
  }

  const tagColor = treatmentColors[record.treatmentType] || treatmentColors['기타'];

  const handleDelete = () => {
    setShowDeleteModal(false);
    router.push('/records');
  };

  return (
    <>
      {/* Header */}
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
          gap: '12px',
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
          }}
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon size={22} color="var(--color-text-primary)" />
        </button>
        <span style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          방문 기록
        </span>
      </header>

      <div className="page-container-no-tab">
        <div style={{ padding: 'var(--spacing-xl)', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>

          {/* ── Visit Info Card ────────────────── */}
          <Card>
            {/* Date and tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <CalendarIcon size={16} color="var(--color-text-tertiary)" />
                {record.date}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: 600,
                  background: tagColor.bg,
                  color: tagColor.color,
                }}
              >
                {record.treatmentType}
              </span>
            </div>

            {/* Clinic name */}
            <h2
              style={{
                fontSize: 'var(--font-xl)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '12px',
              }}
            >
              {record.clinicName}
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: 'var(--font-md)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                marginBottom: '20px',
              }}
            >
              {record.description}
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--color-border-light)', margin: '4px 0 16px' }} />

            {/* Treated teeth section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <ToothIcon size={18} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  치료 부위
                </span>
              </div>
              <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                <ToothMap treatedTeeth={record.treatedTeeth} />
              </div>
              <p
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--color-text-tertiary)',
                  marginTop: '8px',
                }}
              >
                치아 번호: {record.treatedTeeth.join(', ')}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--color-border-light)', margin: '4px 0 16px' }} />

            {/* Doctor notes */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <EditIcon size={18} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: 'var(--font-base)',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  의사 소견
                </span>
              </div>
              <div
                style={{
                  background: 'var(--color-background)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                }}
              >
                <p
                  style={{
                    fontSize: 'var(--font-md)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  {record.doctorNotes}
                </p>
              </div>
            </div>
          </Card>

          {/* ── Next Recommendations Card ─────── */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarIcon size={16} color="var(--color-primary)" />
              </div>
              <span
                style={{
                  fontSize: 'var(--font-base)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                다음 추천
              </span>
            </div>

            {/* Timeline / checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {record.nextRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    position: 'relative',
                    paddingBottom: idx < record.nextRecommendations.length - 1 ? '20px' : '0',
                  }}
                >
                  {/* Timeline line */}
                  {idx < record.nextRecommendations.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 11,
                        top: 24,
                        bottom: 0,
                        width: 2,
                        background: 'var(--color-border-light)',
                      }}
                    />
                  )}

                  {/* Check circle */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 'var(--radius-full)',
                      background: rec.done ? 'var(--color-success)' : 'var(--color-background)',
                      border: rec.done ? 'none' : '2px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {rec.done && <CheckIcon size={14} color="#FFFFFF" />}
                  </div>

                  {/* Text */}
                  <span
                    style={{
                      fontSize: 'var(--font-md)',
                      color: rec.done ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                      textDecoration: rec.done ? 'line-through' : 'none',
                      lineHeight: '24px',
                      fontWeight: rec.done ? 400 : 500,
                    }}
                  >
                    {rec.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Action Buttons ────────────────── */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push(`/records/add?edit=${record.id}`)}
            >
              <EditIcon size={18} color="var(--color-primary)" />
              수정
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => setShowDeleteModal(true)}
            >
              삭제
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="기록 삭제"
      >
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <p
            style={{
              fontSize: 'var(--font-base)',
              color: 'var(--color-text-secondary)',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}
          >
            이 방문 기록을 삭제하시겠습니까?
            <br />
            삭제된 기록은 복구할 수 없습니다.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowDeleteModal(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleDelete}
              style={{
                background: 'var(--color-danger)',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
