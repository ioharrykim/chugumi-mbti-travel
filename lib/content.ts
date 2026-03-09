import { SupabaseClient } from '@supabase/supabase-js';

import {
  DEFAULT_GROWTH_TIPS,
  DEFAULT_INTRO_CONTENT,
  DEFAULT_QUESTIONS,
  DEFAULT_RESULT_TYPES,
  RESULT_BRIEF_EXPANSIONS,
} from '@/lib/constants';
import { CmsData, GrowthTip, IntroContentMap, IntroContentRow, Question, ResultType } from '@/lib/types';

export const defaultCmsData: CmsData = {
  introContent: DEFAULT_INTRO_CONTENT,
  introRows: mergeIntroRows([]),
  questions: DEFAULT_QUESTIONS,
  resultTypes: mergeResultTypes([]),
  growthTips: mergeGrowthTips([]),
};

const LEGACY_AXIS_SEQUENCE: Question['axis'][] = ['EI', 'EI', 'EI', 'SN', 'SN', 'SN', 'TF', 'TF', 'TF', 'JP', 'JP', 'JP'];
const LEGACY_TIMELINE_ORDER = [4, 12, 1, 2, 5, 6, 8, 3, 7, 9, 11, 10];

function introRowsToMap(rows: IntroContentRow[]) {
  return rows.reduce<IntroContentMap>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, { ...DEFAULT_INTRO_CONTENT });
}

export function parseCmsBoolean(value: string | undefined, fallback = false) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return fallback;
  if (['true', '1', 'on', 'yes'].includes(normalized)) return true;
  if (['false', '0', 'off', 'no'].includes(normalized)) return false;

  return fallback;
}

function mergeIntroRows(rows: IntroContentRow[]) {
  const rowMap = new Map(rows.map((row) => [row.key, row]));

  return (Object.entries(DEFAULT_INTRO_CONTENT) as [keyof IntroContentMap, string][])
    .map(([key, value]) => rowMap.get(key) ?? { key, value });
}

function normalizeQuestions(rows: Question[]) {
  const sorted = [...rows].sort((left, right) => left.sort_order - right.sort_order);
  const looksLikeLegacyAxisOrder =
    sorted.length === LEGACY_AXIS_SEQUENCE.length &&
    sorted.every((question, index) => question.sort_order === index + 1 && question.axis === LEGACY_AXIS_SEQUENCE[index]);

  if (!looksLikeLegacyAxisOrder) {
    return sorted;
  }

  const questionMap = new Map(sorted.map((question) => [question.sort_order, question]));

  return LEGACY_TIMELINE_ORDER.map((legacySortOrder, index) => ({
    ...questionMap.get(legacySortOrder)!,
    sort_order: index + 1,
  }));
}

function normalizeResultDescription(mbtiCode: string, description: string) {
  const normalized = description.trim();
  const expansion = RESULT_BRIEF_EXPANSIONS[mbtiCode];

  if (!normalized || !expansion) {
    return normalized;
  }

  if (normalized.includes(expansion) || /\n\s*\n/.test(normalized)) {
    return normalized;
  }

  return `${normalized}\n\n${expansion}`;
}

function mergeResultTypes(rows: ResultType[]) {
  const rowMap = new Map(rows.map((row) => [row.mbti_code, row]));

  return [...DEFAULT_RESULT_TYPES].map((defaultType) => {
    const existing = rowMap.get(defaultType.mbti_code);
    const merged = existing ? { ...defaultType, ...existing } : defaultType;

    return {
      ...merged,
      description: normalizeResultDescription(merged.mbti_code, merged.description),
    };
  });
}

function mergeGrowthTips(rows: GrowthTip[]) {
  const rowMap = new Map(rows.map((row) => [row.direction, row]));

  return [...DEFAULT_GROWTH_TIPS].map((defaultTip) => rowMap.get(defaultTip.direction) ?? defaultTip);
}

export async function fetchCmsData(client: SupabaseClient): Promise<CmsData> {
  const [introRes, questionRes, resultRes, tipRes] = await Promise.all([
    client.from('intro_content').select('*').order('key'),
    client.from('questions').select('*').order('sort_order'),
    client.from('result_types').select('*').order('mbti_code'),
    client.from('growth_tips').select('*').order('direction'),
  ]);

  if (introRes.error || questionRes.error || resultRes.error || tipRes.error) {
    return defaultCmsData;
  }

  const introRows = mergeIntroRows((introRes.data as IntroContentRow[] | null) ?? []);
  const questions = ((questionRes.data as Question[] | null) ?? []).length
    ? normalizeQuestions(questionRes.data as Question[])
    : defaultCmsData.questions;
  const resultTypes = mergeResultTypes((resultRes.data as ResultType[] | null) ?? []);
  const growthTips = ((tipRes.data as GrowthTip[] | null) ?? []).length
    ? mergeGrowthTips(tipRes.data as GrowthTip[])
    : defaultCmsData.growthTips;

  return {
    introContent: introRowsToMap(introRows),
    introRows,
    questions,
    resultTypes,
    growthTips,
  };
}

export async function fetchIntroContentValue(client: SupabaseClient, key: keyof IntroContentMap) {
  const { data, error } = await client.from('intro_content').select('value').eq('key', key).maybeSingle();

  if (error || !data?.value) {
    return DEFAULT_INTRO_CONTENT[key];
  }

  return data.value;
}

export async function seedDefaultCmsData(client: SupabaseClient) {
  await client.from('intro_content').upsert(defaultCmsData.introRows, { onConflict: 'key' });
  await client.from('questions').upsert(defaultCmsData.questions, { onConflict: 'sort_order' });
  await client.from('result_types').upsert(defaultCmsData.resultTypes, { onConflict: 'mbti_code' });
  await client.from('growth_tips').upsert(defaultCmsData.growthTips, { onConflict: 'direction' });
}
