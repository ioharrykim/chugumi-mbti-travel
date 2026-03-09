import { AXES, AXIS_LABELS } from '@/lib/constants';
import { Answer, Axis, GrowthTip, MbtiComparisonRow } from '@/lib/types';

const FIRST_LETTER: Record<Axis, string> = { EI: 'E', SN: 'S', TF: 'T', JP: 'J' };
const SECOND_LETTER: Record<Axis, string> = { EI: 'I', SN: 'N', TF: 'F', JP: 'P' };

export function calculateChugumiMbti(answers: Answer[]): string {
  const counts: Record<Axis, Record<string, number>> = {
    EI: { E: 0, I: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };

  answers.forEach(({ axis, value }) => {
    counts[axis][value] += 1;
  });

  return AXES.map((axis) => {
    const first = FIRST_LETTER[axis];
    const second = SECOND_LETTER[axis];
    return counts[axis][first] >= 2 ? first : second;
  }).join('');
}

export function compareMbti(actual: string, chugumi: string): MbtiComparisonRow[] {
  return AXES.map((axis, index) => ({
    axis,
    label: AXIS_LABELS[axis],
    actual: actual[index] ?? '-',
    chugumi: chugumi[index] ?? '-',
    changed: actual[index] !== chugumi[index],
  }));
}

export function getMatchRate(actual: string, chugumi: string): number {
  if (!actual || !chugumi) return 0;
  const matched = actual.split('').filter((letter, index) => letter === chugumi[index]).length;
  return Math.round((matched / 4) * 100);
}

export function getGrowthDirections(actual: string, chugumi: string): string[] {
  return actual
    .split('')
    .map((letter, index) => (letter !== chugumi[index] ? `${letter}→${chugumi[index]}` : null))
    .filter((value): value is string => Boolean(value));
}

export function getRelevantGrowthTips(actual: string, chugumi: string, growthTips: GrowthTip[]) {
  const directions = new Set(getGrowthDirections(actual, chugumi));
  return growthTips.filter((tip) => directions.has(tip.direction));
}

export function getMatchMessage(rate: number) {
  if (rate === 100) return '이미 당신은 추구미 여행자 그 자체. 현실과 이상이 완전히 합쳐졌습니다.';
  if (rate >= 75) return '원래 기질 위에 살짝 다른 결을 더하고 싶어 하는 타입입니다.';
  if (rate >= 50) return '현실의 나와 추구미의 나가 반반 섞인, 가장 드라마틱한 여행 서사를 가진 조합입니다.';
  return '이번 여행에서는 평소와 다른 캐릭터를 제대로 꺼내보고 싶은 마음이 강하게 보입니다.';
}
