'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeftIcon, StarIcon, CheckIcon, ChevronRightIcon } from '@/components/Icons';
import Card from '@/components/Card';

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface StepInfo {
  title: string;
  description: string;
  time: string;
}

interface PainEntry {
  stage: string;
  level: number;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CostInfo {
  range: string;
  insurance: string;
  factors: string[];
}

interface CareItem {
  text: string;
}

interface CautionInfo {
  before: CareItem[];
  after: CareItem[];
  revisit: string[];
}

interface TreatmentData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  shortDesc: string;
  calmingText: string;
  steps: StepInfo[];
  pain: PainEntry[];
  faq: FAQ[];
  cost: CostInfo;
  caution: CautionInfo;
}

/* ─────────────────────────────────────────────
   Treatment data (comprehensive)
   ───────────────────────────────────────────── */
const treatmentsData: Record<string, TreatmentData> = {
  scaling: {
    id: 'scaling',
    name: '스케일링',
    emoji: '🪥',
    color: '#4A90D9',
    shortDesc: '치석과 치태를 제거하여 잇몸 건강을 지키는 기본 치료입니다.',
    calmingText:
      '많은 분들이 스케일링 통증을 걱정하시지만, 실제로는 약간의 시린 느낌 정도입니다. 대부분의 환자분들이 "생각보다 안 아팠다"고 말씀하십니다. 치석이 많이 쌓인 경우 초음파 기구의 진동이 느껴질 수 있으나, 참을 수 없는 수준은 아닙니다.',
    steps: [
      {
        title: '검진 및 상담',
        description: '구강 상태를 확인하고 치석 분포를 파악합니다. 잇몸 상태와 출혈 여부도 함께 체크합니다.',
        time: '약 5분',
      },
      {
        title: '초음파 스케일링',
        description: '초음파 진동을 이용해 치아 표면과 잇몸 경계에 붙은 치석을 제거합니다.',
        time: '약 15~20분',
      },
      {
        title: '미세 연마',
        description: '치아 표면을 매끄럽게 연마하여 치석이 다시 쉽게 붙지 않도록 합니다.',
        time: '약 5~10분',
      },
      {
        title: '마무리 및 안내',
        description: '구강 위생 관리법과 주의사항을 안내받습니다. 필요시 다음 내원 일정을 잡습니다.',
        time: '약 5분',
      },
    ],
    pain: [
      { stage: '시술 전 준비', level: 1, description: '통증 거의 없음 - 간단한 검진만 진행합니다.' },
      { stage: '스케일링 중', level: 2, description: '약간의 시림 - 초음파 진동과 물 분사로 시린 느낌이 있을 수 있습니다.' },
      { stage: '시술 후', level: 2, description: '일시적 시림 - 1~2일간 차가운 음식에 시릴 수 있으나 곧 사라집니다.' },
    ],
    faq: [
      {
        question: '스케일링이 치아를 깎아내나요?',
        answer:
          '아닙니다. 스케일링은 치아 표면에 붙은 치석만 제거하는 것으로, 치아 자체를 깎는 것이 아닙니다. 치석이 많았던 분은 시술 후 이 사이가 벌어진 느낌이 들 수 있지만, 원래 치석이 차지하던 공간이 비워진 것입니다.',
      },
      {
        question: '치료 시간은 얼마나 걸리나요?',
        answer: '보통 30~40분 정도 소요됩니다. 치석이 많은 경우 두 번에 나눠서 진행하기도 합니다.',
      },
      {
        question: '얼마나 자주 받아야 하나요?',
        answer: '보통 6개월~1년에 한 번 권장됩니다. 잇몸 질환이 있는 경우 3~6개월 간격으로 받는 것이 좋습니다.',
      },
      {
        question: '피가 나는 건 정상인가요?',
        answer:
          '잇몸에 염증이 있는 경우 시술 중 약간의 출혈이 있을 수 있습니다. 이는 정상적인 반응이며, 시술 후 잇몸 건강이 회복되면 출혈도 줄어듭니다.',
      },
    ],
    cost: {
      range: '약 3만원 ~ 5만원',
      insurance: '건강보험 적용 (만 19세 이상, 연 1회)',
      factors: [
        '건강보험 적용 시 본인부담금 약 1만 5천원 내외',
        '잇몸 치료가 필요한 경우 추가 비용 발생 가능',
        '치석 양에 따라 2회에 걸쳐 진행될 수 있음',
        '비보험 스케일링(연 2회 이상) 시 3~5만원',
      ],
    },
    caution: {
      before: [
        { text: '시술 전 양치질을 꼼꼼히 해주세요.' },
        { text: '복용 중인 약이 있으면 사전에 알려주세요.' },
        { text: '혈액 희석제 복용 시 반드시 의사에게 알려주세요.' },
      ],
      after: [
        { text: '시술 후 2시간 동안 음식 섭취를 피해주세요.' },
        { text: '당일 너무 뜨겁거나 매운 음식은 피해주세요.' },
        { text: '1~2일간 시린 증상이 있을 수 있으나 자연스럽게 사라집니다.' },
        { text: '부드러운 칫솔로 꼼꼼히 양치질해주세요.' },
        { text: '잇몸 출혈이 3일 이상 지속되면 내원해주세요.' },
      ],
      revisit: [
        '잇몸 출혈이 멈추지 않는 경우',
        '심한 통증이 지속되는 경우',
        '6개월~1년 후 정기 스케일링',
      ],
    },
  },
  resin: {
    id: 'resin',
    name: '레진',
    emoji: '🦷',
    color: '#5CC6BA',
    shortDesc: '충치 부위를 제거하고 치아색 재료로 채우는 보존 치료입니다.',
    calmingText:
      '레진 치료는 가장 흔한 치과 치료 중 하나입니다. 마취를 하기 때문에 시술 중 통증은 거의 느끼지 못합니다. 마취 주사가 걱정되시는 분도 많지만, 표면 마취를 먼저 해주어 주사 통증도 크게 줄일 수 있습니다.',
    steps: [
      { title: '검진 및 상담', description: '충치 범위를 확인하고 치료 계획을 설명합니다.', time: '약 5분' },
      { title: '부분 마취', description: '치료 부위에 국소 마취를 시행합니다.', time: '약 3분' },
      { title: '충치 제거', description: '충치 부위를 정밀하게 제거합니다.', time: '약 10분' },
      { title: '레진 충전 및 경화', description: '치아색 레진을 채우고 특수 광선으로 굳힙니다.', time: '약 10~15분' },
    ],
    pain: [
      { stage: '마취', level: 1, description: '따끔한 느낌 - 표면 마취 후 진행하여 통증이 적습니다.' },
      { stage: '치료 중', level: 1, description: '거의 무통 - 마취 상태이므로 진동만 느낍니다.' },
      { stage: '치료 후', level: 2, description: '약간의 시림 - 마취가 풀리면서 경미한 시림이 있을 수 있습니다.' },
    ],
    faq: [
      { question: '레진은 얼마나 오래가나요?', answer: '관리에 따라 다르지만 보통 5~7년 이상 유지됩니다. 정기적인 검진을 통해 상태를 확인하는 것이 좋습니다.' },
      { question: '마취가 안 들면요?', answer: '추가 마취를 시행합니다. 시술 중 아프면 언제든 손을 들어 알려주시면 됩니다.' },
      { question: '변색이 되나요?', answer: '커피, 카레 등 착색 음식을 자주 섭취하면 시간이 지나면서 약간의 변색이 있을 수 있습니다.' },
    ],
    cost: {
      range: '약 5만원 ~ 15만원',
      insurance: '일부 건강보험 적용 가능 (치아 위치에 따라)',
      factors: ['충치 크기와 위치에 따라 달라짐', '어금니/앞니 여부에 따른 차이', '광중합형 레진 기준 비용'],
    },
    caution: {
      before: [{ text: '식사를 가볍게 하고 오시는 것이 좋습니다.' }, { text: '알레르기가 있으면 사전에 알려주세요.' }],
      after: [
        { text: '마취가 풀릴 때까지(약 2시간) 음식 섭취를 자제해주세요.' },
        { text: '24시간 동안 착색 음식(커피, 카레 등)을 피해주세요.' },
        { text: '딱딱한 음식은 당일 피해주세요.' },
      ],
      revisit: ['통증이 지속되거나 심해지는 경우', '레진이 떨어지거나 깨진 경우', '6개월 후 정기검진'],
    },
  },
  inlay: {
    id: 'inlay',
    name: '인레이',
    emoji: '🔶',
    color: '#FF9800',
    shortDesc: '충치 범위가 큰 경우 정밀 맞춤 제작한 충전물로 치료합니다.',
    calmingText:
      '인레이는 레진보다 더 정밀하고 내구성이 좋은 치료입니다. 마취 하에 진행되므로 치료 중 통증 걱정은 하지 않으셔도 됩니다. 두 번 내원이 필요하지만, 그만큼 정확하게 맞춤 제작되어 오래 사용할 수 있습니다.',
    steps: [
      { title: '검진 및 상담', description: '충치 범위를 확인하고 인레이 재료를 선택합니다.', time: '약 5분' },
      { title: '마취 및 충치 제거', description: '부분 마취 후 충치를 제거하고 형태를 다듬습니다.', time: '약 15분' },
      { title: '인상 채득 및 임시 충전', description: '정밀 본을 떠서 기공소로 보내고, 임시 재료로 채웁니다.', time: '약 10분' },
      { title: '인레이 접착 (2차 내원)', description: '제작된 인레이를 접착하고 교합을 조절합니다.', time: '약 20분' },
    ],
    pain: [
      { stage: '마취', level: 1, description: '따끔한 느낌 - 국소 마취로 통증을 최소화합니다.' },
      { stage: '치료 중', level: 1, description: '거의 무통 - 마취 상태에서 진행됩니다.' },
      { stage: '치료 후', level: 2, description: '일시적 불편 - 임시 충전물 기간 중 약간의 이물감이 있을 수 있습니다.' },
    ],
    faq: [
      { question: '인레이와 레진의 차이는?', answer: '인레이는 기공소에서 정밀 제작하여 접착하므로 내구성과 적합도가 더 좋습니다. 큰 충치에 적합합니다.' },
      { question: '재료는 어떤 게 좋나요?', answer: '금, 세라믹(도자기), 지르코니아 등이 있으며, 심미성과 내구성을 고려하여 선택합니다.' },
      { question: '치료 기간이 왜 길어지나요?', answer: '기공소에서 맞춤 제작하는 데 약 1주일이 소요되어 보통 2회 내원이 필요합니다.' },
    ],
    cost: {
      range: '약 15만원 ~ 35만원',
      insurance: '비급여 (건강보험 미적용)',
      factors: ['재료에 따라 가격 차이 (금 > 지르코니아 > 세라믹)', '충치 크기에 따른 차이', '치과마다 가격 차이가 있을 수 있음'],
    },
    caution: {
      before: [{ text: '임시 충전 기간 중 해당 부위로 딱딱한 음식을 피해주세요.' }, { text: '2차 내원 날짜를 꼭 지켜주세요.' }],
      after: [
        { text: '접착 후 2시간 동안 음식 섭취를 피해주세요.' },
        { text: '당일 끈적한 음식(껌, 캐러멜 등)을 피해주세요.' },
        { text: '교합이 불편하면 바로 내원해 조절받으세요.' },
      ],
      revisit: ['교합이 높거나 불편한 경우', '인레이가 빠진 경우', '6개월 정기검진'],
    },
  },
  'root-canal': {
    id: 'root-canal',
    name: '신경치료',
    emoji: '🩺',
    color: '#F44336',
    shortDesc: '충치가 신경까지 진행된 경우 감염된 신경을 제거하는 치료입니다.',
    calmingText:
      '신경치료라는 이름 때문에 많이 무서워하시는 분들이 많습니다. 하지만 현대 치과 기술로 마취가 잘 되어 시술 중 통증은 크지 않습니다. 오히려 신경치료를 받지 않으면 염증이 악화되어 더 심한 통증이 올 수 있으므로, 제때 치료하는 것이 중요합니다.',
    steps: [
      { title: '검진 및 X-ray', description: '치아 내부 신경 상태를 정밀 확인합니다.', time: '약 10분' },
      { title: '마취 및 신경 접근', description: '마취 후 치아 상단을 열어 신경관에 접근합니다.', time: '약 10분' },
      { title: '신경 제거 및 소독', description: '감염된 신경을 제거하고 근관을 세척, 소독합니다. 여러 차례 내원이 필요할 수 있습니다.', time: '약 20~30분/회' },
      { title: '근관 충전 및 크라운', description: '깨끗해진 근관을 밀봉하고 크라운으로 보호합니다.', time: '약 20분' },
    ],
    pain: [
      { stage: '마취', level: 2, description: '약간의 통증 - 염증이 심한 경우 마취가 덜 들 수 있으나 추가 마취로 해결합니다.' },
      { stage: '치료 중', level: 2, description: '약간의 불편감 - 기구가 신경관 안에서 움직이는 느낌이 있을 수 있습니다.' },
      { stage: '치료 후', level: 3, description: '일시적 욱신거림 - 진통제로 관리 가능하며, 2~3일 내 호전됩니다.' },
    ],
    faq: [
      { question: '마취가 안 들면요?', answer: '염증이 심한 경우 마취가 잘 안 들 수 있습니다. 추가 마취나 다른 마취 방법을 사용하여 통증 없이 진행합니다.' },
      { question: '치료 횟수는 몇 번인가요?', answer: '보통 2~4회 내원이 필요합니다. 염증 상태에 따라 달라집니다.' },
      { question: '신경치료 후 치아가 약해지나요?', answer: '신경이 제거되면 치아에 영양 공급이 줄어 약해질 수 있어서, 대부분 크라운으로 보호합니다.' },
    ],
    cost: {
      range: '약 7만원 ~ 20만원 (크라운 별도)',
      insurance: '건강보험 적용 (본인부담 30%)',
      factors: ['치아 위치(앞니/어금니)에 따른 차이', '근관 수에 따라 달라짐', '크라운 비용은 별도 (20~50만원)'],
    },
    caution: {
      before: [{ text: '통증이 심한 경우 진통제를 복용하고 오셔도 됩니다.' }, { text: '복용 약물을 사전에 알려주세요.' }],
      after: [
        { text: '치료 부위로 딱딱한 음식을 씹지 마세요.' },
        { text: '처방된 항생제와 진통제를 정해진 대로 복용하세요.' },
        { text: '임시 충전물이 빠지면 바로 내원하세요.' },
        { text: '다음 예약일을 반드시 지켜주세요.' },
      ],
      revisit: ['심한 통증이나 부기가 생긴 경우', '임시 충전물이 빠진 경우', '예약된 치료 일정'],
    },
  },
  crown: {
    id: 'crown',
    name: '크라운',
    emoji: '👑',
    color: '#9C27B0',
    shortDesc: '손상되거나 약해진 치아를 보호하기 위해 전체를 씌우는 보철 치료입니다.',
    calmingText:
      '크라운은 약해진 치아를 보호하는 가장 확실한 방법입니다. 마취 하에 치아를 다듬는 과정이 있지만, 통증은 거의 없습니다. 최종 크라운이 장착되면 자연치아와 거의 동일한 느낌으로 편안하게 사용하실 수 있습니다.',
    steps: [
      { title: '검진 및 상담', description: '치아 상태를 확인하고 크라운 재료를 선택합니다.', time: '약 10분' },
      { title: '마취 및 치아 삭제', description: '마취 후 크라운이 씌워질 수 있도록 치아를 다듬습니다.', time: '약 20분' },
      { title: '인상 채득 및 임시 크라운', description: '정밀 본을 떠서 기공소로 보내고 임시 크라운을 장착합니다.', time: '약 15분' },
      { title: '최종 크라운 접착 (2차 내원)', description: '완성된 크라운을 접착하고 교합을 조절합니다.', time: '약 20분' },
    ],
    pain: [
      { stage: '마취', level: 1, description: '따끔한 느낌 - 국소 마취로 통증을 최소화합니다.' },
      { stage: '치료 중', level: 1, description: '거의 무통 - 진동과 압력만 느낍니다.' },
      { stage: '치료 후', level: 2, description: '경미한 시림 - 임시 크라운 기간 중 약간 시릴 수 있습니다.' },
    ],
    faq: [
      { question: '크라운 재료는 뭐가 좋나요?', answer: '지르코니아, PFM(금속+도자기), 금 등이 있습니다. 심미성은 지르코니아, 내구성은 금이 우수합니다.' },
      { question: '크라운 수명은 얼마나 되나요?', answer: '재료와 관리에 따라 10~15년 이상 사용 가능합니다.' },
      { question: '임시 크라운이 빠지면요?', answer: '가능한 빨리 치과에 내원하셔서 다시 부착받으세요. 방치하면 치아가 이동할 수 있습니다.' },
    ],
    cost: {
      range: '약 20만원 ~ 60만원',
      insurance: '일부 건강보험 적용 가능 (치아 종류에 따라)',
      factors: ['재료(지르코니아/PFM/금)에 따른 가격 차이', '앞니/어금니 위치에 따른 차이', '신경치료 동반 시 추가 비용'],
    },
    caution: {
      before: [{ text: '임시 크라운 기간 중 끈적한 음식을 피해주세요.' }, { text: '2차 내원 일정을 꼭 지켜주세요.' }],
      after: [
        { text: '접착 후 1시간 동안 음식 섭취를 피해주세요.' },
        { text: '24시간 동안 끈적한 음식을 피해주세요.' },
        { text: '교합이 높거나 불편하면 바로 내원하세요.' },
        { text: '치실 사용 시 크라운 주변을 꼼꼼히 관리하세요.' },
      ],
      revisit: ['교합이 불편하거나 높은 경우', '크라운이 흔들리거나 빠진 경우', '주변 잇몸에 문제가 생긴 경우'],
    },
  },
  extraction: {
    id: 'extraction',
    name: '발치',
    emoji: '🔧',
    color: '#607D8B',
    shortDesc: '살릴 수 없는 치아를 안전하게 뽑는 시술입니다.',
    calmingText:
      '발치라는 단어가 무서울 수 있지만, 마취가 충분히 된 상태에서 진행되므로 시술 중 통증은 거의 없습니다. 압력감은 느낄 수 있지만 아픈 것과는 다릅니다. 시술 후 관리만 잘하시면 회복도 빠릅니다.',
    steps: [
      { title: '검진 및 상담', description: 'X-ray로 치아 뿌리 상태를 확인하고 시술 방법을 설명합니다.', time: '약 10분' },
      { title: '마취', description: '해당 부위에 충분한 국소 마취를 시행합니다.', time: '약 5분' },
      { title: '발치 시술', description: '기구를 이용해 치아를 안전하게 제거합니다.', time: '약 10~30분' },
      { title: '지혈 및 안내', description: '거즈를 물어 지혈하고, 시술 후 주의사항을 안내합니다.', time: '약 10분' },
    ],
    pain: [
      { stage: '마취', level: 2, description: '약간의 통증 - 마취 주사 시 따끔한 느낌이 있습니다.' },
      { stage: '시술 중', level: 2, description: '압력감 - 통증은 없으나 누르는 느낌이 있을 수 있습니다.' },
      { stage: '시술 후', level: 3, description: '욱신거림 - 마취 해제 후 진통제로 관리합니다. 2~3일 후 호전됩니다.' },
    ],
    faq: [
      { question: '사랑니도 꼭 빼야 하나요?', answer: '누운 사랑니나 충치가 생긴 사랑니는 발치를 권장합니다. 정상적으로 난 경우 관찰합니다.' },
      { question: '발치 후 뭘 먹을 수 있나요?', answer: '부드러운 음식(죽, 수프 등)을 차갑게 드세요. 빨대 사용은 피해주세요.' },
      { question: '붓기가 얼마나 가나요?', answer: '보통 2~3일째 가장 붓고, 5~7일이면 대부분 가라앉습니다.' },
    ],
    cost: {
      range: '약 1만원 ~ 5만원 (단순 발치)',
      insurance: '건강보험 적용',
      factors: ['단순 발치 vs 매복 발치(사랑니)에 따른 차이', '매복 사랑니의 경우 약 10~20만원', '전신마취가 필요한 경우 추가 비용'],
    },
    caution: {
      before: [{ text: '당일 음주는 금해주세요.' }, { text: '복용 중인 혈액 희석제가 있으면 반드시 알려주세요.' }],
      after: [
        { text: '거즈는 1시간 동안 꽉 물고 계세요.' },
        { text: '당일 빨대 사용, 뱉기, 강한 양치질을 피해주세요.' },
        { text: '2~3일간 부드러운 음식 위주로 드세요.' },
        { text: '얼음찜질로 붓기를 관리하세요 (20분 찜질, 20분 휴식).' },
        { text: '처방약을 정해진 대로 복용하세요.' },
      ],
      revisit: ['출혈이 멈추지 않는 경우', '심한 부기나 발열이 있는 경우', '일주일 후 경과 확인'],
    },
  },
  implant: {
    id: 'implant',
    name: '임플란트',
    emoji: '⚙️',
    color: '#3F51B5',
    shortDesc: '빠진 치아 자리에 인공 치아 뿌리를 심고 보철물을 연결하는 치료입니다.',
    calmingText:
      '임플란트는 수술이라는 단어 때문에 겁이 나실 수 있지만, 마취 하에 진행되므로 시술 중 통증은 거의 없습니다. 오히려 시술 자체보다 발치가 더 아프다고 느끼시는 분들도 많습니다. 현대 임플란트 기술은 매우 발전하여 성공률이 95% 이상입니다.',
    steps: [
      { title: '정밀 검진', description: 'CT 촬영으로 뼈 상태를 확인하고 수술 계획을 수립합니다.', time: '약 30분' },
      { title: '임플란트 식립', description: '마취 후 잇몸을 열고 임플란트(인공 뿌리)를 뼈에 심습니다.', time: '약 30~60분' },
      { title: '치유 기간', description: '뼈와 임플란트가 결합되도록 기다립니다.', time: '약 2~6개월' },
      { title: '보철물 제작 및 장착', description: '잇몸 상태 확인 후 최종 보철물(크라운)을 장착합니다.', time: '약 2~3주' },
    ],
    pain: [
      { stage: '마취', level: 1, description: '따끔한 느낌 - 충분한 마취로 통증을 최소화합니다.' },
      { stage: '수술 중', level: 1, description: '거의 무통 - 마취 상태에서 진동과 압력만 느낍니다.' },
      { stage: '수술 후', level: 3, description: '부기와 통증 - 진통제와 항생제로 관리하며, 3~5일 후 호전됩니다.' },
    ],
    faq: [
      { question: '임플란트 수명은 얼마나 되나요?', answer: '잘 관리하면 10년 이상, 평생 사용하시는 분도 많습니다. 정기적인 검진과 관리가 중요합니다.' },
      { question: '뼈가 부족하면 불가능한가요?', answer: '뼈이식술을 통해 가능한 경우가 많습니다. 정밀 검진 후 판단합니다.' },
      { question: '전체 치료 기간은?', answer: '보통 3~6개월 정도 소요됩니다. 뼈이식이 필요한 경우 더 길어질 수 있습니다.' },
    ],
    cost: {
      range: '약 80만원 ~ 180만원 (1개당)',
      insurance: '만 65세 이상 건강보험 적용 (평생 2개)',
      factors: ['임플란트 브랜드에 따른 차이', '뼈이식 필요 시 추가 비용 (30~80만원)', '보철물(크라운) 재료에 따른 차이', '치과마다 가격 차이가 있을 수 있음'],
    },
    caution: {
      before: [
        { text: '수술 전 금식이 필요할 수 있습니다 (전신마취 시).' },
        { text: '흡연자는 수술 2주 전부터 금연을 권장합니다.' },
        { text: '복용 약물을 반드시 알려주세요.' },
      ],
      after: [
        { text: '수술 후 2~3일간 부드러운 음식을 드세요.' },
        { text: '금연, 금주는 최소 2주간 지켜주세요.' },
        { text: '처방약을 빠짐없이 복용하세요.' },
        { text: '얼음찜질로 붓기를 관리하세요.' },
        { text: '수술 부위 자극을 피하고 부드러운 칫솔로 관리하세요.' },
      ],
      revisit: ['심한 출혈이나 부기가 지속되는 경우', '임플란트 부위에 통증이 심한 경우', '정기 검진 일정 (3~6개월 간격)'],
    },
  },
  dentures: {
    id: 'dentures',
    name: '틀니',
    emoji: '🫧',
    color: '#00BCD4',
    shortDesc: '여러 개의 치아가 빠진 경우 탈부착식 보철물로 기능을 회복합니다.',
    calmingText:
      '틀니는 오랜 역사를 가진 안전하고 검증된 치료법입니다. 처음에는 이물감이 있을 수 있지만, 대부분 2~4주 정도 적응 기간을 거치면 편안하게 사용하실 수 있습니다. 최근 기술의 발달로 점점 더 자연스럽고 편안한 틀니가 만들어지고 있습니다.',
    steps: [
      { title: '검진 및 상담', description: '구강 상태를 확인하고 틀니 종류(부분/전체)를 결정합니다.', time: '약 20분' },
      { title: '인상 채득', description: '정밀한 본을 떠서 맞춤 틀니를 제작합니다. 여러 차례 본 작업이 필요합니다.', time: '약 30분/회' },
      { title: '시적 및 조정', description: '제작된 틀니를 시험 장착하고 맞춤 조정합니다.', time: '약 30분' },
      { title: '최종 장착 및 교육', description: '완성된 틀니를 장착하고 착용법, 관리법을 교육합니다.', time: '약 30분' },
    ],
    pain: [
      { stage: '인상 채득', level: 1, description: '거의 무통 - 본뜨는 과정에서 불편감이 약간 있을 수 있습니다.' },
      { stage: '시적/조정', level: 1, description: '경미한 불편 - 맞지 않는 부분에서 눌리는 느낌이 있을 수 있습니다.' },
      { stage: '적응 기간', level: 2, description: '이물감 - 처음 2~4주간 이물감과 경미한 통점이 있을 수 있습니다.' },
    ],
    faq: [
      { question: '틀니는 밤에 빼야 하나요?', answer: '잇몸 휴식을 위해 취침 시 빼는 것을 권장합니다. 물에 담가 보관하세요.' },
      { question: '틀니 적응 기간은?', answer: '보통 2~4주면 적응됩니다. 이 기간에 여러 차례 조정이 필요할 수 있습니다.' },
      { question: '틀니 수명은 얼마나 되나요?', answer: '5~7년마다 교체를 권장합니다. 잇몸 형태가 변하기 때문입니다.' },
    ],
    cost: {
      range: '약 30만원 ~ 150만원',
      insurance: '만 65세 이상 건강보험 적용 (7년에 1회)',
      factors: ['부분틀니 vs 전체틀니에 따른 차이', '재료(레진/금속)에 따른 차이', '건강보험 적용 시 본인부담 약 30~50만원'],
    },
    caution: {
      before: [{ text: '남아있는 치아 상태를 먼저 치료해야 할 수 있습니다.' }, { text: '예약 일정을 지켜주세요 (여러 차례 내원 필요).' }],
      after: [
        { text: '처음에는 부드러운 음식부터 연습하세요.' },
        { text: '매일 틀니를 빼서 깨끗이 세척하세요.' },
        { text: '취침 시 물에 담가 보관하세요.' },
        { text: '잇몸이 아프면 무리하지 말고 내원하세요.' },
      ],
      revisit: ['잇몸이 아프거나 헐은 경우', '틀니가 흔들리거나 맞지 않는 경우', '6개월~1년 정기 검진'],
    },
  },
};

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

/** Star rating row */
function StarRating({ level, maxLevel = 5 }: { level: number; maxLevel?: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: maxLevel }).map((_, i) => (
        <StarIcon
          key={i}
          size={16}
          color={i < level ? '#FFB800' : '#E0E6ED'}
        />
      ))}
    </div>
  );
}

/** Accordion item */
function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border-light)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-md)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            flex: 1,
            paddingRight: '12px',
          }}
        >
          {question}
        </span>
        <div
          style={{
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <ChevronRightIcon size={18} color="var(--color-text-tertiary)" />
        </div>
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '300px' : '0',
          transition: 'max-height 0.3s ease',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            paddingBottom: '14px',
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tab content renderers
   ───────────────────────────────────────────── */

function ProcessTab({ data }: { data: TreatmentData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* description */}
      <p
        style={{
          fontSize: 'var(--font-md)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        {data.shortDesc}
      </p>

      {/* Steps */}
      <div style={{ position: 'relative' }}>
        {data.steps.map((step, idx) => {
          const isLast = idx === data.steps.length - 1;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 'var(--spacing-lg)',
                paddingBottom: isLast ? 0 : 'var(--spacing-xxl)',
                position: 'relative',
              }}
            >
              {/* Step number + connector line */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Number badge */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-full)',
                    background: data.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-sm)',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                {/* Connector line */}
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: `${data.color}30`,
                      marginTop: '4px',
                    }}
                  />
                )}
              </div>

              {/* Step content card */}
              <Card
                padding="var(--spacing-lg)"
                style={{
                  flex: 1,
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: 'var(--font-base)',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {step.title}
                  </h4>
                  <span
                    style={{
                      fontSize: 'var(--font-xs)',
                      color: data.color,
                      fontWeight: 600,
                      background: `${data.color}14`,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step.time}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </p>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PainTab({ data }: { data: TreatmentData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Pain levels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <h3
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-xs)',
          }}
        >
          단계별 통증 정도
        </h3>
        {data.pain.map((entry, idx) => (
          <Card
            key={idx}
            padding="var(--spacing-lg)"
            style={{
              border: '1px solid var(--color-border-light)',
              boxShadow: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-md)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                {entry.stage}
              </span>
              <StarRating level={entry.level} />
            </div>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              {entry.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Calming text */}
      <Card
        padding="var(--spacing-lg)"
        style={{
          background: 'var(--color-primary-bg)',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
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
            <span style={{ fontSize: '18px' }}>💙</span>
          </div>
          <div>
            <h4
              style={{
                fontSize: 'var(--font-md)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '6px',
              }}
            >
              안심하세요
            </h4>
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
              }}
            >
              {data.calmingText}
            </p>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          자주 묻는 질문
        </h3>
        <Card
          padding="0 var(--spacing-lg)"
          style={{
            border: '1px solid var(--color-border-light)',
            boxShadow: 'none',
          }}
        >
          {data.faq.map((item, idx) => (
            <AccordionItem key={idx} question={item.question} answer={item.answer} />
          ))}
        </Card>
      </div>
    </div>
  );
}

function CostTab({ data }: { data: TreatmentData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Price card */}
      <Card
        padding="var(--spacing-xl)"
        style={{
          background: `linear-gradient(135deg, ${data.color}12, ${data.color}06)`,
          border: `1px solid ${data.color}30`,
          boxShadow: 'none',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: '8px',
          }}
        >
          예상 비용 범위
        </p>
        <p
          style={{
            fontSize: 'var(--font-title)',
            fontWeight: 800,
            color: data.color,
            marginBottom: '12px',
          }}
        >
          {data.cost.range}
        </p>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#E8F5E9',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <CheckIcon size={14} color="var(--color-success)" />
          <span
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--color-success)',
              fontWeight: 600,
            }}
          >
            {data.cost.insurance}
          </span>
        </div>
      </Card>

      {/* Cost factors */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          비용에 영향을 미치는 요인
        </h3>
        <Card
          padding="var(--spacing-lg)"
          style={{
            border: '1px solid var(--color-border-light)',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {data.cost.factors.map((factor, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-md)',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 'var(--radius-full)',
                    background: data.color,
                    marginTop: '7px',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {factor}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card
        padding="var(--spacing-lg)"
        style={{
          background: '#FFF8E1',
          border: '1px solid #FFE082',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
          <p
            style={{
              fontSize: 'var(--font-xs)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            위 비용은 참고용이며, 실제 비용은 치과와 환자 상태에 따라 달라질 수 있습니다. 정확한 비용은 치과 상담 시 확인해주세요.
          </p>
        </div>
      </Card>
    </div>
  );
}

function CautionTab({ data }: { data: TreatmentData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Before treatment */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-bg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
          >
            📋
          </span>
          치료 전 체크리스트
        </h3>
        <Card
          padding="var(--spacing-lg)"
          style={{
            border: '1px solid var(--color-border-light)',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {data.caution.before.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-md)',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  <CheckIcon size={12} color="var(--color-primary)" />
                </div>
                <span
                  style={{
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* After treatment */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 'var(--radius-full)',
              background: '#E8F5E9',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
          >
            💊
          </span>
          치료 후 관리
        </h3>
        <Card
          padding="var(--spacing-lg)"
          style={{
            border: '1px solid var(--color-border-light)',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {data.caution.after.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-md)',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 'var(--radius-full)',
                    background: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  <CheckIcon size={12} color="var(--color-success)" />
                </div>
                <span
                  style={{
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* When to revisit */}
      <div>
        <h3
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 'var(--radius-full)',
              background: '#FFF3E0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
          >
            🏥
          </span>
          이럴 때 다시 내원하세요
        </h3>
        <Card
          padding="var(--spacing-lg)"
          style={{
            border: '1px solid var(--color-warning)',
            background: '#FFFAF0',
            boxShadow: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {data.caution.revisit.map((text, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--spacing-md)',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-warning)',
                    marginTop: '7px',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--font-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page component
   ───────────────────────────────────────────── */

type TabId = 'process' | 'pain' | 'cost' | 'caution';

const tabs: { id: TabId; label: string }[] = [
  { id: 'process', label: '치료과정' },
  { id: 'pain', label: '통증정보' },
  { id: 'cost', label: '비용안내' },
  { id: 'caution', label: '주의사항' },
];

export default function TreatmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<TabId>('process');

  const data = treatmentsData[id];

  if (!data) {
    return (
      <div className="page-container-no-tab">
        <header
          style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            maxWidth: 'var(--max-width)',
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 var(--spacing-lg)',
            background: 'var(--color-background-white)',
            zIndex: 200,
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
            치료 정보
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
          <span style={{ fontSize: '48px' }}>🔍</span>
          <p
            style={{
              fontSize: 'var(--font-lg)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            치료 정보를 찾을 수 없습니다
          </p>
          <p
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            올바른 치료 유형을 선택해주세요.
          </p>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'process':
        return <ProcessTab data={data} />;
      case 'pain':
        return <PainTab data={data} />;
      case 'cost':
        return <CostTab data={data} />;
      case 'caution':
        return <CautionTab data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container-no-tab">
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
          gap: '12px',
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
          {data.name}
        </h1>
      </header>

      {/* Hero area */}
      <div
        style={{
          padding: 'var(--spacing-xl)',
          paddingBottom: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-lg)',
            background: `${data.color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            flexShrink: 0,
          }}
        >
          {data.emoji}
        </div>
        <div>
          <h2
            style={{
              fontSize: 'var(--font-xl)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              marginBottom: '4px',
            }}
          >
            {data.name}
          </h2>
          <p
            style={{
              fontSize: 'var(--font-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5,
            }}
          >
            {data.shortDesc}
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border-light)',
          padding: '0 var(--spacing-xl)',
          marginTop: 'var(--spacing-xl)',
          position: 'sticky',
          top: 'var(--header-height)',
          background: 'var(--color-background-white)',
          zIndex: 100,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 0',
                fontSize: 'var(--font-md)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? `2.5px solid var(--color-primary)` : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ padding: 'var(--spacing-xl)', paddingBottom: '40px' }}>
        {renderTab()}
      </div>
    </div>
  );
}
