'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { CalendarIcon, CloseIcon, CheckIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   예약 상태 및 데이터 타입
──────────────────────────────────────── */
type AppointmentStatus = '예정' | '완료' | '취소';

interface Appointment {
  id: string;
  clinicName: string;
  date: string;
  time: string;
  treatment: string;
  status: AppointmentStatus;
}

const appointments: Appointment[] = [
  {
    id: 'a1',
    clinicName: '강남치과',
    date: '2025.04.15',
    time: '14:00',
    treatment: '스케일링',
    status: '예정',
  },
  {
    id: 'a2',
    clinicName: '서울치과',
    date: '2025.03.20',
    time: '10:30',
    treatment: '레진치료',
    status: '완료',
  },
  {
    id: 'a3',
    clinicName: '강남치과',
    date: '2025.03.01',
    time: '11:00',
    treatment: '신경치료',
    status: '완료',
  },
  {
    id: 'a4',
    clinicName: '역삼치과',
    date: '2025.02.15',
    time: '15:00',
    treatment: '스케일링',
    status: '취소',
  },
  {
    id: 'a5',
    clinicName: '서울치과',
    date: '2025.01.10',
    time: '09:30',
    treatment: '크라운',
    status: '완료',
  },
];

const tabFilters = ['전체', '예정', '완료', '취소'] as const;

/* ────────────────────────────────────────
   상태 배지 스타일 헬퍼
──────────────────────────────────────── */
function getStatusBadge(status: AppointmentStatus) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-xs)',
    fontWeight: 600,
    lineHeight: 1,
  };

  switch (status) {
    case '예정':
      return (
        <span style={{ ...baseStyle, background: 'var(--color-primary-bg)', color: 'var(--color-primary)' }}>
          <CalendarIcon size={12} color="var(--color-primary)" />
          예정
        </span>
      );
    case '완료':
      return (
        <span style={{ ...baseStyle, background: '#E8F5E9', color: 'var(--color-success)' }}>
          <CheckIcon size={12} color="var(--color-success)" />
          완료
        </span>
      );
    case '취소':
      return (
        <span style={{ ...baseStyle, background: '#F5F5F5', color: 'var(--color-text-tertiary)' }}>
          <CloseIcon size={12} color="var(--color-text-tertiary)" />
          취소
        </span>
      );
  }
}

/* ────────────────────────────────────────
   상태별 액션 버튼 헬퍼
──────────────────────────────────────── */
function getActionButtons(status: AppointmentStatus) {
  switch (status) {
    case '예정':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'var(--spacing-md)' }}>
          <Button variant="outline" size="sm">
            예약 취소
          </Button>
          <button
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 500,
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 4px',
            }}
          >
            길찾기
          </button>
        </div>
      );
    case '완료':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'var(--spacing-md)' }}>
          <Button variant="outline" size="sm">
            리뷰 작성
          </Button>
          <button
            style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 500,
              color: 'var(--color-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 4px',
            }}
          >
            다시 예약
          </button>
        </div>
      );
    case '취소':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'var(--spacing-md)' }}>
          <Button variant="outline" size="sm">
            다시 예약
          </Button>
        </div>
      );
  }
}

/* ────────────────────────────────────────
   예약 내역 페이지
──────────────────────────────────────── */
export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<string>('전체');

  const filteredAppointments =
    activeTab === '전체'
      ? appointments
      : appointments.filter((a) => a.status === activeTab);

  return (
    <>
      <Header title="예약 내역" showBack showNotification={false} showProfile={false} />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)' }}>
        {/* ── 탭 필터 ── */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            padding: 'var(--spacing-lg) var(--spacing-xl)',
            background: 'var(--color-background-white)',
            borderBottom: '1px solid var(--color-border-light)',
          }}
        >
          {tabFilters.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  background: isActive ? 'var(--color-primary)' : 'var(--color-background)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── 예약 목록 ── */}
        <div style={{ padding: 'var(--spacing-lg) var(--spacing-xl)' }}>
          {filteredAppointments.length === 0 ? (
            /* ── 빈 상태 ── */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                gap: 12,
              }}
            >
              <CalendarIcon size={48} color="var(--color-text-tertiary)" />
              <p
                style={{
                  fontSize: 'var(--font-base)',
                  color: 'var(--color-text-tertiary)',
                  textAlign: 'center',
                }}
              >
                해당 예약 내역이 없습니다
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} padding="var(--spacing-xl)">
                  {/* 상단: 상태 배지 + 날짜 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    {getStatusBadge(appointment.status)}
                    <span
                      style={{
                        fontSize: 'var(--font-xs)',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {appointment.date}
                    </span>
                  </div>

                  {/* 병원 이름 */}
                  <p
                    style={{
                      fontSize: 'var(--font-lg)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    {appointment.clinicName}
                  </p>

                  {/* 진료 정보 */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-lg)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CalendarIcon size={14} color="var(--color-text-tertiary)" />
                      <span
                        style={{
                          fontSize: 'var(--font-sm)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {appointment.date} {appointment.time}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-sm)',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-text-tertiary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2C10.08 2 8.5 2.74 7.5 4.2C6.78 3.3 5.58 2.6 4 2.6C4 6.6 5.5 9 7.5 11.5C5 14.5 4 17 4 20H7.5C7.5 17.5 8.8 15 12 13.5C15.2 15 16.5 17.5 16.5 20H20C20 17 19 14.5 16.5 11.5C18.5 9 20 6.6 20 2.6C18.42 2.6 17.22 3.3 16.5 4.2C15.5 2.74 13.92 2 12 2Z" />
                      </svg>
                      {appointment.treatment}
                    </span>
                  </div>

                  {/* 구분선 */}
                  <div
                    style={{
                      height: 1,
                      background: 'var(--color-border-light)',
                      margin: 'var(--spacing-md) 0 0 0',
                    }}
                  />

                  {/* 액션 버튼 */}
                  {getActionButtons(appointment.status)}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
