export type Axis = 'EI' | 'SN' | 'TF' | 'JP';
export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type ScreenStep = 'intro' | 'passport' | 'questions' | 'result';

export interface IntroContentMap {
  mainTitle: string;
  subTitle: string;
  heroEmoji: string;
  description: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  startBtn: string;
  duration: string;
  passportTitle: string;
  passportSub: string;
  passportJoke: string;
  passportBtn: string;
  questionHint: string;
  questionPrevBtn: string;
  questionNextBtn: string;
  questionResultBtn: string;
  adsEnabled: string;
}

export interface IntroContentRow {
  id?: string;
  key: keyof IntroContentMap;
  value: string;
  updated_at?: string;
}

export interface Question {
  id?: string;
  sort_order: number;
  axis: Axis;
  emoji: string;
  text: string;
  a_label: string;
  a_value: MbtiLetter;
  b_label: string;
  b_value: MbtiLetter;
  updated_at?: string;
}

export interface ResultType {
  id?: string;
  mbti_code: string;
  emoji: string;
  title: string;
  sub: string;
  description: string;
  hashtags: string;
  updated_at?: string;
}

export interface GrowthTip {
  id?: string;
  direction: string;
  icon: string;
  title: string;
  tips: string;
  updated_at?: string;
}

export interface Answer {
  axis: Axis;
  value: MbtiLetter;
}

export interface CmsData {
  introContent: IntroContentMap;
  introRows: IntroContentRow[];
  questions: Question[];
  resultTypes: ResultType[];
  growthTips: GrowthTip[];
}

export interface MbtiComparisonRow {
  axis: Axis;
  label: string;
  actual: string;
  chugumi: string;
  changed: boolean;
}
