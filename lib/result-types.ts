import { ResultType } from '@/lib/types';

export function normalizeMbtiCode(value: string) {
  return value.trim().toUpperCase();
}

export function getResultTypeByCode(resultTypes: ResultType[], mbtiCode: string) {
  const normalized = normalizeMbtiCode(mbtiCode);
  return resultTypes.find((item) => item.mbti_code === normalized) ?? null;
}

export function getDescriptionLead(description: string) {
  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean) ?? '';
}
