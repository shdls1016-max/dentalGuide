'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { CalendarIcon } from '@/components/Icons';

/* ────────────────────────────────────────
   Helpers
──────────────────────────────────────── */
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const treatmentTypes = [
  '스케일링',
  '충치치료',
  '신경치료',
  '크라운',
  '임플란트',
  '교정 상담',
  '미백',
  '검진',
  '기타',
];

const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const afternoonSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

// Some slots marked as unavailable for realism
const unavailableSlots = new Set(['10:00', '14:30', '16:30']);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/* ────────────────────────────────────────
   Appointment Page
──────────────────────────────────────── */
export default function AppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'morning' | 'afternoon'>('morning');
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [memo, setMemo] = useState('');

  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const isToday = (day: number) =>
    currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate();

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const isSunday = (day: number) => {
    return new Date(currentYear, currentMonth, day).getDay() === 0;
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const timeSlots = timePeriod === 'morning' ? morningSlots : afternoonSlots;

  const isValid = selectedDate !== null && selectedTime !== null && selectedTreatment !== '';

  return (
    <>
      <Header
        title="예약하기"
        showBack
        onBack={() => router.back()}
        showNotification={false}
        showProfile={false}
      />

      <main className="page-container-no-tab" style={{ background: 'var(--color-background)', paddingBottom: 120 }}>
        <div style={{ padding: '0 var(--spacing-xl)' }}>

          {/* Calendar */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
            {/* Month Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <button
                onClick={prevMonth}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  background: 'var(--color-background)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarIcon size={18} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: 'var(--font-lg)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {currentYear}년 {currentMonth + 1}월
                </span>
              </div>

              <button
                onClick={nextMonth}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  background: 'var(--color-background)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18L15 12L9 6" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0,
                marginBottom: 8,
              }}
            >
              {DAY_LABELS.map((day, idx) => (
                <div
                  key={day}
                  style={{
                    textAlign: 'center',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 600,
                    color: idx === 0 ? 'var(--color-danger)' : idx === 6 ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                    padding: '8px 0',
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 2,
              }}
            >
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} style={{ height: 42 }} />;
                }

                const past = isPast(day);
                const sunday = isSunday(day);
                const todayDate = isToday(day);
                const selected = selectedDate === day;
                const unavailable = past || sunday;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (!unavailable) {
                        setSelectedDate(day);
                        setSelectedTime(null);
                      }
                    }}
                    disabled={unavailable}
                    style={{
                      height: 42,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-md)',
                      fontWeight: selected ? 700 : todayDate ? 600 : 400,
                      background: selected
                        ? 'var(--color-primary)'
                        : todayDate
                        ? 'var(--color-primary-bg)'
                        : 'transparent',
                      color: selected
                        ? '#FFFFFF'
                        : unavailable
                        ? 'var(--color-border)'
                        : sunday
                        ? 'var(--color-danger)'
                        : todayDate
                        ? 'var(--color-primary)'
                        : 'var(--color-text-primary)',
                      cursor: unavailable ? 'default' : 'pointer',
                      opacity: unavailable ? 0.4 : 1,
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {day}
                    {todayDate && !selected && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: 'var(--color-primary)',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Time Slot Selection */}
          {selectedDate && (
            <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
              <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 14 }}>
                시간 선택
              </h3>

              {/* Morning / Afternoon Toggle */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--color-background)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 3,
                  marginBottom: 16,
                }}
              >
                <button
                  onClick={() => {
                    setTimePeriod('morning');
                    setSelectedTime(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 'var(--radius-button)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 600,
                    background: timePeriod === 'morning' ? 'var(--color-background-white)' : 'transparent',
                    color: timePeriod === 'morning' ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                    boxShadow: timePeriod === 'morning' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  오전
                </button>
                <button
                  onClick={() => {
                    setTimePeriod('afternoon');
                    setSelectedTime(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 'var(--radius-button)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 600,
                    background: timePeriod === 'afternoon' ? 'var(--color-background-white)' : 'transparent',
                    color: timePeriod === 'afternoon' ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                    boxShadow: timePeriod === 'afternoon' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  오후
                </button>
              </div>

              {/* Time Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                }}
              >
                {timeSlots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot);
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      key={slot}
                      onClick={() => {
                        if (!isUnavailable) setSelectedTime(slot);
                      }}
                      disabled={isUnavailable}
                      style={{
                        padding: '12px 0',
                        borderRadius: 'var(--radius-button)',
                        fontSize: 'var(--font-md)',
                        fontWeight: isSelected ? 700 : 500,
                        background: isSelected
                          ? 'var(--color-primary)'
                          : isUnavailable
                          ? 'var(--color-background)'
                          : 'var(--color-background-white)',
                        color: isSelected
                          ? '#FFFFFF'
                          : isUnavailable
                          ? 'var(--color-border)'
                          : 'var(--color-text-primary)',
                        border: isSelected
                          ? 'none'
                          : isUnavailable
                          ? '1px solid var(--color-border-light)'
                          : '1px solid var(--color-border)',
                        cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        opacity: isUnavailable ? 0.5 : 1,
                        transition: 'all 0.15s ease',
                        textDecoration: isUnavailable ? 'line-through' : 'none',
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Treatment Type */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 14 }}>
              진료 항목
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {treatmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTreatment(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 500,
                    border: selectedTreatment === type ? 'none' : '1px solid var(--color-border)',
                    background: selectedTreatment === type ? 'var(--color-primary)' : 'var(--color-background-white)',
                    color: selectedTreatment === type ? '#FFFFFF' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>

          {/* Memo */}
          <Card style={{ marginTop: 'var(--spacing-lg)' }} padding="20px">
            <h3 style={{ fontSize: 'var(--font-base)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 14 }}>
              메모
            </h3>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="치과에 전달할 내용이 있다면 작성해주세요 (선택)"
              style={{
                width: '100%',
                minHeight: 100,
                padding: '14px 16px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-background)',
                fontSize: 'var(--font-md)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
          </Card>

          {/* Selected Summary */}
          {isValid && (
            <Card
              style={{ marginTop: 'var(--spacing-lg)', border: '1.5px solid var(--color-primary)', background: 'var(--color-primary-bg)' }}
              padding="16px"
            >
              <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 10 }}>
                예약 정보 확인
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)' }}>날짜</span>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {currentYear}년 {currentMonth + 1}월 {selectedDate}일
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)' }}>시간</span>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {selectedTime}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-tertiary)' }}>진료 항목</span>
                  <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {selectedTreatment}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 'var(--max-width)',
          padding: '12px var(--spacing-xl)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          background: 'var(--color-background-white)',
          borderTop: '1px solid var(--color-border-light)',
          zIndex: 100,
        }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isValid}
          onClick={() => {
            alert(`예약이 완료되었습니다!\n${currentYear}년 ${currentMonth + 1}월 ${selectedDate}일 ${selectedTime}\n${selectedTreatment}`);
            router.back();
          }}
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          예약 확인
        </Button>
      </div>
    </>
  );
}
